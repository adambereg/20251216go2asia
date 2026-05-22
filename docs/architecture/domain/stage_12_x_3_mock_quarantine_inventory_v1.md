# Stage 12.x.3 — Mock Quarantine Inventory

Документ: `stage_12_x_3_mock_quarantine_inventory_v1.md`  
Статус: read-only mock/demo corpus inventory and quarantine plan  
Дата: 2026-05-22  
Scope: mock/demo/fixture/seed corpora, route reachability, public barrel exposure, proof/mock risks, Path B residue, quarantine sequencing after Stage 12  
Mode: read-only audit + planning/canon document; no frontend, backend, runtime, route, type, API, OpenAPI, SDK, schema, migration, CI or feature flag implementation changes

## 0. Orchestration Summary

Task type: mock / product-reality / security audit.

Risk level: `MEDIUM_HIGH`.

Reason:

- mock/demo data can still look like runtime truth, Points/badge proof, reward receipt, financial wallet, NFT/G2A ownership, booking/payment proof, leaderboard/XP economy or launch evidence;
- some corpora are route-reachable or env-gated, not only dormant technical debt;
- public barrels and dormant mock-consuming views can make accidental re-wiring easy;
- this slice is plan-only and does not remove, move or rewrite code.

Capsules used:

| Capsule | Role in this slice |
|---|---|
| `docs/ai/context/core/capsule.md` | Path A/Path B firewall, owner fact and no-public-launch doctrine |
| `docs/ai/context/ui/capsule.md` | UI proof-class, mock quarantine and vocabulary boundaries |
| `docs/ai/context/security/capsule.md` | mock-as-proof, screenshot/share-card and support-proof rejection |
| `docs/ai/context/stage_12_product_reality/capsule.md` | Stage 12 residue and Stage 12.x mock inventory routing |
| `docs/ai/context/routing_rules.md` | Capsule composition and anti-overload rules |

Required agents / review modes used:

| Gate | Result |
|---|---|
| Product Reality Review | Active, env-gated, dormant and barrel-exposed mock surfaces classified |
| Frontend Review | UI route reachability, direct imports and public barrels inventoried |
| Runtime Governance Review | Mock/projection/owner-fact proof boundaries preserved |
| Security / Fraud & Abuse Review | Mock-as-proof, reward, wallet, NFT/G2A, booking/payment and screenshot risks classified |
| QA Review | Future grep/import/barrel/env guardrails proposed |
| Canon Review | This document positioned below Stage 11.8/11.9, Stage 12 and Stage 12.x.2 |

Allowed write scope:

```text
docs/architecture/domain/stage_12_x_3_mock_quarantine_inventory_v1.md
```

No code changes were made.

## 1. Purpose

Stage 12 accepted a bounded UI/copy/mock alignment pass, but it intentionally did not complete a full mock quarantine.

This document creates the canonical planning inventory for mock/demo corpora after Stage 12:

```text
Stage_12 = successful_first_alignment_pass
Stage_12 != fully_clean_UI_layer
Stage_12.x.3 = read_only_mock_quarantine_inventory_and_disposition_plan
Stage_12.x.3 != mock_removal_implementation
Stage_12.x.3 != route_or_type_rename
Stage_12.x.3 != public_launch_ready
Stage_12.x.3 != smoke_proof_execution
```

The goal is to identify:

- which mock corpora are safe dev/test fixtures;
- which corpora are dangerous because they look like owner facts or runtime truth;
- which corpora are reachable from active UI;
- which corpora leak through public barrels or route wiring;
- which corpora create Path B, proof, receipt, reward, wallet, NFT, booking, payment, leaderboard or XP illusions;
- which future quarantine action each corpus needs.

## 2. SSOT Positioning

This document is the planning SSOT for mock/demo corpus inventory and disposition only.

It does not replace:

- Stage 11.8 runtime smoke proof;
- Stage 11.9 closure review;
- Stage 12 UI/copy/mock alignment canon;
- Stage 12.x.2 legacy route/type vocabulary cleanup plan;
- AI context capsules;
- runtime owner facts, API/OpenAPI/SDK contracts or database schema.

Hierarchy:

```text
Stage 11.9 governance boundaries
  > Stage 11.8 smoke proof mock rejection rules
  > Stage 12 UI/copy/mock alignment
  > Stage 12.x.2 route/type vocabulary cleanup plan
  > Stage 12.x.3 mock quarantine inventory
  > future implementation PRs
```

If this plan conflicts with Stage 11.8, Stage 11.9 or Stage 12, the upstream SSOT wins.

Relationship to Stage 12.x.2:

- Stage 12.x.2 owns route/type/component naming strategy and redirects/aliases.
- Stage 12.x.3 owns mock corpus, route reachability, barrel exposure and quarantine sequencing.
- Future route aliases are dangerous if they keep mock-backed surfaces reachable without quarantine.

