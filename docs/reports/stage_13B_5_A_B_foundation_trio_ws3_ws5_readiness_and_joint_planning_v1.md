# Stage 13B.5-A/B - Foundation Trio WS-3 + WS-5 Readiness & Joint Planning

## 1. Inputs Reviewed

Execution mode:

- `GOVERNANCE_AND_JOINT_PLANNING_ONLY`
- no coding;
- no implementation;
- no migrations;
- no schema changes;
- no DB changes;
- no OpenAPI changes;
- no SDK changes;
- no frontend changes;
- no backend changes;
- no runtime changes;
- no UI copy changes.

Multi-agent mode:

- activated before this work;
- one readonly agent reviewed the Stage 13B.5-A readiness gate;
- one readonly agent reviewed the Stage 13B.5-B joint planning map;
- agent outputs were used as governance inputs, not as permission to implement.

Required inputs reviewed:

- `docs/reports/stage_13B_4_Z_transfer_pack_for_new_cursor_context_v1.md`
- `docs/reports/stage_13B_4_Z_foundation_trio_preflight_audit_v1.md`
- `docs/reports/stage_13B_4_ZR_audit_review_and_canon_lock_v1.md`
- `docs/reports/stage_13B_4_C17_ft_1H_ws1_closure_evidence_review_v1.md`

Additional inputs reviewed:

- `docs/reports/stage_13B_4_B_foundation_trio_implementation_planning_v1.md`
- `docs/reports/stage_13B_3_B_authorial_post_and_source_reference_runtime_specification_v1.md`
- `docs/reports/stage_13B_3_C_ws_5_legacy_runtime_handling_specification_v1.md`
- `docs/reports/stage_13B_3_F_ws_6_activity_projection_specification_v1.md`

Current accepted canon baseline:

- `WS1_BOUNDED_COMPLETE`
- `FOUNDATION_TRIO_PREFLIGHT_AUDIT_COMPLETE`
- `CANON_LOCK_ACCEPTED_WITH_CLARIFICATIONS`
- Authorial Post runtime primitive remains `NOT_ESTABLISHED`.
- Source Reference runtime primitive remains `NOT_ESTABLISHED`.
- Legacy Row remains `HISTORICAL_ARTIFACT_ONLY`.
- Foundation Trio remains not ready.
- WS-2 remains not authorized.

## 2. Authorization Review

### Question 1 - Is WS-1 sufficient input to open WS-3 + WS-5 planning?

Answer:

`YES_FOR_PLANNING_ONLY`

Reason:

- C17 established `WS1_BOUNDED_COMPLETE`.
- Z preflight established no blocker for the next governance/planning gate.
- ZR locked the canon clarifications needed before a new Cursor context continues.
- WS-1 supplies the bounded retention side of the Foundation Trio: Private Repost, Private Note, retention dedupe, bookmark separation, WS-1-side legacy distinction, and no-pressure activity boundary.

Boundary:

- WS-1 is sufficient to open WS-3 + WS-5 planning.
- WS-1 is not sufficient to authorize implementation.
- WS-1 is not Foundation Trio readiness.

### Question 2 - Are there canonical contradictions between primitives?

Answer:

`NO_CANONICAL_CONTRADICTION_FOUND`

Reason:

- ZR found the reviewed documents consistent.
- ZR clarified that `postType: post` is a generic pre-WS-3 carrier, not Authorial Post runtime proof.
- C17 and ZR preserve the separation between Private Repost, Private Note, Bookmark, Authorial Post, Source Reference, and Legacy Row.

Required canon locks:

- Bookmark is not Private Repost.
- Private Repost is not Authorial Post.
- Private Note is not Authorial Text.
- Legacy Row is not proof of Authorial Post or Source Reference.
- Source Reference is not `repostTargetType` / `repostTargetId`.
- Activity projection is not authority.
- UI copy is not runtime proof.
- Generated DTO vocabulary is not canon proof.

### Question 3 - Do known false-pass risks block planning?

Answer:

`NO_FOR_PLANNING_IF_ADOPTED_AS_BLOCKING_POLICY`

