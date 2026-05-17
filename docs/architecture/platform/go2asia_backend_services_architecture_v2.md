Go2Asia Backend Services Architecture v2
1. Назначение документа
Документ Go2Asia Backend Services Architecture v2 описывает актуальную backend-архитектуру экосистемы Go2Asia: сервисы, доменные границы, зоны ответственности, связи между модулями, runtime-реальность и целевое развитие платформы.
Документ нужен как backend-level SSOT для:
•	Cursor; 
•	архитектурных аудитов; 
•	разработки новых сервисов; 
•	уточнения границ между доменами; 
•	проверки, какие сервисы уже существуют, какие частично готовы, а какие являются future target. 
________________________________________
Чем v2 отличается от раннего backend-документа
Ранний backend-документ описывал широкую финальную концепцию микросервисной платформы. Он был полезен на этапе проектирования, но сейчас часть формулировок устарела.
В версии v2 учитывается практическая разработка Go2Asia:
•	Connect больше не рассматривается как отдельный доменный backend-service. 
•	Missions выделяются как будущий надэкосистемный orchestration layer. 
•	Quest больше не использует термин “mission” для внутренних шагов — внутри Quest используются Tasks. 
•	Atlas / Pulse / Blog в runtime сейчас связаны через content-service, а не обязательно через три полностью отдельные backend-службы. 
•	Points, Referral, Reactions, Feed, RF, Rielt и Quest рассматриваются как реальные или частично реализованные backend-контуры. 
•	Tokenomics / G2A / Blockchain Gateway остаются future layer. 
•	Geo Layer рассматривается как отдельная платформенная способность, но зрелый geo-service может быть future target. 
•	Reactions / Threads становятся основной моделью взаимодействия вместо классического мессенджера. 
________________________________________
Runtime reality vs future target
Документ строго различает:
Runtime reality — то, что уже существует или закреплено в текущей реализации:
•	API Gateway; 
•	auth / identity-интеграция; 
•	content-service; 
•	feed-service; 
•	reactions-service; 
•	points-service; 
•	referral-service; 
•	RF / Rielt / Quest baseline; 
•	Space backend contour; 
•	media pipeline; 
•	OpenAPI-first workflow; 
•	readiness / smoke practices. 
Partial implementation — то, что уже имеет основу, но требует стабилизации:
•	RF; 
•	Rielt; 
•	Quest; 
•	Space; 
•	Connect frontend; 
•	Token Service baseline. 
Future target — то, что важно для целевой архитектуры, но не должно считаться уже реализованным:
•	Missions Service; 
•	зрелый Geo Service; 
•	Badges / NFT Service; 
•	full Token Service / G2A; 
•	Blockchain Gateway; 
•	Recommendation Service; 
•	AI / personalization; 
•	advanced analytics; 
•	Connect BFF, если он понадобится позже. 
________________________________________
Связь с Ecosystem Overview v2
Документ Ecosystem Overview v2 описывает Go2Asia на уровне продукта, модулей, ролей и слоёв экосистемы.
Документ Backend Services Architecture v2 является его backend-продолжением.
Если кратко:
•	Ecosystem Overview v2 отвечает на вопрос:
“Что такое Go2Asia как экосистема?” 
•	Backend Services Architecture v2 отвечает на вопрос:
“Какие backend-сервисы поддерживают эту экосистему и кто чем владеет?” 
Этот документ не должен противоречить Ecosystem Overview v2. Все backend-решения должны следовать зафиксированному canon:
•	Connect = UI/product hub, не domain backend-service. 
•	Missions = orchestration layer, не часть Quest. 
•	Quest использует Tasks, не Missions. 
•	Points logic не живёт в Missions. 
•	Guru не владеет данными. 
•	RF и Rielt не смешиваются. 
•	Space не владеет бизнес-доменами. 
•	Off-chain first, on-chain later.

Economy terminology alignment note:
Этот backend-canon документ должен читаться через `docs/economy/economy_authority_terminology_crosswalk_v1.md`. Economy runtime authority остаётся у `docs/economy/points_policy_v1.md` и `docs/economy/referral_network_rewards_policy_v1.md`. Упоминания ledger, balances, reward execution, producers, referral, earnings, wallet, G2A, NFT, token, Blockchain Gateway или future externalization в этом документе не активируют ledger writes, reward producers, accrual pipelines, spend enforcement, payout/settlement, wallet/token/G2A/NFT/on-chain runtime или Slice 16 movement.

2. Архитектурные принципы backend
Backend-архитектура Go2Asia строится вокруг принципа чётких доменных границ. Каждый сервис должен иметь понятную зону ответственности, собственный источник истины в рамках своего домена и стабильные API-контракты для взаимодействия с другими частями экосистемы.
________________________________________
2.1. Domain ownership
Каждый backend-сервис должен владеть только своим доменом.
Примеры:
•	Content Service владеет текущим runtime-контуром контентных данных Atlas / Pulse / Blog. 
•	Space Service / Space backend contour владеет социальными сущностями: posts, groups, memberships, reposts. 
•	Reactions Service владеет реакциями и object-bound interaction. 
•	RF Service владеет партнёрами, offers, vouchers и PRO-связями. 
•	Rielt Service владеет listings и inquiries. 
•	Quest Service владеет quests, tasks, proof, progress и completion. 
•	Points Service владеет runtime-backed internal Points balances, ledger/actions и internal reward execution where implemented.
•	Referral Service владеет referral codes, graph, referral metadata and participation/reward summaries.
•	Missions Service в будущем будет владеть mission catalog, conditions, progress и reward intents. 
Главное правило:
сервис может ссылаться на чужие сущности, но не должен владеть чужой правдой.
________________________________________
2.2. OpenAPI-first
Backend-разработка Go2Asia должна следовать подходу OpenAPI-first.
Это означает:
•	сначала фиксируется контракт; 
•	затем реализуется backend; 
•	затем генерируются типы / SDK; 
•	затем подключается frontend; 
•	затем добавляются тесты и smoke checks. 
OpenAPI-контракт должен быть единым источником истины для публичных и внутренних API, если они используются несколькими сервисами или frontend-модулями.
Контракт должен явно различать:
•	public endpoints; 
•	authenticated endpoints; 
•	internal service endpoints; 
•	staging-only debug endpoints; 
•	future endpoints, если они описываются как target, но ещё не реализованы. 
________________________________________
2.3. API Gateway first
Внешний доступ к backend-сервисам должен идти через API Gateway.
API Gateway отвечает за:
•	маршрутизацию; 
•	auth enforcement; 
•	нормализацию headers; 
•	service-to-service trust; 
•	request correlation; 
•	базовый rate limiting; 
•	readiness / smoke checks; 
•	единый внешний API-периметр. 
Frontend не должен напрямую обращаться к внутренним сервисам, если это не является осознанным исключением.
API Gateway не должен владеть доменной логикой. Его задача — быть контролируемой входной точкой и маршрутизатором.
________________________________________
2.4. Service boundaries
Границы сервисов должны быть жёстко зафиксированы.
Нельзя:
•	переносить Points-логику в Quest; 
•	переносить RF-логику в Rielt; 
•	делать Guru владельцем всех nearby-данных; 
•	превращать Connect в backend-владельца экономики; 
•	смешивать Quest Tasks и Ecosystem Missions; 
•	использовать Space как владелец бизнес-данных. 
Правильная модель:
•	доменный сервис владеет своей моделью; 
•	соседние сервисы используют references / ids; 
•	интеграции строятся через API или события; 
•	cross-domain действия проходят через explicit contracts. 
________________________________________
2.5. Event-driven там, где нужно
Go2Asia не должна быть полностью event-driven системой ради самой идеи event-driven.
События нужны там, где есть:
•	reward flow; 
•	activity tracking; 
•	missions progress; 
•	notifications; 
•	audit; 
•	asynchronous processing; 
•	loose coupling между сервисами. 
Примеры событий:
•	post_created; 
•	reaction_created; 
•	referral_activated; 
•	voucher_redeemed; 
•	quest_completed; 
•	listing_inquiry_created; 
•	partner_profile_completed; 
•	mission_completed; 
•	reward_intent_created. 
Но не всё должно быть событием. Для обычных read-запросов и простых CRUD-сценариев REST API остаётся нормальной и предпочтительной моделью.
Принцип:
REST для чтения и прямых операций, events для последствий, прогресса, internal reward intent signaling и уведомлений. Event wording does not mean ledger write or reward producer activation.
________________________________________
2.6. Off-chain first
Экономика Go2Asia должна развиваться по принципу off-chain first.
Ближний слой:
•	Points; 
•	Referral; 
•	Badges; 
•	Missions; 
•	reward intents; 
•	internal ledger; 
•	audit. 
Future layer:
•	G2A; 
•	on-chain NFT; 
•	Blockchain Gateway; 
•	mint / burn / transfer; 
•	external wallets; 
•	compliance / KYT / limits. 
Это означает:
•	текущая экономика не должна зависеть от блокчейна; 
•	Points должны работать быстро и дёшево внутри платформы; 
•	on-chain операции должны быть редкими и изолированными; 
•	Blockchain Gateway не должен появляться раньше юридической и продуктовой готовности.
Future-layer items are not current withdrawal, liquidity, token transfer, mint/burn, payout, settlement, or investment surfaces.
________________________________________
2.7. No Connect Service as domain owner
Connect Asia не является backend-доменом и не должен становиться владельцем экономики.
Connect — это:
•	frontend / UI hub; 
•	пользовательская витрина прогресса; 
•	агрегатор данных для отображения; 
•	dashboard для Points, Referral, Badges, Missions и future tokenomics. 
Connect не должен владеть:
•	balances; 
•	ledger; 
•	referral graph; 
•	mission progress; 
•	reward execution; 
•	G2A; 
•	blockchain operations. 
Владельцы логики:
•	Points Service; 
•	Referral Service; 
•	Missions Service; 
•	Badges / NFT layer; 
•	Token Service; 
•	Blockchain Gateway. 
В будущем возможен лёгкий connect-bff или connect-dashboard-service, но только как композиционный слой для UI. Он не должен становиться доменным сервисом и не должен принимать экономические решения.
Connect display/read models are projections, not ledger truth, payout balance, spend permission, settlement state, or token wallet.
________________________________________
2.8. Главный backend-принцип
Главный backend-принцип Go2Asia v2:
каждый сервис владеет только своей правдой, а межмодульные сценарии строятся через явные API-контракты, события и reward intents, без скрытого захвата чужих доменов.

3. Карта backend-слоёв
Backend Go2Asia состоит из нескольких архитектурных слоёв. Эти слои не всегда равны одному сервису: один слой может включать несколько сервисов, а один сервис может временно обслуживать несколько доменных зон на ранней стадии. Но каждый слой должен иметь понятную ответственность.
________________________________________
3.1. Edge / Gateway Layer
Edge / Gateway Layer — внешний вход в backend Go2Asia.
Отвечает за:
•	маршрутизацию запросов; 
•	auth enforcement; 
•	service headers; 
•	correlation IDs; 
•	rate limiting; 
•	readiness / smoke checks; 
•	публичный API-периметр. 
Ключевой компонент:
•	API Gateway 
Gateway не владеет доменной логикой. Он принимает запрос, проверяет базовые условия и направляет его в нужный сервис.
________________________________________
3.2. Identity / Auth Layer
Identity / Auth Layer — слой идентичности, доступа и ролей.
Отвечает за:
•	user identity; 
•	authentication; 
•	authorization; 
•	роли; 
•	materialization пользователя в локальной базе; 
•	service trust. 
Ключевые зоны:
•	auth provider / Clerk integration; 
•	user materialization; 
•	role projection; 
•	user_id как общий идентификатор для сервисов. 
Этот слой является фундаментом доступа ко всем защищённым сценариям.
________________________________________
3.3. Content Layer
Content Layer — слой справочного, редакционного и структурированного контента.
Отвечает за:
•	страны; 
•	города; 
•	места; 
•	события; 
•	статьи; 
•	гайды; 
•	медиа-ключи; 
•	curated content. 
Текущая runtime reality:
•	content-service является основным runtime-контуром для Atlas / Pulse / Blog данных. 
Целевой уровень может разделять домены более строго, но текущий canon должен признавать реальную реализацию через content-service.
________________________________________
3.4. Geo Layer
Geo Layer — слой географических контрактов и nearby/viewport-сценариев.
Отвечает за:
•	geo DTO; 
•	coordinates; 
•	viewport; 
•	nearby; 
•	map layers; 
•	geo indexing; 
•	кросс-доменные geo projections. 
Текущая реализация может опираться на Atlas/content-service данные.
Целевой future target:
•	отдельный Geo Service, если нагрузка и сложность картографических сценариев потребуют этого. 
Geo Layer не владеет доменными сущностями. Он строит гео-представления поверх данных владельцев.
________________________________________
3.5. Social Layer
Social Layer — слой пользовательского контента и социальных связей.
Отвечает за:
•	posts; 
•	groups; 
•	memberships; 
•	reposts; 
•	feed; 
•	profile projections; 
•	social activity; 
•	social visibility. 
Ключевые backend-контуры:
•	Space backend contour; 
•	Feed Service; 
•	Reactions Service. 
Social Layer может порождать события для Missions, Points, Blog и Notifications, но не владеет бизнес-доменами.
________________________________________
3.6. Business / Commerce Layer
Business / Commerce Layer — слой бизнес-партнёров, предложений и housing-сценариев.
Отвечает за:
•	RF partners; 
•	partner profiles; 
•	offers; 
•	vouchers; 
•	PRO links; 
•	listings; 
•	inquiries; 
•	housing references. 
Ключевые сервисы:
•	RF Service; 
•	Rielt Service; 
•	Voucher / Offers logic. 
Правило:
•	RF владеет business/partner domain; 
•	Rielt владеет housing/listing domain; 
•	они могут ссылаться друг на друга, но не должны сливаться в один домен. 
________________________________________
3.7. Quest / Experience Layer
Quest / Experience Layer — слой квестов, маршрутов и прохождения пользовательских сценариев.
Отвечает за:
•	quests; 
•	routes; 
•	quest tasks; 
•	proof; 
•	validation; 
•	progress; 
•	completion; 
•	reward handoff. 
Ключевой сервис:
•	Quest Service. 
Важно:
•	внутри Quest используется термин Task; 
•	Ecosystem Missions не являются частью Quest; 
•	Quest может отправлять события в Points / Missions / Badges, но не владеет экономикой. 
________________________________________
3.8. Economy / Gamification Layer
Economy / Gamification Layer — слой мотивации, наград и внутренней экономики.
Отвечает за:
•	Points; 
•	ledger; 
•	transactions; 
•	Referral; 
•	Badges; 
•	Missions; 
•	reward intents; 
•	future Token / G2A; 
•	future on-chain NFT. 
Ключевые сервисы / target-сервисы:
•	Points Service; 
•	Referral Service; 
•	Missions Service; 
•	Badges / NFT layer; 
•	Token Service; 
•	Blockchain Gateway. 
Принцип:
off-chain first, on-chain later.
________________________________________
3.9. Notification / Interaction Layer
Notification / Interaction Layer — слой объектно-привязанной коммуникации и уведомлений.
Отвечает за:
•	reactions; 
•	likes; 
•	reposts; 
•	reviews; 
•	questions; 
•	contact requests; 
•	thread replies; 
•	asynchronous threads; 
•	push/email/Telegram notifications; 
•	internal notification feed. 
Ключевые компоненты:
•	Reactions Service; 
•	Thread / Inquiry Model; 
•	Notification Service. 
Go2Asia не строит тяжёлый real-time messenger в текущем canon. Коммуникация должна быть привязана к объектам: посту, событию, листингу, партнёру, квесту или заявке.
________________________________________
3.10. AI / Recommendation Layer
AI / Recommendation Layer — future layer интеллектуальной помощи и персонализации.
Может отвечать за:
•	рекомендации мест; 
•	рекомендации событий; 
•	рекомендации Missions; 
•	персонализацию Guru; 
•	AI Guide; 
•	content moderation AI; 
•	smart notifications; 
•	housing matching; 
•	mission personalization. 
Потенциальные сервисы:
•	Recommendation Service; 
•	AI Guide / Assistant; 
•	Moderation AI; 
•	Personalization Engine. 
AI Layer не должен владеть доменными данными. Он может анализировать, рекомендовать и ранжировать, но не заменяет Atlas, RF, Rielt, Quest, Points или Missions.
________________________________________
3.11. Observability / Infrastructure Layer
Observability / Infrastructure Layer — слой устойчивости, диагностики и эксплуатации.
Отвечает за:
•	readiness endpoints; 
•	health checks; 
•	smoke tests; 
•	structured logging; 
•	metrics; 
•	correlation IDs; 
•	CI checks; 
•	deploy gates; 
•	staging diagnostics; 
•	audit logs; 
•	media storage; 
•	generated SDK / types. 
Ключевые направления:
•	OpenAPI validation; 
•	generated SDK; 
•	service readiness; 
•	logs / traces; 
•	monitoring; 
•	deployment pipeline; 
•	media pipeline. 
Этот слой не должен владеть продуктовой логикой, но без него платформа не может стабильно развиваться.
________________________________________
3.12. Сводная таблица backend-слоёв
Слой	Основная ответственность	Ключевые сервисы / компоненты
Edge / Gateway	Вход, маршрутизация, auth enforcement	API Gateway
Identity / Auth	Идентичность, роли, доступ	Auth integration, user materialization
Content	Страны, города, места, события, статьи	Content Service, Atlas/Pulse/Blog domains
Geo	Nearby, viewport, map layers	Geo Layer, future Geo Service
Social	Посты, группы, ленты, социальная активность	Space, Feed, Reactions
Business / Commerce	Партнёры, ваучеры, жильё	RF, Rielt, Voucher/Offers
Quest / Experience	Квесты, маршруты, tasks, progress	Quest Service
Economy / Gamification	Points, Referral, Missions, Badges	Points, Referral, Missions, Token future
Notification / Interaction	Уведомления и object-bound communication	Reactions, Threads, Notification
AI / Recommendation	Персонализация и AI-помощь	Recommendation, AI Guide future
Observability / Infra	Readiness, logs, CI, deploy, media	OpenAPI, logs, media, deploy pipeline
________________________________________
3.13. Главный принцип карты слоёв
Слои backend должны быть связаны, но не должны захватывать ответственность друг друга.
•	Gateway маршрутизирует, но не решает доменные задачи. 
•	Auth идентифицирует, но не владеет постами или Points. 
•	Content даёт знания, но не управляет бизнесом. 
•	Geo индексирует и выдаёт гео-представления, но не владеет сущностями. 
•	Social создаёт пользовательскую активность, но не владеет RF или Rielt. 
•	Quest создаёт опыт, но не владеет Missions или Points. 
•	Economy исполняет награды, но не создаёт доменные события. 
•	AI рекомендует, но не является источником истины.



