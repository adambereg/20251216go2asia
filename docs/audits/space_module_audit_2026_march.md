# Space Module Audit — March 2026

Цель аудита: проверить `Space Asia` и смежный контур после завершения `Step 3 (media-service)`, чтобы перед `Step 4 (space-service)` убрать legacy-моки, старые API-контракты и frontend-предположения, которые конфликтуют с архитектурой Phase 2.

---

## 1 Current frontend surfaces

### 1.1 Реальные маршруты `Space` в PWA shell

Найденные страницы:

- `/space` -> `SpacePageClient` (динамическая страница, рендерит Dashboard на mock-данных)
- `/space/community/feed` -> `CommunityFeedPageClient` (динамическая страница, рендерит Feed на mock-данных)
- `/space/community`, `/space/posts`, `/space/quests`, `/space/vouchers`, `/space/balance`, `/space/nft`, `/space/referrals`, `/space/settings` -> статические заглушки "Раздел в разработке"

Вывод: только 2 surface реально интерактивны; остальные маршруты пока placeholder-страницы.

### 1.2 Компонентный слой `components/space`

Есть полноценные компоненты:

- `Dashboard`, `Feed`, `Posts`, `Quests`, `Vouchers`, `Balance`, `NFT`, `Referrals`, `Settings`
- `Shared/SpaceNav` с навигацией на все вышеуказанные маршруты

Но фактическое подключение к страницам частичное: большая часть rich-view компонентов не смонтирована в route-страницах, где сейчас заглушки.

### 1.3 Data access слой для Space

- Нет отдельного `services/space` в `apps/go2asia-pwa-shell`
- Нет `hooks` для Space API
- Нет route handlers `app/api/**/route.ts` под Space
- Нет вызовов `fetch`/SDK к `/v1/space/*` в Space UI

Вывод: текущий Space frontend живет без backend-контракта и без data client слоя.

---

## 2 Existing mock flows

### 2.1 Главный mock-источник

`components/space/mockData.ts` содержит крупный mock-контур:

- пользователи, посты, группы, DM, уведомления
- dashboard stats, активности, goals
- quests/vouchers/nft/transactions/drafts

### 2.2 Где mock используется напрямую

Прямой импорт mock-данных обнаружен в:

- `app/(public)/space/SpacePageClient.tsx`
- `app/(public)/space/community/feed/CommunityFeedPageClient.tsx`
- `components/space/Posts/PostsView.tsx`
- `components/space/Balance/BalanceView.tsx`
- `components/space/NFT/NFTView.tsx`
- `components/space/Quests/QuestsView.tsx`
- `components/space/Vouchers/VouchersView.tsx`
- `components/space/Referrals/ReferralsView.tsx`

Дополнительно: `components/space/index.ts` экспортирует `mockData` публично, что упрощает случайное распространение mock-зависимости.

### 2.3 Временный state management в UI

В `space` UI есть локальные временные состояния вместо серверного цикла:

- `FeedView`: `localPosts` + клиентское создание поста (`Date.now()`, in-memory only)
- `PostCard`: локальные `isLiked/isSaved/likesCount` без server sync
- `PostComposer`: локальная отправка через callback, без API
- `SettingsView`: чисто локальные toggle/выборы

### 2.4 Дополнительные mock-артефакты рядом

В `apps/go2asia-pwa-shell/mocks/posts.ts` и `mocks/repo.ts` есть отдельный mock-контур для blog/pulse/atlas (не Space API, но имя `mockPosts` может путать контексты при интеграции).

---

## 3 Existing API routes

### 3.1 `/api/space`, `/api/posts`, `/api/feed`

По коду:

- Реализаций endpoint-ов `/api/space`, `/api/posts`, `/api/feed` не найдено
- Next.js API route handlers (`app/api/**/route.ts`) отсутствуют
- frontend не вызывает эти пути

По документации:

- `docs/modules/space/api_contracts.md` использует legacy base URL `/api/space` и endpoint-ы `/feed`, `/posts`, `/posts/{id}/repost` и т.д.
- Этот контракт не подтвержден реализацией и конфликтует с текущим gateway-first префиксом `/v1/space/*`

