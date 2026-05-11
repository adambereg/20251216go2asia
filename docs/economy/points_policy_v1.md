# Points Policy v1

Rewards / Points Policy for Go2Asia current runtime and VIP-gated target economy.

## 1. Purpose

This document fixes the economic policy for Go2Asia Points.

It defines:

- what Points mean in the Go2Asia economy;
- how VIP unlocks Points spending;
- which Points classes exist;
- how referral, RF voucher, quest, badge, PRO and future token layers should be interpreted;
- where current runtime already matches the policy;
- where current runtime is still a limitation or implementation gap.

This document does not implement runtime behavior. It does not change backend services, APIs, UI, migrations, Points grants, Points spend rules, G2A, NFT, Totem, on-chain mechanics, PRO rewards or partner payouts.

## 2. Core Principle

**VIP is the primary monetization unlock for Points spending.**

VIP-статус — главный монетизационный unlock экосистемы Go2Asia. Points можно накапливать через участие, но возможность тратить Points на ценные действия экосистемы открывается через активный VIP-статус.

Product policy:

- ordinary spacers can accumulate Points through participation;
- Points should be visible before VIP activation;
- valuable Points spending requires active VIP spend access;
- the standard VIP window is 30 days;
- after the VIP window ends, spend access closes until VIP is purchased again;
- VIP costs 1000 RUB per 30 days.

## 3. Economy Model Summary

Points are the internal off-chain participation currency of Go2Asia.

Points are:

- a participation and activity accounting unit;
- a way to unlock ecosystem value through VIP;
- a voucher, quest and future entitlement spend input;
- an internal loyalty ledger owned by Points Service.

Points are not:

- money;
- cash balance;
- payout obligation;
- investment product;
- commission;
- external token;
- G2A;
- on-chain asset.

G2A, token mechanics, NFT/Totem gating and on-chain withdrawal belong to future layers. They must not be treated as current runtime unless a separate policy, implementation and runtime contract exist.

VIP is the spend access unlock. Vouchers are the primary Points spend product.

## 4. Points Classes

### A. Personal Points

Personal Points are Points earned by a user's own participation.

Examples:

- account activity;
- posts;
- reactions;
- event participation;
- quest completion;
- other active actions approved by the Points policy.

Current runtime examples include registration, first login, event registration and quest completion.

### B. Conditional Points

Conditional Points are Points that have been recorded for the user but should not be fully spendable until a condition is met.

The main current example is `referral_locked`.

Target policy:

- registration of a direct referral creates Conditional Points for the inviter;
- these Points unlock only after the invited user makes the first VIP purchase;
- registration of a second-level referral can create smaller Conditional Points;
- these Points unlock only after the second-level user makes the first VIP purchase.

Current runtime note: `referral_locked` is active, but locked Points may not yet be enforced as a hard spend lock by every spend path. See Runtime Alignment Notes.

### C. Network Points

Network Points are Points connected to the activity of invited users.

Target policy:

- direct referral activity can generate a 10% Points participation reward for the inviter;
- second-level referral activity can generate a 2% Points participation reward;
- these rewards require VIP conditions;
- inactive potential network value must not be displayed as already granted wallet balance.

Network Points must be described as participation rewards from invited activity, not as income, commission, payout or passive earnings.

### D. Compensation Points

Compensation Points are technical corrections created to keep the ledger consistent.

Example:

- RF spend compensation after a voucher claim debit succeeds but voucher persistence or idempotency finalization fails.

Compensation Points are not a user reward loop. They are a recovery mechanism.

## 5. Availability / Lock Model

The policy model has three visible availability states:

- Available Points: Points that can be spent when the user also has active VIP spend access.
- Points with conditions: Points recorded for the user but waiting for an unlock condition.
- Network Points: Points connected to invited user activity and VIP-gated network rules.

Target policy:

- `lockedPoints` should be a real spend lock;
- Conditional Points should not be spendable until their unlock event is recorded;
- VIP grants spend access for the active 30-day window;
- VIP expiration closes spend access;
- repeat VIP purchase opens spend access again.

Current runtime limitation:

- wallet buckets are projected from ledger actions;
- `referral_locked` appears in the locked bucket;
- current spend checks may still depend on the materialized balance rather than a fully enforced available-only bucket;
- therefore, the policy target is stricter than current enforcement.

This gap must be closed before relying on locked Points as a security or economy invariant.

## 6. VIP Spend Access Policy

An ordinary spacer can accumulate Points without VIP.

Without active VIP:

- the user can see Points;
- the user can see locked or conditional value;
- the user can understand available ecosystem opportunities;
- the user must not fully spend Points on valuable ecosystem actions.

With active VIP:

- the user gets spend access for 30 days;
- RF voucher spend becomes available when other guards pass;
- quest or future spend sinks may become available when separately implemented;
- future NFT/Totem gates may combine with VIP only after separate implementation.

After VIP expires:

- spend access closes;
- accumulated Points remain visible;
- new spend actions must be blocked until VIP is purchased again.

VIP spend access is the monetization unlock. It is not a payout right and not a financial entitlement.

## 7. Referral Points Policy

Referral rewards must be framed as participation and growth mechanics, not MLM, commission, payout or passive income.

### Direct Referral

Target policy:

- registration of a direct referral grants 5000 Conditional Points;
- these Points unlock only after the first VIP purchase of the referred user;
- before unlock they are displayed as Points with conditions.

Current runtime:

- `referral_locked` is active;
- the amount defaults to 5000 Points;
- unlock after VIP purchase is not yet fully implemented as runtime.

### Direct Referral Activity

Target policy:

- the inviter receives 10% of the referred user's eligible activity Points;
- this applies only while the referred user has active VIP;
- when the referred user's VIP expires, the 10% accrual stops;
- inactive potential value must not appear in the wallet as already granted Points.

Current runtime:

- no active producer for direct referral activity accrual was confirmed;
- action taxonomy can support network accrual, but policy implementation is future work.

### Second-Level Referral

Target policy:

- registration of a second-level referral grants 100 Conditional Points;
- these Points unlock after the first VIP purchase of the second-level referral.

Current runtime:

- second-level referral tree visibility exists in referral read models;
- second-level Conditional Points grant is not active runtime.

### Second-Level Activity

Target policy:

- the user receives 2% of eligible activity from a second-level referral;
- this applies only when both the direct referral and second-level referral have active VIP;
- if VIP expires for either user, accrual stops.

Current runtime:

- no active second-level network accrual producer was confirmed.

Allowed semantics:

- Points за участие сети;
- Points за активность приглашённых;
- условия активации;
- Points с условиями.

Avoid:

- доход;
- пассивный доход;
- комиссия;
- выплата;
- MLM.

## 8. RF Voucher Spend Policy

RF vouchers are the primary product for Points spending.

Voucher policy:

- a voucher can cost 0 Points, a symbolic number of Points or a meaningful number of Points;
- a voucher is not payment for the underlying product or service;
- the underlying product or service is paid to the business partner separately when applicable;
- Points spend is connected to voucher claim or purchase, not to generic cash value;
- RF Service owns voucher lifecycle;
- Points Service owns the ledger debit;
- Connect may display voucher status as read-only projection.

Runtime alignment:

- RF paid voucher claim spend exists behind `RF_ENABLE_PAID_VOUCHER_SPEND`;
- the spend action is `rf_voucher_claim_spend`;
- debit is coupled to claim;
- compensation can use `rf_voucher_claim_spend_compensation`;
- redeem changes voucher lifecycle and does not necessarily create a Points reward.

PRO or partner notifications, attribution and contact flows are operational layers. They are not payout runtime.

## 9. Quest / Badges / NFT Future Boundary

Quests can be reward surfaces and future spend sinks.

Current runtime:

- quest completion can grant Points through `quest_completed`;
- badges are off-chain achievements owned by Points Service;
- badge award does not imply NFT minting;
- Quest-to-badge handoff may require separate implementation.

Future boundary:

- NFT/Totem gating is not current runtime;
- NFT mint, NFT burn, NFT upgrade and on-chain withdrawal require separate policy and implementation;
- G2A must not be displayed or documented as a current spend layer until implemented.

