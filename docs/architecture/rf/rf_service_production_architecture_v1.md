# RF Service — Service Production Architecture v1

**Project:** Go2Asia  
**Domain:** Russian Friendly / RF  
**Document role:** SSOT production architecture for `rf-service`  
**Status:** Draft v1  
**Purpose:** Define the production-ready service shape, runtime components, deployment expectations, storage/runtime topology, operational hardening rules, rollout phases, and extraction-safe production baseline for `rf-service`.

---

## 1. Purpose

This document defines the production architecture baseline for `rf-service`.

If:

- `rf_domain_model_v1.md` defines **what RF is**,
- `rf_openapi_outline_v1.md` defines **how RF is exposed**,
- `rf_backend_architecture_v1.md` defines **how RF is structured internally**,
- `rf_dependency_map_v1.md` defines **how RF relates to the rest of the ecosystem**,

then this document defines:

- how `rf-service` should exist in production;
- which runtime pieces are required;
- how data flows should be hardened;
- which operational responsibilities belong inside the service;
- how Step 10 should ship without creating future architectural debt.

This is the **implementation and runtime baseline** for real deployment.

---

## 2. Production Role of RF

In production, `rf-service` is the operational backbone of the Russian Friendly layer.

It must serve three simultaneously active surfaces:

- user surface;
- PRO surface;
- business/partner surface;

while also supporting:

- moderator/admin workflows;
- read-side consumers;
- event-driven downstream reactions;
- strict domain ownership boundaries.

That means RF is not merely a CRUD API.  
It is a production workflow service.

---

## 3. Production Design Principles

The production shape of `rf-service` must follow these principles:

1. **RF is the sole writer of RF truth**
2. **RF must be operationally independent enough to commit local state without waiting on optional peers**
3. **RF must support auditability for critical business actions**
4. **RF must be extraction-safe from day one**
5. **RF must tolerate downstream failure without corrupting core RF writes**
6. **RF must separate write truth from read convenience**
7. **RF must enforce moderation, trust, and voucher integrity as first-class production concerns**

---

## 4. Production Runtime Shape

The recommended production shape for `rf-service` is:

- one primary HTTP/API service;
- one primary relational database;
- one transactional outbox/event emission mechanism;
- optional background worker(s) for asynchronous tasks;
- optional read model refresh pipeline;
- structured logging, metrics, and audit streams.

In minimal Step 10 form, this can still be deployed as:

- one service process/app;
- one DB schema;
- one outbox table/publisher loop;
- optional cron/worker for expiry/reconciliation tasks.

But the code and data model must already be prepared for later separation.

---

## 5. Required Production Components

## 5.1 API runtime

Handles:

- public RF reads;
- business writes;
- PRO writes/reads;
- voucher lifecycle operations;
- moderation actions;
- internal projection endpoints.

This is the main request-time runtime.

---

## 5.2 Primary relational database

Stores:

- RF authoritative write model;
- audit-supporting records;
- verification cases;
- voucher operation logs;
- optionally read-side materialized tables if colocated.

This is the source of truth.

---

## 5.3 Transactional outbox

Stores domain events produced as part of RF transactions.

Purpose:
- ensure reliable event publication;
- avoid cross-service writes inside business transaction;
- enable Points/notifications/search/social downstream reactions.

This is strongly recommended, not optional in architectural intent.

---

## 5.4 Background worker / async runner

Handles non-request-critical tasks such as:

- outbox publishing;
- voucher expiry sweeps;
- stale moderation reminders;
- projection rebuild triggers;
- notification handoff;
- retry of transient downstream failures.

In small deployments, this may initially be a scheduled or colocated worker process.

---

## 5.5 Observability pipeline

RF production runtime must support:

- structured logs;
- request IDs / correlation IDs;
- mutation audit logs;
- event publication traces;
- error categorization;
- metrics around critical lifecycle operations.

---

## 6. Recommended Deployment Topology

### Minimal production-safe topology
- `rf-service` API app
- RF primary database
- outbox publisher loop
- scheduled/background task runner

### Mature topology
- `rf-service-api`
- `rf-service-worker`
- RF database
- outbox stream / broker integration
- read projection refresh workers
- dedicated monitoring dashboards/alerts

The architecture should allow starting simple without redesigning the service contract later.

---

## 7. Production Data Topology

RF production data should be divided conceptually into:

