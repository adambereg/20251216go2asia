# Space-Asia-Dashboard-Content-Pack-v1

**Project:** Go2Asia  
**Module:** Space Asia  
**Document role:** Dashboard-focused frontend experience content pack for Space Asia v3  
**Status:** Draft v1  
**Scope:** Product content source for `/space` as Dashboard-first operating surface

---

# 1. Purpose

This document defines the **dashboard-specific frontend experience content** for Space Asia v3.

It exists to help restore the intended frontend/product direction:

> **Space Asia = user operating system inside Go2Asia**  
> **Dashboard = main entry point**

This document should be used for:

- frontend planning;
- UX/UI prototyping;
- content-driven dashboard composition;
- Cursor planning passes;
- separation between current narrow social baseline and target Space v3 dashboard model.

It complements but does not replace:

- `Space-Asia-Full-Seed-Content-Pack-v1.md`
- `space_ui_ux_concept_v_3.md`
- `space_frontend_information_architecture_v_1.md`
- `space_ui_backend_mapping_v_1.md`

---

# 2. Dashboard Definition

## 2.1 What `/space` should be

`/space` is **not** the main feed.

`/space` is the **personal operating cockpit** of the user inside Go2Asia.

It should answer:

- what matters now;
- what should be done next;
- what changed around me;
- what in the ecosystem needs my attention;
- what the assistant suggests;
- where I should go next.

## 2.2 Dashboard blocks

Dashboard is composed from these high-level blocks:

1. User Header
2. Today
3. Next Actions
4. Organizer Preview
5. Ecosystem Signals
6. Social Pulse
7. AI Assistant Suggestions
8. PRO Widget

---

# 3. Content Status Legend

Use one of these statuses for every block and item.

## 3.1 `runtime_backed_now`
Can be honestly rendered from existing runtime now.

## 3.2 `summary_backed_now`
Can be shown as a summary from adjacent domains, without full underlying domain surface.

## 3.3 `reference_only_for_now`
Useful for design/planning/content direction, but should not yet be presented as fully live.

## 3.4 `future_placeholder`
Belongs to target dashboard model but should stay clearly deferred for now.

---

# 4. Dashboard Content Philosophy

## 4.1 Action-first
Every major block should imply an action or decision.

## 4.2 Calm and structured
Dashboard should feel useful, not noisy.

## 4.3 Mixed but honest
Dashboard is a composition surface.  
Not every block is Space-owned.

## 4.4 Context over volume
The goal is not to show everything.  
The goal is to show what matters now.

---

# 5. Representative Dashboard Personas

These personas help shape realistic dashboard content.

dashboard_personas:
  - user_key: "oleg_tran"
    display_name: "Oleg Tran"
    role: "PRO"
    city: "Da Nang"
    country: "Vietnam"
    dashboard_theme: "curator with practical local gravity"
    dashboard_priority:
      - today
      - next_actions
      - organizer_preview
      - social_pulse
      - pro_widget
    why_representative: "Shows how Dashboard should feel for a socially active PRO who balances community life and operational signals."

  - user_key: "irina_belova"
    display_name: "Irina Belova"
    role: "Spacer"
    city: "Phuket"
    country: "Thailand"
    dashboard_theme: "newcomer trying to orient and act"
    dashboard_priority:
      - today
      - next_actions
      - saved_preview
      - assistant_suggestions
      - social_pulse
    why_representative: "Shows Dashboard as orientation and action layer for a newcomer."

  - user_key: "kirill_denisov"
    display_name: "Kirill Denisov"
    role: "VIP"
    city: "Ho Chi Minh City"
    country: "Vietnam"
    dashboard_theme: "active explorer and saver"
    dashboard_priority:
      - next_actions
      - ecosystem_signals
      - social_pulse
      - saved_preview
    why_representative: "Shows Dashboard as a practical and social center for a returning engaged user."

---

# 6. Dashboard Surface Definition

dashboard_surface:
  route: "/space"
  route_role: "main entry point"
  product_role: "user operating cockpit"
  current_status: "reference_only_for_now"
  long_term_status: "dashboard_first_primary_surface"
  current_runtime_note: "Current narrow social baseline may continue to exist as an interim live state, but should not be treated as final `/space` semantics."

---

# 7. User Header

