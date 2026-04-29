# Connect Frontend UX Concept v1

- Project: Go2Asia
- Module: Connect Asia
- Scope: frontend UX concept / Bolt prototype preparation / future frontend integration
- Status: UX concept based on current backend truth
- Date: 2026-04-25
- Document role: UX/product SSOT for Connect frontend MVP

---

# Section 1 — Purpose

This document prepares the new Connect v2 frontend concept.

It is based on current backend truth and the Connect Architecture SSOT package:

- `docs/architecture/connect/connect_backend_architecture_v1.md`
- `docs/architecture/connect/connect_dependency_map_v1.md`
- `docs/architecture/connect/connect_domain_model_v1.md`
- `docs/architecture/connect/connect_openapi_outline_v1.md`
- `docs/architecture/connect/connect_service_production_architecture_v1.md`

It also uses:

- `docs/modules/connect/Connect-Asia-Updated-Concept.md`
- `docs/modules/connect/connect_backend_closure_note_v1.md`

This document replaces the old mock-heavy Connect UI direction as the planning source for the next frontend concept.

This document is not:

- an implementation prompt
- a Bolt.New prompt
- a content pack
- a runtime code change
- an OpenAPI change
- an SDK generation pass

Legacy files under `docs/modules/connect/*` remain useful as historical product vision input, but they are not runtime/API SSOT for the current Connect MVP.

---

# Section 2 — Product Definition

Connect Asia is the user's personal center for:

- activity
- Points
- referrals
- off-chain badges
- transparent contribution history

Connect helps the user understand:

- what they have done in Go2Asia
- what Points they received for participation
- which referrals they invited
- which off-chain achievements they earned
- which recent actions are visible in backend-backed history

Connect MVP is not:

- a crypto wallet
- an NFT marketplace
- a tokenomics cabinet
- a levels engine
- a missions engine
- an investment dashboard
- a profit dashboard
- a standalone backend service UI

Product formula:

Connect Asia shows how user participation in Go2Asia becomes Points, referrals, badges, and a clear activity history.

---

# Section 3 — Design Principles

## 3.1 Backend truth first

The UI shows only data backed by current endpoints.

If the backend does not return a fact, the UI must not present it as implemented.

## 3.2 Honest empty states

Empty state is preferred over fake values.

Examples:

- no transactions yet
- no referrals yet
- no badges yet
- reward is being checked

## 3.3 Off-chain language

Current badges are achievements, not NFT.

Use:

- "Бейджи"
- "Достижения"
- "Получено"
- "За активность"

Avoid presenting current badges as assets, tokens, wallet items, or on-chain collectibles.

## 3.4 No investment / crypto tone

Avoid:

- "profit"
- "withdraw"
- "token yield"
- "NFT asset"
- "wallet"
- "earn crypto"
- "доходность"
- "вывод средств"
- "курс токена"

## 3.5 Personal progress, not finance

Use calm contribution language:

- "вклад"
- "активность"
- "достижения"
- "Points за участие"
- "история начислений"
- "приглашения"

Referral copy may use "Заработано Points", but it must remain clear that this is an internal reward system, not financial income.

## 3.6 Mobile-first

Connect is likely used as a personal dashboard in the PWA.

The MVP should work well on:

- narrow mobile screens
- touch navigation
- short dashboard sessions
- quick copy/referral actions

## 3.7 Calm dashboard, not casino / game overload

Gamification should be motivating but not noisy.

Avoid:

- aggressive flashing rewards
- casino-like gradients
- dark crypto wallet styling
- fake urgency
- overloaded charts
- speculative reward promises

---

# Section 4 — Current Backend Data Map

## 4.1 Dashboard

Endpoint:

- `GET /v1/points/connect-dashboard`

Feeds:

- Points balance card
- recent activity card/list
- referral summary card
- recent badges card

Current response sections:

- `balance`
- `recentTransactions`
- `referrals`
- `badges`

## 4.2 Points / Activity

Endpoints:

- `GET /v1/points/balance`
- `GET /v1/points/transactions`

Feeds:

- full activity list
- paginated transaction history
- Points balance where a standalone Activity view needs it

## 4.3 Referrals

Endpoints:

- `GET /v1/referral/code`
- `GET /v1/referral/stats`
- `GET /v1/referral/tree`
- `GET /v1/referral/earnings`
- `POST /v1/referral/claim`

Feeds:

- referral code card
- copy link action
- referral summary
- referral tree/list
- referral earnings list
- pending / rewarded / reward_missing states

## 4.4 Badges

Endpoints:

- `GET /v1/points/badges`
- `GET /v1/points/badges/mine`

Feeds:

- my badges
- badge catalog
- recent badges
- empty state and first badge hint

## 4.5 Do not use

The frontend MVP must not use:

- `/api/connect`
- `/v1/connect/*`
- `/v1/token/*`
- `/v1/wallet/*`
- G2A APIs
- NFT APIs
- levels APIs
- missions APIs
- analytics APIs
- rankings APIs

These may exist in legacy docs or future vision notes, but they are not current MVP surfaces.

---

# Section 5 — Recommended MVP Navigation

Recommended MVP tabs:

1. Главная
2. Активность
3. Рефералы
4. Бейджи

These tabs map directly to current backend truth.

## 5.1 Главная

Purpose:

- quick personal snapshot
- balance
- recent activity
- referral summary
- recent badges
- empty-state guidance

Primary endpoint:

- `GET /v1/points/connect-dashboard`

## 5.2 Активность

Purpose:

- transparent Points history
- list of actions and applied Points movements

Primary endpoints:

- `GET /v1/points/balance`
- `GET /v1/points/transactions`

## 5.3 Рефералы

Purpose:

- invitation code/link
- referral progress
- referral earnings

Primary endpoints:

- `GET /v1/referral/code`
- `GET /v1/referral/stats`
- `GET /v1/referral/tree`
- `GET /v1/referral/earnings`

## 5.4 Бейджи

Purpose:

- off-chain achievements
- received badges
- available catalog

Primary endpoints:

- `GET /v1/points/badges`
- `GET /v1/points/badges/mine`

## 5.5 Future hidden / disabled sections

Do not expose as active MVP tabs:

- Levels
- Missions
- Analytics
- Wallet
- G2A
- NFT
- PRO economy

The old 7-tab structure should not be used as current MVP because it included Levels, Missions, Analytics and G2A/NFT/wallet concepts without backend truth.

---

# Section 6 — Dashboard UX

The dashboard should be a calm personal snapshot, not a finance console.

Primary endpoint:

- `GET /v1/points/connect-dashboard`

## 6.1 Points balance card

Shows:

- current Points
- optional `updatedAt` if useful
- short explanation that Points reflect activity in Go2Asia

Does not show:

- G2A balance
- NFT count
- wallet status
- withdrawal/deposit actions

Suggested copy:

- "Ваши Points"
- "Points за участие"
- "Обновлено недавно" if `updatedAt` is present

## 6.2 Recent activity card/list

Shows:

- recent transactions from `recentTransactions`
- short action labels
- amount
- date
- source icon or subtle source label when useful

Empty state:

- "История начислений появится после первых действий в Go2Asia."

Do not show:

- raw metadata dump
- speculative future rewards
- fake activity rows

## 6.3 Referral summary card

Shows:

- total referrals
- activated referrals
- pending referrals
- earned Points
- CTA to Referrals tab

Suggested copy:

- "Ваши приглашения"
- "Заработано Points"
- "Перейти к рефералам"

Empty state:

- "Пригласите друга, чтобы начать реферальную историю."

## 6.4 Recent badges card

Shows:

- total badges
- latest badges
- CTA to Badges tab

Suggested copy:

- "Ваши бейджи"
- "Последние достижения"
- "Смотреть все бейджи"

Empty state:

- "Завершите первый квест, чтобы получить первый бейдж."

## 6.5 Optional Next useful step placeholder

Allowed only as static guidance based on empty states.

Examples:

- if no transactions: "Начните с первого квеста."
- if no referrals: "Пригласите друга."
- if no badges: "Завершите первый квест, чтобы получить первый бейдж."

Rules:

- do not create fake missions
- do not show reward promises not returned by backend
- do not calculate personalized recommendations without backend truth

## 6.6 Dashboard empty states

