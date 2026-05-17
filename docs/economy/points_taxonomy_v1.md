# Points Taxonomy v1

Date: 2026-05-17  
Status: `NOTE_READY_STAGE_6_2_POINTS_TAXONOMY_DOCS_ONLY`  
Stage: `Stage 6.2 / Points Taxonomy v1`  
Mode: semantic taxonomy of internal utility value, docs-only, read-only reference, explanatory classification only, no runtime changes, no migrations, no API changes, no feature flags, no implementation changes, no ledger activation, no reward producer activation, no accrual pipeline activation, no spend enforcement, no enforcement mechanics, no payout system, no financial accounting system, no production/runtime activation, no execution authorization, no governance approval, no Slice 16 readiness, no Slice 16 unblock, no rollout strategy, no implementation plan, no operational mandate, no evidence execution, no validation execution, no test plan, no QA acceptance, no deny or fail-closed behavior, no payment rejection logic, no authority switching

## 1. Purpose

This document formalizes the canonical semantic taxonomy of Points in Go2Asia.

It answers one question:

```text
Which semantic Point classes exist in Go2Asia, and how should they be interpreted across axes, layers, VIP activation, sinks, and future ledger language?
```

Main thesis:

```text
Points in Go2Asia are a taxonomy of internal utility value,
not a single undifferentiated reward balance.
```

This document defines semantic classes of internal utility value. It does not define runtime behavior.

## 2. Explicit Non-Goals

This document is not:

- a runtime model;
- a ledger design;
- a reward catalog;
- a reward size table;
- an implementation plan;
- a state machine;
- a spend enforcement model;
- a payout system;
- a financial accounting system;
- a wallet implementation model;
- an API contract;
- a migration plan;
- a rollout strategy;
- a production activation artifact.

Non-goal classification:

```text
points_taxonomy_v1_role: semantic_taxonomy_only
runtime_model_status: not_runtime_model
ledger_design_status: not_ledger_design
reward_catalog_status: not_reward_catalog
reward_sizes_status: not_defined
implementation_plan_status: not_implementation_plan
state_machine_status: not_state_machine
spend_enforcement_status: not_activated
payout_system_status: not_payout_system
financial_accounting_status: not_financial_accounting_system
```

## 3. Reading Contract

This document must be read together with:

- `docs/economy/README.md`;
- `docs/economy/layered_value_architecture_v1.md`;
- `docs/economy/points/semantic_axes_of_points_v1.md`;
- `docs/economy/points_policy_v1.md`;
- `docs/economy/referral_network_rewards_policy_v1.md`;
- `docs/economy/tokenomics/go2asia_tokenomics_v1.md`;
- `docs/economy/vip/vip_value_system_v1.md`;
- `docs/economy/points/points_sink_design_v1.md`;
- `docs/economy/vouchers/rf_voucher_economy_v1.md`;
- `docs/architecture/domain/economy_scope_reentry_note_v1.md`;
- relevant Phase G closure documents.

If this taxonomy appears to conflict with runtime-aligned policy, the runtime-aligned policy controls runtime interpretation:

```text
runtime_policy_authority: points_policy_v1_and_referral_network_rewards_policy_v1
taxonomy_authority_status: semantic_non_runtime
taxonomy_replaces_runtime_policy: false
```

## 4. Source Materials and Review Scope