Reason:

- Known false-pass risks are extensive, but they are known and can be converted into planning guardrails.
- They block implementation until resolved or carved out.
- They do not block governance-level planning.

Planning condition:

- The false-pass catalog in this report must be adopted as blocking policy for any later implementation authorization.

### Question 4 - Should WS-3 and WS-5 proceed as linked workstreams?

Answer:

`YES_LINKED_WORKSTREAMS`

Reason:

- WS-3 without WS-5 risks legacy rows being mistaken for Authorial Posts or Source References.
- WS-5 without WS-3 risks taxonomy-only progress that does not create the expression side of the Foundation Trio.
- 13B.4-B states that WS-1, WS-3, and WS-5 form one system: retention, expression, and history.

Planning mode:

- WS-3 and WS-5 should be planned jointly.
- Future implementation authorizations may remain separate, but must reference the shared handshake.

### Question 5 - What minimum dependencies must be fixed before future implementation?

Minimum dependencies before any future WS-3 or WS-5 implementation authorization:

- ZR canon clarifications must be carried forward.
- WS-5 must define minimum legacy taxonomy and distinction rules.
- WS-5 must define forbidden transformations.
- WS-5 must define a per-surface legacy matrix at least at governance level.
- WS-3 must define Source Reference anti-collapse rules before any contract/schema/API discussion.
- WS-3 must define Authorial Post as expression, not as `postType: post` alone.
- WS-3 must define authorial independence and save/publish split proof expectations.
- WS-3 and WS-5 must define a shared Primitive Boundary Matrix.
- WS-2 must remain blocked until Foundation Trio closure.

### Planning Authorization

Planning authorization:

`AUTHORIZED`

Scope:

- Stage 13B.5-B WS-3 / WS-5 Joint Planning.
- Governance-level slice maps.
- Dependency and handshake analysis.
- False-pass catalog.
- Future authorization criteria.

Planning authorization token:

`FOUNDATION_TRIO_PLANNING_AUTHORIZED_WITH_CONDITIONS`

### Implementation Authorization

Implementation authorization:

`NOT_AUTHORIZED`

Explicitly not authorized:

- WS-3 implementation;
- WS-5 implementation;
- Source Reference implementation;
- Authorial Post implementation;
- legacy migration;
- legacy hiding/deletion/conversion;
- schema changes;
- OpenAPI changes;
- SDK changes;
- frontend/backend changes;
- WS-2.

## 3. Canon Dependency Analysis

| Primitive | Canon role | Depends on | Must not collapse into |
| --- | --- | --- | --- |
| Private Repost | WS-1 owner-only retained context | WS-1 complete | Authorial Post, Bookmark, Source Reference, Legacy Row |
| Private Note | Optional owner-only text inside Private Repost | Private Repost | Authorial Text, repost commentary, publication |
| Bookmark | Reactions-owned reaction fact | Reactions boundary | Private Repost, Private Note, Authorial Post |
| Authorial Post | Future WS-3 expression primitive | WS-3 planning and later authorization | Private Note, repost commentary, legacy row, bookmark |
| Source Reference | Future WS-3 one-hop context on Authorial Post | Authorial Post | `repostTarget*`, Private Repost source, legacy repost binding |
| Legacy Row | Historical repost-shaped artifact | WS-5 classification/policy | Private Repost, Authorial Post, Source Reference, Bookmark |

Dependency conclusions:

- WS-1 gives a stable retention side.
- WS-3 must create the expression side.
- WS-5 must classify the historical side.
- Foundation Trio cannot be ready until retention, expression, and history are independently provable.
- WS-2 cannot safely start until Foundation Trio closure.

Canon lock carried forward:

- `Authorial Post runtime primitive remains NOT ESTABLISHED`.
- `Source Reference runtime primitive remains NOT ESTABLISHED`.
- `Legacy Row remains HISTORICAL_ARTIFACT_ONLY`.
- `postType: post` is not sufficient proof of Authorial Post canon runtime.
- `repostTargetType` / `repostTargetId` is not Source Reference.

