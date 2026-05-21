# Stage 10.3 — Space Asia Economy Embodiment

Документ: `stage_10_3_space_asia_economy_embodiment_v1.md`  
Статус: docs-first audit/design  
Дата: 2026-05-21  
Scope: Space Asia economy surfaces, runtime reality, mock quarantine, contribution model, anti-abuse cutline

## 1. Executive Summary

Space Asia не является ошибкой и не должен быть изолирован от Go2Asia. Наоборот, Space является стратегическим социальным слоем экосистемы: он должен стать местом, где пользовательские действия превращаются в activity facts, community signals и будущие contribution signals для внутренней off-chain экономики.

Текущая зрелость Space неоднородна:

- runtime-backed social layer уже существует для ленты, публикаций, репостов, сохранений, лайков и activity projections;
- backend создаёт `space_activity_projection`, но не создаёт Points economic facts;
- `space_post_created`, `space_repost_created`, `space_reaction_created` присутствуют в экономическом vocabulary как возможные действия, но не являются active Points producers;
- старый Space economy cluster содержит mock balances, mock transactions, mock rewards, mock badges, mock NFT, mock quests, mock vouchers, mock referrals и mock weekly goals;
- часть опасного mock UI уже не является основной активной навигацией и заменена stub/honest copy, но кодовые поверхности всё ещё существуют и должны быть классифицированы.

Главный вывод Stage 10.3:

```text
Space_activity != Points_grant
Space_contribution_signal != economic_fact
Space_producer_candidate != active_producer
```

Space можно и нужно готовить как contribution layer, но нельзя считать текущим Points producer. Любая будущая выдача Points должна проходить через отдельный authority path: quality/moderation/anti-abuse -> reward_candidate -> future Points producer -> Points Service -> `economic_fact`.

Stage 10.3 ничего не активирует:

- no Space producer activation;
- no Points enforcement activation;
- no Quest -> Badge activation;
- no Token/NFT/G2A/on-chain activation;
- no wallet/bridge/marketplace activation;
- no schema/API/UI changes.

## 2. Why Stage 10.3 Exists

Stage 10.1 определил Space как крупнейший mock economy cluster. Stage 10.2 уточнил producer reality: активные Points producers ограничены Auth, Referral, Quest, Content и RF, а Space actions находятся только в allowed action vocabulary.

Space стал следующим slice по трём причинам.

Первая причина: Space является главным producer illusion cluster. В интерфейсах и mock-данных есть `Space Points`, `G2A future layer`, mock transactions, mock quest rewards, mock voucher costs, mock referral bonuses и mock badges. Без классификации эти элементы могут быть ошибочно прочитаны как runtime-backed economy.

Вторая причина: Space нужен для ecosystem-wide contribution economy. Именно Space собирает социальные действия, публикации, ответы, сохранения, реакции, репосты, группы и community context. Это естественный источник contribution signals, но не прямой источник economic facts.

Третья причина: Space нельзя просто убрать. Удаление Space разрушило бы будущую социальную экономику Go2Asia. Корректный путь не в отключении Space, а в embodiment alignment: отделить activity от grant, mock от authority, contribution_signal от economic_fact.

Почему нельзя сразу включать Points за посты и лайки:

- пост сам по себе не доказывает полезность;
- реакция сама по себе легко фармится;
- репост сам по себе может быть spam loop;
- сохранение может быть приватным utility-signal, но не proof of ecosystem contribution;
- без moderation, quality threshold, idempotency, anti-farming и Connect projection alignment Space producer создаст высокий abuse surface.

## 3. Current Space Economy Surface Inventory

