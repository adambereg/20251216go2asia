# Reward Sizing & Sink Pressure Modeling Draft v1

Date: 2026-05-17  
Status: `NOTE_READY_STAGE_6_9_REWARD_SIZING_SINK_PRESSURE_MODELING_DOCS_ONLY`  
Stage: `Stage 6.9 / Reward Sizing & Sink Pressure Modeling Draft v1`  
Mode: behavioral-economic modeling draft, docs-only, read-only reference, explanatory modeling only, no runtime changes, no migrations, no API changes, no feature flags, no implementation changes, no production tokenomics config, no live reward table, no final reward amounts, no ledger policy, no payout system, no accounting model, no runtime balancing engine, no reward producer activation, no accrual pipeline activation, no ledger activation, no ledger implementation, no spend enforcement, no enforcement mechanics, no payout activation, no marketplace activation, no NFT or on-chain activation, no production/runtime activation, no execution authorization, no governance approval, no Slice 16 readiness, no Slice 16 unblock, no rollout strategy, no implementation plan, no operational mandate, no evidence execution, no validation execution, no test plan, no QA acceptance, no deny or fail-closed behavior, no payment rejection logic, no authority switching

## 1. Purpose

This document creates a behavioral-economic modeling draft for reward sizing and sink pressure in Go2Asia.

It answers one question:

```text
How should Go2Asia reason about reward velocity, sink pressure, accumulation pacing, VIP activation pressure, retention pressure, progression pacing, consumption pacing, scarcity pacing, and ecosystem utility pacing without creating production reward configuration, live reward tables, runtime balancing, ledger policy, payout, marketplace, or NFT/on-chain activation semantics?
```

Main thesis:

```text
Reward sizing and sink pressure in Go2Asia should optimize behavioral engagement, progression attachment, practical utility, and retention pressure,
not maximize raw accumulation, payout volume, or speculative value.
```

This document is a behavioral-economic modeling draft.

It does not define production tokenomics config, live reward amounts, ledger policy, payout systems, accounting models, runtime balancing engines, producer pipelines, spend enforcement, marketplace mechanics, or NFT/on-chain activation.

## 2. Explicit Non-Goals

This document is not:

- a production tokenomics config;
- a live reward table;
- a final reward amount table;
- a reward price list;
- a ledger policy;
- a payout system;
- an accounting model;
- a runtime balancing engine;
- a reward producer implementation;
- an accrual pipeline;
- a spend enforcement model;
- a marketplace model;
- an NFT activation model;
- an on-chain activation model;
- a financial model for payout obligations;
- an API contract;
- an event schema;
- a database schema;
- a feature flag plan;
- a migration plan;
- a rollout plan;
- a production activation artifact;
- an implementation task list.

Non-goal classification:

```text
reward_sizing_sink_pressure_modeling_role: behavioral_economic_modeling_draft_only
production_tokenomics_config_status: not_defined
live_reward_table_status: not_defined
final_reward_amounts_status: not_defined
ledger_policy_status: not_defined
payout_system_status: not_payout_system
accounting_model_status: not_accounting_model
runtime_balancing_engine_status: not_defined
reward_producer_activation_status: not_activated
accrual_pipeline_activation_status: not_activated
spend_enforcement_status: not_activated
marketplace_activation_status: not_activated
NFT_activation_status: not_activated
on_chain_activation_status: not_activated
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
- `docs/economy/rf_voucher_reward_policy_v1.md`;
- `docs/economy/quest_badge_achievement_compatibility_v1.md`;
- `docs/economy/tokenomics/go2asia_tokenomics_v1.md`;
- `docs/economy/vip/vip_value_system_v1.md`;
- `docs/economy/points/points_sink_design_v1.md`;
- `docs/economy/vouchers/rf_voucher_economy_v1.md`;
- `docs/architecture/domain/economy_scope_reentry_note_v1.md`;
- relevant Phase G closure documents.

If this modeling draft appears to conflict with runtime-aligned policy, the runtime-aligned policy controls runtime interpretation:

```text
runtime_policy_authority: points_policy_v1_and_referral_network_rewards_policy_v1
reward_sizing_sink_pressure_modeling_authority_status: semantic_non_runtime
reward_sizing_sink_pressure_modeling_replaces_runtime_policy: false
reward_sizing_sink_pressure_modeling_changes_current_runtime: false
```

Current runtime interpretation must continue to follow the Runtime Alignment Note in `docs/economy/README.md`.

In particular:

```text
reward_sizing_bands: illustrative_semantic_bands_only
sink_pressure_bands: illustrative_semantic_bands_only
behavioral_ranges: non_binding_modeling_language
historical_or_archive_numbers: reference_material_not_live_config_unless_runtime_policy_confirms
production_reward_amounts: not_defined_by_this_document
runtime_balancing: not_activated_by_this_document
ledger_policy: not_defined_by_this_document
```

This document does not change those facts.

## 4. Source Materials and Review Scope

This document was prepared after read-first review of the economy SSOT, runtime-aligned Points and referral policies, Layered Value Architecture, Semantic Axes of Points, Points Taxonomy v1, Reward Event Catalog v1, Reward Lifecycle / Soft Accrual Rules v1, Role-Based Rewards Matrix v1, Referral & Network Reward Model Alignment v1, RF / Voucher Reward Policy v1, Quest / Badge / Achievement Compatibility Draft v1, Tokenomics, VIP Value System, Points Sink Design, RF Voucher Economy, Stage 6.1, and Phase G closure boundaries.

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
artifact_scope: reward_sizing_sink_pressure_modeling_semantic_only
runtime_review_status: not_performed
validation_execution_status: not_executed
evidence_collection_status: not_collected
implementation_tasks_status: none_implied_none_required
```

