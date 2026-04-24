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

import { makeGatewayJwt, makeServiceJwt, readJson } from '../../../tests/helpers/worker-test';
import type { Env } from '../src/index';
import worker from '../src/index';

function buildQuestRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'quest_1',
    title: 'Quest title',
    description: null,
    creator_pro_id: 'pro_1',
    city_id: null,
    geo_scope: null,
    type: null,
    theme: null,
    difficulty: null,
    status: 'published',
    visibility: 'public',
    reward_points: 120,
    steps_count: 2,
    published_at: '2026-04-10T07:00:00.000Z',
    created_at: '2026-04-10T07:00:00.000Z',
    updated_at: '2026-04-10T07:00:00.000Z',
    ...overrides,
  };
}

function buildStepRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'qstep_2',
    quest_id: 'quest_1',
    order: 2,
    type: 'challenge',
    target_type: null,
    target_id: null,
    verification_type: 'manual',
    requirements_json: {},
    reward_points: null,
    created_at: '2026-04-10T08:30:00.000Z',
    ...overrides,
  };
}

function buildSubmissionReviewRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'sub_1',
    progress_id: 'qprog_1',
    step_id: 'qstep_2',
    user_id: 'user_1',
    proof_type: 'photo',
    proof_data: { mediaId: 'media_1' },
    status: 'pending',
    reviewed_by: null,
    reviewed_at: null,
    rejection_reason: null,
    created_at: '2026-04-10T08:00:00.000Z',
    updated_at: '2026-04-10T08:00:00.000Z',
    quest_id: 'quest_1',
    creator_pro_id: 'pro_1',
    progress_status: 'pending_review',
    current_step: 2,
    step_order: 2,
    ...overrides,
  };
}

function buildApprovedSubmissionRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'sub_1',
    progress_id: 'qprog_1',
    step_id: 'qstep_2',
    user_id: 'user_1',
    proof_type: 'photo',
    proof_data: { mediaId: 'media_1' },
    status: 'approved',
    reviewed_by: 'pro_1',
    reviewed_at: '2026-04-10T09:00:00.000Z',
    rejection_reason: null,
    created_at: '2026-04-10T08:00:00.000Z',
    updated_at: '2026-04-10T09:00:00.000Z',
    ...overrides,
  };
}

function buildRewardOutboxRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'qreward_1',
    quest_progress_id: 'qprog_1',
    quest_id: 'quest_1',
    user_id: 'user_1',
    points_amount: 120,
    action: 'quest_completed',
    external_id: 'quest:completed:qprog_1',
    source_event_id: 'quest.completed:qprog_1',
    metadata: {
      questId: 'quest_1',
      progressId: 'qprog_1',
      completedAt: '2026-04-10T09:00:00.000Z',
      rewardSource: 'quest.reward_points',
    },
    status: 'pending',
    attempt_count: 0,
    last_attempt_at: null,
    delivered_at: null,
    last_error: null,
    created_at: '2026-04-10T09:00:00.000Z',
    updated_at: '2026-04-10T09:00:00.000Z',
    ...overrides,
  };
}

function buildCompletionWithOutboxRow(overrides: Record<string, unknown> = {}) {
  return {
    progress_id: 'qprog_1',
    progress_quest_id: 'quest_1',
    progress_user_id: 'user_1',
    progress_status: 'completed',
    progress_current_step: null,
    progress_started_at: '2026-04-10T07:30:00.000Z',
    progress_completed_at: '2026-04-10T09:00:00.000Z',
    progress_created_at: '2026-04-10T07:30:00.000Z',
    progress_updated_at: '2026-04-10T09:00:00.000Z',
    outbox_id: 'qreward_1',
    outbox_quest_progress_id: 'qprog_1',
    outbox_quest_id: 'quest_1',
    outbox_user_id: 'user_1',
    outbox_points_amount: 120,
    outbox_action: 'quest_completed',
    outbox_external_id: 'quest:completed:qprog_1',
    outbox_source_event_id: 'quest.completed:qprog_1',
    outbox_metadata: {
      questId: 'quest_1',
      progressId: 'qprog_1',
      completedAt: '2026-04-10T09:00:00.000Z',
      rewardSource: 'quest.reward_points',
    },
    outbox_status: 'pending',
    outbox_attempt_count: 0,
    outbox_last_attempt_at: null,
    outbox_delivered_at: null,
    outbox_last_error: null,
    outbox_created_at: '2026-04-10T09:00:00.000Z',
    outbox_updated_at: '2026-04-10T09:00:00.000Z',
    ...overrides,
  };
}

