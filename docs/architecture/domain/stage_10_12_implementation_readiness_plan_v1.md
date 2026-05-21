# Stage 10.12 — Implementation Readiness Plan

Документ: `stage_10_12_implementation_readiness_plan_v1.md`  
Статус: docs-first implementation-readiness planning synthesis  
Дата: 2026-05-21  
Scope: hardening backlog for bounded MVP economy after Stage 10.11  
Mode: read-only planning; no implementation; no UI/backend/API/OpenAPI/SDK/schema changes; no migrations; no tests; no rollout; no staging/live evidence; no producer activation; no creator economy; no NFT/G2A/on-chain; no booking/payment; no progression engine; no Quest -> Badge activation; no Stage 11 work; no Slice 16 movement

## 1. Executive Summary

Stage 10.11 defined that Go2Asia already has a bounded internal MVP economy.

Stage 10.12 defines what must be hardened before that economy can be production-safe enough for public MVP claims.

This document does not implement anything. It creates an implementation-readiness backlog.

Main finding:

```text
mvp_economy_defined = true
mvp_economy_implementation_ready = incomplete
main_remaining_risk = mock_vocabulary_projection_collapse
```

The strongest hardening needs are:

- copy and vocabulary firewall;
- UI projection framing;
- mock/future-only quarantine;
- support/proof lookup policy;
- OpenAPI/SDK wording corrections;
- producer boundary enforcement;
- Connect/RF/Quest projection hardening;
- module-specific guardrails for Space, Quest, RF, Rielt and content/discovery modules.

Stage 10.12 converts doctrine into a prioritized hardening plan:

- **P0 — MVP blockers**: public MVP unsafe until resolved.
- **P1 — strongly recommended before public beta**: not always blocking internal MVP, but likely to create disputes, confusion or stale expectations.
- **P2 — post-MVP hardening**: can wait after bounded MVP but should be done before scale.
- **Deferred to Stage 11+**: externalization, token/NFT, creator economy, booking/payment and other non-Stage-10 work.

## 2. Why Stage 10.12 Exists

Stage 10.1–10.11 answered:

- what the Go2Asia economy is;
- where Points authority lives;
- which producers are real;
- what is projection;
- what is delivery intent;
- what is RF utility;
- what is Rielt discovery;
- what is contribution context;
- what belongs in MVP;
- what is future-only or blocked.

But doctrine is not implementation readiness.

Stage 10.11 is enough to define the bounded MVP economy. It is not enough to safely show every surface publicly because some UI, docs, contracts and mock clusters can still cause:

- `mock_data -> runtime_truth`;
- `projection -> authority`;
- `summary -> proof`;
- `preview -> grant`;
- `Wallet -> financial_wallet`;
- `Dashboard -> receipt`;
- `ActivityFeed -> audit_trail`;
- `RF voucher -> cashback/payment`;
- `Rielt inquiry -> booking`;
- `badge -> NFT ownership`;
- `content signal -> reward grant`.

Stage 10.12 exists to create a single implementation-hardening backlog before any public MVP claim or later implementation slice.

Sequencing:

```text
10.1 inventory
-> 10.2 producer map
-> 10.3-10.9 module embodiment
-> 10.10 vocabulary firewall
-> 10.11 MVP cutline
-> 10.12 implementation-readiness plan
-> later implementation work, still not Stage 11
```

## 3. Implementation Readiness Philosophy

Implementation readiness means:

```text
bounded_mvp_scope_defined
+ unsafe_claims_identified
+ hardening_tasks_prioritized
+ support_truth_sources_defined
+ mock_surfaces_quarantined
+ public_copy_constraints_defined
```

It does not mean:

```text
activation
rollout
launch approval
new producers
new economy semantics
Stage 11 readiness
token/NFT/bridge enablement
```

Hardening must treat copy, UI framing, mock isolation, support policy, OpenAPI wording and producer boundaries as part of economy safety.

Core rules:

```text
implementation_readiness != activation
internal_beta != public_safe
copy_is_architecture
projection_needs_source_owner
support_uses_backend_owner_ids
mock_cannot_be_evidence
contract_wording_can_create_product_promises
```

## 4. Unified Hardening Backlog

