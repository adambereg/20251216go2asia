import { describe, expect, it, vi } from 'vitest';

const executeMock = vi.hoisted(() => vi.fn());

vi.mock('@go2asia/db', async () => {
  const actual = await vi.importActual<typeof import('@go2asia/db')>('@go2asia/db');
  return {
    ...actual,
    createDb: vi.fn(() => ({ execute: executeMock })),
  };
});

import { handleRfRoute } from '../src/routes/rf';
import { getMerchantVoucherActivitySummary } from '../src/store';

const principal = {
  userId: 'owner_1',
  platformRole: 'spacer',
  roles: [],
};

function createDbExecutor(rowsQueue: Array<unknown[]>) {
  return {
    execute: vi.fn(async () => ({ rows: rowsQueue.shift() ?? [] })),
  };
}

describe('merchant voucher activity summary', () => {
  it('returns 401 for unauthenticated requests on summary endpoint', async () => {
    executeMock.mockReset();
    const response = await handleRfRoute(
      new Request('https://example.test/v1/rf/business/partners/partner_1/voucher-activity/summary', { method: 'GET' }),
      { DATABASE_URL: 'postgres://test' },
      'req_unauth_summary',
      null
    );

    expect(response?.status).toBe(401);
  });

  it('returns forbidden for non-owner principal', async () => {
    const db = createDbExecutor([
      [{ id: 'partner_1', owner_user_id: 'other_owner', status: 'active' }],
    ]);

    const result = await getMerchantVoucherActivitySummary(db as never, principal as never, 'partner_1');
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.code).toBe('RF_PARTNER_FORBIDDEN');
    expect(result.status).toBe(403);
  });

  it('returns zeros for owned partner with no voucher activity', async () => {
    const db = createDbExecutor([
      [{ id: 'partner_1', owner_user_id: 'owner_1', status: 'active' }],
      [
        {
          total: 0,
          active: 0,
          redeemed: 0,
          expired_or_unavailable: 0,
          offers_with_activity: 0,
          pro_attributed: 0,
          last_activity_at: null,
        },
      ],
    ]);

    const result = await getMerchantVoucherActivitySummary(db as never, principal as never, 'partner_1');
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.summary).toEqual({
      total: 0,
      active: 0,
      redeemed: 0,
      expiredOrUnavailable: 0,
      offersWithActivity: 0,
      proAttributed: 0,
      lastActivityAt: null,
    });
  });

  it('maps canonical aggregate counts and does not expose sensitive fields', async () => {
    const db = createDbExecutor([
      [{ id: 'partner_1', owner_user_id: 'owner_1', status: 'active' }],
      [
        {
          total: 11,
          active: 5,
          redeemed: 3,
          expired_or_unavailable: 3,
          offers_with_activity: 4,
          pro_attributed: 2,
          last_activity_at: '2026-05-10T03:00:00.000Z',
        },
      ],
    ]);

    const result = await getMerchantVoucherActivitySummary(db as never, principal as never, 'partner_1');
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.data.summary).toMatchObject({
      total: 11,
      active: 5,
      redeemed: 3,
      expiredOrUnavailable: 3,
      offersWithActivity: 4,
      proAttributed: 2,
      lastActivityAt: '2026-05-10T03:00:00.000Z',
    });

    const payload = JSON.stringify(result.data);
    expect(payload).not.toMatch(/issuedToUserId|voucherCode|shareCode|proUserId|attributionMetadata|pointsDebitExternalId/i);
  });
});
