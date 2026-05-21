# Stage 10.11 — MVP Economy Cutline

Документ: `stage_10_11_mvp_economy_cutline_v1.md`  
Статус: docs-first cutline synthesis, implementation-readiness input  
Дата: 2026-05-21  
Scope: MVP economy boundary across Layer 1 Points, Layer 2 badges/progression, Space, Quest, RF, Rielt, Atlas/Pulse/Blog/Guru, Connect, Home/mock/future-only clusters  
Mode: read-only synthesis; no implementation; no frontend/backend/API/OpenAPI/SDK/schema changes; no tests; no rollout; no creator economy; no NFT/G2A/on-chain; no booking/payment; no new producers; no progression engine; no Slice 16 movement

## 1. Executive Summary

Stage 10.11 defines a bounded MVP economy.

It is not:

- feature wishlist;
- roadmap fantasy;
- token/NFT/G2A gateway;
- creator economy launch;
- booking/payment layer;
- payout/settlement layer;
- monetization system;
- proof/export system.

MVP economy means:

```text
runtime_safe_enough
+ projection_safe_enough
+ support_safe_enough
+ vocabulary_safe_enough
+ mock_quarantined_enough
```

Honest cutline:

- MVP core can include bounded internal Points, Quest delivery intent, RF voucher utility, Connect projection hub, off-chain badge reads/projections, Rielt discovery/inquiry, and Atlas/Pulse/Blog/Guru context/discovery.
- Several working paths are **internal-beta-only**, not public claims: `quest_completed`, `event_registration`, RF Points spend/compensation, internal badge award endpoint, paid RF claims, richer Connect/RF/Rielt projections.
- Space is MVP-safe as social/content context only, not an economy producer.
- Layer 2 is MVP-safe as off-chain badge catalog/user-badge read projection only, not progression/NFT/ownership.
- Creator economy, NFT/G2A, booking/payment, investment/tokenization, moderation/reputation runtime, social reward systems and recommendation payouts are outside MVP.

Expected public posture:

```text
MVP economy exists
but is bounded
internal
projection-safe
contribution-aware
not tokenized
not monetized
not payout-oriented
not booking/payment
```

## 2. Why Stage 10.11 Exists

Stage 10.1–10.10 established:

- surface topology;
- producer reality;
- contribution semantics;
- delivery-intent semantics;
- Layer 2 off-chain semantics;
- Connect as projection hub;
- RF as voucher utility lifecycle;
- Rielt as listing/discovery/inquiry;
- Atlas/Pulse/Blog/Guru as context/contribution signal layer;
- UX vocabulary firewall;
- proof-class doctrine.

Without Stage 10.11, MVP can drift back into:

- mock economy;
- creator rewards;
- NFT/token promises;
- booking/payment implications;
- payout/cashback language;
- fake proof through screenshots;
- projection-as-authority collapse.

Stage 10.11 exists to answer:

```text
what can be shown honestly?
what can be supported?
what has clear authority?
what is safe to publicly claim?
```

It intentionally does not answer:

```text
what would be exciting?
what could be implemented later?
what is strategically attractive?
```

## 3. MVP Economy Philosophy

### What MVP economy means

MVP economy is the smallest honest internal economy surface that can be:

- explained to users without overclaiming;
- backed by runtime authority;
- projected in Connect without becoming a receipt;
- supported without relying on screenshots;
- limited to internal/off-chain meaning;
- separated from token/NFT/financial semantics.

### What MVP economy is not

```text
MVP_ready != fully_complete
internal_beta != public_claim
future_only != hidden_runtime
blocked != temporary_UI_copy
creator_economy != MVP
NFT_G2A != MVP
booking_payment != MVP
likes_views != economic_fact
ranking != payout
event_badge != user_badge_award
content_contribution != reward_grant
mock_surface != MVP_surface
projection != support_receipt
```

### Authority/projection doctrine

