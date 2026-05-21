# Stage 10.7 — RF / Voucher Economy Embodiment

Документ: `stage_10_7_rf_voucher_economy_embodiment_v1.md`  
Статус: docs-first audit/design, implementation-correction-ready backlog  
Дата: 2026-05-21  
Scope: RF catalog, offers, vouchers, claim/redeem/spend semantics, merchant/partner surfaces, PRO attribution, Connect projections, Rielt handoff, Points boundary, mock/future-only RF clusters  
Mode: read-only synthesis; no implementation; no frontend/backend/API/OpenAPI/SDK/schema changes; no tests; no rollout; no activation

## 1. Executive Summary

Stage 10.7 возвращает RF / Voucher module в roadmap перед Stage 10.11, чтобы применить Stage 10.10 vocabulary firewall к конкретному runtime-real product module.

Главный verdict:

```text
RF = voucher_utility_layer
RF != cashback_system
RF != payout_system
RF != settlement_layer
RF_PRO_attribution != commission
```

RF — один из более runtime-real utility modules Go2Asia. Уже есть:

- public partner and offer APIs;
- voucher claim lifecycle;
- listing-scoped Rielt voucher claim;
- authenticated My Vouchers;
- partner-side redeem endpoint;
- merchant voucher activity summary;
- PRO attributed vouchers read model;
- Connect RF projection;
- Rielt RF handoff.

Но RF всё ещё содержит UX/copy/proof-class risks:

- `claim` / "получить" can look like payout claim;
- `redeem` / "использован" can look like settlement;
- Points spend/compensation can look like payment/cashback;
- merchant summaries can look like financial statements;
- PRO attribution can look like commission;
- Connect RF panels can look like payout reports;
- Rielt RF handoff can look like booking/payment confirmation;
- screenshots can look like proof;
- mock RF rows and future markers can be read as runtime truth.

Stage 10.7 does not fix UI. It creates an implementation-correction-ready backlog for Stage 10.12 and gives Stage 10.11 a concrete RF MVP cutline.

## 2. Why Stage 10.7 Exists Now

Stage 10.10 established a cross-ecosystem vocabulary firewall:

```text
projection != authority
summary != proof
preview != grant
mock_data != runtime_truth
future_only != launch_ready
```

Going directly from 10.10 to Stage 10.11 would risk an abstract MVP cutline that ignores concrete module debt. RF needs a module-specific embodiment pass because RF is not merely a vocabulary problem:

- RF has real runtime surfaces;
- RF is user-visible and business-visible;
- RF crosses Points, Connect and Rielt boundaries;
- RF contains partner/merchant/PRO dashboards that can be misread as financial dashboards;
- RF voucher lifecycle is close to money-like words without being money.

Stage 10.7 therefore is not alignment for alignment's sake. It prepares actual correction work without doing it now.

The corrected sequence becomes:

```text
Stage 10.7 -> RF / Voucher Economy Embodiment
Stage 10.8 -> Rielt.Market Economy Embodiment
Stage 10.9 -> Atlas / Pulse / Blog / Guru Contribution Model
Stage 10.11 -> MVP Economy Cutline
Stage 10.12 -> Implementation Readiness Plan
```

## 3. RF Economy Role Model

### Allowed role meanings

| Concept | Intended meaning | Authority owner | Not equal to |
|---|---|---|---|
| `voucher_utility` | Practical access/benefit/discount/gift/access artifact governed by RF lifecycle | RF Service | money, cashback, payout |
| `claim` | User obtains or reuses an RF voucher instance under RF rules | RF Service | payout claim, financial claim |
| `redeem` | Partner-side owner-authorized marking that a voucher was used | RF Service | settlement, partner payout |
| `spend` | Optional Points debit for paid voucher claim when feature flag/runtime permits | Points Service economic fact + RF claim context | payment receipt |
| `compensation` | Points reversal for failed RF claim/spend recovery path | Points Service economic fact + RF recovery context | cashback, refund-as-money |
| `Points trace` | Points row tied to RF voucher claim/spend/compensation | Points Service | RF receipt, payment proof |
| `PRO attribution` | RF-owned durable visibility that a voucher claim came through a PRO link/source | RF Service | commission, payout, income |
| `partner visibility` | Business/merchant read model for offer/voucher activity | RF Service | financial statement |
| `Connect projection` | User-facing read-only summary of RF facts | Connect UI over RF APIs | RF authority |
| `Rielt handoff` | Listing context that links user to RF voucher flow | Rielt + RF | booking/payment confirmation |