This document was prepared after read-first review of the economy SSOT, Stage 6.1, Semantic Axes of Points, Layered Value Architecture, current runtime-aligned policies, and Phase G closure boundaries.

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
artifact_scope: points_taxonomy_semantic_only
runtime_review_status: not_performed
validation_execution_status: not_executed
evidence_collection_status: not_collected
implementation_tasks_status: none_implied_none_required
```

## 5. Relationship to Stage 6.1 and Phase G

This taxonomy follows `docs/architecture/domain/economy_scope_reentry_note_v1.md`.

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

Points Taxonomy v1 is a semantic economy artifact. It is not an authority transition, runtime transition, ledger activation, or Slice 16 progression.

## 6. Relationship to Semantic Axes of Points

`docs/economy/points/semantic_axes_of_points_v1.md` defines the coordinate system.

This document applies that coordinate system to canonical Point classes.

Relationship:

```text
semantic_axes_of_points_v1: classification_dimensions
points_taxonomy_v1: canonical_semantic_classes
semantic_axes_define_dimensions: true
taxonomy_defines_named_classes: true
taxonomy_defines_runtime_behavior: false
```

Core inherited thesis:

```text
origin_is_metadata_not_currency_type
state_determines_availability
spendability_is_not_visibility
projection_is_not_ledger_truth
taxonomy_is_not_runtime_authority
semantic_axes_are_not_implementation_model
```

## 7. Canonical Point Classes Overview

This taxonomy defines the following canonical semantic classes:

```text
1. Personal Activity Points
2. Contribution Points
3. Conditional Referral Points
4. Network Activity Points
5. RF / Voucher-related Points
6. Quest / Experience Points
7. Progression / Prestige Signals
8. Compensation / Correction Points
```

These are semantic classes of internal utility value.

They are not separate wallet currencies.

They are not separate financial accounts.

They are not automatically separate ledger tables.

They are not reward producers.

They are not runtime action implementations.

## 8. Taxonomy Relationship to Runtime-Aligned Policy Classes

`docs/economy/points_policy_v1.md` defines current runtime-aligned policy classes:

```text
Personal Points
Conditional Points
Network Points
Compensation Points
```

This taxonomy refines those classes semantically without replacing them.

Mapping:

```text
Personal Activity Points -> Personal Points policy family
Contribution Points -> Personal Points policy family unless future policy separately scopes them
Conditional Referral Points -> Conditional Points policy family
Network Activity Points -> Network Points policy family
RF / Voucher-related Points -> Personal / spend / compensation related policy context depending on state
Quest / Experience Points -> Personal Points policy family unless future policy separately scopes them
Progression / Prestige Signals -> point-like or status-oriented values; not necessarily ordinary fungible Points
Compensation / Correction Points -> Compensation Points policy family
```

Important boundary:

```text
semantic_class != separate_currency
semantic_class != automatic_wallet_bucket
semantic_class != active_reward_producer
semantic_class != runtime_action
```

## 9. Class 1 - Personal Activity Points

### Semantic Meaning

Personal Activity Points are Points earned from a user's own ordinary participation.

Examples:

- posts;
- likes;
- engagement;
- participation;
- basic account activity;
- ordinary Space Asia activity;
- event or simple product participation where separately covered by policy.

### Primary Utility

Primary utility:

```text
engagement_utility
pressure_utility
ecosystem_participation
```

Personal Activity Points create the basic accumulation loop:

```text
activity -> Points -> VIP pressure -> consumption opportunity
```

### Axes Profile

Typical semantic profile:

```text
origin: activity-origin
state: pending | available | spent | burned | corrected
visibility: visible | summarized | detailed
spendability: available_for_standard_sinks_when_policy_and_vip_allow
authority: runtime-aligned_where_current_policy_and_ledger_facts_exist
utility: engagement_utility | pressure_utility
layer: Level 1 Internal Utility
lifecycle: generated -> accrued -> displayed -> unlocked_or_available -> spent_or_burned
sinkability: voucher-sinkable | quest-sinkable | social-sinkable | status-sinkable_where_separately_defined
fungibility: normally_fungible_when_ordinary_available
risk_abuse: low-risk_activity_signals | spam-prone_activity_rewards
```

### LVA / VIP / Sink Relationship

Personal Activity Points primarily belong to Level 1 - Internal Utility.

They influence Level 2 - VIP activation by creating Points pressure.

They may participate in Level 3 sinks such as vouchers or quests when current policy, state, VIP status, and active runtime allow.

### Boundary

Personal Activity Points are not money, payout, G2A, NFT, or cash-out value.

## 10. Class 2 - Contribution Points

### Semantic Meaning

Contribution Points are Points associated with useful ecosystem contribution.

Examples:

- guides;
- reviews;
- Atlas content;
- useful travel information;
- curation;
- community contribution;
- practical local knowledge;
- quality-improving content.

Contribution Points describe higher-quality participation, not a financial work-for-hire model.

### Primary Utility

Primary utility:

```text
contribution_utility
reputation_like_utility
ecosystem_quality_growth
```

Contribution Points can help identify useful contributors and improve ecosystem quality.

### Axes Profile

Typical semantic profile:

```text
origin: contribution-origin
state: pending | available | corrected | archived
visibility: visible | advisory-visible | summarized | detailed
spendability: standard_sinkable_if_ordinary_available_and_policy_allows
authority: policy-described | runtime-aligned_where_current_ledger_facts_exist
utility: contribution_utility | reputation-like_signal
layer: Level 1 Internal Utility with Level 4 progression relevance
lifecycle: observed -> classified -> accrued -> displayed -> spent_or_archived
sinkability: voucher-sinkable | quest-sinkable | status-sinkable_where_separately_defined
fungibility: normally_fungible_when_settled_as_ordinary_available_points
risk_abuse: spam-prone_activity_rewards | contribution_quality_sensitive
```

### LVA / VIP / Sink Relationship

Contribution Points primarily belong to Level 1 as internal utility.

They can also influence Level 4 progression and prestige if contribution quality becomes status-oriented.

They may create VIP pressure by increasing visible accumulated value.

### Boundary

Contribution Points must not be interpreted as payout semantics, wage semantics, commission semantics, or partner settlement.

Contribution reputation is not spendable balance unless separately represented as ordinary available Points by runtime-aligned policy.

## 11. Class 3 - Conditional Referral Points

### Semantic Meaning

Conditional Referral Points are Points connected to referral events and unlock conditions.

Examples:

- locked referral rewards;
- VIP-dependent unlocks;
- direct referral conditional rewards;
- second-level referral conditional rewards where separately defined;
- referral activation conditions.

Current runtime-aligned policy identifies `referral_locked` as active. Referral unlock after first VIP purchase and second-level conditional flows remain target/future unless separately implemented.

### Primary Utility

Primary utility:

```text
pressure_utility
network_growth_utility
vip_conversion_utility
```

Conditional Referral Points make referral value visible while preserving the boundary between conditional value and available spend balance.

### Axes Profile

Typical semantic profile:

```text
origin: referral-origin
state: locked | conditional | available_after_valid_unlock | reversed | corrected
visibility: visible | advisory-visible | projected
spendability: non-spendable_until_condition_met
authority: runtime-aligned_for_confirmed_referral_locked_facts | projected_for_unimplemented_unlocks
utility: pressure_utility | unlock_utility | network_growth_utility
layer: Level 1 Internal Utility with Level 2 VIP activation pressure
lifecycle: generated -> displayed_as_conditional -> unlocked_if_policy_and_runtime_allow -> spent_or_corrected
sinkability: not-sinkable_until_available | voucher-sinkable_after_valid_unlock_if_policy_allows
fungibility: conditionally_fungible_after_unlock_into_ordinary_available_points
risk_abuse: referral-abuse-prone_rewards
```

### LVA / VIP / Sink Relationship

Conditional Referral Points connect Level 1 internal utility to Level 2 VIP activation pressure.

They are a major VIP conversion trigger because visible conditional value can create motivation to activate or extend VIP.

They do not become spendable merely because they are visible.

### Boundary

Required reading:

```text
conditional != available
visible != spendable
referral_value != payout
referral_value != commission
referral_value != passive_income
referral_value != MLM
```

## 12. Class 4 - Network Activity Points

### Semantic Meaning

Network Activity Points are Points associated with eligible activity of invited users or second-level network participants where policy and runtime separately define eligibility.

Examples:

- referral activity;
- second-level activity;
- network-generated value;
- participation mechanics connected to invited user activity.

`docs/economy/referral_network_rewards_policy_v1.md` treats direct and second-level activity rewards as target policy. Active producers are not confirmed unless separately implemented.

### Primary Utility

Primary utility:

```text
network_utility
participation_mechanics
vip_conversion_utility
ecosystem_growth_utility
```

Network Activity Points express participation in ecosystem growth.

They are not income.

### Axes Profile

Typical semantic profile:

```text
origin: network-origin | referral-origin
state: projected | conditional | available_where_separately_granted | corrected
visibility: advisory-visible | projected | summarized
spendability: non-spendable_until_granted_available_by_runtime_policy
authority: target_policy | projected | non-authoritative_advisory | runtime-aligned_only_where_granted_ledger_facts_exist
utility: network_utility | pressure_utility | participation_utility
layer: Level 1 Internal Utility with Level 2 VIP activation pressure
lifecycle: observed -> classified -> projected_or_accrued -> displayed -> available_if_granted -> spent_or_archived
sinkability: not-sinkable_when_projected | standard_sinkable_after_available_grant_if_policy_allows
fungibility: conditionally_fungible_after_grant_as_ordinary_available_points
risk_abuse: network-amplified_rewards | referral-abuse-prone_rewards
```

### LVA / VIP / Sink Relationship

Network Activity Points strengthen Level 2 VIP pressure because network participation depends on VIP-oriented economics in target policy.

They can become Level 1 internal utility only where granted as actual Points by runtime-aligned policy.

Projected network value remains advisory.

### Boundary

Network Activity Points must not be framed as:

- payout;
- commission;
- passive income;
- MLM;
- guaranteed financial return;
- partner settlement;
- platform obligation.

## 13. Class 5 - RF / Voucher-related Points

### Semantic Meaning

RF / Voucher-related Points are Points associated with voucher interactions, RF ecosystem participation, partner engagement, or claim participation.

Examples:

- voucher claim spend;
- voucher-related participation;
- RF ecosystem engagement;
- partner-related activity signals;
- claim participation;
- RF spend compensation where recovery semantics apply.

This class is semantic. It does not activate partner settlement, PRO payout, voucher pricing, or new RF reward producers.

### Primary Utility

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
origin: RF / partner-origin | voucher-origin | compensation-origin_when_recovery_related
state: available | spent | burned | reversed | corrected
visibility: visible | summarized | detailed | advisory-visible
spendability: voucher-sinkable_where_current_policy_and_runtime_allow
authority: runtime-aligned_where_RF_spend_or_compensation_exists | policy-described_elsewhere
utility: consumption_utility | compensation_correction_utility_where_applicable
layer: Level 3 Consumption & Experience with Level 1 Points input
lifecycle: accrued_or_available -> claim_spend -> spent_or_compensated -> archived
sinkability: voucher-sinkable | premium-voucher-compatible_where_separately_implemented
fungibility: normally_fungible_when_ordinary_available | non-fungible_if_future_partner_scoped
risk_abuse: partner/RF-sensitive_values | compensation/correction-sensitive_values
```

