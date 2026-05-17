RF Voucher Economy v1 (Target / Legacy SSOT)

Go2Asia — Voucher-driven Engagement & VIP Activation Economy

Stage 6.5.3 product semantics guard: this document is target / legacy economy vocabulary, not public product copy and not current runtime authority. Read it through `../economy_authority_terminology_crosswalk_v1.md`. Points are internal utility, not money. VIP is activation/access context, not payout. Referral/network language is not MLM or passive income. RF/voucher utility is not cashback, settlement, payout or payment rail. G2A, NFT/Totem, on-chain, withdrawal, partner/PRO payout and externalization wording are future-only unless separately approved, legally reviewed, implemented and runtime-backed.

---

1. Назначение
Документ фиксирует экономическую модель Go2Asia, в которой:
•	платформа монетизирует доступ через VIP и PRO статусные продукты;
•	внутренняя экономика построена на Points;
•	ваучеры — основной инструмент потребления Points и вовлечения;
•	премиум-ваучеры may use target/future Points + NFT/Totem compatibility only where separately activated;
•	внешний контур (G2A, on-chain NFT) remains future-only and cannot be inferred from current UX.

Status note: this document describes the target RF voucher economy. Current Points spend and wallet semantics are governed by `../points_policy_v1.md`; referral and network reward semantics are governed by `../referral_network_rewards_policy_v1.md`.

RF voucher spend may be runtime-aligned where implemented, but G2A distribution, NFT/Totem gates, on-chain withdrawal, PRO reward/payout flows, partner settlement, VIP entitlement lifecycle, `referral_unlock`, and network accrual producers are future/target layers unless separately implemented. `referral_locked` exists today; unlock/accrual and hard `lockedPoints` enforcement should not be described as active current runtime.

---

2. Ключевой принцип
Go2Asia монетизирует доступ к utility-сценариям платформы, а не сами транзакции и не денежный вывод Points.

---

3. Двухконтурная модель

3.1 Внутренний контур (основной)
•	Internal utility unit: Points
•	Среда: off-chain internal accounting where runtime-backed
•	Назначение:
o	internal participation value;
o	геймификация;
o	consumption / access utility (ваучеры, квесты; NFT future-only).

3.2 Внешний контур (вспомогательный)
•	Future unit: G2A
•	Future assets: on-chain NFT
•	Назначение:
o	future partner eligibility / externalization review;
o	future PRO recognition review;
o	future externalization only after separate approval.

---

4. Роли
•	Spacer — получает internal Points за подтверждённую активность where runtime-backed
•	VIP — activation/access context for internal utility where runtime-backed; not payout or network income
•	PRO — оператор бизнес-слоя и квестов
•	Бизнес-партнёр (RF) — поставщик товаров/услуг и ваучеров

---

5. Источники монетизации платформы
Единственные источники:
•	VIP-статус — 1000 руб / 30 дней
•	PRO-статус — 30000 руб / год

---

6. Важное ограничение (SSOT)
•	Платформа не берёт комиссию:
o	с ваучеров;
o	с премиум-ваучеров;
o	с квестов;
o	с товаров/услуг партнёров.
•	Оплата товаров/услуг:
o	происходит напрямую бизнес-партнёру;
o	вне экономики платформы.

---

7. Роль ваучера
Ваучер — это:
•	инструмент internal Points utility / access;
•	вход в контакт с бизнесом;
•	маркетинговый инструмент партнёра;
•	future trigger candidate for external layer review (G2A), not current distribution;
•	ключевой элемент VIP utility / access context.

---

8. Типы ваучеров

8.1 Обычный ваучер
•	claim/reserve uses internal Points utility where runtime-backed;
•	может стоить:
o	0 Points;
o	символическое количество;
•	даёт:
o	скидку;
o	бонус;
o	доступ.

8.2 Премиум-ваучер
•	target/future claim requirement may include:
o	Points + рядовой NFT-бейдж;
•	даёт:
o	заметную преференцию;
o	приоритет;
o	более сильную выгоду;
•	external contour remains future-only:
o	G2A eligibility review for business;
o	G2A eligibility review for PRO (по правилам, if separately activated).

---

9. NFT в экономике

