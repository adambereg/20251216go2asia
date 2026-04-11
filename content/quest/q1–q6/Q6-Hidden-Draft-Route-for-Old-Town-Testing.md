# Q6 — Hidden Draft Route for Old Town Testing

## Purpose
Draft/non-public quest for authoring truth and visibility semantics.
An internal-only route used to verify draft/private behavior, authoring truth, and publish rules in Quest Asia.

---

## Core Identity

- id: `quest_draft_old_town_006`
- slug: `hidden-draft-route-for-old-town-testing`
- title: `Hidden Draft Route for Old Town Testing`
- short_description: `Черновой квест для внутренней проверки authoring и publish semantics.`
- full_description: `Этот квест нужен не для публичного каталога, а как пример внутреннего сценария в состоянии draft/private. Он помогает проверять, что authoring truth, publish rules и public visibility не смешиваются между собой.`
- city_id: `phuket`
- theme: `draft_test`
- difficulty: `medium`
- reward_points: `100`
- steps_count: `2`
- status: `draft`
- visibility: `private`

---

## Product Presentation

- card_badge: `Черновик`
- audience_label: `Только для внутреннего authoring и testing контекста`
- estimated_time_label: `20–30 мин`
- estimated_time_minutes_min: `20`
- estimated_time_minutes_max: `30`

- who_is_it_for:
  - `internal_authoring_context`
  - `testing_only`

- experience_style:
  - `draft`
  - `visibility_test`
  - `photo`
  - `manual_review`

- review_mode_summary: `Черновой сценарий для внутренней проверки`
- completion_rule_short: `Draft example only`
- reward_explanation_short: `Draft reward intent only; not public truth`

- start_cta_label: `Начать черновой маршрут`
- continue_cta_label: `Продолжить внутреннюю проверку`
- pending_cta_label: `Ожидает проверки`

- product_note: `Этот квест не должен выглядеть как публичный продуктовый сценарий и нужен только для проверки правил публикации и видимости.`

---

## Product Rationale

- why_this_quest_exists: `Cursor и frontend alignment не должны автоматически трактовать любой quest как публичный сценарий с карточкой и CTA.`
- what_user_will_feel: `Никакого публичного UX — это внутренний пример для authoring truth.`
- what_makes_it_special: `Это не пользовательский маршрут, а контрольный пример для draft/private semantics.`
- caution_note: `Этот квест не должен попадать в public catalog и не должен вести себя как обычный публичный квест.`

---

## Runtime / Rules

- completion_rule: `Draft example only`
- review_rule: `Draft example only`
- reward_explanation: `Draft reward intent only; not public truth.`

---

## Relations

- related_place_ids:
  - `place_phuket_old_town_gate`

- related_event_ids: []

- related_partner_ids: []

---

## Media

### Cover image
- cover_image_key: `quests/phuket/hidden-draft-route-for-old-town-testing/cover.jpg`
- cover_image_alt: `Внутренний черновой маршрут по Старому городу`
- cover_image_hint: `internal draft / old town / not public`

### Gallery images
- gallery_image_01_key: `quests/phuket/hidden-draft-route-for-old-town-testing/gallery/01.jpg`
- gallery_image_01_alt: `Черновой визуальный референс маршрута`

---

## SEO

- seo_title: `Hidden Draft Route for Old Town Testing — Quest Asia`
- seo_description: `Внутренний черновой маршрут для проверки authoring, publish semantics и public visibility.`

---

## Catalog Presentation

- catalog_card_variant: `internal`
- catalog_show:
  - `title`
  - `short_description`
  - `card_badge`

- catalog_hide:
  - `public_cta`
  - `public_route_entry`
  - `runtime_quest_label`
  - `external_signals`

---

## Detail Presentation

- detail_hero_style: `minimal`
- detail_show:
  - `title`
  - `full_description`
  - `audience_label`
  - `steps_preview`

