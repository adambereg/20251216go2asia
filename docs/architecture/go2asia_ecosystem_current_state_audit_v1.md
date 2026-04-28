# Go2Asia Ecosystem Current State Audit & Sequencing v1

**Project:** Go2Asia  
**Document role:** ecosystem current-state audit, dependency map, sequencing recommendation  
**Status:** planning/audit snapshot  
**Date:** 2026-04-26  
**Scope:** runtime reality, documented intent, known gaps, and next-phase order before RF -> Rielt -> Quest work

---

## 1. Purpose

This document fixes the current state of the Go2Asia ecosystem before the next development wave.

It is created after the backend service alignment work and the Connect Asia frontend/backend closure work:

- Connect frontend alignment;
- Connect cleanup pass;
- Connect demo seed;
- referral API fix;
- staging verification;
- closure notes.

The document is not an implementation plan and not a refactor proposal. It is an audit and sequencing artifact that should be used to:

- separate what actually works from what is product vision or historical documentation;
- prevent scope drift when moving into RF -> Rielt -> Quest;
- identify cross-module dependencies and risks;
- choose a safe order for the next engineering passes.

Primary evidence used:

- `docs/plans/go2asia_actual_state_reconciliation_v1.md`
- `docs/openapi/derived_endpoints.md`
- `docs/modules/connect/connect_backend_closure_note_v1.md`
- `docs/modules/connect/connect_frontend_alignment_closure_note_v1.md`
- `docs/modules/connect/connect_referrals_fix_closure_note_v1.md`
- `docs/runbooks/connect_demo_seed_runbook_v1.md`
- `docs/architecture/connect/connect_backend_architecture_v1.md`
- `docs/plans/go2asia_atlas_pulse_blog_live_data_audit_v1.md`
- `docs/architecture/rf/rf_three_contour_baseline_milestone_note_2026_04.md`
- `docs/architecture/rielt/rielt_service_v1_completion.md`
- `docs/architecture/quest/quest_wave_1_5b_closure_note_v1.md`
- runtime apps under `apps/*`

---

## 2. Ecosystem Overview

Go2Asia is a multi-module Asia ecosystem that combines travel content, social surfaces, economy primitives, business modules, and experience mechanics behind a gateway-driven microservice architecture.

Current high-level contours:

- **Content:** Atlas, Pulse, Blog.
- **Social:** Space.
- **Economy:** Points, Referrals, Badges, Connect.
- **Business:** RF, Rielt Market.
- **Experience:** Quest.
- **Platform:** Auth, API Gateway, Media, Geo.

Important current reality:

- The repo contains real Worker/service apps for `api-gateway`, `auth-service`, `content-service`, `feed-service`, `guru-service`, `media-service`, `points-service`, `quest-service`, `reactions-service`, `referral-service`, `rf-service`, `rielt-service`, `space-service`, and `token-service`.
- Atlas and Pulse are not separate runtime services today. Their current runtime data is served through `content-service`.
- Connect is not a standalone backend service today. It is a UI/product aggregation layer over Points, Referral, Quest handoffs, and Gateway routing.
- Several older module docs describe future or historical contours. They must be cross-checked against `apps/*`, OpenAPI bundle/derived endpoints, and closure notes before being treated as runtime truth.

---

## 3. Module-by-Module Current State

### 3.1 Atlas

**Status:** Partially implemented.

**What actually works**

- Atlas runtime data is available through `content-service`, not a standalone `atlas-service`.
- Gateway-visible content endpoints include:
  - `GET /v1/content/countries`
  - `GET /v1/content/cities?countryId=...`
  - `GET /v1/content/places?cityId=...&limit=...`
  - `GET /v1/content/places/{idOrSlug}`
- PWA has public Atlas route trees under `apps/go2asia-pwa-shell/app/(public)/atlas`.
- Live data audit confirms real staging tables for `countries`, `cities`, and `places`.
- The audited dataset contains 8 countries, 110 cities, and 477 places.

**What is NOT implemented**

- No separate `apps/atlas-service` is confirmed.
- Full Atlas service shape from older backend/module docs is not the runtime shape.
- Some map-heavy surfaces are constrained by data completeness: 20 audited places have no `lat/lng`.
- Full semantic cleanup of legacy geo columns is not complete.

**Data truth**

