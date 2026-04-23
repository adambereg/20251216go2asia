# Quest Wave 1.5B Definition v1

**Project:** Go2Asia  
**Module:** Quest Asia  
**Document role:** SSOT definition for Wave 1.5B  
**Status:** Approved for planning and implementation slicing  
**Depends on:** `quest_wave1_execution_brief_v1.md`, `quest_frontend_live_adoption_milestone_note_v1.md`, `quest_domain_model_v1.md`, `docs/architecture/media/media_domain_model_v1.md`, `docs/architecture/Go2Asia_Canon_Architecture_v1.0.md`

---

# 1. Purpose

This document defines exactly what Quest Wave 1.5B is and what it is not.

It exists to prevent scope drift before implementation passes start.

---

# 2. Preferred Naming

**Preferred wave name:**

> **Quest Wave 1.5B: Runtime Metadata Canonicalization**

Rationale:

- the wave is about canonical runtime metadata truth
- the wave is not a UI polishing pass
- the wave is not proof hardening
- the wave is not map implementation

---

# 3. Current Problem Statement

After Wave 1 and bounded media hookup:

- quest runtime lifecycle is live and usable
- step-level presentation/media uses runtime-first `requirements.contentV2`
- quest-level cover/gallery still depends on hybrid content/frontend mapping

This means quest-level product presentation is not yet canonical runtime truth.

---

# 4. Definition of Wave 1.5B

Quest Wave 1.5B is a bounded architecture-to-contract wave that:

1. defines the target quest-level metadata model
2. defines the target truth model (`authoring -> runtime -> frontend consumption`)
3. defines runtime contract deltas (API/SDK planning level)
4. defines migration policy away from quest-level static frontend mapping as primary source
5. keeps step-level `contentV2` boundaries explicit and non-mixed with quest-level metadata

Wave 1.5B is successful when quest-level presentation/media can be consumed from runtime contracts as canonical truth, with only temporary and explicit bridge policy where needed.

---

# 5. Why It Must Happen Now

Wave 1 created the live activity baseline (`/quest`, `/quest/[id]`, `/quest/[id]/run` + progress/submission state machine).

Bounded media hookup improved UX, but intentionally introduced a transitional hybrid model for quest-level media.

Without Wave 1.5B:

- catalog/detail remain coupled to static mapping maintenance
- content evolution risk increases with each new quest
- runtime/frontend truth alignment remains fragile

---

# 6. What Wave 1.5B Is Not

## 6.1 Not Wave 1 baseline

Wave 1 delivered core runtime activity and lifecycle.  
Wave 1.5B does not re-open Wave 1 activity semantics.

## 6.2 Not bounded Wave 1.5 media hookup

Bounded media hookup was a transitional UX pass.  
Wave 1.5B is the canonicalization pass that follows it.

## 6.3 Not proof UX completion

No upload-product completion, no scanner-first flow, no proof interaction redesign.

## 6.4 Not verification hardening / anti-fraud

No strict anti-cheat, no hard proximity security redesign.

## 6.5 Not map implementation pass

Map is intentionally post-1.5B and handled in separate ADR-backed pass.

## 6.6 Not Wave 2 expansion

No my-quests product expansion, no leaderboards, no social/Space growth surfaces, no PRO authoring scope.

---

# 7. Transition Principle

Markdown/content layer remains authoring truth.

Runtime must become canonical consumption truth for quest-level metadata.

Temporary bridge/fallback is acceptable only as migration policy, never as permanent primary model.

---

# 8. Final Verdict

Quest Wave 1.5B is required and should be executed as a bounded canonicalization wave, not as a feature wave.

The correct sequencing is: stabilize metadata truth first, then run separate passes for proof UX, map layer, and verification hardening.
