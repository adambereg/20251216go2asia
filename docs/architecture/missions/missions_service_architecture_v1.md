# Missions Service Architecture v1

**Project:** Go2Asia  
**Document role:** SSOT architecture draft for future missions-service  
**Status:** planning / architecture v1  
**Depends on:** Missions in Go2Asia — Concept & Architecture  
**Recommended path:** `docs/architecture/missions/missions_service_architecture_v1.md`

---

## 1. Purpose

`missions-service` is the future backend service responsible for ecosystem-wide missions in Go2Asia.

Missions are not Quest steps, not a wallet, not a reward ledger, and not a replacement for Connect. Missions are an orchestration layer that listens to confirmed events from domain services, updates user mission progress, and creates reward intents for the services that own rewards.

The purpose of `missions-service` is to answer one product question:

> What should this user do next in Go2Asia, and what progress or reward should follow from that action?

---

## 2. Architectural Position

`missions-service` sits between domain events and user-facing engagement surfaces.

Flow:

1. Domain modules produce confirmed events.
2. `missions-service` consumes those events.
3. `missions-service` evaluates mission conditions.
4. `missions-service` updates user progress.
5. `missions-service` creates reward intents.
6. Reward-owning services execute rewards.
7. Connect and module UIs display progress and results.

Conceptual position:

- Space, RF, Rielt, Quest, Atlas, Pulse, Blog, Referral produce events.
- Missions consumes events and manages progress.
- Points and Badges execute rewards.
- Connect displays missions, progress, and earned outcomes.
- Guru can surface contextual geo-driven missions.

---

## 3. What Missions Service Owns

`missions-service` owns:

- mission catalog;
- mission conditions;
- mission chains / tracks;
- user mission progress;
- mission availability and visibility;
- mission lifecycle state;
- reward intent creation;
- mission campaigns and seasonal missions;
- basic personalization rules;
- anti-abuse constraints specific to missions.

---

## 4. What Missions Service Does Not Own

`missions-service` does not own:

- Points balance;
- Points ledger;
- Badge catalog execution truth;
- Quest progress truth;
- RF partner truth;
- Rielt listing truth;
- Space post truth;
- Atlas/Pulse/Blog content truth;
- Referral graph truth;
- G2A/on-chain/token operations;
- business validation of domain actions.

Missions only trust confirmed events from the domain owner.

Examples:

- Space decides whether a post exists.
- RF decides whether a voucher was redeemed.
- Quest decides whether a quest was completed.
- Rielt decides whether a listing was verified.
- Referral decides whether a referral became active.
- Points decides whether a reward was executed.

---

## 5. Core Domain Concepts

### 5.1 Mission

A mission is a reusable goal definition.

Suggested fields:

- `id`
- `slug`
- `title`
- `description`
- `type`
- `tier`
- `scope`
- `target_roles`
- `status`
- `visibility`
- `priority`
- `start_at`
- `end_at`
- `conditions`
- `rewards`
- `source_module`
- `chain_id`
- `created_by`
- `created_at`
- `updated_at`

Mission types:

- onboarding;
- social;
- content;
- referral;
- rf;
- rielt;
- quest_meta;
- pro;
- business;
- seasonal;
- contextual_geo.

Mission tiers:

- Tier 0 — onboarding;
- Tier 1 — basic actions;
- Tier 2 — engagement;
- Tier 3 — economy;
- Tier 4 — PRO / business.

### 5.2 Mission Chain

A mission chain is an ordered sequence of missions that forms a user journey.

Examples:

- New Spacer onboarding;
- First social contribution;
- First RF voucher journey;
- PRO partner onboarding;
- Quest creator journey;
- Rielt listing owner journey.

Suggested fields:

- `id`
- `slug`
- `title`
- `description`
- `target_roles`
- `status`
- `mission_ids_ordered`
- `unlock_policy`
- `created_at`
- `updated_at`

### 5.3 User Mission Progress

Tracks one user's progress toward one mission.

Suggested fields:

- `id`
- `user_id`
- `mission_id`
- `status`
- `progress_current`
- `progress_required`
- `started_at`
- `completed_at`
- `claimed_at`
- `expired_at`
- `reward_status`
- `last_event_id`
- `metadata`

