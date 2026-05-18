# RF / Rielt Listing Voucher CTA Projection Adapter v1

Date: 2026-05-18
Status: `BOUNDED_FRONTEND_ADAPTER_REVIEWED_VALIDATION_PASS`
Stage: `Stage 7.10 / Listing Voucher CTA Projection Adapter`
Mode: bounded frontend utility/adapter patch, no new RF lifecycle, no new Rielt lifecycle, no global projection layer, no authority framework, no frontend redesign, no Rielt redesign, no backend rewrite, no OpenAPI rewrite, no SDK type shape change, no schema changes, no migrations, no staging evidence collection, no API calls, no DB access, no diagnostics retrieval, no deployment, no runtime rollout, no Points enforcement activation, no payout/settlement/cashback activation, no Slice 16 movement

Primary inputs:

- `docs/architecture/domain/rf_rielt_listing_scoped_voucher_implementation_contract_v1.md`
- `docs/architecture/domain/rf_rielt_runtime_drift_prioritization_v1.md`
- `docs/architecture/domain/rf_rielt_listing_offer_cost_availability_dto_patch_v1.md`
- `docs/architecture/domain/rf_voucher_lifecycle_contract_consolidation_v1.md`
- `docs/architecture/domain/connect_projection_vocabulary_reconciliation_v1.md`
- `docs/openapi/rf.yaml`
- `packages/sdk/src/rf.ts`
- `apps/go2asia-pwa-shell/app/(public)/rf/rielt/listings/[listingId]/vouchers/ListingVoucherOffersClient.tsx`
- `apps/go2asia-pwa-shell/lib/rfVoucherLifecycle.ts`

## Purpose

This document records the Stage 7.10 frontend adapter patch for RF/Rielt listing voucher CTA projection.

The adapter centralizes how a Rielt listing voucher surface interprets:

- RF listing offer context;
- the relevant user voucher, when present;
- loading, error, stale or partial UI context;
- RF voucher canonical/legacy fallback status.

The adapter is UI projection only. It does not become lifecycle authority and does not promise a successful claim.

## Non-goals

This patch does not:

- introduce new RF lifecycle states;
- introduce new Rielt lifecycle states;
- add backend claimability or redeemability DTOs;
- add OpenAPI fields;
- change SDK type shape;
- change backend claim/redeem behavior;
- create a global projection layer;
- create a unified lifecycle model;
- redesign Rielt;
- redesign RF UI layout;
- introduce booking/payment/payout/cashback semantics;
- activate runtime rollout.

## Inputs Reviewed

| Surface | Relevance |
|---|---|
| Stage 7.8 contract | Defines CTA projection states and forbidden coupling. |
| Stage 7.8b prioritization | Identifies missing CTA adapter as dangerous / implementation-blocking. |
| Stage 7.9 patch | Clarifies `pointsCost` and `availability` before adapter work. |
| `rfVoucherLifecycle.ts` | Provides canonical-first lifecycle fallback helper. |
| `ListingVoucherOffersClient.tsx` | Existing composition point for listing offer + user voucher + claim result. |

## Adapter Scope

Adapter file:

- `apps/go2asia-pwa-shell/lib/rfListingVoucherCtaAdapter.ts`

Connected component:

- `apps/go2asia-pwa-shell/app/(public)/rf/rielt/listings/[listingId]/vouchers/ListingVoucherOffersClient.tsx`

Adapter responsibilities:

- find a relevant listing-scoped voucher for an RF offer and Rielt listing;
- map offer/voucher/loading/error/partial/stale input to a UI-safe CTA projection state;
- provide safe badge/button/message copy;
- disable CTA when the projection must not initiate another claim;
- avoid direct interpretation of `offer.availability` as claimability or lifecycle authority.

Adapter non-responsibilities:

- deciding backend claimability;
- deciding backend redeemability;
- mutating RF voucher lifecycle;
- validating Points spendability;
- confirming Rielt booking/inquiry state.

## Projection States

| State | Meaning | Safe copy posture |
|---|---|---|
| `no_offer` | No RF offer is available for this listing CTA surface. | `Для этого объекта пока нет RF-предложений`. |
| `claim_available` | An RF listing offer can be presented as a claim action prompt. | `Получить RF-ваучер`; not a claim guarantee. |
| `ready_to_use` | A relevant voucher exists with active/use-ready RF lifecycle status. | `Ваучер готов к использованию у партнёра`. |
| `pending_activation` | A relevant voucher exists but is RF-locked/pending activation. | `Ваучер получен, ожидает RF-активации`. |
| `used` | A relevant voucher is redeemed/used. | `Ваучер использован`. |
| `unavailable` | A relevant voucher is expired/cancelled or the CTA must not proceed. | `RF-ваучер сейчас недоступен`. |
| `stale` | Local UI state may need refresh. | `Статус RF-ваучера может обновиться`. |
| `partial` | Loaded data is incomplete for safe CTA. | `RF-детали временно ограничены`. |
| `error` | Transport/action error occurred. | Error copy from the caller. |

