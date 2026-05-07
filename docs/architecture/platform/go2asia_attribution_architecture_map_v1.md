# Go2Asia Attribution Architecture Map v1

**Status:** architecture map / documentation only.
**Placement:** platform-level canon companion under `docs/architecture/platform/`.
**Related RF canon:** `docs/architecture/rf/rf_attribution_canon_refinement_v1.md`.
**Non-scope:** migrations, services, SDK, OpenAPI, frontend, backend, DB schema, event bus, analytics pipelines, centralized attribution service, unified referral database, payouts, commissions, Points, G2A, NFT, or reward calculations.

This document maps attribution surfaces across Go2Asia after the RF Stage 5.0 attribution baseline and canon refinement. It is strategic and bounded-context-aware: it defines how attribution should be understood across the ecosystem without creating a universal runtime engine before the domains prove their durable actions.

---

## 1. Why Attribution Matters for Go2Asia

Go2Asia is not a single funnel. It is an ecosystem where users can discover places, offers, listings, quests, posts, guides, partner services, creator content and future AI recommendations before performing durable actions.

Attribution matters because it answers factual questions:

- how did a user reach a durable action;
- which public share, recommendation or navigation context influenced that action;
- which internal domain object now carries the durable attribution fact;
- which future economy or reporting surfaces can read that fact without rewriting it.

Without a shared attribution canon, each module may invent its own referral rules, identifiers and mutation policies. That would make future economy, PRO reporting, creator programs and campaign analysis inconsistent before they become useful.

---

## 2. Attribution as a Factual Layer

Attribution is a factual provenance layer, not an economy layer.

It should:

- preserve the origin context of a durable action;
- create auditability;
- provide stable read-only facts to projections and future economy services;
- keep user-facing attribution explainable;
- avoid coupling modules through a premature shared runtime.

It should not decide value, calculate rewards or mutate the source domain after the fact.

---

## 3. Ecosystem-wide Attribution Principles

1. **Shared canon first, shared runtime later.** The ecosystem needs a shared vocabulary and invariants before any shared attribution service.
2. **Domain-owned durable actions are the source of truth.** Each module owns attribution for the durable objects it owns.
3. **Transient signals propose; servers confirm.** URLs, share codes, AI context and browser state are provisional until a domain action succeeds.
4. **First successful durable action wins.** Normal product flows must not rewrite attribution after the durable object exists.
5. **Public identity stays separate from internal identity.** Public links use `shareCode`, slugs or campaign codes, not auth-provider IDs.
6. **Attribution is versioned.** Strategy and source semantics must be interpretable years later.
7. **Economy consumes facts; it does not own capture.** Points/G2A/NFT/reward logic reads confirmed facts through bounded contracts.
8. **Privacy and explainability are requirements.** Attribution metadata must be small, bounded and non-PII by default.

---

## 4. Durable vs Transient Attribution

Transient attribution signals:

- public `shareCode`;
- module-specific slug or campaign code;
- QR payload;
- URL query keys;
- `sessionStorage` pre-action state;
- referrer host;
- saved content;
- internal navigation;
- AI recommendation handoff context;
- UI surface such as RF catalog, Rielt listing, Quest step, Space post or guide CTA.

Durable attribution facts:

- confirmed domain-owned object or event;
- attribution version and strategy;
- resolved internal attribution target;
- source and status;
- confirmation timestamp;
- bounded metadata and optional rejection reason.

Rule:

> Transient signals can suggest attribution. Only the owning domain can confirm durable attribution when its durable action succeeds.

---

## 5. Immutable Attribution Events

An attribution event becomes immutable when the domain's durable object/action is successfully created or confirmed.

Examples:

- RF voucher claim creates or returns an `rf_voucher`;
- Rielt inquiry/contact request is accepted by `rielt-service`;
- Quest progress/completion/proof is recorded by `quest-service`;
- Space post/repost/group membership is recorded by `space-service`;
- content/guide CTA or event registration is recorded by the owning content/event layer.

After that point, normal navigation, retry, replay, login completion, another share link or another PRO/creator/campaign signal must not rewrite the attribution. Corrections, if ever allowed, require explicit admin/debug tooling and an audit trail.

---

## 6. Attribution Surfaces by Module

