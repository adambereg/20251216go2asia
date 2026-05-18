# RF Voucher Lifecycle Contract Consolidation v1

Date: 2026-05-18
Status: `DOCS_FIRST_CONSOLIDATION_REVIEWED_PLANNING_PASS`
Stage: `Stage 7.5 / RF Voucher Lifecycle Contract Consolidation`
Mode: docs-first lifecycle vocabulary and contract consolidation, no implementation, no backend rewrite, no frontend rewrite, no OpenAPI changes, no SDK changes, no schema changes, no migrations, no tests added, no runtime execution, no staging evidence collection, no API calls, no DB access, no diagnostics retrieval, no log retrieval, no config changes, no feature flag changes, no deployment, no runtime activation, no Points enforcement activation, no reward producer activation, no token/G2A/NFT/wallet activation, no payout/settlement/cashback activation, no Slice 16 movement

Primary Stage 7 inputs:

- `docs/runtime/stage_7_2_governance_freeze_closure_v1.md`
- `docs/roadmaps/stage_7_3_module_alignment_reentry_plan_v1.md`
- `docs/architecture/domain/rf_voucher_lifecycle_baseline_v1.md`

Primary RF/domain inputs:

- `docs/architecture/domain/rf-asia-domain-readiness-v1.md`
- `docs/architecture/domain/rf-asia-implementation-sequencing-v1.md`
- `docs/modules/rf_partners/`
- `docs/economy/vouchers/rf_voucher_economy_v1.md`

Primary economy/governance inputs:

- `docs/economy/points_policy_v1.md`
- `docs/economy/referral_network_rewards_policy_v1.md`
- `docs/economy/economy_authority_terminology_crosswalk_v1.md`
- `docs/architecture/domain/economy_scope_reentry_note_v1.md`

Primary contract-awareness inputs:

- `docs/openapi/rf.yaml`
- `apps/rf-service/src/routes/rf.ts`
- `apps/rf-service/src/store.ts`
- `apps/go2asia-pwa-shell/lib/connectRfProjection.ts`
- `apps/go2asia-pwa-shell/lib/rfVoucherLifecycle.ts`
- `apps/go2asia-pwa-shell/lib/rfSpendSemantics.ts`
- `apps/go2asia-pwa-shell/lib/rfProAttribution.ts`

## 1. Purpose

This document consolidates RF/Voucher lifecycle vocabulary across Stage 7.4 baseline, RF domain docs, module docs, OpenAPI, runtime/store terminology and frontend projection terminology.

It exists because RF lifecycle language currently appears in several overlapping forms:

- legacy runtime `status`;
- canonical lifecycle `canonicalStatus`;
- module planning `Voucher` / `VoucherClaim` language;
- OpenAPI schema names;
- runtime/store type names;
- Connect projection group names;
- frontend-safe labels;
- Rielt listing-scoped claim vocabulary;
- PRO attribution vocabulary;
- Points coupling/economy status vocabulary.

Stage 7.5 does not implement consolidation. It defines the consolidation map that future implementation and documentation slices must follow.

## 2. Scope

In scope:

- lifecycle vocabulary reconciliation;
- canonical vs legacy terminology separation;
- projection-only label clarification;
- frontend-only wording guidance;
- claim/redeem operation terminology;
- repeat policy and claim-scope vocabulary;
- Points coupling terminology;
- Rielt listing-scoped terminology;
- PRO attribution terminology;
- forbidden vocabulary registry;
- transitional compatibility guidance;
- implementation reconciliation candidates.

## 3. Non-Goals

This document does not:

- change source code;
- change OpenAPI;
- change SDK types;
- change database schema;
- add migrations;
- run tests;
- call RF/Points APIs;
- query DB;
- retrieve diagnostics or logs;
- execute runtime validation;
- collect staging evidence;
- implement lifecycle consolidation;
- migrate state machines;
- redesign Connect/RF/Rielt UI;
- activate Points enforcement;
- activate reward producers;
- activate token, G2A, NFT, wallet or on-chain features;
- activate payout, settlement, cashback or commission mechanics;
- move Slice 16;
- create a new governance framework.

## 4. Authority Context

Stage 7.5 inherits the Stage 7.2/7.3/7.4 safety posture:

```text
Stage_7_2_governance_layer: frozen_for_now
Stage_7_3_module_reentry_plan: accepted_as_input_context
Stage_7_4_baseline: accepted_as_input_artifact
Stage_7_5_mode: docs_first_contract_consolidation
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
Tier_1_economy_policy > Stage_7_5_consolidation > Stage_7_4_baseline > Tier_3_legacy_target_docs
OpenAPI_runtime_frontend_terms_are_contract_awareness_inputs
Stage_7_6_plus_may_reconcile_implementation_artifacts_but_must_not_infer_activation
```

## 5. Lifecycle Vocabulary Matrix

| Term | Source location | Current meaning | Canonical status | Legacy compatibility status | Frontend-safe wording | Projection-safe wording | Runtime/projection/future classification | Required reconciliation |
|---|---|---|---|---|---|---|---|---|
| `claimed` | OpenAPI `RfVoucher.status`; runtime `VoucherStatus`; module docs `VoucherClaim.status`; Connect timeline item type | Legacy runtime voucher has been issued/claimed. In module docs it may also mean claim-row state. | Maps to `available` when `canonicalStatus` absent. | Legacy runtime status; allowed as compatibility field only. | `Получен` or `Ваучер получен`; avoid treating as final financial state. | Timeline event `Ваучер получен`. | Runtime-backed legacy status; projection event label. | Keep as legacy/status-event vocabulary. Do not promote to canonical lifecycle. |
| `available` | OpenAPI `RfVoucherCanonicalStatus`; runtime `VoucherCanonicalStatus`; frontend effective status | Canonical active voucher state; voucher utility is available for RF use under RF lifecycle rules. | Canonical lifecycle state. | Legacy `claimed` fallback maps here. | `Активен`, `Готов к использованию`. | `Активные возможности`, `Активные RF-ваучеры`. | Runtime-backed canonical where present; projection grouping in Connect. | Clarify that `available` is not payout and not Points spendability. |
| `locked` | OpenAPI/runtime canonical status; frontend labels; Connect projection group | Voucher exists but waits for RF-owned activation condition. | Canonical lifecycle state. | No legacy runtime equivalent. | `Получен, но не активен`. | `Ожидает активации`. | Canonical vocabulary exists; usage is runtime/evidence-dependent. | Reconcile exact backend semantics before implementation; do not confuse with locked Points. |
| `unlocked` | OpenAPI/runtime canonical status; frontend repeatable opportunity logic | Voucher is usable or repeatable according to RF rules. | Canonical lifecycle state. | No legacy runtime equivalent. | `Можно использовать` or `Можно получить снова` when repeatability context exists. | `Можно получить снова`. | Canonical vocabulary exists; redeem path treats it as redeemable. | Reconcile with repeat policy and UI labels; avoid token/payout unlock semantics. |
| `redeemed` | OpenAPI legacy and canonical status; runtime/store; redemption rows; frontend labels | Voucher utility has been recorded as used. | Canonical terminal lifecycle state. | Legacy runtime status also exists. | `Использован`. | `Использованные преимущества`, `Использованные RF-ваучеры`. | Runtime-backed. | Keep separate from `VoucherRedemption.resultStatus`; never read as settlement/payout. |
| `expired` | OpenAPI/runtime canonical status; module docs claim status; frontend labels | Voucher can no longer be used due to expiry. | Canonical terminal lifecycle state. | Module `VoucherClaim.status` has `expired`; legacy runtime `status` does not. | `Истёк` or `Недоступен`. | `Недоступен` in Connect. | Canonical vocabulary exists; runtime coverage must be verified per surface. | Reconcile module docs `VoucherClaim.expired` with `RFVoucher.canonicalStatus`. |
| `cancelled` | OpenAPI legacy and canonical status; runtime/store; module docs claim status | Voucher is cancelled/unavailable. | Canonical terminal lifecycle state. | Legacy runtime status also exists. | `Недоступен`. | `Недоступен`. | Runtime-backed. | Keep as terminal lifecycle, not refund/chargeback/payout reversal. |
| `compensation_pending` | Stage 7.4 baseline; runtime recovery/evidence docs | Points spend succeeded but correction/recovery may be required. | Not lifecycle status. | No legacy voucher status. | `Требуется безопасная проверка`. | `Проверяется службой поддержки`. | Runtime-adjacent recovery state; evidence-gated. | Keep under Points/RF recovery vocabulary, not `canonicalStatus`. |
| `recovery_pending` | Stage 7.4 baseline; RF diagnostics/recovery marker vocabulary | Operational recovery marker is unresolved. | Not lifecycle status. | No legacy voucher status. | `Проверяется`. | `Детали временно ограничены`. | Runtime-adjacent/evidence-gated. | Keep outside user lifecycle enum; use for diagnostics/support only. |
| `failed` | Operation/result status; redemption `failed`; UI operation state | Operation failed; no successful lifecycle transition should be assumed. | Not lifecycle status. | Redemption result status may be `failed`. | `Не удалось выполнить действие`. | `Временно недоступно`. | Operation/result vocabulary. | Do not encode as voucher lifecycle state. |
| `repeatable` | Frontend/user-facing concept; `repeat_after_redeem` policy | Voucher/offer can be claimed again after redeem where policy allows. | Not lifecycle status. | No legacy status. | `Повторяемый после использования`. | `Можно получить снова`. | Policy/projection vocabulary. | Keep tied to repeat policy and issue sequence, not lifecycle enum. |
| `repeat_after_redeem` | OpenAPI/runtime `RfRepeatPolicy`; store | Repeat policy allowing a new voucher instance after redeemed voucher. | Not lifecycle status. | Newer policy vocabulary. | `Повторяемый после использования`. | `Можно получить снова` when available/unlocked. | Runtime-backed policy where present. | Must not imply automatic reward or payout. |
| `claim_pending` | Stage 7.4 baseline; UI operation concept | Claim request is being processed. | Not lifecycle status. | No legacy status. | `Получение обрабатывается`. | `Загрузка статуса получения`. | Frontend/operation-only unless future contract persists it. | Keep out of OpenAPI lifecycle enums unless implementation slice approves. |
| `redeem_pending` | Stage 7.4 baseline; UI operation concept | Redeem request is being processed. | Not lifecycle status. | No legacy status. | `Погашение проверяется` / `Использование проверяется`. | `Статус использования обновляется`. | Frontend/operation-only. | Keep out of lifecycle enums; avoid settlement/payment wording. |

