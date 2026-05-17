# Layered Value Architecture of Go2Asia v1

Date: 2026-05-17  
Status: `NOTE_READY_LAYERED_VALUE_ARCHITECTURE_DOCS_ONLY`  
Mode: semantic economy architecture, explanatory value topology, docs-only, read-only reference, no runtime changes, no migrations, no API changes, no feature flags, no implementation changes, no ledger activation, no G2A activation, no NFT or on-chain activation, no PRO payout activation, no partner settlement activation, no enforcement authority, no Slice 16 unblock, no rollout strategy, no implementation plan, no operational authorization

## 1. Purpose

This document formalizes the Layered Value Architecture of Go2Asia.

It explains how the existing economy concepts fit together as a multi-layer movement of value:

```text
Attention -> Points -> VIP -> Consumption -> NFT / Progression -> Operator Layer -> Externalized Value
```

This is a semantic and explanatory economy layer. It does not replace existing economy SSOT documents and does not define new runtime rules.

## 2. Main Thesis

Go2Asia is not a single-token economy.

Go2Asia is a layered value ecosystem.

Points, VIP, vouchers, NFT, PRO, partners, and G2A are not competing currencies. They are different layers in the movement of value:

- attention becomes internal utility;
- internal utility creates VIP pressure;
- VIP activates accumulated value;
- activated value becomes practical consumption;
- consumption and progression create status and long-term retention;
- operators and partners create supply density;
- only controlled future layers may externalize value.

Core thesis:

```text
single_token_economy: false
layered_value_ecosystem: true
points_vip_vouchers_nft_pro_partners_g2a: complementary_value_layers
```

## 3. Scope Boundary

This document explains value topology.

It does not create:

- new economy rules;
- runtime behavior;
- ledger activation;
- G2A activation;
- NFT or on-chain activation;
- PRO payout activation;
- partner settlement activation;
- enforcement authority;
- Slice 16 readiness;
- API changes;
- migrations;
- feature flags;
- implementation changes.

Boundary:

```text
document_type: explanatory_semantic_economy_architecture
document_mode: docs_only
runtime_status: unchanged
authority_status: non_authoritative
```

## 4. Relationship to Stage 6.1 and Phase G

This document follows `docs/architecture/domain/economy_scope_reentry_note_v1.md`.

It preserves the Stage 6.1 doctrine:

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

Layered value architecture is not an authority transition. It is not a runtime transition. It is not Slice 16 progression.

## 5. Level Overview

The Go2Asia value stack has seven explanatory levels.

```text
LEVEL 0: Attention & Presence Layer
LEVEL 1: Internal Utility Layer
LEVEL 2: Economic Activation Layer
LEVEL 3: Consumption & Experience Layer
LEVEL 4: Progression & Prestige Layer
LEVEL 5: Operator & Ecosystem Layer
LEVEL 6: Externalized Value Layer
```

These levels describe how value is created, accumulated, activated, consumed, progressed, operated, and optionally externalized.

They are not release phases. They are not implementation milestones. They are not enforcement stages.

## 6. LEVEL 0 - Attention & Presence Layer

The Attention & Presence Layer is where raw ecosystem value begins.

It includes:

- Space Asia;
- posts;
- likes;
- comments;
- social graph;
- engagement signals;
- local presence;
- user-generated travel and city context.

At this level, value is not yet a currency, ledger balance, entitlement, payout, or claim.

It is attention, contribution, activity, and presence.

Semantic role:

```text
level_0_value_type: attention_presence_engagement
economic_form: pre_points_signal
authority_status: non_authoritative
```

The purpose of Level 0 is to create the raw signals that can later be interpreted by the internal utility economy.

## 7. LEVEL 1 - Internal Utility Layer

The Internal Utility Layer is where participation becomes Points.

Points are the internal off-chain utility value of Go2Asia. They represent accumulated ecosystem participation, activity, and future utility potential.

Points can be discussed as:

- earned;
- locked;
- available;
- network-generated;
- spent;
- burned;
- compensated or corrected where separately defined by policy.

