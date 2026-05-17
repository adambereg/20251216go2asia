Go2Asia Pre-Missions Reward Baseline v1

1. Purpose

Этот документ фиксирует допустимый runtime baseline начислений до появления зрелого Missions Service.

Он нужен, чтобы текущие прямые service-to-service вызовы в Points Service не воспринимались как финальная architecture model и не подменяли будущую reward-intent orchestration.

Связанные canon-документы:

- `docs/architecture/platform/go2asia_ecosystem_overview_v2.md`
- `docs/architecture/platform/go2asia_backend_services_architecture_v2.md`
- `docs/architecture/platform/go2asia_interface_architecture_v2.md`
- `docs/architecture/platform/go2asia_canon_alignment_backlog_v1.md`

2. Current Baseline

Текущий runtime baseline до Missions Service:

- Points Service owns ledger, balances, transactions and reward execution.
- Domain services may temporarily call `POST /internal/points/add` through service-to-service auth.
- This is a transitional baseline before Missions Service.
- Direct calls to Points are not a replacement for future reward-intent orchestration.
- Connect dashboard is read-only UI aggregation and must not write ledger or decide rewards.
- UI must not call ledger-write endpoints directly.
- `Producer` in this document means an observed runtime service-to-service Points caller in the current transitional baseline. It does not activate new reward producers, accrual pipelines, payout, settlement, spend enforcement, wallet/token/G2A/NFT/on-chain runtime, or Slice 16 movement.

3. Allowed Current Producers

Фактически найденные current producers, которые вызывают `POST /internal/points/add`:

| Producer | Evidence | Current trigger / context |
| --- | --- | --- |
| `apps/auth-service` | `apps/auth-service/src/index.ts` | Clerk webhooks: registration and first-login style rewards. |
| `apps/content-service` | `apps/content-service/src/index.ts` | Event registration reward baseline. |
| `apps/quest-service` | `apps/quest-service/src/services/questService.ts` | Quest completion reward handoff through outbox/delivery flow. |
| `apps/referral-service` | `apps/referral-service/src/index.ts` | Referral first-login reward integration. |

`apps/points-service` is the receiver/executor, not an external producer, for `POST /internal/points/add`.

No runtime `apps/missions-service` exists in the current repo state.

4. Required Guardrails

Any current producer that calls `POST /internal/points/add` must follow these guardrails:

- Use service-to-service authentication.
- Provide idempotency via `externalId` or equivalent stable key.
- Use explicit action taxonomy.
- Include metadata that describes the source domain event.
- Keep reward execution in Points Service.
- Do not write Points ledger from UI.
- Do not write Points ledger from Connect dashboard.
- Do not treat seed/demo scripts as production reward path.
- Do not put Missions ownership inside Quest.
- Do not put reward eligibility logic inside UI.
- Do not treat direct Points calls as final replacement for future reward intents.

5. Seed / Demo Scripts

Seed/demo scripts may write demo economy data for controlled setup, but they are not a production reward path.

Known demo/economy seed evidence:

- `packages/db/src/connectDemoData.ts`
- `packages/db/src/seedConnectDemo.ts`
- `packages/db/src/verifyConnectDemo.ts`
- `docs/runbooks/connect_demo_seed_runbook_v1.md`

These scripts must not be used as implementation examples for runtime reward flows.

6. Future Migration Path

When Missions Service is introduced:

- Domain events should eventually feed Missions / reward-intent orchestration where appropriate.
- Missions Service may own mission catalog, conditions, user mission progress and reward intents.
- Missions Service must not own Points ledger.
- Points Service remains ledger and reward execution owner.
- Badges/NFT/on-chain layers remain future unless explicitly promoted by Platform Canon.
- Quest may emit quest events into Missions, but Quest Tasks remain separate from ecosystem Missions.

7. Non-Goals

- No new service.
- No API change.
- No code change.
- No DB change.
- No implementation.
- No reward-intent implementation in this pass.
- No Missions Service creation.
- No change to existing direct producer calls in this pass.
- No authority switch from Stage 6.5 terminology alignment.
