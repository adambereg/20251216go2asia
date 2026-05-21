Go2Asia Interface Architecture v2

1. Назначение документа
Документ Go2Asia Interface Architecture v2 описывает актуальную интерфейсную архитектуру экосистемы Go2Asia: публичные модули, личные кабинеты, консоли ролей, Connect UI, Missions UI, notification / thread-сценарии и общие правила построения пользовательских поверхностей.
Документ нужен как interface-level SSOT для:
•	проектирования frontend-модулей; 
•	постановки задач Cursor; 
•	синхронизации UI с backend-сервисами; 
•	разграничения пользовательских, PRO, бизнесовых и административных интерфейсов; 
•	предотвращения смешивания продуктовых поверхностей и backend-ownership. 
________________________________________
Чем v2 отличается от раннего interface-документа
Ранний interface-документ описывал общий набор кабинетов и консолей на этапе концепции. Он был полезен как стартовая рамка, но сейчас архитектура Go2Asia стала точнее.
В версии v2 учитываются новые решения:
•	Connect UI — это интерфейсный хаб экономики и прогресса, но не отдельный backend-service. 
•	Missions UI выделяется как будущая поверхность надэкосистемных целей, отдельно от Quest. 
•	Внутри Quest используются Tasks, а не Missions. 
•	Rielt Market в v1 строится вокруг voucher-first CTA, а не direct inquiry / chat / booking. 
•	RF Asia уточнён как partner layer с BusinessPartner, BusinessLine, PartnerBranch, Offers, Vouchers и PRO links. 
•	Space Asia не проектируется как классический мессенджер. 
•	Коммуникация строится через reactions, notifications и object-bound threads. 
•	User Cabinet, PRO Console, Business Console и Admin Console должны быть разделены по ролям и ownership. 
•	UI не должен владеть доменной логикой, а только отображать и инициировать действия через backend contracts. 
Economy terminology alignment note:
Этот interface-canon документ должен читаться через `docs/economy/economy_authority_terminology_crosswalk_v1.md`. UI wording around Points, balance, rewards, wallet, referral, vouchers, G2A, NFT, token, withdrawal, PRO rewards or future externalization is display/projection language only unless a separate runtime policy and implementation contract says otherwise. UI не активирует ledger writes, reward producers, spend enforcement, payout/settlement, wallet/token/G2A/NFT/on-chain runtime или Slice 16 movement.
________________________________________
Связь с Ecosystem Overview v2
Ecosystem Overview v2 описывает Go2Asia на уровне продукта:
•	что такое экосистема; 
•	какие есть модули; 
•	какие роли участвуют; 
•	какие слои существуют; 
•	какие canon-правила действуют. 
Interface Architecture v2 переводит это в пользовательские поверхности:
•	где пользователь видит модули; 
•	какие экраны нужны; 
•	какие действия доступны каждой роли; 
•	как пользователь переходит между слоями экосистемы; 
•	как Connect, Missions, RF, Rielt, Quest и Space выражаются в UI. 
________________________________________
Связь с Backend Services Architecture v2
Backend Services Architecture v2 фиксирует backend-сервисы, ownership и API-границы.
Interface Architecture v2 должна следовать этим backend-границам.
Например:
•	если Points Service владеет internal Points ledger, Connect UI только отображает read-only projection / summary;
•	если RF Service владеет offers/vouchers, Rielt UI только инициирует voucher CTA; 
•	если Quest Service владеет Tasks, UI квеста не должен называть их Missions; 
•	если Space владеет social content, Business Console не должна становиться соцсетью; 
•	если Notification / Thread layer отвечает за коммуникацию, UI не должен вводить полноценный мессенджер. 
Главное правило:
Интерфейс может объединять пользовательский опыт, но не должен стирать границы backend-доменов.

2. Общие принципы интерфейсов
Интерфейсы Go2Asia должны показывать экосистему как единый продукт, но при этом сохранять границы модулей, ролей и backend-доменов.
Главный принцип:
UI объединяет пользовательский опыт, но не владеет доменной логикой.
________________________________________
2.1. Role-based interfaces
Интерфейсы должны зависеть от роли пользователя.
Основные роли:
•	Guest; 
•	Spacer; 
•	VIP Spacer; 
•	PRO; 
•	Business Partner; 
•	Moderator; 
•	Editor; 
•	Admin. 
Один и тот же модуль может выглядеть по-разному для разных ролей.
Примеры:
•	Guest видит публичные страницы и CTA регистрации. 
•	Spacer видит Space, Quest, базовые Missions и Connect. 
•	VIP видит дополнительные voucher / Points-возможности. 
•	PRO видит PRO Console, RF-партнёров, Quest authoring и Rielt listing actions. 
•	Business Partner видит Business Console. 
•	Admin / Moderator / Editor видят административные поверхности. 
Важно:
UI может скрывать недоступные действия, но backend всё равно обязан проверять права.
________________________________________
2.2. Module-first navigation
Go2Asia должна сохранять модульную навигацию.
Пользователь должен понимать, где он находится:
•	Guru; 
•	Atlas; 
•	Pulse; 
•	Blog; 
•	Space; 
•	RF; 
•	Rielt; 
•	Quest; 
•	Connect. 
Каждый модуль имеет собственную роль и контекст. Но переходы между модулями должны быть естественными.
Примеры:
•	из Guru → в RF-партнёра; 
•	из RF → к voucher; 
•	из Rielt listing → к voucher CTA; 
•	из Quest → к Atlas place; 
•	из Space post → к Blog article; 
•	из Connect → к Mission; 
•	из Mission → к действию в нужном модуле. 
Навигация должна помогать пользователю двигаться по экосистеме, а не теряться в ней.
________________________________________
2.3. Mobile-first
Go2Asia должна проектироваться как mobile-first экосистема.
Причины:
•	путешественники часто используют телефон; 
•	Guru / nearby сценарии мобильные по природе; 
•	voucher redeem часто происходит on-site; 
•	Quest tasks выполняются в движении; 
•	уведомления и threads требуют быстрого доступа; 
•	Rielt / RF / Pulse часто используются “на месте”. 
Mobile-first означает:
•	удобные карточки; 
•	короткие CTA; 
•	понятные статусы; 
•	быстрый доступ к QR / voucher code; 
•	адаптивные карты; 
•	простые формы; 
•	минимум перегруженных таблиц; 
•	отдельные desktop-enhancements для PRO / Business / Admin consoles. 
________________________________________
2.4. Единая дизайн-система
Все интерфейсы Go2Asia должны использовать единую дизайн-систему.
Она должна включать:
•	типографику; 
•	цвета; 
•	spacing; 
•	карточки; 
•	кнопки; 
•	badges; 
•	status labels; 
•	tabs; 
•	filters; 
•	empty states; 
•	loading states; 
•	error states; 
•	map cards; 
•	media galleries; 
•	notification patterns; 
•	role labels. 
Единая дизайн-система нужна, чтобы пользователь ощущал Go2Asia как одну платформу, а не набор отдельных сайтов.
При этом модули могут иметь собственные акценты, но не должны ломать общий UI-язык.
________________________________________
2.5. UI не владеет доменной логикой
UI не должен принимать доменные решения.
UI может:
•	показывать данные; 
•	инициировать действие; 
•	отправлять форму; 
•	отображать статус; 
•	агрегировать user-facing view; 
•	вести пользователя по сценарию. 
UI не должен:
•	начислять Points; 
•	сам решать, выполнена ли Mission; 
•	валидировать Quest proof как source of truth; 
•	создавать RF-партнёра без backend approval; 
•	считать referral rewards; 
•	изменять voucher status без backend action; 
•	подменять backend ownership локальным состоянием. 
Правило:
UI вызывает API. Backend владеет truth.
________________________________________
2.6. Runtime reality vs future UI
Интерфейсная архитектура должна различать:
•	уже существующие экраны; 
•	частично готовые экраны; 
•	future UI; 
•	устаревшие прототипные элементы. 
Примеры runtime reality:
•	публичные Atlas / Pulse / Blog поверхности; 
•	часть Connect UI; 
•	RF / Rielt / Quest базовые экраны; 
•	Space частично готов или требует возврата; 
•	часть UI может быть prototype / mock. 
Примеры future UI:
•	полноценный Missions UI; 
•	зрелая PRO Console; 
•	Business Console; 
•	Admin Console; 
•	AI Guide UI; 
•	advanced Connect dashboard; 
•	notification center; 
•	thread inbox. 
Важно:
Future UI не должен описываться в задачах так, будто он уже реализован.
________________________________________
2.7. No classic chat
Go2Asia не строит классический мессенджер в текущем canon.
Интерфейсы не должны создавать ожидание:
•	личных real-time диалогов; 
•	групповых чатов; 
•	универсального inbox как Telegram; 
•	WebSocket-first коммуникации. 
Вместо этого используются:
•	reactions; 
•	reposts; 
•	reviews; 
•	questions; 
•	contact requests; 
•	object-bound threads; 
•	notifications; 
•	optional social traces в Space. 
Коммуникация должна быть привязана к объекту:
•	listing; 
•	voucher; 
•	partner; 
•	event; 
•	quest; 
•	post; 
•	support case. 
Формула:
Не “напиши человеку”, а “соверши действие вокруг объекта”.
________________________________________
2.8. Главный принцип интерфейсов
Интерфейс должен быть:
•	ролевым; 
•	модульным; 
•	mobile-first; 
•	единым по дизайну; 
•	синхронизированным с backend ownership; 
•	честным относительно runtime / future; 
•	без скрытого мессенджерного scope. 
Финальная формула:
Go2Asia UI = единый пользовательский опыт поверх распределённых доменных сервисов.

3. Карта интерфейсных слоёв
Интерфейсы Go2Asia делятся на несколько слоёв. Каждый слой обслуживает свою группу пользователей, сценариев и прав доступа.
Главный принцип:
одна экосистема — разные интерфейсные поверхности для разных ролей и задач.
________________________________________
3.1. Public Modules
Public Modules — публичные пользовательские модули экосистемы.
К ним относятся:
•	Guru Asia; 
•	Atlas Asia; 
•	Pulse Asia; 
•	Blog Asia; 
•	Space Asia; 
•	RF Asia; 
•	Rielt Market; 
•	Quest Asia. 
Их задача — дать пользователю основной продуктовый опыт:
•	найти место; 
•	прочитать гайд; 
•	посмотреть событие; 
•	найти RF-партнёра; 
•	открыть listing; 
•	пройти квест; 
•	увидеть социальный контент; 
•	перейти к voucher / Mission / Connect. 
Часть публичных модулей доступна Guest, но активные действия требуют регистрации.
________________________________________
3.2. User Cabinet
User Cabinet — личный кабинет пользователя.
Он нужен для:
•	профиля; 
•	настроек аккаунта; 
•	приватности; 
•	активности; 
•	истории действий; 
•	связи с Connect; 
•	доступа к personal progress. 
User Cabinet — это не социальный профиль Space, а персональная зона управления аккаунтом.
________________________________________
3.3. Connect UI
Connect UI — пользовательский хаб экономики и прогресса.
Он показывает:
•	Points; 
•	Referral; 
•	Badges; 
•	Vouchers; 
•	Quest rewards; 
•	Missions; 
•	future G2A / NFT. 
Connect UI не владеет экономикой и не является backend-сервисом. Он только отображает данные из профильных сервисов и помогает пользователю понять свой прогресс.
________________________________________
3.4. PRO Console
PRO Console — рабочий интерфейс PRO-спейсера.
Он нужен для:
•	RF partner onboarding; 
•	работы с партнёрами; 
•	создания / сопровождения Rielt listings; 
•	Quest authoring; 
•	участия в Pulse / Blog / Space; 
•	просмотра PRO contribution / internal reward summaries;
•	аналитики собственного вклада. 
PRO Console — это операционная поверхность доверенного участника, а не обычный пользовательский кабинет.
________________________________________
3.5. Business Console
Business Console — интерфейс бизнес-партнёра.
Он нужен для:
•	управления профилем партнёра; 
•	business lines; 
•	branches; 
•	offers; 
•	vouchers; 
•	claim / redeem; 
•	статистики; 
•	связи с PRO; 
•	просмотра отзывов / social proof. 
Business Console не должен быть сложной CRM. На раннем этапе он должен быть максимально простым и понятным для локального бизнеса.
________________________________________
3.6. Admin Console
Admin Console — внутренний интерфейс команды Go2Asia.
Он нужен для:
•	управления пользователями; 
•	ролями; 
•	модерацией; 
•	контентом; 
•	RF / Rielt / Quest oversight; 
•	voucher / Points audit; 
•	reports / abuse; 
•	системных настроек. 
Admin Console должна быть role-based: Moderator, Editor и Admin не должны иметь одинаковые права.
________________________________________
3.7. Missions UI
Missions UI — интерфейс надэкосистемных целей пользователя.
Он показывает:
•	активные Missions; 
•	прогресс; 
•	completed Missions; 
•	mission chains; 
•	onboarding path; 
•	role-based Missions; 
•	contextual Missions; 
•	награды / reward status. 
Missions UI может быть встроен в Connect, Guru, Space, RF, Quest и User Cabinet, но backend-владельцем остаётся Missions Service.
Важно:
Missions UI не должен смешивать ecosystem Missions с Quest Tasks.
________________________________________
3.8. Notification / Threads UI
Notification / Threads UI — слой уведомлений и асинхронной коммуникации.
Он включает:
•	internal notification feed; 
•	object-bound thread view; 
•	contact request view; 
•	voucher claim follow-up; 
•	listing / partner / quest / event replies; 
•	system alerts. 
Этот слой заменяет потребность в классическом чате.
Вместо “личного мессенджера” пользователь видит:
•	уведомление; 
•	объект; 
•	контекст; 
•	действие; 
•	thread, если нужен ответ. 
________________________________________
3.9. Future AI Guide UI
AI Guide UI — будущий интерфейс AI-помощника.
Он может помогать:
•	выбрать место; 
•	понять район; 
•	подобрать квест; 
•	найти RF-оффер; 
•	предложить Mission; 
•	объяснить ваучер; 
•	собрать маршрут; 
•	подобрать жильё; 
•	ответить на вопросы по платформе. 
AI Guide UI должен работать поверх verified platform data и не должен становиться источником истины.
________________________________________
3.10. Сводная карта интерфейсных слоёв
Interface Layer	Для кого	Основная задача
Public Modules	Guest / Spacer / VIP / PRO	Основной пользовательский опыт
User Cabinet	Зарегистрированный пользователь	Аккаунт, профиль, настройки
Connect UI	Spacer / VIP / PRO	Экономика, прогресс, read-only reward summaries
PRO Console	PRO	Кураторская работа, contribution analytics and operations
Business Console	RF Partner	Управление бизнес-присутствием
Admin Console	Команда Go2Asia	Модерация, контроль, операции
Missions UI	Все роли по контексту	Цели, прогресс, вовлечение
Notification / Threads UI	Все роли	Уведомления и асинхронная связь
AI Guide UI	Future users	Персональная помощь и рекомендации
________________________________________
3.11. Главный принцип карты интерфейсов
Интерфейсные слои должны быть связаны, но не должны смешиваться.
•	Public Modules дают продуктовый опыт. 
•	User Cabinet управляет аккаунтом. 
•	Connect показывает прогресс. 
•	Missions направляют действия. 
•	PRO Console обслуживает кураторство. 
•	Business Console обслуживает партнёров. 
•	Admin Console обслуживает команду. 
•	Notifications / Threads доставляют сигналы. 
•	AI Guide помогает, но не владеет truth.

