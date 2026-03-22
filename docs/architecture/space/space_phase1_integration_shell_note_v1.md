# Space Asia Phase-1 Integration Shell Note v1

## Status / verdict
ready for Space phase-1 audit-to-implementation handoff

## 1. Purpose
This note fixes the architecture/product frame for Space Asia phase 1 under integration-shell-first constraints.  
It defines what Space phase 1 should mean after completed upstream segments, what dependencies are ready enough, and what must be explicitly deferred to avoid fake completeness.

## 2. Starting point (current repository truth)
### 2.1 Runtime reality
- `space-service` already exists as a real service with `/v1/space/*` routes (posts, reposts, groups, feed, profiles).
- Space DB schema/migration baseline already exists (`space_*` core entities).
- API gateway seam and generated OpenAPI contracts for Space already exist.
- Feed/reactions/quest integration contours exist at backend level.

### 2.2 Frontend reality
- PWA Space surfaces are still mostly mock-driven.
- Space pages/components use local mock data for dashboard/feed/community and several side surfaces.
- Current Space UI should be treated as demo shell until connected to runtime.

## 3. Dependency readiness for phase 1
Status key: `ready` / `usable with debt` / `not ready for phase-1 use`

- Atlas: `usable with debt`  
  Atlas foundation + Atlas/Pulse realignment + Neon maturity gate are completed; full global geo normalization is intentionally deferred.
- Pulse: `usable with debt`  
  Event/content contract and ingestion/query seams are aligned for pre-Space gate; full legacy normalization remains deferred.
- RF: `usable with debt`  
  Practical wave 1 baseline is live; broader merchant/PRO surfaces remain deferred.
- Rielt: `usable with debt`  
  Practical wave 1 baseline is live; full owner/transactional suite remains deferred.
- Guru: `usable with debt` (not critical path for phase-1 shell)  
  Guru wave 1 is live; Space source expansion is deferred.
- Quest: `usable with debt`  
  Quest wave 1 is live; deeper `/space/*` quest surfaces are deferred.
- Social/profile/reaction/feed primitives: `ready` for narrow phase 1  
  Backend social core and feed/reaction contours are present; frontend wiring remains the main missing piece.

## 4. Recommended meaning of Space Asia phase 1
Space phase 1 is a cross-module integration shell, not a full social platform rollout.

Minimal meaning:
- expose a real personal/community entry layer backed by existing Space runtime;
- connect to already surfaced practical/discovery/engagement domains through references and links;
- keep social semantics truthful and bounded (no pretending full graph/ranking/moderation/product completeness).

## 5. Recommended phase-1 scope
### Must be in
- Runtime-backed Space shell entry (replace key mock-only shell path with real API-backed baseline).
- Core Space publication surfaces: post read/create baseline + basic feed/profile/group reads using existing `/v1/space/*`.
- Honest cross-module reference rendering (place/event/partner/listing/quest references as opaque links or lightweight previews).
- Explicit honest states for unavailable/deferred surfaces.

### May be in (if low risk)
- Minimal adapter layer in frontend for Space DTO -> ViewModel mapping.
- Limited reuse of existing feed/reaction signals where already stable.
- Narrow profile projection display where already runtime-backed.

### Explicitly out of scope
- Full social network feature set (follow graph maturity, rich social graph semantics).
- Broad ranking/search redesign for Space feeds.
- Full moderation/operator suite in product UX.
- Wallet/points/NFT/referrals full productization inside Space phase 1.
- Broad cross-domain normalization rewrite (geo/content/slug/id universal cleanup).
- Any reopening of RF/Rielt/Guru/Quest wave-2 workstreams.

## 6. Recommended internal sequencing (design-only)
### Phase 1a — Runtime shell activation
- Wire one canonical Space shell path to existing runtime (`/v1/space/*`) with truthful empty/error/degraded states.
- Keep non-runtime surfaces explicitly marked as deferred/demo.

### Phase 1b — Narrow cross-module integration
- Add controlled cross-links/reference previews for already-live modules (Atlas/Pulse/RF/Rielt/Quest), without domain ownership transfer.
- Keep preview semantics lightweight and non-blocking when references are incomplete.

### Phase 1c — Stabilization guard
- Validate that shell works under controlled debt assumptions from Atlas/Neon gate.
- Freeze explicit defer list before any wave-2 expansion.

## 7. Key risks and scope-drift traps
- Treating Space phase 1 as a full social platform instead of integration shell.
- Pulling wallet/points/NFT/referrals into Space core scope by UI pressure.
- Assuming full geo/content normalization already exists everywhere.
- Reopening Guru source-expansion or Quest/RF/Rielt wave-2 work under Space prompt.
- Replacing broad Space UI placeholders without runtime truth and contract discipline.

## 8. Explicit deferred list
- Full follow graph semantics and rich relationship model.
- Advanced feed ranking/search/recommendation logic.
- Full moderation/anti-abuse product console.
- Full `/space/quests`, `/space/vouchers`, `/space/nft`, `/space/referrals` production semantics where still mock-driven.
- Global cross-domain id/slug normalization beyond pre-Space maturity gate.

## 9. Implementation handoff recommendation
Space phase 1 is ready for the next implementation prompt if the prompt is explicitly constrained to integration-shell-first scope (phase 1a -> 1b), with strict defer enforcement.

No additional blocker-level micro-audit is required before implementation start.

## 10. Final recommendation
Proceed to Space Asia phase 1 now, but only as a runtime-backed integration shell with controlled debt.  
Do not allow phase 1 to drift into full social-platform completion or platform-wide normalization work.
