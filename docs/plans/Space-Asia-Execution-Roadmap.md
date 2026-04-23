# Space Asia Execution Roadmap

**Project:** Go2Asia
**Module:** Space Asia
**Document role:** Execution governance for phased Space Asia rollout
**Status:** Draft v1

---

## 1. Purpose

This document fixes the practical rollout order for Space Asia.

It exists to ensure that Space is developed:

* from real data, not from empty shells;
* from runtime truth, not from UI wishes;
* in bounded phases, not as one oversized rollout.

Short principle:

> **content → runtime → surfaces**

---

## 2. Core Rollout Rule

Space Asia must be activated in honest layers.

Each next phase starts only when the previous one is already real enough.

Short formula:

> **feed → group context → profile → activity → saved → organizer → ecosystem signals → community expansion**

---

## 3. Phase Order

## Phase 1 — Social Data Foundation

Materialize the minimum social reality:

* profile projections
* public groups
* memberships
* posts
* reposts
* group posts

**Goal:** make Space non-empty and socially believable.

**Done when:**

* home feed is non-empty
* group feed is non-empty
* users and groups render as real social entities

---

## Phase 2 — Runtime Hardening

Strengthen the runtime baseline:

* public groups create/get/join/leave
* public group feed behavior
* focused tests
* contract/runtime confidence

**Goal:** make public groups operational-with-confidence.

**Done when:**

* public group runtime is stable
* baseline group operations are covered by tests
* public group feed works as a dependent runtime path

---

## Phase 3 — Core Social Entry Surface

Activate the main social entry point:

* `/space`
* runtime-backed home feed
* real post cards
* visible group-origin signals in feed

**Goal:** make Space visibly alive as a social module.

**Done when:**

* `/space` is no longer mock-like
* feed clearly reflects real social content
* group context begins to appear inside live feed

---

## Phase 4 — Public Group Context

Activate groups as real social containers:

* public group identity surface
* public group feed surface
* public join/leave baseline

**Goal:** make group = community context, not feed filter.

**Done when:**

* a public group can be opened as a real social surface
* group identity is visible
* group feed is clearly group-scoped

---

## Phase 5 — Personal Social Surfaces

Activate user-facing social identity:

* public profile
* profile feed
* my posts / authored posts

**Goal:** make the user visible as a social actor inside Space.

**Done when:**

* user profile feels real
* authored content is visible
* PRO remains a normal Space participant, not a console-only actor

---

## Phase 6 — Activity Layer

Activate social response surfaces:

* activity feed
* visible reactions-based response signals
* bounded no-chat communication mirrors

**Goal:** make Space socially responsive.

**Done when:**

* activity is non-empty
* users see visible response around their content

---

## Phase 7 — Saved Surface

Activate the practical selection layer:

* saved posts
* saved places
* saved events
* saved listings
* saved partners
* saved quests

**Goal:** make Space useful not only socially, but practically.

**Done when:**

* saved surface reflects real user selections
* linked objects feel meaningful

---

## Phase 8 — Organizer Baseline

Activate bounded personal coordination:

* organizer preview
* limited organizer surface
* reminders / follow-ups / growth goals / saved actions

**Goal:** make Space answer “what should I do next?”

**Done when:**

* organizer reads as ecosystem coordination
* it does not feel like an abstract task manager

---

## Phase 9 — Ecosystem Signals

Activate lightweight summary widgets:

* balance summary
* voucher summary
* referral summary
* NFT/badge summary
* quest progress summary
* inquiry/application summary

**Goal:** make Space feel like the human-facing center of the ecosystem.

**Done when:**

* summaries are honest
* Space remains an aggregator, not source of truth for adjacent domains

---

## Phase 10 — Community Expansion

Activate the broader community layer:

* `/space/community`
* public group list
* bounded group discovery
* selected featured/recommended groups

**Goal:** turn community into a real entry surface.

**Done when:**

* `/space/community` is no longer a placeholder
* users can discover and enter real groups

---

## 4. What Must Stay Later

The following must remain deferred until earlier phases are stable:

* private groups UX
* invite-only flows
* advanced membership edge cases
* moderation suite
* deep reactions-rich rendering
* assistant execution surfaces
* full automation
* schema-level `group_type`
* operational PRO overlays inside Space
* reopening `feed-service vs space-service` architecture

---

## 5. Governance Rule

Do not ask Cursor to “build all Space Asia”.

Instead, move one phase at a time.

Before opening the next phase, verify:

* seed content exists
* runtime support exists
* current surface is honestly live
* unresolved debt does not make the next phase premature

---

## 6. Final Summary

Space Asia should be built from the bottom up:

> **social reality first, broad module later**

Short final formula:

> **data → runtime → feed → groups → profiles → activity → saved → organizer → signals → community**
