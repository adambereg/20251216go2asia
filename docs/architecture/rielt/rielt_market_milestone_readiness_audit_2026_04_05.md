# Rielt Market Milestone Readiness Audit (2026-04-05)

**Status:** audit-only snapshot (no implementation changes)  
**Scope:** milestone-readiness assessment for `Rielt Market`  
**Method:** docs/code reality check across frontend truth, contract truth, boundary truth, execution readiness

## 1. Verdict

partially ready

## 2. What is already real

- Реально есть публичные frontend поверхности `/rielt`, `/rielt/search`, `/rielt/listings/[id]` с вызовами к `/v1/rielt/*`.
- Реально есть gateway routing на `RIELT_SERVICE_URL` и route protection для owner/inquiry сегмента.
- Реально есть `rielt-service` контур для public listings, nearby, detail, minimal owner CRUD и inquiry.
- Реально есть OpenAPI surface (`docs/openapi/rielt.yaml` + bundle) и generated-контур SDK через Orval.
- Реально зафиксирована ownership-модель: Rielt владеет listing/inquiry, а geo/media/RF подключаются как references.

## 3. Hollow / partial / fake completeness

- Часть frontend-данных собирается из fallback/placeholder маппинга, а не из подтвержденной runtime-правды публичного DTO.
- В UI присутствуют фильтры/параметры (даты, гости, часть quick filters/sort), которые не дают полноценного эффекта в фактическом API-запросе.
- Часть витринных компонентов создает видимость полноты каталога при частично static/local semantics.
- Карта и geo-подача в UI выглядят доступными, но часто находятся в фактическом режиме ограниченной/пустой data truth.
- В detail flow часть runtime-сбоев может визуально схлопываться с `not found`, что снижает диагностическую честность.

## 4. Boundary and ownership audit

- **geo ownership:** Atlas/content сохраняется как внешний источник geo truth; в Rielt используются ссылки, но есть неоднородность между документной формулировкой и фактической строгостью проверок.
- **RF ownership:** Rielt хранит RF references/context, но не перехватывает ownership RF сущностей.
- **booking/chat/CRM drift:** в Rielt scope это out-of-scope, но в смежных документах встречаются ожидания, выходящие за текущую границу.
- **media ownership:** в рамках SSOT корректно reference-only, но часть публичной подачи медиа выглядит как partial surface.
- **Space/Connect drift:** Space ведет себя как consumer ссылок; Connect местами предполагает более глубокий transactional контур, чем текущий Rielt runtime.

## 5. Contract / implementation drift

- Есть drift между неавторитетными module-level описаниями и фактическим `/v1/rielt/*` runtime-контуром.
- Есть drift docs-vs-docs по трактовке inquiry в Step 8 и boundary статуса.
- Есть drift между frontend expectations и фактической передачей query/filters в SDK/API.
- Есть системный риск drift из-за параллельного существования generated SDK и ручного SDK-слоя.
- Есть риск drift между ожидаемой service boundary и смежными интеграционными ожиданиями (особенно вокруг booking-like сценариев).

## 6. UX/runtime honesty audit

- **loading:** реализован частично и не полностью консистентно по всем Rielt surface.
- **empty:** для search есть честные empty-состояния, но не во всех секциях.
- **inactive/unpublished:** published-only публичный контур есть, но часть статусной семантики в UI синтетическая.
- **stale/unavailable:** есть явные дисклеймеры в отдельных местах, но часть fallback-поведения не всегда прозрачно для пользователя.
- **inquiry/contact outcomes:** базовый happy-path присутствует, но детализация исходов и классов ошибок ограничена.

## 7. Top risks

- Двойной контрактный слой в SDK (generated + manual) повышает вероятность тихого contract drift.
- Визуальная готовность UI опережает подтвержденную runtime-backed truth.
- Несогласованность между документами по inquiry/validation может размыть execution scope.
- Смежные ожидания (Connect/booking) могут привести к boundary drift до стабилизации базового Rielt контура.
- Устаревшие/неавторитетные документы создают риск интеграции не по фактическому контракту.

## 8. Recommended next bounded slice

Первый bounded execution slice: **Contract-truth hardening для public search/detail + inquiry path** с выравниванием одной цепочки истины `OpenAPI bundle -> generated SDK -> frontend usage` и фиксацией честных runtime states (`loading/empty/error/not-found/unavailable`) без расширения доменных границ.

## 9. Files inspected