## 6. Canonical Lifecycle Vocabulary

Canonical RF voucher lifecycle vocabulary is:

```text
available
locked
unlocked
redeemed
expired
cancelled
```

Canonical rules:

- These terms describe RF voucher lifecycle only.
- They do not describe Points balances, payment states, partner settlement or payout.
- `canonicalStatus` is the preferred lifecycle field when present.
- `available`, `locked` and `unlocked` are active/non-terminal RF lifecycle states, but they do not imply financial availability.
- `redeemed`, `expired` and `cancelled` are terminal/unavailable states for the voucher instance.
- `redeemed` records RF voucher utility use, not partner settlement.

## 7. Legacy Compatibility Vocabulary

Legacy runtime vocabulary:

```text
claimed
redeemed
cancelled
```

Compatibility mapping:

| Legacy `status` | Canonical reading | Compatibility note |
|---|---|---|
| `claimed` | `available` | Current/legacy runtime value for issued voucher. Product copy may say `получен`; canonical lifecycle should say `available`. |
| `redeemed` | `redeemed` | Same spelling in both legacy and canonical vocabularies. |
| `cancelled` | `cancelled` | Same spelling in both legacy and canonical vocabularies. |

Module-doc compatibility vocabulary:

- `VoucherClaim.status: claimed/cancelled/expired/redeemed` in `docs/modules/rf_partners/data_model.md` is legacy/planning language.
- Stage 7.5 consolidation treats `RFVoucher.canonicalStatus` as the canonical lifecycle vocabulary for future contract work.
- `VoucherClaim` can remain a historical/module concept only if mapped to RF claim attempt / issued voucher state explicitly.

Compatibility rule:

```text
legacy status is transport/runtime compatibility
canonicalStatus is lifecycle semantics
module VoucherClaim status is legacy planning vocabulary until reconciled
```

## 8. Projection Vocabulary

Projection vocabulary is allowed in Connect/frontend read models but must not be treated as lifecycle authority.

