# Space Asia Feed Content Pack — Slice 1 v1

**Project:** Go2Asia  
**Module:** Space Asia  
**Surface:** Feed (`/space/feed`)  
**Document role:** Bounded runtime/demo/seed content pack for Feed Slice 1  
**Status:** Draft v1  
**Primary user for review:** `fred89059599296@gmail.com`

---

## 1. Purpose

This pack exists to strengthen **Feed Slice 1** as a believable product surface.

It should help Cursor and the repository with:
- richer `All` feed rendering;
- enough data for bounded `Groups` / `Reposts` / `My` filters;
- calmer and more convincing UI review;
- clearer distinction between:
  - authored posts,
  - group-context posts,
  - reposts of ecosystem objects,
  - meaningful social circulation.

This pack is **not**:
- a new SSOT;
- a feed algorithm specification;
- a schema migration plan;
- a replacement for `space_feed_activity_publications_decision_note_v1.md`.

This is a **content layer** for Slice 1 only.

---

## 2. Slice 1 framing

Feed in this slice should behave as:

> **personal social reading stream of Space Asia**

It should already feel alive and useful, without pretending that all future filters and event classes are fully implemented.

### What this pack must support

This pack must provide enough believable content for:
- `All`
- `Groups`
- `Reposts`
- `My`

### What this pack does not try to fake

This pack does **not** try to fake:
- full `Reactions` feed-grade item layer;
- following-graph logic;
- fully paginated server-truth filtered streams;
- deep activity/event modeling.

---

## 3. Primary review user

### User U1
- email: `fred89059599296@gmail.com`
- role: `Spacer`
- current city context: `Da Nang`
- practical reading mode: `personal social stream, useful groups, visible reposts, a few own contributions`

### Assumed active group memberships for U1 in this pack

These assumptions exist only to make Feed Slice 1 believable:
- `danang-city-life`
- `asia-city-events`
- `quest-phu-quoc-weekend`

This is enough to make the `Groups` bounded filter visually meaningful.

---

## 4. Author pool used in this pack

Use already familiar Space identities where possible.

### A1
- email: `oleg.tran.seed@example.com`
- display_name: `Oleg Tran`
- role_label: `PRO`
- city: `Da Nang`
- content role: `community curator / practical local voice`

### A2
- email: `admin.operator.seed@example.com`
- display_name: `Admin Operator`
- role_label: `Admin`
- city: `Da Nang`
- content role: `system/operator voice`

### A3
- email: `natalia.kim.seed@example.com`
- display_name: `Natalia Kim`
- role_label: `PRO`
- city: `Phuket`
- content role: `relocation / housing / practical curation`

### A4
- email: `alexey.chernov.seed@example.com`
- display_name: `Alexey Chernov`
- role_label: `PRO`
- city: `Ho Chi Minh City`
- content role: `events / city rhythm / repost-heavy`

### A5
- email: `kirill.denisov.seed@example.com`
- display_name: `Kirill Denisov`
- role_label: `VIP`
- city: `Ho Chi Minh City`
- content role: `active participant / visible repost consumer`

### A6
- email: `elena.morozova.seed@example.com`
- display_name: `Elena Morozova`
- role_label: `Spacer`
- city: `Da Nang`
- content role: `events / community / softer city-life posts`

### A7
- email: `fred89059599296@gmail.com`
- display_name: `Fred B.`
- role_label: `Spacer`
- city: `Da Nang`
- content role: `primary viewer / some own stream-visible posts`

---

## 5. Feed goals by filter

### 5.1 All
Must feel like a real mixed stream with:
- authored posts;
- group-context posts;
- reposts of ecosystem objects;
- at least one system-grade social item;
- 2–3 own posts/reposts by the review user.

### 5.2 Groups
Must not feel empty.
Need at least:
- 4 group-context items;
- from at least 2 different groups;
- with recognizably different tones.

### 5.3 Reposts
Need at least:
- 5 repost items;
- from different ecosystem modules;
- with enough variation that the tab/filter looks intentional.

