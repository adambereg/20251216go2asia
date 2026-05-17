Актуализированный концепт модуля Connect Asia

Stage 6.5.3 semantics guard: Connect product copy must avoid income, payout, wallet, bank, token-liquidity and investment wording. `earnings` in legacy API names should be read as referral participation / internal reward eligibility summary, not money or passive income.

1. Короткая формула
Connect Asia — это личный центр активности, достижений и off-chain вознаграждений пользователя в экосистеме Go2Asia.

В текущей архитектуре Connect — не отдельный backend-сервис, а продуктовый модуль и пользовательский интерфейс, который собирает и показывает данные из уже реализованных backend-контуров:
•	Points; 
•	referral participation / internal reward summaries;
•	off-chain badges; 
•	recent activity; 
•	quest-related rewards; 
•	future progression signals, когда для них появится backend truth. 

Главная задача Connect — дать пользователю понятный ответ на вопросы:
•	что я уже сделал в экосистеме; 
•	какое internal recognition появилось за активность;
•	какие достижения у меня есть; 
•	сколько Points у меня накоплено; 
•	кто пришёл по моей реферальной ссылке; 
•	какие действия в Go2Asia имеют для меня ценность; 
•	что я могу сделать дальше, чтобы расти внутри экосистемы. 
________________________________________

2. Почему старый концепт нужно обновить
Старый концепт описывал Connect как большой центр экономики, геймификации и глобальной репутации, включающий Points, G2A, NFT, уровни, достижения, миссии, реферальную программу и аналитику активности. В старом overview.md Connect прямо назван общим микросервисом для всего Go2Asia и внутренним economy layer всей экосистемы .

Старые документы также предполагали отдельный API-префикс /api/connect, endpoints для levels, achievements, missions, analytics и wallet-like summary с Points/G2A/NFT . Старый UI-документ предлагал 7 разделов: Dashboard, Points, Levels & Achievements, Missions, Referrals, Analytics и навигацию по этим разделам .

Но после практической разработки Go2Asia архитектура стала другой:
•	connect-service не создан; 
•	token-service остаётся skeleton-only; 
•	рабочая экономика MVP строится вокруг points-service; 
•	referral facts живут в referral-service; 
•	quest rewards и badge handoffs идут из quest-service; 
•	badges реализованы как off-chain achievements внутри текущего Points MVP-контура; 
•	dashboard read model уже доступен через GET /v1/points/connect-dashboard . 

Поэтому старый концепт нужно не уничтожить, а разделить на current MVP и future vision.
________________________________________

3. Новое определение Connect Asia
Connect Asia — это модуль персональной вовлечённости пользователя в Go2Asia.
Он показывает пользователю:
•	его текущий баланс Points; 
•	историю начислений; 
•	реферальный прогресс и начисленные internal Points;
•	off-chain бейджи и достижения; 
•	последние значимые действия в экосистеме; 
•	честные подсказки, что можно сделать дальше, если эти подсказки опираются на реальные backend-данные. 
Connect не должен создавать иллюзию того, чего backend ещё не поддерживает.

В MVP Connect не является:
•	криптокошельком; 
•	NFT-маркетплейсом; 
•	G2A-кабинетом; 
•	системой уровней; 
•	миссионным движком; 
•	инвестиционным кабинетом; 
•	отдельным backend-сервисом; 
•	универсальным event/rules engine. 
________________________________________

4. Продуктовая роль Connect в Go2Asia
Connect связывает пользовательскую активность с ощущением прогресса.

Если Atlas, Pulse, Blog, Space, Quest, RF и Rielt отвечают на вопрос “что есть в экосистеме?”, то Connect отвечает на вопрос:
“Как моё участие в экосистеме превращается в личный прогресс, вознаграждения и достижения?”

