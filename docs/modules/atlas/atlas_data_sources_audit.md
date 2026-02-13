# Atlas Data Sources Audit

Цель: зафиксировать, какие страницы Atlas берут данные из Neon (через content-service/SDK),
а где используются моки/демо/заглушки на фронте, и обозначить риски.

## Переключатель источника

На фронте есть глобальный флаг `NEXT_PUBLIC_DATA_SOURCE`:
- `api` (по умолчанию) — запросы в content-service через SDK
- `mock` — подмена данных на mockRepo

Это означает, что при `mock` никакие данные из Neon не используются.

## Матрица источников

| Страница | Источник | Fallback/моки | Риск |
|---|---|---|---|
| `/atlas` (home) | API: `useGetCountries`, `useGetPlaces` | Да: fallback на `mockRepo` при пустом ответе | Высокий (может скрыть проблемы API/Neon) |
| `/atlas/countries` | API: `useGetCountries` | Да: fallback на `mockRepo` при пустом ответе | Высокий |
| `/atlas/cities` | API: `useGetCities` | Да: fallback на `mockRepo` + моковые “столицы/прочие города” | Высокий |
| `/atlas/countries/{id}` (overview) | API: `useGetCountryById` | Да: `countryData ?? mock` | Средний |
| `/atlas/cities/{id}` (overview) | API: `useGetCityById` | Да: `cityData ?? mock` | Средний |
| `/atlas/countries/{id}/*` (tabs) | API: `listCountryTabs` (content-service) | Нет (показывает пустой контент/empty state) | Низкий |
| `/atlas/cities/{id}/*` (tabs) | API: `listCityTabs` (content-service) | Нет (показывает пустой контент/empty state) | Низкий |
| `/atlas/places` | API: `useGetPlaces` | Нет (в mock режиме список пустой) | Средний |
| `/atlas/cities/{id}/places` | API: `useGetPlaces` | Нет (в mock режиме список пустой) | Средний |
| `/atlas/places/{slug}` | API: `useGetPlaceById` | Нет | Низкий |
| `/atlas/countries/{id}/places` | API: `useGetPlaces` | Да: fallback на `mockRepo` | Высокий |
| `/atlas/guides` | API: `useGetArticles` | Да: fallback на `mockRepo` при пустом ответе | Высокий |
| `/atlas/guides/{id}` | API: `useGetArticleBySlug` | Да: `mockGuide` при отсутствии API | Высокий |
| `/atlas/themes` | Только `mockRepo` | Да (mock only) | Высокий (полностью демо) |
| `/atlas/themes/{id}` | Прямой fetch `/v1/api/content/themes/{id}` | Да: fallback на `mockRepo` | Высокий |
| `/atlas/hubs/{slug}` | Только `mockRepo` | Да (mock only) | Высокий |
| `/atlas/tools/*` | Статические/локальные страницы | Нет | Низкий |

## Встроенные демо-данные в place detail

Даже при `api`:
- Галерея place detail имеет fallback на статические URLs (Pexels), если `photos` пустой.
- Текстовые блоки рендерят empty state при отсутствии данных.

Это не относится к Neon/SDK и должно быть осознано как временная визуальная заглушка.

## Рекомендации: как полностью убрать моки из прод-режима

1. **Отключить fallback на `mockRepo` в `api` режиме.**
   - Условно: если `dataSource === 'api'` и ответ пустой, показывать empty state, а не моки.
2. **Оставить `mockRepo` только для локального DEV (`NEXT_PUBLIC_DATA_SOURCE=mock`).**
3. **Убрать demo-контент с Pexels из place detail.**
   - Взамен показывать “нет фото” или placeholder-градиент.
4. **Выравнять все Atlas списки и overview к единому контракту SDK.**
   - Country/City overview не должны подмешивать mock при отсутствии API.
5. **Темы и хабы перенести на content-service.**
   - Сейчас `/atlas/themes` и `/atlas/hubs` фактически демо.
6. **Добавить мониторинг пустых ответов.**
   - Логировать ошибки/пустые результаты в Sentry/логгер, чтобы не маскировать проблему mock-данными.

