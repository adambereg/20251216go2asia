# Stage 10.8 — Rielt.Market Economy Embodiment

Документ: `stage_10_8_rielt_market_economy_embodiment_v1.md`  
Статус: docs-first audit/design, implementation-correction-ready backlog  
Дата: 2026-05-21  
Scope: Rielt listing, discovery, inquiry, verification, RF handoff, PRO visibility, mock/future-only surfaces, booking/payment/investment proof-class boundaries  
Mode: read-only synthesis; no implementation; no frontend/backend/API/OpenAPI/SDK/schema changes; no tests; no rollout; no booking/payment/investment/tokenization activation

## 1. Executive Summary

Stage 10.8 фиксирует Rielt.Market as:

```text
Rielt = listing_discovery_inquiry_layer
Rielt != booking_platform
Rielt != payment_platform
Rielt != investment_platform
Rielt != settlement_layer
Rielt != property_tokenization_layer
```

Rielt already has runtime-shaped listing and inquiry foundations:

- public listing list/detail APIs;
- owner listing create/update/archive APIs;
- authenticated listing inquiry API;
- public search/filter/map/list UI;
- listing detail with price, location, owner/contact and RF handoff;
- RF listing-scoped voucher route through RF;
- seed/runtime adapter that merges backend listings with presentation overlays.

But Rielt also carries dangerous vocabulary and UI clusters:

- `verifiedBooking`;
- `instantBooking` / "Мгновенное бронирование";
- inquiry success text "Запрос отправлен";
- price, deposit, prepayment and service-fee copy;
- RF voucher count on listing cards;
- "verified" / "Проверено PRO";
- owner/PRO/RF badges;
- mock listings and mock reviews;
- docs language about investors, rewards, Tokenomics, Points/NFT/G2A and booking endpoints.

Stage 10.8 does not implement anything. It creates a practical correction backlog so Stage 10.11 can define the MVP cutline without accidentally legitimizing booking/payment/investment semantics.

## 2. Why Stage 10.8 Exists Now

Stage 10.7 stabilized RF as voucher utility lifecycle:

```text
RF_voucher = utility_lifecycle
RF_claim != payout
RF_redeem != settlement
```

That makes the Rielt boundary newly important. Rielt can show RF context and route users to RF, but Rielt must not become:

- booking confirmation surface;
- payment receipt surface;
- voucher payment layer;
- settlement layer;
- investment marketplace;
- ownership proof layer.

If Stage 10.11 starts before Rielt is stabilized, the MVP cutline may incorrectly treat price cards, verified labels, inquiry success, RF vouchers and mock booking reviews as mature booking/payment semantics.

Stage 10.8 is therefore product correction planning, not endless alignment. It translates the Stage 10.10 vocabulary firewall into a concrete module-level backlog.

## 3. Rielt Economy Role Model

### Allowed meanings

| Concept | Intended meaning | Authority owner | Not equal to |
|---|---|---|---|
| `listing` | Published housing/object display for discovery and comparison | Rielt Service | booking, ownership, investment asset |
| `search/discovery` | Filtered listing exploration by location, type, price, amenities | Rielt UI/Rielt Service | marketplace settlement |
| `price` | Displayed listing price for informational comparison | Rielt listing data | payment request, investment value |
| `inquiry` | Contact/request message about listing details | Rielt Service | booking, reservation, payment confirmation |
| `owner/contact` | Listing-side contact context | Rielt listing actor/presentation | ownership transfer or proof |
| `verified/PRO` | Curator/trust/presentation signal about listing quality or profile | Rielt presentation/PRO context | payment proof, booking proof |
| `RF context` | Link/handoff to RF-owned voucher utility | RF Service owns lifecycle | payment/settlement |
| `favorites/views` | Discovery convenience or product metrics | Rielt/UI projection | economic fact |
| `Connect projection` | Future possible read-only summary | Connect projection only | Rielt authority |

### Forbidden meanings

