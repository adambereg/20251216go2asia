# ADR 0027: Quest PRO Console First UI Scope Is Bounded and Management-First

**Status:** Accepted  
**Date:** 2026-04-11  
**Owners:** Go2Asia architecture / Quest module maintainers  
**Related docs:** `docs/architecture/quest/quest_pro_backend_seams_closure_note_v1.md`, `docs/architecture/quest/quest_pro_console_quest_slice_definition_v1.md`

---

## Context

Quest backend seam set has been closed at bounded foundation level:

- owner-scoped reads
- lifecycle tightening
- bounded draft update seams
- manual review seam completion
- curator stats minimum
- permission hooks + baseline management audit events

The next phase is PRO Console planning + UI.  
A key risk at this stage is premature expansion into a broad curator platform (rich builder, analytics platform, moderation platform, cross-module shell) before first Quest UI wave is proven.

---

## Problem

How should first PRO Console UI scope for Quest be defined so that:

1. it is immediately implementable on top of existing backend seams,
2. it avoids scope drift into whole-console platform design,
3. it remains independently shippable and operationally useful?

---

## Options considered

## Option A — Build wide scope immediately

Start with rich builder + advanced analytics + broader console shell.

**Pros**

- ambitious long-term surface appears earlier

**Cons**

- high delivery risk and schedule volatility
- re-opens architecture questions unrelated to first Quest value
- violates bounded-first sequencing discipline

---

## Option B — Bounded Quest-first management UI (selected)

Start with Quest-only, management-first first wave:

- `My quests`
- quest management detail
- bounded draft editing/step management
- lifecycle controls
- review queue
- curator stats minimum block

**Pros**

- aligns directly with closed backend seam set
- clear implementation slices and acceptance criteria
- limits architecture churn and scope drift

**Cons**

- rich builder and broader platform capabilities arrive later

---

## Option C — Delay UI until further backend expansion

Add more backend abstractions first, then plan UI.

**Pros**

- potentially richer backend before UI starts

**Cons**

- unnecessary delay after explicit seam closure
- increases risk of backend over-building without UI feedback

---

## Decision

Adopt **Option B**.

First Quest PRO Console UI wave is explicitly **bounded and management-first**.  
The first practical implementation slice is fixed as:

**Quest PRO Console UI-1: Management shell + My quests + Quest detail (read-first)**.

---

## Consequences

### Positive

- UI planning and implementation can start immediately against known backend seams.
- Scope guardrails are explicit and enforceable.
- Quest PRO Console delivery can proceed in small, verifiable slices.

### Trade-offs

- Deferred features (rich builder, advanced analytics, broad shell) require later dedicated planning.

### Explicit non-goals for first wave

- full visual builder
- analytics/reporting platform
- moderation platform
- cross-module PRO Console platform architecture

---

## Follow-up

Use Quest slice doc-pack as SSOT for first implementation wave and keep all implementation prompts constrained by the scope matrix and execution plan.
