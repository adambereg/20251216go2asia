# Identity/RF Seed Verification Checklist (v1)

Использовать после заполнения CSV templates и выполнения ручного seed.

- [ ] Для каждого seed user выполнен sign-in и получен актуальный token.
- [ ] Для каждого seed user выполнен `POST /v1/users/ensure` с `200 OK`.
- [ ] В таблице `users` у каждого seed user:
  - [ ] `id == clerk_id == expected sub`
  - [ ] `role` в каноническом наборе (`spacer|vip_spacer|pro|admin`)
- [ ] Для owner-кандидатов создан минимум 1 RF partner.
- [ ] У каждого RF partner `ownerUserId` совпадает с ожидаемым owner seed user.
- [ ] Для каждого активируемого offer:
  - [ ] create draft прошёл успешно
  - [ ] activate прошёл успешно
- [ ] Offer visibility sanity:
  - [ ] есть минимум один `public`
  - [ ] есть минимум один `pro_only` или `invite_only` (для проверок)
- [ ] PRO linkage sanity:
  - [ ] `POST /v1/rf/pro/links` создан для ожидаемого `pro_user`
  - [ ] owner принял link там, где `accept_by_owner=yes`
- [ ] Не зафиксировано путаницы между:
  - [ ] platform role (`users.role`)
  - [ ] display label (`space_profile_projection.role_label`)
  - [ ] RF domain relationship (`owner`, `rf_pro_link`, `role_scope`)

