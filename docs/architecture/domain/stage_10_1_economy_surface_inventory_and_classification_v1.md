# Stage 10.1 Economy Surface Inventory and Classification v1

Date: 2026-05-21
Status: `COMPLETED_AS_DOCS_FIRST_INVENTORY_AUDIT`
Stage: `Stage 10.1 / Economy Surface Inventory & Classification`
Mode: docs-first, read-only inventory audit, no implementation, no cleanup, no rename pass, no frontend changes, no backend changes, no API change, no OpenAPI change, no SDK change, no schema change, no migrations, no tests added, no test execution as evidence, no staging/live evidence, no rollout, no Token/NFT/G2A/on-chain activation, no wallet/bridge/marketplace activation, no payout/settlement/cashback activation, no Points enforcement activation, no Quest to Badge activation, no Slice 16 movement

Primary sources:

- `docs/roadmaps/stage_10_economy_embodiment_alignment_roadmap_correction_v1.md`
- `docs/architecture/domain/stage_9_closure_review_and_stage_10_readiness_v1.md`
- `docs/architecture/domain/stage_9_10_ecosystem_maturity_module_readiness_audit_v1.md`
- `docs/architecture/domain/stage_9_11_ecosystem_economy_layer_implementation_audit_v1.md`
- `docs/economy/economy_authority_terminology_crosswalk_v1.md`
- `docs/economy/points_policy_v1.md`
- `docs/economy/quest_badge_achievement_compatibility_v1.md`
- `docs/economy/tokenomics/go2asia_tokenomics_v1.md`
- `docs/openapi/points.yaml`
- `docs/openapi/rf.yaml`
- `docs/openapi/quest.yaml`
- `apps/go2asia-pwa-shell/components/connect/`
- `apps/go2asia-pwa-shell/components/space/`
- `apps/go2asia-pwa-shell/components/quest/`
- `apps/go2asia-pwa-shell/components/rf/`
- `apps/points-service/src/index.ts`
- `apps/quest-service/src/services/questService.ts`
- `apps/token-service/src/index.ts`
- `packages/db/src/schema/points.ts`
- `packages/db/src/schema/quest.ts`
- `packages/db/src/schema/rf.ts`

AI review roles used:

- `docs/ai/roles/architect.md`
- `docs/ai/roles/requirements_analyst.md`
- `docs/ai/roles/backend_dev.md`
- `docs/ai/roles/frontend_dev.md`
- `docs/ai/roles/qa.md`
- `docs/ai/roles/security.md`
- `docs/ai/roles/tech_writer.md`

## 1. Executive Summary

Stage 10.1 maps the current economy surface topology of Go2Asia.

The inventory confirms the post-Stage 9.11 maturity order:

```text
semantic_model_maturity
>
backend_runtime_maturity
>
frontend_embodiment_maturity
>
future_externalization_maturity
```

The current system has a real internal off-chain economy center, but it is unevenly embodied:

- Points Service is the strongest current authority for Layer 1 economic facts.
- RF and Quest produce meaningful lifecycle/activity facts and bounded delivery intents.
- Connect is the strongest projection hub, not an economy authority.
- Space has the densest mock economy cluster and the highest `mock -> runtime_truth` risk.
- Badge runtime exists as off-chain badges, while NFT language remains partially present in legacy types, UI paths and docs.
- G2A, bridge, external wallet, marketplace and on-chain NFT surfaces remain future-only or skeleton-only.

This report does not fix any surface. It only classifies surfaces so later Stage 10 slices can align, quarantine, copy-pass or defer them before Stage 11 Token / NFT / Totem Gateway Baseline Audit.

Current top risks:

```text
proof_class_collapse_risk: high
largest_embodiment_gap: Space_mock_economy_and_Connect_projection_language
most_dangerous_surface: token_service_ready_plus_G2A_NFT_bridge_placeholders
most_user_visible_collapse_cluster: Connect_Wallet_Dashboard_ActivityFeed
most_mock_heavy_cluster: Space_Balance_NFT_Transactions_Quests_Vouchers
```

## 2. Why Stage 10.1 Exists

Stage 10.1 exists because the economy is more mature as a semantic model than as a product surface.

Stage 9 established durable proof-class boundaries. Stage 9.10 and Stage 9.11 then showed that user-facing surfaces still lag behind those boundaries. The risk is not only missing implementation. The risk is that projections, local mock UI, future-only placeholders and old vocabulary can be read by users, support, partners or AI agents as current authority.

The immediate sequencing rule is:

```text
inventory_before_alignment
alignment_before_externalization
externalization_baseline_before_implementation
```

Embodiment is more important than externalization now because:

- Layer 1 Points is production-shaped, but not yet a full ecosystem-wide contribution economy.
- Layer 2 badges exist only partially as off-chain badge runtime.
- Layer 3 G2A is skeleton/docs/future-only.
- Layer 4 on-chain NFT is absent and must remain future-only.
- UI and module docs still contain vocabulary that can overstate what runtime does.

Stage 11 cannot safely audit Token / NFT / Totem Gateway until Stage 10.1 makes the current surface topology explicit. Without this inventory, Stage 11 would audit polluted surfaces and could turn mock/future/projection vocabulary into false externalization scope.

The primary Stage 10.1 risk class is:

```text
proof_class_collapse
```

That means:

- `Wallet` may be read as financial wallet.
- `Dashboard` may be read as receipt.
- `ActivityFeed` may be read as audit trail.
- `badge` may be read as NFT mint.
- `Points` may be read as money.
- `RF` may be read as cashback/payout.
- `G2A` may be read as active token.
- screenshot/share/export-like surfaces may be read as proof.
- mock surfaces may be read as runtime truth.

## 3. Economy Surface Classification Model

### 3.1 Layer Taxonomy

| Layer | Name | Current safe meaning |
|---|---|---|
| Layer 1 | Points | Internal engagement and contribution layer. Points are not money, payout, settlement or receipt. |
| Layer 2 | Off-chain badges/progression | Internal recognition, achievement and progression. Badge is not NFT mint or on-chain ownership. |
| Layer 3 | G2A | Future economic hard layer. Current state is skeleton/docs/future-only. |
| Layer 4 | On-chain NFT | Future externalized artifact layer. Current mint/bridge/marketplace/ownership runtime is absent. |
| Cross-layer | Projection / proof / diagnostics | UI/docs/API surfaces that describe, aggregate, diagnose or preview economy facts without becoming authority. |

### 3.2 Runtime Classes

| Runtime class | Definition |
|---|---|
| `production-shaped` | Has concrete backend/data/API support and can represent a bounded current runtime fact. |
| `partial_runtime` | Has some runtime support, but semantics or lifecycle are incomplete. |
| `projection` | Reads or composes backend facts, but is not itself authority. |
| `mock-only` | Local/static/demo data only. Must not be treated as runtime truth. |
| `future-only` | Intentional placeholder or roadmap vocabulary for later stages. |
| `docs-only` | Documentation/product vocabulary without current runtime surface. |
| `intentionally_absent` | Explicitly not implemented and not allowed now. |

### 3.3 Proof Classes

| Proof class | Definition |
|---|---|
| `activity_fact` | A user/module action or lifecycle fact occurred. Not necessarily an economic grant. |
| `delivery_intent` | A system intends or attempted to deliver a reward/economic action. Not authority until downstream fact exists. |
| `economic_fact` | Current bounded economic fact, e.g. persisted Points ledger row, current balance or badge award. Not receipt. |
| `read_projection` | Read model or UI composition derived from facts. Not authority. |
| `local_mock_UI_only` | Static/local/demo UI. No runtime authority. |
| `future_placeholder` | Explicit future feature placeholder. No current runtime authority. |
| `diagnostics_only` | Support/QA/admin diagnostic surface. Not rollout evidence or user proof. |
| `docs_claim_only` | Documentation phrase that must be read through guardrails. |

### 3.4 Authority Classes

| Authority level | Definition |
|---|---|
| `authority-backed` | Surface is backed by the owning runtime/data authority for a bounded domain. |
| `projection-backed` | Surface reads authoritative sources, but does not own truth. |
| `mock-backed` | Surface uses mock/local data only. |
| `no_runtime_authority` | Surface is future, docs-only, disabled, absent or conceptual. |

### 3.5 Collapse Risk Classes

| Collapse risk class | Meaning |
|---|---|
| `low` | Terminology and runtime authority are aligned enough for bounded use. |
| `medium` | Some wording or context can be overread, but risk is bounded. |
| `high` | Surface can plausibly be read as money, receipt, wallet, audit, NFT, payout or runtime truth. |
| `critical` | Surface can create false externalization/financial/readiness assumptions. |

### 3.6 MVP Readiness Classes

| MVP readiness | Meaning |
|---|---|
| `MVP-ready` | Safe for MVP only with existing guardrails and bounded semantics. |
| `internal-beta-only` | Useful internally, but needs stronger copy/authority framing before broad MVP claims. |
| `future-only` | Must remain future vocabulary/surface. |
| `blocked` | Must not be used for current MVP claims. |
| `dangerous-until-aligned` | Not inherently forbidden, but unsafe until Stage 10 alignment/copy/quarantine. |

## 4. Economy Surface Inventory

This inventory is complete for repo-visible Stage 10.1 economy surfaces found in current docs, OpenAPI, schemas, services and PWA UI. It is not staging/live evidence and does not validate production behavior.

