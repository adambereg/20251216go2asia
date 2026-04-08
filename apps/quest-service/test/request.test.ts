import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { createDbMock, executeMock, createSqlToken } = vi.hoisted(() => {
  const execute = vi.fn();
  return {
    executeMock: execute,
    createDbMock: vi.fn(() => ({ execute })),
    createSqlToken: (strings: TemplateStringsArray, ...values: unknown[]) => ({
      strings: [...strings],
      values,
    }),
  };
});

vi.mock('@go2asia/db', () => ({
  createDb: createDbMock,
  sql: createSqlToken,
}));

import { makeGatewayJwt, readJson } from '../../../tests/helpers/worker-test';
import type { Env } from '../src/index';
import worker from '../src/index';

describe('quest-service pass #4', () => {
  beforeEach(() => {
    createDbMock.mockClear();
    executeMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('requires gateway auth for create quest', async () => {
    const response = await worker.fetch(
      new Request('https://quest.example/v1/quests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Coffee Route' }),
      }),
      { DATABASE_URL: 'postgres://example', SERVICE_JWT_SECRET: 'service-secret' }
    );
    expect(response.status).toBe(401);
    expect(executeMock).not.toHaveBeenCalled();
  });

  it('creates draft quest for pro principal', async () => {
    const env: Env = { DATABASE_URL: 'postgres://example', SERVICE_JWT_SECRET: 'service-secret' };
    const jwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'pro_1', roles: ['pro'] });

    executeMock.mockResolvedValueOnce({
      rows: [
        {
          id: 'quest_1',
          title: 'Coffee Route',
          description: 'Quest description',
          creator_pro_id: 'pro_1',
          city_id: null,
          geo_scope: null,
          type: 'route',
          theme: 'coffee',
          difficulty: 'easy',
          status: 'draft',
          visibility: 'public',
          reward_points: 100,
          steps_count: 0,
          published_at: null,
          created_at: '2026-03-16T09:00:00.000Z',
          updated_at: '2026-03-16T09:00:00.000Z',
        },
      ],
    });

    const response = await worker.fetch(
      new Request('https://quest.example/v1/quests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Gateway-Auth': jwt },
        body: JSON.stringify({
          title: 'Coffee Route',
          description: 'Quest description',
          visibility: 'public',
          difficulty: 'easy',
          rewardPoints: 100,
        }),
      }),
      env
    );
    const body = await readJson<{ id: string; status: string; creatorProId: string; stepsCount: number }>(response);
    expect(response.status).toBe(201);
    expect(body).toMatchObject({
      id: 'quest_1',
      status: 'draft',
      creatorProId: 'pro_1',
      stepsCount: 0,
    });
  });

  it('adds step to owned draft quest and keeps deterministic ordering contract', async () => {
    const env: Env = { DATABASE_URL: 'postgres://example', SERVICE_JWT_SECRET: 'service-secret' };
    const jwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'pro_1', roles: ['pro'] });

    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'quest_1',
            title: 'Coffee Route',
            description: null,
            creator_pro_id: 'pro_1',
            city_id: null,
            geo_scope: null,
            type: null,
            theme: null,
            difficulty: null,
            status: 'draft',
            visibility: 'public',
            reward_points: null,
            steps_count: 0,
            published_at: null,
            created_at: '2026-03-16T09:00:00.000Z',
            updated_at: '2026-03-16T09:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'qstep_1',
            quest_id: 'quest_1',
            order: 1,
            type: 'visit_partner',
            target_type: 'partner',
            target_id: 'rf_partner_1',
            verification_type: 'manual',
            requirements_json: {},
            reward_points: null,
            created_at: '2026-03-16T09:05:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [] });

    const response = await worker.fetch(
      new Request('https://quest.example/v1/quests/quest_1/steps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Gateway-Auth': jwt },
        body: JSON.stringify({
          order: 1,
          type: 'visit_partner',
          targetType: 'partner',
          targetId: 'rf_partner_1',
          verificationType: 'manual',
          requirements: {},
        }),
      }),
      env
    );
    const body = await readJson<{ id: string; order: number; targetType: string; targetId: string }>(response);
    expect(response.status).toBe(201);
    expect(body).toMatchObject({
      id: 'qstep_1',
      order: 1,
      targetType: 'partner',
      targetId: 'rf_partner_1',
    });
  });

  it('publishes quest only when publish preconditions are met', async () => {
    const env: Env = { DATABASE_URL: 'postgres://example', SERVICE_JWT_SECRET: 'service-secret' };
    const jwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'pro_1', roles: ['pro'] });

    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'quest_1',
            title: 'Coffee Route',
            description: null,
            creator_pro_id: 'pro_1',
            city_id: null,
            geo_scope: null,
            type: null,
            theme: null,
            difficulty: null,
            status: 'draft',
            visibility: 'public',
            reward_points: null,
            steps_count: 1,
            published_at: null,
            created_at: '2026-03-16T09:00:00.000Z',
            updated_at: '2026-03-16T09:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'qstep_1',
            quest_id: 'quest_1',
            order: 1,
            type: 'challenge',
            target_type: null,
            target_id: null,
            verification_type: 'manual',
            requirements_json: {},
            reward_points: null,
            created_at: '2026-03-16T09:05:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'quest_1',
            title: 'Coffee Route',
            description: null,
            creator_pro_id: 'pro_1',
            city_id: null,
            geo_scope: null,
            type: null,
            theme: null,
            difficulty: null,
            status: 'published',
            visibility: 'public',
            reward_points: null,
            steps_count: 1,
            published_at: '2026-03-16T10:00:00.000Z',
            created_at: '2026-03-16T09:00:00.000Z',
            updated_at: '2026-03-16T10:00:00.000Z',
          },
        ],
      });

    const response = await worker.fetch(
      new Request('https://quest.example/v1/quests/quest_1/publish', {
        method: 'POST',
        headers: { 'X-Gateway-Auth': jwt },
      }),
      env
    );
    const body = await readJson<{ status: string; publishedAt: string }>(response);
    expect(response.status).toBe(200);
    expect(body.status).toBe('published');
    expect(body.publishedAt).toBeTruthy();
  });

  it('returns conflict when trying to publish draft without steps', async () => {
    const env: Env = { DATABASE_URL: 'postgres://example', SERVICE_JWT_SECRET: 'service-secret' };
    const jwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'pro_1', roles: ['pro'] });

    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'quest_1',
            title: 'Coffee Route',
            description: null,
            creator_pro_id: 'pro_1',
            city_id: null,
            geo_scope: null,
            type: null,
            theme: null,
            difficulty: null,
            status: 'draft',
            visibility: 'public',
            reward_points: null,
            steps_count: 0,
            published_at: null,
            created_at: '2026-03-16T09:00:00.000Z',
            updated_at: '2026-03-16T09:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [] });

    const response = await worker.fetch(
      new Request('https://quest.example/v1/quests/quest_1/publish', {
        method: 'POST',
        headers: { 'X-Gateway-Auth': jwt },
      }),
      env
    );
    const body = await readJson<{ error: { code: string } }>(response);
    expect(response.status).toBe(409);
    expect(body.error.code).toBe('CONFLICT');
  });

  it('keeps drafts out of public detail read', async () => {
    executeMock.mockResolvedValueOnce({ rows: [] });
    const response = await worker.fetch(
      new Request('https://quest.example/v1/quests/quest_draft_hidden'),
      { DATABASE_URL: 'postgres://example', SERVICE_JWT_SECRET: 'service-secret' }
    );
    expect(response.status).toBe(404);
  });
});
