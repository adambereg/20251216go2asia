# Stage 12I-B2 — RF PRO Legacy Route Quarantine Report

Документ: `stage_12I_B2_rf_pro_legacy_route_quarantine_v1.md`  
Статус: implementation report / RF PRO legacy route quarantine evidence  
Дата: 2026-05-22  
Scope: `/rf/pro/partners` and `/rf/pro/verifications` route-reachable mock operational surfaces  
Mode: targeted audit -> bounded implementation -> validation -> report

## 1. Stage 12I-B2 Verdict

Stage 12I-B2 quarantines the two high-risk RF PRO legacy operational routes:

- `/rf/pro/partners`;
- `/rf/pro/verifications`.

Before B2, these authenticated routes rendered operational-looking mock partner and verification data. After B2, they preserve route/navigation continuity but show truthful deferred/quarantine states without mock partner tables, fake verification workflows, demo checklists, fake statuses or fake operational authority.

Required statement:

```text
Stage 12I-B2 completed as RF PRO legacy route quarantine slice, not runtime verification/partners API implementation.
```

## 2. Capsules Used

| Capsule | Role |
|---|---|
| `docs/ai/context/core/capsule.md` | bounded-slice, no-public-launch, Path A/Path B boundary |
| `docs/ai/context/ui/capsule.md` | mock/demo UI, projection/proof, dashboard/receipt boundary |
| `docs/ai/context/security/capsule.md` | mock-as-proof and screenshot/support-proof rejection |
| `docs/ai/context/stage_12_product_reality/capsule.md` | Stage 12 follow-up routing and mock quarantine categories |
| `docs/ai/context/routing_rules.md` | anti-overload and capsule composition rules |

## 3. Agents Used

| Agent | Role in B2 |
|---|---|
| AI Program Director / Orchestrator | classification, scope control, sequencing and final synthesis |
| Slice Strategist | bounded quarantine strategy and stop lines |
| Frontend Developer | route/view implementation safety and navigation continuity |
| Runtime Governance Architect | no runtime/API/schema change and no projection-as-proof review |
| Security / Fraud & Abuse Reviewer | mock operational truth and screenshot-as-proof risk review |
| QA Agent | validation gates and targeted grep acceptance |
| Technical Canon Writer | report/verdict alignment and residual gap documentation |

## 4. Audit Scope

Targeted audit only covered B2-owned RF PRO legacy route surfaces and immediate dependencies:

| Area | Files inspected |
|---|---|
| Route pages | `app/(authenticated)/rf/pro/partners/page.tsx`, `app/(authenticated)/rf/pro/verifications/page.tsx` |
| Active route views | `components/rf/PRO/Partners/PartnersListView.tsx`, `components/rf/PRO/Verifications/VerificationsListView.tsx` |
| Route shell/navigation | `components/rf/PRO/PROLayout.tsx`, `components/rf/PRO/PRONav.tsx`, `components/rf/PRO/PROWorkspace.tsx` |
| Mock corpus reference | `components/rf/mockData.ts` via targeted `rg` only |

Out of audit scope:

- full RF module refactor;
- Merchant/Catalog legacy mock views;
- RF runtime/API/OpenAPI/SDK;
- RF business lifecycle changes;
- route/type cleanup outside exact B2 routes.

## 5. Previous Mock / Proof Risk Summary

Pre-B2 route graph:

```text
/rf/pro/partners -> PartnersListView -> mockPartners
/rf/pro/verifications -> VerificationsListView -> mockVerifications + mockPartners
```

Risk classes from Stage 12.x.3 / Stage 12.x.4:

- `ROUTE_REACHABLE_MOCK`;
- `MOCK_AS_PROOF_RISK`;
- `PRODUCT_REALITY_RISK`;
- `MOCK_DEMO`;
- `S-18 RF PRO legacy routes`.

Concrete risks:

- fake partner inventory and assignment looked like operational RF truth;
- fake verification statuses and checklists looked like real workflow state;
- screenshots could be mistaken for support or operational proof;
- route copy already said legacy/demo, but active mock tables still created authority illusion.

## 6. Quarantine Strategy Chosen

Chosen strategy: `truthful deferred route state`.

Why:

- preserves route integrity and navigation continuity;
- removes active mock rendering from the exact high-risk routes;
- does not invent replacement runtime;
- avoids fake API/projection metadata;
- keeps RF lifecycle doctrine intact.

Rejected strategies:

| Strategy | Reason rejected |
|---|---|
| Fake API replacement | Would create new runtime illusion |
| Synthetic projection | Would invent source/asOf/proofClass not supplied by API |
| Redirect-only | Would hide the reason and reduce operator clarity |
| Deleting mock corpora | Out of scope; B2 is route quarantine, not corpus cleanup |
| Broad RF refactor | Out of scope and high drift risk |

## 7. Files / Routes Changed

