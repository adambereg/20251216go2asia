# RF Attribution Canon Refinement v1

**Status:** architecture canon / refinement only.
**Related baseline:** `docs/architecture/rf/rf_pro_attribution_baseline_stage_5_0.md`.
**Ecosystem map:** `docs/architecture/platform/go2asia_attribution_architecture_map_v1.md` maps this canon across RF, Rielt, Quest, Space, Atlas/Guides, AI, Connect, creators and campaigns.
**Scope:** canonical attribution principles for Go2Asia, starting from RF voucher attribution.
**Non-scope:** implementation, migrations, OpenAPI changes, SDK changes, UI changes, payouts, commissions, Points, G2A, NFT, revenue share, or payout ledgers.

This document refines Stage 5.0 from a narrow RF PRO attribution design into the first canonical attribution layer for the Go2Asia ecosystem. RF remains the first runtime anchor because vouchers already have a server-side claim lifecycle, but the principles below are intended to survive future adoption by Rielt, Quest, Space, Atlas/Guides, AI recommendations, creator referrals, partner ecosystems and PRO funnels.

---

## 1. Why Attribution Is Becoming an Ecosystem Layer

Attribution starts in RF as a practical question:

- which PRO brought a user to an RF offer;
- which PRO context was present when a user claimed a server voucher;
- what traffic/source context should be attached to that voucher.

However, this is not only an RF concern. Go2Asia will eventually need to reason about how users discover listings, quests, places, guides, events, creators, partner campaigns and AI recommendations. If every module invents its own referral model, the ecosystem will accumulate inconsistent IDs, conflicting time windows, mutable credit rules and expensive reconciliation work before any economy can safely consume the data.

The canon therefore treats attribution as a **factual architecture layer**:

- it records how a user reached an action;
- it preserves enough context for audit and future analytics;
- it does not itself decide rewards, payouts or financial value;
- it gives future economy services stable facts to read, not mutable marketing guesses.

RF Stage 5.0 remains voucher-centric, but the naming and rules must not trap Go2Asia in an RF-only model.

---

## 2. Canonical Attribution Principles

1. **Attribution is factual before it is economic.** It records provenance; it does not calculate payouts.
2. **Durable attribution is written only by server-side domain events.** Browser state and URLs are provisional signals.
3. **First successful durable action wins.** For RF v1, that action is a successful server voucher claim.
4. **Public referral identity is separate from internal auth identity.** Public URLs must not expose auth-provider IDs.
5. **Attribution must be versioned from v1.** Strategy, source semantics and metadata shape will evolve.
6. **Pre-claim sessions expire.** A short TTL prevents stale or unfair attribution.
7. **Invalid attribution must not block the user journey.** A voucher claim can succeed while attribution is rejected or absent.
8. **Metadata must be bounded and privacy-aware.** Attribution is not device fingerprinting.
9. **RF-specific implementation must not prematurely generalize the whole ecosystem.** Extract only the concepts that are proven useful.

---

## 3. Immutable Attribution Rule

Canonical rule:

> Attribution becomes immutable after the first successful durable action that creates the attributed object.

For RF voucher attribution v1:

- the first successful server-side `claim` creates or returns the canonical `rf_voucher`;
- attribution is fixed at that moment;
- subsequent claim replays, idempotency retries, route visits, new PRO links or new navigation signals must not mutate attribution;
- another PRO cannot later "capture" or "upgrade" an existing voucher;
- attribution mutation outside explicit admin/debug tooling is prohibited.

This is a product and architecture principle, not an implementation limitation.

Why this matters:

- **Future economy simplicity:** any later reward logic can read one stable fact instead of resolving mutable disputes.
- **Fraud resistance:** users or PROs cannot repeatedly reopen links to rewrite credit.
- **Dispute reduction:** "who was credited" is determined at the moment of the user's durable action.
- **Auditability:** event logs, voucher rows and future analytics do not drift over time.
- **Idempotency alignment:** retrying a request returns the same business result, including the same attribution.

If admin/debug tooling is later allowed to correct attribution, it must create an explicit audit trail with actor, reason, previous value and new value. It must not be part of normal product flows.

---

## 4. Public vs Internal Attribution Identity

Stage 5.0 used `proUserId` as an internal design placeholder because `rf_pro_link.pro_user_id` already exists. The canon separates public and internal identity.

