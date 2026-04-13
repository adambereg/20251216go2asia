import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Client } from 'pg';
import { parse } from 'yaml';

type ImportMode = 'dry-run' | 'apply';

type SeedUser = {
  email: string;
  account_role: string;
  display_name: string;
  role_label?: string;
  avatar_url?: string;
  country?: string;
  city?: string;
  bio_short?: string;
};

type SeedProfile = {
  email: string;
  display_name?: string;
  role_label?: string;
  avatar_hint?: string;
  country?: string;
  city?: string;
  bio_short?: string;
};

type SeedGroup = {
  slug: string;
  title: string;
  description?: string;
  visibility: 'public' | 'private' | 'invite_only';
  owner_email: string;
  moderator_emails?: string[];
  member_emails?: string[];
};

type SeedMembershipMatrix = {
  group_slug: string;
  owner_email: string;
  moderators?: string[];
  active_members?: string[];
};

type SeedPost = {
  post_ref: string;
  author_email: string;
  post_kind: 'post' | 'repost' | 'system';
  visibility: 'public' | 'followers' | 'group' | 'private';
  group_slug?: string;
  text?: string;
  repost_target?: {
    target_type?: string;
    target_hint?: string;
  };
  media_refs?: string[];
};

type SeedMediaItem = {
  media_ref: string;
  attached_to_post_ref?: string;
  sort_order?: number;
};

type ParsedSeed = {
  users: SeedUser[];
  profileProjections: SeedProfile[];
  groups: SeedGroup[];
  groupMembershipMatrix: SeedMembershipMatrix[];
  posts: SeedPost[];
  postMedia: SeedMediaItem[];
};

type MaterializedProfile = {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  roleLabel: string | null;
  countryId: string | null;
  cityId: string | null;
  bioShort: string | null;
};

type MaterializedGroup = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  ownerId: string;
  visibility: 'public';
};

type MaterializedMembership = {
  groupId: string;
  userId: string;
  role: 'owner' | 'moderator' | 'member';
  status: 'active';
  invitedBy: string | null;
  joinedAt: string;
};

type MaterializedPost = {
  id: string;
  authorId: string;
  groupId: string | null;
  postType: 'post' | 'repost' | 'system';
  visibility: 'public' | 'group';
  text: string | null;
  repostTargetType: string | null;
  repostTargetId: string | null;
  publishedAt: string;
};

const SOURCE_PATH = resolve(process.cwd(), '../../content/space/Space-Asia-Full-Seed-Content-Pack-v1.md');
const SECTION_SEPARATOR_RE = /^_{10,}\s*$/m;
const ALLOWED_REPOST_TYPES = new Set([
  'space_post',
  'blog_post',
  'place',
  'event',
  'partner',
  'listing',
  'quest',
]);

function parseArgs(argv: string[]): { mode: ImportMode } {
  return {
    mode: argv.includes('--apply') ? 'apply' : 'dry-run',
  };
}

function getDatabaseUrl(mode: ImportMode): string | null {
  if (mode === 'dry-run') return null;
  const url = process.env.STAGING_DATABASE_URL || process.env.DATABASE_URL;
  if (!url) throw new Error('Missing STAGING_DATABASE_URL or DATABASE_URL');
  const env = (process.env.ENVIRONMENT ?? 'dev').toLowerCase();
  if (env === 'production') throw new Error('Refusing to run import with ENVIRONMENT=production');
  return url;
}

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toNullableString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function toUserId(email: string): string {
  const local = email.split('@')[0] ?? email;
  return slugify(local.replace(/\.seed$/i, '').replace(/\./g, '-'));
}

function toCountryId(value: string | null): string | null {
  return value ? slugify(value) : null;
}

function toCityId(value: string | null): string | null {
  return value ? slugify(value) : null;
}

function extractSection(markdown: string, key: string): string {
  const startIndex = markdown.indexOf(`${key}:`);
  if (startIndex === -1) {
    throw new Error(`Missing section "${key}" in ${SOURCE_PATH}`);
  }
  const afterStart = markdown.slice(startIndex);
  const separatorMatch = afterStart.match(SECTION_SEPARATOR_RE);
  const endIndex = separatorMatch?.index ? startIndex + separatorMatch.index : markdown.length;
  return markdown.slice(startIndex, endIndex).trim();
}