| Path | Change |
|---|---|
| `apps/go2asia-pwa-shell/app/(authenticated)/rf/pro/partners/page.tsx` | Metadata changed from legacy/demo list to deferred/quarantined route |
| `apps/go2asia-pwa-shell/app/(authenticated)/rf/pro/verifications/page.tsx` | Metadata changed from demo workflow to deferred/quarantined route |
| `apps/go2asia-pwa-shell/components/rf/PRO/Partners/PartnersListView.tsx` | Removed active `mockPartners` rendering, filters, ratings, badges and fake partner table; installed deferred route state |
| `apps/go2asia-pwa-shell/components/rf/PRO/Verifications/VerificationsListView.tsx` | Removed active `mockVerifications` / `mockPartners` rendering, status badges and checklists; installed deferred route state |
| `apps/go2asia-pwa-shell/components/rf/PRO/PRONav.tsx` | Updated route badges from `legacy`/`demo` to `deferred` |
| `apps/go2asia-pwa-shell/components/rf/PRO/PROLayout.tsx` | Updated operational-surface banner to quarantine / owner-backed runtime language |
| `apps/go2asia-pwa-shell/components/rf/PRO/PROWorkspace.tsx` | Updated CTA copy from legacy/demo list to deferred status |
| `docs/reports/stage_12I_B2_rf_pro_legacy_route_quarantine_v1.md` | New report |

No mock corpora were deleted.

## 8. Runtime Governance Review

Preserved:

- RF lifecycle utility doctrine;
- RF != payout;
- RF != cashback;
- RF != financial settlement;
- projection != authority;
- mock_data != operational truth.

Not changed:

- runtime behavior;
- backend services;
- API/OpenAPI/SDK/schema;
- RF voucher lifecycle logic;
- PRO attribution runtime;
- Points/rewards flows.

Proof-class transition:

```text
S-18_RF_PRO_legacy_routes: MOCK_DEMO -> DEFERRED_PLACEHOLDER
```

## 9. Security / Fraud & Abuse Review

Risk reduction:

- fake merchant/partner operational table removed from route;
- fake verification workflow removed from route;
- fake statuses/checklists no longer shown on active route;
- screenshot-as-proof risk reduced;
- support-proof illusion reduced.

No new fraud/economy risk introduced:

- no payout/cashback/settlement semantics;
- no reward or Points logic;
- no new verification action;
- no fake owner facts;
- no localStorage/mock replacement source.

## 10. Validation Command Results

| Command | Result | Notes |
|---|---|---|
| `pnpm guardrails:mock-imports:check` | Passed | Baseline remains 20 |
| `pnpm guardrails:mock-env:check` | Passed | 30 allowed policy/dev-demo references, 0 forbidden findings |
| `pnpm -C apps/go2asia-pwa-shell typecheck` | Passed | `tsc --noEmit` |
| `pnpm -C apps/go2asia-pwa-shell lint` | Passed | Existing lint gate green |
| `pnpm -C apps/go2asia-pwa-shell test` | Passed | 16 files, 98 tests |
| IDE lints for changed files | Passed | No linter errors found |

Targeted grep validation:

| Check | Result |
|---|---|
| `mockPartners` / `mockVerifications` in `app/(authenticated)/rf/pro/**` | No mock corpus matches |
| `mockPartners` / `mockVerifications` in `components/rf/PRO/Partners/**` | No matches |
| `mockPartners` / `mockVerifications` in `components/rf/PRO/Verifications/**` active view | No active route-view matches |
| active mock partner table on `/rf/pro/partners` | Removed |
| active mock verification cards/checklists on `/rf/pro/verifications` | Removed |

Note: `ChecklistForm` remains as dormant component under `components/rf/PRO/Verifications/`; it is not rendered by the B2 routes and remains out of scope for this slice.

## 11. Remaining RF Gaps

| Gap | Status / owner |
|---|---|
| RF mock corpus in `components/rf/mockData.ts` | Not deleted; future corpus cleanup/dev-only slice |
| Dormant `ChecklistForm` and legacy PRO subcomponents | Not route-rendered; future RF component/barrel containment |
| Merchant/Catalog default mock props | Out of B2; future RF legacy view cleanup |
| RF PRO runtime partner/verification APIs | Not implemented; future runtime/API slice if approved |
| Quest complete mock route | Next critical mock route cleanup candidate |

## 12. Acceptance Checklist

| Criteria | Result |
|---|---|
| `/rf/pro/partners` no longer presents mock operational truth | Passed |
| `/rf/pro/verifications` no longer presents mock operational truth | Passed |
| Active mock rendering removed/quarantined | Passed |
| Truthful deferred state installed | Passed |
| RF lifecycle semantics preserved | Passed |
| No runtime/API/schema changes | Passed |
| No fake replacement runtime introduced | Passed |
| No payout/cashback semantics introduced | Passed |
| Guardrails remain green | Passed |
| Typecheck/lint/tests pass | Passed |
| Report created | Passed |
| Path B inactive | Passed |
| Public launch not implied | Passed |

## 13. Recommended Next Slice

Recommended next slice:

```text
Stage 12I-B3 — Quest Complete Cleanup
```

Goal:

```text
Remove or quarantine /quest/[id]/complete as a route-reachable mock reward/quest completion surface.
```

B3 is not started in this B2 slice.

## 14. Final Verdict

```text
stage_12I_B2_status: COMPLETE_AS_RF_PRO_LEGACY_ROUTE_QUARANTINE
stage_12I_B2_mock_operational_truth_removed_from_routes: true
stage_12I_B2_routes_preserved: true
stage_12I_B2_navigation_preserved: true
stage_12I_B2_mock_components_deleted: false
stage_12I_B2_runtime_changes: false
stage_12I_B2_api_schema_changes: false
stage_12I_B2_mock_quarantine_complete: false
rf_pro_partners_mock_operational_truth_removed: true
rf_pro_verifications_mock_operational_truth_removed: true
rf_lifecycle_semantics_preserved: true
rf_payout_cashback_semantics_introduced: false
public_launch_ready: false
canon_status: aligned
```

