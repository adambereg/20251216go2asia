# Connect Asia — UI Structure

Legacy UI structure. Stage 6.5.3 reading guard: Connect UI must not look like a financial wallet, token account, NFT marketplace, payout surface, or bank balance. Current MVP surfaces should show read-only internal Points/activity/referral/badge projections only where backend-backed.

Модуль имеет 7 legacy / target разделов.

---

# 1. Dashboard (Главная)

Блоки:
- Internal Points / activity summary
- Уровень и прогресс только как future/backend-backed progression
- Рекомендованные действия  
- Последняя активность

Компоненты:
- ActivitySummaryCard
- LevelProgressBar  
- RecommendedActionList  
- ActivityFeed  

---

# 2. Points History

Фильтры:
- Модуль  
- Тип (начисление/списание)  
- Период  

Секции:
- Internal Points summary
- Table of internal activity / Points entries

---

# 3. Levels & Achievements

## Уровни
- Прогресс уровня  
- Бонусы уровня  

## Достижения
Карточка достижения:
- icon  
- title  
- progress bar  
- reward  

---

# 4. Missions

Секции:
- Быстрый старт (tutorial missions)  
- Активные миссии  
- Пройденные миссии  
- Фильтры по модулям  

Компоненты:
- MissionCard  
- MissionStep  
- RewardPill  

---

# 5. Referrals

Блоки:
- Общая статистика  
- Мои рефералы  
- Приглашение (генерация ссылки, QR)  

Компоненты:
- ReferralCard  
- InvitePanel  

---

# 6. Analytics

Блоки:
- Internal Points за 7/30/90 дней (бар-чарт), as read-only projection
- Источники internal reward recognition (пай-чарт)
- Referral participation contribution
- Пульс сезона только как future/backend-backed progression

Компоненты:
- ChartBar  
- ChartPie  
- AnalyticsCard  

---

# 7. Навигация модуля Connect Asia

Tabs:
- Dashboard  
- Points  
- Levels  
- Achievements  
- Referrals  
- Missions  
- Analytics  

---

# UI Kit Components Used
- Badge  
- Card  
- Tabs  
- Progress  
- Table  
- Chart  
- Tooltip  
- Avatar  
- TagPill  
