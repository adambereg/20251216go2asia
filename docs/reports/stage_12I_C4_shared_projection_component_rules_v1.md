# Stage 12I-C4 — Shared Projection Component Rules Report

Документ: `stage_12I_C4_shared_projection_component_rules_v1.md`  
Статус: implementation report / shared projection-safe UI vocabulary and helper layer  
Дата: 2026-05-22  
Scope: shared projection-safe UI helpers and bounded adoption across Quest C1, Connect C2 and Rielt C3 surfaces  
Mode: bounded implementation + shared UI governance slice

## 1. Stage 12I-C4 Verdict

Stage 12I-C4 creates a minimal shared projection UI layer for repeated non-authoritative labels, helper copy and low-dominance chips/footers.

The slice normalizes repeated terms such as `Read-only projection`, `Reference-only projection`, `Activity summary`, `Preview`, `Inquiry-only`, `Источник: seed preview` and `Источник: runtime projection` without turning them into a proof metadata engine.

Required statement:

```text
Stage 12I-C4 completed as shared projection-safe UI normalization, not design-system rewrite, runtime metadata implementation, API/OpenAPI/SDK/schema change, fake proof metadata, Path B activation or public launch approval.
```

Final verdict:

```text
stage_12I_C4_status: COMPLETE_AS_SHARED_PROJECTION_COMPONENT_RULES
task_type: shared_projection_safe_ui_normalization
risk_level: MEDIUM
shared_projection_vocabulary_created: true
shared_projection_helpers_created: true
quest_connect_rielt_adoption_bounded: true
semantic_drift_reduced: true
design_system_rewrite: false
runtime_changes: false
api_openapi_sdk_changes: false
schema_changes: false
fake_metadata_added: false
path_b_activation: false
public_launch_ready: false
```

## 2. Capsules Used

| Capsule | Role |
|---|---|
| `docs/ai/context/core/capsule.md` | owner fact, projection, mock/demo, Path A / Path B and no-public-launch doctrine |
| `docs/ai/context/ui/capsule.md` | UI proof-class, dashboard, projection, wallet-like and mock quarantine rules |
| `docs/ai/context/security/capsule.md` | screenshot-as-proof, support-proof and mock/projection abuse boundaries |
| `docs/ai/context/stage_12_product_reality/capsule.md` | Stage 12 cleanup routing and projection/mock/product-reality residue |
| `docs/ai/context/routing_rules.md` | bounded context composition, anti-overload and stop lines |

Upstream SSOT read:

- `docs/architecture/domain/stage_12_x_4_projection_metadata_proof_class_ui_requirements_v1.md`
- `docs/architecture/domain/stage_12_closure_review_v1.md`
- `docs/reports/stage_12I_C1_quest_reward_preview_proof_class_ui_boundary_v1.md`
- `docs/reports/stage_12I_C2_connect_projection_labels_v1.md`
- `docs/reports/stage_12I_C3_rielt_seed_source_labels_v1.md`

## 3. Agents Used

| Agent | Role in C4 |
|---|---|
| AI Program Director / Orchestrator | task classification, context boundary, review gate routing and final synthesis |
| Frontend Developer | repeated UI pattern audit and minimal shared helper strategy |
| Runtime Governance Architect | projection/helper layer review against authority escalation |
| Security / Fraud & Abuse Reviewer | screenshot-as-proof, fake receipt/proof/wallet/booking risk review |
| QA Agent | static tests, grep guardrails and validation strategy |
| Technical Canon Writer | report structure, canon alignment and residual gap register |
| Slice Strategist | bounded implementation boundary, stop lines and follow-up slice sequencing |

## 4. Orchestrator Classification

| Field | C4 decision |
|---|---|
| Task type | shared projection-safe UI normalization |
| Risk level | `MEDIUM` |
| Execution mode | bounded implementation |
| Primary domain | frontend UI governance |
| Review gates | Frontend, Runtime Governance, Security/Fraud, QA, Canon, Slice Strategy |
| Exact boundary | static shared UI vocabulary/components + bounded Quest/Connect/Rielt adoption |

Allowed:

- shared projection labels/chips;
- read-only helper text patterns;
- static source/inquiry/preview vocabulary;
- minimal component extraction;
- tests/grep guardrails;
- lightweight style normalization.

Forbidden and not performed:

- runtime/API/OpenAPI/SDK/schema changes;
- design-system rewrite;
- fake metadata fields such as `proofClass`, `asOf`, `sourceOwner`, `ownerFactRef`;
- Path B activation;
- business logic or data flow changes;
- booking/payment/wallet/proof authority states.

## 5. Audit Scope

Targeted audit covered only active projection-safe patterns introduced by C1/C2/C3:

