# Stage 13B.3-G - WS-7 Language and Canon Quarantine Specification

## Execution mode

Runtime alignment specification / read-only.

This slice prepares the runtime alignment specification for WS-7 - Language and Canon Quarantine, as defined in Stage 13B.2-I.

This is not an implementation slice. It does not design or change:

- code;
- implementation;
- copy replacement implementation;
- replacement copywriting;
- UX rewrite;
- frontend implementation;
- backend implementation;
- API routes;
- OpenAPI;
- SDK/types;
- DB schema;
- migrations;
- UI screens or components;
- Private Repost doctrine;
- Authorial Post doctrine;
- Source Reference doctrine;
- Group Feed doctrine;
- Activity doctrine;
- Legacy Policy;
- Blog Candidate doctrine;
- moderation systems;
- ranking algorithms;
- recommendation algorithms;
- economy, points, rewards, Quest proof, RF claim, or commercial authority.

No tests were run. No runtime changes were made.

Task type: language and canon quarantine runtime specification.

Risk level: HIGH, because current runtime copy still teaches public repost propagation, public/group "commentary to repost", Share-to-Space-as-publish, repost activity pressure, and repost-as-author-output, while frozen Stage 13B.2 canon requires split save/publish intents, private note language, authorial/source-reference vocabulary, and legacy/mock quarantine.

## Agents

Multi-agent mode was activated using the `docs/ai` role model.

- Lead: AI Program Director / Orchestrator.
- Requirements Analyst.
- Software Architect.
- Runtime Governance Architect.
- Product Analyst.
- Delivery Planner.
- Technical Canon Writer.
- QA Agent.

Review gates:

- Requirements Review.
- Architecture Review.
- Runtime Governance Review.
- QA Review.
- Canon Review.

## Scope

This report focuses only on WS-7.

WS-7 owns:

- current runtime language inventory;
- canon-aligned language concepts;
- canon-conflicting language concepts;
- language taxonomy and quarantine categories;
- runtime surface mapping for copy/terminology drift;
- legacy language boundary;
- conceptual verification targets for future language alignment;
- dependency and readiness assessment for WS-8.

WS-7 does not own:

- Private Repost surface definition or retention behavior;
- Authorial Post or Source Reference runtime semantics;
- Public Repost elimination mechanics;
- Group Feed read policy;
- Activity projection semantics;
- Legacy row transformation policy;
- exact replacement Russian strings;
- copy rewrite implementation;
- OpenAPI, SDK, DB, routes, screens, components, queries, or event payload design.

## Canon anchors

Stage 13B.2 doctrine is frozen. This report does not change it.

Approved canon used by WS-7:

- Stage 13B.2-C: repost is private user context; public/group repost is a doctrine mismatch.
- Stage 13B.2-D: Authorial Post is standalone authored material.
- Stage 13B.2-E: public/group repost is deprecated; Share-to-Space must split retention from expression.
- Stage 13B.2-F: Source Reference is one-hop context on Authorial Post, not repost, quote, reply, or chain.
- Stage 13B.2-G: Private Repost optional text is a private note, not public commentary.
- Stage 13B.2-H: Group Feed is authorial-only and must not teach forum/repost/comment/reply mental models.
- Stage 13B.2-I: WS-7 aligns user-facing language with save/publish split, removes public/group "commentary to repost" mental model, quarantines legacy/mock comment/reply/share surfaces, and records supersession of older Stage 13B.1-D public propagation language.
- Stage 13B.3-A: WS-1 defines Private Repost as owner-only retention with private-note semantics.
- Stage 13B.3-B: WS-3 defines Authorial Post and Source Reference runtime surfaces.
- Stage 13B.3-C: WS-5 defines legacy artifacts and carve-out boundaries.
- Stage 13B.3-D: WS-2 assigns Share-to-Space publish-repost copy transformation to WS-7.
- Stage 13B.3-E: WS-4 defines Group Feed as authorial-only and activity/repost/commentary as non-target content.
- Stage 13B.3-F: WS-6 defines Activity as projection-only and assigns repost filters/CTAs/copy quarantine to WS-7/WS-8.

