# Connect Frontend Reality Audit v1

- Project: Go2Asia
- Module: Connect Asia
- Scope: existing frontend audit / backend truth mapping / mock inventory
- Status: audit before frontend alignment
- Date: 2026-04-25
- Document role: source-of-truth audit for current Connect frontend reality

---

# Section 1 — Purpose

This document audits the current Connect Asia frontend against real backend data, SDK hooks, mocks, hardcoded values, and future placeholders.

The product decision for the next alignment phase is to keep the existing six-section Connect frontend as the visual base:

- Главная
- Кошелёк
- Уровни
- Рефералы
- Миссии
- Статистика

The current UI was created before the recent Connect backend passes and before the latest RF, Rielt, and Quest implementation context. As a result, the UI mixes:

- real API data
- fallback/mock data
- hardcoded values
- legacy product vision
- future economy blocks
- unsupported G2A/NFT/wallet/levels/missions/analytics concepts

This document is not an implementation plan and does not change runtime code. It is an audit that identifies what can stay visually, what must be rewired to real APIs, what must become an honest placeholder, and what must be hidden until backend truth exists.

Goal:

- classify every current Connect screen by data reality
- map UI blocks to existing endpoints where possible
- identify missing endpoints and unsupported fake areas
- provide a basis for the next bounded implementation pass:
  - Connect Frontend Alignment Slice 1 — keep existing UI, replace mocks/fake economy with backend truth and honest placeholders

---

# Section 2 — Current Navigation

Current navigation is implemented by:

- `apps/go2asia-pwa-shell/components/connect/Shared/ConnectNav.tsx`

It exposes six sections.

| Section | Route | Main route file | Main components |
| --- | --- | --- | --- |
| Главная | `/connect` | `apps/go2asia-pwa-shell/app/(authenticated)/connect/page.tsx` | `ConnectPageClientWrapper`, `DashboardView`, `DashboardMockView`, `DashboardContent`, `BalanceCards`, `ProgressPanel`, `ActivityFeed`, `ReferralCodeCard` |
| Кошелёк | `/connect/wallet` | `apps/go2asia-pwa-shell/app/(authenticated)/connect/wallet/page.tsx` | `WalletPageClientWrapper`, `WalletView`, `WalletMockView`, `TransactionList`, `NFTTab` |
| Уровни | `/connect/levels` | `apps/go2asia-pwa-shell/app/(authenticated)/connect/levels/page.tsx` | `LevelsView`, `LevelProgress`, `AchievementsList`, `AchievementCard` |
| Рефералы | `/connect/referrals` | `apps/go2asia-pwa-shell/app/(authenticated)/connect/referrals/page.tsx` | `ReferralsPageClientWrapper`, `ReferralsView`, `ReferralsMockView`, `ReferralsContent`, `InviteModal` |
| Миссии | `/connect/missions` | `apps/go2asia-pwa-shell/app/(authenticated)/connect/missions/page.tsx` | `MissionsView`, `MissionCard`, `MissionFilters` |
| Статистика | `/connect/analytics` | `apps/go2asia-pwa-shell/app/(authenticated)/connect/analytics/page.tsx` | `AnalyticsView`, `SourcesList`, `ReferralContribution`, `SeasonPulse` |

Shared files:

- `apps/go2asia-pwa-shell/components/connect/Shared/ConnectHero.tsx`
- `apps/go2asia-pwa-shell/components/connect/Shared/ConnectNav.tsx`
- `apps/go2asia-pwa-shell/components/connect/Shared/DemoModeBanner.tsx`
- `apps/go2asia-pwa-shell/components/connect/mockData.ts`
- `apps/go2asia-pwa-shell/components/connect/types.ts`
- `apps/go2asia-pwa-shell/mocks/dto.ts`

---

# Section 3 — Data Source Classification Legend

| Classification | Meaning |
| --- | --- |
| REAL_API | Data comes from backend through SDK/API. |
| MOCK | Data comes from `components/connect/mockData.ts` or mock-only UI props. |
| HARDCODED | Value is embedded directly in a component. |
| FALLBACK_MOCK | Mock data is used when env/auth/API conditions disable real data or when fallback logic catches unavailable API. |
| FUTURE_PLACEHOLDER | UI can remain visually, but backend truth is absent and it must be clearly marked as later. |
| UNSUPPORTED_FAKE | UI presents as real something current backend does not support. |

Important distinction:

- FUTURE_PLACEHOLDER is acceptable if clearly labeled and non-deceptive.
- UNSUPPORTED_FAKE is not acceptable for production Connect.

