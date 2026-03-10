import { describe, expect, it } from 'vitest';

import worker, { type Env } from '../src/index';
import { makeGatewayJwt, readJson } from '../../../tests/helpers/worker-test';

describe('auth-service request hardening', () => {
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
});