Fundamental canon:

The user does not answer a publication. The user publishes their own material. Other materials are context, inspiration, or source.

Dependency path:

WS-1 + WS-3 + WS-5 -> WS-2 -> WS-4 -> WS-6 -> WS-7 -> WS-8.

## SECTION 1 - Current Runtime Language Inventory

Current runtime state: `RUNTIME_PRE_TRANSITION`.

Current user-facing terminology and language evidence:

| Surface | Current language evidence | Current mental model |
| --- | --- | --- |
| Share flow | `ShareToSpaceComposer.tsx` uses "Поделиться в Space", "реакцию к репосту", "Комментарий к репосту" | Share-to-Space means publish repost with optional commentary |
| Share success/dedupe | `ContentActionRow.tsx` says material was published in Space as repost or with commentary; duplicate copy says user already reposted object | Repost is public publication and deduped public action |
| Home feed | `SpaceFeedSurface.tsx` uses "Репосты", "заметные репосты", repost counts | Public repost is active feed taxonomy |
| Feed card | `SpaceFeedCard.tsx` labels "Комментарий к репосту", "Репост", edit/add commentary controls | Repost with text looks like public authored material |
| Group feed | `GroupPageClient.tsx` renders group items through `SpaceFeedCard` | Group context can inherit repost/commentary labels |
| Activity | `ActivityPageClient.tsx` uses "Репосты", "Вы сделали репост", "сделал(а) репост вашей публикации", "Открыть репост" | Activity teaches repost as social proof and incoming pressure |
| Profile/publications | `PostsPublicationsSurface.tsx` uses "Авторские публикации" while also saying "материалы и репосты" and "Репосты: N" | Reposts can look like authorial output |
| Saved surface | `SavedPostsPageClient.tsx` represents Reactions bookmarks | Bookmark language exists but Private Repost/private note vocabulary is absent |
| Device share | Pulse/Rielt surfaces include "Это не репост в Space" or equivalent local-share distinction | Device share quarantine is partially aligned |
| Quest boundary | Quest runner copy says it does not create post or repost | Projection/no-post boundary is aligned |
| Mock/legacy Space surfaces | `PostCard.tsx`, `ActivityBlock.tsx`, and mock data contain comments, shares, reply/comment vocabulary | Mock surfaces risk reintroducing forum/share semantics |
| Contracts/internal docs | OpenAPI/SDK names such as repost commentary and earlier 13B.1-D propagation language remain | Implementer/canon drift risk if not superseded |

Baseline tokens:

```text
ws_7_runtime_baseline: RUNTIME_PRE_TRANSITION
ws_7_share_to_space_publish_repost_language: ACTIVE_PRE_TRANSITION
ws_7_public_repost_filter_taxonomy: ACTIVE_PRE_TRANSITION
ws_7_repost_commentary_public_mental_model: ACTIVE_PRE_TRANSITION
ws_7_activity_repost_copy: ACTIVE_PRE_TRANSITION
ws_7_profile_repost_author_output_language: ACTIVE_PRE_TRANSITION
ws_7_private_repost_language: ABSENT_PRE_TRANSITION
ws_7_source_reference_language: ABSENT_PRE_TRANSITION
ws_7_legacy_mock_comment_reply_surfaces: ACTIVE_RISK
ws_7_stage_13B_1_D_language_supersession_pending: TRUE
```

## SECTION 2 - Canon Position

WS-7 is the language layer on top of accepted WS-1 through WS-6 semantics. It specifies what runtime language should teach and what language must be quarantined. It does not write replacement copy.

Language aligned with doctrine teaches:

- save-for-myself is distinct from publish-my-thoughts;
- Private Repost is owner-only retention with optional private note;
- Authorial Post is public/group expression;
- Source Reference is one-hop secondary context on Authorial Post;
- Group Feed is a flat authorial stream, not a forum, repost stream, or activity log;
- Activity is bounded projection-only, not incoming repost pressure, notification system, economy, or Blog authority;
- legacy repost-shaped language is historical carve-out only.

