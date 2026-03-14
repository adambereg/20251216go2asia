#!/usr/bin/env node
import process from 'node:process';
import { spawn } from 'node:child_process';
import { mintTestTokens } from './lib/clerk_test_tokens.mjs';

async function main() {
  let ownerJwt;
  let altJwt;
  try {
    ({ ownerJwt, altJwt } = await mintTestTokens());
  } catch (error) {
    console.error('[FAIL] Clerk token minting failed');
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  const child = spawn(
    process.execPath,
    ['scripts/media_e2e_staging.mjs', '--owner-jwt', ownerJwt, '--alt-jwt', altJwt],
    {
      stdio: 'inherit',
      cwd: process.cwd(),
      env: process.env,
    }
  );

  child.on('exit', (code) => {
    process.exit(code ?? 1);
  });
  child.on('error', () => {
    console.error('[FAIL] media e2e runner failed to launch');
    process.exit(1);
  });
}

main();