- DB tables in Neon/public schema: `countries`, `cities`, `places`, plus related content/media references.
- Runtime API owner: `content-service`.
- Product/domain canon: Atlas/Geo docs, with runtime consolidated into content.
- Seed/import path: `packages/db` seed/import scripts and content markdown/tooling.

### 3.2 Pulse

**Status:** Partially implemented.

**What actually works**

- Pulse event data is served through `content-service`.
- Gateway-visible endpoints include:
  - `GET /v1/content/events`
  - `GET /v1/content/events/{id}`
  - `POST /v1/content/events/{id}/register`
- SDK Pulse hooks use content APIs.
- PWA has public Pulse routes under `apps/go2asia-pwa-shell/app/(public)/pulse`.
- Live audit confirms 208 event rows in staging.

**What is NOT implemented**

- No separate `apps/pulse-service` is confirmed.
- Event identity has caveats: duplicate event slug groups exist, so slug-only integration is risky.
- Pulse has active dual-model data: `start_at/start_date`, `end_at/end_date`, and slug/FK geo fields.
- Semantic mapping between `country_slug/city_slug` and `country_id/city_id` needs bounded correction before heavier refresh work.

**Data truth**

- DB table: `events`.
- Runtime API owner: `content-service`.
- Content import path: markdown import scripts in `packages/db`.
- Some event registration data exists through `event_registrations`.

### 3.3 Blog

**Status:** Partially implemented.

**What actually works**

- Blog posts are served through `content-service`.
- Gateway-visible endpoints include:
  - `GET /v1/content/articles`
  - `GET /v1/content/articles/{slug}`
- PWA has Blog routes under `apps/go2asia-pwa-shell/app/(public)/blog`.
- SDK has Blog-facing hooks over the content client.
- Live audit confirms 31 `blog_posts`.

**What is NOT implemented**

- Blog is not strongly geo-bound in current data: audited `country_slug` and `city_slug` usage is effectively empty for the current blog dataset.
- Blog should not be treated as a blocker for Atlas/Pulse geo correction scope.

**Data truth**

- DB table: `blog_posts`, with related content blocks/media.
- Runtime API owner: `content-service`.
- Import path: markdown import scripts in `packages/db`.

### 3.4 Space

**Status:** Partially implemented.

**What actually works**

- `apps/space-service` exists as a real service.
- Gateway-derived endpoints include:
  - `POST /v1/space/posts`
  - `GET /v1/space/posts/{postId}`
  - `DELETE /v1/space/posts/{postId}`
  - `POST /v1/space/posts/{postId}/repost`
  - `POST /v1/space/posts/{postId}/media`
  - `DELETE /v1/space/posts/{postId}/media/{mediaId}`
  - `POST /v1/space/groups`
  - `GET /v1/space/groups/{groupId}`
  - `POST /v1/space/groups/{groupId}/join`
  - `POST /v1/space/groups/{groupId}/leave`
  - `GET /v1/space/feed/home`
  - `GET /v1/space/feed/profile/{userId}`
  - `GET /v1/space/feed/group/{groupId}`
  - `GET /v1/space/feed/activity`
  - `GET /v1/space/profiles/{userId}`
- PWA has Space routes under `apps/go2asia-pwa-shell/app/(public)/space`.
- Home feed integration uses real API code paths.

**What is NOT implemented**

- Space is not yet a fully integrated social layer for all modules.
- Some Space UI areas still use local/mock data, especially around posts, balance, vouchers, quests, NFT-like surfaces, and referrals.
- Full cross-module social integration with Atlas, Pulse, RF, Rielt, Quest, and Connect is future work.

**Data truth**

- Service truth: `space-service`.
- Home feed paths may involve Space/Feed boundaries.
- Some frontend surfaces still use `apps/go2asia-pwa-shell/mocks`.
- Space seed/import exists through markdown-related `packages/db` scripts, but the social layer is not uniformly live across all UI surfaces.

### 3.5 Connect

**Status:** Partially implemented.

**What actually works**

- Connect is aligned as a backend-backed UI/product module over existing services.
- There is no standalone `connect-service`.
- Current active Connect surfaces:
  - `/connect`
  - `/connect/wallet`
  - `/connect/levels`
  - `/connect/referrals`
  - `/connect/missions`
  - `/connect/analytics`
- Backend-backed Connect hooks/surfaces include:
  - `useGetConnectDashboard`
  - `useGetBalance`
  - `useGetTransactions`
  - `useGetReferralCode`
  - `useGetReferralStats`
  - `useGetReferralTree`
  - `useGetReferralEarnings`
  - `useGetBadgeCatalog`
  - `useGetMyBadges`