Language conflicting with doctrine teaches:

- Share-to-Space means public/group repost;
- repost is public/group expression;
- commentary to repost is public/group publication;
- repost is response/answer/reply to another post;
- Source Reference is a renamed repost target, quote, or reply edge;
- Activity means incoming repost pressure;
- Group Feed is a discussion, comment, quote, or repost stream;
- legacy rows prove active doctrine.

Canon position tokens:

```text
ws_7_canon_save_vs_publish_split_required: TRUE
ws_7_canon_no_public_group_repost_expression_language: TRUE
ws_7_canon_private_note_not_public_commentary: TRUE
ws_7_canon_source_reference_not_repost_quote_reply: TRUE
ws_7_canon_activity_copy_not_incoming_pressure: TRUE
ws_7_canon_group_feed_authorial_only_language: TRUE
ws_7_canon_legacy_language_distinguishable: TRUE
ws_7_canon_no_economy_reward_blog_authority_in_copy: TRUE
```

This section references frozen doctrine only. It does not redefine Private Repost, Authorial Post, Source Reference, Group Feed, Activity, Legacy Policy, or Blog Candidate.

## SECTION 3 - Language Taxonomy

WS-7 taxonomy is conceptual. It is not a copywriting task, UX rewrite, frontend design, or implementation plan.

Classification vocabulary:

| Classification | Meaning |
| --- | --- |
| ALLOW | Language concept can remain visible because it teaches target canon |
| TRANSFORM | Language concept may remain as surface intent but must teach a different accepted meaning |
| DEPRECATE | Language concept must not remain active taxonomy for post-transition behavior |
| REMOVE | Language concept must not appear on post-transition active paths |
| QUARANTINE | Legacy/mock/internal language may remain only if distinguishable from active doctrine |
| SUPERSEDE | Older canon/docs language must be marked as replaced at product-semantics level |

Language taxonomy:

| Category | Current language | Target role | Classification |
| --- | --- | --- | --- |
| Repost language | "Репост", "Репосты", "репостнули" | Not active public/group expression | DEPRECATE / QUARANTINE |
| Share-to-Space language | "Поделиться в Space" as repost publish | Must split save and publish concepts | TRANSFORM |
| Commentary language | "Комментарий к репосту" | Private note or authorial text depending on accepted primitive | TRANSFORM / DEPRECATE |
| Reaction-to-repost language | "реакцию к репосту" | Must not mix Reactions and repost note | REMOVE |
| Activity language | "Открыть репост", "репост вашей публикации" | Must not teach incoming repost pressure | DEPRECATE / TRANSFORM |
| Authorial language | "Авторская публикация", "Запись", authored material | Target expression vocabulary | ALLOW |
| Source Reference language | Absent; sometimes confused with repost target | One-hop secondary source/context concept | ALLOW_TARGET / TRANSFORM |
| Save language | "Сохранить", "Сохранено" in Reactions | Keep for bookmark; distinguish from Private Repost | ALLOW_WITH_BOUNDARY |
| Legacy language | Historical repost/commentary labels | Historical carve-out only | QUARANTINE |
| Mock discussion language | comments, replies, shares on mock surfaces | Not runtime canon | QUARANTINE |
| Superseded canon language | Stage 13B.1-D public propagation language | Replaced by Stage 13B.2/13B.3 semantics | SUPERSEDE |

Taxonomy tokens:

```text
ws_7_taxonomy_repost_public_category: DEPRECATE_POST_TRANSITION
ws_7_taxonomy_share_to_space_as_publish_repost: TRANSFORM_POST_TRANSITION
ws_7_taxonomy_commentary_to_repost_public: DEPRECATE_POST_TRANSITION
ws_7_taxonomy_reaction_to_repost: REMOVE_POST_TRANSITION
ws_7_taxonomy_activity_repost_pressure: DEPRECATE_POST_TRANSITION
ws_7_taxonomy_authorial_language: ALLOW_TARGET
ws_7_taxonomy_source_reference_language: ALLOW_TARGET
ws_7_taxonomy_legacy_copy: QUARANTINE_ONLY
ws_7_taxonomy_13B1D_propagation_language: SUPERSEDE
```