### 5.4 My
Need at least:
- 3 stream-visible contributions by `fred89059599296@gmail.com`;
- mix of:
  - 1 authored public post,
  - 1 group-shared post,
  - 1 repost.

---

## 6. Feed item set

Below is a bounded item set for Slice 1.

### F1
- id: `feed-post-001`
- author_email: `oleg.tran.seed@example.com`
- post_type: `post`
- visibility: `public`
- group_slug: `null`
- tone: `practical`
- title_hint: `Удобная короткая база для первого дня в Дананге`
- text:
  `Если только приехали в Дананг и не хотите сразу перегружаться, я бы начал с связки: тихий завтрак, один понятный район, одно рабочее кафе и вечерняя прогулка у реки. Такой день лучше даёт почувствовать город, чем беготня по топ-спискам.`
- media_hint: `1 city photo, river walk mood`
- why_useful:
  - `All`
- notes: `Baseline authored public post from strong recognizable author.`

### F2
- id: `feed-post-002`
- author_email: `elena.morozova.seed@example.com`
- post_type: `post`
- visibility: `group`
- group_slug: `danang-city-life`
- tone: `social-local`
- title_hint: `Небольшой вечерний маршрут после работы`
- text:
  `Для группы: если хочется не просто сидеть дома после работы, а мягко встроиться в городской ритм, очень советую маршрут через набережную, одно кафе и короткую остановку на мосту Дракона. Без туристической суеты, но с ощущением живого города.`
- media_hint: `2 photos, evening city lights`
- why_useful:
  - `All`
  - `Groups`
- notes: `Straight group-context post for Da Nang group.`

### F3
- id: `feed-post-003`
- author_email: `alexey.chernov.seed@example.com`
- post_type: `repost`
- visibility: `public`
- group_slug: `null`
- repost_target:
  module: `pulse`
  entity_type: `event`
  title: `Asia City Meetup: Da Nang Coffee & People`
  subtitle: `Небольшая городская встреча для тех, кто хочет почувствовать social pulse без формальности.`
- text:
  `Хороший формат для тех, кто не любит большие и шумные ивенты. Здесь скорее про лёгкий вход в город и новых людей.`
- media_hint: `resolved event preview`
- why_useful:
  - `All`
  - `Reposts`
- notes: `Pulse repost with strong feed readability.`

### F4
- id: `feed-post-004`
- author_email: `natalia.kim.seed@example.com`
- post_type: `repost`
- visibility: `public`
- group_slug: `null`
- repost_target:
  module: `atlas`
  entity_type: `place`
  title: `Rawai Work Garden`
  subtitle: `Тихое место на Пхукете, где можно спокойно работать полдня.`
- text:
  `Редкий тип места, которое не кричит «лучшее на острове», а просто честно решает задачу: сесть, поработать, выпить кофе и не устать от шума.`
- media_hint: `resolved place preview`
- why_useful:
  - `All`
  - `Reposts`
- notes: `Atlas repost, calmer style.`

### F5
- id: `feed-post-005`
- author_email: `kirill.denisov.seed@example.com`
- post_type: `repost`
- visibility: `group`
- group_slug: `asia-city-events`
- repost_target:
  module: `blog`
  entity_type: `blog_post`
  title: `Как не сгореть в новой городской среде за первую неделю`
  subtitle: `Редакционная статья о мягкой адаптации, ритме и социальных входах.`
- text:
  `Кинул в группу, потому что это как раз тот случай, когда статья помогает не только подумать, но и реально чуть спокойнее встроиться в новую среду.`
- media_hint: `resolved blog preview`
- why_useful:
  - `All`
  - `Groups`
  - `Reposts`
- notes: `Group-context repost of Blog object.`

### F6
- id: `feed-post-006`
- author_email: `admin.operator.seed@example.com`
- post_type: `system`
- visibility: `public`
- group_slug: `null`
- tone: `system-social`
- title_hint: `Space pulse note`
- text:
  `В Space Asia стало больше живых городских и групповых сценариев. Если давно только читали, попробуйте один простой шаг: открыть группу по вашему городу, сохранить полезный пост или сделать первый репост объекта экосистемы.`