## 4. False-Pass Risk Review

| False-pass risk | Planning impact | Implementation impact | Required guard |
| --- | --- | --- | --- |
| `WS1_BOUNDED_COMPLETE` read as Foundation Trio ready | Does not block planning | Blocks implementation if unguarded | Carry C17/ZR tokens forward. |
| `postType: post` read as Authorial Post runtime | Does not block planning | Blocks WS-3 implementation | Use ZR clarification in every WS-3 artifact. |
| `repostTarget*` renamed as Source Reference | Does not block planning | Blocks Source Reference implementation | Define Source Reference anti-collapse rules before API/schema discussion. |
| Private Note treated as Authorial Text | Does not block planning | Blocks WS-3 implementation | Define Authorial Text as primary public/group expression only. |
| Legacy row treated as Authorial Post | Does not block planning | Blocks WS-3/WS-5 implementation | WS-5 distinction rule and per-surface matrix required. |
| Legacy row treated as Source Reference | Does not block planning | Blocks WS-3/WS-5 implementation | No Source Reference from legacy repost binding. |
| Bookmark/Saved treated as Private Repost | Does not block planning | Blocks implementation if used as proof | Preserve Reactions fact boundary. |
| UI copy used as runtime proof | Does not block planning | Blocks verification | Keep WS-7 separate and forbid copy-only evidence. |
| Generated DTO used as canon proof | Does not block planning | Blocks implementation if used as primitive proof | Treat generated DTOs as contract inventory only. |
| Legacy rows hidden to pass tests | Does not block planning | Blocks WS-5 implementation | Forbidden transformation rule. |
| Public/group repost preservation treated as aligned doctrine | Does not block planning | Blocks WS-2/Trio closure | Classify as WS-2 debt until Foundation Trio closure. |
| Activity projection treated as authority | Does not block planning | Blocks WS-6/Trio verification | Activity remains projection-only. |

False-pass review conclusion:

- False-pass risks do not block planning.
- False-pass risks must block implementation authorization unless explicitly resolved or carved out.
- Planning must distinguish planning blockers from implementation blockers.

## 5. WS-3 Planning Map

This section defines governance-level slices only. It does not define API, DB, DTO, UI, route, schema, storage, or implementation design.

| Slice | Purpose | Required boundary |
| --- | --- | --- |
| WS3-P1 Authorial Expression Boundary | Define Authorial Post as the expression primitive whose primary value is the author's own material. | `postType: post` alone is not proof; not Private Note; not repost commentary. |
| WS3-P2 Source Reference Boundary | Define Source Reference as optional, zero-or-one, one-hop, secondary context attached only to Authorial Post. | Not `repostTarget*`; not Private Repost source; not legacy binding. |
| WS3-P3 Authorial Independence | Define how author text remains meaningful without source preview. | Source preview cannot carry the post; weak content cannot pass by having a reference. |
| WS3-P4 Save/Publish Split | Define the conceptual separation between retention intent and expression intent. | Private Repost saves context; Authorial Post publishes thought. |
| WS3-P5 Anti-Collapse Rules | Convert ZR and Z risk findings into WS-3 blocking rules. | No Private Note -> Authorial Text; no legacy row -> Authorial Post; no `repostTarget` -> Source Reference. |
| WS3-P6 Visibility and Audience Questions | Inventory unresolved policy gates around public/group visibility, cross-group references, unavailable sources, and immutability. | Planning only; no implementation mapping. |
| WS3-P7 Surface Role Map | Define where Authorial Post and Source Reference belong conceptually. | Not feed UI design; not DTO design; not schema design. |
| WS3-P8 Blog Candidate Boundary | Define that only quality Authorial Post can be future Blog candidate input. | Source Reference alone, legacy rows, bookmarks, and activity are not candidates. |

WS-3 planning false-pass blockers:

- Authorial Post created by renaming existing post shape without authorial independence proof.
- Source Reference implemented as `repostTarget*`.
- Private Note or repost commentary treated as Authorial Text.
- Legacy repost row treated as existing Authorial Post.
- Source Reference used as activity, reward, Blog candidate, reply, quote, or thread relation.

