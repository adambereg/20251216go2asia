# Stage 13B.4-C0 - First Foundation Slice Authorization

## 1. Executive Summary

Runtime remains: RUNTIME_PRE_TRANSITION.

Implementation has not started.

Stage 13B.4-A is accepted with status: AUTHORIZED_FOR_13B_4_B_ONLY.

Stage 13B.4-B is accepted with status: FOUNDATION_TRIO_PLANNING_COMPLETE.

This document is a governance and authorization report. It does not implement anything. Its only purpose is to choose the safest first implementation slice from the Foundation Trio candidate set.

Final recommendation:

FIRST_SLICE_AUTHORIZATION_RECOMMENDED

Selected first slice:

FT-1A — Retention Intent

Recommended authorization status:

AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_1A_RETENTION_INTENT_ONLY

## 2. Candidate Slice Review

Candidate set reviewed:

- FT-1A through FT-1H
- FT-3A through FT-3I
- FT-5A through FT-5G
- FT-X1 through FT-X3

### WS-1 candidates

| Slice | Purpose | Dependencies | Risk | Suitability as first slice |
| --- | --- | --- | --- | --- |
| FT-1A Retention Intent | Establish save-for-myself as Private Repost intent | None | Save remains public repost if not followed through | Excellent |
| FT-1B Owner Visibility | Establish owner/non-owner/public/group visibility boundaries | FT-1A | Hidden UI without owner proof | Not first |
| FT-1C Private Note | Establish optional text as private note | FT-1A | Public commentary survives | Not first |
| FT-1D Retention Dedupe | Scope dedupe to retention only | FT-1A, FT-3A awareness | Authorial Post blocked by dedupe | Not first |
| FT-1E Bookmark Separation | Separate Reactions bookmark from Private Repost | FT-1A | Saved tab becomes false Private Repost proof | Not first |
| FT-1F Legacy Boundary Handshake | Distinguish Private Repost from legacy rows | FT-1A, FT-5A/FT-5B awareness | Legacy masks missing owner surface | Not first |
| FT-1G Activity Silence Contract | Define no pressure from Private Repost | FT-1A, WS-6 later | Activity rewrite drift | Not first |
| FT-1H WS-1 Closure Evidence | Roll up WS-1 proof | FT-1A through FT-1G | Premature WS-1 closure | Not first |

### WS-3 candidates

| Slice | Purpose | Dependencies | Risk | Suitability as first slice |
| --- | --- | --- | --- | --- |
| FT-3A Authorial Expression | Establish Authorial Post as publish-my-thoughts | FT-1A awareness | Expression without retention | Unsafe first |
| FT-3B Source Reference | Establish one-hop source context | FT-3A | repostTarget rename drift | Unsafe first |
| FT-3C Authorial Independence | Establish author text primacy | FT-3A, FT-3B | Weak content passes as authorial | Unsafe first |
| FT-3D Save/Publish Split | Prove retention and expression are separate | FT-1A, FT-3A | Joint proof before primitives | Unsafe first |
| FT-3E Group Expression Semantics | Define group expression as Authorial Post | FT-3A | Group feed false pass | Unsafe first |
| FT-3F Source Ownership Boundary | Preserve source module ownership | FT-3B | Source leakage or provenance drift | Unsafe first |
| FT-3G Profile Authorial Classification | Separate authorial output from reposts | FT-3A, WS-5 | Profile metrics false pass | Unsafe first |
| FT-3H Legacy Distinction Handshake | Prevent legacy auto-promotion | FT-5A/FT-5B, FT-3A | Legacy becomes authorial canon | Unsafe first |
| FT-3I WS-3 Closure Evidence | Roll up WS-3 proof | FT-3A through FT-3H | Premature WS-3 closure | Unsafe first |

### WS-5 candidates

| Slice | Purpose | Dependencies | Risk | Suitability as first slice |
| --- | --- | --- | --- | --- |
| FT-5A Legacy Taxonomy | Classify legacy artifact classes | None | Taxonomy-only false pass | Reserve only |
| FT-5B Distinction Rule | Define legacy vs post-transition decision rule | FT-5A | BV_FAIL_AMBIGUITY if premature | Not first |
| FT-5C Forbidden Transformations | Prevent auto-convert/delete/rewrite | FT-5A | Guard without primitives | Not first |
| FT-5D Policy Gate Resolution | Record legacy policy stances/carve-outs | FT-5A, FT-5B | Policy becomes implementation substitute | Not first |
| FT-5E Per-Surface Legacy Matrix | Map feed/activity/profile/highlight legacy classes | FT-5A, FT-5B | Legacy masks missing paths | Not first |
| FT-5F Cross-Workstream Verification Contract | Tie legacy to WS-1/WS-3 proof | FT-5B, FT-1A, FT-3A | Verification before primitives | Not first |
| FT-5G WS-5 Closure Evidence | Roll up WS-5 proof | FT-5A through FT-5F | Premature WS-5 closure | Not first |

