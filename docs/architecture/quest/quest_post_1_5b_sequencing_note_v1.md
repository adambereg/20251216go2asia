# Quest Post-1.5B Sequencing Note v1

**Project:** Go2Asia  
**Module:** Quest Asia  
**Document role:** Short sequencing note after Wave 1.5B closure  
**Status:** Active planning anchor  
**Depends on:** `quest_wave_1_5b_closure_note_v1.md`, `quest_wave_1_5b_execution_roadmap_v1.md`, `adr_0024_quest_runtime_metadata_canonicalization.md`, `adr_0025_quest_map_scope_post_1_5b.md`

---

# 1. Why This Note Exists

Quest Wave 1.5B is closed for quest-level metadata migration scope.

This note fixes the next practical order so follow-up passes do not reopen 1.5B or mix unrelated scope.

---

# 2. Recommended Post-1.5B Order

## Pass 1 — Bridge Retirement and Stability Window

**Goal:** Confirm runtime metadata stability and retire emergency static fallback path after confidence window.  
**Why now:** Clears transitional architecture before adding new product logic.  
**Do not mix:** proof/map/verification feature work.

## Pass 2 — Proof UX Completion

**Goal:** Complete proof submission UX as product flow (still within existing Quest runtime semantics).  
**Why here:** Metadata/cutover base is already stable; this is the next user-facing bottleneck.  
**Do not mix:** anti-fraud hardening and map implementation in the same pass.

## Pass 3 — Quest Map Pass (Post-1.5B)

**Goal:** Add bounded map layer per ADR-0025.  
**Why here:** Explicitly post-1.5B by decision; should build on stable quest-level metadata/runtime surfaces.  
**Do not mix:** verification hardening, social surfaces, contract redesign.

## Pass 4 — Verification Hardening / Anti-Fraud

**Goal:** Tighten validation and trust model for submissions.  
**Why here:** Should follow stabilized proof UX and map behaviors.  
**Do not mix:** new UI product surfaces (my quests/leaderboard/social).

## Pass 5 — Social / My Quests / Leaderboard Surfaces

**Goal:** Expand growth/community surfaces after core quest flows are stable.  
**Why here:** Broadest scope, weakest dependency on 1.5B canonicalization internals.  
**Do not mix:** core runtime contract rewrites.

---

# 3. Immediate Next Pass

**Nearest next pass:** Pass 1 — Bridge Retirement and Stability Window.

This is the smallest and safest step after 1.5B closure with explicit debt note.

---

# 4. Visible Later-Phase Work

- Proof UX completion
- Map pass (separate, post-1.5B by ADR)
- Verification hardening
- Social/my-quests/leaderboard expansion

These are valid next waves, but should remain separate bounded passes.

---

# 5. What Not To Start Early

- Do not reopen 1.5B metadata model debates.
- Do not run map/proof/verification in one mixed pass.
- Do not expand to social surfaces before core proof/verification stabilization.
- Do not reintroduce static mapping as default runtime path.

