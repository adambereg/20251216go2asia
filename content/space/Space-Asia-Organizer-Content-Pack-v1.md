# Space-Asia-Organizer-Content-Pack-v1

**Project:** Go2Asia  
**Module:** Space Asia  
**Document role:** Organizer-focused frontend experience content pack for Space Asia v3  
**Status:** Draft v1  
**Scope:** Product content source for `/space/organizer` as execution and coordination surface

---

# 1. Purpose

This document defines the **organizer-specific frontend experience content** for Space Asia v3.

It exists to help restore the intended frontend/product direction:

> **Organizer = execution layer of the user inside Go2Asia**  
> not  
> **Organizer = generic todo app**

This document should be used for:

- frontend planning;
- UX/UI prototyping;
- content-driven organizer composition;
- Cursor planning and implementation passes;
- separation between current narrow social baseline and target action-first Space v3 model.

It complements but does not replace:

- `Space-Asia-Full-Seed-Content-Pack-v1.md`
- `space_ui_ux_concept_v_3.md`
- `space_frontend_information_architecture_v_1.md`
- `space_ui_backend_mapping_v_1.md`
- `space_backend_architecture_v_1.md`

---

# 2. Organizer Definition

## 2.1 What `/space/organizer` should be

`/space/organizer` is **not** a classic task manager.

`/space/organizer` is the **execution and coordination layer** of the user inside Go2Asia.

It should answer:

- what should I do next;
- what requires follow-up;
- what is already in motion;
- what is waiting for my decision;
- what should be scheduled, compared, revisited, or completed;
- how my saved and social signals turn into action.

## 2.2 Organizer layers

Organizer should expose at least these layers:

1. Timeline
2. Plans
3. Actions
4. Signals
5. Growth
6. AI-assisted Actions
7. Organizer Empty/Thin/Auth States
8. Organizer Preview Promise for Dashboard

---

# 3. Content Status Legend

Use one of these statuses for every block and item.

## 3.1 `runtime_backed_now`
Can be honestly rendered from existing runtime now.

## 3.2 `summary_backed_now`
Can be shown as a lightweight preview or condensed summary without full execution ownership.

## 3.3 `reference_only_for_now`
Useful for design/planning/content direction, but should not yet be presented as fully live.

## 3.4 `future_placeholder`
Belongs to target organizer model but should stay clearly deferred for now.

---

# 4. Organizer Content Philosophy

## 4.1 Action-first
Every organizer item should imply a real next step.

## 4.2 Execution over storage
Organizer is not a passive archive.
It should feel like a layer of movement and decision.

## 4.3 Ecosystem-aware
Organizer should connect social activity, saved items, partner interactions, quests, and practical goals.

## 4.4 Calm coordination
Organizer must feel useful and structured, not overloaded and stressful.

## 4.5 Extraction-friendly
Organizer content should not assume permanent `space-service` ownership.
It must remain valid whether organizer stays transitional or moves into a dedicated planner domain.

---

# 5. Representative Organizer Personas

organizer_personas:
  - user_key: "irina_belova"
    display_name: "Irina Belova"
    role: "Spacer"
    city: "Phuket"
    country: "Thailand"
    organizer_theme: "newcomer trying to turn saved and community context into practical decisions"
    organizer_priority:
      - actions
      - timeline
      - signals
      - ai_assisted_actions
    why_representative: "Shows organizer as guidance and structure for a newcomer."

  - user_key: "kirill_denisov"
    display_name: "Kirill Denisov"
    role: "VIP"
    city: "Ho Chi Minh City"
    country: "Vietnam"
    organizer_theme: "active user who needs practical follow-through on saved and social items"
    organizer_priority:
      - timeline
      - plans
      - actions
      - signals
    why_representative: "Shows organizer as a bridge from social interest to execution."

  - user_key: "oleg_tran"
    display_name: "Oleg Tran"
    role: "PRO"
    city: "Da Nang"
    country: "Vietnam"
    organizer_theme: "curator who balances social rhythm, group maintenance, and practical execution"
    organizer_priority:
      - actions
      - growth
      - timeline
      - ai_assisted_actions
    why_representative: "Shows organizer for a socially active curator without turning it into PRO Console."

---

# 6. Organizer Surface Definition

