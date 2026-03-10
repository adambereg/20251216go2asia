import { afterEach, describe, expect, it, vi } from 'vitest';

import worker, { type Env } from '../src/index';
import { makeUserJwt, readJson } from '../../../tests/helpers/worker-test';

describe('api-gateway request hardening', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('returns 401 for protected user route without bearer token', async () => {
    const env: Env = {
      POINTS_SERVICE_URL: 'https://points.example',
      SERVICE_JWT_SECRET: 'service-secret',
    };

    const response = await worker.fetch(
      new Request('https://gateway.example/v1/points/balance', {
        headers: {
          Origin: 'https://app.example',
        },
      }),
      env
    );

    const body = await readJson<{ error: { code: string } }>(response);

    expect(response.status).toBe(401);
    expect(body.error.code).toBe('UNAUTHORIZED');
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('https://app.example');
    expect(response.headers.get('X-Request-ID')).toBeTruthy();
  });

  it('returns 503 when a known service route is not configured', async () => {
    const response = await worker.fetch(
      new Request('https://gateway.example/v1/referral/stats'),
      {}
    );

    const body = await readJson<{ error: { code: string; message: string } }>(response);

    expect(response.status).toBe(503);
    expect(body.error.code).toBe('SERVICE_NOT_CONFIGURED');
    expect(body.error.message).toContain('REFERRAL_SERVICE_URL');
  });

  it('keeps debug routes disabled by default', async () => {
    const response = await worker.fetch(
      new Request('https://gateway.example/v1/_debug/routes'),
      {}
    );

    expect(response.status).toBe(404);
  });

  it('forwards authenticated user context and overwrites spoofed X-User-ID', async () => {
    const fetchMock = vi.fn(async (request: Request) => {
      expect(request.headers.get('X-User-ID')).toBe('user_from_jwt');
      expect(request.headers.get('X-Gateway-Auth')).toBeTruthy();
      expect(request.headers.get('X-Request-Id')).toBeTruthy();

      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
    vi.stubGlobal('fetch', fetchMock);

    const env: Env = {
      POINTS_SERVICE_URL: 'https://points.example',
      CLERK_JWT_SECRET: 'clerk-secret',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeUserJwt(env.CLERK_JWT_SECRET!, { sub: 'user_from_jwt' });

    const response = await worker.fetch(
      new Request('https://gateway.example/v1/points/balance', {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-User-ID': 'spoofed-user',
        },
      }),
      env
    );

    const body = await readJson<{ ok: boolean }>(response);

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
