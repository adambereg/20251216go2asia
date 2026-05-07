# RF Asia Stage 5.0 — PRO Attribution Baseline Design Audit & Implementation Plan

**Status:** design / audit only (no implementation in this document).
**Scope:** attribution facts for “who brought the user to the offer” and “which PRO context is bound to a server-issued voucher”.
**Explicit non-scope:** payouts, Points, tokens, commissions, revenue share, NFT, ledger, on-chain, automatic rewards.

**Attribution canon:** see `docs/architecture/rf/rf_attribution_canon_refinement_v1.md` for the ecosystem-level attribution principles that refine this Stage 5.0 baseline (immutability after first successful claim, public vs internal identity, versioning, TTL and metadata boundaries).

**Document placement:** `docs/architecture/rf/` — same family as `rf_pro_linked_partners_baseline_v1.md`, `rf_merchant_catalog_item_model_audit_v1.md`, `rf_pro_stage_5_closure_note_v1.md`.
`docs/rf/` at repo root is not used; economy SSOT lives under `docs/economy/` and must stay conceptually separate from this baseline.

---

## 1. Current State Audit

### 1.1 RF Merchant Catalog (items, offers, vouchers)

| Layer | Location | Notes |
|--------|-----------|--------|
| **DB schema** | `packages/db/src/schema/rf.ts` | `rf_partner_item`, `rf_offer` (optional `itemId`), `rf_voucher`, `rf_pro_link`, `rf_claim_idempotency`, `rf_voucher_redemption` |
| **Items** | `rf_partner_item` | Merchant catalog; optional link from offer via `rf_offer.item_id` |
| **Offers** | `rf_offer` | `partnerId`, visibility (`public` / `pro_only` / `invite_only`), status |
| **Vouchers** | `rf_voucher` | Server `id`, `offerId`, `partnerId`, `issuedToUserId`, lifecycle (`status`, `canonical_status`, …), `claim_scope` (`partner` \| `listing`), optional Rielt listing snapshot fields |
| **RF service** | `apps/rf-service/src/store.ts`, `apps/rf-service/src/routes/rf.ts` | Authoritative create/read for vouchers and claims |
| **OpenAPI** | `docs/openapi/rf.yaml` | `RfVoucher` DTO; listing “context” via `listingContext`; **no PRO / attribution fields** on voucher today |
| **SDK** | `packages/sdk/src/rf.ts` | `claimRfOffer(offerId)` — `POST` + `Idempotency-Key` header only; no body |
| **Public catalog UI** | `apps/go2asia-pwa-shell/components/rf/Offers/RfOffersCatalog.tsx`, `app/(public)/rf/vouchers/page.tsx` | List/filter offers; `?partner=` query filters by partner |
| **Claim CTA** | `apps/go2asia-pwa-shell/components/rf/Shared/ClaimRfOfferButton.tsx`, `lib/rfOfferClaim.ts` | Calls `claimRfOffer` after optional `fetchMyVouchers` short-circuit |
| **My vouchers** | `apps/go2asia-pwa-shell/components/rf/Vouchers/RfMyVouchersView.tsx` | Server vouchers + **local** “saved offers” (separate mechanism) |
| **Local save** | `lib/rfLocalUserState.ts`, `hooks/useRfLocalContour.ts`, `AddToMyVouchersButton` | Browser persistence; **not** a server voucher and **not** attribution-bearing for RF economy |

### 1.2 PRO links baseline

| Aspect | Finding |
|--------|---------|
| **Backend model** | `rf_pro_link` — `id`, `partnerId`, `proUserId`, `status` (`pending` \| `active` \| `ended`), `roleScope`, timestamps (`packages/db/src/schema/rf.ts`) |
| **API** | `createProLink`, `listProLinks`, owner lifecycle `accept` / `reject` / `end`; see `docs/openapi/rf.yaml`, `apps/rf-service/src/store.ts` |
| **Stage 5 docs** | `docs/architecture/rf/rf_pro_linked_partners_baseline_v1.md` — explicitly: **no claim attribution, no redeem attribution** |
| **Frontend** | `PROWorkspace.tsx`, `MerchantWorkspace.tsx`, `lib/rfProLinks.ts`, `lib/rfProWorkspace.ts` | Links and partner visibility; identity labels via Space profile where available |
| **URL / share params** | PRO and catalog links use paths like `/rf/vouchers?partner=<partnerId>` (filter only). **No `pro`, `proUserId`, or `proLinkId` query param** in current navigation code. |
| **Browser storage for PRO** | No dedicated PRO attribution key in localStorage/sessionStorage found in PWA RF contour (grep over `apps/go2asia-pwa-shell`). `sessionStorage` is used elsewhere (e.g. Clerk/referral setup), not for PRO referral. |