1. **authoritative transactional tables**
2. **operational audit/moderation tables**
3. **outbox/event tables**
4. **optional read projection tables**

### 7.1 Authoritative transactional tables
Examples:
- `rf_business_partners`
- `rf_partner_representatives`
- `rf_partner_business_lines`
- `rf_partner_branches`
- `rf_partner_branch_business_lines`
- `rf_partner_pro_links`
- `rf_offers`
- `rf_vouchers`

### 7.2 Operational audit/moderation tables
Examples:
- `rf_partner_verification_cases`
- `rf_branch_verification_cases`
- `rf_voucher_operation_logs`
- optional abuse/anomaly tables

### 7.3 Outbox/event tables
Examples:
- `rf_outbox_events`

### 7.4 Optional read projection tables
Examples:
- `rf_public_partner_cards`
- `rf_public_branch_cards`
- `rf_public_offer_cards`
- `rf_user_voucher_wallet_items`
- `rf_pro_partner_queue_items`
- `rf_moderation_queue_items`

---

## 8. Production Module-to-Runtime Mapping

### Partners module
Production concerns:
- draft/create/update/archive
- verification/publication gates
- representative ownership enforcement

### Branches module
Production concerns:
- geo validation
- publish gating
- host/container place correctness
- branch visibility and verification

### Representatives module
Production concerns:
- invitation lifecycle
- privileged access control
- revocation correctness
- owner/manager/operator role enforcement

### PRO links module
Production concerns:
- onboarding acceptance
- duplicate active link prevention
- historical lifecycle retention

### Offers module
Production concerns:
- lifecycle state management
- branch scoping
- time window validity
- visibility policies

### Vouchers module
Production concerns:
- idempotent claim/redeem
- terminal state integrity
- audit trail
- expiry processing
- fraud/anomaly visibility

### Moderation module
Production concerns:
- queue management
- reviewer actions
- trust state separation from publication state
- suspension and rejection flows

---

## 9. Production-Critical Write Flows

The following flows are production-critical and require stronger correctness guarantees than ordinary CRUD.

## 9.1 Partner submission for review
Must:
- validate draft completeness;
- persist review transition atomically;
- create moderation queue visibility;
- emit event if needed.

## 9.2 Branch publication
Must:
- validate canonical geo anchor;
- validate branch/partner relationship;
- validate moderation or publication policy;
- set publication state atomically.

## 9.3 Representative grant/revoke
Must:
- enforce partner ownership policy;
- avoid unauthorized privilege escalation;
- preserve auditability.

## 9.4 PRO link accept/end
Must:
- enforce single active relationship constraints where required;
- preserve lifecycle timestamps;
- remain idempotent enough for retried requests.

## 9.5 Offer activation/pause/archive
Must:
- validate partner/branch ownership;
- validate date windows;
- preserve status integrity.

## 9.6 Voucher claim
Must:
- validate offer activity;
- validate eligibility context where used;
- create voucher record safely;
- prevent accidental duplicate issuance if policy forbids it;
- log operation.

## 9.7 Voucher redeem
Must:
- verify terminal-state legality;
- validate actor scope and branch/partner context;
- prevent double redemption under concurrency;
- persist redemption and log atomically.

## 9.8 Partner/branch verify/reject/suspend
Must:
- be actor-authorized;
- update only valid lifecycle states;
- preserve reviewer/audit data;
- emit downstream signals safely.

---

## 10. Transaction Rules in Production

RF production write flows should follow these rules:

1. commit local authoritative data in one DB transaction where possible;
2. include audit/log/outbox writes in the same transaction when appropriate;
3. never depend on peer service writes to complete local state transition;
4. handle downstream work asynchronously after local commit.

### Example
Voucher redeem transaction should ideally include:
- update voucher status;
- set redeemed timestamp;
- write voucher operation log;
- enqueue outbox event.

All of that should succeed or fail together.

---

## 11. Outbox and Event Production Pattern

RF should use transactional outbox or equivalent durable event publication strategy.

### Why
Because RF will produce operational facts consumed by:
- Points/reward logic
- notifications
- analytics
- search/read indexers
- Space/social amplifiers
- possibly moderation or BI workflows

### Required event characteristics
- stable event name
- event ID
- aggregate/entity ID
- occurred-at timestamp
- minimal payload sufficient for downstream consumers
- replay-safe semantics where possible

