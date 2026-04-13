Space Asia Full Seed Content Pack v1
Project: Go2Asia
Module: Space Asia
Document role: Master seed content pack for Space Asia development, runtime seeding, UI validation, and ecosystem-linked social realism
Status: Draft v0.1
Scope: Full content layer for Space Asia, including users, groups, publications, reactions, activity, saved items, organizer data, ecosystem-linked repost targets, and scenario narratives
________________________________________

1. Purpose
This document is the master seed content pack for Space Asia.
Its purpose is to give Cursor and the repository a realistic, structured content layer for:
•	public and semi-public social rendering 
•	group-centered social flows 
•	posts and reposts 
•	reactions-based communication 
•	activity surfaces 
•	saved items 
•	organizer-linked personal coordination 
•	ecosystem-linked social circulation around Atlas, Pulse, Blog, Quest, RF and Rielt 
This file is not a production dataset.
It is a structured draft seed foundation for development.
________________________________________

2. Master Content Philosophy
This pack should feel:
•	socially believable 
•	region-aware 
•	connected to Go2Asia use cases 
•	diverse by user role 
•	rich enough for UI and runtime development 
•	structured enough for future import tooling 
It should avoid:
•	empty placeholders 
•	fake over-marketing tone 
•	content disconnected from ecosystem modules 
•	copy-paste monotony 
________________________________________

3. Canonical Content Domains Included
This draft includes early content for:
1.	users 
2.	social profile projections 
3.	groups 
4.	group memberships 
5.	posts 
6.	reposts 
7.	repost targets from other modules 
8.	media hints 
9.	reactions 
10.	threads / inquiry examples 
11.	feed examples 
12.	activity items 
13.	saved items 
14.	organizer items 
15.	ecosystem summary signals 
16.	PRO-specific Space layer 
17.	scenarios 
________________________________________

4. Global Filling Rules
4.1 Main geography for v0.1
Current draft emphasizes:
•	Vietnam 
•	Thailand 
•	relocation / city life / events / quests / housing 
4.2 Main language
This draft uses Russian as the dominant user-content language, with occasional English in titles/slugs where product-like.
4.3 Roles used
•	admin 
•	pro 
•	vip 
•	spacer 
4.4 Canonical post types used
•	post 
•	repost 
•	system 
4.5 Visibility used
•	public 
•	group 
•	private 
•	followers 
________________________________________

5. Master Users Registry

users:
  - email: "admin.operator.seed@example.com"
    account_role: "admin"
    display_name: "Admin Operator"
    first_name: "Admin"
    last_name: "Operator"
    role_label: "Admin"
    avatar_hint: "neutral admin portrait"
    avatar_url: ""
    country: "Vietnam"
    city: "Da Nang"
    bio_short: "Поддерживаю экосистему Go2Asia и помогаю запускать новые социальные контуры."
    language: "ru"
    interests: ["community", "operations", "moderation"]
    specialization: ["platform operations", "community setup"]
    profile_notes: "Internal-facing admin identity."

  - email: "oleg.tran.seed@example.com"
    account_role: "pro"
    display_name: "Oleg Tran"
    first_name: "Oleg"
    last_name: "Tran"
    role_label: "PRO"
    avatar_hint: "male, smart casual, city portrait"
    avatar_url: ""
    country: "Vietnam"
    city: "Da Nang"
    bio_short: "Помогаю адаптироваться во Вьетнаме, собираю локальные сообщества и практичные маршруты."
    language: "ru"
    interests: ["relocation", "community", "events", "local life"]
    specialization: ["Vietnam onboarding", "community curation"]
    profile_notes: "Primary PRO identity for community-led group examples."

  - email: "natalia.kim.seed@example.com"
    account_role: "pro"
    display_name: "Natalia Kim"
    first_name: "Natalia"
    last_name: "Kim"
    role_label: "PRO"
    avatar_hint: "female, confident city portrait"
    avatar_url: ""
    country: "Thailand"
    city: "Phuket"
    bio_short: "Собираю комьюнити по зимовке, жилью и повседневной жизни на Пхукете."
    language: "ru"
    interests: ["housing", "Phuket", "relocation", "daily life"]
    specialization: ["Phuket relocation", "housing guidance"]
    profile_notes: "Secondary PRO with Phuket-centered gravity."

  - email: "alexey.chernov.seed@example.com"
    account_role: "pro"
    display_name: "Alexey Chernov"
    first_name: "Alexey"
    last_name: "Chernov"
    role_label: "PRO"
    avatar_hint: "male, urban traveler, documentary style"
    avatar_url: ""
    country: "Vietnam"
    city: "Ho Chi Minh City"
    bio_short: "Интересуюсь городскими маршрутами, встречами, событиями и цифровой повседневностью в ЮВА."
    language: "ru"
    interests: ["events", "city exploration", "digital nomads"]
    specialization: ["event curation", "city discovery"]
    profile_notes: "Good anchor for event-related or city-social content."

  - email: "kirill.denisov.seed@example.com"
    account_role: "vip"
    display_name: "Kirill Denisov"
    first_name: "Kirill"
    last_name: "Denisov"
    role_label: "VIP"
    avatar_hint: "male, active lifestyle portrait"
    avatar_url: ""
    country: "Vietnam"
    city: "Ho Chi Minh City"
    bio_short: "Люблю новые места, практичные тревел-сценарии и городские находки."
    language: "ru"
    interests: ["travel", "places", "events", "food"]
    specialization: ["city experience"]
    profile_notes: "Useful as visible active non-PRO member."

  - email: "svetlana.orlova.seed@example.com"
    account_role: "vip"
    display_name: "Svetlana Orlova"
    first_name: "Svetlana"
    last_name: "Orlova"
    role_label: "VIP"
    avatar_hint: "female, elegant urban traveler"
    avatar_url: ""
    country: "Thailand"
    city: "Phuket"
    bio_short: "Собираю уютные места, события и полезные тревел-находки."
    language: "ru"
    interests: ["cafes", "lifestyle", "events", "travel planning"]
    specialization: ["lifestyle curation"]
    profile_notes: "Good for softer group and saved-item content."

  - email: "irina.belova.seed@example.com"
    account_role: "spacer"
    display_name: "Irina Belova"
    first_name: "Irina"
    last_name: "Belova"
    role_label: "Spacer"
    avatar_hint: "female, traveler, natural portrait"
    avatar_url: ""
    country: "Thailand"
    city: "Phuket"
    bio_short: "Ищу полезные сообщества, места и понятные шаги для комфортной зимовки."
    language: "ru"
    interests: ["relocation", "housing", "community", "travel"]
    specialization: ["newcomer perspective"]
    profile_notes: "Key newcomer persona."

  - email: "marina.lebedeva.seed@example.com"
    account_role: "spacer"
    display_name: "Marina Lebedeva"
    first_name: "Marina"
    last_name: "Lebedeva"
    role_label: "Spacer"
    avatar_hint: "female, calm city portrait"
    avatar_url: ""
    country: "Vietnam"
    city: "Da Nang"
    bio_short: "Люблю понятные практические советы по жизни в городе и полезные места рядом."
    language: "ru"
    interests: ["city life", "cafes", "practical advice"]
    specialization: ["local adaptation"]
    profile_notes: ""

  - email: "dmitry.volkov.seed@example.com"
    account_role: "spacer"
    display_name: "Dmitry Volkov"
    first_name: "Dmitry"
    last_name: "Volkov"
    role_label: "Spacer"
    avatar_hint: "male, casual explorer"
    avatar_url: ""
    country: "Vietnam"
    city: "Da Nang"
    bio_short: "Смотрю на ЮВА через маршруты, районы, жильё и everyday logistics."
    language: "ru"
    interests: ["districts", "housing", "logistics", "routes"]
    specialization: ["practical movement"]
    profile_notes: ""

  - email: "elena.morozova.seed@example.com"
    account_role: "spacer"
    display_name: "Elena Morozova"
    first_name: "Elena"
    last_name: "Morozova"
    role_label: "Spacer"
    avatar_hint: "female, friendly social portrait"
    avatar_url: ""
    country: "Vietnam"
    city: "Da Nang"
    bio_short: "Люблю события, уютные места и сообщества, в которые легко встроиться."
    language: "ru"
    interests: ["events", "community", "cafes"]
    specialization: ["social participation"]
    profile_notes: ""

  - email: "anton.sokolov.seed@example.com"
    account_role: "spacer"
    display_name: "Anton Sokolov"
    first_name: "Anton"
    last_name: "Sokolov"
    role_label: "Spacer"
    avatar_hint: "male, practical traveler"
    avatar_url: ""
    country: "Thailand"
    city: "Phuket"
    bio_short: "Собираю практичные решения: жильё, бюджетные маршруты, полезные контакты."
    language: "ru"
    interests: ["budget travel", "housing", "partner offers"]
    specialization: ["practical planning"]
    profile_notes: ""

  - email: "pavel.zorin.seed@example.com"
    account_role: "spacer"
    display_name: "Pavel Zorin"
    first_name: "Pavel"
    last_name: "Zorin"
    role_label: "Spacer"
    avatar_hint: "male, digital nomad portrait"
    avatar_url: ""
    country: "Vietnam"
    city: "Ho Chi Minh City"
    bio_short: "Интересуюсь цифровой кочевой жизнью, рабочими местами и ритмом больших городов."
    language: "ru"
    interests: ["digital nomads", "coworking", "events", "city life"]
    specialization: ["urban remote lifestyle"]
    profile_notes: ""
