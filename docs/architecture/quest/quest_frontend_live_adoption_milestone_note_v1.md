# Quest Frontend Live Adoption Milestone Note v1

## 1. Purpose

This note records the Quest frontend wave 1 completion baseline.
It fixes what is now live in the Quest user-facing engagement/progression layer and what remains intentionally deferred.
It is a milestone fixation note, not a roadmap for the next implementation cycle.

## 2. Current Quest frontend state

Quest now has a live frontend contour for core user flow:
- public quest list is runtime-backed;
- quest detail is runtime-backed;
- run flow is runtime-backed through start/progress/submit endpoints;
- lifecycle state messaging is explicit for active, pending review, completed, and non-active states.

Current limits remain explicit:
- `/quest/my`, `/quest/leaderboard`, and `/space/quests` remain deferred placeholder surfaces;
- proof submission UX is intentionally minimal and not a full production proof toolset;
- no broad authoring/moderation/operator frontend suite is exposed in this wave.

## 3. What wave 1 actually delivered

- Public quest list surfaced via live runtime (`GET /v1/quests`).
- Quest detail surfaced via live runtime (`GET /v1/quests/{questId}`).
- Live run/start/progress/submit path surfaced via runtime (`start`, `progress`, `submit`).
- Honest lifecycle communication for pending review and completion/degradation outcomes.
- Primary truth moved from mock/localStorage shell to runtime-backed flow for core surfaces.

## 4. What remains intentionally out of scope

- `/quest/my`
- `/quest/leaderboard`
- `/space/quests`
- broader authoring/moderation/admin suite
- wallet/reward/token UX
- richer cross-domain proof UX and deep verification UX
- broader Quest wave 2 experience expansion

## 5. Milestone verdict

Quest frontend is now a meaningful first live engagement baseline with controlled residual debt.

## 6. What this note does not claim

This note does not claim that:
- Quest frontend is fully complete;
- full gamification/platform UX exists;
- all quest-related screens are live;
- a later Quest wave 2 is unnecessary.

## 7. Implication for sequencing

Quest wave 1 can be treated as complete for the current frontend sequencing baseline.
The next frontend segment may move to Atlas/Pulse broader UI realignment.
A later Quest wave 2 can return intentionally, with explicit scope, rather than implicitly.
