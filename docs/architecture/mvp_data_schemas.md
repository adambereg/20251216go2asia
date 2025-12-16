# Схемы данных MVP Go2Asia

**Версия:** 1.0  
**Дата:** 2025-01-16  
**Автор:** Architect  
**Статус:** Draft → на ревью  
**Основа:** Архитектура MVP

---

## Принципы

1. **Упрощение для MVP:** Схемы упрощены по сравнению с полной версией
2. **Разделение по схемам:** Каждый сервис владеет своей схемой в Neon PostgreSQL
3. **Минимальные связи:** Межсервисные связи через API, не через внешние ключи
4. **Готовность к расширению:** Структура позволяет добавлять поля без breaking changes

---

## Auth Service → `auth` schema

### Таблица: `users`

```sql
CREATE SCHEMA IF NOT EXISTS auth;

CREATE TABLE auth.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_user_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'spacer' CHECK (role IN ('spacer', 'vip_spacer', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_clerk_user_id ON auth.users(clerk_user_id);
CREATE INDEX idx_users_email ON auth.users(email);
```

**Владение:** Auth Service

**Примечания:**
- `clerk_user_id` — уникальный идентификатор из Clerk
- `referral_code` НЕ хранится в этой таблице. Единственный источник истины (SSOT) — Referral Service (`referral.referral_links.code`)
- `role` — базовая роль пользователя (расширяется в post-MVP)
- Удаление пользователей НЕ поддерживается в MVP (только soft delete через поле `status` в post-MVP)

---

## Content Service → `content` schema

### Таблица: `countries`

```sql
CREATE SCHEMA IF NOT EXISTS content;

CREATE TABLE content.countries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(2) UNIQUE NOT NULL, -- ISO код (TH, VN, ID, MY, SG, PH, KH)
    name VARCHAR(255) NOT NULL,
    description TEXT,
    flag_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_countries_code ON content.countries(code);
```

### Таблица: `cities`

```sql
CREATE TABLE content.cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_id UUID NOT NULL REFERENCES content.countries(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_cities_country_id ON content.cities(country_id);
CREATE INDEX idx_cities_location ON content.cities USING GIST (point(longitude, latitude));
```

### Таблица: `places`

```sql
CREATE TABLE content.places (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city_id UUID NOT NULL REFERENCES content.cities(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('attraction', 'cafe', 'beach', 'restaurant', 'hotel', 'other')),
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_places_city_id ON content.places(city_id);
CREATE INDEX idx_places_category ON content.places(category);
CREATE INDEX idx_places_location ON content.places USING GIST (point(longitude, latitude));
```

### Таблица: `events`

```sql
CREATE TABLE content.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('festival', 'meetup', 'tour', 'concert', 'other')),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    place_id UUID REFERENCES content.places(id) ON DELETE SET NULL,
    city_id UUID NOT NULL REFERENCES content.cities(id) ON DELETE CASCADE,
    image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_events_city_id ON content.events(city_id);
CREATE INDEX idx_events_place_id ON content.events(place_id);
CREATE INDEX idx_events_start_date ON content.events(start_date);
CREATE INDEX idx_events_category ON content.events(category);
```

### Таблица: `event_registrations`

```sql
CREATE TABLE content.event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES content.events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL, -- ID из Auth Service (не FK, так как другой сервис)
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, user_id) -- Один пользователь может зарегистрироваться на событие только один раз
);

CREATE INDEX idx_event_registrations_event_id ON content.event_registrations(event_id);
CREATE INDEX idx_event_registrations_user_id ON content.event_registrations(user_id);
CREATE INDEX idx_event_registrations_registered_at ON content.event_registrations(registered_at);
```

**Примечание:** `user_id` не имеет внешнего ключа, так как таблица `users` находится в другой схеме (`auth`). Валидация существования пользователя происходит через Gateway/Clerk JWT (hard validation). Gateway извлекает `user_id` из JWT токена и передаёт в заголовке `X-User-ID`. Сервисы доверяют заголовку `X-User-ID` от Gateway.

