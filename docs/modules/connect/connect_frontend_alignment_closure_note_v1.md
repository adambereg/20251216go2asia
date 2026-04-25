# Connect Frontend Alignment Closure Note v1

## 1. Purpose

This document closes the Connect frontend alignment stage.

It is not an implementation plan. It records the current frontend truth after the completed alignment slices:

- Slice 1 — Dashboard real data alignment
- Slice 2 — Wallet / Activity real Points alignment
- Slice 3 — Referrals real earnings alignment
- Slice 4 — Badges real catalog / mine alignment
- Slice 5 — Levels / Missions / Statistics cleanup

The goal of this note is to preserve the boundary between current backend-backed MVP behavior and future Connect product vision.

## 2. Starting point

Before alignment, Connect already had a strong visual shell and clear product direction, but active frontend screens mixed:

- real API data
- local mocks
- hardcoded values
- fallback demo data
- future tokenomics and progression ideas

The main risks were not visual quality, but runtime truth.

Before alignment:

- Dashboard had mock fallback behavior and visible fake economy blocks.
- Wallet included G2A, NFT, wallet-like and conversion-oriented UI.
- Referrals had mock fallback, fake earned values, business referral copy, G2A copy, partner economy copy and multi-level economy framing.
- Levels had XP, progress, mock achievements, fake level benefits and progression UI.
- Missions had a fake mission engine, fake mission rewards, filters and progress.
- Statistics had fake rankings, charts, source breakdowns, season pulse and hardcoded analytics.

## 3. Alignment principles

The frontend alignment used these rules:

- Backend truth comes first.
- Active UI must not use mock fallback as production substitute.
- Active UI must not invent economy facts.
- Active UI must not reconstruct hidden domains from Points.
- Existing routes and visual shells are preserved where possible.
- Future product vision is preserved only as quiet placeholders.
- Content pack copy governs current labels, empty states and safe wording.
- G2A, NFT, financial wallet, token conversion, levels, missions, analytics, rankings, partner income and PRO economy must not appear as current runtime truth.

These rules follow the Connect architecture SSOT: Connect is a product/UI module over existing services, not a separate backend service or a tokenomics runtime.

## 4. Slice summary

### Slice 1 — Dashboard

Dashboard moved to `useGetConnectDashboard`.

The previous multi-call frontend aggregation and mock fallback were removed from the active dashboard path.

The dashboard no longer shows G2A, NFT, levels, season progress or Connect missions as active data.

Current dashboard shows:

- Points balance
- recent Points activity
- referral summary
- badge summary
- static next-step guidance

The dashboard read model remains bounded. It is not SSOT and does not create hidden product domains.

### Slice 2 — Wallet / Activity

Wallet was reframed as Points balance and Points history.

Current active hooks:

- `useGetBalance`
- `useGetTransactions`

Removed from active wallet UI:

- G2A cards
- NFT cards
- deposit
- withdraw
- conversion
- wallet asset framing
- mock wallet fallback

The current wallet is a Points ledger/history surface. Future tokenomics is preserved only as a quiet placeholder, not as current truth.

### Slice 3 — Referrals

Referrals moved to real referral APIs and earnings read model.

Current active hooks:

- `useGetReferralCode`
- `useGetReferralStats`
- `useGetReferralTree`
- `useGetReferralEarnings`

Removed from active referrals UI:

- mock referral fallback
- fake earned values
- business referral economy
- G2A referral copy
- partner income copy
- multi-level economy promises
- fake user names and avatars

The referrals screen supports backend earnings statuses:

- `pending`
- `activated`
- `rewarded`
- `reward_missing`

User labels are privacy-safe and do not invent profile details.

### Slice 4 — Badges

Badges were aligned with the Points badge catalog and user badge awards.

Current active hooks:

- `useGetBadgeCatalog`
- `useGetMyBadges`

Mock achievements were replaced with backend-backed badge catalog and mine data.

Removed from active badges/achievements UI:

- XP
- progress bars
- completion percentages
- NFT language
- reward language not backed by current badge APIs

Dashboard badge CTA now points to the badges screen.

Badges are off-chain achievements. They are not NFT assets.

### Slice 5 — Levels / Missions / Statistics

Levels, Missions and Statistics were sanitized as future sections.

Levels:

- real badges remain active
- progression/levels appear only as a quiet future note
- no XP, next level, benefits, multiplier or season progress is shown

Missions:

- fake Connect mission engine was removed from active UI
- route now shows static guidance
- no mission rewards, filters, progress or daily/seasonal mission claims are shown

Statistics:

- fake analytics/ranking/chart UI was removed from active UI
- route now shows a future placeholder and safe CTAs
- no rankings, source breakdowns, season pulse or hardcoded analytics are shown

Routes and navigation remain preserved.

## 5. Current screen truth

