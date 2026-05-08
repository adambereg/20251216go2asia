# RF Slice 4.3 — Claim Spend Coupling Implementation Note (v1)

## Scope delivered

- Implemented synchronous paid-claim coupling between RF claim runtime and points spend contract.
- Added claim-time VIP gate for paid vouchers (`points_cost_snapshot > 0`).
- Added deterministic spend/compensation external id conventions:
  - `rf:voucher-claim-spend:<voucherId>`
  - `rf:voucher-claim-spend-compensation:<voucherId>`
- Added immediate compensation choreography when spend succeeds but RF claim finalization fails.
- Added recovery marker persistence and internal diagnostics exposure for unresolved compensation.

## Runtime behavior

### Free vouchers

- `points_cost_snapshot = 0` preserves existing flow.
- No spend call.
- `economy_status = not_required`.

### Paid vouchers (feature-flagged)

- Feature flag: `RF_ENABLE_PAID_VOUCHER_SPEND`.
- VIP gate (`vip_spacer`) is enforced before any spend call.
- Spend is executed synchronously before voucher persistence.
- On successful spend, voucher is persisted with:
  - `economy_status = debited`
  - `points_debit_external_id = rf:voucher-claim-spend:<voucherId>`

## Failure handling

- Points `INSUFFICIENT_POINTS_BALANCE` -> RF `RF_INSUFFICIENT_POINTS_BALANCE` (409).
- Points `REPLAY_PAYLOAD_MISMATCH` -> RF `RF_SPEND_IDEMPOTENCY_CONFLICT` (409).
- Temporary or infrastructure failures -> RF `RF_SPEND_TEMPORARILY_UNAVAILABLE` (503).
- If spend succeeded but voucher insert/idempotency finalization fails:
  - Immediate compensation is attempted (`rf_voucher_claim_spend_compensation`).
  - If compensation fails, RF returns `RF_ECONOMY_RECOVERY_PENDING` (503) and stores recovery marker.

## Diagnostics expansion

- Internal diagnostics now include:
  - `pointsCompensationExternalId`
  - `economyTransitionTimestamps`
  - `economyRecovery` block
- Added anomalies:
  - `spend_succeeded_claim_failed`
  - `compensation_pending_too_long`
  - `debit_failed_visible_voucher`

## Persistence additions

- Added `rf_voucher_economy_recovery` table for recovery markers.
- Added migration `0056_rf_claim_spend_recovery_v1.sql`.

## Out of scope (kept unchanged)

- No premium/NFT/G2A.
- No payouts/billing/Connect expansion.
- No public spend endpoint.
- No asynchronous outbox platform.
- No frontend redesign (only additive error mapping support).
