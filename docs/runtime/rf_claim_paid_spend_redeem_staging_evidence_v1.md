# RF Claim / Paid Spend / Redeem Staging Evidence v1

Date: 2026-05-18
Status: `PARTIAL_EVIDENCE_BLOCKED_PENDING_STAGING_APPROVAL`
Stage: `Stage 7.2 / RF Claim / Paid Spend / Redeem Staging Evidence Execution`
Mode: controlled evidence-only execution report, docs-only capture, no implementation, no source code changes, no tests added, no API changes, no schema changes, no migrations, no config changes, no feature flag changes, no deployment changes, no runtime activation, no token/G2A/NFT/on-chain activation, no wallet activation, no payout/settlement/cashback activation, no Slice 16 movement

Related evidence specification:

- `docs/runtime/rf_runtime_readiness_evidence_pack_v1.md`

## 1. Purpose

This report records the Stage 7.2 evidence execution attempt for existing RF runtime-backed surfaces:

- RF partner claim;
- RF listing-scoped claim;
- RF paid claim spend;
- RF spend compensation and recovery;
- RF redeem;
- RF to Points reconciliation;
- gateway/service trust;
- diagnostics and observability;
- rollback posture;
- Quest localStorage blocker disposition.

This report does not claim production readiness, rollout readiness, feature activation, runtime expansion or Slice 16 movement.

## 2. Scope

In scope for this execution:

- pre-flight repository state capture;
- verification that the Stage 7.1 evidence specification exists;
- execution of existing RF and Points tests only;
- classification of evidence collected by existing tests;
- identification of staging evidence not collected because it requires live staging/API/DB/log/config access or explicit approval;
- creation of a docs-only evidence report.

Out of scope:

- new tests;
- source code changes;
- staging config changes;
- feature flag changes;
- migrations;
- deployment;
- live DB mutation;
- production or staging runtime activation;
- unsafe direct calls to protected services;
- using Quest localStorage completion as runtime proof.

## 3. Non-Goals

This report is not:

- a feature implementation report;
- a test implementation report;
- a staging rollout report;
- a production readiness report;
- a Points economy redesign;
- a hard spend enforcement approval;
- a token/NFT/wallet/payout activation artifact;
- a Slice 16 readiness artifact.

## 4. Pre-flight State

Repository pre-flight:

| Item | Value |
|---|---|
| Branch | `docs/stage-6-5-semantic-safety` |
| Latest commit | `c6ad127fdaac02aee4575bfde9f9d3bc7b5ac765` |
| Git status before Stage 7.2 execution | Dirty: `?? docs/runtime/` |
| Stage 7.1 artifact | Present: `docs/runtime/rf_runtime_readiness_evidence_pack_v1.md` |
| Stage 7.1 artifact branch note | The artifact exists in the current `docs/stage-6-5-semantic-safety` working tree, not on a dedicated Stage 7 branch. |

Pre-flight verdict:

```text
preflight_status: proceed_with_caution
reason: Stage 7.1 artifact exists, but working tree was not clean because docs/runtime/ was already untracked.
```

No STOP condition was triggered because the required Stage 7.1 artifact exists.

## 5. Evidence Environment

Evidence collected in this slice is local existing-test evidence, not live staging runtime evidence.

| Evidence class | Collected | Notes |
|---|---:|---|
| `LOCAL_TEST_OR_UNIT` | Yes | Existing RF and Points Vitest suites were executed. |
| `CI_AUTOMATED` | No | No CI pipeline was invoked. |
| `STAGING_RUNTIME_COLLECTED` | No | No staging API, DB, diagnostics, logs or feature flag snapshots were collected. |
| `STAGING_NOT_EXECUTED` | Yes | Live staging evidence remains pending approval/access. |
| `FORMALLY_EXCLUDED_FROM_THIS_SLICE` | Partial | Quest localStorage blocker is excluded from RF evidence claims and remains unresolved for Quest reward runtime. |

Commands executed:

```powershell
pnpm -C "apps/rf-service" exec vitest run test/request.test.ts
pnpm -C "apps/points-service" exec vitest run test/request.test.ts test/idempotency_external_id.test.ts test/spendability-shadow.test.ts
```

Results:

| Command | Result |
|---|---|
| RF request suite | Passed: 1 test file, 91 tests. Coverage summary: statements 77.94%, branches 68.73%, functions 74.28%, lines 77.94%. |
| Points request/idempotency/spendability suites | Passed: 3 test files, 55 tests. Coverage summary: statements 83.85%, branches 74.76%, functions 88.4%, lines 83.85%. |

## 6. RF Claim Evidence

Evidence class: `LOCAL_TEST_OR_UNIT`

Existing RF request tests provide supporting evidence for:

- partner claim success and idempotent replay;
- missing, inactive and non-public offer rejection;
- same user/offer with different idempotency key returning deterministic voucher behavior;
- partner claim replay context mismatch;
- legacy claim replay row handling;
- immutable attribution on idempotent replay;
- existing active voucher style behavior through repeat policy and claim barrier paths.

Collected evidence:

| Requirement | Status | Evidence |
|---|---|---|
| Free partner claim success | Covered by existing RF tests | `apps/rf-service/test/request.test.ts` passed. |
| Same `Idempotency-Key` replay | Covered by existing RF tests | Replay returns same voucher in request suite. |
| Same key / different context mismatch | Covered by existing RF tests | Partner claim idempotency context mismatch covered. |
| Existing active voucher barrier | Partially covered by existing RF tests | Deterministic repeat/barrier behavior covered at mock level. |
| Repeat policy behavior | Covered by existing RF tests | `once_per_scope` and `repeat_after_redeem` scenarios covered at mock level. |
| Unauthenticated negative case | Covered by existing RF tests | Claim/redeem protected routes reject missing auth in request suite. |

Limitations:

- no real API request/response artifacts from staging were collected;
- no real `rf_voucher` or `rf_claim_idempotency` DB snapshots were collected;
- no live gateway traces were collected;
- no real concurrent claim evidence was collected.

## 7. RF Listing Claim Evidence

Evidence class: `LOCAL_TEST_OR_UNIT`

Existing RF request tests provide supporting evidence for:

- listing-scoped claim success;
- listing claim idempotent replay;
- listing claim context mismatch;
- different listing behavior for the same offer;
- partner-scope vs listing-scope separation;
- read-only RF offers mapped to a Rielt listing.

Collected evidence:

| Requirement | Status | Evidence |
|---|---|---|
| Listing-scoped claim success | Covered by existing RF tests | RF request suite passed. |
| Listing mapping mismatch / invalid listing | Partially covered | Listing context mismatch/mapping behavior covered at mock level. |
| Listing claim replay | Covered by existing RF tests | Listing claim idempotency replay covered. |
| Partner-scope vs listing-scope separation | Covered by existing RF tests | Scope separation scenarios covered. |

Limitations:

- no staging listing API captures were collected;
- no live Rielt/RF mapping DB snapshots were collected;
- no listing-to-voucher reconciliation artifact was collected.

## 8. RF Paid Spend Evidence

Evidence class: `LOCAL_TEST_OR_UNIT`

Existing RF and Points tests provide supporting evidence for:

- paid claim role/VIP guard behavior;
- spend-first coupling when `RF_ENABLE_PAID_VOUCHER_SPEND` is enabled in test env;
- deterministic spend external id shape;
- insufficient Points mapping;
- Points replay payload mismatch mapping;
- temporary Points failure mapping;
- misconfigured Points service handling;
- flag-off behavior preserving pre-coupling paid claim behavior;
- paid claim replay avoiding a second debit at mock level;
- distinct paid spend external ids for `repeat_after_redeem` instances;
- Points internal spend idempotency, insufficient balance and replay mismatch behavior.

Collected evidence:

| Requirement | Status | Evidence |
|---|---|---|
| Flag-on status | Covered only inside test env | No staging flag snapshot collected. |
| Paid claim success | Covered by existing RF tests | RF request suite passed. |
| Points spend request/response evidence | Covered by mocked fetch in RF tests and Points handler tests | No real RF-to-Points network artifact collected. |
| Deterministic external id | Covered by existing tests | `rf:voucher-claim-spend:<voucherId>` asserted at test level. |
| Insufficient balance | Covered by RF and Points tests | Existing tests passed. |
| Replay idempotency | Covered by RF and Points tests | Existing tests passed. |
| Replay payload mismatch | Covered by RF and Points tests | Points reports deterministic mismatch in tests. |
| Points service unavailable/misconfigured | Covered at mock level | RF tests map temporary/misconfigured paths. |