---

# Section 4 — Backend-Ready Data Surfaces

## 4.1 Points

Available user-facing endpoints:

- `GET /v1/points/connect-dashboard`
- `GET /v1/points/balance`
- `GET /v1/points/transactions`
- `GET /v1/points/badges`
- `GET /v1/points/badges/mine`

Available SDK hooks:

- `useGetConnectDashboard`
- `useGetBalance`
- `useGetTransactions`
- `useGetBadgeCatalog`
- `useGetMyBadges`

Current frontend usage:

- `useGetBalance` is used in `DashboardView` and `WalletView`.
- `useGetTransactions` is used in `DashboardView` and `WalletView`.
- `useGetConnectDashboard` is available but unused.
- `useGetBadgeCatalog` and `useGetMyBadges` are available but unused.

## 4.2 Referral

Available user-facing endpoints:

- `GET /v1/referral/code`
- `GET /v1/referral/stats`
- `GET /v1/referral/tree`
- `GET /v1/referral/earnings`
- `POST /v1/referral/claim`

Available SDK hooks:

- `useGetReferralCode`
- `useGetReferralStats`
- `useGetReferralTree`
- `useGetReferralEarnings`

Current frontend usage:

- `useGetReferralCode` is used in `DashboardView` and `ReferralsView`.
- `useGetReferralStats` is used in `DashboardView` and `ReferralsView`.
- `useGetReferralTree` is used in `ReferralsView`.
- `useGetReferralEarnings` is available but unused.
- `POST /v1/referral/claim` exists in OpenAPI/derived endpoints, but no dedicated hook was found in `packages/sdk/src/referrals.ts`.

## 4.3 Internal, not frontend

Internal endpoints are not browser/UI APIs:

- `POST /internal/points/add`
- `POST /internal/points/badges/award`
- `POST /internal/referral/mark-first-login`
- `POST /internal/quests/rewards/replay-pending`
- `GET /internal/quests/rewards/outbox/stats`
- `GET /internal/quests/rewards/outbox/failed`
- `POST /internal/quests/rewards/outbox/requeue-failed`

These are for service-to-service flows and ops, not Connect UI.

## 4.4 Explicitly unavailable

Current backend does not support frontend truth for:

- G2A
- NFT wallet
- wallet balance beyond Points
- deposit
- withdraw
- token conversion
- levels
- XP
- active season
- Connect missions
- analytics
- rankings
- leaderboards
- partner income
- business referral economy
- PRO economy

---

# Section 5 — Screen Audit: Главная

Route:

- `/connect`

Main files:

- `apps/go2asia-pwa-shell/app/(authenticated)/connect/page.tsx`
- `apps/go2asia-pwa-shell/app/(authenticated)/connect/ConnectPageClientWrapper.tsx`
- `apps/go2asia-pwa-shell/components/connect/Dashboard/DashboardView.tsx`
- `apps/go2asia-pwa-shell/components/connect/Dashboard/DashboardMockView.tsx`
- `apps/go2asia-pwa-shell/components/connect/Dashboard/DashboardContent.tsx`
- `apps/go2asia-pwa-shell/components/connect/Dashboard/BalanceCards.tsx`
- `apps/go2asia-pwa-shell/components/connect/Dashboard/ProgressPanel.tsx`
- `apps/go2asia-pwa-shell/components/connect/Dashboard/ActivityFeed.tsx`
- `apps/go2asia-pwa-shell/components/connect/Dashboard/ReferralCodeCard.tsx`

Current real hooks:

- `useGetBalance`
- `useGetReferralCode`
- `useGetReferralStats`
- `useGetTransactions({ limit: 10 })`
- `useUser`

Available but unused:

- `useGetConnectDashboard`
- badge hooks

