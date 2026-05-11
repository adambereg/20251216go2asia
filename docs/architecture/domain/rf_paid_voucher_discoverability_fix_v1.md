# RF Paid Voucher Discoverability Fix v1

## Scope

This slice fixes a product/runtime ambiguity in RF voucher visibility.

Included:

- runtime audit of paid voucher spend semantics;
- frontend semantic labels for free, Points-compatible free, and paid Points vouchers;
- claim CTA wording for positive Points cost offers;
- tests for classification and copy;
- staging validation support notes.

Not included:

- RF economy redesign;
- Points ledger semantics changes;
- `/internal/points/spend` contract changes;
- RF voucher lifecycle changes;
- available-only enforcement;
- entitlement enforcement rollout;
- G2A/NFT/Totem implementation;
- migrations;
- production-only logic.

## Runtime Truth

`Points-enabled` was an imprecise frontend label. It did not mean that Points spend happened.

Current RF runtime truth:

- `rf_offer.points_cost` is the offer-level Points cost.
- A paid spend voucher is an offer claim where `points_cost > 0` and RF paid spend runtime is enabled.
- RF paid spend runtime is controlled by `RF_ENABLE_PAID_VOUCHER_SPEND`.
- When paid spend runtime is enabled, RF calls Points Service at `/internal/points/spend`.
- The Points action is `rf_voucher_claim_spend`.
- RF sets the spend external id as `rf:voucher-claim-spend:<voucherId>`.
- Paid spend claims require the current VIP role gate in RF (`vip_spacer`).
- If `points_cost = 0`, no Points spend should be expected.

Important distinction:

- `points_cost = 0` can still appear in economy-shaped DTOs because the RF economy schema is present.
- That state is Points-compatible or economy-enabled free, not a paid spend voucher.
- Only `points_cost > 0` is the operator signal for a paid spend validation candidate.

## Ambiguity Found

The previous RF UI helper treated any numeric `pointsCostSnapshot`, including `0`, as `Points-enabled`.

That caused a false operator expectation:

- the voucher looked like it should exercise Points spendability;
- the claim was actually free/economy-compatible;
- `/internal/points/spend` was not called;
- spendability shadow compare and durable export did not run.

This was a real runtime/product ambiguity, not a cosmetic issue.

## UI Semantics

The UI now distinguishes:

- `Бесплатный ваучер` when there is no economy cost signal;
- `Points не требуются` / `Points-compatible free` when RF economy fields exist but cost is `0`;
- `Будет списано: <N> Points` / `Списано: <N> Points` when cost is positive.

The wording avoids payment, cash, payout, earnings, purchase, and other finance semantics. It describes participation and Points spend only.

## Claim CTA

For offer cards:

- free and Points-compatible free offers keep the CTA `Получить ваучер`;
- positive-cost offers show `Получить за <N> Points`;
- positive-cost cards also show a spend semantics badge and hint that VIP/Points spend semantics apply.

This does not change the claim request, idempotency, RF lifecycle, or Points integration. The CTA is derived from existing `pointsCost`.

## Staging Validation Impact

For future Points spendability export validation, operators should select an RF offer where:

- `status = active`;
- `visibility = public`;
- `points_cost > 0`;
- `RF_ENABLE_PAID_VOUCHER_SPEND = true` in staging;
- `POINTS_SERVICE_URL` and service auth are configured;
- the staging user has `vip_spacer`;
- the claim is new or repeatable, not an idempotent replay or existing active voucher barrier.

Expected result:

- RF claim path calls `/internal/points/spend`;
- Points Service receives action `rf_voucher_claim_spend`;
- spendability shadow compare can run if Points flags are enabled;
- durable export can emit `Points spendability durable export` if export flag is enabled.

## Staging Paid Offer Discovery

Automatic staging paid-offer discovery was not completed in this slice.

Observed blockers:

- `https://staging.api.go2asia.space/health` returned `503`;
- `https://staging.api.go2asia.space/v1/rf/offers` returned `503`;
- direct `go2asia-rf-service-staging.workers.dev` request returned `503`;
- Cloudflare bundled Worker code retrieval via MCP hung and was stopped;
- no safe database or service-token access was available in this session.

Manual query for operators:

```sql
SELECT
  o.id AS offer_id,
  o.partner_id,
  p.display_name AS partner,
  o.title,
  o.points_cost,
  o.visibility,
  o.status,
  o.repeat_policy,
  p.status AS partner_status
FROM rf_offer o
JOIN rf_partner p ON p.id = o.partner_id
WHERE o.points_cost > 0
ORDER BY o.updated_at DESC;
```

Guaranteed paid spend validation candidate:

- not confirmed automatically;
- must be selected from staging using the query above or the RF offers API once staging health is restored;
- must satisfy `points_cost > 0`, active/public status, active partner, VIP staging user, and paid spend flags.

## Tests

Added or updated frontend tests cover:

- free offer classification;
- Points-compatible free classification;
- paid spend required classification;
- paid claim CTA text;
- voucher label rendering for pending/debited positive-cost vouchers;
- copy guard against finance wording.

Existing RF backend tests already cover:

- free claims snapshot `pointsCostSnapshot = 0`, `economyStatus = not_required`, no debit external id;
- positive-cost paid claims with spend coupling call `/internal/points/spend`;
- VIP role gate for paid claims;
- idempotency/replay spend safety.

## Known Limits

- Frontend can identify positive `pointsCost`, but it cannot know from public DTOs whether staging `RF_ENABLE_PAID_VOUCHER_SPEND` is currently enabled.
- Positive-cost offers with paid spend flag off become economy `pending` in RF runtime and do not exercise Points spend.
- Staging discovery still requires working staging API, log access, or database read access.
- This slice does not create or seed paid offers.

## Next Recommendations

1. Restore or confirm staging RF API health.
2. Run the paid-offer SQL query or public RF offer listing after health is restored.
3. Record at least one paid staging offer id in the spendability export validation evidence.
4. Use a VIP staging user and unique claim idempotency key to trigger a real paid claim.
5. Confirm `/internal/points/spend` and durable export with safe aggregate logs only.