4. Runtime services сейчас
Этот раздел фиксирует текущую backend-реальность Go2Asia: какие сервисы и контуры уже существуют в проекте или считаются частью текущего runtime, даже если не все они доведены до финального продуктового состояния.
Важно: наличие сервиса в этом списке не означает, что он полностью завершён. Это означает, что он уже должен учитываться как реальный backend-контур проекта.
________________________________________
4.1. API Gateway
API Gateway — текущая внешняя точка входа в backend Go2Asia.
Он отвечает за:
•	маршрутизацию /v1/... запросов; 
•	auth enforcement для защищённых маршрутов; 
•	передачу service-to-service headers; 
•	проксирование запросов к внутренним сервисам; 
•	readiness / smoke checks; 
•	базовую унификацию внешнего API. 
API Gateway не владеет доменной логикой. Он не должен принимать решения за RF, Quest, Points, Rielt или другие сервисы.
________________________________________
4.2. Auth / Identity integration
В Go2Asia уже существует контур авторизации и идентичности.
Он отвечает за:
•	проверку пользователя; 
•	передачу user_id; 
•	ролевую информацию; 
•	materialization пользователя в локальной базе; 
•	связь внешнего auth provider с внутренней моделью пользователей. 
Этот слой должен оставаться источником истины по идентичности, но не должен владеть социальной, экономической или бизнесовой активностью пользователя.
________________________________________
4.3. Content Service
Content Service — один из ключевых текущих runtime-сервисов.
Он обслуживает контентные домены:
•	Atlas; 
•	Pulse; 
•	Blog; 
•	countries; 
•	cities; 
•	places; 
•	events; 
•	articles / guides; 
•	media keys. 
В ранней архитектуре Atlas, Pulse и Blog могли рассматриваться как отдельные backend-сервисы. В текущей runtime reality значительная часть их данных и API проходит через content-service.
Поэтому в v2 важно фиксировать:
Content Service сейчас является реальным runtime-контуром для Atlas / Pulse / Blog данных.
________________________________________
4.4. Feed Service
Feed Service — backend-контур для лент и социальной выдачи.
Он отвечает за:
•	сбор публикаций; 
•	выдачу лент; 
•	социальную активность; 
•	базовое агрегирование контента; 
•	подготовку feed-сценариев для Space. 
Feed Service связан со Space и Reactions, но не должен становиться владельцем всех социальных данных. Его задача — формировать выдачу, а не владеть всеми доменными сущностями Space.
________________________________________
4.5. Reactions Service
Reactions Service уже является важным runtime-сервисом социального взаимодействия.
Он отвечает за:
•	лайки; 
•	реакции; 
•	summary / batch-сценарии; 
•	write-path для реакций; 
•	throttling / rate limiting; 
•	базовую защиту от злоупотреблений. 
В целевой модели Reactions Service расширяется до object-bound interaction layer:
•	repost; 
•	rating; 
•	short review; 
•	feedback; 
•	question; 
•	contact request; 
•	thread reply. 
Но даже сейчас он уже закреплён как отдельный владелец реакций и не должен смешиваться с Feed, Space или Points.
________________________________________
4.6. Space Service / Space backend contour
Space backend contour — текущий контур социальной архитектуры Go2Asia.
Он включает или должен включать:
•	posts; 
•	reposts; 
•	groups; 
•	memberships; 
•	profile projections; 
•	post media relations; 
•	social visibility; 
•	связь с Feed; 
•	связь с Reactions. 
Space ещё требует дальнейшей продуктовой и frontend-доработки, но backend-контур уже зафиксирован как отдельная зона.
Важно:
Space не владеет RF, Rielt, Points, Missions или Tokenomics.
Space создаёт социальные события и пользовательский контент.
________________________________________
4.7. Points Service
Points Service — текущий сервис внутренней Points-экономики.
Он отвечает за:
•	balances; 
•	ledger; 
•	transactions; 
•	начисления; 
•	списания; 
•	idempotency; 
•	историю операций; 
•	reward execution. 
Points Service — владелец runtime-backed internal Points truth.
Другие сервисы могут инициировать события или reward intents, но не должны самостоятельно менять баланс пользователя.
Важно: `balance`, `ledger` и `reward execution` здесь означают internal Points utility/accounting where runtime-backed. Они не означают money, cash balance, payout obligation, financial ledger, external accounting, settlement, or token liquidity.
________________________________________
4.8. Referral Service
Referral Service — текущий сервис реферальной программы.
Он отвечает за:
•	referral codes; 
•	referral links; 
•	sponsor/referral relationships; 
•	referral graph; 
•	referral participation / reward eligibility summaries;
•	referral activation; 
•	реферальные события. 
Referral Service может инициировать наградные сценарии через Points / Economy layer, но не должен напрямую смешиваться с Connect UI или Missions.
Referral wording must not be read as income, commission, passive earnings, MLM, payout tree, or partner settlement.
________________________________________
4.9. Token Service baseline
Token Service существует как baseline / подготовительный контур, но не должен рассматриваться как полностью зрелый tokenomics engine.
На текущем этапе важно фиксировать:
•	Token Service не равен Connect Service; 
•	Token Service относится к future / advanced economy layer; 
•	G2A и on-chain операции не должны считаться обязательной частью MVP; 
•	Token Service должен оставаться отделённым от Points и Blockchain Gateway по ответственности. 
Текущий canon:
Points / Referral / Badges — ближняя off-chain экономика.
Token / G2A / Blockchain Gateway — future layer.
This baseline does not activate G2A, wallet, withdrawal, bridge, token transfer, NFT marketplace, payout, settlement, or liquidity features.
________________________________________
4.10. RF Service
RF Service — контур бизнес/партнёрского слоя Russian Friendly.
Он отвечает или должен отвечать за:
•	partners; 
•	partner profiles; 
•	offers; 
•	vouchers; 
•	PRO ↔ partner relationships; 
•	RF status; 
•	partner metrics; 
•	business-facing данные. 
RF Service требует стабилизации, но уже является стратегическим доменным контуром.
Важно:
RF не должен растворяться внутри Rielt, Quest или Connect.
RF — самостоятельный business/partner domain.
________________________________________
4.11. Rielt Service
Rielt Service — backend-контур рынка жилья.
Он отвечает за:
•	listings; 
•	listing details; 
•	geo references; 
•	media references; 
•	inquiries; 
•	listing status; 
•	owner/contact request scenarios. 
В v1 Rielt не должен включать:
•	полноценное booking; 
•	payments; 
•	real-time chat; 
•	CRM; 
•	внутреннюю RF-логику; 
•	сложную сделочную платформу. 
Rielt может ссылаться на RF-партнёров, но остаётся housing/listing domain.
________________________________________
4.12. Quest Service
Quest Service — backend-контур квестов и маршрутов.
Он отвечает за:
•	quests; 
•	routes; 
•	quest tasks; 
•	quest media; 
•	quest metadata; 
•	proof; 
•	validation; 
•	user progress; 
•	completion; 
•	reward handoff. 
Важно:
Внутри Quest используется термин Task, а не Mission.
Ecosystem Missions — отдельный будущий orchestration layer.
Quest может отправлять события в Points / Badges / Missions, но не должен владеть Points-логикой или общей системой Missions.
________________________________________
4.13. Media / storage pipeline
В Go2Asia уже существует или используется контур работы с медиа.
Он включает:
•	media keys; 
•	object storage; 
•	CDN / public media URL; 
•	hero media; 
•	gallery media; 
•	module-specific media prefixes; 
•	frontend media resolver. 
Для текущей архитектуры важно:
•	backend должен отдавать media keys / references, а не жёстко зашитые публичные URL; 
•	frontend должен собирать URL через media resolver / env; 
•	модули не должны хаотично изобретать разные схемы хранения медиа. 
Media pipeline особенно важен для:
•	Atlas places; 
•	Pulse events; 
•	Quest media; 
•	Rielt listings; 
•	RF partner profiles; 
•	Blog articles; 
•	Space posts. 
________________________________________
4.14. Итоговая runtime-карта
Runtime service / contour	Текущий смысл	Статус
API Gateway	Вход и маршрутизация API	существует
Auth / Identity	Идентичность, роли, materialization	существует
Content Service	Atlas / Pulse / Blog runtime data	существует
Feed Service	Ленты / social feed	существует
Reactions Service	Реакции / interaction write-path	существует
Space backend contour	Posts, groups, reposts, memberships	частично готов
Points Service	Points ledger / balances	существует
Referral Service	Referral graph / earnings	существует
Token Service baseline	Future tokenomics baseline	ограниченно / baseline
RF Service	Business / partner domain	частично готов
Rielt Service	Housing / listings domain	baseline
Quest Service	Quests / tasks / progress	baseline
Media pipeline	Media keys / storage / CDN	существует / развивается
________________________________________
4.15. Главный вывод
Текущая backend-реальность Go2Asia уже достаточно сложна и не является “чистой концепцией”.
Поэтому дальнейшая разработка должна идти не через добавление всё новых сервисов, а через:
•	стабилизацию текущих доменов; 
•	уточнение ownership; 
•	выравнивание OpenAPI contracts; 
•	cleanup устаревших артефактов; 
•	осторожное добавление future services только после появления реальной потребности.

5. Future / Target Services
Этот раздел фиксирует сервисы, которые важны для целевой архитектуры Go2Asia, но не должны считаться полностью реализованными runtime-сервисами сейчас.
Future / target services нужно проектировать осторожно: они должны появляться только тогда, когда для них есть понятная доменная необходимость, данные, события и пользовательские сценарии.
________________________________________
5.1. Missions Service
Missions Service — будущий надэкосистемный orchestration service для пользовательских целей, прогресса и reward intents.
Он должен владеть:
•	mission catalog; 
•	mission types; 
•	mission conditions; 
•	user mission progress; 
•	mission chains; 
•	mission status; 
•	reward intents; 
•	personalization rules в будущем. 
Missions Service не должен:
•	начислять Points напрямую; 
•	владеть ledger; 
•	заменять Quest; 
•	хранить чужую доменную правду; 
•	валидировать события вместо доменных сервисов. 
Правильная схема:
confirmed domain signal → mission progress update → reward intent → Points / Badges where runtime-backed; Token/G2A only as future layer
Reward intent is not a ledger write by itself and does not activate reward producers or payout.
________________________________________
5.2. Geo Service
Geo Service — целевой платформенный сервис для гео-контрактов, map layers, nearby и viewport-сценариев.
Он может владеть:
•	unified geo DTO; 
•	viewport queries; 
•	nearby queries; 
•	map layers; 
•	geo indexing; 
•	geo projections; 
•	tile/cache logic; 
•	cross-domain geo aggregation. 
Geo Service не должен владеть доменными сущностями:
•	местами Atlas; 
•	событиями Pulse; 
•	листингами Rielt; 
•	партнёрами RF; 
•	квестами Quest; 
•	постами Space. 
Он должен строить быстрые гео-представления поверх данных доменных сервисов.
________________________________________
5.3. Notification Service
Notification Service — будущий централизованный сервис уведомлений.
Он должен отвечать за:
•	push; 
•	email; 
•	Telegram later; 
•	internal notification feed; 
•	notification templates; 
•	delivery status; 
•	user notification preferences; 
•	retries; 
•	anti-spam / throttling notifications. 
Источники событий:
•	Reactions; 
•	Threads; 
•	Missions; 
•	Points; 
•	Quest; 
•	RF; 
•	Rielt; 
•	Space; 
•	Blog / Pulse. 
Notification Service не должен быть чатом. Он только доставляет уведомления о событиях, ответах, наградах и действиях.
________________________________________
5.4. Badges / NFT Service
Badges / NFT Service — будущий сервис достижений, бейджей и, позже, NFT.
На ближнем этапе он должен работать как off-chain badges layer:
•	badge catalog; 
•	badge rules; 
•	user badges; 
•	badge levels; 
•	badge progress; 
•	badge assignment; 
•	badge display metadata. 
На будущем этапе может поддерживать NFT:
•	NFT metadata; 
•	NFT mint requests; 
•	NFT status; 
•	связь с Blockchain Gateway; 
•	on-chain badge confirmation. 
Важно:
Badge сначала является off-chain достижением. NFT — только future extension.
Badges / NFT Service не должен владеть Points ledger или Missions progress.
NFT wording here is future-only. It does not activate mint, burn, transfer, marketplace, token liquidity, or on-chain user-facing assets.
________________________________________
5.5. Blockchain Gateway
Blockchain Gateway — future service для on-chain операций.
Он нужен только на этапе включения G2A / on-chain NFT.
Он должен отвечать за:
•	wallet integration; 
•	TON operations; 
•	mint; 
•	burn; 
•	transfer; 
•	transaction status; 
•	key isolation; 
•	limits; 
•	audit; 
•	compliance checks. 
Blockchain Gateway не должен:
•	принимать экономические решения; 
•	начислять награды; 
•	владеть balances; 
•	знать бизнес-логику RF / Quest / Missions. 
Он выполняет только подтверждённые команды от Token / NFT layer.
Принцип:
Token Service решает, Blockchain Gateway исполняет.
________________________________________
5.6. Recommendation Service
Recommendation Service — future AI / personalization service.
Он может отвечать за:
•	рекомендации мест; 
•	рекомендации событий; 
•	рекомендации квестов; 
•	рекомендации Missions; 
•	персонализацию Guru; 
•	персонализацию Connect; 
•	smart notifications; 
•	подбор контента; 
•	housing recommendations в будущем. 
Recommendation Service не должен быть source of truth.
Он не владеет:
•	Atlas; 
•	RF; 
•	Rielt; 
•	Quest; 
•	Space; 
•	Points; 
•	Missions. 
Он только анализирует поведение, ранжирует и предлагает.
________________________________________
5.7. Moderation / Trust & Safety Service
Moderation / Trust & Safety Service — future service для модерации, жалоб, антиспама и доверия.
Он может отвечать за:
•	abuse reports; 
•	moderation queues; 
•	content flags; 
•	user restrictions; 
•	spam detection; 
•	RF partner trust signals; 
•	Rielt listing trust signals; 
•	suspicious activity; 
•	manual review workflow; 
•	AI-assisted moderation. 
Источники:
•	Space posts; 
•	Reactions; 
•	Threads; 
•	RF reviews; 
•	Rielt listings; 
•	Quest proof; 
•	Blog submissions. 
На раннем этапе часть этой логики может жить внутри доменных сервисов или Admin Console, но по мере роста её лучше выделять отдельно.
________________________________________
5.8. Analytics Service
Analytics Service — future service для продуктовой, операционной и бизнес-аналитики.
Он может отвечать за:
•	product analytics; 
•	module metrics; 
•	funnel analysis; 
•	RF performance; 
•	voucher analytics; 
•	quest completion analytics; 
•	user activation metrics; 
•	mission conversion; 
•	retention; 
•	economy health metrics; 
•	admin dashboards. 
Analytics Service не должен быть transactional source of truth.
Он работает с событиями, агрегатами и витринами данных.
________________________________________
5.9. Connect BFF — только если понадобится
Connect BFF / Connect Dashboard Service может появиться только как технический слой композиции данных для UI.
Он может быть нужен, если frontend Connect станет слишком сложно собирать из разных сервисов:
•	Points; 
•	Referral; 
•	Missions; 
•	Badges; 
•	Token; 
•	Notifications; 
•	profile summary. 
Connect BFF может:
•	агрегировать ответы; 
•	кешировать dashboard summary; 
•	оптимизировать UI-запросы; 
•	формировать read-model для Connect frontend. 
Но Connect BFF не должен:
•	владеть ledger; 
•	исполнять rewards; 
•	управлять Missions; 
•	владеть referral graph; 
•	начислять Points; 
•	принимать экономические решения. 
Правило:
Connect BFF допустим как read/composition layer, но не как domain owner.
________________________________________
5.10. Приоритет появления future services
Рекомендуемый порядок появления future services:
1.	Missions Service — после стабилизации RF / Rielt / Quest / Space events. 
2.	Notification Service — когда Threads / Reactions / Missions начнут активно генерировать уведомления. 
3.	Badges Service — когда Points и Missions дадут достаточно достижений. 
4.	Geo Service — когда current geo через content-service перестанет быть достаточным. 
5.	Analytics Service — когда появятся реальные продуктовые воронки и бизнес-метрики. 
6.	Moderation / Trust & Safety — по мере роста UGC и RF/Rielt активности. 
7.	Recommendation Service — после накопления данных. 
8.	Blockchain Gateway — только после юридической и tokenomics-готовности. 
9.	Connect BFF — только если UI-агрегация станет технически тяжёлой. 
________________________________________
5.11. Главный принцип future services
Future services не должны создаваться “на всякий случай”.
Они должны появляться только если:
•	есть реальный домен; 
•	есть данные; 
•	есть события; 
•	есть пользовательский или операционный сценарий; 
•	есть понятный владелец; 
•	есть границы с соседними сервисами.