Limitations:

- no live staging `RF_ENABLE_PAID_VOUCHER_SPEND` flag state was read;
- no real Points transaction id was collected;
- no live `points_transactions` or `user_balances` snapshot was collected;
- no live RF-to-Points service JWT trace was collected;
- no staging external id replay was executed.

## 9. RF Compensation / Recovery Evidence

Evidence class: `LOCAL_TEST_OR_UNIT`

Existing RF tests provide supporting evidence for:

- recovery marker persistence when spend succeeds but compensation fails;
- recovery marker resolution when compensation succeeds;
- deterministic retry behavior for recovery paths;
- diagnostics anomalies for recovery-backed spend success / claim failure.

Collected evidence:

| Requirement | Status | Evidence |
|---|---|---|
| Happy path no recovery | Partially covered by paid claim tests | No live diagnostics/DB snapshot collected. |
| Controlled failure path | Covered at mock level | RF recovery tests passed. |
| Recovery marker evidence | Covered at mock level | No live `rf_voucher_economy_recovery` snapshot collected. |
| Compensation external id | Covered at RF mock level | No Points-side staging transaction collected. |

Known gap:

- Points Service code and OpenAPI allow `rf_voucher_claim_spend_compensation`, but the specified Points tests do not include a dedicated add test using that exact action. This remains a coverage gap unless closed by future staging evidence or future test work with approval.

If controlled failure requires staging config changes, it must remain `BLOCKED_PENDING_APPROVAL`.

## 10. RF Redeem Evidence

Evidence class: `LOCAL_TEST_OR_UNIT`

Existing RF request tests provide supporting evidence for:

- merchant redeem success;
- second redeem returning duplicate/idempotent terminal state;
- wrong partner / non-owner protection;
- invalid statuses such as cancelled, expired and locked;
- redeem idempotency context mismatch;
- internal diagnostics around redemption and consumption guards.

Collected evidence:

| Requirement | Status | Evidence |
|---|---|---|
| Merchant redeem success | Covered by existing RF tests | RF request suite passed. |
| Replay / duplicate redeem | Covered by existing RF tests | Duplicate/terminal replay paths covered. |
| Wrong partner / wrong actor | Covered by existing RF tests | Ownership checks covered at mock level. |
| Invalid status | Covered by existing RF tests | Cancelled/expired/locked status paths covered. |
| Concurrent redeem | Not collected | Requires staging or dedicated concurrency harness. |

Limitations:

- no real `rf_voucher_redemption` DB row snapshot was collected;
- no live partner-owner gateway request capture was collected;
- no real concurrency evidence was collected.

## 11. RF to Points Reconciliation Evidence

Evidence class: `LOCAL_TEST_OR_UNIT` for logic; `STAGING_NOT_EXECUTED` for reconciliation.

Supporting local evidence:

- RF tests assert spend external id shape and mock Points behavior;
- Points tests verify internal spend, idempotent replay, replay mismatch, insufficient balance and negative spend transaction semantics;
- Points tests verify spendability shadow behavior and the current caveat that legacy balance can allow spend while target available-only shadow would deny.

Reconciliation not collected:

| Required reconciliation item | Status |
|---|---|
| `rf_voucher.points_debit_external_id` to `points_transactions.external_id` join | Not collected |
| Points transaction id | Not collected |
| User balance before/after | Not collected |
| One debit per real voucher in staging DB | Not collected |
| Compensation mapping in real Points ledger | Not collected |
| Proof of no direct RF ledger mutation in live environment | Not collected |

Assessment:

```text
rf_points_reconciliation_status: BLOCKED_PENDING_STAGING_DB_API_EVIDENCE
```

## 12. Gateway / Service Trust Evidence

Evidence class: `LOCAL_TEST_OR_UNIT`

Supporting local evidence:

- RF tests reject missing auth on claim/redeem;
- RF tests reject unauthenticated or non-admin internal diagnostics;
- Points tests reject missing gateway auth on user routes;
- Points tests reject invalid gateway token claims;
- Points tests reject unauthenticated internal spend;
- Points tests cover service auth misconfiguration responses.

Not collected:

- live gateway route evidence;
- live invalid/expired/wrong issuer/wrong audience service JWT evidence across deployed services;
- live proof that frontend cannot access internal diagnostics;
- live log redaction evidence across gateway, RF and Points.

