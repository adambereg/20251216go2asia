# Stage 10.6 — Connect Economy Hub Alignment

Документ: `stage_10_6_connect_economy_hub_alignment_v1.md`  
Статус: docs-first audit/design  
Дата: 2026-05-21  
Scope: Connect Dashboard, Wallet, ActivityFeed, Levels, referrals, RF projections, mock/future-only surfaces, projection/authority boundaries  
Mode: read-only synthesis; no implementation; no API/OpenAPI/SDK/schema/UI/runtime changes

## 1. Executive Summary

Stage 10.6 подтверждает Connect как главный user-facing economy embodiment hub Go2Asia. Connect уже собирает и визуализирует Points, wallet summary, dashboard, recent activity, referrals, RF voucher projections, badges and Levels. Но Connect не является authority и не должен становиться wallet, receipt, audit trail, payout system, progression engine, NFT ownership surface или support proof.

Главная формула Stage 10.6:

```text
Connect = projection + embodiment hub
Connect != economic authority
Connect != financial wallet
Connect != receipt system
Connect != audit trail
Connect != progression authority
Connect != NFT ownership authority
```

Текущий честный итог:

- Connect Dashboard is backend-backed convenience projection over Points, referral and badge facts;
- Connect Wallet is a read-only Points activity/history projection, not a financial wallet;
- ActivityFeed and TransactionList render Points transaction rows but are not receipts or audit trails;
- Connect Levels is the safest current Layer 2 projection over `badges` and `user_badges`;
- RF in Connect is a read-only projection that preserves RF as owner domain;
- Analytics and Missions are mostly future-only placeholders;
- NFT/G2A/Bridge components are intentionally inert future-only legacy surfaces;
- Connect `mockData.ts` still contains old G2A/NFT/mission/achievement vocabulary and must remain quarantined.

Stage 10.6 does not activate:

- no wallet launch;
- no custody or financial wallet semantics;
- no receipt/export/support proof flow;
- no ActivityFeed audit-trail semantics;
- no progression engine;
- no G2A/NFT/on-chain/bridge activation;
- no payout/settlement/cashback activation;
- no new producers;
- no API/UI/schema/runtime changes;
- no Slice 16 movement.

## 2. Why Stage 10.6 Exists

Stages 10.1-10.5 progressively separated economy facts from projections:

- Stage 10.1 mapped economy surfaces and identified Connect as central projection hub;
- Stage 10.2 showed the real Points producer set is narrower than economy vocabulary;
- Stage 10.3 made Space a future contribution signal layer, not economic authority;
- Stage 10.4 made Quest a delivery-intent orchestration layer, not reward authority;
- Stage 10.5 made badges an off-chain identity/progression layer, not NFT ownership.

After those splits, Connect becomes the place where users see the economy embodied. That makes Connect powerful and risky at the same time. It aggregates enough real facts to feel authoritative, but its role is still presentation and projection.

Stage 10.6 exists because projection-heavy UX can collapse into authority-heavy interpretation:

```text
Dashboard summary -> receipt/account statement
Wallet route -> financial wallet/custody
ActivityFeed -> audit trail
Transaction row -> receipt
Badge count -> ownership inventory
Levels -> progression authority
RF summary -> payout/cashback
G2A/NFT placeholder -> launch readiness
mock transaction -> ledger fact
projection cache -> authority state
```

Before MVP decisions, Connect semantics must stabilize. Connect should become the canonical economy embodiment hub without becoming the owner of the economy.

## 3. Current Connect Surface Inventory

