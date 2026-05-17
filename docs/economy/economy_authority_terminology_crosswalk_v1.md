# Go2Asia Economy Authority & Terminology Crosswalk v1

Date: 2026-05-17
Status: `NOTE_READY_STAGE_6_5_1_ECONOMY_AUTHORITY_TERMINOLOGY_CROSSWALK_DOCS_ONLY`
Stage: `Stage 6.5.1 / Economy Authority & Terminology Crosswalk`
Mode: docs-only alignment aid, terminology guard, authority reading crosswalk, no runtime changes, no migrations, no API changes, no schema changes, no implementation changes, no runtime authority switch, no runtime policy rewrite, no Tier 1 policy rewrite, no reward producer activation, no accrual pipeline activation, no spend enforcement activation, no fraud engine activation, no enforcement activation, no ledger activation, no payout activation, no settlement activation, no wallet activation, no token activation, no G2A activation, no NFT activation, no on-chain activation, no production/runtime activation, no rollout plan, no implementation tasks, no evidence execution, no validation execution, no test plan, no QA acceptance, no Slice 16 readiness, no Slice 16 unblock

## 1. Purpose

This document is a Stage 6.5 alignment aid for reading Go2Asia economy, architecture, backend, UI, product, RF/voucher, and future ledger/token documents after Stage 6.

It exists to help Cursor sessions, developers, reviewers, and AI agents avoid mixing:

- current runtime authority;
- Stage 6 semantic doctrine;
- future, legacy, target, and background economy documents;
- backend/service wording;
- UI/product wording;
- roadmap wording;
- future ledger/token vocabulary.

This document is:

- a reading guard;
- a terminology guard;
- an anti-drift crosswalk;
- a Stage 6.5 alignment support document;
- a docs-only reference.

This document is not:

- runtime authority;
- a runtime policy rewrite;
- a replacement for `docs/economy/points_policy_v1.md`;
- a replacement for `docs/economy/referral_network_rewards_policy_v1.md`;
- a ledger design;
- a reward table;
- a backend service contract;
- an API contract;
- a schema design;
- a UI implementation guide;
- a product copy rewrite;
- an implementation plan;
- an activation artifact;
- a payout or settlement model;
- a Slice 16 readiness artifact.

Core reading formula:

```text
soft_economy_now
ledger_later
enforcement_much_later
```

Phase G firewall preserved:

```text
diagnostics != authority
shadow_graph != enforcement
Phase_G_closure != execution_authorization
Phase_G_closure != enforcement_approval
slice_16_status: blocked_not_triggered
```

## 2. Authority Hierarchy

### Tier 1 - Runtime Authority

Tier 1 controls current runtime interpretation.

Documents:

- `docs/economy/points_policy_v1.md`
- `docs/economy/referral_network_rewards_policy_v1.md`

Use Tier 1 to answer:

- what is active in current runtime;
- what is target policy but not fully implemented;
- what is future-only;
- what current runtime limitations must not be overread;
- which service owns current runtime facts where the policy explicitly says so.

Tier 1 does not become broader just because a Tier 2 or Tier 3 document uses stronger language.

### Tier 2 - Semantic Doctrine

Tier 2 controls shared semantic language, classification, and anti-drift boundaries.

Documents:

- `docs/architecture/domain/economy_scope_reentry_note_v1.md`
- `docs/economy/points_rewards_policy_v1.md`
- `docs/economy/points_rewards_policy_v1_consolidation.md`
- `docs/economy/layered_value_architecture_v1.md`
- `docs/economy/points/semantic_axes_of_points_v1.md`
- `docs/economy/points_taxonomy_v1.md`
- `docs/economy/reward_event_catalog_v1.md`
- `docs/economy/reward_lifecycle_soft_accrual_rules_v1.md`
- `docs/economy/role_based_rewards_matrix_v1.md`
- `docs/economy/referral_network_reward_model_alignment_v1.md`
- `docs/economy/rf_voucher_reward_policy_v1.md`
- `docs/economy/quest_badge_achievement_compatibility_v1.md`
- `docs/economy/reward_sizing_sink_pressure_modeling_v1.md`
- `docs/economy/future_ledger_readiness_v1.md`
- `docs/economy/abuse_dispute_correction_soft_policy_v1.md`

