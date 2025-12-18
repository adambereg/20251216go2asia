## Milestone 3 Architecture Review — Points + Referral

Дата: 2025-12-18  
Reviewer: **Architecture Reviewer (sub-agent review mode)**  
Scope: `docs/plans/milestone3_requirements_and_boundaries.md`, `docs/plans/milestone3_target_architecture_draft.md`

### Summary
Артефакты Milestone 3 зафиксировали ключевые архитектурные решения до OpenAPI-first этапа: строгие границы gateway vs downstream, SSOT по схемам, выбранную trust-модель для user-context и норму идемпотентности с 409 на конфликт payload.

### Checks
#### 1) Границы gateway vs downstream
- OK: gateway определён как edge (routing/policy/observability), доменные правила Points/Referral закреплены за downstream.
- OK: лимиты/идемпотентность/коэффициенты не размещаются в gateway.

#### 2) SSOT и идемпотентность
- OK: SSOT Points — ledger транзакций (`points_transactions`), SSOT Referral — коды/связи в схеме `referral`.
- OK: выбран механизм идемпотентности `external_id`.
- OK (важная фиксация): при существующем `external_id` и отличающемся payload → **409 Conflict** + логирование как integration error.

#### 3) Trust boundaries
- OK: выбрана одна модель на M3 — downstream **не валидирует user JWT**, а принимает user-context только при подтверждённом **gateway-origin** через service auth (service JWT) (`X-Gateway-Auth`).
- Риск контролируемый: модель требует дисциплины конфигурации (секрет, проверка на стороне downstream) и должна быть отражена в OpenAPI/security sections на следующем этапе.

#### 4) Соответствие принципам Milestone 2 (“reproducible backend”)
- OK: закреплена необходимость policy vars/secrets/bindings и синхронизации `docs/ops/*source_of_truth*.md`.
- OK: указано владение схемами и миграциями каждым сервисом при общем Postgres.

### Risks / Notes (non-blocking)
- Рекомендация: в OpenAPI для downstream явно разделить user-facing и internal security (User auth enforced at gateway + gateway-origin assertion vs service JWT for internal).
- Рекомендация: по мере зрелости рассмотреть service bindings/сетевую изоляцию как усиление доверия “gateway-origin” (post-M3).

### Verdict
**approved**

