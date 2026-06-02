# Stage 13B.4-B - Foundation Trio Implementation Planning

## 1. Executive Summary

This document is planning-only. No implementation has started.

Runtime remains: RUNTIME_PRE_TRANSITION.

Stage 13B.4-A was accepted with the authorization status: AUTHORIZED_FOR_13B_4_B_ONLY.

Stage 13B.4-B does not implement WS-1, WS-3, or WS-5. It defines the implementation planning framework for the Foundation Trio:

- WS-1 Private Repost
- WS-3 Authorial Post + Source Reference
- WS-5 Legacy Runtime Handling

The Foundation Trio must be treated as one system because it separates the three meanings that the old repost runtime conflated:

- retention: save context for myself;
- expression: publish my own thought;
- history: legacy artifacts from the old model.

This report does not change code, migrations, schemas, OpenAPI, SDK, frontend, activity, group feed, UI copy, routing, or runtime behavior.

## 2. Foundation Trio Definition

Foundation Trio role:

| Workstream | Role | Core question |
| --- | --- | --- |
| WS-1 Private Repost | Owner-only retention | Where does "save for myself" go? |
| WS-3 Authorial Post + Source Reference | Expression and source context | How does a user publish their own thought with optional context? |
| WS-5 Legacy Runtime Handling | Historical distinction | How do old repost-shaped artifacts remain distinguishable from new behavior? |

Why these cannot be safely separated:

- WS-1 without WS-3 creates a retention path but no replacement expression path.
- WS-3 without WS-1 creates expression but leaves save-for-myself conflated with public repost.
- WS-1 and WS-3 without WS-5 cannot prove whether repost-shaped runtime evidence is legacy or regression.
- WS-5 without WS-1 and WS-3 is only classification; it does not create the new model.
- WS-2 cannot safely start until the Foundation Trio is independently provable.

Foundation rule:

WS-1 + WS-3 + WS-5 -> WS-2.

## 3. Runtime Primitive Inventory

Conceptual primitives required by the Foundation Trio:

| Primitive | Workstream | Conceptual meaning |
| --- | --- | --- |
| Private Repost | WS-1 | Owner-only saved context for a source object |
| Private Note | WS-1 | Optional owner-only text attached to Private Repost |
| Retention Target Binding | WS-1 | The saved source binding for private context; not Source Reference |
| Authorial Post | WS-3 | Standalone user-authored publication |
| Source Reference | WS-3 | Optional one-hop source/context pointer on Authorial Post |
| Authorial Text | WS-3 | Primary value of an Authorial Post |
| Legacy Classification | WS-5 | Distinguishes historical repost artifact from post-transition behavior |
| Legacy Carve-Out | WS-5 | Policy-governed historical visibility, not active canon |
| Legacy Repost Artifact | WS-5 | Old public/group/activity/profile/highlight repost-shaped item |
| Forbidden Transformation Guard | WS-5 | Prevents auto-conversion of legacy rows into new primitives |
| Primitive Boundary Matrix | Foundation Trio | Separates bookmark, Private Repost, Authorial Post, Source Reference, and legacy artifacts |

This inventory is conceptual only. It does not define tables, APIs, schemas, routes, components, or storage.

## 4. Foundation Dependency Map

Internal dependency map:

| Dependency | Meaning |
| --- | --- |
| WS-1 -> WS-3 | Private retention dedupe must not block Authorial Posts about the same source |
| WS-3 -> WS-1 | Publish-my-thoughts must not be confused with save-for-myself |
| WS-5 -> WS-1 | Legacy rows must not be mistaken for Private Reposts |
| WS-5 -> WS-3 | Legacy rows must not be mistaken for Authorial Posts or Source References |
| WS-1 -> WS-5 | Private Repost defines one post-transition side of the distinction matrix |
| WS-3 -> WS-5 | Authorial Post and Source Reference define the other post-transition side |

