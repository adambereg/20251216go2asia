# RF OpenAPI / SDK Vocabulary Reconciliation v1

Date: 2026-05-18
Status: `DOCS_FIRST_RECONCILIATION_REVIEWED_PLANNING_PASS`
Stage: `Stage 7.6 / OpenAPI and SDK Lifecycle Vocabulary Reconciliation`
Mode: docs-first API/SDK contract reconciliation, no implementation, no OpenAPI changes, no SDK regeneration, no backend rewrite, no frontend rewrite, no schema changes, no migrations, no tests added, no runtime execution, no staging evidence collection, no API calls, no DB access, no diagnostics retrieval, no log retrieval, no config changes, no feature flag changes, no deployment, no runtime activation, no Points enforcement activation, no token/G2A/NFT/wallet activation, no payout/settlement/cashback activation, no Slice 16 movement

Primary SSOT input:

- `docs/architecture/domain/rf_voucher_lifecycle_contract_consolidation_v1.md`

Supporting Stage 7 inputs:

- `docs/runtime/stage_7_2_governance_freeze_closure_v1.md`
- `docs/roadmaps/stage_7_3_module_alignment_reentry_plan_v1.md`
- `docs/architecture/domain/rf_voucher_lifecycle_baseline_v1.md`

Contract-awareness inputs:

- `docs/openapi/rf.yaml`
- `apps/rf-service/src/routes/rf.ts`
- `apps/rf-service/src/store.ts`
- `packages/sdk/src/rf.ts`
- `packages/sdk/src/generated/`
- `apps/go2asia-pwa-shell/lib/connectRfProjection.ts`
- `apps/go2asia-pwa-shell/lib/rfVoucherLifecycle.ts`
- `apps/go2asia-pwa-shell/lib/rfSpendSemantics.ts`
- `apps/go2asia-pwa-shell/lib/rfProAttribution.ts`

## 1. Purpose

This document reconciles RF lifecycle vocabulary across Stage 7.5 vocabulary consolidation, OpenAPI schemas, generated SDK types, the manual RF SDK facade, runtime/store type names and frontend shared assumptions.

It exists before any OpenAPI migration, SDK regeneration, backend rewrite, frontend rewrite or enum migration.

Stage 7.6 answers:

- which RF lifecycle terms are canonical;
- which OpenAPI fields are compatibility-only;
- which SDK types depend on legacy naming;
- which frontend assumptions depend on compatibility mapping;
- which names are lifecycle, operation, projection or economy coupling;
- which fields are future deprecation candidates;
- which fields cannot be removed safely yet;
- which no-break transitional rules are required.

## 2. Scope

In scope:

- docs-only reconciliation;
- OpenAPI/runtime/SDK/frontend vocabulary comparison;
- lifecycle type matrix;
- compatibility and deprecation classification;
- no-break transitional rules;
- future migration sequencing.

The current repository uses generated RF SDK files under `packages/sdk/src/generated/`. If a future structure adds `packages/sdk/generated/`, it must follow the same reconciliation rules.

## 3. Non-Goals

This document does not:

- modify OpenAPI;
- regenerate SDK;
- change source code;
- change schema;
- add migrations;
- run tests;
- call APIs;
- query DB;
- retrieve diagnostics or logs;
- execute runtime validation;
- collect staging evidence;
- implement lifecycle consolidation;
- migrate enums;
- introduce breaking type changes;
- implement frontend changes;
- activate runtime behavior;
- activate Points enforcement;
- activate token, G2A, NFT, wallet or on-chain features;
- activate payout, settlement, cashback or commission mechanics;
- move Slice 16;
- create a new governance framework.

## 4. Authority Context

Stage 7.6 treats Stage 7.5 as the vocabulary SSOT for this reconciliation slice:

```text
Stage_7_5_consolidation: accepted_as_input_SSOT
OpenAPI_runtime_SDK_frontend: contract_awareness_inputs
implementation_authorization: false
runtime_activation: false
slice_16_status: blocked_not_triggered
```