**Conclusion:** PRO **eligibility** (relationship partner ↔ PRO) exists in DB; PRO **traffic attribution** (end-user journey) is **not implemented** in URLs, storage, or voucher rows.

### 1.3 Voucher claim — backend reality

- **Not browser-local:** partner-scoped vouchers are created in PostgreSQL via `claimVoucher` in `apps/rf-service/src/store.ts` (`INSERT INTO rf_voucher`).
- **Route:** `POST /v1/rf/offers/{offerId}/claim` with required `Idempotency-Key` (`apps/rf-service/src/routes/rf.ts`).
- **Idempotency table:** `rf_claim_idempotency` ties `(actorUserId, idempotencyKey)` → `voucherId`.
- **Listing-scoped claims:** separate path `claimVoucherForListing` / `POST .../rielt/listings/.../claim` — same gap: no PRO attribution fields.

**Voucher row today (relevant to attribution):** identifies **offer**, **partner**, **issuedToUserId**, **claim scope**, Rielt listing context when applicable — **no `proUserId`, `proLinkId`, or metadata JSON for attribution**.

### 1.4 Documentation map (RF / PRO / economy)

- **RF architecture / PRO baseline:** `docs/architecture/rf/*.md` (including `rf_pro_linked_partners_baseline_v1.md`, `rf_pro_stage_5_closure_note_v1.md`, `rf_merchant_catalog_item_model_audit_v1.md`).
- **Claim / catalog UX audits:** e.g. `docs/audits/rf_offer_detail_claim_usability_gap_v1.md`.
- **Voucher *economy* (future):** `docs/economy/vouchers/rf_voucher_economy_v1.md` and siblings under `docs/economy/` — **Stage 5.0 must not implement or depend on** Points/G2A/NFT flows; attribution is a factual layer that may **later** feed economy decisions.

---

## 2. Existing RF Claim Flow (as implemented)

1. User opens public RF surfaces (`/rf`, `/rf/vouchers`, partner detail `/rf/[id]`, Rielt listing voucher pages, etc.).
2. **Signed-in** user triggers claim (e.g. `ClaimRfOfferButton` → `claimRfOffer(offerId)`).
3. Gateway authenticates; RF service `claimVoucher`:
   - Validates offer active + `visibility === public` (partner-scoped path).
   - Ensures partner active.
   - Returns existing claimable voucher if already present (idempotency / uniqueness rules).
   - Otherwise inserts `rf_voucher` (partner scope: `claim_scope = 'partner'`, listing fields null).
4. Client can list vouchers via `GET /v1/rf/me/vouchers` (SDK `fetchMyVouchers`).
5. **Parallel track:** “Save locally” adds a row in browser storage — **does not** call `claim`.

---

## 3. Existing PRO Links Baseline (Stage 5.1–5.x)

- **Purpose:** Canonical **relationship** between a PRO (Clerk `proUserId`) and an RF partner, with lifecycle `pending` → `active` → `ended`.
- **Not purpose:** Tracking anonymous or authenticated **end-user** journeys from a PRO-shared URL to a voucher.
- **Implication for Stage 5.0:** Any attribution that references `proUserId` should **prefer validating** against `rf_pro_link` for `(partnerId, proUserId)` when `status === 'active'`, so baseline stays honest and avoids arbitrary “spoofed PRO” labels on vouchers.

---

## 4. Attribution Baseline Goals

- Record **which PRO** (if any) should receive factual credit for a **server-issued** voucher, in relation to **which offer/partner**.
- Record **how** the attribution was captured (URL, session, internal nav, unknown).
- Record **where** in the product the claim was initiated (catalog, PRO-shared link, Rielt listing path, etc.).
- Enable **audit/debug** and future **read-only PRO views** without implementing payouts or Points.

