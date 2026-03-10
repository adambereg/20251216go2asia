import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@clerk/backend', () => ({
  verifyToken: vi.fn(),
}));

import { verifyToken } from '@clerk/backend';
import worker, { type Env } from '../src/index';
import { decodeJwtPayload, readJson } from '../../../tests/helpers/worker-test';

describe('api-gateway request hardening', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('does not require legacy CLERK_JWT_SECRET in readiness checks', async () => {
    const response = await worker.fetch(
      new Request('https://gateway.example/ready'),
      {
        AUTH_SERVICE_URL: 'https://auth.example',
        CONTENT_SERVICE_URL: 'https://content.example',
        POINTS_SERVICE_URL: 'https://points.example',
        REFERRAL_SERVICE_URL: 'https://referral.example',
        CLERK_SECRET_KEY: 'sk_test_123',
        SERVICE_JWT_SECRET: 'service-secret',
      }
    );

    const body = await readJson<{ status: string; checks: Record<string, string> }>(response);

    expect(response.status).toBe(200);
    expect(body.status).toBe('ready');
    expect(body.checks.clerkSecretKey).toBe('ok');
    expect(body.checks.clerkJwtSecret).toBeUndefined();
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

  it('returns 503 when bearer token is present but Clerk verification is not configured', async () => {
    const response = await worker.fetch(
      new Request('https://gateway.example/v1/points/balance', {
        headers: {
          Authorization: 'Bearer token-without-config',
        },
      }),
      {
        POINTS_SERVICE_URL: 'https://points.example',
        SERVICE_JWT_SECRET: 'service-secret',
      }
    );

    const body = await readJson<{ error: { code: string; message: string } }>(response);

    expect(response.status).toBe(503);
    expect(body.error.code).toBe('SERVICE_AUTH_NOT_CONFIGURED');
    expect(body.error.message).toContain('not configured');
  });

  it('forwards authenticated user context and overwrites spoofed X-User-ID', async () => {
    let gatewayClaims: Record<string, unknown> | null = null;
    const fetchMock = vi.fn(async (request: Request) => {
      expect(request.headers.get('X-User-ID')).toBe('user_from_jwt');
      const gatewayToken = request.headers.get('X-Gateway-Auth');
      expect(gatewayToken).toBeTruthy();
      expect(request.headers.get('X-Request-Id')).toBeTruthy();
      gatewayClaims = decodeJwtPayload<Record<string, unknown>>(gatewayToken!);

      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
    vi.stubGlobal('fetch', fetchMock);
    vi.mocked(verifyToken).mockResolvedValue({
      sub: 'user_from_jwt',
      roles: ['member', 'beta'],
    } as never);

    const env: Env = {
      POINTS_SERVICE_URL: 'https://points.example',
      CLERK_SECRET_KEY: 'sk_test_123',
      SERVICE_JWT_SECRET: 'service-secret',
    };

    const response = await worker.fetch(
      new Request('https://gateway.example/v1/points/balance', {
        headers: {
          Authorization: 'Bearer clerk-session-token',
          Origin: 'https://app.example',
          'X-User-ID': 'spoofed-user',
        },
      }),
      env
    );

    const body = await readJson<{ ok: boolean }>(response);

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(gatewayClaims).toMatchObject({
      iss: 'api-gateway',
      aud: 'internal',
      sub: 'user_from_jwt',
      rid: expect.any(String),
      roles: ['member', 'beta'],
    });
    expect(typeof gatewayClaims?.iat).toBe('number');
    expect(typeof gatewayClaims?.exp).toBe('number');
    expect((gatewayClaims?.exp as number) - (gatewayClaims?.iat as number)).toBe(300);
    expect(vi.mocked(verifyToken)).toHaveBeenCalledWith(
      'clerk-session-token',
      expect.objectContaining({
        secretKey: 'sk_test_123',
        authorizedParties: ['https://app.example'],
      })
    );
  });
});
