# Connect Asia — Overview  
Legacy / target product overview for Connect Asia user-facing semantics.

Stage 6.5.3 reading guard: current Connect wording must be read through `docs/economy/economy_authority_terminology_crosswalk_v1.md`. Connect is a read-only user-facing projection surface for internal Points/activity/referral/badge summaries where runtime-backed; it is not a financial wallet, bank account, payout surface, token cabinet, NFT marketplace, or runtime economy authority.

Connect Asia показывает пользовательскую активность, внутренние Points, достижения, referral participation summaries and safe activity analytics where backend-backed. G2A, NFT, wallet, on-chain, marketplace, withdrawal and tokenomics surfaces are future-only unless separately approved and implemented.
Это пользовательский слой **internal utility / activity projection**, а не денежная экономика.

---

## Основные функции модуля

### 1. Internal Points Utility
- Внутренние Points за подтверждённые действия на платформе (UGC, отзывы, миссии, квесты), where runtime-backed.
- Внутреннее использование Points по правилам платформы; это не обмен на деньги, G2A, payout или withdrawal.
- История внутренних начислений / списаний как read-only projection.

### 2. Уровни (XP Levels)  
- XP начисляется за любое полезное действие.  
- Повышение уровней даёт бонусы: скидки, VIP-функции, ускорение Points.

### 3. Достижения (Badges)  
- Одноразовые internal achievements за выполнение специальных условий.
- Current badges are off-chain achievements; NFT language remains future-only unless separately activated.

### 4. Future NFT / Collectible Compatibility
- Future-only compatibility layer for rare / collectible achievements.
- Не является текущим NFT wallet, marketplace, mint/burn, liquidity or payout feature.

### 5. Реферальная программа  
- Referral code/link and invited-user participation summaries.
- Referral values are internal participation / reward eligibility signals, not MLM, passive income, payout, commission or G2A distribution.

### 6. Миссии  
- Набор задач по модулям Space, Atlas, Blog, Quest, RF.  
- Прогресс миссий, награды.

### 7. Аналитика  
- Источники Points.  
- Разбивка активности по модулям.  
- Динамика за 7/30/90 дней.

---

## Роль Connect Asia в архитектуре  
This legacy overview previously described Connect as a broad service. Current safe reading: Connect is a product/UI composition layer over backend-owned facts, not a standalone economy authority.

| Модуль | Что получает от Connect |
|-------|--------------------------|
| Space Asia | Points за посты, лайки, репосты |
| Atlas Asia | Points за гайды, темы |
| Blog Asia | Points за публикации |
| Pulse Asia | Points за события, отчёты |
| Quest Asia | Points за прохождения |
| Russian Friendly | Points за отзывы, ваучеры |
| Guru Asia | Points за чек-ины |
| Auth / User Service | уровни, статистика |

---

## Технические особенности
- Высокая нагрузка и event-driven processing are target architecture considerations only.
- Все internal Points начисления должны оставаться runtime-backed by the relevant Points policy/service contract.
- G2A, token and on-chain synchronization are future-only roadmap vocabulary, not current UX or runtime behavior.

---

# Участники
**Пользователи**  
**PRO-кураторы**  
**Партнёры**  
**Администраторы**
