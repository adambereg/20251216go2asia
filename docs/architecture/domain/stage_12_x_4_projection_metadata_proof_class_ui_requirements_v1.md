# Stage 12.x.4 — Projection Metadata / Proof-Class UI Requirements

Документ: `stage_12_x_4_projection_metadata_proof_class_ui_requirements_v1.md`  
Статус: docs-first projection metadata and proof-class UI requirements  
Дата: 2026-05-22  
Scope: UI surfaces that display projections, summaries, dashboards, activity feeds, mock/demo/seed data, local-only states, diagnostics or owner-backed facts  
Mode: docs-first contract; no runtime, frontend implementation, route change, feature flag wiring, schema, API, OpenAPI or SDK changes

## 0. Orchestration Summary

Task type: projection / proof-class UI contract.

Risk level: `HIGH`.

Reason:

- UI projections can be misread as proof, receipt, account statement, audit trail or support-safe evidence.
- Missing metadata (`asOf`, `sourceOwner`, `proofClass`, owner references) can encourage Cursor or future UI work to invent freshness/source claims.
- Mock/demo/seed data can become more dangerous when replaced by cleaner-looking but still non-owner-backed numbers.
- RF, Quest, Connect, Home, Rielt, Space and Admin surfaces touch proof, reward, wallet, voucher, inquiry, seed and diagnostic boundaries.

Capsules used:

| Capsule | Role in this slice |
|---|---|
| `docs/ai/context/core/capsule.md` | Path A / Path B firewall, owner fact, no-public-launch doctrine |
| `docs/ai/context/ui/capsule.md` | UI proof-class, projection, dashboard and mock quarantine rules |
| `docs/ai/context/security/capsule.md` | proof, screenshot, mock-as-proof and support-proof boundaries |
| `docs/ai/context/staging/capsule.md` | smoke/evidence boundaries and mock/screenshot exclusions |
| `docs/ai/context/stage_12_product_reality/capsule.md` | Stage 12 residues and follow-up routing |
| `docs/ai/context/routing_rules.md` | context composition and anti-overload rules |

Required agents / review gates used:

| Gate | Result |
|---|---|
| Runtime Governance Review | Owner fact, projection, diagnostic and metadata boundaries defined |
| Runtime Validation Review | Smoke/evidence treatment and excluded UI surfaces defined |
| Product Reality Review | UI surface classes and safe user-facing posture defined |
| Security / Fraud & Abuse Review | stale projection, screenshot, support misuse, mock/seed proof risks classified |
| Frontend Review | Route/component surface inventory and current data sources mapped |
| QA Review | Future grep/test guardrails and blocked implementation checks proposed |
| Canon Review | SSOT hierarchy preserved; this document is requirements-only |

Allowed write scope:

```text
docs/architecture/domain/stage_12_x_4_projection_metadata_proof_class_ui_requirements_v1.md
```

No code changes were made.

## 1. Purpose

Stage 12 completed a bounded UI/copy/mock alignment pass. Stage 12.x.2 then planned legacy route/type vocabulary cleanup. Stage 12.x.3 inventoried mock/demo corpora and quarantine sequencing.

Stage 12.x.4 defines the missing UI contract for proof-class and projection metadata display:

```text
Stage_12 = successful_first_alignment_pass
Stage_12 != fully_clean_UI_layer
Stage_12.x.3 = mock_quarantine_inventory_complete
Stage_12.x.4 = UI_requirements_for_projection_metadata_and_proof_class_display
Stage_12.x.4 != API_metadata_implementation
Stage_12.x.4 != frontend_component_implementation
Stage_12.x.4 != mock_quarantine_implementation
Stage_12.x.4 != public_launch_ready
```

This document answers:

- which surfaces are projection, mock/demo/seed, local-only, diagnostic, deferred or owner-backed;
- which surfaces must show `not proof`, source, `asOf`, `proofClass`, owner source or owner fact references;
- where static disclaimers are enough;
- where numeric values require owner-backed sources;
- where mock/demo surfaces must be forbidden or quarantined before replacement.

## 2. SSOT Positioning

This document is the planning SSOT for UI treatment of projection metadata and proof-class display.

It does not replace:

- Stage 11.5 projection field contract;
- Stage 11.6 Admin diagnostics contract;
- Stage 11.8 smoke proof rejection rules;
- Stage 11.9 closure review;
- Stage 12 UI/copy/mock alignment;
- Stage 12.x.2 route/type vocabulary cleanup plan;
- Stage 12.x.3 mock quarantine inventory;
- runtime owner facts, API/OpenAPI/SDK contracts or database schema.

Hierarchy:

```text
Stage 11.9 governance boundaries
  > Stage 11.5 projection metadata field contract
  > Stage 11.6 admin diagnostic metadata contract
  > Stage 11.8 smoke proof rejection rules
  > Stage 12 UI/copy/mock alignment
  > Stage 12.x.2 route/type vocabulary cleanup plan
  > Stage 12.x.3 mock quarantine inventory
  > Stage 12.x.4 projection metadata / proof-class UI requirements
  > future implementation PRs
```

If this document conflicts with Stage 11.5, 11.6, 11.8, 11.9, Stage 12, 12.x.2 or 12.x.3, the upstream SSOT wins.

## 3. Doctrine Carried Forward

Canonical boundaries preserved:

```text
owner_fact = final_authority
projection != authority
Dashboard != receipt
Wallet != financial_wallet
ActivityFeed != audit_trail
diagnostic_snapshot != customer_proof
mock_data != proof
demo_data != proof
seed_demo != launch_proof
screenshot != proof
share_card != proof
Quest_outbox = delivery_intent_only
Points_row = economic_fact
user_badges_row = badge_award_fact
RF_voucher = lifecycle_fact_only
Rielt_inquiry = inquiry_fact_only
Path_B = excluded_by_default
```

Required UI formula:

```text
projection_or_diagnostic_can_help_find_owner_fact = true
projection_or_diagnostic_can_terminate_proof = false
```

Metadata anti-hallucination rule:

```text
if API/runtime does not provide source/asOf/proofClass:
  UI must not invent source/asOf/proofClass
  UI must show empty/deferred/reference-only/non-proof posture
```

## 4. Scope

In scope:

- UI requirements for projections, dashboards, summaries and activity feeds;
- proof-class taxonomy for UI surfaces;
- source, `asOf`, freshness and owner-reference requirements;
- module-specific surface matrix for Home, Connect, Quest, RF, Rielt, Space, Atlas, Pulse, Blog, Guru, Admin and Profile;
- blocked surfaces and future implementation dependencies;
- QA/grep guardrails for future implementation.

Out of scope:

- runtime changes;
- frontend component implementation;
- route changes or redirects;
- type/component/file renames;
- API/OpenAPI/SDK/schema changes;
- new projection DTO fields;
- feature flag wiring;
- mock deletion or movement;
- Admin diagnostics runtime;
- public launch, production rollout or support-proof approval;
- Path B, token, NFT, G2A, bridge, booking, payment, payout or cashback activation.

## 5. Search / Inspection Method

Targeted search only; no unbounded repo reading.

Searches performed:

```text
rg "\b(dashboard|Dashboard|summary|Summary|projection|wallet|Wallet|balance|Balance|activity|Activity|transaction|Transaction|feed|Feed|proof|receipt|source|asOf|updatedAt|verified|mock|seed|diagnostic|admin|support|outbox|claim|redeem|reward|Reward|badge|Badge|Points)\b" apps/go2asia-pwa-shell --glob "*.{ts,tsx}" --files-with-matches
rg "\b(asOf|proofClass|isProof|sourceOwner|ownerFactRef|ownerFact|sourceRecordKey|supportLookup|lastUpdated|updatedAt|generatedAt|stale|fresh|diagnosticTraceId)\b" apps/go2asia-pwa-shell --glob "*.{ts,tsx}"
rg "fetchQuest|QuestRunner|mockQuests|useGet|fetchRf|fetchMyVouchers|useRieltSeed|fetchListing|mergeSeed|useSpaceHomeFeed|getDataSource|mockRepo|mockEventsById|NEXT_PUBLIC_DATA_SOURCE|profile|admin" apps/go2asia-pwa-shell/app --glob "*.{ts,tsx}"
rg "read-only|receipt|proof|not proof|не является|sourceService|sourceRecord|asOf|updatedAt|mock|seed|informationalOnly|claimBehaviorUnchanged|backend|runtime|verified|booking|payment|payout|cashback" apps/go2asia-pwa-shell/components --glob "*.{ts,tsx}"
```

Key files/directories inspected:

- `apps/go2asia-pwa-shell/app/HomePageClient.tsx`
- `apps/go2asia-pwa-shell/components/landing/HomePageContent.tsx`
- `apps/go2asia-pwa-shell/components/connect/Wallet/WalletView.tsx`
- `apps/go2asia-pwa-shell/components/connect/Wallet/TransactionList.tsx`
- `apps/go2asia-pwa-shell/components/connect/Dashboard/BalanceCards.tsx`
- `apps/go2asia-pwa-shell/components/connect/Dashboard/ActivityFeed.tsx`
- `apps/go2asia-pwa-shell/components/connect/Dashboard/ConnectRfSection.tsx`
- `apps/go2asia-pwa-shell/components/connect/Dashboard/RfVoucherProjectionPanel.tsx`
- `apps/go2asia-pwa-shell/components/connect/Levels/LevelsView.tsx`
- `apps/go2asia-pwa-shell/components/connect/Referrals/ReferralsView.tsx`
- `apps/go2asia-pwa-shell/app/(public)/quest/*`
- `apps/go2asia-pwa-shell/components/quest/*`
- `apps/go2asia-pwa-shell/components/rf/*`
- `apps/go2asia-pwa-shell/app/(public)/rielt/*`
- `apps/go2asia-pwa-shell/components/rielt/*`
- `apps/go2asia-pwa-shell/app/(public)/space/*`
- `apps/go2asia-pwa-shell/components/space/*`
- `apps/go2asia-pwa-shell/app/(public)/atlas/*`
- `apps/go2asia-pwa-shell/app/(public)/pulse/*`
- `apps/go2asia-pwa-shell/mocks/*`

## 6. Proof-Class Taxonomy

Stage 12.x.4 uses these UI-facing proof classes. These are UI treatment classes; they do not redefine owner-service proof contracts.

| Proof class | Meaning | Can display numeric values? | Can support screenshot evidence? | Can be used by support? | Can terminate proof? | Requires source? | Requires `asOf`? | Requires owner ref? | Requires not-proof disclaimer? | Public UI allowed? | Smoke allowed? |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `OWNER_FACT` | Canonical owner row/fact in owner service | Yes, if owner-backed | Screenshot still only hint | Yes, after owner lookup | Yes, at owner source only | Yes | Yes | Yes | If rendered through projection UI | Yes, bounded | Yes |
| `OWNER_FACT_REFERENCE` | Pointer to owner fact, not the fact itself | Row metadata only | No | Navigation hint | No | Yes | Recommended | Yes | Yes | Yes | Hint only |
| `PROJECTION` | Read-only summary, preview, dashboard or feed | Yes, only with source/asOf or guarded partial state | No | Navigation hint | No | Yes | Yes if available | Recommended | Yes | Yes | Rejection validation only |
| `DIAGNOSTIC` | Admin/internal diagnostic snapshot | Yes, internal-only | No | Navigation hint | No | Yes | Yes | Yes | Yes | Admin-only | Rejection validation only |
| `MOCK_DEMO` | Internal demo/static fixture/mock corpus | No as account truth | No | No | No | Must say mock/demo | No | No | Yes | Only explicitly demo-labeled | No |
| `SEED_DEMO` | Seed/demo data that may be API-visible in dev/staging | Only with seed label | No | No for customer proof | No | Yes, seed source | Recommended | No | Yes | Only with explicit source | Excluded unless owner row verified |
| `LOCAL_ONLY` | Client-only local state or legacy page state | No as backend truth | No | No | No | Local source label | No | No | Yes | Limited | No |
| `OUTBOX_INTENT` | Delivery intent such as Quest reward outbox | Counts/status only | No | Navigation to owner rows | No | Yes | Yes | Yes | Yes | Usually admin/internal or guarded user copy | Only as delivery intent |
| `DEFERRED_PLACEHOLDER` | Planned/future/deferred surface | No active metrics | No | No | No | No | No | No | Yes | Yes as placeholder | No |
| `FORBIDDEN_SURFACE` | Surface/artifact that must not show active proof/product claims | No | No | No | No | N/A | N/A | N/A | Must block or hard-label | No active UI | No |

Key interpretation:

```text
OWNER_FACT may feed UI display
UI display of OWNER_FACT still does not make the UI the proof terminator
OWNER_FACT_REFERENCE can route support to owner facts but cannot close support cases
PROJECTION can show summary only when source/freshness limits are visible
MOCK_DEMO and SEED_DEMO are never customer proof
```

## 7. Metadata Requirements By Proof Class