## 3. Doctrine Carried Forward

Canonical boundaries preserved:

```text
mock_data != proof
demo_data != proof
screenshot != proof
share_card != proof
mock_data != fallback
projection != authority
Dashboard != receipt
Wallet != financial_wallet
ActivityFeed != audit_trail
Points_row = economic_fact
user_badges_row = badge_award_fact
RF_voucher = lifecycle_fact_only
Rielt_inquiry = inquiry_fact_only
Path_B = excluded_by_default
NFT_placeholder != runtime_feature
G2A_placeholder != active_token_product
NEXT_PUBLIC_DATA_SOURCE=mock != smoke_evidence
Stage_12 != public_launch_ready
```

Only owner facts can terminate proof. Mock/demo data, projections, screenshots, diagnostics, feature flags and route labels cannot terminate proof.

## 4. Scope

In scope:

- mock/demo/fixture/seed corpus inventory;
- fake stats, rewards, balances, NFT/G2A/token values, transactions, activity feeds, leaderboard/XP, booking/payment proof-like data;
- direct imports and route reachability;
- public barrel exposure;
- `NEXT_PUBLIC_DATA_SOURCE=mock` and env-gated UI;
- test fixture and seed data leakage risk;
- Storybook/design-system/examples search;
- quarantine strategy and future implementation slices.

Out of scope:

- deleting files;
- moving files;
- changing frontend/backend/runtime;
- changing routes, types or component names;
- API/OpenAPI/SDK/schema changes;
- feature flag implementation;
- CI implementation;
- Path B activation;
- mock replacement with real runtime;
- economy, reward, spendability, booking, payment, payout or cashback changes;
- launch readiness claims.

## 5. Search / Inspection Method

Targeted search only; no unbounded repo reading.

Searches performed:

```text
Glob **/*{mock,Mock,demo,Demo,fixture,Fixture,seed,Seed,sample,Sample,fake,Fake}*.{ts,tsx,js,json,md}
rg "\b(mock|demo|fixture|seed|sample|fake|mockData|mockQuests|mockListings|mockPartners|mockVouchers)\b" --glob "*.{ts,tsx,js,json,md}"
rg "from ['\"].*(mockData|mockQuests|mockListings|mockEvents|mockObjects|@/mocks|@/components/.*/mock|@/lib/rieltSeedRepo|useRieltSeed)" apps/go2asia-pwa-shell --glob "*.{ts,tsx}"
rg "export .*mock|export \* from ['\"].*(mock|Mock)|mockData|mockEvents|mockObjects|mockQuests|mockListings" apps/go2asia-pwa-shell/components --glob "**/index.ts"
rg "NEXT_PUBLIC_DATA_SOURCE|DATA_SOURCE=mock|getDataSource\(|mock' \? 'mock' : 'api'" --glob "*.{ts,tsx,md,env,example,local,json,yml,yaml}"
rg "verifiedBooking|verifiedPurchase|instantBooking|g2aBalance|earned_rewards|mockWalletData|mockNFTWalletData|mockNFTBadges|leaderboard_position|pointsReward|type: 'spend'|level:\s*[0-9]|points:\s*[0-9]{3,}|nft_count|G2A|NFT|bridge|token" apps/go2asia-pwa-shell --glob "*.{ts,tsx}"
rg "mock|demo|seed|points|reward|voucher|wallet|NFT|G2A|booking|payment" packages/db/src --glob "*.ts"
rg "mock|demo|fixture|scenario|reward|G2A|NFT|voucher|payment|booking|proof" apps/rf-service/src --glob "*.ts"
rg "\.stories\.|Storybook|storybook" --glob "*.{ts,tsx,md,js,json}"
rg "nfts|NFT|mock|demo|wallet|reward|balance" packages/ui frontend-shell/packages/design-system design-system --glob "*.{md,ts,tsx}"
```

Key files/directories inspected:

- `apps/go2asia-pwa-shell/app/HomePageClient.tsx`
- `apps/go2asia-pwa-shell/components/landing/HomePageContent.tsx`
- `apps/go2asia-pwa-shell/components/connect/mockData.ts`
- `apps/go2asia-pwa-shell/components/space/mockData.ts`
- `apps/go2asia-pwa-shell/components/quest/mockQuests.ts`
- `apps/go2asia-pwa-shell/components/rf/mockData.ts`
- `apps/go2asia-pwa-shell/components/rielt/mockListings.ts`
- `apps/go2asia-pwa-shell/components/pulse/mockEvents.ts`
- `apps/go2asia-pwa-shell/components/guru/mockObjects.ts`
- `apps/go2asia-pwa-shell/mocks/*`
- `apps/go2asia-pwa-shell/modules/atlas/guides/mockAdapter.ts`
- `apps/go2asia-pwa-shell/lib/rieltSeedRepo.ts`
- `apps/go2asia-pwa-shell/components/*/index.ts`
- `apps/go2asia-pwa-shell/app/(public)/quest/[id]/complete/page.tsx`
- `apps/go2asia-pwa-shell/app/(authenticated)/rf/pro/partners/page.tsx`
- `apps/go2asia-pwa-shell/app/(authenticated)/rf/pro/verifications/page.tsx`
- `apps/rf-service/src/entitlementMock.ts`
- `packages/db/src/seedConnectDemo.ts`
- `packages/db/src/connectDemoData.ts`
- `packages/db/src/seedRfPaidStagingOffers.ts`
- `packages/db/src/seedVipPaidVoucherValidationTopup.ts`
- `packages/ui`
- `frontend-shell/packages/design-system`
- `design-system/ui-components`

