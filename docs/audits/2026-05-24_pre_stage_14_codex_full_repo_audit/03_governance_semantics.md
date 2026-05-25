# Audit 3 — Governance Semantics Audit

Дата: 2026-05-24
Тип аудита: Read-only Codex audit
Статус: PASS_WITH_WARNINGS
Контекст: Pre-Stage-14 governance semantics baseline

---

# 1. Executive summary

Governance health: strong, with controlled legacy debt.

Semantic integrity: high.

Major invariants are mostly preserved across:

* UI copy;
* projection helpers;
* tests;
* route framing;
* Stage 12I / Stage 13 reports;
* diagnostics copy;
* Connect / Quest / Rielt / RF / PRO / Space surfaces.

Overall verdict:

`PASS_WITH_WARNINGS`

Main warnings:

* legacy Path B vocabulary surfaces remain present;
* `wallet`, `balance`, `NFT` route/component names remain semantic pressure points;
* high-sensitivity vocabulary such as `verified`, `VIP`, `entitlement`, `curator`, `proof`, `receipt`, `audit` requires continuous discipline;
* Stage 14 content/data seeding may increase semantic erosion risk.

No blockers were found.

---

# 2. Governance semantics map

## Strongest bounded semantics

### Projection fences

Projection boundaries are explicit and repeated across:

* shared projection copy;
* Connect surfaces;
* Quest reward/completion surfaces;
* RF voucher projection surfaces;
* diagnostics UI;
* tests and guardrails.

Core repeated claims:

* not proof;
* not receipt;
* not authority;
* not owner fact;
* not financial wallet;
* not accounting statement.

### Diagnostics boundaries

Diagnostics are consistently framed as:

* internal operator context;
* support navigation;
* owner-fact pointer guidance;
* not customer evidence;
* not proof;
* not immutable audit ledger.

### Rielt inquiry-only doctrine

Rielt inquiry surfaces consistently preserve:

* `inquiry != booking`
* `listing_projection != inventory_authority`
* `inquiry_status != booking_confirmation`

### RF / VIP / PRO boundaries

RF, VIP and PRO surfaces generally preserve:

* voucher lifecycle != settlement;
* VIP preview != entitlement grant;
* partner visibility != business ownership;
* attribution != payout.

---

## Weakest / fragile semantics

### Legacy Path B adjacency

Legacy/deferred surfaces remain present:

* `/connect/wallet`
* `/space/balance`
* `/space/nft`

These are currently controlled by copy and guardrails, but still create semantic pressure.

### Legacy names in routes/components

Terms such as:

* wallet;
* balance;
* NFT;
* verified;
* curator;
* entitlement;
* VIP;

remain sensitive.

They are not currently blockers, but should be monitored.

---

# 3. Vocabulary drift assessment

## Strong areas

Many active UI surfaces use explicit anti-overclaim wording:

* `не proof`
* `не receipt`
* `не financial wallet`
* `не accounting statement`
* `не booking confirmation`
* `не payment confirmation`

Tests and shared copy also guard against:

* proof-like metadata keys;
* receipt semantics;
* authority semantics;
* financial wallet semantics.

## Drift / risk areas

### Legacy terminology debt

Legacy names remain in route/component surface:

* wallet;
* NFT;
* balance.

These do not currently create positive unsafe claims, but they remain risk vectors.

### Sensitive terms

The following terms exist in scoped or bounded contexts:

* verified;
* curator;
* VIP;
* entitlement;
* proof;
* receipt;
* audit;
* owner fact.

Current usage is mostly guarded, but future copy changes may cause drift.

---

# 4. Projection / authority assessment

Projection erosion risk:

* low-to-medium.

## Strong points

Shared projection copy consistently enforces non-authoritative meaning.

Connect dashboard/activity/referrals/levels are framed as:

* read-only projections;
* activity summaries;
* visibility surfaces;
* not accounting statements;
* not receipts.

Quest completion/reward surfaces avoid:

* reward grant;
* Points transaction;
* proof;
* receipt.

Diagnostics and projection metadata helpers keep support lookup as:

* pointer;
* navigation aid;
* internal operator context.

## Remaining risk

Boundaries are robust, but rely on ongoing:

* copy discipline;
* tests;
* projection helper consistency;
* review discipline.

---

# 5. Identity / social governance assessment

## Current state

Profile/Space semantics are mostly framed as:

* visibility;
* community context;
* saved/social activity;
* social preview;
* not identity proof;
* not reputation authority.

## Controlled areas

Moderation/admin authority overclaim appears controlled.

No broad positive claims were found for:

* official reputation;
* verified identity;
* moderation authority;
* admin approval.

## Sensitive drift vectors

Labels such as:

* verified;
* curator;
* author;
* community status;
* profile status;

remain sensitive.

Risk:

* implicit social legitimacy;
* identity proof illusion;
* moderation hierarchy illusion.

Recommended follow-up:

* continue scanning social/profile copy during Stage 14 seeding;
* avoid `verified identity`-like language;
* avoid social ranking/reputation language unless runtime-backed and explicitly bounded.

---

# 6. Booking / inventory governance assessment

## Current state

Rielt inquiry flow includes explicit disclaimers against:

* booking confirmation;
* reservation;
* receipt;
* guaranteed availability;
* inventory authority.

## Listing semantics

Listing and media/source labels avoid proof-like and inventory-authority language.

## RF listing-adjacent offers

RF listing-adjacent offer semantics include anti-booking and anti-settlement disclaimers.

Net result:

* `inquiry != booking` holds;
* `listing_projection != inventory_authority` holds.

Risk level:

* low, but Stage 14 seed listings must preserve explicit inquiry-only copy.

---

# 7. Reward / economy semantics assessment

## Connect

Connect surfaces preserve:

* non-financial framing;
* non-receipt wording;
* anti-accounting statements;
* projection-safe Points visibility.

## Quest

Quest completion and reward copy repeatedly use:

* preview;
* projection;
* review;
* may be reflected later;
* not grant;
* not receipt;
* not proof.

## RF / VIP

Voucher and premium preview surfaces include anti-overclaim wording:

* not payout;
* not settlement;
* not payment confirmation;
* not entitlement grant;
* not financial wallet.

## PRO

PRO surfaces frame attribution and partner visibility as:

* read-only visibility;
* operational context;
* not ownership;
* not settlement;
* not payout;
* not admin authority.

Overall reward/economy drift:

* low.

Strongest enforcement:

* Connect;
* Quest;
* shared projection copy;
* tests.

---

# 8. Diagnostics / support governance assessment

Diagnostics UI and metadata language strongly separate:

* operator support navigation;
* customer proof;
* support resolution;
* admin authority;
* audit ledger.

## Strong statements

Diagnostics remain:

* internal-only;
* operator context;
* non-customer-proof;
* non-support-resolution;
* non-audit-ledger.

## Risk

Risk remains if future internal diagnostics strings are promoted into public UX without guardrails.

Recommended follow-up:

* ensure diagnostics copy is excluded from customer-facing support surfaces;
* maintain internal-only route framing;
* avoid exposing support lookup output as evidence.

---

# 9. Path B semantic leakage assessment

Leakage status:

* present but mostly quarantined.

Path B-related terminology remains in:

* wallet;
* balance;
* NFT;
* legacy/deferred routes;
* compatibility aliases.

Current copy usually frames these as:

* non-financial;
* deferred;
* off-chain/internal;
* legacy;
* not active Path B.

Risk class:

* medium.

Reason:

* the terms exist;
* future UI/content seeding could accidentally make them feel active.

Not high because:

* current framing is defensive;
* Path B remains inactive;
* no active on-chain/token semantics are implied.

---

# 10. Governance invariant table

