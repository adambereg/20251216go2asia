---
name: space-cycle-plan
overview: Собран bounded execution plan ближайшего цикла Space Asia на основе SSOT, текущего runtime и seed/live-surface готовности. План держит приоритеты в порядке `content -> runtime -> live surfaces`, не открывая broad Space rollout и не смешивая deferred контуры в текущий цикл.
todos:
  - id: seed-baseline
    content: Открыть bounded seed materialization pass для профилей, public groups, memberships и posts/reposts, достаточный для непустых `/v1/space/feed/*` и будущих group/profile surfaces.
    status: completed
  - id: feed-realism
    content: "После materialization усилить текущие live feed surfaces: показать group-origin signals и убедиться, что `/space` и `/space/community/feed` честно отражают seeded runtime."
    status: completed
  - id: group-surface
    content: Затем открыть public group identity/feed live-adoption slice поверх уже hardened runtime и seeded public groups, без discovery и private/invite-only complexity.
    status: completed
  - id: profile-activity-tail
    content: Только после group surface перейти к public profile/authored posts baseline и затем к activity baseline, оставляя saved/organizer/ecosystem/community expansion на later wave.
    status: completed
isProject: false
---

# Space Asia Current-Cycle Plan v1

## Executive Summary
Space Asia готов к ближайшему execution cycle как `operational-with-debt` social contour с уже существующим runtime и двумя честно live surfaces: [`apps/go2asia-pwa-shell/app/(public)/space/SpacePageClient.tsx`](apps/go2asia-pwa-shell/app/(public)/space/SpacePageClient.tsx) и [`apps/go2asia-pwa-shell/app/(public)/space/community/feed/CommunityFeedPageClient.tsx`](apps/go2asia-pwa-shell/app/(public)/space/community/feed/CommunityFeedPageClient.tsx). Правильный подход на этот цикл: не расширять UI первым, а пройти по цепочке `seed materialization -> runtime validation -> live-adoption of already supported public surfaces`.

Ближайший цикл должен строиться вокруг нескольких bounded slices, но с одним явным first task: сначала материализовать минимальную социальную реальность в runtime, без которой дальнейшие profile/group/activity surfaces останутся пустыми или вводящими в заблуждение.

## Files Reviewed
- [`docs/plans/go2asia_status_anchor_v1.md`](docs/plans/go2asia_status_anchor_v1.md)
- [`docs/plans/go2asia_execution_master_plan_v1.md`](docs/plans/go2asia_execution_master_plan_v1.md)
- [`docs/plans/Space-Asia-Execution-Roadmap.md`](docs/plans/Space-Asia-Execution-Roadmap.md)
- [`docs/plans/Space-Asia-Live-Surfaces-Sequencing-v1.md`](docs/plans/Space-Asia-Live-Surfaces-Sequencing-v1.md)
- [`docs/plans/Space-Asia-Seed-Execution-Plan-v1.md`](docs/plans/Space-Asia-Seed-Execution-Plan-v1.md)
- [`content/space/Space-Asia-Full-Seed-Content-Pack-v1.md`](content/space/Space-Asia-Full-Seed-Content-Pack-v1.md)
- [`docs/architecture/space/Space-Asia-Thematic-Groups-Canon-v1.md`](docs/architecture/space/Space-Asia-Thematic-Groups-Canon-v1.md)
- [`docs/architecture/space/space_domain_model_v_1.md`](docs/architecture/space/space_domain_model_v_1.md)
- [`docs/architecture/space/space_backend_architecture_v_1.md`](docs/architecture/space/space_backend_architecture_v_1.md)
- [`docs/architecture/space/space_service_production_architecture_v_1.md`](docs/architecture/space/space_service_production_architecture_v_1.md)
- [`docs/architecture/space/space_openapi_outline_v_1.md`](docs/architecture/space/space_openapi_outline_v_1.md)
- [`docs/architecture/space/space_dependency_map_v_1.md`](docs/architecture/space/space_dependency_map_v_1.md)
- [`docs/architecture/space/space_phase1_integration_shell_note_v1.md`](docs/architecture/space/space_phase1_integration_shell_note_v1.md)
- [`docs/architecture/space/space_phase1_freeze_note_v1.md`](docs/architecture/space/space_phase1_freeze_note_v1.md)
- [`docs/openapi/space.yaml`](docs/openapi/space.yaml)
- [`apps/space-service/src/services/spaceService.ts`](apps/space-service/src/services/spaceService.ts)
- [`apps/space-service/src/db/queries/space.ts`](apps/space-service/src/db/queries/space.ts)
- [`apps/space-service/src/index.ts`](apps/space-service/src/index.ts)
- [`apps/space-service/test/request.test.ts`](apps/space-service/test/request.test.ts)
- [`apps/api-gateway/src/index.ts`](apps/api-gateway/src/index.ts)
- [`apps/go2asia-pwa-shell/app/(public)/space/SpacePageClient.tsx`](apps/go2asia-pwa-shell/app/(public)/space/SpacePageClient.tsx)
- [`apps/go2asia-pwa-shell/app/(public)/space/community/feed/CommunityFeedPageClient.tsx`](apps/go2asia-pwa-shell/app/(public)/space/community/feed/CommunityFeedPageClient.tsx)
- [`apps/go2asia-pwa-shell/app/(public)/space/community/page.tsx`](apps/go2asia-pwa-shell/app/(public)/space/community/page.tsx)
- [`apps/go2asia-pwa-shell/app/(public)/space/posts/page.tsx`](apps/go2asia-pwa-shell/app/(public)/space/posts/page.tsx)
- [`apps/go2asia-pwa-shell/app/(public)/space/quests/page.tsx`](apps/go2asia-pwa-shell/app/(public)/space/quests/page.tsx)
- [`apps/go2asia-pwa-shell/app/(public)/space/referrals/page.tsx`](apps/go2asia-pwa-shell/app/(public)/space/referrals/page.tsx)