Use Tier 2 to answer:

- how to describe Points safely;
- how to classify origin, visibility, spendability, authority, lifecycle, utility, and risk;
- how to describe reward events without activating producers;
- how to discuss roles without creating RBAC or payout rights;
- how to describe referral/network value without MLM or passive income;
- how to describe RF/voucher utility without cashback or settlement;
- how to discuss future ledger readiness without ledger implementation;
- how to discuss abuse/dispute/correction without enforcement.

Tier 2 is doctrine and language governance. It does not replace Tier 1 runtime authority.

### Tier 3 - Future / Legacy / Target / Background

Tier 3 provides broader context, older strategy, target product direction, and future economy vocabulary.

Examples:

- tokenomics documents;
- VIP value system documents;
- RF voucher economy documents;
- Points sink design documents;
- G2A and token concepts;
- NFT/Totem concepts;
- on-chain and bridge concepts;
- older backend/module roadmaps;
- older Connect, wallet, referral, voucher, NFT, blockchain gateway, quest, and module plans.

Tier 3 must be read as background, target, legacy, or future unless Tier 1 explicitly confirms current runtime status.

Tier 3 must not be used to activate:

- G2A;
- NFT/Totem;
- on-chain bridge;
- token withdrawal;
- partner payout;
- PRO payout;
- cashback;
- settlement;
- full VIP entitlement lifecycle;
- `referral_unlock`;
- network accrual producers;
- hard `lockedPoints` spend enforcement;
- ledger writes;
- reward producers.

## 3. Reading Rules

### 3.1 Tier precedence

If Tier 3 conflicts with Tier 1, Tier 1 wins for current runtime interpretation.

If Tier 3 uses stronger financial, token, wallet, income, settlement, or payout language, Stage 6 doctrine controls how that language may be read.

If Tier 2 semantic doctrine conflicts with Tier 1 runtime facts, Tier 1 controls current runtime and Tier 2 controls safe language for future alignment.

### 3.2 Legacy and future wording

Future vocabulary does not imply current runtime.

Roadmap language does not imply implementation authority.

Backend service wording does not imply active service behavior unless runtime-backed.

UI wording does not imply ledger truth.

Product copy does not imply payout, spendability, settlement, token liquidity, or investment value.

### 3.3 Runtime wording

A document may mention runtime concepts without activating runtime.

The following words require an explicit Tier 1 or separately approved runtime contract before they can be treated as active runtime:

- ledger;
- spendable;
- available for spend;
- hard lock;
- unlock;
- producer;
- accrual pipeline;
- reward calculation;
- payout;
- settlement;
- withdrawal;
- token;
- bridge;
- NFT marketplace;
- enforcement;
- fraud engine;
- fail-closed;
- deny;
- authority switch.

### 3.4 Current safe reading

Unless Tier 1 or a separate runtime contract says otherwise:

```text
future_language: future_or_target
roadmap_language: not_authority
UI_language: not_ledger_truth
backend_doc_language: not_activation
semantic_doctrine: not_implementation
closure_note: not_authorization
readiness_note: not_implementation
```

## 4. Core Doctrine Crosswalk

