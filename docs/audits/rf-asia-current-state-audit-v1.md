# RF Asia Current State Audit v1

Статус: read-only аудит текущего состояния в монорепозитории Go2Asia.  
Ограничения: без runtime-изменений, без schema/db-изменений, без SQL.

## 1) Scope и источники

Проверены области:
- `apps/*` (frontend и сервисы)
- `packages/*` (SDK, DB migrations, shared contracts)
- `docs/*` (economy, architecture, audits, contracts)
- OpenAPI в `docs/openapi/*`

Ключевые оси поиска:
- RF Asia, Rielt, Connect, voucher, partner, offer, business
- PRO, VIP, referral, points, badge, NFT/totem, reward, wallet
- discount, commission, marketplace, deal

## 2) Найденные RF/Rielt/Connect точки

### Frontend: страницы и экраны

Основной UI-контур:
- `apps/go2asia-pwa-shell/app/(public)/rielt/*`
- `apps/go2asia-pwa-shell/app/(public)/rf/*`
- `apps/go2asia-pwa-shell/app/(authenticated)/connect/*`
- `apps/go2asia-pwa-shell/app/(authenticated)/rf/pro/*`
- `apps/go2asia-pwa-shell/app/(authenticated)/rf/merchant/*`

Ключевые сценарии:
- Rielt listing/detail/search и CTA на ваучеры.
- RF каталог партнёров/офферов, страницы партнёра, мои ваучеры.
- Связка RF+Rielt: `/rf/rielt/listings/[listingId]/vouchers`.
- Connect dashboard/wallet/referrals/levels с отображением RF voucher summary.

### Frontend: активные компоненты

- Rielt: `components/rielt/*`, включая адаптацию DTO с `rfPartnerId` и `rfOfferId`.
- RF: `components/rf/*` (каталоги, карта, избранное, voucher UX).
- Connect: `components/connect/*` (dashboard, wallet, referrals, levels).
- Навигационный мост: `components/app-shell/SideDrawer.tsx` (Rielt + RF + Connect).

### Frontend: legacy/dead artifacts и моки

Кандидаты в legacy/временные артефакты:
- `components/connect/WalletMockView.tsx`
- `components/connect/DashboardMockView.tsx`
- `components/connect/ReferralsMockView.tsx`
- `components/connect/mockData.ts`
- `components/rf/mockData.ts`
- `components/rielt/mockListings.ts` (часть следов уже снята из export-индекса)

Реально используемые API-хуки идут через SDK; часть mock/seed слоёв остаётся в кодовой базе как fallback/демо.

## 3) Backend, schema, API, SDK, seed

### RF доменные сущности (фактически есть)

SQL/DDL и runtime подтверждают наличие:
- `rf_partner`
- `rf_offer`
- `rf_voucher`
- `rf_pro_link`
- `rf_claim_idempotency`

Основные пути:
- `packages/db/migrations/*` (в т.ч. RF core и связки с Rielt)
- `apps/rf-service/src/store.ts`
- `docs/openapi/rf.yaml`
- `packages/sdk/src/generated/*` + `packages/sdk/src/rf.ts`

### Rielt ↔ RF связь (фактически есть)

- Колонки в listing: `rf_partner_id`, `rf_offer_id` (optional refs).
- Таблица связки: `rielt_listing_rf_offer`.
- API: `GET /v1/rf/rielt/listings/:listingId/offers`, claim-потоки для listing-scope.

### Connect / Points / Referral (фактически есть)

- Points ledger слой: `points_transactions`, `user_balances`.
- Wallet summary API: `/v1/wallet/summary`.
- Referral контур: отдельный сервис и таблицы referral-связей.
- Badge контур: `badges`, `user_badges`.

### OpenAPI/SDK

Обнаружены ключевые документы:
- `docs/openapi/rf.yaml`
- `docs/openapi/rielt.yaml`
- `docs/openapi/points.yaml`
- `docs/openapi/referral.yaml`
- `docs/openapi/openapi.bundle.yaml`

SDK-слой:
- `packages/sdk/src/generated/*`
- `packages/sdk/src/rf.ts`
- `packages/sdk/src/rielt.ts`
- `packages/sdk/src/connectDashboard.ts`
- `packages/sdk/src/wallet.ts`, `transactions.ts`, `referrals.ts`, `badges.ts`

### Seed/demo data

- Программные сиды не дают полноценный RF economy baseline как production-like контур.
- Есть отдельные seed/demo и markdown/шаблонные артефакты, часть сценариев остаётся документной или mock-зависимой.

## 4) Текущее состояние RF Asia (краткая карта)

### Что уже есть

- RF как работающий контур партнёров/офферов/ваучеров.
- Rielt интеграция через listing-scope предложения и claim.
- Connect интеграция через wallet summary и RF voucher summary в пользовательском интерфейсе.
- Базовый lifecycle ваучера (claim/redeem/cancel) в backend моделях.

### Что частично реализовано

- Premium-идея присутствует, но преимущественно как offer-kind/контекст листинга, а не как полноценная отдельная модель unlock-экономики.
- PRO/VIP присутствуют, но как сквозная экономика modifiers и attribution покрыты не полностью.

### Что пока не реализовано как зрелый доменный контур

- Полный premium unlock (Points + NFT/totem requirement).
- Funding-модель partner-funded/platform-funded как строгая доменная структура.
- Сквозной voucher operation history как отдельный audit/event слой.
- Единый wallet-like voucher ledger для пользователя (сейчас есть частичные read-model слои).

## 5) Где смешиваются домены

### RF смешан с Rielt

- Одновременно используются refs в `rielt_listing` и mapping-таблица `rielt_listing_rf_offer`.
- Риск двойной source-of-truth для связки listing ↔ offer/voucher.

### RF смешан с Connect

- В пользовательском wallet/UI слой RF читается через Connect-витрины.
- Часть продуктовой логики отображения и классификации событий может жить в frontend-адаптерах.

### Где бизнес-логика рискует быть только во frontend

- Часть семантики wallet-витрин и статусного UX (например интерпретация RF-событий) формируется в UI-слое.
- Остаются mock/fallback артефакты, которые могут маскировать отсутствие backend-контракта в отдельных ветках UI.

## 6) Топ gaps (current state)

- Нет полноценных VoucherUnlockRequirement для Points+NFT как MVP-ready доменной модели.
- Нет явной partner-funded/platform-funded экономической модели в RF schema/API.
- Нет законченной PRO attribution модели для voucher redemption outcomes.
- Нет строгих VIP earning/spending modifiers, связанных с ваучерной экономикой.
- Нет полного набора voucher statuses уровня v1 (`available`, `locked`, `unlocked`, `redeemed`, `expired`, `cancelled`) с единым lifecycle-контрактом.
- Нет полноценной истории операций ваучера как отдельного event журнала.

## 7) Риски

- Дублирование сущностей и связей между RF и Rielt (дрейф контрактов).
- Naming drift между docs и runtime (особенно вокруг Token/Points терминов).
- Legacy/mock артефакты могут вводить в заблуждение и усложнять QA/планирование.
- Частичное соответствие voucher-first baseline: есть хорошие зачатки, но не закрыт экономический цикл premium/unlock.

## 8) Вывод

RF Asia уже сформирован как рабочий бизнес-контур на уровне partner/offer/voucher и интеграций с Rielt/Connect.  
Но до RF Voucher Economy v1 не хватает доменного завершения по unlock-экономике, funding-логике, PRO/VIP attribution и операционной истории ваучера.
