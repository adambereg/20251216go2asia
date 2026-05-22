# Stage 12I-C2 — Connect Projection Labels Report

Документ: `stage_12I_C2_connect_projection_labels_v1.md`  
Статус: implementation report / Connect projection-label evidence  
Дата: 2026-05-22  
Scope: active Connect dashboard, wallet/activity, referrals, levels/badges, RF projection widgets and deferred Connect placeholders  
Mode: targeted audit -> bounded UI/test implementation -> validation -> report

## 1. Stage 12I-C2 Verdict

Stage 12I-C2 hardens active Connect projection surfaces so Connect reads as a carefully governed projection hub, not as a wallet, receipt, accounting statement, proof terminator or reward authority.

Before C2, Connect was already one of the safer Stage 12 areas, but several labels still carried authority-shaped language:

- dashboard headings like `Ваши Points`, `Ваши приглашения`, `Ваши бейджи`;
- wallet-like history and bucket copy that could still read like account state;
- activity/transaction-like rows without a visible non-receipt boundary;
- referral labels around `начисления`;
- badge labels around `получено`;
- RF summary labels such as `Получено через PRO`.

After C2, active Connect surfaces consistently use `read-only projection`, `reference-only`, `activity summary`, `not receipt`, `not proof`, `not accounting statement`, `not financial wallet`, `not badge_award_fact`, and RF lifecycle wording. No runtime/API/schema/OpenAPI/SDK changes were made, and no fake projection metadata was introduced.

Required statement:

```text
Stage 12I-C2 completed as Connect projection-label UI hardening slice, not runtime metadata implementation, Connect redesign, Points runtime rewrite, API/OpenAPI/SDK/schema change, Path B activation or public launch approval.
```

## 2. Capsules Used

| Capsule | Role |
|---|---|
| `docs/ai/context/core/capsule.md` | owner fact, projection, Path A/Path B and no-public-launch doctrine |
| `docs/ai/context/ui/capsule.md` | dashboard/projection/wallet-like UI proof-class rules |
| `docs/ai/context/security/capsule.md` | screenshot-as-proof, support-proof and projection abuse boundaries |
| `docs/ai/context/stage_12_product_reality/capsule.md` | Stage 12 residue, wallet-like route debt and product-reality routing |
| `docs/ai/context/routing_rules.md` | bounded context composition and stop lines |

## 3. Agents Used

| Agent | Role in C2 |
|---|---|
| AI Program Director / Orchestrator | task classification, scope boundary, audit routing, implementation synthesis and final acceptance |
| Frontend Developer | active Connect surface audit and copy/label hardening guidance |
| Runtime Governance Architect | projection != authority, dashboard != receipt, wallet != financial wallet review |
| Security / Fraud & Abuse Reviewer | screenshot-as-proof, fake receipt/accounting and payout/cashback risk review |
| QA Agent | regression test and targeted grep strategy |
| Technical Canon Writer | report structure and canon alignment |
| Slice Strategist | bounded implementation boundary and follow-up sequencing |

## 4. Audit Scope

Targeted audit covered active Connect projection surfaces only:

| Area | Files inspected |
|---|---|
| Connect routes and metadata | `app/(authenticated)/connect/**` |
| Dashboard projection | `components/connect/Dashboard/DashboardView.tsx`, `DashboardContent.tsx`, `BalanceCards.tsx` |
| Activity feed and transaction-like rows | `components/connect/Dashboard/ActivityFeed.tsx`, `components/connect/Wallet/TransactionList.tsx` |
| Wallet-like Points surface | `components/connect/Wallet/WalletView.tsx` |
| Referrals | `components/connect/Referrals/ReferralsView.tsx`, `ReferralsContent.tsx` |
| Levels/badges | `components/connect/Levels/LevelsView.tsx`, `AchievementsList.tsx`, `AchievementCard.tsx` |
| RF lifecycle widgets inside Connect | `components/connect/Dashboard/ConnectRfSection.tsx`, `VoucherSummaryCard.tsx`, `RfEconomicMeaningCard.tsx`, `RfVoucherProjectionPanel.tsx` |
| Deferred Connect placeholders | `components/connect/Missions/MissionsView.tsx`, `components/connect/Analytics/AnalyticsView.tsx` |
| Shared Connect copy/tests | `components/connect/copy.ts`, `copy.test.ts` |

Out of audit scope:

- Home, Quest B3/B4/C1 and RF PRO quarantine slices, except consistency checks;
- Connect runtime/API/OpenAPI/SDK/schema;
- fake `proofClass`, `asOf`, `sourceOwner`, `ownerFactRef`, freshness or support metadata;
- Points runtime redesign;
- Connect route/type cleanup;
- dormant mock views and Path B tabs, except residual-gap classification;
- public launch or support-proof approval.

## 5. Connect Projection Surface Classification

| Surface | Pre-C2 classification | Risk | C2 action | Post-C2 classification |
|---|---|---|---|---|
| Connect dashboard hero/metadata | runtime-backed projection | could read as personal center/progress authority | changed metadata/hero to `Projection Dashboard`, `read-only projection`, non-receipt/non-proof copy | runtime-backed projection, non-authoritative |
| Points dashboard summary | Points read projection | total could read like balance/account statement | changed headings to `Points projection`, added non-receipt/accounting language | read-only Points projection |
| Wallet-like `/connect/wallet` | Points read projection | wallet route/API vocabulary and bucket values can imply financial wallet | hardened route metadata, hero, title, buckets and summary copy | read-only internal Points projection, not financial wallet |
| Dashboard activity feed | transaction-like projection | rows could read as receipts or audit trail | changed heading/helper to `Activity summary`, reference-only, not receipt/audit trail | activity preview projection |
| Wallet transaction list | transaction-like projection | plus/minus rows could look like receipts | added explicit transaction-like row non-receipt/non-proof helper | activity reference projection |
| Referrals dashboard/card | referral read projection | `earned/начислено` copy could imply payout/commission authority | changed copy to Points projection, not commission statement/receipt/proof | referral projection |
| Levels/badges | badge projection | `получено` and achievement labels could imply badge authority or ownership | changed to badge projection/reflected wording and non-`badge_award_fact` helper | off-chain badge projection |
| RF summary in Connect | RF lifecycle projection | voucher counts and PRO-linked rows could imply benefit receipt/accounting | changed to RF lifecycle projection, financial settlement/payment/receipt boundary | RF lifecycle projection only |
| Missions/Analytics placeholders | deferred placeholders | could drift toward missions/statistics authority | kept deferred, changed helper to projection/backend aggregate posture | deferred placeholder |
| Dormant mock/legacy Connect components | mock/dormant | unsafe if rewired | not edited, classified as residual gap | unchanged, out of active C2 scope |

## 6. Projection-Label Strategy Chosen

Chosen strategy: `projection-visible / authority-forbidden`.

Applied rules:

- keep useful Connect summaries visible;
- label dashboards and summaries as `read-only projection`;
- label activity and transaction-like rows as `activity references`, not receipts;
- label Points values as internal projection, not `Points_row` or financial wallet;
- label referral totals as projection, not payout/commission statement;
- label badge UI as off-chain badge projection, not `badge_award_fact` or ownership;
- keep RF as lifecycle utility projection, not financial settlement/payment surface;
- do not invent runtime metadata.

Preferred terms used:

- `Read-only dashboard projection`;
- `Points projection`;
- `Activity summary`;
- `Reference-only projection`;
- `Transaction-like rows are read-only activity references`;
- `RF lifecycle projection`;
- `Badge projection only`;
- `не receipt`;
- `не proof`;
- `не accounting statement`;
- `не financial wallet`;
- `не badge_award_fact`;
- `backend-подтверждение`.

Terms avoided in active Connect UI:

- `wallet balance`;
- `balance updated`;
- `credited`;
- `settled`;
- `cashback`;
- `payout`;
- `NFT ownership`;
- receipt/proof as positive authority;
- fake `proofClass`, `asOf`, `sourceOwner`, `ownerFactRef`.

## 7. Files / Components Changed