| ID | Domain | Surface/module | Risk | Severity | Required action | Priority | Blocking public MVP? | Stage dependency |
|---|---|---|---|---|---|---|---|---|
| IR-P0-001 | Mock quarantine | Home authenticated rewards/stats | Static rows look like personalized runtime economy | Critical | Quarantine or replace with Connect-backed projection / honest placeholder | P0 | Yes | 10.1, 10.10, 10.11 |
| IR-P0-002 | Mock quarantine | Space Balance/NFT/Transactions/Quests/Vouchers/Referrals legacy cluster | Space appears to own wallet, NFT and reward ledger | Critical | Quarantine from public MVP and mark social-only | P0 | Yes | 10.3, 10.11 |
| IR-P0-003 | Copy/proof | Connect Wallet/Dashboard/ActivityFeed | Wallet/receipt/audit-trail collapse | Critical | Add internal Points, projection, non-receipt and non-audit framing | P0 | Yes | 10.6, 10.10, 10.11 |
| IR-P0-004 | Mock quarantine | Connect mockData transactions/analytics/missions/NFT/G2A | Mock ledger/future tabs can be revived as evidence | Critical | Keep non-production, non-evidence, future-only | P0 | Yes | 10.6, 10.11 |
| IR-P0-005 | UI/proof | Quest reward previews/local totals/NFTBadge | Preview becomes grant, badge becomes NFT | High | Mark preview vs applied Points; rename/quarantine NFT wording | P0 | Yes | 10.4, 10.5, 10.10 |
| IR-P0-006 | RF copy/proof | RF vouchers, PRO attribution, merchant summaries | Cashback/payout/commission/statement illusion | High | Reframe as voucher utility and operational summary only | P0 | Yes | 10.7 |
| IR-P0-007 | Rielt copy/proof | `verifiedBooking`, inquiry success, price/deposit/prepayment | Inquiry becomes booking/payment proof | High | Replace booking wording and add non-booking/payment boundaries | P0 | Yes | 10.8 |
| IR-P0-008 | Contract wording | PointsAction/ACTIONS_PHASE2 enum and docs | Vocabulary-only actions appear active | High | Classify active/internal-beta/future-only actions in docs/contracts | P0 | Yes | 10.2, 10.11 |
| IR-P0-009 | Support/proof | Screenshots/share cards/Dashboard totals | Support disputes use UI artifacts as proof | High | Define backend-owner lookup rules and forbidden evidence list | P0 | Yes | 10.10, 10.11 |
| IR-P0-010 | Public claims | NFT/G2A/bridge/token/creator/booking/payout wording | Stage 11/financial promises leak into MVP | Critical | Explicitly forbid public MVP claims and isolate as Stage 11+ | P0 | Yes | 10.0, 10.10, 10.11 |
| IR-P1-001 | Projection hardening | Connect projection freshness | Stale totals become support disputes | High | Add freshness/as-of/source-owner plan | P1 | No, but beta risk | 10.6, 10.11 |
| IR-P1-002 | Projection hardening | RF projections in Connect/Rielt | RF state can be read as payment entitlement | High | Add owner-domain/source markers and stale projection boundaries | P1 | No, but beta risk | 10.7, 10.8 |
| IR-P1-003 | Producer boundary | Quest outbox/requeue/PRO review | Outbox state becomes receipt; farming risk | High | Document delivered vs applied and operator/support boundaries | P1 | No, but beta risk | 10.4 |
| IR-P1-004 | Producer boundary | `event_registration` | Registration becomes attendance/payout proof | Medium-high | Mark as narrow content producer; separate registration, attendance and Points | P1 | No, but beta risk | 10.9, 10.11 |
| IR-P1-005 | Badge boundary | Internal badge award endpoint | Backend endpoint becomes product launch / Quest->Badge assumption | High | Define producer allowlist and "no Quest/Space activation" rule | P1 | No, but beta risk | 10.5 |
| IR-P1-006 | Content copy | Atlas/Pulse/Blog/Guru docs and UI | Creator/reward/ranking/commission overread | Medium-high | Mark creator rewards future-only; frame ranking as display sorting | P1 | No, but beta risk | 10.9, 10.10 |
| IR-P1-007 | Rielt support | Inquiry/listing/RF handoff | Listing screenshots become booking/payment disputes | Medium-high | Support lookup by inquiryId/RF voucherId only | P1 | No, but beta risk | 10.8 |
| IR-P1-008 | RF support | Duplicate claim/redeem/spend/compensation | Users interpret idempotent replay as new voucher/refund | Medium-high | Define backend lookup and duplicate semantics | P1 | No, but beta risk | 10.7 |
| IR-P1-009 | OpenAPI/SDK | Wallet/transactions/connect-dashboard descriptions | Contract wording sounds financial/audit-grade | Medium-high | Add proof-class notes in descriptions/JSDoc plan | P1 | No, but beta risk | 10.6, 10.10 |
| IR-P2-001 | Anti-abuse planning | Space contribution future signals | Raw likes/posts become future reward farms | High later | Plan moderation/scoring/ring detection prerequisites | P2 | No | 10.3 |
| IR-P2-002 | Anti-abuse planning | Quest and event farming | Multi-account rings exploit bounded producers | Medium-high | Plan caps, uniqueness checks and abuse matrix | P2 | No | 10.4, 10.9 |
| IR-P2-003 | Badge hardening | Badge award audit/source policy | Duplicate/conflicting awards or fake earnedAt | Medium | Plan audit logs/source policy before expansion | P2 | No | 10.5 |
| IR-P2-004 | Type/route cleanup | `NFTBadge`, `/connect/wallet`, `/space/nft` | Legacy names keep semantic debt alive | Medium | Plan renames/deprecations after P0 copy quarantine | P2 | No | 10.5, 10.6 |
| IR-P2-005 | Negative test planning | Forbidden proof transitions | Future implementation may regress semantics | Medium | Plan negative tests for preview->grant, mock->truth, projection->proof | P2 | No | 10.10, 10.11 |