## SECTION 4 - Canon-Aligned Language

Canon-aligned language concepts are concepts that should remain visible or become visible in future runtime language. This section defines concepts only and does not write replacement strings.

Allowed target concepts:

| Concept | Canon role | Source workstream |
| --- | --- | --- |
| Authorial publication | User publishes their own standalone material | WS-3 / WS-4 |
| Save for myself | Retention intent, separate from publication | WS-1 / WS-2 |
| Private note | Owner-only note on Private Repost, not public commentary | WS-1 |
| Source material | Context that inspired or informed Authorial Post | WS-3 |
| Source Reference | One-hop secondary context on Authorial Post | WS-3 |
| My authored material | Author text is primary | WS-3 / WS-4 |
| Group authorial contribution | Flat standalone group content | WS-4 |
| Activity projection | Bounded projection-only surface | WS-6 |
| Legacy artifact | Historical row/copy under carve-out | WS-5 |
| Device/local share distinction | Native share is not Space repost | Existing positive quarantine |

Aligned language tokens:

```text
ws_7_aligned_authorial_publication: TRUE
ws_7_aligned_save_for_myself: TRUE
ws_7_aligned_private_note: TRUE
ws_7_aligned_source_material: TRUE
ws_7_aligned_source_reference: TRUE
ws_7_aligned_group_authorial_contribution: TRUE
ws_7_aligned_activity_projection: TRUE
ws_7_aligned_legacy_artifact: TRUE
```

## SECTION 5 - Canon-Conflicting Language

Canon-conflicting language concepts should be quarantined, deprecated, transformed, or removed from post-transition active language. This section defines concepts only and does not choose implementation.

Conflicting concepts:

| Concept | Why conflicting | Canon/workstream boundary |
| --- | --- | --- |
| Repost as expression | Repost is private context, not public/group expression | 13B.2-C/E, WS-2 |
| Repost as response | Recreates reply/quote/forum mental model | 13B.2-H, WS-3/WS-4 |
| Repost chain | Violates one-hop and anti-forum doctrine | 13B.2-F/H |
| Comment-to-repost | Treats repost note as public/group commentary | WS-1/WS-2 |
| Reaction-to-repost | Blurs Reactions ownership and repost note | 13B.2-C |
| Reply-to-post / answer-to-post | Redefines Authorial Post as response | 13B.2-D/H |
| Source Reference as repost | Turns source context into propagation edge | WS-3 |
| Activity as incoming repost pressure | Violates Private Repost silence and WS-6 | WS-1/WS-6 |
| Group Feed as forum/repost stream | Violates authorial-only flat stream | WS-4 |
| Repost as author output | Inflates profile/publication semantics | WS-2/WS-3 |
| Legacy language as active doctrine | Confuses historical carve-out with target model | WS-5 |

Conflicting language tokens:

```text
ws_7_conflict_repost_as_expression: TRUE
ws_7_conflict_repost_as_response: TRUE
ws_7_conflict_repost_chain: TRUE
ws_7_conflict_comment_to_repost: TRUE
ws_7_conflict_reaction_to_repost: TRUE
ws_7_conflict_reply_to_post: TRUE
ws_7_conflict_source_reference_as_repost: TRUE
ws_7_conflict_activity_as_repost_pressure: TRUE
ws_7_conflict_group_feed_as_forum_repost_stream: TRUE
ws_7_conflict_legacy_as_active_doctrine: TRUE
```

## SECTION 6 - Runtime Surface Mapping

This section maps where language drift exists. It does not prescribe UI changes or replacement text.

