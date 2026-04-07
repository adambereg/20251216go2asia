# Rielt Market seed dataset v1 — note

## 1. Purpose

This note fixes the agreed conclusions for preparing **Rielt Market seed dataset v1**.
It is intended as a shared working reference for:
- product decisions,
- further discussion,
- Cursor execution,
- future seed/import preparation.

The goal of seed dataset v1 is **not** to simulate the whole housing market.
The goal is to provide a **small but realistic curated dataset** that lets the Go2Asia team and Cursor:
- render meaningful Rielt pages,
- validate search/detail UX,
- validate truthful runtime states,
- validate trust presentation,
- validate forward-compatible RF/PRO/voucher surfaces,
- prepare Rielt for the next bounded execution slices.

---

## 2. Two-layer source model for seed design

Rielt seed dataset v1 must be designed using **two explicit layers of truth**.

### 2.1. Layer A — mandatory Step 8 SSOT

This is the **engineering baseline that must not be violated**.
It comes from the Step 8 SSOT package:
- `rielt_domain_model_v1.md`
- `rielt_openapi_outline_v1.md`
- `rielt_backend_architecture_v1.md`
- `rielt_dependency_map_v1.md`
- `rielt_service_v1_completion.md`

Step 8 fixes Rielt as:
- **listing + one-shot inquiry domain**,
- source of truth for listings and inquiries,
- behind api-gateway,
- without booking,
- without payments,
- without chat,
- without CRM,
- without RF/partner ownership,
- without voucher ownership,
- without PRO flags inside the core Rielt service,
- without geo ownership,
- without media ownership.

This layer is the **mandatory baseline** for current implementation.

### 2.2. Layer B — voucher-first concept as forward-compatible extension

This comes from the conceptual Rielt discussion and product positioning.
It describes the **future-facing product semantics** of Rielt:
- Rielt as curated discovery layer,
- supply through RF business partners,
- PRO as curator / trust layer,
- voucher-first commercial meaning,
- first meaningful user action shifting toward voucher claim/purchase/redeem,
- trust > scale,
- accommodation discovery inside a wider ecosystem economy.

This layer is **not allowed to break Step 8 SSOT**, but it **should shape seed semantics and naming** so that future evolution does not require rethinking the whole dataset.

### 2.3. Working rule

**If Step 8 SSOT and the voucher-first concept diverge, Step 8 SSOT wins for current runtime structure.**

The voucher-first concept may still influence:
- UI-facing labels,
- scenario coverage,
- optional extension tables,
- forward-compatible IDs and linkage,
- curated data semantics.

---

## 3. What we take from Step 8 SSOT as mandatory

The following rules are **mandatory** for seed dataset v1 because they come from current SSOT.

### 3.1. Rielt is currently listing-first and inquiry-capable

Seed v1 must support the actual Step 8 service shape:
- public listing list,
- listing detail,
- nearby,
- owner-side listing management,
- one-shot inquiry create,
- requester-side inquiry list.

Therefore the seed dataset must first of all provide truthful support for:
- listing cards,
- listing detail pages,
- public filtering,
- nearby-capable data,
- inquiry-capable public listings.

### 3.2. Core Step 8 entities are mandatory

Seed data must map cleanly to the Step 8 domain model:
- `rielt_listing`
- `rielt_listing_media`
- `rielt_listing_actor_link`
- `rielt_listing_inquiry` (if/when inquiry fixtures are needed)

This means the primary seed structure must remain compatible with:
- listing identity,
- listing media refs,
- listing actor linkage,
- inquiry linkage.

### 3.3. Listing shape must respect Step 8 invariants

Mandatory Step 8-compatible fields and semantics include:
- `id`
- `slug`
- `title`
- `description`
- `listing_type`
- `status`
- `price_amount`
- `price_currency`
- `price_period`
- `country_id`
- optional `city_id`
- optional `area_text`
- optional `lat/lng` pair
- optional bedrooms/bathrooms/area_sqm
- optional amenities

Seed must not rely on fields that do not exist in the Step 8 service as if they were core persisted truth.

### 3.4. Geo must stay reference-only

Step 8 SSOT is explicit:
- Rielt does not own geo,
- Atlas/content-service is SSOT,
- no separate geo ownership in Rielt.

So seed v1 must:
- use `country_id` / `city_id` / optional district-like presentation values carefully,
- avoid inventing a parallel geo domain inside Rielt,
- treat geo references as upstream-linked, not Rielt-owned truth.

### 3.5. Media must stay reference-only

