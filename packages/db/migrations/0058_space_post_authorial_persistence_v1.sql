-- Stage 13B.5-PI — Foundation Trio minimal persistence on space_post

ALTER TABLE "space_post"
  ADD COLUMN IF NOT EXISTS "authorial_expression_intent" boolean NOT NULL DEFAULT false;
--> statement-breakpoint

ALTER TABLE "space_post"
  ADD COLUMN IF NOT EXISTS "source_material_type" text;
--> statement-breakpoint

ALTER TABLE "space_post"
  ADD COLUMN IF NOT EXISTS "source_material_id" text;
--> statement-breakpoint

UPDATE "space_post"
SET
  "authorial_expression_intent" = false,
  "source_material_type" = NULL,
  "source_material_id" = NULL;
--> statement-breakpoint

ALTER TABLE "space_post"
  ADD CONSTRAINT "ck_space_post_pp1_authorial_text_required"
  CHECK (
    "post_type" <> 'post'
    OR "authorial_expression_intent" = false
    OR ("text" IS NOT NULL AND btrim("text") <> '')
  );
--> statement-breakpoint

ALTER TABLE "space_post"
  ADD CONSTRAINT "ck_space_post_pp2_repost_no_authorial_intent"
  CHECK ("post_type" <> 'repost' OR "authorial_expression_intent" = false);
--> statement-breakpoint

ALTER TABLE "space_post"
  ADD CONSTRAINT "ck_space_post_pp3_intent_false_implies_no_sr"
  CHECK (
    "authorial_expression_intent" = true
    OR ("source_material_type" IS NULL AND "source_material_id" IS NULL)
  );
--> statement-breakpoint

ALTER TABLE "space_post"
  ADD CONSTRAINT "ck_space_post_pp4_sr_pair_complete"
  CHECK (
    ("source_material_type" IS NULL AND "source_material_id" IS NULL)
    OR ("source_material_type" IS NOT NULL AND "source_material_id" IS NOT NULL)
  );
--> statement-breakpoint

ALTER TABLE "space_post"
  ADD CONSTRAINT "ck_space_post_pp5_authorial_no_repost_target"
  CHECK (
    "post_type" <> 'post'
    OR "authorial_expression_intent" = false
    OR ("repost_target_type" IS NULL AND "repost_target_id" IS NULL)
  );
