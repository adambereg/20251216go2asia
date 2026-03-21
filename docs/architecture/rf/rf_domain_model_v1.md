# RF Service — Domain Model v1

**Project:** Go2Asia  
**Domain:** Russian Friendly / RF  
**Document role:** SSOT domain model for `rf-service`  
**Status:** Draft v1  
**Purpose:** Define the canonical RF domain boundary, entities, relationships, invariants, and lifecycle rules before OpenAPI and implementation.

---

## 1. Purpose

This document defines the canonical domain model for `rf-service` in Go2Asia.

`rf-service` is the partner/business presence layer of the ecosystem.  
It is not only a catalog and not only a voucher feature.

RF exists to model:

- business partner identity;
- business presence in geography through branches;
- business lines and operational segmentation;
- partner verification/trust status;
- PRO-linked onboarding relationships;
- offers and vouchers;
- user / PRO / business interaction surfaces around partner activity.

This document is intentionally aligned with:

- Cross-Domain ownership rules;
- Atlas as canonical geo substrate;
- Pulse as event and attendance truth;
- Quest as progression/proof layer;
- Guru as aggregation/discovery layer;
- Space as social/distribution layer;
- current roadmap constraints for Step 10.

---

## 2. Architectural Role of RF

RF is the **partner/business presence domain** of Go2Asia.

In product terms, RF turns the ecosystem from content-only into a real multi-sided practical layer by introducing:

- partner onboarding;
- branch-aware local business presence;
- structured offers;
- voucher lifecycle;
- PRO-mediated partner relationships.

RF is the domain where business participation becomes operational.

### 2.1 RF is

RF is:

- the owner of partner identity inside the ecosystem;
- the owner of branch-level business presence;
- the owner of offers and voucher lifecycle;
- the owner of partner ↔ PRO operational linkage;
- the trust/moderation layer for partner participation.

### 2.2 RF is not

RF is not:

- the owner of canonical geography;
- the owner of event lifecycle;
- the owner of quest progression;
- the owner of property/listing truth;
- the owner of social publication;
- the owner of balances or on-chain token logic.

Those remain in other domains:

- Atlas owns geographic identity and place truth. 
- Pulse owns event identity, schedule, registration, and attendance truth. 
- Quest owns progression/proof logic only. 
- Rielt owns listing/property logic. 
- Space owns the social publication/distribution layer (circulation), not partner truth. 
- Points remains economic source of truth; Step 10 must stay points-only and exclude G2A/NFT/on-chain. 

---

## 3. Domain Boundary

### 3.1 What `rf-service` owns

`rf-service` owns:

- business partner profile;
- partner representative / owner linkage;
- partner verification and moderation state;
- partner business lines;
- partner branches;
- branch ↔ business line assignment;
- branch publication state;
- branch geo/business presence rules;
- partner ↔ PRO onboarding relationship;
- offers;
- vouchers;
- voucher issuance / claim / redeem / status tracking;
- business-facing, PRO-facing, and user-facing RF workflows.

This is explicitly consistent with the Cross-Domain note, where RF owns business presence and voucher flows, while other domains retain their own source truth. 

### 3.2 What `rf-service` does not own

`rf-service` must not absorb:

- Atlas place records;
- Pulse event records or attendance state;
- Quest definitions or completion truth;
- Rielt listings/inquiries;
- Space posts or groups;
- balances, token wallets, NFT mechanics, on-chain settlement;
- generic geo-service logic;
- full marketplace checkout/order domain.

### 3.3 Step-10 scope boundary

For Step 10, RF should be implemented as a **partial marketplace / partner hub**, not as a universal commerce platform.  
The roadmap requires:

- partner profile;
- locations;
- owner account;
- PRO onboarding link;
- offers/vouchers;
- create/claim/redeem/status tracking;
- user / PRO / business surfaces;
- integration with Space / Quest / Guru / Points;
- no G2A / NFT / on-chain. 

---

## 4. Core Domain Concepts

## 4.1 Partner vs place

A partner is not the same thing as a place.

One partner may:

- operate in multiple cities/countries;
- have multiple branches;
- have multiple business lines;
- occupy multiple commercial units inside one host complex.

One branch may:

- map to one Atlas place;
- exist inside a larger host/container place;
- expose multiple business lines.

