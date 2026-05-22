# Stage 12.x.2 — Legacy Route / Type Vocabulary Cleanup Plan

Документ: `stage_12_x_2_legacy_route_type_vocabulary_cleanup_plan_v1.md`  
Статус: docs-first legacy route/type vocabulary cleanup plan  
Дата: 2026-05-22  
Scope: legacy route names, TypeScript type/component/file vocabulary, user-visible route/copy residue, Path B terminology residue after Stage 12  
Mode: read-only audit + planning/canon document; no runtime, route, component, type, API, OpenAPI, SDK, schema, migration, feature flag or frontend implementation changes

## 0. Orchestration Summary

Task type: vocabulary / product-reality / compatibility audit.

Risk level: `MEDIUM`.

Reason:

- route/type names can still communicate financial wallet, NFT/token ownership, reward grant, proof/receipt, booking/payment, payout/cashback or launch readiness;
- actual cleanup may have high blast radius across routes, imports, tests and docs;
- this slice is plan-only and does not rename code or public contracts.

Capsules used:

| Capsule | Role in this slice |
|---|---|
| `docs/ai/context/core/capsule.md` | Path A/Path B firewall, no-public-launch doctrine |
| `docs/ai/context/ui/capsule.md` | UI proof-class, projection and vocabulary boundaries |
| `docs/ai/context/stage_12_product_reality/capsule.md` | Stage 12 residue and follow-up routing |
| `docs/ai/context/routing_rules.md` | Prompt composition and anti-overload rules |

Required agents / review modes used:

| Gate | Result |
|---|---|
| Product Reality Review | Legacy vocabulary mapped to product-reality risks |
| Frontend Review | Route/component/type blast radius inventoried |
| Runtime Governance Review | UI-only rename, route redirect and API/SDK freeze boundaries separated |
| Economy Review | Points/G2A/NFT/reward/spendability naming risks classified |
| Security / Fraud & Abuse Review | proof/mock-as-proof, route-as-proof and Path B leakage risks classified |
| QA Review | Future grep/test guardrails proposed |
| Canon Review | This plan positioned below Stage 11.9 and Stage 12 SSOT |

Allowed write scope:

```text
docs/architecture/domain/stage_12_x_2_legacy_route_type_vocabulary_cleanup_plan_v1.md
```

No code changes were made.

## 1. Purpose

Stage 12 accepted the first bounded UI/copy/mock alignment pass, but it intentionally left legacy route/type vocabulary for a follow-up slice.

This document creates the safe cleanup plan for that follow-up.

```text
Stage_12 = successful_first_alignment_pass
Stage_12 != fully_clean_UI_layer
Stage_12.x.2 = plan_for_legacy_route_and_type_debt
Stage_12.x.2 != implementation_rename
Stage_12.x.2 != public_launch_ready
```

The goal is to identify which names are harmless technical debt, which names still create product-reality risk, which can be renamed safely, which need redirects or compatibility aliases, and which must remain frozen until API/runtime/SDK cleanup.

## 2. SSOT Positioning

This plan is a planning SSOT for legacy route/type cleanup sequencing only.

It does not replace:

- Stage 11.9 closure review;
- Stage 12 UI/copy/mock alignment canon;
- AI context capsules;
- API/OpenAPI/SDK contracts;
- runtime owner facts.

Hierarchy:

```text
Stage 11.9 governance boundaries
  > Stage 12 UI/copy/mock alignment
  > Stage 12.x.2 cleanup plan for route/type debt
  > future implementation PRs
```

If this plan conflicts with Stage 11.9 or Stage 12, the upstream SSOT wins.

## 3. Doctrine Carried Forward

Canonical boundaries preserved:

```text
Wallet != financial_wallet
Dashboard != receipt
ActivityFeed != audit_trail
projection != authority
mock_data != proof
screenshot != proof
badge != NFT
badge != token
badge != reward_receipt
Points_row = economic_fact
user_badges_row = badge_award_fact
RF_voucher = lifecycle_fact_only
Rielt_inquiry = inquiry_fact_only
Path_B = excluded_by_default
Stage_12 != public_launch_ready
```