---

## 5. Non-Goals

- PRO payouts, commission engines, token mint/burn, NFT gates, revenue share.
- Changing voucher **uniqueness** or **economic** meaning of a voucher.
- Full marketing attribution stack (multi-touch, ad networks, fingerprinting).
- Mandatory “offer detail” page (still optional; catalog claim remains valid).
- Connect wallet / Points / G2A integration.

---

## 6. Proposed Attribution Data Model

Design principle: **attach durable facts to the server voucher** once claim succeeds; keep **pre-claim** state in browser (or transport metadata) only as **provisional** input.

### 6.1 Fields — what exists vs proposed

| Concept | Today | Baseline proposal |
|---------|--------|-------------------|
| Offer / partner / user | On `rf_voucher` | Unchanged |
| PRO user | — | **`pro_attributed_user_id`** (nullable `varchar`, Clerk user id) — only set when rules pass |
| PRO link | — | **`pro_link_id`** (nullable `varchar`) — optional, when claim explicitly includes a link id **and** it matches partner + pro |
| Source (traffic) | — | **`attribution_source`** — enum / string enum in DB |
| Claim surface | — | **`claim_source`** — enum / string enum in DB |
| Capture time | — | **`attribution_captured_at`** (timestamptz, nullable) — best-effort; can be client-supplied with server clamping |
| Confirm time | — | **`attribution_confirmed_at`** (timestamptz, nullable) — set server-side **at successful claim insert** (equals claim confirmation) |
| Status | — | **`attribution_status`** — e.g. `none`, `pending`, `confirmed`, `rejected` (see §8) |
| Raw/trace metadata | — | **`attribution_metadata` JSONB** — small, bounded object (e.g. `path`, `queryKeys`, `referrerHost`, SDK version); **no large PII blobs** |

Optional alternative to many columns: **single JSONB** `attribution` with version key `v1` and nested fields; trade-off: weaker DB constraints and indexing unless you add generated columns later.

### 6.2 Semantics: `attribution_source` (traffic / “how we learned PRO context”)

Baseline enum (string enum in OpenAPI + DB check or Postgres enum) — aligned with Stage 5.0 prompt, with one clarification on `saved_offer`:

| Value | Meaning |
|--------|---------|
| `pro_link` | Пользователь попал в RF с **явным PRO-сигналом** (например query `?pro=…` / будущая короткая ссылка / иной согласованный параметр), который относится к каналу PRO, а не к “просто фильтру партнёра”. |
| `direct_offer` | Переход на оффер/каталог **без** PRO-сигнала (прямая закладка, органический вход). |
| `saved_offer` | **Только клиентский смысл:** пользователь ранее сохранил оффер локально (`AddToMyVouchersButton`). На сервер при claim уходит как подсказка; **durable запись** на `rf_voucher` должна оставаться одной из: `direct_offer` / `internal_navigation` / `pro_link` — в зависимости от того, есть ли PRO в session/URL на момент claim. |
| `internal_navigation` | Навигация внутри приложения без нового PRO в URL; PRO возможен только если **ещё действует** сессия атрибуции. |
| `unknown` | Сигнал отсутствует или не удалось надёжно классифицировать. |

**Почему не отдельный `pro_session`:** поведение «восстановили PRO из sessionStorage после первого `pro_link`» попадает в **`pro_link`** на уровне **подтверждённой** записи, если клиент передаёт согласованный `proUserId` и сервер валидирует `rf_pro_link`; поле `attribution_metadata` может содержать `restoredFromSession: true` для аудита.

### 6.3 Semantics: `claim_source` (product surface)

| Value | Meaning |
|--------|---------|
| `public_offer_detail` | Экран детали оффера в public RF (когда появится отдельный маршрут / CTA на нём). |
| `merchant_catalog` | Кабинет мерчанта / управление офферами — **не** public claim сегодня; зарезервировано, если позже появится сценарий. |
| `rielt_offer_detail` | Контекст Rielt listing + оффер (страница/флоу, ведущий к `claimRfListingOffer`). |
| `pro_shared_link` | Переход из PRO workspace или иной “поделился ссылкой” с заранее оговорёнными параметрами атрибуции. |
| `public_rf_catalog` | Текущий основной путь Stage 1.7: каталог `/rf/vouchers` и карточки с `ClaimRfOfferButton` (можно **алиасить** к `public_offer_card` в типах или оставить отдельным значением для точной аналитики). |
| `unknown` | Клиент не передал / старый клиент. |