| Unsafe interpretation | Safe interpretation |
|---|---|
| Points = money | Points = internal utility and participation value |
| Points = cash balance | Points = internal off-chain loyalty/accounting unit where runtime-backed |
| Points = investment product | Points = non-financial ecosystem utility |
| VIP = payout right | VIP = activation and participation layer |
| VIP = financial entitlement | VIP = spend-access context where runtime-backed |
| origin = currency type | origin = metadata about source/context |
| visible = spendable | visible = display or projection only unless runtime-backed |
| projected = ledger truth | projected = estimate, read model, or explanatory projection |
| conditional = available | conditional = value waiting for a condition or future unlock |
| available = payout | available = internal availability only where runtime-backed |
| reward event = ledger write | reward event = semantic event class unless separately implemented |
| lifecycle = state machine | lifecycle = semantic vocabulary unless separately implemented |
| role = payout right | role = participation context unless separately specified by runtime policy |
| referral/network = passive income | referral/network = participation and growth utility |
| referral/network = MLM | referral/network = bounded internal utility, not MLM or financial network |
| RF voucher = cashback | RF voucher = practical utility and consumption layer |
| RF voucher = settlement | RF voucher = voucher lifecycle/utility, not merchant settlement by itself |
| progression = paid task | progression = identity, prestige, retention, and learning utility |
| readiness = implementation | readiness = future compatibility language only |
| soft policy = enforcement | soft policy = trust/correction language without enforcement |
| wallet = financial account | wallet/Connect = read-only projection unless separately promoted |
| token roadmap = payout promise | token roadmap = future layer, not current withdrawal or liquidity |
| Phase G closure = execution authorization | Phase G closure = docs-only governance closure |
| Slice 16 is unblocked | `slice_16_status: blocked_not_triggered` |

## 5. Role Terminology Crosswalk

Go2Asia documents may use role language in several different ways. These meanings must not be merged.

### 5.1 Economy participation roles

Economy participation roles describe how an actor participates in value creation, consumption, progression, or ecosystem growth.

Examples:

- Guest;
- Spacer;
- VIP;
- PRO;
- Partner.

Safe reading:

- `Guest` can observe and participate in limited surfaces.
- `Spacer` can participate and accumulate internal utility.
- `VIP` can unlock participation/spend context where runtime-backed.
- `PRO` can contribute operator/creator value.
- `Partner` can contribute supply, places, offers, or practical utility.

Unsafe reading:

- role = RBAC;
- role = permission matrix;
- role = payout right;
- role = settlement right;
- role = active entitlement authority;
- role = reward producer class.

### 5.2 UI labels

UI labels are presentation language. They do not create runtime authority.

Examples:

- Wallet;
- Rewards;
- Balance;
- VIP;
- PRO rewards;
- Partner dashboard;
- Referral contribution.

Safe reading:

- UI labels explain or display internal state/projections.
- UI labels must follow Tier 1 and Tier 2 boundaries.
- UI labels do not prove spendability, payout, token liquidity, or settlement.

### 5.3 Auth/RBAC roles

Auth/RBAC roles control access, permissions, moderation, or administrative capabilities.

They must be kept separate from economy participation roles.

Safe reading:

- auth role controls access;
- economy role describes participation;
- entitlement vocabulary describes future or runtime-backed capability only where explicitly confirmed.

### 5.4 Future entitlement vocabulary

Future entitlement vocabulary may describe a target capability, but it does not activate the capability.

Safe reading:

- VIP entitlement vocabulary may describe target time-bounded spend capability.
- It does not switch runtime authority unless a separate approved contract and implementation exist.

Explicit boundaries:

```text
role != RBAC
role != payout_right
role != settlement_authority
role != reward_producer
PRO != commission_guarantee
Partner != settlement_authority
VIP != payout_layer
VIP != automatic_authority_switch
```

## 6. Backend / Service Boundary Crosswalk

Backend and service documents often use target or architectural language. They must be read through Tier 1 and Stage 6 boundaries.

### 6.1 Points Service

Safe reading:

- Points Service owns Points ledger/balance concepts only where runtime-backed.
- Points Service may be the conceptual owner for internal Points accounting.
- Available, locked, conditional, projected, and network buckets must follow Tier 1 status.

Unsafe reading:

- every `available_balance` mention is spend authority;
- wallet buckets are ledger truth;
- visible values are spendable;
- conditional values can be spent;
- available internal value is payout.

### 6.2 Referral Service

Safe reading:

- Referral Service owns referral codes, referral graph facts, referral relations, and referral metadata/read models.
- Referral Service does not create payout, commission, passive income, or MLM semantics.
- `referral_unlock`, `network_accrual_level_1`, and `network_accrual_level_2` are not active producers unless Tier 1 or a separate runtime contract confirms activation.

Unsafe reading:

- referral tree = payout tree;
- referral rewards = passive income;
- referral percentages = affiliate commission;
- projected network value = granted wallet balance.

### 6.3 RF Service / Voucher Service

Safe reading:

- RF Service owns voucher lifecycle where runtime-backed.
- Voucher Service/RF wording describes practical utility and consumption.
- Points spend for RF/voucher context remains internal utility spend, not cash payment.

Unsafe reading:

- voucher claim = purchase settlement;
- voucher redeem = partner payout;
- partner benefit = financial settlement;
- voucher utility = cashback;
- RF lifecycle = marketplace settlement.

### 6.4 Connect

Safe reading:

- Connect is read-only projection, explanation UI, and safe display surface unless separately promoted.
- Connect may show wallet-like projections, referral explanations, and participation summaries.

Unsafe reading:

- Connect owns economy authority;
- Connect owns ledger;
- Connect grants rewards;
- Connect performs reward calculations;
- Connect activates spendability;
- Connect wallet is a financial wallet.

### 6.5 Blockchain Gateway / NFT / Token Layer

Safe reading:

- Blockchain Gateway, NFT, Token, G2A, on-chain, bridge, marketplace, withdrawal, and liquidity language is future/target unless separately promoted by policy, implementation, and runtime contract.

Unsafe reading:

- G2A is currently withdrawable;
- NFT/Totem is currently a marketplace asset;
- on-chain bridge is current user-facing liquidity;
- token roadmap is payout promise;
- wallet linking activates external value.

## 7. UI / Product Copy Crosswalk

UI and product surfaces must avoid words that turn internal utility into financial, payout, or investment semantics.

### 7.1 Avoid for current product surfaces

Avoid these words unless clearly marked as legacy/future and non-current:

- earnings;
- income;
- passive income;
- commission;
- payout;
- cashout;
- withdraw;
- cashback;
- settlement;
- investment;
- liquidity;
- yield;
- profit;
- financial wallet;
- token withdrawal;
- marketplace sale.

### 7.2 Use safer language

Prefer:

- internal points;
- participation value;
- projected value;
- conditional value;
- value with conditions;
- read-only projection;
- available for internal use where runtime-backed;
- future layer;
- target layer;
- practical utility;
- consumption utility;
- referral contribution;
- network participation;
- correction;
- recovery;
- internal spend.

### 7.3 UI display rules

UI language must preserve:

```text
display != spend_permission
projection != ledger_truth
wallet_label != financial_wallet
transaction_label != external_financial_transaction
reward_label != payout
G2A_label != current_withdrawable_token
NFT_label != current_marketplace_asset
```

If UI uses `wallet`, it must be read as read-only projection unless a future approved authority promotes it.

If UI uses `balance`, it must not imply payout or external financial claim.

If UI uses `earned`, it should be checked against Stage 6 wording and usually replaced in future alignment passes with participation-safe wording.

## 8. RF / Voucher Crosswalk

RF/voucher language must remain practical utility and consumption language.

Safe interpretations:

- claim = user action to reserve or obtain voucher utility where runtime-backed;
- redeem = consumption/lifecycle event where runtime-backed;
- Points spend = internal utility spend, not cash payment;
- RF/voucher benefit = practical ecosystem utility;
- partner participation = supply/practical utility contribution;
- PRO attribution = attribution context, not payout entitlement;
- compensation = operational correction/recovery, not reward loop.