- media_hint: `none`
- why_useful:
  - `All`
- notes: `System-grade social circulation item; should remain readable as content, not as alert.`

### F7
- id: `feed-post-007`
- author_email: `fred89059599296@gmail.com`
- post_type: `post`
- visibility: `public`
- group_slug: `null`
- tone: `personal-practical`
- title_hint: `Первые впечатления от спокойного Дананга`
- text:
  `Чем дольше живу в городском ритме Дананга, тем больше понимаю ценность не громких мест, а понятных опор: кафе, короткий маршрут, одна рабочая точка, одно место для вечера. Хочется собирать вокруг себя именно такие ориентиры.`
- media_hint: `1 street photo`
- why_useful:
  - `All`
  - `My`
- notes: `Primary owned authored post for review user.`

### F8
- id: `feed-post-008`
- author_email: `fred89059599296@gmail.com`
- post_type: `post`
- visibility: `group`
- group_slug: `quest-phu-quoc-weekend`
- tone: `quest-report-lite`
- title_hint: `Небольшой отчёт после прогулочного квестового дня`
- text:
  `Для группы: понравился формат, где квест не превращается в гонку. Самое приятное — что после прохождения остаётся не только галочка, но и несколько реальных точек, к которым хочется вернуться.`
- media_hint: `2 casual report photos`
- why_useful:
  - `All`
  - `Groups`
  - `My`
- notes: `Group-shared own contribution for primary user.`

### F9
- id: `feed-post-009`
- author_email: `fred89059599296@gmail.com`
- post_type: `repost`
- visibility: `public`
- group_slug: `null`
- repost_target:
  module: `quest`
  entity_type: `quest`
  title: `Phu Quoc Weekend Quest`
  subtitle: `Лёгкий сценарий выходного дня с social afterlife и фото-точками.`
- text:
  `Хороший пример того, как квест может быть не только про прохождение, но и про настроение, ритм и маленькие полезные находки.`
- media_hint: `resolved quest preview`
- why_useful:
  - `All`
  - `Reposts`
  - `My`
- notes: `Own repost for My filter.`

### F10
- id: `feed-post-010`
- author_email: `natalia.kim.seed@example.com`
- post_type: `post`
- visibility: `group`
- group_slug: `phuket-relocation-circle`
- tone: `supportive-practical`
- title_hint: `Если вы только присматриваетесь к Пхукету`
- text:
  `Для группы: не пытайтесь решить всё за один день. Лучше сначала понять, какой вам нужен ритм — море, работа, тишина, логистика. Уже потом выбирать район и жильё.`
- media_hint: `none`
- why_useful:
  - `All`
  - `Groups`
- notes: `Useful group post even if not in Fred memberships by default; can be included if membership or not, depending env. Optional for final seed if needed.`

### F11
- id: `feed-post-011`
- author_email: `alexey.chernov.seed@example.com`
- post_type: `repost`
- visibility: `public`
- group_slug: `null`
- repost_target:
  module: `rielt`
  entity_type: `listing`
  title: `Studio near river walk — Da Nang`
  subtitle: `Небольшой listing рядом с понятным вечерним маршрутом.`
- text:
  `Обычно не люблю тащить listings в social layer просто так, но здесь хорош именно контекст: понятный район, тихий ритм и логичная бытовая география.`
- media_hint: `resolved listing preview`
- why_useful:
  - `All`
  - `Reposts`
- notes: `Rielt-linked repost, useful for ecosystem breadth.`

### F12
- id: `feed-post-012`
- author_email: `kirill.denisov.seed@example.com`
- post_type: `post`
- visibility: `public`
- group_slug: `null`
- tone: `reaction-signal-like social note`
- title_hint: `Что сейчас люди чаще всего сохраняют перед короткой поездкой`
- text:
  `Интересно, что в последнее время больше всего сохраняют не “топ-10 мест”, а короткие practical posts: районы, рабочие кафе, события без перегруза и один понятный маршрут на вечер.`
