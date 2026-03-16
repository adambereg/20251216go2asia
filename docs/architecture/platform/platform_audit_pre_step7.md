# Go2Asia Platform Audit (Pre-Step-7)

**Date:** 2026-03-16  
**Scope:** pre-Step-7 architecture and implementation baseline audit for Step 4 / 5 / 5.5 / 6 / 6.5  
**In scope services:** `space-service`, `reactions-service` (V1 like-only), `feed-service`, `api-gateway`  
**Reference SSOT:** `docs/plans/go2asia_next_steps_plan_2026_march_10.md`, `docs/architecture/social/social_layer_contracts_v1.md`, `docs/architecture/events/events_contracts_v1.md`

---

## 1. Executive summary

Current baseline is structurally strong: service boundaries are mostly clean, social-layer contracts are coherent, and unified event envelope V1 is largely adopted in `space-service` and `reactions-service`.

Main risks are not feature-completeness risks, but baseline-consistency and operational-readiness risks:

- contract drift between OpenAPI and runtime in a few critical points;
- staging rollout gaps for social services (deploy wiring, env wiring, smoke checks);
- migration metadata drift risk in DB migration meta files;
- missing high-risk integration and failure-mode regression tests.

**Audit verdict:** **NOT READY** for Step 7 until must-fix baseline items are closed.

---

## 2. What is already strong

- **Service boundaries remain mostly clean**
  - `space-service` stays social-core (posts/reposts/groups/profile projections/post-media).
  - `reactions-service` remains separate and V1 like-only.
  - `feed-service` behaves as read/distribution composition layer.
- **Social contracts are stabilized**
  - Canonical social target whitelist and reaction enrichment fragment are consistent across social docs and key runtime contracts.
- **Unified event envelope V1 is adopted enough for current stage**
  - Required envelope fields and canonical names (`reaction.deleted` over legacy alias) are aligned in active producers.
- **Gateway trust boundary is explicit**
  - Internal auth propagation via gateway and downstream trust check pattern are present and consistent.
- **DB schema intent for Step 4/5 aligns with service model**
  - `space` and `reactions` schema/migration intent supports current V1 contracts.

---

## 3. Current inconsistencies / drift

### 3.1 Contracts and API drift

- `docs/openapi/reactions.yaml` declares `Idempotency-Key`, but runtime behavior is primarily uniqueness/read-before-write based and does not fully honor explicit idempotency-key semantics.
- `docs/openapi/reactions.yaml` shows optional auth semantics for `POST /v1/reactions/summary:batch`, while runtime/gateway currently enforce protected access.
- `docs/openapi/space.yaml` allows nullable/optional `text` in create-post contract, while runtime has stricter conditional behavior for plain `post` creation.

### 3.2 Architecture document drift

- Part of `docs/architecture/space/*` still reflects broader or historical event/reaction expectations beyond current stabilized V1 scope.
- Dual feed surface is still present (`/v1/space/feed/*` and `/v1/feed/*`), which is acceptable as transitional state but ownership/facade positioning is not yet explicit enough.

### 3.3 DB migration process drift risk

- SQL migrations for social baseline exist, but migration meta chain/journal snapshots appear behind current migration set, creating drift and tooling confusion risk.
- DB docs/operational instructions are not fully synchronized with actual migration runner flow.

### 3.4 Operational and staging drift

- Social services are not fully integrated into staging CD matrix as first-class deploy targets.
- Gateway staging env wiring for social downstream URLs is incomplete in deployment pipeline.
- Readiness endpoints are mostly config checks, not dependency reachability checks.

### 3.5 Test baseline drift

- Unit/request tests exist, but social cross-service integration and failure-mode coverage is below safe pre-Step-7 baseline.
- Missing contract and degradation tests on the critical path: `gateway -> feed -> (space + reactions)`.

---

## 4. Risk register

## 4.1 Fix now (blockers before Step 7)

1. **OpenAPI/runtime drift on critical reactions semantics**
   - Align idempotency-key behavior and auth policy for `summary:batch`.
2. **DB migration metadata coherence**
   - Reconcile migration meta journal/snapshots with actual SQL migration set.
3. **Staging deployment readiness for social baseline**
   - Include social services in staging deploy matrix and wire gateway social URLs.
4. **Deployment/migration coupling**
   - Ensure social migrations are consistently applied before/with social rollout.
5. **Critical integration/failure test minimum**
   - Add social smoke + contract + degradation tests for gateway/feed/space/reactions chain.
6. **Network-failure degradation behavior in feed clients**
   - Guarantee controlled behavior for exceptions/timeouts, not only non-2xx HTTP responses.

## 4.2 Fix later (important, non-blocking)

1. **Formalize dual-feed surface policy**
   - Declare canonical external surface and deprecation path for alternate route family.
2. **Refresh legacy/drifting `space` architecture docs**
   - Mark outdated statements or split historical context from active SSOT.
3. **Strengthen transactional boundaries**
   - Harden multi-step writes where partial-failure windows still exist.
4. **Improve degradation observability**
   - Add explicit warning/metrics signals when feed enrichment falls back to defaults.
5. **Unify wrangler/runtime tooling versions and env docs**
   - Reduce ops friction across services.

## 4.3 Acceptable for now

1. **Reactions stays V1 like-only**
   - Consistent with current plan and scope discipline.
2. **Feed remains read/distribution without ownership drift**
   - Correct for Step 6 baseline.
3. **Soft event migration posture**
   - Envelope adoption is sufficient for current stage while keeping backward tolerance.

---

## 5. Must-fix-before-Step-7

1. Sync `reactions` OpenAPI and runtime for:
   - idempotency-key semantics;
   - auth policy of `POST /v1/reactions/summary:batch`.
2. Resolve `space` create-post request contract mismatch (`text` semantics) between OpenAPI and runtime.
3. Reconcile DB migration meta chain with applied social migrations and align DB process docs with actual migration runner.
4. Make social services staging-deployable as first-class units and wire gateway social service URLs in staging pipeline.
5. Enforce rollout safety: migration application must be guaranteed before social traffic enablement.
6. Add minimum social regression suite:
   - cross-service contract smoke (`gateway -> feed -> space/reactions`);
   - failure/degradation scenarios (upstream timeout/network error/partial outage);
   - key untested write/read branches in space/reactions.

---

## 6. Can-fix-later backlog

1. Decide and document canonical external feed API family and deprecation path for transitional routes.
2. Clean up legacy/over-broad statements in `docs/architecture/space/*` to prevent future boundary drift.
3. Add stricter transaction/outbox guarantees in multi-step write flows.
4. Expand observability around social degradation and dependency health quality signals.
5. Improve consistency of ops docs and service tooling versions.

---

## 7. Final readiness verdict for Step 7

**Verdict: NOT READY**

### Why

- Baseline architecture is directionally solid, but there are unresolved blocker-level risks in contract consistency, staging operability, migration coherence, and test safety net.
- Starting Step 7 now would likely compound integration risk and introduce avoidable rollback/debug overhead.

### Readiness transition condition

After closing the must-fix list above, the expected status moves to **READY with cautions**, with no scope expansion required.

