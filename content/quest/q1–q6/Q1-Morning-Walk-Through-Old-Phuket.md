# Q1 — Morning Walk Through Old Phuket

## Purpose
Baseline public quest for simple catalog / detail / run alignment.
A calm introductory route through Old Phuket Town with one photo proof step and a soft manual-review moment.

---

## Core Identity

- id: `quest_phuket_old_town_001`
- slug: `morning-walk-through-old-phuket`
- title: `Morning Walk Through Old Phuket`
- short_description: `Короткий утренний маршрут по Старому городу Пхукета: три точки, одно фото и мягкий вход в Quest Asia.`
- full_description: `Этот квест помогает спокойно познакомиться со Старым городом Пхукета через короткий маршрут по трём точкам. Он подходит для первого опыта с Quest Asia: здесь нет сложной механики, только понятные шаги, лёгкий темп и один момент с ручной проверкой.`
- city_id: `phuket`
- theme: `city_discovery`
- difficulty: `easy`
- reward_points: `120`
- steps_count: `3`
- status: `published`
- visibility: `public`

---

## Product Presentation

- card_badge: `Утренняя прогулка`
- audience_label: `Для новичков и спокойных исследователей`
- estimated_time_label: `45–60 мин`
- estimated_time_minutes_min: `45`
- estimated_time_minutes_max: `60`

- who_is_it_for:
  - `newcomers`
  - `first_time_visitors`
  - `slow_explorers`

- experience_style:
  - `walking`
  - `photo`
  - `light_review`

- review_mode_summary: `Один шаг может уйти на ручную проверку`
- completion_rule_short: `Пройдите 3 шага по порядку`
- reward_explanation_short: `Баллы показываются как intent, без wallet settlement`

- start_cta_label: `Начать квест`
- continue_cta_label: `Продолжить прохождение`
- pending_cta_label: `Ожидает проверки`

- product_note: `Хороший первый квест для знакомства с Quest Asia без сложной механики и перегрузки.`

---

## Product Rationale

- why_this_quest_exists: `Новый пользователь должен увидеть, что Quest Asia — это не сложная игра, а понятный сценарий знакомства с городом.`
- what_user_will_feel: `Спокойное первое знакомство с городом и с самим форматом квестов.`
- what_makes_it_special: `Короткий, понятный маршрут с одной фото-задачей и мягким входом в manual review mechanics.`
- caution_note: `После фото-шага может потребоваться ручная проверка.`

---

## Runtime / Rules

- completion_rule: `Complete all 3 steps in order`
- review_rule: `Step 2 may require manual review before the route is fully confirmed`
- reward_explanation: `Quest shows reward points intent only. Wallet settlement is outside Quest wave 1.`

---

## Relations

- related_place_ids:
  - `place_phuket_old_town_gate`
  - `place_phuket_yaowarat_corner`
  - `place_phuket_sunday_market_square`

- related_event_ids: []

- related_partner_ids: []

---

## Media

### Cover image
- cover_image_key: `quest/q1/cover.jpg`
- cover_image_alt: `Утренние улицы Старого города Пхукета`
- cover_image_hint: `old-town-phuket / pastel streets / morning walk`

### Gallery images
- gallery_image_01_key: `quest/q1/gallery-01.jpg`
- gallery_image_01_alt: `Пастельные фасады и улица Старого города Пхукета`

- gallery_image_02_key: `quest/q1/gallery-02.jpg`
- gallery_image_02_alt: `Финальная площадь маршрута в Старом городе`

---

## SEO

- seo_title: `Morning Walk Through Old Phuket — Quest Asia`
- seo_description: `Короткий маршрут по Старому городу Пхукета: три точки, одно фото и мягкий вход в Quest Asia.`

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
- review_pending_text: `Мы получили ваш материал. Проверка может занять некоторое время.`

- completion_title: `Квест завершён`
- completion_text: `Маршрут завершён. Итоговый статус подтверждён.`

---

## Steps

### Step 1

