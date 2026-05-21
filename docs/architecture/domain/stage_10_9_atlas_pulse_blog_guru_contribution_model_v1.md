# Stage 10.9 — Atlas / Pulse / Blog / Guru Contribution Model

Документ: `stage_10_9_atlas_pulse_blog_guru_contribution_model_v1.md`  
Статус: docs-first audit/design, implementation-correction-ready backlog  
Дата: 2026-05-21  
Scope: Atlas, Pulse, Blog, Guru content/discovery/contribution surfaces, runtime APIs, mock/future-only clusters, Points/Layer 2/Connect boundaries  
Mode: read-only synthesis; no implementation; no frontend/backend/API/OpenAPI/SDK/schema changes; no tests; no rollout; no creator economy/reward/NFT/G2A/tokenization/moderation runtime activation

## 1. Executive Summary

Stage 10.9 фиксирует Atlas / Pulse / Blog / Guru as:

```text
Atlas/Pulse/Blog/Guru = content_discovery_contribution_context_layer
Atlas/Pulse/Blog/Guru != creator_economy
Atlas/Pulse/Blog/Guru != reward_marketplace
Atlas/Pulse/Blog/Guru != Points_producer_network
Atlas/Pulse/Blog/Guru != NFT_reputation_economy
Atlas/Pulse/Blog/Guru != payout_or_income_layer
```

Честный итог:

- Atlas is the location/context SSOT and guide surface, not an economic fact authority.
- Pulse is an event discovery/registration surface; `event_registration` is a narrow active Points touchpoint, not a general event reward marketplace.
- Blog is an editorial/content surface; authorship, editor picks and views are projections, not creator monetization.
- Guru is a nearby aggregator/ranking surface; recommendation rank is not payout, commission or proof of authority.
- Broad contribution signals exist conceptually, but most are not reward runtime.
- Likes/views/saves/trending/top/featured are projections and social/context signals, not economic facts.
- Token/NFT/G2A/reputation language in docs must remain future-only.
- Stage 10.9 creates an implementation-correction-ready backlog before Stage 10.11 MVP cutline.

## 2. Why Stage 10.9 Exists Now

Stage 10.3 stabilized Space as a future contribution signal layer. Stage 10.4 stabilized Quest as delivery-intent orchestration. Stage 10.5 separated off-chain recognition from NFT ownership. Stage 10.7 stabilized RF as voucher utility lifecycle. Stage 10.8 stabilized Rielt as listing/discovery/inquiry.

The remaining ambiguity is the content/discovery layer:

- Atlas docs mention places, guides, reviews, Connect/Points/NFT and location-linked rewards.
- Pulse docs mention RSVP, saved events, reports, partner events, event rewards, Points and NFT badges.
- Blog docs mention authors, reactions/views, editorial queue, rewards for authors/curators and NFT badges.
- Guru docs mention recommendations, nearby ranking, saved objects, Points and NFT rewards for activities.

If Stage 10.11 defines MVP before this layer is stabilized, it can accidentally legalize a contribution economy that is not fully materialized runtime-wise.

Stage 10.9 is therefore product correction planning:

```text
content/discovery activity may become contribution signal later
but content/discovery activity is not reward authority now
```

## 3. Contribution Role Model

### Allowed roles

| Role | Meaning | Examples | Authority owner | Not equal to |
|---|---|---|---|---|
| `content` | Public/read content item | Atlas place, Atlas guide, Blog post, Pulse event | Content Service / module data | reward grant |
| `discovery` | Browsing/search/navigation context | Atlas cards, Guru nearby, Blog feed, Pulse calendar | Module UI/API | payout marketplace |
| `activity_fact` | Runtime action or content fact | event registration, post published, guide created, place exists | Service-specific | economic fact unless explicitly Points-backed |
| `contribution_signal` | Future evaluable signal | useful guide, approved suggestion, community report, trusted recommendation | future moderation/curation | Points grant |
| `recognition_signal` | Future off-chain recognition candidate | curator recognition, featured author, trusted guide | Layer 2 later | NFT ownership |
| `projection` | Read-side popularity/context display | likes, views, saves, top, trending, recommendation rank | projection owner | authority/proof |
| `curation` | Editorial or PRO selection | editor pick, verified event, curated route | editorial/curation process | reward authority |
| `recommendation` | Ranked nearby/context suggestion | Guru card score, top guide, popular category | Guru/content projection | commission/payout |