### 3.2 Gateway `/v1/space/*`

В `apps/api-gateway/src/index.ts`:

- префикс `/v1/space/*` уже зарезервирован
- пока `SPACE_SERVICE_URL` не задан, gateway возвращает `501 ROUTE_RESERVED_NOT_ENABLED`
- при заданном `SPACE_SERVICE_URL` запросы проксируются как есть

В `apps/api-gateway/test/request.test.ts` это явно покрыто тестами (501 без сервиса, proxy после конфигурации).

### 3.3 Legacy workers/proxy/mock services

- `apps/space-service` отсутствует (service еще не поднят)
- отдельного mock worker под `/v1/space/*` не найдено
- legacy proxy для Space, аналогичный media fallback, не обнаружен

Вывод: gateway готов по префиксу, но Space API пока не существует.

---

## 4 Data model remnants

### 4.1 Frontend model (`components/space/types.ts`)

Ключевая сущность `Post` в UI сейчас:

- `PostType`: `text | media | poll | place-report | event-report | quest-report | guide`
- `PostPrivacy`: `private | friends | group | public`
- вложенные rich-структуры `attachments` (place/event/quest/guide/housing), poll, media и т.д.

### 4.2 Legacy Space docs model (`docs/modules/space/data_model.md`)

Есть отдельная модель `Post` + `FeedItem`:

- `Post.type`: `text | photo | gallery | poll | repost | guide | event | place | quest_progress`
- `visibility`: `public | friends | private`
- `FeedItem.reason`: `my_post | liked | friend_post | system_recommend | quest_completed | voucher_purchase`

Также в doc присутствует role-модель user (`traveler | expat | pro | business`), которая расходится с frontend (`spacer | vip | pro`).

### 4.3 Phase 2 target model (архитектурный SSOT)

`docs/architecture/phase2_architecture.md` фиксирует:

- базовая сущность `space_post`
- `post_type`: `post | repost | system`
- `visibility`: `public | followers | group | private`
- отдельные repost target types (`blog_post | place | event | partner | listing | quest`)
- feed API через `/v1/space/feed/*`

### 4.4 Связанный media контракт

В media-контуре уже зафиксированы owner types, включая `space_post`:

- `packages/db/src/schema/media.ts`
- `packages/db/migrations/0014_media_usage_attach_v1.sql`
- generated types (`attachMediaUsageRequestOwnerType`)

Вывод: media уже частично подготовлен к Space-домену, но сам Space schema/contract еще не реализован.

### 4.5 Дубликаты/расхождения по именам

- `Post` используется в разных смыслах (Space UI, Blog DTO, legacy docs)
- `SpacePost` встречается в docs (`docs/modules/blog/data_model.md`) как концепт, но нет канонического runtime-типа/DTO
- `FeedItem` есть только в legacy docs, нет runtime-контракта/типа в API/SDK
- `UserPost` по коду не найден как закрепленный доменный тип

---

## 5 Conflicts with Step 4 architecture

Ниже список прямых конфликтов с целевым `Step 4 (space-service)`:

1. **API namespace mismatch**  
   Legacy docs опираются на `/api/space`, тогда как целевой gateway-контракт Phase 2 — `/v1/space/*`.

2. **Post type mismatch**  
   UI и старые docs используют расширенные типы (`text/poll/place-report/...`), но Step 4 требует базовый `post | repost | system`.

3. **Visibility mismatch**  
   В текущих моделях есть `friends`, но в Step 4 — `followers`.

4. **Feed contract mismatch**  
   Legacy feed описан как `GET /feed` внутри `/api/space`; целевой контракт — `GET /v1/space/feed/home|group|profile|activity`.

5. **Frontend assumptions выходят за scope Step 4**  
   Текущий Space UI включает balance/nft/vouchers/referrals/quests как часть Space surface, тогда как Step 4 фокусируется на social core (posts/reposts/groups/profile projections), а не на полном "кабинете экосистемы".

6. **Mock-first frontend, backend-free integration**  
   Space UI сейчас полностью mock-driven, без SDK/API слоя, что противоречит backend-first принципу текущего плана.

