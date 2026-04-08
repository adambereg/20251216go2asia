# Quest Asia - UI Документация

> **LEGACY / NOT SSOT / HISTORICAL CONCEPT**
>
> Этот документ является старым концептуальным UI-описанием и не должен использоваться как источник текущего frontend scope, route truth или runtime readiness.
>
> Актуальные источники истины:
> - `docs/architecture/quest/quest_normalization_pack_v1.md`
> - `docs/knowledge/quest_asia.md`
> - `docs/openapi/quest.yaml`
> - реальный Quest frontend baseline в `apps/go2asia-pwa-shell`

> **Документация UI модуля Quest Asia - квесты и миссии**

**Версия:** 1.0  
**Дата:** 2025-01-14

---

## 📋 Обзор

Quest Asia - модуль геймификации с квестами и миссиями.

**Роут:** `/quest`  
**Тип:** Публичный модуль

---

## 🎮 Структура страниц

### Главная страница

**Роут:** `/quest`  
**Файл:** `app/(public)/quest/page.tsx`  
**Компонент:** `QuestHomeClient.tsx`

**Содержимое:**
- Список квестов
- Фильтры (город, тип, сложность)
- Карточки квестов

### Страница квеста

**Роут:** `/quest/[id]`  
**Файл:** `app/(public)/quest/[id]/page.tsx`  
**Компонент:** `QuestDetailClient.tsx`

**Содержимое:**
- Описание квеста
- Награды
- Шаги квеста
- CTA для запуска

### Запуск квеста

**Роут:** `/quest/[id]/run`  
**Файл:** `app/(public)/quest/[id]/run/page.tsx`  
**Компонент:** `QuestRunnerClient.tsx`

**Содержимое:**
- Прогресс-бар
- Текущий шаг
- Инструкции
- Действия (чек-ин, QR, квиз и т.д.)

### Завершение квеста

**Роут:** `/quest/[id]/complete`  
**Файл:** `app/(public)/quest/[id]/complete/page.tsx`  
**Компонент:** `RewardsView.tsx`

**Содержимое:**
- Анимация наград
- Полученные поинты
- NFT бейджи
- Поздравление

### Мои квесты

**Роут:** `/quest/my`  
**Файл:** `app/(public)/quest/my/page.tsx`

**Содержимое:**
- Активные квесты
- Завершённые квесты
- Черновики

### Лидерборд

**Роут:** `/quest/leaderboard`  
**Файл:** `app/(public)/quest/leaderboard/page.tsx`  
**Компонент:** `LeaderboardView.tsx`

**Содержимое:**
- Таблица лидеров
- Фильтры (город, период)
- Ранги пользователей

---

## 🧩 Компоненты

### Расположение

`components/quest/`

### Основные компоненты

- **QuestCard** - Карточка квеста
- **QuestDetail** - Детали квеста
- **QuestRunner** - Запуск квеста
- **QuestRewards** - Награды
- **QuestProgressBar** - Прогресс-бар
- **StepPills** - Шаги квеста
- **LeaderboardRow** - Строка лидерборда

### Типы данных

```typescript
type QuestType = 'route' | 'checkin' | 'content' | 'event';
type QuestDifficulty = 'easy' | 'medium' | 'hard';
type StepType = 'geo-checkin' | 'qr-code' | 'quiz' | 'photo' | 'video' | 'pulse-event' | 'task';

interface Quest {
  id: string;
  title: string;
  type: QuestType;
  difficulty: QuestDifficulty;
  steps: QuestStep[];
  rewards: QuestRewards;
}
```

---

## 🎨 Стилизация

- **Градиент Hero:** `from-purple-500 to-purple-600`
- **Цвета типов квестов:**
  - Route: `#10B981` (Green)
  - Checkin: `#3B82F6` (Blue)
  - Content: `#8B5CF6` (Purple)
  - Event: `#F59E0B` (Amber)

---

## 🔗 Связанные документы

- [ui_structure.md](./ui_structure.md)
- [design_system.md](./design_system.md)

---

**Версия:** 1.0