| Term | MVP meaning | Not equal to |
|---|---|---|
| `economic_fact` | Points Service row or approved backend fact | UI screenshot |
| `activity_fact` | Domain action row such as event registration or quest completion | reward proof |
| `delivery_intent` | Quest outbox / delivery pipeline | receipt |
| `projection` | Connect/Wallet/Dashboard/ActivityFeed read surface | authority |
| `summary` | Aggregated explanation | proof |
| `preview` | User-facing expectation/eligibility hint | grant |
| `mock` | Demo/local/test data | runtime truth |

### Contribution doctrine

```text
activity_fact
-> contribution_signal
-> reward_candidate
-> anti_abuse_policy
-> future producer approval
-> economic_fact
```

Stage 10.11 allows the first two as context/signals. It does not allow shortcuts from content/likes/views/ranking directly to rewards.

### Layer 1 and Layer 2 doctrine

Layer 1:

```text
Points = internal off-chain engagement/contribution accounting
Points != money
Points != payout
Points != custody balance
```

Layer 2:

```text
badge/progression = off-chain identity/recognition memory
badge != NFT_mint
badge != wallet asset
badge != receipt
rarity != financial value
```

## 4. Economy Layer Cutline

### Layer 1 — Points

MVP-ready:

- Points Service idempotent `add`/read core;
- `auth-service` registration producer;
- `referral-service` `referral_locked`;
- Connect/Wallet read projections of Points rows when source is backend-backed.

Internal-beta-only:

- `auth-service` `first_login`;
- `quest-service` `quest_completed` through reward outbox;
- `content-service` `event_registration`;
- RF `rf_voucher_claim_spend`;
- RF spend compensation/recovery;
- ActivityFeed/TransactionList labels for cross-domain actions.

Future-only:

- broad Atlas/Pulse/Blog/Guru contribution rewards;
- Space post/reaction/comment/save rewards;
- network accrual levels;
- G2A/token rewards;
- NFT/on-chain rewards.

Blocked:

- Points as payout/cashback/settlement;
- token-service health as producer evidence;
- bridge/external wallet/withdraw/top-up;
- receipt/export proof system;
- screenshot as Points proof.

Dangerous until aligned:

- Home static reward list;
- Connect `Начислено Points` screenshots;
- Quest local totals;
- Guru reward strings;
- referral bonus/unlock/network vocabulary;
- RF claim/redeem as reward vocabulary.

### Layer 2 — Badges / Progression

MVP-ready:

- active badge catalog read;
- current user's badge awards read;
- Connect Levels as badge projection;
- Dashboard recent badge summaries if backed by `user_badges`.

Internal-beta-only:

- internal badge award endpoint;
- sourceType/sourceId idempotency;
- `badge_awarded` labels if backed by real badge rows;
- badge cards with "Получен" state;
- first_quest_completed/first_space_post catalog/empty hints.

Future-only:

- Quest -> Badge activation;
- Space -> Badge activation;
- progression/level/XP engine;
- rarity authority beyond metadata;
- collection/totem/tablet layer;
- reputation scoring;
- badge share verification;
- NFT/on-chain export.

Blocked:

- badge mint activation;
- NFT ownership claims;
- badge as wallet asset;
- badge as receipt;
- rarity as financial value;
- local/mock `earnedAt` as award fact.

Dangerous until aligned:

- `NFTBadge` naming;
- Space `NFTView`;
- Quest local badge requirements;
- Connect legacy NFT types;
- Home static badge counts;
- Guru/Atlas/Pulse badge vocabulary.

### Space

MVP-ready:

- Space as social/content/activity surface;
- posts, comments, reactions as social facts/projections;
- contribution context only;
- no Space-owned wallet/balance/ledger.

Internal-beta-only:

- activity projections with likes/reposts;
- profile/social capital language;
- cross-module Quest/RF/Atlas/Pulse/Blog references;
- organizer/community context.

Future-only:

- Points for posts, likes, reposts, comments, saved posts;
- weekly goals with Points;
- Space-powered badge awards;
- reputation progression;
- guide-like contribution rewards;
- accepted-answer rewards.

Blocked:

- Space active Points producer;
- Space-owned Points balance;
- Space-owned transaction ledger;
- Space-owned reward history;
- Space-owned NFT ownership;
- Space wallet/bridge/marketplace.