7. **No canonical Space schema in DB/OpenAPI yet**  
   Нет `schema/space.ts` и нет опубликованных `/v1/space/*` endpoint-ов в OpenAPI/SDK runtime helpers.

---

## 6 Cleanup recommendations

### P0 (до начала реализации Step 4)

1. **Деактивировать legacy contract как источник правды**  
   Пометить `docs/modules/space/api_contracts.md` и `docs/modules/space/data_model.md` как legacy/archived либо заменить их на новый `/v1/space/*` SSOT.

2. **Зафиксировать минимальный Step 4 contract**  
   Перед кодом утвердить единый `space-service` API/DTO: `post|repost|system`, visibility, repost targets, feed surfaces.

3. **Убрать ambiguity вокруг frontend mock режима**  
   Явно пометить текущие `SpacePageClient`/`CommunityFeedPageClient` как demo-only до появления реального API, чтобы не воспринимать их как production behavior.

4. **Сверить scope Space UI с архитектурой Step 4**  
   Разделить social core (Step 4) и отдельные домены (points/rf/quest/nft), чтобы не зашивать преждевременные UI-контракты в Space service.

### P1 (в первой итерации Step 4)

5. **Добавить каноническую Space schema в DB layer**  
   Отдельный доменный schema-файл и миграции (`space_post`, `space_group`, memberships, projections) без смешивания с legacy `Post` UI моделей.

6. **Добавить Space API в OpenAPI и только затем в SDK**  
   В соответствии с правилом "SDK only for real endpoints".

7. **Ввести frontend adapter слой DTO -> ViewModel**  
   Чтобы UI мог эволюционировать независимо от backend-DTO и не переносить mock-поля напрямую в service contract.

### P2 (после базового запуска Step 4)

8. **Сузить публичный экспорт mockData**  
   Не экспортировать mock как часть default surface модуля (минимизирует accidental coupling).

9. **Постепенно убрать local-only интеракции в Feed/PostCard**  
   Заменить локальные счетчики/добавления поста на server roundtrip + optimistic UI поверх реального API.

10. **Консолидировать терминологию типов Post/SpacePost/FeedItem**  
   Избежать дублирующихся доменных терминов между UI docs, blog docs и backend contracts.

# Space Module Audit — March 2026

Цель аудита: проверить `Space Asia` и смежный контур после завершения `Step 3 (media-service)`, чтобы перед `Step 4 (space-service)` убрать legacy-моки, старые API-контракты и frontend-предположения, которые конфликтуют с архитектурой Phase 2.

---

## 1 Current frontend surfaces

### 1.1 Реальные маршруты `Space` в PWA shell

Найденные страницы:

- `/space` -> `SpacePageClient` (динамическая страница, рендерит Dashboard на mock-данных)
- `/space/community/feed` -> `CommunityFeedPageClient` (динамическая страница, рендерит Feed на mock-данных)
- `/space/community`, `/space/posts`, `/space/quests`, `/space/vouchers`, `/space/balance`, `/space/nft`, `/space/referrals`, `/space/settings` -> статические заглушки "Раздел в разработке"

Вывод: только 2 surface реально интерактивны; остальные маршруты пока placeholder-страницы.

### 1.2 Компонентный слой `components/space`

Есть полноценные компоненты:

- `Dashboard`, `Feed`, `Posts`, `Quests`, `Vouchers`, `Balance`, `NFT`, `Referrals`, `Settings`
- `Shared/SpaceNav` с навигацией на все вышеуказанные маршруты

Но фактическое подключение к страницам частичное: большая часть rich-view компонентов не смонтирована в route-страницах, где сейчас заглушки.

### 1.3 Data access слой для Space

- Нет отдельного `services/space` в `apps/go2asia-pwa-shell`
- Нет `hooks` для Space API
- Нет route handlers `app/api/**/route.ts` под Space
- Нет вызовов `fetch`/SDK к `/v1/space/*` в Space UI

Вывод: текущий Space frontend живет без backend-контракта и без data client слоя.

---

## 2 Existing mock flows

### 2.1 Главный mock-источник

`components/space/mockData.ts` содержит крупный mock-контур:

- пользователи, посты, группы, DM, уведомления
- dashboard stats, активности, goals
- quests/vouchers/nft/transactions/drafts