### Forbidden roles

```text
content_contribution != reward_grant
Atlas_entry != economic_fact
Pulse_event != payout
Blog_post != Points_producer
Guru_recommendation != commission
curation != reward_authority
visibility != income
recommendation != payout
content_badge != NFT_ownership
content_projection != authority
creator_visibility != monetization
likes/views != economic_fact
saved_content != reward_signal
mock_contribution != runtime_truth
```

## 4. Current Surface Inventory

| Surface | Location | Runtime class | Proof class | Authority owner | Collapse risk | MVP readiness | Verdict |
|---|---|---|---|---|---|---|---|
| Atlas countries/cities/places | `app/(public)/atlas/*`, Content Service | production-shaped read | content_context_fact | Content Service | Low/Medium | MVP-ready | Location/content context, not reward |
| Atlas home popular places | `AtlasHomeClient.tsx` | API + mock fallback mode | popularity_projection | Content/API or mock | Medium | internal-beta | Popular != economic status |
| Atlas places catalog | `PlacesClient.tsx` | API read + facets | discovery_projection | Content Service | Medium | MVP-ready with guardrails | Filters/tags, not contribution proof |
| Atlas guides | `GuidesClient.tsx`, guide pages | production-shaped read + admin future | guide_content_fact | Content Service | Medium/High | internal-beta | Guides can become contribution signals later |
| Atlas reviews tabs | `countries/*/reviews`, `places/*/reviews` | placeholder/docs-like | future_placeholder | none | High | future-only | Reviews/Points copy must be quarantined |
| Pulse event list/calendar | `components/pulse/*`, `/pulse` | production-shaped UI/API | event_projection | Content Service | Medium | MVP-ready | Event discovery, not payout |
| Pulse event detail badges | `EventDetail.tsx` | runtime + metadata | event_metadata_projection | Content Service | High | internal-beta | `verified/free/RF` are event metadata |
| Pulse event registration | `EventRegisterButton.tsx`, `POST /v1/content/events/{id}/register` | runtime write | activity_fact + narrow Points fact | Content Service + Points | High | internal-beta | Registration can call Points; not broad reward marketplace |
| Pulse save/share/calendar | `EventDetail.tsx` | local/UI action | local_projection/share_artifact | none/UI | High | internal-beta | Saved/share/calendar != proof |
| Pulse UGC reports | `EventUGCBlock`, docs | partial/future | future_contribution_signal | Space/Reactions later | High | future-only | Reports are not rewards |
| Blog post feed | `BlogClientWrapper.tsx`, `PostCard.tsx` | production-shaped read | content_projection | Content Service | Medium | MVP-ready | Editorial feed, not creator economy |
| Blog author meta | `PostMeta.tsx` | runtime read | author_projection | Content Service | Medium/High | internal-beta | Author != monetized creator |
| Blog editor picks/featured | `PostCard.tsx`, OpenAPI flags | runtime projection | editorial_projection | Content/editorial | High | internal-beta | Featured != economic status |
| Blog views | `PostMeta.tsx` | nullable/reference only | metric_projection | none/API later | High | dangerous-until-aligned | Views != economic fact |
| Blog docs editorial queue | `docs/modules/blog/roadmap.md` | docs-only future | docs_claim_only | none | Critical | future-only | Reward/Points/NFT promises not runtime |
| Guru nearby aggregation | `guru-service`, `GuruClient`, `ObjectCard` | production-shaped aggregator | recommendation_projection | Guru Service over sources | High | internal-beta | Rank/recommendation != authority |
| Guru ranking score | `rankingEngine.ts` | runtime projection algorithm | ranking_projection | Guru Service | High | internal-beta | Score/rank != payout |
| Guru save/object actions | `ObjectCard`, `GuruListView` | UI/local/cross-module | projection/action_hint | source modules | Medium/High | internal-beta | Save != reward signal |
| Guru docs rewards | `docs/modules/guru/*` | docs-only future | docs_claim_only | none | Critical | future-only | Points/NFT rewards future-only |
| Mock data / seed content | mocks, local counters | mock-only | local_mock_UI_only | none | Critical | blocked as evidence | Mock popularity/contribution not runtime |
| Connect projections | future/activity summaries | projection/future | content_projection | Connect only | High | future-only/internal-beta | Projection summary != contribution receipt |