## Current Readiness Map
### Ready Now
- `space-service` runtime core по [`docs/openapi/space.yaml`](docs/openapi/space.yaml) реально существует: posts, reposts, groups, group membership, feeds, profiles.
- Public groups runtime baseline уже hardened: create/get/join/leave/group feed path подтверждены тестами и bounded policy.
- Client-facing truth уже стабилизирован вокруг `/v1/space/*`, а не broad `feed-service` discussion.
- `/space` и `/space/community/feed` уже runtime-backed и показывают loading/empty/error/deferred states без mock-first critical path.

### Partially Ready
- Seed/content пакет богатый и структурированный, но пока остаётся content source, а не materialized runtime dataset.
- Group context уже существует в runtime, но в frontend пока нет honest public group identity surface.
- Public profile и authored posts логически поддерживаются контрактом, но UI surfaces пока не live.
- Activity feed существует как узкий runtime path, но ещё не выглядит как зрелая user-facing activity surface.
- Repost/cross-module realism ограничен safe references и intentionally deferred target types.

### Not Ready Yet
- `/space/community` как discovery/community root.
- Saved baseline, organizer preview, ecosystem signals baseline.
- Private/invite-only groups UX и hardening.
- Broad personal cabinet surfaces: quests, balance, vouchers, NFT, referrals, settings.
- Community expansion, group discovery/ranking/search, moderation suite, PRO operational overlays.

## Recommended Current-Cycle Slices
### Slice 1 — Space Social Seed Materialization Baseline v1
- Purpose: превратить минимальный social seed из content-пака в реальный runtime dataset, достаточный для honest feeds и будущих group/profile surfaces.
- Included: selected auth-linked users, `space_profile_projection`, public groups, active memberships, posts, reposts, group posts, minimal safe repost targets as references.
- Excluded: private/invite-only richness, reactions-rich rendering, organizer, saved, ecosystem summary signals, discovery/search, schema redesign.
- Preconditions: подтверждён current SSOT; использовать только `/v1/space/*`; не менять ownership adjacent domains; сузить seed до public-first baseline.
- Done criteria: seeded users рендерятся без fallback ugliness; `home` и `group` feed непустые; seeded public groups meaningful через runtime APIs; данные не требуют fake placeholders в ближайших surfaces.

### Slice 2 — Space Feed Realism Signals Pass v1
- Purpose: усилить уже live feed surfaces поверх seeded runtime, чтобы `/space` и `/space/community/feed` отражали group-origin и social realism честнее.
- Included: thin frontend adoption on existing feed DTOs, visible group-origin signals where runtime already carries them, consistent empty/error/deferred messaging, cross-surface parity between `/space` and `community/feed`.
- Excluded: new backend endpoints, discovery UI, full group identity page, reactions/product redesign, `/v1/feed/*` reopening.
- Preconditions: Slice 1 завершён; seeded feeds не пустые; group-linked posts реально присутствуют.
- Done criteria: `/space` and `/space/community/feed` visibly show seeded social reality; group-origin is no longer hidden in runtime-only metadata; no new fake completeness signals.

### Slice 3 — Space Public Group Identity + Feed Live Surface v1
- Purpose: материализовать groups как public social containers в UI, а не только как runtime object behind feed.
- Included: one bounded public group surface, public group identity block, group feed live read, public join/leave baseline, honest loading/empty/error states.
- Excluded: group discovery/list/search, private/invite-only complexity, moderation, PRO Console overlays, schema-level `group_type`, broad community root rollout.
- Preconditions: public groups runtime hardened; seeded public groups and memberships exist; group feed path meaningful for seeded groups.
- Done criteria: public group opens as real social entity; feed is clearly group-scoped; join/leave semantics understandable; surface does not behave like generic feed tab.