This distinction is mandatory in RF. 

## 4.2 RF as business presence layer

RF models business presence separately from geography.

Atlas answers:
- where is this place?

RF answers:
- which partner operates here?
- what business line is active here?
- is this partner verified?
- what offers/vouchers are available here?
- which PRO relationship exists around this partner?

This separation is one of the main architectural guardrails of the ecosystem. 

---

## 5. Canonical Entities

The Cross-Domain note already establishes the minimum RF entities:
- `RfBusinessPartner`
- `RfPartnerRepresentative`
- `RfPartnerBusinessLine`
- `RfPartnerBranch`
- `RfPartnerBranchBusinessLine`
- `RfOffer`
- `RfVoucher` 

This SSOT expands them into a production-ready domain model.

---

## 6. Entity Definitions

## 6.1 `RfBusinessPartner`

Represents a legal/commercial participant of the RF ecosystem.

### Purpose
Acts as the top-level business actor that can own multiple business lines, branches, offers, and vouchers.

### Core fields
- `id`
- `slug`
- `display_name`
- `legal_name` (nullable)
- `description_short`
- `description_full` (nullable)
- `status`
- `verification_status`
- `country_id`
- `city_id` (nullable)
- `primary_contact_email` (nullable)
- `primary_contact_phone` (nullable)
- `website_url` (nullable)
- `telegram_url` (nullable)
- `created_at`
- `updated_at`
- `published_at` (nullable)

### Status direction
- `draft`
- `pending_review`
- `active`
- `suspended`
- `archived`

### Verification direction
- `unverified`
- `pending`
- `verified`
- `rejected`

### Notes
Partner is the business identity root inside RF.  
Partner status and verification status must remain separate.

---

## 6.2 `RfPartnerRepresentative`

Represents a person/account linked to a partner for ownership, management, or operations.

### Purpose
Connects partner operations with actual user/account responsibility.

### Core fields
- `id`
- `partner_id`
- `user_id`
- `role`
- `status`
- `is_primary`
- `invited_at`
- `accepted_at` (nullable)
- `created_at`
- `updated_at`

### Role direction
- `owner`
- `manager`
- `operator`

### Status direction
- `invited`
- `active`
- `revoked`

### Notes
This entity supports Step 10 requirement for owner account and business surface. 

---

## 6.3 `RfPartnerBusinessLine`

Represents a business activity category operated by the partner.

Examples:
- restaurant
- spa
- coworking
- tour desk
- clinic
- property agency
- hotel restaurant
- transfer service

### Purpose
Allows one partner to operate multiple business directions under one umbrella.

### Core fields
- `id`
- `partner_id`
- `code`
- `title`
- `description` (nullable)
- `status`
- `created_at`
- `updated_at`

### Status direction
- `active`
- `inactive`

### Notes
Business line is partner-owned, but exposed at branch level through assignment.

---

## 6.4 `RfPartnerBranch`

Represents a concrete operational business presence in geography.

This is one of the most important RF entities.

### Purpose
Models a branch/location where the partner actually operates and where users may visit, claim vouchers, redeem offers, attend business-hosted activities, or use the branch in quests/discovery flows.

### Core fields
- `id`
- `partner_id`
- `slug`
- `display_name`
- `status`
- `publication_status`
- `verification_status`
- `country_id`
- `city_id`
- `district_id` (nullable)
- `atlas_place_id` (nullable)
- `host_atlas_place_id` (nullable)
- `coordinates` (nullable)
- `address_text` (nullable, compatibility/read-support only)
- `unit` (nullable)
- `floor` (nullable)
- `zone` (nullable)
- `landmark_note` (nullable)
- `contact_phone` (nullable)
- `contact_email` (nullable)
- `opening_hours_note` (nullable)
- `created_at`
- `updated_at`
- `published_at` (nullable)

### Status direction
Operational lifecycle:
- `draft`
- `pending_review`
- `active`
- `inactive`
- `archived`

### Publication direction
- `hidden`
- `published`

### Verification direction
- `unverified`
- `pending`
- `verified`
- `rejected`

### Why branch is required
Branch is required because partner identity and place identity are not the same thing.  
One partner can operate multiple commercial points, including inside malls, resorts, markets, and condo complexes. 

---

## 6.5 `RfPartnerBranchBusinessLine`

