CREATE TABLE IF NOT EXISTS "rf_entitlement_shadow_evidence_window" (
  "window_id" text PRIMARY KEY NOT NULL,
  "environment" text NOT NULL,
  "service" text NOT NULL,
  "build_sha" varchar(40) NOT NULL,
  "status" text NOT NULL,
  "created_by" text NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "opened_at" timestamptz,
  "closed_at" timestamptz,
  "archived_at" timestamptz,
  "expired_at" timestamptz,
  "retention_until" timestamptz NOT NULL,
  "notes" text,
  "updated_at" timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT "rf_entitlement_shadow_evidence_window_environment_chk"
    CHECK ("environment" IN ('local', 'test', 'staging', 'production', 'unknown')),
  CONSTRAINT "rf_entitlement_shadow_evidence_window_service_chk"
    CHECK ("service" IN ('rf-service')),
  CONSTRAINT "rf_entitlement_shadow_evidence_window_status_chk"
    CHECK ("status" IN ('draft', 'open', 'collecting', 'rollback_pending', 'closed', 'archived', 'expired')),
  CONSTRAINT "rf_entitlement_shadow_evidence_window_build_sha_chk"
    CHECK ("build_sha" ~ '^[0-9a-f]{7,40}$'),
  CONSTRAINT "rf_entitlement_shadow_evidence_window_notes_len_chk"
    CHECK ("notes" IS NULL OR length("notes") <= 2000),
  CONSTRAINT "rf_entitlement_shadow_evidence_window_retention_chk"
    CHECK ("retention_until" > "created_at"),
  CONSTRAINT "rf_entitlement_shadow_evidence_window_opened_chk"
    CHECK ("opened_at" IS NULL OR "opened_at" >= "created_at"),
  CONSTRAINT "rf_entitlement_shadow_evidence_window_closed_chk"
    CHECK ("closed_at" IS NULL OR "opened_at" IS NOT NULL),
  CONSTRAINT "rf_entitlement_shadow_evidence_window_archived_chk"
    CHECK ("archived_at" IS NULL OR "closed_at" IS NOT NULL),
  CONSTRAINT "rf_entitlement_shadow_evidence_window_expired_chk"
    CHECK ("expired_at" IS NULL OR "closed_at" IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rf_entitlement_shadow_diagnostics_aggregate" (
  "window_id" text NOT NULL,
  "environment" text NOT NULL,
  "service" text NOT NULL,
  "build_sha" varchar(40) NOT NULL,
  "scenario" text NOT NULL,
  "canonical_drift_class" text NOT NULL,
  "legacy_drift_class" text NOT NULL,
  "reason_code_bucket" text NOT NULL,
  "source_bucket" text NOT NULL,
  "adapter_status_bucket" text NOT NULL,
  "source_type_bucket" text NOT NULL,
  "source_age_bucket" text NOT NULL,
  "source_latency_bucket" text NOT NULL,
  "decision_version" integer NOT NULL,
  "adapter_version" text NOT NULL,
  "audit_trace_present" boolean NOT NULL,
  "observation_count" bigint DEFAULT 0 NOT NULL,
  "first_seen_at" timestamptz NOT NULL,
  "last_seen_at" timestamptz NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT "rf_entitlement_shadow_diag_aggregate_pk" PRIMARY KEY (
    "window_id",
    "environment",
    "service",
    "build_sha",
    "scenario",
    "canonical_drift_class",
    "legacy_drift_class",
    "reason_code_bucket",
    "source_bucket",
    "adapter_status_bucket",
    "source_type_bucket",
    "source_age_bucket",
    "source_latency_bucket",
    "decision_version",
    "adapter_version",
    "audit_trace_present"
  ),
  CONSTRAINT "rf_entitlement_shadow_diag_aggregate_environment_chk"
    CHECK ("environment" IN ('local', 'test', 'staging', 'production', 'unknown')),
  CONSTRAINT "rf_entitlement_shadow_diag_aggregate_service_chk"
    CHECK ("service" IN ('rf-service')),
  CONSTRAINT "rf_entitlement_shadow_diag_aggregate_build_sha_chk"
    CHECK ("build_sha" ~ '^[0-9a-f]{7,40}$'),
  CONSTRAINT "rf_entitlement_shadow_diag_aggregate_scenario_chk"
    CHECK ("scenario" IN ('role_mirror', 'grant', 'deny', 'stale', 'degraded', 'source_timeout', 'source_unavailable', 'unknown_source')),
  CONSTRAINT "rf_entitlement_shadow_diag_aggregate_canonical_chk"
    CHECK ("canonical_drift_class" IN (
      'aligned_granted',
      'aligned_denied',
      'role_granted_entitlement_denied',
      'role_denied_entitlement_granted',
      'stale_entitlement',
      'unavailable_entitlement',
      'degraded_runtime',
      'unknown'
    )),
  CONSTRAINT "rf_entitlement_shadow_diag_aggregate_legacy_chk"
    CHECK ("legacy_drift_class" IN (
      'aligned_granted',
      'aligned_denied',
      'role_granted_entitlement_denied',
      'role_denied_entitlement_granted',
      'stale_shadow',
      'degraded_shadow',
      'unknown_source'
    )),
  CONSTRAINT "rf_entitlement_shadow_diag_aggregate_reason_chk"
    CHECK ("reason_code_bucket" IN (
      'entitlement_granted',
      'not_found',
      'not_started',
      'expired',
      'revoked',
      'refunded',
      'cancelled',
      'grace_not_enabled',
      'source_unavailable',
      'source_timeout',
      'policy_not_configured',
      'stale_cache',
      'identity_untrusted',
      'role_drift',
      'unknown_source'
    )),
  CONSTRAINT "rf_entitlement_shadow_diag_aggregate_source_chk"
    CHECK ("source_bucket" IN ('canonical_entitlement', 'approved_cache', 'migration_role_shadow', 'mock', 'unknown')),
  CONSTRAINT "rf_entitlement_shadow_diag_aggregate_adapter_status_chk"
    CHECK ("adapter_status_bucket" IN ('none', 'disabled', 'ok', 'stale', 'degraded', 'timeout', 'unavailable', 'unknown_source')),
  CONSTRAINT "rf_entitlement_shadow_diag_aggregate_source_type_chk"
    CHECK ("source_type_bucket" IN (
      'none',
      'canonical_entitlement_store',
      'approved_cache',
      'billing_payment',
      'billing_subscription',
      'admin_grant',
      'promo_campaign',
      'migration_import',
      'reconciliation',
      'migration_role_shadow',
      'mock',
      'unknown'
    )),
  CONSTRAINT "rf_entitlement_shadow_diag_aggregate_age_chk"
    CHECK ("source_age_bucket" IN ('none', 'fresh', 'stale', 'unknown')),
  CONSTRAINT "rf_entitlement_shadow_diag_aggregate_latency_chk"
    CHECK ("source_latency_bucket" IN ('none', 'fast', 'slow', 'timeout', 'unknown')),
  CONSTRAINT "rf_entitlement_shadow_diag_aggregate_decision_version_chk"
    CHECK ("decision_version" >= 0),
  CONSTRAINT "rf_entitlement_shadow_diag_aggregate_adapter_version_len_chk"
    CHECK (length("adapter_version") <= 128),
  CONSTRAINT "rf_entitlement_shadow_diag_aggregate_count_chk"
    CHECK ("observation_count" >= 0),
  CONSTRAINT "rf_entitlement_shadow_diag_aggregate_seen_chk"
    CHECK ("last_seen_at" >= "first_seen_at")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rf_entitlement_shadow_diagnostics_failures" (
  "window_id" text NOT NULL,
  "environment" text NOT NULL,
  "service" text NOT NULL,
  "build_sha" varchar(40) NOT NULL,
  "failure_bucket" text NOT NULL,
  "sink_mode" text NOT NULL,
  "failure_count" bigint DEFAULT 0 NOT NULL,
  "first_seen_at" timestamptz NOT NULL,
  "last_seen_at" timestamptz NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT "rf_entitlement_shadow_diag_failures_pk" PRIMARY KEY (
    "window_id",
    "environment",
    "service",
    "build_sha",
    "failure_bucket",
    "sink_mode"
  ),
  CONSTRAINT "rf_entitlement_shadow_diag_failures_environment_chk"
    CHECK ("environment" IN ('local', 'test', 'staging', 'production', 'unknown')),
  CONSTRAINT "rf_entitlement_shadow_diag_failures_service_chk"
    CHECK ("service" IN ('rf-service')),
  CONSTRAINT "rf_entitlement_shadow_diag_failures_build_sha_chk"
    CHECK ("build_sha" ~ '^[0-9a-f]{7,40}$'),
  CONSTRAINT "rf_entitlement_shadow_diag_failures_bucket_chk"
    CHECK ("failure_bucket" IN (
      'write_failed',
      'write_timeout',
      'write_dropped',
      'invalid_window',
      'closed_window',
      'disabled_sink',
      'version_mismatch',
      'unknown_failure'
    )),
  CONSTRAINT "rf_entitlement_shadow_diag_failures_sink_mode_chk"
    CHECK ("sink_mode" IN ('aggregate_db', 'queue_aggregate_db')),
  CONSTRAINT "rf_entitlement_shadow_diag_failures_count_chk"
    CHECK ("failure_count" >= 0),
  CONSTRAINT "rf_entitlement_shadow_diag_failures_seen_chk"
    CHECK ("last_seen_at" >= "first_seen_at")
);
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "rf_entitlement_shadow_diagnostics_aggregate" ADD CONSTRAINT "rf_entitlement_shadow_diag_aggregate_window_fk"
    FOREIGN KEY ("window_id") REFERENCES "public"."rf_entitlement_shadow_evidence_window"("window_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "rf_entitlement_shadow_diagnostics_failures" ADD CONSTRAINT "rf_entitlement_shadow_diag_failures_window_fk"
    FOREIGN KEY ("window_id") REFERENCES "public"."rf_entitlement_shadow_evidence_window"("window_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "rf_entitlement_shadow_window_status_idx"
  ON "rf_entitlement_shadow_evidence_window" USING btree ("status", "environment", "service");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "rf_entitlement_shadow_window_retention_idx"
  ON "rf_entitlement_shadow_evidence_window" USING btree ("retention_until", "status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "rf_entitlement_shadow_diag_aggregate_window_idx"
  ON "rf_entitlement_shadow_diagnostics_aggregate" USING btree ("window_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "rf_entitlement_shadow_diag_aggregate_canonical_idx"
  ON "rf_entitlement_shadow_diagnostics_aggregate" USING btree ("window_id", "canonical_drift_class");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "rf_entitlement_shadow_diag_aggregate_legacy_idx"
  ON "rf_entitlement_shadow_diagnostics_aggregate" USING btree ("window_id", "legacy_drift_class", "canonical_drift_class");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "rf_entitlement_shadow_diag_aggregate_build_idx"
  ON "rf_entitlement_shadow_diagnostics_aggregate" USING btree ("window_id", "environment", "service", "build_sha");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "rf_entitlement_shadow_diag_aggregate_seen_idx"
  ON "rf_entitlement_shadow_diagnostics_aggregate" USING btree ("window_id", "last_seen_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "rf_entitlement_shadow_diag_failures_window_idx"
  ON "rf_entitlement_shadow_diagnostics_failures" USING btree ("window_id");