| UI block | Component/file | Current data source | Backend endpoint if any | Problem | Recommendation |
| --- | --- | --- | --- | --- | --- |
| Header / hero | `ConnectHero`, `DashboardView`, `DashboardMockView` | HARDCODED / props | None needed | Copy still leans toward old economy/gamification in some screens. | Keep visual identity; update copy toward activity, Points, referrals, badges. |
| Referral code card | `ReferralCodeCard`, `DashboardView` | REAL_API in API mode; FALLBACK_MOCK in fallback | `GET /v1/referral/code`, `GET /v1/referral/stats` | Good real surface exists, but fallback can show mock state. | Keep; ensure fallback is clearly demo or empty. |
| Greeting | `DashboardView` | REAL_API via Clerk user; HARDCODED fallback naming | Clerk user context | Safe if only greeting. | Keep. |
| Points card | `BalanceCards`, `DashboardView` | REAL_API in API mode; FALLBACK_MOCK in fallback | `GET /v1/points/balance` or `GET /v1/points/connect-dashboard` | Real data exists, but dashboard should use aggregate endpoint later. | Replace multi-call summary with `useGetConnectDashboard` in Slice 1. |
| G2A card | `BalanceCards`, `DashboardView`, `mockData.ts` | MOCK / HARDCODED zero in API mode | None | G2A is unsupported; mock shows future economy as real. | Hide or mark as future placeholder. |
| NFT card | `BalanceCards`, `DashboardView`, `mockData.ts` | MOCK / HARDCODED zero in API mode | None for NFT wallet; badges API exists for off-chain badges | NFT count is unsupported; current badges are not NFT. | Replace NFT card with off-chain badges summary using badges data, or hide NFT wording. |
| Level card | `ProgressPanel`, `DashboardView` | HARDCODED placeholder in API mode; MOCK in fallback | None | Levels/XP have no backend truth. | Hide or convert to future placeholder. Do not calculate from Points. |
| Active season | `ProgressPanel`, `DashboardView`, `mockData.ts` | HARDCODED placeholder in API mode; MOCK in fallback | None | Active season has no backend truth. | Hide or mark as future. |
| “Что делать сегодня” | `DashboardContent`, `mockNextActions` | MOCK in fallback; empty in API mode | None | Personalized recommendations are unsupported. | Keep only static empty-state guidance. |
| “Миссии дня” | `DashboardContent`, `mockMissions` | MOCK in fallback; empty in API mode | None for Connect missions | Connect missions do not exist; Quest is separate. | Hide as real missions; optionally replace with static guidance linking to Quest later. |
| Recent activity | `ActivityFeed`, `DashboardView` | REAL_API in API mode; FALLBACK_MOCK in fallback | `GET /v1/points/transactions` or dashboard `recentTransactions` | Real data exists; labels can be normalized. | Keep and rewire to `useGetConnectDashboard` recentTransactions for dashboard. |

Buttons/actions:

| Action | Current behavior | Reality | Recommendation |
| --- | --- | --- | --- |
| History / Показать все | Routes to `/connect/wallet` | Supported as Points transaction list | Keep route; consider label “Активность” later if product wants softer naming. |
| Пополнить | Toast “next version” | Unsupported | Hide or mark future, not primary CTA. |
| Вывести | Toast “next version” | Unsupported and risky | Hide. |
| NFT Просмотреть | Routes to wallet NFT tab | Unsupported | Remove or replace with badges path once badges UI exists. |
| Mock next actions | Routes by mock deeplink | Not backend-backed | Remove from production path or mark static guidance. |

Главная verdict:

- Keep visual dashboard structure.
- Replace current multi-call dashboard composition with `useGetConnectDashboard`.
- Remove or neutralize G2A/NFT/levels/season/missions blocks.
- Add real badges summary when aligning with available badges APIs.

---

# Section 6 — Screen Audit: Кошелёк

Route:

- `/connect/wallet`

Main files:

- `apps/go2asia-pwa-shell/app/(authenticated)/connect/wallet/page.tsx`
- `apps/go2asia-pwa-shell/app/(authenticated)/connect/wallet/WalletPageClientWrapper.tsx`
- `apps/go2asia-pwa-shell/components/connect/Wallet/WalletView.tsx`
- `apps/go2asia-pwa-shell/components/connect/Wallet/WalletMockView.tsx`
- `apps/go2asia-pwa-shell/components/connect/Wallet/TransactionList.tsx`
- `apps/go2asia-pwa-shell/components/connect/Wallet/NFTTab.tsx`
- `apps/go2asia-pwa-shell/components/connect/Wallet/G2ATab.tsx`
- `apps/go2asia-pwa-shell/components/connect/Wallet/PointsTab.tsx`

Current real hooks:

- `useGetBalance`
- `useGetTransactions({ limit: 20, cursor })`

