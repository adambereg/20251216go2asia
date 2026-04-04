#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { createClerkClient } from '@clerk/backend';
import pg from 'pg';
import { mintClerkJwtForUser } from '../../../scripts/lib/clerk_test_tokens.mjs';

const { Client } = pg;

const CANONICAL_ROLES = new Set(['spacer', 'vip_spacer', 'pro', 'admin']);

function usage() {
  console.log(`
Usage:
  node apps/api-gateway/scripts/identity_materialize_verify_batch.mjs [options]

Options:
  --csv <path>             CSV file path (default: ../../docs/templates/identity_seed_users_template_v1.csv)
  --api-base <url>         Gateway base URL (default: env API_BASE)
  --limit <n>              Process first N rows after filters
  --seed-key <value>       Process only this seed_key (repeatable)
  --email <value>          Process only this email (repeatable)
  --dry-run                No side effects (skip users/ensure write calls)
  --materialize-only       Only materialize users, skip DB verification
  --verify-only            Only DB verification (still resolves Clerk users)
  --debug                  Extended diagnostics (safe, no secrets/tokens)
  --help, -h               Show help

Environment:
  CLERK_SECRET_KEY         Required for Clerk admin API
  CLERK_INSTANCE_URL       Required for materialization (session/token mint)
  API_BASE                 Required for materialization (if --api-base not provided)
  STAGING_DATABASE_URL     Preferred for verification
  DATABASE_URL             Fallback DB URL for verification
`);
}

function parseArgs(argv) {
  const args = {
    csv: '../../docs/templates/identity_seed_users_template_v1.csv',
    apiBase: process.env.API_BASE || '',
    limit: null,
    seedKeys: [],
    emails: [],
    dryRun: false,
    materializeOnly: false,
    verifyOnly: false,
    debug: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--csv') {
      args.csv = argv[i + 1] ?? '';
      i += 1;
      continue;
    }
    if (token === '--api-base') {
      args.apiBase = argv[i + 1] ?? '';
      i += 1;
      continue;
    }
    if (token === '--limit') {
      args.limit = Number.parseInt(argv[i + 1] ?? '', 10);
      i += 1;
      continue;
    }
    if (token === '--seed-key') {
      args.seedKeys.push((argv[i + 1] ?? '').trim());
      i += 1;
      continue;
    }
    if (token === '--email') {
      args.emails.push((argv[i + 1] ?? '').trim().toLowerCase());
      i += 1;
      continue;
    }
    if (token === '--dry-run') {
      args.dryRun = true;
      continue;
    }
    if (token === '--materialize-only') {
      args.materializeOnly = true;
      continue;
    }
    if (token === '--verify-only') {
      args.verifyOnly = true;
      continue;
    }
    if (token === '--debug') {
      args.debug = true;
      continue;
    }
    if (token === '--help' || token === '-h') {
      usage();
      process.exit(0);
    }
    throw new Error(`Unknown argument: ${token}`);
  }

  if (args.materializeOnly && args.verifyOnly) {
    throw new Error('Use either --materialize-only or --verify-only, not both');
  }
  if (args.limit != null && (!Number.isFinite(args.limit) || args.limit <= 0)) {
    throw new Error('--limit must be a positive integer');
  }
  if (!args.csv) {
    throw new Error('Missing --csv path');
  }

  return args;
}

function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
      continue;
    }
    current += ch;
  }
  result.push(current);
  return result.map((v) => v.trim());
}

function toRecord(headers, values) {
  const out = {};
  for (let i = 0; i < headers.length; i += 1) {
    out[headers[i]] = values[i] ?? '';
  }
  return out;
}

async function readSeedCsv(csvPath) {
  const raw = await fs.readFile(csvPath, 'utf8');
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length < 2) {
    throw new Error(`CSV has no rows: ${csvPath}`);
  }

  const headers = parseCsvLine(lines[0]);
  const required = ['seed_key', 'email', 'platform_role'];
  const missing = required.filter((col) => !headers.includes(col));
  if (missing.length > 0) {
    throw new Error(`CSV missing required columns: ${missing.join(', ')}`);
  }

  return lines.slice(1).map((line, index) => {
    const row = toRecord(headers, parseCsvLine(line));
    row.__line = String(index + 2);
    row.email = row.email.trim().toLowerCase();
    row.platform_role = row.platform_role.trim();
    return row;
  });
}