4. Публичные модули
Публичные модули — это основные пользовательские поверхности Go2Asia. Они формируют внешний продуктовый опыт экосистемы и связывают пользователя с контентом, картой, событиями, сообществом, бизнесом, жильём и квестами.
________________________________________
4.1. Guru Asia
Роль интерфейса
Guru Asia — nearby-интерфейс и главный сценарий “что рядом со мной”.
Основные экраны
•	карта рядом; 
•	список nearby-объектов; 
•	фильтры; 
•	карточка объекта; 
•	contextual recommendations; 
•	переходы в Atlas / RF / Rielt / Pulse / Quest. 
Пользовательский сценарий
Пользователь открывает Guru и видит:
•	места; 
•	события; 
•	RF-партнёров; 
•	жильё; 
•	квестовые точки; 
•	релевантные предложения; 
•	contextual Missions. 
Backend-сервисы
Guru UI читает:
•	Geo Layer / Geo Service target; 
•	Content Service / Atlas; 
•	Pulse data; 
•	RF Service; 
•	Rielt Service; 
•	Quest Service; 
•	Space / profile projections; 
•	Missions Service future. 
Что не должен делать UI
Guru UI не должен:
•	хранить nearby-данные как truth; 
•	сам ранжировать критичные бизнесовые сценарии; 
•	создавать RF-партнёров; 
•	создавать listings; 
•	валидировать квесты; 
•	начислять Points. 
________________________________________
4.2. Atlas Asia
Роль интерфейса
Atlas Asia — справочник стран, городов, районов, мест и guides.
Основные экраны
•	страны; 
•	города; 
•	районы; 
•	места; 
•	place detail; 
•	guides; 
•	тематические подборки; 
•	карта / гео-блоки. 
Пользовательский сценарий
Пользователь изучает локацию:
•	выбирает страну; 
•	открывает город; 
•	смотрит районы; 
•	изучает места; 
•	читает guides; 
•	переходит к событиям, статьям, RF-местам или квестам. 
Backend-сервисы
Atlas UI читает:
•	Content Service; 
•	Atlas domain data; 
•	Geo Layer; 
•	media pipeline; 
•	Blog / Pulse related content; 
•	RF enrichments, если место связано с партнёрским слоем. 
Что не должен делать UI
Atlas UI не должен:
•	создавать альтернативную географию; 
•	дублировать RF-партнёров; 
•	хранить коммерческие данные как truth; 
•	подменять RF badge локальной логикой; 
•	смешивать Atlas Guides с raw Space UGC. 
________________________________________
4.3. Pulse Asia
Роль интерфейса
Pulse Asia — интерфейс событий, афиши и хроники.
Основные экраны
•	список событий; 
•	фильтры по дате / городу / категории; 
•	event detail; 
•	event media gallery; 
•	future event submission / authoring; 
•	связанные места и статьи. 
Пользовательский сценарий
Пользователь хочет понять, что происходит:
•	смотрит события сегодня / на выходных; 
•	открывает карточку события; 
•	изучает место проведения; 
•	сохраняет событие; 
•	переходит в Guru, Atlas, Space или Quest. 
Backend-сервисы
Pulse UI читает:
•	Content Service / Pulse domain; 
•	Atlas place references; 
•	media pipeline; 
•	Space / Reactions future; 
•	Missions future; 
•	Notification future. 
Что не должен делать UI
Pulse UI не должен:
•	создавать события без backend moderation flow; 
•	хранить event truth локально; 
•	самостоятельно валидировать участие пользователя; 
•	начислять награды за посещение; 
•	превращать event page в чат. 
________________________________________
4.4. Blog Asia
Роль интерфейса
Blog Asia — публичный curated media layer.
Основные экраны
•	лента статей; 
•	article detail; 
•	категории; 
•	подборки; 
•	авторские страницы; 
•	связанные места / события / квесты; 
•	SEO-oriented pages. 
Пользовательский сценарий
Пользователь читает:
•	гайды; 
•	истории; 
•	репортажи; 
•	подборки; 
•	экспертные материалы; 
•	материалы из лучшего UGC. 
Blog помогает пользователю глубже понять регион и перейти в Atlas, Pulse, RF, Rielt, Quest или Space.
Backend-сервисы
Blog UI читает:
•	Content Service / Blog domain; 
•	Atlas / Pulse references; 
•	media pipeline; 
•	Space source attribution; 
•	Reactions / social metrics future; 
•	Missions future. 
Что не должен делать UI
Blog UI не должен:
•	быть raw social feed; 
•	публиковать Space-посты без curated workflow; 
•	хранить editorial truth на frontend; 
•	смешивать Blog article и Space post как одну сущность; 
•	начислять авторские rewards напрямую. 
________________________________________
4.5. Space Asia
Роль интерфейса
Space Asia — социальный интерфейс Go2Asia.
Основные экраны
•	home feed; 
•	profile feed; 
•	group feed; 
•	post detail; 
•	create post; 
•	repost flow; 
•	reactions; 
•	saved / liked; 
•	groups; 
•	social profile. 
Пользовательский сценарий
Пользователь:
•	публикует заметки; 
•	читает посты; 
•	ставит реакции; 
•	делает репосты; 
•	вступает в группы; 
•	оставляет отзывы; 
•	создаёт социальный след вокруг мест, событий, партнёров и квестов. 
Backend-сервисы
Space UI читает и пишет через:
•	Space Service / Space backend contour; 
•	Feed Service; 
•	Reactions Service; 
•	User Profile / Projection; 
•	media pipeline; 
•	Notification / Threads future; 
•	Blog curated flow future; 
•	Missions future; 
•	Points events indirectly. 
Что не должен делать UI
Space UI не должен:
•	быть владельцем identity; 
•	владеть RF-партнёрами; 
•	владеть Rielt listings; 
•	вести booking/payment сценарии; 
•	начислять Points; 
•	превращаться в полноценный мессенджер; 
•	подменять Blog curated layer. 
________________________________________
4.6. RF Asia
Роль интерфейса
RF Asia — пользовательская витрина партнёров, offers и vouchers.
Основные экраны
•	каталог RF-партнёров; 
•	partner card/detail; 
•	branch detail; 
•	business line view; 
•	offers list; 
•	voucher detail; 
•	claim voucher flow; 
•	redeemed / active vouchers; 
•	social proof / reviews summary. 
Пользовательский сценарий
Пользователь:
•	находит Russian Friendly место; 
•	смотрит профиль партнёра; 
•	видит offer; 
•	claim / reserve / activate voucher utility where runtime-backed;
•	получает QR / code; 
•	использует voucher; 
•	может оставить social feedback через Space. 
Backend-сервисы
RF UI читает и пишет через:
•	RF Service; 
•	Voucher / Offers logic; 
•	Atlas / Geo references; 
•	media pipeline; 
•	Reactions / Space social proof; 
•	Notification Service future; 
•	Points / Missions indirectly. 
Что не должен делать UI
RF UI не должен:
•	создавать Atlas place напрямую без moderation flow; 
•	начислять Points; 
•	владеть Rielt listings; 
•	вести booking; 
•	превращаться в отдельную соцсеть отзывов; 
•	обходить voucher lifecycle. 
________________________________________
4.7. Rielt Market
Роль интерфейса
Rielt Market — curated housing discovery interface.
Это не полноценный marketplace и не booking UI.
Основные экраны
•	список listings; 
•	фильтры; 
•	listing detail; 
•	media gallery; 
•	partner / PRO trust block; 
•	available offers / vouchers; 
•	voucher-first CTA; 
•	geo block / map; 
•	optional related content. 
Пользовательский сценарий
Пользователь:
•	ищет жильё; 
•	открывает listing; 
•	смотрит фото, район, условия; 
•	видит партнёра и PRO-куратора; 
•	выбирает offer; 
•	нажимает “Получить ваучер” / “Активировать предложение”; 
•	дальше попадает в RF / Voucher flow. 
Backend-сервисы
Rielt UI читает:
•	Rielt Service; 
•	RF Service; 
•	Voucher / Offers logic; 
•	Atlas / Geo Layer; 
•	media pipeline; 
•	Space / Reactions social proof; 
•	Notification / Threads future. 
Что не должен делать UI
Rielt UI не должен:
•	запускать booking engine; 
•	принимать оплату за базовую аренду; 
•	открывать прямой чат как основной CTA; 
•	создавать RF-партнёра; 
•	владеть voucher lifecycle; 
•	создавать параллельную географию; 
•	вести CRM. 
Главный CTA v1:
voucher-first, not message-first.
________________________________________
4.8. Quest Asia
Роль интерфейса
Quest Asia — интерфейс квестов, маршрутов, задач и прохождения.
Основные экраны
•	список квестов; 
•	quest detail; 
•	route preview; 
•	task list; 
•	task detail; 
•	proof upload; 
•	progress screen; 
•	completion screen; 
•	rewards preview; 
•	PRO authoring future. 
Пользовательский сценарий
Пользователь:
•	выбирает квест; 
•	смотрит маршрут; 
•	выполняет Tasks; 
•	загружает proof; 
•	получает completion; 
•	видит rewards; 
•	может поделиться результатом в Space. 
Backend-сервисы
Quest UI читает и пишет через:
•	Quest Service; 
•	Atlas / Geo references; 
•	RF / Voucher references; 
•	Pulse references; 
•	media pipeline; 
•	Points / Badges indirectly; 
•	Missions Service future; 
•	Space future sharing. 
Что не должен делать UI
Quest UI не должен:
•	называть Tasks “Missions”; 
•	начислять Points напрямую; 
•	сам валидировать proof как final truth; 
•	владеть RF offers; 
•	создавать Atlas places; 
•	смешивать Quest progress и Mission progress; 
•	превращать quest discussion в чат. 
________________________________________
4.9. Общий принцип публичных модулей
Публичные модули должны быть связаны, но не должны стирать ownership.
•	Guru показывает nearby. 
•	Atlas даёт контекст. 
•	Pulse показывает события. 
•	Blog публикует curated content. 
•	Space создаёт social layer. 
•	RF показывает партнёров и ваучеры. 
•	Rielt показывает жильё и ведёт к voucher CTA. 
•	Quest создаёт experience через Tasks. 
UI должен вести пользователя между модулями, но backend truth остаётся в соответствующих сервисах.

