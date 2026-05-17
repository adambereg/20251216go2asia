# Referral & Network Reward Model Alignment v1

Date: 2026-05-17  
Status: `NOTE_READY_STAGE_6_6_REFERRAL_NETWORK_REWARD_MODEL_ALIGNMENT_DOCS_ONLY`  
Stage: `Stage 6.6 / Referral & Network Reward Model Alignment v1`  
Mode: semantic alignment of referral and network utility language, docs-only, read-only reference, explanatory classification only, no runtime changes, no migrations, no API changes, no feature flags, no implementation changes, no referral payout system, no MLM model, no affiliate commission system, no revenue share model, no partner payout model, no runtime referral engine, no referral service behavior specification, no reward producer activation, no accrual pipeline activation, no ledger activation, no ledger implementation, no spend enforcement, no enforcement mechanics, no payout activation, no payout pipeline, no partner settlement activation, no financial accounting system, no production/runtime activation, no execution authorization, no governance approval, no Slice 16 readiness, no Slice 16 unblock, no rollout strategy, no implementation plan, no operational mandate, no evidence execution, no validation execution, no test plan, no QA acceptance, no deny or fail-closed behavior, no payment rejection logic, no authority switching

## 1. Purpose

This document stabilizes and aligns referral and network utility semantics in Go2Asia after Stage 6.1 through Stage 6.5.

It answers one question:

```text
How should Go2Asia describe referral utility, network utility, conditional referral value, projected network value, VIP-related network pressure, and ecosystem growth utility without creating payout, commission, MLM, passive income, or runtime activation semantics?
```

Main thesis:

```text
Referral and network rewards in Go2Asia describe ecosystem participation and conditional utility semantics,
not payout, commission, MLM, or passive income systems.
```

This document is semantic alignment of referral and network utility language.

It does not define a runtime referral engine, payout model, producer pipeline, ledger implementation, spend enforcement model, partner payout model, or affiliate commission system.

## 2. Explicit Non-Goals

This document is not:

- a referral payout system;
- an MLM model;
- an affiliate commission system;
- a revenue share model;
- a partner payout model;
- a PRO network hierarchy model;
- a runtime referral engine;
- a Referral Service behavior specification;
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
referral_network_alignment_role: semantic_alignment_only
referral_payout_system_status: not_payout_system
MLM_model_status: not_MLM_model
affiliate_commission_system_status: not_affiliate_commission_system
revenue_share_model_status: not_revenue_share_model
runtime_referral_engine_status: not_defined
reward_producer_activation_status: not_activated
accrual_pipeline_activation_status: not_activated
ledger_implementation_status: not_defined
spend_enforcement_status: not_activated
payout_pipeline_status: not_activated
partner_payout_status: not_activated
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
- `docs/economy/tokenomics/go2asia_tokenomics_v1.md`;
- `docs/economy/vip/vip_value_system_v1.md`;
- `docs/economy/points/points_sink_design_v1.md`;
- `docs/economy/vouchers/rf_voucher_economy_v1.md`;
- `docs/architecture/domain/economy_scope_reentry_note_v1.md`;
- relevant Phase G closure documents.

If this alignment appears to conflict with runtime-aligned policy, the runtime-aligned policy controls runtime interpretation:

```text
runtime_policy_authority: points_policy_v1_and_referral_network_rewards_policy_v1
referral_network_alignment_authority_status: semantic_non_runtime
referral_network_alignment_replaces_runtime_policy: false
referral_network_alignment_changes_current_runtime: false
```

Current runtime interpretation must continue to follow the Runtime Alignment Note in `docs/economy/README.md`.

In particular:

```text
referral_locked: current_runtime_where_policy_confirms
referral_unlock: target_policy_or_projection_ready_vocabulary_unless_separately_implemented
network_accrual_level_1: target_policy_or_projection_ready_vocabulary_unless_separately_implemented
network_accrual_level_2: target_policy_or_projection_ready_vocabulary_unless_separately_implemented
VIP_entitlement_lifecycle_for_unlock: target_future_layer_unless_separately_implemented
```

This document does not change those facts.

## 4. Source Materials and Review Scope