## 6. Mock File / Corpus Inventory

| ID | Corpus / surface | Path | Domain | Visibility | Wired status | Proof class | Product reality risk | Stage 12 delta | Disposition category |
|---|---|---|---|---|---|---|---|---|---|
| M-01 | Authenticated Home `userStats` / `userRewards` | `app/HomePageClient.tsx`, `components/landing/HomePageContent.tsx` | Home | Public/authenticated | Active | `mock_demo` | `MOCK_AS_PROOF_RISK`, `PROJECTION_AS_TRUTH_RISK`, screenshot/share-card risk | Relabeled but still mock-shaped | Remove from active/public surface or replace with API/empty |
| M-02 | Connect economy mega-corpus | `components/connect/mockData.ts` | Connect | Internal code | Orphan / dormant | `mock_demo` | fake wallet, balances, referrals, NFT/G2A, leaderboard | G2A/NFT values reduced and no public barrel | Move to legacy/dev-only or delete after import confirmation |
| M-03 | Connect mock wrapper views | `DashboardMockView`, `WalletMockView`, `ReferralsMockView` | Connect | Internal code | Dormant | `mock_demo` | accidental rewire to active views | Not exported from main barrel | Move to dev-only or delete with M-02 |
| M-04 | Space mock corpus | `components/space/mockData.ts` | Space | Internal code | Dormant components; routes stubbed | `mock_demo` | fake transactions, spend rows, vouchers, badges, quests, goals | `mockData` no longer public barrel export | Move to legacy/dev-only; remove mock-consuming views from public surface |
| M-05 | Space mock-consuming views | `BalanceView`, `NFTView`, `QuestsView`, `VouchersView`, `ReferralsView`, `PostsView` | Space | Internal exported components | Dormant route-level; exported through module sub-barrels | `mock_demo` | route rewire could restore Path B/economy mocks | Routes now deferred stubs | Close behind route quarantine; remove from public barrels in future |
| M-06 | Quest mock catalog | `components/quest/mockQuests.ts` | Quest | Public route dependency | Active on `/quest/[id]/complete` | `mock_demo` | fake rewards, Points, `nftBadges` | Completion page copy isolated as legacy/non-proof | Keep fixture-only or replace route with runtime/deferred page |
| M-07 | Quest mock utilities | `utils/badges.ts`, `utils/seasons.ts`, `utils/leaderboard.ts` | Quest | Internal code | Dormant | `mock_demo` | automatic NFT badge, leaderboard/XP/social score | Leaderboard route deferred | Move to legacy/test-only; block imports into routes |
| M-08 | RF mock corpus | `components/rf/mockData.ts` | RF | Authenticated/dormant | Active in two PRO legacy routes; dormant in many legacy views | `mock_demo` | fake partners, vouchers, reviews, verified purchase, PRO rewards, G2A | `mockData` no longer public barrel export | Feature-flag/route quarantine; dev-only move later |
| M-09 | RF PRO legacy mock routes | `/rf/pro/partners`, `/rf/pro/verifications` | RF | Authenticated user-facing | Active | `mock_demo` | fake partner assignment/verification can look operational | Metadata says legacy/demo | Route quarantine or replace with SDK/empty |
| M-10 | RF legacy catalog/merchant/partner views | `components/rf/Catalog`, `PartnerDetail`, `Merchant`, `PRO/Dashboard` | RF | Internal exported components | Dormant / default mock props | `mock_demo` | accidental default mock rendering | Stage 12 relabels but no structural quarantine | Remove default mock props; trim public barrel |
| M-11 | Rielt orphan mock listings | `components/rielt/mockListings.ts` | Rielt | Internal code | Orphan | `mock_demo` | instant booking, deposits, payments if rewired | Barrel removed; live frontend uses API/seed | Delete or move to legacy/test fixture |
| M-12 | Rielt seed overlay | `lib/rieltSeedRepo.ts`, `hooks/useRieltSeed.ts`, API seed routes | Rielt | Public UI/API overlay | Active hybrid | `seed_demo` | seed listings can look like production inventory | Stage 12 removed booking-proof reviews but seed remains | Keep dev/staging-labeled; gate or label source before public |
| M-13 | Pulse mock event mapper | `components/pulse/mockEvents.ts` | Pulse | Public/env-gated | Env-gated; static import in event page | `mock_demo` | content-as-production if mock mode/screenshots | Mock badge exists in EventDetail | Remove from public barrel; keep direct mock-mode import only |
| M-14 | Guru mock objects | `components/guru/mockObjects.ts` | Guru | Public barrel | Mostly dormant; `DEFAULT_CENTER` active | `mock_demo` | public barrel exports mockPlaces/mockEvents/mockQuests | Not covered by Stage 12 F-19 | Remove mock corpus from barrel; extract neutral constants |
| M-15 | PWA shared mock repository | `mocks/dto.ts`, `mocks/repo.ts`, `mocks/atlas/*`, `mocks/events.ts`, `mocks/places.ts`, `mocks/posts.ts` | Atlas/Pulse/Blog | Public when env mock | Conditional via `NEXT_PUBLIC_DATA_SOURCE=mock` | `mock_demo` | entire session can be mistaken for API truth | Default code is `api`; README has contradictory line | Keep dev-only; assert excluded from smoke/prod |
| M-16 | Atlas guide mock adapter | `modules/atlas/guides/mockAdapter.ts` | Atlas | Env-gated | Conditional | `mock_demo` | mock guide can look like content owner fact | Gated by data source | Keep dev-only behind env |
| M-17 | RF entitlement mock harness | `apps/rf-service/src/entitlementMock.ts` | RF service | Backend/test/runtime harness | Conditional / tests | `mock_demo` | entitlement scenarios could be mistaken as owner facts if exposed | Existing tests around mock endpoint | Keep test/local adapter only; exclude from customer proof |
| M-18 | Connect demo seed dataset | `packages/db/src/seedConnectDemo.ts`, `connectDemoData.ts`, `verifyConnectDemo.ts` | DB seed | Dev/staging seed | Manual guarded seed | `seed_demo` | writes demo Points/badges/referrals into DB; can become API truth in demo env | Production guards present | Keep staging/dev only; tag as demo and exclude from launch proof |
| M-19 | RF paid staging seed offers | `packages/db/src/seedRfPaidStagingOffers.ts` | RF seed | Staging seed | Manual guarded seed | `seed_demo` | fake paid voucher offers can look production-like | ENVIRONMENT/staging guards present | Keep staging-only; never use as public proof |
| M-20 | VIP paid voucher validation topup seed | `packages/db/src/seedVipPaidVoucherValidationTopup.ts` | VIP/RF seed | Staging validation | Manual guarded seed | `seed_demo` | Points topup can look like real user entitlement | Staging validation purpose explicit | Keep validation fixture only |
| M-21 | Design-system README examples | `design-system/ui-components/README.md`, `frontend-shell/.../README.md` | Design docs | Docs/examples | Docs only | `doc_example` | `nfts` examples preserve legacy vocabulary | Stage 12 active shared UI fixed `nfts` -> `badges` | Docs-only cleanup later |