| Surface | Location | Runtime class | Proof class | Authority level | Collapse risk | MVP readiness | Verdict |
|---|---|---|---|---|---|---|---|
| Connect Dashboard route | `app/(authenticated)/connect/page.tsx`, `DashboardView.tsx` | production-shaped projection | read_model | projection-backed | High | internal-beta | Main hub, not receipt |
| Dashboard API read | `/v1/points/connect-dashboard` | production-shaped projection | read_model | Points-backed projection | High | internal-beta | Bounded convenience model, not SSOT |
| Dashboard balance card | `DashboardContent.tsx`, `BalanceCards.tsx` | projection | balance_projection | projection-backed | High | internal-beta | Points summary, not account statement |
| Dashboard referrals summary | `DashboardContent.tsx` | derived summary | referral_projection | mixed projection | Medium/High | internal-beta | Participation summary, not commission/payout |
| Dashboard badge summary | `DashboardContent.tsx` | projection | badge_projection | projection-backed | High | internal-beta | Recent badges, not receipt or inventory |
| Dashboard next steps | `DashboardContent.tsx` | static guidance | navigation_hint | no authority | Medium | MVP-safe with guardrails | Guidance only |
| ActivityFeed | `Dashboard/ActivityFeed.tsx` | projection | recent_activity_projection | projection-backed | High | dangerous-until-aligned | Not audit trail |
| Wallet route | `/connect/wallet`, `WalletView.tsx` | production-shaped projection | points_history_projection | projection-backed | High | internal-beta | Read-only Points history, not financial wallet |
| Wallet summary | `/v1/wallet/summary`, `WalletView.tsx` | derived projection | wallet_bucket_projection | Points-backed projection | High | internal-beta | Bucket projection, not wallet asset |
| Balance fallback | `useGetBalance` in `WalletView.tsx` | production-shaped read | balance_projection | Points-backed | Medium/High | MVP-ready as read | Balance fact displayed as projection |
| TransactionList | `Wallet/TransactionList.tsx` | projection | transaction_read_projection | Points-backed | High | internal-beta | Row != receipt |
| Points bucket cards | `WalletView.tsx`, `BalanceCards.tsx` | projection | bucket_summary | derived | High | internal-beta | `estimatedUnlockablePoints` is estimate |
| Connect Levels | `Levels/LevelsView.tsx` | production-shaped projection | badge_projection | Points badge-backed | Medium/High | MVP-ready as projection | Not progression authority |
| AchievementsList/Card | `Levels/*` | projection | badge_projection | projection-backed | Medium/High | MVP-ready with guardrails | Catalog vs earned split must remain clear |
| Referrals route | `ReferralsView.tsx`, `ReferralsContent.tsx` | projection | referral_read_model | referral/points-backed | High | internal-beta | Referral status, not payout statement |
| Referral invite copy/share | `ReferralsContent.tsx`, `InviteModal.tsx` | user action | invitation_flow | referral domain | Medium | MVP-ready | Share link not reward proof |
| RF Connect section | `ConnectRfSection.tsx` | projection | rf_voucher_projection | RF-backed | High | internal-beta | Read-only RF summary, not cashback |
| RF voucher projection panel | `RfVoucherProjectionPanel.tsx` | projection | lifecycle_projection | RF-backed | High | internal-beta | Timeline not settlement |
| Analytics view | `AnalyticsView.tsx` | future-only placeholder | future_placeholder | none | Medium | future-only | Safe placeholder if kept inert |
| Missions view | `MissionsView.tsx` | future-only placeholder | future_placeholder | none | Medium | future-only | No Connect mission authority |
| NFTTab | `Wallet/NFTTab.tsx` | future-only stub | future_placeholder | none | High | future-only | Inert; not NFT ownership |
| G2ATab | `Wallet/G2ATab.tsx` | future-only stub | future_placeholder | none | Critical | future-only | Inert; no token wallet |
| BridgeModal | `Wallet/BridgeModal.tsx` | future-only stub | future_placeholder | none | Critical | future-only | Inert; no bridge/amount/address |
| Connect mock balances | `mockData.ts` | mock-only | local_mock_UI_only | mock-backed | Critical | blocked | Contains G2A and NFT counts |
| Connect mock transactions | `mockData.ts` | mock-only | local_mock_UI_only | mock-backed | Critical | blocked | Mock rows are not ledger facts |
| Connect mock achievements | `mockData.ts` | mock-only | local_mock_UI_only | mock-backed | High | blocked | Progression/NFT rewards without authority |
| Connect mock NFT badges | `mockData.ts` | mock-only | local_mock_UI_only | mock-backed | Critical | blocked | NFT/rarity/unlocked_at illusion |
| Connect legacy types | `types.ts` | vocabulary-only | type vocabulary | none | High | dangerous-until-aligned | G2A/NFT/level vocabulary survives |
| Connect copy labels | `copy.ts` | copy vocabulary | semantic layer | projection | Medium/High | internal-beta | `badge_awarded`, ledger labels need framing |

