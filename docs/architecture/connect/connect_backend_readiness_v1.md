# Connect Asia Backend Readiness v1

## 1. Purpose

Этот документ фиксирует readiness-audit по Connect Asia как user-side economy layer и предлагает sequencing следующих implementation slices.

Цель текущего pass:

- не писать код;
- не менять API/DB/UI;
- зафиксировать текущую backend/domain реальность;
- выделить gaps и выбрать первый минимально рискованный slice.

Status update:

- Connect-001 contract lock created: `docs/architecture/connect/connect_runtime_contract_lock_v1.md`.

---

## 2. Canon Context

Согласно Platform Canon v2 и текущим locked decisions:

- Connect Asia = продуктовый/UI-хаб, не отдельный backend-domain service.
- Points Service = владелец ledger, balances, transactions и reward execution.
- Referral Service = владелец referral graph и referral earnings read surfaces.
- RF/voucher layer владеет voucher lifecycle; Connect не должен менять voucher status.
- Missions = future orchestration layer; не часть Quest и не ledger owner.
- Badges = текущий off-chain runtime; NFT/G2A/on-chain = future layer.

Ключевая формула текущего состояния:

> Connect backend сейчас = composition существующих сервисов (Points + Referral + bounded handoffs), а не `connect-service`.

---

## 3. Current Connect Model

Текущая модель Connect:

- **Что это:** UI layer + read-model consumption, без собственного backend ownership.
- **Где реализовано:**
  - frontend: `apps/go2asia-pwa-shell/app/(authenticated)/connect/*`, `apps/go2asia-pwa-shell/components/connect/*`;
  - backend read model: `GET /v1/points/connect-dashboard` в `apps/points-service/src/index.ts`;
  - SDK hooks: `@go2asia/sdk/connectDashboard`, `balance`, `transactions`, `referrals`, `badges`.
- **Какие данные агрегирует сейчас:**
  - Points balance и recent transactions;
  - referrals summary;
  - badges summary;
  - без voucher user-visibility в connect-dashboard baseline.

---

## 4. Ownership Boundaries

Connect **не владеет**:

- Points ledger и балансами;
- voucher lifecycle (claim/redeem/status truth);
- RF domain model и бизнес-логикой RF;
- reward execution правилами;
- referral graph truth.

Connect **может**:

- агрегировать read-only данные;
- показывать пользователю unified economy snapshot;
- направлять пользователя в доменные потоки (wallet/referrals/quests/RF surfaces) без мутаций.

---

## 5. Backend Capabilities

### 5.1 Points Service (owner-side capabilities)

Подтверждённые user-facing read endpoints:

- `GET /v1/points/balance`
- `GET /v1/points/transactions`
- `GET /v1/points/badges`
- `GET /v1/points/badges/mine`
- `GET /v1/points/connect-dashboard`

Подтверждённые internal write endpoints:

- `POST /internal/points/add`
- `POST /internal/points/badges/award`

Факты:

- action taxonomy зафиксирован (`ACTIONS_PHASE2`, включая `rf_voucher_claimed`, `rf_voucher_redeemed`);
- idempotency на стороне ledger через `externalId`;
- `connect-dashboard` уже отдаёт bounded read-model:
  - `balance`
  - `recentTransactions`
  - `referrals` summary
  - `badges` summary.

### 5.2 Referral Service

Подтверждённые user-facing endpoints:

- `GET /v1/referral/code`
- `GET /v1/referral/stats`
- `GET /v1/referral/tree`
- `GET /v1/referral/earnings`
- `POST /v1/referral/claim`

Подтверждённые internal endpoints:

- `POST /internal/referral/mark-first-login`
- `POST /internal/referral/generate-code`
- `POST /internal/referral/link`

Факты:

- referral graph и activation facts принадлежат referral-service;
- earnings read-model строится по referral relations + matched points transactions.

### 5.3 Auth Service relevance

- auth-service влияет на Connect косвенно как producer событий/интеграций;
- auth-service не является Connect read owner и не даёт самостоятельный user economy read model для Connect.

### 5.4 Schema baseline

- `packages/db/src/schema/points.ts`: `points_transactions`, `user_balances`, `badges`, `user_badges`.
- `packages/db/src/schema/referral.ts`: `referral_links`, `referral_relations`.
- `packages/db/src/schema/auth.ts`: `users`, `user_profiles` (identity/profile layer, не economy owner).

---

## 6. Voucher Awareness

Текущая voucher-awareness в Connect:

- в текущем Connect backend/read-model нет выделенного user-side voucher блока;
- `GET /v1/points/connect-dashboard` не возвращает vouchers/status;
- в Connect frontend нет подтверждённого live источника voucher list/status как части connect economy snapshot.

Итог:

- пользовательская видимость vouchers в Connect сейчас частичная/отсутствующая;
- bridge между RF voucher read side и Connect user economy view не зафиксирован как runtime baseline.

---

## 7. Frontend State (brief)

Наблюдаемые Connect surfaces:

- Dashboard (`/connect`) — live через `useGetConnectDashboard`.
- Wallet (`/connect/wallet`) — live через `useGetBalance` + `useGetTransactions`.
- Referrals (`/connect/referrals`) — live через referral hooks.
- Levels (`/connect/levels`) — без подтверждённого backend truth.
- Missions (`/connect/missions`) — placeholder/future copy.
- Analytics (`/connect/analytics`) — placeholder/future copy.

Краткий вывод:

- ядро Connect (dashboard/wallet/referrals) уже имеет реальные backend read surfaces;
- часть экранов остаётся future/placeholder и несёт риск смешения с legacy/mock expectations;
- voucher user visibility в Connect не оформлена как live baseline.

---

## 8. Readiness Map

| Area | Current state | Readiness | Notes |
| --- | --- | --- | --- |
| points | Сильный runtime baseline (`balance`, `transactions`, `badges`, `connect-dashboard`) | High | Ledger owner и read surfaces уже в `points-service` |
| referrals | Сильный runtime baseline (`code/stats/tree/earnings`) | High | Ownership чисто в `referral-service` |
| vouchers (user-side) | Нет явного Connect read baseline | Low | Нужна read-only visibility интеграция от RF side |
| connect dashboard | Реализован в `points-service` как bounded read model | Medium-High | Есть риск scope creep в hidden owner |
| activity | Частично закрыто через points transactions/recentTransactions | Medium | Нет единого cross-domain activity stream |
| rewards visibility | Points+badges+referrals видимы; vouchers не включены | Medium | Неполный user economy snapshot |
| RF integration | RF готов как supply-side; Connect bridge минимальный | Low-Medium | Read-side связь с user vouchers не зафиксирована |
| frontend surfaces | Dashboard/Wallet/Referrals ближе к live; остальное future/placeholder | Medium | Риск demo-vs-live и legacy copy drift |

---

## 9. Risk Zones

- Connect read-model может начать накапливать ownership-логику (нарушение CA-011 guardrails).
- UI/placeholder блоки могут восприниматься как runtime truth (demo-vs-live drift).
- Отсутствие voucher visibility в Connect мешает целостной user economy картине после завершения RF.
- Клиентская агрегация может тихо утащить domain logic в UI.
- Переходные internal reward flows (pre-Missions) без чётких границ могут закрепиться как постоянная архитектура.

---

## 10. Implementation Sequencing

Предлагаемые bounded slices (без кода в этом документе):

1. **Connect-001: Runtime Inventory and Contract Lock**  
   Зафиксировать current runtime Connect model, ownership границы и read-model guardrails в одном contract-lock документе.

2. **Connect-002: User Economy Read-Model Baseline**  
   Уточнить минимальный canonical user-economy contract: какие поля считаются обязательными для Connect snapshot (без write flows).

3. **Connect-003: Voucher Visibility Integration (read-only)**  
   Добавить read-only visibility пользовательских vouchers/status в Connect layering без изменения voucher lifecycle ownership.

4. **Connect-004: Activity Stream Baseline**  
   Зафиксировать bounded activity model для user-side economy timeline (без нового event bus и без mutation ownership).

5. **Connect-005: Reward Display Baseline**  
   Согласовать display contract для Points/Badges/Referral/Voucher visibility с явными future-границами (G2A/NFT/levels/missions analytics).

---

## 11. First Practical Slice

**Выбран первый slice: Connect-001 — Runtime Inventory and Contract Lock.**

Почему именно он:

- минимальный риск и docs-first;
- не требует Points mutation;
- не требует UI rewrite;
- не требует сложной интеграции между сервисами;
- снижает риск скрытого расширения Connect ownership до начала implementation.

Ожидаемый результат Connect-001:

- явный lock current runtime surfaces (`points-service`, `referral-service`, connect dashboard);
- явные non-goals для Connect (no ledger ownership/no voucher lifecycle ownership/no reward execution ownership);
- разрешённые следующие slices (Connect-002..005) с bounded scope.

---

## 12. Open Questions

Вопросы для owner-решений перед implementation:

1. Какая минимальная каноническая модель user-side economy snapshot обязательна для Connect v1?
2. Где должна жить read-only voucher visibility contract часть: в отдельном Connect contract или в междоменном RF↔Connect contract?
3. Нужно ли включать referral earnings detail в dashboard baseline или держать только summary + drilldown endpoint?
4. Какой уровень activity aggregation допустим без нового сервиса/без нарушения ownership?
5. Как формально пометить future sections (levels/missions/analytics), чтобы исключить интерпретацию как live-runtime?

---

## 13. Non-Goals

- Не писать backend/runtime код в рамках этого pass.
- Не менять API/OpenAPI.
- Не менять DB schema/migrations.
- Не делать UI implementation/rewrite.
- Не добавлять Points integration changes.
- Не добавлять новый сервис (`connect-service` и т.п.).
- Не расширять scope за пределы readiness audit + sequencing.

