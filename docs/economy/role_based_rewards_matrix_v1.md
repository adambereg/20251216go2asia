# Role-Based Rewards Matrix v1

Date: 2026-05-17  
Status: `NOTE_READY_STAGE_6_5_ROLE_BASED_REWARDS_MATRIX_DOCS_ONLY`  
Stage: `Stage 6.5 / Role-Based Rewards Matrix v1`  
Mode: semantic role-based reward and value participation model, docs-only, read-only reference, explanatory classification only, no runtime changes, no migrations, no API changes, no feature flags, no implementation changes, no RBAC system, no permissions model, no auth matrix, no ACL matrix, no runtime entitlement system, no payout matrix, no operator compensation runtime, no partner settlement system, no ledger activation, no reward producer activation, no accrual pipeline activation, no spend enforcement, no enforcement mechanics, no payout pipeline, no financial accounting system, no production/runtime activation, no execution authorization, no governance approval, no Slice 16 readiness, no Slice 16 unblock, no rollout strategy, no implementation plan, no operational mandate, no evidence execution, no validation execution, no test plan, no QA acceptance, no deny or fail-closed behavior, no payment rejection logic, no authority switching

## 1. Purpose

This document formalizes the semantic role-based behavioral economy model for Go2Asia.

It answers one question:

```text
How do Guest, Spacer, VIP, PRO, and Partner participate in value creation, utility, VIP pressure, progression, sinks, network utility, and ecosystem expansion without creating runtime entitlement or payout semantics?
```

Main thesis:

```text
Roles in Go2Asia define behavioral and economic participation patterns,
not runtime authority or payout rights.
```

This document is a semantic role-based reward and value participation model.

It does not define runtime roles, permissions, auth rules, ACLs, entitlement truth, payout rights, operator compensation, partner settlement, producer behavior, ledger writes, or implementation tasks.

## 2. Explicit Non-Goals

This document is not:

- an RBAC system;
- a permissions model;
- an auth matrix;
- an ACL matrix;
- an entitlement system;
- a runtime role registry;
- a payout matrix;
- an operator compensation runtime;
- a partner settlement system;
- a revenue share model;
- a wage or commission model;
- a reward size table;
- a ledger design;
- a reward producer implementation;
- an accrual pipeline;
- a spend enforcement model;
- an API contract;
- a database schema;
- an implementation plan;
- a rollout plan;
- a migration plan;
- a production activation artifact.

Non-goal classification:

```text
role_based_rewards_matrix_role: semantic_role_reward_participation_model_only
rbac_status: not_rbac
permissions_model_status: not_permissions_model
auth_acl_status: not_auth_or_acl_matrix
runtime_entitlement_status: not_runtime_entitlement_system
payout_matrix_status: not_payout_matrix
operator_compensation_runtime_status: not_activated
partner_settlement_status: not_activated
ledger_activation_status: not_activated
reward_producer_activation_status: not_activated
accrual_pipeline_activation_status: not_activated
spend_enforcement_status: not_activated
implementation_plan_status: not_implementation_plan
```

## 3. Reading Contract

This document must be read together with:

- `docs/economy/README.md`;
- `docs/economy/layered_value_architecture_v1.md`;
- `docs/economy/points/semantic_axes_of_points_v1.md`;
- `docs/economy/points_taxonomy_v1.md`;
- `docs/economy/reward_event_catalog_v1.md`;
- `docs/economy/reward_lifecycle_soft_accrual_rules_v1.md`;
- `docs/economy/points_policy_v1.md`;
- `docs/economy/referral_network_rewards_policy_v1.md`;
- `docs/economy/tokenomics/go2asia_tokenomics_v1.md`;
- `docs/economy/vip/vip_value_system_v1.md`;
- `docs/economy/points/points_sink_design_v1.md`;
- `docs/economy/vouchers/rf_voucher_economy_v1.md`;
- `docs/architecture/domain/economy_scope_reentry_note_v1.md`;
- relevant Phase G closure documents.

If this matrix appears to conflict with runtime-aligned policy, the runtime-aligned policy controls runtime interpretation:

```text
runtime_policy_authority: points_policy_v1_and_referral_network_rewards_policy_v1
role_based_rewards_matrix_authority_status: semantic_non_runtime
role_based_rewards_matrix_replaces_runtime_policy: false
role_based_rewards_matrix_controls_runtime_behavior: false
role_based_rewards_matrix_maps_to_security_roles: false
```

The word "role" in this document means economy-facing participation pattern.

It does not mean:

- IAM role;
- Clerk role;
- security role;
- backend permission role;
- runtime entitlement role;
- payout entitlement role.

## 4. Source Materials and Review Scope

This document was prepared after read-first review of the economy SSOT, Layered Value Architecture, Semantic Axes of Points, Points Taxonomy v1, Reward Event Catalog v1, Reward Lifecycle / Soft Accrual Rules v1, runtime-aligned Points and referral policies, Stage 6.1, and Phase G closure boundaries.

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
artifact_scope: role_based_rewards_matrix_semantic_only
runtime_review_status: not_performed
validation_execution_status: not_executed
evidence_collection_status: not_collected
implementation_tasks_status: none_implied_none_required
```

## 5. Relationship to Stage 6.1 and Phase G

This matrix follows `docs/architecture/domain/economy_scope_reentry_note_v1.md`.

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

Role-Based Rewards Matrix v1 is a semantic economy artifact. It is not authority transition, runtime transition, producer activation, ledger activation, entitlement activation, payout activation, settlement activation, enforcement activation, or Slice 16 progression.

## 6. What Is a Role in This Matrix?

A role is an economy-facing participation pattern.

It describes how an actor may:

- observe or create ecosystem activity;
- create utility;
- receive utility;
- create VIP pressure;
- participate in progression;
- participate in sinks;
- influence network utility;
- contribute to ecosystem expansion.

In this document, a role is not a permission object.

Boundary:

```text
role: behavioral_economic_participation_pattern
role != runtime_permission
role != entitlement_authority
role != payout_right
role != settlement_authority
role != ledger_account_type
role != security_role
```

## 7. Canonical Ecosystem Roles Overview

This matrix defines the following canonical ecosystem roles:

```text
1. Guest
2. Spacer
3. VIP
4. PRO
5. Partner
```

These roles are semantic participation lenses.

They are not:

- authorization classes;
- backend permission levels;
- wallet account types;
- payout classes;
- settlement participants by themselves;
- reward producer classes;
- ledger account types;
- runtime entitlement states.

Admin is intentionally not a canonical reward participation role in this matrix. Administrative or operational access, if any, belongs to governance, support, or runtime authorization models outside this document.

## 8. Role 1 - Guest

### Semantic Meaning

Guest describes a person who observes Go2Asia before becoming a registered economy participant.

Guest may:

- observe public content;
- browse public surfaces;
- learn the value proposition;
- discover Space Asia activity;
- see practical utility examples;
- feel curiosity pressure.

### Economic Participation Pattern

Guest is mostly outside direct economy utility.

The primary Guest pattern is:

```text
public_attention -> curiosity_pressure -> registration_or_conversion_intent
```

Guest does not normally create Points utility, spend value, network utility, progression value, or sink participation.

### LVA Relationship

Guest primarily belongs to:

```text
Level 0: Attention & Presence Layer
```

Guest attention can become future ecosystem participation only after a separate user journey converts the Guest into a registered participant.

### Reward / Value Relevance

Guest relevance is indirect.

Guest can be discussed as:

- conversion pressure target;
- curiosity pressure target;
- future Spacer candidate;
- public value observer.

Guest should not be discussed as an active reward recipient.

### Boundary

```text
Guest != direct_economy_participant
Guest != spendable_balance_holder
Guest != payout_recipient
Guest != entitlement_subject_for_this_matrix
Guest_curiosity_pressure != reward_grant
```

## 9. Role 2 - Spacer

### Semantic Meaning

Spacer describes an ordinary registered participant of the Go2Asia ecosystem.

Spacer can create:

- activity;
- engagement;
- social graph;
- local presence;
- ordinary Space Asia signals;
- initial utility value.

### Economic Participation Pattern

Spacer is the basic internal utility participant.

The core Spacer pattern is:

```text
activity -> Personal Activity Points -> visible_accumulation -> VIP_pressure
```

Spacer can accumulate value and create pressure toward economic activation.

### LVA Relationship

Spacer primarily spans:

```text
Level 0: Attention & Presence Layer
Level 1: Internal Utility Layer
```

Spacer may later transition toward Level 2 only through VIP activation language governed by existing policy.

### Point Taxonomy Relationship

Primary Point class:

```text
Personal Activity Points
```

Secondary semantic relevance may include:

- Contribution Points where quality contribution is recognized;
- Quest / Experience Points where activity relates to quests;
- Progression / Prestige Signals where participation creates status-like meaning.

### Reward Event Relationship

Primary event families:

```text
Activity Events
Contribution Events
Quest / Experience Events
Progression / Prestige Events
```

Referral Events may be relevant only where referral policy and current runtime-aligned boundaries allow safe language.

### VIP Pressure Relationship

Spacer creates visible accumulation pressure:

```text
visible_points_accumulation -> desire_to_activate_value -> VIP_pressure
```

This pressure is semantic and behavioral. It is not spend approval.

### Sinks / Progression / Network Utility

Spacer may relate to:

- basic sinks as future or policy-governed opportunities;
- participation progression;
- ordinary social graph growth;
- visible utility accumulation.

Without active VIP spend access where required by policy, Spacer value must not be framed as fully activated spend value.

### Boundary

```text
Spacer != payout_role
Spacer_points != money
visible_accumulation != spendable_balance
VIP_pressure != spend_approval
Spacer_activity != automatic_reward_grant
```

## 10. Role 3 - VIP

### Semantic Meaning

VIP describes an activated participant of the Go2Asia economy.

VIP is:

- not a separate currency;
- not a payout role;
- not a financial rights class;
- not an entitlement authority switch by this document;
- the economic activation layer in semantic economy language.

### Economic Participation Pattern

The core VIP pattern is:

```text
accumulated_internal_utility -> activation_context -> spend_context -> retention
```

VIP may receive:

- spend context;
- network utility visibility;
- premium consumption relevance;
- stronger progression relevance;
- retention pressure;
- activation-layer explanation.

### LVA Relationship

VIP primarily belongs to:

```text
Level 2: Economic Activation Layer
```

VIP connects:

```text
Level 1 Internal Utility -> Level 2 Activation -> Level 3 Consumption
```

VIP may also influence Level 4 progression where premium access, status, or achievements are separately defined.

### Point Taxonomy Relationship

VIP has stronger semantic relationship to:

- Conditional Referral Points;
- Network Activity Points;
- RF / Voucher-related Points;
- Quest / Experience Points;
- Progression / Prestige Signals.

This does not create a separate VIP Point currency.

### Reward Event Relationship

Primary event families:

```text
VIP Activation Events
Referral Events
Network Activity Events
RF / Voucher Events
Sink Participation Events
Progression / Prestige Events
```

VIP Activation Events explain activation-layer moments. They do not implement the VIP entitlement lifecycle and do not switch runtime authority.

### VIP Pressure Relationship

VIP is both the target and stabilizer of pressure:

- Guest: curiosity pressure;
- Spacer: visible accumulation pressure;
- VIP: retention pressure and spend relevance;
- PRO / Partner: ecosystem expansion and utility participation pressure.

VIP pressure must remain separate from spend approval.

### Sinks / Progression / Network Utility

VIP may semantically participate in:

- standard sinks;
- premium sinks;
- voucher consumption;
- quest participation;
- progression and prestige surfaces;
- network utility visibility.

Network utility is participation mechanics. It is not passive income, payout, commission, or MLM.

### Boundary

```text
VIP != payout_role
VIP != financial_rights_class
VIP != separate_currency
VIP_activation_event != runtime_activation
VIP_pressure != spend_approval
VIP_network_utility != passive_income
VIP_role != entitlement_authority_switch
```

## 11. Role 4 - PRO

### Semantic Meaning

PRO describes an operator, creator, and ecosystem expansion role.

PRO can create:

- utility;
- ecosystem density;
- quests;
- partner activity;
- Atlas or guide value;
- local expertise;
- experiential value;
- growth loops;
- city expansion.

PRO is the operator and creator layer in the soft economy language.

### Economic Participation Pattern

The core PRO pattern is:

```text
local_expertise -> contribution_or_quest_utility -> ecosystem_density -> user_consumption_and_progression
```

PRO may help transform user activity into practical, local, and experiential utility.

### LVA Relationship

PRO primarily belongs to:

```text
Level 5: Operator & Ecosystem Layer
```

PRO can influence:

- Level 3 Consumption & Experience through quests, offers, and utility;
- Level 4 Progression & Prestige through creator/operator reputation;
- Level 6 Externalized Value only as controlled future boundary language where separate policy exists.

### Point Taxonomy Relationship

PRO has semantic relationship to:

- Contribution Points;
- Quest / Experience Points;
- RF / Voucher-related Points;
- Progression / Prestige Signals;
- Compensation / Correction Points only where operational recovery language applies.

This does not create PRO payout semantics.

### Reward Event Relationship

Primary event families:

```text
Contribution Events
Quest / Experience Events
RF / Voucher Events
Progression / Prestige Events
Externalization-sensitive Events
Compensation / Correction Events where operationally relevant
```

Externalization-sensitive Events remain future boundary language only.

### VIP Pressure Relationship

PRO contributes to ecosystem expansion pressure.

PRO can make VIP more valuable by increasing:

- supply density;
- quest availability;
- voucher relevance;
- local usefulness;
- city-specific practical value.

This does not mean PRO receives guaranteed income or payout.

### Sinks / Progression / Network Utility

PRO may be semantically connected to:

- quest utility;
- progression utility;
- creator/operator prestige;
- local trust;
- partner utility;
- ecosystem expansion.

PRO contribution must not be framed as wage semantics, commission semantics, guaranteed income, or operator settlement runtime.

### Boundary

```text
PRO != payout_guarantee
PRO != guaranteed_operator_income
PRO != operator_settlement_runtime
PRO != commission_role
PRO_contribution != wage_semantics
PRO_externalization_relevance != G2A_activation
PRO_role != runtime_entitlement
```

## 12. Role 5 - Partner

### Semantic Meaning

Partner describes a business, service provider, venue, or RF-side utility provider.

Partner can provide:

- vouchers;
- offers;
- experiences;
- offline utility;
- RF participation;
- practical value;
- supply density.

Partner is not a wallet role or ordinary user reward role in this matrix.

### Economic Participation Pattern

The core Partner pattern is:

```text
practical_offer -> voucher_or_experience_utility -> offline_benefit -> retention_and_trust
```

Partner helps make internal utility meaningful by providing real-world consumption surfaces.

### LVA Relationship

Partner primarily belongs to:

```text
Level 3: Consumption & Experience Layer
Level 5: Operator & Ecosystem Layer
```

Partner may touch Level 6 only as controlled future boundary language where separate G2A, treasury, settlement, or externalization policy exists.

### Point Taxonomy Relationship

Partner has semantic relevance to:

- RF / Voucher-related Points;
- Quest / Experience Points where experiences are partner-provided;
- Progression / Prestige Signals where trust or partner quality matters;
- Compensation / Correction Points where recovery semantics are involved.

This relevance does not create partner balances, partner settlement, or payout claims.

### Reward Event Relationship

Primary event families:

```text
RF / Voucher Events
Quest / Experience Events
Sink Participation Events
Progression / Prestige Events
Externalization-sensitive Events where future policy separately defines boundary language
Compensation / Correction Events where operational recovery applies
```

### VIP Pressure Relationship

Partner contributes to utility participation pressure.

Partner offers make VIP and Points more useful by increasing practical consumption opportunities.

This is not settlement authority.

### Sinks / Progression / Network Utility

Partner may be semantically connected to:

- voucher utility;
- offline benefit;
- experience utility;
- ecosystem trust;
- category and city coverage;
- supply density.

Partner participation should be discussed as practical utility and supply contribution, not financial settlement.

### Boundary

```text
Partner != settlement_authority
Partner != financial_settlement_layer
Partner_participation != payout_right
Partner_voucher_interaction != partner_settlement
Partner_externalization_relevance != G2A_activation
Partner_role != runtime_entitlement
```

## 13. Role Matrix Overview

This overview summarizes the semantic role relationships.

It is illustrative only.

It is not a runtime matrix.

| Role | Primary participation | Primary value created | Primary utility received | Primary pressure | Main LVA levels |
|---|---|---|---|---|---|
| Guest | Observation and discovery | Attention and curiosity | Public understanding of value | Curiosity pressure | Level 0 |
| Spacer | Activity and engagement | Internal utility signals | Visible accumulation | VIP pressure | Level 0 / Level 1 |
| VIP | Activated participation | Consumption and retention loops | Spend context, premium relevance, network utility visibility | Retention pressure | Level 2 / Level 3 / Level 4 |
| PRO | Operator and creator activity | Ecosystem density, quests, local expertise | Creator/operator prestige and utility relevance | Ecosystem expansion pressure | Level 3 / Level 4 / Level 5 |
| Partner | Practical offer supply | Offline utility, vouchers, experiences | Traffic and practical utility relevance | Utility participation pressure | Level 3 / Level 5 |

Matrix boundary:

```text
role_matrix_overview: illustrative_semantic_summary
role_matrix_overview != runtime_matrix
role_matrix_overview != permissions_matrix
role_matrix_overview != payout_matrix
role_matrix_overview != settlement_matrix
```

## 14. Role and Point Taxonomy Relationship

Role-to-Point relationship:

```text
Guest -> no_direct_point_class_by_default
Spacer -> Personal Activity Points
VIP -> Conditional Referral Points | Network Activity Points | RF / Voucher-related Points | Quest / Experience Points | Progression / Prestige Signals
PRO -> Contribution Points | Quest / Experience Points | RF / Voucher-related Points | Progression / Prestige Signals
Partner -> RF / Voucher-related semantic relevance | Quest / Experience semantic relevance | Compensation / Correction context where operationally relevant
```

Interpretation:

- Guest is pre-economy or conversion-facing.
- Spacer creates ordinary internal utility.
- VIP activates context for utility usage.
- PRO creates operator-side utility and ecosystem density.
- Partner creates practical consumption surfaces.

Boundary:

```text
role_to_point_taxonomy != wallet_currency_mapping
role_to_point_taxonomy != grant_rule
role_to_point_taxonomy != payout_rule
role_to_point_taxonomy != reward_producer_config
```

## 15. Role and Reward Event Family Relationship

Role-to-event relationship:

```text
Guest -> public observation and conversion context, not reward event participation by default
Spacer -> Activity Events | Contribution Events | Quest / Experience Events | Progression / Prestige Events
VIP -> VIP Activation Events | Referral Events | Network Activity Events | RF / Voucher Events | Sink Participation Events
PRO -> Contribution Events | Quest / Experience Events | RF / Voucher Events | Progression / Prestige Events | Externalization-sensitive Events
Partner -> RF / Voucher Events | Quest / Experience Events | Sink Participation Events | Compensation / Correction Events where operationally relevant
```

Interpretation:

- Event families describe reward-relevant semantic activity.
- Role relationships describe who is contextually involved in that activity.
- Event participation does not automatically create rewards.

Boundary:

```text
role_event_relationship != runtime_event_bus
role_event_relationship != event_schema
role_event_relationship != active_producer
role_event_relationship != ledger_write
role_event_relationship != payout_right
```

## 16. Role and Layered Value Architecture Relationship

Role-to-LVA relationship:

```text
Guest -> Level 0 curiosity / attention
Spacer -> Level 0 attention / Level 1 internal utility
VIP -> Level 2 economic activation with Level 3 and Level 4 relevance
PRO -> Level 3 / Level 4 / Level 5 ecosystem utility
Partner -> Level 3 / Level 5 practical utility and supply density
```

Interpretation:

- Guest sees value before becoming an internal utility participant.
- Spacer converts activity into internal utility.
- VIP activates accumulated internal utility.
- PRO helps produce ecosystem utility.
- Partner provides practical utility surfaces.

Boundary:

```text
role_lva_mapping != release_phase
role_lva_mapping != implementation_milestone
role_lva_mapping != entitlement_hierarchy
role_lva_mapping != payout_hierarchy
```

## 17. Role and VIP Pressure Relationship

Role-to-VIP pressure relationship:

```text
Guest -> curiosity pressure
Spacer -> visible accumulation pressure
VIP -> retention pressure
PRO -> ecosystem expansion pressure
Partner -> utility participation pressure
```

Interpretation:

- Guest pressure is curiosity and conversion-facing.
- Spacer pressure comes from visible accumulated internal utility.
- VIP pressure becomes retention and continued utility relevance.
- PRO pressure comes from the need to expand useful supply.
- Partner pressure comes from making utility practical enough to justify VIP participation.

Boundary:

```text
VIP_pressure != spend_approval
VIP_pressure != entitlement_authority_switch
VIP_pressure != runtime_activation
role_pressure != payout_right
role_pressure != enforcement_signal
```

## 18. Role and Sink Relationship

Role-to-sink relationship:

```text
Guest -> no direct sink participation by default
Spacer -> basic sink awareness and future standard sink relevance
VIP -> standard sinks | premium sinks | voucher consumption | quest consumption where policy/runtime allow
PRO -> quest utility | progression utility | creator/operator utility context
Partner -> voucher utility | offline benefit | practical consumption bridge
```

Interpretation:

- Sinks operate semantically on available or spendable value where policy and runtime separately allow.
- Role relevance to sinks is compatibility language.
- It is not sink pipeline activation.

Boundary:

```text
role_sink_relationship != active_sink_pipeline
sink_relevance != spend_enforcement
sink_participation != payment_settlement
premium_sink_relevance != premium_runtime_activation
voucher_sink_relevance != partner_settlement
```

## 19. Role and Progression / Prestige Relationship

Role-to-progression relationship:

```text
Guest -> no direct progression by default
Spacer -> participation progression
VIP -> activation progression | premium participation progression
PRO -> creator/operator prestige
Partner -> ecosystem trust / partner quality prestige
```

Interpretation:

- Progression is identity, status, usefulness, trust, or long-term retention language.
- Progression is not money.
- Prestige is not spendable balance unless a separate policy represents value as ordinary available Points.

Boundary:

```text
progression != money
prestige != payout
status != financial_status
badge_or_nft_language != on_chain_activation
role_progression != entitlement_authority
```

## 20. Role and Network Utility Relationship

Network utility describes participation mechanics and growth effects.

It may include:

- referral participation;
- invited-user activity context;
- network visibility;
- ecosystem growth;
- conditional value;
- advisory or projected value.

Role-to-network relationship:

```text
Guest -> no direct network utility by default
Spacer -> referral participation and conditional growth context where policy allows
VIP -> network utility visibility and activation-layer relevance
PRO -> ecosystem growth loops and supply network context
Partner -> practical utility network through offers and city/category coverage
```

Interpretation:

Network utility is not passive income.

Network utility is not MLM.

Network utility is not payout semantics.

Boundary:

```text
network_utility: participation_mechanics
network_utility != passive_income
network_utility != MLM
network_utility != payout
network_utility != commission
network_projection != granted_reward
```

## 21. Role and Future Ledger Vocabulary Relationship

Role language may help future ledger vocabulary by explaining actor context.

For example:

- Spacer may be actor context for ordinary activity value;
- VIP may be activation context for conditional or network value;
- PRO may be operator context for contribution, quest, or RF utility;
- Partner may be supply context for voucher or experience utility.

This context is not ledger activation.

Boundary:

```text
role_context != ledger_account_type
role_context != ledger_write
role_context != accounting_entry
role_context != payout_entry
role_context != producer_activation
future_ledger_vocabulary != ledger_activation
```

## 22. Behavioral Archetypes

Behavioral archetypes are sub-patterns inside the PRO role.

They are not separate system roles.

Canonical PRO behavioral archetypes:

```text
Quest creator
Atlas curator
City guide
RF promoter
Experience organizer
Community curator
```

### Quest Creator

Quest creator describes a PRO pattern that creates or curates quest / experience utility.

Boundary:

```text
Quest_creator = PRO_behavioral_archetype
Quest_creator != separate_system_role
Quest_creator != payout_role
Quest_creator != reward_producer
```

### Atlas Curator

Atlas curator describes a PRO pattern that improves local knowledge, travel context, and contribution utility.

Boundary:

```text
Atlas_curator = PRO_behavioral_archetype
Atlas_curator != separate_system_role
Atlas_curator != wage_semantics
Atlas_curator != entitlement_authority
```

### City Guide

City guide describes a PRO pattern that adds local expertise and practical experience context.

Boundary:

```text
City_guide = PRO_behavioral_archetype
City_guide != separate_system_role
City_guide != guaranteed_income
City_guide != settlement_authority
```

### RF Promoter

RF promoter describes a PRO pattern that helps RF / voucher utility and partner participation become visible.

Boundary:

```text
RF_promoter = PRO_behavioral_archetype
RF_promoter != separate_system_role
RF_promoter != commission_role
RF_promoter != partner_settlement_runtime
```

### Experience Organizer

Experience organizer describes a PRO pattern that creates experiential utility and city-level activity.

Boundary:

```text
Experience_organizer = PRO_behavioral_archetype
Experience_organizer != separate_system_role
Experience_organizer != payout_guarantee
Experience_organizer != runtime_entitlement
```

### Community Curator

Community curator describes a PRO pattern that improves local community relevance and user trust.

Boundary:

```text
Community_curator = PRO_behavioral_archetype
Community_curator != separate_system_role
Community_curator != moderation_authority_by_this_document
Community_curator != enforcement_role
```

## 23. Role Participation Boundaries

Role participation boundaries:

```text
Guest != economic_participant_by_default
Spacer != payout_role
VIP != payout_role
PRO != guaranteed_operator_income
Partner != settlement_authority
Progression != financial_status
Network_utility != passive_income
Role_relevance != runtime_entitlement
Role_matrix != runtime_matrix
Role_matrix != RBAC
Role_matrix != permissions_system
```

Interpretation:

- Guest is conversion-facing, not direct economy utility by default.
- Spacer is ordinary participation, not payout.
- VIP is activation layer, not financial rights.
- PRO is operator utility, not guaranteed income.
- Partner is practical utility provider, not settlement authority.
- Progression is status and retention language, not financial status.
- Network utility is participation mechanics, not passive income.
- Role relevance is semantic relevance, not runtime entitlement.

## 24. Role-Based Reward Interaction Patterns

The following patterns are illustrative only.

They are not runtime flows.

They are not implementation tasks.

They are not reward producer definitions.

### Pattern A - Spacer Activity Accumulation

```text
Spacer + Activity Events + Personal Activity Points + visible accumulation pressure
```

Meaning:

Spacer activity can create internal utility language and VIP pressure.

Boundary:

```text
Spacer_activity_pattern != automatic_reward
visible_accumulation_pressure != spendable_balance
```

### Pattern B - VIP Network Utility Visibility

```text
VIP + Conditional Referral Points + Network Activity Points + network utility visibility
```

Meaning:

VIP can be the activation context where conditional and network utility becomes more relevant.

Boundary:

```text
VIP_network_pattern != passive_income
network_visibility != granted_reward
VIP_context != entitlement_authority_switch
```

### Pattern C - VIP Consumption

```text
VIP + RF / Voucher Events + Sink Participation Events + consumption utility
```

Meaning:

VIP can connect available internal utility to practical consumption surfaces.

Boundary:

```text
VIP_consumption_pattern != spend_enforcement
voucher_consumption != partner_settlement
spent_value != payout
```

### Pattern D - PRO Contribution and Quest Utility

```text
PRO + Contribution Events + Quest / Experience Events + progression relevance
```

Meaning:

PRO can create quality contribution, quests, and experiential utility for the ecosystem.

Boundary:

```text
PRO_contribution_pattern != wage_semantics
Quest_utility != payout_guarantee
PRO_progression != guaranteed_income
```

### Pattern E - Partner Voucher Utility

```text
Partner + RF / Voucher utility + consumption bridge + offline benefit
```

Meaning:

Partner provides practical consumption surfaces that make VIP and Points useful.

Boundary:

```text
Partner_voucher_pattern != settlement_authority
offline_benefit != payment_obligation_by_points
voucher_utility != partner_payout
```

### Pattern F - PRO Behavioral Archetype

```text
PRO + Quest creator archetype + experience organizer archetype + ecosystem expansion
```

Meaning:

Quest creator and experience organizer are behavioral patterns inside PRO.

Boundary:

```text
PRO_archetype_pattern != separate_system_role
PRO_archetype_pattern != RBAC_role
PRO_archetype_pattern != reward_producer
```

### Pattern G - Partner and PRO Ecosystem Density

```text
PRO + Partner + RF / Voucher Events + city supply density
```

Meaning:

PRO and Partner can jointly increase practical utility and supply density.

Boundary:

```text
ecosystem_density_pattern != partner_settlement
PRO_partner_relationship != payout_pipeline
city_supply_density != ledger_truth
```

## 25. Role-Based Safety Invariants

Required safety invariants:

```text
role != payout_right
role != runtime_entitlement
role != settlement_authority
VIP != payout
PRO != guaranteed_income
Partner != financial_settlement_layer
network_utility != MLM
network_utility != passive_income
progression != money
contribution != wage_semantics
role_matrix != RBAC
role_matrix != permissions_system
role_matrix != implementation_model
role_matrix != payout_matrix
role_matrix != ledger_model
role_matrix != reward_producer_config
role_matrix != accrual_pipeline_config
role_matrix != spend_enforcement_model
diagnostics != authority
shadow_graph != enforcement
```

Additional semantic invariants:

```text
Guest_curiosity != reward_grant
Spacer_visibility != spendability
VIP_pressure != spend_approval
PRO_operator_context != operator_compensation_runtime
Partner_utility_context != partner_settlement
Behavioral_archetype != separate_system_role
Role_relevance != runtime_authority
Role_context != ledger_truth
```

## 26. Forbidden Interpretations

The following interpretations are forbidden:

- roles create payout guarantees;
- PRO implies operator income;
- PRO implies wage semantics;
- PRO implies commission rights;
- Partner implies settlement authority;
- Partner implies platform financial obligation;
- network utility creates passive income;
- referral participation creates MLM semantics;
- VIP creates financial rights;
- VIP creates payout rights;
- role matrix creates runtime entitlements;
- role matrix creates permissions model;
- role matrix creates RBAC or ACL rules;
- role matrix creates auth behavior;
- role matrix activates reward producers;
- role matrix activates payout pipelines;
- role matrix activates ledger;
- role matrix activates accrual pipeline;
- role matrix activates spend enforcement;
- role matrix defines API contracts;
- behavioral archetypes become separate runtime roles;
- Quest creator becomes a separate system role;
- visible role relevance becomes spendable balance;
- projected network utility becomes granted reward;
- partner participation becomes settlement;
- externalization-sensitive role context activates G2A or on-chain flows;
- role matrix authorizes implementation tasks;
- role matrix creates rollout tasks;
- role matrix unblocks Slice 16.

Forbidden interpretation classification:

```text
implicit_payout_guarantee: forbidden
implicit_operator_income_guarantee: forbidden
implicit_partner_settlement_authority: forbidden
implicit_MLM_semantics: forbidden
implicit_runtime_entitlement_activation: forbidden
implicit_permissions_model_activation: forbidden
implicit_reward_producer_activation: forbidden
implicit_ledger_activation: forbidden
implicit_accrual_pipeline_activation: forbidden
implicit_spend_enforcement_activation: forbidden
implicit_slice_16_unblock: forbidden
```

## 27. Relationship to Existing Economy SSOT

This document does not replace existing economy SSOT documents.

Relationship:

- `docs/economy/README.md` remains the economy entry point.
- `docs/economy/points_policy_v1.md` remains the runtime-aligned Points policy.
- `docs/economy/referral_network_rewards_policy_v1.md` remains the runtime-aligned referral and network rewards policy.
- `docs/economy/reward_event_catalog_v1.md` remains the semantic event catalog.
- `docs/economy/points_taxonomy_v1.md` remains the semantic Point taxonomy.
- `docs/economy/points/semantic_axes_of_points_v1.md` remains the coordinate system for Points interpretation.
- `docs/economy/layered_value_architecture_v1.md` remains the value topology.
- `docs/economy/reward_lifecycle_soft_accrual_rules_v1.md` remains the reward lifecycle and soft accrual semantics.
- `docs/economy/tokenomics/go2asia_tokenomics_v1.md` remains the full economy model.
- `docs/economy/vip/vip_value_system_v1.md` remains the behavioral VIP model.
- `docs/economy/points/points_sink_design_v1.md` remains the sink model.
- `docs/economy/vouchers/rf_voucher_economy_v1.md` remains the voucher consumption model.

This document adds a role-based semantic lens over those documents.

It does not change their authority, runtime interpretation, or implementation status.

## 28. Runtime / QA Boundary

This document is docs-only.

It does not request or perform:

- tests;
- runtime validation;
- QA acceptance;
- evidence collection;
- staging validation;
- production smoke validation;
- rollout validation;
- ledger validation;
- reward producer validation;
- accrual pipeline validation;
- spend enforcement validation;
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
reward_producer_activation_status: not_created
accrual_pipeline_activation_status: not_created
ledger_activation_status: not_created
spend_enforcement_activation_status: not_created
entitlement_authority_switch_status: not_created
```