- media_hint: `none`
- why_useful:
  - `All`
- notes: `This is not a true Reactions item. It only helps Feed feel socially alive without faking reaction-driven read model.`

### F13
- id: `feed-post-013`
- author_email: `oleg.tran.seed@example.com`
- post_type: `post`
- visibility: `group`
- group_slug: `danang-city-life`
- tone: `curator-group`
- title_hint: `Три точки для мягкого входа в жизнь города`
- text:
  `Для группы собрал короткую связку: район, кафе и вечерняя прогулка, которые дают ощущение “я уже живу здесь”, а не просто приехал посмотреть.`
- media_hint: `curated collage`
- why_useful:
  - `All`
  - `Groups`
- notes: `Second strong Da Nang group item.`

### F14
- id: `feed-post-014`
- author_email: `elena.morozova.seed@example.com`
- post_type: `repost`
- visibility: `group`
- group_slug: `asia-city-events`
- repost_target:
  module: `rf`
  entity_type: `offer`
  title: `Cozy meetup partner offer`
  subtitle: `Небольшой партнёрский формат для городских встреч и after-event общения.`
- text:
  `В группу кидаю не ради скидки как таковой, а потому что формат хорошо подходит для продолжения после городских событий.`
- media_hint: `resolved offer preview`
- why_useful:
  - `All`
  - `Groups`
  - `Reposts`
- notes: `RF-linked repost with group circulation context.`

---

## 7. Recommended visible mix on first loaded page

For Slice 1 review, the first loaded feed page should ideally include this mix:

1. `F1` — strong public authored post  
2. `F2` — group-context post  
3. `F3` — Pulse repost  
4. `F7` — own authored post  
5. `F5` — Blog repost inside group context  
6. `F6` — system-grade social item  
7. `F8` — own group-shared post  
8. `F4` — Atlas repost  
9. `F9` — own Quest repost  
10. `F13` — second strong group item  
11. `F11` — Rielt repost  
12. `F14` — RF repost in group context

This set gives enough believable variety without pretending that `Reactions` is already implemented as a first-class feed lane.

---

## 8. Filter expectations

### 8.1 All
Expected visible mix:
- normal authored posts
- group posts
- reposts from multiple ecosystem modules
- 1 system-grade social item
- 3 own contributions by review user

### 8.2 Groups
Expected visible items:
- `F2`
- `F5`
- `F8`
- `F13`
- `F14`
- optional `F10` if membership/runtime allows

### 8.3 Reposts
Expected visible items:
- `F3`
- `F4`
- `F5`
- `F9`
- `F11`
- `F14`

### 8.4 My
Expected visible items:
- `F7`
- `F8`
- `F9`

### 8.5 Reactions
This pack does **not** provide a fake `Reactions` stream.

If UI keeps a `Reactions` filter in Slice 1, it should remain:
- hidden,
- or disabled,
- or clearly not active yet,
without pretending these current posts are true reaction-driven feed items.

---

## 9. Copy tone rules

All content in this pack should feel:
- socially believable;
- useful;
- not over-marketed;
- region-aware;
- calm and practical;
- clearly connected to life in Southeast Asia.

Avoid:
- generic social-media noise;
- fake virality;
- influencer tone;
- abstract philosophical posting;
- overly promotional business copy.

---

## 10. What this pack should improve in UI review

This pack should help Feed look:
- less empty;
- less like a technical shell;
- more like a living central Space surface;
- more convincing in `Groups` / `Reposts` / `My` bounded views;
- more clearly tied to Go2Asia ecosystem object circulation.

It should also reduce the need for over-explaining the screen through internal copy.

---

## 11. Important constraints

This pack should **not** be used to justify fake product claims.

