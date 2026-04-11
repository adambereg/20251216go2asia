# Q4 — Night Market Event Check-In

## Purpose
Event-based quest for attend_event rendering and event-linked semantics.
A small evening quest built around an event visit and a short public follow-up action.

---

## Core Identity

- id: `quest_night_market_event_004`
- slug: `night-market-event-check-in`
- title: `Night Market Event Check-In`
- short_description: `Небольшой событийный квест: прийти на вечерний маркет, подтвердить участие и оставить короткий публичный след.`
- full_description: `Этот квест показывает, как Quest Asia может использовать событие как основу сценария. Пользователь приходит на вечерний маркет, подтверждает участие и завершает маршрут коротким публичным действием. Такой квест помогает проверить, как event-linked сценарии выглядят в каталоге, на detail-странице и в run-flow.`
- city_id: `phuket`
- theme: `event_participation`
- difficulty: `medium`
- reward_points: `140`
- steps_count: `2`
- status: `published`
- visibility: `public`

---

## Product Presentation

- card_badge: `Событийный квест`
- audience_label: `Для вечерних исследователей и посетителей городских событий`
- estimated_time_label: `60–90 мин`
- estimated_time_minutes_min: `60`
- estimated_time_minutes_max: `90`

- who_is_it_for:
  - `evening_explorers`
  - `event_visitors`
  - `casual_social_participants`

- experience_style:
  - `event`
  - `walking`
  - `social_action`
  - `manual_review`

- review_mode_summary: `Подтверждение участия может требовать дополнительную проверку`
- completion_rule_short: `Придите на событие и завершите короткий follow-up шаг`
- reward_explanation_short: `Баллы показываются как intent, без внешнего reward settlement`

- start_cta_label: `Начать квест`
- continue_cta_label: `Продолжить`
- pending_cta_label: `Ожидает проверки`

- product_note: `Простой событийный сценарий, который помогает показать разницу между event-based и place-based квестом.`

---

## Product Rationale

- why_this_quest_exists: `Wave 1 должен уметь различать event-based quest от place-based и partner-based quest не только логически, но и визуально.`
- what_user_will_feel: `Ощущение участия в живом вечернем событии, а не просто прохождения точки на карте.`
- what_makes_it_special: `Этот квест строится вокруг самого события и его атмосферы, а не вокруг обычного check-in.`
- caution_note: `Подтверждение участия не обязательно означает мгновенное завершение маршрута.`

---

## Runtime / Rules

- completion_rule: `Attend the event and complete the follow-up social step`
- review_rule: `Attendance may still require baseline/manual confirmation in wave 1`
- reward_explanation: `Quest shows reward points intent only; event attendance does not imply external reward settlement in Quest.`

---

## Relations

- related_place_ids: []

- related_event_ids:
  - `event_phuket_night_market_001`

- related_partner_ids: []

---

## Media

### Cover image
- cover_image_key: `quests/phuket/night-market-event-check-in/cover.jpg`
- cover_image_alt: `Вечерний маркет и атмосфера ночного события на Пхукете`
- cover_image_hint: `night market / lights / evening event / food and crowd`

### Gallery images
- gallery_image_01_key: `quests/phuket/night-market-event-check-in/gallery/01.jpg`
- gallery_image_01_alt: `Огни вечернего маркета`

- gallery_image_02_key: `quests/phuket/night-market-event-check-in/gallery/02.jpg`
- gallery_image_02_alt: `Сцена или атмосфера ночного события`

---

## SEO

- seo_title: `Night Market Event Check-In — Quest Asia`
- seo_description: `Вечерний событийный квест на Пхукете: придите на маркет, подтвердите участие и оставьте короткий публичный след.`

---

## Catalog Presentation

- catalog_card_variant: `standard`
- catalog_show:
  - `cover_image`
  - `title`
  - `short_description`
  - `difficulty`
  - `estimated_time_label`
  - `steps_count`
  - `city`
  - `card_badge`

- catalog_hide:
  - `raw_status`
  - `raw_visibility`
  - `runtime_quest_label`
  - `internal_labels`

---

## Detail Presentation

- detail_hero_style: `image_top`
- detail_show:
  - `cover_image`
  - `title`
  - `full_description`
  - `estimated_time_label`
  - `difficulty`
  - `audience_label`
  - `review_mode_summary`
  - `steps_preview`