WS-3 implementation status after this planning map:

`NOT_AUTHORIZED`

## 6. WS-5 Planning Map

This section defines governance-level slices only. It does not define migration, SQL, retention mechanics, API, DB, route, UI, or implementation design.

| Slice | Purpose | Required boundary |
| --- | --- | --- |
| WS5-P1 Legacy Taxonomy | Define legacy classes: public repost, group repost, repost commentary, space-post chain artifact, activity, highlight, profile item. | Taxonomy is not migration or conversion. |
| WS5-P2 Legacy vs Post-Transition Distinction Rule | Define how reviewers distinguish legacy carve-out, target behavior, and regression. | If reviewer cannot classify, future verification fails. |
| WS5-P3 Forbidden Transformations | Lock no auto-convert, no silent rewrite, no hide/delete-to-pass, no Blog/group-quality promotion. | Legacy remains historical artifact unless future policy says otherwise. |
| WS5-P4 Per-Surface Legacy Matrix | Map feed, group, profile, activity, highlight, saved, and generated contract surfaces. | Matrix is governance-level; not query/UI design. |
| WS5-P5 Legacy Policy Gates | Inventory policy decisions: non-owner visibility, group suppression timing, owner labeling, highlight URLs, activity stance. | Resolve or carve out before implementation authorization. |
| WS5-P6 Legacy Visibility Boundaries | Define owner/public/group/source-author boundaries conceptually. | Visibility policy is not schema/query implementation. |
| WS5-P7 Compatibility Handshakes | Define how WS-5 interacts with WS-3, WS-4, WS-6, WS-7, and WS-8. | Legacy carve-outs cannot mask missing WS-3 runtime. |

WS-5 planning false-pass blockers:

- Hiding all repost-shaped behavior without proving new primitives.
- Treating legacy public/group visibility as active doctrine.
- Treating legacy commentary as Authorial Text.
- Treating legacy `repostTarget*` as Source Reference.
- Treating legacy rows as Blog candidates or group quality inputs.
- Treating legacy activity as post-transition activity doctrine.

WS-5 implementation status after this planning map:

`NOT_AUTHORIZED`

## 7. WS-3 <-> WS-5 Handshake

### Required handshake

| Handshake area | WS-3 contribution | WS-5 contribution | Joint requirement |
| --- | --- | --- | --- |
| Primitive boundary | Authorial Post and Source Reference target semantics | Legacy artifact taxonomy and distinction rule | Primitive Boundary Matrix must separate private, bookmark, authorial, source, and legacy. |
| Text roles | Authorial Text is primary | Legacy commentary is historical, not authorial | Private Note and legacy commentary cannot become Authorial Text. |
| Source/binding roles | Source Reference is one-hop context | Legacy `repostTarget*` remains historical binding | `repostTarget*` cannot become Source Reference. |
| Profile/publication | Authorial Post is output | Legacy profile rows are historical artifacts | Profile evidence must not count legacy as authorial. |
| Activity compatibility | Source Reference creates no incoming pressure | Legacy repost activity is historical carve-out | WS-6 later needs distinguishable activity semantics. |
| Verification | WS-3 proves expression path | WS-5 proves historical distinction | Foundation evidence cannot pass on hidden or relabeled repost UI. |

### Must be defined first

1. ZR canon clarifications as mandatory planning assumptions.
2. WS5-P1 Legacy Taxonomy.
3. WS5-P2 Distinction Rule.
4. WS5-P3 Forbidden Transformations.
5. WS3-P1 Authorial Expression Boundary.
6. WS3-P2 Source Reference Boundary after WS3-P1.

### Can proceed in parallel

- WS3-P3 Authorial Independence and WS5-P1 Taxonomy.
- WS3-P6 Visibility/Audience Questions and WS5-P5 Policy Gates.
- WS3-P7 Surface Role Map and WS5-P4 Per-Surface Legacy Matrix.
- WS3-P8 Blog Candidate Boundary and WS5-P7 Compatibility Handshakes.

### Must wait