## 5. Runtime Reality Map

### Content Service

Content Service is the main runtime owner for Atlas/Pulse/Blog/Guides:

- public event list/detail;
- event registration;
- public countries/cities/districts/places/place containers;
- public articles;
- public Blog posts and Blog post detail;
- public Guide Engine list/detail;
- media upload token surface;
- mini-admin Guide Engine write paths.

Important runtime fact:

```text
POST /v1/content/events/{id}/register
-> event_registrations row when DB configured
-> optional /internal/points/add action=event_registration
```

This is a narrow active Points touchpoint and must not be generalized into broad content rewards.

### Guru Service

Guru Service is a nearby aggregator:

- `/v1/guru/nearby`;
- `/v1/guru/nearby/{type}`;
- `/v1/guru/what-to-do`;
- adapters for Rielt, Atlas, Pulse, RF, Quest, Space, Blog;
- `sources_active`, `sources_stub`, `source_item_counts`;
- ranking engine that boosts `is_verified`, `is_rf`, happening-now, starting-soon and partner reasons.

Runtime stance:

```text
Guru_rank = recommendation_projection
Guru_rank != payout
Guru_card != authority
Guru_source_ref != economic_fact
```

### Atlas

Atlas is runtime-backed through Content Service and PWA screens. It owns location/content context:

- countries/cities/places;
- guides/themes;
- place filters/tags/facets;
- content tabs/reviews placeholders.

Atlas does not create Points facts for place views, guide reads, saved places or suggestions in current broad runtime.

### Pulse

Pulse uses Content Service events and PWA calendar/detail surfaces. The active write path is event registration.

Important split:

```text
Pulse_event = event_content_fact
Pulse_event_registration = activity_fact + narrow Points integration
Pulse_event_badge = event_metadata
Pulse_event != payout
```

### Blog

Blog uses Content Service Blog post list/detail DTOs:

- author;
- post type;
- category/tags;
- `isPromoted`;
- `isFeatured`;
- `isEditorPick`;
- reading time;
- nullable/reference views in UI, but not authoritative reward metric.

No active creator reward runtime was found for Blog post publication, views, likes, comments or shares.

### Moderation / reputation presence

Moderation and reputation are mostly docs/future:

- Pulse roadmap says PRO/admin curate events from Space UGC.
- Blog roadmap says EditorialQueue may promote Space posts into articles.
- Atlas roadmap says UGC/content reputation later.
- Guru roadmap says rewards/Points/NFT later.

Stage 10.9 stance:

```text
moderation_assumption != runtime_reputation_engine
editorial_pick != reward_grant
verified_label != authority_proof
```

## 6. Vocabulary Classification

