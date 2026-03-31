# RF Architecture Conformance Readiness Audit v1

**Status:** readiness/conformance audit (docs + code aware)  
**Scope:** RF runtime/openapi/code surface vs fixed RF/geo boundaries and downstream needs  
**Type:** audit/reference only (no implementation changes in this pass)

---

## 1. Purpose

Этот документ оценивает, насколько текущий RF контур уже готов выступать shared business/partner layer для экосистемы Go2Asia, с опорой на:

- RF/geo boundary документы;
- фактический RF runtime/openapi/code surface;
- downstream потребности, выявленные в implementation gap audit для Rielt и Quest.

Цель — отделить:

- real blockers;
- partial but usable readiness;
- deferred/non-blocking зоны.

---

## 2. Audit baseline

Аудит выполнен относительно уже зафиксированных базовых правил:

- Atlas owns canonical geo identity/place truth.
- RF owns partner/business presence + branch/offer/voucher/verification semantics.
- Rielt owns listing/property/inquiry truth.
- Quest owns progression/proof/execution truth.
- `Rielt <-> RF` и `Quest <-> RF` должны интегрироваться через stable refs/context seams без ownership transfer.
- Direct cross-service table writes и shared mutable ownership запрещены.

---

## 3. Current RF implementation reality

### 3.1 Реально реализованный runtime/API срез

- RF service реализует operational baseline endpoints: partners/offers read, business partner/offer create+activate, voucher claim/redeem, `me/vouchers`, pro-links.
- Контракт `docs/openapi/rf.yaml` в основном соответствует реализованным `/v1/rf/*` маршрутам.
- Есть gateway-based auth envelope (`X-Gateway-Auth`) для protected RF flows.
- Есть Atlas-linked geo checks при создании партнёра (`atlasPlaceId` / `hostAtlasPlaceId`) как часть RF store logic.
- Есть working DB schema contour (`rf_partner`, `rf_offer`, `rf_voucher`, `rf_pro_link`, idempotency store).

### 3.2 Что уже видно как ограничение runtime

- RF runtime — узкий baseline, существенно уже, чем outline/backend architecture docs.
- В runtime отсутствуют branch-first APIs/surfaces и internal projection/validation seams.
- Нет единого endpoint-level consumer contract специально для downstream сервисов (Rielt/Quest).

---

## 4. Domain conformance

### 4.1 Уже соответствует роли RF

- RF действительно реализует partner/business presence ядро (partner + offer + voucher + pro-link baseline).
- RF использует Atlas-linked refs и не пытается стать geo identity owner.
- RF не берёт ownership соседних core lifecycles (listing/inquiry, quest progression/proof, social truth) на уровне реализованного service ядра.

### 4.2 Частично соответствует

- Branch attachment semantics формально описаны как ключевая часть роли RF, но runtime surface для branch-контуров неполная.
- Verification/visibility/moderation semantics описаны богаче, чем фактически реализованы в текущем API/model срезе.
- Unified downstream-oriented validation profile задекларирован как target, но не завершён.

### 4.3 Пока в основном docs-only

- Полный runtime-contract depth из `rf_openapi_outline_v1.md` / `rf_backend_architecture_v1.md`.
- Internal projection/validate seams для сервис-сервис consumer use.
- Полная field-level синхронизация branch/business refs с расширенной geo matrix.

---

## 5. Boundary conformance

### 5.1 Boundary удерживается

- RF не владеет geo identity (использует canonical refs).
- RF не владеет listing/property truth и не пишет в Rielt-owned lifecycle.
- RF не владеет quest progression/proof/execution truth.
- RF как контур не реализует direct cross-service ownership writes.

### 5.2 Риски скрытого drift

- Разрыв между «широкой» документированной моделью и «узкой» runtime-поверхностью может провоцировать ad hoc seams в downstream.
- Отсутствие machine-readable consumer seams повышает риск неявного переноса business semantics в Rielt/Quest.
- Часть error/route/shape semantics в runtime и docs согласована неполно (см. раздел 6), что может породить contract drift при интеграции.

---

## 6. API / OpenAPI / runtime conformance

### 6.1 Что согласовано

- Основной набор RF endpoints из `docs/openapi/rf.yaml` присутствует в runtime.
- Основные response envelopes/DTO на happy-path в целом соответствуют rf.yaml.
- OpenAPI bundle включает RF surface и типовой контрактный след для экосистемы.

### 6.2 Где docs richer than runtime

