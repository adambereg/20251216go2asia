# Stage 7.3 Module Alignment Re-Entry Plan v1

Date: 2026-05-18
Status: `READY_FOR_MODULE_ALIGNMENT_SEQUENCE`
Stage: `Stage 7.3 / Module Alignment Re-Entry Plan / Governance Freeze Closure`
Mode: read-only module re-entry planning, governance freeze closure, docs-only, no implementation, no staging execution, no API calls, no DB access, no diagnostics retrieval, no log retrieval, no tests added, no code changes, no module rewrite, no frontend redesign, no economy redesign, no runtime activation, no token/G2A/NFT/wallet activation, no payout/settlement/cashback activation, no Slice 16 movement

Companion closure artifact:

- `docs/runtime/stage_7_2_governance_freeze_closure_v1.md`

Primary sources:

- `docs/economy/points_policy_v1.md`
- `docs/economy/referral_network_rewards_policy_v1.md`
- `docs/economy/economy_authority_terminology_crosswalk_v1.md`
- `docs/architecture/domain/economy_scope_reentry_note_v1.md`
- `docs/runtime/rf_runtime_readiness_evidence_pack_v1.md`
- `docs/runtime/rf_claim_paid_spend_redeem_staging_evidence_v1.md`
- `docs/runtime/rf_staging_runtime_evidence_bundle_v1.md`
- `docs/runtime/rf_staging_approval_framework_v1.md`
- `docs/runtime/rf_safe_actor_registry_template_v1.md`
- `docs/runtime/rf_staging_evidence_approval_packet_v1.md`
- `docs/runtime/rf_safe_actor_registry_instance_draft_v1.md`
- `docs/architecture/platform/go2asia_backend_services_architecture_v2.md`
- `docs/architecture/platform/go2asia_interface_architecture_v2.md`
- `docs/architecture/platform/go2asia_attribution_architecture_map_v1.md`
- `docs/architecture/domain/rf-asia-domain-readiness-v1.md`
- `docs/architecture/domain/rf-asia-implementation-sequencing-v1.md`
- `docs/modules/rf_partners/`
- `docs/modules/connect/`
- `docs/modules/quest/`
- `docs/modules/rielt/`
- `docs/modules/space/`

## 1. Purpose

This document defines the module re-entry plan after Stage 7.2 governance freeze.

It answers:

- which module areas must now align with the economy/governance canon;
- which modules are runtime-backed, projection-backed, mock/local, or future-only;
- which modules are most blocked by semantic or runtime-authority mismatch;
- which modules are safe for near-term bounded work;
- which module slice should come next;
- how to prevent both governance recursion and premature runtime activation.

This plan is not implementation authorization. It does not open a staging window, change code, add tests, alter contracts, redesign UI, or activate any runtime economy behavior.

## 2. Context

The project has completed a long stabilization path:

- Stage 6: Points / rewards policy draft;
- Stage 6.5: economy/system alignment and frontend semantic remediation;
- Stage 7.0: RF runtime re-entry planning;
- Stage 7.1: RF runtime readiness and evidence pack;
- Stage 7.2: local existing-test evidence report;
- Stage 7.2b: blocked staging evidence collection window;
- Stage 7.2c: staging approval and safe actor registry framework;
- Stage 7.2d: concrete RF staging evidence approval packet draft and safe actor registry instance draft.

The current owner decision is:

```text
option: B
decision: freeze_governance_layer
reason: governance_is_sufficient_for_future_window_but_operational_setup_is_not_ready
module_reentry: required
```

The practical consequence is that module work can resume only under bounded alignment slices. The modules must catch up to the established economy/runtime doctrine before new runtime expansion.

## 3. Re-Entry Principles

Module re-entry must follow these principles:

```text
module_alignment_before_runtime_expansion
contract_before_implementation
backend_truth_before_frontend_claim
projection_is_not_authority
local_storage_is_not_reward_proof
attribution_is_not_commission
voucher_utility_is_not_cashback
points_visibility_is_not_spendability
future_token_language_is_not_activation
```

Practical rules:

