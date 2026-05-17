# Go2Asia Platform Canon v2

This directory contains the current platform-level SSOT (single source of truth) documents for Go2Asia v2.

## Current Platform Canon (v2)

- `go2asia_ecosystem_overview_v2.md`  
  Product-level ecosystem map: modules, roles, layers, and roadmap.
- `go2asia_backend_services_architecture_v2.md`  
  Backend services architecture: ownership boundaries, runtime reality, and future target.
- `go2asia_interface_architecture_v2.md`  
  Interface architecture: public modules, cabinets, consoles, Connect UI, Missions UI, and no classic chat model.
- `go2asia_attribution_architecture_map_v1.md`
  Platform attribution map: factual attribution surfaces, bounded contexts, economy-facing read boundaries, and future AI/creator/campaign attribution directions.

These documents are the active Go2Asia platform canon set and must be treated as the primary platform-level source of truth.

## Historical Baseline Policy

Earlier conceptual documents remain a historical baseline and can be used for context only.  
If any earlier document conflicts with the v2 canon, the v2 canon takes precedence.

## How to use these docs for implementation

1. Start with `go2asia_ecosystem_overview_v2.md` to understand product-level ecosystem boundaries and platform principles.
2. Then read `go2asia_backend_services_architecture_v2.md` for backend tasks, service ownership, runtime truth, and target architecture.
3. Then read `go2asia_interface_architecture_v2.md` for frontend/UI tasks, interface boundaries, and interaction model.
4. Ensure module-level SSOT documents stay aligned with this platform-level canon.

## Economy Terminology Alignment

Platform Canon v2 is the platform-level source of truth, but economy runtime authority remains with the Tier 1 economy policy documents:

- `docs/economy/points_policy_v1.md`
- `docs/economy/referral_network_rewards_policy_v1.md`

When these platform documents mention Points, rewards, ledger, wallet, referral/network value, RF/vouchers, G2A, NFT, token, payout-like, settlement-like, or future externalization language, read them through `docs/economy/economy_authority_terminology_crosswalk_v1.md`.

Platform architecture wording does not activate runtime economy behavior, ledger writes, reward producers, spend enforcement, payout/settlement, wallet/token/G2A/NFT/on-chain features, auth/RBAC redesign, VIP entitlement authority, or Slice 16 movement.

## Canon Guardrails (v2 reminders)

- In Quest, use the term **Task** (not Quest Mission).
- Connect is a UI/product hub and is **not** a backend service owner.
- Rielt v1 is voucher-first CTA, not booking/chat/inquiry-first.
- Missions are an ecosystem orchestration layer, not part of Quest.
- RF is a partner layer.
- UI does not own domain truth; backend services own truth.