- `rf_openapi_outline_v1.md` и `rf_backend_architecture_v1.md` описывают существенно более широкий контур (branches, moderation, internal endpoints, richer lifecycle), чем текущая runtime реализация.
- Некоторые advertised/internal surfaces в outline не реализованы в текущем маршрутизаторе как рабочие downstream seams.

### 6.3 Где runtime/contract semantics расходятся

- Есть локальные расхождения по error/code-path semantics (включая ветки доступа/ошибок), которые важны для consumer-safe интеграции.
- Есть неоднородность между generated/manual клиентскими слоями RF, повышающая риск типового drift.
- Пагинация/фильтрация формально объявлена в ряде контрактных форм, но фактически baseline-ограничена.

---

## 7. Downstream consumer readiness

### 7.1 Для Rielt

**Покрыто RF сейчас:**

- Базовый partner/offer read context существует как отдельный runtime контур.
- Ownership граница не мешает Rielt сохранять listing/inquiry ownership.

**Покрыто частично:**

- Stable optional Rielt↔RF ref seams ещё не зафиксированы в Rielt OpenAPI/schema/DTO.
- Branch/business attachment seam для Rielt business-linked сценариев не оформлен как минимальный machine-readable контракт.

**Не покрыто (или blocker-level):**

- Endpoint-level consumer contract для Rielt↔RF.
- Единый validation profile для cross-module refs.

### 7.2 Для Quest

**Покрыто RF сейчас:**

- Базовый partner/offer context можно читать через RF public/runtime surfaces.
- Ownership split (Quest progression vs RF business lifecycle) сохраняется.

**Покрыто частично:**

- `visit_partner` seam в Quest есть, но contract harmonization `targetType/targetId` vs RF artifacts неполная.
- Voucher/offer business context seam в Quest implementation остаётся частично документным.

**Не покрыто (или blocker-level):**

- Branch-level consumer seam.
- Eligibility/redeem-related cross-service hooks как контрактно закреплённый first-slice слой.
- Unified validation profile для business-linked proof paths.

---

## 8. Real blockers

Ниже то, что реально блокирует первый безопасный bounded downstream slice:

1. Отсутствие явного endpoint-level consumer contract для `Rielt <-> RF` и `Quest <-> RF` (сейчас это в основном boundary-text, а не machine-readable agreement).
2. Отсутствие стабильного и harmonized reference seam для бизнес-связанных сценариев (особенно `Quest target refs` и `Rielt optional RF refs`).
3. Отсутствие минимального общего validation profile для cross-module RF refs (format/existence/consistency expectations).
4. Неполный branch-level runtime seam для downstream business-linked use cases.

---

## 9. Partial readiness / deferred zones

### 9.1 Partial but usable

- RF baseline runtime уже пригоден как read/reference business context для ограниченного first slice.
- Ownership boundaries в текущем коде в целом выдержаны.
- Atlas-linked geo discipline в RF присутствует на базовом уровне.

### 9.2 Deferred/non-blocking (для first bounded slice)

- Полный outline-level RF surface (широкие lifecycle/ops/internal контуры).
- Полная branch/moderation/projection глубина.
- Полная cross-service orchestration validation.
- Полная продуктовая depth merchant/PRO/admin beyond baseline.

Эти зоны важны, но не обязательны для самого первого bounded integration slice при корректной фиксации seams.

---

## 10. Minimal RF hardening slice candidates

Консервативные кандидаты (не roadmap, не redesign):

1. Зафиксировать минимальный machine-readable consumer seam в RF/OpenAPI для downstream refs (partner/branch/offer context), без ownership shift.
2. Довести до однозначности error/status semantics на RF routes, критичных для consumer flows.
3. Выровнять RF typed surface (manual vs generated usage) для снижения контрактного drift.
4. Зафиксировать и внедрить минимальный validation profile для downstream RF refs (формат + базовые consistency checks).
5. Добавить/стандартизировать thin read-only projection seam для service consumers (без internal god-API расширения).
6. Синхронизировать RF docs `implemented vs planned`, чтобы consumers не интегрировались в несуществующие runtime surfaces.
7. Явно закрепить first-slice branch/partner reference policy для Quest/Rielt use cases.

---

## 11. What this document does NOT decide

Этот документ:

- не является новым SSOT или redesign-предложением;
- не является roadmap/execution plan;
- не поднимает operational status contour;
- не утверждает full runtime readiness;
- не меняет ownership model;
- не предлагает runtime/API/DB patch прямо в этом проходе;
- не подменяет status anchor и execution master plan.
