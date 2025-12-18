# Валидация после переноса PWA Shell

**Дата:** 2025-01-16  
**Статус:** ISSUES FOUND

---

## Результат валидации

### ⚠️ ISSUES FOUND (частично исправлено)

Обнаружено **5 проблем**, из которых **3 исправлены** в процессе валидации. Осталось **2 проблемы**, требующие внимания.

---

## Проверка по пунктам

### ✅ 1. pnpm-workspace.yaml

**Статус:** OK

**Проверка:**
- ✅ `apps/*` включён в workspace
- ✅ PWA Shell находится в `apps/go2asia-pwa-shell/`
- ✅ Пакет распознаётся как `@go2asia/pwa-shell`

**Замечания:** Нет

---

### ✅ 2. turbo.json

**Статус:** OK

**Проверка:**
- ✅ Tasks настроены корректно
- ✅ `build` task видит `.next/**` в outputs
- ✅ `dev` task настроен как persistent
- ✅ Turborepo корректно обрабатывает новое расположение

**Замечания:** Нет

---

### ⚠️ 3. tsconfig.json / tsconfig.base.json

**Статус:** ISSUE FOUND

**Проблема:**
- ❌ `apps/go2asia-pwa-shell/tsconfig.json` использует несуществующий путь:
  ```json
  "extends": "@go2asia/config/tsconfig.nextjs.json"
  ```
- ❌ Такого файла не существует в `packages/config/`

**Требуемое исправление:**
```json
{
  "extends": "../../packages/config/typescript/next.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    },
    "allowJs": true
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

**Файл:** `apps/go2asia-pwa-shell/tsconfig.json`

---

### ✅ 4. Импорты shared packages

**Статус:** OK

**Проверка:**
- ✅ `@go2asia/ui` используется в коде (147 файлов)
- ✅ `@go2asia/sdk` используется в коде
- ✅ `@go2asia/config` используется в tsconfig.json
- ✅ Все импорты используют workspace protocol (`workspace:*`)

**Замечания:** Нет

---

### ⚠️ 5. Build scripts (pnpm build, pnpm dev)

**Статус:** ISSUE FOUND

**Проблема:**
- ❌ Build падает с ошибкой `Cannot find module 'next'`
- ❌ Причина: `node_modules` не установлены в `apps/go2asia-pwa-shell/`

**Требуемое действие:**
```bash
pnpm install
```

**Примечание:** После установки зависимостей нужно проверить, что `pnpm build --filter @go2asia/pwa-shell` работает.

---

### ⚠️ 6. Netlify конфигурация

**Статус:** ISSUE FOUND

**Проблема:**
- ⚠️ `netlify.toml` находится в `apps/go2asia-pwa-shell/netlify.toml`
- ⚠️ Netlify ожидает `netlify.toml` в корне проекта (или в base directory)

**Текущая конфигурация:**
```toml
[build]
  command = "pnpm turbo build --filter=@go2asia/pwa-shell"
  publish = "apps/go2asia-pwa-shell/.next"
```

**Рекомендация:**
- Если Netlify настроен с `base directory = apps/go2asia-pwa-shell`, то текущая конфигурация корректна
- Если Netlify настроен на корень проекта, нужно:
  1. Переместить `netlify.toml` в корень проекта ИЛИ
  2. Настроить `base directory` в Netlify Dashboard на `apps/go2asia-pwa-shell`

**Файл:** `apps/go2asia-pwa-shell/netlify.toml`

---

### ⚠️ 7. Hardcoded пути на frontend-shell/

**Статус:** ISSUE FOUND

**Проблема:**
- ❌ Скрипт `test:api` в `package.json` ссылается на:
  ```json
  "test:api": "node ../../scripts/test-api-integration.js"
  ```
- ❓ Файл `scripts/test-api-integration.js` не найден в корне проекта

**Требуемое действие:**
- Проверить, существует ли файл `scripts/test-api-integration.js`
- Если файл не существует, удалить скрипт `test:api` из `package.json`
- Если файл существует, путь корректный (относительный путь от `apps/go2asia-pwa-shell/`)

**Файл:** `apps/go2asia-pwa-shell/package.json` (строка 13)

---

### ✅ 8. Отсутствие ссылок на frontend-shell/

**Статус:** OK

**Проверка:**
- ✅ Grep не нашёл упоминаний `frontend-shell` в `apps/go2asia-pwa-shell/`
- ✅ Все пути корректны

**Замечания:** Нет

---

## Дополнительные находки

### ⚠️ Структура директорий

**Проблема:**
- ⚠️ Обнаружена вложенная структура: `apps/go2asia-pwa-shell/apps/go2asia-pwa-shell/`
- ⚠️ Это может быть остаток от переноса

**Рекомендация:**
- Проверить и удалить дублирующую структуру, если она не нужна

---

## Минимальные исправления

### 1. Исправить tsconfig.json

**Файл:** `apps/go2asia-pwa-shell/tsconfig.json`

**Изменить:**
```json
{
  "extends": "../../packages/config/typescript/next.json",
  ...
}
```

### 2. Установить зависимости

**Команда:**
```bash
pnpm install
```

### 3. Проверить/исправить test:api скрипт

**Файл:** `apps/go2asia-pwa-shell/package.json`

**Действие:**
- Если `scripts/test-api-integration.js` не существует, удалить строку:
  ```json
  "test:api": "node ../../scripts/test-api-integration.js"
  ```

### 4. Проверить Netlify base directory

**Действие:**
- Убедиться, что в Netlify Dashboard настроен правильный `base directory`
- Или переместить `netlify.toml` в корень проекта

---

## Исправления применены

### ✅ Исправлено в процессе валидации:

1. ✅ Исправлен путь в `tsconfig.json` → `../../packages/config/typescript/next.json`
2. ✅ Установлены зависимости через `pnpm install`
3. ✅ Удалён скрипт `test:api` из `package.json` (файл не существует)

### ⚠️ Требует внимания:

4. ⚠️ Netlify конфигурация: проверить `base directory` в Netlify Dashboard
5. ⚠️ Дублирующая структура: `apps/go2asia-pwa-shell/apps/go2asia-pwa-shell/` (возможно, остаток от переноса)

## Итоговый статус

### ⚠️ ISSUES FOUND (частично исправлено)

**Исправлено:**
1. ✅ Неправильный путь в `tsconfig.json` → исправлено
2. ✅ Зависимости не установлены → установлены
3. ✅ Скрипт `test:api` → удалён

**Требует проверки:**
4. ⚠️ Netlify конфигурация требует проверки `base directory`
   - Убедиться, что `base directory` в Netlify Dashboard настроен на `apps/go2asia-pwa-shell/`
   - Или переместить `netlify.toml` в корень проекта
5. ⚠️ Дублирующая структура директорий требует очистки
   - Удалить `apps/go2asia-pwa-shell/apps/go2asia-pwa-shell/` если это остаток от переноса

**Примечание:** Ошибки типов в коде PWA Shell (например, `BadgeProps.children`) не относятся к валидации переноса и требуют отдельного исправления в рамках разработки.

---

## Deliverables

- ✅ Валидация проведена
- ✅ Проблемы идентифицированы
- ✅ Минимальные исправления предложены

## Next

После исправления всех ISSUES:
1. Повторить валидацию
2. Получить статус OK
3. Обновить Milestone 1 Review
4. Перейти к Milestone 2