Step 8 SSOT is explicit:
- Rielt owns media relations, not media binaries,
- Rielt stores `media_id`, not files or canonical URLs.

So seed v1 must:
- seed media references, not media storage ownership,
- keep listing/media relations compatible with Step 8,
- not assume Rielt becomes a media host.

### 3.6. Inquiry remains part of current baseline

Even though the product concept later shifts toward voucher-first contact, the current Step 8 SSOT still includes inquiry as part of the implemented domain.

Therefore seed v1 must not ignore inquiry reality.
It should support:
- inquiry-capable published listings,
- honest CTA/testing for current inquiry path,
- compatibility with one-shot inquiry semantics.

### 3.7. Explicit exclusions remain mandatory

Seed v1 must not smuggle in new domain ownership that Step 8 explicitly excludes:
- booking engine,
- payment flows,
- chat/messenger,
- CRM pipeline,
- RF-owned core partner logic inside `rielt-service`,
- voucher ownership inside `rielt-service`,
- PRO domain flags as if they are Step 8 core entity fields,
- reviews/favorites/social ownership as core Rielt truth.

---

## 4. What we take from voucher-first concept as forward-compatible extension

The following ideas are **allowed and recommended as forward-compatible seed semantics**, as long as they do not violate Step 8 SSOT.

### 4.1. Curated supply semantics

Even if Step 8 service itself does not own RF partner logic, the seed dataset may still be curated so that listings are **conceptually sourced from RF-style partners**.

This means:
- no random scraped classifieds,
- no open-market noise,
- no anonymous fake supply as the dominant seed pattern,
- supply should feel curated and trust-oriented.

### 4.2. PRO as trust/presentation layer

Even if Step 8 core service does not own PRO flags, seed v1 may include **separate extension data** for:
- curator presentation,
- trust label,
- public curator bio,
- mediation need,
- trust-oriented UI surfaces.

Important rule:
- PRO should be modeled as **forward-compatible presentation/extension data**, not as proof that Step 8 Rielt already owns PRO logic internally.

### 4.3. Voucher-first commercial meaning

Even if Step 8 runtime still supports inquiry, seed v1 may already prepare:
- voucher-related CTA labels,
- listing-to-offer linkage,
- VIP bonus semantics,
- urgency modes,
- offer scenarios.

Important rule:
- voucher data should be modeled as **extension layer / companion seed**, not as proof that voucher-service is already implemented inside `rielt-service`.

### 4.4. Trust > scale

Seed v1 should optimize for:
- curated realism,
- scenario coverage,
- trust presentation,
- semantic coherence,
not for raw volume.

### 4.5. Forward-compatible UI meaning

UI-facing seed fields may anticipate future Rielt presentation, for example:
- curator labels,
- trust notes,
- voucher-first CTA copy,
- VIP-oriented offer copy,
- language mediation indicators.

But these should remain clearly separable from Step 8 persisted core.

---

## 5. Canonical positioning of Rielt Market for seed work

For seed work we use the following balanced formula:

> **Rielt v1 seed = Step 8 listing/inquiry baseline + forward-compatible curated RF/PRO/voucher semantics**

This means:
- current backend truth remains Step 8,
- product meaning may lean voucher-first,
- seed data must help both current runtime and future direction,
- no fake claim that current `rielt-service` already owns future RF/voucher/PRO domains.

---

## 6. Seed design principle

### 6.1. Listing-first by structure

Because Step 8 SSOT is listing-centric, seed dataset v1 must remain **listing-first structurally**.

The seed must be able to support:
- search,
- detail,
- nearby,
- inquiry,
- listing lifecycle states,
- media relations,
- actor linkage.

### 6.2. Voucher-first by semantics where safe

Because the product concept is voucher-first, the seed may still prepare the system semantically for:
- voucher-oriented CTAs,
- curated partner offers,
- VIP-oriented language,
- urgency/use-mode coverage,
- trust-chain presentation.

### 6.3. No synthetic overclaim

Seed v1 must not blur the line between:
- current Step 8 persisted truth,
- future-facing product extension.

If an RF/PRO/voucher field exists only to help future UI exploration, it must be treated as:
- extension data,
- companion seed,
- auxiliary presentation layer,
not as false proof that Step 8 core domain already includes it.

---

## 7. Recommended seed package structure

To reflect both layers correctly, seed dataset v1 should be split into **two groups**.

### 7.1. Group A — Step 8 mandatory core seed

These files represent current mandatory runtime-compatible data.

#### A1. `rielt_listings.csv`
Main Step 8 listing entities.

