# RF Asia Domain Readiness v1

Цель: определить минимальную целевую доменную модель RF Asia (MVP/domain-ready), границы ответственности и реалистичный набор сущностей для следующего implementation цикла.

## 1) Domain boundaries (целевые)

### RF Asia отвечает за

- Partner и partner business profile
- PartnerOffer (публичные и сегментированные офферы)
- RFVoucher и правила применения
- VoucherRule / VoucherUnlockRequirement
- VoucherRedemption и бизнес-результат применения
- PROAttribution и partner-side reward linkage
- PartnerRewardPolicy и VoucherCampaign

### Connect Asia отвечает за

- Points balances и операции начисления/списания
- badges/achievements/progression
- user-facing referrals слой
- wallet-like user overview (агрегированная витрина)

### Rielt Asia отвечает за

- listing/property карточки и сценарии интереса/сделки
- точки применения RF ваучера к объекту/услуге
- UX discovery вокруг недвижимости

### Token Service (off-chain economic engine)

- учётные бизнес-операции токенов/поинтов (если применимо к проектному срезу)
- внутренние начисления/списания и бизнес-проводки

### Blockchain Gateway / Wallet Service

- редкий on-chain вывод/ввод
- mint NFT/totem
- управление ключами и blockchain integration

## 2) Target model RF Asia v1 (минимальная)

Ниже предложен минимальный набор с учётом текущего runtime и реальных разрывов.

### 2.1 Partner

Назначение:
- бизнес-владелец офферов и ваучеров

Минимальные поля:
- `id`, `slug`, `name`, `status`, `businessType`, `visibility`

### 2.2 PartnerLocation

Назначение:
- география/адресные точки партнёра (для RF map и property-context)

Минимальные поля:
- `id`, `partnerId`, `country`, `city`, `address`, `geo`, `status`

### 2.3 PartnerOffer

Назначение:
- коммерческое предложение партнёра, к которому эмитится ваучер

Минимальные поля:
- `id`, `partnerId`, `offerType`, `offerKind`, `title`, `terms`, `status`, `visibility`

### 2.4 RFVoucher

Назначение:
- управляемый бизнес-объект ваучера (не только купон)

Минимальные поля:
- `id`, `partnerId`, `offerId`, `campaignId?`, `status`, `scope`, `listingRef?`, `userId?`, `issuedAt`, `expiresAt`, `redeemedAt?`, `cancelledAt?`

Целевые статусы v1:
- `available`, `locked`, `unlocked`, `redeemed`, `expired`, `cancelled`

### 2.5 VoucherRule

Назначение:
- условия валидности и применения ваучера

Минимальные поля:
- `id`, `voucherId|offerId`, `ruleType`, `payload`, `priority`, `isActive`

### 2.6 VoucherUnlockRequirement

Назначение:
- строгая модель unlock-условий (Points, NFT/totem, role gates)

Минимальные поля:
- `id`, `voucherId|offerId`, `requirementType` (`points`, `nft`, `vip`, `pro`, `referral`), `operator`, `value`, `source`

### 2.7 VoucherRedemption

Назначение:
- отдельная запись факта применения ваучера

Минимальные поля:
- `id`, `voucherId`, `userId`, `partnerId`, `contextType`, `contextRef`, `result`, `redeemedAt`

### 2.8 PROAttribution

Назначение:
- attribution цепочка от PRO-сущности к ваучерному бизнес-событию

Минимальные поля:
- `id`, `voucherId|redemptionId`, `proUserId`, `partnerId`, `attributionType`, `attributionWeight`, `status`

### 2.9 PartnerRewardPolicy

Назначение:
- partner-funded/platform-funded политика reward/funding

Минимальные поля:
- `id`, `partnerId`, `fundingType`, `rewardMode`, `limits`, `effectiveFrom`, `effectiveTo`, `status`

### 2.10 VoucherCampaign

Назначение:
- пакетирование ваучеров и условий по периоду/сегментам

Минимальные поля:
- `id`, `partnerId`, `name`, `segment`, `budget`, `startAt`, `endAt`, `status`

### 2.11 UserVoucherState

Назначение:
- пользовательская read-model для wallet-like отображения RF ваучеров

Минимальные поля:
- `userId`, `voucherId`, `state`, `lockedReason`, `unlockProgress`, `updatedAt`

## 3) Что объединить или отложить (MVP-реалистично)

### Можно объединить на раннем этапе

- `VoucherRule` + `VoucherUnlockRequirement` как единая таблица policy с типизированным payload (до стабилизации).
- `VoucherCampaign` как optional слой (если нет multi-campaign rollout в ближайшем спринте).

### Лучше не откладывать

- `VoucherRedemption` как отдельную сущность (иначе сложно аудитировать lifecycle).
- `PartnerRewardPolicy` (иначе funding-модель останется неявной).
- `UserVoucherState` (иначе wallet-like UX продолжит жить только на frontend-адаптерах).

## 4) Domain readiness verdict

Готовность текущего контура:
- **Средняя** для baseline partner/offer/voucher.
- **Низкая/средняя** для premium unlock и cross-domain rewards.

Минимальный readiness-барьер для перехода к реализации v1:
1. Зафиксировать статусы ваучера и lifecycle-контракт.
2. Ввести unlock requirement слой (Points + NFT/totem-ready abstraction).
3. Формализовать funding/attribution политики.
4. Развести ownership RF/Connect/Rielt в API контрактах и read-model.

## 5) Нормативные ограничения текущего этапа

- Без глобального рефакторинга.
- Без переименования сущностей без отдельного разрешения.
- Без удаления legacy.
- Без runtime/schema/db изменений в рамках этого документа.
