# Stage 13.0 User Journey Assembly Plan / Slice Map

Документ: `stage_13_0_user_journey_assembly_plan_slice_map_v1.md`
Статус: planning-only report / user journey assembly slice map
Дата: 2026-05-23
Execution mode: read-only planning / architecture slice, no implementation
Code changes: none

## 1. Orchestrator Intake

Stage 13.0 begins User Journey Assembly after Stage 12I closed the largest product-reality and runtime-projection gaps.

Task classification:

- Type: docs/planning, architecture slice map, journey assembly audit.
- Risk level: medium governance risk because the plan crosses auth, Points, Quest, RF, Rielt, PRO, VIP and internal diagnostics semantics.
- Runtime risk: no runtime mutation in this slice; future slices must remain projection-safe and owner-fact-aware.
- Implementation mode: planning-only.
- Artifact: this report only.

Selected agents / review perspectives:

- AI Program Director / Orchestrator.
- Requirements Analyst.
- Architect.
- Delivery Planner.
- Slice Strategist.
- Frontend Developer.
- Runtime Governance Architect.
- Technical Canon Writer.

Review gates required and applied in this report:

- Requirements Review: applied to journey coverage and acceptance criteria.
- Architecture Review: applied to route/module/runtime edge classification.
- Plan Review: applied to Stage 13 slice sequencing.
- Slice Review: applied to bounded implementation boundaries.
- Runtime Governance Review: applied to projection, lookup, diagnostics and owner fact semantics.
- Canon Review: applied to Stage 12I invariants, terminology and report status.

## 2. Source Materials Read

Required capsules and reports:

- `docs/ai/context/core/capsule.md`
- `docs/ai/context/ui/capsule.md`
- `docs/ai/context/stage_12_product_reality/capsule.md`
- `docs/ai/context/routing_rules.md`
- `docs/reports/stage_12I_closure_review_v1.md`

Role files:

- `docs/ai/roles/orchestrator.md`
- `docs/ai/roles/requirements_analyst.md`
- `docs/ai/roles/architect.md`
- `docs/ai/roles/planner.md`
- `docs/ai/roles/slice_strategist.md`
- `docs/ai/roles/frontend_dev.md`
- `docs/ai/roles/runtime_governance_architect.md`
- `docs/ai/roles/tech_writer.md`

Relevant UI / routing / runtime files inspected:

- `apps/go2asia-pwa-shell/app/HomePageClient.tsx`
- `apps/go2asia-pwa-shell/middleware.ts`
- `apps/go2asia-pwa-shell/app/(auth)/sign-in/[[...sign-in]]/page.tsx`
- `apps/go2asia-pwa-shell/app/(auth)/sign-up/[[...sign-up]]/page.tsx`
- `apps/go2asia-pwa-shell/app/(authenticated)/connect/layout.tsx`
- `apps/go2asia-pwa-shell/app/(authenticated)/connect/page.tsx`
- `apps/go2asia-pwa-shell/app/(authenticated)/connect/ConnectPageClientWrapper.tsx`
- `apps/go2asia-pwa-shell/app/(public)/quest/QuestHomeClient.tsx`
- `apps/go2asia-pwa-shell/app/(public)/quest/[id]/QuestDetailClient.tsx`
- `apps/go2asia-pwa-shell/app/(public)/quest/[id]/complete/RewardsView.tsx`
- `apps/go2asia-pwa-shell/app/(public)/rielt/RieltHomeClient.tsx`
- `apps/go2asia-pwa-shell/app/(public)/rielt/listings/[id]/page.tsx`
- `apps/go2asia-pwa-shell/app/(public)/rielt/listings/[id]/ListingDetailClient.tsx`
- `apps/go2asia-pwa-shell/app/(public)/rf/page.tsx`
- `apps/go2asia-pwa-shell/app/(public)/rf/[id]/page.tsx`
- `apps/go2asia-pwa-shell/app/(public)/rf/rielt/listings/[listingId]/vouchers/ListingVoucherOffersClient.tsx`
- `apps/go2asia-pwa-shell/app/(authenticated)/rf/pro/page.tsx`
- `apps/go2asia-pwa-shell/components/rf/PRO/PROWorkspace.tsx`
- `apps/go2asia-pwa-shell/components/rf/PRO/PRONav.tsx`
- `apps/quest-service/src/routes/quests.ts`
- `apps/quest-service/src/services/questService.ts`
- `apps/rielt-service/src/routes/inquiry.ts`
- `apps/rielt-service/src/services/rieltService.ts`
- `apps/rf-service/src/routes/rf.ts`
- `apps/points-service/src/index.ts`
- `apps/points-service/src/projectionMetadata.ts`