## 5. Copy / Vocabulary Backlog

| Surface | Dangerous wording | Recommended framing | Severity | Priority |
|---|---|---|---|---|
| Connect Wallet | Wallet, balance, transaction, history | Internal Points activity summary; read-only projection | Critical | P0 |
| Connect Dashboard | totals, progress, recent activity without source | Snapshot summary; not receipt; source-owned facts | High | P0 |
| ActivityFeed | ledger/audit-like action labels | Recent activity preview; not audit trail | High | P0 |
| RF vouchers | Rewards, received through PRO, progress, used benefits | Voucher utility lifecycle; attribution visibility; not payout | High | P0 |
| RF merchant summary | report, statement, earnings-like metrics | Operational summary; not financial statement | High | P0 |
| Rielt inquiry | booking, reservation, verifiedBooking, instant booking | Contact request; not booking/payment confirmation | High | P0 |
| Rielt price/deposit | payable/invoice-like reading | Informational listing conditions | Medium-high | P0 |
| Quest rewards | earned, received, local total | Preview/candidate until backend applied Points | High | P0 |
| Quest badge copy | NFTBadge, mint, rarity-as-value | Off-chain badge candidate/projection | Critical | P0 |
| Space legacy economy | balance, NFT, transactions, reward history | Social activity only; economy surfaces quarantined | Critical | P0 |
| Home authenticated | "your activity", +Points, badge received, level | Example/placeholder or Connect-backed projection only | Critical | P0 |
| Atlas/Pulse/Blog/Guru | creator rewards, earn, income, NFT reputation | Editorial/content/discovery context; future-only rewards | High | P1 |
| Guru ranking | best/top/recommended near RF/Rielt | Recommendation/display sorting; not commission | Medium-high | P1 |
| Pulse event badges | verified/free/RF as user achievement | Event metadata; not user badge award | Medium | P1 |
| OpenAPI/SDK actions | all enum values look active | active producer vs internal-beta vs future-only | High | P0 |

Forbidden in active Stage 10 surfaces:

```text
cashback
payout
settlement
withdraw
top up
profit
passive income
commission as payout
financial wallet
ownership proof
NFT mint
token launch
active bridge
audit trail
receipt
statement
wallet asset
creator monetization
booking confirmation
payment receipt
```

## 6. UI / Projection Hardening Backlog