| Term | Surface | Current meaning | Intended meaning | Collapse risk | Classification | Recommended disposition |
|---|---|---|---|---|---|---|
| `content` | Atlas/Blog/Pulse docs/UI | Content item | Read/display object | Low | `allowed` | Keep |
| `contribution` | docs/roadmaps | Broad activity value | Future signal | reward grant | `allowed_with_guardrails` | Always say signal, not grant |
| `creator` | Blog/Guru docs | Author/user | Content author/context | income/monetization | `dangerous_until_aligned` | Avoid creator-economy framing |
| `curator` | Pulse/Blog/Guru/Atlas docs | Editorial/PRO selector | Curation context | reward authority | `allowed_with_guardrails` | Scope as review/selection |
| `verified` | Pulse/Guru/events | Event/entity metadata | Source/trust metadata | authority proof | `allowed_with_guardrails` | Specify what is verified |
| `featured` | Blog/OpenAPI | Editorial flag | Editorial projection | economic status | `allowed_with_guardrails` | Not reward eligibility |
| `top` / `best` | Atlas/Guru/docs | Ranking language | Recommendation/display | payout/status | `dangerous_until_aligned` | Prefer "recommended/contextual" |
| `ranking` | Guru/Blog/Atlas | Sort/order score | Recommendation projection | payout eligibility | `allowed_with_guardrails` | Rank != reward |
| `reward` | Pulse/Blog/Guru docs | Future incentive | Future-only | payout/Points promise | `forbidden_for_stage_10` active | Quarantine docs |
| `earn` / `заработать` | Atlas/docs | Benefit/income phrase | Not active | income | `forbidden_for_stage_10` | Remove/guard |
| `reputation` | Atlas/Guru docs | Future trust model | Future Layer 2 candidate | NFT reputation | `future_only` | Stage 11+ / Layer2 docs only |
| `trust` | Guru/Rielt/Atlas | Confidence metadata | Content quality signal | proof authority | `allowed_with_guardrails` | Trust != proof |
| `expert` | Blog/Guru docs | Author/guide label | Expertise context | financial authority | `allowed_with_guardrails` | Not advice/payout |
| `visibility` | contribution docs | Exposure | Discovery prominence | income | `allowed_with_guardrails` | Visibility != monetization |
| `influence` | future docs | Social reach | Future projection | payout | `dangerous_until_aligned` | Avoid MVP |
| `premium` | RF/Guru docs | future access/offer | Future utility marker | paid entitlement | `future_only` | No content monetization |
| `token` / `G2A` | docs roadmaps | Future tokenomics | Stage 11+ | token reward | `future_only` | Keep out of Stage 10 |
| `NFT` | docs roadmaps | Future badge/asset | Stage 11+ | ownership/reputation | `future_only` | No active content NFT |
| `badge` | Pulse event badge / Layer2 docs | Event metadata or future recognition | Off-chain/future recognition | NFT ownership | `allowed_with_guardrails` | Event badge != user badge |
| `achievement` | docs | Future recognition | Layer 2 candidate | reward proof | `future_only` | Not runtime |
| `recommendation` | Guru/Atlas/Blog | Ranked suggestion | Discovery projection | commission/payout | `allowed_with_guardrails` | Recommendation != payout |
| `save` / `favorite` | UI/docs | Local/reaction action | Convenience signal | reward signal | `allowed_with_guardrails` | Saved != economic fact |
| `trending` / `popular` | Blog/Atlas/Guru | Sort/popularity projection | Discovery hint | proof/social reward | `dangerous_until_aligned` | Needs projection marker |
| `monetization` | future/docs | Creator economy | Not active | income | `forbidden_for_stage_10` | Block for MVP |
| `creator economy` | docs/future | Future product idea | Not active | payout network | `forbidden_for_stage_10` | Explicitly false |

## 7. Proof-Class Mismatch Register

