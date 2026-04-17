# Space Asia Guest Access Policy Note v1

## Status

Accepted for bounded access hardening

## Context

`Space Asia` больше нельзя оставлять полностью открытым для гостя.

После shell alignment, Organizer Phase 1-2 и Saved-to-Trip baseline в `Space` уже появились поверхности, которые читаются не как общий discovery layer, а как личный personal/social contour пользователя:

- dashboard shell на `/space`;
- global personal shortlist на `/space/saved`;
- personal activity layer на `/space/activity`;
- trip-first personal workspace на `/space/organizer`.

При этом сейчас не нужен большой cross-platform RBAC rewrite.
Нужен bounded слой guest-access hardening именно для `Space`, который:

- защищает уже явно личные поверхности;
- не ломает public/mixed social surfaces без отдельного решения;
- не конфликтует с будущим ростом в сторону role/access matrix для разных кабинетов и пользовательских контуров.

## Route classification

### Authenticated-only

- `/space`
- `/space/saved`
- `/space/activity`
- `/space/organizer`
- `/space/organizer/*`
- `/space/me`
- `/space/balance`
- `/space/referrals`
- `/space/settings`

Эти маршруты уже читаются как personal shell, personal utility surface или personal trip context.

### Public

- `/space/community`

Community root сейчас выступает как discovery/belonging entry и может оставаться открытым гостю.

### Mixed / public-read

- `/space/community/feed`
- `/space/community/groups/[groupId]`
- `/space/posts`
- `/space/profiles/[userId]`

Текущая bounded policy для этих маршрутов:

- public read допустим;
- guest может просматривать surface;
- write / membership / save / authored personal actions требуют auth и должны честно деградировать или вести к sign-in.

### Deferred / unresolved

- `/space/quests`
- `/space/vouchers`
- `/space/nft`

Эти поверхности не должны определять текущую bounded policy.
Их access semantics нужно уточнять отдельно, вместе с более широкой role/access model.

## Current bounded decision

- `Space Asia` не трактуется как полностью публичный модуль.
- Dashboard shell `/space` уже считается personal-first входом в личный contour пользователя и требует auth.
- `Saved`, `Activity` и `Organizer` уже считаются personal-only surfaces.
- `Organizer` и его вложенные routes не являются публичным каталогом и не должны открываться гостю.
- `Saved` остаётся global saved layer пользователя и не должен быть гостевым экраном общего пользования.
- `Community`, `community feed`, `group detail`, `public profiles` и `posts` пока допускаются как public-read или mixed surfaces.
- Current hardening intentionally targets only the obvious personal routes listed above.

## Future role/access expansion

Этот note не является полной ролевой моделью платформы.
Он только фиксирует первый bounded слой guest policy для `Space Asia`.

Дальше ожидается более широкая role/access matrix как минимум для:

- personal user spaces;
- Organizer and other private execution workspaces;
- VIP / power-user contours;
- PRO / expert / partner workspaces;
- owner / operator / admin-like consoles.

Текущий bounded pass не проектирует эти роли полностью, но не должен им противоречить.

Базовый вектор на будущее:

- guest access;
- authenticated personal access;
- mixed public-read / auth-write surfaces;
- specialized role-gated workspaces and consoles.

## If implementation was done

- Guest now hits Clerk auth gate for the clearly personal Space routes:
  - `/space`
  - `/space/saved`
  - `/space/activity`
  - `/space/organizer`
  - `/space/organizer/*`
- Redirect behavior uses the existing middleware pattern:
  - guest is redirected to `/sign-in`
  - `redirect_url` keeps the original target route
- Public/mixed Space surfaces are intentionally left outside this hardening pass.