| Proof class | Required UI metadata | Required disclaimer | If metadata is missing |
|---|---|---|---|
| `OWNER_FACT` | owner service/source, owner row/reference ID, timestamp, status, proof class | UI is read-only; support must resolve owner source | Show row only as unverified/partial, or hide support/proof language |
| `OWNER_FACT_REFERENCE` | source label, source record key, owner lookup path | Reference only, not receipt | Show as navigation hint only |
| `PROJECTION` | source, `asOf` or last owner timestamp when available, projection generated time when available, freshness/staleness, display scope | Read-only summary; not proof; not receipt; may be stale | Show reduced/empty/deferred state; do not invent `asOf` |
| `DIAGNOSTIC` | diagnostic source, snapshot time, owner fact pointers, visibility, operator boundary | Internal navigation only; not customer proof | Do not expose user-facing diagnostic state |
| `MOCK_DEMO` | internal demo/mock label | Not proof; not evidence; not production data | Remove, quarantine, or hard-label above fold |
| `SEED_DEMO` | seed/demo source, environment boundary, source label | Seed/demo source; not launch/smoke proof | Keep source label or hide from public/smoke evidence |
| `LOCAL_ONLY` | local-only label, storage/session boundary | Not backend-confirmed; not reward proof | Do not show as account fact |
| `OUTBOX_INTENT` | outbox/delivery source, owner progression ID, status timestamp | Delivery intent only; not reward grant | Do not show as applied reward |
| `DEFERRED_PLACEHOLDER` | deferred/planned label | Planned/deferred; no active product claim | No numeric values unless example-only |
| `FORBIDDEN_SURFACE` | N/A | Must not show as active UI | Block, redirect, remove, or quarantine |

Mandatory display rules:

- `asOf` is the owner fact/state timestamp, not render time.
- `updatedAt` can be displayed only as a source field label, not silently upgraded to proof freshness.
- React Query `staleTime` is not `dataFreshness`.
- `sourceOwner` must never be `Connect`, `Profile`, `Admin`, `UI`, screenshot or mock.
- `sourceService` labels are helpful but not sufficient for support-safe proof without owner reference keys.

## 8. Surface Requirements Inventory

