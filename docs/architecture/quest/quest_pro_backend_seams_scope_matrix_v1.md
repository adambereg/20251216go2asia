# Quest PRO Backend Seams Scope Matrix v1

**Project:** Go2Asia  
**Module:** Quest Asia  
**Document role:** Scope guardrail for bounded backend seams before PRO Console  
**Status:** Active planning constraint  
**Depends on:** `quest_pro_backend_seams_definition_v1.md`

---

## 1. In scope

- ownership seams around `creator_pro_id` for owner/admin control paths
- owner-scoped read models (e.g. "my quests", owned quest detail, draft visibility for owner)
- lifecycle tightening for `draft / published / archived` transitions
- bounded draft update seams for quest-level and basic step-level maintenance
- manual review seams (pending queue shaping, owner-scoped review operations, review metadata completeness)
- reference seams to Atlas/Pulse/RF through bounded `target_type`/`target_id` integrity rules
- curator stats minimum for operational quest management (not BI platform)
- permission hooks for `pro`/`admin` management capabilities
- revision/audit basics (minimal change/review traceability)

---

## 2. Out of scope

- PRO Console UI
- visual quest builder
- workflow editor / drag-and-drop authoring
- full CMS-like versioning platform
- full moderation console
- broad analytics platform
- player-facing Quest UX redesign
- map/proof/social implementation passes
- platform-wide authoring architecture redesign

---

## 3. Explicitly deferred

- private-access / invite model for players on published private quests
- collaborative editing (multi-editor coordination, locking, merge semantics)
- rich revision graph (branching, rollback UX, compare tools)
- advanced moderation tooling beyond bounded review seams
- cross-module orchestration engines (Quest + Atlas + Pulse + RF as full authoring graph)
- growth/social surfaces (`my quests`, `leaderboard`, social loops)

---

## 4. Operational guardrails for next implementation pass

- Any item requiring PRO Console interaction design is deferred unless it is a strict backend seam prerequisite.
- Any item changing player runtime semantics, trust model, or anti-fraud behavior is out of this scope.
- Any item introducing a generic authoring platform capability is out unless explicitly approved as bounded minimum.
- Implementation slices must be backend-only and independently shippable.
