# Stage 12I-E4 — Diagnostics Access Hardening / Operational Audit Trail Report

Документ: `stage_12I_E4_diagnostics_access_hardening_operational_audit_trail_v1.md`  
Статус: implementation report / bounded diagnostics access hardening and operational audit trail  
Дата: 2026-05-23  
Scope: internal Points admin diagnostics access hardening over E3 admin diagnostics runtime and E2 support lookup navigation  
Mode: bounded security/operations hardening slice

## 1. Stage 12I-E4 Verdict

Stage 12I-E4 strengthens the security and operations posture around the E3 internal admin diagnostics runtime.

The slice adds a fail-closed diagnostics feature gate, config-driven diagnostics service allowlist, bounded operational access audit metadata, and structured diagnostics access logs without creating customer proof, support case workflow, accounting authority, immutable audit storage, Path B runtime or customer-facing diagnostics UI.

Required statement:

```text
Stage 12I-E4 completed as bounded diagnostics access hardening and operational audit trail work, not support ticket workflow, Admin UI, immutable audit ledger, accounting ledger, payout/cashback/token/NFT runtime, Path B activation or public launch approval.
```

Final verdict:

```text
stage_12I_E4_status: COMPLETE_AS_DIAGNOSTICS_ACCESS_HARDENING
task_type: diagnostics_operational_security_hardening
risk_level: CRITICAL
diagnostics_access_hardening_implemented: true
bounded_operational_audit_trail_added: true
allowlist_authz_posture_strengthened: true
diagnostics_remain_internal_only: true
diagnostics_remain_non_authoritative: true
customer_facing_proof_semantics_added: false
support_workflow_added: false
accounting_or_ledger_engine_added: false
path_b_activation: false
fake_certainty_fields: false
public_launch_ready: false
```

## 2. Capsules Used

| Capsule | Role |
|---|---|
| `docs/ai/context/core/capsule.md` | owner fact doctrine, projection boundary, Path A / Path B firewall and no-public-launch discipline |
| `docs/ai/context/security/capsule.md` | support-proof, diagnostic snapshot, screenshot/mock/projection abuse and audit logging boundaries |
| `docs/ai/context/stage_12_product_reality/capsule.md` | Stage 12 product-reality residue, Path B vocabulary quarantine and non-launch posture |
| `docs/ai/context/routing_rules.md` | bounded context composition and anti-overload rules |

Upstream SSOT read:

- `docs/architecture/domain/stage_11_6_admin_economy_diagnostics_v1.md`
- `docs/architecture/domain/stage_11_7_mvp_cutline_enforcement_flags_v1.md`
- `docs/architecture/domain/stage_12_closure_review_v1.md`
- `docs/reports/stage_12I_E1_api_projection_envelope_v1.md`
- `docs/reports/stage_12I_E2_support_lookup_layer_v1.md`
- `docs/reports/stage_12I_E3_admin_diagnostics_runtime_v1.md`

## 3. Agents Used

| Agent | Role in E4 |
|---|---|
| AI Program Director / Orchestrator | task classification, risk level, exact boundary, review gates and final synthesis |
| Backend Developer | Points Service authz/config/logging implementation boundary |
| Runtime Governance Architect | operational trace vs proof/ledger boundary and runtime invariants |
| Security / Fraud & Abuse Reviewer | access abuse, IDOR/cross-user leakage and sensitive logging review |
| QA Agent | audit logging, fail-closed config and negative access test coverage |
| Technical Canon Writer | report structure, canon wording and residual gap register |
| Slice Strategist | bounded hardening scope and follow-up sequencing |

Frontend Developer was not used because E4 intentionally has no customer UI or Admin UI changes.

## 4. Orchestrator Classification

| Field | E4 decision |
|---|---|
| Task type | diagnostics operational/security hardening |
| Risk level | `CRITICAL` |
| Execution mode | bounded operational hardening |
| Primary domain | Points Service internal admin diagnostics access |
| Review gates | Backend, Runtime Governance, Security/Fraud, QA, Canon, Slice Strategy |
| Exact boundary | diagnostics feature flag + env allowlist + bounded access audit metadata/logs + tests + OpenAPI/generated sync + report |

Allowed and performed:

- diagnostics access logging;
- bounded operational audit trail metadata;
- authz/allowlist hardening;
- config/env-based policy;
- diagnostics request audit metadata;
- internal structured logging helper;
- additive internal OpenAPI/generated type updates;
- tests/grep guardrails;
- report.

Forbidden and not performed:

- customer-facing diagnostics UI;
- support case workflow;
- immutable audit ledger;
- accounting ledger activation;
- payout/cashback/token/NFT runtime;
- Path B activation;
- public diagnostics URLs;
- broad admin panel implementation;
- broad API rewrite;
- breaking API migration.

## 5. Audit Scope

Targeted audit covered:

- `apps/points-service/src/index.ts`;
- E3 `POST /internal/points/admin-diagnostics`;
- E2 `POST /internal/points/support-lookup`;
- service JWT helper and existing `X-Request-Id` handling;
- existing static E2/E3 service allowlists;
- existing Points `@go2asia/logger` request logging pattern;
- `apps/points-service/wrangler.toml` env/config pattern;
- `apps/points-service/test/request.test.ts`;
- `docs/openapi/points.yaml`;
- generated SDK/types outputs affected by internal schemas.

Explicitly out of scope:

- customer frontend;
- Admin UI or broad admin panel;
- support ticket/case lifecycle;
- accounting ledger or immutable audit store;
- Path B/token/NFT/bridge/on-chain surfaces;
- RF/Quest/Rielt/Space cross-service diagnostics rollout;
- unrelated service refactors.

## 6. Hardening Model

E4 model:

```text
service-auth request
-> diagnostics feature gate
-> env-driven diagnostics allowlist
-> parse bounded supportLookupKey
-> hash lookup subject for operational trace
-> resolve E2 lookup
-> return E3 AdminDiagnosticSnapshot with accessAudit metadata
-> emit bounded structured operational audit log
```

Implemented operational audit concepts:

| Concept | E4 value |
|---|---|
| `diagnosticAccessId` | `points-admin-diagnostic-access:<requestId>` |
| `diagnosticAccessTimestamp` | timestamp of audit metadata creation |
| `operatorService` | service-auth `sub`, or `UNKNOWN_SERVICE` when service auth fails |
| `lookupSubjectHash` | SHA-256 base64url hash of namespace/entity/lookup subject |
| `diagnosticKind` | E3 diagnostic kind |
| `diagnosticOutcome` | `LOOKUP_AVAILABLE`, `LOOKUP_LIMITED`, `LOOKUP_UNAVAILABLE`, `ACCESS_DENIED` |
| `auditVisibility` | `INTERNAL_ONLY` |
| `auditRetentionClass` | `OPERATIONAL_TRACE` |

Core doctrine:

```text
operational_trace != immutable_audit_ledger
diagnostic_access_log != customer_receipt
diagnostic_access_log != support_resolution
diagnostic_access_log != accounting_statement
diagnostic_snapshot != customer_proof
owner_fact = authoritative
```

Sensitive payload boundary:

- audit logs do not include raw `supportLookupKey`;
- audit logs do not include raw lookup subject / user lookup id;
- audit logs do not include transaction amounts, balances, external IDs or row payloads;
- response remains internal and additive; `accessAudit.lookupSubjectHash` is safe operational metadata only.

## 7. Authz / Allowlist Changes

Before E4:

- E3 required service JWT;
- E3 had a static `ADMIN_DIAGNOSTICS_ALLOWED_SERVICES` set;
- diagnostics access had no independent feature gate and no environment-controlled allowlist.

After E4:

- `POINTS_ADMIN_DIAGNOSTICS_ENABLED` must be truthy or access fails closed with `403`;
- `POINTS_ADMIN_DIAGNOSTICS_ALLOWED_SERVICES` must explicitly contain the service-auth subject;
- missing or empty allowlist fails closed;
- staging config pins:
  - `POINTS_ADMIN_DIAGNOSTICS_ENABLED = "true"`;
  - `POINTS_ADMIN_DIAGNOSTICS_ALLOWED_SERVICES = "admin-service,support-service"`;
- diagnostics allowlist is now isolated from E2 support lookup allowlist;
- `api-gateway` is no longer implicitly allowed by code for admin diagnostics unless explicitly configured in env.

Fail-closed behavior:

```text
missing_diagnostics_flag = access_denied
disabled_diagnostics_flag = access_denied
missing_diagnostics_allowlist = access_denied
service_not_in_diagnostics_allowlist = access_denied
malformed_diagnostic_request = access_denied_outcome
```

## 8. Operational Audit Trail Changes

Runtime/API changes:

- Added `AdminDiagnosticAccessAudit` model to the internal snapshot.
- Added `accessAudit` to `AdminDiagnosticSnapshot`.
- Added `AdminDiagnosticAccessOutcome`.
- Added `AdminDiagnosticAuditVisibility`.
- Added `AdminDiagnosticAuditRetentionClass`.
- Added bounded hash helper for lookup subjects.
- Added structured `Points admin diagnostics access audit` log event.
- Added denied-access logs for:
  - service auth failure;
  - missing/disabled diagnostics gate;
  - service not in allowlist;
  - malformed or unsupported diagnostic request.