### Forbidden meanings

```text
voucher != cashback
claim != payout
redeem != settlement
spend != payment_receipt
compensation != cashback
PRO_attribution != commission
partner_dashboard != financial_statement
RF_summary != payout_report
Rielt_RF_context != booking_payment_confirmation
```

## 4. Current RF Surface Inventory

| Surface | Location | Runtime class | Proof class | Authority owner | Collapse risk | MVP readiness | Verdict |
|---|---|---|---|---|---|---|---|
| RF landing | `rfFirstSliceContent.ts`, `/rf` | production-shaped content | product_navigation | RF UI | Medium | MVP-ready with guardrails | Utility hub; avoid "bonus" as financial value |
| RF catalog | `Catalog/RfPlacesCatalog.tsx` | runtime-backed read | partner_projection | RF | Low/Medium | MVP-ready | Partner discovery, not payout surface |
| RF offer catalog | `Offers/RfOffersCatalog.tsx`, `rfFirstSliceContent.ts` | runtime-backed read | offer_projection | RF | Medium | MVP-ready with copy guard | Offer benefit, not cashback |
| Claim button | `Shared/ClaimRfOfferButton.tsx` | runtime-backed action | RF lifecycle fact candidate | RF | High | internal-beta | Claim creates/returns voucher; not payout |
| Entitlement preview badge | `RfEntitlementPreviewBadge.tsx` | preview/proxy | entitlement_preview | RF preview | Medium | internal-beta | Informational preview, not eligibility authority |
| My Vouchers | `Vouchers/RfMyVouchersView.tsx` | runtime-backed read + local fallback | voucher_lifecycle_projection | RF | High | MVP-ready after copy tightening | Read-only RF layer, not financial cabinet |
| Voucher status labels | `rfVoucherLifecycle.ts` | semantic helper | lifecycle_projection | RF | High | internal-beta | `Активен/Использован/Получен` need anti-settlement framing |
| Voucher spend semantics | `rfSpendSemantics.ts` | semantic helper | Points usage projection | RF + Points | High | internal-beta | Points required/confirmed, not payment receipt |
| Local saved offers | `rfFirstSliceContent.ts`, local contour | local-only | local_planning | browser/local | Medium | MVP-ready with guard | Saved offer is not server voucher |
| Connect RF summary card | `VoucherSummaryCard.tsx` | RF-backed projection | summary_projection | RF projected in Connect | High | internal-beta | Summary, not payout report |
| Connect RF details | `RfVoucherProjectionPanel.tsx` | RF-backed projection | timeline_projection | RF projected in Connect | High | internal-beta | Timeline not audit trail |
| Connect RF meaning card | `RfEconomicMeaningCard.tsx` | projection/narrative | participation_summary | Connect over RF | High | internal-beta | "RF-прогресс" can overread as reward/progression |
| Merchant voucher activity | `Merchant/Vouchers/VoucherActivitySummary.tsx` | runtime-backed read | merchant_activity_summary | RF | High | internal-beta | Operational summary, not statement |
| Merchant redeem/code UI | `Merchant/Vouchers/CodeRedeem.tsx` | partner-side action | voucher_lifecycle_write | RF | High | internal-beta | Redeem, not settlement |
| PRO dashboard | `PRO/Dashboard/*` | mixed mock/projection | pro_visibility_projection/mock | RF/mock | Medium/High | internal-beta | Strong no-finance copy, but mock stats |
| PRO rewards page | `PRO/Rewards/RewardsView.tsx` | explicit non-financial notice | boundary_notice | none | Low | MVP-safe as boundary | Good anti-payout pattern |
| PRO attributed vouchers API | `/v1/rf/pro/attributed-vouchers` | runtime read | attribution_projection | RF | High | internal-beta | Attribution, not commission |
| Rielt listing RF panel | `rielt/ListingDetail/CTAPanel.tsx` | product handoff | listing_context_projection | Rielt/RF | Medium/High | MVP-ready with guard | RF context, not booking/payment proof |
| Rielt listing claim flow | `rf/rielt/.../ListingVoucherOffersClient.tsx` | runtime-backed action | listing_scoped_voucher_lifecycle | RF | High | internal-beta | Listing-scoped voucher, not booking/payment |
| RF mock data | `components/rf/mockData.ts` | mock-only | local_mock_UI_only | none | Critical if mounted | blocked as evidence | Quarantine |
| Future markers | `Rewards later`, `Totem/NFT later`, premium/preview flags | future-only | future_placeholder | none | High | future-only | Must be explicit future-only |