Dangerous until aligned:

- legacy BalanceView;
- legacy transaction rows;
- legacy NFTView;
- legacy Quests/Vouchers/Referrals mock economy;
- mock recommendations and weekly goals with points.

### Quest

MVP-ready:

- published Quest catalog;
- Quest detail and runner;
- progress and step submissions;
- manual/space_post pending review;
- Quest completion as activity fact;
- reward outbox as delivery intent;
- Points Service integration for bounded `quest_completed`.

Internal-beta-only:

- PRO draft/review console;
- outbox stats/failed/requeue views;
- Connect ActivityFeed Quest projections;
- Quest reward previews;
- Space proof steps with higher-value rewards;
- manual review workflows beyond owner-scoped queue.

Future-only:

- Quest -> Badge awards;
- Quest progression engine;
- no-hint/speed/streak rewards;
- seasonal progression rewards;
- Space report contribution rewards;
- RF voucher rewards embedded in Quest;
- NFT/G2A/token quest rewards.

Blocked:

- Quest as wallet;
- Quest as payout/settlement engine;
- Quest as badge authority;
- Quest as receipt system;
- local calculation as Points authority;
- new Quest producers beyond bounded `quest_completed`.

Dangerous until aligned:

- `NFTBadge` vocabulary;
- `PointsDisplay` local animation;
- `CompletedQuestCard` local totals;
- mockQuest reward/badge data;
- reward copy without Connect/Points authority link.

### RF

MVP-ready:

- public partner catalog;
- public offer catalog;
- offer detail and partner detail as discovery;
- authenticated voucher claim for active offers;
- My Vouchers as RF-owned read-only lifecycle projection;
- basic voucher status labels with utility framing;
- Rielt listing handoff to RF with no booking/payment proof;
- PRO Rewards boundary page as non-financial notice.

Internal-beta-only:

- paid voucher Points spend/cost semantics;
- Points compensation/recovery semantics;
- entitlement preview / premium access preview;
- merchant voucher activity summary;
- partner-side redeem UI;
- PRO attributed vouchers display;
- Connect RF milestones/narrative/progress;
- listing-scoped claim for Rielt objects.

Future-only:

- RF `Rewards later`;
- Totem/NFT;
- G2A/token reward;
- external wallet/bridge;
- partner payout/settlement exports;
- PRO commission dashboards;
- financial reconciliation reports.

Blocked:

- RF as cashback system;
- RF as payout system;
- RF as settlement layer;
- RF voucher as payment receipt;
- merchant dashboard as financial statement;
- PRO attribution as commission;
- screenshots/share cards as proof.

Dangerous until aligned:

- "Получено через PRO";
- "RF-прогресс";
- "Использованные преимущества";
- "Points подтверждены";
- merchant metric cards without non-financial framing;
- status/timeline rows without proof boundary.

### Rielt

MVP-ready:

- public listing search/list/detail;
- price display as informational listing data;
- map/list discovery with privacy-aware location precision;
- inquiry submission as contact request;
- owner/contact context;
- RF handoff if boundary copy remains;
- PRO/curator verification as trust signal with guardrails.

Internal-beta-only:

- inquiry list/status;
- favorites/saves;
- views/saves metrics;
- availability/calendar;
- fast-response/ready-to-move filters;
- RF listing-scoped voucher claim;
- seed presentation overlay for RF/PRO labels;
- owner listing management;
- sale listing type;
- deposit/prepayment display.

Future-only:

- booking engine;
- payment collection;
- reservation confirmation;
- owner/agent settlement;
- investment listings;
- rental income/yield analytics;
- tokenomics/Points/NFT/G2A integrations;
- property tokenization.

Blocked:

- Rielt as payment platform;
- Rielt as booking confirmation authority;
- Rielt as investment platform;
- Rielt listing as NFT/ownership asset;
- `verifiedBooking` as runtime proof;
- mock listings as live inventory;
- screenshots/share cards as proof;
- Rielt activity as Points producer.

Dangerous until aligned:

- `verifiedBooking`;
- instant booking vocabulary;
- inquiry success without non-booking reminder;
- RF voucher count;
- price + deposit/prepayment without informational framing;
- docs investors/rewards/Tokenomics language.

### Atlas / Pulse / Blog / Guru

MVP-ready:

- Atlas countries/cities/places read surfaces;
- Atlas guides/themes as context;
- Pulse event discovery/list/detail;
- Blog post feed/detail as editorial content;
- Guru nearby/what-to-do as aggregator/recommendation projection;
- navigation among modules as discovery links.

Internal-beta-only:

- Pulse event registration with Points touchpoint;
- Guru ranking explanations and verified/RF boosts;
- Blog featured/editor pick/promoted flags;
- Atlas guide admin/write surfaces;
- save/share/favorite actions;
- views/likes/comments/reaction summaries;
- Connect content projections;
- content moderation/curation queues.

Future-only:

- creator economy;
- creator monetization;
- rewards for Blog authors/curators;
- Points for views/likes/saves;
- NFT content reputation;
- tokenized guide/reputation network;
- automated recommendation rewards;
- broad moderation/reputation engine;
- revenue sharing.

Blocked:

- Atlas/Pulse/Blog/Guru as Points faucet;
- Guru recommendation as commission;
- Blog post as active Points producer;
- Pulse event as payout surface;
- content badge as NFT ownership;
- screenshots as contribution proof;
- mock rankings as runtime truth.

Dangerous until aligned:

- docs Points/NFT/G2A reward language;
- popular/top/best/trending without projection markers;
- creator/author monetization wording;
- Pulse registration near Points without boundary;
- Guru recommendation near RF/Rielt links;
- mock views/likes/popularity placeholders.

### Connect

MVP-ready:

- Connect as projection hub;
- Wallet as internal Points read projection;
- TransactionList as paginated Points read projection;
- ActivityFeed as recent Points preview;
- Levels as badge catalog/user badge projection;
- referral status/Points projection;
- RF section as read-only RF projection if framed correctly.

Internal-beta-only:

- wallet bucket interpretation;
- Dashboard badge/referral/RF totals;
- ActivityFeed labels for cross-domain actions;
- RF voucher timeline inside Dashboard;
- referral share/copy UX;
- `badge_awarded` activity label;
- Dashboard "progress" language.

Future-only:

- progression engine;
- XP/levels/multipliers;
- Connect-owned missions;
- G2A token wallet;
- NFT ownership/collection;
- bridge/top-up/withdraw;
- support-grade receipt/export;
- account statement/audit trail;
- badge share verification.

Blocked:

- Connect as economic authority;
- Connect Wallet as financial wallet/custody;
- Dashboard as receipt/account statement;
- ActivityFeed as audit trail;
- mock transactions as ledger facts;
- NFT/G2A/Bridge activation;
- payout/settlement/cashback claims.

Dangerous until aligned:

- `Wallet` route/component naming;
- `History`, `transaction`, `ledger` wording near support contexts;
- Dashboard total Points/badges screenshots;
- legacy NFT/G2A/level/achievement data;
- RF/referral summaries without non-payout framing.

## 5. Surface-by-Surface MVP Matrix