| Module / surface | Durable object/action | Possible attribution | Maturity | Economy relevance |
| --- | --- | --- | --- | --- |
| **RF Asia** | `rf_voucher` claim; later redemption facts | PRO share, partner offer link, Rielt listing offer context, internal navigation | Durable voucher attribution implemented; PRO read-only visibility added | High future relevance; dangerous to monetize before immutable facts exist |
| **Rielt Market** | Listing creation; requester inquiry/create/list flow; future contact handoff | Listing share, PRO/agent share, RF offer context, AI recommendation, internal search | Partial domain implementation, attribution conceptual | Medium/high; do not merge with RF voucher attribution |
| **Quest Asia** | `quest_progress`, `quest_submission`, completion/proof lifecycle | Quest share, PRO-created quest, guide route, QR, place/event/partner step context | Domain model exists; attribution conceptual | High for future rewards, but dangerous before proof/completion canon is stable |
| **Space Asia** | `space_post`, `repost`, group join/membership, profile/social surfaces | Creator share, repost chain, community invite, content share, internal feed | Partial social runtime; attribution conceptual | Medium; avoid turning social attribution into surveillance |
| **Atlas / Guides / Blog** | Place/article/guide read is mostly content; possible future CTA/save/itinerary actions | Guide share, place share, internal discovery, AI recommendation, QR | Content runtime exists; durable attribution mostly conceptual | Low/medium until there are durable actions beyond reads |
| **Pulse / Events** | Event registration exists through content runtime | Event share, guide/event listing, creator/organizer share, AI recommendation | Partial implementation; attribution absent | Medium if event participation later creates rewards |
| **AI Assistant** | Future recommendation handoff, CTA click, itinerary/action handoff | AI recommendation, model/policy version, reason class, user-confirmed handoff | Future/conceptual | High future influence; must stay explainable |
| **Connect** | Read-only dashboard; referrals are owned by referral/points services | Reads RF, Points, Referral, Badges, Missions projections | Implemented as UI/read aggregation | High consumer relevance; must not own attribution capture |
| **Referral Service** | `referral_links`, `referral_relations`, referral claim | Referral code/invite link | Implemented referral graph, separate from attribution canon | High economy relevance; must not be conflated with all attribution |
| **Creator ecosystem** | Future creator post/share/CTA actions | Creator share, public profile, campaign share | Conceptual | Medium/high; needs public identity canon first |
| **Campaigns / partner ecosystem** | Future campaign conversion or partner CTA | Campaign link, QR, partner share, offline code | Conceptual | High but risky; avoid mutable marketing DB |

Maturity levels used here:

- `none`: no known current model;
- `conceptual`: described as possible future surface;
- `partial`: domain runtime exists but attribution is not formalized;
- `implemented`: runtime data/action exists;
- `canonicalized`: canon/design exists for attribution, even if implementation is not started.

---

## 7. RF Attribution

RF is the first concrete attribution anchor because server-side vouchers already exist.

Current durable action:

- successful server voucher claim through RF claim endpoints;
- partner-scoped and listing-scoped voucher claims;
- `rf_voucher` as the durable object.

Current attribution state:

- PRO links exist as `rf_pro_link`; active links validate public `shareCode` transport;
- public RF links can carry `shareCode` while keeping internal PRO/link ids out of URLs;
- RF vouchers store durable attribution fields, and RF exposes a PRO-safe read-only list for confirmed attributed vouchers.

Canonical direction:

- RF owns attribution facts on or beside the voucher;
- public identity should use `shareCode`, not internal Clerk IDs;
- server validates PRO attribution through active `rf_pro_link`;
- attribution is immutable after first successful claim;
- Connect/economy may later read these facts as read-only projections.

---

## 8. Rielt Attribution

Rielt owns listings and requester inquiry flows. It does not own RF offers, vouchers, payments, chat or booking in v1.

Possible durable actions:

- requester inquiry creation;
- future listing contact handoff;
- listing save or viewing request only if later made server-durable.

Possible attribution surfaces:

- listing share;
- PRO or agent share;
- RF voucher context attached to a listing;
- internal search/navigation;
- AI recommendation handoff.

Boundary:

- RF listing-scoped voucher claim remains RF-owned attribution for a voucher;
- Rielt inquiry attribution, if added later, should be Rielt-owned;
- a user can have both RF voucher attribution and Rielt inquiry attribution, but they are not the same fact.

---

## 9. Quest Attribution

Quest owns activity scenarios:

- quests;
- steps;
- progress;
- submissions;
- validation lifecycle;
- completion.

Possible durable actions:

- quest start/progress;
- step proof submission;
- validated completion;
- sponsor-linked quest completion only if explicitly introduced.

Possible attribution surfaces:

- quest share;
- PRO-created quest context;
- guide route;
- QR step;
- place/event/partner step;
- Space social action that links to a quest;
- AI recommendation.

Boundary:

- Quest may reference places, events, partners or posts, but must not own them;
- Points or rewards remain economy/Missions/Points concerns;
- attribution should describe how the user reached or completed the quest, not decide reward value.

---

## 10. Space Attribution

Space owns the social core:

- posts;
- reposts;
- groups;
- group memberships;
- social profile projections;
- publication lifecycle.

Possible durable actions:

- post creation;
- repost;
- group join;
- future follow/community membership if made durable;
- social share CTA leading to another module.

