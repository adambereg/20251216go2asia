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

import { makeGatewayJwt, readJson } from '../../../tests/helpers/worker-test';
import worker, { type Env } from '../src/index';

describe('reactions-service request', () => {
  beforeEach(() => {
    createDbMock.mockClear();
    executeMock.mockReset();
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