Required empty states:

- no points
- no transactions
- no referrals
- no badges

Each empty state should explain what is missing and what real next action may help.

---

# Section 7 — Activity / Points UX

The Activity tab is a transparent Points history.

Primary endpoints:

- `GET /v1/points/balance`
- `GET /v1/points/transactions`

## 7.1 Transaction list

Each transaction row should show:

- action label
- Points amount
- date
- source service label if useful
- optional source event hint only as subtle technical context

Amount styling:

- positive amount: calm positive style
- negative amount, if present later: neutral/debit style
- no casino reward animation

Do not show:

- full metadata JSON
- raw internal IDs as primary content
- token conversion assumptions

## 7.2 Action label dictionary

Canonical UX labels:

- `registration` → "Регистрация"
- `first_login` → "Первый вход"
- `quest_completed` → "Квест завершён"
- `referral_bonus_referrer` → "Бонус за приглашённого пользователя"
- `event_registration` → "Регистрация на событие"
- fallback → "Активность Go2Asia"

If an action is unknown, show the fallback label rather than exposing a raw enum as primary copy.

## 7.3 Future filters

Filters are future enhancements:

- by action
- by period
- by source

The MVP prototype may show the layout space for filters only if it does not imply unsupported backend behavior.

---

# Section 8 — Referrals UX

The Referrals tab shows invitations and referral reward status without tokenomics language.

Primary endpoints:

- `GET /v1/referral/code`
- `GET /v1/referral/stats`
- `GET /v1/referral/tree`
- `GET /v1/referral/earnings`
- `POST /v1/referral/claim`

## 8.1 Referral code card

Shows:

- referral code
- referral link
- copy link button

Suggested copy:

- "Ваша реферальная ссылка"
- "Скопировать ссылку"
- "Поделитесь ссылкой с другом"

Do not require QR in MVP unless the frontend can generate it locally without implying backend ownership.

## 8.2 Referral summary

Shows:

- "Приглашено всего"
- "Активировались"
- "Ожидают активации"
- "Заработано Points"

The UI should not show:

- G2A rewards
- partner referral income
- business referral revenue
- multi-level tokenomics

## 8.3 Referral earnings list

Shows referral reward rows from `GET /v1/referral/earnings`.

Statuses:

- pending
- rewarded
- reward_missing

Status copy:

- pending → "Ожидает активации"
- rewarded → "Начислено"
- reward_missing → "Активация есть, начисление проверяется"

## 8.4 Referral tree / list

Shows:

- referred user identifiers in privacy-safe form
- registered date
- first login / active status if returned
- nested referrals only if the current API response supports it

Do not invent:

- names
- avatars
- profile details
- partner identities

## 8.5 Avoid

Avoid:

- multi-level tokenomics
- partner referrals
- PRO earnings
- G2A rewards
- income language
- investment language

---

# Section 9 — Badges UX

The Badges tab presents off-chain achievements.

Primary endpoints:

- `GET /v1/points/badges`
- `GET /v1/points/badges/mine`

## 9.1 My badges

Shows:

- badges awarded to the current user
- awarded date
- title
- description when available
- icon

Empty state:

- "У вас пока нет бейджей."
- "Завершите первый квест, чтобы получить первый бейдж."

## 9.2 Badge catalog

Shows:

- active badge catalog
- available badges
- locked/unawarded badges if catalog supports it

Rules:

- do not show fake progress toward a badge unless backend supports progress
- do not invent unlock criteria that are not known

## 9.3 Recent badges

Dashboard may show a small recent badge list from `GET /v1/points/connect-dashboard`.

Full Badges tab should use `GET /v1/points/badges/mine` and `GET /v1/points/badges`.

## 9.4 Badge language

Use:

- "Бейджи"
- "Достижения"
- "Получено"
- "Доступные бейджи"

Docs may say "off-chain achievements"; the UI can use simpler Russian product copy.

Do not call current badges:

- NFT
- assets
- collectibles
- tokens

## 9.5 Current known badge

Known badge:

- `first_quest_completed`

Suggested UI title:

- "Первый квест завершён"

Suggested description:

- "Вы завершили первый квест в Go2Asia."

Suggested empty hint:

- "Завершите первый квест, чтобы получить первый бейдж."

## 9.6 Future badge

Future badge:

- `first_referral_activated`

Rule:

- show it only if present in the backend catalog.
- auto-award may be future and must not be assumed in UI.

---

# Section 10 — Legacy UI Mapping

| Legacy block | Keep | Retire | Future | Reason |
| --- | --- | --- | --- | --- |
| Connect Asia identity/header | Yes | No | No | Useful product identity if copy is reframed away from economy/tokenomics. |
| Cards layout | Yes | No | No | Works well for mobile dashboard and backend-backed sections. |
| Tabs pattern | Yes | No | No | Keep pattern, reduce MVP navigation to four tabs. |
| Referral code card | Yes | No | No | Backend-backed by `GET /v1/referral/code`. |
| Recent activity | Yes | No | No | Backend-backed by Points transactions and dashboard recentTransactions. |
| Badges as achievements | Yes | No | No | Backend-backed as off-chain badges. |
| G2A Tokens | No | Yes | Future only | No current backend truth or `/v1/token/*` API. |
| NFT Badges as wallet assets | No | Yes | Future only | Current badges are off-chain achievements, not NFT assets. |
| Deposit / Withdraw | No | Yes | Future only | Wallet and token withdrawal are not implemented. |
| Level / XP | No | Yes | Future only | No progression backend truth. |
| Active season | No | Yes | Future only | No season/progression API. |
| Missions | No | Yes | Future only | Quest is separate; Connect missions do not exist in MVP. |
| Analytics charts | No | Yes | Future only | No analytics aggregates API. |
| Leaderboards | No | Yes | Future only | No ranking backend truth. |
| Business referrals | No | Yes | Future only | Not current Referral MVP and risks PRO/partner scope drift. |
| Partner income | No | Yes | Future only | No partner income backend truth and risky finance language. |
| Forecasts | No | Yes | Future only | Would be fake without analytics/recommendation backend. |
| Progression | No | No | Future only | Requires progression backend truth. |
| Recommendations | Static only | No | Future only | Personalized recommendations require backend truth. |
| Analytics | No | No | Future only | Requires aggregates and privacy model. |
| G2A / wallet | No | No | Future only | Requires legal, architecture, and backend pass. |
| NFT minting | No | No | Future only | Requires badge-to-NFT bridge and Blockchain Gateway. |

---

# Section 11 — UI States

## 11.1 Loading state

User sees:

- skeleton cards
- loading rows
- no fake values
- no mock substitution during normal API loading

Purpose:

- preserve trust while backend data loads.

## 11.2 Empty new user

User sees:

- 0 Points
- no recent activity
- referral link/code available when backend returns it
- no badges
- calm next-step hints

Suggested copy:

- "Ваша активность появится здесь после первых действий."
- "Пройдите первый квест, чтобы получить первый бейдж."
- "Пригласите друга, чтобы начать реферальную историю."

## 11.3 First quest completed

User sees:

- Points transaction for quest completion if delivered
- `first_quest_completed` badge if awarded
- recent activity item "Квест завершён"

If badge is not awarded yet:

- do not show fake badge
- Badges tab remains based on `GET /v1/points/badges/mine`

## 11.4 Referral pending

User sees:

- referral row in pending/registered state
- no earned Points yet

Suggested copy:

- "Ожидает активации"

## 11.5 Referral rewarded

User sees:

- referral row with rewarded status
- earned Points
- corresponding summary update

Suggested copy:

- "Начислено"

## 11.6 Reward missing

User sees:

- referral row with clear non-alarming status

Suggested copy:

- "Активация есть, начисление проверяется"

Do not:

- double-count reward on frontend
- show fake manual credit

## 11.7 Badges empty

User sees:

- empty badge state
- first quest hint
- badge catalog if available

Suggested copy:

- "У вас пока нет бейджей."
- "Завершите первый квест, чтобы получить первый бейдж."

## 11.8 Backend error

User sees:

- section-level or page-level error
- retry action where appropriate
- no fake fallback to legacy economy dashboard

Suggested copy:

- "Не удалось загрузить данные. Попробуйте ещё раз."

## 11.9 Partial data unavailable