## 7. Mock Surface / Wiring Inventory

Active or route-reachable surfaces:

| Surface | Route / consumer | Mock source | User-facing | Risk |
|---|---|---|---|---|
| Home authenticated dashboard | `/` when authenticated | Inline `userStats`, `userRewards` | Yes | `CRITICAL`: fake Points/badges/levels/vouchers can look like account facts |
| Quest complete legacy page | `/quest/[id]/complete` | `mockQuests` | Yes | `HIGH`: quest reward metadata can look like completion proof if disclaimers regress |
| RF PRO partners | `/rf/pro/partners` | `mockPartners` | Authenticated | `HIGH`: fake partner inventory/assignment |
| RF PRO verifications | `/rf/pro/verifications` | `mockVerifications`, `mockPartners` | Authenticated | `HIGH`: fake verification workflow |
| Pulse event detail | `/pulse/events/[slug]` when data source mock | `mockEventsById` | Yes | `MEDIUM_HIGH`: env-gated content-as-truth |
| Atlas pages | `/atlas/**` when data source mock | `mockRepo` | Yes | `MEDIUM_HIGH`: env-gated catalog/content-as-truth |
| Rielt pages | `/rielt/**` seed overlay | `rieltSeedRepo` | Yes | `MEDIUM`: seed inventory can look production-like |
| Guru map center | `/guru` | `DEFAULT_CENTER` from mockObjects | Yes but constant only | `LOW_MEDIUM`: import path keeps mock corpus adjacent |

Dormant or isolated surfaces:

| Surface | Status | Risk |
|---|---|---|
| Connect `mockData.ts` and mock wrappers | no direct route imports found | one import can restore fake wallet/referral/NFT/G2A corpus |
| Space mock views | active code exports, but public routes are deferred stubs | route rewire can restore Balance/NFT/voucher/quest mocks |
| RF legacy catalog/partner/merchant views | exported components with default mock props | future render without props can show mock catalog as operational |
| Quest leaderboard/badges/seasons utils | not exported from `utils/index.ts` and no app route imports found | future utility import can activate XP/social-score/NFT-badge logic |
| Rielt `mockListings.ts` | no active imports found | booking/payment-like fields if rewired |
| `mocks/posts.ts` | repo blog path unused by active routes | low, but still dev mock content |

## 8. Public Barrel / Export Graph

| Barrel | Current state | Risk | Future action |
|---|---|---|---|
| `components/connect/index.ts` | does not export mock data | Low | Keep guard |
| `components/space/index.ts` | does not export `mockData`, but exports `Balance`, `NFT`, `Quests`, `Vouchers`, `Referrals`, `Posts` submodules that consume mock data | Medium | Stop exporting dormant mock-heavy views or move them to legacy/demo-only |
| `components/rf/index.ts` | does not export `mockData`, but exports legacy catalog/partner/merchant/PRO components that import mocks | Medium/High | Trim legacy mock views from public barrel or require explicit dev imports |
| `components/quest/index.ts` | does not export `mockQuests` | Low | Keep guard |
| `components/rielt/index.ts` | explicitly notes `mockListings` removed | Low | Keep guard |
| `components/pulse/index.ts` | exports `mockEvents`, `mockEventsById` | High | Remove mock exports from public barrel |
| `components/guru/index.ts` | exports `mockObjects`, `mockPlaces`, `mockEvents`, `mockHousing`, `mockPeople`, `mockQuests`, `DEFAULT_CENTER`, `OBJECT_COUNTS` | High | Remove corpus exports; extract `DEFAULT_CENTER` to neutral constants |
| `packages/ui`, design-system barrels | no runtime mock corpora found | Low | Docs-only example cleanup later |

## 9. Data-Source / Environment Boundaries

`apps/go2asia-pwa-shell/mocks/dto.ts` resolves:

```text
NEXT_PUBLIC_DATA_SOURCE === "mock" ? "mock" : "api"
```

Observed state:

- code default is `api`;
- `.env.local` and `apps/go2asia-pwa-shell/.env.local` use `NEXT_PUBLIC_DATA_SOURCE=api`;
- `mocks/README.md` contains a contradiction: line 7 says default `api`, line 8 says default `mock`;
- Atlas/Pulse/Guru-adjacent pages statically import mock helpers even when data source is `api`;
- Pulse EventDetail contains an explicit mock-data banner when mock mode is active.

Rules:

```text
NEXT_PUBLIC_DATA_SOURCE=mock -> exclude entire session from smoke/support/launch evidence
mock mode can be dev-only visual verification
mock mode cannot prove runtime readiness
mock mode cannot be fallback when API is missing
```

Future quarantine:

- align `mocks/README.md` with `dto.ts`;
- add deployment/CI guard that staging/prod never uses `NEXT_PUBLIC_DATA_SOURCE=mock`;
- add smoke checklist line: `NEXT_PUBLIC_DATA_SOURCE=api`.

## 10. Classification Rules

Use these classes for future tickets:

| Class | Meaning |
|---|---|
| `SAFE_TEST_FIXTURE` | Test-only fixture, not imported by runtime/UI |
| `SAFE_DEV_ONLY` | Dev-only corpus behind explicit env/manual script and label |
| `SAFE_INTERNAL_DEMO` | Internal demo corpus with low route exposure |
| `DORMANT_PATH_B_RESIDUE` | Path B-shaped mock/type exists but is not currently wired |
| `MOCK_AS_PROOF_RISK` | Mock can be mistaken for owner fact, receipt, support proof or launch evidence |
| `ROUTE_REACHABLE_MOCK` | Mock is reachable through active route or active env mode |
| `PUBLIC_BARREL_EXPOSURE` | Mock corpus or mock-consuming component exported through index/barrel |
| `PRODUCT_REALITY_RISK` | Surface can overstate product/runtime readiness |
| `PROJECTION_AS_TRUTH_RISK` | Mock or projection looks like account/dashboard truth |
| `REWARD_FARMING_ILLUSION` | Fake reward/referral/quest loop can imply active economy |
| `BOOKING_PAYMENT_ILLUSION` | Fake booking/payment/purchase/deposit/verified purchase can imply transaction proof |
| `XP_LEADERBOARD_RISK` | Fake levels, XP, ranks or leaderboards can imply extractive gamification |
| `REMOVE_FROM_PUBLIC_SURFACE` | Future implementation should remove from route/nav/public UI |
| `MOVE_TO_LEGACY_OR_DEMO` | Future implementation should move to `_legacy`, `_demo`, `_dev` or fixture-only area |
| `CLOSE_BEHIND_DEV_FLAG` | Future implementation should gate behind explicit dev/staging flag |
| `BLOCKED_UNTIL_RUNTIME_REPLACEMENT` | Mock cannot be removed from UX safely until real API/empty/projection replacement exists |

