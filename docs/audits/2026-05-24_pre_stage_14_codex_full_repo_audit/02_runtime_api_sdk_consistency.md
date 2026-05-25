# Audit 2 — Runtime / API / SDK Consistency

Дата: 2026-05-24
Тип аудита: Read-only Codex audit
Статус: GOOD_WITH_WARNINGS
Контекст: Pre-Stage-14 runtime/API/SDK consistency baseline

---

# 1. Executive summary

Overall verdict: runtime/API/SDK consistency = good with warnings.

Основной контур:

* runtime services;
* API Gateway;
* SDK;
* PWA;
* projection metadata;
* route aliases;
* shared types;

в целом согласован.

Критических blockers не выявлено.

Основные warnings:

* `@go2asia/types` root barrel пустой (`export {}`), хотя generated-типы лежат глубже в `src/generated/*`;
* `supportLookupKey` parsing/validation реализован отдельно в runtime и PWA helpers, что создаёт drift risk;
* generated contracts surface достаточно большой, и риск stale/unused generated contracts растёт;
* legacy aliases остаются controlled debt;
* topology/documentation drift из Audit 1 остаётся релевантным.

Общий вывод:

* Runtime/API/SDK consistency — good.
* Projection metadata consistency — pass with warning.
* OpenAPI/SDK consistency — warning, not fail.
* Stage 14 readiness — good, but requires contract-first seed discipline.

---

# 2. Runtime topology map

## Gateway

* `apps/api-gateway`

Функции:

* централизованная маршрутизация;
* auth context;
* route classification;
* service URL fan-out.

## Runtime services

Фактическая service topology находится в `apps/*-service`:

* `apps/points-service`
* `apps/quest-service`
* `apps/rielt-service`
* `apps/rf-service`
* другие runtime services

Наблюдение:

Это подтверждает finding Audit 1: фактическая topology отличается от старого `services/*` mental model.

## SDK

* `packages/sdk`

Характер:

* hybrid SDK;
* handwritten stable facades;
* generated OpenAPI layer;
* workspace dependency consumed by PWA.

## Types

* `packages/types`

Наблюдение:

`packages/types/src/index.ts` currently empty.

Generated contracts exist deeper in `src/generated/*`, but root package discoverability is weak.

## Schemas

* `packages/schemas`

Используется как runtime-validation / schema boundary layer.

## PWA consumer

* `apps/go2asia-pwa-shell`

PWA consumes SDK and projection helpers, and generally remains a UI/projection consumer rather than runtime authority.

---

# 3. OpenAPI / SDK consistency assessment

Status: WARNING.

## Что хорошо

OpenAPI-first pipeline formally exists:

* `openapi:bundle`
* `gen:types`
* `gen:sdk`

SDK README describes hybrid approach:

* stable handwritten exports;
* generated low-level types;
* subpath imports.

This is a strong foundation.

## Drift / risks

### Empty `@go2asia/types` root barrel

Finding:

* `packages/types/src/index.ts` contains only `export {}`.

Risk:

* low discoverability;
* inconsistent import patterns;
* AI-agent confusion;
* consumers may bypass intended package boundaries;
* stale expectations around `@go2asia/types`.

Severity:

* Medium.

### SDK README drift

SDK README contains wording like:

* “keep Phase 2 additions out until routes are real”

But generated contracts and PWA usage already appear broader.

Risk:

* documentation drift;
* wrong assumptions for future contributors;
* Codex/Cursor may infer outdated contract boundaries.

Severity:

* Low-to-medium.

---

# 4. Runtime → SDK → PWA consistency

## Service/runtime consistency

### Quest

Quest route surface appears structurally clean:

* public routes;
* auth routes;
* internal routes;
* clear path matching;
* separated runtime responsibilities.

### Rielt

Rielt public route layer is clean:

* `/v1/rielt/listings*`
* path params validated before service calls;
* inquiry semantics remain bounded.

### RF

RF route layer is large and more complex:

* feature flags;
* runtime adapters;
* partner/offer/voucher flows.

Risk:

* complexity is high;
* but boundary interfaces are typed and separated.

## SDK/PWA consistency

PWA consistently imports SDK workspace dependency.

Positive:

* reduces local DTO forks;
* supports central contract boundary;
* discourages runtime-shape duplication in PWA.

No major field-name conflicts were detected in inspected core layers.

## Nullability / optional handling

Projection helpers include:

* metadata guards;
* `supportLookupKey` guards;
* decode fail-safe behavior returning `null`.

This improves runtime mismatch tolerance.

---

# 5. Projection metadata assessment

Status: PASS_WITH_WARNING.

## Strong points

A consistent projection envelope exists across runtime/PWA layers.

Key fields include:

* `projectionSource`
* `projectionKind`
* `generatedAt`
* `referenceScope`
* optional owner/support fields
* `supportLookupKey`

PWA helpers expect the same key fields and can build admin diagnostics href from:

* `supportLookupKey`
* kind/scope metadata

## Warning: duplicated parsing semantics

`supportLookupKey` parsing exists in more than one place:

* runtime layer;
* PWA helpers.

Risk:

* if key format evolves, runtime and PWA may silently drift;
* diagnostics links may degrade;
* support/operator flows may break without type errors.

Severity:

* Medium.

Recommended follow-up:

* shared contract tests for `supportLookupKey`;
* single canonical parser or shared test fixtures;
* cross-layer fixture-based validation.

---

# 6. Routing / alias assessment

