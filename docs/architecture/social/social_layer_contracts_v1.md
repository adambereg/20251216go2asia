# Social Layer Contracts V1

## Status and purpose

This document stabilizes cross-service contracts for the social backbone:

- `space-service` (source of truth for social publishing entities);
- `reactions-service` (interaction signals, V1 like-only);
- `feed-service` (read/distribution aggregation layer).

Goal: provide one SSOT contract for future domain integrations (`quest-service`, `rielt-service`, `guru-service`, `rf-service`) without ownership drift.

---

## 1) Canonical Target Reference Contract

Canonical target reference shape:

```yaml
target:
  targetType: space_post | blog_post | place | event | partner | listing | quest
  targetId: "<opaque-id>"
```

V1 whitelist for `targetType`:

- `space_post`
- `blog_post`
- `place`
- `event`
- `partner`
- `listing`
- `quest`

Contract rules:

- `targetType` is a stable enum across social services;
- `targetId` is an opaque domain identifier (no parsing semantics in feed/reactions);
- `targetType + targetId` forms stable target identity;
- `reactions-service` and `feed-service` treat targets as references only;
- target ownership remains in source domains.

---

## 2) Canonical Reaction Enrichment Fragment

Canonical V1 reaction enrichment fragment:

```yaml
reactions:
  counts:
    like: 0
  viewer:
    liked: false
```

V1 rules:

- only `like` is supported in social-layer V1;
- `counts.like` default is `0`;
- `viewer.liked` default is `false`;
- when reaction enrichment is degraded, feed may return defaults and mark degraded status.

---

## 3) Canonical Feed Item Enrichment Contract

Feed item composition contract (read-time merge of `space-service` + `reactions-service`):

```yaml
item:
  id: "<feed-item-id>"
  post:
    id: "<space-post-id>"
    author:
      userId: "<author-user-id>"
    publishedAt: "<iso-datetime>"
  createdAt: "<iso-datetime>"
  reactions:
    counts:
      like: 0
    viewer:
      liked: false
```

Mandatory fields (MUST):

- `item.id`
- `item.post.id`
- `item.post.author.userId` (author reference)
- `item.createdAt`
- `item.post.publishedAt`

Nullable fields (MAY be null, pass-through from upstream):

- optional post preview fields;
- optional repost preview fields;
- optional media metadata fields.

Degraded-safe fields (MUST remain safe under partial failure):

- `reactions.counts.like`
- `reactions.viewer.liked`
- optional top-level degraded marker (for example `degraded.reactions = true`).

Merge rules:

- feed keeps `space-service` as canonical source for post identity/timestamps/visibility-related payload;
- feed adds reaction fragment only as enrichment;
- feed does not mutate source ownership semantics.

---

## 4) Event Naming Discipline

Event naming must use stable lower-case dot notation and represent domain facts.

Unified envelope rule:

- social events follow `docs/architecture/events/events_contracts_v1.md` (Unified Event Envelope V1);
- social-specific constraints in this document are additional rules, not a separate envelope.

Space event examples:

- `space.post.created`
- `space.post.deleted`
- `space.post.reposted`
- `space.group.member_joined`
- `space.group.member_left`

Reaction events:

- `reaction.created`
- `reaction.deleted`

Compatibility note (soft migration):

- canonical delete event name is `reaction.deleted`;
- legacy alias `reaction.removed` may be accepted by consumers during migration;
- new producers MUST NOT emit `reaction.removed`.

Minimal required event envelope fields:

- `eventId`
- `eventType`
- `eventVersion`
- `occurredAt`
- `producer.service`
- `payload`

Required reaction payload fields:

- `payload.actorUserId` (when actor exists)
- `payload.targetType` (when target exists)
- `payload.targetId` (when target exists)
- `payload.requestId`

Compatibility note:

- consumers may temporarily accept legacy payload-first/flat event shapes during migration.

For reaction events in V1, `payload.reactionType` MUST be `like`.

---

## 5) Degradation Policy

Cross-service failure rules:

1. If `space-service` fails during feed read:
   - `feed-service` returns failure (do not fabricate feed from stale ownership state).

2. If `reactions-service` fails during feed enrichment:
   - `feed-service` returns feed items from `space-service` without reaction enrichment dependency;
   - `counts.like` defaults to `0`;
   - `viewer.liked` defaults to `false`;
   - response may include degraded marker for reactions path.

3. If reactions summary is partially missing:
   - missing targets receive the same safe defaults (`0/false`).

Principle:

- social read availability should degrade gracefully on enrichment failure;
- source-of-truth correctness must be preserved.

---

## 6) Explicit Out-of-Scope (V1)

Social layer V1 explicitly does NOT include:

- feed ranking ownership;
- points ownership;
- organizer logic;
- PRO console logic;
- marketplace workflows;
- AI orchestration;
- realtime push/websocket.

Additional excluded items:

- feed mutation ownership;
- recommendation/ML models;
- ownership transfer from `space-service` or `reactions-service` to `feed-service`.

---

## 7) Social Layer Compatibility Rules

Future services integrating with the social layer MUST:

- use canonical target reference (`targetType`, `targetId`) from this document;
- not bypass `reactions-service` for reaction reads/writes;
- not mutate `feed-service` state as if it were a source-of-truth domain;
- not write directly into `space-service` tables.

Compatibility intent:

- protect social-layer boundaries during Step 7-10 delivery;
- keep integration through explicit APIs/events only;
- prevent ownership drift across practical domains.

---

## 8) Stabilization result

With this document, V1 social-layer contracts are stabilized for:

- target references;
- reaction enrichment shape;
- feed item enrichment discipline;
- event naming discipline;
- cross-service degradation behavior;
- strict ownership boundaries.
