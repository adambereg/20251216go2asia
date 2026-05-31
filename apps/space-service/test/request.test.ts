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
import {
  AUTHORIAL_EXPRESSION_WRITE_INTENT,
  classifyAuthorialExpressionWriteIntent,
} from '../src/domain/authorialExpression';
import { classifyRepostTextRole } from '../src/domain/retentionIntent';
import worker, { type Env } from '../src/index';

function sqlOf(callIndex: number): string {
  const arg = executeMock.mock.calls[callIndex]?.[0] as { strings?: string[] } | undefined;
  return (arg?.strings ?? []).join('');
}

function sqlValuesOf(callIndex: number): unknown[] {
  const arg = executeMock.mock.calls[callIndex]?.[0] as { values?: unknown[] } | undefined;
  return arg?.values ?? [];
}

function privateRetentionRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'spost_private_retention',
    author_id: 'user_owner',
    author_display_name: 'Owner',
    author_avatar_url: null,
    author_role_label: 'Spacer',
    group_id: null,
    post_type: 'repost',
    visibility: 'private',
    text: null,
    repost_target_type: 'place',
    repost_target_id: 'place_bkk',
    status: 'active',
    created_at: '2026-03-14T10:00:00.000Z',
    updated_at: '2026-03-14T10:00:00.000Z',
    published_at: '2026-03-14T10:00:00.000Z',
    ...overrides,
  };
}

function propagationRepostRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'spost_public_repost',
    author_id: 'user_owner',
    author_display_name: 'Owner',
    author_avatar_url: null,
    author_role_label: 'Spacer',
    group_id: null,
    post_type: 'repost',
    visibility: 'public',
    text: null,
    repost_target_type: 'place',
    repost_target_id: 'place_bkk',
    status: 'active',
    created_at: '2026-03-14T10:00:00.000Z',
    updated_at: '2026-03-14T10:00:00.000Z',
    published_at: '2026-03-14T10:00:00.000Z',
    ...overrides,
  };
}

