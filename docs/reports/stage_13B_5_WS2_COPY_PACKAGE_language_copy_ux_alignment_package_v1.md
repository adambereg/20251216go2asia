# Stage 13B.5-WS2-COPY-PACKAGE — Language / Copy / UX Alignment Package

**Document class:** `WS2_COPY_PACKAGE_ORCHESTRATED_IMPLEMENTATION`  
**Slice ID:** `WS2-COPY` (WS-7 language quarantine — UI copy only)  
**Not:** `WS2_AUTHORIZED` · `WS2_COMPLETE` · `WS2_BV_EXECUTION_PASS` · `IMPLEMENTATION_AUTHORIZED_GLOBAL` · runtime semantics change

**Pre-flight:** Orchestrated package for **PWA language / copy / UX labels** only. No authority to grant `WS2_AUTHORIZED`, run **WS2-BV-EXEC**, or alter WRITE / READ-PUB / READ-GRP / ACTIVITY runtime behavior.

---

## 1. Executive Summary

PWA copy now reflects **WS-2 doctrine** without changing runtime:

- **Save for myself** replaces ambiguous **Share-to-Space / public repost** framing for the private-retention composer path.
- **Publish / authorial** language preserved for posts and feed reasons (`author_post`, `group_post`).
- **Legacy repost** surfaces use **historical / legacy** badges (`legacy_repost_carve_out`, `legacy_group_repost_carve_out`, `legacy_repost_activity_carve_out`).
- Central dictionary: `apps/go2asia-pwa-shell/modules/space/ws2Copy.ts`.

**Package verdict:** **`WS2_COPY_PACKAGE_COMPLETE`**

```yaml
stage_13B_5_WS2_COPY_PACKAGE_next_safe_step: STAGE_13B_5_WS2_COPY_REVIEW
ws2_copy_alignment_complete: TRUE
ws2_authorized: FALSE
implementation_authorized_global: FALSE
```

---

## 2. Orchestrator Decision

| Gate | Decision |
| --- | --- |
| Copy-only scope (FP-C1) | **PASS** — no service policy / filter / SQL changes |
| CR-1..CR-10 | **PASS** — see §8 |
| FP-C1..FP-C8 | **PASS** — see §9 |
| space-service regression | **241/241** — **PASS** |
| PWA typecheck | **PASS** |
| PWA ws2Copy tests | **5/5** — **PASS** |
| PWA full suite | **126/131** — **5 pre-existing RF failures** (documented §10) |

---

## 3. Agent Participation Matrix

| Role | Contribution |
| --- | --- |
| **AI Program Director / Orchestrator** | Package workflow, scope gates, verdict |
| **Product Analyst** | Copy inventory, Save vs Publish vs Legacy map |
| **Frontend Developer** | PWA string alignment + `ws2Copy` module |
| **Runtime Governance Architect** | No semantics drift; legacy visible not hidden |
| **QA Agent** | FP-C catalog, regression boundary |
| **Technical Canon Writer** | Tokens, forbidden verdicts, next step |

**Backend Developer:** Not required — no API DTO / service display mapping changes.

---

## 4. Copy Inventory (Subtask A)

| Area | Prior wording risk | Files |
| --- | --- | --- |
| Share-to-Space CTA | «Поделиться в Space», «репост» as active action | `ContentActionRow.tsx`, `ShareToSpaceComposer.tsx` |
| Home feed filter | «Репосты» tab | `SpaceFeedSurface.tsx` |
| Feed cards | «Репост · …», «Комментарий к репосту» | `SpaceFeedCard.tsx` |
| Feed reason chips | `repost` → «Репост» | `utils.ts` → `ws2Copy.formatFeedReason` |
| Activity feed | «Вы сделали репост», filter «Репосты» | `ActivityPageClient.tsx` |
| Publications | «Репосты: N», publication type «Репост» | `PostsPublicationCard.tsx`, `PostsPublicationsSurface.tsx` |
| Page metadata | «репосты» in descriptions | `feed/page.tsx`, `posts/page.tsx` |
| Mock PostCard stats | «N репостов» | `PostCard.tsx` |

**Out of inventory (negative clarification only, unchanged):** `CTAPanel.tsx`, `EventDetail.tsx`, `QuestRunnerClient.tsx` — explicitly state action is **not** Space repost/save.

**space-service:** No user-facing copy constants changed (runtime tests unchanged).

---

## 5. Canonical Language Map (Subtask B)

| Old / ambiguous | New (RU UI) |
| --- | --- |
| Repost (active public action) | **Исторический репост** / **Историческая активность репоста** |
| Share to Space | **Сохранить для себя в Space** |
| Repost with comment (public) | **Заметка (опционально)** / **Комментарий к историческому репосту** (legacy visible rows) |
| Reposted by | **…поделился(ась) материалом (исторический репост)** |
| Public / group repost (active) | Removed from CTAs; composer states **не публичный/групповой репост** |
| Publish my post | **Публикация** / **Авторская публикация** |
| Source Reference | **Источник** (constants reserved; SR UI not yet wired in PWA) |
| Legacy repost | **Исторический репост** · **История** filter tab |
| Save for myself | **Сохранить для себя** |