Stage 12.x.2 must not turn cleaner names into claims of public launch, production rollout, active Path B, spendability, payout, cashback, booking, payment or proof readiness.

## 4. Scope

In scope:

- inventory of legacy route names;
- inventory of TypeScript type/component/file names;
- user-facing copy and metadata residue directly tied to legacy names;
- blast-radius notes;
- future cleanup slice strategy;
- naming recommendation matrix;
- future QA/grep guardrails.

Out of scope:

- runtime changes;
- route renames;
- component renames;
- type renames;
- API path renames;
- OpenAPI changes;
- SDK regeneration;
- schema or migration changes;
- feature flag wiring;
- Path B activation;
- token/NFT/G2A/bridge implementation;
- new Points producers;
- new reward or spendability rules;
- cashback, payout, payment or booking semantics;
- mass refactor;
- deleting legacy files;
- public launch readiness claims.

## 5. Search / Inspection Method

Targeted search only; no unbounded repo reading.

Searches performed:

```text
rg "(/connect/wallet|/space/nft|/space/balance|/v1/wallet/summary)" apps/go2asia-pwa-shell --glob "*.{ts,tsx}"
rg "\b(NFTBadge|NFTBadgeRarity|NFTBadgeCategory|WalletData|NFTWalletData|Reward|RewardsView|G2ATab|NFTTab|PointsTab|BridgeModal|BalanceView|WalletView|TransactionList|ActivityFeed|BalanceCards|UserSummary|nfts|nftBadges|earned_rewards)\b" apps/go2asia-pwa-shell --glob "*.{ts,tsx}"
rg "\b(wallet|balance|NFT|G2A|bridge|token|reward|rewards|earn|earned|proof|receipt|booking|payment|cashback|payout|claim|redeem|launch|production)\b" apps/go2asia-pwa-shell --glob "*.{ts,tsx}" --count
rg "\b(nfts|NFT|wallet|Wallet|balance|Reward|reward|G2A|bridge)\b" packages/ui --glob "*.{ts,tsx,md}"
rg "\b(nfts|NFT|wallet|Wallet|balance|Reward|reward|G2A|bridge)\b" frontend-shell/packages/design-system --glob "*.{ts,tsx,md}"
rg "\b(nfts|NFT|wallet|Wallet|balance|Reward|reward|G2A|bridge)\b" design-system/ui-components --glob "*.{ts,tsx,md}"
rg "(/connect/wallet|/space/balance|/space/nft)" . --glob "*.{md,mdx,ts,tsx,json}"
```

Key files inspected:

- `apps/go2asia-pwa-shell/app/(authenticated)/connect/wallet/page.tsx`
- `apps/go2asia-pwa-shell/app/(public)/space/balance/page.tsx`
- `apps/go2asia-pwa-shell/app/(public)/space/nft/page.tsx`
- `apps/go2asia-pwa-shell/app/(public)/quest/[id]/complete/RewardsView.tsx`
- `apps/go2asia-pwa-shell/components/connect/Wallet/WalletView.tsx`
- `apps/go2asia-pwa-shell/components/connect/types.ts`
- `apps/go2asia-pwa-shell/components/quest/types.ts`
- `apps/go2asia-pwa-shell/components/space/types.ts`
- `apps/go2asia-pwa-shell/components/space/Dashboard/AssetsBlock.tsx`
- `apps/go2asia-pwa-shell/middleware.ts`
- `packages/ui`
- `frontend-shell/packages/design-system`
- `design-system/ui-components`

## 6. Legacy Route Inventory

