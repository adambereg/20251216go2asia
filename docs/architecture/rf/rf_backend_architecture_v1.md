# RF Service — Backend Architecture v1

**Project:** Go2Asia  
**Domain:** Russian Friendly / RF  
**Document role:** SSOT backend architecture for `rf-service`  
**Status:** Draft v1  
**Purpose:** Define service boundary, internal structure, write/read responsibilities, storage model direction, integration rules, and implementation constraints for `rf-service`.

---

## 1. Purpose

This document defines the backend architecture baseline for `rf-service`.

`rf-service` is the canonical backend bounded context for:

- RF business partner identity;
- partner representative / owner linkage;
- business lines;
- partner branches;
- partner ↔ PRO operational links;
- offers;
- vouchers;
- verification/moderation state around partner participation.

This document translates the RF domain model and OpenAPI outline into service-level backend architecture.

It does **not** define production rollout details such as deployment topology, scaling phases, observability matrix, worker split, or hardening plan in full depth. Those belong to `rf_service_production_architecture_v1.md`.

---

## 2. Architectural Role of `rf-service`

`rf-service` is the **system of record** for RF domain objects.

It exists to provide one stable backend owner for:

- who the partner is;
- who may manage the partner;
- where the partner operates via branches;
- which business lines exist;
- which offers are active;
- which vouchers were issued, claimed, redeemed, expired, or cancelled;
- which PRO relationships are operationally linked to the partner.

This service must not drift into becoming:

- a geography service;
- an event service;
- a quest engine;
- a social feed service;
- a real-estate service;
- a wallet/token service;
- a universal marketplace order service.

---

## 3. Service Boundary

## 3.1 What `rf-service` owns

`rf-service` owns the write model and source of truth for:

- `RfBusinessPartner`
- `RfPartnerRepresentative`
- `RfPartnerBusinessLine`
- `RfPartnerBranch`
- `RfPartnerBranchBusinessLine`
- `RfPartnerProLink`
- `RfOffer`
- `RfVoucher`
- verification/moderation case records
- voucher operation logs / redemption logs
- partner/branch publication and verification state

---

## 3.2 What `rf-service` reads but does not own

`rf-service` may read or validate external references to:

- Atlas geography IDs and place IDs
- Pulse event IDs
- user/account identity from auth/user domain
- Points or reward-side callbacks/events only as external integration
- Space / Guru / Quest references where needed for projections or orchestration

These are external references, not owned entities.

---

## 3.3 What `rf-service` must never own

`rf-service` must never become source of truth for:

- countries / cities / districts / places
- event schedule / event attendance
- quest definitions / progression / proof state
- social posts / groups / comments
- listings / inquiries / property inventory
- token balances / wallets / NFT inventory / on-chain bridge state
- payments / checkout / order settlement

---

## 4. Architectural Style

`rf-service` should be implemented as a modular service with:

- clear application layer;
- explicit domain layer;
- repository/data access layer;
- API controllers or route handlers;
- integration adapters for other services;
- event emission points for downstream consumers.

The preferred architectural style is:

- bounded context first;
- modular monolith service implementation for initial phase;
- extraction-safe internals;
- no shared mutable ownership with neighboring domains.

This means:

- one service owns RF writes;
- no direct table writes from other services;
- external systems consume RF through API/projections/events.

---

## 5. Core Backend Responsibilities

The backend responsibilities of `rf-service` are:

1. create/update/archive partner entities;
2. manage representative permissions and ownership linkage;
3. manage business lines and branch assignment;
4. manage branch geo-linked operational presence;
5. manage PRO link workflows;
6. create/update/publish/archive offers;
7. issue/claim/redeem/cancel/expire vouchers;
8. enforce moderation and verification gates;
9. expose public, business, PRO, moderator, and internal projections;
10. emit RF-domain integration signals without leaking ownership.

---

## 6. Internal Module Structure

Recommended internal structure:

- `domain/`
- `application/`
- `infrastructure/`
- `interfaces/http/`
- `interfaces/internal/`
- `integrations/`
- `read-models/`
- `events/`
- `validation/`
- `shared/`

A more concrete service layout could be:

- `modules/partners`
- `modules/representatives`
- `modules/business-lines`
- `modules/branches`
- `modules/pro-links`
- `modules/offers`
- `modules/vouchers`
- `modules/moderation`
- `modules/public-read`
- `modules/internal-projections`

This modular split is preferred over a flat “controllers + services + models” directory.

---

## 7. Layer Responsibilities

## 7.1 Domain layer

Contains:

- entity definitions;
- aggregate boundaries;
- invariants;
- lifecycle rules;
- value objects;
- domain services where needed.

Examples:
- partner publication rule
- branch geo anchor rule
- voucher terminal state rule
- representative role constraints
- duplicate active PRO link prevention

The domain layer must not depend on HTTP or transport DTOs.

---

## 7.2 Application layer

Contains use cases and orchestration logic.

Examples:
- create partner draft
- submit partner for review
- create branch
- publish branch
- accept PRO link
- create offer
- claim voucher
- redeem voucher
- verify partner
- suspend partner

This layer coordinates:
- authorization preconditions
- repository access
- external reference validation
- event emission
- transaction boundaries

---

## 7.3 Infrastructure layer

Contains:

- ORM/data mapping
- repository implementations
- persistence schemas
- queue/event adapters
- clock/id/hash helpers
- outbound service clients
- storage of audit and moderation records

---

## 7.4 Interface layer

Contains:

- HTTP handlers/controllers
- OpenAPI request/response binding
- auth context parsing
- transport validation
- internal service endpoints

This layer must stay thin.

---

## 8. Aggregate Direction

Recommended aggregate direction for RF v1:

### `Partner` aggregate
Owns:
- partner root
- business lines
- representatives as controlled children or associated records
- publication and verification state at partner level

### `Branch` aggregate
Owns:
- branch root
- branch ↔ business line assignments
- branch publication/verification state

### `Offer` aggregate
Owns:
- offer root
- offer lifecycle state

### `Voucher` aggregate
Owns:
- issued/claimed/redeemed/cancelled/expired lifecycle
- redemption audit trail linkage

### `ProLink` aggregate
Owns:
- PRO relationship state transitions

Moderation cases may be modeled either:
- as separate aggregate roots, or
- as bounded support records tied to partner/branch lifecycle.

The key rule is to keep aggregates small enough for transactional correctness.

---

## 9. Write Model Principles

## 9.1 Single writer rule

Only `rf-service` may mutate RF-owned records.

No other service should write directly to RF tables.

---

## 9.2 Explicit lifecycle transitions

State changes must be represented by explicit application actions, not arbitrary field patching.

Examples:
- submit for review
- publish
- archive
- verify
- reject
- suspend
- activate offer
- pause offer
- claim voucher
- redeem voucher
- cancel voucher

---

## 9.3 Transaction discipline

A single RF mutation should commit within one local database transaction where possible.

Examples:
- create voucher + log issuance
- redeem voucher + log redemption
- accept PRO link + update status timestamps
- publish partner + set publish timestamps

Cross-domain updates must not be done as distributed write transactions.

---

## 10. Read Model Principles

`rf-service` should support separate read projections for:

- public partner cards
- public branch cards
- public offer cards
- user voucher wallet view
- business dashboard views
- PRO queue views
- moderator verification queue
- internal service projections

The write model stays normalized.  
Read models may be denormalized for performance and surface ergonomics.

---

## 11. Storage Model Direction

The persistence layer should use relational storage as the primary system of record.

Recommended high-level tables:

- `rf_business_partners`
- `rf_partner_representatives`
- `rf_partner_business_lines`
- `rf_partner_branches`
- `rf_partner_branch_business_lines`
- `rf_partner_pro_links`
- `rf_offers`
- `rf_vouchers`
- `rf_partner_verification_cases`
- `rf_branch_verification_cases`
- `rf_voucher_operation_logs`