| ID | Mismatch | Surfaces | Severity | Why dangerous | Required stance |
|---|---|---|---|---|---|
| CMB-10.9-01 | content-as-reward | Atlas/Pulse/Blog/Guru docs | High | Content creation/read can look like automatic reward | `content_contribution != reward_grant` |
| CMB-10.9-02 | event-registration-as-payout | Pulse register + Points call | High | Narrow Points touchpoint can be generalized | `Pulse_event_registration != payout` |
| CMB-10.9-03 | event-badge-as-user-badge | Pulse badges `verified/free/RF` | Medium/High | Event metadata can look like Layer 2 award | `event_badge != user_badge_award` |
| CMB-10.9-04 | creator-as-income | Blog author, docs creator rewards | High | Author profile becomes monetization claim | `creator_visibility != monetization` |
| CMB-10.9-05 | ranking-as-payout | Guru rank, Atlas popular, Blog category counts | High | Rank can become reward eligibility | `ranking != payout` |
| CMB-10.9-06 | verified/expert-as-authority | Pulse/Guru verified, Blog expert | Medium/High | Trust label becomes proof/financial advice | `verified != authority_proof` |
| CMB-10.9-07 | likes/views-as-economic-fact | Blog views, docs reactions, Atlas reviews | High | Social metrics read as Points inputs | `likes/views != economic_fact` |
| CMB-10.9-08 | save/favorite-as-reward-signal | Pulse save, Guru save, docs reactions | Medium/High | Saved content becomes grant signal | `saved_content != reward_signal` |
| CMB-10.9-09 | recommendation-as-commission | Guru/RF/Rielt recommendation links | High | Recommendation can imply paid placement/commission | `Guru_recommendation != commission` |
| CMB-10.9-10 | mock-popularity-as-runtime | mock data, guide viewsCount placeholders | Critical | Fake popularity becomes trust/reward evidence | `mock_data != runtime_truth` |
| CMB-10.9-11 | NFT/reputation overlap | roadmaps Tokenomics/NFT badges | Critical | Content reputation becomes NFT ownership | `content_badge != NFT_ownership` |
| CMB-10.9-12 | screenshot-as-proof | content pages, event registration, share | High | Screenshot used as contribution/reward proof | `screenshot != proof` |
| CMB-10.9-13 | moderation-as-runtime | docs PRO/admin curation | Medium/High | Future moderation assumed live | `moderation_assumption != runtime_engine` |

## 8. Atlas/Pulse/Blog/Guru + Points Boundary

### Current reality

Broad Atlas/Pulse/Blog/Guru are not active Points producer networks.

Known active/narrow touchpoint:

```text
Content Service event registration
-> action: event_registration
-> amount: 20
-> optional /internal/points/add
```

This is internal-beta and narrow. It does not authorize:

- Points for every event view;
- Points for every Blog post;
- Points for Atlas place suggestions;
- Points for Guru recommendations;
- Points for likes/views/saves;
- creator rewards;
- curator commissions.

Required boundary:

```text
content_activity != Points_grant
likes_views_saves != economic_fact
recommendation_rank != payout
Blog_post != Points_producer
Atlas_entry != economic_fact
Guru_recommendation != commission
```

## 9. Atlas/Pulse/Blog/Guru + Layer 2 Boundary

Layer 2 can later use content/discovery signals as recognition inputs, but Stage 10.9 does not activate a badge/progression engine.

Allowed future candidates:

- useful guide approved by editors;
- trusted local recommendation;
- verified event organizer;
- curated route;
- featured author;
- community report accepted by moderators.

Forbidden current interpretations:

```text
recognition_signal != NFT_ownership
visibility != progression_authority
featured != economic_status
event_badge != user_badge_award
content_badge != NFT_ownership
```

Layer 2 remains off-chain identity/progression memory, and content modules are not badge authorities.

## 10. Atlas/Pulse/Blog/Guru + Connect Boundary

Connect may later project content summaries, but it must not become contribution authority.

Allowed projections:

- recent content activity summary;
- event registrations;
- saved places/events/posts;
- favorite topics;
- author/content visibility summaries;
- guide/event/blog recommendation history.

Forbidden meanings:

```text
Connect_content_projection != authority
content_stats != contribution_receipt
likes_views_totals != reward_balance
creator_summary != creator_income_statement
event_registration_summary != payout_history
```

