# RF / Voucher Lifecycle Baseline v1

Date: 2026-05-18
Status: `DOCS_FIRST_BASELINE_REVIEWED_PLANNING_PASS`
Stage: `Stage 7.4 / RF Voucher Lifecycle Baseline Module Alignment`
Mode: docs-first module contract alignment, no implementation, no backend coding, no frontend coding, no OpenAPI changes, no schema changes, no migrations, no tests added, no runtime execution, no staging evidence collection, no API calls, no DB access, no diagnostics retrieval, no log retrieval, no config changes, no feature flag changes, no deployment, no runtime activation, no spend enforcement activation, no reward producer activation, no token/G2A/NFT/wallet activation, no payout/settlement/cashback activation, no Slice 16 movement

Stage 7 context:

- `docs/runtime/stage_7_2_governance_freeze_closure_v1.md`
- `docs/roadmaps/stage_7_3_module_alignment_reentry_plan_v1.md`
- `docs/runtime/rf_runtime_readiness_evidence_pack_v1.md`
- `docs/runtime/rf_claim_paid_spend_redeem_staging_evidence_v1.md`
- `docs/runtime/rf_staging_runtime_evidence_bundle_v1.md`
- `docs/runtime/rf_staging_approval_framework_v1.md`
- `docs/runtime/rf_staging_evidence_approval_packet_v1.md`

Economy and governance context:

- `docs/economy/points_policy_v1.md`
- `docs/economy/referral_network_rewards_policy_v1.md`
- `docs/economy/economy_authority_terminology_crosswalk_v1.md`
- `docs/architecture/domain/economy_scope_reentry_note_v1.md`

Platform and RF context:

- `docs/architecture/platform/go2asia_backend_services_architecture_v2.md`
- `docs/architecture/platform/go2asia_interface_architecture_v2.md`
- `docs/architecture/platform/go2asia_attribution_architecture_map_v1.md`
- `docs/architecture/domain/rf-asia-domain-readiness-v1.md`
- `docs/architecture/domain/rf-asia-implementation-sequencing-v1.md`
- `docs/modules/rf_partners/`
- `docs/economy/vouchers/rf_voucher_economy_v1.md`
- `docs/openapi/rf.yaml`
- `apps/rf-service/src/routes/rf.ts`
- `apps/rf-service/src/store.ts`
- `apps/go2asia-pwa-shell/lib/connectRfProjection.ts`
- `apps/go2asia-pwa-shell/lib/rfVoucherLifecycle.ts`
- `apps/go2asia-pwa-shell/lib/rfSpendSemantics.ts`
- `apps/go2asia-pwa-shell/lib/rfProAttribution.ts`

## 1. Purpose

This document defines the minimal RF/Voucher lifecycle baseline for module alignment after Stage 7.2 governance freeze and Stage 7.3 module re-entry planning.

It aligns:

- RF-owned partner, offer, voucher, redemption and attribution objects;
- current runtime status vocabulary and canonical lifecycle vocabulary;
- claim and redeem boundaries;
- Points coupling boundaries;
- Connect projection boundaries;
- Rielt listing boundaries;
- PRO attribution boundaries;
- frontend-safe RF/voucher wording;
- future-only extensions that must not be read as current runtime.

This is a contract-alignment artifact. It is not implementation authorization and does not reopen the Stage 7.2 staging evidence window.

## 2. Scope

In scope:

- RF/Voucher lifecycle terminology alignment;
- RF-owned vs non-owned context mapping;
- lifecycle/status vocabulary normalization;
- claim and redeem semantic boundaries;
- Points coupling boundary language;
- Connect `UserVoucherState` / RF projection guidance;
- Rielt listing context guidance;
- PRO attribution provenance guidance;
- frontend-safe wording for RF voucher surfaces;
- implementation candidate slices for future work.

The baseline is intentionally minimal. It focuses on the next stable module contract before implementation.

## 3. Non-Goals

This document does not:

- change source code;
- change OpenAPI;
- change schema;
- add migrations;
- add tests;
- execute runtime flows;
- collect staging evidence;
- call APIs;
- query DB;
- retrieve logs;
- retrieve diagnostics;
- change config or feature flags;
- deploy anything;
- activate paid spend runtime;
- activate hard Points spend enforcement;
- activate reward producers;
- activate `referral_unlock`;
- activate network accrual;
- activate token, G2A, NFT, wallet or on-chain features;
- activate payout, settlement, cashback or commission mechanics;
- move Slice 16.