- Start with modules that already have the strongest runtime/governance evidence and highest cross-module dependency.
- Keep each slice bounded to one primary risk.
- Prefer docs/module alignment before backend implementation if current module docs still contain target, legacy or unsafe wording.
- Do not use Stage 7.2 governance freeze as a runtime approval.
- Do not create new governance frameworks unless a concrete module gap cannot be handled by existing docs.
- Do not let frontend surfaces imply ledger truth, wallet behavior, payout, token liquidity or NFT ownership.

## 4. Module Alignment Map

### 4.1 RF / Vouchers

| Field | Assessment |
|---|---|
| Current status | Strongest runtime-adjacent domain. RF claim, listing claim, paid spend coupling, compensation and redeem have local existing-test evidence; live staging evidence remains deferred. |
| Known artifacts | `rf_runtime_readiness_evidence_pack_v1.md`, `rf_claim_paid_spend_redeem_staging_evidence_v1.md`, `rf-asia-domain-readiness-v1.md`, `rf-asia-implementation-sequencing-v1.md`, `docs/modules/rf_partners/`. |
| Runtime-backed vs projection/future | Partner/offer/voucher claim/redeem surfaces are runtime-backed or partially runtime-backed. Premium unlock, NFT/Totem, G2A, payout/settlement and full partner reward policy are future/target unless separately approved. |
| Alignment level | Highest relative maturity, but still needs contract-level module alignment before next implementation. |
| Semantic drift risk | Medium/high: voucher utility can drift into cashback/settlement; PRO attribution can drift into commission/payout. |
| Runtime risk | High: claim/redeem/idempotency/paid spend/recovery affect durable objects and Points coupling. |
| Frontend risk | Medium: voucher status and utility must not be framed as financial value or payout. |
| Dependencies | Points Service, Connect projection, Rielt listing context, PRO attribution, API Gateway trust. |
| Recommended next action | First module slice: RF/Voucher lifecycle baseline alignment, contract-only or docs-first, focused on Partner/Offer/Voucher/Redemption/UserVoucherState boundaries. |

### 4.2 Connect / Projection

| Field | Assessment |
|---|---|
| Current status | User-facing interpretation and aggregation layer. It is a read-only projection surface, not a backend economy owner. |
| Known artifacts | `docs/modules/connect/`, `go2asia_interface_architecture_v2.md`, Stage 6.5 frontend semantic remediation, economy crosswalk. |
| Runtime-backed vs projection/future | Connect displays backend-owned facts and summaries where available. Wallet, G2A, NFT marketplace, token cabinet and payout semantics are future-only/prohibited. |
| Alignment level | Semantically improved, but high vigilance required because user-facing projection can look authoritative. |
| Semantic drift risk | High: balance/wallet/projection wording can imply ledger truth or spendability. |
| Runtime risk | Medium: lower if read-only, high if Connect starts writing or deciding economy state. |
| Frontend risk | High: product ontology lives in Connect UI. |
| Dependencies | Points, Referral, RF, Quest, badges/progression, frontend shell. |
| Recommended next action | After RF baseline, run Connect projection boundary alignment: document source ownership, stale/error states and safe copy for Points/referral/RF/Quest summaries. |

### 4.3 Quest / Badges / Achievements

| Field | Assessment |
|---|---|
| Current status | Product/module docs describe Quest as gamified participation layer. Stage 7 evidence pack flags Quest completion localStorage/mock authority as a blocker for reward runtime claims. |
| Known artifacts | `docs/modules/quest/`, frontend Quest surfaces, Stage 7 evidence blocker `QUEST-BLOCKER-001`. |
| Runtime-backed vs projection/future | Quest module has domain model/runtime concepts, but current completion/reward UI must not be treated as reward authority if localStorage/mock-backed. NFT is future-only; off-chain badges are safe only where backend-backed. |
| Alignment level | Medium/low for reward authority; better for product framing after Stage 6.5. |
| Semantic drift risk | High: rewards, badges and completion can imply Points grants or NFT ownership. |
| Runtime risk | High if completion/proof triggers rewards without backend authority. |
| Frontend risk | High due to local completion UX and reward cards. |
| Dependencies | Quest Service, Points Service, Connect projection, Space/Atlas/RF references. |
| Recommended next action | Run a Quest authority alignment slice before any reward implementation: separate local UX completion from backend-owned proof/completion/reward eligibility. |

