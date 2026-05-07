# Connect Referrals Staging Cleanup Plan v1

Status: prepared, not executed.  
Date: 2026-05-05.  
Target: `irina.belova.seed@example.com`.  
Environment: staging Neon DB (`neondb`, host `ep-shiny-violet-a4ja8x5m.us-east-1.aws.neon.tech`).  
Scope: referral demo/test cleanup only. No RF vouchers, Connect code, badges, non-referral points, or referral link changes.

## 1. Read-Only Inspection Result

Inspection was executed inside a read-only transaction.

### User

| Field | Value |
| --- | --- |
| `users.id` | `user_3BlJz9HkQXOBiwnbhBfNX6Zt9St` |
| `users.email` | `irina.belova.seed@example.com` |
| `users.created_at` | `2026-04-13T00:24:53.465Z` |
| `users.updated_at` | `2026-05-05T05:32:13.711Z` |

### Referral Link

| Field | Value |
| --- | --- |
| `referral_links.id` | `connect_demo_referral_link_user_3BlJz9HkQXOBiwnbhBfNX6Zt9St` |
| `referral_code` | `CANX6ZT9ST` |
| `created_at` | `2026-04-15T19:30:00.000Z` |

This row must remain.

### Referral Relations

| Classification | `id` | `referee_id` | `registered_at` | `first_login_at` | Decision |
| --- | --- | --- | --- | --- | --- |
| Real candidate | `2fb43ae3-f1da-4e3c-9ef1-0696e557ed11` | `user_3Csk99zh5Gf4Xl83xN2e4bYGO4Q` | `2026-04-25T22:31:57.580Z` | `null` | Keep |
| Demo seed | `connect_demo_referral_user_3BlJz9HkQXOBiwnbhBfNX6Zt9St_user_3BlJzMofRZwsapgjk3Ond72ESn1` | `user_3BlJzMofRZwsapgjk3Ond72ESn1` | `2026-04-23T02:15:00.000Z` | `null` | Delete candidate |
| Demo seed | `connect_demo_referral_user_3BlJz9HkQXOBiwnbhBfNX6Zt9St_user_3BlK8FjaNuSTgxcgX8Lnkeot3Wy` | `user_3BlK8FjaNuSTgxcgX8Lnkeot3Wy` | `2026-04-22T05:00:00.000Z` | `null` | Delete candidate |
| Demo seed | `connect_demo_referral_user_3BlJz9HkQXOBiwnbhBfNX6Zt9St_user_3BlJq7WcPpP0wWcEE8MVCEn7ebg` | `user_3BlJq7WcPpP0wWcEE8MVCEn7ebg` | `2026-04-20T00:45:00.000Z` | `2026-04-20T01:20:00.000Z` | Delete candidate |
| Demo seed | `connect_demo_referral_user_3BlJz9HkQXOBiwnbhBfNX6Zt9St_user_3BlJzL7ria3723paCJRzmC9Ag3c` | `user_3BlJzL7ria3723paCJRzmC9Ag3c` | `2026-04-18T03:30:00.000Z` | `2026-04-18T04:10:00.000Z` | Delete candidate |
| Demo seed | `connect_demo_referral_user_3BlJz9HkQXOBiwnbhBfNX6Zt9St_user_3BlKqpPMQb9Bms1GDpqSYftwzAc` | `user_3BlKqpPMQb9Bms1GDpqSYftwzAc` | `2026-04-17T01:10:00.000Z` | `2026-04-17T02:20:00.000Z` | Delete candidate |

Summary:

- found referral rows: 6;
- demo delete candidates: 5;
- real row to keep: 1;
- `devtest_%` rows: 0.

## 2. Matching Points Transactions

Referral-related points transactions found for Irina: 8.

### Demo Delete Candidates

These seven rows are tied to the five demo referee IDs.

| `id` | `amount` | `reason` | `external_id` | Why delete candidate |
| --- | ---: | --- | --- | --- |
| `68842f9e-32f2-424a-9fb4-b56731acc8d4` | 5000 | `referral_locked` | `referral:locked:user_3BlJz9HkQXOBiwnbhBfNX6Zt9St:user_3BlKqpPMQb9Bms1GDpqSYftwzAc` | Locked points for demo referee. |
| `3de54631-8eef-41ec-bc9c-de44dc12a957` | 5000 | `referral_locked` | `referral:locked:user_3BlJz9HkQXOBiwnbhBfNX6Zt9St:user_3BlJzL7ria3723paCJRzmC9Ag3c` | Locked points for demo referee. |
| `3f9dba45-02b5-4536-b92f-68065b719941` | 5000 | `referral_locked` | `referral:locked:user_3BlJz9HkQXOBiwnbhBfNX6Zt9St:user_3BlJq7WcPpP0wWcEE8MVCEn7ebg` | Locked points for demo referee. |
| `1010c910-8344-43f0-a03b-7bea00a61bcb` | 5000 | `referral_locked` | `referral:locked:user_3BlJz9HkQXOBiwnbhBfNX6Zt9St:user_3BlK8FjaNuSTgxcgX8Lnkeot3Wy` | Locked points for demo referee. |
| `c9c2afc2-cda2-4b2c-93d9-93ab8245a84f` | 5000 | `referral_locked` | `referral:locked:user_3BlJz9HkQXOBiwnbhBfNX6Zt9St:user_3BlJzMofRZwsapgjk3Ond72ESn1` | Locked points for demo referee. |
| `connect_demo_tx_user_3BlJz9HkQXOBiwnbhBfNX6Zt9St_referral_first_login_user_3BlJzL7ria3723paCJRzmC9Ag3c` | 35 | `referral_bonus_referrer` | `referral:first_login:user_3BlJz9HkQXOBiwnbhBfNX6Zt9St:user_3BlJzL7ria3723paCJRzmC9Ag3c` | Explicit `metadata.demo = true`. |
| `connect_demo_tx_user_3BlJz9HkQXOBiwnbhBfNX6Zt9St_referral_first_login_user_3BlKqpPMQb9Bms1GDpqSYftwzAc` | 40 | `referral_bonus_referrer` | `referral:first_login:user_3BlJz9HkQXOBiwnbhBfNX6Zt9St:user_3BlKqpPMQb9Bms1GDpqSYftwzAc` | Explicit `metadata.demo = true`. |

