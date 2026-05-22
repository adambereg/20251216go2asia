# Stage 12I-C3 — Rielt Seed Source Labels Report

Документ: `stage_12I_C3_rielt_seed_source_labels_v1.md`  
Статус: implementation report / Rielt source-label and inquiry-boundary evidence  
Дата: 2026-05-22  
Scope: active Rielt listing/search/detail/inquiry surfaces  
Mode: targeted audit -> bounded UI/test implementation -> validation -> report

## 1. Stage 12I-C3 Verdict

Stage 12I-C3 hardens active Rielt listing surfaces so Rielt reads as source-labeled inquiry-only listing previews, not as a booking platform, payment platform, confirmed availability system, verified inventory marketplace or inventory authority.

Required statement:

```text
Stage 12I-C3 completed as Rielt source-label / inquiry-boundary UI hardening slice, not booking/payment/runtime implementation, API/OpenAPI/SDK/schema change, fake inventory verification, fake source metadata, Path B activation or public launch approval.
```

Final verdict:

```text
stage_12I_C3_status: COMPLETE_AS_RIELT_SEED_SOURCE_LABELS
rielt_listing_source_labels_visible: true
rielt_seed_demo_labels_visible: true
rielt_inquiry_only_posture_visible: true
rielt_booking_payment_semantics_added: false
fake_inventory_verification_added: false
fake_metadata_added: false
runtime_changes: false
api_openapi_sdk_changes: false
schema_changes: false
path_b_activation: false
public_launch_ready: false
```

## 2. Capsules Used

| Capsule | Role |
|---|---|
| `docs/ai/context/core/capsule.md` | owner fact, projection, mock/demo, Path A / Path B and no-public-launch doctrine |
| `docs/ai/context/ui/capsule.md` | projection/mock/demo UI treatment, dashboard/proof boundaries and forbidden active vocabulary |
| `docs/ai/context/security/capsule.md` | mock-as-proof, screenshot-as-proof and support-proof rejection |
| `docs/ai/context/stage_12_product_reality/capsule.md` | Stage 12 residue, Rielt inquiry-only posture and product-reality routing |
| `docs/ai/context/routing_rules.md` | bounded context selection and anti-overload rules |

Upstream SSOT read:

- `docs/architecture/domain/stage_12_x_4_projection_metadata_proof_class_ui_requirements_v1.md`
- `docs/architecture/domain/stage_12_closure_review_v1.md`
- `docs/reports/stage_12I_C2_connect_projection_labels_v1.md`

## 3. Agents Used

| Agent | Role in C3 |
|---|---|
| AI Program Director / Orchestrator | task classification, boundary selection, review gate routing and final synthesis |
| Frontend Developer | active Rielt UI surface audit and minimal source/inquiry label strategy |
| Runtime Governance Architect | `listing_projection != inventory_authority`, `inquiry != booking` review |
| Security / Fraud & Abuse Reviewer | screenshot-as-proof, booking/payment illusion and fake verified inventory risk review |
| QA Agent | static guardrail and validation strategy |
| Technical Canon Writer | report structure and canon alignment |
| Slice Strategist | bounded scope, exclusions, stop conditions and follow-up sequencing |

## 4. Audit Scope

Targeted audit covered active Rielt listing surfaces only:

| Area | Files inspected |
|---|---|
| Rielt route metadata and hero | `app/(public)/rielt/layout.tsx`, `page.tsx`, `RieltHomeClient.tsx` |
| Search/listing results | `app/(public)/rielt/search/SearchResultsClient.tsx`, `components/rielt/SearchResults/*` |
| Listing cards and home sections | `components/rielt/ListingCard.tsx`, `EditorPicks.tsx`, `NewListings.tsx` |
| Search filters | `components/rielt/SearchBar.tsx`, `QuickFilters.tsx`, `SearchResults/FiltersPanel.tsx` |
| Listing detail | `app/(public)/rielt/listings/[id]/*`, `components/rielt/ListingDetail/*` |
| Seed/runtime overlay helpers | `components/rielt/adapters/rieltDtoToListing.ts`, `components/rielt/hooks/useRieltSeed.ts`, `components/rielt/types.ts` |