### LVA / VIP / Sink Relationship

RF / Voucher-related Points connect Level 1 internal utility to Level 3 consumption.

Vouchers are the primary consumption interface of the Go2Asia economy.

VIP may be required for valuable Points spend according to runtime-aligned policy.

### Boundary

Required reading:

```text
voucher_interaction != partner_settlement
voucher_claim != payment_for_underlying_service
RF_related_points != PRO_payout
partner_signal != payout_right
```

## 14. Class 6 - Quest / Experience Points

### Semantic Meaning

Quest / Experience Points are Points associated with quests, experiences, travel activity, challenges, or experiential progression.

Examples:

- quest completion;
- travel activity;
- challenges;
- experiential participation;
- useful city or Atlas activity;
- practical experience milestones.

Current runtime policy includes quest completion as a possible Points grant surface. Future quest sinks or richer experiential mechanics require separate implementation and policy.

### Primary Utility

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
state: pending | available | spent | burned | archived | corrected
visibility: visible | detailed | advisory-visible
spendability: standard_sinkable_if_ordinary_available | quest-sinkable_where_separately_defined
authority: runtime-aligned_where_current_quest_grants_exist | policy-described_for_future_sinks
utility: engagement_utility | progression_utility | experience_utility
layer: Level 1 Internal Utility and Level 3 Consumption & Experience
lifecycle: generated -> accrued -> displayed -> spent_or_progressed -> archived
sinkability: quest-sinkable | voucher-sinkable | status-sinkable_where_separately_defined
fungibility: normally_fungible_when_settled_as_ordinary_available_points
risk_abuse: spam-prone_activity_rewards | quest-abuse-sensitive_values
```

### LVA / VIP / Sink Relationship

Quest / Experience Points bridge Level 1 internal utility and Level 3 consumption/experience.

They can also feed Level 4 progression if quests create achievements or badges.

### Boundary

Quest / Experience Points do not activate quest spend sinks, NFT minting, NFT gates, or reward producers by themselves.

## 15. Class 7 - Progression / Prestige Signals

### Semantic Meaning

Progression / Prestige Signals are point-like or value-like signals related to status, achievements, badges, trophies, relics, long-term contribution, or future NFT/prestige mechanics.

They may be:

- non-spendable;
- semi-spendable where separately defined;
- advisory;
- status-oriented;
- progression-oriented;
- non-fungible.

They are included in this taxonomy because Go2Asia's value system includes progression and prestige, but they must not be collapsed into ordinary fungible Points.

### Primary Utility

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
origin: contribution-origin | quest-origin | achievement-origin | future_campaign-origin
state: advisory | displayed | archived | available_only_if_separately_defined
visibility: advisory-visible | visible | detailed
spendability: non-spendable | semi-spendable_where_future_policy_defines | future-scoped_only
authority: advisory | policy-described | projected | future_runtime-aligned
utility: progression_utility | reputation-like_signal | status_utility
layer: Level 4 Progression & Prestige
lifecycle: observed -> classified -> displayed -> progressed -> archived
sinkability: status-sinkable | NFT-mint-sinkable_only_as_future_potential | not-sinkable
fungibility: non-fungible_unless_separately_converted_to_ordinary_available_points
risk_abuse: reputation-sensitive_values | externalization-sensitive_values
```