### 2.2 Где mock используется напрямую

Прямой импорт mock-данных обнаружен в:

- `app/(public)/space/SpacePageClient.tsx`
- `app/(public)/space/community/feed/CommunityFeedPageClient.tsx`
- `components/space/Posts/PostsView.tsx`
- `components/space/Balance/BalanceView.tsx`
- `components/space/NFT/NFTView.tsx`
- `components/space/Quests/QuestsView.tsx`
- `components/space/Vouchers/VouchersView.tsx`
- `components/space/Referrals/ReferralsView.tsx`

Дополнительно: `components/space/index.ts` экспортирует `mockData` публично, что упрощает случайное распространение mock-зависимости.

### 2.3 Временный state management в UI

В `space` UI есть локальные временные состояния вместо серверного цикла:

- `FeedView`: `localPosts` + клиентское создание поста (`Date.now()`, in-memory only)
- `PostCard`: локальные `isLiked/isSaved/likesCount` без server sync
- `PostComposer`: локальная отправка через callback, без API
- `SettingsView`: чисто локальные toggle/выборы

### 2.4 Дополнительные mock-артефакты рядом

В `apps/go2asia-pwa-shell/mocks/posts.ts` и `mocks/repo.ts` есть отдельный mock-контур для blog/pulse/atlas (не Space API, но имя `mockPosts` может путать контексты при интеграции).

---

## 3 Existing API routes

### 3.1 `/api/space`, `/api/posts`, `/api/feed`

По коду:

- Реализаций endpoint-ов `/api/space`, `/api/posts`, `/api/feed` не найдено
- Next.js API route handlers (`app/api/**/route.ts`) отсутствуют
- frontend не вызывает эти пути

По документации:

- `docs/modules/space/api_contracts.md` использует legacy base URL `/api/space` и endpoint-ы `/feed`, `/posts`, `/posts/{id}/repost` и т.д.
- Этот контракт не подтвержден реализацией и конфликтует с текущим gateway-first префиксом `/v1/space/*`

### 3.2 Gateway `/v1/space/*`

В `apps/api-gateway/src/index.ts`:

- префикс `/v1/space/*` уже зарезервирован
- пока `SPACE_SERVICE_URL` не задан, gateway возвращает `501 ROUTE_RESERVED_NOT_ENABLED`
- при заданном `SPACE_SERVICE_URL` запросы проксируются как есть

В `apps/api-gateway/test/request.test.ts` это явно покрыто тестами (501 без сервиса, proxy после конфигурации).

### 3.3 Legacy workers/proxy/mock services

- `apps/space-service` отсутствует (service еще не поднят)
- отдельного mock worker под `/v1/space/*` не найдено
- legacy proxy для Space, аналогичный media fallback, не обнаружен

Вывод: gateway готов по префиксу, но Space API пока не существует.

---

## 4 Data model remnants

### 4.1 Frontend model (`components/space/types.ts`)

Ключевая сущность `Post` в UI сейчас:

- `PostType`: `text | media | poll | place-report | event-report | quest-report | guide`
- `PostPrivacy`: `private | friends | group | public`
- вложенные rich-структуры `attachments` (place/event/quest/guide/housing), poll, media и т.д.

### 4.2 Legacy Space docs model (`docs/modules/space/data_model.md`)

Есть отдельная модель `Post` + `FeedItem`:

- `Post.type`: `text | photo | gallery | poll | repost | guide | event | place | quest_progress`
- `visibility`: `public | friends | private`
- `FeedItem.reason`: `my_post | liked | friend_post | system_recommend | quest_completed | voucher_purchase`

Также в doc присутствует role-модель user (`traveler | expat | pro | business`), которая расходится с frontend (`spacer | vip | pro`).

### 4.3 Phase 2 target model (архитектурный SSOT)

`docs/architecture/phase2_architecture.md` фиксирует:

- базовая сущность `space_post`
- `post_type`: `post | repost | system`
- `visibility`: `public | followers | group | private`
- отдельные repost target types (`blog_post | place | event | partner | listing | quest`)
- feed API через `/v1/space/feed/*`

### 4.4 Связанный media контракт

