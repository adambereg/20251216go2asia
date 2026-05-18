# RF / Rielt Runtime Drift Prioritization v1

Date: 2026-05-18
Status: `DOCS_FIRST_RUNTIME_DRIFT_PRIORITIZATION_REVIEWED_PLANNING_PASS`
Stage: `Stage 7.8b / RF Rielt Runtime Drift Prioritization`
Mode: docs-first runtime drift prioritization, read-only audit with one allowed prioritization artifact, no new RF semantics, no governance recursion, no new vocabulary stage, no implementation, no OpenAPI rewrite, no SDK rewrite, no frontend redesign, no backend rewrite, no schema changes, no migrations, no tests added, no runtime execution, no staging evidence collection, no API calls, no DB access, no diagnostics retrieval, no log retrieval, no config changes, no feature flag changes, no deployment, no runtime rollout, no Points enforcement activation, no token/G2A/NFT/wallet activation, no payout/settlement/cashback activation, no unified projection layer, no unified lifecycle model, no new authority framework, no Slice 16 movement

Primary inputs:

- `docs/architecture/domain/rf_rielt_listing_scoped_voucher_implementation_contract_v1.md`
- `docs/architecture/domain/rf_voucher_lifecycle_contract_consolidation_v1.md`
- `docs/architecture/domain/rf_openapi_sdk_vocabulary_reconciliation_v1.md`
- `docs/architecture/domain/connect_projection_vocabulary_reconciliation_v1.md`
- `docs/runtime/stage_7_2_governance_freeze_closure_v1.md`
- `docs/roadmaps/stage_7_3_module_alignment_reentry_plan_v1.md`
- `docs/openapi/rf.yaml`
- `apps/rf-service/src/routes/rf.ts`
- `apps/rf-service/src/store.ts`
- `packages/sdk/src/rf.ts`

## Purpose

This document prioritizes known RF/Rielt runtime, DTO and UX drifts after Stage 7.8.

It does not align vocabulary again. It does not design new architecture. It ranks the existing drifts so the next implementation slices happen in the right order.

The target decision is pragmatic:

```text
fix dangerous semantic leaks and runtime inconsistencies before cosmetic wording
fix authority ambiguity before wider RF/Rielt integration
keep bounded changes bounded
```

## Non-goals

This document does not:

- introduce new RF lifecycle semantics;
- introduce new Rielt lifecycle semantics;
- create a governance framework;
- create a unified lifecycle model;
- create a global projection layer;
- create a new authority framework;
- rewrite OpenAPI;
- rewrite SDK;
- redesign frontend;
- implement backend fixes;
- add tests;
- run tests;
- run API calls;
- query DB;
- retrieve diagnostics/logs;
- collect staging evidence;
- approve runtime rollout;
- activate Points enforcement;
- activate token, G2A, NFT, wallet, payout, settlement, cashback or commission mechanics.

## Reviewed Surfaces

| Surface | Review posture | Relevance |
|---|---|---|
| Stage 7.8 RF/Rielt contract | Docs-first contract awareness. | Defines RF owns voucher lifecycle, Rielt owns listing context. |
| Stage 7.5 consolidation | Docs-first semantic contract. | Defines Rielt listing context, forbidden coupling and transitional compatibility. |
| Stage 7.6 OpenAPI/SDK reconciliation | Docs-first API/SDK awareness. | Defines manual SDK/generator/runtime drift and compatibility rules. |
| Stage 7.7 Connect projection reconciliation | Docs-first projection awareness. | Defines projection vs authority, stale/error/partial and Rielt CTA risks. |
| Stage 7.2 freeze | Governance freeze awareness only. | Keeps evidence/staging deferred and prevents governance recursion. |
| Stage 7.3 re-entry | Module re-entry awareness only. | Requires bounded module work before runtime expansion. |
| RF OpenAPI | Read-only wire-contract awareness. | Shows listing offer context, claim route, voucher fields and DTO descriptions. |
| RF service routes/store | Read-only implementation awareness. | Shows listing offer read, listing claim, points cost, redeemability and idempotency behavior. |
| Manual RF SDK facade | Read-only frontend-contract awareness. | Shows optional canonical/listing fields and listing claim helpers. |
| Current Rielt/RF frontend surfaces | Read-only implementation awareness. | Shows local CTA handling and absence of a dedicated CTA projection adapter. |

## Drift Classification Methodology

Bounded categories:

| Category | Meaning | Action posture |
|---|---|---|
| `cosmetic` | Wording or naming polish with low risk of incorrect behavior. | Defer unless touching the file anyway. |
| `low-risk` | Mild inconsistency; unlikely to mislead runtime or authority decisions. | Defer or batch into related slice. |
| `medium-risk` | Can mislead UX or implementation assumptions but does not by itself corrupt runtime truth. | Fix after dangerous/blocking items. |
| `dangerous` | Likely to create wrong user/developer interpretation of authority, economy, claimability or lifecycle. | Fix before wider RF/Rielt integration. |
| `implementation-blocking` | Blocks a safe next implementation slice or makes expected behavior unverifiable. | Fix or explicitly gate before that slice. |

Assessment dimensions:

- runtime risk;
- UX risk;
- authority risk;
- economy risk;
- likelihood of semantic misunderstanding;
- implementation complexity;
- whether it blocks next implementation slices.

## Drift Inventory

| Drift | Category | Severity | Runtime risk | UX risk | Authority risk | Economy risk | Misunderstanding likelihood | Complexity | Blocks next slices? |
|---|---|---|---|---|---|---|---|---|---|
| `availability: 'available'` on `RfRieltListingOffer` | implementation-blocking | dangerous | Medium | High | High | Medium | High | Low/Medium | Blocks wider listing CTA integration. |
| Listing offer `pointsCost` can read as `0` while listing claim uses actual offer cost | implementation-blocking | dangerous | Medium/High | High | Medium | High | High | Low | Blocks trustworthy listing claim UX and paid-claim copy. |
| Missing dedicated CTA projection adapter | implementation-blocking | dangerous | Low/Medium | High | High | Medium | High | Medium | Blocks scalable RF/Rielt UI integration. |
| Claimability ambiguity | implementation-blocking | dangerous | Medium | High | High | Medium/High | High | Medium | Blocks CTA expansion beyond current narrow surface. |
| Listing offer vs voucher lifecycle ambiguity | implementation-blocking | dangerous | Medium | High | High | Medium | High | Medium | Blocks wider RF/Rielt integration. |
| Redeemability ambiguity | medium-risk | medium-risk | Medium | Medium | Medium | Low/Medium | Medium | Low/Medium | Does not block listing claim, blocks redeem-facing UX. |
| Manual SDK optionality drift | medium-risk | medium-risk | Low/Medium | Medium | Medium | Low | Medium | Medium | Blocks type-tightening, not current UI. |
| OpenAPI/runtime/manual SDK divergence | medium-risk | medium-risk | Low/Medium | Medium | Medium | Low/Medium | Medium | Medium | Blocks SDK regeneration or API cleanup. |
| Projection vs authority ambiguity | implementation-blocking | dangerous | Low/Medium | High | High | Medium | High | Medium | Blocks broader Connect/Rielt projection usage. |
| Rielt booking/inquiry wording leakage | medium-risk | medium-risk | Low | High | Medium | Medium | High | Low/Medium | Blocks copy-sensitive RF/Rielt CTA rollout. |
| Public listing offer enumeration risk | medium-risk | medium-risk | Low/Medium | Low | Low/Medium | Low | Low/Medium | Medium | Does not block Stage 7.10 adapter; should be security-reviewed before live expansion. |
| Stage numbering drift around Rielt/OpenAPI/PRO slices | low-risk | low-risk | None | Low | Low | None | Medium | Low | Does not block runtime slice if Stage 7.8b names its target clearly. |
| Mixed RU/EN/internal terms around projection/adapter/runtime | cosmetic | cosmetic | None | Low/Medium | Low | Low | Medium | Low | Safe to defer to copy pass. |

## Severity Matrix

| Severity bucket | Drifts | Why |
|---|---|---|
| Dangerous | `availability`, `pointsCost`, missing CTA adapter, claimability ambiguity, listing offer vs voucher lifecycle ambiguity, projection vs authority ambiguity | These can cause users or implementers to treat mapping/display availability as voucher availability, claimability, redeemability or authority. |
| Medium-risk | redeemability ambiguity, SDK optionality, OpenAPI/runtime/manual SDK divergence, Rielt booking/inquiry wording leakage, public listing offer enumeration | These matter, but are either bounded to specific surfaces or can be guarded by adapter/copy/API follow-up. |
| Low-risk | Stage numbering drift | Confusing for documentation readers, but not runtime-affecting if current slice is explicitly named. |
| Cosmetic | Mixed UI/internal wording | Should be cleaned later, but not first-order implementation blocker. |