This document was prepared after read-first review of the economy SSOT, runtime-aligned Points and referral policies, Layered Value Architecture, Semantic Axes of Points, Points Taxonomy v1, Reward Event Catalog v1, Reward Lifecycle / Soft Accrual Rules v1, Role-Based Rewards Matrix v1, Stage 6.1, and Phase G closure boundaries.

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
artifact_scope: referral_network_reward_model_alignment_semantic_only
runtime_review_status: not_performed
validation_execution_status: not_executed
evidence_collection_status: not_collected
implementation_tasks_status: none_implied_none_required
```

## 5. Relationship to Stage 6.1 and Phase G

This alignment follows `docs/architecture/domain/economy_scope_reentry_note_v1.md`.

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

Referral & Network Reward Model Alignment v1 is a semantic economy artifact. It is not authority transition, runtime transition, referral engine activation, producer activation, accrual pipeline activation, ledger activation, payout activation, spend enforcement activation, partner settlement activation, or Slice 16 progression.

## 6. Canonical Referral / Network Semantic Model

Referral and network utility language in Go2Asia should be interpreted through the following canonical model:

```text
referral_signal -> conditional_referral_value -> advisory_or_visible_pressure -> VIP_related_activation_context -> available_after_valid_unlock_where_policy_and_runtime_allow

