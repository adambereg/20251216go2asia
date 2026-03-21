# Phase 2 Architecture — Go2Asia

**Дата:** 2026-03-10  
**Роль документа:** архитектурный план Phase 2  
**Связанные документы:**  
- `docs/plans/phase2_delivery_plan.md`  
- `docs/architecture/system_status_2026_march_10.md`  
- `docs/knowledge/backend_microservice.md`  
- `docs/decisions/adr_0020_no_inline_comments_social_first.md`  
- `docs/decisions/adr_0021_token_points_connect_terminology.md`  
- `docs/decisions/adr_0022_space_services_naming_and_boundaries_mvp.md`

---

## 1. Purpose

Этот документ фиксирует целевую архитектуру **Phase 2** для Go2Asia.

Phase 2 начинается после MVP-core и решает главную проблему текущего состояния проекта:

- MVP-core уже существует;
- экосистема как связная platform architecture ещё не собрана.

Цель Phase 2:

- построить реальный social core;
- добавить practical domains;
- ввести aggregation layer;
- собрать partner marketplace;
- сделать это без premature tokenomics и без попытки симулировать Phase 3.

---

## 2. Phase 2 Scope

В Phase 2 входят следующие архитектурные контуры:

- `Space architecture`
- `Reactions model`
- `Feed architecture`
- `Quest domain`
- `Rielt domain`
- `Guru aggregation`
- `RF marketplace`

В Phase 2 **не входят**:

- полноценный `G2A / NFT / on-chain` контур;
- `Tokenomics engine` как отдельный расчётный центр;
- full `Notification Service / Event Bus / Trust & Safety` как зрелые платформенные сервисы;
- advanced billing / monetization;
- AI-heavy personalization как обязательная часть первой реализации Phase 2.

Экономика Phase 2:

- **Points-only**

Это принципиальная граница фазы.

---

## 3. Architectural Principles

### 3.1 Social-first

Обсуждение любого контента или объекта платформы должно происходить через единый social contour.

Следствия:

- нет inline-комментариев под `Blog`, `Atlas`, `Pulse`, `RF`, `Rielt`, `Quest`;
- обсуждение инициируется через репост в `Space`;
- ответы и взаимодействия идут через `Reactions`.

### 3.2 Space is a platform layer, not a side module

`Space` в Phase 2 не рассматривается как ещё один “маркетинговый экран”.

Это:

- общий UGC-контур платформы;
- источник social signals;
- источник content circulation;
- источник review/repost/discussion flows для остальных модулей.

### 3.3 Points-first economy

Вся reward-логика Phase 2 работает через:

- `points-service`

Не допускается:

- локальная симуляция `G2A`;
- псевдо-NFT как основной reward contract;
- скрытая tokenomics-логика в UI.

### 3.4 Domain ownership

Каждый новый сервис Phase 2 владеет своей доменной моделью.

При этом:

- география остаётся anchored в `content-service` / Atlas-layer до появления полноценного `Geo Layer`;
- auth и базовая идентичность остаются anchored в `auth-service` + Clerk;
- rewards остаются anchored в `points-service` + `referral-service`.

### 3.5 UI surfaces are not service boundaries

`User Cabinet`, `PRO Console`, `Business Console`, `Admin Console`:

- это интерфейсные слои;
- они не определяют backend ownership;
- один backend-домен может обслуживать несколько интерфейсных поверхностей.

---

## 4. Platform Baseline For Phase 2

Перед запуском доменных сервисов должны использоваться и расширяться уже существующие foundation-компоненты:

- `api-gateway`
- `auth-service`
- `content-service`
- `points-service`
- `referral-service`
- `packages/db`
- `packages/sdk`
- `packages/logger`

Новые route prefixes, которые должны быть зарезервированы в gateway:

- `/v1/space/*`
- `/v1/quest/*`
- `/v1/rielt/*`
- `/v1/guru/*`
- `/v1/rf/*`

Новые сервисы Phase 2 должны следовать общей дисциплине:

- Cloudflare Worker runtime;
- OpenAPI-first;
- schema-by-domain;
- requestId / structured logging;
- auth-through-gateway;
- minimal backward-safe DTO evolution.

---

## 5. Media / Asset Service

> Status note (pre-canonical snapshot): section 5 captures Phase 2 design context.
> Current canonical SSOT for platform `media-service` is maintained in `docs/architecture/media/*`.
> If wording diverges, `docs/architecture/media/*` is authoritative for current baseline and transitional runtime notes.