| ID | Route / path | Current location | User-facing | Active | Classification | Strategy |
|---|---|---|---|---|---|---|
| R-01 | `/connect/wallet` | `app/(authenticated)/connect/wallet/page.tsx` | Yes, authenticated | Active | `ROUTE_REQUIRES_ALIAS_OR_REDIRECT_PLAN` | Plan canonical `/connect/activity` or `/connect/points-history`; keep legacy redirect/alias window |
| R-02 | `/v1/wallet/summary` | called from `WalletView.tsx`, `BalanceCards.tsx` | No direct UI, but runtime projection | Active | `BLOCKED_UNTIL_API_OR_SDK_CLEANUP` | Do not rename in Stage 12.x UI slice; document API/runtime freeze |
| R-03 | `/space/balance` | `app/(public)/space/balance/page.tsx`, linked from `AssetsBlock.tsx` | Yes | Reachable stub | `ROUTE_REQUIRES_ALIAS_OR_REDIRECT_PLAN` | Plan canonical `/space/activity` or `/space/activity-summary`; update middleware and links in future slice |
| R-04 | `/space/nft` | `app/(public)/space/nft/page.tsx` | Direct URL | Dormant stub | `PATH_B_RESIDUE_DEFERRED` | Plan redirect to `/space/badges` or `/space/badges-deferred` |
| R-05 | route docs references | docs under `docs/`, `frontend-shell/docs/ui` | Docs only | N/A | `KEEP_WITH_LEGACY_WARNING` | Update only after route strategy is approved |

Confirmed inbound references:

- `/connect/wallet`: `ConnectNav`, `BalanceCards`, `ActivityFeed`, `AnalyticsView`, Quest `RewardsView`;
- `/space/balance`: three links in `AssetsBlock`, plus protected matcher in `middleware.ts`;
- `/space/nft`: no active TSX links found in targeted search; route exists as deferred stub;
- `/v1/wallet/summary`: `WalletView`, `BalanceCards`.

## 7. Type / Component / File Vocabulary Inventory