Audit log shape:

```text
diagnosticAccess {
  diagnosticAccessId
  diagnosticAccessTimestamp
  operatorService
  lookupSubjectHash?
  diagnosticKind
  diagnosticOutcome
  auditVisibility = INTERNAL_ONLY
  auditRetentionClass = OPERATIONAL_TRACE
}
```

The operational trace is log-based and bounded. E4 does not create a database table, durable object, append-only ledger, external audit export, customer proof page or support case state.

## 9. DTO / API / OpenAPI Changes

Runtime/API:

- `POST /internal/points/admin-diagnostics` now requires env-based diagnostics policy in addition to service JWT.
- Successful diagnostic snapshots include `accessAudit`.
- Denied/malformed diagnostics requests emit bounded audit logs.
- No customer routes were added.
- No support lookup response shape was changed.

OpenAPI:

- Added `AdminDiagnosticAccessAudit`.
- Added `AdminDiagnosticAccessOutcome`.
- Added `AdminDiagnosticAuditVisibility`.
- Added `AdminDiagnosticAuditRetentionClass`.
- Added `accessAudit` to `AdminDiagnosticSnapshot`.
- Clarified that operational trace is internal-only and not an immutable audit ledger.

Generated artifacts:

- Updated `docs/openapi/openapi.bundle.yaml`.
- Updated generated SDK/types indexes.
- Added generated internal audit DTOs under:
  - `packages/sdk/src/generated/*`;
  - `packages/types/src/generated/*`.
- Updated generated platform API files:
  - `sdk/go2AsiaPlatformAPI.ts`;
  - `types/go2AsiaPlatformAPI.ts`.

Backward compatibility posture:

- internal DTO extension is additive;
- existing endpoint path and request body remain unchanged;
- no existing customer-facing API shape changed;
- no broad API rewrite.

## 10. Runtime Semantics

E4 preserves the E3 diagnostic semantics:

```text
diagnostic_snapshot != customer_proof
admin_diagnostics_can_help_find_owner_fact = true
admin_diagnostics_can_terminate_proof = false
lookup != proof
projection != authority
owner_fact = authoritative
metadata != receipt
Path_B_inactive = true
public_launch_implied = false
```

E4 adds operational semantics:

```text
diagnostics_access_can_be_traced = true
diagnostics_access_trace_is_internal_only = true
diagnostics_access_trace_can_help_security_review = true
diagnostics_access_trace_can_close_support_case = false
diagnostics_access_trace_can_terminate_proof = false
diagnostics_access_trace_is_immutable_ledger = false
```

Lookup outcome semantics remain unchanged:

- `LOOKUP_AVAILABLE` means owner pointer navigation found a bounded reference.
- `LOOKUP_LIMITED` means owner fact family navigation only.
- `LOOKUP_UNAVAILABLE` is not proof of absence.
- `ACCESS_DENIED` is an operational access outcome, not a support outcome.

## 11. Tests / Guardrails Added

Backend tests in `apps/points-service/test/request.test.ts`:

- admin diagnostic snapshot includes bounded `accessAudit`;
- success access emits exactly one bounded audit log;
- access log contains request-scoped access id and lookup outcome;
- access log includes `lookupSubjectHash`;
- access log does not contain raw lookup subject;
- access log does not contain raw `supportLookupKey`;
- access log does not contain amount, external ID, balance fields or row payloads;
- missing diagnostics flag fails closed with `403`;
- missing diagnostics allowlist fails closed with `403`;
- denied access emits `ACCESS_DENIED` operational audit log;
- malformed/unauthorized diagnostics requests continue to avoid DB lookup.

Existing E3 tests were preserved:

- successful bounded owner lookup;
- bounded transaction family lookup;
- unauthorized service blocked;
- ordinary gateway user auth blocked;
- malformed support lookup key blocked;
- invalid diagnostic kind blocked;
- no fake certainty, support-closure or Path B vocabulary in diagnostic payloads.

## 12. Validation Command Results

Passed:

```text
pnpm openapi:bundle
pnpm gen:types
pnpm gen:sdk
pnpm guardrails:mock-imports:check
pnpm guardrails:mock-env:check
pnpm -C apps/points-service test -- request.test.ts
pnpm -C apps/points-service test
pnpm -C apps/points-service typecheck
pnpm -C packages/sdk typecheck
pnpm -C apps/go2asia-pwa-shell typecheck
pnpm -C apps/go2asia-pwa-shell lint
pnpm -C apps/go2asia-pwa-shell test
git diff --check
ReadLints on edited Points source/test files
```

Observed lint posture:

- PWA lint completed with exit code 0.
- Existing repo warnings remain outside E4 scope.
- No linter errors were reported for E4-edited source/test files.

OpenAPI/codegen:

- `pnpm openapi:bundle`, `pnpm gen:types` and `pnpm gen:sdk` completed successfully.
- Generated SDK/types artifacts were synchronized with the additive internal schema changes.

Targeted grep:

```text
verified
settled
confirmed
guaranteed
proofComplete
supportResolved
caseClosed
receipt
accounting statement
financial ledger
cashback
payout
on-chain
bridge
NFT ownership
immutable audit
customer proof
```

Result:

```text
Points runtime implementation matches only pre-existing auth variable naming for "verified".
New OpenAPI/generated matches are negative boundary descriptions only.
Generated broad-scope matches outside E4 are pre-existing RF/Guru/Content schemas.
No E4 endpoint/type references were found in customer frontend.
Tests use forbidden vocabulary only as negative assertions.
```

## 13. Governance Review

Runtime Governance:

- operational trace is internal visibility only;
- operational trace cannot terminate proof;
- diagnostic snapshot remains navigation only;
- owner facts remain authoritative;
- no ledger/proof escalation was introduced.

Security / Fraud:

- diagnostics access is fail-closed behind env gate and allowlist;
- unauthorized/malformed attempts are logged as `ACCESS_DENIED`;
- logs avoid raw lookup subjects, support keys, amounts, balances and external IDs;
- no customer diagnostic URL or support-proof shortcut was introduced.

Backend/API:

- additive internal schemas only;
- no breaking API migration;
- no broad rewrite;
- no customer route exposure;
- OpenAPI/generated artifacts synchronized.

QA:

- success, denied and malformed diagnostics paths are covered;
- sensitive log payload assertions were added;
- guardrails and typechecks passed.

Canon:

- E4 stays bounded to operational/security hardening;
- support workflow remains deferred;
- immutable audit ledger remains explicitly out of scope;
- Path B remains inactive.

## 14. Remaining Operational / Security Gaps

- No persistent audit store was added; E4 intentionally uses bounded operational logs only.
- No rate limit was added for diagnostics access; this should be considered in a later operational controls slice if diagnostics usage grows.
- No Admin UI or support console exists; that remains out of scope.
- RF/Quest/Rielt/Space diagnostics are still out of scope.
- If future tooling must call diagnostics through `api-gateway`, the service subject must be explicitly added to `POINTS_ADMIN_DIAGNOSTICS_ALLOWED_SERVICES` by owner-approved config.
- No customer support-proof flow exists and should remain blocked until owner facts, support workflow governance and redaction rules are separately approved.

## 15. Acceptance Checklist

| Criterion | Status |
|---|---|
| diagnostics access hardening implemented | PASS |
| bounded operational audit trail added | PASS |
| allowlist/authz posture strengthened | PASS |
| diagnostics remain internal-only and non-authoritative | PASS |
| no customer-facing proof semantics introduced | PASS |
| no support workflow introduced | PASS |
| no accounting/ledger engine introduced | PASS |
| no Path B activation | PASS |
| no fake certainty fields introduced | PASS |
| additive/internal changes only | PASS |
| guardrails remain green | PASS |
| typecheck/lint/tests pass | PASS |
| report created | PASS |

Must remain true:

```text
diagnostic_snapshot != customer_proof
operational_trace != immutable_audit_ledger
admin_diagnostics_can_help_find_owner_fact = true
admin_diagnostics_can_terminate_proof = false
lookup != proof
owner_fact = authoritative
metadata != receipt
Path_B_inactive = true
public_launch_implied = false
```

## 16. Recommended Next Slice

Recommended next slice:

```text
Stage 12I-E5 — Diagnostics Rate Limit / Abuse Controls or Cross-Service Diagnostic Boundary Plan
```

Suggested E5 boundary options:

- add bounded rate-limit / abuse controls around internal diagnostics access; or
- define read-only cross-service diagnostics expansion plan for RF/Quest/Rielt/Content without implementing broad diagnostics runtime.

Do not proceed to Admin UI, support case workflow, customer proof output, immutable audit ledger, accounting ledger or Path B runtime without separate owner approval and a new bounded slice.