## 3. Non-Negotiable Stage 12I Invariants

The following invariants remain mandatory for all Stage 13 slices:

```text
mock_data != proof
projection != authority
preview != grant
dashboard != receipt
wallet != financial_wallet
listing_projection != inventory_authority
inquiry != booking
lookup != proof
diagnostic_snapshot != customer_proof
operational_trace != immutable_audit_ledger
owner_fact = authoritative
Path_B_inactive = true
public_launch_implied = false
```

Stage 13.0 does not create runtime behavior. It classifies journey edges that can be assembled from existing runtime-backed surfaces, edges that require future bounded implementation and edges that must remain out of scope until separate approval.

## 4. Current Runtime / UI Reality Summary

Existing runtime-backed surfaces:

- Quest has public catalog/detail, authenticated start/progress/submit/review paths and reward outbox delivery toward Points.
- Points has owner-backed balances, transactions and badges plus projection metadata and internal support lookup/admin diagnostics endpoints.
- Rielt has public listings, listing details and authenticated inquiry creation/listing.
- RF has public partners/offers, voucher claim/list/redeem lifecycle, PRO links, attributed vouchers and listing-scoped RF offer edges.
- PWA has Home, public module discovery, Connect projection pages, Quest, Rielt, RF, Space and protected PRO routes.

Important current gaps:

- Home CTA points to `/register`, while actual auth routes are `/sign-up` and `/sign-in`.
- Home unauthenticated module tiles are visually locked but still navigate to module routes.
- VIP is not a first-class journey; current VIP meaning appears as `vip_spacer` role signal and RF premium entitlement/preview copy.
- Internal admin/support diagnostics have runtime endpoints and middleware admin protection, but no PWA admin diagnostics journey UI was found.
- Some PRO operation routes are explicitly deferred/soon.
- Space/social surfaces exist but remain less runtime-anchored than Quest/Rielt/RF/Points for Stage 13 assembly.

## 5. Journey Map

### 5.1 New Visitor Journey

Starting point:

- `/` through `HomePageClient`.

Main screens/modules:

- Home hero and module tiles.
- Public module entry points: `/atlas`, `/pulse`, `/blog`, `/guru`, `/rielt`, `/quest`, `/rf`, selected public `/space/*`.
- Auth entry points: existing `/sign-up` and `/sign-in`.

Expected user intent:

- Understand Go2Asia value.
- Discover ecosystem modules.
- Try public content before registration.
- Register or sign in for protected actions.

Existing supported edges:

- Home -> public module discovery.
- Home -> Atlas/Pulse/public content.
- Home -> Quest catalog.
- Home -> Rielt inquiry-only search.
- Home -> RF partner catalog.
- Middleware allows public read paths and redirects protected paths to `/sign-in`.

Missing navigation / CTA edges:

- Home registration CTA currently targets `/register`, but no `/register` route was found.
- Visitor-to-sign-in path is not first-class in Home hero.
- Locked module tile semantics are unclear because locked tiles still navigate.
- No explicit "what becomes available after auth" journey map on Home.

Unsafe or misleading edges:

- `/register` can become a dead/stale CTA.
- Locked-but-clickable module tiles can imply gated content while still navigating.
- Home value copy must avoid implying public launch readiness or guaranteed reward/Points outcomes.

Required bounded implementation:

- Replace or alias Home `/register` CTA with the existing `/sign-up` route.
- Add a clear sign-in edge for returning users.
- Clarify locked tile behavior or copy without creating fake access semantics.
- Keep module discovery copy as ecosystem overview, not launch promise.

Out-of-scope edges:

- Public launch claims.
- Automatic reward grants from registration.
- Financial wallet, token, NFT or Path B onboarding.

Applicable invariants:

- `public_launch_implied = false`
- `mock_data != proof`
- `preview != grant`
- `wallet != financial_wallet`
- `Path_B_inactive = true`

### 5.2 Registered User Journey

Starting point:

- `/sign-in` -> protected routes.
- Authenticated Home branch in `HomePageClient`.

Main screens/modules:

- Authenticated Home.
- `/profile`
- `/connect`
- `/connect/activity`
- `/connect/levels`
- `/connect/referrals`
- `/rf/vouchers`
- public module return paths.

Expected user intent:

- Enter personal/product surface after auth.
- See activity, Points projections, badges and module navigation.
- Know what next meaningful actions exist.

Existing supported edges:

- Middleware protects `/connect`, `/profile`, `/rf/pro`, `/rf/merchant`, selected Space and Quest run paths.
- Authenticated Home has deferred links to Connect, levels, referrals and RF vouchers.
- Connect metadata states read-only projection, not receipt/proof/accounting statement.
- Points service provides `projectionMetadata` with owner fact references and support lookup keys.

Missing navigation / CTA edges:

- Profile/dashboard/module navigation is fragmented across Home, Connect and module-specific paths.
- No single post-auth "next action" route map distinguishes runtime-backed from deferred.
- Connect subpage hierarchy is present, but some labels still inherit legacy "wallet" route alias.

Unsafe or misleading edges:

- Dashboard-like surfaces must not become receipts.
- `/connect/wallet` must remain a legacy activity projection alias, not a financial wallet.
- Home must not imply confirmed personal metrics before owner-backed runtime source is available.

Required bounded implementation:

- Assemble a registered user route path from Home -> Connect -> activity/levels/referrals -> module actions.
- Add copy/links that distinguish projection, owner fact and deferred states.
- Prefer alias-safe wording for `/connect/wallet`.

Out-of-scope edges:

- Accounting statements.
- Customer proof from dashboards.
- New Points producers or spendability expansion.

Applicable invariants:

- `projection != authority`
- `dashboard != receipt`
- `wallet != financial_wallet`
- `owner_fact = authoritative`

### 5.3 VIP Journey

Starting point:

- Authenticated user with `vip_spacer` role signal or RF premium offer context.

Main screens/modules:

- RF premium offers and entitlement preview badges.
- Rielt listing RF offer bridge where premium offers can appear.
- Middleware role normalization includes `vip_spacer`, but no standalone VIP page was found.

Expected user intent:

- Understand what VIP means.
- See whether premium/potentially gated RF surfaces apply.
- Avoid confusing VIP with financial, token or booking power.

Existing supported edges:

- RF listing offer UI can display premium offer labels and entitlement preview state.
- RF claim error copy can state VIP required for some RF voucher flows.
- Middleware recognizes `vip_spacer` as a canonical platform role signal.

Missing navigation / CTA edges:

- No first-class VIP explanation or status page.
- No direct VIP journey from Home/Profile/Connect.
- No clear route that explains premium surfaces without implying entitlement authority.

Unsafe or misleading edges:

- Entitlement preview can be mistaken for entitlement grant.
- Premium RF access can be mistaken for spend authority or guaranteed voucher claim.
- VIP can be overread as financial wallet, payout, token or booking privilege.

Required bounded implementation:

- Add a bounded VIP explanation surface or copy layer only if it remains role/preview-focused.
- Map premium RF edges as `preview/access condition`, not `grant`.
- Keep any entitlement state backed by existing runtime facts or explicitly deferred.

Out-of-scope edges:

- VIP financial wallet.
- VIP token/NFT ownership.
- VIP booking authority.
- VIP reward guarantee.

Applicable invariants:

- `preview != grant`
- `wallet != financial_wallet`
- `Path_B_inactive = true`
- `public_launch_implied = false`

### 5.4 PRO Journey

Starting point:

- Protected `/rf/pro` and `/quest/pro` routes.
- Middleware allows only `pro` or `admin`; otherwise redirects to `/rf?access=pro_required`.

Main screens/modules:

- RF PRO workspace.
- RF PRO linked partners, attributed vouchers and partner/offers scope.
- Deferred operation routes: partners, verifications, onboarding.
- Quest PRO routes.

Expected user intent:

- Understand PRO role meaning.
- Work with partner/offer/contribution paths.
- See RF/Connect/Rielt/Quest intersections without proof or settlement overstatement.

Existing supported edges:

- `/rf/pro` workspace loads partners/offers/pro links/attributed vouchers.
- PRO copy states working with partners does not mean business ownership.
- PRO nav labels some operations as deferred/soon.
- PRO access fallback is explicit rather than silent.

Missing navigation / CTA edges:

- No consolidated PRO journey across RF, Rielt, Quest and Connect.
- Deferred operation routes need stronger journey boundaries before implementation.
- PRO onboarding is not ready as a real workflow.

Unsafe or misleading edges:

- PRO attribution can be mistaken for proof of ownership, commission or settlement.
- Support scope fallback can be mistaken for authoritative partner ownership.
- PRO operation labels can imply operational completeness.

Required bounded implementation:

- Assemble PRO journey as operational workspace over existing RF runtime links.
- Add explicit boundaries for attribution/projection/support scope.
- Keep deferred operations visibly deferred.

Out-of-scope edges:

- Partner settlement.
- Payout/commission receipt.
- Business ownership proof.
- Full verification authority.

Applicable invariants:

- `projection != authority`
- `dashboard != receipt`
- `owner_fact = authoritative`
- `operational_trace != immutable_audit_ledger`

### 5.5 Partner / Inquiry Journey

Starting point:

- `/rf`
- `/rf/[id]`
- `/rielt`
- `/rielt/listings/[id]`

Main screens/modules:

- RF partner catalog and partner details.
- RF offers/vouchers.
- Rielt listing detail and inquiry CTA.
- Rielt listing-scoped RF voucher bridge.

Expected user intent:

- Discover partner-facing surfaces.
- Understand an inquiry or offer lifecycle.
- Avoid fake booking semantics.

Existing supported edges:

- RF partner catalog and partner detail are runtime-backed through RF SDK/API.
- RF partner detail links to offers, map and voucher catalog.
- Rielt listing detail fetches runtime listing data and can render inquiry-oriented CTA.
- Rielt inquiry runtime supports authenticated inquiry creation and listing user's inquiries.

Missing navigation / CTA edges:

- Partner-facing path is split across RF PRO, RF public partner pages and Rielt listing context.
- Inquiry status path is not surfaced as a clear user journey in PWA.
- No full partner/inquiry lifecycle explanation surface.

Unsafe or misleading edges:

- RF voucher or partner detail must not become payment/receipt/payout semantics.
- Rielt inquiry must not be represented as booking/reservation.
- Listing display must not imply verified live inventory.

Required bounded implementation:

- Add inquiry lifecycle copy and navigation that uses "inquiry/request/contact" vocabulary.
- Add user-visible path to "my inquiries" only if backed by existing Rielt runtime.
- Keep partner offer and inquiry contexts separate unless runtime-backed.

Out-of-scope edges:

- Booking/payment/reservation.
- Inventory authority.
- Partner settlement or payout.
- Customer support resolution proof.

Applicable invariants:

- `inquiry != booking`
- `listing_projection != inventory_authority`
- `projection != authority`
- `dashboard != receipt`

### 5.6 Quest -> Connect -> Points Journey

Starting point:

- `/quest`
- `/quest/[id]`
- `/quest/[id]/run`
- `/quest/[id]/complete`

Main screens/modules:

- Quest catalog.
- Quest detail.
- Quest runner.
- Quest completion notice.
- Connect activity/levels/Points projection.
- Points service owner rows and reward outbox delivery.

Expected user intent:

- Discover quest.
- Start and submit quest steps.
- Understand completion, review, reward delivery and Points visibility.

Existing supported edges:

- Quest catalog fetches runtime quests.
- Quest detail links to runtime quest run.
- Quest routes support start, progress, step submission and submission review.
- Quest service has reward outbox delivery toward Points.
- Completion notice links to Quest runtime and Connect/Levels while preserving `preview != grant`.
- Points service has owner-backed balances/transactions/badges.

Missing navigation / CTA edges:

- The path from successful Quest progress to actual Points transaction visibility is not fully assembled in UI.
- Reward outbox status is internal and not yet a customer proof surface.
- Connect does not present a quest-specific transaction drill-down journey.