### 4.4 PRO Attribution

| Field | Assessment |
|---|---|
| Current status | RF has the strongest concrete attribution anchor; platform attribution map defines attribution as factual provenance, not economy. |
| Known artifacts | `go2asia_attribution_architecture_map_v1.md`, RF attribution sections, `rf-asia-domain-readiness-v1.md`. |
| Runtime-backed vs projection/future | RF voucher attribution is implemented/partially implemented as durable provenance. Ecosystem-wide attribution service is not current runtime. PRO rewards/payouts are future-only and prohibited as current interpretation. |
| Alignment level | Medium/high as canon; implementation maturity varies by module. |
| Semantic drift risk | High: attribution can drift into commission, payout entitlement or MLM. |
| Runtime risk | High if mutable attribution changes durable voucher facts after claim. |
| Frontend risk | Medium/high for PRO dashboards and contribution summaries. |
| Dependencies | RF, Rielt, Quest, Referral Service, Connect projections, public `shareCode` identity. |
| Recommended next action | Keep PRO Attribution as part of RF baseline first; defer broader cross-module attribution runtime until RF/Rielt/Quest durable actions are stable. |

### 4.5 Rielt / Realty Integration

| Field | Assessment |
|---|---|
| Current status | Product vision exists; RF/Rielt listing-scoped voucher integration is a practical business flow. Some module docs still contain older reward/referral/tokenomics phrasing that must be read through the crosswalk. |
| Known artifacts | `docs/modules/rielt/`, `rf-asia-domain-readiness-v1.md`, `rf-asia-implementation-sequencing-v1.md`, attribution map. |
| Runtime-backed vs projection/future | Rielt listings/inquiries are Rielt-owned. RF listing-scoped voucher claim is RF-owned. Referral bonuses/tokenomics are not current authority. |
| Alignment level | Medium/low: needs terminology and ownership alignment before expanding integration. |
| Semantic drift risk | Medium/high: realty flows can drift into financial/investment/reward claims. |
| Runtime risk | Medium/high if listing, inquiry and voucher ownership are conflated. |
| Frontend risk | Medium: listing CTA must not imply booking, payment, cashback or settlement. |
| Dependencies | Rielt listing model, RF vouchers/offers, Connect projection, PRO attribution. |
| Recommended next action | After RF lifecycle baseline, align RF/Rielt listing-scoped voucher boundary as a dedicated slice. |

### 4.6 Points / Activity Projections

| Field | Assessment |
|---|---|
| Current status | Points policy is Tier 1 authority. Points are internal off-chain utility, not money. `referral_locked` exists; full unlock/network accrual and hard available-only enforcement are not fully current runtime. |
| Known artifacts | `points_policy_v1.md`, `referral_network_rewards_policy_v1.md`, Points service tests referenced in Stage 7.2. |
| Runtime-backed vs projection/future | Points ledger/balances are Points-owned where runtime-backed. Wallet buckets and Connect summaries are projections. G2A/token/NFT/on-chain are future-only. |
| Alignment level | High at doctrine level, medium at runtime enforcement level. |
| Semantic drift risk | High: visible/available/spendable/payout language can easily drift. |
| Runtime risk | Critical if spendability, ledger ownership or hard locks are changed. |
| Frontend risk | High in any balance-like UI. |
| Dependencies | Points Service, Referral Service, RF paid spend, Connect UI, Quest reward eligibility. |
| Recommended next action | Do not start with Points implementation. Keep Points as doctrine and dependency; revisit after RF lifecycle and Connect projection boundaries are aligned. |

### 4.7 Frontend Module Surfaces

