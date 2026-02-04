# Referral Service — Search & Filtering

> **Статус документа**: **REQUIREMENTS / DESIRED BEHAVIOR**  
> Этот документ описывает целевое поведение поиска и фильтрации. **Реализация в коде может отсутствовать** (полностью или частично).  
> См. также: `docs/decisions/search_strategy.md`, `docs/standards/search_conventions_v1.md`.

## Пользовательская статистика

`GET /my/stats` — агрегированная информация по всем активным кампаниям для конкретного пользователя.  
Сложные фильтры для пользователского уровня не нужны.

---

## Admin / Reports

### Список кампаний

`GET /admin/campaigns` — фильтры:

- `status` (`active`, `paused`, `archived`),
- `campaign_type`.

### Отчёты по пользователям

`GET /admin/reports/users` — фильтры:

- `campaign_id`,
- `from`, `to` (диапазон дат по `occurred_at` ReferralEvent),
- `min_points_earned`,
- `min_referred`.

---

## Индексация

Рекомендуемые индексы:

- `ReferralEvent`:
  - по `campaign_id`, `referrer_user_id`, `referred_user_id`, `business_partner_id`,
  - по `event_type`, `occurred_at`.

- `ReferralReward`:
  - по `beneficiary_user_id`, `status`.

- `ReferralRelation`:
  - по `referred_user_id` (поиск "кто меня пригласил"),
  - по `referrer_user_id` (список моих рефералов).
