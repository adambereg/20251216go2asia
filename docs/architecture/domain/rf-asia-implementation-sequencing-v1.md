# RF Asia Implementation Sequencing v1

Цель: предложить реалистичный поэтапный порядок реализации RF Voucher Economy v1 без глобального refactor-pass.

## Stage 0 — current state closure / documentation

Цель:
- зафиксировать текущее состояние RF/Rielt/Connect и договориться о каноне терминов.

Файлы/области:
- `docs/audits/*`
- `docs/economy/*`
- `docs/architecture/rf/*`, `docs/architecture/rielt/*`, `docs/architecture/connect/*`

Результат:
- единая карта текущих сущностей, gaps, рисков и границ ответственности.

Риски:
- затягивание в бесконечную документацию без перехода к implementation slice.

Что не делать:
- не менять runtime код и schema.

## Stage 1 — RF domain model baseline

Цель:
- закрепить минимальный RF domain contract: Partner, PartnerOffer, RFVoucher, lifecycle boundaries.

Файлы/области:
- RF backend contracts (`apps/rf-service/*`, `docs/openapi/rf.yaml`)
- shared types / SDK mapping (`packages/sdk/*`)
- domain docs (`docs/architecture/rf/*`)

Результат:
- согласованный contract-level baseline без расширенной premium-логики.

Риски:
- drift между OpenAPI, runtime и SDK.

Что не делать:
- не внедрять on-chain/NFT flow.

## Stage 2 — voucher lifecycle baseline

Цель:
- довести lifecycle до v1-формата: `available/locked/unlocked/redeemed/expired/cancelled`, плюс операция redemption как отдельный факт.

Файлы/области:
- RF service/store/use-cases
- OpenAPI/SDK lifecycle enums
- wallet/read-model adapters

Результат:
- предсказуемый lifecycle и базовая операция history.

Риски:
- несовместимость с текущими UI-предположениями.

Что не делать:
- не смешивать с full reward engine.

## Stage 3 — Rielt voucher integration

Цель:
- стабилизировать RF ↔ Rielt связь для listing/property сценариев.

Файлы/области:
- `apps/rielt-service/*` (где есть RF refs)
- `apps/rf-service/*` (listing-scope interfaces)
- frontend Rielt/RF voucher routes/components

Результат:
- единый способ привязки listing ↔ offer/voucher (без дублирующих truth-моделей).

Риски:
- breaking behavior в существующих карточках/CTA.

Что не делать:
- не вводить новые продуктовые UX-фичи сверх стабилизации интеграции.

## Stage 4 — Connect/Points integration

Цель:
- формализовать пересечение RF unlock/redeem с Points контуром.

Файлы/области:
- `apps/points-service/*`
- `docs/openapi/points.yaml`, cross-service contracts
- Connect wallet/referrals/summary integrations в frontend

Результат:
- явный контракт списаний/блокировок/подтверждений для RF unlock сценариев.

Риски:
- ledger inconsistency при частичных интеграциях.

Что не делать:
- не тащить сразу NFT/on-chain в этот этап.

## Stage 5 — PRO attribution and partner rewards

Цель:
- внедрить PROAttribution и PartnerRewardPolicy как доменный слой.

Файлы/области:
- RF domain tables/contracts
- referral/pro linkage contracts
- analytics/read-model for partner outcomes

Результат:
- прозрачная бизнес-атрибуция: кто привёл и как начисляется reward.

Риски:
- конфликт с существующей referral логикой без унификации терминов.

Что не делать:
- не смешивать attribution с governance/DAO механиками.

## Stage 6 — premium voucher unlock with Points + NFT/totem requirement

Цель:
- добавить premium unlock требования (Points + NFT/totem) как расширяемый policy слой.

Файлы/области:
- RF unlock requirements model
- Connect/Points policy checks
- future-facing gateway contracts (без полного on-chain rollout)

Результат:
- рабочий premium unlock в off-chain-first модели с готовностью к Gateway.

Риски:
- переусложнение до готовности базового lifecycle.

Что не делать:
- не делать full blockchain integration в этом этапе.

## Stage 7 — admin/partner console

Цель:
- дать управляемый интерфейс для партнеров/операторов: кампании, правила, статусы, redemption.

Файлы/области:
- `app/(authenticated)/rf/merchant/*`
- admin/ops dashboards
- API для управления campaign/rules/policies

Результат:
- операционный контроль RF экономики без ручных обходных процессов.

Риски:
- UI может обогнать backend governance.

Что не делать:
- не строить "идеальный" enterprise console на первом проходе.

## Stage 8 — UX polish and content enrichment

Цель:
- улучшить пользовательские потоки и контентную насыщенность после стабилизации домена.

Файлы/области:
- RF/Rielt/Connect UX
- content/promo blocks, localization, walkthroughs
- analytics instrumentation

Результат:
- понятный пользовательский опыт вокруг ваучеров, unlock, rewards.

Риски:
- косметика до закрытия бизнес-критичных доменных дыр.

Что не делать:
- не подменять продуктовый прогресс только визуальными улучшениями.

## Рекомендуемый первый implementation slice после аудита

Первым делать:
- **Stage 1 + ключевая часть Stage 2 (baseline lifecycle)** как bounded slice.

Почему:
- это минимально необходимая база для всех последующих интеграций (Rielt, Connect, premium unlock).
- снижает риск дублирования и naming drift.
- даёт стабильный контракт для UI и для cross-service интеграций.
