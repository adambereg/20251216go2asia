import { beforeEach, describe, expect, it, vi } from 'vitest';

const { createDbMock, executeMock, createPublisherMock, publishMock } = vi.hoisted(() => {
  const execute = vi.fn();
  const publish = vi.fn();
  return {
    executeMock: execute,
    createDbMock: vi.fn(() => ({ execute })),
    publishMock: publish,
    createPublisherMock: vi.fn(() => ({ publish })),
  };
});

vi.mock('@go2asia/db', () => ({
  createDb: createDbMock,
  sql: (strings: TemplateStringsArray, ...values: unknown[]) => ({
    strings: [...strings],
    values,
  }),
}));

vi.mock('../src/events/publisher', () => ({
  createNoopReactionsEventPublisher: createPublisherMock,
}));

import { makeGatewayJwt, readJson } from '../../../tests/helpers/worker-test';
import worker, { type Env } from '../src/index';

function sqlOf(callIndex: number): string {
  const arg = executeMock.mock.calls[callIndex]?.[0] as { strings?: string[] } | undefined;
  return (arg?.strings ?? []).join('');
}

function aggregateSqlCallCount(): number {
  return executeMock.mock.calls.filter((_, i) => sqlOf(i).includes('reaction_aggregates')).length;
}

describe('reactions-service request', () => {
  beforeEach(() => {
    createDbMock.mockClear();
    executeMock.mockReset();
    createPublisherMock.mockClear();
    publishMock.mockReset();
  });

  it('creates like', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });

    executeMock
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'react_1',
            user_id: 'user_1',
            target_type: 'space_post',
            target_id: 'post_1',
            reaction_type: 'like',
            status: 'active',
            created_at: '2026-03-14T00:00:00.000Z',
            updated_at: '2026-03-14T00:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [] });

    const response = await worker.fetch(
      new Request('https://reactions.example/v1/reactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': token,
        },
        body: JSON.stringify({
          targetType: 'space_post',
          targetId: 'post_1',
          reactionType: 'like',
        }),
      }),
      env
    );

    const body = await readJson<{ applied: boolean; reaction: { id: string; targetType: string } }>(response);
    expect(response.status).toBe(200);
    expect(body.applied).toBe(true);
    expect(body.reaction.id).toBe('react_1');
    expect(body.reaction.targetType).toBe('space_post');
    expect(aggregateSqlCallCount()).toBe(1);
    expect(publishMock).toHaveBeenCalledTimes(1);
    expect(publishMock).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: 'reaction.created',
        payload: expect.objectContaining({
          actorUserId: 'user_1',
          targetType: 'space_post',
          targetId: 'post_1',
          reactionType: 'like',
          requestId: expect.any(String),
        }),
      })
    );
  });

  it('removes like', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });

    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'react_1',
            user_id: 'user_1',
            target_type: 'space_post',
            target_id: 'post_1',
            reaction_type: 'like',
            status: 'active',
            created_at: '2026-03-14T00:00:00.000Z',
            updated_at: '2026-03-14T00:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [{ id: 'react_1' }] })
      .mockResolvedValueOnce({ rows: [] });

    const response = await worker.fetch(
      new Request('https://reactions.example/v1/reactions/react_1', {
        method: 'DELETE',
        headers: {
          'X-Gateway-Auth': token,
        },
      }),
      env
    );

    const body = await readJson<{ removed: boolean }>(response);
    expect(response.status).toBe(200);
    expect(body.removed).toBe(true);
    expect(aggregateSqlCallCount()).toBe(1);
    expect(publishMock).toHaveBeenCalledTimes(1);
    expect(publishMock).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: 'reaction.deleted',
        payload: expect.objectContaining({
          actorUserId: 'user_1',
          targetType: 'space_post',
          targetId: 'post_1',
          reactionType: 'like',
          requestId: expect.any(String),
        }),
      })
    );
  });

  it('is idempotent for repeated like by same user and target', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });

    executeMock
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'react_1',
            user_id: 'user_1',
            target_type: 'space_post',
            target_id: 'post_1',
            reaction_type: 'like',
            status: 'active',
            created_at: '2026-03-14T00:00:00.000Z',
            updated_at: '2026-03-14T00:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'react_1',
            user_id: 'user_1',
            target_type: 'space_post',
            target_id: 'post_1',
            reaction_type: 'like',
            status: 'active',
            created_at: '2026-03-14T00:00:00.000Z',
            updated_at: '2026-03-14T00:00:00.000Z',
          },
        ],
      });

    const makeRequest = () =>
      new Request('https://reactions.example/v1/reactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': token,
        },
        body: JSON.stringify({
          targetType: 'space_post',
          targetId: 'post_1',
          reactionType: 'like',
        }),
      });

    const first = await worker.fetch(makeRequest(), env);
    const firstBody = await readJson<{ applied: boolean }>(first);
    expect(first.status).toBe(200);
    expect(firstBody.applied).toBe(true);

    const second = await worker.fetch(makeRequest(), env);
    const secondBody = await readJson<{ applied: boolean }>(second);
    expect(second.status).toBe(200);
    expect(secondBody.applied).toBe(false);
    expect(aggregateSqlCallCount()).toBe(1);
    expect(publishMock).toHaveBeenCalledTimes(1);
  });

  it('keeps delete idempotent and does not emit duplicate delete event', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });

    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'react_1',
            user_id: 'user_1',
            target_type: 'space_post',
            target_id: 'post_1',
            reaction_type: 'like',
            status: 'active',
            created_at: '2026-03-14T00:00:00.000Z',
            updated_at: '2026-03-14T00:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [{ id: 'react_1' }] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });

    const first = await worker.fetch(
      new Request('https://reactions.example/v1/reactions/react_1', {
        method: 'DELETE',
        headers: {
          'X-Gateway-Auth': token,
        },
      }),
      env
    );
    expect(first.status).toBe(200);

    const second = await worker.fetch(
      new Request('https://reactions.example/v1/reactions/react_1', {
        method: 'DELETE',
        headers: {
          'X-Gateway-Auth': token,
        },
      }),
      env
    );
    expect(second.status).toBe(404);
    expect(aggregateSqlCallCount()).toBe(1);
    expect(publishMock).toHaveBeenCalledTimes(1);
  });

  it('returns batch summary', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });

    executeMock.mockResolvedValueOnce({
      rows: [
        {
          target_type: 'space_post',
          target_id: 'post_1',
          like_count: 2,
          viewer_liked: true,
        },
      ],
    });

    const response = await worker.fetch(
      new Request('https://reactions.example/v1/reactions/summary:batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': token,
        },
        body: JSON.stringify({
          targets: [{ targetType: 'space_post', targetId: 'post_1' }],
        }),
      }),
      env
    );

    const body = await readJson<{ items: Array<{ counts: { like: number }; viewer: { liked: boolean } }> }>(response);
    expect(response.status).toBe(200);
    expect(body.items).toHaveLength(1);
    expect(body.items[0]?.counts.like).toBe(2);
    expect(body.items[0]?.viewer.liked).toBe(true);
  });

  it('returns deterministic deduped batch summary for mixed targets', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });

    executeMock
      .mockResolvedValueOnce({
        rows: [{ target_type: 'space_post', target_id: 'post_a', like_count: 3, viewer_liked: true }],
      })
      .mockResolvedValueOnce({
        rows: [{ target_type: 'blog_post', target_id: 'blog_b', like_count: 0, viewer_liked: false }],
      })
      .mockResolvedValueOnce({
        rows: [{ target_type: 'event', target_id: 'event_c', like_count: 5, viewer_liked: true }],
      });

    const response = await worker.fetch(
      new Request('https://reactions.example/v1/reactions/summary:batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': token,
        },
        body: JSON.stringify({
          targets: [
            { targetType: 'space_post', targetId: 'post_a' },
            { targetType: 'blog_post', targetId: 'blog_b' },
            { targetType: 'space_post', targetId: 'post_a' },
            { targetType: 'event', targetId: 'event_c' },
            { targetType: 'blog_post', targetId: 'blog_b' },
          ],
        }),
      }),
      env
    );

    const body = await readJson<{ items: Array<{ targetType: string; targetId: string; viewer: { liked: boolean } }> }>(
      response
    );

    expect(response.status).toBe(200);
    expect(body.items.map((it) => `${it.targetType}:${it.targetId}`)).toEqual([
      'space_post:post_a',
      'blog_post:blog_b',
      'event:event_c',
    ]);
    expect(body.items.map((it) => it.viewer.liked)).toEqual([true, false, true]);
    expect(executeMock).toHaveBeenCalledTimes(3);
  });

  it('returns zero-like fallback when summary rows are missing', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });

    executeMock.mockResolvedValueOnce({ rows: [] });

    const response = await worker.fetch(
      new Request('https://reactions.example/v1/reactions/summary:batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': token,
        },
        body: JSON.stringify({
          targets: [{ targetType: 'space_post', targetId: 'post_zero' }],
        }),
      }),
      env
    );

    const body = await readJson<{ items: Array<{ counts: { like: number }; viewer: { liked: boolean } }> }>(response);
    expect(response.status).toBe(200);
    expect(body.items).toHaveLength(1);
    expect(body.items[0]?.counts.like).toBe(0);
    expect(body.items[0]?.viewer.liked).toBe(false);
  });

  it('rejects batch boundary violations', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });

    const emptyTargets = await worker.fetch(
      new Request('https://reactions.example/v1/reactions/summary:batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': token,
        },
        body: JSON.stringify({ targets: [] }),
      }),
      env
    );
    expect(emptyTargets.status).toBe(400);

    const tooManyTargets = await worker.fetch(
      new Request('https://reactions.example/v1/reactions/summary:batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': token,
        },
        body: JSON.stringify({
          targets: Array.from({ length: 101 }, (_, idx) => ({
            targetType: 'space_post',
            targetId: `post_${idx}`,
          })),
        }),
      }),
      env
    );
    expect(tooManyTargets.status).toBe(400);

    const blankTargetId = await worker.fetch(
      new Request('https://reactions.example/v1/reactions/summary:batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': token,
        },
        body: JSON.stringify({
          targets: [{ targetType: 'space_post', targetId: '   ' }],
        }),
      }),
      env
    );
    expect(blankTargetId.status).toBe(400);
    expect(executeMock).not.toHaveBeenCalled();
  });

  it('rejects invalid target', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });

    const response = await worker.fetch(
      new Request('https://reactions.example/v1/reactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': token,
        },
        body: JSON.stringify({
          targetType: 'unknown_type',
          targetId: 'post_1',
          reactionType: 'like',
        }),
      }),
      env
    );

    const body = await readJson<{ error: { code: string } }>(response);
    expect(response.status).toBe(400);
    expect(body.error.code).toBe('VALIDATION_ERROR');
    expect(executeMock).not.toHaveBeenCalled();
  });
});
