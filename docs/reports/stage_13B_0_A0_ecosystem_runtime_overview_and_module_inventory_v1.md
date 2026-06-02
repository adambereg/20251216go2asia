# Stage 13B.0-A0 - Ecosystem Runtime Overview & Module Inventory (v1)

Date: 2026-05-27  
Execution mode: read-only ecosystem runtime overview / inventory  
Lead agent: AI Program Director / Orchestrator  
Supporting agents activated: Product Analyst, Runtime Governance Architect, Technical Canon Writer, Delivery Planner, Frontend Developer in read-only runtime inspection mode  
Review gates: Architecture Review, Runtime Governance Review, Product Reality Alignment Review, Canon Review  
Implementation drift: none intended; this report is the only deliverable artifact for this stage.

## 1. Executive Summary

Go2Asia is currently a real PWA runtime with multiple surfaced modules, not a pure concept. The strongest runtime reality is the content/discovery and journey-continuity shell: Atlas, Blog, Pulse, Guru, Quest, Rielt, RF, Space and Connect all have visible routes or route clusters. Stage 13 assembled many route loops and semantic guardrails, especially around Connect projections, Quest completion handoff, Rielt inquiry-only semantics, RF voucher boundaries and Space social/profile visibility.

The ecosystem is not yet a fully mature Object -> Interaction -> Socialization -> Projection -> Retention system. The Object and Projection parts are comparatively stronger: objects are visible, pages exist, and Connect/Space/RF/Rielt/Quest use careful projection-safe copy. The weak part is the middle of the philosophy: Interaction -> Socialization. Many surfaces still provide browsing, filters, local saves, navigation and previews, but do not consistently provide runtime-backed like, repost, save, discuss, share-to-space, thread, review or reaction loops.

The most important baseline conclusion is that Go2Asia now has route-level ecosystem cohesion, but not yet uniform interaction-spine cohesion. The next Stage 13B.0 detailed audits should focus first on modules whose value depends on object-bound interaction and propagation: Space as the social spine, RF as voucher/business utility, Rielt as inquiry lifecycle, Quest as experience/proof lifecycle, and Connect as projection governance.

## 2. Ecosystem Runtime Overview

### Current Runtime Shape

Current runtime presents Go2Asia as a modular PWA ecosystem with these active or visible clusters:

- Public discovery/content: Atlas, Blog, Pulse, Guru.
- Business and utility: RF public catalog/offers/vouchers, merchant/pro workspaces, Rielt listing/search/inquiry.
- Experience: Quest catalog/detail/run/complete and PRO quest workspace.
- Social/profile: Space dashboard/feed/community/posts/saved/activity/profile surfaces, with several deferred pages intentionally framed.
- Economy/progression projection: authenticated Connect dashboard/activity/wallet alias/levels/referrals/missions/analytics.
- Internal support: admin points diagnostics.

The runtime appears cohesive at route-continuity level because Stage 13 added safe handoffs:

- Quest -> Connect activity/levels -> Quest.
- Rielt listing -> inquiry -> my inquiries -> RF listing voucher -> listing/inquiries.
- RF partner/offer -> my vouchers -> Connect activity.
- Profile -> Space -> saved/activity -> Connect.
- Connect dashboard -> Quest/Profile/Space/referrals/levels.

The runtime is less cohesive at action-propagation level. A user can move between modules, but a user action on an object does not consistently become a Space/social event, a reaction, a discussion thread, or a Connect projection.

### Strengths

- Clear canonical boundaries are now visible in UI copy and reports: projection != authority, preview != grant, inquiry != booking, RF voucher != receipt/payment proof, Quest completion != reward grant.
- Atlas/Blog/Pulse/Guru provide real discovery surfaces and cross-link potential.
- Quest has a real run lifecycle with progress, step proof submission, review states and Connect handoff.
- Rielt has a real inquiry-only route loop and submit flow.
- RF has visible catalog, offers, voucher surfaces, local planning saves and partner/pro/merchant route clusters.
- Connect is correctly framed as read-only projection, not wallet/accounting/settlement authority.
- Space has multiple runtime routes and visible feed/profile/community/saved surfaces.

### Main Maturity Gaps

- Interaction primitives are inconsistent across modules.
- Space is not yet consistently used as the universal share/discuss/repost layer from all object surfaces.
- Social propagation is present in concept and some feed/repost display code, but not uniformly available as object-level CTAs.
- Economy projection exists, but reward production, spendability, referral unlock and network accrual remain partial or target policy.
- Several surfaces are intentionally deferred or local-only, especially Space deferred pages, RF local saved vouchers, Pulse save TODO/local state, and Rielt local save.
- Guru is strong as nearby aggregation but thin as an action surface.