## Runtime-Affecting Drifts

### 1. Listing `pointsCost` drift

Current implementation awareness:

- `RfOffer` includes `pointsCost`.
- OpenAPI describes `pointsCost` as optional RF economy cost in Points.
- Listing claim context reads `o.points_cost AS offer_points_cost` for actual claim processing.
- Listing offer read context maps `toOffer(row)` but the listing offer SELECT does not include `o.points_cost`.
- As a result, listing offer display can show `pointsCost: 0` while claim processing uses the actual Points cost.

Classification:

```text
category: implementation-blocking
severity: dangerous
runtime risk: medium/high
UX risk: high
authority risk: medium
economy risk: high
complexity: low
blocks: trustworthy listing voucher CTA and any paid-claim UX
```

Why it matters:

This is not only cosmetic. It can create a visible mismatch between the listing offer display and claim outcome. If the offer is paid, the listing surface can imply a free claim while RF later applies Points-cost logic. That is an economy misunderstanding risk.

Priority:

Fix before any broader Rielt listing voucher CTA rollout.

### 2. Redeemability ambiguity

Current implementation awareness:

- `isRedeemableCanonicalStatus` allows `available` and `unlocked`.
- `locked` is not redeemable.
- Redeem failure currently uses a legacy-ish error code/message path: `RF_VOUCHER_NOT_CLAIMED` / `RF voucher is not claimable`.

Classification:

```text
category: medium-risk
severity: medium-risk
runtime risk: medium
UX risk: medium
authority risk: medium
economy risk: low/medium
complexity: low/medium
blocks: redeem-facing UX, not listing claim adapter
```

Why it matters:

The runtime check is clear enough, but the message language can blur claimability vs redeemability. It should not be first unless the next slice touches redeem-facing UX or error mapping.

Priority:

Defer behind listing display/CTA correctness unless the next implementation slice touches redeem errors.

## UX-Affecting Drifts

### 1. `availability: 'available'` semantic drift

Current implementation awareness:

- `RfRieltListingOffer.availability` is an enum with only `available`.
- Runtime listing offer read returns `availability: 'available'` for active mapped offers.
- This field describes mapped offer/display availability, not user-specific claimability and not voucher lifecycle `available`.
- `RfVoucherCanonicalStatus` also contains `available`.

Classification:

```text
category: implementation-blocking
severity: dangerous
runtime risk: medium
UX risk: high
authority risk: high
economy risk: medium
complexity: low/medium
blocks: wider RF/Rielt listing CTA integration
```

Why it matters:

The same word appears in two different layers:

```text
listing offer availability = mapped offer can be shown
voucher canonicalStatus available = RF voucher lifecycle state
claimability = RF backend may create/return voucher
redeemability = RF/partner may mark voucher used
```

Without an adapter, frontend authors will likely treat `offer.availability === 'available'` as either claimability or voucher readiness. This is the most dangerous semantic leak because it is easy to code and hard for users to notice.

Priority:

Fix the interpretation path before wider Rielt integration. A small CTA projection adapter should qualify this field rather than changing semantics in place.

### 2. Missing dedicated CTA projection adapter

Current implementation awareness:

- Current listing voucher UI composes `offers`, `fetchMyVouchers`, entitlement preview and claim result locally.
- It uses local state labels such as `Доступен`, `Получен`, `Ваучер уже получен`.
- There is no single shared adapter that converts RF listing offer + user voucher + error/stale/partial context into safe CTA states.

Classification:

```text
category: implementation-blocking
severity: dangerous
runtime risk: low/medium
UX risk: high
authority risk: high
economy risk: medium
complexity: medium
blocks: broader RF/Rielt listing CTA rollout
```

Why it matters:

Without an adapter, each surface can independently decide what `available`, `claimed`, `locked`, `unlocked`, missing voucher, error or partial means. That invites inconsistent authority claims.

Priority:

Implement after the `pointsCost` display fix and before expanding CTA placement across Rielt.

### 3. Rielt booking/inquiry wording leakage

Current implementation awareness:

- Rielt surfaces still have inquiry/message/placement language.
- Current CTAPanel already contains helpful caveats that Rielt does not confirm booking and RF offers open in RF Asia.
- The risk remains when RF voucher CTA appears close to inquiry, booking or price/deposit language.

Classification:

```text
category: medium-risk
severity: medium-risk
runtime risk: low
UX risk: high
authority risk: medium
economy risk: medium
complexity: low/medium
blocks: copy-sensitive RF/Rielt CTA rollout
```

Priority:

Address in a bounded copy patch after adapter states are stable. Do not redesign Rielt.

## Authority-Risk Drifts

### 1. Claimability ambiguity

Current implementation awareness:

- Listing offer read returns active mapped offers.
- Claim decision depends on RF backend validation: auth, idempotency, mapping, offer status, partner status, repeat policy, existing voucher, VIP/Points/economy state.
- Current `availability` field does not express these user-specific conditions.

Classification:

```text
category: implementation-blocking
severity: dangerous
runtime risk: medium
UX risk: high
authority risk: high
economy risk: medium/high
complexity: medium
blocks: claim CTA expansion
```

Priority:

Treat claimability as backend-authoritative and adapter-projected. Do not encode it as a new RF semantic in this slice.

### 2. Listing offer vs voucher lifecycle ambiguity

Current implementation awareness:

- Listing offers are mapped RF offer candidates.
- Vouchers are RF-owned durable lifecycle objects.
- `RfRieltListingOffer.availability` can be mistaken for `RfVoucherCanonicalStatus.available`.

Classification:

```text
category: implementation-blocking
severity: dangerous
runtime risk: medium
UX risk: high
authority risk: high
economy risk: medium
complexity: medium
blocks: RF/Rielt integration beyond current page
```

Priority:

Resolve via CTA projection adapter and DTO wording/copy, not via a new lifecycle model.

### 3. Projection vs authority ambiguity

Current implementation awareness:

- Connect/Rielt can display RF state.
- RF remains lifecycle owner.
- Projection labels can become pseudo-authority if reused as API values, docs contracts or runtime enums.

Classification:

```text
category: implementation-blocking
severity: dangerous
runtime risk: low/medium
UX risk: high
authority risk: high
economy risk: medium
complexity: medium
blocks: wider projection usage
```

Priority:

Adapter first, then copy patch. Do not create a global projection layer.

## Economy-Risk Drifts

### 1. `pointsCost` listing drift

This is the highest economy-risk drift.

Reason:

- If listing read shows `pointsCost: 0`, a user can reasonably interpret the voucher as free.
- Claim can still use actual `offer_points_cost`.
- This can create apparent inconsistency in internal Points utility, especially when VIP/paid-claim gating or `economyStatus` participates.

Priority:

Priority 1. It is small, concrete and blocks trustworthy UX.

### 2. Points/claim wording around CTA

Risk:

- `Получить с Points`, `paid spend`, `available`, `pending` and `activation` can sound like payment or wallet semantics.

Priority:

Priority 3 copy pass unless the next implementation slice touches paid-claim UI.

## Safe-To-Defer Drifts

| Drift | Deferral reason | Revisit trigger |
|---|---|---|
| Stage numbering drift | Current document names Stage 7.8b explicitly; not runtime-affecting. | Before publishing a consolidated Stage 7 roadmap index. |
| Mixed RU/EN/internal wording | Cosmetic unless user-facing next to RF/Rielt CTA. | During bounded copy patch. |
| Manual SDK `canonicalStatus?` optionality | Required for compatibility; not a current runtime bug. | Before SDK regeneration/type-tightening. |
| Generated/manual SDK divergence | Known Stage 7.6 issue; not blocking current adapter if treated as compatibility. | Before OpenAPI/SDK patch. |
| Redeemability error wording | Important but not first-order listing claim issue. | Before partner redeem UX/API error cleanup. |
| Public listing offer enumeration | Security/product decision; not a direct CTA semantics blocker. | Before broad public launch, scraping-sensitive rollout or indexed listing expansion. |

## Recommended Prioritization Order

### Priority 1: dangerous semantic leak and runtime inconsistency

1. **Fix listing `pointsCost` drift.**
   - Reason: concrete runtime/DTO inconsistency with economy misunderstanding risk.
   - Complexity: low.
   - Expected slice: small backend/API contract patch with regression test later.

2. **Create bounded listing voucher CTA projection adapter.**
   - Reason: prevents `availability` and lifecycle fields from being interpreted directly by each UI surface.
   - Complexity: medium.
   - Must not become global projection layer.

3. **Clarify `availability` interpretation in DTO/OpenAPI/SDK/docs as mapped-offer display availability.**
   - Reason: dangerous because field name collides with lifecycle `available`.
   - Complexity: low/medium.
   - Can be paired with adapter or DTO patch.

