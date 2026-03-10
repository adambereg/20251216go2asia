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
    expect(body.error).toBe('Unauthorized');
    expect(body.message).toContain('X-Gateway-Auth');
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
    expect(body.error).toBe('Unauthorized');
    expect(body.message).toContain('claims');
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
});