## 11. Mock Proof-Risk Matrix

| Corpus | Route reachable | User-facing | Proof risk | Path B risk | Action | Future slice |
|---|---|---|---|---|---|---|
| Home inline stats/rewards | Yes | Yes | Critical | Medium | Replace with API projection or empty/deferred state | 12.x.3-A / 12.x.4 dependency |
| Connect mock balances/wallet/referrals | No current route imports | No | High if rewired | High | Move/delete as dev-only; grep block route imports | 12.x.3-B/G |
| Space mock transactions/vouchers/badges | Dormant views exported | Indirect | High if rewired | High | Remove from public surface; route quarantine | 12.x.3-A/B/C |
| Quest `mockQuests` | Yes, complete page | Yes | High | Medium/High | Fixture-only or runtime/deferred replacement | 12.x.3-C/E |
| Quest leaderboard utils | No | No | Medium | Low | Move/delete as test-only | 12.x.3-B/F |
| RF `mockPartners`/`mockVerifications` | Yes, PRO routes | Authenticated | High | Low/Medium | Feature-flag or replace with API/empty | 12.x.3-C/D |
| RF `mockReviews.verifiedPurchase` | Dormant blocks | Indirect | High | Low | Remove verified-purchase proof wording before any reuse | 12.x.3-B/G |
| RF `mockPROCurator.g2aBalance` | Dormant dashboard | No current main route | High if rewired | Critical | Quarantine/zero before reuse | 12.x.3-B/D |
| Rielt `mockListings.instantBooking` | No active imports | No | Medium | Low | Delete/move to legacy; block reimports | 12.x.3-B/F |
| Rielt seed overlay | Yes | Yes | Medium | Low | Label/gate seed source; no booking/payment proof | 12.x.3-D / Rielt runtime slice |
| Pulse `mockEvents` | Env-gated + barrel | Yes in mock mode | Medium | Low | Remove public barrel; keep dev-only banner | 12.x.3-A/D/G |
| Guru `mockObjects` | Barrel + constant import | Mostly no | Medium via barrel | Low | Remove corpus barrel; extract constants | 12.x.3-A |
| Atlas/Pulse `mockRepo` | Env-gated | Yes in mock mode | Medium/High | Low | Keep dev-only; smoke excludes mock env | 12.x.3-D/G |
| DB Connect demo seed | Manual seed | API truth in demo DB | Medium/High | Low | Staging/dev only; tag demo rows | DB seed governance slice |
| RF entitlement mock | Conditional/test | API if enabled | High | High for NFT/G2A scenarios | Test/local only; exclude from proof | RF test harness governance |
| Design-system README `nfts` | Docs only | Docs reader | Low | Medium vocabulary | Docs-only replace with badges | UI docs cleanup |

## 12. Exposure Graph Summary

High-risk import paths:

```text
/ -> HomePageClient / HomePageContent -> inline userStats/userRewards
/quest/[id]/complete -> mockQuests -> RewardsView
/rf/pro/partners -> PartnersListView -> mockPartners
/rf/pro/verifications -> VerificationsListView -> mockVerifications + mockPartners
/pulse/events/[slug] -> mockEventsById when getDataSource() === "mock"
/atlas/** -> getDataSource() + mockRepo when env mock
/rielt/** -> useRieltSeed / rieltSeedRepo overlay
/guru -> DEFAULT_CENTER from mockObjects
components/pulse/index.ts -> mockEvents/mockEventsById public export
components/guru/index.ts -> full mockObjects corpus public export
components/space/index.ts -> mock-consuming submodules public export
components/rf/index.ts -> legacy mock-consuming submodules public export
```

Middleware relevance:

- `/space/balance` remains in route vocabulary and protected route planning from Stage 12.x.2, but the current page is a deferred stub and does not render `BalanceView`;
- middleware does not make mock data proof, but route reachability increases screenshot/product-reality risk.

SEO/metadata relevance:

- RF PRO legacy pages explicitly say legacy/demo;
- Quest complete metadata says local summary / no reward proof;
- Space NFT/balance pages use negative/deferred wording;
- active Home inline mock stats have no equivalent route-level mock metadata boundary.

Storybook/design-system relevance:

- no `.stories.*` files found in targeted search;
- design-system README examples still use `nfts`, which is docs-only vocabulary residue.

## 13. Quarantine Strategy

### Slice A — Remove from public barrels

Goal: prevent accidental imports from broad module barrels.

Candidates:

- `components/guru/index.ts` mock corpus exports;
- `components/pulse/index.ts` mock events exports;
- mock-consuming exports from `components/space/index.ts` if those submodules remain dormant;
- legacy mock-consuming RF views from `components/rf/index.ts`.