function parseSection<T>(markdown: string, key: string): T {
  const block = extractSection(markdown, key);
  const parsed = parse(block) as Record<string, unknown> | null;
  if (!parsed || !(key in parsed)) {
    throw new Error(`Unable to parse section "${key}"`);
  }
  return parsed[key] as T;
}

function parseSeed(markdown: string): ParsedSeed {
  const mediaRegistry = parseSection<Record<string, SeedMediaItem[] | undefined>>(markdown, 'media_registry');
  return {
    users: parseSection<SeedUser[]>(markdown, 'users'),
    profileProjections: parseSection<SeedProfile[]>(markdown, 'profile_projections'),
    groups: parseSection<SeedGroup[]>(markdown, 'groups'),
    groupMembershipMatrix: parseSection<SeedMembershipMatrix[]>(markdown, 'group_membership_matrix'),
    posts: parseSection<SeedPost[]>(markdown, 'posts'),
    postMedia: mediaRegistry.post_media ?? [],
  };
}

function getRoleLabel(user: SeedUser, profile: SeedProfile | null): string | null {
  return toNullableString(profile?.role_label) ?? toNullableString(user.role_label) ?? null;
}

function materializeSeed(parsed: ParsedSeed) {
  const usersByEmail = new Map(parsed.users.map((user) => [user.email, user]));
  const profilesByEmail = new Map(parsed.profileProjections.map((profile) => [profile.email, profile]));
  const publicGroups = parsed.groups.filter((group) => group.visibility === 'public');
  const publicGroupSlugs = new Set(publicGroups.map((group) => group.slug));
  const membershipsByGroupSlug = new Map(
    parsed.groupMembershipMatrix.map((membership) => [membership.group_slug, membership])
  );

  const usedEmails = new Set<string>();
  for (const group of publicGroups) {
    usedEmails.add(group.owner_email);
    for (const email of group.moderator_emails ?? []) usedEmails.add(email);
    for (const email of group.member_emails ?? []) usedEmails.add(email);
  }
  for (const membership of parsed.groupMembershipMatrix) {
    if (!publicGroupSlugs.has(membership.group_slug)) continue;
    usedEmails.add(membership.owner_email);
    for (const email of membership.moderators ?? []) usedEmails.add(email);
    for (const email of membership.active_members ?? []) usedEmails.add(email);
  }
  const selectedPosts = parsed.posts.filter((post) => {
    if (post.visibility !== 'public' && post.visibility !== 'group') return false;
    if (post.visibility === 'group') {
      const groupSlug = toNullableString(post.group_slug);
      return Boolean(groupSlug && publicGroupSlugs.has(groupSlug));
    }
    return true;
  });
  for (const post of selectedPosts) {
    usedEmails.add(post.author_email);
  }

  const profiles: MaterializedProfile[] = Array.from(usedEmails)
    .map((email) => {
      const user = usersByEmail.get(email);
      if (!user) {
        throw new Error(`Seed email "${email}" is referenced but missing from users section`);
      }
      const profile = profilesByEmail.get(email) ?? null;
      return {
        userId: toUserId(email),
        displayName: toNullableString(profile?.display_name) ?? user.display_name,
        avatarUrl: toNullableString(user.avatar_url),
        roleLabel: getRoleLabel(user, profile),
        countryId: toCountryId(toNullableString(profile?.country) ?? toNullableString(user.country)),
        cityId: toCityId(toNullableString(profile?.city) ?? toNullableString(user.city)),
        bioShort: toNullableString(profile?.bio_short) ?? toNullableString(user.bio_short),
      };
    })
    .sort((a, b) => a.userId.localeCompare(b.userId));

  const groups: MaterializedGroup[] = publicGroups.map((group) => ({
    id: group.slug,
    slug: group.slug,
    title: group.title,
    description: toNullableString(group.description),
    ownerId: toUserId(group.owner_email),
    visibility: 'public',
  }));

  const membershipMap = new Map<string, MaterializedMembership>();
  const pushMembership = (
    groupId: string,
    userId: string,
    role: MaterializedMembership['role'],
    invitedBy: string | null,
    joinedAt: string
  ) => {
    membershipMap.set(`${groupId}:${userId}`, {
      groupId,
      userId,
      role,
      status: 'active',
      invitedBy,
      joinedAt,
    });
  };

  groups.forEach((group, groupIndex) => {
    const seedGroup = publicGroups[groupIndex]!;
    const membership = membershipsByGroupSlug.get(group.slug);
    const joinedBase = new Date(Date.UTC(2026, 2, 14, 9, groupIndex * 8, 0));
    pushMembership(group.id, group.ownerId, 'owner', group.ownerId, joinedBase.toISOString());
    for (const [idx, email] of (membership?.moderators ?? seedGroup.moderator_emails ?? []).entries()) {
      pushMembership(
        group.id,
        toUserId(email),
        'moderator',
        group.ownerId,
        new Date(joinedBase.getTime() + (idx + 1) * 60_000).toISOString()
      );
    }
    for (const [idx, email] of (membership?.active_members ?? seedGroup.member_emails ?? []).entries()) {
      pushMembership(
        group.id,
        toUserId(email),
        'member',
        group.ownerId,
        new Date(joinedBase.getTime() + (idx + 10) * 60_000).toISOString()
      );
    }
  });

  const posts: MaterializedPost[] = selectedPosts.map((post, index) => {
    const visibility = post.visibility === 'group' ? 'group' : 'public';
    const groupId = visibility === 'group' ? toNullableString(post.group_slug) : null;
    const targetType = toNullableString(post.repost_target?.target_type);
    const repostTargetType =
      targetType && ALLOWED_REPOST_TYPES.has(targetType) ? targetType : null;
    const publishedAt = new Date(Date.UTC(2026, 2, 15, 7, index * 7, 0)).toISOString();
    return {
      id: post.post_ref,
      authorId: toUserId(post.author_email),
      groupId,
      postType: post.post_kind,
      visibility,
      text: toNullableString(post.text),
      repostTargetType,
      repostTargetId: repostTargetType ? toNullableString(post.repost_target?.target_hint) : null,
      publishedAt,
    };
  });

  const mediaByPostRef = parsed.postMedia
    .filter((item) => toNullableString(item.attached_to_post_ref))
    .map((item) => ({
      postId: item.attached_to_post_ref!.trim(),
      mediaId: `space-media-${item.media_ref}`,
      sortOrder: Number.isFinite(item.sort_order) ? Number(item.sort_order) : 0,
    }))
    .filter((item) => posts.some((post) => post.id === item.postId));

  return {
    profiles,
    groups,
    memberships: Array.from(membershipMap.values()).sort((a, b) =>
      `${a.groupId}:${a.userId}`.localeCompare(`${b.groupId}:${b.userId}`)
    ),
    posts,
    postMedia: mediaByPostRef,
  };
}

