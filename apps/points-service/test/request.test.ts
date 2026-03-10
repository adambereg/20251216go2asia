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

describe('points-service request hardening', () => {
  beforeEach(() => {
    createDbMock.mockClear();
    executeMock.mockReset();
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

  it('returns applied=false for duplicate externalId with the same payload', async () => {
    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'tx_existing',
            user_id: 'user_1',
            amount: 100,
            reason: 'registration',
            external_id: 'ext_same',
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
          external_id: 'ext_conflict',
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
        }),
      }),
      env
    );

    const body = await readJson<{ error: string; message: string }>(response);

    expect(response.status).toBe(409);
    expect(body.error).toBe('Conflict');
    expect(body.message).toContain('externalId already exists');
  });
});
