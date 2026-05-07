# RF Stage 1+2 — Lifecycle / Repeatability / Redemption Stabilization Implementation Plan (v1)

## 1. Executive Summary

После Stage 5.0B/5.0C (durable attribution + PRO read-only visibility) и Stage 5.0D decision pass, следующий основной трек — **Option E: RF lifecycle/repeatability/redemption stabilization**.

Этот документ фиксирует planning-only implementation path без runtime/schema изменений в рамках текущего pass.

Главный вывод: первым безопасным implementation slice должен быть **lifecycle/redemption runtime alignment на уже существующих canonical полях и redemption модели**, без запуска repeatable policy engine и без economy/rewards.

---

## 2. Current Runtime State

### Что уже есть в коде (main)

- `rf_voucher.status`: `claimed | redeemed | cancelled`
- `rf_voucher.canonical_status`: `available | locked | unlocked | redeemed | expired | cancelled`
- scope-aware unique индексы по partner/listing на legacy status + canonical status
- `rf_voucher_redemption` таблица для redemption факта
- `rf_claim_idempotency` c operation enum (сейчас только `voucher_claim`)
- Stage 5.0B attribution колонки и индекс confirmed attribution by PRO

### Поведение backend сегодня

- partner/listing claim пишет `status='claimed'` и `canonical_status='available'`
- redeem переводит в `redeemed` и пишет redemption запись
- summary читает canonical-first с fallback на legacy
- часть claimable/UI допущений всё ещё завязана на legacy `status IN ('claimed','redeemed')`

---

## 3. Existing Docs Reconciliation

Изученные документы:

- `docs/architecture/rf/rf_stage_5_0d_attribution_operational_review_v1.md`
- `docs/architecture/domain/rf-asia-domain-readiness-v1.md`
- `docs/architecture/domain/rf-asia-implementation-sequencing-v1.md`
- `docs/architecture/domain/rf-asia-stage-1-2-implementation-plan-v1.md`
- `docs/architecture/domain/rf-asia-stage-1-2-contract-diff-and-migration-draft-v1.md`
- `docs/architecture/domain/rf-asia-stage-1-2-migration-execution-plan-v1.md`
- `docs/architecture/domain/rf-asia-voucher-repeatability-policy-decision-v1.md` (фактический путь в `domain`, не в `rf`)
- `docs/architecture/rf/rf_pro_attribution_baseline_stage_5_0.md`
- `docs/architecture/rf/rf_attribution_canon_refinement_v1.md`
- `docs/architecture/platform/go2asia_attribution_architecture_map_v1.md`

### Согласованные инварианты docs

- RF owns RF attribution capture/persistence
- first successful claim attribution immutable
- Connect/economy не владельцы capture
- Stage 1+2 должны стабилизировать voucher lifecycle/redemption до economy

### Расхождения docs↔code, учтённые в плане

- Некоторые старые секции docs описывают pre-5.0B состояние (исторические блоки)
- В planning docs по idempotency ops есть разный уровень ширины (минимум `voucher_redeem` vs сразу полный набор)
- Runtime сейчас частично dual-world: canonical есть, но часть логики всё ещё legacy-first

---

## 4. Lifecycle Target Model

Целевая каноническая модель:

- `available`
- `locked`
- `unlocked`
- `redeemed`
- `expired`
- `cancelled`

Базовый принцип:

- **canonical_status — primary lifecycle truth**
- legacy `status` — compatibility слой на переходном окне

Базовые переходы (минимум для текущего трека):

- `available -> redeemed`
- `available -> cancelled`
- `available -> expired`
- `locked -> unlocked`
- `unlocked -> redeemed`
- терминальные (`redeemed`, `expired`, `cancelled`) необратимы

---

## 5. Legacy Compatibility Strategy

- Сохранить dual-write/dual-read переходный режим:
  - запись согласованной пары (`status` + `canonical_status`)
  - чтение canonical-first, fallback legacy только для backward compatibility