### Public layer

Public URLs and share artifacts should use stable, human-friendly or opaque public identifiers:

- `proSlug` for human-readable PRO identity when it is suitable for public display;
- `shareCode` for an opaque, stable share identifier;
- `refCode` only if the scope is intentionally broader than PRO (creator/referral campaigns).

Public URLs must not depend on Clerk IDs, database primary keys that reveal internals, or provider-specific auth IDs.

### Internal layer

Internal attribution resolution may use:

- Clerk user id or future auth-provider user id;
- `rf_pro_link.id`;
- `rf_partner.id`;
- canonical relational identity in RF or a future identity service;
- validated mapping from `shareCode` / `proSlug` to internal user/link identity.

### Canonical naming recommendation

Use **`shareCode`** as the canonical public transport identifier for v1.

Rationale:

- it is not tied to PRO only, so it can later support creators, campaigns, guides and AI-assisted referrals;
- it avoids exposing auth-provider or relational IDs;
- it can be opaque and rotated if abuse occurs;
- it can map to `proSlug` for UX without making slugs the security boundary.

Recommended model:

- `shareCode` in public URL or QR/share artifacts;
- server resolves `shareCode` to an internal attribution target;
- internal RF v1 stores resolved `proAttributedUserId` / `proLinkId` or equivalent internal fields, not the public URL as the source of truth;
- optional metadata may keep the public `shareCode` only if privacy policy allows it.

`proSlug` remains useful for display and public profile routing, but it should not be the only attribution key if slugs can change.

---

## 5. Attribution Versioning Strategy

Versioning is required from v1 because attribution strategies will evolve faster than the RF voucher table.

Future strategies may include:

- RF PRO last-touch attribution;
- first-touch attribution;
- AI-assistant recommendation attribution;
- creator attribution;
- campaign attribution;
- hybrid or weighted attribution;
- multi-step journey attribution.

Without versioning, future migrations become expensive because old rows would need inferred semantics: was `source = pro_link` first-touch or last-touch, public ID or internal ID, direct source or restored session? Versioning avoids retroactive guessing.

Canonical recommendation:

- store `attributionVersion` as a durable field or inside a versioned JSON object;
- v1 semantics are immutable once written;
- future versions can coexist with v1 instead of rewriting v1 rows;
- queries and analytics must always filter or interpret by version.

Two acceptable storage shapes:

1. **Columns + version field:** clearer constraints and indexes, better for RF voucher reporting.
2. **Versioned JSON object:** better for ecosystem experimentation, weaker constraints unless paired with validation.

For RF Stage 5.0B, either can work. If columns are chosen, still include `attribution_version = 1`. If JSON is chosen, use a shape like:

```json
{
  "version": 1,
  "strategy": "rf_pro_last_touch_before_claim",
  "source": "pro_link",
  "status": "confirmed"
}
```

---

## 6. Attribution Session TTL Canon

Canonical baseline TTL:

> Pre-claim attribution session TTL is **24 hours**.

This TTL applies only to transient attribution state before claim:

- URL-derived signal;
- `sessionStorage` / short-lived client state;
- pending claim payload.

It does **not** apply to durable voucher attribution. Once a voucher has confirmed attribution, it remains immutable with the voucher.

### 24h vs 72h

**24h advantages:**

- fairer for early RF because it credits recent intent rather than stale browsing;
- reduces accidental attribution after unrelated later navigation;
- lowers fraud and dispute surface;
- aligns with a lightweight browser session model;
- keeps future economy input conservative.

**24h trade-offs:**

- users who research today and claim two or three days later may lose PRO attribution;
- PRO campaigns with longer decision cycles may feel undercounted;
- requires clear product copy if PRO expects longer funnels.

**72h advantages:**

- more forgiving for travel and service discovery flows;
- better for high-consideration offers or Rielt-like journeys;
- reduces loss after delayed login/claim.

**72h risks:**

- more stale attribution;
- higher chance of crediting a PRO when the user has since changed context;
- harder to defend in future economic disputes.

Recommendation:

- v1 canon: **24h default**;
- allow future program-specific override only after a separate policy decision;
- if overrides exist, store the TTL policy/version in metadata or resolved attribution record.

---

## 7. Attribution Source Semantics

The canon separates three ideas that are easy to mix:

- **traffic signal:** how attribution was first detected;
- **navigation context:** what the user did before claim;
- **durable attribution fact:** what the server accepted and wrote.

Durable canonical `attributionSource` values for RF v1:

- `pro_link` — valid PRO share signal resolved and accepted by server rules;
- `direct_offer` — no PRO signal, direct or organic offer/catalog entry;
- `internal_navigation` — user arrived through app navigation without a fresh external share signal;
- `unknown` — source cannot be trusted or classified.

Transient / UX-only values:

- `saved_offer` — local save behavior; useful as UX context, not a durable attribution source by itself.

Important refinement:

- `saved_offer` can influence copy or metadata, but it should not become the canonical durable source unless a valid attribution session still exists at claim time.
- `internal_navigation` is not proof of PRO attribution. It only describes app movement. PRO credit still requires a valid unresolved session/share signal within TTL and server validation.
- `direct_offer` is a durable negative fact: no accepted PRO attribution for this voucher.

---

## 8. Durable vs Transient Attribution Signals

Transient signals:

- URL params such as future `shareCode`;
- `sessionStorage` attribution state;
- referrer host;
- current route;
- query keys;
- claim button surface;
- client-side source hints.

Durable facts:

- the server-issued attributed object (`rf_voucher` for RF v1);
- resolved internal attribution identity;
- version;
- strategy;
- status;
- confirmed timestamp;
- small metadata snapshot.

Rule:

> Transient signals can propose attribution. Only the server can confirm durable attribution.

This protects the system from stale browser state, forged query params, broken deep links and future auth-provider changes.

---

## 9. First-touch vs Last-touch Policy

RF v1 policy:

- before successful claim: **last valid non-empty touch within TTL wins**;
- after successful claim: attribution is immutable.

This means a user can open PRO A's link, then later open PRO B's link within the 24h TTL, and the claim can be attributed to PRO B if server validation passes. Once the voucher exists, later touches do not matter.

Why this is acceptable for early-stage RF:

- the journey is short and voucher-centric;
- there is no payout logic yet;
- last-touch is easier to explain and implement;
- it avoids storing multi-step user journeys before the privacy model is mature.

Why full marketing attribution is premature:

- no campaign manager exists;
- no paid acquisition stack exists;
- no economy consumes attribution yet;
- multi-touch creates privacy and dispute complexity before RF needs it.

Future coexistence:

- v1 strategy: `rf_pro_last_touch_before_claim`;
- future v2 can introduce first-touch, hybrid, campaign or AI-assisted strategies;
- versioned records prevent v2 from reinterpreting v1 rows.

---

## 10. Attribution Metadata Boundaries

Allowed metadata examples:

- route/path class, e.g. `/rf/vouchers` or `rf_catalog`;
- `referrerHost` without full URL if possible;
- query key names, not necessarily raw values;
- capture timestamp and confirmed timestamp;
- source hints such as `restoredFromSession: true`;
- claim surface;
- app or SDK version;
- TTL policy used;
- validation reason for rejected attribution.

Disallowed metadata:

- large blobs;
- emails, phone numbers, passports or payment data;
- full device fingerprints;
- IP address history;
- raw user-agent dumps unless separately justified;
- wallet addresses unless a future economy/privacy policy explicitly allows them;
- full URLs containing sensitive query values;
- invasive analytics identifiers unrelated to the claim.

Metadata exists for audit and debugging, not for surveillance. If a field cannot be explained in a dispute review or privacy review, it should not be stored.

---

## 11. Privacy and Auditability

Privacy rules:

- public share identifiers must not expose auth-provider IDs;
- raw internal user IDs should not be shown in public UI;
- metadata must be bounded and non-PII by default;
- retention policy must be decided before attribution becomes cross-ecosystem analytics.

Auditability rules:

- durable attribution must include version and strategy;
- rejected attribution should be explainable by reason, e.g. invalid share code, ended link, partner mismatch, expired TTL;
- normal product flows must not mutate existing attribution;
- admin/debug correction, if ever allowed, must produce an audit event.

The goal is not to maximize tracking. The goal is to make future product and economy decisions defensible.

---

## 12. RF-specific vs Ecosystem-generic Concepts

Ecosystem-generic:

- public share identity vs internal resolved identity;
- transient signal vs durable fact;
- immutable first successful durable action;
- versioned attribution strategy;
- bounded metadata and privacy rules;
- TTL for pre-action attribution sessions.

