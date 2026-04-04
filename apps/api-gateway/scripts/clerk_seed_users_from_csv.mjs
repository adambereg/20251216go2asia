#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { createClerkClient } from '@clerk/backend';

const ALLOWED_ROLES = new Set(['spacer', 'vip_spacer', 'pro', 'admin']);

function printUsage() {
  console.log(`
Usage:
  node apps/api-gateway/scripts/clerk_seed_users_from_csv.mjs --csv <path> [options]

Required:
  --csv <path>                 Path to CSV (identity_seed_users_template_v1 format)

Options:
  --limit <n>                  Process first N users (default: all)
  --default-password <value>   Set same password for all created users
  --dry-run                    Validate/preview only, do not call Clerk API
  --no-update-existing         Skip metadata updates for existing users
  --debug                      Print extended per-user diagnostics (safe/sanitized)

Environment:
  CLERK_SECRET_KEY             Clerk secret key (required unless --dry-run)
`);
}

function parseArgs(argv) {
  const args = {
    csv: '',
    limit: null,
    defaultPassword: '',
    dryRun: false,
    updateExisting: true,
    debug: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--csv') {
      args.csv = argv[i + 1] ?? '';
      i += 1;
      continue;
    }
    if (token === '--limit') {
      const raw = argv[i + 1] ?? '';
      args.limit = Number.parseInt(raw, 10);
      i += 1;
      continue;
    }
    if (token === '--default-password') {
      args.defaultPassword = argv[i + 1] ?? '';
      i += 1;
      continue;
    }
    if (token === '--dry-run') {
      args.dryRun = true;
      continue;
    }
    if (token === '--no-update-existing') {
      args.updateExisting = false;
      continue;
    }
    if (token === '--debug') {
      args.debug = true;
      continue;
    }
    if (token === '--help' || token === '-h') {
      printUsage();
      process.exit(0);
    }
    throw new Error(`Unknown argument: ${token}`);
  }

  if (!args.csv) {
    throw new Error('Missing required --csv argument');
  }

  if (args.limit != null && (!Number.isFinite(args.limit) || args.limit <= 0)) {
    throw new Error('--limit must be a positive integer');
  }

  return args;
}

function safeJsonStringify(value) {
  const seen = new WeakSet();
  return JSON.stringify(
    value,
    (key, item) => {
      if (typeof item === 'bigint') {
        return String(item);
      }
      if (item && typeof item === 'object') {
        if (seen.has(item)) return '[Circular]';
        seen.add(item);
      }
      if (item instanceof Error) {
        return {
          name: item.name,
          message: item.message,
          stack: item.stack,
        };
      }
      return item;
    },
    2,
  );
}

function sanitizeForLog(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => sanitizeForLog(entry));
  }
  if (!value || typeof value !== 'object') {
    return value;
  }

  const sensitiveKeys = new Set([
    'password',
    'secret',
    'secretKey',
    'clerk_secret_key',
    'apiKey',
    'api_key',
    'token',
    'accessToken',
    'access_token',
  ]);

  const output = {};
  for (const [key, raw] of Object.entries(value)) {
    if (sensitiveKeys.has(key)) {
      output[key] = '[REDACTED]';
      continue;
    }
    output[key] = sanitizeForLog(raw);
  }
  return output;
}

function debugLogPayload({ debug, phase, row, payload }) {
  if (!debug) return;
  const diagnostic = {
    kind: 'clerk_seed_debug_payload',
    seed_key: row.seed_key,
    line: row.__line,
    email: row.email,
    platform_role: row.platform_role,
    action: phase,
    payload: sanitizeForLog(payload),
  };
  console.error(safeJsonStringify(diagnostic));
}

function normalizeClerkErrorItem(rawItem) {
  if (!rawItem || typeof rawItem !== 'object') {
    return null;
  }
  const item = rawItem;
  return {
    code: item.code ?? item.errorCode ?? null,
    message: item.message ?? item.shortMessage ?? null,
    longMessage: item.longMessage ?? item.long_message ?? null,
    meta: item.meta && typeof item.meta === 'object' ? item.meta : item.meta != null ? { _raw: item.meta } : null,
  };
}