| Surface | Primary evidence | Current language class | Target conceptual class | Owner relationship |
| --- | --- | --- | --- | --- |
| Share flow | `ShareToSpaceComposer.tsx`, `ContentActionRow.tsx` | Share-to-Space = public repost, commentary to repost | Save intent vs authorial publish intent | WS-1 / WS-2 / WS-3 / WS-7 |
| Public/home feed | `SpaceFeedSurface.tsx`, `SpaceFeedCard.tsx` | Repost taxonomy and commentary card | Authorial feed + legacy carve-out | WS-2 / WS-7 |
| Group feed | `GroupPageClient.tsx` + `SpaceFeedCard.tsx` | Repost labels can appear in group context | Authorial-only group language | WS-4 / WS-7 |
| Activity | `ActivityPageClient.tsx`, service titles | Repost social proof, incoming pressure, highlight CTA | Projection-only language | WS-6 / WS-7 |
| Profile/publications | `PostsPublicationsSurface.tsx` | Authorial publications mixed with reposts | Authorial output + legacy distinction | WS-2 / WS-3 / WS-5 / WS-7 |
| Saved | `SavedPostsPageClient.tsx` | Bookmark/save only | Distinguish bookmark from Private Repost | WS-1 / WS-7 |
| Future Private Repost surface | Absent | No owner-only/private-note vocabulary | Private Repost and private note concepts | WS-1 / WS-7 |
| Future Authorial/Source surface | Absent | No Source Reference vocabulary | Authorial Post and Source Reference concepts | WS-3 / WS-7 |
| Mock Space surfaces | `PostCard.tsx`, `ActivityBlock.tsx`, mock data | comments, replies, shares | Quarantine only | WS-5 / WS-7 |
| Device share surfaces | Pulse/Rielt | "not a Space repost" distinction | Keep as quarantine boundary | WS-7 |
| Contracts/internal docs | OpenAPI/SDK and Stage 13B.1-D | commentary/repost propagation vocabulary | Supersede/quarantine in canon registry | WS-7 governance |

Surface mapping tokens:

```text
ws_7_surface_share_flow_mapped: TRUE
ws_7_surface_feed_mapped: TRUE
ws_7_surface_group_feed_mapped: TRUE
ws_7_surface_activity_mapped: TRUE
ws_7_surface_profile_mapped: TRUE
ws_7_surface_legacy_mock_mapped: TRUE
ws_7_surface_contract_docs_mapped: TRUE
```

## SECTION 7 - Legacy Language Boundary

WS-7 inherits legacy policy from WS-5 and does not redesign it.

Legacy language boundary:

- legacy repost-shaped copy may exist only as distinguishable historical language;
- legacy "Комментарий к репосту" is not public/group canon;
- legacy activity copy is historical projection, not current Private Repost or Authorial Post behavior;
- legacy profile/feed repost counters are not post-transition authorial metrics;
- legacy highlight language is not post-transition save/publish success language;
- legacy/mock comment/reply/share wording is not runtime maturity evidence;
- Stage 13B.1-D public propagation language is superseded at product-semantics level while ownership lessons can remain historical context.

Legacy language matrix:

| Visible language | Legacy interpretation | Regression if used for new behavior |
| --- | --- | --- |
| "Репост" on public/group feed card | Historical repost row | New public/group repost expression |
| "Комментарий к репосту" | Historical public commentary | New private note shown as public commentary |
| "репост вашей публикации" | Historical repost activity | New incoming pressure |
| "Репосты: N" in profile | Legacy profile artifact | New repost as authorial output |
| "опубликован как репост" | Pre-transition write path | New save/publish without intent split |
| Mock comments/replies | Preview-only local/mock semantics | Runtime-backed forum surface |

Release-blocking rule:

If a reviewer cannot distinguish legacy language from post-transition Private Repost, Authorial Post, Source Reference, Group Feed, or Activity language, WS-7 verification fails.

WS-7 must not choose hide/archive/label/migration mechanics. It only defines the semantic requirement that legacy language be distinguishable.

## SECTION 8 - Verification Targets

These are conceptual targets for future runtime alignment and BV. They are not tests, copy replacements, UI designs, or implementation tasks.

