import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const wranglerToml = readFileSync(new URL('../wrangler.toml', import.meta.url), 'utf8');

function stagingVarsSection(): string {
  const match = wranglerToml.match(/\[env\.staging\.vars\]([\s\S]*?)(?:\n\[|$)/);
  return match?.[1] ?? '';
}

describe('points-service staging wrangler config', () => {
  it('pins spendability observability flags for staging deploys', () => {
    const vars = stagingVarsSection();

    expect(vars).toContain('ENVIRONMENT = "staging"');
    expect(vars).toContain('POINTS_ENABLE_SPENDABILITY_SHADOW_COMPARE = "true"');
    expect(vars).toContain('POINTS_ENABLE_SPENDABILITY_SHADOW_DIAGNOSTICS = "true"');
    expect(vars).toContain('POINTS_ENABLE_SPENDABILITY_DURABLE_EXPORT = "true"');
    expect(vars).toContain('ECONOMY_PRODUCER_FIRST_LOGIN_ENABLED = "true"');
    expect(vars).toContain('ECONOMY_PRODUCER_QUEST_COMPLETED_ENABLED = "true"');
    expect(vars).toContain('ECONOMY_PRODUCER_EVENT_REGISTRATION_ENABLED = "true"');
    expect(vars).toContain('ECONOMY_PRODUCER_RF_VOUCHER_CLAIM_SPEND_ENABLED = "true"');
    expect(vars).toContain('ECONOMY_PRODUCER_RF_VOUCHER_CLAIM_SPEND_COMPENSATION_ENABLED = "true"');
  });

  it('does not commit secret values in staging vars', () => {
    const vars = stagingVarsSection();

    expect(vars).not.toMatch(/SERVICE_JWT_SECRET\s*=/);
    expect(vars).not.toMatch(/DATABASE_URL\s*=/);
  });
});