Unsafe or misleading edges:

- Quest proof submission can be mistaken for customer proof.
- Quest reward preview can be mistaken for immediate grant.
- Completion screen can be mistaken for receipt if copy regresses.

Required bounded implementation:

- Assemble a safe transition from Quest status to Connect activity projection.
- Show pending/delivered/failed semantics only if backed by runtime data.
- Keep completion page as navigation/notice, not receipt.

Out-of-scope edges:

- Fake reward grants.
- Local completion as proof.
- Customer proof URL.
- Public leaderboard economy.

Applicable invariants:

- `preview != grant`
- `projection != authority`
- `mock_data != proof`
- `dashboard != receipt`
- `owner_fact = authoritative`

### 5.7 Rielt Inquiry Journey

Starting point:

- `/rielt`
- `/rielt/search`
- `/rielt/listings/[id]`

Main screens/modules:

- Rielt search and filters.
- Listing detail.
- Listing CTA panel.
- Runtime inquiry endpoint.
- Optional RF listing voucher bridge.

Expected user intent:

- Discover listing.
- Understand source-labeled preview.
- Send inquiry/contact request.
- Track inquiry status where runtime-backed.

Existing supported edges:

- Rielt Home states inquiry-only boundaries.
- Listing detail fetches runtime listing via SDK.
- Rielt service supports public listing list/detail and authenticated inquiry creation/listing.
- RF listing vouchers can contextualize partner offers near listings.

Missing navigation / CTA edges:

- User-facing "my inquiries" path is not clearly assembled in inspected PWA pages.
- Search filters include dates/guests, but copy must consistently clarify owner confirmation.
- Listing seed overlay can improve presentation but must remain non-authoritative.

Unsafe or misleading edges:

- Date selection and availability UI can imply booking if not guarded.
- Listing price/location/media can imply inventory authority if source labels are absent.
- RF voucher near a listing can imply booking discount unless copy stays inquiry/partner-offer oriented.

Required bounded implementation:

- Assemble inquiry creation/status navigation with runtime-backed inquiry rows.
- Add clear inquiry-only CTA boundaries around dates, owner response and availability.
- Keep seed/demo overlays clearly non-authoritative.

Out-of-scope edges:

- Booking.
- Payment.
- Reservation.
- Verified inventory/availability guarantee.

Applicable invariants:

- `inquiry != booking`
- `listing_projection != inventory_authority`
- `mock_data != proof`
- `projection != authority`

### 5.8 Internal Support / Admin Diagnostic Path

Starting point:

- Projection metadata with `supportLookupKey`.
- Internal Points endpoints.
- Future internal admin route if approved.

Main screens/modules:

- Points projection metadata.
- `/internal/points/support-lookup`
- `/internal/points/admin-diagnostics`
- owner fact pointers to `user_balances` and `points_transactions`.
- Middleware admin route protection exists for `/admin(.*)`, but no PWA admin diagnostics UI was found.

Expected operator intent:

- Start from projection metadata.
- Resolve a bounded owner fact pointer.
- Inspect a diagnostic snapshot for internal navigation only.
- Avoid treating diagnostics as customer proof or audit ledger.

Existing supported edges:

- Points service creates `ProjectionMetadataEnvelope`.
- Support lookup can return owner fact references for balances/transactions.
- Admin diagnostics can produce snapshots with access audit metadata.
- Diagnostics access is service-auth gated and allowlist/flag controlled.

Missing navigation / CTA edges:

- No PWA internal admin/support diagnostics UI.
- No operator workflow tying projection metadata to lookup and diagnostics.
- No cross-service diagnostics plan for RF/Quest/Rielt in the current journey surface.

Unsafe or misleading edges:

- Lookup can be mistaken for proof.
- Diagnostic snapshot can be mistaken for customer-facing evidence.
- Operational access audit can be mistaken for immutable audit ledger.
- Raw lookup keys need careful handling and future opacity/HMAC hardening remains backlog.

Required bounded implementation:

- If approved, create internal-only support/admin path with service/admin gating.
- Present lookup and diagnostics as navigation aids to owner facts only.
- Keep diagnostics out of customer-facing UI and support case closure.

