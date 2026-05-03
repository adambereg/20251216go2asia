# Slice 1 Wallet Implementation Report

Status: implemented  
Scope: Wallet / Points buckets baseline only

## What Was Implemented

- Added ledger-based wallet bucket projection in `apps/points-service/src/index.ts`.
- Added `GET /v1/wallet/summary` in `points-service`.
- Kept `user_balances.balance` unchanged.
- Added Points actions:
  - `referral_locked`
  - `referral_unlock`
  - `network_accrual_level_1`
  - `network_accrual_level_2`
- Changed referral first-login grant to emit `referral_locked` with `5000` Points by default.
- Added gateway routing for `/v1/wallet/summary` to `POINTS_SERVICE_URL`.
- Added OpenAPI contract for `/v1/wallet/summary`.
- Regenerated OpenAPI bundle, generated types and generated SDK.
- Added focused tests for bucket projection, wallet summary response, referral locked grant and gateway proxy.

## Files Changed

Source and tests:

- `apps/points-service/src/index.ts`
- `apps/points-service/test/request.test.ts`
- `apps/referral-service/src/index.ts`
- `apps/referral-service/src/bonus.ts`
- `apps/referral-service/test/bonus_trigger_once.test.ts`
- `apps/referral-service/test/request.test.ts`
- `apps/api-gateway/src/index.ts`
- `apps/api-gateway/test/request.test.ts`

Contracts and generated artifacts:

- `docs/openapi/points.yaml`
- `docs/openapi/openapi.bundle.yaml`
- `packages/types/src/generated/index.ts`
- `packages/types/src/generated/pointsAction.ts`
- `packages/types/src/generated/walletStatus.ts`
- `packages/types/src/generated/walletSummaryResponse.ts`
- `packages/sdk/src/generated/index.ts`
- `packages/sdk/src/generated/pointsAction.ts`
- `packages/sdk/src/generated/walletStatus.ts`
- `packages/sdk/src/generated/walletSummaryResponse.ts`
- `types/go2AsiaPlatformAPI.ts`
- `sdk/go2AsiaPlatformAPI.ts`

Report:

- `docs/economy/slice1_wallet_implementation_report.md`

## What Was Not Done

- RF voucher business logic was not changed.
- Premium vouchers were not implemented.
- NFT inventory, NFT burn and NFT used flags were not implemented.
- G2A, blockchain and Blockchain Gateway were not implemented.
- VIP/PRO payments were not implemented.
- Frontend was not changed.
- Quest, token-service, RF and G2A domains were not changed.
- Referral unlock after VIP purchase was not implemented.
- Network accrual `10% / 2%` was not implemented.

## Remaining Limitations

- Wallet buckets are projections from `points_transactions`; no new storage tables or columns were added.
- `availablePoints` includes legacy positive actions and any negative spend-like transactions outside locked/network categories.
- `referral_unlock` is recognized by projection but no unlock producer exists yet.
- `network_accrual_level_1` and `network_accrual_level_2` are recognized by projection but no network accrual producer exists yet.
- `vipStatus.isActive` and `proStatus.isActive` are derived from gateway-provided roles only; there is no paid entitlement lifecycle yet.
- Existing `/v1/points/balance` and `/v1/points/connect-dashboard` remain backward-compatible and still expose the legacy balance shape.

## Readiness For Slice 2

Slice 1 creates the backend baseline required for Slice 2:

- locked referral grants now have a dedicated action and bucket;
- wallet summary can expose locked value to the product;
- future VIP activation can use `referral_unlock`;
- future network accrual can use level-specific actions without changing wallet summary shape.

Recommended next Slice 2 focus:

- add VIP purchase/activation event boundary;
- unlock `referral_locked` value through `referral_unlock`;
- add VIP-gated network accrual `10% / 2%`;
- add tests for unlock idempotency and network bucket projection.

## Verification

Commands run:

```text
pnpm openapi:bundle
pnpm gen:types
pnpm gen:sdk
pnpm -C apps/points-service test
pnpm -C apps/referral-service test
pnpm -C apps/api-gateway test
```

Result: all completed successfully.