Can be planned independently:

- WS-1 retention semantics;
- WS-3 authorial/source semantics;
- WS-5 legacy taxonomy.

Requires joint input:

- save/publish split;
- retention dedupe vs authorial publishing;
- repost target binding vs Source Reference;
- legacy vs post-transition classification;
- observable proof bundle before WS-2.

## 5. Bounded Context Mapping

Affected runtime areas, at planning level only:

| Area | Foundation Trio impact |
| --- | --- |
| Write paths | Must eventually separate retention from authorial expression |
| Read paths | Must eventually distinguish owner-only retention, authorial output, and legacy artifacts |
| Visibility | Owner/public/group/profile/activity boundaries must be proven per primitive |
| Activity | Private Repost must not create pressure; legacy activity remains carve-out; WS-6 owns later projection alignment |
| Feed rendering | Public/group repost-shaped rows must be classifiable before later read alignment |
| Profile surfaces | Authorial output must be distinct from Private Repost and legacy repost rows |
| Legacy surfaces | Legacy feed/activity/highlight/profile rows require carve-out classification |
| Language surfaces | Language alignment is later WS-7; planning must avoid relying on copy-only proof |
| Reactions | Bookmark/like remain separate from Space retention/expression |
| Source modules | Source truth remains owned by source modules; Source Reference is contextual pointer only |
| Blog boundary | Blog candidate relationship starts from quality Authorial Post only |

No bounded context is modified by this report.

## 6. Implementation Slice Candidates

These are candidate planning slices, not development tasks.

| Slice | Goal | Inputs | Outputs | Dependencies | Risks |
| --- | --- | --- | --- | --- | --- |
| FT-1A Retention Intent | Define save-for-myself as Private Repost semantics | WS-1, 13B.2-G | Retention intent boundary | None | Save remains public repost |
| FT-1B Owner Visibility | Define owner/non-owner/public/group visibility proof | WS-1 visibility rules | Visibility acceptance matrix | FT-1A | Hidden UI without owner proof |
| FT-1C Private Note | Define optional text as private note | WS-1, WS-5 legacy commentary | Private note boundary | FT-1A | Public commentary survives |
| FT-1D Retention Dedupe | Define dedupe as owner+target retention scope | WS-1, WS-3 | Dedupe boundary | FT-1A, FT-3A | Authorial Post blocked |
| FT-1E Bookmark Separation | Define bookmark vs Private Repost | WS-1, Reactions boundary | Primitive separation proof | FT-1A | Saved tab mistaken for Private Repost |
| FT-3A Authorial Expression | Define publish-my-thoughts as Authorial Post | WS-3 | Expression boundary | FT-1A awareness | Public repost remains expression |
| FT-3B Source Reference | Define one-hop optional context | WS-3, 13B.2-F | Source Reference boundary | FT-3A | repostTarget rename drift |
| FT-3C Authorial Independence | Define primary author text proof | WS-3, 13B.2-H | Independence criteria | FT-3A, FT-3B | Weak content passes |
| FT-3D Save/Publish Split | Define joint retention/expression proof | WS-1, WS-3 | Dual-intent proof model | FT-1A, FT-3A | Single action retains old model |
| FT-5A Legacy Taxonomy | Define legacy classes by surface | WS-5 | L_* classification map | None | Legacy ambiguity |
| FT-5B Distinction Rule | Define legacy vs post-transition decision rule | WS-5 | Release-blocking distinction rule | FT-5A | BV_FAIL_AMBIGUITY |
| FT-5C Forbidden Transformations | Define no auto-convert/delete/rewrite constraints | WS-5 | Legacy guard list | FT-5A | Legacy becomes new canon |
| FT-5D Per-Surface Legacy Matrix | Map feed/group/activity/highlight/profile artifacts | WS-5 | Surface carve-out matrix | FT-5A, FT-5B | Legacy masks missing paths |
| FT-X1 Primitive Boundary Matrix | Lock bookmark/private/authorial/source/legacy separation | WS-1, WS-3, WS-5 | Foundation boundary matrix | FT-1E, FT-3B, FT-5B | Primitive collapse |
| FT-X2 Foundation Evidence Spine | Define Canon -> WS -> Observable Proof for Trio | WS-8 | Trio proof index | FT-X1 | UI-only evidence |
| FT-X3 Trio Closure Gate | Determine readiness for WS-2 entry | WS-1, WS-3, WS-5, WS-8 | Foundation-ready recommendation | FT-X2 | Premature WS-2 |

