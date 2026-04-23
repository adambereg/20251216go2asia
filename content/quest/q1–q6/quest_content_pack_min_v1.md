Q1 — Morning Walk Through Old Phuket
Purpose
Baseline public quest for simple catalog/detail/run alignment.
Summary
•	id: quest_phuket_old_town_001 
•	slug: morning-walk-through-old-phuket 
•	title: Morning Walk Through Old Phuket 
•	short_description: Короткий утренний маршрут по Старому городу Пхукета: три точки, одно фото и мягкий вход в Quest Asia. 
•	theme: city_discovery 
•	difficulty: easy 
•	reward_points: 120 
•	steps_count: 3 
•	status: published 
•	visibility: public 
•	city_id: phuket 
•	cover_image_hint: old-town-phuket / pastel streets / morning walk 
Detail
•	full_description: Этот квест помогает спокойно познакомиться со Старым городом Пхукета через короткий маршрут по трём точкам. Он подходит для первого опыта с Quest Asia: здесь нет сложной механики, только понятные шаги, лёгкий темп и один момент с ручной проверкой. 
•	why_this_quest_exists: Новый пользователь должен увидеть, что Quest Asia — это не сложная игра, а понятный сценарий знакомства с городом. 
•	estimated_time: 45–60 min 
•	who_is_it_for: newcomers / first-time visitors / slow explorers 
•	completion_rule: Complete all 3 steps in order 
•	review_rule: Step 2 may require manual review before the route is fully confirmed 
•	reward_explanation: Quest shows reward points intent only. Wallet settlement is outside Quest wave 1. 
•	related_place_ids: 
o	place_phuket_old_town_gate 
o	place_phuket_yaowarat_corner 
o	place_phuket_sunday_market_square 
•	related_event_ids: [] 
•	related_partner_ids: [] 
Steps
Step 1
•	step_id: step_phuket_old_town_001 
•	order: 1 
•	title: Reach the starting point 
•	description: Придите к стартовой точке маршрута в Старом городе и подтвердите, что вы начали прогулку. 
•	type: visit_place 
•	verification_type: geo 
•	target_type: place 
•	target_id: place_phuket_old_town_gate 
•	proof_expectation: Geo proof at the starting point 
•	review_mode: baseline 
•	reward_points: 20 
•	ui_hint: Simple opening step with a short instruction block 
Step 2
•	step_id: step_phuket_old_town_002 
•	order: 2 
•	title: Make a street photo note 
•	description: Сделайте фотографию одной из характерных улиц или фасадов Старого города и добавьте короткую подпись. 
•	type: photo_proof 
•	verification_type: manual 
•	target_type: place 
•	target_id: place_phuket_yaowarat_corner 
•	proof_expectation: One photo and a short text note 
•	review_mode: manual_required 
•	reward_points: 40 
•	ui_hint: This step should clearly show that pending review is possible 
Step 3
•	step_id: step_phuket_old_town_003 
•	order: 3 
•	title: Finish the route at the square 
•	description: Дойдите до финальной точки маршрута и подтвердите завершение прогулки. 
•	type: visit_place 
•	verification_type: geo 
•	target_type: place 
•	target_id: place_phuket_sunday_market_square 
•	proof_expectation: Geo proof at the finishing point 
•	review_mode: baseline 
•	reward_points: 60 
•	ui_hint: Final completion step; should feel conclusive but not theatrical 
Progress examples
•	not_started: 
o	status: not_started 
o	current_step: null 
•	in_progress: 
o	status: in_progress 
o	current_step: 2 
•	pending_review: 
o	status: pending_review 
o	current_step: 2 
•	completed: 
o	status: completed 
o	current_step: 3 

________________________________________