---

## 6. Files Read

| File | Purpose |
| --- | --- |
| `stage_13B_5_WS2_ACTIVITY_REVIEW_v1.md` | Prior step acceptance |
| `stage_13B_3_F_ws_6_activity_projection_specification_v1.md` | Activity projection canon |
| `ws2Propagation*ReadPolicy.ts` (space-service) | Feed `reason` / activity `type` tokens (read-only) |
| PWA Space surfaces (see §4) | Copy inventory |

---

## 7. Files Changed

| File | Change |
| --- | --- |
| `modules/space/ws2Copy.ts` | **NEW** — canonical WS-2 copy dictionary + formatters |
| `modules/space/ws2Copy.test.ts` | **NEW** — copy doctrine unit tests |
| `components/space/runtime/utils.ts` | Delegate `formatFeedReason` to `ws2Copy` |
| `components/interaction/ContentActionRow.tsx` | Save-for-myself CTA + messages |
| `components/interaction/ShareToSpaceComposer.tsx` | Private retention composer copy |
| `components/space/runtime/SpaceFeedCard.tsx` | Legacy badges / commentary labels |
| `components/space/runtime/SpaceFeedSurface.tsx` | History filter + empty states |
| `app/(public)/space/activity/ActivityPageClient.tsx` | Legacy activity types + labels |
| `app/(public)/space/posts/PostsPublicationCard.tsx` | Publication type + legacy titles |
| `app/(public)/space/posts/PostsPublicationsSurface.tsx` | Surface subtitles / summary chip |
| `app/(public)/space/posts/PostsPageClient.tsx` | Loading copy |
| `app/(public)/space/posts/page.tsx` | Metadata description |
| `app/(public)/space/feed/page.tsx` | Metadata description |
| `components/space/Feed/PostCard.tsx` | Stats label (preview mock) |

**Not changed:** `apps/space-service/**` (except unchanged test baseline), OpenAPI, SDK, migrations, proof literals.

---

## 8. Copy / UX Changes (Subtasks C–D)

### C — PWA copy alignment

- **ContentActionRow:** «Сохранить для себя в Space»; success/error messages describe **private save**, not public repost.
- **ShareToSpaceComposer:** Title/hint/submit aligned to **личное сохранение**; explicit **not** feed/public/group repost.
- **SpaceFeedSurface:** Filter «История»; empty states reference **historical records**, not active repost action.
- **SpaceFeedCard:** Legacy badge via `getRepostArtifactBadgeLabel`; private retention keeps **личная заметка**.

### D — Activity / feed label alignment

| Runtime token | UI label |
| --- | --- |
| `legacy_repost_carve_out` | Исторический репост |
| `legacy_group_repost_carve_out` | Исторический групповой репост |
| `author_post` | Публикация |
| `group_post` | В группе |
| `legacy_repost_activity_carve_out` | Историческая активность репоста (via `formatActivityFeedType`) |
| `repost_created` / `post_reposted_by_other` | Historical activity framing (SDK type lag handled with string guards) |

---

## 9. Tests / Validation (Subtask E)

| Command | Result |
| --- | --- |
| `pnpm --filter @go2asia/pwa-shell typecheck` | **PASS** |
| `pnpm --filter @go2asia/pwa-shell lint` | **0 errors** (212 pre-existing warnings) |
| `pnpm exec vitest run modules/space/ws2Copy.test.ts` | **5/5 PASS** |
| `pnpm --filter @go2asia/pwa-shell test` (full) | **126 passed, 5 failed** — failures in `rfVoucherLifecycle.test.ts` / RF economy labels (**pre-existing**, unrelated to WS2 copy) |
| `pnpm --filter @go2asia/space-service test` | **241/241 PASS** |
| `pnpm --filter @go2asia/space-service typecheck` | **PASS** (implicit via unchanged TS build in CI matrix) |
| `pnpm --filter @go2asia/space-service lint` | **Not re-run separately** — no space-service file edits |

---

## 10. False Pass Review

| ID | Risk | Result |
| --- | --- | --- |
| **FP-C1** | Rename UI only while semantics unchanged | **PASS** — framed as copy package; space-service untouched |
| **FP-C2** | Hide legacy labels | **PASS** — legacy **more visible** (historical framing) |
| **FP-C3** | «Repost» as current public action | **PASS** — removed from active CTAs |
| **FP-C4** | Ambiguous «share» = publish | **PASS** — Save vs Publish separated |
| **FP-C5** | Private save sounds public | **PASS** — composer + helper text |
| **FP-C6** | Source Reference sounds like repost target | **PASS** — separate `sourceReference` constants |
| **FP-C7** | Claim `WS2_AUTHORIZED` | **PASS** |
| **FP-C8** | Change runtime during copy | **PASS** |