```text
listing != booking_confirmation
listing != payment_receipt
listing != ownership
listing != NFT_asset
inquiry != booking
verified != payment_proof
verifiedBooking != booking_confirmation
RF_voucher_on_listing != payment
listing_value != investment_value
PRO_visibility != commission
Rielt_market != marketplace_settlement
```

## 4. Current Rielt Surface Inventory

| Surface | Location | Runtime class | Proof class | Authority owner | Collapse risk | MVP readiness | Verdict |
|---|---|---|---|---|---|---|---|
| Rielt home/search entry | `app/(public)/rielt/*`, `SearchBar.tsx` | production-shaped UI | discovery_projection | Rielt UI/API | Medium | MVP-ready with guardrails | Search entry, not booking engine |
| Listing cards | `components/rielt/ListingCard.tsx` | runtime + seed overlay | listing_projection | Rielt Service + presentation overlay | High | internal-beta | Price/RF/PRO badges can overread |
| Listing detail | `ListingDetailClient.tsx` | runtime + components | listing_detail_projection | Rielt Service | Medium/High | MVP-ready with framing | Detail, not booking confirmation |
| CTAPanel price/CTA | `ListingDetail/CTAPanel.tsx` | runtime-backed action for inquiry + RF link | inquiry_action + RF handoff | Rielt/RF | High | internal-beta | Good disclaimers; inquiry success still risky |
| Inquiry form | `CTAPanel.tsx`, `/v1/rielt/listings/{id}/inquiries` | production-shaped runtime | inquiry_fact | Rielt Service | High | MVP-ready with copy guard | Request, not booking/reservation |
| Inquiry success | `Запрос отправлен` | UI status | inquiry_projection | Rielt Service | High | dangerous-until-aligned | Could look like reservation confirmation |
| Share listing | `CTAPanel.tsx` | presentation/share | share_artifact | none | High | internal-beta | Share != proof |
| Save listing | `CTAPanel.tsx` local state | local UI | local_projection | browser/UI | Medium | internal-beta | Favorite, not entitlement |
| RF listing panel | `CTAPanel.tsx`, RF route | RF handoff | RF_context_projection | RF owns voucher lifecycle | High | internal-beta | RF voucher != payment |
| RF listing-scoped claim | `app/(public)/rf/rielt/...`, RF APIs | RF runtime | voucher_lifecycle_fact | RF Service | High | internal-beta | RF-owned; not Rielt payment |
| PRO verification block | `ListingDetail/Verification.tsx` | presentation/seed overlay | verification_projection | Rielt/PRO context | High | internal-beta | Verified != payment proof |
| Reviews block | `ListingDetail/Reviews.tsx` | mock-only | local_mock_UI_only | none | Critical | blocked for evidence | `verifiedBooking` is dangerous |
| Owner/contact block | `ListingDetail/Owner.tsx` | presentation/seed/runtime-mapped | contact_projection | Rielt presentation | Medium | MVP-ready with guardrails | Contact, not ownership transfer |
| House rules price terms | `HouseRules.tsx`, `types.ts` | presentation | terms_projection | Rielt listing data | High | internal-beta | Deposit/prepayment are not payment collection |
| Availability calendar | `AvailabilityCalendar.tsx`, `types.ts` | UI/legacy | availability_projection | Rielt UI/seed | High | internal-beta | Availability != reservation |
| Search filters | `SearchBar.tsx`, `FiltersPanel.tsx`, `utils/filters.ts` | UI/filter projection | search_filter | Rielt UI | Medium/High | internal-beta | "ready/instant/pro" terms need guard |
| Map/list pages | `SearchResults/*`, `ListingsMap.tsx` | runtime/seed projection | location_projection | Rielt UI/API | Medium | MVP-ready | Map location, not address proof |
| Mock listings | `mockListings.ts` | mock/seed | local_mock_UI_only | none | Critical | blocked as evidence | Not runtime inventory |
| Runtime DTO adapter | `rieltDtoToListing.ts` | adapter | runtime_projection + seed_overlay | Rielt Service primary | Medium/High | internal-beta | Overlay can add RF/PRO truth-like data |
| Docs overview/roadmap | `docs/modules/rielt/*` | docs-only | docs_claim_only | none | Critical if overread | future-only/guarded | Investor/tokenomics/reward language not runtime |
| OpenAPI Rielt | `docs/openapi/rielt.yaml` | runtime contract | API contract | Rielt Service | Low/Medium | MVP-ready | Listings/inquiries only; no booking/payment |

