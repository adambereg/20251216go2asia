import { afterEach, describe, expect, it, vi } from 'vitest';

import { makeGatewayJwt, readJson } from '../../../tests/helpers/worker-test';
import { clearCache } from '../src/cache/responseCache';
import worker, { type Env } from '../src/index';

describe('feed-service request', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    clearCache();
  });

  it('marks service ready without reactions URL in degraded-capable mode', async () => {
    const response = await worker.fetch(
      new Request('https://feed.example/ready'),
      {
        SPACE_SERVICE_URL: 'https://space.example',
        SERVICE_JWT_SECRET: 'service-secret',
      }
    );
    const body = await readJson<{ status: string; checks: Record<string, string>; missing: string[] }>(response);

    expect(response.status).toBe(200);
    expect(body.status).toBe('ready');
    expect(body.checks.spaceServiceUrl).toBe('ok');
    expect(body.checks.reactionsServiceUrl).toBe('missing');
    expect(body.missing).toEqual([]);
  });

  it('aggregates home feed with reactions summary', async () => {
    const env: Env = {
      SPACE_SERVICE_URL: 'https://space.example',
      REACTIONS_SERVICE_URL: 'https://reactions.example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });

    const fetchMock = vi.fn(async (request: Request) => {
      if (request.url.startsWith('https://space.example/v1/space/feed/home')) {
        return new Response(
          JSON.stringify({
            items: [
              {
                id: 'item_1',
                createdAt: '2026-03-16T00:00:00.000Z',
                post: { id: 'spost_1' },
              },
            ],
            nextCursor: 'cursor_1',
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      if (request.url === 'https://reactions.example/v1/reactions/summary:batch') {
        return new Response(
          JSON.stringify({
            items: [
              {
                targetType: 'space_post',
                targetId: 'spost_1',
                counts: { like: 7 },
                viewer: { liked: true },
              },
            ],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return new Response('unexpected', { status: 500 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const response = await worker.fetch(
      new Request('https://feed.example/v1/feed/home', {
        headers: { 'X-Gateway-Auth': token },
      }),
      env
    );
    const body = await readJson<{
      items: Array<{ reactions: { counts: { like: number }; viewer: { liked: boolean } } }>;
      nextCursor: string | null;
    }>(response);

    expect(response.status).toBe(200);
    expect(body.items[0]?.reactions.counts.like).toBe(7);
    expect(body.items[0]?.reactions.viewer.liked).toBe(true);
    expect(body.nextCursor).toBe('cursor_1');
  });

  it('aggregates group feed', async () => {
    const env: Env = {
      SPACE_SERVICE_URL: 'https://space.example',
      REACTIONS_SERVICE_URL: 'https://reactions.example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });

    const fetchMock = vi.fn(async (request: Request) => {
      if (request.url.startsWith('https://space.example/v1/space/feed/group/group_1')) {
        return new Response(JSON.stringify({ items: [], nextCursor: null }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      if (request.url === 'https://reactions.example/v1/reactions/summary:batch') {
        return new Response(JSON.stringify({ items: [] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response('unexpected', { status: 500 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const response = await worker.fetch(
      new Request('https://feed.example/v1/feed/group/group_1', {
        headers: { 'X-Gateway-Auth': token },
      }),
      env
    );
    expect(response.status).toBe(200);
  });

  it('aggregates profile feed', async () => {
    const env: Env = {
      SPACE_SERVICE_URL: 'https://space.example',
      REACTIONS_SERVICE_URL: 'https://reactions.example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });

    const fetchMock = vi.fn(async (request: Request) => {
      if (request.url.startsWith('https://space.example/v1/space/feed/profile/user_2')) {
        return new Response(JSON.stringify({ items: [], nextCursor: null }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      if (request.url === 'https://reactions.example/v1/reactions/summary:batch') {
        return new Response(JSON.stringify({ items: [] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response('unexpected', { status: 500 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const response = await worker.fetch(
      new Request('https://feed.example/v1/feed/profile/user_2', {
        headers: { 'X-Gateway-Auth': token },
      }),
      env
    );
    expect(response.status).toBe(200);
  });

  it('aggregates activity feed without reactions enrichment', async () => {
    const env: Env = {
      SPACE_SERVICE_URL: 'https://space.example',
      REACTIONS_SERVICE_URL: 'https://reactions.example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });

    const fetchMock = vi.fn(async (request: Request) => {
      if (request.url.startsWith('https://space.example/v1/space/feed/activity')) {
        return new Response(JSON.stringify({ items: [{ id: 'act_1' }], nextCursor: null }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response('unexpected', { status: 500 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const response = await worker.fetch(
      new Request('https://feed.example/v1/feed/activity', {
        headers: { 'X-Gateway-Auth': token },
      }),
      env
    );
    const body = await readJson<{ items: Array<{ id: string }> }>(response);

    expect(response.status).toBe(200);
    expect(body.items[0]?.id).toBe('act_1');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('keeps deterministic cursor passthrough to upstream', async () => {
    const env: Env = {
      SPACE_SERVICE_URL: 'https://space.example',
      REACTIONS_SERVICE_URL: 'https://reactions.example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });

    const fetchMock = vi.fn(async (request: Request) => {
      if (request.url.startsWith('https://space.example/v1/space/feed/home')) {
        const url = new URL(request.url);
        expect(url.searchParams.get('limit')).toBe('2');
        expect(url.searchParams.get('cursor')).toBe('cursor_prev');
        return new Response(JSON.stringify({ items: [], nextCursor: 'cursor_next' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      if (request.url === 'https://reactions.example/v1/reactions/summary:batch') {
        return new Response(JSON.stringify({ items: [] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response('unexpected', { status: 500 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const response = await worker.fetch(
      new Request('https://feed.example/v1/feed/home?limit=2&cursor=cursor_prev', {
        headers: { 'X-Gateway-Auth': token },
      }),
      env
    );
    const body = await readJson<{ nextCursor: string | null }>(response);
    expect(response.status).toBe(200);
    expect(body.nextCursor).toBe('cursor_next');
  });

  it('applies deterministic chronology-first ordering with stable id tie-break', async () => {
    const env: Env = {
      SPACE_SERVICE_URL: 'https://space.example',
      REACTIONS_SERVICE_URL: 'https://reactions.example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });

    const fetchMock = vi.fn(async (request: Request) => {
      if (request.url.startsWith('https://space.example/v1/space/feed/home')) {
        return new Response(
          JSON.stringify({
            items: [
              { id: 'post_c', createdAt: '2026-03-16T00:00:00.000Z', post: { id: 'post_c' } },
              { id: 'post_a', createdAt: '2026-03-16T00:00:00.000Z', post: { id: 'post_a' } },
              { id: 'post_b', createdAt: '2026-03-17T00:00:00.000Z', post: { id: 'post_b' } },
            ],
            nextCursor: null,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      if (request.url === 'https://reactions.example/v1/reactions/summary:batch') {
        return new Response(
          JSON.stringify({
            items: [
              { targetType: 'space_post', targetId: 'post_a', counts: { like: 1 }, viewer: { liked: false } },
              { targetType: 'space_post', targetId: 'post_b', counts: { like: 2 }, viewer: { liked: true } },
              { targetType: 'space_post', targetId: 'post_c', counts: { like: 3 }, viewer: { liked: false } },
            ],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return new Response('unexpected', { status: 500 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const response = await worker.fetch(
      new Request('https://feed.example/v1/feed/home', {
        headers: { 'X-Gateway-Auth': token },
      }),
      env
    );
    const body = await readJson<{ items: Array<{ id: string; reactions: { counts: { like: number } } }> }>(response);

    expect(response.status).toBe(200);
    expect(body.items.map((item) => item.id)).toEqual(['post_b', 'post_a', 'post_c']);
    expect(body.items.map((item) => item.reactions.counts.like)).toEqual([2, 1, 3]);
  });

  it('falls back to default reactions when reactions-service is degraded', async () => {
    const env: Env = {
      SPACE_SERVICE_URL: 'https://space.example',
      REACTIONS_SERVICE_URL: 'https://reactions.example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });

    const fetchMock = vi.fn(async (request: Request) => {
      if (request.url.startsWith('https://space.example/v1/space/feed/home')) {
        return new Response(
          JSON.stringify({
            items: [{ id: 'item_1', post: { id: 'spost_1' } }],
            nextCursor: null,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      if (request.url === 'https://reactions.example/v1/reactions/summary:batch') {
        return new Response(JSON.stringify({ error: { code: 'DOWN' } }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response('unexpected', { status: 500 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const response = await worker.fetch(
      new Request('https://feed.example/v1/feed/home', {
        headers: { 'X-Gateway-Auth': token },
      }),
      env
    );
    const body = await readJson<{
      items: Array<{ reactions: { counts: { like: number }; viewer: { liked: boolean } } }>;
      degraded?: { reactions?: boolean };
    }>(response);

    expect(response.status).toBe(200);
    expect(body.items[0]?.reactions.counts.like).toBe(0);
    expect(body.items[0]?.reactions.viewer.liked).toBe(false);
    expect(body.degraded?.reactions).toBe(true);
  });

  it('returns upstream failure when space-service fails', async () => {
    const env: Env = {
      SPACE_SERVICE_URL: 'https://space.example',
      REACTIONS_SERVICE_URL: 'https://reactions.example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });

    const fetchMock = vi.fn(async (request: Request) => {
      if (request.url.startsWith('https://space.example/v1/space/feed/home')) {
        return new Response(
          JSON.stringify({
            error: {
              code: 'SERVICE_UNAVAILABLE',
              message: 'space down',
            },
          }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return new Response('unexpected', { status: 500 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const response = await worker.fetch(
      new Request('https://feed.example/v1/feed/home', {
        headers: { 'X-Gateway-Auth': token },
      }),
      env
    );
    const body = await readJson<{ error: { code: string } }>(response);
    expect(response.status).toBe(503);
    expect(body.error.code).toBe('SERVICE_UNAVAILABLE');
  });

  it('enforces gateway auth for policy-sensitive feed reads', async () => {
    const env: Env = {
      SPACE_SERVICE_URL: 'https://space.example',
      REACTIONS_SERVICE_URL: 'https://reactions.example',
      SERVICE_JWT_SECRET: 'service-secret',
    };

    const response = await worker.fetch(new Request('https://feed.example/v1/feed/home'), env);
    const body = await readJson<{ error: { code: string } }>(response);

    expect(response.status).toBe(401);
    expect(body.error.code).toBe('UNAUTHORIZED');
  });

  it('does not expose mutation endpoints in feed service', async () => {
    const env: Env = {
      SPACE_SERVICE_URL: 'https://space.example',
      REACTIONS_SERVICE_URL: 'https://reactions.example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });

    const response = await worker.fetch(
      new Request('https://feed.example/v1/feed/home', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': token,
        },
        body: JSON.stringify({}),
      }),
      env
    );

    expect(response.status).toBe(404);
  });

  it('forwards gateway auth to both space and reactions upstream calls', async () => {
    const env: Env = {
      SPACE_SERVICE_URL: 'https://space.example',
      REACTIONS_SERVICE_URL: 'https://reactions.example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });
    const fetchMock = vi.fn(async (request: Request) => {
      if (request.url.startsWith('https://space.example/v1/space/feed/home')) {
        expect(request.headers.get('X-Gateway-Auth')).toBe(token);
        return new Response(
          JSON.stringify({
            items: [{ id: 'item_1', post: { id: 'spost_1' } }],
            nextCursor: null,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      if (request.url === 'https://reactions.example/v1/reactions/summary:batch') {
        expect(request.headers.get('X-Gateway-Auth')).toBe(token);
        return new Response(JSON.stringify({ items: [] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response('unexpected', { status: 500 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const response = await worker.fetch(
      new Request('https://feed.example/v1/feed/home', {
        headers: { 'X-Gateway-Auth': token },
      }),
      env
    );

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('degrades reactions when reactions upstream throws network exception', async () => {
    const env: Env = {
      SPACE_SERVICE_URL: 'https://space.example',
      REACTIONS_SERVICE_URL: 'https://reactions.example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });
    const fetchMock = vi.fn(async (request: Request) => {
      if (request.url.startsWith('https://space.example/v1/space/feed/home')) {
        return new Response(
          JSON.stringify({
            items: [{ id: 'item_1', post: { id: 'spost_1' } }],
            nextCursor: null,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      if (request.url === 'https://reactions.example/v1/reactions/summary:batch') {
        throw new Error('network down');
      }
      return new Response('unexpected', { status: 500 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const response = await worker.fetch(
      new Request('https://feed.example/v1/feed/home', {
        headers: { 'X-Gateway-Auth': token },
      }),
      env
    );
    const body = await readJson<{
      degraded?: { reactions?: boolean };
      items: Array<{ reactions: { counts: { like: number }; viewer: { liked: boolean } } }>;
    }>(response);

    expect(response.status).toBe(200);
    expect(body.degraded?.reactions).toBe(true);
    expect(body.items[0]?.reactions.counts.like).toBe(0);
    expect(body.items[0]?.reactions.viewer.liked).toBe(false);
  });

  it('degrades reactions when reactions upstream returns invalid success payload', async () => {
    const env: Env = {
      SPACE_SERVICE_URL: 'https://space.example',
      REACTIONS_SERVICE_URL: 'https://reactions.example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });
    const fetchMock = vi.fn(async (request: Request) => {
      if (request.url.startsWith('https://space.example/v1/space/feed/home')) {
        return new Response(
          JSON.stringify({
            items: [{ id: 'item_1', post: { id: 'spost_1' } }],
            nextCursor: null,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      if (request.url === 'https://reactions.example/v1/reactions/summary:batch') {
        return new Response(JSON.stringify({ items: [{ targetType: 'space_post' }] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response('unexpected', { status: 500 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const response = await worker.fetch(
      new Request('https://feed.example/v1/feed/home', {
        headers: { 'X-Gateway-Auth': token },
      }),
      env
    );
    const body = await readJson<{
      degraded?: { reactions?: boolean };
      items: Array<{ reactions: { counts: { like: number }; viewer: { liked: boolean } } }>;
    }>(response);

    expect(response.status).toBe(200);
    expect(body.degraded?.reactions).toBe(true);
    expect(body.items[0]?.reactions.counts.like).toBe(0);
    expect(body.items[0]?.reactions.viewer.liked).toBe(false);
  });

  it('returns controlled upstream error when space upstream throws network exception', async () => {
    const env: Env = {
      SPACE_SERVICE_URL: 'https://space.example',
      REACTIONS_SERVICE_URL: 'https://reactions.example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });
    const fetchMock = vi.fn(async (request: Request) => {
      if (request.url.startsWith('https://space.example/v1/space/feed/home')) {
        throw new Error('space timeout');
      }
      return new Response('unexpected', { status: 500 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const response = await worker.fetch(
      new Request('https://feed.example/v1/feed/home', {
        headers: { 'X-Gateway-Auth': token },
      }),
      env
    );
    const body = await readJson<{ error: { code: string } }>(response);
    expect(response.status).toBe(503);
    expect(body.error.code).toBe('UPSTREAM_UNAVAILABLE');
  });

  it('returns controlled invalid-upstream error when space payload shape is broken', async () => {
    const env: Env = {
      SPACE_SERVICE_URL: 'https://space.example',
      REACTIONS_SERVICE_URL: 'https://reactions.example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });
    const fetchMock = vi.fn(async (request: Request) => {
      if (request.url.startsWith('https://space.example/v1/space/feed/home')) {
        return new Response(
          JSON.stringify({
            items: [{ createdAt: '2026-03-16T00:00:00.000Z' }],
            nextCursor: null,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return new Response('unexpected', { status: 500 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const response = await worker.fetch(
      new Request('https://feed.example/v1/feed/home', {
        headers: { 'X-Gateway-Auth': token },
      }),
      env
    );
    const body = await readJson<{ error: { code: string } }>(response);

    expect(response.status).toBe(502);
    expect(body.error.code).toBe('UPSTREAM_INVALID_RESPONSE');
  });
});