| UI block | Component/file | Current data source | Backend endpoint if any | Problem | Recommendation |
| --- | --- | --- | --- | --- | --- |
| Balance cards | `WalletView`, `WalletMockView` | REAL_API for Points; MOCK/FALLBACK_MOCK for demo; HARDCODED zero for G2A/NFT in API mode | `GET /v1/points/balance` | Points is real; G2A/NFT are unsupported. | Keep Points card; hide or future-label G2A/NFT. |
| Points explanation | `WalletView`, wallet UI copy | HARDCODED | Points endpoints exist | Mostly safe if framed as activity contribution. | Keep; avoid finance/wallet copy. |
| G2A card/tab | `WalletView`, `G2ATab.tsx`, `mockData.ts` | MOCK / HARDCODED empty or zero | None | Unsupported future tokenomics. | Hide or mark future placeholder. |
| NFT card/tab | `WalletView`, `NFTTab.tsx`, `mockData.ts` | MOCK / HARDCODED empty or zero | None for NFT wallet | Unsupported; badges are off-chain. | Hide NFT wallet; use Badges section for achievements. |
| Transaction filters | `TransactionList`, `WalletView` | UI-local state | `GET /v1/points/transactions` supports pagination, not all local filters | Filters may imply unsupported backend filtering. | Keep local visual filtering only if clearly over loaded list; backend filters are future. |
| Transaction list | `TransactionList`, `WalletView` | REAL_API in API mode; FALLBACK_MOCK in fallback | `GET /v1/points/transactions` | Good real surface exists. | Keep and normalize labels; avoid raw metadata dump. |
| Deposit / withdraw / exchange buttons | `WalletView`, `WalletMockView`, `G2ATab` | HARDCODED / toast / future copy | None | Unsupported wallet and token conversion. | Hide from MVP or mark disabled “позже” away from primary UI. |
| Wallet-like copy | `WalletView`, `ConnectNav`, hero | HARDCODED | Points only | “Wallet” suggests unsupported finance/token scope. | Keep route if product wants existing structure, but reframe visible copy as Points / Activity. |

Кошелёк verdict:

- Section can be kept as the current route and visual shell.
- Honest current meaning should be Points / Activity, not full wallet.
- Keep `useGetBalance` and `useGetTransactions`.
- Hide G2A, NFT wallet, deposit, withdraw, and exchange.

---

# Section 7 — Screen Audit: Уровни

Route:

- `/connect/levels`

Main files:

- `apps/go2asia-pwa-shell/app/(authenticated)/connect/levels/page.tsx`
- `apps/go2asia-pwa-shell/components/connect/Levels/LevelsView.tsx`
- `apps/go2asia-pwa-shell/components/connect/Levels/LevelProgress.tsx`
- `apps/go2asia-pwa-shell/components/connect/Levels/AchievementsList.tsx`
- `apps/go2asia-pwa-shell/components/connect/Levels/AchievementCard.tsx`

Current real hooks:

- none

Mock source:

- `mockLevelsData`

| UI block | Component/file | Current data source | Backend endpoint if any | Problem | Recommendation |
| --- | --- | --- | --- | --- | --- |
| Level summary | `LevelsView`, `LevelProgress` | MOCK | None | Levels have no backend truth. | Mark as future placeholder or hide values. |
| XP/progress bar | `LevelProgress` | MOCK | None | XP/progress unsupported; cannot derive from Points. | Hide or show “появится позже” without numbers. |
| Next level benefits | `LevelsView` | HARDCODED | None | Benefits are speculative. | Mark as future vision only. |
| All levels list | `LevelsView` | HARDCODED 10 levels | None | Presents progression system as real. | Replace with future placeholder. |
| Achievements list | `AchievementsList`, `AchievementCard`, `mockLevelsData` | MOCK | Badges APIs exist, but not this achievements/progression model | Current “achievements” are old mock model, not Points badges. | Rewire to badges APIs or move to Бейджи section. |
| NFT/Points rewards | `mockLevelsData`, `AchievementCard` | MOCK | None for NFT; Points rewards only via ledger | Risks fake economy. | Remove NFT/token reward framing. |

Уровни verdict:

- No real backend supports levels, XP, progress, season, or benefits.
- Keep section only as honest future placeholder if product wants six-section navigation.
- Do not calculate levels from Points.
- Do not show XP/progress as real.

---

# Section 8 — Screen Audit: Рефералы

Route:

- `/connect/referrals`

Main files:

- `apps/go2asia-pwa-shell/app/(authenticated)/connect/referrals/page.tsx`
- `apps/go2asia-pwa-shell/app/(authenticated)/connect/referrals/ReferralsPageClientWrapper.tsx`
- `apps/go2asia-pwa-shell/components/connect/Referrals/ReferralsView.tsx`
- `apps/go2asia-pwa-shell/components/connect/Referrals/ReferralsMockView.tsx`
- `apps/go2asia-pwa-shell/components/connect/Referrals/ReferralsContent.tsx`
- `apps/go2asia-pwa-shell/components/connect/Referrals/InviteModal.tsx`

