# Economy Runtime Milestone Closure — RF Paid Spend Validation v1

## 1. Purpose / Milestone Scope

This document closes the staging validation milestone for RF paid voucher spend runtime and Points spendability durable export evidence.

Scope of this closure:

- consolidate validated staging evidence for RF paid spend flow;
- fix current runtime architecture facts as-is;
- record validated invariants, known limits, and non-goals;
- mark this milestone as closed and define the next architecture milestone.

This is a documentation/evidence slice only.

## 2. Timeline / Completed Slices

The milestone is based on already completed slices in this branch history and closure docs:

1. `Points Spendability Durable Observability Export v1` (default-off export path + safety contract).
2. `Points Spendability Staging Export Validation` (manual evidence/runbook preparation).
3. `RF Paid Voucher Discoverability & Spend Semantics Visibility Fix` (UI semantics for paid/free states).
4. `RF Paid Voucher Staging Seed Offers` (deterministic paid staging offers).
5. `RF Paid Voucher Spend Enforcement Staging Alignment` (staging config stabilization + drift fix).
6. `Staging VIP Entitlement & Points Top-up Validation Fixture` (VIP audit, deterministic top-up, successful paid claim).
7. Manual Cloudflare Observability confirmation for durable export event on successful spend.

## 3. RF Paid Spend Runtime Architecture Summary

Current staging runtime behavior:

- RF paid claim for offers with `points_cost > 0` is gated by RF paid spend runtime configuration.
- RF calls Points internal spend endpoint before final paid claim completion.
- Paid claim outcome is coupled to spend outcome:
  - spend success -> voucher may persist as paid/debited;
  - spend failure/insufficient balance -> paid claim is blocked.

Bounded domains remain separated:

- RF owns voucher lifecycle and claim semantics;
- Points owns wallet ledger and spend accounting;
- integration occurs through explicit service-to-service spend call.

## 4. Staging Config Stabilization Summary

Validated stabilization outcomes:

- staging flags are pinned and persisted;
- RF paid spend path remains enabled in staging;
- RF -> Points bridge endpoint resolution remains stable;
- previous config drift issue was removed.

Result:

- bridge is operational and reproducible in staging;
- paid claim no longer silently bypasses spend due to flag drift.

## 5. VIP Runtime Authority Status

Current authority for RF paid claim in runtime is legacy role shortcut:

- `vip_spacer`-compatible role path is authoritative for paid claim access in RF;
- canonical VIP entitlement is not yet authoritative runtime source.

Important architecture fact:

- this milestone validates current runtime behavior as implemented;
- it does not claim entitlement migration completion.

## 6. Points Spendability Shadow / Durable Export Summary

Spendability export in this milestone is validated as shadow/diagnostic export (not spend-authority change):

- event type: `points_spendability_shadow_compare`;
- contract remains diagnostic/observability-focused;
- no Points spend contract change was introduced by this closure.

Durable export event was observed in Cloudflare for the successful paid claim spend path.

## 7. Successful Validation Evidence

Consolidated staging evidence:

- deterministic paid offers exist:
  - `rf_offer_staging_paid_100_points`
  - `rf_offer_staging_paid_250_points`
  - `rf_offer_staging_paid_500_points`
- UI displays paid semantics (`Будет списано: N Points`, `Получить за N Points`);
- insufficient points case for VIP runtime user blocked paid claim (`409`) and validated precondition;
- deterministic staging-only top-up applied to `kirill.denisov.seed@example.com` (`1000` points);
- successful paid claim executed for `100 Points staging service perk`;
- RF voucher persisted with paid debit semantics (`economy_status=debited`);
- Points ledger contains spend transaction:
  - amount `-100`
  - reason `rf_voucher_claim_spend`;
- wallet balance changed `1000 -> 900`;
- Cloudflare Observability contains `Points spendability durable export` for spend flow;
- export payload includes validated fields:
  - `schemaVersion=points_spendability_durable_export_v1`
  - `diagnosticsVersion=points_spendability_shadow_diagnostics_v1`
  - `eventType=points_spendability_shadow_compare`
  - `driftClass=aligned_allowed`
  - `reasonCode=legacy_and_target_allow`
  - `action=rf_voucher_claim_spend`
  - `legacyAllows=true`
  - `targetAllows=true`.

## 8. Observed Invariants

The following invariants are now validated in staging:

1. Paid RF claim requires successful Points spend.
2. Insufficient balance blocks paid claim path.
3. Successful spend reduces wallet balance by claim cost.
4. RF voucher lifecycle and Points spend ledger remain separated bounded domains.
5. Durable export contains safe aggregate diagnostics for spendability compare.
6. Forbidden fields are not present in validated export payload.
7. Deterministic/idempotent fixture behavior is confirmed (top-up apply/replay safety).

## 9. Security / Diagnostics Verification

Role coverage used for this closure:

- architect (runtime boundaries and authority facts);
- technical writer (canonical closure consolidation);
- requirements analyst (scope/acceptance consistency);
- QA (evidence integrity and invariant coverage);
- security (safe payload/no forbidden fields/no secret leakage checks).

Observability note:

- there is no dedicated observability/reliability role under `docs/ai/roles/`;
- observability/reliability closure was handled by combined architect + security + QA review in this milestone note.

Security/diagnostic outcome:

- no JWT/Authorization token leakage in validated export payload evidence;
- no DB URLs, payment payloads, raw profile payloads, or secrets in consolidated evidence;
- diagnostics remain safe and bounded.

## 10. Known Limits

Known limits explicitly retained after this milestone:

1. VIP runtime authority is still legacy-role based (`vip_spacer` path).
2. Canonical entitlement runtime authority is not yet active.
3. Available-only spend enforcement is not enabled.
4. Shadow compare is not authoritative for allow/deny decisions.
5. Durable export evidence is currently Cloudflare-observability based.
6. Staging validation is not production rollout.

## 11. Explicit Non-Goals

This milestone closure did not include:

- runtime/business logic changes;
- new flags or flag semantics;
- new staging claims/top-ups beyond already validated fixture evidence;
- available-only enforcement;
- Points contract changes;
- wallet redesign;
- referral/network rollout changes;
- G2A/NFT/Totem or tokenomics expansion;
- PRO rewards redesign;
- production rollout;
- migrations.

## 12. Recommended Next Milestone

Recommended next architecture milestone:

`VIP Entitlement Runtime Authority`

Goal of next milestone:

- replace legacy `vip_spacer` runtime authority with canonical entitlement decision;
- keep migration safe via staged shadow-to-enforcement transition;
- prepare groundwork for future available-only spend enforcement.

## 13. Closure Statement

Milestone `Economy Runtime Milestone Closure — RF Paid Spend Validation v1` is **closed** for staging.

Closure basis:

- RF paid spend staging flow is operational end-to-end;
- blocking spend precondition is operational;
- successful paid claim and debit behavior is validated;
- spendability durable export is validated with required safe fields;
- security and diagnostics constraints are satisfied for this milestone scope.

This closure is docs-only and does not imply production rollout.