RF-specific:

- `rf_voucher` as the first durable attributed object;
- `rf_offer` and `rf_partner` as claim context;
- `rf_pro_link` as eligibility validator for PRO attribution;
- `claim_source` values tied to RF catalog, partner pages and Rielt listing offer flows.

Do not prematurely generalize:

- RF voucher lifecycle into all modules;
- PRO-only attribution into all referrals;
- `rf_pro_link` into a universal creator/campaign graph;
- voucher claim as the only kind of attributed action.

Future ecosystem attribution should reuse the canon, not copy RF tables blindly.

---

## 13. Future Ecosystem Expansion

Possible future attributed objects:

- Rielt inquiry, listing contact, viewing request or listing-linked voucher;
- Quest completion, proof approval or sponsor-linked reward action;
- Space post referral, creator follow or community join;
- Atlas/Guides place visit intent, guide CTA or saved itinerary;
- AI assistant recommendation click, booking handoff or partner CTA;
- partner ecosystem campaign conversion.

Recommended future shape:

- preserve a generic attribution vocabulary: version, strategy, public share identity, internal resolved identity, source, status, metadata;
- keep domain-specific persistence in the owning module until enough shared runtime exists;
- use read models/projections for cross-ecosystem analytics instead of direct cross-service writes;
- let economy services read confirmed attribution facts later, never own the initial fact capture.

---

## 14. Non-Goals

This canon does not:

- define implementation details for modules outside RF Stage 5.0B;
- create payout rules;
- calculate rewards;
- define Points, G2A or NFT behavior;
- create a creator economy;
- define a full multi-touch marketing attribution platform;
- replace `docs/economy/` as the SSOT for economic logic.

---

## 15. Open Questions

1. Should v1 public links use only opaque `shareCode`, or allow `proSlug` plus `shareCode` for better UX?
2. Should a future version promote `shareCode` from `rf_pro_link` to a dedicated RF share table, once more share surfaces exist?
3. Should rejected attribution metadata have a formal retention window separate from confirmed attribution?
4. Should `capturedAt` from client be accepted with server clamping in future versions, or should only server `confirmedAt` be durable?
5. Should listing-scoped RF claims use the exact same attribution strategy name or a Rielt-specific strategy variant?
6. When cross-ecosystem attribution arrives, should it be a shared service, a projection layer, or domain-owned records with shared schema conventions?
7. Should any program ever override the 24h TTL to 72h, and who owns that policy decision?

---

## Canonical Decisions Formalized

- Attribution is immutable after first successful durable action.
- RF v1 durable action is server voucher claim.
- Public attribution identity must not expose Clerk/auth-provider IDs.
- `shareCode` is the recommended public transport identifier; `proSlug` is display/routing, not the security boundary.
- Attribution must be versioned from v1.
- Baseline pre-claim TTL is 24h.
- RF v1 uses last-touch before claim, then immutable durable attribution.
- `saved_offer` is transient UX context, not a durable source by itself.
- Metadata must be small, bounded and non-PII.
- Economy may later consume attribution facts, but does not define or mutate them in Stage 5.0.

## Stage 5.0C Visibility Alignment

RF Stage 5.0C adds a narrow read-only projection over the already durable voucher fact:

- visibility is RF-owned and scoped to the authenticated PRO;
- the default view is confirmed attribution only;
- the projection does not mutate, correct, recalculate or reassign attribution;
- the PRO-safe DTO omits raw user identity, share code, internal PRO/link ids and attribution metadata;
- UI copy stays factual: attributed voucher, claim recorded, attribution status/source and confirmation timestamps.

This preserves the Stage 5.0 canon: visibility may make immutable facts easier to inspect, but it does not become a new attribution owner or a financial interpretation layer.

## Stage 5.0B Runtime Alignment

RF Stage 5.0B implements the first bounded durable attribution layer using this canon:

- durable fact owner: RF voucher layer;
- public transport: `shareCode`;
- internal resolution: active `rf_pro_link`;
- strategy: `rf_pro_last_touch_before_claim`;
- transient TTL: 24h session-scoped capture;
- invalid attribution: non-blocking `rejected`/`none`;
- immutability: first successful voucher claim wins.

This does not create an ecosystem attribution platform.