Mandatory doctrine:

```text
Points are internal utility, not money
RF/voucher != cashback/settlement
voucher claim != payment rail
voucher redeem != partner payout
PRO attribution != commission/payout entitlement
Connect projection != lifecycle authority
Rielt listing context != RF lifecycle ownership
diagnostics != authority
evidence != rollout
projection != ledger truth
visible != spendable
available != payout
```

Core formula:

```text
soft_economy_now
ledger_later
enforcement_much_later
```

Conflict rule:

```text
Tier_1_economy_policy > Stage_7_5_consolidation > Stage_7_6_reconciliation > OpenAPI_runtime_SDK_frontend_awareness
generated_SDK_follows_OpenAPI_but_does_not_override_canon
runtime_code_awareness_does_not_equal_staging_evidence
```

## 5. Lifecycle Type Reconciliation Matrix

| Type or field | Source | Current meaning | Canonical role | Compatibility role | Frontend assumption | Deprecation candidate | Required migration note |
|---|---|---|---|---|---|---|---|
| `status` | OpenAPI `RfVoucher.status`; generated `RfVoucherStatus`; manual `RfVoucherDto.status`; runtime `VoucherStatus`; PRO query status | Legacy runtime status: `claimed`, `redeemed`, `cancelled`. | Not canonical lifecycle field. | Required compatibility field for old rows, old clients, generated SDKs and query filters. | Frontend fallback maps `claimed -> available`, `redeemed -> redeemed`, `cancelled -> cancelled`. | Candidate for long-term deprecation as primary lifecycle reader, not safe to remove. | Preserve until all clients prefer `canonicalStatus`; do not add `expired` here without explicit migration. |
| `canonicalStatus` | OpenAPI `RfVoucher.canonicalStatus`; generated/manual SDK; runtime `canonicalStatus`; frontend mapper | Primary lifecycle semantics: `available`, `locked`, `unlocked`, `redeemed`, `expired`, `cancelled`. | Canonical RF voucher lifecycle field. | Optional during transition because some rows/clients may lack it. | Frontend treats it as source of truth when present. | Not a deprecation candidate. | Future OpenAPI/SDK descriptions should call it RF voucher lifecycle, not economy/wallet status. |
| `VoucherStatus` | Runtime/store | Runtime TypeScript alias for legacy status. | Runtime compatibility type, not canonical lifecycle. | Needed for current store paths and legacy `status`. | Indirectly exposed through SDK `status`. | Candidate to rename only in future implementation. | Future code may rename to `VoucherLegacyStatus`; do not do so in Stage 7.6. |
| `VoucherCanonicalStatus` | Runtime/store | Runtime TypeScript alias for canonical lifecycle. | Canonical runtime type. | None, except optional persistence during transition. | Feeds `RfVoucherEffectiveStatus` logic. | Not a deprecation candidate. | Future implementation should keep parity with OpenAPI `RfVoucherCanonicalStatus`. |
| `RfVoucherCanonicalStatus` | OpenAPI/generated SDK/manual SDK | Public API/SDK canonical lifecycle type. | Public canonical type. | None. | Imported by frontend through `RfVoucherDto['canonicalStatus']`. | Not a deprecation candidate. | Future SDK generation must preserve values and docs alignment with Stage 7.5. |
| `VoucherClaim.status` | `docs/modules/rf_partners/data_model.md` | Legacy module-planning claim row status: `claimed`, `cancelled`, `expired`, `redeemed`. | Not canonical RF voucher lifecycle. | Legacy/product planning vocabulary only. | Should not be used by current frontend as RF lifecycle type. | Candidate for docs deprecation or mapping note. | Reconcile to RF claim attempt / voucher lifecycle split in future module docs. |
| `RfVoucherEffectiveStatus` | Frontend `rfVoucherLifecycle.ts`; Connect projection | Client-side derived lifecycle status after `canonicalStatus` fallback. | Derived reader, not owner. | Required compatibility adapter for mixed payloads. | All RF/Connect labels depend on this fallback. | Not a deprecation candidate until legacy status removed. | Keep as shared frontend adapter until API can require `canonicalStatus`. |
| `active`, `used`, `unavailable` | Connect projection groups; summary fields | Read-model buckets over RF lifecycle states. | Not lifecycle vocabulary. | Projection vocabulary. | Dashboard counters and grouping. | Projection-only forever. | Never promote to OpenAPI lifecycle enum. |
| `pendingActivation`, `repeatableAgain` | Connect projection groups | Derived UI buckets from `locked` and repeat policy. | Not lifecycle vocabulary. | Projection vocabulary. | UI labels and summaries. | Projection-only forever. | Keep separated from runtime statuses and claim guards. |