## 5. Relationship to Stage 6.1 and Phase G

This modeling draft follows `docs/architecture/domain/economy_scope_reentry_note_v1.md`.

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

Reward Sizing & Sink Pressure Modeling Draft v1 is a semantic economy artifact. It is not authority transition, runtime transition, production config activation, reward table activation, balancing engine activation, producer activation, accrual pipeline activation, ledger activation, payout activation, marketplace activation, NFT activation, on-chain activation, spend enforcement activation, or Slice 16 progression.

## 6. Canonical Behavioral Economy Model

Reward sizing and sink pressure language in Go2Asia should be interpreted through the following canonical model:

```text
reward_relevant_activity -> semantic_reward_velocity -> visible_or_projected_accumulation -> activation_tension -> consumption_or_progression_opportunity -> sink_or_retention_pressure -> practical_utility_or_identity_attachment -> renewed_participation
```

This model describes behavioral movement of value language.

It is not:

- a runtime flow;
- a production config;
- a live reward table;
- a ledger transition;
- a reward producer pipeline;
- a balancing engine;
- a spend enforcement path;
- a payout path;
- a marketplace path;
- an NFT/on-chain path.

Canonical interpretation:

```text
reward_velocity: semantic_speed_of_visible_or_experienced_value
reward_sizing: relative_behavioral_magnitude_language
sink_pressure: consumption_and_utility_pull_language
accumulation_pacing: rhythm_of_internal_utility_visibility
VIP_activation_pressure: activation_tension_not_paywall_coercion
retention_pressure: reason_to_return_or_extend_participation
progression_pacing: identity_and_prestige_cadence
consumption_pacing: practical_utility_cadence
scarcity_pacing: controlled_product_scarcity_not_speculative_value
ecosystem_utility_pacing: supply_density_and_usefulness_rhythm
```

## 7. Behavioral Economy Targets

Behavioral economy targets describe what the model is trying to optimize at the semantic level.

Primary targets:

- engagement without spam;
- accumulation without endless hoarding;
- VIP activation pressure without coercion;
- consumption without punishment;
- retention through usefulness;
- progression attachment without financial hierarchy;
- scarcity without speculation;
- network participation without passive income framing;
- RF / Voucher utility without cashback economics;
- ecosystem density without partner settlement semantics.

Target interpretation:

```text
optimize_for: behavioral_engagement | practical_utility | progression_attachment | retention_pressure
do_not_optimize_for: raw_accumulation_maximization | payout_volume | speculative_value | wealth_hierarchy
```

Boundary:

```text
behavioral_target != production_KPI
behavioral_target != runtime_requirement
behavioral_target != reward_amount
behavioral_target != payout_goal
behavioral_target != enforcement_rule
```

## 8. Behavioral Pressure Zones

Behavioral pressure zones are vocabulary for describing the user's relationship to value, utility, and motivation.

They are not runtime states.

They are not wallet buckets.

They are not ledger states.

Canonical pressure zones:

```text
1. Curiosity Zone
2. Accumulation Zone
3. Activation Tension Zone
4. Progression Attachment Zone
5. Retention Zone
6. Utility Satisfaction Zone
7. Overpressure Risk Zone
```

### 8.1 Curiosity Zone

Curiosity Zone describes early attention before strong economic commitment.

It may involve:

- public content;
- visible utility examples;
- early city discovery;
- light activity;
- first understanding of Points, vouchers, quests, or VIP.

Boundary:

```text
curiosity_zone: behavioral_language
curiosity_zone != reward_grant
curiosity_zone != spend_authority
curiosity_zone != conversion_guarantee
```

### 8.2 Accumulation Zone

Accumulation Zone describes the period where a user sees internal utility build up.

It may involve:

- visible Points;
- pending or conditional value;
- early contribution signals;
- referral or network advisory visibility;
- basic progression recognition.

Boundary:

```text
accumulation_zone: visible_internal_utility_pressure
accumulation_zone != spendable_balance_by_itself
visible_accumulation != spend_approval
accumulation_pressure != payout
```

### 8.3 Activation Tension Zone

Activation Tension Zone describes the moment where visible value, locked value, RF utility, progression relevance, or network visibility can make VIP feel meaningful.

Boundary:

```text
activation_tension_zone: VIP_pressure_language
activation_tension != coercion
VIP_pressure != paywall_abuse
VIP_pressure != spend_approval
VIP_pressure != payout_unlock
```

### 8.4 Progression Attachment Zone

Progression Attachment Zone describes a user's emotional and identity-based connection to badges, achievements, quests, collection, status-like signals, or long-term participation.

Boundary:

```text
progression_attachment_zone: identity_and_prestige_language
progression_attachment != financial_status
prestige_attachment != wealth_hierarchy
collection_attachment != marketplace_inventory
```

### 8.5 Retention Zone

Retention Zone describes the user's reason to return, continue, or renew participation.

It may come from:

- useful vouchers;
- meaningful quests;
- visible progression;
- network participation context;
- practical city utility;
- seasonal or collection relevance.

Boundary:

```text
retention_zone: behavioral_continuity_language
retention_pressure != forced_renewal
retention_pressure != payout_promise
retention_pressure != runtime_obligation
```

### 8.6 Utility Satisfaction Zone

Utility Satisfaction Zone describes the moment when accumulated value becomes felt value.

It may involve:

- voucher use;
- offline benefit;
- useful quest participation;
- premium progression context;
- practical city discovery.

