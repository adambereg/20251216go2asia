# Space Asia — UI Structure

Stage 6.5.3 reading guard: Space UI is a social/product surface. It must not present Points/G2A/NFT as a financial wallet, bank balance, payout, token account, investment surface, or current on-chain feature.

---

# 1. Основные разделы Space Asia

- Dashboard (главная панель пользователя)
- Сообщество (лента)
- Мои публикации
- Квесты (интегрировано с Quest Asia)
- Ваучеры (RF)
- Activity / internal Points projection (Connect-owned)
- Бейджи / достижения; NFT future-only
- Рефералы as participation summary
- Настройки

Все страницы используют единый боковой навигационный блок.

---

# 2. Dashboard

Компоненты:
- UserHeaderCard: аватар, роль, уровень, прогресс XP
- ActivitySummaryCard: internal Points / activity projection
- QuickActions:  
  - создать пост  
  - создать опрос  
  - пройти квест  
  - получить / зарезервировать voucher utility
  - пригласить друга  
- WeeklyAchievements  
- Recommendations (вытягивает из Atlas, RF, Pulse, Quest)

UI соответствует твоим скринам:
- большие карточки,
- мягкие тени,
- акцентные голубые CTA-кнопки.

---

# 3. Сообщество (Лента)

Tabs:
- Моё
- Друзья
- Лайкнутое
- Трендовое
- Подборки
- Официальные

PostCard:
- аватар автора
- текст
- фото/галерея
- опрос
- репост
- действия: лайк, коммент, репост, сохранить

FeedLayout:
- один столбец, ширина контента 700–820px
- фиксированные отступы
- плавные анимации появления

---

# 4. Мои публикации

Tabs:
- Все посты
- Публикации
- Черновики
- Опросы
- Сохранённые
- Гайды

Карточки — такие же, как в основной ленте.

---

# 5. Квесты (встроенный Quest Asia)

Tabs:
- Доступные
- Мои активные
- Завершённые
- История наград
- Статистика прогресса

Карточки квестов — минималистичные:
- фото  
- название  
- Points  
- CTA “Начать”

---

# 6. Вaучеры (RF-модуль в Space)

UI-компоненты:
- VoucherCard (фото, Points, срок действия)
- CTA “Получить ваучер”

Страница ваучеров — сетка карточек.

---

# 7. Activity / Internal Points Projection

Компоненты:
- Points summary
- G2A summary только как future-only hidden/deferred placeholder
- История internal activity / Points entries
- Цветовая кодировка:
  - зелёный: поступление
  - красный: списание

---

# 8. Badges / Future NFT Compatibility

Tabs:
- Все бейджи
- Эпические
- Редкие
- Обычные

Badge-карточка:
- иконка  
- название  
- описание  
- дата получения  
- редкость  

On-chain mint / NFT wallet is not part of current UI; future-only unless separately activated.

---

# 9. Рефералы

Компоненты:
- ReferralStatsCard (уровень, рейтинг, приглашенные)
- ReferralLinkCard (ссылка + кнопка “Копировать”)
- Описание participation / internal reward eligibility, not income or commission

---

# 10. Настройки

Секции:
- Приватность  
- Уведомления  
- Язык  
- Активные устройства  
- KYC (в будущем)

Компоненты:
- тумблеры уведомлений  
- карточки устройств  
- блок KYC  

---

# 11. Адаптивность

Мобильная версия:
- боковая навигация → нижняя панель
- лента в один столбец
- Dashboard — вертикальный стек

---

# 12. Будущее расширение UI
- Персональная AI-лента
- AI-редактор постов
- AI-модерация комментариев
- DAO-инструменты (голосования)
- Тематические сообщества (группы)