## 5.1 Role of media-service

`media-service` — это общий platform layer для работы с медиа и asset lifecycle.

Он нужен для того, чтобы `Space`, `Rielt`, `RF`, `Quest`, `Blog` не реализовывали:

- собственные upload flows;
- собственные media metadata tables;
- собственные URL/publication rules;
- собственные image state machines.

Иначе в экосистеме быстро появятся несовместимые media contracts.

## 5.2 Why this layer is needed in Phase 2

В Phase 2 уже появляются домены, в которых медиа являются не optional enhancement, а частью core UX:

- `Space` — фото и вложения к постам/репостам;
- `Rielt` — галереи объявлений;
- `RF` — фотографии партнёров, офферов, ваучеров;
- `Quest` — proof uploads, cover media, иллюстрации шагов;
- `Blog` — editorial media and featured content.

Поэтому `media-service` должен рассматриваться как platform service, а не как ad-hoc helper.

## 5.3 Main responsibilities

`media-service` отвечает за:

- signed upload flow;
- хранение метаданных assets;
- asset publication state;
- canonical media URLs;
- базовые трансформации/variants metadata;
- ownership and access checks;
- soft delete / retention rules;
- later media moderation hooks.

Он не обязан в Phase 2 быть heavy DAM/CMS-системой.

Его задача — дать единый, устойчивый media contract для всех новых доменов.

## 5.4 Recommended architecture

### Binary storage

Бинарные файлы:

- в object storage (`R2`)

### Metadata storage

Метаданные:

- в `Neon / packages/db`

### API contract owner

Контракт загрузки и публикации:

- `media-service`

Доменные сервисы должны хранить у себя только ссылки вида:

- `media_id`
- `cover_media_id`
- `gallery_media_ids`

а не raw storage internals.

## 5.5 Main entities

- `media_asset`
- `media_variant`
- `media_ownership`
- `media_usage_reference`

### `media_asset`

Минимальные поля:

- `id`
- `owner_type`
- `owner_id`
- `domain`
- `mime_type`
- `file_size`
- `storage_key`
- `public_url`
- `status`
- `width?`
- `height?`
- `checksum?`
- `created_at`

### `media_variant`

Минимальные поля:

- `id`
- `asset_id`
- `variant_type`
- `public_url`
- `width?`
- `height?`
- `format?`

## 5.6 Domain usage examples

### Space

Использует:

- `space_attachment`

но attachment должен ссылаться на:

- `media_asset.id`

### Rielt

Использует:

- `listing_photo`

но фото должны быть нормализованы через:

- `media_asset`

### RF

Использует:

- partner images
- offer images
- voucher visuals

через тот же media contract.

### Quest

Использует:

- quest cover image
- step illustrations
- user proof uploads

Причём proof uploads должны иметь отдельный ownership/access policy.

### Blog

Использует:

- hero images
- inline illustrations
- gallery/media attachments

Но редакционный слой не должен владеть storage contract напрямую.

## 5.7 Core API surface

- `POST /v1/media/upload-token`
- `POST /v1/media/assets`
- `GET /v1/media/assets/{id}`
- `DELETE /v1/media/assets/{id}`
- `POST /v1/media/assets/{id}/publish`
- `POST /v1/media/assets/{id}/attach`

Если потребуется direct upload proxy вместо signed URL, это должно оставаться detail implementation, а не менять доменный контракт.

## 5.8 Phase 2 limitations

В Phase 2 `media-service` не обязан включать:

- full video pipeline;
- DRM;
- advanced moderation AI;
- smart cropping;
- complex CDN orchestration.

Но он должен дать:

- единый upload flow;
- единый metadata contract;
- единый ownership model.

---

## 6. Space Architecture

## 5.1 Role of Space

`Space` — это social core Phase 2.

Он отвечает за:

- пользовательские посты;
- репосты объектов платформы;
- базовые профили и social activity;
- группы и community surfaces;
- social discussion layer для всех модулей.

`Space` не должен конкурировать с `Blog`.

Связь:

- `Blog` = editorial / curated media layer
- `Space` = user-generated / discussion / circulation layer

## 5.2 Recommended service boundary

В MVP-компромиссе Phase 2 допускается один backend:

- `space-service`

Внутри него логически выделяются модули:

- content
- feed
- reactions