| Projection term | Source | Meaning | Safe label | Boundary |
|---|---|---|---|---|
| `active` | Connect projection summary/group | Group of vouchers whose effective status is `available`, `locked` or `unlocked`; summary may come from RF endpoint. | `Активные возможности` | Projection group, not lifecycle enum. |
| `used` | Connect projection summary/group | Group of vouchers with effective `redeemed`. | `Использованные преимущества` / `Использованные RF-ваучеры` | Projection group over RF lifecycle facts. |
| `unavailable` | Connect projection summary/group | Group of `cancelled` and `expired`. | `Недоступные` | Projection bucket, not RF canonical state. |
| `pendingActivation` | Connect projection derived from `locked` | Vouchers waiting for activation. | `Ожидает активации` | Derived projection; must not imply Points lock or payout hold. |
| `repeatableAgain` / `repeatableAvailable` | Connect projection from `repeat_after_redeem` and effective status | User-facing repeat opportunity. | `Можно получить снова` | Repeat policy/projection, not lifecycle state. |
| `receivedViaPro` | Connect projection from confirmed attribution | Count of confirmed PRO-attributed vouchers. | `Получено через PRO` | Provenance projection, not commission/earnings. |
| `first_claim` | Connect milestone | First voucher was received. | `Первый ваучер получен` | Projection milestone, not authoritative claim record. |
| `first_used` | Connect milestone | First voucher was used/redeemed. | `Первый ваучер использован` | Projection milestone, not settlement proof. |

Projection rule:

```text
projection labels explain RF-owned facts
projection labels do not own lifecycle, spendability, attribution capture or ledger truth
```

## 9. Claim / Redeem Consolidation

Claim vocabulary:

| Term | Consolidated meaning | Classification | Required guidance |
|---|---|---|---|
| `claim` | RF operation to create or return a voucher for an offer. | Runtime operation, not lifecycle state. | Use `получить ваучер` / `claim voucher`; avoid payment/settlement language. |
| `claimScope` | Scope used for voucher uniqueness: `partner` or `listing`. | Runtime contract vocabulary. | `listing` means Rielt context, not Rielt ownership. |
| `idempotentReplay` | Same claim operation replay returned prior result without new business effect. | Operation result vocabulary. | Safe for API/client diagnostics; avoid user-facing overexposure. |
| `claimBlockReason` | Server reason why claim returned/blocked existing voucher: `existing_active_voucher`, `once_per_scope_consumed`. | Operation result vocabulary. | Use for safe UI explanation only where needed. |
| `existing_active_voucher` | User already has an active voucher in scope. | Claim guard reason. | Not a penalty or financial block. |
| `once_per_scope_consumed` | Once-per-scope voucher was already consumed/redeemed. | Claim guard reason. | Not payout exhaustion; it is repeat policy boundary. |

Redeem vocabulary:

| Term | Consolidated meaning | Classification | Required guidance |
|---|---|---|---|
| `redeem` | Partner-owner RF operation that records voucher use. | Runtime operation. | Prefer `использовать` / `отметить как использованный`. |
| `VoucherRedemption` | RF-owned use/consumption fact. | Audit/history object. | Not merchant payout, not settlement. |
| `resultStatus: succeeded` | Redemption attempt succeeded and should align with voucher `redeemed`. | Redemption result status. | Not lifecycle enum by itself. |
| `resultStatus: failed` | Redemption attempt failed. | Operation result. | Not voucher lifecycle state. |
| `resultStatus: duplicate` | Duplicate/idempotent redemption attempt. | Operation result. | Not second redeem and not second benefit. |

Consolidation rule:

```text
claim/redeem are operations
canonicalStatus is lifecycle
redemption resultStatus is operation/audit result
Points spend status is economy coupling
```

## 10. Points Coupling Consolidation

