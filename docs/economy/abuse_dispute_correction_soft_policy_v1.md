# Abuse / Dispute / Correction Soft Policy v1

Date: 2026-05-17  
Status: `NOTE_READY_STAGE_6_11_ABUSE_DISPUTE_CORRECTION_SOFT_POLICY_DOCS_ONLY`  
Stage: `Stage 6.11 / Abuse / Dispute / Correction Soft Policy v1`  
Mode: semantic abuse / dispute / correction soft policy, docs-only, read-only reference, explanatory policy language only, no runtime changes, no migrations, no API changes, no feature flags, no implementation changes, no fraud engine activation, no enforcement activation, no deny behavior, no fail-closed behavior, no account sanctions, no automated blocking, no moderation runtime, no dispute resolution workflow, no legal procedure, no compliance procedure, no support ticket system, no ledger correction implementation, no ledger activation, no ledger schema design, no reward producer activation, no accrual pipeline activation, no spend enforcement mechanics, no payout activation, no marketplace activation, no NFT activation, no on-chain activation, no production/runtime activation, no rollout plan, no implementation tasks, no execution authorization, no governance approval, no Slice 16 readiness, no Slice 16 unblock, no evidence execution, no validation execution, no test plan, no QA acceptance, no payment rejection logic, no authority switching

## 1. Purpose

This document creates semantic soft policy language for abuse-sensitive reward contexts, disputes, corrections, reversals, recovery, expiration, archival, fairness, trust, and operational repair in Go2Asia.

It answers one question:

```text
How should Go2Asia describe abuse-sensitive contexts, suspicious or spam-prone activity, reward disputes, correction, reversal, recovery, expiration, adjustment, fairness, user trust, and operational repair without activating fraud engines, enforcement, denial, fail-closed behavior, account sanctions, automated blocking, legal workflows, support workflows, ledger correction implementation, payout, marketplace, NFT, or on-chain systems?
```

Main thesis:

```text
Abuse / dispute / correction policy in Go2Asia should preserve trust, explainability, fairness, and operational repair semantics,
not activate enforcement, punishment, fraud conviction, account sanctions, payout claims, or automated denial systems.
```

This document is semantic soft policy for abuse / dispute / correction language.

It does not create a fraud engine.

It does not create enforcement policy.

It does not create a deny policy.

It does not create account sanctions.

It does not create automated blocking.

It does not create a moderation runtime.

It does not create a dispute resolution workflow.

It does not create legal or compliance procedures.

It does not implement ledger corrections, refunds, payouts, or support ticket flows.

## 2. Explicit Non-Goals

This document is not:

- a fraud engine;
- an enforcement policy;
- a deny policy;
- a fail-closed policy;
- an account sanction model;
- an automated blocking system;
- a moderation runtime;
- a dispute resolution workflow;
- a legal procedure;
- a compliance procedure;
- a support ticket system;
- a ledger correction implementation;
- a ledger schema;
- a database design;
- an event sourcing spec;
- a refund system;
- a payout system;
- a compensation program;
- a partner settlement model;
- a marketplace model;
- an NFT activation model;
- an on-chain activation model;
- an API contract;
- an event schema;
- a feature flag plan;
- a migration plan;
- a rollout plan;
- a production activation artifact;
- an implementation task list;
- a Slice 16 readiness artifact.

Non-goal classification:

```text
abuse_dispute_correction_soft_policy_role: semantic_soft_policy_language_only
fraud_engine_status: not_activated
enforcement_policy_status: not_defined
deny_policy_status: not_defined
fail_closed_status: not_activated
account_sanction_status: not_activated
automated_blocking_status: not_activated
moderation_runtime_status: not_activated
dispute_resolution_workflow_status: not_defined
legal_procedure_status: not_defined
compliance_procedure_status: not_defined
support_ticket_system_status: not_defined
ledger_correction_implementation_status: not_implemented
refund_system_status: not_refund_system
payout_system_status: not_payout_system
marketplace_activation_status: not_activated
NFT_activation_status: not_activated
on_chain_activation_status: not_activated
implementation_plan_status: not_implementation_plan
slice_16_unblock_status: not_unblocked
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
- `docs/economy/reward_sizing_sink_pressure_modeling_v1.md`;
- `docs/economy/future_ledger_readiness_v1.md`;
- `docs/economy/tokenomics/go2asia_tokenomics_v1.md`;
- `docs/economy/vip/vip_value_system_v1.md`;
- `docs/economy/points/points_sink_design_v1.md`;
- `docs/economy/vouchers/rf_voucher_economy_v1.md`;
- `docs/architecture/domain/economy_scope_reentry_note_v1.md`;
- relevant Phase G closure documents.

If this soft policy appears to conflict with runtime-aligned policy, the runtime-aligned policy controls current runtime interpretation:

```text
runtime_policy_authority: points_policy_v1_and_referral_network_rewards_policy_v1
abuse_dispute_correction_soft_policy_authority_status: semantic_non_runtime
abuse_dispute_correction_soft_policy_replaces_runtime_policy: false
abuse_dispute_correction_soft_policy_changes_current_runtime: false
```

Current runtime interpretation must continue to follow the Runtime Alignment Note in `docs/economy/README.md`.

In particular:

```text
risk_language: semantic_review_language_only
abuse_sensitive_context: not_fraud_finding
dispute_context: not_legal_claim
correction_context: not_ledger_write_by_this_document
review_context: not_runtime_denial
fairness_language: not_legal_guarantee
```

This document does not change those facts.

## 4. Source Materials and Review Scope

This document was prepared after read-first review of the economy SSOT, runtime-aligned Points and referral policies, Layered Value Architecture, Semantic Axes of Points, Points Taxonomy v1, Reward Event Catalog v1, Reward Lifecycle / Soft Accrual Rules v1, Role-Based Rewards Matrix v1, Referral & Network Reward Model Alignment v1, RF / Voucher Reward Policy v1, Quest / Badge / Achievement Compatibility Draft v1, Reward Sizing & Sink Pressure Modeling Draft v1, Future Ledger Readiness Draft v1, Tokenomics, VIP Value System, Points Sink Design, RF Voucher Economy, Stage 6.1, and Phase G closure boundaries.

Role perspectives used for semantic review:

- Runtime Governance Architect;
- AI architect;
- AI analyst;
- AI technical writer;
- Security / Fraud & Abuse reviewer;
- Runtime Validation / QA reviewer for boundary consistency only.

Review boundary:

```text
review_type: read_only_semantic_boundary_review
artifact_scope: abuse_dispute_correction_soft_policy_semantic_only
runtime_review_status: not_performed
validation_execution_status: not_executed
evidence_collection_status: not_collected
fraud_engine_review_status: not_performed
enforcement_review_status: not_performed
implementation_tasks_status: none_implied_none_required
```

## 5. Relationship to Stage 6.1 and Phase G

This soft policy follows `docs/architecture/domain/economy_scope_reentry_note_v1.md`.

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

Abuse / Dispute / Correction Soft Policy v1 is a semantic economy artifact. It is not an authority transition, runtime transition, fraud engine activation, enforcement activation, deny behavior, fail-closed behavior, account sanction activation, automated blocking activation, ledger correction implementation, payout activation, marketplace activation, NFT activation, on-chain activation, or Slice 16 progression.

## 6. Canonical Soft Policy Model

Abuse / dispute / correction soft policy should be interpreted through the following semantic model:

```text
abuse_sensitive_or_disputed_context
-> semantic_risk_or_confusion_classification
-> explanation_boundary
-> correction_reversal_recovery_or_expiration_language_where_relevant
-> fairness_and_trust_context
-> no_runtime_enforcement_activation
```

This model describes soft policy language.

It is not:

- a runtime flow;
- a moderation flow;
- a support workflow;
- a legal workflow;
- a compliance workflow;
- a fraud scoring flow;
- an automated blocking flow;
- a ledger correction flow;
- a refund flow;
- a payout flow;
- a spend enforcement path;
- an account sanction path;
- a marketplace path;
- an NFT/on-chain path.

Canonical interpretation:

```text
soft_policy: semantic_trust_and_repair_language
abuse_sensitive: context_requiring_careful_language_not_fraud_finding
dispute: expectation_or_explanation_conflict_not_legal_claim
correction: operational_repair_language_not_reward_loop
reversal: non_punitive_unwinding_language
recovery: repair_or_explanation_context_not_compensation_program
expiration: temporal_or_relevance_boundary_not_punishment
fairness: trust_language_not_legal_guarantee
```

## 7. Soft Abuse Policy Principles

The following principles guide soft abuse / dispute / correction language.

### Principle 1 - Risk Classification Before Enforcement

Risk language should identify semantic sensitivity before any future enforcement discussion.

Boundary:

```text
risk_classification_before_enforcement
risk_classification != enforcement_activation
risk_classification != runtime_denial
```

### Principle 2 - Review Language Before Denial Language

Review language can express uncertainty, ambiguity, or need for human/contextual interpretation. It must not be used as denial behavior.

Boundary:

```text
review_language_before_denial_language
review_language != runtime_denial
review_language != automated_blocking
review_language != fail_closed_behavior
```

### Principle 3 - Semantic Sensitivity Before Runtime Sanctions

Abuse-sensitive does not mean fraudulent, account-violating, or sanctionable.

Boundary:

```text
semantic_sensitivity_before_runtime_sanctions
abuse_sensitive != fraudulent
abuse_sensitive != account_violation
abuse_sensitive != account_sanction
```

### Principle 4 - Correction Before Punishment

Correction language should emphasize operational repair, consistency, and explainability before punitive interpretation.

Boundary:

```text
correction_before_punishment
correction != punishment
correction != reward_loop
correction != payout
```

### Principle 5 - Explainability Before Opacity

Users should be able to understand why value is visible, conditional, projected, corrected, reversed, expired, or archived at a semantic level.

Boundary:

```text
explainability_before_opacity
explanation != legal_determination
explanation != admission_of_liability
```

### Principle 6 - Operational Repair Before Blame

Operational repair language should avoid blame-first framing.

Boundary:

```text
operational_repair_before_blame
recovery_context != fraud_finding
reversal_context != account_sanction
expiration_context != confiscation
```

### Principle 7 - Fairness Before Surprise Loss

Soft policy should favor clarity around visibility, conditionality, projections, and expiration to avoid surprise loss.

Boundary:

```text
clarity_before_surprise_loss
visible != spendable
projected != ledger_truth
conditional != available
fairness_language != legal_guarantee
```

## 8. Abuse-Sensitive Contexts

Abuse-sensitive contexts are semantic categories that require careful language, review sensitivity, and trust-aware explanation.

They are not fraud findings.

They are not account violations.

They are not runtime denial triggers.

Canonical semantic categories:

```text
spam_prone_activity_rewards
referral_abuse_sensitive_rewards
network_amplified_rewards
quest_farming_sensitive_rewards
voucher_abuse_sensitive_contexts
progression_prestige_manipulation_risk
correction_sensitive_values
externalization_sensitive_values
```

### Spam-Prone Activity Rewards

Spam-prone activity rewards describe activity surfaces where repetitive, low-quality, or artificially amplified behavior could distort reward meaning.

Boundary:

```text
spam_prone_activity_rewards != fraudulent_activity
spam_prone_activity_rewards != account_violation
spam_prone_activity_rewards != runtime_denial
```

### Referral-Abuse-Sensitive Rewards

Referral-abuse-sensitive rewards describe referral contexts where duplicate, self-referential, invalid, or circular relation risks require careful policy language.

Boundary:

```text
referral_abuse_sensitive_rewards != fraud_conviction
referral_abuse_sensitive_rewards != account_sanction
referral_abuse_sensitive_rewards != payout_denial_by_this_document
```

### Network-Amplified Rewards

Network-amplified rewards describe contexts where invited-user activity or network projection can multiply perceived value or create expectation disputes.

Boundary:

```text
network_amplified_rewards != passive_income
network_amplified_rewards != MLM
network_amplified_rewards != enforcement_trigger
```

### Quest-Farming-Sensitive Rewards

Quest-farming-sensitive rewards describe repetitive, scripted, or low-quality quest participation patterns where semantic care may be needed.

Boundary:

```text
quest_farming_sensitive_rewards != paid_task_fraud
quest_farming_sensitive_rewards != automated_blocking
quest_farming_sensitive_rewards != account_violation
```

### Voucher-Abuse-Sensitive Contexts

Voucher-abuse-sensitive contexts describe voucher claim, spend, redemption, offline benefit, or mismatch situations where user trust and partner context require careful explanation.

Boundary:

```text
voucher_abuse_sensitive_context != payment_fraud_finding
voucher_abuse_sensitive_context != partner_settlement_dispute
voucher_abuse_sensitive_context != payment_rejection_logic
```

### Progression / Prestige Manipulation Risk

Progression / prestige manipulation risk describes status, badge, achievement, collection, scarcity, or recognition contexts where semantic integrity matters.

Boundary:

```text
progression_prestige_manipulation_risk != financial_fraud
prestige_manipulation_risk != NFT_activation
badge_integrity_context != money_claim
```

### Correction-Sensitive Values

Correction-sensitive values describe values that may require adjustment, reversal, recovery, or support correction language.

Boundary:

```text
correction_sensitive_values != reward_loop
correction_sensitive_values != payout_program
correction_sensitive_values != admission_of_liability
```

### Externalization-Sensitive Values

Externalization-sensitive values describe future boundary contexts involving G2A, NFT/on-chain, Blockchain Gateway, treasury-sensitive, or partner/operator compensation language.

Boundary:

```text
externalization_sensitive_values != G2A_activation
externalization_sensitive_values != NFT_activation
externalization_sensitive_values != on_chain_activation
externalization_sensitive_values != payout_right
```

## 9. Dispute Language

Dispute language describes uncertainty, mismatch, expectation conflict, or user-facing confusion around reward meaning.

It is not legal claim language.

It is not payout right language.

It is not automatic correction language.

Canonical dispute contexts:

- user dispute;
- unclear reward expectation;
- missing reward claim;
- visible-but-not-spendable confusion;
- projected value dispute;
- referral unlock dispute;
- voucher spend dispute;
- quest completion dispute;
- badge visibility dispute;
- achievement recognition dispute.

### User Dispute

User dispute describes a user-facing disagreement or confusion around reward meaning, visibility, state, or expectation.

Boundary:

```text
user_dispute != legal_claim
user_dispute != payout_right
user_dispute != automatic_correction
```

### Unclear Reward Expectation

Unclear reward expectation describes ambiguity about whether an action should create value, visibility, projection, availability, or progression recognition.

Boundary:

```text
unclear_reward_expectation != guaranteed_reward
unclear_reward_expectation != ledger_truth
unclear_reward_expectation != platform_financial_obligation
```

### Missing Reward Claim

Missing reward claim describes a user expectation that value should have appeared, unlocked, or been recognized.

Boundary:

```text
missing_reward_claim != payout_claim
missing_reward_claim != admission_of_error
missing_reward_claim != automatic_grant
```

### Visible-But-Not-Spendable Confusion

Visible-but-not-spendable confusion describes misunderstanding around visible, locked, conditional, advisory, or projected value.

Boundary:

```text
visible_but_not_spendable_confusion != spend_authority
visible_value != spendable_balance
conditional_value != available_balance
```

### Projected Value Dispute

Projected value dispute describes disagreement around advisory, projected, or future-oriented value.

Boundary:

```text
projected_value_dispute != ledger_truth
projected_value_dispute != granted_reward
projected_value_dispute != payout_right
```

### Referral Unlock Dispute

Referral unlock dispute describes disagreement around conditional referral value, unlock candidate language, or available-after-valid-unlock interpretation.

Boundary:

```text
referral_unlock_dispute != commission_claim
referral_unlock_dispute != payout_claim
referral_unlock_dispute != automatic_unlock
```

### Voucher Spend Dispute

Voucher spend dispute describes disagreement around voucher claim, spend, sink, correction, recovery, or offline benefit context.

Boundary:

```text
voucher_spend_dispute != payment_settlement
voucher_spend_dispute != partner_payout
voucher_spend_dispute != platform_payment_obligation
```

### Quest / Badge / Achievement Dispute

Quest, badge, or achievement dispute describes disagreement around completion, visibility, recognition, progression, or prestige signal interpretation.

Boundary:

```text
quest_dispute != paid_task_claim
badge_dispute != money_claim
achievement_dispute != financial_obligation
```

## 10. Correction Semantics

Correction semantics describe operational adjustment, repair, consistency, recovery, or support correction language.

Canonical terms:

```text
correction
adjustment
operational_repair
consistency_repair
recovery_context
support_correction
```

### Correction

Correction describes an adjustment of value interpretation, record meaning, state meaning, or recovery semantics.

Boundary:

```text
correction != reward_loop
correction != payout
correction != admission_of_liability
```

### Adjustment

Adjustment describes a semantic change to align value interpretation with policy, context, or operational repair.

Boundary:

```text
adjustment != bonus_reward
adjustment != punishment
adjustment != financial_accounting_entry
```

### Operational Repair

Operational repair describes recovery from mismatch, partial failure, stale projection, missing explanation, or inconsistent value history.

Boundary:

```text
operational_repair != compensation_program
operational_repair != payout_obligation
operational_repair != legal_admission
```

### Consistency Repair

Consistency repair describes making value explanation internally coherent across Point class, lifecycle, origin, visibility, authority, and ownership context.

Boundary:

```text
consistency_repair != ledger_write_by_this_document
consistency_repair != schema_change
consistency_repair != runtime_reconciliation_job
```

### Recovery Context

Recovery context describes a situation where value explanation may need recovery language after mismatch or failure.

Boundary:

```text
recovery_context != payout
recovery_context != compensation_program
recovery_context != automatic_refund
```

### Support Correction

Support correction describes a user trust and explanation context, not a support ticket workflow.

Boundary:

```text
support_correction != support_ticket_system
support_correction != workflow_implementation
support_correction != legal_procedure
```

## 11. Reversal Semantics

Reversal semantics describe non-punitive unwinding, negation, cancellation, duplicate correction, or invalidated value language.

Canonical terms:

```text
reversal
duplicate_reversal
invalidated_value
cancelled_value
unwinding
```

### Reversal

Reversal means a value interpretation has been cancelled, unwound, or negated as correction language.

Boundary:

```text
reversal != fraud_conviction
reversal != punishment
reversal != account_sanction
```

### Duplicate Reversal

Duplicate reversal describes unwinding duplicate value, duplicate recognition, duplicate relation, or duplicate interpretation.

Boundary:

```text
duplicate_reversal != fraud_finding
duplicate_reversal != account_violation
duplicate_reversal != automated_blocking
```

### Invalidated Value

Invalidated value describes value whose semantic basis no longer applies or was never valid under policy language.

Boundary:

```text
invalidated_value != user_guilt
invalidated_value != punitive_confiscation
invalidated_value != legal_determination
```

### Cancelled Value

Cancelled value describes value that is no longer interpreted as active, available, or relevant.

Boundary:

```text
cancelled_value != punishment
cancelled_value != account_sanction
cancelled_value != payout_denial_by_this_document
```

### Unwinding

Unwinding describes reversing or neutralizing a value interpretation to restore consistency.

Boundary:

```text
unwinding != enforcement_action
unwinding != fraud_engine_output
unwinding != fail_closed_behavior
```

## 12. Recovery Semantics

Recovery semantics describe operational repair, explanation, or consistency context after a mismatch, failure, stale projection, or delayed value.

Canonical recovery contexts:

- failed claim recovery;
- failed spend recovery;
- voucher mismatch recovery;
- delayed reward explanation;
- stale projection recovery;
- manual review context.

### Failed Claim Recovery

Failed claim recovery describes a claim path that needs repair language after an incomplete or mismatched claim interpretation.

Boundary:

```text
failed_claim_recovery != payout
failed_claim_recovery != automatic_compensation
failed_claim_recovery != support_workflow_by_this_document
```

### Failed Spend Recovery

Failed spend recovery describes repair language around spend, sink, or consumption mismatch.

Boundary:

```text
failed_spend_recovery != payment_settlement
failed_spend_recovery != refund_system
failed_spend_recovery != ledger_correction_implementation
```

### Voucher Mismatch Recovery

Voucher mismatch recovery describes claim, spend, redemption, offline benefit, or RF lifecycle mismatch semantics.

Boundary:

```text
voucher_mismatch_recovery != partner_payout
voucher_mismatch_recovery != marketplace_settlement
voucher_mismatch_recovery != platform_financial_obligation
```

### Delayed Reward Explanation

Delayed reward explanation describes why value may not yet be visible, available, unlocked, or recognized.

Boundary:

```text
delayed_reward_explanation != guaranteed_reward
delayed_reward_explanation != admission_of_liability
delayed_reward_explanation != automatic_correction
```

### Stale Projection Recovery

Stale projection recovery describes updating or explaining advisory/projection language that is no longer current.

Boundary:

```text
stale_projection_recovery != ledger_truth
stale_projection_recovery != balance_mutation
stale_projection_recovery != payout_adjustment
```

### Manual Review Context

Manual review context describes a semantic review category.

Boundary:

```text
manual_review_context != automated_blocking
manual_review_context != account_sanction
manual_review_context != deny_behavior
```

## 13. Expiration / Archival Semantics

Expiration and archival semantics describe time, relevance, campaign, seasonality, status, or history boundaries.

Canonical terms:

```text
expired_value
campaign_window_closed
seasonal_relevance_ended
archived_history
no_longer_active_context
```

### Expired Value

Expired value describes value that has lost current relevance, eligibility, time validity, or campaign relevance.

Boundary:

```text
expired_value != punishment
expired_value != confiscation
expired_value != enforcement_activation
```

### Campaign Window Closed

Campaign window closed describes the end of a campaign-specific relevance window.

Boundary:

```text
campaign_window_closed != account_sanction
campaign_window_closed != hidden_penalty
campaign_window_closed != payout_denial
```

### Seasonal Relevance Ended

Seasonal relevance ended describes a time-bound product or progression context reaching the end of its active relevance.

Boundary:

```text
seasonal_relevance_ended != surprise_confiscation
seasonal_relevance_ended != punishment
seasonal_relevance_ended != enforcement_closure
```

### Archived History

Archived history describes historical or reference status.

Boundary:

```text
archived_history != deletion
archived_history != enforcement_closure
archived_history != evidence_bundle
```

### No Longer Active Context

No longer active context describes non-current meaning, not punitive removal.

Boundary:

```text
no_longer_active_context != account_violation
no_longer_active_context != sanction
no_longer_active_context != hidden_deny_behavior
```

## 14. Fairness / Trust Principles

Fairness and trust language should protect user understanding without creating legal guarantees.

Principles:

- clarity before surprise loss;
- visibility labels;
- explainable state;
- no hidden punitive semantics;
- no misleading projection;
- no treating ordinary users as abusers by default;
- clear distinction between projected, conditional, available, corrected, reversed, expired, and archived value;
- user trust through explanation, not through payout promises.

Boundary:

```text
fairness_language != legal_guarantee
trust_language != payout_obligation
visibility_label != spend_authority
explainable_state != legal_determination
ordinary_user != abuser_by_default
misleading_projection: forbidden
hidden_punitive_semantics: forbidden
```

Fairness language should improve clarity.

It does not create legal claim rights.

It does not create payout claims.

It does not create automatic correction rights.

It does not create spend approval.

## 15. Relationship to Points Taxonomy

This soft policy aligns with `docs/economy/points_taxonomy_v1.md`.

Relevant Point classes:

```text
Compensation / Correction Points
Conditional Referral Points
Network Activity Points
RF / Voucher-related Points
Quest / Experience Points
Progression / Prestige Signals
```

Interpretation:

- Compensation / Correction Points are operational recovery language, not gamified rewards.
- Conditional Referral Points may create disputes around visibility, locked state, or unlock expectation.
- Network Activity Points may create projection disputes and network-amplified trust risk.
- RF / Voucher-related Points may create voucher claim, spend, sink, recovery, or offline benefit mismatch context.
- Quest / Experience Points may create completion, farming sensitivity, or recognition disputes.
- Progression / Prestige Signals may create badge, achievement, visibility, collection, or manipulation sensitivity.

Boundary:

```text
correction_class != gamified_reward
risk_class != enforcement_class
conditional_referral_points != payout_claim
network_activity_points != passive_income_balance
RF_voucher_related_points != partner_settlement
quest_experience_points != paid_task_claim
progression_prestige_signals != money_claim
```

## 16. Relationship to Reward Event Catalog

This soft policy aligns with `docs/economy/reward_event_catalog_v1.md`.

Relevant event families:

```text
Compensation / Correction Events
Referral Events
Network Activity Events
RF / Voucher Events
Quest / Experience Events
Progression / Prestige Events
Sink Participation Events
Externalization-sensitive Events
```

Interpretation:

- Compensation / Correction Events describe operational correction, recovery, reversal, or reconciliation semantics.
- Referral Events may create conditional value or unlock expectation disputes.
- Network Activity Events may create projection, advisory visibility, or network pressure disputes.
- RF / Voucher Events may create voucher claim, spend, redemption, correction, or offline benefit mismatch contexts.
- Quest / Experience Events may create completion or farming sensitivity disputes.
- Progression / Prestige Events may create badge, achievement, recognition, prestige, or collection disputes.
- Externalization-sensitive Events require extra caution because they approach future G2A/NFT/on-chain boundaries.

Boundary:

```text
event_family != fraud_finding
event != enforcement_trigger
compensation_event != ordinary_reward_loop
reversal_event != punitive_enforcement
recovery_adjustment != payout_right
externalization_sensitive_event != payout_right
```

## 17. Relationship to Reward Lifecycle

This soft policy aligns with `docs/economy/reward_lifecycle_soft_accrual_rules_v1.md`.

Relevant lifecycle stages:

```text
pending
conditional
projected
corrected
reversed
expired
archived
```

Interpretation:

- Pending value may create uncertainty and requires explanation.
- Conditional value may create visible-but-not-available confusion.
- Projected value may create expectation disputes if not clearly labeled.
- Corrected value is operational repair semantics.
- Reversed value is non-punitive unwinding semantics.
- Expired value is time or relevance boundary semantics.
- Archived value is historical/reference status.

Boundary:

```text
lifecycle_stage != sanction
pending != denied
conditional != available
projected != ledger_truth
corrected != reward_loop
reversal != fraud_conviction
expiration != punishment
archived != deleted
```

## 18. Relationship to Referral / Network

This soft policy aligns with `docs/economy/referral_network_rewards_policy_v1.md` and `docs/economy/referral_network_reward_model_alignment_v1.md`.

Referral / network soft policy contexts:

- referral dispute;
- conditional referral confusion;
- `referral_locked` visibility confusion;
- projected network value dispute;
- unlock candidate disagreement;
- available-after-valid-unlock expectation;
- network manipulation sensitivity;
- invited-user activity projection confusion.

Interpretation:

```text
referral_dispute: conditional_or_unlock_expectation_context
conditional_referral_confusion: visible_but_not_available_context
projected_network_value_dispute: advisory_projection_conflict
unlock_candidate_disagreement: candidate_language_not_execution
network_manipulation_sensitivity: semantic_risk_context_not_enforcement
```

Boundary:

```text
network_abuse_sensitivity != MLM_enforcement
referral_dispute != payout_claim
referral_dispute != commission_claim
unlock_candidate_disagreement != automatic_unlock
projected_network_value_dispute != ledger_truth
network_manipulation_sensitivity != account_sanction
```

## 19. Relationship to RF / Voucher

This soft policy aligns with `docs/economy/rf_voucher_reward_policy_v1.md` and `docs/economy/vouchers/rf_voucher_economy_v1.md`.

RF / Voucher soft policy contexts:

- voucher claim mismatch;
- voucher spend correction;
- failed claim recovery;
- failed spend recovery;
- voucher redemption mismatch;
- offline benefit mismatch;
- partner context confusion;
- voucher visibility or availability confusion.

Interpretation:

```text
voucher_claim_mismatch: claim_or_consumption_explanation_context
voucher_spend_correction: Points_sink_attached_repair_language
failed_claim_recovery: operational_recovery_context
offline_benefit_mismatch: practical_utility_confusion_not_settlement
partner_context_confusion: supply_context_explanation_not_authority
```

Boundary:

```text
voucher_dispute != payment_settlement
voucher_recovery != partner_payout
offline_mismatch != platform_financial_obligation
partner_context_confusion != settlement_authority
voucher_spend_correction != refund_system
voucher_claim_mismatch != marketplace_dispute
```

## 20. Relationship to Quest / Badge / Achievement

This soft policy aligns with `docs/economy/quest_badge_achievement_compatibility_v1.md`.

Quest / Badge / Achievement soft policy contexts:

- quest completion dispute;
- quest farming sensitivity;
- quest participation ambiguity;
- badge visibility dispute;
- badge award expectation;
- achievement recognition dispute;
- progression signal confusion;
- prestige manipulation sensitivity;
- collection or scarcity expectation dispute.

Interpretation:

```text
quest_completion_dispute: experience_or_completion_explanation_context
quest_farming_sensitivity: semantic_risk_context_not_enforcement
badge_visibility_dispute: progression_signal_explanation_context
achievement_recognition_dispute: recognition_context_not_financial_claim
prestige_manipulation_sensitivity: status_integrity_language_not_sanction
```

Boundary:

```text
quest_dispute != paid_task_claim
quest_farming_sensitivity != automated_blocking
badge_dispute != money_claim
achievement_dispute != financial_obligation
prestige_manipulation_sensitivity != account_sanction
collection_dispute != marketplace_claim
```

## 21. Relationship to Reward Sizing & Sink Pressure Modeling

This soft policy aligns with `docs/economy/reward_sizing_sink_pressure_modeling_v1.md`.

Behavioral modeling can create trust-sensitive contexts:

- overpressure risk;
- forced spend risk;
- scarcity risk;
- network pressure risk;
- anti-hoarding language risk;
- VIP pressure misunderstanding;
- visible accumulation confusion;
- seasonal rarity dispute.

Interpretation:

```text
overpressure_risk: behavioral_trust_risk_not_enforcement_trigger
forced_spend_risk: user_trust_language_not_spend_command
scarcity_risk: product_pressure_language_not_speculative_asset
network_pressure_risk: passive_income_misread_risk
anti_hoarding_language_risk: utility_pacing_context_not_penalty
```

Boundary:

```text
overpressure_risk != enforcement_trigger
risk_modeling != denial_authority
forced_spend_risk != forced_spend
scarcity_risk != speculative_asset
network_pressure_risk != passive_income
anti_hoarding_language != user_penalty
```

## 22. Relationship to Future Ledger Readiness

This soft policy aligns with `docs/economy/future_ledger_readiness_v1.md`.

Future ledger or read-model vocabulary may need:

- correction context;
- reversal context;
- dispute context;
- recovery context;
- expiration context;
- archival context;
- abuse sensitivity context;
- fairness / trust explanation context.

Interpretation:

```text
correction_context: operational_repair_language
reversal_context: non_punitive_unwinding_language
dispute_context: expectation_or_explanation_conflict
recovery_context: repair_or_explanation_context
expiration_context: time_or_relevance_boundary
abuse_sensitivity_context: semantic_risk_language
```

Boundary:

```text
readiness != ledger_correction_implementation
dispute_context != legal_workflow
correction_context != accounting_entry_by_this_document
correction_context != ledger_write
reversal_context != fraud_conviction
abuse_sensitivity_context != enforcement_trigger
```

## 23. Soft Policy Interaction Patterns

These patterns are illustrative only.

They are not runtime workflows.

They are not support workflows.

They are not enforcement flows.

They are not fraud engine flows.

They are not ledger correction flows.

### Pattern 1 - Projected Network Value and User Dispute

```text
projected network value + user dispute + advisory explanation
```

Meaning:

- The user may dispute why projected network value is not available.
- The explanation should preserve `projected != ledger_truth`.
- Network utility remains participation language.

Boundary:

```text
projected_network_value != granted_reward
user_dispute != payout_right
advisory_explanation != legal_claim_resolution
pattern_1 != enforcement_flow
```

### Pattern 2 - Voucher Spend Mismatch and Recovery Context

```text
voucher spend mismatch + correction/recovery context
```

Meaning:

- Voucher claim, spend, or redemption may need repair language.
- Recovery context explains operational mismatch.
- Partner context remains outside settlement authority.

Boundary:

```text
voucher_spend_mismatch != payment_settlement
recovery_context != partner_payout
correction_context != refund_system
pattern_2 != support_workflow
```

### Pattern 3 - Referral Unlock Candidate and Conditional Value Dispute

```text
referral unlock candidate + conditional value dispute
```

Meaning:

- Unlock candidate language can be misunderstood as unlock execution.
- Conditional referral value must remain distinct from available value.

Boundary:

```text
unlock_candidate != unlock_execution
conditional_value_dispute != commission_claim
referral_dispute != payout_claim
pattern_3 != reward_producer_activation
```

### Pattern 4 - Quest Completion Dispute and Non-Paid-Task Boundary

```text
quest completion dispute + non-paid-task boundary
```

Meaning:

- Quest completion may be disputed as a recognition or experience context.
- Quest participation remains product/progression language.

Boundary:

```text
quest_completion_dispute != paid_task_claim
quest_participation != wage_semantics
quest_review_language != automated_blocking
pattern_4 != moderation_runtime
```

### Pattern 5 - Badge Visibility Dispute and Progression Signal Explanation

```text
badge visibility dispute + progression signal explanation
```

Meaning:

- Badge visibility can require explanation of recognition, progression, or archive status.
- Badge language should not become money, payout, or NFT activation.

Boundary:

```text
badge_visibility_dispute != money_claim
progression_signal != spendable_balance
badge_explanation != NFT_activation
pattern_5 != marketplace_flow
```

### Pattern 6 - Reversal and Non-Punitive Correction Context

```text
reversal + non-punitive correction context
```

Meaning:

- Reversal may explain duplicate, invalidated, cancelled, or unwound value.
- Reversal should be framed as consistency repair, not punishment.

Boundary:

```text
reversal != fraud_conviction
reversal != punishment
reversal != account_sanction
pattern_6 != enforcement_action
```

### Pattern 7 - Expiration and Seasonal Relevance Ended

```text
expiration + seasonal relevance ended + no confiscation framing
```

Meaning:

- Expiration may explain a time-limited or seasonal context ending.
- Archival may preserve history without active relevance.

Boundary:

```text
expiration != punishment
expiration != confiscation
archival != deletion
pattern_7 != fail_closed_behavior
```

## 24. Soft Policy Safety Invariants

Required safety invariants:

```text
soft_policy != fraud_engine
soft_policy != enforcement_policy
risk_classification != enforcement_activation
abuse_sensitive != fraudulent
abuse_sensitive != account_violation
dispute != legal_claim
dispute != payout_right
correction != reward_loop
correction != payout
correction != admission_of_liability
reversal != fraud_conviction
reversal != punishment
reversal != account_sanction
recovery != compensation_program
expiration != punishment
expiration != confiscation
archival != deletion
archival != enforcement_closure
fairness_language != legal_guarantee
review_language != runtime_denial
dispute_context != legal_workflow
correction_context != ledger_write
future_ledger_readiness != correction_implementation
diagnostics != authority
shadow_graph != enforcement
```

Additional anti-drift invariants:

```text
soft_policy != deny_policy
soft_policy != fail_closed_policy
soft_policy != automated_blocking_system
soft_policy != account_sanction_model
soft_policy != moderation_runtime
soft_policy != support_ticket_system
soft_policy != legal_procedure
soft_policy != compliance_procedure
soft_policy != ledger_correction_implementation
soft_policy != refund_system
soft_policy != payout_system
soft_policy != rollout_plan
soft_policy != implementation_task_list
soft_policy != slice_16_unblock
```

## 25. Forbidden Interpretations

Forbidden interpretations:

- soft policy activates fraud engine;
- soft policy activates enforcement;
- abuse-sensitive means fraudulent;
- risk tag creates denial;
- dispute creates payout right;
- correction creates reward loop;
- correction creates admission of liability;
- reversal becomes fraud conviction;
- reversal becomes punishment;
- expiration becomes confiscation;
- archival becomes deletion;
- review language becomes automated blocking;
- voucher dispute becomes partner settlement;
- referral dispute becomes commission claim;
- quest dispute becomes paid labor claim;
- badge dispute becomes money claim;
- future ledger readiness becomes correction implementation;
- soft policy creates implementation tasks;
- soft policy unblocks Slice 16.

Forbidden interpretation classification:

```text
implicit_fraud_engine_activation: forbidden
implicit_enforcement_activation: forbidden
implicit_fraud_finding: forbidden
implicit_runtime_denial: forbidden
implicit_payout_right: forbidden
implicit_reward_loop: forbidden
implicit_admission_of_liability: forbidden
implicit_fraud_conviction: forbidden
implicit_punishment: forbidden
implicit_confiscation: forbidden
implicit_deletion: forbidden
implicit_automated_blocking: forbidden
implicit_partner_settlement: forbidden
implicit_commission_claim: forbidden
implicit_paid_labor_claim: forbidden
implicit_money_claim: forbidden
implicit_correction_implementation: forbidden
implicit_implementation_tasks: forbidden
implicit_slice_16_unblock: forbidden
```

## 26. Relationship to Existing Economy SSOT

This document does not replace existing economy SSOT.

Relationship map:

```text
README.md -> economy entry point
points_policy_v1.md -> runtime-aligned Points policy
referral_network_rewards_policy_v1.md -> runtime-aligned referral/network policy
reward_event_catalog_v1.md -> event semantics
points_taxonomy_v1.md -> Point taxonomy
semantic_axes_of_points_v1.md -> coordinate system
layered_value_architecture_v1.md -> value topology
reward_lifecycle_soft_accrual_rules_v1.md -> lifecycle semantics
role_based_rewards_matrix_v1.md -> role participation semantics
referral_network_reward_model_alignment_v1.md -> referral/network semantic alignment
rf_voucher_reward_policy_v1.md -> RF/Voucher utility policy
quest_badge_achievement_compatibility_v1.md -> progression/prestige compatibility layer
reward_sizing_sink_pressure_modeling_v1.md -> behavioral-economic modeling draft
future_ledger_readiness_v1.md -> future ledger readiness draft
tokenomics/go2asia_tokenomics_v1.md -> full economy model
vip/vip_value_system_v1.md -> behavioral VIP model
points/points_sink_design_v1.md -> sink model
vouchers/rf_voucher_economy_v1.md -> voucher economy model
```

Interpretation:

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
- `docs/economy/rf_voucher_reward_policy_v1.md` remains RF/Voucher utility policy.
- `docs/economy/quest_badge_achievement_compatibility_v1.md` remains progression/prestige compatibility layer.
- `docs/economy/reward_sizing_sink_pressure_modeling_v1.md` remains behavioral-economic modeling draft.
- `docs/economy/future_ledger_readiness_v1.md` remains future ledger readiness draft.
- `docs/economy/tokenomics/go2asia_tokenomics_v1.md` remains the full economy model.
- `docs/economy/vip/vip_value_system_v1.md` remains the behavioral VIP model.
- `docs/economy/points/points_sink_design_v1.md` remains the sink model.
- `docs/economy/vouchers/rf_voucher_economy_v1.md` remains the voucher economy model.

SSOT boundary:

```text
abuse_dispute_correction_soft_policy_replaces_existing_SSOT: false
abuse_dispute_correction_soft_policy_changes_runtime_policy: false
abuse_dispute_correction_soft_policy_changes_referral_policy: false
abuse_dispute_correction_soft_policy_changes_points_policy: false
abuse_dispute_correction_soft_policy_changes_voucher_policy: false
abuse_dispute_correction_soft_policy_changes_future_ledger_readiness: false
abuse_dispute_correction_soft_policy_changes_tokenomics: false
```

## 27. Runtime / QA Boundary

This document has no runtime validation scope.

Runtime / QA boundary:

```text
tests_required: false
tests_executed: false
evidence_required: false
evidence_collected: false
runtime_validation_required: false
runtime_validation_executed: false
implementation_tasks: none
rollout_required: false
production_activation: false
fraud_engine_activation: false
enforcement_activation: false
automated_blocking_activation: false
account_sanction_activation: false
ledger_correction_implementation: false
ledger_activation: false
reward_producer_activation: false
accrual_pipeline_activation: false
spend_enforcement_activation: false
payout_activation: false
NFT_activation: false
on_chain_activation: false
marketplace_activation: false
```

This document does not require:

- tests;
- evidence;
- runtime validation;
- implementation tasks;
- rollout;
- production activation;
- fraud engine activation;
- enforcement activation;
- automated blocking activation;
- account sanction activation;
- ledger correction implementation;
- reward producer activation;
- accrual pipeline activation;
- spend enforcement activation;
- payout activation;
- NFT/on-chain activation;
- marketplace activation.

Runtime Validation / QA review is boundary consistency review only.

It is not test execution, evidence collection, QA acceptance, fraud engine approval, enforcement approval, operational readiness, rollout approval, or production activation.

## 28. Closure Statement

Abuse / Dispute / Correction Soft Policy v1 prepares semantic language for trust, fairness, dispute explanation, abuse-sensitive contexts, correction, reversal, recovery, expiration, and archival.

It preserves:

- abuse-sensitive context language;
- dispute language;
- correction semantics;
- reversal semantics;
- recovery semantics;
- expiration and archival semantics;
- fairness and trust principles;
- relationship to Point classes;
- relationship to event families;
- relationship to lifecycle stages;
- relationship to referral/network, RF/Voucher, quest/badge/achievement, reward sizing, and future ledger readiness;
- strict separation from fraud engines, enforcement, sanctions, denial, automated blocking, legal workflows, support workflows, ledger correction implementation, and payout.

It does not activate a fraud engine.

It does not activate enforcement.

It does not create deny or fail-closed behavior.

It does not create account sanctions.

It does not create automated blocking.

It does not create moderation runtime.

It does not create dispute resolution workflow.

It does not create legal or compliance procedure.

It does not implement ledger correction.

It does not activate reward producers.

It does not activate accrual pipelines.

It does not activate spend enforcement.

It does not activate payout.

It does not activate marketplace.

It does not activate NFT/on-chain behavior.

It does not unblock Slice 16.

Closure classification:

```text
stage_6_11_status: semantic_abuse_dispute_correction_soft_policy_complete
runtime_change_status: none
fraud_engine_activation_status: not_activated
enforcement_activation_status: not_activated
automated_blocking_status: not_activated
account_sanction_status: not_activated
ledger_correction_implementation_status: not_implemented
execution_authorization_status: not_authorized
slice_16_status: blocked_not_triggered
```