6. Core Services
Core services — это базовый backend-фундамент Go2Asia. Эти сервисы не являются “модулями продукта” вроде RF, Quest или Space, но без них остальные домены не могут работать стабильно и безопасно.
________________________________________
6.1. API Gateway
Роль
API Gateway — единая внешняя точка входа во внутренние backend-сервисы Go2Asia.
Он отвечает за:
•	приём внешних API-запросов; 
•	маршрутизацию к доменным сервисам; 
•	базовую проверку доступа; 
•	унификацию заголовков; 
•	readiness / smoke checks; 
•	защиту внутренней сервисной структуры от прямого доступа. 
API Gateway не должен владеть доменной логикой.
________________________________________
Маршрутизация
Gateway маршрутизирует запросы по стабильным API-префиксам.
Примеры:
•	/v1/content/... → Content Service; 
•	/v1/space/... → Space backend contour; 
•	/v1/reactions/... → Reactions Service; 
•	/v1/points/... → Points Service; 
•	/v1/referrals/... → Referral Service; 
•	/v1/rf/... → RF Service; 
•	/v1/rielt/... → Rielt Service; 
•	/v1/quests/... → Quest Service. 
Gateway должен быть маршрутизатором, а не бизнес-оркестратором.
________________________________________
Auth enforcement
Gateway отвечает за первичную проверку защищённых маршрутов.
Он должен:
•	проверять наличие user token; 
•	валидировать auth claims; 
•	определять user_id; 
•	передавать user context во внутренний сервис; 
•	блокировать неавторизованные запросы; 
•	различать public / authenticated / internal endpoints. 
При этом доменные сервисы всё равно должны проверять свои права на уровне доменной логики.
Пример:
•	Gateway проверяет, что пользователь авторизован. 
•	RF Service проверяет, имеет ли пользователь право редактировать конкретного партнёра. 
________________________________________
Service-to-service headers
Gateway должен передавать внутренним сервисам стандартизированный контекст.
Примеры headers:
•	X-Request-ID; 
•	X-Correlation-ID; 
•	X-User-ID; 
•	X-User-Role; 
•	X-Gateway-Auth; 
•	X-Service-Name; 
•	X-Forwarded-For. 
Эти headers позволяют:
•	трассировать запрос; 
•	связать действия пользователя; 
•	обеспечить service-to-service trust; 
•	упростить аудит и debugging. 
________________________________________
Readiness / smoke checks
API Gateway должен участвовать в operational readiness.
Он должен поддерживать:
•	/ready; 
•	basic health checks; 
•	smoke checks downstream-сервисов; 
•	staging verification; 
•	deploy gating. 
Gateway readiness не должен просто означать “worker запустился”. Он должен показывать, что критичные зависимости доступны или корректно деградируют.
________________________________________
6.2. Auth / Identity
User identity
Auth / Identity layer отвечает за идентичность пользователя в Go2Asia.
Он должен давать системе стабильный ответ на вопрос:
кто этот пользователь?
Identity layer отвечает за:
•	регистрацию; 
•	вход; 
•	session/token validation; 
•	внешний auth provider; 
•	связку внешнего identity с внутренним user_id; 
•	первичный user context для сервисов. 
________________________________________
Roles
Роли пользователя должны быть доступны backend-сервисам в контролируемом виде.
Основные роли:
•	Guest; 
•	Spacer; 
•	VIP Spacer; 
•	PRO; 
•	Business Partner; 
•	Admin; 
•	Moderator; 
•	Editor. 
Важно:
•	роль не должна трактоваться по-разному в разных сервисах; 
•	повышение роли должно быть управляемым; 
•	бизнесовые и внутренние роли должны быть отделены от обычных пользовательских статусов; 
•	сервисы должны проверять не только роль, но и ownership конкретного ресурса. 
________________________________________
Clerk / current auth integration
Текущая auth-интеграция Go2Asia может использовать внешний identity provider, включая Clerk.
В этом случае:
•	Clerk / auth provider отвечает за внешний identity; 
•	Go2Asia materializes пользователя во внутреннюю базу; 
•	внутренние сервисы работают с локальным user_id; 
•	gateway / middleware валидирует auth context; 
•	доменные сервисы не должны напрямую зависеть от деталей внешнего auth provider. 
Правило:
внешний auth provider может быть заменяемым, а внутренняя доменная модель пользователя должна оставаться стабильной.
________________________________________
User materialization
User materialization — это процесс создания или обновления внутренней записи пользователя на основе внешнего identity.
Materialized user нужен, чтобы:
•	сервисы ссылались на стабильный user_id; 
•	Points могли вести ledger; 
•	Referral мог строить graph; 
•	Space мог связывать посты с автором; 
•	RF / Rielt / Quest могли проверять ownership; 
•	Connect мог агрегировать пользовательский прогресс. 
Materialization не должна размазываться по всем сервисам. Должен быть один понятный flow, через который пользователь становится известен платформе.
________________________________________
Ownership boundaries
Auth / Identity layer владеет:
•	identity; 
•	authentication; 
•	base user id; 
•	global role claims; 
•	account status; 
•	базовыми security attributes. 
Auth / Identity layer не владеет:
•	постами; 
•	группами; 
•	Points; 
•	referrals; 
•	RF-партнёрами; 
•	Rielt-листингами; 
•	Quest-прогрессом; 
•	Missions-прогрессом; 
•	бизнес-метриками. 
Все доменные данные должны храниться в своих сервисах и ссылаться на пользователя через user_id.
________________________________________
6.3. User Profile / User Projection
Профиль
User Profile — пользовательское представление аккаунта в экосистеме.
Он может включать:
•	display name; 
•	avatar; 
•	bio; 
•	language; 
•	public status; 
•	role labels; 
•	location preferences; 
•	privacy settings; 
•	links to user activity. 
Профиль должен быть отделён от чувствительных auth-данных.
Например:
•	email; 
•	auth provider id; 
•	session state; 
•	security settings 
не должны свободно распространяться в доменные сервисы, если они им не нужны.
________________________________________
Role projection
Role projection — это представление роли пользователя для других сервисов.
Примеры:
•	Space видит, что пользователь PRO и может иметь PRO badge. 
•	Quest видит, что пользователь PRO и может создавать квесты. 
•	RF видит, что пользователь PRO и может курировать партнёров. 
•	Connect видит, что пользователь VIP и показывает расширенные награды. 
•	Admin Console видит, что пользователь Moderator / Editor / Admin. 
Role projection должен быть консистентным и не должен вычисляться отдельно в каждом сервисе по разным правилам.
________________________________________
Публичные и приватные данные
Пользовательские данные должны разделяться на публичные и приватные.
Public profile data
Может использоваться в UI:
•	имя; 
•	аватар; 
•	публичный статус; 
•	PRO/VIP badge; 
•	короткое bio; 
•	публичные social metrics. 
Private account data
Должно быть ограничено:
•	email; 
•	auth provider data; 
•	security settings; 
•	internal flags; 
•	sensitive audit data; 
•	billing / payment-related information, если появится. 
Принцип:
доменные сервисы должны получать только те пользовательские данные, которые им действительно нужны.
________________________________________
Связь со Space
Space использует User Profile / User Projection для:
•	отображения автора поста; 
•	отображения участников групп; 
•	профилей пользователей; 
•	PRO/VIP badges; 
•	social reputation; 
•	visibility / privacy. 
Но Space не должен становиться владельцем identity.
Space может хранить social profile extensions, например:
•	display preferences; 
•	social bio; 
•	group roles; 
•	social visibility; 
•	pinned posts. 
Но базовая identity остаётся во внешнем Auth / User layer.
________________________________________
Связь с Connect
Connect использует User Projection для отображения:
•	статуса пользователя; 
•	роли; 
•	уровня; 
•	Points summary; 
•	Badges; 
•	Referral summary; 
•	Missions progress; 
•	будущих tokenomics-данных. 
Connect не должен владеть User Profile и не должен менять роли напрямую. Он только отображает состояние пользователя и его прогресс, получая данные из профильных сервисов.
________________________________________
Главный принцип Core Services
Core services должны обеспечивать:
•	единый вход; 
•	единую идентичность; 
•	стабильные user references; 
•	безопасную маршрутизацию; 
•	наблюдаемость; 
•	управляемое разграничение прав. 
Они не должны становиться “скрытым монолитом” и не должны захватывать продуктовую логику доменных сервисов.

7. Content Services
Content services отвечают за справочный, событийный и медийный слой Go2Asia. В текущей runtime-реальности значительная часть этого слоя обслуживается через Content Service, внутри которого живут домены Atlas, Pulse и Blog.
________________________________________
7.1. Content Service
Текущий runtime-контур для Atlas / Pulse / Blog
Content Service — текущий backend-контур для структурированного контента Go2Asia.
Он обслуживает данные, связанные с:
•	Atlas Asia; 
•	Pulse Asia; 
•	Blog Asia; 
•	справочниками; 
•	гео-контентом; 
•	событиями; 
•	статьями; 
•	guides; 
•	media references. 
В ранней архитектуре Atlas, Pulse и Blog могли рассматриваться как отдельные backend-сервисы. В текущем canon важно фиксировать:
Сейчас Content Service является runtime-основой контентного слоя, даже если в будущем отдельные домены могут быть выделены сильнее.
________________________________________
Countries / Cities / Places / Events / Articles / Guides
Content Service может обслуживать следующие сущности:
•	countries — страны; 
•	cities — города; 
•	districts / areas — районы и локальные зоны; 
•	places — места; 
•	events — события; 
•	articles — статьи; 
•	guides — структурированные справочники; 
•	themes / tags — темы и категории; 
•	media references — ссылки на медиа-ключи. 
Эти сущности должны иметь стабильные идентификаторы и использоваться другими сервисами через references, а не через копирование данных.
________________________________________
Media keys
Content Service должен отдавать media keys / media references, а не жёстко зашитые публичные URL.
Правильная модель:
•	backend хранит и отдаёт media_key; 
•	frontend или SDK преобразует media_key в публичный URL через media resolver; 
•	базовый media host задаётся через environment configuration; 
•	разные модули используют единый принцип. 
Это важно для:
•	Atlas place galleries; 
•	Pulse event galleries; 
•	Blog cover images; 
•	Quest media; 
•	RF partner media; 
•	Rielt listing media. 
________________________________________
Debug / staging endpoints
Content Service может иметь debug / staging endpoints, но они должны быть строго ограничены.
Такие endpoints могут использоваться для:
•	проверки данных; 
•	диагностики media keys; 
•	сверки импортов; 
•	staging QA; 
•	smoke checks; 
•	отладки content pipeline. 
Правила:
•	debug endpoints не должны быть публичной частью product API; 
•	staging-only endpoints должны быть явно помечены; 
•	production exposure должен быть запрещён или строго защищён; 
•	Cursor не должен использовать debug endpoints как основу продуктового frontend. 
________________________________________
7.2. Atlas Domain
Geo / Content Truth
Atlas domain — источник справочной и географической правды для Go2Asia.
Atlas отвечает за:
•	страны; 
•	города; 
•	районы; 
•	места; 
•	категории; 
•	теги; 
•	описания; 
•	guides; 
•	базовый контекст локаций. 
Atlas не является социальной лентой и не должен хранить raw UGC без модерации или структурирования.
________________________________________
Страны / города / места / guides
Atlas должен организовывать контент и географию в понятную иерархию:
•	страна; 
•	регион / провинция, если нужно; 
•	город; 
•	район; 
•	место; 
•	guide; 
•	тематическая подборка. 
Guides в Atlas — это структурированные, обновляемые, объективные справочники от имени платформы. Они не должны дублировать Blog, который является слоем личного опыта и curated media.
Atlas Guides могут агрегировать ссылки на Blog / Pulse / Space, но не должны превращаться в личные истории от первого лица.
________________________________________
Связь с Geo Layer
Atlas является главным источником данных для Geo Layer.
Geo Layer может:
•	индексировать Atlas places; 
•	строить nearby / viewport выдачу; 
•	готовить map layers; 
•	связывать места с Quest, Guru, Rielt, RF и Pulse. 
Но Geo Layer не должен изменять или владеть Atlas-сущностями. Если координаты, название или категория места требуют правки, источник изменения — Atlas domain / Content Service.
________________________________________
7.3. Pulse Domain
Events
Pulse domain отвечает за события.
Событие может включать:
•	title; 
•	description; 
•	city / place reference; 
•	date / time; 
•	timezone; 
•	category; 
•	organizer; 
•	status; 
•	source; 
•	cover media; 
•	gallery media; 
•	related links. 
Pulse должен поддерживать два смысловых режима:
•	афиша — будущие или актуальные события; 
•	хроника — прошедшие события как культурный и исторический архив. 
________________________________________
Event media
Pulse events должны использовать canon media approach:
•	hero_media_key; 
•	gallery_media_keys; 
•	media_prefix, если используется динамическая схема; 
•	единый frontend media resolver. 
Нельзя жёстко зашивать публичные URL в API-ответы, если есть возможность отдавать stable media references.
________________________________________
Future event authoring
В текущем runtime Pulse может быть в основном контентным/редакторским слоем.
Future target для Pulse:
•	создание событий PRO-пользователями; 
•	создание событий RF-партнёрами; 
•	user-submitted events; 
•	moderation workflow; 
•	event status lifecycle; 
•	event attendance; 
•	event-related Missions; 
•	связь с Space discussions / reactions. 
Но эти функции должны развиваться после стабилизации базовой модели events и прав доступа.
________________________________________
7.4. Blog Domain
Curated content
Blog domain — curated media layer Go2Asia.
Blog отвечает за:
•	статьи; 
•	подборки; 
•	репортажи; 
•	редакционные материалы; 
•	PRO-материалы; 
•	отобранный UGC; 
•	SEO-публичный контент. 
Blog должен быть витриной лучших и наиболее полезных материалов, а не потоком всех пользовательских публикаций.
________________________________________
Связь со Space
Space может быть источником контента для Blog.
Типовой сценарий:
1.	Пользователь публикует пост в Space. 
2.	Пост получает реакции / репосты / модераторскую оценку. 
3.	Редактор или система отбирает материал. 
4.	Материал превращается в Blog article. 
5.	Автор получает attribution и потенциальную награду через Economy Layer. 
Blog может ссылаться обратно на Space-профиль автора или исходный контент, но после публикации Blog article становится curated entity, а не просто копией raw post.
________________________________________
Отличие от raw UGC
Важно различать:
Space	Blog
raw UGC	curated content
поток публикаций	отобранные материалы
личные заметки	статьи / репортажи / гайды
социальная активность	SEO / публичная витрина
быстрое взаимодействие	долгоживущий контент
Blog не должен заменять Space, а Space не должен заменять Blog.
Правило:
Space создаёт живой пользовательский материал. Blog отбирает, структурирует и публикует лучшее как публичный медийный слой.

8. Geo Services
Geo services отвечают за географическую основу Go2Asia: координаты, районы, nearby-сценарии, viewport-выдачу, слои карты и кросс-доменные гео-связи.
Geo Layer — это не просто “карта”. Это платформенная способность, которая позволяет Atlas, Guru, Quest, Rielt, RF, Pulse и Space работать с одной согласованной географической логикой.
________________________________________
8.1. Geo Layer сейчас
Geo-contracts
На текущем этапе Geo Layer должен рассматриваться как набор geo-contracts и правил представления географических данных.
Geo-contracts нужны, чтобы разные модули одинаково понимали:
•	страну; 
•	город; 
•	район; 
•	место; 
•	координаты; 
•	viewport; 
•	nearby radius; 
•	map item; 
•	distance; 
•	geo reference; 
•	source module. 
Даже если отдельного Geo Service ещё нет, контракты должны быть стабильными, чтобы frontend, SDK и сервисы не зависели от случайных DTO каждого модуля.
________________________________________
Atlas geo data
Сейчас главным источником географической правды остаётся Atlas domain внутри Content Service.
Atlas даёт:
•	countries; 
•	cities; 
•	districts / areas; 
•	places; 
•	coordinates; 
•	categories; 
•	place metadata. 
Другие модули должны ссылаться на Atlas geo data через стабильные идентификаторы, а не создавать собственные параллельные справочники.
Примеры:
•	Pulse event ссылается на city / place. 
•	Rielt listing ссылается на city / district / coordinates. 
•	RF partner ссылается на Atlas place или geo reference. 
•	Quest task ссылается на place / route point. 
•	Guru отображает эти данные в nearby-контексте. 
________________________________________
Current content-service based implementation
В текущей runtime-реальности значительная часть geo-данных обслуживается через Content Service.
Это означает:
•	Atlas geo data живёт в content-service контуре; 
•	nearby/places/events могут запрашиваться через content API; 
•	geo-сценарии пока могут быть частично реализованы поверх content-service; 
•	отдельный Geo Service не является обязательным немедленно. 
Важно:
current implementation может быть content-service based, но архитектурный контракт Geo Layer должен проектироваться так, чтобы в будущем можно было вынести Geo Service без переписывания всей платформы.
________________________________________
8.2. Geo Service target
Роль Geo Service
Geo Service — целевой сервис для зрелой гео-архитектуры Go2Asia.
Он нужен, когда geo-нагрузка и кросс-доменные сценарии станут достаточно сложными:
•	много объектов; 
•	много near-me запросов; 
•	разные слои карты; 
•	Quest routes; 
•	Rielt listings; 
•	RF partners; 
•	Space activity; 
•	contextual Missions; 
•	personalized Guru. 
Geo Service должен быть platform capability, а не владельцем доменных сущностей.
________________________________________
Viewport
Geo Service должен поддерживать viewport-запросы.
Viewport нужен для карты, когда пользователь двигает или масштабирует экран.
Примерные сценарии:
•	получить объекты в текущей области карты; 
•	сгруппировать объекты в кластеры; 
•	ограничить плотность точек; 
•	отдать разные слои карты; 
•	поддержать пагинацию / sampling для тяжёлых зон. 
Viewport API не должен возвращать слишком много данных. Он должен быть оптимизирован для UI-карты.
________________________________________
Nearby
Geo Service должен поддерживать nearby-запросы.
Nearby нужен для сценариев:
•	“что рядом со мной”; 
•	“что в 10 минутах пешком”; 
•	“какие RF-места рядом”; 
•	“какие квестовые точки рядом”; 
•	“есть ли жильё рядом”; 
•	“какие события рядом сегодня”. 
Nearby должен учитывать:
•	координаты; 
•	радиус; 
•	типы объектов; 
•	фильтры; 
•	distance; 
•	optional user context; 
•	source module. 
Guru может использовать nearby как основу пользовательского опыта.
________________________________________
Layers
Geo Service должен поддерживать map layers.
Примеры layers:
•	Atlas places; 
•	Pulse events; 
•	RF partners; 
•	Rielt listings; 
•	Quest points / routes; 
•	Space activity; 
•	PRO nearby; 
•	Missions contextual opportunities. 
Layers позволяют UI включать и выключать разные типы объектов без смешивания доменных моделей.
Важно:
Geo Layer отдаёт гео-представление объекта, а не полную доменную сущность.
Для деталей пользователь должен переходить в доменный модуль.
________________________________________
Indexing / cache
Geo Service должен отвечать за производительность geo-запросов.
Возможные механизмы:
•	spatial indexing; 
•	tile-based cache; 
•	viewport cache; 
•	nearby cache; 
•	source projections; 
•	incremental updates; 
•	invalidation on domain changes. 
Geo Service может хранить производные geo projections, но не должен становиться source of truth.
Если Atlas место изменило координаты, truth остаётся в Atlas, а Geo Service обновляет индекс / projection.
________________________________________
Связи с Guru / Quest / Rielt / Space
Guru
Guru использует Geo Service для:
•	nearby выдачи; 
•	карты; 
•	контекстных слоёв; 
•	персонализации поверх geo-result. 
Guru не должен самостоятельно делать тяжёлый fan-out во все сервисы, если Geo Service уже умеет отдавать кросс-доменные geo layers.
Quest
Quest использует Geo Service для:
•	route points; 
•	task locations; 
•	proximity checks; 
•	map visualization; 
•	future anti-fraud / validation support. 
Quest не должен реализовывать собственный geo-engine внутри себя.
Rielt
Rielt использует Geo Service для:
•	отображения listings на карте; 
•	nearby housing search; 
•	district / city filtering; 
•	geo normalization; 
•	future listing map layers. 
Rielt владеет listing domain, но не должен создавать отдельную параллельную geo-платформу.
Space
Space может использовать Geo Service для:
•	optional location-based posts; 
•	PRO nearby visibility; 
•	activity heatmaps; 
•	city/group geo contexts; 
•	privacy-aware social layers. 
Важно: любые Space geo-сценарии должны учитывать privacy by design. Пользовательская геолокация не должна становиться публичной по умолчанию.
________________________________________
Главный принцип Geo Services
Geo Layer должен давать платформе единую географическую основу, но не захватывать домены.
•	Atlas владеет местами. 
•	Pulse владеет событиями. 
•	RF владеет партнёрами. 
•	Rielt владеет listings. 
•	Quest владеет quests/tasks. 
•	Space владеет social activity. 
•	Geo Service индексирует, агрегирует и отдаёт geo-представления. 
Geo Service — это ускоритель и унификатор гео-доступа, а не “супер-база всех объектов”.

