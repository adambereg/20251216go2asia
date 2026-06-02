# Stage 13B.4-C9 — Post-FT-1D Prioritization Review

## 1. Executive Summary

Stage 13B.4-C9 is a governance and prioritization report.

This document does not implement code, migrations, API design, schema design, OpenAPI changes, SDK changes, frontend changes, UI text changes, runtime rewrites, UI rewrites, or activity rewrites.

Accepted upstream state:

- FT-1A Retention Intent is complete.
- FT-1B Owner Visibility is complete.
- FT-1C Private Note is complete.
- FT-1D Retention Dedupe is complete.
- WS-1 is not complete.
- WS-3 is not authorized.

Purpose of this document:

- determine the next major governance step after FT-1D;
- compare continuing WS-1 against starting a first WS-3 planning/authorization path;
- explicitly test whether FT-1D completion means WS-3 readiness.

Final recommendation:

`CONTINUE_WS1_RECOMMENDED`

Primary next gate:

`FT_1E_BOOKMARK_SEPARATION_SLICE_AUTHORIZATION_GATE`

## 2. Current Runtime Review

This section uses accepted reports only. It does not re-check code.

Current retention runtime:

- FT-1A established post-transition Private Repost Intent.
- FT-1B established owner visibility and non-owner absence proof.
- FT-1C established Private Note as text-role semantics inside Private Repost.
- FT-1D established retention-scoped dedupe and preserved the invariant that WS-3 is still not authorized.

Current runtime state token from C8:

- `RUNTIME_PARTIAL_WS1_INTENT_OWNER_VISIBILITY_PRIVATE_NOTE_AND_RETENTION_DEDUPE_ONLY`

Remaining WS-1 gaps:

- FT-1E Bookmark Separation.
- FT-1F Legacy Boundary.
- FT-1G Activity Alignment.
- FT-1H WS-1 Closure Evidence.

Foundation Trio state:

- WS-1 is materially advanced but not closed.
- WS-3 is still specification-only and not authorized.
- WS-5 legacy distinction remains unimplemented at runtime.
- Foundation Trio closure is not available.
- WS-2 entry remains blocked.

Important post-C8 clarification:

- FT-1D mandatory-before-WS-3 invariant is satisfied.
- FT-1D completion does not equal WS-3 readiness.

## 3. WS-1 Remaining Work Review

### FT-1E Bookmark Separation

Problem solved:

- separates Reactions bookmark from Space Private Repost;
- prevents saved/bookmark surfaces from being mistaken for Private Repost proof;
- protects the primitive boundary between reaction fact and retained context.

Criticality now:

- high;
- it is the next unresolved WS-1 primitive after FT-1D;
- it is lower risk than legacy/activity/closure work and directly supports the Primitive Boundary Matrix.

What it blocks:

- WS-1 closure evidence;
- FT-X1 Primitive Boundary Matrix;
- safe save/publish reasoning for future WS-3;
- avoiding false proof that saved tab equals Private Repost inventory.

### FT-1F Legacy Boundary

Problem solved:

- distinguishes legacy public/group repost-shaped rows from post-transition Private Repost;
- prevents historical artifacts from masking missing runtime behavior;
- provides the WS-1 side of the WS-5 handshake.

Criticality now:

- medium-high;
- FT-1D stopped legacy rows from satisfying retention dedupe, but legacy rows are still not classified or governed as legacy artifacts.

What it blocks:

- WS-1 closure;
- Foundation Trio closure;
- WS-5 distinction proof;
- WS-8/BV confidence around repost-shaped artifacts.

### FT-1G Activity Alignment

Problem solved:

- establishes that Private Repost does not create incoming social pressure;
- separates retention activity from social propagation activity;
- provides the WS-1 side of the future WS-6 alignment.

Criticality now:

- medium-high for WS-1 closure;
- not a reason to open WS-3 early;
- should remain a bounded WS-1 activity-silence contract, not a full WS-6 rewrite.

What it blocks:

- WS-1 no-pressure acceptance proof;
- clean Activity Projection later;
- FT-1H closure evidence.

### FT-1H WS-1 Closure Evidence

Problem solved:

- rolls up observable proof that WS-1 Private Repost is complete;
- records whether all WS-1 positive/negative targets are satisfied;
- determines whether WS-1 can participate in Foundation Trio readiness.

Criticality now:

- mandatory final WS-1 step;
- not actionable until FT-1E, FT-1F, and FT-1G are complete or explicitly carved out by governance.

What it blocks:

- Foundation Trio readiness;
- WS-2 entry;
- safe claim that Private Repost runtime is closed.

## 4. WS-3 Preparation Review

Question:

- Is the system ready to begin first WS-3 planning/authorization work after FT-1D?

Answer:

- not as the primary next step.

What FT-1D completion changed:

- it satisfied the mandatory dedupe prerequisite before any WS-3 authorization;
- it proved retention dedupe does not block the current standard `postType: post` shape;
- it reduced one major WS-1 to WS-3 coupling risk.

What FT-1D completion did not change:

- it did not create Authorial Post;
- it did not create Source Reference;
- it did not authorize WS-3;
- it did not close WS-1;
- it did not classify legacy rows;
- it did not separate bookmark from Private Repost;
- it did not establish activity silence;
- it did not close Foundation Trio.

Readiness conclusion:

- WS-3 preparation may become appropriate as a later paired planning track with WS-5;
- it is not the correct primary next gate immediately after FT-1D;
- FT-1D complete must not be treated as WS-3-ready proof.

## 5. Dependency Analysis

What must still happen before WS-3 authorization:

- FT-1E should separate bookmark and Private Repost.
- FT-1F or an equivalent WS-5-aware legacy boundary must prevent legacy rows from being mistaken for new authorial/retention primitives.
- FT-1G should establish the no-pressure activity boundary for Private Repost.
- FT-1H should roll up WS-1 evidence before WS-1 is used as a Foundation Trio input.
- WS-5 planning/authorization must be paired with WS-3 planning because legacy rows can otherwise be mistaken for Authorial Posts or Source References.

Dependency findings:

- FT-1D was a necessary prerequisite for WS-3 authorization, but not sufficient.
- FT-1E is the next lowest-risk WS-1 dependency and directly supports future primitive boundary work.
- FT-1F/WS-5 is critical before any claim that repost-shaped artifacts are distinguishable.
- FT-1H is required before Foundation Trio readiness can be evaluated.

Explicit test:

- `FT_1D_IMPLEMENTATION_COMPLETE` does not imply `WS3_PREPARATION_READY`.

## 6. Foundation Trio Review

Foundation Trio goal:

- WS-1 Private Repost;
- WS-3 Authorial Post + Source Reference;
- WS-5 Legacy Runtime Handling.

Current proximity to readiness:

- closer than before FT-1D, because core retention dedupe no longer blocks future authorial behavior;
- still not close enough for Foundation Trio closure or WS-2 entry;
- not yet safe to treat WS-3 as primary next work.

Foundation Trio readiness blockers:

- WS-1 still lacks bookmark separation, legacy boundary, activity alignment, and closure evidence;
- WS-3 has not started implementation authorization;
- WS-5 legacy distinction is not implemented;
- FT-X1/FT-X2/FT-X3 closure artifacts cannot run yet.

Assessment:

- Foundation Trio is in a partially stabilized foundation state, not readiness state.
- The next step should reduce primitive-boundary ambiguity before expression work begins.

## 7. Risk Analysis

### Continue WS-1

Governance risk:

- low-medium for FT-1E;
- medium-high for later FT-1F/FT-1G;
- manageable because the next gate is narrow and already recommended by C8.

Implementation risk:

- medium for FT-1E;
- higher for legacy and activity slices, but those are not the immediate next gate.

False-pass risk:

- medium;
- main risk is treating saved/bookmark surfaces as Private Repost proof.

Dependency risk:

- low-medium;
- WS-1 continuation directly resolves dependencies needed before WS-3 and Foundation Trio gates.

### Start WS-3 Preparation Now

Governance risk:

- high;
- easy to misread FT-1D completion as WS-3 readiness.

Implementation risk:

- high if planning drifts into implementation;
- WS-3 would require careful distinction from Private Note, retention target binding, Source Reference, and legacy artifacts.

False-pass risk:

- high;
- risks include authorial text being confused with private note, Source Reference being confused with repost target, and legacy rows being counted as authorial material.

Dependency risk:

- high;
- FT-1E/FT-1F/FT-1G/FT-1H and WS-5 are still open.

Risk comparison:

- continuing WS-1 is the lower-risk and more sequentially consistent path;
- starting WS-3 preparation now is possible only as a later reserve planning track, not as the primary next gate.

## 8. Recommendation

Primary path:

- continue WS-1.

Primary next slice:

- FT-1E Bookmark Separation.

Reason:

- FT-1E is the next unresolved WS-1 primitive after FT-1D;
- it lowers primitive-collapse risk before authorial work;
- it is explicitly recommended by C8;
- it keeps governance discipline consistent with the Foundation Trio plan.

Reserve path:

- prepare a paired WS-3 + WS-5 planning/authorization review after FT-1E, and preferably after at least FT-1F authorization context is clear.

Why reserve only:

- WS-3 is not authorized;
- WS-1 is not closed;
- WS-5 runtime distinction is not implemented;
- FT-1D completion removed one blocker, not all readiness blockers.

## 9. Recommended Next Gate

If WS-1 continuation is selected:

- `FT_1E_BOOKMARK_SEPARATION_SLICE_AUTHORIZATION_GATE`

Recommended authorization token:

- `AUTHORIZED_FOR_IMPLEMENTATION_SLICE_FT_1E_BOOKMARK_SEPARATION_ONLY`

If WS-3 preparation path is selected later:

- `FOUNDATION_WS3_WS5_PLANNING_AUTHORIZATION_GATE`

Guardrails for any later WS-3 preparation gate:

- read-only planning only;
- paired with WS-5 awareness;
- no FT-3A implementation authorization;
- no Authorial Post implementation;
- no Source Reference implementation;
- no WS-2 entry;
- no Foundation Trio closure claim.

Not recommended now:

- WS-3 implementation authorization;
- FT-3A Authorial Expression implementation;
- WS-2 public/group repost elimination;
- Foundation Trio closure.

## 10. Final Decision

Final status:

`CONTINUE_WS1_RECOMMENDED`

Decision tokens:

- `stage_13B_4_C9_status: CONTINUE_WS1_RECOMMENDED`
- `stage_13B_4_C9_primary_path: CONTINUE_WS1`
- `stage_13B_4_C9_primary_next_gate: FT_1E_BOOKMARK_SEPARATION_SLICE_AUTHORIZATION_GATE`
- `stage_13B_4_C9_reserve_path: FOUNDATION_WS3_WS5_PLANNING_AUTHORIZATION_AFTER_FT_1E_REVIEW`
- `stage_13B_4_C9_ws1_closure_claimed: FALSE`
- `stage_13B_4_C9_foundation_trio_closure_claimed: FALSE`
- `stage_13B_4_C9_ws3_authorized: FALSE`
- `stage_13B_4_C9_ft_1d_mandatory_before_ws3_satisfied: TRUE`
- `stage_13B_4_C9_ft_1d_complete_equals_ws3_ready: FALSE`
- `stage_13B_4_C9_implementation_started: FALSE`
- `stage_13B_4_C9_runtime_changes_proposed: FALSE`

Final rationale:

- FT-1D completion satisfies the mandatory precondition before WS-3 authorization.
- It does not make WS-3 ready.
- WS-1 still has unresolved primitive-boundary, legacy, activity, and closure work.
- Continuing WS-1 through FT-1E is the most consistent and lowest-risk next step.