## 5. RF Runtime Reality Map

### Runtime APIs

RF OpenAPI defines runtime-implemented baseline paths:

- `/v1/rf/partners`;
- `/v1/rf/partners/{partnerId}`;
- `/v1/rf/offers`;
- `/v1/rf/offers/{offerId}`;
- `/v1/rf/offers/{offerId}/claim`;
- `/v1/rf/me/vouchers`;
- `/v1/rf/me/vouchers/summary`;
- `/v1/rf/business/partners`;
- `/v1/rf/business/partners/{partnerId}/offers`;
- `/v1/rf/business/partners/{partnerId}/offers/{offerId}/activate`;
- `/v1/rf/business/partners/{partnerId}/vouchers/{voucherId}/redeem`;
- `/v1/rf/business/partners/{partnerId}/voucher-activity/summary`;
- `/v1/rf/pro/attributed-vouchers`;
- `/v1/rf/pro/links/*`;
- `/v1/rf/rielt/listings/{listingId}/offers`;
- `/v1/rf/rielt/listings/{listingId}/offers/{offerId}/claim`;
- internal diagnostics endpoints.

### Voucher lifecycle

RF voucher lifecycle fields:

```text
status: claimed | redeemed | cancelled
canonicalStatus: available | locked | unlocked | redeemed | expired | cancelled
claimScope: partner | listing
claimedAt
redeemedAt
repeatPolicySnapshot
issueSequence
pointsCostSnapshot
economyStatus
attribution
```

Interpretation:

```text
claimed -> product-issued / active voucher
redeemed -> partner-side used voucher
cancelled/expired -> unavailable voucher
locked -> obtained but not active
unlocked -> repeat/reclaim availability
```

None of these mean payout, cashback, settlement or receipt.

### Points touchpoints

RF can touch Points through paid voucher spend and compensation when enabled:

```text
/internal/points/spend action = rf_voucher_claim_spend
/internal/points/add action = rf_voucher_claim_spend_compensation
```

Safe reading:

```text
RF claim context + Points debit/compensation row
!= payment rail
!= cashback
!= payout
!= financial refund
```

### PRO attribution

PRO attribution stores/reads confirmed voucher attribution:

```text
attribution.status = confirmed
attribution.source = pro_link | other
```

The OpenAPI explicitly states PRO attributed vouchers do not expose rewards, commissions or payout semantics.

### Connect projections

Connect reads:

- `useRfVoucherSummary()`;
- `fetchMyVouchers()`;
- local `buildConnectRfProjection()`.

Connect projection groups RF data into:

- total;
- active;
- used;
- unavailable;
- pending activation;
- repeatable;
- received via PRO;
- recent activity/timeline;
- milestones/narrative.

This is a projection, not RF authority.

### Rielt handoff

Rielt provides listing context and sends users to RF:

```text
Rielt listing -> RF listing offers -> listing-scoped RF voucher claim
```

Rielt copy already says it does not confirm booking/payment. Stage 10.7 preserves that boundary.

## 6. RF Vocabulary Classification

