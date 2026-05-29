# Stage 13B.2-BR - Repost Commentary Runtime Activation Fix

## Scope

Stage 13B.2-BR closes the P0 runtime activation gap identified in `stage_13B_2_B_runtime_reality_verification_v1.md`.

This is a bounded runtime wiring fix only:

- no new social capability;
- no feature expansion;
- no Track B work;
- no UI expansion.

## Root Cause

Stage 13B.2-B already had:

- backend PATCH handler in `space-service`;
- frontend PATCH call from `SpaceFeedCard`.

But runtime path was not closed end-to-end because PATCH route wiring was incomplete:

1. `api-gateway` did not classify `PATCH /v1/space/posts/{postId}` as explicit Space route.
2. `api-gateway` protected Space route map did not include this PATCH route.
3. `space-service` protected route map did not include this PATCH route.

Result: gateway principal propagation (`X-Gateway-Auth`) was not guaranteed for PATCH flow, and runtime could fail even though handler existed.

## Files Changed

- `apps/api-gateway/src/index.ts`
  - added route classification for `PATCH /v1/space/posts/{postId}`
  - activated PATCH in `isProtectedSpaceRoute`
- `apps/api-gateway/test/request.test.ts`
  - added classify assertion for PATCH route
  - added 401 test for protected PATCH route without bearer
  - added authenticated proxy test for protected PATCH route with gateway claims propagation
- `apps/space-service/src/index.ts`
  - activated PATCH in `isProtectedRoute`
- `apps/space-service/test/request.test.ts`
  - added 401 test for protected PATCH route without `X-Gateway-Auth`
- `docs/reports/stage_13B_2_BR_repost_commentary_runtime_activation_fix_v1.md`

## Runtime Path Verification

Closed path for repost commentary save:

`PWA (SpaceFeedCard PATCH)`  
`-> api-gateway (classify + protected auth)`  
`-> gateway principal mint/forward (X-Gateway-Auth)`  
`-> space-service protected route`  
`-> routes/posts PATCH branch with principal`  
`-> updateRepostCommentary`

Activation checks now satisfied:

- PATCH route is explicitly classified as Space route in gateway.
- PATCH route is in gateway protected Space routes.
- PATCH route is in space-service protected routes.
- Unauthenticated PATCH now fails with 401 at both gateway and service boundaries.
- Authenticated PATCH forwards canonical gateway claims to downstream.

## Tests

Executed validation commands (required):

- `pnpm -C apps/api-gateway typecheck` ✅
- `pnpm -C apps/api-gateway test` ✅
- `pnpm -C apps/space-service typecheck` ✅
- `pnpm -C apps/space-service test` ✅
- `pnpm -C apps/go2asia-pwa-shell typecheck` ✅

Additional verification from test outputs:

- gateway tests include protected PATCH 401 and authenticated forwarding with `X-Gateway-Auth`.
- space-service tests include protected PATCH 401 without gateway auth.

## Functional Confirmation

For author-owned repost commentary edit flow:

- editor open logic remains in `SpaceFeedCard`;
- save uses existing `PATCH /v1/space/posts/{postId}`;
- PATCH now reliably passes through protected runtime chain.

No changes were made to repost object identity semantics:

- same `space_post` updated;
- no new repost created on edit;
- dedupe create policy unchanged.

## Boundary Verification

No changes introduced to:

- economy/points/reward flows;
- reactions owner-fact contracts;
- activity projection semantics;
- connect writes;
- taxonomy/postType model.

This slice is strictly route/auth activation repair.

## Review Gates

### Architecture Review

Pass - fix is minimal route/auth wiring for existing capability.

### Runtime Governance Review

Pass - production auth chain for PATCH is now explicit and protected.

### Code Review

Pass - only bounded files touched; no expansion into unrelated modules.

### QA Review

Pass - required gateway/service typecheck and tests are green; PWA typecheck is green.

### Runtime Validation Review

Pass for activation wiring (gateway + service protected PATCH path).

### Canon Review

Pass - boundaries from Stage 13B remain intact.

## Next Step

Run Stage 13B.2-BV2 runtime re-verification on staging to confirm user-visible success in deployed environment.

## Status tokens

stage_13B_2_BR_status: COMPLETE_AS_RUNTIME_ACTIVATION_FIX
stage_13B_2_BR_runtime_path_closed: TRUE
stage_13B_2_BR_gateway_patch_route: ACTIVE
stage_13B_2_BR_space_patch_protected: TRUE
stage_13B_2_BR_repost_edit_runtime: TRUE
stage_13B_2_BR_economy_integration: FALSE
stage_13B_2_BR_points_rewards: FALSE
stage_13B_2_BR_taxonomy_expansion: FALSE
stage_13B_2_BR_next_recommended_step: STAGE_13B_2_BV2_RUNTIME_REVERIFICATION
