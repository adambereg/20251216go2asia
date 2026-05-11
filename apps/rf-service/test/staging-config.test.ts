import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const wranglerToml = readFileSync(new URL('../wrangler.toml', import.meta.url), 'utf8');

function stagingVarsSection(): string {
  const match = wranglerToml.match(/\[env\.staging\.vars\]([\s\S]*?)(?:\n\[|$)/);
  return match?.[1] ?? '';
}

describe('rf-service staging wrangler config', () => {
  it('pins non-secret paid spend bridge vars for staging deploys', () => {
    const vars = stagingVarsSection();

    expect(vars).toContain('ENVIRONMENT = "staging"');
    expect(vars).toContain('RF_ENABLE_PAID_VOUCHER_SPEND = "true"');
    expect(vars).toContain('POINTS_SERVICE_URL = "https://go2asia-points-service-staging.fred89059599296.workers.dev"');
  });

  it('does not commit secret values in staging vars', () => {
    const vars = stagingVarsSection();

    expect(vars).not.toMatch(/SERVICE_JWT_SECRET\s*=/);
    expect(vars).not.toMatch(/DATABASE_URL\s*=/);
  });
});