Stage 10.9 passes this to Stage 10.11 as a strict MVP cutline input.

## 11. Mock / Future-only Register

| Surface | Risk | Current class | Required disposition |
|---|---|---|---|
| Atlas mock data / `MOCK DATA` badges | Mock places/countries look live | mock-only | keep inert; never use as proof |
| Atlas guide `viewsCount=1234` placeholder | Fake popularity/social proof | local placeholder | quarantine; replace with backend projection later |
| Atlas reviews tabs | Reviews/Points/Space assumptions | future placeholder | future-only; block MVP reward claims |
| Pulse roadmap Points/NFT rewards | Event reward promises | docs-only future | quarantine/future-only |
| Pulse local save/share/calendar | Saved event as proof | local UI projection | guard; save/share != proof |
| Pulse event badges | Verified/free/RF as awards | metadata projection | rename/scope later |
| Blog roadmap creator rewards | Creator economy illusion | docs-only future | blocked for Stage 10 |
| Blog `views` prop/reference | Views as reward metric | partial/nullable projection | mark projection; no reward use |
| Blog `isFeatured/isEditorPick/isPromoted` | Economic status overread | editorial projection | guard; not reward eligibility |
| Guru mock objects | Fake nearby popularity/trust | mock-only | keep inert/quarantine |
| Guru ranking reasons | Score as payout/ranking authority | recommendation projection | explain as ranking only |
| Guru docs Points/NFT rewards | Recommendation reward network | docs-only future | Stage 11+ only |
| NFT/token placeholders | Reputation ownership illusion | future-only | blocked for MVP |
| Creator economy placeholders | Monetization expectation | future-only | blocked for Stage 10 |

## 12. Abuse & Collapse Risk Register

| Risk | Surface/flow | Severity | Abuse path | Current mitigation | Required future mitigation |
|---|---|---|---|---|---|
| Likes/views as reward expectations | Blog/Guru/Atlas docs and counters | High | User expects Points for popularity | Runtime mostly lacks metrics | Add projection markers and no-reward copy |
| Creator dashboard as monetization | Blog docs/author pages | High | Author expects payout/income | No creator economy runtime | Docs quarantine |
| Top author/featured as payout eligibility | Blog editor picks, Guru rank | High | Ranking screenshot used for reward | Editorial flags only | Rank != reward guard |
| Verified/expert as authority proof | Pulse/Guru/Blog | Medium/High | User treats expert/verified as proof | Some labels only | Scope verification meaning |
| Content screenshot as contribution proof | Atlas/Blog/Pulse pages | High | Screenshot used as reward claim | No proof policy | Support rule: screenshot != proof |
| Recommendation as financial advice | Guru/Atlas/Blog | Medium/High | User treats recommendation as endorsed financial advice | Guru is aggregator | Add recommendation framing |
| Event attendance as economic fact | Pulse event registration | High | Registration screenshot becomes Points proof | Backend idempotency/Points row | Separate event registration from reward proof |
| Fake popularity | Mock counts/views/place ratings | Critical | Mock metrics treated live | Some `MOCK DATA` badges | Quarantine placeholders |
| Social proof inflation | Views/ranking/trending | Medium/High | Ranking manipulated for status | No broad social proof runtime | Define projection authority |
| Creator economy illusion | Blog/Guru/Pulse docs | Critical | Docs read as active payout system | Some docs are roadmap | Future-only register |
| NFT/reputation overlap | roadmaps Tokenomics/NFT | Critical | Badge/reputation read as NFT ownership | Stage 10 guardrails | Stage 11-only firewall |
| Recommendation as commission | Guru/RF/Rielt cards | High | PRO/RF expects commission | RF no-finance docs exist | Guru recommendation != commission |

## 13. Contribution MVP Cutline

### MVP-ready

MVP-ready as context/discovery layer:

- Atlas countries/cities/places read surfaces;
- Atlas guides/themes as content context;
- Pulse event discovery/list/detail;
- Blog post feed/detail as editorial content;
- Guru nearby/what-to-do as aggregator/recommendation projection;
- static/editorial labels if scoped as content metadata;
- navigation to RF/Rielt/Quest/Atlas/Pulse/Blog as discovery links.

### Internal-beta-only

- Pulse event registration with Points touchpoint;
- Guru ranking explanations and verified/RF boosts;
- Blog featured/editor pick/promoted flags;
- Atlas guide admin/write surfaces;
- save/share/favorite actions;
- views/likes/comments/reaction summaries;
- Connect content projections;
- content moderation/curation queues.

### Future-only

- creator economy;
- creator monetization;
- rewards for Blog authors/curators;
- Points for views/likes/saves;
- NFT content reputation;
- tokenized guide/reputation network;
- automated recommendation rewards;
- broad moderation/reputation engine;
- income, commission, payout, revenue sharing.

### Blocked

- Atlas/Pulse/Blog/Guru as Points faucet;
- Guru recommendation as commission;
- Blog post as active Points producer;
- Pulse event as payout surface;
- content badge as NFT ownership;
- screenshots as contribution proof;
- mock rankings as runtime truth.

### Dangerous until aligned

- docs "Points/NFT/G2A" reward language;
- "popular/top/best/trending" without projection marker;
- Blog "author/creator" language without monetization guard;
- Pulse "registered" and event attendance near Points;
- Guru "best/recommended" near RF/Rielt links;
- mock views/likes/popularity placeholders.

## 14. Implementation-Correction Backlog

This backlog is for Stage 10.12. Stage 10.9 does not implement it.

### Copy fixes

- Reframe creator/author language as editorial/content context, not creator monetization.
- Replace reward/earn/income wording in Atlas/Pulse/Blog/Guru docs with future-only guardrails.
- Scope verified/expert/curator labels: what was verified, who curated, what it does not prove.
- Reframe ranking/top/best/popular as recommendation/display sorting, not reward eligibility.
- Clarify Pulse event registration: activity registration, not payout promise.

### UI framing fixes

- Add projection markers for views/likes/saves/trending/popular where visible.
- Add recommendation framing in Guru: ranked nearby suggestion, not endorsement/commission.
- Add screenshot/share guardrails for content/event registration surfaces.
- Add event badge explanation: event metadata, not user badge award.
- Add "mock/demo" markers wherever placeholder content or counters can surface.

### Mock/future cleanup

- Quarantine mock rankings, fake views/likes, guide `viewsCount` placeholders.
- Mark NFT/token/creator economy docs as future-only/Stage 11+.
- Keep Blog creator rewards and Pulse NFT badges out of active MVP.
- Replace mock popularity with backend projection only when projection owner is clear.
- Keep moderation/reputation engine language as future-only unless runtime exists.

### Support/proof fixes

- Define support rule: screenshot of content/post/event/Guru rank is not proof.
- Define support rule: likes/views/saves are not contribution receipts.
- Define support rule: ranking/featured/editor pick is not reward eligibility.
- Define support rule: Pulse registration proof is service record; Points proof is Points Service record.
- Define support rule: recommendations are not financial/commission advice.

## 15. Recommended Follow-up Slices

### Stage 10.11 — MVP Economy Cutline

Pass forward:

- Atlas/Pulse/Blog/Guru are MVP-relevant only as context/discovery/contribution signal surfaces.
- Broad content rewards are blocked.
- Pulse event registration Points touchpoint is internal-beta and narrow.
- Guru recommendation/ranking remains projection-only.
- Blog/Atlas popularity metrics are not economic facts.

### Stage 10.12 — Implementation Readiness Plan

Pass forward:

- correction backlog in section 14;
- docs vocabulary guardrails;
- projection markers;
- mock/future cleanup;
- OpenAPI/SDK descriptions;
- support/proof rules.

### Stage 11 — Externalization / Gateway Baseline

Defer:

- content tokenization;
- NFT reputation;
- creator economy;
- revenue sharing;
- payout/settlement;
- G2A/token rewards;
- external ownership/marketplace semantics.

## 16. Multi-Agent Review Synthesis

| Role | Stage 10.9 assessment |
|---|---|
| ИИ-архитектор | Atlas/Pulse/Blog/Guru should be embodied as context and signal surfaces, not reward authority; Guru rank and content metrics must remain projections. |
| ИИ-аналитик | Product risk is producer illusion: docs and labels promise creator/content rewards that runtime does not broadly support. |
| ИИ-бэкенд-разработчик | Content Service has public read APIs and a narrow event registration Points call; Guru is an aggregator/ranker, not a producer. |
| ИИ-фронтенд-разработчик | UI risk concentrates in event badges, save/share, guide popularity placeholders, Blog featured flags and Guru "best/recommended" framing. |
| ИИ-тестировщик | QA proof risks are screenshot-as-proof, likes/views-as-economic-fact, event registration-as-payout and mock popularity-as-runtime. |
| ИИ-специалист по безопасности | Abuse paths center on fake popularity, creator monetization expectations, NFT/reputation overlap and recommendation-as-commission. |
| ИИ-технический писатель | Stage 10.9 must separate contribution signals from reward grants and pass a correction-ready backlog into Stage 10.12. |

## 17. Guardrails Reconfirmed

Inherited guardrails:

```text
token != money
NFT != receipt
badge != NFT_mint
Points != payout_system
Wallet != financial_wallet
Dashboard != receipt
ActivityFeed != audit_trail
projection != authority
summary != proof
preview != grant
mock_data != runtime_truth
future_only != launch_ready
screenshot != proof
slice_16_status = blocked_not_triggered
```

Stage 10.9 guardrails:

```text
content_contribution != reward_grant
Atlas_entry != economic_fact
Pulse_event != payout
Blog_post != Points_producer
Guru_recommendation != commission
curation != reward_authority
visibility != income
recommendation != payout
content_badge != NFT_ownership
content_projection != authority
creator_visibility != monetization
likes/views != economic_fact
saved_content != reward_signal
mock_contribution != runtime_truth
event_badge != user_badge_award
ranking != payout
featured != economic_status
Connect_content_projection != authority
```

## 18. Final Verdict

```text
stage_10_9_status: completed_as_docs_first_contribution_model_audit
contribution_role_model_defined: true
creator_economy_runtime_present: false
active_points_producers_present: true_narrow_event_registration_only
content_reward_runtime_present: false_broad_rewards_absent
atlas_pulse_blog_guru_runtime_maturity: medium
content_projection_risk: high
creator_economy_illusion_risk: high
mock_popularity_runtime_truth_risk: critical
nft_reputation_overlap_risk: critical_in_docs
event_registration_points_boundary_risk: high
guru_recommendation_commission_risk: high
likes_views_economic_fact_risk: high
contribution_mvp_ready_as_context_layer: true
contribution_mvp_ready_as_creator_economy: false
implementation_correction_backlog_created: true
recommended_next_slice: Stage_10_11_MVP_Economy_Cutline
recommended_implementation_slice: Stage_10_12_Implementation_Readiness_Plan
recommended_externalization_slice: Stage_11_Externalization_Gateway_Baseline
slice_16_status: blocked_not_triggered
```

Human conclusion:

Atlas/Pulse/Blog/Guru are ready to be treated as a content/discovery/contribution context layer. They are not ready to be treated as creator economy, reward marketplace, broad Points producer network, NFT reputation layer or monetization system. The runtime is strongest for Content Service read APIs, Pulse event registration and Guru nearby aggregation; the main remaining risks are docs/future language, mock popularity, social metrics and recommendation labels that can make projections look like rewards or authority. Stage 10.9 closes this as a docs-first contribution model audit and sends a practical correction backlog to Stage 10.12 before the Stage 10.11 MVP cutline.
