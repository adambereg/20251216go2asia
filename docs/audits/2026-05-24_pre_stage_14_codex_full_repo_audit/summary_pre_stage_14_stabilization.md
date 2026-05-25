# Pre-Stage 14 Stabilization Summary

Дата: 2026-05-24
Источник: Codex read-only audits 1–4
Контекст: подготовка к Stage 14 — Content & Data Seeding
Статус: stabilization checklist before Stage 14

---

# 1. Executive summary

Четыре read-only Codex-аудита подтвердили, что Go2Asia готов переходить к Stage 14 при условии короткого pre-stage stabilization pass.

Общий статус:

`READY_FOR_STAGE_14_AFTER_SMALL_STABILIZATION_PASS`

Критических blockers для Stage 14 не найдено.

Но перед началом content/data seeding нужно закрыть несколько точечных рисков, потому что Stage 14 увеличит плотность реального контента, кликов, ссылок и пользовательских переходов.

Основные зоны стабилизации:

* broken deep links;
* middleware matcher hygiene;
* topology documentation drift;
* legacy alias semantic debt;
* seed-data guardrails;
* generated contract / SDK hygiene;
* projection metadata consistency.

---

# 2. Audit package summary

## Audit 1 — Repository Architecture & Boundaries

Verdict:

`PASS_WITH_WARNINGS`

Key findings:

* architecture is understandable and governed;
* projection/authority boundaries are strong;
* topology drift exists between README/workspace assumptions and actual `apps/*-service` topology;
* legacy alias surfaces remain controlled debt;
* Stage 14 is conditionally safe with guardrails.

## Audit 2 — Runtime / API / SDK Consistency

Verdict:

`GOOD_WITH_WARNINGS`

Key findings:

* runtime → gateway → SDK → PWA flow is generally consistent;
* OpenAPI-first flow exists;
* `@go2asia/types` root barrel is empty;
* `supportLookupKey` parsing semantics are duplicated between runtime and PWA helpers;
* generated contract entropy should be monitored.

## Audit 3 — Governance Semantics Audit

Verdict:

`PASS_WITH_WARNINGS`

Key findings:

* governance health is strong;
* semantic integrity is high;
* Path B vocabulary surfaces remain present but quarantined;
* projection/proof/authority boundaries are robust;
* Stage 14 seed data is the next major semantic erosion risk.

## Audit 4 — Route / UX Continuity Audit

Verdict:

`PASS_WITH_WARNINGS`

Key findings:

* Stage 13 journeys are mostly coherent;
* route continuity is generally strong;
* deferred surfaces are intentional, not broken;
* several broken deep links were found;
* Stage 14 seeding may expose these missing deep routes.

---

# 3. Pre-Stage 14 stabilization checklist

## P0 — Must address before heavy Stage 14 seeding

### 1. Broken deep links

Audit 4 found active navigation targets without matching route files:

* `/rf/:id/reviews`
* `/rf/:id/vouchers`
* `/quest/:id/edit`

Why it matters:

Stage 14 content/data seeding will increase click density. Seeded cards and lists may make these missing routes immediately visible to users.

Recommended action:

Choose one of two safe options for each route:

1. Create bounded intentional placeholder route with safe deferred framing.
2. Replace active links with existing valid routes.

Do not introduce new runtime semantics unless separately approved.

---

### 2. Quest run middleware matcher hygiene

Audit 4 flagged matcher pattern:

* `/quest/[id]/run(.*)`

Risk:

Dynamic matcher may be fragile depending on actual route matcher semantics.

Recommended action:

* verify matcher behavior with explicit tests or route smoke;
* correct matcher if needed;
* ensure guest access to quest run flow redirects as intended;
* avoid changing auth model beyond matcher hygiene.

---

### 3. Seed link target validation

Before adding real seed content, every seeded link should be validated against actual `page.tsx` map.

Required guardrail:

* no seeded card/list should point to a non-existing route;
* no seeded content should activate legacy/deferred paths unintentionally;
* all seeded links should use canonical routes or centralized route aliases.

---

# 4. P1 — Strongly recommended before or during early Stage 14

## 4. Canonical runtime topology documentation

Audit 1 and Audit 2 both found topology/documentation drift:

* docs/README imply `services/*`;
* actual runtime services live in `apps/*-service`.

Recommended action:

Create or update canonical topology documentation:

* actual apps/services/packages map;
* owner domains;
* gateway role;
* SDK role;
* PWA role;
* where new services should live.

Suggested artifact:

* `docs/architecture/runtime_topology_current.md`

Or include it in an existing architecture document.

---

## 5. Alias debt tracking

Legacy/deferred alias surfaces remain present:

* `/connect/wallet`
* `/space/balance`
* `/space/nft`

Current status:

* controlled;
* not blocking;
* semantically risky over time.

Recommended action:

Create alias lifecycle notes:

* canonical route;
* legacy route;
* current reason for keeping it;
* retirement condition;
* copy/guardrail requirement.

Do not remove aliases immediately without route usage evidence.

---

## 6. `@go2asia/types` root barrel clarification