________________________________________

6. Social Profile Projections
profile_projections:
  - email: "oleg.tran.seed@example.com"
    display_name: "Oleg Tran"
    role_label: "PRO"
    country: "Vietnam"
    city: "Da Nang"
    bio_short: "Собираю сообщества и практичные маршруты по Вьетнаму."
    avatar_hint: "male, smart casual, city portrait"
    public_profile_theme: "community curator"
    badges_hint: ["local guide", "PRO"]
    trust_signal_hint: ["owns public group", "high local knowledge"]

  - email: "natalia.kim.seed@example.com"
    display_name: "Natalia Kim"
    role_label: "PRO"
    country: "Thailand"
    city: "Phuket"
    bio_short: "Помогаю с зимовкой, жильём и повседневной жизнью на Пхукете."
    avatar_hint: "female, confident city portrait"
    public_profile_theme: "relocation curator"
    badges_hint: ["housing curator", "PRO"]
    trust_signal_hint: ["community leader", "housing-focused"]

  - email: "alexey.chernov.seed@example.com"
    display_name: "Alexey Chernov"
    role_label: "PRO"
    country: "Vietnam"
    city: "Ho Chi Minh City"
    bio_short: "Люблю события, городские ритмы и живые социальные сценарии."
    avatar_hint: "male, urban traveler"
    public_profile_theme: "events and city life"
    badges_hint: ["event curator", "PRO"]
    trust_signal_hint: ["active event voice"]

  - email: "kirill.denisov.seed@example.com"
    display_name: "Kirill Denisov"
    role_label: "VIP"
    country: "Vietnam"
    city: "Ho Chi Minh City"
    bio_short: "Ищу сильные места, маршруты и городские открытия."
    avatar_hint: "male, active lifestyle portrait"
    public_profile_theme: "urban explorer"
    badges_hint: ["VIP"]
    trust_signal_hint: ["active saver", "visible group participant"]

  - email: "irina.belova.seed@example.com"
    display_name: "Irina Belova"
    role_label: "Spacer"
    country: "Thailand"
    city: "Phuket"
    bio_short: "Новичок в ЮВА, ищу людей, маршруты и понятную социальную среду."
    avatar_hint: "female, traveler, natural portrait"
    public_profile_theme: "newcomer"
    badges_hint: []
    trust_signal_hint: ["new member", "active learner"]

________________________________________

7. Optional Social Graph Hints
social_graph_hints:
  follows:
    - follower_email: "irina.belova.seed@example.com"
      followed_email: "natalia.kim.seed@example.com"
    - follower_email: "marina.lebedeva.seed@example.com"
      followed_email: "oleg.tran.seed@example.com"
    - follower_email: "kirill.denisov.seed@example.com"
      followed_email: "alexey.chernov.seed@example.com"
    - follower_email: "anton.sokolov.seed@example.com"
      followed_email: "natalia.kim.seed@example.com"
    - follower_email: "pavel.zorin.seed@example.com"
      followed_email: "alexey.chernov.seed@example.com"

  friend_like_connections:
    - user_a: "irina.belova.seed@example.com"
      user_b: "marina.lebedeva.seed@example.com"
      strength: "medium"
    - user_a: "dmitry.volkov.seed@example.com"
      user_b: "elena.morozova.seed@example.com"
      strength: "weak"
    - user_a: "kirill.denisov.seed@example.com"
      user_b: "pavel.zorin.seed@example.com"
      strength: "medium"

  community_affinity:
    - email: "irina.belova.seed@example.com"
      related_group_slugs: ["phuket-relocation-circle", "budget-sea-routes"]
    - email: "marina.lebedeva.seed@example.com"
      related_group_slugs: ["danang-city-life", "oleg-vietnam-insiders"]
    - email: "pavel.zorin.seed@example.com"
      related_group_slugs: ["hcmc-remote-city", "asia-city-events"]

________________________________________