### Positive verification targets

Future runtime alignment must prove:

1. Language teaches distinct save-for-myself and publish-my-thoughts intents.
2. Share flow language no longer teaches Share-to-Space as public repost publish for post-transition behavior.
3. Private Repost note language does not read as public/group commentary.
4. Authorial Post language is distinct from repost, quote, reply, or comment language.
5. Source Reference language does not use repost, quote, reply, parent, or chain semantics.
6. Public/home feed language does not present "Репосты" as active post-transition public taxonomy.
7. Group Feed language does not teach repost/comment/reply/forum mental model.
8. Activity language does not teach incoming repost pressure or repost social proof for new Private Reposts.
9. Profile/publication language does not count new reposts as authorial output.
10. Bookmark/save language remains distinct from Private Repost and Authorial Post.
11. Legacy language is distinguishable from post-transition behavior.
12. Mock comment/reply/share language is quarantined and not used as runtime maturity evidence.
13. Superseded Stage 13B.1-D propagation language is recorded as superseded by Stage 13B.2/13B.3 semantics.
14. Hiding repost words alone does not count as pass without target save/publish/authorial/source-reference vocabulary.

### Negative release-blocking signals

Future runtime alignment fails if:

- new user-facing success language says material was published as repost;
- post-transition public/group surfaces still use "Комментарий к репосту";
- share flow still has one undifferentiated save/publish/repost action language;
- activity copy says someone reposted your publication for new Private Repost behavior;
- Activity CTA still presents "Открыть репост" as canonical post-transition behavior;
- Group Feed copy teaches comment/reply/quote/repost chain semantics;
- Source Reference is labeled as repost, quote, reply, or target binding;
- profile/publication copy treats new reposts as authorial output;
- legacy language is indistinguishable from post-transition behavior;
- mock comment/share/reply vocabulary appears as active runtime doctrine;
- old 13B.1-D public propagation wording remains un-superseded as active canon.

### Verification traceability matrix

| Frozen rule | Future wording proof |
| --- | --- |
| Private Repost is owner-only | Language describes retention/private note, not public commentary |
| Authorial Post is expression | Publish language teaches authored material, not repost |
| Source Reference is one-hop context | Language avoids repost/quote/reply/chain |
| Public repost deprecated | Feed/share/activity/profile language does not teach active public repost |
| Group Feed authorial-only | Group wording avoids forum/repost/comment semantics |
| Activity projection-only | Activity wording avoids incoming repost pressure and economy/Blog authority |
| Legacy is carve-out | Legacy wording is distinguishable and not pass evidence |

## SECTION 9 - Runtime Risks

### Doctrine drift risks

- Repost copy can keep old public propagation doctrine alive after runtime semantics change.
- Source Reference can be renamed into repost target language.
- Private note can keep public "commentary" mental model.
- Authorial Post can be framed as answer/reply rather than standalone material.

### Terminology drift risks

- "Share", "save", "publish", "repost", and "bookmark" can collapse into one generic action.
- "Репосты" can remain a public taxonomy even after write/read semantics are aligned.
- "Есть связанный материал" can blur Source Reference and legacy repost binding.
- API/SDK/internal "commentary" names can leak into user-facing or canon-facing language.

### Legacy confusion risks

- Legacy labels can look like active doctrine without a carve-out distinction.
- Legacy activity copy can preserve incoming pressure.
- Legacy profile counters can inflate authorial output.
- Hiding all repost language can create false pass if Private Repost and Authorial Post vocabulary is absent.

### Sequencing risks

- WS-7 before WS-6 acceptance would quarantine copy against unstable activity semantics.
- WS-8 before WS-7 would lack a copy/mental-model audit vocabulary.
- Replacement copy before WS-1/WS-3 implementation authorization can imply a product path that does not exist.

## SECTION 10 - Dependency Relationship

WS-7 depends on accepted WS-1 through WS-6 boundaries.