| Surface | Projection risk | Missing framing | Required UI hardening | Priority |
|---|---|---|---|---|
| Connect Wallet | Financial wallet / custody | Internal/off-chain/non-financial marker | Projection banner and source-owner framing | P0 |
| Connect Dashboard | Receipt/account statement | Snapshot/freshness/source references | Non-receipt disclaimer and as-of plan | P0 |
| ActivityFeed | Audit trail | Recent activity only | Label as preview/read model; avoid ledger words | P0 |
| Connect Levels | Progression authority | Badge projection only | Off-chain badge source and no-NFT wording | P1 |
| Connect RF section | RF payout report | RF-owned projection | Source/freshness marker and no payout copy | P1 |
| Quest runner/reward cards | Preview as grant | Backend confirmation boundary | "Preview/candidate" markers | P0 |
| Quest completion/share | Completion as proof | Points proof = Points Service row | Completion is activity fact; screenshot disclaimer | P0 |
| RF voucher cards | Voucher as payment/proof | Utility lifecycle only | No receipt/payout helper on high-dispute states | P0 |
| RF merchant/PRO panels | Statement/commission | Operational/attribution visibility | Non-financial panel framing | P0 |
| Rielt detail/CTA | Inquiry as booking | Rielt does not confirm booking/payment | Extend CTAPanel guardrail to success/price/RF | P0 |
| Rielt listing reviews | verifiedBooking as proof | Trust label scope | Remove/rename/guard | P0 |
| Space feed | Social activity as producer | Social-only scope | Avoid reward/Points language | P1 |
| Home authenticated | Static mock as runtime dashboard | Demo/placeholder or backend source | Quarantine or replace with Connect projection | P0 |
| Atlas/Pulse/Blog/Guru | popularity/ranking as reward | Context/recommendation projection | Add projection markers and no reward claim | P1 |

## 7. Mock Quarantine Register

| Mock surface | Current visibility | Risk | Required quarantine | MVP disposition | Priority |
|---|---|---|---|---|---|
| Home static `userRewards` and stats | Authenticated home / demo-like | Personalized runtime economy illusion | Remove later, hide from prod, or replace with backend projection | blocked_as_mvp_evidence | P0 |
| Connect mockData transactions/analytics/missions | File-level reservoir, future risk | Mock ledger/future features as truth | Keep internal demo only; block as evidence/import source | blocked_as_mvp_evidence | P0 |
| Connect NFT/G2A/Bridge legacy tabs | Future/legacy UI | Stage 11 activation illusion | Future-only inert; no MVP route/story | future_only_inert | P0 |
| Space BalanceView/Transactions/NFTView | Legacy/orphan components | Space-owned wallet/NFT/ledger illusion | Quarantine and social-only framing | blocked_as_mvp_evidence | P0 |
| Space Quests/Vouchers/Referrals mock views | Legacy/orphan components | Space-owned reward history illusion | Quarantine; only Quest/Connect/RF projections later | blocked_as_mvp_evidence | P0 |
| Quest mockQuests / local rewards | Legacy/local | Preview/grant and proof confusion | Keep inert; no proof route; preview labels | dangerous_until_aligned | P0 |
| Quest NFTBadgeDisplay/types | Legacy naming | NFT ownership illusion | Rename/quarantine in implementation plan | dangerous_until_aligned | P0 |
| RF merchant/PRO mock dashboards | Internal/demo | Statement/commission illusion | Internal demo only; non-financial marker if surfaced | blocked_for_public_mvp | P0 |
| RF mockData | File-level demo | Fake voucher inventory | Mark as non-evidence; replace with RF owner projections later | internal_demo_only | P1 |
| Rielt mock reviews with `verifiedBooking` | Listing review mock | Booking proof illusion | Rename/remove/guard before public beta | blocked_as_mvp_evidence | P0 |
| Rielt mock listings | Seed/demo inventory | Live inventory / booking expectation | Seed/demo marker; no support evidence | internal_demo_only | P1 |
| Guru mock Points/NFT strings | Mock/dev | Reward/NFT promise | Quarantine; future-only markers | blocked_as_mvp_evidence | P0 |
| Atlas/Pulse popularity placeholders | UI/docs | Views/likes as economic fact | Mock/demo markers; backend owner before projection | dangerous_until_aligned | P1 |
| Module docs tokenomics/creator rewards | Docs-over-runtime | Future claim appears active | Future-only register / Stage 11+ marker | future_only | P1 |

## 8. Support / Proof Hardening Plan

Support policy must use backend owner services, not UI artifacts.

### Authoritative lookup paths