## 5. Rielt Runtime Reality Map

### Runtime-backed

Rielt runtime provides:

- `GET /v1/rielt/listings`;
- `GET /v1/rielt/listings/nearby`;
- `GET /v1/rielt/listings/{idOrSlug}`;
- `POST /v1/rielt/listings`;
- `PATCH /v1/rielt/listings/{idOrSlug}`;
- `DELETE /v1/rielt/listings/{idOrSlug}`;
- `GET /v1/rielt/my/listings`;
- `POST /v1/rielt/listings/{idOrSlug}/inquiries`;
- `GET /v1/rielt/my/inquiries`.

These are listing and inquiry APIs. They do not implement booking, payment, settlement, ownership transfer, tokenization or Points reward issuance.

### Inquiry flow

```text
user writes message/contact info
-> Rielt inquiry endpoint
-> rielt_listing_inquiry row
-> inquiry status/read model
!= booking
!= reservation
!= payment confirmation
```

The current UI says `Запрос отправлен`. Safe reading: the inquiry was submitted. It does not reserve the listing.

### RF listing handoff

```text
Rielt listing
-> RF listing voucher route
-> RF listing-scoped claim
-> RF-owned voucher lifecycle
```

Rielt passes context. RF owns voucher claim/redeem lifecycle.

### What is absent

Rielt runtime does not contain:

- booking confirmation API;
- payment API;
- payment receipt;
- settlement report;
- property ownership registry;
- NFT/token/G2A asset;
- investment instrument;
- active Points producer;
- Connect authority projection.

### Runtime vs seed overlay

`rieltDtoToListing.ts` maps runtime DTOs to frontend `Listing`. It then may merge seed presentation overlay fields:

- RF flags;
- RF voucher presentation;
- PRO verification;
- owner badges;
- presentation/trust labels.

This is useful for product display, but it creates proof-class risk:

```text
runtime_listing_truth + seed_presentation_overlay
!= full backend authority for RF/PRO/booking
```

## 6. Rielt Vocabulary Classification