describe('space-service v1', () => {
  beforeEach(() => {
    createDbMock.mockClear();
    executeMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('returns readiness checks for required dependencies', async () => {
    const response = await worker.fetch(new Request('https://space.example/ready'), {});
    const body = await readJson<{ status: string; missing: string[] }>(response);

    expect(response.status).toBe(503);
    expect(body.status).toBe('not_ready');
    expect(body.missing).toEqual(['databaseUrl', 'serviceJwtSecret']);
  });

  it('returns 401 for protected post creation without gateway auth', async () => {
    const response = await worker.fetch(
      new Request('https://space.example/v1/space/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postType: 'post',
          visibility: 'public',
          text: 'Hello world',
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

  it('returns 401 for protected repost commentary PATCH without gateway auth', async () => {
    const response = await worker.fetch(
      new Request('https://space.example/v1/space/posts/spost_repost_1', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: 'Updated commentary',
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

  it('validates group visibility post creation', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!);

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          postType: 'post',
          visibility: 'group',
          text: 'Group only',
        }),
      }),
      env
    );

    const body = await readJson<{ error: { code: string; message: string } }>(response);
    expect(response.status).toBe(400);
    expect(body.error.code).toBe('VALIDATION_ERROR');
    expect(body.error.message).toContain('groupId');
  });

  it('rejects standard post without text', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!);

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          postType: 'post',
          visibility: 'public',
        }),
      }),
      env
    );
    const body = await readJson<{ error: { code: string; message: string } }>(response);
    expect(response.status).toBe(400);
    expect(body.error.code).toBe('VALIDATION_ERROR');
    expect(body.error.message).toContain('text is required');
  });

  it('rejects text longer than configured max length', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
      SPACE_MAX_TEXT_LENGTH: '5',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!);

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          postType: 'post',
          visibility: 'public',
          text: '123456',
        }),
      }),
      env
    );
    const body = await readJson<{ error: { code: string; message: string } }>(response);
    expect(response.status).toBe(400);
    expect(body.error.code).toBe('VALIDATION_ERROR');
    expect(body.error.message).toContain('text length');
  });

  it('rejects groupId when visibility is not group', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!);

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          postType: 'post',
          visibility: 'public',
          text: 'Public post',
          groupId: 'sgroup_1',
        }),
      }),
      env
    );

    const body = await readJson<{ error: { code: string; message: string } }>(response);
    expect(response.status).toBe(400);
    expect(body.error.code).toBe('VALIDATION_ERROR');
    expect(body.error.message).toContain('group');
  });

  it('creates a post and materializes outgoing activity projection', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!);

    executeMock
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'spost_created',
            author_id: 'user_test_1',
            author_display_name: 'user_test_1',
            author_avatar_url: null,
            author_role_label: 'Spacer',
            group_id: null,
            post_type: 'post',
            visibility: 'public',
            text: 'Hello Space',
            repost_target_type: null,
            repost_target_id: null,
            status: 'active',
            created_at: '2026-03-14T10:00:00.000Z',
            updated_at: '2026-03-14T10:00:00.000Z',
            published_at: '2026-03-14T10:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [] });

    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValueOnce('created');

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          postType: 'post',
          visibility: 'public',
          text: 'Hello Space',
        }),
      }),
      env
    );

    expect(response.status).toBe(201);
    expect(executeMock.mock.calls.some((_, index) => sqlOf(index).includes('INSERT INTO space_activity_projection'))).toBe(true);
  });

  it('creates object-bound repost retention intent with private visibility', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!);

    executeMock
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'spost_private_retention',
            author_id: 'user_test_1',
            author_display_name: 'user_test_1',
            author_avatar_url: null,
            author_role_label: 'Spacer',
            group_id: null,
            post_type: 'repost',
            visibility: 'private',
            text: null,
            repost_target_type: 'place',
            repost_target_id: 'place_bkk',
            status: 'active',
            created_at: '2026-03-14T10:00:00.000Z',
            updated_at: '2026-03-14T10:00:00.000Z',
            published_at: '2026-03-14T10:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });

    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValueOnce('private_retention');

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          postType: 'repost',
          visibility: 'private',
          repostTargetType: 'place',
          repostTargetId: 'place_bkk',
          text: null,
        }),
      }),
      env
    );

    const body = await readJson<{ postType: string; visibility: string; repost: { targetType: string; targetId: string } }>(response);
    expect(response.status).toBe(201);
    expect(body.postType).toBe('repost');
    expect(body.visibility).toBe('private');
    expect(body.repost).toMatchObject({ targetType: 'place', targetId: 'place_bkk' });
    expect(sqlValuesOf(2)).toContain('private');
  });

  it('creates object-bound retention text as private note semantics', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!);

    executeMock
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          privateRetentionRow({
            id: 'spost_private_note',
            author_id: 'user_test_1',
            text: 'Remember the quiet alley entrance.',
          }),
        ],
      })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });

    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValueOnce('private_note');

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          postType: 'repost',
          visibility: 'private',
          repostTargetType: 'place',
          repostTargetId: 'place_bkk',
          text: 'Remember the quiet alley entrance.',
        }),
      }),
      env
    );

    const body = await readJson<{
      postType: string;
      visibility: string;
      text: string | null;
      repost: { targetType: string; targetId: string };
      sourceReference?: unknown;
    }>(response);
    expect(response.status).toBe(201);
    expect(body.postType).toBe('repost');
    expect(body.visibility).toBe('private');
    expect(body.text).toBe('Remember the quiet alley entrance.');
    expect(body.repost).toMatchObject({ targetType: 'place', targetId: 'place_bkk' });
    expect(body.sourceReference).toBeUndefined();
    expect(classifyRepostTextRole({ postType: 'repost', visibility: 'private', text: body.text })).toBe('private_note');
  });

  it('does not materialize social repost activity for private retention of a space post', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_owner' });

    executeMock
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          privateRetentionRow({
            id: 'spost_private_space_post_retention',
            author_id: 'user_owner',
            repost_target_type: 'space_post',
            repost_target_id: 'spost_source',
            text: 'Owner-only context on a Space post.',
          }),
        ],
      })
      .mockResolvedValueOnce({ rows: [] });

    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValueOnce('private_space_post_retention');

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          postType: 'repost',
          visibility: 'private',
          repostTargetType: 'space_post',
          repostTargetId: 'spost_source',
          text: 'Owner-only context on a Space post.',
        }),
      }),
      env
    );

    const body = await readJson<{ id: string; postType: string; visibility: string; repost: { targetType: string; targetId: string } }>(response);
    expect(response.status).toBe(201);
    expect(body.id).toBe('spost_private_space_post_retention');
    expect(body.postType).toBe('repost');
    expect(body.visibility).toBe('private');
    expect(body.repost).toMatchObject({ targetType: 'space_post', targetId: 'spost_source' });

    const allSqlValues = executeMock.mock.calls.flatMap((_, index) => sqlValuesOf(index));
    expect(allSqlValues).not.toContain('space.repost_created');
    expect(allSqlValues).not.toContain('space.post_reposted_by_other');
    expect(executeMock.mock.calls.some((_, index) => sqlOf(index).includes('INSERT INTO space_activity_projection'))).toBe(false);
  });

  it('preserves incoming repost activity for public space-post reposts', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_reposter' });

    executeMock
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          propagationRepostRow({
            id: 'spost_public_space_post_repost',
            author_id: 'user_reposter',
            repost_target_type: 'space_post',
            repost_target_id: 'spost_source',
          }),
        ],
      })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'spost_source',
            author_id: 'user_source_author',
            author_display_name: 'Source Author',
            author_avatar_url: null,
            author_role_label: 'Spacer',
            group_id: null,
            post_type: 'post',
            visibility: 'public',
            text: 'Original Space post',
            repost_target_type: null,
            repost_target_id: null,
            status: 'active',
            created_at: '2026-03-14T09:00:00.000Z',
            updated_at: '2026-03-14T09:00:00.000Z',
            published_at: '2026-03-14T09:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });

    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValueOnce('public_space_post_repost');

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          postType: 'repost',
          visibility: 'public',
          repostTargetType: 'space_post',
          repostTargetId: 'spost_source',
        }),
      }),
      env
    );

    expect(response.status).toBe(201);
    const allSqlValues = executeMock.mock.calls.flatMap((_, index) => sqlValuesOf(index));
    expect(allSqlValues).toContain('space.repost_created');
    expect(allSqlValues).toContain('space.post_reposted_by_other');
  });

  it('preserves incoming repost activity for group space-post reposts', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_reposter' });

    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            group_id: 'sgroup_public',
            user_id: 'user_reposter',
            role: 'member',
            status: 'active',
            joined_at: '2026-03-14T08:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'sgroup_public',
            slug: 'public-group',
            title: 'Public Group',
            description: null,
            owner_id: 'user_owner',
            visibility: 'public',
            status: 'active',
            members_count: 2,
            created_at: '2026-03-14T08:00:00.000Z',
            updated_at: '2026-03-14T08:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          propagationRepostRow({
            id: 'spost_group_space_post_repost',
            author_id: 'user_reposter',
            group_id: 'sgroup_public',
            visibility: 'group',
            repost_target_type: 'space_post',
            repost_target_id: 'spost_source',
          }),
        ],
      })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'spost_source',
            author_id: 'user_source_author',
            author_display_name: 'Source Author',
            author_avatar_url: null,
            author_role_label: 'Spacer',
            group_id: null,
            post_type: 'post',
            visibility: 'public',
            text: 'Original Space post',
            repost_target_type: null,
            repost_target_id: null,
            status: 'active',
            created_at: '2026-03-14T09:00:00.000Z',
            updated_at: '2026-03-14T09:00:00.000Z',
            published_at: '2026-03-14T09:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });

    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValueOnce('group_space_post_repost');

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          postType: 'repost',
          visibility: 'group',
          groupId: 'sgroup_public',
          repostTargetType: 'space_post',
          repostTargetId: 'spost_source',
        }),
      }),
      env
    );

    expect(response.status).toBe(201);
    const allSqlValues = executeMock.mock.calls.flatMap((_, index) => sqlValuesOf(index));
    expect(allSqlValues).toContain('space.repost_created');
    expect(allSqlValues).toContain('space.post_reposted_by_other');
  });

  it('resolves repeated private retention inside retention dedupe scope', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_owner' });

    executeMock
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [privateRetentionRow({ text: 'Original private note' })],
      });

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          postType: 'repost',
          visibility: 'private',
          repostTargetType: 'place',
          repostTargetId: 'place_bkk',
          text: 'Different private note',
        }),
      }),
      env
    );

    const body = await readJson<{ error: { code: string }; existingPostId: string }>(response);
    expect(response.status).toBe(409);
    expect(body.error.code).toBe('REPOST_ALREADY_EXISTS');
    expect(body.existingPostId).toBe('spost_private_retention');
    expect(sqlOf(1)).toContain("sp.visibility = 'private'");
    expect(sqlValuesOf(1)).not.toContain('Different private note');
    expect(executeMock.mock.calls.some((_, index) => sqlOf(index).includes('INSERT INTO space_post'))).toBe(false);
  });

  it('does not let public propagation repost satisfy private retention dedupe', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_owner' });

    executeMock
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [privateRetentionRow({ id: 'spost_new_private_retention', text: 'New private note' })],
      })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });

    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValueOnce('new_private_retention');

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          postType: 'repost',
          visibility: 'private',
          repostTargetType: 'place',
          repostTargetId: 'place_bkk',
          text: 'New private note',
        }),
      }),
      env
    );

    const body = await readJson<{ id: string; postType: string; visibility: string; text: string | null }>(response);
    expect(response.status).toBe(201);
    expect(body.id).toBe('spost_new_private_retention');
    expect(body.postType).toBe('repost');
    expect(body.visibility).toBe('private');
    expect(body.text).toBe('New private note');
    expect(sqlOf(1)).toContain("sp.visibility = 'private'");
  });

  it('does not let private retention satisfy propagation repost dedupe', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_owner' });

    executeMock
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [propagationRepostRow({ id: 'spost_new_public_repost', author_id: 'user_owner' })],
      })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });

    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValueOnce('new_public_repost');

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          postType: 'repost',
          visibility: 'public',
          repostTargetType: 'place',
          repostTargetId: 'place_bkk',
        }),
      }),
      env
    );

    const body = await readJson<{ id: string; postType: string; visibility: string }>(response);
    expect(response.status).toBe(201);
    expect(body.id).toBe('spost_new_public_repost');
    expect(body.postType).toBe('repost');
    expect(body.visibility).toBe('public');
    expect(sqlOf(1)).toContain("sp.visibility <> 'private'");
  });

  it('does not let legacy group repost-shaped rows satisfy private retention dedupe', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_owner' });

    executeMock
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [privateRetentionRow({ id: 'spost_private_after_legacy_group', text: 'private context survives legacy rows' })],
      })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });

    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValueOnce('private_after_legacy_group');

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          postType: 'repost',
          visibility: 'private',
          repostTargetType: 'place',
          repostTargetId: 'place_bkk',
          text: 'private context survives legacy rows',
        }),
      }),
      env
    );

    const body = await readJson<{ id: string; postType: string; visibility: string; sourceReference?: unknown }>(response);
    expect(response.status).toBe(201);
    expect(body.id).toBe('spost_private_after_legacy_group');
    expect(body.postType).toBe('repost');
    expect(body.visibility).toBe('private');
    expect(body.sourceReference).toBeUndefined();
    expect(sqlOf(1)).toContain("sp.visibility = 'private'");
  });

  it('classifies legacy-shaped non-private repost text as propagation commentary, not private note', () => {
    expect(
      classifyRepostTextRole({
        postType: 'repost',
        visibility: 'public',
        text: 'historical repost commentary lane',
      })
    ).toBe('propagation_commentary');
    expect(
      classifyRepostTextRole({
        postType: 'repost',
        visibility: 'group',
        text: 'group repost legacy commentary',
      })
    ).toBe('propagation_commentary');
  });

  it('does not run retention dedupe for standard authorial post shape', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_owner' });

    executeMock
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'spost_authorial_proxy',
            author_id: 'user_owner',
            author_display_name: 'Owner',
            author_avatar_url: null,
            author_role_label: 'Spacer',
            group_id: null,
            post_type: 'post',
            visibility: 'public',
            text: 'A future authorial thought should not be blocked by retention dedupe.',
            repost_target_type: null,
            repost_target_id: null,
            status: 'active',
            created_at: '2026-03-14T10:00:00.000Z',
            updated_at: '2026-03-14T10:00:00.000Z',
            published_at: '2026-03-14T10:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });

    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValueOnce('authorial_proxy');

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          postType: 'post',
          visibility: 'public',
          authorialExpressionIntent: true,
          text: 'A future authorial thought should not be blocked by retention dedupe.',
        }),
      }),
      env
    );

    const body = await readJson<{ id: string; postType: string; visibility: string }>(response);
    expect(response.status).toBe(201);
    expect(body.id).toBe('spost_authorial_proxy');
    expect(body.postType).toBe('post');
    expect(body.visibility).toBe('public');
    expect(executeMock.mock.calls.some((_, index) => sqlOf(index).includes("AND sp.post_type = 'repost'"))).toBe(false);
    expect(
      classifyAuthorialExpressionWriteIntent({
        postType: 'post',
        authorialExpressionIntent: true,
      })
    ).toBe(AUTHORIAL_EXPRESSION_WRITE_INTENT);
  });

  it('rejects authorial expression write with repostTarget fields on postType post', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_owner' });

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          postType: 'post',
          visibility: 'public',
          authorialExpressionIntent: true,
          text: 'Authorial with forbidden target binding',
          repostTargetType: 'place',
          repostTargetId: 'place_bkk',
        }),
      }),
      env
    );

    const body = await readJson<{ error: { code: string; message: string } }>(response);
    expect(response.status).toBe(400);
    expect(body.error.code).toBe('VALIDATION_ERROR');
    expect(body.error.message).toMatch(/repost target fields are only allowed for repost/i);
  });

  it('rejects save/publish fields on authorial expression writes', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_owner' });

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          postType: 'post',
          visibility: 'public',
          authorialExpressionIntent: true,
          text: 'Independent thought that should not carry save or publish intent fields.',
          publishIntent: true,
        }),
      }),
      env
    );

    const body = await readJson<{ error: { code: string; message: string } }>(response);
    expect(response.status).toBe(400);
    expect(body.error.message).toMatch(/save\/publish/i);
  });

  it('rejects authorialExpressionIntent on repost writes', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_owner' });

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          postType: 'repost',
          visibility: 'private',
          authorialExpressionIntent: true,
          text: 'note',
          repostTargetType: 'place',
          repostTargetId: 'place_bkk',
        }),
      }),
      env
    );

    const body = await readJson<{ error: { code: string; message: string } }>(response);
    expect(response.status).toBe(400);
    expect(body.error.message).toMatch(/authorialExpressionIntent/);
  });

  it('does not read bookmark reactions when checking private retention dedupe', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_owner' });

    executeMock
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [privateRetentionRow({ text: 'Existing owner retention' })],
      });

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          postType: 'repost',
          visibility: 'private',
          repostTargetType: 'place',
          repostTargetId: 'place_bkk',
          text: 'Bookmark exists elsewhere but must not be dedupe identity.',
        }),
      }),
      env
    );

    const body = await readJson<{ error: { code: string }; existingPostId: string }>(response);
    expect(response.status).toBe(409);
    expect(body.error.code).toBe('REPOST_ALREADY_EXISTS');
    expect(body.existingPostId).toBe('spost_private_retention');
    const executedSql = executeMock.mock.calls.map((_, index) => sqlOf(index)).join('\n');
    expect(executedSql).not.toContain('reactions');
    expect(executedSql).not.toContain('reaction_');
    expect(sqlOf(1)).toContain("sp.visibility = 'private'");
  });

  it('creates private retention without requiring bookmark lookup', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_owner' });

    executeMock
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [privateRetentionRow({ id: 'spost_retention_without_bookmark', text: 'Owner context exists independently.' })],
      })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });

    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValueOnce('retention_without_bookmark');

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          postType: 'repost',
          visibility: 'private',
          repostTargetType: 'place',
          repostTargetId: 'place_bkk',
          text: 'Owner context exists independently.',
        }),
      }),
      env
    );

    const body = await readJson<{ id: string; postType: string; visibility: string }>(response);
    expect(response.status).toBe(201);
    expect(body.id).toBe('spost_retention_without_bookmark');
    expect(body.postType).toBe('repost');
    expect(body.visibility).toBe('private');
    const executedSql = executeMock.mock.calls.map((_, index) => sqlOf(index)).join('\n');
    expect(executedSql).not.toContain('reactions');
    expect(executedSql).not.toContain('reaction_');
  });

  it('returns a public post for anonymous read', async () => {
    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'spost_1',
            author_id: 'user_1',
            author_display_name: 'User One',
            author_avatar_url: null,
            author_role_label: 'Spacer',
            group_id: null,
            post_type: 'post',
            visibility: 'public',
            text: 'Hello',
            repost_target_type: null,
            repost_target_id: null,
            status: 'active',
            created_at: '2026-03-14T10:00:00.000Z',
            updated_at: '2026-03-14T10:00:00.000Z',
            published_at: '2026-03-14T10:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [] });

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/posts/spost_1'),
      {
        DATABASE_URL: 'postgres://example',
        SERVICE_JWT_SECRET: 'service-secret',
      }
    );

    const body = await readJson<{ id: string; visibility: string; author: { displayName: string } }>(response);
    expect(response.status).toBe(200);
    expect(body.id).toBe('spost_1');
    expect(body.visibility).toBe('public');
    expect(body.author.displayName).toBe('User One');
  });

  it('returns private retention direct link for owner only', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_owner' });

    executeMock
      .mockResolvedValueOnce({
        rows: [privateRetentionRow({ text: 'Owner-only route note' })],
      })
      .mockResolvedValueOnce({ rows: [] });

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/posts/spost_private_retention', {
        headers: {
          'X-Gateway-Auth': gatewayJwt,
        },
      }),
      env
    );

    const body = await readJson<{ id: string; visibility: string; postType: string; text: string | null; repost: { targetType: string } }>(response);
    expect(response.status).toBe(200);
    expect(body.id).toBe('spost_private_retention');
    expect(body.postType).toBe('repost');
    expect(body.visibility).toBe('private');
    expect(body.text).toBe('Owner-only route note');
    expect(body.repost.targetType).toBe('place');
    expect(classifyRepostTextRole({ postType: 'repost', visibility: 'private', text: body.text })).toBe('private_note');
  });

  it('rejects private retention direct link for non-owner', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_other' });

    executeMock.mockResolvedValueOnce({
      rows: [privateRetentionRow({ text: 'Secret owner note' })],
    });

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/posts/spost_private_retention', {
        headers: {
          'X-Gateway-Auth': gatewayJwt,
        },
      }),
      env
    );

    const body = await readJson<{ error: { code: string } }>(response);
    expect(response.status).toBe(403);
    expect(body.error.code).toBe('FORBIDDEN');
  });

  it('filters private retention from profile feed for non-owner', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_other' });

    executeMock
      .mockResolvedValueOnce({
        rows: [
          privateRetentionRow({ text: 'Secret profile note' }),
          {
            id: 'spost_public_post',
            author_id: 'user_owner',
            author_display_name: 'Owner',
            author_avatar_url: null,
            author_role_label: 'Spacer',
            group_id: null,
            post_type: 'post',
            visibility: 'public',
            text: 'Visible public post',
            repost_target_type: null,
            repost_target_id: null,
            status: 'active',
            created_at: '2026-03-14T10:01:00.000Z',
            updated_at: '2026-03-14T10:01:00.000Z',
            published_at: '2026-03-14T10:01:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [] });

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/feed/profile/user_owner?limit=20', {
        headers: {
          'X-Gateway-Auth': gatewayJwt,
        },
      }),
      env
    );

    const body = await readJson<{ items: Array<{ post: { id: string; visibility: string } }> }>(response);
    expect(response.status).toBe(200);
    expect(body.items.map((item) => item.post.id)).toEqual(['spost_public_post']);
    expect(body.items.some((item) => item.post.visibility === 'private')).toBe(false);
    expect(JSON.stringify(body)).not.toContain('Secret profile note');
  });

  it('keeps legacy-shaped repost row as repost feed reason, not authorial/source-reference proof', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_other' });

    executeMock
      .mockResolvedValueOnce({
        rows: [
          propagationRepostRow({
            id: 'spost_legacy_public_repost',
            author_id: 'user_owner',
            visibility: 'public',
            text: 'legacy public repost artifact',
          }),
        ],
      })
      .mockResolvedValueOnce({ rows: [] });

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/feed/profile/user_owner?limit=20', {
        headers: {
          'X-Gateway-Auth': gatewayJwt,
        },
      }),
      env
    );

    const body = await readJson<{
      items: Array<{
        reason: string;
        post: { id: string; postType: string; visibility: string; sourceReference?: unknown; repost?: { targetType: string; targetId: string } };
      }>;
    }>(response);

    expect(response.status).toBe(200);
    expect(body.items).toHaveLength(1);
    expect(body.items[0]?.reason).toBe('repost');
    expect(body.items[0]?.post.id).toBe('spost_legacy_public_repost');
    expect(body.items[0]?.post.postType).toBe('repost');
    expect(body.items[0]?.post.visibility).toBe('public');
    expect(body.items[0]?.post.sourceReference).toBeUndefined();
    expect(body.items[0]?.post.repost).toMatchObject({ targetType: 'place', targetId: 'place_bkk' });
  });

  it('updates commentary text for author repost via PATCH /v1/space/posts/:postId', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_author' });

    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'spost_repost_1',
            author_id: 'user_author',
            author_display_name: 'Author',
            author_avatar_url: null,
            author_role_label: 'Spacer',
            group_id: null,
            post_type: 'repost',
            visibility: 'public',
            text: null,
            repost_target_type: 'place',
            repost_target_id: 'place_bkk',
            status: 'active',
            created_at: '2026-03-14T10:00:00.000Z',
            updated_at: '2026-03-14T10:00:00.000Z',
            published_at: '2026-03-14T10:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [{ id: 'spost_repost_1' }] })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'spost_repost_1',
            author_id: 'user_author',
            author_display_name: 'Author',
            author_avatar_url: null,
            author_role_label: 'Spacer',
            group_id: null,
            post_type: 'repost',
            visibility: 'public',
            text: 'Updated commentary',
            repost_target_type: 'place',
            repost_target_id: 'place_bkk',
            status: 'active',
            created_at: '2026-03-14T10:00:00.000Z',
            updated_at: '2026-03-14T10:01:00.000Z',
            published_at: '2026-03-14T10:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [] });

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/posts/spost_repost_1', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          text: 'Updated commentary',
        }),
      }),
      env
    );

    const body = await readJson<{ id: string; text: string | null; postType: string }>(response);
    expect(response.status).toBe(200);
    expect(body.id).toBe('spost_repost_1');
    expect(body.text).toBe('Updated commentary');
    expect(body.postType).toBe('repost');
    expect(executeMock.mock.calls.some((_, index) => sqlOf(index).includes('UPDATE space_post'))).toBe(true);
  });

  it('updates private note text for owner private retention via PATCH /v1/space/posts/:postId', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_owner' });

    executeMock
      .mockResolvedValueOnce({
        rows: [privateRetentionRow({ text: 'Initial note' })],
      })
      .mockResolvedValueOnce({ rows: [{ id: 'spost_private_retention' }] })
      .mockResolvedValueOnce({
        rows: [privateRetentionRow({ text: 'Updated private note' })],
      })
      .mockResolvedValueOnce({ rows: [] });

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/posts/spost_private_retention', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          text: 'Updated private note',
        }),
      }),
      env
    );

    const body = await readJson<{
      id: string;
      text: string | null;
      postType: string;
      visibility: string;
      repost: { targetType: string; targetId: string };
      sourceReference?: unknown;
    }>(response);
    expect(response.status).toBe(200);
    expect(body.id).toBe('spost_private_retention');
    expect(body.postType).toBe('repost');
    expect(body.visibility).toBe('private');
    expect(body.text).toBe('Updated private note');
    expect(body.repost).toMatchObject({ targetType: 'place', targetId: 'place_bkk' });
    expect(body.sourceReference).toBeUndefined();
    expect(classifyRepostTextRole({ postType: 'repost', visibility: 'private', text: body.text })).toBe('private_note');
    expect(sqlValuesOf(1)).toContain('Updated private note');
  });

  it('rejects private note edit payloads that try to add publication fields', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_owner' });

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/posts/spost_private_retention', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          text: 'Updated private note',
          groupId: 'sgroup_public',
        }),
      }),
      env
    );

    const body = await readJson<{ error: { code: string; message: string } }>(response);
    expect(response.status).toBe(400);
    expect(body.error.code).toBe('VALIDATION_ERROR');
    expect(body.error.message).toContain('Only text field');
    expect(executeMock).not.toHaveBeenCalled();
  });

  it('rejects commentary edit when requester is not repost author', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_other' });

    executeMock.mockResolvedValueOnce({
      rows: [
        {
          id: 'spost_repost_2',
          author_id: 'user_author',
          author_display_name: 'Author',
          author_avatar_url: null,
          author_role_label: 'Spacer',
          group_id: null,
          post_type: 'repost',
          visibility: 'public',
          text: null,
          repost_target_type: 'event',
          repost_target_id: 'event_1',
          status: 'active',
          created_at: '2026-03-14T10:00:00.000Z',
          updated_at: '2026-03-14T10:00:00.000Z',
          published_at: '2026-03-14T10:00:00.000Z',
        },
      ],
    });

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/posts/spost_repost_2', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          text: 'Should fail',
        }),
      }),
      env
    );

    const body = await readJson<{ error: { code: string } }>(response);
    expect(response.status).toBe(403);
    expect(body.error.code).toBe('POST_EDIT_NOT_ALLOWED');
  });

  it('creates a group and owner membership', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { role: 'pro' });

    executeMock
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'sgroup_created',
            slug: 'bangkok-founders',
            title: 'Bangkok Founders',
            description: null,
            owner_id: 'user_test_1',
            visibility: 'public',
            status: 'active',
            members_count: 1,
            created_at: '2026-03-14T10:00:00.000Z',
            updated_at: '2026-03-14T10:00:00.000Z',
          },
        ],
      });

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          slug: 'bangkok-founders',
          title: 'Bangkok Founders',
          visibility: 'public',
        }),
      }),
      env
    );

    const body = await readJson<{ slug: string; ownerId: string; membersCount: number }>(response);
    expect(response.status).toBe(201);
    expect(body.slug).toBe('bangkok-founders');
    expect(body.ownerId).toBe('user_test_1');
    expect(body.membersCount).toBe(1);
  });

  it('rejects group creation for non-PRO non-admin user', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { role: 'spacer' });

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          slug: 'open-group',
          title: 'Open Group',
          visibility: 'public',
        }),
      }),
      env
    );

    const body = await readJson<{ error: { code: string; message: string } }>(response);
    expect(response.status).toBe(400);
    expect(body.error.code).toBe('VALIDATION_ERROR');
    expect(body.error.message).toContain('Group creation');
    expect(executeMock).not.toHaveBeenCalled();
  });

  it('returns a public group for anonymous read', async () => {
    executeMock.mockResolvedValueOnce({
      rows: [
        {
          id: 'sgroup_public',
          slug: 'phuket-makers',
          title: 'Phuket Makers',
          description: 'Public group',
          owner_id: 'user_owner',
          visibility: 'public',
          status: 'active',
          members_count: 3,
          created_at: '2026-03-14T10:00:00.000Z',
          updated_at: '2026-03-14T10:00:00.000Z',
        },
      ],
    });

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/groups/sgroup_public'),
      {
        DATABASE_URL: 'postgres://example',
        SERVICE_JWT_SECRET: 'service-secret',
      }
    );

    const body = await readJson<{ id: string; slug: string; visibility: string }>(response);
    expect(response.status).toBe(200);
    expect(body.id).toBe('sgroup_public');
    expect(body.slug).toBe('phuket-makers');
    expect(body.visibility).toBe('public');
  });

  it('joins a public group with active membership', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!);

    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'sgroup_public',
            slug: 'phuket-makers',
            title: 'Phuket Makers',
            description: null,
            owner_id: 'user_owner',
            visibility: 'public',
            status: 'active',
            members_count: 3,
            created_at: '2026-03-14T10:00:00.000Z',
            updated_at: '2026-03-14T10:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          {
            group_id: 'sgroup_public',
            user_id: 'user_test_1',
            role: 'member',
            status: 'active',
            joined_at: '2026-03-14T10:05:00.000Z',
          },
        ],
      });

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/groups/sgroup_public/join', {
        method: 'POST',
        headers: {
          'X-Gateway-Auth': gatewayJwt,
        },
      }),
      env
    );

    const body = await readJson<{ groupId: string; userId: string; role: string; status: string }>(response);
    expect(response.status).toBe(200);
    expect(body.groupId).toBe('sgroup_public');
    expect(body.userId).toBe('user_test_1');
    expect(body.role).toBe('member');
    expect(body.status).toBe('active');
  });

  it('returns existing membership on repeated public group join', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!);

    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'sgroup_public',
            slug: 'phuket-makers',
            title: 'Phuket Makers',
            description: null,
            owner_id: 'user_owner',
            visibility: 'public',
            status: 'active',
            members_count: 3,
            created_at: '2026-03-14T10:00:00.000Z',
            updated_at: '2026-03-14T10:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            group_id: 'sgroup_public',
            user_id: 'user_test_1',
            role: 'member',
            status: 'active',
            joined_at: '2026-03-14T10:05:00.000Z',
          },
        ],
      });

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/groups/sgroup_public/join', {
        method: 'POST',
        headers: {
          'X-Gateway-Auth': gatewayJwt,
        },
      }),
      env
    );

    const body = await readJson<{ status: string }>(response);
    expect(response.status).toBe(200);
    expect(body.status).toBe('active');
    expect(executeMock).toHaveBeenCalledTimes(2);
  });

  it('leaves a public group with existing membership', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!);

    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'sgroup_public',
            slug: 'phuket-makers',
            title: 'Phuket Makers',
            description: null,
            owner_id: 'user_owner',
            visibility: 'public',
            status: 'active',
            members_count: 3,
            created_at: '2026-03-14T10:00:00.000Z',
            updated_at: '2026-03-14T10:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [{ group_id: 'sgroup_public' }] });

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/groups/sgroup_public/leave', {
        method: 'POST',
        headers: {
          'X-Gateway-Auth': gatewayJwt,
        },
      }),
      env
    );

    expect(response.status).toBe(204);
  });

  it('returns not found on repeated leave when membership is already removed', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!);

    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'sgroup_public',
            slug: 'phuket-makers',
            title: 'Phuket Makers',
            description: null,
            owner_id: 'user_owner',
            visibility: 'public',
            status: 'active',
            members_count: 3,
            created_at: '2026-03-14T10:00:00.000Z',
            updated_at: '2026-03-14T10:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [] });

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/groups/sgroup_public/leave', {
        method: 'POST',
        headers: {
          'X-Gateway-Auth': gatewayJwt,
        },
      }),
      env
    );

    const body = await readJson<{ error: { code: string } }>(response);
    expect(response.status).toBe(404);
    expect(body.error.code).toBe('NOT_FOUND');
  });

  it('returns activity projection rows with actor and stable cursor', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!);

    executeMock.mockResolvedValueOnce({
      rows: [
        {
          id: 'activity:space.group_joined:sgroup_public:user_test_1',
          type: 'group_joined',
          action_type: 'space.group_joined',
          direction: 'outgoing',
          category: 'social',
          actor_user_id: 'user_test_1',
          actor_display_name: 'User Test',
          actor_avatar_url: null,
          actor_role_label: 'Spacer',
          title: 'You joined Phuket Makers',
          description: 'Builders in Phuket',
          related_post_id: null,
          related_entity_type: 'space_group',
          related_entity_id: 'sgroup_public',
          occurred_at: '2026-03-14T10:05:00.000Z',
        },
        {
          id: 'activity:space.post_reposted_by_other:spost_repost_1:user_test_1',
          type: 'post_reposted_by_other',
          action_type: 'space.post_reposted_by_other',
          direction: 'incoming',
          category: 'social',
          actor_user_id: 'user_2',
          actor_display_name: 'User Two',
          actor_avatar_url: 'https://example.com/u2.png',
          actor_role_label: null,
          title: 'Someone reposted your post',
          description: 'Hello Space',
          related_post_id: 'spost_1',
          related_entity_type: 'space_post',
          related_entity_id: 'spost_repost_1',
          occurred_at: '2026-03-14T10:04:00.000Z',
        },
        {
          id: 'activity:space.post_created:spost_1',
          type: 'post_created',
          action_type: 'space.post_created',
          direction: 'outgoing',
          category: 'social',
          actor_user_id: 'user_test_1',
          actor_display_name: 'User Test',
          actor_avatar_url: null,
          actor_role_label: 'Spacer',
          title: 'You created a post',
          description: 'Hello Space',
          related_post_id: 'spost_1',
          related_entity_type: null,
          related_entity_id: null,
          occurred_at: '2026-03-14T10:03:00.000Z',
        },
      ],
    });

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/feed/activity?limit=2', {
        headers: {
          'X-Gateway-Auth': gatewayJwt,
        },
      }),
      env
    );

    const body = await readJson<{
      items: Array<{
        id: string;
        type: string;
        actionType: string;
        direction: string;
        category: string;
        actor: {
          userId: string;
          displayName: string | null;
          avatarUrl: string | null;
          roleLabel: string | null;
        };
        title: string;
        description: string | null;
        relatedPostId: string | null;
        relatedEntityType: string | null;
        relatedEntityId: string | null;
        createdAt: string;
      }>;
      nextCursor: string | null;
    }>(response);

    const expectedCursor = btoa(
      JSON.stringify({ publishedAt: '2026-03-14T10:03:00.000Z', id: 'activity:space.post_created:spost_1' })
    )
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');

    expect(response.status).toBe(200);
    expect(body.items).toHaveLength(2);
    expect(body.items[0]).toEqual({
      id: 'activity:space.group_joined:sgroup_public:user_test_1',
      type: 'group_joined',
      actionType: 'space.group_joined',
      direction: 'outgoing',
      category: 'social',
      actor: {
        userId: 'user_test_1',
        displayName: 'User Test',
        avatarUrl: null,
        roleLabel: 'Spacer',
      },
      title: 'You joined Phuket Makers',
      description: 'Builders in Phuket',
      relatedPostId: null,
      relatedEntityType: 'space_group',
      relatedEntityId: 'sgroup_public',
      createdAt: '2026-03-14T10:05:00.000Z',
    });
    expect(body.items[1]).toEqual({
      id: 'activity:space.post_reposted_by_other:spost_repost_1:user_test_1',
      type: 'post_reposted_by_other',
      actionType: 'space.post_reposted_by_other',
      direction: 'incoming',
      category: 'social',
      actor: {
        userId: 'user_2',
        displayName: 'User Two',
        avatarUrl: 'https://example.com/u2.png',
        roleLabel: null,
      },
      title: 'Someone reposted your post',
      description: 'Hello Space',
      relatedPostId: 'spost_1',
      relatedEntityType: 'space_post',
      relatedEntityId: 'spost_repost_1',
      createdAt: '2026-03-14T10:04:00.000Z',
    });
    expect(body.nextCursor).toBe(expectedCursor);
  });

  it('filters activity projection by direction and rejects invalid filter', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!);

    executeMock.mockResolvedValueOnce({
      rows: [
        {
          id: 'activity:space.post_liked_by_other:user_2:spost_1:user_test_1',
          type: 'post_liked_by_other',
          action_type: 'space.post_liked_by_other',
          direction: 'incoming',
          category: 'social',
          actor_user_id: 'user_2',
          actor_display_name: 'User Two',
          actor_avatar_url: null,
          actor_role_label: null,
          title: 'Someone liked your post',
          description: 'Hello Space',
          related_post_id: 'spost_1',
          related_entity_type: 'space_post',
          related_entity_id: 'spost_1',
          occurred_at: '2026-03-14T10:02:00.000Z',
        },
      ],
    });

    const incomingResponse = await worker.fetch(
      new Request('https://space.example/v1/space/feed/activity?filter=incoming', {
        headers: {
          'X-Gateway-Auth': gatewayJwt,
        },
      }),
      env
    );

    const incomingBody = await readJson<{ items: Array<{ actionType: string; direction: string }> }>(incomingResponse);
    expect(incomingResponse.status).toBe(200);
    expect(incomingBody.items[0]).toMatchObject({
      actionType: 'space.post_liked_by_other',
      direction: 'incoming',
    });

    const invalidResponse = await worker.fetch(
      new Request('https://space.example/v1/space/feed/activity?filter=system', {
        headers: {
          'X-Gateway-Auth': gatewayJwt,
        },
      }),
      env
    );

    const invalidBody = await readJson<{ error: { code: string } }>(invalidResponse);
    expect(invalidResponse.status).toBe(400);
    expect(invalidBody.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns public group feed without auth when group is public', async () => {
    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'sgroup_public',
            slug: 'phuket-makers',
            title: 'Phuket Makers',
            description: null,
            owner_id: 'user_owner',
            visibility: 'public',
            status: 'active',
            members_count: 3,
            created_at: '2026-03-14T10:00:00.000Z',
            updated_at: '2026-03-14T10:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'spost_group_1',
            author_id: 'user_owner',
            author_display_name: 'Owner',
            author_avatar_url: null,
            author_role_label: 'PRO',
            group_id: 'sgroup_public',
            post_type: 'post',
            visibility: 'group',
            text: 'Hello group',
            repost_target_type: null,
            repost_target_id: null,
            status: 'active',
            created_at: '2026-03-14T10:00:00.000Z',
            updated_at: '2026-03-14T10:00:00.000Z',
            published_at: '2026-03-14T10:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [] });

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/feed/group/sgroup_public'),
      {
        DATABASE_URL: 'postgres://example',
        SERVICE_JWT_SECRET: 'service-secret',
      }
    );

    const body = await readJson<{ items: Array<{ reason: string; post: { groupId: string | null; visibility: string } }> }>(response);
    expect(response.status).toBe(200);
    expect(body.items).toHaveLength(1);
    expect(body.items[0]?.reason).toBe('group_post');
    expect(body.items[0]?.post.groupId).toBe('sgroup_public');
    expect(body.items[0]?.post.visibility).toBe('group');
  });

  it('rejects external system post creation', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!);

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          postType: 'system',
          visibility: 'public',
          text: 'system message',
        }),
      }),
      env
    );

    const body = await readJson<{ error: { code: string; message: string } }>(response);
    expect(response.status).toBe(400);
    expect(body.error.code).toBe('VALIDATION_ERROR');
    expect(body.error.message).toContain('system');
  });

  it('rejects invalid repostTargetType for repost', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!);

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          postType: 'repost',
          visibility: 'public',
          repostTargetType: 'bad_type',
          repostTargetId: 'entity_1',
        }),
      }),
      env
    );

    const body = await readJson<{ error: { code: string } }>(response);
    expect(response.status).toBe(400);
    expect(body.error.code).toBe('REPOST_TARGET_INVALID');
  });

  it('rejects repostTarget fields for non-repost posts', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!);

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          postType: 'post',
          visibility: 'public',
          text: 'Regular post',
          repostTargetType: 'place',
          repostTargetId: '123',
        }),
      }),
      env
    );

    const body = await readJson<{ error: { code: string; message: string } }>(response);
    expect(response.status).toBe(400);
    expect(body.error.code).toBe('VALIDATION_ERROR');
    expect(body.error.message).toContain('repost target fields are only allowed for repost posts');
  });

  it('returns conflict when duplicate object-bound repost already exists for author', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!);

    executeMock
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'spost_existing_event_repost',
            author_id: 'user_test_1',
            author_display_name: 'User Test',
            author_avatar_url: null,
            author_role_label: 'Spacer',
            group_id: null,
            post_type: 'repost',
            visibility: 'public',
            text: null,
            repost_target_type: 'event',
            repost_target_id: 'evt_1',
            status: 'active',
            created_at: '2026-03-14T10:00:00.000Z',
            updated_at: '2026-03-14T10:00:00.000Z',
            published_at: '2026-03-14T10:00:00.000Z',
          },
        ],
      });

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          postType: 'repost',
          visibility: 'public',
          repostTargetType: 'event',
          repostTargetId: 'evt_1',
        }),
      }),
      env
    );

    const body = await readJson<{ error: { code: string }; existingPostId: string }>(response);
    expect(response.status).toBe(409);
    expect(body.error.code).toBe('REPOST_ALREADY_EXISTS');
    expect(body.existingPostId).toBe('spost_existing_event_repost');
    expect(executeMock.mock.calls.some((_, index) => sqlOf(index).includes('INSERT INTO space_post'))).toBe(false);
  });

  it('returns conflict for convenience repost when active repost already exists', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!);

    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'spost_target',
            author_id: 'user_owner',
            author_display_name: 'Owner',
            author_avatar_url: null,
            author_role_label: 'Spacer',
            group_id: null,
            post_type: 'post',
            visibility: 'public',
            text: 'Target',
            repost_target_type: null,
            repost_target_id: null,
            status: 'active',
            created_at: '2026-03-14T10:00:00.000Z',
            updated_at: '2026-03-14T10:00:00.000Z',
            published_at: '2026-03-14T10:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'spost_existing_space_post_repost',
            author_id: 'user_test_1',
            author_display_name: 'User Test',
            author_avatar_url: null,
            author_role_label: 'Spacer',
            group_id: null,
            post_type: 'repost',
            visibility: 'public',
            text: null,
            repost_target_type: 'space_post',
            repost_target_id: 'spost_target',
            status: 'active',
            created_at: '2026-03-14T10:01:00.000Z',
            updated_at: '2026-03-14T10:01:00.000Z',
            published_at: '2026-03-14T10:01:00.000Z',
          },
        ],
      });

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/posts/spost_target/repost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
      }),
      env
    );

    const body = await readJson<{ error: { code: string }; existingPostId: string }>(response);
    expect(response.status).toBe(409);
    expect(body.error.code).toBe('REPOST_ALREADY_EXISTS');
    expect(body.existingPostId).toBe('spost_existing_space_post_repost');
  });

  it('filters non-group visibility rows from group feed queries', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!);

    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'sgroup_1',
            slug: 'group-1',
            title: 'Group 1',
            description: null,
            owner_id: 'user_test_1',
            visibility: 'public',
            status: 'active',
            members_count: 1,
            created_at: '2026-03-14T10:00:00.000Z',
            updated_at: '2026-03-14T10:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [] });

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/feed/group/sgroup_1', {
        method: 'GET',
        headers: {
          'X-Gateway-Auth': gatewayJwt,
        },
      }),
      env
    );

    const body = await readJson<{ items: unknown[] }>(response);
    expect(response.status).toBe(200);
    expect(body.items).toEqual([]);
    const groupFeedQuery = executeMock.mock.calls[1]?.[0];
    expect(JSON.stringify(groupFeedQuery)).toContain("sp.visibility = 'group'");
  });

  it('attaches media as relation-only without lifecycle fetches', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!);
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'spost_1',
            author_id: 'user_test_1',
            author_display_name: 'User',
            author_avatar_url: null,
            author_role_label: null,
            group_id: null,
            post_type: 'post',
            visibility: 'public',
            text: 'Hello',
            repost_target_type: null,
            repost_target_id: null,
            status: 'active',
            created_at: '2026-03-14T10:00:00.000Z',
            updated_at: '2026-03-14T10:00:00.000Z',
            published_at: '2026-03-14T10:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [{ count: 0 }] })
      .mockResolvedValueOnce({ rows: [] });

    const response = await worker.fetch(
      new Request('https://space.example/v1/space/posts/spost_1/media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': gatewayJwt,
        },
        body: JSON.stringify({
          mediaId: 'media_1',
          sortOrder: 2,
        }),
      }),
      env
    );

    const body = await readJson<{ postId: string; mediaId: string; sortOrder: number }>(response);
    expect(response.status).toBe(200);
    expect(body.postId).toBe('spost_1');
    expect(body.mediaId).toBe('media_1');
    expect(body.sortOrder).toBe(2);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