Out of audit scope:

- Rielt runtime/API/OpenAPI/SDK/schema changes;
- booking/payment implementation;
- checkout, reservation or payment flow;
- fake `proofClass`, `asOf`, `sourceOwner`, `ownerFactRef`;
- fake inventory or host verification;
- Path B activation;
- broad Rielt redesign.

## 5. Rielt Listing / Source Classification

| Surface | Pre-C3 classification | Risk | C3 action | Post-C3 classification |
|---|---|---|---|---|
| Rielt metadata/hero/home banner | listing projection | could imply curated verified housing marketplace | changed copy to inquiry-only source-labeled previews | inquiry-only listing projection |
| Search results heading/banner | runtime listing projection plus seed overlay | seed/demo materials could look like real inventory | added listing preview and seed preview warning | source-labeled listing projection |
| Listing cards | runtime projection with optional seed presentation overlay | source not visible on each card | added source chip and inquiry-only helper | source-visible listing preview |
| Listing detail summary/gallery | runtime projection with optional seed overlay | detail page could look authoritative | added source chips and inquiry-only helper | source-visible listing detail preview |
| Availability calendar | availability preview | calendar could be read as confirmed availability | relabeled as `Availability preview`, owner confirmation required | availability preview, not confirmed availability |
| CTA/inquiry panel | inquiry fact after submit | could be confused with booking request | added source/inquiry chips, success copy and non-booking/non-payment helper | inquiry-only contact request |
| PRO/curator labels | projection over curator signal | `Проверено PRO` could imply verified inventory/host | changed to `Кураторский сигнал` and non-authority helper | curator signal only |
| Search filters | query state | `С проверкой куратора`, `Готово к заезду` could imply availability/verification | changed to `Кураторский контекст`, `Заезд можно уточнить` | inquiry criteria only |
| RF voucher context | RF projection link | could imply payment/booking benefit | kept RF in RF Asia, added no booking/payment/availability authority copy | RF context, not Rielt booking/payment |

## 6. Source-Label Strategy Chosen

Chosen strategy: `listing visible / inventory authority forbidden`.

Applied rules:

- keep listings visible and useful;
- label known source as `Источник: runtime projection` or `Источник: seed preview`;
- label cards/details/CTA as `Inquiry-only`;
- label availability as `Availability preview`;
- treat seed/demo presentation overlay as non-proof material;
- treat curator/PRO state as `Кураторский сигнал`, not verified inventory or host verification;
- keep inquiry submission as contact request only;
- avoid fake metadata.

Preferred terms used:

- `Источник: seed preview`;
- `Источник: runtime projection`;
- `Inquiry-only`;
- `listing preview`;
- `Availability preview`;
- `Кураторский сигнал`;
- `запрос уточняет детали у владельца`;
- `не бронь`;
- `не оплата`;
- `не inventory authority`;
- `не host verification`;
- `не confirmed availability`.

Terms intentionally avoided as positive UI claims:

- `Забронировать`;
- `Book now`;
- `Confirmed availability`;
- `Verified inventory`;
- `Available now`;
- `Guaranteed`;
- `Host verified`;
- `Instant booking`;
- `Payment`;
- `Checkout`;
- `Receipt`;
- `Reservation confirmed`.

## 7. Files / Components Changed