Current real hooks:

- `useGetReferralCode`
- `useGetReferralStats`
- `useGetReferralTree({ depth: 2 })`

Available but unused:

- `useGetReferralEarnings`

| UI block | Component/file | Current data source | Backend endpoint if any | Problem | Recommendation |
| --- | --- | --- | --- | --- | --- |
| Referral code/link | `ReferralsView`, `ReferralsContent`, `InviteModal` | REAL_API for code; constructed link; fallback to mock link if no code | `GET /v1/referral/code` | Mostly real; QR uses mock. | Keep; remove mock QR or generate locally as UI-only. |
| Stats cards | `ReferralsView`, `ReferralsContent` | REAL_API for direct referral count; HARDCODED zero for partners/earned Points/G2A in API mode | `GET /v1/referral/stats`, `GET /v1/referral/earnings` | Earned Points not wired; G2A unsupported. | Use `useGetReferralEarnings` for earned Points; remove G2A. |
| Invite buttons | `ReferralsContent`, `InviteModal` | UI-only | `POST /v1/referral/claim` exists for claiming, not inviting | Copy/share is okay; no invite send backend. | Keep copy/share; avoid implying backend invite campaign. |
| “Invite business” | `ReferralsView`, `ReferralsContent`, `InviteModal` | HARDCODED / MOCK | None | Business referral economy unsupported. | Hide or future placeholder. |
| Referral earnings | `ReferralsView`, `ReferralsContent` | HARDCODED zero in API mode; MOCK in fallback | `GET /v1/referral/earnings` | Real endpoint/hook exists but unused. | Integrate `useGetReferralEarnings`. |
| Referral tree/list | `ReferralsView`, `ReferralsContent` | REAL_API for tree IDs/dates/status; fallback mock | `GET /v1/referral/tree` | UI may infer richer user identity than backend provides. | Keep privacy-safe user labels; do not invent avatars/names. |
| reward_missing | Not meaningfully surfaced from current UI | Not used | `GET /v1/referral/earnings` supports status | Missing state in UI. | Add state from referral earnings. |
| G2A / partner / multi-level copy | Mock/types/content | MOCK / HARDCODED | None for G2A/partner economy | Unsupported future economy. | Hide. |

Рефералы verdict:

- Strong candidate for real alignment.
- Keep visual referral cards and tree/list.
- Add `useGetReferralEarnings`.
- Remove G2A, business referral economy, and partner income copy.

---

# Section 9 — Screen Audit: Миссии

Route:

- `/connect/missions`

Main files:

- `apps/go2asia-pwa-shell/app/(authenticated)/connect/missions/page.tsx`
- `apps/go2asia-pwa-shell/components/connect/Missions/MissionsView.tsx`
- `apps/go2asia-pwa-shell/components/connect/Missions/MissionCard.tsx`
- `apps/go2asia-pwa-shell/components/connect/Missions/MissionFilters.tsx`
- `apps/go2asia-pwa-shell/components/connect/Missions/QuickStart.tsx`

Current real hooks:

- none

Mock source:

- `mockMissionsData`
- `mockMissions`

| UI block | Component/file | Current data source | Backend endpoint if any | Problem | Recommendation |
| --- | --- | --- | --- | --- | --- |
| Missions summary | `MissionsView` | MOCK / derived from mock | None for Connect missions | Connect missions have no backend truth. | Replace with honest future placeholder. |
| Recommended missions | `MissionsView`, `mockMissionsData` | MOCK | None | Fake mission engine. | Convert to static guidance or hide. |
| Mission filters | `MissionFilters`, `MissionsView` | UI-local over mock data | None | Implies real mission catalog. | Hide unless section becomes future placeholder. |
| Mission list | `MissionCard`, `MissionsView` | MOCK | None for Connect missions | Duplicates or confuses with Quest Asia. | Hide or point user to Quest if route exists and product approves. |
| Rewards | `MissionCard`, mock data | MOCK | None | Fake rewards. | Remove reward promises. |
| “Soon opens” section | `MissionsView` | HARDCODED | None | Future benefits shown with XP/levels. | Mark as future only or hide. |

Миссии verdict:

- No current Connect missions backend.
- Quest is a separate module.
- Section can remain only as static guidance / future placeholder.
- Do not show fake mission progress or rewards.