| Dependency | Why WS-7 depends on it |
| --- | --- |
| WS-1 Private Repost | Defines owner-only retention and private note language boundary |
| WS-2 Public Repost Elimination | Defines which public/group repost language must disappear from target model |
| WS-3 Authorial Post + Source Reference | Defines expression and source/context language boundaries |
| WS-4 Group Feed Authorial-Only | Defines group feed language boundary: authorial, flat, not forum/repost stream |
| WS-5 Legacy Runtime Handling | Defines legacy language as carve-out, not active doctrine |
| WS-6 Activity Projection | Defines activity copy boundary: projection-only, no repost pressure |

WS-7 enables:

| Downstream | How WS-7 enables it |
| --- | --- |
| WS-8 Verification and BV Alignment | Provides copy/mental-model audit categories, negative blockers, false-pass rules, and legacy language distinction targets |

Critical path:

WS-1 + WS-3 + WS-5 -> WS-2 -> WS-4 -> WS-6 -> WS-7 -> WS-8.

## SECTION 11 - Readiness

WS-7 specification readiness:

| Area | Status | Notes |
| --- | --- | --- |
| Current runtime language inventory documented | Ready | Baseline is `RUNTIME_PRE_TRANSITION` |
| Canon position documented | Ready | Anchored in Stage 13B.2 and accepted Stage 13B.3-A through F |
| Language taxonomy defined | Ready | Repost, discussion, activity, authorial, source, legacy, mock, superseded language categories defined |
| Canon-aligned language defined | Ready | Concepts defined without writing replacement copy |
| Canon-conflicting language defined | Ready | Repost expression, response, chain, commentary, activity pressure, forum language identified |
| Runtime surface mapping defined | Ready | Share, feed, group, activity, profile, saved, mocks, docs mapped |
| Legacy boundary defined | Ready | WS-5 carve-out respected without implementation choice |
| Verification targets defined | Ready | Positive and negative targets documented |
| Runtime risks documented | Ready | Doctrine drift, terminology drift, legacy confusion, sequencing risks documented |
| Dependency relationship defined | Ready | WS-1 through WS-6 dependencies and WS-8 enablement documented |
| Implementation readiness | Not ready | Implementation remains unauthorized |

Is WS-7 ready for implementation after this specification?

No. This report makes WS-7 ready for review and acceptance as a runtime alignment specification. It does not authorize implementation, replacement copywriting, UX rewrite, frontend design, backend design, API design, DB design, OpenAPI, SDK, moderation, ranking, recommendation, economy, or rewards work.

What is ready:

- WS-7 language inventory.
- WS-7 language taxonomy.
- WS-7 canon-aligned and canon-conflicting language categories.
- WS-7 runtime surface mapping.
- WS-7 legacy language boundary.
- WS-7 verification targets.
- WS-7 dependency map.

What remains before implementation:

- explicit implementation authorization;
- accepted WS-8 Verification and BV Alignment;
- product decisions for exact visible wording where required;
- implementation planning for copy changes in a future non-read-only slice.

Recommended next step:

Stage 13B.3-H should prepare WS-8 - Verification and BV Alignment Specification. WS-7 now defines the language and mental-model audit boundary that WS-8 must verify together with runtime behavior and legacy carve-outs.

## Review gates

### Requirements Review

Result: pass.

The report answers the required sections for WS-7: current runtime language inventory, canon position, language taxonomy, canon-aligned language, canon-conflicting language, runtime surface mapping, legacy language boundary, verification targets, runtime risks, dependency relationship, and readiness.

### Architecture Review

Result: pass at runtime-specification level.

Ownership boundaries are preserved:

- Space owns Private Repost, Authorial Post, Group Feed, Activity, and legacy rows.
- Reactions owns like/bookmark facts.
- Source modules own source truth.
- Blog owns curated publication.
- Economy remains out of scope.

No frontend/backend design, API design, DB design, OpenAPI, SDK, copy replacement implementation, UX rewrite, moderation, ranking, recommendation, or implementation is proposed.

### Runtime Governance Review