network_activity_signal -> projected_or_advisory_network_utility -> VIP_related_network_pressure -> available_if_separately_granted_by_runtime_aligned_policy
```

This model describes semantic movement of utility language.

It is not:

- a runtime flow;
- an event pipeline;
- a ledger transition;
- an unlock engine;
- an accrual engine;
- a payout path;
- an enforcement path.

Canonical interpretation:

```text
referral_utility: conditional_growth_participation_utility
network_utility: participation_and_visibility_utility
referral_visibility: conditional_or_advisory_value_visibility
network_participation: ecosystem_growth_participation_language
conditional_referral_value: visible_but_not_available_until_valid_unlock
projected_network_value: advisory_non_authoritative_value
VIP_related_network_pressure: activation_and_retention_pressure
ecosystem_growth_utility: growth_signal_without_financial_obligation
```

## 7. Referral Utility Semantics

Referral utility describes why referral participation can matter inside the Go2Asia Points economy.

It may include:

- conditional value;
- growth participation;
- ecosystem expansion utility;
- activation pressure;
- visibility utility;
- participation mechanics;
- VIP conversion pressure;
- safe explanation of invited-user relationship context.

Referral utility is not a payout.

Referral utility is not commission.

Referral utility is not affiliate revenue.

Referral utility is not partner settlement.

Boundary:

```text
referral_utility: conditional_growth_participation_utility
referral_utility != payout
referral_utility != commission
referral_utility != affiliate_commission
referral_utility != revenue_share
referral_utility != financial_obligation
referral_utility != partner_settlement
```

## 8. Network Utility Semantics

Network utility describes safe language for invited-user activity, limited network participation, and ecosystem growth relevance.

It may include:

- invited-user activity visibility;
- network participation relevance;
- ecosystem growth language;
- advisory or projected value;
- VIP activation relevance;
- retention pressure;
- limited-depth participation context.

Network utility is participation mechanics.

Network utility is not passive income.

Network utility is not MLM.

Network utility is not a payout system.

Boundary:

```text
network_utility: participation_mechanics
network_utility != passive_income
network_utility != MLM
network_utility != payout
network_utility != commission
network_utility != revenue_share
network_utility != guaranteed_reward
```

## 9. Conditional Referral Value

Conditional referral value is referral-related value that exists with conditions.

Canonical terms:

```text
referral_locked
unlock_candidate
available-after-valid-unlock
projected_referral_value
advisory_referral_visibility
```

### `referral_locked`

`referral_locked` is the current runtime-aligned example of conditional referral value where existing policy confirms it.

Interpretation:

```text
referral_locked: conditional_referral_value
referral_locked_visibility: may_be_visible_where_runtime_and_policy_allow
referral_locked_spendability: not_available_until_valid_unlock
```

Boundary:

```text
referral_locked != payout
referral_locked != commission
referral_locked != available_balance
referral_locked != spendable_balance
referral_locked != guaranteed_unlock
```

### `unlock_candidate`

`unlock_candidate` describes a semantic candidate for future unlock interpretation.

It does not mean unlock happened.

Boundary:

```text
unlock_candidate != unlock_execution
unlock_candidate != available_points
unlock_candidate != ledger_write
unlock_candidate != payout_unlock
unlock_candidate != producer_activation
```

### Available After Valid Unlock

Available-after-valid-unlock describes value that may become available only after required policy and runtime facts support that interpretation.

Boundary:

```text
available_after_valid_unlock != payout
available_after_valid_unlock != automatic_unlock
available_after_valid_unlock != spend_approval
available_after_valid_unlock != partner_settlement
```

### Projected Referral Value

Projected referral value describes explanatory or future-oriented referral utility.

Boundary:

```text
projected_referral_value != granted_reward
projected_referral_value != ledger_truth
projected_referral_value != available_balance
projected_referral_value != payout_right
```

### Advisory Referral Visibility

Advisory referral visibility describes safe explanation of conditional or future potential.

Boundary:

```text
advisory_referral_visibility != authoritative_balance
advisory_referral_visibility != spendable_balance
advisory_referral_visibility != financial_claim
```

## 10. Network Projection Semantics

Network projection describes explanatory visibility of possible network-related utility before it is granted, ledger-backed, or available.

Canonical terms:

```text
projected_network_value
advisory_network_visibility
non_authoritative_network_utility
future_oriented_network_semantics
```

Projected network value may help explain:

- invited-user activity context;
- possible network relevance;
- VIP activation pressure;
- future policy vocabulary;
- ecosystem growth potential.

It must not be treated as granted reward.

Boundary:

```text
projected_network_value != granted_reward
projected_network_value != ledger_truth
projected_network_value != available_balance
projected_network_value != passive_income
projected_network_value != payout_right
advisory_network_visibility != wallet_balance
non_authoritative_network_utility != authoritative_balance
```

## 11. Referral and Network Participation Semantics

Referral participation describes an actor participating in ecosystem growth by inviting or connecting other users to Go2Asia.

Network participation describes limited relationship-based utility language around invited users and their eligible activity context.

Allowed semantics:

- Points for participation;
- Points with conditions;
- participation in ecosystem growth;
- activity of invited users;
- active VIP period;
- conditional value;
- advisory or projected value;
- available value only where policy and runtime separately support it.

Restricted semantics:

- income;
- passive income;
- commission;
- payout;
- MLM;
- downline earnings;
- platform financial obligation;
- partner settlement;
- cash-out.

Boundary:

```text
referral_participation: ecosystem_growth_participation
network_participation: limited_depth_participation_mechanics
referral_participation != affiliate_program
network_participation != MLM_tree
network_participation != passive_income_system
participation_language != financial_obligation
```

## 12. Relationship to Point Taxonomy

Referral and network semantics map to `docs/economy/points_taxonomy_v1.md`.

Mapping:

```text
Referral Events -> Conditional Referral Points
Network Activity Events -> Network Activity Points
referral_locked -> Conditional Referral Points
unlock_candidate -> Conditional Referral Points / lifecycle candidate language
projected_network_value -> Network Activity Points as advisory/projected semantics
available_after_valid_unlock -> ordinary available Points only where policy/runtime support conversion
```

Interpretation:

- Conditional Referral Points are conditional utility and pressure language.
- Network Activity Points are participation mechanics and advisory / policy-gated network utility.
- Ordinary available Points may become fungible only after valid unlock or grant where policy and runtime support that interpretation.

Boundary:

```text
referral_point_class != separate_currency
network_point_class != passive_income_balance
conditional_referral_points != available_points
network_activity_points != guaranteed_reward
point_taxonomy_mapping != reward_producer_config
```

## 13. Relationship to Reward Event Catalog

Referral and network semantics map to `docs/economy/reward_event_catalog_v1.md`.

Primary event families:

```text
Referral Events
Network Activity Events
VIP Activation Events
RF / Voucher Events where practical utility context matters
Sink Participation Events where available value is consumed under policy/runtime
```

Canonical referral examples:

```text
referral_registered
referral_verified
referral_vip_activated
second_level_referral_created
second_level_referral_registered
referral_unlock_candidate
```

Canonical network examples:

```text
referral_activity_observed
second_level_activity_observed
network_growth_detected
network_activity_projection
network_participation_observed
network_value_projection
network_accrual_candidate
```

Interpretation:

- Referral Events describe network growth and conditional utility.
- Network Activity Events describe observed or projected invited-user activity.
- VIP Activation Events provide activation context, not payout activation.
- Events are not producers.

Boundary:

```text
referral_event != payout
referral_event != commission
referral_event != automatic_unlock
network_activity_event != passive_income
network_activity_event != MLM
network_activity_event != ledger_truth
event_family_relationship != runtime_event_bus
event_family_relationship != producer_activation
```

## 14. Referral Lifecycle Alignment

Referral and network semantics must align with `docs/economy/reward_lifecycle_soft_accrual_rules_v1.md`.

Canonical lifecycle alignment:

```text
referral_registered -> observed / classified
referral_locked -> conditional
referral_unlock_candidate -> pending / conditional / advisory
referral_vip_activated -> activation-context, not payout unlock
network_activity_projection -> advisory / projected
network_accrual_candidate -> pending / projected unless separately granted
available_after_valid_unlock -> available only where policy/runtime allow
```

Lifecycle interpretation:

- Observed referral activity is not reward.
- Classified referral activity is not granted value.
- Pending referral value is not available value.
- Conditional referral value is not spendable balance.
- Projected network value is not ledger truth.
- Available-after-valid-unlock is not payout.

Boundary:

```text
observed_referral != reward
classified_referral != granted
pending_referral != available
conditional_referral != available
visible_conditional_referral_value != spendable_balance
projected_network_value != ledger_truth
available_after_valid_unlock != payout
referral_lifecycle_alignment != runtime_state_machine
```

## 15. Referral and VIP Relationship

Referral and network utility are strongly related to VIP pressure and activation-layer semantics.

Referral and network utility can create:

- visible conditional value pressure;
- unlock pressure;
- network participation pressure;
- retention pressure;
- spend context relevance;
- desire to keep accumulated value useful.

VIP is the economic activation layer.

VIP is not payout unlock.

VIP is not commission activation.

VIP does not convert referral semantics into passive income.

Boundary:

```text
VIP_related_referral_pressure: activation_layer_pressure
VIP_pressure != spend_approval
VIP != payout_unlock
VIP != commission_activation
VIP != passive_income_activation
VIP_activation_event != runtime_activation
VIP_activation_context != entitlement_authority_switch
```

## 16. Referral and Role Matrix Relationship

Referral and network semantics align with `docs/economy/role_based_rewards_matrix_v1.md`.

Role mapping:

```text
Guest -> no direct referral/network utility by default
Spacer -> referral participation and conditional referral utility where policy allows
VIP -> network utility visibility and activation-layer relevance
PRO -> ecosystem growth utility and supply-density contribution, not MLM operator
Partner -> practical utility and RF/voucher context, not referral payout participant
```

Interpretation:

- Spacer may participate in referral growth and conditional utility.
- VIP may see stronger network utility relevance due to activation-layer semantics.
- PRO is an ecosystem operator, creator, and supply-density role.
- Partner provides practical utility, offers, and voucher surfaces.

PRO is not:

- MLM leader;
- commission hierarchy owner;
- network payout operator;
- guaranteed income role.

Boundary:

```text
Spacer_referral_participation != payout_right
VIP_network_visibility != passive_income
PRO != MLM_operator
PRO != commission_hierarchy
PRO != network_payout_operator
Partner != affiliate_settlement_layer
role_relationship != runtime_entitlement
```

## 17. Referral and RF / Voucher Economy

Referral and network utility can relate to RF / voucher economy through practical utility, city coverage, and consumption relevance.

RF / voucher relevance may include:

- practical consumption utility;
- voucher awareness;
- ecosystem density;
- city-level utility;
- Partner offer discovery;
- VIP retention through useful sinks.

Referral utility can help bring users toward practical utility, but referral utility is not a cashback loop.

Voucher utility is not affiliate payout.

Voucher claim or consumption is not partner settlement.

Boundary:

```text
referral_RF_relationship: practical_utility_context
referral_utility != cashback_loop
voucher_utility != affiliate_payout
voucher_interaction != partner_settlement
RF_participation != referral_payout_system
Partner_offer_relevance != commission_obligation
```

## 18. Referral and PRO / Operator Relationship

PRO may support referral and network utility indirectly by increasing ecosystem usefulness.

PRO can contribute:

- city supply density;
- quest and experience utility;
- Atlas / guide quality;
- RF promoter archetype activity;
- local trust;
- practical value that makes VIP meaningful.

This does not make PRO a network hierarchy operator.

This does not create PRO commission semantics.

This does not create PRO payout runtime.

Boundary:

```text
PRO_operator_role: ecosystem_utility_generation
PRO_operator_role != MLM_operator
PRO_operator_role != commission_hierarchy
PRO_operator_role != payout_runtime
PRO_growth_utility != network_commission
RF_promoter_archetype != affiliate_commission_role
```

## 19. Referral and Future Ledger Vocabulary

Referral and network language may prepare future ledger vocabulary.

Future ledger vocabulary may need terms for:

- conditional referral value;
- original referral condition;
- unlock candidate;
- valid unlock context;
- network activity context;
- projected network value;
- advisory visibility;
- granted network value where separately implemented;
- correction or reversal context.

But semantic preparation is not ledger activation.

Boundary:

```text
referral_semantics != ledger_activation
network_utility != accounting_model
referral_visibility != ledger_balance
referral_projection != accounting_entry
network_projection != ledger_truth
future_ledger_vocabulary != ledger_implementation
future_ledger_vocabulary != producer_activation
```

## 20. Source-of-Truth Ownership Alignment

This document preserves source-of-truth boundaries from runtime-aligned referral policy.

Ownership language:

```text
Referral Service -> referral codes, referral relations, referral tree facts, first-login activation facts, referral read models
Points Service -> Points ledger, balances, transactions, action taxonomy, wallet bucket projection
VIP Entitlement -> target active VIP periods, first VIP activation facts, VIP lifecycle eligibility events where separately implemented
Connect -> read-only projection, explanation UI, safe wallet/referral display
RF Service -> voucher lifecycle and voucher spend coupling, not referral reward ownership
```

Alignment boundary:

```text
source_of_truth_alignment != runtime_authority_switch
Connect_projection != reward_calculation
RF_Service != referral_reward_owner
Referral_Service_facts != Points_ledger_writes
VIP_target_semantics != active_runtime_authority_by_this_document
```

## 21. Safe Wording Guidance

Preferred wording:

- Points for participation;
- Points with conditions;
- conditional referral value;
- referral growth participation;
- invited-user activity context;
- network participation utility;
- advisory network visibility;
- projected network value;
- active VIP period;
- available after valid unlock where policy and runtime allow;
- read-only projection;
- ecosystem growth utility.

Avoid or qualify:

- income;
- passive income;
- commission;
- payout;
- earnings;
- cash-out;
- affiliate;
- revenue share;
- downline;
- MLM;
- guaranteed reward;
- payout unlock;
- partner settlement;
- PRO commission.

Replacement examples:

```text
"passive income" -> "projected network utility" or "network participation visibility"
"commission" -> "Points for participation where policy allows"
"payout unlock" -> "available-after-valid-unlock where policy and runtime allow"
"affiliate reward" -> "referral growth participation utility"
"network earnings" -> "network utility visibility"
"downline" -> "limited-depth invited-user activity context"
```

## 22. Referral & Network Interaction Patterns

The following patterns are illustrative only.

They are not runtime flows.

They are not implementation tasks.

They are not reward producer definitions.

### Pattern A - Spacer Referral Registration

```text
Spacer + referral_registered + conditional referral utility
```

Meaning:

A Spacer can participate in ecosystem growth by inviting another user. Referral registration may create conditional referral utility where policy and runtime support it.

Boundary:

```text
referral_registered_pattern != payout
conditional_referral_utility != available_balance
Spacer_referral_participation != commission
```

### Pattern B - VIP Locked Value Pressure

```text
VIP + referral_locked visibility + activation pressure
```

Meaning:

Visible conditional referral value can create activation or retention pressure.

Boundary:

```text
referral_locked_visibility != spendable_balance
activation_pressure != spend_approval
VIP_context != payout_unlock
```

### Pattern C - Network Projection

```text
Network projection + advisory visibility + non-authoritative value
```

Meaning:

Network projection can explain future-oriented or conditional network relevance.

Boundary:

```text
network_projection_pattern != granted_reward
advisory_visibility != authoritative_balance
projected_network_value != passive_income
```

### Pattern D - PRO Ecosystem Growth Utility

```text
PRO + ecosystem growth utility + quest / experience density
```

Meaning:

PRO can improve the practical value of the ecosystem and make referral/network growth more useful.

Boundary:

```text
PRO_growth_pattern != MLM_operator
PRO_utility != commission_hierarchy
quest_density != payout_pipeline
```

### Pattern E - RF Practical Consumption Relevance

```text
RF utility + referral participation + practical consumption relevance
```

Meaning:

Referral and network participation can become more meaningful when RF/voucher utility gives users practical reasons to activate and remain engaged.

Boundary:

```text
RF_referral_pattern != cashback_loop
voucher_utility != affiliate_payout
practical_consumption_relevance != partner_settlement
```

### Pattern F - Available After Valid Unlock

```text
conditional referral value + valid unlock context + available where policy/runtime allow
```

Meaning:

Conditional value can become available only if required conditions and runtime-aligned policy support that interpretation.

Boundary:

```text
available_after_valid_unlock_pattern != payout_unlock
valid_unlock_context != automatic_unlock
available_value != guaranteed_spend_approval
```

## 23. Referral & Network Safety Invariants

Required safety invariants:

```text
referral != payout
referral != commission
referral != MLM
referral != passive_income
network_utility != passive_income
network_utility != guaranteed_reward
projection != ledger_truth
advisory != authoritative
conditional != available
visible_network_value != spendable_balance
referral_unlock != payout_unlock
VIP_pressure != spend_approval
PRO != MLM_operator
voucher_utility != affiliate_payout
referral_model != runtime_engine
referral_model != reward_producer_activation
referral_model != accrual_pipeline_activation
referral_model != spend_enforcement
referral_model != payout_pipeline
referral_model != ledger_activation
diagnostics != authority
shadow_graph != enforcement
```

Additional alignment invariants:

```text
referral_locked != available_balance
unlock_candidate != unlock_execution
network_accrual_candidate != active_producer
network_projection != granted_reward
referral_visibility != financial_claim
limited_depth_network_context != MLM_tree
RF_voucher_context != affiliate_system
Partner_context != settlement_authority
```

## 24. Forbidden Interpretations

The following interpretations are forbidden:

- referral model creates payout rights;
- network participation creates passive income;
- referral visibility creates guaranteed rewards;
- referral unlock creates payout unlock;
- PRO creates network commission hierarchy;
- PRO becomes an MLM operator;
- referral network creates MLM semantics;
- voucher / referral interaction creates affiliate system;
- RF or voucher utility creates cashback loop;
- network projections become ledger balance;
- advisory visibility becomes authoritative balance;
- conditional referral value becomes available spend balance without valid unlock;
- referral model activates producers;
- referral model activates accrual pipeline;
- referral model activates spend enforcement;
- referral model activates payout pipeline;
- referral model activates ledger;
- referral model activates partner payout;
- referral model creates runtime referral engine;
- referral model creates implementation tasks;
- referral model creates rollout tasks;
- referral model unblocks Slice 16.

Forbidden interpretation classification:

```text
implicit_payout_rights: forbidden
implicit_passive_income: forbidden
implicit_commission_semantics: forbidden
implicit_MLM_semantics: forbidden
implicit_affiliate_system: forbidden
implicit_cashback_loop: forbidden
implicit_runtime_referral_engine: forbidden
implicit_reward_producer_activation: forbidden
implicit_accrual_pipeline_activation: forbidden
implicit_spend_enforcement_activation: forbidden
implicit_payout_pipeline_activation: forbidden
implicit_ledger_activation: forbidden
implicit_slice_16_unblock: forbidden
```

## 25. Relationship to Existing Economy SSOT

This document does not replace existing economy SSOT documents.

Relationship:

- `docs/economy/README.md` remains the economy entry point.
- `docs/economy/referral_network_rewards_policy_v1.md` remains the runtime-aligned referral and network rewards policy.
- `docs/economy/points_policy_v1.md` remains the runtime-aligned Points policy.
- `docs/economy/reward_event_catalog_v1.md` remains the semantic event catalog.
- `docs/economy/points_taxonomy_v1.md` remains the semantic Point taxonomy.
- `docs/economy/points/semantic_axes_of_points_v1.md` remains the coordinate system for Points interpretation.
- `docs/economy/layered_value_architecture_v1.md` remains the value topology.
- `docs/economy/reward_lifecycle_soft_accrual_rules_v1.md` remains the lifecycle and soft accrual semantics.
- `docs/economy/role_based_rewards_matrix_v1.md` remains the role participation semantics.
- `docs/economy/tokenomics/go2asia_tokenomics_v1.md` remains the full economy model.
- `docs/economy/vip/vip_value_system_v1.md` remains the behavioral VIP model.
- `docs/economy/vouchers/rf_voucher_economy_v1.md` remains the voucher consumption model.
- `docs/economy/points/points_sink_design_v1.md` remains the sink model.

This document adds semantic alignment of referral and network language across those documents.

It does not change their authority, runtime interpretation, or implementation status.

## 26. Runtime / QA Boundary

This document is docs-only.

It does not request or perform:

- tests;
- runtime validation;
- QA acceptance;
- evidence collection;
- staging validation;
- production smoke validation;
- rollout validation;
- referral engine validation;
- reward producer validation;
- accrual pipeline validation;
- ledger validation;
- spend enforcement validation;
- payout validation;
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
runtime_referral_engine_status: not_created
reward_producer_activation_status: not_created
accrual_pipeline_activation_status: not_created
ledger_activation_status: not_created
spend_enforcement_activation_status: not_created
payout_activation_status: not_created
payout_pipeline_status: not_created
entitlement_authority_switch_status: not_created
```

