-- =====================================================================
-- 0042_space_activity_projection_v1.sql
-- Persisted activity projection for bounded Activity slice 2
-- =====================================================================

CREATE TABLE IF NOT EXISTS "space_activity_projection" (
  "id" text PRIMARY KEY NOT NULL,
  "recipient_user_id" text NOT NULL,
  "occurred_at" timestamp NOT NULL,
  "action_type" text NOT NULL,
  "direction" text NOT NULL,
  "category" text NOT NULL,
  "actor_user_id" text NOT NULL,
  "title" text NOT NULL,
  "description" text,
  "related_post_id" text,
  "related_entity_type" text,
  "related_entity_id" text,
  "source_stream" text NOT NULL,
  "source_record_key" text NOT NULL,
  "source_event_id" text,
  "removed_at" timestamp
);
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "space_activity_projection_recipient_action_source_unique"
  ON "space_activity_projection" ("recipient_user_id", "action_type", "source_record_key");
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_space_activity_projection_recipient_occurred_at"
  ON "space_activity_projection" ("recipient_user_id", "occurred_at" DESC, "id" DESC);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_space_activity_projection_recipient_direction_occurred_at"
  ON "space_activity_projection" ("recipient_user_id", "direction", "occurred_at" DESC, "id" DESC);
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'space_activity_projection_direction_check'
  ) THEN
    ALTER TABLE "space_activity_projection"
      ADD CONSTRAINT "space_activity_projection_direction_check"
      CHECK ("direction" IN ('incoming', 'outgoing'));
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'space_activity_projection_category_check'
  ) THEN
    ALTER TABLE "space_activity_projection"
      ADD CONSTRAINT "space_activity_projection_category_check"
      CHECK ("category" IN ('social'));
  END IF;
END $$;
--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'space_activity_projection_source_stream_check'
  ) THEN
    ALTER TABLE "space_activity_projection"
      ADD CONSTRAINT "space_activity_projection_source_stream_check"
      CHECK ("source_stream" IN ('space', 'reactions'));
  END IF;
END $$;
--> statement-breakpoint

INSERT INTO "space_activity_projection" (
  "id",
  "recipient_user_id",
  "occurred_at",
  "action_type",
  "direction",
  "category",
  "actor_user_id",
  "title",
  "description",
  "related_post_id",
  "related_entity_type",
  "related_entity_id",
  "source_stream",
  "source_record_key",
  "source_event_id",
  "removed_at"
)
SELECT
  'activity:' || CASE WHEN sp."post_type" = 'repost' THEN 'space.repost_created' ELSE 'space.post_created' END || ':' || sp."id" AS "id",
  sp."author_id" AS "recipient_user_id",
  sp."published_at" AS "occurred_at",
  CASE WHEN sp."post_type" = 'repost' THEN 'space.repost_created' ELSE 'space.post_created' END AS "action_type",
  'outgoing' AS "direction",
  'social' AS "category",
  sp."author_id" AS "actor_user_id",
  CASE WHEN sp."post_type" = 'repost' THEN 'You reposted an item' ELSE 'You created a post' END AS "title",
  sp."text" AS "description",
  sp."id" AS "related_post_id",
  sp."repost_target_type"::text AS "related_entity_type",
  sp."repost_target_id" AS "related_entity_id",
  'space' AS "source_stream",
  'post:' || sp."id" AS "source_record_key",
  sp."id" AS "source_event_id",
  NULL AS "removed_at"
FROM "space_post" sp
WHERE sp."status" = 'active'
  AND sp."deleted_at" IS NULL
ON CONFLICT ("recipient_user_id", "action_type", "source_record_key") DO NOTHING;
--> statement-breakpoint