| Surface | Module | Layer | Runtime class | Proof class | Authority level | Collapse risk | MVP readiness | Notes |
|---|---|---|---|---|---|---|---|---|
| `/v1/points/balance` / `user_balances` | Points | Layer 1 | production-shaped | economic_fact | authority-backed | medium | MVP-ready | Current internal Points balance; not money or receipt. |
| `points_transactions` / `/v1/points/transactions` | Points | Layer 1 | production-shaped | economic_fact | authority-backed | high | internal-beta-only | Strongest ledger-like surface; can be mistaken for receipt. |
| `/internal/points/add` | Points | Layer 1 | production-shaped | economic_fact | authority-backed | medium | MVP-ready | Internal write path with idempotency; not payout. |
| `/internal/points/spend` / RF spend action | Points / RF | Layer 1 | partial_runtime | economic_fact | authority-backed | high | internal-beta-only | RF Points utility trace; not payment rail or cashback. |
| Points `ACTIONS_PHASE2` vocabulary | Points | Layer 1 | partial_runtime | docs_claim_only | authority-backed for accepted actions only | high | dangerous-until-aligned | `allowed_action != active_producer`. |
| `/v1/wallet/summary` | Points / Connect | Layer 1 | projection | read_projection | projection-backed | high | dangerous-until-aligned | Ledger-derived bucket projection, not financial wallet. |
| `WalletView` `/connect/wallet` | Connect | Layer 1 | projection | read_projection | projection-backed | high | dangerous-until-aligned | User-facing route still uses Wallet naming in code/path. |
| `BalanceCards` | Connect | Layer 1 | projection | read_projection | projection-backed | high | dangerous-until-aligned | Large balance UI can overread as account/receipt. |
| `TransactionList` / wallet history | Connect | Layer 1 | projection | read_projection | projection-backed | high | dangerous-until-aligned | Recent Points rows are not receipts or audit trail. |
| `ActivityFeed` | Connect | Layer 1 | projection | read_projection | projection-backed | high | dangerous-until-aligned | "Последние действия с Points" can become audit-trail-like. |
| `/v1/points/connect-dashboard` | Points / Connect | Cross-layer | projection | read_projection | projection-backed | high | internal-beta-only | Explicitly read-only convenience dashboard, not source of truth. |
| `DashboardContent` | Connect | Cross-layer | projection | read_projection | projection-backed | high | dangerous-until-aligned | Combines balance, transactions, referrals, badges and RF projection. |
| Connect referrals summary | Connect / Referral | Layer 1 | projection | read_projection | projection-backed | medium-high | internal-beta-only | Participation summary; not commission or payout. |
| Connect analytics / Points chart | Connect | Layer 1 | projection | read_projection | projection-backed | medium-high | internal-beta-only | Useful trend surface; not accounting statement. |
| Connect missions | Connect | Layer 1 | projection | activity_fact | projection-backed | medium | internal-beta-only | Mission progress/reward vocabulary needs producer reality map. |
| Connect levels | Connect | Layer 2 | projection | read_projection | projection-backed | medium-high | internal-beta-only | Reads badge catalog/user badges; level progression incomplete. |
| `/v1/points/badges` / `badges` | Points | Layer 2 | production-shaped | economic_fact | authority-backed | medium | MVP-ready | Off-chain badge catalog only. |
| `/v1/points/badges/mine` / `user_badges` | Points | Layer 2 | production-shaped | economic_fact | authority-backed | high | internal-beta-only | Badge award is not NFT mint or ownership. |
| `/internal/points/badges/award` | Points | Layer 2 | partial_runtime | economic_fact | authority-backed | high | internal-beta-only | Internal award path exists; Quest to Badge activation remains forbidden. |
| Connect `NFTTab` | Connect | Layer 4 | future-only | future_placeholder | no_runtime_authority | high | future-only | Inert legacy NFT wallet UI, current badges are off-chain only. |
| Connect `G2ATab` | Connect | Layer 3 | future-only | future_placeholder | no_runtime_authority | critical | future-only | Inert G2A placeholder; must not be wired to routes. |
| Connect `BridgeModal` | Connect | Layer 3/4 | future-only | future_placeholder | no_runtime_authority | critical | future-only | Disabled external token UI; no amount/fee/address semantics active. |
| Connect mock views/data | Connect | Cross-layer | mock-only | local_mock_UI_only | mock-backed | high | blocked | Demo surfaces not exported publicly, still inventory-relevant. |
| Space dashboard stats | Space | Layer 1/3 | mock-only | local_mock_UI_only | mock-backed | high | dangerous-until-aligned | Includes Points and G2A-like stats from `mockDashboardStats`. |
| Space BalanceView | Space | Layer 1/3 | mock-only | local_mock_UI_only | mock-backed | high | dangerous-until-aligned | Shows Space Points, G2A future layer and transaction-like rows. |
| Space `mockTransactions` | Space | Layer 1/3 | mock-only | local_mock_UI_only | mock-backed | high | dangerous-until-aligned | Earn/spend/bonus/referral/quest/voucher rows can look runtime-backed. |
| Space `NFTView` | Space | Layer 2/4 | mock-only | local_mock_UI_only | mock-backed | high | dangerous-until-aligned | Uses mock `NFTBadge[]` data and NFT route/path. |
| Space `mockBadges` / `mockBadgesExtended` | Space | Layer 2/4 | mock-only | local_mock_UI_only | mock-backed | high | dangerous-until-aligned | Off-chain badge UI mixed with NFT type vocabulary. |
| Space QuestsView | Space | Layer 1 | mock-only | local_mock_UI_only | mock-backed | high | dangerous-until-aligned | Shows Points and participation history from mock quests. |
| Space VouchersView | Space / RF | Layer 1 | mock-only | local_mock_UI_only | mock-backed | medium-high | internal-beta-only | Voucher-like UI in Space context; needs RF authority framing. |
| Space ReferralsView | Space / Referral | Layer 1 | mock-only | read_projection | mock-backed | high | dangerous-until-aligned | Internal Points participation copy exists, but stats are local. |
| Space Activity pages/blocks | Space | Layer 1 | partial_runtime/projection | activity_fact | projection-backed | high | dangerous-until-aligned | Social activity is not economic audit trail. |
| Space weekly goals | Space | Layer 1 | mock-only | local_mock_UI_only | mock-backed | high | dangerous-until-aligned | Contains `pointsReward`; producer runtime not confirmed. |
| Quest detail rewards | Quest | Layer 1/2 | projection | read_projection | projection-backed | high | internal-beta-only | Shows Points and off-chain badge previews; completion is not grant. |
| Quest completion screen | Quest | Layer 1 | projection | activity_fact | projection-backed | high | dangerous-until-aligned | Must preserve `Quest_completion != reward_grant`. |
| Quest reward outbox | Quest | Layer 1 | production-shaped | delivery_intent | authority-backed for intent only | high | internal-beta-only | Outbox delivered is not receipt; Points row is economic fact. |
| Quest submissions/proofs | Quest | Cross-layer | production-shaped | activity_fact | authority-backed | high | internal-beta-only | Photo/geo/QR/text proof is quest evidence, not economic proof/receipt. |
| Quest `NFTBadgeDisplay` | Quest | Layer 2/4 | projection/local | read_projection | projection-backed/mock-backed | high | dangerous-until-aligned | Copy is safer, but type/component name remains NFT. |
| Quest local reward projections | Quest | Layer 1/2 | mock-only | local_mock_UI_only | mock-backed | high | dangerous-until-aligned | `PointsDisplay`, completed card local Points and badge metadata are non-authoritative. |
| Quest PRO reward fields | Quest PRO | Layer 1 | partial_runtime | docs_claim_only | projection-backed | medium-high | internal-beta-only | `rewardPoints` configuration is not user grant. |
| Quest leaderboard | Quest | Layer 1 | projection | read_projection | projection-backed/mock-backed | medium-high | internal-beta-only | Gamification status is not economic authority. |
| RF offer points cost | RF / Points | Layer 1 | partial_runtime | economic_fact/read_projection | authority-backed where backend writes exist | high | internal-beta-only | Internal utility cost, not price/payment/cashback. |
| RF voucher claim | RF | Layer 1 | production-shaped | activity_fact | authority-backed | high | MVP-ready with framing | Voucher claim creates utility lifecycle, not payout. |
| RF voucher redeem | RF | Layer 1 | production-shaped | activity_fact | authority-backed | high | internal-beta-only | Redeem is lifecycle transition, not payout/cashback. |
| RF voucher summary / My Vouchers | RF | Layer 1 | projection | read_projection | projection-backed | high | internal-beta-only | Counts/status/code display can overread as value-bearing wallet. |
| RF merchant voucher activity summary | RF | Layer 1 | projection | diagnostics/read_projection | projection-backed | high | internal-beta-only | Aggregate lifecycle/attribution counts, not settlement. |
| RF internal voucher diagnostics | RF | Cross-layer | production-shaped | diagnostics_only | authority-backed for diagnostics only | high | blocked | Support/QA diagnostics are not rollout evidence. |
| RF PRO attributed vouchers | RF / PRO | Layer 1 | projection | read_projection | projection-backed | high | internal-beta-only | Visibility surface intentionally omits rewards/commissions/payouts. |
| RF PRO rewards dashboard | RF / PRO | Layer 1/3 | partial_runtime/docs-only | read_projection/docs_claim_only | projection-backed | high | dangerous-until-aligned | Rewards wording can imply commission/passive income. |
| RF catalog/offers/voucher UI | RF | Layer 1 | partial_runtime | activity_fact/read_projection | projection-backed | medium-high | internal-beta-only | Offer benefit/discount language needs utility framing. |
| Rielt listing RF voucher offers | Rielt / RF | Layer 1 | partial_runtime | read_projection/activity_fact | projection-backed | medium-high | internal-beta-only | RF listing vouchers are mapped utility, not cashback. |
| Rielt reward / Tokenomics docs | Rielt | Layer 1/2/3/4 | docs-only | docs_claim_only | no_runtime_authority | high | dangerous-until-aligned | Mentions referral bonuses, Points/NFT and investment-like context. |
| Rielt listing contribution wording | Rielt | Layer 1 | partial_runtime/docs-only | docs_claim_only | no_runtime_authority | medium-high | internal-beta-only | `rielt_listing_created` is allowed Points action, but producer reality needs Stage 10.2. |
| Atlas reward/NFT docs wording | Atlas | Layer 1/2/4 | docs-only | docs_claim_only | no_runtime_authority | medium-high | future-only | Atlas is context provider, not reward authority. |
| Pulse rewards/NFT docs wording | Pulse | Layer 1/2/4 | docs-only | docs_claim_only | no_runtime_authority | high | dangerous-until-aligned | Docs mention event rewards and NFT badges beyond current runtime. |
| Blog contribution wording | Blog | Layer 1 | docs-only | docs_claim_only | no_runtime_authority | medium | future-only | Content module has indirect contribution value, not active producer. |
| Guru rewards/NFT docs wording | Guru | Layer 1/2/4 | docs-only | docs_claim_only | no_runtime_authority | medium-high | future-only | Discovery aggregation, not economy authority. |
| Home rewards list | Global Home | Layer 1/2 | mock-only | local_mock_UI_only | mock-backed | high | dangerous-until-aligned | Static `+50 Points`, badge, level items can look personalized/runtime. |
| Home benefits copy | Global Home | Layer 1/2 | docs/UI copy | docs_claim_only | no_runtime_authority | medium | internal-beta-only | Safer wording exists, but still broad ecosystem promise. |
| Notifications with badges/quest/activity | Space / Global | Layer 1/2 | mock-only/projection | local_mock_UI_only | mock-backed/projection-backed | high | dangerous-until-aligned | Notification-like economy facts can be read as runtime events. |
| Share / clipboard surfaces | Quest / Global | Cross-layer | UI capability | local_mock_UI_only/read_projection | no_runtime_authority | high | dangerous-until-aligned | Sharing badge metadata is not proof. |
| Screenshots / exported UI patterns | Global | Cross-layer | intentionally_absent | future_placeholder | no_runtime_authority | high | blocked | No confirmed proof/export/receipt runtime. |
| Token service `/ready` | Token Service | Layer 3 | future-only/skeleton | future_placeholder | no_runtime_authority | critical | blocked | `status: ready` is service readiness, not token runtime. |
| Tokenomics docs | Economy docs | Layer 3/4 | docs-only | docs_claim_only | no_runtime_authority | critical | future-only | Four-layer model confirmed, externalization not active. |
| On-chain NFT mint/export | Economy/docs/UI placeholders | Layer 4 | intentionally_absent | future_placeholder | no_runtime_authority | critical | blocked | Mint, bridge, marketplace and ownership runtime absent. |
| Bridge / external wallet / marketplace | Connect / docs | Layer 3/4 | intentionally_absent/future-only | future_placeholder | no_runtime_authority | critical | blocked | Explicitly outside Stage 10. |
| Receipt/export/support/dispute | Economy/docs/global | Cross-layer | intentionally_absent | future_placeholder | no_runtime_authority | critical | blocked | No confirmed receipt/export/dispute runtime. |