9. Social Services
Social services отвечают за пользовательский контент, социальные связи, реакции, репосты, ленты и асинхронную коммуникацию внутри Go2Asia.
В текущем canon социальный слой Go2Asia не должен развиваться как тяжёлый мессенджер. Его задача — создавать структурированное социальное взаимодействие вокруг объектов экосистемы: постов, мест, событий, партнёров, листингов, квестов и заявок.
________________________________________
9.1. Space Service / Space Backend Contour
Posts
Space backend contour отвечает за пользовательские публикации.
Пост может быть:
•	личной заметкой; 
•	публикацией в группе; 
•	публичным постом; 
•	отзывом; 
•	отчётом о квесте; 
•	репостом с комментарием; 
•	материалом-кандидатом для Blog. 
Space posts могут порождать события для:
•	Feed Service; 
•	Reactions Service; 
•	Blog; 
•	Missions; 
•	Points; 
•	Notifications. 
Space владеет социальным контентом, но не должен владеть экономической логикой, RF-партнёрами, Rielt-листингами или Quest-прогрессом.
________________________________________
Reposts
Репост — важная форма внутреннего распространения контента в Go2Asia.
Репост может быть:
•	простым распространением материала; 
•	репостом с собственным комментарием; 
•	действием, создающим новый Space post; 
•	социальным сигналом для Feed / Blog / Missions. 
Репосты должны быть частью социальной модели Space и Reactions, но не должны становиться отдельным “мессенджерным” механизмом.
________________________________________
Groups
Groups — тематические пространства внутри Space.
Группы могут быть связаны с:
•	городом; 
•	страной; 
•	темой; 
•	интересом; 
•	RF-сообществом; 
•	PRO-кураторством; 
•	квестовой активностью; 
•	локальным комьюнити. 
Группа может содержать посты, участников, правила, модераторов и visibility settings.
________________________________________
Memberships
Memberships отвечают за связь пользователя с группами.
Membership может включать:
•	user_id; 
•	group_id; 
•	role внутри группы; 
•	status; 
•	joined_at; 
•	notification preferences; 
•	visibility rules. 
Групповые роли не должны автоматически совпадать с глобальными ролями пользователя. Например, PRO может быть обычным участником одной группы и модератором другой.
________________________________________
Profile projections
Space может хранить social profile projection — социальное представление пользователя.
Оно может включать:
•	display name; 
•	avatar reference; 
•	public bio; 
•	PRO/VIP badge projection; 
•	social metrics; 
•	pinned posts; 
•	group participation; 
•	visibility preferences. 
Но Space не должен быть владельцем identity. Базовая identity и роли приходят из Auth / User layer.
________________________________________
Current status
Текущий статус Space:
•	backend-контур уже зафиксирован; 
•	часть социальной модели существует или спроектирована; 
•	frontend ещё требует дальнейшего возврата и продуктовой доработки; 
•	Space не должен расширяться в сторону полноценного мессенджера; 
•	Space должен стать источником UGC, social activity и событий для Blog / Missions / Points. 
________________________________________
9.2. Feed Service
Ленты
Feed Service отвечает за формирование пользовательских и групповых лент.
Возможные типы лент:
•	home feed; 
•	profile feed; 
•	group feed; 
•	liked / saved feed; 
•	friends feed; 
•	activity feed; 
•	curated feed. 
Feed Service не должен владеть содержанием постов как source of truth. Он формирует выдачу и может хранить проекции для быстрого чтения.
________________________________________
Aggregation
Feed Service агрегирует контент из разных источников социального слоя:
•	posts; 
•	reposts; 
•	group posts; 
•	followed users; 
•	liked / saved content; 
•	recommended content; 
•	future mission-related activity. 
Aggregation должна учитывать:
•	права видимости; 
•	privacy; 
•	group membership; 
•	user relationships; 
•	moderation status; 
•	deleted / hidden content. 
________________________________________
Ranking baseline
На раннем этапе ranking должен быть простым и предсказуемым.
Базовые факторы:
•	дата публикации; 
•	принадлежность к группе; 
•	автор; 
•	реакции; 
•	репосты; 
•	relevance к пользователю; 
•	moderation status. 
Не нужно преждевременно строить сложную ML-ленту.
Рекомендация:
сначала chronological / rule-based ranking, затем optional Recommendation Service.
________________________________________
9.3. Reactions Service
Likes
Reactions Service владеет лайками как отдельными interaction records.
Like должен быть:
•	idempotent; 
•	привязан к target object; 
•	привязан к user_id; 
•	защищён от дублей; 
•	пригоден для summary counters. 
Лайки могут порождать события для Feed, Missions, Points и Notifications, но сами не должны начислять Points напрямую.
________________________________________
Reposts
Repost может рассматриваться как reaction type и/или как Space post, если пользователь добавляет комментарий.
Правило:
•	Reactions Service фиксирует interaction; 
•	Space создаёт новый post, если нужен repost-with-comment; 
•	Feed распространяет результат. 
Это не должно превращаться в дублирование ownership.
________________________________________
Reviews
Reviews могут быть реализованы как structured reactions:
•	short_review; 
•	rating; 
•	feedback. 
Отзывы могут быть привязаны к:
•	месту; 
•	RF-партнёру; 
•	Rielt listing; 
•	событию; 
•	квесту; 
•	Blog article. 
Reactions Service хранит interaction, а доменный сервис может использовать aggregate / summary для отображения.
________________________________________
Questions
Question — объектно-привязанный вопрос.
Примеры:
•	вопрос организатору события; 
•	вопрос по листингу; 
•	вопрос партнёру; 
•	вопрос автору поста; 
•	вопрос по квесту. 
Question может создавать Thread / Inquiry.
________________________________________
Contact requests
Contact request — структурированный запрос на контакт или связь.
Примеры:
•	пользователь хочет связаться с владельцем жилья; 
•	пользователь хочет уточнить условия у партнёра; 
•	участник хочет задать вопрос организатору; 
•	клиент хочет начать inquiry. 
Contact request не должен открывать полноценный чат по умолчанию. Он должен создавать controlled asynchronous thread.
________________________________________
Thread replies
Thread reply — ответ внутри асинхронной ветки общения.
Он может быть представлен как reaction type с thread_id или как отдельная запись в Thread model.
Важно:
•	thread reply привязан к конкретному объекту или inquiry; 
•	участники ограничены контекстом; 
•	уведомления отправляет Notification Service; 
•	real-time chat не требуется. 
________________________________________
9.4. Thread / Inquiry Model
Asynchronous threads
Thread / Inquiry Model — лёгкая модель асинхронного общения, привязанного к объекту.
Thread может возникать из:
•	question; 
•	contact request; 
•	booking / listing inquiry; 
•	event inquiry; 
•	partner inquiry; 
•	support-like object-bound request. 
Thread содержит:
•	thread_id; 
•	target_type; 
•	target_id; 
•	participants; 
•	status; 
•	messages / replies; 
•	created_at; 
•	updated_at; 
•	moderation flags. 
________________________________________
No real-time messenger
В текущем canon Go2Asia не строит полноценный real-time messenger.
Это значит:
•	нет обязательных WebSocket-сценариев; 
•	нет универсального личного чата; 
•	нет групповых чатов как ядра продукта; 
•	нет попытки конкурировать с Telegram / WeChat. 
Коммуникация должна быть:
•	объектно-привязанной; 
•	асинхронной; 
•	контролируемой; 
•	простой для модерации; 
•	понятной юридически и продуктово. 
________________________________________
Связь с Notification
Thread / Inquiry Model тесно связан с Notification Service.
Notification Service должен уведомлять участников о:
•	новом вопросе; 
•	новом contact request; 
•	новом ответе в thread; 
•	изменении статуса inquiry; 
•	закрытии или решении вопроса; 
•	action required. 
На раннем этапе уведомления могут быть простыми: email / in-app / push later.
Главное:
Thread хранит контекст общения, Notification доставляет сигнал пользователю.
________________________________________
Главный принцип Social Services
Social services должны создавать живой пользовательский слой Go2Asia, но без захвата бизнесовых, экономических и квестовых доменов.
•	Space владеет социальным контентом. 
•	Feed формирует ленты. 
•	Reactions фиксируют interaction. 
•	Threads дают controlled asynchronous communication. 
•	Notification сообщает пользователю о важных изменениях. 
Этот слой должен быть лёгким, расширяемым и безопасным для модерации.

10. Business / Commerce Services
Business / Commerce services отвечают за бизнесовый слой Go2Asia: партнёров, предложения, ваучеры, жильё, заявки и связи между пользователями, бизнесом и PRO-кураторами.
Главное правило этого слоя:
RF и Rielt могут быть связаны, но не должны сливаться в один домен.
________________________________________
10.1. RF Service
Partners
RF Service владеет партнёрами Russian Friendly.
Partner — это бизнесовая сущность, например:
•	кафе; 
•	ресторан; 
•	отель; 
•	апарт-комплекс; 
•	агентство; 
•	локальный сервис; 
•	экскурсионный проект; 
•	коворкинг; 
•	медицинский / бытовой / туристический сервис. 
RF Partner может быть связан с Atlas place или Geo reference, но RF Service владеет именно партнёрским статусом и бизнесовыми атрибутами.
________________________________________
Partner profiles
Partner profile может включать:
•	partner_id; 
•	business name; 
•	category; 
•	description; 
•	contact data; 
•	geo reference; 
•	linked Atlas place; 
•	media references; 
•	Russian Friendly status; 
•	verification status; 
•	owner account; 
•	PRO curator; 
•	active offers; 
•	metrics summary. 
Важно:
RF profile не должен дублировать весь Atlas place.
Он расширяет место бизнесовыми и партнёрскими данными.
________________________________________
Offers
Offer — это предложение партнёра пользователям Go2Asia.
Offer может быть:
•	скидкой; 
•	бонусом; 
•	специальным меню; 
•	подарком; 
•	premium offer; 
•	seasonal offer; 
•	campaign offer. 
Offer принадлежит RF Service / RF domain и может использоваться:
•	в Guru; 
•	в Quest; 
•	в Missions; 
•	в Business Console; 
•	в PRO Console. 
________________________________________
Vouchers
Voucher — конкретная пользовательская активация offer.
Связка:
•	Partner создаёт offer. 
•	Пользователь claim-ит voucher. 
•	Partner или система redeem-ит voucher. 
•	RF сохраняет usage status. 
•	Economy / Missions могут получить событие. 
Важно:
Voucher — часть RF / Offers domain, а не часть Quest или Connect.
Quest может использовать voucher как награду или шаг, но не должен владеть voucher lifecycle.
________________________________________
PRO links
RF Service владеет связями PRO ↔ Partner.
PRO link может отражать:
•	кто привёл партнёра; 
•	кто курирует партнёра; 
•	кто помогает с профилем; 
•	кто отвечает за offers; 
•	кто получает reward eligibility; 
•	статус связи; 
•	период активности; 
•	performance metrics. 
Это важно для будущей экономики и PRO Missions.
________________________________________
Boundaries
RF Service владеет:
•	партнёрами; 
•	партнёрскими профилями; 
•	offers; 
•	vouchers; 
•	PRO links; 
•	RF status; 
•	partner metrics; 
•	business lifecycle. 
RF Service не владеет:
•	Atlas places; 
•	Rielt listings; 
•	Quest tasks; 
•	Points ledger; 
•	Missions progress; 
•	Space posts; 
•	full booking/payment flow. 
RF может ссылаться на соседние домены, но не должен захватывать их ownership.
________________________________________
10.2. Voucher / Offers Logic
Claim
Claim — пользователь получает voucher на основе offer.
Claim-сценарий может начинаться из:
•	Guru; 
•	RF page; 
•	Quest; 
•	Mission; 
•	Business campaign; 
•	PRO recommendation. 
При claim система должна зафиксировать:
•	user_id; 
•	offer_id; 
•	partner_id; 
•	voucher_id; 
•	claim timestamp; 
•	expiration; 
•	status; 
•	limits; 
•	source context. 
Claim не обязательно означает использование. Это только получение права на использование.
________________________________________
Redeem
Redeem — подтверждённое использование voucher.
Redeem может происходить:
•	партнёром в Business Console; 
•	через QR / code; 
•	через ручное подтверждение; 
•	через будущую POS-интеграцию; 
•	через admin verification. 
Redeem должен быть:
•	idempotent; 
•	защищён от повторного использования; 
•	связан с user_id; 
•	связан с partner_id; 
•	связан с offer_id; 
•	пригоден для analytics; 
•	пригоден для Missions / Points events. 
________________________________________
Usage tracking
Voucher / Offers logic должна отслеживать:
•	сколько раз offer просмотрен; 
•	сколько vouchers claimed; 
•	сколько redeemed; 
•	conversion rate; 
•	source; 
•	partner performance; 
•	PRO contribution; 
•	campaign period; 
•	abuse signals. 
Эти данные нужны для:
•	Business Console; 
•	PRO Console; 
•	RF analytics; 
•	Missions; 
•	future rewards; 
•	partner retention. 
________________________________________
RF ownership
Voucher / Offers logic должна принадлежать RF domain.
Это означает:
•	RF управляет offer lifecycle; 
•	RF управляет voucher claim/redeem; 
•	RF хранит partner-facing статистику; 
•	RF решает, какие партнёры могут выпускать offers. 
Другие модули могут использовать voucher, но не владеть им:
•	Guru показывает voucher. 
•	Quest может включать voucher в сценарий. 
•	Missions может создать цель “используй первый voucher”. 
•	Points может выдать награду после подтверждённого redeem. 
•	Connect показывает результат. 
________________________________________
10.3. Rielt Service
Роль
Rielt Service — это curated discovery layer для жилья, встроенный в RF + Voucher экономику.
Это не marketplace и не booking-сервис.
________________________________________
Listings
Rielt владеет:
•	listing_id 
•	описание объекта 
•	тип жилья 
•	цена (информативно) 
•	geo references (через Atlas) 
•	media references 
•	amenities 
•	статус 
•	partner_id 
•	branch_id 
•	pro_id 
•	связка с offers / vouchers 
Важно:
Listing — это представление объекта партнёра, а не самостоятельный объект рынка.
________________________________________
Inquiry (уточнение)
Rielt не является владельцем канонического inquiry flow.
Вместо этого:
•	Rielt может отображать interest / intent 
•	может инициировать CTA 
•	может создавать secondary inquiry record (optional) 
Но:
Primary inquiry = voucher claim в RF / Voucher layer
После claim:
•	создаётся структурированный сигнал 
•	Notification информирует участников 
•	Thread может использоваться для координации 
________________________________________
Geo / media references
Geo
Rielt использует:
•	atlas_place_id 
•	city_id 
•	district_id 
•	coordinates 
Rielt не создаёт собственную географию.
________________________________________
Media
Rielt использует:
•	hero_media_key 
•	gallery_media_keys 
•	media references через общий media pipeline 
Никаких локальных файлов или хаотичных URL.
________________________________________
V1 ограничения
В v1 Rielt должен оставаться минимальным и чистым:
Не включать:
•	❌ booking engine 
•	❌ payments 
•	❌ escrow 
•	❌ contracts 
•	❌ CRM 
•	❌ real-time chat 
•	❌ negotiation workflow 
Разрешено:
•	listing discovery 
•	filters / search 
•	partner / PRO trust signals 
•	voucher CTA 
•	minimal inquiry surface (secondary) 
________________________________________
UX следствие
Основной CTA:
•	“Получить ваучер” 
•	“Активировать предложение” 
•	“Получить VIP-бонус” 
Не:
•	“Написать владельцу” 
•	“Оставить заявку” 
________________________________________
Главная формула Rielt
Rielt = discovery layer → Voucher = commerce layer → RF = partner layer
Rielt:
•	не продаёт жильё 
•	не ведёт сделку 
•	не управляет коммуникацией 
Он:
помогает пользователю найти жильё и перейти в voucher-first экономику Go2Asia
________________________________________
10.4. Итоговая модель слоя
Компонент	Роль
RF	partner layer
Voucher	commerce baseline
Rielt	discovery layer
PRO	trust / mediation layer
Atlas	geo layer
Media	asset layer
Guru	aggregation layer
Space	social layer
Notification	communication layer
Points / Token	economy layer
________________________________________
Главный вывод
Business / Commerce слой Go2Asia:
•	не строится как классический marketplace; 
•	не начинается с чата или заявки; 
•	не требует сложной сделки на старте; 
Он строится вокруг:
voucher-driven consumption внутри доверительной PRO-экосистемы.

Главный принцип Business / Commerce Services
Business / Commerce layer должен связывать пользователей с реальными коммерческими сценариями, но без преждевременного усложнения.
•	RF отвечает за партнёров, offers, vouchers и PRO-связи. 
•	Rielt отвечает за жильё, listings и inquiries. 
•	Voucher lifecycle принадлежит RF. 
•	Payments / booking / CRM остаются future layer. 
•	Economy получает события, но не владеет бизнес-доменами.

