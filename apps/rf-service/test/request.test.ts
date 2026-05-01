import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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

describe('rf-service request', () => {
  beforeEach(() => {
    createDbMock.mockClear();
    executeMock.mockReset();
    resetRfStoreForTests();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns readiness checks for required dependencies', async () => {
    const response = await worker.fetch(new Request('https://rf.example/ready'), {});
    const body = await readJson<{ status: string; missing: string[] }>(response);
    expect(response.status).toBe(503);
    expect(body.status).toBe('not_ready');
    expect(body.missing).toEqual(['databaseUrl', 'serviceJwtSecret']);
  });

  it('creates partner and exposes it via public partner list', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const ownerToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'partner_owner_1' });

    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_partner_1',
            slug: 'phuket-family-cafe',
            display_name: 'Phuket Family Cafe',
            country_id: 'country_th',
            city_id: 'city_phuket',
            status: 'active',
            owner_user_id: 'partner_owner_1',
            created_at: '2026-03-21T10:00:00.000Z',
            updated_at: '2026-03-21T10:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_partner_1',
            slug: 'phuket-family-cafe',
            display_name: 'Phuket Family Cafe',
            country_id: 'country_th',
            city_id: 'city_phuket',
            status: 'active',
            owner_user_id: 'partner_owner_1',
            created_at: '2026-03-21T10:00:00.000Z',
            updated_at: '2026-03-21T10:00:00.000Z',
          },
        ],
      });

    const create = await worker.fetch(
      new Request('https://rf.example/v1/rf/business/partners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': ownerToken,
        },
        body: JSON.stringify({
          displayName: 'Phuket Family Cafe',
          countryId: 'country_th',
          cityId: 'city_phuket',
        }),
      }),
      env
    );
    expect(create.status).toBe(201);

    const list = await worker.fetch(new Request('https://rf.example/v1/rf/partners'), env);
    const listBody = await readJson<{ items: Array<{ displayName: string }> }>(list);
    expect(list.status).toBe(200);
    expect(listBody.items).toEqual(
      expect.arrayContaining([expect.objectContaining({ displayName: 'Phuket Family Cafe' })])
    );
  });

  it('enforces protected route auth for partner create', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const response = await worker.fetch(
      new Request('https://rf.example/v1/rf/business/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: 'Unauthorized Partner',
          countryId: 'country_th',
          cityId: 'city_phuket',
        }),
      }),
      env
    );
    const body = await readJson<{ error: { code: string } }>(response);
    expect(response.status).toBe(401);
    expect(body.error.code).toBe('UNAUTHORIZED');
  });

  it('supports claim idempotency and terminal redeem semantics with DB-backed store', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const ownerToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'partner_owner_1' });
    const userToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });

    executeMock
      // create partner
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_partner_1',
            slug: 'voucher-partner',
            display_name: 'Voucher Partner',
            country_id: 'country_th',
            city_id: 'city_phuket',
            status: 'active',
            owner_user_id: 'partner_owner_1',
            created_at: '2026-03-21T10:00:00.000Z',
            updated_at: '2026-03-21T10:00:00.000Z',
          },
        ],
      })
      // create offer: partner owner check
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_partner_1',
            slug: 'voucher-partner',
            display_name: 'Voucher Partner',
            country_id: 'country_th',
            city_id: 'city_phuket',
            status: 'active',
            owner_user_id: 'partner_owner_1',
            created_at: '2026-03-21T10:00:00.000Z',
            updated_at: '2026-03-21T10:00:00.000Z',
          },
        ],
      })
      // create offer insert
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_offer_1',
            partner_id: 'rf_partner_1',
            title: 'Welcome Coffee',
            offer_type: 'discount',
            visibility: 'public',
            status: 'draft',
            created_by_user_id: 'partner_owner_1',
            created_at: '2026-03-21T10:01:00.000Z',
            updated_at: '2026-03-21T10:01:00.000Z',
          },
        ],
      })
      // activate offer: partner owner check
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_partner_1',
            slug: 'voucher-partner',
            display_name: 'Voucher Partner',
            country_id: 'country_th',
            city_id: 'city_phuket',
            status: 'active',
            owner_user_id: 'partner_owner_1',
            created_at: '2026-03-21T10:00:00.000Z',
            updated_at: '2026-03-21T10:00:00.000Z',
          },
        ],
      })
      // activate offer: get offer
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_offer_1',
            partner_id: 'rf_partner_1',
            title: 'Welcome Coffee',
            offer_type: 'discount',
            visibility: 'public',
            status: 'draft',
            created_by_user_id: 'partner_owner_1',
            created_at: '2026-03-21T10:01:00.000Z',
            updated_at: '2026-03-21T10:01:00.000Z',
          },
        ],
      })
      // activate offer: update
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_offer_1',
            partner_id: 'rf_partner_1',
            title: 'Welcome Coffee',
            offer_type: 'discount',
            visibility: 'public',
            status: 'active',
            created_by_user_id: 'partner_owner_1',
            created_at: '2026-03-21T10:01:00.000Z',
            updated_at: '2026-03-21T10:02:00.000Z',
          },
        ],
      })
      // claim #1: idempotency lookup
      .mockResolvedValueOnce({ rows: [] })
      // claim #1: offer lookup
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_offer_1',
            partner_id: 'rf_partner_1',
            title: 'Welcome Coffee',
            offer_type: 'discount',
            visibility: 'public',
            status: 'active',
            created_by_user_id: 'partner_owner_1',
            created_at: '2026-03-21T10:01:00.000Z',
            updated_at: '2026-03-21T10:02:00.000Z',
          },
        ],
      })
      // claim #1: active partner check
      .mockResolvedValueOnce({
        rows: [{ id: 'rf_partner_1' }],
      })
      // claim #1: existing voucher lookup
      .mockResolvedValueOnce({ rows: [] })
      // claim #1: insert voucher
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_voucher_1',
            offer_id: 'rf_offer_1',
            partner_id: 'rf_partner_1',
            issued_to_user_id: 'user_1',
            status: 'claimed',
            code: 'RF-000001',
            claimed_at: '2026-03-21T10:03:00.000Z',
            redeemed_at: null,
            created_at: '2026-03-21T10:03:00.000Z',
            updated_at: '2026-03-21T10:03:00.000Z',
          },
        ],
      })
      // claim #1: insert claim idempotency
      .mockResolvedValueOnce({
        rows: [
          {
            operation: 'voucher_claim',
            actor_user_id: 'user_1',
            idempotency_key: 'claim-1',
            voucher_id: 'rf_voucher_1',
            created_at: '2026-03-21T10:03:00.000Z',
          },
        ],
      })
      // claim #2: idempotency replay lookup
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_voucher_1',
            offer_id: 'rf_offer_1',
            partner_id: 'rf_partner_1',
            issued_to_user_id: 'user_1',
            status: 'claimed',
            code: 'RF-000001',
            claimed_at: '2026-03-21T10:03:00.000Z',
            redeemed_at: null,
            created_at: '2026-03-21T10:03:00.000Z',
            updated_at: '2026-03-21T10:03:00.000Z',
          },
        ],
      })
      // redeem #1: partner owner check
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_partner_1',
            slug: 'voucher-partner',
            display_name: 'Voucher Partner',
            country_id: 'country_th',
            city_id: 'city_phuket',
            status: 'active',
            owner_user_id: 'partner_owner_1',
            created_at: '2026-03-21T10:00:00.000Z',
            updated_at: '2026-03-21T10:00:00.000Z',
          },
        ],
      })
      // redeem #1: voucher lookup
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_voucher_1',
            offer_id: 'rf_offer_1',
            partner_id: 'rf_partner_1',
            issued_to_user_id: 'user_1',
            status: 'claimed',
            code: 'RF-000001',
            claimed_at: '2026-03-21T10:03:00.000Z',
            redeemed_at: null,
            created_at: '2026-03-21T10:03:00.000Z',
            updated_at: '2026-03-21T10:03:00.000Z',
          },
        ],
      })
      // redeem #1: offer relation lookup
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_offer_1',
            partner_id: 'rf_partner_1',
            title: 'Welcome Coffee',
            offer_type: 'discount',
            visibility: 'public',
            status: 'active',
            created_by_user_id: 'partner_owner_1',
            created_at: '2026-03-21T10:01:00.000Z',
            updated_at: '2026-03-21T10:02:00.000Z',
          },
        ],
      })
      // redeem #1: update voucher -> redeemed
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_voucher_1',
            offer_id: 'rf_offer_1',
            partner_id: 'rf_partner_1',
            issued_to_user_id: 'user_1',
            status: 'redeemed',
            code: 'RF-000001',
            claimed_at: '2026-03-21T10:03:00.000Z',
            redeemed_at: '2026-03-21T10:04:00.000Z',
            created_at: '2026-03-21T10:03:00.000Z',
            updated_at: '2026-03-21T10:04:00.000Z',
          },
        ],
      })
      // redeem #2: partner owner check
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_partner_1',
            slug: 'voucher-partner',
            display_name: 'Voucher Partner',
            country_id: 'country_th',
            city_id: 'city_phuket',
            status: 'active',
            owner_user_id: 'partner_owner_1',
            created_at: '2026-03-21T10:00:00.000Z',
            updated_at: '2026-03-21T10:00:00.000Z',
          },
        ],
      })
      // redeem #2: voucher lookup returns redeemed
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_voucher_1',
            offer_id: 'rf_offer_1',
            partner_id: 'rf_partner_1',
            issued_to_user_id: 'user_1',
            status: 'redeemed',
            code: 'RF-000001',
            claimed_at: '2026-03-21T10:03:00.000Z',
            redeemed_at: '2026-03-21T10:04:00.000Z',
            created_at: '2026-03-21T10:03:00.000Z',
            updated_at: '2026-03-21T10:04:00.000Z',
          },
        ],
      });

    const createdPartner = await worker.fetch(
      new Request('https://rf.example/v1/rf/business/partners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': ownerToken,
        },
        body: JSON.stringify({
          displayName: 'Voucher Partner',
          countryId: 'country_th',
          cityId: 'city_phuket',
        }),
      }),
      env
    );
    const partner = await readJson<{ id: string }>(createdPartner);

    const createdOffer = await worker.fetch(
      new Request(`https://rf.example/v1/rf/business/partners/${partner.id}/offers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': ownerToken,
        },
        body: JSON.stringify({
          title: 'Welcome Coffee',
          offerType: 'discount',
          visibility: 'public',
        }),
      }),
      env
    );
    const offer = await readJson<{ id: string }>(createdOffer);

    const activated = await worker.fetch(
      new Request(`https://rf.example/v1/rf/business/partners/${partner.id}/offers/${offer.id}/activate`, {
        method: 'POST',
        headers: {
          'X-Gateway-Auth': ownerToken,
        },
      }),
      env
    );
    expect(activated.status).toBe(200);

    const claim1 = await worker.fetch(
      new Request(`https://rf.example/v1/rf/offers/${offer.id}/claim`, {
        method: 'POST',
        headers: {
          'X-Gateway-Auth': userToken,
          'Idempotency-Key': 'claim-1',
        },
      }),
      env
    );
    const claim1Body = await readJson<{ voucher: { id: string }; idempotentReplay: boolean }>(claim1);
    expect(claim1.status).toBe(201);
    expect(claim1Body.idempotentReplay).toBe(false);

    const claim2 = await worker.fetch(
      new Request(`https://rf.example/v1/rf/offers/${offer.id}/claim`, {
        method: 'POST',
        headers: {
          'X-Gateway-Auth': userToken,
          'Idempotency-Key': 'claim-1',
        },
      }),
      env
    );
    const claim2Body = await readJson<{ voucher: { id: string }; idempotentReplay: boolean }>(claim2);
    expect(claim2.status).toBe(200);
    expect(claim2Body.idempotentReplay).toBe(true);
    expect(claim2Body.voucher.id).toBe(claim1Body.voucher.id);

    const redeem1 = await worker.fetch(
      new Request(`https://rf.example/v1/rf/business/partners/${partner.id}/vouchers/${claim1Body.voucher.id}/redeem`, {
        method: 'POST',
        headers: {
          'X-Gateway-Auth': ownerToken,
        },
      }),
      env
    );
    const redeem1Body = await readJson<{ applied: boolean; voucher: { status: string } }>(redeem1);
    expect(redeem1.status).toBe(200);
    expect(redeem1Body.applied).toBe(true);
    expect(redeem1Body.voucher.status).toBe('redeemed');

    const redeem2 = await worker.fetch(
      new Request(`https://rf.example/v1/rf/business/partners/${partner.id}/vouchers/${claim1Body.voucher.id}/redeem`, {
        method: 'POST',
        headers: {
          'X-Gateway-Auth': ownerToken,
        },
      }),
      env
    );
    const redeem2Body = await readJson<{ applied: boolean; voucher: { status: string } }>(redeem2);
    expect(redeem2.status).toBe(200);
    expect(redeem2Body.applied).toBe(false);
    expect(redeem2Body.voucher.status).toBe('redeemed');
  });

  it('enforces auth on claim/redeem protected routes', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };

    const claim = await worker.fetch(
      new Request('https://rf.example/v1/rf/offers/rf_offer_1/claim', {
        method: 'POST',
        headers: { 'Idempotency-Key': 'claim-auth-check' },
      }),
      env
    );
    const claimBody = await readJson<{ error: { code: string } }>(claim);
    expect(claim.status).toBe(401);
    expect(claimBody.error.code).toBe('UNAUTHORIZED');

    const redeem = await worker.fetch(
      new Request('https://rf.example/v1/rf/business/partners/rf_partner_1/vouchers/rf_voucher_1/redeem', {
        method: 'POST',
      }),
      env
    );
    const redeemBody = await readJson<{ error: { code: string } }>(redeem);
    expect(redeem.status).toBe(401);
    expect(redeemBody.error.code).toBe('UNAUTHORIZED');
  });

  it('fails claim for non-existing, inactive and non-public offers', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const userToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });

    executeMock
      // claim (missing offer): idempotency lookup, offer lookup
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      // claim (inactive offer): idempotency lookup, offer lookup
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_offer_inactive',
            partner_id: 'rf_partner_1',
            title: 'Inactive Offer',
            offer_type: 'discount',
            visibility: 'public',
            status: 'draft',
            created_by_user_id: 'partner_owner_1',
            created_at: '2026-03-21T10:01:00.000Z',
            updated_at: '2026-03-21T10:01:00.000Z',
          },
        ],
      })
      // claim (non-public offer): idempotency lookup, offer lookup
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_offer_private',
            partner_id: 'rf_partner_1',
            title: 'Private Offer',
            offer_type: 'discount',
            visibility: 'pro_only',
            status: 'active',
            created_by_user_id: 'partner_owner_1',
            created_at: '2026-03-21T10:01:00.000Z',
            updated_at: '2026-03-21T10:01:00.000Z',
          },
        ],
      });

    const missing = await worker.fetch(
      new Request('https://rf.example/v1/rf/offers/rf_offer_missing/claim', {
        method: 'POST',
        headers: {
          'X-Gateway-Auth': userToken,
          'Idempotency-Key': 'claim-missing-offer',
        },
      }),
      env
    );
    const missingBody = await readJson<{ error: { code: string } }>(missing);
    expect(missing.status).toBe(404);
    expect(missingBody.error.code).toBe('RF_OFFER_NOT_FOUND');

    const inactive = await worker.fetch(
      new Request('https://rf.example/v1/rf/offers/rf_offer_inactive/claim', {
        method: 'POST',
        headers: {
          'X-Gateway-Auth': userToken,
          'Idempotency-Key': 'claim-inactive-offer',
        },
      }),
      env
    );
    const inactiveBody = await readJson<{ error: { code: string } }>(inactive);
    expect(inactive.status).toBe(409);
    expect(inactiveBody.error.code).toBe('RF_OFFER_INACTIVE');

    const nonPublic = await worker.fetch(
      new Request('https://rf.example/v1/rf/offers/rf_offer_private/claim', {
        method: 'POST',
        headers: {
          'X-Gateway-Auth': userToken,
          'Idempotency-Key': 'claim-non-public-offer',
        },
      }),
      env
    );
    const nonPublicBody = await readJson<{ error: { code: string } }>(nonPublic);
    expect(nonPublic.status).toBe(409);
    expect(nonPublicBody.error.code).toBe('RF_OFFER_NOT_CLAIMABLE');
  });

  it('keeps claim deterministic for repeated request with different idempotency key', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const userToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });

    executeMock
      // claim #1
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_offer_1',
            partner_id: 'rf_partner_1',
            title: 'Welcome Coffee',
            offer_type: 'discount',
            visibility: 'public',
            status: 'active',
            created_by_user_id: 'partner_owner_1',
            created_at: '2026-03-21T10:01:00.000Z',
            updated_at: '2026-03-21T10:01:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [{ id: 'rf_partner_1' }] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_voucher_1',
            offer_id: 'rf_offer_1',
            partner_id: 'rf_partner_1',
            issued_to_user_id: 'user_1',
            status: 'claimed',
            code: 'RF-000001',
            claimed_at: '2026-03-21T10:03:00.000Z',
            redeemed_at: null,
            created_at: '2026-03-21T10:03:00.000Z',
            updated_at: '2026-03-21T10:03:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            operation: 'voucher_claim',
            actor_user_id: 'user_1',
            idempotency_key: 'claim-key-1',
            voucher_id: 'rf_voucher_1',
            created_at: '2026-03-21T10:03:00.000Z',
          },
        ],
      })
      // claim #2 (different key, same user+offer)
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_offer_1',
            partner_id: 'rf_partner_1',
            title: 'Welcome Coffee',
            offer_type: 'discount',
            visibility: 'public',
            status: 'active',
            created_by_user_id: 'partner_owner_1',
            created_at: '2026-03-21T10:01:00.000Z',
            updated_at: '2026-03-21T10:01:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [{ id: 'rf_partner_1' }] })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_voucher_1',
            offer_id: 'rf_offer_1',
            partner_id: 'rf_partner_1',
            issued_to_user_id: 'user_1',
            status: 'claimed',
            code: 'RF-000001',
            claimed_at: '2026-03-21T10:03:00.000Z',
            redeemed_at: null,
            created_at: '2026-03-21T10:03:00.000Z',
            updated_at: '2026-03-21T10:03:00.000Z',
          },
        ],
      });

    const claim1 = await worker.fetch(
      new Request('https://rf.example/v1/rf/offers/rf_offer_1/claim', {
        method: 'POST',
        headers: {
          'X-Gateway-Auth': userToken,
          'Idempotency-Key': 'claim-key-1',
        },
      }),
      env
    );
    const claim1Body = await readJson<{ voucher: { id: string; status: string }; idempotentReplay: boolean }>(claim1);
    expect(claim1.status).toBe(201);
    expect(claim1Body.voucher.status).toBe('claimed');

    const claim2 = await worker.fetch(
      new Request('https://rf.example/v1/rf/offers/rf_offer_1/claim', {
        method: 'POST',
        headers: {
          'X-Gateway-Auth': userToken,
          'Idempotency-Key': 'claim-key-2',
        },
      }),
      env
    );
    const claim2Body = await readJson<{ voucher: { id: string; status: string }; idempotentReplay: boolean }>(claim2);
    expect(claim2.status).toBe(201);
    expect(claim2Body.idempotentReplay).toBe(false);
    expect(claim2Body.voucher.id).toBe(claim1Body.voucher.id);
    expect(claim2Body.voucher.status).toBe('claimed');
  });

  it('validates redeem ownership and invalid voucher status', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const wrongOwnerToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'partner_owner_2' });
    const ownerToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'partner_owner_1' });

    executeMock
      // wrong owner: owned partner check
      .mockResolvedValueOnce({ rows: [] })
      // cancelled voucher path: owned partner check
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_partner_1',
            slug: 'voucher-partner',
            display_name: 'Voucher Partner',
            country_id: 'country_th',
            city_id: 'city_phuket',
            status: 'active',
            owner_user_id: 'partner_owner_1',
            created_at: '2026-03-21T10:00:00.000Z',
            updated_at: '2026-03-21T10:00:00.000Z',
          },
        ],
      })
      // cancelled voucher path: voucher lookup
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_voucher_cancelled',
            offer_id: 'rf_offer_1',
            partner_id: 'rf_partner_1',
            issued_to_user_id: 'user_1',
            status: 'cancelled',
            code: 'RF-000999',
            claimed_at: '2026-03-21T10:03:00.000Z',
            redeemed_at: null,
            created_at: '2026-03-21T10:03:00.000Z',
            updated_at: '2026-03-21T10:03:00.000Z',
          },
        ],
      });

    const wrongOwnerRedeem = await worker.fetch(
      new Request('https://rf.example/v1/rf/business/partners/rf_partner_1/vouchers/rf_voucher_1/redeem', {
        method: 'POST',
        headers: {
          'X-Gateway-Auth': wrongOwnerToken,
        },
      }),
      env
    );
    const wrongOwnerBody = await readJson<{ error: { code: string } }>(wrongOwnerRedeem);
    expect(wrongOwnerRedeem.status).toBe(404);
    expect(wrongOwnerBody.error.code).toBe('RF_PARTNER_NOT_FOUND');

    const cancelledRedeem = await worker.fetch(
      new Request('https://rf.example/v1/rf/business/partners/rf_partner_1/vouchers/rf_voucher_cancelled/redeem', {
        method: 'POST',
        headers: {
          'X-Gateway-Auth': ownerToken,
        },
      }),
      env
    );
    const cancelledBody = await readJson<{ error: { code: string } }>(cancelledRedeem);
    expect(cancelledRedeem.status).toBe(409);
    expect(cancelledBody.error.code).toBe('RF_VOUCHER_CANCELLED');
  });

  it('rejects redeem when voucher and offer relation is inconsistent', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const ownerToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'partner_owner_1' });

    executeMock
      // owned partner check
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_partner_1',
            slug: 'voucher-partner',
            display_name: 'Voucher Partner',
            country_id: 'country_th',
            city_id: 'city_phuket',
            status: 'active',
            owner_user_id: 'partner_owner_1',
            created_at: '2026-03-21T10:00:00.000Z',
            updated_at: '2026-03-21T10:00:00.000Z',
          },
        ],
      })
      // voucher lookup (claimed)
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_voucher_1',
            offer_id: 'rf_offer_1',
            partner_id: 'rf_partner_1',
            issued_to_user_id: 'user_1',
            status: 'claimed',
            code: 'RF-000001',
            claimed_at: '2026-03-21T10:03:00.000Z',
            redeemed_at: null,
            created_at: '2026-03-21T10:03:00.000Z',
            updated_at: '2026-03-21T10:03:00.000Z',
          },
        ],
      })
      // offer lookup with inconsistent partner relation
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_offer_1',
            partner_id: 'rf_partner_other',
            title: 'Welcome Coffee',
            offer_type: 'discount',
            visibility: 'public',
            status: 'active',
            created_by_user_id: 'partner_owner_1',
            created_at: '2026-03-21T10:01:00.000Z',
            updated_at: '2026-03-21T10:02:00.000Z',
          },
        ],
      });

    const redeem = await worker.fetch(
      new Request('https://rf.example/v1/rf/business/partners/rf_partner_1/vouchers/rf_voucher_1/redeem', {
        method: 'POST',
        headers: {
          'X-Gateway-Auth': ownerToken,
        },
      }),
      env
    );
    const body = await readJson<{ error: { code: string } }>(redeem);
    expect(redeem.status).toBe(409);
    expect(body.error.code).toBe('RF_VOUCHER_RELATION_INVALID');
  });

  it('rejects Idempotency-Key longer than storage limit', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const userToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });
    const longKey = 'x'.repeat(161);

    const response = await worker.fetch(
      new Request('https://rf.example/v1/rf/offers/rf_offer_1/claim', {
        method: 'POST',
        headers: {
          'X-Gateway-Auth': userToken,
          'Idempotency-Key': longKey,
        },
      }),
      env
    );
    const body = await readJson<{ error: { code: string } }>(response);
    expect(response.status).toBe(400);
    expect(body.error.code).toBe('INVALID_IDEMPOTENCY_KEY');
  });

  it('requires auth for voucher summary', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };

    const response = await worker.fetch(new Request('https://rf.example/v1/rf/me/vouchers/summary'), env);
    const body = await readJson<{ error: { code: string } }>(response);

    expect(response.status).toBe(401);
    expect(body.error.code).toBe('UNAUTHORIZED');
    expect(executeMock).not.toHaveBeenCalled();
  });

  it('returns zero voucher summary for current user with no vouchers', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const userToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });

    executeMock.mockResolvedValueOnce({
      rows: [
        {
          total_vouchers: 0,
          active_vouchers: 0,
          used_vouchers: 0,
          cancelled_vouchers: 0,
        },
      ],
    });

    const response = await worker.fetch(
      new Request('https://rf.example/v1/rf/me/vouchers/summary', {
        headers: {
          'X-Gateway-Auth': userToken,
        },
      }),
      env
    );
    const body = await readJson<{
      totalVouchers: number;
      activeVouchers: number;
      usedVouchers: number;
      cancelledVouchers: number;
    }>(response);

    expect(response.status).toBe(200);
    expect(body).toEqual({
      totalVouchers: 0,
      activeVouchers: 0,
      usedVouchers: 0,
      cancelledVouchers: 0,
    });
    expect(executeMock).toHaveBeenCalledTimes(1);
    expect(executeMock.mock.calls[0]?.[0]?.values).toEqual(['user_1']);
  });

  it('counts current user voucher summary by RF runtime status', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const userToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });

    executeMock.mockResolvedValueOnce({
      rows: [
        {
          total_vouchers: 4,
          active_vouchers: 2,
          used_vouchers: 1,
          cancelled_vouchers: 1,
        },
      ],
    });

    const response = await worker.fetch(
      new Request('https://rf.example/v1/rf/me/vouchers/summary', {
        headers: {
          'X-Gateway-Auth': userToken,
        },
      }),
      env
    );
    const body = await readJson<{
      totalVouchers: number;
      activeVouchers: number;
      usedVouchers: number;
      cancelledVouchers: number;
    }>(response);

    expect(response.status).toBe(200);
    expect(body).toEqual({
      totalVouchers: 4,
      activeVouchers: 2,
      usedVouchers: 1,
      cancelledVouchers: 1,
    });
    expect(executeMock).toHaveBeenCalledTimes(1);
    expect(executeMock.mock.calls[0]?.[0]?.values).toEqual(['user_1']);
  });

  it('claims a listing-scoped voucher and replays it idempotently', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const userToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });

    executeMock
      // claim #1: idempotency lookup
      .mockResolvedValueOnce({ rows: [] })
      // claim #1: listing/mapping/offer/partner context
      .mockResolvedValueOnce({
        rows: [
          {
            listing_id: 'rielt_phuket_karon_002',
            listing_title: 'Семейные апартаменты в Кароне',
            listing_rf_partner_id: 'rf_partner_1',
            mapping_partner_id: 'rf_partner_1',
            offer_id: 'rf_offer_1',
            offer_partner_id: 'rf_partner_1',
            offer_status: 'active',
            offer_visibility: 'public',
            partner_status: 'active',
          },
        ],
      })
      // claim #1: existing listing voucher lookup
      .mockResolvedValueOnce({ rows: [] })
      // claim #1: existing partner voucher lookup
      .mockResolvedValueOnce({ rows: [] })
      // claim #1: insert listing voucher
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_voucher_listing_1',
            offer_id: 'rf_offer_1',
            partner_id: 'rf_partner_1',
            issued_to_user_id: 'user_1',
            status: 'claimed',
            claim_scope: 'listing',
            rielt_listing_id: 'rielt_phuket_karon_002',
            rielt_listing_title_snapshot: 'Семейные апартаменты в Кароне',
            code: 'RF-LIST01',
            claimed_at: '2026-03-21T10:03:00.000Z',
            redeemed_at: null,
            created_at: '2026-03-21T10:03:00.000Z',
            updated_at: '2026-03-21T10:03:00.000Z',
          },
        ],
      })
      // claim #1: insert claim idempotency
      .mockResolvedValueOnce({
        rows: [
          {
            operation: 'voucher_claim',
            actor_user_id: 'user_1',
            idempotency_key: 'listing-claim-1',
            voucher_id: 'rf_voucher_listing_1',
            created_at: '2026-03-21T10:03:00.000Z',
          },
        ],
      })
      // claim #2: idempotency replay lookup
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_voucher_listing_1',
            offer_id: 'rf_offer_1',
            partner_id: 'rf_partner_1',
            issued_to_user_id: 'user_1',
            status: 'claimed',
            claim_scope: 'listing',
            rielt_listing_id: 'rielt_phuket_karon_002',
            rielt_listing_title_snapshot: 'Семейные апартаменты в Кароне',
            code: 'RF-LIST01',
            claimed_at: '2026-03-21T10:03:00.000Z',
            redeemed_at: null,
            created_at: '2026-03-21T10:03:00.000Z',
            updated_at: '2026-03-21T10:03:00.000Z',
          },
        ],
      });

    const claim1 = await worker.fetch(
      new Request('https://rf.example/v1/rf/rielt/listings/rielt_phuket_karon_002/offers/rf_offer_1/claim', {
        method: 'POST',
        headers: {
          'X-Gateway-Auth': userToken,
          'Idempotency-Key': 'listing-claim-1',
        },
      }),
      env
    );
    const claim1Body = await readJson<{
      voucher: { id: string; claimScope: string; listingContext: { listingId: string; listingTitle: string | null } | null };
      idempotentReplay: boolean;
    }>(claim1);
    expect(claim1.status).toBe(201);
    expect(claim1Body.idempotentReplay).toBe(false);
    expect(claim1Body.voucher).toEqual(
      expect.objectContaining({
        id: 'rf_voucher_listing_1',
        claimScope: 'listing',
        listingContext: {
          source: 'rielt',
          listingId: 'rielt_phuket_karon_002',
          listingTitle: 'Семейные апартаменты в Кароне',
        },
      })
    );

    const claim2 = await worker.fetch(
      new Request('https://rf.example/v1/rf/rielt/listings/rielt_phuket_karon_002/offers/rf_offer_1/claim', {
        method: 'POST',
        headers: {
          'X-Gateway-Auth': userToken,
          'Idempotency-Key': 'listing-claim-1',
        },
      }),
      env
    );
    const claim2Body = await readJson<{ voucher: { id: string; claimScope: string }; idempotentReplay: boolean }>(claim2);
    expect(claim2.status).toBe(200);
    expect(claim2Body.idempotentReplay).toBe(true);
    expect(claim2Body.voucher.id).toBe('rf_voucher_listing_1');
    expect(claim2Body.voucher.claimScope).toBe('listing');
  });

  it('allows partner-scope and listing-scoped claims for the same offer', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const userToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });

    executeMock
      // partner claim
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_offer_1',
            partner_id: 'rf_partner_1',
            title: 'Welcome Coffee',
            offer_type: 'discount',
            visibility: 'public',
            status: 'active',
            created_by_user_id: 'partner_owner_1',
            created_at: '2026-03-21T10:01:00.000Z',
            updated_at: '2026-03-21T10:01:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [{ id: 'rf_partner_1' }] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_voucher_partner_1',
            offer_id: 'rf_offer_1',
            partner_id: 'rf_partner_1',
            issued_to_user_id: 'user_1',
            status: 'claimed',
            claim_scope: 'partner',
            rielt_listing_id: null,
            rielt_listing_title_snapshot: null,
            code: 'RF-PART01',
            claimed_at: '2026-03-21T10:03:00.000Z',
            redeemed_at: null,
            created_at: '2026-03-21T10:03:00.000Z',
            updated_at: '2026-03-21T10:03:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            operation: 'voucher_claim',
            actor_user_id: 'user_1',
            idempotency_key: 'partner-claim-before-listing',
            voucher_id: 'rf_voucher_partner_1',
            created_at: '2026-03-21T10:03:00.000Z',
          },
        ],
      })
      // listing claim for the same offer
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          {
            listing_id: 'rielt_phuket_karon_002',
            listing_title: 'Семейные апартаменты в Кароне',
            listing_rf_partner_id: 'rf_partner_1',
            mapping_partner_id: 'rf_partner_1',
            offer_id: 'rf_offer_1',
            offer_partner_id: 'rf_partner_1',
            offer_status: 'active',
            offer_visibility: 'public',
            partner_status: 'active',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_voucher_listing_1',
            offer_id: 'rf_offer_1',
            partner_id: 'rf_partner_1',
            issued_to_user_id: 'user_1',
            status: 'claimed',
            claim_scope: 'listing',
            rielt_listing_id: 'rielt_phuket_karon_002',
            rielt_listing_title_snapshot: 'Семейные апартаменты в Кароне',
            code: 'RF-LIST01',
            claimed_at: '2026-03-21T10:03:00.000Z',
            redeemed_at: null,
            created_at: '2026-03-21T10:03:00.000Z',
            updated_at: '2026-03-21T10:03:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            operation: 'voucher_claim',
            actor_user_id: 'user_1',
            idempotency_key: 'listing-claim-after-partner',
            voucher_id: 'rf_voucher_listing_1',
            created_at: '2026-03-21T10:03:00.000Z',
          },
        ],
      });

    const partnerClaim = await worker.fetch(
      new Request('https://rf.example/v1/rf/offers/rf_offer_1/claim', {
        method: 'POST',
        headers: {
          'X-Gateway-Auth': userToken,
          'Idempotency-Key': 'partner-claim-before-listing',
        },
      }),
      env
    );
    const partnerBody = await readJson<{ voucher: { id: string; claimScope: string }; idempotentReplay: boolean }>(partnerClaim);
    expect(partnerClaim.status).toBe(201);
    expect(partnerBody.voucher).toEqual(expect.objectContaining({ id: 'rf_voucher_partner_1', claimScope: 'partner' }));

    const response = await worker.fetch(
      new Request('https://rf.example/v1/rf/rielt/listings/rielt_phuket_karon_002/offers/rf_offer_1/claim', {
        method: 'POST',
        headers: {
          'X-Gateway-Auth': userToken,
          'Idempotency-Key': 'listing-claim-after-partner',
        },
      }),
      env
    );
    const body = await readJson<{ voucher: { id: string; claimScope: string; listingContext: { listingId: string } | null } }>(response);
    expect(response.status).toBe(201);
    expect(body.voucher).toEqual(
      expect.objectContaining({
        id: 'rf_voucher_listing_1',
        claimScope: 'listing',
        listingContext: expect.objectContaining({ listingId: 'rielt_phuket_karon_002' }),
      })
    );
  });

  it('allows the same offer to be claimed for two different Rielt listings', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const userToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });

    executeMock
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          {
            listing_id: 'rielt_phuket_karon_002',
            listing_title: 'Семейные апартаменты в Кароне',
            listing_rf_partner_id: 'rf_partner_1',
            mapping_partner_id: 'rf_partner_1',
            offer_id: 'rf_offer_1',
            offer_partner_id: 'rf_partner_1',
            offer_status: 'active',
            offer_visibility: 'public',
            partner_status: 'active',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_voucher_listing_karon',
            offer_id: 'rf_offer_1',
            partner_id: 'rf_partner_1',
            issued_to_user_id: 'user_1',
            status: 'claimed',
            claim_scope: 'listing',
            rielt_listing_id: 'rielt_phuket_karon_002',
            rielt_listing_title_snapshot: 'Семейные апартаменты в Кароне',
            code: 'RF-KARON',
            claimed_at: '2026-03-21T10:03:00.000Z',
            redeemed_at: null,
            created_at: '2026-03-21T10:03:00.000Z',
            updated_at: '2026-03-21T10:03:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            operation: 'voucher_claim',
            actor_user_id: 'user_1',
            idempotency_key: 'listing-claim-karon',
            voucher_id: 'rf_voucher_listing_karon',
            created_at: '2026-03-21T10:03:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          {
            listing_id: 'rielt_phuket_bangtao_014',
            listing_title: '2BR в Laguna на месяц+',
            listing_rf_partner_id: 'rf_partner_1',
            mapping_partner_id: 'rf_partner_1',
            offer_id: 'rf_offer_1',
            offer_partner_id: 'rf_partner_1',
            offer_status: 'active',
            offer_visibility: 'public',
            partner_status: 'active',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_voucher_listing_laguna',
            offer_id: 'rf_offer_1',
            partner_id: 'rf_partner_1',
            issued_to_user_id: 'user_1',
            status: 'claimed',
            claim_scope: 'listing',
            rielt_listing_id: 'rielt_phuket_bangtao_014',
            rielt_listing_title_snapshot: '2BR в Laguna на месяц+',
            code: 'RF-LAGUNA',
            claimed_at: '2026-03-21T10:04:00.000Z',
            redeemed_at: null,
            created_at: '2026-03-21T10:04:00.000Z',
            updated_at: '2026-03-21T10:04:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            operation: 'voucher_claim',
            actor_user_id: 'user_1',
            idempotency_key: 'listing-claim-laguna',
            voucher_id: 'rf_voucher_listing_laguna',
            created_at: '2026-03-21T10:04:00.000Z',
          },
        ],
      });

    const karon = await worker.fetch(
      new Request('https://rf.example/v1/rf/rielt/listings/rielt_phuket_karon_002/offers/rf_offer_1/claim', {
        method: 'POST',
        headers: {
          'X-Gateway-Auth': userToken,
          'Idempotency-Key': 'listing-claim-karon',
        },
      }),
      env
    );
    const karonBody = await readJson<{ voucher: { id: string; listingContext: { listingId: string } | null } }>(karon);
    expect(karon.status).toBe(201);
    expect(karonBody.voucher.listingContext?.listingId).toBe('rielt_phuket_karon_002');

    const laguna = await worker.fetch(
      new Request('https://rf.example/v1/rf/rielt/listings/rielt_phuket_bangtao_014/offers/rf_offer_1/claim', {
        method: 'POST',
        headers: {
          'X-Gateway-Auth': userToken,
          'Idempotency-Key': 'listing-claim-laguna',
        },
      }),
      env
    );
    const lagunaBody = await readJson<{ voucher: { id: string; listingContext: { listingId: string } | null } }>(laguna);
    expect(laguna.status).toBe(201);
    expect(lagunaBody.voucher.id).toBe('rf_voucher_listing_laguna');
    expect(lagunaBody.voucher.listingContext?.listingId).toBe('rielt_phuket_bangtao_014');
  });

  it('returns the existing listing-scoped voucher for duplicate listing claim with a different key', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const userToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });

    executeMock
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          {
            listing_id: 'rielt_phuket_karon_002',
            listing_title: 'Семейные апартаменты в Кароне',
            listing_rf_partner_id: 'rf_partner_1',
            mapping_partner_id: 'rf_partner_1',
            offer_id: 'rf_offer_1',
            offer_partner_id: 'rf_partner_1',
            offer_status: 'active',
            offer_visibility: 'public',
            partner_status: 'active',
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_voucher_listing_1',
            offer_id: 'rf_offer_1',
            partner_id: 'rf_partner_1',
            issued_to_user_id: 'user_1',
            status: 'claimed',
            claim_scope: 'listing',
            rielt_listing_id: 'rielt_phuket_karon_002',
            rielt_listing_title_snapshot: 'Семейные апартаменты в Кароне',
            code: 'RF-LIST01',
            claimed_at: '2026-03-21T10:03:00.000Z',
            redeemed_at: null,
            created_at: '2026-03-21T10:03:00.000Z',
            updated_at: '2026-03-21T10:03:00.000Z',
          },
        ],
      });

    const response = await worker.fetch(
      new Request('https://rf.example/v1/rf/rielt/listings/rielt_phuket_karon_002/offers/rf_offer_1/claim', {
        method: 'POST',
        headers: {
          'X-Gateway-Auth': userToken,
          'Idempotency-Key': 'listing-claim-existing-different-key',
        },
      }),
      env
    );
    const body = await readJson<{ voucher: { id: string; claimScope: string }; idempotentReplay: boolean }>(response);
    expect(response.status).toBe(201);
    expect(body.idempotentReplay).toBe(false);
    expect(body.voucher).toEqual(expect.objectContaining({ id: 'rf_voucher_listing_1', claimScope: 'listing' }));
  });

  it('rejects listing claim idempotency replay for a different context', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const userToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });

    executeMock.mockResolvedValueOnce({
      rows: [
        {
          id: 'rf_voucher_listing_other',
          offer_id: 'rf_offer_other',
          partner_id: 'rf_partner_1',
          issued_to_user_id: 'user_1',
          status: 'claimed',
          claim_scope: 'listing',
          rielt_listing_id: 'rielt_phuket_bangtao_014',
          rielt_listing_title_snapshot: '2BR в Laguna на месяц+',
          code: 'RF-OTHER',
          claimed_at: '2026-03-21T10:03:00.000Z',
          redeemed_at: null,
          created_at: '2026-03-21T10:03:00.000Z',
          updated_at: '2026-03-21T10:03:00.000Z',
        },
      ],
    });

    const response = await worker.fetch(
      new Request('https://rf.example/v1/rf/rielt/listings/rielt_phuket_karon_002/offers/rf_offer_1/claim', {
        method: 'POST',
        headers: {
          'X-Gateway-Auth': userToken,
          'Idempotency-Key': 'listing-claim-mismatch',
        },
      }),
      env
    );
    const body = await readJson<{ error: { code: string } }>(response);
    expect(response.status).toBe(409);
    expect(body.error.code).toBe('RF_IDEMPOTENCY_KEY_CONTEXT_MISMATCH');
  });

  it('returns read-only RF offers mapped to a Rielt listing', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };

    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rielt_phuket_karon_002',
            title: 'Семейные апартаменты в Кароне',
            rf_partner_id: 'rf_partner_1',
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_offer_1',
            partner_id: 'rf_partner_1',
            title: 'Скидка 5% на аренду',
            offer_type: 'discount',
            visibility: 'public',
            status: 'active',
            created_by_user_id: 'partner_owner_1',
            created_at: '2026-03-21T10:01:00.000Z',
            updated_at: '2026-03-21T10:01:00.000Z',
            mapping_status: 'active',
            offer_kind: 'basic',
            priority: 10,
            applicability_note: 'Для этого объекта Rielt',
            partner_slug: 'voucher-partner',
            partner_display_name: 'Voucher Partner',
            partner_country_id: 'country_th',
            partner_city_id: 'city_phuket',
            partner_atlas_place_id: null,
            partner_host_atlas_place_id: null,
            partner_status: 'active',
            partner_owner_user_id: 'partner_owner_1',
            partner_created_at: '2026-03-21T10:00:00.000Z',
            partner_updated_at: '2026-03-21T10:00:00.000Z',
          },
        ],
      });

    const response = await worker.fetch(
      new Request('https://rf.example/v1/rf/rielt/listings/rielt_phuket_karon_002/offers'),
      env
    );
    const body = await readJson<{
      listing: { id: string; title: string; rfPartnerId: string | null };
      partner: { id: string; displayName: string } | null;
      offers: Array<{ id: string; type: string; applicabilityNote: string | null }>;
    }>(response);

    expect(response.status).toBe(200);
    expect(body.listing).toEqual({
      id: 'rielt_phuket_karon_002',
      title: 'Семейные апартаменты в Кароне',
      rfPartnerId: 'rf_partner_1',
    });
    expect(body.partner).toEqual(expect.objectContaining({ id: 'rf_partner_1', displayName: 'Voucher Partner' }));
    expect(body.offers).toEqual([
      expect.objectContaining({
        id: 'rf_offer_1',
        type: 'basic',
        applicabilityNote: 'Для этого объекта Rielt',
      }),
    ]);
    expect(executeMock).toHaveBeenCalledTimes(2);
  });

  it('supports PRO link flow (create + accept)', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const ownerToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'partner_owner_1' });
    const proToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'pro_user_1' });

    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_partner_1',
            slug: 'pro-link-partner',
            display_name: 'PRO Link Partner',
            country_id: 'country_th',
            city_id: 'city_phuket',
            status: 'active',
            owner_user_id: 'partner_owner_1',
            created_at: '2026-03-21T10:00:00.000Z',
            updated_at: '2026-03-21T10:00:00.000Z',
          },
        ],
      })
      // create pro-link partner existence
      .mockResolvedValueOnce({ rows: [{ id: 'rf_partner_1' }] })
      // create pro-link insert
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_pro_link_1',
            partner_id: 'rf_partner_1',
            pro_user_id: 'pro_user_1',
            status: 'pending',
            role_scope: 'onboarding',
            created_at: '2026-03-21T10:05:00.000Z',
            updated_at: '2026-03-21T10:05:00.000Z',
          },
        ],
      })
      // accept pro-link select
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_pro_link_1',
            partner_id: 'rf_partner_1',
            pro_user_id: 'pro_user_1',
            status: 'pending',
            role_scope: 'onboarding',
            created_at: '2026-03-21T10:05:00.000Z',
            updated_at: '2026-03-21T10:05:00.000Z',
            owner_user_id: 'partner_owner_1',
          },
        ],
      })
      // accept pro-link update
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_pro_link_1',
            partner_id: 'rf_partner_1',
            pro_user_id: 'pro_user_1',
            status: 'active',
            role_scope: 'onboarding',
            created_at: '2026-03-21T10:05:00.000Z',
            updated_at: '2026-03-21T10:06:00.000Z',
          },
        ],
      });

    const createdPartner = await worker.fetch(
      new Request('https://rf.example/v1/rf/business/partners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': ownerToken,
        },
        body: JSON.stringify({
          displayName: 'PRO Link Partner',
          countryId: 'country_th',
          cityId: 'city_phuket',
        }),
      }),
      env
    );
    const partner = await readJson<{ id: string }>(createdPartner);

    const createLink = await worker.fetch(
      new Request('https://rf.example/v1/rf/pro/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': proToken,
        },
        body: JSON.stringify({
          partnerId: partner.id,
          roleScope: 'onboarding',
        }),
      }),
      env
    );
    const createLinkBody = await readJson<{ id: string; status: string }>(createLink);
    expect(createLink.status).toBe(201);
    expect(createLinkBody.status).toBe('pending');

    const accept = await worker.fetch(
      new Request(`https://rf.example/v1/rf/pro/links/${createLinkBody.id}/accept`, {
        method: 'POST',
        headers: {
          'X-Gateway-Auth': ownerToken,
        },
      }),
      env
    );
    const acceptBody = await readJson<{ applied: boolean; proLink: { status: string } }>(accept);
    expect(accept.status).toBe(200);
    expect(acceptBody.applied).toBe(true);
    expect(acceptBody.proLink.status).toBe('active');
  });
});