### Таблица: `articles`

```sql
CREATE TABLE content.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL, -- Markdown или HTML
    category VARCHAR(100) NOT NULL,
    tags TEXT[], -- Массив тегов
    author_id UUID NOT NULL, -- ID из Auth Service (не FK)
    cover_image_url VARCHAR(500),
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_articles_slug ON content.articles(slug);
CREATE INDEX idx_articles_category ON content.articles(category);
CREATE INDEX idx_articles_tags ON content.articles USING GIN(tags);
CREATE INDEX idx_articles_published_at ON content.articles(published_at);
CREATE INDEX idx_articles_author_id ON content.articles(author_id);
```

**Владение:** Content Service

---

## Points Service → `points` schema

### Таблица: `points_transactions`

```sql
CREATE SCHEMA IF NOT EXISTS points;

CREATE TABLE points.points_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id VARCHAR(255) UNIQUE, -- Идемпотентный ID от вызывающего сервиса
    user_id UUID NOT NULL, -- ID из Auth Service (не FK)
    type VARCHAR(20) NOT NULL CHECK (type IN ('credit', 'debit')),
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    reason VARCHAR(100) NOT NULL, -- 'registration', 'referral', 'event_registration', 'first_login', 'referral_bonus'
    source_service VARCHAR(50) NOT NULL, -- 'auth_service', 'referral_service', 'content_service'
    source_event_id VARCHAR(255), -- ID события в исходном сервисе
    metadata JSONB, -- Дополнительные данные
    status VARCHAR(20) NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_points_transactions_user_id ON points.points_transactions(user_id);
CREATE INDEX idx_points_transactions_external_id ON points.points_transactions(external_id);
CREATE INDEX idx_points_transactions_created_at ON points.points_transactions(created_at);
CREATE INDEX idx_points_transactions_reason ON points.points_transactions(reason);
CREATE INDEX idx_points_transactions_source_service ON points.points_transactions(source_service);
```

### Таблица: `user_balances`

```sql
CREATE TABLE points.user_balances (
    user_id UUID PRIMARY KEY, -- ID из Auth Service (не FK)
    balance NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (balance >= 0),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_balances_balance ON points.user_balances(balance);
```

**Примечание:** Баланс можно вычислить как сумму транзакций типа `credit` минус сумма транзакций типа `debit`, но для производительности используется агрегированная таблица.

**Примечание:** `user_id` не имеет внешнего ключа. Валидация существования пользователя происходит через Gateway/Clerk JWT (hard validation). Удаление пользователей НЕ поддерживается в MVP.

### Таблица: `user_badges`

```sql
CREATE TABLE points.user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- ID из Auth Service (не FK)
    badge_type VARCHAR(50) NOT NULL, -- 'first_login', 'event_registration', 'referral_master', 'points_collector'
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, badge_type) -- Один пользователь может получить бейдж каждого типа только один раз
);

CREATE INDEX idx_user_badges_user_id ON points.user_badges(user_id);
CREATE INDEX idx_user_badges_badge_type ON points.user_badges(badge_type);
```

**Владение:** Points Service

**Примечание:** Бейджи являются виртуальными достижениями (UI-индикаторы) и не имеют экономической или блокчейн-логики.

---

## Referral Service → `referral` schema

### Таблица: `referral_links`

```sql
CREATE SCHEMA IF NOT EXISTS referral;

CREATE TABLE referral.referral_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- ID из Auth Service (не FK)
    code VARCHAR(50) UNIQUE NOT NULL, -- Реферальный код
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_referral_links_user_id ON referral.referral_links(user_id);
CREATE INDEX idx_referral_links_code ON referral.referral_links(code);
```

### Таблица: `referral_relations`

