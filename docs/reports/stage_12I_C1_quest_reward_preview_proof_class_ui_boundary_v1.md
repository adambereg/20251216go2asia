# Stage 12I-C1 — Quest Reward Preview Proof-Class UI Boundary Report

Документ: `stage_12I_C1_quest_reward_preview_proof_class_ui_boundary_v1.md`  
Статус: implementation report / Quest reward preview proof-boundary evidence  
Дата: 2026-05-22  
Scope: active Quest catalog/detail/run reward preview surfaces plus exported legacy preview components  
Mode: targeted audit -> bounded implementation -> validation -> report

## 1. Stage 12I-C1 Verdict

Stage 12I-C1 hardens active Quest reward preview surfaces so preview values remain visibly non-proof and non-receipt.

Before C1, active Quest catalog/detail/run UI already avoided direct reward grant copy in many places, but reward values were still shown as plain Points labels such as:

- `Internal Points после подтверждения`;
- `До N очков`;
- `+N очков`;
- generic `Off-chain бейджи`.

Those labels were safer than pre-B3/B4 completion surfaces, but still did not consistently mark values as preview-only and could be screenshotted as a reward/Points/badge proof claim.

After C1, active preview values are labeled as `Preview`, `possible/internal Points`, `not Points_row`, `not receipt`, and badge metadata is explicitly separated from `badge_award_fact` and ownership. No Quest runtime, Points runtime, badge award runtime, API, OpenAPI, SDK, schema or route rewrite was performed.

Required statement:

```text
Stage 12I-C1 completed as Quest reward preview proof-class UI boundary slice, not Quest runtime, Points runtime, badge award runtime, projection metadata implementation or Quest redesign.
```

## 2. Capsules Used

| Capsule | Role |
|---|---|
| `docs/ai/context/core/capsule.md` | owner-fact doctrine, bounded slice, Path A/Path B firewall and no-public-launch boundary |
| `docs/ai/context/ui/capsule.md` | UI proof-class, projection, preview, receipt and Path B vocabulary rules |
| `docs/ai/context/security/capsule.md` | screenshot-as-proof, support-proof and mock/projection abuse rejection |
| `docs/ai/context/stage_12_product_reality/capsule.md` | Stage 12 cleanup routing and XP/leaderboard/social-score blocked posture |
| `docs/ai/context/routing_rules.md` | minimal context composition and anti-overload rules |

## 3. Agents Used

| Agent | Role in C1 |
|---|---|
| AI Program Director / Orchestrator | task classification, scope boundary, context selection and final synthesis |
| Slice Strategist | bounded implementation boundary and stop conditions |
| Frontend Developer | active Quest UI audit and copy hardening guidance |
| Runtime Governance Architect | preview != grant / Points_row / badge_award_fact review |
| Security / Fraud & Abuse Reviewer | screenshot-as-proof and fake receipt/ownership risk review |
| QA Agent | grep/test validation and regression coverage |
| Technical Canon Writer | report structure, canon wording and residual gap register |

## 4. Audit Scope

Targeted audit covered only active or export-adjacent Quest reward preview surfaces:

| Area | Files inspected |
|---|---|
| Quest catalog cards | `app/(public)/quest/QuestHomeClient.tsx` |
| Quest detail page | `app/(public)/quest/[id]/QuestDetailClient.tsx` |
| Quest run/progress surface | `app/(public)/quest/[id]/run/QuestRunnerClient.tsx` |
| Exported legacy Quest card | `components/quest/QuestCard.tsx` |
| Exported legacy detail preview widgets | `components/quest/QuestDetail/QuestRewards.tsx`, `QuestSteps.tsx` |
| Runner action helper | `components/quest/QuestRunner/QuestRunnerActions.tsx` |
| Existing B3/B4 regression tests | `components/quest/QuestRewards/localRewardScreenIsolation.test.ts` |
| Deferred leaderboard route | `app/(public)/quest/leaderboard/*` |
| B3/B4 local/dormant surfaces | Verified only for scope consistency; not reopened for redesign |

Out of audit scope:

- Quest runtime rewrite;
- Quest PRO management redesign;
- Points producer or ledger implementation;
- badge award runtime implementation;
- API/OpenAPI/SDK/schema changes;
- fake `proofClass`, `asOf`, `sourceOwner` or owner reference metadata;
- Path B, NFT/on-chain ownership, XP, leaderboard or social-score activation;
- broad Quest type/route cleanup.

## 5. Preview Surface Classification

