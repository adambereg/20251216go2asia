# Space Status Framing Audit 2026-04-12

**Status:** audit/design-only framing pass (no implementation changes)  
**Scope:** Space module status truth, boundaries, alignment, bounded next scope  
**Role:** practical execution framing before next Space implementation slice

---

## 1. Executive Summary

`Space Asia` в текущей системе нужно читать как два разных слоя:

- `Space Asia` как user module/shell;
- `space-service` как bounded social publication core.

По репозиторию Space уже не является только документным контуром:

- есть `apps/space-service` (runtime routes, tests);
- есть `docs/openapi/space.yaml` + bundled OpenAPI;
- есть `packages/db/src/schema/space.ts` + `0015_space_core_v1.sql`;
- есть gateway routing `/v1/space/*`;
- есть generated SDK/types для Space;
- есть минимум один live frontend path (`/space`) с runtime feed.

Текущий честный статус: **`operational-with-debt`**.

Главный practical вывод:

> следующий шаг должен быть не "расширять Space во все стороны", а bounded live-adoption slice поверх уже существующего social core.

---

## 2. Current Status Marker

**Canonical marker:** `operational-with-debt` (consistent with `go2asia_status_anchor_v1.md`)

### Why

- `space-service` реально существует и работает как social publication contour;
- contracts/schema/migrations/routes/tests присутствуют;
- часть frontend already connected to runtime;
- но значительная часть "широкого Space-модуля" остаётся mock/deferred/placeholder;
- и есть docs drift между architecture/plan/module artifacts.

---

## 3. Module Definition (Current Architecture Truth)

### 3.1 What Space is

Space — это social-layer domain:

- social publication;
- repost-based circulation;
- group/community context;
- social signals around canonical entities других модулей.

### 3.2 What Space is not

Space не является owner source truth для:

- geo/place identity;
- partner/business truth;
- event truth/attendance;
- listing/property truth;
- quest progression/proof;
- points/reward ledger;
- media lifecycle/storage;
- PRO operational logic;
- AI orchestration.

### 3.3 Primary ownership area

`space-service` owns:

- posts/reposts/system posts;
- groups + group membership;
- profile projection for social surfaces;
- post-media relations (reference only);
- publication lifecycle + social domain events;
- feed delivery surfaces in bounded model (without owning full ranking domain).

---

## 4. Domain Boundaries and Dependencies

### 4.1 Canonical entities (Space-owned)

- `space_post`
- `space_group`
- `space_group_member`
- `space_post_media`
- `space_profile_projection`

Canonical enums:

- post type: `post | repost | system`
- visibility: `public | followers | group | private`
- repost targets: `space_post | blog_post | place | event | partner | listing | quest`

### 4.2 Upstream dependencies

- identity/auth (user principal via gateway auth boundary)
- media-service (asset lifecycle outside Space)
- canonical IDs from Atlas/Pulse/RF/Rielt/Quest/Blog for repost references

### 4.3 Downstream dependencies

- feed/reactions/notifications/points/analytics/AI layers as consumers
- cross-module social circulation consumers

### 4.4 Forbidden ownership areas

Space must not absorb:

- reactions ownership;
- points/reward ownership;
- partner workflows;
- quest workflow ownership;
- organizer/planner full ownership;
- voucher/referral/NFT/tokenomics ownership;
- foreign source-domain truth.

---

## 5. Current Reality: Docs vs Contract vs Code

## 5.1 Confirmed aligned

- `/v1/space/*` contract baseline exists and is wired in code.
- Space schema + migration align with social-core model.
- Generated SDK/types for Space are present and consumable.
- `/space` shell route uses runtime feed (`/v1/space/feed/*`).

## 5.2 Partially aligned

- feed boundary (`space-service` delivery vs separate `feed-service`) remains partially unresolved.
- event set is mostly aligned, but not fully uniform across all Space docs.
- optional areas (organizer/feed table/PATCH surfaces) differ between documents and implementation scope.

## 5.3 Misaligned / stale

The following are stale or non-canonical for current Space runtime truth:

- `docs/modules/space/overview.md`
- `docs/modules/space/api_contracts.md` (legacy `/api/space`)
- `docs/modules/space/roadmap.md`
- `docs/modules/space/ui_structure.md`
- `frontend-shell/docs/ui/space_ui.md`
- `docs/audits/space_module_audit_2026_march.md` as current-state artifact