Q2 — Sunset Viewpoint Photo Mission
Purpose
Quest example focused on manual review and pending-review UX.
Summary
•	id: quest_sunset_viewpoint_002 
•	slug: sunset-viewpoint-photo-mission 
•	title: Sunset Viewpoint Photo Mission 
•	short_description: Квест на закатной точке: нужно дойти до обзорной площадки, сделать фото-доказательство и дождаться проверки. 
•	theme: photo_mission 
•	difficulty: medium 
•	reward_points: 180 
•	steps_count: 3 
•	status: published 
•	visibility: public 
•	city_id: phuket 
•	cover_image_hint: sunset viewpoint / hilltop / golden hour 
Detail
•	full_description: Этот квест построен вокруг одной красивой закатной точки и нужен, чтобы показать механику ручной проверки в Quest Asia. Пользователь не просто отмечается гео-точкой, а делает фото и коротко описывает, что увидел. 
•	why_this_quest_exists: Wave 1 frontend должен уметь честно показывать pending review, blocked state и завершение после ручного подтверждения. 
•	estimated_time: 60–90 min 
•	who_is_it_for: photo-oriented travelers / evening walkers 
•	completion_rule: Complete all 3 steps; manual review is required before final completion 
•	review_rule: At least one proof must be manually approved 
•	reward_explanation: Reward points are shown as quest intent only 
•	related_place_ids: 
o	place_phuket_viewpoint_entry 
o	place_phuket_sunset_viewpoint 
•	related_event_ids: [] 
•	related_partner_ids: [] 
Steps
Step 1
•	step_id: step_sunset_001 
•	order: 1 
•	title: Reach the entry point 
•	description: Придите к стартовой точке маршрута к обзорной площадке. 
•	type: visit_place 
•	verification_type: geo 
•	target_type: place 
•	target_id: place_phuket_viewpoint_entry 
•	proof_expectation: Geo proof 
•	review_mode: baseline 
•	reward_points: 30 
•	ui_hint: Quick and simple opening step 
Step 2
•	step_id: step_sunset_002 
•	order: 2 
•	title: Upload a sunset photo 
•	description: Сделайте фотографию вида с площадки и коротко напишите, что именно вы увидели. 
•	type: photo_proof 
•	verification_type: manual 
•	target_type: place 
•	target_id: place_phuket_sunset_viewpoint 
•	proof_expectation: One sunset photo + short text note 
•	review_mode: manual_required 
•	reward_points: 90 
•	ui_hint: This step should clearly produce a pending-review state 
Step 3
•	step_id: step_sunset_003 
•	order: 3 
•	title: Confirm the mission 
•	description: После фото-подтверждения завершите квест и дождитесь результата проверки. 
•	type: challenge 
•	verification_type: manual 
•	target_type: custom 
•	target_id: custom_sunset_reflection 
•	proof_expectation: Short final text confirmation 
•	review_mode: manual_required 
•	reward_points: 60 
•	ui_hint: Completion depends on the review result; do not imply instant success 
Progress examples
•	in_progress: 
o	status: in_progress 
o	current_step: 2 
•	pending_review: 
o	status: pending_review 
o	current_step: 2 
•	failed: 
o	status: failed 
o	current_step: 2 
•	completed: 
o	status: completed 
o	current_step: 3 

________________________________________

