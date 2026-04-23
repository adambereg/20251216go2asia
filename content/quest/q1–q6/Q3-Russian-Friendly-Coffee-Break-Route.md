# Q3 — Russian Friendly Coffee Break Route

## Purpose
Partner-linked quest for visit_partner display and partner-step UX.
A short Russian Friendly route through two partner venues, ending with a light social action without turning Quest into voucher logic or partner CRM.

---

## Core Identity

- id: `quest_rf_coffee_route_003`
- slug: `russian-friendly-coffee-break-route`
- title: `Russian Friendly Coffee Break Route`
- short_description: `Короткий квест по двум Russian Friendly точкам: зайти, подтвердить визит и оставить короткий social trace.`
- full_description: `Этот квест показывает, как Quest Asia может направлять пользователя в точки Russian Friendly без разворачивания voucher logic внутри самого Quest. Пользователь проходит короткий маршрут, подтверждает визит и оставляет след активности, который может быть полезен и для партнёра, и для экосистемы.`
- city_id: `phuket`
- theme: `partner_route`
- difficulty: `easy`
- reward_points: `150`
- steps_count: `3`
- status: `published`
- visibility: `public`

---

## Product Presentation

- card_badge: `Партнёрский маршрут`
- audience_label: `Для тех, кто хочет попробовать Russian Friendly опыт без сложного сценария`
- estimated_time_label: `40–60 мин`
- estimated_time_minutes_min: `40`
- estimated_time_minutes_max: `60`

- who_is_it_for:
  - `casual_explorers`
  - `coffee_lovers`
  - `users_trying_rf_linked_experiences`

- experience_style:
  - `walking`
  - `partner_stop`
  - `qr`
  - `social_action`

- review_mode_summary: `Один социальный шаг может потребовать дополнительное подтверждение`
- completion_rule_short: `Пройдите 3 шага по порядку`
- reward_explanation_short: `Баллы показываются как intent, без voucher redemption и wallet settlement`

- start_cta_label: `Начать маршрут`
- continue_cta_label: `Продолжить маршрут`
- pending_cta_label: `Ожидает проверки`

- product_note: `Короткий и понятный маршрут, который показывает, как Quest Asia связывается с Russian Friendly точками без усложнения механики.`

---

## Product Rationale

- why_this_quest_exists: `Frontend должен научиться показывать partner-linked quest без превращения Quest в voucher wallet или partner CRM.`
- what_user_will_feel: `Лёгкий городской маршрут с двумя остановками и мягким социальным финалом.`
- what_makes_it_special: `Здесь Quest указывает на партнёрские точки, но не притворяется системой ваучеров или кассовым инструментом.`
- caution_note: `Финальный social step может потребовать подтверждение и не должен подаваться как мгновенно завершённый.`

---

## Runtime / Rules

- completion_rule: `Complete all 3 steps in order`
- review_rule: `One social step may require manual confirmation`
- reward_explanation: `Quest shows activity reward intent only. No voucher redemption is implied in wave 1.`

---

## Relations

- related_place_ids: []

- related_event_ids: []

- related_partner_ids:
  - `partner_rf_cafe_001`
  - `partner_rf_bakery_002`

---

## Media

### Cover image
- cover_image_key: `quests/phuket/russian-friendly-coffee-break-route/cover.jpg`
- cover_image_alt: `Russian Friendly кофейный маршрут в Пхукете`
- cover_image_hint: `coffee shop / local partner venue / casual city stop`

### Gallery images
- gallery_image_01_key: `quests/phuket/russian-friendly-coffee-break-route/gallery/01.jpg`
- gallery_image_01_alt: `Первая кофейная точка маршрута`

- gallery_image_02_key: `quests/phuket/russian-friendly-coffee-break-route/gallery/02.jpg`
- gallery_image_02_alt: `Вторая партнёрская точка и городская пауза`

---

## SEO

- seo_title: `Russian Friendly Coffee Break Route — Quest Asia`
- seo_description: `Короткий Russian Friendly маршрут на Пхукете: две партнёрские точки и лёгкий social step в финале.`

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

- auth_required_title: `Войдите, чтобы начать маршрут`
- auth_required_text: `Запуск, прогресс и отправка шагов доступны только после входа.`

- review_pending_title: `Ожидает проверки`
- review_pending_text: `Один из шагов маршрута отправлен на подтверждение. Продолжение может быть временно ограничено.`