| Term | Surface | Current meaning | Intended meaning | Collapse risk | Classification | Recommended disposition |
|---|---|---|---|---|---|---|
| `voucher` / `ваучер` | RF all | RF lifecycle artifact | Voucher utility | cashback/payment artifact | `allowed` | Keep with utility framing |
| `claim` / `получить` | Claim buttons, APIs | Obtain voucher instance | RF lifecycle action | payout claim | `allowed_with_guardrails` | Add "получить ваучерную utility", not financial claim |
| `claimed` | API/status | Runtime active/issued value | Issued voucher state | money status | `allowed_with_guardrails` | Explain product-issued mapping |
| `redeem` / `использовать` | Merchant/redeem/status | Mark voucher used by partner | Lifecycle usage | settlement/payout | `allowed_with_guardrails` | Use "использован у партнёра", not "погашен/settled" |
| `spend` | Points integration | Optional Points debit | Internal Points usage trace | payment receipt | `dangerous_until_aligned` | Keep backend/internal; UI says "требуются internal Points" |
| `compensation` | Points recovery | Reversal/recovery Points row | Recovery trace | cashback/refund | `dangerous_until_aligned` | Backend/internal only with anti-cashback docs |
| `reward` / `Rewards later` | My Vouchers future markers, PRO pages | Future marker or boundary page | Future-only / not active | reward/payout promise | `dangerous_until_aligned` | Replace later with "recognition later" or future-only chip |
| `cashback` | Docs guardrails | Forbidden meaning | Not RF | cashback | `forbidden_for_stage_10` | Use only as forbidden term |
| `payout` | Docs/OpenAPI guardrails | Forbidden meaning | Not RF | payout | `forbidden_for_stage_10` | Use only as forbidden term |
| `commission` | PRO risk | Forbidden meaning | Not PRO attribution | commission | `forbidden_for_stage_10` | Keep explicit "no commission" in PRO docs |
| `earned` / `received` / `получено` | My Vouchers, Connect RF | Voucher obtained / via PRO | Lifecycle projection | payout/reward received | `allowed_with_guardrails` | Only for voucher lifecycle, not money |
| `credited` / `начислено` | Points contexts | Points row if any | Points fact only | reward grant/cashback | `dangerous_until_aligned` | Avoid RF UI; Connect/Points only with source |
| `used` / `использован` | Vouchers, Connect | Voucher used | Lifecycle state | settlement | `allowed_with_guardrails` | Pair with "у партнёра", not payment |
| `settlement` | Forbidden concept | Not current behavior | None | settlement | `forbidden_for_stage_10` | Forbidden in active UI |
| `report` / `отчёт` | PRO/merchant docs risk | Dashboard/report feel | Operational summary | statement | `dangerous_until_aligned` | Prefer "операционная сводка" |
| `statement` / `выписка` | Risk vocabulary | Not current behavior | None | financial statement | `forbidden_for_stage_10` | Forbidden in active RF UI |
| `balance` | Points error/code/copy risk | Points amount | Internal Points availability | financial balance | `dangerous_until_aligned` | Hide behind "недоступно для получения"; avoid balance copy |
| `income` / `profit` / `доход` | Forbidden concept | Not RF | None | investment/income | `forbidden_for_stage_10` | Forbidden |
| `PRO reward` | PRO pages/docs | Future/internal recognition risk | PRO visibility/attribution | commission/payout | `dangerous_until_aligned` | Use "PRO visibility/attribution" |
| `partner reward` | Partner docs risk | Not current RF | None | partner payout | `forbidden_for_stage_10` | Avoid |
| `merchant activity` | Merchant summary | Operational lifecycle counters | Read-only voucher activity | settlement report | `allowed_with_guardrails` | Keep boundary copy |
| `premium access` | Entitlement preview | Preview of conditions | Informational preview | paid access/custody | `allowed_with_guardrails` | Always say preview, behavior unchanged |
| `Totem/NFT later` | Future marker | Future Layer 2/4 marker | Future-only | NFT activation | `future_only` | Stage 11+ only; not RF MVP claim |

## 7. RF Proof-Class Mismatch Register

| Mismatch | Surfaces | Severity | Why dangerous | Required stance |
|---|---|---|---|---|
| claim-as-payout | Claim button, Rielt claim, API `claim` | High | "получить/claim" can sound like financial claim | `RF_claim != payout` |
| redeem-as-settlement | Merchant redeem endpoint, status labels | High | Partner "redeem" can read as settlement | `RF_redeem != settlement` |
| voucher-as-cashback | Offer benefit, My Vouchers, Connect summary | High | Benefit/discount/gift can become cashback narrative | `RF_voucher != cashback` |
| spend-as-payment-receipt | Points-cost voucher claim, `rf_voucher_claim_spend` | High | Points debit can look like payment | `RF_spend != payment_receipt` |
| compensation-as-cashback | `rf_voucher_claim_spend_compensation` | High | Reversal can look like cashback/refund | `RF_compensation_points != cashback` |
| PRO-attribution-as-commission | PRO attributed vouchers, Connect "Получено через PRO" | High | Attribution count can look like commission | `RF_PRO_attribution != commission` |
| merchant-summary-as-statement | VoucherActivitySummary metrics | High | Counts can become financial statement | `RF_partner_dashboard != financial_statement` |
| Connect-summary-as-payout-report | VoucherSummaryCard, RF progress card | High | RF totals/milestones can look like payout report | `RF_summary_in_Connect != payout_report` |
| timeline-as-audit | Connect RF timeline, My Vouchers | High | Recent status rows can look like audit trail | `RF_voucher_timeline != audit_trail` |
| Rielt-handoff-as-booking/payment | Rielt CTA, listing voucher flow | Medium/High | Voucher for listing can look like booking/payment confirmation | `RF_Rielt_context != booking_payment_confirmation` |
| screenshot-as-proof | Voucher cards, merchant summaries, Connect panels | High | UI screenshot used in support/partner dispute | `RF_screenshot != proof` |
| mock-as-runtime | `components/rf/mockData.ts`, PRO mock stats | Critical if exposed | Demo rows look live | `RF_mock_voucher != runtime_voucher` |
| stale-status-as-current-truth | Connect RF React Query, voucher list | Medium/High | 30s stale projection can be cited as current | Projection freshness labels needed later |
| duplicate-claim-confusion | Idempotent claim/replay copy | Medium | User reads replay as new voucher or failed claim | Explicit replay copy needed |