Points are accumulated utility value.

Points are not money.

Points are not:

- cash;
- payout;
- commission;
- investment product;
- external token;
- G2A;
- NFT;
- on-chain asset;
- partner settlement;
- PRO payout.

Semantic role:

```text
level_1_value_type: internal_utility
primary_unit: Points
points_are_money: false
points_are_g2a: false
points_are_nft: false
points_are_payout: false
```

Runtime interpretation remains governed by `docs/economy/points_policy_v1.md` and `docs/economy/referral_network_rewards_policy_v1.md`.

## 8. LEVEL 2 - Economic Activation Layer

The Economic Activation Layer is VIP.

VIP is not a pure paywall.

VIP is the activation layer that turns accumulated internal utility into usable economic opportunity.

VIP activates:

- spend;
- unlock;
- network participation;
- premium access;
- stronger consumption surfaces;
- status and retention loops.

VIP is the key that makes accumulated Points useful.

Semantic role:

```text
level_2_value_type: economic_activation
activation_layer: VIP
vip_is_pure_paywall: false
vip_is_activation_layer: true
```

The behavioral VIP model remains governed by `docs/economy/vip/vip_value_system_v1.md`. Runtime-aligned Points and referral interpretation remains governed by the runtime-aligned policy documents.

## 9. LEVEL 3 - Consumption & Experience Layer

The Consumption & Experience Layer is where activated value becomes practical benefit.

It includes:

- vouchers;
- premium vouchers;
- quests;
- practical utility;
- offline benefit;
- burn;
- sink;
- redemption;
- real-world experience.

Vouchers are the primary consumption interface of the Go2Asia economy.

They are not the same thing as payment for the underlying service. The underlying offline product or service can remain outside the platform economy and be handled directly by the partner or operator where applicable.

Semantic role:

```text
level_3_value_type: consumption_experience
primary_interface: vouchers
vouchers_are_consumption_interface: true
vouchers_are_partner_payment_settlement: false
```

Voucher economy remains governed by `docs/economy/vouchers/rf_voucher_economy_v1.md`. Points sink semantics remain governed by `docs/economy/points/points_sink_design_v1.md` and runtime-aligned Points policy.

## 10. LEVEL 4 - Progression & Prestige Layer

The Progression & Prestige Layer converts repeated participation and consumption into long-term identity, scarcity, and status.

It includes:

- NFT badges;
- trophies;
- relics;
- achievements;
- premium gates;
- status;
- long-term progression;
- collectible milestones.

NFT in this architecture is not everyday currency.

NFT is a progression, prestige, scarcity, and possible future gate layer. NFT may also be a future bridge to on-chain representation only when separately implemented and authorized by separate policy and runtime contracts.

Semantic role:

```text
level_4_value_type: progression_prestige
nft_role: status_gate_progression_scarcity
nft_is_everyday_currency: false
nft_on_chain_activation_status: not_activated_by_this_document
```

Any NFT/Totem gate, NFT mint, NFT burn, NFT upgrade, or on-chain withdrawal remains future/target unless separately implemented.

## 11. LEVEL 5 - Operator & Ecosystem Layer

The Operator & Ecosystem Layer is where local supply, expertise, partner relationships, and city expansion become part of the economy.

It includes:

- PRO;
- RF partners;
- partner onboarding;
- quests;
- local expertise;
- supply density;
- city expansion;
- offer creation;
- practical fulfillment capacity.

PRO is the operator layer.

RF is the practical utility and partner layer.

Partners are the supply layer that makes VIP and vouchers meaningful in a real city.

Semantic role:

```text
level_5_value_type: operator_ecosystem
pro_role: operator_layer
rf_role: practical_utility_partner_layer
partner_role: local_supply_density
```

This document does not activate PRO payouts, partner settlement, revenue share, or commission mechanics.

## 12. LEVEL 6 - Externalized Value Layer

The Externalized Value Layer is the controlled future boundary where selected internal value may become external bridge value.

It includes:

- G2A;
- on-chain NFT;
- Blockchain Gateway;
- rare value;
- treasury-sensitive value;
- external bridge value;
- future operator or partner compensation concepts.

G2A is not the internal mass currency.

G2A is not a default reward for every user action.

G2A belongs to a rare, controlled, treasury-sensitive, future external contour.

Semantic role:

```text
level_6_value_type: externalized_value
g2a_is_internal_mass_currency: false
external_bridge_status: controlled_future_layer
g2a_activation_status: not_activated_by_this_document
blockchain_gateway_activation_status: not_activated_by_this_document
```

Internal value may become externalized value only through controlled future layers with separate policy, implementation, runtime contracts, treasury review, security review, and governance approval where required.

## 13. Value Transition Map

The core movement of value is:

```text
Attention -> Points
Points -> VIP Pressure
VIP -> Spend Activation
Spend -> Offline Benefit
Offline Benefit -> Retention
Progression -> NFT / Prestige
Operator Activity -> G2A / Ecosystem Growth
Internal Value -> Externalized Value only through controlled future layers
```

Expanded interpretation:

- Attention becomes Points when participation is recognized as internal utility.
- Points create VIP Pressure because accumulated value wants activation.
- VIP activates spend, unlock, network, premium access, and practical utility.
- Spend creates offline benefit through vouchers, quests, and partner experiences.
- Offline benefit creates retention because the economy becomes useful in real life.
- Progression creates NFT / Prestige when repeated participation becomes status or scarcity.
- Operator activity creates ecosystem growth by improving supply density, partner coverage, and city value.
- Internal value can externalize only through controlled future layers such as G2A, on-chain NFT, or Blockchain Gateway, and only if separately implemented and authorized.

## 14. Layer Interaction Summary

```text
LEVEL 0 -> creates attention and participation signals
LEVEL 1 -> converts participation into internal utility
LEVEL 2 -> activates accumulated utility through VIP
LEVEL 3 -> turns activated utility into consumption and experience
LEVEL 4 -> turns repeated value into progression and prestige
LEVEL 5 -> supplies operators, partners, quests, and city density
LEVEL 6 -> externalizes selected value through controlled future layers
```

This is value topology, not runtime topology.

The levels explain what each economy concept is for. They do not define service boundaries, database schema, API behavior, feature flags, or enforcement logic.

## 15. Core Boundaries

Required boundaries:

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

Additional semantic boundaries:

```text
visible_value != spendable_balance
projections != ledger_truth
semantic_architecture != runtime_authorization
layered_value_architecture != new_economy_rules
externalized_value_layer != g2a_activation
progression_layer != nft_on_chain_activation
operator_layer != pro_payout_activation
partner_layer != partner_settlement_activation
```

## 16. Runtime Boundaries Preserved

This document preserves current runtime boundaries.

It explicitly states:

- this is semantic / explanatory economy architecture;
- this is not runtime implementation;
- this is not ledger activation;
- this is not G2A activation;
- this is not NFT/on-chain activation;
- this is not PRO payout activation;
- this is not partner settlement activation;
- this is not enforcement authority;
- this does not unblock Slice 16.

Runtime boundary status:

```text
runtime_changes_added: no
migrations_added: no
api_changes_added: no
feature_flags_added: no
implementation_changes_added: no
ledger_activation_status: not_activated
g2a_activation_status: not_activated
nft_on_chain_activation_status: not_activated
pro_payout_activation_status: not_activated
partner_settlement_activation_status: not_activated
enforcement_authority_status: not_created
slice_16_status: blocked_not_triggered
```

## 17. Relationship to Existing Economy SSOT

This document does not replace existing Economy SSOT documents.

Relationship:

- `docs/economy/README.md` remains the entry point for the economy layer.
- `docs/economy/points_policy_v1.md` remains the runtime-aligned Points policy.
- `docs/economy/referral_network_rewards_policy_v1.md` remains the referral and network rewards policy.
- `docs/economy/tokenomics/go2asia_tokenomics_v1.md` remains the full economy model.
- `docs/economy/vip/vip_value_system_v1.md` remains the behavioral VIP model.
- `docs/economy/points/points_sink_design_v1.md` remains the anti-inflation and sink model.
- `docs/economy/vouchers/rf_voucher_economy_v1.md` remains the voucher consumption model.