These can be used as historical/reference artifacts only.

---

## 6. Key Gaps and Ambiguity Zones

1. **Status drift:** current Space truth is spread across multiple artifacts.
2. **Module-vs-service drift:** wide Space UI/docs scope vs bounded `space-service` ownership.
3. **Frontend mismatch:** some Space surfaces are runtime-backed, others are still mock/placeholder.
4. **Feed ownership ambiguity:** client-facing path truth exists, deeper service decomposition still open.
5. **Legacy artifact bleed:** old `/api/space` and broad legacy models can mislead planning.
6. **Fake completeness risk:** broad navigation can imply capabilities that are not actually live.

---

## 7. Recommended Bounded Scope (Nearest Cycle)

### Single bounded scope

**Space live social-core adoption slice**

### Must include

- reuse existing `/v1/space/*` runtime contracts;
- one additional honest live frontend surface (beyond already live `/space`);
- DTO-to-UI adapter discipline using generated types;
- explicit deferred handling for out-of-scope blocks.

### Must not include

- planner/organizer expansion;
- quest workflow ownership;
- RF business workflow ownership;
- points/reward/tokenomics ownership;
- NFT/referral/voucher productization inside Space;
- broad feed ranking redesign;
- full social graph/platform expansion.

### Cut line

Any work not directly required for live adoption of existing social-core runtime is out of scope for this cycle.

---

## 8. Recommended Sequencing (Nearest Cycle)

1. Freeze execution truth source for Space:
   - status anchor + Space OpenAPI + Space freeze notes.
2. Keep feed ownership redesign out of this cycle.
3. Select one bounded live surface and connect it to existing runtime.
4. Apply adapter layer to prevent mock model leakage into contracts.
5. Verify honest loading/error/empty/deferred behavior.
6. Keep all non-social and cross-domain-heavy zones explicitly deferred.

---

## 9. First Practical Implementation Slice

### Slice name

**Space Community Feed Live Adoption**

### Why this slice

- removes visible mock/runtime mismatch;
- leverages already implemented backend contracts;
- preserves ownership boundaries;
- reduces fake completeness without opening broad redesign.

### Included capabilities

- replace mock-driven community feed surface with runtime feed;
- use existing `/v1/space/feed/*` client-facing contract;
- map generated Space DTOs to feed UI model;
- preserve narrow preview policy for supported reference types.

### Excluded capabilities

- create/edit/delete post UX expansion;
- group management expansion;
- reactions mutation UX expansion;
- quests/vouchers/balance/NFT/referrals integration;
- organizer/AI/pro-console extensions;
- feed decomposition redesign.

### Readiness criteria

- bounded scope accepted;
- source-of-truth artifacts fixed for this slice;
- no boundary redesign in same cycle.

### Done criteria

- selected surface no longer depends on Space mock data;
- runtime contract is used end-to-end;
- states are truthful (loading/empty/error/deferred);
- no ownership drift introduced.

---

## 10. Risk Register

- **Scope drift:** accidental expansion from social core to all Space surfaces.
- **Ownership drift:** absorption of Connect/RF/Quest/Blog domains into Space.
- **Fake completeness:** UI implies live capability where backend is absent/deferred.
- **Frontend/backend mismatch:** reuse of legacy mock DTO assumptions.
- **Contract drift:** implementation diverges from `docs/openapi/space.yaml`.
- **Feed boundary drift:** unresolved decomposition leaks into unrelated slice.

---

## 11. Final Verdict

**Verdict:** `ready with preconditions`

### Why

Space already has sufficient runtime/contract/code baseline for bounded implementation.  
But preconditions are required to avoid execution drift:

- use canonical status/contract/freeze artifacts as source of truth;
- treat legacy module docs as non-canonical for current implementation decisions;
- keep strict bounded scope;
- avoid simultaneous boundary redesign.

---

## 12. Practical Note on Repo Documentation

This file is intended as a single framing artifact to reduce repeated re-audit before the next Space task.  
If maintained, future Space closure/slice notes should reference this file and update only changed status sections, not reopen broad module scope implicitly.