## 4. Connect Runtime Reality Map

### Backend-backed surfaces

Connect currently has several real backend-backed read paths:

- `/v1/points/balance` -> `user_balances`;
- `/v1/wallet/summary` -> ledger-derived Points bucket projection;
- `/v1/points/transactions` -> paginated Points transaction reads;
- `/v1/points/connect-dashboard` -> bounded Dashboard read model;
- `/v1/points/badges` -> badge catalog;
- `/v1/points/badges/mine` -> user's badge awards;
- referral APIs -> referral code, stats, tree and earnings;
- RF APIs -> voucher summary and user's RF voucher rows.

These are read paths. They do not make Connect an authority.

### Points-backed reads

| Connect surface | Backend source | Authority owner | Connect class |
|---|---|---|---|
| Wallet total/balance fallback | `/v1/points/balance` | Points Service | balance projection |
| Wallet buckets | `/v1/wallet/summary` | Points Service | derived bucket projection |
| Wallet history | `/v1/points/transactions` | Points Service | transaction read projection |
| Dashboard balance | `/v1/points/connect-dashboard` | Points Service | convenience read model |
| Dashboard recent transactions | `/v1/points/connect-dashboard` | Points Service | recent activity projection |
| Dashboard referrals summary | `/v1/points/connect-dashboard` + referral relations | Points/Referral domains | derived summary |
| Dashboard badges | `/v1/points/connect-dashboard` | Points Service badges | badge summary projection |
| Levels catalog | `/v1/points/badges` | Points Service | catalog projection |
| Levels earned badges | `/v1/points/badges/mine` | Points Service | badge award projection |

### Derived summaries and caches

Runtime evidence shows several projection/caching boundaries:

- `/v1/wallet/summary` returns `Cache-Control: no-store`, but the React Query callers use `staleTime: 30 * 1000`;
- `/v1/points/connect-dashboard` returns `Cache-Control: no-store`, but it is a composed convenience model with limited recent rows;
- Wallet holds paginated transaction rows in local component state and deduplicates by id;
- ActivityFeed slices recent dashboard transactions by `maxItems`;
- Dashboard badge summary strips source fields and shows only recent badge title/category/date;
- RF Connect section uses React Query `staleTime: 30_000` and builds a local projection from RF summary and voucher rows.

This is acceptable for UX, but must be documented as projection:

```text
projection_cache != authority_state
summary_count != audit_total
recent_rows != complete_history
dashboard_view != support_receipt
```

### Mock and future-only surfaces

Connect also contains surfaces that must not be used as runtime evidence:

- `mockBalances` with `g2a`, `nft_count`, `nft_legendary_count`;
- `mockLevel` with XP, multiplier and bonuses;
- `mockTransactions` with Space/Atlas/RF/Guru rows and G2A currency;
- `mockAchievements` with reward Points and NFT strings;
- `mockNFTBadges` with rarity and `unlocked_at`;
- `mockMissions` with future reward tasks;
- `NFTTab`, `G2ATab`, `BridgeModal` as inert legacy placeholders;
- older `WalletData`, `NFTWalletData`, `Level`, `Reward`, `NFTBadge` types.

These are inventory-relevant but not MVP runtime truth.

### Missing authority

Connect does not own:

- Points writes;
- Points balance authority;
- badge award authority;
- referral reward authority;
- RF voucher lifecycle authority;
- progression/level engine;
- NFT ownership;
- G2A token lifecycle;
- bridge/custody/settlement;
- receipt/support dispute proof.

## 5. Connect Semantics Model

### Canonical model

```text
domain_authority
-> backend read API
-> bounded read_model
-> Connect projection
-> user-facing embodiment
```

Connect must stay on the right side of this model:

```text
Connect projection reads facts
Connect projection does not create facts
Connect summary explains state
Connect summary does not settle disputes
Connect history visualizes activity
Connect history is not audit trail
```

### Definitions

