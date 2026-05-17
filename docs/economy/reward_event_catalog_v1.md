# Reward Event Catalog v1

Date: 2026-05-17  
Status: `NOTE_READY_STAGE_6_3_REWARD_EVENT_CATALOG_DOCS_ONLY`  
Stage: `Stage 6.3 / Reward Event Catalog v1`  
Mode: semantic catalog of reward-relevant ecosystem events, docs-only, read-only reference, explanatory classification only, no runtime changes, no migrations, no API changes, no feature flags, no implementation changes, no event bus activation, no Kafka or topic design, no event schema, no event registry, no ledger activation, no ledger event implementation, no reward producer activation, no accrual pipeline activation, no spend enforcement, no enforcement mechanics, no anti-fraud runtime activation, no payout pipeline, no financial accounting system, no production/runtime activation, no execution authorization, no governance approval, no Slice 16 readiness, no Slice 16 unblock, no rollout strategy, no implementation plan, no operational mandate, no evidence execution, no validation execution, no test plan, no QA acceptance, no deny or fail-closed behavior, no payment rejection logic, no authority switching

## 1. Purpose

This document formalizes the canonical semantic catalog of reward-relevant ecosystem events in Go2Asia.

It answers one question:

```text
Which ecosystem activity events can be discussed as semantically reward-relevant, and how do they relate to Point taxonomy, semantic axes, value layers, VIP pressure, sinks, progression, network utility, and future ledger vocabulary?
```

Main thesis:

```text
Reward Event Catalog defines semantic classes of value-generating ecosystem activity,
not runtime producers or ledger pipelines.
```

This document describes event families as semantic economy language.

It does not define runtime producers, message buses, schemas, ledger writes, payout flows, anti-fraud enforcement, spend enforcement, or implementation tasks.

## 2. Explicit Non-Goals

This document is not:

- a runtime event bus;
- a Kafka, queue, stream, topic, or pub/sub design;
- a ledger events implementation;
- an event schema;
- an event registry;
- an API contract;
- a producer implementation;
- a consumer implementation;
- an anti-fraud runtime;
- a spend enforcement model;
- a payout pipeline;
- a financial accounting system;
- a reward size table;
- a reward catalog with amounts;
- an implementation plan;
- a rollout plan;
- a migration plan;
- a production activation artifact.

Non-goal classification:

```text
reward_event_catalog_role: semantic_catalog_only
runtime_event_bus_status: not_defined
event_schema_status: not_defined
api_contract_status: not_defined
producer_implementation_status: not_defined
ledger_event_implementation_status: not_defined
reward_catalog_amounts_status: not_defined
anti_fraud_runtime_status: not_activated
spend_enforcement_status: not_activated
payout_pipeline_status: not_payout_pipeline
financial_accounting_status: not_financial_accounting_system
implementation_plan_status: not_implementation_plan
```

## 3. Reading Contract

This document must be read together with:

- `docs/economy/README.md`;
- `docs/economy/layered_value_architecture_v1.md`;
- `docs/economy/points/semantic_axes_of_points_v1.md`;
- `docs/economy/points_taxonomy_v1.md`;
- `docs/economy/points_policy_v1.md`;
- `docs/economy/referral_network_rewards_policy_v1.md`;
- `docs/economy/tokenomics/go2asia_tokenomics_v1.md`;
- `docs/economy/vip/vip_value_system_v1.md`;
- `docs/economy/points/points_sink_design_v1.md`;
- `docs/economy/vouchers/rf_voucher_economy_v1.md`;
- `docs/architecture/domain/economy_scope_reentry_note_v1.md`;
- relevant Phase G closure documents.

If this catalog appears to conflict with runtime-aligned policy, the runtime-aligned policy controls runtime interpretation:

```text
runtime_policy_authority: points_policy_v1_and_referral_network_rewards_policy_v1
reward_event_catalog_authority_status: semantic_non_runtime
reward_event_catalog_replaces_runtime_policy: false
```

## 4. Source Materials and Review Scope

