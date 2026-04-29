Connect UI Content Pack v1
•	Project: Go2Asia 
•	Module: Connect Asia 
•	Scope: UI copy / labels / empty states / placeholders / frontend alignment support 
•	Status: content pack for existing Connect UI alignment 
•	Date: 2026-04-25 
•	Document role: copy and UI-state source for Connect frontend alignment 
________________________________________
1. Purpose
Этот content pack нужен для приведения существующего фронтенда Connect Asia к текущей backend reality.
Мы сохраняем текущую визуальную структуру Connect:
•	Главная 
•	Кошелёк 
•	Уровни 
•	Рефералы 
•	Миссии 
•	Статистика 
Но заменяем mock/fake economy на честные данные, пустые состояния и future placeholders.
Connect Asia сейчас — это не crypto wallet, не NFT-marketplace, не tokenomics dashboard и не инвестиционный кабинет.
Актуальная формула:
Connect Asia — личный центр активности, Points, рефералов и off-chain достижений пользователя в Go2Asia.
________________________________________
2. Tone of voice
Использовать
•	Ваш вклад 
•	Активность 
•	Points за участие 
•	История начислений 
•	Приглашения 
•	Рефералы 
•	Бейджи 
•	Достижения 
•	Получено 
•	Ожидает активации 
•	Начисление проверяется 
•	Появится позже 
•	Данные появятся после первых действий 
Не использовать
•	доход 
•	прибыль 
•	инвестиции 
•	вывод средств 
•	пополнить баланс 
•	крипта 
•	NFT 
•	токен 
•	кошелёк как финансовый wallet 
•	staking 
•	yield 
•	trading 
•	курс токена 
•	гарантированный заработок 
•	партнёрский доход 
•	пассивный доход 
Допустимо использовать “заработано Points” только в контексте внутренней системы участия, без финансового смысла.
________________________________________
3. Main navigation labels
Оставляем текущие разделы:
1.	Главная 
2.	Кошелёк 
3.	Уровни 
4.	Рефералы 
5.	Миссии 
6.	Статистика 
Но смысл некоторых разделов в MVP меняется.
Главная
Short description:
Краткий обзор вашей активности, Points, приглашений и бейджей.
Кошелёк
MVP meaning:
История Points и начислений.
Preferred subtitle:
Смотрите баланс Points и историю начислений за действия в Go2Asia.
Avoid:
•	управление активами 
•	вывод 
•	пополнение 
•	обмен 
•	G2A 
•	NFT 
Уровни
MVP meaning:
Future placeholder.
Title:
Уровни
Subtitle:
Система уровней появится позже. Сейчас Connect показывает реальные Points, рефералы и бейджи.
Рефералы
Subtitle:
Приглашайте друзей и отслеживайте реферальные начисления Points.
Миссии
MVP meaning:
Future placeholder / static guidance only.
Title:
Миссии
Subtitle:
Персональные задания появятся позже. Пока начните с квестов, приглашений и бейджей.
Статистика
MVP meaning:
Future placeholder.
Title:
Статистика
Subtitle:
Аналитика активности появится позже, когда появятся backend-агрегаты.
________________________________________
4. Dashboard copy
Hero
Title:
Connect Asia
Subtitle option 1:
Ваш личный центр активности, Points и достижений в Go2Asia.
Subtitle option 2:
Следите за вкладом в экосистему, приглашениями и бейджами.
Subtitle option 3:
Все важные следы вашей активности в Go2Asia — в одном месте.
Greeting
Title pattern:
Привет, {name}!
Subtitle:
Вот ваш текущий прогресс в Go2Asia.
Fallback if no name:
Привет!
Subtitle:
Здесь появится ваша активность, Points и достижения.
________________________________________
5. Dashboard cards
Points card
Title:
Ваши Points
Value format:
{points} Points
Description:
Points отражают вашу активность в Go2Asia.
Updated text:
•	Обновлено сегодня 
•	Обновлено недавно 
•	Обновлено {date} 
Empty state:
У вас пока нет Points. Они появятся после первых действий в Go2Asia.
CTA:
Смотреть историю
________________________________________
Recent activity card
Title:
Последние начисления
Empty state:
История начислений появится после первых действий в Go2Asia.
CTA:
Показать все
Error:
Не удалось загрузить последние начисления. Попробуйте ещё раз.
________________________________________
Referral summary card
Title:
Ваши приглашения
Fields:
•	Приглашено всего 
•	Активировались 
•	Ожидают активации 
•	Заработано Points 
Empty state:
Пригласите друга, чтобы начать реферальную историю.
CTA:
Перейти к рефералам
________________________________________
Badges summary card
Title:
Ваши бейджи
Subtitle:
Последние достижения
Empty state:
Завершите первый квест, чтобы получить первый бейдж.
CTA:
Смотреть все бейджи
________________________________________
Static next-step card
Title:
Что можно сделать дальше
Allowed items:
•	Завершите первый квест 
o	Получите первый бейдж и Points за участие. 
•	Пригласите друга 
o	Поделитесь реферальной ссылкой и отслеживайте статус приглашения. 
•	Посмотрите доступные бейджи 
o	Узнайте, какие достижения уже доступны. 
Important:
Не называть этот блок “Миссии дня”.
Не обещать reward, если backend его не возвращает.
________________________________________
6. Transaction action labels
Use this mapping for Points transactions.
Backend action	UI label
registration	Регистрация
first_login	Первый вход
quest_completed	Квест завершён
referral_bonus_referrer	Бонус за приглашённого пользователя
event_registration	Регистрация на событие
space_post_created	Публикация в Space
rf_voucher_redeemed	RF-ваучер использован
rielt_listing_created	Объявление в Rielt
badge_awarded	Бейдж получен
unknown / fallback	Активность Go2Asia
Transaction row copy
Pattern:
{actionLabel}
{sourceLabel} · {date}
+{amount} Points
Examples:
•	Квест завершён
Quest Asia · сегодня
+100 Points 
•	Бонус за приглашённого пользователя
Referral · вчера
+50 Points 
•	Регистрация на событие
Pulse Asia · 3 дня назад
+25 Points 
________________________________________
7. Source service labels
Source service	UI label
quest-service	Quest Asia
referral-service	Referral
points-service	Points
content-service	Go2Asia
pulse-service	Pulse Asia
space-service	Space Asia
rf-service	Russian Friendly
rielt-service	Rielt Market
unknown	Go2Asia
________________________________________
8. Wallet / Points section copy
Even if section label remains “Кошелёк”, visible MVP copy should avoid financial wallet language.
Page title
Кошелёк
Preferred subtitle
История Points и начислений за вашу активность.
Alternative subtitle:
Смотрите баланс Points и действия, за которые были начисления.
Points explanation card
Title:
Points — след вашей активности
Text:
Points начисляются за действия в Go2Asia: квесты, события, приглашения и другие подтверждённые активности.
CTA:
Как получать Points
Alternative CTA:
Посмотреть активность
Empty transaction state
Здесь появится история Points после первых действий.
Error state
Не удалось загрузить историю Points. Попробуйте ещё раз.
Hide / remove in MVP
•	G2A Tokens 
•	NFT Бейджи как активы 
•	Пополнить 
•	Вывести 
•	Обменять на G2A 
•	Маркетплейс NFT 
•	Активы 
•	USD equivalent 
Future placeholder if needed
Title:
Расширенные возможности появятся позже
Text:
G2A, wallet и on-chain функции не входят в текущий MVP Connect. Сейчас здесь отображаются только Points и история начислений.
Use sparingly. Prefer hiding rather than showing this prominently.
________________________________________
9. Referrals copy
Page title
Рефералы
Subtitle:
Приглашайте друзей и отслеживайте начисления Points.
Referral link card
Title:
Ваша реферальная ссылка
Fields:
•	Код приглашения 
•	Ссылка для приглашения 
CTA:
Скопировать ссылку
Helper:
Поделитесь ссылкой с другом. Когда приглашённый пользователь станет активным, начисление появится в истории Points.
Success toast:
Ссылка скопирована.
Error toast:
Не удалось скопировать ссылку. Скопируйте её вручную.
________________________________________
Referral summary labels
•	Приглашено всего 
•	Активировались 
•	Ожидают активации 
•	Заработано Points 
Empty:
Пока нет рефералов. Пригласите первого друга, чтобы начать.
________________________________________
Referral earnings statuses
Backend status	UI label	Description
pending	Ожидает активации	Пользователь приглашён, но ещё не стал активным.
activated	Активирован	Пользователь стал активным, начисление может ещё обрабатываться.
rewarded	Начислено	Points за приглашение уже начислены.
reward_missing	Начисление проверяется	Активация есть, но начисление пока не найдено в ledger.
reward_missing copy
Short:
Начисление проверяется
Full:
Активация есть, начисление проверяется.
Tooltip/help:
Мы видим активацию приглашённого пользователя, но связанное начисление Points пока не найдено.
Do not say:
•	ошибка 
•	потеряно 
•	деньги не начислены 
•	компенсация 
•	ручное начисление 
________________________________________
Referral user labels
Backend may return only IDs. Use privacy-safe labels:
•	Пользователь …{last4} 
•	Приглашённый пользователь 
•	Реферал …{last4} 
Examples:
•	user_7ab2 → Пользователь …7AB2 
•	user_9cd1 → Пользователь …9CD1 
Do not invent:
•	names 
•	avatars 
•	profile photos 
•	city 
•	role 
•	PRO/VIP status 
________________________________________
Forbidden referral copy
Do not use:
•	партнёрский доход 
•	доход с партнёров 
•	бизнес-рефералы 
•	G2A за партнёров 
•	двухуровневая система 
•	пассивный доход 
•	заработок с сети 
•	пригласи бизнес и получи G2A 
If old UI has “Пригласи бизнес”, hide it or mark as future only.
________________________________________
10. Badges copy
Page title
Бейджи
Subtitle:
Ваши достижения в Go2Asia.
My badges
Title:
Мои бейджи
Empty:
У вас пока нет бейджей.
Empty hint:
Завершите первый квест, чтобы получить первый бейдж.
Badge catalog
Title:
Доступные бейджи
Subtitle:
Выполняйте действия в Go2Asia, чтобы открывать новые достижения.
Awarded badge label
Получен
Not awarded label
Пока не получен
Badge detail labels
•	Категория 
•	Получен 
•	Достижение 
•	Описание 
________________________________________
11. Badge labels
first_quest_completed
Title:
Первый квест завершён
Description:
Вы завершили первый квест в Go2Asia.
Empty hint:
Завершите первый квест, чтобы получить этот бейдж.
Category label:
Квесты
________________________________________
first_referral_activated
Title:
Первый активный реферал
Description:
Первый приглашённый пользователь стал активным.
Empty hint:
Пригласите друга и дождитесь его активации.
Category label:
Рефералы
Note:
Показывать только если бейдж есть в backend catalog. Не обещать auto-award, если он ещё не подключён.
________________________________________
first_space_post
Title:
Первый пост в Space
Description:
Вы сделали первую публикацию в Space Asia.
Empty hint:
Опубликуйте первый пост в Space, когда эта возможность будет подключена к бейджам.
Category label:
Space
Note:
Показывать как доступный badge только если backend catalog его возвращает.
________________________________________
12. Levels section placeholder
Current backend does not support levels, XP, progress, seasons or benefits.
Page title
Уровни
Main placeholder title
Система уровней появится позже
Placeholder text
Сейчас Connect показывает реальные данные: Points, историю начислений, рефералы и бейджи. Уровни и прогресс будут добавлены после отдельной backend-модели.
CTA options
•	Вернуться на главную 
•	Посмотреть бейджи 
•	Посмотреть активность 
Do not show
•	Level 1 / Level 12 
•	XP 
•	progress bar 
•	next level 
•	season 
•	benefits 
•	multiplier 
•	reward tiers 
•	“до следующего уровня” 
•	“+1000 Points до Level Up” 
If keeping visual shell
Use disabled card:
Title:
Уровни в разработке
Text:
Мы не показываем прогресс уровней без backend-данных. Пока отслеживайте Points и бейджи.
Badge:
Появится позже
________________________________________
13. Missions section placeholder
Current backend does not support Connect missions. Quest Asia is a separate module.
Page title
Миссии
Main placeholder title
Персональные задания появятся позже
Placeholder text
Connect пока не ведёт отдельные миссии. Вы можете проходить квесты в Quest Asia, приглашать друзей и получать бейджи за реальные действия.
Allowed static guidance
Title:
Что можно сделать сейчас
Items:
•	Пройти квест 
o	Найдите доступные квесты в Quest Asia. 
•	Пригласить друга 
o	Поделитесь реферальной ссылкой. 
•	Посмотреть бейджи 
o	Узнайте, какие достижения уже доступны. 
Do not call these items missions unless backend missions exist.
Do not show
•	mission progress 
•	active missions count 
•	rewards 
•	XP 
•	daily missions 
•	seasonal missions 
•	mission filters 
•	“начать миссию” 
•	fake mission cards from mockData 
________________________________________
14. Statistics section placeholder
Current backend does not support analytics, rankings, source breakdowns, leaderboards or season pulse.
Page title
Статистика
Main placeholder title
Аналитика активности появится позже
Placeholder text
Сейчас Connect показывает только проверенные backend-данные: Points, начисления, рефералы и бейджи. Расширенная статистика появится после отдельного слоя агрегатов.
CTA options
•	Посмотреть активность 
•	Перейти к рефералам 
•	Посмотреть бейджи 
Do not show
•	top 10% 
•	место в рейтинге 
•	leaderboard 
•	source breakdown percentages 
•	G2A balance 
•	season pulse 
•	прогноз 
•	средний доход 
•	total spent 
•	average transaction if not backend-backed 
•	rank comparisons 
If keeping visual shell
Card title:
Статистика в разработке
Card text:
Мы не показываем рейтинги и графики без backend-агрегатов.
Badge:
Появится позже
________________________________________
15. G2A / NFT / Wallet replacement rules
G2A
Current status:
Not supported in MVP.
Action:
•	hide G2A cards 
•	hide G2A balances 
•	hide G2A rewards 
•	hide conversion buttons 
•	hide USD equivalents 
Placeholder only if needed:
G2A будет рассмотрен позже после отдельного architecture и legal pass.
Prefer not to show this to ordinary users.
________________________________________
NFT
Current status:
Not supported in MVP.
Important:
Current badges are off-chain achievements, not NFT.
Action:
•	replace NFT badge card with “Бейджи” 
•	remove NFT wallet tab 
•	remove NFT marketplace copy 
•	remove “легендарных NFT” 
•	remove “активные эффекты” 
Replacement:
Бейджи
Ваши достижения в Go2Asia.
________________________________________
Wallet
Current status:
Only Points balance and transactions are supported.
Action:
•	keep “Кошелёк” route if product wants continuity; 
•	visually reframe as Points history; 
•	remove deposit/withdraw/exchange. 
Preferred copy:
История Points и начислений
________________________________________
16. Empty states
Global loading
Загружаем данные Connect…
Global error
Не удалось загрузить данные Connect. Попробуйте ещё раз.
CTA:
Повторить
Section error
Не удалось загрузить этот раздел.
CTA:
Попробовать ещё раз
No Points
У вас пока нет Points. Они появятся после первых действий в Go2Asia.
No transactions
История начислений появится здесь после первых действий.
No referrals
Пока нет рефералов. Пригласите первого друга, чтобы начать.
No referral earnings
Начисления за приглашения появятся после активации приглашённых пользователей.
No badges
У вас пока нет бейджей. Завершите первый квест, чтобы получить первый бейдж.
Future section empty
Этот раздел появится позже. Сейчас Connect показывает только те данные, которые уже поддержаны backend.
________________________________________
17. Demo mode copy
If demo/mock mode is intentionally enabled:
Badge:
Demo mode
Banner title:
Демо-данные
Banner text:
На этом экране показаны демонстрационные данные. Реальные данные появятся после подключения API.
Button:
Обновить
Important:
Do not silently replace API errors with full mock economy dashboard in production.
________________________________________
18. CTA copy
Safe CTAs
•	Смотреть историю 
•	Перейти к рефералам 
•	Смотреть бейджи 
•	Скопировать ссылку 
•	Посмотреть активность 
•	Вернуться на главную 
•	Повторить 
•	Попробовать ещё раз 
Risky CTAs to avoid
•	Пополнить 
•	Вывести 
•	Обменять 
•	Купить 
•	Продать 
•	Получить доход 
•	Увеличить доход 
•	Заработать больше 
•	Открыть кошелёк 
•	Создать NFT 
•	Mint NFT 
•	Стейкать 
•	Инвестировать 
________________________________________
19. Screen-by-screen copy replacement
Главная
Replace:
•	“G2A Tokens” → hide 
•	“NFT Badges” → “Бейджи” 
•	“Level” → hide or future placeholder 
•	“Активный сезон” → hide 
•	“Миссии дня” → “Что можно сделать дальше” 
•	“+ бонус к прогрессу” → remove 
•	“Кошелёк →” link can remain, but target screen must be Points history 
Keep:
•	referral code card 
•	greeting 
•	Points card 
•	recent activity 
•	card structure 
________________________________________
Кошелёк
Replace visible meaning:
•	“Управляй активами” → “Смотрите Points и историю начислений” 
•	“G2A Токены” → hide 
•	“NFT Бейджи” → hide 
•	“Пополнить” → hide 
•	“Вывести” → hide 
•	“Обменять на G2A” → hide 
•	“История транзакций” → “История начислений” 
Keep:
•	Points balance 
•	transactions 
•	filters if local and honest 
________________________________________
Уровни
Replace screen content with future placeholder.
Keep only:
•	section title 
•	visual shell 
•	short explanation 
•	CTA to activity/badges 
Do not show real-looking progress.
________________________________________
Рефералы
Replace:
•	“Пригласи бизнес” → hide/future 
•	“G2A за партнёров” → hide 
•	“двухуровневая система” → hide unless backend supports it 
•	hardcoded earned zero → use referral earnings 
Keep:
•	referral code/link 
•	copy/share 
•	stats cards 
•	referral list/tree 
•	status rows 
Add:
•	reward_missing state 
________________________________________
Миссии
Replace screen content with static guidance or future placeholder.
Use:
Что можно сделать сейчас
But do not call it mission engine.
Hide:
•	mission rewards 
•	mission progress 
•	XP 
•	filters 
•	daily/seasonal mission claims 
________________________________________
Статистика
Replace with future placeholder.
Hide:
•	top % 
•	rankings 
•	source charts 
•	season pulse 
•	G2A 
•	forecasts 
•	average transaction if not backend aggregate 
________________________________________
20. Final UI rule
Connect UI must answer:
Что я сделал, что получил в Points, кого пригласил и какие бейджи получил?
Connect UI must not pretend to answer:
Сколько у меня токенов, NFT, уровень, доход, место в рейтинге или инвестиционный результат?
________________________________________
21. Recommended next implementation usage
Use this content pack in the next Cursor pass:
Connect Frontend Alignment Slice 1 — Dashboard real data alignment
Primary goals:
•	connect useGetConnectDashboard; 
•	replace dashboard multi-call/mocks; 
•	remove or hide G2A/NFT/levels/season/missions as real dashboard blocks; 
•	show Points, recent activity, referrals summary and badges summary; 
•	use copy from this content pack; 
•	preserve the visual style of existing Connect UI.