### Recommended event families
- `rf.partner.created`
- `rf.partner.submitted_for_review`
- `rf.partner.verified`
- `rf.partner.suspended`
- `rf.branch.created`
- `rf.branch.published`
- `rf.pro_link.accepted`
- `rf.offer.activated`
- `rf.voucher.claimed`
- `rf.voucher.redeemed`
- `rf.voucher.cancelled`
- `rf.voucher.expired`

---

## 12. Worker Responsibilities in Production

A dedicated or semi-dedicated worker path should eventually handle:

### 12.1 Outbox publishing
Publish pending outbox events to the platform’s event infrastructure.

### 12.2 Voucher expiry processing
Find vouchers past expiry and transition them safely when required by policy.

### 12.3 Reminder/escalation jobs
Examples:
- pending verification reminders
- stale moderation case reminders
- pending representative invite reminders

### 12.4 Projection rebuild triggers
Recompute or refresh derived read views after major changes if not handled inline.

### 12.5 Reconciliation tasks
Detect stuck outbox items, inconsistent projection lag, or abnormal lifecycle drift.

---

## 13. Voucher Production Architecture

Voucher handling deserves special production treatment.

### 13.1 Voucher integrity requirements
Production voucher logic must guarantee:

- unique voucher code or unique voucher identity;
- no double redeem;
- no redeem after expiry;
- no illegal state regression;
- full auditability of claim/redeem/cancel/expire;
- actor attribution;
- branch/partner context preservation.

### 13.2 Recommended redeem controls
Use one or more of:
- row-level locking;
- optimistic version checks;
- terminal-state transition guard;
- idempotency key support for retry-prone clients;
- operation log written in same transaction.

### 13.3 Voucher operation log
Every meaningful voucher operation should be written to a durable log structure.

Suggested operation types:
- `issued`
- `claimed`
- `redeem_attempted`
- `redeemed`
- `cancelled`
- `expired`
- `restore_attempted` if ever supported administratively

### 13.4 Voucher abuse visibility
Production design should allow future anomaly detection around:
- repeated redeem attempts;
- high-frequency claim patterns;
- unusual representative/operator behavior;
- branch-level redemption anomalies.

This may start as logging + metrics before evolving into dedicated fraud controls.

---

## 14. Moderation Production Architecture

Moderation is a real production subsystem, not just an admin flag.

### 14.1 Moderation runtime concerns
- review queues
- entity verification/rejection
- suspension flows
- reason note persistence
- reviewer identity attribution
- timestamps and auditability

### 14.2 State separation
Production schema and services should keep separate:
- `status`
- `verificationStatus`
- `publicationStatus`

Do not collapse them into one field.

### 14.3 Queue strategy
A moderation queue may initially be query-driven from transactional tables and cases.

Later it may be supported by dedicated projection tables for:
- pending partner reviews
- pending branch reviews
- suspension candidates
- anomaly-linked voucher cases

---

## 15. Branch / Geo Production Architecture

Branch geo discipline is one of the most important production constraints of RF.

### 15.1 Published branch rule
A branch must not be publicly published unless it has a valid geo anchor.

Accepted production shapes:
- `atlasPlaceId`
- `hostAtlasPlaceId`
- both, where valid
- tightly controlled fallback strategy during migration period only

### 15.2 Container/host support
Production system must support real SEA scenarios such as:
- shop inside mall
- service desk inside hotel
- agency inside condo complex
- vendor inside market/street container

This means branch records must preserve:
- host place reference
- optional unit/floor/zone/landmark fields
- independent branch identity

### 15.3 Geo validation options
Production may validate geo references through:
- synchronous Atlas API validation
- cached reference tables
- internal geo adapter service
- preloaded Atlas projections

The exact mechanism may evolve, but Atlas remains authoritative.

---

## 16. Read Model Production Architecture

RF should be production-ready for separate read models, even if Step 10 starts with simpler query paths.

### 16.1 Why read models matter
RF serves different surfaces with different shapes:
- public discovery
- partner/business dashboard
- PRO queue
- user voucher wallet
- moderator queue
- internal cross-service projections

A single normalized query path for all of them will not age well.

### 16.2 Recommended production approach
Start with normalized reads where acceptable, but design toward:
- projection tables
- cacheable card/list views
- event-driven refresh
- bounded internal projection contracts

### 16.3 Safe projection ownership
Projection tables remain RF-owned if built from RF truth.  
External services may consume them, but not mutate them.

---

## 17. API Runtime Hardening

Production RF API must include:

- request ID propagation;
- structured error envelopes;
- actor context extraction;
- route-level auth gates;
- application-level policy checks;
- input validation;
- rate/abuse protection where required;
- safe mutation retries for selected endpoints.

### Especially sensitive endpoints
- representative management
- PRO link accept/end
- voucher claim
- voucher redeem
- moderation verify/reject/suspend

These need tighter controls and better logging than simple public reads.

---

## 18. Authorization Production Model

Authorization should be layered.

### 18.1 Authentication layer
Verifies actor identity.

### 18.2 Role/principal layer
Understands actor type:
- user
- PRO
- partner representative
- moderator
- admin
- internal service

### 18.3 Domain policy layer
Determines whether actor may perform the exact action on the exact RF resource.

### Examples
- owner may add representative
- manager may update offer but not suspend partner
- operator may redeem voucher but not alter partner ownership
- moderator may verify/reject but not impersonate representative actions
- internal service may read projection but not mutate RF domain truth

Production must not rely solely on frontend role assumptions.

---

## 19. Idempotency and Retry Strategy

Certain RF production endpoints should support idempotent or retry-safe behavior.

### High-priority candidates
- voucher claim
- voucher redeem
- PRO link accept
- representative invite accept if later implemented
- publish/verify flows where retries may occur via UI/network failure

### Recommended techniques
- idempotency keys for selected commands
- unique constraints
- version fields
- safe duplicate-request handling
- explicit terminal-state checks

Production goal:
retries should not create duplicate business effects.

---

## 20. Observability Production Baseline

### 20.1 Logs
RF should emit structured logs with:
- request ID
- actor ID
- actor type
- endpoint/use case
- entity ID
- outcome
- error code if failed

### 20.2 Metrics
Recommended metrics:
- partner create/update counts
- branch publish success/fail counts
- offer activation counts
- voucher claim counts
- voucher redeem counts
- redeem failure reasons
- moderation queue size
- verification SLA timings
- outbox lag
- worker retry counts

### 20.3 Audit streams
Critical actions should be auditable:
- representative changes
- PRO link changes
- moderation actions
- voucher operations
- suspensions/rejections

### 20.4 Tracing/correlation
Where platform supports it, correlate:
- HTTP request
- DB transaction
- outbox event
- worker handling
- downstream notifications

---

## 21. Failure Handling Strategy

Production RF must distinguish between:

### 21.1 Core write failure
Examples:
- invalid transition
- auth failure
- DB constraint failure
- missing geo reference
- double redemption guard trip

These should fail request immediately and clearly.

### 21.2 Downstream side-effect failure
Examples:
- notification publish failed
- Points event consumer unavailable
- analytics sink unavailable
- search projection refresh delayed

These must not roll back already committed RF truth if local transaction succeeded.

### 21.3 External validation dependency failure
Examples:
- Atlas validation timeout
- auth principal resolver unavailable
- optional Pulse event existence check unavailable

These need explicit policy:
- block operation when validation is mandatory;
- degrade gracefully when dependency is optional and not truth-critical.

---

## 22. Production Security Considerations

RF production design should assume sensitive business workflows.

### Sensitive data classes
- partner contact metadata
- representative linkage
- voucher codes
- moderation notes
- audit records
- internal projection endpoints

### Security baseline
- authenticated privileged routes
- role/policy enforcement
- no direct DB exposure
- minimal internal endpoint scope
- no leaking moderation/internal data to public reads
- careful log redaction where needed
- no trust in client-supplied actor scope

### Special concern
Voucher codes and redemption routes should be treated as abuse-sensitive surfaces.

---

## 23. Performance and Scaling Direction

RF does not need premature over-distribution, but must scale sensibly.

### 23.1 Likely early hotspots
- public branch/offer list reads
- voucher claim/redeem endpoints
- business dashboard views
- moderation queue queries
- outbox publishing and projection refresh

### 23.2 Safe scaling levers
- read projections
- endpoint-specific caching for public reads
- worker separation
- query optimization/indexing
- selective denormalized materializations

### 23.3 Unsafe scaling shortcuts
- letting other services read/write RF internals directly
- duplicating RF truth into peer write stores
- moving business logic to frontend for performance
- skipping audit logs on critical flows

---

## 24. Indexing and Query Baseline

Production schema should plan indexes for common RF access patterns.