Optional later read tables/materializations:

- `rf_public_partner_cards`
- `rf_public_branch_cards`
- `rf_public_offer_cards`
- `rf_user_voucher_wallet_items`
- `rf_moderation_queue_items`
- `rf_pro_partner_queue_items`

---

## 12. Table-Level Intent

## 12.1 `rf_business_partners`

Stores canonical partner root.

Core concerns:
- identity
- status
- verification status
- publish timestamps
- primary geography anchor at partner level if needed
- contact metadata

---

## 12.2 `rf_partner_representatives`

Stores user-account linkage to partner.

Core concerns:
- role
- invitation/activation lifecycle
- primary representative flag
- access revocation

---

## 12.3 `rf_partner_business_lines`

Stores business lines under partner ownership.

Core concerns:
- code/title/description
- active/inactive status

---

## 12.4 `rf_partner_branches`

Stores operational branch records.

Core concerns:
- partner linkage
- geo references
- place/host-place references
- publication and verification status
- local positioning inside host/container place
- operational contact data

---

## 12.5 `rf_partner_branch_business_lines`

Stores many-to-many assignment between branch and business line.

Core concerns:
- active/inactive assignment
- no duplicate active mapping

---

## 12.6 `rf_partner_pro_links`

Stores PRO operational relationships.

Core concerns:
- partner linkage
- PRO user linkage
- lifecycle status
- role scope
- started/ended timestamps

---

## 12.7 `rf_offers`

Stores offer definitions.

Core concerns:
- partner linkage
- optional branch linkage
- lifecycle state
- visibility
- optional related Pulse event reference
- time window

---

## 12.8 `rf_vouchers`

Stores voucher lifecycle artifacts.

Core concerns:
- offer linkage
- partner linkage
- optional branch linkage
- issued-to user
- status
- voucher code
- issue/claim/redeem/expiry timestamps
- optional event/quest context linkage

---

## 12.9 `rf_*_verification_cases`

Stores moderation workflow support.

Core concerns:
- entity reference
- reviewer
- state
- reason notes
- evidence/document refs
- created/resolved timestamps

---

## 12.10 `rf_voucher_operation_logs`

Stores auditability for voucher lifecycle.

Core concerns:
- voucher ID
- operation type
- actor type / actor ID
- branch context
- timestamps
- notes / metadata

---

## 13. External Reference Strategy

RF must reference external domains by stable IDs only.

Examples:

- `countryId`
- `cityId`
- `districtId`
- `atlasPlaceId`
- `hostAtlasPlaceId`
- `relatedPulseEventId`
- `userId`
- `proUserId`

RF should not copy full external entities into its write model.

It may cache or project selected display fields in read models if necessary, but ownership remains external.

---

## 14. Atlas Integration Boundary

Atlas is the source of truth for geographic identity and place truth.

`rf-service` may:

- store Atlas IDs;
- validate that referenced place IDs exist;
- expose those IDs in RF responses;
- derive public projections enriched with Atlas display fields through read composition if needed.

`rf-service` must not:

- create or mutate Atlas places;
- store its own parallel place truth as canonical;
- become a geo resolver for the platform.

### Backend implication

Branch create/update flows should validate geo references through:
- synchronous internal API lookup, or
- cached Atlas projection table, or
- prevalidated reference service abstraction.

The validation mechanism may evolve, but ownership must remain with Atlas.

---

## 15. Branch Geo Architecture Rules

A published branch must have a canonical geo anchor.

Accepted patterns:

### Pattern A — standalone place
- `atlasPlaceId` present

### Pattern B — host/container place
- `hostAtlasPlaceId` present
- optional local positioning fields such as `unit`, `floor`, `zone`, `landmarkNote`

### Pattern C — dual reference
- both `atlasPlaceId` and `hostAtlasPlaceId` present

During transitional compatibility, branch may temporarily retain raw address text, but publication should still require normalized geo anchoring or an approved fallback strategy.

### Backend implication