Suggested columns:
- `listing_id`
- `listing_slug`
- `title`
- `description`
- `listing_type`
- `status`
- `price_amount`
- `price_currency`
- `price_period`
- `country_id`
- `city_id`
- `area_text`
- `lat`
- `lng`
- `bedrooms`
- `bathrooms`
- `area_sqm`
- `amenities_json`
- `created_by_user_id`
- `published_at`
- `archived_at`
- `deleted_at`
- `is_active`
- `sort_weight`

#### A2. `rielt_listing_media.csv`
Step 8 relation-only media seed.

Suggested columns:
- `listing_media_id`
- `listing_id`
- `media_id`
- `sort_order`
- `is_cover`
- `alt_text`
- `caption_short`
- `deleted_at`
- `is_active`

#### A3. `rielt_listing_actor_links.csv`
Step 8 actor linkage.

Suggested columns:
- `actor_link_id`
- `listing_id`
- `actor_user_id`
- `actor_role`
- `created_at`
- `revoked_at`
- `deleted_at`
- `is_active`

#### A4. `rielt_inquiry_seed_cases.csv` *(optional for fixture/testing phase)*
Not necessarily imported into live seed immediately, but useful for testing inquiry baseline.

Suggested columns:
- `inquiry_id`
- `listing_id`
- `requester_user_id`
- `message`
- `contact_name`
- `contact_phone`
- `contact_telegram`
- `status`
- `idempotency_key`
- `created_at`
- `closed_at`

### 7.2. Group B — forward-compatible extension seed

These files represent **auxiliary seed data** for product semantics and future UX, without redefining Step 8 ownership.

#### B1. `rielt_partners.csv`
RF-style partner presentation layer.

Suggested columns:
- `partner_id`
- `rf_partner_id`
- `partner_slug`
- `partner_public_name`
- `partner_legal_or_manager_name`
- `partner_type`
- `country_id`
- `city_id`
- `district_id`
- `partner_language_ru`
- `partner_language_en`
- `partner_language_local`
- `needs_pro_mediation`
- `verification_status`
- `onboarding_status`
- `public_phone`
- `public_whatsapp`
- `public_telegram`
- `public_email`
- `partner_story_short`
- `trust_note`
- `is_active`

#### B2. `rielt_pro_curators.csv`
PRO presentation/curation layer.

Suggested columns:
- `pro_id`
- `user_id`
- `pro_slug`
- `public_name`
- `home_city_id`
- `languages`
- `specialization`
- `public_bio_short`
- `years_in_region`
- `trust_badge`
- `is_active`

#### B3. `rielt_listing_extensions.csv`
Auxiliary UI/presentation fields that are useful but not part of Step 8 core truth.

Suggested columns:
- `listing_id`
- `subtitle`
- `district_id`
- `atlas_place_id`
- `atlas_container_place_id`
- `address_public_text`
- `geo_precision`
- `show_public_coordinates`
- `max_guests`
- `floor_text`
- `view_type`
- `summary_short`
- `description_short`
- `night_price_display`
- `month_price_display`
- `minimum_nights`
- `minimum_months`
- `instant_use_possible`
- `same_day_check_in`
- `trust_score_label`
- `is_pro_verified`
- `is_rf_verified`
- `hero_media_id`
- `cover_alt`
- `primary_cta_label`
- `secondary_cta_label`
- `extension_note`

#### B4. `rielt_listing_vouchers.csv`
Voucher/offer companion data for forward-compatible UX.

Suggested columns:
- `voucher_offer_id`
- `voucher_slug`
- `listing_id`
- `partner_id`
- `rf_partner_id`
- `pro_id`
- `offer_title`
- `offer_subtitle`
- `offer_type`
- `offer_badge`
- `offer_description`
- `discount_type`
- `discount_value`
- `points_cost`
- `claim_mode`
- `urgency_mode`
- `voucher_kind`
- `qr_required`
- `fallback_code_required`
- `validity_days`
- `redeem_window_text`
- `is_vip_only`
- `is_premium`
- `is_active`
- `priority_weight`
- `cta_label`
- `post_claim_note`

#### B5. `rielt_seed_scenarios.csv`
Coverage matrix for QA and Cursor.

Suggested columns:
- `scenario_id`
- `listing_id`
- `scenario_name`
- `scenario_group`
- `expected_surface`
- `expected_cta`
- `expected_visual_state`
- `expected_runtime_note`

---

## 8. Required scenario coverage

Seed dataset v1 must cover the following scenario groups.

### 8.1. Step 8 mandatory runtime scenarios