Assignment entity connecting a branch to one or more business lines.

### Purpose
Allows branch-level specialization without duplicating partner business lines.

### Core fields
- `id`
- `branch_id`
- `partner_business_line_id`
- `status`
- `created_at`

### Status direction
- `active`
- `inactive`

### Notes
This allows one branch to expose:
- restaurant + bar
- spa + wellness
- agency + consulting
- coworking + cafe

---

## 6.6 `RfPartnerProLink`

Represents an operational relationship between a partner and a PRO actor.

### Purpose
Supports PRO-mediated onboarding, management, and future PRO Console workflows.

### Why this entity exists
The roadmap explicitly requires a PRO onboarding link in Step 10, and Step 13 later connects PRO Console and RF workflows. 

### Core fields
- `id`
- `partner_id`
- `pro_user_id`
- `status`
- `role_scope`
- `note` (nullable)
- `started_at`
- `ended_at` (nullable)
- `created_at`
- `updated_at`

### Status direction
- `pending`
- `active`
- `paused`
- `ended`

### Role scope direction
- `onboarding`
- `curation`
- `promotion`
- `moderation_support`
- `account_support`

### Notes
This is not a referral tree entity and not tokenomics logic.  
It is an operational relationship inside RF.

---

## 6.7 `RfOffer`

Represents a partner-defined commercial or promotional offer.

Examples:
- discount
- bonus
- welcome offer
- special menu
- event-related special
- limited-time package
- PRO-mediated promo

### Purpose
Creates the commercial layer from which voucher issuance may derive.

### Core fields
- `id`
- `partner_id`
- `branch_id` (nullable)
- `title`
- `description`
- `offer_type`
- `status`
- `visibility`
- `starts_at` (nullable)
- `ends_at` (nullable)
- `related_pulse_event_id` (nullable)
- `created_by_user_id`
- `created_at`
- `updated_at`
- `published_at` (nullable)

### Type direction
- `discount`
- `bundle`
- `gift`
- `access`
- `campaign`
- `event_related`

### Status direction
- `draft`
- `active`
- `expired`
- `paused`
- `archived`

### Visibility direction
- `public`
- `pro_only`
- `invite_only`

### Notes
RF owns offer creation.  
A Pulse event may be related to an offer, but Pulse does not own the offer or voucher lifecycle. 

---

## 6.8 `RfVoucher`

Represents a claimable/redeemable voucher created from an offer.

### Purpose
Acts as the core execution artifact for user claim/redeem flows.

### Core fields
- `id`
- `offer_id`
- `partner_id`
- `branch_id` (nullable)
- `issued_to_user_id`
- `status`
- `code`
- `issued_at`
- `claimed_at` (nullable)
- `redeemed_at` (nullable)
- `expires_at` (nullable)
- `redeemed_by_user_id` (nullable)
- `related_pulse_event_id` (nullable)
- `quest_eligibility_context` (nullable JSON/reference)
- `created_at`
- `updated_at`

### Status direction
- `issued`
- `claimed`
- `redeemed`
- `expired`
- `cancelled`

### Notes
RF explicitly owns:
- offer creation
- voucher issuance
- claim
- redeem
- voucher status. :contentReference[oaicite:15]{index=15}

Quest and Pulse may reference vouchers, but must not become source truth for voucher lifecycle. 

---

## 7. Optional Supporting Entities

These are allowed as part of the RF domain model even if initial implementation is phased.

## 7.1 `RfPartnerVerificationCase`
Tracks review / moderation / document verification.

## 7.2 `RfVoucherRedemptionLog`
Tracks operational redeem audit trail.

## 7.3 `RfBranchMediaRef`
References media assets without owning binaries.

## 7.4 `RfPartnerTag`
Supports lightweight categorization for discovery.

These supporting entities are useful, but they must not blur ownership boundaries.

---

## 8. Branch → Atlas Relationship Rules

A published RF branch must reference Atlas geography using one of the canonical patterns defined in the Cross-Domain note. 

## 8.1 Pattern A — standalone place
`branch -> atlas_place_id`

Use when the branch corresponds to a specific independent place.

Examples:
- cafe
- clinic
- standalone restaurant
- coworking
- shop

## 8.2 Pattern B — inside host/container place
`branch -> host_atlas_place_id`
plus optional local positioning:
- `unit`
- `floor`
- `zone`
- `landmark_note`