### LVA / VIP / Sink Relationship

Progression / Prestige Signals relate primarily to Level 4 - Progression & Prestige.

They may connect to NFT, badges, achievements, or premium gates only where separately implemented and authorized.

They may influence perceived VIP value, but they are not ordinary spend balance by default.

### Boundary

Required reading:

```text
progression_signal != ordinary_fungible_balance
progression_signal != money
progression_signal != payout
progression_signal != NFT_activation
progression_signal != G2A_activation
reputation_like_signal != spendable_balance
```

## 16. Class 8 - Compensation / Correction Points

### Semantic Meaning

Compensation / Correction Points are operational values used for corrections, compensation, recovery semantics, or support adjustments.

Examples:

- corrections;
- compensation;
- recovery semantics;
- RF spend compensation after partial failure;
- support adjustments;
- operational reconciliation vocabulary.

They are not ordinary reward loops.

### Primary Utility

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
state: corrected | reversed | available | archived
visibility: visible | summarized | detailed | hidden_where_policy_requires
spendability: ordinary_available_if_correction_results_in_available_points | operational_only
authority: runtime-aligned_where_current_compensation_exists | ledger-backed_future_where_separately_defined
utility: compensation_correction_utility
layer: Level 1 Internal Utility with operational recovery context
lifecycle: detected -> corrected -> displayed_or_archived -> reconciled
sinkability: standard_sinkable_only_if_settled_as_ordinary_available_points
fungibility: conditionally_fungible_if_correction_results_in_ordinary_available_points
risk_abuse: compensation/correction-sensitive_values
```

### LVA / VIP / Sink Relationship

Compensation / Correction Points preserve consistency in the internal utility layer.

They do not create engagement loops, network loops, VIP conversion loops, or user reward campaigns.

### Boundary

Required reading:

```text
compensation_points != ordinary_reward_loop
correction != gamification_reward
support_adjustment != payout_right
operational_recovery != financial_accounting_system
```

## 17. Fungibility Classification

Fungibility depends on policy, state, context, and whether a value has settled into ordinary available Points.

### Normally Fungible

Normally fungible when settled as ordinary available Points:

- Personal Activity Points;
- Contribution Points;
- Quest / Experience Points;
- RF / Voucher-related Points where they are ordinary available Points and not partner-scoped;
- Compensation / Correction Points where the correction results in ordinary available Points.

### Conditionally Fungible

Conditionally fungible after valid unlock, grant, or correction:

- Conditional Referral Points after valid unlock into ordinary available Points;
- Network Activity Points after actual granted ledger facts exist and policy treats them as ordinary available Points;
- RF / Voucher-related values that are future partner-scoped until policy resolves their scope.

### Non-Fungible

Non-fungible or not ordinary Points by default:

- Progression / Prestige Signals;
- reputation-like signals;
- status markers;
- achievements;
- badges where not represented as ordinary Points;
- future scoped campaign values;
- partner-specific future values;
- externalization boundary signals.

### Advisory-Only

Advisory-only values include:

- projected network value;
- advisory visible conditional value;
- progression hints;
- non-authoritative wallet summaries;
- future ledger preparation examples;
- externalization-sensitive signals.

Core rule:

```text
ordinary_available_points_are_fungible_unless_separately_scoped_by_future_policy
origin_does_not_create_separate_wallet_currency
progression_signal_is_not_ordinary_fungible_balance
advisory_projection_is_not_fungible_balance
```

## 18. Visibility / Authority Classification

### Visible

May be visible where policy and product copy allow:

- Personal Activity Points;
- Contribution Points;
- Conditional Referral Points;
- Quest / Experience Points;
- RF / Voucher-related Points;
- Compensation / Correction Points;
- Progression / Prestige Signals.

Visibility does not imply spendability.

### Projected

May be projected or advisory where not yet granted as runtime facts:

- Network Activity Points;
- unimplemented referral unlocks;
- future second-level conditional values;
- future quest or campaign values;
- progression hints;
- externalization-sensitive values.

Projection is not ledger truth.

### Advisory

Advisory classes include:

- Progression / Prestige Signals unless converted by separate policy;
- projected Network Activity Points;
- future sink compatibility;
- future ledger interpretation labels;
- externalization boundary indicators.

Advisory is not authoritative.

### Runtime-Aligned

Runtime-aligned only where current policy and implementation confirm active facts:

- ordinary Points ledger facts owned by Points Service;
- current registration, first-login, event-registration, and quest-completion Points grants where present;
- `referral_locked` where active;
- RF paid voucher spend where implemented behind existing runtime alignment;
- RF spend compensation where present.

### Future-Oriented

Future-oriented where policy language exists but active runtime is not confirmed:

- referral unlock;
- second-level conditional grants;
- direct and second-level network activity producers;
- VIP entitlement lifecycle authority;
- NFT/Totem gates;
- G2A accounting;
- on-chain gateway;
- PRO rewards;
- partner settlement;
- externalization-sensitive values.

## 19. Sink / VIP / Progression / Network / Externalization Participation

### Participate in Sinks

May participate in sinks only when policy, state, VIP access, and active runtime allow:

- Personal Activity Points;
- Contribution Points;
- Quest / Experience Points;
- RF / Voucher-related Points;
- Compensation / Correction Points if settled as ordinary available Points.

Conditional Referral Points and Network Activity Points may participate in sinks only after valid unlock or grant into available Points according to runtime-aligned policy.

Progression / Prestige Signals do not participate as ordinary spend balance unless a separate future policy defines a specific sink relationship.

### Influence VIP Pressure

Classes that can influence VIP pressure:

- Personal Activity Points;
- Contribution Points;
- Conditional Referral Points;
- Network Activity Points;
- Quest / Experience Points;
- RF / Voucher-related Points where consumption opportunities are visible;
- Progression / Prestige Signals where status or premium access creates desire.

VIP pressure is not spend approval.

### Influence Progression

Classes that can influence progression:

- Contribution Points;
- Quest / Experience Points;
- Progression / Prestige Signals;
- selected Personal Activity Points where repeated activity becomes achievement;
- selected RF / Voucher-related activity where experience completion becomes milestone.

Progression influence is not NFT activation.

### Influence Network Utility

Classes that can influence network utility:

- Conditional Referral Points;
- Network Activity Points;
- selected Personal Activity Points from invited users where future policy defines eligibility;
- selected Quest / Experience Points where future network policy explicitly includes them.

Network utility is not passive income, commission, payout, or MLM.

### Approach Externalization Boundaries

Classes or signals that may approach Level 6 boundaries only as controlled future language:

- Progression / Prestige Signals where future on-chain NFT policy exists;
- RF / Voucher-related values where future partner compensation policy exists;
- externalization-sensitive operator or partner signals;
- future G2A-related policy labels.

Boundary:

```text
externalization_sensitive != G2A_activation
Level_6_boundary != on_chain_activation
Points != G2A
Points != NFT
Points != payout
```

## 20. Relationship to Layered Value Architecture

This taxonomy follows `docs/economy/layered_value_architecture_v1.md`.

Layer relationships:

```text
Personal Activity Points -> Level 1 Internal Utility
Contribution Points -> Level 1 Internal Utility with Level 4 quality/progression relevance
Conditional Referral Points -> Level 1 Internal Utility and Level 2 VIP pressure
Network Activity Points -> Level 1 Internal Utility and Level 2 VIP pressure
RF / Voucher-related Points -> Level 3 Consumption & Experience via Level 1 Points input
Quest / Experience Points -> Level 3 Consumption & Experience and Level 4 progression relevance
Progression / Prestige Signals -> Level 4 Progression & Prestige
Compensation / Correction Points -> Level 1 Internal Utility operational recovery context
Externalization-sensitive values -> Level 6 boundary only, not active Points externalization
```

Core LVA boundaries preserved:

```text
Points != money
Points != G2A
Points != NFT
Points != payout
NFT != everyday_currency
G2A != internal_mass_currency
VIP != pure_paywall
VIP = activation_layer
vouchers = consumption_interface
PRO = operator_layer
RF = practical_utility_partner_layer
```

## 21. Relationship to VIP Activation

VIP is the Economic Activation Layer.

This taxonomy describes how Point classes can create or relate to VIP pressure:

- Personal Activity Points create baseline accumulation pressure.
- Contribution Points can create quality and reputation pressure.
- Conditional Referral Points create locked/conditional value pressure.
- Network Activity Points can create advisory or target network pressure where policy allows.
- RF / Voucher-related Points connect pressure to practical consumption.
- Quest / Experience Points connect pressure to experiential benefit.
- Progression / Prestige Signals connect pressure to status and long-term progression.
- Compensation / Correction Points should not be used as VIP pressure mechanics because they are operational recovery semantics.

VIP activation boundary:

```text
VIP_pressure != spend_approval
VIP_pressure != entitlement_authority_switch
VIP_activation_language != runtime_activation
taxonomy_relationship_to_VIP != VIP_lifecycle_implementation
```

## 22. Relationship to Sinks

This taxonomy uses `docs/economy/points/points_sink_design_v1.md` as the anti-inflation and sink model.

Sink relationships are semantic:

- voucher-sinkable means the class may be compatible with voucher consumption where policy and runtime allow;
- quest-sinkable means the class may be compatible with quest consumption where separately implemented;
- status-sinkable means the class may support status or progression where separately defined;
- NFT-mint-sinkable means future potential compatibility only and does not activate NFT minting;
- not-sinkable means the value should not be treated as spend balance.

Sink boundary:

```text
sinkability != active_sink_implementation
voucher_sinkability != spend_pipeline_activation
premium_compatibility != premium_runtime_activation
NFT_mint_sinkable != NFT_mint_activation
spendability_category != spend_enforcement
```

## 23. Relationship to Future Ledger

This taxonomy may prepare semantic language for future ledger interpretation.

It may help future documents distinguish:

- origin metadata;
- state;
- visibility;
- authority;
- lifecycle;
- fungibility;
- correction semantics;
- advisory projections;
- runtime-aligned facts;
- future ledger-backed values.

However:

```text
taxonomy != ledger_activation
taxonomy != accounting_implementation
taxonomy != wallet_implementation
taxonomy != spend_enforcement
taxonomy != production_runtime
future_ledger_preparation != ledger_activation
```

Future ledger interpretation, if ever pursued, requires separate policy, implementation design, migrations, runtime contracts, QA, security, and governance approval. None are created here.

## 24. Taxonomy Interaction Patterns

The following patterns illustrate how axes can combine.

They are illustrative only.

They are not runtime rules, reward catalog entries, ledger rows, API contracts, wallet buckets, or implementation tasks.

### Pattern A - Ordinary Activity Utility

```text
activity-origin + available + visible + standard-sinkable + normally-fungible
```

Interpretation:

Personal Activity Points that have settled into ordinary available Points may contribute to common available balance where runtime-aligned policy allows.

### Pattern B - Conditional Referral Value

```text
referral-origin + conditional + visible + non-spendable + VIP-dependent
```

Interpretation:

Conditional Referral Points may be visible and useful for VIP pressure, but they are not spendable until conditions are satisfied and runtime-aligned policy grants availability.

### Pattern C - Projected Network Value

```text
network-origin + projected + advisory-visible + non-authoritative + risk-sensitive
```

Interpretation:

Projected network value can explain possible future participation mechanics, but it is not granted wallet balance and not ledger truth.

### Pattern D - Progression Signal

```text
progression-signal + advisory + non-fungible + status-oriented
```

Interpretation:

Progression / Prestige Signals can support status and retention without becoming ordinary spendable balance.

### Pattern E - Operational Correction

```text
compensation-origin + corrected + operational-only + correction-utility
```

Interpretation:

Compensation / Correction Points express recovery or consistency semantics and must not be read as gamified rewards.

### Pattern F - Voucher Consumption

```text
voucher-origin + spent + voucher-sinkable + consumption-utility
```

Interpretation:

RF / Voucher-related Points can connect Level 1 internal utility to Level 3 consumption when policy and runtime allow.

### Pattern G - Future Externalization Boundary

```text
externalization-sensitive + future-scoped + advisory + non-spendable
```

Interpretation:

Externalization-sensitive labels may help classify future Level 6 boundary discussions, but they do not activate G2A, NFT, Blockchain Gateway, PRO payout, partner settlement, or on-chain flows.

## 25. Taxonomy Safety Invariants

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
Projection != ledger_truth
Advisory != authoritative
Reputation-like signal != spendable_balance
Fungibility depends on policy/state/context
Taxonomy != runtime_authority
Taxonomy != ledger_activation
Taxonomy != reward_producer_activation
Future ledger preparation != ledger_activation
Risk classification != enforcement
diagnostics != authority
shadow_graph != enforcement
```

