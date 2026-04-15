# Space-Asia-Community-Discovery-Content-Pack-v1

**Project:** Go2Asia  
**Module:** Space Asia  
**Document role:** Community root and group discovery experience content pack for Space Asia v3  
**Status:** Draft v1  
**Scope:** Product content source for `/space/community` as structured community entry surface, not just a group-content feed

---

# 1. Purpose

This document defines the **community discovery-specific frontend experience content** for Space Asia v3.

It exists to help restore the intended frontend/product direction:

> **Community = structure of participation inside Space**  
> not  
> **Community = another feed**

This document should be used for:

- frontend planning;
- UX/UI prototyping;
- content-driven community root design;
- Cursor planning and implementation passes;
- separation between current group-feed baseline and target community-discovery model.

It complements but does not replace:

- `Space-Asia-Full-Seed-Content-Pack-v1.md`
- `space_ui_ux_concept_v_3.md`
- `space_frontend_information_architecture_v_1.md`
- `space_ui_backend_mapping_v_1.md`
- `Space-Asia-Thematic-Groups-Canon-v1.md`

---

# 2. Community Definition

## 2.1 What `/space/community` should be

`/space/community` is **not** only a feed of group-origin posts.

`/space/community` is the **entry point into the ecosystem of groups and belonging structures** inside Space.

It should answer:

- where can I belong;
- which groups are relevant to me;
- which communities are active and meaningful now;
- which group should I enter first;
- what kinds of communities exist in Space.

## 2.2 Community layers

Community should expose at least these layers:

1. Recommended Groups
2. Local Communities
3. Thematic Communities
4. Event-related Communities
5. Quest-related Communities
6. PRO-led Communities
7. Community Entry States
8. Group Detail Promises

---

# 3. Content Status Legend

Use one of these statuses for every block and item.

## 3.1 `runtime_backed_now`
Can be honestly rendered from existing runtime now.

## 3.2 `summary_backed_now`
Can be shown as a group summary/discovery card without full feature depth.

## 3.3 `reference_only_for_now`
Useful for design/planning/content direction, but should not yet be presented as fully live.

## 3.4 `future_placeholder`
Belongs to target community model but should stay clearly deferred for now.

---

# 4. Community Content Philosophy

## 4.1 Belonging-first
Community content should answer:
> Where do I fit?

## 4.2 Entry-first
Community root should help the user enter groups, not just observe them.

## 4.3 Context-first
A group card should explain:
- what this group is;
- who it is for;
- why now;
- why join.

## 4.4 Structure over noise
Community must feel like a map of social structures, not like a second feed.

---

# 5. Representative Community Personas

community_personas:
  - user_key: "irina_belova"
    display_name: "Irina Belova"
    role: "Spacer"
    city: "Phuket"
    country: "Thailand"
    community_need: "newcomer orientation and safe entry"
    ideal_sections:
      - recommended
      - local
      - thematic
    why_representative: "Shows what community root should look like for a newcomer who needs clear social entry points."

  - user_key: "oleg_tran"
    display_name: "Oleg Tran"
    role: "PRO"
    city: "Da Nang"
    country: "Vietnam"
    community_need: "curation, leadership and high-signal group management"
    ideal_sections:
      - pro_led
      - local
      - featured
    why_representative: "Shows community as a structure of social gravity and curated groups."

  - user_key: "kirill_denisov"
    display_name: "Kirill Denisov"
    role: "VIP"
    city: "Ho Chi Minh City"
    country: "Vietnam"
    community_need: "active discovery and useful group participation"
    ideal_sections:
      - events
      - quests
      - thematic
    why_representative: "Shows community as a way to expand activity, not just read content."

---

# 6. Community Surface Definition

community_surface:
  route: "/space/community"
  route_role: "community root"
  product_role: "entry into groups and belonging structures"
  current_status: "reference_only_for_now"
  long_term_status: "structured group discovery and participation surface"
  current_runtime_note: "Current group detail and group feed runtime may already be live, but community root itself should be treated as a separate discovery/entry surface."

---

# 7. Recommended Groups Block