11. Quest / Experience Services
Quest / Experience services отвечают за квесты, маршруты, задачи, proof-сценарии и пользовательский опыт прохождения. Это слой, который превращает географию, события, партнёров и контент Go2Asia в интерактивные сценарии.
Главное правило:
Quest = experience layer.
Quest не владеет общей системой Missions, Points ledger или бизнес-доменами.
________________________________________
11.1. Quest Service
Quests
Quest Service владеет квестами как самостоятельными experience-сущностями.
Quest может включать:
•	quest_id; 
•	title; 
•	description; 
•	city / country; 
•	category; 
•	difficulty; 
•	estimated duration; 
•	route model; 
•	tasks; 
•	media; 
•	rewards metadata; 
•	creator / PRO reference; 
•	status; 
•	moderation state. 
Quest может быть:
•	городским маршрутом; 
•	гастро-сценарием; 
•	культурным маршрутом; 
•	RF-партнёрским сценарием; 
•	event-based квестом; 
•	seasonal challenge; 
•	PRO-authored experience. 
________________________________________
Routes
Route — структура прохождения квеста.
Она может включать:
•	последовательность точек; 
•	карту; 
•	distance / walking time; 
•	optional order; 
•	required / optional stops; 
•	связь с Geo Layer; 
•	route preview. 
Quest не должен сам владеть географией. Он хранит references на Atlas / Geo / RF / Pulse объекты.
________________________________________
Tasks
Task — локальное задание внутри Quest.
Task заменяет старый термин “mission inside quest”.
Task может быть:
•	visit task; 
•	check-in task; 
•	photo task; 
•	quiz task; 
•	QR task; 
•	review task; 
•	voucher task; 
•	event attendance task. 
Task принадлежит Quest Service и существует только в контексте конкретного квеста.
Важно:
Quest Task ≠ Ecosystem Mission.
________________________________________
Proof
Proof — подтверждение выполнения task.
Proof может включать:
•	фото; 
•	QR / code; 
•	GPS proximity; 
•	user submission; 
•	short answer; 
•	partner confirmation; 
•	PRO moderation; 
•	system event. 
Quest Service должен хранить proof references и статус проверки.
Медиа proof не должны храниться как файлы внутри Quest Service. Quest должен использовать общий media pipeline.
________________________________________
Progress
Quest Service владеет прогрессом пользователя внутри квеста.
Progress может включать:
•	user_id; 
•	quest_id; 
•	current task; 
•	completed tasks; 
•	proof statuses; 
•	started_at; 
•	completed_at; 
•	failed / abandoned state; 
•	progress percentage. 
Progress внутри Quest относится только к квесту.
Он не заменяет Mission progress в Missions Service.
________________________________________
Validation
Validation — проверка выполнения task.
Она может быть:
•	automatic; 
•	manual; 
•	PRO-assisted; 
•	partner-assisted; 
•	admin-assisted. 
Примеры:
•	GPS проверка: пользователь рядом с точкой; 
•	QR проверка: код совпал; 
•	фото проверка: PRO подтверждает; 
•	event attendance: подтверждение участия; 
•	voucher redeem: событие из RF/Voucher layer. 
Quest Service должен валидировать только quest-specific conditions. Он не должен проверять глобальные Missions или экономические награды.
________________________________________
Completion
Completion — завершение квеста.
Когда условия выполнены:
1.	Quest Service фиксирует quest_completed. 
2.	Создаёт completion record. 
3.	Отправляет доменное событие. 
4.	Передаёт reward handoff в Economy Layer. 
5.	Может инициировать социальный сценарий: отчёт, репост, публикация в Space. 
Completion не должен напрямую менять Points balance.
________________________________________
11.2. Quest Integration Boundaries
Atlas / RF / Pulse references
Quest может использовать внешние доменные сущности через references.
Atlas
Используется для:
•	places; 
•	cities; 
•	districts; 
•	маршрутов; 
•	точек; 
•	описаний мест. 
Quest хранит atlas_place_id, но не копирует Atlas truth.
RF
Используется для:
•	партнёрских точек; 
•	voucher tasks; 
•	RF offers; 
•	trust signals; 
•	PRO-linked сценариев. 
Quest может использовать RF places / branches / offers, но не владеет партнёрами или ваучерами.
Pulse
Используется для:
•	event-based tasks; 
•	посещения события; 
•	событийных маршрутов; 
•	seasonal quests. 
Quest может ссылаться на Pulse event, но не владеет event domain.
________________________________________
Points / Badges reward handoff
Quest может быть источником reward events, но не владельцем экономики.
Правильный flow:
quest_completed → reward handoff → Points / Badges / Missions / Economy Layer
Quest может сообщить:
•	кто завершил квест; 
•	какой квест; 
•	какие tasks завершены; 
•	какие условия выполнены; 
•	какой reward profile ожидается. 
Но исполнение наград делают:
•	Points Service; 
•	Badges / NFT layer; 
•	Missions Service, если completion закрывает ecosystem Mission; 
•	Token Service в future layer. 
Quest не должен:
•	начислять Points напрямую; 
•	менять ledger; 
•	выдавать badges напрямую, если это не его доменная ответственность; 
•	управлять referral rewards; 
•	исполнять G2A rewards. 
________________________________________
No ecosystem Missions inside Quest
Это критическое правило.
Внутри Quest используются:
Tasks
А в экосистеме используются:
Missions
Quest Task — это шаг внутри конкретного квеста.
Ecosystem Mission — это надэкосистемная цель пользователя, которая может использовать completion квеста как одно из условий.
Пример:
•	Quest Task: “Сделай фото у храма”. 
•	Ecosystem Mission: “Пройди первый квест на Пхукете”. 
Quest может отправить событие quest_completed, а Missions Service уже решит, закрывает ли это какую-то Mission.
________________________________________
Главный принцип Quest / Experience Services
Quest должен быть сильным experience layer, но не “супер-сервисом”.
Он может соединять:
•	Atlas; 
•	RF; 
•	Pulse; 
•	Geo; 
•	Space; 
•	Points; 
•	Badges; 
•	Missions. 
Но только через явные references, события и reward handoff.
Quest владеет:
•	quests; 
•	routes; 
•	tasks; 
•	proof; 
•	progress; 
•	validation; 
•	completion. 
Quest не владеет:
•	Atlas places; 
•	RF partners; 
•	vouchers; 
•	Pulse events; 
•	Points ledger; 
•	ecosystem Missions; 
•	Space posts; 
•	Tokenomics.

12. Economy / Gamification Services
Economy / Gamification services отвечают за внутреннюю мотивацию, награды, прогресс, реферальную механику, достижения и будущую tokenomics-модель Go2Asia.
Главный принцип этого слоя:
Off-chain first, on-chain later.
Сначала Points, Referral, Badges и Missions. Только позже — G2A, on-chain NFT и Blockchain Gateway.
________________________________________
12.1. Points Service
Ledger
Points Service владеет ledger-логикой внутренней Points-экономики.
Ledger должен хранить:
•	кто получил / потратил Points; 
•	за какое действие; 
•	на основании какого события; 
•	какой сервис инициировал reward; 
•	когда произошла операция; 
•	уникальный idempotency key. 
Ledger — это источник истины по internal Points movement where runtime-backed. It is not a financial ledger, payout ledger, partner settlement ledger, or future ledger implementation approval.
________________________________________
Balances
Points Service владеет балансами пользователей.
Баланс должен вычисляться или поддерживаться на основе ledger.
Другие сервисы не должны самостоятельно менять Points balance.
________________________________________
Transactions
Transaction — запись изменения Points.
Типы:
•	начисление; 
•	списание; 
•	корректировка; 
•	rollback / compensation; 
•	pending / confirmed transaction, если понадобится. 
Transaction должна быть пригодна для:
•	отображения в Connect; 
•	аудита; 
•	антифрода; 
•	dispute review; 
•	аналитики экономики. 
________________________________________
Idempotency
Все операции начисления / списания должны быть idempotent.
Это критично, потому что события могут приходить повторно.
Пример:
•	quest_completed пришёл дважды; 
•	voucher_redeemed повторно отправлен после retry; 
•	mission_completed обработан повторно. 
Points Service должен гарантировать:
одно событие = одна экономическая операция.
________________________________________
Reward execution
Points Service исполняет reward intents.
Например:
•	Missions Service создаёт reward intent; 
•	Quest Service отправляет completion event; 
•	RF/Voucher layer отправляет voucher redeemed event; 
•	Referral Service отправляет referral activation event. 
Points Service проверяет правила и создаёт ledger transaction.
Важно:
Points Service исполняет internal Points rewards where runtime-backed, но не является владельцем всех доменных событий. Reward intent or event language is not a ledger write by itself and does not activate new reward producers.
________________________________________
12.2. Referral Service
Codes
Referral Service владеет реферальными кодами и ссылками.
Он отвечает за:
•	генерацию кодов; 
•	уникальность; 
•	связь кода с пользователем; 
•	статус кода; 
•	срок действия, если нужен. 
________________________________________
Graph
Referral Service владеет referral graph.
Graph отражает:
•	кто кого пригласил; 
•	прямых рефералов; 
•	субрефералов, если модель это поддерживает; 
•	depth limits; 
•	activation status; 
•	связь с VIP / PRO reward eligibility. 
Referral graph не должен храниться в Connect или Points.
________________________________________
Referral participation summaries
Referral Service может считать или готовить referral participation / reward eligibility summary, но фактические Points-транзакции должны исполняться через Points Service where runtime-backed.
Правильная модель:
•	Referral Service знает, кто имеет право на бонус; 
•	Points Service исполняет начисление. 
Эта модель не является income, commission, passive earnings, MLM, payout, or partner settlement.
________________________________________
Activation events
Referral Service должен порождать события:
•	referral_registered; 
•	referral_activated; 
•	referral_became_vip; 
•	referral_purchase_triggered; 
•	subreferral_activated. 
Эти события могут использоваться:
•	Points Service; 
•	Missions Service; 
•	Connect UI; 
•	Analytics; 
•	Notifications. 
________________________________________
12.3. Missions Service Target
Catalog
Missions Service — future target service для надэкосистемных пользовательских целей.
Mission catalog должен хранить:
•	mission_id; 
•	title; 
•	description; 
•	type; 
•	target role; 
•	scope; 
•	visibility; 
•	priority; 
•	status; 
•	rewards metadata. 
Типы missions:
•	onboarding; 
•	social; 
•	referral; 
•	RF; 
•	Rielt; 
•	Quest-related; 
•	PRO; 
•	business; 
•	seasonal. 
________________________________________
Conditions
Mission conditions описывают, что должно произойти для прогресса или completion.
Примеры:
•	пользователь заполнил профиль; 
•	пользователь опубликовал пост; 
•	пользователь получил 5 реакций; 
•	пользователь пригласил друга; 
•	пользователь claim-нул voucher; 
•	пользователь redeemed voucher; 
•	пользователь завершил Quest; 
•	PRO подключил партнёра; 
•	партнёр создал первый offer. 
Missions Service не должен сам проверять реальность действия. Он должен слушать подтверждённые события от доменных сервисов.
________________________________________
User progress
Missions Service владеет user mission progress.
Progress может включать:
•	user_id; 
•	mission_id; 
•	status; 
•	current value; 
•	required value; 
•	started_at; 
•	completed_at; 
•	reward status. 
Progress в Missions не равен Quest progress.
________________________________________
Reward intents
После completion Missions Service создаёт reward intent.
Reward intent может означать:
•	начислить Points; 
•	выдать Badge; 
•	открыть доступ; 
•	активировать multiplier; 
•	инициировать future token eligibility only if separately activated.
Но Missions Service не исполняет награду напрямую.
Правильная схема:
mission_completed → reward_intent_created → Points / Badges where runtime-backed; Token/G2A only as future layer
Reward intent is semantic/orchestration vocabulary. It is not payout, settlement, token withdrawal, or reward producer activation by itself.
________________________________________
Chains / personalization future
В будущем Missions Service может поддерживать:
•	mission chains; 
•	tracks; 
•	journeys; 
•	role-based missions; 
•	geo/contextual missions; 
•	personalized missions; 
•	Guru-driven missions; 
•	RF / PRO / Business missions; 
•	seasonal campaigns. 
Но MVP Missions должен быть ограниченным:
•	onboarding; 
•	referral; 
•	basic social; 
•	RF/voucher baseline later. 
________________________________________
12.4. Badges / NFT Layer
Off-chain badges now / future
Badges — достижения и статусные отметки пользователя.
На ближнем этапе badges должны быть off-chain.
Badge может отражать:
•	completed quest; 
•	first voucher redeemed; 
•	first post; 
•	referral milestone; 
•	PRO achievement; 
•	RF partner milestone; 
•	business milestone; 
•	mission chain completion. 
Badges могут отображаться в:
•	Connect; 
•	Space profile; 
•	PRO Console; 
•	Business Console; 
•	Quest completion UI. 
________________________________________
NFT later
NFT — future extension badges layer.
Не каждый badge должен быть NFT.
On-chain NFT должны появляться только если есть:
•	продуктовая необходимость; 
•	юридическая готовность; 
•	tokenomics model; 
•	Blockchain Gateway; 
•	metadata strategy; 
•	audit / compliance. 
________________________________________
Separation from Points
Badges / NFT layer должен быть отделён от Points.
Points = количественная внутренняя единица.
Badges = статус / достижение / репутационный маркер.
Одна и та же активность может создавать:
•	Points transaction; 
•	Badge assignment; 
•	Mission completion; 
•	Notification. 
Но ownership должен быть разделён.
________________________________________
12.5. Token Service
Future off-chain G2A
Token Service — future service для off-chain G2A/tokenomics.
Он может отвечать за:
•	future off-chain G2A projections;
•	future token reward accounting;
•	future conversion rules;
•	future externalization / withdrawal review requests if separately activated;
•	economic limits; 
•	audit; 
•	compliance status. 
Token Service не должен подменять Points Service.
Points — ближняя внутренняя экономика.
G2A — будущий tokenomics layer.
This section does not activate G2A, token conversion, withdrawal, liquidity, external wallet, payout, settlement, or investment semantics.
________________________________________
Not Connect Service
Token Service не является Connect Service.
Connect — UI-хаб.
Token Service — backend service для будущей tokenomics-логики.
Нельзя использовать формулировку “Token / Connect Service” как единый домен, потому что это снова смешивает UI и экономический backend.
________________________________________
Legal / compliance dependency
Token Service должен зависеть не только от технической готовности, но и от юридической модели.
До запуска G2A нужны:
•	правовой анализ; 
•	tokenomics policy; 
•	limits; 
•	user eligibility; 
•	compliance rules; 
•	jurisdiction strategy; 
•	audit model; 
•	risk controls. 
Поэтому Token Service — future layer, а не обязательный MVP-компонент.
________________________________________
12.6. Blockchain Gateway
Future on-chain gateway
Blockchain Gateway — future service для on-chain операций.
Он нужен только тогда, когда Go2Asia реально включает:
•	G2A on-chain; 
•	on-chain NFT; 
•	external wallets; 
•	blockchain transactions. 
________________________________________
TON
Целевой блокчейн-контур рассматривается через TON.
Blockchain Gateway может отвечать за:
•	future wallet linking if separately activated;
•	future wallet verification if separately activated;
•	transaction submission; 
•	transaction status; 
•	chain event monitoring; 
•	reconciliation. 
________________________________________
Mint / burn / transfer
Gateway may later perform technical operations after separate activation:
•	mint; 
•	burn; 
•	transfer; 
•	NFT mint; 
•	NFT upgrade, если применимо; 
•	transaction status polling. 
Но он не должен решать, кому и сколько выдавать.
Эти решения приходят из Token / NFT layer.
________________________________________
Isolated keys
Blockchain Gateway — единственный сервис, который потенциально работает с приватными ключами.
Поэтому обязательны:
•	isolated key management; 
•	secret storage; 
•	strict internal access; 
•	no public API; 
•	audit logs; 
•	limits; 
•	mTLS / service auth; 
•	operational controls. 
Принцип:
Token Service решает. Blockchain Gateway исполняет.
Gateway не знает бизнес-логики и не владеет экономикой.
All wallet, mint, burn, transfer and reconciliation wording in this section is future-only and does not authorize current on-chain runtime.
________________________________________
Главный принцип Economy / Gamification Services
Economy / Gamification layer должен быть мощным, но не преждевременно криптовым.
Ближняя экономика:
•	Points; 
•	Referral; 
•	Badges; 
•	Missions; 
•	reward intents; 
•	internal ledger. 
Будущая экономика:
•	G2A; 
•	Token Service; 
•	Blockchain Gateway; 
•	on-chain NFT. 
Connect показывает результат пользователю, но не владеет логикой этого слоя.

13. Connect Backend Position
Connect Asia занимает особое место в архитектуре Go2Asia: для пользователя это центр экономики, прогресса и достижений, но с backend-точки зрения Connect не является самостоятельным доменным сервисом.
Главное правило:
Connect = UI / product hub, not domain backend service.
________________________________________
13.1. Connect is UI / Product Hub
Connect Asia — это пользовательская витрина экономики и мотивации.
Connect показывает:
•	read-only Points summary / projection;
•	историю начислений; 
•	реферальную статистику; 
•	активные Missions; 
•	прогресс Missions; 
•	Badges; 
•	Quest rewards; 
•	voucher-related activity; 
•	future G2A / NFT; 
•	общий статус пользователя в экосистеме. 
Для пользователя Connect выглядит как единый центр:
“мой прогресс, мои награды, мои достижения, моя экономика”.
Но это не означает, что Connect владеет всей этой логикой.
________________________________________
13.2. No Connect Service Now
На текущем этапе не нужно создавать отдельный Connect Service.
Connect не должен владеть:
•	Points ledger; 
•	balances; 
•	referral graph; 
•	missions progress; 
•	reward intents; 
•	badge assignment; 
•	voucher lifecycle; 
•	tokenomics; 
•	blockchain operations. 
Этими зонами владеют профильные сервисы:
•	Points Service; 
•	Referral Service; 
•	Missions Service; 
•	Badges / NFT layer; 
•	RF / Voucher layer; 
•	Token Service; 
•	Blockchain Gateway. 
Если сейчас создать Connect Service как доменный сервис, он почти неизбежно начнёт дублировать чужую логику и станет “скрытым монолитом экономики”.
________________________________________
13.3. Possible Connect BFF Later
В будущем может появиться Connect BFF / Connect Dashboard Service, но только как технический read/composition layer.
Он может понадобиться, если frontend Connect станет слишком тяжело собирать данные из разных сервисов.
Connect BFF может:
•	агрегировать dashboard summary; 
•	кешировать read model; 
•	сокращать количество frontend-запросов; 
•	объединять Points / Referral / Missions / Badges / Token summary; 
•	отдавать UI-friendly response. 
Но Connect BFF не должен:
•	начислять Points; 
•	менять ledger; 
•	управлять referral graph; 
•	создавать Missions; 
•	исполнять reward intents; 
•	владеть tokenomics; 
•	выполнять blockchain operations. 
Правило:
Connect BFF может читать и собирать, но не должен владеть и решать.
________________________________________
13.4. What Connect Reads From Services
Connect UI должен читать данные из профильных сервисов.
From Points Service
•	current internal Points projection;
•	transaction history; 
•	pending internal reward status;
•	spending history; 
•	internal reward processing status.
From Referral Service
•	referral code; 
•	referral link; 
•	direct referrals; 
•	subreferrals, если поддерживаются; 
•	activation status; 
•	referral participation / reward eligibility summary.
From Missions Service
•	active missions; 
•	available missions; 
•	completed missions; 
•	mission progress; 
•	mission chains; 
•	reward intent status. 
From Badges / NFT Layer
•	earned badges; 
•	badge progress; 
•	badge metadata; 
•	badge levels; 
•	future NFT status. 
From RF / Voucher Layer
•	active vouchers; 
•	claimed vouchers; 
•	redeemed vouchers; 
•	voucher-related rewards; 
•	partner offers history. 
From Quest Service
•	completed quests; 
•	active quest progress; 
•	rewards earned from quests; 
•	quest completion status. 
From Token Service Future
•	future G2A/token projection;
•	future externalization / withdrawal review status if separately activated;
•	token transaction status; 
•	conversion status. 
From Blockchain Gateway Future
Connect не должен обращаться к Blockchain Gateway напрямую.
Если нужно показать blockchain status, данные должны идти через Token / NFT layer.
________________________________________
13.5. Connect as User Mental Model
Хотя backend-логика распределена, пользователю не нужно понимать эту сложность.
Для пользователя Connect должен выглядеть как единое пространство:
•	“я заработал Points”; 
•	“я выполнил Mission”; 
•	“я получил Badge”; 
•	“я пригласил друга”; 
•	“я использовал voucher”; 
•	“я прошёл Quest”; 
•	“я продвинулся к следующему уровню”. 
Connect переводит распределённую backend-архитектуру в понятную пользовательскую картину.
________________________________________
13.6. Главный принцип Connect
Connect не является владельцем экономики.
Он является:
•	dashboard; 
•	progress hub; 
•	rewards surface; 
•	motivation interface; 
•	UI aggregator. 
Формула:
Points считает. Referral связывает. Missions направляет. Badges отмечают. Tokenomics расширяет. Connect показывает.