| Area | Files inspected / affected |
|---|---|
| Quest preview labels | `app/(public)/quest/QuestHomeClient.tsx`, `app/(public)/quest/[id]/QuestDetailClient.tsx`, `app/(public)/quest/[id]/run/QuestRunnerClient.tsx`, `components/quest/QuestDetail/QuestRewards.tsx`, `QuestSteps.tsx`, `QuestRunnerActions.tsx`, `QuestRewards/localRewardScreenIsolation.test.ts` |
| Connect projection labels | `components/connect/copy.ts`, `components/connect/Dashboard/ActivityFeed.tsx`, `components/connect/copy.test.ts` |
| Rielt source/inquiry labels | `components/rielt/copy.ts`, `ListingCard.tsx`, `ListingDetail/Summary.tsx`, `ListingDetail/CTAPanel.tsx`, `sourceLabels.test.ts` |
| Shared projection helpers | `components/shared/projection/*` |

Out of audit scope:

- runtime DTO metadata;
- route/type cleanup;
- mock corpus quarantine;
- Connect dormant mock/Path B tabs;
- Rielt legacy type names such as `instantBooking` / `verified`;
- Quest complete route redesign;
- RF/Space/Home adoption.

## 6. Shared Projection Pattern Classification

| Pattern | Classification | C4 action |
|---|---|---|
| `Read-only projection` | safe shared vocabulary constant | centralized in `PROJECTION_LABELS` |
| `Reference-only projection` | safe shared vocabulary constant | centralized in `PROJECTION_LABELS` |
| `Activity summary` | safe shared vocabulary constant | centralized and adopted by Connect activity |
| `Preview` | safe shared vocabulary constant | centralized and adopted by Quest preview components |
| `Inquiry-only` | safe shared vocabulary constant/chip | centralized and adopted by Rielt cards/detail/CTA |
| `Источник: seed preview` | safe shared source label | centralized through `getProjectionSourceLabel('seed')` |
| `Источник: runtime projection` | safe shared source label | centralized through `getProjectionSourceLabel('runtime')` |
| low-dominance pill/chip styling | safe shared component | implemented as `ProjectionChip` |
| non-proof footer text | safe shared component/helper | implemented as `ProjectionFooter` and `PROJECTION_HELPERS` |
| `Points_row`, `badge_award_fact` | module-specific authority boundary | left local in Quest/Connect copy |
| `inventory authority`, `booking`, `host verification` | Rielt-specific boundary | left local in Rielt copy |
| fake metadata fields | dangerous to generalize | denylisted in tests; not used as runtime/UI facts |
| automatic proof classification | forbidden | not implemented |

## 7. Shared Projection Strategy Chosen

Chosen strategy: `shared vocabulary / local authority boundaries`.

Rules applied:

- shared helpers may provide stable UI language;
- shared helpers must remain static and non-authoritative;
- shared chips use muted informational styling only;
- module-specific proof boundaries stay in module copy;
- no helper infers source freshness, proof class, owner fact or support lookup;
- no helper maps UI labels into runtime metadata.

Preserved doctrine:

```text
projection != authority
preview != grant
dashboard != receipt
wallet != financial_wallet
listing_projection != inventory_authority
inquiry != booking
mock_data != proof
```

## 8. Shared Helpers / Components Created

| File | Purpose |
|---|---|
| `apps/go2asia-pwa-shell/components/shared/projection/copy.ts` | static shared projection vocabulary, helper copy and forbidden metadata field list for tests |
| `apps/go2asia-pwa-shell/components/shared/projection/ProjectionChip.tsx` | low-dominance chip for projection/source/preview/inquiry/activity labels |
| `apps/go2asia-pwa-shell/components/shared/projection/ProjectionFooter.tsx` | small muted footer/helper text component |
| `apps/go2asia-pwa-shell/components/shared/projection/index.ts` | bounded barrel for the projection helper slice |
| `apps/go2asia-pwa-shell/components/shared/projection/projectionRules.test.ts` | static C4 guardrail for vocabulary, fake metadata rejection and adoption |

The shared layer is intentionally not a design system, not a metadata engine and not a proof-class runtime.

## 9. Adopted Surfaces

| Module | Adoption |
|---|---|
| Quest | `Preview` constant adopted in active catalog/detail/run and exported reward preview widgets; `ProjectionChip` / `ProjectionFooter` adopted in the reward widget; C1 guard test updated to accept shared constant usage |
| Connect | `Read-only projection`, `Activity summary` and activity non-receipt helper moved behind shared vocabulary through `components/connect/copy.ts` |
| Rielt | source labels now use shared `getProjectionSourceLabel`; `Inquiry-only` chips use `ProjectionChip`; Rielt-specific non-booking/inventory copy remains local |

Module boundaries preserved:

- Quest still says `Preview internal Points`, `Не Points_row`, `Не badge_award_fact`;
- Connect still says Points/activity are projection-only and not wallet/receipt/accounting authority;
- Rielt still says inquiry-only, not booking/payment/availability/inventory authority.

