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

import worker, { type Env } from '../src/index';
import { makeGatewayJwt, makeServiceJwt, readJson } from '../../../tests/helpers/worker-test';

describe('referral-service request hardening', () => {
  beforeEach(() => {
    createDbMock.mockClear();
    executeMock.mockReset();
  });

  it('rejects missing gateway token on user route', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };

    const response = await worker.fetch(
      new Request('https://referral.example/v1/referral/code'),
      env
    );

    const body = await readJson<{ error: string; message: string }>(response);

    expect(response.status).toBe(401);
    expect(body.error).toBe('UNAUTHORIZED');
    expect(body.message).toContain('X-Gateway-Auth');
  });

  it('returns 503 when service auth is not configured on user route', async () => {
    const response = await worker.fetch(
      new Request('https://referral.example/v1/referral/code'),
      {
        DATABASE_URL: 'postgres://example',
      }
    );

    const body = await readJson<{ error: string; message: string }>(response);

    expect(response.status).toBe(503);
    expect(body.error).toBe('SERVICE_AUTH_NOT_CONFIGURED');
    expect(body.message).toContain('not configured');
  });

  it('rejects invalid gateway token claims on user route', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { aud: 'wrong-audience' });

    const response = await worker.fetch(
      new Request('https://referral.example/v1/referral/code', {
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

  it('returns 503 when service auth is not configured on internal route', async () => {
    const response = await worker.fetch(
      new Request('https://referral.example/internal/referral/mark-first-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: 'user_1' }),
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

  it('returns relationFound=false when first-login is marked for a user without referral relation', async () => {
    executeMock.mockResolvedValueOnce({ rows: [] });

    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeServiceJwt(env.SERVICE_JWT_SECRET!, 'referral-service', {
      sub: 'auth-service',
    });

    const response = await worker.fetch(
      new Request('https://referral.example/internal/referral/mark-first-login', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: 'user_without_relation' }),
      }),
      env
    );

    const body = await readJson<{ ok: boolean; relationFound: boolean; activated: boolean }>(response);

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.relationFound).toBe(false);
    expect(body.activated).toBe(false);
  });

  it('rejects self-claim for referral code', async () => {
    executeMock.mockResolvedValueOnce({
      rows: [{ user_id: 'user_self' }],
    });

    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, {
      sub: 'user_self',
    });

    const response = await worker.fetch(
      new Request('https://referral.example/v1/referral/claim', {
        method: 'POST',
        headers: {
          'X-Gateway-Auth': token,
          'X-User-ID': 'spoofed-user',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: 'SELF123' }),
      }),
      env
    );

    const body = await readJson<{ error: string; message: string }>(response);

    expect(response.status).toBe(409);
    expect(body.error).toBe('Conflict');
    expect(body.message).toContain('own referral code');
  });

  it('rejects missing gateway token on referral earnings route', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };

    const response = await worker.fetch(
      new Request('https://referral.example/v1/referral/earnings'),
      env
    );

    const body = await readJson<{ error: string; message: string }>(response);
    expect(response.status).toBe(401);
    expect(body.error).toBe('UNAUTHORIZED');
    expect(body.message).toContain('X-Gateway-Auth');
  });

  it('returns referral earnings summary and items for the authenticated user only', async () => {
    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            total_referrals: 3,
            activated_referrals: 2,
            pending_referrals: 1,
            total_earned_points: 100,
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            referee_id: 'user_pending',
            registered_at: '2026-04-22T10:00:00.000Z',
            first_login_at: null,
          },
          {
            referee_id: 'user_activated_without_points',
            registered_at: '2026-04-21T10:00:00.000Z',
            first_login_at: '2026-04-23T09:00:00.000Z',
          },
          {
            referee_id: 'user_activated_with_points',
            registered_at: '2026-04-20T10:00:00.000Z',
            first_login_at: '2026-04-24T09:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            external_id: 'referral:first_login:user_referrer:user_activated_with_points',
            id: 'ptx_1',
            amount: 100,
            created_at: '2026-04-24T09:00:01.000Z',
          },
          {
            external_id: 'referral:first_login:user_referrer:user_other',
            id: 'ptx_ignored',
            amount: 999,
            created_at: '2026-04-24T09:05:00.000Z',
          },
        ],
      });

    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, {
      sub: 'user_referrer',
    });

    const response = await worker.fetch(
      new Request('https://referral.example/v1/referral/earnings?userId=spoofed-user', {
        headers: {
          'X-Gateway-Auth': token,
        },
      }),
      env
    );

    const body = await readJson<{
      summary: {
        totalEarnedPoints: number;
        activatedReferrals: number;
        pendingReferrals: number;
        totalReferrals: number;
      };
      items: Array<{
        refereeUserId: string;
        status: string;
        activatedAt: string | null;
        earnedPoints: number;
        pointsAction: string;
        pointsExternalId: string;
        pointsTransactionId: string | null;
        pointsAppliedAt: string | null;
      }>;
    }>(response);

    expect(response.status).toBe(200);
    expect(body.summary).toEqual({
      totalEarnedPoints: 100,
      activatedReferrals: 2,
      pendingReferrals: 1,
      totalReferrals: 3,
    });
    expect(body.items).toEqual([
      {
        refereeUserId: 'user_pending',
        status: 'pending',
        activatedAt: null,
        earnedPoints: 0,
        pointsAction: 'referral_bonus_referrer',
        pointsExternalId: 'referral:first_login:user_referrer:user_pending',
        pointsTransactionId: null,
        pointsAppliedAt: null,
      },
      {
        refereeUserId: 'user_activated_without_points',
        status: 'reward_missing',
        activatedAt: '2026-04-23T09:00:00.000Z',
        earnedPoints: 0,
        pointsAction: 'referral_bonus_referrer',
        pointsExternalId: 'referral:first_login:user_referrer:user_activated_without_points',
        pointsTransactionId: null,
        pointsAppliedAt: null,
      },
      {
        refereeUserId: 'user_activated_with_points',
        status: 'rewarded',
        activatedAt: '2026-04-24T09:00:00.000Z',
        earnedPoints: 100,
        pointsAction: 'referral_bonus_referrer',
        pointsExternalId: 'referral:first_login:user_referrer:user_activated_with_points',
        pointsTransactionId: 'ptx_1',
        pointsAppliedAt: '2026-04-24T09:00:01.000Z',
      },
    ]);

    const summaryQuery = executeMock.mock.calls[0]?.[0] as { values: unknown[]; strings: string[] };
    expect(summaryQuery.values).toContain('user_referrer');
    expect(summaryQuery.values).not.toContain('spoofed-user');
    expect(summaryQuery.strings.join('')).toContain('FROM referral_relations rr');
    expect(summaryQuery.strings.join('')).toContain('LEFT JOIN points_transactions pt');

    const relationsQuery = executeMock.mock.calls[1]?.[0] as { values: unknown[]; strings: string[] };
    expect(relationsQuery.values).toContain('user_referrer');
    expect(relationsQuery.values).toContain(20);
    expect(relationsQuery.strings.join('')).toContain('FROM referral_relations');
    expect(relationsQuery.strings.join('')).toContain('LIMIT ');

    const pointsQuery = executeMock.mock.calls[2]?.[0] as { values: unknown[]; strings: string[] };
    expect(pointsQuery.values).toContain('user_referrer');
    expect(pointsQuery.strings.join('')).toContain('FROM points_transactions');
    expect(pointsQuery.strings.join('')).toContain("reason = 'referral_bonus_referrer'");
  });

  it('clamps referral earnings limit to max 100', async () => {
    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            total_referrals: 0,
            activated_referrals: 0,
            pending_referrals: 0,
            total_earned_points: 0,
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [] });

    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, {
      sub: 'user_referrer',
    });

    const response = await worker.fetch(
      new Request('https://referral.example/v1/referral/earnings?limit=500', {
        headers: {
          'X-Gateway-Auth': token,
        },
      }),
      env
    );

    const body = await readJson<{
      summary: {
        totalEarnedPoints: number;
        activatedReferrals: number;
        pendingReferrals: number;
        totalReferrals: number;
      };
      items: unknown[];
    }>(response);

    expect(response.status).toBe(200);
    expect(body.summary).toEqual({
      totalEarnedPoints: 0,
      activatedReferrals: 0,
      pendingReferrals: 0,
      totalReferrals: 0,
    });
    expect(body.items).toEqual([]);
    expect(executeMock).toHaveBeenCalledTimes(2);

    const relationsQuery = executeMock.mock.calls[1]?.[0] as { values: unknown[] };
    expect(relationsQuery.values).toContain(100);
  });
});
