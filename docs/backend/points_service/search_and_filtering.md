# Points Service — Search & Filtering

> **Статус документа**: **REQUIREMENTS / DESIRED BEHAVIOR**  
> Этот документ описывает целевое поведение поиска и фильтрации. **Реализация в коде может отсутствовать** (полностью или частично).  
> См. также: `docs/decisions/search_strategy.md`, `docs/standards/search_conventions_v1.md`.

Поиск и фильтрация в Points Service используется для:

- админ-панели,
- аналитики,
- отладки интеграций.

## 1. Поиск транзакций

Endpoint: `GET /internal/transactions`

Фильтры:

- `user_id` — основной фильтр;
- `type` — `credit`, `debit`, `hold`, `release`;
- `source_service` — `connect_service`, `quest_service`, `rielt_service`, `voucher_service`, ...;
- `reason` — бизнес-категории (`quest.purchase`, `quest.reward`, `voucher.premium_purchase`, `referral.reward_level1`, ...);
- `date_from`, `date_to` — интервал по `created_at`;
- `status` — `pending`, `completed`, `failed`;
- `page`, `page_size`.

Примеры:

- найти все награды, выданные через Connect за период;
- проверить все списания, инициированные Quest Service;
- посмотреть историю по конкретному пользователю, если он спорит по балансу.

---

## 2. Отчёты и агрегаты

На основе `PointsTransaction` можно строить:

- суммарный объём начислений по типам операций (quests, vouchers, referrals),
- суммарный объём списаний (квесты, ваучеры, бронирования),
- net-change баланса по дням/неделям/месяцам.

Эти отчёты реализуются поверх БД Points Service или отдельного Data Warehouse.