14. Notification and Communication Services
Notification and communication services отвечают за доставку важных сигналов пользователю и за структурированную коммуникацию внутри Go2Asia.
Главный принцип:
Go2Asia не строит классический мессенджер.
Коммуникация строится через reactions, object-bound threads, notifications и structured actions.
________________________________________
14.1. Notification Service Target
Роль
Notification Service — целевой сервис уведомлений Go2Asia.
Он должен централизованно доставлять пользователю сигналы о важных событиях:
•	новые реакции; 
•	ответы в threads; 
•	claim / redeem ваучера; 
•	изменения по listing / offer; 
•	завершение Quest; 
•	выполнение Mission; 
•	начисление Points; 
•	получение Badge; 
•	действия рефералов; 
•	события от PRO / партнёра; 
•	системные уведомления. 
Notification Service не должен владеть доменной логикой. Он получает событие и доставляет уведомление по правилам канала, шаблона и пользовательских предпочтений.
________________________________________
Email
Email нужен для:
•	регистрации / подтверждения аккаунта; 
•	важных системных уведомлений; 
•	voucher claim / redeem confirmation; 
•	listing / partner follow-up; 
•	security events; 
•	transactional messages; 
•	weekly / monthly digests later. 
Email должен использоваться аккуратно, чтобы не превратиться в спам-канал.
________________________________________
Push
Push-уведомления нужны для быстрых пользовательских сигналов:
•	новый ответ в thread; 
•	срочный voucher claim; 
•	near-now / on-site сценарий; 
•	завершение Mission; 
•	начисление награды; 
•	событие рядом; 
•	important PRO / partner response. 
Push особенно важен для mobile-first сценариев, но должен уважать настройки пользователя.
________________________________________
Telegram later
Telegram может быть подключён позже как дополнительный канал.
Возможные сценарии:
•	уведомления PRO; 
•	уведомления Business Partner; 
•	срочные сигналы по voucher claim; 
•	служебные alerts; 
•	удобный канал для русскоязычной аудитории. 
Но Telegram не должен становиться главным communication backbone на раннем этапе. Основной canon остаётся внутри Go2Asia: notifications + threads.
________________________________________
Internal notification feed
Внутренняя notification feed может стать частью User Cabinet / Connect / Space.
Она нужна, чтобы пользователь видел историю событий:
•	кто отреагировал; 
•	кто ответил; 
•	какой voucher активирован; 
•	какая Mission завершена; 
•	сколько Points начислено; 
•	какой Badge получен; 
•	какие действия требуют внимания. 
Internal feed полезен тем, что не зависит от внешних каналов и сохраняет историю внутри платформы.
________________________________________
Notification preferences
В future target пользователь должен управлять уведомлениями:
•	email on/off; 
•	push on/off; 
•	Telegram on/off; 
•	уведомления по reactions; 
•	уведомления по voucher; 
•	уведомления по Missions; 
•	уведомления по рефералам; 
•	business / PRO notifications. 
Notification Service должен учитывать user preferences и не отправлять лишние сообщения.
________________________________________
14.2. Communication Model
Reactions + Threads
Базовая коммуникация в Go2Asia строится через:
•	reactions; 
•	reposts; 
•	reviews; 
•	questions; 
•	contact requests; 
•	thread replies; 
•	notifications. 
Reaction — лёгкое структурированное действие.
Thread — асинхронная ветка общения, привязанная к объекту.
Примеры объектов:
•	пост; 
•	listing; 
•	voucher; 
•	partner profile; 
•	event; 
•	quest; 
•	claim; 
•	support request. 
________________________________________
No Classic Chat
Go2Asia не строит универсальный real-time chat в текущем canon.
Это означает:
•	нет обязательного WebSocket-чата; 
•	нет универсальных личных диалогов; 
•	нет групповых чатов как основной коммуникационной модели; 
•	нет попытки конкурировать с Telegram / WhatsApp / WeChat. 
Причины:
•	меньше техническая сложность; 
•	проще модерация; 
•	меньше юридических рисков; 
•	чище UX; 
•	коммуникация остаётся привязанной к действию или объекту. 
________________________________________
Object-bound Communication
Коммуникация должна быть привязана к объекту.
Примеры:
•	вопрос по Rielt listing; 
•	contact request по voucher claim; 
•	ответ партнёра по offer; 
•	вопрос организатору Pulse event; 
•	обсуждение Quest proof; 
•	отзыв о RF partner; 
•	реакция на Space post. 
Такой подход создаёт контекст:
пользователь не просто “пишет кому-то”, а взаимодействует вокруг конкретного объекта и действия.
________________________________________
Thread lifecycle
Thread может иметь жизненный цикл:
•	created; 
•	waiting_for_partner; 
•	waiting_for_user; 
•	waiting_for_pro; 
•	resolved; 
•	closed; 
•	escalated; 
•	canceled. 
Thread может быть связан с:
•	target_type; 
•	target_id; 
•	user_id; 
•	partner_id; 
•	pro_id; 
•	claim_id; 
•	listing_id; 
•	offer_id. 
________________________________________
Role of PRO in communication
PRO не должен быть участником каждой микротранзакции вручную.
Но PRO может быть:
•	visible curator; 
•	escalation layer; 
•	mediator; 
•	translator; 
•	support actor; 
•	trust representative. 
Например, после voucher claim уведомление получает и партнёр, и PRO, но PRO подключается только если требуется помощь.
________________________________________
Главный принцип коммуникации
Communication layer должен поддерживать реальные пользовательские сценарии, но не превращать Go2Asia в мессенджер.
Формула:
Actions create context. Threads preserve context. Notifications deliver signals. Reactions create social layer.

15. AI / Recommendation Services
AI / Recommendation services относятся к future layer Go2Asia. Они должны усиливать пользовательский опыт, персонализацию, модерацию и discovery, но не должны становиться источником истины по доменным данным.
Главный принцип:
AI recommends, ranks, explains and assists — but does not own domain truth.
________________________________________
15.1. Recommendation Service Future
Recommendation Service может стать отдельным сервисом персонализации.
Он может рекомендовать:
•	места; 
•	события; 
•	квесты; 
•	RF-офферы; 
•	Rielt listings; 
•	Blog-материалы; 
•	Space-группы; 
•	Missions; 
•	PRO-профили; 
•	маршруты. 
Источники сигналов:
•	просмотры; 
•	реакции; 
•	сохранения; 
•	прохождения квестов; 
•	voucher claim / redeem; 
•	гео-контекст; 
•	роли пользователя; 
•	история взаимодействий; 
•	preferences. 
Recommendation Service не должен владеть объектами, которые рекомендует. Он только строит персонализированную выдачу поверх данных Atlas, Pulse, RF, Rielt, Quest, Space, Blog и Missions.
________________________________________
15.2. AI Guide Future
AI Guide — будущий персональный помощник пользователя внутри Go2Asia.
Он может помогать:
•	понять, что находится рядом; 
•	выбрать район; 
•	подобрать квест; 
•	объяснить отличие мест; 
•	предложить маршрут; 
•	подобрать жильё; 
•	найти RF-партнёра; 
•	объяснить условия ваучера; 
•	подсказать следующую Mission; 
•	собрать персональный план дня. 
AI Guide должен использовать данные платформы, но не заменять их.
Правило:
AI Guide отвечает на основе verified platform data, а не придумывает собственную реальность.
Для этого ему нужны:
•	доступ к Atlas / Pulse / RF / Rielt / Quest / Blog data; 
•	clear source boundaries; 
•	grounding; 
•	fallback при нехватке данных; 
•	ограничение hallucinations. 
________________________________________
15.3. Moderation AI Future
Moderation AI может помогать с безопасностью и качеством контента.
Потенциальные задачи:
•	предварительная проверка Space posts; 
•	выявление спама; 
•	токсичность; 
•	запрещённый контент; 
•	подозрительные отзывы; 
•	подозрительные voucher / referral patterns; 
•	анализ Rielt listings; 
•	проверка Quest proof; 
•	помощь модераторам. 
Важно:
AI не должен быть единственным финальным судьёй в чувствительных сценариях.
Для спорных случаев должен быть human review:
•	Moderator; 
•	Editor; 
•	RF ops; 
•	Admin; 
•	PRO verification, где уместно. 
________________________________________
15.4. Mission Personalization Future
В будущем AI / Recommendation layer может помогать Missions Service персонализировать цели пользователя.
Примеры:
•	новому пользователю — onboarding chain; 
•	активному автору — content missions; 
•	VIP — voucher / RF missions; 
•	PRO — partner growth missions; 
•	путешественнику в новом городе — contextual nearby missions; 
•	пользователю с интересом к жилью — Rielt-related missions; 
•	пользователю после квеста — follow-up chain. 
Важно:
•	AI может рекомендовать Mission; 
•	Missions Service владеет mission catalog и progress; 
•	Points Service исполняет награды. 
AI не должен создавать экономические обязательства без подтверждённой логики Missions / Economy layer.
________________________________________
15.5. Не владеет доменными данными
AI / Recommendation layer не должен владеть:
•	Atlas places; 
•	Pulse events; 
•	RF partners; 
•	Rielt listings; 
•	Quest tasks; 
•	Space posts; 
•	Points ledger; 
•	Referral graph; 
•	Missions progress; 
•	Token balances. 
Он может хранить:
•	embeddings; 
•	ranking features; 
•	user preference vectors; 
•	recommendation logs; 
•	moderation scores; 
•	personalization signals. 
Но source of truth остаётся в доменных сервисах.
________________________________________
Главный принцип AI / Recommendation Services
AI слой должен появляться после накопления данных и стабилизации доменов.
Не нужно преждевременно строить сложный AI-layer, пока:
•	RF не стабилизирован; 
•	Rielt не закреплён; 
•	Quest не доработан; 
•	Space не ожил; 
•	Missions не получили реальные события; 
•	данных недостаточно для персонализации. 
Формула:
Domain services create truth. AI layer creates assistance.

16. Data Ownership Matrix
Data ownership matrix фиксирует, какой сервис чем владеет, чем не владеет, какие события создаёт и какие события потребляет.
Главный принцип:
Каждая сущность должна иметь одного владельца truth.
Другие сервисы могут ссылаться на неё, читать её или реагировать на события, но не должны становиться параллельным источником истины.
Service / Layer	Owns	Does not own	Emits events	Consumes events
API Gateway	routing rules, external API entry, auth enforcement boundary	domain data, business rules, ledger, profiles	request logs, gateway errors, auth failures	service readiness, auth validation
Auth / Identity	identity, auth provider mapping, base user id, account status, global roles	posts, listings, partners, Points, Missions, vouchers	user_created, user_materialized, role_changed	auth provider events
User Profile / Projection	public profile projection, role projection, privacy projection	auth secrets, ledger, social posts, RF partner data	profile_updated, role_projection_updated	user_created, role_changed
Content Service	countries, cities, places, events, articles, guides, media references for content	social posts, RF partner business data, listings, Points	content_published, place_updated, event_published, article_published	media_uploaded, moderation_result
Atlas Domain	geo/content truth: countries, cities, districts, places, guides	RF status, partner profile, Rielt listing, Quest progress	place_created, place_updated, city_updated	place_proposal_submitted
Pulse Domain	events, event metadata, event media references	Space discussions, RF offers, Quest tasks, Points	event_created, event_updated, event_completed	place_updated, organizer_verified
Blog Domain	curated articles, editorial metadata, SEO content	raw Space UGC, social feed, comments, Points	article_published, content_featured	space_post_featured_candidate
Geo Layer / Geo Service	geo DTOs, indexes, projections, viewport/nearby read models	domain entities themselves: places, listings, partners, posts	geo_projection_updated, nearby_index_refreshed	place_updated, listing_updated, partner_branch_updated, event_updated
Space Service	posts, reposts, groups, memberships, social profile extensions	identity, RF partners, listings, Points, Missions	post_created, repost_created, group_joined, post_deleted	profile_updated, reaction_created
Feed Service	feed projections, feed ranking baseline, feed read models	original posts, reactions truth, user identity	feed_item_created, feed_refreshed	post_created, repost_created, reaction_created, moderation_result
Reactions Service	likes, repost interactions, ratings, short reviews, questions, contact requests, thread replies	original target objects, Points, partner data	reaction_created, reaction_deleted, question_created, contact_request_created, thread_reply_created	target_deleted, moderation_result
Thread / Inquiry Layer	object-bound threads, participants, thread status, replies if separated	real-time chat, booking, payments, listing truth	thread_created, thread_replied, thread_resolved, thread_escalated	question_created, contact_request_created, voucher_claimed
RF Service	BusinessPartner, BusinessLine, PartnerBranch, RF status, offers, vouchers, PRO links, partner analytics baseline	Atlas geography, Rielt listings, Points ledger, Space content	partner_created, partner_verified, offer_created, voucher_claimed, voucher_redeemed, partner_kpi_met	place_updated, profile_updated, quest_completed
Voucher / Offers Logic	offer lifecycle, voucher lifecycle, claim/redeem records	base product/service, listing truth, Points ledger	offer_created, voucher_claimed, voucher_redeemed, voucher_expired	partner_verified, listing_published
Rielt Service	housing listings, listing presentation, listing discovery, listing media refs, listing status	RF partners, vouchers, payments, booking, chat, Atlas geography	listing_created, listing_updated, listing_published, listing_interest_started	partner_verified, voucher_claimed, place_updated
Quest Service	quests, routes, tasks, proof, validation, progress, completion	ecosystem Missions, Points ledger, RF partners, vouchers	quest_started, task_completed, proof_submitted, quest_completed	place_updated, event_updated, voucher_redeemed
Points Service	Points ledger, balances, transactions, reward execution, idempotency records	Missions catalog, referral graph, domain events source truth	points_awarded, points_spent, reward_executed, reward_failed	reward_intent_created, quest_completed, voucher_redeemed, referral_activated
Referral Service	referral codes, referral graph, referral activation state, referral earnings summary	Points ledger, user identity, Missions	referral_registered, referral_activated, referral_became_vip	user_created, role_changed, purchase_completed
Missions Service	mission catalog, conditions, user mission progress, reward intents	Points ledger, Quest tasks, domain truth	mission_started, mission_progressed, mission_completed, reward_intent_created	post_created, voucher_redeemed, quest_completed, referral_activated, listing_published
Badges / NFT Layer	badge catalog, badge assignments, badge progress, NFT metadata future	Points balance, Missions progress, blockchain execution	badge_awarded, badge_upgraded, nft_mint_requested	reward_intent_created, points_awarded, quest_completed
Token Service	future off-chain G2A balances, token accounting, conversion requests	Points ledger, Connect UI, blockchain keys	token_reward_recorded, withdrawal_requested, g2a_balance_updated	reward_intent_created, compliance_result
Blockchain Gateway	future on-chain transaction execution, tx status, key-isolated blockchain operations	economic decisions, user rewards, Points, Missions	blockchain_tx_submitted, blockchain_tx_confirmed, blockchain_tx_failed	withdrawal_requested, nft_mint_requested
Notification Service	notification records, templates, delivery status, user notification preferences	domain events truth, thread content truth, Points ledger	notification_sent, notification_failed, notification_read	reaction_created, thread_replied, voucher_claimed, mission_completed, points_awarded
Recommendation Service	ranking features, embeddings, recommendation logs, preference vectors	domain source data, user identity truth, Points, Missions	recommendation_generated, recommendation_clicked	post_viewed, place_viewed, voucher_claimed, quest_completed
Moderation / Trust & Safety	reports, moderation decisions, abuse flags, trust scores	original content ownership, identity, ledger	moderation_result, user_restricted, content_flagged	post_created, reaction_created, listing_created, proof_submitted
Analytics Service	aggregated metrics, dashboards, funnels, business intelligence	transactional truth, ledger, user identity, domain records	analytics_snapshot_ready	all domain events / logs
Connect UI / possible BFF	dashboard read model, UI aggregation cache if needed	Points, Referral, Missions, Badges, Token, vouchers	dashboard_viewed, connect_summary_refreshed	points_awarded, mission_completed, badge_awarded, referral_activated
16.1. Ключевые правила ownership
1.	Auth owns identity, but not user activity.
Identity layer знает, кто пользователь, но не владеет его постами, Points или квестами. 
2.	Atlas owns geography.
RF, Rielt, Quest и Pulse ссылаются на географию, но не создают параллельную truth. 
3.	RF owns partner business presence.
Rielt может показывать объекты партнёра, но не владеет партнёром, offers или vouchers. 
4.	Rielt owns listing discovery, not transaction.
Primary inquiry для partner products живёт в voucher claim / RF commerce layer. 
5.	Quest owns tasks, not Missions.
Quest Task — локальное задание. Ecosystem Mission — надэкосистемная цель. 
6.	Missions own progress and reward intents, not rewards.
Internal rewards are processed by Points / Badges where runtime-backed; Token/G2A remains future-only unless separately activated.
7.	Points owns ledger.
Никакой другой сервис не меняет баланс напрямую. 
8.	Connect shows, does not own.
Connect может агрегировать данные для UI, но не принимает экономические решения.