organizer_surface:
  route: "/space/organizer"
  route_role: "personal execution surface"
  product_role: "turn intent into action"
  current_status: "reference_only_for_now"
  long_term_status: "bounded coordination layer inside Space v3"
  current_runtime_note: "Current social baseline may expose only previews or reference content; organizer should not be faked as fully live before ownership/runtime is honest."

---

# 7. Timeline

organizer_timeline:
  status: "reference_only_for_now"
  purpose: "Show what is happening today, tomorrow, and this week."
  UX_rule: "Timeline should be short, relevant, and decision-oriented."

  items:
    - item_ref: "timeline_irina_today_listing"
      owner_user_key: "irina_belova"
      period: "today"
      title: "Вернуться к shortlist жилья"
      description: "Сегодня логично снова посмотреть вариант в Kathu и сравнить его с другими."
      state: "planned"
      linked_domain: "rielt"
      linked_entity_type: "listing"
      linked_entity_ref: "rielt-listing-phuket-kathu-01"

    - item_ref: "timeline_kirill_today_event"
      owner_user_key: "kirill_denisov"
      period: "today"
      title: "Проверить детали Da Nang Community Meetup"
      description: "Событие уже близко, стоит посмотреть время, место и social context."
      state: "planned"
      linked_domain: "pulse"
      linked_entity_type: "event"
      linked_entity_ref: "pulse-event-danang-community-meetup"

    - item_ref: "timeline_oleg_week_group"
      owner_user_key: "oleg_tran"
      period: "this_week"
      title: "Поддерживать ритм PRO-led группы"
      description: "На этой неделе важно не дать группе потерять social energy."
      state: "planned"
      linked_domain: "space"
      linked_entity_type: "group"
      linked_entity_ref: "oleg-vietnam-insiders"

---

# 8. Plans

organizer_plans:
  status: "reference_only_for_now"
  purpose: "Show user plans that combine multiple saved or active items."
  UX_rule: "Plans should feel like structured intent, not calendar overload."

  items:
    - plan_ref: "plan_irina_relocation"
      owner_user_key: "irina_belova"
      title: "Понять свой первый месяц на Пхукете"
      description: "Собрать жильё, район, логистику и social starting points в один practical path."
      plan_type: "relocation"
      entities:
        - "rielt-listing-phuket-kathu-01"
        - "phuket-relocation-circle"

    - plan_ref: "plan_kirill_evening_social"
      owner_user_key: "kirill_denisov"
      title: "Встроить meetup в городской вечер"
      description: "Не просто сходить на событие, а сделать из него полезный social route."
      plan_type: "event_plan"
      entities:
        - "pulse-event-danang-community-meetup"
        - "asia-city-events"

    - plan_ref: "plan_oleg_weekend_curated"
      owner_user_key: "oleg_tran"
      title: "Curated weekend rhythm for my group"
      description: "Подобрать social and practical context вокруг weekend flow."
      plan_type: "community_curated"
      entities:
        - "oleg-vietnam-insiders"
        - "post-007"

---

# 9. Actions

organizer_actions:
  status: "reference_only_for_now"
  purpose: "Show concrete next-step items that require direct action."
  UX_rule: "This is the most execution-heavy organizer block."

  items:
    - action_ref: "action_irina_open_listing"
      owner_user_key: "irina_belova"
      title: "Открыть листинг и решить, shortlist это или нет"
      description: "Тебе не нужен бесконечный сбор — нужен decision step."
      action_kind: "review_and_decide"
      urgency: "high"
      linked_entity_type: "listing"
      linked_entity_ref: "rielt-listing-phuket-kathu-01"

    - action_ref: "action_kirill_save_to_plan"
      owner_user_key: "kirill_denisov"
      title: "Добавить событие в практический план"
      description: "Сохранённое событие полезно превратить в более complete route."
      action_kind: "plan_building"
      urgency: "medium"
      linked_entity_type: "event"
      linked_entity_ref: "pulse-event-danang-community-meetup"

    - action_ref: "action_oleg_repost_context"
      owner_user_key: "oleg_tran"
      title: "Встроить релевантный объект в curated group flow"
      description: "Следующее useful действие — не просто посмотреть, а встроить в group rhythm."
      action_kind: "curation"
      urgency: "medium"
      linked_entity_type: "group"
      linked_entity_ref: "oleg-vietnam-insiders"

---

# 10. Signals