**Согласование с кодом сейчас:** фактически доминирует сценарий “карточка в каталоге” — в плане имплементации стоит маппить его на `public_rf_catalog` или ввести `public_offer_card` как синоним в OpenAPI description.

### 6.4 Semantics: `attribution_status`

| Value | Meaning |
|--------|---------|
| `none` | No PRO signal; voucher is not PRO-attributed |
| `pending` | (Optional, mostly pre-claim client state) |
| `confirmed` | Server accepted attribution and wrote PRO fields |
| `rejected` | Server intentionally dropped PRO signal (invalid pro, link mismatch, ended link) — voucher still created |

**Policy choice (recommended):** Claim **always succeeds** if today’s claim succeeds; **invalid PRO** → `attribution_status = 'rejected'` or `none`, cleared PRO fields, optional `attribution_metadata.reason`. Avoid blocking user voucher on marketing attribution disputes.

---

## 7. Attribution Capture Flow

### 7.1 When to capture

| Event | Action |
|--------|--------|
| Landing with PRO signal in URL | Normalize params → write **sessionStorage** (namespaced key, TTL e.g. 24–72h), set `attribution_captured_at` |
| In-app navigation | Read/update session if user opens another RF URL **with a different** PRO — policy: **last non-empty PRO wins** for baseline (document clearly) |
| Before claim | Client attaches optional **Attribution** payload to claim request (see §8) |
| Claim success | Server validates → writes durable fields on `rf_voucher` |

### 7.2 Where to store pre-claim

**Recommended:** `sessionStorage` keyed per origin + RF namespace, with TTL stored inside JSON (or clear on expiry read). **Why not localStorage:** reduces cross-tab long-term stalking of PRO ids; **Why not only URL:** claim often happens after navigation (`/rf/vouchers` drops params unless preserved).

**Optional:** keep PRO id in URL for PRO-shared links only (`?pro=` in addition to `partner=`); session picks it up on first paint.

### 7.3 Backend session layer

There is **no** separate RF “session store” today — only gateway auth for **user identity**. Attribution should not invent server session for anonymous users except via URL→sessionStorage on client until sign-in.

---

## 8. Voucher Claim Attribution Flow

### 8.1 Transport (recommended minimum change)

Extend `POST /v1/rf/offers/{offerId}/claim` (and listing claim) with **optional JSON body**:

```json
{
  "attribution": {
    "proUserId": "user_...",
    "proLinkId": "rf_pro_link_...",
    "attributionSource": "pro_link",
    "claimSource": "public_rf_catalog",
    "capturedAt": "2026-05-07T12:00:00.000Z",
    "metadata": { "path": "/rf/vouchers", "partnerQuery": "optional" }
  }
}
```

Backward compatibility: **empty body** → current behavior, `attribution_*` null / `none`.

### 8.2 Server validation (baseline integrity)

For a given `offer.partner_id`:

1. If body absent → `attribution_status = none`.
2. If `proUserId` present:
   - Require `rf_pro_link` row with `partner_id = offer.partner_id`, `pro_user_id = proUserId`, `status = 'active'`.
   - If `proLinkId` present, must match same row id (or reject that field).
3. If validation fails → log + **still issue voucher** with `attribution_status = rejected` or `none` per product policy.

### 8.3 Idempotency

Existing idempotency key is per user + key. **Option A:** include normalized attribution in idempotency input only for replay **consistency** (same key must not attach different PRO) — recommend **reject** second semantics with `409` *only if* strict; **Option B (simpler):** idempotency returns original voucher as today; **first successful claim wins** attribution (document as limitation).

---

## 9. Edge Cases