## 10. Projection-Boundary Review

Runtime Governance:

- shared helpers are static UI helpers only;
- no owner state, lifecycle or projection generation logic was added;
- no fake `proofClass`, `asOf`, `sourceOwner` or `ownerFactRef` was introduced;
- source chips remain UI source labels, not proof metadata;
- Quest/Connect/Rielt remain semantically distinct.

Security / Fraud:

- repeated warning labels are more consistent across screenshot-sensitive surfaces;
- shared chips are muted and informational, not verified/proof/status-light styling;
- no receipt, payout, cashback, wallet balance, booking confirmed or NFT ownership semantics were introduced;
- tests include negative checks for fake metadata and unsafe authority wording.

QA:

- focused C4 tests cover shared vocabulary, adoption and existing C1/C2/C3 guardrails;
- full PWA test suite passes;
- targeted grep shows authority-risk matches only as negative disclaimers, tests or denylist entries.

Canon:

- C4 stays bounded to shared UI governance;
- no design-system rewrite or new canonical metadata contract was created;
- API metadata remains a separate future runtime/API/OpenAPI/SDK slice;
- public launch remains not implied.

## 11. Validation Command Results

| Command | Result | Notes |
|---|---|---|
| `pnpm guardrails:mock-imports:check` | Passed | Allowed baseline findings: 19 |
| `pnpm guardrails:mock-env:check` | Passed | Warnings / allowed references: 30 |
| `pnpm -C apps/go2asia-pwa-shell typecheck` | Passed | `tsc --noEmit` |
| `pnpm -C apps/go2asia-pwa-shell lint` | Passed | Exit code 0; existing warnings outside C4 scope remain |
| `pnpm -C apps/go2asia-pwa-shell test` | Passed | 18 files, 108 tests |
| focused C4/C1/C2/C3 tests | Passed | 4 files, 16 tests |
| IDE lints for changed files | Passed | No linter errors found |

Targeted grep:

| Scope | Result |
|---|---|
| `components/shared/projection` | `proof/receipt` only as negative helper copy; forbidden metadata only in denylist/test assertions |
| adopted Connect files | `receipt` only in negative copy; no positive wallet balance/payout/cashback/claim authority |
| adopted Quest files/tests | unsafe terms only in negative test assertions; active source keeps preview/non-proof posture |
| adopted Rielt files/tests | `proof/confirmed` only in negative guardrails; no booking confirmed/payment/instant booking authority |

## 12. Remaining Semantic Gaps

| Gap | Status / owner |
|---|---|
| API metadata envelope still absent (`proofClass`, `asOf`, `sourceOwner`, `ownerFactRef`) | Future runtime/API/OpenAPI/SDK metadata slice; C4 must not invent it |
| Quest C1 files are still local working-tree changes from the prior Quest slice | Preserved and extended only where needed for shared vocabulary adoption |
| Connect wallet route/API vocabulary remains legacy-shaped | Future route/type/API vocabulary cleanup |
| Rielt legacy type/filter names (`instantBooking`, `verified`, `onlyPROVerified`) remain | Future Rielt seed/mock/type vocabulary containment |
| Shared projection helpers are not yet adopted in RF/Space/Home | Future bounded module-by-module adoption only after audit |
| No support-safe owner lookup exists | Future Admin/support/runtime slice |

## 13. Acceptance Checklist

| Criteria | Result |
|---|---|
| Repeated projection-safe patterns normalized where appropriate | Passed |
| Shared projection helpers/components introduced minimally and safely | Passed |
| Quest/Connect/Rielt use more consistent projection-safe vocabulary | Passed |
| No fake metadata introduced | Passed |
| No runtime/API/schema changes | Passed |
| No authority/proof escalation introduced | Passed |
| Guardrails remain green | Passed |
| Typecheck/lint/tests pass | Passed |
| Report created | Passed |
| Path B inactive | Passed |
| Public launch not implied | Passed |

Must remain true:

```text
projection != authority
preview != grant
dashboard != receipt
wallet != financial_wallet
listing_projection != inventory_authority
inquiry != booking
mock_data != proof
Path_B_inactive = true
public_launch_implied = false
```

## 14. Recommended Next Slice

Recommended next slice:

```text
Stage 12I-C5 — Projection Helper Adoption Boundary Review
```

Goal:

```text
Evaluate whether RF, Space or Home should adopt the shared projection helpers, but only after a targeted audit and without API metadata, route/type cleanup or design-system expansion.
```

Alternative bounded next slice:

```text
Stage 12I-C5 — Rielt Seed / Mock / Type Vocabulary Containment
```

This would address the C3 residual Rielt mock/type vocabulary debt (`instantBooking`, `verified`, `onlyPROVerified`) without changing runtime/API/schema or introducing booking/payment semantics.