- step_id: `step_phuket_old_town_001`
- order: `1`
- title: `Reach the starting point`
- short_instruction: `Дойдите до стартовой точки`
- description: `Придите к стартовой точке маршрута в Старом городе и подтвердите, что вы начали прогулку.`

- type: `visit_place`
- verification_type: `geo`
- target_type: `place`
- target_id: `place_phuket_old_town_gate`

- proof_expectation: `Geo proof at the starting point`
- review_mode: `baseline`
- reward_points: `20`

- user_instruction_short: `Когда будете у стартовой точки, подтвердите начало маршрута.`
- submit_hint_short: `Нужна гео-проверка`
- blocking_note: `null`

- ui_hint: `Simple opening step with a short instruction block`
- step_badge: `Старт`
- icon: `map-pin`
- emphasis: `start`

- show_map_hint: `true`
- show_photo_hint: `false`
- show_review_hint: `false`

#### Step media
- step_image_key: `quest/q1/step-01.jpg`
- step_image_alt: `Стартовая точка маршрута в Старом городе Пхукета`
- step_image_hint: `old town gate / morning start point`

---

### Step 2

- step_id: `step_phuket_old_town_002`
- order: `2`
- title: `Make a street photo note`
- short_instruction: `Сделайте фото улицы`
- description: `Сделайте фотографию одной из характерных улиц или фасадов Старого города и добавьте короткую подпись.`

- type: `photo_proof`
- verification_type: `manual`
- target_type: `place`
- target_id: `place_phuket_yaowarat_corner`

- proof_expectation: `One photo and a short text note`
- review_mode: `manual_required`
- reward_points: `40`

- user_instruction_short: `Загрузите одно фото и коротко подпишите, что именно вы сняли.`
- submit_hint_short: `После отправки шаг может уйти на проверку`
- blocking_note: `После отправки может появиться статус «Ожидает проверки»`

- ui_hint: `This step should clearly show that pending review is possible`
- step_badge: `Фото`
- icon: `camera`
- emphasis: `proof`

- show_map_hint: `false`
- show_photo_hint: `true`
- show_review_hint: `true`

#### Step media
- step_image_key: `quest/q1/step-02.jpg`
- step_image_alt: `Характерная улица или фасад в Старом городе Пхукета`
- step_image_hint: `yaowarat corner / colorful facade / street photo`

---

### Step 3

- step_id: `step_phuket_old_town_003`
- order: `3`
- title: `Finish the route at the square`
- short_instruction: `Дойдите до финальной точки`
- description: `Дойдите до финальной точки маршрута и подтвердите завершение прогулки.`

- type: `visit_place`
- verification_type: `geo`
- target_type: `place`
- target_id: `place_phuket_sunday_market_square`

- proof_expectation: `Geo proof at the finishing point`
- review_mode: `baseline`
- reward_points: `60`

- user_instruction_short: `Подтвердите, что вы дошли до финальной точки маршрута.`
- submit_hint_short: `Нужна гео-проверка`
- blocking_note: `null`

- ui_hint: `Final completion step; should feel conclusive but not theatrical`
- step_badge: `Финиш`
- icon: `flag`
- emphasis: `finish`

- show_map_hint: `true`
- show_photo_hint: `false`
- show_review_hint: `false`

#### Step media
- step_image_key: `quest/q1/step-03.jpg`
- step_image_alt: `Финальная площадь маршрута в Старом городе Пхукета`
- step_image_hint: `sunday market square / finish point`

---

## Progress Examples

- not_started:
  - status: `not_started`
  - current_step: `null`

- in_progress:
  - status: `in_progress`
  - current_step: `2`

- pending_review:
  - status: `pending_review`
  - current_step: `2`

- completed:
  - status: `completed`
  - current_step: `3`

---

## Internal Notes

- import_notes: `Q1 already exists in staging DB as published/public. Productization pass should enrich presentation and media rather than change runtime semantics.`
- content_warnings: `Step 2 requires manual review semantics to stay visible in UI.`
- future_wave_notes: `Later waves may add richer map guidance and a more user-friendly photo submission flow, but not in Wave 1.5.`