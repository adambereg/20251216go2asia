# RF / Rielt Listing-Scoped Voucher Implementation Contract v1

Date: 2026-05-18
Status: `DOCS_FIRST_IMPLEMENTATION_CONTRACT_REVIEWED_PLANNING_PASS`
Stage: `Stage 7.8 / RF Rielt Listing-Scoped Voucher Implementation Contract Alignment`
Mode: docs-first implementation-contract alignment, read-only audit with one allowed contract artifact, no new RF semantics, no governance recursion, no frontend redesign, no frontend implementation, no OpenAPI rewrite, no SDK regeneration, no backend rewrite, no schema changes, no migrations, no tests added, no runtime execution, no staging evidence collection, no API calls, no DB access, no diagnostics retrieval, no log retrieval, no config changes, no feature flag changes, no deployment, no runtime rollout, no Points enforcement activation, no token/G2A/NFT/wallet activation, no payout/settlement/cashback activation, no Slice 16 movement

Primary inputs:

- `docs/architecture/domain/rf_voucher_lifecycle_baseline_v1.md`
- `docs/architecture/domain/rf_voucher_lifecycle_contract_consolidation_v1.md`
- `docs/architecture/domain/rf_openapi_sdk_vocabulary_reconciliation_v1.md`
- `docs/architecture/domain/connect_projection_vocabulary_reconciliation_v1.md`
- `docs/runtime/stage_7_2_governance_freeze_closure_v1.md`
- `docs/roadmaps/stage_7_3_module_alignment_reentry_plan_v1.md`

Domain and implementation awareness inputs:

- `docs/modules/rf_partners/`
- `docs/modules/rielt/`
- `docs/architecture/domain/rf-asia-domain-readiness-v1.md`
- `docs/architecture/domain/rf-asia-implementation-sequencing-v1.md`
- `docs/architecture/platform/go2asia_attribution_architecture_map_v1.md`
- `docs/architecture/platform/go2asia_interface_architecture_v2.md`
- `docs/openapi/rf.yaml`
- `apps/rf-service/src/routes/rf.ts`
- `apps/rf-service/src/store.ts`
- `packages/sdk/src/rf.ts`

## Purpose

This document aligns the practical implementation contract between RF vouchers and Rielt listing context.

Stage 7.8 is not another vocabulary stage and not a governance stage. It converts the stabilized RF lifecycle/projection vocabulary into a bounded implementation contract for listing-scoped voucher flows.

It answers:

- which domain owns which state;
- how a Rielt listing can reference RF offers without owning RF voucher lifecycle;
- how RF can create listing-scoped vouchers without owning Rielt listing lifecycle;
- which current endpoints and DTOs already support the flow;
- which implementation gaps remain;
- which small implementation slices can safely follow.

## Non-goals

This document does not:

- add new RF lifecycle semantics;
- create a new governance framework;
- implement backend changes;
- implement frontend changes;
- redesign Rielt;
- redesign RF;
- redesign Connect;
- change OpenAPI;
- regenerate SDK;
- change schemas;
- add migrations;
- run tests;
- call APIs;
- query DB;
- retrieve diagnostics or logs;
- collect staging evidence;
- activate runtime behavior;
- activate Points enforcement;
- activate token, G2A, NFT, wallet or on-chain features;
- activate payout, settlement, cashback or commission mechanics;
- move Slice 16.

This document is contract alignment only. It is not rollout approval.

## Existing Inputs Reviewed

