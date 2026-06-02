# Stage 13B.4-A - Implementation Authorization Gate / Cutline

## 1. Executive Summary

Stage 13B.3 is conceptually complete at specification level, but runtime is still pre-transition and implementation is not authorized yet.

This report establishes an authorization gate and cutline before any code changes. It defines:

- what is authorized next;
- what remains forbidden;
- what belongs to first-wave implementation planning;
- what is unsafe to touch now;
- how dependencies between WS-1 through WS-8 must be respected;
- what will count as false pass.

Final gate decision in this report:

FINAL_AUTHORIZATION_STATUS: AUTHORIZED_FOR_13B_4_B_ONLY

## 2. Current Runtime State

- Runtime state: RUNTIME_PRE_TRANSITION.
- Stage 13B.3-A through 13B.3-H are accepted as specifications only.
- Stage 13B.3 completion is conceptual and does not mean runtime alignment.
- Implementation remains unauthorized.
- BV state from WS-8 is conceptual readiness only, not execution readiness.

Current state tokens:

stage_13B_4_A_runtime_state: RUNTIME_PRE_TRANSITION  
stage_13B_4_A_spec_cycle_status: STAGE_13B_3_COMPLETE_AS_SPECIFICATIONS_ONLY  
stage_13B_4_A_implementation_authorized_now: FALSE

## 3. Authorization Decision

Authorized after this gate:

- move to Stage 13B.4-B as the only authorized implementation entry point;
- perform implementation planning and bounded execution preparation for WS-1 only;
- maintain read-only governance for all other workstreams until explicit sub-authorization.

Not authorized after this gate:

- multi-workstream runtime rewrite;
- BV execution and closure claims;
- broad UI cleanup as proxy for alignment;
- any change outside WS-1 foundation entry.

Authorization policy:

- 13B.4-B is authorized.
- 13B.4-C through 13B.4-H require explicit later authorization gates.

## 4. First Implementation Wave Cutline

First-wave cutline is foundation-first and proof-driven.

In first wave planning:

- WS-1 Private Repost Runtime Implementation (primary and only authorized next step).
- WS-3 and WS-5 are required adjacent foundations in planning dependency terms, but not yet authorized for immediate implementation at this gate.

Why this cutline:

- eliminating repost behavior before WS-1 creates a product gap;
- changing feed/activity/language before WS-1 and WS-3 creates false pass risk;
- WS-5 distinction is mandatory to avoid legacy ambiguity in all later verification.

Cutline tokens:

stage_13B_4_A_first_wave_focus: WS_1_PRIVATE_REPOST_FOUNDATION  
stage_13B_4_A_first_wave_dependency_awareness: WS_3_AND_WS_5_REQUIRED  
stage_13B_4_A_wave_expansion_authorized: FALSE

## 5. Out-of-Scope / Forbidden Changes

At Stage 13B.4-A the following are explicitly forbidden:

- DB migrations;
- schema rewrites;
- public API rewrites;
- frontend copy rewrite;
- activity rewrite;
- group feed behavior rewrite;
- Source Reference model implementation;
- deleting legacy repost data;
- hiding repost UI without backend proof.

Also forbidden:

- code changes of any kind;
- routing/runtime behavior updates;
- OpenAPI/SDK rewrites;
- moderation/ranking/recommendation/economy/rewards work.

## 6. WS Dependency Map

Dependency path remains:

WS-1 + WS-3 + WS-5 -> WS-2 -> WS-4 -> WS-6 -> WS-7 -> WS-8

Dependency summary:

- WS-1 (Private Repost) must establish owner-only retention first.
- WS-3 (Authorial Post + Source Reference) must establish publish primitive before broad repost elimination can be considered complete.
- WS-5 (Legacy handling) must establish distinction logic before verification can be trusted.
- WS-2 depends on WS-1, WS-3, WS-5.
- WS-4 depends on WS-2, WS-3, WS-5.
- WS-6 depends on WS-1, WS-2, WS-5.
- WS-7 depends on WS-1 through WS-6.
- WS-8 depends on WS-1 through WS-7 and verifies, not redesigns.

## 7. Recommended Stage 13B.4 Implementation Order

Recommended execution order for Stage 13B.4:

1. 13B.4-B — Private Repost Runtime Implementation
2. 13B.4-C — Public/Group Repost Write Block
3. 13B.4-D — Authorial Post + Source Reference Runtime Foundation
4. 13B.4-E — Group Feed Authorial-Only Read Alignment
5. 13B.4-F — Activity Alignment
6. 13B.4-G — Language / UI Copy Alignment
7. 13B.4-H — BV / Runtime Verification

Cutline note:

- this order is planning guidance;
- only item 1 is authorized by this gate;
- items 2 through 7 remain pending explicit authorization.

## 8. Safety Gates Before Code

Conditions that must be true before starting 13B.4-B:

1. Stage 13B.3-A through 13B.3-H accepted as immutable input boundaries.
2. Runtime baseline RUNTIME_PRE_TRANSITION explicitly acknowledged.
3. No doctrine redesign intent in 13B.4-B scope.
4. WS-1 target boundaries are treated as strict acceptance criteria, not optional guidance.
5. False-pass catalog from WS-8 is adopted as blocking policy.
6. Legacy distinction requirement from WS-5 is treated as mandatory verification constraint for follow-up stages.
7. This 13B.4-A gate is accepted with explicit authorization status.

## 9. False Pass Risks

Mandatory false-pass patterns to guard against:

- simply hiding repost button/UI;
- renaming repost to share without semantic split;
- removing UI while write-path still exists;
- group feed still reading repost-shaped entities;
- activity still creating social pressure;
- legacy rows appearing as new canon;
- changing language before backend/runtime semantics are aligned.

Cross-workstream false-pass rule:

Hiding, suppressing, or renaming repost-shaped behavior is not alignment unless WS-1, WS-3, WS-5, WS-6, and WS-7 are independently provable.

## 10. Evidence Requirements

Evidence surfaces required for next stages (planning and later verification):

- Share/creation path: Share-to-Space and repost create entry points.
- Write-path boundaries: post creation/repost convenience paths and visibility handling.
- Feed read paths: home feed, group feed, profile/publications surfaces.
- Activity projection surfaces: incoming/outgoing categories, CTA semantics, pressure events.
- Legacy artifact surfaces: feed rows, activity rows, highlights, profile counters.
- Language surfaces: labels, filters, CTA wording, empty states, explanatory text.
- Primitive boundaries: Private Repost vs Reactions bookmark; Authorial Post vs repost; Source Reference vs repost target.
- Contract surfaces for drift detection: API/openapi/sdk naming and semantics.

Evidence rule:

Every future alignment claim must map Canon -> Workstream -> Observable Proof.

## 11. Final Authorization Status

Final status:

AUTHORIZED_FOR_13B_4_B_ONLY

Meaning:

- Stage 13B.4-B is authorized as the next safe implementation step.
- Stage 13B.4-C through 13B.4-H are not authorized by this gate.
- Runtime remains pre-transition until future implementation and BV closure.

Stage authorization summary:

- Allowed now: Stage 13B.4-B only.
- Forbidden now: Stage 13B.4-C, 13B.4-D, 13B.4-E, 13B.4-F, 13B.4-G, 13B.4-H implementation execution without separate authorization.

Blockers before 13B.4-B:

- No additional blocker beyond acceptance of this gate report and adherence to listed safety gates.
- Main constraints are scope discipline and false-pass prevention, not missing specifications.