- detail_hide:
  - `public_cta`
  - `reward_prominence`
  - `technical_runtime_labels`

---

## Run Presentation

- run_style: `internal_test`
- run_show:
  - `current_step_title`
  - `short_instruction`
  - `user_instruction_short`
  - `submit_hint_short`

- run_hide:
  - `public_experience_claims`
  - `raw_json_payload_by_default`

- allow_technical_mode_fallback: `true`

---

## Runtime UX Copy

- empty_state_title: `Пока нет доступных квестов`
- empty_state_text: `Скоро здесь появятся новые маршруты и задания.`

- not_found_title: `Квест не найден или недоступен`
- not_found_text: `Этот квест не опубликован для публичного режима или больше недоступен.`

- auth_required_title: `Войдите, чтобы начать внутреннюю проверку`
- auth_required_text: `Этот сценарий не предназначен для публичного прохождения.`

- review_pending_title: `Ожидает проверки`
- review_pending_text: `Черновой шаг отправлен на внутреннюю проверку.`

- completion_title: `Черновой маршрут завершён`
- completion_text: `Это внутренний тестовый сценарий, а не публичный продуктовый маршрут.`

---

## Steps

### Step 1

- step_id: `step_draft_001`
- order: `1`
- title: `Internal start point`
- short_instruction: `Проверьте стартовую структуру`
- description: `Черновой первый шаг для проверки структуры и видимости.`

- type: `visit_place`
- verification_type: `geo`
- target_type: `place`
- target_id: `place_phuket_old_town_gate`

- proof_expectation: `Geo proof`
- review_mode: `baseline`
- reward_points: `50`

- user_instruction_short: `Подтвердите, что стартовая структура шага работает корректно.`
- submit_hint_short: `Нужна гео-проверка`
- blocking_note: `Этот шаг существует только для внутреннего сценария`

- ui_hint: `Draft example; not for public card rendering`
- step_badge: `Черновик`
- icon: `map-pin`
- emphasis: `internal`

- show_map_hint: `true`
- show_photo_hint: `false`
- show_review_hint: `false`

#### Step media
- step_image_key: `quests/phuket/hidden-draft-route-for-old-town-testing/steps/step_draft_001/01.jpg`
- step_image_alt: `Черновая стартовая точка`
- step_image_hint: `draft start / old town / internal`

---

### Step 2

- step_id: `step_draft_002`
- order: `2`
- title: `Draft photo step`
- short_instruction: `Проверьте фото-шаг`
- description: `Черновой второй шаг с фото-подтверждением.`

- type: `photo_proof`
- verification_type: `manual`
- target_type: `custom`
- target_id: `custom_draft_photo_001`

- proof_expectation: `Photo proof`
- review_mode: `manual_required`
- reward_points: `50`

- user_instruction_short: `Проверьте, что фото-шаг работает как внутренний сценарий, а не как публичный квест.`
- submit_hint_short: `Фото-подтверждение может уйти на ручную проверку`
- blocking_note: `Этот шаг нужен только для authoring/publish semantics`

- ui_hint: `Useful for authoring/publish semantics, not for public baseline UI`
- step_badge: `Фото`
- icon: `camera`
- emphasis: `internal`

- show_map_hint: `false`
- show_photo_hint: `true`
- show_review_hint: `true`

#### Step media
- step_image_key: `quests/phuket/hidden-draft-route-for-old-town-testing/steps/step_draft_002/01.jpg`
- step_image_alt: `Черновой фото-шаг для внутренней проверки`
- step_image_hint: `draft photo / internal check / not public`

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
  - current_step: `2`

- completed:
  - status: `completed`
  - current_step: `2`

---

## Internal Notes

- import_notes: `Q6 must remain draft/private and must not leak into public catalog or public detail surfaces.`
- content_warnings: `This file exists to preserve authoring truth, not to create a public-facing quest.`
- future_wave_notes: `Later waves may add explicit internal authoring UI, but this route should still remain separate from public Quest truth.`