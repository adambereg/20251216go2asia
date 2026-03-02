# UGC Publishing Platform v1 — единый подход к публикации сущностей (Places / Events / Quests / Listings и др.)

Статус: **архитектурный принцип / направление для Фазы 2–3**  
Дата: 2026-02-19  
Владелец решения: Go2Asia (архитектура платформы)

## Контекст и мотивация

Сейчас контентные модули (Atlas/Pulse/Blog) читают данные из **Neon** через **API Gateway → content-service** и могут иметь fallback на mocks при ошибке API. Это подтверждено текущим data-flow и фактическим inventory сервисов (Pulse как отдельный сервис пока *слит* в content-service). fileciteturn0file1 fileciteturn0file0

На горизонте Фазы 2–3 Go2Asia переходит от «редакционного наполнения» к **UGC-платформе**:
- **Places** и **Events** создаются не только редакцией, но и **PRO-спейсерами** и **бизнес‑партнёрами** (через PRO).
- Аналогично будут создаваться **Quests**, **Real Estate Listings**, **RF-партнёрские объекты**, и другие доменные сущности.
- Для масштабирования и консистентности нам нужен **единый жизненный цикл публикации** и единый подход к ownership/moderation/media — иначе каждый домен вырастет «по‑своему» и появится техдолг, конфликт терминов и дублирование логики.

## Цель документа

Зафиксировать архитектурный принцип:  
> **В Go2Asia все “публикуемые сущности” (Place/Event/Quest/Listing/Partner и т.д.) должны проходить единый publishing workflow и иметь единый слой ownership/moderation/visibility/media, независимо от доменной специфики.**

Это решение должно быть известно Cursor и учитываться при проектировании доменной CMS/контентной платформы в Фазе 2–3.

---

## Термины

**Publishable Entity (Публикуемая сущность)** — любой объект, который:
- имеет карточку/детальную страницу;
- может создаваться/редактироваться человеком (редакция/PRO/партнёр);
- имеет статус и видимость;
- содержит медиа и текстовые блоки;
- может участвовать в реакциях, квестах, токеномике, поиске, гео‑слоях.

Примеры: Place, Event, Quest, Listing (жильё), PartnerOffer, BlogArticle (в будущем — частично), Route, Service и т.д.

---

## Ключевые принципы

1. **Единый жизненный цикл (workflow), а не одинаковые поля**  
   Place и Event не обязаны иметь одинаковую доменную структуру, но обязаны проходить одинаковые стадии: draft → moderation → published → archived.

2. **Ownership и источник контента — платформенная компетенция**  
   Кто создал, от имени кого опубликовано, кому принадлежит — это не “деталь домена”, а основа UGC.

3. **Moderation — единообразная и расширяемая**  
   Любая сущность может быть: user-submitted, partner-submitted, editor-approved, verified.

4. **Media единообразно (R2) + metadata в БД**  
   Файлы — в Object Storage (R2), в БД — только метаданные и публичные URL/ключи.

5. **Публичный Read API отделён от Write/Moderation API**  
   Публичное чтение должно оставаться простым и быстрым; создание/редактирование/модерация — отдельный контур, защищённый ролями.

6. **Проекции/индексация (Search, Geo Layer) строятся из SSOT**  
   SSOT — доменные таблицы (places/events/...) + publishing мета‑слой. Поисковые и гео‑проекции могут быть производными.

---

## Архитектурный паттерн: Publishing Layer + Domain Tables

### 1) Publishing Core (платформенный слой)

Рекомендуемая модель: **core_entities** (или publishables) как слой метаданных публикации.

Минимальный состав (концептуально):

- `entity_id` (UUID / ULID)
- `entity_type` (place | event | quest | listing | ...)
- `created_by_user_id`
- `owner_user_id` (если отличается)
- `owner_org_id` (если объект принадлежит бизнес‑партнёру/организации)
- `source_type` (editorial | pro | partner | ugc)
- `status` (draft | in_review | approved | rejected | published | archived)
- `visibility` (private | unlisted | public)
- `verification_status` (none | verified)
- `published_at`, `archived_at`
- `slug` (глобально уникальный в рамках типа или в рамках сайта)
- `language` (ru/en/…)
- `created_at`, `updated_at`
- `moderation_meta` (who/when/why)
- `version` (для будущей версионности)

Важно: **core_entities не заменяет доменные таблицы** — он задаёт “сквозные” правила и аудит.

### 2) Domain Tables (владельцы данных)

Каждый домен хранит собственные поля:

- `places` (geo, category, tags, address, …)
- `events` (start/end, registration, capacity, …)
- `quests` (steps, rewards, …)
- `listings` (price, availability, rules, …)

Связь: `places.entity_id → core_entities.entity_id` (1:1)

### 3) Content Blocks (опционально, для rich‑контента)