| Field | Assessment |
|---|---|
| Current status | Stage 6.5.5 remediated many high-risk UI copy surfaces. Frontend remains the place where product ontology can drift fastest. |
| Known artifacts | `apps/go2asia-pwa-shell/**`, module docs, interface architecture, Stage 6.5 frontend remediation. |
| Runtime-backed vs projection/future | Mixed: some surfaces are backend-backed, some are mock/prototype/local. UI must clearly distinguish runtime-backed facts from local summaries and future placeholders. |
| Alignment level | Improved but module-specific review remains necessary. |
| Semantic drift risk | High: labels, icons, CTAs and empty states can imply wallet, payout, reward authority or NFT ownership. |
| Runtime risk | Low if display-only, high if UI initiates mutable economy actions without contract. |
| Frontend risk | High by definition. |
| Dependencies | All modules, especially Connect, Quest, RF and Points. |
| Recommended next action | Do frontend alignment per module, not as a broad redesign. First attach frontend semantics to the RF/Voucher lifecycle baseline and Connect projection boundaries. |

### 4.8 Scope-Out Note: Space / Atlas / Guru / Pulse / Blog

Space, Atlas, Guru, Pulse and Blog are present in `docs/modules/` and may produce activity, content, social or discovery signals that later interact with Points, Quest, Connect or attribution.

They are not primary Stage 7.3 re-entry modules because this plan is limited to economy-adjacent RF, voucher, projection, Quest, attribution, Rielt and Points surfaces.

Current reading for these modules:

- Space remains a social/content surface, not wallet, payout, token, NFT marketplace or reward authority.
- Atlas, Guru, Pulse and Blog remain discovery/content/event surfaces unless a separate durable action contract promotes a specific flow.
- Any future Points, badge, mission or attribution language from these modules must be read through `docs/economy/economy_authority_terminology_crosswalk_v1.md`.
- No module in this scope-out receives runtime activation, reward producer activation, token/G2A/NFT/wallet activation, payout/settlement/cashback activation or Slice 16 movement.

## 5. Module Risk Matrix

| Module | Semantic risk | Runtime risk | Frontend risk | Near-term safe work | Must defer |
|---|---|---|---|---|---|
| RF / Vouchers | Medium/high | High | Medium | Lifecycle/domain contract alignment; voucher utility copy alignment; RF/Rielt/Connect boundary map. | Live staging evidence, paid-spend activation, payout/settlement/G2A/NFT. |
| Connect / Projection | High | Medium if read-only | High | Read-only projection boundary; stale/error/mock state semantics; safe labels. | Wallet activation, ledger authority, writes, spend decisions. |
| Quest / Badges / Achievements | High | High for rewards | High | Authority split between local UX and backend proof/completion; off-chain badge semantics. | Reward runtime claims from localStorage, NFT mint/ownership, Points producer activation. |
| PRO Attribution | High | High if mutable | Medium/high | Factual provenance canon tied to RF durable action; read-only PRO summaries. | Commission, payout entitlement, universal attribution engine. |
| Rielt / Realty | Medium/high | Medium/high | Medium | Listing-scoped RF voucher boundary; unsafe wording remediation. | Realty investment/reward claims, payment/booking/settlement integration. |
| Points / Activity | High | Critical | High | Doctrine use, projection labels, dependency mapping. | Spendability rewrite, hard lock enforcement, token/G2A/NFT bridge. |
| Frontend surfaces | High | Variable | High | Module-by-module semantic alignment. | Broad redesign, new economy UI, wallet/token/NFT activation. |

## 6. Recommended Module Sequence

Recommended sequence:

1. **RF / Vouchers lifecycle baseline alignment**
   - Why: strongest runtime domain, direct continuation of Stage 7, central dependency for Rielt, Connect, PRO attribution and Points spend coupling.
   - Mode: docs-first/module contract alignment; no runtime execution.
   - Do not do yet: paid-spend staging, NFT/Totem premium gates, payout/settlement, broad UI redesign.

2. **Connect / Projection boundary alignment**
   - Why: user-facing interpretation layer; high risk of wallet/projection drift.
   - Mode: docs/module/frontend semantic alignment.
   - Do not do yet: Connect writes, ledger authority, wallet activation.

