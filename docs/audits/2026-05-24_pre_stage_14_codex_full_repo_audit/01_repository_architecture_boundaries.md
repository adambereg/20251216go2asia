# Audit 1 — Repository Architecture & Boundaries

Дата: 2026-05-24
Тип аудита: Read-only Codex audit
Статус: PASS_WITH_WARNINGS
Контекст: Pre-Stage-14 architecture baseline

---

# 1. Executive summary

Verdict: архитектура в целом понятна и управляемая, с сильной governance-рамкой и явным разделением `projection vs authority`, но есть признаки дрейфа между документированной и фактической структурой монорепо.

Особенно заметны:

* drift между README и реальным деревом сервисов;
* legacy semantic debt вокруг wallet/NFT/balance surfaces;
* риск future topology confusion для AI agents и новых участников;
* controlled, но существующий alias debt.

Общий вывод:

* Architecture boundaries — strong.
* Governance doctrine — strong.
* Runtime ownership separation — mostly preserved.
* Stage 14 readiness — conditionally ready with guardrails.

Stage 14 можно начинать, но только при строгом соблюдении seed/projection guardrails.

---

# 2. Repository map

## Apps

Основной frontend:

* `apps/go2asia-pwa-shell`

Runtime services:

* `apps/points-service`
* `apps/quest-service`
* `apps/rielt-service`
* `apps/rf-service`
* `apps/api-gateway`
* другие runtime services в `apps/*`

Наблюдение:

README и часть workspace topology всё ещё подразумевают `services/*`, тогда как фактическая active topology использует `apps/*-service`.

Это создаёт:

* onboarding drift;
* AI-agent topology confusion;
* architecture naming inconsistency.

## Packages

Ключевые shared packages:

* `packages/sdk`
* `packages/types`
* `packages/schemas`
* `packages/ui`
* `packages/logger`
* `packages/db`

Также присутствуют:

* generated contracts;
* shared taxonomies;
* OpenAPI-related generation flows.

## Docs / Capsules / Reports

Присутствует полноценная capsule system:

* `core`
* `ui`
* `stage_12_product_reality`
* `routing_rules`

Также присутствует полный execution trail Stage 13:

* `stage_13_0 ... stage_13_9`

Наблюдение:

`stage_12I_closure_review_v1.md` referenced в Stage 13 документах, но отдельный файл не найден.

Это document consistency warning.

## Key ownership areas

### PWA / UI

* `apps/go2asia-pwa-shell`

### Runtime authority

* runtime services (`apps/*-service`)

### Projection / alias governance

* projection helpers
* route aliases
* shared projection copy
* diagnostics helpers

---

# 3. Architecture boundary assessment

## Что хорошо разделено

### Governance doctrine

Governance boundaries формализованы и повторяются через:

* capsules;
* reports;
* projection copy;
* diagnostics wording;
* route framing.

### Projection vs authority

Явно закреплено:

* `projection != authority`
* `preview != grant`
* `dashboard != receipt`
* `lookup != proof`

### Runtime ownership

Runtime authority читается достаточно ясно:

* points → points-service
* quest → quest-service
* rielt → rielt-service
* RF → rf-service

PWA в целом остаётся projection/navigation layer.

---

## Где границы размыты

### README vs real topology drift

Документация и workspace assumptions всё ещё partially anchored around:

* `services/*`

Тогда как active topology использует:

* `apps/*-service`

Риск:

* incorrect assumptions;
* AI-agent confusion;
* onboarding inconsistency;
* future refactor drift.

### Legacy alias surfaces

Legacy/deferred surfaces остаются активными:

* `/connect/wallet`
* `/space/balance`
* `/space/nft`

Сейчас они контролируются wording/governance.

Но semantic debt остаётся.

---

## Authority drift risk

Текущий риск:

* low-to-medium.

Особенно в:

* diagnostics surfaces;
* legacy aliases;
* future Stage 14 seed data.

Сейчас boundaries удерживаются в основном:

* copy discipline;
* tests;
* capsules;
* Stage 12I doctrine.

---

# 4. Routing assessment

## Public routes

Публичные поверхности:

* `/`
* `/atlas`
* `/pulse`
* `/blog`
* `/guru`
* `/quest`
* `/rf`
* `/rielt`
* часть `/space/*`

## Authenticated routes

* `/connect/*`
* `/profile`
* `/rf/pro/*`
* `/rf/merchant/*`
* `/quest/my`
* `/quest/[id]/run`
* часть `/space/*`

## Admin/internal routes

* `/admin/*`

Middleware boundaries присутствуют.

## Legacy aliases

Централизованы через:

* `routeAliases.ts`

Alias notices explicit.

Это хорошая практика.

## Stale/dead route risk

Активных ссылок на:

* `/register`
* `/signup`
* `/space/teams`

не обнаружено.

Но legacy/deferred aliases остаются semantic debt.

---

# 5. Runtime/service boundary assessment

## PWA vs authority

Текущая доктрина выдержана:

* PWA = projection/navigation layer
* services = authority domains

## SDK boundary

OpenAPI-first pipeline существует:

* `openapi:bundle`
* `gen:types`
* `gen:sdk`

SDK в целом используется как boundary layer.

## Diagnostics vs proof

Diagnostics consistently framed as:

* internal operator tooling;
* support lookup;
* navigation/reference layer.

Не как:

* customer proof;
* audit ledger;
* settlement evidence.

## Owner facts

`owner_fact = authoritative`

остаётся одним из strongest governance anchors.

---

# 6. Capsules / reports consistency

## Canonical and current

Каноничными выглядят:

* `core` capsule
* `ui` capsule
* `stage_12_product_reality`
* `routing_rules`
* Stage 13 reports

## Consistency issues

### Missing referenced Stage 12I file

Stage 13 reports ссылаются на:

* `stage_12I_closure_review_v1.md`

Но файл не найден.

### README topology drift

README partially outdated относительно фактического tree.

### Workspace expectations drift

`pnpm-workspace.yaml` и docs partially retain older service topology assumptions.

---

# 7. Governance invariant check

| Invariant                                     | Status  | Evidence                  | Notes                              |
| --------------------------------------------- | ------- | ------------------------- | ---------------------------------- |
| `mock_data != proof`                          | PASS    | capsules + Stage 13       | Strongly repeated                  |
| `projection != authority`                     | PASS    | core/ui capsules          | Central doctrine                   |
| `preview != grant`                            | PASS    | Stage 13 slices           | No major drift                     |
| `dashboard != receipt`                        | PASS    | UI capsule                | Strong copy fences                 |
| `wallet != financial_wallet`                  | WARNING | legacy wallet surfaces    | Controlled semantic debt           |
| `listing_projection != inventory_authority`   | PASS    | Rielt doctrine            | Stable                             |
| `inquiry != booking`                          | PASS    | Rielt reports             | Strongly enforced                  |
| `lookup != proof`                             | PASS    | diagnostics doctrine      | Stable                             |
| `diagnostic_snapshot != customer_proof`       | PASS    | diagnostics reports       | Requires continued discipline      |
| `operational_trace != immutable_audit_ledger` | PASS    | governance docs           | Explicitly denied                  |
| `owner_fact = authoritative`                  | PASS    | core capsule              | Key anchor                         |
| `Path_B_inactive = true`                      | WARNING | legacy NFT/wallet residue | Still present as dormant semantics |
| `public_launch_implied = false`               | PASS    | capsules/reports          | Consistent                         |

---

# 8. Top architecture risks

## Blockers

None identified.

---

## High

### Topology / documentation drift

Mismatch between:

* README/workspace assumptions;
* actual `apps/*-service` topology.

Risk:

* incorrect integration assumptions;
* AI-agent confusion;
* future scaling drift.

---

## Medium

### Legacy alias semantic debt

* `/connect/wallet`
* `/space/balance`
* `/space/nft`

Current governance keeps them bounded, but semantic pressure remains.

### Missing Stage 12I referenced closure file

Potential documentation chain inconsistency.

---

## Low

### Ownership naming drift

Naming across:

* apps;
* services;
* packages;
* docs

is not fully normalized.

---

## Non-blocking follow-ups

Recommended:

* canonical runtime topology document;
* alias retirement roadmap;
* periodic governance drift review;
* topology naming normalization.

---

# 9. Stage 14 readiness

## Overall readiness

Stage 14 readiness:

* conditionally ready;
* guardrails-first.

---

## Recommended seeding order

### 1. Public informational surfaces

* Atlas
* Pulse
* Blog
* Guru

### 2. Rielt listing projections

With strong inquiry-only framing.

### 3. RF catalogs / offers

Preview-safe semantics only.

### 4. Connect / Quest projections

Only with explicit projection metadata disclaimers.

---

## Highest-risk seeding areas

Most dangerous:

* Connect/wallet-like surfaces;
* VIP/PRO surfaces;
* diagnostics surfaces;
* referrals;
* Path B legacy areas.

Risk:

* seed data interpreted as authority/proof.

---

## Required Stage 14 guardrails

Every seeded entity should preserve:

* projection/demo labeling;
* source labeling;
* no implicit grants;
* no proof semantics;
* no receipt semantics;
* no booking semantics.

Never:

* use seed as substitute for owner facts;
* activate Path B semantics through seeded UX;
* expose diagnostics/admin traces in customer-facing surfaces.

---

# 10. Recommended next audits

1. Runtime / API / SDK Consistency Audit
2. Governance Semantics Audit
3. Route / UX Continuity Audit
4. Security / Access / Secrets Audit
5. Projection Metadata Deep Audit
6. Alias Retirement Audit

---

# 11. Final git status

## Before audit

Workspace was already dirty:

* modified SQL/migration files;
* scripts;
* audit-related files.

## After audit

Same dirty state.

No new modifications introduced.

## Confirmation

Audit executed strictly in read-only mode.

No files were:

* modified;
* created;
* deleted.

---

# Read-only commands executed

* `git status --short`
* `find docs/reports -maxdepth 1 -type f | sort`
* `find apps -maxdepth 2 -type d | sort`
* `rg` scans for routing/projection/legacy terminology
* `cat` / `sed` / `nl -ba`
* `pnpm -C apps/go2asia-pwa-shell typecheck`
* `pnpm -C apps/go2asia-pwa-shell lint`

`git diff --check` failed only because of pre-existing trailing whitespace in already-modified files outside audit scope.