- Закрепить mapping:
  - `claimed -> available`
  - `redeemed -> redeemed`
  - `cancelled -> cancelled`
- OpenAPI/SDK делать additive, без ломки старых клиентов
- Frontend поддерживать tolerant mapping до полного canonical adoption

---

## 6. Redemption Model

Redemption остаётся отдельным durable фактом:

- `rf_voucher_redemption` хранит попытку/успех
- уникальный успешный redeem на voucher instance
- redeem идемпотентен
- voucher state и redemption row должны быть согласованы (успех redeem <-> voucher `redeemed`)

Что не внедряем сейчас:

- расширенные redemption workflows
- новый публичный redemption history API
- payout/economy semantics на redemption

---

## 7. Repeatability Policy

Зафиксированная policy линия:

- поддерживать и one-time, и repeatable в будущем
- default policy: `once_per_scope`
- ближайший минимальный policy set (future):
  - `once_per_scope`
  - `repeat_after_redeem`

### Важно для первого slice

Не запускать runtime repeatability engine сразу.  
Не менять существующие unique индексы под repeatable в первом implementation slice.

Repeatability включать отдельным bounded step после стабилизации lifecycle/redemption truth.

---

## 8. Attribution Interaction

Инварианты attribution при lifecycle stabilization:

- attribution остаётся per voucher instance
- redeem не меняет attribution факт
- при будущих repeatable instances attribution должен фиксироваться заново для нового instance
- immutable attribution rule (first successful claim) не трогается
- PRO read-only visibility логически остаётся valid (считает instances с confirmed attribution)

---

## 9. Migration / Schema Plan

Planning-level sequence (адаптировано под текущее состояние main):

1. Проверить и закрепить фактическое состояние уже добавленных canonical/redemption/attribution миграций во всех средах.
2. Не добавлять в первый slice policy-driven schema changes для repeatability.
3. Если нужен idempotency enum для redeem — сделать минимально необходимое additive расширение отдельной миграцией (без полного набора операций в том же шаге).
4. Поддерживать backward-safe migration style (additive, без destructive ops).

---

## 10. Backend Runtime Plan

1. Централизовать lifecycle guards вокруг canonical_status.
2. Выровнять claimable/reclaim проверки с canonical truth (не только legacy status).
3. Синхронизировать transitions при claim/redeem/cancel/expire с dual-write.
4. Стабилизировать partner/listing idempotency parity.
5. Сохранить non-blocking attribution behavior без изменений семантики.

---

## 11. OpenAPI / SDK Plan

- Additive контрактный слой:
  - canonical lifecycle fields как primary semantics
  - legacy status остаётся в переходный период
- Уточнить idempotency/replay semantics в contract descriptions
- После каждого контрактного шага:
  - `openapi:bundle`
  - `gen:types`
  - `gen:sdk`
  - `openapi:check`
- Тонкий SDK синхронизировать с generated contract (без новых фич API)

---

## 12. Frontend Compatibility Plan

Минимальный compatibility pass (без новых продуктовых функций):

- unified status mapping helper: canonical-first, legacy fallback
- согласование assumptions в:
  - RF catalog claim
  - listing voucher flow
  - my vouchers
  - merchant redeem UI
  - Connect RF projection
- избегать UI копирайта, который подразумевает economy semantics

---

## 13. Connect / Projection Impact

Connect остаётся read-only consumer.

Краткосрочно:

- не добавлять новые Connect attribution features
- только проверить, что существующие projection helpers корректно интерпретируют canonical fields

Стратегически:

- Connect projection расширять после стабилизации lifecycle/redeem truth

---

## 14. Tests and CI Gates

Минимальные gates для implementation phases:

- RF service integration tests:
  - partner claim
  - listing claim
  - redeem
  - summary
  - idempotency parity
- lifecycle transition matrix tests (allowed/forbidden)
- attribution regression tests (first claim immutable, invalid attribution non-blocking)
- OpenAPI drift gate (`openapi:check`)
- sdk/types typecheck
- targeted frontend RF tests/lint/typecheck