Assessment:

```text
gateway_service_trust_status: PARTIAL_LOCAL_TEST_EVIDENCE_ONLY
staging_trust_status: BLOCKED_PENDING_APPROVAL
```

## 13. Diagnostics / Observability Evidence

Evidence class: `LOCAL_TEST_OR_UNIT`

Supporting local evidence:

- RF internal voucher diagnostics tests cover 401/403/404 and success diagnostics;
- diagnostics tests cover masking, rejected attribution anomaly, listing anomaly, scope guard anomaly, recovery anomaly and failed debit anomaly;
- RF and Points tests emit request ids in logs during local test execution.

Not collected:

- live RF diagnostics output for claim, paid claim and redeem;
- live diagnostics output matched to DB snapshots;
- gateway/RF/Points correlated logs;
- production-like log redaction artifact;
- recovery diagnostics from real staging failure path.

Assessment:

```text
diagnostics_observability_status: PARTIAL_LOCAL_TEST_EVIDENCE_ONLY
staging_observability_status: BLOCKED_PENDING_STAGING_LOGS_DIAGNOSTICS
```

## 14. Rollback Evidence

Evidence class: `LOCAL_TEST_OR_UNIT`

Supporting local evidence:

- RF tests cover flag-off behavior for `RF_ENABLE_PAID_VOUCHER_SPEND=false` and preserve pre-coupling paid behavior without calling Points spend.

Not collected:

- staging flag-off config snapshot;
- live proof that disabling `RF_ENABLE_PAID_VOUCHER_SPEND` prevents Points spend;
- rollback runbook execution artifact;
- live evidence that free/public RF reads remain unaffected after flag-off.

Assessment:

```text
rollback_evidence_status: PARTIAL_LOCAL_TEST_EVIDENCE_ONLY
staging_rollback_status: REQUIRED_APPROVAL
```

No feature flags were changed in this slice.

## 15. Quest LocalStorage Blocker Disposition

Quest localStorage completion remains non-authoritative and was not used as runtime proof.

Disposition for this Stage 7.2 RF-focused evidence execution:

```text
quest_localStorage_blocker_status: unresolved_for_quest_reward_runtime
stage_7_2_rf_evidence_claim: formally_excludes_quest_reward_runtime_claims
quest_localStorage_used_as_evidence: false
```

The blocker remains active for any future Quest reward runtime claim until resolved, quarantined or separately excluded by governance.

## 16. Evidence Gaps / Blocked Items

| Gap ID | Area | Status | Required approval or next evidence |
|---|---|---|---|
| `S7.2-GAP-001` | Staging API captures | `BLOCKED_PENDING_APPROVAL` | Need approved staging target and safe request plan. |
| `S7.2-GAP-002` | RF DB snapshots | `BLOCKED_PENDING_APPROVAL` | Need read-only staging DB access and redaction rules. |
| `S7.2-GAP-003` | Points ledger snapshots | `BLOCKED_PENDING_APPROVAL` | Need read-only Points DB access and reconciliation query plan. |
| `S7.2-GAP-004` | Gateway/RF/Points logs | `BLOCKED_PENDING_APPROVAL` | Need sanitized log access. |
| `S7.2-GAP-005` | Live feature flag state | `BLOCKED_PENDING_APPROVAL` | Need read-only staging config snapshot; no flag changes. |
| `S7.2-GAP-006` | Paid spend rollback evidence | `REQUIRED_APPROVAL` | Need approved flag-off validation window; no changes done here. |
| `S7.2-GAP-007` | Claim/redeem concurrency | `BLOCKED_PENDING_APPROVAL` | Need approved concurrency harness or staging-safe method. |
| `S7.2-GAP-008` | Points compensation action evidence | `OPEN_EVIDENCE_GAP` | Need future staging evidence or approved test addition for `rf_voucher_claim_spend_compensation`. |
| `S7.2-GAP-009` | Connect stale/error projection screenshots | `BLOCKED_PENDING_APPROVAL` | Need approved frontend/staging observation or dedicated projection review. |
| `S7.2-GAP-010` | Quest localStorage blocker resolution | `UNRESOLVED_FOR_QUEST` | Excluded from this RF evidence claim; remains blocker for Quest reward runtime. |

## 17. Pass / Block Assessment

Overall Stage 7.2 assessment:

```text
assessment: PARTIAL_EVIDENCE
stage_7_2_full_pass: false
reason: Existing tests passed and provide useful local/component evidence, but mandatory staging API/DB/log/config/reconciliation artifacts were not collected.
```

Pass/block mapping:

| Requirement from Stage 7.1 spec | Status |
|---|---|
| RF claim idempotency evidence exists | `PARTIAL_LOCAL_TEST_EVIDENCE` |
| RF claim replay/context mismatch/race evidence exists | `PARTIAL_LOCAL_TEST_EVIDENCE`; race not collected |
| Paid spend debit/retry/compensation evidence exists | `PARTIAL_LOCAL_TEST_EVIDENCE`; live debit/compensation not collected |
| Paid spend reconciliation exists | `BLOCKED_PENDING_STAGING_DB_API_EVIDENCE` |
| Redeem idempotency/concurrency evidence exists | `PARTIAL_LOCAL_TEST_EVIDENCE`; concurrency not collected |
| Wrong actor/wrong partner negative evidence exists | `PARTIAL_LOCAL_TEST_EVIDENCE` |
| Connect projection boundaries are validated | `NOT_COLLECTED_IN_THIS_SLICE` |
| Quest blocker resolved or formally excluded | `FORMALLY_EXCLUDED_FOR_RF_SCOPE`; unresolved for Quest |
| Gateway/service trust evidence exists | `PARTIAL_LOCAL_TEST_EVIDENCE`; staging trust not collected |
| Observability/diagnostics evidence complete | `PARTIAL_LOCAL_TEST_EVIDENCE`; live diagnostics/logs not collected |
| Rollback evidence exists | `PARTIAL_LOCAL_TEST_EVIDENCE`; staging rollback requires approval |
| No token/NFT/wallet/payout activation | `PASS` |
| No Slice 16 movement | `PASS` |

## 18. Forbidden Areas Preservation

Preserved:

- no implementation;
- no code changes;
- no tests added;
- no API/OpenAPI changes;
- no SDK changes;
- no schema changes;
- no migrations;
- no config changes;
- no feature flag changes;
- no deployment changes;
- no runtime activation;
- no spend enforcement activation;
- no available-only enforcement activation;
- no reward producer activation;
- no `referral_unlock` activation;
- no network accrual activation;
- no VIP entitlement authority activation;
- no token/G2A activation;
- no NFT/on-chain activation;
- no wallet activation;
- no payout/settlement/cashback activation;
- no Slice 16 movement.

Slice 16 status:

```text
slice_16_status: blocked_not_triggered
```

## 19. Review Gate Results

| Review gate | Result | Notes |
|---|---|---|
| Runtime Governance Review | `PARTIAL_PASS_WITH_BLOCKERS` | Existing tests support lifecycle/idempotency logic, but staging runtime evidence is not collected. |
| RF Domain Review | `PARTIAL_PASS_WITH_BLOCKERS` | RF claim/listing/redeem/paid paths have strong local test evidence. |
| Backend Review | `PARTIAL_PASS_WITH_BLOCKERS` | RF and Points handler tests pass; live DB/API evidence remains missing. |
| Economy Review | `PASS_FOR_BOUNDARIES` | Points remain internal utility; no payout/token/wallet movement. |
| Security / Fraud Review | `PARTIAL_PASS_WITH_BLOCKERS` | Replay/double spend/double redeem protections are tested locally; live trust/race evidence remains missing. |
| Observability Review | `PARTIAL_PASS_WITH_BLOCKERS` | Diagnostics tests pass; live logs/diagnostics bundle not collected. |
| QA / Test Review | `PASS_FOR_EXISTING_TEST_EXECUTION` | Existing tests executed successfully; no new tests added. |
| Canon Review | `PASS` | Report distinguishes local test evidence from staging evidence and does not overclaim. |

## 20. Recommended Next Step

Recommended next step:

```text
Stage 7.2b / RF Staging Evidence Collection Window
```

Required before full PASS:

- approve staging target and safe actors;
- approve read-only DB snapshot access;
- approve sanitized log collection;
- approve feature flag/config read-only snapshot;
- approve whether rollback flag-off validation may be executed;
- define whether concurrency evidence can be collected safely.

Until then, this Stage 7.2 result should remain:

```text
status: PARTIAL_EVIDENCE
full_runtime_readiness: not_established
runtime_activation: false
```
