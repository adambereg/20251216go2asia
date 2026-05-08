DO $$ BEGIN
 CREATE TYPE "public"."rf_voucher_economy_recovery_state" AS ENUM('pending', 'resolved');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "rf_voucher_economy_recovery" (
  "id" text PRIMARY KEY NOT NULL,
  "voucher_id" varchar(80) NOT NULL,
  "offer_id" varchar(80) NOT NULL,
  "actor_user_id" varchar(128) NOT NULL,
  "claim_scope" "rf_voucher_claim_scope" NOT NULL,
  "scope_ref" text,
  "spend_external_id" text NOT NULL,
  "compensation_external_id" text NOT NULL,
  "correlation_id" text,
  "state" "rf_voucher_economy_recovery_state" DEFAULT 'pending' NOT NULL,
  "last_error" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  "resolved_at" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rf_voucher_economy_recovery" ADD CONSTRAINT "rf_voucher_economy_recovery_offer_id_rf_offer_id_fk"
 FOREIGN KEY ("offer_id") REFERENCES "public"."rf_offer"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 IF NOT EXISTS (
   SELECT 1
   FROM pg_constraint
   WHERE conname = 'rf_voucher_economy_recovery_actor_user_id_not_blank_check'
 ) THEN
  ALTER TABLE "rf_voucher_economy_recovery"
   ADD CONSTRAINT "rf_voucher_economy_recovery_actor_user_id_not_blank_check"
   CHECK ((length(trim("rf_voucher_economy_recovery"."actor_user_id")) > 0));
 END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 IF NOT EXISTS (
   SELECT 1
   FROM pg_constraint
   WHERE conname = 'rf_voucher_economy_recovery_spend_external_id_not_blank_check'
 ) THEN
  ALTER TABLE "rf_voucher_economy_recovery"
   ADD CONSTRAINT "rf_voucher_economy_recovery_spend_external_id_not_blank_check"
   CHECK ((length(trim("rf_voucher_economy_recovery"."spend_external_id")) > 0));
 END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 IF NOT EXISTS (
   SELECT 1
   FROM pg_constraint
   WHERE conname = 'rf_voucher_economy_recovery_compensation_external_id_not_blank_check'
 ) THEN
  ALTER TABLE "rf_voucher_economy_recovery"
   ADD CONSTRAINT "rf_voucher_economy_recovery_compensation_external_id_not_blank_check"
   CHECK ((length(trim("rf_voucher_economy_recovery"."compensation_external_id")) > 0));
 END IF;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "rf_voucher_economy_recovery_spend_external_id_unique" ON "rf_voucher_economy_recovery" USING btree ("spend_external_id");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "rf_voucher_economy_recovery_compensation_external_id_unique" ON "rf_voucher_economy_recovery" USING btree ("compensation_external_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_rf_voucher_economy_recovery_voucher_state_created_at" ON "rf_voucher_economy_recovery" USING btree ("voucher_id", "state", "created_at");
