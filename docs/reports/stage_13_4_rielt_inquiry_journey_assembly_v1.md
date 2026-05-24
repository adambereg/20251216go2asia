# Stage 13.4 - Rielt Inquiry Journey Assembly Report

Документ: `stage_13_4_rielt_inquiry_journey_assembly_v1.md`  
Статус: implementation report / bounded inquiry-only continuity slice  
Дата: 2026-05-24  
Scope: Rielt discovery/search/detail/inquiry + bounded RF listing continuity + inquiry visibility route  
Mode: bounded PWA navigation/copy assembly, без runtime/API/schema/database expansion

## 1. Final verdict

Stage 13.4 выполнен как bounded implementation slice: собран coherent inquiry-only journey для Rielt от discovery до inquiry visibility и return paths, с безопасной RF continuity вокруг listing surface.

```text
stage_13_4_status: COMPLETE_AS_RIELT_INQUIRY_JOURNEY_ASSEMBLY
listing_to_inquiry_continuity_assembled: true
inquiry_visibility_handoff_strengthened: true
rf_listing_continuity_safe: true
inquiry_safe_wording_preserved: true
runtime_changes: false
api_schema_sdk_db_changes: false
booking_payment_reservation_semantics_introduced: false
inventory_authority_escalation_introduced: false
path_b_activation: false
public_launch_implied: false
```

## 2. Files changed

Изменены только bounded Rielt/RF frontend surfaces и report artifact:

- `apps/go2asia-pwa-shell/app/(public)/rielt/RieltHomeClient.tsx`
- `apps/go2asia-pwa-shell/app/(public)/rielt/search/SearchResultsClient.tsx`
- `apps/go2asia-pwa-shell/app/(public)/rielt/listings/[id]/ListingDetailClient.tsx`
- `apps/go2asia-pwa-shell/app/(public)/rielt/inquiries/page.tsx` (new)
- `apps/go2asia-pwa-shell/app/(public)/rielt/inquiries/RieltMyInquiriesClient.tsx` (new)
- `apps/go2asia-pwa-shell/components/rielt/ListingDetail/CTAPanel.tsx`
- `apps/go2asia-pwa-shell/components/rielt/ListingDetail/Owner.tsx`
- `apps/go2asia-pwa-shell/components/rielt/ListingDetail/AvailabilityCalendar.tsx`
- `apps/go2asia-pwa-shell/components/rielt/SearchResults/SearchResultsView.tsx`
- `apps/go2asia-pwa-shell/components/rielt/SearchResults/FiltersPanel.tsx`
- `apps/go2asia-pwa-shell/components/rielt/SearchBar.tsx`
- `apps/go2asia-pwa-shell/components/rielt/EditorPicks.tsx`
- `apps/go2asia-pwa-shell/app/(public)/rf/rielt/listings/[listingId]/vouchers/page.tsx`
- `apps/go2asia-pwa-shell/app/(public)/rf/rielt/listings/[listingId]/vouchers/ListingVoucherOffersClient.tsx`
- `apps/go2asia-pwa-shell/lib/rfListingVoucherCtaAdapter.ts`
- `apps/go2asia-pwa-shell/components/rielt/sourceLabels.test.ts`
- `docs/reports/stage_13_4_rielt_inquiry_journey_assembly_v1.md` (new)

Не изменялись: `apps/rielt-service/**`, API contracts, SDK package surfaces, schema/database/migrations, Path B/runtime internals.

## 3. Listing -> inquiry continuity improvements

- На discovery/search/listing surfaces добавлены явные return paths и inquiry continuation links (`/rielt`, `/rielt/search`, `/rielt/inquiries`).
- В listing detail собран более прямой handoff к inquiry form (`#inquiry-form`) и к inquiry visibility route.
- В search continuity добавлен показ date filters (`checkIn/checkOut/guests`) как inquiry context, не как booking authority.
- В `CTAPanel` добавлен prefill inquiry message из выбранных дат availability preview (если даты выбраны), чтобы связать detail selection с inquiry intent.
- В `EditorPicks` исправлена query continuity для семейного сценария (`bedroomsMin` вместо несовместимого параметра).