### Likely index groups
- partner by status / verification / city
- branch by partner / city / place / host place / publication / verification
- representative by partner / user / active status
- PRO links by partner / pro user / status
- offers by partner / branch / status / time window
- vouchers by issued user / partner / branch / status / expiry
- moderation cases by entity / status / reviewer / createdAt
- outbox by publish status / createdAt

Exact index set will follow implementation details, but production planning should assume these access paths.

---

## 25. Projection and Cache Freshness Rules

If RF uses projections or caches, production behavior should define freshness expectations.

### Strong consistency required
- voucher status truth
- representative permission truth
- moderation action result in write path

### Eventual consistency acceptable
- public partner cards
- public branch cards
- public offer cards
- search indexes
- analytics dashboards
- social amplification side effects

This distinction is important to avoid corrupt business logic.

---

## 26. Migration and Rollout Strategy

RF should ship in phases.

## 26.1 Phase A — Step 10 baseline
Required:
- partner root
- representatives
- business lines
- branches
- PRO links
- offers
- vouchers
- moderation basics
- auth integration
- Atlas reference validation
- outbox scaffold
- public/business/PRO/user surfaces

## 26.2 Phase B — operational hardening
Add:
- background worker split
- expiry sweeps
- richer moderation queues
- better audit views
- richer projections
- alerting/metrics dashboards

## 26.3 Phase C — ecosystem integration maturation
Add:
- cleaner Guru projections
- richer Quest eligibility adapters
- reward/event downstream maturity
- more refined PRO Console integration
- enhanced anomaly detection

The key is that Phase A must already be architecturally compatible with Phase B/C.

---

## 27. Production Readiness Checklist

A production-ready RF baseline should satisfy:

- RF owns all RF writes
- Atlas is used as geo source of truth
- auth principal integration is live
- voucher redeem is concurrency-safe
- outbox exists or equivalent reliable event publishing exists
- moderation actions are auditable
- representative privilege changes are auditable
- public reads do not leak private moderation/business data
- internal projections are narrow and controlled
- no synchronous dependency on optional downstream consumers for local write success

---

## 28. What Must Not Be Deferred Too Long

Some hardening can wait, but these should not be postponed excessively:

1. voucher operation logging
2. audit trail for moderation
3. outbox/reliable event publication
4. geo validation discipline
5. representative permission correctness
6. double-redeem protection
7. clear separation of verification vs publication state

Deferring these too long would create real architecture debt.

---

## 29. What Can Start Simple

These areas may begin with simpler implementations if contracts remain clean:

- projection tables can begin as on-demand queries
- worker may start as a scheduled job
- public reads may begin without dedicated search infrastructure
- advanced anomaly detection can start as logs/metrics
- analytics fanout can remain thin initially
- some optional downstream integrations can lag behind RF core writes

The rule is:
**simple implementation is acceptable; wrong ownership is not.**

---

## 30. Service Extraction Readiness

Even if `rf-service` is initially deployed within a larger monorepo/platform runtime, its production architecture must make later extraction easy.

### Extraction-safe properties
- isolated DB schema ownership
- isolated API namespace
- isolated event names
- isolated application modules
- no direct foreign table writes
- no foreign service relying on RF internals as private implementation detail

### Extraction warning signs
- frontend depends on raw RF tables
- another service writes RF tables directly
- RF write transaction depends on multiple peer services
- RF stores other domain truths as if owned locally

---

## 31. Production Non-Goals

This production architecture intentionally excludes:

- payment/order runtime
- wallet/token ledger runtime
- on-chain bridge logic
- NFT gating runtime
- global recommendation engine
- global search service
- event attendance service
- real-estate listing service
- social publishing service

These may integrate with RF later, but are not part of RF production ownership baseline.

---

## 32. Final Production Formula

The shortest correct production formula is:

> `rf-service` should run in production as an independently owned workflow service with one authoritative RF write store, reliable outbox/event emission, auditable moderation and voucher operations, Atlas-linked geo discipline, and clean downstream integration boundaries.

---

## 33. Most Important Conclusion

The right production architecture for RF is not:

- a thin CRUD layer over partner tables,
- nor a frontend-driven workflow shell,
- nor a marketplace monolith,
- nor a social/events extension.

It is a real operational service that must already behave like production business infrastructure:

- trustworthy,
- auditable,
- concurrency-safe where it matters,
- event-capable,
- geo-disciplined,
- and resistant to scope drift.

That is the correct production baseline for `rf-service`.