- Current gateway/runtime endpoints include:
  - `GET /v1/points/connect-dashboard`
  - `GET /v1/points/balance`
  - `GET /v1/points/transactions`
  - `GET /v1/points/badges`
  - `GET /v1/points/badges/mine`
  - `GET /v1/referral/code`
  - `GET /v1/referral/stats`
  - `GET /v1/referral/tree`
  - `GET /v1/referral/earnings`
  - `POST /v1/referral/claim`
- Demo seed exists for backend-backed Connect UI via `packages/db/src/seedConnectDemo.ts` and `packages/db/src/connectDemoData.ts`.
- Staging referral earnings fix was verified: `GET /v1/referral/earnings` returned 200 and `/connect/referrals` no longer showed a screen-level error for the fixed case.

**What is NOT implemented**

- No `connect-service`.
- No G2A/token wallet, NFT wallet, deposits, withdrawals, conversions, or on-chain behavior.
- No Connect progression backend, XP, levels engine, Connect missions backend, analytics backend, rankings, season pulse, partner income, or PRO economy truth.
- `/connect/missions` and `/connect/analytics` are future placeholders.
- `/connect/levels` is badges-backed plus quiet progression placeholder, not real levels/progression.

**Data truth**

- Points ledger and badges: `points-service`.
- Referral graph and earnings read model: `referral-service`.
- Quest reward/badge handoffs: `quest-service` into Points.
- Connect dashboard: read model in `points-service`; not a table and not SSOT.
- Demo seed writes existing backend-owned tables only: `badges`, `user_badges`, `user_balances`, `points_transactions`, `referral_links`, `referral_relations`.

### 3.6 RF

**Status:** Partially implemented.

**What actually works**

- `apps/rf-service` exists.
- RF has achieved a three-contour baseline:
  - public RF contour;
  - merchant contour baseline;
  - PRO contour baseline.
- Public PWA surfaces include routes such as `/rf`, `/rf/vouchers`, `/rf/map`, `/rf/favorites`, `/rf/my-vouchers`, and `/rf/how-it-works`.
- Gateway-derived RF endpoints include:
  - `GET /v1/rf/partners`
  - `GET /v1/rf/partners/{partnerId}`
  - `GET /v1/rf/offers`
  - `GET /v1/rf/offers/{offerId}`
  - `POST /v1/rf/business/partners`
  - `POST /v1/rf/business/partners/{partnerId}/offers`
  - `POST /v1/rf/business/partners/{partnerId}/offers/{offerId}/activate`
  - `POST /v1/rf/offers/{offerId}/claim`
  - `GET /v1/rf/me/vouchers`
  - `GET /v1/rf/pro/links`
  - `POST /v1/rf/pro/links`
  - `POST /v1/rf/pro/links/{proLinkId}/accept`
  - `POST /v1/rf/business/partners/{partnerId}/vouchers/{voucherId}/redeem`
- RBAC access for `/rf/pro` was fixed and manually verified according to the RF milestone note.

**What is NOT implemented**

- RF is not production-complete.
- Merchant surfaces are partly read-only, beta, or mixed-live.
- PRO surfaces include support-layer/derived/beta logic.
- Final live assignment model for PRO is not complete.
- Full merchant hardening, PRO hardening, reviews, vouchers, rewards live integration, and RF -> Connect integration remain future bounded passes.

**Data truth**

- Service truth: `rf-service` with database-backed runtime slice.
- Some UI data is still enrichment/support-layer rather than fully API-truth.
- RF depends on Geo/Atlas for place/location meaning, but should not own geo canon.

### 3.7 Rielt Market

**Status:** Implemented near practical v1 baseline.

**What actually works**

- `apps/rielt-service` exists.
- Rielt practical v1 is documented as implemented for listings, owner flow, and requester inquiry HTTP wiring.
- Runtime endpoints include:
  - `GET /v1/rielt/listings`
  - `GET /v1/rielt/listings/nearby`
  - `GET /v1/rielt/listings/{idOrSlug}`
  - `POST /v1/rielt/listings`
  - `GET /v1/rielt/my/listings`
  - `PATCH /v1/rielt/listings/{id}`
  - `DELETE /v1/rielt/listings/{id}`
  - `POST /v1/rielt/listings/{idOrSlug}/inquiries`
  - `GET /v1/rielt/my/inquiries`