| Term | Source | Consolidated meaning | Owner | Classification | Required guidance |
|---|---|---|---|---|---|
| `pointsCost` | Offer/OpenAPI/runtime/frontend | Offer Points cost metadata. | RF stores offer metadata; Points owns actual ledger. | Runtime metadata where present. | Internal Points only, not money/payment. |
| `pointsCostSnapshot` | Voucher/OpenAPI/runtime | Claim-time snapshot of offer Points cost. | RF | RF voucher snapshot. | Explains claim context; not balance truth. |
| `pointsDebitExternalId` | Voucher/OpenAPI/runtime | Deterministic id linking voucher to Points spend. | RF stores reference; Points owns transaction. | Coupling reference. | Not ledger row itself. |
| `economyStatus: not_required` | OpenAPI/runtime/frontend | Points were not required for this voucher. | RF snapshot | Economy coupling status. | Safe label: `Points не требовались`. |
| `economyStatus: pending` | OpenAPI/runtime/frontend | Points use is associated/expected but not confirmed. | RF snapshot | Evidence-sensitive coupling state. | Safe label: `ожидает проверки`; not active spend proof. |
| `economyStatus: debited` | OpenAPI/runtime/frontend | Points spend was confirmed by Points Service for this voucher. | Points owns debit; RF stores status/reference. | Coupling status, evidence-sensitive. | Do not read as payout or settlement. |
| `economyStatus: debit_failed` | OpenAPI/runtime/frontend/diagnostics | Points spend failed or was not confirmed. | RF + Points boundary | Coupling error state. | Must not show active success without safe review. |
| `compensation` | Points policy/runtime evidence docs | Technical correction after spend/finalization failure. | Points ledger; RF recovery reference. | Correction, not reward. | Never describe as bonus, reward or cashback. |
| `recovery` | RF diagnostics/evidence docs | Operational recovery marker/state. | RF + Points coupling | Operational support/evidence state. | Not user-facing lifecycle unless safe support copy exists. |
| `locked` | RF canonical status and Points bucket language | In RF: voucher inactive until RF condition. In Points: conditional value bucket. | RF for voucher; Points for bucket. | Ambiguous term. | Always qualify: `RF voucher locked` vs `locked Points`. |
| `available` | RF canonical status and Points availability language | In RF: voucher active/usable. In Points: internal availability subject to VIP/spend rules. | RF or Points depending context. | Ambiguous term. | Always qualify; never infer payout or universal spendability. |

Points coupling rule:

```text
RF stores coupling metadata and references
Points Service owns ledger truth
visible Points != spendable Points
available != payout
RF paid claim != payment rail
```

## 11. Connect Projection Consolidation

Connect vocabulary must be projection-first.

Allowed Connect vocabulary:

- `read-only RF summary`;
- `RF-сводка`;
- `projected voucher status`;
- `проекционный статус ваучера`;
- `active RF opportunities`;
- `активные RF-возможности`;
- `used RF vouchers`;
- `использованные RF-ваучеры`;
- `RF activity`;
- `история RF-активности`;
- `details temporarily limited`;
- `детали временно ограничены`;
- `RF remains owner domain`;
- `RF остаётся owner domain`.

Connect must distinguish:

- summary endpoint counters;
- list-derived fallback counters;
- partial list details;
- stale/error states;
- local UI groupings;
- RF lifecycle authority.

Connect must not use:

- wallet authority language;
- balance/payout framing;
- claim/redeem authority labels;
- settlement/cashback wording;
- mock fallback as runtime fact.

Consolidation rule:

```text
Connect projection vocabulary may group and explain
Connect projection vocabulary must not define lifecycle
```

## 12. Rielt Vocabulary Consolidation

Rielt vocabulary must keep listing context separate from RF lifecycle.

Allowed terms:

- `listing-scoped claim`;
- `Rielt listing context`;
- `listing offer mapping`;
- `RF offer mapped to listing`;
- `voucher CTA`;
- `RF voucher utility for listing context`;
- `Источник: объект Rielt`.

Avoid:

- `Rielt voucher owner`;
- `Rielt payment`;
- `booking confirmation`;
- `listing settlement`;
- `cashback for listing`;
- `partner payout from listing`.

Consolidation rule:

```text
Rielt listing = context/reference
RF voucher = RF-owned lifecycle object
CTA = navigation/action prompt, not booking/payment/settlement
```

## 13. PRO Attribution Consolidation

PRO attribution vocabulary must remain provenance-first.

Allowed terms:

- `shareCode`;
- `public RF share code`;
- `provenance`;
- `voucher attribution`;
- `confirmed attribution`;
- `rejected attribution`;
- `received via PRO`;
- `получено через PRO`;
- `rf_pro_last_touch_before_claim`;
- `attributed voucher`;
- `read-only PRO visibility`.

Avoid:

- `commission`;
- `earnings`;
- `payout`;
- `passive income`;
- `MLM`;
- `financial hierarchy`;
- `PRO settlement`;
- `guaranteed reward`.

Attribution statuses:

| Term | Meaning | Classification |
|---|---|---|
| `none` | No confirmed/rejected attribution on voucher. | Attribution state, not lifecycle. |
| `confirmed` | RF confirmed provenance during durable claim. | Provenance status. |
| `rejected` | Attribution payload was rejected/not valid. | Provenance status. |

Consolidation rule:

```text
transient shareCode proposes attribution
RF claim confirms or rejects attribution
confirmed attribution is provenance only
provenance != commission/payout
```