| ID | Surface | Route/component | Current data source | Current class | Required metadata | Required disclaimer | Blocked until | Future slice |
|---|---|---|---|---|---|---|---|---|
| S-01 | Home authenticated stats | `/`, `HomePageClient`, `UserSummary` | Inline `userStats` mock | `MOCK_DEMO` | None until replaced | Demo/reference-only or no numeric account values | Stage 12.x.3 quarantine or API/empty replacement | 12.x.4-A |
| S-02 | Home activity/rewards preview | `HomePageClient`, `userRewards`, `RewardsList` | Inline/static mock | `MOCK_DEMO` | None until replaced | Not latest activity; not reward proof | Mock replacement | 12.x.4-A |
| S-03 | Connect Dashboard | `/connect`, `DashboardContent`, `BalanceCards` | `/v1/points/connect-dashboard` plus `/v1/wallet/summary` | `PROJECTION` | source owner/service, `asOf`, freshness, display scope | Read-only; not receipt; not financial balance | API metadata envelope | 12.x.4-B |
| S-04 | Connect Wallet/Activity | `/connect/wallet`, `WalletView` | `useGetBalance`, `useGetTransactions`, `/v1/wallet/summary` | `PROJECTION` plus row `OWNER_FACT_REFERENCE` | Points owner keys, transaction IDs/external IDs, `asOf`, source service | Internal Points; not financial wallet; not receipt | API/SDK metadata and route vocabulary slice | 12.x.4-B / 12.x.2-B |
| S-05 | Connect ActivityFeed | `ActivityFeed` | Dashboard recent transactions | `PROJECTION` | source service per row, createdAt, row reference when available | Recent preview; not audit trail; not complete history | API metadata for owner refs | 12.x.4-B |
| S-06 | Connect TransactionList | `TransactionList` | Points transactions SDK | `OWNER_FACT_REFERENCE` / `PROJECTION` | transaction ID, external ID where available, source service, createdAt | Read projection over Points rows; UI is not receipt | API support keys | 12.x.4-B |
| S-07 | Connect Levels/Badges | `/connect/levels`, `LevelsView` | badge catalog and my badges SDK | `PROJECTION` over badge awards | badge owner/source, award timestamp, `userBadgeId` when available | Off-chain badge; not NFT/token/asset | badge award metadata completeness | 12.x.4-D |
| S-08 | Connect Referrals | `/connect/referrals`, `ReferralsView` | referral stats/tree/earnings SDK | `PROJECTION` | referral source, Points source when applicable, `asOf` | Not payout/commission; Points after backend confirmation | referral/Points owner references | 12.x.4-B |
| S-09 | Connect Missions/Analytics | `/connect/missions`, `/connect/analytics` | static placeholders | `DEFERRED_PLACEHOLDER` | none | Deferred; no backend aggregates | backend aggregate contract | later UI slice |
| S-10 | Connect RF summary | `ConnectRfSection`, `RfVoucherProjectionPanel` | RF summary + vouchers, client-composed projection | `PROJECTION` | RF source service, voucher IDs, lifecycle timestamps, freshness | RF owner domain; Connect read-only; not payout/cashback/payment | RF metadata envelope | 12.x.4-RF |
| S-11 | Quest catalog cards | `/quest`, `QuestHomeClient` | Quest SDK | `PROJECTION` over quest definitions | quest source, published/runtime status, reward preview class | Points after confirmation; preview not grant | API proof expectation metadata | Quest UI slice |
| S-12 | Quest detail rewards | `/quest/[id]`, `QuestDetailClient` | Quest SDK | `PROJECTION` / preview | quest ID, reward preview class, owner source | Internal Points after confirmation; not reward receipt | Quest/Points owner trace | Quest UI slice |
| S-13 | Quest run/proof submission | `/quest/[id]/run`, `QuestRunnerClient` | Quest progress/submission SDK | `OWNER_FACT_REFERENCE` after backend response; `LOCAL_ONLY` before submit | progress ID, submission ID, status, review mode, `asOf` when available | Pending review is not proof; completion UI not Points proof | Quest API proof metadata | Quest runtime UI slice |
| S-14 | Quest complete legacy page | `/quest/[id]/complete`, `RewardsView`, `mockQuests` | direct mock import | `LOCAL_ONLY` / `MOCK_DEMO` | none | Already legacy/local; not Points/badge/NFT proof | route quarantine or runtime replacement | 12.x.3-C/E |
| S-15 | RF claim/redeem | RF catalog, partner detail, merchant redeem | RF SDK | `OWNER_FACT_REFERENCE` / RF lifecycle fact | voucher ID, redemption ID, partner ID, timestamps | RF utility lifecycle only; not payout/cashback/refund/payment | RF metadata and support keys | RF lifecycle UI slice |
| S-16 | RF My Vouchers | `/rf/my-vouchers`, `RfMyVouchersView` | RF SDK + localStorage contour | `PROJECTION` plus `LOCAL_ONLY` section | server voucher IDs and source; local contour boundary | server read-only; local saved offers are not proof | local/server separation metadata | RF UI slice |
| S-17 | RF PRO live workspace | `/rf/pro`, `PROWorkspace` | RF partners/offers/pro links SDK | `PROJECTION` / owner refs | partner IDs, pro link IDs, attributed voucher IDs, timestamps | workspace summary, not settlement/payout | API metadata and role evidence | RF PRO slice |
| S-18 | RF PRO legacy routes | `/rf/pro/partners`, `/rf/pro/verifications` | `mockPartners`, `mockVerifications` | `MOCK_DEMO` | none | Demo/legacy only | route quarantine or API/empty replacement | 12.x.3-C/D |
| S-19 | Merchant workspace | `/rf/merchant`, `MerchantWorkspace` | RF SDK + Space profile lookup | `PROJECTION` / owner refs | partner, offer, pro link IDs and timestamps | merchant workspace, not payout/statement | API metadata | RF merchant slice |
| S-20 | RF entitlement preview | `RfEntitlementPreviewBadge`, listing vouchers | entitlement preview endpoint or supplied UI state | `PROJECTION` | preview source, state, stale/degraded flag, `updatedAt` when provided | informational only; claim behavior unchanged | preview envelope/staleness standard | RF entitlement slice |
| S-21 | Rielt listing cards/search | `/rielt`, `/rielt/search`, `SearchResultsView` | Rielt SDK plus seed overlay | `PROJECTION` plus `SEED_DEMO` | listing ID, source `runtime`/`seed`, `updatedAt`, inquiry source | seed/demo materials label; not booking/payment | seed source labels and API metadata | Rielt seed/source slice |
| S-22 | Rielt listing detail | `/rielt/listings/[id]` | `fetchListingStrict` plus seed overlay | `PROJECTION` plus `SEED_DEMO` | listing ID, source, `updatedAt`, inquiry path | inquiry-only; not reservation/payment proof | API/source labels | Rielt slice |
| S-23 | Rielt inquiry CTA | listing detail CTA | `createListingInquiry` SDK | `OWNER_FACT_REFERENCE` after create | inquiry ID, listing ID, idempotency key | inquiry/contact request only; not booking/payment | inquiry response metadata | Rielt slice |
| S-24 | Rielt reviews/trust labels | `Reviews`, `ListingCard`, PRO verification fields | disabled reviews, runtime verification fields | `DEFERRED_PLACEHOLDER` / `PROJECTION` | source of verification, review owner when future | no mock reviews; verified listing is not booking proof | backend UGC/verification contract | Rielt UGC slice |
| S-25 | Space dashboard | `/space`, `SpacePageClient` | Space SDK, saved reactions, reference blocks | `PROJECTION` | source label, profile/feed owner, generated/render boundary | Live/Summary/Preview; Space does not own economy facts | source/freshness metadata | Space slice |
| S-26 | Space activity | `/space/activity` | Space activity API | `PROJECTION` / social facts | activity source keys and timestamps | activity preview; not audit trail/reward proof | activity owner references | Space slice |
| S-27 | Space balance/NFT stubs | `/space/balance`, `/space/nft` | static deferred pages | `DEFERRED_PLACEHOLDER` | none | deferred; not wallet, proof, NFT/on-chain ownership | route redirect/alias plan | 12.x.2-B |
| S-28 | Space mock-consuming legacy views | `BalanceView`, `NFTView`, `QuestsView`, etc. | `components/space/mockData.ts` | `MOCK_DEMO` | none | mock metadata; not proof/receipt/wallet/NFT | mock quarantine and barrel trim | 12.x.3-A/B |
| S-29 | Atlas content cards | `/atlas/**` | API or `mockRepo` via `getDataSource()` | `PROJECTION` or `MOCK_DEMO` | data source badge, API owner, updatedAt only if supplied | mock mode is dev-only; no fallback truth | env guard/source labels | 12.x.3-D/G |
| S-30 | Pulse events | `/pulse/**` | API or mock mode | `PROJECTION` or `MOCK_DEMO` | data source badge, event owner/registration IDs if applicable | registration is not attendance/payment proof; mock mode banner | Content registration owner row and env guard | Pulse slice |
| S-31 | Blog content cards | `/blog/**` | content SDK | `PROJECTION` | content source and publish/update timestamps if available | editorial content; not operational proof | content metadata | Content UI slice |
| S-32 | Guru cards/map | `/guru`, `GuruClient` | Guru SDK plus mock constants/barrel exposure | `PROJECTION` / `MOCK_DEMO` adjacency | source label for API cards, neutral constants | ranking/card is recommendation, not proof/reward | mock barrel quarantine | 12.x.3-A |
| S-33 | Profile | `/profile` | static placeholder | `DEFERRED_PLACEHOLDER` | none until implemented | future projection consumer only; not economy authority | Profile projection API | future Profile slice |
| S-34 | Admin diagnostics | no PWA admin pages found; middleware route guard pattern exists | contract-only | `DIAGNOSTIC` | diagnostic source, owner fact pointers, `asOf`, visibility | admin-only navigation; not customer proof | Stage 11.6 runtime/UI slice | future Admin slice |