function createExecutionContextHarness() {
  const tasks: Promise<unknown>[] = [];
  return {
    ctx: {
      waitUntil: vi.fn((promise: Promise<unknown>) => {
        tasks.push(promise);
      }),
      passThroughOnException: vi.fn(),
    } as unknown as ExecutionContext,
    async drain() {
      await Promise.allSettled(tasks);
    },
  };
}

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

  it('archives published quest for owner when no active progress or pending submissions exist', async () => {
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
            status: 'published',
            visibility: 'public',
            reward_points: null,
            steps_count: 1,
            published_at: '2026-03-16T10:00:00.000Z',
            created_at: '2026-03-16T09:00:00.000Z',
            updated_at: '2026-03-16T10:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [{ total: 0 }] })
      .mockResolvedValueOnce({ rows: [{ total: 0 }] })
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
            status: 'archived',
            visibility: 'public',
            reward_points: null,
            steps_count: 1,
            published_at: '2026-03-16T10:00:00.000Z',
            created_at: '2026-03-16T09:00:00.000Z',
            updated_at: '2026-03-16T11:00:00.000Z',
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
      });

    const response = await worker.fetch(
      new Request('https://quest.example/v1/quests/quest_1/archive', {
        method: 'POST',
        headers: { 'X-Gateway-Auth': jwt },
      }),
      env
    );
    const body = await readJson<{ status: string }>(response);
    expect(response.status).toBe(200);
    expect(body.status).toBe('archived');
  });

  it('blocks archive when active quest progress exists', async () => {
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
            status: 'published',
            visibility: 'public',
            reward_points: null,
            steps_count: 1,
            published_at: '2026-03-16T10:00:00.000Z',
            created_at: '2026-03-16T09:00:00.000Z',
            updated_at: '2026-03-16T10:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [{ total: 2 }] });

    const response = await worker.fetch(
      new Request('https://quest.example/v1/quests/quest_1/archive', {
        method: 'POST',
        headers: { 'X-Gateway-Auth': jwt },
      }),
      env
    );
    const body = await readJson<{ error: { code: string } }>(response);
    expect(response.status).toBe(409);
    expect(body.error.code).toBe('CONFLICT');
  });

  it('rejects archive transition for draft quest', async () => {
    const env: Env = { DATABASE_URL: 'postgres://example', SERVICE_JWT_SECRET: 'service-secret' };
    const jwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'pro_1', roles: ['pro'] });

    executeMock.mockResolvedValueOnce({
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
    });

    const response = await worker.fetch(
      new Request('https://quest.example/v1/quests/quest_1/archive', {
        method: 'POST',
        headers: { 'X-Gateway-Auth': jwt },
      }),
      env
    );
    const body = await readJson<{ error: { code: string } }>(response);
    expect(response.status).toBe(409);
    expect(body.error.code).toBe('CONFLICT');
  });

  it('lists owned quests for pro management reads including draft and private items', async () => {
    const env: Env = { DATABASE_URL: 'postgres://example', SERVICE_JWT_SECRET: 'service-secret' };
    const jwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'pro_1', roles: ['pro'] });

    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'quest_draft_1',
            title: 'Draft Coffee Route',
            description: null,
            creator_pro_id: 'pro_1',
            city_id: null,
            geo_scope: null,
            type: null,
            theme: null,
            difficulty: null,
            status: 'draft',
            visibility: 'private',
            reward_points: null,
            steps_count: 0,
            published_at: null,
            created_at: '2026-04-10T09:00:00.000Z',
            updated_at: '2026-04-10T09:00:00.000Z',
          },
          {
            id: 'quest_pub_1',
            title: 'Published Route',
            description: null,
            creator_pro_id: 'pro_1',
            city_id: null,
            geo_scope: null,
            type: null,
            theme: null,
            difficulty: 'easy',
            status: 'published',
            visibility: 'public',
            reward_points: 50,
            steps_count: 2,
            published_at: '2026-04-10T10:00:00.000Z',
            created_at: '2026-04-10T08:00:00.000Z',
            updated_at: '2026-04-10T10:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [{ total: 2 }] });

    const response = await worker.fetch(
      new Request('https://quest.example/v1/quests/mine?page=1&pageSize=20', {
        headers: { 'X-Gateway-Auth': jwt },
      }),
      env
    );
    const body = await readJson<{ items: Array<{ id: string; status: string; visibility: string }>; total: number }>(response);
    expect(response.status).toBe(200);
    expect(body.total).toBe(2);
    expect(body.items.map((item) => item.id)).toEqual(['quest_draft_1', 'quest_pub_1']);
    expect(body.items[0]).toMatchObject({ status: 'draft', visibility: 'private' });
  });

  it('returns owned quest detail for admin management reads', async () => {
    const env: Env = { DATABASE_URL: 'postgres://example', SERVICE_JWT_SECRET: 'service-secret' };
    const jwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'admin_1', roles: ['admin'] });

    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'quest_archived_1',
            title: 'Archived Route',
            description: 'Internal archived quest',
            creator_pro_id: 'pro_2',
            city_id: 'phuket',
            geo_scope: null,
            type: 'route',
            theme: 'city_discovery',
            difficulty: 'medium',
            status: 'archived',
            visibility: 'private',
            reward_points: 120,
            steps_count: 1,
            published_at: '2026-04-10T10:00:00.000Z',
            created_at: '2026-04-10T08:00:00.000Z',
            updated_at: '2026-04-10T11:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'qstep_1',
            quest_id: 'quest_archived_1',
            order: 1,
            type: 'challenge',
            target_type: null,
            target_id: null,
            verification_type: 'manual',
            requirements_json: {},
            reward_points: null,
            created_at: '2026-04-10T09:00:00.000Z',
          },
        ],
      });

    const response = await worker.fetch(
      new Request('https://quest.example/v1/quests/mine/quest_archived_1', {
        headers: { 'X-Gateway-Auth': jwt },
      }),
      env
    );
    const body = await readJson<{ id: string; status: string; visibility: string; steps: Array<{ id: string }> }>(response);
    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      id: 'quest_archived_1',
      status: 'archived',
      visibility: 'private',
    });
    expect(body.steps).toHaveLength(1);
  });

  it('forbids non-owner from reading another quest through management detail path', async () => {
    const env: Env = { DATABASE_URL: 'postgres://example', SERVICE_JWT_SECRET: 'service-secret' };
    const jwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'pro_1', roles: ['pro'] });

    executeMock.mockResolvedValueOnce({
      rows: [
        {
          id: 'quest_other_owner',
          title: 'Other Owner Route',
          description: null,
          creator_pro_id: 'pro_2',
          city_id: null,
          geo_scope: null,
          type: null,
          theme: null,
          difficulty: null,
          status: 'draft',
          visibility: 'private',
          reward_points: null,
          steps_count: 0,
          published_at: null,
          created_at: '2026-04-10T09:00:00.000Z',
          updated_at: '2026-04-10T09:00:00.000Z',
        },
      ],
    });

    const response = await worker.fetch(
      new Request('https://quest.example/v1/quests/mine/quest_other_owner', {
        headers: { 'X-Gateway-Auth': jwt },
      }),
      env
    );
    const body = await readJson<{ error: { code: string } }>(response);
    expect(response.status).toBe(403);
    expect(body.error.code).toBe('FORBIDDEN');
  });

  it('updates bounded draft quest fields for owner', async () => {
    const env: Env = { DATABASE_URL: 'postgres://example', SERVICE_JWT_SECRET: 'service-secret' };
    const jwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'pro_1', roles: ['pro'] });

    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'quest_1',
            title: 'Old title',
            description: 'Old description',
            creator_pro_id: 'pro_1',
            city_id: 'phuket',
            geo_scope: { lat: 7.88, lng: 98.39 },
            type: 'route',
            theme: 'walk',
            difficulty: 'easy',
            status: 'draft',
            visibility: 'private',
            reward_points: 100,
            steps_count: 1,
            published_at: null,
            created_at: '2026-04-10T08:00:00.000Z',
            updated_at: '2026-04-10T08:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'quest_1',
            title: 'New title',
            description: 'Old description',
            creator_pro_id: 'pro_1',
            city_id: 'bangkok',
            geo_scope: { lat: 13.75, lng: 100.5 },
            type: 'route',
            theme: 'walk',
            difficulty: 'easy',
            status: 'draft',
            visibility: 'private',
            reward_points: 100,
            steps_count: 1,
            published_at: null,
            created_at: '2026-04-10T08:00:00.000Z',
            updated_at: '2026-04-10T09:00:00.000Z',
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
            created_at: '2026-04-10T08:30:00.000Z',
          },
        ],
      });

    const response = await worker.fetch(
      new Request('https://quest.example/v1/quests/mine/quest_1', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-Gateway-Auth': jwt },
        body: JSON.stringify({
          title: 'New title',
          cityId: 'bangkok',
          geoScope: { lat: 13.75, lng: 100.5 },
        }),
      }),
      env
    );
    const body = await readJson<{ title: string; cityId: string; status: string }>(response);
    expect(response.status).toBe(200);
    expect(body).toMatchObject({ title: 'New title', cityId: 'bangkok', status: 'draft' });
  });

  it('rejects draft quest update when quest is published', async () => {
    const env: Env = { DATABASE_URL: 'postgres://example', SERVICE_JWT_SECRET: 'service-secret' };
    const jwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'pro_1', roles: ['pro'] });

    executeMock.mockResolvedValueOnce({
      rows: [
        {
          id: 'quest_1',
          title: 'Published',
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
          published_at: '2026-04-10T08:00:00.000Z',
          created_at: '2026-04-10T07:00:00.000Z',
          updated_at: '2026-04-10T08:00:00.000Z',
        },
      ],
    });

    const response = await worker.fetch(
      new Request('https://quest.example/v1/quests/mine/quest_1', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-Gateway-Auth': jwt },
        body: JSON.stringify({ title: 'Cannot edit' }),
      }),
      env
    );
    const body = await readJson<{ error: { code: string } }>(response);
    expect(response.status).toBe(409);
    expect(body.error.code).toBe('CONFLICT');
  });

  it('updates and deletes draft step with draft-only enforcement', async () => {
    const env: Env = { DATABASE_URL: 'postgres://example', SERVICE_JWT_SECRET: 'service-secret' };
    const jwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'pro_1', roles: ['pro'] });

    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'quest_1',
            title: 'Draft',
            description: null,
            creator_pro_id: 'pro_1',
            city_id: null,
            geo_scope: null,
            type: null,
            theme: null,
            difficulty: null,
            status: 'draft',
            visibility: 'private',
            reward_points: null,
            steps_count: 2,
            published_at: null,
            created_at: '2026-04-10T07:00:00.000Z',
            updated_at: '2026-04-10T07:00:00.000Z',
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
            reward_points: 10,
            created_at: '2026-04-10T07:30:00.000Z',
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
            verification_type: 'auto',
            requirements_json: { hint: 'updated' },
            reward_points: 15,
            created_at: '2026-04-10T07:30:00.000Z',
          },
        ],
      });

    const updateResponse = await worker.fetch(
      new Request('https://quest.example/v1/quests/mine/quest_1/steps/qstep_1', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-Gateway-Auth': jwt },
        body: JSON.stringify({ verificationType: 'auto', requirements: { hint: 'updated' }, rewardPoints: 15 }),
      }),
      env
    );
    const updateBody = await readJson<{ id: string; verificationType: string; rewardPoints: number }>(updateResponse);
    expect(updateResponse.status).toBe(200);
    expect(updateBody).toMatchObject({ id: 'qstep_1', verificationType: 'auto', rewardPoints: 15 });

    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'quest_1',
            title: 'Draft',
            description: null,
            creator_pro_id: 'pro_1',
            city_id: null,
            geo_scope: null,
            type: null,
            theme: null,
            difficulty: null,
            status: 'draft',
            visibility: 'private',
            reward_points: null,
            steps_count: 2,
            published_at: null,
            created_at: '2026-04-10T07:00:00.000Z',
            updated_at: '2026-04-10T07:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [{ id: 'qstep_2' }] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });

    const deleteResponse = await worker.fetch(
      new Request('https://quest.example/v1/quests/mine/quest_1/steps/qstep_2', {
        method: 'DELETE',
        headers: { 'X-Gateway-Auth': jwt },
      }),
      env
    );
    expect(deleteResponse.status).toBe(204);
  });

  it('lists review submissions with bounded status and stepId filters', async () => {
    const env: Env = { DATABASE_URL: 'postgres://example', SERVICE_JWT_SECRET: 'service-secret' };
    const jwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'pro_1', roles: ['pro'] });

    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'quest_1',
            title: 'Draft',
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
            steps_count: 2,
            published_at: '2026-04-10T07:00:00.000Z',
            created_at: '2026-04-10T07:00:00.000Z',
            updated_at: '2026-04-10T07:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'sub_pending_1',
            progress_id: 'qprog_1',
            step_id: 'qstep_2',
            user_id: 'user_1',
            proof_type: 'photo',
            proof_data: { mediaId: 'media_1' },
            status: 'pending',
            reviewed_by: null,
            reviewed_at: null,
            rejection_reason: null,
            created_at: '2026-04-10T08:00:00.000Z',
            updated_at: '2026-04-10T08:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [{ total: 1 }] });

    const response = await worker.fetch(
      new Request('https://quest.example/v1/quests/quest_1/submissions?status=pending&stepId=qstep_2&page=1&pageSize=20', {
        headers: { 'X-Gateway-Auth': jwt },
      }),
      env
    );
    const body = await readJson<{ items: Array<{ id: string; status: string }>; total: number }>(response);
    expect(response.status).toBe(200);
    expect(body.total).toBe(1);
    expect(body.items).toHaveLength(1);
    expect(body.items[0]).toMatchObject({ id: 'sub_pending_1', status: 'pending' });
  });

  it('rejects invalid submission status filter for review queue', async () => {
    const env: Env = { DATABASE_URL: 'postgres://example', SERVICE_JWT_SECRET: 'service-secret' };
    const jwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'pro_1', roles: ['pro'] });

    const response = await worker.fetch(
      new Request('https://quest.example/v1/quests/quest_1/submissions?status=invalid', {
        headers: { 'X-Gateway-Auth': jwt },
      }),
      env
    );
    const body = await readJson<{ error: { code: string } }>(response);
    expect(response.status).toBe(400);
    expect(body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns rejection reason in review response', async () => {
    const env: Env = { DATABASE_URL: 'postgres://example', SERVICE_JWT_SECRET: 'service-secret' };
    const jwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'pro_1', roles: ['pro'] });

    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'sub_1',
            progress_id: 'qprog_1',
            step_id: 'qstep_1',
            user_id: 'user_1',
            proof_type: 'photo',
            proof_data: { mediaId: 'media_1' },
            status: 'pending',
            reviewed_by: null,
            reviewed_at: null,
            rejection_reason: null,
            created_at: '2026-04-10T08:00:00.000Z',
            updated_at: '2026-04-10T08:00:00.000Z',
            quest_id: 'quest_1',
            creator_pro_id: 'pro_1',
            progress_status: 'pending_review',
            current_step: 1,
            step_order: 1,
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'quest_1',
            title: 'Published',
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
            steps_count: 2,
            published_at: '2026-04-10T07:00:00.000Z',
            created_at: '2026-04-10T07:00:00.000Z',
            updated_at: '2026-04-10T07:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'sub_1',
            progress_id: 'qprog_1',
            step_id: 'qstep_1',
            user_id: 'user_1',
            proof_type: 'photo',
            proof_data: { mediaId: 'media_1' },
            status: 'rejected',
            reviewed_by: 'pro_1',
            reviewed_at: '2026-04-10T09:00:00.000Z',
            rejection_reason: 'Photo is blurry',
            created_at: '2026-04-10T08:00:00.000Z',
            updated_at: '2026-04-10T09:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'qprog_1',
            quest_id: 'quest_1',
            user_id: 'user_1',
            status: 'in_progress',
            current_step: 1,
            started_at: '2026-04-10T07:30:00.000Z',
            completed_at: null,
            created_at: '2026-04-10T07:30:00.000Z',
            updated_at: '2026-04-10T09:00:00.000Z',
          },
        ],
      });

    const response = await worker.fetch(
      new Request('https://quest.example/v1/submissions/sub_1/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Gateway-Auth': jwt },
        body: JSON.stringify({ decision: 'reject', reason: 'Photo is blurry' }),
      }),
      env
    );
    const body = await readJson<{ status: string; rejectionReason: string | null }>(response);
    expect(response.status).toBe(200);
    expect(body).toMatchObject({ status: 'rejected', rejectionReason: 'Photo is blurry' });
  });

  it('delivers quest completion reward to points-service after approved final step', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
      POINTS_SERVICE_URL: 'https://points.example',
    };
    const jwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'pro_1', roles: ['pro'] });
    const execution = createExecutionContextHarness();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true, applied: true }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ awardId: 'badge_award_1', applied: true }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    executeMock
      .mockResolvedValueOnce({ rows: [buildSubmissionReviewRow()] })
      .mockResolvedValueOnce({ rows: [buildQuestRow()] })
      .mockResolvedValueOnce({ rows: [buildApprovedSubmissionRow()] })
      .mockResolvedValueOnce({ rows: [buildStepRow()] })
      .mockResolvedValueOnce({ rows: [buildCompletionWithOutboxRow()] })
      .mockResolvedValueOnce({
        rows: [buildRewardOutboxRow({ status: 'delivered', attempt_count: 1, delivered_at: '2026-04-10T09:00:01.000Z' })],
      });

    const response = await worker.fetch(
      new Request('https://quest.example/v1/submissions/sub_1/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Gateway-Auth': jwt },
        body: JSON.stringify({ decision: 'approve' }),
      }),
      env,
      execution.ctx
    );
    await execution.drain();

    const body = await readJson<{ status: string }>(response);
    expect(response.status).toBe(200);
    expect(body.status).toBe('approved');
    expect(execution.ctx.waitUntil).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://points.example/internal/points/add',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: expect.stringMatching(/^Bearer /),
          'X-Request-Id': expect.any(String),
        }),
      })
    );

    const requestInit = fetchMock.mock.calls[0]?.[1] as RequestInit;
    const payload = JSON.parse(String(requestInit.body)) as Record<string, unknown>;
    expect(payload).toMatchObject({
      userId: 'user_1',
      amount: 120,
      action: 'quest_completed',
      externalId: 'quest:completed:qprog_1',
      sourceEventId: 'quest.completed:qprog_1',
      metadata: {
        questId: 'quest_1',
        progressId: 'qprog_1',
        rewardSource: 'quest.reward_points',
      },
    });
    expect((payload.metadata as Record<string, unknown>).completedAt).toEqual(expect.any(String));

    expect(fetchMock).toHaveBeenCalledWith(
      'https://points.example/internal/points/badges/award',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: expect.stringMatching(/^Bearer /),
          'X-Request-Id': expect.any(String),
        }),
      })
    );

    const badgeRequestInit = fetchMock.mock.calls[1]?.[1] as RequestInit;
    const badgePayload = JSON.parse(String(badgeRequestInit.body)) as Record<string, unknown>;
    expect(badgePayload).toMatchObject({
      userId: 'user_1',
      badgeCode: 'first_quest_completed',
      sourceType: 'quest.completed',
      sourceId: 'qprog_1',
      metadata: {
        questId: 'quest_1',
        progressId: 'qprog_1',
        badgeSource: 'quest.completed',
      },
    });
    expect((badgePayload.metadata as Record<string, unknown>).completedAt).toEqual(expect.any(String));
  });

  it('keeps approved completion response successful when points reward delivery fails', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
      POINTS_SERVICE_URL: 'https://points.example',
    };
    const jwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'pro_1', roles: ['pro'] });
    const execution = createExecutionContextHarness();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('upstream down', { status: 503 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ awardId: 'badge_award_1', applied: true }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    executeMock
      .mockResolvedValueOnce({ rows: [buildSubmissionReviewRow()] })
      .mockResolvedValueOnce({ rows: [buildQuestRow()] })
      .mockResolvedValueOnce({ rows: [buildApprovedSubmissionRow()] })
      .mockResolvedValueOnce({ rows: [buildStepRow()] })
      .mockResolvedValueOnce({ rows: [buildCompletionWithOutboxRow()] })
      .mockResolvedValueOnce({
        rows: [buildRewardOutboxRow({ last_attempt_at: '2026-04-10T09:00:01.000Z', last_error: 'Points retryable response 503', attempt_count: 1 })],
      });

    const response = await worker.fetch(
      new Request('https://quest.example/v1/submissions/sub_1/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Gateway-Auth': jwt },
        body: JSON.stringify({ decision: 'approve' }),
      }),
      env,
      execution.ctx
    );
    await execution.drain();

    const body = await readJson<{ status: string }>(response);
    expect(response.status).toBe(200);
    expect(body.status).toBe('approved');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('marks reward outbox delivered when points-service returns duplicate accepted response', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
      POINTS_SERVICE_URL: 'https://points.example',
    };
    const jwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'pro_1', roles: ['pro'] });
    const execution = createExecutionContextHarness();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ transactionId: 'ptx_1', applied: false, balance: 120 }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ awardId: 'badge_award_1', applied: true }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    executeMock
      .mockResolvedValueOnce({ rows: [buildSubmissionReviewRow()] })
      .mockResolvedValueOnce({ rows: [buildQuestRow()] })
      .mockResolvedValueOnce({ rows: [buildApprovedSubmissionRow()] })
      .mockResolvedValueOnce({ rows: [buildStepRow()] })
      .mockResolvedValueOnce({ rows: [buildCompletionWithOutboxRow()] })
      .mockResolvedValueOnce({
        rows: [buildRewardOutboxRow({ status: 'delivered', attempt_count: 1, delivered_at: '2026-04-10T09:00:01.000Z' })],
      });

    const response = await worker.fetch(
      new Request('https://quest.example/v1/submissions/sub_1/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Gateway-Auth': jwt },
        body: JSON.stringify({ decision: 'approve' }),
      }),
      env,
      execution.ctx
    );
    await execution.drain();

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('marks reward outbox failed on non-retryable points conflict', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
      POINTS_SERVICE_URL: 'https://points.example',
    };
    const jwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'pro_1', roles: ['pro'] });
    const execution = createExecutionContextHarness();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ error: { code: 'Conflict', message: 'externalId conflict' } }), { status: 409 })
      )
      .mockResolvedValueOnce(new Response(JSON.stringify({ awardId: 'badge_award_1', applied: true }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    executeMock
      .mockResolvedValueOnce({ rows: [buildSubmissionReviewRow()] })
      .mockResolvedValueOnce({ rows: [buildQuestRow()] })
      .mockResolvedValueOnce({ rows: [buildApprovedSubmissionRow()] })
      .mockResolvedValueOnce({ rows: [buildStepRow()] })
      .mockResolvedValueOnce({ rows: [buildCompletionWithOutboxRow()] })
      .mockResolvedValueOnce({
        rows: [buildRewardOutboxRow({ status: 'failed', attempt_count: 1, last_error: 'Points conflict 409 for quest:completed:qprog_1' })],
      });

    const response = await worker.fetch(
      new Request('https://quest.example/v1/submissions/sub_1/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Gateway-Auth': jwt },
        body: JSON.stringify({ decision: 'approve' }),
      }),
      env,
      execution.ctx
    );
    await execution.drain();

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('skips points reward delivery but still awards first quest badge when completed quest has no reward points', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
      POINTS_SERVICE_URL: 'https://points.example',
    };
    const jwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'pro_1', roles: ['pro'] });
    const execution = createExecutionContextHarness();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ awardId: 'badge_award_1', applied: true }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    executeMock
      .mockResolvedValueOnce({ rows: [buildSubmissionReviewRow()] })
      .mockResolvedValueOnce({ rows: [buildQuestRow({ reward_points: 0 })] })
      .mockResolvedValueOnce({ rows: [buildApprovedSubmissionRow()] })
      .mockResolvedValueOnce({ rows: [buildStepRow()] })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'qprog_1',
            quest_id: 'quest_1',
            user_id: 'user_1',
            status: 'completed',
            current_step: null,
            started_at: '2026-04-10T07:30:00.000Z',
            completed_at: '2026-04-10T09:00:00.000Z',
            created_at: '2026-04-10T07:30:00.000Z',
            updated_at: '2026-04-10T09:00:00.000Z',
          },
        ],
      });

    const response = await worker.fetch(
      new Request('https://quest.example/v1/submissions/sub_1/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Gateway-Auth': jwt },
        body: JSON.stringify({ decision: 'approve' }),
      }),
      env,
      execution.ctx
    );
    await execution.drain();

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://points.example/internal/points/badges/award',
      expect.objectContaining({
        method: 'POST',
      })
    );
  });

  it('keeps approved completion response successful when badge auto-award fails', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
      POINTS_SERVICE_URL: 'https://points.example',
    };
    const jwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'pro_1', roles: ['pro'] });
    const execution = createExecutionContextHarness();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true, applied: true }), { status: 200 }))
      .mockResolvedValueOnce(new Response('badge upstream down', { status: 503 }));
    vi.stubGlobal('fetch', fetchMock);

    executeMock
      .mockResolvedValueOnce({ rows: [buildSubmissionReviewRow()] })
      .mockResolvedValueOnce({ rows: [buildQuestRow()] })
      .mockResolvedValueOnce({ rows: [buildApprovedSubmissionRow()] })
      .mockResolvedValueOnce({ rows: [buildStepRow()] })
      .mockResolvedValueOnce({ rows: [buildCompletionWithOutboxRow()] })
      .mockResolvedValueOnce({
        rows: [buildRewardOutboxRow({ status: 'delivered', attempt_count: 1, delivered_at: '2026-04-10T09:00:01.000Z' })],
      });

    const response = await worker.fetch(
      new Request('https://quest.example/v1/submissions/sub_1/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Gateway-Auth': jwt },
        body: JSON.stringify({ decision: 'approve' }),
      }),
      env,
      execution.ctx
    );
    await execution.drain();

    const body = await readJson<{ status: string }>(response);
    expect(response.status).toBe(200);
    expect(body.status).toBe('approved');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('treats duplicate badge response as non-blocking after quest completion', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
      POINTS_SERVICE_URL: 'https://points.example',
    };
    const jwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'pro_1', roles: ['pro'] });
    const execution = createExecutionContextHarness();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true, applied: true }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ awardId: 'badge_award_1', applied: false }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    executeMock
      .mockResolvedValueOnce({ rows: [buildSubmissionReviewRow()] })
      .mockResolvedValueOnce({ rows: [buildQuestRow()] })
      .mockResolvedValueOnce({ rows: [buildApprovedSubmissionRow()] })
      .mockResolvedValueOnce({ rows: [buildStepRow()] })
      .mockResolvedValueOnce({ rows: [buildCompletionWithOutboxRow()] })
      .mockResolvedValueOnce({
        rows: [buildRewardOutboxRow({ status: 'delivered', attempt_count: 1, delivered_at: '2026-04-10T09:00:01.000Z' })],
      });

    const response = await worker.fetch(
      new Request('https://quest.example/v1/submissions/sub_1/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Gateway-Auth': jwt },
        body: JSON.stringify({ decision: 'approve' }),
      }),
      env,
      execution.ctx
    );
    await execution.drain();

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('treats badge conflict as non-blocking after quest completion', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
      POINTS_SERVICE_URL: 'https://points.example',
    };
    const jwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'pro_1', roles: ['pro'] });
    const execution = createExecutionContextHarness();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true, applied: true }), { status: 200 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ error: { code: 'CONFLICT', message: 'Badge already awarded with different source' } }), {
          status: 409,
        })
      );
    vi.stubGlobal('fetch', fetchMock);

    executeMock
      .mockResolvedValueOnce({ rows: [buildSubmissionReviewRow()] })
      .mockResolvedValueOnce({ rows: [buildQuestRow()] })
      .mockResolvedValueOnce({ rows: [buildApprovedSubmissionRow()] })
      .mockResolvedValueOnce({ rows: [buildStepRow()] })
      .mockResolvedValueOnce({ rows: [buildCompletionWithOutboxRow()] })
      .mockResolvedValueOnce({
        rows: [buildRewardOutboxRow({ status: 'delivered', attempt_count: 1, delivered_at: '2026-04-10T09:00:01.000Z' })],
      });

    const response = await worker.fetch(
      new Request('https://quest.example/v1/submissions/sub_1/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Gateway-Auth': jwt },
        body: JSON.stringify({ decision: 'approve' }),
      }),
      env,
      execution.ctx
    );
    await execution.drain();

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does not attempt quest reward delivery for already completed progress', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
      POINTS_SERVICE_URL: 'https://points.example',
    };
    const jwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    executeMock
      .mockResolvedValueOnce({ rows: [buildQuestRow()] })
      .mockResolvedValueOnce({ rows: [buildStepRow({ id: 'qstep_1', order: 1, verification_type: 'auto' })] })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'qprog_1',
            quest_id: 'quest_1',
            user_id: 'user_1',
            status: 'completed',
            current_step: null,
            started_at: '2026-04-10T07:30:00.000Z',
            completed_at: '2026-04-10T09:00:00.000Z',
            created_at: '2026-04-10T07:30:00.000Z',
            updated_at: '2026-04-10T09:00:00.000Z',
          },
        ],
      });

    const response = await worker.fetch(
      new Request('https://quest.example/v1/quests/quest_1/steps/qstep_1/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Gateway-Auth': jwt },
        body: JSON.stringify({ proofType: 'text', proofData: {} }),
      }),
      env
    );

    const body = await readJson<{ error: { code: string } }>(response);
    expect(response.status).toBe(409);
    expect(body.error.code).toBe('CONFLICT');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects unauthorized replay-pending internal requests', async () => {
    const response = await worker.fetch(
      new Request('https://quest.example/internal/quests/rewards/replay-pending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 5 }),
      }),
      { DATABASE_URL: 'postgres://example', SERVICE_JWT_SECRET: 'service-secret', POINTS_SERVICE_URL: 'https://points.example' }
    );

    const body = await readJson<{ error: { code: string } }>(response);
    expect(response.status).toBe(401);
    expect(body.error.code).toBe('UNAUTHORIZED');
  });

  it('replays pending reward deliveries with service auth', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
      POINTS_SERVICE_URL: 'https://points.example',
    };
    const token = await makeServiceJwt(env.SERVICE_JWT_SECRET!, 'quest-service', { sub: 'ops-service' });
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ transactionId: 'ptx_1', applied: true, balance: 120 }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    executeMock
      .mockResolvedValueOnce({
        rows: [
          buildRewardOutboxRow(),
          buildRewardOutboxRow({
            id: 'qreward_2',
            quest_progress_id: 'qprog_2',
            external_id: 'quest:completed:qprog_2',
            source_event_id: 'quest.completed:qprog_2',
            metadata: {
              questId: 'quest_2',
              progressId: 'qprog_2',
              completedAt: '2026-04-10T10:00:00.000Z',
              rewardSource: 'quest.reward_points',
            },
          }),
        ],
      })
      .mockResolvedValueOnce({
        rows: [buildRewardOutboxRow({ status: 'delivered', attempt_count: 1, delivered_at: '2026-04-10T09:00:01.000Z' })],
      })
      .mockResolvedValueOnce({
        rows: [
          buildRewardOutboxRow({
            id: 'qreward_2',
            quest_progress_id: 'qprog_2',
            external_id: 'quest:completed:qprog_2',
            source_event_id: 'quest.completed:qprog_2',
            metadata: {
              questId: 'quest_2',
              progressId: 'qprog_2',
              completedAt: '2026-04-10T10:00:00.000Z',
              rewardSource: 'quest.reward_points',
            },
            status: 'delivered',
            attempt_count: 1,
            delivered_at: '2026-04-10T10:00:01.000Z',
          }),
        ],
      });

    const response = await worker.fetch(
      new Request('https://quest.example/internal/quests/rewards/replay-pending', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ limit: 2 }),
      }),
      env
    );

    const body = await readJson<{
      processed: number;
      delivered: number;
      stillPending: number;
      failed: number;
      skipped: number;
      requestedBy: string;
    }>(response);
    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      processed: 2,
      delivered: 2,
      stillPending: 0,
      failed: 0,
      skipped: 0,
      requestedBy: 'ops-service',
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('returns internal outbox stats with service auth', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
      POINTS_SERVICE_URL: 'https://points.example',
    };
    const token = await makeServiceJwt(env.SERVICE_JWT_SECRET!, 'quest-service', { sub: 'ops-service' });

    executeMock.mockResolvedValueOnce({
      rows: [
        {
          pending_count: 2,
          delivered_count: 5,
          failed_count: 1,
          oldest_pending_created_at: '2026-04-10T09:00:00.000Z',
          oldest_failed_created_at: '2026-04-10T08:00:00.000Z',
        },
      ],
    });

    const response = await worker.fetch(
      new Request('https://quest.example/internal/quests/rewards/outbox/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      env
    );

    const body = await readJson<{
      counts: { pending: number; delivered: number; failed: number };
      oldestPending: { createdAt: string } | null;
      oldestFailed: { createdAt: string } | null;
      requestedBy: string;
    }>(response);
    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      counts: { pending: 2, delivered: 5, failed: 1 },
      oldestPending: { createdAt: '2026-04-10T09:00:00.000Z' },
      oldestFailed: { createdAt: '2026-04-10T08:00:00.000Z' },
      requestedBy: 'ops-service',
    });
  });

  it('rejects unauthorized internal outbox stats requests', async () => {
    const response = await worker.fetch(
      new Request('https://quest.example/internal/quests/rewards/outbox/stats'),
      { DATABASE_URL: 'postgres://example', SERVICE_JWT_SECRET: 'service-secret', POINTS_SERVICE_URL: 'https://points.example' }
    );

    const body = await readJson<{ error: { code: string } }>(response);
    expect(response.status).toBe(401);
    expect(body.error.code).toBe('UNAUTHORIZED');
  });

  it('rejects unauthorized failed outbox list requests', async () => {
    const response = await worker.fetch(
      new Request('https://quest.example/internal/quests/rewards/outbox/failed'),
      { DATABASE_URL: 'postgres://example', SERVICE_JWT_SECRET: 'service-secret', POINTS_SERVICE_URL: 'https://points.example' }
    );

    const body = await readJson<{ error: { code: string } }>(response);
    expect(response.status).toBe(401);
    expect(body.error.code).toBe('UNAUTHORIZED');
  });

  it('returns failed outbox drilldown rows with default limit and compact shape', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
      POINTS_SERVICE_URL: 'https://points.example',
    };
    const token = await makeServiceJwt(env.SERVICE_JWT_SECRET!, 'quest-service', { sub: 'ops-service' });

    executeMock.mockResolvedValueOnce({
      rows: [
        buildRewardOutboxRow({
          id: 'qreward_failed_2',
          quest_progress_id: 'qprog_2',
          quest_id: 'quest_2',
          user_id: 'user_2',
          points_amount: 80,
          external_id: 'quest:completed:qprog_2',
          source_event_id: 'quest.completed:qprog_2',
          status: 'failed',
          attempt_count: 3,
          last_attempt_at: '2026-04-10T09:30:00.000Z',
          last_error: 'Points conflict 409 for quest:completed:qprog_2',
          created_at: '2026-04-10T09:00:00.000Z',
          updated_at: '2026-04-10T09:30:00.000Z',
        }),
        buildRewardOutboxRow({
          id: 'qreward_failed_1',
          status: 'failed',
          attempt_count: 1,
          last_attempt_at: '2026-04-10T09:10:00.000Z',
          last_error: 'Points non-retryable response 400',
          updated_at: '2026-04-10T09:10:00.000Z',
        }),
      ],
    });

    const response = await worker.fetch(
      new Request('https://quest.example/internal/quests/rewards/outbox/failed', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      env
    );

    const body = await readJson<{
      items: Array<{
        id: string;
        questProgressId: string;
        questId: string;
        userId: string;
        pointsAmount: number;
        action: string;
        externalId: string;
        sourceEventId: string | null;
        status: string;
        attemptCount: number;
        lastAttemptAt: string | null;
        lastError: string | null;
        createdAt: string | null;
        updatedAt: string | null;
        metadata?: unknown;
      }>;
      limit: number;
      requestedBy: string;
    }>(response);

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      limit: 20,
      requestedBy: 'ops-service',
    });
    expect(body.items).toHaveLength(2);
    expect(body.items[0]).toMatchObject({
      id: 'qreward_failed_2',
      questProgressId: 'qprog_2',
      questId: 'quest_2',
      userId: 'user_2',
      pointsAmount: 80,
      action: 'quest_completed',
      externalId: 'quest:completed:qprog_2',
      sourceEventId: 'quest.completed:qprog_2',
      status: 'failed',
      attemptCount: 3,
      lastAttemptAt: '2026-04-10T09:30:00.000Z',
      lastError: 'Points conflict 409 for quest:completed:qprog_2',
      createdAt: '2026-04-10T09:00:00.000Z',
      updatedAt: '2026-04-10T09:30:00.000Z',
    });
    expect(body.items.every((item) => !('metadata' in item))).toBe(true);

    const query = executeMock.mock.calls[0]?.[0] as { strings: string[]; values: unknown[] };
    expect(query.strings.join('')).toContain("WHERE status = 'failed'");
    expect(query.strings.join('')).toContain('ORDER BY updated_at DESC, id DESC');
  });

  it('clamps failed outbox list limit to max 100', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
      POINTS_SERVICE_URL: 'https://points.example',
    };
    const token = await makeServiceJwt(env.SERVICE_JWT_SECRET!, 'quest-service', { sub: 'ops-service' });

    executeMock.mockResolvedValueOnce({ rows: [] });

    const response = await worker.fetch(
      new Request('https://quest.example/internal/quests/rewards/outbox/failed?limit=500', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      env
    );

    const body = await readJson<{ items: unknown[]; limit: number }>(response);
    expect(response.status).toBe(200);
    expect(body.limit).toBe(100);

    const query = executeMock.mock.calls[0]?.[0] as { values: unknown[] };
    expect(query.values.at(-1)).toBe(100);
  });

  it('rejects unauthorized failed outbox requeue requests', async () => {
    const response = await worker.fetch(
      new Request('https://quest.example/internal/quests/rewards/outbox/requeue-failed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: ['qreward_1'] }),
      }),
      { DATABASE_URL: 'postgres://example', SERVICE_JWT_SECRET: 'service-secret', POINTS_SERVICE_URL: 'https://points.example' }
    );

    const body = await readJson<{ error: { code: string } }>(response);
    expect(response.status).toBe(401);
    expect(body.error.code).toBe('UNAUTHORIZED');
  });

  it('requeues selected failed outbox rows back to pending without delivering points', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
      POINTS_SERVICE_URL: 'https://points.example',
    };
    const token = await makeServiceJwt(env.SERVICE_JWT_SECRET!, 'quest-service', { sub: 'ops-service' });
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    executeMock
      .mockResolvedValueOnce({
        rows: [
          buildRewardOutboxRow({
            id: 'qreward_failed_1',
            status: 'failed',
            attempt_count: 2,
            last_attempt_at: '2026-04-10T09:10:00.000Z',
            last_error: 'Points conflict 409 for quest:completed:qprog_1',
          }),
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          buildRewardOutboxRow({
            id: 'qreward_failed_1',
            status: 'pending',
            attempt_count: 2,
            last_attempt_at: '2026-04-10T09:10:00.000Z',
            last_error:
              'Points conflict 409 for quest:completed:qprog_1\nManual requeue requested by ops-service: reviewed with points ledger',
            updated_at: '2026-04-10T10:00:00.000Z',
          }),
        ],
      });

    const response = await worker.fetch(
      new Request('https://quest.example/internal/quests/rewards/outbox/requeue-failed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ids: ['qreward_failed_1'], reason: 'reviewed with points ledger' }),
      }),
      env
    );

    const body = await readJson<{
      requested: number;
      requeued: number;
      skipped: number;
      notFound: number;
      invalidStatus: number;
      requestedBy: string;
    }>(response);
    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      requested: 1,
      requeued: 1,
      skipped: 0,
      notFound: 0,
      invalidStatus: 0,
      requestedBy: 'ops-service',
    });
    expect(fetchMock).not.toHaveBeenCalled();

    const updateQuery = executeMock.mock.calls[1]?.[0] as { strings: string[] };
    expect(updateQuery.strings.join('')).toContain("status = 'pending'");
  });

  it('reports invalid status and not found rows during failed outbox requeue', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
      POINTS_SERVICE_URL: 'https://points.example',
    };
    const token = await makeServiceJwt(env.SERVICE_JWT_SECRET!, 'quest-service', { sub: 'ops-service' });

    executeMock.mockResolvedValueOnce({
      rows: [
        buildRewardOutboxRow({ id: 'qreward_pending_1', status: 'pending' }),
        buildRewardOutboxRow({ id: 'qreward_delivered_1', status: 'delivered', delivered_at: '2026-04-10T09:20:00.000Z' }),
      ],
    });

    const response = await worker.fetch(
      new Request('https://quest.example/internal/quests/rewards/outbox/requeue-failed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ids: ['qreward_pending_1', 'qreward_delivered_1', 'qreward_missing_1'] }),
      }),
      env
    );

    const body = await readJson<{
      requested: number;
      requeued: number;
      skipped: number;
      notFound: number;
      invalidStatus: number;
    }>(response);
    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      requested: 3,
      requeued: 0,
      skipped: 3,
      notFound: 1,
      invalidStatus: 2,
    });
    expect(executeMock).toHaveBeenCalledTimes(1);
  });

  it('runs scheduled replay using the shared pending replay helper', async () => {
    const env: Env = {
      DATABASE_URL: 'postgres://example',
      SERVICE_JWT_SECRET: 'service-secret',
      POINTS_SERVICE_URL: 'https://points.example',
    };
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ transactionId: 'ptx_1', applied: true, balance: 120 }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    executeMock
      .mockResolvedValueOnce({
        rows: [buildRewardOutboxRow()],
      })
      .mockResolvedValueOnce({
        rows: [buildRewardOutboxRow({ status: 'delivered', attempt_count: 1, delivered_at: '2026-04-10T09:00:01.000Z' })],
      });

    await worker.scheduled?.(
      {
        cron: '*/10 * * * *',
        scheduledTime: Date.parse('2026-04-24T10:00:00.000Z'),
      } as ScheduledController,
      env,
      {
        waitUntil: vi.fn(),
        passThroughOnException: vi.fn(),
      } as unknown as ExecutionContext
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://points.example/internal/points/add',
      expect.objectContaining({
        method: 'POST',
      })
    );
  });

  it('returns minimum operational stats for owned quest', async () => {
    const env: Env = { DATABASE_URL: 'postgres://example', SERVICE_JWT_SECRET: 'service-secret' };
    const jwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'pro_1', roles: ['pro'] });

    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'quest_1',
            title: 'Published',
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
            steps_count: 2,
            published_at: '2026-04-10T07:00:00.000Z',
            created_at: '2026-04-10T07:00:00.000Z',
            updated_at: '2026-04-10T07:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [{ started_count: 12, completed_count: 5 }] })
      .mockResolvedValueOnce({ rows: [{ total: 3 }] });

    const response = await worker.fetch(
      new Request('https://quest.example/v1/quests/mine/quest_1/stats', {
        headers: { 'X-Gateway-Auth': jwt },
      }),
      env
    );
    const body = await readJson<{
      questId: string;
      startedCount: number;
      completedCount: number;
      pendingReviewCount: number;
    }>(response);
    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      questId: 'quest_1',
      startedCount: 12,
      completedCount: 5,
      pendingReviewCount: 3,
    });
  });

  it('forbids non-owner from reading quest operational stats', async () => {
    const env: Env = { DATABASE_URL: 'postgres://example', SERVICE_JWT_SECRET: 'service-secret' };
    const jwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'pro_1', roles: ['pro'] });

    executeMock.mockResolvedValueOnce({
      rows: [
        {
          id: 'quest_1',
          title: 'Published',
          description: null,
          creator_pro_id: 'pro_2',
          city_id: null,
          geo_scope: null,
          type: null,
          theme: null,
          difficulty: null,
          status: 'published',
          visibility: 'public',
          reward_points: null,
          steps_count: 2,
          published_at: '2026-04-10T07:00:00.000Z',
          created_at: '2026-04-10T07:00:00.000Z',
          updated_at: '2026-04-10T07:00:00.000Z',
        },
      ],
    });

    const response = await worker.fetch(
      new Request('https://quest.example/v1/quests/mine/quest_1/stats', {
        headers: { 'X-Gateway-Auth': jwt },
      }),
      env
    );
    const body = await readJson<{ error: { code: string } }>(response);
    expect(response.status).toBe(403);
    expect(body.error.code).toBe('FORBIDDEN');
  });

  it('keeps drafts out of public detail read', async () => {
    executeMock.mockResolvedValueOnce({ rows: [] });
    const response = await worker.fetch(
      new Request('https://quest.example/v1/quests/quest_draft_hidden'),
      { DATABASE_URL: 'postgres://example', SERVICE_JWT_SECRET: 'service-secret' }
    );
    expect(response.status).toBe(404);
  });

  it('keeps archived quests out of public detail read', async () => {
    executeMock.mockResolvedValueOnce({ rows: [] });
    const response = await worker.fetch(
      new Request('https://quest.example/v1/quests/quest_archived_hidden'),
      { DATABASE_URL: 'postgres://example', SERVICE_JWT_SECRET: 'service-secret' }
    );
    expect(response.status).toBe(404);
  });
});