Additional economy-specific invariants:

```text
semantic_class != separate_wallet_currency
semantic_class != payout_right
conditional_value != available_spend_balance
network_utility != passive_income
network_utility != MLM
voucher_interaction != partner_settlement
progression_signal != ordinary_fungible_balance
compensation_correction != reward_loop
externalization_sensitive != G2A_activation
sinkability != active_sink_implementation
spendability != spend_enforcement
```

## 26. Forbidden Interpretations

The following interpretations are forbidden:

- taxonomy creates separate wallet currencies;
- taxonomy creates payout rights;
- taxonomy creates financial obligations;
- taxonomy creates money-like balances;
- taxonomy creates G2A rights;
- taxonomy creates NFT rights;
- taxonomy creates partner settlement rights;
- taxonomy creates PRO payout rights;
- origin categories create separate currencies;
- network utility creates MLM semantics;
- network utility creates passive income semantics;
- referral utility creates commission semantics;
- progression signals become money;
- progression signals become ordinary fungible balance by default;
- contribution utility creates payout semantics;
- compensation/correction utility creates gamification rewards;
- RF / voucher-related value creates partner settlement;
- visible value is spendable balance;
- projected values are ledger truth;
- advisory values are authoritative;
- spendability categories activate spend enforcement;
- sinkability categories activate active sinks;
- lifecycle language activates reward producers;
- taxonomy activates reward producers;
- taxonomy activates ledger semantics;
- taxonomy activates spend enforcement;
- taxonomy authorizes runtime implementation;
- taxonomy creates implementation tasks;
- taxonomy creates migration tasks;
- taxonomy creates API changes;
- taxonomy creates feature flags;
- taxonomy creates rollout strategy;
- taxonomy activates production runtime;
- taxonomy unblocks Slice 16.