## 8. RF + Points Boundary

### What is an economic fact

Only Points Service writes are Layer 1 economic facts:

```text
points_transactions row with action=rf_voucher_claim_spend
points_transactions row with action=rf_voucher_claim_spend_compensation
```

### What is an RF lifecycle fact

RF lifecycle facts:

- voucher created/claimed;
- voucher canonical status;
- voucher redeemed;
- voucher cancelled/expired;
- listing scope captured;
- repeat policy captured;
- PRO attribution captured/confirmed;
- merchant summary counted.

These are not Points economic facts.

### What is a Points trace

Points trace is the internal Points row used to represent RF-related debit/compensation. It is not:

- payment receipt;
- cashback;
- refund as money;
- payout;
- settlement proof.

### Boundary formula

```text
RF_lifecycle_fact
+ optional Points trace
!= financial transaction
!= cash receipt
!= cashback
```

## 9. RF + Connect Boundary

Connect can show RF because Connect is the embodiment hub. Connect must not own RF meaning.

Current safe patterns:

- `ConnectRfSection` explicitly says RF remains owner domain;
- RF summary is read-only;
- Connect links users back to RF for full voucher list;
- local projection groups are comments-marked as projection-only.

Current risks:

- "RF-прогресс" can read as progression/reward layer;
- "Получено через PRO" can read as commission/reward;
- "Использованные преимущества" can read as cashback/settlement;
- timeline can look like audit;
- metrics can be screenshotted as proof;
- projection freshness/staleness is not fully visible to users.

Required boundary:

```text
Connect_RF_projection != RF_authority
RF_summary_in_Connect != payout_report
RF_timeline_in_Connect != audit_trail
Connect_RF_screenshot != proof
```

## 10. RF + Rielt Boundary

Rielt provides listing context and sends users to RF for voucher handling.

Current good pattern:

- Rielt CTA says Rielt does not confirm booking;
- Rielt contact request says it does not confirm booking or payment;
- RF listing vouchers route handles claim in RF context;
- listing-scoped claim captures `claimScope = listing` and listing context.

Risks:

- "Ваучеров: N" can feel like value-bearing entitlement;
- RF voucher on a listing can be misread as booking/payment proof;
- "Получение и активация" can overread as confirmed reservation;
- listing-scoped voucher can be mistaken for Rielt-owned voucher authority.

Required boundary:

```text
Rielt_RF_context != booking_payment_confirmation
RF_voucher_in_Rielt != payment_receipt
Rielt_listing_claim_context != RF_authority_switch
```

## 11. RF Mock / Future-only Register

