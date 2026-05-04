# RF Asia Voucher Economy Alignment v1

Цель: сравнение текущей реализации с целевой моделью `RF Voucher Economy v1` (read-only).

## 1) Baseline и допущения

Сравнение выполнено относительно:
- `docs/economy/vouchers/rf_voucher_economy_v1.md`
- `docs/economy/economy_backend_alignment_audit_v1.md`
- `docs/economy/tokenomics/go2asia_tokenomiks_v1.md`
- `docs/architecture/rf/*`, `docs/architecture/rielt/*`, `docs/architecture/connect/*`
- runtime артефактов в `apps/*`, `packages/*`, `docs/openapi/*`

## 2) Alignment matrix (v1 требования)

| Требование v1 | Статус | Комментарий |
|---|---|---|
| Voucher как полноценная сущность | Есть | `rf_voucher` существует, API/SDK присутствуют. |
| Voucher ↔ Partner | Есть | RF partner и voucher связаны в текущем домене. |
| Voucher ↔ Rielt listing/property/deal | Частично | Listing-связки есть; единая deal-модель не выделена. |
| Premium voucher | Частично | Есть premium-контекст, но не как полный unlock-домен. |
| Unlock requirements | Ограниченно | Нет завершённой общей модели требований unlock. |
| Points price/lock/spend | Частично | Wallet/points есть, но voucher spend-lock как целостный flow неполный. |
| NFT/totem requirement | Нет (MVP runtime) | В документах как target; в runtime baseline не закрыт. |
| Partner-funded / Platform-funded | Нет как явная доменная модель | Нужна формализация policy-уровня. |
| PRO attribution | Частично | PRO-контур есть, attribution выдач/погашений неполный. |
| Referral logic | Есть отдельно | Referral домен присутствует, с RF voucher связан частично. |
| VIP earning/spending modifiers | Частично | VIP есть как роль/слой, modifiers в voucher economy не финализированы. |
| Voucher statuses (available/locked/unlocked/redeemed/expired/cancelled) | Частично | Есть часть lifecycle; полный status-контракт v1 не закреплён. |
| История операций | Частично | Идемпотентность и базовые переходы есть, event history слой неполный. |
| Wallet-like representation | Есть частично | Витрины есть (Connect + RF summary), единый voucher-wallet ledger отсутствует. |

## 3) Domain boundaries vs текущая реализация

### RF Asia (должен владеть)

В целом соответствует направлению:
- partners/offers/vouchers
- voucher lifecycle и условия применения

Не хватает:
- voucher unlock requirements
- funding policies
- PRO attribution к бизнес-результату

### Connect Asia (должен владеть)

Есть:
- points, badges, referrals, wallet-like overview

Не хватает интеграции:
- строго формализованные экономические пересечения с RF voucher unlock/reward.

### Rielt Asia (должен владеть)

Есть:
- listing/property UX и RF voucher application entry points

Риск:
- пересечение ownership в ссылках listing ↔ RF offer/voucher при нескольких механизмах связки.

### Token Service / Blockchain Gateway

В docs направление согласовано:
- MVP off-chain first
- on-chain через будущий gateway/wallet
- DAO вне ближайшего roadmap

В runtime:
- on-chain/NFT unlock ещё не operational baseline.

## 4) Противоречия docs ↔ runtime (фиксируем, не исправляем)

- Терминологический drift вокруг `Token Service` и фактического points-ledger owner.
- В ряде контуров docs описывают целевую модель, тогда как runtime в текущем этапе реализует промежуточный slice.
- Часть legacy/mock артефактов в frontend и docs может визуально симулировать более зрелую модель, чем есть в backend.

## 5) Основные gaps к RF Voucher Economy v1

1. Нет минимально формализованной сущности unlock-требований (Points + NFT/totem).
2. Не закрыта funding-логика ваучеров (partner-funded/platform-funded).
3. Не закрыта PRO attribution модель от действия пользователя до reward-последствий.
4. Нет согласованного voucher lifecycle-контракта со всеми статусами v1.
5. Нет полноценного operation/event trail по ваучерной экономике.
6. Нет единого контракта между RF и Connect для списаний/блокировок/разблокировок в рамках voucher unlock.

## 6) Риск-профиль

- **Архитектурный риск:** дублирование связей RF↔Rielt.
- **Продуктовый риск:** premium-voucher UX обещает больше, чем текущий экономический backend.
- **Операционный риск:** смешение mock/live сценариев.
- **Domain risk:** неявные границы ответственности RF vs Connect при wallet и rewards.

## 7) Вывод по alignment

Текущий стек частично готов к RF Voucher Economy v1: базовые контуры RF/Rielt/Connect уже существуют.  
Критический недостающий слой — формальная voucher unlock и reward economy (Points/NFT/PRO/VIP/funding) как единый доменный контракт с lifecycle и операционной историей.
