# RF / Rielt CTA Copy Guard Patch v1

Date: 2026-05-18
Status: `BOUNDED_COPY_GUARD_PATCH_REVIEWED_VALIDATION_PASS`
Stage: `Stage 7.12 / Rielt RF CTA Copy Guard Patch`
Mode: bounded Rielt/RF CTA copy guard patch, no frontend redesign, no Rielt redesign, no RF lifecycle change, no new CTA state model, no backend change, no OpenAPI change, no SDK change, no global copy rewrite, no i18n rewrite, no governance recursion, no staging evidence window, no external API calls, no production DB, no diagnostics retrieval, no deployment, no runtime rollout, no Points enforcement activation, no payout/settlement/cashback activation, no Slice 16 movement

Primary inputs:

- `docs/architecture/domain/rf_rielt_listing_scoped_voucher_implementation_contract_v1.md`
- `docs/architecture/domain/rf_rielt_runtime_drift_prioritization_v1.md`
- `docs/architecture/domain/rf_rielt_listing_offer_cost_availability_dto_patch_v1.md`
- `docs/architecture/domain/rf_rielt_listing_voucher_cta_projection_adapter_v1.md`
- `docs/architecture/domain/rf_rielt_listing_claim_integration_tests_v1.md`
- `docs/architecture/domain/connect_projection_vocabulary_reconciliation_v1.md`
- `apps/go2asia-pwa-shell/components/rielt/ListingDetail/CTAPanel.tsx`
- `apps/go2asia-pwa-shell/components/rielt/ListingCard.tsx`
- `apps/go2asia-pwa-shell/app/(public)/rielt/listings/[id]/ListingDetailClient.tsx`
- `apps/go2asia-pwa-shell/app/(public)/rf/rielt/listings/[listingId]/vouchers/ListingVoucherOffersClient.tsx`
- `apps/go2asia-pwa-shell/app/(public)/rf/rielt/listings/[listingId]/vouchers/page.tsx`
- `apps/go2asia-pwa-shell/lib/rfListingVoucherCtaAdapter.ts`

## Purpose

This patch closes the Stage 7.12 copy-risk around Rielt/RF CTA surfaces. The goal is to keep nearby user-facing text from implying booking, payment, settlement, cashback, guaranteed benefit or spendability when a user is looking at RF voucher CTAs.

This is a copy guard only. It does not change RF claim/redeem behavior, Rielt inquiry behavior, CTA state projection or backend authority.

## Non-goals

This patch does not:

- redesign Rielt;
- redesign RF voucher CTA layout;
- introduce new CTA states;
- change `rfListingVoucherCtaAdapter` logic except safe loading copy;
- change RF lifecycle semantics;
- change Rielt lifecycle semantics;
- change backend routes or store behavior;
- change OpenAPI or SDK shape;
- rewrite global copy or i18n;
- remove the Rielt inquiry flow;
- run staging or deploy.

## Inputs Reviewed

| Surface | Result |
|---|---|
| `CTAPanel.tsx` | Rielt object CTA and inquiry copy reviewed. |
| `ListingCard.tsx` | RF badges and listing card context label reviewed. |
| `ListingDetailClient.tsx` | No direct risky copy; delegates to `CTAPanel`. |
| `ListingVoucherOffersClient.tsx` | RF listing voucher card copy reviewed. |
| `rfListingVoucherCtaAdapter.ts` | Adapter copy reviewed; loading copy made request-oriented. |
| `page.tsx` for listing vouchers | Hero and empty state copy reviewed. |
| Rielt mock RF voucher data | Mock titles/conditions reviewed because they surface near RF CTA. |

## Copy Risk Inventory

| Risk | Location | Patch response |
|---|---|---|
| `Оформление` near RF voucher CTA can sound like transaction flow. | Listing voucher client and page hero. | Replaced with `Получение RF-ваучера`. |
| `Выгода` near listing voucher CTA can read as guaranteed benefit. | Listing voucher card heading and post-claim message. | Replaced with `RF-предложение`. |
| `Ваучер доступен` on listing card can read as claimability/lifecycle status. | `ListingCard.tsx`. | Replaced with `RF-предложение для объекта`. |
| Inquiry success as generic message can be mistaken for transaction confirmation in mixed CTA panel. | `CTAPanel.tsx`. | Changed to `Запрос отправлен`; section copy clarifies it is not booking/payment confirmation. |
| Loading copy `Оформляется` / `Оформляем...` can sound like booking/payment processing. | `rfListingVoucherCtaAdapter.ts`. | Replaced with `Запрос отправляется` / `Отправляем запрос...`. |
| Mock RF voucher title/conditions mention discount/booking. | `mockListings.ts`. | Reworded as RF offer/service copy with partner clarification. |

## Copy Changes Made

