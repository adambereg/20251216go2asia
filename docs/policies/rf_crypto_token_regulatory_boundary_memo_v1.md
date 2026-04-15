# Go2Asia — RF Crypto/Token Regulatory Boundary Memo v1

## Status

Этот документ фиксирует **архитектурную и продуктовую позицию** Go2Asia в связи с ужесточением регулирования цифровой валюты для российских резидентов в РФ.

Документ не заменяет юридическое заключение, но задаёт **обязательные границы проектирования** для MVP и следующих фаз разработки.

---

## Core Principle

Для российского контура Go2Asia использует модель:

- **off-chain internal points / platform units** внутри платформы;
- **optional on-chain layer** только через отдельный `Blockchain Gateway / Wallet Service`;
- жёсткое разделение между:
  - **внутренней платформенной экономикой**, и
  - **внешним on-chain контуром**.

Цель: не допустить, чтобы российский контур Go2Asia был интерпретирован как сервис **организации обращения цифровой валюты**, криптообменник, P2P-маркет или платёжная схема на базе криптоактива.

---

## Regulatory Design Position for RF Users

### 1. RF contour = off-chain first

Для пользователей из РФ основной экономический контур Go2Asia должен оставаться **off-chain**.

Допустимые сущности в RF-контуре:

- points;
- бонусные единицы;
- уровни;
- статусы;
- access rights;
- membership privileges;
- reputation / progression mechanics;
- внутренняя reward-логика платформы.

Эти сущности не должны проектироваться как свободно обращаемая цифровая валюта.

---

### 2. No crypto payment role inside RF contour

В российском контуре нельзя проектировать токен или NFT как:

- средство оплаты товаров и услуг;
- замену рублёвых расчётов;
- внутреннюю расчётную единицу между пользователями;
- инструмент погашения комиссий в криптоформе;
- массовый retail payment asset.

---

### 3. No platform-operated exchange flows for RF users

Платформа Go2Asia не должна предоставлять российским пользователям внутри РФ функции, которые могут быть интерпретированы как организация обращения цифровой валюты, включая:

- покупку токена за рубли;
- продажу токена за рубли;
- cash-out;
- crypto-to-fiat conversion;
- fiat-to-crypto conversion;
- P2P exchange matching;
- internal swap market;
- order book / exchange UI;
- посредничество в обмене между пользователями.

---

### 4. No ruble on-ramp to on-chain token in RF contour

Для российского пользовательского контура запрещается проектировать direct on-ramp, включая:

- покупку on-chain токена с российской карты;
- пополнение баланса в рублях с автоматической выдачей криптоактива;
- связку `rub → platform → token` как стандартный пользовательский сценарий.

---

### 5. On-chain layer must be isolated

On-chain слой допускается только как **отдельный внешний контур** через выделенный `Blockchain Gateway / Wallet Service`.

Требования:

- отдельная сервисная граница;
- отдельный policy layer;
- geo-aware / jurisdiction-aware control;
- отсутствие обязательности для RF mass users;
- отсутствие зависимости core platform UX от on-chain операций.

---

### 6. RF users must not depend on wallet ownership

Для российского пользователя базовая ценность Go2Asia не должна зависеть от:

- открытия внешнего криптокошелька;
- хранения on-chain токена;
- участия в on-chain операциях;
- прохождения крипто-комплаенса ради доступа к базовым функциям платформы.

---

## Token Service Boundary

`Token Service` в Go2Asia ведёт только:

- off-chain учёт;
- reward logic;
- entitlement logic;
- status / progression logic;
- internal balance state;
- platform-side accounting.

`Token Service` **не должен**:

- работать как exchange engine;
- хранить логику прямой конвертации в фиат;
- обеспечивать P2P-торговлю токеном;
- управлять пользовательскими криптосделками;
- выполнять функции криптообменника.

---

## Blockchain Gateway Boundary

`Blockchain Gateway / Wallet Service` — это отдельный сервис, который:

- изолирует on-chain интеграции;
- работает вне core RF UX;
- используется только для специальных сценариев;
- не является обязательным элементом повседневной экономики RF-контура.

Все on-chain операции должны рассматриваться как **optional edge capability**, а не как центральная бизнес-механика российского продукта.

---

## NFT Position

NFT в рамках Go2Asia для RF-контура допустимо использовать как:

- access asset;
- membership artifact;
- rare status marker;
- collectible;
- entitlement carrier;
- ключ доступа к специальным функциям.

NFT не должны проектироваться для RF-контура как:

- средство платежа;
- инвестиционный продукт с обещанием доходности;
- расчётный актив;
- proxy для свободного денежного обращения.

---

## Product Language Policy

В российском пользовательском и договорном контуре предпочтительно использовать лексику:

- points;
- баллы;
- бонусы;
- уровни;
- привилегии;
- доступ;
- статус;
- membership.

Нежелательно делать центральной публичной лексикой для RF-контура:

- криптовалюта;
- money token;
- инвестиционный токен;
- платёжный токен;
- цифровая валюта платформы.

---

## Required Guardrails for MVP

Для MVP и ближайших фаз обязательно:

1. RF contour строится как **off-chain first**.
2. On-chain функциональность не является default UX.
3. Нет покупки/продажи токена за рубли внутри платформы.
4. Нет P2P-обмена токена между пользователями через платформу.
5. Нет использования токена как средства оплаты внутри RF-контура.
6. NFT выполняют access/status role, а не payment role.
7. Все потенциально рискованные on-chain flows изолируются в отдельном gateway-контуре.
8. Все будущие crypto-like flows проходят отдельный legal/compliance review.

---

## Architecture Rule

Для Go2Asia действует правило:

> **RF contour = platform points, access, rewards, status**
>
> **External contour = optional on-chain layer through isolated gateway**

---

## Next Step

Перед запуском любых user-facing flows, связанных с:

- token withdrawal;
- wallet connection;
- NFT utility expansion;
- partner settlements;
- cross-border token mechanics;
- crypto-linked rewards,

нужен отдельный **legal + compliance review** на актуальной версии законодательства и финальных пользовательских сценариях.