| Term | Meaning in Stage 10.6 | Examples | Authority | Not equal to |
|---|---|---|---|---|
| `authority` | Owner of persisted facts and write rules | Points Service, `points_transactions`, `user_balances`, `user_badges`, RF, Referral | backend owner | Connect |
| `projection` | User-facing read of authority data | Wallet, Dashboard, Levels, ActivityFeed | projection-backed | source of truth |
| `summary` | Aggregated or limited convenience view | total badges, recent rows, referral totals | derived | full audit/accounting |
| `read_model` | Backend-composed convenience DTO | `/v1/points/connect-dashboard`, `/v1/wallet/summary` | owner service read model | receipt |
| `mock_only` | Local/demo static data | `mockData.ts` transactions/NFT/levels | none | ledger fact |
| `future_only` | Placeholder for later layers | G2ATab, NFTTab, BridgeModal, Analytics/Missions | none | launch-ready feature |

### Required separations

```text
Connect_projection != authority
Connect_wallet != financial_wallet
Connect_dashboard != receipt
Connect_activityfeed != audit_trail
Connect_badge_projection != badge_award
Connect_levels != progression_authority
Connect_reward_summary != economic_fact
Connect_recent_activity != proof
Connect_mock_transaction != ledger_fact
Connect_balance_projection != wallet_asset
Connect_NFT_projection != NFT_ownership
Connect_badge_count != ownership_inventory
Connect_dashboard_projection != support_receipt
Connect_projection_cache != authority_state
```

## 6. Wallet / Dashboard / ActivityFeed Boundary Map

### Wallet boundary

Current Wallet route is safer than older vocabulary suggests. It renders "Активность и история Points", uses read-only subtitles, reads balance/summary/transactions from Points APIs and displays internal Points buckets.

Safe interpretation:

```text
Connect Wallet = read-only Points activity/history projection
```

Forbidden interpretation:

```text
Connect Wallet != financial wallet
Connect Wallet != custody
Connect Wallet != asset account
Connect transaction row != receipt
Connect balance projection != wallet asset
```

Risk notes:

- route and component still use `Wallet` naming;
- bucket labels can look account-like;
- `estimatedUnlockablePoints` must stay visibly an estimate;
- transaction rows show plus/minus and can be mistaken for account statements;
- fallback from wallet summary to balance may make derived bucket gaps invisible to users.

### Dashboard boundary

Dashboard composes balance, RF projections, referrals, badges, next steps and recent Points activity. This is the most central embodiment surface.

Safe interpretation:

```text
Connect Dashboard = bounded convenience projection over multiple owner domains
```

Forbidden interpretation:

```text
Dashboard != receipt
Dashboard != account statement
Dashboard != support proof
Dashboard totals != full audit totals
Dashboard recent rows != complete history
```

Risk notes:

- "Вот ваш текущий прогресс" is useful UX but can overread as progression authority;
- "Ваши Points" and total badges can look like account inventory;
- recent badges hide `sourceType/sourceId`;
- referral earned points are a summary, not payout/commission;
- Dashboard is a snapshot and can be stale.

### ActivityFeed boundary

ActivityFeed displays recent Points transaction rows from the Dashboard read model. It is not a domain-wide activity log.

Safe interpretation:

```text
ActivityFeed = recent Points activity projection
```

Forbidden interpretation:

```text
ActivityFeed != audit_trail
recent_activity != economic_proof
ActivityFeed ordering != legal/accounting chronology
ActivityFeed row != receipt
```

Risk notes:

- limited `maxItems`;
- relative time formatting can obscure exact time;
- feed only shows transaction-shaped Points rows, not all Quest/RF/Badge facts;
- `badge_awarded` label in ledger copy could imply badge receipt if such rows exist;
- "Показать все" navigates to Wallet history, still not support-grade audit.

### Referral / RF rows

Referrals and RF are separate owner domains. Connect can project their status, but cannot make payout/cashback/settlement claims.

```text
Referral summary != commission statement
RF voucher projection != cashback or settlement
RF timeline != audit trail
RF redeem != payout
```

## 7. Connect Mock / Future-only Register