## 9. Blocked Surfaces

Surfaces that must not show numeric values until owner-backed source exists:

- Home authenticated `userStats` and `userRewards`;
- Quest complete legacy reward/badge/Points surface;
- RF PRO legacy mock partners/verifications;
- Space `BalanceView` / `NFTView` and mock-heavy legacy views;
- dormant Connect mock wrappers and Path B tabs if rewired;
- Rielt seed overlay unless source is visible and non-production interpretation is clear.

Surfaces that must not be public until mock is removed or hard-labeled:

- Home authenticated dashboard-like mock stats;
- `/quest/[id]/complete`;
- `/rf/pro/partners`;
- `/rf/pro/verifications`;
- public barrel exports for Pulse/Guru mock corpora;
- Space/RF public exports of mock-consuming legacy views if they can be imported as default module surfaces.

Surfaces that cannot show `asOf` until API provides it:

- Connect Dashboard/Wallet/ActivityFeed as projection freshness;
- Connect RF projection panel;
- Referral totals and earnings summaries;
- Profile future economy/recognition blocks;
- Admin diagnostics;
- Atlas/Pulse content in API mode when DTO lacks update metadata.

Surfaces that cannot claim owner fact until owner row/reference exists:

- Quest reward previews;
- Quest outbox/delivery status;
- RF entitlement preview badge;
- Rielt inquiry CTA before inquiry response;
- Space saved/activity previews;
- Content/Pulse registration UI unless persisted registration row exists.

Surfaces blocked until Stage 12.x.3 quarantine:

- Home inline mock stats;
- Quest complete mock route;
- RF PRO legacy mock routes;
- Pulse/Guru public mock barrels;
- Space/RF mock-consuming public exports;
- `NEXT_PUBLIC_DATA_SOURCE=mock` evidence guard.

Surfaces blocked until future runtime/API metadata slice:

- canonical `proofClass` field in DTOs;
- `asOf`, `projectionGeneratedAt`, `sourceOwner`, `ownerFactRef`, `dataFreshness`, `stalenessStatus`;
- support lookup keys in user/admin projection payloads;
- unified Admin diagnostics envelope;
- route/type/API vocabulary cleanup around `/v1/wallet/summary`.

## 10. Current UI Contract Vs Future Contracts

### UI contract now

Allowed now:

- static disclaimers;
- source labels if already known from payload;
- not-proof labels;
- demo labels;
- seed labels;
- deferred labels;
- empty or reference-only states.

