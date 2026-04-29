#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createClerkClient } from '@clerk/backend';
import { mintClerkJwtForUser } from '../../../scripts/lib/clerk_test_tokens.mjs';

const OWNER_EMAIL = 'oleg.tran.seed@example.com';
const OWNER_ROLE = 'pro';
const RECIPIENT_EMAIL = 'irina.belova.seed@example.com';
const RECIPIENT_ROLE = 'spacer';

function usage() {
  console.log(`
Usage:
  node apps/api-gateway/scripts/apply-connect-voucher-demo-with-clerk.mjs --apply
  node apps/api-gateway/scripts/apply-connect-voucher-demo-with-clerk.mjs --verify-only
  node apps/api-gateway/scripts/apply-connect-voucher-demo-with-clerk.mjs --dry-run

Purpose:
  Mint short-lived Clerk JWTs for existing seed users and pass them to
  apps/rf-service/scripts/seed-connect-voucher-demo.mjs through Authorization headers.

Environment:
  CLERK_SECRET_KEY              Required for Clerk lookup/token mint
  CLERK_INSTANCE_URL            Required by existing mintClerkJwtForUser helper
  RF_CONNECT_DEMO_CONFIRM       dev|local|staging
  RF_DEMO_API_BASE              Gateway/API base URL; falls back to API_BASE/STAGING_GATEWAY_URL/GATEWAY_URL
  RF_DEMO_COUNTRY_ID            Required for --apply
  RF_DEMO_CITY_ID               Required for --apply

Optional:
  RF_DEMO_PARTNER_NAME
  RF_DEMO_OFFER_TITLES
`);
}

function parseArgs(argv) {
  const args = {
    apply: false,
    verifyOnly: false,
    dryRun: false,
  };

  for (const arg of argv) {
    if (arg === '--apply') {
      args.apply = true;
      continue;
    }
    if (arg === '--verify-only') {
      args.verifyOnly = true;
      continue;
    }
    if (arg === '--dry-run') {
      args.dryRun = true;
      continue;
    }
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  const modes = [args.apply, args.verifyOnly, args.dryRun].filter(Boolean).length;
  if (modes !== 1) {
    throw new Error('Choose exactly one mode: --apply, --verify-only or --dry-run');
  }

  return args;
}

function repoRoot() {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
}

function parseEnvValue(value) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const raw = fs.readFileSync(filePath, 'utf8');
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    const [, key, value] = match;
    if (!process.env[key]) {
      process.env[key] = parseEnvValue(value);
    }
  }
}

function getEnv(name) {
  return (process.env[name] || '').trim();
}

function requireEnv(name) {
  const value = getEnv(name);
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
}

function getApiBase() {
  const value = getEnv('RF_DEMO_API_BASE') || getEnv('API_BASE') || getEnv('STAGING_GATEWAY_URL') || getEnv('GATEWAY_URL');
  if (!value) {
    throw new Error('Missing env: RF_DEMO_API_BASE or API_BASE or STAGING_GATEWAY_URL or GATEWAY_URL');
  }
  return value.replace(/\/+$/g, '');
}

function assertDemoSafe(mode) {
  const env = (process.env.ENVIRONMENT || process.env.NODE_ENV || 'dev').toLowerCase();
  if (env === 'production' || process.env.NODE_ENV?.toLowerCase() === 'production') {
    throw new Error('Refusing to run Connect voucher demo against production environment');
  }

  const confirm = getEnv('RF_CONNECT_DEMO_CONFIRM').toLowerCase();
  if (!['dev', 'local', 'staging'].includes(confirm)) {
    throw new Error('Set RF_CONNECT_DEMO_CONFIRM=dev|local|staging');
  }

  requireEnv('CLERK_SECRET_KEY');
  requireEnv('CLERK_INSTANCE_URL');
  getApiBase();

  if (mode === 'apply') {
    requireEnv('RF_DEMO_COUNTRY_ID');
    requireEnv('RF_DEMO_CITY_ID');
  }
}

async function resolveClerkUser(clerk, email, expectedRole) {
  const response = await clerk.users.getUserList({
    emailAddress: [email],
    limit: 2,
  });
  const users = response?.data || [];
  if (users.length === 0) throw new Error(`User not found in Clerk by email: ${email}`);
  if (users.length > 1) throw new Error(`Multiple Clerk users found by email: ${email}`);

  const user = users[0];
  const role = user?.publicMetadata?.role;
  if (role !== expectedRole) {
    throw new Error(`Unexpected role for ${email}: expected ${expectedRole}, got ${role || '<empty>'}`);
  }

  return {
    id: user.id,
    email,
    role,
  };
}

function runChild(command, args, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: repoRoot(),
      env,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
    });
  });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const root = repoRoot();
  loadEnvFile(path.join(root, '.env.local'));
  loadEnvFile(path.join(root, '.env'));

  const mode = args.apply ? 'apply' : args.verifyOnly ? 'verify-only' : 'dry-run';
  assertDemoSafe(mode);

  const clerk = createClerkClient({ secretKey: requireEnv('CLERK_SECRET_KEY') });
  const owner = await resolveClerkUser(clerk, OWNER_EMAIL, OWNER_ROLE);
  const recipient = await resolveClerkUser(clerk, RECIPIENT_EMAIL, RECIPIENT_ROLE);

  console.log('[connect-voucher-demo-clerk] users resolved');
  console.log(`[connect-voucher-demo-clerk] owner=${OWNER_EMAIL} role=${owner.role}`);
  console.log(`[connect-voucher-demo-clerk] recipient=${RECIPIENT_EMAIL} role=${recipient.role}`);

  if (args.dryRun) {
    console.log('[connect-voucher-demo-clerk] dry-run only; no JWT minted and no RF API calls');
    return;
  }

  const [ownerJwt, recipientJwt] = await Promise.all([
    mintClerkJwtForUser(owner.id),
    mintClerkJwtForUser(recipient.id),
  ]);

  const childEnv = {
    ...process.env,
    RF_DEMO_API_BASE: getApiBase(),
    RF_DEMO_AUTH_HEADER: 'Authorization',
    RF_DEMO_OWNER_AUTH: `Bearer ${ownerJwt}`,
    RF_DEMO_USER_AUTH: `Bearer ${recipientJwt}`,
  };

  const childArgs = ['apps/rf-service/scripts/seed-connect-voucher-demo.mjs', args.apply ? '--apply' : '--verify-only'];
  await runChild(process.execPath, childArgs, childEnv);
}

main().catch((error) => {
  console.error('[connect-voucher-demo-clerk] FATAL', error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