function extractClerkFailureDetails(error) {
  const err = error || {};
  const payloadCandidates = [err.data, err.response?.data, err.response?.body, err.body, err.error];
  const payload = payloadCandidates.find((candidate) => candidate && typeof candidate === 'object') || {};
  const rawErrors =
    err.errors ??
    err.clerkErrors ??
    payload.errors ??
    payload.clerkErrors ??
    err.response?.errors ??
    [];
  const normalizedErrors = Array.isArray(rawErrors)
    ? rawErrors.map((item) => normalizeClerkErrorItem(item)).filter(Boolean)
    : [];

  const httpStatus = err.status ?? err.statusCode ?? err.response?.status ?? err.response?.statusCode ?? null;
  const clerkTraceId = err.clerkTraceId ?? err.clerk_trace_id ?? payload.clerkTraceId ?? payload.clerk_trace_id ?? null;

  return {
    httpStatus,
    clerkTraceId,
    message: err.message ?? payload.message ?? 'Unknown Clerk error',
    code: err.code ?? payload.code ?? null,
    longMessage: err.longMessage ?? err.long_message ?? payload.longMessage ?? payload.long_message ?? null,
    meta: err.meta ?? payload.meta ?? null,
    errors: normalizedErrors,
    raw: sanitizeForLog({
      name: err.name,
      message: err.message,
      status: httpStatus,
      code: err.code,
      clerkTraceId,
      errors: rawErrors,
      data: payload,
    }),
  };
}

function formatFailureDiagnostic({ row, action, details }) {
  return {
    kind: 'clerk_seed_row_failure',
    line: row.__line,
    seed_key: row.seed_key,
    email: row.email,
    platform_role: row.platform_role,
    action,
    httpStatus: details.httpStatus ?? null,
    message: details.message ?? null,
    code: details.code ?? null,
    longMessage: details.longMessage ?? null,
    clerkTraceId: details.clerkTraceId ?? null,
    meta: details.meta ?? null,
    errors: details.errors ?? [],
  };
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

function toRecord(headers, cells) {
  const record = {};
  for (let i = 0; i < headers.length; i += 1) {
    record[headers[i]] = cells[i] ?? '';
  }
  return record;
}

function normalizeBool(value) {
  const v = String(value ?? '').trim().toLowerCase();
  return v === 'yes' || v === 'true' || v === '1';
}

async function readCsv(csvPath) {
  const raw = await fs.readFile(csvPath, 'utf8');
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 2) {
    throw new Error('CSV has no data rows');
  }

  const headers = parseCsvLine(lines[0]);
  const requiredColumns = [
    'seed_key',
    'email',
    'platform_role',
    'clerk_external_id_hint',
    'must_materialize_via_users_ensure',
    'display_name',
    'space_role_label_hint',
    'rf_owner_candidate',
    'rf_pro_candidate',
    'notes',
  ];

  const missing = requiredColumns.filter((column) => !headers.includes(column));
  if (missing.length > 0) {
    throw new Error(`CSV missing required columns: ${missing.join(', ')}`);
  }

  return lines.slice(1).map((line, index) => {
    const row = toRecord(headers, parseCsvLine(line));
    row.__line = String(index + 2);
    return row;
  });
}

function validateRow(row) {
  const issues = [];
  if (!row.seed_key) issues.push('seed_key is empty');
  if (!row.email || !row.email.includes('@')) issues.push('email is invalid');
  if (!ALLOWED_ROLES.has(row.platform_role)) {
    issues.push(`platform_role must be one of: ${Array.from(ALLOWED_ROLES).join('|')}`);
  }
  return issues;
}