Specifically:
- it does not prove that `Reactions` filter is implemented;
- it does not prove server-side filter pagination;
- it does not replace the decision note;
- it does not replace the implementation plan;
- it does not expand Feed into Activity or Publications.

---

## 12. Short practical handoff for Cursor

Cursor should use this pack as:
- believable review content for Feed Slice 1;
- a way to strengthen `All`, `Groups`, `Reposts`, and `My` visual states;
- a way to reduce staging/dev feeling in Feed UI.

Cursor should **not** use this pack to:
- fake unsupported runtime classes;
- simulate raw reactions as feed cards;
- overclaim server-truth filtering.

---

## 13. Final short summary

This pack gives Feed Slice 1:
- enough public authored posts,
- enough group-context posts,
- enough ecosystem reposts,
- enough own user contributions,
- enough social realism,

so that Feed can feel like a believable Space Asia surface
without pretending that future feed layers are already live.

---

## 14. Importer-ready materialization appendix

This appendix exists only to let the existing Space markdown importer materialize
Feed Slice 1 content through the normal `space_post` runtime path.

It is intentionally bounded:

- it does not replace the main Full Seed canon;
- it does not add new runtime classes;
- it only provides the minimal YAML sections expected by `db:import:space-md`;
- it keeps target types inside the already supported allowlist.

Important compatibility notes:

- RF `offer` from `F14` is materialized as `target_type: partner` with the existing
  `rf-partner-phuket-breakfast-club` target hint.
- Some repost targets use the closest existing ecosystem target hints already present
  in the current full seed canon.
- `fred89059599296@gmail.com` is included here because `My` review realism depends on it,
  but applied materialization still requires that this identity exists in the target auth/users contour.

________________________________________

users:
  - email: "admin.operator.seed@example.com"
    account_role: "admin"
    display_name: "Admin Operator"
    role_label: "Admin"
    avatar_url: ""
    country: "Vietnam"
    city: "Da Nang"
    bio_short: "Поддерживаю экосистему Go2Asia и помогаю запускать новые социальные контуры."

  - email: "oleg.tran.seed@example.com"
    account_role: "pro"
    display_name: "Oleg Tran"
    role_label: "PRO"
    avatar_url: ""
    country: "Vietnam"
    city: "Da Nang"
    bio_short: "Помогаю адаптироваться во Вьетнаме, собираю локальные сообщества и практичные маршруты."

  - email: "natalia.kim.seed@example.com"
    account_role: "pro"
    display_name: "Natalia Kim"
    role_label: "PRO"
    avatar_url: ""
    country: "Thailand"
    city: "Phuket"
    bio_short: "Собираю комьюнити по зимовке, жилью и повседневной жизни на Пхукете."

  - email: "alexey.chernov.seed@example.com"
    account_role: "pro"
    display_name: "Alexey Chernov"
    role_label: "PRO"
    avatar_url: ""
    country: "Vietnam"
    city: "Ho Chi Minh City"
    bio_short: "Интересуюсь городскими маршрутами, встречами, событиями и цифровой повседневностью в ЮВА."

  - email: "kirill.denisov.seed@example.com"
    account_role: "vip"
    display_name: "Kirill Denisov"
    role_label: "VIP"
    avatar_url: ""
    country: "Vietnam"
    city: "Ho Chi Minh City"
    bio_short: "Люблю новые места, практичные тревел-сценарии и городские находки."

  - email: "elena.morozova.seed@example.com"
    account_role: "spacer"
    display_name: "Elena Morozova"
    role_label: "Spacer"
    avatar_url: ""
    country: "Vietnam"
    city: "Da Nang"
    bio_short: "Люблю события, уютные места и сообщества, в которые легко встроиться."

  - email: "fred89059599296@gmail.com"
    account_role: "spacer"
    display_name: "Fred B."
    role_label: "Spacer"
    avatar_url: ""
    country: "Vietnam"
    city: "Da Nang"
    bio_short: "Собираю понятные городские ориентиры, короткие маршруты и спокойные social входы."

________________________________________