| Surface | Pre-C1 classification | Risk | C1 action | Post-C1 classification |
|---|---|---|---|---|
| Quest catalog reward line | runtime-backed preview | Points value looked like ordinary reward value | changed to `Preview internal Points`, `Не Points_row`, backend confirmation boundary | runtime-backed preview, non-proof |
| Quest detail reward summary tile | runtime-backed preview | Points value could be read as receipt-like summary | changed to `Preview internal Points`, `возможные Points`, `Не Points_row и не receipt` | runtime-backed preview, non-proof |
| Quest detail step reward text | runtime-backed step preview | step Points could imply applied reward | changed to `Preview шага: до ... internal Points ... не receipt` | runtime-backed preview, non-proof |
| Quest run current-step reward label | runtime-backed step preview | `До N очков` lacked proof boundary | changed to `Preview: до ... internal Points` plus non-Points_row/non-receipt helper | runtime-backed preview, non-proof |
| `QuestCard` exported card | preview-only legacy/export-adjacent | compact Points and badge labels lacked enough boundary | added preview Points, badge metadata preview and non-proof helper | safe after copy hardening |
| `QuestRewards` exported widget | preview-only legacy/export-adjacent | "Off-chain бейджи" could look like badge inventory | changed to `Preview badge metadata` and `Не badge_award_fact` helper | safe after copy hardening |
| `QuestSteps` exported widget | preview-only legacy/export-adjacent | `+N очков` looked like awarded/applied Points | changed to `Preview: до ... internal Points` | safe after copy hardening |
| `QuestRunnerActions` skip penalty | local progress action helper | penalty wording looked like direct Points accounting | changed to `preview penalty` | safe after copy hardening |
| `/quest/leaderboard` | deferred | XP/leaderboard terms exist only as blocked/deferred copy | unchanged | deferred, not active economy |
| `/quest/[id]/complete` | local/deferred from B3 | negative wording only | unchanged | local/deferred notice |
| Dormant `QuestRewards/*` widgets | dormant legacy/internal from B4 | not active | unchanged except regression coverage adjacency | dormant contained |

## 6. Proof-Boundary Strategy

Chosen strategy: `preview-visible / grant-authority-forbidden`.

Applied rules:

- preview values may stay visible;
- preview labels must explicitly say `Preview`;
- Points values must not look like `Points_row`;
- badge metadata must not look like `badge_award_fact` or ownership;
- step/run values must not look applied after submission;
- no fake owner metadata may be invented;
- deferred leaderboard/XP/social-score remains blocked.

Preferred terms used:

- `Preview internal Points`;
- `возможные Points`;
- `Не Points_row`;
- `не receipt`;
- `badge metadata preview`;
- `Не badge_award_fact`;
- `backend-подтверждение`.

Terms avoided in active runtime preview files:

- `earned`;
- `awarded`;
- `received`;
- `claim reward`;
- `reward receipt`;
- `NFT ownership`;
- `XP`;
- `leaderboard`;
- `получено`;
- `начислено`;
- `получить награду`;
- `полученный бейдж`.

## 7. Files / Components Changed

| Path | Change |
|---|---|
| `apps/go2asia-pwa-shell/app/(public)/quest/QuestHomeClient.tsx` | Catalog reward line now says `Preview internal Points`, `Не Points_row`, and backend confirmation boundary |
| `apps/go2asia-pwa-shell/app/(public)/quest/[id]/QuestDetailClient.tsx` | Detail reward tile and step reward preview now explicitly show preview/non-receipt semantics |
| `apps/go2asia-pwa-shell/app/(public)/quest/[id]/run/QuestRunnerClient.tsx` | Run step reward hint now says `Preview` and includes non-Points_row/non-receipt helper text |
| `apps/go2asia-pwa-shell/components/quest/QuestCard.tsx` | Exported card preview now labels Points and badge metadata as preview only |
| `apps/go2asia-pwa-shell/components/quest/QuestDetail/QuestRewards.tsx` | Exported reward widget changed to preview/non-proof wording for Points and badge metadata |
| `apps/go2asia-pwa-shell/components/quest/QuestDetail/QuestSteps.tsx` | Legacy step Points label changed from `+N очков` to preview wording |
| `apps/go2asia-pwa-shell/components/quest/QuestRunner/QuestRunnerActions.tsx` | Skip penalty copy now says `preview penalty` instead of direct point deduction semantics |
| `apps/go2asia-pwa-shell/components/quest/QuestRewards/localRewardScreenIsolation.test.ts` | Added C1 regression coverage for active preview files and unsafe wording exclusions |
| `docs/reports/stage_12I_C1_quest_reward_preview_proof_class_ui_boundary_v1.md` | New report |

No runtime, API, OpenAPI, SDK, schema, migration or route files were changed.

## 8. Runtime Governance Review

Preserved:

- Quest preview != reward grant;
- Quest preview != Points_row;
- Quest preview != badge_award_fact;
- Quest_outbox = delivery_intent_only;
- Points_row = economic_fact;
- badge_award_fact != NFT;
- projection != authority;
- mock_data != proof.

Not introduced:

- no reward grant action;
- no Points mutation;
- no badge inventory mutation;
- no owner-source metadata;
- no `proofClass`;
- no `asOf`;
- no `sourceOwner`;
- no support-proof lookup.

Runtime status:

```text
runtime_status: approved_for_bounded_ui_copy_slice
runtime_changes: false
api_openapi_sdk_changes: false
schema_changes: false
metadata_hallucination: false
```

## 9. Security / Fraud & Abuse Review

Risk reduction:

- active Quest preview values are less screenshot-sensitive as reward proof;
- Points preview is explicitly separated from receipt/accounting language;
- badge preview is explicitly separated from award/ownership language;
- step/run preview no longer looks like applied Points;
- `claim reward` style CTA was not introduced;
- XP/leaderboard/social-score remains deferred/blocked.

No new abuse path introduced:

- no client-side reward action;
- no fake reward receipt;
- no fake badge ownership;
- no Points runtime or balance mutation;
- no localStorage proof source;
- no Path B activation.

Security status:

```text
security_risk: acceptable
abuse_risk: acceptable
```

## 10. Validation Command Results

| Command | Result | Notes |
|---|---|---|
| `pnpm guardrails:mock-imports:check` | Passed | Allowed baseline findings: 19 |
| `pnpm guardrails:mock-env:check` | Passed | 30 allowed policy/dev-demo references, 0 forbidden findings |
| `pnpm -C apps/go2asia-pwa-shell typecheck` | Passed | `tsc --noEmit` |
| `pnpm -C apps/go2asia-pwa-shell lint` | Passed | Exit code 0 |
| `pnpm -C apps/go2asia-pwa-shell test` | Passed | 16 files, 102 tests |
| IDE lints for changed files | Passed | No linter errors found |

Targeted grep validation:

| Scope | Result |
|---|---|
| Active runtime preview files: `QuestHomeClient`, `QuestDetailClient`, `QuestRunnerClient` | No matches for unsafe C1 terms |
| Export-adjacent preview components: `QuestCard`, `QuestRewards`, `QuestSteps`, `QuestRunnerActions` | No matches for unsafe C1 terms |
| Wider Quest app/components grep | Matches only in deferred/negative/dormant/test surfaces, including `/quest/leaderboard`, `/quest/[id]/complete`, B4 comments and regression assertions |

## 11. Remaining Quest Preview Gaps

| Gap | Status / owner |
|---|---|
| API still exposes only plain reward fields without proof-class metadata | Future runtime/API metadata slice; C1 must not invent metadata |
| Quest PRO management uses `rewardPoints` as configuration field | Left unchanged; future PRO management terminology slice may harden editor labels |
| Legacy `NFTBadge` type names remain | Out of C1; future alias/type cleanup slice |
| Dormant reward widgets and local helper utilities still exist | B4 bounded them; future deletion/move only after import graph decision |
| `/quest/leaderboard` route still exists as deferred surface | Safe/deferred; no activation in C1 |
| Owner-backed Points/badge proof lookup | Requires future runtime/API/support slice |

## 12. Acceptance Checklist

| Criteria | Result |
|---|---|
| Active Quest reward preview surfaces no longer imply reward grant | Passed |
| Preview wording clearly non-proof/non-receipt | Passed |
| Badge preview wording no longer implies ownership/award | Passed |
| No XP/leaderboard/social-score activation | Passed |
| No runtime/API/schema changes | Passed |
| No fake projection metadata introduced | Passed |
| Guardrails remain green | Passed |
| Typecheck/lint/tests pass | Passed |
| Report created | Passed |
| Path B inactive | Passed |
| Public launch not implied | Passed |

Must remain true:

```text
Quest_preview != reward_proof
Quest_preview != reward_grant
Quest_preview != Points_row
Quest_preview != badge_award_fact
mock_data != proof
projection != authority
Path_B_inactive = true
public_launch_implied = false
```

## 13. Recommended Next Slice

Recommended next slice:

```text
Stage 12I-C2 — Quest PRO Reward Configuration Terminology & Legacy Type Boundary
```

Goal:

```text
Harden Quest PRO management/editor rewardPoints labels and legacy NFTBadge type-facing copy without changing Quest runtime/API/schema.
```

C2 is not started in this C1 slice.

## 14. Final Verdict

```text
stage_12I_C1_status: COMPLETE_AS_QUEST_REWARD_PREVIEW_PROOF_CLASS_UI_BOUNDARY
stage_12I_C1_active_catalog_preview_hardened: true
stage_12I_C1_active_detail_preview_hardened: true
stage_12I_C1_active_run_preview_hardened: true
stage_12I_C1_badge_preview_hardened: true
stage_12I_C1_reward_preview_tests_added: true
stage_12I_C1_runtime_changes: false
stage_12I_C1_api_schema_changes: false
stage_12I_C1_points_runtime_added: false
stage_12I_C1_badge_runtime_added: false
stage_12I_C1_fake_projection_metadata_added: false
stage_12I_C1_xp_leaderboard_social_score_added: false
mock_import_guardrail_baseline_findings: 19
public_launch_ready: false
canon_status: aligned
```