- Rielt owns listing, listing media relation, actor link, and one-shot inquiry entities.
- Rielt has CSV/import tooling in `packages/db`, including `db:import:rielt-core-csv` and R2/media sync scripts.

**What is NOT implemented**

- No booking.
- No payments.
- No chat/messaging.
- No CRM/pipeline.
- No RF partner logic inside Rielt.
- No social ownership.
- No media storage.
- No runtime validation against Atlas for geo IDs.
- Public DTO currently leaves media URL resolution outside Rielt.
- Nearby backend exists, but some frontend wiring is deferred.

**Data truth**

- Service truth: `rielt-service`.
- Listings/inquiries: Rielt DB tables.
- Geo identity: Atlas/content-service expected upstream.
- Media bytes/URLs: media-service; Rielt stores `media_id` references only.
- RF integration is planned, not owned by Rielt v1.

### 3.8 Quest

**Status:** Partially implemented.

**What actually works**

- `apps/quest-service` exists.
- Quest owns runtime quests, steps, progress, submissions, reward delivery intent, and internal reward outbox/replay.
- Gateway-derived endpoints include:
  - `GET /v1/quests`
  - `POST /v1/quests`
  - `GET /v1/quests/{questId}`
  - `POST /v1/quests/{questId}/start`
  - `GET /v1/quests/{questId}/progress`
  - `POST /v1/quests/{questId}/steps`
  - `POST /v1/quests/{questId}/publish`
  - `POST /v1/quests/{questId}/steps/{stepId}/submit`
  - `GET /v1/quests/{questId}/submissions`
  - `POST /v1/submissions/{submissionId}/review`
- Quest completion can hand off bounded rewards into Points through internal points add.
- First quest badge auto-award handoff exists through `POST /internal/points/badges/award`.
- Wave 1.5B closed quest-level metadata migration and runtime-first PWA paths for `/quest` and `/quest/[id]`.

**What is NOT implemented**

- Map pass is post-1.5B.
- Proof UX completion is not done.
- Verification hardening / anti-fraud is not done.
- Social/my-quests/leaderboard expansion is not done.
- Domain event publication is staged/noop rather than a real event bus.
- Quest does not own ledger truth or badge truth.

**Data truth**

- Quest runtime: `quest-service`.
- Progress/submissions/reward delivery intent: Quest tables such as `quest_progress`, `quest_submission`, and `quest_reward_outbox`.
- Final Points transaction and badge award: `points-service`.
- Quest media canon still needs a dedicated pass before full runtime expansion.

### 3.9 Points

**Status:** Implemented near MVP baseline.

**What actually works**

- `apps/points-service` exists.
- Points is the off-chain ledger and economy baseline for Connect-facing data.
- Runtime endpoints include:
  - `GET /v1/points/balance`
  - `GET /v1/points/transactions`
  - `GET /v1/points/connect-dashboard`
  - `GET /v1/points/badges`
  - `GET /v1/points/badges/mine`
- Internal endpoints include:
  - `POST /internal/points/add`
  - `POST /internal/points/badges/award`
- Points receives bounded reward handoffs from Quest and referral first-login bonus flows.

**What is NOT implemented**

- No G2A.
- No on-chain wallet.
- No broad tokenomics engine.
- No financial wallet operations.
- No mission/progression/analytics backend.

**Data truth**

- Ledger: `points_transactions`.
- Balances: `user_balances`.
- Badge catalog and awards: `badges`, `user_badges`.
- Connect dashboard is a read model, not source of truth.

### 3.10 Referrals

**Status:** Implemented near MVP baseline.

**What actually works**

- `apps/referral-service` exists.
- Runtime endpoints include:
  - `GET /v1/referral/code`
  - `GET /v1/referral/stats`
  - `GET /v1/referral/tree?depth=1|2`
  - `GET /v1/referral/earnings`
  - `POST /v1/referral/claim`
- Internal endpoints include:
  - `POST /internal/referral/generate-code`
  - `POST /internal/referral/link`
  - `POST /internal/referral/mark-first-login`
- Referral owns referral graph, referral code, claim/tree/stats, first-login bonus trigger, and earnings read model.
- Referral earnings fix resolved the staging 500 caused by query/runtime mismatch.

**What is NOT implemented**