This document was prepared after read-first review of the economy SSOT, Layered Value Architecture, Semantic Axes of Points, Points Taxonomy v1, runtime-aligned Points and referral policies, Stage 6.1, and Phase G closure boundaries.

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
artifact_scope: reward_event_catalog_semantic_only
runtime_review_status: not_performed
validation_execution_status: not_executed
evidence_collection_status: not_collected
implementation_tasks_status: none_implied_none_required
```

## 5. Relationship to Stage 6.1 and Phase G

This catalog follows `docs/architecture/domain/economy_scope_reentry_note_v1.md`.

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

Reward Event Catalog v1 is a semantic economy artifact. It is not execution, authorization, approval, runtime activation, producer activation, ledger activation, enforcement activation, or Slice 16 progression.

## 6. What Is a Reward Event in This Catalog?

A reward event is a semantic label for ecosystem activity that may be relevant to value recognition.

It may describe:

- ordinary participation;
- contribution;
- referral growth;
- network participation;
- voucher interaction;
- quest or experience activity;
- progression or prestige signals;
- operational correction;
- VIP pressure;
- sink participation;
- future externalization boundary language.

In this document, an event is a semantic occurrence, not a runtime message.

Boundary:

```text
reward_event: semantic_occurrence
reward_event != runtime_message
reward_event != ledger_write
reward_event != active_producer
reward_event != payout
reward_event != spend_enforcement
```

## 7. Canonical Event Families Overview

This catalog defines the following canonical event families:

```text
1. Activity Events
2. Contribution Events
3. Referral Events
4. Network Activity Events
5. RF / Voucher Events
6. Quest / Experience Events
7. Progression / Prestige Events
8. Compensation / Correction Events
9. VIP Activation Events
10. Sink Participation Events
11. Externalization-sensitive Events
```

These families describe reward-relevant ecosystem activity.

They are not producers.

They are not ledger event types.

They are not runtime schemas.

They are not reward grants by themselves.

They are not spend approvals.

## 8. Event Families and Point Taxonomy

This catalog maps event families to `docs/economy/points_taxonomy_v1.md`.

Mapping:

```text
Activity Events -> Personal Activity Points
Contribution Events -> Contribution Points
Referral Events -> Conditional Referral Points
Network Activity Events -> Network Activity Points
RF / Voucher Events -> RF / Voucher-related Points
Quest / Experience Events -> Quest / Experience Points
Progression / Prestige Events -> Progression / Prestige Signals
Compensation / Correction Events -> Compensation / Correction Points
VIP Activation Events -> VIP pressure and availability language, not a separate Point currency
Sink Participation Events -> consumption / burn / sink vocabulary, not automatic spend enforcement
Externalization-sensitive Events -> Level 6 boundary language, not Points externalization
```

Important boundary:

```text
event_family != separate_wallet_currency
event_family != active_reward_producer
event_family != ledger_action
event_family != payout_right
```

## 9. Event Family 1 - Activity Events

### Semantic Meaning

Activity Events describe ordinary participation and engagement signals.

Examples:

- `post_created`;
- `like_given`;
- `like_received`;
- `comment_created`;
- `content_shared`;
- `profile_completed`;
- `account_activity`;
- `registration`;
- `first_login`;
- `event_registration`.

### Primary Relationship

Primary Point class:

```text
Personal Activity Points
```

Primary utility:

```text
engagement_utility
pressure_utility
ecosystem_participation
```

### Axes Profile

Typical semantic profile:

```text
origin: activity-origin
state: observed | pending | available_where_policy_and_runtime_allow
visibility: visible | summarized | detailed
spendability: not_defined_by_event_itself
authority: runtime-aligned_where_current_policy_and_ledger_facts_exist | policy-described_elsewhere
utility: engagement_utility | pressure_utility
layer: Level 0 Attention & Presence -> Level 1 Internal Utility
lifecycle: observed -> classified -> accrued_or_ignored_by_policy -> displayed_where_applicable
sinkability: possible_standard_sink_relevance_after_available_points
fungibility: normally_fungible_if_settled_as_ordinary_available_points
risk_abuse: low-risk_activity_signals | spam-prone_activity_rewards
```

### LVA / VIP / Sink Relationship

Activity Events begin at Level 0 and may become Level 1 internal utility if recognized by policy.

They can create Points pressure and influence VIP activation by making accumulated utility visible.

They do not activate sinks by themselves.

### Boundary

```text
activity_event != automatic_reward
activity_event != ledger_write
activity_event != spend_permission
activity_event != payout
```

## 10. Event Family 2 - Contribution Events

### Semantic Meaning

Contribution Events describe quality and ecosystem contribution.

Examples:

- `review_published`;
- `guide_published`;
- `atlas_contribution`;
- `useful_travel_content`;
- `curated_collection_created`;
- `community_helpful_action`;
- `quality_content_curated`;
- `local_knowledge_added`.

### Primary Relationship

Primary Point class:

```text
Contribution Points
```

Primary utility:

```text
contribution_utility
reputation_like_utility
ecosystem_quality_growth
```

### Axes Profile

Typical semantic profile:

```text
origin: contribution-origin
state: observed | pending | available_where_policy_and_runtime_allow | archived
visibility: visible | advisory-visible | detailed
spendability: not_defined_by_event_itself
authority: policy-described | runtime-aligned_where_current_ledger_facts_exist
utility: contribution_utility | reputation-like_signal
layer: Level 0 / Level 1 with Level 4 progression relevance
lifecycle: observed -> classified -> recognized -> displayed_or_archived
sinkability: possible_standard_or_status_sink_relevance_after_policy_recognition
fungibility: normally_fungible_if_settled_as_ordinary_available_points
risk_abuse: contribution_quality_sensitive | spam-prone_activity_rewards
```

### LVA / VIP / Sink Relationship

Contribution Events connect Level 0 attention/presence to Level 1 internal utility and may influence Level 4 progression/prestige.

They can increase VIP pressure by increasing perceived utility and status value.

### Boundary

Contribution Events must not be interpreted as payout semantics.

```text
contribution_event != payout
contribution_event != wage
contribution_event != commission
contribution_event != partner_settlement
contribution_event != guaranteed_reward
```

## 11. Event Family 3 - Referral Events

### Semantic Meaning

Referral Events describe network growth and conditional utility.

Examples:

- `referral_registered`;
- `referral_verified`;
- `referral_vip_activated`;
- `second_level_referral_created`;
- `second_level_referral_registered`;
- `referral_unlock_candidate`;
- `referral_activation_observed`;
- `referral_condition_met_candidate`.

### Primary Relationship

Primary Point class:

```text
Conditional Referral Points
```

Primary utility:

```text
conditional_utility
pressure_utility
network_growth_utility
vip_conversion_utility
```

### Axes Profile

Typical semantic profile:

```text
origin: referral-origin
state: observed | conditional | locked | projected | available_after_valid_unlock_where_policy_and_runtime_allow
visibility: visible | advisory-visible | projected
spendability: non-spendable_until_condition_met_and_runtime_policy_allows
authority: runtime-aligned_for_confirmed_referral_locked_facts | projected_for_unimplemented_unlocks
utility: pressure_utility | unlock_utility | network_growth_utility
layer: Level 1 Internal Utility with Level 2 VIP activation pressure
lifecycle: observed -> conditional -> displayed -> unlock_candidate -> available_if_validly_granted
sinkability: not-sinkable_until_available
fungibility: conditionally_fungible_after_unlock_into_ordinary_available_points
risk_abuse: referral-abuse-prone_rewards
```

### LVA / VIP / Network Relationship

Referral Events connect Level 1 internal utility to Level 2 VIP pressure.

They are a key source of locked or conditional value pressure.

They can support network growth language, but only as participation mechanics.

### Boundary

```text
referral_event != payout
referral_event != commission
referral_event != passive_income
referral_event != MLM
referral_event != automatic_unlock
referral_event != granted_available_balance_by_itself
```

## 12. Event Family 4 - Network Activity Events

### Semantic Meaning

Network Activity Events describe observed or projected activity from invited users, second-level users, or network growth patterns.

Examples:

- `referral_activity_observed`;
- `second_level_activity_observed`;
- `network_growth_detected`;
- `network_activity_projection`;
- `network_participation_observed`;
- `network_value_projection`;
- `network_accrual_candidate`.

### Primary Relationship

Primary Point class:

```text
Network Activity Points
```

Primary utility:

```text
network_utility
participation_mechanics
vip_conversion_utility
ecosystem_growth_utility
```

### Axes Profile

Typical semantic profile:

```text
origin: network-origin | referral-origin
state: observed | projected | conditional | available_only_where_separately_granted
visibility: advisory-visible | projected | summarized
spendability: non-spendable_until_granted_as_available_by_runtime_policy
authority: target_policy | projected | non-authoritative_advisory | runtime-aligned_only_where_granted_ledger_facts_exist
utility: network_utility | pressure_utility | participation_utility
layer: Level 1 Internal Utility with Level 2 VIP activation pressure
lifecycle: observed -> projected_or_classified -> displayed_as_advisory -> available_if_granted
sinkability: not-sinkable_when_projected
fungibility: conditionally_fungible_after_actual_grant_as_ordinary_available_points
risk_abuse: network-amplified_rewards | referral-abuse-prone_rewards
```

### LVA / VIP / Network Relationship

Network Activity Events can create network pressure and VIP conversion pressure.

They must distinguish projected/advisory activity from granted rewards.

### Boundary

```text
projected_network_activity != granted_reward
network_activity_event != guaranteed_reward
network_activity_event != passive_income
network_activity_event != MLM
network_activity_event != ledger_truth
```

## 13. Event Family 5 - RF / Voucher Events

### Semantic Meaning

RF / Voucher Events describe consumption and offline utility bridge activity.

Examples:

- `voucher_claimed`;
- `voucher_redeemed`;
- `premium_voucher_claimed`;
- `RF_partner_interaction`;
- `claim_repost_created`;
- `partner_engagement_detected`;
- `voucher_claim_participation`;
- `voucher_consumption_observed`;
- `rf_voucher_claim_spend`;
- `rf_voucher_claim_spend_compensation`.

### Primary Relationship

Primary Point class:

```text
RF / Voucher-related Points
```

Primary utility:

```text
consumption_utility
voucher_interaction_utility
offline_benefit_bridge
partner_engagement_signal
```

### Axes Profile

Typical semantic profile:

```text
origin: RF / partner-origin | voucher-origin | compensation-origin_where_recovery_related
state: observed | claimed | spent | burned | redeemed | reversed | corrected
visibility: visible | summarized | detailed | advisory-visible
spendability: voucher-sinkable_where_policy_and_runtime_allow
authority: runtime-aligned_where_RF_spend_or_compensation_exists | policy-described_elsewhere
utility: consumption_utility | compensation_correction_utility_where_applicable
layer: Level 3 Consumption & Experience with Level 1 Points input and Level 5 partner context
lifecycle: observed -> claimed -> consumed_or_redeemed -> spent_or_compensated -> archived
sinkability: voucher-sinkable | premium-voucher-compatible_where_separately_implemented
fungibility: normally_fungible_only_if_ordinary_available_points_are_involved
risk_abuse: partner/RF-sensitive_values | compensation/correction-sensitive_values
```

### LVA / VIP / Sink Relationship

RF / Voucher Events connect Level 1 internal utility to Level 3 consumption.

They may also touch Level 5 operator and partner context as practical utility, but not partner settlement.

They can create consumption desire and reinforce VIP value.

### Boundary

```text
voucher_event != partner_settlement
voucher_event != payment_for_underlying_service
voucher_event != PRO_payout
voucher_event != active_G2A_distribution
voucher_event != spend_enforcement_by_itself
```

## 14. Event Family 6 - Quest / Experience Events

### Semantic Meaning

Quest / Experience Events describe quests, challenges, travel activity, and experiential progression.

Examples:

- `quest_started`;
- `quest_completed`;
- `challenge_completed`;
- `travel_activity_detected`;
- `experiential_milestone`;
- `experience_completed`;
- `city_activity_completed`;
- `guided_activity_completed`.

### Primary Relationship

Primary Point class:

```text
Quest / Experience Points
```

Primary utility:

```text
experience_utility
engagement_utility
progression_utility
consumption_utility
ecosystem_participation
```

### Axes Profile

Typical semantic profile:

```text
origin: quest-origin | activity-origin | contribution-origin
state: observed | pending | available_where_policy_and_runtime_allow | archived | corrected
visibility: visible | detailed | advisory-visible
spendability: not_defined_by_event_itself
authority: runtime-aligned_where_current_quest_grants_exist | policy-described_for_future_sinks
utility: experience_utility | engagement_utility | progression_utility
layer: Level 3 Consumption & Experience with Level 4 progression relevance
lifecycle: observed -> started -> completed -> recognized -> displayed_or_archived
sinkability: quest-sinkable | voucher-sinkable | status-sinkable_where_separately_defined
fungibility: normally_fungible_if_settled_as_ordinary_available_points
risk_abuse: quest-abuse-sensitive_values | spam-prone_activity_rewards
```

### LVA / VIP / Progression Relationship

Quest / Experience Events connect Level 3 consumption and experience to Level 4 progression.

They may create VIP consumption desire and long-term retention.

### Boundary

```text
quest_event != automatic_reward
quest_event != quest_spend_sink_activation
quest_event != NFT_mint_activation
quest_event != badge_to_NFT_activation
```

## 15. Event Family 7 - Progression / Prestige Events

### Semantic Meaning

Progression / Prestige Events describe status, milestones, achievements, badges, and prestige signals.

Examples:

- `achievement_unlocked`;
- `badge_earned`;
- `milestone_reached`;
- `progression_signal_generated`;
- `prestige_signal_detected`;
- `status_milestone_observed`;
- `badge_candidate_detected`;
- `reputation_signal_generated`.

### Primary Relationship

Primary Point class:

```text
Progression / Prestige Signals
```

Primary utility:

```text
progression_utility
reputation_like_signal
status_utility
prestige_utility
long_term_retention
```

### Axes Profile

Typical semantic profile:

```text
origin: achievement-origin | quest-origin | contribution-origin | future_campaign-origin
state: observed | advisory | displayed | archived
visibility: advisory-visible | visible | detailed
spendability: non-spendable | future-scoped_only
authority: advisory | policy-described | projected | future_runtime-aligned
utility: progression_utility | reputation-like_signal | status_utility
layer: Level 4 Progression & Prestige
lifecycle: observed -> classified -> displayed -> progressed -> archived
sinkability: status-sinkable | NFT-mint-sinkable_only_as_future_potential | not-sinkable
fungibility: non-fungible_unless_separately_converted_to_ordinary_available_points
risk_abuse: reputation-sensitive_values | externalization-sensitive_values
```

### LVA / VIP / Progression Relationship

Progression / Prestige Events belong primarily to Level 4.

They may influence VIP status value and long-term retention.

They do not create ordinary fungible balances by default.

### Boundary

```text
progression_event != money
progression_event != spendable_balance
progression_event != payout
progression_event != NFT_activation
progression_event != G2A_activation
```

## 16. Event Family 8 - Compensation / Correction Events

### Semantic Meaning

Compensation / Correction Events describe operational correction, recovery, reversal, or reconciliation semantics.

Examples:

- `correction_applied`;
- `compensation_granted`;
- `reversal_detected`;
- `recovery_adjustment`;
- `operational_reconciliation`;
- `rf_spend_compensation_detected`;
- `duplicate_reward_correction`;
- `manual_support_adjustment`.

### Primary Relationship

Primary Point class:

```text
Compensation / Correction Points
```

Primary utility:

```text
compensation_correction_utility
operational_recovery
ledger_consistency_language
support_adjustment_semantics
```

### Axes Profile

Typical semantic profile:

```text
origin: compensation-origin | admin/manual-origin | RF / partner-origin_when_recovery_related
state: corrected | reversed | available_where_policy_allows | archived
visibility: visible | summarized | detailed | hidden_where_policy_requires
spendability: operational_only | ordinary_available_if_correction_results_in_available_points
authority: runtime-aligned_where_current_compensation_exists | ledger-backed_future_where_separately_defined
utility: compensation_correction_utility
layer: Level 1 Internal Utility with operational recovery context
lifecycle: detected -> corrected -> displayed_or_archived -> reconciled
sinkability: standard_sinkable_only_if_settled_as_ordinary_available_points
fungibility: conditionally_fungible_if_correction_results_in_ordinary_available_points
risk_abuse: compensation/correction-sensitive_values
```

### LVA / QA / Abuse Relationship

Compensation / Correction Events preserve consistency language.

They are operational semantics only and should not be gamified.

### Boundary

```text
compensation_event != ordinary_reward_loop
correction_event != gamification_reward
reversal_event != punitive_enforcement
recovery_adjustment != payout_right
operational_reconciliation != financial_accounting_system
```

## 17. Event Family 9 - VIP Activation Events

### Semantic Meaning

VIP Activation Events describe activation-layer signals, VIP pressure, and availability-related milestones.

Examples:

- `vip_activated`;
- `vip_extended`;
- `vip_expired`;
- `vip_reactivated`;
- `vip_pressure_detected`;
- `vip_unlock_candidate`;
- `vip_spend_access_context`;
- `vip_network_pressure_detected`.

### Primary Relationship

Primary Point classes affected semantically:

```text
Personal Activity Points
Conditional Referral Points
Network Activity Points
RF / Voucher-related Points
Quest / Experience Points
Progression / Prestige Signals
```

VIP Activation Events are not a separate Point currency.

They describe Level 2 activation semantics.

### Axes Profile

Typical semantic profile:

```text
origin: VIP-activation-context
state: observed | activated | expired | reactivated | advisory
visibility: visible | advisory-visible | summarized
spendability: may_affect_spend_context_where_runtime_policy_allows
authority: policy-described | runtime-aligned_only_where_current_policy_confirms
utility: pressure_utility | unlock_utility | consumption_utility | status_utility
layer: Level 2 Economic Activation Layer
lifecycle: observed -> activated_or_expired -> displayed -> interpreted_by_policy
sinkability: contextual_only
fungibility: not_applicable_as_event_family
risk_abuse: entitlement-sensitive_values
```

### LVA / VIP Relationship

VIP is the activation layer.

VIP Activation Events can explain:

- Points pressure;
- locked value pressure;
- network pressure;
- consumption desire;
- status and premium access pressure.

### Boundary

```text
VIP_event != entitlement_authority_switch
VIP_event != runtime_authority_activation
VIP_event != automatic_referral_unlock
VIP_event != spend_enforcement
VIP_pressure_detected != spend_approval
```

## 18. Event Family 10 - Sink Participation Events

### Semantic Meaning

Sink Participation Events describe consumption, burn, sink usage, or premium access consumption as economic vocabulary.

Examples:

- `sink_consumed`;
- `voucher_sink_used`;
- `quest_sink_used`;
- `NFT_sink_candidate`;
- `premium_access_consumption`;
- `points_burn_candidate`;
- `status_sink_used`;
- `social_sink_used`.

### Primary Relationship

Primary Point classes affected semantically:

```text
Personal Activity Points
Contribution Points
RF / Voucher-related Points
Quest / Experience Points
Progression / Prestige Signals
Compensation / Correction Points where settled as ordinary available points
```

### Axes Profile

Typical semantic profile:

```text
origin: sink-origin | voucher-origin | quest-origin | status-origin
state: spent | burned | consumed | archived | corrected
visibility: visible | summarized | detailed
spendability: sinkable_where_policy_and_runtime_allow
authority: policy-described | runtime-aligned_where_current_spend_exists
utility: consumption_utility | progression_utility | anti_inflation_utility
layer: Level 3 Consumption & Experience and Level 4 Progression where applicable
lifecycle: available -> consumed -> spent_or_burned -> archived_or_corrected
sinkability: voucher-sinkable | quest-sinkable | status-sinkable | NFT-mint-sinkable_only_as_future_potential
fungibility: depends_on_points_state_and_policy
risk_abuse: spend-sensitive_values | premium-access-sensitive_values
```

### LVA / Sink Relationship

Sink Participation Events connect accumulated utility to consumption, burn, or status.

They must be read through `docs/economy/points/points_sink_design_v1.md` and runtime-aligned policy.

### Boundary

```text
sink_event != active_sink_pipeline
sink_event != spend_enforcement
sink_event != payment_rejection_logic
NFT_sink_candidate != NFT_mint_activation
premium_access_consumption != premium_runtime_activation_by_itself
```

## 19. Event Family 11 - Externalization-sensitive Events

### Semantic Meaning

Externalization-sensitive Events describe controlled future boundary language for externalized value.

Examples:

- `externalization_candidate`;
- `NFT_export_candidate`;
- `G2A_boundary_candidate`;
- `blockchain_bridge_candidate`;
- `on_chain_boundary_candidate`;
- `treasury_sensitive_signal`;
- `external_bridge_review_candidate`.

### Primary Relationship

Primary taxonomy relationship:

```text
Progression / Prestige Signals
RF / Voucher-related Points
Externalization-sensitive boundary values
```

These are not ordinary Points.

They are Level 6 boundary labels only.

### Axes Profile

Typical semantic profile:

```text
origin: externalization-sensitive | future_campaign-origin | RF / partner-origin_where_future_boundary_related
state: advisory | candidate | future-scoped | non-spendable
visibility: hidden | advisory-visible | projected
spendability: non-spendable
authority: advisory | future_policy_required | non-authoritative
utility: externalization_boundary_language | treasury_sensitive_signal
layer: Level 6 Externalized Value boundary
lifecycle: observed -> classified -> reviewed_by_future_policy_if_ever -> archived
sinkability: not-sinkable
fungibility: non-fungible
risk_abuse: externalization-sensitive_values | treasury-sensitive_values
```

### LVA / Future Boundary Relationship

Externalization-sensitive Events approach Level 6 only as controlled future language.

They do not activate G2A, NFT export, Blockchain Gateway, on-chain flows, PRO payout, partner settlement, treasury flows, or financial accounting.

### Boundary

```text
externalization_candidate != G2A_activation
NFT_export_candidate != on_chain_activation
G2A_boundary_candidate != token_grant
blockchain_bridge_candidate != bridge_activation
treasury_sensitive_signal != payout_right
```

## 20. Event Families and Layered Value Architecture

This catalog follows `docs/economy/layered_value_architecture_v1.md`.

Layer mapping:

```text
Activity Events -> Level 0 Attention & Presence -> Level 1 Internal Utility
Contribution Events -> Level 0 / Level 1 with Level 4 quality relevance
Referral Events -> Level 1 Internal Utility and Level 2 VIP pressure
Network Activity Events -> Level 1 Internal Utility and Level 2 VIP pressure
RF / Voucher Events -> Level 3 Consumption & Experience with Level 5 partner context
Quest / Experience Events -> Level 3 Consumption & Experience and Level 4 progression relevance
Progression / Prestige Events -> Level 4 Progression & Prestige
Compensation / Correction Events -> Level 1 operational recovery context
VIP Activation Events -> Level 2 Economic Activation Layer
Sink Participation Events -> Level 3 Consumption & Experience and Level 4 progression where applicable
Externalization-sensitive Events -> Level 6 Externalized Value boundary only
```

Important boundary:

```text
layer_mapping != runtime_topology
layer_mapping != service_boundary
layer_mapping != release_stage
layer_mapping != enforcement_stage
```

## 21. Event Families and VIP Pressure

Event families can influence VIP pressure semantically:

- Activity Events create Points pressure.
- Contribution Events create quality and reputation pressure.
- Referral Events create locked or conditional value pressure.
- Network Activity Events create network pressure when policy permits advisory visibility.
- RF / Voucher Events create consumption desire and practical utility pressure.
- Quest / Experience Events create experiential value pressure.
- Progression / Prestige Events create status pressure.
- VIP Activation Events explain activation-layer moments.
- Sink Participation Events close the loop from pressure to consumption where runtime policy allows.

Compensation / Correction Events should not be used as VIP pressure mechanics because they are operational recovery semantics.

Externalization-sensitive Events should not be used as VIP pressure mechanics unless a separate future policy defines safe language.

Boundary:

```text
VIP_pressure != spend_approval
VIP_pressure != entitlement_authority_switch
VIP_pressure != runtime_activation
event_family_relationship_to_VIP != VIP_lifecycle_implementation
```

## 22. Event Families and Sinks / Progression / Network Utility

### Sink Relevance

Sink-relevant families:

- RF / Voucher Events;
- Quest / Experience Events;
- Sink Participation Events;
- Progression / Prestige Events where status sinks are separately defined;
- Activity and Contribution Events only after value becomes ordinary available Points by policy.

Sink relevance is not active sink implementation.

### Progression Relevance

Progression-relevant families:

- Contribution Events;
- Quest / Experience Events;
- Progression / Prestige Events;
- selected Activity Events where repeated participation becomes milestone;
- selected RF / Voucher Events where consumption completion becomes achievement.

Progression relevance is not money and not NFT activation.

### Network Utility Relevance

Network-relevant families:

- Referral Events;
- Network Activity Events;
- selected Activity Events from invited users where future policy defines eligibility;
- VIP Activation Events where policy describes eligibility context.

Network utility is not passive income, commission, payout, or MLM.

### Externalization Boundary Relevance

Externalization-relevant families:

- Externalization-sensitive Events;
- selected Progression / Prestige Events where future on-chain NFT policy exists;
- selected RF / Voucher Events where future partner or operator compensation policy exists.

Externalization relevance is not G2A, NFT, on-chain, Blockchain Gateway, PRO payout, partner settlement, or treasury activation.

## 23. Event Families and Semantic Axes

Event families combine semantic axes.

Examples:

```text
Activity Events -> activity-origin + observed/pending + engagement utility + Level 0/1
Contribution Events -> contribution-origin + quality-sensitive + reputation-like utility + Level 1/4
Referral Events -> referral-origin + conditional/locked + visible/projected + non-spendable + Level 1/2
Network Activity Events -> network-origin + projected/advisory + non-authoritative + risk-sensitive + Level 1/2
RF / Voucher Events -> voucher-origin + claimed/spent/redeemed + consumption utility + Level 3
Quest / Experience Events -> quest-origin + started/completed + experience/progression utility + Level 3/4
Progression / Prestige Events -> achievement-origin + advisory + non-fungible + status utility + Level 4
Compensation / Correction Events -> compensation-origin + corrected/reversed + operational-only + Level 1
VIP Activation Events -> activation-context + advisory/runtime-aligned-where-policy-confirms + Level 2
Sink Participation Events -> sink-origin + spent/burned/consumed + sinkability context + Level 3/4
Externalization-sensitive Events -> externalization-sensitive + future-scoped + non-spendable + Level 6 boundary
```

These combinations are semantic patterns only.

They are not runtime state machines.

They are not event schemas.

They are not ledger rows.

## 24. Event Interpretation Boundaries

The following boundaries are mandatory:

```text
event != reward
event != payout
event != ledger_write
event != reward_producer_activation
event != spend_enforcement
event != runtime_pipeline
event != event_bus_message
event != API_contract
event != financial_accounting_entry
```

Interpretation rules:

- An event may be reward-relevant without creating a reward.
- An event may be visible without being spendable.
- An event may be projected without being authoritative.
- An event may be listed in this catalog without being current runtime.
- An event may be future ledger vocabulary without being a ledger write.
- An event may be risk-sensitive without activating fraud enforcement.

## 25. Reward Event Interaction Patterns

The following patterns are illustrative only.

They are not runtime flows, producer definitions, ledger rows, schemas, APIs, reward grants, or implementation tasks.

### Pattern A - Activity Recognition

```text
post_created -> activity-origin -> available utility potential
```

Interpretation:

A post can be semantically reward-relevant as ordinary activity. It does not automatically create a reward unless current runtime-aligned policy and implementation grant one.

### Pattern B - Referral Conditional Utility

```text
referral_registered -> referral-origin -> conditional utility potential
```

Interpretation:

A referral registration can be semantically linked to Conditional Referral Points. Conditional utility remains non-spendable until valid policy and runtime conditions are satisfied.

### Pattern C - Network Projection

```text
network_activity_projection -> network-origin -> projected advisory value
```

Interpretation:

Projected network activity can explain potential participation value. It is not granted reward, authoritative balance, or passive income.

### Pattern D - Voucher Consumption Transition

```text
voucher_claimed -> voucher-origin -> consumption utility transition
```

Interpretation:

A voucher claim can represent Level 3 consumption utility. It is not partner settlement, payout, or payment for the underlying offline service.

### Pattern E - Quest Completion

```text
quest_completed -> quest-origin -> experience utility and possible progression relevance
```

Interpretation:

A quest completion can be reward-relevant and progression-relevant. It does not activate quest sink pipelines, badges, NFT minting, or on-chain flows by itself.

### Pattern F - Progression Signal

```text
achievement_unlocked -> achievement-origin -> prestige/progression signal
```

Interpretation:

An achievement can be a status or progression signal. It is not money, payout, ordinary fungible balance, or NFT activation.

### Pattern G - Operational Recovery

```text
compensation_applied -> compensation-origin -> operational recovery semantics
```

Interpretation:

Compensation or correction events are operational semantics only. They are not gamification loops.

### Pattern H - VIP Pressure

```text
vip_pressure_detected -> activation-context -> advisory activation pressure
```

Interpretation:

VIP pressure can explain why accumulated value matters. It does not switch entitlement authority or activate spend enforcement.

### Pattern I - Sink Usage

```text
voucher_sink_used -> sink-origin -> consumption / burn vocabulary
```

Interpretation:

Sink participation vocabulary can explain consumption. It is not an active spend pipeline or payment rejection mechanism.

### Pattern J - Externalization Boundary

```text
externalization_candidate -> externalization-sensitive -> Level 6 boundary language
```

Interpretation:

Externalization-sensitive language can classify future boundary discussions. It does not activate G2A, NFT export, Blockchain Gateway, treasury actions, or on-chain flows.

## 26. Reward Event Safety Invariants

The following invariants are mandatory:

```text
reward_event != payout
reward_event != ledger_write
reward_event != runtime_producer
reward_event != spend_enforcement
event_projection != authoritative_balance
projected_network_activity != granted_reward
progression_event != money
referral_event != MLM
externalization_candidate != G2A_activation
NFT_export_candidate != on_chain_activation
diagnostics != authority
shadow_graph != enforcement
```

Additional event-catalog invariants:

```text
event_family != producer
event_family != topic
event_family != schema
event_family != API_contract
event_family != reward_size
event_family != payout_right
event_family != partner_settlement
event_family != financial_obligation
event_family != fraud_enforcement
event_family != Slice_16_unblock
```

## 27. Forbidden Interpretations

The following interpretations are forbidden:

- reward events automatically create rewards;
- event catalog activates producers;
- event catalog activates consumers;
- event catalog creates event bus topics;
- event catalog creates schemas;
- event catalog creates API contracts;
- event families create payout rights;
- event families create financial obligations;
- referral events create MLM semantics;
- referral events create passive income semantics;
- network activity events create guaranteed rewards;
- projected network activity creates wallet balance;
- progression events create spendable balances;
- progression events create money;
- voucher events create partner settlement;
- RF events create PRO payout;
- compensation events create gamification loops;
- sink events activate sink pipelines;
- sink events activate spend enforcement;
- externalization-sensitive events activate G2A;
- externalization-sensitive events activate NFT;
- externalization-sensitive events activate on-chain flows;
- NFT export candidates activate on-chain export;
- blockchain bridge candidates activate Blockchain Gateway;
- event catalog authorizes runtime implementation;
- event catalog creates implementation tasks;
- event catalog creates migration tasks;
- event catalog creates rollout tasks;
- event catalog creates QA acceptance;
- event catalog creates evidence execution;
- event catalog unblocks Slice 16.

Forbidden interpretation status:

```text
implicit_reward_creation: forbidden
implicit_producer_activation: forbidden
implicit_event_bus_activation: forbidden
implicit_schema_creation: forbidden
implicit_ledger_write_creation: forbidden
implicit_payout_right_creation: forbidden
implicit_spend_enforcement_activation: forbidden
implicit_partner_settlement_activation: forbidden
implicit_pro_payout_activation: forbidden
implicit_g2a_activation: forbidden
implicit_nft_activation: forbidden
implicit_on_chain_activation: forbidden
implicit_runtime_implementation_task: forbidden
implicit_rollout_task: forbidden
implicit_slice_16_unblock: forbidden
```

## 28. Relationship to Existing Economy SSOT

This document does not replace existing Economy SSOT documents.

Relationship:

- `docs/economy/README.md` remains the economy entry point.
- `docs/economy/points_policy_v1.md` remains the runtime-aligned Points policy.
- `docs/economy/referral_network_rewards_policy_v1.md` remains the runtime-aligned referral / network policy.
- `docs/economy/points_taxonomy_v1.md` remains the semantic taxonomy of Point classes.
- `docs/economy/points/semantic_axes_of_points_v1.md` remains the coordinate system for classification.
- `docs/economy/layered_value_architecture_v1.md` remains the value topology.
- `docs/economy/tokenomics/go2asia_tokenomics_v1.md` remains the full economy model.
- `docs/economy/vip/vip_value_system_v1.md` remains the behavioral VIP model.
- `docs/economy/points/points_sink_design_v1.md` remains the anti-inflation / sink model.
- `docs/economy/vouchers/rf_voucher_economy_v1.md` remains the voucher consumption model.
- `docs/architecture/domain/economy_scope_reentry_note_v1.md` remains the Stage 6.1 soft economy / enforcement boundary note.

SSOT boundary:

```text
reward_event_catalog_role: canonical_semantic_event_families
readme_role: economy_entry_point
points_policy_role: runtime_aligned_points_policy
referral_policy_role: referral_network_policy
points_taxonomy_role: semantic_point_classes
semantic_axes_role: coordinate_system
layered_value_architecture_role: value_topology
tokenomics_role: full_economy_model
vip_value_system_role: behavioral_vip_model
points_sink_design_role: anti_inflation_sink_model
rf_voucher_economy_role: voucher_consumption_model
stage_6_1_role: soft_economy_enforcement_boundary
```

If this document appears to conflict with runtime-aligned policy, the runtime-aligned policy controls runtime interpretation.

## 29. Relationship to Future Ledger Vocabulary

Reward events may help describe future ledger vocabulary.

They may help future documents distinguish:

- observed activity;
- policy-recognized value;
- conditional value;
- projected value;
- available value;
- spent or burned value;
- reversed value;
- corrected value;
- progression signal;
- externalization-sensitive candidate.

However:

```text
reward_event != ledger_write
reward_event != accounting_entry
reward_event != runtime_pipeline
reward_event != producer_activation
future_ledger_vocabulary != ledger_activation
event_catalog != ledger_design
```

Future ledger interpretation, if ever pursued, requires separate policy, implementation design, migrations, runtime contracts, QA, security, privacy, fraud, and governance approval. None are created here.

## 30. Runtime / QA Boundary

This document does not request runtime validation.

It does not create:

- tests;
- test plans;
- test execution;
- staging validation;
- evidence bundles;
- operational proof;
- QA release readiness;
- runtime acceptance status;
- production smoke validation;
- implementation tasks;
- rollout tasks;
- migration tasks;
- event bus tasks;
- schema tasks;
- producer activation tasks;
- reward producer activation tasks;
- ledger activation tasks;
- spend enforcement tasks;
- anti-fraud runtime tasks.

Runtime Validation / QA may review this artifact for boundary consistency only.

Boundary review is not execution authorization.

QA boundary:

```text
runtime_validation_status: not_executed
qa_status: not_executed
evidence_status: not_collected
acceptance_status: not_requested
tests_status: not_added_not_requested
implementation_tasks_status: none_created
rollout_status: not_created
production_activation_status: not_created
```

## 31. Stage 6.3 Naming Boundary

This document is Stage 6.3 - Reward Event Catalog v1.

It must not be confused with the existing `docs/economy/README.md` section numbering where `6.3` currently refers to VIP Value System.

Boundary:

```text
stage_6_3_reward_event_catalog != readme_section_6_3_vip_value_system
reward_event_catalog_v1_path: docs/economy/reward_event_catalog_v1.md
```

## 32. Final Classification

```text
document_type: reward_event_catalog_v1
document_mode: docs_only
stage: Stage 6.3
semantic_scope: canonical_catalog_of_reward_relevant_ecosystem_events
runtime_event_bus_status: not_runtime_event_bus
ledger_events_implementation_status: not_ledger_events_implementation
event_schema_status: not_event_schema
kafka_topic_design_status: not_topic_design
api_contract_status: not_API_contract
producer_implementation_status: not_producer_implementation
anti_fraud_runtime_status: not_anti_fraud_runtime
spend_enforcement_status: not_spend_enforcement
payout_pipeline_status: not_payout_pipeline
runtime_changes_added: no
migrations_added: no
api_changes_added: no
feature_flags_added: no
implementation_changes_added: no
event_bus_activation_added: no
ledger_activation_added: no
reward_producer_activation_added: no
accrual_pipeline_activation_added: no
spend_enforcement_added: no
enforcement_mechanics_added: no
production_runtime_activation_added: no
tests_added_or_requested: no
evidence_added_or_requested: no
runtime_validation_added_or_requested: no
rollout_strategy_added: no
implementation_plan_added: no
slice_16_status: blocked_not_triggered
final_verdict: reward_event_catalog_v1_defines_canonical_semantic_event_families_for_reward_relevant_ecosystem_activity_without_creating_runtime_event_bus_ledger_writes_event_schemas_reward_producers_spend_enforcement_payout_pipeline_financial_accounting_or_slice_16_progression
```
