import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('svix', () => ({
  Webhook: class {
    verify(): void {
      // no-op for tests
    }
  },
}));

import worker, { type Env } from '../src/index';
import { makeGatewayJwt, readJson } from '../../../tests/helpers/worker-test';

describe('auth-service request hardening', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('rejects users.ensure without X-Gateway-Auth', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
    };

    const response = await worker.fetch(
      new Request('https://auth.example/v1/users/ensure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'user@example.com' }),
      }),
      env
    );

    const body = await readJson<{ error: { code: string; message: string } }>(response);

    expect(response.status).toBe(401);
    expect(body.error.code).toBe('UNAUTHORIZED');
    expect(body.error.message).toContain('X-Gateway-Auth');
  });

  it('rejects users.ensure when gateway token has no user subject', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: '' });

    const response = await worker.fetch(
      new Request('https://auth.example/v1/users/ensure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': token,
        },
        body: JSON.stringify({ email: 'user@example.com' }),
      }),
      env
    );

    const body = await readJson<{ error: { code: string; message: string } }>(response);

    expect(response.status).toBe(401);
    expect(body.error.code).toBe('UNAUTHORIZED');
    expect(body.error.message).toContain('subject');
  });

  it('returns 503 for Clerk webhook when secret is missing', async () => {
    const response = await worker.fetch(
      new Request('https://auth.example/v1/auth/webhook/clerk', {
        method: 'POST',
        body: JSON.stringify({ type: 'user.created', data: { id: 'user_1' } }),
      }),
      {}
    );

    const body = await readJson<{ error: { code: string; message: string } }>(response);

    expect(response.status).toBe(503);
    expect(body.error.code).toBe('SERVICE_NOT_CONFIGURED');
    expect(body.error.message).toContain('CLERK_WEBHOOK_SECRET');
  });

  it('returns 401 for Clerk webhook without svix headers', async () => {
    const env: Env = {
      CLERK_WEBHOOK_SECRET: 'whsec_test',
    };

    const response = await worker.fetch(
      new Request('https://auth.example/v1/auth/webhook/clerk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'user.created', data: { id: 'user_1' } }),
      }),
      env
    );

    const body = await readJson<{ error: { code: string; message: string } }>(response);

    expect(response.status).toBe(401);
    expect(body.error.code).toBe('Unauthorized');
    expect(body.error.message).toContain('signature headers');
  });

  it('uses stable first_login externalId when forwarding points award', async () => {
    const fetchMock = vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
      expect(String(input)).toBe('https://points.example/internal/points/add');
      const headers = new Headers(init?.headers);
      expect(headers.get('Authorization')).toMatch(/^Bearer\s.+/);
      const payload = JSON.parse(String(init?.body)) as {
        userId: string;
        amount: number;
        action: string;
        externalId: string;
        sourceEventId?: string;
        metadata?: Record<string, unknown>;
      };

      expect(payload.userId).toBe('user_1');
      expect(payload.amount).toBe(50);
      expect(payload.action).toBe('first_login');
      expect(payload.externalId).toBe('auth:first_login:user_1');
      expect(payload.sourceEventId).toBe('clerk:user.updated:first_login:user_1');
      expect(payload.metadata).toEqual({
        clerkEventType: 'user.updated',
        reason: 'first_login',
      });

      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
    vi.stubGlobal('fetch', fetchMock);

    const env: Env = {
      CLERK_WEBHOOK_SECRET: 'whsec_test',
      SERVICE_JWT_SECRET: 'service-secret',
      POINTS_SERVICE_URL: 'https://points.example',
    };

    const response = await worker.fetch(
      new Request('https://auth.example/v1/auth/webhook/clerk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'svix-id': 'svix_1',
          'svix-timestamp': '1700000000',
          'svix-signature': 'sig_test',
        },
        body: JSON.stringify({
          type: 'user.updated',
          data: {
            id: 'user_1',
            last_sign_in_at: '2026-04-24T10:00:00.000Z',
          },
        }),
      }),
      env
    );

    const body = await readJson<{ ok: boolean; userId: string }>(response);

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.userId).toBe('user_1');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