organizer_signals:
  status: "reference_only_for_now"
  purpose: "Show items that are waiting, expiring, or asking for attention."
  UX_rule: "Signals are not tasks themselves; they indicate why attention is needed."

  items:
    - signal_ref: "signal_irina_waiting"
      owner_user_key: "irina_belova"
      title: "Housing inquiry needs follow-up"
      description: "Есть смысл вернуться к жилищному запросу, чтобы не потерять нить."
      signal_type: "waiting"
      severity: "medium"

    - signal_ref: "signal_kirill_event_time"
      owner_user_key: "kirill_denisov"
      title: "Событие скоро станет time-sensitive"
      description: "Чем ближе meetup, тем полезнее уточнить формат и детали."
      signal_type: "upcoming"
      severity: "medium"

    - signal_ref: "signal_oleg_group_decay"
      owner_user_key: "oleg_tran"
      title: "Группа может потерять ритм"
      description: "Если долго ничего не происходит, community surface теряет живость."
      signal_type: "attention_needed"
      severity: "low"

---

# 11. Growth

organizer_growth:
  status: "reference_only_for_now"
  purpose: "Show user development paths inside the ecosystem."
  UX_rule: "Growth must feel connected to meaningful action, not abstract gamification."

  items:
    - growth_ref: "growth_irina_newcomer"
      owner_user_key: "irina_belova"
      title: "Сделать адаптацию менее хаотичной"
      description: "Следующий ростовой шаг — перейти от фрагментов к осмысленной структуре действий."
      growth_track: "adaptation"
      next_step: "Собрать 1–2 ключевых действия и закрепить их в organizer."

    - growth_ref: "growth_kirill_social_practical"
      owner_user_key: "kirill_denisov"
      title: "Перевести интерес в практику"
      description: "Ты уже сохраняешь и смотришь — следующий шаг превратить это в выполняемые маршруты."
      growth_track: "practical_engagement"
      next_step: "Добавить saved item в план."

    - growth_ref: "growth_oleg_curator"
      owner_user_key: "oleg_tran"
      title: "Усилить social leadership without overload"
      description: "Рост для PRO — не просто работать больше, а поддерживать useful gravity."
      growth_track: "curation"
      next_step: "Выбрать один high-signal шаг для группы."

---

# 12. AI-assisted Actions

organizer_ai_actions:
  status: "reference_only_for_now"
  purpose: "Show assistant-supported execution inside organizer."
  UX_rule: "AI actions must be explicit, calm, and confirmation-aware."

  items:
    - ai_action_ref: "ai_irina_compare_listing"
      owner_user_key: "irina_belova"
      title: "Собрать shortlist жилья?"
      description: "Assistant может подготовить компактное сравнение сохранённых и обсуждаемых вариантов."
      assistant_state: "suggestion"
      requires_confirmation: true
      linked_entity_ref: "rielt-listing-phuket-kathu-01"

    - ai_action_ref: "ai_kirill_evening_plan"
      owner_user_key: "kirill_denisov"
      title: "Собрать маршрут до/после meetup?"
      description: "Assistant может превратить событие в более complete practical plan."
      assistant_state: "prepared"
      requires_confirmation: true
      linked_entity_ref: "pulse-event-danang-community-meetup"

    - ai_action_ref: "ai_oleg_group_prompt"
      owner_user_key: "oleg_tran"
      title: "Подготовить curated repost suggestion?"
      description: "Assistant может предложить, что лучше всего встроить в group rhythm."
      assistant_state: "requires_confirmation"
      requires_confirmation: true
      linked_entity_ref: "oleg-vietnam-insiders"

---

# 13. Organizer Preview Promise for Dashboard

organizer_preview_promise:
  status: "reference_only_for_now"
  purpose: "Define what Dashboard organizer preview should promise and what it should not."
  should_show:
    - 3_to_5_useful_items
    - urgency_or_state
    - clear_cta
    - link_to_full_organizer
  should_not_show:
    - full_planner_logic
    - giant_task_list
    - fake_automation_depth
    - unrelated_noise

---

# 14. Organizer Item Taxonomy

organizer_item_taxonomy:
  status: "reference_only_for_now"
  item_types:
    - "follow_up"
    - "review_and_decide"
    - "reminder"
    - "plan_building"
    - "community_maintenance"
    - "saved_action"
    - "growth_goal"
    - "assistant_prepared_action"

  item_states:
    - "planned"
    - "pending"
    - "waiting"
    - "completed"
    - "prepared"
    - "requires_confirmation"

  urgency_levels:
    - "low"
    - "medium"
    - "high"

