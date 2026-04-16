# Space Asia Frontend Shell Alignment Before Personal Organizer v1

## Status

Accepted for pre-implementation alignment

## Context

Этот pass фиксирует минимальное выравнивание frontend shell `Space Asia` перед реальным стартом `Personal Organizer Phase 1`.

Цель прохода узкая:

- не делать redesign всего `Space`;
- не начинать реализацию Organizer;
- не открывать новый широкий audit;
- зафиксировать честную shell/IA/navigation рамку, в которую Organizer будет вставлен без конфликтов.

Контекст решений уже задан:

- `Space Asia` остаётся dashboard-first personal/social module;
- `Personal Organizer` — trip-first section inside `Space`;
- backend boundary Organizer закреплён в `docs/decisions/adr_0028_personal_organizer_backend_boundary.md`.

## Current shell truth

Текущий frontend runtime для `Space` показывает следующую реальность:

- live surfaces:
  - `/space` (dashboard-shell)
  - `/space/community` (community root)
  - `/space/community/feed` (social feed stream)
  - `/space/community/groups/[groupId]` (group detail)
  - `/space/posts`
  - `/space/saved`
  - `/space/activity`
- implemented but non-primary/deferred placeholders:
  - `/space/quests`, `/space/vouchers`, `/space/balance`, `/space/nft`, `/space/referrals`, `/space/settings`
- `SpaceNav` primary navigation в коде сейчас:
  - Dashboard
  - Communities
  - Feed
  - Posts
  - Saved
  - Activity
- `Organizer` как отдельная секция/route пока не открыт; на `/space` есть только `Organizer Preview` semantics.

Итог: shell уже dashboard-first (не feed-home), но Organizer insertion point в top-level nav ещё не стабилизирован.

## Alignment issues

Ниже только bounded issues, которые реально мешают безопасному старту Organizer Phase 1.

1. **IA doc vs runtime drift по маршрутам и именам**
- IA-док описывает контур с `/space/feed`, `/space/my-posts`, `/space/profile/[userId]`, тогда как runtime живёт на `/space/community/feed`, `/space/posts`, `/space/profiles/[userId]`.
- Без фиксации "pre-Organizer canonical shell truth" команда рискует разъехаться при добавлении Organizer route.

2. **Top-level nav перегружен до добавления Organizer**
- Сейчас уже 6 primary пунктов, и добавление Organizer без правила компрессии создаёт риск шумной/ломкой навигации.
- Нужно заранее зафиксировать, как вставляется Organizer без впечатления, что он вытесняет другие разделы.

3. **Ambiguity между Community root и Feed**
- `/space/community` и `/space/community/feed` оба первично навигируемы, но в продуктовой роли это разные поверхности (discovery vs stream).
- Без явной роли растёт риск UX-дублирования и неочевидных CTA после добавления Organizer.

4. **Роль `Posts` в pre-Organizer shell не зафиксирована**
- `Posts` важен как social identity surface, но в узком nav-space непонятно: остаётся primary или временно уходит в secondary entry.
- Решение нужно принять до появления Organizer tab, иначе insertion будет конфликтным.

5. **Saved semantics недостаточно дисциплинирована под будущий Organizer intake**
- Runtime `Saved` сейчас узкий (`space_post` bookmarks), но пользователю легко прочитать его как "почти Organizer".
- Перед Phase 1 нужна чёткая UX-граница: global saved shortlist != trip context.

6. **Placeholder surfaces визуально существуют, но не должны влиять на Organizer alignment**
- Баланс/квесты/ваучеры/NFT/referrals/settings присутствуют как routes, но это deferred wave.
- Без явной дисциплины команда может случайно включить эти зоны в pre-Organizer scope.

## Recommended alignment decisions

### Decision A — Freeze pre-Organizer canonical shell map

**Решение**
- Зафиксировать канон pre-Organizer shell по runtime truth:
  - `/space`
  - `/space/community`
  - `/space/community/feed`
  - `/space/posts`
  - `/space/saved`
  - `/space/activity`
  - `/space/community/groups/[groupId]`
  - `/space/profiles/[userId]` (secondary identity route)

**Почему важно до Organizer**
- Это снимает IA/runtime drift и предотвращает спор о "какой shell мы расширяем".

**When**
- Must fix now (документно и в naming-правилах команды).

### Decision B — Pre-approve Organizer insertion as one additional primary section