### Cross-slice candidates

| Slice | Purpose | Dependencies | Risk | Suitability as first slice |
| --- | --- | --- | --- | --- |
| FT-X1 Primitive Boundary Matrix | Lock boundaries across primitives | WS-1/WS-3/WS-5 primitives | Boundary matrix before primitives | Unsafe first |
| FT-X2 Foundation Evidence Spine | Define proof index | FT-X1 | Evidence shell without behavior | Unsafe first |
| FT-X3 Trio Closure Gate | Decide readiness for WS-2 | FT-X2 and Trio proof | Premature WS-2 entry | Unsafe first |

## 3. First Slice Selection Criteria

Selection criteria:

- minimal blast radius;
- lowest dependency count;
- no downstream workstream dependency;
- no API/DB/UI/copy/activity/group feed requirement;
- low false-pass risk;
- high value for Foundation Trio;
- alignment with AUTHORIZED_FOR_13B_4_B_ONLY;
- ability to produce observable proof without claiming full WS-1 or Trio closure.

FT-1A is the only candidate that satisfies all criteria.

## 4. Authorization Risk Matrix

Risk scale: LOW, MEDIUM, HIGH.

| Candidate group | Implementation risk | Verification risk | False-pass risk | Dependency risk |
| --- | --- | --- | --- | --- |
| FT-1A | LOW | LOW | MEDIUM | LOW |
| FT-1B to FT-1C | MEDIUM | MEDIUM | HIGH | MEDIUM |
| FT-1D | HIGH | HIGH | HIGH | HIGH |
| FT-1E | MEDIUM | MEDIUM | MEDIUM | MEDIUM |
| FT-1F to FT-1H | MEDIUM | HIGH | HIGH | HIGH |
| FT-3A | HIGH | HIGH | HIGH | HIGH |
| FT-3B to FT-3I | HIGH | HIGH | HIGH | HIGH |
| FT-5A | MEDIUM | MEDIUM | HIGH | LOW |
| FT-5B to FT-5G | MEDIUM | HIGH | HIGH | HIGH |
| FT-X1 to FT-X3 | LOW to HIGH | HIGH | HIGH | HIGH |

Interpretation:

- FT-1A is the only LOW/LOW/MEDIUM/LOW candidate.
- FT-5A has low dependency risk but high false-pass risk because taxonomy alone is not alignment.
- FT-3A and all later WS-3 slices are unsafe before retention intent is established.
- FT-X slices are closure artifacts and cannot be first.

## 5. Unsafe First Slice Candidates

Unsafe as first implementation slice:

- all FT-3A through FT-3I: expression before retention;
- all FT-X1 through FT-X3: closure before primitives;
- FT-1D: dedupe before authorial interaction is safe;
- FT-1H, FT-3I, FT-5G: closure before evidence;
- FT-5B through FT-5G: legacy proof before taxonomy and post-transition primitives;
- FT-1B and FT-1C: visibility/note proof before intent boundary;
- FT-5A as primary: taxonomy-only false pass risk.

Why FT-5A is reserve only:

- it has no hard dependency;
- it can help prepare legacy thinking;
- but it does not create retention or expression behavior;
- it must not be counted as Foundation Trio progress by itself.

## 6. Recommended First Slice

Primary recommendation:

FT-1A — Retention Intent

Why:

- it has no internal dependencies;
- it is inside WS-1, the only workstream authorized next by 13B.4-A;
- it establishes the first necessary semantic boundary: save-for-myself is not public repost;
- it has the lowest blast radius;
- it does not require API, DB, UI, copy, activity, group feed, Source Reference, or legacy data changes at authorization level;
- it enables later FT-1B, FT-1C, FT-1E, and eventually FT-1D.

Reserve candidate 1:

FT-5A — Legacy Taxonomy

Use only if FT-1A is blocked by governance, not as substitute for FT-1A. FT-5A must remain taxonomy-only and must not count as runtime alignment.

Reserve candidate 2:

None recommended.

Reason:

- FT-3A would create expression before retention;
- FT-1B/FT-1C depend on FT-1A;
- FT-X slices are closure-level;
- choosing a weak second reserve is more dangerous than holding the gate.