---

# 15. Organizer Empty States

organizer_empty_states:
  - state_ref: "organizer_empty_new_user"
    title: "Organizer начнёт работать, когда появятся первые реальные действия"
    description: "Сохрани пару объектов, открой группу или событие — и у тебя появится coordination layer."
    recommended_cta: "Открыть Space"
    status: "reference_only_for_now"

  - state_ref: "organizer_empty_no_actions"
    title: "Пока здесь спокойно"
    description: "Когда появятся follow-ups, plans или important signals, они соберутся здесь."
    recommended_cta: "Открыть сохранённое"
    status: "reference_only_for_now"

---

# 16. Organizer Thin-but-Honest States

organizer_thin_states:
  - state_ref: "organizer_preview_only"
    title: "Organizer пока может быть только превью"
    description: "На ранней фазе допустимо показывать Dashboard-preview без полноценного execution surface."
    why_thin: "Ownership/runtime still transitional."
    acceptable_now: true

  - state_ref: "organizer_reference_backed"
    title: "Часть organizer content пока reference-only"
    description: "Это не баг, если UX честно показывает ограниченную глубину instead of fake completeness."
    why_thin: "Cross-domain execution logic is broader than current Space runtime."
    acceptable_now: true

---

# 17. Organizer Auth-Required States

organizer_auth_required_states:
  - state_ref: "organizer_requires_login"
    title: "Organizer требует авторизации"
    description: "Это личный execution layer, поэтому без входа он не может быть meaningful."
    next_step: "Sign in"

  - state_ref: "organizer_personalization_requires_login"
    title: "Персональная координация доступна только после входа"
    description: "Без авторизации можно показать только объяснение, но не сами личные действия."
    next_step: "Sign in"

---

# 18. Organizer Route Matrix

organizer_route_matrix:
  route: "/space/organizer"
  surface_role: "execution surface"
  main_blocks:
    - timeline
    - plans
    - actions
    - signals
    - growth
    - ai_assisted_actions
  content_source_type: "mixed / transitional"
  notes: "Organizer must remain extraction-friendly and should not force permanent Space ownership."

---

# 19. Mapping to Runtime vs Future Layers

organizer_runtime_mapping:
  already_runtime_backed_now:
    - organizer_content_examples_in_seed
    - dashboard_organizer_preview_as_reference_concept

  summary_backed_now:
    - selected next-action hints
    - saved_to_action hints
    - growth summaries
    - ecosystem-linked urgency hints

  reference_only_for_now:
    - full organizer route
    - full state transitions
    - execution workflows
    - AI-assisted organizer actions
    - cross-domain action resolution
    - reschedule / remind / execute behavior

---

# 20. Organizer Entry Scenarios

organizer_entry_scenarios:
  - scenario_ref: "entry_irina_from_saved"
    user_key: "irina_belova"
    title: "Saved item becomes practical next action"
    starting_point: "/space/saved"
    likely_first_action: "review listing and decide shortlist status"
    desired_effect: "Organizer should convert stored interest into motion."

  - scenario_ref: "entry_kirill_from_event"
    user_key: "kirill_denisov"
    title: "Saved event becomes a plan"
    starting_point: "/space"
    likely_first_action: "turn meetup into evening route"
    desired_effect: "Organizer should bridge social and practical life."

  - scenario_ref: "entry_oleg_from_group"
    user_key: "oleg_tran"
    title: "Social curation becomes structured execution"
    starting_point: "/space/community/groups/oleg-vietnam-insiders"
    likely_first_action: "maintain group rhythm with one useful action"
    desired_effect: "Organizer should help a curator act without becoming PRO Console."

---

# 21. Recommended Frontend Use

This pack should be used to guide the future introduction of organizer as a real Space v3 execution layer, without confusing it with a generic planner or forcing ownership too early.

Recommended use order:

1. Organizer preview planning pass
2. Dashboard organizer preview introduction
3. Organizer IA correction pass
4. Organizer baseline route planning
5. Organizer mixed-surface execution alignment

---

# 22. Final Summary

This document defines the organizer content needed for Space Asia to behave as:

- an execution surface,
- a decision layer,
- a bridge between saved/social/ecosystem context and action,
- and a calm coordination environment.

Short formula:

> `/space/organizer` = notice → decide → act`

---

# 23. Recommended Repository Placement

```text
content/space/Space-Asia-Organizer-Content-Pack-v1.md