This document also does not rewrite Stage 7.2 governance artifacts. Stage 7.2 remains frozen for now.

## 4. Authority Context

Current authority interpretation follows the Stage 6/7 doctrine:

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
staging_validation != activation
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

Stage 7.4 uses runtime/code context only to understand existing contract vocabulary. It does not treat source inspection as staging evidence or approval.

Conflict rule:

```text
Tier_1_economy_policy > Stage_7_4_baseline > Tier_3_legacy_target_docs
OpenAPI_and_runtime_code_are_contract_awareness_inputs_for_Stage_7_4
Stage_7_5_must_reconcile_any_detected_doc_openapi_runtime_vocabulary_mismatch
```

If this baseline conflicts with `docs/economy/vouchers/rf_voucher_economy_v1.md`, the economy crosswalk and Tier 1 policies control current interpretation. If this baseline conflicts with current OpenAPI/runtime vocabulary, Stage 7.5 must resolve the mismatch before implementation.

## 5. RF-Owned Domain Objects

| Object | Owner | Current status | Authority level | Related projections | Non-owned external references | Future-only extensions |
|---|---|---|---|---|---|---|
| `RFPartner` / Partner | RF Service | Runtime-backed baseline. Current code uses `Partner` with `status: active/archived`. | RF-owned partner/business context. | Partner display in RF and Connect voucher projections. | Atlas place/city/country references; partner owner identity. | Partner settlement, payout, financial accounting. |
| `PartnerOffer` / Offer | RF Service | Runtime-backed baseline. Current code uses `Offer` with `status: draft/active/archived`, `visibility`, `repeatPolicy`, optional `pointsCost`. | RF-owned claimable offer contract. | RF catalog and Rielt offer context display. | Rielt listing mapping, Points cost metadata. | Premium NFT/Totem gates, campaign funding, G2A eligibility. |
| `RFVoucher` | RF Service | Runtime-backed/partial lifecycle baseline. Current runtime has legacy `status` plus `canonicalStatus`. | RF-owned durable voucher object and lifecycle state. | `UserVoucherState`, Connect RF projection, partner activity summaries. | Points debit external id, Rielt listing context, PRO attribution facts. | Tokenized voucher, wallet asset, transferable NFT, settlement instrument. |
| `VoucherRedemption` | RF Service | Runtime-backed for partner redeem flow; current code inserts `rf_voucher_redemption` rows with result status. | RF-owned use/consumption fact. | Partner activity summary and diagnostics. | Partner owner actor, voucher relation. | Merchant payout, partner settlement, cashback confirmation. |
| `RFVoucherLifecycleEvent` | RF Service | Conceptual/read-model baseline only. Current lifecycle evidence is represented by voucher timestamps, status fields, redemption rows, guards and diagnostics, not a separate canonical event stream. | Future RF-owned audit/lifecycle event if introduced. | Timeline items in Connect or RF UI must remain projection. | Diagnostics may observe but not become authority. | Event bus reward producer, ledger write event, settlement event. |
| `RFVoucherClaimAttempt` | RF Service | Partial/runtime-adjacent. Current claim idempotency rows bind user + key to voucher; not exposed as user-facing object. | RF-owned claim safety/idempotency evidence. | Claim response may expose `idempotentReplay`, `claimBlockReason`, `repeatPolicy`. | Gateway actor, Rielt listing context, Points spend result. | Frontend-owned claim state or claim proof authority. |
| `RFVoucherSpendLink` | RF initiates; Points Service owns ledger | Runtime-backed behind paid-spend flag and still evidence-gated. Current fields include `pointsCostSnapshot`, `pointsDebitExternalId`, `economyStatus`, and recovery markers. | RF stores coupling/reference; Points owns debit/compensation ledger facts. | RF/Connect labels may explain Points coupling only as read-only status. | Points Service `/internal/points/spend` and `/internal/points/add`. | RF-owned ledger, payout, hard spend enforcement, token transfer. |
| `PROAttribution` | RF Service for voucher provenance | Runtime-backed/partial for voucher claim provenance. Current vocabulary includes `rf_pro_last_touch_before_claim`, `shareCode`, `confirmed/rejected/none`. | RF-owned immutable voucher provenance after successful claim where runtime-backed. | PRO attributed voucher list and Connect/RF summaries. | Public `shareCode`, PRO link, internal PRO user id. | Commission, payout entitlement, MLM/referral hierarchy, universal attribution engine. |