| Screen | Route | Current state | Data source | Notes |
| --- | --- | --- | --- | --- |
| Главная | `/connect` | Backend-backed | `useGetConnectDashboard` | No fake economy |
| Кошелёк | `/connect/wallet` | Backend-backed | `useGetBalance`, `useGetTransactions` | Points ledger/history only |
| Уровни | `/connect/levels` | Badges-backed plus levels placeholder | `useGetBadgeCatalog`, `useGetMyBadges` | No progression truth |
| Рефералы | `/connect/referrals` | Backend-backed | referral hooks plus earnings | No business/tokenomics copy |
| Миссии | `/connect/missions` | Future placeholder | static copy | No Connect mission backend |
| Статистика | `/connect/analytics` | Future placeholder | static copy | No analytics backend |

## 6. Data flow summary

Current active frontend hooks used by aligned Connect UI:

- `useGetConnectDashboard`
- `useGetBalance`
- `useGetTransactions`
- `useGetReferralCode`
- `useGetReferralStats`
- `useGetReferralTree`
- `useGetReferralEarnings`
- `useGetBadgeCatalog`
- `useGetMyBadges`

Active frontend must not call internal endpoints.

Active frontend must not reconstruct hidden domains from Points. This includes levels, XP, tokenomics, wallet balances, NFT ownership, analytics and rankings.

## 7. Removed from active UI

Removed or isolated from active Connect UI:

- mock dashboard fallback
- mock wallet fallback
- mock referral fallback
- G2A cards
- NFT wallet/cards
- deposit buttons
- withdraw buttons
- conversion buttons
- XP
- progress bars
- fake levels
- fake mission engine
- fake mission rewards
- fake analytics
- rankings
- source breakdowns
- season pulse
- business referrals
- partner income
- passive income and earning language

Some legacy components and mock data still exist in the codebase, but they are not active in aligned routes.

## 8. Future Vision preserved

The alignment does not delete future Connect vision. It separates current truth from future domains.

Future domains intentionally preserved as future-only:

- G2A / tokenomics
- wallet
- NFT / on-chain
- progression / levels
- missions / recommended actions
- analytics / rankings
- PRO / RF economics

Required future truth before reactivation:

- G2A / tokenomics: legal pass, architecture pass, accounting service, ledger and audit model.
- Wallet: wallet identity, binding, custody, transaction status, security and compliance model.
- NFT / on-chain: ownership model, minting model, blockchain gateway, token identifiers, metadata and mint status.
- Progression / levels: progression backend, level definitions, user progression state and anti-farming rules.
- Missions / recommended actions: explicit mission or onboarding model, plus a clear relation to Quest Asia.
- Analytics / rankings: aggregate backend, period contracts, source contracts, privacy model and ranking eligibility rules.
- PRO / RF economics: separate product ownership, economy contracts, audit rules and legal review.

Until those truths exist, these domains must remain placeholders or hidden surfaces.

## 9. Remaining legacy/dead artifacts

Known remaining artifacts:

- `DashboardMockView`
- `WalletMockView`
- `ReferralsMockView`
- `MissionCard`
- `MissionFilters`
- `QuickStart`
- `SourcesList`
- `ReferralContribution`
- `SeasonPulse`
- `PointsChart`
- `LevelProgress`
- old Connect mock data in `mockData.ts`

Current status:

- These artifacts are not active in aligned Connect routes.
- Some are thin compatibility wrappers or exported legacy components.
- They should not be imported back into active routes without a new backend-truth review.
- Removal or archival can be a separate cleanup pass.

This closure note does not remove these artifacts.

## 10. Validation status

Across Slices 1–5:

- frontend lint was run and passed
- frontend build was run and passed
- frontend typecheck was run
- typecheck had known `.next/types` failures outside Connect
- no new Connect-specific typecheck failures were reported during the alignment passes

Do not treat global typecheck as green until the known generated Next type issues are resolved.

## 11. Known risks

Known risks after alignment:

- Future domains could be accidentally reintroduced as active UI by importing legacy components.
- Dead artifacts in `components/connect` and `mockData.ts` may create future confusion.
- Placeholder screens may feel too quiet until product polish adds better micro-guidance.
- The label `Кошелёк` now means Points history, not a financial wallet.
- The label `Уровни` currently hosts real badges plus a future levels note.
- Future tokenomics requires a separate legal and architecture pass before any UI reactivation.

## 12. Recommended next steps

1. Optional cleanup pass:

- remove or archive dead artifacts
- reduce `mockData.ts` risk
- consider a shared `FuturePlaceholder` component
- keep route labels stable unless product explicitly changes navigation

2. Product polish pass:

- dashboard micro-insights
- badge visual upgrade
- clearer next-step guidance
- mobile UX polish
- consistent empty and loading state refinement

3. Future backend waves:

- progression service
- missions / recommended actions
- analytics aggregates
- tokenomics / G2A / wallet / NFT after legal and architecture work

## 13. Final verdict

Connect frontend alignment Slices 1–5 are complete.

Active Connect UI is now honest and backend-aligned.

Connect is ready for product polish and future domain expansion.
