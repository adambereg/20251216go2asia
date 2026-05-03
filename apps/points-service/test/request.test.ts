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

describe('points-service request hardening', () => {
  beforeEach(() => {
    createDbMock.mockClear();
    executeMock.mockReset();
  });

  it('computes wallet buckets from mixed ledger transactions', () => {
    expect(
      computeWalletBuckets([
        { amount: 1000, reason: 'space_post_created' },
        { amount: 5000, reason: 'referral_locked' },
        { amount: 100, reason: 'network_accrual_level_1' },
        { amount: 20, reason: 'network_accrual_level_2' },
        { amount: -200, reason: 'rf_voucher_claimed' },
      ])
    ).toEqual({
      availablePoints: 800,
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
      availablePoints: 800,
      lockedPoints: 5000,
      networkPoints: 120,
      totalPoints: 5920,
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
        'auth-service',
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
    const token = await makeServiceJwt(env.SERVICE_JWT_SECRET!, 'points-service');

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
    const token = await makeServiceJwt(env.SERVICE_JWT_SECRET!, 'points-service');

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
