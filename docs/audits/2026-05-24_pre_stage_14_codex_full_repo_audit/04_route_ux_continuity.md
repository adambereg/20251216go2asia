# Audit 4 — Route / UX Continuity Audit

Дата: 2026-05-24
Тип аудита: Read-only Codex audit
Статус: PASS_WITH_WARNINGS
Контекст: Pre-Stage-14 route / UX continuity baseline

---

# 1. Executive summary

Overall route/UX continuity verdict:

`PASS_WITH_WARNINGS`

Ключевые пользовательские контуры после Stage 13 выглядят собранными:

* маршруты существуют;
* основные переходы присутствуют;
* return paths в большинстве случаев есть;
* auth/pro/admin gates работают по ожидаемой модели;
* deferred-секции в основном выглядят intentional, not broken.

Blockers:

* no hard blockers found.

Non-blocking / high-priority findings:

* missing deep routes referenced from active links:

  * `/rf/:id/reviews`
  * `/rf/:id/vouchers`
  * `/quest/:id/edit`
* middleware matcher hygiene risk for `/quest/[id]/run`;
* legacy/deferred route debt around `/connect/wallet`, `/space/balance`, `/space/nft`;
* CTA hierarchy inconsistency across modules.

Readiness for Stage 14:

* good, but seeding may expose missing deep links and deferred/alias surfaces more strongly.

---

# 2. Route map

## Entry / Auth

Checked routes:

* `/`
* `/sign-in`
* `/sign-up`
* `/profile`

Status:

* present;
* coherent;
* no active stale `/register` or `/signup` references found.

---

## Connect cluster

Checked routes:

* `/connect`
* `/connect/activity`
* `/connect/levels`
* `/connect/referrals`
* `/connect/wallet`

Status:

* present;
* cohesive;
* `/connect/wallet` remains legacy alias surface.

---

## Quest cluster

Checked routes:

* `/quest`
* `/quest/[id]`
* `/quest/[id]/run`
* `/quest/[id]/complete`
* `/quest/my`

Status:

* core routes present;
* `/quest/[id]/run` exists;
* middleware matcher pattern should be reviewed;
* `/quest/:id/edit` referenced, but route file not found.

---

## Rielt cluster

Checked routes:

* `/rielt`
* `/rielt/search`
* `/rielt/listings/[id]`
* `/rielt/inquiries`

Status:

* present;
* inquiry route exists;
* core listing → inquiry continuity works.

---

## RF cluster

Checked routes:

* `/rf`
* `/rf/[id]`
* `/rf/vouchers`
* `/rf/my-vouchers`
* `/rf/favorites`
* `/rf/map`
* `/rf/how-it-works`
* `/rf/rielt/listings/[listingId]/vouchers`

Status:

* core RF routes present;
* strong cross-links to Connect;
* links to `/rf/:id/reviews` and `/rf/:id/vouchers` were found, but corresponding routes were not found.

---

## PRO cluster

Checked routes:

* `/rf/pro`
* `/rf/pro/partners`
* `/rf/pro/verifications`
* `/rf/pro/onboarding`
* `/rf/pro/rewards`

Status:

* present;
* protected by PRO/admin gate;
* fallback to `/rf?access=pro_required` is explicit;
* deferred depth is intentional.

---

## Space / Profile cluster

Checked routes:

* `/space`
* `/space/activity`
* `/space/saved`
* `/space/community`
* `/space/profiles/[userId]`
* `/space/posts`
* `/space/quests`
* `/space/vouchers`
* `/space/referrals`
* `/space/settings`
* `/space/activity-summary`

Status:

* present;
* deferred pages exist;
* deferred UX mostly intentional;
* legacy/deferred surfaces remain debt.

---

## Admin / Diagnostics

Checked route:

* `/admin/points-diagnostics`

Status:

* route exists;
* admin gate present;
* internal/admin framing intact.

---

# 3. Missing / orphan / stale findings

## Missing page targets found in links

The audit found active links or navigation targets without matching route files:

* `/rf/${partner.id}/reviews`
* `/rf/${partner.id}/vouchers`
* `/quest/${quest.id}/edit`

Severity:

* High for Stage 14 readiness;
* not a Stage 13 closure blocker;
* likely soft blockers before heavy seeding.

Why important:

Stage 14 content/data seeding will increase click density. Seeded cards/lists may expose these missing deep routes quickly.

---

## Potential stale deeplinks in data

Potential stale deeplink:

* `/quest/nearby`

No route found.

Severity:

* Medium-to-low, depending on whether this link is visible in active UI.

---

## Stale path scan

No active navigation blockers found for:

* `/register`
* `/signup`
* `/space/teams`

Good signal:

* Stage 13.1/13.7 cleanup appears effective.

---

# 4. Route smoke table

| Domain     | Route(s)                                           | Status       | Evidence / notes                      |
| ---------- | -------------------------------------------------- | ------------ | ------------------------------------- |
| Entry/Auth | `/`, `/sign-in`, `/sign-up`                        | OK           | Basic entry/auth contour intact       |
| Connect    | `/connect/*`, `/connect/wallet`                    | OK / Warning | Wallet remains legacy alias surface   |
| Quest      | `/quest/[id]/run`                                  | Warning      | Route exists, matcher pattern risk    |
| Rielt      | `/rielt/*`, `/rielt/inquiries`                     | OK           | Inquiry route exists                  |
| RF         | `/rf/*`, `/rf/rielt/listings/[listingId]/vouchers` | OK           | Core RF routes present                |
| PRO        | `/rf/pro/*`                                        | OK           | PRO gate + explicit fallback          |
| Space      | `/space/*` including deferred                      | OK / Warning | Deferred UX intentional, debt remains |
| Admin      | `/admin/points-diagnostics`                        | OK           | Internal/admin framing intact         |

---

# 5. Cross-module continuity assessment

| Journey loop                                                   | Status       | Strongest link                         | Weakest link                          | Notes                    |
| -------------------------------------------------------------- | ------------ | -------------------------------------- | ------------------------------------- | ------------------------ |
| Visitor → Auth → Home → Connect                                | OK           | Sign-in redirect paths                 | CTA consistency across old components | Overall works            |
| Home → Connect → activity/levels/referrals                     | OK           | Explicit Connect links                 | Minor copy/priority variations        | Not blocking             |
| Quest → Connect activity → Connect levels → Quest              | OK           | Bidirectional links                    | `/quest/[id]/edit` dead-end risk      | Run/complete loop strong |
| Rielt listing → inquiry → my inquiries → RF vouchers → listing | OK / Warning | Listing + inquiry routes               | Missing RF partner detail subroutes   | Core path works          |
| RF partner → voucher → my-vouchers → Connect activity          | OK           | RF nav + Connect links                 | Partner deep links risk               | Mostly solid             |
| PRO workspace → RF / Connect / Rielt → PRO return              | OK           | PRO nav + ecosystem block              | Deferred depth                        | Intentional deferred     |
| Profile → Space → saved/activity → Connect                     | OK           | Sign-in CTA + fallback links           | Non-uniform CTA prominence            | No hard dead-end         |
| Connect projection → admin diagnostics                         | OK           | Diagnostics href helpers + admin route | Role-based discoverability by design  | Correct boundary         |

---

# 6. Auth / protected route assessment

## Guest behavior

Protected routes redirect to:

* `/sign-in?redirect_url=...`

This is expected.

## Admin behavior

`/admin(.*)` is gated by normalized canonical role:

* `admin`

## PRO behavior

Routes:

* `/rf/pro*`
* `/quest/pro*`

require:

* `pro`
* or `admin`

Fallback:

* `/rf?access=pro_required`

This is explicit and user-friendly.

## Redirect URL handling

`redirect_url` is used in protected-like surfaces such as:

* Space saved/activity auth gates;
* Quest run sign-in handoff;
* protected module transitions.

## Middleware risk

Matcher for quest run route:

* `/quest/[id]/run(.*)`

is likely non-idiomatic and should be reviewed.

Severity:

* Medium.

Not a closure blocker, but important for protected route correctness.

---

# 7. Deferred surface assessment

## Intentional deferred surfaces

The following are intentional, not broken:

### Space deferred routes

* `/space/quests`
* `/space/vouchers`
* `/space/referrals`
* `/space/settings`
* `/space/activity-summary`

They contain:

* deferred/status copy;
* next-action links;
* active route handoffs.

### PRO deferred routes

* `/rf/pro/partners`
* `/rf/pro/verifications`
* `/rf/pro/onboarding`
* `/rf/pro/rewards`

They are accessible as:

* beta/deferred surfaces;
* status-only flows;
* non-authoritative UX.

### Legacy surfaces

* `/space/balance`
* `/space/nft`
* `/connect/wallet`

They include legacy/deferred framing.

## Follow-up needed

Ensure deferred pages always provide:

* next active route CTA;
* return to module;
* clear deferred badge;
* no fake runtime promise.

---

# 8. Empty / error state assessment

Many surfaces include recovery / next steps:

* Back;
* Sign in;
* Open feed;
* Open Space;
* module links;
* retry actions.

Good examples:

* `space/saved`
* `space/activity`
* auth-required states
* deferred pages

Detected UX dead-end risks:

* links to missing deep routes:

  * `/rf/:id/reviews`
  * `/rf/:id/vouchers`
  * `/quest/:id/edit`

These are the main actionable findings.

---

# 9. Legacy / stale path assessment

## Stale paths not actively found

No active route links found for:

* `/register`
* `/signup`
* `/space/teams`

## Legacy paths present by design

* `/connect/wallet`
* `/space/balance`
* `/space/nft`

## Alias hygiene

`ROUTE_ALIASES` is centralized and used across components.

This is good.

## Retirement risk

Risk level:

* Medium.

Reason:

* long-lived compatibility surfaces can attract accidental new usage;
* Stage 14 content may surface legacy links more prominently.

---

# 10. Middleware / matcher assessment

## Alignment

Middleware contains explicit groups:

* public;
* auth;
* protected;
* admin;
* PRO.

Role normalization is present.

Admin and PRO behavior match expected UX fallbacks.

## High-risk matcher finding

Quest run matcher:

* `/quest/[id]/run(.*)`

may be fragile for actual dynamic URL matching.

Recommended follow-up:

* verify matcher behavior with explicit tests;
* correct matcher if needed;
* ensure no unintended public access to quest run flow.

## Maintenance note

`isPublicRoute` is declared, but runtime path checks mainly rely on protected/admin/PRO checks.

This is acceptable, but slightly confusing for maintenance.

---

# 11. Top route / UX risks

## Blockers

None.

---

## High

### Broken deep links

Routes referenced but not found:

* `/rf/:id/reviews`
* `/rf/:id/vouchers`
* `/quest/:id/edit`

Impact:

* likely to become visible during Stage 14 seeding;
* may create user-facing dead ends.

Recommended treatment:

* pre-Stage-14 stabilization item.

---

## Medium

### Quest run protected matcher hygiene

Potential dynamic matcher fragility for:

* `/quest/[id]/run`

### Legacy alias expansion risk

Legacy/deferred surfaces:

* wallet;
* balance;
* NFT.

Risk:

* accidental new usage;
* semantic drift;
* future seeding visibility.

---

## Low

### CTA hierarchy inconsistency

Some modules vary in:

* CTA priority;
* return paths;
* next-action presentation.

Not breaking continuity now, but can cause navigation entropy as content grows.

---

## Non-blocking follow-ups

* Alias retirement plan with route telemetry.
* Route contract tests for deep links in cards/components.
* Normalize deferred-page CTA templates.
* Add stale-link scan in CI.

---

# 12. Stage 14 implications

## What can break during seeding

Stage 14 seed content may increase clicks to currently missing deep routes:

* `/rf/:id/reviews`
* `/rf/:id/vouchers`
* `/quest/:id/edit`

Seeded lists/cards may also make deferred/legacy routes appear more active than intended.

## Guardrails before/during seeding

1. Validate every seeded link target against existing `page.tsx` map.
2. Keep legacy/deferred badges on non-canonical routes.
3. Add stale-link scan for `href` / `router.push` / redirects.
4. Avoid seeding cards that point to non-existent deep routes.
5. Keep deferred route CTAs consistent and explicit.

---

# 13. Recommended next audits

1. Security / Access / Secrets Audit
2. Projection Metadata Deep Audit
3. Alias Retirement Audit
4. Deferred Surface Governance Audit
5. E2E Smoke Test Plan Audit

---

# 14. Final git status

## Before audit

Workspace was dirty before audit.

Pre-existing modified files included:

* SQL/migrations;
* scripts;
* already-modified files outside audit scope.

## After audit

Workspace remained in the same dirty state.

No new modifications were introduced.

## Confirmation

Audit completed strictly read-only.

No files were:

* modified;
* created;
* deleted.

---

# Read-only commands executed

* `git status --short`
* `git diff --stat`
* `find apps/go2asia-pwa-shell/app -name "page.tsx" | sort`
* `rg -n "href=|router.push|redirect\(|redirect_url|return_url" apps/go2asia-pwa-shell --glob "*.{ts,tsx}"`
* `rg -n "/register|/signup|/space/teams|/connect/wallet|/space/balance|/space/nft|/admin/points-diagnostics|/quest/\[id\]/run|/quest/|routeAliases|ROUTE_ALIASES" apps/go2asia-pwa-shell --glob "*.{ts,tsx}"`
* `pnpm -C apps/go2asia-pwa-shell typecheck`
* `pnpm -C apps/go2asia-pwa-shell lint`

`git diff --check` failed only due to pre-existing trailing whitespace in already-modified files outside audit scope.
