# RF / Voucher Reward Policy v1

Date: 2026-05-17  
Status: `NOTE_READY_STAGE_6_7_RF_VOUCHER_REWARD_POLICY_DOCS_ONLY`  
Stage: `Stage 6.7 / RF / Voucher Reward Policy v1`  
Mode: semantic RF / Voucher utility and consumption policy language, docs-only, read-only reference, explanatory classification only, no runtime changes, no migrations, no API changes, no feature flags, no implementation changes, no payment system, no partner settlement system, no cashback system, no affiliate payout system, no marketplace settlement model, no runtime voucher engine, no RF claim engine specification, no reward producer activation, no accrual pipeline activation, no ledger activation, no ledger implementation, no spend enforcement, no enforcement mechanics, no payout activation, no payout pipeline, no partner settlement activation, no financial accounting system, no production/runtime activation, no execution authorization, no governance approval, no Slice 16 readiness, no Slice 16 unblock, no rollout strategy, no implementation plan, no operational mandate, no evidence execution, no validation execution, no test plan, no QA acceptance, no deny or fail-closed behavior, no payment rejection logic, no authority switching

## 1. Purpose

This document formalizes semantic reward and utility policy language around the RF / Voucher economy in Go2Asia.

It answers one question:

```text
How should Go2Asia describe RF utility, voucher utility, voucher participation, voucher consumption, voucher spend, voucher sinks, offline benefit, practical utility, and ecosystem density without creating payment settlement, cashback, affiliate payout, partner payout, marketplace settlement, or runtime activation semantics?
```

Main thesis:

```text
RF / Voucher rewards in Go2Asia describe practical utility, consumption participation, and ecosystem density semantics,
not payment settlement, cashback, affiliate payout, or marketplace payout systems.
```

This document is semantic RF / Voucher utility and consumption policy language.

It does not define a payment system, partner settlement system, cashback system, affiliate payout system, runtime voucher engine, reward producer, accrual pipeline, ledger implementation, or spend enforcement model.

## 2. Explicit Non-Goals

This document is not:

- a payment system;
- a partner settlement system;
- a cashback system;
- an affiliate payout system;
- a marketplace settlement model;
- a merchant remittance model;
- a partner payout model;
- a PRO payout model;
- a runtime voucher engine;
- an RF claim engine specification;
- a reward producer implementation;
- an accrual pipeline;
- a ledger implementation;
- a ledger transition model;
- a spend enforcement model;
- a payout pipeline;
- a financial accounting system;
- an API contract;
- an event schema;
- a database schema;
- a migration plan;
- a rollout plan;
- a production activation artifact;
- an implementation task list.

Non-goal classification:

```text
rf_voucher_reward_policy_role: semantic_utility_consumption_policy_language_only
payment_system_status: not_payment_system
partner_settlement_system_status: not_partner_settlement_system
cashback_system_status: not_cashback_system
affiliate_payout_system_status: not_affiliate_payout_system
marketplace_settlement_model_status: not_marketplace_settlement_model
runtime_voucher_engine_status: not_defined
reward_producer_activation_status: not_activated
accrual_pipeline_activation_status: not_activated
ledger_implementation_status: not_defined
spend_enforcement_status: not_activated
payout_pipeline_status: not_activated
partner_settlement_activation_status: not_activated
implementation_plan_status: not_implementation_plan
```

## 3. Reading Contract

This document must be read together with:

- `docs/economy/README.md`;
- `docs/economy/points_policy_v1.md`;
- `docs/economy/referral_network_rewards_policy_v1.md`;
- `docs/economy/layered_value_architecture_v1.md`;
- `docs/economy/points/semantic_axes_of_points_v1.md`;
- `docs/economy/points_taxonomy_v1.md`;
- `docs/economy/reward_event_catalog_v1.md`;
- `docs/economy/reward_lifecycle_soft_accrual_rules_v1.md`;
- `docs/economy/role_based_rewards_matrix_v1.md`;
- `docs/economy/referral_network_reward_model_alignment_v1.md`;
- `docs/economy/tokenomics/go2asia_tokenomics_v1.md`;
- `docs/economy/vip/vip_value_system_v1.md`;
- `docs/economy/points/points_sink_design_v1.md`;
- `docs/economy/vouchers/rf_voucher_economy_v1.md`;
- `docs/architecture/domain/economy_scope_reentry_note_v1.md`;
- relevant Phase G closure documents.