- completion_title: `Маршрут завершён`
- completion_text: `Все шаги маршрута пройдены. Итоговый статус подтверждён.`

---

## Steps

### Step 1

- step_id: `step_rf_coffee_001`
- order: `1`
- title: `Visit the first partner venue`
- short_instruction: `Зайдите в первую точку маршрута`
- description: `Зайдите в первую точку маршрута Russian Friendly и подтвердите визит.`

- type: `visit_partner`
- verification_type: `geo`
- target_type: `partner`
- target_id: `partner_rf_cafe_001`

- proof_expectation: `Geo proof at partner venue`
- review_mode: `baseline`
- reward_points: `40`

- user_instruction_short: `Подтвердите, что вы пришли в первую партнёрскую точку.`
- submit_hint_short: `Нужна гео-проверка`
- blocking_note: `null`

- ui_hint: `Partner-linked step without implying voucher usage`
- step_badge: `Партнёр`
- icon: `coffee`
- emphasis: `partner`

- show_map_hint: `true`
- show_photo_hint: `false`
- show_review_hint: `false`

#### Step media
- step_image_key: `quests/phuket/russian-friendly-coffee-break-route/steps/step_rf_coffee_001/01.jpg`
- step_image_alt: `Первая Russian Friendly точка маршрута`
- step_image_hint: `partner cafe / first stop / casual visit`

---

### Step 2

- step_id: `step_rf_coffee_002`
- order: `2`
- title: `Confirm the second stop`
- short_instruction: `Подтвердите вторую точку`
- description: `Посетите вторую точку маршрута и подтвердите своё присутствие.`

- type: `visit_partner`
- verification_type: `qr`
- target_type: `partner`
- target_id: `partner_rf_bakery_002`

- proof_expectation: `QR proof or equivalent venue confirmation`
- review_mode: `baseline`
- reward_points: `50`

- user_instruction_short: `Подтвердите присутствие во второй партнёрской точке маршрута.`
- submit_hint_short: `Нужна QR-проверка`
- blocking_note: `null`

- ui_hint: `Simple partner interaction step`
- step_badge: `QR`
- icon: `scan-line`
- emphasis: `partner`

- show_map_hint: `false`
- show_photo_hint: `false`
- show_review_hint: `false`

#### Step media
- step_image_key: `quests/phuket/russian-friendly-coffee-break-route/steps/step_rf_coffee_002/01.jpg`
- step_image_alt: `Вторая Russian Friendly точка маршрута`
- step_image_hint: `partner bakery / second stop / qr check`

---

### Step 3

- step_id: `step_rf_coffee_003`
- order: `3`
- title: `Leave a short social note`
- short_instruction: `Оставьте короткий публичный след`
- description: `Оставьте короткий публичный след о маршруте: отзыв, заметку или мини-отчёт.`

- type: `space_action`
- verification_type: `space_post`
- target_type: `partner`
- target_id: `partner_rf_bakery_002`

- proof_expectation: `Reference to a Space post or short social report`
- review_mode: `manual_or_baseline`
- reward_points: `60`

- user_instruction_short: `Коротко расскажите, как прошёл маршрут и что вам запомнилось.`
- submit_hint_short: `Нужна ссылка или reference на публичное действие`
- blocking_note: `Социальный шаг не означает, что Quest владеет самим контентом`

- ui_hint: `Show that this is a social step, but Quest does not own social content`
- step_badge: `Отчёт`
- icon: `message-square`
- emphasis: `social`

- show_map_hint: `false`
- show_photo_hint: `false`
- show_review_hint: `true`

#### Step media
- step_image_key: `quests/phuket/russian-friendly-coffee-break-route/steps/step_rf_coffee_003/01.jpg`
- step_image_alt: `Финальный social step на маршруте`
- step_image_hint: `social note / partner route recap / short public trace`

---

## Progress Examples

- in_progress:
  - status: `in_progress`
  - current_step: `1`

- pending_review:
  - status: `pending_review`
  - current_step: `3`

- completed:
  - status: `completed`
  - current_step: `3`

---

## Internal Notes

- import_notes: `Q3 should remain published/public and preserve partner-linked semantics without drifting into voucher or CRM ownership.`
- content_warnings: `Step 3 must stay clearly social-reference based and not be framed as Quest-owned social content.`
- future_wave_notes: `Later waves may deepen RF integration and social proof UX, but not in Wave 1.5.`