- detail_hide:
  - `raw_status`
  - `raw_visibility`
  - `technical_runtime_labels`

---

## Run Presentation

- run_style: `guided`
- run_show:
  - `current_step_title`
  - `short_instruction`
  - `user_instruction_short`
  - `submit_hint_short`
  - `review_hint_when_needed`

- run_hide:
  - `raw_target_id_by_default`
  - `raw_verification_type_by_default`
  - `raw_json_payload_by_default`

- allow_technical_mode_fallback: `true`

---

## Runtime UX Copy

- empty_state_title: `Пока нет доступных квестов`
- empty_state_text: `Скоро здесь появятся новые маршруты и задания.`

- not_found_title: `Квест не найден или недоступен`
- not_found_text: `Этот квест не опубликован для публичного режима или больше недоступен.`

- auth_required_title: `Войдите, чтобы начать квест`
- auth_required_text: `Запуск, прогресс и отправка шагов доступны только после входа.`

- review_pending_title: `Ожидает проверки`
- review_pending_text: `Подтверждение участия в событии получено. Проверка может занять некоторое время.`

- completion_title: `Квест завершён`
- completion_text: `Событийный маршрут завершён. Итоговый статус подтверждён.`

---

## Steps

### Step 1

- step_id: `step_night_market_001`
- order: `1`
- title: `Arrive at the event`
- short_instruction: `Придите на вечерний маркет`
- description: `Придите на вечерний маркет и подтвердите, что вы участвуете в событии.`

- type: `attend_event`
- verification_type: `manual`
- target_type: `event`
- target_id: `event_phuket_night_market_001`

- proof_expectation: `Attendance proof or short text/photo confirmation`
- review_mode: `manual_required`
- reward_points: `70`

- user_instruction_short: `Подтвердите, что вы действительно были на событии.`
- submit_hint_short: `Этот шаг может уйти на ручную проверку`
- blocking_note: `Проверка участия может временно остановить дальнейшее продвижение`

- ui_hint: `This step should feel event-specific, not like a place check-in`
- step_badge: `Событие`
- icon: `calendar`
- emphasis: `event`

- show_map_hint: `false`
- show_photo_hint: `false`
- show_review_hint: `true`

#### Step media
- step_image_key: `quests/phuket/night-market-event-check-in/steps/step_night_market_001/01.jpg`
- step_image_alt: `Вечерний маркет и вход в событие`
- step_image_hint: `night market / arrival / event check-in`

---

### Step 2

- step_id: `step_night_market_002`
- order: `2`
- title: `Share a short event note`
- short_instruction: `Оставьте короткую заметку о событии`
- description: `Оставьте короткую публичную заметку о событии: что вам понравилось, что вы увидели или попробовали.`

- type: `space_action`
- verification_type: `space_post`
- target_type: `event`
- target_id: `event_phuket_night_market_001`

- proof_expectation: `Reference to a post, review or short report`
- review_mode: `baseline_or_manual`
- reward_points: `70`

- user_instruction_short: `Коротко расскажите, что вам понравилось в этом вечернем событии.`
- submit_hint_short: `Нужна ссылка или reference на публичное действие`
- blocking_note: `Социальный шаг должен оставаться follow-up к событию, а не отдельной механикой`

- ui_hint: `This step should clearly link event attendance with social follow-up`
- step_badge: `Отчёт`
- icon: `message-square`
- emphasis: `social`

- show_map_hint: `false`
- show_photo_hint: `false`
- show_review_hint: `true`

#### Step media
- step_image_key: `quests/phuket/night-market-event-check-in/steps/step_night_market_002/01.jpg`
- step_image_alt: `Короткая публичная заметка о вечернем событии`
- step_image_hint: `event note / public reflection / night market follow-up`

---

## Progress Examples

- not_started:
  - status: `not_started`
  - current_step: `null`

- in_progress:
  - status: `in_progress`
  - current_step: `1`

- pending_review:
  - status: `pending_review`
  - current_step: `1`

- completed:
  - status: `completed`
  - current_step: `2`

---

## Internal Notes

- import_notes: `Q4 should remain published/public and keep event-linked semantics visible in product UI.`
- content_warnings: `Step 1 must feel event-specific, not like a generic place check-in.`
- future_wave_notes: `Later waves may add richer event validation and better event-linked social UX, but not in Wave 1.5.`