### Slice 4 — Space Public Profile + Authored Posts Baseline v1
- Purpose: сделать пользователя видимым social actor после того, как группы и feed уже не пустые.
- Included: one public profile surface, profile feed, authored posts baseline or my-posts baseline if auth path is safe.
- Excluded: following graph, social graph richness, cross-profile relationship productization, creator suite.
- Preconditions: stable profile projections from Slice 1; enough authored content seeded; group/public visibility semantics validated.
- Done criteria: user profile feels real; authored content visible; no fallback-to-user-id or empty-shell illusion.

### Slice 5 — Space Activity Baseline v1
- Purpose: включить activity surface только после появления реальной социальной жизни в feed/group/profile layers.
- Included: narrow activity feed using existing runtime path, honest scope messaging, bounded reaction/activity awareness.
- Excluded: notification center redesign, chat mirrors, deep reactions UX, saved/organizer coupling.
- Preconditions: prior slices done; enough seed/runtime events to avoid empty theatre; activity contract verified against current narrow runtime semantics.
- Done criteria: activity surface is non-empty, understandable, and does not promise broader notification product semantics.

## Sequencing
1. Slice 1 first.
Reason: current docs and roadmap explicitly require `content -> runtime -> surfaces`; without materialized profiles/groups/posts, later frontend slices stay empty or misleading.

2. Slice 2 second.
Reason: existing live surfaces `/space` and `/space/community/feed` can immediately benefit from seeded data and should become more socially legible before opening new routes.

3. Slice 3 third.
Reason: public groups runtime is already hardened, but honest UI for groups should only follow once seeded public groups and group feed content are meaningful.

4. Slice 4 fourth.
Reason: public profile and authored posts depend on profile projections plus visible authored content; otherwise they become shell-only pages.

5. Slice 5 fifth.
Reason: activity should reflect real prior social execution, not invent engagement before feeds, groups and profiles are materially alive.

6. Saved, organizer, ecosystem signals, community root expansion stay after this wave.
Reason: they depend on either external-domain truth, more mature content materialization, or broader product semantics than the current cycle should absorb.

## Biggest Blockers / Constraints
- Seed pack is rich, but materialization tooling/runtime import path is not yet evidenced in repo reality.
- Many Space UI routes are still explicit placeholders, so shell expansion before runtime/data work would create fake completeness.
- `feed-service vs space-service` deeper ownership debt remains controlled but unresolved; current cycle must keep client-facing truth on `/v1/space/feed/*`.
- Gateway optional-viewer behavior for optional Space GET paths is narrower than a broad future product might want; this should not be made critical-path for the current public-first cycle.
- Domain events / richer downstream projections are still limited; cycle planning should assume social core first, not event-driven richness first.

## What Must Stay Deferred
- Private and invite-only group UX/hardening.
- Group discovery/list/search and `/space/community` broad activation.
- Saved baseline, organizer preview, ecosystem signals in the first half of the cycle.
- Any schema-level `group_type`, taxonomy implementation, or private-to-group storage tactic expansion.
- PRO-led operational tooling, moderation suite, assistant-heavy or automation-heavy overlays.
- Broad feed redesign, `/v1/feed/*` reopening, or architecture re-baseline of Space/Feed.
- Quests, vouchers, NFT, referrals, balance and settings as Space product surfaces beyond their current placeholder state.

## First Execution Task
**`Space social seed materialization baseline pass v1`**

Why this first:
- It is the narrowest task that unlocks the rest of the cycle.
- It follows the already fixed roadmap rule `content -> runtime -> surfaces`.
- It avoids opening new product surfaces before there is real data.
- It gives concrete evidence for whether group/profile/activity slices can honestly go live next.

Task shape:
- Materialize a selected public-first subset from [`content/space/Space-Asia-Full-Seed-Content-Pack-v1.md`](content/space/Space-Asia-Full-Seed-Content-Pack-v1.md).
- Focus only on users needed for Space rendering, `space_profile_projection`, public groups, active memberships, posts/reposts/group posts.
- Validate against existing `/v1/space/*` runtime rather than inventing new contracts.
- End with runtime evidence: non-empty home feed, meaningful public groups, and usable group-linked posts for later frontend slices.

## Final Verdict
**ready with specific preconditions**

Space Asia is ready for the current cycle because SSOT, runtime core, public groups hardening, and two bounded live surfaces already exist. The specific precondition is that the cycle must start with public-first seed materialization and runtime validation; if the team jumps directly to new UI surfaces, it will reintroduce the same shell-first and fake-completeness risks that the current Space governance explicitly forbids.