Унифицировать “богатый контент” (описания, секции, списки, FAQ) через общую модель блоков:

- `content_blocks`:
  - `entity_id`
  - `block_type` (markdown | bullets | faq | gallery | …)
  - `order`
  - `payload` (json)
  - `language`

Это позволит: Places/Events/Quests иметь одинаковый движок рендеринга контента.

---

## Единый publishing workflow (MVP-версия)

### Статусы
- **draft** — создано, видно автору/владельцу
- **in_review** — отправлено на модерацию
- **approved** — одобрено модератором (ещё не обязательно опубликовано)
- **published** — публично доступно
- **rejected** — отклонено (с причиной)
- **archived** — снято с публикации (история сохраняется)

### Роли и права
- **Spacer**: может создавать ограниченный набор UGC (в будущем — опционально), чаще через предложения.
- **PRO**: создаёт Places/Events/Quests/… в своей консоли, отправляет на модерацию, редактирует свои.
- **Business Partner**: создаёт/ведёт свои объекты через Business Console, но может требовать связки с PRO (куратор).
- **Editor/Moderator**: утверждает/отклоняет, может править редакционно.
- **Admin**: экстренные операции, баны, откаты, аудит.

### Канал публикации
- PRO / Partner создаёт **draft** → заполняет данные/медиа → отправляет **in_review** → модератор утверждает **approved** → публикация **published** (возможно scheduled).

---

## Единые интерфейсы управления (Фаза 2–3)

1) **PRO Console**
- создание/редактирование Place/Event/Quest/Listing
- привязка к Atlas (страна/город/место), Geo, медиа
- отправка на модерацию
- статистика (просмотры, реакции, регистрации)

2) **Business Console**
- управление профилем партнёра и его объектами
- офферы/ваучеры, анонсы событий, промо
- доступ может быть через PRO-куратора или самостоятельный (политика определяется продуктом)

3) **Admin Console (Domain CMS внутри Go2Asia)**
- очереди модерации по типам сущностей
- инструменты верификации
- правки/мердж дублей
- антифрод/аудит

(Концепции интерфейсов уже описаны в отдельных доках; этот документ фиксирует единый сквозной publishing подход.)

---

## Реакции, обсуждения и UGC-обогащение

Go2Asia придерживается **social-first** модели (без inline-комментариев под объектами): обсуждение идёт через Space (репосты/реакции/треды).

Следствие для publishable entities:
- Любая сущность должна быть “targetable” для Reactions Service: `target_type + target_id(entity_id)`.
- Отзывы/рейтинги/вопросы/контакт‑запросы — это реакции, а не комментарии “внутри” Event/Place/Listing.

---

## Media: единая политика хранения

- **Файлы**: R2 (или другой object storage)
- **Метаданные**: таблица `media_files` (url/key, mime, size, owner, created_at)
- **Привязка**: через `image_media_id` / `gallery_media_ids` или через отдельную `entity_media` (M:N), где нужно.

---

## Поиск и Geo Layer

Из SSOT (domain tables + publishing layer) строятся:
- Search index (FTS/Meilisearch/…)
- Geo projections/tiles (Geo Layer / Geo Service)
- “Nearby” выдачи для Guru

Принцип: **индексация — производная**, а не основной источник данных.

---

## План внедрения (предложение)

### Фаза 1 (текущее состояние)
- Read-only контентный слой работает через content-service.
- Events/Places живут как таблицы, часть данных сидится.

### Фаза 2 — “UGC Foundation” (рекомендуемая цель)
- Ввести **Publishing Layer v1** (core_entities + базовые статусы/ownership).
- Добавить `entity_id`/связь в places/events (и далее).
- Ввести Write API для PRO/Partner (закрыто ролями).
- Ввести Admin queues (минимально).

### Фаза 3 — “Domain CMS внутри экосистемы”
- Версионность, scheduled publish, аудит изменений.
- Полноценные инструменты модерации/верификации, anti-fraud.
- Общие content blocks и редактор.
- Расширение на Quests/Listings/Partner objects и др.

---

## Решение (фиксируем как правило)

1. **Да, система публикации Places и Events должна быть однотипной.**  
2. В Фазе 2–3 мы строим **единый publishing workflow** для всех publishable entities.  
3. Доменная CMS Go2Asia должна управлять **всеми сущностями** через общий слой ownership/moderation/visibility/media, а доменные таблицы остаются владельцами специфичных данных.  
4. Текущее состояние (Pulse внутри content-service) не мешает — наоборот, позволяет внедрить publishing слой без конфликтов сервисных границ.

---

## Ссылки на текущую фактическую реализацию (для ориентира)

- Data flow контентных модулей (Atlas/Pulse/Blog) через gateway/content-service/Neon + fallback на mocks. fileciteturn0file1
- Service inventory: фактические сервисы в repo и то, что Pulse слит в content-service. fileciteturn0file0