### Priority 2: DTO consistency and authority guardrails

4. **OpenAPI/manual SDK DTO contract patch.**
   - Focus: optionality notes, `availability` description, listingContext compatibility, error descriptions for listing claim.
   - No breaking rewrite.

5. **Claimability and redeemability wording cleanup.**
   - Focus: user/developer-facing copy and error mapping; keep backend authority unchanged.
   - Do not add new lifecycle states.

### Priority 3: copy and non-blocking cleanup

6. **Rielt CTA copy patch.**
   - Focus: avoid booking/payment/inquiry leakage near RF voucher CTA.
   - No Rielt redesign.

7. **Cosmetic/internal wording cleanup.**
   - Focus: RU/EN/internal wording, roadmap numbering notes, non-user-facing labels.

## Recommended Next Slices

1. **Stage 7.9 - RF/Rielt Listing Offer Cost and Availability DTO Patch**
   - Small bounded patch for listing `pointsCost`, `availability` description and related OpenAPI/SDK notes.
   - Does not redesign API.

2. **Stage 7.10 - Listing Voucher CTA Projection Adapter**
   - Small frontend utility that maps listing offer + user voucher + RF result/error/stale state to safe CTA states.
   - Does not redesign Rielt.

3. **Stage 7.11 - RF/Rielt Listing Claim Integration Tests**
   - Focused tests for listing offer context, non-zero `pointsCost`, listing claim, idempotency, active/inactive mapping and repeat policy.
   - Tests only after implementation patch is approved.

4. **Stage 7.12 - Rielt RF CTA Copy Guard Patch**
   - Bounded copy/component pass for booking/inquiry leakage around RF CTA.
   - No new semantics.

## Deferred / Non-Blocking Drifts

Deferred drifts:

- Stage numbering drift across earlier planning docs;
- mixed RU/EN/internal labels outside RF/Rielt CTA;
- manual SDK optionality tightening;
- generated SDK regeneration;
- public listing offer enumeration policy;
- redeemability error wording unless redeem UX is touched;
- PRO attributed vouchers `listingId` query filter;
- global Connect partial/degraded UX improvements.

These are not ignored. They are not first because they either do not block the next bounded implementation slice or require a separate product/security decision.

## Acceptance Criteria

Stage 7.8b is accepted if:

- drift inventory exists;
- dangerous drifts are separated from cosmetic drifts;
- implementation-blocking drifts are identified;
- safe-to-defer drifts are listed;
- prioritization order is pragmatic;
- no new RF semantics are introduced;
- no governance recursion is introduced;
- no runtime rollout is introduced;
- no OpenAPI rewrite is proposed;
- no SDK rewrite is proposed;
- no frontend redesign is proposed;
- no unified framework is proposed;
- no code/runtime/OpenAPI/SDK/tests/migrations/deployments are changed.

## Review Gate Results

This table records Stage 7.8b internal docs-first prioritization posture. It is not implementation approval, not staging sign-off, not runtime rollout and not a new governance gate.

| Review gate | Result | Notes |
|---|---|---|
| Requirements Review | `PASS_DOCS_FIRST` | Scope is drift prioritization only. |
| Architecture Review | `PASS_DOCS_FIRST` | Prioritizes ownership/authority risks without new architecture. |
| Backend/API Review | `PASS_DOCS_FIRST` | Runtime/DTO drifts are ranked without changes. |
| QA Review | `PASS_DOCS_ONLY` | Future tests are sequenced but not added. |
| Security / Abuse Review | `PASS_DOCS_FIRST` | Public listing offer enumeration and semantic abuse are noted without rollout. |
| Canon Review | `PASS_DOCS_FIRST` | This is stabilization/prioritization, not another alignment cycle. |

## Final Status

```text
stage_7_8b_status: docs_first_runtime_drift_prioritization_reviewed_planning_pass
new_RF_semantics: false
governance_recursion: false
implementation_status: not_started
OpenAPI_changes: false
SDK_changes: false
frontend_redesign: false
code_changes: false
tests_added: false
migrations_added: false
runtime_execution_status: not_executed
staging_evidence_collection: not_opened
runtime_rollout: false
unified_framework_proposed: false
token_g2a_nft_wallet_activation: false
payout_settlement_cashback_activation: false
slice_16_status: blocked_not_triggered
```