Statuses:

- `available`
- `locked`
- `in_progress`
- `completed`
- `reward_pending`
- `reward_claimed`
- `expired`
- `cancelled`

### 5.4 Mission Condition

A condition describes what must happen for progress to change.

Suggested fields:

- `event_type`
- `source_module`
- `operator`
- `value`
- `window`
- `filters`
- `quality_requirements`

Example conditions:

- `space.post_created >= 1`
- `space.post_liked >= 10`
- `referral.referral_activated >= 3`
- `quest.quest_completed >= 1`
- `rf.voucher_redeemed >= 1`
- `rielt.listing_created >= 1`

### 5.5 Reward Intent

A reward intent is the mission service's request for another service to execute a reward.

Missions do not directly mutate reward balances.

Suggested fields:

- `id`
- `mission_id`
- `user_id`
- `reward_type`
- `target_service`
- `amount`
- `badge_code`
- `access_code`
- `reason`
- `external_id`
- `status`
- `idempotency_key`
- `created_at`
- `executed_at`
- `failed_at`
- `error_message`

Reward types:

- Points;
- Badge;
- Access unlock;
- Multiplier;
- Voucher claim intent;
- future G2A intent;
- future NFT intent.

For MVP, only Points and Badge reward intents should be active.

---

## 6. Event Model

`missions-service` should be event-driven.

In early MVP, events can be ingested through an internal HTTP endpoint. Later, this can move to a queue or event bus.

### 6.1 Event Envelope

Suggested event envelope:

- `event_id`
- `event_type`
- `source_module`
- `user_id`
- `occurred_at`
- `entity_type`
- `entity_id`
- `metadata`
- `idempotency_key`
- `signature` or gateway-auth proof for internal calls

### 6.2 Event Sources

Space events:

- `space.profile_completed`
- `space.post_created`
- `space.post_liked`
- `space.comment_created`
- `space.group_joined`

Referral events:

- `referral.claimed`
- `referral.registered`
- `referral.activated`
- `referral.became_vip`

Quest events:

- `quest.started`
- `quest.step_completed`
- `quest.completed`
- `quest.created`
- `quest.published`

RF events:

- `rf.partner_invited`
- `rf.partner_approved`
- `rf.offer_created`
- `rf.voucher_claimed`
- `rf.voucher_redeemed`

Rielt events:

- `rielt.listing_created`
- `rielt.listing_verified`
- `rielt.inquiry_created`
- `rielt.deal_confirmed`

Content events:

- `atlas.place_suggested`
- `atlas.photo_added`
- `pulse.event_created`
- `pulse.event_attended`
- `blog.article_published`
- `blog.post_featured`

---

## 7. API Surface v1

### 7.1 User-facing read endpoints

`GET /v1/missions`

Returns available missions for the authenticated user.

Query parameters:

- `status`
- `type`
- `tier`
- `scope`
- `limit`

`GET /v1/missions/{missionId}`

Returns mission details and current user's progress.

`GET /v1/missions/progress/me`

Returns all mission progress for the authenticated user.

`GET /v1/missions/chains`

Returns mission chains available to the authenticated user.

`GET /v1/missions/recommended`

Returns personalized recommended next missions.

### 7.2 User-facing action endpoints

`POST /v1/missions/{missionId}/start`

Starts a mission manually if the mission requires opt-in.

`POST /v1/missions/{missionId}/claim-reward`

Claims reward when manual claim is required.

For automatic rewards, this endpoint is not needed.

### 7.3 Internal endpoints

`POST /internal/missions/events/ingest`

Accepts confirmed domain events from trusted services.

`POST /internal/missions/reward-callback`

Receives reward execution result from Points/Badges or other reward-owning services.

### 7.4 Admin endpoints

`POST /v1/admin/missions`

Creates a mission.

`PATCH /v1/admin/missions/{missionId}`

Updates a mission.

`POST /v1/admin/missions/{missionId}/publish`

Publishes a mission.

`POST /v1/admin/missions/{missionId}/archive`

Archives a mission.

`POST /v1/admin/mission-chains`

Creates a mission chain.

`PATCH /v1/admin/mission-chains/{chainId}`

Updates a mission chain.