| Surface | Location | Current class | Collapse risk | Disposition |
|---|---|---|---|---|
| `mockBalances` | `components/connect/mockData.ts` | mock-only | Critical | quarantine |
| `mockBalances.g2a` | `mockData.ts` | Layer 3 mock | Critical | quarantine; Stage 11+ |
| `mockBalances.nft_count` | `mockData.ts` | Layer 4 mock | Critical | quarantine |
| `mockLevel` | `mockData.ts` | mock progression | High | quarantine; future progression engine |
| `mockTransactions` | `mockData.ts` | mock transaction history | Critical | quarantine; mock transaction != ledger fact |
| G2A mock transaction | `mockData.ts` | mock/future-only | Critical | quarantine |
| `mockAchievements` | `mockData.ts` | mock progression | High | quarantine |
| achievement reward NFT strings | `mockData.ts` | NFT vocabulary | Critical | quarantine; rename later |
| `mockNFTBadges` | `mockData.ts` | mock-only | Critical | quarantine |
| `mockMissions` | `mockData.ts` | future mission reward preview | High | quarantine |
| `mockReferrals` | `mockData.ts` | mock referral summary | High | quarantine |
| `mockNextActions` | `mockData.ts` | static reward hints | High | quarantine |
| `NFTTab` | `Wallet/NFTTab.tsx` | future-only stub | High | keep inert |
| `G2ATab` | `Wallet/G2ATab.tsx` | future-only stub | Critical | keep inert |
| `BridgeModal` | `Wallet/BridgeModal.tsx` | future-only stub | Critical | keep inert |
| `LevelProgress` | `Levels/LevelProgress.tsx` | future-only/stub | Medium | keep inert |
| `AnalyticsView` | `Analytics/AnalyticsView.tsx` | future-only placeholder | Medium | safe placeholder |
| `MissionsView` | `Missions/MissionsView.tsx` | future-only placeholder | Medium | safe placeholder |
| legacy `NFTBadge` types | `types.ts` | vocabulary-only | High | rename later in 10.10 |
| legacy `Reward.g2a/nft` | `types.ts` | vocabulary-only | High | rename/quarantine later |

Disposition rules:

- `keep inert`: acceptable if not wired as current capability;
- `quarantine`: do not cite as runtime truth or evidence;
- `rename later`: Stage 10.10 copy/type cleanup;
- `future-only placeholder`: allowed only with explicit non-activation copy;
- `replace with backend projection`: future implementation path through Points/RF/Referral owner APIs.

## 8. Connect Badge / Levels Projection Boundary

Connect Levels is the strongest current example of correct Layer 2 projection. It reads badge catalog and user's badge awards, merges them locally, and distinguishes earned from not earned.

Current safe semantics:

- `catalogData.items` = active badge definitions;
- `myBadgesData.items` = backend-confirmed user badge awards;
- `isEarned = Boolean(awarded)`;
- `awardedAt` appears only from user badge award data;
- empty state says a badge appears after backend confirmation;
- level progress is explicitly planned and not shown without backend data.

Boundary rules:

```text
Connect_badge_projection != badge_award
Connect_levels != progression_authority
catalog_badge != user_owned_badge
badge_count != ownership_inventory
awardedAt_projection != receipt
level_copy != level_runtime
```

Risks:

- page title "Бейджи" and section "Достижения" may be read as full achievement system;
- "Получено бейджей" count can be screenshot as proof;
- Dashboard recent badges hide source/provenance and can be stale;
- catalog visible cards can be misread as attainable/guaranteed;
- route `/connect/levels` keeps "levels" vocabulary even though progression engine is absent.

MVP-safe posture:

```text
Levels = Connect badge projection hub
Progression = future-only until backend authority exists
```

## 9. Connect Abuse & Collapse Risk Register