5. User Cabinet
User Cabinet — персональная зона пользователя в Go2Asia. Это не публичный профиль Space и не Connect, а интерфейс управления аккаунтом, личными настройками, приватностью и персональной активностью.
Главный принцип:
User Cabinet = account and personal control center.
Connect показывает экономику и прогресс, Space показывает социальный профиль, User Cabinet управляет аккаунтом.
________________________________________
5.1. Профиль
User Cabinet должен позволять пользователю управлять базовым профилем:
•	display name; 
•	avatar; 
•	bio; 
•	язык интерфейса; 
•	страна / город интереса; 
•	публичный статус; 
•	ссылки на социальный профиль Space; 
•	видимость профиля. 
Профильные данные могут отображаться в других модулях, но source of truth должен оставаться в User / Profile layer.
________________________________________
5.2. Настройки аккаунта
Раздел настроек аккаунта должен включать:
•	email; 
•	способы входа; 
•	пароль / auth provider settings; 
•	connected accounts, если появятся; 
•	notification preferences; 
•	language / locale; 
•	security settings; 
•	account deletion / deactivation request. 
Важно:
настройки аккаунта не должны смешиваться с настройками конкретных модулей.
Например:
•	смена email — User Cabinet; 
•	настройки ленты Space — Space; 
•	предпочтения событий Pulse — Pulse; 
•	фильтры Rielt — Rielt. 
________________________________________
5.3. Активность
User Cabinet может показывать агрегированную личную активность:
•	последние посты; 
•	реакции; 
•	пройденные квесты; 
•	активные ваучеры; 
•	завершённые Missions; 
•	реферальные действия; 
•	история важных событий аккаунта. 
Но User Cabinet не должен становиться полноценной социальной лентой. Для этого существует Space.
________________________________________
5.4. Privacy
Privacy-настройки должны быть отдельным важным блоком.
Пользователь должен управлять:
•	видимостью профиля; 
•	видимостью активности; 
•	видимостью гео-данных; 
•	участием в nearby-сценариях; 
•	отображением PRO/VIP статуса; 
•	уведомлениями; 
•	публичностью некоторых достижений. 
Особенно важно для:
•	Space; 
•	Guru; 
•	PRO nearby; 
•	Rielt / voucher claims; 
•	Missions / Badges. 
Принцип:
пользователь не должен случайно раскрывать геолокацию, личные связи или коммерческие действия.
________________________________________
5.5. Личные данные
User Cabinet может показывать и управлять личными данными, которые нужны платформе.
К ним могут относиться:
•	имя / ник; 
•	email; 
•	язык; 
•	базовый регион; 
•	avatar; 
•	account status; 
•	linked auth provider; 
•	consent / policies acceptance. 
Чувствительные данные не должны без необходимости передаваться в другие модули.
UI должен явно разделять:
•	публичные данные; 
•	приватные данные; 
•	служебные данные; 
•	данные, используемые для безопасности. 
________________________________________
5.6. Роль пользователя
User Cabinet должен показывать текущий статус пользователя:
•	Spacer; 
•	VIP Spacer; 
•	PRO; 
•	Business Partner relation, если есть; 
•	Moderator / Editor / Admin, если применимо. 
Но User Cabinet не должен самостоятельно менять роли без backend-авторизации.
Для роли можно показывать:
•	что даёт роль; 
•	какие возможности доступны; 
•	что нужно для повышения; 
•	статус VIP; 
•	PRO eligibility / status; 
•	связанные консоли. 
Примеры:
•	VIP видит срок действия статуса. 
•	PRO видит ссылку в PRO Console. 
•	Business Partner видит ссылку в Business Console. 
•	Admin видит ссылку в Admin Console. 
________________________________________
5.7. Связь со Space
User Cabinet связан со Space, но не заменяет его.
User Cabinet может показывать:
•	ссылку на публичный Space profile; 
•	количество постов; 
•	последние публикации; 
•	группы; 
•	social visibility settings; 
•	social reputation summary. 
Space остаётся владельцем:
•	постов; 
•	групп; 
•	репостов; 
•	social feed; 
•	social profile extensions. 
________________________________________
5.8. Связь с Connect
User Cabinet может показывать краткий блок Connect:
•	read-only Points summary / projection;
•	Badges preview; 
•	Referral summary; 
•	активные Missions; 
•	voucher summary; 
•	Quest rewards summary. 
Но детальная экономика должна открываться в Connect UI.
Правило:
User Cabinet показывает краткое состояние. Connect показывает полную экономику и прогресс.
________________________________________
5.9. Связь с Missions
User Cabinet может показывать персональные Missions как часть onboarding и развития пользователя.
Примеры:
•	“заполни профиль”; 
•	“добавь аватар”; 
•	“подключи уведомления”; 
•	“сделай первый пост”; 
•	“получи первый voucher”; 
•	“пройди первый Quest”. 
Missions UI может быть встроен в User Cabinet, но backend-владельцем остаётся Missions Service.
________________________________________
5.10. Что User Cabinet не должен делать
User Cabinet не должен:
•	быть социальной лентой; 
•	заменять Connect; 
•	владеть Points; 
•	владеть Missions; 
•	хранить Space posts; 
•	управлять RF-партнёрами; 
•	создавать Rielt listings; 
•	выполнять Admin-функции без роли; 
•	скрыто менять user roles на frontend. 
________________________________________
5.11. Главная формула User Cabinet
User Cabinet управляет аккаунтом, приватностью и личной поверхностью пользователя.
Space показывает социальную жизнь.
Connect показывает прогресс и экономику.
Missions направляют пользователя к следующим действиям.

6. Connect UI
Connect UI — пользовательский интерфейс экономики, прогресса и наград в Go2Asia.
Главный принцип:
Connect = UI-хаб, не backend-service.
Connect объединяет для пользователя данные из разных сервисов, но не владеет экономической логикой.
________________________________________
6.1. Points
Connect UI показывает:
•	read-only Points summary / projection;
•	историю начислений; 
•	историю списаний; 
•	pending internal reward status;
•	источники Points; 
•	доступные internal use scenarios where runtime policy permits.
Displayed Points values are projections for user understanding. Projection != ledger truth, visible != spendable, available != payout.
Connect не должен сам считать баланс.
Источник истины — Points Service.
________________________________________
6.2. Referral
Connect UI показывает:
•	реферальный код; 
•	реферальную ссылку; 
•	приглашённых пользователей; 
•	activation status; 
•	conditional/internal referral value;
•	referral participation / reward status;
•	VIP-зависимые referral-механики. 
Источник истины — Referral Service.
Referral UI wording must not imply income, commission, passive earnings, MLM, payout or partner settlement.
________________________________________
6.3. Badges
Connect UI показывает:
•	полученные бейджи; 
•	прогресс к новым бейджам; 
•	уровни бейджей; 
•	статусные отметки; 
•	PRO / VIP / Quest / RF достижения. 
Источник истины — Badges / NFT layer.
На текущем этапе badges = off-chain achievements.
NFT — future extension.
________________________________________
6.4. Vouchers
Connect UI может показывать:
•	active vouchers; 
•	claimed vouchers; 
•	redeemed vouchers; 
•	expired vouchers; 
•	voucher history; 
•	QR / code для активного ваучера; 
•	связанный RF partner; 
•	связанный Rielt listing, если применимо; 
•	связанный PRO. 
Источник истины — RF / Voucher layer.
Connect только отображает voucher status и ведёт пользователя к нужному действию.
________________________________________
6.5. Quest Rewards
Connect UI показывает:
•	завершённые квесты; 
•	полученные награды; 
•	pending quest rewards; 
•	связанные badges; 
•	Points от Quest; 
•	историю completion. 
Источник истины:
•	Quest Service — completion/progress; 
•	Points Service — начисления; 
•	Badges layer — achievements. 
Connect не должен сам решать, завершён ли Quest.
________________________________________
6.6. Missions Progress
Connect UI показывает:
•	активные Missions; 
•	прогресс; 
•	completed Missions; 
•	reward status; 
•	mission chains; 
•	next suggested actions. 
Источник истины — Missions Service.
Важно:
Connect показывает Missions, но не владеет ими.
________________________________________
6.7. Future G2A / NFT
В будущем Connect UI может показывать:
•	future G2A/token projection;
•	token eligibility; 
•	future externalization / withdrawal review status if separately activated;
•	future wallet-linking status if separately activated;
•	on-chain NFT status; 
•	blockchain transaction status. 
Но это future layer.
Источник истины:
•	Token Service; 
•	Badges / NFT layer; 
•	Blockchain Gateway indirectly. 
Connect не должен напрямую работать с blockchain operations.
This section is future-only. It does not create current withdrawable token, financial wallet, liquidity, bridge, token transfer, NFT marketplace, payout, settlement or investment semantics.
________________________________________
6.8. Connect как UI-хаб
Connect собирает в одном интерфейсе:
•	Points; 
•	Referral; 
•	Badges; 
•	Vouchers; 
•	Quest rewards; 
•	Missions; 
•	future tokenomics. 
Но backend ownership остаётся распределённым.
Формула:
Points считает.
Referral связывает.
Badges отмечают.
RF/Voucher выдаёт ваучеры.
Quest завершает квесты.
Missions направляют.
Tokenomics расширяет.
Connect показывает.
________________________________________
6.9. Что Connect UI не должен делать
Connect UI не должен:
•	начислять Points; 
•	менять ledger; 
•	создавать referral graph; 
•	создавать Missions; 
•	выдавать Badges; 
•	менять voucher status; 
•	валидировать Quest completion; 
•	выполнять blockchain операции; 
•	становиться backend-domain service. 
________________________________________
6.10. Главная формула Connect UI
Connect UI — это витрина личной экономики пользователя, а не владелец экономики.
 

7. Missions UI
Missions UI — интерфейс надэкосистемных целей пользователя. Он показывает, какие действия пользователь может выполнить внутри Go2Asia, какой прогресс уже достигнут и какие награды могут быть получены.
Главный принцип:
Missions UI направляет пользователя по экосистеме, но не заменяет Quest, Connect или доменные модули.
________________________________________
7.1. Active Missions
Active Missions — текущие доступные или начатые миссии пользователя.
Интерфейс должен показывать:
•	название; 
•	описание; 
•	прогресс; 
•	CTA; 
•	срок действия, если есть; 
•	связанную награду; 
•	модуль, где нужно выполнить действие. 
Примеры:
•	“Заполни профиль” 
•	“Сделай первый пост” 
•	“Получи первый ваучер” 
•	“Пройди первый Quest” 
•	“Пригласи друга” 
________________________________________
7.2. Completed Missions
Completed Missions показывают историю выполненных целей.
UI может отображать:
•	дату completion; 
•	полученную награду; 
•	связанную активность; 
•	badge, если был выдан; 
•	переход к деталям. 
Этот раздел важен для ощущения прогресса и накопленной ценности.
________________________________________
7.3. Mission Chains
Mission Chains — цепочки связанных миссий.
Пример:
1.	Заполни профиль 
2.	Сделай первый пост 
3.	Получи 5 реакций 
4.	Попади в Blog 
5.	Получи Badge 
Chains нужны для:
•	onboarding; 
•	удержания; 
•	progression; 
•	обучения пользователя экосистеме. 
________________________________________
7.4. Onboarding Missions
Onboarding Missions помогают новому пользователю освоиться.
Примеры:
•	добавить аватар; 
•	выбрать город интереса; 
•	подписаться на группу; 
•	открыть Guru; 
•	сохранить первое место; 
•	сделать первый Space post; 
•	claim-нуть первый voucher. 
Цель onboarding missions — не “нагрузить задачами”, а мягко провести пользователя по ключевым возможностям Go2Asia.
________________________________________
7.5. Contextual Missions
Contextual Missions появляются в зависимости от контекста пользователя.
Например:
•	пользователь рядом с RF-партнёром → “получи ваучер рядом” 
•	пользователь в городе с активным событием → “посети событие” 
•	пользователь смотрит Rielt listing → “активируй housing offer” 
•	пользователь завершил Quest → “поделись отчётом в Space” 
•	пользователь часто читает Blog → “сохрани 3 места из статьи” 
Contextual Missions могут отображаться в:
•	Guru; 
•	Connect; 
•	Atlas; 
•	RF; 
•	Rielt; 
•	Quest; 
•	Space. 
________________________________________
7.6. PRO / Business Missions
Missions UI должен поддерживать разные роли.
PRO Missions
Для PRO:
•	подключить партнёра; 
•	заполнить профиль партнёра; 
•	создать первый offer; 
•	помочь партнёру получить первый claim; 
•	создать Quest; 
•	проверить listing; 
•	провести event. 
Business Missions
Для Business Partner:
•	заполнить профиль; 
•	добавить филиал; 
•	привязать Atlas place; 
•	создать первый offer; 
•	получить первый voucher claim; 
•	подтвердить первый redeem; 
•	ответить на feedback. 
Эти миссии должны вести PRO и бизнес к операционной зрелости.
________________________________________
7.7. Reward Intent Display
Missions UI может показывать ожидаемую награду:
•	Points; 
•	Badge; 
•	доступ; 
•	multiplier; 
•	voucher; 
•	future G2A eligibility if separately activated.
Но UI должен отображать это аккуратно:
•	“награда ожидает подтверждения”; 
•	“награда начислена”; 
•	“награда не начислена из-за ошибки”; 
•	“требуется проверка”. 
Важно:
Missions UI показывает reward status, но не исполняет награду.
Points / Badges process internal rewards only where runtime-backed; Token/G2A remains future-only unless separately activated.
________________________________________
7.8. Связь с Connect
Connect — главный дом для общего Missions progress.
Connect может показывать:
•	активные миссии; 
•	прогресс; 
•	completed missions; 
•	rewards; 
•	chains; 
•	next actions. 
Missions UI внутри Connect должен быть главным обзорным экраном.
________________________________________
7.9. Связь с Guru
Guru может показывать contextual missions:
•	рядом есть место; 
•	рядом есть RF-партнёр; 
•	рядом есть Quest; 
•	рядом есть событие; 
•	рядом есть voucher. 
Guru не владеет Missions, а только показывает user-relevant CTA.
________________________________________
7.10. Связь со Space
Space может быть источником social missions:
•	сделать пост; 
•	получить реакции; 
•	сделать репост; 
•	вступить в группу; 
•	оставить отзыв; 
•	поделиться Quest completion. 
Space UI может показывать mission hints, но не должен сам считать progress.
________________________________________
7.11. Связь с RF
RF может показывать missions вокруг партнёров и ваучеров:
•	получить первый voucher; 
•	redeem voucher; 
•	оставить отзыв о партнёре; 
•	PRO подключил партнёра; 
•	Business Partner создал offer. 
RF создаёт доменные события, Missions Service считает progress.
________________________________________
7.12. Связь с Quest
Quest может закрывать ecosystem missions через события:
•	quest.completed; 
•	quest.task.completed; 
•	quest.proof.submitted. 
Но внутри Quest UI используются Tasks, а не Missions.
Пример:
•	Quest Task: “Сделай фото у места” 
•	Ecosystem Mission: “Пройди первый квест” 
________________________________________
7.13. Что Missions UI не должен делать
Missions UI не должен:
•	начислять Points; 
•	выдавать Badges; 
•	валидировать Quest proof; 
•	создавать RF offers; 
•	менять voucher status; 
•	подменять Quest Tasks; 
•	считать progress локально без backend; 
•	смешивать onboarding tips с confirmed Missions. 
________________________________________
7.14. Главная формула Missions UI
Missions UI показывает пользователю путь через экосистему.
Доменные модули создают события.
Missions Service считает прогресс.
Economy Layer исполняет награды.