Use when the business is inside:
- shopping mall
- hotel complex
- market
- resort
- condo complex
- mixed-use building

## 8.3 Pattern C — mature dual reference
A branch may eventually support:
- `atlas_place_id`
- `host_atlas_place_id`

This is useful when a branch is both:
- a meaningful place of its own,
- and located inside a larger container.

### Domain rule
At least one canonical geo anchor must exist for a published branch:
- `atlas_place_id`, or
- `host_atlas_place_id`, or
- approved normalized geo fallback during transitional compatibility mode.

This is required to preserve Atlas as the canonical geo substrate. 

---

## 9. Container / Host Scenarios

Container/host scenarios are first-class in Go2Asia and must be modeled early. 

### 9.1 Shopping mall
- Atlas place = mall
- RF branch = coffee shop / salon / kiosk inside mall
- Pulse event = popup or performance inside mall
- Quest = visit mall event + visit branch
- Guru = show mall + branch + event intelligently

### 9.2 Hotel / resort complex
- Atlas place = resort/hotel complex
- RF branches = spa / beach club / tour desk / restaurant
- Pulse = resort activity event
- Quest = resort route
- Guru = nearby composition

### 9.3 Condo / residential project
- Atlas place = condo/project
- RF = developer / agency / management partner
- Rielt = listings/property truth
- Pulse = open house / investment meetup
- Quest = promotional route

### 9.4 Market / walking street
- Atlas place = market/street container
- RF branches = stalls/vendors/shops
- Pulse = local show / market event
- Quest = food/discovery route

These are not “edge cases”; they are normal Southeast Asia scenarios and must shape the RF model from the start. 

---

## 10. Offer and Voucher Model

## 10.1 Offer principles

An offer is the commercial/promotional proposition.
A voucher is the user-level execution artifact derived from that proposition.

### Domain rule
Do not collapse offer and voucher into one entity.

Offer answers:
- what is available?

Voucher answers:
- what has been issued/claimed/redeemed by whom?

## 10.2 Voucher lifecycle

The minimum RF voucher lifecycle is:

1. offer exists;
2. voucher is issued or made claimable;
3. user claims voucher;
4. voucher is redeemed at eligible context;
5. voucher status changes accordingly.

This is directly required by Step 10 and Cross-Domain ownership rules. 

## 10.3 Voucher scope

A voucher may be tied to:
- a partner,
- a branch,
- an event-related offer,
- a quest eligibility condition.

But ownership remains in RF.

## 10.4 Voucher status invariants

- redeemed voucher cannot return to claimed;
- expired voucher cannot be redeemed;
- cancelled voucher cannot be claimed;
- claim/redeem audit trail must be preserved.

---

## 11. Event-Related RF Scenarios

These scenarios must preserve clear ownership separation.

## 11.1 Business-hosted event
A business partner may host an event.

Ownership remains:
- event → Pulse
- partner/branch → RF
- venue place → Atlas
- proof/reward relation → Quest
- discovery → Guru 

## 11.2 Event-related offer
An offer may be related to a Pulse event.

This does not make Pulse the owner of offers or vouchers.

## 11.3 Event voucher
A voucher may be issued in relation to an event.

Domain rule:
- RF owns voucher lifecycle;
- Pulse owns event lifecycle. 

## 11.4 Event inside branch inside host place
Valid scenario:
- event in coffee shop;
- coffee shop is RF branch;
- coffee shop is inside mall;
- mall is Atlas container place. :contentReference[oaicite:24]{index=24}

This scenario must be considered normal, not exceptional.

---

## 12. RF and Quest Interaction

Quest may use RF entities as targets or conditions, but RF remains source truth for its own artifacts. 

## 12.1 Allowed Quest references
Quest may reference:
- RF branch
- voucher usage
- partner visit
- branch visit
- claim eligibility
- redeem eligibility

## 12.2 Forbidden ownership drift
Quest must not become source truth for:
- partner branch identity
- voucher lifecycle
- claim/redeem status

## 12.3 RF-compatible quest scenarios
Examples:
- visit verified branch
- claim partner voucher after step completion
- unlock voucher eligibility after route completion
- redeem voucher after attendance proof

---

## 13. RF and Space Interaction

