# Space Activity Incoming Pack — Slice 2 — v1

## Статус

Seed / staging review pack.

Этот pack предназначен только для bounded follow-up под Activity slice 2.

Он не открывает новую продуктовую волну.
Он не расширяет Activity beyond agreed slice 2.
Он не добавляет system wave, thread/inquiry wave или broad ecosystem activity.

## Purpose

Цель pack:

- добавить в staging минимально достаточные **incoming activity scenarios** для review user;
- позволить честно проверить:
  - `filter=all`
  - `filter=incoming`
  - `filter=my_actions`
- подтвердить materialization incoming rows в `space_activity_projection`;
- дать UI `/space/activity` реальные incoming события для глазной проверки.

## Product scope of this pack

Этот pack покрывает только два incoming event classes slice 2:

- `space.post_liked_by_other`
- `space.post_reposted_by_other`

И сохраняет уже существующий outgoing baseline:

- `space.post_created`
- `space.repost_created`
- `space.group_joined`

## Review user

Основной review user:

- `fred89059599296@gmail.com`
- display: `Fred B.`

Предполагается, что у review user уже существуют authored Space posts из предыдущих pack/seed:

- `feed-post-007`
- `feed-post-008`
- `feed-post-009`

Если в staging итоговые canonical ids отличаются, нужно использовать реальные authored active posts review user, но сохранить саму логику сценариев ниже.

## Other users used in this pack

Использовать уже существующих пользователей из Space seed/runtime, без создания новой большой user wave.

Предпочтительные actor users:

- `Oleg Tran`
- `Elena Morozova`

Если в staging именно эти users отсутствуют, можно заменить на других уже существующих пользователей, но:
- actor должен быть **не review user**
- actor должен быть видимым и валидным Space user
- actor не должен совпадать с автором целевого post

## Scope rules

В pack должны появиться только такие новые факты:

1. Один like другого пользователя на authored post review user.
2. Один repost authored post review user другим пользователем.

Не добавлять:
- bookmark
- question
- thread_reply
- mention
- follow
- system events
- group-member-joined-my-group
- Quest / Referral / Connect / balances / vouchers
- любые шумовые события сверх двух целевых incoming cases

## Scenario 1 — incoming like on my post

### Goal
Materialize:
- `space.post_liked_by_other`

### Source of truth
`Reactions Service`

### Actor
- `Elena Morozova`

### Recipient
- `Fred B.`

### Target
- authored active Space post review user
- предпочтительно: `feed-post-007`

### Required source event
Создать одну реакцию:
- `reactionType = like`
- `targetType = space_post`
- `targetId = feed-post-007`
- actor = Elena Morozova
- actor != recipient

### Suggested timestamp
- `2026-03-15T10:12:00Z`

### Expected materialized activity row
Для `recipient_user_id = Fred` должна появиться projection row:

- `actionType = space.post_liked_by_other`
- `direction = incoming`
- `category = social`
- `actor = Elena Morozova`
- `relatedPostId = feed-post-007`
- `relatedEntityType = space_post`
- `relatedEntityId = feed-post-007`

### Expected visibility
Событие должно быть видно:
- в `filter=all`
- в `filter=incoming`

И не должно быть видно:
- в `filter=my_actions`

## Scenario 2 — incoming repost of my post

### Goal
Materialize:
- `space.post_reposted_by_other`

### Source of truth
`space-service` / Space domain repost flow

### Actor
- `Oleg Tran`

### Recipient
- `Fred B.`

### Target
- authored active Space post review user
- предпочтительно: `feed-post-007`

### Required source fact
Создать новый `space_post` у другого пользователя:
- author = Oleg Tran
- `post_type = repost`
- `repost_target_type = space_post`
- `repost_target_id = feed-post-007`
- visibility = public or otherwise valid for current Space rules
- actor != recipient

### Suggested timestamp
- `2026-03-15T10:18:00Z`

### Optional text for repost
Короткий текст репоста:
> Полезная короткая заметка про спокойный ритм Данага. Беру себе в ориентиры.

### Expected materialized activity row
Для `recipient_user_id = Fred` должна появиться projection row:

- `actionType = space.post_reposted_by_other`
- `direction = incoming`
- `category = social`
- `actor = Oleg Tran`
- `relatedPostId = feed-post-007`
- `relatedEntityType = space_post`
- `relatedEntityId = <id нового repost post>`

### Expected visibility
Событие должно быть видно:
- в `filter=all`
- в `filter=incoming`

И не должно быть видно:
- в `filter=my_actions`

## Ordering expectation

Оба incoming события должны быть новее текущих outgoing событий review user, чтобы на review surface было легко глазами увидеть Activity slice 2.

Рекомендуемый порядок сверху вниз:

1. incoming repost of my post
2. incoming like on my post
3. существующие outgoing rows:
   - repost_created
   - post_created
   - post_created
   - group_joined
   - group_joined
   - group_joined

Если staging clock/createdAt не позволяют гарантировать этот exact order, достаточно, чтобы оба incoming события попали в первую страницу `limit=20`.

## Expected API checks

После применения pack ожидается:

### `GET /v1/space/feed/activity?filter=all&limit=20`
Должен вернуть:
- outgoing rows slice 1
- incoming rows slice 2
- как минимум:
  - 1 row `space.post_liked_by_other`
  - 1 row `space.post_reposted_by_other`

### `GET /v1/space/feed/activity?filter=incoming&limit=20`
Должен вернуть:
- только incoming rows
- как минимум 2 строки:
  - `space.post_liked_by_other`
  - `space.post_reposted_by_other`

### `GET /v1/space/feed/activity?filter=my_actions&limit=20`
Должен вернуть:
- только outgoing rows slice 1
- без incoming rows

## Expected UI checks

После route-local frontend alignment для `/space/activity` ожидается:

### Filter = All
Виден смешанный поток:
- incoming likes / reposts on my posts
- мои outgoing actions

### Filter = Incoming
Видны только:
- кто-то лайкнул мой пост
- кто-то сделал репост моего поста

### Filter = My actions
Видны только:
- мои публикации
- мои репосты
- мои вступления в группы

## Acceptance criteria

Pack считается корректным только если:

1. В `space_activity_projection` появляются incoming rows для review user.
2. `filter=incoming` перестаёт быть пустым.
3. Incoming rows имеют:
   - правильный recipient
   - правильного actor
   - `direction = incoming`
   - `category = social`
4. `filter=my_actions` не загрязняется incoming rows.
5. Не появляется лишний шум:
   - bookmark
   - question
   - thread_reply
   - system rows
   - broad ecosystem rows

## Explicit non-goals

Этот pack не должен:
- открывать system wave
- добавлять thread/inquiry events
- добавлять broad social graph events
- добавлять likes на чужие посты вне review user scope
- превращаться в большой общий Space content pack
- добавлять больше 2 incoming review scenarios без необходимости

## Suggested file path

Рекомендуемый путь в монорепо:

- `content/space/activity/space_activity_incoming_pack_slice2_v1.md`

## Suggested short summary for Cursor

"Это не новый общий content pack для Space.  
Это узкий seed/data follow-up только для incoming Activity slice 2:  
один like на мой пост и один repost моего поста другим пользователем."