| ID | Legacy name | Current location | User-facing | Active | Classification | Strategy |
|---|---|---|---|---|---|---|
| T-01 | `NFTBadge` | `components/connect/types.ts`, `components/quest/types.ts`, `components/space/types.ts` | Indirect via quest/badge UI | Active in Quest types, mocks and utils | `TYPE_RENAME_HIGH_BLAST_RADIUS` | Future alias-first rename to `OffChainBadge` / `BadgeMetadata` |
| T-02 | `NFTBadgeRarity`, `NFTBadgeCategory` | `components/quest/types.ts` | Internal | Active with Quest badge previews | `TYPE_RENAME_HIGH_BLAST_RADIUS` | Rename with `OffChainBadgeRarity` / `BadgeCategory` only after alias plan |
| T-03 | `nftBadges` | Quest rewards fields | Indirect | Active in Quest cards/details | `TYPE_RENAME_HIGH_BLAST_RADIUS` | Rename to `badgePreviews` or `offchainBadges` in separate Quest-safe slice |
| T-04 | `WalletData` | `components/connect/types.ts`, `PointsTab`, `G2ATab`, mock data | Internal | Mostly dormant/mock | `TYPE_RENAME_SAFE` | Rename to `PointsActivityData` / `ConnectActivityData` after confirming import graph |
| T-05 | `NFTWalletData` | `components/connect/types.ts`, mock data | Internal | Mock/dormant | `TYPE_RENAME_SAFE` | Rename to `BadgeCollectionPreviewData` or quarantine as legacy |
| T-06 | `Reward` | `components/connect/types.ts`, `RewardsList.tsx` | Internal, but semantically risky | Active in connect/landing types | `TYPE_RENAME_HIGH_BLAST_RADIUS` | Split by context: `ParticipationPreview`, `PointsPreview`, `ActivityListItem` |
| T-07 | `earned_rewards` | connect referrals types/views | Indirect | Active referrals UI | `BLOCKED_UNTIL_API_OR_SDK_CLEANUP` if API-shaped; otherwise UI mapping rename | Keep field with UI-safe labels until API shape decision |
| T-08 | `WalletView` | `components/connect/Wallet/WalletView.tsx` | Yes via route | Active | `COMPONENT_RENAME_HIGH_BLAST_RADIUS` | Future rename to `ConnectActivityView` after route strategy |
| T-09 | `TransactionList` | `components/connect/Wallet/TransactionList.tsx` | Yes | Active | `COMPONENT_RENAME_SAFE` | Rename to `PointsTransactionList` in UI-only slice |
| T-10 | `ActivityFeed` | `components/connect/Dashboard/ActivityFeed.tsx` | Yes | Active | `KEEP_WITH_LEGACY_WARNING` or safe rename | Keep if framed as preview; avoid audit-trail semantics |
| T-11 | `BalanceCards` | `components/connect/Dashboard/BalanceCards.tsx` | Yes | Active | `COMPONENT_RENAME_SAFE` | Rename to `PointsSummaryCards` after route/link constants |
| T-12 | `PointsTab` | `components/connect/Wallet/PointsTab.tsx` | No found active route | Dormant/exported | `COMPONENT_RENAME_SAFE` | Rename or remove from barrel in future implementation |
| T-13 | `G2ATab`, `NFTTab`, `BridgeModal` | `components/connect/Wallet/*` | Not wired in active `WalletView` | Dormant | `PATH_B_RESIDUE_DEFERRED` | Quarantine/delete/move to `_legacy` in separate slice |
| T-14 | `BalanceView`, `NFTView` | `components/space/Balance`, `components/space/NFT` | Not used by current pages | Dormant/mock | `PATH_B_RESIDUE_DEFERRED` | Rename/quarantine and stop public barrel export if not needed |
| T-15 | `NFTBadgeDisplay` | `components/quest/QuestRewards` | Dormant/static test reference | Dormant | `TYPE_RENAME_SAFE` | Rename to `OffChainBadgeDisplay` or delete if unused |
| T-16 | `UserSummary.nfts` | shared UI packages | No active match in `packages/ui`; README examples remain in design-system docs | Mostly fixed | `SAFE_INTERNAL_TECHNICAL_DEBT` in docs | Update design-system READMEs in docs-only cleanup or future UI docs slice |

## 8. Copy / Metadata Vocabulary Inventory

| Surface | Legacy term | Current state | Risk | Strategy |
|---|---|---|---|---|
| Quest complete `RewardsView` | `Connect / Wallet` link label | User-facing | Medium | Relabel to `Connect / Активность` in Slice A |
| Connect `WalletView` | internal `WalletSummary`, query key `wallet` | Internal/runtime-coupled | Medium | Keep until API/SDK slice; UI copy already safe |
| Space `balance` route metadata | `wallet/payment/proof/receipt/token-wallet` appears only in negation | User-facing negation | Low | Safe until redirect plan |
| Space `nft` route metadata | `NFT/on-chain` appears only in negation | User-facing negation | Low | Safe until redirect plan |
| Connect referrals | `earned_rewards`, `earned_g2a` fields | Internal, active mapping | Medium | UI labels must remain backend-confirmed, not automatic earn |
| RF lifecycle | `claim/redeem` | Domain lifecycle | Low | Keep; allowlist only for RF voucher lifecycle |
| Rielt | `booking/payment` negations and legacy `verifiedBooking` type risk | Inquiry-only copy | Medium | Keep copy negations; inventory `verifiedBooking` in mock quarantine / type cleanup |
| Shared UI README examples | `nfts` in design-system docs | Docs only | Low | Docs-only follow-up possible; not product runtime |

## 9. Classification Rules

Use these classes for future implementation tickets:

| Class | Meaning |
|---|---|
| `SAFE_INTERNAL_TECHNICAL_DEBT` | Internal name, no active product claim, can be queued behind higher-risk work |
| `USER_FACING_REQUIRES_COPY_RELABEL` | Visible label/copy should be changed without route/type rename |
| `ROUTE_REQUIRES_ALIAS_OR_REDIRECT_PLAN` | Public URL should get canonical replacement and redirect/compatibility window |
| `TYPE_RENAME_SAFE` | Local or mock-heavy type can be renamed with low import risk |
| `TYPE_RENAME_HIGH_BLAST_RADIUS` | Cross-module or active type requires alias-first phased plan |
| `COMPONENT_RENAME_SAFE` | Local component rename with low import risk |
| `COMPONENT_RENAME_HIGH_BLAST_RADIUS` | Route/component folder rename affects many imports or route wrappers |
| `PATH_B_RESIDUE_DEFERRED` | Keep blocked/deferred/quarantined until owner-approved Path B stage |
| `BLOCKED_UNTIL_API_OR_SDK_CLEANUP` | Cannot rename without OpenAPI/SDK/runtime contract slice |
| `BLOCKED_UNTIL_RUNTIME_CONTRACT` | Needs owner fact/projection metadata/runtime contract before UI can claim more |
| `KEEP_WITH_LEGACY_WARNING` | Keep temporarily with explicit legacy/deferred warning |

## 10. Blast Radius Summary

| Item | Import/link count observed | Tests/docs affected | API/SDK coupling | Compatibility impact |
|---|---:|---|---|---|
| `/connect/wallet` route | 5 TSX internal links plus route wrapper | many docs references; likely nav/e2e tests | indirect `/v1/wallet/summary` coupling | needs redirect or alias; high deep-link risk |
| `/space/balance` route | 3 links in `AssetsBlock`, 1 middleware matcher | space docs references | none found | needs redirect plus middleware update |
| `/space/nft` route | no active TSX links found; docs references | space docs references | none found | lowest route migration risk; still Path B URL |
| `/v1/wallet/summary` | 2 direct callers | OpenAPI/SDK/docs outside this slice | yes | blocked until API/SDK cleanup |
| `NFTBadge` family | connect, quest, space types; quest mocks/utils/cards | `localRewardScreenIsolation.test.ts` and Quest UI tests | no direct API coupling found in PWA audit | alias-first rename recommended |
| `Reward` | connect types, landing list, Quest/RF component names | multiple UI contexts | possible API-shaped fields in future | split by context, avoid one global rename |
| `WalletView` / `components/connect/Wallet` | active route wrapper and barrel | route tests, docs | uses SDK balance/transactions and wallet summary | route rename and component rename should be separate or carefully phased |
| dormant Path B tabs/modal | definitions and limited exports only | likely no active tests | none | safe quarantine/delete only after grep confirmation |
| Space `Balance`/`NFT` folders | barrel exports and own index files | space docs | none | remove from public barrel or rename in separate slice |
| `UserSummary.nfts` | no active code hits; design-system README hits | docs only | none | docs-only cleanup possible |

## 11. Naming Recommendation Matrix

| Legacy name | Current location | Risk | Recommended replacement | Strategy | Slice | Notes |
|---|---|---|---|---|---|---|
| Wallet | `/connect/wallet`, `WalletView`, `WalletData` | High if user-facing | Activity / Points Activity / Internal Points History | route redirect + component/type rename | B/C | API `wallet` frozen |
| Balance | `/space/balance`, `BalanceCards`, `BalanceView` | Medium | Points Summary / Internal Points State / Activity Summary | route redirect + component rename | B/C | `user_balances` owner fact remains |
| NFTBadge | Quest/connect/space types | Medium/High | OffChainBadge / BadgeMetadata | alias-first type rename | C | Keep legacy alias temporarily |
| NFT | `/space/nft`, `NFTTab`, `NFTView` | High Path B | Off-chain badge / deferred Path B NFT | redirect/quarantine | B/D | No active ownership claim |
| G2A | `G2ATab`, fields/mocks | High Path B | deferred token layer / Path B deferred | quarantine | D | Not active Path A |
| BridgeModal | Connect dormant component | Critical if wired | Deferred transfer layer notice or remove | quarantine/delete | D | Must not become CTA |
| Reward | connect/landing/RF/Quest names | Medium | Preview / Candidate / PointsPreview / BadgeAward | context-specific rename | C | Avoid automatic grant semantics |
| Earn / earned | referral fields | Medium | backend-confirmed Points / confirmed activity summary | UI mapping / future API field plan | A/C | avoid earn-as-guarantee |
| Claim/Redeem | RF lifecycle | Low if RF-only | keep RF lifecycle | allowlist | E | Do not generalize outside RF |
| Booking | Rielt legacy/demo | High if proof | Inquiry / availability request | type/copy guard | A/E | Rielt inquiry only |
| Payment | Rielt/RF negations | High if active | payment not handled by Go2Asia | keep negation only | A/E | no payment flow |
| Proof/Receipt | UI disclaimers | High if positive claim | owner fact / backend-confirmed row / not proof | future proof-class slice | A/E | Stage 12.x.4 owns metadata |
| Launch/Production | docs/test language | Critical if product claim | internal smoke / governance status | grep guard | E | no public readiness inference |