Connect должен стать для пользователя:
1.	Личным счётчиком вклада
Пользователь видит, что его действия не исчезают, а превращаются в Points, историю активности и бейджи. 
2.	Центром доверия к экономике Go2Asia
Все начисления должны быть понятны, проверяемы и не выглядеть как “магические цифры”. 
3.	Мотивационным слоем
Connect мягко подталкивает пользователя к полезным действиям: пройти квест, пригласить друга, участвовать в событиях, создавать контент. 
4.	Мостом к будущей tokenomics
В будущем здесь могут появиться G2A, NFT, уровни, статусы и расширенные механики, но только после появления backend truth и отдельного legal/architecture pass. 
________________________________________

5. Current MVP: что Connect показывает сейчас
Текущий backend уже даёт достаточно честную основу для MVP Connect.

5.1 Dashboard
Источник:
•	GET /v1/points/connect-dashboard 
Показывает:
•	баланс Points; 
•	последние транзакции; 
•	referral summary; 
•	badge summary; 
•	recent badges. 
Не показывает:
•	G2A; 
•	NFT count; 
•	wallet; 
•	levels; 
•	missions; 
•	next actions; 
•	rankings; 
•	season progress; 
•	partner income / payout surfaces.

Closure note прямо фиксирует, что dashboard endpoint даёт balance, recentTransactions, referral summary и badge summary, но не даёт G2A, NFT count, wallet, levels/statuses, missions, profile/social data или admin/ops data .

5.2 Points / Activity
Источники:
•	GET /v1/points/balance; 
•	GET /v1/points/transactions. 
Показывает:
•	текущий баланс Points; 
•	историю начислений; 
•	действия, за которые начислены Points; 
•	источник действия, если он есть в ledger. 
Назначение:
•	сделать экономику прозрачной; 
•	показать, что Points — это не абстрактный счётчик, а результат конкретных действий. 

5.3 Referrals
Источники:
•	GET /v1/referral/code; 
•	GET /v1/referral/stats; 
•	GET /v1/referral/tree; 
•	GET /v1/referral/earnings; 
•	POST /v1/referral/claim. 
Показывает:
•	реферальный код; 
•	реферальную ссылку; 
•	количество приглашённых; 
•	активированных рефералов; 
•	pending referrals; 
•	начисленные internal Points;
•	состояние reward_missing, если activation есть, а начисление ещё не найдено. 
Важно: Referral Service владеет referral facts, а Points ledger остаётся источником истины для применённых internal начислений. Это уже закреплено в closure note: referral-service owns referral graph facts, а points-service остаётся ledger truth для applied internal Points entries.

5.4 Badges
Источники:
•	GET /v1/points/badges; 
•	GET /v1/points/badges/mine; 
•	POST /internal/points/badges/award для сервисных handoff’ов. 
Показывает:
•	off-chain badge catalog; 
•	бейджи пользователя; 
•	дату получения; 
•	источник достижения, если он безопасно отображается; 
•	пустое состояние, если бейджей пока нет. 

Важно: сейчас badges — off-chain achievements, не NFT. Старый концепт смешивал достижения, NFT и tokenomics; новый концепт должен строго разделить: “badge now” и “NFT later”.

5.5 Quest-related achievements
Текущая реализованная цепочка:
•	quest.completed; 
•	начисление Points через POST /internal/points/add; 
•	durable delivery через quest_reward_outbox; 
•	badge auto-award first_quest_completed через POST /internal/points/badges/award. 

Quest не владеет балансом и не владеет бейджами; он только инициирует bounded handoff. Closure note фиксирует, что Quest owns quest progress/completion and performs bounded reward and badge handoffs, а Points остаётся badge/ledger truth .
________________________________________

6. Future Vision: что Connect может стать позже
Старый концепт не нужно выбрасывать полностью. Он остаётся полезным как долгосрочное направление.
Но future vision должна быть чётко отделена от MVP.

6.1 G2A
Будущий слой:
•	off-chain G2A accounting; 
•	возможный on-chain вывод; 
•	отдельная legal/compliance рамка; 
•	Blockchain Gateway; 
•	отдельный architecture pass. 
Сейчас:
•	не показывать G2A balance; 
•	не показывать вывод/пополнение; 
•	не показывать обмен Points → G2A; 
•	не использовать формулировки про доходность или инвестиции. 

