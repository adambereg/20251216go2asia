# Russian Friendly Asia — Roadmap

Stage 6.5.3 reading guard: roadmap wording is docs-only planning vocabulary. RF voucher, PRO and reward wording must not imply cashback, payout, settlement, wallet, token, NFT, G2A activation, or runtime authority.

---

## Архитектурная позиция (capstone Фазы 2)

RF — один из самых сложных модулей экосистемы: он связывает **Business ↔ PRO ↔ VIP** через ваучеры, квесты, social‑сигналы и internal Points recognition where runtime-backed.

Поэтому RF логично вводить **после**:
- Space Core (репосты/обсуждения/UGC),
- Quest Core (миссии/прогресс/награждение),
- базовой internal reward infrastructure (Points + роли VIP/PRO + правила начислений where runtime-backed).

Иными словами: RF не является “ранним milestone”, а выступает как **capstone module** Фазы 2.

---

## Этап 1 — RF Foundation (публичная поверхность + базовые доменные сущности)

### Пользовательская часть
- Каталог партнёров
- Каталог ваучеров
- Страница партнёра
- Страница ваучера
- Поиск и фильтры
- Действие “Поделиться” → репост партнёра/ваучера в Space (social-first обсуждение)

### Бэкенд
- Partner Service
- Voucher Service
- Интеграция social‑сигналов через Space/Reactions (репосты/рейтинги/короткие отзывы как UGC в Space)
- Привязка к городам Atlas
- API для публичного каталога

---

## Этап 2 — Кабинет партнёра (Business Dashboard)
- Dashboard
- Профиль заведения
- Создание/редактирование ваучеров
- Ответы и коммуникация с аудиторией через Space (без inline-комментариев “под карточкой”)
- Базовая статистика

---

## Этап 3 — PRO Dashboard (кураторская модель)
- Дашборд PRO
- Онбординг бизнесов
- Проверки PRO
- Чеклист RF-стандарта
- Internal contribution summaries (Points сейчас where runtime-backed; G2A/NFT future-only)

---

## Этап 4 — Соц-функции и интеграции
- Интеграция с Space Asia (публикации, профили)
- Эмбед информации в Atlas и Pulse
- Подборки PRO и редакции
- Интеграция с Quest (квесты вокруг партнёров и ваучеров)
- Интеграция с internal Points recognition по событиям: voucher.claimed/redeemed, partner.verified, social.repost

---

## Этап 5 — Full Release
- Улучшенные графики статистики
- Рекомендации AI
- Автоматическая валидация заведений
- Гибкая система ваучеров
- Уровни PRO