---

## 15. Rollback Strategy

- Использовать additive migrations и feature-flag style rollout where needed
- Не удалять legacy поля до явного deprecation window
- При rollback runtime:
  - fallback на compatibility reads
  - не терять canonical/redemption data
- Избегать смешивания risky schema/index rewrites и runtime refactors в одном release шаге

---

## 16. Implementation Phases

- **Phase A:** Lifecycle truth alignment audit + guards design freeze
- **Phase B:** Redemption runtime consistency + idempotency alignment
- **Phase C:** Canonical-first read alignment (backend + frontend compatibility mapping)
- **Phase D:** OpenAPI additive clarification + SDK regeneration
- **Phase E:** Test matrix expansion + CI hardening
- **Phase F:** Docs sync and operational runbook update
- **Phase G (future):** Repeatability runtime policy (`repeat_after_redeem`)

---

## 17. Recommended First Implementation Slice

**Slice 1 (минимальный безопасный):**

1. Backend lifecycle/redemption runtime alignment на текущей схеме (без новых policy features).
2. Canonical-first claimable/summary consistency.
3. Idempotency parity stabilization (partner/listing/redeem semantics consistency).
4. Additive OpenAPI clarification + SDK/type regen.
5. Regression test reinforcement.

Почему именно этот slice:

- минимальный риск scope creep;
- использует уже существующую schema foundation;
- напрямую снижает риск перед economy/rewards;
- не требует immediate repeatability engine.

---

## 18. Non-goals

В этом треке не делать:

- full repeatability/policy engine
- payouts / rewards / economy logic
- Points/G2A/NFT
- Connect wallet/projection expansion
- merchant attribution dashboard
- centralized attribution service
- large cross-domain refactors

---

## 19. Risks

- сохранение dual semantics слишком долго (legacy vs canonical drift)
- частичные правки idempotency без унификации могут оставить edge-case divergence
- premature попытка включить repeatable policy в том же релизе увеличит race/index risks
- слабая test matrix по lifecycle transitions даст регрессии при future economy bridge

---

## 20. Open Questions

1. Какой точный минимальный idempotency operation set нужен в Stage 1+2 (только `voucher_redeem` или шире)?
2. Нужен ли lock/unlock runtime в ближайшем slice или отложить до product need?
3. Когда вводить `repeat_after_redeem` в runtime: сразу после Slice 1 или после отдельного diagnostics pass?
4. Какой deprecation window для legacy-first UI assumptions по `status`?
5. Нужен ли отдельный internal diagnostics read-view до repeatability rollout?

---

### Final Recommendation

Первым implementation slice запускать **runtime lifecycle/redemption stabilization на текущей canonical базе + idempotency parity + additive contract sync**.  
**Не** запускать сразу repeatability engine и тем более economy/rewards.

---

## Slice 1 Implementation Note (Runtime Alignment)

Реализовано в Slice 1:

- canonical-first runtime alignment для claim/redeem/summary с legacy fallback;
- claim dual-write parity: `status='claimed'` + `canonical_status='available'` + `contract_version=1`;
- redeem consistency: terminal checks по `canonical_status`, deterministic replay, запись в `rf_voucher_redemption` сохранена;
- idempotency parity: partner claim получил context mismatch guard аналогично listing;
- additive OpenAPI/SDK contract clarification по lifecycle и summary;
- frontend compatibility mapping: общий helper canonical-first + legacy fallback без UI redesign;
- attribution semantics Stage 5.0B/5.0C сохранены (immutable attribution, redeem не мутирует attribution fact).

Явно не реализовано в этом slice:

- repeatability runtime engine и policy fields (`rf_offer.repeat_policy`, `rf_voucher.repeat_policy_snapshot`);
- economy/rewards/payout semantics;
- Connect projection expansion;
- merchant campaign/editor changes;
- global lifecycle refactor.