## 6. Non-Owned Neighboring Contexts

| Context | Owner | RF relationship | Boundary |
|---|---|---|---|
| Points ledger, balances, transactions | Points Service | RF may request internal Points spend/compensation only through approved contract. | RF must not own ledger rows, balances, available-only enforcement or payout semantics. |
| Referral graph and referral rewards | Referral Service and Points Service | RF may coexist with referral/provenance concepts. | RF is not referral reward owner and must not produce network income or MLM semantics. |
| Connect RF display | Connect UI/product projection over RF/Points facts | Connect may display read-only RF voucher summaries and projected statuses. | Connect does not claim, redeem, spend, decide spendability or become lifecycle authority. |
| Rielt listing context | Rielt owns listings; RF owns listing-scoped voucher claim/lifecycle | RF may validate a listing-to-offer mapping and store listing context snapshot. | Listing context is reference/context, not ownership transfer or booking/payment authority. |
| PRO public share context | RF for voucher attribution; future modules separately | Public `shareCode` can propose attribution for RF claim. | Public share context is not financial hierarchy and does not create commission/payout rights. |
| Gateway/service trust | API Gateway routes/authenticates | Gateway provides perimeter and service trust. | Gateway does not own RF domain logic or economy decisions. |
| Quest completion/local storage | Quest Service / future backend proof owner | Quest may reference RF vouchers as utility in future. | Quest localStorage must not be used as RF or reward authority. |

## 7. Minimal Voucher Lifecycle

Stage 7.4 normalizes the RF voucher lifecycle around the current dual vocabulary:

- legacy runtime `status`: `claimed`, `redeemed`, `cancelled`;
- canonical lifecycle `canonicalStatus`: `available`, `locked`, `unlocked`, `redeemed`, `expired`, `cancelled`.

Baseline reading:

```text
legacy claimed -> canonical available when canonicalStatus is absent
legacy redeemed -> canonical redeemed
legacy cancelled -> canonical cancelled
canonicalStatus is preferred when present
legacy status remains backward-compatible runtime status during transition
```

Minimal conceptual flow:

```text
active public offer
  -> claim accepted
  -> RFVoucher created or existing voucher returned
  -> canonical available/locked/unlocked depending on RF-owned lifecycle rules
  -> partner-owner redeem may transition redeemable voucher to redeemed
  -> expired/cancelled are terminal unavailable states
```

Contract awareness from the current RF service indicates that partner redeem accepts `available` and `unlocked`, plus legacy `claimed` fallback. This source review is not runtime evidence and must be reconciled in Stage 7.5 before implementation. `locked` exists in canonical vocabulary but must be treated as not redeemable unless a separate runtime contract says otherwise.

## 8. Voucher State Vocabulary