Delete candidate total: `25075` points.

### Real Row to Keep

| `id` | `amount` | `reason` | `external_id` | Decision |
| --- | ---: | --- | --- | --- |
| `5aba4f54-277f-4aba-8a02-c6023b8a5d5b` | 5000 | `referral_locked` | `referral:locked:user_3BlJz9HkQXOBiwnbhBfNX6Zt9St:user_3Csk99zh5Gf4Xl83xN2e4bYGO4Q` | Keep; tied to real candidate relation. |

## 3. Balance Inspection

| Metric | Value |
| --- | ---: |
| Current `user_balances.balance` | 226 |
| Current `SUM(points_transactions.amount)` | 30226 |
| Demo points delete candidate sum | 25075 |
| Expected `SUM(points_transactions.amount)` after candidate cleanup | 5151 |

Important finding: `user_balances` is already stale before cleanup. It does not match the current ledger sum.

The project contains an internal `refreshBalance` function inside `packages/db/src/seedConnectDemo.ts`, but no standalone reviewed balance recalculation utility for this cleanup. Per task constraints, no new recalculation mechanism was invented and no manual `UPDATE user_balances` was executed.

## 4. Proposed Cleanup SQL

This SQL is prepared but was not executed.

```sql
BEGIN;

DELETE FROM points_transactions
WHERE user_id = 'user_3BlJz9HkQXOBiwnbhBfNX6Zt9St'
  AND id IN (
    '68842f9e-32f2-424a-9fb4-b56731acc8d4',
    '3de54631-8eef-41ec-bc9c-de44dc12a957',
    '3f9dba45-02b5-4536-b92f-68065b719941',
    '1010c910-8344-43f0-a03b-7bea00a61bcb',
    'c9c2afc2-cda2-4b2c-93d9-93ab8245a84f',
    'connect_demo_tx_user_3BlJz9HkQXOBiwnbhBfNX6Zt9St_referral_first_login_user_3BlJzL7ria3723paCJRzmC9Ag3c',
    'connect_demo_tx_user_3BlJz9HkQXOBiwnbhBfNX6Zt9St_referral_first_login_user_3BlKqpPMQb9Bms1GDpqSYftwzAc'
  );

DELETE FROM referral_relations
WHERE referrer_id = 'user_3BlJz9HkQXOBiwnbhBfNX6Zt9St'
  AND id IN (
    'connect_demo_referral_user_3BlJz9HkQXOBiwnbhBfNX6Zt9St_user_3BlJzMofRZwsapgjk3Ond72ESn1',
    'connect_demo_referral_user_3BlJz9HkQXOBiwnbhBfNX6Zt9St_user_3BlK8FjaNuSTgxcgX8Lnkeot3Wy',
    'connect_demo_referral_user_3BlJz9HkQXOBiwnbhBfNX6Zt9St_user_3BlJq7WcPpP0wWcEE8MVCEn7ebg',
    'connect_demo_referral_user_3BlJz9HkQXOBiwnbhBfNX6Zt9St_user_3BlJzL7ria3723paCJRzmC9Ag3c',
    'connect_demo_referral_user_3BlJz9HkQXOBiwnbhBfNX6Zt9St_user_3BlKqpPMQb9Bms1GDpqSYftwzAc'
  );

-- Stop here unless a reviewed balance recalculation utility is available.

COMMIT;
```

## 5. Rollback Strategy

Because cleanup was not executed, no rollback is needed.

If executed later, rollback should be prepared before deletion:

- export the seven `points_transactions` rows as JSON/CSV;
- export the five `referral_relations` rows as JSON/CSV;
- capture current `user_balances` and ledger sum;
- run cleanup in one transaction;
- verify remaining referral rows and referral points;
- only then run an approved balance recalculation path.

## 6. Risks

- Deleting the five demo relations without deleting their seven matching points rows would leave stale referral earnings and dashboard activity.
- Deleting the seven points rows without recalculating balance would leave `user_balances` stale.
- `user_balances` is already stale (`226` vs `30226`), so cleanup cannot satisfy the "do not leave inconsistent user_balances" requirement without an approved recalculation step.
- Direct manual balance update is possible SQL-wise, but would violate the task instruction to use an existing utility or stop.

## 7. Cleanup Result

Status: not executed.

Reason:

- referral and points row classification is clear;
- however, balance consistency cannot be safely restored with an existing standalone utility in this pass;
- therefore the controlled cleanup stopped before `DELETE`.

Would delete if approved with balance recalculation:

- referral rows: 5;
- points rows: 7;
- points amount removed from ledger: 25075;
- remaining referral rows: 1;
- expected ledger sum after cleanup: 5151;
- required balance action: reviewed recalculation of `user_balances.balance` for Irina to match the post-cleanup ledger.

Manual follow-up:

1. Approve or create a staging-only balance recalculation utility.
2. Execute the proposed cleanup SQL and recalculation in one reviewed maintenance transaction.
3. Re-check `/connect/referrals` as `irina.belova.seed@example.com`; expected visible referrals: 1.