Forbidden interpretation status:

```text
implicit_wallet_currency_creation: forbidden
implicit_payout_right_creation: forbidden
implicit_financial_obligation_creation: forbidden
implicit_ledger_activation: forbidden
implicit_reward_producer_activation: forbidden
implicit_spend_enforcement_activation: forbidden
implicit_g2a_activation: forbidden
implicit_nft_activation: forbidden
implicit_partner_settlement_activation: forbidden
implicit_pro_payout_activation: forbidden
implicit_runtime_implementation_task: forbidden
implicit_slice_16_unblock: forbidden
```

## 27. Relationship to Existing Economy SSOT

This document does not replace existing Economy SSOT documents.

Relationship:

- `docs/economy/README.md` remains the economy entry point.
- `docs/economy/points_policy_v1.md` remains the runtime-aligned Points policy.
- `docs/economy/referral_network_rewards_policy_v1.md` remains the referral / network policy.
- `docs/economy/layered_value_architecture_v1.md` remains the value topology.
- `docs/economy/points/semantic_axes_of_points_v1.md` remains the coordinate system for classification.
- `docs/economy/tokenomics/go2asia_tokenomics_v1.md` remains the full economy model.
- `docs/economy/vip/vip_value_system_v1.md` remains the behavioral VIP model.
- `docs/economy/points/points_sink_design_v1.md` remains the anti-inflation / sink model.
- `docs/economy/vouchers/rf_voucher_economy_v1.md` remains the voucher consumption model.
- `docs/architecture/domain/economy_scope_reentry_note_v1.md` remains the Stage 6.1 soft economy / enforcement boundary note.

