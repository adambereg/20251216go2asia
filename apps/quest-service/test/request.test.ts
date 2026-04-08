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

import { readJson } from '../../../tests/helpers/worker-test';
import worker from '../src/index';

describe('quest-service pass #1', () => {
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
    const response = await worker.fetch(
      new Request('https://quest.example/ready'),
      { DATABASE_URL: 'postgres://example', SERVICE_JWT_SECRET: 'service-secret' }
    );
    const body = await readJson<{ status: string; checks: Record<string, string>; missing: string[] }>(response);

    expect(response.status).toBe(200);
    expect(body.status).toBe('ready');
    expect(body.checks.databaseUrl).toBe('ok');
    expect(body.checks.databaseConnection).toBe('ok');
    expect(body.missing).toEqual([]);
  });

  it('returns not_ready when required dependencies are missing', async () => {
    const response = await worker.fetch(new Request('https://quest.example/ready'), {});
    const body = await readJson<{ status: string; missing: string[] }>(response);

    expect(response.status).toBe(503);
    expect(body.status).toBe('not_ready');
    expect(body.missing).toContain('databaseUrl');
    expect(body.missing).toContain('serviceJwtSecret');
    expect(body.missing).toContain('databaseConnection');
  });

  it('returns list of published public quests for anonymous users', async () => {
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

    const response = await worker.fetch(
      new Request('https://quest.example/v1/quests?page=1&pageSize=20&difficulty=easy'),
      { DATABASE_URL: 'postgres://example', SERVICE_JWT_SECRET: 'service-secret' }
    );

    const body = await readJson<{ items: Array<{ id: string; status: string; visibility: string }>; total: number }>(response);
    expect(response.status).toBe(200);
    expect(body.total).toBe(1);
    expect(body.items[0]).toMatchObject({
      id: 'quest_1',
      status: 'published',
      visibility: 'public',
    });

    const executedSql = executeMock.mock.calls
      .map((call) => ((call[0] as { strings?: string[] } | undefined)?.strings ?? []).join(' '))
      .join('\n')
      .toLowerCase();
    expect(executedSql).toContain("status = 'published'");
    expect(executedSql).toContain("visibility = 'public'");
  });

  it('returns ordered steps for published public quest detail', async () => {
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
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'qstep_1',
            quest_id: 'quest_1',
            order: 1,
            type: 'visit_place',
            target_type: 'place',
            target_id: 'pl_1',
            verification_type: 'auto',
            requirements_json: {},
            reward_points: null,
            created_at: '2026-03-16T10:00:00.000Z',
          },
          {
            id: 'qstep_2',
            quest_id: 'quest_1',
            order: 2,
            type: 'visit_partner',
            target_type: 'partner',
            target_id: 'rf_partner_1',
            verification_type: 'manual',
            requirements_json: {},
            reward_points: null,
            created_at: '2026-03-16T10:01:00.000Z',
          },
        ],
      });

    const response = await worker.fetch(
      new Request('https://quest.example/v1/quests/quest_1'),
      { DATABASE_URL: 'postgres://example', SERVICE_JWT_SECRET: 'service-secret' }
    );

    const body = await readJson<{ id: string; steps: Array<{ id: string; order: number }> }>(response);
    expect(response.status).toBe(200);
    expect(body.id).toBe('quest_1');
    expect(body.steps.map((step) => step.order)).toEqual([1, 2]);
  });

  it('returns not found when quest is draft/private/unavailable in public detail', async () => {
    executeMock.mockResolvedValueOnce({ rows: [] });

    const response = await worker.fetch(
      new Request('https://quest.example/v1/quests/quest_hidden'),
      { DATABASE_URL: 'postgres://example', SERVICE_JWT_SECRET: 'service-secret' }
    );

    const body = await readJson<{ error: { code: string } }>(response);
    expect(response.status).toBe(404);
    expect(body.error.code).toBe('NOT_FOUND');
  });

  it('keeps lifecycle and pro write routes closed in pass #1', async () => {
    const startResponse = await worker.fetch(
      new Request('https://quest.example/v1/quests/quest_1/start', { method: 'POST' }),
      { DATABASE_URL: 'postgres://example', SERVICE_JWT_SECRET: 'service-secret' }
    );
    const createResponse = await worker.fetch(
      new Request('https://quest.example/v1/quests', { method: 'POST' }),
      { DATABASE_URL: 'postgres://example', SERVICE_JWT_SECRET: 'service-secret' }
    );

    expect(startResponse.status).toBe(404);
    expect(createResponse.status).toBe(404);
    expect(executeMock).not.toHaveBeenCalled();
  });
});