| Claim/dispute | Backend lookup authority | Required lookup key |
|---|---|---|
| Points grant/balance | Points Service | `transactionId`, `externalId`, `userId`, action |
| Registration Points | Auth + Points | auth user id, Points `externalId` |
| Referral locked Points | Referral + Points | referral relation id, `referral:locked:*` externalId |
| Quest completion/reward | Quest Service + Points Service | `progressId`, `submissionId`, outbox externalId, Points transaction |
| Event registration | Content Service + Points Service | event registration id, Points `event_registration` row |
| RF voucher status | RF Service | `voucherId`, `offerId`, `partnerId`, `claimScope` |
| RF Points spend/compensation | RF + Points | voucher claim id, Points spend/recovery transaction |
| Rielt inquiry | Rielt Service | `inquiryId`, listing id |
| Badge award | Badge/Points Service | `user_badge` row, sourceType/sourceId |
| Guru recommendation | Guru/source services | source refs, not payout records |
| Connect projection | Underlying owner service | source id from Points/RF/Referral/Badge |

### Forbidden support evidence

```text
screenshots
Dashboard totals
Wallet summary
ActivityFeed rows
share cards
Quest local previews
Quest completion page
Home rewards
mock rows
Rielt listing screenshots
RF voucher screenshots
Guru rankings
likes/views/saves
diagnostics as customer evidence
token-service /ready
```

### Dispute boundaries

- Points proof requires Points Service row; Connect is a summary.
- Quest completion is an activity fact; reward proof requires Points row.
- RF voucher card is a lifecycle projection; payout/payment proof does not exist.
- Rielt inquiry proves contact request only; it does not prove booking, payment or reservation.
- Pulse event registration proves registration only; attendance proof is separate and not implied.
- Badges are off-chain recognition; share card/NFT naming is not ownership proof.
- Guru ranking and content popularity are display projections; they are not reward eligibility.

### Support wording

Support macros should use:

- "internal Points";
- "read-only summary";
- "backend-confirmed record";
- "voucher lifecycle status";
- "inquiry request";
- "off-chain badge";
- "not a receipt";
- "not a payout";
- "not booking/payment";
- "screenshot is a hint, not proof".

## 9. OpenAPI / SDK Hardening Plan

| Contract surface | Drift/problem | Required wording fix | Priority |
|---|---|---|---|
| `PointsAction` / `ACTIONS_PHASE2` | Enum includes vocabulary-only/future actions that look active | Add classification: active, internal-beta, future-only, blocked | P0 |
| `/internal/points/add` | Can be read as money grant | Internal utility ledger entry, not money/payout | P1 |
| `/internal/points/spend` | Spend can be read as payment | Internal Points debit, not payment/settlement | P1 |
| `/v1/points/transactions` | Looks like financial statement/audit trail | User-facing activity list, not receipt/audit trail | P0 |
| `/v1/wallet/summary` | Wallet tag implies custody | Internal Points summary, not custody/withdrawable asset | P0 |
| `/v1/points/connect-dashboard` | Dashboard may be treated as support authority | Read model, may be stale, source services are authoritative | P0 |
| Badge award endpoint | Product could infer badge launch/progression | Backend-only award operation, not NFT mint or Quest/Space activation | P1 |
| RF claim/redeem APIs | Claim/redeem can imply payout/settlement | Voucher issuance/usage marker only; not payout/cashback | P0 |
| RF spend/compensation | Compensation can imply refund/cashback | Internal Points trace/recovery, not money refund | P0 |
| Rielt listing/inquiry APIs | Inquiry can imply booking/payment | Contact request only; no booking/payment/settlement authority | P0 |
| Content event registration | Registration can imply attendance/reward guarantee | Registration record; Points only if Points Service applies bounded producer | P1 |
| Guru/recommendation APIs | Ranking can imply reward/commission | Display recommendation/projection only | P1 |
| SDK generated types | JSDoc may omit proof-class markers | Add read_projection, future_only and no-proof comments in later implementation | P1 |

OpenAPI/SDK hardening is a planning dependency here. Stage 10.12 does not edit contract files.

## 10. Producer Boundary Hardening

### Active producers for bounded MVP

| Producer | Owner | Stage 10.12 hardening need |
|---|---|---|
| `registration` | Auth + Points | Internal Points wording; no money/payout copy |
| `referral_locked` | Referral + Points | Referral status/locked language; no commission/network accrual copy |
| Points core add/read | Points Service | Idempotency/source-owner support references |