- `docs/architecture/rielt/rielt_domain_model_v1.md`
- `docs/architecture/rielt/rielt_openapi_outline_v1.md`
- `docs/architecture/rielt/rielt_backend_architecture_v1.md`
- `docs/architecture/rielt/rielt_dependency_map_v1.md`
- `docs/plans/go2asia_next_steps_plan_2026_march_10.md`
- `docs/openapi/rielt.yaml`
- `docs/openapi/openapi.bundle.yaml`
- `docs/modules/rielt/api_contracts.md`
- `docs/architecture/rielt/rielt_rf_contract_alignment_v1.md`
- `docs/backend/api_gateway/overview.md`
- `apps/api-gateway/src/index.ts`
- `apps/rielt-service/src/routes/index.ts`
- `apps/rielt-service/src/services/rieltService.ts`
- `apps/rielt-service/src/db/queries/listingQueries.ts`
- `apps/rielt-service/src/middleware/auth.ts`
- `apps/guru-service/src/adapters/rieltAdapter.ts`
- `packages/sdk/package.json`
- `packages/sdk/src/index.ts`
- `packages/sdk/src/mutator.ts`
- `packages/sdk/src/rielt.ts`
- `orval.config.ts`
- `sdk/go2AsiaPlatformAPI.ts`
- `apps/go2asia-pwa-shell/middleware.ts`
- `apps/go2asia-pwa-shell/app/(public)/rielt/layout.tsx`
- `apps/go2asia-pwa-shell/app/(public)/rielt/page.tsx`
- `apps/go2asia-pwa-shell/app/(public)/rielt/RieltHomeClient.tsx`
- `apps/go2asia-pwa-shell/app/(public)/rielt/search/page.tsx`
- `apps/go2asia-pwa-shell/app/(public)/rielt/search/SearchResultsClient.tsx`
- `apps/go2asia-pwa-shell/app/(public)/rielt/listings/[id]/page.tsx`
- `apps/go2asia-pwa-shell/app/(public)/rielt/listings/[id]/ListingDetailClient.tsx`
- `apps/go2asia-pwa-shell/components/rielt/adapters/rieltDtoToListing.ts`
- `apps/go2asia-pwa-shell/components/rielt/types.ts`
- `apps/go2asia-pwa-shell/components/rielt/index.ts`
- `apps/go2asia-pwa-shell/components/rielt/SearchBar.tsx`
- `apps/go2asia-pwa-shell/components/rielt/QuickFilters.tsx`
- `apps/go2asia-pwa-shell/components/rielt/EditorPicks.tsx`
- `apps/go2asia-pwa-shell/components/rielt/NewListings.tsx`
- `apps/go2asia-pwa-shell/components/rielt/ListingCard.tsx`
- `apps/go2asia-pwa-shell/components/rielt/PopularCities.tsx`
- `apps/go2asia-pwa-shell/components/rielt/SearchResults/SearchResultsView.tsx`
- `apps/go2asia-pwa-shell/components/rielt/SearchResults/FiltersPanel.tsx`
- `apps/go2asia-pwa-shell/components/rielt/SearchResults/ListingsList.tsx`
- `apps/go2asia-pwa-shell/components/rielt/SearchResults/ListingsMap.tsx`
- `apps/go2asia-pwa-shell/components/rielt/SearchResults/SortDropdown.tsx`
- `apps/go2asia-pwa-shell/components/rielt/ListingDetail/Gallery.tsx`
- `apps/go2asia-pwa-shell/components/rielt/ListingDetail/Summary.tsx`
- `apps/go2asia-pwa-shell/components/rielt/ListingDetail/Description.tsx`
- `apps/go2asia-pwa-shell/components/rielt/ListingDetail/Amenities.tsx`
- `apps/go2asia-pwa-shell/components/rielt/ListingDetail/HouseRules.tsx`
- `apps/go2asia-pwa-shell/components/rielt/ListingDetail/AvailabilityCalendar.tsx`
- `apps/go2asia-pwa-shell/components/rielt/ListingDetail/LongTermConditions.tsx`
- `apps/go2asia-pwa-shell/components/rielt/ListingDetail/Location.tsx`
- `apps/go2asia-pwa-shell/components/rielt/ListingDetail/Owner.tsx`
- `apps/go2asia-pwa-shell/components/rielt/ListingDetail/Verification.tsx`
- `apps/go2asia-pwa-shell/components/rielt/ListingDetail/CTAPanel.tsx`
- `apps/go2asia-pwa-shell/components/rielt/Shared/EmptyState.tsx`