8. Groups Registry
groups:
  - slug: "danang-city-life"
    title: "Da Nang City Life"
    description: "Публичное сообщество о повседневной жизни, районах, местах и полезных находках в Дананге."
    type_hint: "geo"
    visibility: "public"
    owner_email: "oleg.tran.seed@example.com"
    moderator_emails: ["marina.lebedeva.seed@example.com"]
    member_emails:
      - "dmitry.volkov.seed@example.com"
      - "elena.morozova.seed@example.com"
      - "kirill.denisov.seed@example.com"
    thematic_axis: "local community"
    city: "Da Nang"
    country: "Vietnam"
    linked_context:
      module: "atlas"
      entity_type: "city"
      entity_hint: "Da Nang"
    group_identity_notes: "Geo group for life-in-city conversations."

  - slug: "phuket-relocation-circle"
    title: "Phuket Relocation Circle"
    description: "Сообщество о переезде, зимовке, жилье и повседневных практических вопросах на Пхукете."
    type_hint: "thematic"
    visibility: "public"
    owner_email: "natalia.kim.seed@example.com"
    moderator_emails: ["svetlana.orlova.seed@example.com"]
    member_emails:
      - "irina.belova.seed@example.com"
      - "anton.sokolov.seed@example.com"
      - "marina.lebedeva.seed@example.com"
    thematic_axis: "relocation and housing"
    city: "Phuket"
    country: "Thailand"
    linked_context:
      module: "space"
      entity_type: "topic"
      entity_hint: "relocation"
    group_identity_notes: "Primary thematic relocation group."

  - slug: "oleg-vietnam-insiders"
    title: "Oleg’s Vietnam Insiders"
    description: "Публичная PRO-led группа Олега Трана: инсайты, маршруты, события и социальная жизнь во Вьетнаме."
    type_hint: "pro_led"
    visibility: "public"
    owner_email: "oleg.tran.seed@example.com"
    moderator_emails: ["kirill.denisov.seed@example.com"]
    member_emails:
      - "marina.lebedeva.seed@example.com"
      - "dmitry.volkov.seed@example.com"
      - "pavel.zorin.seed@example.com"
      - "elena.morozova.seed@example.com"
    thematic_axis: "curated local insight"
    city: "Da Nang"
    country: "Vietnam"
    linked_context:
      module: "space"
      entity_type: "pro_profile"
      entity_hint: "oleg.tran.seed@example.com"
    group_identity_notes: "PRO-led public social hub."

  - slug: "asia-city-events"
    title: "Asia City Events"
    description: "Публичная группа вокруг интересных городских событий, встреч и social afterlife после них."
    type_hint: "event_related"
    visibility: "public"
    owner_email: "alexey.chernov.seed@example.com"
    moderator_emails: ["pavel.zorin.seed@example.com"]
    member_emails:
      - "kirill.denisov.seed@example.com"
      - "elena.morozova.seed@example.com"
      - "svetlana.orlova.seed@example.com"
    thematic_axis: "events community"
    city: "Ho Chi Minh City"
    country: "Vietnam"
    linked_context:
      module: "pulse"
      entity_type: "event_series"
      entity_hint: "city meetups"
    group_identity_notes: "Event-centered public social layer."

  - slug: "quest-phu-quoc-weekend"
    title: "Quest Phu Quoc Weekend"
    description: "Сообщество вокруг городских и travel-квестов на Фукуоке: впечатления, отчеты и полезные репосты."
    type_hint: "quest_related"
    visibility: "public"
    owner_email: "alexey.chernov.seed@example.com"
    moderator_emails: ["oleg.tran.seed@example.com"]
    member_emails:
      - "kirill.denisov.seed@example.com"
      - "anton.sokolov.seed@example.com"
      - "irina.belova.seed@example.com"
    thematic_axis: "quest community"
    city: "Phu Quoc"
    country: "Vietnam"
    linked_context:
      module: "quest"
      entity_type: "quest_cluster"
      entity_hint: "Phu Quoc weekend quests"
    group_identity_notes: "Quest-related social layer only, not quest management."

________________________________________

9. Group Membership Matrix
group_membership_matrix:
  - group_slug: "danang-city-life"
    owner_email: "oleg.tran.seed@example.com"
    moderators: ["marina.lebedeva.seed@example.com"]
    active_members:
      - "dmitry.volkov.seed@example.com"
      - "elena.morozova.seed@example.com"
      - "kirill.denisov.seed@example.com"
    pending_members: []
    removed_members: []
    blocked_members: []
    membership_notes: "Healthy public local group."

  - group_slug: "phuket-relocation-circle"
    owner_email: "natalia.kim.seed@example.com"
    moderators: ["svetlana.orlova.seed@example.com"]
    active_members:
      - "irina.belova.seed@example.com"
      - "anton.sokolov.seed@example.com"
      - "marina.lebedeva.seed@example.com"
    pending_members: []
    removed_members: []
    blocked_members: []
    membership_notes: "Primary newcomer-oriented public group."

  - group_slug: "oleg-vietnam-insiders"
    owner_email: "oleg.tran.seed@example.com"
    moderators: ["kirill.denisov.seed@example.com"]
    active_members:
      - "marina.lebedeva.seed@example.com"
      - "dmitry.volkov.seed@example.com"
      - "pavel.zorin.seed@example.com"
      - "elena.morozova.seed@example.com"
    pending_members: []
    removed_members: []
    blocked_members: []
    membership_notes: "PRO-led but still purely social."

  - group_slug: "asia-city-events"
    owner_email: "alexey.chernov.seed@example.com"
    moderators: ["pavel.zorin.seed@example.com"]
    active_members:
      - "kirill.denisov.seed@example.com"
      - "elena.morozova.seed@example.com"
      - "svetlana.orlova.seed@example.com"
    pending_members: []
    removed_members: []
    blocked_members: []
    membership_notes: "Public event afterlife community."

  - group_slug: "quest-phu-quoc-weekend"
    owner_email: "alexey.chernov.seed@example.com"
    moderators: ["oleg.tran.seed@example.com"]
    active_members:
      - "kirill.denisov.seed@example.com"
      - "anton.sokolov.seed@example.com"
      - "irina.belova.seed@example.com"
    pending_members: []
    removed_members: []
    blocked_members: []
    membership_notes: "Quest-related social circulation only."


________________________________________

10. Group Character Notes
group_character_notes:
  - group_slug: "danang-city-life"
    tone: "practical and local"
    posting_style: "useful short posts, places, neighborhood tips"
    member_behavior: "ask, save, repost"
    curator_presence: "moderate"
    moderation_style: "light but tidy"
    social_use_case: "city adaptation"

  - group_slug: "phuket-relocation-circle"
    tone: "supportive and practical"
    posting_style: "questions, housing tips, relocation guidance"
    member_behavior: "newcomers interact with PRO and VIP members"
    curator_presence: "strong"
    moderation_style: "clean and friendly"
    social_use_case: "relocation onboarding"

  - group_slug: "oleg-vietnam-insiders"
    tone: "curated and energetic"
    posting_style: "PRO insights, reposts, event and route suggestions"
    member_behavior: "follow, discuss by repost, save"
    curator_presence: "very strong"
    moderation_style: "signal over noise"
    social_use_case: "trust and social gravity around curator"

  - group_slug: "asia-city-events"
    tone: "urban and dynamic"
    posting_style: "event reposts, after-event impressions, meetup signals"
    member_behavior: "react and circulate"
    curator_presence: "strong"
    moderation_style: "light"
    social_use_case: "event social layer"

  - group_slug: "quest-phu-quoc-weekend"
    tone: "playful and motivating"
    posting_style: "quest reposts, progress vibes, social reports"
    member_behavior: "share steps and inspiration"
    curator_presence: "medium"
    moderation_style: "light"
    social_use_case: "quest social proof"