### Internal-beta producers

| Producer | Owner | Required restriction |
|---|---|---|
| `first_login` | Auth + Points | Do not market broadly; support idempotency only |
| `quest_completed` | Quest + Points | Completion/outbox != grant; Points row is authority |
| `event_registration` | Content + Points | Only content bounded producer; registration != attendance/payout |
| `rf_voucher_claim_spend` | RF + Points | Utility debit; not payment |
| `rf_voucher_claim_spend_compensation` | RF + Points | Technical recovery; not cashback/refund |
| Internal badge award | Badge/Points | Backend-only; no Quest/Space/public activation |

### Vocabulary-only/future producers

Must be blocked from MVP claims:

- `space_post_created`;
- `space_reaction_created`;
- `space_repost_created`;
- `rielt_listing_created`;
- broad Atlas/Pulse/Blog/Guru content rewards;
- Blog author/curator rewards;
- Guru ranking/recommendation rewards;
- `network_accrual_level_1/2`;
- `referral_bonus_referrer/referee`;
- `referral_unlock`;
- RF claim/redeem as Points grants;
- G2A/token/NFT/totem/on-chain reward producers.

### Required restrictions

- UI/docs must not imply producers that do not exist.
- OpenAPI/SDK must distinguish enum vocabulary from active producer paths.
- Support must not infer a producer from an ActivityFeed label.
- New producer activation is out of scope.

## 11. Module-Specific Hardening

### Connect

Top risks:

- Wallet naming and route semantics;
- Dashboard totals as receipt;
- ActivityFeed as audit trail;
- stale projections;
- mock analytics/missions/NFT/G2A data;
- RF/referral/badge summaries without source authority.

Required fixes:

- projection/source-owner markers;
- freshness/as-of plan;
- non-receipt/non-audit wording;
- support lookup links or references to backend owner IDs;
- mockData quarantine;
- NFT/G2A/Bridge future-only isolation.

MVP blockers:

- public Wallet/Dashboard/ActivityFeed claim without proof-class framing;
- mock transactions/analytics as evidence.

### Quest

Top risks:

- preview as grant;
- outbox as receipt;
- local reward calculations;
- `NFTBadge` naming;
- Space proof abuse;
- high-value Quest farming.

Required fixes:

- separate activity fact, delivery intent and applied Points;
- backend-confirmation wording;
- outbox delivered vs applied semantics;
- no Quest -> Badge activation;
- proof uniqueness/ownership plan;
- local preview quarantine.

MVP blockers:

- reward preview presented as received Points;
- NFT/badge ownership wording.

### RF

Top risks:

- cashback/payout/settlement vocabulary;
- PRO attribution as commission;
- merchant summary as financial statement;
- claim/redeem as proof/payment;
- Rielt handoff as booking/payment entitlement.

Required fixes:

- voucher utility wording;
- no-payout helpers on voucher cards and Connect RF panels;
- operational summary framing;
- RF owner lookup policy by voucher IDs;
- duplicate/idempotent claim explanation.

MVP blockers:

- RF as cashback/payout;
- merchant/PRO financial semantics.

### Rielt

Top risks:

- `verifiedBooking`;
- inquiry success as reservation;
- price/deposit/prepayment as invoice/payment;
- RF voucher count as value-bearing entitlement;
- investment/tokenomics docs.

Required fixes:

- non-booking/payment helper on CTA, success, price and RF handoff;
- replace verifiedBooking with scoped trust wording;
- source markers for seed overlays;
- support rule: inquiryId only proves request creation.

MVP blockers:

- booking/payment/investment vocabulary in active product;
- mock reviews/listings as live proof.

### Space

Top risks:

- legacy Balance/NFT/Transactions cluster;
- mock reward history;
- Space as Points producer;
- raw likes/reposts/comments as future reward expectations;
- Space NFT ownership illusion.

Required fixes:

- social-only framing;
- quarantine legacy economy views;
- contribution signal wording only;
- future producer prerequisites: moderation, scoring, anti-abuse.

MVP blockers:

- any Space-owned wallet/ledger/NFT/reward claim.

### Atlas / Pulse / Blog / Guru

Top risks:

- creator economy docs;
- rewards for views/likes/saves/content;
- Guru ranking as commission;
- Pulse registration as attendance/payout;
- event badge as user badge award;
- mock popularity placeholders.

Required fixes:

- content/discovery/context framing;
- future-only markers for creator rewards/NFT/token reputation;
- ranking/popularity projection markers;
- event registration boundary;
- support rules for likes/views/rankings.

MVP blockers:

- public claim that broad content actions grant Points;
- creator monetization narrative.

### Home / mock clusters

Top risks:

- authenticated Home static rewards/stats;
- personalized economy illusion;
- demo rows used in public screenshots.

Required fixes:

- quarantine or replace with backend-backed Connect summary;
- label as example if retained internally;
- never use as support or public evidence.

MVP blockers:

- Home mock rewards in public MVP story.

## 12. Public Claim Hardening

### Safe claims

Allowed after P0 copy/proof guardrails:

- Go2Asia has internal off-chain Points for selected backend-confirmed actions.
- Connect shows a read-only activity summary, not a financial wallet.
- Quest is an activity/delivery layer; rewards require backend confirmation.
- RF provides partner voucher utility, not cashback or payout.
- Rielt provides listing discovery and inquiry, not booking or payment.
- Space is a social layer, not a Points producer.
- Atlas/Pulse/Blog/Guru are content/discovery/context layers.
- Badges are off-chain recognition, not NFTs.

### Guarded claims

Only internal-beta or public with narrow disclaimers:

- Wallet/history/balance;
- ActivityFeed;
- event registration Points;
- RF paid Points spend;
- PRO attribution;
- merchant summaries;
- Guru rankings;
- Blog featured/editor pick;
- badge awarded;
- verified labels;
- Quest reward previews.

### Forbidden claims

Do not claim in Stage 10 MVP:

- cashback/payout/settlement/commission/passive income;
- financial wallet/custody/top-up/withdraw;
- receipt/account statement/audit trail;
- booking/payment/reservation through Rielt;
- creator economy/content monetization;
- NFT/G2A/token/bridge/on-chain/marketplace;
- Space rewards for posts/likes/reposts/comments;
- recommendation payouts;
- progression/XP engine;
- moderation/reputation runtime;
- screenshot/share card as proof.

### Required disclaimers

```text
internal Points are not money
Connect is a read-only projection
Dashboard is not a receipt
ActivityFeed is not an audit trail
RF voucher is not a payment or payout
Rielt inquiry is not a booking
Quest preview is not a grant
badge is off-chain recognition, not NFT ownership
screenshot is not proof
mock/demo rows are not runtime truth
```

## 13. Recommended Implementation Sequencing

### Before public MVP

Must be planned and completed before broad public economy claims:

1. P0 copy/vocabulary firewall across Connect, Quest, RF, Rielt, Space, Home and content modules.
2. Home static rewards quarantine.
3. Space legacy economy cluster quarantine.
4. Connect Wallet/Dashboard/ActivityFeed proof-class framing.
5. Quest preview/grant and NFTBadge quarantine.
6. RF voucher/PRO/merchant anti-payout framing.
7. Rielt inquiry/verifiedBooking/price non-booking framing.
8. Support/proof policy with backend owner lookup keys.
9. PointsAction/OpenAPI/SDK active-vs-future producer classification plan.
10. Public claim boundary checklist.

### Before open beta

Strongly recommended before larger audience:

1. Connect projection freshness/as-of strategy.
2. Source-owner links or references for Points/RF/Referral/Badge projections.
3. RF stale/duplicate claim/redeem support playbook.
4. Rielt inquiry/RF handoff support playbook.
5. Event registration boundary and abuse controls plan.
6. Quest outbox/retry operator boundaries.
7. Badge award producer allowlist policy.
8. Docs future-only markers for creator/token/NFT/reward language.
9. Negative test plan for proof-class transitions.

### Before any Stage 11 work

Required before externalization/gateway baseline can be discussed:

1. All P0 public-claim blockers closed.
2. Mock/future-only clusters fully quarantined as evidence.
3. Support proof policy operationalized.
4. Producer boundary documentation aligned with runtime.
5. NFT/G2A/bridge vocabulary removed from active Stage 10 surfaces or marked future-only.
6. No unresolved Wallet/receipt/audit/custody ambiguity in Connect.
7. No Rielt booking/payment or RF payout semantics in public MVP.