| Surface | File/location | Risk | Current class | Required disposition |
|---|---|---|---|---|
| RF mock partners | `components/rf/mockData.ts` | Demo stats look live | mock-only | quarantine; do not cite as runtime evidence |
| Mock vouchers/user vouchers | `mockData.ts` | Fake claim/redeem rows | mock-only | quarantine |
| Mock partner stats | `vouchersReceived`, `vouchersRedeemed`, views/saves | Statement-like counters | mock-only | quarantine; never support evidence |
| Mock PRO curator | `mockPROCurator`, PRO dashboard | PRO visibility can look live | mock-only | keep inert or mark mock in future implementation |
| Mock PRO reward transactions | `PRORewardTransaction` | Reward/commission overread | mock-only | blocked for MVP economy claims |
| `Rewards later` marker | `rfFirstSliceContent.ts` | Future reward promise | future-only | rename later or add future-only marker |
| `Totem/NFT later` marker | `rfFirstSliceContent.ts` | NFT/G2A-style activation illusion | future-only | Stage 11 only, keep explicit future-only |
| Entitlement mock/preview APIs | RF service internal/preview endpoints | Diagnostics/preview as rollout evidence | diagnostics/preview | guard as non-authority |
| Space RF mock vouchers | Space mock cluster | RF utility under Space authority | mock-only | replace with RF/Connect projection later |
| Rielt mock `RFVoucher` | `rielt/mockListings.ts` | RF voucher as listing truth | seed/presentation | keep with Rielt boundary |

Disposition meanings:

- `keep inert`: acceptable as disabled/stub/backlog surface;
- `quarantine`: must not be cited as runtime truth;
- `rename later`: Stage 10.12 copy/type change candidate;
- `replace with backend projection`: use RF owner APIs later;
- `future implementation candidate`: not MVP-ready now;
- `blocked for MVP`: cannot appear as live economy claim.

## 12. RF Abuse & Collapse Risk Register

| Risk | Surface/flow | Severity | Abuse path | Current mitigation | Required future mitigation |
|---|---|---|---|---|---|
| Voucher screenshot as payout proof | My Vouchers, Connect RF panels | High | User sends voucher card as payout/cashback evidence | Some read-only/non-finance copy | Add screenshot != proof copy and support policy |
| Merchant dashboard as settlement statement | VoucherActivitySummary | High | Partner treats counts as settlement report | Boundary copy says operational summary | Strong "not financial statement" helper |
| PRO attribution as commission proof | PRO attributed vouchers, Connect "Получено через PRO" | High | PRO expects commission/income | OpenAPI no commission/payout; PRO no-finance page | Rename/clarify "visibility/attribution", not reward |
| RF redeem as cashback | Merchant redeem/status | High | "redeemed" becomes cashback paid | RF docs guardrails | Label as "used at partner", not settled |
| Claim as financial claim | Claim buttons | High | "claim" interpreted as claiming money/reward | Voucher copy, no payout words | Add "voucher utility" framing |
| Points compensation as cashback | Failed spend recovery | High | Compensation row seen as cashback/refund | Backend-only | Keep backend/internal; docs anti-cashback |
| Stale voucher status | Connect projection and My Vouchers | Medium/High | Old screenshot/30s stale data used in dispute | Link back to RF owner | Freshness labels later |
| Mock voucher as runtime truth | RF mockData, PRO mock dashboard | Critical if exposed | Mock stats/screenshots cited as real | Mostly dev/mock | Mock quarantine labels |
| Rielt booking/payment confusion | Listing RF handoff | Medium/High | Voucher seen as booking confirmation/payment | Rielt says no booking/payment | Repeat boundary in RF listing voucher page |
| Duplicate claim misunderstanding | Idempotent replay | Medium | User expects duplicate/new voucher | "already claimed" copy | Explain replay/no duplicate business effect |
| Partner dispute from UI screenshot | Merchant/Connect summary | High | Partner argues based on visible count | Owner-scoped API | Support lookup by RF IDs only |
| User support dispute from voucher card | My Vouchers/Connect | High | User claims active voucher based on UI | Status labels | Backend lookup/freshness in Stage 10.12 |

## 13. RF MVP Cutline

### MVP-ready

MVP-ready as voucher utility:

- RF public partner catalog;
- RF public offer catalog;
- RF offer detail and partner detail as discovery;
- authenticated voucher claim for active offers;
- My Vouchers as RF-owned read-only lifecycle projection;
- basic voucher status labels with utility framing;
- Rielt listing handoff to RF with no booking/payment proof;
- Connect RF section as read-only projection if framed correctly;
- PRO Rewards boundary page as non-financial notice.

### Internal-beta-only

- paid voucher Points spend/cost semantics;
- Points compensation/recovery semantics;
- entitlement preview / premium access preview;
- merchant voucher activity summary;
- partner-side redeem UI;
- PRO attributed vouchers display;
- Connect RF milestones/narrative/progress;
- listing-scoped claim for Rielt objects;
- repeat-after-redeem cycles.

### Future-only