Acceptance:

```text
public_barrels_export_zero_mock_corpora: true
mock_consuming_views_not_exported_as_default_module_surface: true
```

### Slice B — Move to `_legacy`, `_demo`, `_dev` or fixture-only

Candidates:

- `components/connect/mockData.ts`;
- `components/space/mockData.ts`;
- `components/rf/mockData.ts`;
- `components/quest/mockQuests.ts`;
- `components/quest/utils/leaderboard.ts`;
- `components/rielt/mockListings.ts`;
- Connect mock wrapper views;
- RF legacy catalog/merchant/mock dashboard views.

Acceptance:

```text
mock_corpora_not_importable_from_app_routes_by_default: true
dev_only_or_legacy_label_present: true
```

### Slice C — Route quarantine

Candidates:

- `/quest/[id]/complete`;
- `/rf/pro/partners`;
- `/rf/pro/verifications`;
- `/space/balance` and `/space/nft` in coordination with Stage 12.x.2 route plan.

Acceptance:

```text
active_routes_do_not_render_mock_as_runtime_truth: true
legacy_routes_show_deferred_or_empty_state_until_runtime_exists: true
```

### Slice D — Feature-flag / environment quarantine

Candidates:

- `NEXT_PUBLIC_DATA_SOURCE=mock`;
- Atlas/Pulse mock mode;
- Rielt seed overlay;
- RF entitlement mock harness.

Acceptance:

```text
prod_or_staging_smoke_env_data_source_api: true
mock_mode_excluded_from_evidence: true
seed_overlay_labeled_or_disabled_for_public: true
```

### Slice E — Delete after runtime replacement

Delete only after import graph confirmation and replacement exists:

- Home inline stats/rewards after API projection or explicit empty state;
- Quest complete mock metadata after route replacement;
- RF PRO mock routes after live workflow or deferred placeholder;
- Rielt orphan mock listings after grep confirms no imports.

### Slice F — Keep as safe test fixture

Allowed if isolated:

- RF entitlement mock tests;
- identity-core fixtures;
- explicit staging validation fixtures with production guards;
- DB seed data only when labeled staging/dev and excluded from proof.

### Slice G — Mock proof/reward grep guardrails

Recommended future checks:

```text
rg "from ['\"].*/(connect|space|rf|quest)/mock" apps/go2asia-pwa-shell/app
rg "mockData|mockQuests|mockEvents|mockObjects|mockListings" apps/go2asia-pwa-shell/components --glob "**/index.ts"
rg "earned_rewards|g2aBalance|mockWalletData|mockNFTWalletData|verifiedPurchase|instantBooking|leaderboard_position|pointsReward|type: 'spend'" apps/go2asia-pwa-shell/components
rg "points:\s*[0-9]{3,}|level:\s*[0-9]+" apps/go2asia-pwa-shell/app apps/go2asia-pwa-shell/components/landing
rg "NEXT_PUBLIC_DATA_SOURCE=mock" .env* apps/**/.env* docs/ops
rg "getMockLeaderboard|LeaderboardEntry|social score" apps/go2asia-pwa-shell
```

### Slice H — Documentation / warning headers

Candidates:

- `mocks/README.md` default contradiction;
- warning headers in retained mock corpora;
- design-system README `nfts` examples;
- seed runbooks: explicit demo data is not proof.

## 14. Relationship to Stage 12.x.2

Route/type cleanup depends on mock quarantine in these places:

| Stage 12.x.2 area | Mock dependency | Risk if renamed before quarantine |
|---|---|---|
| `/connect/wallet` -> `/connect/activity` | Connect mock wallet data is dormant but still importable | Cleaner route could still accidentally import fake wallet corpus |
| `/space/balance` -> `/space/activity` | Space `BalanceView` and transactions mocks remain exported | Alias could restore mock balance/spend UI under safer name |
| `/space/nft` -> `/space/badges` | Space `NFTView` and `mockBadgesExtended` remain exported | Rename could make mock NFT collection look like off-chain badge truth |
| `NFTBadge` -> `OffChainBadge` | Quest/Space mocks still carry reward/NFT-shaped metadata | Type rename alone would hide residual fake ownership risk |
| `Reward` / `earned_rewards` cleanup | Connect/RF/Quest mocks still carry reward-like fields | Copy rename could mask fake reward loops |
| `G2ATab`, `NFTTab`, `BridgeModal` quarantine | Connect/RF/Guru/Quest mocks still contain G2A/NFT references | Path B components remain easy to wire if corpora stay public |

Sequencing recommendation:

```text
1. Add grep/barrel guardrails.
2. Remove public barrel mock exports.
3. Quarantine active route-reachable mocks.
4. Then implement route/type aliases and renames from Stage 12.x.2.
```

## 15. Blocked / Frozen Items

