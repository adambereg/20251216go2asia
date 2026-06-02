# EST-TEST-1 — Establishment Test Contract

**Canon reference:** `Go2Asia Foundation Primitive Maturity & Establishment Canon v1` — **EST-E1**  
**Planning reference:** `docs/reports/stage_13B_5_FE_PP_p4_p5_full_establishment_planning_v1.md`

## What EST-TEST-1 is

- A **named evidence contract** for **establishment-tier** automated proof of P4/P5 runtime behavior.
- **Input** to future **Full Establishment Gates** (FE-P4 / FE-P5).
- **Not** a governance gate and **not** a tier grant.

## What EST-TEST-1 is not

- Not **ESTABLISHED_BOUNDED** (EBB) — see `FT-3A` / `FT-3B` / `FT-3C` / `FT-3D` / `request.test` bounded paths.
- Not **full `ESTABLISHED`** — no `P4_ESTABLISHED` / `P5_ESTABLISHED` verdict.
- Not **OpenAPI/SDK/DB** proof alone.
- Not **literal `true`** for `is*RuntimePrimitiveEstablished`.

## Location and naming

| Item | Value |
| --- | --- |
| Primary suite file | `apps/space-service/test/establishmentTier.contract.test.ts` |
| Describe prefix | `EST-TEST-1 —` |
| Evidence IDs | `E-P4-*`, `E-P5-*`, `E-AC-*` in test titles |
| Companion HTTP evidence | `request.test.ts` (authorial create, SR create, T-PP persistence) — cite in gates, not duplicated here |

## Commands

```bash
# Establishment contract only
pnpm --filter @go2asia/space-service test:establishment

# Full space-service regression (bounded + establishment + WS-5)
pnpm --filter @go2asia/space-service test

# Typecheck / lint
pnpm --filter @go2asia/space-service typecheck
pnpm --filter @go2asia/space-service lint
```

**Pass condition:** establishment suite exits **0**; full `test` suite remains **green**.

## Bounded vs establishment-tier

| Layer | Typical files | Tier |
| --- | --- | --- |
| Bounded slice | `authorialExpression.test.ts`, `sourceReferenceBoundary.test.ts`, … | **IMPLEMENTED / ACCEPTED / EBB** |
| Establishment contract | `establishmentTier.contract.test.ts` | **EST-E1 evidence** for **EST** gates |
| Full gate | Future `stage_13B_5_FE_P4_*` reports | **`P_ESTABLISHED`** verdict |

## Companion HTTP evidence (FE-P4-SURF)

After **Stage 13B.5-FE-P4-SURF**, cite `request.test.ts` cases **SURF-PUB-1/2**, **SURF-HL-1/2/3** for EST-R3 HTTP surface proof.

| Route | Surface | Tests |
| --- | --- | --- |
| `GET /v1/space/feed/publications/:userId` | `publications` | SURF-PUB-1, SURF-PUB-2 |
| `GET /v1/space/highlight/:postId` | `highlight` | SURF-HL-1, SURF-HL-3 |
| `GET /v1/space/highlight/reference` | `highlight` (artifact) | SURF-HL-2 |

**GAP-EST-HTTP-PUB** and **GAP-EST-HTTP-HL** are **CLOSED** at FE-P4-SURF (EST-R3 HTTP layer only).

## Known deferred (not EST-TEST-1 scope)
- **Literal policy:** CO-13 / CO-S12 flip — **LIT-P4 / LIT-P5** after EST grant.
