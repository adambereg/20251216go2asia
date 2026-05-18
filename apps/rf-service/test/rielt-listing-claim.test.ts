import { beforeEach, describe, expect, it, vi } from 'vitest';

const { createDbMock, executeMock } = vi.hoisted(() => {
  const execute = vi.fn();
  return {
    executeMock: execute,
    createDbMock: vi.fn(() => ({ execute })),
  };
});

vi.mock('@go2asia/db', () => ({
  createDb: createDbMock,
  sql: (strings: TemplateStringsArray, ...values: unknown[]) => ({
    strings: [...strings],
    values,
  }),
}));

import { makeGatewayJwt, readJson } from '../../../tests/helpers/worker-test';
import worker, { type Env } from '../src/index';
import { resetRfStoreForTests } from '../src/store';

function executedSqlText(): string {
  return executeMock.mock.calls
    .map(([query]) => ((query as { strings?: string[] } | undefined)?.strings ?? []).join(' '))
    .join('\n');
}

function listingRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'rielt_listing_1',
    title: 'Rielt Listing',
    rf_partner_id: 'rf_partner_1',
    ...overrides,
  };
}

function listingOfferMappingRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'rf_offer_1',
    partner_id: 'rf_partner_1',
    item_id: null,
    title: 'Listing Welcome Offer',
    offer_type: 'discount',
    visibility: 'public',
    status: 'active',
    repeat_policy: 'once_per_scope',
    points_cost: 150,
    created_by_user_id: 'partner_owner_1',
    created_at: '2026-05-18T10:00:00.000Z',
    updated_at: '2026-05-18T10:01:00.000Z',
    mapping_status: 'active',
    offer_kind: 'basic',
    priority: 10,
    applicability_note: 'Show this RF voucher at the partner.',
    partner_slug: 'rielt-rf-partner',
    partner_display_name: 'Rielt RF Partner',
    partner_country_id: 'country_th',
    partner_city_id: 'city_phuket',
    partner_atlas_place_id: null,
    partner_host_atlas_place_id: null,
    partner_status: 'active',
    partner_owner_user_id: 'partner_owner_1',
    partner_created_at: '2026-05-18T09:00:00.000Z',
    partner_updated_at: '2026-05-18T09:01:00.000Z',
    ...overrides,
  };
}

function listingClaimContextRow(overrides: Record<string, unknown> = {}) {
  return {
    listing_id: 'rielt_listing_1',
    listing_title: 'Rielt Listing',
    listing_rf_partner_id: 'rf_partner_1',
    mapping_partner_id: 'rf_partner_1',
    offer_id: 'rf_offer_1',
    offer_partner_id: 'rf_partner_1',
    offer_status: 'active',
    offer_visibility: 'public',
    offer_repeat_policy: 'once_per_scope',
    offer_points_cost: 150,
    partner_status: 'active',
    ...overrides,
  };
}

function listingVoucherRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'rf_voucher_listing_1',
    offer_id: 'rf_offer_1',
    partner_id: 'rf_partner_1',
    issued_to_user_id: 'user_1',
    status: 'claimed',
    canonical_status: 'available',
    contract_version: 1,
    repeat_policy_snapshot: 'once_per_scope',
    issue_sequence: 1,
    points_cost_snapshot: 150,
    points_debit_external_id: null,
    economy_status: 'pending',
    expires_at: null,
    cancelled_at: null,
    status_changed_at: '2026-05-18T10:02:00.000Z',
    status_reason: null,
    status_actor_user_id: 'user_1',
    attribution_version: 1,
    attribution_strategy: 'rf_pro_last_touch_before_claim',
    attribution_status: 'none',
    attribution_source: 'unknown',
    claim_source: 'unknown',
    attribution_share_code: null,
    pro_attributed_user_id: null,
    pro_link_id: null,
    attribution_captured_at: null,
    attribution_confirmed_at: null,
    attribution_metadata: {},
    claim_scope: 'listing',
    rielt_listing_id: 'rielt_listing_1',
    rielt_listing_title_snapshot: 'Rielt Listing',
    code: 'RF-LISTING-1',
    claimed_at: '2026-05-18T10:02:00.000Z',
    redeemed_at: null,
    created_at: '2026-05-18T10:02:00.000Z',
    updated_at: '2026-05-18T10:02:00.000Z',
    ...overrides,
  };
}