| State / term | Type | Meaning | Owner | Runtime status | Conceptual transitions | Forbidden interpretation | Frontend-safe label |
|---|---|---|---|---|---|---|---|
| `offer_available` | Offer availability, not voucher lifecycle | Partner offer is active/public and may be claimable. | RF Service | Runtime-backed via offer/partner status. | Can lead to claim attempt. | Not a user voucher, not spendability, not payout. | `Оффер доступен` / `Можно получить ваучер` |
| `claim_pending` | Operation state, not persisted voucher lifecycle | Claim request is in progress or awaiting server response. | RF Service / client transport | UI/operation-only unless future contract persists it. | Success creates/returns voucher; failure returns safe error. | Not entitlement, not reserved value, not Points debit proof. | `Получение обрабатывается` |
| `claimed` | Legacy runtime status | Backward-compatible status for an issued voucher. | RF Service | Runtime-backed. | Maps to canonical `available` when no canonical status exists. | Not purchase settlement; not cashback. | Prefer `Получен` or canonical label. |
| `available` | Canonical voucher lifecycle | Voucher is active/usable by RF lifecycle semantics. | RF Service | Runtime-backed/primary when present. | May transition to `redeemed`, `expired`, `cancelled`; may block repeat claim. | Available does not mean payout or universal Points spendability. | `Активен` / `Готов к использованию` |
| `locked` | Canonical voucher lifecycle | Voucher exists but is not active for use until RF-owned condition is met. | RF Service | Vocabulary exists; usage must be evidence-backed per endpoint/surface. | May transition to `unlocked`, `expired`, `cancelled`. | Not locked Points; not financial hold; not spend enforcement activation. | `Ожидает активации` |
| `unlocked` | Canonical voucher lifecycle | Voucher is usable or repeatable according to RF rules. | RF Service | Vocabulary exists; redeem path treats it as redeemable. | May transition to `redeemed`, `expired`, `cancelled`. | Not payout unlock, not token unlock. | `Можно использовать` / `Можно получить снова` where repeatable |
| `redeem_pending` | Operation state, not persisted voucher lifecycle | Partner redeem request is in progress. | RF Service / client transport | UI/operation-only unless future contract persists it. | Success creates redemption row and moves voucher to `redeemed`. | Not settlement processing; not payout approval. | `Погашение проверяется` |
| `redeemed` | Canonical and legacy terminal status | Voucher utility was recorded as used by RF partner-owner flow. | RF Service | Runtime-backed. | Terminal for the voucher instance; repeat policy may allow a new future instance. | Not merchant payout, settlement, cashback or payment confirmation. | `Использован` |
| `expired` | Canonical terminal status | Voucher can no longer be used due to expiry. | RF Service | Canonical vocabulary exists; evidence status may vary by surface. | Terminal unavailable state. | Not refund, payout, or financial forfeiture. | `Истёк` / `Недоступен` in Connect |
| `cancelled` | Canonical and legacy terminal status | Voucher was cancelled/unavailable by RF lifecycle. | RF Service | Runtime-backed. | Terminal unavailable state unless a future correction contract exists. | Not chargeback, refund or payout reversal. | `Недоступен` |
| `compensation_pending` | Points/RF recovery state, not voucher lifecycle | Points spend succeeded but claim finalization or compensation requires recovery handling. | RF stores marker; Points owns ledger correction. | Runtime-adjacent/evidence-gated. | Resolve through compensation/recovery process. | Not user reward, not payout, not cashback. | `Требуется безопасная проверка` |
| `recovery_pending` | Operational recovery marker | Recovery marker remains unresolved. | RF + Points coupling | Runtime-adjacent/evidence-gated. | Resolve or remain blocker for evidence. | Not successful voucher state. | `Проверяется службой поддержки` |
| `failed` | Operation outcome, not voucher lifecycle | Claim/redeem/spend operation failed and should not create successful lifecycle fact. | Owning service for operation | Runtime error outcome, not canonical status. | May retry if contract permits. | Not hidden success, not local proof. | `Не удалось выполнить действие` |

Baseline rule:

```text
canonical voucher lifecycle states are not financial account states.
operation states are not durable voucher states unless a future RF contract promotes them.
```

## 9. Claim Boundary

Claim is the RF-owned operation that creates or returns a voucher for an active offer.

Current contract awareness:

- partner-scoped claim uses `/v1/rf/offers/{offerId}/claim`;
- listing-scoped claim uses `/v1/rf/rielt/listings/{listingId}/offers/{offerId}/claim`;
- claim requires `Idempotency-Key`;
- idempotent replay returns the same voucher for the same actor/context;
- mismatched idempotency context returns deterministic conflict;
- repeat policy may return an existing voucher or block new instance creation;
- claim may capture PRO attribution payload, but RF validates it server-side.

Claim is:

- voucher utility acquisition/reservation where runtime-backed;
- RF lifecycle mutation;
- idempotency-sensitive durable operation;
- possible Points coupling only where runtime-backed and enabled.

Claim is not:

- purchase settlement;
- cashback;
- payout;
- merchant payment;
- partner financial accounting;
- token transfer;
- NFT mint;
- Connect-owned action;
- frontend/localStorage proof.

## 10. Redeem Boundary

Redeem is the RF-owned partner-side operation that records use of voucher utility.

Current contract awareness:

- redeem endpoint is `/v1/rf/business/partners/{partnerId}/vouchers/{voucherId}/redeem`;
- authenticated actor must own the partner;
- voucher relation must match partner and offer;
- current redeem path creates a `rf_voucher_redemption` row with result `succeeded` when applied;
- already redeemed voucher returns a safe non-applied result;
- optional redeem idempotency prevents cross-voucher key reuse;
- wrong partner, cancelled, expired or non-redeemable statuses are lifecycle safety cases.

Redeem is:

- RF lifecycle transition to `redeemed`;
- durable use/consumption fact;
- partner-owner operation;
- audit/reconciliation subject.

Redeem is not:

- merchant payout;
- partner settlement;
- cashback confirmation;
- refund processing;
- payment confirmation for offline goods/services;
- proof that platform owes value to a partner or PRO.

## 11. Points Coupling Boundary

Points coupling is strictly bounded.

Rules:

- Points ledger, balances, transactions and internal debit/compensation rows belong to Points Service.
- RF may initiate a Points spend request only through an approved service contract.
- RF stores references and snapshots such as `pointsCostSnapshot`, `pointsDebitExternalId` and `economyStatus`.
- Paid claim spend uses deterministic external id shape `rf:voucher-claim-spend:<voucherId>` where runtime-backed.
- Compensation uses deterministic external id shape `rf:voucher-claim-spend-compensation:<voucherId>` where runtime-backed.
- Compensation Points are technical correction, not a user reward loop.

RF must not claim:

- direct ledger ownership;
- hard available-only spend enforcement;
- universal spendability;
- payout or withdrawal;
- token or G2A transfer;
- financial account balance.

Current evidence status:

- local existing-test evidence exists for RF/Points coupling behavior;
- live staging evidence remains deferred;
- `referral_locked`, `referral_unlock`, network accrual and hard locked-Points enforcement remain outside this Stage 7.4 baseline.

## 12. Connect Projection Boundary

Connect may display RF voucher information only as read-only projection.

Allowed:

- read RF voucher summary and voucher list;
- build `UserVoucherState` / Connect RF projection from RF-owned facts;
- show active/used/unavailable/pending activation groups;
- show safe stale/error/partial states;
- link back to RF for full details or actions.

Not allowed:

- claiming vouchers;
- redeeming vouchers;
- deciding spendability;
- mutating voucher lifecycle;
- writing Points ledger;
- treating projection counters as canonical lifecycle evidence;
- falling back to mock data as runtime truth;
- using wallet-like wording for RF vouchers.

Projection rule:

```text
RF summary/list are projection inputs for Connect.
RF Service remains lifecycle owner.
Connect remains explanatory UI.
```

Frontend-safe Connect labels:

- `read-only RF summary`;
- `read-only RF-сводка`;
- `projected voucher status`;
- `проекционный статус ваучера`;
- `active RF opportunities`;
- `активные RF-возможности`;
- `used RF vouchers`;
- `использованные RF-ваучеры`;
- `details temporarily limited`;
- `детали временно ограничены`;
- `RF owner domain`.
- `RF остаётся owner domain`.

## 13. Rielt Listing Boundary

Rielt owns listing/property context. RF owns voucher claim/lifecycle.

Allowed:

- RF can validate that an RF offer is actively mapped to a Rielt listing;
- RF can store `claimScope: listing`;
- RF can store a listing context snapshot with source `rielt`, listing id and title;
- Rielt UI can present voucher CTA as a reference to RF-owned voucher utility.

Not allowed:

- Rielt owning RF voucher lifecycle;
- RF owning the listing truth;
- listing CTA implying booking, payment, settlement, cashback or partner payout;
- listing-scoped claim creating a second source of truth for offers/listings;
- Rielt projection becoming claim/redeem authority.

Boundary formula:

```text
Rielt listing context = reference/context
RF listing-scoped voucher = RF-owned lifecycle object
```

## 14. PRO Attribution Boundary

PRO attribution is voucher provenance where runtime-backed.

Current contract awareness:

- transient public signal may use `shareCode`;
- frontend session storage may preserve a short-lived attribution payload;
- RF validates attribution server-side during claim;
- durable voucher attribution uses strategy `rf_pro_last_touch_before_claim`;
- attribution status is `none`, `confirmed` or `rejected`;
- public identity must stay separate from auth-provider/internal IDs.

PRO attribution is:

- provenance of how a voucher claim was reached;
- immutable after first successful durable claim where runtime-backed;
- read-only for PRO visibility;
- useful for future internal analytics and eligibility review.

PRO attribution is not:

- commission;
- payout entitlement;
- passive income;
- MLM hierarchy;
- partner settlement;
- financial obligation;
- universal cross-module attribution engine.

PartnerRewardPolicy remains target policy metadata unless separately implemented. It is not a settlement obligation.

## 15. Frontend Semantic Guidance