async function applySeed(data: ReturnType<typeof materializeSeed>, databaseUrl: string) {
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  try {
    await client.query('BEGIN');

    for (const profile of data.profiles) {
      await client.query(
        `
          INSERT INTO space_profile_projection (
            user_id,
            display_name,
            avatar_url,
            role_label,
            country_id,
            city_id,
            bio_short,
            updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, now())
          ON CONFLICT (user_id)
          DO UPDATE SET
            display_name = EXCLUDED.display_name,
            avatar_url = EXCLUDED.avatar_url,
            role_label = EXCLUDED.role_label,
            country_id = EXCLUDED.country_id,
            city_id = EXCLUDED.city_id,
            bio_short = EXCLUDED.bio_short,
            updated_at = now()
        `,
        [
          profile.userId,
          profile.displayName,
          profile.avatarUrl,
          profile.roleLabel,
          profile.countryId,
          profile.cityId,
          profile.bioShort,
        ]
      );
    }

    for (const group of data.groups) {
      await client.query(
        `
          INSERT INTO space_group (
            id,
            slug,
            title,
            description,
            owner_id,
            visibility,
            status,
            created_at,
            updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, 'active', now(), now())
          ON CONFLICT (id)
          DO UPDATE SET
            slug = EXCLUDED.slug,
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            owner_id = EXCLUDED.owner_id,
            visibility = EXCLUDED.visibility,
            status = 'active',
            updated_at = now()
        `,
        [group.id, group.slug, group.title, group.description, group.ownerId, group.visibility]
      );
    }

    for (const membership of data.memberships) {
      await client.query(
        `
          INSERT INTO space_group_member (
            group_id,
            user_id,
            role,
            status,
            joined_at,
            invited_by
          )
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (group_id, user_id)
          DO UPDATE SET
            role = EXCLUDED.role,
            status = EXCLUDED.status,
            joined_at = EXCLUDED.joined_at,
            invited_by = EXCLUDED.invited_by
        `,
        [
          membership.groupId,
          membership.userId,
          membership.role,
          membership.status,
          membership.joinedAt,
          membership.invitedBy,
        ]
      );
    }

    for (const post of data.posts) {
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
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'active', $9, $9, $9, null)
          ON CONFLICT (id)
          DO UPDATE SET
            author_id = EXCLUDED.author_id,
            group_id = EXCLUDED.group_id,
            post_type = EXCLUDED.post_type,
            visibility = EXCLUDED.visibility,
            text = EXCLUDED.text,
            repost_target_type = EXCLUDED.repost_target_type,
            repost_target_id = EXCLUDED.repost_target_id,
            status = 'active',
            updated_at = EXCLUDED.published_at,
            published_at = EXCLUDED.published_at,
            deleted_at = null
        `,
        [
          post.id,
          post.authorId,
          post.groupId,
          post.postType,
          post.visibility,
          post.text,
          post.repostTargetType,
          post.repostTargetId,
          post.publishedAt,
        ]
      );
    }

    for (const media of data.postMedia) {
      await client.query(
        `
          INSERT INTO space_post_media (post_id, media_id, sort_order, attached_at)
          VALUES ($1, $2, $3, now())
          ON CONFLICT (post_id, media_id)
          DO UPDATE SET
            sort_order = EXCLUDED.sort_order,
            attached_at = now()
        `,
        [media.postId, media.mediaId, media.sortOrder]
      );
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

function printSummary(
  mode: ImportMode,
  data: ReturnType<typeof materializeSeed>
): void {
  const publicPostCount = data.posts.filter((post) => post.visibility === 'public').length;
  const groupPostCount = data.posts.filter((post) => post.visibility === 'group').length;
  console.log(`[space-seed] mode=${mode}`);
  console.log(`[space-seed] profiles=${data.profiles.length}`);
  console.log(`[space-seed] groups=${data.groups.length}`);
  console.log(`[space-seed] memberships=${data.memberships.length}`);
  console.log(
    `[space-seed] posts=${data.posts.length} (public=${publicPostCount}, group=${groupPostCount})`
  );
  console.log(`[space-seed] postMedia=${data.postMedia.length}`);
  console.log(
    `[space-seed] sampleGroups=${data.groups
      .slice(0, 3)
      .map((group) => group.slug)
      .join(', ')}`
  );
  console.log(
    `[space-seed] sampleProfiles=${data.profiles
      .slice(0, 3)
      .map((profile) => profile.userId)
      .join(', ')}`
  );
}

async function main() {
  const { mode } = parseArgs(process.argv.slice(2));
  const markdown = readFileSync(SOURCE_PATH, 'utf8');
  const parsed = parseSeed(markdown);
  const data = materializeSeed(parsed);
  printSummary(mode, data);

  const databaseUrl = getDatabaseUrl(mode);
  if (mode === 'dry-run' || !databaseUrl) {
    console.log('[space-seed] dry-run complete');
    return;
  }

  await applySeed(data, databaseUrl);
  console.log('[space-seed] apply complete');
}

void main().catch((error) => {
  console.error('[space-seed] failed');
  console.error(error);
  process.exit(1);
});