---

# Section 10 — Screen Audit: Статистика

Route:

- `/connect/analytics`

Main files:

- `apps/go2asia-pwa-shell/app/(authenticated)/connect/analytics/page.tsx`
- `apps/go2asia-pwa-shell/components/connect/Analytics/AnalyticsView.tsx`
- `apps/go2asia-pwa-shell/components/connect/Analytics/SourcesList.tsx`
- `apps/go2asia-pwa-shell/components/connect/Analytics/ReferralContribution.tsx`
- `apps/go2asia-pwa-shell/components/connect/Analytics/SeasonPulse.tsx`
- `apps/go2asia-pwa-shell/components/connect/Analytics/PointsChart.tsx`

Current real hooks:

- none

Mock sources:

- `mockAnalyticsData`
- `mockBalances`

| UI block | Component/file | Current data source | Backend endpoint if any | Problem | Recommendation |
| --- | --- | --- | --- | --- | --- |
| Rating cards | `AnalyticsView` | HARDCODED / MOCK | None | “Top 10%” and comparative ratings unsupported. | Hide or future placeholder. |
| Recommendations | `AnalyticsView` | HARDCODED | None | Personalized plan unsupported. | Convert to generic guidance or hide. |
| Balance / income charts | `AnalyticsView`, `mockBalances` | MOCK / HARDCODED | Points balance exists, analytics does not | Income/G2A framing unsupported. | Hide income/G2A; if needed, link to Activity. |
| Source breakdown | `SourcesList`, `mockAnalyticsData` | MOCK | None | No aggregate backend. | Hide/future. |
| Referral contribution | `ReferralContribution` | MOCK | Referral earnings exists, but not analytics aggregate | Can be confused with analytics truth. | Replace with referral earnings tab data or future. |
| Activity level | `AnalyticsView` | HARDCODED | None | Unsupported ranking/comparison. | Hide. |
| Monthly transactions | `AnalyticsView` | HARDCODED value such as 18 | `GET /v1/points/transactions` exists, but aggregate count by month does not | Calculating analytics on frontend would be misleading. | Hide or explicitly derive only from loaded page, not as global statistic. |
| Season pulse | `SeasonPulse`, `mockAnalyticsData` | MOCK | None | Season unsupported. | Hide/future. |
| Leaderboards / ranks | `AnalyticsView` | HARDCODED | None | Rankings unsupported. | Hide. |

Статистика verdict:

- Entire screen is mock/hardcoded today.
- No analytics/ranking backend exists.
- Keep visual card/chart patterns for future, but current production UI should be an honest future placeholder.

---

# Section 11 — Mock Inventory

Primary file:

- `apps/go2asia-pwa-shell/components/connect/mockData.ts`

Data source switch:

- `apps/go2asia-pwa-shell/mocks/dto.ts`
- `getDataSource()`
- `NEXT_PUBLIC_DATA_SOURCE`

Wrappers that switch full screen between API and mock:

- `apps/go2asia-pwa-shell/app/(authenticated)/connect/ConnectPageClientWrapper.tsx`
- `apps/go2asia-pwa-shell/app/(authenticated)/connect/wallet/WalletPageClientWrapper.tsx`
- `apps/go2asia-pwa-shell/app/(authenticated)/connect/referrals/ReferralsPageClientWrapper.tsx`

| Mock object/source | Used by | Classification | Risk |
| --- | --- | --- | --- |
| `mockDashboardData` | `DashboardMockView`, dashboard fallback | FALLBACK_MOCK | Dangerous if it shows G2A/NFT/levels/season/missions as real. |
| `mockBalances` | dashboard, wallet, analytics mocks | MOCK | Dangerous fake economy because it includes G2A and NFT count. |
| `mockWalletData` | `WalletMockView`, `WalletView` fallback | FALLBACK_MOCK | Dangerous for G2A/NFT/wallet if visible as production. |
| `mockNFTWalletData` | wallet mock/NFT tab | MOCK | Dangerous because NFT wallet is unsupported. |
| `mockLevelsData` | `LevelsView` default | MOCK | Dangerous because levels/XP are unsupported but can appear real even outside mock env. |
| `mockMissionsData` | `MissionsView` default | MOCK | Dangerous because Connect missions are unsupported. |
| `mockMissions` | dashboard fallback, missions view | MOCK | Dangerous if shown as real mission engine. |
| `mockAnalyticsData` | `AnalyticsView` default | MOCK | Dangerous because analytics/rankings/sources are unsupported. |
| `mockNextActions` | dashboard fallback | MOCK | Can be safe only as design sample; dangerous if shown as personalized backend guidance. |
| `mockReferralsData` | `ReferralsMockView`, `ReferralsView` fallback and QR fallback | FALLBACK_MOCK | Mixed. Referral visual sample is useful, but G2A/business/multi-level fields are risky. |
| `mockTransactions` | dashboard/wallet mocks | MOCK | Safe as design sample only; should not replace API failure silently. |
| `mockAchievements` | levels/achievements UI | MOCK | Risky because old achievements model does not equal current badges. |
| `mockSeason` | dashboard/levels/analytics mocks | MOCK | Dangerous because season backend does not exist. |

