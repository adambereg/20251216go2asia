# Reward Lifecycle / Soft Accrual Rules v1

Date: 2026-05-17  
Status: `NOTE_READY_STAGE_6_4_REWARD_LIFECYCLE_SOFT_ACCRUAL_RULES_DOCS_ONLY`  
Stage: `Stage 6.4 / Reward Lifecycle / Soft Accrual Rules v1`  
Mode: semantic lifecycle and soft accrual policy language, docs-only, read-only reference, explanatory classification only, no runtime changes, no migrations, no API changes, no feature flags, no implementation changes, no ledger state machine, no event sourcing design, no runtime accrual pipeline, no reward producer activation, no accrual pipeline activation, no database schema, no API contract, no ledger activation, no ledger transition activation, no spend enforcement, no enforcement mechanics, no payout system, no financial accounting system, no production/runtime activation, no execution authorization, no governance approval, no Slice 16 readiness, no Slice 16 unblock, no rollout strategy, no implementation plan, no operational mandate, no evidence execution, no validation execution, no test plan, no QA acceptance, no deny or fail-closed behavior, no payment rejection logic, no authority switching

## 1. Purpose

This document formalizes the semantic lifecycle of reward value in Go2Asia and defines soft accrual rules.

It answers one question:

```text
How should reward-relevant value move through semantic lifecycle language before any future runtime, ledger, producer, or enforcement discussion?
```

Main thesis:

```text
Reward lifecycle describes semantic movement of value,
not executable lifecycle states or ledger transitions.
```

This document is semantic lifecycle and soft accrual policy language.

It does not define executable states, ledger transitions, event sourcing, accrual pipelines, reward producers, database schema, API contracts, spend enforcement, payout systems, or financial accounting.

## 2. Explicit Non-Goals

This document is not:

- a ledger state machine;
- an event sourcing design;
- a runtime accrual pipeline;
- a reward producer implementation;
- a database schema;
- an API contract;
- a spend enforcement model;
- a payout system;
- a financial accounting system;
- a wallet implementation;
- a ledger transition model;
- a runtime lifecycle model;
- an anti-fraud runtime;
- a rollout plan;
- an implementation plan;
- a migration plan;
- a production activation artifact.

Non-goal classification:

```text
reward_lifecycle_role: semantic_lifecycle_policy_language_only
soft_accrual_role: semantic_policy_language_only
ledger_state_machine_status: not_defined
event_sourcing_status: not_defined
runtime_accrual_pipeline_status: not_defined
reward_producer_implementation_status: not_defined
database_schema_status: not_defined
api_contract_status: not_defined
spend_enforcement_status: not_activated
payout_system_status: not_payout_system
financial_accounting_status: not_financial_accounting_system
implementation_plan_status: not_implementation_plan
```

## 3. Reading Contract

This document must be read together with:

- `docs/economy/README.md`;
- `docs/economy/layered_value_architecture_v1.md`;
- `docs/economy/points/semantic_axes_of_points_v1.md`;
- `docs/economy/points_taxonomy_v1.md`;
- `docs/economy/reward_event_catalog_v1.md`;
- `docs/economy/points_policy_v1.md`;
- `docs/economy/referral_network_rewards_policy_v1.md`;
- `docs/economy/tokenomics/go2asia_tokenomics_v1.md`;
- `docs/economy/vip/vip_value_system_v1.md`;
- `docs/economy/points/points_sink_design_v1.md`;
- `docs/economy/vouchers/rf_voucher_economy_v1.md`;
- `docs/architecture/domain/economy_scope_reentry_note_v1.md`;
- relevant Phase G closure documents.

If this document appears to conflict with runtime-aligned policy, the runtime-aligned policy controls runtime interpretation:

```text
runtime_policy_authority: points_policy_v1_and_referral_network_rewards_policy_v1
reward_lifecycle_authority_status: semantic_non_runtime
reward_lifecycle_replaces_runtime_policy: false
```

## 4. Source Materials and Review Scope

