# RF Asia Stage 1+2 Implementation Plan v1

Статус: planning-only, read-only аналитика.  
Ограничения этого pass: без runtime-кода, без schema/db изменений, без SQL, без миграций, без OpenAPI/SDK правок.

## Executive summary

Этот bounded slice покрывает:
- **Stage 1**: RF domain model baseline stabilization.
- **Stage 2 (ключевая часть)**: voucher lifecycle baseline с безопасной backward-совместимостью.

Главная цель: сделать RFVoucher управляемым доменным объектом с предсказуемыми статусами/переходами, не ломая текущий Rielt voucher flow и Connect summary.

Критические принципы:
- Сначала контракт и совместимость, потом расширения.
- Не внедрять сейчас premium unlock, Points+NFT, full PRO rewards, on-chain.
- Сохранить текущие API-флоу рабочими через transitional mapping.

## Current RF baseline

## 1) Domain entities (as-is)

### Partner (`rf_partner`)

- **Где определён**: `packages/db/migrations/0020_rf_core_v1.sql`, runtime: `apps/rf-service/src/store.ts`.
- **Ключевые поля**: `id`, `slug`, `display_name`, `country_id`, `city_id`, `status`, `owner_user_id`, `created_at`, `updated_at`.
- **Статусы**: `active`, `archived`.
- **API**: `GET /v1/rf/partners`, `GET /v1/rf/partners/{partnerId}`, `POST /v1/rf/business/partners`.
- **Frontend зависимости**: RF каталог/карточка партнёра, RF listing offers context.
- **Риски**: partner ownership и lifecycle активности сильно влияют на claim/redeem доступность.

### PartnerOffer (`rf_offer`)

- **Где определён**: `packages/db/migrations/0020_rf_core_v1.sql`, runtime: `apps/rf-service/src/store.ts`.
- **Ключевые поля**: `id`, `partner_id`, `offer_type`, `visibility`, `status`, тексты/terms, timestamps.
- **Статусы**: `draft`, `active`, `archived`.
- **Связанные enum**: `offer_type` (`discount`, `bundle`, `gift`, `access`, `campaign`, `event_related`), `visibility` (`public`, `pro_only`, `invite_only`).
- **API**: `GET /v1/rf/offers`, `GET /v1/rf/offers/{offerId}`, business create/activate endpoints.
- **Frontend зависимости**: `/rf/vouchers` (по факту каталог офферов), RF partner pages, listing voucher selector.
- **Риски**: фактический claim ориентирован на `active + public`; `pro_only/invite_only` пока не раскрывают полную целевую модель.

### RFVoucher (`rf_voucher`)

- **Где определён**: `0020_rf_core_v1.sql`, расширения `0046_rf_voucher_listing_claim_scope_v1.sql`, `0047_rf_voucher_scope_aware_unique_indexes_v1.sql`.
- **Ключевые поля**: `id`, `offer_id`, `partner_id`, `issued_to_user_id`, `status`, `code`, `claimed_at`, `redeemed_at`, `claim_scope`, `rielt_listing_id`, `rielt_listing_title_snapshot`, timestamps.
- **Текущие статусы**: `claimed`, `redeemed`, `cancelled`.
- **API**: claim endpoints (`/v1/rf/offers/{offerId}/claim`, `/v1/rf/rielt/listings/{listingId}/offers/{offerId}/claim`), `GET /v1/rf/me/vouchers`, `GET /v1/rf/me/vouchers/summary`, business redeem.
- **Frontend зависимости**: RF my-vouchers, RF listing claim route, Connect voucher summary, activity labels.
- **Риски**: статусная модель короче целевой v1; нет полноценной expire/lock/unlock семантики.

### PRO link (`rf_pro_link`)

- **Где определён**: `0020_rf_core_v1.sql`, runtime: `store.ts`.
- **Ключевые поля**: `partner_id`, `pro_user_id`, `role_scope`, `status`.
- **Статусы**: `pending`, `active`, `ended`.
- **API**: `/v1/rf/pro/links` + accept.
- **Риски**: PRO linkage есть, но voucher attribution/reward lifecycle не формализован в Stage 1+2.

### Claim idempotency (`rf_claim_idempotency`)