| Term | Surface | Current meaning | Intended meaning | Collapse risk | Classification | Recommended disposition |
|---|---|---|---|---|---|---|
| `listing` / `объект` | Cards/detail/API | Housing/object listing | Discovery item | booking/ownership | `allowed` | Keep as listing/discovery |
| `inquiry` / `запрос` | CTAPanel/API | Contact request | Message/request | booking/reservation | `allowed_with_guardrails` | Always say not booking/payment |
| `Запрос отправлен` | Inquiry success | Inquiry created | Request submitted | reservation confirmation | `dangerous_until_aligned` | Later add "не бронирование" |
| `verified` / `Проверено` | PRO block/reviews/filters | Curator/trust check | Trust/quality signal | payment proof | `allowed_with_guardrails` | Specify what was checked |
| `verifiedBooking` / `Проверенная бронь` | Reviews mock/types | Mock review label | Legacy/mock | booking confirmation | `forbidden_for_stage_10` | Quarantine/rename later |
| `booking` / `бронирование` | Types/docs/API contracts legacy | Legacy/future product term | Not current runtime | booking engine | `dangerous_until_aligned` / `forbidden_for_stage_10` active UI | Active UI must deny booking |
| `payment` / `оплата` | CTAPanel guardrails/docs | Forbidden meaning | Not Rielt runtime | payment proof | `forbidden_for_stage_10` | Use only in "does not confirm payment" |
| `reservation` | Product risk | Not active | None | reservation | `forbidden_for_stage_10` | Avoid active UI |
| `price` / `цена` | Cards/detail/filters | Listing display price | Informational price | payment/investment value | `allowed_with_guardrails` | Pair with "conditions уточняются" |
| `deposit/prepayment` | HouseRules/types | Listing terms | Informational conditions | payment collection | `dangerous_until_aligned` | Add non-payment framing later |
| `RF voucher` | Cards/CTAPanel | RF utility context | RF-owned utility | payment/settlement | `allowed_with_guardrails` | Route to RF owner; not payment |
| `claim/activate` | RF handoff | RF lifecycle | RF-owned action | settlement/payment | `allowed_with_guardrails` | Keep RF boundary |
| `PRO` / `curator` | Cards/verification/filters | Curator/trust visibility | Quality/trust context | commission/payment proof | `allowed_with_guardrails` | PRO visibility, not commission |
| `owner` / `владелец` | Contact block/types | Listing actor/contact | Contact context | property ownership proof | `dangerous_until_aligned` | Prefer "контакт/размещающий" later |
| `value` / `выгода` | RF/listing docs risk | Utility/info | Not investment | investment value | `dangerous_until_aligned` | Avoid investment framing |
| `investment` / `инвестор` | docs overview/roadmap | Future/product vision | Future-only concept | investment promise | `forbidden_for_stage_10` active | Future-only docs guard |
| `reward/earn/commission` | docs overview | Product vision | Not current Rielt | payout/commission | `forbidden_for_stage_10` | Remove/guard in docs later |
| `token/NFT/G2A` | docs roadmap | Future tokenomics | Stage 11+ only | token/property/NFT activation | `future_only` | Keep out of active Rielt |
| `ownership` | product risk | Not active | None | property ownership | `forbidden_for_stage_10` | Avoid proof language |
| `marketplace` | Rielt brand/product | Discovery marketplace | Listing discovery | settlement marketplace | `allowed_with_guardrails` | Market as discovery, not settlement |
| `premium` | filters/future risk | Listing quality/access | Display/filter only | paid entitlement/investment | `allowed_with_guardrails` | Not value/ownership tier |

## 7. Rielt Proof-Class Mismatch Register

| Mismatch | Surfaces | Severity | Why dangerous | Required stance |
|---|---|---|---|---|
| listing-as-booking | Listing card/detail, price + dates | High | User treats listing page as reservation | `Rielt_listing != booking_confirmation` |
| inquiry-as-confirmation | Inquiry success "Запрос отправлен" | High | Contact request becomes reservation proof | `Rielt_inquiry != booking` |
| verified-as-payment-proof | PRO verification, filters, gallery badge | High | Curator check becomes payment/booking guarantee | `Rielt_verified != payment_proof` |
| verifiedBooking-as-booking-confirmation | Mock Reviews/types | Critical | Mock review implies real booking backend | `Rielt_verifiedBooking != booking_confirmation` |
| RF-voucher-as-payment | RF voucher on listing, voucher count | High | Voucher looks like payment/discount on booking | `Rielt_RF_voucher != payment` |
| RF-handoff-as-settlement | Rielt -> RF route | Medium/High | Claim from listing read as settlement | `Rielt_RF_context != settlement` |
| PRO-visibility-as-commission | PRO owner/curator labels | Medium/High | PRO signals look like commission eligibility | `Rielt_PRO_visibility != commission` |
| listing-as-investment | Docs overview/roadmap, sale listing type | Critical in docs | User reads listing as investment product | `Rielt_listing_value != investment_value` |
| listing-as-ownership | Owner labels, sale type, share cards | High | Listing page becomes proof of ownership | `Rielt_listing != ownership` |
| NFT/property overlap | Tokenomics docs | Critical | Property listing becomes NFT asset | `Rielt_listing != NFT_asset` |
| mock-as-runtime | mockListings, mock reviews, seed overlay | Critical | Mock inventory read as live | `Rielt_mock_listing != runtime_truth` |
| screenshot-as-proof | Listing share, CTAPanel, inquiry success | High | Screenshot used as booking/payment proof | `Rielt_screenshot != proof` |
| price-as-payment | Price, deposit, prepayment, service fee | High | Informational terms read as payable invoice | `price_projection != payment_receipt` |
| marketplace-as-settlement | Rielt.Market name/docs | Medium/High | Market means settlement platform | `Rielt_market != marketplace_settlement` |