profile_projections:
  - email: "admin.operator.seed@example.com"
    display_name: "Admin Operator"
    role_label: "Admin"
    country: "Vietnam"
    city: "Da Nang"
    bio_short: "Поддерживаю экосистему Go2Asia и помогаю запускать новые социальные контуры."

  - email: "oleg.tran.seed@example.com"
    display_name: "Oleg Tran"
    role_label: "PRO"
    country: "Vietnam"
    city: "Da Nang"
    bio_short: "Помогаю адаптироваться во Вьетнаме, собираю локальные сообщества и практичные маршруты."

  - email: "natalia.kim.seed@example.com"
    display_name: "Natalia Kim"
    role_label: "PRO"
    country: "Thailand"
    city: "Phuket"
    bio_short: "Собираю комьюнити по зимовке, жилью и повседневной жизни на Пхукете."

  - email: "alexey.chernov.seed@example.com"
    display_name: "Alexey Chernov"
    role_label: "PRO"
    country: "Vietnam"
    city: "Ho Chi Minh City"
    bio_short: "Люблю события, городские ритмы и живые социальные сценарии."

  - email: "kirill.denisov.seed@example.com"
    display_name: "Kirill Denisov"
    role_label: "VIP"
    country: "Vietnam"
    city: "Ho Chi Minh City"
    bio_short: "Ищу сильные места, маршруты и городские открытия."

  - email: "elena.morozova.seed@example.com"
    display_name: "Elena Morozova"
    role_label: "Spacer"
    country: "Vietnam"
    city: "Da Nang"
    bio_short: "Люблю события, уютные места и сообщества, в которые легко встроиться."

  - email: "fred89059599296@gmail.com"
    display_name: "Fred B."
    role_label: "Spacer"
    country: "Vietnam"
    city: "Da Nang"
    bio_short: "Ищу полезные сообщества, заметные репосты и спокойный ритм жизни в городе."

________________________________________

groups:
  - slug: "danang-city-life"
    title: "Da Nang City Life"
    description: "Публичное сообщество о повседневной жизни, районах, местах и полезных находках в Дананге."
    visibility: "public"
    owner_email: "oleg.tran.seed@example.com"
    moderator_emails: []
    member_emails:
      - "elena.morozova.seed@example.com"
      - "fred89059599296@gmail.com"

  - slug: "asia-city-events"
    title: "Asia City Events"
    description: "Публичная группа вокруг интересных городских событий, встреч и social afterlife после них."
    visibility: "public"
    owner_email: "alexey.chernov.seed@example.com"
    moderator_emails: []
    member_emails:
      - "kirill.denisov.seed@example.com"
      - "elena.morozova.seed@example.com"
      - "fred89059599296@gmail.com"

  - slug: "quest-phu-quoc-weekend"
    title: "Quest Phu Quoc Weekend"
    description: "Сообщество вокруг городских и travel-квестов на Фукуоке: впечатления, отчеты и полезные репосты."
    visibility: "public"
    owner_email: "alexey.chernov.seed@example.com"
    moderator_emails:
      - "oleg.tran.seed@example.com"
    member_emails:
      - "kirill.denisov.seed@example.com"
      - "fred89059599296@gmail.com"

  - slug: "phuket-relocation-circle"
    title: "Phuket Relocation Circle"
    description: "Публичная группа про мягкую адаптацию на Пхукете: районы, жильё, бытовой ритм и полезные точки входа."
    visibility: "public"
    owner_email: "natalia.kim.seed@example.com"
    moderator_emails: []
    member_emails: []

________________________________________

