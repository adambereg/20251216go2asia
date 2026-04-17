import { Client } from 'pg';

type Mode = 'dry-run' | 'apply';

type Args = {
  mode: Mode;
  targetUserId: string | null;
  targetUserEmail: string | null;
};

type DemoPostSeed = {
  id: string;
  text: string;
  postType: 'post' | 'system';
  visibility: 'public';
  createdAt: string;
  publishedAt: string;
};

type DemoBookmarkSeed = {
  id: string;
  targetId: string;
  createdAt: string;
};

const DEFAULT_DEMO_POST: DemoPostSeed = {
  id: 'post-016',
  text:
    'Сохранил короткий public shortlist по Бангкоку: удобная база на первые дни, рабочее кафе и один спокойный район для адаптации. Это хороший кандидат для Saved -> Add to trip demo flow.',
  postType: 'post',
  visibility: 'public',
  createdAt: '2026-04-16T09:10:00.000Z',
  publishedAt: '2026-04-16T09:10:00.000Z',
};

function parseArgs(argv: string[]): Args {
  let targetUserId: string | null = null;
  let targetUserEmail: string | null = null;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]!;
    if (arg === '--user-id') {
      targetUserId = argv[index + 1]?.trim() ?? null;
      index += 1;
      continue;
    }
    if (arg.startsWith('--user-id=')) {
      targetUserId = arg.slice('--user-id='.length).trim() || null;
      continue;
    }
    if (arg === '--user-email') {
      targetUserEmail = argv[index + 1]?.trim().toLowerCase() ?? null;
      index += 1;
      continue;
    }
    if (arg.startsWith('--user-email=')) {
      targetUserEmail = arg.slice('--user-email='.length).trim().toLowerCase() || null;
      continue;
    }
  }

  return {
    mode: argv.includes('--apply') ? 'apply' : 'dry-run',
    targetUserId,
    targetUserEmail,
  };
}

function getDatabaseUrl(mode: Mode): string | null {
  if (mode === 'dry-run') return null;
  const url = process.env.STAGING_DATABASE_URL || process.env.DATABASE_URL;
  if (!url) throw new Error('Missing STAGING_DATABASE_URL or DATABASE_URL');
  const environment = (process.env.ENVIRONMENT ?? 'dev').toLowerCase();
  if (environment === 'production') {
    throw new Error('Refusing to seed Saved demo data with ENVIRONMENT=production');
  }
  return url;
}

function requireExplicitTarget(args: Args): void {
  if (!args.targetUserId && !args.targetUserEmail) {
    throw new Error('Saved demo seed requires --user-id or --user-email');
  }
}

async function resolveTargetUserId(client: Client, args: Args): Promise<{ userId: string; email: string | null }> {
  if (args.targetUserId) {
    const result = await client.query<{ id: string; email: string | null }>(
      `
        SELECT id, email
        FROM users
        WHERE id = $1
        LIMIT 1
      `,
      [args.targetUserId]
    );
    const row = result.rows[0];
    if (!row) {
      throw new Error(`Target user not found by id: ${args.targetUserId}`);
    }
    return { userId: row.id, email: row.email };
  }

  const result = await client.query<{ id: string; email: string }>(
    `
      SELECT id, email
      FROM users
      WHERE lower(email) = $1
      LIMIT 1
    `,
    [args.targetUserEmail!]
  );
  const row = result.rows[0];
  if (!row) {
    throw new Error(`Target user not found by email: ${args.targetUserEmail}`);
  }
  return { userId: row.id, email: row.email };
}

async function resolveDemoAuthorId(client: Client): Promise<string> {
  const fromPublicPost = await client.query<{ author_id: string }>(
    `
      SELECT author_id
      FROM space_post
      WHERE id = 'post-001'
        AND status = 'active'
        AND visibility = 'public'
      LIMIT 1
    `
  );
  const row = fromPublicPost.rows[0];
  if (!row) {
    throw new Error('Expected public anchor post post-001 to exist before seeding Saved demo data');
  }
  return row.author_id;
}

async function ensurePublicPost(client: Client, postId: string): Promise<void> {
  const result = await client.query<{ id: string }>(
    `
      SELECT id
      FROM space_post
      WHERE id = $1
        AND status = 'active'
        AND visibility = 'public'
      LIMIT 1
    `,
    [postId]
  );
  if (!result.rows[0]) {
    throw new Error(`Expected hydratable public space_post to exist: ${postId}`);
  }
}