- Referral does not own Points balances or ledger rows.
- Business/partner referral economy is not current runtime truth for Connect.
- Referral auto-awards for badges are not implemented unless explicitly added later.
- Referrals UI still has a screen-level error risk when required calls fail; graceful partial degradation is not complete.

**Data truth**

- Referral graph: `referral_links`, `referral_relations`.
- Applied bonus truth: `points_transactions`.
- Earnings read model is derived from referral relations plus matched points transactions by `reason` and `external_id`.
- There is no separate referral earnings table.

### 3.11 Badges

**Status:** Implemented near MVP baseline.

**What actually works**

- Badges are implemented inside the Points contour.
- Runtime endpoints:
  - `GET /v1/points/badges`
  - `GET /v1/points/badges/mine`
- Internal award:
  - `POST /internal/points/badges/award`
- First quest completed badge handoff exists from Quest to Points.
- Connect levels screen now uses badges plus a quiet future progression note.

**What is NOT implemented**

- No NFT badges.
- No on-chain badges.
- No broad badge rules engine.
- No complete progression/achievement engine.

**Data truth**

- Catalog: `badges`.
- Awards: `user_badges`.
- Badge awards are separate from Points ledger balance truth.

### 3.12 Media

**Status:** Partially implemented.

**What actually works**

- `apps/media-service` exists.
- `content-service` also owns or proxies important media paths for content flows.
- Gateway has `/v1/media/*` routing with transitional fallback behavior.
- Media metadata is present in `media_files`.
- Rielt stores media references only and does not own media storage.
- Content/Atlas/Pulse/Blog flows use media metadata and R2-related tooling.

**What is NOT implemented**

- Ownership between media-service and content-service still has transitional debt.
- Rielt public DTO currently returns unresolved media URLs in its practical baseline.
- A single fully clean media canon across Atlas/Pulse/Quest/Rielt is not fully enforced.

**Data truth**

- Media metadata: `media_files`.
- Binary storage: R2 / media-service or content-service mediated flows.
- Rielt/Quest/Atlas/Pulse should reference media, not own binary lifecycle.

### 3.13 Auth / API Gateway

**Status:** Implemented baseline.

**What actually works**

- `apps/api-gateway` exists and is the primary public routing perimeter.
- `apps/auth-service` exists.
- Gateway verifies Clerk JWT for protected routes and mints gateway-origin auth for downstream services.
- Base user/auth endpoints include `POST /v1/users/ensure`.
- Gateway routes user-facing services according to `docs/openapi/derived_endpoints.md`.
- Gateway has phase-2 routing for Space, Quest, Rielt, RF, Guru, Reactions, and Feed when corresponding service URLs are configured.

**What is NOT implemented**

- Gateway readiness does not prove all phase-2 downstream services are reachable.
- If a phase-2 `*_SERVICE_URL` is missing, gateway returns reserved/not-enabled behavior such as 501.
- Gateway is not a business aggregator and should not become Connect/RF/Rielt composition logic.
- There is no separate `user-service`; user/Auth behavior is in auth-service.

**Data truth**

- Auth/user mapping: auth-service and users schema.
- Clerk is identity provider.
- Gateway owns edge auth/routing, not business state.

### 3.14 Geo Layer

**Status:** Partially implemented.

**What actually works**

- Geo identity is product-canonically Atlas-led.
- Runtime geo data is currently served through `content-service`.
- `countries`, `cities`, and `places` are present and mostly structurally consistent.
- Geo dependency docs map Atlas -> RF -> Pulse/Rielt/Quest/Space style dependencies.
- Rielt stores `country_id`, `city_id`, optional `lat/lng`, and relies on upstream canonical values.

**What is NOT implemented**

- No standalone `geo-service`.
- No universal runtime validation against Atlas for every downstream module.
- Pulse has semantic slug/FK caveats.
- Some place coordinates are missing.
- Cross-module geo binding is not uniformly hardened.

**Data truth**

- Runtime: content DB via content-service.
- Canon: Atlas/Geo architecture docs.
- Downstream modules store references or coordinates but do not own geo identity.

---

## 4. Cross-module Dependencies

### Already working or partially working

- **Points / Referrals / Badges -> Connect**
  - Working for current Connect UI.
  - Points owns balance/history/dashboard/badges.
  - Referral owns code/stats/tree/earnings.
  - Badges are visible through Points endpoints.

