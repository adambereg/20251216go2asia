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

function sqlOf(callIndex: number): string {
  const arg = executeMock.mock.calls[callIndex]?.[0] as { strings?: string[] } | undefined;
  return (arg?.strings ?? []).join('');
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