async function upsertDemoPost(client: Client, authorId: string, post: DemoPostSeed): Promise<void> {
  await client.query(
    `
      INSERT INTO space_post (
        id,
        author_id,
        group_id,
        post_type,
        visibility,
        text,
        repost_target_type,
        repost_target_id,
        status,
        created_at,
        updated_at,
        published_at,
        deleted_at
      )
      VALUES (
        $1,
        $2,
        NULL,
        $3,
        $4,
        $5,
        NULL,
        NULL,
        'active',
        $6::timestamptz,
        $6::timestamptz,
        $7::timestamptz,
        NULL
      )
      ON CONFLICT (id)
      DO UPDATE SET
        author_id = EXCLUDED.author_id,
        group_id = NULL,
        post_type = EXCLUDED.post_type,
        visibility = EXCLUDED.visibility,
        text = EXCLUDED.text,
        repost_target_type = NULL,
        repost_target_id = NULL,
        status = 'active',
        updated_at = EXCLUDED.updated_at,
        published_at = EXCLUDED.published_at,
        deleted_at = NULL
    `,
    [post.id, authorId, post.postType, post.visibility, post.text, post.createdAt, post.publishedAt]
  );
}

async function upsertBookmark(client: Client, userId: string, bookmark: DemoBookmarkSeed): Promise<void> {
  await client.query(
    `
      INSERT INTO reactions (
        id,
        user_id,
        target_type,
        target_id,
        reaction_type,
        status,
        created_at,
        updated_at
      )
      VALUES (
        $1,
        $2,
        'space_post',
        $3,
        'bookmark',
        'active',
        $4::timestamptz,
        $4::timestamptz
      )
      ON CONFLICT (user_id, target_type, target_id, reaction_type)
      DO UPDATE SET
        status = 'active',
        updated_at = EXCLUDED.updated_at
    `,
    [bookmark.id, userId, bookmark.targetId, bookmark.createdAt]
  );
}

async function listBookmarkSummary(client: Client, userId: string) {
  const result = await client.query<{ target_id: string; created_at: string }>(
    `
      SELECT target_id, created_at
      FROM reactions
      WHERE user_id = $1
        AND target_type = 'space_post'
        AND reaction_type = 'bookmark'
        AND status = 'active'
      ORDER BY created_at DESC, id DESC
    `,
    [userId]
  );
  return result.rows;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  requireExplicitTarget(args);
  const databaseUrl = getDatabaseUrl(args.mode);

  const baseBookmarks: DemoBookmarkSeed[] = [
    { id: 'seed_saved_fred_post_016', targetId: 'post-016', createdAt: '2026-04-16T09:20:00.000Z' },
    { id: 'seed_saved_fred_post_015', targetId: 'post-015', createdAt: '2026-04-16T09:19:00.000Z' },
    { id: 'seed_saved_fred_post_001', targetId: 'post-001', createdAt: '2026-04-16T09:18:00.000Z' },
  ];

  if (args.mode === 'dry-run' || !databaseUrl) {
    console.log(
      JSON.stringify(
        {
          mode: args.mode,
          targetUserId: args.targetUserId,
          targetUserEmail: args.targetUserEmail,
          demoPost: DEFAULT_DEMO_POST,
          bookmarks: baseBookmarks,
        },
        null,
        2
      )
    );
    return;
  }

  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  try {
    const targetUser = await resolveTargetUserId(client, args);
    const authorId = await resolveDemoAuthorId(client);

    await ensurePublicPost(client, 'post-001');
    await ensurePublicPost(client, 'post-015');

    await client.query('BEGIN');
    await upsertDemoPost(client, authorId, DEFAULT_DEMO_POST);
    await ensurePublicPost(client, DEFAULT_DEMO_POST.id);

    for (const bookmark of baseBookmarks) {
      await upsertBookmark(client, targetUser.userId, bookmark);
    }
    await client.query('COMMIT');

    const appliedBookmarks = await listBookmarkSummary(client, targetUser.userId);
    console.log(
      JSON.stringify(
        {
          mode: args.mode,
          targetUserId: targetUser.userId,
          targetUserEmail: targetUser.email,
          demoPostId: DEFAULT_DEMO_POST.id,
          bookmarksApplied: baseBookmarks.length,
          activeBookmarks: appliedBookmarks,
        },
        null,
        2
      )
    );
  } catch (error) {
    await client.query('ROLLBACK').catch(() => undefined);
    throw error;
  } finally {
    await client.end();
  }
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
