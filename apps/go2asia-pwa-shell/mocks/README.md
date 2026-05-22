# UI mock data

Моки для быстрой UI-проверки без backend/Neon.

## Переключатель источника данных

- `NEXT_PUBLIC_DATA_SOURCE=api|mock` (по умолчанию: `api`)
- `mock` разрешён только для локальной dev/demo UI-проверки.
- `NEXT_PUBLIC_DATA_SOURCE=mock` не является smoke/staging/prod evidence и не подтверждает readiness.

> В режиме `api` страницы используют SDK hooks/clients (если реализованы). Если SDK пока плейсхолдер — UI может показывать пустые состояния.