## 10. PRO / Partner Rewards Boundary

Current runtime may include PRO attribution and operational visibility.

Policy boundary:

- PRO attribution exists as provenance or operational context;
- attribution is not reward entitlement;
- PRO rewards are not active runtime unless a separate policy and implementation exist;
- partner payouts and settlements are not active runtime;
- commission language must not be used for current Points policy.

Future PRO or partner rewards require:

- funding source definition;
- reward trigger definition;
- anti-abuse rules;
- ledger or payout owner;
- separate runtime implementation;
- separate docs.

## 11. Runtime Alignment Notes

Active today:

- Points Service owns the current off-chain Points ledger, balances and transactions.
- Points Service owns internal add/spend endpoints and badge awards.
- Current runtime has `points_transactions` and `user_balances`.
- Current runtime has registration, first-login, event-registration and quest-completion Points grants.
- Current runtime has `referral_locked`.
- Current runtime has RF paid voucher spend coupling behind a feature flag.
- Current runtime has RF spend compensation.
- Referral Service owns referral graph and activation facts.
- RF Service owns voucher lifecycle and voucher spend coupling.
- Connect is a read-only projection and explanation layer.

Target policy not fully enforced yet:

- `lockedPoints` must become a real spend lock.
- VIP entitlement lifecycle must become the authority for 30-day spend access.
- referral unlock after first VIP purchase must be implemented.
- direct referral activity reward must be implemented before being shown as accrued balance.
- second-level referral grant and activity reward must be implemented before being shown as accrued balance.
- RF paid voucher spend gate must remain aligned with VIP entitlement.

Not current runtime:

- G2A accounting;
- tokenomics engine;
- NFT/Totem gates;
- on-chain gateway;
- PRO rewards;
- partner payouts;
- partner settlements;
- MLM income;
- cash-out.

## 12. Terminology Guardrails

Allowed semantics:

- участие;
- активность;
- вклад;
- накопленные Points;
- Points с условиями;
- доступные Points;
- VIP открывает возможности;
- ваучеры за Points;
- Points за активность приглашённых;
- внутренний Points ledger;
- read-only projection.

Risky or forbidden semantics for current runtime:

- заработок;
- пассивный доход;
- комиссия;
- выплата;
- кэш-аут;
- инвестиционный доход;
- банковский счёт;
- токен как текущие деньги;
- G2A как текущий spend layer;
- NFT как current spend gate;
- MLM;
- partner payout;
- PRO commission.

Suggested softer wording:

- use "Points за участие" instead of "доход";
- use "условные Points" or "Points с условиями" instead of "заблокированный заработок";
- use "операционная атрибуция" instead of "право на выплату";
- use "read-only wallet summary" instead of "финансовый кошелёк";
- use "future token layer" instead of "token economy" when discussing unimplemented G2A/on-chain features.

## 13. Non-Goals

This policy document does not add or define implementation for:

- G2A;
- tokenomics runtime;
- NFT implementation;
- Totem implementation;
- on-chain gateway;
- PRO payout;
- partner settlement;
- commissions;
- cash-out;
- new rewards logic;
- new Points grants;
- new Points spend rules;
- migrations;
- backend/API/UI changes.

## 14. Open Decisions / Implementation Gaps

Open decisions before full policy enforcement:

- enforce `lockedPoints` as a hard spend lock;
- define the VIP entitlement lifecycle and source of truth;
- define the referral unlock event after first VIP purchase;
- implement direct referral activity reward;
- implement second-level referral Conditional Points;
- implement second-level activity reward;
- align RF spend gate with VIP entitlement instead of role-only shortcuts;
- align Connect, wallet and referral copy with participation wording;
- add tests and guards for locked spend, VIP expiry and referral unlock;
- decide whether quest spend sinks are MVP or future;
- decide whether badges remain off-chain only or become NFT/Totem triggers in a later policy.

Until these gaps are closed, runtime and UI must clearly distinguish:

- active ledger facts;
- projected bucket summaries;
- target policy;
- future economy layers.
