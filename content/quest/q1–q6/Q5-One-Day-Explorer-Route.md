# Q5 — One Day Explorer Route

## Purpose
Long mixed quest for dense detail page and longer progression.
A half-day city scenario that combines place discovery, partner stop, event attendance, photo proof, and social action in one route.

---

## Core Identity

- id: `quest_one_day_explorer_005`
- slug: `one-day-explorer-route`
- title: `One Day Explorer Route`
- short_description: `Длинный смешанный квест на полдня: место, партнёрская точка, событие, фото-доказательство и social action в одном сценарии.`
- full_description: `Этот квест нужен как пример длинного, насыщенного сценария. Он сочетает несколько разных типов шагов и показывает, как Quest Asia может объединять знакомство с местом, партнёрскую точку, участие в событии, фото-подтверждение и социальный след в одном маршруте.`
- city_id: `phuket`
- theme: `mixed_route`
- difficulty: `hard`
- reward_points: `320`
- steps_count: `6`
- status: `published`
- visibility: `public`

---

## Product Presentation

- card_badge: `Маршрут на полдня`
- audience_label: `Для активных исследователей и тех, кто хочет насыщенный городской сценарий`
- estimated_time_label: `3–4 часа`
- estimated_time_minutes_min: `180`
- estimated_time_minutes_max: `240`

- who_is_it_for:
  - `active_explorers`
  - `users_who_want_richer_city_scenarios`

- experience_style:
  - `walking`
  - `partner_stop`
  - `event`
  - `photo`
  - `social_action`
  - `manual_review`

- review_mode_summary: `Некоторые шаги могут остановить маршрут до ручной проверки`
- completion_rule_short: `Пройдите 6 шагов по порядку`
- reward_explanation_short: `Баллы показываются как intent, без wallet settlement`

- start_cta_label: `Начать маршрут`
- continue_cta_label: `Продолжить маршрут`
- pending_cta_label: `Ожидает проверки`

- product_note: `Хороший пример насыщенного маршрута на полдня, где Quest Asia ощущается не как одно действие, а как целый сценарий дня.`

---

## Product Rationale

- why_this_quest_exists: `Frontend wave 1 должен выдерживать не только короткие квесты, но и длинный сценарий с более сложным progression flow и несколькими точками проверки.`
- what_user_will_feel: `Ощущение насыщенного городского дня, в котором есть движение, партнёрские точки, событие, фото и личный итог.`
- what_makes_it_special: `Это самый плотный mixed-route сценарий в минимальном Quest pack: он показывает, что квест может быть не просто чек-ином, а целым маршрутом.`
- caution_note: `Некоторые шаги могут увести маршрут в pending review и временно остановить продвижение.`

---

## Runtime / Rules

- completion_rule: `Complete all 6 steps in order`
- review_rule: `Some steps may pause progress for manual review before the route can continue`
- reward_explanation: `Reward points are quest intent only; no wallet or voucher settlement is implied inside Quest.`

---

## Relations

- related_place_ids:
  - `place_phuket_old_town_gate`
  - `place_phuket_viewpoint_entry`

- related_event_ids:
  - `event_phuket_local_meetup_001`

- related_partner_ids:
  - `partner_rf_cafe_001`

---

## Media

### Cover image
- cover_image_key: `quest/q5/cover.jpg`
- cover_image_alt: `Насыщенный городской маршрут по Пхукету на полдня`
- cover_image_hint: `city route / mixed activities / daytime exploration`

### Gallery images
- gallery_image_01_key: `quest/q5/gallery-01.jpg`
- gallery_image_01_alt: `Городская точка старта маршрута`

- gallery_image_02_key: `quest/q5/gallery-02.jpg`
- gallery_image_02_alt: `Партнёрская кофейня на маршруте`

- gallery_image_03_key: `quest/q5/gallery-03.jpg`
- gallery_image_03_alt: `Фото-этап и атмосфера дневного исследования`

---

## SEO

- seo_title: `One Day Explorer Route — Quest Asia`
- seo_description: `Длинный mixed-route квест на Пхукете: место, партнёрская точка, событие, фото и social action в одном маршруте.`