| Scenario | Baseline handling |
|----------|-------------------|
| Open offer without PRO | `attribution_source = direct_offer` or `unknown`; `attribution_status = none` |
| PRO A then PRO B before claim | **Last-write-wins** in session unless product chooses “first-touch” later |
| User already has voucher | Existing short-circuit returns voucher; **no mutation** of attribution on replay unless separate migration adds “upgrade” (out of baseline) |
| Not signed in | Client shows sign-in; after login, sessionStorage may still hold PRO if same browser session |
| Claim after login | Send stored attribution in claim body |
| Invalid / spoofed `proUserId` | Server rejects attribution fields; voucher unchanged |
| Offer inactive | Existing errors; no voucher — no attribution row |
| Listing-scoped vs partner-scoped | Same attribution rules; partner id derived from validated listing-offer context |
| PRO link `pending` or `ended` | Treat as invalid for attribution |
| Local “saved offer” then claim | No PRO unless session/URL had PRO signal |

---

## 10. UI Baseline

### End user

- **Offer card / catalog:** Optional subtle line: “Вы перешли по ссылке PRO” **only if** session/URL confirms PRO signal — avoid false claims.
- **My vouchers / voucher row:** Soft line: “Оформлено со ссылкой партнёра PRO” when `attribution_status === confirmed` and display name resolved via Space profile (same pattern as merchant PRO list).

### PRO

- **No payout dashboard.**
- **PRO workspace / share UX:** Short hint near partner/offers links: “При переходах по вашим ссылкам мы можем учитывать атрибуцию при получении ваучера” (copy review separately).
- **Future:** read-only “Attributed vouchers” table — **Stage 5.0C** (see below), not baseline MVP.

---

## 11. Backend / DB Impact

**Facts:**

- Real `rf_voucher` table and RF Worker claim paths exist.
- No attribution columns today.

**Minimal migration (Stage 5.0B):**

- Add nullable columns or JSONB as in §6.1.
- Add index only if PRO analytics query is needed later, e.g. `(pro_attributed_user_id, claimed_at)` — can defer to 5.0C.

**OpenAPI + SDK:**

- Extend claim request schema; regenerate types/SDK.

**Logging:**

- Structured log line on claim: `offerId`, `voucherId`, `issuedToUserId`, `attribution_status`, optional `proUserId` (hashed if policy requires), **no** full metadata dump in prod if noisy.

---

## 12. Implementation Options

### Option A — Stage 5.0A only (frontend capture, no DB)

- Add URL param + sessionStorage + types + claim body sent **but backend ignores** (or feature flag).
- **Pros:** fastest experiment. **Cons:** no durable truth; useless for PRO reporting.

### Option B — Stage 5.0A + 5.0B together (recommended core)

- Client capture + **server persistence** on `rf_voucher` + validation against `rf_pro_link`.
- **Pros:** minimal end-to-end truth; aligns with “voucher got attribution record”.
- **Cons:** requires migration + API + SDK + tests.

### Option C — Separate `rf_voucher_attribution` table

- Normalized side table (1:1 voucher).
- **Pros:** cleaner if many experiments. **Cons:** more joins; overkill for baseline unless multiple attribution records per voucher are anticipated.

**Recommendation:** **Option B** with nullable columns or single versioned JSONB on `rf_voucher` for v1.

---

## 13. Recommended Stage 5.0 Plan (staged delivery)

| Sub-stage | Content |
|-----------|---------|
| **5.0A** | Types/constants; URL + `sessionStorage` helper; optional client sends body (behind flag); docs |
| **5.0B** | DB + `claimVoucher` / listing claim + OpenAPI/SDK; server validation vs `rf_pro_link`; unit/integration tests in `rf-service` |
| **5.0C** | Read-only PRO API `GET /v1/rf/pro/attributed-vouchers` (cursor, filters) or reuse owner patterns — **no totals that imply payouts** |
| **5.0D (future)** | Economy bridge — **explicit separate program** referencing `docs/economy/` |

---

## 14. Future Stages

- PRO analytics (funnels, conversion — product/analytics stack).
- Merchant-visible attribution (privacy / consent).
- Stricter idempotency attribution rules.
- First-touch vs last-touch policy switch.
- Integration with Connect projection (`docs/architecture/connect/`) **only** as read-only facts — still no automatic payouts from RF Worker.

---