17. Event Model
Event model описывает, как backend-сервисы Go2Asia сообщают друг другу о значимых изменениях, не смешивая ownership и не создавая жёсткую связанность между доменами.
Главный принцип:
Domain service emits facts. Orchestration services react. Economy services execute rewards.
________________________________________
17.1. Domain Events
Domain event — это факт, который уже произошёл внутри сервиса-владельца.
Примеры:
•	user.materialized 
•	profile.updated 
•	post.created 
•	reaction.created 
•	partner.verified 
•	offer.created 
•	voucher.claimed 
•	voucher.redeemed 
•	listing.published 
•	quest.completed 
•	referral.activated 
Domain event не должен быть командой другому сервису.
Правильно:
voucher.redeemed = ваучер был погашен.
Неправильно:
give_user_points_for_voucher = начисли пользователю Points.
________________________________________
17.2. Reward Intents
Reward intent — это намерение выдать награду, созданное после обработки события.
Reward intent может создаваться:
•	Missions Service; 
•	Referral Service; 
•	Quest Service; 
•	RF/Voucher layer; 
•	Admin / Ops; 
•	future campaigns. 
Reward intent должен описывать:
•	кому потенциально положена награда; 
•	за что; 
•	на основании какого события; 
•	какой тип награды; 
•	какой idempotency key; 
•	какой статус. 
Примеры reward intents:
•	начислить Points за completion Mission; 
•	выдать Badge за первый redeemed voucher; 
•	начислить referral bonus; 
•	зафиксировать future G2A reward eligibility. 
Правило:
Reward intent не меняет баланс сам по себе.
Execution is handled by Points / Badges where runtime-backed; Token/G2A remains future-only unless separately activated.
________________________________________
17.3. Event Naming
Имена событий должны быть стабильными, короткими и доменно-понятными.
Рекомендуемый формат:
domain.entity.action
Примеры:
•	auth.user.materialized 
•	profile.user.updated 
•	space.post.created 
•	space.repost.created 
•	reaction.created 
•	thread.reply.created 
•	rf.partner.created 
•	rf.partner.verified 
•	rf.offer.created 
•	rf.voucher.claimed 
•	rf.voucher.redeemed 
•	rielt.listing.published 
•	quest.started 
•	quest.task.completed 
•	quest.completed 
•	referral.activated 
•	mission.completed 
•	reward.intent.created 
•	points.awarded 
•	badge.awarded 
•	notification.sent 
Не использовать имена, которые описывают реализацию вместо факта:
•	плохо: call_points_service 
•	плохо: send_email_to_partner 
•	плохо: update_connect_dashboard 
Событие должно описывать произошедший факт, а не технический следующий шаг.
________________________________________
17.4. Event Payload
Каждое событие должно иметь базовую структуру.
Минимальные поля:
•	event_id 
•	event_type 
•	occurred_at 
•	producer_service 
•	schema_version 
•	subject_type 
•	subject_id 
•	actor_user_id, если есть 
•	correlation_id 
•	idempotency_key 
•	payload 
Пример структуры:
event_type = rf.voucher.redeemed
Payload может включать:
•	voucher_id 
•	offer_id 
•	partner_id 
•	branch_id 
•	user_id 
•	pro_id 
•	target_type 
•	target_id 
•	redeemed_at 
Важно:
payload должен быть достаточным для обработки события, но не должен превращаться в полную копию доменной сущности.
________________________________________
17.5. Idempotency
Все события, которые могут привести к наградам, уведомлениям или изменению состояния, должны быть idempotent.
Idempotency нужна потому, что:
•	событие может быть отправлено повторно; 
•	retry может выполниться после timeout; 
•	downstream service может получить событие дважды; 
•	worker может быть перезапущен. 
Правило:
один business fact = один idempotency key.
Примеры idempotency keys:
•	quest_completed:{quest_id}:{user_id} 
•	voucher_redeemed:{voucher_id} 
•	mission_completed:{mission_id}:{user_id} 
•	referral_activated:{sponsor_id}:{referral_user_id} 
Points Service, Missions Service, Badges layer и Notification Service должны проверять idempotency перед исполнением действий.
________________________________________
17.6. Outbox / Retries
Для надёжности сервисы должны использовать outbox-подход там, где событие критично.
Сценарий:
1.	Доменная операция записывается в базу. 
2.	Событие записывается в outbox в той же транзакционной логике. 
3.	Worker публикует событие. 
4.	После успешной публикации событие помечается как delivered. 
5.	При ошибке происходит retry. 
Это особенно важно для:
•	voucher.claimed 
•	voucher.redeemed 
•	quest.completed 
•	mission.completed 
•	reward.intent.created 
•	points.awarded 
•	referral.activated 
Retries должны быть:
•	ограниченными; 
•	логируемыми; 
•	idempotent; 
•	с dead-letter handling в будущем. 
________________________________________
17.7. Internal vs Public Events
В Go2Asia нужно различать внутренние и публичные события.
Internal events
Используются между backend-сервисами.
Примеры:
•	rf.voucher.redeemed 
•	mission.completed 
•	reward.intent.created 
•	points.awarded 
Они могут содержать служебные данные, но должны быть защищены и не уходить во внешний frontend напрямую.
________________________________________
Public / UI events
Используются для отображения пользователю.
Примеры:
•	“вам начислено 100 Points” 
•	“вы завершили Mission” 
•	“ваш ваучер активирован” 
•	“PRO ответил в thread” 
•	“вы получили Badge” 
Эти события должны проходить через Notification / Connect / UI layers и быть безопасными для отображения.
________________________________________
17.8. Event Consumers
Типовые потребители событий:
•	Missions Service — слушает domain events и обновляет progress. 
•	Points Service — слушает reward intents и исполняет ledger операции. 
•	Badges layer — слушает reward intents / achievements. 
•	Notification Service — слушает user-facing events. 
•	Analytics Service — слушает почти все события для агрегатов. 
•	Connect UI / BFF — читает уже подготовленные состояния, а не raw event stream. 
________________________________________
17.9. What Should Not Be Event-Driven
Не всё в Go2Asia должно быть event-driven.
REST API предпочтителен для:
•	обычного чтения; 
•	CRUD-операций; 
•	detail pages; 
•	search / filters; 
•	dashboard summaries; 
•	admin actions; 
•	synchronous validation. 
Events нужны для:
•	последствий; 
•	уведомлений; 
•	прогресса Missions; 
•	наград; 
•	аналитики; 
•	decoupled workflows. 
________________________________________
17.10. Главный принцип Event Model
Event model должен уменьшать связанность, а не создавать скрытый хаос.
Формула:
Сервис-владелец публикует факт.
Соседние сервисы реагируют на факт.
Награды исполняются только через Economy layer.