---

## Catalog Presentation

- catalog_card_variant: `featured`
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

- auth_required_title: `Войдите, чтобы начать маршрут`
- auth_required_text: `Запуск, прогресс и отправка шагов доступны только после входа.`

- review_pending_title: `Ожидает проверки`
- review_pending_text: `Один из шагов отправлен на проверку. Продолжение маршрута может быть временно остановлено.`

- completion_title: `Маршрут завершён`
- completion_text: `Все шаги маршрута пройдены. Итоговый статус подтверждён.`

---

## Steps

### Step 1

- step_id: `step_one_day_001`
- order: `1`
- title: `Check in at the first city point`
- short_instruction: `Начните маршрут с городской точки`
- description: `Начните маршрут с первой городской точки и подтвердите, что вы на месте.`

- type: `visit_place`
- verification_type: `geo`
- target_type: `place`
- target_id: `place_phuket_old_town_gate`

- proof_expectation: `Geo proof`
- review_mode: `baseline`
- reward_points: `30`

- user_instruction_short: `Подтвердите, что вы дошли до первой городской точки маршрута.`
- submit_hint_short: `Нужна гео-проверка`
- blocking_note: `null`

- ui_hint: `Simple opening step that quickly moves the user into progression`
- step_badge: `Старт`
- icon: `map-pin`
- emphasis: `start`

- show_map_hint: `true`
- show_photo_hint: `false`
- show_review_hint: `false`

#### Step media
- step_image_key: `quest/q5/step-01.jpg`
- step_image_alt: `Первая городская точка маршрута`
- step_image_hint: `old town gate / first stop / route start`

---

### Step 2

- step_id: `step_one_day_002`
- order: `2`
- title: `Visit the partner coffee stop`
- short_instruction: `Зайдите в партнёрскую кофейню`
- description: `Зайдите в партнёрскую кофейню и подтвердите визит.`

- type: `visit_partner`
- verification_type: `qr`
- target_type: `partner`
- target_id: `partner_rf_cafe_001`

- proof_expectation: `QR proof at partner venue`
- review_mode: `baseline`
- reward_points: `40`

- user_instruction_short: `Подтвердите визит в партнёрскую точку.`
- submit_hint_short: `Нужна QR-проверка`
- blocking_note: `null`

- ui_hint: `Partner step should remain simple and not imply voucher logic`
- step_badge: `Партнёр`
- icon: `coffee`
- emphasis: `partner`

- show_map_hint: `false`
- show_photo_hint: `false`
- show_review_hint: `false`

#### Step media
- step_image_key: `quest/q5/step-02.jpg`
- step_image_alt: `Партнёрская кофейня на маршруте`
- step_image_hint: `coffee stop / partner venue / casual city pause`

---

### Step 3

- step_id: `step_one_day_003`
- order: `3`
- title: `Attend the local meetup`
- short_instruction: `Посетите локальное событие`
- description: `Присоединитесь к локальному событию и подтвердите участие.`

- type: `attend_event`
- verification_type: `manual`
- target_type: `event`
- target_id: `event_phuket_local_meetup_001`

- proof_expectation: `Attendance confirmation or short text proof`
- review_mode: `manual_required`
- reward_points: `60`

- user_instruction_short: `Подтвердите, что вы были на локальном событии.`
- submit_hint_short: `После отправки шаг может уйти на проверку`
- blocking_note: `Этот шаг может временно остановить дальнейшее продвижение`

- ui_hint: `This step should naturally allow a pending review interruption`
- step_badge: `Событие`
- icon: `calendar`
- emphasis: `event`

- show_map_hint: `false`
- show_photo_hint: `false`
- show_review_hint: `true`

#### Step media
- step_image_key: `quest/q5/step-03.jpg`
- step_image_alt: `Локальное событие в рамках маршрута`
- step_image_hint: `local meetup / event participation / daytime crowd`

---

### Step 4

- step_id: `step_one_day_004`
- order: `4`
- title: `Upload a route photo`
- short_instruction: `Сделайте фото маршрута`
- description: `Сделайте фотографию маршрута или места, которое лучше всего передаёт атмосферу дня.`