## 5. Layer-by-Layer Surface Map

### Layer 1 — Points

Production-shaped or partial runtime surfaces:

- Points balance and transaction rows.
- Internal add/spend endpoints.
- Wallet summary bucket projection.
- Connect dashboard read model.
- Quest reward outbox to Points.
- RF voucher Points cost/debit/compensation traces.
- Referral summary and selected referral bonus actions.

Projection/mock/docs surfaces:

- Connect wallet UI, dashboard, activity feed, analytics and referrals.
- Space balance, transactions, referrals, weekly goals and quest Points.
- Quest local Points displays and completion screens.
- Home static rewards list.
- Module docs for Atlas, Pulse, Blog, Guru and Rielt contribution/reward language.

Layer 1 verdict:

```text
layer_1_runtime_maturity: production_shaped_for_core_points
layer_1_surface_maturity: mixed
layer_1_collapse_risk: high
layer_1_mvp_readiness: partial_with_copy_and_producer_boundaries
```

### Layer 2 — Off-chain Badges / Progression

Production-shaped or partial runtime surfaces:

- `badges` catalog.
- `user_badges` awards.
- Points badge read endpoints.
- Internal badge award endpoint.
- Connect Levels and dashboard badge projections.

Projection/mock/future surfaces:

- Quest badge previews and `NFTBadgeDisplay`.
- Space `NFTView`, `mockBadges`, rarity and earned-date display.
- Home badge/level rewards list.
- Module docs mentioning achievements, totems, tablets, NFT-compatible collectible language.