---

## 8. Integration with Connect

Connect is the primary user-facing showcase for missions.

Connect should display:

- active missions;
- recommended next mission;
- progress;
- rewards;
- completed missions;
- mission chains;
- future opportunities.

Connect should not own mission rules.

For MVP, Connect may read missions from `missions-service` or from a temporary internal missions implementation if a separate service is not yet created. Target architecture should move mission ownership into `missions-service`.

---

## 9. Integration with Points and Badges

`missions-service` creates reward intents.

Points executes Points rewards.

Badges are currently inside Points contour, so badge reward execution should go through Points/Badges internal endpoints.

MVP reward flow:

1. Mission completed.
2. `missions-service` creates reward intent.
3. `missions-service` calls `POST /internal/points/add` for Points reward.
4. `missions-service` calls `POST /internal/points/badges/award` for Badge reward.
5. Points returns success/failure.
6. `missions-service` marks reward intent as executed or failed.
7. Connect displays final result.

Idempotency is mandatory. Every reward intent must have a stable `idempotency_key`.

---

## 10. Integration with Guru

Guru can show contextual missions based on location.

Examples:

- RF place nearby — claim voucher mission;
- Quest point nearby — continue quest mission;
- Atlas place nearby — add review/photo mission;
- Pulse event nearby — attend event mission;
- Rielt listing nearby — verify listing or save listing mission.

Guru should not own mission progress.

Guru can request:

`GET /v1/missions/recommended?lat=...&lng=...&cityId=...`

or receive mission recommendations through a Guru aggregation endpoint that calls missions-service internally.

---

## 11. Personalization Rules

Missions can be personalized by:

- role: spacer, VIP, PRO, business partner;
- user stage: new, activated, retained, PRO candidate;
- geography: country, city, district, nearby entities;
- behavior: posted, invited, redeemed, completed, verified;
- module activity: Space-active, Quest-active, RF-active, Rielt-active;
- time: seasonal campaigns, weekly missions, event windows.

MVP personalization should be simple:

- role;
- city/country interest;
- completion state;
- mission priority.

Avoid AI-based personalization in v1.

---

## 12. Anti-Abuse and Integrity

Missions must avoid turning the ecosystem into a farming game.

Integrity controls:

- idempotency per event;
- rate limits by user and mission;
- cooldowns;
- daily and weekly caps;
- quality gates;
- domain-owner validation;
- reward caps;
- suspicious activity flags;
- manual review for high-value rewards.

Examples:

- A user should not receive repeated first-post rewards.
- Likes from suspicious accounts should not unlock high-value missions.
- Repeated edits or spam posts should not count as useful content.
- PRO/business rewards should require confirmed domain events, not self-reported actions.

---

## 13. MVP Scope

Missions MVP v1 should be deliberately small.

Recommended MVP mission categories:

1. Onboarding missions.
2. Referral missions.
3. Basic social missions.
4. First Quest completion mission.
5. First RF voucher claim/redeem mission if RF is stable enough.

Do not include in MVP:

- G2A;
- NFT;
- complex PRO revenue missions;
- business partner settlement missions;
- advanced analytics;
- AI personalization;
- multi-service campaign automation;
- user-created missions.

---

## 14. Suggested MVP Mission Catalog

Tier 0 — onboarding:

- Complete profile.
- Select country/city of interest.
- Join first group.
- Write first post.

Tier 1 — social:

- Receive first like.
- Write 3 useful posts.
- Leave first comment.

Tier 1 — referral:

- Invite first friend.
- Referral becomes active.

Tier 2 — quest:

- Complete first quest.

Tier 2 — RF:

- Claim first RF voucher.
- Redeem first RF voucher.

---

## 15. Database Model Draft

Recommended tables:

### `missions`

Stores mission definitions.

Key fields:

- `id`
- `slug`
- `title`
- `description`
- `type`
- `tier`
- `scope`
- `target_roles`
- `status`
- `visibility`
- `priority`
- `starts_at`
- `ends_at`
- `conditions_json`
- `rewards_json`
- `source_module`
- `chain_id`
- `created_by`
- `created_at`
- `updated_at`

### `mission_chains`

Stores journey/track definitions.

Key fields:

- `id`
- `slug`
- `title`
- `description`
- `target_roles`
- `status`
- `unlock_policy_json`
- `created_at`
- `updated_at`

### `mission_chain_items`

Stores ordered mission membership in chains.

Key fields:

- `chain_id`
- `mission_id`
- `position`
- `unlock_condition_json`

### `user_mission_progress`

Stores per-user progress.

Key fields:

- `id`
- `user_id`
- `mission_id`
- `status`
- `progress_current`
- `progress_required`
- `started_at`
- `completed_at`
- `claimed_at`
- `expired_at`
- `reward_status`
- `last_event_id`
- `metadata_json`
- `created_at`
- `updated_at`

Unique constraint:

- `(user_id, mission_id)`

### `mission_events`

Stores ingested events for idempotency and audit.

Key fields:

- `event_id`
- `event_type`
- `source_module`
- `user_id`
- `entity_type`
- `entity_id`
- `occurred_at`
- `metadata_json`
- `idempotency_key`
- `processed_at`
- `created_at`

Unique constraints:

- `event_id`
- `idempotency_key`

### `mission_reward_intents`

Stores reward execution requests.

Key fields:

- `id`
- `mission_id`
- `user_id`
- `reward_type`
- `target_service`
- `amount`
- `badge_code`
- `access_code`
- `reason`
- `external_id`
- `status`
- `idempotency_key`
- `created_at`
- `executed_at`
- `failed_at`
- `error_message`

Unique constraint:

- `idempotency_key`

---

## 16. Service Boundaries

### Missions vs Quest

Quest owns quest scenario progress. Missions can define meta-goals around Quest activity.

Example:

- Quest owns: step completed.
- Missions owns: completed first quest, completed 3 quests in Bangkok.

### Missions vs Connect

Connect displays mission state. Missions owns mission rules and progress.

### Missions vs Points

Missions creates reward intents. Points executes ledger writes.

### Missions vs Referral

Referral owns referral graph. Missions can reward milestone behaviors around referral activation.

### Missions vs RF

RF owns partners, offers, vouchers, redemptions. Missions can guide users and PROs around RF milestones.

### Missions vs Rielt

Rielt owns listings and inquiries. Missions can guide owners/PROs/users around listing creation, verification, and successful inquiry flows.

### Missions vs Space

Space owns posts, comments, groups, likes. Missions can reward meaningful social contribution but should not validate content quality alone.

---

## 17. Readiness and Sequencing

Do not implement `missions-service` before the core event sources are stable enough.

Recommended sequencing:

1. Keep current Connect missions screen as placeholder or simple frontend shell.
2. Stabilize RF domain model.
3. Stabilize Rielt integration boundaries.
4. Stabilize Quest media/proof/reward flow.
5. Define event contracts across Space/RF/Rielt/Quest/Referral/Points.
6. Implement Missions MVP with onboarding/referral/basic social.
7. Add RF/Rielt/Quest mission families gradually.
8. Add contextual Guru missions.
9. Add PRO/business/seasonal campaigns.

---

## 18. Open Questions

- Should missions be manually claimable or auto-claimed by default?
- Should every mission require opt-in, or can some be passive/background missions?
- How many active missions should a user see at once?
- Which mission rewards should require manual review?
- Should PRO users be allowed to create mission templates, or only admins?
- Should seasonal missions be global, country-level, city-level, or partner-level?
- How should mission expiration affect partially completed progress?
- Should Missions emit events back into Space or Feed for social visibility?

---

## 19. Final Architecture Rule

`missions-service` should remain a thin orchestration and progress layer.

It must not become a hidden monolith that owns rewards, content, business logic, social truth, quest proof, or tokenomics.

The correct responsibility is:

> Confirmed domain events in → mission progress and reward intents out.

---

## 20. Final Summary

`missions-service` is the future Go2Asia engagement engine.

It turns ecosystem activity into structured user goals, helps users understand what to do next, and connects valuable actions with rewards without taking ownership away from the services that actually own the underlying facts.

For MVP, the service should start with onboarding, referral, and basic social missions only. More complex RF, Rielt, Quest, PRO, Guru-contextual, G2A, and NFT missions should be added after their domain sources are stable.