Q3 — Russian Friendly Coffee Break Route
Purpose
Partner-linked quest for visit_partner display and partner-step UX.
Summary
•	id: quest_rf_coffee_route_003 
•	slug: russian-friendly-coffee-break-route 
•	title: Russian Friendly Coffee Break Route 
•	short_description: Короткий квест по двум Russian Friendly точкам: зайти, подтвердить визит и оставить короткий social trace. 
•	theme: partner_route 
•	difficulty: easy 
•	reward_points: 150 
•	steps_count: 3 
•	status: published 
•	visibility: public 
•	city_id: phuket 
•	cover_image_hint: coffee shop / local partner venue / casual city stop 
Detail
•	full_description: Этот квест показывает, как Quest Asia может направлять пользователя в точки Russian Friendly без разворачивания voucher logic внутри самого Quest. Пользователь проходит короткий маршрут, подтверждает визит и оставляет след активности, который может быть полезен и для партнёра, и для экосистемы. 
•	why_this_quest_exists: Frontend должен научиться показывать partner-linked quest без превращения Quest в voucher wallet или partner CRM. 
•	estimated_time: 40–60 min 
•	who_is_it_for: casual explorers / coffee lovers / users trying RF-linked experiences 
•	completion_rule: Complete all 3 steps in order 
•	review_rule: One social step may require manual confirmation 
•	reward_explanation: Quest shows activity reward intent only. No voucher redemption is implied in wave 1. 
•	related_place_ids: [] 
•	related_event_ids: [] 
•	related_partner_ids: 
o	partner_rf_cafe_001 
o	partner_rf_bakery_002 
Steps
Step 1
•	step_id: step_rf_coffee_001 
•	order: 1 
•	title: Visit the first partner venue 
•	description: Зайдите в первую точку маршрута Russian Friendly и подтвердите визит. 
•	type: visit_partner 
•	verification_type: geo 
•	target_type: partner 
•	target_id: partner_rf_cafe_001 
•	proof_expectation: Geo proof at partner venue 
•	review_mode: baseline 
•	reward_points: 40 
•	ui_hint: Partner-linked step without implying voucher usage 
Step 2
•	step_id: step_rf_coffee_002 
•	order: 2 
•	title: Confirm the second stop 
•	description: Посетите вторую точку маршрута и подтвердите своё присутствие. 
•	type: visit_partner 
•	verification_type: qr 
•	target_type: partner 
•	target_id: partner_rf_bakery_002 
•	proof_expectation: QR proof or equivalent venue confirmation 
•	review_mode: baseline 
•	reward_points: 50 
•	ui_hint: Simple partner interaction step 
Step 3
•	step_id: step_rf_coffee_003 
•	order: 3 
•	title: Leave a short social note 
•	description: Оставьте короткий публичный след о маршруте: отзыв, заметку или мини-отчёт. 
•	type: space_action 
•	verification_type: space_post 
•	target_type: partner 
•	target_id: partner_rf_bakery_002 
•	proof_expectation: Reference to a Space post or short social report 
•	review_mode: manual_or_baseline 
•	reward_points: 60 
•	ui_hint: Show that this is a social step, but Quest does not own social content 
Progress examples
•	in_progress: 
o	status: in_progress 
o	current_step: 1 
•	pending_review: 
o	status: pending_review 
o	current_step: 3 
•	completed: 
o	status: completed 
o	current_step: 3

________________________________________


Q4 — Night Market Event Check-In
Purpose
Event-based quest for attend_event rendering and event-linked semantics.
Summary
•	id: quest_night_market_event_004 
•	slug: night-market-event-check-in 
•	title: Night Market Event Check-In 
•	short_description: Небольшой событийный квест: прийти на вечерний маркет, подтвердить участие и оставить короткий публичный след. 
•	theme: event_participation 
•	difficulty: medium 
•	reward_points: 140 
•	steps_count: 2 
•	status: published 
•	visibility: public 
•	city_id: phuket 
•	cover_image_hint: night market / lights / evening event / food and crowd 
Detail
•	full_description: Этот квест показывает, как Quest Asia может использовать событие как основу сценария. Пользователь приходит на вечерний маркет, подтверждает участие и завершает маршрут коротким публичным действием. Такой квест помогает проверить, как event-linked сценарии выглядят в каталоге, на detail-странице и в run-flow. 
•	why_this_quest_exists: Wave 1 должен уметь различать event-based quest от place-based и partner-based quest не только логически, но и визуально. 
•	estimated_time: 60–90 min 
•	who_is_it_for: evening explorers / event visitors / casual social participants 
•	completion_rule: Attend the event and complete the follow-up social step 
•	review_rule: Attendance may still require baseline/manual confirmation in wave 1 
•	reward_explanation: Quest shows reward points intent only; event attendance does not imply external reward settlement in Quest 
•	related_place_ids: [] 
•	related_event_ids: 
o	event_phuket_night_market_001 
•	related_partner_ids: [] 
Steps
Step 1
•	step_id: step_night_market_001 
•	order: 1 
•	title: Arrive at the event 
•	description: Придите на вечерний маркет и подтвердите, что вы участвуете в событии. 
•	type: attend_event 
•	verification_type: manual 
•	target_type: event 
•	target_id: event_phuket_night_market_001 
•	proof_expectation: Attendance proof or short text/photo confirmation 
•	review_mode: manual_required 
•	reward_points: 70 
•	ui_hint: This step should feel event-specific, not like a place check-in 
Step 2
•	step_id: step_night_market_002 
•	order: 2 
•	title: Share a short event note 
•	description: Оставьте короткую публичную заметку о событии: что вам понравилось, что вы увидели или попробовали. 
•	type: space_action 
•	verification_type: space_post 
•	target_type: event 
•	target_id: event_phuket_night_market_001 
•	proof_expectation: Reference to a post, review or short report 
•	review_mode: baseline_or_manual 
•	reward_points: 70 
•	ui_hint: This step should clearly link event attendance with social follow-up 
Progress examples
•	not_started: 
o	status: not_started 
o	current_step: null 
•	in_progress: 
o	status: in_progress 
o	current_step: 1 
•	pending_review: 
o	status: pending_review 
o	current_step: 1 
•	completed: 
o	status: completed 
o	current_step: 2 

