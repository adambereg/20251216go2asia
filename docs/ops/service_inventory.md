# Service Inventory (repo -> Platform Canon v2 mapping)

Дата: 2026-04-28  
Статус: **Source of truth по фактической runtime-реализации в `apps/*`**

## Зачем этот документ

Этот файл фиксирует фактическое состояние приложений в репозитории и их статус относительно Platform Canon v2:

- `docs/architecture/platform/go2asia_ecosystem_overview_v2.md`
- `docs/architecture/platform/go2asia_backend_services_architecture_v2.md`
- `docs/architecture/platform/go2asia_interface_architecture_v2.md`
- `docs/architecture/platform/go2asia_canon_alignment_backlog_v1.md`

Он не заменяет domain docs. Его задача - не дать старым документам снова трактовать future или legacy service names как текущую runtime truth.

## Canon runtime notes

- There is no runtime `apps/connect-service`.
- There is no runtime `apps/missions-service`.
- Connect Asia is a product/UI hub, not a backend-domain service.
- `GET /v1/points/connect-dashboard` inside `apps/points-service` is only a read-model / UI aggregation endpoint. It must not become a hidden Connect backend owner.
- `apps/content-service` is the current MVP runtime owner for Atlas / Pulse / Blog content surfaces. Legacy `atlas_service` and `pulse_service` docs are superseded for current runtime planning.
- RF/Voucher ownership belongs to the RF/business layer in current canon. Legacy `voucher_service` docs are superseded for current runtime planning.
- Legacy `nft_service` and Blockchain Gateway docs are future-layer references, not current runtime services.
- `apps/token-service` exists only as a future/skeleton baseline and must not be treated as mature tokenomics.

## 1. Current runtime applications in `apps/*`

| App | Category | Runtime role | Evidence |
| --- | --- | --- | --- |
| `apps/api-gateway` | BFF/composition/read-model | Edge gateway and proxy by route prefix. Does not own domain logic. | `apps/api-gateway/src/index.ts`, `apps/api-gateway/wrangler.toml` |
| `apps/auth-service` | domain service | Auth/identity webhook and user materialization. | `apps/auth-service/src/index.ts`, `packages/db/src/schema/auth.ts` |
| `apps/content-service` | domain service | Runtime owner for Atlas / Pulse / Blog content: countries, cities, places, articles, events and event registration. | `apps/content-service/src/index.ts`, `packages/db/src/schema/content.ts` |
| `apps/media-service` | support/service utility | Media storage/signing/pipeline support. Does not own product domains. | `apps/media-service/src/index.ts` |
| `apps/points-service` | domain service | Points ledger, balances, transactions, reward execution, current off-chain badges baseline, and Connect dashboard read-model. | `apps/points-service/src/index.ts`, `packages/db/src/schema/points.ts` |
| `apps/referral-service` | domain service | Referral codes, relations, tree, earnings and first-login reward integration. | `apps/referral-service/src/index.ts`, `packages/db/src/schema/referral.ts` |
| `apps/token-service` | future/skeleton | Health-only baseline for future tokenomics. Not mature G2A/token engine. | `apps/token-service/src/index.ts` |
| `apps/space-service` | domain service | Space UGC/social publication contour. | `apps/space-service/src/index.ts` |
| `apps/feed-service` | BFF/composition/read-model | Feed projection/composition over Space/Reactions. | `apps/feed-service/src/index.ts` |
| `apps/reactions-service` | domain service | Reactions and structured interaction contour. | `apps/reactions-service/src/index.ts` |
| `apps/quest-service` | domain service | Quest routes, tasks/steps, progress, submissions, proof/review and reward handoff. | `apps/quest-service/src/index.ts`, `apps/quest-service/src/services/questService.ts` |
| `apps/rf-service` | domain service | RF partners, offers, vouchers, branches, business lines and related partner workflows. | `apps/rf-service/src/index.ts` |
| `apps/rielt-service` | domain service | Housing/listing/inquiry domain with RF partner/offer references. | `apps/rielt-service/src/index.ts` |
| `apps/guru-service` | BFF/composition/read-model | Nearby composition over domain services. Not Geo Service and not geo/domain truth owner. | `apps/guru-service/src/index.ts`, `apps/guru-service/src/routes/nearby.ts` |
| `apps/organizer-service` | legacy/unclear or provisional domain until classified | Trips/organizer contour exists, but Platform Canon v2 does not yet classify its final role. | `apps/organizer-service/src/index.ts`, `apps/organizer-service/src/routes/trips.ts` |
| `apps/go2asia-pwa-shell` | frontend application | Next.js PWA frontend shell. Not a backend service. | `apps/go2asia-pwa-shell/package.json` |

## 2. Legacy service names and current interpretation

| Legacy / target name in older docs | Current runtime interpretation | Planning rule |
| --- | --- | --- |
| `connect_service` / Connect Service | No runtime app. Connect is UI/product hub. `connect-dashboard` is a read-model inside Points Service. | Do not create or target `apps/connect-service` unless Platform Canon v2 is explicitly updated. |
| `missions_service` / Missions Service | No runtime app. Future orchestration/reward-intent layer. | Direct Points calls are allowed only under the pre-Missions baseline; they are not a replacement for future reward intents. |
| `atlas_service` | Superseded for current MVP by `apps/content-service` for Atlas content surfaces. | Do not treat `docs/backend/atlas_service/*` as current runtime service inventory. |
| `pulse_service` | Superseded for current MVP by `apps/content-service` for Pulse event surfaces. | Do not target a runtime `apps/pulse-service` in current MVP planning. |
| `voucher_service` | Superseded for current canon by RF/Voucher ownership in `apps/rf-service` and related RF docs. | Do not introduce a separate voucher owner without architecture decision. |
| `nft_service` | Future Badges/NFT layer reference. Current badges are off-chain and exposed through Points-related APIs. | Treat as future-layer docs, not runtime truth. |
| Blockchain Gateway Service | Future on-chain execution layer. | Not current runtime. Do not mix with Points MVP. |
| Token Service | `apps/token-service` exists as skeleton only. | Keep separate from Points and Connect. Do not treat as mature tokenomics. |

## 3. Current economy/reward baseline

Current runtime before mature Missions Service:

- Points Service owns ledger, balances, transactions and reward execution.
- Allowed current producers call `POST /internal/points/add` through service-to-service auth:
  - `apps/auth-service`
  - `apps/content-service`
  - `apps/quest-service`
  - `apps/referral-service`
- `apps/points-service` receives and executes the internal call.
- UI must not write ledger.
- Connect dashboard must remain read-only aggregation.
- Seed/demo scripts are not production reward path.

Detailed baseline: `docs/architecture/platform/pre_missions_reward_baseline_v1.md`.

## 4. Shared packages and contracts

- `packages/db`: shared Drizzle schemas and migrations.
- `packages/sdk`: frontend/server SDK helpers against API Gateway and service paths.
- `packages/logger`: structured logging and request correlation.
- `docs/openapi/openapi.bundle.yaml`: current bundled OpenAPI contract.

## 5. Non-goals for this inventory

- No code changes.
- No service creation.
- No OpenAPI changes.
- No DB migrations.
- No deletion of legacy docs.
- No global replacement of old service names.