Space may socially circulate RF objects, but must not absorb partner truth. 

## 13.1 Allowed Space patterns
- repost partner page/object
- share branch/event-related promo
- create commentary around RF objects
- publish campaign announcement through Space APIs

## 13.2 Forbidden pattern
Do not let Space become owner of:
- partner profile truth
- branch truth
- offer truth
- voucher truth

---

## 14. RF and Guru Interaction

Guru is a read/composition layer only.

Guru may aggregate:
- branch cards
- partner cards
- offer-aware nearby results
- event-related branch discovery

But Guru must not own RF source truth. 

---

## 15. RF and Rielt Interaction

Many Rielt actors are RF-compatible business actors:
- developers
- agencies
- property managers
- hospitality operators
- rental operators. :contentReference[oaicite:28]{index=28}

### Domain rule
RF may provide:
- partner layer,
- trust layer,
- onboarding,
- promotions/vouchers,
- PRO-mediated relationship.

But Rielt retains:
- listing state,
- inquiry flow,
- property data,
- real-estate workflows. 

---

## 16. User / PRO / Business Surface Logic

Step 10 explicitly requires three RF surface flows:
- user,
- PRO,
- business. 

## 16.1 User surface
User interacts with:
- partners
- branches
- offers
- vouchers
- claim/redeem visibility
- partner discovery context

## 16.2 PRO surface
PRO interacts with:
- partner onboarding
- partner support relationship
- campaign support
- branch moderation/curation assistance
- future PRO Console operational tasks

## 16.3 Business surface
Business interacts with:
- partner profile
- representative access
- branch management
- business lines
- offer creation
- voucher operations
- verification state
- moderation responses

---

## 17. Domain Invariants

The following rules are mandatory.

### 17.1 Partner invariants
- partner must exist before branch can exist;
- partner may exist in draft before publication;
- suspended partner cannot publish new offers or branches.

### 17.2 Branch invariants
- branch must belong to exactly one partner;
- published branch must have canonical geo anchor;
- archived branch cannot accept new redeem operations;
- branch verification is separate from partner verification.

### 17.3 Business line invariants
- business line belongs to one partner;
- branch business line assignment must reference partner-owned business line.

### 17.4 Offer invariants
- offer must belong to one partner;
- branch-level offer may optionally target one branch;
- expired/archived offer cannot produce new active vouchers.

### 17.5 Voucher invariants
- voucher belongs to one offer and one user context;
- redeemed voucher is terminal;
- expired voucher is terminal unless explicitly restored through admin operation;
- redeem must be auditable.

### 17.6 PRO-link invariants
- partner may have zero or more historical PRO links;
- only explicitly active links count operationally;
- PRO link must not be treated as token/reward balance logic.

---

## 18. Read Model Direction

The canonical write model remains normalized around partner, branch, offer, voucher.

Read models may later project:
- partner card;
- branch card;
- offer card;
- voucher wallet item;
- PRO partner queue item;
- Guru-friendly nearby branch projection.

These are read-model conveniences only.  
They do not redefine the domain ownership model.

---

## 19. Non-Goals for v1

This v1 domain model intentionally does **not** introduce:

- full ecommerce order/cart/checkout;
- wallet balances;
- on-chain voucher/token settlement;
- NFT-gated partner logic;
- global geo-service abstraction;
- separate graph database;
- direct social ownership inside RF;
- property/listing ownership inside RF;
- event attendance ownership inside RF.

This is required by the roadmap and Step 10 constraints. 

---

## 20. Final Domain Formula

The shortest correct formula for RF is:

> **RF is the partner/business presence and voucher lifecycle domain of Go2Asia.**  
> It owns partners, branches, business lines, PRO-linked partner operations, offers, and vouchers.  
> It references Atlas for geography, Pulse for events, Quest for progression context, Guru for aggregation, Space for circulation, and Points for external economics.

---

## 21. Most Important Conclusion

RF must be implemented neither as:
- a flat partner catalog,
- nor as a fake marketplace shell,
- nor as an extension of Pulse/Quest/Space.

RF must be implemented as a real bounded context with strong branch semantics, Atlas-linked geo discipline, explicit voucher ownership, and clean cross-domain boundaries.

That is the correct domain baseline for Step 10 and for the wider SSOT workstream.