________________________________________

11. Posts Registry
posts:
  - post_ref: "post-001"
    author_email: "oleg.tran.seed@example.com"
    post_kind: "post"
    visibility: "public"
    group_slug: ""
    text: "Поймал себя на мысли, что новые люди в ЮВА чаще всего ищут не просто места, а понятный социальный контекст. Именно группы это и дают."
    repost_target:
      target_type: ""
      target_hint: ""
    media_refs: []
    created_context: "public reflection"
    notes: "General public social post."

  - post_ref: "post-002"
    author_email: "marina.lebedeva.seed@example.com"
    post_kind: "post"
    visibility: "group"
    group_slug: "danang-city-life"
    text: "Кто недавно был в районе An Thuong? Интересует, где сейчас приятнее всего работать утром и где не слишком шумно."
    repost_target:
      target_type: ""
      target_hint: ""
    media_refs: []
    created_context: "group practical discussion"
    notes: "Simple in-group post."

  - post_ref: "post-003"
    author_email: "dmitry.volkov.seed@example.com"
    post_kind: "repost"
    visibility: "group"
    group_slug: "danang-city-life"
    text: "Сохранил это место как хорошую точку для первой прогулки по городу. Подойдёт тем, кто хочет почувствовать Дананг без хаоса."
    repost_target:
      target_type: "place"
      target_hint: "atlas-place-danang-riverside-walk"
    media_refs: []
    created_context: "place repost into geo group"
    notes: ""

  - post_ref: "post-004"
    author_email: "natalia.kim.seed@example.com"
    post_kind: "post"
    visibility: "group"
    group_slug: "phuket-relocation-circle"
    text: "Для новичков на Пхукете советую не искать «идеальное жильё за один день». Лучше сначала понять район, ритм и повседневные расстояния."
    repost_target:
      target_type: ""
      target_hint: ""
    media_refs: []
    created_context: "group practical guidance"
    notes: "Owner post in thematic group."

  - post_ref: "post-005"
    author_email: "irina.belova.seed@example.com"
    post_kind: "post"
    visibility: "group"
    group_slug: "phuket-relocation-circle"
    text: "Мне очень не хватает простой карты районов с пояснениями «для кого этот район». Пока всё собираю по кусочкам."
    repost_target:
      target_type: ""
      target_hint: ""
    media_refs: []
    created_context: "newcomer voice"
    notes: ""

  - post_ref: "post-006"
    author_email: "anton.sokolov.seed@example.com"
    post_kind: "repost"
    visibility: "group"
    group_slug: "phuket-relocation-circle"
    text: "Вот этот листинг выглядит интересно именно как временная база на первый месяц. Не luxury, но зато понятная логистика."
    repost_target:
      target_type: "listing"
      target_hint: "rielt-listing-phuket-kathu-01"
    media_refs: []
    created_context: "listing repost into thematic group"
    notes: ""

  - post_ref: "post-007"
    author_email: "oleg.tran.seed@example.com"
    post_kind: "post"
    visibility: "group"
    group_slug: "oleg-vietnam-insiders"
    text: "Собрал для своих людей три простых сценария на выходные в Дананге: городской, спокойный и «показать город другу»."
    repost_target:
      target_type: ""
      target_hint: ""
    media_refs: []
    created_context: "PRO-led group curation"
    notes: ""

  - post_ref: "post-008"
    author_email: "kirill.denisov.seed@example.com"
    post_kind: "repost"
    visibility: "group"
    group_slug: "oleg-vietnam-insiders"
    text: "Это событие выглядит как хороший повод не сидеть дома и наконец-то познакомиться с людьми офлайн."
    repost_target:
      target_type: "event"
      target_hint: "pulse-event-danang-community-meetup"
    media_refs: []
    created_context: "event repost into pro-led group"
    notes: ""

  - post_ref: "post-009"
    author_email: "alexey.chernov.seed@example.com"
    post_kind: "post"
    visibility: "group"
    group_slug: "asia-city-events"
    text: "Хочу, чтобы эта группа была не только про афиши, но и про social afterlife событий: что понравилось, куда пошли после, кого встретили."
    repost_target:
      target_type: ""
      target_hint: ""
    media_refs: []
    created_context: "group positioning"
    notes: ""

  - post_ref: "post-010"
    author_email: "elena.morozova.seed@example.com"
    post_kind: "repost"
    visibility: "group"
    group_slug: "asia-city-events"
    text: "На такое я бы сходила даже просто ради новой компании. Плюс место выглядит уютно."
    repost_target:
      target_type: "event"
      target_hint: "pulse-event-hcmc-rooftop-social"
    media_refs: []
    created_context: "event repost"
    notes: ""

  - post_ref: "post-011"
    author_email: "alexey.chernov.seed@example.com"
    post_kind: "repost"
    visibility: "group"
    group_slug: "quest-phu-quoc-weekend"
    text: "Этот квест как раз хорош для тех, кто хочет почувствовать остров не как турист, а как исследователь."
    repost_target:
      target_type: "quest"
      target_hint: "quest-phu-quoc-sunset-path"
    media_refs: []
    created_context: "quest repost"
    notes: ""

  - post_ref: "post-012"
    author_email: "kirill.denisov.seed@example.com"
    post_kind: "post"
    visibility: "group"
    group_slug: "quest-phu-quoc-weekend"
    text: "Мне нравится идея делать после прохождения квеста не отчёт ради галочки, а короткий живой пост с ощущением маршрута."
    repost_target:
      target_type: ""
      target_hint: ""
    media_refs: []
    created_context: "quest social reflection"
    notes: ""

  - post_ref: "post-013"
    author_email: "irina.belova.seed@example.com"
    post_kind: "post"
    visibility: "private"
    group_slug: ""
    text: "Надо перестать пытаться разобраться во всём сразу и просто выбрать одну группу, где мне комфортно задавать вопросы."
    repost_target:
      target_type: ""
      target_hint: ""
    media_refs: []
    created_context: "private reflection"
    notes: ""

  - post_ref: "post-014"
    author_email: "irina.belova.seed@example.com"
    post_kind: "post"
    visibility: "followers"
    group_slug: ""
    text: "Иногда кажется, что лучший способ адаптироваться — это не искать идеальный план, а просто начать говорить с людьми."
    repost_target:
      target_type: ""
      target_hint: ""
    media_refs: []
    created_context: "followers post"
    notes: ""

  - post_ref: "post-015"
    author_email: "admin.operator.seed@example.com"
    post_kind: "system"
    visibility: "public"
    group_slug: ""
    text: "В Space Asia продолжают появляться новые группы и сценарии социального опыта вокруг объектов Go2Asia."
    repost_target:
      target_type: ""
      target_hint: ""
    media_refs: []
    created_context: "system signal"
    notes: ""


________________________________________

