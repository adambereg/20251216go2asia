import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { createSqlClientMock } = vi.hoisted(() => ({
  createSqlClientMock: vi.fn(),
}));

vi.mock('@go2asia/db/queries/content', async () => {
  const actual = await vi.importActual<typeof import('@go2asia/db/queries/content')>('@go2asia/db/queries/content');
  return {
    ...actual,
    createSqlClient: createSqlClientMock,
  };
});

import worker, { type Env } from '../src/index';
import { makeGatewayJwt, readJson } from '../../../tests/helpers/worker-test';

describe('content-service request hardening', () => {
  beforeEach(() => {
    createSqlClientMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('rejects event registration without X-Gateway-Auth', async () => {
    const response = await worker.fetch(
      new Request('https://content.example/v1/content/events/event_1/register', {
        method: 'POST',
      }),
      {}
    );

    const body = await readJson<{ error: { code: string; message: string } }>(response);

    expect(response.status).toBe(503);
    expect(body.error.code).toBe('SERVICE_AUTH_NOT_CONFIGURED');
  });

  it('returns isActive in public event responses', async () => {
    const sqlClientMock = vi
      .fn()
      .mockResolvedValueOnce([{ total: 1 }])
      .mockResolvedValueOnce([
        {
          id: 'event_1',
          title: 'Event One',
          slug: 'event-one',
          description: 'Body',
          short_description: 'Short',
          category: 'festival',
          country_slug: 'singapore',
          city_slug: 'singapore',
          country_name: 'Singapore',
          city_name: 'Singapore',
          year: 2026,
          start_at: '2026-12-24T10:00:00.000Z',
          start_date: '2026-12-24T10:00:00.000Z',
          end_at: null,
          end_date: null,
          location: null,
          lat: '1.29027',
          lng: '103.851959',
          media_prefix: 'events/event-one',
          hero_media_key: 'events/event-one/hero.jpg',
          gallery_media_keys: ['events/event-one/01.jpg'],
          is_active: true,
          is_free: true,
          price_amount: '0',
          price_currency: 'SGD',
          is_verified: true,
          official_url: 'https://example.com/event-one',
          seo_title: null,
          seo_description: null,
          geo_scope: null,
          primary_type: null,
          secondary_type: null,
          source_md_path: null,
          status: 'active',
        },
      ]);
    createSqlClientMock.mockReturnValue(sqlClientMock);

    const response = await worker.fetch(
      new Request('https://content.example/v1/content/events?limit=1'),
      {
        DATABASE_URL: 'postgres://example',
      }
    );

    const body = await readJson<{ items: Array<{ id: string; isActive: boolean }> }>(response);

    expect(response.status).toBe(200);
    expect(body.items).toHaveLength(1);
    expect(body.items[0]?.id).toBe('event_1');
    expect(body.items[0]?.isActive).toBe(true);
  });

  it('rejects event registration without gateway token when auth is configured', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
    };

    const response = await worker.fetch(
      new Request('https://content.example/v1/content/events/event_1/register', {
        method: 'POST',
      }),
      env
    );

    const body = await readJson<{ error: { code: string; message: string } }>(response);

    expect(response.status).toBe(401);
    expect(body.error.code).toBe('UNAUTHORIZED');
    expect(body.error.message).toContain('X-Gateway-Auth');
  });

  it('rejects event registration when gateway token has no user subject', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: '' });

    const response = await worker.fetch(
      new Request('https://content.example/v1/content/events/event_1/register', {
        method: 'POST',
        headers: {
          'X-Gateway-Auth': gatewayJwt,
          'X-User-ID': 'spoofed-user',
        },
      }),
      env
    );

    const body = await readJson<{ error: { code: string; message: string } }>(response);

    expect(response.status).toBe(401);
    expect(body.error.code).toBe('UNAUTHORIZED');
    expect(body.error.message).toContain('subject');
  });

  it('uses DB-less fallback and still calls points-service', async () => {
    const fetchMock = vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
      expect(String(input)).toBe('https://points.example/internal/points/add');
      const headers = new Headers(init?.headers);
      expect(headers.get('Authorization')).toMatch(/^Bearer\s.+/);
      expect(headers.get('X-Request-Id')).toBeTruthy();
      const payload = JSON.parse(String(init?.body)) as {
        userId: string;
        amount: number;
        action: string;
        externalId: string;
      };
      expect(payload.userId).toBe('user_from_token');
      expect(payload.amount).toBe(20);
      expect(payload.action).toBe('event_registration');
      expect(payload.externalId).toContain('content:event_registration:event_1:user_from_token:');

      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
    vi.stubGlobal('fetch', fetchMock);

    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      POINTS_SERVICE_URL: 'https://points.example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_from_token' });

    const response = await worker.fetch(
      new Request('https://content.example/v1/content/events/event_1/register', {
        method: 'POST',
        headers: {
          'X-Gateway-Auth': gatewayJwt,
          'X-User-ID': 'spoofed-user',
        },
      }),
      env
    );

    const body = await readJson<{ ok: boolean; note: string; userId: string; eventId: string }>(response);

    expect(response.status).toBe(201);
    expect(body.ok).toBe(true);
    expect(body.userId).toBe('user_from_token');
    expect(body.eventId).toBe('event_1');
    expect(body.note).toContain('DB not configured');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('returns conflict for duplicate event registration and does not call points-service', async () => {
    const sqlClientMock = vi.fn().mockResolvedValue([]);
    createSqlClientMock.mockReturnValue(sqlClientMock);
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
      POINTS_SERVICE_URL: 'https://points.example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_from_token' });

    const response = await worker.fetch(
      new Request('https://content.example/v1/content/events/event_1/register', {
        method: 'POST',
        headers: {
          'X-Gateway-Auth': gatewayJwt,
          'X-User-ID': 'spoofed-user',
        },
      }),
      env
    );

    const body = await readJson<{ error: { code: string; message: string } }>(response);

    expect(response.status).toBe(409);
    expect(body.error.code).toBe('Conflict');
    expect(body.error.message).toContain('Already registered');
    expect(fetchMock).not.toHaveBeenCalled();
    expect(sqlClientMock).toHaveBeenCalledTimes(1);
  });

  it('returns 503 for upload-token when signing secret is missing', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!);

    const response = await worker.fetch(
      new Request('https://content.example/v1/content/media/upload-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
          'X-User-ID': 'user_1',
        },
        body: JSON.stringify({
          filename: 'photo.jpg',
          contentType: 'image/jpeg',
          sizeBytes: 3,
        }),
      }),
      env
    );

    const body = await readJson<{ error: { code: string; message: string } }>(response);

    expect(response.status).toBe(503);
    expect(body.error.code).toBe('ServiceNotConfigured');
    expect(body.error.message).toContain('MEDIA_UPLOAD_SIGNING_SECRET');
  });

  it('rejects non-image upload-token requests', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      MEDIA_UPLOAD_SIGNING_SECRET: 'media-secret',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!);

    const response = await worker.fetch(
      new Request('https://content.example/v1/content/media/upload-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
          'X-User-ID': 'user_1',
        },
        body: JSON.stringify({
          filename: 'doc.pdf',
          contentType: 'application/pdf',
          sizeBytes: 3,
        }),
      }),
      env
    );

    const body = await readJson<{ error: { code: string; message: string } }>(response);

    expect(response.status).toBe(400);
    expect(body.error.code).toBe('BadRequest');
    expect(body.error.message).toContain('image/*');
  });

  it('creates upload token and uploads image to MEDIA_BUCKET', async () => {
    const putMock = vi.fn().mockResolvedValue(undefined);
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      MEDIA_UPLOAD_SIGNING_SECRET: 'media-secret',
      MEDIA_BUCKET: {
        put: putMock,
      } as unknown as R2Bucket,
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!);

    const tokenResponse = await worker.fetch(
      new Request('https://content.example/v1/content/media/upload-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
          'X-User-ID': 'user_1',
        },
        body: JSON.stringify({
          filename: 'photo.jpg',
          contentType: 'image/jpeg',
          sizeBytes: 3,
        }),
      }),
      env
    );

    const tokenBody = await readJson<{ uploadUrl: string; key: string }>(tokenResponse);

    expect(tokenResponse.status).toBe(200);
    expect(tokenBody.uploadUrl).toContain('/v1/content/media/upload/');

    const uploadResponse = await worker.fetch(
      new Request(`https://content.example${tokenBody.uploadUrl}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'image/jpeg',
        },
        body: new Uint8Array([1, 2, 3]),
      }),
      env
    );

    const uploadBody = await readJson<{ ok: boolean; key: string }>(uploadResponse);

    expect(uploadResponse.status).toBe(201);
    expect(uploadBody.ok).toBe(true);
    expect(uploadBody.key).toBe(tokenBody.key);
    expect(putMock).toHaveBeenCalledTimes(1);
  });

  it('requires gateway auth for guide detail with include_empty=true', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
    };

    const response = await worker.fetch(
      new Request('https://content.example/v1/content/guides/test-guide?include_empty=true'),
      env
    );

    const body = await readJson<{ error: { code: string; message: string } }>(response);

    expect(response.status).toBe(401);
    expect(body.error.code).toBe('UNAUTHORIZED');
    expect(body.error.message).toContain('X-Gateway-Auth');
  });
});