Out-of-scope edges:

- Customer-facing diagnostics UI.
- Customer proof URL.
- Automatic support case closure.
- Immutable audit ledger.
- Accounting statement.

Applicable invariants:

- `lookup != proof`
- `diagnostic_snapshot != customer_proof`
- `operational_trace != immutable_audit_ledger`
- `owner_fact = authoritative`

## 6. Cross-Journey Gaps

High-priority gaps for Stage 13:

- Auth entry mismatch: Home uses `/register`, while actual auth routes are `/sign-up` and `/sign-in`.
- Visitor/registered transition needs one clear assembly path.
- VIP lacks a bounded explanation journey.
- PRO journey exists but must remain beta/operational and not settlement/proof.
- Quest to Connect/Points needs a safe status bridge from participation to owner-backed Points rows.
- Rielt inquiry status is not a clear user path yet.
- Internal support/admin diagnostics have runtime foundations but no PWA operator journey.

Accepted limitations:

- Stage 13.0 does not approve public launch readiness.
- Stage 13.0 does not approve new API/schema/SDK/database work.
- Stage 13.0 does not activate Path B.
- Stage 13.0 does not convert projections, previews, lookups or diagnostics into proof.

## 7. Stage 13 Slice Map

### 13.1 Visitor / Registered User Entry Assembly

Goal:

- Make the first cross-module journey coherent: Home -> auth -> Connect/profile/module actions.

Scope:

- Home auth CTA alignment to existing auth routes.
- Visitor module discovery boundaries.
- Registered user "next actions" route assembly.
- Explicit projection/owner/deferred wording.

Out of scope:

- New auth provider behavior.
- New reward or Points producers.
- Public launch claims.

Review gates:

- Requirements Review.
- Frontend Review.
- Runtime Governance Review for projection wording.
- Canon Review.

### 13.2 Connect / Points Projection Journey Assembly

Goal:

- Assemble registered user activity, internal Points, badges and referrals as projection-safe navigation.

Scope:

- `/connect`, `/connect/activity`, `/connect/levels`, `/connect/referrals`.
- Projection metadata display rules.
- Owner fact pointer language.
- Legacy `/connect/wallet` alias safety.

Out of scope:

- Financial wallet.
- Receipt/accounting statement.
- New spendability semantics.

Review gates:

- Architecture Review.
- Runtime Governance Review.
- Frontend Review.
- Canon Review.

### 13.3 Quest -> Connect -> Points Journey Assembly

Goal:

- Connect Quest discovery/run/progress/completion to Connect/Points visibility without reward overclaiming.

Scope:

- Quest catalog/detail/run/completion navigation.
- Pending/review/completed wording.
- Connect activity handoff.
- Reward outbox and Points row boundary copy where runtime supports it.

Out of scope:

- Fake reward grants.
- Customer proof URLs.
- Leaderboard/XP economy activation.

Review gates:

- Requirements Review.
- Architecture Review.
- Runtime Governance Review.
- Frontend Review.
- Canon Review.

### 13.4 Rielt Inquiry Journey Assembly

Goal:

- Assemble listing discovery -> listing detail -> inquiry creation/status path as inquiry-only.

Scope:

- Rielt search/listing/detail/inquiry CTA.
- Source labels and seed overlay boundaries.
- Runtime-backed "my inquiries" path if already supported by SDK/UI or bounded future wiring.
- Date/availability copy hardening.

Out of scope:

- Booking.
- Payment.
- Reservation.
- Inventory authority.

Review gates:

- Requirements Review.
- Architecture Review.
- Runtime Governance Review.
- Frontend Review.
- Canon Review.

### 13.5 RF / Partner / VIP Offer Journey Assembly

Goal:

- Assemble RF catalog, partner, offer, voucher and VIP premium preview journey without payment/payout/wallet overstatement.

Scope:

- RF catalog/detail/offers/my-vouchers navigation.
- VIP premium preview explanation.
- Listing-scoped RF offer bridge from Rielt.
- Voucher lifecycle display boundaries.

Out of scope:

- Payout, cashback, settlement.
- Financial wallet.
- Entitlement grant without owner-backed runtime.
- Path B.

Review gates:

- Architecture Review.
- Runtime Governance Review.
- Security/Fraud Review if claim/entitlement surfaces are touched.
- Frontend Review.
- Canon Review.

### 13.6 PRO Operational Journey Assembly

Goal:

- Assemble PRO role, partner contribution and RF/Quest intersections as beta operational workspace.

Scope:

- `/rf/pro` workspace.
- PRO linked partners and attributed vouchers.
- Deferred operation route boundaries.
- PRO access fallback copy.
- Quest PRO intersection map.

Out of scope:

- Settlement/payout.
- Ownership proof.
- Full verification authority.
- PRO support case automation.

Review gates:

- Requirements Review.
- Architecture Review.
- Runtime Governance Review.
- Frontend Review.
- Canon Review.

### 13.7 Space / Profile Social Journey Boundary Pass

Goal:

- Classify Space/profile/feed/community journey edges and prevent social/mock content from becoming proof or reward authority.

Scope:

- Public Space/profile/community route map.
- Saved/activity/deferred surfaces.
- Social activity boundaries against Connect/Points claims.

Out of scope:

- New social economy.
- Leaderboard/XP activation.
- Mock posts as proof.

Review gates:

- Requirements Review.
- Frontend Review.
- Runtime Governance Review if activity projections are touched.
- Canon Review.

### 13.8 Internal Support / Admin Diagnostics Journey Assembly

Goal:

- Assemble an internal-only operator path from projection metadata to support lookup and admin diagnostics owner fact pointers.

Scope:

- Points projection metadata -> support lookup -> admin diagnostics snapshot.
- Admin/service allowlist and visibility boundaries.
- Operator copy and future UI requirements.

Out of scope:

- Customer-facing diagnostics.
- Customer proof.
- Immutable audit ledger.
- Automatic support resolution.

Review gates:

- Architecture Review.
- Runtime Governance Review.
- Security/Fraud Review.
- Canon Review.

### 13.9 Stage 13 Runtime Smoke / Closure Review

Goal:

- Validate assembled journeys after bounded implementation slices are complete.

Scope:

- Route smoke.
- Protected/public route checks.
- Projection/proof vocabulary review.
- Mock/Path B guardrails.
- Closure report.

Out of scope:

- Public launch approval.
- New runtime expansion.

Review gates:

- Plan Review.
- Runtime Governance Review.
- QA Review.
- Canon Review.

## 8. Recommended Next Slice

Recommended next slice:

```text
Stage 13.1 — Visitor / Registered User Entry Assembly
```

Reason:

- It is the safest first implementation slice after the planning map.
- It fixes the most visible journey blocker: Home registration CTA mismatch with actual `/sign-up` route.
- It creates the entry foundation for later Connect, Quest, Rielt, RF, VIP and PRO slices.
- It can be bounded to PWA navigation/copy and should not require API, SDK, database or runtime changes.

Required guardrails for 13.1:

- No new reward, wallet, booking, proof or Path B semantics.
- No new mock/projection authority.
- No API/schema/SDK/database changes unless a later approved slice explicitly allows them.
- `public_launch_implied = false`.

## 9. Validation

Planning-only validation status:

- Code changes: none.
- API changes: none.
- SDK changes: none.
- Database/schema changes: none.
- Runtime behavior changes: none.
- New mock/proof/authority semantics: none.
- Path B activation: none.

Validation performed for this slice:

- Required context capsules read.
- Stage 12I closure report read.
- Relevant PWA routes/navigation/module entry points inspected.
- Relevant Quest/Rielt/RF/Points runtime surfaces inspected.
- Multi-agent review perspectives applied.

No tests or typecheck are required for Stage 13.0 because this slice only creates a planning/report artifact. `git diff --check` should be run after creating this report to validate whitespace.

## 10. Final Verdict

Stage 13.0 is complete when this report is committed as the planning artifact for User Journey Assembly.

Verdict:

```text
Stage 13.0 is COMPLETE_AS_USER_JOURNEY_ASSEMBLY_PLAN_AND_SLICE_MAP.
```

Stage 12I invariants remain preserved. Stage 13 can proceed with `Stage 13.1 — Visitor / Registered User Entry Assembly` as the recommended next bounded slice.