Unsafe interpretations:

- claim = purchase settlement;
- redeem = partner payout;
- Points spend = cash payment;
- voucher = cashback;
- voucher = refund;
- compensation = earnable reward;
- partner benefit = settlement obligation;
- PRO attribution = commission or payout right;
- premium voucher = tokenized financial product;
- offline benefit = platform payment obligation.

RF/voucher boundary:

```text
RF_voucher != cashback
RF_voucher != payment_settlement
RF_voucher != partner_payout
RF_voucher != affiliate_payout
RF_voucher != marketplace_settlement
RF_voucher_policy != runtime_voucher_engine
```

## 9. Future Ledger / Token Crosswalk

Future ledger and token language exists to preserve semantic clarity for later stages.

Safe interpretations:

- future ledger readiness = future compatibility vocabulary;
- ledger vocabulary = semantic candidates unless separately implemented;
- value history = future explanatory model;
- projected value = read-only estimate/projection;
- conditional value = not available balance;
- available value = internal availability only where runtime-backed;
- G2A = future/external layer unless separately activated;
- NFT/Totem = future/progression/external layer unless separately activated;
- on-chain bridge = future technical contour unless separately activated;
- token roadmap = future possibility, not payout promise.

Unsafe interpretations:

- future ledger readiness = active ledger;
- ledger vocabulary = approved schema;
- read model = implementation;
- projected network value = ledger truth;
- conditional referral value = spendable;
- available value = payout claim;
- G2A = current withdrawable token;
- NFT/Totem = current marketplace asset;
- bridge = current user-facing liquidity;
- token roadmap = investment, cashout, or settlement promise.

Future layer boundary:

```text
future_ledger_readiness != active_ledger
readiness != implementation
G2A != current_withdrawable_token
NFT_Totem != active_marketplace_asset
on_chain_bridge != current_liquidity
token_roadmap != payout_promise
```

## 10. Protected Boundaries

The following boundaries are protected for Stage 6.5 and later alignment work:

- no runtime activation;
- no runtime authority switch;
- no Tier 1 policy rewrite;
- no Stage 6 doctrine rewrite;
- no ledger activation;
- no ledger schema approval;
- no database schema;
- no API changes;
- no service activation;
- no reward producer activation;
- no accrual pipeline activation;
- no spend enforcement activation;
- no hard `lockedPoints` enforcement activation;
- no `referral_unlock` producer activation;
- no network accrual producer activation;
- no payout activation;
- no partner settlement activation;
- no PRO payout activation;
- no cashback activation;
- no wallet activation;
- no token activation;
- no G2A activation;
- no NFT/Totem activation;
- no on-chain activation;
- no marketplace activation;
- no fraud engine activation;
- no deny/fail-closed enforcement;
- no UI implementation;
- no product copy rewrite across app;
- no roadmap rewrite;
- no Slice 16 readiness;
- no Slice 16 unblock.

Canonical invariants:

```text
Points are internal utility, not money.
VIP is activation layer, not payout layer.
origin is metadata, not currency type.
visible != spendable.
projected != ledger truth.
conditional != available.
available != payout.
reward event != ledger write.
lifecycle != state machine.
role != payout right.
referral/network != MLM/passive income.
RF/voucher != cashback/settlement.
progression != paid task.
readiness != implementation.
soft policy != enforcement.
```

## 11. Stage 6.5 Usage Rules

Future Stage 6.5 slices should use this document as:

- a reading guard;
- a terminology guard;
- an authority hierarchy reminder;
- an anti-drift checklist;
- a review gate input;
- a source for safe/unsafe wording classification.

Future Stage 6.5 slices must not use this document as:

- an implementation plan;
- a migration plan;
- an API contract;
- a service boundary rewrite;
- a ledger schema;
- a reward engine spec;
- a UI copy rewrite instruction;
- a payout/settlement spec;
- a runtime activation approval;
- a Slice 16 unblock artifact.