## 8. Rielt + RF Boundary

Rielt can show RF context. Rielt cannot become RF authority.

Current good patterns:

- CTAPanel says RF vouchers open in RF Asia;
- CTAPanel says Rielt does not confirm booking;
- CTAPanel says receiving/activating vouchers happens in RF Asia;
- RF listing-scoped claim is implemented in RF, not Rielt;
- Rielt DTO has only `rfPartnerId` and `rfOfferId` soft references.

Current risks:

- `Ваучеров: N` can look like value-bearing entitlement;
- `Есть RF-предложение` can look like payment discount guarantee;
- `RF-предложение для объекта` can look like booking-linked payment;
- mock `rfVoucher` includes discount/usedCount and can look runtime-backed;
- listing-scoped claim can be mistaken as Rielt-owned booking utility.

Required boundary:

```text
Rielt_RF_context != booking_confirmation
RF_voucher_on_listing != payment
listing_RF_claim != settlement
Rielt_RF_soft_reference != RF_authority
```

## 9. Rielt + Connect Boundary

Current direct Connect/Rielt economy integration is limited. Rielt listing activity should not be promoted into Connect as economy authority.

Potential future projection types:

- saved listings;
- inquiries sent;
- listing views/favorites;
- RF listing-voucher interactions via RF;
- PRO/curator visibility summaries.

All must remain projections:

```text
Connect_Rielt_projection != authority
listing_projection != ownership
favorites != economic_fact
views != economic_fact
inquiry_summary != booking_history
```

There is no current Connect-owned Rielt booking, payment, statement, receipt or ownership layer.

## 10. Rielt + Points Boundary

Rielt is not an active Points producer in the current runtime.

Current reality:

- Rielt Service creates/listings and inquiries;
- RF Service can create voucher facts for listing-scoped RF flows;
- Points Service can be touched by RF paid voucher spend, not by Rielt listing itself;
- Rielt docs mention Connect/referral/Points/NFT, but this is product vision/non-runtime SSOT.

Required boundary:

```text
Rielt_listing != reward_producer
Rielt_inquiry != economic_fact
Rielt_visibility != payout
listing_views != economic_fact
listing_favorites != economic_fact
Rielt_docs_reward_claim != runtime_producer
```

## 11. Mock / Future-only Register

| Surface | Risk | Current class | Required disposition |
|---|---|---|---|
| `mockListings.ts` | Fake listing inventory, RF vouchers, PRO verification, instant flags | mock/seed | quarantine; not runtime truth |
| Mock `rfVoucher` | Discount/usage looks RF-owned | mock-only | replace with RF owner projection later |
| Mock `verifiedBooking` reviews | Booking proof illusion | mock-only | blocked for MVP; rename/remove later |
| Mock `proVerification` | Payment/quality proof overread | seed overlay | keep with clear trust framing |
| `Availability.instantBooking` | Booking engine illusion | type vocabulary | dangerous until aligned; no active booking |
| `HouseRules.prepayment/deposit` | Payment collection illusion | terms projection | guarded; no payment receipt |
| `Owner.isPRO/isRFPartner` | Commission/authority overread | presentation | keep with contact/trust framing |
| `ListingPresentationMeta` | Seed overlay can look backend-owned | presentation/meta | keep inert; source label important |
| Docs `investors` wording | Investment platform illusion | docs-only | future-only/guard; not MVP |
| Docs `Tokenomics Points/NFT/G2A` | Token/property/NFT activation | docs-only future | Stage 11+ only |
| Docs `/booking` API | Booking endpoint illusion | non-runtime docs | mark legacy/future-only; current OpenAPI uses inquiries |
| Search filter `readyToMove` | Availability/booking overread | UI filter | allowed with guardrails |
| `isInstant` / "Быстрый ответ" | Instant booking legacy risk | presentation | keep "response", not booking |