Audit 2 found:

* `packages/types/src/index.ts` is effectively empty.

Risk:

* unclear public import pattern;
* AI-agent confusion;
* inconsistent deep imports.

Recommended action:

* decide whether empty root barrel is intentional;
* document intended import pattern;
* only export generated types from root if that is the chosen public API.

Do not change generated contract structure casually.

---

## 7. `supportLookupKey` contract hardening

Audit 2 found duplicated parsing semantics:

* runtime;
* PWA helpers.

Risk:

* silent drift if pointer format evolves.

Recommended action:

* add cross-layer fixtures or tests;
* consider shared parser later;
* document current format.

Do not change pointer format during Stage 14 seeding unless explicitly planned.

---

# 5. P2 — Non-blocking but should be tracked

## 8. Deferred page CTA template consistency

Deferred surfaces are intentional, but CTA hierarchy varies.

Recommended action:

Normalize deferred pages with a consistent pattern:

* status badge;
* one-line explanation;
* primary active route CTA;
* secondary back-to-module CTA;
* explicit no-runtime-promise copy where needed.

---

## 9. Continuous forbidden-vocabulary scan

Audit 3 confirmed governance is strong, but copy/test discipline is essential.

Recommended action:

Add or maintain scan checks for active user-facing files only.

High-risk vocabulary:

* proof;
* receipt;
* payout;
* settlement;
* booking confirmed;
* guaranteed availability;
* verified identity;
* official reputation;
* source of truth;
* immutable audit;
* financial wallet.

Allowed contexts:

* negative disclaimers;
* guardrails;
* tests;
* reports.

---

## 10. Generated contract inventory

Audit 2 warned about generated contract entropy.

Recommended action:

Create read-only matrix later:

* runtime route;
* OpenAPI operation;
* SDK function/type;
* PWA consumer;
* owner service;
* tests.

Not required before Stage 14, but useful before Stage 15.

---

# 6. Stage 14 guardrails

Stage 14 should focus on content/data seeding without changing runtime semantics.

## Required guardrails

### Seed data must not become proof

Every seeded entity should remain clearly marked as:

* projection;
* demo;
* reference;
* preview;
* sample;
* non-authoritative.

### No seed-as-owner-fact

Seed data must not substitute for owner facts.

Authoritative facts remain in owner services.

### No booking/payment/settlement semantics

Seeded Rielt/RF/VIP/Connect content must not imply:

* booking confirmation;
* reservation;
* payment confirmation;
* settlement;
* receipt;
* guaranteed availability;
* reward grant.

### No Path B activation

Seed content must not activate or imply active:

* wallet;
* token;
* NFT;
* payout;
* on-chain operations;
* financial balance.

### Diagnostics remain internal

No diagnostics/support/admin traces should appear as customer proof.

---

# 7. Recommended Pre-Stage 14 stabilization slices

## Slice A — Broken Deep Link Stabilization

Scope:

* `/rf/:id/reviews`
* `/rf/:id/vouchers`
* `/quest/:id/edit`

Goal:

* remove user-facing dead links;
* either route to existing surfaces or create bounded deferred placeholders.

No runtime expansion.

---

## Slice B — Middleware Matcher Hygiene

Scope:

* quest run matcher;
* protected route smoke;
* admin/pro route smoke.

Goal:

* ensure protected/public route behavior matches Stage 13 assumptions.

No auth model changes.

---

## Slice C — Stage 14 Seed Guardrail Plan

Scope:

* seed taxonomy;
* seed route validation;
* projection/demo labels;
* forbidden semantics;
* module seeding order.

Goal:

* prepare controlled content/data seeding.

No content seeding yet.

---

## Slice D — Runtime Topology Canon Note

Scope:

* document current `apps/*-service` topology;
* clarify gateway/sdk/pwa ownership;
* reduce AI-agent confusion.

Goal:

* align docs with current repository reality.

---

# 8. Recommended Stage 14 entry order

After the small stabilization pass, Stage 14 should begin with low-risk content domains.

Recommended order:

1. Public informational surfaces:

   * Atlas;
   * Pulse;
   * Blog;
   * Guru.

2. Rielt listing projections:

   * with inquiry-only labels;
   * no booking semantics.

3. RF partner / offer projections:

   * no payment/settlement semantics;
   * no guaranteed discount semantics.

4. Quest sample content:

   * reward preview only;
   * no grant semantics.

5. Connect projections:

   * only after seed/projection guardrails are stable.

Avoid early seeding in:

* wallet-like surfaces;
* VIP/PRO entitlement surfaces;
* diagnostics/admin surfaces;
* Path B-related screens.

---

# 9. Closure verdict

The four Codex audits are sufficient for moving forward.

No additional large audit is required before Stage 14.

Recommended next action:

`Pre-Stage 14 Stabilization Pass`

Then:

`Stage 14 — Content & Data Seeding`

Overall status:

`READY_FOR_PRE_STAGE_14_STABILIZATION`

After the stabilization pass:

`READY_FOR_STAGE_14_CONTENT_DATA_SEEDING`
