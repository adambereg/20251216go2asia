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

describe('quest-service pass #2', () => {
  beforeEach(() => {
    createDbMock.mockClear();
    executeMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('returns readiness checks with database connectivity signal', async () => {
    executeMock.mockResolvedValueOnce({ rows: [{ ok: 1 }] });
    const response = await worker.fetch(new Request('https://quest.example/ready'), {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    });
    const body = await readJson<{ status: string; checks: Record<string, string>; missing: string[] }>(response);

    expect(response.status).toBe(200);
    expect(body.status).toBe('ready');
    expect(body.checks.databaseUrl).toBe('ok');
    expect(body.checks.databaseConnection).toBe('ok');
    expect(body.missing).toEqual([]);
  });

  it('returns published public quests for anonymous users', async () => {
    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'quest_1',
            title: 'Coffee Route',
            description: 'Quest description',
            creator_pro_id: 'pro_1',
            city_id: 'city_1',
            geo_scope: null,
            type: 'route',
            theme: 'coffee',
            difficulty: 'easy',
            status: 'published',
            visibility: 'public',
            reward_points: 100,
            steps_count: 2,
            published_at: '2026-03-16T10:00:00.000Z',
            created_at: '2026-03-16T09:00:00.000Z',
            updated_at: '2026-03-16T10:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [{ total: 1 }] });

    const response = await worker.fetch(new Request('https://quest.example/v1/quests'), {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    });
    const body = await readJson<{ items: Array<{ id: string; status: string; visibility: string }>; total: number }>(response);

    expect(response.status).toBe(200);
    expect(body.total).toBe(1);
    expect(body.items[0]).toMatchObject({
      id: 'quest_1',
      status: 'published',
      visibility: 'public',
    });
  });

  it('requires gateway auth for start endpoint', async () => {
    const response = await worker.fetch(new Request('https://quest.example/v1/quests/quest_1/start', { method: 'POST' }), {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    });
    const body = await readJson<{ error: { code: string } }>(response);

    expect(response.status).toBe(401);
    expect(body.error.code).toBe('UNAUTHORIZED');
    expect(executeMock).not.toHaveBeenCalled();
  });

  it('starts quest for authenticated user and creates in_progress progress', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
      ENVIRONMENT: 'test',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'vip_1', roles: ['member'] });

    executeMock
      .mockResolvedValueOnce({
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
            status: 'published',
            visibility: 'public',
            reward_points: 100,
            steps_count: 2,
            published_at: '2026-03-16T10:00:00.000Z',
            created_at: '2026-03-16T09:00:00.000Z',
            updated_at: '2026-03-16T10:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'qprog_1',
            quest_id: 'quest_1',
            user_id: 'vip_1',
            status: 'in_progress',
            current_step: 1,
            started_at: '2026-03-16T10:05:00.000Z',
            completed_at: null,
            created_at: '2026-03-16T10:05:00.000Z',
            updated_at: '2026-03-16T10:05:00.000Z',
          },
        ],
      });

    const response = await worker.fetch(
      new Request('https://quest.example/v1/quests/quest_1/start', {
        method: 'POST',
        headers: { 'X-Gateway-Auth': gatewayJwt },
      }),
      env
    );
    const body = await readJson<{ id: string; questId: string; status: string; currentStep: number }>(response);

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      id: 'qprog_1',
      questId: 'quest_1',
      status: 'in_progress',
      currentStep: 1,
    });
  });

  it('returns existing progress for repeated start without creating duplicate rows', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'vip_1', roles: ['member'] });

    executeMock
      .mockResolvedValueOnce({
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
            status: 'published',
            visibility: 'public',
            reward_points: 100,
            steps_count: 2,
            published_at: '2026-03-16T10:00:00.000Z',
            created_at: '2026-03-16T09:00:00.000Z',
            updated_at: '2026-03-16T10:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'qprog_existing',
            quest_id: 'quest_1',
            user_id: 'vip_1',
            status: 'in_progress',
            current_step: 1,
            started_at: '2026-03-16T10:05:00.000Z',
            completed_at: null,
            created_at: '2026-03-16T10:05:00.000Z',
            updated_at: '2026-03-16T10:05:00.000Z',
          },
        ],
      });

    const response = await worker.fetch(
      new Request('https://quest.example/v1/quests/quest_1/start', {
        method: 'POST',
        headers: { 'X-Gateway-Auth': gatewayJwt },
      }),
      env
    );
    const body = await readJson<{ id: string; status: string }>(response);

    expect(response.status).toBe(200);
    expect(body).toMatchObject({ id: 'qprog_existing', status: 'in_progress' });

    const executedSql = executeMock.mock.calls
      .map((call) => ((call[0] as { strings?: string[] } | undefined)?.strings ?? []).join(' '))
      .join('\n')
      .toLowerCase();
    expect(executedSql).not.toContain('insert into quest_progress');
  });

  it('returns conflict on start when existing progress is in terminal state', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'vip_1', roles: ['member'] });

    executeMock
      .mockResolvedValueOnce({
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
            status: 'published',
            visibility: 'public',
            reward_points: 100,
            steps_count: 2,
            published_at: '2026-03-16T10:00:00.000Z',
            created_at: '2026-03-16T09:00:00.000Z',
            updated_at: '2026-03-16T10:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'qprog_done',
            quest_id: 'quest_1',
            user_id: 'vip_1',
            status: 'completed',
            current_step: null,
            started_at: '2026-03-16T10:05:00.000Z',
            completed_at: '2026-03-16T10:10:00.000Z',
            created_at: '2026-03-16T10:05:00.000Z',
            updated_at: '2026-03-16T10:10:00.000Z',
          },
        ],
      });

    const response = await worker.fetch(
      new Request('https://quest.example/v1/quests/quest_1/start', {
        method: 'POST',
        headers: { 'X-Gateway-Auth': gatewayJwt },
      }),
      env
    );
    const body = await readJson<{ error: { code: string } }>(response);

    expect(response.status).toBe(409);
    expect(body.error.code).toBe('CONFLICT');
  });

  it('returns user progress for authenticated progress endpoint', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'vip_1', roles: ['member'] });

    executeMock
      .mockResolvedValueOnce({
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
            status: 'published',
            visibility: 'public',
            reward_points: 100,
            steps_count: 2,
            published_at: '2026-03-16T10:00:00.000Z',
            created_at: '2026-03-16T09:00:00.000Z',
            updated_at: '2026-03-16T10:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'qprog_1',
            quest_id: 'quest_1',
            user_id: 'vip_1',
            status: 'in_progress',
            current_step: 1,
            started_at: '2026-03-16T10:05:00.000Z',
            completed_at: null,
            created_at: '2026-03-16T10:05:00.000Z',
            updated_at: '2026-03-16T10:05:00.000Z',
          },
        ],
      });

    const response = await worker.fetch(
      new Request('https://quest.example/v1/quests/quest_1/progress', {
        method: 'GET',
        headers: { 'X-Gateway-Auth': gatewayJwt },
      }),
      env
    );
    const body = await readJson<{ id: string; questId: string; status: string; currentStep: number }>(response);

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      id: 'qprog_1',
      questId: 'quest_1',
      status: 'in_progress',
      currentStep: 1,
    });
  });

  it('returns not found for progress when user has not started quest', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'vip_1', roles: ['member'] });

    executeMock
      .mockResolvedValueOnce({
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
            status: 'published',
            visibility: 'public',
            reward_points: 100,
            steps_count: 2,
            published_at: '2026-03-16T10:00:00.000Z',
            created_at: '2026-03-16T09:00:00.000Z',
            updated_at: '2026-03-16T10:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [] });

    const response = await worker.fetch(
      new Request('https://quest.example/v1/quests/quest_1/progress', {
        method: 'GET',
        headers: { 'X-Gateway-Auth': gatewayJwt },
      }),
      env
    );
    const body = await readJson<{ error: { code: string } }>(response);

    expect(response.status).toBe(404);
    expect(body.error.code).toBe('NOT_FOUND');
  });

  it('keeps pass #3 and pro mutation routes closed', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
    };

    const responses = await Promise.all([
      worker.fetch(new Request('https://quest.example/v1/quests', { method: 'POST' }), env),
      worker.fetch(new Request('https://quest.example/v1/quests/quest_1/steps', { method: 'POST' }), env),
      worker.fetch(new Request('https://quest.example/v1/quests/quest_1/publish', { method: 'POST' }), env),
      worker.fetch(new Request('https://quest.example/v1/quests/quest_1/steps/qstep_1/submit', { method: 'POST' }), env),
      worker.fetch(new Request('https://quest.example/v1/quests/quest_1/submissions', { method: 'GET' }), env),
      worker.fetch(new Request('https://quest.example/v1/submissions/qsub_1/review', { method: 'POST' }), env),
    ]);

    for (const response of responses) {
      expect(response.status).toBe(404);
    }
    expect(executeMock).not.toHaveBeenCalled();
  });
});
