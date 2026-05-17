# Space Asia — API Contracts

> **Legacy/historical document (not runtime API SSOT).**  
> This file describes earlier module-level API ideas and must not be treated as the current backend contract.  
> Current runtime API contour is gateway-first and split by service namespaces (notably `/v1/space/*` and `/v1/reactions/*`).
> Stage 6.5.3 reading guard: Space API notes do not activate wallet, G2A, NFT/on-chain, payout, referral-income, or token behavior. Economy-related surfaces should be Connect-owned read-only projections where runtime-backed.

Base URL:
/api/space

---

# 1. Feed

## GET /feed
Параметры:
- tab: my | liked | friends | all
- page

Ответ:
{
  "items": [
    {
      "post": {...},
      "reason": "liked"
    }
  ]
}

---

# 2. Posts

## POST /posts
{
  "type": "text",
  "text": "Привет, Бангкок!",
  "visibility": "public"
}

Ответ:
{ "post_id": "uuid" }

---

## GET /posts/{id}
Вернуть пост + комментарии.

---

## PATCH /posts/{id}
Редактирование.

---

## DELETE /posts/{id}

---

## POST /posts/{id}/repost

---

# 3. Reactions

## POST /posts/{id}/react
{
  "type": "like"
}

---

# 4. Comments

## POST /posts/{id}/comments
{
  "text": "Отличная заметка!"
}

---

# 5. Achievements

## GET /achievements

---

# 6. Badges / Future NFT Compatibility

## GET /badges
Получить off-chain badges пользователя. NFT/on-chain remains future-only unless separately activated.

---

# 7. Vouchers (RF Integration)

## GET /vouchers

---

# 8. Referral system

## GET /referrals
## POST /referrals/invite

---

# 9. User Dashboard

## GET /dashboard
Возвращает:
- уровень
- прогресс
- активности
- рекомендации
- недельные достижения
- быстрые действия

---

# 10. Notifications

## GET /notifications