| Area | Input | Contract relevance |
|---|---|---|
| RF lifecycle baseline | `rf_voucher_lifecycle_baseline_v1.md` | Defines RF-owned voucher lifecycle, Rielt listing boundary and frontend-safe wording. |
| RF lifecycle consolidation | `rf_voucher_lifecycle_contract_consolidation_v1.md` | Defines canonical vs legacy lifecycle, claim/redeem operation boundaries and Rielt vocabulary. |
| OpenAPI/SDK reconciliation | `rf_openapi_sdk_vocabulary_reconciliation_v1.md` | Defines `status`, `canonicalStatus`, `claimScope`, `listingContext`, SDK/manual DTO drift and compatibility rules. |
| Connect projection reconciliation | `connect_projection_vocabulary_reconciliation_v1.md` | Confirms Connect labels are projection-only and not lifecycle authority. |
| Stage 7.2 freeze | `stage_7_2_governance_freeze_closure_v1.md` | Keeps runtime evidence/staging deferred and prevents governance recursion. |
| Stage 7.3 re-entry | `stage_7_3_module_alignment_reentry_plan_v1.md` | Requires module alignment before runtime expansion. |
| RF module docs | `docs/modules/rf_partners/` | Contain legacy/conceptual RF docs; useful for product intent, not current wire authority. |
| Rielt module docs | `docs/modules/rielt/` | Contain listing/property concepts and legacy booking/inquiry language; useful for Rielt domain context, not RF lifecycle authority. |
| Attribution map | `go2asia_attribution_architecture_map_v1.md` | Confirms RF voucher attribution and Rielt inquiry attribution are separate facts. |
| Interface architecture | `go2asia_interface_architecture_v2.md` | Confirms Rielt v1 should be voucher-first CTA, not direct booking/chat/payment. |
| RF OpenAPI | `docs/openapi/rf.yaml` | Current wire contract awareness for listing-scoped offers and claims. |
| RF runtime/store | `apps/rf-service/src/routes/rf.ts`, `apps/rf-service/src/store.ts` | Current implementation awareness for listing mapping, claim scope, idempotency and diagnostics. |
| RF SDK | `packages/sdk/src/rf.ts` | Current manual frontend contract for listing offers and listing claim helpers. |

## RF Ownership

RF owns:

- `RFPartner` / partner identity used by RF offers;
- `PartnerOffer` / RF offer contract;
- RF voucher lifecycle;
- claim operation;
- listing-scoped claim validation against RF's mapping awareness;
- `claimScope`;
- `listingContext` snapshot stored on RF vouchers;
- `canonicalStatus`;
- repeat policy and issue sequence;
- redeem operation and redemption facts;
- RF voucher attribution/provenance where runtime-backed;
- RF/Points coupling references where approved and runtime-backed.

RF does not own:

- Rielt listing lifecycle;
- Rielt listing visibility outside RF's read/validation context;
- Rielt inquiry/contact/booking lifecycle;
- Rielt pricing, deposit or rental terms;
- partner payout, settlement, cashback or merchant payment;
- Connect projection authority.

RF contract rule:

```text
RF owns voucher lifecycle and listing-scoped voucher facts.
RF stores listing context as a snapshot/reference.
RF does not own the Rielt listing domain.
```

## Rielt Ownership

Rielt owns:

- listing identity;
- listing lifecycle and visibility;
- listing metadata;
- property/listing display context;
- Rielt search/discovery placement;
- listing-level CTA placement;
- future Rielt inquiry/contact flows if separately implemented.

Rielt does not own:

- RF voucher lifecycle;
- RF claim/redeem state;
- `canonicalStatus`;
- Points coupling or spendability;
- PRO attribution on RF vouchers;
- partner payout, settlement, cashback or commission;
- RF offer eligibility.

Rielt contract rule:

```text
Rielt owns listing context and CTA placement.
RF owns voucher lifecycle and claim/redeem state.
Rielt must not become voucher lifecycle authority.
```

## Shared Contract Surface

The shared RF ↔ Rielt surface is intentionally narrow.

| Contract element | Owner | Current surface | Meaning | Boundary |
|---|---|---|---|---|
| `listingId` | Rielt | Path param in RF listing routes; stored as `rielt_listing_id`; exposed in `listingContext.listingId`. | Rielt listing identity used as RF context reference. | RF may validate and snapshot; RF does not own listing lifecycle. |
| `rfOfferId` / `offerId` | RF | RF offer id in mapping and claim endpoint. | RF offer mapped to a listing. | Rielt placement does not own offer eligibility. |
| `voucherId` | RF | Returned by claim response; stored in RF voucher. | RF-owned voucher object. | Rielt must not mutate voucher state. |
| `partnerId` | RF | Offer partner, mapping partner, voucher partner. | RF partner/merchant relationship. | Partner identity does not imply Rielt payment/settlement. |
| `canonicalStatus` | RF | Voucher lifecycle status. | Canonical RF voucher state. | Rielt can display projection only. |
| `claimScope` | RF | `partner` or `listing`. | Voucher uniqueness scope. | `listing` means context, not Rielt ownership. |
| `listingContext` | RF snapshot of Rielt reference | `{ source: 'rielt', listingId, listingTitle }`. | Stored context for listing-scoped voucher. | Snapshot may become stale; Rielt remains listing truth. |
| `claimability` | RF | Derived from active mapping, public/active offer, active partner, idempotency, repeat policy and eligibility. | Whether claim may proceed by RF rules. | UI/CTA may project but backend decides. |
| `redeemability` | RF | Derived from RF voucher status and partner-owner redeem path. | Whether voucher can be marked used by partner flow. | Rielt does not redeem. |
| `CTA projection state` | Rielt UI / RF frontend adapter | UI label/state over RF listing offer and voucher state. | User guidance for action. | Projection only; not lifecycle authority. |