| Surface | Runtime class | Proof class | Authority owner | MVP class | Public-claim safe? | Main risk | Required guardrail |
|---|---|---|---|---|---|---|---|
| Points Service add/read | production-shaped | economic_fact | Points Service | MVP-ready | Yes, internal Points only | payout overread | Points != money/payout |
| Auth registration Points | production-shaped | economic_fact | Auth + Points | MVP-ready | Yes with internal wording | signup bonus overclaim | internal Points only |
| Referral locked Points | production-shaped | economic_fact | Referral + Points | MVP-ready | Yes with guardrails | referral income | referral_locked != payout |
| Quest completed Points | production-shaped + outbox | delivery_intent -> economic_fact | Quest + Points | internal-beta-only | No public broad claim | completion screen as proof | Connect/Points authority only |
| RF basic voucher claim | production-shaped | voucher_lifecycle_fact | RF Service | MVP-ready | Yes as utility | cashback/payment | RF voucher != payment |
| RF paid Points spend | production-shaped/bounded | Points trace + RF fact | RF + Points | internal-beta-only | No broad claim | payment receipt | spend != payment |
| Pulse event registration | production-shaped/bounded | activity_fact + optional Points | Content + Points | internal-beta-only | No broad claim | attendance/payout | registration != attendance |
| Badge catalog/user badges | production-shaped read | badge_projection | Badge Service | MVP-ready | Yes as off-chain badges | NFT overlap | badge != NFT |
| Badge award endpoint | backend/internal | badge_fact | Badge Service | internal-beta-only | No | unauthorized producer expansion | allowlist/source policy |
| Connect Wallet | production-shaped projection | Points projection | Connect over Points | MVP-ready | Yes as internal overview | financial wallet | Wallet != financial_wallet |
| Connect Dashboard | projection | summary | Connect | internal-beta-only | Limited | receipt/statement | Dashboard != receipt |
| ActivityFeed | projection | recent activity projection | Connect | internal-beta-only | Limited | audit trail | ActivityFeed != audit_trail |
| Connect Levels | projection | badge projection | Connect over badges | MVP-ready | Yes with wording | progression engine illusion | Levels = badge projection |
| RF Connect section | projection | RF summary | Connect over RF | internal-beta-only | No public proof claim | payout report | projection != proof |
| Rielt listing search/detail | production-shaped | listing_projection | Rielt Service | MVP-ready | Yes | booking/payment | listing != booking |
| Rielt inquiry | production-shaped | inquiry_fact | Rielt Service | MVP-ready | Yes with copy | reservation proof | inquiry != booking |
| Rielt RF handoff | bounded bridge | handoff projection | Rielt/RF | MVP-ready/internal-beta | Limited | payment/booking | RF handoff != settlement |
| Atlas places/guides | production-shaped read | content_context_fact | Content Service | MVP-ready | Yes | reward/token docs | context only |
| Pulse event browse | production-shaped read | event_projection | Content Service | MVP-ready | Yes | event badge as award | event_badge != user_badge |
| Blog feed/detail | production-shaped read | editorial_projection | Content Service | MVP-ready | Yes | creator economy docs | author != monetization |
| Guru nearby/what-to-do | aggregator | recommendation_projection | Guru over sources | MVP-ready | Yes as discovery | recommendation/commission | recommendation != payout |
| Space social posts | production/partial social | social_activity | Space/Reactions | MVP-ready as social | Yes, non-economy | producer illusion | Space != Points producer |
| Space mock balances/NFT | mock-only | local_mock_UI_only | none | blocked | No | mock as economy | quarantine |
| Quest local reward totals | local/mock | preview/local estimate | none | dangerous-until-aligned | No | preview as grant | preview != grant |
| Home static rewards | static/mock | local_mock_UI_only | none | blocked/dangerous | No | fake reward evidence | remove/quarantine later |
| Connect mock analytics/missions | mock-only | local_mock_UI_only | none | blocked | No | fake producers | mock != runtime_truth |
| NFT/G2A/Bridge tabs | legacy/future UI | future_placeholder | none | future-only/blocked if active | No | activation illusion | Stage 11+ only |

## 6. Producer Cutline

### Active producers allowed in MVP

Publicly safe only as internal Points, not money:

- `points-service` idempotent `add`/read core;
- `auth-service` `registration`;
- `referral-service` `referral_locked`.

### Internal-beta producers

Working or bounded, but not safe as broad public claim:

- `auth-service` `first_login`;
- `quest-service` `quest_completed`;
- `content-service` `event_registration`;
- `rf-service` `rf_voucher_claim_spend`;
- `rf-service` `rf_voucher_claim_spend_compensation`;
- Badge Service internal award operation.

Important:

```text
event_registration = only_content_module_bounded_producer
```

### Future-only producers

- Space post/reaction/comment/save rewards;
- broad Atlas/Pulse/Blog/Guru contribution rewards;
- Blog author/curator rewards;
- Guru recommendation/check-in rewards;
- Quest badge/progression rewards;
- network accrual;
- G2A/token rewards;
- NFT/on-chain rewards.

