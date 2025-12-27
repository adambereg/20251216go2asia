# ADR-0018: Referral attribution uses client-captured ref + server-side idempotent claim

**Статус:** Accepted / Implemented  
**Дата:** 2025-12-24  

## Контекст

План MVP описывает “регистрацию по реферальной ссылке” как серверный поток.

На практике при современном sign-up/sign-in (SSO, email-link, social) корректнее и проще обеспечить attribution так:
- при попадании пользователя по `?ref=CODE` сохранять код на клиенте;
- после успешной аутентификации выполнить серверный idempotent claim.

Это снижает гонки, упрощает UX и делает поток прозрачно дебажимым (видно в Network).

## Решение

- Frontend:
  - на страницах `sign-up/sign-in` сохраняет `?ref=CODE` (localStorage)
  - после успешного auth вызывает:
    1) `POST /v1/users/ensure`
    2) `POST /v1/referral/claim { code }` (если код есть)
- Referral Service:
  - `POST /v1/referral/claim` создаёт связь `referrer_id → referee_id` в `referral_relations`
  - операция идемпотентна и безопасна при повторных вызовах

## Последствия

**Плюсы**
- Нет зависимости от того, “как именно” пользователь завершил sign-up (email/social).
- Простой контракт: claim либо создаёт связь, либо возвращает “already_claimed”.
- Удобно тестировать и наблюдать через Network.

**Минусы**
- Attribution происходит “после auth”, а не до.
- Требует аккуратного хранения/очистки `ref` на клиенте.

## Реализация

- FE capture: `apps/go2asia-pwa-shell/components/auth/ReferralCapture.tsx`
- Post-auth flow: `apps/go2asia-pwa-shell/components/auth/ClerkAuthSetup.tsx`
- Endpoint claim: `apps/referral-service/src/index.ts` (`POST /v1/referral/claim`)
- User ensure: `apps/auth-service/src/index.ts` (`POST /v1/users/ensure`) через gateway routing



