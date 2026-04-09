# Q2 — Sunset Viewpoint Photo Mission

## Purpose
Quest example focused on manual review and pending-review UX.
A sunset-oriented route that demonstrates photo proof, review delay, and honest completion semantics in Quest Asia.

---

## Core Identity

- id: `quest_sunset_viewpoint_002`
- slug: `sunset-viewpoint-photo-mission`
- title: `Sunset Viewpoint Photo Mission`
- short_description: `Квест на закатной точке: нужно дойти до обзорной площадки, сделать фото-доказательство и дождаться проверки.`
- full_description: `Этот квест построен вокруг одной красивой закатной точки и нужен, чтобы показать механику ручной проверки в Quest Asia. Пользователь не просто отмечается гео-точкой, а делает фото и коротко описывает, что увидел.`
- city_id: `phuket`
- theme: `photo_mission`
- difficulty: `medium`
- reward_points: `180`
- steps_count: `3`
- status: `published`
- visibility: `public`

---

## Product Presentation

- card_badge: `Фото-миссия`
- audience_label: `Для любителей фото и вечерних прогулок`
- estimated_time_label: `60–90 мин`
- estimated_time_minutes_min: `60`
- estimated_time_minutes_max: `90`

- who_is_it_for:
  - `photo_oriented_travelers`
  - `evening_walkers`

- experience_style:
  - `walking`
  - `photo`
  - `manual_review`

- review_mode_summary: `Квест включает ручную проверку фото-доказательства`
- completion_rule_short: `Пройдите 3 шага; завершение зависит от проверки`
- reward_explanation_short: `Баллы показываются как intent, без wallet settlement`

- start_cta_label: `Начать фото-миссию`
- continue_cta_label: `Продолжить миссию`
- pending_cta_label: `Ожидает проверки`

- product_note: `Подходит для тех, кто хочет попробовать не только маршрут, но и честную механику проверки фото-доказательства.`

---

## Product Rationale

- why_this_quest_exists: `Wave 1 frontend должен уметь честно показывать pending review, blocked state и завершение после ручного подтверждения.`
- what_user_will_feel: `Ощущение красивого вечернего маршрута с более осмысленным подтверждением результата.`
- what_makes_it_special: `Этот квест не заканчивается мгновенно: одно из его главных свойств — честная ручная проверка.`
- caution_note: `После отправки фото квест может перейти в статус «Ожидает проверки» и не дать мгновенного завершения.`

---

## Runtime / Rules

- completion_rule: `Complete all 3 steps; manual review is required before final completion`
- review_rule: `At least one proof must be manually approved`
- reward_explanation: `Reward points are shown as quest intent only.`

---

## Relations

- related_place_ids:
  - `place_phuket_viewpoint_entry`
  - `place_phuket_sunset_viewpoint`

- related_event_ids: []

- related_partner_ids: []

---

## Media

### Cover image
- cover_image_key: `quest/q2/cover.jpg`
- cover_image_alt: `Закатный вид с обзорной площадки на Пхукете`
- cover_image_hint: `sunset viewpoint / hilltop / golden hour`

### Gallery images
- gallery_image_01_key: `quest/q2/gallery-01.jpg`
- gallery_image_01_alt: `Дорожка к обзорной площадке на закате`

- gallery_image_02_key: `quest/q2/gallery-02.jpg`
- gallery_image_02_alt: `Вид с закатной точки на Пхукете`

---

## SEO

- seo_title: `Sunset Viewpoint Photo Mission — Quest Asia`
- seo_description: `Закатный квест на Пхукете: дойдите до обзорной точки, сделайте фото и дождитесь проверки результата.`

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
- review_pending_text: `Мы получили ваш материал. Фото-подтверждение проверяется вручную.`

- completion_title: `Квест завершён`
- completion_text: `Маршрут завершён. Итоговый статус подтверждён.`

---

## Steps

### Step 1

- step_id: `step_sunset_001`
- order: `1`
- title: `Reach the entry point`
- short_instruction: `Дойдите до стартовой точки`
- description: `Придите к стартовой точке маршрута к обзорной площадке.`