- **Где определён**: `0020_rf_core_v1.sql`.
- **Ключевые поля**: operation, actor_user_id, idempotency_key, voucher_id, timestamps.
- **Операции**: по факту baseline только claim (`voucher_claim`).
- **API/use-cases**: claim replay/guard, context mismatch guard для listing claim.
- **Риски**: redeem/cancel/lock/unlock идемпотентность пока не формализована аналогично.

### Rielt linkage

- **Где**: `rielt_listing.rf_partner_id`, `rielt_listing.rf_offer_id` (`0038_*`), `rielt_listing_rf_offer` (`0045_*`), runtime cross-check в `apps/rielt-service/*` и RF store.
- **API**: `GET /v1/rf/rielt/listings/{listingId}/offers`, listing-scoped claim.
- **Frontend**: Rielt listing CTA → RF listing vouchers page.
- **Риски**: dual source-of-truth (listing refs + mapping table) может приводить к дрейфу.

### Wallet/voucher summary read-model

- **RF summary**: `GET /v1/rf/me/vouchers/summary`, агрегат по `claimed/redeemed/cancelled`.
- **Connect wallet summary**: `GET /v1/wallet/summary` в points-service (points ledger), не является полноценной voucher state model.
- **Риски**: семантический разрыв между RF voucher statuses и Connect wallet/read-model метриками.

## Target Stage 1 domain baseline

## 1) Что оставить as-is

- `Partner`, `PartnerOffer`, `RFVoucher`, `rf_pro_link`, `rf_claim_idempotency` как существующий backbone.
- Claim флоу partner-scope и listing-scope.
- Rielt voucher CTA flow и текущие route точки в frontend.

## 2) Что минимально уточнить в Stage 1

- **Partner**: зафиксировать инварианты `status/visibility` в контракте и доменной документации.
- **PartnerOffer**: нормализовать трактовку `offerType/offerKind/visibility/status` и запретить неоднозначные комбинации на уровне validation contract.
- **RFVoucher**: закрепить как основной управляемый объект lifecycle (даже до полного Stage 2).
- **Boundary rules**: явно зафиксировать ownership RF vs Rielt vs Connect на уровне API описаний.

## 3) Что подготовить, но не внедрять в Stage 1

- `VoucherRule`/`VoucherPolicy` как extension-point (без полноценного unlock движка).
- `UserVoucherState` как read-model design (решение о таблице в Stage 2).
- `VoucherCampaign` — optional, отложить.
- `PartnerLocation` — optional, отложить если достаточно текущего geo.
- `PROAttribution`, `PartnerRewardPolicy` — только интерфейсные placeholders и doc-level hooks.

## Target Stage 2 lifecycle baseline

## 1) Целевые статусы

`available`, `locked`, `unlocked`, `redeemed`, `expired`, `cancelled`

## 2) Backward mapping с текущим status

- Transitional mapping: `claimed -> available` (каноническая трактовка для совместимости).
- На переходный период сохранить legacy-интерпретацию через alias/deprecation в API contract.

## 3) Допустимые переходы

- `available -> locked`
- `available -> redeemed` (если unlock не обязателен для конкретного оффера)
- `available -> expired`
- `available -> cancelled`
- `locked -> unlocked`
- `locked -> expired`
- `locked -> cancelled`
- `unlocked -> redeemed`
- `unlocked -> expired`
- `unlocked -> cancelled`

Терминальные:
- `redeemed`, `expired`, `cancelled` (без обратных переходов).

## 4) Запрещённые переходы

- Любой переход из терминальных статусов.
- `locked -> redeemed` (если policy требует unlock step).
- Любые «rollback» переходы типа `redeemed -> available`.

## 5) Операции и идемпотентность (Stage 2 baseline)

- **claim**: оставить текущую idempotency-модель (`rf_claim_idempotency`), расширить семантику под новый canonical status.
- **lock/unlock**: добавить идемпотентные мутации (design-level; без реализации сейчас).
- **redeem**: добавить явную idempotency стратегию (ключ/operation replay) аналогично claim.
- **cancel/expire**: deterministic no-op при повторе и журналирование причины/actor.

## VoucherRedemption recommendation

Рекомендация: **ввести отдельную сущность `VoucherRedemption` уже в Stage 2** (как минимальный факт операции).

Минимальные поля:
- `id`
- `voucher_id`
- `user_id`
- `partner_id`
- `context_type`
- `context_ref`
- `result_status`
- `redeemed_at`
- `idempotency_key` (или `operation_id`) для повторных вызовов

