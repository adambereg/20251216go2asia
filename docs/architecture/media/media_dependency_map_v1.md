# Media Dependency Map v1

**Project:** Go2Asia  
**Module:** Media  
**Service focus:** `media-service`  
**Document role:** Canonical dependency map SSOT for platform media  
**Status:** Draft v1 (assembly baseline)

---

# 1. Purpose

This document defines dependency boundaries around `media-service` as the platform media bounded context.

Goals:

- clarify who writes media data vs who only references it,
- separate current operational dependencies from transitional and target states,
- prevent ownership bleed from business domains into media and vice versa.

---

# 2. Upstream Dependencies

| Dependency | Type | Current role |
|------|------|------|
| `api-gateway` | routing + auth context | Canonical public entry `/v1/media/*`; injects gateway auth for protected media operations |
| object storage (R2 bindings) | binary storage | Stores uploaded bytes by bucket/key |
| `packages/db` / Neon | metadata storage | Persists `media_assets`, `media_variants`, `media_usage` |
| signing secrets | security | Upload token signing and gateway-service auth verification |

---

# 3. Downstream / Consumers

| Consumer | Dependency posture |
|------|------|
| Space | Uses `media_id` and attach semantics for post media links |
| Rielt | Stores `media_id` references for listing media relations |
| RF | Uses media references for partner/branch visuals |
| Quest | Uses media references for proof/cover attachments |
| Atlas | Uses media references for entity media bindings |
| Content/Blog | Uses media references for article visuals |

All consumers are **reference clients**. None may own asset storage internals.

---

# 4. Read vs Write Rules

## 4.1 Who writes media-owned data

- `media-service` writes `media_assets`, `media_variants`, `media_usage`.
- No other service may write media-owned tables directly.

## 4.2 Who writes domain-owned data

- Space/Rielt/RF/Quest/Atlas/Content write their own business tables only.
- Media must not mutate domain business truth.

## 4.3 Who reads media data

- Consuming services and clients may read media metadata/lookups through media API.
- Domain consumers should persist only stable references (`media_id` and domain-local ordering/flags).

---

# 5. Transitional Coupling (Current Runtime)

- API gateway currently supports fallback `/v1/media/* -> /v1/content/media/*` when `MEDIA_SERVICE_URL` is not configured.
- This fallback is transitional and not a target-state ownership model.
- Content-service fallback currently covers only a limited upload-token/upload contour and does not represent full route parity with canonical media runtime.
- Fallback also does not represent full media-domain write-truth parity (for example, platform media persistence/attachment guarantees are defined by `media-service`).

---

# 6. Forbidden Dependency Patterns

| Pattern | Rule |
|------|------|
| Domain services store raw media binaries/keys as ownership truth | Forbidden; only media service owns storage internals |
| Media service owns domain entity lifecycle | Forbidden; media only keeps attachment references |
| Direct DB writes to media tables from non-media services | Forbidden |
| Treating blog/content docs as canonical media platform contract | Forbidden for platform-media SSOT decisions |
| Treating transitional fallback as final topology | Forbidden |

---

# 7. Current vs Target Integration Posture

- **Current:** `media-service` operational for core platform routes; gateway fallback path exists.
- **Current transitional:** content-service legacy media endpoints are still reachable via fallback mode, but this mode is compatibility-only and not equivalent to canonical media ownership/persistence behavior.
- **Target:** dedicated media-service is single owner of `/v1/media/*` without fallback coupling.

---

*This map is canonical for platform media dependencies and ownership boundaries.*
