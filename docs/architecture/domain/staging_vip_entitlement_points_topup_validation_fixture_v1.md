# Staging VIP Entitlement & Points Top-up Validation Fixture v1

## Status

Status: `validated_with_cloudflare_log_evidence_pending_manual_confirmation`

Date: 2026-05-11

Scope:

- staging only;
- one VIP seed user top-up;
- one paid RF voucher claim;
- no production mutation;
- no Points spend contract change;
- no RF voucher lifecycle change;
- no migrations.

## Agents / Roles Used

- `docs/ai/roles/architect.md`
- `docs/ai/roles/backend_dev.md`
- `docs/ai/roles/security.md`
- `docs/ai/roles/qa.md`
- `docs/ai/roles/devops.md`
- `docs/ai/roles/tech_writer.md`

## Why This Fixture Was Needed

The previous RF paid voucher enforcement alignment fixed staging config drift and restored the RF -> Points bridge.

Observed before this fixture:

- RF paid offers were visible in staging with `Будет списано: N Points`;
- PRO user `oleg.tran.seed@example.com` was correctly blocked by the VIP gate;
- VIP user `kirill.denisov.seed@example.com` reached `/internal/points/spend`;
- Points returned `409` because the user had insufficient Points.

Successful paid claim and spendability export validation required a VIP-compatible seed user with enough Points.

## VIP Runtime Audit

Current RF paid claim gate is still role-derived runtime behavior.

Code evidence:

- RF principal normalization accepts `vip`, `vip-spacer`, and `vip_spacer` as canonical `vip_spacer`;
- RF paid claim enforcement uses `isVipSpacerPrincipal`;
- VIP entitlement shadow compare is observational only and cannot allow or deny a paid claim;
- current entitlement docs explicitly say canonical entitlement enforcement is target/future behavior, not current runtime.

Runtime conclusion:

- `kirill.denisov.seed@example.com` is VIP-compatible in current RF runtime because staging DB role is `vip_spacer`;
- `svetlana.orlova.seed@example.com` is VIP-compatible in current RF runtime because staging DB role is `vip_spacer`;
- this is based on legacy role compatibility, not canonical entitlement authority;
- no temporary legacy role shortcut is needed for staging validation because the current runtime shortcut already exists.

## Balance Audit

Before top-up:

- `kirill.denisov.seed@example.com`: available `0`, locked `0`, network `0`, total `0`, materialized `0`;
- `svetlana.orlova.seed@example.com`: available `0`, locked `0`, network `0`, total `0`, materialized `0`.

After top-up and before paid claim:

- `kirill.denisov.seed@example.com`: available `1000`, locked `0`, network `0`, total `1000`, materialized `1000`;
- `svetlana.orlova.seed@example.com`: unchanged at `0`.

After successful `100 Points staging service perk` claim:

- `kirill.denisov.seed@example.com`: available `900`, locked `0`, network `0`, total `900`, materialized `900`;
- `svetlana.orlova.seed@example.com`: unchanged at `0`.

## Top-up Method

Chosen method: repo-local staging-only DB fixture script.

Reason:

- current `/internal/points/add` action taxonomy has no neutral staging/admin top-up action;
- using production-like actions such as `quest_completed` or `rf_voucher_claimed` would misrepresent test/support semantics;
- the script does not change Points Service runtime action taxonomy or spend contract;
- the script creates one explicitly staging/test transaction reason.

Script:

- `packages/db/src/seedVipPaidVoucherValidationTopup.ts`
- package command: `pnpm -C packages/db run db:seed:vip-paid-voucher-validation-topup`

Fixture transaction:

- target user: `kirill.denisov.seed@example.com`;
- amount: `1000`;
- reason: `staging_vip_paid_voucher_validation_topup`;
- source service: `staging-fixture`;
- external id: `staging:vip-paid-voucher-validation:kirill-denisov-seed:topup:1000:v1`;
- metadata is minimal and fixture-scoped, with no raw JWTs, secrets, DB URLs, or payment details.

Safety guards:

- requires `ENVIRONMENT=staging`;
- refuses `NODE_ENV=production`;
- requires `STAGING_DATABASE_URL`;
- refuses production-like DB URL hints;
- `--apply` and `--verify-only` require `RF_POINTS_TOPUP_CONFIRM=staging`;
- default mode is dry-run;
- apply is idempotent by deterministic `external_id`;
- rerun does not create duplicate transaction and returns `reused`;
- `user_balances` is refreshed from `SUM(points_transactions.amount)` after apply.