| Surface | Location | User-facing status | Layer | Runtime class | Proof class | Authority level | Collapse risk | Current verdict |
|---|---|---:|---|---|---|---|---|---|
| Space dashboard runtime shell | `apps/go2asia-pwa-shell/app/(public)/space/SpacePageClient.tsx` | Да | Layer 0/1 context | partial runtime + summary/reference | projection/context | low authority | Medium | Может быть social entry point; не economy authority |
| Space feed | `app/(public)/space/feed/page.tsx`, `components/space/runtime/SpaceFeedSurface.tsx` | Да | Layer 0 activity | production-shaped projection | activity projection | Space runtime authority for feed only | Medium | MVP-ready as social layer, not reward layer |
| Space feed cards | `components/space/runtime/SpaceFeedCard.tsx` | Да | Layer 0 activity | production-shaped projection | presentation | low authority | Low/Medium | Safe if not read as proof or reward |
| Space posts/publications | `app/(public)/space/posts/*`, `space-service` posts routes | Да | Layer 0 activity | production-shaped activity | activity_fact/projection | Space runtime authority for posts | Medium | Activity facts exist; no economic facts |
| Space reposts | `space-service/src/services/spaceService.ts` | Да | Layer 0 activity | production-shaped activity | activity_fact/projection | Space runtime authority | High | Candidate signal only; not reward grant |
| Space reactions/likes/bookmarks | `apps/reactions-service/src/services/reactionsService.ts`, `useSpaceSavedReactions.ts` | Да | Layer 0 activity | production-shaped activity | reaction fact/projection | Reactions runtime authority | High | Strong abuse risk; not economic fact |
| Space activity page | `app/(public)/space/activity/ActivityPageClient.tsx` | Да | Layer 0/1 projection context | production-shaped projection | activity projection | Space projection authority | Medium/High | ActivityFeed-like projection, not audit trail |
| Space saved posts | `app/(public)/space/saved/*`, `useSpaceSavedReactions.ts` | Да | Layer 0 utility | production-shaped bookmark projection | user utility signal | Reactions authority | Medium | Future quality signal candidate only |
| Space community/groups | `app/(public)/space/community/*` | Да | Layer 0 social | partial runtime/product surface | activity/context | Space authority for group membership/feed | Medium | Useful MVP social surface; not economy |
| Space organizer | `app/(public)/space/organizer/*`, `components/space/runtime/organizer*` | Да | Layer 0/operational | partial runtime | operational projection | Space/organizer authority | Medium | Outside direct economy; possible future reputation context |
| Space balance page stub | `app/(public)/space/balance/page.tsx` | Direct route exists, nav not primary | Layer 1/3 wording | honest stub | no proof | none | Medium | Safe current stub; legacy BalanceView remains dangerous |
| Legacy BalanceView | `components/space/Balance/BalanceView.tsx` | Orphan/exported component | Layer 1/3 mock | mock-only | mock transaction projection | none | Critical | Must quarantine; not Points balance or ledger |
| Space NFT/badges page stub | `app/(public)/space/nft/page.tsx` | Direct route exists, nav not primary | Layer 2/4 wording | honest stub | no proof | none | Medium | Safe current stub; legacy NFTView remains dangerous |
| Legacy NFTView | `components/space/NFT/NFTView.tsx` | Orphan/exported component | Layer 2/4 mock | mock-only | mock badge catalog | none | High | Must quarantine; `NFTBadge` naming can imply ownership |
| Space quests page stub | `app/(public)/space/quests/page.tsx` | Direct route exists | Layer 1/2 wording | stub | no proof | none | Medium | Not Quest runtime; future integration only |
| Legacy QuestsView | `components/space/Quests/QuestsView.tsx` | Orphan/exported component | Layer 1 mock | mock-only | reward history mock | none | High | Must quarantine; Quest completion != reward grant |
| Space vouchers page stub | `app/(public)/space/vouchers/page.tsx` | Direct route exists | Layer 1 utility wording | stub | no proof | none | Medium | Not RF runtime; future RF projection candidate |
| Legacy VouchersView | `components/space/Vouchers/VouchersView.tsx` | Orphan/exported component | Layer 1/RF utility mock | mock-only | voucher mock | none | High | Must quarantine or replace with RF/Connect projection later |
| Space referrals page/component | `app/(public)/space/referrals/page.tsx`, `components/space/Referrals/ReferralsView.tsx` | Direct route/component exists | Layer 1 participation | mock/summary | participation projection | none/low | High | Referral bonus wording needs Connect/Referral authority |
| Space weekly goals | `components/space/Dashboard/WeeklyGoalsBlock.tsx`, `mockWeeklyGoals` | Legacy dashboard component | Layer 1/2 mock | mock-only | reward candidate mock | none | High | Must quarantine; goal completion != Points grant |
| Space dashboard assets | `components/space/Dashboard/AssetsBlock.tsx`, `mockDashboardStats` | Legacy dashboard component | Layer 1/3 mock | mock-only | balance projection mock | none | Critical | Must quarantine; Space mock balance != Points balance |
| Space activity mock block | `components/space/Dashboard/ActivityBlock.tsx`, `mockActivityItems` | Legacy dashboard component | Layer 0/1 mock | mock-only | activity/reward mock | none | High | Must quarantine; mock activity != audit trail |
| Space recommendations with points | `mockRecommendations` | Legacy dashboard data | Layer 1 mock | mock-only | recommendation/reward preview | none | High | Future candidate only; not grant |
| Space notifications types | `components/space/types.ts` | Type vocabulary | Layer 0/1/2 vocabulary | vocabulary-only | no proof | none | Medium | `points`/`nft` notification types are not activation |
| Space docs overview | `docs/modules/space/overview.md`, `ui_structure.md` | Docs | Layer 0-4 vocabulary | docs-only | contract/docs | none | High | Useful intent; docs != activation |