Boundary:

```text
utility_satisfaction_zone: practical_value_experience
utility_satisfaction != cashback
utility_satisfaction != partner_settlement
utility_satisfaction != payment_for_underlying_service
```

### 8.7 Overpressure Risk Zone

Overpressure Risk Zone describes a design risk where pressure language becomes too intense or could be misread as coercive, speculative, financial, or punitive.

Examples:

- VIP pressure that reads as abusive paywall;
- sink pressure that reads as forced spend;
- scarcity that reads as speculative asset pressure;
- network projection that reads as passive income;
- progression that reads as wealth hierarchy.

Boundary:

```text
overpressure_risk_zone: design_risk_language
overpressure_risk != enforcement_trigger
overpressure_risk != user_fault
overpressure_risk != runtime_denial
```

## 9. Reward Velocity Modeling

Reward velocity modeling describes how quickly a user perceives value movement.

It may consider:

- daily accumulation language;
- weekly accumulation language;
- monthly accumulation language;
- milestone accumulation language;
- visible Points;
- conditional or locked value;
- advisory network utility;
- progression signals;
- practical utility relevance.

Velocity modeling should help explain when value feels:

```text
sparse
steady
bursty
overheated
```

These zones are qualitative.

They are not production KPIs.

They are not live reward rates.

Boundary:

```text
reward_velocity_modeling != production_reward_amounts
reward_velocity_zone != live_config
daily_accumulation_language != daily_reward_table
weekly_accumulation_language != weekly_reward_quota
monthly_accumulation_language != monthly_payout_model
milestone_accumulation_language != guaranteed_reward
```

## 10. Reward Sizing Bands

Reward sizing bands describe relative behavioral magnitude.

They do not define final reward amounts.

Canonical semantic sizing bands:

```text
1. Micro Reward
2. Small Reward
3. Medium Reward
4. Large Reward
5. Milestone Reward
6. Prestige Reward
7. Operator / Progression Reward
```

### 10.1 Micro Reward

Micro Reward describes tiny recognition for lightweight activity or signals.

Typical semantic fit:

- light engagement;
- low-friction activity;
- small attention signals;
- early participation feedback.

Boundary:

```text
micro_reward: relative_magnitude_band
micro_reward != live_reward_amount
micro_reward != payout
micro_reward != guaranteed_balance
```

### 10.2 Small Reward

Small Reward describes ordinary participation recognition.

Typical semantic fit:

- basic activity;
- small contribution;
- low-risk quest step;
- simple ecosystem participation.

Boundary:

```text
small_reward: relative_magnitude_band
small_reward != production_config
small_reward != ledger_policy
```

### 10.3 Medium Reward

Medium Reward describes meaningful participation or practical utility relevance.

Typical semantic fit:

- useful contribution;
- quest completion context;
- RF or voucher-related participation where policy allows;
- contribution that strengthens ecosystem quality.

Boundary:

```text
medium_reward: relative_magnitude_band
medium_reward != final_reward_amount
medium_reward != automatic_reward
```

### 10.4 Large Reward

Large Reward describes high-salience utility or major contribution recognition.

Typical semantic fit:

- major contribution;
- high-effort quest or experience;
- exceptional ecosystem utility;
- important milestone where separately defined.

Boundary:

```text
large_reward: relative_magnitude_band
large_reward != payout
large_reward != wage
large_reward != operator_compensation
```

### 10.5 Milestone Reward

Milestone Reward describes a meaningful progress marker.

Typical semantic fit:

- achievement milestone;
- retained participation;
- completed progression arc;
- city or season milestone.

Boundary:

```text
milestone_reward: recognition_band
milestone_reward != financial_obligation
milestone_reward != NFT_mint_trigger
```

### 10.6 Prestige Reward

Prestige Reward describes recognition, status-like meaning, or collection relevance.

Typical semantic fit:

- badge;
- achievement;
- rare recognition;
- long-term identity marker;
- progression or prestige signal.

Boundary:

```text
prestige_reward: status_and_identity_band
prestige_reward != money
prestige_reward != wealth_hierarchy
prestige_reward != speculative_asset
```

### 10.7 Operator / Progression Reward

Operator / Progression Reward describes recognition for ecosystem utility, local expertise, quest creation, or operator-style contribution.

Typical semantic fit:

- PRO contribution language;
- quest creation archetype;
- city guide contribution;
- Atlas or local expertise contribution;
- ecosystem density contribution.

Boundary:

```text
operator_progression_reward: semantic_recognition_band
operator_progression_reward != PRO_payout
operator_progression_reward != guaranteed_income
operator_progression_reward != paid_gig
operator_progression_reward != settlement
```

## 11. Reward Sizing Band Relationship to Activity Types

This relationship is illustrative only.

It is not a production reward table.

Semantic mapping:

```text
Light attention signals -> Micro Reward
Ordinary participation -> Small Reward
Useful contribution -> Medium Reward
High-quality contribution -> Large Reward
Quest or experience completion -> Small | Medium | Milestone depending on policy context
Progression or achievement recognition -> Milestone | Prestige
RF / Voucher utility participation -> Small | Medium where policy and runtime allow
Referral registration or network visibility -> Conditional | Advisory | Milestone pressure language, not payout
Operator or PRO ecosystem contribution -> Operator / Progression Reward as recognition language, not payout
```

Boundary:

```text
activity_type_mapping != reward_table
activity_type_mapping != producer_config
activity_type_mapping != final_amounts
activity_type_mapping != payout_matrix
```

## 12. Sink Pressure Modeling