These states are frontend projection states only. They are not backend enums, OpenAPI values or RF lifecycle statuses.

## Mapping Rules

Current adapter mapping:

| Input | Projection |
|---|---|
| No offer | `no_offer` |
| Offer present, no relevant voucher | `claim_available` |
| Loading claim action | disabled `claim_available` with loading copy |
| Error copy provided | `error` |
| `partial: true` | `partial` |
| `stale: true` | `stale` |
| Voucher effective status `available` | `ready_to_use` |
| Voucher effective status `unlocked` | `ready_to_use` |
| Voucher effective status `locked` | `pending_activation` |
| Voucher effective status `redeemed` | `used` |
| Voucher effective status `expired` or `cancelled` | `unavailable` |

The adapter uses canonical-first fallback through `getRfVoucherEffectiveStatus`.

## Safe Copy

Allowed safe copy examples:

- `Получить RF-ваучер`;
- `Ваучер получен`;
- `Ваучер готов к использованию у партнёра`;
- `Ваучер получен, ожидает RF-активации`;
- `Ваучер использован`;
- `RF-ваучер сейчас недоступен`;
- `Не удалось загрузить RF-предложение`;
- `Для этого объекта пока нет RF-предложений`.

## Forbidden Copy

Forbidden copy and interpretations:

- `Забронировать`;
- `Оплатить`;
- `Получить кэшбэк`;
- `Выплата`;
- `Гарантированная скидка`;
- `Доступно к списанию`;
- `Партнёр выплатит`;
- `Заявка подтверждена`;
- `Бронирование подтверждено`;
- any wording that treats `availability` as claimability, redeemability, spendability or payout availability.

## Implementation Summary

Files changed:

- `apps/go2asia-pwa-shell/lib/rfListingVoucherCtaAdapter.ts`;
- `apps/go2asia-pwa-shell/lib/rfListingVoucherCtaAdapter.test.ts`;
- `apps/go2asia-pwa-shell/app/(public)/rf/rielt/listings/[listingId]/vouchers/ListingVoucherOffersClient.tsx`.

Summary:

- Added a small frontend utility with `ListingVoucherCtaState` and `getListingVoucherCtaProjection`.
- Added `findListingVoucherForOffer` to centralize listing-scoped voucher matching.
- Replaced direct component labels `Доступен` / `Получен` / `Получить ваучер` with adapter-driven badge/button/message copy.
- Kept layout and component structure intact.
- Did not add backend/API/SDK shape changes.

## Tests / Validation

Performed validation:

- `pnpm --filter @go2asia/pwa-shell test -- rfListingVoucherCtaAdapter.test.ts` passed: 1 file, 5 tests.
- Targeted adapter TypeScript check passed: `tsc --noEmit --skipLibCheck --jsx react-jsx --moduleResolution bundler --module esnext --target es2022 --types vitest lib/rfListingVoucherCtaAdapter.ts lib/rfListingVoucherCtaAdapter.test.ts`.
- `git diff --check` passed.
- IDE diagnostics for Stage 7.10 edited files passed.
- Full `pnpm --filter @go2asia/pwa-shell typecheck` did not pass because of an existing `.next/types/validator.ts` route signature issue in `app/api/rielt-seed/listings/[id]/route`; this is outside Stage 7.10 edited files.

This Stage 7.10 artifact must not claim API, DB, staging, diagnostics, deployment or live runtime validation.

## Compatibility Notes

Compatibility preserved:

- no backend changes;
- no OpenAPI changes;
- no SDK type shape changes;
- no frontend layout redesign;
- no global projection framework;
- no new RF lifecycle semantics;
- existing claim action still calls `claimRfRieltListingOffer`;
- existing user voucher hydration still calls `fetchMyVouchers`;
- existing RF lifecycle helper remains canonical-first fallback source.

## Acceptance Criteria

Stage 7.10 is accepted if:

- adapter exists;
- current listing voucher CTA uses adapter;
- `offer.availability` is not directly used as claimability/redeemability;
- voucher canonical/legacy status is interpreted through the adapter via RF lifecycle helper;
- safe copy is adapter-driven;
- no backend changes are introduced;
- no OpenAPI changes are introduced;
- no SDK shape changes are introduced;
- no frontend redesign is introduced;
- no new lifecycle semantics are introduced;
- no governance recursion is introduced;
- no runtime rollout is introduced;
- Slice 16 remains `blocked_not_triggered`.

## Final Status

```text
stage_7_10_status: bounded_frontend_adapter_reviewed_validation_pass
adapter_added: true
current_listing_cta_uses_adapter: true
new_RF_semantics: false
new_Rielt_semantics: false
global_projection_layer: false
backend_changes: false
OpenAPI_changes: false
SDK_shape_changes: false
frontend_redesign: false
CTA_states_backend_contract: false
claim_semantics_changed: false
redeem_semantics_changed: false
Points_semantics_changed: false
runtime_rollout: false
slice_16_status: blocked_not_triggered
```
