# Milestone 5A — Integration Validation Plan (Integration Freeze)

**Статус:** Executed (DONE WITH ISSUES)  
**Дата:** 2025-12-25  

## Integration Freeze Rule

В рамках M5A код меняется **только если**:
- найден **реальный дефект интеграции**,
- есть **минимальный фикс** без расширения функциональности,
- фикс **задокументирован** в `docs/reviews/milestone5/m5a_issues.md`.

## Цель M5A

Зафиксировать, что MVP Go2Asia интегрирован, стабилен и воспроизводим end-to-end в staging (“integration freeze”) перед Milestone 5B (Testing).

## Роли (multi-agent)

- **Orchestrator:** контроль scope/порядка, сбор артефактов, финальный статус.
- **QA / Integration Engineer:** smoke + acceptance, evidence, статусы OK/ISSUE.
- **Backend:** цепочки сервисов, requestId/headers, idempotency, DB evidence.
- **Frontend:** UX-потоки и отсутствие DEMO MODE при auth/500.
- **DevOps:** staging deploy/seed workflow, cold start, секреты/vars.
- **Architect:** фиксация результатов и отклонений (если требуется).

## Предусловия

- `NEXT_PUBLIC_DATA_SOURCE=api`
- `NEXT_PUBLIC_API_URL=<staging gateway>`
- Доступ к: staging UI, Neon SQL editor, GitHub Actions (seed workflow), при необходимости Cloudflare logs.

## Потоки MVP (A–F)

### A) Auth & User lifecycle

- **Шаги**
  - signup → login/logout → `POST /v1/users/ensure`
- **Ожидаемый результат**
  - пользователь появляется/обновляется в Neon `users` (upsert по `clerk_id`)
- **Где проверять**
  - UI + Network, DB (`users`)

### B) Referral flow

- **Шаги**
  - signup по `/sign-up?ref=CODE` → claim → pending → sign-out/sign-in → active → bonus
- **Ожидаемый результат**
  - `referral_relations` создан, `first_login_at` устанавливается, бонус начислен referrer
- **Где проверять**
  - UI `/connect/referrals`, `/connect/wallet`
  - API: `/v1/referral/*`, `/v1/points/*`
  - DB: `referral_links`, `referral_relations`, `points_transactions`

### C) Points

- **Шаги**
  - `/v1/points/balance`, `/v1/points/transactions`
  - наличие `referral_bonus_referrer` и (если используется) `event_registration`
- **Ожидаемый результат**
  - баланс/транзакции консистентны с DB (`user_balances`, `points_transactions`)
- **Где проверять**
  - UI + Network, DB

### D) Content (Atlas/Pulse/Blog)

- **Шаги**
  - Atlas list/detail, Pulse list/detail, Blog list/detail
- **Ожидаемый результат**
  - данные читаются из Neon через Gateway → content-service (без моков)
- **Где проверять**
  - UI + Network, DB (`countries/cities/places/events/articles`)

### E) Staging operations

- **E0 Cold start (перед E1)**
  - открыть staging после паузы и убедиться:
    - gateway отвечает
    - frontend не падает
    - нет таймаутных DEMO fallback
- **E1 Deploy**
  - staging deploy из `main` работает предсказуемо
- **E2 Seed workflow (manual)**
  - запустить `Seed Neon (staging)` без reset
- **E3 Seed idempotency**
  - повторный запуск seed без reset не плодит дубликаты и не ломает данные
- **Ожидаемый результат**
  - runbook соответствует реальности, операции воспроизводимы

### F) Error handling

- **F1–F4**
  - 401/403: корректная обработка, без DEMO MODE; CORS присутствует; requestId присутствует
- **F5 Негативный сценарий 500**
  - принудительно вызвать 500 (например, временно недоступный downstream / неправильный endpoint) и убедиться:
    - нет DEMO MODE,
    - есть user-friendly ошибка,
    - requestId присутствует.

## Definition of DONE (M5A)

- Все потоки A–F пройдены вручную и задокументированы
- Для каждого потока статус **OK / ISSUE** + evidence (UI/API/DB)
- Нет “непонятных” состояний; если есть — они описаны в `m5a_issues.md`
- Можно переходить к Milestone 5B (Testing)

## Артефакты (выход)

- `docs/reviews/milestone5/m5a_integration_smoke.md`
- `docs/reviews/milestone5/m5a_issues.md` (если есть)
- Итоговый статус: “M5A = DONE / DONE WITH ISSUES”