User sees:

- available sections still rendered
- failed section shows local error state

Example:

- dashboard balance loads
- referral summary fails
- referral card shows "Не удалось загрузить рефералы" with retry

---

# Section 12 — Error and Fallback Policy

Rules:

- no full fallback to old mock dashboard when API fails
- show loading, error, or empty states
- do not replace backend errors with fake G2A, NFT, wallet, levels, missions, analytics, or ranking values
- preserve user trust
- partial sections may show section-level error if one endpoint fails
- never call internal APIs from browser UI
- never use legacy `/api/connect` fallback

Allowed fallback:

- local UI skeleton
- empty state
- retry button
- "section unavailable" message
- static explanatory copy

Not allowed fallback:

- mock G2A balance
- mock NFT count
- mock level
- mock mission progress
- mock analytics chart
- fake partner income
- fake leaderboard rank

---

# Section 13 — Visual Direction

Style for the future Bolt.New prototype:

- modern PWA dashboard
- clean card layout
- mobile-first
- desktop responsive grid
- soft gradients allowed
- subtle tropical / Asia feeling
- readable Russian UI copy
- calm icons for Points, activity, referrals, badges
- friendly empty states
- visible but not aggressive CTAs

Avoid:

- crypto wallet vibe
- dark casino styling
- tourist cliché overload
- aggressive "earn money" CTA
- token trading visuals
- NFT marketplace visuals
- dense analytics dashboard
- over-gamified reward fireworks

Suggested tone:

- warm
- transparent
- motivating
- grounded in real actions

---

# Section 14 — Bolt.New Prototype Requirements

The next Bolt.New prototype should create a high-fidelity frontend prototype for Connect v2.

Prototype scope:

- Главная
- Активность
- Рефералы
- Бейджи

Prototype should include:

- mobile layout
- desktop responsive layout
- dashboard cards
- activity list
- referral code/link card
- referral summary
- referral states
- badges catalog / my badges concept
- empty states
- error/partial state examples if practical
- Russian UI copy

Mock data is allowed only as design sample data.

Mock data must not introduce fake features.

The prototype must not include:

- G2A
- NFT
- wallet
- levels
- missions
- analytics
- leaderboards
- withdrawals
- deposits
- token conversion
- partner income
- PRO economy

The prototype should prepare visual structure only. It should not become the final integration plan and should not change runtime code.

---

# Section 15 — Future UX Extension Points

Future additions are allowed only after backend truth exists.

## 15.1 Progression / levels

May be added after:

- progression domain model
- backend tables
- user progression API
- anti-abuse rules

Do not derive levels from Points on the frontend.

## 15.2 Recommended actions

May be added after:

- backend-backed recommended actions
- completion state
- source of truth for suggestions

Until then:

- only static empty-state guidance is allowed.

## 15.3 Analytics

May be added after:

- backend aggregates
- period breakdowns
- source breakdowns
- privacy model

Until then:

- no charts, rankings, or "top user" claims.

## 15.4 G2A / wallet

May be added after:

- legal pass
- architecture pass
- backend accounting truth
- wallet/security model
- OpenAPI contracts

Until then:

- no wallet UI, no conversion UI, no withdrawal UI.

## 15.5 NFT

May be added after:

- badge-to-NFT bridge
- Blockchain Gateway
- minting model
- ownership/status API

Until then:

- badges remain off-chain achievements.

---

# Section 16 — Recommended Next Steps

1. Create Bolt.New prototype prompt for Connect Asia v2.
2. Review prototype.
3. Create `content/connect/connect_ui_content_pack_v1.md`.
4. Run frontend integration with Cursor:
   - Dashboard integration
   - Referral integration
   - Badges integration
   - Activity integration

Frontend integration should happen only after the prototype and content pack are reviewed.

---

# Section 17 — Final Verdict

Connect frontend MVP should be rebuilt around backend truth.

The current old UI is a legacy reference only. It can contribute layout ideas, cards, tabs, referral patterns, and achievement visuals, but it must not carry forward fake economy, wallet, tokenomics, levels, missions, analytics, or NFT assumptions.

After this concept, the project is ready for a Bolt.New prototype pass for Connect Asia v2.