- **Referral relations -> Points bonus**
  - Working in the current bounded first-login bonus model.
  - Referral owns graph/activation facts.
  - Points owns the applied ledger transaction.
  - Earnings read model derives status from referral facts plus matching `points_transactions`.

- **Quest -> Points / Badges**
  - Partially working.
  - Quest can hand off completion rewards and first quest badge award into Points.
  - Quest reward outbox/replay exists for delivery durability.
  - Full task/progression/analytics engine does not exist.

- **Geo -> Atlas / RF / Rielt / Quest**
  - Partially working.
  - Atlas/content-service is the current geo reference source.
  - Rielt stores geo references and optional coordinates.
  - RF and Quest depend product-wise on place/location meaning.

- **Media -> Atlas / Pulse / Rielt**
  - Partially working.
  - Content and media metadata support Atlas/Pulse/Blog.
  - Rielt references media IDs but does not resolve/store media bytes.

- **Auth / API Gateway -> all protected services**
  - Working baseline.
  - Gateway is the public perimeter and routing/auth boundary.
  - Phase-2 services depend on correct `*_SERVICE_URL` configuration.

### Planned or not fully working

- **RF -> Rielt / Quest / Pulse / Connect**
  - Product dependency is intended but not fully live.
  - RF should stabilize partner model, vouchers, and PRO links before deeper Rielt/Quest/Connect integration.

- **Rielt -> RF / Geo**
  - Rielt already depends on Geo references.
  - RF coupling is intentionally out of Rielt v1 and should be designed after RF stabilization.

- **Quest -> Points / Badges**
  - Basic reward/badge handoff exists.
  - Future Quest task progression, validation, and badge/points rules are not implemented.

- **Space -> future social layer for all modules**
  - Space service exists and some feed APIs are live.
  - Full social layer across Atlas/Pulse/RF/Rielt/Quest/Connect is future work.

- **Connect -> aggregator of economy**
  - Connect already aggregates current economy primitives in UI.
  - It must stay a UI/product aggregator until real complexity justifies a service extraction.

---

## 5. Current Architecture Reality vs Intended Architecture

### What is implemented according to current SSOT

- API Gateway exists as routing/auth perimeter.
- Auth-service exists; Clerk remains identity provider.
- Content-service currently serves Atlas/Pulse/Blog runtime data.
- Points-service owns off-chain ledger, balance, transactions, Connect dashboard read model, and badges.
- Referral-service owns referral graph and earnings read model.
- Quest-service owns quest runtime/progress/submissions and bounded reward/badge handoffs.
- Space-service exists for social APIs.
- RF-service exists and has a three-contour baseline.
- Rielt-service exists and has a practical v1 listings/inquiry baseline.
- Media-service exists, while some media flows still pass through content-service/fallback paths.

### Where reality diverges from older intent

- Older docs describe separate `atlas-service` and `pulse-service`; runtime is `content-service`.
- Older Connect docs describe `connect-service`, `/api/connect`, wallet, G2A, NFT, levels, missions, analytics, and tokenomics; current runtime explicitly does not implement these.
- `docs/ops/service_inventory.md` has historical or stale statements for some phase-2 services and must be cross-checked against `apps/*` and newer closure notes.
- `docs/openapi/openapi.yaml` alone is not enough because the useful route set is in bundled/derived OpenAPI artifacts.

### Temporary solutions

- Media ownership is transitional between content-service and media-service paths.
- RF merchant/PRO surfaces include beta/support-layer/derived data.
- Space UI mixes real API and mock/local surfaces.
- Pulse stores dual timing and geo identity fields.
- Gateway phase-2 routes are present but depend on deployment configuration.

### Hidden domains to avoid inventing

- Connect must not infer hidden domains from Points data.
- Points is the economy ledger, not a progression engine.
- Referral earnings is a derived read model, not a separate financial balance.
- Quest reward outbox is delivery-state logic, not a general event bus.
- Badges are off-chain achievements, not NFTs.

### Special notes

- **Connect as UI aggregator:** current architecture intentionally has no `connect-service`.
- **Points as economy core:** Points is the stable off-chain ledger for Connect-facing economy.
- **Referral dual-use:** Referral owns graph/activation; Points owns actual applied bonus rows.
- **Missing backends:** there is no current backend for Connect progression, Connect missions, broad analytics, rankings, or tokenomics.

---

## 6. Data & Seed State

### Modules with seed or import paths

