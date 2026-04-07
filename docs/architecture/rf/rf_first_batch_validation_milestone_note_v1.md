# RF First-Batch Validation Milestone (v1)

## Краткий verdict

Milestone first-batch validation зафиксирован: staging RF path работает end-to-end, а по dataset truth для `partners`, `offers`, `pro_links`, `voucher_seed_cases` data-blocking issues не выявлены. Наблюдались повторяющиеся `terminated` / `fetch failed` события, но в текущем срезе они классифицированы как transient execution noise, не как подтвержденный data blocker.

## Что подтверждено по инфраструктуре

- `rf-service` staging доступен и отвечает на `/health` и `/ready` кодом `200`.
- Gateway RF path отвечает (`/v1/rf/partners` = `200`) и используется batch-tooling.
- RF first-batch шаги выполняются через штатный `rf_first_batch_tool_v1.mjs` с staging `API_BASE`.
- State-файл `.tmp/rf_first_batch_state_v1.json` используется как каноничный артефакт материализации в рамках текущего прогона.

## Что подтверждено по данным

- **partners**
  - Data-blocking issues не обнаружены.
  - Все first-batch partner records материализованы.
- **offers**
  - Data-blocking issues не обнаружены.
  - Все `offer_001..offer_007` материализованы в state.
- **pro_links**
  - Data-blocking issues не обнаружены.
  - Все `pro_link_*` материализованы.
- **voucher_seed_cases**
  - Data-blocking issues не обнаружены на уровне dataset truth.
  - Все `voucher_case_*` имеют `voucherId` в state.

## Residual anomalies / reliability note

- В полных rerun периодически возникают `claim/redeem terminated` или `fetch failed` для части кейсов при том, что точечные retry и state подтверждают материализацию.
- Поведение повторных операций по idempotency может давать разные технические статусы (`201` vs `200`, `replay=true`, `applied=true/false`) без изменения dataset truth.
- Поэтому milestone фиксирует data truth для first batch, но не доказывает run-to-run стабильность без transient noise.

## Что этот milestone НЕ доказывает

- Не доказывает production-grade reliability/SLO и отсутствие сбоев при длительных или параллельных прогонах.
- Не доказывает покрытие всех business-сценариев RF вне текущего first-batch CSV.
- Не доказывает отсутствие race/network эффектов в claim/redeem path.
- Не является полным quality gate для RF v2 или broad remediation readiness.

## Minimal next recommended step

Один зафиксированный контрольный цикл `partners -> offers -> pro-links -> voucher-cases -> verify` с сохранением логов и snapshot state как milestone evidence; при несоответствии классифицировать как reliability noise vs data blocker до внесения изменений.