## 3. Canonical Ecosystem Runtime Map

Primary runtime canon for this stage:

- `docs/architecture/platform/go2asia_ecosystem_overview_v2.md`
- `docs/economy/README.md`
- `docs/economy/points_policy_v1.md`
- `docs/economy/referral_network_rewards_policy_v1.md`
- Current PWA runtime surfaces under `apps/go2asia-pwa-shell`
- Stage 13 / 13A reports

Historical/context-only documents:

- `docs/knowledge/**`
- legacy `docs/overview/**` sections that still describe Connect Service, G2A/NFT, payout, cashback, on-chain wallet, partner settlement or broad tokenomics as current runtime.

Canonical boundaries confirmed for this inventory:

- Connect is a projection surface only; it is not wallet, accounting authority or settlement authority.
- Quest completion and Quest complete UI are not reward grants.
- RF voucher claim/redeem is not payment proof, cashback, receipt or settlement.
- RF/PRO attribution is not payout.
- Rielt inquiry is not booking, reservation, inventory proof or payment.
- Space is the socialization/discussion/repost layer; not business, identity, economy or moderation authority.
- VIP is entitlement/spend-access context, not a role, payout layer or financial entitlement.

## 4. Module Inventory Matrix

| Module | Core Object | Runtime Exists | User Action Exists | Socialization | Economy Hook | Cross-links | Runtime Maturity |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Atlas | country, city, district, place, guide | Yes | Search/navigation, tabs, object open; reviews route exists for places | Mostly weak; ratings/reviews are concept/docs, not uniform spine | Mostly conceptual via places/quests/reviews | Strong to Pulse/Guru/Quest/RF/Rielt/Blog | Medium |
| Pulse | event | Yes | Calendar modes, filters, event open, register, save local/TODO, share, ICS download | Partial; UGC/reports block exists, but discussion/share-to-Space not uniform | Event registration can be Points source in policy/runtime reports | Links to Atlas locations; concept links to Space/Guru/Connect | Medium |
| Blog | article/post | Yes | Search, filters, view mode, load more, article open | Weak; Blog is curated surface, Space lift-up is conceptual/partial | Conceptual author/activity value | Links conceptually to Atlas/Pulse/RF/Quest/Space | Medium-Low |
| Guru | nearby entity card | Yes | Geolocation, radius/type/time filters, sort, map/list select, deeplink open | Missing/weak; no direct object reaction spine | Displays reward hints for quests; no authority | Hard aggregation from Atlas/Pulse/RF/Rielt/Quest/PRO | Medium |
| Rielt | listing, inquiry | Yes | Search, filters, listing detail, inquiry submit, local save, native share, RF voucher handoff | Partial via inquiry/contact request; no broad Space discussion spine | RF voucher adjacency; no booking/payment | Hard to RF and Connect; weak to Atlas/Guru | Medium-High for inquiry-only |
| RF | partner, offer, voucher | Yes | Catalog/filter/open, voucher/offers view, local save, my vouchers, map/favorites, merchant/pro routes | Partial; reviews deferred, Space social propagation not complete | RF paid voucher spend exists behind feature flag; Connect activity projection | Hard to Rielt and Connect; concept to Quest/Space/Guru | Medium-High |
| Quest | quest, step, progress, submission | Yes | Start route, step proof, geo/QR/photo/text/Space-post proof fields, refresh, submit, completion notice | Partial; Space-post proof supported, but broader report/repost loop is not uniform | Quest completion can grant Points where backend-backed; Connect projection handoff | Hard to Connect; concept/hard to Atlas/RF/Pulse/Guru | High for run lifecycle, Medium for social/economy |
| Space | post, feed item, profile, group, saved item | Yes | Feed/profile/community/posts/saved/activity routes; saved reactions; route links; some feed repost display | Strongest candidate, but uneven; many deferred surfaces | Connect projections only; no reward authority | Links to Connect, Profile, Quest/Rielt/RF/Pulse/Atlas via activity/reference resolvers | Medium |
| Connect | projection dashboard, activity, levels, referrals | Yes, authenticated | Navigate dashboard/activity/levels/referrals, diagnostics for admin | Indirect via next steps to Space | Strong projection; Points/referrals/badges shown read-only | Hard to Quest/RF/Space/Profile; projections only | High for projection, Low as action owner |
| Points | ledger, balance, transaction | Yes as backend/projection; UI via Connect | UI view only; no direct user action except related module flows | None directly | Owner of internal Points ledger and badges | Connect projection, Quest/RF/referral sources | Medium for current runtime, gaps in spend locks |
| Referrals | code/tree/activation/locked points | Yes partial | Connect referrals view; invite flow/projection | Weak; growth mechanic, not social discussion | `referral_locked` active; unlock/accrual target only | Connect, VIP entitlement future dependency | Medium-Low |
| VIP entitlement | active spend-access period | Policy/current auth guard context; runtime lifecycle incomplete | VIP preview/guard copy; entitlement not fully active as source of truth | None | Primary spend-access unlock target | RF/Points/Referral/Connect | Low-Medium |
| Badges | off-chain achievement | Yes projection in Connect/Space | View only | Social recognition, not full social loop | Points Service owns badge awards | Connect levels, Space/profile | Medium-Low |