If this policy appears to conflict with runtime-aligned policy, the runtime-aligned policy controls runtime interpretation:

```text
runtime_policy_authority: points_policy_v1_and_referral_network_rewards_policy_v1
rf_voucher_reward_policy_authority_status: semantic_non_runtime
rf_voucher_reward_policy_replaces_runtime_policy: false
rf_voucher_reward_policy_changes_current_runtime: false
```

Current runtime interpretation must continue to follow the Runtime Alignment Note in `docs/economy/README.md`.

In particular:

```text
RF_paid_voucher_spend: runtime_aligned_only_where_points_policy_and_runtime_contract_confirm
RF_Service: voucher_lifecycle_owner
Points_Service: Points_ledger_debit_owner
Connect: read_only_projection_and_explanation_layer
partner_settlement: not_current_runtime_by_this_document
PRO_payout: not_current_runtime_by_this_document
G2A_distribution: future_or_target_layer_unless_separately_implemented
NFT_or_on_chain_activation: future_or_target_layer_unless_separately_implemented
```

This document does not change those facts.

## 4. Source Materials and Review Scope

This document was prepared after read-first review of the economy SSOT, runtime-aligned Points and referral policies, RF Voucher Economy, Layered Value Architecture, Semantic Axes of Points, Points Taxonomy v1, Reward Event Catalog v1, Reward Lifecycle / Soft Accrual Rules v1, Role-Based Rewards Matrix v1, Referral & Network Reward Model Alignment v1, Stage 6.1, and Phase G closure boundaries.

Role perspectives used for semantic review:

- Runtime Governance Architect;
- ИИ-архитектор;
- ИИ-аналитик;
- ИИ-технический писатель;
- Security / Fraud & Abuse reviewer;
- Runtime Validation / QA reviewer for boundary consistency only.

Review boundary:

```text
review_type: read_only_semantic_boundary_review
artifact_scope: rf_voucher_reward_policy_semantic_only
runtime_review_status: not_performed
validation_execution_status: not_executed
evidence_collection_status: not_collected
implementation_tasks_status: none_implied_none_required
```

## 5. Relationship to Stage 6.1 and Phase G

This policy follows `docs/architecture/domain/economy_scope_reentry_note_v1.md`.

It inherits the Stage 6.1 doctrine:

```text
soft_economy_now
ledger_later
enforcement_much_later
```

It also preserves the Phase G governance boundaries:

```text
phase_g_closure != execution_authorization
phase_g_closure != enforcement_approval
phase_g_closure != slice_16_readiness
diagnostics != authority
shadow_graph != enforcement
implementation != rollout
recommendation != authorization
slice_16_status: blocked_not_triggered
production_status: not_touched
```

RF / Voucher Reward Policy v1 is a semantic economy artifact. It is not authority transition, runtime transition, voucher engine activation, producer activation, accrual pipeline activation, ledger activation, payout activation, partner settlement activation, spend enforcement activation, or Slice 16 progression.

## 6. Canonical RF / Voucher Semantic Model

RF / Voucher utility language in Go2Asia should be interpreted through the following canonical model:

```text
available_internal_utility -> VIP_activation_context -> voucher_visibility_or_claim_relevance -> voucher_sink_or_consumption_context -> practical_utility -> offline_benefit -> retention_and_ecosystem_density
```

This model describes semantic movement of utility and consumption language.

It is not:

- a runtime flow;
- a voucher engine;
- a payment flow;
- a merchant settlement flow;
- a cashback loop;
- an affiliate payout path;
- a ledger transition;
- a spend enforcement path.

Canonical interpretation:

```text
RF_utility: practical_city_level_utility
voucher_utility: consumption_and_sink_participation_utility
voucher_participation: interaction_with_consumption_surface
voucher_consumption: practical_utility_use_context
voucher_spend_semantics: Points_sink_attached_consumption_language
voucher_sink_semantics: anti_inflation_and_consumption_loop_language
offline_benefit_semantics: real_world_value_context_not_payment_settlement
ecosystem_density_utility: supply_coverage_and_practical_relevance
```

## 7. RF Utility Semantics

