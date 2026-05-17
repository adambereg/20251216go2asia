# Russian Friendly Asia — Data Model

> Примечание: RF — multi-sided модуль. “Каталог” — лишь пользовательская проекция.  
> Социальные сигналы и обсуждения реализуются через Space (репосты/реакции/UGC‑посты).  
> Stage 6.5.3: user-facing RF semantics are voucher utility and internal Points recognition where runtime-backed. G2A/NFT, payout, cashback, settlement, wallet and token semantics are future-only / out of current implementation.

## Partner (Заведение)
- id: UUID
- name: string
- description: text
- category: enum (cafe, restaurant, shop, coworking, service, hotel, other)
- tags: string[]
- city_id: FK → Atlas.city
- address: string
- geo: { lat, lng }
- phone: string
- email: string
- telegram: string
- website: string
- opening_hours: JSON
- cover_image: URL
- gallery: URL[]
- rating: float (агрегат по social-сигналам/реакциям)
- reviews_count: number (агрегат, источник — UGC в Space/Reactions)
- rf_status: boolean (дружественный русским)
- pro_verified: boolean
- pro_verified_date: date
- created_by_pro_id: FK → PRO.id
- created_at, updated_at

---

## PartnerCuratorship (Связь партнёра с PRO-куратором)
- id: UUID
- partner_id: FK → Partner
- pro_id: FK → PRO.id
- role: enum (lead, assistant)
- status: enum (active, paused)
- assigned_at
- created_at

---

## Voucher
- id: UUID
- partner_id: FK → Partner
- title: string
- description: text
- type: enum (discount, gift, bonus, access, perk)
- value: number | string
- conditions: text
- price_points: number (internal Points utility requirement, not money/payment)
- price_g2a: number (будущее; не используется в текущей реализации)
- limit: number
- redeemed: number
- valid_from: date
- valid_to: date
- is_active: boolean
- audience: enum (all, vip_only, pro_only) | null
- external_claim_code?: string | null (код/QR для выдачи/погашения)
- created_at, updated_at

---

## RF Social Signal (источник правды — Space/Reactions)

RF не хранит “inline comments под партнёром”. Вместо этого RF привязывает и агрегирует социальные сигналы:

- `repost` партнёра/ваучера (Space post type=`repost`, `target_type=partner|voucher`, `target_id`)
- `rating` / `short_review` / `feedback` как реакции (Reactions Service)
- UGC‑посты “отзыв” в Space, привязанные к `partner_id` (через метаданные/target link)

На UI RF может отображать:
- агрегированный рейтинг/счётчики,
- список последних UGC‑отзывов (как ссылки на посты Space),
- CTA “Поделиться” → создать репост в Space.

---

## PRO Supervisor
- id
- user_id
- level: enum (junior, middle, senior)
- internal_points_summary
- g2a_future_projection (будущее; not current token balance or payout)

---

## Business Onboarding Request
- id
- business_name
- contact_name
- contact_email
- contact_phone
- category
- city_id
- created_by_pro
- status: enum (new, approved, rejected)
- created_at

---

## VoucherClaim (получение / резервирование voucher utility пользователем)
- id: UUID
- voucher_id: FK → Voucher
- user_id: FK → Space.user
- claimed_at
- price_points_charged: number
- status: enum (claimed, cancelled, expired, redeemed)

---

## VoucherRedemption (факт использования ваучера)
- id: UUID
- claim_id: FK → VoucherClaim
- partner_id: FK → Partner
- redeemed_at
- proof: enum (code, qr, manual) | null
- metadata: JSON | null

---

## PRO Internal Recognition Entry
- id
- pro_id
- type: enum (onboarding, verification, activation, voucher_claimed, voucher_redeemed, quest_driven_visit, social_repost)
- amount_points
- amount_g2a_future (future-only; not current payout/token balance)
- partner_id
- created_at

---

## RF → Attribution / Internal Reward Events (Points сейчас)

RF генерирует события/факты, которые используются Points/Connect and Quest only where policy/runtime-backed:

- `partner.onboarded` / `partner.verified` (PRO‑куратор)
- `voucher.claimed` / `voucher.redeemed` (VIP/пользователь + бизнес)
- `rf.social.repost` (репост партнёра/оффера в Space)

Сами начисления Points не являются обязанностью RF‑модуля: RF публикует события/факты, а Points/reward service applies internal rules. This is not cashback, settlement, payout, or partner remittance.