Sink pressure modeling describes the pull from accumulated value toward consumption, progression, burn, or utility realization.

It may include:

- spend pressure;
- burn pressure;
- consumption pressure;
- sink pacing;
- sink density;
- practical utility pull;
- premium access relevance;
- status sink relevance;
- collection sink relevance.

Canonical sink pressure bands:

```text
1. Low Sink Pressure
2. Balanced Sink Pressure
3. Strong Utility Pull
4. Overpressure Risk
```

### 12.1 Low Sink Pressure

Low Sink Pressure describes a condition where accumulated value has too few meaningful exits.

Potential effects:

- endless hoarding risk;
- VIP value confusion;
- low consumption motivation;
- weak practical utility feeling.

Boundary:

```text
low_sink_pressure: modeling_language
low_sink_pressure != failure_verdict
low_sink_pressure != enforcement_trigger
```

### 12.2 Balanced Sink Pressure

Balanced Sink Pressure describes a healthy relationship between accumulation and utility opportunities.

Potential effects:

- users can see value building;
- users can find useful exits;
- VIP activation can feel meaningful;
- retention can be supported by practical utility.

Boundary:

```text
balanced_sink_pressure: behavioral_modeling_language
balanced_sink_pressure != production_KPI
balanced_sink_pressure != guaranteed_retention
```

### 12.3 Strong Utility Pull

Strong Utility Pull describes high practical relevance of consumption surfaces.

Potential sources:

- useful vouchers;
- meaningful quests;
- premium progression;
- city-level practical utility;
- seasonal or collection relevance.

Boundary:

```text
strong_utility_pull != forced_spend
strong_utility_pull != coercion
strong_utility_pull != spend_enforcement
```

### 12.4 Overpressure Risk

Overpressure Risk describes a design risk where sink pressure could be misread as punishment, coercion, or forced spend.

Boundary:

```text
overpressure_risk != punishment
sink_pressure != punishment
spend_pressure != coercion
anti_hoarding != forced_spend
```

## 13. Healthy Spend Dynamics

Healthy spend dynamics describe a behavioral balance between earning and using internal utility.

The model should preserve these principles:

- accumulation should not become endless hoarding;
- spend should not feel like punishment;
- visible value should create activation tension;
- spend should support retention and utility;
- consumption should feel useful rather than extractive;
- progression should remain meaningful rather than saturated;
- sinks should create satisfaction, not anxiety.

Qualitative spend states:

```text
stagnant_balances
paced_use
utility_realization
panic_offload_risk
```

Boundary:

```text
healthy_spend_dynamics != production_KPI
healthy_spend_dynamics != forced_spend_rule
spend_rate_language != live_dashboard_authority
utility_realization != payout
```

## 14. Accumulation Pacing

Accumulation pacing describes the rhythm of visible internal utility growth.

It may involve:

- personal activity accumulation;
- contribution accumulation;
- conditional referral value;
- projected network value;
- quest or experience value;
- RF / Voucher-related utility;
- progression or prestige signals.

Good accumulation pacing should make value legible without implying cash, payout, ledger truth, or spend approval.

Boundary:

```text
accumulation_pacing != cash_balance_growth
accumulation_pacing != payout_schedule
visible_accumulation != spendable_balance
projected_accumulation != ledger_truth
```

## 15. VIP Activation Pressure Modeling

VIP activation pressure modeling describes how visible value, locked value, conditional value, progression relevance, RF utility, and network utility can make VIP feel useful.

Inputs may include:

- visible ordinary Points;
- locked or conditional referral value;
- advisory network visibility;
- RF / Voucher practical utility;
- quest or progression relevance;
- premium access relevance;
- retention through status or collection.

VIP pressure is activation language.

It is not paywall coercion.

It is not payout unlock.

Boundary:

```text
VIP_activation_pressure: activation_tension_language
visible_value != spend_approval
locked_value_pressure != payout_unlock
conditional_value_pressure != guaranteed_unlock
network_pressure != passive_income
RF_utility_pressure != cashback
progression_pressure != pay_to_win
VIP_pressure != paywall_abuse
```

## 16. Retention Pressure Modeling

Retention pressure modeling describes why users may want to return, continue participating, or renew engagement.

Retention may be supported by:

- useful vouchers;
- city-level utility;
- meaningful quests;
- visible progression;
- identity attachment;
- collection relevance;
- conditional referral value;
- network participation visibility;
- ecosystem density.

Retention pressure is behavioral language.

It is not a renewal guarantee.

It is not forced renewal.

Boundary:

```text
retention_pressure != forced_renewal
retention_pressure != guaranteed_retention
retention_pressure != payout_promise
retention_pressure != runtime_requirement
```

## 17. Progression & Prestige Pacing

Progression and prestige pacing describes how often badges, achievements, prestige, rarity, and collection signals should appear as meaningful recognition.

Progression should feel:

- legible enough to motivate;
- spaced enough to remain meaningful;
- varied enough to support identity;
- scarce enough to preserve prestige;
- safe enough to avoid speculative behavior.

Qualitative pacing zones:

```text
early_orientation
competence_arc
status_memory
prestige_saturation_risk
```

Boundary:

```text
progression_pacing != monetized_status_hierarchy
prestige_pacing != wealth_hierarchy
rarity_pacing != speculative_asset_creation
badge_pacing != NFT_activation
achievement_pacing != financial_reward
```

## 18. RF / Voucher Consumption Modeling

RF / Voucher consumption modeling describes how voucher utility, practical utility, city-level usefulness, and offline benefit can shape spend pressure and retention.