Branch write validators must enforce:
- no publish without geo anchor;
- no invalid place/host place combination;
- no partner branch activation if referenced geo anchor is invalid or missing.

---

## 16. Pulse Integration Boundary

Pulse owns event truth.

`rf-service` may:

- store optional `relatedPulseEventId` on offers or vouchers;
- expose event-linked RF offers;
- participate in event-related voucher scenarios.

`rf-service` must not:
- own event schedule;
- own attendance state;
- own event lifecycle.

### Backend implication

Do not denormalize Pulse event lifecycle fields into RF write tables as owned state.

Any event enrichment belongs in read composition or internal projections.

---

## 17. Quest Integration Boundary

Quest owns progression and completion truth.

`rf-service` may:
- hold lightweight voucher eligibility context;
- validate redemption rules with quest-aware inputs if contractually defined;
- emit events when a voucher is claimed or redeemed.

`rf-service` must not:
- store quest completion as RF truth;
- become a quest rules engine;
- duplicate progression state.

### Backend implication

Quest-related conditions should be represented as:
- external validation checks,
- opaque eligibility context references,
- or integration adapters.

They should not mutate the RF ownership model.

---

## 18. Space Integration Boundary

Space owns the social publication/distribution layer (circulation).

`rf-service` may:
- expose partner/branch/offer objects that Space may share;
- emit partner campaign events for downstream publication flows.

`rf-service` must not:
- own posts/comments/groups;
- store social circulation state as domain truth.

### Backend implication

If social amplification exists, it should be event-driven or API-driven through adapters, not embedded in RF aggregates.

---

## 19. Guru Integration Boundary

Guru is a read/composition layer.

`rf-service` may:
- expose public/internal projections consumed by Guru;
- provide nearby-eligible branch/offer projections.

`rf-service` must not:
- become a nearby aggregation engine;
- own ranking or recommendation logic.

### Backend implication

Provide narrow projection endpoints or event-fed read models, not generalized search orchestration.

---

## 20. Rielt Integration Boundary

Rielt owns real-estate listing and inquiry truth.

`rf-service` may:
- model developer/agency/property-management actors as partners;
- store partner trust/verification and business presence;
- support vouchers/promotions for Rielt-related partners.

`rf-service` must not:
- store listing inventory as RF truth;
- own inquiry lifecycle;
- own property records.

### Backend implication

Use stable partner/branch references between Rielt and RF, but keep separate bounded contexts and write stores.

---

## 21. Auth and Identity Dependency

`rf-service` depends on external auth/user identity for:

- current authenticated actor
- user IDs for representatives
- PRO user IDs
- issued-to user IDs on vouchers
- moderator/admin identity in audit trails

RF should treat user identity as an external principal, not as a locally owned user table.

Minimal local persistence is acceptable only for cached display hints if needed, never as identity source of truth.

---

## 22. Authorization Model in Backend

Authorization should be enforced in the application layer via explicit policy checks.

Recommended policy dimensions:

- actor type
- role on partner
- partner ownership/representative linkage
- moderator/admin privilege
- PRO linkage to partner
- voucher operation scope
- branch/offer/partner status gates

Examples:
- only owner can add another representative with owner/manager authority
- only representative/admin can mutate partner-owned business lines
- only allowed operational actor can redeem voucher
- only moderator/admin can verify or suspend partner

Do not rely solely on route-level coarse auth.

---

## 23. Voucher Architecture

Voucher lifecycle is one of the most critical RF backend responsibilities.

### Voucher flow phases
1. offer exists
2. voucher is issued or claim is triggered
3. voucher becomes user-linked
4. voucher is redeemed, cancelled, or expires
5. operation is logged

### Required backend properties
- voucher code uniqueness
- terminal states are enforced
- redemption is idempotency-safe
- claim/redeem operations are auditable
- expiry handling is consistent
- branch and partner context are preserved

### Backend recommendation
Voucher logic should live in a dedicated module/service inside RF, not be spread across offer/business handlers.

---

## 24. Offer Architecture