```text
rielt_journey_loop: /rielt -> /rielt/search -> /rielt/listings/[id] -> inquiry_submit -> /rielt/inquiries
isolated_detail_feeling_reduced: true
```

## 4. Inquiry visibility/handoff improvements

- Добавлен bounded runtime-backed route `/rielt/inquiries` с загрузкой `GET /v1/rielt/my/inquiries` через существующий gateway endpoint.
- Добавлены статусы inquiry (`new`, `viewed`, `closed`) в inquiry-safe UI labels, без booking confirmation semantics.
- Для гостя добавлен sign-in handoff с `redirect_url` на inquiry visibility route.
- В `CTAPanel` после успешной отправки inquiry добавлены next actions: перейти в `Мои inquiry-запросы` и вернуться к поиску.
- Для 401 в submit flow добавлен явный входной путь вместо тупика с generic ошибкой.

## 5. RF listing continuity improvements

- На listing-scoped RF vouchers page добавлен прямой continuation path к `/rielt/inquiries`.
- Усилены RF boundary disclaimers: RF vouchers остаются partner layer, не inventory authority и не booking confirmation.
- В listing voucher post-claim actions добавлен путь в `Мои inquiry-запросы`.
- В explanatory steps RF handoff переведён в inquiry-safe continuity: после ваучера пользователь отправляет inquiry в Rielt.
- В `rfListingVoucherCtaAdapter` убрана формулировка claim loading как "запрос", чтобы не смешивать voucher claim с inquiry submission.

## 6. Inquiry-safe wording preserved

Проверенные и сохранённые границы:

```text
inquiry != booking
inquiry_submission != reservation
inquiry_status != booking_confirmation
listing_projection != inventory_authority
listing_projection != guaranteed_availability
rf_voucher != booking_discount
rf_offer != reservation_authority
listing_media != proof_of_inventory
```

Дополнительно:

- Search/date/calendar copy зафиксирован как inquiry context.
- Post-submit messages в listing detail остаются "request/inquiry" и не эскалируют в proof/receipt semantics.

## 7. Runtime boundaries preserved

- Изменения ограничены PWA UI/navigation/copy и тестовым guardrail списком файлов.
- Новые runtime endpoints/producer semantics не добавлялись.
- `POST /v1/rielt/listings/{id}/inquiries` и `GET /v1/rielt/my/inquiries` использованы как существующие runtime contracts.
- Service internals (`public.ts`, `inquiry.ts`, `rieltService.ts`) не редактировались.
- Path B и public launch semantics не активировались.

## 8. Validation performed

Обязательные проверки:

- `pnpm -C apps/go2asia-pwa-shell typecheck` - passed
- `pnpm -C apps/go2asia-pwa-shell lint` - passed
- `pnpm -C apps/go2asia-pwa-shell test -- components/rielt/sourceLabels.test.ts lib/rfListingVoucherCtaAdapter.test.ts` - passed
- `git diff --check` - passed

Дополнительные terminology scans (changed Rielt/RF paths):

- Поиск unsafe terms выполнен; найденные вхождения остались только в boundary/disclaimer/guardrail контексте ("не booking", "не receipt", "не inventory authority"), без unsafe positive claims.

## 9. Remaining gaps/deferred items

- Inquiry visibility route пока выводит базовую историю и статусы; расширенный lifecycle UX (pagination/filter/status tabs) отложен.
- Rielt save/favorites остаётся локальным UI action без runtime persistence (вне scope этого slice).
- RF deeper journey (partner catalog expansion, VIP/PRO cross-module continuity) отложен на следующий bounded slice.
- Дополнительная harmonization всей mixed RU/EN терминологии Rielt UI может быть вынесена отдельным wording slice без runtime touches.

## 10. Recommended next slice

`Stage 13.5 - RF / Partner Offer Continuity Assembly`

Фокус следующего slice: безопасно усилить partner offer continuity и RF handoff вокруг Rielt/Connect paths, сохранив boundaries `rf_offer != reservation_authority` и `voucher_lifecycle != booking_confirmation`.