12. Group Posts Registry
group_posts:
  - post_ref: "post-002"
    group_slug: "danang-city-life"
    author_email: "marina.lebedeva.seed@example.com"
    post_kind: "post"
    visibility: "group"
    text: "Кто недавно был в районе An Thuong? Интересует, где сейчас приятнее всего работать утром и где не слишком шумно."
    repost_target:
      target_type: ""
      target_hint: ""
    media_refs: []
    notes: "Simple group question-like post."

  - post_ref: "post-003"
    group_slug: "danang-city-life"
    author_email: "dmitry.volkov.seed@example.com"
    post_kind: "repost"
    visibility: "group"
    text: "Сохранил это место как хорошую точку для первой прогулки по городу."
    repost_target:
      target_type: "place"
      target_hint: "atlas-place-danang-riverside-walk"
    media_refs: []
    notes: ""

  - post_ref: "post-004"
    group_slug: "phuket-relocation-circle"
    author_email: "natalia.kim.seed@example.com"
    post_kind: "post"
    visibility: "group"
    text: "Для новичков на Пхукете советую не искать «идеальное жильё за один день»."
    repost_target:
      target_type: ""
      target_hint: ""
    media_refs: []
    notes: ""

  - post_ref: "post-006"
    group_slug: "phuket-relocation-circle"
    author_email: "anton.sokolov.seed@example.com"
    post_kind: "repost"
    visibility: "group"
    text: "Вот этот листинг выглядит интересно именно как временная база на первый месяц."
    repost_target:
      target_type: "listing"
      target_hint: "rielt-listing-phuket-kathu-01"
    media_refs: []
    notes: ""

  - post_ref: "post-007"
    group_slug: "oleg-vietnam-insiders"
    author_email: "oleg.tran.seed@example.com"
    post_kind: "post"
    visibility: "group"
    text: "Собрал для своих людей три простых сценария на выходные в Дананге."
    repost_target:
      target_type: ""
      target_hint: ""
    media_refs: []
    notes: ""

  - post_ref: "post-008"
    group_slug: "oleg-vietnam-insiders"
    author_email: "kirill.denisov.seed@example.com"
    post_kind: "repost"
    visibility: "group"
    text: "Это событие выглядит как хороший повод познакомиться с людьми офлайн."
    repost_target:
      target_type: "event"
      target_hint: "pulse-event-danang-community-meetup"
    media_refs: []
    notes: ""

  - post_ref: "post-009"
    group_slug: "asia-city-events"
    author_email: "alexey.chernov.seed@example.com"
    post_kind: "post"
    visibility: "group"
    text: "Хочу, чтобы эта группа была не только про афиши, но и про social afterlife событий."
    repost_target:
      target_type: ""
      target_hint: ""
    media_refs: []
    notes: ""

  - post_ref: "post-011"
    group_slug: "quest-phu-quoc-weekend"
    author_email: "alexey.chernov.seed@example.com"
    post_kind: "repost"
    visibility: "group"
    text: "Этот квест хорош для тех, кто хочет почувствовать остров как исследователь."
    repost_target:
      target_type: "quest"
      target_hint: "quest-phu-quoc-sunset-path"
    media_refs: []
    notes: ""


________________________________________

13. Private and Followers-Only Posts
non_public_posts:
  private_posts:
    - post_ref: "post-013"
      author_email: "irina.belova.seed@example.com"
      visibility: "private"
      text: "Надо перестать пытаться разобраться во всём сразу и просто выбрать одну группу, где мне комфортно задавать вопросы."
      notes: "Source private note for later share-to-group case."

  followers_posts:
    - post_ref: "post-014"
      author_email: "irina.belova.seed@example.com"
      visibility: "followers"
      text: "Иногда кажется, что лучший способ адаптироваться — это не искать идеальный план, а просто начать говорить с людьми."
      notes: "Semi-public social reflection."


________________________________________

14. Private → Group Sharing Cases
private_to_group_sharing_cases:
  - source_private_post_ref: "post-013"
    author_email: "irina.belova.seed@example.com"
    target_group_slug: "phuket-relocation-circle"
    resulting_action_type: "publish_to_group"
    public_text_version: "Поняла, что лучший способ освоиться — это выбрать одну понятную группу и начать задавать вопросы без стеснения."
    notes: "Illustrates explicit private-to-group sharing truth."


________________________________________

15. Repost Targets from Other Modules
repost_targets:
  blog_posts:
    - target_hint: "blog-how-to-start-in-danang"
      title: "Как мягко встроиться в жизнь Дананга"
      subtitle: "Практический блог-пост для новичков"
      city: "Da Nang"
      country: "Vietnam"
      image_hint: "city morning street"
      route_hint: "/blog/how-to-start-in-danang"

  places:
    - target_hint: "atlas-place-danang-riverside-walk"
      title: "Da Nang Riverside Walk"
      subtitle: "Спокойный городской маршрут у реки"
      city: "Da Nang"
      country: "Vietnam"
      image_hint: "riverside evening promenade"
      route_hint: "/atlas/vietnam/da-nang/places/riverside-walk"

    - target_hint: "atlas-place-phuket-chill-cafe"
      title: "Phuket Chill Cafe"
      subtitle: "Спокойное место для работы и встреч"
      city: "Phuket"
      country: "Thailand"
      image_hint: "cozy cafe interior"
      route_hint: "/atlas/thailand/phuket/places/chill-cafe"

  events:
    - target_hint: "pulse-event-danang-community-meetup"
      title: "Da Nang Community Meetup"
      subtitle: "Открытая встреча для новых и старых жителей города"
      city: "Da Nang"
      country: "Vietnam"
      image_hint: "rooftop meetup"
      route_hint: "/pulse/events/danang-community-meetup"

    - target_hint: "pulse-event-hcmc-rooftop-social"
      title: "HCMC Rooftop Social"
      subtitle: "Вечерняя городская встреча с неформальным нетворкингом"
      city: "Ho Chi Minh City"
      country: "Vietnam"
      image_hint: "rooftop night gathering"
      route_hint: "/pulse/events/hcmc-rooftop-social"

  quests:
    - target_hint: "quest-phu-quoc-sunset-path"
      title: "Phu Quoc Sunset Path"
      subtitle: "Лёгкий городской маршрут-квест на закате"
      city: "Phu Quoc"
      country: "Vietnam"
      image_hint: "sunset path by sea"
      route_hint: "/quest/phu-quoc-sunset-path"

  partners:
    - target_hint: "rf-partner-phuket-breakfast-club"
      title: "Phuket Breakfast Club"
      subtitle: "Партнёрское кафе с хорошими утренними предложениями"
      city: "Phuket"
      country: "Thailand"
      image_hint: "breakfast cafe"
      route_hint: "/rf/partners/phuket-breakfast-club"

  listings:
    - target_hint: "rielt-listing-phuket-kathu-01"
      title: "1BR apartment in Kathu"
      subtitle: "Хороший вариант на первый месяц адаптации"
      city: "Phuket"
      country: "Thailand"
      image_hint: "simple bright apartment"
      route_hint: "/rielt/listings/phuket-kathu-01"

  space_posts:
    - target_hint: "space-post-oleg-weekend-routes"
      source_post_ref: "post-007"
      note: "Can be reused as native Space repost target later."