________________________________________

Q5 — One Day Explorer Route
Purpose
Long mixed quest for dense detail page and longer progression.
Summary
•	id: quest_one_day_explorer_005 
•	slug: one-day-explorer-route 
•	title: One Day Explorer Route 
•	short_description: Длинный смешанный квест на полдня: место, партнёрская точка, событие, фото-доказательство и social action в одном сценарии. 
•	theme: mixed_route 
•	difficulty: hard 
•	reward_points: 320 
•	steps_count: 6 
•	status: published 
•	visibility: public 
•	city_id: phuket 
•	cover_image_hint: city route / mixed activities / daytime exploration 
Detail
•	full_description: Этот квест нужен как пример длинного, насыщенного сценария. Он сочетает несколько разных типов шагов и показывает, как Quest Asia может объединять знакомство с местом, партнёрскую точку, участие в событии, фото-подтверждение и социальный след в одном маршруте. 
•	why_this_quest_exists: Frontend wave 1 должен выдерживать не только короткие квесты, но и длинный сценарий с более сложным progression flow и несколькими точками проверки. 
•	estimated_time: 3–4 hours 
•	who_is_it_for: active explorers / users who want a richer city scenario 
•	completion_rule: Complete all 6 steps in order 
•	review_rule: Some steps may pause progress for manual review before the route can continue 
•	reward_explanation: Reward points are quest intent only; no wallet or voucher settlement is implied inside Quest 
•	related_place_ids: 
o	place_phuket_old_town_gate 
o	place_phuket_viewpoint_entry 
•	related_event_ids: 
o	event_phuket_local_meetup_001 
•	related_partner_ids: 
o	partner_rf_cafe_001 
Steps
Step 1
•	step_id: step_one_day_001 
•	order: 1 
•	title: Check in at the first city point 
•	description: Начните маршрут с первой городской точки и подтвердите, что вы на месте. 
•	type: visit_place 
•	verification_type: geo 
•	target_type: place 
•	target_id: place_phuket_old_town_gate 
•	proof_expectation: Geo proof 
•	review_mode: baseline 
•	reward_points: 30 
•	ui_hint: Simple opening step that quickly moves the user into progression 
Step 2
•	step_id: step_one_day_002 
•	order: 2 
•	title: Visit the partner coffee stop 
•	description: Зайдите в партнёрскую кофейню и подтвердите визит. 
•	type: visit_partner 
•	verification_type: qr 
•	target_type: partner 
•	target_id: partner_rf_cafe_001 
•	proof_expectation: QR proof at partner venue 
•	review_mode: baseline 
•	reward_points: 40 
•	ui_hint: Partner step should remain simple and not imply voucher logic 
Step 3
•	step_id: step_one_day_003 
•	order: 3 
•	title: Attend the local meetup 
•	description: Присоединитесь к локальному событию и подтвердите участие. 
•	type: attend_event 
•	verification_type: manual 
•	target_type: event 
•	target_id: event_phuket_local_meetup_001 
•	proof_expectation: Attendance confirmation or short text proof 
•	review_mode: manual_required 
•	reward_points: 60 
•	ui_hint: This step should naturally allow a pending review interruption 
Step 4
•	step_id: step_one_day_004 
•	order: 4 
•	title: Upload a route photo 
•	description: Сделайте фотографию маршрута или места, которое лучше всего передаёт атмосферу дня. 
•	type: photo_proof 
•	verification_type: manual 
•	target_type: place 
•	target_id: place_phuket_viewpoint_entry 
•	proof_expectation: One photo and a short text note 
•	review_mode: manual_required 
•	reward_points: 50 
•	ui_hint: Proof-heavy step; keep instructions short but clear 
Step 5
•	step_id: step_one_day_005 
•	order: 5 
•	title: Leave a short public report 
•	description: Оставьте короткий публичный отчёт о маршруте: что вы увидели и что было самым интересным. 
•	type: space_action 
•	verification_type: space_post 
•	target_type: custom 
•	target_id: custom_one_day_report_001 
•	proof_expectation: Space post or short public report reference 
•	review_mode: baseline_or_manual 
•	reward_points: 60 
•	ui_hint: Show how social action can be part of a longer scenario 
Step 6
•	step_id: step_one_day_006 
•	order: 6 
•	title: Complete the route 
•	description: Подтвердите завершение маршрута и дождитесь итогового статуса. 
•	type: challenge 
•	verification_type: manual 
•	target_type: custom 
•	target_id: custom_one_day_finish_001 
•	proof_expectation: Final structured confirmation 
•	review_mode: manual_required 
•	reward_points: 80 
•	ui_hint: Final step should feel conclusive without turning into rewards theater 
Progress examples
•	in_progress: 
o	status: in_progress 
o	current_step: 4 
•	pending_review: 
o	status: pending_review 
o	current_step: 4 
•	completed: 
o	status: completed 
o	current_step: 6 