dashboard_user_header:
  status: "summary_backed_now"
  purpose: "Give instant identity, context and emotional orientation."
  blocks:
    - avatar
    - display_name
    - role_status
    - short_identity_line
    - trust_signal_hint
    - lightweight_metrics

  examples:
    - user_key: "oleg_tran"
      short_identity_line: "Curating practical life and communities around Vietnam."
      trust_signal_hint:
        - "Leads active public groups"
        - "Useful local curator"
      lightweight_metrics:
        groups_led: 2
        authored_posts_hint: "active"
        saved_items_hint: "moderate"

    - user_key: "irina_belova"
      short_identity_line: "Exploring relocation options and trying to build a stable daily rhythm."
      trust_signal_hint:
        - "Newcomer"
        - "Actively learning"
      lightweight_metrics:
        groups_joined: 2
        saved_items_hint: "growing shortlist"
        activity_hint: "light but meaningful"

    - user_key: "kirill_denisov"
      short_identity_line: "Collecting useful places, events and routes across Southeast Asia."
      trust_signal_hint:
        - "Active saver"
        - "Visible participant"
      lightweight_metrics:
        saved_items_hint: "strong"
        activity_hint: "regular"
        social_hint: "mid-volume"

---

# 8. Today

dashboard_today:
  status: "reference_only_for_now"
  purpose: "Show the few things that matter specifically today."
  UX_rule: "The block must feel urgent and useful, not like a calendar dump."

  items:
    - item_ref: "today_irina_listing_followup"
      owner_user_key: "irina_belova"
      type: "follow_up"
      title: "Вернуться к варианту жилья в Kathu"
      description: "Проверить, подходит ли как база на первый месяц."
      why_today: "Ты уже сохраняла этот вариант и откладывала возврат к нему."
      linked_domain: "rielt"
      linked_entity_type: "listing"
      linked_entity_ref: "rielt-listing-phuket-kathu-01"
      action_cta: "Открыть вариант"
      urgency: "medium"

    - item_ref: "today_kirill_event_check"
      owner_user_key: "kirill_denisov"
      type: "event_check"
      title: "Проверить детали Da Nang Community Meetup"
      description: "Посмотреть время, место и формат встречи."
      why_today: "Событие уже близко и ты его сохранял."
      linked_domain: "pulse"
      linked_entity_type: "event"
      linked_entity_ref: "pulse-event-danang-community-meetup"
      action_cta: "Открыть событие"
      urgency: "medium"

    - item_ref: "today_oleg_group_rhythm"
      owner_user_key: "oleg_tran"
      type: "community_maintenance"
      title: "Поддержать ритм в Oleg’s Vietnam Insiders"
      description: "Сегодня уместно добавить один содержательный пост или репост."
      why_today: "Группа — важная точка социальной гравитации."
      linked_domain: "space"
      linked_entity_type: "group"
      linked_entity_ref: "oleg-vietnam-insiders"
      action_cta: "Открыть группу"
      urgency: "low"

---

# 9. Next Actions

dashboard_next_actions:
  status: "reference_only_for_now"
  purpose: "Show best next-step actions, not passive information."
  UX_rule: "This is the most important block after Today."

  items:
    - action_ref: "next_irina_ask_group"
      owner_user_key: "irina_belova"
      title: "Спросить в группе про районы Пхукета"
      description: "У тебя уже есть интерес к жилью и логистике — следующий шаг задать конкретный вопрос в комьюнити."
      action_type: "social_action"
      reason_now: "Это быстрее, чем собирать информацию по кусочкам."
      linked_domain: "space"
      linked_entity_type: "group"
      linked_entity_ref: "phuket-relocation-circle"
      requires_confirmation: false
      suggested_by: "assistant"

    - action_ref: "next_kirill_open_saved_event"
      owner_user_key: "kirill_denisov"
      title: "Вернуться к сохранённому meetup"
      description: "Это не просто сохранение — отсюда можно перейти к планированию вечера."
      action_type: "open_and_plan"
      reason_now: "Событие уже выглядит practically relevant."
      linked_domain: "pulse"
      linked_entity_type: "event"
      linked_entity_ref: "pulse-event-danang-community-meetup"
      requires_confirmation: false
      suggested_by: "system"

    - action_ref: "next_oleg_repost_to_group"
      owner_user_key: "oleg_tran"
      title: "Сделать репост события в PRO-led группу"
      description: "Событие подходит твоей аудитории и усилит group rhythm."
      action_type: "curation_action"
      reason_now: "Это хороший match между social content and community context."
      linked_domain: "space"
      linked_entity_type: "post_or_group_flow"
      linked_entity_ref: "oleg-vietnam-insiders"
      requires_confirmation: true
      suggested_by: "assistant"

---

# 10. Organizer Preview

