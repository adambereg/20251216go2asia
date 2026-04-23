# Quest PRO Console — Quest Slice Definition v1

**Project:** Go2Asia  
**Module:** Quest Asia  
**Document role:** SSOT definition for Quest-first PRO Console UI slice  
**Status:** Planning-only; no implementation included  
**Depends on:** `quest_pro_backend_seams_closure_note_v1.md`, `quest_pro_backend_seams_execution_plan_v1.md`, `adr_0026_quest_backend_seams_before_pro_console.md`

---

## 1. Definition

**Quest PRO Console — Quest slice** is the first bounded PRO UI layer focused only on Quest authoring and Quest management operations that already have backend seam support.

This slice is not a full curator platform.  
It is a Quest-scoped management surface designed to operationalize existing backend seams without introducing new platform-wide concerns.

---

## 2. Why now

Quest backend seam set is closed on bounded minimum:

- owner-scoped management reads
- lifecycle transitions (`draft -> published -> archived`)
- bounded draft update seams
- manual review seam completion
- curator stats minimum
- permission hooks and baseline management audit events

Because this seam set is closed, UI planning can now be done against stable backend shape rather than speculative backend assumptions.

---

## 3. Why Quest slice only

This pass intentionally scopes to Quest-only UI architecture.

It does not attempt to design a single PRO Console for all modules (Pulse/RF/Space/etc.) because that would:

- dilute Quest delivery focus
- re-open unresolved cross-module product questions
- create premature shell/platform coupling before first bounded UI wave is proven

Quest slice is treated as an independently shippable first PRO UI increment.

---

## 4. First-wave product posture

First Quest PRO UI wave is **management-first and read-first** with bounded mutation surfaces:

- `My quests` and quest management detail as primary control plane
- bounded draft editing and step maintenance
- lifecycle controls with readiness/conflict feedback
- review queue operations
- minimum curator stats block

This wave explicitly avoids building a rich visual builder in v1.

---

## 5. Non-goal statement

This definition does not include:

- implementation slices or code changes
- full visual quest builder
- broad console shell/platform architecture
- analytics/moderation/IAM platform design

These areas are intentionally deferred to later phases after Quest-first UI wave validation.