---

## 11. Boundary Review

| Slice | Touched? | Result |
| --- | --- | --- |
| WRITE | **NO** | **PASS** |
| READ-PUB / READ-GRP / ACTIVITY filters | **NO** | **PASS** |
| WS2-BV-EXEC / WS2-AUTH | **NO** | **PASS** |
| OpenAPI / SDK | **NO** | **PASS** |
| DB migrations | **NO** | **PASS** |
| Proof literals | **NO** | **PASS** |

---

## 12. Remaining Risks / Non-blockers

| Risk | Severity | Note |
| --- | --- | --- |
| SDK `SpaceActivityFeedItemType` lacks `legacy_repost_activity_carve_out` | Low | PWA uses string guards until OpenAPI/SDK bump |
| Source Reference UI not yet on cards | Low | Constants ready; SR shown when PWA binds `post.sourceReference` |
| PWA RF test failures | Non-blocker | Pre-existing; not introduced by this package |
| Internal filter key still `reposts` | Low | User-facing label is «История»; key rename deferred to avoid logic churn |

---

## 13. Agent Findings

### 13.1 AI Program Director / Orchestrator

- **COPY-ORCH-1:** Package stayed inside WS-7 copy boundary — **PASS**.
- **COPY-ORCH-2:** Next step **`STAGE_13B_5_WS2_COPY_REVIEW`** before BV — **PASS**.
- **COPY-ORCH-3:** No forbidden authorization tokens — **PASS**.

### 13.2 Product Analyst

- **COPY-PA-1:** Save vs Publish distinction visible in primary CTAs — **PASS**.
- **COPY-PA-2:** Legacy repost framed as historical, not hidden — **PASS**.
- **COPY-PA-3:** Group feed copy supports authorial-only via «В группе» / authorial chips — **PASS**.

### 13.3 Frontend Developer

- **COPY-FE-1:** Central `ws2Copy.ts` reduces drift — **PASS**.
- **COPY-FE-2:** Activity legacy types handled despite SDK enum lag — **PASS**.
- **COPY-FE-3:** No redesign; string-only diff — **PASS**.

### 13.4 Runtime Governance Architect

- **COPY-GOV-1:** Copy does not imply public/group repost is available — **PASS**.
- **COPY-GOV-2:** `formatFeedReason` maps carve-out reasons without hiding rows — **PASS**.
- **COPY-GOV-3:** space-service policies unchanged — **PASS**.

### 13.5 QA Agent

- **COPY-QA-1:** FP-C1..C8 — **PASS**.
- **COPY-QA-2:** 241 space-service tests regression-free — **PASS**.
- **COPY-QA-3:** ws2Copy unit tests added — **PASS**.

### 13.6 Technical Canon Writer

- **COPY-CANON-1:** Verdict `WS2_COPY_PACKAGE_COMPLETE` ≠ WS2 complete — **PASS**.
- **COPY-CANON-2:** Vocabulary aligned for upcoming **WS2-BV-EXEC** negative checks — **PASS**.

### 13.7 Disagreements

**Blocking disagreement:** None.

---

## 14. Final Verdict

**`WS2_COPY_PACKAGE_COMPLETE`**

| Verdict | Used? |
| --- | --- |
| `WS2_COPY_PACKAGE_COMPLETE` | **YES** |
| `WS2_COPY_PACKAGE_PARTIAL` | **NO** |
| `WS2_COPY_PACKAGE_DEFERRED` | **NO** |
| Forbidden tokens | **NONE** |

```yaml
stage_13B_5_WS2_COPY_PACKAGE_status: PASS
stage_13B_5_WS2_COPY_PACKAGE_verdict: WS2_COPY_PACKAGE_COMPLETE
stage_13B_5_WS2_COPY_PACKAGE_execution_mode: ORCHESTRATED_PACKAGE_COPY_ONLY
ws2_copy_alignment_complete: TRUE
ws2_authorized: FALSE
implementation_authorized_global: FALSE
stage_13B_5_WS2_COPY_PACKAGE_next_safe_step: STAGE_13B_5_WS2_COPY_REVIEW
```

---

## Execution Summary

| Field | Value |
| --- | --- |
| **Report** | `docs/reports/stage_13B_5_WS2_COPY_PACKAGE_language_copy_ux_alignment_package_v1.md` |
| **Verdict** | `WS2_COPY_PACKAGE_COMPLETE` |
| **Next** | `STAGE_13B_5_WS2_COPY_REVIEW` (then `STAGE_13B_5_WS2_BV_EXEC` per program) |
| **Runtime changes** | **NONE** |