## Listing-Scoped Voucher Flow

Current implementation-aware flow:

1. Rielt listing page or RF listing page requests RF listing offer context.
   - Existing RF route: `GET /v1/rf/rielt/listings/{listingId}/offers`.
   - Existing SDK helper: `fetchRfRieltListingOffers(listingId)`.
   - Response includes listing summary, partner and mapped RF offers.

2. RF validates listing offer mapping on read.
   - Existing store awareness uses `rielt_listing` and `rielt_listing_rf_offer`.
   - Mapping statuses include `active` / `hidden`.
   - Public offer response exposes only mapped active RF offers.

3. User initiates listing-scoped RF claim.
   - Existing RF route: `POST /v1/rf/rielt/listings/{listingId}/offers/{offerId}/claim`.
   - Existing SDK helper: `claimRfListingOffer` / `claimRfRieltListingOffer`.
   - Request requires `Idempotency-Key`.
   - Optional attribution payload may be included.

4. RF validates listing claim context.
   - Listing must exist and be published.
   - Mapping must be active.
   - Offer must belong to mapped partner.
   - Offer must be active/public.
   - Partner must be active.

5. RF creates or returns a voucher.
   - Voucher uses `claimScope: listing`.
   - Voucher stores `rielt_listing_id` and `rielt_listing_title_snapshot`.
   - Public DTO exposes `listingContext`.
   - `canonicalStatus` remains RF lifecycle.

6. Rielt/RF UI projects CTA state.
   - UI may say voucher is available to claim, already claimed, ready to use, unavailable or temporarily limited.
   - UI must not say booking/payment/settlement/cashback/payout.

7. Redemption remains RF/partner-owned.
   - Existing RF route: `POST /v1/rf/business/partners/{partnerId}/vouchers/{voucherId}/redeem`.
   - Rielt listing context may appear in voucher usage guidance.
   - Rielt does not redeem and does not confirm payout/booking.

Flow invariant:

```text
listing-scoped claim = RF voucher claim with Rielt context
listing-scoped claim != Rielt booking
listing-scoped redeem != partner payout
```

## CTA Projection Contract

Rielt listing CTA must be a safe projection over RF-owned state.

| CTA state | Minimal input | Safe user wording | Must not imply | Owner of decision |
|---|---|---|---|---|
| `show_voucher_cta` | Listing has active mapped RF offer. | `Посмотреть RF-ваучер`; `Получить RF-ваучер`. | Booking, payment, guaranteed benefit. | RF for offer/voucher; Rielt for placement. |
| `claim_voucher` | User eligible to attempt claim by UI context; backend still validates. | `Получить ваучер в RF`. | Payment rail, cashback, settlement. | RF backend. |
| `claimed_ready_to_redeem` | User has listing-scoped voucher with `available` or `unlocked`. | `Ваучер получен`; `готов к использованию у партнёра`. | Booking confirmation, payout. | RF lifecycle. |
| `claimed_pending_activation` | User has `locked` voucher. | `Ваучер получен, ожидает RF-активации`. | Points lock, payout hold. | RF lifecycle / RF rules. |
| `redeemed_used` | Voucher `canonicalStatus: redeemed`. | `Ваучер использован`. | Partner settlement, payment complete. | RF redemption facts. |
| `unavailable` | Offer mapping hidden/inactive, partner inactive, voucher expired/cancelled, or RF says unavailable. | `RF-ваучер сейчас недоступен`. | Listing unavailable unless Rielt says so. | RF for voucher/offer; Rielt for listing. |
| `stale` | UI has old projection or uncertain sync. | `Статус RF-ваучера может обновиться`. | Lifecycle conflict. | Projection layer. |
| `partial` | Listing exists but RF details incomplete/unavailable. | `RF-детали временно ограничены`. | No offer exists as final fact. | Projection layer. |
| `error` | Transport/service error. | `Не удалось загрузить RF-предложение`. | Voucher lifecycle status. | Projection layer. |
| `no_offer` | RF returns empty mapped offers or no mapping. | `Для этого объекта пока нет RF-предложений`. | Listing value/quality judgment. | RF mapping/read contract. |
| `partner_unavailable` | RF partner inactive/unavailable. | `Партнёр RF временно недоступен`. | Rielt listing invalid. | RF partner state. |