## 5. Ecosystem Layer Map

| Layer | Runtime Surfaces | Maturity | Notes |
| --- | --- | --- | --- |
| Content / Discovery | Atlas, Blog, Pulse | Mature enough for browsing; uneven interactions | Strongest for public object discovery. Needs object-level social actions. |
| Geo / Nearby | Guru, Atlas geo maps, Rielt/RF/Pulse/Quest geo links | Partially mature | Guru has real nearby/what-to-do aggregation, map/list, filters and partial failure display. It is not yet an interaction hub. |
| Social | Space, saved/activity/profile/community/feed, repost display | Partially implemented | Space exists, but universal share/discuss/repost entry from all modules is not yet complete. |
| Business / Commerce | RF, Rielt | Medium | RF and Rielt have real route loops. Boundaries are safe. Commerce is intentionally not payment/settlement/booking. |
| Experience | Quest | Medium-High | Quest has real run/proof/progress lifecycle. Needs stronger Space/report and object propagation. |
| Economy / Progression | Connect, Points, Referrals, Badges, VIP policy | Projection mature, execution partial | Connect projection is strong; policy enforcement gaps remain for locked Points, VIP entitlement source of truth, referral unlock/accrual. |
| Identity / Trust | Clerk auth, Profile, Space profile, PRO/RF/admin gates | Medium | Auth and route gates exist. VIP is not a role; profile visibility is not identity proof. Trust labels are mostly projection/status. |

Mostly decorative or future-only layers:

- Full tokenomics / G2A / on-chain / NFT wallet.
- Mature Missions Service.
- AI/recommendation layer.
- Full Geo Service as canonical platform service beyond current aggregation.
- Full social graph/follow/friends authority.

## 6. Interaction Spine Analysis

### Spine Primitives Status

| Primitive | Runtime Status | Notes |
| --- | --- | --- |
| like | Conceptual/partial | Reactions are canon, but not consistently surfaced on object pages. |
| repost | Partial | Space feed displays repost references; universal object -> Space repost CTA is not yet uniform. |
| save/bookmark | Partial | Rielt local save, RF local planning save, Pulse save state/TODO, Space saved reactions. Persistence and semantics vary. |
| discuss | Weak | Object-bound discussion is mostly expected through Space/reposts/threads, but many object pages lack direct discuss/share-to-Space actions. |
| share-to-space | Mostly missing | Native browser share exists in Rielt/Pulse, but not canonical Space repost creation across modules. |
| thread/discussion | Partial | Rielt inquiry/contact request is runtime-backed; Quest review state exists; general object threads are not uniformly exposed. |
| review/reaction loops | Partial/deferred | RF reviews route is deferred; Atlas/Pulse review concepts exist; Space can carry social content but not universalized. |

### Isolated or Weakly Propagating Modules

- Atlas is rich in objects and cross-link targets, but most actions are navigation/search rather than runtime-backed social propagation.
- Blog is a strong content surface but weakly connected to Space as a live interaction producer.
- Guru aggregates objects but does not generate durable activity or social events.
- Pulse has event registration and local save/share, but event-to-Space discussion/report loop is not consistently runtime-backed.
- Connect intentionally does not create social actions; it projects owner facts from other services.

### Where Activity Generation Is Weak

- Object pages often lack a standard action row: save, repost to Space, discuss, short review, question/contact request.
- Some actions are local-only or UI-only, so they do not generate ecosystem activity.
- Connect activity projections rely on backend events, but many module-level interactions do not yet produce such events.
- Space does not yet act as the default propagation target for every module object.

### Connect Projection Linkage Gaps

- Connect is correctly read-only, but projection coverage depends on upstream event maturity.
- Quest and RF have explicit Connect handoffs.
- Rielt has Connect adjacency mostly through RF/Points concepts, not direct authoritative lifecycle.
- Space has Connect handoff, but social activity -> Points projection is not fully evidenced across all social primitives.
- Atlas/Blog/Pulse projections are largely conceptual or limited.