- **Atlas / Pulse / Blog**
  - Data exists in Neon/public tables and is served by content-service.
  - Import/seed scripts exist in `packages/db`, including markdown imports for guides, Pulse events, and Blog.
  - Live audit confirmed `countries`, `cities`, `places`, `events`, `blog_posts`, `content_blocks`, `event_registrations`, and `media_files`.

- **Space**
  - Space service exists.
  - Markdown seed/import tooling exists for Space-related data.
  - Not all UI surfaces are fully API-backed.

- **RF / Rielt**
  - RF has service/runtime baseline but still mixed live/support-layer UI zones.
  - Rielt has CSV/import tooling such as `db:import:rielt-core-csv` and media sync scripts.

- **Quest**
  - Quest has runtime metadata migration and bounded target-set backfill for Wave 1.5B.
  - Quest data is partially seeded/imported for target quest set, not a fully generalized Quest runtime completion.

- **Connect**
  - Dedicated demo seed exists through `packages/db/src/seedConnectDemo.ts`.
  - Verification script checks DB-level Connect demo facts.
  - API verification is manual/token-dependent.

### Modules without stable full pipeline

- Connect missions/progression/analytics have no backend pipeline.
- RF merchant/PRO operational data is not fully API-truth everywhere.
- Rielt media URL resolution is not end-to-end complete in Rielt v1 DTOs.
- Quest media/proof/validation pipeline is not fully canonicalized.
- Cross-module Space/social data is not unified across ecosystem modules.

### Markdown, CSV, seed, mock

- **Markdown imports:** guides, Pulse events, Blog, Space-related content.
- **CSV:** Rielt core import path.
- **Seed:** general DB seed, Connect demo seed, Quest target backfill/import paths.
- **Mock:** PWA mock data still exists and is used by some Space/future-product surfaces; Connect active UI was cleaned to avoid mock fallback in current truth surfaces.

---

## 7. Known Gaps and Risks

### API gaps

- No standalone Atlas, Pulse, Connect, or Geo service despite older docs describing some of these contours.
- No Connect missions/progression/analytics endpoints.
- Rielt deliberately excludes booking, payments, chat, CRM, social ownership, runtime Atlas validation, and media URL resolution.
- Quest lacks final proof UX, anti-fraud validation, map pass, social/my-quests/leaderboard expansion.
- RF lacks full live merchant/PRO hardening and final PRO assignment model.

### Data inconsistencies

- Pulse has slug/FK semantic mismatch and duplicate event slug groups.
- Pulse dual time fields need deterministic read rules.
- Some places lack coordinates, affecting map-heavy flows.
- Blog currently has low/empty geo targeting, so geo-based Blog assumptions are unsafe.
- Referral earnings depends on the `external_id` convention for matching Points transactions.

### UI placeholders and mock zones

- Connect missions and analytics are placeholders.
- Connect levels are badges-backed plus future note, not real progression.
- RF merchant and PRO are baseline/skeleton/beta in parts.
- Space has mixed API and mock/local UI zones.
- Some historical Connect mock components remain outside active runtime paths.

### Auth/token dependencies

- Protected service access depends on Clerk JWT and gateway-origin downstream auth.
- Gateway phase-2 route availability depends on `*_SERVICE_URL` configuration.
- Connect demo API verification requires authenticated gateway token matching the seeded user.

### OpenAPI vs runtime mismatches

- `docs/openapi/openapi.yaml` alone is not enough; use bundle/derived endpoint docs.
- Referral earnings status has a known mismatch: OpenAPI/SDK include `activated`, while current runtime derives `pending`, `rewarded`, and `reward_missing`.
- Older Connect `api_contracts.md`, `data_model.md`, and `overview.md` describe non-runtime tokenomics/wallet/service shapes.

### Graceful degradation gaps

- Connect referrals screen can fail at screen level if a required referral call fails.
- Gateway readiness does not guarantee all phase-2 downstream services are live.
- Guru/RF/Rielt/Quest style composition will need clearer partial-failure behavior before broader user-facing aggregation.

### Service dependency risks

- Gateway configuration drift can make implemented services externally unreachable.
- Media has transitional ownership between content-service and media-service.
- Space/Feed/Reactions boundaries are real but not yet fully product-unified.
- RF, Rielt, Quest, and Connect can easily over-couple if RF stabilization is skipped.

---

## 8. Sequencing Recommendation (Next Phase)

### Phase 1 - RF stabilization

