# RF / Rielt Listing Claim Integration Tests v1

Date: 2026-05-18
Status: `FOCUSED_INTEGRATION_TEST_SLICE_REVIEWED_VALIDATION_PASS`
Stage: `Stage 7.11 / RF Rielt Listing Claim Integration Tests`
Mode: focused RF service integration test slice, no new RF lifecycle, no new Rielt lifecycle, no DTO stage, no CTA redesign, no backend rewrite, no OpenAPI rewrite, no SDK rewrite, no governance recursion, no staging evidence window, no external API calls, no production DB, no diagnostics retrieval, no deployment, no runtime rollout, no Points enforcement activation, no payout/settlement/cashback activation, no Slice 16 movement

Primary inputs:

- `docs/architecture/domain/rf_rielt_listing_scoped_voucher_implementation_contract_v1.md`
- `docs/architecture/domain/rf_rielt_runtime_drift_prioritization_v1.md`
- `docs/architecture/domain/rf_rielt_listing_offer_cost_availability_dto_patch_v1.md`
- `docs/architecture/domain/rf_rielt_listing_voucher_cta_projection_adapter_v1.md`
- `docs/architecture/domain/rf_voucher_lifecycle_contract_consolidation_v1.md`
- `docs/openapi/rf.yaml`
- `apps/rf-service/src/routes/rf.ts`
- `apps/rf-service/src/store.ts`
- `apps/rf-service/test/request.test.ts`
- `apps/rf-service/test/rielt-listing-claim.test.ts`

## Purpose

This artifact records the Stage 7.11 local integration test slice for RF/Rielt listing-scoped voucher flow.

The slice adds focused RF service tests that lock the practical contract around listing offer read, listing-scoped claim, idempotency, invalid mappings, mismatch errors and auth boundaries. It verifies existing behavior; it does not add new runtime semantics.

## Non-goals

This slice does not:

- introduce a new RF lifecycle;
- introduce a new Rielt lifecycle;
- add claimability or redeemability DTOs;
- change OpenAPI or SDK shape;
- change frontend CTA adapter behavior;
- redesign RF or Rielt UI;
- rewrite backend claim/redeem logic;
- run staging or external APIs;
- use production DB or live diagnostics;
- activate Points enforcement beyond existing local mocked behavior;
- introduce payout, settlement or cashback semantics;
- move Slice 16.

## Inputs Reviewed

| Input | Relevance |
|---|---|
| Stage 7.8 contract | Defines listing-scoped RF/Rielt boundary and forbidden coupling. |
| Stage 7.8b drift prioritization | Identifies missing integration coverage as a practical blocker after DTO and CTA stabilization. |
| Stage 7.9 patch | Requires read-side `pointsCost` to match the offer cost source used by listing claim. |
| Stage 7.10 adapter | Confirms frontend CTA projection is separate from backend integration tests. |
| `routes/rf.ts` | Provides route-level GET/POST listing endpoints and auth boundary. |
| `store.ts` | Provides `getRieltListingOfferContext` and `claimVoucherForListing`. |
| `request.test.ts` | Existing Vitest + mocked DB style. |

## Test Scope

New test file:

- `apps/rf-service/test/rielt-listing-claim.test.ts`

The tests use the existing RF service worker request path and the repository's mocked `@go2asia/db` pattern. They do not create a new framework, do not require a real DB and do not call external services.

In scope:

- public listing offer read;
- paid/free cost consistency at DTO response and voucher snapshot level;
- authenticated listing-scoped claim;
- idempotency replay and context mismatch;
- inactive/hidden mapping behavior;
- listing/offer/partner relation mismatch behavior;
- protected claim vs public read auth boundary.

Out of scope:

- frontend CTA adapter tests;
- OpenAPI generation;
- SDK generation;
- staging evidence;
- live Points service calls;
- full Rielt booking/inquiry flow;
- partner redemption flow beyond existing RF tests.

## Test Scenarios Added