This document was prepared after read-first review of the economy SSOT, Layered Value Architecture, Semantic Axes of Points, Points Taxonomy v1, Reward Event Catalog v1, runtime-aligned Points and referral policies, Stage 6.1, and Phase G closure boundaries.

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
artifact_scope: reward_lifecycle_soft_accrual_semantic_only
runtime_review_status: not_performed
validation_execution_status: not_executed
evidence_collection_status: not_collected
implementation_tasks_status: none_implied_none_required
```

## 5. Relationship to Stage 6.1 and Phase G

This document follows `docs/architecture/domain/economy_scope_reentry_note_v1.md`.

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

Reward lifecycle and soft accrual language are part of the soft economy layer. They are not authority transitions, runtime transitions, producer activation, ledger activation, enforcement activation, or Slice 16 progression.

## 6. What Is a Lifecycle Stage?

A lifecycle stage is semantic vocabulary for describing where reward-relevant value sits in the economy language.

A lifecycle stage may explain:

- whether activity has been noticed;
- whether an event has been classified;
- whether potential value is pending;
- whether value is conditional;
- whether value is advisory or projected;
- whether value is considered available by policy language;
- whether value is consumed, spent, burned, reversed, corrected, expired, or archived.

In this document, lifecycle stages are not executable states.

Boundary:

```text
lifecycle_stage: semantic_vocabulary
lifecycle_stage != runtime_state
lifecycle_stage != ledger_state
lifecycle_stage != database_enum
lifecycle_stage != API_contract
lifecycle_stage != executable_transition
```

## 7. What Is Soft Accrual?

Soft accrual is semantic policy language for recognizing potential utility value before any future hard runtime or ledger interpretation.

Soft accrual may describe that:

- an event is reward-relevant;
- an event belongs to a semantic family;
- an event may map to a Point class;
- a value is pending policy interpretation;
- a value is conditional;
- a value is projected or advisory;
- a value may become available only where policy and runtime separately allow.

Soft accrual does not mutate balances.

Boundary:

```text
soft_accrual != ledger_write
soft_accrual != balance_mutation
soft_accrual != active_reward_producer
soft_accrual != runtime_accrual_pipeline
soft_accrual != spend_authority
soft_accrual != payout_obligation
```

## 8. Canonical Lifecycle Stages Overview

This document defines the following canonical semantic lifecycle stages:

```text
1. Observed
2. Classified
3. Pending
4. Conditional
5. Advisory / Projected
6. Available
7. Spent
8. Burned
9. Reversed
10. Corrected
11. Expired
12. Archived
```

These stages are vocabulary.

They are not mandatory transitions.

They are not a total order.

They are not a state machine.

They are not ledger rows.

They are not runtime tasks.

## 9. Stage 1 - Observed

### Semantic Meaning

Observed means the ecosystem has noticed an activity, event, or signal.

Examples:

- an activity event occurred;
- a referral signal appeared;
- a voucher interaction was seen;
- a quest activity was detected;
- a progression signal was generated;
- an operational discrepancy was detected.

### Interpretation

Observed value is pre-reward semantic material.

It may later be classified, ignored, held pending, or interpreted by policy language.

### Boundary

```text
observed != reward
observed != ledger_write
observed != producer_activation
observed != granted_value
observed != authoritative_balance
```

## 10. Stage 2 - Classified

### Semantic Meaning

Classified means the observed event or value has been mapped to semantic event family, Point class, and axis profile.

Examples:

- an activity event is mapped to Activity Events;
- a referral event is mapped to Referral Events;
- a voucher event is mapped to RF / Voucher Events;
- a correction event is mapped to Compensation / Correction Events;
- a signal is mapped to a progression or externalization boundary class.

### Interpretation

Classification helps explain meaning.

It does not create reward authority.

### Boundary

```text
classified != granted
classified != authoritative
classified != ledger_backed
classified != reward_producer_activation
classified != spend_permission
```

## 11. Stage 3 - Pending

### Semantic Meaning

Pending means potential value awaits policy interpretation, eligibility context, moderation, verification, condition evaluation, or future classification.

Examples:

- activity awaiting policy interpretation;
- contribution awaiting quality review language;
- referral value awaiting condition interpretation;
- network value awaiting eligibility context;
- voucher-related value awaiting consumption or correction context.

### Interpretation

Pending value is not available value.

Pending value may become ignored, classified, conditional, advisory, available, corrected, or archived by future policy language.

### Boundary

```text
pending != available
pending != spendable
pending != ledger_truth
pending != payout
pending != runtime_queue
```

## 12. Stage 4 - Conditional

### Semantic Meaning

Conditional means value exists as conditional, locked, dependent, or eligibility-bound value.

Examples:

- `referral_locked`;
- VIP-dependent unlock;
- network eligibility candidate;
- referral activation condition;
- future campaign condition.

### Interpretation

Conditional value can create VIP pressure and explain potential utility.

Conditional value must remain distinguishable from available value.

### Boundary

```text
conditional != available
conditional != spendable_balance
conditional != payout_right
conditional != automatic_unlock
visible_conditional_value != spendable_balance
```

## 13. Stage 5 - Advisory / Projected

### Semantic Meaning

Advisory / Projected means value is explanatory, estimated, visible as potential, or used for safe product/economy communication.

Examples:

- network projection;
- future value;
- VIP pressure;
- progression hint;
- advisory wallet explanation;
- future sink compatibility;
- externalization boundary candidate.

### Interpretation

Advisory and projected value can help explain motivation and future utility.

It must not be confused with authoritative or ledger-backed value.

### Boundary

```text
projection != ledger_truth
advisory != authoritative
projected_value != granted_reward
projected_network_activity != passive_income
advisory_visibility != wallet_balance
```

## 14. Stage 6 - Available

### Semantic Meaning

Available means value is considered available for use within policy language or future ledger vocabulary.

Available may describe ordinary available Points where runtime-aligned policy and actual runtime facts support that interpretation.

### Interpretation

Available is stronger than pending, conditional, or projected.

However, available is not payout and does not itself approve every spend.

### Boundary

```text
available != guaranteed_spend_approval
available != runtime_spend_enforcement
available != payout
available != cash_balance
available != financial_obligation
available != partner_settlement
```

## 15. Stage 7 - Spent

### Semantic Meaning

Spent means value has been used in a sink or consumption context.

Examples:

- voucher consumption;
- quest participation;
- social sink use;
- premium access consumption where separately defined;
- standard Points spend where runtime-aligned policy allows.

### Interpretation

Spent is consumption vocabulary.

It does not mean payment settlement with a partner.

### Boundary

```text
spent != partner_settlement
spent != payment_for_underlying_offline_service
spent != payout
spent != PRO_payout
spent != financial_accounting_entry
```

## 16. Stage 8 - Burned

### Semantic Meaning

Burned means value has been consumed, destroyed, or removed from economic circulation as anti-inflation or premium-access vocabulary.

Examples:

- Points consumed by a sink;
- internal burn language for anti-inflation;
- premium-access candidate consumption;
- future NFT-related sink vocabulary where separately defined.

### Interpretation

Burned is internal economy language unless a separate future blockchain/on-chain policy explicitly defines otherwise.

### Boundary

```text
burned != on_chain_burn
burned != blockchain_activation
burned != NFT_burn_activation
burn_semantics != token_activation
burn_semantics != gateway_activation
```

## 17. Stage 9 - Reversed

### Semantic Meaning

Reversed means a value interpretation has been cancelled, unwound, or negated as semantic correction language.

Examples:

- duplicate value reversal;
- invalid duplicate relation reversal;
- correction of an incorrect value state;
- policy-level reversal vocabulary;
- operational reversal after mismatch.

### Interpretation

Reversal is not punishment.

Reversal is not a fraud conviction.

Reversal is not enforcement activation.

### Boundary

```text
reversed != punitive_enforcement
reversal != fraud_conviction
reversal != account_sanction
reversal != deny_behavior
reversal != fail_closed_behavior
```

## 18. Stage 10 - Corrected

### Semantic Meaning

Corrected means value has been adjusted within recovery, support, reconciliation, or consistency semantics.

Examples:

- correction applied;
- compensation granted for operational recovery;
- RF spend compensation;
- support adjustment;
- operational reconciliation.

### Interpretation

Correction is operational recovery semantics.

It must not become a gamification reward.

### Boundary

```text
corrected != reward_loop
correction != gamification_reward
compensation_correction != payout
support_adjustment != payout_right
operational_recovery != financial_accounting_system
```

## 19. Stage 11 - Expired

### Semantic Meaning

Expired means value has lost current relevance, eligibility, time validity, or campaign relevance.

Examples:

- time-limited opportunity no longer relevant;
- campaign-scoped value no longer active;
- eligibility window no longer current;
- advisory projection no longer useful;
- VIP-related pressure no longer current.

### Interpretation

Expiration is temporal or policy relevance language.

It is not punishment.

### Boundary

```text
expired != punishment
expiration != deny_behavior
expiration != fail_closed_behavior
expiration != confiscation
expiration != enforcement_activation
```

## 20. Stage 12 - Archived

### Semantic Meaning

Archived means a value, event, or lifecycle item has moved to historical or reference status.

Examples:

- historical event record;
- closed advisory projection;
- completed progression reference;
- old campaign context;
- corrected item reference;
- non-current lifecycle item.

### Interpretation

Archived means no longer active in current semantic interpretation.

Archived does not mean deleted.

Archived does not mean enforcement closure.

### Boundary

```text
archived != deleted
archived != enforcement_closure
archived != runtime_deletion
archived != approval_artifact
archived != evidence_bundle
```

## 21. Soft Accrual Rules

The following soft accrual rules are mandatory:

1. Event observation does not automatically create reward.
2. Reward relevance does not automatically create Points.
3. Classification does not imply grant.
4. Visibility does not imply spendability.
5. Conditional value must remain distinguishable from available value.
6. Projected value must remain distinguishable from ledger-backed value.
7. Available ordinary Points may be fungible unless separately scoped by future policy.
8. Correction and reversal must not be gamified.
9. Compensation must remain operational recovery, not a reward loop.
10. Network projected value must not be framed as passive income.
11. Referral value must not be framed as commission, payout, or MLM.
12. Voucher interaction must not be framed as partner settlement.
13. Spent value must not be framed as payment for the underlying offline service.
14. Burned value must not be framed as on-chain burn unless separately implemented.
15. Externalization candidates must remain future boundary language only.

Soft accrual rule boundary:

```text
soft_accrual_rules != runtime_rules
soft_accrual_rules != ledger_rules
soft_accrual_rules != producer_rules
soft_accrual_rules != spend_enforcement_rules
soft_accrual_rules != payout_rules
```

## 22. Lifecycle and Reward Event Families

This lifecycle follows `docs/economy/reward_event_catalog_v1.md`.

Typical family relationships:

```text
Activity Events -> observed / classified / pending / available
Contribution Events -> observed / classified / pending / available / advisory
Referral Events -> observed / conditional / projected / available-after-valid-unlock
Network Activity Events -> observed / projected / advisory / available-if-granted
RF / Voucher Events -> observed / claimed / spent / burned / corrected
Quest / Experience Events -> observed / classified / pending / available / progression-relevant
Progression / Prestige Events -> observed / classified / advisory / archived
Compensation / Correction Events -> detected / corrected / reversed / archived
VIP Activation Events -> observed / activated / expired / reactivated as semantic context only
Sink Participation Events -> available / spent / burned / archived
Externalization-sensitive Events -> advisory / future-scoped / archived
```

These patterns are illustrative only.

They are not runtime flows.

They are not event sourcing flows.

They are not ledger transition graphs.

## 23. Lifecycle and Point Classes

This lifecycle follows `docs/economy/points_taxonomy_v1.md`.

Point class relationships:

- Personal Activity Points usually move toward available ordinary utility if policy grants them.
- Contribution Points may move from observed/classified to pending, advisory, or available where policy grants them.
- Conditional Referral Points often live in conditional, locked, projected, or available-after-valid-unlock language.
- Network Activity Points may remain projected or advisory unless actually granted by runtime-aligned policy.
- RF / Voucher-related Points may participate in spent, burned, corrected, or archived stages when consumption or recovery context exists.
- Quest / Experience Points may move from observed to available or progression-relevant language where policy grants value.
- Progression / Prestige Signals may remain advisory, non-fungible, status-oriented, or archived.
- Compensation / Correction Points are primarily corrected, reversed, recovery, or archived semantics.

Boundary:

```text
point_class_lifecycle != wallet_implementation
point_class_lifecycle != ledger_table_design
point_class_lifecycle != active_reward_producer
```

## 24. Lifecycle and Semantic Axes

This document applies the axes from `docs/economy/points/semantic_axes_of_points_v1.md`.

Axis relationships:

- Origin explains where the lifecycle item came from.
- State explains the condition of value at a point in semantic interpretation.
- Visibility explains whether and how the value can be seen.
- Spendability explains potential sink compatibility, not runtime spend approval.
- Authority explains whether the value is advisory, projected, policy-described, runtime-aligned, or future ledger-backed.
- Utility explains economic function.
- Layer explains position in the Layered Value Architecture.
- Lifecycle explains movement of value language.
- Sinkability explains potential consumption compatibility.
- Fungibility explains whether ordinary available value may mix with common balance.
- Risk / Abuse explains semantic sensitivity without enforcement activation.

Core axis boundaries:

```text
origin_is_metadata_not_currency_type
state_determines_availability
visible != spendable
projected != ledger_truth
advisory != authoritative
lifecycle_axis != runtime_state_machine
semantic_axes != implementation_model
```

## 25. Lifecycle and VIP Activation

VIP is the Level 2 Economic Activation Layer.

VIP may influence:

- visibility;
- pressure;
- unlock interpretation;
- spend context;
- premium access;
- consumption desire;
- status relevance.

However:

```text
VIP_lifecycle != entitlement_authority_switch
VIP_pressure != spend_approval
VIP_activation_event != runtime_activation
VIP_unlock_language != automatic_referral_unlock
VIP_spend_context != spend_enforcement
```

The reward lifecycle does not implement VIP entitlement lifecycle.

The reward lifecycle does not replace current runtime authority.

## 26. Lifecycle and Sinks

Sinks operate semantically on available or spendable value only where policy and runtime allow.

Sink-related lifecycle vocabulary may include:

- available;
- sink-attached;
- spent;
- burned;
- corrected;
- archived.

Important boundaries:

```text
sink_consumed != active_sink_pipeline
spent != payment_settlement
spent != partner_settlement
burned != blockchain_burn
premium_sink_candidate != premium_runtime_activation
NFT_sink_candidate != NFT_mint_activation
sinkability != spend_enforcement
```

This document does not activate voucher sinks, quest sinks, NFT sinks, premium sinks, social sinks, status sinks, payment rejection, or spend enforcement.

## 27. Lifecycle and Future Ledger Vocabulary

Lifecycle stages may help future ledger vocabulary.

They may help future documents distinguish:

- observed signal;
- classified event;
- pending potential value;
- conditional value;
- projected value;
- available value;
- spent value;
- burned value;
- reversed value;
- corrected value;
- expired value;
- archived value.

However:

```text
lifecycle_stage != ledger_state
lifecycle_transition != ledger_write
lifecycle_rules != accounting_system
future_ledger_vocabulary != ledger_activation
soft_accrual != ledger_accrual
available_semantics != ledger_commit
```

Future ledger interpretation, if ever pursued, requires separate policy, implementation design, migrations, runtime contracts, QA, security, privacy, fraud, and governance approval. None are created here.

## 28. Lifecycle Safety Invariants

The following invariants are mandatory:

```text
observed != reward
classified != granted
pending != available
conditional != available
visible != spendable
projected != ledger_truth
advisory != authoritative
available != payout
spent != partner_settlement
burned != blockchain_activation
corrected != reward_loop
reversed != punitive_enforcement
expired != punishment
lifecycle != state_machine
lifecycle != ledger_activation
lifecycle != reward_producer_activation
lifecycle != accrual_pipeline_activation
lifecycle != spend_enforcement
diagnostics != authority
shadow_graph != enforcement
```

Additional soft accrual invariants:

```text
soft_accrual != balance_mutation
soft_accrual != runtime_accrual
soft_accrual != producer_activation
soft_accrual != payout_obligation
network_projection != passive_income
externalization_candidate != G2A_activation
NFT_export_candidate != on_chain_activation
```

## 29. Forbidden Interpretations

The following interpretations are forbidden:

- lifecycle creates runtime states;
- lifecycle creates ledger transitions;
- lifecycle creates database schema;
- lifecycle creates API contracts;
- lifecycle activates reward producers;
- lifecycle activates accrual pipeline;
- lifecycle authorizes spend enforcement;
- lifecycle authorizes payout behavior;
- observed events automatically create rewards;
- classified value becomes granted value;
- pending value becomes available value;
- conditional value becomes spendable balance;
- projected value becomes authoritative balance;
- available value becomes payout;
- spent value becomes partner settlement;
- burned value becomes on-chain burn;
- correction becomes gamified reward;
- compensation becomes payout;
- reversal becomes fraud conviction;
- reversal becomes punitive enforcement;
- expiration becomes punishment;
- archived means deleted;
- lifecycle document creates implementation tasks;
- lifecycle document creates rollout tasks;
- lifecycle document creates QA acceptance;
- lifecycle document creates evidence execution;
- lifecycle document unblocks Slice 16.

Forbidden interpretation status:

```text
implicit_runtime_state_creation: forbidden
implicit_ledger_transition_creation: forbidden
implicit_database_schema_creation: forbidden
implicit_api_contract_creation: forbidden
implicit_reward_producer_activation: forbidden
implicit_accrual_pipeline_activation: forbidden
implicit_spend_enforcement_activation: forbidden
implicit_payout_activation: forbidden
implicit_partner_settlement_activation: forbidden
implicit_on_chain_burn_activation: forbidden
implicit_runtime_implementation_task: forbidden
implicit_rollout_task: forbidden
implicit_slice_16_unblock: forbidden
```

## 30. Relationship to Existing Economy SSOT

This document does not replace existing Economy SSOT documents.

Relationship:

- `docs/economy/README.md` remains the economy entry point.
- `docs/economy/reward_event_catalog_v1.md` remains the semantic event catalog.
- `docs/economy/points_taxonomy_v1.md` remains the semantic taxonomy of Point classes.
- `docs/economy/points/semantic_axes_of_points_v1.md` remains the coordinate system for classification.
- `docs/economy/points_policy_v1.md` remains the runtime-aligned Points policy.
- `docs/economy/referral_network_rewards_policy_v1.md` remains the runtime-aligned referral / network policy.
- `docs/economy/layered_value_architecture_v1.md` remains the value topology.
- `docs/economy/tokenomics/go2asia_tokenomics_v1.md` remains the full economy model.
- `docs/economy/vip/vip_value_system_v1.md` remains the behavioral VIP model.
- `docs/economy/points/points_sink_design_v1.md` remains the anti-inflation / sink model.
- `docs/economy/vouchers/rf_voucher_economy_v1.md` remains the voucher consumption model.
- `docs/architecture/domain/economy_scope_reentry_note_v1.md` remains the Stage 6.1 soft economy / enforcement boundary note.

SSOT boundary:

```text
reward_lifecycle_role: semantic_lifecycle_and_soft_accrual_policy_language
reward_event_catalog_role: semantic_event_families
points_taxonomy_role: semantic_point_classes
semantic_axes_role: coordinate_system
points_policy_role: runtime_aligned_points_policy
referral_policy_role: runtime_aligned_referral_network_policy
layered_value_architecture_role: value_topology
tokenomics_role: full_economy_model
vip_value_system_role: behavioral_vip_model
points_sink_design_role: anti_inflation_sink_model
rf_voucher_economy_role: voucher_consumption_model
stage_6_1_role: soft_economy_enforcement_boundary
```

If this document appears to conflict with runtime-aligned policy, the runtime-aligned policy controls runtime interpretation.

## 31. Runtime / QA Boundary

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
- reward producer activation tasks;
- accrual pipeline activation tasks;
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

## 32. Stage 6.4 Naming Boundary

This document is Stage 6.4 - Reward Lifecycle / Soft Accrual Rules v1.

It must not be confused with the existing `docs/economy/README.md` section numbering where `6.4` currently refers to Points Sink Design.

Boundary:

```text
stage_6_4_reward_lifecycle_soft_accrual_rules != readme_section_6_4_points_sink_design
reward_lifecycle_soft_accrual_rules_v1_path: docs/economy/reward_lifecycle_soft_accrual_rules_v1.md
```

## 33. Final Classification

```text
document_type: reward_lifecycle_soft_accrual_rules_v1
document_mode: docs_only
stage: Stage 6.4
semantic_scope: reward_lifecycle_and_soft_accrual_policy_language
ledger_state_machine_status: not_ledger_state_machine
event_sourcing_status: not_event_sourcing_design
runtime_accrual_pipeline_status: not_runtime_accrual_pipeline
reward_producer_implementation_status: not_reward_producer_implementation
database_schema_status: not_database_schema
api_contract_status: not_API_contract
spend_enforcement_model_status: not_spend_enforcement_model
payout_system_status: not_payout_system
financial_accounting_system_status: not_financial_accounting_system
runtime_changes_added: no
migrations_added: no
api_changes_added: no
feature_flags_added: no
implementation_changes_added: no
ledger_activation_added: no
ledger_transition_activation_added: no
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
final_verdict: reward_lifecycle_soft_accrual_rules_v1_defines_semantic_lifecycle_stages_and_soft_accrual_policy_language_without_creating_runtime_states_ledger_transitions_reward_producers_accrual_pipeline_spend_enforcement_payout_system_financial_accounting_or_slice_16_progression
```