Preferred wording:

- `voucher utility`;
- `RF-ваучер`;
- `internal Points`;
- `участие`;
- `claim status`;
- `статус получения`;
- `redeem status`;
- `статус использования`;
- `voucher used`;
- `использован`;
- `pending verification`;
- `ожидает проверки`;
- `read-only summary`;
- `projected voucher status`;
- `RF остаётся owner domain`;
- `история RF-активности`;
- `практическая польза`;
- `получен через PRO` only as provenance.

Avoid:

- `cashback`;
- `payout`;
- `settlement`;
- `commission`;
- `earnings`;
- `profit`;
- `wallet`;
- `token`;
- `NFT asset`;
- `withdrawal`;
- `financial value`;
- `merchant payment`;
- `partner payout`;
- `balance`;
- `income`;
- `ROI`;
- `investment`.

Specific guidance:

- `available` in RF lifecycle should be presented as voucher availability/use readiness, not payout availability.
- `redeemed` should be presented as `used`, not settled or paid.
- Points labels must say internal Points and should avoid financial balance framing.
- PRO labels must say provenance/contribution, not commission or earnings.
- Connect labels must mention read-only/projection when summaries could look authoritative.
- Rielt CTAs must say voucher utility or RF offer, not booking/payment/settlement.

## 16. Future-Only Extensions

Future-only unless separately approved, implemented and evidence-backed:

- G2A;
- NFT/Totem;
- on-chain mint/burn/transfer;
- wallet;
- withdrawal;
- payout;
- settlement;
- cashback;
- partner financial accounting;
- universal attribution engine;
- network accrual;
- `referral_unlock`;
- hard available-only Points spend enforcement;
- reward producer activation;
- fraud enforcement engine;
- Slice 16 movement.

Tier 3/legacy vocabulary in `rf_voucher_economy_v1.md` and module docs must be read through `economy_authority_terminology_crosswalk_v1.md`.

## 17. Runtime Evidence Status

Stage 7.4 does not collect evidence.

Current evidence posture inherited from Stage 7.2:

| Area | Current status | Stage 7.4 interpretation |
|---|---|---|
| RF partner/listing claim | Local existing-test evidence; staging evidence deferred. | Contract-aware, not newly proven. |
| RF claim idempotency | Local evidence; staging replay/race evidence deferred. | Baseline includes idempotency boundary only. |
| Paid claim / Points spend | Runtime-backed behind flag; high-risk evidence still required. | Boundary only; no activation. |
| Compensation/recovery | Runtime-adjacent; evidence-gated. | Correction mechanism, not reward loop. |
| Redeem | Runtime-backed; staging evidence deferred. | Baseline includes redeem boundary only. |
| Connect projection | Read-only projection; stale/error/mock evidence still future validation concern. | Connect must remain non-authority. |
| Rielt listing scope | Runtime-backed mapping surface; live mapping evidence deferred. | Rielt remains context, RF owns voucher. |
| PRO attribution | Runtime-backed/partial provenance; forged/expired/replay evidence deferred. | Provenance, not payout. |
| Quest localStorage | Blocker for Quest reward claims. | Out of RF lifecycle authority. |

No Stage 7.4 statement should be read as `STAGING_RUNTIME_COLLECTED`.

Watch items for future slices:

- Connect stale/error/partial RF states must not fall back to mock economy truth.
- Quest localStorage/mock completion remains a blocker for Quest reward claims and must not be imported into RF evidence.
- Paid-spend and compensation paths remain evidence-gated and must not be treated as broadly activated.
- `locked` / `unlocked` canonical status usage must be reconciled across OpenAPI, SDK, backend and UI before implementation.
- Legacy module docs may still use target/financial vocabulary and must be read through the economy crosswalk.

## 18. Implementation Candidate Slices

Recommended future bounded slices:

1. **Stage 7.5 — RF Voucher Lifecycle Contract Consolidation**
   - Align OpenAPI, SDK, docs and runtime vocabulary around `status`, `canonicalStatus`, `repeatPolicy`, `claimScope`, `economyStatus` and redemption rows.
   - Do not activate new lifecycle states or premium logic without separate review.

2. **Stage 7.6 — RF ↔ Connect UserVoucherState Projection Alignment**
   - Define a read-only projection contract for Connect RF dashboard and user voucher summaries.
   - Include stale/error/partial state semantics and no mock-as-truth rule.

