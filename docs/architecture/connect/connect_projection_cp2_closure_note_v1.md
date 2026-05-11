# Connect Projection CP-2 Closure Note v1

## 1. Purpose

Зафиксировать закрытие CP-2 stabilization sequence для Connect Projection v1.

CP-2 был нужен, чтобы убрать источники медленного semantic drift в Connect RF projection: дубли запросов и кэша, разъезд lifecycle wording/mapping, неявные fallback-правила и слабую регрессионную защиту.

## 2. Scope Covered

### CP-2A — Query Stabilization

- зафиксирован один canonical RF vouchers list query key на dashboard surface;
- устранены дублирующие list-запросы;
- projection рассчитывается один раз в `ConnectRfSection`;
- выровнены loading/error/empty orchestration;
- закреплены summary/list precedence комментариями и helper policy.

### CP-2B — Shared Lifecycle Projection Rules

- canonicalStatus precedence закреплен как приоритетный;
- legacy status fallback закреплен как fallback-only;
- lifecycle label policy централизована в RF lifecycle helper;
- `getProjectionVoucherStatusLabel` переведен в thin-wrapper;
- projection-only lifecycle grouping policy явно зафиксирована.

### CP-2E — Regression / Contract Tests

- добавлены precedence контракты для summary/list;
- добавлены hasVouchers контракты для degraded-state сценариев;
- усилены lifecycle precedence и label consistency tests;
- добавлены copy guards против finance/token drift;
- добавлен canonical query key contract guard.

## 3. Main Architectural Risks Addressed

- second source of truth risk в Connect projection;
- duplicated RF query topology и дубли кэша;
- lifecycle drift между RF helper и Connect projection labels;
- inconsistent projection semantics между блоками dashboard;
- hidden finance/token wording drift в Connect copy;
- слабая регрессионная защита по ключевым projection boundaries.

## 4. Stabilization Results

- canonical query path для RF vouchers list закреплен;
- projection computation централизован на surface-уровне;
- lifecycle source централизован в RF lifecycle helper;
- summary/list precedence закреплена и тестами, и комментариями;
- projection-only lifecycle grouping policy зафиксирована;
- contract tests покрывают ключевые drift-векторы.

## 5. Locked Guardrails

- RF остается source of truth по voucher lifecycle.
- Connect projection остается read-only explanation/presentation layer.
- Summary endpoint authoritative для counters.
- Vouchers list authoritative для rows/groups/timeline item details.
- canonicalStatus precedence обязательный, legacy status только fallback.
- Локальное lifecycle invention в Connect запрещено.
- Finance/reward/token semantics в Connect projection/copy не расширяются.

## 6. Intentional Non-Goals

- no backend changes;
- no API/OpenAPI/DTO redesign;
- no RF lifecycle redesign;
- no claim/redeem semantics changes;
- no reward engine;
- no token/G2A/NFT logic;
- no analytics/event system;
- no dashboard IA/layout redesign.

## 7. Regression / Validation Outcome

- targeted unit/contract tests для CP-2A/2B/2E passed;
- canonical query key contract locked;
- lifecycle precedence and label policy locked;
- summary/list precedence and hasVouchers behavior locked;
- copy finance/token guards locked;
- runtime regressions не зафиксированы в рамках bounded slice.

## 8. Remaining Known Boundaries

- milestones остаются presentation-only, без domain ownership;
- `pendingActivation` и `repeatableAvailable` остаются list-derived projection metrics;
- dashboard composition остается bounded read composition, без нового Connect backend;
- activity-stream redesign вне scope CP-2.

## 9. Recommended Next Step

Рекомендуемый следующий bounded slice: **CP-3 Dashboard Composition Audit** (read-only assessment), с фокусом на coherence между Connect dashboard blocks и на дальнейшее снижение projection drift без расширения runtime scope.
