# Stage 13.7 - Space / Profile Social Journey Boundary Pass (v1)

## Final verdict

Stage 13.7 выполнен как bounded implementation slice: Profile/Space выровнены как social visibility layer с улучшенной continuity между Profile, Space, Connect и модульными return paths, при сохранении строгих identity/reward/moderation/public-launch границ и без runtime expansion.

## Files changed

- `apps/go2asia-pwa-shell/app/(authenticated)/profile/page.tsx`
- `apps/go2asia-pwa-shell/app/HomePageClient.tsx`
- `apps/go2asia-pwa-shell/components/space/Shared/SpaceNav.tsx`
- `apps/go2asia-pwa-shell/app/(public)/space/SpacePageClient.tsx`
- `apps/go2asia-pwa-shell/app/(public)/space/activity/ActivityPageClient.tsx`
- `apps/go2asia-pwa-shell/app/(public)/space/saved/SavedPostsPageClient.tsx`
- `apps/go2asia-pwa-shell/app/(public)/space/profiles/[userId]/ProfilePageClient.tsx`
- `apps/go2asia-pwa-shell/components/space/runtime/SpaceProfileSurface.tsx`
- `apps/go2asia-pwa-shell/app/(public)/space/community/CommunityRootPageClient.tsx`
- `apps/go2asia-pwa-shell/components/space/community/discoveryContent.ts`
- `apps/go2asia-pwa-shell/components/space/community/SpaceCommunityGroupCard.tsx`
- `apps/go2asia-pwa-shell/components/space/runtime/utils.ts`
- `apps/go2asia-pwa-shell/app/(public)/space/posts/PostsPublicationCard.tsx`
- `apps/go2asia-pwa-shell/app/(public)/space/posts/PostsPageClient.tsx`
- `apps/go2asia-pwa-shell/components/space/Feed/PostCard.tsx`
- `apps/go2asia-pwa-shell/components/connect/Dashboard/DashboardContent.tsx`
- `apps/go2asia-pwa-shell/app/(public)/space/quests/page.tsx`
- `apps/go2asia-pwa-shell/app/(public)/space/vouchers/page.tsx`
- `apps/go2asia-pwa-shell/app/(public)/space/referrals/page.tsx`
- `apps/go2asia-pwa-shell/app/(public)/space/settings/page.tsx`
- `apps/go2asia-pwa-shell/app/(public)/space/activity-summary/page.tsx`
- `docs/reports/stage_13_7_space_profile_social_journey_boundary_pass_v1.md`

## Profile / Space continuity improvements

- `Profile` получил явные next-step маршруты в `Space`, `Space saved`, `Space activity`, `Connect activity`.
- В `Home` исправлен разрыв `Space teams` на live route `Space community`.
- `Space dashboard` получил явные cross-module quick-links (`Profile`, `Connect activity`, `Home`) и менее технический language.
- `SpaceNav` блок `Скоро` переведён в linkable deferred-навигацию с явной маркировкой `deferred`.
- Для `Space posts` добавлен явный fallback-link в `Space feed` при отсутствии профиля.

## Social identity boundary improvements

- Публичный профиль в Space переформулирован как `social visibility`, без identity-proof трактовок.
- В profile surface убран `User ID` из UI-видимости; тексты приведены к non-authoritative framing.
- Метка `Куратор` в community cards заменена на `Автор подборки` для снижения moderation/admin ambiguity.
- В legacy feed-карточке `verified` aria label смягчён до нейтрального `Статус профиля`.

## Saved/activity/deferred surface improvements

- `Space activity` получил явные continuation links из карточек событий в релевантные маршруты (Space/Quest/Rielt/RF/Pulse/Atlas).
- `Space saved` получил явные CTA в auth-required/runtime-unavailable/error состояниях (`Войти`, `Открыть ленту`, `Повторить`).
- Deferred pages (`quests`, `vouchers`, `referrals`, `settings`, `activity-summary`) переведены в intentional deferred framing с явными переходами в active surfaces.
- В deferred copy убраны формулировки, читаемые как ownership/entitlement/reward authority.

## Cross-module continuity improvements

- Добавлен safe handoff `Connect -> Space` через `nextSteps` в dashboard.
- В `PostsPublicationCard` расширен cross-module resolver (`quest`, `partner`, `blog_post`) и выровнен с runtime utils.
- В community root и space dashboard усилены возвратные пути в `Space feed` и `Space dashboard`.

## Safe social wording preserved

- `space_social_feed != proof`
- `space_profile_projection != identity_authority`
- `public_profile_baseline != account_profile_authority`
- `social_signal != reward_authority`
- `reaction_bookmark != contribution_record`
- `social_activity_preview != connect_points_authority`
- `social_visibility != entitlement_grant`
- `social_preview != operational_workflow`
- `community_participation != booking_or_payment_authority`
- `social_summary != audit_trail`

## Runtime boundaries preserved

- `mock_data != proof`
- `projection != authority`
- `preview != grant`
- `dashboard != receipt`
- `wallet != financial_wallet`
- `listing_projection != inventory_authority`
- `inquiry != booking`
- `lookup != proof`
- `diagnostic_snapshot != customer_proof`
- `operational_trace != immutable_audit_ledger`
- `owner_fact = authoritative`
- `Path_B_inactive = true`
- `public_launch_implied = false`
- `profile_visibility != identity_proof`
- `social_activity != reward_authority`
- `saved_item != ownership`
- `like != endorsement_proof`
- `post != verified_fact`
- `community_badge != authority`
- `social_feed != immutable_activity_ledger`
- `space_preview != public_social_launch`
- `mock_social_content != proof`
- `moderation_ui != admin_authority`

Сервисные контракты не менялись: `API/SDK/schema/database/runtime changes = none`.

## Validation performed

- `pnpm -C apps/go2asia-pwa-shell typecheck`
- `pnpm -C apps/go2asia-pwa-shell lint`
- `git diff --check`
- Unsafe terminology scan по изменённым Profile/Space/Connect файлам:
  - `identity proof`
  - `verified identity`
  - `official reputation`
  - `immutable ledger`
  - `reward authority`
  - `earned status`
  - `ownership`
  - `entitlement`
  - `moderation authority`
  - `admin approval`
  - `public social launch`
  - `proofClass`
  - `sourceOwner`
  - `ownerFactRef`
  - `isProof`
  - `isReceipt`
  - `isAuthoritative`

## Remaining gaps/deferred items

- Полноценный auth-only слой `app/(authenticated)/space/*` остаётся deferred и не активируется в Stage 13.7.
- Social settings runtime writes остаются deferred; текущие surfaces остаются status/navigation-oriented.
- Community ranking/personalization остаётся lightweight without authority semantics.
- Отдельный social graph layer (friends/follow graph authority) по-прежнему не вводится.

## Recommended next slice

Stage 13.8: Social graph continuity hardening (Profile visibility settings + Space follow/saved flows + Connect handoff) с сохранением boundary режима `social layer != identity/reward/moderation authority`.