Possible attribution surfaces:

- creator share;
- repost chain;
- group invite;
- content share;
- internal feed discovery;
- AI recommendation.

Boundary:

- Space must not become the owner of referrals, vouchers, quest progress, housing inquiries or AI orchestration;
- social attribution should be explainable and bounded, not an invasive social tracking graph;
- repost context can inform attribution, but should not automatically overwrite domain-owned facts elsewhere.

---

## 11. Atlas / Guides Attribution

Atlas and guides are content/discovery layers. Current runtime content is served through content-service for Atlas/Pulse/Blog style data, and many surfaces are read-oriented.

Possible durable actions:

- future save/bookmark if server-owned;
- guide CTA;
- itinerary add;
- place intent/action handoff;
- event registration for Pulse-like event flows.

Possible attribution surfaces:

- guide share;
- place share;
- QR at place;
- internal discovery;
- creator/editorial recommendation;
- AI assistant recommendation.

Boundary:

- reading a place/article/guide is usually not enough to become a durable attribution fact;
- content attribution should be confirmed only when a durable action exists;
- Atlas remains source of place/geo truth, not a reward or attribution engine.

---

## 12. AI Assistant Attribution

AI may later recommend:

- places;
- offers;
- guides;
- creators;
- routes;
- listings;
- quests;
- partner CTAs.

AI attribution can become important because AI may influence the user's next durable action. However, AI attribution must not become an opaque black box.

Conceptual rules:

- AI recommendations are transient signals until a user performs a durable domain action;
- any durable AI attribution must include an explainable strategy/version;
- store reason classes, not raw private prompts;
- store model/policy version or recommendation policy version when needed for audit;
- do not store embeddings, full chat history, sensitive user context or device fingerprints as attribution metadata;
- AI should not be allowed to rewrite attribution after the durable action exists.

Recommended minimal explainability fields for future AI attribution:

- recommendation surface;
- target module/object;
- reason class, e.g. `nearby`, `saved_interest`, `partner_match`, `quest_progress`, `rf_offer_match`;
- policy/model version;
- handoff timestamp;
- user-confirmed action reference.

---

## 13. Creator and Campaign Attribution

Creator, PRO, partner and campaign attribution share some vocabulary but should not be collapsed into one graph too early.

Possible public identifiers:

- `shareCode`;
- creator slug;
- campaign code;
- partner QR code;
- PRO slug/display handle.

Canonical stance:

- `shareCode` is the best generic public transport identifier;
- `proSlug` or creator slug can be display/routing context;
- campaign codes can exist, but durable facts still belong to the domain action;
- future creator/campaign programs must not mutate historical attribution facts.

The platform should avoid a "unified referral database" that tries to model all of PRO, creator, campaign, invite, AI and partner attribution before the domains stabilize.

---

## 14. Domain Ownership and Bounded Contexts

RF attribution is not Quest attribution. Quest attribution is not Space attribution. Space attribution is not Connect referral graph attribution.

Shared canon means:

- shared vocabulary;
- shared immutability rule;
- shared public/internal identity separation;
- shared versioning and metadata boundaries;
- shared privacy/audit expectations.

Shared canon does not mean:

- shared runtime service;
- shared DB table;
- shared event bus;
- cross-service writes;
- one universal attribution graph.

Domain ownership rule:

> The service that owns the durable object owns the first durable attribution fact for that object.

This preserves microservice boundaries and prevents a future attribution layer from becoming a hidden god-module.

---

## 15. Shared Attribution Vocabulary

Recommended cross-domain vocabulary:

- `shareCode`: public transport identifier;
- `attributionVersion`: schema/strategy version;
- `attributionStrategy`: e.g. `rf_pro_last_touch_before_claim`, future `ai_recommendation_handoff`, `creator_share_last_touch`;
- `attributionSource`: high-level source such as `pro_link`, `direct`, `internal_navigation`, `ai_recommendation`, `creator_share`, `campaign_link`, `unknown`;
- `claimSource` / `actionSource`: product surface where action happened;
- `attributionStatus`: `none`, `confirmed`, `rejected`;
- `confirmedAt`: server confirmation time;
- `capturedAt`: optional transient/client capture time, if accepted under policy;
- `resolvedTarget`: internal attribution target, domain-specific and not exposed as public URL identity;
- `metadata`: bounded non-PII audit context.

Domain-specific vocabulary can extend this, but should not redefine the core meanings.

---

## 16. Economy-facing Attribution

Future economy may read attribution facts for:

- PRO reporting;
- creator reporting;
- campaign eligibility;
- Points or reward intents;
- G2A/NFT future layers;
- partner ecosystem analysis.

Economy must not:

- capture the original domain attribution itself;
- retroactively rewrite attribution;
- infer payouts from unconfirmed transient signals;
- turn ambiguous attribution into financial obligations.