Связи:
- `rf_voucher` 1:N `voucher_redemption` (для истории попыток или 1:1 на success-only варианте).
- linkage с user/partner для поддержки аудита.

Совместимость с текущим redeem flow:
- сохранить update `rf_voucher.status=redeemed` как canonical state,
- дополнительно фиксировать redemption record,
- повторные redeem отдавать idempotent replay, а не 500/непредсказуемый side effect.

## Operation/history recommendation

Рассмотренные варианты:
- **A**: отдельная таблица `rf_voucher_event`.
- **B**: расширять только `rf_claim_idempotency + timestamps`.
- **C**: временно жить без event table (`updated_at + redemption record`) и явно зафиксировать долг.

Рекомендация для текущего Go2Asia slice:
- **Stage 2 принять гибрид C+**:  
  1) обязательно `VoucherRedemption`,  
  2) расширить operation metadata/idempotency для ключевых мутаций,  
  3) event table `rf_voucher_event` запланировать следующим bounded шагом после стабилизации lifecycle.

Почему не A сразу:
- больше surface area и migration-риск для bounded slice.

Почему не B-only:
- недостаточно для поддержки и аудита lifecycle при спорных кейсах.

## Schema migration plan (future, не выполнять сейчас)

Step M1 — Voucher status normalization:
- подготовить enum migration strategy под v1 статусы и mapping для legacy `claimed`.

Step M2 — VoucherRedemption:
- добавить таблицу redemption и связи к voucher/user/partner.

Step M3 — Operation metadata:
- расширить idempotency/operation trace для redeem/cancel/expire/lock/unlock.

Step M4 — Optional read-model hooks:
- при необходимости подготовить `user_voucher_state` (только если RF summary окажется недостаточным).

Проверки до применения миграций:
- data backfill strategy для legacy statuses.
- unique/index review для partner-scope и listing-scope claim.
- rollback SQL draft (forward/backward safe steps).

## OpenAPI/SDK plan (future, не выполнять сейчас)

## 1) `docs/openapi/rf.yaml`

Нужно подготовить:
- расширенный lifecycle contract (`RfVoucher.status` или `canonicalStatus` + versioning field),
- transitional compatibility для `claimed`,
- обновление `RfVoucherSummary` (чёткая трактовка active/locked/unlocked/used/cancelled/expired),
- `Redeem` response enrichment с redemption reference,
- operation-level error codes для lifecycle transitions.

## 2) Backward compatibility strategy

- additive rollout: новые поля + deprecated старые трактовки;
- не удалять legacy статус в первом релизе контракта;
- документировать mapping rules в schema descriptions.

## 3) SDK

После OpenAPI обновления:
- regen `packages/sdk/src/generated/*`,
- синхронизировать ручные wrappers в `packages/sdk/src/rf.ts`,
- проверить типовые дрейфы между generated types и hand-written DTO unions.

## Backend implementation plan (future execution sequence)

Step 1 — schema migration draft
- **Области**: `packages/db/migrations/*`
- **Что меняется**: lifecycle enum strategy, voucher_redemption, operation metadata.
- **Проверки**: forward/backward SQL review, index impact, data migration dry-run design.
- **Риски**: status backfill ошибки, lock contention.
- **Rollback**: reversible migration pair + compatibility views/aliases.

Step 2 — runtime type update
- **Области**: `apps/rf-service/src/*` types/validators/store contracts.
- **Что меняется**: canonical lifecycle status model и transition guards.
- **Проверки**: compile + domain validation tests.
- **Риски**: несовместимость с текущими response DTO.
- **Rollback**: feature-flag/compat mapping слой.

Step 3 — store/use-case lifecycle transitions
- **Области**: `apps/rf-service/src/store.ts`, routes/use-cases.
- **Что меняется**: claim/redeem/cancel/expire/lock/unlock transition logic + idempotency path.
- **Проверки**: integration tests переходов и replay.
- **Риски**: race conditions и duplicate transitions.
- **Rollback**: fallback на legacy transition policy.

Step 4 — OpenAPI contract update
- **Области**: `docs/openapi/rf.yaml` (+ cross-ref описания в `rielt.yaml`, `points.yaml` при необходимости).
- **Что меняется**: lifecycle schemas, response DTO, error codes.
- **Проверки**: spec lint/bundle validation.
- **Риски**: breaking downstream clients.
- **Rollback**: dual-field contract window.