function validateRows(rows) {
  const errors = [];
  for (const row of rows) {
    if (!row.seed_key) {
      errors.push(`line ${row.__line}: seed_key is empty`);
    }
    if (!row.email || !row.email.includes('@')) {
      errors.push(`line ${row.__line}: email is invalid`);
    }
    if (!CANONICAL_ROLES.has(row.platform_role)) {
      errors.push(`line ${row.__line}: platform_role must be one of ${Array.from(CANONICAL_ROLES).join('|')}`);
    }
  }
  return errors;
}

function safeJson(value) {
  const seen = new WeakSet();
  return JSON.stringify(
    value,
    (_, item) => {
      if (typeof item === 'bigint') return String(item);
      if (item && typeof item === 'object') {
        if (seen.has(item)) return '[Circular]';
        seen.add(item);
      }
      return item;
    },
    2,
  );
}

function summarizeEnsureResponse(json, text, status) {
  if (json && typeof json === 'object') {
    const user = json.user && typeof json.user === 'object' ? json.user : null;
    return {
      ok: Boolean(json.ok),
      code: json?.error?.code ?? null,
      message: json?.error?.message ?? null,
      userId: user?.id ?? null,
      userRole: user?.role ?? null,
      requestId: json?.requestId ?? null,
    };
  }
  return {
    ok: status >= 200 && status < 300,
    code: null,
    message: text ? text.slice(0, 240) : null,
    userId: null,
    userRole: null,
    requestId: null,
  };
}

function normalizeApiBase(value) {
  const raw = (value || '').trim();
  if (!raw) return '';
  return raw.endsWith('/') ? raw.slice(0, -1) : raw;
}

function getDbUrl() {
  return (process.env.STAGING_DATABASE_URL || process.env.DATABASE_URL || '').trim();
}

async function resolveClerkUser(clerk, email) {
  const response = await clerk.users.getUserList({
    emailAddress: [email],
    limit: 2,
  });
  const users = response?.data || [];
  if (!users.length) {
    return { ok: false, error: `User not found in Clerk by email: ${email}` };
  }
  if (users.length > 1) {
    return { ok: false, error: `Multiple Clerk users found by email: ${email}` };
  }
  return { ok: true, user: users[0] };
}