## 4. Space Runtime Reality Map

### What Space реально делает сейчас

Space runtime уже имеет рабочие социальные факты и проекции:

- `space-service` создаёт posts и reposts через `/v1/space/posts`;
- `space-service` пишет `space_activity_projection` для `space.post_created`, `space.repost_created`, `space.post_reposted_by_other`, `space.group_joined`;
- `space-service` публикует domain events `space.post.created`, `space.post.reposted`, `space.post.deleted`, media attached/detached events;
- `reactions-service` создаёт `reaction.created` и `reaction.deleted` для `like` и `bookmark`;
- `reactions-service` обновляет aggregates и materializes incoming like activity projection для `space_post`;
- `feed-service` агрегирует Space feed и Reactions summary, но не является economy authority;
- PWA Space surfaces читают feed/activity/profile/bookmark runtime через SDK/custom instance.

### What Space НЕ делает сейчас

Space runtime не является Points producer:

- нет вызова `/internal/points/add` из `space-service`;
- нет вызова `/internal/points/spend` из `space-service`;
- нет вызова `/internal/points/add` из `reactions-service`;
- нет вызова `/internal/points/spend` из `reactions-service`;
- нет Space-owned economic ledger;
- нет Space-owned Points balance;
- нет Space-owned badge award engine;
- нет Space-owned reward outbox;
- нет Space-owned settlement, cashback, wallet, bridge или marketplace flow.

### Allowed actions vs active producers

| Vocabulary/action | Current runtime fact | Active Points producer | Current classification | Verdict |
|---|---|---:|---|---|
| `space_post_created` | `space.post_created` activity projection exists | No | activity_fact / contribution_candidate | Candidate only |
| `space_repost_created` | `space.repost_created` activity projection exists | No | activity_fact / high-risk signal | Candidate only, abuse-gated |
| `space_reaction_created` | `reaction.created` exists; incoming like projection exists | No | reaction fact / weak signal | Not directly rewardable |
| `space.group_joined` | activity projection exists | No | social activity | Not rewardable by itself |
| Bookmark/save | reaction `bookmark` exists | No | utility signal | Future quality signal, not grant |
| Profile/dashboard summary | profile/feed summary exists | No | projection/context | Not economic fact |

### Existing runtime controls

| Control | Current status | Economy relevance | Gap |
|---|---|---|---|
| Auth/principal checks | Present for protected writes | Required baseline | Not enough for reward eligibility |
| Group membership validation | Present for group posts | Useful context | Not contribution quality |
| Repost target validation | Present | Prevents malformed reposts | Does not prevent repost farming |
| Reaction uniqueness | Present by `(user, target, reactionType)` active reaction | Reduces duplicate reactions | Does not prevent rings/bots/mutual farms |
| Reaction idempotency key | Present | Good future producer prerequisite | Not connected to Points |
| Reaction write throttle | Present in-memory per worker instance | Reduces burst abuse | Not durable/global enough for rewards |
| Post text length validation | Present | Basic spam boundary | No quality/moderation scoring |
| Soft delete/projection removal | Present for posts | Helps activity hygiene | Not audit proof |
| Moderation dependency | Not observed as economy gate | Required before rewards | Missing |
| Contribution scoring | Not observed | Required before rewards | Missing |
| Points Service call | Absent | Required for economic fact | Missing by design |

### Connections to other modules

| Module | Current Space connection | Authority interpretation |
|---|---|---|
| Connect | Docs say Connect owns read-only projections; Space dashboard has references/summaries | Space must not become Connect replacement |
| Points | No producer calls; old mock components show Points vocabulary | Points Service remains Layer 1 authority |
| Quest | Docs and mock/stub routes reference quests; no active Quest grant from Space | Quest completion != reward grant |
| Badges/Progression | Stub/off-chain badge language and old `NFTBadge` mocks exist | Badge award engine not active in Space |
| RF/Vouchers | Stub/mock voucher surfaces exist | RF utility authority remains RF/Connect, not Space |
| Feed/Reactions | Active runtime integration | Social activity authority only |