Это соответствует ADR-0022:

- не называть этот слой `content-service`, чтобы не конфликтовать с текущим `apps/content-service`.

## 5.3 Main entities

Базовые сущности `Space`:

- `space_post`
- `space_group`
- `space_membership`
- `space_profile_projection`
- `space_attachment`
- `space_share_target`

### `space_post`

Минимальные поля:

- `id`
- `author_user_id`
- `group_id?`
- `post_type`: `post | repost | system`
- `body_text`
- `visibility`: `public | followers | group | private`
- `target_type?`
- `target_id?`
- `target_snapshot?`
- `created_at`
- `updated_at`
- `status`

### `space_group`

Минимальные поля:

- `id`
- `slug`
- `title`
- `description`
- `owner_user_id`
- `privacy_mode`
- `created_at`
- `status`

## 5.4 Post types

Поддерживаемые типы:

- `post` — обычный UGC пост
- `repost` — репост объекта платформы
- `system` — системная запись, например отчёт о завершении квеста

### Repost target types

- `blog_post`
- `place`
- `event`
- `partner`
- `listing`
- `quest`

## 5.5 Core API surface

Минимальный публичный/авторизованный API:

- `POST /v1/space/posts`
- `GET /v1/space/posts/{id}`
- `PATCH /v1/space/posts/{id}`
- `DELETE /v1/space/posts/{id}`
- `GET /v1/space/profile/{userIdOrSlug}`
- `GET /v1/space/groups`
- `POST /v1/space/groups`
- `GET /v1/space/groups/{id}`
- `POST /v1/space/groups/{id}/join`
- `POST /v1/space/posts/repost`

## 5.6 Integration points

`Space` должен интегрироваться с:

- `points-service`
  - награды за post/repost и later другие social actions
- `quest-service`
  - публикация отчёта о прохождении
- `rf-service`
  - отзывы/UGC о партнёрах
- `blog`
  - репост публикаций и source for best-of-community flows
- `guru-service`
  - later social/location-aware projections

## 5.7 Phase 2 limitations

В первой версии Phase 2 для Space не обязательны:

- direct messages;
- real-time chat;
- full moderation suite;
- advanced recommendation ML;
- full trust & safety automation.

---

## 7. Reactions Model

## 6.1 Role of Reactions

`Reactions` — универсальный interaction layer.

Он заменяет:

- inline comments;
- часть “чатовых” сценариев;
- разрозненные механики likes/reviews/questions в разных модулях.

## 6.2 Design principle

Реакция — это любое нормализованное взаимодействие пользователя с объектом платформы.

Каждая реакция имеет:

- `type`
- `target_type`
- `target_id`
- `user_id`
- `payload?`
- `meta`
- `created_at`

## 6.3 Reaction types for Phase 2

Обязательный минимум:

- `like`
- `repost`
- `rating`
- `short_review`
- `bookmark`
- `question`
- `contact_request`
- `thread_reply`
- `completed`

## 6.4 Target model

Реакции должны работать по единому target contract:

- `space_post`
- `blog_post`
- `place`
- `event`
- `partner`
- `listing`
- `quest`

Это критично для cross-module uniformity.

## 6.5 Thread / Inquiry model

Для сценариев, где нужен controlled async dialogue:

- аренда жилья;
- вопрос организатору события;
- вопрос партнёру;

используется не чат, а thread model.

### Thread creation

Ветка создаётся через:

- `question`
- `contact_request`

### Replies

Ответы внутри ветки:

- `thread_reply`

### Why this model

- меньше инфраструктурной сложности, чем real-time chat;
- лучше для moderation/audit;
- легче вписывается в social-first и legal-safe interaction model.

## 6.6 Core API surface

- `POST /v1/space/reactions`
- `DELETE /v1/space/reactions/{id}`
- `GET /v1/space/reactions/stats`
- `GET /v1/space/reactions/list`
- `GET /v1/space/threads/{id}`
- `POST /v1/space/threads/{id}/reply`

## 6.7 Reward policy

В Phase 2 rewards для reactions:

- идут только в `Points`;
- определяются через конфигурацию action types;
- не должны быть hardcoded в UI.

## 6.8 Anti-fraud baseline

В первой версии обязательны:

- idempotency where needed;
- one-like-per-user-per-target;
- one-review-per-relevant-business-flow;
- throttling;
- basic abuse limits;
- soft deletion and moderation flags.

---

