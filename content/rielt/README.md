# Rielt seed starter pack v2 (24 listings)

- listings: 24
- listing_media: 83
- actor_links: 24
- inquiries: 8
- partners: 10
- pro_curators: 6
- presentation rows: 24
- vouchers: 53
- scenarios: 24

Особенности:
- 4 города: Phuket, Bangkok, Da Nang, Ho Chi Minh City
- short_term и long_term
- published + archived + draft
- free / points / premium voucher modes
- scheduled / near_now / on_site urgency modes
- sparse-media cases
- partner cases с needs_pro_mediation=true

## Repo wiring (bounded pass)

- `core/*` используется как Step 8 aligned слой (`listing`, `listing_media`, `actor_links`, `inquiries`) без расширения ownership.
- `extension/*` подключается только как presentation/meta overlay для public frontend (`voucher/trust/partner/curator/cta`).
- Public adapter path в PWA:
  - server loader: `apps/go2asia-pwa-shell/lib/rieltSeedRepo.ts`
  - seed API: `apps/go2asia-pwa-shell/app/api/rielt-seed/listings/*`
  - frontend hooks: `apps/go2asia-pwa-shell/components/rielt/hooks/useRieltSeed.ts`

Правило при конфликте: Step 8 SSOT runtime truth приоритетнее extension semantics.

Rielt media key canon note:
- `docs/architecture/rielt/rielt_media_r2_key_canon_v1.md`
- canonical key pattern: `rielt/listings/{country_slug}/{city_slug}/{listing_slug}/01.jpg`

Примечание по search semantics:
- `guests` в публичном UI сохраняется как контекст выбора пользователя и не трактуется как каноническая server-side list filter из Step 8.