## 27. Naming Boundary

This document is Stage 6.6 in the economy semantic documentation sequence.

It is not:

- RF Slice 6.6;
- an implementation slice;
- a referral runtime slice;
- an entitlement slice;
- an authorization slice;
- a runtime rollout slice;
- a payout slice;
- a ledger slice.

Naming boundary:

```text
stage_6_6_context: economy_semantic_documentation
stage_6_6_referral_network_reward_model_alignment_v1 != RF_Slice_6_6
stage_6_6_referral_network_reward_model_alignment_v1 != runtime_referral_engine
stage_6_6_referral_network_reward_model_alignment_v1 != payout_model
stage_6_6_referral_network_reward_model_alignment_v1 != ledger_implementation
```

## 28. Final Classification

Final classification:

```text
document_type: semantic_referral_network_utility_language_alignment
document_mode: docs_only
runtime_changes_added: no
migrations_added: no
api_changes_added: no
feature_flags_added: no
implementation_changes_added: no
runtime_referral_engine_added: no
ledger_activation_added: no
ledger_implementation_added: no
reward_producer_activation_added: no
accrual_pipeline_activation_added: no
spend_enforcement_activation_added: no
payout_activation_added: no
payout_pipeline_added: no
partner_payout_model_added: no
MLM_model_added: no
affiliate_commission_system_added: no
revenue_share_model_added: no
tests_added_or_requested: no
evidence_added_or_requested: no
runtime_validation_added_or_requested: no
slice_16_status: blocked_not_triggered
production_status: not_touched
final_verdict: referral_network_reward_model_alignment_v1_defines_semantic_alignment_of_referral_and_network_utility_language_without_creating_payout_commission_MLM_passive_income_runtime_referral_engine_reward_producers_accrual_pipeline_ledger_activation_spend_enforcement_payout_activation_or_slice_16_progression
```
