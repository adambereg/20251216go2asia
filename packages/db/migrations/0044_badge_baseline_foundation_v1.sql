CREATE TABLE IF NOT EXISTS "badges" (
	"id" text PRIMARY KEY NOT NULL,
	"code" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(100) NOT NULL,
	"icon_key" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "badges_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "user_badges"
	ADD COLUMN IF NOT EXISTS "source_service" varchar(100);
--> statement-breakpoint
ALTER TABLE "user_badges"
	ADD COLUMN IF NOT EXISTS "source_type" varchar(100);
--> statement-breakpoint
ALTER TABLE "user_badges"
	ADD COLUMN IF NOT EXISTS "source_id" text;
--> statement-breakpoint
ALTER TABLE "user_badges"
	ADD COLUMN IF NOT EXISTS "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL;
--> statement-breakpoint
ALTER TABLE "user_badges"
	ADD COLUMN IF NOT EXISTS "created_at" timestamp DEFAULT now() NOT NULL;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "badges_is_active_idx" ON "badges" ("is_active");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_badges_user_id_idx" ON "user_badges" ("user_id");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_badges_user_badge_unique" ON "user_badges" ("user_id", "badge_id");
--> statement-breakpoint
INSERT INTO "badges" ("id", "code", "title", "description", "category", "icon_key", "is_active")
VALUES
	(
		'first_quest_completed',
		'first_quest_completed',
		'First Quest Completed',
		'Completed your first quest',
		'quest',
		'badges/first-quest.svg',
		true
	),
	(
		'first_referral_activated',
		'first_referral_activated',
		'First Referral Activated',
		'Activated your first successful referral',
		'referral',
		'badges/first-referral.svg',
		true
	),
	(
		'first_space_post',
		'first_space_post',
		'First Space Post',
		'Published your first Space post',
		'space',
		'badges/first-space-post.svg',
		true
	)
ON CONFLICT ("code") DO NOTHING;