________________________________________

Q6 — Hidden Draft Route for Old Town Testing
Purpose
Draft/non-public quest for authoring truth and visibility semantics.
Summary
•	id: quest_draft_old_town_006 
•	slug: hidden-draft-route-for-old-town-testing 
•	title: Hidden Draft Route for Old Town Testing 
•	short_description: Черновой квест для внутренней проверки authoring и publish semantics. 
•	theme: draft_test 
•	difficulty: medium 
•	reward_points: 100 
•	steps_count: 2 
•	status: draft 
•	visibility: private 
•	city_id: phuket 
•	cover_image_hint: internal draft / old town / not public 
Detail
•	full_description: Этот квест нужен не для публичного каталога, а как пример внутреннего сценария в состоянии draft/private. Он помогает проверять, что authoring truth, publish rules и public visibility не смешиваются между собой. 
•	why_this_quest_exists: Cursor и frontend alignment не должны автоматически трактовать любой quest как публичный сценарий с карточкой и CTA. 
•	estimated_time: 20–30 min 
•	who_is_it_for: internal authoring/testing context only 
•	completion_rule: Draft example only 
•	review_rule: Draft example only 
•	reward_explanation: Draft reward intent only; not public truth 
•	related_place_ids: 
o	place_phuket_old_town_gate 
•	related_event_ids: [] 
•	related_partner_ids: [] 
Steps
Step 1
•	step_id: step_draft_001 
•	order: 1 
•	title: Internal start point 
•	description: Черновой первый шаг для проверки структуры и видимости. 
•	type: visit_place 
•	verification_type: geo 
•	target_type: place 
•	target_id: place_phuket_old_town_gate 
•	proof_expectation: Geo proof 
•	review_mode: baseline 
•	reward_points: 50 
•	ui_hint: Draft example; not for public card rendering 
Step 2
•	step_id: step_draft_002 
•	order: 2 
•	title: Draft photo step 
•	description: Черновой второй шаг с фото-подтверждением. 
•	type: photo_proof 
•	verification_type: manual 
•	target_type: custom 
•	target_id: custom_draft_photo_001 
•	proof_expectation: Photo proof 
•	review_mode: manual_required 
•	reward_points: 50 
•	ui_hint: Useful for authoring/publish semantics, not for public baseline UI 
Visibility note
•	this quest is intentionally not public 
•	should not appear in public catalog 
•	should not behave like a normal public quest detail for anonymous/public baseline 
•	useful for checking draft/private authoring truth and publish rules