18. API Contracts and Routing
API contracts and routing описывают, как внешние и внутренние клиенты взаимодействуют с backend-сервисами Go2Asia.
Главный принцип:
OpenAPI contract first. Gateway routing second. Backend implementation third. Frontend integration fourth.
________________________________________
18.1. /v1/...
Все стабильные API Go2Asia должны использовать версионированный префикс:
/v1/...
Примеры:
•	/v1/content/... 
•	/v1/space/... 
•	/v1/reactions/... 
•	/v1/rf/... 
•	/v1/rielt/... 
•	/v1/quests/... 
•	/v1/points/... 
•	/v1/referrals/... 
•	/v1/missions/... future 
•	/v1/notifications/... future 
Версионирование нужно, чтобы:
•	не ломать frontend при изменении API; 
•	поддерживать SDK; 
•	отделять стабильный контракт от экспериментальных endpoints; 
•	упростить миграции. 
________________________________________
18.2. OpenAPI Contract
OpenAPI contract должен быть источником истины для API.
В контракте должны быть описаны:
•	paths; 
•	request params; 
•	request body; 
•	response body; 
•	error responses; 
•	auth requirements; 
•	schemas; 
•	enums; 
•	pagination; 
•	filtering; 
•	sorting; 
•	rate limit expectations, если применимо. 
Контракт должен различать:
•	реализованные endpoints; 
•	future endpoints; 
•	deprecated endpoints; 
•	internal-only endpoints; 
•	staging-only endpoints. 
Нельзя сначала “быстро сделать endpoint”, а потом задним числом придумывать контракт. Это почти всегда приводит к drift.
________________________________________
18.3. Generated SDK
Из OpenAPI contract должен генерироваться SDK / типы.
Generated SDK нужен для:
•	frontend; 
•	internal tools; 
•	smoke tests; 
•	contract checks; 
•	type safety; 
•	сокращения ручных ошибок. 
Frontend-модули не должны вручную угадывать shape API-ответов.
Правильный flow:
1.	Обновить OpenAPI. 
2.	Сгенерировать types / SDK. 
3.	Обновить backend. 
4.	Обновить frontend. 
5.	Прогнать contract / type / smoke checks. 
________________________________________
18.4. Gateway Routing
API Gateway должен маршрутизировать внешние запросы к сервисам по стабильным правилам.
Примерная карта:
•	/v1/content/* → Content Service 
•	/v1/space/* → Space Service / Space backend contour 
•	/v1/feed/* → Feed Service 
•	/v1/reactions/* → Reactions Service 
•	/v1/rf/* → RF Service 
•	/v1/rielt/* → Rielt Service 
•	/v1/quests/* → Quest Service 
•	/v1/points/* → Points Service 
•	/v1/referrals/* → Referral Service 
•	/v1/missions/* → Missions Service future 
•	/v1/notifications/* → Notification Service future 
Gateway не должен реализовывать бизнес-логику этих endpoints. Он должен только:
•	проверить доступ; 
•	проставить context headers; 
•	направить запрос; 
•	обработать базовую ошибку upstream; 
•	вернуть ответ. 
________________________________________
18.5. Public vs Internal Endpoints
API должны явно делиться на public и internal.
Public endpoints
Доступны frontend-модулям.
Примеры:
•	получить список мест; 
•	получить событие; 
•	получить listing; 
•	получить active missions; 
•	claim voucher; 
•	поставить reaction; 
•	получить read-only Points summary / projection.
Public endpoint может быть:
•	anonymous; 
•	authenticated; 
•	role-protected. 
________________________________________
Internal endpoints
Используются только service-to-service.
Примеры:
•	создать reward intent; 
•	отправить internal event; 
•	materialize user; 
•	process internal reward where runtime-backed;
•	sync geo projection; 
•	confirm voucher redeem from trusted partner flow. 
Internal endpoints должны быть защищены:
•	service auth; 
•	gateway headers; 
•	allowlist; 
•	mTLS / signed internal token в будущем; 
•	no direct public exposure. 
________________________________________
18.6. Staging-only Endpoints
Staging-only endpoints нужны для диагностики, но не должны становиться частью product API.
Они могут использоваться для:
•	debug; 
•	smoke checks; 
•	media diagnostics; 
•	data verification; 
•	import validation; 
•	service readiness; 
•	QA helpers. 
Правила:
•	явно помечать как staging/debug; 
•	не использовать в production UI; 
•	не документировать как публичный product API; 
•	защищать от случайной production exposure; 
•	удалять или архивировать после исчезновения необходимости. 
Пример:
/v1/content/_debug/...
Такие endpoints полезны, но Cursor не должен использовать их как основу нормального frontend-flow.
________________________________________
18.7. Error Model
API должны использовать единый стиль ошибок.
Ошибка должна включать:
•	code; 
•	message; 
•	details, если безопасно; 
•	request_id; 
•	optional field_errors. 
Примеры кодов:
•	UNAUTHORIZED; 
•	FORBIDDEN; 
•	NOT_FOUND; 
•	VALIDATION_ERROR; 
•	RATE_LIMITED; 
•	CONFLICT; 
•	UPSTREAM_UNAVAILABLE; 
•	INTERNAL_ERROR. 
Это нужно для нормального frontend UX и debugging.
________________________________________
18.8. Pagination / Filtering / Sorting
Списочные endpoints должны сразу проектироваться с учётом:
•	pagination; 
•	filters; 
•	sorting; 
•	search params; 
•	stable response shape. 
Примеры:
•	listings; 
•	partners; 
•	places; 
•	events; 
•	posts; 
•	transactions; 
•	missions; 
•	vouchers. 
Даже если MVP возвращает мало данных, контракт должен быть готов к росту.
________________________________________
18.9. Auth in API Contracts
OpenAPI должен явно указывать:
•	какие endpoints public; 
•	какие требуют authenticated user; 
•	какие требуют role; 
•	какие internal-only; 
•	какие future. 
Примеры:
•	GET /v1/content/places — public. 
•	POST /v1/reactions — authenticated. 
•	POST /v1/rf/partners — PRO/Admin. 
•	POST /v1/points/rewards/execute — internal only. 
•	POST /v1/blockchain/mint — internal only / future. 
________________________________________
18.10. Главный принцип API Contracts
API Go2Asia должны быть стабильными, типизированными и проверяемыми.
Формула:
Контракт фиксирует обещание.
Gateway направляет запрос.
Сервис исполняет свою доменную ответственность.
SDK защищает frontend от ручных ошибок.

19. Security and Access Control
Security and access control описывает базовые правила безопасности backend-архитектуры Go2Asia: кто имеет доступ к каким данным, как сервисы доверяют друг другу, какие операции требуют усиленной защиты и как предотвращаются злоупотребления.
Главный принцип:
Security must be enforced at the gateway, service, and domain level.
________________________________________
19.1. Auth
Все защищённые пользовательские операции должны требовать авторизации.
Auth layer отвечает за:
•	проверку токена; 
•	определение user_id; 
•	проверку account status; 
•	передачу user context во внутренние сервисы; 
•	базовую защиту приватных endpoints. 
Публичные endpoints могут быть доступны без авторизации, например:
•	публичные Atlas places; 
•	публичные Blog articles; 
•	открытые Pulse events; 
•	публичные RF partner cards; 
•	публичные Rielt listing previews. 
Но любые действия, создающие состояние, должны быть authenticated:
•	создать пост; 
•	поставить reaction; 
•	claim voucher; 
•	пройти quest task; 
•	получить Points; 
•	открыть Missions progress; 
•	создать listing; 
•	управлять partner profile. 
________________________________________
19.2. Roles
Роли должны использоваться для разграничения доступа.
Основные роли:
•	Guest; 
•	Spacer; 
•	VIP Spacer; 
•	PRO; 
•	Business Partner; 
•	Moderator; 
•	Editor; 
•	Admin. 
Примеры:
•	Spacer может публиковать посты и ставить reactions. 
•	VIP может тратить Points на voucher / premium access. 
•	PRO может создавать Quest, помогать с RF партнёрами и listings. 
•	Business Partner может управлять своим профилем, offers и vouchers. 
•	Moderator может работать с жалобами и контентом. 
•	Editor может управлять curated content. 
•	Admin может выполнять системные операции. 
Важно:
роль сама по себе недостаточна.
Нужно также проверять ownership конкретного ресурса.
Например, Business Partner может редактировать только свой профиль, а PRO — только те партнёрские или listing-сценарии, где он назначен куратором.
________________________________________
19.3. Service-to-Service Trust
Внутренние сервисы должны доверять друг другу только через контролируемый механизм.
Service-to-service trust может включать:
•	gateway-issued internal headers; 
•	X-Gateway-Auth; 
•	service allowlist; 
•	signed internal tokens; 
•	mTLS в будущем; 
•	network-level isolation; 
•	scoped service permissions. 
Внутренний сервис не должен принимать критичный запрос только потому, что endpoint “не публичный”. Он должен проверять, что запрос пришёл из доверенного источника.
________________________________________
19.4. Service Tokens
Для internal endpoints нужны service tokens.
Service token должен быть:
•	ограничен по scope; 
•	ротационным; 
•	не храниться в коде; 
•	передаваться только через secure env; 
•	логироваться безопасно без раскрытия значения; 
•	иметь разные права для разных сервисов. 
Примеры:
•	Missions Service может создавать reward intents. 
•	Points Service может исполнять reward intents. 
•	Gateway может прокидывать user context. 
•	Token Service может обращаться к Blockchain Gateway. 
•	Notification Service может принимать события для отправки сообщений. 
Service token не должен давать “полный доступ ко всему”.
________________________________________
19.5. Rate Limits
Rate limiting нужен на публичных и write-heavy endpoints.
Особенно защищать:
•	auth-related endpoints; 
•	reactions write path; 
•	voucher claim; 
•	voucher redeem; 
•	referral activation; 
•	quest proof submission; 
•	listing creation; 
•	partner profile updates; 
•	media upload; 
•	notifications; 
•	search / nearby heavy queries. 
Rate limits должны быть:
•	per user; 
•	per IP; 
•	per service; 
•	per endpoint; 
•	role-aware, если нужно. 
Например:
•	лайки можно ограничить по частоте; 
•	voucher claim — по пользователю / офферу; 
•	proof upload — по квесту / пользователю; 
•	referral activation — по аккаунту / устройству / IP. 
________________________________________
19.6. Anti-Abuse
Go2Asia особенно уязвим к злоупотреблениям, потому что в системе есть Points, ваучеры, рефералы и будущая tokenomics.
Anti-abuse нужен для:
•	накрутки reactions; 
•	спама постами; 
•	фейковых рефералов; 
•	повторного использования vouchers; 
•	фиктивного redeem; 
•	фейковых quest proof; 
•	listing spam; 
•	partner fraud; 
•	PRO reward abuse; 
•	mission farming; 
•	Points inflation. 
Меры:
•	idempotency; 
•	throttling; 
•	duplicate detection; 
•	suspicious activity flags; 
•	device / IP heuristics; 
•	manual review; 
•	moderation queue; 
•	reward delay for risky events; 
•	abuse scoring; 
•	caps / cooldowns; 
•	audit trails. 
Важно:
экономика должна быть защищена до того, как появится on-chain tokenomics.
________________________________________
19.7. Sensitive Operations
Некоторые операции должны иметь усиленный контроль.
К sensitive operations относятся:
•	ручное начисление / списание Points; 
•	изменение роли пользователя; 
•	присвоение PRO / VIP / Admin; 
•	подтверждение RF партнёра; 
•	создание premium offer; 
•	mass voucher generation; 
•	voucher redeem override; 
•	listing verification; 
•	quest proof override; 
•	badge assignment override; 
•	future token externalization review request, if separately activated;
•	future blockchain mint / burn / transfer, if separately activated;
•	admin impersonation, если когда-либо появится. 
Для них нужны:
•	role-based access; 
•	audit log; 
•	reason / comment; 
•	approval flow для особо критичных; 
•	idempotency; 
•	rollback / compensation path; 
•	alerts. 
________________________________________
19.8. Privacy and Data Minimization
Сервисы должны получать только те данные пользователя, которые им нужны.
Примеры:
•	Space может знать display name и avatar, но не обязан знать email. 
•	Rielt может знать user_id и contact permission, но не весь auth profile. 
•	RF может знать partner owner id, но не приватные данные пользователя без необходимости. 
•	Connect может показывать агрегаты, но не должен раскрывать internal ledger details без нужды. 
Принцип:
меньше данных в каждом сервисе = меньше риск утечки и проще compliance.
________________________________________
19.9. Security Logging
Все sensitive и security-relevant действия должны логироваться.
Логи должны включать:
•	actor; 
•	target; 
•	action; 
•	timestamp; 
•	request_id; 
•	source service; 
•	result; 
•	reason, если применимо. 
Нельзя логировать:
•	raw tokens; 
•	passwords; 
•	private keys; 
•	sensitive secrets; 
•	полные персональные данные без необходимости. 
________________________________________
19.10. Главный принцип Security
Security в Go2Asia должна быть многоуровневой:
•	Gateway проверяет вход. 
•	Auth layer устанавливает identity. 
•	Service layer проверяет trust. 
•	Domain layer проверяет ownership. 
•	Economy layer проверяет idempotency и abuse. 
•	Admin layer ведёт audit. 
Формула:
Authenticate globally. Authorize locally. Audit sensitive actions. Protect the economy before it becomes valuable.

20. Observability and Operations
Observability and operations описывает, как backend Go2Asia должен проверяться, диагностироваться, деплоиться и сопровождаться.
Главный принцип:
Сервис считается готовым не тогда, когда он запускается, а когда его можно проверить, отследить и безопасно обновить.
________________________________________
20.1. /ready
Каждый backend-сервис должен иметь endpoint:
/ready
Он должен показывать, готов ли сервис принимать рабочие запросы.
/ready может проверять:
•	наличие обязательных env-переменных; 
•	подключение к базе; 
•	доступность критичных зависимостей; 
•	валидность service secrets; 
•	готовность storage / media config; 
•	состояние миграций, если применимо. 
Важно:
/ready не должен просто возвращать 200 потому, что процесс запущен.
Если критичная зависимость отсутствует, сервис должен честно возвращать degraded / not ready.
________________________________________
20.2. Health Checks
Health checks нужны для базовой проверки доступности.
Различать:
•	liveness — процесс жив; 
•	readiness — сервис готов работать; 
•	dependency checks — критичные внешние зависимости доступны. 
Пример:
•	service worker запущен → live; 
•	env настроен и DB доступна → ready; 
•	downstream unavailable → degraded. 
Такой подход помогает не выкатывать “живой, но нерабочий” сервис.
________________________________________
20.3. Smoke Tests
Smoke tests нужны после deploy и перед promote.
Они должны проверять минимальные критичные сценарии:
•	Gateway отвечает; 
•	auth-protected endpoint корректно защищён; 
•	public content endpoint работает; 
•	service /ready возвращает ожидаемый статус; 
•	basic read endpoint возвращает валидный shape; 
•	критичный write-path не сломан, если тест безопасен. 
Примеры smoke-сценариев:
•	GET /v1/content/... 
•	GET /v1/rielt/listings 
•	GET /v1/rf/partners 
•	GET /v1/quests 
•	GET /ready 
•	protected endpoint без token → 401 / 403 
Smoke tests не должны быть полноценной e2e-регрессией. Их задача — быстро поймать очевидный deploy-break.
________________________________________
20.4. Logging
Все сервисы должны писать структурированные логи.
Лог должен включать:
•	timestamp; 
•	service name; 
•	level; 
•	request_id; 
•	correlation_id; 
•	route; 
•	status; 
•	duration; 
•	error code; 
•	user_id, если безопасно; 
•	event_id, если применимо. 
Не логировать:
•	raw tokens; 
•	passwords; 
•	private keys; 
•	secrets; 
•	sensitive personal data; 
•	полные payloads, если они содержат приватные данные. 
Логи должны помогать отвечать на вопросы:
•	что случилось; 
•	где случилось; 
•	кто инициировал; 
•	какой сервис упал; 
•	какой request / event связан с ошибкой. 
________________________________________
20.5. Correlation IDs
Каждый внешний запрос должен получать correlation_id или request_id.
Этот идентификатор должен передаваться:
•	из Gateway во внутренние сервисы; 
•	между сервисами; 
•	в логи; 
•	в event payload; 
•	в error responses, если безопасно. 
Correlation ID позволяет связать:
•	frontend request; 
•	gateway logs; 
•	service logs; 
•	database operation; 
•	emitted events; 
•	downstream failures. 
Правило:
один пользовательский запрос = одна трассируемая цепочка.
________________________________________
20.6. CI Checks
CI должен проверять качество до merge / deploy.
Минимальные checks:
•	typecheck; 
•	lint; 
•	tests; 
•	OpenAPI validate; 
•	OpenAPI generate; 
•	SDK/type generation consistency; 
•	migration check, если применимо; 
•	contract drift check; 
•	build. 
Для backend-сервисов особенно важны:
•	request-level tests; 
•	contract tests; 
•	idempotency tests для reward/economy flows; 
•	auth boundary tests; 
•	rate limit tests на write-heavy endpoints. 
________________________________________
20.7. Deploy Gates
Deploy gates нужны, чтобы не выкатывать сломанные сервисы.
Перед promote должны проходить:
•	CI checks; 
•	build success; 
•	OpenAPI validation; 
•	service readiness; 
•	smoke tests; 
•	required env check; 
•	migration status check; 
•	critical secrets present; 
•	rollback plan, если deploy рискованный. 
Если сервис не проходит readiness или smoke checks, deploy не должен считаться успешным.
________________________________________
20.8. Staging Diagnostics
Staging должен использоваться как controlled environment для проверки:
•	новых endpoints; 
•	media pipeline; 
•	migrations; 
•	imports; 
•	auth integration; 
•	gateway routing; 
•	frontend integration; 
•	smoke scenarios. 
Staging-only debug endpoints допустимы, но должны быть:
•	явно помечены; 
•	защищены; 
•	исключены из production product flow. 
________________________________________
20.9. Incident and Regression Notes
После значимого сбоя или стабилизационного прохода желательно создавать closure / regression note.
Такой note должен фиксировать:
•	что было сломано; 
•	как обнаружили; 
•	какие файлы изменены; 
•	какие проверки добавлены; 
•	какие сценарии теперь защищены; 
•	что остаётся future work. 
Это особенно важно для работы с Cursor, чтобы он не терял контекст и не повторял уже исправленные ошибки.
________________________________________
20.10. Главный принцип Operations
Operations в Go2Asia должны быть частью архитектуры, а не “потом добавим”.
Формула:
Build it. Check it. Trace it. Smoke it. Gate it. Document the closure.

21. Runtime Reality vs Future Target
Этот раздел фиксирует, какие backend-сервисы и архитектурные решения уже существуют, какие находятся в частичной реализации, какие являются target-архитектурой, а какие старые предположения больше не считаются актуальными.
Главный принцип:
Не выдавать future vision за current runtime.
Документация, задачи для Cursor и roadmap должны явно различать текущее состояние и целевую архитектуру.
________________________________________
21.1. Already Exists
К текущей runtime reality относятся сервисы и контуры, которые уже существуют в проекте или должны рассматриваться как активная часть текущей архитектуры.
Core / Infrastructure
•	API Gateway 
•	Auth / Identity integration 
•	user materialization flow 
•	OpenAPI-first workflow 
•	generated types / SDK flow 
•	readiness / smoke practices 
•	staging infrastructure 
Content
•	Content Service 
•	Atlas data через content-service 
•	Pulse events через content-service 
•	Blog / guides / articles через content-service 
•	media keys / storage / CDN approach 
Social
•	Feed Service 
•	Reactions Service 
•	Space backend contour / SSOT foundation 
Economy
•	Points Service 
•	Referral Service 
•	Token Service baseline 
Domain services
•	RF baseline / domain docs 
•	Rielt baseline 
•	Quest baseline 
Важно:
Already exists не означает “полностью продуктово завершено”.
Это означает, что контур уже есть и должен учитываться как runtime reality.
________________________________________
21.2. Partial Implementation
Partial implementation — это контуры, которые уже имеют основу, но требуют стабилизации, cleanup, contract alignment или product refinement.
RF Service
Частично готов, но требует стабилизации:
•	BusinessPartner; 
•	BusinessLine; 
•	PartnerBranch; 
•	Offers; 
•	Vouchers; 
•	PRO links; 
•	RF ↔ Atlas boundary; 
•	RF ↔ Rielt boundary; 
•	RF ↔ Quest boundary; 
•	RF ↔ Points / Missions events. 
Rielt Service
Имеет baseline, но должен быть уточнён как:
curated listing discovery + voucher-first CTA.
Требует закрепления:
•	listing model; 
•	partner / branch references; 
•	geo/media references; 
•	voucher-first handoff; 
•	no booking / payments / chat in v1. 
Quest Service
Имеет baseline, но требует refinement:
•	Quest Tasks вместо Quest Missions; 
•	quest media; 
•	proof; 
•	progress; 
•	validation; 
•	completion; 
•	reward handoff; 
•	связи с Atlas / RF / Pulse. 
Space Backend
Имеет backend / SSOT основу, но требует возврата:
•	posts; 
•	reposts; 
•	groups; 
•	memberships; 
•	profile projections; 
•	frontend alignment; 
•	связь с Blog / Reactions / Missions. 
Connect Frontend
Connect существует как UI/product hub, но backend-доменом не является.
Требуется:
•	отображение Points; 
•	Referral; 
•	Badges; 
•	Missions future; 
•	vouchers; 
•	Quest rewards; 
•	future tokenomics. 
________________________________________
21.3. Target / Future Services
Target / future services — это важные элементы целевой архитектуры, но они не должны считаться реализованными.
Missions Service
Future orchestration layer:
•	mission catalog; 
•	conditions; 
•	user progress; 
•	reward intents; 
•	chains; 
•	personalization. 
Geo Service
Future platform geo service:
•	viewport; 
•	nearby; 
•	layers; 
•	indexing; 
•	cache; 
•	cross-domain geo projections. 
На текущем этапе Geo Layer может быть content-service based.
Notification Service
Future centralized notification service:
•	email; 
•	push; 
•	Telegram later; 
•	internal notification feed; 
•	preferences. 
На раннем этапе часть уведомлений может быть реализована проще.
Badges / NFT Service
Future achievement layer:
•	badge catalog; 
•	badge assignment; 
•	badge progress; 
•	NFT later. 
Token Service full version
Future off-chain G2A / tokenomics engine.
Текущий baseline не должен трактоваться как зрелая tokenomics system.
Blockchain Gateway
Future on-chain service:
•	TON; 
•	mint; 
•	burn; 
•	transfer; 
•	isolated keys; 
•	compliance controls. 
Recommendation / AI Layer
Future:
•	Recommendation Service; 
•	AI Guide; 
•	Moderation AI; 
•	mission personalization. 
Analytics / Trust & Safety
Future или отдельные target-контуры:
•	product analytics; 
•	RF / voucher analytics; 
•	moderation; 
•	anti-abuse; 
•	trust scoring. 
Connect BFF
Только если понадобится как read/composition layer.
Не является domain service.
________________________________________
21.4. Deprecated Assumptions
Некоторые старые представления больше не должны использоваться как актуальная backend-архитектура.
1. Connect Service как backend-владелец экономики
Устарело.
Актуально:
Connect = UI/product hub.
Points / Referral / Missions / Badges / Token владеют логикой.
________________________________________
2. Token Service = Connect Service
Устарело.
Token Service может быть future backend для G2A, но он не равен Connect.
________________________________________
3. Quest Missions
Устарело.
Актуально:
внутри Quest используются Tasks.
Missions — отдельный надэкосистемный layer.
________________________________________
4. Rielt как marketplace / booking platform
Устарело для v1.
Актуально:
Rielt = curated housing discovery + voucher-first CTA.
Не booking, не payments, не chat.
________________________________________
5. Inquiry как primary Rielt-owned flow
Устарело.
Актуально:
primary inquiry для partner products = voucher claim / purchase / activate в RF / Voucher layer.
________________________________________
6. RF как просто каталог ваучеров
Устарело.
Актуально:
RF = partner layer: BusinessPartner, BusinessLine, PartnerBranch, Offers, Vouchers, PRO links.
________________________________________
7. Guru как владелец nearby-данных
Устарело.
Актуально:
Guru показывает и персонализирует.
Geo / domain services владеют данными.
________________________________________
8. Space как мессенджер
Устарело.
Актуально:
Space = posts, groups, reposts, reactions, social activity.
Communication = reactions + object-bound threads + notifications.
________________________________________
9. On-chain tokenomics как часть MVP
Устарело.
Актуально:
off-chain first.
G2A / Blockchain Gateway / on-chain NFT later.
________________________________________
21.5. Главный вывод
Go2Asia сейчас находится не на этапе “чистой идеи”, а на этапе:
runtime-backed platform architecture with partial domain stabilization.
Следующая задача — не добавлять максимальное количество новых сервисов, а:
•	стабилизировать существующие домены; 
•	убрать устаревшие артефакты; 
•	обновить документацию; 
•	зафиксировать boundaries; 
•	развивать future services только по мере реальной необходимости.

22. Implementation Sequencing
Implementation sequencing фиксирует рекомендуемый порядок backend-развития Go2Asia.
Главный принцип:
Сначала стабилизировать домены, затем строить надстройки.
________________________________________
22.1. RF Stabilization
Первый приоритет — RF Service, потому что RF является основой бизнес/commerce слоя.
Нужно стабилизировать:
•	BusinessPartner; 
•	BusinessLine; 
•	PartnerBranch; 
•	PartnerBranch ↔ Atlas Place; 
•	Offers; 
•	Vouchers; 
•	PRO links; 
•	claim / redeem lifecycle; 
•	RF events; 
•	boundaries RF ↔ Rielt; 
•	boundaries RF ↔ Quest; 
•	boundaries RF ↔ Points / Missions. 
Цель:
RF должен стать устойчивым partner domain, на который смогут опираться Rielt, Guru, Quest, Missions и Economy Layer.
________________________________________
22.2. Rielt Stabilization
После RF — Rielt Service.
Rielt должен быть закреплён как:
curated housing discovery + voucher-first CTA.
Фокус:
•	listing model; 
•	partner / branch references; 
•	PRO curator reference; 
•	geo/media references; 
•	связь с offers / vouchers; 
•	listing status; 
•	search / filters; 
•	detail page API; 
•	no booking / payments / chat. 
Цель:
Rielt должен стать чистым discovery-layer для жилья, не превращаясь в marketplace/booking platform.
________________________________________
22.3. Quest Refinement
Следующий этап — Quest Service.
Фокус:
•	Quest Tasks вместо Quest Missions; 
•	routes; 
•	task model; 
•	proof; 
•	validation; 
•	progress; 
•	completion; 
•	reward handoff; 
•	references на Atlas / RF / Pulse; 
•	quest media; 
•	quest metadata. 
Цель:
Quest должен стать зрелым experience layer, который использует контент, гео и партнёров, но не владеет Missions или Points.
________________________________________
22.4. Consoles
После стабилизации основных доменов нужно переходить к рабочим интерфейсам управления.
Основные консоли:
•	User Cabinet; 
•	PRO Console; 
•	Business Console; 
•	Admin Console. 
Backend-фокус:
•	role-based access; 
•	management APIs; 
•	moderation flows; 
•	partner operations; 
•	listing management; 
•	voucher management; 
•	quest authoring; 
•	admin oversight; 
•	audit logs. 
Цель:
дать каждой роли свой управляемый интерфейс без смешивания доменных прав.
________________________________________
22.5. Space Return
После RF / Rielt / Quest / consoles нужно вернуться к Space.
Фокус:
•	posts; 
•	reposts; 
•	groups; 
•	memberships; 
•	profile projections; 
•	feeds; 
•	reactions; 
•	object-bound threads; 
•	связь с Blog; 
•	связь с Missions; 
•	social visibility / privacy. 
Цель:
сделать Space живым социальным слоем, но не превращать его в мессенджер и не отдавать ему бизнес-домены.
________________________________________
22.6. Missions Later
Missions Service следует реализовывать после того, как есть стабильные доменные события.
Перед Missions нужны:
•	RF events; 
•	Rielt listing / voucher events; 
•	Quest completion events; 
•	Space activity events; 
•	Referral events; 
•	Points / Badges baseline. 
Missions MVP:
•	onboarding missions; 
•	referral missions; 
•	basic social missions; 
•	voucher/RF missions; 
•	PRO/business missions позже. 
Цель:
Missions должны опираться на реальные события, а не имитировать прогресс поверх незрелых доменов.
________________________________________
22.7. Tokenomics Later
Tokenomics / G2A / Blockchain Gateway — поздний слой.
До него нужны:
•	зрелая Points economy; 
•	понятный reward policy; 
•	anti-abuse; 
•	legal/compliance review; 
•	audit model; 
•	user eligibility rules; 
•	tokenomics policy; 
•	off-chain accounting. 
Цель:
не запускать on-chain слой раньше, чем готова экономика, юридическая база и продуктовая ценность.
________________________________________
22.8. Recommended Order
Рекомендуемый backend sequencing:
1.	RF stabilization 
2.	Rielt stabilization 
3.	Quest refinement 
4.	User / PRO / Business / Admin consoles 
5.	Space return 
6.	Missions Service 
7.	Badges / advanced gamification 
8.	Notification Service hardening 
9.	Geo Service extraction, если потребуется 
10.	Token Service / G2A 
11.	Blockchain Gateway 
12.	AI / Recommendation Layer 
________________________________________
22.9. Exit Criteria
Каждый этап должен завершаться closure note.
Минимальные критерии завершения:
•	domain model зафиксирована; 
•	ownership boundaries описаны; 
•	OpenAPI contracts обновлены; 
•	runtime implementation соответствует contract; 
•	тесты / smoke checks проходят; 
•	deprecated assumptions удалены или помечены; 
•	next-step scope ограничен. 
Главное правило:
не переходить к следующей надстройке, пока текущий домен не имеет понятной границы и runtime-правды.

23. Glossary
API Gateway
API Gateway — единая точка входа во все backend-сервисы Go2Asia.
Отвечает за маршрутизацию, auth enforcement, базовую защиту и передачу контекста (headers). Не содержит доменной логики.
________________________________________
BFF (Backend-for-Frontend)
BFF — вспомогательный backend-слой, который агрегирует данные из нескольких сервисов специально для UI.
В Go2Asia возможен, например, как Connect BFF, но только как read/composition слой без владения бизнес-логикой.
________________________________________
Domain Service
Domain service — сервис, который владеет конкретным доменом и его данными.
Примеры: Points Service, RF Service, Rielt Service, Quest Service.
Каждый domain service — единственный источник истины для своей сущности.
________________________________________
Orchestration Layer
Orchestration layer — слой, который не владеет данными, но координирует процессы между доменами.
В Go2Asia это прежде всего Missions Service: он слушает события, обновляет прогресс и создаёт reward intents.
________________________________________
Ledger
Ledger — журнал транзакций, фиксирующий все изменения баланса.
В Go2Asia ledger принадлежит Points Service и является источником истины по Points-операциям.
________________________________________
Reward Intent
Reward intent — намерение выдать награду, сформированное на основе события или выполнения условий.
Reward intent не исполняет награду сам, а передаётся в Points / Badges where runtime-backed; Token/G2A remains future-only unless separately activated.
________________________________________
Event
Event — зафиксированный факт, произошедший в доменном сервисе.
Пример: voucher.redeemed, quest.completed, post.created.
Event описывает “что произошло”, а не “что нужно сделать”.
________________________________________
Projection
Projection — представление данных, полученное из другого сервиса или агрегированное для конкретной задачи.
Пример: user profile projection, feed projection, Connect dashboard summary.
________________________________________
Task
Task — задание внутри Quest.
Это локальная единица выполнения в рамках конкретного квеста: чек-ин, фото, ответ, QR, и т.д.
Task не является частью глобальной системы Missions.
________________________________________
Mission
Mission — надэкосистемная цель пользователя.
Mission может объединять разные действия: посты, рефералы, ваучеры, квесты.
Mission отслеживает прогресс и создаёт reward intents, но не начисляет награды напрямую.
________________________________________
Off-chain
Off-chain — операции и данные, существующие внутри платформы без использования блокчейна.
В Go2Asia это Points, Badges и текущая экономика.
________________________________________
On-chain
On-chain — операции, выполняемые в блокчейне (например, TON).
В будущем это G2A токены, NFT и транзакции через Blockchain Gateway.
________________________________________
Service Boundary
Service boundary — граница ответственности сервиса.
Она определяет, какие данные сервис владеет, какие события генерирует и какие действия может выполнять.
Нарушение границ приводит к дублированию логики и потере управляемости архитектуры.
________________________________________
Главный принцип Glossary
Все термины должны использоваться последовательно во всех документах, API и коде.
Единый язык = единая архитектура.