async function ensureUser({ clerk, row, defaultPassword, dryRun, updateExisting, debug }) {
  const email = row.email.trim().toLowerCase();
  const role = row.platform_role.trim();
  const externalId = row.clerk_external_id_hint?.trim() || undefined;
  const displayName = row.display_name?.trim() || undefined;

  const metadataPatch = {
    role,
    seedKey: row.seed_key,
    roleLabelHint: row.space_role_label_hint || undefined,
    rfOwnerCandidate: normalizeBool(row.rf_owner_candidate),
    rfProCandidate: normalizeBool(row.rf_pro_candidate),
    mustMaterializeViaUsersEnsure: normalizeBool(row.must_materialize_via_users_ensure),
    notes: row.notes || undefined,
  };

  if (dryRun) {
    return { action: 'preview', email, role };
  }

  let existing;
  try {
    existing = await clerk.users.getUserList({
      emailAddress: [email],
      limit: 1,
    });
  } catch (error) {
    const details = extractClerkFailureDetails(error);
    const enhanced = new Error(`Lookup failed for ${email}: ${details.message}`);
    enhanced.details = details;
    enhanced.row = row;
    enhanced.action = 'lookup';
    throw enhanced;
  }

  const existingUser = existing?.data?.[0];
  if (existingUser) {
    if (updateExisting) {
      const updatePayload = {
        externalId: externalId ?? existingUser.externalId ?? undefined,
        firstName: displayName ?? existingUser.firstName ?? undefined,
        publicMetadata: metadataPatch,
      };
      debugLogPayload({ debug, phase: 'update', row, payload: updatePayload });
      try {
        await clerk.users.updateUser(existingUser.id, updatePayload);
      } catch (error) {
        const details = extractClerkFailureDetails(error);
        const enhanced = new Error(`Update failed for ${email}: ${details.message}`);
        enhanced.details = details;
        enhanced.row = row;
        enhanced.action = 'update';
        throw enhanced;
      }
      return { action: 'updated', email, userId: existingUser.id, role };
    }
    return { action: 'skipped-existing', email, userId: existingUser.id, role };
  }

  const createPayload = {
    emailAddress: [email],
    externalId,
    firstName: displayName,
    publicMetadata: metadataPatch,
  };

  if (defaultPassword) {
    createPayload.password = defaultPassword;
  } else {
    createPayload.skipPasswordRequirement = true;
    createPayload.skipPasswordChecks = true;
  }

  debugLogPayload({ debug, phase: 'create', row, payload: createPayload });
  let created;
  try {
    created = await clerk.users.createUser(createPayload);
  } catch (error) {
    const details = extractClerkFailureDetails(error);
    const enhanced = new Error(`Create failed for ${email}: ${details.message}`);
    enhanced.details = details;
    enhanced.row = row;
    enhanced.action = 'create';
    throw enhanced;
  }
  return { action: 'created', email, userId: created.id, role };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const csvPath = path.resolve(process.cwd(), args.csv);
  const rows = await readCsv(csvPath);
  const selectedRows = args.limit ? rows.slice(0, args.limit) : rows;

  const invalidRows = [];
  for (const row of selectedRows) {
    const issues = validateRow(row);
    if (issues.length > 0) {
      invalidRows.push({ line: row.__line, seedKey: row.seed_key, issues });
    }
  }

  if (invalidRows.length > 0) {
    console.error('Validation failed:');
    for (const entry of invalidRows) {
      console.error(`- line ${entry.line} (${entry.seedKey || 'n/a'}): ${entry.issues.join('; ')}`);
    }
    process.exit(1);
  }

  if (!args.dryRun && !process.env.CLERK_SECRET_KEY) {
    throw new Error('CLERK_SECRET_KEY is required (or use --dry-run)');
  }

  const clerk = args.dryRun
    ? null
    : createClerkClient({
        secretKey: process.env.CLERK_SECRET_KEY,
      });

  const results = [];
  const failures = [];
  for (const row of selectedRows) {
    try {
      const result = await ensureUser({
        clerk,
        row,
        defaultPassword: args.defaultPassword,
        dryRun: args.dryRun,
        updateExisting: args.updateExisting,
        debug: args.debug,
      });
      results.push(result);
      console.log(`${result.action.padEnd(15)} ${result.email} (${result.role})`);
    } catch (error) {
      const details = error.details ?? extractClerkFailureDetails(error);
      const action = error.action ?? 'unknown';
      const rowForDiag = error.row ?? row;
      const diag = formatFailureDiagnostic({ row: rowForDiag, action, details });
      failures.push(diag);

      console.error(`failed          ${rowForDiag.email} (${rowForDiag.platform_role}) [${action}]`);
      console.error(safeJsonStringify(diag));
      if (args.debug) {
        console.error(`RAW_CLERK_ERROR ${safeJsonStringify(details.raw)}`);
      }
    }
  }

  const counts = results.reduce(
    (acc, result) => {
      acc[result.action] = (acc[result.action] ?? 0) + 1;
      return acc;
    },
    {},
  );
  counts.failed = failures.length;

  console.log('\nDone.');
  console.log(`Processed: ${selectedRows.length}`);
  for (const [action, count] of Object.entries(counts)) {
    console.log(`- ${action}: ${count}`);
  }
  if (failures.length > 0) {
    console.log('- failed rows:');
    for (const failure of failures) {
      console.log(`  - ${failure.seed_key} / ${failure.email} / action=${failure.action}`);
    }
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
});