function idempotencyRow(idempotencyKey: string, voucherId = 'rf_voucher_listing_1') {
  return {
    operation: 'voucher_claim',
    actor_user_id: 'user_1',
    idempotency_key: idempotencyKey,
    voucher_id: voucherId,
    created_at: '2026-05-18T10:02:00.000Z',
  };
}

describe('rf-service Rielt listing voucher claim integration', () => {
  beforeEach(() => {
    createDbMock.mockClear();
    executeMock.mockReset();
    resetRfStoreForTests();
  });

  it('reads listing mapped offers with RF pointsCost and display availability only', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };

    executeMock
      .mockResolvedValueOnce({ rows: [listingRow()] })
      .mockResolvedValueOnce({ rows: [listingOfferMappingRow({ points_cost: 150 })] });

    const response = await worker.fetch(new Request('https://rf.example/v1/rf/rielt/listings/rielt_listing_1/offers'), env);
    const body = await readJson<{
      listing: { id: string; rfPartnerId: string };
      offers: Array<{ id: string; pointsCost: number; availability: string; repeatPolicy: string }>;
    }>(response);

    expect(response.status).toBe(200);
    expect(body.listing).toMatchObject({ id: 'rielt_listing_1', rfPartnerId: 'rf_partner_1' });
    expect(body.offers).toHaveLength(1);
    expect(body.offers[0]).toMatchObject({
      id: 'rf_offer_1',
      pointsCost: 150,
      availability: 'available',
      repeatPolicy: 'once_per_scope',
    });
    expect(executedSqlText()).toContain('m.status = ');
    expect(executedSqlText()).toContain('o.visibility = ');
    expect(executedSqlText()).toContain('p.status = ');
  });

  it('omits inactive or hidden mappings from listing offer read', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };

    executeMock
      .mockResolvedValueOnce({ rows: [listingRow()] })
      .mockResolvedValueOnce({ rows: [] });

    const response = await worker.fetch(new Request('https://rf.example/v1/rf/rielt/listings/rielt_listing_1/offers'), env);
    const body = await readJson<{ offers: unknown[] }>(response);

    expect(response.status).toBe(200);
    expect(body.offers).toEqual([]);
    expect(executedSqlText()).toContain('m.status = ');
    expect(executedSqlText()).toContain('o.status = ');
    expect(executedSqlText()).toContain('o.visibility = ');
  });

  it('creates a listing-scoped voucher with listingContext and preserves pointsCostSnapshot', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const userToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });

    executeMock
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [listingClaimContextRow({ offer_points_cost: 150 })] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [listingVoucherRow({ points_cost_snapshot: 150 })] })
      .mockResolvedValueOnce({ rows: [idempotencyRow('listing-claim-1')] });

    const response = await worker.fetch(
      new Request('https://rf.example/v1/rf/rielt/listings/rielt_listing_1/offers/rf_offer_1/claim', {
        method: 'POST',
        headers: {
          'X-Gateway-Auth': userToken,
          'Idempotency-Key': 'listing-claim-1',
        },
      }),
      env
    );
    const body = await readJson<{
      voucher: {
        id: string;
        offerId: string;
        claimScope: string;
        listingContext: { source: string; listingId: string; listingTitle: string };
        pointsCostSnapshot: number;
        canonicalStatus: string;
      };
      idempotentReplay: boolean;
      createdNewInstance: boolean;
      repeatPolicy: string;
    }>(response);

    expect(response.status).toBe(201);
    expect(body.idempotentReplay).toBe(false);
    expect(body.createdNewInstance).toBe(true);
    expect(body.repeatPolicy).toBe('once_per_scope');
    expect(body.voucher).toMatchObject({
      id: 'rf_voucher_listing_1',
      offerId: 'rf_offer_1',
      claimScope: 'listing',
      pointsCostSnapshot: 150,
      canonicalStatus: 'available',
      listingContext: {
        source: 'rielt',
        listingId: 'rielt_listing_1',
        listingTitle: 'Rielt Listing',
      },
    });
  });

  it('replays listing claim idempotently and rejects idempotency context mismatch', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const userToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });

    executeMock
      .mockResolvedValueOnce({ rows: [listingVoucherRow()] })
      .mockResolvedValueOnce({ rows: [listingVoucherRow()] });

    const replay = await worker.fetch(
      new Request('https://rf.example/v1/rf/rielt/listings/rielt_listing_1/offers/rf_offer_1/claim', {
        method: 'POST',
        headers: {
          'X-Gateway-Auth': userToken,
          'Idempotency-Key': 'listing-claim-1',
        },
      }),
      env
    );
    const replayBody = await readJson<{ voucher: { id: string }; idempotentReplay: boolean; createdNewInstance: boolean }>(replay);

    const mismatch = await worker.fetch(
      new Request('https://rf.example/v1/rf/rielt/listings/rielt_listing_2/offers/rf_offer_1/claim', {
        method: 'POST',
        headers: {
          'X-Gateway-Auth': userToken,
          'Idempotency-Key': 'listing-claim-1',
        },
      }),
      env
    );
    const mismatchBody = await readJson<{ error: { code: string } }>(mismatch);

    expect(replay.status).toBe(200);
    expect(replayBody).toMatchObject({
      idempotentReplay: true,
      createdNewInstance: false,
      voucher: { id: 'rf_voucher_listing_1' },
    });
    expect(mismatch.status).toBe(409);
    expect(mismatchBody.error.code).toBe('RF_IDEMPOTENCY_KEY_CONTEXT_MISMATCH');
    expect(executedSqlText()).not.toContain('INSERT INTO rf_voucher');
  });

  it('fails listing claim when mapping is missing or inactive without creating a voucher', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const userToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });

    executeMock
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });

    const response = await worker.fetch(
      new Request('https://rf.example/v1/rf/rielt/listings/rielt_listing_1/offers/rf_offer_hidden/claim', {
        method: 'POST',
        headers: {
          'X-Gateway-Auth': userToken,
          'Idempotency-Key': 'listing-hidden-mapping',
        },
      }),
      env
    );
    const body = await readJson<{ error: { code: string } }>(response);

    expect(response.status).toBe(404);
    expect(body.error.code).toBe('RF_RIELT_LISTING_OFFER_NOT_FOUND');
    expect(executedSqlText()).not.toContain('INSERT INTO rf_voucher');
  });

  it('rejects invalid listing and offer partner relations without creating a voucher', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const userToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });

    executeMock
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [listingClaimContextRow({ offer_partner_id: 'rf_partner_2' })],
      })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [listingClaimContextRow({ listing_rf_partner_id: 'rf_partner_2' })],
      });

    const invalidRelation = await worker.fetch(
      new Request('https://rf.example/v1/rf/rielt/listings/rielt_listing_1/offers/rf_offer_1/claim', {
        method: 'POST',
        headers: {
          'X-Gateway-Auth': userToken,
          'Idempotency-Key': 'listing-invalid-relation',
        },
      }),
      env
    );
    const invalidRelationBody = await readJson<{ error: { code: string } }>(invalidRelation);

    const partnerMismatch = await worker.fetch(
      new Request('https://rf.example/v1/rf/rielt/listings/rielt_listing_1/offers/rf_offer_1/claim', {
        method: 'POST',
        headers: {
          'X-Gateway-Auth': userToken,
          'Idempotency-Key': 'listing-partner-mismatch',
        },
      }),
      env
    );
    const partnerMismatchBody = await readJson<{ error: { code: string } }>(partnerMismatch);

    expect(invalidRelation.status).toBe(409);
    expect(invalidRelationBody.error.code).toBe('RF_RIELT_LISTING_OFFER_RELATION_INVALID');
    expect(partnerMismatch.status).toBe(409);
    expect(partnerMismatchBody.error.code).toBe('RF_RIELT_LISTING_PARTNER_MISMATCH');
    expect(executedSqlText()).not.toContain('INSERT INTO rf_voucher');
  });

  it('keeps listing claim protected while leaving listing offer read public', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };

    const claim = await worker.fetch(
      new Request('https://rf.example/v1/rf/rielt/listings/rielt_listing_1/offers/rf_offer_1/claim', {
        method: 'POST',
        headers: { 'Idempotency-Key': 'listing-auth-check' },
      }),
      env
    );
    const claimBody = await readJson<{ error: { code: string } }>(claim);
    expect(claim.status).toBe(401);
    expect(claimBody.error.code).toBe('UNAUTHORIZED');

    executeMock
      .mockResolvedValueOnce({ rows: [listingRow()] })
      .mockResolvedValueOnce({ rows: [] });

    const read = await worker.fetch(new Request('https://rf.example/v1/rf/rielt/listings/rielt_listing_1/offers'), env);
    const readBody = await readJson<{ offers: unknown[] }>(read);

    expect(read.status).toBe(200);
    expect(readBody.offers).toEqual([]);
  });
});