```sql
CREATE TABLE referral.referral_relations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_user_id UUID NOT NULL, -- ID реферера из Auth Service (не FK)
    referred_user_id UUID NOT NULL, -- ID реферала из Auth Service (не FK)
    referral_link_id UUID REFERENCES referral.referral_links(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(referred_user_id) -- Один пользователь может быть приглашён только один раз
);

CREATE INDEX idx_referral_relations_referrer_user_id ON referral.referral_relations(referrer_user_id);
CREATE INDEX idx_referral_relations_referred_user_id ON referral.referral_relations(referred_user_id);
CREATE INDEX idx_referral_relations_referral_link_id ON referral.referral_relations(referral_link_id);
```

**Владение:** Referral Service

**Примечания:**
- `code` — единственный источник истины (SSOT) для referral_code пользователя
- `user_id` не имеет внешнего ключа. Валидация существования пользователя происходит через Gateway/Clerk JWT (hard validation)
- Многоуровневая реферальная система (2+ уровня) не реализована в MVP. Для вычисления субрефералов можно использовать рекурсивные запросы по `referral_relations`, но это отложено на post-MVP
- Удаление пользователей НЕ поддерживается в MVP

---

## Миграции

### Структура миграций

```
services/auth-service/
├── migrations/
│   ├── 001_create_auth_schema.sql
│   └── 002_create_users_table.sql
services/content-service/
├── migrations/
│   ├── 001_create_content_schema.sql
│   ├── 002_create_countries_table.sql
│   ├── 003_create_cities_table.sql
│   ├── 004_create_places_table.sql
│   ├── 005_create_events_table.sql
│   ├── 006_create_event_registrations_table.sql
│   └── 007_create_articles_table.sql
services/points-service/
├── migrations/
│   ├── 001_create_points_schema.sql
│   ├── 002_create_points_transactions_table.sql
│   ├── 003_create_user_balances_table.sql
│   └── 004_create_user_badges_table.sql
services/referral-service/
├── migrations/
│   ├── 001_create_referral_schema.sql
│   ├── 002_create_referral_links_table.sql
│   └── 003_create_referral_relations_table.sql
```

### Правила миграций

1. **Версионирование:** Каждая миграция имеет порядковый номер
2. **Обратимость:** Все миграции должны быть обратимыми (DOWN миграции)
3. **Идемпотентность:** Миграции можно запускать многократно без ошибок
4. **Коммит в репо:** SQL файлы коммитятся в репозиторий (см. ENGINEERING_PLAYBOOK.md)

---

## Seed данные

### Требования к seed данным (из ТЗ)

**Atlas:**
- 7 стран (TH, VN, ID, MY, SG, PH, KH)
- 10–15 городов (по 2–3 города на страну)
- 30–50 мест (достопримечательности, кафе, пляжи)

**Pulse:**
- 10–15 событий на ближайшие 30 дней
- Разнообразие категорий

**Blog:**
- 10 статей на различные темы

### Расположение seed данных

```
services/content-service/
└── seeds/
    ├── 001_countries.sql
    ├── 002_cities.sql
    ├── 003_places.sql
    ├── 004_events.sql
    └── 005_articles.sql
```

### Формат seed данных

- UTF-8 кодировка (обязательно)
- Идемпотентность (можно запускать многократно)
- Использование `INSERT ... ON CONFLICT DO NOTHING` для идемпотентности

### Процесс загрузки seed данных

**Когда загружаются:**
- После выполнения всех миграций БД
- Вручную через команду `pnpm seed` (для разработки)
- Автоматически при первом деплое на staging/production (опционально)

**Команда для загрузки:**
```bash
# Загрузка seed данных
pnpm --filter content-service seed

# Или через Drizzle Kit
pnpm drizzle-kit seed
```

**Проверка кодировки:**
- Проверка UTF-8 выполняется в CI (см. ENGINEERING_PLAYBOOK.md)
- Ошибки кодировки блокируют деплой

---

## Deliverables

- ✅ Схемы данных для всех сервисов MVP созданы
- ✅ Структура миграций определена
- ✅ Требования к seed данным описаны

## Open Questions

Нет открытых вопросов. Все схемы данных соответствуют требованиям ТЗ MVP.

## Next

Схемы данных готовы к использованию при реализации сервисов. Детальные модели данных будут описаны в документации каждого сервиса.