| Invariant                                     | Status            | Risk   | Notes                                                    |
| --------------------------------------------- | ----------------- | ------ | -------------------------------------------------------- |
| `mock_data != proof`                          | PASS              | Low    | Repeated in mock/readme/copy/test fences                 |
| `projection != authority`                     | PASS              | Low    | Strong shared projection wording                         |
| `preview != grant`                            | PASS              | Low    | Quest/Connect/RF preview framing                         |
| `dashboard != receipt`                        | PASS              | Low    | Connect dashboard wording explicit                       |
| `wallet != financial_wallet`                  | PASS_WITH_WARNING | Medium | Legacy wallet route still exists                         |
| `listing_projection != inventory_authority`   | PASS              | Low    | Rielt listing copy/tests guard this                      |
| `inquiry != booking`                          | PASS              | Low    | Rielt inquiry pages explicitly deny booking confirmation |
| `lookup != proof`                             | PASS              | Low    | Support lookup framed as pointer                         |
| `diagnostic_snapshot != customer_proof`       | PASS              | Low    | Diagnostics copy and generated docs align                |
| `operational_trace != immutable_audit_ledger` | PASS              | Medium | Explicitly denied; terminology remains sensitive         |
| `owner_fact = authoritative`                  | PASS              | Low    | Present in capsules and projection contract language     |
| `Path_B_inactive = true`                      | PASS_WITH_WARNING | Medium | Deferred/legacy surfaces still present                   |
| `public_launch_implied = false`               | PASS              | Low    | Stage reports/capsules reinforce                         |

---

# 11. Top governance risks

## Blockers

None found.

---

## High

None currently.

---

## Medium

### Legacy Path B naming surfaces

Terms/routes:

* wallet;
* balance;
* NFT.

Risk:

* semantic regression if copy/tests weaken;
* future seeding may make deferred surfaces feel active.

### Diagnostics/proof vocabulary density

Diagnostics/projection code contains many proof/evidence/audit-adjacent words, often as guardrails.

Risk:

* accidental public exposure;
* future copy reuse without negative framing.

---

## Low

### Isolated verified/legacy wording

Current usage is bounded, but should remain monitored.

---

## Non-blocking follow-ups

* Alias retirement roadmap with semantic checkpoints.
* Continuous forbidden-vocabulary scans for active user-facing files only.
* Periodic governance diff review for deferred routes.
* Stage 14 seed semantics checklist.

---

# 12. Stage 14 governance implications

## Main seeding risks

Seed content may accidentally read as:

* authority;
* proof;
* booking confirmation;
* payment confirmation;
* settlement state;
* reward grant;
* verified identity;
* official reputation.

## Highest-risk seed domains

* Rielt listings;
* RF vouchers/offers;
* Connect/Points projections;
* Quest rewards;
* VIP/PRO surfaces;
* Space/Profile social surfaces;
* Path B legacy/deferred surfaces;
* diagnostics/admin surfaces.

## Required guardrails

Before and during Stage 14:

1. Mandatory projection badge/footer on seeded projection surfaces.
2. Explicit demo/reference labeling for non-authoritative data.
3. Keep diagnostics/support strings internal-only.
4. Keep legacy Path B screens visibly deferred and non-operational.
5. Do not seed booking/payment/settlement/proof semantics.
6. Do not make seed data substitute owner facts.
7. Do not use `verified identity`, `official reputation`, `reward granted`, `booking confirmed`, or similar positive claims.

---

# 13. Recommended next audits

1. Security / Access / Secrets Audit
2. Route / UX Continuity Audit
3. Projection Metadata Deep Audit
4. Alias Retirement Audit
5. Deferred Surface Governance Audit

---

# 14. Final git status

## Before audit

Workspace was dirty before audit.

Pre-existing modified files included:

* SQL/migrations;
* scripts;
* already-modified files outside audit scope.

## After audit

Workspace remained in the same dirty state.

No new modifications were introduced by the audit.

## Confirmation

Audit completed strictly read-only.

No files were:

* modified;
* created;
* deleted.

---

# Read-only commands executed

* `git status --short`
* `git diff --stat`
* semantic `rg` scans for financial / booking / reward / identity / diagnostics keywords
* `find` across projection/connect/space/rf/rielt/quest component trees
* `pnpm -C apps/go2asia-pwa-shell typecheck`
* `pnpm -C apps/go2asia-pwa-shell lint`

`git diff --check` failed only due to pre-existing trailing whitespace in already-modified files outside audit scope.
