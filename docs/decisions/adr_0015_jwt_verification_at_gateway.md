# ADR-0015: JWT verification is performed at API Gateway

**Статус:** Accepted / Implemented  
**Дата:** 2025-12-24  

## Контекст

В плане MVP предполагался поток вида: Gateway → Auth Service → verify JWT → allow/deny.

Фактически в текущей edge-first архитектуре Cloudflare Workers более устойчивый вариант — выполнять проверку пользовательского JWT на уровне Gateway как security boundary и дальше прокидывать `X-User-ID` в downstream сервисы.

## Решение

- **API Gateway** выполняет:
  - извлечение Bearer token из `Authorization`
  - валидацию Clerk JWT (если `CLERK_JWT_SECRET` сконфигурирован)
  - вычисление `userId` (JWT `sub`) и установку `X-User-ID`
  - CORS на ранних ошибках (401/403), чтобы браузер не превращал их в “network error”
- **Auth Service** отвечает за:
  - обработку webhooks от Clerk (где применимо)
  - персистенцию пользователей/ролей в БД
  - user-centric endpoints (например, `POST /v1/users/ensure`)
- Downstream сервисы **не должны** самостоятельно валидировать пользовательский JWT в MVP; они доверяют `X-User-ID` **только** когда запрос аутентифицирован как gateway-origin (`X-Gateway-Auth`).

## Последствия

**Плюсы**
- Gateway становится явной security boundary (единая точка authn).
- Упрощает downstream сервисы и снижает вероятность расхождений.
- Локализует CORS/401 проблемы в одном месте.

**Минусы**
- Gateway критичен: ошибки конфигурации JWT влияют на все user-facing запросы.
- При усложнении ролей потребуется аккуратное разделение authn/authz.

## Реализация

- Gateway: `apps/api-gateway/src/index.ts`
  - проверка токена и выставление `X-User-ID`
  - CORS на ранних error responses
- Downstream trust model: `X-Gateway-Auth` + `X-User-ID`



