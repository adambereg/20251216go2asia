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

  it('returns bounded activity slice 1 with group joins and v2 fields', async () => {
    const env: Env = {
      SERVICE_JWT_SECRET: 'service-secret',
      DATABASE_URL: 'postgres://example',
    };
    const gatewayJwt = await makeGatewayJwt(env.SERVICE_JWT_SECRET!);

    executeMock.mockResolvedValueOnce({
      rows: [
        {
          id: 'group_joined:sgroup_public:user_test_1',
          type: 'group_joined',
          action_type: 'space.group_joined',
          direction: 'outgoing',
          category: 'social',
          title: 'You joined Phuket Makers',
          description: 'Builders in Phuket',
          related_post_id: null,
          related_entity_type: 'space_group',
          related_entity_id: 'sgroup_public',
          created_at: '2026-03-14T10:05:00.000Z',
        },
        {
          id: 'spost_repost_1',
          type: 'repost_created',
          action_type: 'space.repost_created',
          direction: 'outgoing',
          category: 'social',
          title: 'You reposted an item',
          description: 'Worth sharing',
          related_post_id: 'spost_repost_1',
          related_entity_type: 'space_post',
          related_entity_id: 'spost_7',
          created_at: '2026-03-14T10:04:00.000Z',
        },
        {
          id: 'spost_1',
          type: 'post_created',
          action_type: 'space.post_created',
          direction: 'outgoing',
          category: 'social',
          title: 'You created a post',
          description: 'Hello Space',
          related_post_id: 'spost_1',
          related_entity_type: null,
          related_entity_id: null,
          created_at: '2026-03-14T10:03:00.000Z',
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
        title: string;
        description: string | null;
        relatedPostId: string | null;
        relatedEntityType: string | null;
        relatedEntityId: string | null;
        createdAt: string;
      }>;
      nextCursor: string | null;
    }>(response);

    const expectedCursor = btoa(JSON.stringify({ publishedAt: '2026-03-14T10:03:00.000Z', id: 'spost_1' }))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');

    expect(response.status).toBe(200);
    expect(body.items).toHaveLength(2);
    expect(body.items[0]).toEqual({
      id: 'group_joined:sgroup_public:user_test_1',
      type: 'group_joined',
      actionType: 'space.group_joined',
      direction: 'outgoing',
      category: 'social',
      title: 'You joined Phuket Makers',
      description: 'Builders in Phuket',
      relatedPostId: null,
      relatedEntityType: 'space_group',
      relatedEntityId: 'sgroup_public',
      createdAt: '2026-03-14T10:05:00.000Z',
    });
    expect(body.items[1]).toMatchObject({
      id: 'spost_repost_1',
      type: 'repost_created',
      actionType: 'space.repost_created',
      direction: 'outgoing',
      category: 'social',
      relatedPostId: 'spost_repost_1',
      relatedEntityType: 'space_post',
      relatedEntityId: 'spost_7',
    });
    expect(body.nextCursor).toBe(expectedCursor);
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
