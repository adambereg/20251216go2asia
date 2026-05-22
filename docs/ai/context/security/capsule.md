# Capsule: Security And Proof Boundaries

Status: `active_initial`  
Primary domain: fraud, proof rejection, abuse boundaries and support-proof doctrine  
Upstream SSOT: Security role, Stage 11.9 closure review, Stage 12 UI alignment

## Purpose

Use this capsule to prevent insecure proof claims, mock-as-proof drift, stale projection abuse and economy/security overreach in Cursor prompts.

## Fraud Boundaries

- Rewards, vouchers, referrals, Points and spendability require abuse review when changed.
- Replay, race, double-claim, double-redeem and double-spend risks are security/fraud concerns.
- Producer rejection is a blocked-attempt diagnostic, not a fraud verdict or support-case closure.

## Proof Rules

Only owner facts can terminate proof. The following cannot terminate proof:

- projection;
- dashboard;
- diagnostic snapshot;
- feature flag;
- smoke summary without owner row;
- mock/demo data;
- screenshot/share card;
- Quest outbox alone;
- public UI copy.

## Projection Abuse

- Stale projection must not authorize entitlement or support outcome.
- Diagnostic snapshot may help locate owner facts but cannot close proof.
- Dashboard values require owner re-resolve before proof or support use.

## Mock-As-Proof Risks

- Mock and demo corpora are not evidence.
- `NEXT_PUBLIC_DATA_SOURCE=mock` and local demo states must be excluded from smoke proof.
- Public-facing examples must not imply real reward, booking, payout, ownership or readiness.

## Replay / Double-Claim Concepts

- Duplicate same-payload economic writes should be no-op or already-processed, not new grants.
- Duplicate mismatched payloads should be conflicts, not silent extra awards.
- Replay behavior cannot be marketed as proof of public readiness.

## Support-Proof Doctrine

Support-safe proof must resolve to owner facts. It must not rely on screenshots, UI summaries, diagnostics or smoke language alone.

## Required Reads

- `docs/ai/context/core/capsule.md`
- `docs/ai/roles/security.md`
- `docs/architecture/domain/stage_11_9_closure_review_v1.md`
- `docs/architecture/domain/stage_12_ui_copy_mock_product_reality_alignment_v1.md`
- `docs/ai/context/economy/capsule.md` when rewards/spendability are involved
- `docs/ai/context/staging/capsule.md` when smoke/evidence is involved

## Explicitly Excluded

- New auth implementation.
- New fraud runtime.
- New support tool runtime.
- Settlement, payout, token or NFT implementation.
- Public launch or support-readiness approval.

## Stop Conditions

Stop if a prompt tries to accept mock/demo/screenshot/projection as proof or asks security to approve a runtime claim without owner evidence.
