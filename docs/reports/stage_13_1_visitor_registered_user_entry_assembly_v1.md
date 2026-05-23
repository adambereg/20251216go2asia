# Stage 13.1 — Visitor / Registered User Entry Assembly Report

Документ: `stage_13_1_visitor_registered_user_entry_assembly_v1.md`
Статус: implementation report / visitor and registered user entry assembly
Дата: 2026-05-23
Scope: Home -> auth -> authenticated Home -> Connect/Profile/module entry assembly
Mode: bounded PWA navigation/copy assembly slice

## 1. Final Verdict

Stage 13.1 is complete as a bounded PWA entry-journey implementation slice.

```text
stage_13_1_status: COMPLETE_AS_VISITOR_REGISTERED_USER_ENTRY_ASSEMBLY
task_type: bounded_pwa_navigation_copy_assembly
risk_level: MEDIUM
visitor_entry_aligned: true
registered_user_entry_aligned: true
dead_register_cta_removed_or_aligned: true
runtime_changes: false
api_schema_changes: false
sdk_changes: false
database_changes: false
new_auth_provider_behavior: false
new_reward_or_points_producers: false
path_b_activation: false
public_launch_ready: false
canon_status: aligned
```

The slice fixed stale auth entry semantics and improved the first coherent journey:

```text
Visitor -> /sign-up or /sign-in -> authenticated Home -> Profile / Connect / activity / levels / referrals / RF vouchers / modules
```

## 2. Source Materials / Upstream Canon Read

Required capsules and reports read:

- `docs/ai/context/core/capsule.md`
- `docs/ai/context/ui/capsule.md`
- `docs/ai/context/stage_12_product_reality/capsule.md`
- `docs/ai/context/routing_rules.md`
- `docs/reports/stage_12I_closure_review_v1.md`
- `docs/reports/stage_13_0_user_journey_assembly_plan_slice_map_v1.md`

Role files read:

- `docs/ai/roles/orchestrator.md`
- `docs/ai/roles/frontend_dev.md`
- `docs/ai/roles/requirements_analyst.md`
- `docs/ai/roles/runtime_governance_architect.md`
- `docs/ai/roles/qa.md`
- `docs/ai/roles/tech_writer.md`

Relevant PWA files inspected:

- `apps/go2asia-pwa-shell/app/HomePageClient.tsx`
- `apps/go2asia-pwa-shell/middleware.ts`
- `apps/go2asia-pwa-shell/app/(auth)/sign-in/[[...sign-in]]/page.tsx`
- `apps/go2asia-pwa-shell/app/(auth)/sign-up/[[...sign-up]]/page.tsx`
- `apps/go2asia-pwa-shell/app/(authenticated)/connect/layout.tsx`
- `apps/go2asia-pwa-shell/app/(authenticated)/connect/page.tsx`
- `apps/go2asia-pwa-shell/components/connect/Dashboard/DashboardContent.tsx`
- `apps/go2asia-pwa-shell/components/landing/HomePageContent.tsx`
- `apps/go2asia-pwa-shell/components/landing/PersonalWelcome.tsx`
- `packages/ui/src/components/ModuleTile/ModuleTile.tsx`

## 3. Files Changed

PWA/UI files changed:

- `apps/go2asia-pwa-shell/app/HomePageClient.tsx`
- `apps/go2asia-pwa-shell/components/connect/Dashboard/DashboardContent.tsx`
- `apps/go2asia-pwa-shell/components/landing/HomePageContent.tsx`
- `apps/go2asia-pwa-shell/components/landing/PersonalWelcome.tsx`

Documentation artifact created:

- `docs/reports/stage_13_1_visitor_registered_user_entry_assembly_v1.md`

Files intentionally not changed:

- Services.
- API gateway.
- SDK.
- OpenAPI.
- Database/schema/migrations.
- Economy/runtime internals.
- Diagnostics internals.
- Middleware auth rules.

## 4. Journey Improvements Implemented

Visitor entry:

- Replaced stale `/register` Home CTA usage with the actual `/sign-up` route.
- Added explicit returning-user `/sign-in` CTAs on the unauthenticated Home hero and community CTA.
- Removed the misleading locked badge from clickable visitor module tiles in active Home.
- Clarified module discovery copy: public sections can be opened immediately, while personal actions ask the user to sign in.

Registered user entry:

- Added authenticated Home next actions for `/profile` and `/connect/activity`.
- Preserved existing authenticated Home next actions to `/connect`, `/connect/levels`, `/connect/referrals` and `/rf/vouchers`.
- Changed authenticated bottom CTA away from registration and toward `/connect` and `/profile`.