dashboard_organizer_preview:
  status: "reference_only_for_now"
  purpose: "Show 3–5 next actionable items without opening full Organizer."

  items:
    - preview_ref: "org_preview_irina_1"
      owner_user_key: "irina_belova"
      title: "Вернуться к shortlist жилья"
      state: "planned"
      priority: "high"
      linked_entity_type: "listing"
      linked_entity_ref: "rielt-listing-phuket-kathu-01"
      cta: "Открыть"

    - preview_ref: "org_preview_kirill_1"
      owner_user_key: "kirill_denisov"
      title: "Не забыть про community meetup"
      state: "planned"
      priority: "medium"
      linked_entity_type: "event"
      linked_entity_ref: "pulse-event-danang-community-meetup"
      cta: "Посмотреть"

    - preview_ref: "org_preview_oleg_1"
      owner_user_key: "oleg_tran"
      title: "Поддерживать живой ритм в группе"
      state: "planned"
      priority: "medium"
      linked_entity_type: "group"
      linked_entity_ref: "oleg-vietnam-insiders"
      cta: "Открыть"

---

# 11. Ecosystem Signals

dashboard_ecosystem_signals:
  status: "summary_backed_now"
  purpose: "Show compact summaries from adjacent domains without stealing ownership."
  UX_rule: "Signals are summaries, not full cabinets."

  widgets:
    - widget_ref: "signal_kirill_points"
      owner_user_key: "kirill_denisov"
      widget_type: "points"
      title: "Points"
      summary: "540 Points"
      linked_domain: "connect"
      cta: "Подробнее"

    - widget_ref: "signal_kirill_quest"
      owner_user_key: "kirill_denisov"
      widget_type: "quest_progress"
      title: "Quest progress"
      summary: "1 quest active, 2 steps left"
      linked_domain: "quest"
      cta: "Открыть"

    - widget_ref: "signal_anton_voucher"
      owner_user_key: "kirill_denisov"
      widget_type: "voucher"
      title: "Voucher"
      summary: "Есть активный social-use signal для полезного предложения"
      linked_domain: "rf"
      cta: "Посмотреть"

    - widget_ref: "signal_oleg_badges"
      owner_user_key: "oleg_tran"
      widget_type: "badge_summary"
      title: "Community badges"
      summary: "2 visible community badges"
      linked_domain: "connect"
      cta: "Открыть"

---

# 12. Social Pulse

dashboard_social_pulse:
  status: "partially_runtime_backed_now"
  purpose: "Show recent social change around the user."
  UX_rule: "This is a preview, not the full Activity screen."

  items:
    - pulse_ref: "pulse_oleg_like"
      owner_user_key: "oleg_tran"
      type: "like_received"
      title: "Твой пост получил отклик"
      summary: "Kirill liked your group post."
      linked_post_ref: "post-007"
      linked_group_ref: "oleg-vietnam-insiders"

    - pulse_ref: "pulse_irina_group_join"
      owner_user_key: "irina_belova"
      type: "group_join"
      title: "Ты встроилась в сообщество"
      summary: "Ты уже внутри Phuket Relocation Circle."
      linked_post_ref: ""
      linked_group_ref: "phuket-relocation-circle"

    - pulse_ref: "pulse_alexey_repost"
      owner_user_key: "oleg_tran"
      type: "repost_signal"
      title: "Контент получил вторую жизнь"
      summary: "Social flow вокруг события получил репост и продолжение."
      linked_post_ref: "post-010"
      linked_group_ref: "asia-city-events"

---

# 13. AI Assistant Suggestions

dashboard_ai_suggestions:
  status: "reference_only_for_now"
  purpose: "Show assistant cards as visible but calm action layer."

  items:
    - suggestion_ref: "ai_irina_housing_compare"
      owner_user_key: "irina_belova"
      title: "Собрать shortlist жилья?"
      summary: "Можно сравнить сохранённые и обсуждавшиеся варианты в одном месте."
      reason_now: "У тебя уже есть интерес к одному листингу и явный relocation intent."
      linked_entity_type: "listing_collection"
      linked_entity_ref: "rielt-listing-phuket-kathu-01"
      assistant_state: "suggestion"
      cta_primary: "Сравнить"
      cta_secondary: "Позже"

    - suggestion_ref: "ai_kirill_before_event"
      owner_user_key: "kirill_denisov"
      title: "Добавить nearby places до/после встречи?"
      summary: "Можно превратить сохранённое событие в более complete evening plan."
      reason_now: "Ты сохранил meetup и уже активен в городской social layer."
      linked_entity_type: "event"
      linked_entity_ref: "pulse-event-danang-community-meetup"
      assistant_state: "prepared"
      cta_primary: "Показать"
      cta_secondary: "Нет"

    - suggestion_ref: "ai_oleg_group_action"
      owner_user_key: "oleg_tran"
      title: "Подсказать репост в твою группу?"
      summary: "Новый релевантный social object можно быстро встроить в curated group flow."
      reason_now: "Это усилит ритм и relevance группы."
      linked_entity_type: "group"
      linked_entity_ref: "oleg-vietnam-insiders"
      assistant_state: "requires_confirmation"
      cta_primary: "Подготовить"
      cta_secondary: "Не сейчас"