| Path | Change |
|---|---|
| `apps/go2asia-pwa-shell/app/(authenticated)/connect/layout.tsx` | Metadata now describes Connect as projection center |
| `apps/go2asia-pwa-shell/app/(authenticated)/connect/page.tsx` | Dashboard metadata now says projection and not receipt/proof/accounting statement |
| `apps/go2asia-pwa-shell/app/(authenticated)/connect/wallet/page.tsx` | Wallet route metadata hardened as Points projection, not financial wallet |
| `apps/go2asia-pwa-shell/app/(authenticated)/connect/referrals/page.tsx` | Referral route metadata hardened as projection, not commission statement/receipt |
| `apps/go2asia-pwa-shell/app/(authenticated)/connect/levels/page.tsx` | Badge route metadata hardened as badge projection, not receipt/ownership |
| `apps/go2asia-pwa-shell/components/connect/copy.ts` | Shared Connect copy now uses projection/non-receipt wording |
| `apps/go2asia-pwa-shell/components/connect/copy.test.ts` | Added C2 regression coverage for active projection labels and anti-metadata-hallucination |
| `apps/go2asia-pwa-shell/components/connect/Dashboard/DashboardView.tsx` | Hero copy now labels Connect as read-only projection |
| `apps/go2asia-pwa-shell/components/connect/Dashboard/DashboardContent.tsx` | Dashboard Points/referrals/badges sections hardened |
| `apps/go2asia-pwa-shell/components/connect/Dashboard/BalanceCards.tsx` | Points summary/bucket copy hardened as projection/non-receipt |
| `apps/go2asia-pwa-shell/components/connect/Dashboard/ActivityFeed.tsx` | Activity feed labeled as reference-only activity summary |
| `apps/go2asia-pwa-shell/components/connect/Dashboard/VoucherSummaryCard.tsx` | RF metric labels and helper text hardened |
| `apps/go2asia-pwa-shell/components/connect/Dashboard/RfEconomicMeaningCard.tsx` | RF progress reframed as lifecycle projection |
| `apps/go2asia-pwa-shell/components/connect/Dashboard/RfVoucherProjectionPanel.tsx` | RF detail rows reframed as lifecycle projection |
| `apps/go2asia-pwa-shell/components/connect/Wallet/WalletView.tsx` | Wallet-like surface hardened as internal Points projection |
| `apps/go2asia-pwa-shell/components/connect/Wallet/TransactionList.tsx` | Transaction-like rows now explicitly non-receipt/non-proof |
| `apps/go2asia-pwa-shell/components/connect/Referrals/ReferralsView.tsx` | Referral status helper copy hardened |
| `apps/go2asia-pwa-shell/components/connect/Referrals/ReferralsContent.tsx` | Referral totals/rows hardened as projections |
| `apps/go2asia-pwa-shell/components/connect/Levels/LevelsView.tsx` | Levels/badge page hardened as badge projection |
| `apps/go2asia-pwa-shell/components/connect/Levels/AchievementsList.tsx` | User-facing status labels changed from received-style wording to reflected-style wording |
| `apps/go2asia-pwa-shell/components/connect/Levels/AchievementCard.tsx` | Badge rows now include non-`badge_award_fact` projection helper |
| `apps/go2asia-pwa-shell/components/connect/Missions/MissionsView.tsx` | Deferred missions copy avoids active reward/mission authority |
| `apps/go2asia-pwa-shell/components/connect/Analytics/AnalyticsView.tsx` | Deferred analytics copy avoids authoritative aggregates |
| `docs/reports/stage_12I_C2_connect_projection_labels_v1.md` | New report |

No runtime, API, OpenAPI, SDK, schema, migration or feature-flag files were changed.

## 8. Runtime Governance Review

Preserved:

- `projection != authority`;
- `dashboard != receipt`;
- `wallet != financial_wallet`;
- `activity_feed != audit_trail`;
- `Points_row = economic_fact`;
- `Connect != accounting_system`;
- `RF_projection != payout_or_cashback`;
- `badge_projection != badge_award`;
- `projection_can_help_find_owner_fact = true`;
- `projection_can_terminate_proof = false`.

Not introduced:

- no owner-state mutation;
- no Points producer or runtime rewrite;
- no wallet/accounting semantics;
- no `proofClass`;
- no `asOf`;
- no `sourceOwner`;
- no `ownerFactRef`;
- no support lookup metadata;
- no source/freshness hallucination.

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

- dashboard screenshots are less likely to be treated as receipt/proof;
- wallet-like Points UI is now explicitly not a financial wallet or accounting statement;
- transaction-like rows are explicitly non-receipt/non-proof and not full audit trail;
- referral totals are not commission/payout statements;
- RF summary remains lifecycle utility, not financial settlement/payment;
- badge surfaces are not ownership or badge award proof;
- no payout/cashback wording was introduced in active Connect UI.

No new abuse path introduced:

- no client-side Points mutation;
- no reward claim action;
- no fake receipt;
- no fake proof metadata;
- no stale projection authorization;
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
| `pnpm -C apps/go2asia-pwa-shell lint` | Passed | Exit code 0; existing warnings outside C2 scope remain |
| `pnpm -C apps/go2asia-pwa-shell test` | Passed | 16 files, 103 tests |
| `pnpm -C apps/go2asia-pwa-shell test -- components/connect/copy.test.ts` | Passed | 1 file, 5 tests |
| IDE lints for changed Connect files | Passed | No linter errors found |

Targeted grep validation:

| Scope | Result |
|---|---|
| `app/(authenticated)/connect/**` | Matches only intentional negative labels such as `не receipt`, `не proof`, `не financial wallet` |
| Active `components/connect/**` surfaces | Matches only negative labels/helpers, backend DTO/code field names such as `awardedAt`/`earned_points`, and C2 regression assertions |
| Dormant/mock Connect files | Existing matches remain in `mockData.ts`, deprecated referral helpers, dormant wallet tabs and tests; not reactivated by C2 |
| Invented metadata fields | No active implementation matches for `proofClass`, `sourceOwner`, `ownerFactRef`, `dataFreshness`, `stalenessStatus`, `projectionGeneratedAt`, `isProof`, `isReceipt`, `isAuthoritative`, `asOf`; C2 test asserts these stay absent |

## 11. Remaining Connect Gaps

| Gap | Status / owner |
|---|---|
| `/v1/wallet/summary` API vocabulary remains wallet-shaped | Future route/type/API vocabulary slice; C2 only hardens UI copy |
| Projection metadata envelope is absent from API DTOs | Future runtime/API/OpenAPI/SDK metadata slice; C2 must not invent fields |
| Connect DTO/type names still include legacy `earned_*`, `awardedAt`, `receivedViaPro` shapes | Future SDK/type alias cleanup after runtime contract approval |
| Dormant mock views and Path B tabs still exist under `components/connect` | Future mock/type quarantine slice; not active route surface in C2 |
| Full support-safe owner lookup is not implemented | Future Points/Admin/support runtime slice |
| Activity feed is still limited recent preview | Preserved; should not be marketed as complete history or audit trail |

## 12. Acceptance Checklist

| Criteria | Result |
|---|---|
| Active Connect projections clearly labeled as projections/read-only | Passed |
| Dashboard no longer implies receipt/proof authority | Passed |
| Wallet-like UI no longer implies financial wallet | Passed |
| Activity/transaction-like rows no longer imply receipt/accounting authority | Passed |
| Points summary no longer implies `Points_row` authority | Passed |
| Referrals/levels/progress no longer imply payout/social-score/accounting authority | Passed |
| RF lifecycle in Connect preserves no payout/cashback/payment posture | Passed |
| No fake metadata introduced | Passed |
| No runtime/API/schema changes | Passed |
| Guardrails remain green | Passed |
| Typecheck/lint/tests pass | Passed |
| Report created | Passed |
| Path B inactive | Passed |
| Public launch not implied | Passed |

Must remain true:

```text
projection != authority
dashboard != receipt
wallet != financial_wallet
activity_feed != audit_trail
Points_row = economic_fact
mock_data != proof
Path_B_inactive = true
public_launch_implied = false
```

## 13. Recommended Next Slice

Recommended next slice:

```text
Stage 12I-C3 — Connect Dormant Legacy / Mock / Path-B Surface Containment
```

Goal:

```text
Contain or quarantine dormant Connect mock views, Path B wallet tabs and legacy type/component names without changing Connect runtime/API/schema.
```

C3 should not start API metadata implementation. The API metadata slice remains separate and should only begin after an owner-approved runtime/API contract.

## 14. Final Verdict

```text
stage_12I_C2_status: COMPLETE_AS_CONNECT_PROJECTION_LABELS
stage_12I_C2_dashboard_projection_hardened: true
stage_12I_C2_wallet_like_surface_hardened: true
stage_12I_C2_activity_rows_hardened: true
stage_12I_C2_referrals_projection_hardened: true
stage_12I_C2_levels_badges_projection_hardened: true
stage_12I_C2_rf_lifecycle_projection_hardened: true
stage_12I_C2_projection_tests_added: true
stage_12I_C2_runtime_changes: false
stage_12I_C2_api_schema_changes: false
stage_12I_C2_points_runtime_rewrite: false
stage_12I_C2_fake_projection_metadata_added: false
stage_12I_C2_payout_cashback_semantics_added: false
stage_12I_C2_path_b_activation: false
mock_import_guardrail_baseline_findings: 19
public_launch_ready: false
canon_status: aligned
```