### Forbidden producers

- payouts;
- cashback;
- settlement;
- commissions;
- booking/payment confirmations;
- screenshots/export proofs;
- token bridge/wallet flows;
- mock rows;
- UI previews;
- docs-only roadmaps;
- Slice 16.

## 7. Vocabulary Cutline

### MVP-safe vocabulary

- internal Points;
- voucher utility;
- off-chain badge;
- catalog;
- activity;
- inquiry;
- listing;
- event registration;
- content context;
- recommendation;
- projection;
- read-only summary;
- participation summary;
- verified, if scoped;
- editor pick, if scoped.

### Internal-beta-only vocabulary

- transaction;
- wallet;
- progress;
- reward preview;
- Points required;
- Points confirmed;
- badge awarded;
- PRO attribution;
- RF timeline;
- event registration Points;
- ranking/top/popular;
- paid voucher.

### Future-only vocabulary

- progression engine;
- XP;
- levels/multipliers;
- creator economy;
- reputation;
- tokenomics;
- G2A;
- NFT;
- bridge;
- external wallet;
- marketplace;
- token reward;
- ownership export.

### Forbidden for MVP vocabulary

- payout;
- settlement;
- cashback;
- commission;
- income;
- earn money;
- payment;
- booking confirmation;
- receipt;
- custody balance;
- investment yield;
- NFT ownership;
- mint;
- withdraw;
- top-up;
- creator monetization;
- reward marketplace.

## 8. Mock / Future-only Quarantine Register

| Mock/future surface | Risk | Current visibility | Quarantine status | MVP status | Future status |
|---|---|---|---|---|---|
| Home `userRewards` static rows | Fake reward facts | visible/static | not fully quarantined | blocked | replace/remove in 10.12 |
| Connect `mockData.ts` transactions | Fake ledger | internal/mock but dangerous | not fully quarantined | blocked | demo-only with marker |
| Connect analytics/missions | Fake producer/leaderboard | mock | not MVP | blocked | future after backend |
| Space Balance/NFT/Transactions | Live economy illusion | legacy/mock | must quarantine | blocked | future only after authority |
| Quest mock rewards/NFTBadge | Preview as grant | mock/local | partial guardrails | dangerous | rename/quarantine |
| RF mock PRO rewards | Commission illusion | mock/internal | partial guardrails | blocked for public | future non-financial |
| Rielt mock reviews/verifiedBooking | Booking proof illusion | mock/dead code | must quarantine | blocked | rename later |
| Rielt seed overlay RF/PRO | Seed as truth | internal-beta | needs markers | dangerous | backend projection later |
| Atlas guide `viewsCount` placeholders | Fake popularity | visible in some layouts | not fully quarantined | dangerous | backend projection later |
| Pulse mock UGC/event data | Fake attendance/social proof | partial | needs markers | dangerous | backend later |
| Blog roadmap creator rewards | Runtime promise illusion | docs | future-only marker needed | future-only | Stage 11+ |
| Guru mock Points/NFT strings | Reward/NFT illusion | mock/dev | quarantine | blocked | preview-only if upstream |
| NFT/G2A/Bridge UI | Externalization illusion | legacy/future | future-only | blocked | Stage 11/12 |
| Module docs tokenomics | AI/user overread | docs | future-only marker needed | future-only | Stage 11+ |

## 9. Public Claim Boundaries

### Safe to say on landing pages

- Go2Asia has an internal off-chain Points layer for selected actions.
- Users can see internal Points and off-chain badges in Connect.
- Quest can deliver internal rewards after backend confirmation.
- RF provides voucher utility lifecycle, not cashback.
- Rielt helps discover listings and send inquiries, not book/pay.
- Atlas/Pulse/Blog/Guru provide context, events, articles and nearby recommendations.

### Safe to show in demos