Offer management should remain distinct from voucher execution.

Offer backend responsibilities:
- create/update/activate/pause/archive
- validate time windows
- validate branch ownership
- validate partner permissions
- expose public or restricted visibility

Offer backend should not:
- directly represent every claimed instance
- collapse into voucher table behavior

---

## 25. Moderation and Verification Architecture

RF moderation is not optional.

Recommended moderation backend capabilities:

- queue pending partner reviews
- queue pending branch reviews
- record reviewer action
- store reason notes
- support verify/reject/suspend flows
- keep audit timestamps
- separate verification state from publication state

### Important distinction

Verification state answers:
- was this entity trusted/validated?

Publication state answers:
- is this entity publicly visible/operationally exposed?

These states should not be collapsed into a single boolean.

---

## 26. Event and Outbox Direction

RF should emit domain events for downstream consumers.

Suggested event families:

- `rf.partner.created`
- `rf.partner.submitted_for_review`
- `rf.partner.verified`
- `rf.partner.suspended`
- `rf.branch.created`
- `rf.branch.published`
- `rf.pro_link.created`
- `rf.pro_link.accepted`
- `rf.offer.activated`
- `rf.voucher.claimed`
- `rf.voucher.redeemed`
- `rf.voucher.cancelled`
- `rf.voucher.expired`

### Architectural recommendation

Use transactional outbox pattern or equivalent reliable delivery mechanism rather than direct in-transaction cross-service calls.

This keeps RF extraction-safe and reduces coupling.

---

## 27. Synchronous vs Asynchronous Interactions

## 27.1 Synchronous usage

Use synchronous calls for:
- auth/identity resolution
- geo reference validation where required
- request-time permission checks
- internal projection fetches when cheap and bounded

## 27.2 Asynchronous usage

Use async/event-driven flow for:
- social amplification side effects
- reward/points processing
- analytics
- search/read model refresh
- cache invalidation
- downstream notifications

Do not make core RF write success depend on optional downstream systems.

---

## 28. Idempotency and Concurrency

Certain RF operations must be concurrency-safe.

Critical examples:
- voucher claim
- voucher redeem
- representative invitation acceptance
- PRO link accept/end
- publish/verify transitions
- offer activation/pause

Recommended controls:
- optimistic locking or version fields where appropriate
- unique constraints
- idempotency keys for selected mutation endpoints
- transactionally consistent status checks

Voucher redeem in particular must guard against double redemption under concurrent requests.

---

## 29. Validation Strategy

Validation should occur at multiple layers.

### Transport validation
- shape
- required fields
- enum membership
- basic formatting

### Application validation
- actor permission
- referenced partner/branch existence
- ownership matching
- lifecycle transition legality
- external reference validity

### Domain validation
- invariant enforcement
- terminal state restrictions
- aggregate consistency rules

Do not place all validation in controller layer.

---

## 30. Read Projection Strategy

RF should support internal read projections that are purpose-built.

Recommended projection types:

### Public projections
- lightweight partner card
- lightweight branch card
- lightweight offer card

### Business projections
- partner management detail
- branch management detail
- voucher operations dashboard
- representative list

### PRO projections
- linked partner queue
- onboarding status items

### Moderator projections
- verification queue
- suspension candidates
- flagged voucher anomalies

### Internal projections
- partner minimal projection
- branch minimal projection
- voucher minimal projection

The projection strategy should allow later extraction into separate read processes without breaking contracts.

---

## 31. Search and Filtering Direction

RF should support structured filtering in-service.

Allowed in-service filtering:
- partner status
- verification status
- country/city/district
- partner ID
- branch ID
- business line code
- offer type
- visibility
- voucher status

RF should avoid building a broad fuzzy global search engine inside the service.

If richer search is needed later, it should rely on dedicated search projections or platform-wide search infrastructure.

---

## 32. Caching Direction

Caching may be used for read-heavy projections, but never as source of truth.

Safe cache candidates:
- public partner list pages
- public branch cards
- public offer lists
- internal minimal projections
- geo display enrichment reads