---

# 14. PRO Widget

dashboard_pro_widget:
  status: "reference_only_for_now"
  purpose: "Provide a compact transition from life to work contour."
  UX_rule: "Space = life, PRO Workspace = work."

  items:
    - widget_ref: "pro_widget_oleg_main"
      owner_user_key: "oleg_tran"
      title: "PRO workspace"
      summary: "Есть задачи по группам и social curation."
      pending_count: 2
      cta: "Open PRO Workspace"

    - widget_ref: "pro_widget_natalia_main"
      owner_user_key: "oleg_tran"
      title: "PRO follow-ups"
      summary: "Есть практичные точки входа для housing/community work."
      pending_count: 1
      cta: "Open PRO Workspace"

---

# 15. Dashboard Empty States

dashboard_empty_states:
  - state_ref: "dashboard_empty_new_user"
    target_user_type: "newcomer"
    title: "Space начнёт оживать по мере твоих действий"
    description: "Сохрани пару объектов, вступи в одну группу и вернись сюда — Dashboard станет полезнее."
    recommended_cta: "Открыть сообщества"
    status: "reference_only_for_now"

  - state_ref: "dashboard_empty_low_activity"
    target_user_type: "low_activity_user"
    title: "Пока здесь немного сигналов"
    description: "Это нормально: как только появятся сохранения, реакции и планы, Dashboard станет богаче."
    recommended_cta: "Посмотреть ленту"
    status: "reference_only_for_now"

---

# 16. Dashboard Thin-but-Honest States

dashboard_thin_states:
  - state_ref: "dashboard_social_only_baseline"
    title: "Нarrow social baseline only"
    description: "Пока Dashboard может быть представлен ограниченным social/runtime baseline без полной композиции блоков."
    why_thin: "Organizer, full signals, and AI layers are not fully surfaced yet."
    acceptable_now: true

  - state_ref: "dashboard_summary_only_signals"
    title: "Signals as summaries"
    description: "Сигналы других доменов могут пока показываться только короткими summary widgets."
    why_thin: "Ownership remains outside Space."
    acceptable_now: true

---

# 17. Dashboard Auth-Required States

dashboard_auth_required_states:
  - state_ref: "dashboard_auth_required_personalized"
    title: "Войди, чтобы увидеть персональный Dashboard"
    description: "Без авторизации можно показать только ограниченный fallback или public-facing preview."
    next_step: "Sign in"

  - state_ref: "dashboard_auth_required_actions"
    title: "Для действий нужна авторизация"
    description: "Часть next actions, organizer и signals становятся meaningful только для текущего пользователя."
    next_step: "Sign in"

---

# 18. Route-to-Block Matrix for `/space`

dashboard_route_matrix:
  route: "/space"
  current_interim_runtime_surface: "narrow social baseline"
  target_surface: "dashboard"
  target_blocks:
    - user_header
    - today
    - next_actions
    - organizer_preview
    - ecosystem_signals
    - social_pulse
    - ai_suggestions
    - pro_widget
  current_note: "Current `/space` may temporarily remain a runtime-backed social shell, but should be treated as interim state on the path to dashboard-first Space v3."

---

# 19. Runtime vs Future Mapping for Dashboard

dashboard_runtime_mapping:
  already_runtime_backed_now:
    - user_header_core
    - social_pulse_baseline
    - representative_profile_fallback
    - narrow_social_feed_shell

  summary_backed_now:
    - points_summary
    - badge_summary
    - quest_progress_summary
    - voucher_summary
    - referral_summary

  reference_only_for_now:
    - today
    - next_actions
    - organizer_preview
    - ai_suggestions
    - full_dashboard_composition
    - pro_widget_operational_depth

---

# 20. Recommended Frontend Use

This pack should be used to guide the return from the current feed-first interim baseline toward the intended Space v3 dashboard model.

Recommended use order:

1. Dashboard planning/alignment pass
2. Dashboard-first IA correction
3. Dashboard composition baseline
4. Organizer preview introduction
5. Signals and assistant summary layering

---

# 21. Final Summary

This document defines the dashboard content needed for Space Asia to behave as:

- a personal cockpit,
- a decision surface,
- an action-oriented entry point,
- and the true home of Space v3.

Short formula:

> `/space` = orient → act → return`

---

# 22. Recommended Repository Placement

```text
content/space/Space-Asia-Dashboard-Content-Pack-v1.md