## 14. Explicit Deferrals to Stage 11+

Explicitly not part of Stage 10.12:

- G2A activation;
- token launch;
- bridge;
- external wallet;
- NFT mint/export/ownership;
- on-chain receipts;
- marketplace/trading;
- property tokenization;
- booking/payment gateway;
- settlement/payout/cashback;
- creator economy;
- content monetization;
- revenue sharing;
- recommendation payouts;
- reputation runtime;
- progression/XP/level engine;
- Quest -> Badge activation;
- Space Points producer;
- broad content Points producers;
- moderation-as-reward runtime;
- Slice 16.

These are not "hidden runtime" or "almost ready" items. They remain Stage 11+ or later only.

## 15. Multi-Agent Readiness Synthesis

| Role | Stage 10.12 assessment |
|---|---|
| ИИ-архитектор | The bounded MVP economy is architecturally defined, but implementation readiness depends on enforcing authority/projection boundaries and quarantining externalization vocabulary. |
| ИИ-аналитик | Public product claims must be narrower than internal-beta runtime; the plan should protect users from overreading demos, previews and module ambition. |
| ИИ-бэкенд-разработчик | Backend hardening centers on active-vs-vocabulary producer classification, OpenAPI/SDK wording, support lookup keys and no new producers. |
| ИИ-фронтенд-разработчик | UI readiness blockers are Home/Space/Connect mocks, Wallet/ActivityFeed semantics, Quest previews, RF payout wording and Rielt booking language. |
| ИИ-тестировщик | QA readiness should be planned around negative proof-class transitions: screenshot->proof, mock->truth, preview->grant, projection->authority. |
| ИИ-специалист по безопасности | Abuse risk concentrates in fake proof, farming, payout/cashback expectations, booking/payment disputes and mock economy exposure. |
| ИИ-технический писатель | The report should become the canonical hardening backlog with P0/P1/P2/Stage 11+ tiers and no implementation approval. |

## 16. Guardrails Reconfirmed

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

Stage 10.11 guardrails inherited into implementation readiness:

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

Stage 10.12 guardrails:

```text
implementation_readiness != implementation
hardening_plan != rollout
backlog != activation
copy_fix_plan != public_claim_approval
mock_quarantine_plan != mock_removed
producer_boundary_plan != producer_activation
OpenAPI_wording_plan != contract_change_in_this_slice
support_policy_plan != receipt_system
Stage_10_12 != Stage_11_preparation_work
```

## 17. Final Verdict

```text
stage_10_12_status: completed_as_docs_first_implementation_readiness_plan
mvp_economy_defined: true
mvp_economy_implementation_ready: incomplete
public_mvp_claim_ready: false_until_p0_hardening
mock_quarantine_ready: planned_not_done
support_proof_policy_ready: planned_not_done
projection_hardening_ready: planned_not_done
copy_vocabulary_hardening_ready: planned_not_done
producer_boundary_hardening_ready: planned_not_done
openapi_sdk_wording_hardening_ready: planned_not_done
connect_hardening_priority: P0
quest_hardening_priority: P0
rf_hardening_priority: P0
rielt_hardening_priority: P0
space_hardening_priority: P0
content_module_hardening_priority: P1
home_mock_cluster_priority: P0
largest_remaining_risk: mock_vocabulary_projection_collapse
highest_priority_blocker: Home_Space_Connect_mock_and_projection_surfaces_can_still_look_like_runtime_economy
new_producers_approved: false
creator_economy_approved: false
NFT_G2A_approved: false
booking_payment_approved: false
progression_engine_approved: false
Quest_to_Badge_approved: false
stage_11_ready: false
recommended_next_step: implement_P0_hardening_in_later_non_stage11_slice
slice_16_status: blocked_not_triggered
```

Human conclusion:

Go2Asia's economy is now defined, but implementation readiness is incomplete. The next practical work is not new economy design and not Stage 11. It is hardening: remove or quarantine mock economy surfaces, align vocabulary with proof classes, make projections visibly non-authoritative, define support lookup rules, clarify OpenAPI/SDK wording, and enforce producer boundaries. Until P0 hardening is completed, the internal MVP economy can be understood and planned, but broad public MVP economy claims remain unsafe.