Mock policy recommendation:

- Keep mocks only for local demo/design mode.
- Do not use full-screen mock fallback in production API error paths.
- Replace unsupported mock economy sections with empty/error/future placeholders.

---

# Section 12 — SDK / Hooks Inventory

## 12.1 Hooks currently used in Connect

| Hook | Used in | Endpoint |
| --- | --- | --- |
| `useGetBalance` | `DashboardView`, `WalletView` | `GET /v1/points/balance` |
| `useGetTransactions` | `DashboardView`, `WalletView` | `GET /v1/points/transactions` |
| `useGetReferralCode` | `DashboardView`, `ReferralsView` | `GET /v1/referral/code` |
| `useGetReferralStats` | `DashboardView`, `ReferralsView` | `GET /v1/referral/stats` |
| `useGetReferralTree` | `ReferralsView` | `GET /v1/referral/tree` |

## 12.2 Hooks available but not used

| Hook | Endpoint | Recommended use |
| --- | --- | --- |
| `useGetConnectDashboard` | `GET /v1/points/connect-dashboard` | Dashboard summary alignment. |
| `useGetBadgeCatalog` | `GET /v1/points/badges` | Badges section/catalog. |
| `useGetMyBadges` | `GET /v1/points/badges/mine` | My badges and recent badges. |
| `useGetReferralEarnings` | `GET /v1/referral/earnings` | Referral earnings, reward statuses, reward_missing. |

## 12.3 Missing hooks / SDK gaps

| Need | Backend exists? | Current SDK status | Note |
| --- | --- | --- | --- |
| Claim referral code | Yes | No dedicated hook found in `packages/sdk/src/referrals.ts` | `POST /v1/referral/claim` exists in OpenAPI/derived endpoints. |
| G2A balance | No | No hook | Correctly absent. |
| NFT wallet | No | No hook | Correctly absent. |
| Levels/progression | No | No hook | Correctly absent. |
| Connect missions | No | No hook | Correctly absent. |
| Analytics/rankings | No | No hook | Correctly absent. |

---

# Section 13 — Gap Map

| Existing UI need | Backend exists? | Endpoint/hook | Action |
| --- | --- | --- | --- |
| Dashboard summary | Yes | `useGetConnectDashboard` | Replace multi-call/mocks on Главная. |
| Points balance | Yes | `useGetBalance`; dashboard `balance` | Keep and use real API. |
| Points transactions | Yes | `useGetTransactions`; dashboard `recentTransactions` | Keep transaction list; normalize labels. |
| Dashboard recent activity | Yes | `useGetConnectDashboard` | Use dashboard slice on Главная. |
| Referral code | Yes | `useGetReferralCode` | Keep. |
| Referral stats | Yes | `useGetReferralStats` | Keep, but avoid unsupported fields. |
| Referral tree | Yes | `useGetReferralTree` | Keep privacy-safe list. |
| Referral earnings | Yes | `useGetReferralEarnings` | Integrate; remove hardcoded earned zero. |
| Referral claim | Yes | `POST /v1/referral/claim`; no hook found | Add bounded SDK/helper later if UI needs claim. |
| Badges catalog | Yes | `useGetBadgeCatalog` | Integrate into badges/achievements visual area. |
| My badges | Yes | `useGetMyBadges` | Integrate; replace NFT/old achievements. |
| Recent badges | Yes | `useGetConnectDashboard` or `useGetMyBadges` | Integrate on dashboard or badges section. |
| Wallet G2A | No | none | Hide/future placeholder. |
| NFT wallet | No | none | Hide/future placeholder. |
| Deposit/withdraw/exchange | No | none | Hide. |
| Levels / XP | No | none | Future placeholder only. |
| Active season | No | none | Future placeholder only. |
| Connect missions | No | none | Static guidance only or hide. |
| Analytics charts | No | none | Hide/future. |
| Rankings / top percent | No | none | Hide. |
| Partner income | No | none | Hide. |
| Business referrals | No | none | Hide/future. |

