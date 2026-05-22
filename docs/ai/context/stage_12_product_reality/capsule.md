# Capsule: Stage 12 Product Reality

Status: `active_initial`  
Primary domain: Stage 12 UI/copy/mock findings and follow-up routing  
Upstream SSOT: `stage_12_ui_copy_mock_product_reality_alignment_v1.md`

## Purpose

Use this capsule to carry Stage 12 findings forward without reloading the full Stage 12 report into every prompt. It is a follow-up routing and boundary summary, not a replacement for the Stage 12 canon.

## Stage 12 Findings Summary

Stage 12 completed a bounded UI/copy/mock alignment pass across Home, Connect, Quest, Space, RF, Rielt, shared UI and mock/public barrel surfaces.

The accepted interpretation:

```text
Stage_12 = successful_first_alignment_pass
Stage_12 != fully_clean_UI_layer
Stage_12 != public_launch_ready
```

## Mock Inventory Categories

Use these categories for Stage 12.x mock inventory:

- remove from active/public surface;
- keep dev-only with explicit label;
- close behind feature flag or explicit route quarantine;
- keep as test fixture only;
- remove from public barrels;
- document as legacy/deferred until cleanup slice.

## Path B Surface Inventory

Known Path B or wallet-like residue includes:

- `/connect/wallet`;
- `/space/nft`;
- `/space/balance`;
- `NFTBadge`;
- `WalletData`;
- `Reward`;
- `G2A`;
- bridge/token/on-chain terminology.

These are cleanup targets, not active Path B product.

## Deferred Vocabulary

Allowed only as deferred/legacy/blocked:

- G2A;
- NFT;
- bridge;
- token wallet;
- on-chain ownership;
- financial wallet;
- payout/cashback/payment/booking;
- XP/leaderboard/social score as economy.

## UI Alignment Doctrine

- UI can explain backend-confirmed owner facts, but cannot invent proof.
- Projections must be read-only summaries or hints.
- Mock/demo surfaces must be labeled or removed from public export paths.
- Badge must remain off-chain recognition.
- RF claim/redeem must remain lifecycle language, not payout/cashback.
- Rielt must stay inquiry-only, not booking/payment.

## Bounded Product Reality Rules

- Do not create new runtime, API, schema, SDK or producer work in Stage 12.x product-reality prompts unless the slice explicitly says so.
- Do not turn vocabulary cleanup into mass refactor without a plan.
- Do not infer launch readiness from cleaner UI.
- Do not reopen Path B.

## Required Reads

- `docs/ai/context/core/capsule.md`
- `docs/ai/context/ui/capsule.md`
- `docs/architecture/domain/stage_12_ui_copy_mock_product_reality_alignment_v1.md`
- `docs/architecture/domain/stage_11_9_closure_review_v1.md`

## Downstream Consumers

- Stage 12.x.2 Legacy Route / Type Vocabulary Cleanup Plan.
- Stage 12.x.3 Mock Quarantine Inventory.
- Stage 12.x.4 Projection Metadata / Proof-Class UI Requirements.
- Stage 12.x.6 Stage 12 Closure Review.

## Explicitly Excluded

- Runtime/API/schema/OpenAPI/SDK changes.
- Path B activation.
- Economy expansion.
- New roadmap beyond Stage 12.x routing.

## Stop Conditions

Stop if a Stage 12.x prompt starts implementing Path B, renaming public contracts without plan, or treating Stage 12 as final launch readiness.