Do not change in Stage 12.x.3 implementation prompts:

- runtime owner facts such as `points_transactions`, `user_balances`, `user_badges`, `rf_voucher`;
- API routes such as `/v1/wallet/summary`, `/v1/points/balance`, RF/Quest service routes;
- OpenAPI, SDK and generated types;
- Prisma schema and migrations;
- Points producers and reward rules;
- RF claim/redeem lifecycle;
- Rielt inquiry runtime;
- token, NFT, G2A, bridge or financial wallet implementation;
- production/staging environment wiring unless a separate ops slice is approved.

## 16. Remaining Risks

| Risk | Severity | Owner slice |
|---|---|---|
| Active Home authenticated mock stats can be screenshotted as account proof | Critical | Stage 12.x.3-A or Stage 12.x.4-dependent UI replacement |
| RF PRO partners/verifications render mock data on authenticated legacy routes | High | Stage 12.x.3-C/D |
| Quest complete page imports `mockQuests` directly | High | Stage 12.x.3-C/E |
| Pulse/Guru barrels export mock corpora | High | Stage 12.x.3-A |
| Space/RF module barrels export dormant mock-consuming views | Medium/High | Stage 12.x.3-A/B |
| `NEXT_PUBLIC_DATA_SOURCE=mock` can invalidate smoke evidence if used in staging | Critical | Stage 12.x.3-D/G |
| Rielt seed overlay can look like production inventory without source labels | Medium | Rielt seed/runtime follow-up |
| DB demo seeds write demo rows that become API-visible in demo environments | Medium/High | DB seed governance / smoke evidence rules |
| Design-system README still uses `nfts` examples | Low | Docs-only UI cleanup |
| Next 15 typecheck blocker can mask future mock quarantine regressions | Medium | Stage 12.x.5 |

## 17. Future Implementation Acceptance Criteria

Future implementation slices must prove:

```text
public_barrels_export_zero_mock_corpora: true
app_routes_unconditional_mock_imports_zero_or_allowlisted: true
active_home_stats_not_mock_proof: true
rf_pro_legacy_routes_not_mock_truth: true
quest_complete_not_reward_proof: true
NEXT_PUBLIC_DATA_SOURCE_mock_never_in_smoke_or_prod_evidence: true
mock_data_not_fallback: true
mock_data_not_proof: true
path_b_mock_residue_quarantined: true
dormant_mock_views_unreachable_from_public_routes: true
grep_guardrails_added: true
public_launch_claims: false
```

Recommended validation per future implementation slice:

- targeted import/barrel `rg` checks from Slice G;
- route-level grep for app imports of mock corpora;
- `pnpm -C apps/go2asia-pwa-shell test`;
- `pnpm -C apps/go2asia-pwa-shell typecheck` after Stage 12.x.5 fixes Next 15 blockers, or explicit blocker note if still failing;
- no full build required for this read-only plan.

## 18. Review Gate Results

| Review gate | Result |
|---|---|
| Product Reality Review | Passed as plan-only; route-reachable and active mock risks identified |
| Frontend Review | Passed; direct imports, active routes, dormant views and barrels inventoried |
| Runtime Governance Review | Passed; mock/projection cannot terminate proof; runtime replacements deferred |
| Security / Fraud & Abuse Review | Passed with high-risk findings for Home, RF PRO, Quest, Pulse/Guru barrels and env mock |
| QA Review | Passed; future grep/import/barrel/env guardrails proposed |
| Canon Review | Passed; document is bounded planning SSOT and does not replace Stage 12 or Stage 12.x.2 |

## 19. Final Verdict

```text
stage_12_x_3_status: READY_AS_READ_ONLY_MOCK_QUARANTINE_INVENTORY
task_type: mock_quarantine_product_reality_security_inventory
risk_level: MEDIUM_HIGH
runtime_changes: false
frontend_implementation_changes: false
mock_files_deleted: false
mock_files_moved: false
route_changes: false
type_renames: false
api_openapi_changes: false
sdk_regeneration: false
schema_migration_changes: false
feature_flag_wiring: false
Path_B_activation: false
economy_expansion: false
public_launch_claims: false
canon_status: aligned
```

Stage 12.x.3 confirms that Stage 12 reduced the most visible UI/copy/mock drift, but mock quarantine is not complete.

Highest-priority future actions:

```text
1. Stage 12.x.2-E / 12.x.3-G — grep and public barrel guardrails.
2. Stage 12.x.3-A — remove mock corpora from Pulse/Guru public barrels and trim mock-consuming RF/Space exports.
3. Stage 12.x.3-C — quarantine active route-reachable mocks on Home, RF PRO and Quest complete.
4. Stage 12.x.4 — define proof-class/asOf/source UI requirements for replacing mock-shaped projections.
```

Public launch remains blocked. Mock/demo corpora, env mock mode, screenshots and share cards remain invalid as proof.