## 5. Space Mock Economy Quarantine Register

| Mock surface | Why dangerous | User-facing risk | Required future disposition |
|---|---|---|---|
| `mockDashboardStats.points` | Looks like current Space Points balance | Users/agents can read as Points authority | quarantine; later replace with Connect projection |
| `mockDashboardStats.weeklyPointsEarned` / `weeklyPointsSpent` | Looks like weekly economic ledger | Implies earned/spent runtime | quarantine; later replace with Points/Connect read-only summary if available |
| `mockDashboardStats.g2aBalance` | Uses future G2A vocabulary in Space | Can imply active token balance | keep inert now; remove or hide behind future-only copy later |
| `AssetsBlock` `Space Points` | Looks like wallet-like balance card | `Space_mock_balance != Points_balance` risk | quarantine; later route to Connect-owned projection |
| `AssetsBlock` `G2A future layer` | Token-like card in Space | G2A activation overread | keep inert; future-only only |
| `BalanceView` transaction list | Ledger-like rows with earn/spend/bonus/referral/quest | `Space_transaction_mock != ledger_row` risk | quarantine; replace with Connect/Points projection later |
| `mockTransactions` earn/spend rows | Looks like economic facts | Mock-as-proof collapse | quarantine; must not be evidence |
| `mockTransactionsExtended` | More ledger-like history | Amplifies false maturity | quarantine; remove later if replaced |
| `mockActivityItems` type `points` | Activity row says received Points | ActivityFeed can look like reward proof | quarantine; activity projection only |
| `mockRecommendations.points` | Recommends quests/vouchers with points | Implies direct rewards/costs | quarantine; future implementation candidate |
| `mockQuests` / `mockQuestsExtended` | Quest cards show Points and completion | Quest completion overread as grant | quarantine; later integrate Quest projection only |
| `QuestsView` rewards tab/history | Looks like reward history | Reward history without authority | quarantine; replace with Quest/Points proof chain later |
| `mockVouchers` / `mockVouchersExtended` | Voucher costs look spendable | RF/Points spend overread | quarantine; replace with RF/Connect projection |
| `VouchersView` | Mock voucher marketplace feel | Marketplace/utility activation overread | quarantine; future implementation candidate only |
| `mockBadges` / `mockBadgesExtended` | `NFTBadge[]`, earned dates, rarity | Badge/NFT ownership collapse | quarantine; rename later when implementation slice allows |
| `NFTView` | Shows off-chain badges but route/name says NFT | `Space_NFT_view != NFT_ownership` risk | keep stub; quarantine legacy view; rename later |
| `mockWeeklyGoals.pointsReward` | Goals show `+Points` | Weekly task completion can look rewardable | quarantine; future reward_candidate only |
| `ReferralsView` mock stats | Shows monthly recognized Points | Referral income/projection overread | quarantine; replace with Referral/Connect projection |
| `NotificationType` includes `points` and `nft` | Vocabulary can look activated | Agent may build flows from types | keep inert; document as vocabulary-only |
| Legacy `DashboardView` composition | Combines assets, goals, activity, recommendations | Whole mock economy dashboard | quarantine; do not rewire before copy/projection alignment |

Disposition terms:

- `keep inert`: allowed to remain as non-active code/doc surface, but must not be cited as runtime evidence;
- `quarantine`: must be treated as dangerous mock vocabulary until a future implementation slice rewrites or gates it;
- `rename later`: naming should be corrected only in an implementation/copy slice, not in Stage 10.3;
- `replace with Connect projection`: Space should consume Connect/Points read-only summaries rather than own economy authority;
- `future implementation candidate`: can become real only after authority, anti-abuse, idempotency and moderation are defined.

## 6. Space Contribution Model

Stage 10.3 defines the safe model only. It does not activate the flow.

```text
user_action
-> activity_fact
-> contribution_signal
-> reward_candidate
-> anti_abuse_policy
-> future Points producer
-> Points Service applied=true
-> economic_fact
```

### Definitions

| Term | Meaning in Space | Not equal to |
|---|---|---|
| `user_action` | Raw action: post, repost, like, save, comment, group join | proof |
| `activity_fact` | Runtime fact/projection produced by Space/Reactions | Points grant |
| `contribution_signal` | Interpreted signal that may indicate ecosystem value | economic_fact |
| `reward_candidate` | Candidate after quality/eligibility rules | reward_grant |
| `anti_abuse_policy` | Gates, scoring, moderation, rate limits, dedupe | rollout evidence |
| `future Points producer` | Future service path allowed to call Points Service | current active producer |
| `economic_fact` | Points Service-applied grant/spend row | Space UI row |