8. PRO Console
PRO Console — рабочий интерфейс PRO-спейсера. Это не обычный пользовательский кабинет, а операционная поверхность для кураторства, партнёрской работы, создания квестов, поддержки Rielt-листингов и участия в развитии экосистемы.
Главный принцип:
PRO Console = curator workspace.
PRO не владеет доменами, но помогает запускать, проверять, сопровождать и развивать их.
________________________________________
8.1. PRO Dashboard
PRO Dashboard должен показывать сводку работы PRO:
•	закреплённые RF-партнёры; 
•	активные branches; 
•	активные offers / vouchers; 
•	Rielt listings под кураторством; 
•	Quest drafts / published quests; 
•	события и контент; 
•	pending actions; 
•	rewards summary; 
•	performance metrics. 
Dashboard должен помогать PRO понять:
•	что требует внимания; 
•	где есть незавершённый onboarding; 
•	какие офферы работают; 
•	где есть claim / redeem активность; 
•	где нужен ответ или mediation. 
________________________________________
8.2. RF Partner Onboarding
PRO Console должна поддерживать подключение бизнес-партнёров.
Сценарии:
•	создать заявку на партнёра; 
•	заполнить базовый профиль; 
•	указать контактное лицо; 
•	выбрать business category; 
•	помочь с описанием; 
•	отправить на проверку; 
•	отслеживать статус onboarding. 
Важно:
PRO помогает подключить партнёра, но финальная верификация может требовать RF moderation / Admin approval.
________________________________________
8.3. Partner Branches / Business Lines
PRO Console должна учитывать уточнённую RF-модель:
•	BusinessPartner; 
•	BusinessLine; 
•	PartnerBranch; 
•	PartnerBranchBusinessLine; 
•	Atlas place reference. 
PRO может помогать:
•	добавить business line; 
•	добавить branch; 
•	выбрать Atlas place; 
•	предложить новое место, если его нет; 
•	указать, какие направления доступны в филиале; 
•	проверить адрес, фото и описание. 
Важно:
PRO не создаёт окончательную Atlas-географию напрямую.
Если места нет, создаётся place proposal / pending draft.
________________________________________
8.4. Offers / Vouchers Visibility
PRO должен видеть offers и vouchers своих партнёров.
Интерфейс может показывать:
•	активные offers; 
•	draft offers; 
•	expired offers; 
•	claimed vouchers; 
•	redeemed vouchers; 
•	conversion rate; 
•	проблемные claims; 
•	near-now / on-site сигналы; 
•	какие офферы требуют обновления. 
PRO не обязательно должен управлять каждым voucher вручную. Его роль:
•	visibility; 
•	помощь; 
•	escalation; 
•	консультация партнёра; 
•	анализ эффективности. 
________________________________________
8.5. Rielt Listings
PRO Console должна поддерживать работу с Rielt listings, если PRO курирует housing-партнёра.
PRO может:
•	создать listing draft; 
•	заполнить описание; 
•	добавить media references; 
•	привязать geo / Atlas; 
•	связать listing с RF partner / branch; 
•	связать listing с offers / vouchers; 
•	отправить listing на публикацию; 
•	отслеживать активность. 
Важно:
Rielt listing остаётся в Rielt Service.
Partner / branch / vouchers остаются в RF Service.
PRO Console только объединяет действия в удобный workflow.
Основной CTA в Rielt остаётся voucher-first, а не direct chat.
________________________________________
8.6. Quest Authoring
PRO Console может включать Quest authoring tools.
PRO может:
•	создать quest draft; 
•	выбрать город; 
•	добавить route; 
•	добавить Tasks; 
•	привязать Atlas places; 
•	добавить RF / voucher tasks; 
•	привязать Pulse events; 
•	настроить proof; 
•	отправить квест на review; 
•	смотреть completion statistics. 
Важно:
внутри Quest используются Tasks, не Missions.
PRO не должен сам начислять rewards. Он только задаёт reward profile / expectation, а выполнение идёт через Economy Layer.
________________________________________
8.7. Event / Content Participation
PRO может участвовать в Pulse / Blog / Space сценариях.
Возможности:
•	предложить событие; 
•	стать организатором события; 
•	предложить материал в Blog; 
•	вести группу в Space; 
•	рекомендовать Space-пост для Blog; 
•	публиковать экспертный контент; 
•	сопровождать локальные подборки. 
Но PRO Console не должна превращаться в полноценную CMS всего контента. Для редакционного контроля нужны Editor / Admin flows.
________________________________________
8.8. PRO Rewards / Analytics
PRO Console должна показывать вклад PRO в экосистему.
Метрики:
•	подключённые партнёры; 
•	активные branches; 
•	созданные offers; 
•	voucher claim / redeem activity; 
•	Rielt listing activity; 
•	Quest completions; 
•	Space / Blog contributions; 
•	referral impact; 
•	internal Points received / contribution summary where runtime-backed;
•	Badges; 
•	future G2A eligibility. 
Важно:
аналитика PRO должна быть прозрачной, но расчёт наград не должен происходить на frontend. PRO rewards/contribution wording is not commission, payout, income or settlement authority.
Источник данных:
•	RF Service; 
•	Rielt Service; 
•	Quest Service; 
•	Points Service; 
•	Referral Service; 
•	Badges layer; 
•	Missions Service future; 
•	Analytics Service future. 
________________________________________
8.9. Что PRO Console не должна делать
PRO Console не должна:
•	выдавать себе Points; 
•	менять ledger; 
•	финально утверждать RF status без moderation rules; 
•	создавать Atlas places напрямую без approval; 
•	владеть voucher lifecycle; 
•	владеть Rielt domain; 
•	владеть Quest domain; 
•	превращаться в Admin Console; 
•	превращаться в CRM общего назначения; 
•	открывать real-time chat как основной workflow. 
________________________________________
8.10. Главная формула PRO Console
PRO Console — это рабочая поверхность доверенного куратора.
PRO помогает партнёрам, жилью, квестам и контенту войти в экосистему, но доменная правда остаётся в соответствующих backend-сервисах.

9. Business Console
Business Console — рабочий интерфейс бизнес-партнёра Go2Asia / RF Asia. Он нужен, чтобы партнёр мог управлять своим присутствием в экосистеме: профилем, направлениями бизнеса, филиалами, офферами, ваучерами и базовой статистикой.
Главный принцип:
Business Console = simple partner workspace.
Интерфейс должен быть максимально простым, потому что партнёр приходит не “администрировать платформу”, а получать клиентов и управлять предложениями.
________________________________________
9.1. Partner Profile
Business Console должна позволять партнёру управлять базовым профилем бизнеса:
•	название; 
•	описание; 
•	категория; 
•	логотип / фото; 
•	контакты; 
•	языки обслуживания; 
•	статус Russian Friendly; 
•	связанные PRO; 
•	публичные данные карточки партнёра. 
Профиль партнёра принадлежит RF Service.
Business Console только отображает и редактирует разрешённые поля через API.
________________________________________
9.2. Business Lines
Business Line — направление бизнеса партнёра.
Примеры:
•	кафе; 
•	ресторан; 
•	массаж; 
•	туры; 
•	трансфер; 
•	аренда жилья; 
•	коворкинг; 
•	локальный сервис. 
Business Console должна позволять:
•	добавить направление; 
•	описать направление; 
•	включить / отключить направление; 
•	связать направление с филиалами; 
•	связать направление с offers. 
Это важно для партнёров со смешанной моделью бизнеса.
________________________________________
9.3. Branches
Branch — конкретное физическое присутствие партнёра.
Business Console должна позволять:
•	добавить филиал; 
•	указать адрес; 
•	выбрать Atlas place; 
•	указать этаж / зону / unit, если филиал внутри контейнера; 
•	добавить часы работы; 
•	привязать business lines; 
•	добавить фото; 
•	включить / выключить филиал; 
•	видеть статус проверки. 
Branch принадлежит RF Service и должен иметь корректную geo-связь с Atlas.
________________________________________
9.4. Atlas Place Linking / Place Proposal
Партнёр не должен создавать канонический Atlas place напрямую.
Правильный flow:
1.	Партнёр ищет существующее место в Atlas. 
2.	Если место найдено — привязывает branch к нему. 
3.	Если места нет — создаёт place proposal / pending draft. 
4.	PRO может помочь заполнить или проверить proposal. 
5.	Atlas / RF moderator утверждает или отклоняет создание места. 
6.	После утверждения branch получает canonical atlas_place_id. 
Это защищает платформу от дублей, неправильных координат и хаоса в географии.
________________________________________
9.5. Offers
Business Console должна позволять партнёру создавать и управлять offers.
Offer может быть:
•	скидкой; 
•	бонусом; 
•	free item; 
•	premium offer; 
•	сезонным предложением; 
•	предложением для VIP; 
•	предложением для Quest / Mission. 
Партнёр должен видеть:
•	draft offers; 
•	active offers; 
•	paused offers; 
•	expired offers; 
•	offer limits; 
•	offer conditions. 
Offer принадлежит RF / Voucher layer.
________________________________________
9.6. Vouchers
Voucher — конкретная пользовательская реализация offer.
Business Console должна показывать:
•	claimed vouchers; 
•	active vouchers; 
•	redeemed vouchers; 
•	expired vouchers; 
•	canceled vouchers; 
•	QR / code; 
•	пользователя, если это разрешено правилами приватности; 
•	связанный offer; 
•	связанный branch; 
•	связанного PRO. 
Партнёр должен понимать, какие ваучеры уже выданы и какие требуют действия.
________________________________________
9.7. Claim / Redeem
Business Console должна поддерживать claim / redeem lifecycle.
Claim
Claim происходит, когда пользователь получает / покупает / активирует ваучер.
После claim партнёр должен получить:
•	уведомление; 
•	данные offer; 
•	статус ваучера; 
•	urgency mode; 
•	basic user contact, если разрешено; 
•	PRO contact, если применимо. 
Redeem
Redeem происходит, когда пользователь использует ваучер.
Business Console должна позволять:
•	отсканировать QR; 
•	ввести код вручную; 
•	подтвердить redeem; 
•	увидеть ошибку, если ваучер уже использован / истёк / отменён; 
•	передать спорный случай на PRO / support. 
________________________________________
9.8. Stats
Business Console должна показывать простую и полезную статистику:
•	просмотры профиля; 
•	просмотры offers; 
•	claim count; 
•	redeem count; 
•	conversion rate; 
•	active vouchers; 
•	expired vouchers; 
•	популярные offers; 
•	branch performance; 
•	basic customer activity; 
•	вклад PRO, если применимо. 
Статистика должна быть понятной бизнесу, а не только разработчикам.
________________________________________
9.9. Communication After Voucher Claim
После voucher claim коммуникация должна идти не через классический чат, а через controlled communication model.
Business Console может показывать:
•	уведомления; 
•	claim details; 
•	optional thread; 
•	structured reply; 
•	contact request; 
•	escalation to PRO. 
Сценарии:
•	Scheduled — партнёр может ответить позже. 
•	Near-now — партнёр получает high-priority сигнал. 
•	On-site — QR/code должен быть достаточным для redeem без переписки. 
PRO подключается как:
•	переводчик; 
•	посредник; 
•	escalation layer; 
•	куратор доверия. 
________________________________________
9.10. Что Business Console не должна делать
Business Console не должна:
•	быть CRM общего назначения; 
•	создавать Atlas places напрямую; 
•	начислять Points; 
•	управлять PRO contribution / reward decisions;
•	владеть Rielt listings; 
•	становиться мессенджером; 
•	обходить voucher lifecycle; 
•	управлять чужими branches / offers; 
•	выполнять Admin moderation без роли. 
________________________________________
9.11. Главная формула Business Console
Business Console помогает партнёру управлять своим RF-присутствием и ваучерами.
Географию утверждает Atlas / moderation flow.
Ваучеры живут в RF / Voucher layer.
Коммуникация после claim идёт через notifications, optional threads и PRO escalation.