- type: `visit_place`
- verification_type: `geo`
- target_type: `place`
- target_id: `place_phuket_viewpoint_entry`

- proof_expectation: `Geo proof`
- review_mode: `baseline`
- reward_points: `30`

- user_instruction_short: `Подтвердите, что вы дошли до стартовой точки маршрута.`
- submit_hint_short: `Нужна гео-проверка`
- blocking_note: `null`

- ui_hint: `Quick and simple opening step`
- step_badge: `Старт`
- icon: `map-pin`
- emphasis: `start`

- show_map_hint: `true`
- show_photo_hint: `false`
- show_review_hint: `false`

#### Step media
- step_image_key: `quest/q2/step-01.jpg`
- step_image_alt: `Подход к обзорной площадке на Пхукете`
- step_image_hint: `viewpoint entry / path / sunset lead-in`

---

### Step 2

- step_id: `step_sunset_002`
- order: `2`
- title: `Upload a sunset photo`
- short_instruction: `Сделайте фото заката`
- description: `Сделайте фотографию вида с площадки и коротко напишите, что именно вы увидели.`

- type: `photo_proof`
- verification_type: `manual`
- target_type: `place`
- target_id: `place_phuket_sunset_viewpoint`

- proof_expectation: `One sunset photo + short text note`
- review_mode: `manual_required`
- reward_points: `90`

- user_instruction_short: `Загрузите одно фото закатного вида и коротко подпишите, что именно вы увидели.`
- submit_hint_short: `После отправки шаг уйдёт на ручную проверку`
- blocking_note: `Пока проверка не завершена, продвижение по квесту может быть остановлено`

- ui_hint: `This step should clearly produce a pending-review state`
- step_badge: `Фото`
- icon: `camera`
- emphasis: `proof`

- show_map_hint: `false`
- show_photo_hint: `true`
- show_review_hint: `true`

#### Step media
- step_image_key: `quest/q2/step-02.jpg`
- step_image_alt: `Закатный вид с обзорной площадки`
- step_image_hint: `sunset viewpoint / golden hour / photo proof`

---

### Step 3

- step_id: `step_sunset_003`
- order: `3`
- title: `Confirm the mission`
- short_instruction: `Подтвердите завершение`
- description: `После фото-подтверждения завершите квест и дождитесь результата проверки.`

- type: `challenge`
- verification_type: `manual`
- target_type: `custom`
- target_id: `custom_sunset_reflection`

- proof_expectation: `Short final text confirmation`
- review_mode: `manual_required`
- reward_points: `60`

- user_instruction_short: `Коротко подтвердите завершение миссии и дождитесь результата проверки.`
- submit_hint_short: `Завершение не означает мгновенный успех`
- blocking_note: `Финальный статус зависит от результата ручной проверки`

- ui_hint: `Completion depends on the review result; do not imply instant success`
- step_badge: `Финал`
- icon: `flag`
- emphasis: `finish`

- show_map_hint: `false`
- show_photo_hint: `false`
- show_review_hint: `true`

#### Step media
- step_image_key: `quest/q2/step-03.jpg`
- step_image_alt: `Финальная точка фото-миссии на закате`
- step_image_hint: `sunset close / mission confirmation / evening finish`

---

## Progress Examples

- in_progress:
  - status: `in_progress`
  - current_step: `2`

- pending_review:
  - status: `pending_review`
  - current_step: `2`

- failed:
  - status: `failed`
  - current_step: `2`

- completed:
  - status: `completed`
  - current_step: `3`

---

## Internal Notes

- import_notes: `Q2 already exists in staging DB as published/public. Productization pass should preserve manual review semantics and make pending-review UX more human-readable.`
- content_warnings: `Step 3 still uses target_type=custom in content semantics; runtime normalization may still map this safely for current bounded implementation.`
- future_wave_notes: `Later waves may add richer photo upload UX, moderation timelines, and clearer post-review outcome messaging, but not in Wave 1.5.`