## 12. Cleanup Strategy

### Slice A — UI copy / metadata relabel only

Goal: remove remaining visible legacy labels without renaming files/routes/types.

Candidate changes for future implementation:

- Quest complete `RewardsView`: `Connect / Wallet` -> `Connect / Активность`;
- any visible `wallet` label in active Connect UI -> `Активность` / `История Points`;
- keep RF `claim/redeem` lifecycle language unchanged;
- keep negative disclaimers for `proof`, `receipt`, `NFT`, `payment`, `wallet`.

Acceptance:

- no runtime/API/schema/SDK changes;
- visible Path A UI does not use `wallet`, `NFT`, `G2A`, `bridge`, `reward`, `earn`, `proof`, `receipt` as positive active product claims.

### Slice B — Public route alias / redirect plan

Goal: introduce canonical route names only with redirects/aliases.

Candidate mapping:

```text
/connect/wallet  -> /connect/activity
/space/balance   -> /space/activity or /space/activity-summary
/space/nft       -> /space/badges or /space/badges-deferred
```

Required implementation plan:

- create canonical route;
- keep legacy route redirect or alias window;
- update internal links;
- update `middleware.ts` for canonical and legacy during transition;
- update docs only after redirects exist;
- do not rename `/v1/wallet/summary`.

### Slice C — Type / component rename plan

Goal: rename internal vocabulary in bounded groups.

Candidate mapping:

```text
NFTBadge -> OffChainBadge
nftBadges -> badgePreviews
WalletData -> PointsActivityData
NFTWalletData -> BadgeCollectionPreviewData
WalletView -> ConnectActivityView
TransactionList -> PointsTransactionList
BalanceCards -> PointsSummaryCards
Reward -> ParticipationPreview / PointsPreview / ActivityListItem by context
```

Use alias-first strategy for high-blast-radius types.

### Slice D — Path B quarantine plan

Goal: prevent dormant Path B components from becoming active UI.

Candidates:

- `G2ATab`;
- `NFTTab`;
- `BridgeModal`;
- `NFTView`;
- `BalanceView` if mock-heavy;
- `Currency = 'g2a'` mock fields;
- `mockNFTBadges`, `mockNFTWalletData`.

Allowed future actions:

- add legacy/deprecated warnings;
- move to `_legacy` or dev-only location;
- remove from public barrels;
- delete only in an implementation slice after import graph confirmation.

### Slice E — Tests / grep / guardrails

Goal: add guardrails before large renames.

Recommended checks:

- forbidden active UI vocabulary grep;
- route alias tests;
- public barrel mock export regression;
- `UserSummary` `badges` regression;
- RF `claim/redeem` allowlist;
- Quest `proof` operational allowlist;
- no OpenAPI/SDK generated rename in Stage 12.x UI slices.

QA recommended this as the first implementation slice before route/type rename work.

## 13. Blocked / Frozen Items