10. Admin Console
Admin Console — внутренний интерфейс команды Go2Asia для управления пользователями, ролями, контентом, модерацией, партнёрами, ваучерами, экономикой и системными настройками.
Главный принцип:
Admin Console = operational control layer.
Она не заменяет доменные сервисы, а даёт команде безопасный интерфейс управления ими.
________________________________________
10.1. Users / Roles
Admin Console должна позволять:
•	искать пользователей; 
•	просматривать профиль; 
•	видеть роли; 
•	менять статус пользователя; 
•	назначать VIP / PRO; 
•	назначать Moderator / Editor / Admin; 
•	блокировать / разблокировать аккаунт; 
•	смотреть базовую историю активности; 
•	видеть связанные партнёрские / PRO / business-связи. 
Любое изменение роли должно:
•	проходить через backend; 
•	логироваться; 
•	иметь audit trail; 
•	требовать нужных прав. 
________________________________________
10.2. Content Management
Admin / Editor Console должна поддерживать управление контентом:
•	статьи Blog; 
•	guides; 
•	подборки; 
•	Pulse events; 
•	curated Space content; 
•	media references; 
•	статусы публикации; 
•	редакционные правки. 
Editor не должен получать доступ к экономике или системным настройкам, если это не требуется его роли.
________________________________________
10.3. Atlas Moderation
Atlas moderation нужна для контроля географической truth.
Админ / редактор может:
•	проверять новые place proposals; 
•	дедуплицировать места; 
•	исправлять координаты; 
•	утверждать commercial places; 
•	проверять container places; 
•	связывать place с RF branch; 
•	управлять статусом публикации; 
•	просматривать историю изменений. 
Особенно важно для RF / Business Console: партнёр может предложить место, но финальное утверждение должно проходить через moderation flow.
________________________________________
10.4. RF Moderation
RF moderation отвечает за качество партнёрского слоя.
Admin Console должна поддерживать:
•	проверку новых Business Partners; 
•	утверждение RF status; 
•	проверку business lines; 
•	проверку branches; 
•	проверку PRO ↔ Partner links; 
•	review partner profile changes; 
•	контроль offers; 
•	проверку suspicious voucher activity; 
•	деактивацию партнёра; 
•	снятие RF status. 
RF moderation не должна смешиваться с Points ledger или Rielt listing ownership.
________________________________________
10.5. Rielt Moderation
Rielt moderation нужна для качества housing discovery.
Admin / Moderator может:
•	проверять listing drafts; 
•	утверждать публикацию; 
•	скрывать listing; 
•	проверять media; 
•	проверять geo references; 
•	проверять связь с RF partner / branch; 
•	контролировать claims, если listing связан с voucher flow; 
•	работать с жалобами. 
Важно:
Rielt v1 не является booking platform.
Moderation проверяет listing quality и trust, а не ведёт сделки.
________________________________________
10.6. Quest Moderation
Quest moderation нужна для контроля пользовательского experience layer.
Admin / Moderator может:
•	проверять quest drafts; 
•	утверждать публикацию; 
•	проверять Tasks; 
•	проверять route references; 
•	проверять proof rules; 
•	проверять RF / Pulse / Atlas references; 
•	скрывать проблемные квесты; 
•	рассматривать спорные proof cases; 
•	отключать квесты при abuse. 
Важно:
внутри Quest используются Tasks, не Missions.
________________________________________
10.7. Voucher / Economy Audit
Admin Console должна иметь ограниченный audit-интерфейс для economy-related сценариев.
Он может показывать:
•	voucher claims; 
•	voucher redeems; 
•	suspicious voucher activity; 
•	Points transactions; 
•	reward intents; 
•	referral anomalies; 
•	PRO reward eligibility; 
•	badge assignments; 
•	future token events. 
Доступ к этому разделу должен быть строго ограничен.
Sensitive actions:
•	ручное начисление Points; 
•	отмена voucher redeem; 
•	корректировка reward; 
•	блокировка referral rewards; 
•	override badge; 
•	future token externalization review placeholder, if separately activated.
Все такие действия требуют audit log и reason.
________________________________________
10.8. Reports / Abuse
Admin Console должна поддерживать работу с жалобами и злоупотреблениями.
Источники:
•	Space posts; 
•	reactions; 
•	reviews; 
•	threads; 
•	Rielt listings; 
•	RF partners; 
•	Quest proof; 
•	voucher claims; 
•	referral activity. 
Интерфейс должен позволять:
•	просмотреть жалобу; 
•	увидеть контекст; 
•	принять решение; 
•	скрыть объект; 
•	ограничить пользователя; 
•	передать на escalation; 
•	закрыть report. 
________________________________________
10.9. System Settings
Admin Console может включать системные настройки, но доступ должен быть максимально ограничен.
Примеры:
•	feature flags; 
•	module availability; 
•	reward rules; 
•	voucher limits; 
•	role configuration; 
•	moderation thresholds; 
•	notification templates; 
•	staging/debug controls. 
System settings не должны быть доступны обычным модераторам или редакторам.
________________________________________
10.10. Что Admin Console не должна делать
Admin Console не должна:
•	обходить backend ownership; 
•	редактировать данные напрямую в обход API; 
•	смешивать роли Moderator / Editor / Admin; 
•	быть единственным местом бизнес-логики; 
•	выполнять blockchain операции напрямую; 
•	заменять observability tools; 
•	открывать sensitive actions без audit. 
________________________________________
10.11. Главная формула Admin Console
Admin Console управляет качеством, безопасностью и операционным контролем экосистемы.
Она работает поверх доменных сервисов, но не нарушает их ownership.

11. Notification / Threads UI
Notification / Threads UI — интерфейс уведомлений и лёгкой асинхронной коммуникации внутри Go2Asia.
Главный принцип:
Go2Asia не строит классический мессенджер.
Пользователь получает уведомление, видит объект, понимает контекст и при необходимости отвечает в object-bound thread.
________________________________________
11.1. Internal Notification Feed
Internal notification feed — внутренняя лента уведомлений пользователя.
Она может показывать:
•	новые реакции; 
•	ответы в thread; 
•	voucher claim / redeem status; 
•	изменения по offer; 
•	ответы партнёра; 
•	действия PRO; 
•	завершение Quest; 
•	выполнение Mission; 
•	начисление Points; 
•	получение Badge; 
•	referral events; 
•	системные сообщения. 
Notification feed должна быть доступна из:
•	User Cabinet; 
•	Connect; 
•	Space; 
•	PRO Console; 
•	Business Console; 
•	Admin Console. 
Для пользователя это не “чат”, а центр событий:
что произошло, где произошло, какое действие требуется.
________________________________________
11.2. Object-bound Threads
Thread — асинхронная ветка общения, привязанная к конкретному объекту.
Объектом может быть:
•	Rielt listing; 
•	voucher claim; 
•	RF partner; 
•	offer; 
•	Pulse event; 
•	Quest; 
•	Quest proof; 
•	Space post; 
•	support case. 
Thread должен всегда иметь контекст:
•	target_type; 
•	target_id; 
•	participants; 
•	status; 
•	history; 
•	next action. 
Пример:
•	не “чат с партнёром”; 
•	а “обсуждение ваучера #123 по объекту проживания”. 
________________________________________
11.3. Contact Requests
Contact request — структурированный запрос на связь.
Он может появляться в сценариях:
•	пользователь хочет уточнить условия listing; 
•	VIP claim-нул voucher и нужен follow-up; 
•	пользователь задаёт вопрос партнёру; 
•	участник спрашивает организатора события; 
•	PRO хочет связаться с партнёром; 
•	бизнес просит помощи у PRO. 
Contact request может создавать thread, но не обязан открывать real-time chat.
________________________________________
11.4. Voucher Claim Follow-up
После voucher claim UI должен показать понятный post-claim state.
В зависимости от режима:
Scheduled
Пользователь видит:
•	ваучер получен; 
•	партнёр уведомлён; 
•	PRO уведомлён; 
•	ожидайте follow-up или используйте инструкции. 
Near-now
Пользователь видит:
•	срочный запрос отправлен; 
•	партнёр получил high-priority notification; 
•	PRO также уведомлён; 
•	доступен thread / contact instruction. 
On-site
Пользователь видит:
•	QR / code; 
•	инструкцию для предъявления; 
•	статус redeem; 
•	fallback: “показать код вручную”; 
•	escalation to PRO/support при проблеме. 
________________________________________
11.5. No Real-time Messenger
Notification / Threads UI не должен превращаться в мессенджер.
Не делать в текущем canon:
•	universal inbox; 
•	личные диалоги без объекта; 
•	групповые чаты; 
•	read receipts как в мессенджере; 
•	online status; 
•	typing indicator; 
•	WebSocket-first chat. 
Это позволит избежать лишней сложности и сохранить object-bound communication.
________________________________________
11.6. Role of PRO in Escalation
PRO не должен быть ручным участником каждой сделки.
Но PRO должен быть доступен как escalation layer.
PRO подключается, если:
•	партнёр не отвечает; 
•	есть языковой барьер; 
•	возник спор; 
•	нужен перевод; 
•	нужен help-on-site; 
•	voucher redeem не сработал; 
•	listing требует уточнения; 
•	пользователь не понимает условия. 
UI должен показывать:
•	кто PRO-куратор; 
•	когда PRO уведомлён; 
•	доступен ли escalation; 
•	статус обращения; 
•	последний ответ / действие. 
________________________________________
11.7. Что Notification / Threads UI не должен делать
Notification / Threads UI не должен:
•	заменять Space; 
•	становиться мессенджером; 
•	создавать бизнес-логику; 
•	менять voucher status без backend; 
•	подтверждать redeem без RF/Voucher API; 
•	начислять Points; 
•	скрывать объектный контекст общения. 
________________________________________
11.8. Главная формула Notification / Threads UI
Notifications deliver signals. Threads preserve context. PRO handles escalation. Chat is not the core model.

12. Interface ↔ Backend Mapping
Interface ↔ Backend mapping фиксирует, какие backend-сервисы использует каждая интерфейсная поверхность, какие данные она читает, какие действия инициирует и какие требования доступа применяются.
Главный принцип:
UI surface может объединять данные разных сервисов, но не становится владельцем этих данных.
UI Surface	Backend services used	Data read	Data write / actions	Auth requirements	Role requirements
Guru Asia	Geo Layer / Geo Service, Content Service, RF, Rielt, Quest, Pulse, Missions future	nearby objects, places, events, partners, listings, quests, contextual missions	filters, saves, transitions, optional mission CTA	public + authenticated for personal actions	Guest / Spacer / VIP / PRO
Atlas Asia	Content Service, Geo Layer, RF enrichments, media pipeline	countries, cities, districts, places, guides, media refs, RF badges	suggestions / place proposals future	public for read, auth for proposals	Guest read, Spacer+ proposals, Editor/Admin approve
Pulse Asia	Content Service, Atlas refs, media pipeline, Space/Reactions future	events, event details, media, related places	save event, propose event future, reactions future	public read, auth for actions	Guest read, Spacer actions, PRO/Event creator future
Blog Asia	Content Service, Space attribution, media pipeline, Reactions future	articles, authors, related places/events/posts	reactions, save, submission/feature proposal future	public read, auth for actions	Guest read, Spacer actions, Editor publish
Space Asia	Space Service, Feed Service, Reactions Service, User Projection, media pipeline	feeds, posts, groups, profiles, reactions	create post, repost, react, join group, upload media	authenticated for core actions	Spacer+
RF Asia	RF Service, Voucher/Offers, Atlas/Geo, Space/Reactions, media pipeline	partners, branches, business lines, offers, vouchers, social proof	claim voucher, view QR/code, leave reaction/review via Space	public read, auth for claim	Guest read, Spacer/VIP claim rules depending offer
Rielt Market	Rielt Service, RF Service, Voucher/Offers, Atlas/Geo, media pipeline, Reactions future	listings, listing detail, partner/PRO trust, offers, media, geo	voucher-first CTA, save listing, optional contact request/thread	public read, auth for voucher actions	Guest read, VIP/Spacer depending voucher rules
Quest Asia	Quest Service, Atlas/Geo, RF/Voucher, Pulse, media pipeline, Points/Badges indirectly	quests, routes, tasks, progress, rewards preview	start quest, submit proof, complete task, share result	authenticated for progress/actions	Spacer+; PRO for authoring
User Cabinet	Auth/User, User Projection, Space summary, Connect summaries, Notification prefs	profile, account settings, privacy, role, activity summaries	update profile, privacy, notification prefs	authenticated	owner user
Connect UI	Points, Referral, Missions, Badges/NFT, RF/Voucher, Quest, Token future	read-only Points projections, transactions, referrals, missions, badges, vouchers, quest reward summaries	claim-related transitions, view reward status, initiate allowed internal use where policy permits	authenticated	Spacer+; VIP for internal spending rules
Missions UI	Missions Service future, Connect, Guru, Space, RF, Quest events	active missions, progress, chains, rewards status	accept/start mission, navigate to action	authenticated	role-based: Spacer/VIP/PRO/Business
PRO Console	RF, Rielt, Quest, Content/Pulse, Space, Points/Analytics summaries, Atlas proposals	assigned partners, branches, listings, quests, offers, voucher stats	partner onboarding, listing draft, quest draft, place proposal	authenticated	PRO
Business Console	RF, Voucher/Offers, Atlas proposals, Notification/Threads, Analytics	partner profile, business lines, branches, offers, vouchers, stats	edit profile, create offers, redeem voucher, propose place	authenticated	Business Partner / partner representative
Admin Console	Auth/User, Content, Atlas, RF, Rielt, Quest, Points, Referral, Moderation, Analytics	users, roles, content, reports, vouchers, ledger summaries, moderation queues	approve, reject, moderate, role changes, sensitive overrides	authenticated + internal	Admin / Moderator / Editor by section
Notification / Threads UI	Notification Service future, Reactions/Threads, RF/Voucher, Rielt, Quest, Space	notifications, thread summaries, object context	reply, resolve, escalate, mark read	authenticated	participant / PRO / Business / Admin
AI Guide UI future	Recommendation Service, AI Guide, platform data APIs	recommendations, explanations, route suggestions, mission suggestions	preference signals, question prompts	public limited, authenticated for personalization	role-aware
________________________________________
12.1. Mapping Rules
1.	Read operations can aggregate.
UI может читать из нескольких сервисов для одного экрана. 
2.	Write operations must go to the owner service.
Например, voucher claim идёт в RF/Voucher layer, а не в Rielt UI logic. 
3.	UI does not calculate truth.
Баланс Points, Mission progress, Quest completion и voucher status приходят из backend. 
4.	Role checks happen twice.
UI скрывает недоступные действия, backend финально проверяет права. 
5.	Future services must be marked as future.
Missions, Notification, AI, full Tokenomics не должны описываться как уже готовые runtime-сервисы, если они ещё не реализованы. 
________________________________________
12.2. Главная формула Mapping
UI читает широко, пишет строго в сервис-владелец.

