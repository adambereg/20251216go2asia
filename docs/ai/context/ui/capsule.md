# Capsule: UI Product Reality

Status: `active_initial`  
Primary domain: user-facing UI, copy, mock/demo data and product-reality alignment  
Upstream SSOT: Stage 12 UI/copy/mock alignment; Stage 11.9 closure boundaries

## Purpose

Use this capsule to keep Go2Asia UI and copy aligned with runtime reality. It prevents dashboards, mock data, wallet-like surfaces, badges and deferred Path B terms from becoming proof, receipt or active product claims.

## Proof-Class Rules

| Class | UI treatment | Proof? |
|---|---|---|
| owner fact | May be referenced as backend-confirmed fact when routed to owner source | Yes, if owner source is present |
| projection | Read-only summary, preview, dashboard or diagnostic hint | No |
| mock/demo | Internal demo, reference-only, test fixture or placeholder | No |

Required UI formula:

```text
projection_or_diagnostic_can_help_find_owner_fact = true
projection_or_diagnostic_can_terminate_proof = false
```

## Dashboard / Projection Semantics

- Dashboard is not a receipt.
- Wallet-like UI is not a financial wallet.
- Activity feed is not an audit trail.
- Profile and Connect summaries are projections unless they point to owner facts.
- Projection freshness, `asOf`, source and proof class must not be hallucinated if API/runtime does not provide them.

## Mock Quarantine

- Mock data is allowed only as internal demo/reference material.
- Mock data must not be fallback proof, support proof, launch proof or customer-facing evidence.
- Public barrels should not export mock corpora unless explicitly dev-only.
- Screenshots and share cards are not proof.

## UI Terminology

Preferred:

- `Активность`
- `История Points`
- `Внутренние Points`
- `read-only сводка`
- `backend-подтверждение`
- `off-chain бейдж`
- `reference-only`
- `deferred`
- `internal demo`
- `не является proof/receipt`

## Forbidden Vocabulary in Active Path A UI

- financial wallet, top-up, withdraw, bridge, transfer;
- payout, cashback, payment, booking;
- NFT ownership, on-chain badge, token entitlement;
- automatic reward grant, reward receipt, earn-as-guarantee;
- launch-ready, production-ready, public MVP-ready;
- leaderboard/XP/social score as active economy.

## Path B UI Quarantine

Terms such as `G2A`, `NFT`, `bridge`, `token wallet` and on-chain ownership may appear only as deferred, blocked, legacy or future-only notes. They must not be active CTA, active metric, ownership proof or route promise in Path A.

## Required Reads

- `docs/ai/context/core/capsule.md`
- `docs/architecture/domain/stage_12_ui_copy_mock_product_reality_alignment_v1.md`
- `docs/ai/roles/frontend_dev.md`
- `docs/ai/roles/qa.md`
- `docs/ai/roles/runtime_governance_architect.md` when projection semantics are touched
- `docs/ai/roles/security.md` when proof/mock abuse is touched

## Review Gates

- Product Reality Review.
- Frontend Review.
- QA Review.
- Runtime Governance Review for projection/proof wording.
- Security Review for proof/mock abuse.
- Canon Review for docs updates.

## Explicitly Excluded

- Runtime behavior changes.
- API/schema/OpenAPI/SDK updates.
- Path B activation.
- New Points producers, reward rules, booking/payment or payout semantics.

## Stop Conditions

Stop if UI cleanup requires changing backend contracts or if wording would imply proof metadata that the runtime/API does not expose.