Canonical lifecycle vocabulary remains:

```text
available
locked
unlocked
redeemed
expired
cancelled
```

Legacy compatibility vocabulary remains:

```text
claimed
redeemed
cancelled
```

## 6. Canonical vs Compatibility Vocabulary

Canonical rules:

- `canonicalStatus` is the only canonical RF voucher lifecycle field.
- `status` is legacy transport/runtime compatibility.
- `RfVoucherEffectiveStatus` is a client adapter, not a new authority.
- Projection groups are UI/read-model vocabulary only.
- `economyStatus` is Points coupling vocabulary, not lifecycle vocabulary.

Compatibility rules:

- Old clients may read `status`.
- New clients must prefer `canonicalStatus` when present.
- Mixed payloads must map legacy fallback as:

```text
claimed -> available
redeemed -> redeemed
cancelled -> cancelled
```

- `expired` has no legacy `status` value. It requires `canonicalStatus`.
- `locked` and `unlocked` have no legacy `status` values. They require `canonicalStatus`.
- `status` query parameters that only support legacy values must be documented as compatibility filters.

## 7. Claim / Redeem Reconciliation

| Term or type | Source | Reconciled classification | Current drift | Transitional rule |
|---|---|---|---|---|
| `claim` | OpenAPI routes, runtime, SDK `RfClaimResponse`, module docs | Operation vocabulary. | Module docs describe older `/vouchers/:id/claim`; current OpenAPI/runtime use offer/listing claim flows. | Treat module docs as conceptual until reconciled; do not infer route migration. |
| `claimScope` | OpenAPI/runtime/SDK | Runtime contract vocabulary for uniqueness scope: `partner` or `listing`. | Domain readiness uses `scope` / `listingRef`; OpenAPI uses `claimScope` / `listingContext`. | Keep `claimScope` as wire/runtime name; add future docs crosswalk for `scope -> claimScope`. |
| `claimBlockReason` | OpenAPI/runtime/generated/manual SDK | Operation guard vocabulary. | Appears both as standalone enum and generated response nullable alias. | Do not treat as lifecycle or error severity; keep as claim operation explanation. |
| `idempotentReplay` | Claim response; Points spend response awareness; redeem idempotency path | Operation replay vocabulary. | Same term can describe claim replay and lower-level spend/redeem replay. | Always qualify layer: claim replay, Points spend replay, redeem replay. |
| `redeem` | OpenAPI/runtime/SDK/module docs | Operation vocabulary that records voucher use. | Module docs describe user code input; runtime path is partner-owner redeem. | Current wire contract is partner-owner use recording; user-code redeem is future/legacy product docs. |
| `resultStatus` | `RfVoucherRedemptionResultStatus` | Redemption attempt result: `succeeded`, `failed`, `duplicate`. | Can be confused with voucher lifecycle `status`. | Never use as voucher lifecycle; map successful result to lifecycle separately. |
| `duplicate` | Redemption result status | Idempotent/duplicate operation outcome. | May be mistaken for second use. | Label as duplicate attempt, not second redemption or second utility. |
| `repeatPolicy` / `repeatPolicySnapshot` | OpenAPI/runtime/SDK/frontend | Offer policy and claim-time voucher snapshot. | `repeatable` UI wording can look like lifecycle status. | Keep `repeat_after_redeem` as policy, not lifecycle. |