Layer 2 verdict:

```text
layer_2_runtime_maturity: partial_badges_only
layer_2_progression_maturity: low_to_medium
layer_2_surface_maturity: mixed_high_risk
layer_2_mvp_readiness: partial_for_badges_not_for_NFT_language
```

### Layer 3 — G2A

Current surfaces:

- `apps/token-service/src/index.ts` exposes `/health`, `/version`, `/ready` only.
- Connect `G2ATab` exists as inert future layer.
- Connect `BridgeModal` exists as disabled external token notice.
- Space BalanceView contains a `G2A future layer` card.
- Tokenomics docs describe the future G2A layer.
- RF docs mention `G2A future-only` in PRO/dashboard contexts.

Layer 3 verdict:

```text
layer_3_runtime_maturity: absent_skeleton_only
layer_3_surface_maturity: future_only_but_visible
layer_3_collapse_risk: critical
layer_3_mvp_readiness: blocked
```

### Layer 4 — On-chain NFT

Current surfaces:

- Connect `NFTTab` exists as inert future-only legacy UI.
- Space route/path and component name use `NFT`, while rendered body says off-chain badges/future compatibility.
- Quest types/components retain `NFTBadge` naming while copy describes badge metadata.
- Tokenomics/economy docs describe on-chain NFT as future externalized artifact.

Absent surfaces:

- mint runtime;
- burn runtime;
- on-chain ownership verification;
- marketplace;
- external wallet connection;
- bridge;
- token/NFT domain API.

Layer 4 verdict:

```text
layer_4_runtime_maturity: absent
layer_4_surface_maturity: future_only_with_legacy_vocabulary
layer_4_collapse_risk: critical
layer_4_mvp_readiness: blocked
```

## 6. Projection vs Authority Map

