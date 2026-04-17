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

import { makeGatewayJwt, readJson } from '../../../tests/helpers/worker-test';
import worker, { type Env } from '../src/index';

describe('organizer-service v1', () => {
  beforeEach(() => {
    createDbMock.mockClear();
    executeMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('returns readiness checks for required dependencies', async () => {
    const response = await worker.fetch(new Request('https://organizer.example/ready'), {});
    const body = await readJson<{ status: string; missing: string[] }>(response);

    expect(response.status).toBe(503);
    expect(body.status).toBe('not_ready');
    expect(body.missing).toEqual(['databaseUrl', 'serviceJwtSecret']);
  });

  it('returns 401 for trips list without gateway auth', async () => {
    const response = await worker.fetch(
      new Request('https://organizer.example/v1/organizer/trips'),
      {
        SERVICE_JWT_SECRET: 'service-secret',
        DATABASE_URL: 'postgres://example',
      }
    );

    const body = await readJson<{ error: { code: string } }>(response);
    expect(response.status).toBe(401);
    expect(body.error.code).toBe('UNAUTHORIZED');
  });

  it('returns trips list for authenticated user', async () => {
    executeMock.mockResolvedValueOnce({
      rows: [
        {
          id: 'trip_1',
          user_id: 'user_123',
          title: 'Bangkok in May',
          destination_label: 'Bangkok',
          summary: 'Short planning pass',
          status: 'draft',
          start_date: null,
          end_date: null,
          created_at: '2026-04-16T10:00:00.000Z',
          updated_at: '2026-04-16T10:00:00.000Z',
          item_count: 0,
          pending_task_count: 1,
          note_count: 0,
        },
      ],
    });

    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!);

    const response = await worker.fetch(
      new Request('https://organizer.example/v1/organizer/trips', {
        headers: {
          'X-Gateway-Auth': gatewayJwt,
        },
      }),
      env
    );

    const body = await readJson<{ trips: Array<{ id: string; pendingTaskCount: number }> }>(response);
    expect(response.status).toBe(200);
    expect(body.trips).toHaveLength(1);
    expect(body.trips[0]).toMatchObject({
      id: 'trip_1',
      pendingTaskCount: 1,
    });
  });

  it('validates trip creation payload', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!);

    const response = await worker.fetch(
      new Request('https://organizer.example/v1/organizer/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          title: '',
        }),
      }),
      env
    );

    const body = await readJson<{ error: { code: string } }>(response);
    expect(response.status).toBe(400);
    expect(body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns existing trip item when same saved source is added twice', async () => {
    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'trip_1',
            user_id: 'user_123',
            title: 'Bangkok in May',
            destination_label: null,
            summary: null,
            status: 'draft',
            start_date: null,
            end_date: null,
            created_at: '2026-04-16T10:00:00.000Z',
            updated_at: '2026-04-16T10:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'titem_1',
            trip_id: 'trip_1',
            user_id: 'user_123',
            title: 'Saved post',
            note: null,
            source_module: 'space',
            source_entity_type: 'space_post',
            source_entity_id: 'spost_1',
            status: 'planned',
            created_at: '2026-04-16T10:00:00.000Z',
            updated_at: '2026-04-16T10:00:00.000Z',
          },
        ],
      });

    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!);

    const response = await worker.fetch(
      new Request('https://organizer.example/v1/organizer/trips/trip_1/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          title: 'Saved post',
          source: {
            module: 'space',
            entityType: 'space_post',
            entityId: 'spost_1',
          },
        }),
      }),
      env
    );

    const body = await readJson<{ item: { id: string }; applied: boolean }>(response);
    expect(response.status).toBe(200);
    expect(body.item.id).toBe('titem_1');
    expect(body.applied).toBe(false);
  });

  it('removes trip item without touching global saved ownership', async () => {
    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'trip_1',
            user_id: 'user_123',
            title: 'Bangkok in May',
            destination_label: null,
            summary: null,
            status: 'draft',
            start_date: null,
            end_date: null,
            created_at: '2026-04-16T10:00:00.000Z',
            updated_at: '2026-04-16T10:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [{ id: 'titem_1' }],
      });

    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!);

    const response = await worker.fetch(
      new Request('https://organizer.example/v1/organizer/trips/trip_1/items/titem_1', {
        method: 'DELETE',
        headers: {
          'X-Gateway-Auth': gatewayJwt,
        },
      }),
      env
    );

    const body = await readJson<{ removed: boolean; itemId: string }>(response);
    expect(response.status).toBe(200);
    expect(body.removed).toBe(true);
    expect(body.itemId).toBe('titem_1');
  });
});