Goal: turn RF from three-contour baseline into a stable business module without expanding scope.

Focus:

- define strict RF domain boundaries;
- harden public/merchant/PRO separation;
- stabilize partner model;
- stabilize voucher logic;
- define PRO link/assignment model;
- remove or label support-layer data where it is not API-truth;
- avoid premature RF -> Connect/Rielt/Quest coupling until RF invariants are clear.

Exit criteria:

- public, merchant, and PRO contours have clear runtime truth;
- voucher claim/redeem semantics are explicit;
- PRO links/assignments have a stable API-backed model;
- RF can be safely referenced by Rielt and Quest planning.

### Phase 2 - Rielt Market

Goal: build on the existing Rielt practical v1 without turning it into booking/CRM.

Focus:

- stabilize listing lifecycle and owner flows;
- verify inquiry behavior and idempotency;
- bind listing geo references to Atlas/content canon rules;
- decide how RF partner/PRO context attaches to listings, without moving RF logic into Rielt;
- clarify media URL resolution path for listing cards/details.

Exit criteria:

- listing search/detail/create/edit/archive flows are runtime-backed;
- geo binding rules are documented and tested;
- RF relationship is an integration boundary, not a merged domain;
- frontend can show listings without fake media or ambiguous location truth.

### Phase 3 - Quest Asia

Goal: advance Quest runtime after RF/Rielt dependencies are clearer.

Focus:

- define Quest runtime model beyond Wave 1.5B metadata closure;
- establish media canon for Quest cards/details/proof;
- harden proof validation and anti-fraud;
- complete map pass where Quest depends on Geo/Atlas;
- define Points/Badges reward rules without creating a broad tokenomics engine;
- keep Quest as progress/completion owner, not ledger owner.

Exit criteria:

- Quest list/detail/start/progress/submit flows have clear data truth;
- media/proof handling is canonical;
- reward handoff to Points/Badges is reliable and observable;
- no hidden task/progression backend is implied without implementation.

### Phase 4 - User cabinets / Admin / PRO

Goal: make operational surfaces real after core domain flows stabilize.

Focus:

- user personal cabinets;
- admin data management;
- merchant/business dashboards;
- PRO business panels;
- moderation/review workflows where needed;
- clear role and access model across RF/Rielt/Quest/Connect.

Exit criteria:

- user/admin/PRO surfaces are API-backed where presented as operational;
- role access is consistent through Clerk/Gateway;
- admin functions do not duplicate service ownership.

### Phase 5 - Return to Space

Goal: turn Space from partial social module into the shared social layer.

Focus:

- real feed/post/group/profile surfaces;
- integration points from Atlas/Pulse/RF/Rielt/Quest;
- reactions/media boundaries;
- remove or isolate remaining social mocks;
- define where Space owns social truth and where it only references external modules.

Exit criteria:

- Space can support cross-module social context without taking ownership of external business/content domains;
- mock/local surfaces are removed from active product truth;
- feed/reactions/media behavior is observable and degradation-aware.

### Phase 6 - Design System & UI unification

Goal: unify visual and interaction quality after runtime truth is stable.

Focus:

- shared design system usage;
- consistent navigation and empty/error states;
- unified cards, filters, lists, maps, and dashboard patterns;
- final polish across Connect, RF, Rielt, Quest, Space, Atlas, Pulse, and Blog.

Exit criteria:

- UI consistency improves without masking data gaps;
- placeholders are clearly labeled;
- product quality polish does not reintroduce fake runtime claims.

---

## 9. Final Verdict

Go2Asia is in a **multi-module MVP-to-baseline transition stage**.

The ecosystem is no longer only product vision: core services exist, Gateway/Auth are in place, Content/Atlas/Pulse/Blog have real data, Connect is backed by Points/Referral/Badges, RF has a three-contour baseline, Rielt has a practical v1 service, Quest has runtime and reward handoff foundations, and Space exists as a real social service.

At the same time, the ecosystem is not production-complete as a unified platform. Several modules are partial, some UI surfaces remain placeholders or support-layer, documentation has historical drift, and cross-module integration must be sequenced carefully.

Readiness for the next phase: **ready to proceed, but only through bounded stabilization passes**.

The recommended next concrete move is **RF stabilization first**, because RF is the business bridge that can later connect partner/voucher logic to Rielt, Quest, Pulse, and Connect. Starting with Rielt or Quest before RF invariants are stable would increase cross-module coupling risk.

