import { describe, expect, it } from 'vitest';

import { buildAdminDiagnosticsHref, formatProjectionMetadata, parseSupportLookupPointer } from './projectionMetadata';

describe('projection metadata UI helper', () => {
  it('falls back to read-only non-proof copy when runtime metadata is absent', () => {
    const label = formatProjectionMetadata(undefined);

    expect(label).toContain('Projection metadata unavailable');
    expect(label).toContain('read-only');
    expect(label).toContain('not proof');
  });

  it('formats runtime projection metadata without authority claims', () => {
    const label = formatProjectionMetadata({
      projectionSource: 'POINTS_SERVICE',
      projectionKind: 'POINTS_SUMMARY',
      generatedAt: '2026-05-23T10:00:00.000Z',
      referenceScope: 'READ_ONLY',
      ownerFactReference: {
        ownerService: 'points-service',
        ownerEntity: 'user_balances',
        referenceType: 'OWNER_FACT_REFERENCE',
      },
    });

    expect(label).toContain('Points summary projection');
    expect(label).toContain('read-only');
    expect(label).toContain('generated');
    expect(label).not.toMatch(/verified|settled|confirmed|guaranteed|proofComplete/i);
    expect(label).not.toMatch(/financial ledger|cashback|payout|on-chain|bridge/i);
  });

  it('builds internal diagnostics link from support lookup key', () => {
    const href = buildAdminDiagnosticsHref({
      projectionSource: 'POINTS_SERVICE',
      projectionKind: 'ACTIVITY_PROJECTION',
      generatedAt: '2026-05-24T00:00:00.000Z',
      referenceScope: 'REFERENCE_ONLY',
      supportLookupKey: 'points:user_balances:dXNlcl8xMjM=',
    });

    expect(href).toContain('/admin/points-diagnostics?');
    expect(href).toContain('supportLookupKey=');
    expect(href).toContain('projectionKind=ACTIVITY_PROJECTION');
  });

  it('parses support lookup pointer for owner-fact guidance', () => {
    const parsed = parseSupportLookupPointer('points:user_balances:dXNlcl8xMjM=');

    expect(parsed).toEqual({
      ownerNamespace: 'points',
      ownerEntity: 'user_balances',
      ownerLookupId: 'user_123',
    });
  });
});