SSOT boundary:

```text
points_taxonomy_role: canonical_semantic_point_classes
readme_role: economy_entry_point
points_policy_role: runtime_aligned_points_policy
referral_policy_role: referral_network_policy
layered_value_architecture_role: value_topology
semantic_axes_role: coordinate_system
tokenomics_role: full_economy_model
vip_value_system_role: behavioral_vip_model
points_sink_design_role: anti_inflation_sink_model
rf_voucher_economy_role: voucher_consumption_model
stage_6_1_role: soft_economy_enforcement_boundary
```

If this document appears to conflict with runtime-aligned policy, the runtime-aligned policy controls runtime interpretation.

## 28. Runtime / QA Boundary

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
- reward producer activation tasks;
- ledger activation tasks;
- spend enforcement tasks.

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

## 29. Stage 6.2 Naming Boundary

This document is Stage 6.2 - Points Taxonomy v1.

It must not be confused with the existing `docs/economy/README.md` section numbering where `6.2` currently refers to Voucher Economy.

Boundary:

```text
stage_6_2_points_taxonomy != readme_section_6_2_voucher_economy
points_taxonomy_v1_path: docs/economy/points_taxonomy_v1.md
```

## 30. Final Classification

```text
document_type: points_taxonomy_v1
document_mode: docs_only
stage: Stage 6.2
semantic_scope: canonical_taxonomy_of_internal_utility_value
runtime_model_status: not_runtime_model
ledger_design_status: not_ledger_design
reward_catalog_status: not_reward_catalog
reward_sizes_status: not_defined
state_machine_status: not_state_machine
spend_enforcement_model_status: not_spend_enforcement_model
payout_system_status: not_payout_system
financial_accounting_system_status: not_financial_accounting_system
runtime_changes_added: no
migrations_added: no
api_changes_added: no
feature_flags_added: no
implementation_changes_added: no
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
final_verdict: points_taxonomy_v1_defines_canonical_semantic_point_classes_for_internal_utility_value_without_creating_runtime_authority_ledger_activation_reward_producers_spend_enforcement_payout_semantics_financial_accounting_or_slice_16_progression
```