13. Navigation Model
Navigation model описывает, как пользователь перемещается по экосистеме Go2Asia: между публичными модулями, личными интерфейсами, консолями ролей, карточками сущностей и конкретными действиями.
Главный принцип:
Навигация должна показывать Go2Asia как единую экосистему, но не стирать модульные границы.
________________________________________
13.1. Global Navigation
Global navigation — основной верхнеуровневый способ перехода между ключевыми зонами Go2Asia.
Она должна включать:
•	Guru; 
•	Atlas; 
•	Pulse; 
•	Blog; 
•	Space; 
•	RF; 
•	Rielt; 
•	Quest; 
•	Connect; 
•	User Cabinet. 
Для авторизованных пользователей global navigation может также показывать:
•	notification icon; 
•	profile menu; 
•	Connect summary; 
•	role-based console links. 
Важно:
Global navigation не должна быть перегружена.
Редкие или ролевые интерфейсы лучше убирать в профильное меню.
________________________________________
13.2. Module Navigation
Каждый модуль должен иметь собственную внутреннюю навигацию.
Примеры:
Atlas
•	countries; 
•	cities; 
•	places; 
•	guides; 
•	themes. 
Pulse
•	events; 
•	calendar; 
•	city filter; 
•	past events / хроника. 
Space
•	feed; 
•	groups; 
•	profile; 
•	liked / saved; 
•	create post. 
RF
•	partners; 
•	offers; 
•	vouchers; 
•	categories; 
•	nearby. 
Rielt
•	listings; 
•	filters; 
•	map; 
•	saved listings; 
•	voucher offers. 
Quest
•	quests; 
•	active quest; 
•	tasks; 
•	progress; 
•	completed quests. 
Connect
•	Points; 
•	Referral; 
•	Badges; 
•	Vouchers; 
•	Missions; 
•	future G2A. 
________________________________________
13.3. Role-based Entry Points
Навигация должна адаптироваться к роли пользователя.
Guest
Видит:
•	публичные модули; 
•	CTA регистрации; 
•	ограниченный просмотр. 
Spacer / VIP
Видит:
•	User Cabinet; 
•	Connect; 
•	Space; 
•	Missions; 
•	vouchers / rewards; 
•	personal progress. 
PRO
Дополнительно видит:
•	PRO Console; 
•	partner onboarding; 
•	Quest authoring; 
•	Rielt listing workflow; 
•	PRO contribution / internal reward status.
Business Partner
Видит:
•	Business Console; 
•	offers; 
•	vouchers; 
•	branches; 
•	redeem tools. 
Admin / Moderator / Editor
Видит:
•	Admin Console; 
•	moderation queues; 
•	content management; 
•	role-specific tools. 
Важно:
Role-based entry point не означает, что UI может заменить backend access control.
________________________________________
13.4. Cross-module Transitions
Главная сила Go2Asia — переходы между модулями.
Примеры:
•	Guru → Atlas place; 
•	Guru → RF partner; 
•	Guru → Rielt listing; 
•	Guru → Quest; 
•	Atlas place → nearby events; 
•	Atlas place → RF partners nearby; 
•	Pulse event → Space discussion / post; 
•	Blog article → Atlas places; 
•	Blog article → Rielt listings; 
•	Space post → Blog featured article; 
•	RF partner → voucher claim; 
•	Rielt listing → voucher-first CTA; 
•	Quest task → Atlas place / RF partner / Pulse event; 
•	Mission → конкретное действие в нужном модуле; 
•	Connect → Points / Missions / Voucher / Quest reward. 
Cross-module transitions должны быть явными и контекстными.
Пользователь должен понимать:
•	откуда он пришёл; 
•	куда он переходит; 
•	зачем этот переход нужен; 
•	какое действие ожидается. 
________________________________________
13.5. Deep Links
Go2Asia должна поддерживать deep links к ключевым сущностям.
Примеры:
•	/atlas/countries/thailand/cities/phuket 
•	/atlas/places/{place_slug} 
•	/pulse/events/{event_slug} 
•	/blog/{article_slug} 
•	/space/posts/{post_id} 
•	/rf/partners/{partner_id} 
•	/rielt/listings/{listing_id} 
•	/quest/{quest_slug} 
•	/connect/missions/{mission_id} 
•	/connect/vouchers/{voucher_id} 
Deep links нужны для:
•	SEO; 
•	sharing; 
•	notifications; 
•	email; 
•	Telegram later; 
•	push; 
•	QR flows; 
•	admin review; 
•	PRO workflows. 
________________________________________
13.6. Entity Cards
EntityCard — универсальный навигационный элемент Go2Asia.
EntityCard может представлять:
•	place; 
•	event; 
•	article; 
•	post; 
•	partner; 
•	branch; 
•	listing; 
•	quest; 
•	mission; 
•	voucher; 
•	user / PRO. 
EntityCard должна включать:
•	тип сущности; 
•	заголовок; 
•	краткое описание; 
•	медиа; 
•	статус; 
•	trust badges; 
•	geo info; 
•	primary CTA; 
•	secondary actions. 
Примеры CTA:
•	“Открыть место” 
•	“Получить ваучер” 
•	“Начать квест” 
•	“Посмотреть listing” 
•	“Продолжить Mission” 
•	“Сохранить” 
•	“Поделиться” 
EntityCard помогает строить единый UX между модулями.
________________________________________
13.7. Navigation Context
При переходах между модулями желательно сохранять контекст.
Примеры:
•	пользователь пришёл из Guru в Rielt listing; 
•	пользователь открыл voucher из Mission; 
•	пользователь попал в RF partner из Blog article; 
•	пользователь открыл Quest task из Atlas place. 
Контекст можно использовать для:
•	back navigation; 
•	analytics; 
•	attribution; 
•	personalized recommendations; 
•	reward / Mission attribution. 
________________________________________
13.8. Главная формула Navigation Model
Global navigation даёт карту экосистемы.
Module navigation даёт локальную структуру.
EntityCards связывают сущности.
Deep links делают систему shareable.
Role-based entry points открывают нужные рабочие поверхности.

14. EntityCard UI Pattern
EntityCard — универсальный UI-паттерн карточки объекта в Go2Asia. Он нужен, чтобы разные сущности экосистемы отображались единообразно: места, события, партнёры, жильё, квесты, миссии, ваучеры и профили.
Главный принцип:
Разные домены — единый карточный язык интерфейса.
________________________________________
14.1. Place Card
Place Card представляет место из Atlas / Geo Layer.
Может содержать:
•	название места; 
•	тип / категорию; 
•	город / район; 
•	изображение; 
•	расстояние; 
•	краткое описание; 
•	tags; 
•	RF badge, если место связано с партнёрским слоем; 
•	related actions. 
Основные CTA:
•	“Открыть место” 
•	“Показать на карте” 
•	“Сохранить” 
•	“Посмотреть рядом” 
________________________________________
14.2. Event Card
Event Card представляет событие из Pulse.
Может содержать:
•	название события; 
•	дату и время; 
•	город / место; 
•	категорию; 
•	hero image; 
•	статус: upcoming / today / past; 
•	организатора; 
•	related place; 
•	количество интересующихся / участников future. 
Основные CTA:
•	“Открыть событие” 
•	“Сохранить” 
•	“Показать место” 
•	“Добавить в план” future 
________________________________________
14.3. Listing Card
Listing Card представляет объект жилья из Rielt Market.
Может содержать:
•	название / тип жилья; 
•	фото; 
•	город / район; 
•	ориентировочную цену; 
•	amenities; 
•	RF / trust badge; 
•	PRO curator; 
•	доступные voucher offers; 
•	статус listing. 
Основной CTA должен быть voucher-first:
•	“Получить ваучер” 
•	“Активировать предложение” 
•	“Открыть listing” 
Не основной CTA:
•	“Написать владельцу” 
________________________________________
14.4. Partner Card
Partner Card представляет RF-партнёра, branch или business presence.
Может содержать:
•	название партнёра; 
•	business line; 
•	branch / location; 
•	RF status; 
•	фото; 
•	активные offers; 
•	рейтинг / social proof; 
•	PRO curator; 
•	distance / nearby; 
•	voucher availability. 
Основные CTA:
•	“Открыть партнёра” 
•	“Посмотреть офферы” 
•	“Получить ваучер” 
•	“Показать на карте” 
________________________________________
14.5. Quest Card
Quest Card представляет квест из Quest Asia.
Может содержать:
•	название квеста; 
•	город / район; 
•	длительность; 
•	сложность; 
•	количество Tasks; 
•	route preview; 
•	reward preview; 
•	статус: not started / active / completed; 
•	creator / PRO; 
•	связанные RF / Atlas / Pulse объекты. 
Основные CTA:
•	“Открыть квест” 
•	“Начать” 
•	“Продолжить” 
•	“Посмотреть маршрут” 
Важно:
В Quest Card использовать термин Tasks, не Missions.
________________________________________
14.6. Mission Card
Mission Card представляет ecosystem Mission.
Может содержать:
•	название миссии; 
•	описание; 
•	тип миссии; 
•	прогресс; 
•	reward preview; 
•	срок действия, если есть; 
•	связанный модуль; 
•	статус: available / active / completed / expired. 
Основные CTA:
•	“Начать” 
•	“Продолжить” 
•	“Перейти к действию” 
•	“Получить награду”, если reward готова 
Mission Card не должна использоваться для Quest Tasks.
________________________________________
14.7. Voucher Card
Voucher Card представляет ваучер / offer claim.
Может содержать:
•	название offer; 
•	партнёра; 
•	branch; 
•	условия; 
•	срок действия; 
•	статус: issued / active / redeemed / expired / canceled; 
•	QR / code; 
•	linked listing / partner / quest, если есть; 
•	PRO contact / escalation status. 
Основные CTA:
•	“Показать QR” 
•	“Показать код” 
•	“Открыть партнёра” 
•	“Открыть listing” 
•	“Запросить помощь PRO”, если применимо 
________________________________________
14.8. Profile Card
Profile Card представляет пользователя, PRO, автора или бизнес-представителя.
Может содержать:
•	имя; 
•	avatar; 
•	роль / статус; 
•	badges; 
•	краткое bio; 
•	social metrics; 
•	PRO specialization; 
•	linked groups / content; 
•	trust indicators. 
Основные CTA:
•	“Открыть профиль” 
•	“Посмотреть публикации” 
•	“Посмотреть квесты PRO” 
•	“Посмотреть партнёров PRO”, если доступно 
________________________________________
14.9. Общие элементы EntityCard
Каждая EntityCard должна иметь единый набор базовых зон:
•	media / icon; 
•	title; 
•	subtitle; 
•	meta info; 
•	status; 
•	trust / badge zone; 
•	primary CTA; 
•	secondary actions; 
•	source module indicator. 
Это позволит использовать карточки в:
•	Guru; 
•	Atlas; 
•	Pulse; 
•	Blog; 
•	Space; 
•	RF; 
•	Rielt; 
•	Quest; 
•	Connect; 
•	Missions UI. 
________________________________________
14.10. Главная формула EntityCard
EntityCard превращает разные объекты Go2Asia в единый понятный интерфейсный язык.