9.1 Типы NFT
•	рядовые (расходуемые);
•	достижения (бейджи);
•	редкие (коллекционные, on-chain).

9.2 Источники NFT
•	достижения;
•	future Points / NFT compatibility review, not current exchange

9.3 Роль NFT
•	подтверждение достижений;
•	геймификация;
•	доступ к премиум-ваучерам;
•	механизм сжигания Points.

---

10. Lifecycle ваучера
OFFER → VOUCHER → CLAIM / RESERVE (internal Points utility / future Points+NFT compatibility)
→ CONTACT (репост)
→ OFFLINE SERVICE
→ (optional) CONFIRMATION
→ future G2A eligibility review, if separately activated

---

11. Inquiry Baseline
Первый контакт = claim / reservation of voucher utility
•	нет стадии “спросить”;
•	пользователь фиксирует интерес через действие;
•	ваучер может быть бесплатным (0 Points).

---

12. Коммуникация
•	нет встроенного чата;
•	используется модель:
👉 репост как форма взаимодействия
При claim / reservation of voucher utility:
•	создаётся пост в Space;
•	тегируются:
o	бизнес;
o	PRO;
o	пользователь;
•	ответ — через репост.

---

13. Points экономика

13.1 Internal participation recognition (база)
•	пост: +1000
•	лайки: +1
•	реферал: +5000 (locked)

13.2 Типы Points
•	available — internal use only where runtime-backed (not payout)
•	locked — conditional referral Points
•	network-generated — invited-activity participation signal, not network income

---

14. VIP как Economic Activation Layer
VIP выполняет три функции:

14.1 Internal Utility Access
•	можно использовать Points internally where runtime-backed

14.2 Conditional Referral Utility
•	разблокировка referral Points

14.3 Target Referral Participation Rules
•	bounded internal Points participation rules, if separately runtime-backed
•	not MLM, passive income, commission, payout or guaranteed earnings

---

15. Реферальная экономика
VIP may receive bounded internal Points participation recognition where runtime-backed:
•	target direct invited-user activity recognition
•	target second-level invited-activity recognition
Примеры:
•	пост реферала (1000) → +100
•	реферал пригласил VIP → +500

---

16. PRO экономика
PRO may receive internal contribution recognition:
Points:
•	за квесты;
•	за активность партнёров.
Future G2A eligibility vocabulary:
•	за выпуск ваучера (после 3 покупок);
•	за выпуск премиум-ваучера;
•	за квесты (после 3 покупок).

---

17. Бизнес-партнёр
Получает business utility:
•	клиентов;
•	маркетинг;
•	future G2A eligibility review (за премиум-ваучеры), if separately activated.

---

18. Внешний контур (G2A)
Future-only layer; no current withdrawal, liquidity, wallet, payout or settlement activation.
Бизнес:
•	may become eligible for future G2A review за премиум-ваучеры
PRO:
•	may become eligible for future G2A review after qualifying voucher events
Пользователь:
•	future on-chain externalization review only; no current NFT withdrawal

---

19. Главный экономический цикл
Активность → Points → future NFT compatibility
→ (VIP) → Ваучеры / Премиум-ваучеры
→ Контакт → Офлайн услуга
→ future G2A review → reuse / utility cycle

---

20. Growth Loop
Активность → Points → Conditional Points
→ invited-user participation context
→ transparent VIP access explanation
→ internal utility / participation cycle

---

21. Главный драйвер роста
Conditional Points + internal utility context → VIP access decision, without coercive loss/income framing

---

22. Ключевые принципы
1.	Points accumulation/use should remain policy-balanced
2.	VIP may provide access context where runtime-backed
3.	NFT/Totem — future compatibility layer, not current asset promise
4.	Ваучер = вход в офлайн
5.	Бизнес не платит платформе
6.	PRO receives internal contribution recognition where policy-backed
7.	G2A — внешний слой
8.	Монетизация = доступ / subscription context, not payout promise
9.	Коммуникация = репост
10.	VIP = активация экономики

---

23. Ключевой инсайт
Go2Asia — это internal utility and access model,
where user-facing language must avoid money, investment, payout and passive-income framing.

---

24. Финальная формула
Points → future NFT compatibility → (VIP) → Voucher utility → Offline service → future G2A review