Connect continuation:

- Converted static Connect "next steps" cards into clear route continuations:
  - `/quest`
  - `/connect/referrals`
  - `/connect/levels`
- Kept Connect copy as read-only projection language.

Legacy landing components:

- Replaced legacy `/signup` usage with `/sign-up`.
- Added `/sign-in` entry actions where the legacy landing component still presents auth CTAs.
- Removed misleading locked module tile state from the legacy landing component while leaving routing behavior unchanged.
- Adjusted `PersonalWelcome` quick action copy from voucher-shaped wording to Connect activity wording.

## 5. Dead / Confusing Edges Removed

Removed or aligned:

- Broken/stale `/register` edge from active Home.
- Legacy `/signup` edge from landing component.
- Visitor Home "locked but clickable" module tile presentation.
- Authenticated Home registration CTA.
- Voucher-shaped quick-action copy pointing to Connect.

Confirmed after implementation:

```text
active_pwa_register_or_signup_legacy_edges_found: false
```

## 6. Runtime Boundaries Preserved

No runtime semantics were added or changed.

Stage 12I invariants preserved:

```text
mock_data != proof
projection != authority
preview != grant
dashboard != receipt
wallet != financial_wallet
listing_projection != inventory_authority
inquiry != booking
lookup != proof
diagnostic_snapshot != customer_proof
operational_trace != immutable_audit_ledger
owner_fact = authoritative
Path_B_inactive = true
public_launch_implied = false
```

Stage 13.1-specific boundaries:

```text
Home CTA alignment != new auth behavior
registered_entry != receipt_dashboard
Connect activity != financial_wallet
module_discovery != public_launch_claim
projection_copy != owner_fact_authority
```

This slice did not add:

- new reward or Points producers;
- wallet, payout, cashback, token, NFT, bridge or Path B runtime;
- proof, receipt, booking, settlement or ownership authority;
- API, OpenAPI, SDK, DB or schema changes;
- new auth provider behavior;
- public launch readiness claims;
- customer-facing diagnostics or support proof.

## 7. Validation

Validation performed:

- `pnpm -C apps/go2asia-pwa-shell typecheck` — passed.
- `pnpm -C apps/go2asia-pwa-shell lint` — passed with existing repository warnings.
- `pnpm -C apps/go2asia-pwa-shell test` — passed, 22 test files / 120 tests.
- `rg "/register|/signup" apps/go2asia-pwa-shell --glob "*.{tsx,ts}"` — no matches after implementation.
- `ReadLints` on changed PWA files — no linter errors.
- `git diff --check` — passed.
- `git diff --no-index --check -- /dev/null docs/reports/stage_13_1_visitor_registered_user_entry_assembly_v1.md` — passed for the new untracked report artifact.

No service, API, SDK, schema or database validation was required because this slice did not change those layers.

## 8. Remaining Gaps / Deferred Items

Deferred to later Stage 13 slices:

- `13.2 — Connect / Points Projection Journey Assembly`: deepen Connect activity/levels/referrals/wallet-alias journey while preserving `wallet != financial_wallet` and `dashboard != receipt`.
- Quest-specific handoff from completion/progress to Connect activity remains for `13.3`.
- Rielt inquiry status journey remains for `13.4`.
- RF/VIP/PRO journey assembly remains for `13.5` and `13.6`.
- Space/profile social boundary pass remains for `13.7`.
- Internal support/admin diagnostics journey remains for `13.8`.

Known residual limitation:

- The legacy landing component still contains static demo-oriented data because fully retiring or redesigning that component is outside Stage 13.1 scope. This slice only aligned its auth routes and reduced misleading entry copy.

## 9. Recommended Next Slice

Recommended next slice:

```text
Stage 13.2 — Connect / Points Projection Journey Assembly
```

Reason:

- Stage 13.1 now provides a coherent route into Connect.
- The next safe layer is to assemble Connect activity, levels, referrals and legacy wallet alias while explicitly preserving projection boundaries.

## 10. Final Canon Status

```text
canon_status: aligned
review_gates:
  requirements_review: applied
  frontend_review: applied
  runtime_governance_review: applied
  qa_review: applied
  canon_review: applied
```

Final statement:

Stage 13.1 improved entry journey continuity without expanding runtime authority, economy semantics, proof semantics, wallet semantics, booking semantics, public launch semantics or Path B.