Result: pass with `RUNTIME_PRE_TRANSITION`.

The report defines language quarantine semantics without authorizing runtime implementation. It separates post-transition language from public/group repost, repost-as-response, comment-to-repost, Source Reference confusion, Activity pressure, Group Feed forum language, and legacy carve-outs.

### QA Review

Result: pass.

Future verification targets and release-blocking negative signals are defined, including language that teaches the correct model, language that does not teach repost doctrine, language that does not reconstruct forum mental model, and distinguishable legacy language.

### Canon Review

Result: pass.

No doctrine changes were introduced. Stage 13B.2 canon is treated as immutable. Private Repost, Authorial Post, Source Reference, Group Feed, Activity, Legacy Policy, and Blog Candidate doctrine are not redesigned.

## Status tokens

```text
stage_13B_3_G_status: COMPLETE_AS_WS_7_LANGUAGE_AND_CANON_QUARANTINE_SPECIFICATION
stage_13B_3_G_execution_mode: READ_ONLY_RUNTIME_ALIGNMENT_SPECIFICATION
stage_13B_3_G_workstream: WS_7_LANGUAGE_AND_CANON_QUARANTINE_ALIGNMENT
stage_13B_3_G_current_runtime_state: RUNTIME_PRE_TRANSITION
stage_13B_3_G_language_gap_inventory_complete: TRUE
stage_13B_3_G_language_taxonomy_defined: TRUE
stage_13B_3_G_canon_aligned_language_defined: TRUE
stage_13B_3_G_canon_conflicting_language_defined: TRUE
stage_13B_3_G_runtime_surface_mapping_defined: TRUE
stage_13B_3_G_legacy_boundary_defined: TRUE
stage_13B_3_G_legacy_language_boundary_defined: TRUE
stage_13B_3_G_verification_targets_defined: TRUE
stage_13B_3_G_dependency_relationship_defined: TRUE
stage_13B_3_G_readiness_assessed: TRUE
stage_13B_3_G_save_publish_language_boundary_defined: TRUE
stage_13B_3_G_private_note_language_boundary_defined: TRUE
stage_13B_3_G_authorial_language_boundary_defined: TRUE
stage_13B_3_G_source_reference_language_boundary_defined: TRUE
stage_13B_3_G_group_feed_language_boundary_defined: TRUE
stage_13B_3_G_activity_language_boundary_defined: TRUE
stage_13B_3_G_mock_language_quarantine_defined: TRUE
stage_13B_3_G_canon_supersession_defined: TRUE
stage_13B_3_G_requires_implementation: FALSE
stage_13B_3_G_implementation_authorized: FALSE
stage_13B_3_G_implementation_proposed: FALSE
stage_13B_3_G_copy_rewrite_proposed: FALSE
stage_13B_3_G_next_recommended_step: STAGE_13B_3_H_WS_8_VERIFICATION_AND_BV_ALIGNMENT_SPECIFICATION
stage_13B_3_G_private_repost_redesign: FALSE
stage_13B_3_G_authorial_post_redesign: FALSE
stage_13B_3_G_source_reference_redesign: FALSE
stage_13B_3_G_group_feed_redesign: FALSE
stage_13B_3_G_activity_redesign: FALSE
stage_13B_3_G_legacy_policy_redesign: FALSE
stage_13B_3_G_blog_candidate_redesign: FALSE
stage_13B_3_G_api_design_proposed: FALSE
stage_13B_3_G_db_design_proposed: FALSE
stage_13B_3_G_openapi_proposed: FALSE
stage_13B_3_G_sdk_proposed: FALSE
stage_13B_3_G_frontend_design_proposed: FALSE
stage_13B_3_G_backend_design_proposed: FALSE
stage_13B_3_G_moderation_proposed: FALSE
stage_13B_3_G_ranking_proposed: FALSE
stage_13B_3_G_recommendation_proposed: FALSE
stage_13B_3_G_economy_proposed: FALSE
stage_13B_3_G_rewards_proposed: FALSE
```