- `Rewards later`;
- Totem/NFT;
- G2A/token reward;
- external wallet/bridge;
- marketplace/trading;
- partner payout/settlement exports;
- PRO commission dashboards;
- support-grade receipts/exports;
- financial reconciliation reports.

### Blocked

- RF as cashback system;
- RF as payout system;
- RF as settlement layer;
- RF voucher as payment receipt;
- merchant dashboard as financial statement;
- PRO attribution as commission;
- Connect RF summary as payout report;
- screenshots/share cards as proof;
- mock RF data as runtime truth;
- any Slice 16 movement.

### Dangerous until aligned

- "Получено через PRO";
- "RF-прогресс";
- "Rewards later";
- "Использованные преимущества";
- "Points подтверждены";
- "Требуются internal Points";
- "История RF-активности";
- merchant metric cards without non-financial framing;
- status/timeline rows without proof boundary;
- "Премиум-доступ доступен" preview without persistent preview marker.

## 14. Implementation-Correction Backlog

This backlog is for Stage 10.12. Stage 10.7 does not implement it.

### Copy fixes

- Replace/guard `Rewards later` with explicit future-only recognition wording.
- Change "RF-прогресс" to "RF-сводка активности" or "RF participation summary".
- Add anti-payout framing near "Получено через PRO".
- Clarify "Использованные преимущества" as voucher lifecycle, not cashback/settlement.
- Keep "Получить ваучер" but add "voucher utility" / "не выплата" helper where risk is high.
- Avoid "баланс", "доход", "комиссия", "выплата", "кэшбэк", "settlement", "statement" in active RF UI.
- Use "операционная сводка" instead of "отчёт" or statement-like terms.

### UI framing fixes

- Add projection markers to Connect RF summary and RF timeline.
- Add freshness/as-of markers for RF projections.
- Add "not proof / not receipt" helper on voucher cards and Connect RF panels where screenshots are likely.
- Add merchant dashboard boundary: operational summary only, not financial statement.
- Add PRO boundary: attribution visibility only, not commission.
- Add Rielt listing voucher boundary: RF voucher does not confirm booking or payment.
- Explain duplicate/idempotent claim: replay returns same voucher, not a new voucher.

### Runtime/API documentation fixes

- Strengthen OpenAPI descriptions for claim: claim means voucher issuance, not payout claim.
- Strengthen redeem descriptions: redeem means partner-side usage marker, not settlement.
- Add RF + Points descriptions for `rf_voucher_claim_spend` and compensation as internal Points traces, not payments/cashback.
- Add SDK comments for `useRfVoucherSummary`, `fetchMyVouchers`, `claimRfOffer`, `claimRfRieltListingOffer`, `useRfPartnerVoucherActivitySummary`.
- Add owner-domain labels: RF owns voucher lifecycle; Points owns Points rows; Connect projects.

### Mock/future cleanup

- Quarantine `components/rf/mockData.ts` as non-evidence in docs and future code comments.
- Mark PRO mock dashboard rows if exposed in beta routes.
- Rename or guard future markers: `Rewards later`, `Totem/NFT later`.
- Keep G2A/NFT/token/bridge absent from active RF UI.
- Replace Space/Rielt RF mock voucher displays with RF owner projections in future implementation.

### Support/proof fixes

- Define RF support lookup requirements by `voucherId`, `partnerId`, `offerId`, `claimScope`.
- Clarify screenshots are hints, not proof.
- Define no receipt/audit wording for voucher cards, merchant summary, Connect RF panels.
- Keep internal diagnostics admin-only and non-rollout evidence.
- Add support path for stale/duplicate claim/redeem disputes using backend owner data only.

## 15. Recommended Follow-up Slices

### Stage 10.8 — Rielt.Market Economy Embodiment

Pass forward:

- Rielt RF handoff must not imply booking/payment confirmation;
- listing voucher count must not become value-bearing entitlement;
- Rielt verified/PRO copy must not become payment proof;
- RF claim from listing must stay RF-owned.

### Stage 10.9 — Atlas / Pulse / Blog / Guru Contribution Model

Pass forward:

- content/reward promises must not imply RF reward producer;
- Pulse/RF event badges must remain event metadata;
- Guru/Atlas reward vocabulary must use future/preview markers.

### Stage 10.11 — MVP Economy Cutline

Pass forward:

- RF is MVP-relevant as voucher utility;
- paid Points spend and entitlement preview are internal-beta unless copy and support boundaries are ready;
- merchant/PRO financial semantics are blocked;
- Connect RF projection is internal-beta without stronger proof/freshness copy.

### Stage 10.12 — Implementation Readiness Plan

Pass forward:

- the full correction backlog in section 14;
- copy labels;
- projection markers;
- mock quarantine;
- OpenAPI/SDK descriptions;
- support/proof requirements.

### Stage 11 — Externalization / Gateway Baseline

Defer:

- token/G2A;
- NFT/totem;
- external wallet;
- bridge;
- marketplace;
- custody/ownership vocabulary.

## 16. Multi-Agent Review Synthesis

| Role | Stage 10.7 assessment |
|---|---|
| ИИ-архитектор | RF has a real owner-domain lifecycle and should be embodied as voucher utility, not as financial economy. |
| ИИ-аналитик | Product readiness depends on separating benefit/claim/redeem from cashback/payout/settlement. |
| ИИ-бэкенд-разработчик | Backend RF contracts are comparatively explicit; leakage risk is claim/redeem/spend/compensation wording in UX and SDK consumers. |
| ИИ-фронтенд-разработчик | UI already has good no-finance copy in PRO and Connect, but RF-progress, PRO receipt, future markers and status labels need a correction pass. |
| ИИ-тестировщик | Critical QA risks are screenshot-as-proof, merchant summary-as-statement, and duplicate claim/redeem misunderstanding. |
| ИИ-специалист по безопасности | Highest abuse paths are payout proof screenshots, PRO commission expectation and merchant settlement disputes. |
| ИИ-технический писатель | The Stage 10.7 document must be correction-ready: surface matrix, vocabulary classes, mismatch register and Stage 10.12 backlog. |

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
diagnostics != rollout_evidence
contract != activation
stable_enough != launch_ready
slice_16_status = blocked_not_triggered
```

Stage 10.7 guardrails:

```text
RF_voucher != cashback
RF_claim != payout
RF_redeem != settlement
RF_spend != payment_receipt
RF_partner_dashboard != financial_statement
RF_PRO_attribution != commission
RF_voucher_status != money_status
RF_voucher_timeline != audit_trail
RF_summary != payout_report
RF_compensation_points != cashback
RF_projection != authority
RF_mock_voucher != runtime_voucher
RF_screenshot != proof
RF_Rielt_context != booking_payment_confirmation
RF_points_usage != payment
RF_points_trace != receipt
Connect_RF_projection != RF_authority
RF_voucher_in_Rielt != payment_receipt
```

## 18. Final Verdict

```text
stage_10_7_status: completed_as_docs_first_rf_voucher_embodiment_audit
rf_role_model_defined: true
rf_voucher_utility_layer_confirmed: true
rf_cashback_system: false
rf_payout_system: false
rf_settlement_layer: false
rf_runtime_maturity: medium_high
rf_ui_copy_maturity: medium
rf_connect_projection_risk: high
rf_rielt_boundary_risk: medium_high
rf_pro_commission_collapse_risk: high
rf_partner_statement_collapse_risk: high
rf_points_payment_receipt_risk: high
rf_mock_runtime_truth_risk: high
rf_mvp_ready_as_voucher_utility: true
rf_mvp_ready_as_payout_or_cashback: false
rf_mvp_ready_as_settlement_or_commission: false
implementation_correction_backlog_created: true
recommended_next_slice: Stage_10_8_Rielt_Market_Economy_Embodiment
recommended_mvp_slice: Stage_10_11_MVP_Economy_Cutline
recommended_implementation_slice: Stage_10_12_Implementation_Readiness_Plan
recommended_externalization_slice: Stage_11_Externalization_Gateway_Baseline
slice_16_status: blocked_not_triggered
```

Honest Stage 10.7 conclusion:

RF is one of the more runtime-real utility modules in Go2Asia and should be MVP-relevant as a voucher utility layer. The architecture and OpenAPI already contain strong anti-payout language in several places, and user-facing surfaces have meaningful read-only and non-financial copy. The remaining risk is product-specific semantic collapse: voucher claim can sound like payout, redeem can sound like settlement, Points spend can sound like payment, PRO attribution can sound like commission, merchant summaries can look like statements, and Connect RF cards can become screenshot proof. Stage 10.7 defines RF as business utility + voucher lifecycle and creates the practical correction backlog needed before Stage 10.12.
