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