6.2 NFT
Будущий слой:
•	редкие/on-chain достижения; 
•	mint через Blockchain Gateway; 
•	возможно, коллекционные badge-like assets. 
Сейчас:
•	badges являются off-chain achievements; 
•	не называть текущие badges NFT; 
•	не показывать NFT wallet; 
•	не показывать NFT count. 

6.3 Levels / Statuses
Будущий слой:
•	уровни активности; 
•	статусы участия; 
•	progression mechanics; 
•	возможно, VIP/PRO-specific progression. 
Сейчас:
•	нет backend truth для уровней; 
•	не показывать level bar; 
•	не показывать XP; 
•	не показывать season progress. 

6.4 Missions
Будущий слой:
•	персональные задания; 
•	onboarding missions; 
•	seasonal activities; 
•	cross-module challenge system. 
Сейчас:
•	Quest существует как отдельный модуль; 
•	Connect не должен отображать fake missions; 
•	миссии можно проектировать только после отдельного backend truth. 

6.5 Analytics / Rankings
Будущий слой:
•	вклад пользователя по модулям; 
•	динамика активности; 
•	leaderboard; 
•	seasonal rankings. 
Сейчас:
•	dashboard может показывать только факты, которые отдаёт backend; 
•	рейтинги и “место в экосистеме” не показывать. 
________________________________________

7. Новая концептуальная структура Connect
С точки зрения продукта Connect можно разделить на 4 текущие зоны и несколько будущих зон.

Current zones
7.1 Главная
Назначение:
•	быстрый срез текущего состояния пользователя. 
Содержит:
•	Points balance; 
•	recent activity; 
•	referral summary; 
•	recent badges; 
•	empty states. 
Backend:
•	GET /v1/points/connect-dashboard. 

7.2 Активность / Points
Назначение:
•	история начислений и экономическая прозрачность. 
Содержит:
•	transactions list; 
•	action labels; 
•	source service / source event hints; 
•	фильтры позже. 
Backend:
•	GET /v1/points/transactions; 
•	GET /v1/points/balance. 

7.3 Рефералы
Назначение:
•	приглашения и referral participation / internal recognition summaries.
Содержит:
•	referral code/link; 
•	referral summary; 
•	referral tree; 
•	referral participation / reward eligibility summary;
•	states: pending, rewarded, reward_missing. 
Backend:
•	GET /v1/referral/code; 
•	GET /v1/referral/stats; 
•	GET /v1/referral/tree; 
•	GET /v1/referral/earnings. 

7.4 Бейджи
Назначение:
•	off-chain достижения пользователя. 
Содержит:
•	my badges; 
•	badge catalog; 
•	empty state; 
•	first quest badge; 
•	будущие badge hints, если они есть в catalog. 
Backend:
•	GET /v1/points/badges; 
•	GET /v1/points/badges/mine. 

Future zones
Пока не включать в MVP navigation как активные разделы:
•	G2A / Wallet; 
•	NFT; 
•	Levels; 
•	Missions; 
•	Analytics; 
•	Leaderboards; 
•	Partner income / payout surfaces;
•	PRO economy. 
Их можно оставить только как future roadmap, но не как пользовательские вкладки без backend.
________________________________________

8. Что делать со старым UI
Старый UI модуля Connect полезен как legacy reference, но не должен быть основой новой версии.

Сохранить как паттерны
•	модульная шапка Connect Asia; 
•	вкладки/разделы как навигационная идея; 
•	referral code card; 
•	recent activity card; 
•	cards-based layout; 
•	badges/achievements как визуальный слой. 

Удалить или скрыть до backend truth
•	G2A Tokens; 
•	NFT Badges как wallet asset; 
•	Пополнить / Вывести; 
•	Level; 
•	XP; 
•	Active season; 
•	Миссии дня; 
•	Статистика рейтинга; 
•	Источники наград по модулям; 
•	Business referrals; 
•	партнёрские доходы; 
•	двухуровневая реферальная сеть; 
•	прогнозы; 
•	лидерборды. 