## 12. Abuse & Collapse Risk Register

| Risk | Surface/flow | Severity | Abuse path | Current mitigation | Required future mitigation |
|---|---|---|---|---|---|
| Listing screenshot as booking proof | Listing card/detail/share | High | User sends price/listing screenshot as reservation evidence | CTAPanel disclaimers | Add screenshot != proof support policy |
| Inquiry success as reservation | CTAPanel "Запрос отправлен" | High | User treats sent request as booking | Helper says request not booking/payment | Success text needs non-booking reminder |
| VerifiedBooking as payment proof | Reviews mock | Critical | Mock review badge implies real booking backend | Mock-only component | Quarantine/rename/remove in 10.12 |
| Verified/PRO as payment proof | Verification/card badges | High | Curator check interpreted as guarantee | "what checked" checklist | Add not booking/payment proof framing |
| RF voucher as payment | Listing RF panel/RF route | High | Voucher count/offer used as payment claim | RF boundary copy | Repeat RF-owned utility statement |
| Price/deposit as invoice | CTAPanel/HouseRules | High | Price + prepayment interpreted as payable receipt | No payment UI | Add informational conditions copy |
| PRO visibility as commission | Owner/PRO labels/docs | Medium/High | PRO expects earnings/commission | Mostly presentation only | Avoid reward/commission docs |
| Mock listing as live inventory | mockListings/seed overlay | Critical | Mock data cited as available object | runtime adapter source field | Visible mock/source framing if exposed |
| Stale availability | Calendar/filter/ready labels | Medium/High | User treats availability as guaranteed | Search note says dates/conditions уточняются | Add not reservation copy |
| Property tokenization illusion | docs tokenomics/roadmap | Critical | Listing read as asset/NFT | docs non-runtime notice | Stage 11-only guard |
| Marketplace settlement illusion | Rielt.Market branding | Medium | Market interpreted as transaction venue | no payment runtime | Explicit discovery marketplace framing |
| RF/Rielt dispute | Rielt listing RF claim | Medium/High | User blames Rielt for RF voucher outcome | CTAPanel says RF owns activation | Support handoff policy |

## 13. Rielt MVP Cutline

### MVP-ready

MVP-ready as listing/discovery/inquiry layer:

- public listing search/list/detail;
- price display as informational listing data;
- map/list discovery with privacy-aware location precision;
- inquiry submission as contact request;
- owner/contact context;
- RF handoff if boundary copy remains;
- PRO/curator verification as trust signal with guardrails.

### Internal-beta-only

- inquiry list/status surfaces;
- favorites/saves;
- views/saves metrics;
- availability/calendar;
- "ready to move" and instant/fast-response filters;
- RF listing-scoped voucher claim;
- seed presentation overlay for RF/PRO labels;
- owner listing management;
- sale listing type;
- deposit/prepayment display.

### Future-only

- booking engine;
- payment collection;
- reservation confirmation;
- owner/agent settlement;
- investment listings;
- rental income/yield analytics;
- tokenomics, Points/NFT/G2A integrations;
- property tokenization;
- marketplace settlement;
- ownership proof/export.

### Blocked

- Rielt as payment platform;
- Rielt as booking confirmation authority;
- Rielt as investment platform;
- Rielt listing as NFT/ownership asset;
- verifiedBooking as runtime proof;
- mock listings as live inventory;
- screenshots/share cards as proof;
- Rielt activity as Points producer.

