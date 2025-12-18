## Milestone 3 OpenAPI Architecture Review — Points + Referral

Дата: 2025-12-18  
Reviewer: **Architecture Reviewer (sub-agent review mode)**  
Scope:
- `docs/openapi/points.yaml`
- `docs/openapi/referral.yaml`

### Summary
OpenAPI-контракты для downstream сервисов Milestone 3 согласованы с утверждёнными артефактами требований/архитектуры: границы gateway vs downstream сохранены, trust model для user-context зафиксирован как gateway-origin, а ключевые инварианты (идемпотентность/409) отражены контрактно.

### Checks
#### 1) Границы gateway vs downstream
- OK: user-facing `/v1/*` описаны как downstream endpoints, при этом модель явно подразумевает вызов через gateway (через `X-Gateway-Auth` + `X-User-ID`).
- OK: нет попытки перенести доменные правила в gateway в рамках спецификаций.

#### 2) Trust boundaries (M3 model)
- OK: выбран единый вариант для M3: downstream **не валидирует user JWT**, а принимает user-context только при **gateway-origin auth** (`GatewayAuth` = `X-Gateway-Auth`).

#### 3) SSOT и идемпотентность
- OK: в Points internal endpoint зафиксирована политика:
  - `externalId` обязателен
  - конфликт payload при существующем `externalId` → **409 Conflict**
  - событие классифицируется как integration error (в описании).

#### 4) Соответствие принципам Milestone 2 (“reproducible backend”)
- OK: контракты не вводят зависимость от UI-only конфигурации; security обозначен на уровне headers/service JWT.
- Note: дальнейшая фиксация vars/secrets/bindings остаётся задачей `docs/ops/*source_of_truth*.md` (вне самого OpenAPI файла).

### Risks / Notes (non-blocking)
- Рекомендация: при переходе к реализации обеспечить, что downstream действительно отклоняет запросы без `X-Gateway-Auth` (иначе trust boundary будет декларативным).
- Рекомендация: определить стратегию включения этих файлов в единый `docs/openapi/openapi.yaml` для генерации SDK (следующий шаг OpenAPI-first процесса).

### Verdict
**approved**
