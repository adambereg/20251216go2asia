# Security Context Capsule

Status: `active_initial`  
Primary use: proof safety, fraud boundaries, replay and mock-as-proof risk

## Files

- `capsule.md` — security and fraud guardrails for AI prompts.

## Attach When

- A task mentions proof, receipt, support proof, mock-as-proof, screenshot evidence, fraud, abuse, replay, double-claim, double-redeem, idempotency, auth or secrets.
- Economy work touches rewards, spendability, RF vouchers, referrals, settlements or Path B vocabulary.
- UI work could imply customer proof or support-ready receipts.

## Do Not Attach When

- A pure copy/style task has no proof, auth, abuse or economy implication.
- Staging validation is purely operational and already scoped by `staging/` with no abuse risk.

## Upstream SSOT

- `docs/ai/roles/security.md`
- `docs/architecture/domain/stage_11_9_closure_review_v1.md`
- `docs/architecture/domain/stage_12_ui_copy_mock_product_reality_alignment_v1.md`
- `docs/ai/context/core/capsule.md`

## Review Gates

- Security Review.
- Fraud & Abuse Review.
- Economy Review when rewards/spendability are involved.
- Runtime Governance Review when replay/projection/lifecycle are involved.
- Canon Review.
