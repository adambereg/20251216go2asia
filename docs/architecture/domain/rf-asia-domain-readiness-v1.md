# RF Asia Domain Readiness v1

Цель: определить минимальную целевую доменную модель RF Asia (MVP/domain-ready), границы ответственности и реалистичный набор сущностей для следующего implementation цикла.

Stage 6.5.2 economy terminology alignment note:
Этот документ является target/domain-readiness framing и должен читаться через `docs/economy/economy_authority_terminology_crosswalk_v1.md`. Он не является runtime authority, implementation plan, schema/API change, ledger activation, reward producer activation, payout/settlement model, wallet/token/G2A/NFT/on-chain activation or Slice 16 movement. RF/voucher wording here means practical utility / consumption layer unless a separate runtime contract says otherwise.

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

- read-only economy projections / explanation UI
- badges/achievements/progression display where backed by owner services
- user-facing referral summaries
- Connect-style user overview as aggregated projection, not financial wallet or economy authority

Connect не владеет Points balances, ledger, reward decisions, referral graph, voucher lifecycle, payout/settlement or wallet/token runtime.

### Points / Referral ownership

- Points Service owns internal Points accounting where runtime-backed.
- Referral Service owns referral graph, referral metadata and participation / reward summaries.
- RF Service owns voucher lifecycle and partner business context, not Points ledger or referral/network payout logic.

### Rielt Asia отвечает за

- listing/property карточки и сценарии интереса/сделки
- точки применения RF ваучера к объекту/услуге
- UX discovery вокруг недвижимости

### Token Service (future off-chain G2A layer)

- future G2A/token projections only if separately activated
- future token accounting vocabulary, not current Points ledger or payout rail

### Blockchain Gateway / Wallet Service (future-only)

- future on-chain externalization only after separate policy, implementation and runtime approval
- future NFT/totem mint vocabulary only if separately activated
- key management and blockchain integration are not current RF runtime

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
This is target policy vocabulary only. Points, NFT/totem, VIP, PRO or referral gates do not imply current spend enforcement, NFT/on-chain activation, entitlement authority switch or payout rights.

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
PROAttribution is attribution metadata / eligibility context, not commission guarantee, income, payout, settlement authority or MLM.

Минимальные поля:
- `id`, `voucherId|redemptionId`, `proUserId`, `partnerId`, `attributionType`, `attributionWeight`, `status`

### 2.9 PartnerRewardPolicy

Назначение:
- partner-funded/platform-funded политика reward/funding
PartnerRewardPolicy is target policy metadata for internal utility / offer constraints. It must not be read as partner payout, merchant settlement, cashback, commission, or financial obligation.

Минимальные поля:
- `id`, `partnerId`, `fundingType`, `rewardMode`, `limits`, `effectiveFrom`, `effectiveTo`, `status`

### 2.10 VoucherCampaign

Назначение:
- пакетирование ваучеров и условий по периоду/сегментам

Минимальные поля:
- `id`, `partnerId`, `name`, `segment`, `budget`, `startAt`, `endAt`, `status`

### 2.11 UserVoucherState

Назначение:
- пользовательская read-model для Connect-style отображения RF ваучеров

Минимальные поля:
- `userId`, `voucherId`, `state`, `lockedReason`, `unlockProgress`, `updatedAt`

## 3) Что объединить или отложить (MVP-реалистично)

### Можно объединить на раннем этапе

- `VoucherRule` + `VoucherUnlockRequirement` как единая таблица policy с типизированным payload (до стабилизации).
- `VoucherCampaign` как optional слой (если нет multi-campaign rollout в ближайшем спринте).

### Лучше не откладывать

- `VoucherRedemption` как отдельную сущность (иначе сложно аудитировать lifecycle).
- `PartnerRewardPolicy` as target policy metadata (иначе internal utility / offer constraints останутся неявными).
- `UserVoucherState` (иначе Connect-style read projection продолжит жить только на frontend-адаптерах).

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
- Без ledger activation, reward producer activation, payout/settlement activation, wallet/token/G2A/NFT/on-chain activation or Slice 16 movement.
