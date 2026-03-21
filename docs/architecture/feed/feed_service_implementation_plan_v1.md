# Feed Service Implementation Plan V1

## Status and scope

This document defines Step 6 architecture for a conservative Feed V1.

Prerequisites:

- Step 4 completed: `space-service` is the social source domain.
- Step 5 completed: `reactions-service` is a separate interaction domain (V1 `like` only).
- Step 5.5 completed: reactions baseline is stabilized for feed consumption.

Feed V1 is implemented as a read/distribution service in `apps/feed-service`.
This document remains the boundary and runtime-behavior baseline for Step 6 completion checks.

## 1) Feed service boundary

`feed-service` is a distribution/read layer only.

`feed-service` owns:

- read orchestration for feed surfaces;
- read-time filtering and ordering rules;
- cursor pagination behavior;
- optional short-lived response cache.

`feed-service` does NOT own:

- posts, reposts, groups, membership, profile projections, media relations (owned by `space-service`);
- reactions and interaction writes (owned by `reactions-service`);
- points ownership;
- user state ownership;
- content mutations;
- recommendation/ranking model ownership.

## 2) Feed surfaces (V1)

V1 read surfaces:

- `home feed`;
- `group feed`;
- `profile feed`;
- `activity feed`.

Design intent:

- all surfaces are read-only endpoints;
- all surfaces use cursor pagination and deterministic ordering;
- all surfaces consume source-domain data, never replace source-of-truth ownership.

## 3) V1 read models

V1 uses an assembled-on-read response model (no persistent feed source-of-truth table).

Canonical feed item envelope (logical model):

- source post identity (`postId`, `authorId`, optional `groupId`);
- publication metadata (`postType`, `visibility`, `publishedAt`, `status`);
- content/media preview fields from space read response;
- reaction summary fragment from reactions read response:
  - `counts.like`;
  - `viewer.liked`.

Activity item envelope (logical model):

- event type (`post_created`, `post_reposted`, `post_liked`);
- actor/target references;
- event timestamp;
- optional post preview fragment.

Note: these are feed read DTOs only, not new ownership entities.

## 4) Integration points

Primary upstreams:

- `space-service` for content and visibility-safe feed candidates;
- `reactions-service` for like-only summary enrichment.

Boundary guarantees:

- space remains source of post/group/membership visibility;
- reactions remain source of like counters/viewer-like state;
- feed only composes read responses for client delivery.

## 5) Ranking strategy (minimal)

V1 ranking policy:

- chronological-first ordering (`createdAt` descending when available);
- stable tie-breaker by entity id for equal timestamps;
- fallback to stable upstream item order when timestamps are absent;
- no hidden or ML scoring in V1.

Light priority rules:

- deferred in current runtime baseline (no priority boosts are applied in Step 6 completion state).

Not allowed in V1:

- ML ranking;
- recommendation models;
- hidden scoring pipelines.

## 6) Event consumption model

V1 feed architecture uses read-through integration as primary path.

Event usage in V1:

- optional, non-blocking signal consumption for cache invalidation hints and future compatibility;
- no event-owned feed state as source-of-truth in V1.

Rationale:

- simplest reliable path now is direct read-through from stabilized `space-service` + `reactions-service`;
- event-driven persistent projections are deferred to later phases.

## 7) Invalidation / update strategy

V1 strategy:

- request-time assembly from upstream services;
- short TTL cache for feed responses and summary fragments;
- targeted cache invalidation on known change hints where practical;
- safe fallback to direct read-through when cache is stale/missing.

Consistency expectation:

- feed remains eventually consistent with upstream domains;
- correctness of ownership and visibility has priority over aggressive caching.

## 8) Explicitly deferred items

- feed as source-of-truth persistence layer;
- fanout-on-write feed inbox model;
- event-driven full feed projections as primary path;
- ML ranking and recommendation systems;
- points-aware ranking;
- moderation ownership logic;
- organizer / PRO / marketplace logic;
- realtime push/websocket feed delivery;
- mutation endpoints in `feed-service`.

## 9) Implementation readiness gates

Before starting feed code implementation:

- boundary rule is accepted: feed is read/distribution only;
- upstream contracts from `space-service` and `reactions-service` are treated as canonical;
- V1 ordering/filtering rules are deterministic and testable;
- deferred list is accepted to prevent scope drift in Step 6 implementation.

This plan is intentionally narrow to start Step 6 safely without reintroducing ownership drift.