| Surface cluster | Looks authoritative because | Actual authority | Classification |
|---|---|---|---|
| Connect Wallet | Route/name says wallet; shows totals, buckets and history | Points Service balance/transactions; UI is read projection | projection masquerading as wallet authority |
| Connect Dashboard | Combines balance, referrals, badges, RF and recent transactions | Points/referral/badge/RF owned facts; dashboard not SSOT | projection masquerading as receipt |
| Connect ActivityFeed | Shows recent transaction-like rows with amounts/dates | Points transactions are facts; feed is read UI, not audit trail | projection masquerading as audit trail |
| Points transaction row | Has amount, reason, source, date | Points Service ledger fact only | economic fact, not receipt |
| Quest completion | Completion UI and progress status | Quest owns progress/activity facts; Points owns grant fact | activity fact, not reward grant |
| Quest outbox `delivered` | Delivery status can sound final | Quest owns delivery attempt; Points row confirms economic fact | delivery intent, not receipt |
| RF voucher code/status | Code/status looks value-bearing | RF owns voucher lifecycle utility | lifecycle fact, not payout/cashback |
| RF PRO dashboards | Rewards/stats/pro attribution look like earnings | RF attribution/projection only | projection, not commission |
| Space balance/NFT/transactions | Pages look like wallet/collectibles/history | Mock/local data | mock masquerading as runtime |
| Home reward list | Personalized-looking rewards | Static local data | mock/copy, not runtime |
| Token service `/ready` | `ready` can sound domain-ready | Service health only | skeleton, not token authority |
| G2A/NFT/Bridge placeholders | Vocabulary is visible | No active runtime authority | future placeholder |
| Diagnostics endpoints | Deep lifecycle details | Support/QA diagnostic authority only | diagnostics, not rollout evidence |

Key rule:

```text
projection-backed != authority-backed
authority-backed_economic_fact != receipt
diagnostics_only != rollout_evidence
mock-backed != runtime_truth
future_placeholder != activation
```

## 7. Mock & Future-Only Surface Register

| Surface | Location | Type | Risk | Stage 10.1 classification |
|---|---|---|---|---|
| Space `mockDashboardStats` | `components/space/mockData.ts` | mock economy | Points/G2A balances look current | `mock-only`, `local_mock_UI_only`, high risk |
| Space BalanceView | `components/space/Balance/BalanceView.tsx` | mock balance/history | Space Points and future G2A in same surface | `mock-only`, dangerous until aligned |
| Space `mockTransactions` | `components/space/mockData.ts` | mock transaction history | Earn/spend/referral/quest/voucher rows look ledger-like | `mock-only`, high risk |
| Space `NFTView` | `components/space/NFT/NFTView.tsx` | mock badge/NFT route | Badge can be read as NFT ownership | `mock-only`, dangerous until aligned |
| Space `mockBadges` | `components/space/mockData.ts` | mock badge catalog | `NFTBadge[]` type and earned dates | `mock-only`, high risk |
| Space Quests/Vouchers/Goals | `components/space/*` | mock participation/reward | Points rewards and voucher utility look runtime-backed | `mock-only`, high risk |
| Connect mock views/data | `components/connect/*MockView.tsx`, `mockData.ts` | demo projection | Could be confused with current projection | `mock-only`, blocked for evidence |
| Home `userRewards` | `app/HomePageClient.tsx` | static local rewards | Looks like recent personalized economy activity | `mock-only`, dangerous until aligned |
| Quest local reward display | `components/quest/QuestRewards/*`, completed cards | local projection | Local Points/badge preview may overread as grant | `mock-only/projection`, dangerous until aligned |
| Connect `G2ATab` | `components/connect/Wallet/G2ATab.tsx` | future placeholder | Active token overread | `future-only`, critical |
| Connect `NFTTab` | `components/connect/Wallet/NFTTab.tsx` | future placeholder | NFT ownership overread | `future-only`, high |
| Connect `BridgeModal` | `components/connect/Wallet/BridgeModal.tsx` | future placeholder | Bridge/wallet activation overread | `future-only`, critical |
| Token service `/ready` | `apps/token-service/src/index.ts` | skeleton readiness | Token runtime false readiness | `future-only/skeleton`, critical |
| Tokenomics docs | `docs/economy/tokenomics/` | docs-only | G2A/on-chain overread | `docs-only`, future-only |
| Pulse rewards/NFT docs | `docs/modules/pulse/overview.md` | docs-only | Event rewards/NFT badges beyond runtime | `docs-only`, dangerous until aligned |
| Atlas/Guru Connect/Points/NFT references | `docs/modules/atlas/`, `docs/modules/guru/` | docs-only | Context modules look like reward authorities | `docs-only`, future-only |
| Rielt reward/tokenomics references | `docs/modules/rielt/overview.md` | docs-only | Listing/investment/reward vocabulary can overstate runtime | `docs-only`, dangerous until aligned |

## 8. Proof-Class Collapse Register