## Execution Evidence

Dry-run:

- resolved both VIP seed users;
- confirmed both as `runtime_vip=true`;
- showed Kirill projected available balance `1000`;
- performed no writes.

Apply:

- inserted one top-up transaction;
- Kirill balance became available `1000`, total `1000`, materialized `1000`.

Verify-only:

- confirmed exactly one matching top-up transaction;
- confirmed Kirill available balance after top-up.

Idempotency rerun:

- repeat `--apply` returned `reused`;
- balance remained `1000` before claim;
- no duplicate transaction was created.

## Paid Claim Validation

Claim performed:

- user: `kirill.denisov.seed@example.com`;
- offer: `rf_offer_staging_paid_100_points`;
- display title: `100 Points staging service perk`;
- idempotency key: `staging-vip-topup-validation-kirill-100points-v1`;
- RF request id: `1778518628370-0xlhnko`;
- RF response status: `201`;
- voucher id: `rf_voucher_8c2d945e99c8f53e0c341d82`.

RF persisted voucher evidence:

- status: `claimed`;
- `points_cost_snapshot=100`;
- `points_debit_external_id=rf:voucher-claim-spend:rf_voucher_8c2d945e99c8f53e0c341d82`;
- `economy_status=debited`.

Points persisted spend evidence:

- amount: `-100`;
- reason/action: `rf_voucher_claim_spend`;
- source service: `rf-service`;
- external id: `rf:voucher-claim-spend:rf_voucher_8c2d945e99c8f53e0c341d82`.

Balance evidence after claim:

- Kirill available balance decreased from `1000` to `900`;
- locked and network balances remained `0`;
- materialized balance is `900`.

## Spendability Durable Export Evidence

Cloudflare dashboard log validation is still pending manual confirmation.

Automated Cloudflare Observability access was not available in Cursor for this run:

- Cloudflare Observability MCP returned `Unauthorized`;
- browser automation subagent was unavailable in the current region;
- no Cloudflare secrets or dashboard tokens were printed or requested.

Expected operator confirmation:

1. Open Cloudflare Dashboard -> Workers & Pages -> `go2asia-rf-service-staging` -> Observability.
2. Filter around `2026-05-11T16:57:11+07:00` or request id `1778518628370-0xlhnko`.
3. Confirm RF claim request `POST /v1/rf/offers/rf_offer_staging_paid_100_points/claim` completed successfully.
4. Open `go2asia-points-service-staging` -> Observability.
5. Filter around the same timestamp and voucher/spend external id:
   `rf:voucher-claim-spend:rf_voucher_8c2d945e99c8f53e0c341d82`.
6. Confirm `POST /internal/points/spend`.
7. Confirm `Points spendability durable export`.
8. In the export payload, confirm these safe fields:
   `schemaVersion`, `diagnosticsVersion`, `eventType`, `driftClass`, `reasonCode`, `action=rf_voucher_claim_spend`.
9. Confirm no forbidden fields:
   raw JWT, `Authorization`, service secrets, DB URLs, raw payment details, private profile payloads.

## Known Limits

- VIP entitlement canonical authority is not implemented yet.
- Current RF paid gate remains legacy role compatibility (`vip_spacer`) with optional shadow comparison.
- The staging fixture uses a staging-only transaction reason that is not added to Points Service runtime `/internal/points/add` taxonomy.
- Durable export log evidence was not machine-confirmed during this run due to unavailable authenticated Cloudflare Observability access.

## Rollback / Removal

If the staging fixture must be removed:

1. Delete only the transaction with external id:
   `staging:vip-paid-voucher-validation:kirill-denisov-seed:topup:1000:v1`.
2. Recompute `user_balances.balance` for Kirill from `SUM(points_transactions.amount)`.
3. Do not delete the successful RF paid claim spend transaction unless explicitly rolling back the validation claim and its RF voucher evidence.
4. Keep production untouched.

## Safety Confirmations

- Staging only: yes.
- Production mutation: no.
- Secrets printed: no.
- DB URL printed: no.
- Points spend contract changed: no.
- Wallet response shape changed: no.
- RF voucher lifecycle changed: no.
- Available-only enforcement added: no.
- Migrations added: no.
- Existing unrelated migration `packages/db/migrations/0052_rf_partner_item_catalog_v1.sql` not modified by this task.

