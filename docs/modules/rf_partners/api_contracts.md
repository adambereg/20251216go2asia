# Russian Friendly Asia — API Contracts

Base URL: `/api/rf`

---

## Roles / Access (концептуально)

- **Public**: просмотр партнёров/ваучеров (read), агрегаты.
- **VIP Spacer**: получение/покупка ваучеров, участие в RF‑квестах, social‑сигналы (репост в Space).
- **Business Partner**: управление профилем и ваучерами, просмотр статистики, подтверждение погашений.
- **PRO Spacer**: онбординг/верификация партнёров, закрепление партнёров, кураторские отчёты, доступ к PRO dashboard.
- **Admin**: модерация/управление правилами и спорными ситуациями.

Важно: RF **не предоставляет inline‑комментарии “под партнёром/ваучером”**. Обсуждение и UGC идут через Space (репосты/посты/реакции).

---

## PARTNERS

### GET /partners
Список партнёров с фильтрами  
Query:
- city
- category
- rf_only
- pro_verified
- q (search)

Response:
{
  partners: Partner[]
}

---

### GET /partners/:id
Детали заведения.

Response:
{
  partner: Partner,
  vouchers: Voucher[],
  // reviews/ugc: ссылки на UGC из Space (посты/реакции), а не inline comments
  ugc: {
    rating: number,
    reviews_count: number,
    recent_posts?: Array<{ post_id: string, url: string }>
  }
}

---

### POST /partners (PRO only)
Создание партнёра.

Body: PartnerCreatePayload

---

### PATCH /partners/:id (Partner owner or PRO)
Обновление профиля.

---

### POST /partners/:id/share (VIP/PRO)
Создать репост партнёра в Space (social-first обсуждение).

Body:
- text?: string

Response:
- space_post_id

---

## VOUCHERS

### GET /vouchers
Список всех ваучеров.

### GET /vouchers/:id
Детали ваучера.

### POST /vouchers (Partner)
Создание.

### PATCH /vouchers/:id
Обновление.

---

### POST /vouchers/:id/claim (VIP/authorized)
Получить/купить ваучер (резервирование у пользователя).

Body:
- accept_terms: boolean

Response:
{
  claim_id,
  status,
  price_points_charged
}

### POST /vouchers/:id/redeem
Погашение ваучера (ввод кода).

Body:
- code: string

---

## REVIEWS

RF не хранит собственные inline‑отзывы как “комментарии под карточкой”.
Отзывы/рейтинги/короткие обзоры реализуются через Space/Reactions и агрегируются в RF.

### GET /partners/:id/social
Агрегированные social‑сигналы и ссылки на UGC (Space).

---

## PRO DASHBOARD

### GET /pro/dashboard
Карточка эффективности PRO.

Returns:
{
  partners_count,
  month_checks,
  month_onboardings,
  reward_points,
  reward_g2a
}

---

### GET /pro/partners
Список партнёров, закреплённых за PRO.

---

### GET /pro/onboarding
Заявки на онбординг.

---

### POST /pro/onboarding/:id/approve
---

### POST /pro/onboarding/:id/reject
---

### POST /pro/verify/:id
Проверка бизнеса.

---

## REWARDS

### GET /pro/rewards
История транзакций.

---

## INTEGRATION EVENTS (Points сейчас)

RF публикует события/факты для reward‑движка (Points/Connect) и Quest:

- `partner.verified`
- `voucher.claimed`
- `voucher.redeemed`
- `rf.social.repost`

Начисление Points выполняется отдельным reward‑сервисом по правилам (RF не является “кассой”).

