#!/usr/bin/env node
/**
 * OpenAPI drift check: ensures bundle + generated types/SDK are in sync with specs.
 * Fails if regenerating would produce different files than committed.
 *
 * Usage: node scripts/openapi_check.mjs
 * Or: pnpm openapi:check
 */

import { execSync } from 'node:child_process';

const REPO_ROOT = process.cwd();

const TRACKED_PATHS = [
  'docs/openapi/openapi.bundle.yaml',
  'packages/types/src/generated',
  'packages/sdk/src/generated',
  'types',
  'sdk',
];

function run(cmd, opts = {}) {
  return execSync(cmd, {
    encoding: 'utf8',
    stdio: 'pipe',
    ...opts,
  });
}

console.log('Running openapi:bundle, gen:types, gen:sdk...');
run('pnpm openapi:bundle', { stdio: 'inherit' });
run('pnpm gen:types', { stdio: 'inherit' });
run('pnpm gen:sdk', { stdio: 'inherit' });

const pathsArg = TRACKED_PATHS.join(' ');
let changes;
try {
  changes = run(`git status --porcelain -- ${pathsArg}`, { stdio: 'pipe', cwd: REPO_ROOT });
} catch (e) {
  changes = (e.stdout || '') || (e.stderr || '');
}

if (changes && changes.trim()) {
  console.error('Generated bundle/types/SDK differ from committed versions:');
  console.error(changes);
  console.error('\nRun: pnpm openapi:bundle && pnpm gen:types && pnpm gen:sdk');
  console.error('Then commit the changes.');
  process.exit(1);
}

console.log('OpenAPI drift check passed.');
process.exit(0);
