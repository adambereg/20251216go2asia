import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@clerk/backend', () => ({
  verifyToken: vi.fn(),
}));

import { verifyToken } from '@clerk/backend';
import {
  buildRequestContext,
  classifyRoute,
  deriveEnforcementKeys,
  default as worker,
  type Env,
} from '../src/index';
import { decodeJwtPayload, readJson } from '../../../tests/helpers/worker-test';

function base64Url(input: string): string {
  return Buffer.from(input, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function makeUnsignedJwt(payload: Record<string, unknown>): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  return `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(payload))}.sig`;
}

describe('api-gateway request hardening', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('classifies routes into stable routeKey and domain-oriented routeGroup', () => {
    expect(classifyRoute('GET', '/v1/points/balance')).toEqual({
      routeKey: 'points.balance.get',
      routeGroup: 'points',
    });
    expect(classifyRoute('POST', '/v1/content/events/event_1/register')).toEqual({
      routeKey: 'content.events.register.post',
      routeGroup: 'content-engagement',
    });
    expect(classifyRoute('POST', '/v1/media/upload-token')).toEqual({
      routeKey: 'media.upload-token.post',
      routeGroup: 'media',
    });
  });

  it('builds request context with hashed client fingerprint for anonymous routes', async () => {
    const request = new Request('https://gateway.example/v1/content/events', {
      headers: {
        'CF-Connecting-IP': '203.0.113.5',
        'User-Agent': 'Vitest Browser/1.0',
      },
    });

    const context = await buildRequestContext(request, null, 'req_test_anon');

    expect(context).toMatchObject({
      requestId: 'req_test_anon',
      actorType: 'anonymous',
      actorId: null,
      roles: [],
      authLevel: 'anonymous',
      routeKey: 'content.events.list.get',
      routeGroup: 'content-read',
    });
    expect(context.clientIpHash).toBeTruthy();
    expect(context.userAgentHash).toBeTruthy();
  });

  it('derives stable enforcement keys for authenticated user routes', async () => {
    const request = new Request('https://gateway.example/v1/referral/claim', {
      method: 'POST',
      headers: {
        'CF-Connecting-IP': '198.51.100.25',
        'User-Agent': 'Vitest Browser/1.0',
      },
    });

    const context = await buildRequestContext(
      request,
      {
        userId: 'user_123',
        roles: ['member', 'pro'],
      },
      'req_test_user'
    );
    const keys = deriveEnforcementKeys(context);

    expect(context).toMatchObject({
      actorType: 'user',
      actorId: 'user_123',
      authLevel: 'user',
      routeKey: 'referral.claim.post',
      routeGroup: 'referral',
      roles: ['member', 'pro'],
    });
    expect(keys.quotaKey).toBe('user:user_123:route-group:referral');
    expect(keys.abuseKey).toContain('user:user_123:ip:');
    expect(keys.abuseKey).toContain(':route-key:referral.claim.post');
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

  it('returns 501 for reserved phase-2 prefix when service is not enabled', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const response = await worker.fetch(
      new Request('https://gateway.example/v1/space/posts', {
        headers: {
          Origin: 'https://app.example',
        },
      }),
      {}
    );

    const body = await readJson<{ error: { code: string; message: string } }>(response);

    expect(response.status).toBe(501);
    expect(body.error.code).toBe('ROUTE_RESERVED_NOT_ENABLED');
    expect(body.error.message).toContain('SPACE_SERVICE_URL');
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('https://app.example');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('proxies reserved phase-2 prefix after service URL is configured', async () => {
    const fetchMock = vi.fn(async (request: Request) => {
      expect(request.url).toBe('https://space.example/v1/space/posts');
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
    vi.stubGlobal('fetch', fetchMock);

    const response = await worker.fetch(
      new Request('https://gateway.example/v1/space/posts'),
      {
        SPACE_SERVICE_URL: 'https://space.example',
      }
    );

    const body = await readJson<{ ok: boolean }>(response);
    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
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

  it('routes canonical /v1/media/* requests through content-service fallback and normalizes uploadUrl', async () => {
    const fetchMock = vi.fn(async (request: Request) => {
      expect(request.url).toBe('https://content.example/v1/content/media/upload-token');
      expect(request.headers.get('X-Gateway-Auth')).toBeTruthy();
      expect(request.headers.get('X-User-ID')).toBe('media_user');

      return new Response(
        JSON.stringify({
          uploadUrl: '/v1/content/media/upload/signed-token',
          key: 'uploads/space/media_user/123/file.jpg',
          publicUrl: 'https://cdn.example/file.jpg',
          expiresAt: '2026-03-10T00:00:00.000Z',
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    });
    vi.stubGlobal('fetch', fetchMock);
    vi.mocked(verifyToken).mockResolvedValue({
      sub: 'media_user',
      roles: ['member'],
    } as never);

    const env: Env = {
      CONTENT_SERVICE_URL: 'https://content.example',
      CLERK_SECRET_KEY: 'sk_test_123',
      SERVICE_JWT_SECRET: 'service-secret',
    };

    const response = await worker.fetch(
      new Request('https://gateway.example/v1/media/upload-token', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer clerk-session-token',
          'Content-Type': 'application/json',
          Origin: 'https://app.example',
        },
        body: JSON.stringify({
          scope: 'space',
          filename: 'file.jpg',
          contentType: 'image/jpeg',
        }),
      }),
      env
    );

    const body = await readJson<{ uploadUrl: string; key: string }>(response);

    expect(response.status).toBe(200);
    expect(body.uploadUrl).toBe('/v1/media/upload/signed-token');
    expect(body.key).toContain('uploads/space/media_user/');
    expect(response.headers.get('X-Proxy-Target-Path')).toBe('/v1/content/media/upload-token');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('routes canonical /v1/media/* directly to media-service when configured', async () => {
    const fetchMock = vi.fn(async (request: Request) => {
      expect(request.url).toBe('https://media.example/v1/media/upload-token');
      return new Response(
        JSON.stringify({
          uploadUrl: '/v1/media/upload/signed-token',
          key: 'uploads/content/media_user/123/file.jpg',
          publicUrl: 'https://media.go2asia.space/uploads/content/media_user/123/file.jpg',
          expiresAt: '2026-03-11T00:00:00.000Z',
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    });
    vi.stubGlobal('fetch', fetchMock);
    vi.mocked(verifyToken).mockResolvedValue({
      sub: 'media_user',
      roles: ['member'],
    } as never);

    const env: Env = {
      MEDIA_SERVICE_URL: 'https://media.example',
      CONTENT_SERVICE_URL: 'https://content.example',
      CLERK_SECRET_KEY: 'sk_test_123',
      SERVICE_JWT_SECRET: 'service-secret',
    };

    const response = await worker.fetch(
      new Request('https://gateway.example/v1/media/upload-token', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer clerk-session-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scope: 'content',
          filename: 'file.jpg',
          contentType: 'image/jpeg',
        }),
      }),
      env
    );

    const body = await readJson<{ uploadUrl: string; key: string }>(response);

    expect(response.status).toBe(200);
    expect(body.uploadUrl).toBe('/v1/media/upload/signed-token');
    expect(response.headers.get('X-Proxy-Target-Path')).toBe('/v1/media/upload-token');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('derives authorizedParties from token azp when Origin header is absent', async () => {
    const fetchMock = vi.fn(async () => {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
    vi.stubGlobal('fetch', fetchMock);
    vi.mocked(verifyToken).mockResolvedValue({
      sub: 'media_user',
      roles: ['member'],
    } as never);

    const sessionJwt = makeUnsignedJwt({
      iss: 'https://upward-marmot-95.clerk.accounts.dev',
      azp: 'https://go2asia.space',
      sub: 'media_user',
      exp: Math.floor(Date.now() / 1000) + 300,
      iat: Math.floor(Date.now() / 1000),
    });

    const response = await worker.fetch(
      new Request('https://gateway.example/v1/media/upload-token', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sessionJwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scope: 'content',
          filename: 'file.jpg',
          contentType: 'image/jpeg',
        }),
      }),
      {
        MEDIA_SERVICE_URL: 'https://media.example',
        CLERK_SECRET_KEY: 'sk_test_123',
        SERVICE_JWT_SECRET: 'service-secret',
      }
    );

    expect(response.status).toBe(200);
    expect(vi.mocked(verifyToken)).toHaveBeenCalledWith(
      sessionJwt,
      expect.objectContaining({
        secretKey: 'sk_test_123',
        authorizedParties: ['https://go2asia.space'],
      })
    );
  });
});