### Direct actions

Direct actions are useful for activity, but should not be directly rewardable.

| Action | Current classification | Contribution interpretation | Reward candidate? | Verdict |
|---|---|---|---:|---|
| `post_created` | activity_fact | User participated | No direct reward | Needs quality threshold |
| `repost_created` | activity_fact | User redistributed content | No direct reward | High farming risk |
| `reaction_created` / like | reaction fact | Low-strength engagement | No direct reward | Too easy to farm |
| `bookmark` / saved | utility signal | User found content useful | No direct reward | Can feed quality scoring |
| `group_joined` | activity_fact | User joined community | No direct reward | Onboarding signal only |
| `profile_completed` | future activity | Better identity context | Maybe one-time candidate | Needs identity/anti-sybil gate |

### Quality-mediated actions

These can become contribution signals only after measurable quality.

| Action | Required quality threshold | Candidate status |
|---|---|---|
| Useful post | Non-duplicate, meaningful length/content, survives moderation, receives diverse organic saves/comments | Future MVP candidate |
| Guide-like contribution | Structured, location/context-rich, reusable by community | Strong future candidate |
| Community answer | Accepted/helpful answer in group or Q&A context | Strong future candidate |
| Useful comment | Not spam, receives moderation/user usefulness signal | Future candidate |
| Saved by real users | Saved by distinct trusted users, not ring accounts | Supporting signal only |
| Post commented by real users | Diverse meaningful comments | Supporting signal only |

### Moderation-mediated actions

These should depend on human/automated moderation before reward candidacy.

| Action | Moderation need | Candidate status |
|---|---|---|
| Report abuse | Must be accepted/validated, not malicious | Future candidate |
| Moderation accepted contribution | Requires moderator decision and auditability | Strong candidate |
| Local guide/route review | Needs quality and duplicate checks | Strong candidate |
| Official community answer | Needs role/reputation/moderation | Future candidate |

### Reputation-mediated actions

These require user trust history.

| Action | Reputation dependency | Candidate status |
|---|---|---|
| PRO helpful answer | PRO role alone is insufficient; needs accepted usefulness | Future candidate |
| Local expert guide | Requires domain reputation and moderation | Future candidate |
| Repeat helpful contributor streak | Requires anti-farming and cooldowns | Future-only |
| Community steward activity | Requires role, scope, moderation and no conflict of interest | Future-only |

### Anti-abuse gated actions

Actions in this group are never safe as direct grants.

| Action | Why gated | Verdict |
|---|---|---|
| Raw likes | Like farming, mutual rings, bot waves | Supporting metric only |
| Raw reactions | Same as likes; low cost | Not rewardable |
| Raw reposts | Repost loops and spam distribution | Not rewardable |
| Raw post count | Post farming and low-quality content | Not rewardable |
| Raw comments | Spam/comment farming | Quality-mediated only |
| Raw referral + Space engagement loop | Sybil/referral rings | Block until cross-domain anti-abuse |

## 7. Space Points Producer Candidate Map

No candidate below is active on Stage 10.3.