15. Design System Principles
Design system Go2Asia должен обеспечивать единый визуальный и поведенческий язык для всех модулей: Guru, Atlas, Pulse, Blog, Space, RF, Rielt, Quest, Connect, Missions и консолей.
Главный принцип:
Go2Asia должен ощущаться как единая экосистема, а не набор разных сайтов.
________________________________________
15.1. Mobile-first
Интерфейсы должны проектироваться в первую очередь для мобильного использования.
Особенно это важно для:
•	Guru nearby; 
•	RF voucher claim / redeem; 
•	Rielt listing discovery; 
•	Quest tasks; 
•	Pulse events; 
•	Space posting; 
•	Notifications; 
•	Connect progress. 
Desktop может давать расширенные возможности для:
•	PRO Console; 
•	Business Console; 
•	Admin Console; 
•	content editing; 
•	analytics; 
•	moderation. 
________________________________________
15.2. Reusable Components
UI должен строиться из переиспользуемых компонентов:
•	EntityCard; 
•	buttons; 
•	badges; 
•	tabs; 
•	filters; 
•	search inputs; 
•	map panels; 
•	media gallery; 
•	status blocks; 
•	notification items; 
•	progress bars; 
•	voucher QR blocks; 
•	role labels; 
•	empty state blocks. 
Это снижает хаос и ускоряет развитие модулей.
________________________________________
15.3. Cards / Lists / Maps
Основные паттерны отображения:
Cards
Для:
•	places; 
•	partners; 
•	listings; 
•	quests; 
•	missions; 
•	vouchers; 
•	articles; 
•	profiles. 
Lists
Для:
•	feed; 
•	transactions; 
•	notifications; 
•	vouchers; 
•	events; 
•	moderation queues; 
•	partner branches. 
Maps
Для:
•	Guru; 
•	Atlas places; 
•	Rielt listings; 
•	RF partners; 
•	Quest routes; 
•	nearby scenarios. 
Карточки и карты должны быть связаны: объект на карте должен открывать соответствующую EntityCard.
________________________________________
15.4. Empty States
Empty states должны быть осмысленными.
Не просто:
“Нет данных”
А:
•	объяснить, почему пусто; 
•	предложить следующее действие; 
•	показать CTA; 
•	не пугать пользователя. 
Примеры:
•	“У вас пока нет активных ваучеров — найдите предложение рядом.” 
•	“Вы ещё не начали миссии — начните с заполнения профиля.” 
•	“Пока нет listings в этом районе — попробуйте другой город.” 
•	“У партнёра пока нет активных офферов.” 
________________________________________
15.5. Loading States
Loading states должны быть едиными и спокойными.
Использовать:
•	skeleton cards; 
•	loading map markers; 
•	progress indicators; 
•	optimistic UI только там, где безопасно; 
•	clear blocking states для критичных действий. 
Особенно важно:
•	voucher claim; 
•	redeem; 
•	proof upload; 
•	Points transaction; 
•	role-sensitive actions. 
________________________________________
15.6. Error States
Error states должны быть понятными и actionable.
Ошибка должна объяснять:
•	что произошло; 
•	можно ли повторить; 
•	требуется ли авторизация; 
•	нужен ли другой статус; 
•	куда перейти. 
Примеры:
•	“Не удалось получить ваучер. Попробуйте ещё раз.” 
•	“Этот offer уже истёк.” 
•	“Для траты Points нужен VIP-статус.” 
•	“У вас нет прав редактировать этот listing.” 
•	“Proof не загрузился — проверьте соединение.” 
________________________________________
15.7. Trust Badges
Trust badges — важная часть Go2Asia.
Они могут показывать:
•	RF status; 
•	verified partner; 
•	PRO curator; 
•	verified listing; 
•	completed Quest; 
•	VIP; 
•	PRO; 
•	official content; 
•	editor pick; 
•	safe / moderated status. 
Trust badges должны быть визуально едиными и не перегружать карточки.
________________________________________
15.8. Status Labels
Status labels нужны для всех сущностей с lifecycle.
Примеры:
Voucher
•	issued; 
•	active; 
•	redeemed; 
•	expired; 
•	canceled. 
Listing
•	draft; 
•	pending review; 
•	published; 
•	paused; 
•	archived. 
Quest
•	not started; 
•	active; 
•	completed; 
•	under review. 
Mission
•	available; 
•	active; 
•	completed; 
•	expired. 
Offer
•	draft; 
•	active; 
•	paused; 
•	expired. 
Status labels должны быть короткими и одинаково оформленными во всех модулях.
________________________________________
15.9. Media Handling
Все модули должны использовать единый подход к медиа.
Правила:
•	backend отдаёт media keys / references; 
•	frontend собирает public URL через media resolver; 
•	использовать fallback image; 
•	поддерживать hero image и gallery; 
•	не хардкодить публичные URLs; 
•	не смешивать разные media schemas без необходимости. 
Media особенно важна для:
•	Atlas places; 
•	Pulse events; 
•	Blog articles; 
•	Space posts; 
•	RF partners; 
•	Rielt listings; 
•	Quest proof; 
•	Voucher cards. 
________________________________________
15.10. Главная формула Design System
Единые компоненты, единые статусы, единые карточки, единое доверие, единое обращение с медиа.

16. Access Control in UI
Access control in UI определяет, какие интерфейсные элементы, действия и рабочие поверхности доступны разным ролям пользователя.
Главный принцип:
UI может скрывать недоступные действия, но окончательная проверка прав всегда происходит на backend.
________________________________________
16.1. Guest
Guest — незарегистрированный пользователь.
Может видеть:
•	публичные страницы Atlas; 
•	открытые Blog articles; 
•	часть Pulse events; 
•	публичные RF partner cards; 
•	публичные Rielt listing previews; 
•	публичные Quest previews; 
•	CTA регистрации / входа. 
Не может:
•	публиковать; 
•	ставить реакции; 
•	claim vouchers; 
•	получать Points; 
•	проходить Quest; 
•	видеть Connect; 
•	участвовать в Missions; 
•	пользоваться User Cabinet. 
UI должен мягко вести Guest к регистрации.
________________________________________
16.2. Spacer
Spacer — базовый зарегистрированный пользователь.
Может:
•	иметь профиль; 
•	публиковать в Space; 
•	ставить реакции; 
•	делать репосты; 
•	вступать в группы; 
•	проходить Quest; 
•	получать Points; 
•	участвовать в базовых Missions; 
•	использовать referral; 
•	видеть Connect; 
•	сохранять объекты; 
•	claim-ить доступные vouchers, если offer это разрешает. 
Ограничения:
•	не имеет PRO Console; 
•	не управляет RF partners; 
•	не создаёт Rielt listings как куратор; 
•	не имеет Business Console; 
•	не имеет Admin Console; 
•	может не иметь права тратить Points, если это завязано на VIP. 
________________________________________
16.3. VIP Spacer
VIP Spacer — расширенный пользовательский статус.
Может всё, что Spacer, плюс:
•	тратить Points в разрешённых сценариях; 
•	получать premium vouchers; 
•	участвовать в VIP Missions; 
•	использовать расширенные referral benefits; 
•	получать дополнительные internal rewards where runtime-backed;
•	видеть VIP-only offers; 
•	иметь расширенный Connect experience. 
Важно:
VIP не равен PRO.
VIP — платный / расширенный пользовательский статус.
PRO — доверенная операционная роль.
VIP does not create payout right, commission, settlement authority or financial entitlement.
________________________________________
16.4. PRO
PRO — доверенный куратор / эксперт / амбассадор.
Может:
•	открыть PRO Console; 
•	подключать RF partners через onboarding flow; 
•	помогать с Partner Branches / Business Lines; 
•	создавать или сопровождать Rielt listings; 
•	создавать Quest drafts; 
•	участвовать в event/content workflows; 
•	видеть PRO analytics; 
•	видеть PRO contribution / internal reward status;
•	быть escalation layer по voucher / partner scenarios. 
Ограничения:
•	не является Admin по умолчанию; 
•	не может финально утверждать всё без moderation rules; 
•	не может менять Points ledger; 
•	не может управлять чужими партнёрами вне своей зоны; 
•	не должен обходить RF / Rielt / Quest ownership. 
________________________________________
16.5. Business Partner
Business Partner — представитель партнёра RF.
Может:
•	открыть Business Console; 
•	редактировать свой partner profile; 
•	управлять своими business lines; 
•	управлять своими branches; 
•	создавать / редактировать offers; 
•	видеть свои vouchers; 
•	подтверждать redeem; 
•	смотреть свою статистику; 
•	отвечать в object-bound threads; 
•	взаимодействовать с PRO. 
Ограничения:
•	не управляет чужими партнёрами; 
•	не создаёт Atlas places напрямую; 
•	не меняет Points; 
•	не управляет PRO rewards; 
•	не получает Admin-доступ; 
•	не владеет Rielt как сервисом, даже если связан с housing listing. 
________________________________________
16.6. Moderator / Editor / Admin
Moderator
Может:
•	видеть moderation queues; 
•	рассматривать reports; 
•	скрывать нарушающий контент; 
•	ограничивать problematic activity; 
•	проверять Space / Reactions / Threads / Reviews; 
•	работать с abuse cases. 
Editor
Может:
•	работать с Blog; 
•	редактировать guides; 
•	управлять curated content; 
•	проверять Atlas / Pulse content; 
•	отбирать Space materials для Blog. 
Admin
Может:
•	управлять пользователями; 
•	ролями; 
•	RF / Rielt / Quest oversight; 
•	system settings; 
•	economy audit; 
•	sensitive operations, если разрешено. 
Важно:
Moderator, Editor и Admin — разные роли.
Их нельзя объединять в один “всё можно” интерфейс.
________________________________________
16.7. UI Hiding vs Backend Enforcement
UI должен скрывать недоступные действия, чтобы не путать пользователя.
Примеры:
•	Guest не видит кнопку “Claim voucher”, а видит “Войти, чтобы получить”. 
•	Spacer не видит PRO Console. 
•	Business Partner не видит Admin Console. 
•	PRO не видит чужих partners, если не назначен. 
•	VIP-only offer показывает lock state обычному Spacer. 
Но скрытие кнопки не является безопасностью.
Backend обязан проверять:
•	authentication; 
•	role; 
•	ownership; 
•	resource status; 
•	business rules; 
•	rate limits; 
•	anti-abuse; 
•	sensitive operation permissions. 
Формула:
UI guides. Backend enforces. Audit records.
________________________________________
16.8. Главная формула Access Control
Каждая роль видит только нужные ей поверхности, но ни одно критичное действие не должно полагаться только на frontend-проверку.

17. Runtime Reality vs Future UI
Этот раздел фиксирует, какие интерфейсные поверхности Go2Asia уже существуют, какие находятся в частичной реализации, какие являются target UI, а какие старые интерфейсные предположения больше не считаются актуальными.
Главный принцип:
Не описывать future UI так, будто он уже реализован.
________________________________________
17.1. Already Exists
К текущей interface runtime reality относятся:
•	базовые публичные разделы Atlas; 
•	базовые публичные разделы Pulse; 
•	базовые Blog / content-поверхности; 
•	часть Connect UI; 
•	начальные RF / Rielt / Quest surfaces; 
•	отдельные элементы Space UI; 
•	общие карточные паттерны; 
•	media gallery / image patterns; 
•	базовая frontend shell-навигация; 
•	часть интеграции с backend API. 
Важно:
“Already exists” не означает “готово как продукт”.
Это означает, что интерфейсная поверхность уже есть и должна учитываться при дальнейшем развитии.
________________________________________
17.2. Partial
Частично готовыми считаются интерфейсы, у которых есть основа, но требуется синхронизация с актуальным canon.
Space Asia
Требуется возврат и доработка:
•	feeds; 
•	groups; 
•	reposts; 
•	reactions; 
•	profile projections; 
•	no classic chat; 
•	связь с Blog; 
•	связь с Missions. 
Connect UI
Требует уточнения:
•	Connect как UI-хаб; 
•	Points; 
•	Referral; 
•	Badges; 
•	Vouchers; 
•	Quest rewards; 
•	Missions future; 
•	без Connect Service. 
RF Asia
Требует выравнивания с моделью:
•	BusinessPartner; 
•	BusinessLine; 
•	PartnerBranch; 
•	Offers; 
•	Vouchers; 
•	PRO links; 
•	Atlas place linking. 
Rielt Market
Требует выравнивания с текущим canon:
•	curated housing discovery; 
•	voucher-first CTA; 
•	partner / branch / PRO trust; 
•	no booking; 
•	no payments; 
•	no chat. 
Quest Asia
Требует выравнивания:
•	Quest Tasks вместо Quest Missions; 
•	proof; 
•	progress; 
•	validation; 
•	reward handoff; 
•	route / task UI. 
________________________________________
17.3. Target UI
Target UI — это важные интерфейсы целевой платформы, которые ещё не должны считаться полностью реализованными.
К ним относятся:
•	полноценный User Cabinet; 
•	PRO Console; 
•	Business Console; 
•	Admin Console; 
•	Missions UI; 
•	Notification / Threads UI; 
•	mature Connect dashboard; 
•	AI Guide UI; 
•	advanced Guru; 
•	mature RF / Rielt / Quest workflows; 
•	role-specific analytics surfaces. 
Эти интерфейсы нужно проектировать как future / target, а не как уже готовую runtime reality.
________________________________________
17.4. Deprecated Assumptions
Некоторые старые UI-представления больше не считать актуальными.
1. Connect как backend-центр экономики
Устарело.
Актуально:
Connect UI показывает экономику и прогресс, но не владеет backend-логикой.
________________________________________
2. Quest Missions
Устарело.
Актуально:
В Quest используются Tasks.
Missions — отдельный ecosystem layer.
________________________________________
3. Rielt как marketplace / booking UI
Устарело для v1.
Актуально:
Rielt UI = curated discovery + voucher-first CTA.
Не booking, не payments, не direct chat.
________________________________________
4. Business Console как CRM
Устарело для MVP.
Актуально:
Business Console = простой partner workspace.
Профиль, branches, offers, vouchers, redeem, stats.
________________________________________
5. Space как мессенджер
Устарело.
Актуально:
Space = posts, groups, reposts, reactions.
Communication = notifications + object-bound threads.
________________________________________
6. RF как просто каталог мест
Устарело.
Актуально:
RF UI = partner layer surface: partners, business lines, branches, offers, vouchers, PRO trust.
________________________________________
7. Guru как владелец nearby-данных
Устарело.
Актуально:
Guru UI показывает nearby-контекст, но данные приходят из Geo / domain services.
________________________________________
17.5. Главный вывод
Go2Asia UI сейчас находится в состоянии:
partial platform interface with several real surfaces and several target surfaces.
Следующий этап — не “рисовать всё заново”, а:
•	выровнять существующие интерфейсы с canon; 
•	убрать устаревшие UI-артефакты; 
•	стабилизировать RF / Rielt / Quest surfaces; 
•	затем развивать Cabinet / Consoles / Missions / Notifications.