Not allowed now:

- invented `proofClass`;
- invented `asOf`;
- invented owner source;
- render-time as owner timestamp;
- `isProof=true` in user-facing UI;
- support-proof or receipt copy on dashboards/feeds.

### Future API/runtime contract

Not implemented in Stage 12.x.4:

- `proofClass`;
- `sourceProofClass`;
- `sourceOwner`;
- `sourceService`;
- `sourceRecordKey`;
- `ownerFactRef`;
- `asOf`;
- `projectionGeneratedAt`;
- `dataFreshness`;
- `stalenessStatus`;
- `diagnosticTraceId`;
- `supportLookupKeys`;
- `supportLookupKey`.

These belong to a future API/runtime metadata slice approved separately from Stage 12.x.4.

### Future frontend implementation

Not implemented in Stage 12.x.4:

- metadata badges/components;
- route changes;
- UI rendering changes;
- mock cleanup;
- feature flags;
- admin UI;
- source/freshness design system components.

## 11. Future API / Runtime Metadata Wishlist

This wishlist is non-implementation guidance only.

| Field | Purpose | UI rule |
|---|---|---|
| `proofClass` / `sourceProofClass` | classify owner source or projection class | render only as supplied; never infer from copy |
| `sourceOwner` | owner domain/service | must not be UI/Profile/Connect/Admin/mock |
| `sourceService` | service that exposes/owns source | may power source label |
| `sourceRecordKey` | stable owner lookup key | navigation/support hint only |
| `ownerFactRef` | typed pointer to owner row | required before support-safe claim |
| `sourceEventId` | event/correlation key where safe | optional owner lookup hint |
| `asOf` | owner state timestamp | display as data timestamp, not render time |
| `projectionGeneratedAt` | projection composition timestamp | display separately from `asOf` |
| `dataFreshness` | fresh/stale/expired/unknown | stale/unknown cannot be proof |
| `stalenessStatus` | human-readable freshness status | warning copy required for stale/unknown |
| `displayScope` | summary/preview/diagnostic/blocked | prevents preview-as-complete-history |
| `visibility` | user/admin/internal/blocked | admin diagnostics must not leak to users |
| `supportLookupKeys` | keys for support navigation | not customer proof |

## 12. Future Frontend Implementation Guidance

Implementation should follow these slices after this document is accepted:

```text
Stage 12.x.4-A — Home authenticated mock stats replacement contract
Stage 12.x.4-B — Connect projection metadata display and guarded labels
Stage 12.x.4-C — Quest preview / complete / proof-class UI requirements
Stage 12.x.4-D — Badge/Profile/UserSummary metadata-safe counts
Stage 12.x.4-E — QA grep guardrails against hallucinated metadata
Stage 12.x.4-RF — RF lifecycle projection labels and entitlement preview freshness
Stage 12.x.4-Rielt — seed/runtime source labels and inquiry-only metadata
```

Ordering recommendation:

```text
1. Stage 12.x.2-E / 12.x.3-G — grep and barrel guardrails.
2. Stage 12.x.4 — accept this UI requirements canon.
3. Stage 12.x.3-A/C — quarantine active route-reachable mocks.
4. Stage 12.x.4-A/B/C — implement empty/deferred/non-hallucinated UI labels.
5. Future API/OpenAPI slice — implement Stage 11.5 metadata fields.
6. Stage 12.x.6 — closure review.
```

## 13. QA / Grep Requirements

Future implementation slices should add guardrails before broad UI work.

Recommended checks:

```text
rg "from ['\"].*/(connect|space|rf|quest)/mock" apps/go2asia-pwa-shell/app
rg "mockData|mockQuests|mockEvents|mockObjects|mockListings|mockPartners|mockVerifications" apps/go2asia-pwa-shell/components --glob "**/index.ts"
rg "userStats\s*=|userRewards\s*=|points:\s*[0-9]{3,}|level:\s*[0-9]+" apps/go2asia-pwa-shell/app/HomePageClient.tsx apps/go2asia-pwa-shell/components/landing
rg "NEXT_PUBLIC_DATA_SOURCE=mock" .env* apps/**/.env* docs/ops
rg "asOf|projectionGeneratedAt|dataFreshness|stalenessStatus|sourceProofClass|isProof|isReceipt|isAuthoritative" apps/go2asia-pwa-shell/app apps/go2asia-pwa-shell/components --glob "!**/*.test.*"
rg "cashback|payout|withdraw|bridge|top.?up|NFT ownership|reward receipt|production-ready|public MVP" apps/go2asia-pwa-shell --glob "*.{ts,tsx}"
```