| Work | Must wait for |
| --- | --- |
| WS-3 implementation authorization | WS3-P1/P2/P3/P5 and minimum WS5-P1/P2/P3/P4. |
| Source Reference implementation authorization | Authorial Expression boundary plus Source Reference anti-collapse rules. |
| WS-5 implementation authorization | Legacy taxonomy, distinction rule, forbidden transformations, and policy gate inventory. |
| Foundation Trio readiness claim | WS-1, WS-3, and WS-5 independently provable. |
| WS-2 authorization | Foundation Trio closure gate. |
| WS-6 full implementation | WS-3 activity semantics and WS-5 legacy activity carve-out. |

Handshake conclusion:

- WS-3 and WS-5 should be planned together.
- They should not be implemented as a single uncontrolled slice.
- Later implementation gates must be explicit and separate, but cross-referenced.

## 8. Readiness Verdict

Readiness verdict:

`FOUNDATION_TRIO_PLANNING_AUTHORIZED_WITH_CONDITIONS`

Why not `FOUNDATION_TRIO_PLANNING_AUTHORIZED`:

- ZR requires canon clarifications around Authorial Post technical shape.
- WS-3 and WS-5 carry high false-pass risk.
- Planning must be conditioned on explicit anti-collapse rules and no implementation.

Why not `FOUNDATION_TRIO_PLANNING_BLOCKED`:

- WS-1 is complete as bounded input.
- Z preflight found no blocker for the next governance/planning gate.
- ZR canon lock was accepted with clarifications.
- WS-3 and WS-5 specifications exist as read-only runtime specifications.
- Known risks are cataloged and can become planning guardrails.

Planning authorization:

`TRUE`

Implementation authorization:

`FALSE`

Foundation Trio readiness:

`FALSE`

WS-2 authorization:

`FALSE`

## 9. Next Safe Step

Recommended next safe stage:

`Stage 13B.5-C - WS-3 / WS-5 Planning Acceptance & Implementation Cutline Authorization`

Scope:

- governance/authorization only;
- evaluate the Stage 13B.5-A/B planning output;
- decide whether a first bounded WS-3 or WS-5 implementation slice may be proposed later;
- preserve separate implementation authorization.

Alternative if more planning is desired:

`Stage 13B.5-B2 - Foundation Trio Primitive Boundary Matrix Planning`

Scope:

- governance/planning only;
- produce FT-X1 primitive boundary matrix before any implementation authorization.

Not safe next:

- WS-3 implementation;
- WS-5 implementation;
- Source Reference implementation;
- legacy migration;
- OpenAPI/SDK changes;
- WS-2;
- Foundation Trio closure.

## 10. Final Tokens

- `stage_13B_5_A_status: FOUNDATION_TRIO_WS3_WS5_READINESS_GATE_PASSED_WITH_CONDITIONS`
- `stage_13B_5_B_status: WS3_WS5_JOINT_PLANNING_COMPLETE`
- `stage_13B_5_execution_mode: GOVERNANCE_AND_JOINT_PLANNING_ONLY`
- `stage_13B_5_planning_authorized: TRUE`
- `stage_13B_5_implementation_authorized: FALSE`
- `stage_13B_5_foundation_trio_ready: FALSE`
- `stage_13B_5_ws2_authorized: FALSE`
- `stage_13B_5_ws3_implementation_authorized: FALSE`
- `stage_13B_5_ws5_implementation_authorized: FALSE`
- `stage_13B_5_authorial_post_runtime_primitive_established: FALSE`
- `stage_13B_5_source_reference_runtime_primitive_established: FALSE`
- `stage_13B_5_legacy_row_status: HISTORICAL_ARTIFACT_ONLY`
- `stage_13B_5_ws3_ws5_linked_planning_required: TRUE`
- `stage_13B_5_false_pass_catalog_adopted_for_planning: TRUE`
- `stage_13B_5_next_safe_step: STAGE_13B_5_C_WS3_WS5_PLANNING_ACCEPTANCE_AND_IMPLEMENTATION_CUTLINE_AUTHORIZATION`