В media-контуре уже зафиксированы owner types, включая `space_post`:

- `packages/db/src/schema/media.ts`
- `packages/db/migrations/0014_media_usage_attach_v1.sql`
- generated types (`attachMediaUsageRequestOwnerType`)

Вывод: media уже частично подготовлен к Space-домену, но сам Space schema/contract еще не реализован.

### 4.5 Дубликаты/расхождения по именам

- `Post` используется в разных смыслах (Space UI, Blog DTO, legacy docs)
- `SpacePost` встречается в docs (`docs/modules/blog/data_model.md`) как концепт, но нет канонического runtime-типа/DTO
- `FeedItem` есть только в legacy docs, нет runtime-контракта/типа в API/SDK
- `UserPost` по коду не найден как закрепленный доменный тип

---

## 5 Conflicts with Step 4 architecture

Ниже список прямых конфликтов с целевым `Step 4 (space-service)`:

1. **API namespace mismatch**  
   Legacy docs опираются на `/api/space`, тогда как целевой gateway-контракт Phase 2 — `/v1/space/*`.

2. **Post type mismatch**  
   UI и старые docs используют расширенные типы (`text/poll/place-report/...`), но Step 4 требует базовый `post | repost | system`.

3. **Visibility mismatch**  
   В текущих моделях есть `friends`, но в Step 4 — `followers`.

4. **Feed contract mismatch**  
   Legacy feed описан как `GET /feed` внутри `/api/space`; целевой контракт — `GET /v1/space/feed/home|group|profile|activity`.

5. **Frontend assumptions выходят за scope Step 4**  
   Текущий Space UI включает balance/nft/vouchers/referrals/quests как часть Space surface, тогда как Step 4 фокусируется на social core (posts/reposts/groups/profile projections), а не на полном "кабинете экосистемы".

6. **Mock-first frontend, backend-free integration**  
   Space UI сейчас полностью mock-driven, без SDK/API слоя, что противоречит backend-first принципу текущего плана.

7. **No canonical Space schema in DB/OpenAPI yet**  
   Нет `schema/space.ts` и нет опубликованных `/v1/space/*` endpoint-ов в OpenAPI/SDK runtime helpers.

---

## 6 Cleanup recommendations

### P0 (до начала реализации Step 4)

1. **Деактивировать legacy contract как источник правды**  
   Пометить `docs/modules/space/api_contracts.md` и `docs/modules/space/data_model.md` как legacy/archived либо заменить их на новый `/v1/space/*` SSOT.

2. **Зафиксировать минимальный Step 4 contract**  
   Перед кодом утвердить единый `space-service` API/DTO: `post|repost|system`, visibility, repost targets, feed surfaces.

3. **Убрать ambiguity вокруг frontend mock режима**  
   Явно пометить текущие `SpacePageClient`/`CommunityFeedPageClient` как demo-only до появления реального API, чтобы не воспринимать их как production behavior.

4. **Сверить scope Space UI с архитектурой Step 4**  
   Разделить social core (Step 4) и отдельные домены (points/rf/quest/nft), чтобы не зашивать преждевременные UI-контракты в Space service.

### P1 (в первой итерации Step 4)

5. **Добавить каноническую Space schema в DB layer**  
   Отдельный доменный schema-файл и миграции (`space_post`, `space_group`, memberships, projections) без смешивания с legacy `Post` UI моделей.

6. **Добавить Space API в OpenAPI и только затем в SDK**  
   В соответствии с правилом "SDK only for real endpoints".

7. **Ввести frontend adapter слой DTO -> ViewModel**  
   Чтобы UI мог эволюционировать независимо от backend-DTO и не переносить mock-поля напрямую в service contract.

### P2 (после базового запуска Step 4)

8. **Сузить публичный экспорт mockData**  
   Не экспортировать mock как часть default surface модуля (минимизирует accidental coupling).

9. **Постепенно убрать local-only интеракции в Feed/PostCard**  
   Заменить локальные счетчики/добавления поста на server roundtrip + optimistic UI поверх реального API.

10. **Консолидировать терминологию типов Post/SpacePost/FeedItem**  
   Избежать дублирующихся доменных терминов между UI docs, blog docs и backend contracts.