Claim/redeem rule:

```text
claim_and_redeem_are_operations
canonicalStatus_is_lifecycle
resultStatus_is_redemption_attempt_result
idempotentReplay_must_be_qualified_by_layer
```

## 8. Economy Coupling Reconciliation

| Term or type | Source | Reconciled classification | Drift or ambiguity | Transitional rule |
|---|---|---|---|---|
| `pointsCost` | OpenAPI/runtime/manual SDK/frontend offer semantics | Offer Points cost metadata. | Can read as price/payment if not qualified. | Always say internal Points utility requirement, not money/payment. |
| `pointsCostSnapshot` | OpenAPI/runtime/generated/manual SDK/frontend voucher semantics | Claim-time snapshot of offer Points cost. | Can be mistaken for balance or ledger row. | RF stores snapshot; Points owns ledger truth. |
| `pointsDebitExternalId` | OpenAPI/runtime/generated/manual SDK | Deterministic idempotency reference to Points debit. | OpenAPI says future debit idempotency while runtime/evidence docs discuss paid-spend flag. | Treat as coupling reference; future docs should update stale wording before migration. |
| `economyStatus` | OpenAPI/runtime/generated/manual SDK/frontend | RF snapshot of Points coupling processing: `not_required`, `pending`, `debited`, `debit_failed`. | OpenAPI/generated wording says field prepared without enabling spend runtime; may lag current paid-spend flag semantics. | Reconcile wording before any OpenAPI/SDK rollout; not a lifecycle status. |
| `compensation` | Economy docs/runtime evidence/diagnostics awareness | Technical correction in Points ledger. | Can sound like reward. | Always qualify as technical correction, not bonus/reward/cashback. |
| `recovery` | Runtime evidence/diagnostics | Operational recovery marker. | Can look like user lifecycle state. | Keep outside public lifecycle enum. |
| `locked` / `unlocked` | RF lifecycle and Points availability vocabulary | Ambiguous cross-domain terms. | RF voucher lock is not locked Points. | Always qualify domain: RF voucher status vs Points bucket/spendability. |
| `available` | RF lifecycle, Connect labels, Points semantics | Ambiguous availability term. | Can imply payout or universal spendability. | `available != payout`; RF available means voucher utility status only. |

Economy coupling rule:

```text
RF stores cost snapshots and coupling references
Points Service owns ledger and spend truth
economyStatus != canonicalStatus
available != payout
visible != spendable
```

## 9. OpenAPI vs Runtime Drift

| Area | OpenAPI | Runtime/store awareness | Drift classification | Required future reconciliation |
|---|---|---|---|---|
| Lifecycle enum values | `RfVoucher.status` legacy; `canonicalStatus` canonical. | `VoucherStatus`; `VoucherCanonicalStatus`. | Mostly aligned. | Rename docs/descriptions only before any future enum migration. |
| `canonicalStatus` optionality | Optional field in schema. | Optional in store/interface. | Aligned transitional state. | Do not require until legacy rows and clients are migrated. |
| `expired` lifecycle | Present only in canonical enum. | Present only in `VoucherCanonicalStatus`. | Intentional. | Clients must not rely on legacy `status` to detect expiry. |
| `locked` redeem behavior | Canonical enum exists. | Current frontend treats `locked` as barrier; redeem behavior is runtime-defined. | Needs explicit contract clarification later. | Future implementation slice should define valid transitions and redeemability. |
| `economyStatus` description | "Slice 4.1 prepares this field without enabling spend runtime." | Runtime/evidence docs know paid-spend coupling exists behind flag. | Description drift. | Update wording in future OpenAPI docs slice without changing behavior. |
| Optional enrichment descriptions | OpenAPI/generated mention "wallet read enrichment". | Stage 7.5 forbids wallet authority language. | Semantic wording drift. | Rename to "voucher display enrichment" in future OpenAPI wording. |
| Module RF API paths | Conceptual `/api/rf/vouchers/:id/claim`. | Current OpenAPI/runtime use `/v1/rf/offers/{offerId}/claim` and listing claim. | Module-doc legacy drift. | Add module docs crosswalk before implementation. |
| `scope` / `listingRef` | Domain readiness target names. | Runtime/OpenAPI use `claimScope` / `listingContext`. | Target-vs-wire drift. | Future docs should map target names to wire names. |
| PRO status filter | Legacy `status` query values. | SDK/manual query uses legacy status. | Intentional compatibility limitation. | Consider future `canonicalStatus` query only after no-break plan. |

