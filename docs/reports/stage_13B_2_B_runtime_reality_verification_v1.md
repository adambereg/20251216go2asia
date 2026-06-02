# Stage 13B.2-BV - Repost Commentary Edit Flow Runtime Verification

## Execution mode

Read-only runtime verification audit.

No fixes, implementation, refactoring, roadmap advancement, or Track B work were performed.

Multi-agent roles covered:

- Runtime Validation Agent
- Frontend Developer
- QA Agent
- Runtime Governance Architect
- Product Analyst
- Technical Canon Writer

## Verification target

This audit verifies the gap between:

- `stage_13B_2_B_status: COMPLETE_AS_BOUNDED_REPOST_COMMENTARY_EDIT_FLOW`
- actual runtime visibility and end-to-end usability of repost commentary edit controls.

Runtime screenshot showed repost cards with:

- visible repost commentary display;
- visible repost preview;
- no visible `Добавить комментарий`;
- no visible `Редактировать комментарий`;
- no visible inline editor or owner controls.

## Files inspected

- `docs/reports/stage_13B_2_A_repost_commentary_composer_v1.md`
- `docs/reports/stage_13B_2_B_repost_commentary_edit_upgrade_flow_v1.md`
- `apps/go2asia-pwa-shell/components/space/runtime/SpaceFeedCard.tsx`
- `apps/go2asia-pwa-shell/components/space/runtime/SpaceFeedSurface.tsx`
- `apps/go2asia-pwa-shell/components/interaction/ShareToSpaceComposer.tsx`
- `apps/space-service/src/routes/posts.ts`
- `apps/space-service/src/services/spaceService.ts`
- additional runtime-path files:
  - `apps/api-gateway/src/index.ts`
  - `apps/space-service/src/index.ts`
  - `apps/go2asia-pwa-shell/components/dev/AuthModeToggle.tsx`

## Question 1 - Where should edit controls appear?

Edit controls are implemented only on the Space feed card path:

`/space/feed` -> `SpaceFeedSurface` -> `SpaceFeedCard`

The canonical render block is in `SpaceFeedCard.tsx`:

- label: `Управление комментарием к вашему репосту`
- button for repost-only: `Добавить комментарий`
- button for repost-with-commentary: `Редактировать комментарий`
- expanded editor: textarea + `Отмена` + `Сохранить`

The controls are rendered after the repost preview block, near the bottom of the card.

## Question 1 - Render condition

The exact UI gate is:

```ts
const canEditOwnRepostCommentary =
  Boolean(currentUserId) &&
  currentUserId === item.post.author.userId &&
  item.post.postType === 'repost' &&
  Boolean(item.post.repost);
```

`currentUserId` is passed only by `SpaceFeedSurface`:

```ts
const currentUserId = isSignedIn && user?.id ? user.id : null;
```

Therefore all conditions must be true:

1. user is signed in through Clerk (`isSignedIn && user.id`);
2. current Clerk user id equals `item.post.author.userId`;
3. card is a `postType: 'repost'`;
4. card has `post.repost`.

Other `SpaceFeedCard` usages do not pass `currentUserId`, so controls are never visible there:

- `/space`
- `/space/saved`
- `/space/profiles/[userId]`
- `/space/community/groups/[groupId]`

## Question 2 - Why controls are absent on the runtime screenshot

The screenshot itself is consistent with the edit gate not being satisfied.

Most likely UI-level reasons:

- viewer is not signed in through Clerk, so `currentUserId === null`;
- viewer is signed in but the repost is not authored by the current Clerk user id;
- visible screen is not the exact `/space/feed` owner-card state required by the edit gate;
- deployed frontend build may not include the Stage 13B.2-B code;
- the controls are below the repost preview block and can be missed if the bottom of the card is not fully visible.

Important note: the `Не авторизован` button in the bottom-right corner is `AuthModeToggle`, a dev/mock auth toggle. It is not the same as Clerk auth and does not directly satisfy `SpaceFeedSurface`'s `useUser()` gate. It can mislead runtime verification because edit controls depend on Clerk, not this toggle.

However, the screenshot cannot by itself expose `currentUserId`, `author.userId`, or deployed bundle SHA. Therefore the exact failed UI operand cannot be proven from the image alone. What can be proven from code is that at least one required UI gate operand is false in the observed runtime.

## Question 3 - User scenarios

### Scenario A

`repost without commentary -> add commentary later -> save`

Verdict: `PARTIAL`

Reason:

- UI code exists on `/space/feed` for own reposts;
- it calls `PATCH /v1/space/posts/{postId}`;
- but the full production path through gateway is not wired for PATCH auth, so staging/runtime E2E is not verified and is likely blocked.

### Scenario B

`repost with commentary -> edit commentary -> save`

Verdict: `PARTIAL`

Reason:

- UI code exists and can display `Редактировать комментарий` for an owned repost with text;
- save path is the same PATCH path;
- production E2E remains blocked by gateway/protected-route gap.

### Optional Scenario C

`clear text -> save -> repost remains repost-only`

Verdict: `PARTIAL`

Reason:

- UI sends `text: null` when draft is empty;
- service normalizes empty/whitespace text to `null`;
- production E2E still depends on the same PATCH path.

## Question 4 - Backend reality

### Direct space-service reality

`PATCH /v1/space/posts/{postId}` exists in `space-service`:

- `apps/space-service/src/routes/posts.ts`
  - routes PATCH to `updateRepostCommentary(...)` when `principal` exists.
- `apps/space-service/src/services/spaceService.ts`
  - validates only `text`;
  - requires author ownership;
  - requires `post_type === 'repost'`;
  - updates only `text`;
  - returns updated `SpacePostResponse`.

Direct service tests verify this path when a gateway JWT is supplied.

### Full runtime path reality

The complete runtime path is not closed:

`PWA customInstance -> api-gateway -> space-service`

Observed gap:

- `apps/api-gateway/src/index.ts`
  - `classifyRoute(...)` has no route classification for `PATCH /v1/space/posts/{postId}`;
  - `isProtectedSpaceRoute(...)` does not include PATCH for `/v1/space/posts/{postId}`.
- `apps/space-service/src/index.ts`
  - `isProtectedRoute(...)` also does not include PATCH for `/v1/space/posts/{postId}`.

Expected consequence:

- PWA sends a PATCH request;
- gateway does not treat it as protected Space write;
- gateway does not mint/pass the required `X-Gateway-Auth` principal for this route;
- space-service receives no `principal`;
- `routes/posts.ts` PATCH branch does not run because it requires `principal`;
- runtime likely returns a generic not-found/unhandled response, and UI shows `Не удалось обновить комментарий к репосту`.

Therefore backend PATCH is verified only as a direct service capability, not as a production-ready UI -> API -> service flow.

## Question 5 - Runtime Reality Verdict

Selected verdict:

`E - REPORT_RUNTIME_MISMATCH`

Rationale:

- report claims `stage_13B_2_B_repost_upgrade_runtime: TRUE`;
- UI controls exist but are narrow and conditionally hidden;
- screenshot does not show user-accessible controls;
- full runtime flow is not complete because gateway/protected PATCH wiring is missing;
- direct service tests are insufficient to prove staging/runtime user accessibility.

This is stronger than `COMPLETE_BUT_HIDDEN` because the UI is not merely hidden by author/auth conditions. The save path itself is not confirmed through the deployed gateway runtime.

## Acceptance recommendation

Do not accept Stage 13B.2-B as runtime-complete yet.

Return Stage 13B.2-B to bounded do-work with the smallest possible scope:

1. wire `PATCH /v1/space/posts/{postId}` in api-gateway route classification;
2. mark it protected in `api-gateway` so Clerk auth is converted into gateway principal;
3. mark it protected in `space-service` so direct service requires `X-Gateway-Auth`;
4. add/adjust gateway and service tests for the PATCH route;
5. re-run runtime verification on staging with a signed-in author account.

Do not advance to Stage 13B.2-C until this is resolved or explicitly re-scoped.

## Review gates

### Runtime Validation Review

Result: fail for production accessibility.

Reason: edit controls are gated and not visible in observed runtime; PATCH path is not end-to-end verified.

### QA Review

Result: partial.

Reason: space-service unit tests cover direct PATCH with gateway JWT, but gateway/runtime integration is missing.

### Runtime Governance Review

Result: fail.

Reason: report says runtime upgrade is complete, but gateway route protection does not include PATCH.

### Canon Review

Result: boundaries preserved.

No economy, comments, replies, quote taxonomy, or Connect writes were introduced.

## Boundary verification

Boundaries remain intact:

- Reactions remains `like` / `bookmark` owner only.
- Space remains repost propagation owner.
- Activity remains projection-only.
- Connect remains projection-only.
- No Points, rewards, reward outbox, producer activation, comments, replies, quote post type, or taxonomy expansion.

The issue is not boundary collapse. The issue is runtime availability mismatch.

## Status tokens

stage_13B_2_B_verification_status: COMPLETE_AS_RUNTIME_REALITY_VERIFICATION
stage_13B_2_B_runtime_accessible: FALSE
stage_13B_2_B_backend_patch_verified: PARTIAL_DIRECT_SERVICE_ONLY_GATEWAY_NOT_WIRED
stage_13B_2_B_ui_controls_visible: CONDITIONALLY_HIDDEN_NOT_VISIBLE_IN_SCREENSHOT
stage_13B_2_B_report_runtime_match: FALSE
stage_13B_2_B_acceptance_recommendation: RETURN_TO_STAGE_13B_2_B_DO_WORK_BEFORE_13B_2_C