Recommended review questions:

1. Does this wording imply runtime authority where none exists?
2. Does this wording imply ledger truth from a projection?
3. Does this wording imply spendability from visibility?
4. Does this wording imply payout from availability?
5. Does this wording imply passive income from referral/network participation?
6. Does this wording imply cashback or settlement from RF/voucher utility?
7. Does this wording imply current token/NFT/on-chain activation?
8. Does this wording imply enforcement from soft policy?
9. Does this wording imply Slice 16 movement?

Required Stage 6.5 output classification:

```text
alignment_document: allowed
terminology_crosswalk: allowed
authority_map: allowed
runtime_activation: forbidden
implementation_plan: forbidden
slice_16_movement: forbidden
```

## 12. Recommended Next Alignment Targets

Stage 6.5.2+ should apply this crosswalk to the following document groups:

1. Architecture platform docs:
   - `docs/architecture/platform/**`
   - platform overview, backend services architecture, interface architecture, attribution maps.

2. Architecture domain docs:
   - `docs/architecture/domain/rf-asia-*`
   - `docs/architecture/domain/vip_entitlement_*`
   - Phase G / VIP entitlement notes where wording may imply enforcement proximity.

3. Backend service docs:
   - `docs/backend/connect_service/**`
   - `docs/backend/points_service/**`
   - `docs/backend/referral_service/**`
   - `docs/backend/voucher_service/**`
   - `docs/backend/rf_service/**`
   - `docs/backend/nft_service/**`
   - `docs/backend/blockchain_gateway_service/**`

4. Module and product-like roadmap docs:
   - `docs/modules/connect/**`
   - `docs/modules/quest/**`
   - `docs/modules/rf_partners/**`
   - other module roadmaps that mention wallet, earnings, G2A, NFT, rewards, commission, payout, settlement, or token conversion.

5. UI docs:
   - `frontend-shell/docs/ui/**`
   - especially Connect/wallet, Space/balance, RF/PRO rewards, Quest/rewards/NFT surfaces.

6. Economy Tier 3 docs:
   - tokenomics;
   - VIP value system;
   - RF voucher economy;
   - Points sink design;
   - future token/NFT/on-chain docs.

Next slice guidance:

```text
recommended_next_slice: Stage 6.5.2 Architecture Platform Economy Terminology Alignment
mode: docs_only_alignment
primary_goal: apply authority and terminology crosswalk to platform architecture wording
implementation_status: forbidden
runtime_activation_status: forbidden
slice_16_status: blocked_not_triggered
```

## 13. Review Gate Checklist

This document is acceptable only if all review gates preserve the following:

```text
economy_review: semantic_crosswalk_only
runtime_governance_review: no_authority_switch
security_fraud_review: no_payout_settlement_or_enforcement_activation
architecture_review: no_service_boundary_rewrite
backend_review: no_backend_contract_or_api_change
canon_review: no_Tier_1_rewrite_no_Stage_6_rewrite
qa_review: docs_only_acceptance_no_runtime_validation
```

No review gate may reinterpret this document as implementation approval.

## 14. Final Status

Stage 6.5.1 creates an authority and terminology reading crosswalk.

It clarifies how to read existing economy, architecture, backend, UI, product, RF/voucher, and future ledger/token wording after Stage 6.

It does not change runtime.

It does not rewrite Tier 1 policy.

It does not activate ledger, reward producers, spend enforcement, payout, settlement, wallet, token, G2A, NFT, on-chain systems, fraud engine, or Slice 16.

Final boundary:

```text
stage_6_5_1_status: docs_only_alignment_crosswalk_ready
runtime_activation: false
authority_switch: false
ledger_activation: false
reward_producer_activation: false
spend_enforcement_activation: false
payout_activation: false
settlement_activation: false
wallet_token_activation: false
slice_16_status: blocked_not_triggered
```
