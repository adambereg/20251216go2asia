# Semantic Axes of Points v1

Date: 2026-05-17  
Status: `NOTE_READY_PRE_STAGE_6_2_SEMANTIC_AXES_OF_POINTS_DOCS_ONLY`  
Mode: semantic axes framework for Points, pre-taxonomy note, docs-only, read-only reference, explanatory framing only, no runtime changes, no migrations, no API changes, no feature flags, no implementation changes, no ledger activation, no reward producer activation, no accrual pipeline activation, no spend enforcement, no enforcement mechanics, no production/runtime activation, no execution authorization, no governance approval, no Slice 16 readiness, no Slice 16 unblock, no rollout strategy, no implementation plan, no operational mandate, no evidence execution, no validation execution, no test plan, no QA acceptance, no deny or fail-closed behavior, no payment rejection logic, no authority switching

## 1. Purpose

This document defines the semantic axes that should be used to reason about Points in Go2Asia before Stage 6.2 - Points Taxonomy v1.

It answers one question:

```text
By which semantic dimensions should Points be classified before actual taxonomy values are finalized?
```

This document is not the final taxonomy of Points.

It is not:

- a final list of Point types;
- a reward catalog;
- a reward size table;
- a ledger design;
- a runtime model;
- an implementation plan;
- a state machine;
- a spend enforcement model.

It is a semantic framework for thinking clearly before naming actual Point classes.

## 2. Main Thesis

Points cannot be classified by a single dimension.

Labels such as "Activity Points", "Referral Points", or "Quest Points" describe only the origin axis.

Go2Asia also needs at least these semantic axes:

- origin axis;
- state axis;
- visibility axis;
- spendability axis;
- authority axis;
- utility axis;
- layer axis;
- lifecycle axis;
- sinkability axis;
- fungibility axis;
- risk / abuse axis.

Core thesis:

```text
origin_is_metadata_not_currency_type
state_determines_availability
spendability_is_not_visibility
projection_is_not_ledger_truth
taxonomy_is_not_runtime_authority
semantic_axes_are_not_implementation_model
```

## 3. Reading Contract

This document must be read as semantic preparation for future taxonomy work.

It does not override:

- `docs/economy/points_policy_v1.md`;
- `docs/economy/referral_network_rewards_policy_v1.md`;
- `docs/economy/layered_value_architecture_v1.md`;
- `docs/architecture/domain/economy_scope_reentry_note_v1.md`;
- Phase G closure boundaries.

If this document appears to conflict with runtime-aligned policy, the runtime-aligned policy controls runtime interpretation.

Reading boundary:

```text
semantic_axes_role: pre_taxonomy_framework
runtime_policy_authority: points_policy_v1_and_referral_network_rewards_policy_v1
taxonomy_status: not_final
runtime_authority_status: non_authoritative
```

## 4. Source Materials and Review Scope

This document was prepared after read-first review of:

- `docs/economy/README.md`;
- `docs/economy/layered_value_architecture_v1.md`;
- `docs/architecture/domain/economy_scope_reentry_note_v1.md`;
- `docs/economy/points_policy_v1.md`;
- `docs/economy/referral_network_rewards_policy_v1.md`;
- `docs/economy/tokenomics/go2asia_tokenomics_v1.md`;
- `docs/economy/vip/vip_value_system_v1.md`;
- `docs/economy/points/points_sink_design_v1.md`;
- `docs/economy/vouchers/rf_voucher_economy_v1.md`;
- relevant Phase G closure documents.

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
artifact_scope: semantic_axes_only
runtime_review_status: not_performed
validation_execution_status: not_executed
evidence_collection_status: not_collected
implementation_tasks_status: none_implied_none_required
```

## 5. What Is a Semantic Axis?

A semantic axis is a dimension for interpreting Points.

An axis does not necessarily create:

- a separate wallet currency;
- a separate ledger table;
- a separate runtime type;
- a separate balance;
- a separate API contract;
- a separate reward producer.

An axis answers a classification question.

Examples:

- Origin asks: where did the Points come from?
- State asks: what condition are the Points currently in?
- Visibility asks: what can the user see?
- Spendability asks: can the Points be used in sinks?
- Authority asks: how trustworthy is this value?

Axes can combine. For example, a value may be referral-origin, locked, visible, non-spendable, projected, Level 1, and referral-abuse-prone at the same time.

## 6. Axis 1 - Origin Axis

### Meaning

The Origin Axis describes where Points came from.

It is about source, not currency identity.

Examples:

- activity-origin;
- contribution-origin;
- referral-origin;
- network-origin;
- RF / partner-origin;
- quest-origin;
- compensation-origin;
- admin/manual-origin;
- future campaign-origin.

### Interpretation

Origin is metadata.

Origin helps explain why a value exists, which product surface created it, and which policy document should interpret it.

Origin does not create a separate currency.

After unlock or settlement into ordinary available Points, ordinary available Points may be fungible in the common available balance unless a separate future policy defines scoped or non-fungible values.

Boundary:

```text
origin_axis_role: source_metadata
origin_is_currency_type: false
origin_creates_separate_wallet_currency: false
```

### Non-Goals

The Origin Axis does not define reward sizes, grant rules, producers, event contracts, or ledger writes.

## 7. Axis 2 - State Axis

### Meaning

The State Axis describes the condition of Points.

Examples:

- pending;
- locked;
- conditional;
- available;
- spent;
- burned;
- expired;
- reversed;
- corrected.

### Interpretation

State affects availability, display, and future ledger interpretation.

State determines whether Points can be interpreted as available, conditional, consumed, reversed, or no longer usable.

State is more important than origin for availability.

Boundary:

```text
state_determines_availability
state_axis != runtime_state_machine
state_axis != implementation_model
```

### Non-Goals

This document does not implement a state machine.

It does not define transitions, database columns, event names, or enforcement behavior.

## 8. Axis 3 - Visibility Axis

### Meaning

The Visibility Axis describes whether and how the user can see value.

Examples:

- hidden;
- visible;
- advisory-visible;
- projected;
- summarized;
- detailed.

### Interpretation

Visibility is not spendability.

A value can be visible and still not spendable.

Advisory visibility is not wallet balance.

A projection can explain potential, conditional, network, or future value without becoming ledger truth.

Boundary:

```text
visible != spendable
advisory_visible != wallet_balance
projection != ledger_truth
```

### Non-Goals

This document does not define UI components, wallet screens, projection contracts, or display implementation.

## 9. Axis 4 - Spendability Axis

### Meaning

The Spendability Axis describes whether Points can be used in sinks.

Examples:

- non-spendable;
- conditionally spendable;
- available for standard sinks;
- available for premium sinks;
- future-scoped only.

### Interpretation

Spendability is a semantic classification, not runtime spend approval.

Spendability depends on state, policy, VIP activation, sink policy, and current runtime alignment.

Semantic spendability categories must not be read as live spend enforcement.

Boundary:

```text
spendability_axis != runtime_spend_approval
spendability_axis != spend_enforcement_activation
spendability_category != payment_authority
```

### Non-Goals

This document does not activate spend checks, deny behavior, fail-closed behavior, payment rejection, or Points spend enforcement.

## 10. Axis 5 - Authority Axis

### Meaning

The Authority Axis describes the level of trust, truth, or governance status of a value.

Examples:

- policy-described;
- projected;
- derived;
- ledger-backed future;
- runtime-aligned;
- non-authoritative advisory.

### Interpretation

Authority determines whether a value is policy language, projection, derived explanation, future ledger concept, runtime-aligned fact, or advisory note.

Projection is not ledger truth.

Diagnostics are not authority.

Shadow is not enforcement.

Boundary:

```text
projected != ledger_backed
derived != source_of_truth
advisory != authoritative
diagnostics != authority
shadow_graph != enforcement
taxonomy != runtime_authority
```

### Non-Goals

This document does not create authority sources, replace service ownership, approve ledger behavior, or change runtime authority.

## 11. Axis 6 - Utility Axis

### Meaning

The Utility Axis describes what function Points perform in the economy.

Examples:

- engagement utility;
- contribution utility;
- pressure utility;
- unlock utility;
- consumption utility;
- progression utility;
- reputation-like signal;
- compensation/correction utility.

### Interpretation

Utility is economic function, not payout obligation.

A reputation-like signal can explain contribution or status without becoming wallet balance.

Compensation/correction utility is operational recovery language, not a user reward loop.

Boundary:

```text
utility != payout
reputation_like_signal != spendable_balance
compensation_correction_utility != user_reward_loop
```

### Non-Goals

This document does not define payouts, commissions, passive income, PRO reward runtime, partner settlement, or cash-out semantics.

## 12. Axis 7 - Layer Axis

### Meaning

The Layer Axis connects Points to `docs/economy/layered_value_architecture_v1.md`.

Examples:

- Level 0 attention signals;
- Level 1 internal utility;
- Level 2 VIP activation pressure;
- Level 3 consumption fuel;
- Level 4 progression fuel;
- Level 5 operator-related signals;
- Level 6 externalized value boundary.

### Interpretation

Points primarily belong to Level 1 - Internal Utility Layer.

Points can participate in transitions toward other layers:

- they can create VIP activation pressure at Level 2;
- they can fuel consumption at Level 3;
- they can support progression at Level 4;
- they can be associated with operator-related signals at Level 5;
- they can approach externalized value boundaries only through controlled future layers at Level 6.

Points are not G2A.

Points are not NFT.

Boundary:

```text
points_primary_layer: level_1_internal_utility
points_can_participate_in_layer_transitions: true
points_are_g2a: false
points_are_nft: false
layer_axis != release_stage
layer_axis != enforcement_stage
```

### Non-Goals

This document does not activate G2A, NFT, Blockchain Gateway, externalization, or on-chain mechanics.

## 13. Axis 8 - Lifecycle Axis

### Meaning

The Lifecycle Axis describes the stage of value movement.

Examples:

- generated;
- observed;
- classified;
- accrued;
- displayed;
- unlocked;
- spent;
- burned;
- corrected;
- archived.

### Interpretation

Lifecycle vocabulary helps future taxonomy describe value movement.

Lifecycle vocabulary is not runtime activation.

Future ledger preparation is not ledger activation.

Boundary:

```text
lifecycle_vocabulary != runtime_activation
future_ledger_preparation != ledger_activation
observability_first_lifecycle != evidence_execution
```

### Non-Goals

This document does not define lifecycle transitions, event flows, replay behavior, rollback behavior, or executable runbooks.

## 14. Axis 9 - Sinkability Axis

### Meaning

The Sinkability Axis describes where Points can potentially be spent or consumed.

Examples:

- voucher-sinkable;
- quest-sinkable;
- NFT-mint-sinkable;
- premium-voucher-compatible;
- social-sinkable;
- status-sinkable;
- not-sinkable.

### Interpretation

Potential sinkability is not active sink implementation.

Sinkability depends on current runtime alignment, policy, VIP activation, and whether the sink exists as active runtime.

Boundary:

```text
potential_sinkability != active_sink_implementation
sinkability_axis != spend_pipeline_activation
premium_compatibility != premium_runtime_activation
nft_mint_sinkable != nft_mint_activation
```

### Non-Goals

This document does not add new sinks, activate NFT minting, activate premium voucher logic, or define spend prices.

## 15. Axis 10 - Fungibility Axis

### Meaning

The Fungibility Axis describes whether Points become interchangeable after unlock or remain scoped, restricted, or non-fungible.

### Core Position

Ordinary available Points are fungible.

Origin does not create separate wallet currencies.

Ordinary available Points can be used from a common available balance unless a separate future policy defines scoped or non-fungible values.

Boundary:

```text
ordinary_available_points_are_fungible: true
origin_creates_separate_wallet_currency: false
common_available_balance_allowed_unless_separately_scoped_by_future_policy: true
```

### Important Exceptions

Not every value that looks like Points should be treated as fungible ordinary available Points.

Examples:

- reputation-like signals may be non-fungible;
- scoped campaign values may be non-fungible;
- partner-specific future values may be non-fungible;
- progression markers are not fungible Points;
- advisory projections are not fungible balances;
- externalized value boundary signals are not fungible Points.

Boundary:

```text
reputation_like_signal != fungible_points
progression_marker != fungible_points
advisory_projection != fungible_balance
externalized_value_signal != available_points
```

### Non-Goals

This document does not define scoped campaign rules, partner-specific balances, wallet buckets, or ledger mixing behavior.

## 16. Axis 11 - Risk / Abuse Axis

### Meaning

The Risk / Abuse Axis describes which Points or Point-like values require higher fraud, abuse, or governance attention.

Examples:

- low-risk activity signals;
- spam-prone activity rewards;
- referral-abuse-prone rewards;
- network-amplified rewards;
- compensation/correction-sensitive values;
- partner/RF-sensitive values;
- externalization-sensitive values.

### Interpretation

Risk classification is semantic review language.

Risk classification is not enforcement activation.

Fraud review language is not runtime denial.

Boundary:

```text
risk_classification != enforcement_activation
fraud_review_language != runtime_denial
abuse_sensitive != fail_closed_behavior
externalization_sensitive != g2a_activation
```

### Non-Goals

This document does not activate risk scoring, account blocking, payment rejection, deny behavior, fail-closed behavior, or anti-fraud runtime enforcement.

## 17. Axis Interaction Examples

The axes are designed to be combined.

Example interpretation patterns:

```text
activity-origin + available + visible + standard-sinkable + runtime-aligned
referral-origin + conditional + visible + non-spendable + projected
network-origin + advisory-visible + projected + risk-sensitive
compensation-origin + corrected + ledger-backed-future + correction-utility
campaign-origin + future-scoped-only + non-fungible + not-current-runtime
```

These examples are illustrative only.

They are not final taxonomy classes.

They are not reward catalog entries.

They are not ledger rows.

They are not runtime instructions.

## 18. Core Semantic Invariants

The following invariants are mandatory:

```text
Points != money
Points != G2A
Points != NFT
Points != payout
Origin != currency_type
Origin is metadata
State determines availability
Visible != spendable
Projected != ledger_backed
Advisory != authoritative
Reputation_like_signal != spendable_balance
Available ordinary Points are fungible unless separately scoped by future policy
Taxonomy != runtime_authority
Semantic axes != implementation_model
Future ledger preparation != ledger_activation
Risk classification != enforcement
```

Additional Stage 6 / Phase G invariants:

```text
diagnostics != authority
shadow_graph != enforcement
runtime != approval
implementation != rollout
recommendation != authorization
review_readiness != execution_authorization
phase_g_closure != execution_authorization
phase_g_closure != enforcement_approval
phase_g_closure != slice_16_readiness
slice_16_status: blocked_not_triggered
production_status: not_touched
```

## 19. Forbidden Interpretations

The following interpretations are forbidden:

- semantic axes create new wallet types;
- origin categories create separate currencies;
- visible value is spendable balance;
- projected values are ledger truth;
- advisory values are authoritative;
- risk categories authorize denial or fail-closed behavior;
- spendability categories activate spend enforcement;
- externalization-sensitive values activate G2A or on-chain flows;
- reputation-like signals become money;
- utility categories create payout obligations;
- lifecycle vocabulary activates reward producers;
- sinkability categories activate new sinks;
- fungibility statements create wallet implementation rules;
- this document creates runtime implementation tasks;
- this document creates ledger design;
- this document creates reward catalog entries;
- this document creates reward sizes;
- this document creates production/runtime activation;
- this document unblocks Slice 16.

Forbidden interpretation status:

```text
implicit_wallet_type_creation: forbidden
implicit_currency_creation: forbidden
implicit_ledger_activation: forbidden
implicit_reward_producer_activation: forbidden
implicit_spend_enforcement: forbidden
implicit_g2a_or_on_chain_activation: forbidden
implicit_runtime_implementation_task: forbidden
implicit_slice_16_unblock: forbidden
```

## 20. Relationship to Stage 6.2

Semantic Axes of Points is a preparatory document.

It exists to help write future `points_taxonomy_v1.md`.

Stage 6.2 - Points Taxonomy v1 may use these axes to classify actual Point classes, Point action categories, or policy vocabulary.

This document itself is not the final taxonomy.

Relationship:

```text
semantic_axes_of_points_v1: pre_taxonomy_framework
points_taxonomy_v1: future_artifact_not_created_here
semantic_axes_define_dimensions: true
semantic_axes_define_final_types: false
```

Important note:

Stage 6.2 here means a future Points Taxonomy stage. It must not be confused with the existing `docs/economy/README.md` section numbering where `6.2` currently refers to Voucher Economy.

## 21. Relationship to Existing SSOT

This document does not replace existing Economy SSOT documents.

Relationship:

- `docs/economy/README.md` remains the economy entry point.
- `docs/economy/layered_value_architecture_v1.md` remains the value topology.
- `docs/economy/points_policy_v1.md` remains the runtime-aligned Points policy.
- `docs/economy/referral_network_rewards_policy_v1.md` remains the referral / network policy.
- `docs/economy/tokenomics/go2asia_tokenomics_v1.md` remains the full economy model.
- `docs/economy/vip/vip_value_system_v1.md` remains the behavioral VIP model.
- `docs/economy/points/points_sink_design_v1.md` remains the anti-inflation / sink model.
- `docs/economy/vouchers/rf_voucher_economy_v1.md` remains the voucher consumption model.

SSOT boundary:

```text
semantic_axes_role: preparatory_framework
readme_role: economy_entry_point
layered_value_architecture_role: value_topology
points_policy_role: runtime_aligned_points_policy
referral_policy_role: referral_network_policy
tokenomics_role: full_economy_model
vip_value_system_role: behavioral_vip_model
points_sink_design_role: anti_inflation_sink_model
rf_voucher_economy_role: voucher_consumption_model
```

## 22. Runtime / QA Boundary

This document does not request runtime validation.

It does not create:

- test plans;
- test execution;
- staging validation;
- evidence bundles;
- operational proof;
- QA release readiness;
- runtime acceptance status;
- production smoke validation.

Runtime Validation / QA may review this artifact for boundary consistency only.

Boundary review is not execution authorization.

QA boundary:

```text
runtime_validation_status: not_executed
qa_status: not_executed
evidence_status: not_collected
acceptance_status: not_requested
```

## 23. Final Classification

```text
document_type: semantic_axes_of_points_note
document_mode: docs_only
semantic_axes_status: descriptive_non_authoritative
taxonomy_status: not_final_taxonomy
reward_catalog_status: not_reward_catalog
reward_sizes_status: not_defined
ledger_design_status: not_ledger_design
runtime_model_status: not_runtime_model
implementation_plan_status: not_implementation_plan
runtime_changes_added: no
migrations_added: no
api_changes_added: no
feature_flags_added: no
implementation_changes_added: no
ledger_activation_added: no
reward_producer_activation_added: no
spend_enforcement_added: no
enforcement_mechanics_added: no
production_runtime_activation_added: no
tests_added_or_requested: no
evidence_added_or_requested: no
runtime_validation_added_or_requested: no
slice_16_status: blocked_not_triggered
final_verdict: semantic_axes_of_points_v1_defines_pre_taxonomy_classification_dimensions_without_creating_wallet_types_ledger_activation_reward_producers_spend_enforcement_runtime_authority_or_slice_16_progression
```
