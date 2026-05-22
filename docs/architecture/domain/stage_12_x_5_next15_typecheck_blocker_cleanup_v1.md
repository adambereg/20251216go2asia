# Stage 12.x.5 — Next 15 Typecheck Blocker Cleanup

Документ: `stage_12_x_5_next15_typecheck_blocker_cleanup_v1.md`  
Статус: bounded technical implementation unblock note  
Дата: 2026-05-22  
Scope: PWA shell Next 15 async route/page params signature alignment only  
Mode: small frontend type-signature fix; no product/copy/mock/runtime/API/OpenAPI/SDK/schema changes

## 0. Orchestration Summary

Task type: bounded frontend typecheck cleanup.

Risk level: `MEDIUM`.

Capsules used:

| Capsule | Role |
|---|---|
| `docs/ai/context/core/capsule.md` | Stage boundary, no-public-launch and no scope creep rules |
| `docs/ai/context/ui/capsule.md` | UI route context and no product/copy/mock drift |
| `docs/ai/context/routing_rules.md` | Stage 12.x.5 capsule routing: `core + ui` only |

Review gates:

| Gate | Result |
|---|---|
| Frontend Review | Passed; minimal Next 15 async params pattern confirmed |
| QA Review | Passed; baseline/final typecheck and scope audit required |
| Canon Review | Passed; short unblock note is sufficient |

Runtime Governance, Economy and Security review were not triggered because no runtime, data-fetching, proof, economy, auth, mock or product semantics changed.

## 1. Purpose

Stage 12.x.5 removes the pre-existing PWA typecheck blockers caused by Next 15 dynamic route typing.

```text
Stage_12.x.5 = unblock_PWA_typecheck_for_Next_15_async_params
Stage_12.x.5 != product_reality_cleanup
Stage_12.x.5 != mock_quarantine
Stage_12.x.5 != legacy_route_type_vocabulary_rename
Stage_12.x.5 != projection_metadata_implementation
Stage_12.x.5 != public_launch_ready
```

## 2. Baseline Typecheck

Baseline command:

```text
pnpm -C apps/go2asia-pwa-shell typecheck
```

Baseline result: failed with 5 generated `.next/types` errors caused by 4 source files using synchronous dynamic route params.

| Source file | Error class |
|---|---|
| `apps/go2asia-pwa-shell/app/(authenticated)/quest/pro/[id]/page.tsx` | page `params` expected `Promise<{ id: string }>` |
| `apps/go2asia-pwa-shell/app/(public)/space/community/groups/[groupId]/page.tsx` | page `params` expected `Promise<{ groupId: string }>` |
| `apps/go2asia-pwa-shell/app/(public)/space/profiles/[userId]/page.tsx` | page `params` expected `Promise<{ userId: string }>` |
| `apps/go2asia-pwa-shell/app/api/rielt-seed/listings/[id]/route.ts` | route handler context `params` expected `Promise<{ id: string }>` |

All baseline blockers were confirmed as Next 15 async route/page params typing issues.

## 3. Fix Pattern

Applied only the standard Next 15 pattern:

```text
params: { key: string }
-> params: Promise<{ key: string }>
-> const { key } = await params
```

For route handlers:

```text
context: { params: { id: string } }
-> context: { params: Promise<{ id: string }> }
-> const { id } = await context.params
```

## 4. Files Changed

| File | Change |
|---|---|
| `apps/go2asia-pwa-shell/app/(authenticated)/quest/pro/[id]/page.tsx` | default page made `async`; awaited `params` before passing `id` to client component |
| `apps/go2asia-pwa-shell/app/(public)/space/community/groups/[groupId]/page.tsx` | default page made `async`; awaited `params` before passing `groupId` to client component |
| `apps/go2asia-pwa-shell/app/(public)/space/profiles/[userId]/page.tsx` | default page made `async`; awaited `params` before passing `userId` to client component |
| `apps/go2asia-pwa-shell/app/api/rielt-seed/listings/[id]/route.ts` | route handler context params made Promise-like; awaited before seed lookup |

No route URLs, metadata copy, API response shape, SDK usage, mock data, product copy or runtime behavior were changed.

## 5. Validation

Final typecheck command:

```text
pnpm -C apps/go2asia-pwa-shell typecheck
```

Final result:

```text
passed
```

IDE lint diagnostics for the touched files:

```text
passed
```

## 6. Explicit Non-Goals

Stage 12.x.5 did not:

- change product copy;
- rename routes, folders, types or components;
- implement route vocabulary cleanup from Stage 12.x.2;
- implement mock quarantine from Stage 12.x.3;
- implement projection metadata from Stage 12.x.4;
- change runtime services;
- change API/OpenAPI/SDK/schema;
- change feature flags;
- change economy, Points, RF, Quest, Rielt or Space semantics;
- activate Path B;
- make public launch or production readiness claims.

## 7. Final Verdict

```text
stage_12_x_5_status: COMPLETE_AS_BOUNDED_TYPECHECK_UNBLOCK
task_type: next15_async_params_signature_alignment
risk_level: MEDIUM
baseline_blocker_inventory_closed: true
blocker_files_remaining: 0
pnpm_pwa_shell_typecheck: pass
runtime_behavior_change: false
route_url_change: false
api_openapi_changes: false
sdk_regeneration: false
schema_migration_changes: false
mock_quarantine_changes: false
projection_metadata_changes: false
vocabulary_rename_changes: false
Path_B_activation: false
economy_expansion: false
public_launch_claims: false
production_ready_claims: false
canon_status: aligned
```

After Stage 12.x.5, future Stage 12.x.2 / 12.x.3 / 12.x.4 implementation slices can treat `pnpm -C apps/go2asia-pwa-shell typecheck` as a required regression gate.