## 10. SDK Drift

SDK sources observed:

- manual facade: `packages/sdk/src/rf.ts`;
- generated SDK: `packages/sdk/src/generated/`.

Key drift patterns:

| SDK area | Current dependency | Risk | Reconciliation rule |
|---|---|---|---|
| Manual `RfVoucherDto.status` | Hard-coded legacy union `claimed/redeemed/cancelled`. | Frontend can keep treating legacy as lifecycle if not guided. | Keep as compatibility field; all lifecycle UI must use adapter. |
| Manual `RfVoucherDto.canonicalStatus?` | Optional canonical status. | Optionality forces fallback logic. | Keep optional until API migration; document fallback as required. |
| Generated `RfVoucherStatus` | Mirrors OpenAPI legacy enum. | Generated clients may expose legacy enum prominently. | Do not delete or rename before OpenAPI deprecation cycle. |
| Generated `RfVoucherCanonicalStatus` | Mirrors OpenAPI canonical enum. | Good alignment, but description says "Economy lifecycle". | Future description should avoid conflating economy with voucher lifecycle. |
| Generated `RfVoucherEconomyStatus` | Mirrors OpenAPI economy enum and stale description. | Propagates stale OpenAPI wording into SDK. | Future OpenAPI wording reconciliation must precede regeneration. |
| Generated `RfClaimResponseClaimBlockReason` | `RfClaimBlockReason | null | null`. | Type hygiene issue from nullable generation. | Candidate for future OpenAPI/orval cleanup; not behavior change. |
| Manual `RfProAttributedVouchersQuery.status` | Uses legacy `RfVoucherDto['status']`. | No canonical filter; `expired/locked/unlocked` cannot be queried there. | Keep compatibility; future `canonicalStatus` filter needs additive plan. |
| Frontend imports `@go2asia/sdk/rf` | Uses manual facade types, not only generated files. | Manual and generated SDK may drift. | Future SDK reconciliation must decide facade vs generated source-of-truth. |

SDK rule:

```text
generated_SDK_mirrors_OpenAPI
manual_SDK_facade_must_not_silently_change_public_type_semantics
future_regeneration_requires_OpenAPI_wording_review_first
```

## 11. Frontend Vocabulary Drift

