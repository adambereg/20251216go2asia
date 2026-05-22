import { beforeEach, describe, expect, it, vi } from 'vitest';

const { createDbMock, executeMock } = vi.hoisted(() => {
  const execute = vi.fn();
  return {
    executeMock: execute,
    createDbMock: vi.fn(() => ({ execute })),
  };
});

vi.mock('@go2asia/db', () => ({
  createDb: createDbMock,
  sql: (strings: TemplateStringsArray, ...values: unknown[]) => ({
    strings: [...strings],
    values,
  }),
}));

import worker, { computeWalletBuckets, type Env } from '../src/index';
import { makeGatewayJwt, makeServiceJwt, readJson } from '../../../tests/helpers/worker-test';
import {
  assertNoUnsafeSpendabilityShadowDiagnosticsFields,
  getSpendabilityShadowDiagnosticsSnapshot,
  resetSpendabilityShadowDiagnosticsForTests,
} from '../src/spendabilityShadow';

const rfSpendProducerEnabled = {
  ECONOMY_PRODUCER_RF_VOUCHER_CLAIM_SPEND_ENABLED: 'true',
} satisfies Partial<Env>;

describe('points-service request hardening', () => {
  beforeEach(() => {
    createDbMock.mockClear();
    executeMock.mockReset();
    resetSpendabilityShadowDiagnosticsForTests();
  });

  it('computes wallet buckets from mixed ledger transactions', () => {
    expect(
      computeWalletBuckets([
        { amount: 20, reason: 'first_login' },
        { amount: 1000, reason: 'space_post_created' },
        { amount: 5000, reason: 'referral_locked' },
        { amount: 100, reason: 'network_accrual_level_1' },
        { amount: 20, reason: 'network_accrual_level_2' },
        { amount: -200, reason: 'rf_voucher_claimed' },
        { amount: -30, reason: 'rf_voucher_claim_spend' },
      ])
    ).toEqual({
      availablePoints: 790,
      lockedPoints: 5000,
      networkPoints: 120,
    });
  });

  it('accepts valid gateway token and derives userId from token subject', async () => {
    executeMock.mockResolvedValueOnce({
      rows: [{ balance: 150, updated_at: new Date('2026-03-10T00:00:00.000Z') }],
    });

    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, {
      sub: 'user_from_token',
      roles: ['member'],
    });

    const response = await worker.fetch(
      new Request('https://points.example/v1/points/balance', {
        headers: {
          'X-Gateway-Auth': token,
          'X-User-ID': 'spoofed-user',
        },
      }),
      env
    );

    const body = await readJson<{ userId: string; balance: number }>(response);

    expect(response.status).toBe(200);
    expect(body.userId).toBe('user_from_token');
    expect(body.balance).toBe(150);
  });

  it('returns 503 when service auth is not configured on user route', async () => {
    const response = await worker.fetch(
      new Request('https://points.example/v1/points/balance'),
      {
        DATABASE_URL: 'postgres://example',
      }
    );

    const body = await readJson<{ error: string; message: string }>(response);

    expect(response.status).toBe(503);
    expect(body.error).toBe('SERVICE_AUTH_NOT_CONFIGURED');
    expect(body.message).toContain('not configured');
  });

  it('rejects missing gateway token on user route', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };

    const response = await worker.fetch(
      new Request('https://points.example/v1/points/balance'),
      env
    );

    const body = await readJson<{ error: string; message: string }>(response);

    expect(response.status).toBe(401);
    expect(body.error).toBe('UNAUTHORIZED');
    expect(body.message).toContain('X-Gateway-Auth');
  });

  it('returns wallet summary buckets for current user', async () => {
    executeMock.mockResolvedValueOnce({
      rows: [
        { amount: 20, reason: 'first_login' },
        { amount: 1000, reason: 'space_post_created' },
        { amount: 5000, reason: 'referral_locked' },
        { amount: 100, reason: 'network_accrual_level_1' },
        { amount: 20, reason: 'network_accrual_level_2' },
        { amount: -200, reason: 'rf_voucher_claimed' },
      ],
    });

    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, {
      sub: 'user_wallet',
      roles: ['vip_spacer', 'pro'],
    });

    const response = await worker.fetch(
      new Request('https://points.example/v1/wallet/summary', {
        headers: {
          'X-Gateway-Auth': token,
        },
      }),
      env
    );

    const body = await readJson<{
      availablePoints: number;
      lockedPoints: number;
      networkPoints: number;
      totalPoints: number;
      estimatedUnlockablePoints: number;
      vipStatus: { isActive: boolean };
      proStatus: { isActive: boolean };
    }>(response);

    expect(response.status).toBe(200);
    expect(body).toEqual({
      availablePoints: 820,
      lockedPoints: 5000,
      networkPoints: 120,
      totalPoints: 5940,
      estimatedUnlockablePoints: 5000,
      vipStatus: { isActive: true },
      proStatus: { isActive: true },
    });

    const query = executeMock.mock.calls[0]?.[0] as { values: unknown[]; strings: string[] };
    expect(query.values).toContain('user_wallet');
    expect(query.strings.join('')).toContain('FROM points_transactions');
  });

  it('rejects invalid gateway token claims on user route', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { aud: 'wrong-audience' });

    const response = await worker.fetch(
      new Request('https://points.example/v1/points/balance', {
        headers: {
          'X-Gateway-Auth': token,
        },
      }),
      env
    );

    const body = await readJson<{ error: string; message: string }>(response);

    expect(response.status).toBe(401);
    expect(body.error).toBe('UNAUTHORIZED');
    expect(body.message).toContain('claims');
  });

  it('rejects missing gateway token on connect dashboard route', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };

    const response = await worker.fetch(
      new Request('https://points.example/v1/points/connect-dashboard'),
      env
    );

    const body = await readJson<{ error: string; message: string }>(response);

    expect(response.status).toBe(401);
    expect(body.error).toBe('UNAUTHORIZED');
    expect(body.message).toContain('X-Gateway-Auth');
  });

  it('returns connect dashboard zero-state for current user without leaking metadata', async () => {
    executeMock
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ total: 0 }] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          {
            total_referrals: 0,
            activated_referrals: 0,
            pending_referrals: 0,
            total_earned_points: 0,
          },
        ],
      });

    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_dashboard_empty' });

    const response = await worker.fetch(
      new Request('https://points.example/v1/points/connect-dashboard', {
        headers: {
          'X-Gateway-Auth': token,
        },
      }),
      env
    );

    const body = await readJson<{
      balance: { points: number; updatedAt: string | null };
      recentTransactions: unknown[];
      referrals: {
        totalEarnedPoints: number;
        activatedReferrals: number;
        pendingReferrals: number;
        totalReferrals: number;
      };
      badges: { totalBadges: number; recent: unknown[] };
    }>(response);

    expect(response.status).toBe(200);
    expect(body).toEqual({
      balance: {
        points: 0,
        updatedAt: null,
      },
      recentTransactions: [],
      referrals: {
        totalEarnedPoints: 0,
        activatedReferrals: 0,
        pendingReferrals: 0,
        totalReferrals: 0,
      },
      badges: {
        totalBadges: 0,
        recent: [],
      },
    });
  });

  it('returns bounded connect dashboard sections for current user only', async () => {
    executeMock
      .mockResolvedValueOnce({
        rows: [{ balance: 420, updated_at: new Date('2026-04-24T08:00:00.000Z') }],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'tx_dash_1',
            user_id: 'user_dashboard',
            amount: 100,
            reason: 'quest_completed',
            source_service: 'quest-service',
            source_event_id: 'quest.completed:qprog_1',
            external_id: 'quest:completed:qprog_1',
            metadata: { questId: 'quest_1' },
            created_at: new Date('2026-04-24T09:00:00.000Z'),
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [{ total: 3 }] })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'award_2',
            user_id: 'user_dashboard',
            badge_id: 'first_quest_completed',
            badge_name: 'First Quest Completed',
            source_service: 'quest-service',
            source_type: 'quest.completed',
            source_id: 'qprog_1',
            metadata: { hidden: true },
            created_at: new Date('2026-04-24T09:05:00.000Z'),
            earned_at: new Date('2026-04-24T09:05:00.000Z'),
            badge_code: 'first_quest_completed',
            badge_title: 'First Quest Completed',
            badge_description: 'Completed your first quest',
            badge_category: 'quest',
            badge_icon_key: 'badges/first-quest.svg',
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            total_referrals: 3,
            activated_referrals: 1,
            pending_referrals: 2,
            total_earned_points: 100,
          },
        ],
      });

    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_dashboard' });

    const response = await worker.fetch(
      new Request('https://points.example/v1/points/connect-dashboard?transactionsLimit=50&badgesLimit=100&userId=spoofed-user', {
        headers: {
          'X-Gateway-Auth': token,
        },
      }),
      env
    );

    const body = await readJson<{
      balance: { points: number; updatedAt: string | null };
      recentTransactions: Array<{
        id: string;
        amount: number;
        action: string;
        sourceService: string | null;
        sourceEventId: string | null;
        createdAt: string;
        metadata?: unknown;
      }>;
      referrals: {
        totalEarnedPoints: number;
        activatedReferrals: number;
        pendingReferrals: number;
        totalReferrals: number;
      };
      badges: {
        totalBadges: number;
        recent: Array<{
          badgeCode: string;
          title: string;
          category: string | null;
          iconKey: string | null;
          awardedAt: string;
          sourceType?: unknown;
          sourceId?: unknown;
        }>;
      };
    }>(response);

    expect(response.status).toBe(200);
    expect(body.balance).toEqual({
      points: 420,
      updatedAt: '2026-04-24T08:00:00.000Z',
    });
    expect(body.recentTransactions).toEqual([
      {
        id: 'tx_dash_1',
        amount: 100,
        action: 'quest_completed',
        sourceService: 'quest-service',
        sourceEventId: 'quest.completed:qprog_1',
        createdAt: '2026-04-24T09:00:00.000Z',
      },
    ]);
    expect(body.badges).toEqual({
      totalBadges: 3,
      recent: [
        {
          badgeCode: 'first_quest_completed',
          title: 'First Quest Completed',
          category: 'quest',
          iconKey: 'badges/first-quest.svg',
          awardedAt: '2026-04-24T09:05:00.000Z',
        },
      ],
    });
    expect(body.referrals).toEqual({
      totalEarnedPoints: 100,
      activatedReferrals: 1,
      pendingReferrals: 2,
      totalReferrals: 3,
    });
    expect(body.recentTransactions.every((item) => !('metadata' in item))).toBe(true);
    expect(body.badges.recent.every((item) => !('sourceType' in item) && !('sourceId' in item))).toBe(true);

    const transactionQuery = executeMock.mock.calls[1]?.[0] as { values: unknown[] };
    expect(transactionQuery.values).toContain('user_dashboard');
    expect(transactionQuery.values).not.toContain('spoofed-user');
    expect(transactionQuery.values).toContain(20);

    const badgesQuery = executeMock.mock.calls[3]?.[0] as { values: unknown[] };
    expect(badgesQuery.values).toContain('user_dashboard');
    expect(badgesQuery.values).toContain(20);

    const referralsQuery = executeMock.mock.calls[4]?.[0] as { values: unknown[]; strings: string[] };
    expect(referralsQuery.values).toContain('user_dashboard');
    expect(referralsQuery.strings.join('')).toContain('FROM referral_relations');
    expect(referralsQuery.strings.join('')).toContain("pt.reason = 'referral_bonus_referrer'");
    expect(referralsQuery.strings.join('')).toContain("pt.external_id = ('referral:first_login:' || rr.referrer_id || ':' || rr.referee_id)");
  });

  it('returns 503 when service auth is not configured on internal route', async () => {
    const response = await worker.fetch(
      new Request('https://points.example/internal/points/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user_1',
          amount: 100,
          action: 'registration',
          externalId: 'ext_1',
        }),
      }),
      {
        DATABASE_URL: 'postgres://example',
      }
    );

    const body = await readJson<{ error: string; message: string }>(response);

    expect(response.status).toBe(503);
    expect(body.error).toBe('SERVICE_AUTH_NOT_CONFIGURED');
    expect(body.message).toContain('not configured');
  });

  it('applies a new ledger write and stores audit fields', async () => {
    executeMock
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ total: 0 }] })
      .mockResolvedValueOnce({ rows: [{ transaction_id: 'tx_new', balance: 120 }] });

    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
      ECONOMY_PRODUCER_EVENT_REGISTRATION_ENABLED: 'true',
    };
    const token = await makeServiceJwt(env.SERVICE_JWT_SECRET!, 'points-service', {
      sub: 'content-service',
    });

    const response = await worker.fetch(
      new Request('https://points.example/internal/points/add', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user_1',
          amount: 20,
          action: 'event_registration',
          externalId: 'content:event_registration:event_1:user_1',
          sourceEventId: 'content:event_registration:event_1:user_1',
          metadata: { eventId: 'event_1', mode: 'db_less_fallback' },
        }),
      }),
      env
    );

    const body = await readJson<{ applied: boolean; transactionId: string; balance: number }>(response);

    expect(response.status).toBe(200);
    expect(body.applied).toBe(true);
    expect(body.transactionId).toBe('tx_new');
    expect(body.balance).toBe(120);

    const insertQuery = executeMock.mock.calls[2]?.[0] as { values?: unknown[] };
    expect(insertQuery.values).toEqual(
      expect.arrayContaining([
        'user_1',
        20,
        'event_registration',
        'content-service',
        'content:event_registration:event_1:user_1',
        'content:event_registration:event_1:user_1',
      ])
    );
  });

  it('lists transaction history with audit fields', async () => {
    executeMock.mockResolvedValueOnce({
      rows: [
        {
          id: 'tx_1',
          user_id: 'user_from_token',
          amount: 20,
          reason: 'event_registration',
          source_service: 'content-service',
          source_event_id: 'registration_1',
          external_id: 'content:event_registration:registration_1',
          metadata: { eventId: 'event_1', registrationId: 'registration_1' },
          created_at: new Date('2026-03-10T00:00:00.000Z'),
        },
      ],
    });

    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_from_token' });

    const response = await worker.fetch(
      new Request('https://points.example/v1/points/transactions', {
        headers: {
          'X-Gateway-Auth': token,
        },
      }),
      env
    );

    const body = await readJson<{
      items: Array<{
        id: string;
        sourceService?: string | null;
        sourceEventId?: string | null;
        metadata?: Record<string, unknown>;
      }>;
      nextCursor: string | null;
    }>(response);

    expect(response.status).toBe(200);
    expect(body.nextCursor).toBeNull();
    expect(body.items[0]?.id).toBe('tx_1');
    expect(body.items[0]?.sourceService).toBe('content-service');
    expect(body.items[0]?.sourceEventId).toBe('registration_1');
    expect(body.items[0]?.metadata).toEqual({ eventId: 'event_1', registrationId: 'registration_1' });
  });

  it('returns 400 for invalid sourceEventId', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeServiceJwt(env.SERVICE_JWT_SECRET!, 'points-service', {
      sub: 'auth-service',
    });

    const response = await worker.fetch(
      new Request('https://points.example/internal/points/add', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user_1',
          amount: 100,
          action: 'registration',
          externalId: 'ext_invalid_source_event',
          sourceEventId: '   ',
        }),
      }),
      env
    );

    const body = await readJson<{ error: string; message: string }>(response);

    expect(response.status).toBe(400);
    expect(body.error).toBe('BadRequest');
    expect(body.message).toContain('sourceEventId');
  });

  it('returns applied=false for duplicate externalId with the same payload', async () => {
    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'tx_existing',
            user_id: 'user_1',
            amount: 100,
            reason: 'registration',
            source_service: 'auth-service',
            source_event_id: 'clerk:user.created:user_1',
            external_id: 'ext_same',
            metadata: {},
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [{ balance: 150, updated_at: new Date('2026-03-10T00:00:00.000Z') }],
      });

    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeServiceJwt(env.SERVICE_JWT_SECRET!, 'points-service', {
      sub: 'auth-service',
    });

    const response = await worker.fetch(
      new Request('https://points.example/internal/points/add', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user_1',
          amount: 100,
          action: 'registration',
          externalId: 'ext_same',
          sourceEventId: 'clerk:user.created:user_1',
        }),
      }),
      env
    );

    const body = await readJson<{ applied: boolean; transactionId: string; balance: number }>(response);

    expect(response.status).toBe(200);
    expect(body.applied).toBe(false);
    expect(body.transactionId).toBe('tx_existing');
    expect(body.balance).toBe(150);
    expect(createDbMock).toHaveBeenCalledTimes(1);
  });

  it('returns 409 for duplicate externalId with a different payload', async () => {
    executeMock.mockResolvedValueOnce({
      rows: [
        {
          id: 'tx_existing',
          user_id: 'user_1',
          amount: 100,
          reason: 'registration',
          source_service: 'auth-service',
          source_event_id: 'clerk:user.created:user_1',
          external_id: 'ext_conflict',
          metadata: {},
        },
      ],
    });

    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeServiceJwt(env.SERVICE_JWT_SECRET!, 'points-service', {
      sub: 'auth-service',
    });

    const response = await worker.fetch(
      new Request('https://points.example/internal/points/add', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user_1',
          amount: 200,
          action: 'registration',
          externalId: 'ext_conflict',
          sourceEventId: 'clerk:user.created:user_1',
        }),
      }),
      env
    );

    const body = await readJson<{ error: string; message: string }>(response);

    expect(response.status).toBe(409);
    expect(body.error).toBe('Conflict');
    expect(body.message).toContain('externalId already exists');
  });

  it('rejects future-only, forbidden, and unknown add producers before ledger lookup', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
      ECONOMY_PRODUCER_QUEST_COMPLETED_ENABLED: 'true',
    };
    const token = await makeServiceJwt(env.SERVICE_JWT_SECRET!, 'points-service', {
      sub: 'quest-service',
    });

    const futureOnlyResponse = await worker.fetch(
      new Request('https://points.example/internal/points/add', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user_1',
          amount: 100,
          action: 'space_post_created',
          externalId: 'space:post:post_1:user_1',
        }),
      }),
      env
    );
    const futureOnlyBody = await readJson<{ error: string }>(futureOnlyResponse);
    expect(futureOnlyResponse.status).toBe(403);
    expect(futureOnlyBody.error).toBe('PRODUCER_FUTURE_ONLY');

    const forbiddenResponse = await worker.fetch(
      new Request('https://points.example/internal/points/add', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user_1',
          amount: 100,
          action: 'network_accrual_level_1',
          externalId: 'network:level1:user_1',
        }),
      }),
      env
    );
    const forbiddenBody = await readJson<{ error: string }>(forbiddenResponse);
    expect(forbiddenResponse.status).toBe(403);
    expect(forbiddenBody.error).toBe('PRODUCER_FORBIDDEN_FOR_STAGE_11');

    const unknownResponse = await worker.fetch(
      new Request('https://points.example/internal/points/add', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user_1',
          amount: 100,
          action: 'mock_reward',
          externalId: 'mock:reward:user_1',
        }),
      }),
      env
    );
    const unknownBody = await readJson<{ error: string }>(unknownResponse);
    expect(unknownResponse.status).toBe(400);
    expect(unknownBody.error).toBe('UNKNOWN_POINTS_PRODUCER');
    expect(executeMock).not.toHaveBeenCalled();
  });

  it('fails closed for internal-beta add producers when their flag is missing', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeServiceJwt(env.SERVICE_JWT_SECRET!, 'points-service', {
      sub: 'quest-service',
    });

    const response = await worker.fetch(
      new Request('https://points.example/internal/points/add', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user_1',
          amount: 100,
          action: 'quest_completed',
          externalId: 'quest:completed:progress_1',
          sourceEventId: 'quest.completed:progress_1',
        }),
      }),
      env
    );

    const body = await readJson<{ error: string }>(response);
    expect(response.status).toBe(403);
    expect(body.error).toBe('PRODUCER_INTERNAL_BETA_DISABLED');
    expect(executeMock).not.toHaveBeenCalled();
  });

  it('rejects unauthenticated internal spend requests', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };

    const response = await worker.fetch(
      new Request('https://points.example/internal/points/spend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user_1',
          amount: 100,
          action: 'rf_voucher_claim_spend',
          externalId: 'rf:voucher-claim-spend:voucher_1',
        }),
      }),
      env
    );

    const body = await readJson<{ error: string }>(response);
    expect(response.status).toBe(401);
    expect(body.error).toBe('UNAUTHORIZED');
  });

  it('keeps spendability shadow diagnostics default-off', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeServiceJwt(env.SERVICE_JWT_SECRET!, 'points-service', {
      sub: 'rf-service',
    });

    const response = await worker.fetch(
      new Request('https://points.example/internal/points/spendability-shadow/diagnostics', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      env
    );
    const body = await readJson<{ error: string }>(response);

    expect(response.status).toBe(404);
    expect(body.error).toBe('SPENDABILITY_SHADOW_DIAGNOSTICS_DISABLED');
    expect(executeMock).not.toHaveBeenCalled();
  });

  it('validates spend payload fields', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeServiceJwt(env.SERVICE_JWT_SECRET!, 'points-service', {
      sub: 'rf-service',
    });

    const invalidAmountResponse = await worker.fetch(
      new Request('https://points.example/internal/points/spend', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user_1',
          amount: 12.5,
          action: 'rf_voucher_claim_spend',
          externalId: 'rf:voucher-claim-spend:voucher_1',
        }),
      }),
      env
    );
    expect(invalidAmountResponse.status).toBe(400);

    const invalidActionResponse = await worker.fetch(
      new Request('https://points.example/internal/points/spend', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user_1',
          amount: 10,
          action: 'rf_voucher_claimed',
          externalId: 'rf:voucher-claim-spend:voucher_2',
        }),
      }),
      env
    );
    expect(invalidActionResponse.status).toBe(403);

    const missingExternalIdResponse = await worker.fetch(
      new Request('https://points.example/internal/points/spend', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user_1',
          amount: 10,
          action: 'rf_voucher_claim_spend',
        }),
      }),
      env
    );
    expect(missingExternalIdResponse.status).toBe(400);
  });

  it('applies spend with negative ledger row and reduced balance', async () => {
    executeMock
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ transaction_id: 'tx_spend_1', balance_after: 80 }] });

    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
      ...rfSpendProducerEnabled,
    };
    const token = await makeServiceJwt(env.SERVICE_JWT_SECRET!, 'points-service', {
      sub: 'rf-service',
    });

    const response = await worker.fetch(
      new Request('https://points.example/internal/points/spend', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user_1',
          amount: 20,
          action: 'rf_voucher_claim_spend',
          externalId: 'rf:voucher-claim-spend:voucher_1',
          sourceEventId: 'rf:voucher:voucher_1',
          correlationId: 'corr_1',
          metadata: { voucherId: 'voucher_1' },
        }),
      }),
      env
    );

    const body = await readJson<{
      transactionId: string;
      applied: boolean;
      idempotentReplay: boolean;
      balanceAfter: number;
    }>(response);

    expect(response.status).toBe(200);
    expect(body).toEqual({
      transactionId: 'tx_spend_1',
      applied: true,
      idempotentReplay: false,
      balanceAfter: 80,
    });

    const spendQuery = executeMock.mock.calls[1]?.[0] as { values?: unknown[]; strings: string[] };
    expect(spendQuery.values).toEqual(
      expect.arrayContaining([
        'user_1',
        -20,
        'rf_voucher_claim_spend',
        'rf-service',
        'rf:voucher:voucher_1',
        'rf:voucher-claim-spend:voucher_1',
      ])
    );
    expect(spendQuery.strings.join(' ')).toContain('ub.balance >=');
    expect(getSpendabilityShadowDiagnosticsSnapshot().total).toBe(0);
  });

  it('keeps legacy spend success when shadow available-only would deny', async () => {
    executeMock
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ balance: 5200, updated_at: new Date('2026-05-01T00:00:00.000Z') }] })
      .mockResolvedValueOnce({
        rows: [
          { amount: 200, reason: 'first_login' },
          { amount: 5000, reason: 'referral_locked' },
        ],
      })
      .mockResolvedValueOnce({ rows: [{ transaction_id: 'tx_spend_shadow_1', balance_after: 200 }] });

    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
      POINTS_ENABLE_SPENDABILITY_SHADOW_COMPARE: 'true',
      POINTS_ENABLE_SPENDABILITY_SHADOW_DIAGNOSTICS: 'true',
      ...rfSpendProducerEnabled,
    };
    const token = await makeServiceJwt(env.SERVICE_JWT_SECRET!, 'points-service', {
      sub: 'rf-service',
    });

    const response = await worker.fetch(
      new Request('https://points.example/internal/points/spend', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user_1',
          amount: 5000,
          action: 'rf_voucher_claim_spend',
          externalId: 'rf:voucher-claim-spend:voucher_shadow_1',
          sourceEventId: 'rf:voucher:voucher_shadow_1',
          correlationId: 'corr_shadow_1',
          metadata: { voucherId: 'voucher_shadow_1' },
        }),
      }),
      env
    );

    const body = await readJson<{
      transactionId: string;
      applied: boolean;
      idempotentReplay: boolean;
      balanceAfter: number;
    }>(response);
    const diagnostics = getSpendabilityShadowDiagnosticsSnapshot();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      transactionId: 'tx_spend_shadow_1',
      applied: true,
      idempotentReplay: false,
      balanceAfter: 200,
    });
    expect(diagnostics.total).toBe(1);
    expect(diagnostics.byDriftClass.legacy_allowed_target_denied).toBe(1);
    expect(() => assertNoUnsafeSpendabilityShadowDiagnosticsFields(diagnostics)).not.toThrow();

    const diagnosticsResponse = await worker.fetch(
      new Request('https://points.example/internal/points/spendability-shadow/diagnostics', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      env
    );
    const diagnosticsBody = await readJson<typeof diagnostics>(diagnosticsResponse);

    expect(diagnosticsResponse.status).toBe(200);
    expect(diagnosticsBody).toMatchObject({
      diagnosticsVersion: 'points_spendability_shadow_diagnostics_v1',
      total: 1,
      countedCompares: 1,
      duplicateSuppressed: 0,
    });
    expect(() => assertNoUnsafeSpendabilityShadowDiagnosticsFields(diagnosticsBody)).not.toThrow();
  });

  it('does not emit durable export when export flag is off', async () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    executeMock
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ balance: 5200, updated_at: new Date('2026-05-01T00:00:00.000Z') }] })
      .mockResolvedValueOnce({
        rows: [
          { amount: 200, reason: 'first_login' },
          { amount: 5000, reason: 'referral_locked' },
        ],
      })
      .mockResolvedValueOnce({ rows: [{ transaction_id: 'tx_spend_export_off', balance_after: 200 }] });

    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
      POINTS_ENABLE_SPENDABILITY_SHADOW_COMPARE: 'true',
      POINTS_ENABLE_SPENDABILITY_SHADOW_DIAGNOSTICS: 'true',
      ...rfSpendProducerEnabled,
    };
    const token = await makeServiceJwt(env.SERVICE_JWT_SECRET!, 'points-service', {
      sub: 'rf-service',
    });

    try {
      const response = await worker.fetch(
        new Request('https://points.example/internal/points/spend', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: 'user_1',
            amount: 5000,
            action: 'rf_voucher_claim_spend',
            externalId: 'rf:voucher-claim-spend:voucher_export_off',
          }),
        }),
        env
      );
      const body = await readJson<{
        transactionId: string;
        applied: boolean;
        idempotentReplay: boolean;
        balanceAfter: number;
      }>(response);

      expect(response.status).toBe(200);
      expect(body).toEqual({
        transactionId: 'tx_spend_export_off',
        applied: true,
        idempotentReplay: false,
        balanceAfter: 200,
      });
      expect(consoleLogSpy.mock.calls.some(([message]) => String(message).includes('Points spendability durable export'))).toBe(false);
    } finally {
      consoleLogSpy.mockRestore();
    }
  });

  it('emits safe durable export event for critical spendability drift', async () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    executeMock
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ balance: 5200, updated_at: new Date('2026-05-01T00:00:00.000Z') }] })
      .mockResolvedValueOnce({
        rows: [
          { amount: 200, reason: 'first_login' },
          { amount: 5000, reason: 'referral_locked' },
        ],
      })
      .mockResolvedValueOnce({ rows: [{ transaction_id: 'tx_spend_export_on', balance_after: 200 }] });

    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
      POINTS_ENABLE_SPENDABILITY_SHADOW_COMPARE: 'true',
      POINTS_ENABLE_SPENDABILITY_SHADOW_DIAGNOSTICS: 'true',
      POINTS_ENABLE_SPENDABILITY_DURABLE_EXPORT: 'true',
      ...rfSpendProducerEnabled,
    };
    const token = await makeServiceJwt(env.SERVICE_JWT_SECRET!, 'points-service', {
      sub: 'rf-service',
    });

    try {
      const response = await worker.fetch(
        new Request('https://points.example/internal/points/spend', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: 'user_1',
            amount: 5000,
            action: 'rf_voucher_claim_spend',
            externalId: 'rf:voucher-claim-spend:voucher_export_on',
            sourceEventId: 'rf:voucher:voucher_export_on',
            correlationId: 'corr_export_on',
            metadata: { voucherId: 'voucher_export_on' },
          }),
        }),
        env
      );
      const body = await readJson<{
        transactionId: string;
        applied: boolean;
        idempotentReplay: boolean;
        balanceAfter: number;
      }>(response);
      const exportLog = consoleLogSpy.mock.calls.find(([message]) => String(message).includes('Points spendability durable export'))?.[0];

      expect(response.status).toBe(200);
      expect(body).toEqual({
        transactionId: 'tx_spend_export_on',
        applied: true,
        idempotentReplay: false,
        balanceAfter: 200,
      });
      expect(exportLog).toBeDefined();
      const context = JSON.parse(String(exportLog).slice(String(exportLog).indexOf('{'))) as {
        durableExport: unknown;
      };
      expect(context.durableExport).toMatchObject({
        schemaVersion: 'points_spendability_durable_export_v1',
        diagnosticsVersion: 'points_spendability_shadow_diagnostics_v1',
        service: 'points-service',
        environment: 'staging',
        eventType: 'points_spendability_shadow_compare',
        driftClass: 'legacy_allowed_target_denied',
        reasonCode: 'locked_or_conditional_value_may_fund_spend',
        action: 'rf_voucher_claim_spend',
        amountRange: '5000_plus',
        legacyAllows: true,
        targetAllows: false,
        duplicateSuppressed: false,
      });
      expect(JSON.stringify(context.durableExport)).not.toContain('user_1');
      expect(JSON.stringify(context.durableExport)).not.toContain('voucher_export_on');
      expect(() => assertNoUnsafeSpendabilityShadowDiagnosticsFields(context.durableExport)).not.toThrow();
      expect(getSpendabilityShadowDiagnosticsSnapshot().exportedEvents).toBe(1);
    } finally {
      consoleLogSpy.mockRestore();
    }
  });

  it('keeps spend response unchanged when durable export sink fails', async () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation((message?: unknown) => {
      if (String(message).includes('Points spendability durable export')) {
        throw new Error('export sink failed');
      }
    });
    executeMock
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ balance: 5200, updated_at: new Date('2026-05-01T00:00:00.000Z') }] })
      .mockResolvedValueOnce({
        rows: [
          { amount: 200, reason: 'first_login' },
          { amount: 5000, reason: 'referral_locked' },
        ],
      })
      .mockResolvedValueOnce({ rows: [{ transaction_id: 'tx_spend_export_failure', balance_after: 200 }] });

    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
      POINTS_ENABLE_SPENDABILITY_SHADOW_COMPARE: 'true',
      POINTS_ENABLE_SPENDABILITY_DURABLE_EXPORT: 'true',
      ...rfSpendProducerEnabled,
    };
    const token = await makeServiceJwt(env.SERVICE_JWT_SECRET!, 'points-service', {
      sub: 'rf-service',
    });

    try {
      const response = await worker.fetch(
        new Request('https://points.example/internal/points/spend', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: 'user_1',
            amount: 5000,
            action: 'rf_voucher_claim_spend',
            externalId: 'rf:voucher-claim-spend:voucher_export_failure',
          }),
        }),
        env
      );
      const body = await readJson<{
        transactionId: string;
        applied: boolean;
        idempotentReplay: boolean;
        balanceAfter: number;
      }>(response);

      expect(response.status).toBe(200);
      expect(body).toEqual({
        transactionId: 'tx_spend_export_failure',
        applied: true,
        idempotentReplay: false,
        balanceAfter: 200,
      });
      expect(getSpendabilityShadowDiagnosticsSnapshot().exportFailures).toBe(1);
    } finally {
      consoleLogSpy.mockRestore();
    }
  });

  it('records aligned allowed shadow diagnostics without changing spend response', async () => {
    executeMock
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ balance: 500, updated_at: new Date('2026-05-01T00:00:00.000Z') }] })
      .mockResolvedValueOnce({
        rows: [{ amount: 500, reason: 'first_login' }],
      })
      .mockResolvedValueOnce({ rows: [{ transaction_id: 'tx_spend_shadow_aligned', balance_after: 300 }] });

    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
      POINTS_ENABLE_SPENDABILITY_SHADOW_COMPARE: 'true',
      POINTS_ENABLE_SPENDABILITY_SHADOW_DIAGNOSTICS: 'true',
      ...rfSpendProducerEnabled,
    };
    const token = await makeServiceJwt(env.SERVICE_JWT_SECRET!, 'points-service', {
      sub: 'rf-service',
    });

    const response = await worker.fetch(
      new Request('https://points.example/internal/points/spend', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user_1',
          amount: 200,
          action: 'rf_voucher_claim_spend',
          externalId: 'rf:voucher-claim-spend:voucher_shadow_aligned',
        }),
      }),
      env
    );

    const body = await readJson<{ transactionId: string; applied: boolean; idempotentReplay: boolean; balanceAfter: number }>(response);
    const diagnostics = getSpendabilityShadowDiagnosticsSnapshot();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      transactionId: 'tx_spend_shadow_aligned',
      applied: true,
      idempotentReplay: false,
      balanceAfter: 300,
    });
    expect(diagnostics.byDriftClass.aligned_allowed).toBe(1);
  });

  it('returns idempotent replay for same spend externalId/payload', async () => {
    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'tx_spend_existing',
            user_id: 'user_1',
            amount: -100,
            reason: 'rf_voucher_claim_spend',
            source_service: 'rf-service',
            source_event_id: 'rf:voucher:voucher_1',
            external_id: 'rf:voucher-claim-spend:voucher_1',
            metadata: { voucherId: 'voucher_1' },
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [{ balance: 250, updated_at: new Date('2026-05-01T00:00:00.000Z') }],
      });

    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
      ...rfSpendProducerEnabled,
    };
    const token = await makeServiceJwt(env.SERVICE_JWT_SECRET!, 'points-service', {
      sub: 'rf-service',
    });

    const response = await worker.fetch(
      new Request('https://points.example/internal/points/spend', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user_1',
          amount: 100,
          action: 'rf_voucher_claim_spend',
          externalId: 'rf:voucher-claim-spend:voucher_1',
          sourceEventId: 'rf:voucher:voucher_1',
          metadata: { voucherId: 'voucher_1' },
        }),
      }),
      env
    );

    const body = await readJson<{
      transactionId: string;
      applied: boolean;
      idempotentReplay: boolean;
      balanceAfter: number;
    }>(response);

    expect(response.status).toBe(200);
    expect(body).toEqual({
      transactionId: 'tx_spend_existing',
      applied: false,
      idempotentReplay: true,
      balanceAfter: 250,
    });
    expect(getSpendabilityShadowDiagnosticsSnapshot().total).toBe(0);
  });

  it('does not count idempotent spend replay as a new shadow compare', async () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'tx_spend_existing',
            user_id: 'user_1',
            amount: -100,
            reason: 'rf_voucher_claim_spend',
            source_service: 'rf-service',
            source_event_id: 'rf:voucher:voucher_1',
            external_id: 'rf:voucher-claim-spend:voucher_1',
            metadata: { voucherId: 'voucher_1' },
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [{ balance: 250, updated_at: new Date('2026-05-01T00:00:00.000Z') }],
      });

    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
      POINTS_ENABLE_SPENDABILITY_SHADOW_COMPARE: 'true',
      POINTS_ENABLE_SPENDABILITY_SHADOW_DIAGNOSTICS: 'true',
      POINTS_ENABLE_SPENDABILITY_DURABLE_EXPORT: 'true',
      ...rfSpendProducerEnabled,
    };
    const token = await makeServiceJwt(env.SERVICE_JWT_SECRET!, 'points-service', {
      sub: 'rf-service',
    });

    try {
      const response = await worker.fetch(
        new Request('https://points.example/internal/points/spend', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: 'user_1',
            amount: 100,
            action: 'rf_voucher_claim_spend',
            externalId: 'rf:voucher-claim-spend:voucher_1',
            sourceEventId: 'rf:voucher:voucher_1',
            metadata: { voucherId: 'voucher_1' },
          }),
        }),
        env
      );

      const body = await readJson<{
        transactionId: string;
        applied: boolean;
        idempotentReplay: boolean;
        balanceAfter: number;
      }>(response);
      const diagnostics = getSpendabilityShadowDiagnosticsSnapshot();

      expect(response.status).toBe(200);
      expect(body).toEqual({
        transactionId: 'tx_spend_existing',
        applied: false,
        idempotentReplay: true,
        balanceAfter: 250,
      });
      expect(diagnostics.total).toBe(0);
      expect(diagnostics.duplicateSuppressed).toBe(0);
      expect(diagnostics.exportedEvents).toBe(0);
      expect(consoleLogSpy.mock.calls.some(([message]) => String(message).includes('Points spendability durable export'))).toBe(false);
    } finally {
      consoleLogSpy.mockRestore();
    }
  });

  it('returns deterministic mismatch conflict for spend replay payload mismatch', async () => {
    executeMock.mockResolvedValueOnce({
      rows: [
        {
          id: 'tx_spend_existing',
          user_id: 'user_1',
          amount: -100,
          reason: 'rf_voucher_claim_spend',
          source_service: 'rf-service',
          source_event_id: 'rf:voucher:voucher_1',
          external_id: 'rf:voucher-claim-spend:voucher_1',
          metadata: { voucherId: 'voucher_1' },
        },
      ],
    });

    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
      ...rfSpendProducerEnabled,
    };
    const token = await makeServiceJwt(env.SERVICE_JWT_SECRET!, 'points-service', {
      sub: 'rf-service',
    });

    const response = await worker.fetch(
      new Request('https://points.example/internal/points/spend', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user_1',
          amount: 120,
          action: 'rf_voucher_claim_spend',
          externalId: 'rf:voucher-claim-spend:voucher_1',
          sourceEventId: 'rf:voucher:voucher_1',
          metadata: { voucherId: 'voucher_1' },
        }),
      }),
      env
    );

    const body = await readJson<{ error: string }>(response);
    expect(response.status).toBe(409);
    expect(body.error).toBe('REPLAY_PAYLOAD_MISMATCH');
  });

  it('returns insufficient balance without ledger mutation on spend', async () => {
    executeMock
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ transaction_id: null, balance_after: null }] })
      .mockResolvedValueOnce({ rows: [] });

    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
      ...rfSpendProducerEnabled,
    };
    const token = await makeServiceJwt(env.SERVICE_JWT_SECRET!, 'points-service', {
      sub: 'rf-service',
    });

    const response = await worker.fetch(
      new Request('https://points.example/internal/points/spend', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user_1',
          amount: 500,
          action: 'rf_voucher_claim_spend',
          externalId: 'rf:voucher-claim-spend:voucher_insufficient',
        }),
      }),
      env
    );

    const body = await readJson<{ error: string }>(response);
    expect(response.status).toBe(409);
    expect(body.error).toBe('INSUFFICIENT_POINTS_BALANCE');
    expect(executeMock).toHaveBeenCalledTimes(3);
  });

  it('records aligned denied shadow diagnostics while preserving insufficient balance outcome', async () => {
    executeMock
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ balance: 50, updated_at: new Date('2026-05-01T00:00:00.000Z') }] })
      .mockResolvedValueOnce({ rows: [{ amount: 50, reason: 'first_login' }] })
      .mockResolvedValueOnce({ rows: [{ transaction_id: null, balance_after: null }] })
      .mockResolvedValueOnce({ rows: [] });

    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
      POINTS_ENABLE_SPENDABILITY_SHADOW_COMPARE: 'true',
      POINTS_ENABLE_SPENDABILITY_SHADOW_DIAGNOSTICS: 'true',
      ...rfSpendProducerEnabled,
    };
    const token = await makeServiceJwt(env.SERVICE_JWT_SECRET!, 'points-service', {
      sub: 'rf-service',
    });

    const response = await worker.fetch(
      new Request('https://points.example/internal/points/spend', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user_1',
          amount: 500,
          action: 'rf_voucher_claim_spend',
          externalId: 'rf:voucher-claim-spend:voucher_shadow_denied',
        }),
      }),
      env
    );

    const body = await readJson<{ error: string }>(response);
    const diagnostics = getSpendabilityShadowDiagnosticsSnapshot();

    expect(response.status).toBe(409);
    expect(body.error).toBe('INSUFFICIENT_POINTS_BALANCE');
    expect(diagnostics.byDriftClass.aligned_denied).toBe(1);
  });

  it('shows negative spend transaction in ledger list response', async () => {
    executeMock.mockResolvedValueOnce({
      rows: [
        {
          id: 'tx_spend_visible',
          user_id: 'user_from_token',
          amount: -70,
          reason: 'rf_voucher_claim_spend',
          source_service: 'rf-service',
          source_event_id: 'rf:voucher:voucher_visible',
          external_id: 'rf:voucher-claim-spend:voucher_visible',
          metadata: { voucherId: 'voucher_visible' },
          created_at: new Date('2026-05-08T00:00:00.000Z'),
        },
      ],
    });

    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_from_token' });

    const response = await worker.fetch(
      new Request('https://points.example/v1/points/transactions', {
        headers: {
          'X-Gateway-Auth': token,
        },
      }),
      env
    );

    const body = await readJson<{ items: Array<{ amount: number; action: string }> }>(response);
    expect(response.status).toBe(200);
    expect(body.items[0]).toMatchObject({
      amount: -70,
      action: 'rf_voucher_claim_spend',
    });
  });

  it('returns active badge catalog entries only', async () => {
    executeMock.mockResolvedValueOnce({
      rows: [
        {
          id: 'first_quest_completed',
          code: 'first_quest_completed',
          title: 'First Quest Completed',
          description: 'Completed your first quest',
          category: 'quest',
          icon_key: 'badges/first-quest.svg',
          is_active: true,
          created_at: new Date('2026-04-24T00:00:00.000Z'),
          updated_at: new Date('2026-04-24T00:00:00.000Z'),
        },
      ],
    });

    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });

    const response = await worker.fetch(
      new Request('https://points.example/v1/points/badges', {
        headers: {
          'X-Gateway-Auth': token,
        },
      }),
      env
    );

    const body = await readJson<{
      items: Array<{
        code: string;
        title: string;
        description: string | null;
        category: string;
        iconKey: string | null;
        isActive: boolean;
      }>;
    }>(response);

    expect(response.status).toBe(200);
    expect(body.items).toEqual([
      {
        code: 'first_quest_completed',
        title: 'First Quest Completed',
        description: 'Completed your first quest',
        category: 'quest',
        iconKey: 'badges/first-quest.svg',
        isActive: true,
      },
    ]);

    const query = executeMock.mock.calls[0]?.[0] as { strings: string[] };
    expect(query.strings.join('')).toContain('FROM badges');
    expect(query.strings.join('')).toContain('WHERE is_active = true');
  });

  it('rejects missing gateway token on my badges route', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };

    const response = await worker.fetch(
      new Request('https://points.example/v1/points/badges/mine'),
      env
    );

    const body = await readJson<{ error: string; message: string }>(response);

    expect(response.status).toBe(401);
    expect(body.error).toBe('UNAUTHORIZED');
    expect(body.message).toContain('X-Gateway-Auth');
  });

  it('returns current user badges only with catalog fields', async () => {
    executeMock.mockResolvedValueOnce({
      rows: [
        {
          id: 'award_1',
          user_id: 'user_from_token',
          badge_id: 'first_quest_completed',
          badge_name: 'First Quest Completed',
          source_service: 'quest-service',
          source_type: 'quest',
          source_id: 'quest_progress_1',
          metadata: { questId: 'quest_1' },
          created_at: new Date('2026-04-24T00:00:00.000Z'),
          earned_at: new Date('2026-04-24T00:00:00.000Z'),
          badge_code: 'first_quest_completed',
          badge_title: 'First Quest Completed',
          badge_description: 'Completed your first quest',
          badge_category: 'quest',
          badge_icon_key: 'badges/first-quest.svg',
        },
      ],
    });

    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_from_token' });

    const response = await worker.fetch(
      new Request('https://points.example/v1/points/badges/mine?limit=500&userId=spoofed-user', {
        headers: {
          'X-Gateway-Auth': token,
        },
      }),
      env
    );

    const body = await readJson<{
      items: Array<{
        badgeCode: string;
        title: string;
        description: string | null;
        category: string | null;
        iconKey: string | null;
        awardedAt: string;
        sourceType: string | null;
        sourceId: string | null;
      }>;
    }>(response);

    expect(response.status).toBe(200);
    expect(body.items).toEqual([
      {
        badgeCode: 'first_quest_completed',
        title: 'First Quest Completed',
        description: 'Completed your first quest',
        category: 'quest',
        iconKey: 'badges/first-quest.svg',
        awardedAt: '2026-04-24T00:00:00.000Z',
        sourceType: 'quest',
        sourceId: 'quest_progress_1',
      },
    ]);

    const query = executeMock.mock.calls[0]?.[0] as { values: unknown[]; strings: string[] };
    expect(query.values).toContain('user_from_token');
    expect(query.values).not.toContain('spoofed-user');
    expect(query.values).toContain(100);
    expect(query.strings.join('')).toContain('LEFT JOIN badges');
  });

  it('returns empty badge list for current user when no awards exist', async () => {
    executeMock.mockResolvedValueOnce({ rows: [] });

    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_empty' });

    const response = await worker.fetch(
      new Request('https://points.example/v1/points/badges/mine', {
        headers: {
          'X-Gateway-Auth': token,
        },
      }),
      env
    );

    const body = await readJson<{ items: unknown[] }>(response);

    expect(response.status).toBe(200);
    expect(body.items).toEqual([]);
  });

  it('rejects unauthorized badge award requests', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };

    const response = await worker.fetch(
      new Request('https://points.example/internal/points/badges/award', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user_1',
          badgeCode: 'first_quest_completed',
          sourceType: 'quest',
          sourceId: 'quest_progress_1',
        }),
      }),
      env
    );

    const body = await readJson<{ error: string; message: string }>(response);

    expect(response.status).toBe(401);
    expect(body.error).toBe('UNAUTHORIZED');
    expect(body.message).toContain('Authorization');
  });

  it('awards an active badge without touching points ledger tables', async () => {
    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'first_quest_completed',
            code: 'first_quest_completed',
            title: 'First Quest Completed',
            description: 'Completed your first quest',
            category: 'quest',
            icon_key: 'badges/first-quest.svg',
            is_active: true,
            created_at: new Date('2026-04-24T00:00:00.000Z'),
            updated_at: new Date('2026-04-24T00:00:00.000Z'),
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'award_1',
            user_id: 'user_1',
            badge_id: 'first_quest_completed',
            badge_name: 'First Quest Completed',
            source_service: 'quest-service',
            source_type: 'quest',
            source_id: 'quest_progress_1',
            metadata: { questId: 'quest_1' },
            created_at: new Date('2026-04-24T00:00:00.000Z'),
            earned_at: new Date('2026-04-24T00:00:00.000Z'),
          },
        ],
      });

    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeServiceJwt(env.SERVICE_JWT_SECRET!, 'points-service', {
      sub: 'quest-service',
    });

    const response = await worker.fetch(
      new Request('https://points.example/internal/points/badges/award', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user_1',
          badgeCode: 'first_quest_completed',
          sourceType: 'quest',
          sourceId: 'quest_progress_1',
          metadata: { questId: 'quest_1' },
        }),
      }),
      env
    );

    const body = await readJson<{
      badgeCode: string;
      userId: string;
      awardId: string;
      applied: boolean;
      awardedAt: string;
    }>(response);

    expect(response.status).toBe(200);
    expect(body).toEqual({
      badgeCode: 'first_quest_completed',
      userId: 'user_1',
      awardId: 'award_1',
      applied: true,
      awardedAt: '2026-04-24T00:00:00.000Z',
    });

    const insertQuery = executeMock.mock.calls[2]?.[0] as { values: unknown[]; strings: string[] };
    expect(insertQuery.values).toEqual(
      expect.arrayContaining([
        'user_1',
        'first_quest_completed',
        'First Quest Completed',
        'quest-service',
        'quest',
        'quest_progress_1',
      ])
    );

    const allSql = executeMock.mock.calls
      .map((call) => ((call[0] as { strings?: string[] }).strings ?? []).join(' '))
      .join('\n');
    expect(allSql).not.toContain('points_transactions');
    expect(allSql).not.toContain('user_balances');
  });

  it('returns applied=false for duplicate badge award with the same source', async () => {
    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'first_quest_completed',
            code: 'first_quest_completed',
            title: 'First Quest Completed',
            description: 'Completed your first quest',
            category: 'quest',
            icon_key: 'badges/first-quest.svg',
            is_active: true,
            created_at: new Date('2026-04-24T00:00:00.000Z'),
            updated_at: new Date('2026-04-24T00:00:00.000Z'),
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'award_existing',
            user_id: 'user_1',
            badge_id: 'first_quest_completed',
            badge_name: 'First Quest Completed',
            source_service: 'quest-service',
            source_type: 'quest',
            source_id: 'quest_progress_1',
            metadata: {},
            created_at: new Date('2026-04-24T00:00:00.000Z'),
            earned_at: new Date('2026-04-24T00:00:00.000Z'),
          },
        ],
      });

    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeServiceJwt(env.SERVICE_JWT_SECRET!, 'points-service', {
      sub: 'quest-service',
    });

    const response = await worker.fetch(
      new Request('https://points.example/internal/points/badges/award', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user_1',
          badgeCode: 'first_quest_completed',
          sourceType: 'quest',
          sourceId: 'quest_progress_1',
        }),
      }),
      env
    );

    const body = await readJson<{ applied: boolean; awardId: string }>(response);

    expect(response.status).toBe(200);
    expect(body.applied).toBe(false);
    expect(body.awardId).toBe('award_existing');
    expect(executeMock).toHaveBeenCalledTimes(2);
  });

  it('returns 409 for duplicate badge award with a different source', async () => {
    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'first_quest_completed',
            code: 'first_quest_completed',
            title: 'First Quest Completed',
            description: 'Completed your first quest',
            category: 'quest',
            icon_key: 'badges/first-quest.svg',
            is_active: true,
            created_at: new Date('2026-04-24T00:00:00.000Z'),
            updated_at: new Date('2026-04-24T00:00:00.000Z'),
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'award_existing',
            user_id: 'user_1',
            badge_id: 'first_quest_completed',
            badge_name: 'First Quest Completed',
            source_service: 'quest-service',
            source_type: 'quest',
            source_id: 'quest_progress_1',
            metadata: {},
            created_at: new Date('2026-04-24T00:00:00.000Z'),
            earned_at: new Date('2026-04-24T00:00:00.000Z'),
          },
        ],
      });

    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeServiceJwt(env.SERVICE_JWT_SECRET!, 'points-service', {
      sub: 'referral-service',
    });

    const response = await worker.fetch(
      new Request('https://points.example/internal/points/badges/award', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user_1',
          badgeCode: 'first_quest_completed',
          sourceType: 'quest',
          sourceId: 'quest_progress_2',
        }),
      }),
      env
    );

    const body = await readJson<{ error: string; message: string }>(response);

    expect(response.status).toBe(409);
    expect(body.error).toBe('Conflict');
    expect(body.message).toContain('different source');
  });

  it('rejects inactive and unknown badge awards', async () => {
    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'inactive_badge',
            code: 'inactive_badge',
            title: 'Inactive Badge',
            description: null,
            category: 'quest',
            icon_key: null,
            is_active: false,
            created_at: new Date('2026-04-24T00:00:00.000Z'),
            updated_at: new Date('2026-04-24T00:00:00.000Z'),
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [] });

    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeServiceJwt(env.SERVICE_JWT_SECRET!, 'points-service', {
      sub: 'quest-service',
    });

    const inactiveResponse = await worker.fetch(
      new Request('https://points.example/internal/points/badges/award', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user_1',
          badgeCode: 'inactive_badge',
          sourceType: 'quest',
          sourceId: 'quest_progress_1',
        }),
      }),
      env
    );

    const inactiveBody = await readJson<{ error: string }>(inactiveResponse);
    expect(inactiveResponse.status).toBe(409);
    expect(inactiveBody.error).toBe('Conflict');

    const unknownResponse = await worker.fetch(
      new Request('https://points.example/internal/points/badges/award', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user_1',
          badgeCode: 'missing_badge',
          sourceType: 'quest',
          sourceId: 'quest_progress_1',
        }),
      }),
      env
    );

    const unknownBody = await readJson<{ error: string }>(unknownResponse);
    expect(unknownResponse.status).toBe(404);
    expect(unknownBody.error).toBe('NotFound');
  });

  it('rejects invalid badge award payloads', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeServiceJwt(env.SERVICE_JWT_SECRET!, 'points-service', {
      sub: 'quest-service',
    });

    const response = await worker.fetch(
      new Request('https://points.example/internal/points/badges/award', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user_1',
          badgeCode: 'first_quest_completed',
          sourceType: '',
          sourceId: 'quest_progress_1',
          metadata: ['invalid'],
        }),
      }),
      env
    );

    const body = await readJson<{ error: string; message: string }>(response);

    expect(response.status).toBe(400);
    expect(body.error).toBe('BadRequest');
    expect(body.message).toContain('sourceType');
  });
});