| Candidate action | Current status | Required authority | Required idempotency key | Required anti-abuse | Required moderation | Expected proof chain | MVP readiness | Verdict |
|---|---|---|---|---|---|---|---|---|
| `space_post_created` | activity projection exists | Space contribution policy + future producer | `space_post_created:{postId}:{policyVersion}` | duplicate/content farming, rate limit, cooldown | Required for reward | post -> activity_fact -> quality/moderation -> reward_candidate -> future Points producer -> Points Service | Not ready | Candidate only |
| `space_repost_created` | activity projection exists | Space policy + original content context | `space_repost_created:{repostId}:{targetId}:{policyVersion}` | repost loops, self/repost rings, spam | Required | repost -> activity_fact -> anti-loop -> reward_candidate -> future producer | Not ready | Weak candidate |
| `space_reaction_created` | reaction fact exists | Reactions + Space contribution policy | `space_reaction_created:{reactionId}:{targetId}:{policyVersion}` | like farming, bots, mutual likes | Usually no | reaction -> aggregate/supporting signal only | Not MVP | Not direct producer candidate |
| `space_post_saved_by_real_users` | bookmark runtime exists | Reactions aggregate + reputation/identity | `space_saved_signal:{postId}:{window}:{policyVersion}` | save rings, fake accounts | Optional/quality gate | saves -> distinct trusted users -> quality signal -> reward_candidate | Future | Supporting signal candidate |
| `space_useful_comment` | comment surface mostly not established as economic runtime in this audit | Space comments + moderation | `space_useful_comment:{commentId}:{policyVersion}` | comment spam, duplicate advice | Required | comment -> moderation/usefulness -> reward_candidate -> future producer | Future | Stronger than raw comment |
| `space_guide_like_contribution` | docs/type vocabulary and cross-module references | Atlas/Space contribution authority | `space_guide_contribution:{contentId}:{policyVersion}` | duplicate guides, copied content | Required | guide-like content -> quality/moderation -> reward_candidate -> future producer | Future beta | Strong candidate |
| `space_community_answer_accepted` | future-only | Community/moderation authority | `space_answer_accepted:{answerId}:{moderatorId}:{policyVersion}` | collusion, fake questions | Required | answer -> accepted -> anti-collusion -> reward_candidate -> future producer | Future | Strong candidate |
| `space_report_abuse_accepted` | future-only | Moderation authority | `space_report_accepted:{reportId}:{policyVersion}` | malicious reports, brigading | Required | report -> validated abuse -> reward_candidate -> future producer | Future | Candidate with strict gates |
| `space_profile_completion` | profile runtime/projection exists | Identity/profile policy | `space_profile_completion:{userId}:{milestone}:{policyVersion}` | fake profile farms | May require identity trust | profile fields -> validation -> one-time candidate -> future producer | Possible beta | One-time small candidate only |
| `space_group_stewardship` | group runtime exists | Community governance authority | `space_group_steward:{groupId}:{userId}:{period}:{policyVersion}` | role abuse, self-dealing | Required | steward activity -> moderation/reputation -> reward_candidate -> future producer | Future-only | Not MVP |

Canonical proof chain for any future Space producer:

```text
space_post_created
-> activity_fact
-> quality / moderation / anti-abuse
-> reward_candidate
-> future Points producer
-> Points Service applied=true
-> economic_fact
```

Rejected shortcut:

```text
space_post_created
-> Points grant
```

This shortcut is explicitly blocked.

## 8. Space Badge / Progression Candidate Map

Space can feed badge/progression later, but badge award is not current runtime and badge is not NFT mint.

| Space action/signal | Badge/progression possibility | Current status | Required engine | Verdict |
|---|---|---|---|---|
| First useful post | Social onboarding badge | Future candidate | Badge/progression engine + quality gate | Not active |
| Accepted community answer | Helpful contributor badge | Future candidate | Moderation + reputation engine | Strong future candidate |
| Guide-like contribution | Local guide badge | Future candidate | Atlas/Space quality authority | Strong future candidate |
| Valid abuse report | Community safety badge/progression | Future candidate | Moderation accepted report | Possible future |
| Sustained quality streak | Reputation progression | Future-only | Anti-farming + period scoring | Blocked until scoring |
| Raw post count | Badge temptation | Current activity only | None | Not enough |
| Raw likes/reactions | Badge temptation | Current reaction fact | None | Not enough |
| Raw repost count | Badge temptation | Current activity fact | None | Not enough |
| `mockBadges` | Mock badge catalog | mock-only | None | Quarantine |
| `NFTView` | Stub/legacy badge/NFT UI | stub/mock | None | NFT/on-chain ownership absent |

Guardrails:

```text
badge != NFT_mint
Space_badge_mock != badge_award
Space_NFT_view != NFT_ownership
NFT != receipt
```

Space should eventually send eligible contribution signals to a badge/progression authority. It should not mint NFTs, claim NFT ownership, or treat mock earned dates as awarded badges.

## 9. Abuse & Farming Risk Register

