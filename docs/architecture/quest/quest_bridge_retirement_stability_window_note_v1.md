# Quest Bridge Retirement Stability Window Note v1

**Project:** Go2Asia  
**Module:** Quest Asia  
**Document role:** Bounded post-1.5B stability window and bridge retirement note  
**Status:** Planning anchor (pre-implementation)  
**Depends on:** `quest_wave_1_5b_closure_note_v1.md`, `quest_post_1_5b_sequencing_note_v1.md`, `adr_0024_quest_runtime_metadata_canonicalization.md`

---

# 1. Short Verdict

After 1.5B closure, Quest metadata runtime path is the normal path for `/quest` and `/quest/[id]`.

The remaining bridge is an emergency-only static fallback behind env flag. A dedicated stability window is required to validate operational confidence before removing that bridge.

---

# 2. Stability Window Definition

## 2.1 Scope in this window

- `/quest` (catalog cards and summaries)
- `/quest/[id]` (hero, summary, gallery)

`/quest/[id]/run` is monitored only for boundary safety (no quest-level metadata leak into step payload), not for new UX work.

## 2.2 What is observed

- runtime metadata availability on list/detail responses
- visual parity on catalog/detail for target quest set
- emergency fallback hits (should trend to near-zero)
- draft/private safety (non-public content must remain hidden)
- step boundary safety (`requirements.contentV2` remains step-scoped)

## 2.3 What is not included

- map work
- proof UX expansion
- verification/anti-fraud hardening
- social/my-quests/leaderboard growth surfaces

---

# 3. Bridge Retirement Criteria

Emergency fallback can be retired only when all criteria are true:

1. Runtime metadata is present and usable for target quest set on `/quest` and `/quest/[id]`.
2. No material visual regressions for card hero/summary/gallery in normal flows.
3. Emergency fallback is not required as routine behavior during stability window.
4. Draft/private semantics remain intact (no leakage into public list/detail).
5. Step boundary remains intact (no quest-level metadata moved into step payload).
6. No new regressions appear in Quest read surfaces during confidence window.

---

# 4. Recommended Retirement Strategy

Use **staged retirement with a short confidence window**:

1. Keep emergency path gated by env flag only.
2. Observe stability/parity for the bounded target quest set.
3. Run a dedicated retirement implementation pass to remove emergency bridge from code paths.

Do not mix this retirement pass with proof/map/verification/growth work.

---

# 5. What Comes Next

After bridge retirement, the next recommended pass is **Proof UX Completion**.

Then follow with:

1. Map pass (post-1.5B, separate by ADR)
2. Verification hardening / anti-fraud
3. Social / my-quests / leaderboard expansion

---

# 6. Prompt-Ready Boundary

This note defines only the stability window and retirement criteria.

Any implementation prompt based on this note must stay limited to bridge retirement mechanics and parity verification on `/quest` and `/quest/[id]`.