18. Implementation Sequencing
Implementation sequencing фиксирует рекомендуемый порядок развития интерфейсов Go2Asia.
Главный принцип:
сначала стабилизировать реальные публичные модули и доменные UI, затем строить кабинеты, консоли и надэкосистемные интерфейсы.
________________________________________
18.1. Public Modules Stabilization
Сначала нужно стабилизировать публичные модули:
•	Guru; 
•	Atlas; 
•	Pulse; 
•	Blog; 
•	RF; 
•	Rielt; 
•	Quest; 
•	Space, в минимальном виде. 
Фокус:
•	единая навигация; 
•	единые карточки; 
•	media handling; 
•	корректные ссылки между модулями; 
•	loading / error / empty states; 
•	mobile-first UX; 
•	удаление устаревших mock-состояний. 
________________________________________
18.2. RF / Rielt / Quest Interface Alignment
Следующий приоритет — выравнивание RF, Rielt и Quest с текущим canon.
RF
•	BusinessPartner; 
•	BusinessLine; 
•	PartnerBranch; 
•	offers; 
•	vouchers; 
•	PRO trust; 
•	Atlas place linking. 
Rielt
•	curated housing discovery; 
•	partner / branch / PRO references; 
•	voucher-first CTA; 
•	no booking / payments / chat. 
Quest
•	Quest Tasks, не Missions; 
•	route; 
•	task progress; 
•	proof; 
•	validation; 
•	completion; 
•	reward handoff. 
________________________________________
18.3. User Cabinet / Connect
После стабилизации публичных и доменных экранов — User Cabinet и Connect.
User Cabinet
•	профиль; 
•	настройки; 
•	privacy; 
•	роли; 
•	активность; 
•	notification preferences. 
Connect
•	Points; 
•	Referral; 
•	Badges; 
•	Vouchers; 
•	Quest rewards; 
•	Missions future; 
•	future G2A/NFT placeholders. 
Важно:
Connect UI не должен превращаться в Connect Service.
________________________________________
18.4. PRO / Business Consoles
После этого можно развивать рабочие поверхности ролей.
PRO Console
•	RF onboarding; 
•	Partner Branches; 
•	Rielt listings; 
•	Quest authoring; 
•	PRO analytics; 
•	rewards visibility. 
Business Console
•	partner profile; 
•	business lines; 
•	branches; 
•	offers; 
•	vouchers; 
•	claim / redeem; 
•	stats; 
•	PRO communication / escalation. 
________________________________________
18.5. Admin Console
Admin Console лучше делать после уточнения доменных интерфейсов.
Фокус:
•	users / roles; 
•	content moderation; 
•	Atlas place proposals; 
•	RF moderation; 
•	Rielt moderation; 
•	Quest moderation; 
•	voucher / economy audit; 
•	reports / abuse; 
•	system settings. 
________________________________________
18.6. Space Return
После стабилизации business/commerce и кабинетов нужно вернуться к Space.
Фокус:
•	feed; 
•	groups; 
•	reposts; 
•	reactions; 
•	profile projections; 
•	no classic chat; 
•	social proof для RF/Rielt; 
•	связь с Blog; 
•	связь с Missions. 
________________________________________
18.7. Missions UI Later
Missions UI лучше делать позже, когда есть стабильные события от модулей.
Перед Missions UI нужны:
•	Space actions; 
•	RF voucher events; 
•	Rielt voucher-first flow; 
•	Quest completion; 
•	Referral; 
•	Points; 
•	Badges. 
Missions UI должен начинаться с:
•	onboarding missions; 
•	referral missions; 
•	basic social missions; 
•	voucher/RF missions; 
•	PRO/business missions позже. 
________________________________________
18.8. AI Guide UI Later
AI Guide UI — поздний слой.
Его не стоит делать до накопления данных и стабилизации доменов.
Перед AI Guide нужны:
•	зрелый Atlas / Geo; 
•	RF / Rielt / Quest данные; 
•	user activity signals; 
•	Missions; 
•	Recommendation logic; 
•	safety / grounding rules. 
AI Guide должен помогать, но не становиться source of truth.
________________________________________
18.9. Recommended Order
Рекомендуемый порядок:
1.	Public modules stabilization 
2.	RF / Rielt / Quest interface alignment 
3.	User Cabinet / Connect 
4.	PRO / Business Consoles 
5.	Admin Console 
6.	Space return 
7.	Missions UI 
8.	Notification / Threads UI hardening 
9.	AI Guide UI 
________________________________________
18.10. Exit Criteria
Каждый этап должен завершаться:
•	UI соответствует canon; 
•	backend ownership не нарушен; 
•	роли и доступы корректны; 
•	нет устаревших терминов; 
•	нет mock-экранов вместо runtime truth; 
•	есть loading / error / empty states; 
•	есть closure note. 
Главный критерий:
следующий интерфейсный слой нельзя строить поверх невыравненного предыдущего.

19. Interface Canon Rules
Interface canon rules фиксируют обязательные правила для всех UI-решений Go2Asia. Эти правила нужны, чтобы интерфейсы не нарушали архитектурные границы, не возвращали устаревшие концепции и не создавали ложные ожидания у пользователя или разработчика.
________________________________________
19.1. Connect UI не равен Connect Service
Connect UI — это пользовательская витрина прогресса, экономики и наград.
Он показывает:
•	Points; 
•	Referral; 
•	Badges; 
•	Vouchers; 
•	Quest rewards; 
•	Missions; 
•	future G2A / NFT. 
Но Connect UI не является backend-сервисом и не владеет экономикой.
Правило:
Connect показывает. Points / Referral / Missions / Badges / Tokenomics считают и исполняют.
________________________________________
19.2. Missions UI не равен Quest Tasks
Missions UI показывает надэкосистемные цели пользователя.
Quest Tasks — это задания внутри конкретного квеста.
Нельзя смешивать:
•	Mission = цель уровня экосистемы; 
•	Task = шаг внутри Quest. 
Пример:
•	Mission: “Пройди первый квест”. 
•	Task: “Сделай фото у храма”. 
Правило:
В Quest UI использовать только термин Task / Задание, не Mission / Миссия.
________________________________________
19.3. Rielt CTA = voucher-first
В Rielt Market основной CTA не должен быть “написать владельцу” или “оставить заявку”.
Актуальный canon:
первый прикладной контакт = voucher action.
Основные CTA:
•	“Получить ваучер”; 
•	“Активировать предложение”; 
•	“Получить VIP-бонус”; 
•	“Открыть offer”. 
Rielt UI ведёт пользователя в RF / Voucher flow, а не в booking/chat/inquiry-first модель.
________________________________________
19.4. RF owns partner UI logic
Партнёрская логика принадлежит RF.
RF UI / Business Console должны быть основными поверхностями для:
•	BusinessPartner; 
•	BusinessLine; 
•	PartnerBranch; 
•	RF status; 
•	offers; 
•	vouchers; 
•	PRO links; 
•	claim / redeem. 
Другие UI могут показывать эти данные, но не должны владеть ими.
Примеры:
•	Rielt показывает partner trust, но не создаёт партнёра. 
•	Guru показывает RF-партнёра nearby, но не управляет RF status. 
•	Quest использует RF-точку, но не владеет offer lifecycle. 
________________________________________
19.5. No classic chat
Go2Asia не строит классический мессенджер в текущем canon.
Не делать:
•	universal inbox; 
•	direct personal chat; 
•	group chat; 
•	typing indicator; 
•	online status; 
•	WebSocket-first messaging. 
Делать:
•	notifications; 
•	object-bound threads; 
•	contact requests; 
•	structured replies; 
•	voucher claim follow-up; 
•	PRO escalation. 
Правило:
коммуникация должна быть привязана к объекту и действию.
________________________________________
19.6. Space owns social surfaces, not business flows
Space владеет социальными поверхностями:
•	posts; 
•	reposts; 
•	groups; 
•	feed; 
•	reactions; 
•	social profile; 
•	social proof. 
Но Space не владеет:
•	RF partners; 
•	vouchers; 
•	Rielt listings; 
•	Quest progress; 
•	Points; 
•	Missions; 
•	Business Console flows. 
Space может усиливать бизнес-домены через отзывы, репосты и social proof, но не должен управлять коммерческой логикой.
________________________________________
19.7. UI does not own data truth
UI не должен быть источником истины.
UI может:
•	читать; 
•	отображать; 
•	отправлять действия; 
•	агрегировать view; 
•	вести пользователя по сценарию. 
UI не должен:
•	считать Points balance; 
•	подтверждать Mission completion; 
•	валидировать Quest proof как truth; 
•	менять voucher status локально; 
•	создавать Atlas geography без backend approval; 
•	менять роли пользователя; 
•	решать reward eligibility. 
Правило:
UI вызывает backend. Backend владеет truth.
________________________________________
19.8. Главная формула Interface Canon
UI объединяет опыт, но не нарушает ownership.
Каждый экран должен знать, какой backend-сервис является источником истины для его данных.

20. Glossary
Public Module
Public Module — пользовательский модуль экосистемы, доступный через основной интерфейс Go2Asia.
Примеры:
•	Guru; 
•	Atlas; 
•	Pulse; 
•	Blog; 
•	Space; 
•	RF; 
•	Rielt; 
•	Quest. 
________________________________________
Cabinet
Cabinet — персональная зона пользователя.
В Go2Asia это прежде всего User Cabinet: профиль, настройки, приватность, активность и личные данные.
________________________________________
Console
Console — рабочий интерфейс роли.
Примеры:
•	PRO Console; 
•	Business Console; 
•	Admin Console. 
Console предназначена не для обычного просмотра, а для выполнения операционных задач.
________________________________________
Dashboard
Dashboard — обзорный экран с ключевыми метриками, статусами и действиями.
Примеры:
•	PRO Dashboard; 
•	Business Dashboard; 
•	Connect Dashboard; 
•	Admin Dashboard. 
________________________________________
EntityCard
EntityCard — универсальная карточка объекта Go2Asia.
Может представлять:
•	место; 
•	событие; 
•	listing; 
•	партнёра; 
•	квест; 
•	миссию; 
•	ваучер; 
•	профиль. 
________________________________________
Voucher CTA
Voucher CTA — основной призыв к действию, связанный с ваучером.
Примеры:
•	“Получить ваучер”; 
•	“Активировать предложение”; 
•	“Получить VIP-бонус”. 
Для Rielt v1 это основной CTA вместо “написать владельцу”.
________________________________________
Thread
Thread — асинхронная ветка общения, привязанная к объекту.
Примеры:
•	thread по voucher claim; 
•	thread по listing; 
•	thread по Quest proof; 
•	thread по вопросу к партнёру. 
Thread не является классическим real-time chat.
________________________________________
Notification Feed
Notification Feed — внутренняя лента уведомлений пользователя.
Показывает:
•	реакции; 
•	ответы; 
•	voucher status; 
•	rewards; 
•	Missions; 
•	Quest events; 
•	системные сообщения. 
________________________________________
Mission Card
Mission Card — карточка ecosystem Mission.
Показывает:
•	цель; 
•	прогресс; 
•	награду; 
•	статус; 
•	CTA. 
Mission Card не используется для Quest Tasks.
________________________________________
PRO Console
PRO Console — рабочий интерфейс PRO-спейсера.
Используется для:
•	RF onboarding; 
•	Rielt listings; 
•	Quest authoring; 
•	партнёрской работы; 
•	PRO analytics. 
________________________________________
Business Console
Business Console — рабочий интерфейс бизнес-партнёра.
Используется для:
•	partner profile; 
•	business lines; 
•	branches; 
•	offers; 
•	vouchers; 
•	claim / redeem; 
•	stats. 
________________________________________
Admin Console
Admin Console — внутренний интерфейс команды Go2Asia.
Используется для:
•	пользователей; 
•	ролей; 
•	модерации; 
•	контента; 
•	RF / Rielt / Quest oversight; 
•	economy audit; 
•	системных настроек. 
________________________________________
BFF
BFF / Backend-for-Frontend — backend-слой, который агрегирует данные специально для frontend.
В Go2Asia BFF допустим только как read/composition layer.
Например:
•	Connect BFF; 
•	dashboard BFF. 
BFF не должен владеть доменной логикой.
________________________________________
Read Model
Read Model — подготовленное представление данных для быстрого чтения UI.
Примеры:
•	Connect dashboard summary; 
•	feed projection; 
•	notification list; 
•	nearby layer; 
•	partner stats summary. 
Read model не является source of truth, если только это явно не указано архитектурой.