Status: PASS_WITH_WARNING.

## Strong points

Route alias registry is centralized.

Legacy notices are explicit.

This improves:

* route hygiene;
* discoverability;
* future retirement planning.

## Confirmed route hygiene

Stage 13.9 confirmed no active stale user-facing references to:

* `/register`
* `/signup`
* `/space/teams`

## Warning: legacy alias debt

Legacy aliases remain:

* `/connect/wallet`
* `/space/balance`
* `/space/nft`

Risk:

* semantic drift;
* accidental new usage;
* Stage 14 seed surfaces may make these look more active than intended.

Recommended follow-up:

* alias lifecycle policy;
* alias retirement readiness scan;
* telemetry or route usage plan before retirement.

---

# 7. Auth / middleware consistency observations

Middleware protects:

* admin routes;
* authenticated routes;
* PRO routes;
* selected protected module routes.

Known watch item:

* quest run-route matcher pattern should receive follow-up review.

Reason:

* dynamic route matchers can be fragile if route syntax is not aligned with actual runtime URL shape.

Severity:

* Medium operational risk;
* not a blocker in this audit.

---

# 8. Ownership boundary assessment

## Authoritative services

Domain ownership remains readable:

* Points → points-service
* Quest → quest-service
* Rielt → rielt-service
* RF → rf-service

## PWA authority drift

In inspected layers, PWA remains:

* consumer;
* projection renderer;
* navigation layer;
* diagnostics pointer surface.

It does not appear to become owner authority.

## Shared package drift risk

The empty `@go2asia/types` root barrel may encourage:

* deep imports;
* bypassed intended API boundaries;
* inconsistent import conventions.

Severity:

* Medium.

---

# 9. Generated code consistency

## Observations

Generated artifacts exist and are part of the architecture.

Risk is not current breakage, but future entropy:

* unused generated contracts;
* stale generated contracts;
* duplicated DTOs;
* drift between service handlers and generated clients.

## Recommended follow-up

Create a contract inventory matrix:

* runtime route;
* OpenAPI operation;
* SDK function/type;
* PWA consumer;
* test coverage;
* owner service.

This should be read-only first.

---

# 10. Top consistency risks

## Blockers

None identified.

---

## High

### Topology / documentation drift

Already identified in Audit 1 and reinforced here:

* documented structure vs actual `apps/*-service` topology.

Risk:

* incorrect integration assumptions;
* AI-agent reasoning errors;
* future contract misplacement.

---

## Medium

### Empty `@go2asia/types` root barrel

Risk:

* discoverability issues;
* inconsistent import patterns;
* stale expectations.

### Duplicated `supportLookupKey` parsing semantics

Risk:

* silent runtime/PWA drift;
* broken diagnostics handoff;
* inconsistent pointer interpretation.

### Generated contract entropy

Risk:

* stale/unused generated contracts as surface area grows.

---

## Low

### SDK README drift

Some wording may reflect older phase assumptions.

---

## Non-blocking follow-ups

* Contract inventory report.
* Unused generated contract scan.
* Projection metadata deep audit.
* Alias lifecycle policy.
* Shared parser/test fixtures for support lookup pointers.

---

# 11. Stage 14 implications

## Main risks during content/data seeding

### Runtime response fields added without contract sync

Risk:

* runtime adds fields;
* OpenAPI not updated;
* SDK/types stale;
* PWA consumes local assumptions.

Guardrail:

1. Runtime response field first appears in OpenAPI.
2. Then generated types/SDK.
3. Then PWA consumption.

### Projection metadata format drift

Risk:

* seed flows expand metadata;
* PWA parser diverges from runtime semantics.

Guardrail:

* shared tests for projection metadata and `supportLookupKey`.

### Alias expansion during seeding

Risk:

* seeded content links to legacy/deferred aliases;
* alias debt becomes product behavior.

Guardrail:

* all new links via centralized route alias registry;
* middleware review for new protected routes;
* seed link validation against actual `page.tsx` map.

---

# 12. Recommended next audits

1. OpenAPI / SDK Generation Pipeline Audit
2. Projection Metadata Deep Audit
3. Route / UX Continuity Audit
4. Governance Semantics Audit
5. Security / Access / Secrets Audit
6. Alias Retirement Audit

---

# 13. Final git status

## Before audit

Workspace was dirty before audit.

Pre-existing modified files included:

* SQL/migrations;
* scripts;
* other already-modified files outside audit scope.

## After audit

Workspace remained in the same dirty state.

No new modifications were introduced.

## Confirmation

Audit completed strictly read-only.

No files were:

* modified;
* created;
* deleted.

---

# Read-only commands executed

* `git status --short`
* `git diff --stat`
* `rg` scans for:

  * `supportLookupKey`
  * `projectionMetadata`
  * `ownerFact`
  * `proofClass`
  * `routeAliases`
  * `/connect/wallet`
  * `/space/teams`
  * `generated`
  * `OpenAPI`
  * `schema`
  * `sdk`
  * `legacy`
  * `deprecated`
* `find packages/sdk packages/types packages/schemas apps/api-gateway apps/points-service apps/quest-service apps/rielt-service apps/rf-service -maxdepth 3 -type f | sort`
* `pnpm -C apps/go2asia-pwa-shell typecheck`
* `pnpm -C apps/go2asia-pwa-shell lint`

`git diff --check` failed only due to pre-existing trailing whitespace in already-modified files outside audit scope.