| Risk | Surface/action | Severity | Abuse path | Required mitigation | Stage dependency |
|---|---|---|---|---|---|
| Post farming | `post_created`, weekly goals | High | High-volume low-quality posts for rewards | Quality threshold, duplicate detection, cooldowns, moderation | 10.3 model, later implementation |
| Like farming | reactions/likes | Critical | Mutual likes, bots, ring accounts | Trusted-user weighting, graph analysis, rate limits, anti-sybil | Security/anti-abuse slice before producer |
| Reaction farming | likes/bookmarks | High | Low-cost repeated engagement | Idempotency, aggregate anomaly detection, per-user caps | Reactions hardening |
| Repost loops | `repost_created` | High | Circular reposts or self-promotion loops | Loop detection, source diversity, cooldowns | Space policy implementation |
| Mutual likes | reactions | Critical | Small groups inflate each other | Reciprocity detection, ring scoring | Anti-abuse engine |
| Bot activity | posts/reactions/saves | Critical | Scripted posting and reacting | Auth trust, device/IP heuristics, velocity scoring | Platform anti-abuse |
| Spam posting | posts/comments | High | Low quality posts flood feed | Content moderation, per-user limits, report handling | Moderation dependency |
| Low-quality content farming | posts/guides/comments | High | Minimal text or copied content | Quality scoring, plagiarism/duplicate checks | Quality engine |
| Duplicate content | posts/guides | High | Reposting/copying same content under variants | Similarity detection, canonicalization | Content quality slice |
| Self-reward loops | posts/reactions/reposts | Critical | Own alt accounts reward primary account | Identity graph, anti-sybil, self/related account exclusions | Identity/anti-abuse |
| Referral + Space loops | referrals + Space engagement | Critical | Invited fake accounts generate Space engagement | Cross-domain abuse scoring | Referral/Space coordination |
| Fake engagement rings | likes/saves/comments | Critical | Coordinated groups simulate usefulness | Graph analysis, trusted user weighting | Anti-abuse engine |
| Moderation bypass | reports/contributions | High | Reward before moderation decision | Reward only after accepted moderation state | Moderation engine |
| Screenshot-as-proof | UI screenshots | High | User presents UI as receipt | Copy/evidence guardrails, receipt separation | UX Copy 10.10 |
| Mock-as-proof | mockData/legacy components | Critical | Mock rows cited as runtime facts | Quarantine, docs guardrails, future cleanup | 10.10/10.11 |
| Stale projection | activity/dashboard/feed | High | Old projection interpreted as current ledger | Timestamping, projection disclaimers, authority links | Connect/UX alignment |

## 10. MVP Space Economy Cutline

### MVP-ready now

MVP-ready only as social/product layer:

- Space dashboard as social entry point and summary/reference shell;
- Space feed as social feed projection;
- Space posts/publications as activity surface;
- Space reposts as social distribution activity;
- Space saved posts/bookmarks as user utility;
- Space activity page as recent activity projection;
- Space community/groups as participation context.

These are not economy authorities and not Points producers.

### Internal beta only

Useful, but needs stronger wording/authority before broad MVP economy claims:

- activity projections that include likes/reposts;
- dashboard summaries that mention signals or priorities;
- cross-module references to Quest, RF, Atlas, Pulse, Blog;
- profile/social capital language;
- organizer/community operational context;
- referral participation language.

### Future-only

Future-only until contribution model and anti-abuse gates exist:

- Points for Space posts;
- Points for likes/reactions;
- Points for reposts;
- Points for comments;
- Points for saved posts;
- Points for weekly goals;
- Space-powered badge awards;
- Space-powered reputation progression;
- Space accepted-answer rewards;
- report-abuse rewards;
- guide-like contribution rewards.

### Blocked

Blocked at Stage 10.3:

- Space active Points producer;
- Space-owned Points balance;
- Space-owned transaction ledger;
- Space-owned reward history;
- Space-owned voucher spend;
- Space-owned NFT ownership;
- Space wallet/bridge/marketplace;
- any Token/G2A/on-chain activation;
- Slice 16 movement.

### Dangerous until aligned

Dangerous until UX copy/projection cleanup and MVP cutline:

- legacy BalanceView and transaction rows;
- legacy NFTView and `NFTBadge` naming;
- legacy QuestsView reward history;
- legacy VouchersView;
- legacy ReferralsView mock recognized Points;
- mock weekly goals with `pointsReward`;
- mock recommendations with points;
- mock activity rows saying Points received.

## 11. Recommended Follow-up Slices

### Stage 10.4 — Quest Embodiment

Pass forward:

- Space quest stubs and legacy `QuestsView`;
- distinction between Quest completion, reward outbox, reward_candidate and Points grant;
- integration rule: Space may display Quest participation only from Quest/Connect projections, not own reward history.

### Stage 10.5 — Badge / Progression Embodiment

Pass forward:

- `NFTBadge` legacy type and `NFTView`;
- Space badge/progression candidates;
- rule that Space can emit contribution signals, but badge authority must award badges;
- badge != NFT_mint and Space_NFT_view != NFT_ownership.

### Stage 10.6 — Connect Projection Alignment

Pass forward:

- Space balance/activity/referral summaries;
- replacement target for legacy Space balances and transaction history;
- Connect-owned read-only projection requirement;
- Dashboard != receipt and ActivityFeed != audit_trail.

### Stage 10.10 — UX Copy & Semantic Cleanup

Pass forward:

- Space Points/G2A/NFT/voucher/referral copy;
- old mock labels in legacy components;
- page naming risk around `/space/nft`;
- copy distinction between activity, projection, contribution signal and economic fact.

### Stage 10.11 — MVP Cutline

Pass forward:

- MVP-ready as social layer, not Points producer;
- internal beta boundaries for activity projections;
- blocked status for Space producer activation;
- quarantine list for any remaining mock economy components.

### Deferred until implementation readiness

Do not implement until after policy/authority readiness:

- contribution scoring service;
- moderation accepted contribution pipeline;
- durable anti-abuse graph/ring detection;
- Space producer service;
- Points grant for Space contributions;
- badge/progression integration;
- Connect projection replacement for Space economy views.

## 12. Multi-Agent Review Synthesis

| Role | Stage 10.3 assessment |
|---|---|
| ИИ-архитектор | Space should be embodied as social contribution layer, not isolated and not promoted to economy authority. Runtime activity projections can become inputs to future contribution policy. |
| ИИ-аналитик | Current product model is promising but vocabulary is ahead of runtime. User value is social participation; economy value must be mediated by quality, moderation and anti-abuse. |
| ИИ-бэкенд-разработчик | Space/Reactions runtime creates activity facts/projections and has some idempotency/throttle controls, but no Points producer, reward outbox, moderation gate or contribution scoring. |
| ИИ-фронтенд-разработчик | Active Space UI is more honest than the legacy mock cluster, but orphan/exported Balance/NFT/Quest/Voucher/Referral components remain risky and should be quarantined. |
| ИИ-тестировщик | MVP cutline is social-only. Any reward or Points claim needs separate evidence path; no test/staging/live evidence is used in Stage 10.3. |
| ИИ-специалист по безопасности | Direct rewards for posts, likes or reposts are unsafe because of farming, bots, rings, duplicate content and self-reward loops. Abuse controls are prerequisites, not follow-ups. |
| ИИ-технический писатель | Canonical wording should preserve activity/projection/contribution/economic fact separation and keep future-only concepts explicit. |

## 13. Guardrails Reconfirmed

Inherited Stage 9 guardrails:

```text
token != money
NFT != receipt
badge != NFT_mint
Points != payout_system
Wallet != financial_wallet
RF != cashback_system
RF_redeem != payout
Quest_completion != reward_grant
Dashboard != receipt
ActivityFeed != audit_trail
screenshot != proof
diagnostics != rollout_evidence
contract != activation
stable_enough != launch_ready
slice_16_status = blocked_not_triggered
```

Stage 10.3 Space guardrails:

```text
Space_activity != Points_grant
Space_post != reward_grant
Space_reaction != reward_grant
Space_repost != reward_grant
Space_mock_balance != Points_balance
Space_NFT_view != NFT_ownership
Space_badge_mock != badge_award
Space_transaction_mock != ledger_row
Space_contribution_signal != economic_fact
Space_producer_candidate != active_producer
```

## 14. Final Verdict

```text
stage_10_3_status: completed_as_docs_first_space_embodiment_audit
space_asia_should_be_isolated: false
space_asia_should_be_embodied: true
space_active_points_producer: false
space_activity_runtime_status: production_shaped_social_activity_plus_activity_projection
space_mock_economy_risk: high
space_producer_illusion_risk: high
space_contribution_model_defined: true
space_points_producer_candidates_count: 10
space_mvp_ready_as_social_layer: true
space_mvp_ready_as_points_producer: false
space_badge_progression_current_runtime: false
space_badge_progression_candidate_model_defined: true
space_mock_quarantine_required: true
space_points_activation_allowed_in_stage_10_3: false
space_nft_g2a_onchain_activation_allowed_in_stage_10_3: false
recommended_next_slice: Stage_10_4_Quest_Economy_Embodiment
slice_16_status: blocked_not_triggered
```

Honest Stage 10.3 conclusion:

Space нужен Go2Asia как социальный слой и будущий source of contribution signals. Его нельзя выкидывать и нельзя изолировать. Но Space нельзя считать текущим Points producer, а его mock economy cluster должен оставаться quarantined until aligned. Space может стать producer layer только после contribution model, moderation, anti-abuse, durable idempotency, Connect projection alignment and MVP cutline.