Иными словами: старый UI можно использовать как “археологию” и визуальное вдохновение, но новая версия должна быть построена на closure note и backend truth.
________________________________________

9. Тональность продукта
Connect не должен выглядеть как криптокошелёк или инвестиционный кабинет.
Тональность:
•	“Ваш вклад”; 
•	“Активность”; 
•	“Достижения”; 
•	“Points за участие”; 
•	“Приглашения”; 
•	“История начислений”; 
•	“Бейджи Go2Asia”. 
Избегать:
•	“доход”; 
•	“прибыль”; 
•	“инвестиции”; 
•	“вывод средств”; 
•	“курс токена”; 
•	“NFT-активы”; 
•	“криптокошелёк”; 
•	“заработок на токенах”. 

Для referral лучше использовать “начислены internal Points” или “учтён реферальный вклад”: это внутренняя система вознаграждений, не обещание денежного дохода.
________________________________________

10. Обновлённое позиционирование
Старое позиционирование:
“Connect Asia — центр экономики, геймификации и глобальной репутации Go2Asia.”
Новое позиционирование:
Connect Asia — личный центр активности, Points, рефералов и достижений пользователя в Go2Asia.

Расширенная формула:
Connect показывает пользователю, как его действия в Go2Asia превращаются в Points, бейджи, реферальный прогресс и понятную историю вклада.

Для внутренней архитектуры:
Connect is a product/UI module backed by Points, Referral and Quest services; it is not a standalone backend service in the current MVP.
________________________________________

11. Основные пользовательские сценарии MVP
Сценарий 1. Новый пользователь
Пользователь открывает Connect и видит:
•	0 Points; 
•	нет активности; 
•	нет бейджей; 
•	реферальный код доступен; 
•	понятные пустые состояния: 
o	“Пройдите первый квест, чтобы получить первый бейдж”; 
o	“Пригласите друга, чтобы начать реферальную историю”; 
o	“Ваша активность появится здесь после первых действий”. 

Сценарий 2. Пользователь завершил первый квест
Пользователь видит:
•	баланс Points увеличился; 
•	в recent activity появилась транзакция quest_completed; 
•	в badges появился first_quest_completed. 

Сценарий 3. Пользователь пригласил друга
Пользователь видит:
•	referral code/link; 
•	pending referral; 
•	пока без applied internal Points.

Сценарий 4. Реферал активировался
Пользователь видит:
•	activated/rewarded referral; 
•	начисленные internal Points;
•	соответствующую транзакцию в activity; 
•	если activation есть, а транзакции нет — reward_missing. 

Сценарий 5. У пользователя пока нет данных
UI не должен подставлять fake G2A/NFT/level/missions. Он должен показывать честные empty states.
________________________________________

12. Главные правила для будущего фронтенда
1.	Использовать GET /v1/points/connect-dashboard как главный источник Dashboard. 
2.	Не собирать Dashboard из старых mock-объектов. 
3.	Не показывать G2A/NFT/levels/missions без backend truth. 
4.	Использовать GET /v1/referral/earnings для подробной реферальной вкладки. 
5.	Использовать GET /v1/points/badges/mine для бейджей пользователя. 
6.	Использовать GET /v1/points/badges для каталога бейджей. 
7.	Не использовать /api/connect. 
8.	Не использовать /v1/token. 
9.	Не использовать старую модель Wallet Summary. 
10.	Все future sections должны быть либо скрыты, либо явно помечены как “появится позже”, но лучше не показывать в MVP. 
________________________________________

13. Рекомендованный следующий шаг
Теперь уже можно переходить к SSOT-пакету Connect по стандартной структуре:
•	connect_backend_architecture_v1.md; 
•	connect_dependency_map_v1.md; 
•	connect_domain_model_v1.md; 
•	connect_openapi_outline_v1.md; 
•	connect_service_production_architecture_v1.md. 