## 8. Feed Architecture

## 7.1 Role of Feed

`Feed` — это distribution engine social content.

Он отвечает не за хранение поста как объекта, а за:

- кому показывать;
- в каком порядке показывать;
- какие источники входят в ленту.

## 7.2 Boundary choice for Phase 2

На первой реализации `Feed` может быть:

- логическим модулем внутри `space-service`

При этом boundary должна быть явной, чтобы при росте можно было вынести его отдельно.

## 7.3 Feed sources

Базовые источники ленты:

- own posts
- followed users
- joined groups
- reposts
- system posts

На более позднем этапе Phase 2 допускаются:

- curated highlights
- popular posts
- cross-module featured reposts

## 7.4 Feed modes

Рекомендуемые feed surfaces:

- `home feed`
- `group feed`
- `profile feed`
- `activity feed`

## 7.5 Ranking model

Первая версия должна быть простой и детерминированной:

- reverse chronological;
- lightweight priority boosts:
  - own groups;
  - recent engagement;
  - system achievements if relevant.

Не нужно вводить ML ranking в первой delivery wave.

## 7.6 Core API surface

- `GET /v1/space/feed/home`
- `GET /v1/space/feed/group/{groupId}`
- `GET /v1/space/feed/profile/{userId}`
- `GET /v1/space/feed/activity`

## 7.7 Feed storage strategy

На первой фазе допустим гибрид:

- content stored once in Space posts;
- feed assembled on read or lightly cached;
- no heavy fan-out-at-write until scale demands it.

Причина:

- Phase 2 ещё не находится в масштабах, требующих сложного feed infrastructure.

## 7.8 Blog integration

`Feed` должен уметь принимать social circulation вокруг editorial objects:

- репост статьи Blog;
- discussion branch around repost;
- best-of-community candidate flows later.

Это даёт цельный content loop:

- editorial -> social discussion -> visibility -> reward.

---

## 9. Quest Domain

## 8.1 Role of Quest

`Quest` — gamification core Phase 2.

Он нужен не как “игрушка поверх приложения”, а как engine активности:

- exploration;
- retention;
- rewards;
- cross-module engagement.

## 8.2 Main responsibilities

- хранение квестов;
- хранение шагов и миссий;
- запуск и прогресс участников;
- валидация выполнения;
- завершение квеста;
- reward trigger в `points-service`;
- публикация отчёта в `Space`.

## 8.3 Main entities

- `quest`
- `quest_step`
- `quest_progress`
- `quest_submission`
- `quest_reward_rule`

### `quest`

Минимальные поля:

- `id`
- `slug`
- `title`
- `description`
- `creator_user_id`
- `visibility`
- `status`
- `difficulty`
- `reward_points`
- `geo_scope`
- `start_at?`
- `end_at?`

### `quest_step`

- `id`
- `quest_id`
- `step_order`
- `step_type`
- `target_type?`
- `target_id?`
- `validation_mode`
- `instruction`

### Validation modes

- manual proof
- geo proximity
- qr/code
- event attendance
- partner interaction

## 8.4 Quest step types

Рекомендуемый минимальный набор:

- visit place
- attend event
- reach geo checkpoint
- submit photo
- scan code
- answer question
- claim partner action

## 8.5 Reward model in Phase 2

Rewards only:

- `Points`

Quest completion должен вызывать:

- начисление Points участнику;
- optional Points автору/PRO по правилу;
- optional system post/report in `Space`.

Не допускается в первой версии:

- NFT rewards as required part of the flow;
- G2A rewards;
- complex payout rules.

## 8.6 Integrations

`Quest` depends on:

- `content-service`
  - validate places/events
- `space-service`
  - post run report
- `points-service`
  - reward issuance
- `rf-service`
  - partner-linked steps and voucher flows
- later `guru-service`
  - discovery of quests nearby

## 8.7 Core API surface

- `GET /v1/quest/quests`
- `GET /v1/quest/quests/{id}`
- `POST /v1/quest/quests`
- `PATCH /v1/quest/quests/{id}`
- `POST /v1/quest/quests/{id}/start`
- `POST /v1/quest/quests/{id}/steps/{stepId}/submit`
- `POST /v1/quest/quests/{id}/complete`
- `GET /v1/quest/progress/me`

## 8.8 Phase 2 limitations

В первой версии Quest не должен требовать:

- heavy anti-cheat stack;
- on-chain achievements;
- full economy builder;
- advanced seasonal systems.

---

## 10. Rielt Domain

## 9.1 Role of Rielt

`Rielt` — первый practical domain Phase 2.

Его задача:

- добавить реальную utilitarian value за пределами контента;
- дать пользователю инструмент поиска жилья;
- питать `Guru` полезным nearby inventory.

## 9.2 Product boundary for Phase 2

В Scope Phase 2 входит:

- public search;
- public detail pages;
- saved/favorite workflows later optionally;
- minimal owner/PRO CRUD;
- inquiry/contact flow;
- связка с Atlas geography.

Не входят:

- full booking engine;
- payments;
- legal contracts;
- heavy verification marketplace;
- advanced AI recommender.

## 9.3 Main entities

- `listing`
- `listing_photo`
- `listing_owner_link`
- `listing_inquiry`
- `listing_availability_snapshot`

### `listing`

Минимальные поля:

- `id`
- `slug`
- `title`
- `description`
- `listing_type`
- `rental_mode`
- `price_amount`
- `price_currency`
- `country_id`
- `city_id`
- `district_text?`
- `latitude`
- `longitude`
- `amenities`
- `status`
- `owner_user_id`
- `verification_status`

## 9.4 Ownership model

В первой версии допускаются роли:

- owner
- agent
- PRO-moderated creator

Право редактирования должно идти через auth + role/ownership checks, а не через frontend-only guards.

## 9.5 Inquiry model

Вместо прямого чата использовать controlled inquiry:

- `contact_request`
- thread replies через `Reactions`

Это создаёт связный social-safe interaction pattern с остальной платформой.

## 9.6 Integrations

`Rielt` depends on:

- `content-service`
  - city/country/place geography
- `space-service`
  - discussion/reviews/social visibility later
- `guru-service`
  - nearby aggregation
- `rf-service`
  - optional RF-linked housing supply later
- `points-service`
  - optional light reward hooks

## 9.7 Core API surface

- `GET /v1/rielt/listings`
- `GET /v1/rielt/listings/{id}`
- `POST /v1/rielt/listings`
- `PATCH /v1/rielt/listings/{id}`
- `DELETE /v1/rielt/listings/{id}`
- `POST /v1/rielt/listings/{id}/inquiry`
- `GET /v1/rielt/listings/nearby`

## 9.8 Phase 2 success definition

`Rielt` считается успешно введённым в экосистему, если:

- есть реальные listing records;
- есть read/search/detail;
- есть minimal owner/PRO management;
- listings попадают в `Guru`;
- взаимодействие не ломает social-first model.

---

## 11. Guru Aggregation

## 10.1 Role of Guru

`Guru` — aggregation/BFF layer Phase 2.

Он не владеет доменными сущностями.

Он отвечает за:

- nearby discovery;
- unified cards;
- mixed-domain navigation;
- graceful degradation across domains.

## 10.2 Position in the stack

`Guru` sits above:

- `content-service`
- `quest-service`
- `rielt-service`
- `rf-service`
- later `space-service` projections and `Geo Layer`

## 10.3 Architectural choice for Phase 2

В первой версии `Guru` может работать как:

- direct fan-out BFF

с последующей миграцией в:

- `Guru + Geo Layer`

когда появится реальная нагрузка и кросс-доменная карта станет первичным UX.

## 10.4 Output model

Guru должен отдавать унифицированные entity cards:

- `place`
- `event`
- `listing`
- `partner`
- `quest`
- later `guru/pro/person` if needed

### Common card fields

- `id`
- `entity_type`
- `source`
- `title`
- `subtitle`
- `description_short`
- `lat`
- `lng`
- `distance_m`
- `city_id`
- `country_id`
- `tags`
- `image_url`
- `payload`

## 10.5 Main user scenarios

- “что рядом со мной”
- “что делать сегодня”
- “есть ли жильё рядом”
- “есть ли партнёры и скидки рядом”
- “есть ли квесты рядом”

## 10.6 Ranking

В первой версии ranking должен быть объяснимым:

- distance
- time relevance
- open now / active now
- verified / curated signals
- optional RF boost with rules

Без black-box personalization.

## 10.7 Core API surface

- `GET /v1/guru/nearby`
- `GET /v1/guru/nearby/{type}`
- `GET /v1/guru/what-to-do`
- `GET /v1/guru/saved`
- `POST /v1/guru/saved`