## 15. Risks and Open Questions

| Risk | Mitigation |
|------|------------|
| Spoofed `proUserId` from client | Server validates `rf_pro_link` active for offer’s partner |
| Privacy / UX | Soft copy; no public display of raw user ids |
| GDPR / retention | `attribution_metadata` size limits; retention policy TBD |
| Idempotency + attribution | Document “first claim wins” unless extended |
| Multi-tab race | sessionStorage per tab — acceptable for baseline or switch to shared storage with care |
| **Open:** Should invalid PRO block claim? | **Recommend no** — baseline is non-blocking |

---

## Stage 5.0B Implementation Note

Implemented after this design pass as RF-only voucher attribution v1.

- Persistence uses nullable typed columns on `rf_voucher`, plus bounded `attribution_metadata` JSONB for non-PII validation context.
- Public PRO transport is `rf_pro_link.share_code`; public URLs carry `shareCode`, not `proUserId`, Clerk IDs or DB ids.
- `claimRfOffer` and listing-scoped claim accept an optional attribution body; old clients continue to claim without a body.
- Frontend transient state is `sessionStorage` with 24h TTL in `go2asia.rf.proAttribution.v1`.
- Server validation resolves `shareCode` through active `rf_pro_link`, validates partner relationship, and persists `confirmed`, `rejected` or `none` without blocking voucher creation.
- Idempotent replay and repeated claim return the existing voucher attribution; later share links cannot overwrite the first durable fact.

No economy, payout, Points/G2A/NFT, Connect ownership or analytics-platform logic was introduced.

---

## Implementation Plan (concrete steps — execute only after sign-off)

1. **Types / constants:** TypeScript unions for `AttributionSource`, `ClaimSource`, `AttributionStatus`; copy keys in `lib/rfProAttribution.ts` (name TBD); namespace constants for `sessionStorage` key + TTL.
2. **Attribution capture helper:** Parse URL (`pro`, optional `proLinkId`), read/write session, `captureAttributionFromNavigation()`, `consumeAttributionForClaim()`.
3. **Claim flow integration:** `ClaimRfOfferButton` (and any Rielt listing claim UI) passes optional body; SDK adds typed payload.
4. **Voucher metadata enrichment:** Migration + `store.ts` insert/update paths; map to OpenAPI `RfVoucher` extension fields.
5. **UI copy hints:** PRO workspace hint; conditional end-user hint; my-vouchers soft line when `confirmed`.
6. **Tests / smoke:** `rf-service` tests for validation matrix; frontend unit tests for session/TTL/merge rules.
7. **Docs update:** This file + `rf_pro_linked_partners_baseline_v1.md` cross-link “attribution added in 5.0B”; keep `docs/economy/` references explicitly “future”.

---

## Appendix A — Files reviewed in this audit

**Schema / DB:** `packages/db/src/schema/rf.ts`, relevant migrations under `packages/db/migrations/` (voucher + pro link).
**RF service:** `apps/rf-service/src/store.ts` (`claimVoucher`, `claimVoucherForListing`), `apps/rf-service/src/routes/rf.ts`, tests under `apps/rf-service/test/`.
**API contract:** `docs/openapi/rf.yaml`.
**SDK:** `packages/sdk/src/rf.ts` (`claimRfOffer`, PRO link methods).
**PWA RF:** `components/rf/Offers/RfOffersCatalog.tsx`, `components/rf/Shared/ClaimRfOfferButton.tsx`, `components/rf/Vouchers/RfMyVouchersView.tsx`, `components/rf/PRO/PROWorkspace.tsx`, `lib/rfOfferClaim.ts`, `lib/rfLocalUserState.ts`, `hooks/useRfLocalContour.ts`.
**Docs:** `docs/architecture/rf/rf_pro_linked_partners_baseline_v1.md`, `docs/economy/vouchers/rf_voucher_economy_v1.md` (economy boundary only).

---

## Appendix B — Answers to “is RF voucher browser-local?”

- **Server vouchers from `claimRfOffer`:** persisted in **PostgreSQL** (`rf_voucher`).
- **Local “saved offers”:** browser-only; **not** vouchers in RF service sense.

---

*End of Stage 5.0 design document.*