CTA copy rule:

```text
CTA = navigation/action prompt
CTA != booking outcome
CTA != payment
CTA != cashback
CTA != payout
```

## DTO / Endpoint Alignment Notes

Current suitable surfaces:

| Surface | Current status | Useful for Stage 7.8 contract | Gap |
|---|---|---|---|
| `GET /v1/rf/rielt/listings/{listingId}/offers` | Exists in OpenAPI/runtime/SDK. | Read listing-scoped RF offer context. | Response does not include user-specific voucher/CTA state. |
| `POST /v1/rf/rielt/listings/{listingId}/offers/{offerId}/claim` | Exists in OpenAPI/runtime/SDK. | Claim listing-scoped voucher. | CTA needs separate UI adapter to interpret result and existing vouchers. |
| `GET /v1/rf/me/vouchers` | Exists. | Can identify user listing-scoped vouchers through `claimScope` and `listingContext`. | Client must join with listing/offer context; no dedicated listing CTA DTO. |
| `RfRieltListingOfferContext` | Exists. | Provides listing summary, partner and mapped offers. | Offer `availability: available` is mapping/display availability, not voucher lifecycle. |
| `RfVoucherDto.listingContext` | Exists. | Exposes `source: rielt`, `listingId`, `listingTitle`. | Manual SDK marks `claimScope`/`listingContext` optional; generated OpenAPI requires keys with nullable context. |
| `RfVoucherDto.canonicalStatus` | Exists but optional. | Needed for CTA projection. | Client must use `effectiveStatus` fallback. |
| `RfClaimResponse` | Exists. | Returns voucher, idempotent replay, block reason and repeat policy. | Does not directly return CTA state; adapter needed. |
| `redeemRfVoucher` | Exists. | Partner/business redeem path. | Rielt should not call it as listing CTA. |

Potential DTO shape for future adapter only:

```text
ListingVoucherCTAProjection
  listingId
  rfOfferId
  voucherId?
  partnerId
  canonicalStatus?
  claimability
  redeemability
  listingContext
  ctaState
  staleOrPartialReason?
```

This shape is a future adapter candidate, not a new API contract in Stage 7.8.
`claimability` in that future shape must be read as CTA projection/input only. It must not promise that RF will create a voucher; RF backend validation remains authoritative.

## Runtime Implementation Gaps

Gaps to address before implementation:

1. **No dedicated listing CTA projection DTO.**
   - Current UI must compose listing offers and user vouchers.
   - This is workable but creates repeated logic and summary/list mismatch risk.

2. **Claimability is implicit.**
   - Current read endpoint returns mapped offers.
   - Claimability depends on active mapping, offer state, partner state, repeat policy, idempotency, VIP/Points eligibility and user state.
   - A UI adapter should not overpromise claim success.

3. **Redeemability is not a Rielt concern.**
   - Rielt CTA can link to RF voucher view.
   - Partner/business flow remains redeem authority.

4. **Rielt listing lifecycle is only read/validated through RF context.**
   - RF can validate `l.status = published` and mapping active.
   - RF should not become source for listing status beyond the claim/read context.

5. **`availability: available` on mapped offers is not voucher availability.**
   - It means mapped offer availability/display state.
   - Future DTO docs should qualify this to avoid lifecycle confusion.

6. **Manual SDK optionality differs from generated/OpenAPI shape.**
   - `claimScope` and `listingContext` are optional in manual `RfVoucherDto`.
   - Future DTO patch should decide no-break semantics before type tightening.

7. **Rielt docs still contain booking/inquiry vocabulary.**
   - Product vision docs include booking requests, instant booking and inquiry language.
   - RF listing CTA must not inherit those semantics.

8. **No runtime evidence is collected in this slice.**
   - Existing code awareness is not staging proof.
   - Future integration tests are implementation candidates, not Stage 7.8 execution.

## Forbidden Coupling

Forbidden coupling patterns:

| Pattern | Why forbidden | Safe replacement |
|---|---|---|
| Rielt owns voucher state. | Violates RF lifecycle ownership. | Rielt displays RF-owned projection. |
| RF owns listing lifecycle. | Violates Rielt listing ownership. | RF validates listing/mapping for RF operation only. |
| Listing CTA means booking. | Converts voucher CTA into Rielt transaction. | CTA opens RF voucher utility flow. |
| Claim means payment. | Violates voucher claim boundary. | Claim creates/returns RF voucher. |
| Redeem means payout. | Violates redeem boundary. | Redeem records voucher use. |
| Voucher means cashback. | Financial drift. | Voucher utility / practical benefit. |
| PRO attribution means commission. | Financial/MLM drift. | Provenance only. |
| Connect/Rielt projection becomes lifecycle authority. | Hidden authority drift. | Projection-only UI label. |
| `available` means payout/spendability. | Economy drift. | RF voucher availability only. |
| Diagnostics or evidence imply rollout. | Stage 7.2 freeze violation. | Evidence remains deferred until approved. |

Mandatory invariants:

```text
RF owns voucher lifecycle
Rielt owns listing context
Connect projection is not lifecycle authority
PRO attribution is provenance only
claim != payment
redeem != payout
voucher != cashback
visible != spendable
available != payout
evidence != rollout
shadow_graph != enforcement
slice_16_status: blocked_not_triggered
```

## Candidate Next Implementation Slices

Recommended bounded next slices:

1. **Stage 7.9 - RF / Rielt DTO Contract Patch**
   - Clarify `RfRieltListingOfferContext`, `RfRieltListingOffer.availability`, manual SDK optionality and listing context DTO comments.
   - Scope: docs/OpenAPI/SDK planning first; implementation only if separately approved.

2. **Stage 7.10 - Listing Voucher CTA Projection Adapter**
   - Add a frontend adapter that combines listing offer context, user vouchers and RF lifecycle labels into safe CTA states.
   - Scope: small frontend utility + focused copy, no redesign.

3. **Stage 7.11 - RF / Rielt Integration Tests for Listing-Scoped Voucher Flow**
   - Add focused tests for listing offer context, listing claim, idempotency, inactive mapping and existing listing voucher behavior.
   - Scope: tests only after contract accepted.

4. **Stage 7.12 - Rielt Listing CTA Copy Patch**
   - Replace booking/payment-like CTA wording near RF voucher surfaces with voucher-first copy.
   - Scope: bounded copy/component pass, no Rielt redesign.

## Acceptance Criteria

Stage 7.8 is accepted if:

- this document exists;
- no new RF semantics are introduced;
- no governance recursion is introduced;
- RF/Rielt ownership boundaries are explicit;
- listing-scoped voucher flow is described;
- CTA semantics are safe and do not imply cashback, payout, settlement or guaranteed benefit;
- DTO/endpoint gaps are listed;
- next implementation path is clear;
- runtime code is not changed;
- OpenAPI and SDK are not changed;
- frontend is not redesigned;
- no runtime activation is introduced;
- Slice 16 remains `blocked_not_triggered`.

## Review Gate Results

This table records Stage 7.8 internal docs-first implementation-contract planning posture. It is not external operational approval, not staging sign-off, not implementation approval and not runtime rollout.

| Review gate | Result | Notes |
|---|---|---|
| Requirements Review | `PASS_DOCS_FIRST` | Scope is bounded to RF/Rielt implementation contract alignment. |
| Architecture Review | `PASS_DOCS_FIRST` | RF/Rielt ownership boundaries are explicit. |
| Backend/API Review | `PASS_DOCS_FIRST` | Existing endpoints and DTO gaps are mapped without code changes. |
| QA Review | `PASS_DOCS_ONLY` | Future integration test candidates are listed; no tests added now. |
| Security / Abuse Review | `PASS_DOCS_FIRST` | Claim/redeem/payment/payout abuse boundaries are preserved. |
| Canon Review | `PASS_DOCS_FIRST` | This artifact is implementation-contract alignment, not governance recursion. |

## Final Status

```text
stage_7_8_status: docs_first_implementation_contract_reviewed_planning_pass
new_RF_semantics: false
governance_recursion: false
frontend_redesign: false
OpenAPI_changes: false
SDK_regeneration: false
code_changes: false
tests_added: false
runtime_execution_status: not_executed
staging_evidence_collection: not_opened
runtime_rollout: false
token_g2a_nft_wallet_activation: false
payout_settlement_cashback_activation: false
slice_16_status: blocked_not_triggered
```