INSERT INTO "space_activity_projection" (
  "id",
  "recipient_user_id",
  "occurred_at",
  "action_type",
  "direction",
  "category",
  "actor_user_id",
  "title",
  "description",
  "related_post_id",
  "related_entity_type",
  "related_entity_id",
  "source_stream",
  "source_record_key",
  "source_event_id",
  "removed_at"
)
SELECT
  'activity:space.group_joined:' || sgm."group_id" || ':' || sgm."user_id" AS "id",
  sgm."user_id" AS "recipient_user_id",
  sgm."joined_at" AS "occurred_at",
  'space.group_joined' AS "action_type",
  'outgoing' AS "direction",
  'social' AS "category",
  sgm."user_id" AS "actor_user_id",
  'You joined ' || sg."title" AS "title",
  sg."description" AS "description",
  NULL AS "related_post_id",
  'space_group' AS "related_entity_type",
  sgm."group_id" AS "related_entity_id",
  'space' AS "source_stream",
  'group_join:' || sgm."group_id" || ':' || sgm."user_id" AS "source_record_key",
  sgm."group_id" || ':' || sgm."user_id" AS "source_event_id",
  NULL AS "removed_at"
FROM "space_group_member" sgm
INNER JOIN "space_group" sg ON sg."id" = sgm."group_id"
WHERE sgm."status" = 'active'
ON CONFLICT ("recipient_user_id", "action_type", "source_record_key") DO NOTHING;
--> statement-breakpoint

INSERT INTO "space_activity_projection" (
  "id",
  "recipient_user_id",
  "occurred_at",
  "action_type",
  "direction",
  "category",
  "actor_user_id",
  "title",
  "description",
  "related_post_id",
  "related_entity_type",
  "related_entity_id",
  "source_stream",
  "source_record_key",
  "source_event_id",
  "removed_at"
)
SELECT
  'activity:space.post_reposted_by_other:' || repost."id" || ':' || original."author_id" AS "id",
  original."author_id" AS "recipient_user_id",
  repost."published_at" AS "occurred_at",
  'space.post_reposted_by_other' AS "action_type",
  'incoming' AS "direction",
  'social' AS "category",
  repost."author_id" AS "actor_user_id",
  'Someone reposted your post' AS "title",
  original."text" AS "description",
  original."id" AS "related_post_id",
  'space_post' AS "related_entity_type",
  repost."id" AS "related_entity_id",
  'space' AS "source_stream",
  'repost:' || repost."id" AS "source_record_key",
  repost."id" AS "source_event_id",
  NULL AS "removed_at"
FROM "space_post" repost
INNER JOIN "space_post" original ON original."id" = repost."repost_target_id"
WHERE repost."post_type" = 'repost'
  AND repost."repost_target_type" = 'space_post'
  AND repost."status" = 'active'
  AND repost."deleted_at" IS NULL
  AND original."status" = 'active'
  AND original."deleted_at" IS NULL
  AND repost."author_id" <> original."author_id"
ON CONFLICT ("recipient_user_id", "action_type", "source_record_key") DO NOTHING;
--> statement-breakpoint

INSERT INTO "space_activity_projection" (
  "id",
  "recipient_user_id",
  "occurred_at",
  "action_type",
  "direction",
  "category",
  "actor_user_id",
  "title",
  "description",
  "related_post_id",
  "related_entity_type",
  "related_entity_id",
  "source_stream",
  "source_record_key",
  "source_event_id",
  "removed_at"
)
SELECT
  'activity:space.post_liked_by_other:' || r."user_id" || ':' || sp."id" || ':' || sp."author_id" AS "id",
  sp."author_id" AS "recipient_user_id",
  r."created_at" AS "occurred_at",
  'space.post_liked_by_other' AS "action_type",
  'incoming' AS "direction",
  'social' AS "category",
  r."user_id" AS "actor_user_id",
  'Someone liked your post' AS "title",
  sp."text" AS "description",
  sp."id" AS "related_post_id",
  'space_post' AS "related_entity_type",
  sp."id" AS "related_entity_id",
  'reactions' AS "source_stream",
  'reaction:like:' || r."user_id" || ':space_post:' || sp."id" AS "source_record_key",
  r."id" AS "source_event_id",
  NULL AS "removed_at"
FROM "reactions" r
INNER JOIN "space_post" sp
  ON sp."id" = r."target_id"
WHERE r."target_type" = 'space_post'
  AND r."reaction_type" = 'like'
  AND r."status" = 'active'
  AND sp."status" = 'active'
  AND sp."deleted_at" IS NULL
  AND r."user_id" <> sp."author_id"
ON CONFLICT ("recipient_user_id", "action_type", "source_record_key") DO NOTHING;