## 29. Naming Boundary

This document is Stage 6.5 in the economy semantic documentation sequence.

It is not:

- RF Slice 6.5;
- an implementation slice;
- an entitlement slice;
- an authorization slice;
- a runtime rollout slice;
- a permissions matrix;
- a payout matrix.

Naming boundary:

```text
stage_6_5_context: economy_semantic_documentation
stage_6_5_role_based_rewards_matrix_v1 != RF_Slice_6_5
stage_6_5_role_based_rewards_matrix_v1 != runtime_matrix
stage_6_5_role_based_rewards_matrix_v1 != permissions_matrix
stage_6_5_role_based_rewards_matrix_v1 != payout_matrix
```

## 30. Final Classification

Final classification:

```text
document_type: semantic_role_based_reward_value_participation_model
document_mode: docs_only
runtime_changes_added: no
migrations_added: no
api_changes_added: no
feature_flags_added: no
implementation_changes_added: no
ledger_activation_added: no
reward_producer_activation_added: no
accrual_pipeline_activation_added: no
spend_enforcement_activation_added: no
rbac_or_permissions_model_added: no
payout_matrix_added: no
operator_compensation_runtime_added: no
partner_settlement_system_added: no
tests_added_or_requested: no
evidence_added_or_requested: no
runtime_validation_added_or_requested: no
slice_16_status: blocked_not_triggered
production_status: not_touched
final_verdict: role_based_rewards_matrix_v1_defines_semantic_role_based_behavioral_economy_participation_patterns_without_creating_runtime_entitlements_permissions_payout_rights_settlement_authority_reward_producers_accrual_pipeline_ledger_activation_spend_enforcement_or_slice_16_progression
```