Negative transition tests to require later:

| Transition | Expected behavior |
|---|---|
| screenshot -> proof | reject; use as navigation hint only |
| mock -> truth | reject; hard-label or remove |
| projection -> authority | reject; resolve owner row |
| stale -> entitlement | reject; re-query owner |
| outbox -> receipt | reject; Points row required for reward proof |
| diagnostic -> customer proof | reject; owner fact lookup required |
| seed -> launch evidence | reject; seed/demo is not proof |
| badge -> NFT ownership | reject; badge is off-chain |
| RF lifecycle -> payout | reject; RF is utility lifecycle |
| Rielt inquiry -> booking/payment | reject; inquiry only |

## 14. Remaining Risks

| Risk | Severity | Owner slice |
|---|---|---|
| Home authenticated mock stats can still be screenshotted as account proof | Critical | 12.x.3-A + 12.x.4-A |
| Projection metadata is absent/partial in current API/UI | High | future API metadata slice |
| UI may invent freshness/source/proof metadata during implementation | Critical | 12.x.4-E guardrails |
| Quest complete route still imports `mockQuests` | High | 12.x.3-C/E |
| RF PRO partners/verifications render mock data | High | 12.x.3-C/D |
| `NEXT_PUBLIC_DATA_SOURCE=mock` invalidates smoke evidence | Critical | 12.x.3-D/G |
| Rielt seed overlay can look like production inventory | Medium | 12.x.4-Rielt / Rielt source slice |
| Pulse/Guru barrels expose mock corpora | High | 12.x.3-A |
| Admin diagnostics contract has no unified runtime/UI | High | future Admin diagnostics slice |
| Cleaner UI routes/types could be misread as public readiness | Critical | Stage 12.x.6 closure review |
| Next 15 typecheck blocker can mask future regressions | Medium | Stage 12.x.5 |

## 15. Review Gate Results

| Review gate | Result |
|---|---|
| Runtime Governance Review | Passed as requirements-only; projection/diagnostic cannot terminate proof |
| Runtime Validation Review | Passed with `blocked` evidence status until owner bundles and mock quarantine exist |
| Product Reality Review | Passed; surfaces mapped to owner fact/projection/mock/seed/deferred classes |
| Security / Fraud & Abuse Review | Passed with critical blockers documented for Home, mock env, screenshots and mock routes |
| Frontend Review | Passed; route/component inventory completed without code changes |
| QA Review | Passed; future grep and negative-transition checks proposed |
| Canon Review | Passed; document is bounded SSOT and does not replace upstream contracts |

## 16. Acceptance Criteria

Stage 12.x.4 is successful if:

```text
proof_class_taxonomy_created: true
ui_metadata_requirements_defined: true
surface_inventory_created: true
module_matrix_created: true
owner_fact_vs_projection_vs_mock_distinction_fixed: true
blocked_surfaces_defined: true
future_api_runtime_metadata_wishlist_separated: true
future_frontend_implementation_guidance_created: true
qa_grep_requirements_defined: true
runtime_changes_made: false
frontend_implementation_changes: false
api_openapi_changes: false
sdk_regeneration: false
schema_migration_changes: false
feature_flag_wiring: false
route_changes: false
mock_quarantine_implementation: false
Path_B_activation: false
public_launch_claims: false
```

## 17. Final Verdict

```text
stage_12_x_4_status: READY_AS_READ_ONLY_PROJECTION_METADATA_UI_REQUIREMENTS
task_type: projection_metadata_proof_class_ui_requirements_audit
risk_level: HIGH
runtime_changes: false
api_openapi_changes: false
sdk_regeneration: false
schema_migration_changes: false
feature_flag_wiring: false
frontend_implementation_changes: false
mock_quarantine_implementation: false
route_type_renames: false
metadata_hallucination_in_UI_requirements: forbidden
Path_B_activation: false
economy_expansion: false
public_launch_claims: false
canon_status: aligned
```

Stage 12.x.4 defines how UI must treat projection metadata and proof classes. It does not implement API metadata, frontend badges, runtime owner references, mock quarantine or route/type cleanup.

Highest-priority consumers:

```text
1. Home authenticated stats/rewards replacement.
2. Connect Dashboard/Wallet/Activity metadata-safe labels.
3. Quest complete and Quest reward preview separation.
4. RF lifecycle / entitlement preview source and stale-state labels.
5. Rielt seed/runtime source labels.
6. Stage 12.x.6 closure review after 12.x.2/12.x.3/12.x.4 acceptance.
```

Public launch remains blocked. Projection, diagnostic, mock/demo, seed/demo, screenshot, share card and feature flag artifacts remain invalid as proof terminators.