| ID | Collapse risk | Severity | Primary surfaces | Current assessment |
|---|---|---|---|---|
| PCR-10.1-01 | Wallet -> financial wallet | High | `/connect/wallet`, `WalletView`, `/v1/wallet/summary`, BalanceCards | Still dangerous until Connect 10.6 / copy 10.10. |
| PCR-10.1-02 | Points -> money | High | Points balances, Space Points, Home rewards, RF points cost | Points is internal only; UI sometimes uses balance/history metaphors. |
| PCR-10.1-03 | Dashboard -> receipt | High | Connect Dashboard, RF dashboards, merchant stats | Dashboard composes facts but is not receipt or statement. |
| PCR-10.1-04 | ActivityFeed -> audit trail | High | Connect ActivityFeed, Space Activity pages | Activity rows are recent projections, not audit trail. |
| PCR-10.1-05 | Transaction row -> receipt | Critical | Points transaction history, Space mock transactions | Points rows are economic facts only; no receipt runtime. |
| PCR-10.1-06 | Quest completion -> reward grant | High | Quest completion screen, completed card, PRO reward points | Completion is activity fact; grant needs Points economic fact. |
| PCR-10.1-07 | Quest outbox delivered -> guaranteed user credit | High | Quest reward outbox | Delivery intent is not receipt; downstream Points row is required. |
| PCR-10.1-08 | Badge -> NFT mint | High | Quest `NFTBadgeDisplay`, Space `NFTView`, Connect `NFTTab` | Badge runtime exists, NFT mint does not. |
| PCR-10.1-09 | RF -> cashback/payout | High | RF vouchers, redeem, spend, compensation, PRO rewards | RF is voucher utility/attribution, not money rail. |
| PCR-10.1-10 | PRO rewards -> commission/passive income | High | RF PRO dashboard, Rielt docs, Quest PRO fields | Must remain contribution/management/projection language. |
| PCR-10.1-11 | Screenshot/share/export -> proof | High | Quest share/clipboard, potential UI screenshots, Home/Connect cards | Share/presentation is not evidence or receipt. |
| PCR-10.1-12 | Diagnostics -> rollout evidence | High | RF diagnostics, Points spendability diagnostics | Diagnostics are support/QA only. |
| PCR-10.1-13 | G2A -> active token | Critical | `G2ATab`, `BridgeModal`, token-service `/ready`, tokenomics docs | Future-only; no domain routes or ledger. |
| PCR-10.1-14 | Mock -> runtime truth | High | Space mocks, Connect mocks, Home rewards | Requires quarantine/alignment before broad claims. |
| PCR-10.1-15 | Contract/docs -> activation | High | OpenAPI wallet tag, module docs, tokenomics docs | Contracts and docs do not activate runtime. |

## 9. MVP Surface Readiness Snapshot

### MVP-ready

Safe only with inherited guardrails:

- Points balance as internal Points.
- Points add/read actions for current bounded producers.
- Off-chain badge catalog read surface.
- RF public catalog and voucher claim as practical utility, not payout/cashback.
- Quest published quest/progress surfaces as participation/activity, not reward grant.

### Internal beta only

Useful, but needs stronger Stage 10 alignment before broad MVP economy claims:

- Points transactions/history.
- Wallet summary buckets.
- Connect dashboard.
- Connect referrals and analytics.
- Connect Levels/user badges.
- RF voucher summary/My Vouchers.
- RF merchant/pro read-only summaries.
- Quest reward outbox and completion projections.
- Rielt RF listing voucher surfaces.
- Space social activity as activity context.

### Future-only

Must not be treated as current MVP economy:

- G2A.
- Tokenomics externalization.
- On-chain NFT.
- NFT marketplace.
- Bridge.
- External wallet.
- Totem/tablet rich progression.
- Atlas/Pulse/Blog/Guru reward production unless separately runtime-backed.

### Blocked

Must not be used for current claims:

- Token service as token runtime.
- Bridge/external wallet/marketplace activation.
- Receipt/export/support/dispute proof claims.
- Payout/settlement/cashback.
- Slice 16 movement.
- Screenshots or diagnostics as proof/rollout evidence.

### Dangerous until aligned

Require Stage 10 alignment before MVP-facing economy claims:

- `/connect/wallet` and wallet summary naming/framing.
- Connect Dashboard and ActivityFeed.
- Space Balance/NFT/mock transactions/mock rewards.
- Quest `NFTBadge` vocabulary and local reward projections.
- RF PRO rewards/dashboard vocabulary.
- Rielt/Pulse docs reward/tokenomics mentions.
- Home static rewards list.

Approximate Stage 10.1 readiness distribution across inventory rows:

```text
mvp_ready_surface_percentage: 12_percent_approx
internal_beta_surface_percentage: 36_percent_approx
future_only_surface_percentage: 18_percent_approx
blocked_surface_percentage: 11_percent_approx
dangerous_until_aligned_surface_percentage: 23_percent_approx
```

The low MVP-ready percentage is expected. Stage 10.1 counts user-facing and docs/future/mock surfaces, not only backend authorities.

## 10. Recommended Follow-up Slices

### Stage 10.2 — Points Producer Reality Map

Priority surfaces:

- Points `ACTIONS_PHASE2`.
- Quest completion/outbox.
- RF voucher claim/redeem/spend/compensation.
- Referral actions.
- Space post/repost/reaction actions.
- Rielt listing-created action.
- Atlas/Pulse/Blog/Guru contribution claims.

Reason:

```text
allowed_action != active_producer
```

### Stage 10.3 — Space Asia Economy Embodiment

Priority surfaces:

- Space BalanceView.
- Space NFTView.
- Space `mockDashboardStats`, `mockTransactions`, `mockBadges`.
- Space quests/vouchers/referrals/weekly goals.

Required outcome:

- classify mock economy;
- define contribution model;
- quarantine fake balances and NFT vocabulary;
- no implementation in this report.

### Stage 10.4 — Quest Economy Embodiment

Priority surfaces:

- Quest completion screen.
- Quest reward outbox.
- Quest reward previews.
- `NFTBadgeDisplay`.
- Quest PRO reward fields.

Required outcome:

- preserve completion/outbox/grant separation;
- prepare Quest to Badge handoff model without activation;
- copy/proof-class alignment.

### Stage 10.5 — Off-chain Badge / Progression Layer

Priority surfaces:

- Points badges.
- Connect Levels.
- Quest badge previews.
- Space badges/NFT route.
- Home levels/badge rewards.

Required outcome:

- badge/progression model;
- remove NFT vocabulary from internal off-chain progression in later approved alignment work;
- no NFT mint or ownership semantics.

### Stage 10.6 — Connect Economy Hub Alignment

Priority surfaces:

- WalletView.
- Wallet summary.
- DashboardContent.
- BalanceCards.
- ActivityFeed.
- Referrals.
- Levels.
- RF projection section.

Required outcome:

- Connect remains projection hub, not authority;
- Wallet/Dashboard/ActivityFeed proof-class guardrails;
- no UI change in Stage 10.1.

### Stage 10.7 — RF / Voucher / PRO Economy Vocabulary Alignment

Recommended reserved slice based on inventory risk.

Priority surfaces:

- RF voucher claim/redeem/spend.
- My Vouchers.
- Merchant voucher activity summary.
- PRO attributed vouchers.
- RF PRO rewards dashboard.
- Rielt listing RF vouchers.

Required outcome:

- RF utility/cost/attribution language;
- cashback/payout/commission guardrails;
- support/diagnostics boundary.

### Stage 10.8 — Rielt / Atlas / Pulse / Blog / Guru Docs Economy Reading Guards

Recommended reserved slice based on docs-over-runtime drift.

Priority surfaces:

- Rielt referral/reward/tokenomics mentions.
- Pulse event rewards/NFT badges.
- Atlas Connect/Points/NFT references.
- Guru Connect/Points/NFT references.
- Blog contribution language.

Required outcome:

- future-only markers;
- module-by-module contribution wording;
- no runtime activation.

### Stage 10.10 — UX Copy & Proof-Class Alignment

Priority collapse pairs:

- Wallet != financial wallet.
- Dashboard != receipt.
- ActivityFeed != audit trail.
- NFT != badge.
- Points != money.
- RF != cashback.
- screenshot != proof.
- mock != runtime truth.

### Stage 10.11 — MVP Economy Cutline

Use this inventory to split:

- MVP-ready;
- internal beta only;
- future-only;
- blocked;
- dangerous until aligned.

### Stage 10.12 — Implementation Readiness Plan

Allowed later output:

- backend tasks;
- frontend tasks;
- OpenAPI tasks;
- DB/schema tasks;
- tests tasks;
- anti-abuse tasks;
- rollout blockers.

Stage 10.12 must still not activate Stage 11, Stage 12 or Slice 16.

## 11. Inherited Guardrails

These guardrails apply to every surface in this inventory:

```text
token != money
NFT != receipt
badge != NFT_mint
Points != payout_system
Wallet != financial_wallet
RF != cashback_system
RF_redeem != payout
Quest_completion != reward_grant
Dashboard != receipt
ActivityFeed != audit_trail
screenshot != proof
diagnostics != rollout_evidence
contract != activation
stable_enough != launch_ready
slice_16_status = blocked_not_triggered
```

Stage 10.1-specific guardrails:

```text
inventory != cleanup
classification != rename_pass
surface_exists != surface_is_safe
projection != authority
mock != runtime_truth
future_placeholder != activation
token_service_ready != token_runtime
OpenAPI_tag_wallet != financial_wallet
Quest_outbox_delivered != Points_grant_receipt
RF_voucher_lifecycle != payout_rail
```

## 12. Final Verdict

```text
stage_10_1_status: completed_as_docs_first_inventory
economy_surface_inventory_complete: true
inventory_scope: repo_visible_docs_openapi_schema_service_and_pwa_surfaces
projection_surface_count: 18
mock_surface_count: 10
future_only_surface_count: 9
authority_surface_count: 12
diagnostics_surface_count: 2
docs_only_surface_count: 8
proof_class_collapse_risk: high
largest_embodiment_gap: Space_mock_economy_plus_Connect_projection_language
most_dangerous_surface: token_service_ready_plus_G2A_NFT_bridge_placeholders
most_user_visible_risk_cluster: Connect_Wallet_Dashboard_ActivityFeed
most_mock_heavy_cluster: Space_Balance_NFT_Transactions_Quests_Vouchers
most_docs_over_runtime_cluster: Rielt_Pulse_Atlas_Guru_reward_NFT_tokenomics_mentions
mvp_ready_surface_percentage: 12_percent_approx
internal_beta_surface_percentage: 36_percent_approx
future_only_surface_percentage: 18_percent_approx
blocked_surface_percentage: 11_percent_approx
dangerous_until_aligned_surface_percentage: 23_percent_approx
stage_11_readiness: false
stage_12_readiness: false
recommended_next_slice: Stage_10_2_Points_Producer_Reality_Map
recommended_reserved_slice_10_7: RF_Voucher_PRO_Economy_Vocabulary_Alignment
recommended_reserved_slice_10_8: Rielt_Atlas_Pulse_Blog_Guru_Docs_Economy_Reading_Guards
token_nft_g2a_onchain_activation: forbidden
wallet_bridge_marketplace_activation: forbidden
payout_settlement_cashback_activation: forbidden
points_enforcement_activation: forbidden
quest_to_badge_activation: forbidden
slice_16_status: blocked_not_triggered
```

Stage 10.1 confirms that Go2Asia has a real but uneven internal off-chain economy surface. The next safe step is not externalization and not cleanup by intuition. The next safe step is Stage 10.2 Points Producer Reality Map, followed by module-specific embodiment alignment for Space, Quest, badges, Connect and RF.