group_membership_matrix:
  - group_slug: "danang-city-life"
    owner_email: "oleg.tran.seed@example.com"
    moderators: []
    active_members:
      - "elena.morozova.seed@example.com"
      - "fred89059599296@gmail.com"

  - group_slug: "asia-city-events"
    owner_email: "alexey.chernov.seed@example.com"
    moderators: []
    active_members:
      - "kirill.denisov.seed@example.com"
      - "elena.morozova.seed@example.com"
      - "fred89059599296@gmail.com"

  - group_slug: "quest-phu-quoc-weekend"
    owner_email: "alexey.chernov.seed@example.com"
    moderators:
      - "oleg.tran.seed@example.com"
    active_members:
      - "kirill.denisov.seed@example.com"
      - "fred89059599296@gmail.com"

  - group_slug: "phuket-relocation-circle"
    owner_email: "natalia.kim.seed@example.com"
    moderators: []
    active_members: []

________________________________________

posts:
  - post_ref: "feed-post-001"
    author_email: "oleg.tran.seed@example.com"
    post_kind: "post"
    visibility: "public"
    group_slug: ""
    text: "Если только приехали в Дананг и не хотите сразу перегружаться, я бы начал с связки: тихий завтрак, один понятный район, одно рабочее кафе и вечерняя прогулка у реки. Такой день лучше даёт почувствовать город, чем беготня по топ-спискам."
    repost_target:
      target_type: ""
      target_hint: ""
    media_refs:
      - "feed-post-media-001"

  - post_ref: "feed-post-002"
    author_email: "elena.morozova.seed@example.com"
    post_kind: "post"
    visibility: "group"
    group_slug: "danang-city-life"
    text: "Для группы: если хочется не просто сидеть дома после работы, а мягко встроиться в городской ритм, очень советую маршрут через набережную, одно кафе и короткую остановку на мосту Дракона. Без туристической суеты, но с ощущением живого города."
    repost_target:
      target_type: ""
      target_hint: ""
    media_refs:
      - "feed-post-media-002"
      - "feed-post-media-003"

  - post_ref: "feed-post-003"
    author_email: "alexey.chernov.seed@example.com"
    post_kind: "repost"
    visibility: "public"
    group_slug: ""
    text: "Хороший формат для тех, кто не любит большие и шумные ивенты. Здесь скорее про лёгкий вход в город и новых людей."
    repost_target:
      target_type: "event"
      target_hint: "pulse-event-danang-community-meetup"
    media_refs: []

  - post_ref: "feed-post-004"
    author_email: "natalia.kim.seed@example.com"
    post_kind: "repost"
    visibility: "public"
    group_slug: ""
    text: "Редкий тип места, которое не кричит «лучшее на острове», а просто честно решает задачу: сесть, поработать, выпить кофе и не устать от шума."
    repost_target:
      target_type: "place"
      target_hint: "atlas-place-phuket-chill-cafe"
    media_refs: []

  - post_ref: "feed-post-005"
    author_email: "kirill.denisov.seed@example.com"
    post_kind: "repost"
    visibility: "group"
    group_slug: "asia-city-events"
    text: "Кинул в группу, потому что это как раз тот случай, когда статья помогает не только подумать, но и реально чуть спокойнее встроиться в новую среду."
    repost_target:
      target_type: "blog_post"
      target_hint: "blog-how-to-start-in-danang"
    media_refs: []

  - post_ref: "feed-post-006"
    author_email: "admin.operator.seed@example.com"
    post_kind: "system"
    visibility: "public"
    group_slug: ""
    text: "В Space Asia стало больше живых городских и групповых сценариев. Если давно только читали, попробуйте один простой шаг: открыть группу по вашему городу, сохранить полезный пост или сделать первый репост объекта экосистемы."
    repost_target:
      target_type: ""
      target_hint: ""
    media_refs: []

  - post_ref: "feed-post-007"
    author_email: "fred89059599296@gmail.com"
    post_kind: "post"
    visibility: "public"
    group_slug: ""
    text: "Чем дольше живу в городском ритме Дананга, тем больше понимаю ценность не громких мест, а понятных опор: кафе, короткий маршрут, одна рабочая точка, одно место для вечера. Хочется собирать вокруг себя именно такие ориентиры."
    repost_target:
      target_type: ""
      target_hint: ""
    media_refs:
      - "feed-post-media-004"

  - post_ref: "feed-post-008"
    author_email: "fred89059599296@gmail.com"
    post_kind: "post"
    visibility: "group"
    group_slug: "quest-phu-quoc-weekend"
    text: "Для группы: понравился формат, где квест не превращается в гонку. Самое приятное — что после прохождения остаётся не только галочка, но и несколько реальных точек, к которым хочется вернуться."
    repost_target:
      target_type: ""
      target_hint: ""
    media_refs:
      - "feed-post-media-005"
      - "feed-post-media-006"

  - post_ref: "feed-post-009"
    author_email: "fred89059599296@gmail.com"
    post_kind: "repost"
    visibility: "public"
    group_slug: ""
    text: "Хороший пример того, как квест может быть не только про прохождение, но и про настроение, ритм и маленькие полезные находки."
    repost_target:
      target_type: "quest"
      target_hint: "quest-phu-quoc-sunset-path"
    media_refs: []

  - post_ref: "feed-post-010"
    author_email: "natalia.kim.seed@example.com"
    post_kind: "post"
    visibility: "group"
    group_slug: "phuket-relocation-circle"
    text: "Для группы: не пытайтесь решить всё за один день. Лучше сначала понять, какой вам нужен ритм — море, работа, тишина, логистика. Уже потом выбирать район и жильё."
    repost_target:
      target_type: ""
      target_hint: ""
    media_refs: []

  - post_ref: "feed-post-011"
    author_email: "alexey.chernov.seed@example.com"
    post_kind: "repost"
    visibility: "public"
    group_slug: ""
    text: "Обычно не люблю тащить listings в social layer просто так, но здесь хорош именно контекст: понятный район, спокойный ритм и логичная бытовая география."
    repost_target:
      target_type: "listing"
      target_hint: "rielt-listing-phuket-kathu-01"
    media_refs: []

  - post_ref: "feed-post-012"
    author_email: "kirill.denisov.seed@example.com"
    post_kind: "post"
    visibility: "public"
    group_slug: ""
    text: "Интересно, что в последнее время больше всего сохраняют не «топ-10 мест», а короткие practical posts: районы, рабочие кафе, события без перегруза и один понятный маршрут на вечер."
    repost_target:
      target_type: ""
      target_hint: ""
    media_refs: []

  - post_ref: "feed-post-013"
    author_email: "oleg.tran.seed@example.com"
    post_kind: "post"
    visibility: "group"
    group_slug: "danang-city-life"
    text: "Для группы собрал короткую связку: район, кафе и вечерняя прогулка, которые дают ощущение «я уже живу здесь», а не просто приехал посмотреть."
    repost_target:
      target_type: ""
      target_hint: ""
    media_refs:
      - "feed-post-media-007"

  - post_ref: "feed-post-014"
    author_email: "elena.morozova.seed@example.com"
    post_kind: "repost"
    visibility: "group"
    group_slug: "asia-city-events"
    text: "В группу кидаю это не ради скидки как таковой, а потому что формат хорошо подходит для продолжения после городских событий."
    repost_target:
      target_type: "partner"
      target_hint: "rf-partner-phuket-breakfast-club"
    media_refs: []

________________________________________

media_registry:
  post_media:
    - media_ref: "feed-post-media-001"
      attached_to_post_ref: "feed-post-001"
      sort_order: 0

    - media_ref: "feed-post-media-002"
      attached_to_post_ref: "feed-post-002"
      sort_order: 0

    - media_ref: "feed-post-media-003"
      attached_to_post_ref: "feed-post-002"
      sort_order: 1

    - media_ref: "feed-post-media-004"
      attached_to_post_ref: "feed-post-007"
      sort_order: 0

    - media_ref: "feed-post-media-005"
      attached_to_post_ref: "feed-post-008"
      sort_order: 0

    - media_ref: "feed-post-media-006"
      attached_to_post_ref: "feed-post-008"
      sort_order: 1

    - media_ref: "feed-post-media-007"
      attached_to_post_ref: "feed-post-013"
      sort_order: 0