community_recommended_groups:
  status: "reference_only_for_now"
  purpose: "Show the best few communities for this user now."
  UX_rule: "This block should reduce social friction and guide first entry."

  items:
    - recommendation_ref: "rec_irina_phuket_relocation"
      owner_user_key: "irina_belova"
      group_id: "phuket-relocation-circle"
      title: "Phuket Relocation Circle"
      short_description: "Практичное сообщество о переезде, жилье и повседневной жизни на Пхукете."
      why_recommended: "Ты уже проявляешь интерес к жилью, логистике и адаптации."
      why_join_now: "Здесь можно быстро перейти от чтения к конкретным вопросам."
      recommendation_strength: "high"
      cta: "Открыть группу"

    - recommendation_ref: "rec_kirill_asia_city_events"
      owner_user_key: "kirill_denisov"
      group_id: "asia-city-events"
      title: "Asia City Events"
      short_description: "Группа для тех, кто хочет, чтобы события превращались в живую социальную среду."
      why_recommended: "Ты сохраняешь события и любишь social afterlife вокруг них."
      why_join_now: "Это хороший вход в более живое городское участие."
      recommendation_strength: "high"
      cta: "Открыть группу"

    - recommendation_ref: "rec_oleg_vietnam_insiders"
      owner_user_key: "oleg_tran"
      group_id: "oleg-vietnam-insiders"
      title: "Oleg’s Vietnam Insiders"
      short_description: "Curated PRO-led группа с полезными маршрутами, инсайтами и social gravity."
      why_recommended: "Это одна из твоих центральных community surfaces."
      why_join_now: "Поддерживает твой curated social rhythm."
      recommendation_strength: "high"
      cta: "Открыть группу"

---

# 8. Local Communities Block

community_local_groups:
  status: "summary_backed_now"
  purpose: "Show communities anchored in the user’s current city or region."

  items:
    - group_ref: "local_danang_city_life"
      city: "Da Nang"
      country: "Vietnam"
      group_id: "danang-city-life"
      title: "Da Nang City Life"
      short_description: "Повседневная жизнь, районы, места и локальные советы."
      who_for: "Для тех, кто хочет встроиться в городской ритм Дананга."
      activity_hint: "steady"
      members_hint: "healthy local group"
      why_it_matters: "Помогает не просто читать про город, а жить в нём."
      cta: "Открыть"

    - group_ref: "local_phuket_relocation"
      city: "Phuket"
      country: "Thailand"
      group_id: "phuket-relocation-circle"
      title: "Phuket Relocation Circle"
      short_description: "Переезд, зимовка, районы, жильё и повседневная адаптация."
      who_for: "Для новичков и тех, кто хочет сделать Phuket feel practical."
      activity_hint: "supportive and active"
      members_hint: "strong newcomer gravity"
      why_it_matters: "Это безопасная точка входа для вопросов."
      cta: "Открыть"

    - group_ref: "local_hcmc_events"
      city: "Ho Chi Minh City"
      country: "Vietnam"
      group_id: "asia-city-events"
      title: "Asia City Events"
      short_description: "События, встречи, afterlife и social energy больших городов."
      who_for: "Для тех, кому нужен городской social pulse."
      activity_hint: "dynamic"
      members_hint: "event-oriented group"
      why_it_matters: "Позволяет входить в город через события."
      cta: "Открыть"

---

# 9. Thematic Communities Block

community_thematic_groups:
  status: "reference_only_for_now"
  purpose: "Show groups by user need, not only by geography."

  sections:
    - section_key: "relocation"
      title: "Relocation & Daily Fit"
      description: "Сообщества для адаптации, жилья и повседневного ритма."

    - section_key: "city_life"
      title: "City Life"
      description: "Сообщества о городских районах, местах и everyday experience."

    - section_key: "curated_local_insight"
      title: "Curated Local Insight"
      description: "Группы, где ценится не шум, а high-signal social context."

  items:
    - group_ref: "theme_phuket_relocation"
      section_key: "relocation"
      group_id: "phuket-relocation-circle"
      title: "Phuket Relocation Circle"
      short_description: "Переезд, жильё, районы, practical living."
      why_join: "Помогает быстрее перейти от хаоса к понятной картине."
      tone: "supportive"
      cta: "Открыть"

    - group_ref: "theme_danang_city_life"
      section_key: "city_life"
      group_id: "danang-city-life"
      title: "Da Nang City Life"
      short_description: "Повседневная жизнь в Дананге без туристического шума."
      why_join: "Хорошо работает как local adaptation surface."
      tone: "practical"
      cta: "Открыть"

    - group_ref: "theme_oleg_insiders"
      section_key: "curated_local_insight"
      group_id: "oleg-vietnam-insiders"
      title: "Oleg’s Vietnam Insiders"
      short_description: "Curated social layer вокруг полезного local knowledge."
      why_join: "Подходит тем, кто ценит signal over noise."
      tone: "energetic but curated"
      cta: "Открыть"

