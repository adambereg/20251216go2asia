# User Service — Search & Filtering

> **Статус документа**: **REQUIREMENTS / DESIRED BEHAVIOR**  
> Этот документ описывает целевое поведение поиска и фильтрации. **Реализация в коде может отсутствовать** (полностью или частично).  
> См. также: `docs/decisions/search_strategy.md`, `docs/standards/search_conventions_v1.md`.

## Цели поиска

- Поиск пользователей в Space (добавление в друзья, поиск PRO).
- Поиск PRO-гидов по городу/стране (дополнительно к Guru).
- Админ-поиск пользователей по email/ролям/статусам.

---

## Публичный поиск

### `/api/user/v1/users/search`

Фильтры:

- `q` — строка (поиск по `display_name`, `username`).
- `role` — `pro`, `vip`, `user`.
- `country_id`, `city_id`.
- `is_guru` — bool — только PRO с `visible_in_guru = true`.
- Пагинация: `page`, `page_size`.

Ограничения:

- Учитываем `show_in_search`.
- Не показываем email и чувствительные поля.

---

## Админ-поиск

### `/api/user/v1/admin/users`

Фильтры:

- `email` (exact / prefix),
- `primary_role`,
- `status`,
- `created_from / created_to`.

---

## Индексация

Рекомендуется:

- индексы по:
  - `email`,
  - `username`,
  - `(primary_role, visible_in_guru)`,
  - `current_city_id`.

В будущем, при росте:

- можно вынести поиск в отдельный Search Service (Meilisearch/OpenSearch) и индексировать:
  - `display_name`,
  - `username`,
  - интересы/специализации.