Layered Value Architecture explains how these documents relate to each other at the level of value topology.

SSOT boundary:

```text
layered_value_architecture_role: explanatory_topology
readme_role: economy_entry_point
points_policy_role: runtime_aligned_points_policy
referral_policy_role: referral_network_policy
tokenomics_role: full_economy_model
vip_value_system_role: behavioral_vip_model
points_sink_design_role: anti_inflation_sink_model
rf_voucher_economy_role: voucher_consumption_model
```

If this document appears to conflict with a runtime-aligned policy, the runtime-aligned policy controls runtime interpretation.

## 18. Source-of-Truth Ownership Reminder

This document does not reassign ownership.

Current semantic ownership remains:

- Points policy defines Points meaning, availability, and runtime-aligned interpretation.
- Referral and network rewards policy defines referral and network reward semantics.
- Tokenomics defines the full economy model.
- VIP Value System defines VIP as behavioral activation.
- Points Sink Design defines target sink and anti-inflation mechanics.
- RF Voucher Economy defines the voucher consumption model.
- Stage 6.1 re-entry note defines the soft-economy / enforcement boundary after Phase G.

This document is an explanatory map across those sources.

## 19. Forbidden Interpretations

The following interpretations are forbidden:

- Layered Value Architecture creates new economy rules.
- Layered Value Architecture overrides runtime-aligned policies.
- G2A is active for all users.
- NFT gates are active unless separately implemented.
- PRO payouts are active unless separately implemented.
- Partner settlements are active unless separately implemented.
- Points are financial obligations.
- Points are money.
- Points are payout claims.
- Visible value is spendable balance.
- Locked value is automatically available.
- Network value is guaranteed financial income.
- Projections are ledger truth.
- Semantic architecture authorizes runtime changes.
- Layer levels are release stages.
- Layer levels are enforcement stages.
- Externalized Value Layer means current Blockchain Gateway activation.
- Progression & Prestige Layer means current NFT/on-chain activation.
- Operator & Ecosystem Layer means active PRO payout or partner settlement.
- Relationship to existing SSOT means replacing existing SSOT.
- This document unblocks Slice 16.

Forbidden interpretation status:

```text
implicit_runtime_authorization: forbidden
implicit_ledger_activation: forbidden
implicit_g2a_activation: forbidden
implicit_nft_activation: forbidden
implicit_payout_activation: forbidden
implicit_partner_settlement_activation: forbidden
implicit_slice_16_unblock: forbidden
```

## 20. Safe Reading Rules

Read this document as:

- a map of value movement;
- a semantic explanation of layers;
- a topology connecting existing economy documents;
- a guardrail against single-token simplification;
- a docs-only reference for future economy discussions.

Do not read this document as:

- implementation instruction;
- runtime roadmap;
- migration plan;
- API contract;
- ledger contract;
- treasury approval;
- blockchain activation;
- partner settlement plan;
- PRO payout plan;
- enforcement approval;
- Slice 16 readiness review.

## 21. Final Classification

```text
document_type: layered_value_architecture
document_mode: docs_only
semantic_scope: explanatory_economy_topology
runtime_changes_added: no
migrations_added: no
api_changes_added: no
feature_flags_added: no
implementation_changes_added: no
ledger_activation_added: no
g2a_activation_added: no
nft_on_chain_activation_added: no
pro_payout_activation_added: no
partner_settlement_activation_added: no
enforcement_authority_added: no
slice_16_unblocked: no
replaces_economy_readme: no
replaces_points_policy: no
replaces_referral_policy: no
replaces_tokenomics: no
replaces_vip_value_system: no
replaces_points_sink_design: no
replaces_rf_voucher_economy: no
final_verdict: layered_value_architecture_explains_go2asia_as_layered_value_ecosystem_without_creating_runtime_rules_activation_enforcement_or_ssot_replacement
```