It may consider:

- voucher utility;
- practical utility;
- city-level utility;
- offer density;
- category coverage;
- offline benefit;
- retention through usefulness;
- premium voucher context;
- useful quest surfaces.

RF / Voucher consumption is practical utility language.

It is not cashback economics.

It is not partner settlement.

Boundary:

```text
voucher_utility != cashback_economics
voucher_consumption != partner_settlement
RF_utility != marketplace_settlement
practical_utility != financial_obligation
offline_benefit != platform_payment_obligation
```

## 19. Referral & Network Pressure Modeling

Referral and network pressure modeling describes how conditional referral value, projected network value, advisory visibility, and network participation can support curiosity, retention, and activation pressure.

It may include:

- conditional referral value;
- `referral_locked` visibility where runtime-aligned policy confirms;
- unlock candidate language;
- projected network value;
- advisory network visibility;
- limited-depth network participation;
- VIP-related network pressure;
- ecosystem growth participation.

Network pressure is participation language.

It is not passive income.

It is not MLM.

It is not payout.

Boundary:

```text
network_pressure != passive_income
network_pressure != MLM
network_projection != ledger_truth
advisory_network_visibility != wallet_balance
conditional_referral_value != available_balance
referral_pressure != commission
```

## 20. Anti-Inflation & Anti-Hoarding Modeling

Anti-inflation and anti-hoarding modeling describes the risks of value accumulation becoming too large, too trivial, or too disconnected from utility.

Risks:

- inflation of perceived Points value;
- endless accumulation risk;
- reward trivialization risk;
- sink insufficiency risk;
- progression oversaturation risk;
- stale balance risk;
- low practical utility risk;
- weak VIP renewal pressure.

Safe modeling principles:

- increase utility exits before using punitive language;
- prefer useful sinks over forced decay;
- treat seasonal opportunity decay as product language, not confiscation;
- preserve trust by avoiding surprise loss framing;
- distinguish anti-hoarding from forced spend;
- distinguish sink pressure from punishment.

Boundary:

```text
anti_inflation_modeling != monetary_policy
anti_hoarding != forced_spend
sink_insufficiency_risk != user_fault
progression_oversaturation != enforcement_trigger
seasonal_opportunity_decay != confiscation
balance_glut_language != payout_liability
```

## 21. Scarcity & Collection Modeling

Scarcity and collection modeling describes how rarity, limited achievements, seasonal progression, collection loops, and prestige signals can create retention without creating speculative behavior.

Scarcity may include:

- seasonal recognition;
- city-specific achievement;
- limited progression windows;
- rare badge language;
- collection completion;
- premium progression context.

Scarcity must remain product meaning.

Collection must remain personal achievement archive language.

Boundary:

```text
scarcity_modeling != speculative_NFT_economy
rarity != speculative_asset
collection != marketplace
collection_loop != marketplace_loop
limited_achievement != financial_claim
rare_badge != investment_product
```

## 22. Anti-Whale / Anti-Wealth-Hierarchy Modeling

Anti-whale and anti-wealth-hierarchy modeling describes how Go2Asia should avoid becoming pay-to-win, speculative, extractive, or status-through-money.

Principles:

- reward meaningful participation over raw bulk accumulation;
- keep prestige separated from financial status;
- avoid making VIP feel like pay-to-win;
- avoid making network utility feel like passive income;
- avoid making rare progression feel like investment asset;
- preserve useful low and medium utility surfaces for ordinary users;
- make high-balance sinks meaningful without turning the economy into a wealth hierarchy;
- treat concentration signals as modeling inputs, not user stigma.

Boundary:

```text
anti_whale_modeling != user_stigma
high_balance_user != abuser_by_default
pay_to_win_status: forbidden
progression != wealth_hierarchy
prestige != financial_status
rarity != investment_asset
network_depth != MLM_power
```

## 23. Relationship to Point Taxonomy

Reward sizing and sink pressure modeling maps to `docs/economy/points_taxonomy_v1.md`.

Relationship:

```text
Personal Activity Points -> velocity and ordinary accumulation pacing
Contribution Points -> sizing bands for useful contribution and quality signals
Conditional Referral Points -> activation pressure and conditional value pacing
Network Activity Points -> advisory / projected pressure language, not passive income
RF / Voucher-related Points -> consumption pacing and practical utility pull
Quest / Experience Points -> experience pacing and quest-related utility
Progression / Prestige Signals -> progression pacing, rarity, collection, identity attachment
Compensation / Correction Points -> operational recovery only, excluded from reward sizing loops
```

Boundary:

```text
point_class_modeling != separate_currency
point_class_modeling != reward_producer_config
sizing_band_by_point_class != live_reward_amount
sink_pressure_by_point_class != spend_enforcement
```

## 24. Relationship to Reward Event Catalog

Reward sizing and sink pressure modeling maps to `docs/economy/reward_event_catalog_v1.md`.

Relationship:

```text
Activity Events -> micro / small velocity signals
Contribution Events -> small / medium / large contribution magnitude bands
Referral Events -> conditional pressure language
Network Activity Events -> advisory or projected pressure language
RF / Voucher Events -> consumption pacing and practical utility signals
Quest / Experience Events -> experience pacing and milestone context
Progression / Prestige Events -> prestige, collection, rarity, retention pacing
VIP Activation Events -> activation tension language
Sink Participation Events -> sink pressure and burn vocabulary
Externalization-sensitive Events -> future boundary language only
```

Boundary:

```text
event_family_sizing != producer_config
event_family_sizing != event_schema
event_family_sizing != ledger_action
event_family_sizing != payout_right
```