| Risk | Surface/flow | Severity | Abuse path | Current mitigation | Required future mitigation |
|---|---|---|---|---|---|
| Dashboard as receipt | Dashboard totals/recent rows | High | User screenshots dashboard as proof | read-only API docs | explicit support-proof boundary, timestamps |
| Wallet as custody | `/connect/wallet`, bucket cards | High | Wallet language read as financial account | read-only copy, Points wording | rename/copy pass, no custody language |
| Transaction row as receipt | TransactionList/ActivityFeed | High | Row used as dispute proof | source labels, link to history | authority link/support lookup |
| ActivityFeed as audit trail | recent transactions | High | recent subset treated as full ledger | limited feed, route to history | complete-history disclaimers |
| Projection cache as truth | React Query staleTime/local state | Medium/High | stale count/balance cited as current state | no-store backend | freshness labels/refetch semantics |
| Reward summary as payout proof | referrals/RF summaries | High | totals read as payout/commission/cashback | RF copy says no financial metrics | Stage 10.10 copy cleanup |
| Badge count as ownership inventory | Dashboard/Levels | High | badge count screenshot as ownership proof | backend badge copy | share/support guardrails |
| NFT ownership illusion | NFTTab/mockNFTBadges/types | Critical | legacy NFT vocabulary revived | inert stub | quarantine + rename later |
| G2A launch illusion | G2ATab/BridgeModal/mock G2A | Critical | placeholder read as token wallet | inert copy | keep unmounted, Stage 11 only |
| Mock transaction history | `mockData.ts` | Critical | mock rows cited as ledger facts | mock data not exported publicly | quarantine and docs guardrail |
| Fake progression | mockLevel, mockAchievements, Missions | High | XP/mission progress read as runtime | current views mostly future-only | backend progression gate |
| RF cashback collapse | RF voucher projections | High | voucher timeline read as payout/cashback | copy says RF owner/read-only | RF-specific proof-class copy |
| Referral commission collapse | referral earned points | High | referral summary read as commission | helper text says Points/internal | referral/payout boundary copy |
| Screenshot-as-proof | Dashboard/Wallet/Levels | High | screenshot used in support/social dispute | global guardrails | support policy and verified lookup |
| Support confusion | Dashboard projection | Medium/High | support resolves based on UI snapshot | no support receipt flow | canonical backend support tools |

## 10. MVP Connect Cutline

### MVP-ready

MVP-ready as projection hub only:

- Connect Dashboard as bounded convenience projection;
- Wallet read-only Points history and internal Points summary;
- TransactionList as paginated Points read projection;
- ActivityFeed as recent Points preview;
- Levels as badge catalog/user badge projection;
- Referrals as referral status/Points projection;
- RF section as read-only RF projection;
- Analytics/Missions as honest future-only placeholders.

### Internal-beta only

- wallet bucket interpretation (`available`, `locked`, `network`, `estimatedUnlockable`);
- Dashboard badge and referral totals;
- ActivityFeed labels for cross-domain actions;
- RF voucher timeline inside Dashboard;
- referral share/copy UX;
- any `badge_awarded` activity label;
- Dashboard "progress" language.

### Future-only

- progression engine;
- XP/levels/multipliers;
- Connect-owned missions;
- G2A token wallet;
- NFT ownership/collection;
- bridge/top-up/withdraw;
- support-grade receipt/export;
- account statement / audit trail;
- badge share verification.

### Blocked

- Connect as economic authority;
- Connect Wallet as financial wallet/custody;
- Dashboard as receipt/account statement;
- ActivityFeed as audit trail;
- mock transactions as ledger facts;
- NFT/G2A/Bridge activation;
- payout/settlement/cashback claims;
- Slice 16 movement.

### Dangerous until aligned

- `Wallet` route/component naming;
- `History`, `transaction`, `ledger` copy near support contexts;
- dashboard total Points / total badges screenshots;
- `CONNECT_LEDGER_ACTION_LABELS.badge_awarded`;
- mock G2A/NFT/level/achievement data;
- legacy `NFTBadge`, `NFTRarity`, `Reward.g2a`, `Reward.nft`;
- RF/referral summaries without explicit non-payout framing.

## 11. Recommended Follow-up Slices

### Stage 10.10 — UX Copy & Proof-Class Alignment

Pass forward:

- Wallet naming/copy risk;
- Dashboard "progress", totals and "recent" wording;
- ActivityFeed/TransactionList receipt/audit-trail boundary;
- `badge_awarded` ledger label;
- RF/referral summary non-payout copy;
- NFT/G2A/type vocabulary cleanup.

### Stage 10.11 — MVP Economy Cutline

Pass forward:

- Connect MVP-ready only as projection hub;
- no wallet/custody/receipt claims;
- Levels ready only as badge projection;
- Analytics/Missions stay future-only;
- mockData is not evidence.

### Stage 10.12 — Implementation Readiness

Defer:

- freshness/timestamp strategy;
- verified support lookup links;
- Connect projection invalidation rules;
- authority links from projection rows;
- producer implementation dependencies that feed Connect projections.

### Stage 11 — Externalization / Gateway Baseline

Defer:

- NFT ownership/export;
- G2A/token wallet;
- bridge/top-up/withdraw;
- marketplace/custody semantics;
- external wallet integration.

## 12. Multi-Agent Review Synthesis

| Role | Stage 10.6 assessment |
|---|---|
| ИИ-архитектор | Connect is the correct economy embodiment hub, but its architecture must remain projection-only and authority-free. |
| ИИ-аналитик | Product risk is not missing UI, but over-reading summaries as receipts, wallet custody or progression authority. |
| ИИ-бэкенд-разработчик | Runtime reads are mostly Points/RF/Referral-backed; `connect-dashboard` and `wallet/summary` are convenience read models, not SSOT. |
| ИИ-фронтенд-разработчик | New Connect runtime surfaces are safer, while `mockData`, legacy NFT/G2A types and wallet naming remain risky vocabulary. |
| ИИ-тестировщик | MVP-ready means projection hub only; ActivityFeed, Dashboard and Wallet need proof-class boundaries before broader MVP claims. |
| ИИ-специалист по безопасности | Highest risks are screenshot-as-proof, wallet/custody interpretation, stale projections, mock ledger rows and NFT/G2A placeholder revival. |
| ИИ-технический писатель | Canon should consistently use `projection`, `read_model`, `summary`, `authority`, `mock_only`, `future_only`. |

## 13. Guardrails Reconfirmed

Inherited guardrails:

```text
token != money
NFT != receipt
badge != NFT_mint
Points != payout_system
Wallet != financial_wallet
RF != cashback_system
RF_redeem != payout
Dashboard != receipt
ActivityFeed != audit_trail
screenshot != proof
diagnostics != rollout_evidence
contract != activation
stable_enough != launch_ready
slice_16_status = blocked_not_triggered
```

Stage 10.6 guardrails:

```text
Connect_projection != authority
Connect_wallet != financial_wallet
Connect_dashboard != receipt
Connect_activityfeed != audit_trail
Connect_badge_projection != badge_award
Connect_levels != progression_authority
Connect_reward_summary != economic_fact
Connect_recent_activity != proof
Connect_mock_transaction != ledger_fact
Connect_balance_projection != wallet_asset
Connect_NFT_projection != NFT_ownership
Connect_badge_count != ownership_inventory
Connect_dashboard_projection != support_receipt
Connect_projection_cache != authority_state
```

## 14. Final Verdict

```text
stage_10_6_status: completed_as_docs_first_connect_alignment_audit
connect_projection_hub_confirmed: true
connect_economic_authority: false
connect_progression_authority: false
connect_wallet_authority: false
connect_receipt_authority: false
connect_audit_trail_authority: false
connect_wallet_financial_semantics_risk: high
connect_activityfeed_audittrail_risk: high
connect_mock_projection_risk: critical
connect_stale_projection_risk: medium_high
connect_levels_projection_defined: true
connect_dashboard_receipt_risk: high
connect_nft_g2a_future_surfaces_active: false
connect_mvp_ready_as_projection_hub: true
connect_mvp_ready_as_financial_wallet: false
connect_mvp_ready_as_receipt_or_audit_layer: false
recommended_next_slice: Stage_10_10_UX_Copy_And_Proof_Class_Alignment
recommended_mvp_slice: Stage_10_11_MVP_Economy_Cutline
recommended_externalization_slice: Stage_11_Externalization_Gateway_Baseline
slice_16_status: blocked_not_triggered
```

Honest Stage 10.6 conclusion:

Connect is now the central embodiment hub for the internal Go2Asia economy. It should remain the place where users understand their Points, referrals, RF participation, badges and recent activity, but it must not become the authority for any of those domains. Wallet must stay a read-only Points projection, Dashboard must not become a receipt or account statement, ActivityFeed must not become an audit trail, and Levels must remain a badge projection until a real progression authority exists. NFT/G2A/Bridge and mockData surfaces remain future-only or quarantined. Stage 10.10 copy/proof-class alignment is the critical next step before MVP cutline decisions.
