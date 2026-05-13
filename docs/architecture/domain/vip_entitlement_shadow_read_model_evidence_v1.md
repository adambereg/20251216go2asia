# VIP Entitlement Runtime Authority — Shadow Read Model Evidence v1

Date: 2026-05-13  
Status: `SLICE_2_IMPLEMENTATION_EVIDENCE_PREP_SHADOW_ONLY`  
Slice: `VIP Entitlement Runtime Authority / Slice 2`  
Mode: default-off source-read adapter path, RF shadow compare evidence, no enforcement

## 1. Purpose

**TARGET:** Slice 2 prepares the first runtime-adjacent evidence path for comparing legacy RF `vip_spacer` role authority with an entitlement-shaped source read adapter decision.

**FACT:** RF paid claim outcome remains owned by the existing legacy role gate in this slice.

**FACT:** The source read adapter result is diagnostics evidence only. It cannot allow a role-denied paid claim and cannot deny a role-allowed paid claim.

**NON-GOAL:** Slice 2 does not implement canonical VIP Entitlement Authority, billing integration, subscription lifecycle, Gateway entitlement claims, Connect UI rollout, referral unlock, network rewards, Points available-only enforcement, or production entitlement enforcement.

## 2. Source Hierarchy

1. `docs/architecture/domain/vip_entitlement_runtime_authority_contract_lock_v1.md`
2. `docs/architecture/domain/vip_entitlement_source_read_adapter_contract_v1.md`
3. `docs/architecture/domain/vip_entitlement_schema_decision_contract_v1.md`
4. `docs/architecture/domain/vip_entitlement_lifecycle_contract_v1.md`
5. `docs/architecture/domain/vip_entitlement_shadow_compare_slice_v1.md`
6. Current RF runtime implementation in `apps/rf-service`

If this note conflicts with Slice 0 or Slice 1, Slice 0/1 win and this note must be corrected.

## 3. Implemented Boundary

**FACT:** Slice 2 extends the existing RF entitlement shadow compare path rather than creating a new enforcement path.

Implemented/prepared in RF:

- internal `VipEntitlementSourceReadRequest`;
- internal `VipEntitlementSourceReadResult`;
- internal `VipEntitlementDecision`;
- source type taxonomy compatible with Slice 1;
- adapter status taxonomy;
- default-off source read mode parser;
- local read-only adapter for controlled shadow evidence;
- mapping from source read result to existing RF shadow decision;
- canonical drift class mapping;
- aggregate-safe diagnostics counters for source read evidence;
- tests for no-behavior-change and diagnostics safety.

**FACT:** `apps/rf-service/src/store.ts` keeps the legacy paid claim order:

- compute `currentVipGateAllowed` from `vip_spacer`;
- record shadow evidence when enabled;
- deny non-VIP paid claim by legacy role gate;
- call Points spend only after legacy role gate allows the claim.

## 4. Feature Flags

Flags used:

- `RF_ENABLE_ENTITLEMENT_SHADOW_COMPARE`
- `RF_ENABLE_ENTITLEMENT_SHADOW_DIAGNOSTICS`
- `RF_ENTITLEMENT_SHADOW_SCENARIO`
- `RF_ENTITLEMENT_SOURCE_READ_MODE`
- `RF_ENTITLEMENT_SOURCE_READ_SCENARIO`

Default posture:

- shadow compare is off unless `RF_ENABLE_ENTITLEMENT_SHADOW_COMPARE` is enabled;
- diagnostics are off unless `RF_ENABLE_ENTITLEMENT_SHADOW_DIAGNOSTICS` is enabled;
- source read mode defaults to `disabled`;
- the only accepted source read mode for Slice 2 is `shadow_read_only`;
- no enforcement flag is introduced or enabled.

**TARGET:** `RF_ENTITLEMENT_SOURCE_READ_MODE=shadow_read_only` may only produce shadow evidence. It is not a grant source.

## 5. Drift Taxonomy

Legacy RF drift classes remain available for compatibility:

- `aligned_granted`
- `aligned_denied`
- `role_granted_entitlement_denied`
- `role_denied_entitlement_granted`
- `stale_shadow`
- `degraded_shadow`
- `unknown_source`

Slice 2 also records canonical drift classes from Slice 0/1:

- `aligned_granted`
- `aligned_denied`
- `role_granted_entitlement_denied`
- `role_denied_entitlement_granted`
- `stale_entitlement`
- `unavailable_entitlement`
- `degraded_runtime`
- `unknown`

Mapping rules:

- stale source/read result maps to `stale_entitlement`;
- source timeout/unavailable/policy not configured maps to `unavailable_entitlement`;
- degraded runtime source maps to `degraded_runtime`;
- unknown source maps to `unknown`;
- role/entitlement grant disagreements retain the canonical disagreement classes.

## 6. Safe Diagnostics

Allowed aggregate diagnostics:

- drift class counts;
- canonical drift class counts;
- safe reason code counts;
- source bucket counts;
- stale/degraded counts;
- adapter status counts;
- source type counts;
- adapter version counts;
- decision version counts;
- audit trace presence counts;
- last safe observation without runtime/entitlement boolean authority fields.

Forbidden diagnostics:

- raw JWT;
- `X-Gateway-Auth`;
- raw roles;
- raw user ids;
- emails or profile data;
- payment payloads;
- source references;
- entitlement metadata;
- wallet ledger rows;
- transaction ids;
- external ids;
- raw correlation ids;
- raw dedupe keys;
- partner settlement data;
- token, G2A, NFT, Totem, or on-chain proofs.

## 7. Behavior Invariants

**FACT:** RF claim outcome is unchanged.

Required invariants:

- adapter grant cannot allow a legacy role-denied paid claim;
- adapter denial cannot deny a legacy role-allowed paid claim;
- adapter stale/degraded/unavailable/unknown result cannot grant spend;
- adapter failure is diagnostics-only;
- Points spend request order and payload are unchanged;
- wallet response shape is unchanged;
- Connect, Gateway, Auth, Referral, and Points runtime behavior are unchanged.

## 8. Evidence Template For Slice 3

Future staging evidence window must capture:

- environment and deploy SHA/version;
- flag state and rollback flag state;
- observation window start/end;
- test command summary;
- paid claim no-behavior-change proof;
- Points spend call-count proof;
- drift summary by canonical class;
- reason/source/adapter status counters;
- stale/degraded/unavailable counts;
- forbidden-field scan result;
- safe redacted sample containing only `auditTraceId`, `decisionVersion`, `evaluatedAt`, source bucket, adapter status/version, and drift class;
- explanation and owner for every non-aligned drift class;
- go/no-go decision for enforcement readiness.

## 9. Stop Conditions

Stop and do not proceed to enforcement if:

- RF claim outcome changes;
- source read result is used as authority;
- Points spend behavior changes;
- wallet response changes;
- Connect UI changes;
- Gateway/Auth claims change;
- mock, `migration_role_shadow`, stale, degraded, unavailable, or unknown source can grant spend;
- diagnostics leak forbidden fields;
- available-only spend enforcement enters this slice;
- referral unlock or network rewards enter this slice.

## 10. Explicit Non-Goals

Slice 2 does not include:

- RF paid claim enforcement switch;
- public API shape changes;
- OpenAPI updates;
- database migrations;
- billing or subscription provider integration;
- canonical entitlement store implementation;
- production flags;
- Points available-only spend enforcement;
- referral unlock producer;
- network rewards accrual;
- Connect entitlement projection rollout;
- Gateway entitlement claims;
- Auth/Clerk role authority changes;
- tokenomics, G2A, NFT, Totem, or on-chain logic.

## 11. Final Status

`slice_status: shadow_read_model_evidence_prepared`  
`runtime_status: rf_claim_behavior_unchanged`  
`legacy_authority_status: vip_spacer_still_authoritative`  
`adapter_status: default_off_shadow_read_only`  
`diagnostics_status: aggregate_safe_only`  
`enforcement_status: not_enabled`  
`next_slice: slice_3_staging_shadow_evidence_window`