## 7. Cross-Module Runtime Connectivity

### Hard Links

- Quest -> Connect activity/levels: explicit UI handoff.
- Rielt -> RF listing voucher flow: explicit route and return path.
- Rielt -> inquiries: inquiry submission and visibility route.
- RF -> Connect activity: explicit continuity from voucher/offer surfaces.
- Connect -> Quest/Profile/Space/referrals/levels: dashboard next steps.
- Guru -> domain deeplinks: nearby cards carry deeplink actions into source modules.
- Pulse -> Atlas: event detail links to country/city/place where atlas links exist.

### Weak Links

- Atlas -> Space: documented concept, weak direct runtime action.
- Pulse -> Space: UGC/reports concept, not uniform event discussion surface.
- Blog -> Space: curated-from-Space concept, weak live sharing/repost action.
- Space -> Points: concept/projection linkage, but reward authority intentionally absent and not uniformly evidenced.
- Atlas -> Guru/Quest/RF/Rielt: content/geo links exist, but action propagation is weak.

### Conceptual-Only or Future Links

- Missions across modules.
- Full AI/recommendation layer.
- G2A/NFT/on-chain token flows.
- Referral unlock/network accrual beyond active `referral_locked`.
- VIP entitlement lifecycle as authoritative 30-day spend-access source.
- Full Blog curation pipeline from Space.

### Missing / High-Value Links

- Universal object -> Space repost/discuss.
- Universal object -> save/bookmark semantics with consistent ownership.
- Atlas/Pulse/Blog -> Connect activity through real interaction events.
- Guru -> activity generation beyond deeplink navigation.
- RF partner/reviews -> Space social proof loop.
- Quest completion -> Space report/post loop as a first-class guided action.

## 8. Runtime Reality vs Conceptual Vision

### Matches Vision

- The ecosystem is modular and route-visible.
- Object discovery exists across content, nearby, business, housing and quest layers.
- Connect is now aligned with projection-only canon in visible copy.
- Quest run lifecycle exists and preserves reward-boundary semantics.
- Rielt inquiry-only flow exists and avoids booking/payment semantics.
- RF voucher/offer flow exists and avoids receipt/settlement semantics.
- Space exists as social/profile/feed/community layer and is increasingly connected to Profile/Connect.

### Mostly Conceptual or Partially Realized

- Object -> Interaction -> Socialization is not uniformly realized.
- Space as universal discussion/repost layer is only partial.
- Reactions Service concepts are stronger in docs than in UI availability across modules.
- Missions are canonical as future orchestration but not mature runtime.
- Referral/network rewards beyond locked referral are target policy.
- VIP entitlement is a policy/spend-access concept but not fully enforced as source of truth.
- Economy is visible through projections, but many earn/spend rules are intentionally deferred.

### Mostly Decorative / Deferred

- G2A, NFT wallet, on-chain, token liquidity and external wallet concepts.
- Some Space pages: quests, vouchers, referrals, settings, activity-summary.
- RF reviews route.
- Quest public edit route.
- Some admin/internal diagnostics are visibility/diagnostic surfaces, not customer proof.

## 9. Runtime Readiness Overview

| Module / Layer | Readiness | Reason |
| --- | --- | --- |
| Connect projection | Ready for detailed maturity audit | Strong guardrails and route cluster; needs projection coverage and owner-fact audit. |
| Quest run lifecycle | Ready for detailed lifecycle audit | Real progress/proof/review states; needs reward handoff/social report audit. |
| Rielt inquiry | Ready for detailed lifecycle audit | Real inquiry submit/visibility loop; bounded semantics. |
| RF voucher/offer | Ready for detailed interaction/economy audit | Real public and local voucher flows; needs lifecycle/deep social audit. |
| Space | Ready for socialization audit | Many surfaces exist, but core social spine maturity needs focused review. |
| Guru | Ready for integration audit | Aggregation is real; action/event generation is thin. |
| Atlas/Pulse/Blog | Ready for content-to-social audit | Runtime exists; interaction maturity uneven. |
| Points/Referrals/VIP/Badges | Ready for economy/projection audit | Policy is strong; implementation gaps are explicitly known. |

## 10. Priority Map for Detailed Audits

### P0 - Interaction Spine / Socialization

1. Space social spine audit
   - Validate actual create/repost/save/feed/profile/community flows.
   - Determine canonical object discussion pattern.
   - Define current vs missing share-to-Space coverage.

2. Cross-module object action audit
   - Atlas, Pulse, Blog, RF, Rielt, Quest, Guru object pages.
   - Inventory like/repost/save/discuss/share/thread/review availability.
   - Identify which actions are runtime-backed, local-only, TODO, deferred or conceptual.