- type: `photo_proof`
- verification_type: `manual`
- target_type: `place`
- target_id: `place_phuket_viewpoint_entry`

- proof_expectation: `One photo and a short text note`
- review_mode: `manual_required`
- reward_points: `50`

- user_instruction_short: `Загрузите одно фото, которое лучше всего передаёт атмосферу этого дня.`
- submit_hint_short: `Фото может уйти на ручную проверку`
- blocking_note: `После отправки маршрут может перейти в статус ожидания проверки`

- ui_hint: `Proof-heavy step; keep instructions short but clear`
- step_badge: `Фото`
- icon: `camera`
- emphasis: `proof`

- show_map_hint: `false`
- show_photo_hint: `true`
- show_review_hint: `true`

#### Step media
- step_image_key: `quest/q5/step-04.jpg`
- step_image_alt: `Фото-этап маршрута и дневной городской вид`
- step_image_hint: `route photo / city atmosphere / daytime exploration`

---

### Step 5

- step_id: `step_one_day_005`
- order: `5`
- title: `Leave a short public report`
- short_instruction: `Оставьте короткий публичный отчёт`
- description: `Оставьте короткий публичный отчёт о маршруте: что вы увидели и что было самым интересным.`

- type: `space_action`
- verification_type: `space_post`
- target_type: `custom`
- target_id: `custom_one_day_report_001`

- proof_expectation: `Space post or short public report reference`
- review_mode: `baseline_or_manual`
- reward_points: `60`

- user_instruction_short: `Коротко расскажите, что вам больше всего запомнилось в маршруте.`
- submit_hint_short: `Нужна ссылка или reference на публичное действие`
- blocking_note: `В зависимости от контекста шаг может потребовать подтверждение`

- ui_hint: `Show how social action can be part of a longer scenario`
- step_badge: `Отчёт`
- icon: `message-square`
- emphasis: `social`

- show_map_hint: `false`
- show_photo_hint: `false`
- show_review_hint: `true`

#### Step media
- step_image_key: `quest/q5/step-05.jpg`
- step_image_alt: `Короткий публичный отчёт о маршруте`
- step_image_hint: `social note / journey recap / public reflection`

---

### Step 6

- step_id: `step_one_day_006`
- order: `6`
- title: `Complete the route`
- short_instruction: `Подтвердите завершение маршрута`
- description: `Подтвердите завершение маршрута и дождитесь итогового статуса.`

- type: `challenge`
- verification_type: `manual`
- target_type: `custom`
- target_id: `custom_one_day_finish_001`

- proof_expectation: `Final structured confirmation`
- review_mode: `manual_required`
- reward_points: `80`

- user_instruction_short: `Подтвердите, что маршрут завершён, и дождитесь финального статуса.`
- submit_hint_short: `Финальный статус может зависеть от проверки`
- blocking_note: `Завершение маршрута не всегда означает мгновенный итоговый успех`

- ui_hint: `Final step should feel conclusive without turning into rewards theater`
- step_badge: `Финал`
- icon: `flag`
- emphasis: `finish`

- show_map_hint: `false`
- show_photo_hint: `false`
- show_review_hint: `true`

#### Step media
- step_image_key: `quest/q5/step-06.jpg`
- step_image_alt: `Финальный этап насыщенного маршрута на полдня`
- step_image_hint: `route completion / end of day / final confirmation`

---

## Progress Examples

- in_progress:
  - status: `in_progress`
  - current_step: `4`

- pending_review:
  - status: `pending_review`
  - current_step: `4`

- completed:
  - status: `completed`
  - current_step: `6`

---

## Internal Notes

- import_notes: `Q5 already exists in staging DB as published/public. Productization pass should preserve mixed-route semantics and make long progression easier to understand for the user.`
- content_warnings: `Steps 5 and 6 still use custom-target semantics in content logic; current runtime may normalize them safely for bounded implementation.`
- future_wave_notes: `Later waves may add richer route progression UI, maps, richer completion summaries, and better social proof integration, but not in Wave 1.5.`