## 25. Relationship to Reward Lifecycle

Reward sizing and sink pressure modeling must remain aligned with `docs/economy/reward_lifecycle_soft_accrual_rules_v1.md`.

Lifecycle interpretation:

```text
Observed -> may inform velocity modeling, not reward grant
Classified -> may inform sizing band, not granted amount
Pending -> may inform pacing risk, not available value
Conditional -> may inform activation pressure, not spendable balance
Advisory / Projected -> may inform pressure language, not ledger truth
Available -> may inform sink modeling where policy/runtime support availability
Spent -> may inform consumption pacing, not partner settlement
Burned -> may inform anti-inflation language, not blockchain activation
Corrected / Reversed -> excluded from gamified reward sizing loops
Expired / Archived -> may inform historical modeling, not enforcement
```

Boundary:

```text
lifecycle_stage_modeling != runtime_state_machine
classified_band != granted_amount
projected_pressure != ledger_truth
available_modeling != guaranteed_spend_approval
burn_modeling != on_chain_burn
```

## 26. Relationship to VIP Activation

Reward sizing and sink pressure modeling should support safe VIP activation language.

VIP activation pressure may be influenced by:

- visible accumulation;
- locked or conditional value;
- advisory network value;
- RF / Voucher practical utility;
- quest utility;
- progression relevance;
- premium consumption relevance;
- retention through useful sinks.

VIP pressure must remain behavioral.

It must not become coercion, pay-to-win, payout unlock, or spend approval.

Boundary:

```text
VIP_activation_modeling != entitlement_runtime_activation
VIP_pressure != paywall_abuse
VIP_pressure != pay_to_win
VIP_pressure != payout_unlock
VIP_pressure != spend_approval
```

## 27. Relationship to RF / Voucher Utility

RF / Voucher utility provides the primary practical consumption surface for sink pressure.

Modeling should treat RF / Voucher utility as:

- practical utility;
- city-level usefulness;
- voucher claim relevance;
- consumption pacing;
- offer density;
- offline benefit context;
- retention through usefulness.

It must not treat RF / Voucher utility as cashback, affiliate payout, marketplace settlement, or partner payout.

Boundary:

```text
RF_voucher_modeling != cashback_economy
RF_voucher_modeling != affiliate_payout_system
RF_voucher_modeling != marketplace_settlement
RF_voucher_modeling != partner_payout
voucher_sink_pressure != payment_pipeline
```

## 28. Relationship to Progression / Prestige

Reward sizing and sink pressure modeling must preserve the progression/prestige boundaries from `docs/economy/quest_badge_achievement_compatibility_v1.md`.

Modeling may consider:

- badge cadence;
- achievement cadence;
- progression attachment;
- rarity pacing;
- collection loops;
- identity signals;
- prestige memory;
- future NFT compatibility boundary.

It must not convert progression into wealth hierarchy, payout, speculative NFT value, or marketplace inventory.

Boundary:

```text
progression_modeling != payout_hierarchy
prestige_modeling != financial_status
collection_modeling != marketplace
rarity_modeling != speculative_asset
NFT_compatibility_modeling != NFT_activation
```

## 29. Relationship to Referral & Network Semantics

Reward sizing and sink pressure modeling must preserve the referral/network boundaries from `docs/economy/referral_network_reward_model_alignment_v1.md`.

Modeling may describe:

- conditional referral pressure;
- advisory referral visibility;
- projected network value;
- VIP-related network pressure;
- ecosystem growth utility;
- limited-depth participation relevance.

It must not describe network utility as income, commission, passive income, MLM, payout, or guaranteed reward.

Boundary:

```text
referral_pressure_modeling != commission
network_pressure_modeling != passive_income
network_pressure_modeling != MLM
projected_network_value != granted_reward
advisory_network_value != ledger_balance
```

## 30. Relationship to Future Ledger Vocabulary

Modeling language may help prepare future ledger vocabulary, but only as semantic preparation.

Future ledger vocabulary may eventually need to distinguish:

- reward magnitude band;
- reward velocity context;
- sink pressure context;
- burn or spend context;
- progression pacing context;
- RF / Voucher consumption context;
- referral conditional pressure context;
- network advisory pressure context;
- scarcity or collection context.

This document does not define ledger states, ledger actions, ledger policy, accounting entries, producer contracts, or event schemas.

Boundary:

```text
modeling != runtime_balancing
modeling != ledger_policy
sizing_band != live_reward_config
pressure_modeling != enforcement
future_ledger_vocabulary != ledger_activation
```

## 31. Behavioral Interaction Patterns

These patterns are illustrative only.

They are not runtime flows.

They are not implementation tasks.

They are not balancing rules.

### Pattern 1 - Visible Accumulation and VIP Pressure

```text
visible accumulation + VIP pressure + practical utility
```

Meaning:

- visible value helps the user understand accumulated utility;
- VIP pressure can emerge when practical utility is available;
- practical utility makes activation feel useful.

Boundary:

```text
visible_accumulation != spendable_balance
VIP_pressure != coercion
practical_utility != financial_obligation
```

### Pattern 2 - Progression Attachment and Retention

```text
progression attachment + retention utility
```

Meaning:

- progression can create identity memory;
- identity memory can support retention;
- retention utility should remain product meaning.

Boundary:

```text
progression_attachment != financial_status
retention_utility != guaranteed_renewal
```

### Pattern 3 - Voucher Utility and Reduced Hoarding

```text
voucher utility + spend satisfaction + reduced hoarding
```

Meaning:

- useful vouchers give accumulated value a practical exit;
- spend satisfaction can reduce hoarding pressure;
- reduced hoarding should come from utility, not forced spend.

Boundary:

```text
voucher_utility != cashback
spend_satisfaction != payout
reduced_hoarding != forced_spend
```

### Pattern 4 - Conditional Referral Value and Curiosity

```text
conditional referral value + curiosity pressure
```

Meaning:

- conditional referral value can be visible as pressure;
- curiosity can support activation interest;
- conditional value must remain separate from available value.

Boundary:

```text
conditional_referral_value != available_balance
curiosity_pressure != passive_income
```

### Pattern 5 - Seasonal Rarity and Collection Retention

```text
seasonal rarity + collection retention
```

Meaning:

- seasonal rarity can create product meaning;
- collection retention can support long-term identity;
- scarcity must avoid speculative framing.

Boundary:

```text
seasonal_rarity != speculative_asset
collection_retention != marketplace_loop
```

### Pattern 6 - Prestige Signal and Long-Term Identity

```text
prestige signal + long-term identity attachment
```

Meaning:

- prestige can mark durable participation;
- identity attachment can support retention;
- prestige must not become financial status.

Boundary:

```text
prestige_signal != wealth_hierarchy
identity_attachment != wallet_balance
```

### Pattern 7 - Ecosystem Utility and Supply Density

```text
ecosystem utility + partner supply density + retention
```

Meaning:

- utility depends on real city-level surfaces;
- partner and PRO context can increase practical relevance;
- supply density supports retention without settlement semantics.

Boundary:

```text
partner_supply_density != settlement_authority
PRO_utility != payout_hierarchy
ecosystem_utility != marketplace_activation
```

## 32. Reward Sizing & Sink Safety Invariants

Required safety invariants:

```text
reward_modeling != production_config
sizing_band != live_reward_amount
sink_pressure != punishment
spend_pressure != coercion
VIP_pressure != paywall_abuse
network_pressure != passive_income
progression != wealth_hierarchy
rarity != speculative_asset
collection != marketplace
anti_hoarding != forced_spend
progression_pacing != monetized_status_hierarchy
reward_modeling != reward_producer_activation
reward_modeling != accrual_pipeline_activation
reward_modeling != spend_enforcement
reward_modeling != ledger_activation
reward_modeling != marketplace_activation
reward_modeling != NFT_activation
reward_modeling != on_chain_activation
diagnostics != authority
shadow_graph != enforcement
```

Additional anti-drift invariants:

```text
behavioral_range != production_KPI
historical_number != live_config
modeling_band != payout_table
pressure_zone != runtime_state
anti_inflation_modeling != monetary_obligation
risk_modeling != enforcement_activation
fraud_review_language != runtime_denial
overpressure_risk != fail_closed_behavior
recommendation != authorization
```

## 33. Forbidden Interpretations

Forbidden interpretations:

- sizing bands become live economy config;
- reward modeling becomes payout table;
- reward modeling becomes final reward amounts;
- sink pressure becomes forced spend;
- sink pressure becomes punishment;
- VIP pressure becomes abusive paywall;
- VIP pressure becomes pay-to-win;
- progression becomes monetized status hierarchy;
- prestige becomes financial status;
- network utility becomes passive income;
- referral pressure becomes commission;
- rarity becomes speculative NFT economy;
- collection loops become marketplace loops;
- RF utility becomes cashback economy;
- anti-hoarding becomes forced spend;
- anti-inflation modeling becomes user penalty;
- reward modeling activates producers;
- reward modeling activates accrual pipeline;
- reward modeling activates spend enforcement;
- reward modeling activates ledger;
- reward modeling activates marketplace;
- reward modeling activates NFT/on-chain;
- reward modeling unblocks Slice 16.

Forbidden interpretation classification:

```text
implicit_live_config: forbidden
implicit_payout_table: forbidden
implicit_final_amounts: forbidden
implicit_forced_spend: forbidden
implicit_abusive_paywall: forbidden
implicit_pay_to_win: forbidden
implicit_monetized_status_hierarchy: forbidden
implicit_passive_income: forbidden
implicit_speculative_NFT_economy: forbidden
implicit_marketplace_loop: forbidden
implicit_cashback_economy: forbidden
implicit_reward_producer_activation: forbidden
implicit_accrual_pipeline_activation: forbidden
implicit_spend_enforcement_activation: forbidden
implicit_ledger_activation: forbidden
implicit_marketplace_activation: forbidden
implicit_NFT_on_chain_activation: forbidden
implicit_slice_16_unblock: forbidden
```

## 34. Relationship to Existing Economy SSOT

This document does not replace existing economy SSOT.

Relationship:

- `docs/economy/README.md` remains the economy entry point.
- `docs/economy/points_policy_v1.md` remains the runtime-aligned Points policy.
- `docs/economy/referral_network_rewards_policy_v1.md` remains the runtime-aligned referral/network policy.
- `docs/economy/reward_event_catalog_v1.md` remains event semantics.
- `docs/economy/points_taxonomy_v1.md` remains Point taxonomy.
- `docs/economy/points/semantic_axes_of_points_v1.md` remains the coordinate system.
- `docs/economy/layered_value_architecture_v1.md` remains value topology.
- `docs/economy/reward_lifecycle_soft_accrual_rules_v1.md` remains lifecycle semantics.
- `docs/economy/role_based_rewards_matrix_v1.md` remains role participation semantics.
- `docs/economy/referral_network_reward_model_alignment_v1.md` remains referral/network semantic alignment.
- `docs/economy/rf_voucher_reward_policy_v1.md` remains RF / Voucher utility policy.
- `docs/economy/quest_badge_achievement_compatibility_v1.md` remains progression/prestige compatibility layer.
- `docs/economy/tokenomics/go2asia_tokenomics_v1.md` remains the full economy model.
- `docs/economy/vip/vip_value_system_v1.md` remains the behavioral VIP model.
- `docs/economy/points/points_sink_design_v1.md` remains the sink model.
- `docs/economy/vouchers/rf_voucher_economy_v1.md` remains the voucher economy model.
- `docs/architecture/domain/economy_scope_reentry_note_v1.md` remains Stage 6.1 economy scope re-entry governance boundary.

