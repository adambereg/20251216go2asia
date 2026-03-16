# Reactions Service Implementation Plan V1

## Status and scope

This document defines a conservative V1 for Step 5 from `docs/plans/go2asia_next_steps_plan_2026_march_10.md`.

Step 4 is already completed and merged. `space-service` remains social core only.  
`reactions-service` is a separate bounded context outside `space-service`.

## 1) Recommended V1 subset

Approved V1 reaction types:

- `like`

Rationale:

- covers core engagement signal with lowest implementation risk;
- avoids immediate drift into workflow and messaging domains;
- gives a stable base for future feed and points consumers.

## 2) Service boundary

`reactions-service` owns:

- user-to-target interaction facts for approved V1 types;
- reaction write APIs and read summaries;
- aggregate counters for supported targets;
- idempotency and deduplication on write path;
- domain events about reaction changes.

`reactions-service` does NOT own:

- posts/reposts/groups/profile projections/media relations (Space ownership);
- feed ranking/distribution ownership;
- points ledger/reward ownership;
- organizer logic, PRO console logic, AI orchestration;
- marketplace-specific workflows.

## 3) Ownership rules

- Source entities remain owned by their source domains (`space-service`, `content-service`, etc.).
- Reactions store only target references (`targetType`, `targetId`) and actor identity.
- Points integration is event-driven downstream consumption, not synchronous ownership.
- Feed integration consumes reaction events/summaries, but feed logic is not in reactions domain.

## 4) Proposed reaction target contract

V1 target reference:

- `targetType` (enum, whitelisted)
- `targetId` (opaque text id)

V1 `targetType` whitelist:

- `space_post`
- `blog_post`
- `place`
- `event`
- `partner`
- `listing`
- `quest`

Contract rules:

- `targetType + targetId` are immutable identity of a target;
- service validates target type format and target id non-empty;
- optional existence verification may be introduced later as async validation, not hard dependency in V1 write path.

## 5) Explicitly deferred items

- `repost` (owned by `space-service`, not a reactions type);
- `bookmark`, `rating`, `short_review`, `question`, `contact_request`, `thread_reply`, `completed`;
- `was_here`, `want_to_visit`;
- threaded discussion/inquiry model;
- advanced moderation workflows;
- real-time push/WebSocket delivery;
- complex anti-fraud/ML scoring;
- reaction ownership for organizer/pro marketplace workflows.

## 6) Event model (V1)

Core events:

- `reaction.created`
- `reaction.removed`

Common payload fields:

- `eventId`
- `occurredAt`
- `actorUserId`
- `targetType`
- `targetId`
- `reactionType`
- `requestId`

Optional fields:

- none in V1

## 7) Anti-spam / throttling / moderation baseline

- per-user write rate limits (burst + sustained);
- idempotency key support for safe retries;
- unique active reaction constraint for `like`;
- basic moderation flags (`active` / `deleted`) only;
- structured audit logging for write operations.

## 8) Integration points

With `space-service`:

- consume `space_*` ids as target references;
- no reaction tables or reaction ownership in Space schema.

With `points-service`:

- consume reaction events asynchronously for optional reward effects;
- points ownership remains in points domain.

With future feed:

- feed consumes reaction events and batch summaries;
- feed ranking ownership remains outside reactions service.

## 9) Phase 3 DB/domain proposal (V1)

Proposed table list:

- `reaction_record`
- `reaction_target_aggregate`
- `reaction_idempotency_key`

Proposed enums:

- `reaction_type`: `like`
- `reaction_status`: `active | deleted`
- `reaction_target_type`: `space_post | blog_post | place | event | partner | listing | quest`

Key constraints:

- pair identity: (`actor_user_id`, `target_type`, `target_id`, `reaction_type`) unique for active records;
- aggregate row uniqueness: (`target_type`, `target_id`) unique.

Idempotency rules:

- writes accept `Idempotency-Key`;
- repeated same key + same payload returns previous success result;
- repeated same key + different payload returns conflict.

This plan is intentionally narrow and implementation-ready without expanding bounded-context ownership.