________________________________________

16. Media Registry
media_registry:
  avatars:
    - media_ref: "avatar-oleg"
      owner_email: "oleg.tran.seed@example.com"
      media_type: "avatar"
      visual_hint: "male, smart casual, city portrait"
      route_hint: ""

    - media_ref: "avatar-natalia"
      owner_email: "natalia.kim.seed@example.com"
      media_type: "avatar"
      visual_hint: "female, confident city portrait"
      route_hint: ""

    - media_ref: "avatar-irina"
      owner_email: "irina.belova.seed@example.com"
      media_type: "avatar"
      visual_hint: "female, traveler, natural portrait"
      route_hint: ""

  post_media:
    - media_ref: "post-media-001"
      attached_to_post_ref: "post-007"
      media_type: "cover"
      visual_hint: "three weekend route cards over city background"
      sort_order: 0

    - media_ref: "post-media-002"
      attached_to_post_ref: "post-010"
      media_type: "photo"
      visual_hint: "rooftop lights at night"
      sort_order: 0

  repost_previews:
    - media_ref: "preview-danang-riverside"
      target_hint: "atlas-place-danang-riverside-walk"
      media_type: "preview"
      visual_hint: "river, walkway, evening lights"

    - media_ref: "preview-hcmc-rooftop"
      target_hint: "pulse-event-hcmc-rooftop-social"
      media_type: "preview"
      visual_hint: "rooftop city skyline"

    - media_ref: "preview-phuquoc-quest"
      target_hint: "quest-phu-quoc-sunset-path"
      media_type: "preview"
      visual_hint: "sunset sea path"

________________________________________

17. Reactions Registry
reactions:
  - reaction_ref: "reaction-001"
    actor_email: "kirill.denisov.seed@example.com"
    reaction_type: "like"
    target_type: "space_post"
    target_ref: "post-007"
    payload:
      text: ""
      rating_value: null
      linked_post_ref: ""
      thread_ref: ""
    notes: "Simple positive social signal."

  - reaction_ref: "reaction-002"
    actor_email: "irina.belova.seed@example.com"
    reaction_type: "bookmark"
    target_type: "listing"
    target_ref: "rielt-listing-phuket-kathu-01"
    payload:
      text: ""
      rating_value: null
      linked_post_ref: ""
      thread_ref: ""
    notes: "Practical saved-for-later action."

  - reaction_ref: "reaction-003"
    actor_email: "elena.morozova.seed@example.com"
    reaction_type: "repost"
    target_type: "event"
    target_ref: "pulse-event-hcmc-rooftop-social"
    payload:
      text: "Хороший формат для тех, кто хочет мягко встроиться в городскую тусовку."
      rating_value: null
      linked_post_ref: "post-010"
      thread_ref: ""
    notes: "Repost with opinion."

  - reaction_ref: "reaction-004"
    actor_email: "anton.sokolov.seed@example.com"
    reaction_type: "short_review"
    target_type: "partner"
    target_ref: "rf-partner-phuket-breakfast-club"
    payload:
      text: "Удобное место для утренней встречи и не слишком шумно."
      rating_value: 4
      linked_post_ref: ""
      thread_ref: ""
    notes: ""

  - reaction_ref: "reaction-005"
    actor_email: "irina.belova.seed@example.com"
    reaction_type: "question"
    target_type: "listing"
    target_ref: "rielt-listing-phuket-kathu-01"
    payload:
      text: "Подойдёт ли этот вариант как база на первый месяц без байка?"
      rating_value: null
      linked_post_ref: ""
      thread_ref: "thread-001"
    notes: ""

________________________________________

18. Thread / Inquiry Examples
threads:
  - thread_ref: "thread-001"
    thread_type: "question"
    target_type: "listing"
    target_ref: "rielt-listing-phuket-kathu-01"
    initiator_email: "irina.belova.seed@example.com"
    recipient_hint: "listing owner or operator"
    opening_text: "Подойдёт ли этот вариант как база на первый месяц без байка?"
    replies:
      - author_email: "natalia.kim.seed@example.com"
        text: "Как стартовый вариант — да, но важно смотреть на ежедневную логистику и ближайшие нужные точки."
      - author_email: "anton.sokolov.seed@example.com"
        text: "Я бы ещё проверил, как там с пешей доступностью магазинов и коворкинга."
    notes: "No-chat inquiry model example."

  - thread_ref: "thread-002"
    thread_type: "question"
    target_type: "space_post"
    target_ref: "post-002"
    initiator_email: "elena.morozova.seed@example.com"
    recipient_hint: "post author"
    opening_text: "Если найдёшь хорошие утренние места, потом собери, пожалуйста, в один короткий список."
    replies:
      - author_email: "marina.lebedeva.seed@example.com"
        text: "Да, как раз хочу сделать подборку в формате «тихое утро в Дананге»."
    notes: "Question/reply around social publication."

________________________________________

19. Feed Examples
feed_examples:
  home_feed:
    - item_ref: "home-001"
      reason: "group_post"
      post_ref: "post-004"
      notes: "Public thematic group guidance."

    - item_ref: "home-002"
      reason: "repost"
      post_ref: "post-008"
      notes: "Event repost from PRO-led group."

    - item_ref: "home-003"
      reason: "author_post"
      post_ref: "post-001"
      notes: "Public reflection from followed PRO."

    - item_ref: "home-004"
      reason: "group_post"
      post_ref: "post-009"
      notes: "Event community positioning post."

    - item_ref: "home-005"
      reason: "system"
      post_ref: "post-015"
      notes: "System-level signal."

  profile_feed:
    - profile_owner_email: "oleg.tran.seed@example.com"
      items:
        - item_ref: "profile-001"
          reason: "author_post"
          post_ref: "post-001"
        - item_ref: "profile-002"
          reason: "group_post"
          post_ref: "post-007"

  group_feed:
    - group_slug: "phuket-relocation-circle"
      items:
        - item_ref: "group-001"
          reason: "group_post"
          post_ref: "post-004"
        - item_ref: "group-002"
          reason: "group_post"
          post_ref: "post-005"
        - item_ref: "group-003"
          reason: "repost"
          post_ref: "post-006"

    - group_slug: "oleg-vietnam-insiders"
      items:
        - item_ref: "group-004"
          reason: "group_post"
          post_ref: "post-007"
        - item_ref: "group-005"
          reason: "repost"
          post_ref: "post-008"

  activity_feed:
    - owner_email: "oleg.tran.seed@example.com"
      items:
        - item_ref: "activity-001"
          type: "like_received"
          linked_ref: "post-007"
          notes: "Kirill liked Oleg’s group post."
        - item_ref: "activity-002"
          type: "group_join"
          linked_ref: "oleg-vietnam-insiders"
          notes: "New member joined curator-led group."

________________________________________