3. **Quest / Badges / Achievements authority alignment**
   - Why: known localStorage/mock authority blocker; reward/progression semantics must be separated from runtime proof.
   - Mode: read-only audit or docs-first contract.
   - Do not do yet: reward producer activation, NFT minting, Points grants from local completion.

4. **RF ↔ Rielt listing-scoped voucher alignment**
   - Why: practical business flow and clear module boundary risk.
   - Mode: module contract alignment after RF baseline.
   - Do not do yet: booking/payment/settlement flows.

5. **PRO Attribution bounded alignment**
   - Why: must stay factual provenance, not commission/payout.
   - Mode: attribution contract refinement around RF first, ecosystem-wide later.
   - Do not do yet: payout entitlement, universal attribution service.

6. **Points / Activity projection dependency alignment**
   - Why: critical risk; should follow module boundary clarity rather than lead with implementation.
   - Mode: doctrine-to-module dependency mapping.
   - Do not do yet: spendability rewrite, available-only hard enforcement, token bridge.

7. **Frontend module surface alignment passes**
   - Why: UI must follow each module's settled contract.
   - Mode: bounded frontend semantic remediation per module.
   - Do not do yet: broad redesign or new economy surfaces.

Adjustment to the initial suggested order:

- Rielt should move before broader PRO Attribution if the next RF slice includes listing-scoped voucher flows, because RF/Rielt ownership must be clear before PRO reporting expands.
- Points should remain a dependency and doctrine layer until specific module contracts require implementation decisions.

## 7. First Candidate Module Slice

Recommended next slice:

```text
Stage 7.4 - RF / Voucher Lifecycle Baseline Module Alignment
```

Stage 7.4 is now represented by `docs/architecture/domain/rf_voucher_lifecycle_baseline_v1.md`. That artifact remains docs-first baseline alignment, not implementation authorization.

Execution mode:

```text
DOCS-FIRST MODULE CONTRACT ALIGNMENT
NO RUNTIME EXECUTION
NO IMPLEMENTATION
NO STAGING EVIDENCE COLLECTION
```

Goal:

- align RF module docs, RF domain readiness and RF implementation sequencing around a minimal voucher lifecycle baseline;
- make Partner, PartnerOffer, RFVoucher, VoucherRedemption, UserVoucherState and PROAttribution boundaries explicit;
- classify current runtime-backed, partial, projection and future-only RF surfaces;
- prepare a bounded implementation candidate without starting implementation.

Recommended context capsule:

- `docs/architecture/domain/rf-asia-domain-readiness-v1.md`
- `docs/architecture/domain/rf-asia-implementation-sequencing-v1.md`
- `docs/modules/rf_partners/`
- `docs/economy/points_policy_v1.md`
- `docs/economy/referral_network_rewards_policy_v1.md`
- `docs/economy/economy_authority_terminology_crosswalk_v1.md`
- `docs/runtime/stage_7_2_governance_freeze_closure_v1.md`
- `docs/runtime/rf_runtime_readiness_evidence_pack_v1.md`
- `docs/architecture/platform/go2asia_backend_services_architecture_v2.md`
- `docs/architecture/platform/go2asia_interface_architecture_v2.md`
- `docs/architecture/platform/go2asia_attribution_architecture_map_v1.md`

Required agents:

- Runtime Governance Architect;
- Software Architect;
- Module Architect;
- Economy Architect;
- RF Domain Architect;
- Backend Architect;
- Frontend UX Architect;
- Product Semantics Reviewer;
- QA / Test Governance Reviewer;
- Technical Canon Writer.

Acceptance criteria:

- RF lifecycle labels are clearly defined as voucher lifecycle, not payout or cashback availability.
- RF ownership and Points ownership are separated.
- Connect `UserVoucherState` is read-only projection, not lifecycle authority.
- Rielt listing context is reference/context, not RF ownership transfer.
- PRO attribution is immutable provenance, not commission/payout entitlement.
- Premium Points/NFT/Totem/G2A layers remain future-only.
- No implementation or runtime activation is introduced.

## 8. Deferred Areas

Deferred areas:

- operational Stage 7.2 staging evidence execution;
- paid RF spend staging window;
- live DB/log/diagnostics evidence collection;
- Quest reward runtime proof;
- Connect wallet-like experiences;
- token/G2A/NFT/wallet/on-chain features;
- payout/settlement/cashback/commission mechanics;
- `referral_unlock` and network accrual producers;
- hard available-only Points spend enforcement;
- Slice 16 movement;
- universal attribution service;
- broad frontend redesign.

Deferred means not suitable for the next module slice. It does not remove these topics from future roadmap consideration.

## 9. Anti-Recursion Guard

Anti-recursion guard:

```text
no_new_approval_frameworks_without_concrete_gap
no_meta_framework_for_stage_7_2_packet
no_policy_loop_without_runtime_or_module_delta
prefer_module_alignment_slices
reuse_stage_7_2_artifacts_for_future_evidence_window
```

Allowed governance work after this plan:

- small updates when module alignment discovers a specific contradiction;
- adding a module-specific contract where no contract exists;
- updating the frozen Stage 7.2 artifacts only when real approvals, safe actors, staging target or evidence appear.

Not allowed:

- creating another general approval framework;
- continuing to elaborate staging governance in the absence of target/actor/access facts;
- replacing practical module alignment with more abstract policy work.

## 10. Runtime Safety Guard

Runtime safety guard:

```text
staging_window_opened: false
runtime_evidence_collected: false
api_calls_executed: false
db_access_executed: false
diagnostics_retrieval_executed: false
log_retrieval_executed: false
tests_added: false
implementation_added: false
runtime_activation: false
token_g2a_nft_wallet_activation: false
payout_settlement_cashback_activation: false
slice_16_status: blocked_not_triggered
```

Any future module slice must restate this guard if it touches RF, Points, Connect, Quest, PRO attribution, Rielt or frontend economy surfaces.

## 11. Review Gate Results

This table records the Stage 7.3 planning-pass review result for this docs-only slice. It is not an external operational sign-off, not approval to open a staging window and not approval to activate runtime behavior.

| Review gate | Result | Notes |
|---|---|---|
| Runtime Governance Review | `passed_for_planning` | Stage 7.2 freeze is correctly stated; operational execution remains deferred; projection/diagnostics are not authority. |
| Architecture Review | `passed_for_planning` | Module re-entry preserves backend domain ownership and avoids broad implementation. |
| Economy Review | `passed_for_planning` | Points remain internal utility; RF/voucher is not cashback/settlement; attribution is not payout. |
| RF Domain Review | `passed_for_planning` | RF/Voucher lifecycle baseline is the right first candidate slice. |
| Frontend Semantics Review | `passed_with_watch_items` | Connect, Quest and frontend surfaces remain high-risk and must be aligned per module. |
| QA / Test Governance Review | `passed_for_docs_only` | No tests are required or added; future validation remains gated by Stage 7.2 artifacts. |
| Canon Review | `passed_for_new_docs` | Two docs-only artifacts are appropriate and do not introduce a new approval framework. |

Watch items:

- Rielt module docs still include legacy product wording that must be read through the economy crosswalk before implementation.
- Quest localStorage/mock completion remains a blocker for reward runtime claims.
- Frontend labels can reintroduce wallet/projection drift even after Stage 6.5 remediation.

## 12. Recommended Next Step

Recommended next step:

```text
Stage 7.4 - RF / Voucher Lifecycle Baseline Module Alignment
```

Recommended execution mode:

```text
DOCS-FIRST MODULE CONTRACT ALIGNMENT
```

This next step should produce a bounded RF module contract/alignment artifact, not implementation. It should reduce risk before any backend or frontend changes by clarifying the exact RF lifecycle baseline, ownership boundaries and future-only economy vocabulary.

Final Stage 7.3 status:

```text
stage_7_3_status: complete_for_planning
stage_7_2_governance_layer: frozen_for_now
operational_runtime_evidence_execution: deferred_not_cancelled
module_reentry: approved_as_bounded_alignment_sequence
first_candidate_slice: Stage_7_4_RF_Voucher_Lifecycle_Baseline_Module_Alignment
governance_recursion: blocked
runtime_activation: false
slice_16_status: blocked_not_triggered
```