### P1 - Business / Experience Lifecycle

3. RF voucher lifecycle and social proof audit
   - Claim/local save/my vouchers/server voucher boundaries.
   - Review/deferred surface maturity.
   - RF -> Space -> Connect propagation.

4. Rielt inquiry lifecycle audit
   - Inquiry states, idempotency, auth, return paths, local save/share.
   - Ensure inquiry does not drift into booking/payment/inventory proof.

5. Quest lifecycle and reward handoff audit
   - Start/progress/proof/review/complete states.
   - Quest completion vs Points/badge projection.
   - Space-post proof/report loop maturity.

### P2 - Economy / Projection

6. Connect projection and owner-fact audit
   - Confirm which displayed values are owner-backed.
   - Audit RF/Quest/Space/Referral/Badge projections.
   - Check copy and metadata consistency.

7. Points / Referral / VIP entitlement audit
   - Locked points enforcement gap.
   - Referral unlock/network accrual producer status.
   - VIP entitlement source of truth and spend-access enforcement.

### P3 - Discovery Layer Integration

8. Guru integration audit
   - Source active/stub behavior.
   - Deeplink completeness.
   - Nearby aggregation vs activity generation.

9. Atlas / Pulse / Blog content-to-social audit
   - Object page actions.
   - Blog-from-Space and Space-to-Blog reality.
   - Pulse reports/discussion maturity.

## 11. Blocking Ecosystem Gaps

No blocker prevents starting Stage 13B.0 detailed audits. The blocking gaps for ecosystem maturity, not for this overview stage, are:

- No uniform Interaction Spine contract visible across modules.
- No standard object action model for save/repost/discuss/review/thread across Atlas/Pulse/Blog/RF/Rielt/Quest/Guru.
- Space is not yet fully established as the default social propagation target.
- Connect projection coverage depends on uneven upstream event generation.
- VIP entitlement and locked Points enforcement remain incomplete as runtime invariants.
- Several social/economy surfaces are route-visible but deferred/local-only.

## 12. Review Gate Results

### Architecture Review

Status: pass for overview baseline, needs detailed module audits.  
The report preserves module boundaries and does not promote future layers into runtime truth. RF/Rielt/Quest/Connect/Space boundaries remain aligned with platform v2 canon.

### Runtime Governance Review

Status: pass for inventory, detailed lifecycle audits required.  
The key governance issue is not a discovered authority violation, but uneven projection and action ownership across modules. Connect remains projection-only. Rielt inquiry, RF voucher and Quest completion boundaries remain safe.

### Product Reality Alignment Review

Status: pass with major maturity gap.  
The product reality is coherent as a navigable ecosystem, but not yet as a fully socialized interaction ecosystem. The next work should focus on practical runtime behavior, not more conceptual alignment.

### Canon Review

Status: aligned with caveats.  
Platform/economy canon supersedes older knowledge/overview docs. Historical docs contain outdated Connect-as-service, tokenomics, NFT/G2A, cashback/payout/commission and broader VIP semantics. They must remain historical context only unless updated through separate canon work.

## 13. Recommended Next Slice

Recommended next slice:

`Stage 13B.0-A1 - Interaction Spine Runtime Audit`

Scope:

- Audit actual runtime availability of like, repost, save, discuss, share-to-space, thread/contact request and review primitives.
- Cover Atlas, Pulse, Blog, Guru, RF, Rielt, Quest and Space.
- Classify every action as runtime-backed, local-only, UI-only, deferred, conceptual or missing.
- Identify one canonical object-social handoff pattern before any implementation slice.

Why this slice next:

- It directly addresses the largest ecosystem gap found in A0.
- It provides the contract needed before improving Space, RF, Quest, Rielt or Connect projection loops.
- It keeps Stage 13B.0 practical and prevents drifting into implementation or broad product redesign.

## 14. Acceptance Criteria Status

| Criterion | Status |
| --- | --- |
| Ecosystem runtime overview formed | Met |
| Inventory of key modules | Met |
| Interaction maturity gaps captured | Met |
| Cross-module linkage gaps captured | Met |
| Interaction Spine status defined | Met |
| Isolated modules identified | Met |
| Priority order for detailed audits defined | Met |
| Runtime reality vs conceptual architecture captured | Met |
| No implementation drift | Met |
| Read-only analytical scope preserved | Met |

Final status: `stage_13B_0_A0_status: COMPLETE_AS_RUNTIME_OVERVIEW_AND_MODULE_INVENTORY_BASELINE`