This document adds:

- behavioral-economic modeling language for reward velocity, sink pressure, accumulation pacing, VIP activation pressure, retention pressure, progression pacing, consumption pacing, scarcity pacing, and ecosystem utility pacing;
- semantic reward sizing bands that are not final reward amounts;
- semantic sink pressure bands that are not spend enforcement;
- behavioral pressure zones that are not runtime states;
- anti-inflation, anti-hoarding, anti-whale, anti-wealth-hierarchy modeling principles;
- explicit separation between modeling and production config, live reward tables, payout tables, runtime balancing, ledger policy, marketplace activation, or NFT/on-chain activation.

This document does not change:

- current runtime;
- runtime-aligned Points policy;
- referral/network runtime policy;
- RF voucher runtime behavior;
- VIP entitlement runtime status;
- quest or badge runtime behavior;
- progression/prestige runtime status;
- NFT/Totem activation status;
- on-chain activation status;
- marketplace activation status;
- ledger activation status;
- Slice 16 status.

SSOT boundary:

```text
reward_sizing_sink_pressure_modeling_v1_replaces_existing_SSOT: false
reward_sizing_sink_pressure_modeling_v1_changes_runtime_policy: false
reward_sizing_sink_pressure_modeling_v1_authorizes_implementation: false
reward_sizing_sink_pressure_modeling_v1_unblocks_slice_16: false
```

## 35. Runtime / QA Boundary

This document requires no runtime validation.

It creates no QA acceptance requirement.

It creates no implementation task.

Runtime / QA boundary:

```text
tests_required: false
evidence_required: false
runtime_validation_required: false
implementation_tasks_required: false
rollout_required: false
production_activation_required: false
reward_producer_activation_required: false
accrual_pipeline_activation_required: false
spend_enforcement_activation_required: false
NFT_activation_required: false
on_chain_activation_required: false
marketplace_activation_required: false
ledger_activation_required: false
runtime_balancing_required: false
```

Runtime Validation / QA review is boundary consistency review only.

It is not:

- test execution;
- evidence collection;
- runtime validation;
- acceptance approval;
- rollout approval;
- production approval;
- reward producer approval;
- accrual pipeline approval;
- spend enforcement approval;
- NFT/on-chain approval;
- marketplace approval;
- ledger approval;
- Slice 16 progression review.

QA classification:

```text
runtime_review_status: not_performed
validation_execution_status: not_executed
evidence_collection_status: not_collected
qa_acceptance_status: not_requested
runtime_activation_status: not_activated
production_status: not_touched
slice_16_status: blocked_not_triggered
```

## 36. Stage 6.9 Naming Boundary

This document is Stage 6.9 in the economy semantic documentation sequence.

It is not:

- RF Slice 6.9;
- a runtime implementation slice;
- a tokenomics configuration slice;
- a reward producer slice;
- an accrual pipeline slice;
- a ledger activation slice;
- a marketplace activation slice;
- an NFT activation slice;
- an on-chain activation slice;
- a Slice 16 prerequisite;
- a Slice 16 readiness artifact.

Naming classification:

```text
stage_6_9_context: economy_semantic_documentation_sequence
stage_6_9_reward_sizing_sink_pressure != RF_slice_6_9
stage_6_9_reward_sizing_sink_pressure != implementation_slice
stage_6_9_reward_sizing_sink_pressure != production_config_slice
stage_6_9_reward_sizing_sink_pressure != reward_producer_slice
stage_6_9_reward_sizing_sink_pressure != ledger_activation_slice
stage_6_9_reward_sizing_sink_pressure != marketplace_activation_slice
stage_6_9_reward_sizing_sink_pressure != NFT_on_chain_activation_slice
stage_6_9_reward_sizing_sink_pressure != slice_16_readiness
```

## 37. Final Classification

Final classification:

```text
document_type: behavioral_economic_modeling_draft
document_mode: docs_only
runtime_status: unchanged
authority_status: non_authoritative
production_config_status: not_defined
live_reward_table_status: not_defined
final_reward_amounts_status: not_defined
runtime_balancing_status: not_activated
reward_producer_status: not_activated
accrual_pipeline_status: not_activated
ledger_status: not_activated
spend_enforcement_status: not_activated
payout_status: not_activated
marketplace_activation_status: not_activated
NFT_activation_status: not_activated
on_chain_activation_status: not_activated
production_status: not_touched
slice_16_status: blocked_not_triggered
```

Final verdict:

```text
Reward Sizing & Sink Pressure Modeling Draft v1 creates behavioral-economic modeling language for reward velocity, sink pressure, accumulation pacing, VIP activation pressure, retention pressure, progression pacing, consumption pacing, scarcity pacing, and ecosystem utility pacing without activating runtime, API, migration, ledger, enforcement, reward producer, accrual pipeline, payout, marketplace, NFT/on-chain, production, or Slice 16 changes.
```