---

# 10. Event-related Communities Block

community_event_groups:
  status: "summary_backed_now"
  purpose: "Show communities that continue life around events."

  items:
    - group_ref: "event_asia_city_events"
      group_id: "asia-city-events"
      title: "Asia City Events"
      short_description: "События не заканчиваются карточкой: здесь начинается social afterlife."
      linked_context:
        module: "pulse"
        entity_type: "event_series"
        entity_hint: "city meetups"
      why_join: "Хорошо подходит тем, кто хочет продолжения после событий."
      activity_hint: "high event energy"
      cta: "Открыть"

---

# 11. Quest-related Communities Block

community_quest_groups:
  status: "summary_backed_now"
  purpose: "Show communities where quests become shared social experience."

  items:
    - group_ref: "quest_phu_quoc_weekend"
      group_id: "quest-phu-quoc-weekend"
      title: "Quest Phu Quoc Weekend"
      short_description: "Сообщество вокруг travel-квестов, маршрутов, отчётов и социального вдохновения."
      linked_context:
        module: "quest"
        entity_type: "quest_cluster"
        entity_hint: "Phu Quoc weekend quests"
      why_join: "Подходит тем, кто хочет проходить не в одиночку, а в social context."
      activity_hint: "playful"
      cta: "Открыть"

---

# 12. PRO-led Communities Block

community_pro_led_groups:
  status: "summary_backed_now"
  purpose: "Show communities with visible curator gravity."

  items:
    - group_ref: "pro_oleg_insiders"
      group_id: "oleg-vietnam-insiders"
      title: "Oleg’s Vietnam Insiders"
      curator_name: "Oleg Tran"
      short_description: "PRO-led группа с curated local insight and practical social context."
      why_follow_curator: "У куратора уже есть социальная и практическая гравитация."
      what_kind_of_value: "Useful context, routes, events, local integration."
      cta: "Открыть"

    - group_ref: "pro_natalia_relocation"
      group_id: "phuket-relocation-circle"
      title: "Phuket Relocation Circle"
      curator_name: "Natalia Kim"
      short_description: "PRO-led relocation-focused group around practical Phuket fit."
      why_follow_curator: "Группа полезна не только контентом, но и role-led guidance."
      what_kind_of_value: "Relocation, housing, adaptation."
      cta: "Открыть"

---

# 13. Group Card Content Model

group_card_content_model:
  status: "reference_only_for_now"
  purpose: "Define the stable content anatomy of a community card."

  card_fields:
    - title
    - short_description
    - why_join
    - who_for
    - group_kind
    - activity_hint
    - members_hint
    - curator_hint_optional
    - linked_context_optional
    - primary_cta

  example:
    title: "Phuket Relocation Circle"
    short_description: "Переезд, жильё и practical daily fit на Пхукете."
    why_join: "Чтобы быстрее перейти от фрагментов информации к понятной картине."
    who_for: "Newcomers and relocation-minded users."
    group_kind: "thematic"
    activity_hint: "supportive"
    members_hint: "healthy active base"
    curator_hint_optional: "Natalia Kim"
    linked_context_optional: "Relocation and housing"
    primary_cta: "Открыть группу"

---

# 14. Community Sections Order

community_sections_order:
  status: "reference_only_for_now"
  order:
    - recommended_groups
    - local_communities
    - thematic_communities
    - event_related_communities
    - quest_related_communities
    - pro_led_communities

  rationale:
    - "First reduce social friction"
    - "Then help the user orient locally"
    - "Then show structured interest paths"

---

# 15. Community Empty States