async function materializeSingleUser({ row, userId, apiBase, debug }) {
  const jwt = await mintClerkJwtForUser(userId);
  const url = `${apiBase}/v1/users/ensure`;
  const body = { email: row.email };

  if (debug) {
    console.error(
      safeJson({
        kind: 'identity_materialize_debug',
        seed_key: row.seed_key,
        email: row.email,
        platform_role: row.platform_role,
        endpoint: '/v1/users/ensure',
        body,
      }),
    );
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${jwt}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  const summary = summarizeEnsureResponse(json, text, response.status);
  return {
    httpStatus: response.status,
    summary,
  };
}

async function runVerification(rows, dbUrl, debug) {
  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  try {
    const emails = rows.map((row) => row.email);
    const result = await client.query(
      `
      SELECT id, clerk_id, email, role
      FROM users
      WHERE lower(email) = ANY($1::text[])
      `,
      [emails],
    );
    const byEmail = new Map(result.rows.map((entry) => [String(entry.email).toLowerCase(), entry]));

    return rows.map((row) => {
      const dbRow = byEmail.get(row.email) ?? null;
      const reasons = [];
      if (!dbRow) {
        reasons.push('missing_in_users_table');
      } else {
        if (!CANONICAL_ROLES.has(dbRow.role)) {
          reasons.push(`non_canonical_role:${dbRow.role}`);
        }
        if (dbRow.role !== row.platform_role) {
          reasons.push(`role_mismatch:expected=${row.platform_role},actual=${dbRow.role}`);
        }
        if (String(dbRow.email).toLowerCase() !== row.email) {
          reasons.push(`email_mismatch:expected=${row.email},actual=${dbRow.email}`);
        }
        if (!row.expectedSub) {
          reasons.push('missing_expected_sub_from_clerk');
        } else {
          if (dbRow.id !== row.expectedSub) {
            reasons.push(`id_mismatch:expected=${row.expectedSub},actual=${dbRow.id}`);
          }
          if (dbRow.clerk_id !== row.expectedSub) {
            reasons.push(`clerk_id_mismatch:expected=${row.expectedSub},actual=${dbRow.clerk_id}`);
          }
          if (dbRow.id !== dbRow.clerk_id) {
            reasons.push(`id_not_equal_clerk_id:id=${dbRow.id},clerk_id=${dbRow.clerk_id}`);
          }
        }
      }

      const pass = reasons.length === 0;
      if (debug && !pass) {
        console.error(
          safeJson({
            kind: 'identity_verify_debug',
            seed_key: row.seed_key,
            email: row.email,
            expectedSub: row.expectedSub ?? null,
            dbRow,
            reasons,
          }),
        );
      }
      return {
        seed_key: row.seed_key,
        email: row.email,
        platform_role: row.platform_role,
        verification: pass ? 'passed' : 'failed',
        reasons,
        dbRow,
      };
    });
  } finally {
    await client.end();
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const csvPath = path.resolve(process.cwd(), args.csv);
  const allRows = await readSeedCsv(csvPath);

  const seedFilter = new Set(args.seedKeys.filter(Boolean));
  const emailFilter = new Set(args.emails.filter(Boolean));
  let rows = allRows.filter((row) => {
    if (seedFilter.size > 0 && !seedFilter.has(row.seed_key)) return false;
    if (emailFilter.size > 0 && !emailFilter.has(row.email)) return false;
    return true;
  });
  if (args.limit) {
    rows = rows.slice(0, args.limit);
  }

  if (rows.length === 0) {
    throw new Error('No rows selected after filters');
  }

  const validationErrors = validateRows(rows);
  if (validationErrors.length > 0) {
    console.error('Validation failed:');
    for (const issue of validationErrors) {
      console.error(`- ${issue}`);
    }
    process.exit(1);
  }

  const secretKey = (process.env.CLERK_SECRET_KEY || '').trim();
  if (!secretKey) {
    throw new Error('Missing env: CLERK_SECRET_KEY');
  }

  const doMaterialize = !args.verifyOnly;
  const doVerify = !args.materializeOnly;
  const apiBase = normalizeApiBase(args.apiBase);

  if (doMaterialize && !args.dryRun) {
    if (!(process.env.CLERK_INSTANCE_URL || '').trim()) {
      throw new Error('Missing env: CLERK_INSTANCE_URL (required for session/token mint)');
    }
    if (!apiBase) {
      throw new Error('Missing API base URL (--api-base or env API_BASE)');
    }
  }

  const clerk = createClerkClient({ secretKey });
  const materializationRows = [];
  for (const row of rows) {
    const resolved = await resolveClerkUser(clerk, row.email).catch((error) => ({ ok: false, error: error.message }));
    if (!resolved.ok) {
      materializationRows.push({
        seed_key: row.seed_key,
        email: row.email,
        platform_role: row.platform_role,
        expectedSub: null,
        materialization_status: 'failed',
        httpStatus: null,
        response_summary: resolved.error,
        error: resolved.error,
      });
      console.error(`failed          ${row.seed_key} ${row.email} (lookup_clerk_user)`);
      continue;
    }

    row.expectedSub = resolved.user.id;

    if (!doMaterialize) {
      materializationRows.push({
        seed_key: row.seed_key,
        email: row.email,
        platform_role: row.platform_role,
        expectedSub: row.expectedSub,
        materialization_status: 'skipped',
        httpStatus: null,
        response_summary: 'materialization skipped (--verify-only)',
        error: null,
      });
      console.log(`skipped         ${row.seed_key} ${row.email} (${row.platform_role})`);
      continue;
    }

    if (args.dryRun) {
      materializationRows.push({
        seed_key: row.seed_key,
        email: row.email,
        platform_role: row.platform_role,
        expectedSub: row.expectedSub,
        materialization_status: 'materialized',
        httpStatus: 0,
        response_summary: 'dry-run (users/ensure not called)',
        error: null,
      });
      console.log(`dry-run         ${row.seed_key} ${row.email} (${row.platform_role})`);
      continue;
    }

    try {
      const result = await materializeSingleUser({
        row,
        userId: row.expectedSub,
        apiBase,
        debug: args.debug,
      });
      const ok = result.httpStatus === 200 && result.summary.ok === true;
      materializationRows.push({
        seed_key: row.seed_key,
        email: row.email,
        platform_role: row.platform_role,
        expectedSub: row.expectedSub,
        materialization_status: ok ? 'materialized' : 'failed',
        httpStatus: result.httpStatus,
        response_summary: result.summary,
        error: ok ? null : result.summary.message ?? 'users/ensure returned non-success',
      });
      console.log(`${ok ? 'materialized' : 'failed'.padEnd(15)} ${row.seed_key} ${row.email} (${row.platform_role})`);
      if (!ok && args.debug) {
        console.error(
          safeJson({
            kind: 'identity_materialize_failure',
            seed_key: row.seed_key,
            email: row.email,
            platform_role: row.platform_role,
            httpStatus: result.httpStatus,
            response_summary: result.summary,
          }),
        );
      }
    } catch (error) {
      materializationRows.push({
        seed_key: row.seed_key,
        email: row.email,
        platform_role: row.platform_role,
        expectedSub: row.expectedSub,
        materialization_status: 'failed',
        httpStatus: null,
        response_summary: null,
        error: error.message,
      });
      console.error(`failed          ${row.seed_key} ${row.email} (${row.platform_role})`);
      if (args.debug) {
        console.error(
          safeJson({
            kind: 'identity_materialize_exception',
            seed_key: row.seed_key,
            email: row.email,
            platform_role: row.platform_role,
            error: error.message,
          }),
        );
      }
    }
  }

  let verificationRows = [];
  if (doVerify) {
    const dbUrl = getDbUrl();
    if (!dbUrl) {
      throw new Error('Missing STAGING_DATABASE_URL or DATABASE_URL for verification');
    }
    verificationRows = await runVerification(rows, dbUrl, args.debug);
  }

  const materializedCount = materializationRows.filter((row) => row.materialization_status === 'materialized').length;
  const materializeFailedCount = materializationRows.filter((row) => row.materialization_status === 'failed').length;
  const verifyPassedCount = verificationRows.filter((row) => row.verification === 'passed').length;
  const verifyFailedCount = verificationRows.filter((row) => row.verification === 'failed').length;

  console.log('\nMaterialization summary:');
  console.log(`Processed: ${materializationRows.length}`);
  console.log(`- materialized: ${materializedCount}`);
  console.log(`- failed: ${materializeFailedCount}`);

  if (doVerify) {
    console.log('\nVerification summary:');
    console.log(`- passed: ${verifyPassedCount}`);
    console.log(`- failed: ${verifyFailedCount}`);
  }

  if (materializeFailedCount > 0) {
    console.log('\nMaterialization failed rows:');
    for (const row of materializationRows.filter((entry) => entry.materialization_status === 'failed')) {
      console.log(`- ${row.seed_key} | ${row.email} | status=${row.httpStatus ?? 'n/a'} | ${row.error ?? 'unknown_error'}`);
    }
  }

  if (verifyFailedCount > 0) {
    console.log('\nVerification failed rows:');
    for (const row of verificationRows.filter((entry) => entry.verification === 'failed')) {
      console.log(`- ${row.seed_key} | ${row.email} | ${row.reasons.join('; ')}`);
    }
  }

  const shouldFail = materializeFailedCount > 0 || verifyFailedCount > 0;
  if (shouldFail) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
});