RF utility describes why RF-side offers, partner participation, and voucher surfaces matter in the Go2Asia economy.

It may include:

- practical utility;
- consumption utility;
- city-level utility;
- ecosystem density;
- offer visibility;
- offline benefit bridge;
- retention utility;
- partner offer discovery;
- practical fulfillment capacity.

RF utility is not payout.

RF utility is not settlement.

RF utility is not cashback.

RF utility is not affiliate payout.

Boundary:

```text
RF_utility: practical_city_level_utility
RF_utility != payout
RF_utility != settlement
RF_utility != cashback
RF_utility != affiliate_system
RF_utility != marketplace_settlement
RF_utility != financial_obligation
```

## 8. Voucher Utility Semantics

Voucher utility describes the role of vouchers as the consumption interface for accumulated internal utility.

It may include:

- voucher claim relevance;
- consumption relevance;
- practical value;
- experience access;
- activation pressure;
- spend utility;
- sink participation;
- premium access relevance;
- retention relevance.

Voucher utility is not cashback.

Voucher utility is not affiliate payout.

Voucher utility is not partner settlement.

Boundary:

```text
voucher_utility: consumption_and_sink_participation_utility
voucher_utility != cashback
voucher_utility != affiliate_payout
voucher_utility != partner_payout
voucher_utility != marketplace_settlement
voucher_utility != payment_for_underlying_service
```

## 9. Voucher Consumption Semantics

Voucher consumption describes practical use of a voucher as a consumption surface.

Canonical terms:

```text
voucher_claimed
voucher_consumed
voucher_redeemed
voucher_sink_used
premium_voucher_context
offline_benefit_context
```

### `voucher_claimed`

`voucher_claimed` describes a user action or semantic event where a voucher is claimed.

It may indicate consumption intent or practical utility relevance.

Boundary:

```text
voucher_claimed != partner_settlement
voucher_claimed != payment_for_underlying_service
voucher_claimed != cashback_grant
voucher_claimed != affiliate_reward
voucher_claimed != payout_event
```

### `voucher_consumed`

`voucher_consumed` describes consumption vocabulary for voucher use.

It does not mean financial settlement occurred.

Boundary:

```text
voucher_consumed != payment_settlement
voucher_consumed != partner_payout
voucher_consumed != marketplace_clearing
voucher_consumed != financial_accounting_entry
```

### `voucher_redeemed`

`voucher_redeemed` describes a voucher lifecycle interpretation.

It may matter to RF lifecycle and user experience, but redemption does not automatically create a Points reward.

Boundary:

```text
voucher_redeemed != automatic_reward
voucher_redeemed != cashback
voucher_redeemed != partner_settlement
voucher_redeemed != payout_pipeline
```

### `voucher_sink_used`

`voucher_sink_used` describes consumption through a sink surface.

Boundary:

```text
voucher_sink_used != payment_pipeline
voucher_sink_used != spend_enforcement_by_itself
voucher_sink_used != ledger_activation
voucher_sink_used != partner_settlement
```

### Premium Voucher Context

Premium voucher context describes stronger utility, premium access, or future prestige/sink relevance where separately defined.

Boundary:

```text
premium_voucher_context != G2A_activation
premium_voucher_context != NFT_activation
premium_voucher_context != partner_payout
premium_voucher_context != treasury_obligation
```

### Offline Benefit Context

Offline benefit context describes the practical value users may experience around the underlying real-world offer.

Boundary:

```text
offline_benefit_context != platform_payment_obligation
offline_benefit_context != partner_settlement
offline_benefit_context != accounting_entry
offline_benefit_context != cash_value_claim
```

## 10. Voucher Spend Semantics

Voucher spend semantics describe Points used in a voucher-related consumption or sink context.

They may include:

- spent Points in voucher context;
- sink-attached consumption;
- practical utility exchange;
- anti-inflation burn semantics;
- voucher claim spend vocabulary;
- recovery or correction vocabulary where operationally relevant.

Spent Points in voucher context are internal utility consumption.

Spent Points are not payment settlement.

Spent Points are not payment for the underlying offline service.

Boundary:

```text
voucher_spend_semantics: Points_sink_attached_consumption_language
spent_points_in_voucher_context != partner_settlement
spent_points_in_voucher_context != payment_for_underlying_offline_service
spent_points_in_voucher_context != payout
spent_points_in_voucher_context != cashback
spent_points_in_voucher_context != affiliate_payout
```