**Решение**
- Утвердить, что Organizer добавляется как один новый primary item в `SpaceNav`, но только как subsection inside `Space`, не как новый центр модуля.

**Почему важно до Organizer**
- Внедрение без pre-approval почти гарантирует навигационный churn в момент Phase 1.

**When**
- Must fix now (decision level, без full UI redesign).

### Decision C — Define nav compression rule before Phase 1

**Решение**
- Зафиксировать правило компрессии nav при добавлении Organizer:
  - `Dashboard`, `Communities`, `Feed`, `Saved`, `Activity`, `Organizer` остаются top-level;
  - `Posts` может временно стать secondary entry (но не теряет продуктовую роль).

**Почему важно до Organizer**
- Снимает конфликт "куда вставить Organizer" и защищает framing `Space > Organizer`.

**When**
- Must fix now (как policy), UI polishing can wait.

### Decision D — Lock semantic roles of sections

**Решение**
- Явно закрепить роли:
  - `Dashboard` = cockpit/entry
  - `Communities` = discovery/belonging entry
  - `Feed` = social stream
  - `Posts` = authored social identity
  - `Saved` = global shortlist source
  - `Activity` = narrow activity timeline
  - `Organizer` (future) = trip-first execution subsection

**Почему важно до Organizer**
- Минимизирует смешение Saved/Organizer и Community/Feed после вставки нового таба.

**When**
- Must fix now (decision/doc copy), deep UX refactor can wait.

### Decision E — Explicitly keep placeholders out of pre-Organizer scope

**Решение**
- Зафиксировать, что placeholder routes не входят в alignment pass и не влияют на criteria перехода к Organizer Phase 1.

**Почему важно до Organizer**
- Защищает bounded scope и скорость выхода к реальной Organizer wave.

**When**
- Must fix now (scope guardrail).

## Pre-Organizer shell baseline

Минимальный устойчивый baseline перед стартом Organizer Phase 1:

1. `Space` остаётся dashboard-first shell, где `/space` — основной вход.
2. Top-level social/personal sections сохраняют самостоятельную роль и не подчиняются Organizer.
3. Organizer вставляется как дополнительная primary section inside `Space`, а не как переопределение shell.
4. `Saved` остаётся глобальным source layer; trip context появляется только внутри Organizer.
5. `Activity` остаётся narrow baseline (без расширения в полноценный notification center).
6. `Communities` и `Feed` сохраняют разделение discovery vs stream.
7. Placeholder surfaces остаются deferred и не блокируют старт Organizer Phase 1.

Recommended top-level sections right before Organizer launch:

- Dashboard
- Communities
- Feed
- Saved
- Activity
- Organizer (new in Phase 1)

`Posts`:
- остаётся обязательной social surface;
- может временно идти как secondary entry при nav compression;
- не трактуется как deprecated.

## Recommended pre-Organizer task set

1. **Shell map freeze note**
- Зафиксировать "pre-Organizer canonical shell truth" (routes + section roles) как единый reference для frontend/product.

2. **Navigation policy update**
- Принять решение по nav compression и месту `Posts` на период Organizer Phase 1.

3. **Section semantics copy alignment**
- Уточнить заголовки/описания в shell и dashboard CTA так, чтобы:
  - `Saved` читался как source shortlist;
  - `Organizer` читался как отдельный trip-first mode;
  - не возникало впечатления, что весь `Space` становится planner shell.

4. **Community vs Feed role clarification**
- Зафиксировать UX правило и entry logic:
  - `/space/community` = discovery entry;
  - `/space/community/feed` = stream consumption surface.

5. **Deferred-scope guardrail**
- Явно зафиксировать, что placeholder/deferred surfaces не трогаются в pre-Organizer pass.

## Transition criteria

К Organizer Phase 1 можно переходить, когда одновременно true:

1. Есть единый согласованный pre-Organizer shell map (без IA/runtime ambiguity).
2. Принято явное решение по top-level nav с Organizer insertion и nav compression policy.
3. Зафиксирована семантическая граница `Saved` vs future Organizer intake.
4. `Dashboard`, `Communities`, `Feed`, `Posts`, `Saved`, `Activity` сохраняют свои роли в framing и UI copy.
5. Deferred surfaces не включены в текущий scope и не блокируют Organizer start.
6. Команда принимает, что следующий шаг — реализация Organizer Phase 1 внутри этой рамки, без redesign всего Space shell.
