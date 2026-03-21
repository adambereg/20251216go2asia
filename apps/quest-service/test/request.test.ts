import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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
  createNoopQuestEventPublisher: createPublisherMock,
}));

import { makeGatewayJwt, readJson } from '../../../tests/helpers/worker-test';
import worker, { type Env } from '../src/index';

describe('quest-service v1', () => {
  beforeEach(() => {
    createDbMock.mockClear();
    executeMock.mockReset();
    createPublisherMock.mockClear();
    publishMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('returns readiness checks for required dependencies', async () => {
    const response = await worker.fetch(new Request('https://quest.example/ready'), {});
    const body = await readJson<{ status: string; missing: string[] }>(response);

    expect(response.status).toBe(503);
    expect(body.status).toBe('not_ready');
    expect(body.missing).toEqual(['databaseUrl', 'serviceJwtSecret']);
  });

  it('returns list of published quests for anonymous users', async () => {
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
      new Request('https://quest.example/v1/quests'),
      {
        DATABASE_URL: 'postgres://example',
        SERVICE_JWT_SECRET: 'service-secret',
      }
    );

    const body = await readJson<{ items: Array<{ id: string; status: string }>; total: number }>(response);
    expect(response.status).toBe(200);
    expect(body.total).toBe(1);
    expect(body.items[0]).toMatchObject({
      id: 'quest_1',
      status: 'published',
    });
  });

  it('returns 401 for protected quest creation without gateway auth', async () => {
    const response = await worker.fetch(
      new Request('https://quest.example/v1/quests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Coffee Route',
        }),
      }),
      {
        SERVICE_JWT_SECRET: 'service-secret',
        DATABASE_URL: 'postgres://example',
      }
    );

    const body = await readJson<{ error: { code: string } }>(response);
    expect(response.status).toBe(401);
    expect(body.error.code).toBe('UNAUTHORIZED');
  });

  it('creates quest draft for pro principal', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'pro_1', roles: ['pro'] });

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
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          title: 'Coffee Route',
          description: 'Quest description',
          difficulty: 'easy',
          visibility: 'public',
          rewardPoints: 100,
        }),
      }),
      env
    );

    const body = await readJson<{ id: string; status: string; creatorProId: string }>(response);
    expect(response.status).toBe(201);
    expect(body).toMatchObject({
      id: 'quest_1',
      status: 'draft',
      creatorProId: 'pro_1',
    });
  });

  it('starts quest for authenticated user', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
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
        headers: {
          'X-Gateway-Auth': gatewayJwt,
        },
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

  it('returns not found for progress when quest is not published or inaccessible', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'vip_1', roles: ['member'] });

    executeMock.mockResolvedValueOnce({ rows: [] });

    const response = await worker.fetch(
      new Request('https://quest.example/v1/quests/quest_hidden/progress', {
        method: 'GET',
        headers: {
          'X-Gateway-Auth': gatewayJwt,
        },
      }),
      env
    );

    const body = await readJson<{ error: { code: string } }>(response);
    expect(response.status).toBe(404);
    expect(body.error.code).toBe('NOT_FOUND');
    expect(executeMock).toHaveBeenCalledTimes(1);
  });

  it('rejects submit when step order is violated', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
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
            id: 'qstep_2',
            quest_id: 'quest_1',
            order: 2,
            type: 'challenge',
            target_type: null,
            target_id: null,
            verification_type: 'manual',
            requirements_json: {},
            reward_points: null,
            created_at: '2026-03-16T10:00:00.000Z',
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
      new Request('https://quest.example/v1/quests/quest_1/steps/qstep_2/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          proofType: 'text',
          proofData: {
            text: 'done',
          },
        }),
      }),
      env
    );

    const body = await readJson<{ error: { code: string } }>(response);
    expect(response.status).toBe(409);
    expect(body.error.code).toBe('CONFLICT');
  });

  it('rejects duplicate submission for same progress and step without lifecycle side effects', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
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
            steps_count: 1,
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
            type: 'photo_proof',
            target_type: null,
            target_id: null,
            verification_type: 'manual',
            requirements_json: {},
            reward_points: null,
            created_at: '2026-03-16T10:00:00.000Z',
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
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'qsub_existing',
            progress_id: 'qprog_1',
            step_id: 'qstep_1',
            user_id: 'vip_1',
            proof_type: 'photo',
            proof_data: { mediaId: 'media_1' },
            status: 'pending',
            reviewed_by: null,
            reviewed_at: null,
            rejection_reason: null,
            created_at: '2026-03-16T10:06:00.000Z',
            updated_at: '2026-03-16T10:06:00.000Z',
          },
        ],
      });

    const response = await worker.fetch(
      new Request('https://quest.example/v1/quests/quest_1/steps/qstep_1/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          proofType: 'photo',
          proofData: {
            mediaId: 'media_2',
          },
        }),
      }),
      env
    );

    const body = await readJson<{ error: { code: string } }>(response);
    expect(response.status).toBe(409);
    expect(body.error.code).toBe('CONFLICT');
    expect(executeMock).toHaveBeenCalledTimes(4);

    const executedSql = executeMock.mock.calls
      .map((call) => ((call[0] as { strings?: string[] } | undefined)?.strings ?? []).join(' '))
      .join('\n')
      .toLowerCase();
    expect(executedSql).not.toContain('insert into quest_submission');
    expect(executedSql).not.toContain('update quest_progress');
  });

  it('creates pending submission for manual validation and approves final step', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
      ENVIRONMENT: 'test',
    };
    const vipJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'vip_1', roles: ['member'] });
    const proJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'pro_1', roles: ['pro'] });

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
            steps_count: 1,
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
            type: 'photo_proof',
            target_type: null,
            target_id: null,
            verification_type: 'manual',
            requirements_json: {},
            reward_points: null,
            created_at: '2026-03-16T10:00:00.000Z',
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
      })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'qsub_1',
            progress_id: 'qprog_1',
            step_id: 'qstep_1',
            user_id: 'vip_1',
            proof_type: 'photo',
            proof_data: { mediaId: 'media_1' },
            status: 'pending',
            reviewed_by: null,
            reviewed_at: null,
            rejection_reason: null,
            created_at: '2026-03-16T10:06:00.000Z',
            updated_at: '2026-03-16T10:06:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'qprog_1',
            quest_id: 'quest_1',
            user_id: 'vip_1',
            status: 'pending_review',
            current_step: 1,
            started_at: '2026-03-16T10:05:00.000Z',
            completed_at: null,
            created_at: '2026-03-16T10:05:00.000Z',
            updated_at: '2026-03-16T10:06:00.000Z',
          },
        ],
      });

    const submitResponse = await worker.fetch(
      new Request('https://quest.example/v1/quests/quest_1/steps/qstep_1/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': vipJwt,
        },
        body: JSON.stringify({
          proofType: 'photo',
          proofData: {
            mediaId: 'media_1',
          },
        }),
      }),
      env
    );

    const submitBody = await readJson<{ id: string; status: string }>(submitResponse);
    expect(submitResponse.status).toBe(201);
    expect(submitBody).toMatchObject({
      id: 'qsub_1',
      status: 'pending',
    });

    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'qsub_1',
            progress_id: 'qprog_1',
            step_id: 'qstep_1',
            user_id: 'vip_1',
            proof_type: 'photo',
            proof_data: { mediaId: 'media_1' },
            status: 'pending',
            reviewed_by: null,
            reviewed_at: null,
            rejection_reason: null,
            created_at: '2026-03-16T10:06:00.000Z',
            updated_at: '2026-03-16T10:06:00.000Z',
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
            steps_count: 1,
            published_at: '2026-03-16T10:00:00.000Z',
            created_at: '2026-03-16T09:00:00.000Z',
            updated_at: '2026-03-16T10:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'qsub_1',
            progress_id: 'qprog_1',
            step_id: 'qstep_1',
            user_id: 'vip_1',
            proof_type: 'photo',
            proof_data: { mediaId: 'media_1' },
            status: 'approved',
            reviewed_by: 'pro_1',
            reviewed_at: '2026-03-16T10:07:00.000Z',
            rejection_reason: null,
            created_at: '2026-03-16T10:06:00.000Z',
            updated_at: '2026-03-16T10:07:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'qstep_1',
            quest_id: 'quest_1',
            order: 1,
            type: 'photo_proof',
            target_type: null,
            target_id: null,
            verification_type: 'manual',
            requirements_json: {},
            reward_points: null,
            created_at: '2026-03-16T10:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'qprog_1',
            quest_id: 'quest_1',
            user_id: 'vip_1',
            status: 'completed',
            current_step: null,
            started_at: '2026-03-16T10:05:00.000Z',
            completed_at: '2026-03-16T10:07:00.000Z',
            created_at: '2026-03-16T10:05:00.000Z',
            updated_at: '2026-03-16T10:07:00.000Z',
          },
        ],
      });

    const reviewResponse = await worker.fetch(
      new Request('https://quest.example/v1/submissions/qsub_1/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': proJwt,
        },
        body: JSON.stringify({
          decision: 'approve',
        }),
      }),
      env
    );

    const reviewBody = await readJson<{ id: string; status: string; reviewedBy: string }>(reviewResponse);
    expect(reviewResponse.status).toBe(200);
    expect(reviewBody).toMatchObject({
      id: 'qsub_1',
      status: 'approved',
      reviewedBy: 'pro_1',
    });
  });

  it('reject review keeps progress in progress and emits rejection event', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
      ENVIRONMENT: 'test',
    };
    const proJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'pro_1', roles: ['pro'] });

    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'qsub_1',
            progress_id: 'qprog_1',
            step_id: 'qstep_1',
            user_id: 'vip_1',
            proof_type: 'photo',
            proof_data: { mediaId: 'media_1' },
            status: 'pending',
            reviewed_by: null,
            reviewed_at: null,
            rejection_reason: null,
            created_at: '2026-03-16T10:06:00.000Z',
            updated_at: '2026-03-16T10:06:00.000Z',
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
            id: 'qsub_1',
            progress_id: 'qprog_1',
            step_id: 'qstep_1',
            user_id: 'vip_1',
            proof_type: 'photo',
            proof_data: { mediaId: 'media_1' },
            status: 'rejected',
            reviewed_by: 'pro_1',
            reviewed_at: '2026-03-16T10:07:00.000Z',
            rejection_reason: 'Need clearer proof',
            created_at: '2026-03-16T10:06:00.000Z',
            updated_at: '2026-03-16T10:07:00.000Z',
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
            updated_at: '2026-03-16T10:07:00.000Z',
          },
        ],
      });

    const response = await worker.fetch(
      new Request('https://quest.example/v1/submissions/qsub_1/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': proJwt,
        },
        body: JSON.stringify({
          decision: 'reject',
          reason: 'Need clearer proof',
        }),
      }),
      env
    );

    const body = await readJson<{ id: string; status: string; reviewedBy: string }>(response);
    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      id: 'qsub_1',
      status: 'rejected',
      reviewedBy: 'pro_1',
    });
    expect(publishMock).toHaveBeenCalledTimes(1);
    expect(publishMock).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: 'quest.submission.rejected',
        payload: expect.objectContaining({
          questId: 'quest_1',
          progressId: 'qprog_1',
          stepId: 'qstep_1',
          submissionId: 'qsub_1',
          userId: 'vip_1',
          reason: 'Need clearer proof',
        }),
      })
    );
  });
});