## 11. Voucher Sink Semantics

Voucher sink semantics describe how vouchers help consume or burn internal utility value.

Voucher sinks can support:

- anti-inflation;
- consumption loops;
- VIP pressure release;
- practical utility;
- retention;
- premium access relevance;
- progression context where separately defined.

Voucher sink is not payment pipeline.

Boundary:

```text
voucher_sink: consumption_sink_language
voucher_sink != payment_pipeline
voucher_sink != payout_pipeline
voucher_sink != partner_settlement_pipeline
voucher_sink != spend_enforcement_activation
voucher_sink != marketplace_settlement
```

## 12. Practical Utility and Offline Benefit Semantics

Practical utility describes why voucher consumption matters beyond abstract Points balances.

It may include:

- real-world usefulness;
- local offer relevance;
- city-level coverage;
- category coverage;
- partner offer visibility;
- retention through practical benefit;
- trust-building through redeemed or experienced utility.

Offline benefit is a real-world value context.

It is not a platform financial obligation.

Boundary:

```text
practical_utility: real_world_usefulness_context
offline_benefit: real_world_offer_context
practical_utility != financial_obligation
offline_benefit != payment_settlement
offline_benefit != partner_payout
offline_benefit != cash_equivalent
```

## 13. Relationship to Point Taxonomy

RF / Voucher semantics map to `docs/economy/points_taxonomy_v1.md`.

Primary Point class:

```text
RF / Voucher-related Points
```

Related contexts:

```text
Personal Activity Points -> may become voucher-sinkable if ordinary available and policy/runtime allow
RF / Voucher-related Points -> voucher interaction, consumption, RF participation, compensation/recovery context
Quest / Experience Points -> may touch voucher or experience utility where quests use RF surfaces
Progression / Prestige Signals -> may touch premium voucher or status contexts where separately defined
Compensation / Correction Points -> operational recovery only, not reward loop
```

Interpretation:

- RF / Voucher-related Points are semantic internal utility value connected to voucher interaction or consumption context.
- They do not create partner settlement.
- They do not create PRO payout.
- They do not create cashback or affiliate payout.

Boundary:

```text
RF_voucher_point_class != separate_currency
RF_voucher_point_class != partner_balance
RF_voucher_point_class != payout_rule
RF_voucher_point_class != cashback_balance
RF_voucher_point_class != active_reward_producer
```

## 14. Relationship to Reward Event Catalog

RF / Voucher semantics map to `docs/economy/reward_event_catalog_v1.md`.

Primary event families:

```text
RF / Voucher Events
Sink Participation Events
VIP Activation Events where voucher utility creates activation pressure
Progression / Prestige Events where premium or status context is separately defined
Compensation / Correction Events where operational recovery applies
Referral / Network Events only as practical utility relevance, not cashback or affiliate payout
```

Canonical RF / Voucher examples:

```text
voucher_claimed
voucher_redeemed
premium_voucher_claimed
RF_partner_interaction
claim_repost_created
partner_engagement_detected
voucher_claim_participation
voucher_consumption_observed
rf_voucher_claim_spend
rf_voucher_claim_spend_compensation
```

Interpretation:

- RF / Voucher Events describe consumption and offline utility bridge activity.
- Sink Participation Events describe consumption or burn vocabulary.
- Compensation / Correction Events describe operational recovery only.
- Events are not producers.

Boundary:

```text
voucher_event != partner_settlement
voucher_event != payment_for_underlying_service
voucher_event != PRO_payout
voucher_event != active_G2A_distribution
voucher_event != spend_enforcement_by_itself
voucher_event != cashback
voucher_event != affiliate_payout
```

## 15. RF / Voucher Lifecycle Alignment

RF / Voucher semantics must align with `docs/economy/reward_lifecycle_soft_accrual_rules_v1.md`.

Canonical lifecycle alignment:

```text
voucher_visibility -> advisory / visible
voucher_claimed -> observed / classified / claimed context
rf_voucher_claim_spend -> spent where runtime-aligned policy and actual runtime support it
voucher_sink_used -> spent / burned / archived context
voucher_redeemed -> consumed / redeemed / archived context
rf_voucher_claim_spend_compensation -> corrected where operational recovery applies
premium_voucher_context -> advisory / premium-context / future-scoped where separately defined
offline_benefit_context -> practical utility context, not settlement
```