| Frontend area | Current assumption | Drift risk | Transitional rule |
|---|---|---|---|
| `getRfVoucherEffectiveStatus` | `canonicalStatus` first, legacy fallback second. | Correct but required until API guarantees canonical field. | Keep shared adapter as no-break bridge. |
| `isRfVoucherClaimBarrier` | `available`, `locked`, `unlocked` block new claim; `redeemed` blocks only once-per-scope. | Uses lifecycle statuses for claim guard UI logic. | Treat as client helper, not authoritative claim decision. |
| `getRfVoucherStatusLabel` | `rf` and `connect_projection` variants. | Labels can look canonical if copied into docs/API. | Keep as frontend labels only. |
| Connect `active` group | Groups `available`, `locked`, `unlocked`. | Active can imply usable even when `locked`. | Future UI copy should distinguish active opportunity vs currently usable. |
| Connect `pendingActivation` | Derived from `locked`. | Can be confused with Points pending/debit pending. | Label as RF voucher activation only. |
| Connect `repeatableAgain` | Derived from repeat policy and `available/unlocked`. | Can look like lifecycle status. | Projection-only forever. |
| `RfVoucherTimelineItem.type` | `claimed/redeemed/status_updated`. | Timeline event `claimed` can be confused with legacy status. | Treat as event label, not current status. |
| `rfSpendSemantics` | Uses `paid_spend_required`, `economy_enabled_free`, `free`. | Frontend economy labels may imply spend proof. | Keep as UI copy; future wording should avoid payment/balance framing. |
| PRO attribution label | `Получен через PRO`; session `shareCode` payload. | Attribution could drift into commission semantics. | UI must say provenance/context only until server-confirmed. |

Frontend rule:

```text
frontend_effectiveStatus_is_adapter_logic
projection_labels_are_not_contract_enums
frontend_copy_must_not_define_runtime_lifecycle
```

## 12. Deprecation Candidate Registry

| Term or field | Classification | Can deprecate now? | Deprecation blocker | Future path |
|---|---|---|---|---|
| `status` on `RfVoucher` | Transitional compatibility. | No. | Legacy rows, generated SDKs, existing clients and query filters. | Long-term: mark as legacy after canonical adoption evidence. |
| `claimed` as lifecycle reading | Candidate for semantic deprecation. | Partially in docs only. | Needed as legacy enum value and timeline event. | Do not use as canonical lifecycle; retain as legacy/event. |
| `VoucherClaim.status` in module docs | Docs deprecation candidate. | Yes, as module vocabulary note only. | Existing conceptual docs still reference it. | Future module docs crosswalk or replacement with claim attempt language. |
| `status` query in PRO attributed vouchers | Transitional compatibility. | No. | Existing API/SDK clients. | Additive future `canonicalStatus` query before deprecating legacy filter. |
| `RfVoucherEffectiveStatus` | Adapter required. | No. | Mixed payloads and optional `canonicalStatus`. | Remove only after API requires canonical status and old clients sunset. |
| `active/used/unavailable` | Projection-only forever. | No, not deprecation target. | User-facing Connect grouping. | Keep out of API lifecycle semantics. |
| `pendingActivation` | Projection-only forever. | No. | Needed for Connect explanation of `locked`. | Keep qualified as RF voucher activation. |
| `economyStatus` | Coupling status. | No. | RF/Points boundary needs reference state. | Rename not recommended; clarify docs. |
| OpenAPI "wallet read enrichment" descriptions | Wording deprecation candidate. | Not in Stage 7.6. | Requires OpenAPI change/regeneration. | Future docs/OpenAPI wording cleanup. |
| OpenAPI `economyStatus` stale description | Wording deprecation candidate. | Not in Stage 7.6. | Requires OpenAPI change/regeneration. | Future OpenAPI description reconciliation. |

## 13. Transitional Compatibility Rules

Rules for old clients:

- Continue exposing `status`.
- Do not add new values to legacy `status` without a breaking-change plan.
- Treat `claimed` as `available` only through documented fallback.

Rules for generated SDKs:

- Generated SDK follows OpenAPI.
- No SDK regeneration in Stage 7.6.
- Future regeneration must be preceded by OpenAPI wording review for lifecycle, economy and wallet terminology.

Rules for manual SDK facade:

- Manual `RfVoucherDto` must remain compatible with generated `RfVoucher` until a planned SDK consolidation.
- Manual facade must not silently make `canonicalStatus` required.
- Manual query types using legacy status must remain no-break.

Rules for Connect/frontend:

- Always use shared effective-status mapping instead of reading legacy `status` directly for lifecycle labels.
- Treat summary/list fallback as projection behavior, not lifecycle truth.
- Do not promote projection labels into OpenAPI/SDK enums.

Rules for legacy runtime rows:

- Absence of `canonicalStatus` must not be interpreted as error.
- Fallback mapping must remain deterministic.
- `expired`, `locked` and `unlocked` require canonical field awareness.

Rules for mixed payloads:

```text
canonicalStatus_present -> use_canonicalStatus
canonicalStatus_absent_and_status_claimed -> available
canonicalStatus_absent_and_status_redeemed -> redeemed
canonicalStatus_absent_and_status_cancelled -> cancelled
economyStatus_present -> read_as_points_coupling_only
projection_group_present -> read_as_UI_group_only
```

## 14. Runtime Evidence Status

Stage 7.6 does not collect or upgrade evidence.

| Area | Current evidence posture | Stage 7.6 interpretation |
|---|---|---|
| OpenAPI/runtime/SDK comparison | Read-only contract awareness. | Useful for drift map only. |
| RF claim/redeem | Local evidence exists from Stage 7.2; staging remains deferred. | No new validation. |
| SDK generated files | Read-only source awareness. | No regeneration or compatibility proof. |
| Frontend assumptions | Read-only source awareness. | No UI validation. |
| Points coupling | Evidence-gated, high-risk runtime boundary. | Vocabulary only; no spend activation. |
| Diagnostics/recovery | Not retrieved. | Diagnostics remain non-authority. |

No row in this document means `STAGING_RUNTIME_COLLECTED`.

## 15. Future Migration Sequencing

Recommended sequence:

1. **Stage 7.7 - Connect Projection Vocabulary Reconciliation**
   - Reconcile projection labels, stale/error/partial wording and active/usable distinctions.
   - Keep Connect read-only.

2. **Stage 7.8 - OpenAPI CanonicalStatus Adoption Strategy**
   - Prepare additive OpenAPI wording changes, legacy field descriptions and eventual canonical query candidates.
   - No enum migration without separate approval.

3. **Stage 7.9 - RF/Points Coupling Runtime Readiness**
   - Reconcile `economyStatus`, `pointsDebitExternalId`, compensation/recovery and paid spend wording.
   - Preserve Points ownership.

4. **Stage 7.10 - Rielt Listing-Scoped Voucher Contract Reconciliation**
   - Reconcile `claimScope`, `listingContext`, listing CTA and module docs.
   - Avoid booking/payment/settlement semantics.

5. **Stage 7.11 - PRO Attribution Vocabulary Reconciliation**
   - Reconcile `shareCode`, `attributionStatus`, PRO attributed list filters and provenance labels.
   - Keep attribution non-financial.

6. **Stage 7.12 - SDK / Frontend Compatibility Transition Planning**
   - Decide manual facade vs generated SDK ownership, adapter lifecycle and potential deprecation warnings.
   - No regeneration unless explicitly approved.

## 16. Forbidden Vocabulary Registry

Forbidden or high-risk vocabulary remains inherited from Stage 7.5:

| Term | Forbidden context | Safe reading |
|---|---|---|
| `cashback` | Lifecycle, SDK docs, frontend labels, Rielt CTA, PRO attribution. | Voucher utility / practical benefit. |
| `payout` | Any RF voucher or PRO attribution status. | Internal recognition or provenance where approved. |
| `settlement` | Redeem/result status or partner-facing copy. | Voucher use fact. |
| `commission` | PRO attribution, shareCode, attributed voucher lists. | Attribution provenance. |
| `earnings` | Connect, SDK descriptions, PRO summaries. | Internal Points / participation context where runtime-backed. |
| `wallet` | OpenAPI/SDK descriptions and Connect authority language. | Read-only projection / display enrichment. |
| `token`, `G2A`, `NFT asset` | Current RF lifecycle or SDK type semantics. | Future-only unless separately approved. |
| `withdrawal`, `ROI`, `investment` | All current RF/Points/PRO contexts. | No current safe replacement. |
| `balance available for payout` | Points/RF/Connect summaries. | Internal Points projection where runtime-backed. |