Need explicit support for:
- published public listing,
- draft listing,
- archived listing,
- listing visible in public list,
- listing visible in detail only by id/slug when published,
- nearby-capable listing with valid lat/lng,
- listing without public coordinates,
- sparse-media listing,
- rich-media listing,
- inquiry-capable published listing,
- listing with incomplete optional fields,
- owner-linked listing,
- agent-linked listing.

### 8.2. Forward-compatible curated scenarios

Need explicit support for:
- RF-style curated source,
- PRO-backed trust case,
- partner needing PRO mediation,
- voucher-first CTA case,
- free claim offer,
- points-based offer,
- premium/VIP offer,
- `scheduled` urgency mode,
- `near_now` urgency mode,
- `on_site` redeem case,
- listing with no active voucher,
- language-barrier case.

### 8.3. Short-term vs long-term

Need both:
- short-term stays,
- long-term stays,
- several hybrid or borderline presentation cases if useful.

Reason:
- current Rielt UI already distinguishes these modes visually.

---

## 9. Recommended minimum seed volume

Recommended **minimum** seed package for v1:

### Step 8 core seed
- **24 listings**
- **24–120 media relation rows** depending on how many real assets are available
- **24–30 actor link rows**
- **optional inquiry fixtures** for testing

### Forward-compatible extension seed
- **10 partners**
- **5 PRO curators**
- **24 listing extension rows**
- **24–36 voucher offer rows**
- **24 scenario rows**

Suggested listing distribution:
- 10 short-term
- 8 long-term
- 4 hybrid or presentation-bridge cases
- 2 archived/hidden negative-state cases

This is enough to test:
- non-empty home,
- search results,
- detail pages,
- trust labels,
- voucher-oriented presentation,
- map honesty cases,
- sparse and incomplete data cases.

---

## 10. Field-level priorities

If implementation bandwidth is limited, the following priorities should be used.

### 10.1. Highest priority — Step 8 core truth
- listing identity and slug
- listing type and status
- price fields
- geo reference fields
- lat/lng where needed for nearby
- description
- media relations
- actor links

### 10.2. Second priority — truthful UI support
- summary-like presentation fields
- sparse vs rich media coverage
- public vs hidden vs archived states
- exact vs hidden coordinates cases
- long-term vs short-term variety

### 10.3. Third priority — forward-compatible trust layer
- partner public identity
- curator public identity
- trust notes / badges
- mediation indicators

### 10.4. Fourth priority — forward-compatible voucher layer
- offer title and CTA
- claim mode
- urgency mode
- points cost
- QR/redeem flags
- VIP-only flags

---

## 11. What seed v1 should NOT try to solve

Seed dataset v1 should **not** attempt to model the full future ecosystem.

Do **not** overload seed v1 with:
- booking engine logic,
- full in-app payment for base accommodation,
- chat or messenger flows,
- complex availability orchestration,
- realtime inventory sync,
- deep CRM pipelines,
- full review/reputation subsystem,
- complete production-scale market coverage.

Also do not:
- rewrite Step 8 Rielt as if it already were voucher-service,
- rewrite Step 8 Rielt as if it already owned RF,
- treat PRO as if it already were a native Step 8 persistence concept inside Rielt core tables.

Reason:
- Step 8 SSOT must remain truthful,
- voucher-first logic belongs primarily to commerce layer,
- current seed objective is truthful UI/runtime enablement with forward-compatible semantics.

---

## 12. Practical execution principle for Cursor

Cursor should treat this dataset as:
- **curated seed pack**,
- **truth-enabling sample content**,
- **scenario-driven runtime fixture**,
- not as production ingestion or market import.

Execution rule:
1. seed the Step 8 core first,
2. add extension-layer seed second,
3. keep the ownership boundary explicit,
4. harden public search/detail/inquiry against real seed data,
5. only then expand presentation around trust/voucher semantics.

---

## 13. Final canonical summary

The seed dataset for Rielt Market v1 must reflect the following truth:

- **Step 8 SSOT is the mandatory engineering baseline.**
- Rielt currently remains a **listing + inquiry** service.
- Seed data must first support current runtime truthfully.
- At the same time, the product direction is **curated, trust-oriented, and voucher-first by meaning**.
- Therefore seed v1 should be split conceptually into:
  - **mandatory Step 8 core seed**, and
  - **forward-compatible extension seed**.
- The dataset must help Cursor and the team build against reality **without losing the future product direction**.

Working formula:

> **Rielt seed v1 = truthful Step 8 runtime baseline + forward-compatible curated RF/PRO/voucher semantics**

That is the canonical interpretation for the current stage.