Lifecycle interpretation:

- Observed voucher activity is not automatic reward.
- Classified voucher activity is not a payout right.
- Available value is not guaranteed spend approval.
- Spent value is not partner settlement.
- Burned value is not blockchain activation.
- Corrected value is not a reward loop.

Boundary:

```text
observed_voucher != reward
classified_voucher != payout_right
available_voucher_value != guaranteed_spend_approval
spent != partner_settlement
spent != payment_for_underlying_offline_service
burned != blockchain_activation
corrected != reward_loop
RF_voucher_lifecycle_alignment != runtime_state_machine
```

## 16. RF / Voucher and VIP Relationship

RF / Voucher utility is strongly related to VIP activation and retention.

RF / Voucher utility can create:

- consumption pressure;
- practical utility pressure;
- premium access relevance;
- sink relevance;
- retention through useful offers;
- activation pressure for accumulated internal utility.

VIP is the activation layer for valuable Points spend where policy and runtime allow.

VIP is not payment unlock.

VIP is not settlement authority.

VIP does not convert voucher utility into cashback or payout.

Boundary:

```text
VIP_related_voucher_pressure: consumption_activation_pressure
VIP_pressure != spend_approval
VIP != payment_unlock
VIP != settlement_authority
VIP != cashback_activation
VIP_activation_event != runtime_activation
VIP_spend_context != payment_settlement
```

## 17. RF / Voucher and Role Matrix Relationship

RF / Voucher semantics align with `docs/economy/role_based_rewards_matrix_v1.md`.

Role mapping:

```text
Guest -> voucher visibility and curiosity pressure, no direct spend by default
Spacer -> voucher visibility and consumption pressure, basic sink awareness
VIP -> voucher consumption, standard sinks, premium sinks where policy/runtime allow
PRO -> ecosystem/operator utility, quest/experience density, RF promoter archetype, not payout recipient
Partner -> utility provider, offer surface, offline benefit context, not settlement authority
```

Interpretation:

- Spacer can see practical utility and feel consumption pressure.
- VIP can access consumption context where policy and runtime allow.
- PRO improves ecosystem density and local usefulness.
- Partner provides practical offers and offline benefit context.

Partner is not settlement authority.

PRO is not payout recipient.

Boundary:

```text
Spacer_voucher_visibility != spendable_balance
VIP_voucher_consumption != payment_settlement
PRO != payout_recipient
PRO != commission_role
Partner != settlement_authority
Partner != financial_settlement_layer
Partner_offer_context != payout_obligation
role_relationship != runtime_entitlement
```

## 18. RF / Voucher and Sink Relationship

Vouchers are primary consumption and sink surfaces in the Go2Asia economy.

Vouchers can participate in:

- everyday sinks;
- travel sinks;
- premium sinks;
- experience sinks;
- anti-inflation burn semantics;
- consumption loops;
- progression context;
- retention pressure.

This is sink language, not payment pipeline language.

Boundary:

```text
voucher_sink_participation: consumption_sink_language
voucher_sink != payment_pipeline
voucher_sink != marketplace_settlement
voucher_sink != partner_payout
voucher_sink != affiliate_payout
voucher_sink != cashback_loop
voucher_sink != spend_enforcement_activation
```

## 19. RF / Voucher and Referral / Network Relationship

RF utility can make referral and network participation more practically relevant.

RF utility may strengthen:

- practical relevance;
- retention;
- VIP value;
- ecosystem density;
- city-level utility;
- reasons to return to the ecosystem;
- reasons invited users may find Go2Asia useful.

Referral utility remains participation mechanics.

Voucher utility is not cashback loop.

Referral utility is not affiliate payout.

Boundary:

```text
RF_referral_relationship: practical_utility_relevance
RF_utility != referral_payout_system
voucher_utility != cashback_loop
voucher_utility != affiliate_payout
referral_utility != affiliate_payout
network_utility != voucher_commission
practical_relevance != financial_obligation
```

## 20. RF / Voucher and Future Ledger Vocabulary

RF / Voucher language may prepare future ledger vocabulary.

Future ledger vocabulary may need terms for:

- voucher claim context;
- voucher spend context;
- sink use;
- burn context;
- correction context;
- compensation / recovery context;
- premium voucher context;
- offline benefit context;
- RF partner context;
- PRO/operator context;
- archived voucher consumption context.

But semantic preparation is not ledger activation.

Boundary:

```text
RF_semantics != ledger_activation
voucher_utility != accounting_model
voucher_spend != payment_settlement
voucher_sink != payout_pipeline
voucher_claim_context != accounting_entry
voucher_consumption_context != partner_settlement_entry
future_ledger_vocabulary != ledger_implementation
future_ledger_vocabulary != producer_activation
```

## 21. Service Ownership and Responsibility Alignment

This document preserves ownership boundaries from runtime-aligned policy.

Ownership language:

```text
RF_Service -> voucher lifecycle and voucher spend coupling
Points_Service -> Points ledger debit, balances, transactions, compensation where runtime-aligned
Connect -> read-only projection and explanation layer
Partner -> practical offer / offline utility provider, not settlement authority
PRO -> operator / creator / ecosystem density role, not payout recipient
Referral_Service -> referral graph and referral facts, not RF voucher owner
```

Alignment boundary:

```text
RF_Service_lifecycle_owner != partner_settlement_owner
RF_Service != referral_reward_owner
Points_Service_debit_owner != payment_processor
Connect_projection != spend_authority
Partner_offer_provider != settlement_authority
PRO_operator_context != payout_runtime
```

## 22. Safe Wording Guidance

Preferred wording:

- RF utility;
- voucher utility;
- practical utility;
- consumption utility;
- voucher claim relevance;
- voucher sink participation;
- Points spend in voucher context;
- offline benefit context;
- city-level utility;
- offer visibility;
- ecosystem density;
- partner offer surface;
- PRO operator utility;
- operational recovery;
- read-only projection.

Avoid or qualify:

- payment;
- settlement;
- partner payout;
- PRO payout;
- cashback;
- affiliate payout;
- revenue share;
- marketplace settlement;
- merchant remittance;
- financial obligation;
- cash value;
- refund-like reward;
- commission;
- earnings.

Replacement examples:

```text
"cashback" -> "voucher utility" or "consumption relevance"
"partner payout" -> "partner offer context" or "offline benefit context"
"affiliate reward" -> "RF / Voucher practical utility relevance"
"payment for service" -> "Points spend in voucher context, not payment for underlying service"
"marketplace settlement" -> "offline commercial relationship outside this document"
"PRO payout" -> "PRO operator utility context"
```

## 23. RF / Voucher Interaction Patterns

The following patterns are illustrative only.

They are not runtime flows.

They are not implementation tasks.

They are not reward producer definitions.

### Pattern A - VIP Voucher Claim

```text
VIP + voucher_claimed + practical utility relevance
```

Meaning:

VIP can connect accumulated internal utility to practical consumption surfaces.

Boundary:

```text
VIP_voucher_claim_pattern != payment_settlement
voucher_claimed != cashback_grant
practical_utility_relevance != financial_obligation
```

### Pattern B - Spacer Voucher Visibility

```text
Spacer + voucher visibility + consumption pressure
```

Meaning:

Voucher visibility can show why accumulated Points may become useful after activation.

Boundary:

```text
voucher_visibility != spendable_balance
consumption_pressure != spend_approval
Spacer_voucher_visibility != payment_right
```

### Pattern C - Partner Offline Benefit

```text
Partner + RF utility + offline benefit context
```

Meaning:

Partner provides practical offer surfaces and offline benefit context.

Boundary:

```text
Partner_offline_benefit_pattern != settlement_authority
offline_benefit != platform_payment_obligation
RF_utility != partner_payout
```

### Pattern D - PRO Ecosystem Density

```text
PRO + ecosystem density + RF participation utility
```

Meaning:

PRO can help increase local usefulness, offer quality, city density, and RF visibility.

Boundary:

```text
PRO_density_pattern != payout_recipient
RF_participation_utility != commission
ecosystem_density != marketplace_settlement
```

### Pattern E - Voucher Sink Use

```text
voucher_sink_used + consumption semantics + anti-inflation relevance
```

Meaning:

Voucher sink use can consume internal utility and support anti-inflation semantics.

Boundary:

```text
voucher_sink_used_pattern != payment_pipeline
anti_inflation_relevance != financial_accounting
burn_semantics != blockchain_activation
```

### Pattern F - RF Utility and Referral Relevance

```text
RF utility + referral participation + retention relevance
```

Meaning:

RF utility can make referral and network participation more valuable by giving invited users practical reasons to engage.

Boundary:

```text
RF_referral_pattern != cashback_loop
referral_participation != affiliate_payout
retention_relevance != payout_right
```

### Pattern G - Operational Recovery

```text
rf_voucher_claim_spend_compensation + corrected lifecycle semantics + operational recovery
```

Meaning:

RF spend compensation language may describe operational recovery where runtime-aligned policy supports it.

Boundary:

```text
RF_spend_compensation != cashback
RF_spend_compensation != reward_loop
operational_recovery != payout
corrected_lifecycle_semantics != gamification_reward
```

## 24. RF / Voucher Safety Invariants

Required safety invariants:

```text
RF != payout
RF != settlement
RF != cashback
RF != affiliate_system
voucher_utility != affiliate_payout
voucher_spend != payment_settlement
voucher_consumption != partner_settlement
practical_utility != financial_obligation
spent != payout
burned != blockchain_activation
Partner != settlement_authority
PRO != payout_recipient
voucher_sink != payment_pipeline
voucher_reward_policy != runtime_voucher_engine
voucher_reward_policy != reward_producer_activation
voucher_reward_policy != accrual_pipeline_activation
voucher_reward_policy != spend_enforcement
voucher_reward_policy != payout_activation
voucher_reward_policy != settlement_activation
voucher_reward_policy != ledger_activation
diagnostics != authority
shadow_graph != enforcement
```

Additional alignment invariants:

```text
voucher_claimed != cashback_grant
voucher_redeemed != partner_payout
voucher_sink_used != payout_pipeline
premium_voucher_context != G2A_activation
offline_benefit_context != platform_payment_obligation
Partner_offer_context != financial_settlement
PRO_operator_context != payout_runtime
RF_voucher_lifecycle != runtime_engine
```

## 25. Forbidden Interpretations

The following interpretations are forbidden:

- voucher system creates cashback;
- voucher system creates partner payout;
- voucher utility creates affiliate reward;
- RF utility creates marketplace settlement;
- Partner becomes settlement authority;
- PRO becomes payout role;
- voucher consumption becomes payment settlement;
- voucher spend becomes financial obligation;
- voucher sink becomes payment pipeline;
- premium voucher context activates G2A distribution;
- premium voucher context activates NFT or on-chain behavior;
- RF / Voucher model activates producers;
- RF / Voucher model activates accrual pipeline;
- RF / Voucher model activates spend enforcement;
- RF / Voucher model activates payout pipeline;
- RF / Voucher model activates partner settlement;
- RF / Voucher model activates ledger;
- RF / Voucher model creates runtime voucher engine;
- RF / Voucher model creates implementation tasks;
- RF / Voucher model creates rollout tasks;
- RF / Voucher model unblocks Slice 16.

Forbidden interpretation classification:

```text
implicit_cashback_system: forbidden
implicit_partner_payout: forbidden
implicit_affiliate_reward: forbidden
implicit_marketplace_settlement: forbidden
implicit_payment_settlement: forbidden
implicit_financial_obligation: forbidden
implicit_runtime_voucher_engine: forbidden
implicit_reward_producer_activation: forbidden
implicit_accrual_pipeline_activation: forbidden
implicit_spend_enforcement_activation: forbidden
implicit_payout_pipeline_activation: forbidden
implicit_partner_settlement_activation: forbidden
implicit_ledger_activation: forbidden
implicit_slice_16_unblock: forbidden
```

## 26. Relationship to Existing Economy SSOT

This document does not replace existing economy SSOT documents.

Relationship:

- `docs/economy/README.md` remains the economy entry point.
- `docs/economy/vouchers/rf_voucher_economy_v1.md` remains the voucher economy model.
- `docs/economy/points_policy_v1.md` remains the runtime-aligned Points policy.
- `docs/economy/referral_network_rewards_policy_v1.md` remains the runtime-aligned referral and network rewards policy.
- `docs/economy/reward_event_catalog_v1.md` remains the semantic event catalog.
- `docs/economy/points_taxonomy_v1.md` remains the semantic Point taxonomy.
- `docs/economy/points/semantic_axes_of_points_v1.md` remains the coordinate system for Points interpretation.
- `docs/economy/layered_value_architecture_v1.md` remains the value topology.
- `docs/economy/reward_lifecycle_soft_accrual_rules_v1.md` remains the lifecycle and soft accrual semantics.
- `docs/economy/role_based_rewards_matrix_v1.md` remains the role participation semantics.
- `docs/economy/referral_network_reward_model_alignment_v1.md` remains the referral and network semantic alignment.
- `docs/economy/tokenomics/go2asia_tokenomics_v1.md` remains the full economy model.
- `docs/economy/vip/vip_value_system_v1.md` remains the behavioral VIP model.
- `docs/economy/points/points_sink_design_v1.md` remains the sink model.

This document adds semantic RF / Voucher utility and consumption policy language across those documents.

It does not change their authority, runtime interpretation, or implementation status.

## 27. Runtime / QA Boundary

This document is docs-only.

It does not request or perform:

- tests;
- runtime validation;
- QA acceptance;
- evidence collection;
- staging validation;
- production smoke validation;
- rollout validation;
- runtime voucher engine validation;
- RF claim engine validation;
- reward producer validation;
- accrual pipeline validation;
- ledger validation;
- spend enforcement validation;
- payout validation;
- settlement validation;
- entitlement validation.

Runtime Validation / QA may review this artifact for boundary consistency only.

Boundary consistency review is not execution authorization.

Runtime / QA status:

```text
runtime_validation_status: not_executed
qa_status: not_executed
evidence_status: not_collected
acceptance_status: not_requested
tests_status: not_added_not_requested
implementation_tasks_status: none_created
rollout_status: not_created
production_activation_status: not_created
runtime_voucher_engine_status: not_created
reward_producer_activation_status: not_created
accrual_pipeline_activation_status: not_created
ledger_activation_status: not_created
spend_enforcement_activation_status: not_created
payout_activation_status: not_created
payout_pipeline_status: not_created
partner_settlement_activation_status: not_created
entitlement_authority_switch_status: not_created
```

## 28. Naming Boundary

This document is Stage 6.7 in the economy semantic documentation sequence.

It is not:

- RF Slice 6.7;
- an implementation slice;
- a runtime voucher engine slice;
- an entitlement slice;
- an authorization slice;
- a runtime rollout slice;
- a payout slice;
- a settlement slice;
- a ledger slice.

Naming boundary:

```text
stage_6_7_context: economy_semantic_documentation
stage_6_7_rf_voucher_reward_policy_v1 != RF_Slice_6_7
stage_6_7_rf_voucher_reward_policy_v1 != runtime_voucher_engine
stage_6_7_rf_voucher_reward_policy_v1 != payment_system
stage_6_7_rf_voucher_reward_policy_v1 != partner_settlement_system
stage_6_7_rf_voucher_reward_policy_v1 != ledger_implementation
```

## 29. Final Classification

Final classification:

```text
document_type: semantic_RF_voucher_utility_consumption_policy_language
document_mode: docs_only
runtime_changes_added: no
migrations_added: no
api_changes_added: no
feature_flags_added: no
implementation_changes_added: no
runtime_voucher_engine_added: no
payment_system_added: no
partner_settlement_system_added: no
cashback_system_added: no
affiliate_payout_system_added: no
marketplace_settlement_model_added: no
ledger_activation_added: no
ledger_implementation_added: no
reward_producer_activation_added: no
accrual_pipeline_activation_added: no
spend_enforcement_activation_added: no
payout_activation_added: no
payout_pipeline_added: no
partner_settlement_activation_added: no
tests_added_or_requested: no
evidence_added_or_requested: no
runtime_validation_added_or_requested: no
slice_16_status: blocked_not_triggered
production_status: not_touched
final_verdict: rf_voucher_reward_policy_v1_defines_semantic_RF_voucher_utility_and_consumption_policy_language_without_creating_payment_system_partner_settlement_cashback_affiliate_payout_runtime_voucher_engine_reward_producers_accrual_pipeline_ledger_activation_spend_enforcement_payout_activation_settlement_activation_or_slice_16_progression
```
