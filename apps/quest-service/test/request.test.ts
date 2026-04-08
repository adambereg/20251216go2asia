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

describe('quest-service pass #3', () => {
  beforeEach(() => {
    createDbMock.mockClear();
    executeMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('requires gateway auth for submit', async () => {
    const response = await worker.fetch(
      new Request('https://quest.example/v1/quests/quest_1/steps/qstep_1/submit', { method: 'POST' }),
      { DATABASE_URL: 'postgres://example', SERVICE_JWT_SECRET: 'service-secret' }
    );
    expect(response.status).toBe(401);
  });

  it('creates pending submission for manual verification flow', async () => {
    const env: Env = { DATABASE_URL: 'postgres://example', SERVICE_JWT_SECRET: 'service-secret' };
    const jwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'vip_1', roles: ['member'] });

    executeMock
      .mockResolvedValueOnce({ rows: [{ id: 'quest_1', steps_count: 2, status: 'published', visibility: 'public', title: 'Q', description: null, creator_pro_id: 'pro_1', city_id: null, geo_scope: null, type: null, theme: null, difficulty: null, reward_points: null, published_at: null, created_at: '2026-03-16T00:00:00.000Z', updated_at: '2026-03-16T00:00:00.000Z' }] })
      .mockResolvedValueOnce({ rows: [{ id: 'qstep_1', quest_id: 'quest_1', order: 1, type: 'photo_proof', target_type: null, target_id: null, verification_type: 'manual', requirements_json: {}, reward_points: null, created_at: '2026-03-16T00:00:00.000Z' }] })
      .mockResolvedValueOnce({ rows: [{ id: 'qprog_1', quest_id: 'quest_1', user_id: 'vip_1', status: 'in_progress', current_step: 1, started_at: '2026-03-16T00:00:00.000Z', completed_at: null, created_at: '2026-03-16T00:00:00.000Z', updated_at: '2026-03-16T00:00:00.000Z' }] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ id: 'qsub_1', progress_id: 'qprog_1', step_id: 'qstep_1', user_id: 'vip_1', proof_type: 'photo', proof_data: { mediaId: 'm1' }, status: 'pending', reviewed_by: null, reviewed_at: null, rejection_reason: null, created_at: '2026-03-16T00:01:00.000Z', updated_at: '2026-03-16T00:01:00.000Z' }] })
      .mockResolvedValueOnce({ rows: [{ id: 'qprog_1', quest_id: 'quest_1', user_id: 'vip_1', status: 'pending_review', current_step: 1, started_at: '2026-03-16T00:00:00.000Z', completed_at: null, created_at: '2026-03-16T00:00:00.000Z', updated_at: '2026-03-16T00:01:00.000Z' }] });

    const response = await worker.fetch(
      new Request('https://quest.example/v1/quests/quest_1/steps/qstep_1/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Gateway-Auth': jwt },
        body: JSON.stringify({ proofType: 'photo', proofData: { mediaId: 'm1' } }),
      }),
      env
    );
    const body = await readJson<{ status: string }>(response);
    expect(response.status).toBe(201);
    expect(body.status).toBe('pending');
  });

  it('returns conflict when submitting not active progress', async () => {
    const env: Env = { DATABASE_URL: 'postgres://example', SERVICE_JWT_SECRET: 'service-secret' };
    const jwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'vip_1', roles: ['member'] });

    executeMock
      .mockResolvedValueOnce({ rows: [{ id: 'quest_1', steps_count: 2, status: 'published', visibility: 'public', title: 'Q', description: null, creator_pro_id: 'pro_1', city_id: null, geo_scope: null, type: null, theme: null, difficulty: null, reward_points: null, published_at: null, created_at: '2026-03-16T00:00:00.000Z', updated_at: '2026-03-16T00:00:00.000Z' }] })
      .mockResolvedValueOnce({ rows: [{ id: 'qstep_2', quest_id: 'quest_1', order: 2, type: 'challenge', target_type: null, target_id: null, verification_type: 'manual', requirements_json: {}, reward_points: null, created_at: '2026-03-16T00:00:00.000Z' }] })
      .mockResolvedValueOnce({ rows: [{ id: 'qprog_1', quest_id: 'quest_1', user_id: 'vip_1', status: 'expired', current_step: 2, started_at: '2026-03-16T00:00:00.000Z', completed_at: null, created_at: '2026-03-16T00:00:00.000Z', updated_at: '2026-03-16T00:00:00.000Z' }] });

    const response = await worker.fetch(
      new Request('https://quest.example/v1/quests/quest_1/steps/qstep_2/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Gateway-Auth': jwt },
        body: JSON.stringify({ proofType: 'text', proofData: { text: 'ok' } }),
      }),
      env
    );
    expect(response.status).toBe(409);
  });

  it('allows pro owner to list submissions', async () => {
    const env: Env = { DATABASE_URL: 'postgres://example', SERVICE_JWT_SECRET: 'service-secret' };
    const jwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'pro_1', roles: ['pro'] });

    executeMock
      .mockResolvedValueOnce({ rows: [{ id: 'quest_1', title: 'Q', description: null, creator_pro_id: 'pro_1', city_id: null, geo_scope: null, type: null, theme: null, difficulty: null, status: 'published', visibility: 'public', reward_points: null, steps_count: 2, published_at: null, created_at: '2026-03-16T00:00:00.000Z', updated_at: '2026-03-16T00:00:00.000Z' }] })
      .mockResolvedValueOnce({ rows: [{ id: 'qsub_1', progress_id: 'qprog_1', step_id: 'qstep_1', user_id: 'vip_1', proof_type: 'photo', proof_data: { mediaId: 'm1' }, status: 'pending', reviewed_by: null, reviewed_at: null, rejection_reason: null, created_at: '2026-03-16T00:01:00.000Z', updated_at: '2026-03-16T00:01:00.000Z' }] })
      .mockResolvedValueOnce({ rows: [{ total: 1 }] });

    const response = await worker.fetch(
      new Request('https://quest.example/v1/quests/quest_1/submissions?page=1&pageSize=20', {
        headers: { 'X-Gateway-Auth': jwt },
      }),
      env
    );
    const body = await readJson<{ total: number }>(response);
    expect(response.status).toBe(200);
    expect(body.total).toBe(1);
  });

  it('reviews submission with approve and completes quest on last step', async () => {
    const env: Env = { DATABASE_URL: 'postgres://example', SERVICE_JWT_SECRET: 'service-secret' };
    const jwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'pro_1', roles: ['pro'] });

    executeMock
      .mockResolvedValueOnce({ rows: [{ id: 'qsub_1', progress_id: 'qprog_1', step_id: 'qstep_2', user_id: 'vip_1', proof_type: 'photo', proof_data: { mediaId: 'm1' }, status: 'pending', reviewed_by: null, reviewed_at: null, rejection_reason: null, created_at: '2026-03-16T00:01:00.000Z', updated_at: '2026-03-16T00:01:00.000Z', quest_id: 'quest_1', creator_pro_id: 'pro_1', progress_status: 'pending_review', current_step: 2, step_order: 2 }] })
      .mockResolvedValueOnce({ rows: [{ id: 'quest_1', title: 'Q', description: null, creator_pro_id: 'pro_1', city_id: null, geo_scope: null, type: null, theme: null, difficulty: null, status: 'published', visibility: 'public', reward_points: null, steps_count: 2, published_at: null, created_at: '2026-03-16T00:00:00.000Z', updated_at: '2026-03-16T00:00:00.000Z' }] })
      .mockResolvedValueOnce({ rows: [{ id: 'qsub_1', progress_id: 'qprog_1', step_id: 'qstep_2', user_id: 'vip_1', proof_type: 'photo', proof_data: { mediaId: 'm1' }, status: 'approved', reviewed_by: 'pro_1', reviewed_at: '2026-03-16T00:02:00.000Z', rejection_reason: null, created_at: '2026-03-16T00:01:00.000Z', updated_at: '2026-03-16T00:02:00.000Z' }] })
      .mockResolvedValueOnce({ rows: [{ id: 'qstep_2', quest_id: 'quest_1', order: 2, type: 'photo_proof', target_type: null, target_id: null, verification_type: 'manual', requirements_json: {}, reward_points: null, created_at: '2026-03-16T00:00:00.000Z' }] })
      .mockResolvedValueOnce({ rows: [{ id: 'qprog_1', quest_id: 'quest_1', user_id: 'vip_1', status: 'completed', current_step: null, started_at: '2026-03-16T00:00:00.000Z', completed_at: '2026-03-16T00:02:00.000Z', created_at: '2026-03-16T00:00:00.000Z', updated_at: '2026-03-16T00:02:00.000Z' }] });

    const response = await worker.fetch(
      new Request('https://quest.example/v1/submissions/qsub_1/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Gateway-Auth': jwt },
        body: JSON.stringify({ decision: 'approve' }),
      }),
      env
    );
    const body = await readJson<{ status: string; reviewedBy: string }>(response);
    expect(response.status).toBe(200);
    expect(body.status).toBe('approved');
    expect(body.reviewedBy).toBe('pro_1');
  });

  it('keeps pass #4 pro authoring routes closed', async () => {
    const env: Env = { DATABASE_URL: 'postgres://example', SERVICE_JWT_SECRET: 'service-secret' };
    const responses = await Promise.all([
      worker.fetch(new Request('https://quest.example/v1/quests', { method: 'POST' }), env),
      worker.fetch(new Request('https://quest.example/v1/quests/quest_1/steps', { method: 'POST' }), env),
      worker.fetch(new Request('https://quest.example/v1/quests/quest_1/publish', { method: 'POST' }), env),
    ]);
    for (const response of responses) expect(response.status).toBe(404);
    expect(executeMock).not.toHaveBeenCalled();
  });
});