| Path | Change |
|---|---|
| `apps/go2asia-pwa-shell/app/(public)/rielt/layout.tsx` | Metadata and hero copy now say inquiry-only source-labeled previews |
| `apps/go2asia-pwa-shell/app/(public)/rielt/page.tsx` | Page metadata hardened away from verified-housing semantics |
| `apps/go2asia-pwa-shell/app/(public)/rielt/RieltHomeClient.tsx` | Home banner and search helper now state source/inquiry-only posture |
| `apps/go2asia-pwa-shell/components/rielt/copy.ts` | New shared Rielt source/inquiry copy helpers |
| `apps/go2asia-pwa-shell/components/rielt/sourceLabels.test.ts` | New static guardrail for source labels, inquiry posture and fake metadata rejection |
| `apps/go2asia-pwa-shell/components/rielt/ListingCard.tsx` | Source chip and inquiry-only helper added; curator label softened |
| `apps/go2asia-pwa-shell/components/rielt/EditorPicks.tsx` | Section helper reframed as inquiry scenarios |
| `apps/go2asia-pwa-shell/components/rielt/NewListings.tsx` | New-listing copy reframed as listing previews |
| `apps/go2asia-pwa-shell/components/rielt/SearchBar.tsx` | Unsafe filter labels softened; helper text points to owner inquiry |
| `apps/go2asia-pwa-shell/components/rielt/QuickFilters.tsx` | Curator/availability filter labels softened |
| `apps/go2asia-pwa-shell/components/rielt/SearchResults/FiltersPanel.tsx` | Active filter chips softened |
| `apps/go2asia-pwa-shell/components/rielt/SearchResults/SearchResultsView.tsx` | Results heading/banner now source/inquiry/seed aware |
| `apps/go2asia-pwa-shell/components/rielt/ListingDetail/Gallery.tsx` | Source chip added; PRO badge softened |
| `apps/go2asia-pwa-shell/components/rielt/ListingDetail/Summary.tsx` | Source and inquiry-only chips/helper added |
| `apps/go2asia-pwa-shell/components/rielt/ListingDetail/AvailabilityCalendar.tsx` | Calendar relabeled as availability preview, not confirmed availability |
| `apps/go2asia-pwa-shell/components/rielt/ListingDetail/LongTermConditions.tsx` | Long-term terms marked as inquiry preview, not contract/payment/confirmed availability |
| `apps/go2asia-pwa-shell/components/rielt/ListingDetail/CTAPanel.tsx` | Source/inquiry chips, inquiry success copy and no booking/payment helper added |
| `apps/go2asia-pwa-shell/components/rielt/ListingDetail/Owner.tsx` | Contact block marked as inquiry-only, not host verification or booking confirmation |
| `apps/go2asia-pwa-shell/components/rielt/ListingDetail/Verification.tsx` | PRO verification wording changed to curator signal and non-authority helper |

No runtime, API, OpenAPI, SDK, schema, migration or feature-flag files were changed.

## 8. Validation Command Results

| Command | Result | Notes |
|---|---|---|
| `pnpm guardrails:mock-imports:check` | Passed | Allowed baseline findings: 19 |
| `pnpm guardrails:mock-env:check` | Passed | 30 allowed policy/dev-demo references |
| `pnpm -C apps/go2asia-pwa-shell typecheck` | Passed | `tsc --noEmit` |
| `pnpm -C apps/go2asia-pwa-shell lint` | Passed | Exit code 0; existing warnings outside C3 scope remain |
| `pnpm -C apps/go2asia-pwa-shell test` | Passed | 17 files, 105 tests |
| `pnpm -C apps/go2asia-pwa-shell test -- components/rielt/sourceLabels.test.ts` | Passed | 1 file, 2 tests |
| `git diff --check` | Passed | No whitespace errors |
| IDE lints for changed Rielt paths | Passed | No linter errors found |

Targeted grep validation:

| Scope | Result |
|---|---|
| Active Rielt route/component surfaces | Matches are either negative boundary labels (`не booking/payment`, `не verified inventory`, `не confirmed availability`) or existing query/type field names (`checkOut`, `onlyPROVerified`, `proVerification.verified`) |
| Active Rielt CTA/copy | No positive `Book now`, `Checkout`, `Reservation confirmed`, `Забронировать`, payment/receipt authority or guaranteed availability CTA |
| Source/proof metadata terms | No active implementation of `proofClass`, `sourceOwner`, `ownerFactRef`, `dataFreshness`, `stalenessStatus`, `projectionGeneratedAt`, `asOf`; new test asserts absence |
| Dormant/type/mock Rielt files | Existing `instantBooking`, `verified`, `mockListings` and utility field names remain as residual debt; C3 did not reactivate them |

## 9. Proof-Risk Reduction Review

Runtime Governance:

- `listing_projection != inventory_authority` preserved;
- `inquiry != booking` preserved;
- `availability_preview != confirmed_availability` preserved;
- seed overlay remains presentation/source context, not owner fact;
- no fake runtime metadata introduced.

Security / Fraud:

- listing screenshots are less likely to read as verified inventory proof;
- detail screenshots now show source and inquiry posture;
- CTA success copy rejects booking/availability confirmation;
- PRO/curator wording no longer presents a verified inventory/host authority claim;
- no checkout/payment/reservation flow introduced.

QA:

- active cards, details, search and CTA surfaces have visible source/inquiry labels;
- static guardrail prevents regression to booking/checkout/reservation and fake metadata;
- full test suite remains green.

Canon:

- C3 stays bounded to UI/copy/test/report;
- no Path B, launch, runtime, API or schema authority was added;
- Stage 12.x.4 Rielt source-label consumer is implemented only as frontend labels, not API metadata.

## 10. Remaining Rielt Gaps

| Gap | Status / owner |
|---|---|
| API/SDK types still expose legacy field names such as `instantBooking`, `verified`, `onlyPROVerified` | Future route/type/API vocabulary cleanup; C3 only hardens active UI copy |
| `mockListings.ts` still contains demo listing corpus with verification-like fields | Future mock quarantine / seed-data containment slice |
| Source labels are static UI labels from existing `presentation.source` only | Future API metadata slice may add real metadata; C3 must not invent it |
| No `proofClass`, `asOf`, `sourceOwner`, `ownerFactRef` envelope exists | Future runtime/API/OpenAPI/SDK metadata contract |
| Inquiry response metadata is not shown as owner fact reference | Future Rielt inquiry metadata/API slice |
| Availability calendar still depends on existing UI calendar data | Preserved as preview only; future runtime source/freshness contract needed |
| Full support-safe owner lookup is not implemented | Future support/Admin/runtime slice |

## 11. Acceptance Checklist

| Criteria | Result |
|---|---|
| Active Rielt listing surfaces clearly show source/inquiry posture | Passed |
| Seed/demo listings visibly labeled where applicable | Passed |
| Inquiry-only wording clearly visible | Passed |
| Availability wording hardened as preview, not confirmation | Passed |
| CTA wording remains request/inquiry-only | Passed |
| No booking/payment semantics introduced | Passed |
| No fake inventory verification introduced | Passed |
| No fake metadata introduced | Passed |
| No runtime/API/schema/OpenAPI/SDK changes | Passed |
| Guardrails remain green | Passed |
| Typecheck/lint/tests pass | Passed |
| Report created | Passed |
| Path B inactive | Passed |
| Public launch not implied | Passed |

Must remain true:

```text
listing_projection != inventory_authority
seed_data != verified_listing
inquiry != booking
availability_preview != confirmed_availability
projection != authority
mock_data != proof
Path_B_inactive = true
public_launch_implied = false
```

## 12. Recommended Next Slice

Recommended next slice:

```text
Stage 12I-C4 — Rielt Seed / Mock / Type Vocabulary Containment
```

Goal:

```text
Contain dormant Rielt mock corpus and legacy type/filter names (`instantBooking`, `verified`, `onlyPROVerified`) without changing Rielt runtime/API/schema or introducing booking/payment semantics.
```

C4 should not start booking/payment implementation or API metadata implementation. API metadata remains a separate future runtime/API contract slice.