20. Activity Registry
activity_items:
  - activity_ref: "activity-001"
    owner_email: "oleg.tran.seed@example.com"
    activity_type: "like_received"
    source_email: "kirill.denisov.seed@example.com"
    related_post_ref: "post-007"
    related_group_slug: "oleg-vietnam-insiders"
    related_target_type: "space_post"
    related_target_ref: "post-007"
    text: "Kirill liked your group post."
    notes: ""

  - activity_ref: "activity-002"
    owner_email: "natalia.kim.seed@example.com"
    activity_type: "question_received"
    source_email: "irina.belova.seed@example.com"
    related_post_ref: ""
    related_group_slug: "phuket-relocation-circle"
    related_target_type: "listing"
    related_target_ref: "rielt-listing-phuket-kathu-01"
    text: "Irina asked a practical question about a saved listing."
    notes: ""

  - activity_ref: "activity-003"
    owner_email: "alexey.chernov.seed@example.com"
    activity_type: "repost_received"
    source_email: "elena.morozova.seed@example.com"
    related_post_ref: "post-010"
    related_group_slug: "asia-city-events"
    related_target_type: "event"
    related_target_ref: "pulse-event-hcmc-rooftop-social"
    text: "Your event-related social flow received a repost with opinion."
    notes: ""

  - activity_ref: "activity-004"
    owner_email: "irina.belova.seed@example.com"
    activity_type: "group_join"
    source_email: ""
    related_post_ref: ""
    related_group_slug: "phuket-relocation-circle"
    related_target_type: "space_group"
    related_target_ref: "phuket-relocation-circle"
    text: "You joined Phuket Relocation Circle."
    notes: ""

________________________________________

21. Saved Items Registry
saved_items:
  - owner_email: "irina.belova.seed@example.com"
    saved_type: "listing"
    target_ref: "rielt-listing-phuket-kathu-01"
    notes: "Possible first-month housing option."

  - owner_email: "kirill.denisov.seed@example.com"
    saved_type: "event"
    target_ref: "pulse-event-danang-community-meetup"
    notes: "Social meetup worth considering."

  - owner_email: "svetlana.orlova.seed@example.com"
    saved_type: "place"
    target_ref: "atlas-place-phuket-chill-cafe"
    notes: "Useful for quiet work mornings."

  - owner_email: "anton.sokolov.seed@example.com"
    saved_type: "partner"
    target_ref: "rf-partner-phuket-breakfast-club"
    notes: "Practical breakfast meeting spot."

  - owner_email: "pavel.zorin.seed@example.com"
    saved_type: "post"
    target_ref: "post-007"
    notes: "Weekend route idea worth revisiting."

________________________________________

22. Organizer Registry
organizer_items:
  - item_ref: "org-001"
    owner_email: "irina.belova.seed@example.com"
    type: "saved_action"
    title: "Вернуться к варианту жилья в Kathu"
    description: "Проверить, подходит ли как база на первый месяц."
    source_module: "rielt"
    linked_entity_type: "listing"
    linked_entity_ref: "rielt-listing-phuket-kathu-01"
    status: "pending"
    priority: "high"
    due_at: ""
    remind_at: ""
    created_by: "user"
    execution_mode: "manual"
    can_be_automated: false
    requires_confirmation: true
    notes: ""

  - item_ref: "org-002"
    owner_email: "kirill.denisov.seed@example.com"
    type: "reminder"
    title: "Не забыть про Da Nang Community Meetup"
    description: "Проверить время и формат встречи."
    source_module: "pulse"
    linked_entity_type: "event"
    linked_entity_ref: "pulse-event-danang-community-meetup"
    status: "planned"
    priority: "medium"
    due_at: ""
    remind_at: ""
    created_by: "system"
    execution_mode: "assisted"
    can_be_automated: true
    requires_confirmation: true
    notes: ""

  - item_ref: "org-003"
    owner_email: "oleg.tran.seed@example.com"
    type: "growth_goal"
    title: "Поддерживать живой ритм в PRO-led группе"
    description: "Не реже двух содержательных публикаций в неделю."
    source_module: "space"
    linked_entity_type: "group"
    linked_entity_ref: "oleg-vietnam-insiders"
    status: "planned"
    priority: "medium"
    due_at: ""
    remind_at: ""
    created_by: "ai"
    execution_mode: "assisted"
    can_be_automated: false
    requires_confirmation: true
    notes: ""

  - item_ref: "org-004"
    owner_email: "anton.sokolov.seed@example.com"
    type: "follow_up"
    title: "Посмотреть breakfast spot после обсуждения в группе"
    description: "Сравнить с другими утренними точками на Пхукете."
    source_module: "rf"
    linked_entity_type: "partner"
    linked_entity_ref: "rf-partner-phuket-breakfast-club"
    status: "planned"
    priority: "low"
    due_at: ""
    remind_at: ""
    created_by: "user"
    execution_mode: "manual"
    can_be_automated: false
    requires_confirmation: true
    notes: ""

________________________________________

23. Ecosystem Signals Registry
ecosystem_signals:
  balance_widgets:
    - owner_email: "kirill.denisov.seed@example.com"
      points_summary: "540 Points"
      g2a_summary: "12 G2A pending visibility"
      notes: "Light progress signal only."

  nft_badges:
    - owner_email: "oleg.tran.seed@example.com"
      badge_summary: "2 visible community badges"
      notes: "Used only as summary surface in Space."

  referrals:
    - owner_email: "natalia.kim.seed@example.com"
      referral_summary: "3 active referral links in ecosystem"
      notes: ""

  vouchers:
    - owner_email: "anton.sokolov.seed@example.com"
      voucher_summary: "1 active breakfast voucher"
      notes: ""

  quest_progress:
    - owner_email: "kirill.denisov.seed@example.com"
      progress_summary: "1 quest active, 2 steps left"
      notes: ""

  applications_inquiries:
    - owner_email: "irina.belova.seed@example.com"
      summary: "1 housing inquiry awaiting follow-up"
      notes: ""

________________________________________

24. PRO-Specific Space Layer
pro_space_layer:
  pro_profiles:
    - email: "oleg.tran.seed@example.com"
      public_identity_note: "Local curator with community gravity around Vietnam practical life."
      curator_focus: "Vietnam onboarding and curated social context"
      main_group_slugs: ["danang-city-life", "oleg-vietnam-insiders"]
      social_style: "practical, high-signal, warm"

    - email: "natalia.kim.seed@example.com"
      public_identity_note: "Relocation-oriented curator around Phuket daily life."
      curator_focus: "housing, adaptation, practical everyday fit"
      main_group_slugs: ["phuket-relocation-circle"]
      social_style: "supportive, grounded, practical"

  pro_posts:
    - post_ref: "post-007"
      author_email: "oleg.tran.seed@example.com"
      visibility: "group"
      text: "Собрал для своих людей три простых сценария на выходные в Дананге."
      notes: "Classic PRO social value post."

    - post_ref: "post-004"
      author_email: "natalia.kim.seed@example.com"
      visibility: "group"
      text: "Для новичков на Пхукете советую сначала понять район, а не сразу выбирать «идеальное жильё»."
      notes: "PRO guidance post."

  pro_group_links:
    - email: "oleg.tran.seed@example.com"
      group_slug: "oleg-vietnam-insiders"
      relation: "owner"
    - email: "natalia.kim.seed@example.com"
      group_slug: "phuket-relocation-circle"
      relation: "owner"
    - email: "alexey.chernov.seed@example.com"
      group_slug: "asia-city-events"
      relation: "owner"

  pro_social_signals:
    - email: "oleg.tran.seed@example.com"
      summary: "Visible as a curator through public group presence and practical posts."
      notes: ""

    - email: "natalia.kim.seed@example.com"
      summary: "Visible as relocation-focused PRO through housing and adaptation discussions."
      notes: ""