## 7. Acceptance Criteria Framework

Acceptance must use observable proof, not implementation detail.

WS-1 Private Repost criteria:

- User can save source context without public/group publication.
- Owner can access retained context and private note.
- Non-owner cannot discover Private Repost through feed, profile, group, activity, or social deep link.
- Private note edit is silent and owner-only.
- Private Repost does not create incoming source-author pressure.
- Dedupe is retention-scoped and does not block Authorial Post.
- Bookmark/Reactions remain separate.
- Legacy repost rows are distinguishable from post-transition Private Reposts.

WS-3 Authorial Post + Source Reference criteria:

- User can publish standalone Authorial Post without creating public/group repost.
- Author text is primary.
- Source Reference is optional, one-hop, secondary, and only attached to Authorial Post.
- Source Reference is not repost target binding.
- Source Reference creates no chain, reply, quote, parent-child relation, or incoming pressure.
- Private Repost dedupe does not block Authorial Post.
- Legacy rows are not auto-promoted into Authorial Posts or Source References.
- Blog candidate relationship begins from quality Authorial Post only.

WS-5 Legacy Runtime Handling criteria:

- Legacy public/group/activity/highlight/profile artifacts are distinguishable.
- Legacy rows are not Authorial Posts, Source References, Private Reposts, group quality inputs, or Blog candidates.
- Legacy visibility does not justify new public/group repost behavior.
- Legacy artifacts do not mask missing Private Repost or Authorial Post paths.
- Legacy repost-of-post rows do not reconstruct chains.
- Reviewer can classify visible repost-shaped behavior as legacy carve-out, target behavior, or regression.

Foundation Trio rollup criteria:

- Retention, expression, and legacy are independently provable.
- No Trio-scope negative blocker is present.
- No visible repost-shaped artifact remains ambiguous.
- WS-2 entry remains blocked until Foundation Trio closure gate passes.

## 8. Authorization Points

Authorization before coding WS-1:

- 13B.4-A accepted.
- 13B.4-B planning accepted.
- WS-1 execution sub-plan explicitly scoped to Private Repost only.
- False-pass catalog adopted as blocking policy.
- No WS-2, WS-4, WS-6, WS-7, or WS-8 execution bundled into WS-1.

Authorization before coding WS-3:

- Explicit WS-3 sub-authorization required.
- Save/publish split constraints acknowledged.
- Source Reference cannot be implemented as renamed repost target.
- Authorial independence criteria accepted.
- Legacy distinction handshake with WS-5 planned.

Authorization before coding WS-5:

- Explicit WS-5 sub-authorization required.
- Legacy taxonomy and forbidden transformations accepted.
- Policy gates either resolved or explicitly carved out.
- Legacy classification must be designed as proof support, not data deletion or migration.

Authorization before WS-2:

- WS-1 positive targets provable.
- WS-3 positive targets provable.
- WS-5 distinction targets provable.
- FT-X3 Foundation Trio Closure Gate accepted.
- No BV_FAIL_AMBIGUITY on repost-shaped artifacts.
- Explicit 13B.4-C authorization issued.

## 9. False Pass Exposure Analysis

If only WS-1 is implemented:

- Private retention may exist, but expression gap remains.
- Public/group repost write path may still exist.
- Legacy rows may still be indistinguishable.
- Activity and language may still teach old repost doctrine.
- Result: cannot enter WS-2 without WS-3 and WS-5 proof.

If only WS-3 is implemented:

- Authorial expression may exist, but save-for-myself remains unsafe.
- Share-to-Space may remain conflated.
- Source Reference may drift into renamed repost target binding.
- Legacy rows may look like existing authorial content.
- Result: expression alone is not foundation closure.

If only WS-5 is implemented:

- Legacy can be classified, but no new retention or expression primitive exists.
- Legacy classification can mask absence of WS-1/WS-3.
- Hiding or labeling legacy can look like progress while runtime remains old.
- Result: taxonomy-only is not alignment.

If Trio is implemented in wrong order:

- WS-2 before WS-1 creates retention gap.
- WS-2 before WS-3 creates expression gap.
- WS-2 before WS-5 creates ambiguity and false pass/fail.
- WS-7 before runtime semantics creates terminology-only alignment.
- WS-8 before aligned runtime creates BV_EXEC_NOT_READY.

Universal false-pass guard:

Hiding, suppressing, or renaming repost-shaped behavior is not alignment unless WS-1, WS-3, WS-5, WS-6, and WS-7 are independently provable.

## 10. Recommended Transition Plan

Recommended governance path:

13B.4-B planning accepted  
-> WS-1 execution sub-plan authorization  
-> first implementation slice: FT-1A Retention Intent  
-> WS-1 bounded foundation proof  
-> Foundation authorization gate for WS-3 and WS-5  
-> WS-3 and WS-5 foundation slices  
-> FT-X1 / FT-X2 / FT-X3 Trio Closure Gate  
-> explicit 13B.4-C authorization  
-> WS-2 entry

Recommended first implementation slice:

FT-1A Retention Intent.

Reason:

- it is the narrowest first step;
- it follows AUTHORIZED_FOR_13B_4_B_ONLY;
- it starts WS-1 without touching WS-3, WS-5, WS-2, activity, group feed, copy, API, DB, or UI;
- it frames the next coding step around intent boundary before technical detail.

13B.4-C must not start until:

- WS-1 retention path is provable;
- WS-3 authorial path is provable;
- WS-5 legacy distinction is provable;
- Foundation Trio Closure Gate passes.

## 11. Final Planning Status

Final status:

FOUNDATION_TRIO_PLANNING_COMPLETE

Why complete:

- Foundation Trio definition is established.
- Conceptual runtime primitives are inventoried.
- Dependencies between WS-1, WS-3, and WS-5 are mapped.
- Bounded context impacts are identified without implementation design.
- Candidate implementation slices are decomposed at planning level.
- Observable-proof acceptance criteria are defined.
- Authorization points are defined before coding WS-1, WS-3, WS-5, and WS-2.
- False pass exposure is documented.
- Recommended transition plan is defined.

What remains:

- explicit authorization gate before coding;
- WS-1 execution sub-plan;
- later WS-3 and WS-5 sub-authorization gates;
- no WS-2 entry until Foundation Trio closure.

Planning tokens:

stage_13B_4_B_status: FOUNDATION_TRIO_PLANNING_COMPLETE  
stage_13B_4_B_execution_mode: READ_ONLY_FOUNDATION_TRIO_IMPLEMENTATION_PLANNING  
stage_13B_4_B_runtime_state: RUNTIME_PRE_TRANSITION  
stage_13B_4_B_implementation_started: FALSE  
stage_13B_4_B_migrations_proposed: FALSE  
stage_13B_4_B_api_changes_proposed: FALSE  
stage_13B_4_B_db_changes_proposed: FALSE  
stage_13B_4_B_frontend_changes_proposed: FALSE  
stage_13B_4_B_runtime_changes_proposed: FALSE  
stage_13B_4_B_next_recommended_step: WS_1_EXECUTION_SUB_PLAN_AUTHORIZATION
