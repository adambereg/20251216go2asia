# Unified Event Envelope V1

## Status and purpose

This document defines the canonical Go2Asia domain event envelope for cross-service consistency.

Scope of this document:

- unify event shape and naming;
- standardize versioning and compatibility behavior;
- provide a soft migration path for existing producers (`space-service`, `reactions-service`);
- provide stable guidance for future services (`quest-service`, `rielt-service`, `guru-service`, `rf-service`).

Non-goals:

- introducing Kafka/broker infrastructure;
- building an event platform or global outbox framework;
- forcing a breaking rewrite across all services.

---

## 1) Unified Event Envelope V1 (canonical shape)

Canonical V1 envelope:

```yaml
eventId: "<uuid-or-stable-id>"
eventType: "<domain.entity.fact>"
eventVersion: 1
occurredAt: "<iso-datetime-utc>"
producer:
  service: "<service-name>"
  environment: "<optional-env>"
trace:
  requestId: "<optional-request-id>"
  correlationId: "<optional-correlation-id>"
  causationId: "<optional-causation-event-id>"
actor:
  userId: "<optional-user-id>"
subject:
  targetType: "<canonical-target-type>"
  targetId: "<opaque-target-id>"
payload: {}
```

Envelope design rule:

- envelope fields are generic and stable;
- `payload` stays domain-specific and evolves per event type;
- consumers must parse envelope first, then event-specific payload.

---

## 2) Required top-level fields (MUST)

All Go2Asia domain events MUST include:

- `eventId` (globally unique event identifier);
- `eventType` (canonical event name);
- `eventVersion` (contract version for this event type);
- `occurredAt` (fact time, ISO-8601 UTC);
- `producer.service` (producer identity);
- `payload` (object, can be minimal but must exist).

Conditional required section:

- `subject` is required when the event is about a domain target/entity reference.

---

## 3) Standard optional sections (MAY)

Optional but recommended:

- `producer.environment` (`dev|staging|production` or equivalent environment tag);
- `trace.requestId` for request-originated events;
- `trace.correlationId` for multi-hop flow tracking;
- `trace.causationId` for event-from-event causality chains;
- `actor.userId` when action was user-initiated.

Consumer tolerance requirements:

- unknown optional fields MUST be ignored;
- missing optional sections MUST NOT break processing.

---

## 4) Naming rules

Event names MUST follow lower-case dot notation and represent domain facts.

Format:

- `<domain>.<entity>.<fact>`

Rules:

- use facts, not commands (use `created`, not `create`);
- keep names stable once published;
- do not encode transport/mechanism in the name.

Canonical examples:

- `space.post.created`
- `space.post.deleted`
- `space.post.reposted`
- `space.group.member_joined`
- `space.group.member_left`
- `reaction.created`
- `reaction.deleted`

---

## 5) Versioning rules

`eventVersion` is mandatory for every event.

Policy:

- initial published contract starts at `1`;
- additive payload changes are preferred and non-breaking;
- breaking payload changes require `eventVersion + 1`;
- migration windows may temporarily support old and new versions in parallel.

Envelope policy:

- this document defines envelope generation as V1 baseline;
- breaking envelope-level changes require a future envelope revision document.

---

## 6) Actor / subject conventions

`actor` conventions:

- include `actor.userId` for user-initiated actions;
- actor may be omitted for internal/system-origin events.

`subject` conventions:

- subject should carry canonical target reference semantics:
  - `subject.targetType`
  - `subject.targetId`
- subject references only; ownership remains in source domain.

Alignment rule:

- `subject.targetType` should use canonical whitelist from social contracts where applicable:
  - `space_post | blog_post | place | event | partner | listing | quest`

Reference:

- `docs/architecture/social/social_layer_contracts_v1.md`

---

## 7) Compatibility and soft migration rules

Soft migration principles:

- do not break current working producers/consumers;
- prefer additive alignment before strict enforcement;
- allow temporary compatibility mapping at consumer boundaries.

Migration behavior requirements:

- new producers SHOULD emit V1 envelope fields now;
- existing payload keys may remain during migration for backward compatibility;
- consumers SHOULD support fallback from envelope-first parse to legacy payload fields when needed;
- new producers MUST use canonical event names;
- legacy aliases may be accepted temporarily by consumers and normalized.

Deprecation pattern:

- mark alias name as deprecated in docs;
- keep consumer acceptance for a defined migration window;
- remove alias acceptance only after all critical consumers are aligned.

---

## 8) Current-domain examples (space + reactions)

### 8.1 Space example

```yaml
eventId: "evt-space-001"
eventType: "space.post.created"
eventVersion: 1
occurredAt: "2026-03-16T18:00:00Z"
producer:
  service: "space-service"
trace:
  requestId: "req-123"
actor:
  userId: "user-42"
subject:
  targetType: "space_post"
  targetId: "post-100"
payload:
  postId: "post-100"
  authorId: "user-42"
  visibility: "public"
  postType: "post"
```

### 8.2 Reactions example

```yaml
eventId: "evt-react-001"
eventType: "reaction.created"
eventVersion: 1
occurredAt: "2026-03-16T18:01:00Z"
producer:
  service: "reactions-service"
trace:
  requestId: "req-777"
actor:
  userId: "user-55"
subject:
  targetType: "space_post"
  targetId: "post-100"
payload:
  actorUserId: "user-55"
  targetType: "space_post"
  targetId: "post-100"
  reactionType: "like"
  requestId: "req-777"
```

---

## 9) Soft alignment for existing services (non-breaking)

### 9.1 `reactions-service`

Current state:

- already emits canonical names: `reaction.created`, `reaction.deleted`;
- payload already includes actor/target/request fields.

Needed alignment:

- ensure docs use `reaction.deleted` as canonical delete event name;
- keep compatibility note for temporary acceptance of legacy alias `reaction.removed` at consumer edge only.

### 9.2 `space-service`

Current state:

- core event envelope fields exist (`eventId`, `eventType`, `occurredAt`, `payload`);
- payload shape is currently flexible and event-specific.

Needed alignment:

- additive introduction of `eventVersion` and `producer.service` fields on emitted events;
- include `trace.requestId` when request context exists;
- gradually include canonical `subject` for target-oriented events;
- keep current payload fields intact during migration.

---

## 10) Guidance for future services

Future producer services MUST:

- emit V1 envelope fields from first release;
- use canonical naming and versioning rules;
- use canonical target references when referencing social targets;
- avoid introducing service-specific envelope variants.

Future consumer services SHOULD:

- parse envelope fields first;
- ignore unknown optional fields;
- support additive payload growth;
- implement temporary alias normalization only at service boundaries.

---

## 11) Feed-service position in event model

`feed-service` is a read/distribution layer, not an event ownership domain.

Implications:

- feed can consume events for cache hints or invalidation;
- feed must not redefine source event ownership;
- feed must not become a producer of source-of-truth social domain events.

---

## Stabilization result

With this document, Go2Asia has one canonical event envelope baseline for current and future domain services, plus a soft migration path that preserves working behavior while reducing event-shape drift risk.