community_empty_states:
  - state_ref: "community_empty_generic"
    title: "Сообщества скоро станут твоей картой в Space"
    description: "Пока блок discovery может быть ещё лёгким, но его задача — помочь понять, куда встроиться."
    recommended_cta: "Вернуться в Space"
    status: "reference_only_for_now"

  - state_ref: "community_empty_location_unknown"
    title: "Сначала определим твой контекст"
    description: "Когда понятнее город, роль или интерес, сообщество можно рекомендовать точнее."
    recommended_cta: "Открыть профиль"
    status: "reference_only_for_now"

---

# 16. Community Thin-but-Honest States

community_thin_states:
  - state_ref: "community_root_not_live_yet"
    title: "Community root ещё не полон"
    description: "Даже если discovery ещё узкий, это не должно превращать Community в копию feed."
    why_thin: "Group detail/feed runtime already exists, but root/discovery may still be staged."
    acceptable_now: true

  - state_ref: "group_cards_summary_only"
    title: "Summary-first community cards"
    description: "На ранней фазе group cards могут быть краткими и без глубоких metrics."
    why_thin: "The goal is honest entry, not fake completeness."
    acceptable_now: true

---

# 17. Community Auth-Required States

community_auth_required_states:
  - state_ref: "community_join_requires_auth"
    title: "Для вступления в группу нужна авторизация"
    description: "Открыть и прочитать часть сообщества можно раньше, но участие требует входа."
    next_step: "Sign in"

  - state_ref: "community_personalized_recommendations_require_auth"
    title: "Персональные рекомендации станут точнее после входа"
    description: "Без авторизации можно показать только лёгкий discovery baseline."
    next_step: "Sign in"

---

# 18. Community Route Matrix

community_route_matrix:
  - route: "/space/community"
    surface_role: "community root"
    main_blocks:
      - recommended_groups
      - local_communities
      - thematic_communities
      - event_related_communities
      - quest_related_communities
      - pro_led_communities
    content_source_type: "mixed"
    notes: "This route should become the structured entry into communities, not a second feed."

  - route: "/space/community/groups/[groupId]"
    surface_role: "group detail"
    main_blocks:
      - group_header
      - about
      - members_preview
      - group_feed
      - join_state
    content_source_type: "runtime_backed_now"
    notes: "Detailed group page can already be narrow-live before community root discovery is fully live."

---

# 19. Mapping to Runtime vs Future Layers

community_runtime_mapping:
  already_runtime_backed_now:
    - group_detail
    - group_feed
    - join_leave_baseline
    - public_group_identity_baseline

  summary_backed_now:
    - group_summary_cards
    - local_community_sections
    - pro_led_group_highlights

  reference_only_for_now:
    - recommended_groups_logic
    - thematic discovery richness
    - featured group sets
    - community onboarding guidance
    - richer member previews
    - activity summaries on cards

---

# 20. Community Entry Scenarios

community_entry_scenarios:
  - scenario_ref: "entry_irina_newcomer"
    user_key: "irina_belova"
    title: "Newcomer enters through one safe relevant group"
    starting_point: "/space/community"
    likely_first_group: "phuket-relocation-circle"
    desired_effect: "Reduce friction and create early belonging."

  - scenario_ref: "entry_kirill_event_driven"
    user_key: "kirill_denisov"
    title: "User enters through event-social layer"
    starting_point: "/space/community"
    likely_first_group: "asia-city-events"
    desired_effect: "Connect event interest with recurring community participation."

  - scenario_ref: "entry_oleg_curator"
    user_key: "oleg_tran"
    title: "PRO sees community as a structure of social gravity"
    starting_point: "/space/community"
    likely_first_group: "oleg-vietnam-insiders"
    desired_effect: "Community root reflects curator-led value, not only generic feeds."

---

# 21. Recommended Frontend Use

This pack should be used to guide the return from the current group-feed-centered interim baseline toward the intended Space v3 community model.

Recommended use order:

1. Community IA correction pass
2. Community root planning pass
3. Group summary/discovery baseline
4. Featured/recommended group composition
5. Community onboarding refinements

---

# 22. Final Summary

This document defines the community-discovery content needed for Space Asia to behave as:

- a social map,
- a belonging structure,
- an entry surface into groups,
- and a clearer bridge between user needs and communities.

Short formula:

> `/space/community` = discover → belong → enter`

---

# 23. Recommended Repository Placement

```text
content/space/Space-Asia-Community-Discovery-Content-Pack-v1.md