## 14. Forbidden Vocabulary Registry

The following words must not appear as RF lifecycle states, Connect projection authority, Rielt CTA outcome, PRO attribution value, or user-facing financial promise:

| Forbidden term | Why forbidden | Safe replacement |
|---|---|---|
| `cashback` | Implies financial return. | `voucher utility`, `практическая польза`. |
| `payout` | Implies platform payment obligation. | `internal recognition`, `read-only summary`. |
| `settlement` | Implies merchant financial clearing. | `redeem fact`, `voucher used`. |
| `commission` | Implies PRO/partner financial entitlement. | `attribution provenance`, `contribution context`. |
| `earnings` | Implies income. | `participation value`, `internal Points`. |
| `wallet` | Implies financial account/token storage. | `Connect projection`, `RF summary`. |
| `token` | Implies external crypto/token layer. | `future layer`, `internal utility` where applicable. |
| `NFT asset` | Implies ownership/marketplace/on-chain asset. | `off-chain badge` where applicable; future-only. |
| `withdrawal` | Implies cash/token exit. | No current safe replacement; future-only. |
| `ROI` | Implies investment return. | No safe lifecycle term. |
| `investment` | Implies financial product. | `participation`, `utility`. |
| `balance available for payout` | Combines balance with payment obligation. | `internal Points projection`, `available for internal use where runtime-backed`. |
| `merchant payment` | Implies platform handles partner payment. | `partner-side voucher use`, `offline service handled by partner`. |
| `profit` | Implies income/financial gain. | `utility`, `benefit`, `preference`. |

## 15. Transitional Compatibility Guidance

Transitional compatibility is allowed only to bridge current contracts to canonical vocabulary.

Rules:

- OpenAPI/runtime may continue exposing legacy `status` for backward compatibility.
- Clients must prefer `canonicalStatus` when present.
- Frontend may use legacy fallback through shared mapper only.
- Module docs using `VoucherClaim.status` should be read as legacy/planning vocabulary until reconciled.
- Connect group names may remain projection labels but must not be copied into lifecycle enums.
- Operation states such as `claim_pending`, `redeem_pending` and `failed` must not become canonical lifecycle states without a future contract.
- Economy coupling terms such as `pending`, `debited` and `debit_failed` belong to `economyStatus`, not voucher lifecycle.
- `available`, `locked` and `unlocked` must be qualified by context because they may overlap with Points availability/lock language.

Required future reconciliation:

```text
status_vs_canonicalStatus
VoucherClaim_status_vs_RFVoucher_canonicalStatus
Connect_projection_group_names_vs_RF_lifecycle
economyStatus_vs_lifecycle_status
Rielt_listing_context_vs_claimScope
PRO_attribution_status_vs_lifecycle_status
```

## 16. Runtime Evidence Status

Stage 7.5 does not collect or upgrade evidence.

Current inherited evidence status:

| Area | Status | Stage 7.5 interpretation |
|---|---|---|
| RF claim/redeem runtime | Local existing-test evidence exists from Stage 7.2; staging deferred. | Vocabulary can be consolidated, not newly proven. |
| Paid spend / Points coupling | Runtime-backed behind flag; high-risk staging evidence missing. | Terms can be classified; no activation. |
| Compensation/recovery | Evidence-gated runtime-adjacent path. | Correction vocabulary only. |
| Connect projection | Read-only projection; stale/error/mock evidence remains future concern. | Projection labels consolidated; no authority. |
| Rielt listing scope | Runtime/context surface; live evidence deferred. | Vocabulary consolidated as context/reference. |
| PRO attribution | Runtime-backed/partial provenance; negative/replay evidence deferred. | Provenance terms consolidated; no payout. |
| Quest localStorage | Blocker for Quest reward claims. | Out of RF lifecycle, referenced as forbidden authority pattern. |

No Stage 7.5 table should be read as `STAGING_RUNTIME_COLLECTED`.

## 17. Future-Only Extensions

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

## 18. Implementation Reconciliation Candidates

Recommended future bounded slices:

1. **Stage 7.6 — OpenAPI / SDK Lifecycle Vocabulary Reconciliation**
   - Reconcile `status`, `canonicalStatus`, `RfVoucherCanonicalStatus`, `RfVoucher.status`, generated SDK names and docs.
   - No runtime migration unless separately approved.