### Dangerous until aligned

- `verifiedBooking`;
- "Мгновенное бронирование" in types/filters;
- inquiry success without non-booking reminder;
- `Ваучеров: N` on listing cards;
- `RF-предложение для объекта`;
- price + deposit/prepayment without informational framing;
- docs "инвесторы", "награды", "Tokenomics";
- "owner" labels as ownership proof.

## 14. Implementation-Correction Backlog

This backlog is for Stage 10.12. Stage 10.8 does not implement it.

### Copy fixes

- Replace active or visible "verifiedBooking" language with non-booking review/trust wording.
- Ensure inquiry success says request submitted, not booking/reservation.
- Add "Rielt does not confirm booking/payment" near inquiry success, not only pre-submit helper.
- Change any "instant booking" language to "fast response" unless booking backend exists.
- Reframe "owner" as "contact/listing owner" or "listing contact" where ownership proof risk is high.
- Avoid investment, yield, income, commission, token, NFT and reward language in active Rielt copy.
- Clarify RF voucher wording: RF utility context, not payment for listing.

### UI framing fixes

- Add non-booking/payment helper around price, deposit and prepayment blocks.
- Add "informational listing conditions" marker for HouseRules and LongTermConditions.
- Add projection/source marker for seed overlay fields if displayed as RF/PRO trust labels.
- Add "share/screenshot is not proof" policy for listing share and inquiry success.
- Add "dates and conditions are уточняются" on detail CTA, not only search.
- Add RF handoff boundary inside listing voucher route and Rielt return flow.

### Mock/future cleanup

- Quarantine `mockListings.ts` as seed/demo, not runtime inventory.
- Quarantine mock Reviews with `verifiedBooking`.
- Mark docs `booking` endpoints as legacy/future-only; current OpenAPI uses inquiries.
- Mark investment/tokenomics docs as future-only / Stage 11+ externalization.
- Replace mock RF vouchers on listings with RF owner projections in future implementation.
- Keep property tokenization/NFT/G2A out of active Rielt.

### Support/proof fixes

- Define support rule: listing screenshot is not booking/payment proof.
- Define support rule: inquiry id proves request creation only.
- Define support rule: verified labels prove only the stated checklist/trust review.
- Define RF handoff support path: RF voucher disputes use RF `voucherId`, not Rielt listing screenshot.
- Define no settlement wording for any Rielt/RF listing context.

## 15. Recommended Follow-up Slices

### Stage 10.9 — Atlas / Pulse / Blog / Guru Contribution Model

Pass forward:

- content/reward/tokenomics language must not imply Rielt reward producer;
- nearby places/events/content around listings must stay discovery/context;
- Guru/Atlas/Pulse surfaces must not convert listing visibility into economic facts.

### Stage 10.11 — MVP Economy Cutline

Pass forward:

- Rielt is MVP-relevant as listing/discovery/inquiry;
- Rielt booking/payment/investment is blocked;
- RF handoff is internal-beta unless copy/support boundaries are complete;
- mock reviews/listings cannot be MVP evidence.

### Stage 10.12 — Implementation Readiness Plan

Pass forward:

- the correction backlog in section 14;
- copy changes;
- mock quarantine;
- source/projection markers;
- support/proof rules;
- OpenAPI/docs wording updates.

### Stage 11 — Externalization / Gateway Baseline

Defer:

- property tokenization;
- NFT ownership;
- G2A/token;
- investment/ownership proof;
- marketplace settlement;
- external payment/booking gateway semantics.

## 16. Multi-Agent Review Synthesis