Recommended direction:

- domain-owned facts first;
- read-only projections second;
- economy bridge only after facts are versioned, immutable and auditable.

Connect remains a UI/product hub and read aggregation surface. It may show attribution projections later, but it must not become the backend owner of attribution.

---

## 17. Privacy and Auditability

Privacy boundaries:

- no auth-provider IDs in public links;
- no excessive PII in metadata;
- no device fingerprinting;
- no raw full URLs if they may contain sensitive query values;
- no full AI prompts or private chat history in attribution rows;
- retention policy required before cross-ecosystem analytics.

Auditability boundaries:

- every durable attribution fact should be tied to a durable domain object;
- version and strategy must be visible to internal audit;
- rejected attribution should be explainable;
- corrections require explicit admin/debug audit events;
- projections must not mutate source records.

---

## 18. What Attribution Must NOT Become

Attribution must not become:

- a reward calculator;
- a payout ledger;
- a commission engine;
- an analytics surveillance layer;
- a universal mutable marketing database;
- a cross-domain god-service;
- a replacement for referral-service;
- a replacement for RF, Rielt, Quest, Space or content ownership;
- a warehouse of raw URLs, prompts, fingerprints or invasive tracking identifiers.

The canon exists to keep attribution useful and defensible, not to maximize tracking.

---

## 19. Future Architectural Directions

Recommended sequence:

1. **Shared canon:** keep refining vocabulary, immutability, identity, TTL, metadata and versioning.
2. **Domain-owned attribution facts:** RF first, then only domains with real durable actions.
3. **Read-only projections:** aggregate attribution for PRO dashboards, creator reporting, merchant reporting and Connect views without mutating domain records.
4. **Economy bridge:** consume confirmed facts for eligibility after economy rules are separately approved.
5. **Shared resolver/service only if proven necessary:** introduce shared `shareCode` resolution or attribution search only after repeated domain patterns emerge.
6. **AI-assisted attribution:** keep AI handoffs explainable and versioned; never let AI silently rewrite durable facts.

Explicitly deferred:

- attribution microservice;
- event streaming platform;
- Kafka-style architecture;
- centralized analytics engine;
- unified referral database;
- ecosystem attribution graph as a runtime dependency.

---

## 20. Open Questions

1. Should `shareCode` eventually be resolved by each domain, by identity/profile, or by a small shared resolver?
2. When does a content read become a durable action worth attributing: never, save/bookmark, CTA click, or downstream conversion only?
3. Should Rielt inquiry attribution and RF listing-scoped voucher attribution share a projection, or remain separate facts joined only in analytics?
4. How should referral-service facts (`referral_relations`) relate to future creator/campaign attribution without collapsing them into one model?
5. What is the minimum retention policy before attribution becomes visible in Connect or economy dashboards?
6. What is the acceptable AI explanation payload that supports audit without storing private prompts?
7. Which module should be second after RF for attribution persistence: Rielt inquiry, Quest completion, Space repost/share, or AI handoff?

---

## Stage 5.0B Implementation Marker

RF is now the first implemented durable attribution owner in this map. The implementation remains voucher-only and RF-only: `rf_voucher` stores the durable attribution fact, while `rf_pro_link.share_code` is the scoped public transport for PRO share links.

This marker does not change the map's non-goals: no centralized attribution service, no economy engine, no payout logic and no shared analytics runtime were introduced.

---

## Stage 5.0C Visibility Marker

RF now also exposes a narrow read-only projection for the authenticated PRO: `GET /v1/rf/pro/attributed-vouchers`.

The projection is still RF-owned, confirmed-attribution-only by default, and redacts raw user identity, share code, internal PRO/link ids and attribution metadata. It is not a Connect ownership move, a cross-domain service, a correction workflow or an analytics platform.

---

## Reviewed Sources

- `docs/architecture/platform/README.md`
- `docs/architecture/platform/go2asia_ecosystem_overview_v2.md`
- `docs/architecture/go2asia_ecosystem_current_state_audit_v1.md`
- `docs/architecture/rf/rf_attribution_canon_refinement_v1.md`
- `docs/architecture/rf/rf_pro_attribution_baseline_stage_5_0.md`
- `docs/architecture/rf/rf_pro_linked_partners_baseline_v1.md`
- `docs/architecture/domain/rf-asia-domain-readiness-v1.md`
- `docs/architecture/rielt/rielt_openapi_outline_v1.md`
- `docs/architecture/quest/quest_domain_model_v1.md`
- `docs/architecture/space/space_domain_model_v_1.md`
- `docs/architecture/connect/connect_rf_dashboard_projection_v1.md`
- `docs/audits/connect-referrals-data-source-audit-v1.md`
- `docs/economy/README.md`
- `docs/economy/vouchers/rf_voucher_economy_v1.md`
