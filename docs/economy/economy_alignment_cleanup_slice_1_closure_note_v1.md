# Economy Alignment Cleanup Slice 1 Closure Note v1

## Scope

This slice reduced semantic drift around current Go2Asia economy runtime without changing runtime behavior.

Included:

- economy docs classification notes;
- Connect legacy UI export quarantine;
- active Connect copy guard hardening;
- explicit deferred drift list.

Not included:

- runtime/backend/API/business logic changes;
- database migrations;
- Points ledger behavior changes;
- RF claim/redeem behavior changes;
- referral runtime changes;
- VIP entitlement runtime changes;
- G2A/NFT/Totem/on-chain implementation;
- PRO rewards or partner payouts;
- UI redesign.

## Docs Classification Notes

Classification/status notes were added to:

- `docs/economy/README.md`;
- `docs/economy/vip/vip_value_system_v1.md`;
- `docs/economy/points/points_sink_design_v1.md`;
- `docs/economy/vouchers/rf_voucher_economy_v1.md`.

The notes clarify:

- `points_policy_v1.md` is the runtime-aligned Rewards / Points policy;
- `referral_network_rewards_policy_v1.md` is the runtime-aligned referral/network rewards policy;
- G2A, NFT/Totem, on-chain mechanics, PRO rewards and partner payouts are future layers;
- VIP entitlement lifecycle is a target contract, not current runtime;
- current runtime does not yet implement `referral_unlock` or network accrual producers;
- current runtime does not yet enforce `lockedPoints` as a hard spend lock.

## Legacy UI Export Quarantine

Legacy/future-only Connect components remain in place, but were removed from barrel exports to reduce accidental reintroduction:

- `components/connect/Wallet/index.ts` no longer exports `G2ATab`, `NFTTab`, `BridgeModal`;
- `components/connect/Referrals/index.ts` no longer exports `ReferralStats`, `ReferralCard`;
- `components/connect/Missions/index.ts` no longer exports `MissionCard`;
- `components/connect/Analytics/index.ts` no longer exports `ReferralContribution`.

Future-only or deprecated comments were added to the legacy component files so their status is explicit.

## Terminology Guard

The existing active Connect copy guard in `components/connect/copy.test.ts` was extended to reject risky finance/token wording in active centralized copy:

- payout / withdraw / topup / bridge / token / NFT / G2A / commission / settlement / cash;
- Russian variants for payout, withdrawal, top-up, token, blockchain, commission, income and earnings wording.

The guard intentionally remains scoped to active centralized Connect copy helpers, not docs, generated files or future-only legacy components.

## Deferred Known Drift

Intentionally deferred:

- SDK/OpenAPI drift around `referral_bonus_referrer` vs current `referral_locked`;
- producer for `referral_unlock`;
- producers for `network_accrual_level_1` and `network_accrual_level_2`;
- hard `lockedPoints` spend enforcement;
- VIP entitlement lifecycle implementation;
- RF paid claim migration from `vip_spacer` role gate to entitlement decision;
- full cleanup/removal of legacy Connect G2A/NFT files;
- funding model for paid/premium vouchers.

## Validation Notes

Validation expected for this slice:

- targeted Connect copy test;
- lint/diagnostics on changed files;
- search check that quarantined legacy exports are not exported from active barrels;
- git status check confirming no backend/runtime/API/migration files were changed by this slice.

## Recommended Next Slice

Recommended next bounded slice:

**VIP Entitlement Schema / Decision Contract Design**

Goal: define the data/read-decision shape needed for RF shadow compare and future referral unlock, without changing RF claim behavior or Points ledger behavior.