Do not rename in Stage 12.x implementation prompts:

- `/v1/wallet/summary`;
- OpenAPI wallet tag / operation IDs;
- generated SDK types;
- `GET /v1/points/balance`;
- owner fact names such as `points_transactions`, `user_balances`, `user_badges`;
- RF claim/redeem runtime lifecycle;
- Quest proof payload fields unrelated to customer proof;
- schema, migrations, gateway handlers or service code.

These require separate runtime/API/SDK cleanup slices with Runtime Governance, Economy, Security, QA and Canon review.

## 14. Future Implementation Acceptance Criteria

Future implementation slices must prove:

```text
no_runtime_changes_without_explicit_slice: true
no_api_openapi_sdk_changes_in_ui_slice: true
legacy_routes_have_redirect_or_alias_plan: true
active_ui_copy_uses_mvp_safe_vocabulary: true
path_b_surfaces_remain_deferred_or_quarantined: true
mock_demo_not_used_as_proof: true
projection_not_authority: true
rf_claim_redeem_allowlisted_only_for_rf_lifecycle: true
tests_or_grep_guardrails_updated: true
public_launch_claims: false
```

Recommended validation per implementation slice:

- targeted `rg` for affected vocabulary;
- `pnpm -C apps/go2asia-pwa-shell test`;
- `pnpm -C apps/go2asia-pwa-shell typecheck` after Next 15 blocker slice is fixed, or note blocker if still present;
- route alias tests if routes change;
- import graph grep for renamed symbols.

## 15. Remaining Risks

| Risk | Severity | Owner slice |
|---|---|---|
| `/connect/wallet` remains a live URL with UI-safe labels but legacy path | Medium | Slice B |
| `/space/balance` is reachable from Space dashboard | Medium | Slice B |
| `/space/nft` remains direct Path B route | Medium | Slice B |
| `NFTBadge` spans Quest/connect/space types and active Quest previews | Medium/High | Slice C |
| `Reward` appears in multiple contexts with different meanings | Medium | Slice C |
| dormant Path B components can be accidentally wired later | High | Slice D/E |
| OpenAPI/SDK `wallet` contract remains legacy | Medium | separate API/SDK slice, not 12.x.2 |
| design-system README examples still mention `nfts` | Low | docs-only UI docs cleanup |
| Next 15 typecheck blocker can mask rename regressions | Medium | Stage 12.x.5 |
| cleaner routes/types could be misread as public readiness | Critical | Canon/QA guardrails |

## 16. Review Gate Results

| Review gate | Result |
|---|---|
| Product Reality Review | Approved as plan-only; cleanup targets reduce semantic drift |
| Frontend Review | Route/type/component inventory and blast radius documented |
| Runtime Governance Review | API/SDK/runtime renames blocked; redirects required for public routes |
| Economy Review | No new economy semantics; Path B residue remains deferred |
| Security / Fraud & Abuse Review | Proof/mock/Path B risks classified; guardrails required before implementation |
| QA Review | Future grep/tests proposed; implementation not validated yet |
| Canon Review | Plan aligned with Stage 11.9 and Stage 12; no SSOT replacement |

## 17. Final Verdict

```text
stage_12_x_2_status: READY_AS_READ_ONLY_CLEANUP_PLAN
task_type: vocabulary_product_reality_compatibility_audit
risk_level: MEDIUM
runtime_changes: false
route_renames: false
component_renames: false
type_renames: false
api_openapi_changes: false
sdk_regeneration: false
schema_migration_changes: false
feature_flag_wiring: false
frontend_cleanup_implementation: false
Path_B_activation: false
economy_expansion: false
public_launch_claims: false
canon_status: aligned
```

Recommended next implementation slice:

```text
Stage 12.x.2-E — tests / grep / vocabulary guardrails
```

Reason: guardrails should exist before route aliases and type/component renames, so future cleanup cannot accidentally reintroduce Path B, wallet, proof, reward or launch drift.