## 7. Authorization Preconditions

Before FT-1A authorization becomes active:

1. Stage 13B.4-A accepted.
2. Stage 13B.4-B accepted.
3. Runtime baseline RUNTIME_PRE_TRANSITION acknowledged.
4. False-pass catalog from WS-8 and 13B.4-B adopted as blocking policy.
5. No scope expansion into WS-2, WS-3, WS-4, WS-5, WS-6, WS-7, or WS-8.
6. Foundation Trio invariants accepted:
   - retention is not expression;
   - retention binding is not Source Reference;
   - legacy is not post-transition behavior;
   - hiding/renaming is not alignment.
7. FT-1A must not claim WS-1 closure or Foundation Trio closure.

## 8. Recommended Authorization Wording

Recommended authorization status:

AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_1A_RETENTION_INTENT_ONLY

Official authorization text:

Stage 13B.4-C0 authorizes only the first Foundation Trio implementation slice: FT-1A Retention Intent under WS-1 Private Repost. This authorization allows work only on establishing the save-for-myself retention intent boundary as the first step toward Private Repost runtime alignment. It does not authorize FT-1B through FT-1H, any WS-3 slice, any WS-5 slice, any cross-slice FT-X work, WS-2 entry, UI/copy changes, activity changes, group feed changes, API/DB/schema/OpenAPI/SDK changes, migrations, legacy data deletion, or BV execution. Runtime remains RUNTIME_PRE_TRANSITION until future implementation and verification stages prove otherwise.

Authorization token:

stage_13B_4_C0_authorization_status: AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_1A_RETENTION_INTENT_ONLY

## 9. Transition After First Slice

After FT-1A completion, the next gate should be:

FT_1B_OWNER_VISIBILITY_SLICE_AUTHORIZATION_GATE

This next gate should verify:

- FT-1A retention intent boundary is accepted;
- no false-pass signals were introduced;
- no downstream workstream was bundled into FT-1A;
- owner/non-owner/public/group visibility can be considered next without claiming full WS-1 closure.

FT-1A completion does not authorize:

- FT-1B automatically;
- FT-1C through FT-1H;
- WS-3;
- WS-5;
- WS-2 entry;
- Foundation Trio closure.

Governance flow:

13B.4-C0 accepted  
-> FT-1A implementation  
-> FT-1A completion review  
-> FT-1B authorization gate  
-> later WS-1 bounded proof  
-> later WS-3/WS-5 sub-authorization  
-> FT-X closure  
-> WS-2 authorization

## 10. Final Decision

Final status:

FIRST_SLICE_AUTHORIZATION_RECOMMENDED

Selected slice:

FT-1A — Retention Intent

Why:

- it is the safest first implementation slice;
- it matches the accepted 13B.4-A cutline;
- it begins WS-1 without pretending to close WS-1;
- it creates the first semantic foundation needed before WS-2;
- it avoids expression-before-retention, taxonomy-only, and closure-before-evidence false passes.

Next steps required:

- accept this Stage 13B.4-C0 report;
- activate authorization status AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_1A_RETENTION_INTENT_ONLY;
- proceed to FT-1A implementation only;
- require a new gate after FT-1A before FT-1B or any other slice.

Planning tokens:

stage_13B_4_C0_status: FIRST_SLICE_AUTHORIZATION_RECOMMENDED  
stage_13B_4_C0_execution_mode: READ_ONLY_FIRST_FOUNDATION_SLICE_AUTHORIZATION  
stage_13B_4_C0_runtime_state: RUNTIME_PRE_TRANSITION  
stage_13B_4_C0_selected_slice: FT_1A_RETENTION_INTENT  
stage_13B_4_C0_primary_authorization: AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_1A_RETENTION_INTENT_ONLY  
stage_13B_4_C0_backup_candidate_1: FT_5A_LEGACY_TAXONOMY_RESERVE_ONLY  
stage_13B_4_C0_backup_candidate_2: NONE_RECOMMENDED  
stage_13B_4_C0_implementation_started: FALSE  
stage_13B_4_C0_migrations_proposed: FALSE  
stage_13B_4_C0_api_design_proposed: FALSE  
stage_13B_4_C0_db_design_proposed: FALSE  
stage_13B_4_C0_ui_design_proposed: FALSE  
stage_13B_4_C0_copy_rewrite_proposed: FALSE  
stage_13B_4_C0_runtime_changes_proposed: FALSE  
stage_13B_4_C0_next_gate: FT_1B_OWNER_VISIBILITY_SLICE_AUTHORIZATION_GATE