---

# Section 14 — Keep / Replace / Hide Recommendations

## 14.1 Keep as UI pattern

Keep:

- existing header/hero
- current six-section navigation
- card layout
- referral code card
- points transaction list
- badges visual cards
- mission/recommendation card style if converted to static guidance
- mobile-friendly horizontal nav pattern
- section-level retry/error UI pattern
- DemoMode banner only for explicit demo mode, not production fallback

## 14.2 Replace with real API

Replace or wire:

- dashboard summary → `useGetConnectDashboard`
- Points balance → `useGetBalance` or dashboard balance
- transactions → `useGetTransactions`
- recent activity → dashboard `recentTransactions`
- referral code → `useGetReferralCode`
- referral stats → `useGetReferralStats`
- referral tree → `useGetReferralTree`
- referral earnings → `useGetReferralEarnings`
- badges catalog → `useGetBadgeCatalog`
- my badges → `useGetMyBadges`
- recent badges → dashboard badges summary or `useGetMyBadges`

## 14.3 Hide or mark as future

Hide or mark as future:

- G2A
- NFT wallet
- levels/XP
- active season
- Connect missions engine
- analytics charts
- rankings
- leaderboards
- partner income
- business referrals
- deposit
- withdraw
- exchange
- token conversion
- mock income copy
- top percentile labels

---

# Section 15 — Recommended Implementation Sequencing

## Slice 1 — Dashboard real data alignment

Goal:

- keep existing Главная visual structure
- use `useGetConnectDashboard`
- remove G2A/NFT/levels/season/missions as real blocks
- show honest empty states
- add badges summary if available from dashboard response

## Slice 2 — Wallet / Activity real Points alignment

Goal:

- keep `/connect/wallet` route
- keep Points balance and transaction list
- hide G2A/NFT wallet/deposit/withdraw/exchange
- reframe visible copy as Points / activity while preserving navigation label if required

## Slice 3 — Referral real earnings alignment

Goal:

- integrate `useGetReferralEarnings`
- show pending/activated/rewarded/reward_missing
- remove hardcoded earned zeros
- hide G2A/business/partner economy copy

## Slice 4 — Badges real catalog / mine alignment

Goal:

- integrate `useGetBadgeCatalog`
- integrate `useGetMyBadges`
- replace old achievements/NFT wording with off-chain badges
- use first quest badge copy honestly

## Slice 5 — Future sections sanitization

Goal:

- make Уровни, Миссии, Статистика honest placeholders
- preserve visual shells
- remove fake numbers, charts, rankings, XP, mission rewards, and income copy

## Optional later — UX polish after real data integration

Goal:

- improve copy, empty states, responsive behavior, and card hierarchy after data alignment.

---

# Section 16 — Risks

Main risks:

- accidentally reintroducing fake economy through fallback mocks
- mixing frontend-level calculations with backend truth
- showing levels as real without progression backend
- deriving levels or XP from Points on the frontend
- showing missions as real without Connect missions backend
- duplicating Quest Asia through fake Connect missions
- showing analytics/rankings without aggregate backend
- showing top percent, leaderboard position, or source percentages as real
- G2A/NFT legal and product risk
- wallet/deposit/withdraw language implying financial functionality
- fallback mocks leaking into production
- mock QR, mock partner/business referrals, or mock G2A rewards appearing as production facts
- hiding backend errors behind demo data and reducing user trust

Mitigation:

- make demo mode explicit
- use section-level error states
- use empty states instead of fake values
- wire existing hooks before adding new UI concepts
- keep future sections clearly labeled as future

---

# Section 17 — Final Verdict

Current Connect UI can be kept as the visual base.

It cannot be kept as-is for honest production alignment because it mixes real Points/Referral APIs with mock G2A/NFT/wallet/levels/missions/analytics and hardcoded ranking/economy values.

Before frontend integration is honest, the project must:

- replace dashboard composition with `useGetConnectDashboard`
- keep Points balance and transactions as real data
- wire referral earnings
- wire badges catalog and my badges
- remove or future-label unsupported G2A/NFT/wallet/levels/missions/analytics/ranking blocks
- stop using full mock economy fallback as production substitute

Recommended next slice:

- Connect Frontend Alignment Slice 1 — Dashboard real data alignment.