Future OpenAPI/SDK wording cleanup should avoid "wallet read enrichment" when the field is only human-readable voucher display enrichment.

## 17. Forbidden Areas Preserved

Stage 7.6 preserves:

- no OpenAPI modifications;
- no SDK regeneration;
- no source code changes;
- no schema changes;
- no migrations;
- no tests added;
- no runtime execution;
- no staging evidence collection;
- no API calls;
- no DB queries;
- no diagnostics retrieval;
- no implementation;
- no state-machine migration;
- no enum migration;
- no breaking type changes;
- no frontend implementation;
- no runtime activation;
- no Points enforcement activation;
- no token/G2A/NFT/wallet activation;
- no payout/settlement/cashback activation;
- no Slice 16 movement;
- no new governance frameworks.

## 18. Slice 16 Firewall Status

Slice 16 remains blocked.

```text
shadow_graph != enforcement
diagnostics != authority
evidence != rollout
projection != ledger truth
SDK_reconciliation != SDK_regeneration
OpenAPI_reconciliation != OpenAPI_migration
contract_awareness != runtime_activation
slice_16_status: blocked_not_triggered
```

## 19. Review Gate Results

This table records the Stage 7.6 internal docs-first planning-pass review posture. It is not external operational approval, not staging sign-off and not runtime activation.

| Review gate | Result | Notes |
|---|---|---|
| RF Domain Review | `PASS_DOCS_FIRST` | Lifecycle and module vocabulary drift are mapped for future reconciliation. |
| Runtime Governance Review | `PASS_DOCS_FIRST` | Canonical/compatibility/projection boundaries are explicit. |
| Architecture Review | `PASS_DOCS_FIRST` | OpenAPI, SDK, runtime and frontend ownership boundaries are preserved. |
| Backend Review | `PASS_DOCS_FIRST` | Runtime/store types were used for contract awareness only. |
| API Contract Review | `PASS_DOCS_FIRST` | OpenAPI drift is mapped without changing OpenAPI. |
| SDK Contract Review | `PASS_DOCS_FIRST` | Manual/generated SDK drift is mapped without regeneration. |
| Economy Review | `PASS_DOCS_FIRST` | Points coupling terms remain non-financial and non-ledger-owned by RF. |
| Product Semantics Review | `PASS_DOCS_FIRST` | Frontend-safe and forbidden vocabulary are preserved. |
| Frontend UX Review | `PASS_DOCS_FIRST` | Effective-status and projection assumptions are separated from lifecycle authority. |
| QA / Test Governance Review | `PASS_DOCS_ONLY` | No tests are required or added; future validation remains evidence-gated. |
| Canon Review | `PASS_DOCS_FIRST` | This artifact remains reconciliation map, not implementation authorization. |

## 20. Recommended Next Step

Recommended next step:

```text
Stage 7.7 - Connect Projection Vocabulary Reconciliation
```

Recommended execution mode:

```text
DOCS_FIRST_PROJECTION_VOCABULARY_RECONCILIATION
NO IMPLEMENTATION
NO FRONTEND_REWRITE
NO API_CALLS
NO RUNTIME_EXECUTION
```

Stage 7.6 final intended posture:

```text
stage_7_6_status: docs_first_reconciliation_reviewed_planning_pass
stage_7_5_consolidation: accepted_as_input_SSOT
OpenAPI_changes: false
SDK_regeneration: false
code_changes: false
tests_added: false
runtime_execution_status: not_executed
staging_evidence_collection: not_opened
runtime_activation: false
token_g2a_nft_wallet_activation: false
payout_settlement_cashback_activation: false
slice_16_status: blocked_not_triggered
```