- Connect read-only Points overview with internal wording.
- Badge catalog/user badges as off-chain recognition.
- Quest flow with preview + backend confirmation boundary.
- RF voucher claim/redeem utility with no payout wording.
- Rielt listing/inquiry with no booking/payment claim.
- Atlas/Pulse/Blog/Guru discovery/context surfaces.

### Not safe to publicly claim

- creator economy;
- rewards for likes/views/saves/posts/articles/guides;
- NFT/G2A/token rewards;
- booking/payment/settlement;
- payout/cashback/commission;
- investment/yield;
- wallet custody;
- support-grade receipts;
- ranking-based rewards;
- event attendance proof from registration;
- badge/NFT ownership.

### Not safe in marketing until 10.12 cleanup

- "Wallet" without internal/non-financial framing;
- "transaction history" as receipt-like copy;
- "RF progress";
- "earned rewards";
- "top contributors";
- "creator rewards";
- "verified" without scope;
- screenshots/share cards as proof.

## 10. Support & Proof Boundaries

Support must never treat these as proof:

```text
screenshot != proof
Dashboard != receipt
ActivityFeed != audit_trail
Wallet != custody
projection != support_receipt
summary != proof
preview != grant
mock_data != runtime_truth
```

Specific boundaries:

| Claim | Support truth source | Not proof |
|---|---|---|
| Points grant | Points Service row / producer externalId | screenshot, dashboard total |
| Quest reward | Quest outbox + Points row | completion page/local total |
| Event registration | Content Service registration row | attendance, calendar export |
| Pulse Points | Points Service `event_registration` row | event badge/screenshot |
| RF voucher | RF voucher row/status | listing screenshot, Connect summary |
| RF Points spend | Points row + RF claim context | payment receipt |
| Rielt inquiry | Rielt inquiry row | booking/reservation |
| Rielt listing | Rielt listing record | ownership/payment |
| Badge award | Badge Service `user_badges` row | local earnedAt/NFTBadge |
| Content contribution | future approved pipeline | likes/views/share screenshot |
| Guru ranking | Guru response/source refs | commission/payout |
| Connect projection | underlying service row | projection itself |

## 11. Implementation Readiness Dependencies

Stage 10.12 should convert this cutline into implementation work, without activating Stage 11.

### Copy fixes

- Internal/non-financial Points wording.
- Wallet/Dashboard/ActivityFeed proof boundaries.
- RF voucher utility / no cashback / no payout.
- Rielt inquiry/listing no booking/payment.
- Pulse registration no attendance/payout proof.
- Guru ranking/recommendation no commission.
- Blog/Atlas/Guru creator/reward docs future-only.
- Badge/NFT naming cleanup.

### UI framing fixes

- Projection markers and source links.
- Freshness/as-of labels for Connect/RF/Rielt projections.
- Preview markers for Quest/Guru rewards.
- Mock/demo banners where data is not runtime.
- Screenshot/share disclaimers.
- Verified label scope.

### Mock cleanup

- Quarantine Home static rewards.
- Quarantine Connect mock transactions/analytics/missions.
- Quarantine Space economy mocks.
- Quarantine Rielt `verifiedBooking`.
- Quarantine Guru Points/NFT mock strings.
- Quarantine Atlas/Pulse mock popularity/UGC.

### API/OpenAPI/SDK wording

- Mark `event_registration` as bounded content producer.
- Mark broad content actions as future-only/policy-only.
- Clarify RF paid spend semantics.
- Clarify Rielt inquiry/listing semantics.
- Clarify Guru recommendation projection.
- Clarify badge read/award boundaries.

### Runtime and anti-abuse dependencies

- Producer allowlist and source policies.
- Event registration anti-abuse and attendance separation.
- Badge producer allowlist.
- RF spend/compensation support trace.
- Quest outbox replay/requeue operator boundaries.
- Reactions/likes/views not direct producers.
- Support lookup rules by IDs, not screenshots.

## 12. Recommended Post-MVP Deferrals

Explicitly deferred:

- creator economy;
- content monetization;
- author/curator payouts;
- NFT/G2A/token activation;
- external wallet/bridge;
- booking/payment;
- investment/property tokenization;
- moderation/reputation runtime;
- advanced progression/XP/levels;
- social reward systems;
- recommendation payouts/commissions;
- support-grade receipts/exports;
- marketplace/trading;
- Slice 16.

## 13. Multi-Agent Review Synthesis

| Role | Stage 10.11 assessment |
|---|---|
| ИИ-архитектор | MVP economy is valid only as bounded off-chain internal economy with Connect projections and clear authority boundaries. |
| ИИ-аналитик | Public claims must be smaller than product ambition: show what is safe, not everything that exists in docs. |
| ИИ-бэкенд-разработчик | Producer cutline is narrow: registration/referral core are MVP-ready; Quest/RF/content producers are internal-beta; broad content/Space producers are future-only. |
| ИИ-фронтенд-разработчик | UI cutline must quarantine mock economy, NFT/G2A tabs, local reward totals, and proof-shaped screenshots before public demos. |
| ИИ-тестировщик | QA cutline centers on proof-class boundaries: screenshot, dashboard, activity feed, registration, voucher and listing surfaces are not proof. |
| ИИ-специалист по безопасности | Unsafe claims are creator economy, payout/cashback/commission, NFT/token, booking/payment, and social metric farming. |
| ИИ-технический писатель | Stage 10.11 should become the canonical source for MVP-safe vocabulary, public claims, producer classes and 10.12 dependencies. |

## 14. Guardrails Reconfirmed

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

Stage 10.11 guardrails:

```text
MVP_ready != fully_complete
internal_beta != public_claim
future_only != hidden_runtime
blocked != temporary_UI_copy
creator_economy != MVP
NFT_G2A != MVP
booking_payment != MVP
likes_views != economic_fact
ranking != payout
event_badge != user_badge_award
content_contribution != reward_grant
mock_surface != MVP_surface
projection != support_receipt
```

## 15. Final Verdict

```text
stage_10_11_status: completed_as_docs_first_mvp_cutline
mvp_economy_bounded: true
mvp_economy_runtime_safe: medium_high
mvp_economy_projection_safe: medium
mvp_economy_support_safe: medium
mvp_economy_semantic_safety: medium_high_if_10_12_backlog_done
layer1_mvp_status: mvp_ready_core_internal_beta_extensions
layer2_mvp_status: mvp_ready_as_offchain_read_projection_only
space_mvp_status: mvp_ready_as_social_context_not_economy
quest_mvp_status: mvp_ready_as_delivery_intent_internal_beta_for_ops
rf_mvp_status: mvp_ready_as_voucher_utility_internal_beta_for_paid_spend_and_pro
rielt_mvp_status: mvp_ready_as_listing_discovery_inquiry_internal_beta_for_rf_handoff_and_verification
atlas_pulse_blog_guru_mvp_status: mvp_ready_as_context_discovery_internal_beta_for_event_registration_and_ranking
connect_mvp_status: mvp_ready_as_projection_hub_internal_beta_for_rich_summaries
creator_economy_included_in_mvp: false
NFT_G2A_included_in_mvp: false
booking_payment_included_in_mvp: false
payout_settlement_included_in_mvp: false
mock_clusters_fully_quarantined: false
largest_remaining_mvp_risk: mock_and_vocabulary_surfaces_can_still_look_like_runtime_economy
required_stage_10_12_priority: copy_framing_mock_quarantine_support_proof_rules_openapi_wording
recommended_next_slice: Stage_10_12_Implementation_Readiness_Plan
slice_16_status: blocked_not_triggered
```

Human conclusion:

Go2Asia has a real MVP economy, but only if it stays bounded: internal Points, Quest delivery intent, RF utility, Connect projection, off-chain badge reads, Rielt discovery/inquiry and content/discovery context. The MVP must not claim creator economy, token/NFT economy, booking/payment, monetization, payout, settlement or social rewards. The biggest remaining risk is not missing architecture, but overclaiming through UI copy, docs language, mock data and proof-shaped projections. Stage 10.12 must turn this cutline into concrete copy, UI framing, mock quarantine, support rules and API wording tasks before broad public claims.