## 10.8 Dependencies

`Guru` должен запускаться после появления реальных доменных backends:

- `Quest`
- `Rielt`
- `RF`

Без этого он рискует превратиться в ещё один mock-driven shell.

---

## 12. RF Marketplace

## 11.1 Role of RF

`RF marketplace` — multi-sided economic hub Phase 2.

Он соединяет:

- users
- VIP/Spacer
- PRO curators
- business partners

При этом в Phase 2 он работает в **Points-only** режиме.

## 11.2 What RF is in Phase 2

RF — это не просто каталог.

Это контур, включающий:

- partner catalog;
- business profiles;
- PRO onboarding workflows;
- offers / vouchers;
- claim / redeem flows;
- social visibility via `Space`;
- integration with `Quest` and `Guru`.

## 11.3 Recommended service boundary

В первой реализации допустимо объединить:

- partner profile
- voucher/offers
- partner/pro workflows

в один сервис:

- `rf-service`

с внутренними логическими модулями.

## 11.4 Main entities

- `rf_partner`
- `rf_partner_location`
- `rf_offer`
- `rf_voucher`
- `rf_pro_link`
- `rf_redemption`
- `rf_review_projection`

### `rf_partner`

Минимальные поля:

- `id`
- `name`
- `category`
- `description`
- `atlas_place_id?`
- `country_id`
- `city_id`
- `status`
- `owner_account_id`
- `onboarding_pro_user_id?`

### `rf_offer`

- `id`
- `partner_id`
- `offer_type`
- `title`
- `description`
- `claim_mode`
- `points_cost?`
- `status`
- `valid_from`
- `valid_to`

### `rf_voucher`

- `id`
- `offer_id`
- `user_id`
- `voucher_code`
- `claimed_at`
- `redeemed_at?`
- `status`

## 11.5 Main workflows

### Public / user side

- browse catalog
- view partner profile
- claim voucher
- redeem voucher
- review/share via `Space`

### PRO side

- onboard partner
- maintain partner readiness
- manage “my partners”
- track partner activity

### Business side

- edit profile
- create/manage offers
- validate redemptions
- see activity and lightweight analytics

## 11.6 Integrations

`RF` depends on:

- `content-service`
  - geography / Atlas anchoring
- `space-service`
  - reviews, reposts, visibility
- `quest-service`
  - partner-based quest steps and rewards
- `guru-service`
  - nearby partner discovery
- `points-service`
  - points-based claim/redeem and activity rewards

## 11.7 Phase 2 reward model

Допустимо:

- claim with Points
- redeem events generating Points signals
- PRO activity generating Points

Недопустимо как обязательный Phase 2 scope:

- G2A payouts
- NFT partner rewards
- full premium token economics

## 11.8 Core API surface

- `GET /v1/rf/partners`
- `GET /v1/rf/partners/{id}`
- `POST /v1/rf/partners`
- `PATCH /v1/rf/partners/{id}`
- `GET /v1/rf/offers`
- `POST /v1/rf/offers`
- `POST /v1/rf/offers/{id}/claim`
- `POST /v1/rf/vouchers/{id}/redeem`
- `GET /v1/rf/pro/partners`
- `GET /v1/rf/business/profile`

## 11.9 Why RF is capstone

RF должен строиться последним в цепочке Phase 2, потому что он зависит от:

- social core;
- rewards;
- practical presence;
- nearby aggregation;
- PRO and business workflows.

Если строить RF раньше, он почти неизбежно превратится в ещё один isolated UI mock surface.

---

## 13. Future Geo Layer

## 13.1 Current state

На текущем этапе география anchored в:

- `content-service`
- Atlas data model

Это нормально для MVP-core и ранней Phase 2, потому что Atlas уже является source of truth по:

- countries;
- cities;
- places;
- базовой location taxonomy.

## 13.2 Why a future Geo Layer is needed

По мере роста доменов Atlas перестанет быть достаточным как единственная geographic backbone abstraction.

Появятся контуры, которым нужен не просто справочник локаций, а platform-grade geo capability:

- `Atlas`
- `Rielt`
- `RF`
- `Quest`
- `Guru`

Позже также:

- `Space`

## 13.3 What Geo Layer should become

`Geo Layer` — это не “ещё один каталог мест”.

Это платформенный слой, который должен обеспечивать:

- единый geo contract;
- normalized map items;
- nearby and viewport queries;
- geo projections across domains;
- spatial indexing;
- lightweight geo caching;
- routing foundation for aggregation UX.

## 13.4 Recommended responsibility split

### Atlas remains source of truth for geography content

Atlas должен оставаться владельцем:

- canonical place/city/country records;
- editorial geography data;
- taxonomy and descriptive context.

### Geo Layer becomes platform geo runtime

Geo Layer должен обслуживать:

- unified geo queries;
- cross-domain map projections;
- normalized coordinates/shape access;
- domain overlays for `Rielt`, `RF`, `Quest`, `Guru`.

## 13.5 Why Geo Layer is future, not immediate Phase 2 blocker

На ранней Phase 2 допустимо:

- использовать Atlas + direct fan-out;
- держать geo composition inside `guru-service` where needed;
- избегать premature dedicated geo platform.

Переход к `Geo Layer` становится обязательным, когда:

- nearby becomes primary UX across multiple modules;
- появляется кросс-доменная карта как platform feature;
- direct fan-out начинает давать latency / complexity debt;
- Quest / Guru / RF / Rielt начинают конкурировать за разные geo representations.

## 13.6 Expected consumers of Geo Layer

- `Atlas`
- `Rielt`
- `RF`
- `Quest`
- `Guru`

И позже:

- `Space`

## 13.7 Future API orientation

Когда `Geo Layer` будет введён, ожидаемые базовые surfaces:

- `GET /v1/geo/nearby`
- `GET /v1/geo/viewport`
- `GET /v1/geo/layers`
- `GET /v1/geo/entities/{id}`

При этом это должен быть platform contract, а не domain replacement.

---

## 14. Cross-Domain Flows

## 12.1 Blog -> Space

- пользователь читает статью;
- делает репост в `Space`;
- обсуждение идёт через `Reactions`;
- activity может приносить `Points`.

## 12.2 Quest -> Space -> Points

- пользователь завершает квест;
- `Quest` вызывает reward в `Points`;
- `Quest` создаёт report/system post в `Space`;
- social circulation усиливает retention.

## 12.3 Rielt -> Reactions

- пользователь открывает listing;
- отправляет `contact_request`;
- создаётся thread;
- коммуникация идёт без real-time chat.

## 12.4 RF -> Quest

- Quest step ссылается на RF partner/offer;
- completion может выдавать voucher or partner-linked proof;
- rewards идут через `Points`.

## 12.5 Guru -> all domains

- user opens nearby;
- Guru агрегирует `content + quest + rielt + rf`;
- user jumps to source module;
- source module owns the actual entity lifecycle.

---

## 15. Recommended Delivery Order

### Step 1

`media-service`

### Step 2

`space-service`

### Step 3

`reactions` and thread model inside Space boundary

### Step 4

`feed` inside Space boundary

### Step 5

`quest-service`

### Step 6

`rielt-service`

### Step 7

`guru-service`

### Step 8

`rf-service`

Причина такого порядка:

- сначала создаётся единый media substrate;
- сначала создаётся social substrate;
- затем gamification;
- затем practical supply;
- затем aggregation;
- затем marketplace capstone.

---

## 16. Phase 2 Exit Criteria

Phase 2 можно считать архитектурно успешной, если выполнены все условия:

- `media-service` даёт единый media contract для новых доменов.
- `Space` работает на реальном backend.
- `Reactions` и thread model работают как единый interaction layer.
- `Feed` работает как реальный distribution engine.
- `Quest` создаёт реальные progress/reward flows через `Points`.
- `Rielt` имеет реальные listings и inquiry workflows.
- `Guru` агрегирует реальные домены.
- `RF` работает как partial marketplace, а не как placeholder catalog.
- все новые домены интегрированы через gateway, SDK и DB discipline.
- токеномика по-прежнему ограничена `Points-only`, без подмены Phase 3.

---

## 17. Final Architecture Statement

Phase 2 для Go2Asia — это переход:

- от **content MVP-core**
- к **platform ecosystem**

через семь связанных архитектурных контуров:

- `Media / Asset Service`
- `Space`
- `Reactions`
- `Feed`
- `Quest`
- `Rielt`
- `Guru`
- `RF`

и с заделом на будущий:

- `Geo Layer`

Главный критерий качества Phase 2:

> новые модули должны вводиться не как изолированные экраны, а как реальные доменные сервисы, связанные общей social-first и points-first архитектурой.