Files changed:

- `apps/go2asia-pwa-shell/components/rielt/ListingDetail/CTAPanel.tsx`
- `apps/go2asia-pwa-shell/components/rielt/ListingCard.tsx`
- `apps/go2asia-pwa-shell/components/rielt/mockListings.ts`
- `apps/go2asia-pwa-shell/app/(public)/rf/rielt/listings/[listingId]/vouchers/ListingVoucherOffersClient.tsx`
- `apps/go2asia-pwa-shell/app/(public)/rf/rielt/listings/[listingId]/vouchers/page.tsx`
- `apps/go2asia-pwa-shell/lib/rfListingVoucherCtaAdapter.ts`

Examples:

- `Открыть предложение` -> `Посмотреть RF-ваучер`
- `Сообщение отправлено.` -> `Запрос отправлен.`
- `Оставить сообщение по объекту` -> `Связаться по объекту`
- `Отправить сообщение` -> `Отправить запрос`
- `Ваучер доступен` -> `RF-предложение для объекта`
- `Выгода` -> `RF-предложение`
- `Оформление происходит в RF Asia.` -> `Получение RF-ваучера происходит в RF Asia.`
- `Оформляем...` -> `Отправляем запрос...`

## Safe Wording Rules

Safe wording near RF/Rielt voucher CTA:

- `Получить RF-ваучер`
- `Посмотреть RF-ваучер`
- `RF-предложение для объекта`
- `Ваучер получен`
- `Ваучер готов к использованию у партнёра`
- `Ваучер ожидает RF-активации`
- `Ваучер использован`
- `RF-предложение временно недоступно`
- `Для этого объекта пока нет RF-предложений`
- `Связаться по объекту`
- `Отправить запрос по объекту`
- `Запрос отправлен`
- `Менеджер свяжется с вами`

## Forbidden Wording Rules

Forbidden wording near RF voucher CTA:

- `Забронировать`
- `Оплатить`
- `Оплатить объект`
- `Оплатить бронь`
- `Бронирование подтверждено`
- `Заявка подтверждена` when it can be confused with booking or transaction confirmation
- `Гарантированная скидка`
- `Гарантированная выгода`
- `Получить кэшбэк`
- `Кэшбэк начислен`
- `Выплата`
- `Партнёр выплатит`
- `Settlement`
- `Payout`
- `Доступно к списанию`
- `Можно списать`
- `Оплата через RF`
- `RF оплатит`
- `Ваучер = скидка`

## Validation Performed

Validation:

- `pnpm --filter @go2asia/pwa-shell test -- rfListingVoucherCtaAdapter.test.ts` passed: 1 file, 5 tests.
- Forbidden wording search over Stage 7.12 edited Rielt/RF CTA files passed with no matches.
- `git diff --check` passed.
- IDE diagnostics for edited Stage 7.12 files passed.
- Full `pnpm --filter @go2asia/pwa-shell typecheck` did not pass because of the existing `.next/types/validator.ts` route signature issue in `app/api/rielt-seed/listings/[id]/route`; this is outside Stage 7.12 edited files.

This artifact must not claim staging, external API, production DB, diagnostics, deployment or live runtime validation.

## Deferred / Non-goal Copy Areas

Deferred because they are outside the Stage 7.12 Rielt/RF CTA surface:

- generic RF catalog wording not shown in Rielt listing CTA;
- RF partner detail payment method copy;
- Rielt model/type comments such as `instantBooking`, `prepayment` or `verifiedBooking`;
- review labels such as `Проверенная бронь` when not adjacent to RF voucher CTA;
- travel organizer copy about trip bookings;
- global landing/app-shell navigation labels.

## Acceptance Criteria

Stage 7.12 is accepted if:

- risky RF/Rielt CTA copy is reviewed;
- forbidden wording is not present near RF voucher CTA surfaces;
- safe copy is used consistently in Rielt/RF CTA context;
- Rielt inquiry copy does not imply booking/payment confirmation;
- no layout redesign is introduced;
- no backend/OpenAPI/SDK changes are introduced;
- no new lifecycle semantics are introduced;
- no new CTA state model is introduced;
- no governance recursion is introduced;
- no runtime rollout is introduced;
- Slice 16 remains `blocked_not_triggered`.

## Final Status

```text
stage_7_12_status: bounded_copy_guard_patch_reviewed_validation_pass
copy_guard_patch: true
frontend_redesign: false
Rielt_redesign: false
new_CTA_state_model: false
RF_lifecycle_changed: false
Rielt_lifecycle_changed: false
backend_changed: false
OpenAPI_changed: false
SDK_changed: false
global_copy_rewrite: false
i18n_rewrite: false
governance_recursion: false
runtime_rollout: false
slice_16_status: blocked_not_triggered
```