2. **Stage 7.7 — Connect UserVoucherState Projection Reconciliation**
   - Align Connect projection labels, stale/error/partial states and summary/list fallback language with RF lifecycle vocabulary.
   - Keep Connect read-only.

3. **Stage 7.8 — Rielt Listing-Scoped Voucher Contract Reconciliation**
   - Align `claimScope: listing`, `listingContext`, Rielt mapping and CTA wording.
   - Avoid booking/payment/settlement expansion.

4. **Stage 7.9 — RF/Points Coupling Runtime Readiness**
   - Reconcile `pointsCost`, `pointsCostSnapshot`, `pointsDebitExternalId`, `economyStatus`, compensation and recovery language.
   - Preserve Points Service ledger ownership.

5. **Stage 7.10 — RF Lifecycle Frontend Semantic Consolidation**
   - Align RF/Connect/Rielt frontend labels with canonical lifecycle and projection vocabulary.
   - No broad redesign.

6. **Stage 7.11 — PRO Attribution Vocabulary Reconciliation**
   - Align `shareCode`, attribution payload, confirmed/rejected/none status and PRO-visible summaries.
   - Keep attribution as provenance.

## 19. Forbidden Areas Preserved

Stage 7.5 preserves:

- no source code changes;
- no OpenAPI changes;
- no SDK changes;
- no schema changes;
- no migrations;
- no tests added;
- no runtime execution;
- no staging evidence collection;
- no API calls;
- no DB queries;
- no diagnostics retrieval;
- no implementation;
- no state-machine implementation;
- no Points enforcement activation;
- no reward producer activation;
- no token/G2A/NFT/wallet activation;
- no payout/settlement/cashback activation;
- no Connect redesign;
- no Rielt redesign;
- no Quest redesign;
- no Slice 16 movement;
- no new governance frameworks.

## 20. Slice 16 Firewall Status

Slice 16 remains blocked.

```text
shadow_graph != enforcement
diagnostics != authority
evidence != rollout
projection != ledger truth
vocabulary_consolidation != implementation
contract_consolidation != runtime_activation
slice_16_status: blocked_not_triggered
```

## 21. Review Gate Results

This table records the Stage 7.5 internal docs-first planning-pass review posture. It is not external operational approval, not staging sign-off and not runtime activation.

| Review gate | Result | Notes |
|---|---|---|
| RF Domain Review | `PASS_DOCS_FIRST` | Lifecycle vocabulary matrix and RF object terms are consolidated for future reconciliation. |
| Runtime Governance Review | `PASS_DOCS_FIRST` | Projection/lifecycle/evidence boundaries are explicit. |
| Architecture Review | `PASS_DOCS_FIRST` | RF, Connect, Rielt, Points and PRO ownership boundaries are preserved. |
| Backend Review | `PASS_DOCS_FIRST` | Runtime/store terminology was used for contract awareness only. |
| API Contract Review | `PASS_DOCS_FIRST` | OpenAPI vocabulary was mapped without changing OpenAPI. |
| Economy Review | `PASS_DOCS_FIRST` | Points and voucher terms remain non-financial. |
| Product Semantics Review | `PASS_DOCS_FIRST` | Frontend-safe and forbidden vocabulary are listed. |
| Frontend UX Review | `PASS_DOCS_FIRST` | Projection and UI labels are separated from lifecycle authority. |
| QA / Test Governance Review | `PASS_DOCS_ONLY` | No tests are required or added; future validation remains evidence-gated. |
| Canon Review | `PASS_DOCS_FIRST` | This artifact remains module contract consolidation, not a new governance framework. |

## 22. Recommended Next Step

Recommended next step:

```text
Stage 7.6 - OpenAPI / SDK Lifecycle Vocabulary Reconciliation
```

Recommended execution mode:

```text
DOCS-FIRST API/SDK CONTRACT RECONCILIATION
NO IMPLEMENTATION
NO OPENAPI CHANGE WITHOUT EXPLICIT APPROVAL
NO RUNTIME EXECUTION
```

Stage 7.5 final posture:

```text
stage_7_5_status: docs_first_consolidation_reviewed_planning_pass
stage_7_4_baseline: accepted_as_input_artifact
implementation_status: not_started
runtime_execution_status: not_executed
staging_evidence_collection: not_opened
runtime_activation: false
token_g2a_nft_wallet_activation: false
payout_settlement_cashback_activation: false
slice_16_status: blocked_not_triggered
```