3. **Stage 7.7 — RF ↔ Rielt Listing-Scoped Voucher Boundary**
   - Clarify listing-offer mapping ownership, listing-scoped claim constraints and UI CTA language.
   - Avoid booking/payment/settlement expansion.

4. **Stage 7.8 — RF PRO Attribution Provenance Alignment**
   - Consolidate shareCode capture, server-side attribution confirmation, PRO-safe visibility and no-commission language.
   - Keep universal attribution engine deferred.

5. **Stage 7.9 — RF Paid Claim / Points Coupling Readiness**
   - Prepare evidence requirements and contract checks for paid claim spend without opening staging execution.
   - Preserve Points Service ledger ownership and compensation-as-correction semantics.

6. **Stage 7.10 — RF Frontend Semantic Alignment Pass**
   - Apply the baseline vocabulary to RF, Connect RF and Rielt voucher UI surfaces after contracts are stable.
   - No broad redesign and no new economy surfaces.

## 19. Forbidden Areas Preserved

Stage 7.4 preserves:

- no source code changes;
- no backend implementation;
- no frontend implementation;
- no OpenAPI changes;
- no schema changes;
- no migrations;
- no tests added;
- no runtime execution;
- no staging API calls;
- no DB queries;
- no log retrieval;
- no diagnostics retrieval;
- no config changes;
- no feature flag changes;
- no deployment;
- no runtime activation;
- no spend enforcement activation;
- no reward producer activation;
- no token/G2A/NFT/wallet activation;
- no payout/settlement/cashback activation;
- no Quest reward runtime activation;
- no Slice 16 movement;
- no new governance frameworks;
- no broad module redesign.

## 20. Slice 16 Firewall Status

Slice 16 remains blocked.

```text
shadow_graph != enforcement
diagnostics != authority
evidence != rollout
staging_validation != activation
module_contract_alignment != implementation
rf_voucher_lifecycle_baseline != runtime_activation
slice_16_status: blocked_not_triggered
```

## 21. Review Gate Results

This table records the Stage 7.4 docs-first planning-pass review posture after internal multi-agent review. It is not external operational approval, not staging sign-off and not runtime activation.

| Review gate | Result | Notes |
|---|---|---|
| RF Domain Review | `passed_for_planning` | RF-owned Partner/Offer/Voucher/Redemption/Attribution boundaries are defined. |
| Runtime Governance Review | `passed_for_planning` | Lifecycle/projection/Points boundaries are explicit; diagnostics/evidence are not authority. |
| Architecture Review | `passed_for_planning` | RF, Connect, Rielt and Points ownership boundaries are preserved. |
| Backend Review | `passed_for_planning` | Current status names and route/store vocabulary were used for contract awareness only. |
| Economy Review | `passed_for_planning` | Points remain internal utility; voucher is not cashback/settlement; attribution is not payout. |
| Product Semantics Review | `passed_for_planning` | Preferred/forbidden vocabulary is explicit. |
| Frontend UX Review | `passed_for_planning` | UI labels distinguish RF lifecycle, Connect projection and Rielt context. |
| QA / Test Governance Review | `passed_for_docs_only` | No tests required or added; future validation remains evidence-gated. |
| Canon Review | `passed_for_new_doc` | This document references existing SSOTs and does not create a new governance framework. |

## 22. Recommended Next Step

Recommended next step:

```text
Stage 7.5 - RF Voucher Lifecycle Contract Consolidation
```

Recommended execution mode:

```text
DOCS-FIRST CONTRACT CONSOLIDATION
NO IMPLEMENTATION
NO RUNTIME EXECUTION
```

Purpose of Stage 7.5:

- consolidate the lifecycle baseline across RF docs, OpenAPI/SDK terminology and implementation planning;
- decide whether optional module-level alignment note is needed under `docs/modules/rf_partners/`;
- prepare a bounded implementation candidate only after contract vocabulary is stable.

Stage 7.4 final posture:

```text
stage_7_4_status: docs_first_baseline_ready_for_review
stage_7_2_governance_layer: frozen_for_now
stage_7_3_module_reentry_plan: accepted_as_input_context
implementation_status: not_started
runtime_execution_status: not_executed
staging_evidence_collection: not_opened
runtime_activation: false
token_g2a_nft_wallet_activation: false
payout_settlement_cashback_activation: false
slice_16_status: blocked_not_triggered
```