________________________________________

25. Optional Moderation / Trust Seed Cases
moderation_cases:
  - case_ref: "mod-001"
    post_ref: "post-015"
    issue_type: "off_topic"
    status_hint: "flagged"
    notes: "Only optional future moderation seed. Not for current baseline."

________________________________________

26. Optional Assistant-Layer Seed Context
assistant_seed_context:
  reminders:
    - owner_email: "irina.belova.seed@example.com"
      prompt_hint: "Напомнить через два дня вернуться к shortlist жилья."
      linked_item_ref: "org-001"

  suggestions:
    - owner_email: "kirill.denisov.seed@example.com"
      suggestion_text: "Ты сохранил событие и активен в городской группе — показать nearby places до/после встречи?"
      linked_target_ref: "pulse-event-danang-community-meetup"

  automations:
    - owner_email: "oleg.tran.seed@example.com"
      automation_title: "После публикации события предложить репост в PRO-led группу"
      trigger_hint: "new event appears in curated flow"
      action_hint: "suggest repost into oleg-vietnam-insiders"
      notes: "Future assistant-layer seed only."

________________________________________

27. Scenario Pack
scenarios:
  - scenario_ref: "scenario-001"
    title: "New spacer joins relocation group"
    description: "Ирина как новичок вступает в публичную группу про релокацию на Пхукете и сразу получает полезный социальный контекст."
    involved_users:
      - "irina.belova.seed@example.com"
      - "natalia.kim.seed@example.com"
      - "anton.sokolov.seed@example.com"
    involved_groups:
      - "phuket-relocation-circle"
    involved_posts:
      - "post-004"
      - "post-005"
      - "post-006"
    involved_targets:
      - "rielt-listing-phuket-kathu-01"
    expected_social_effect: "Группа читается как реальное сообщество, а не просто фид."
    expected_ui_surfaces:
      - "group identity"
      - "group feed"
      - "activity"
    notes: ""

  - scenario_ref: "scenario-002"
    title: "PRO publishes inside PRO-led group"
    description: "Олег публикует полезный пост в своей публичной группе и усиливает доверие через curated social presence."
    involved_users:
      - "oleg.tran.seed@example.com"
      - "kirill.denisov.seed@example.com"
    involved_groups:
      - "oleg-vietnam-insiders"
    involved_posts:
      - "post-007"
      - "post-008"
    involved_targets:
      - "pulse-event-danang-community-meetup"
    expected_social_effect: "PRO-led group читается как social layer, а не как admin-console."
    expected_ui_surfaces:
      - "group feed"
      - "profile feed"
      - "activity"
    notes: ""

  - scenario_ref: "scenario-003"
    title: "User reposts place into geo group"
    description: "Дмитрий делает репост места в городской группе Дананга, превращая объект Atlas в социально переживаемый контекст."
    involved_users:
      - "dmitry.volkov.seed@example.com"
      - "marina.lebedeva.seed@example.com"
    involved_groups:
      - "danang-city-life"
    involved_posts:
      - "post-002"
      - "post-003"
    involved_targets:
      - "atlas-place-danang-riverside-walk"
    expected_social_effect: "Atlas object becomes lived social signal."
    expected_ui_surfaces:
      - "group feed"
      - "post card"
      - "repost preview"
    notes: ""

  - scenario_ref: "scenario-004"
    title: "Event afterlife in event group"
    description: "Событие не живёт только как карточка Pulse, а получает социальное продолжение в event-related group."
    involved_users:
      - "alexey.chernov.seed@example.com"
      - "elena.morozova.seed@example.com"
    involved_groups:
      - "asia-city-events"
    involved_posts:
      - "post-009"
      - "post-010"
    involved_targets:
      - "pulse-event-hcmc-rooftop-social"
    expected_social_effect: "Space acts as social afterlife layer for Pulse."
    expected_ui_surfaces:
      - "group feed"
      - "activity"
      - "repost preview"
    notes: ""

  - scenario_ref: "scenario-005"
    title: "Private thought becomes group-visible"
    description: "Личная заметка Ирины не остаётся замкнутой навсегда, а осознанно превращается в публикацию для группы."
    involved_users:
      - "irina.belova.seed@example.com"
    involved_groups:
      - "phuket-relocation-circle"
    involved_posts:
      - "post-013"
    involved_targets: []
    expected_social_effect: "private -> group as explicit user action becomes conceptually visible."
    expected_ui_surfaces:
      - "composer"
      - "group feed"
    notes: "Product truth example, not fixed storage tactic."

  - scenario_ref: "scenario-006"
    title: "Listing becomes social and practical object"
    description: "Листинг жилья получает не только bookmark, но и вопрос, follow-up и социальное обсуждение в тематической группе."
    involved_users:
      - "irina.belova.seed@example.com"
      - "anton.sokolov.seed@example.com"
      - "natalia.kim.seed@example.com"
    involved_groups:
      - "phuket-relocation-circle"
    involved_posts:
      - "post-006"
    involved_targets:
      - "rielt-listing-phuket-kathu-01"
    expected_social_effect: "Rielt object enters both social and organizer layer."
    expected_ui_surfaces:
      - "repost preview"
      - "saved"
      - "organizer"
      - "thread/inquiry"
    notes: ""

________________________________________

28. Content Completion Checklist
completion_checklist:
  users_seeded: true
  profile_projections_seeded: true
  groups_seeded: true
  memberships_seeded: true
  posts_seeded: true
  repost_targets_seeded: true
  media_seeded: true
  reactions_seeded: true
  threads_seeded: true
  feed_examples_seeded: true
  activity_seeded: true
  saved_items_seeded: true
  organizer_seeded: true
  ecosystem_signals_seeded: true
  pro_layer_seeded: true
  scenarios_seeded: true


________________________________________

29. Notes for Next Iteration
Для версии v0.2 логично расширить:
•	ещё 5–10 пользователей 
•	private/invite-only groups 
•	больше post media 
•	richer activity graph 
•	more reactions per post 
•	more Quest / RF / Blog reposts 
•	отдельные public group pages and list seeds 
•	discovery/search hints 
•	more organizer lifecycle variety 

30. Recommended Repository Placement
content/space/Space-Asia-Full-Seed-Content-Pack-v1.md
________________________________________
31. Final Summary
Этот draft уже даёт Cursor не пустую схему, а настоящую социальную среду, на которую можно опираться при разработке Space Asia.

