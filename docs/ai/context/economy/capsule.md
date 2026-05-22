# Capsule: Economy Boundaries

Status: `active_initial`  
Primary domain: Path A economy constraints and Path B deferral  
Upstream SSOT: Stage 11.9 closure review, Stage 11.2 producer allowlist, Stage 11.7 cutline, Stage 12 UI alignment

## Purpose

Use this capsule when prompts touch Points, rewards, spendability, badges, G2A, NFT, wallet semantics or economic proof. The capsule prevents economy expansion and keeps Path A bounded.

## Points Doctrine

- `points_transactions` is the economic fact.
- `user_balances` is current internal state, not a financial account.
- Points are not cash, payout, cashback or customer money.
- Unknown, future, forbidden or internal-beta-off producers must not be treated as active Path A producers.
- Outbox, dashboard, activity feed and mock rows do not terminate reward proof.

## Off-Chain Badges

- Badges are recognition facts when backed by `user_badges`.
- Badge is not NFT, token, receipt, entitlement or on-chain proof.
- Badge UI must avoid rarity/economic-value semantics unless a future Path B contract exists.

## G2A Deferred Status

- G2A belongs to deferred Path B unless explicitly reopened by owner-approved stage.
- G2A must not appear as active token product, balance, bridge, wallet, spendability or user entitlement in Path A.

## Reward Boundaries

- Contribution record is a candidate signal, not reward grant.
- Quest outbox is delivery intent only; reward proof requires Points row.
- RF voucher claim/redeem language is lifecycle-only, not payout/cashback/payment.
- Rielt inquiry is contact/inquiry fact only, not booking/payment proof.

## Spendability Boundaries

- Do not introduce spendability in docs, UI or prompts unless upstream contract explicitly provides it.
- Pending/preview/projected Points must not be described as spendable.
- Wallet-like surfaces must be framed as activity or read-only internal summary.

## Soft vs Extractive Gamification

Allowed:

- soft recognition;
- backend-confirmed activity summaries;
- off-chain badges;
- non-extractive progress wording.

Blocked in Path A:

- XP economy;
- leaderboard economy;
- social score;
- creator reward farming;
- automatic reward loops;
- public reward farming claims.

## Required Reads

- `docs/ai/context/core/capsule.md`
- `docs/architecture/domain/stage_11_9_closure_review_v1.md`
- `docs/architecture/domain/stage_12_ui_copy_mock_product_reality_alignment_v1.md`
- `docs/ai/roles/economy_architect.md`
- `docs/ai/roles/security.md` for abuse risks
- `docs/ai/roles/runtime_governance_architect.md` for lifecycle/projection risks

## Downstream Consumers

- Economy Architect.
- Security / Fraud & Abuse.
- Runtime Governance Architect.
- Frontend Developer for economy-sensitive copy.
- Technical Canon Writer.

## Explicitly Excluded

- New producers.
- New spendability.
- G2A/NFT/token/bridge implementation.
- Payout, cashback, booking or payment semantics.
- Settlement mechanics.
- Public launch readiness claims.

## Stop Conditions

Stop if a prompt turns economy copy cleanup into producer, ledger, token, wallet, payout or spendability implementation.
