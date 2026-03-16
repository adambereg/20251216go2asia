import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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
import { makeGatewayJwt, readJson } from '../../../tests/helpers/worker-test';

describe('space-service v1', () => {
  beforeEach(() => {
    createDbMock.mockClear();
    executeMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('returns readiness checks for required dependencies', async () => {
    const response = await worker.fetch(new Request('https://space.example/ready'), {});
    const body = await readJson<{ status: string; missing: string[] }>(response);

    expect(response.status).toBe(503);
    expect(body.status).toBe('not_ready');
    expect(body.missing).toEqual(['databaseUrl', 'serviceJwtSecret', 'mediaServiceUrl']);
  });

  it('returns 401 for protected post creation without gateway auth', async () => {
    const response = await worker.fetch(
      new Request('https://space.example/v1/space/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postType: 'post',
          visibility: 'public',
          text: 'Hello world',
        }),
      }),
      {
        SERVICE_JWT_SECRET: 'service-secret',
        DATABASE_URL: 'postgres://example',
        MEDIA_SERVICE_URL: 'https://media.example',
      }
    );

    const body = await readJson<{ error: { code: string } }>(response);
    expect(response.status).toBe(401);
    expect(body.error.code).toBe('UNAUTHORIZED');
  });

  it('validates group visibility post creation', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
      MEDIA_SERVICE_URL: 'https://media.example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!);

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          postType: 'post',
          visibility: 'group',
          text: 'Group only',
        }),
      }),
      env
    );

    const body = await readJson<{ error: { code: string; message: string } }>(response);
    expect(response.status).toBe(400);
    expect(body.error.code).toBe('VALIDATION_ERROR');
    expect(body.error.message).toContain('groupId');
  });

  it('returns a public post for anonymous read', async () => {
    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'spost_1',
            author_id: 'user_1',
            author_display_name: 'User One',
            author_avatar_url: null,
            author_role_label: 'Spacer',
            group_id: null,
            post_type: 'post',
            visibility: 'public',
            text: 'Hello',
            repost_target_type: null,
            repost_target_id: null,
            status: 'active',
            created_at: '2026-03-14T10:00:00.000Z',
            updated_at: '2026-03-14T10:00:00.000Z',
            published_at: '2026-03-14T10:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [] });

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/posts/spost_1'),
      {
        DATABASE_URL: 'postgres://example',
        SERVICE_JWT_SECRET: 'service-secret',
        MEDIA_SERVICE_URL: 'https://media.example',
      }
    );

    const body = await readJson<{ id: string; visibility: string; author: { displayName: string } }>(response);
    expect(response.status).toBe(200);
    expect(body.id).toBe('spost_1');
    expect(body.visibility).toBe('public');
    expect(body.author.displayName).toBe('User One');
  });

  it('creates a group and owner membership', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
      MEDIA_SERVICE_URL: 'https://media.example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!);

    executeMock
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'sgroup_created',
            slug: 'bangkok-founders',
            title: 'Bangkok Founders',
            description: null,
            owner_id: 'user_test_1',
            visibility: 'public',
            status: 'active',
            members_count: 1,
            created_at: '2026-03-14T10:00:00.000Z',
            updated_at: '2026-03-14T10:00:00.000Z',
          },
        ],
      });

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          slug: 'bangkok-founders',
          title: 'Bangkok Founders',
          visibility: 'public',
        }),
      }),
      env
    );

    const body = await readJson<{ slug: string; ownerId: string; membersCount: number }>(response);
    expect(response.status).toBe(201);
    expect(body.slug).toBe('bangkok-founders');
    expect(body.ownerId).toBe('user_test_1');
    expect(body.membersCount).toBe(1);
  });

  it('attaches media through media-service lifecycle', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
      MEDIA_SERVICE_URL: 'https://media.example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!);
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const requestUrl = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
      if (requestUrl.endsWith('/v1/media/media_1')) {
        return new Response(JSON.stringify({ media_id: 'media_1' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      if (requestUrl.endsWith('/v1/media/media_1/attach')) {
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`Unexpected fetch url: ${requestUrl}`);
    });
    vi.stubGlobal('fetch', fetchMock);

    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'spost_1',
            author_id: 'user_test_1',
            author_display_name: 'User',
            author_avatar_url: null,
            author_role_label: null,
            group_id: null,
            post_type: 'post',
            visibility: 'public',
            text: 'Hello',
            repost_target_type: null,
            repost_target_id: null,
            status: 'active',
            created_at: '2026-03-14T10:00:00.000Z',
            updated_at: '2026-03-14T10:00:00.000Z',
            published_at: '2026-03-14T10:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [{ count: 0 }] })
      .mockResolvedValueOnce({ rows: [] });

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/posts/spost_1/media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          mediaId: 'media_1',
          sortOrder: 2,
        }),
      }),
      env
    );

    const body = await readJson<{ postId: string; mediaId: string; sortOrder: number }>(response);
    expect(response.status).toBe(200);
    expect(body.postId).toBe('spost_1');
    expect(body.mediaId).toBe('media_1');
    expect(body.sortOrder).toBe(2);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