Step 5 — SDK regeneration
- **Области**: `packages/sdk/src/generated/*`, `packages/sdk/src/rf.ts`.
- **Что меняется**: типы статусов, claim/redeem responses, summary DTO.
- **Проверки**: sdk build/typecheck.
- **Риски**: ручные wrapper drift.
- **Rollback**: pin SDK version + temporary adapter in wrapper.

Step 6 — frontend adaptation
- **Области**: RF my-vouchers, listing claim flow, Rielt CTA glue, Connect voucher summary.
- **Что меняется**: status label mapping, response handling, minimal query invalidation.
- **Проверки**: smoke и regression проходы.
- **Риски**: неверные статусы в UI.
- **Rollback**: UI compatibility mapping + emergency hide of affected card blocks.

Step 7 — tests
- **Области**: RF service unit/integration, contract tests, SDK compile, frontend smoke.
- **Что меняется**: полный набор проверок lifecycle/idempotency.
- **Проверки**: CI gate по lifecycle matrix.
- **Риски**: ложноположительные/непокрытые переходы.
- **Rollback**: зафиксированные test fixtures и legacy-режим матрицы.

Step 8 — docs update
- **Области**: `docs/architecture/domain/*`, `docs/audits/*`, `docs/economy/*` (если затрагивается терминология).
- **Что меняется**: финальные контракты и transition mapping.
- **Проверки**: docs/runtime consistency review.
- **Риски**: повторный naming drift.
- **Rollback**: versioned docs notes + changelog matrix.

## Frontend impact (minimal, no UX polish)

Обязательные точки адаптации:
- RF vouchers list (если затрагивается статусная витрина/availability semantics).
- RF my-vouchers (`/rf/my-vouchers`) — статусные бейджи и фильтры.
- RF listing voucher claim route (`/rf/rielt/listings/[listingId]/vouchers`) — idempotent replay + transition UX.
- Rielt listing CTA (сохранить текущий переход в RF flow без redesign).
- Connect voucher summary card — обновить семантику счетчиков при новом lifecycle.
- Wallet/activity feed — только если появляются новые action labels.
- PRO/merchant placeholders — только contract-safe адаптация, без расширения функционала.

Что не делать в этом slice:
- не превращать адаптацию в redesign страниц RF/Rielt/Connect.

## Tests / QA plan

Unit:
- lifecycle transition matrix validator.
- status mapping (`claimed -> available` transitional).
- error/code mapping helpers.

Integration:
- claim flow (partner-scope + listing-scope).
- redeem flow с `VoucherRedemption`.
- cancel/expire deterministic behavior.
- idempotent replay для claim/redeem.

Contract:
- OpenAPI validation (`rf.yaml` compatibility checks).
- SDK generation + compile/typecheck.

Frontend smoke/regression:
- Rielt listing -> RF voucher claim -> RF my-vouchers.
- Connect voucher summary regression.
- wallet/activity feed labels regression (если добавлены новые reasons).

## Backwards compatibility and rollback

Compatibility strategy:
- additive API rollout (новые поля без немедленного удаления старых).
- transitional mapping legacy `claimed`.
- временное dual-reading на frontend (legacy + canonical fields).

Rollback strategy:
- откат API контракта через versioned/flagged response mode.
- откат SDK на предыдущий совместимый пакет.
- UI feature-guard для summary/lifecycle-dependent блоков.

## Explicit non-goals (жёсткие запреты Stage 1+2 slice)

- не внедрять Points spend/lock economy как full feature.
- не внедрять NFT/totem requirement.
- не внедрять on-chain flows.
- не внедрять Blockchain Gateway.
- не делать DAO.
- не строить full reward engine.
- не делать full PRO attribution.
- не переписывать Rielt domain.
- не делать глобальный cleanup legacy mocks.
- не менять смысл VIP-модели.
- не делать большой UI redesign.

## Recommended first implementation task after this plan

Запустить **Task 1: Contract-first lifecycle compatibility design**:
- зафиксировать canonical lifecycle + legacy mapping (`claimed -> available`) в RFC/contract note,
- подготовить детальный migration draft (без применения),
- определить точные изменения `rf.yaml` и compatibility window,
- утвердить lifecycle transition matrix как CI gate criteria.

Это минимально рискованный первый шаг, который разблокирует все последующие implementation задачи Stage 1+2.