| Role | Stage 10.8 assessment |
|---|---|
| ИИ-архитектор | Rielt should be embodied as listing/discovery/inquiry, while RF remains the owner of voucher utility and no booking/payment authority exists. |
| ИИ-аналитик | Product risk is not missing bookings, but accidental legalization of booking/payment/investment language before MVP cutline. |
| ИИ-бэкенд-разработчик | Runtime APIs support listings and inquiries; OpenAPI does not implement booking/payment/settlement, while legacy docs still mention booking/product vision. |
| ИИ-фронтенд-разработчик | UI has good CTAPanel guardrails, but mock reviews, verifiedBooking, price/prepayment and RF counts need correction-ready framing. |
| ИИ-тестировщик | Critical QA risks are inquiry-as-booking, verifiedBooking-as-proof, RF voucher-as-payment and mock-as-runtime. |
| ИИ-специалист по безопасности | Highest abuse paths are listing screenshot as booking/payment proof and property/tokenization/investment inference from docs. |
| ИИ-технический писатель | Stage 10.8 must clearly distinguish runtime Rielt from legacy product vision docs and produce a practical Stage 10.12 backlog. |

## 17. Guardrails Reconfirmed

Inherited guardrails:

```text
token != money
NFT != receipt
badge != NFT_mint
Points != payout_system
Wallet != financial_wallet
RF != cashback_system
RF_redeem != payout
Dashboard != receipt
ActivityFeed != audit_trail
screenshot != proof
projection != authority
summary != proof
preview != grant
mock_data != runtime_truth
future_only != launch_ready
slice_16_status = blocked_not_triggered
```

Stage 10.8 guardrails:

```text
Rielt_listing != booking_confirmation
Rielt_listing != payment_receipt
Rielt_inquiry != booking
Rielt_verified != payment_proof
Rielt_verifiedBooking != booking_confirmation
Rielt_RF_context != settlement
Rielt_RF_voucher != payment
Rielt_listing_value != investment_value
Rielt_PRO_visibility != commission
Rielt_projection != authority
Rielt_mock_listing != runtime_truth
Rielt_screenshot != proof
Rielt_listing != ownership
Rielt_listing != NFT_asset
Rielt_market != marketplace_settlement
Rielt_listing != reward_producer
Rielt_visibility != payout
listing_views != economic_fact
```

## 18. Final Verdict

```text
stage_10_8_status: completed_as_docs_first_rielt_embodiment_audit
rielt_role_model_defined: true
rielt_booking_platform: false
rielt_payment_platform: false
rielt_investment_platform: false
rielt_settlement_layer: false
rielt_property_tokenization_layer: false
rielt_runtime_maturity: medium
rielt_ui_copy_maturity: medium_low
rielt_rf_boundary_risk: medium_high
rielt_verified_booking_risk: critical
rielt_property_tokenization_risk: critical_in_docs
rielt_mock_runtime_truth_risk: high
rielt_inquiry_booking_collapse_risk: high
rielt_price_payment_receipt_risk: high
rielt_points_reward_producer_present: false
rielt_mvp_ready_as_listing_discovery_layer: true
rielt_mvp_ready_as_booking_or_payment_platform: false
implementation_correction_backlog_created: true
recommended_next_slice: Stage_10_9_Atlas_Pulse_Blog_Guru_Contribution_Model
recommended_mvp_slice: Stage_10_11_MVP_Economy_Cutline
recommended_implementation_slice: Stage_10_12_Implementation_Readiness_Plan
recommended_externalization_slice: Stage_11_Externalization_Gateway_Baseline
slice_16_status: blocked_not_triggered
```

Honest Stage 10.8 conclusion:

Rielt is ready to be treated as a listing/discovery/inquiry layer, not as a booking/payment/investment platform. The runtime baseline supports listings and inquiries, and the strongest UI surface, `CTAPanel`, already states that Rielt does not confirm booking or payment. The remaining risk is legacy vocabulary and mock/product-vision drift: `verifiedBooking`, instant booking, price/prepayment display, RF voucher counts, PRO verification and Tokenomics/investment docs can make Rielt look more economically authoritative than it is. Stage 10.8 creates the correction backlog needed before Stage 10.11 and keeps all booking, payment, tokenization and ownership semantics out of Stage 10.