Новый SSOT должен взять за основу именно этот актуализированный концепт и backend closure note, а старые docs/modules/connect/* использовать как legacy vision input.


 
Дорожная карта развития Connect Asia с учётом Future Vision

0. Базовая идея roadmap
Connect Asia нужно развивать не как “сразу большой токеномический центр”, а как послойную систему персонального прогресса пользователя.

Правильная логика такая:
1.	Сначала честный MVP на уже реализованных backend facts. 
2.	Затем frontend-интеграция без fake economy. 
3.	Затем аккуратное расширение off-chain достижений. 
4.	Затем progression / levels / status только после появления backend truth. 
5.	Затем G2A / NFT / wallet / on-chain только отдельными архитектурными волнами. 

Старый roadmap Connect сразу включал Level System, Missions, Achievements, NFT minting, Points → G2A Conversion, Dynamic Missions, DAO, Boosters, Seasonal Progression, Marketplace и Web3 export . Сейчас это нужно не отвергать, а переразложить по зрелости и рискам. Текущий backend closure уже фиксирует, что G2A, NFT, wallet, on-chain, blockchain и broader tokenomics остаются намеренно вне текущего MVP .
________________________________________

Phase 0 — Уже выполнено: Backend MVP Foundation
Статус: выполнено.
Это тот слой, который мы уже собрали.

Что готово
Points baseline
•	баланс Points; 
•	история транзакций; 
•	internal points add; 
•	audit/idempotency; 
•	sourceService/sourceEventId; 
•	transaction history. 
Quest → Points
•	quest.completed -> points-service; 
•	reward delivery outbox; 
•	scheduled replay; 
•	failed drilldown; 
•	safe requeue. 
Referral participation summaries
•	referral code/stats/tree; 
•	referral participation / internal reward read model;
•	reward_missing; 
•	связка referral facts + matched points ledger. 
Badge baseline
•	badge catalog; 
•	user badge awards; 
•	internal badge award; 
•	first_quest_completed auto-award. 
Connect Dashboard backend
•	GET /v1/points/connect-dashboard; 
•	balance; 
•	recent transactions; 
•	referral summary; 
•	badge summary. 
Это соответствует текущему closure note: Connect backend реализован как composition existing services, а не как standalone connect-service; Points — off-chain ledger/balance truth, Referral — referral facts/read model, Quest — completion and bounded handoffs, Badges — off-chain achievements inside current Points MVP contour .

Что важно закрепить
На этом этапе:
•	нет G2A; 
•	нет NFT; 
•	нет wallet; 
•	нет levels/statuses; 
•	нет missions внутри Connect; 
•	нет connect-service; 
•	нет /v1/token/*; 
•	нет broad reward engine. 
________________________________________

Phase 1 — Connect Frontend MVP Integration
Цель: заменить старый mock-heavy Connect UI на честный интерфейс, основанный на backend truth.

1.1 Dashboard integration
Источник:
•	GET /v1/points/connect-dashboard. 
UI показывает:
•	Points balance; 
•	recent activity; 
•	referral summary; 
•	recent badges; 
•	empty states. 
UI не показывает:
•	G2A; 
•	NFT count; 
•	wallet; 
•	levels; 
•	missions; 
•	season; 
•	rankings; 
•	прогнозы; 
•	partner income / payout surfaces.

1.2 Referral tab integration
Источники:
•	GET /v1/referral/code; 
•	GET /v1/referral/stats; 
•	GET /v1/referral/tree; 
•	GET /v1/referral/earnings. 
UI показывает:
•	реферальный код; 
•	ссылку приглашения; 
•	количество приглашённых; 
•	activated/pending; 
•	applied internal Points;
•	reward_missing. 

1.3 Badges tab integration
Источники:
•	GET /v1/points/badges; 
•	GET /v1/points/badges/mine. 
UI показывает:
•	полученные бейджи; 
•	доступные бейджи; 
•	first_quest_completed; 
•	empty state “Завершите первый квест”. 

1.4 Activity / Points history
Источники:
•	GET /v1/points/transactions; 
•	GET /v1/points/balance. 
UI показывает:
•	список транзакций; 
•	action label mapping; 
•	source hints; 
•	без metadata dump. 

Результат Phase 1
Connect становится рабочим пользовательским модулем MVP:
“Мой вклад, мои Points, мои рефералы, мои бейджи.”
________________________________________

Phase 2 — Connect UX/Product Refinement
Цель: сделать Connect удобным, понятным и мотивирующим, не расширяя backend scope преждевременно.

2.1 Connect v2 UI concept
Создать:
•	connect_frontend_ux_concept_v1.md; 
•	Bolt.New prototype; 
•	review прототипа; 
•	connect_ui_content_pack_v1.md. 

2.2 Empty states and product copy
Подготовить тексты:
•	“У вас пока нет начислений”; 
•	“Пройдите первый квест”; 
•	“Пригласите друга”; 
•	“Первый бейдж появится здесь”; 
•	“Начисление по рефералу проверяется”. 

2.3 Action label dictionary
Словарь:
•	registration → “Регистрация”; 
•	first_login → “Первый вход”; 
•	quest_completed → “Квест завершён”; 
•	referral_bonus_referrer → “Бонус за приглашённого пользователя”; 
•	event_registration → “Регистрация на событие”; 
•	fallback → “Активность Go2Asia”. 

2.4 Remove legacy UI artifacts
Убрать или скрыть:
•	G2A cards; 
•	NFT wallet; 
•	level progress; 
•	mission cards; 
•	analytics charts; 
•	“withdraw/deposit”; 
•	“earn crypto” language; 
•	old fake wallet summary. 

Старый UI-документ предлагал Dashboard, Points, Levels, Achievements, Missions, Referrals, Analytics и блоки Points/G2A/NFT, уровни, recommended actions, charts и missions . В новом UI это должно быть переработано: current MVP — только backend-backed sections.
________________________________________

Phase 3 — Off-chain Achievement Expansion
Цель: расширить бейджи как off-chain achievements, не переходя к NFT.

3.1 Referral auto-award
Добавить:
•	first_referral_activated. 
Trigger:
•	first activated referral; 
•	выдаётся referrer’у; 
•	source: referral.first_login; 
•	через POST /internal/points/badges/award. 
Важно:
•	non-blocking; 
•	no badge outbox initially; 
•	no NFT; 
•	no tokenomics. 

3.2 Space first action badges, позже
Возможные future badges:
•	first_space_post; 
•	first_blog_featured; 
•	first_event_registration. 
Но только после того, как соответствующие backend events стабилизированы.

3.3 Badge catalog management
Пока catalog seed через migration допустим. Позже нужен:
•	internal admin badge catalog management; 
•	activate/deactivate badge; 
•	edit title/description/icon; 
•	no public write API. 

3.4 Badge audit trail
Если появятся ops-инциденты:
•	who awarded; 
•	source service; 
•	source event; 
•	reason; 
•	manual/admin actions. 

Результат Phase 3
Connect получает понятную систему достижений:
не NFT, не token asset, а off-chain badges за реальные действия.
________________________________________

Phase 4 — Progression / Levels / Status Truth
Цель: вернуть идею уровней из старого Connect vision, но уже не как mock UI, а как backend-backed progression system.
Старые документы Connect предполагали LevelProgress, XP, уровни и бонусы . Но сейчас этого backend truth нет.

4.1 Architecture pass
Создать отдельный SSOT:
•	progression domain model; 
•	level definitions; 
•	status definitions; 
•	relation to Points; 
•	relation to roles Spacer/VIP/PRO; 
•	anti-farming rules. 

4.2 Backend model
Возможные сущности:
•	level_definitions; 
•	user_progression; 
•	progression_events; 
•	status_rules. 

4.3 Read-only API
Добавить только после backend truth:
•	current level; 
•	current XP/progress; 
•	next threshold; 
•	benefits. 

4.4 UI
Только после API:
•	level card; 
•	progress bar; 
•	benefits; 
•	no fake XP. 

Важное правило
Не считать level на фронтенде из суммы Points.
Points и XP/status — разные сущности. Пользователь может иметь много Points, но это не обязательно его уровень.
________________________________________

Phase 5 — Missions / Recommended Actions
Цель: вернуть идею missions, но не как старый fake Connect mission engine.
Старый roadmap включал Simple Missions в MVP и Dynamic Missions позже . Но сейчас у нас уже есть Quest как отдельный сценарный модуль, поэтому Connect не должен становиться владельцем миссий.

5.1 Разделить Quest и Connect actions
Quest owns:
•	quests; 
•	steps; 
•	progress; 
•	submissions. 
Connect may show:
•	recommended actions; 
•	next useful actions; 
•	onboarding suggestions; 
•	“complete your first quest”; 
•	“invite a friend”; 
•	“check your badges”. 

5.2 Backend truth
Нужен отдельный источник:
•	onboarding tasks; 
•	recommended actions; 
•	action completion state; 
•	maybe read model based on dashboard facts. 

5.3 UI
Показывать не “missions” как reward engine, а:
•	“Что можно сделать дальше”; 
•	“Начните с первого квеста”; 
•	“Пригласите друга”; 
•	“Посмотрите свои бейджи”. 

Важное правило
Не вводить Connect Missions до появления backend truth.
________________________________________

Phase 6 — Referral Economy Expansion
Цель: развить реферальную программу, не превращая её в многоуровневую tokenomics раньше времени.

6.1 Улучшить referral details
•	richer referral identity, если разрешено privacy model; 
•	masked identity; 
•	activation funnel; 
•	reward_missing resolution; 
•	resend/invite UX. 

6.2 Referral reward reliability
Если появятся реальные missed rewards:
•	referral reward outbox/replay; 
•	аналогично Quest reward outbox; 
•	stats/ops endpoint. 

6.3 Referral auto-awards
•	first_referral_activated; 
•	five_referrals_activated; 
•	only after anti-abuse rules. 

6.4 Future VIP/PRO referral economics
Отложить до отдельного архитектурного pass.
Старый документ описывал VIP-субрефералов, проценты и G2A/Points за активности рефералов. Это нельзя включать без отдельной модели, legal review и антифрод-слоя.
________________________________________

Phase 7 — Analytics / Insights
Цель: дать пользователю понимание его активности, но только на реальных агрегатах.

7.1 Backend aggregates
Нужны:
•	internal Points by period;
•	points by action; 
•	points by source service; 
•	badge timeline; 
•	referral conversion; 
•	quest completions. 

7.2 API
Возможные endpoints:
•	activity summary; 
•	monthly activity; 
•	source breakdown. 

7.3 UI
Только после backend:
•	charts; 
•	period filters; 
•	source breakdown. 

Не делать раньше времени
Старый UI предполагал charts, “источники наград”, “пульс сезона” и analytics cards . Это нельзя возвращать в MVP как mock.
________________________________________

Phase 8 — G2A / Tokenomics Architecture
Цель: ввести G2A только после отдельного legal/architecture pass.
Старый концепт предполагал Points → G2A, off-chain/on-chain sync и Blockchain Gateway . Но текущий closure note фиксирует, что G2A, NFT, wallet, on-chain, blockchain и broad tokenomics намеренно deferred .

8.1 Legal/compliance pass
Перед кодом:
•	российские и международные регуляторные риски; 
•	RF contour limitations; 
•	prohibited payment/investment language; 
•	KYC/KYT requirements; 
•	custodial/non-custodial wallet decision. 

8.2 Token/G2A accounting
Только после legal pass:
•	G2A off-chain account; 
•	G2A ledger; 
•	issuance rules; 
•	constraints; 
•	audit. 

8.3 Blockchain Gateway
Позже:
•	TON integration; 
•	mint/burn/transfer; 
•	wallet binding; 
•	private key custody; 
•	withdrawal limits. 

8.4 UI
Только после backend truth:
•	G2A balance; 
•	wallet status; 
•	withdrawal availability; 
•	transaction status. 

Строго запрещено до этого
•	fake G2A balance; 
•	“вывести”; 
•	“обменять”; 
•	“инвестировать”; 
•	“earn crypto”. 
________________________________________

Phase 9 — NFT / On-chain Achievements
Цель: развить off-chain badges в NFT-слой, но не ломать текущую badge model.

9.1 Badge → NFT bridge
Добавить:
•	badge_nft_links; 
•	nft_mint_requests; 
•	mint status; 
•	chain; 
•	token id; 
•	metadata uri. 

9.2 Minting rules
Только для редких бейджей:
•	founder badge; 
•	special quest badge; 
•	event winner; 
•	PRO achievement. 

9.3 UI
•	обычные badges остаются off-chain; 
•	NFT — optional representation; 
•	пользователь видит mint status; 
•	no marketplace initially. 

9.4 Marketplace later
Только в отдельной фазе. Старый roadmap предполагал marketplace для NFT-бейджей в expansion phase , но это должен быть very-later scope.
________________________________________

Phase 10 — Connect Service / Tokenomics Service Extraction, если потребуется
Цель: выделить отдельный сервис только тогда, когда composition внутри Points перестанет быть достаточной.

Когда это может понадобиться
•	появится много read models; 
•	появятся complex reward rules; 
•	появится G2A accounting; 
•	появятся levels/statuses; 
•	понадобится cross-domain orchestration; 
•	gateway/points-service начнут перегружаться composition logic. 

Возможные варианты
1.	connect-service 
o	BFF/read model layer; 
o	dashboard; 
o	user progression; 
o	UI composition. 
2.	tokenomics-service 
o	economic rules; 
o	G2A; 
o	reward computation; 
o	no UI-specific composition. 
3.	badge-service 
o	если badge domain станет самостоятельным; 
o	NFT bridge; 
o	badge catalog/admin. 

Важное правило
Не выделять сервис заранее. Выделение должно быть реакцией на реальную сложность, а не на старый документ, где Connect был назван микросервисом.
________________________________________

Сводная карта фаз

Current / Done
•	Points Ledger; 
•	Quest reward pipeline; 
•	Referral participation summaries;
•	Badge baseline; 
•	First quest badge; 
•	Connect dashboard backend. 

Next
•	Connect frontend integration; 
•	Connect UI concept / Bolt prototype; 
•	UI content pack; 
•	remove legacy fake economy. 

Near Future
•	referral auto-award; 
•	badge expansion; 
•	action labels; 
•	better referral UI; 
•	dashboard caching if needed. 

Mid Future
•	levels/progression; 
•	recommended actions; 
•	analytics; 
•	richer badges; 
•	admin badge catalog. 

Late Future
•	G2A; 
•	wallet; 
•	NFT minting; 
•	Blockchain Gateway; 
•	marketplace; 
•	tokenomics engine; 
•	possible connect-service extraction. 
________________________________________

Рекомендованная ближайшая последовательность
Я бы двигался так:

Step 1 — Connect SSOT package
Создать пять файлов:
•	connect_backend_architecture_v1.md; 
•	connect_dependency_map_v1.md; 
•	connect_domain_model_v1.md; 
•	connect_openapi_outline_v1.md; 
•	connect_service_production_architecture_v1.md. 

Step 2 — Connect frontend UX concept
Описать:
•	новую структуру UI; 
•	что сохраняем из legacy UI; 
•	что удаляем; 
•	empty states; 
•	action labels; 
•	data mapping. 

Step 3 — Bolt.New prototype
Создать новый prototype Connect v2, строго без future fake fields.

Step 4 — UI content pack
Собрать:
•	тексты; 
•	сценарии; 
•	UI states; 
•	badge labels; 
•	referral labels; 
•	transaction labels. 

Step 5 — Cursor frontend integration
Интегрировать:
•	dashboard; 
•	referrals; 
•	badges; 
•	activity. 
________________________________________

Финальный вывод
Connect Asia можно безопасно развивать до полноценного центра экономики и геймификации, но только если соблюдать принцип:
сначала backend truth, потом UI, потом расширение vision.