Unsafe cache ownership:
- voucher status truth
- partner representative permissions
- redemption authorization truth

Voucher and permission decisions should read authoritative state.

---

## 33. Migration and Compatibility Rules

RF backend should be designed for staged rollout.

### Early compatibility allowances
- raw address text may coexist with canonical geo IDs temporarily
- minimal internal projections may be thin at first
- some read projections may be computed on request before denormalized rollout

### Hard non-negotiables
- RF remains single writer for RF-owned state
- Atlas remains geo source of truth
- Pulse remains event source of truth
- Rielt remains listing source of truth
- no on-chain/token balance logic in Step 10 baseline

---

## 34. Error Handling Direction

Backend should expose stable RF-specific error codes.

Examples:
- `RF_PARTNER_NOT_FOUND`
- `RF_BRANCH_NOT_FOUND`
- `RF_OFFER_NOT_FOUND`
- `RF_VOUCHER_NOT_FOUND`
- `RF_BRANCH_GEO_REQUIRED`
- `RF_INVALID_GEO_REFERENCE`
- `RF_VOUCHER_ALREADY_REDEEMED`
- `RF_VOUCHER_EXPIRED`
- `RF_PARTNER_FORBIDDEN`
- `RF_MODERATION_REQUIRED`

Internally, error categories should distinguish:
- validation errors
- authorization errors
- lifecycle/invariant errors
- not found errors
- external dependency validation errors
- infrastructure failures

---

## 35. Observability Hooks at Backend Level

Detailed production observability belongs to the production architecture doc, but backend design should already include structured emit points for:

- mutation audit logs
- voucher operations
- moderation actions
- permission denials
- external validation failures
- event emission failures

This allows future production hardening without redesigning core flows.

---

## 36. Extraction-Safe Design Rules

Even if RF starts as one service in a monorepo, its backend architecture must remain extraction-safe.

Required properties:
- clear module boundaries
- no direct table sharing with neighboring domains
- APIs/events for external access
- thin adapters for external dependencies
- no leakage of Atlas/Pulse/Rielt state into RF write ownership
- no business logic hidden in UI layer

This is essential because RF is a likely future candidate for richer operational growth.

---

## 37. Recommended First Backend Implementation Cut

The minimum viable backend cut for Step 10 should include:

### Core write modules
- partners
- representatives
- business lines
- branches
- pro-links
- offers
- vouchers
- moderation

### Required read surfaces
- public partners
- public branches
- public offers
- current user vouchers
- business partner detail
- business branch detail
- business voucher operations
- PRO links list
- moderator queue basics
- internal partner/branch/voucher projections

### Required integration basics
- auth principal resolution
- Atlas reference validation
- outbox/event emission scaffold
- audit logging for voucher and moderation operations

---

## 38. What Must Stay Out of `rf-service`

To prevent scope drift, keep these out:

- shopping cart/order/payment modules
- point ledger or token ledger
- on-chain redemption
- NFT gating
- full recommendation engine
- social publishing workflows
- generic place management
- event attendance registry
- real-estate listing engine
- platform-wide search

These may interact with RF, but they are not RF backend responsibilities.

---

## 39. Final Backend Formula

The shortest correct backend formula is:

> `rf-service` is the backend system of record for partner/business presence, branch management, PRO operational links, offers, vouchers, and moderation.  
> It owns RF writes, exposes RF read projections, references neighboring domains by stable IDs, and remains extraction-safe by refusing shared ownership.

---

## 40. Most Important Conclusion

The correct backend implementation of RF is not a “partner catalog API” and not a “voucher add-on”.

It is a proper bounded backend context that:

- owns partner and branch truth;
- enforces Atlas-linked geo discipline;
- keeps offer and voucher lifecycles explicit;
- separates write model from read projections;
- integrates with Pulse / Quest / Space / Guru / Rielt only through clean boundaries;
- avoids becoming a god-service.

That is the correct backend baseline for `rf-service`.