| Scenario | Coverage |
|---|---|
| Listing offer read returns mapped RF offers | `GET /v1/rf/rielt/listings/{listingId}/offers` returns listing context and active mapped offers. |
| `pointsCost` consistency on read | Read response includes non-zero `pointsCost` from mapped RF offer. |
| Display availability boundary | Read response keeps `availability: available` as display/mapping availability only. |
| Inactive/hidden mapping omitted | Read endpoint returns no offers when active/public/partner-active mapping query returns none. |
| Successful listing-scoped claim | `POST /v1/rf/rielt/listings/{listingId}/offers/{offerId}/claim` creates voucher. |
| `claimScope` and `listingContext` | Claim response includes `claimScope: listing`, `listingContext.source: rielt`, matching listing id/title and offer id. |
| `pointsCostSnapshot` | Claim response preserves `pointsCostSnapshot` from listing claim offer cost source. |
| Idempotency replay | Same user/key/listing/offer replays deterministically with `idempotentReplay: true` and no voucher insert. |
| Idempotency context mismatch | Same key with different listing context returns `RF_IDEMPOTENCY_KEY_CONTEXT_MISMATCH`. |
| Missing/inactive mapping claim | Claim fails with `RF_RIELT_LISTING_OFFER_NOT_FOUND` and no voucher insert. |
| Offer/partner relation invalid | Claim fails with `RF_RIELT_LISTING_OFFER_RELATION_INVALID` and no voucher insert. |
| Listing partner mismatch | Claim fails with `RF_RIELT_LISTING_PARTNER_MISMATCH` and no voucher insert. |
| Auth guard | Listing claim requires auth; listing offer read remains public under current contract. |

## Fixtures / Helpers

Small test-local helpers were added:

- `listingRow`;
- `listingOfferMappingRow`;
- `listingClaimContextRow`;
- `listingVoucherRow`;
- `idempotencyRow`;
- `executedSqlText`.

These helpers are local to `rielt-listing-claim.test.ts` and do not change runtime fixtures, schema, SDK, OpenAPI or frontend code.

## Validation Performed

Validation:

- `pnpm --filter @go2asia/rf-service test -- rielt-listing-claim.test.ts` passed: 1 file, 7 tests.
- `pnpm --filter @go2asia/rf-service typecheck` passed.
- `pnpm --filter @go2asia/rf-service test` passed: 11 files, 243 tests.
- `git diff --check` passed.
- IDE diagnostics for `apps/rf-service/test/rielt-listing-claim.test.ts` passed.

This artifact must not claim staging, external API, production DB, diagnostics, deployment or live runtime validation.

## Known Non-goals / Deferred Tests

Deferred to future slices if needed:

- real DB migration-level constraints for listing voucher uniqueness;
- full paid Points service integration with live service;
- E2E listing page to RF claim flow;
- frontend CTA adapter integration beyond Stage 7.10 unit tests;
- staging evidence collection;
- public enumeration/rate-limit review beyond existing auth/read behavior tests;
- partner redeem flow for listing-scoped vouchers beyond existing RF redeem tests.

## Acceptance Criteria

Stage 7.11 is accepted if:

- listing offer read test covers `pointsCost`;
- listing claim success test covers `claimScope` and `listingContext`;
- idempotency replay and mismatch are covered;
- inactive/hidden mapping failure is covered;
- partner/listing mismatch or invalid mapping is covered;
- auth guard is covered;
- no runtime semantics are changed unless a small contract bug is explicitly fixed;
- no OpenAPI/SDK/frontend rewrite is introduced;
- no new lifecycle semantics are introduced;
- no governance recursion is introduced;
- no runtime rollout is introduced;
- Slice 16 remains `blocked_not_triggered`.

## Final Status

```text
stage_7_11_status: focused_integration_test_slice_reviewed_validation_pass
test_file_added: true
runtime_code_changed: false
OpenAPI_changed: false
SDK_shape_changed: false
frontend_changed_by_stage_7_11: false
new_RF_semantics: false
new_Rielt_semantics: false
claimability_DTO_added: false
redeemability_DTO_added: false
CTA_adapter_changed: false
staging_evidence_window: false
runtime_rollout: false
slice_16_status: blocked_not_triggered
```
