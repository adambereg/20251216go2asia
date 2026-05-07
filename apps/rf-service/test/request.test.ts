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

function executedSqlText(): string {
  return executeMock.mock.calls
    .map(([query]) => ((query as { strings?: string[] } | undefined)?.strings ?? []).join(' '))
    .join('\n');
}

function executedStatements(): Array<{ text: string; values: unknown[] }> {
  return executeMock.mock.calls.map(([query]) => {
    const typed = query as { strings?: string[]; values?: unknown[] } | undefined;
    return {
      text: (typed?.strings ?? []).join(' ? '),
      values: typed?.values ?? [],
    };
  });
}

function countSqlListItems(list: string): number {
  return list
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean).length;
}

function expectInsertColumnValueParity(statement: string, tableName: string): void {
  const insertStart = statement.search(new RegExp(`INSERT\\s+INTO\\s+${tableName}\\s*\\(`, 'i'));
  expect(insertStart).toBeGreaterThanOrEqual(0);
  const columnStart = statement.indexOf('(', insertStart);
  const valuesKeyword = statement.search(/\)\s*VALUES\s*\(/i);
  expect(valuesKeyword).toBeGreaterThan(columnStart);
  const valueStart = statement.indexOf('(', valuesKeyword);
  const valueEndMarker = statement.search(/\)\s*ON\s+CONFLICT/i);
  expect(valueEndMarker).toBeGreaterThan(valueStart);
  const columns = statement.slice(columnStart + 1, valuesKeyword);
  const values = statement.slice(valueStart + 1, valueEndMarker);
  expect(countSqlListItems(values)).toBe(countSqlListItems(columns));
}

function partnerOwnerRow(ownerUserId = 'partner_owner_1') {
  return {
    id: 'rf_partner_1',
    owner_user_id: ownerUserId,
    status: 'active',
  };
}

function partnerItemRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'rf_partner_item_1',
    partner_id: 'rf_partner_1',
    title: 'Thai Cooking Class',
    description: 'Private class',
    category: 'experience',
    price_from: '120.00',
    currency: 'USD',
    status: 'active',
    created_at: '2026-03-21T10:00:00.000Z',
    updated_at: '2026-03-21T10:00:00.000Z',
    ...overrides,
  };
}

function offerRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'rf_offer_1',
    partner_id: 'rf_partner_1',
    item_id: null,
    title: 'Welcome Offer',
    offer_type: 'discount',
    visibility: 'public',
    status: 'draft',
    created_by_user_id: 'partner_owner_1',
    created_at: '2026-03-21T10:01:00.000Z',
    updated_at: '2026-03-21T10:01:00.000Z',
    ...overrides,
  };
}

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
      // redeem #1: redemption idempotency lookup
      .mockResolvedValueOnce({ rows: [] })
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
      // redeem #2: redemption idempotency replay lookup
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
          'Idempotency-Key': 'redeem-1',
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
    const claim1Body = await readJson<{ voucher: { id: string; canonicalStatus: string; claimScope: string }; idempotentReplay: boolean }>(claim1);
    expect(claim1.status).toBe(201);
    expect(claim1Body.idempotentReplay).toBe(false);
    expect(claim1Body.voucher.canonicalStatus).toBe('available');
    expect(claim1Body.voucher.claimScope).toBe('partner');

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
          'Idempotency-Key': 'redeem-1',
        },
      }),
      env
    );
    const redeem1Body = await readJson<{ applied: boolean; voucher: { status: string } }>(redeem1);
    expect(redeem1.status).toBe(200);
    expect(redeem1Body.applied).toBe(true);
    expect(redeem1Body.voucher.status).toBe('redeemed');
    expect(executedSqlText()).toContain('rf_voucher_scope_consumption_guard');
    expect(executedSqlText()).toContain("repeat_policy_snapshot");

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

    const sqlText = executedSqlText();
    expect(sqlText).toContain('canonical_status');
    expect(sqlText).toContain("'available'");
    expect(sqlText).toContain("'redeemed'");
    expect(sqlText).toContain('rf_voucher_redemption');
    const partnerClaimInsert = executedStatements().find((statement) =>
      statement.text.includes('INSERT INTO rf_voucher') && statement.text.includes("'partner'")
    );
    expect(partnerClaimInsert).toBeDefined();
    expectInsertColumnValueParity(partnerClaimInsert?.text ?? '', 'rf_voucher');
    const redeemStatement = executedStatements().find((statement) => statement.text.includes('rf_voucher_redemption'));
    expect(redeemStatement?.values).toContain('redeem-1');
    const redemptionInsertCount = executeMock.mock.calls.filter(([query]) =>
      ((query as { strings?: string[] }).strings ?? []).join(' ').includes('INSERT INTO rf_voucher_redemption')
    ).length;
    expect(redemptionInsertCount).toBe(1);
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
      })
      .mockResolvedValueOnce({
        rows: [
          {
            operation: 'voucher_claim',
            actor_user_id: 'user_1',
            idempotency_key: 'claim-key-2',
            voucher_id: 'rf_voucher_1',
            created_at: '2026-03-21T10:03:01.000Z',
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

  it('creates a new voucher instance for repeat_after_redeem after redeemed history', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const userToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });

    executeMock
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          offerRow({
            id: 'rf_offer_repeat',
            status: 'active',
            visibility: 'public',
            repeat_policy: 'repeat_after_redeem',
          }),
        ],
      })
      .mockResolvedValueOnce({ rows: [{ id: 'rf_partner_1' }] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ max_issue_sequence: 1 }] })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_voucher_repeat_2',
            offer_id: 'rf_offer_repeat',
            partner_id: 'rf_partner_1',
            issued_to_user_id: 'user_1',
            status: 'claimed',
            canonical_status: 'available',
            repeat_policy_snapshot: 'repeat_after_redeem',
            issue_sequence: 2,
            claim_scope: 'partner',
            rielt_listing_id: null,
            rielt_listing_title_snapshot: null,
            code: 'RF-RPT002',
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
            idempotency_key: 'repeat-claim-2',
            voucher_id: 'rf_voucher_repeat_2',
            created_at: '2026-03-21T10:04:00.000Z',
          },
        ],
      });

    const response = await worker.fetch(
      new Request('https://rf.example/v1/rf/offers/rf_offer_repeat/claim', {
        method: 'POST',
        headers: {
          'X-Gateway-Auth': userToken,
          'Idempotency-Key': 'repeat-claim-2',
        },
      }),
      env
    );
    const body = await readJson<{
      createdNewInstance: boolean;
      repeatPolicy: string;
      voucher: { id: string; repeatPolicySnapshot: string; issueSequence: number; canonicalStatus: string };
    }>(response);

    expect(response.status).toBe(201);
    expect(body.createdNewInstance).toBe(true);
    expect(body.repeatPolicy).toBe('repeat_after_redeem');
    expect(body.voucher).toEqual(
      expect.objectContaining({
        id: 'rf_voucher_repeat_2',
        canonicalStatus: 'available',
        repeatPolicySnapshot: 'repeat_after_redeem',
        issueSequence: 2,
      })
    );
    expect(executedSqlText()).toContain('MAX(issue_sequence)');
  });

  it('rejects partner claim replay when idempotency key context differs', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const userToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });

    executeMock.mockResolvedValueOnce({
      rows: [
        {
          id: 'rf_voucher_1',
          offer_id: 'rf_offer_other',
          partner_id: 'rf_partner_1',
          issued_to_user_id: 'user_1',
          status: 'claimed',
          canonical_status: 'available',
          claim_scope: 'partner',
          rielt_listing_id: null,
          rielt_listing_title_snapshot: null,
          code: 'RF-000001',
          claimed_at: '2026-03-21T10:03:00.000Z',
          redeemed_at: null,
          created_at: '2026-03-21T10:03:00.000Z',
          updated_at: '2026-03-21T10:03:00.000Z',
        },
      ],
    });

    const response = await worker.fetch(
      new Request('https://rf.example/v1/rf/offers/rf_offer_1/claim', {
        method: 'POST',
        headers: {
          'X-Gateway-Auth': userToken,
          'Idempotency-Key': 'claim-key-ctx',
        },
      }),
      env
    );
    const body = await readJson<{ error: { code: string } }>(response);

    expect(response.status).toBe(409);
    expect(body.error.code).toBe('RF_IDEMPOTENCY_KEY_CONTEXT_MISMATCH');
    expect(executeMock).toHaveBeenCalledTimes(1);
  });

  it('treats legacy claim replay rows without claim_scope as partner scope', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const userToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });

    executeMock.mockResolvedValueOnce({
      rows: [
        {
          id: 'rf_voucher_legacy',
          offer_id: 'rf_offer_1',
          partner_id: 'rf_partner_1',
          issued_to_user_id: 'user_1',
          status: 'claimed',
          canonical_status: 'available',
          claim_scope: null,
          rielt_listing_id: null,
          rielt_listing_title_snapshot: null,
          code: 'RF-LEGACY',
          claimed_at: '2026-03-21T10:03:00.000Z',
          redeemed_at: null,
          created_at: '2026-03-21T10:03:00.000Z',
          updated_at: '2026-03-21T10:03:00.000Z',
        },
      ],
    });

    const response = await worker.fetch(
      new Request('https://rf.example/v1/rf/offers/rf_offer_1/claim', {
        method: 'POST',
        headers: {
          'X-Gateway-Auth': userToken,
          'Idempotency-Key': 'legacy-claim-scope-replay',
        },
      }),
      env
    );
    const body = await readJson<{ idempotentReplay: boolean; voucher: { id: string; claimScope: string; canonicalStatus: string } }>(response);

    expect(response.status).toBe(200);
    expect(body.idempotentReplay).toBe(true);
    expect(body.voucher.id).toBe('rf_voucher_legacy');
    expect(body.voucher.claimScope).toBe('partner');
    expect(body.voucher.canonicalStatus).toBe('available');
  });

  it('keeps first claim attribution immutable on idempotent replay with different payload', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const userToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });

    executeMock.mockResolvedValueOnce({
      rows: [
        {
          id: 'rf_voucher_1',
          offer_id: 'rf_offer_1',
          partner_id: 'rf_partner_1',
          issued_to_user_id: 'user_1',
          status: 'claimed',
          canonical_status: 'available',
          attribution_status: 'confirmed',
          attribution_source: 'pro_link',
          claim_source: 'public_rf_catalog',
          attribution_share_code: 'rfp_first',
          pro_attributed_user_id: 'pro_user_1',
          pro_link_id: 'rf_pro_link_1',
          attribution_captured_at: '2026-05-07T00:00:00.000Z',
          attribution_confirmed_at: '2026-05-07T00:01:00.000Z',
          attribution_metadata: { restoredFromSession: true },
          claim_scope: 'partner',
          rielt_listing_id: null,
          rielt_listing_title_snapshot: null,
          code: 'RF-000001',
          claimed_at: '2026-05-07T00:01:00.000Z',
          redeemed_at: null,
          created_at: '2026-05-07T00:01:00.000Z',
          updated_at: '2026-05-07T00:01:00.000Z',
        },
      ],
    });

    const response = await worker.fetch(
      new Request('https://rf.example/v1/rf/offers/rf_offer_1/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': userToken,
          'Idempotency-Key': 'claim-attributed',
        },
        body: JSON.stringify({
          attribution: {
            version: 1,
            shareCode: 'rfp_second_attempt',
            attributionSource: 'pro_link',
            claimSource: 'pro_shared_link',
            capturedAt: '2026-05-07T00:02:00.000Z',
          },
        }),
      }),
      env
    );
    const body = await readJson<{ idempotentReplay: boolean; voucher: { attribution: { status: string; shareCode: string | null; claimSource: string } } }>(
      response
    );

    expect(response.status).toBe(200);
    expect(body.idempotentReplay).toBe(true);
    expect(body.voucher.attribution.status).toBe('confirmed');
    expect(body.voucher.attribution.shareCode).toBe('rfp_first');
    expect(body.voucher.attribution.claimSource).toBe('public_rf_catalog');
  });

  it('persists valid PRO attribution on first successful claim', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const userToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });

    executeMock
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [{
          id: 'rf_offer_1',
          partner_id: 'rf_partner_1',
          title: 'Welcome Coffee',
          offer_type: 'discount',
          visibility: 'public',
          status: 'active',
          created_by_user_id: 'partner_owner_1',
          created_at: '2026-03-21T10:01:00.000Z',
          updated_at: '2026-03-21T10:01:00.000Z',
        }],
      })
      .mockResolvedValueOnce({ rows: [{ id: 'rf_partner_1' }] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [{
          id: 'rf_pro_link_1',
          partner_id: 'rf_partner_1',
          pro_user_id: 'pro_user_1',
          share_code: 'rfp_valid',
          status: 'active',
        }],
      })
      .mockResolvedValueOnce({
        rows: [{
          id: 'rf_voucher_1',
          offer_id: 'rf_offer_1',
          partner_id: 'rf_partner_1',
          issued_to_user_id: 'user_1',
          status: 'claimed',
          canonical_status: 'available',
          attribution_version: 1,
          attribution_strategy: 'rf_pro_last_touch_before_claim',
          attribution_status: 'confirmed',
          attribution_source: 'pro_link',
          claim_source: 'public_rf_catalog',
          attribution_share_code: 'rfp_valid',
          pro_attributed_user_id: 'pro_user_1',
          pro_link_id: 'rf_pro_link_1',
          attribution_captured_at: '2026-05-07T00:00:00.000Z',
          attribution_confirmed_at: '2026-05-07T00:01:00.000Z',
          attribution_metadata: { restoredFromSession: true },
          claim_scope: 'partner',
          rielt_listing_id: null,
          rielt_listing_title_snapshot: null,
          code: 'RF-000001',
          claimed_at: '2026-05-07T00:01:00.000Z',
          redeemed_at: null,
          created_at: '2026-05-07T00:01:00.000Z',
          updated_at: '2026-05-07T00:01:00.000Z',
        }],
      })
      .mockResolvedValueOnce({
        rows: [{
          operation: 'voucher_claim',
          actor_user_id: 'user_1',
          idempotency_key: 'claim-attributed',
          voucher_id: 'rf_voucher_1',
          created_at: '2026-05-07T00:01:00.000Z',
        }],
      });

    const response = await worker.fetch(
      new Request('https://rf.example/v1/rf/offers/rf_offer_1/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': userToken,
          'Idempotency-Key': 'claim-attributed',
        },
        body: JSON.stringify({
          attribution: {
            version: 1,
            shareCode: 'rfp_valid',
            attributionSource: 'pro_link',
            claimSource: 'public_rf_catalog',
            capturedAt: '2026-05-07T00:00:00.000Z',
            metadata: { restoredFromSession: true },
          },
        }),
      }),
      env
    );
    const body = await readJson<{ voucher: { attribution: { status: string; proUserId: string | null; shareCode: string | null } } }>(response);
    expect(response.status).toBe(201);
    expect(body.voucher.attribution.status).toBe('confirmed');
    expect(body.voucher.attribution.proUserId).toBe('pro_user_1');
    expect(body.voucher.attribution.shareCode).toBe('rfp_valid');
    expect(executedSqlText()).toContain('share_code');
    expect(executedSqlText()).toContain('attribution_status');
  });

  it('keeps voucher claim successful but rejects expired PRO attribution', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const userToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });

    executeMock
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [{
          id: 'rf_offer_1',
          partner_id: 'rf_partner_1',
          title: 'Welcome Coffee',
          offer_type: 'discount',
          visibility: 'public',
          status: 'active',
          created_by_user_id: 'partner_owner_1',
          created_at: '2026-03-21T10:01:00.000Z',
          updated_at: '2026-03-21T10:01:00.000Z',
        }],
      })
      .mockResolvedValueOnce({ rows: [{ id: 'rf_partner_1' }] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [{
          id: 'rf_voucher_rejected',
          offer_id: 'rf_offer_1',
          partner_id: 'rf_partner_1',
          issued_to_user_id: 'user_1',
          status: 'claimed',
          attribution_status: 'rejected',
          attribution_source: 'pro_link',
          claim_source: 'public_rf_catalog',
          attribution_share_code: 'rfp_expired',
          attribution_metadata: { rejectionReason: 'expired_attribution_session' },
          claim_scope: 'partner',
          rielt_listing_id: null,
          rielt_listing_title_snapshot: null,
          code: 'RF-000002',
          claimed_at: '2026-05-07T00:01:00.000Z',
          redeemed_at: null,
          created_at: '2026-05-07T00:01:00.000Z',
          updated_at: '2026-05-07T00:01:00.000Z',
        }],
      })
      .mockResolvedValueOnce({
        rows: [{
          operation: 'voucher_claim',
          actor_user_id: 'user_1',
          idempotency_key: 'claim-expired-attribution',
          voucher_id: 'rf_voucher_rejected',
          created_at: '2026-05-07T00:01:00.000Z',
        }],
      });

    const response = await worker.fetch(
      new Request('https://rf.example/v1/rf/offers/rf_offer_1/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': userToken,
          'Idempotency-Key': 'claim-expired-attribution',
        },
        body: JSON.stringify({
          attribution: {
            version: 1,
            shareCode: 'rfp_expired',
            attributionSource: 'pro_link',
            claimSource: 'public_rf_catalog',
            capturedAt: '2020-01-01T00:00:00.000Z',
          },
        }),
      }),
      env
    );
    const body = await readJson<{ voucher: { attribution: { status: string; metadata: { rejectionReason?: string } } } }>(response);
    expect(response.status).toBe(201);
    expect(body.voucher.attribution.status).toBe('rejected');
    expect(body.voucher.attribution.metadata.rejectionReason).toBe('expired_attribution_session');
  });

  it.each([
    {
      name: 'inactive PRO link',
      proLink: {
        id: 'rf_pro_link_inactive',
        partner_id: 'rf_partner_1',
        pro_user_id: 'pro_user_1',
        share_code: 'rfp_inactive',
        status: 'ended',
      },
      shareCode: 'rfp_inactive',
      rejectionReason: 'pro_link_inactive',
    },
    {
      name: 'wrong partner',
      proLink: {
        id: 'rf_pro_link_wrong_partner',
        partner_id: 'rf_partner_2',
        pro_user_id: 'pro_user_2',
        share_code: 'rfp_wrong_partner',
        status: 'active',
      },
      shareCode: 'rfp_wrong_partner',
      rejectionReason: 'partner_mismatch',
    },
  ])('keeps claim successful but rejects attribution for $name', async ({ proLink, shareCode, rejectionReason }) => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const userToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });
    const idempotencyKey = `claim-${rejectionReason}`;

    executeMock
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [{
          id: 'rf_offer_1',
          partner_id: 'rf_partner_1',
          title: 'Welcome Coffee',
          offer_type: 'discount',
          visibility: 'public',
          status: 'active',
          created_by_user_id: 'partner_owner_1',
          created_at: '2026-03-21T10:01:00.000Z',
          updated_at: '2026-03-21T10:01:00.000Z',
        }],
      })
      .mockResolvedValueOnce({ rows: [{ id: 'rf_partner_1' }] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [proLink] })
      .mockResolvedValueOnce({
        rows: [{
          id: `rf_voucher_${rejectionReason}`,
          offer_id: 'rf_offer_1',
          partner_id: 'rf_partner_1',
          issued_to_user_id: 'user_1',
          status: 'claimed',
          attribution_status: 'rejected',
          attribution_source: 'pro_link',
          claim_source: 'public_rf_catalog',
          attribution_share_code: shareCode,
          attribution_metadata: { rejectionReason },
          claim_scope: 'partner',
          rielt_listing_id: null,
          rielt_listing_title_snapshot: null,
          code: 'RF-000003',
          claimed_at: '2026-05-07T00:01:00.000Z',
          redeemed_at: null,
          created_at: '2026-05-07T00:01:00.000Z',
          updated_at: '2026-05-07T00:01:00.000Z',
        }],
      })
      .mockResolvedValueOnce({
        rows: [{
          operation: 'voucher_claim',
          actor_user_id: 'user_1',
          idempotency_key: idempotencyKey,
          voucher_id: `rf_voucher_${rejectionReason}`,
          created_at: '2026-05-07T00:01:00.000Z',
        }],
      });

    const response = await worker.fetch(
      new Request('https://rf.example/v1/rf/offers/rf_offer_1/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Auth': userToken,
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify({
          attribution: {
            version: 1,
            shareCode,
            attributionSource: 'pro_link',
            claimSource: 'public_rf_catalog',
            capturedAt: new Date().toISOString(),
          },
        }),
      }),
      env
    );
    const body = await readJson<{ voucher: { attribution: { status: string; metadata: { rejectionReason?: string } } } }>(response);
    expect(response.status).toBe(201);
    expect(body.voucher.attribution.status).toBe('rejected');
    expect(body.voucher.attribution.metadata.rejectionReason).toBe(rejectionReason);
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

  it('returns RF_VOUCHER_EXPIRED when redeem sees canonical expired status', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const ownerToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'partner_owner_1' });

    executeMock
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
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_voucher_expired',
            offer_id: 'rf_offer_1',
            partner_id: 'rf_partner_1',
            issued_to_user_id: 'user_1',
            status: 'claimed',
            canonical_status: 'expired',
            code: 'RF-EXPIRED',
            claimed_at: '2026-03-21T10:03:00.000Z',
            redeemed_at: null,
            created_at: '2026-03-21T10:03:00.000Z',
            updated_at: '2026-03-21T10:03:00.000Z',
          },
        ],
      });

    const redeem = await worker.fetch(
      new Request('https://rf.example/v1/rf/business/partners/rf_partner_1/vouchers/rf_voucher_expired/redeem', {
        method: 'POST',
        headers: { 'X-Gateway-Auth': ownerToken },
      }),
      env
    );
    const body = await readJson<{ error: { code: string } }>(redeem);
    expect(redeem.status).toBe(409);
    expect(body.error.code).toBe('RF_VOUCHER_EXPIRED');
  });

  it('rejects redeem for locked voucher and allows redeem for unlocked voucher', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const ownerToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'partner_owner_1' });

    executeMock
      // locked redeem: owned partner check
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
      // locked redeem: voucher lookup
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_voucher_locked',
            offer_id: 'rf_offer_1',
            partner_id: 'rf_partner_1',
            issued_to_user_id: 'user_1',
            status: 'claimed',
            canonical_status: 'locked',
            code: 'RF-LOCKED',
            claimed_at: '2026-03-21T10:03:00.000Z',
            redeemed_at: null,
            created_at: '2026-03-21T10:03:00.000Z',
            updated_at: '2026-03-21T10:03:00.000Z',
          },
        ],
      })
      // unlocked redeem: owned partner check
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
      // unlocked redeem: voucher lookup
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_voucher_unlocked',
            offer_id: 'rf_offer_1',
            partner_id: 'rf_partner_1',
            issued_to_user_id: 'user_1',
            status: 'claimed',
            canonical_status: 'unlocked',
            code: 'RF-UNLOCK',
            claimed_at: '2026-03-21T10:03:00.000Z',
            redeemed_at: null,
            created_at: '2026-03-21T10:03:00.000Z',
            updated_at: '2026-03-21T10:03:00.000Z',
          },
        ],
      })
      // unlocked redeem: offer relation lookup
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
      // unlocked redeem: update -> redeemed
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_voucher_unlocked',
            offer_id: 'rf_offer_1',
            partner_id: 'rf_partner_1',
            issued_to_user_id: 'user_1',
            status: 'redeemed',
            canonical_status: 'redeemed',
            code: 'RF-UNLOCK',
            claimed_at: '2026-03-21T10:03:00.000Z',
            redeemed_at: '2026-03-21T10:04:00.000Z',
            created_at: '2026-03-21T10:03:00.000Z',
            updated_at: '2026-03-21T10:04:00.000Z',
          },
        ],
      });

    const lockedRedeem = await worker.fetch(
      new Request('https://rf.example/v1/rf/business/partners/rf_partner_1/vouchers/rf_voucher_locked/redeem', {
        method: 'POST',
        headers: { 'X-Gateway-Auth': ownerToken },
      }),
      env
    );
    const lockedBody = await readJson<{ error: { code: string } }>(lockedRedeem);
    expect(lockedRedeem.status).toBe(409);
    expect(lockedBody.error.code).toBe('RF_VOUCHER_NOT_CLAIMED');

    const unlockedRedeem = await worker.fetch(
      new Request('https://rf.example/v1/rf/business/partners/rf_partner_1/vouchers/rf_voucher_unlocked/redeem', {
        method: 'POST',
        headers: { 'X-Gateway-Auth': ownerToken },
      }),
      env
    );
    const unlockedBody = await readJson<{ applied: boolean; voucher: { status: string; canonicalStatus?: string } }>(unlockedRedeem);
    expect(unlockedRedeem.status).toBe(200);
    expect(unlockedBody.applied).toBe(true);
    expect(unlockedBody.voucher.status).toBe('redeemed');
    expect(unlockedBody.voucher.canonicalStatus).toBe('redeemed');
  });

  it('returns attribution consistently for already redeemed voucher and redeem idempotency replay', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const ownerToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'partner_owner_1' });

    executeMock
      // already redeemed: owned partner check
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
      // already redeemed: voucher lookup
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_voucher_redeemed',
            offer_id: 'rf_offer_1',
            partner_id: 'rf_partner_1',
            issued_to_user_id: 'user_1',
            status: 'redeemed',
            canonical_status: 'redeemed',
            attribution_status: 'confirmed',
            attribution_source: 'pro_link',
            claim_source: 'pro_shared_link',
            attribution_share_code: 'rfp_confirmed',
            pro_attributed_user_id: 'pro_user_1',
            pro_link_id: 'rf_pro_link_1',
            attribution_captured_at: '2026-05-07T00:00:00.000Z',
            attribution_confirmed_at: '2026-05-07T00:01:00.000Z',
            attribution_metadata: { restoredFromSession: true },
            claim_scope: 'partner',
            rielt_listing_id: null,
            rielt_listing_title_snapshot: null,
            code: 'RF-000777',
            claimed_at: '2026-05-07T00:01:00.000Z',
            redeemed_at: '2026-05-07T00:02:00.000Z',
            created_at: '2026-05-07T00:01:00.000Z',
            updated_at: '2026-05-07T00:02:00.000Z',
          },
        ],
      })
      // idempotency replay: owned partner check
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
      // idempotency replay lookup
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_voucher_redeemed',
            offer_id: 'rf_offer_1',
            partner_id: 'rf_partner_1',
            issued_to_user_id: 'user_1',
            status: 'redeemed',
            canonical_status: 'redeemed',
            attribution_status: 'confirmed',
            attribution_source: 'pro_link',
            claim_source: 'pro_shared_link',
            attribution_share_code: 'rfp_confirmed',
            pro_attributed_user_id: 'pro_user_1',
            pro_link_id: 'rf_pro_link_1',
            attribution_captured_at: '2026-05-07T00:00:00.000Z',
            attribution_confirmed_at: '2026-05-07T00:01:00.000Z',
            attribution_metadata: { restoredFromSession: true },
            claim_scope: 'partner',
            rielt_listing_id: null,
            rielt_listing_title_snapshot: null,
            code: 'RF-000777',
            claimed_at: '2026-05-07T00:01:00.000Z',
            redeemed_at: '2026-05-07T00:02:00.000Z',
            created_at: '2026-05-07T00:01:00.000Z',
            updated_at: '2026-05-07T00:02:00.000Z',
          },
        ],
      });

    const alreadyRedeemed = await worker.fetch(
      new Request('https://rf.example/v1/rf/business/partners/rf_partner_1/vouchers/rf_voucher_redeemed/redeem', {
        method: 'POST',
        headers: { 'X-Gateway-Auth': ownerToken },
      }),
      env
    );
    const alreadyRedeemedBody = await readJson<{
      applied: boolean;
      voucher: { status: string; canonicalStatus?: string; attribution?: { status: string; shareCode: string | null } };
    }>(alreadyRedeemed);
    expect(alreadyRedeemed.status).toBe(200);
    expect(alreadyRedeemedBody.applied).toBe(false);
    expect(alreadyRedeemedBody.voucher.status).toBe('redeemed');
    expect(alreadyRedeemedBody.voucher.canonicalStatus).toBe('redeemed');
    expect(alreadyRedeemedBody.voucher.attribution?.status).toBe('confirmed');
    expect(alreadyRedeemedBody.voucher.attribution?.shareCode).toBe('rfp_confirmed');

    const replayRedeem = await worker.fetch(
      new Request('https://rf.example/v1/rf/business/partners/rf_partner_1/vouchers/rf_voucher_redeemed/redeem', {
        method: 'POST',
        headers: {
          'X-Gateway-Auth': ownerToken,
          'Idempotency-Key': 'redeem-replay-1',
        },
      }),
      env
    );
    const replayBody = await readJson<{
      applied: boolean;
      voucher: { status: string; canonicalStatus?: string; attribution?: { status: string; shareCode: string | null } };
    }>(replayRedeem);
    expect(replayRedeem.status).toBe(200);
    expect(replayBody.applied).toBe(false);
    expect(replayBody.voucher.status).toBe('redeemed');
    expect(replayBody.voucher.canonicalStatus).toBe('redeemed');
    expect(replayBody.voucher.attribution?.status).toBe('confirmed');
    expect(replayBody.voucher.attribution?.shareCode).toBe('rfp_confirmed');
  });

  it('rejects redeem idempotency replay for a different voucher context', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const ownerToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'partner_owner_1' });

    executeMock
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
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_voucher_other',
            offer_id: 'rf_offer_1',
            partner_id: 'rf_partner_1',
            issued_to_user_id: 'user_1',
            status: 'redeemed',
            canonical_status: 'redeemed',
            code: 'RF-000778',
            claimed_at: '2026-05-07T00:01:00.000Z',
            redeemed_at: '2026-05-07T00:02:00.000Z',
            created_at: '2026-05-07T00:01:00.000Z',
            updated_at: '2026-05-07T00:02:00.000Z',
          },
        ],
      });

    const response = await worker.fetch(
      new Request('https://rf.example/v1/rf/business/partners/rf_partner_1/vouchers/rf_voucher_redeemed/redeem', {
        method: 'POST',
        headers: {
          'X-Gateway-Auth': ownerToken,
          'Idempotency-Key': 'redeem-mismatch',
        },
      }),
      env
    );
    const body = await readJson<{ error: { code: string } }>(response);
    expect(response.status).toBe(409);
    expect(body.error.code).toBe('RF_REDEEM_IDEMPOTENCY_KEY_CONTEXT_MISMATCH');
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

  it('requires auth for listing current user vouchers', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };

    const response = await worker.fetch(new Request('https://rf.example/v1/rf/me/vouchers'), env);
    const body = await readJson<{ error: { code: string } }>(response);

    expect(response.status).toBe(401);
    expect(body.error.code).toBe('UNAUTHORIZED');
    expect(executeMock).not.toHaveBeenCalled();
  });

  it('returns enriched wallet vouchers for the current user', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const userToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });

    executeMock.mockResolvedValueOnce({
      rows: [
        {
          id: 'rf_voucher_listing_1',
          offer_id: 'rf_offer_1',
          partner_id: 'rf_partner_1',
          issued_to_user_id: 'user_1',
          status: 'redeemed',
          claim_scope: 'listing',
          rielt_listing_id: 'rielt_phuket_karon_002',
          rielt_listing_title_snapshot: 'Семейные апартаменты в Кароне',
          code: 'RF-LIST01',
          claimed_at: '2026-03-21T10:03:00.000Z',
          redeemed_at: '2026-03-22T10:03:00.000Z',
          created_at: '2026-03-21T10:03:00.000Z',
          updated_at: '2026-03-22T10:03:00.000Z',
          wallet_offer_id: 'rf_offer_1',
          wallet_offer_title: 'Скидка 5% на аренду',
          wallet_offer_type: 'discount',
          wallet_offer_kind: 'premium',
          wallet_offer_terms: 'Для этого объекта Rielt',
          wallet_partner_id: 'rf_partner_1',
          wallet_partner_display_name: 'Voucher Partner',
          wallet_partner_city_id: 'city_phuket',
          wallet_partner_country_id: 'country_th',
        },
      ],
    });

    const response = await worker.fetch(
      new Request('https://rf.example/v1/rf/me/vouchers', {
        headers: {
          'X-Gateway-Auth': userToken,
        },
      }),
      env
    );
    const body = await readJson<{
      items: Array<{
        id: string;
        offer: { id: string; title: string; benefit: string; terms: string; type: string };
        partner: { id: string; displayName: string; cityId: string | null; countryId: string | null };
        validityLabel: string;
        usage: { instruction: string; contactHint: string; redeemStatus: string };
      }>;
      nextCursor: string | null;
    }>(response);

    expect(response.status).toBe(200);
    expect(body.nextCursor).toBeNull();
    expect(body.items[0]).toEqual(
      expect.objectContaining({
        id: 'rf_voucher_listing_1',
        offer: {
          id: 'rf_offer_1',
          title: 'Скидка 5% на аренду',
          benefit: 'Скидка 5% на аренду',
          terms: 'Для этого объекта Rielt',
          type: 'premium',
        },
        partner: {
          id: 'rf_partner_1',
          displayName: 'Voucher Partner',
          cityId: 'city_phuket',
          countryId: 'country_th',
        },
        validityLabel: 'Срок действия уточняется у партнёра',
        usage: {
          instruction: 'Покажите ваучер представителю объекта и уточните применение выгоды.',
          contactHint: 'Свяжитесь с представителем объекта перед использованием.',
          redeemStatus: 'Использован',
        },
      })
    );
    expect(executeMock).toHaveBeenCalledTimes(1);
    expect(executeMock.mock.calls[0]?.[0]?.values).toEqual(['user_1']);
  });

  it('requires auth for PRO attributed voucher visibility', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };

    const response = await worker.fetch(new Request('https://rf.example/v1/rf/pro/attributed-vouchers'), env);
    const body = await readJson<{ error: { code: string } }>(response);

    expect(response.status).toBe(401);
    expect(body.error.code).toBe('UNAUTHORIZED');
    expect(executeMock).not.toHaveBeenCalled();
  });

  it('returns PRO-safe confirmed attributed vouchers for the current PRO', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const proToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'pro_user_1' });

    executeMock.mockResolvedValueOnce({
      rows: [
        {
          id: 'rf_voucher_2',
          offer_id: 'rf_offer_2',
          offer_title: 'Airport pickup',
          partner_id: 'rf_partner_1',
          partner_display_name: 'Phuket Partner',
          status: 'claimed',
          canonical_status: 'available',
          claim_scope: 'listing',
          rielt_listing_id: 'rielt_listing_1',
          rielt_listing_title_snapshot: 'Karon family apartment',
          attribution_status: 'confirmed',
          attribution_source: 'pro_link',
          claim_source: 'pro_shared_link',
          attribution_confirmed_at: '2026-05-07T10:02:00.000Z',
          claimed_at: '2026-05-07T10:02:00.000Z',
          redeemed_at: null,
        },
        {
          id: 'rf_voucher_1',
          offer_id: 'rf_offer_1',
          offer_title: 'Welcome coffee',
          partner_id: 'rf_partner_1',
          partner_display_name: 'Phuket Partner',
          status: 'claimed',
          canonical_status: 'available',
          claim_scope: 'listing',
          rielt_listing_id: 'rielt_listing_1',
          rielt_listing_title_snapshot: 'Karon family apartment',
          attribution_status: 'confirmed',
          attribution_source: 'pro_link',
          claim_source: 'pro_shared_link',
          attribution_confirmed_at: '2026-05-07T10:01:00.000Z',
          claimed_at: '2026-05-07T10:01:00.000Z',
          redeemed_at: null,
        },
        {
          id: 'rf_voucher_extra',
          offer_id: 'rf_offer_extra',
          offer_title: 'Extra page item',
          partner_id: 'rf_partner_1',
          partner_display_name: 'Phuket Partner',
          status: 'claimed',
          canonical_status: 'available',
          claim_scope: 'listing',
          rielt_listing_id: 'rielt_listing_1',
          rielt_listing_title_snapshot: 'Karon family apartment',
          attribution_status: 'confirmed',
          attribution_source: 'pro_link',
          claim_source: 'pro_shared_link',
          attribution_confirmed_at: '2026-05-07T10:00:00.000Z',
          claimed_at: '2026-05-07T10:00:00.000Z',
          redeemed_at: null,
        },
      ],
    });

    const response = await worker.fetch(
      new Request('https://rf.example/v1/rf/pro/attributed-vouchers?limit=2&partnerId=rf_partner_1&claimScope=listing&status=claimed', {
        headers: { 'X-Gateway-Auth': proToken },
      }),
      env
    );
    const body = await readJson<{
      items: Array<
        Record<string, unknown> & {
          voucherId: string;
          canonicalStatus: string;
          listingContext: { listingTitle: string | null } | null;
        }
      >;
      nextCursor: string | null;
    }>(response);

    expect(response.status).toBe(200);
    expect(body.items.map((item) => item.voucherId)).toEqual(['rf_voucher_2', 'rf_voucher_1']);
    expect(body.nextCursor).toBe('2026-05-07T10:01:00.000Z|rf_voucher_1');
    expect(body.items[0]?.listingContext?.listingTitle).toBe('Karon family apartment');
    expect(body.items.every((item) => typeof item.canonicalStatus === 'string' && item.canonicalStatus.length > 0)).toBe(true);
    expect(body.items[0]).toEqual(
      expect.not.objectContaining({
        issuedToUserId: expect.anything(),
        code: expect.anything(),
        shareCode: expect.anything(),
        proUserId: expect.anything(),
        proLinkId: expect.anything(),
        metadata: expect.anything(),
      })
    );
    expect(executedSqlText()).toContain('v.pro_attributed_user_id');
    expect(executedSqlText()).toContain("v.attribution_status = 'confirmed'");
    expect(executeMock.mock.calls[0]?.[0]?.values).toEqual(
      expect.arrayContaining(['pro_user_1', 'claimed', 'rf_partner_1', 'listing', 3])
    );
  });

  it('keeps redeemed attributed vouchers visible for PRO when attribution is confirmed', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const proToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'pro_user_1' });

    executeMock.mockResolvedValueOnce({
      rows: [
        {
          id: 'rf_voucher_redeemed_1',
          offer_id: 'rf_offer_1',
          offer_title: 'Welcome coffee',
          partner_id: 'rf_partner_1',
          partner_display_name: 'Phuket Partner',
          status: 'redeemed',
          canonical_status: 'redeemed',
          claim_scope: 'partner',
          rielt_listing_id: null,
          rielt_listing_title_snapshot: null,
          attribution_status: 'confirmed',
          attribution_source: 'pro_link',
          claim_source: 'pro_shared_link',
          attribution_confirmed_at: '2026-05-07T10:01:00.000Z',
          claimed_at: '2026-05-07T10:00:00.000Z',
          redeemed_at: '2026-05-07T10:05:00.000Z',
        },
      ],
    });

    const response = await worker.fetch(
      new Request('https://rf.example/v1/rf/pro/attributed-vouchers', {
        headers: { 'X-Gateway-Auth': proToken },
      }),
      env
    );
    const body = await readJson<{ items: Array<{ voucherId: string; status: string; canonicalStatus: string; redeemedAt: string | null }> }>(
      response
    );

    expect(response.status).toBe(200);
    expect(body.items).toHaveLength(1);
    expect(body.items[0]).toMatchObject({
      voucherId: 'rf_voucher_redeemed_1',
      status: 'redeemed',
      canonicalStatus: 'redeemed',
    });
    expect(body.items[0]?.redeemedAt).toBe('2026-05-07T10:05:00.000Z');
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
          expired_vouchers: 0,
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
      expiredVouchers: number;
    }>(response);

    expect(response.status).toBe(200);
    expect(body).toEqual({
      totalVouchers: 0,
      activeVouchers: 0,
      usedVouchers: 0,
      cancelledVouchers: 0,
      expiredVouchers: 0,
    });
    expect(executeMock).toHaveBeenCalledTimes(1);
    expect(executeMock.mock.calls[0]?.[0]?.values).toEqual(['user_1']);
  });

  it('counts current user voucher summary by canonical lifecycle status with legacy-compatible output', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const userToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });

    executeMock.mockResolvedValueOnce({
      rows: [
        {
          total_vouchers: 5,
          active_vouchers: 2,
          used_vouchers: 1,
          cancelled_vouchers: 1,
          expired_vouchers: 1,
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
      expiredVouchers: number;
    }>(response);

    expect(response.status).toBe(200);
    expect(body).toEqual({
      totalVouchers: 5,
      activeVouchers: 2,
      usedVouchers: 1,
      cancelledVouchers: 1,
      expiredVouchers: 1,
    });
    expect(executeMock).toHaveBeenCalledTimes(1);
    expect(executeMock.mock.calls[0]?.[0]?.values).toEqual(['user_1']);
    expect(executedSqlText()).toContain('canonical_status');
    expect(executedSqlText()).toContain("effective_status = 'expired'");
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
      voucher: {
        id: string;
        canonicalStatus: string;
        claimScope: string;
        listingContext: { listingId: string; listingTitle: string | null } | null;
      };
      idempotentReplay: boolean;
    }>(claim1);
    expect(claim1.status).toBe(201);
    expect(claim1Body.idempotentReplay).toBe(false);
    expect(claim1Body.voucher.canonicalStatus).toBe('available');
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
    expect(executedSqlText()).toContain('canonical_status');
    expect(executedSqlText()).toContain("'available'");
    const listingClaimInsert = executedStatements().find((statement) =>
      statement.text.includes('INSERT INTO rf_voucher') && statement.text.includes("'listing'")
    );
    expect(listingClaimInsert).toBeDefined();
    expectInsertColumnValueParity(listingClaimInsert?.text ?? '', 'rf_voucher');
    expect(listingClaimInsert?.text).toContain('contract_version');
    expect(listingClaimInsert?.text).toContain('status_changed_at');
    expect(listingClaimInsert?.text).toContain('status_actor_user_id');
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
      })
      .mockResolvedValueOnce({
        rows: [
          {
            operation: 'voucher_claim',
            actor_user_id: 'user_1',
            idempotency_key: 'listing-claim-existing-different-key',
            voucher_id: 'rf_voucher_listing_1',
            created_at: '2026-03-21T10:03:01.000Z',
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

  it('lets partner owner list PRO links for owned partner', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const ownerToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'partner_owner_1' });

    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_partner_1',
            owner_user_id: 'partner_owner_1',
            status: 'active',
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_pro_link_pending',
            partner_id: 'rf_partner_1',
            pro_user_id: 'pro_user_1',
            status: 'pending',
            role_scope: 'curation',
            created_at: '2026-03-21T10:10:00.000Z',
            updated_at: '2026-03-21T10:10:00.000Z',
          },
          {
            id: 'rf_pro_link_active',
            partner_id: 'rf_partner_1',
            pro_user_id: 'pro_user_2',
            status: 'active',
            role_scope: 'promotion',
            created_at: '2026-03-21T10:05:00.000Z',
            updated_at: '2026-03-21T10:06:00.000Z',
          },
        ],
      });

    const response = await worker.fetch(
      new Request('https://rf.example/v1/rf/business/partners/rf_partner_1/pro-links', {
        headers: {
          'X-Gateway-Auth': ownerToken,
        },
      }),
      env
    );
    const body = await readJson<{
      items: Array<{ id: string; partnerId: string; proUserId: string; status: string; roleScope: string }>;
      nextCursor: string | null;
    }>(response);

    expect(response.status).toBe(200);
    expect(body.nextCursor).toBeNull();
    expect(body.items).toEqual([
      expect.objectContaining({
        id: 'rf_pro_link_pending',
        partnerId: 'rf_partner_1',
        proUserId: 'pro_user_1',
        status: 'pending',
        roleScope: 'curation',
      }),
      expect.objectContaining({
        id: 'rf_pro_link_active',
        partnerId: 'rf_partner_1',
        proUserId: 'pro_user_2',
        status: 'active',
        roleScope: 'promotion',
      }),
    ]);
    expect(executeMock).toHaveBeenCalledTimes(2);
    const statements = executedStatements();
    expect(statements[1].text).toContain('FROM rf_pro_link');
    expect(statements[1].text).toContain('WHERE partner_id =');
    expect(statements[1].values).toContain('rf_partner_1');
  });

  it('prevents non-owner from listing partner PRO links', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const nonOwnerToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'not_partner_owner' });

    executeMock.mockResolvedValueOnce({
      rows: [
        {
          id: 'rf_partner_1',
          owner_user_id: 'partner_owner_1',
          status: 'active',
        },
      ],
    });

    const response = await worker.fetch(
      new Request('https://rf.example/v1/rf/business/partners/rf_partner_1/pro-links', {
        headers: {
          'X-Gateway-Auth': nonOwnerToken,
        },
      }),
      env
    );
    const body = await readJson<{ error: { code: string } }>(response);

    expect(response.status).toBe(403);
    expect(body.error.code).toBe('RF_PARTNER_FORBIDDEN');
    expect(executeMock).toHaveBeenCalledTimes(1);
  });

  it('returns not found when listing PRO links for missing partner', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const ownerToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'partner_owner_1' });

    executeMock.mockResolvedValueOnce({ rows: [] });

    const response = await worker.fetch(
      new Request('https://rf.example/v1/rf/business/partners/missing_partner/pro-links', {
        headers: {
          'X-Gateway-Auth': ownerToken,
        },
      }),
      env
    );
    const body = await readJson<{ error: { code: string } }>(response);

    expect(response.status).toBe(404);
    expect(body.error.code).toBe('RF_PARTNER_NOT_FOUND');
    expect(executeMock).toHaveBeenCalledTimes(1);
  });

  it('requires auth to list partner PRO links', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };

    const response = await worker.fetch(new Request('https://rf.example/v1/rf/business/partners/rf_partner_1/pro-links'), env);
    const body = await readJson<{ error: { code: string } }>(response);

    expect(response.status).toBe(401);
    expect(body.error.code).toBe('UNAUTHORIZED');
    expect(executeMock).not.toHaveBeenCalled();
  });

  it('lets partner owner reject pending PRO link', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const ownerToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'partner_owner_1' });

    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_pro_link_pending',
            partner_id: 'rf_partner_1',
            pro_user_id: 'pro_user_1',
            status: 'pending',
            role_scope: 'promotion',
            created_at: '2026-03-21T10:10:00.000Z',
            updated_at: '2026-03-21T10:10:00.000Z',
            owner_user_id: 'partner_owner_1',
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_pro_link_pending',
            partner_id: 'rf_partner_1',
            pro_user_id: 'pro_user_1',
            status: 'ended',
            role_scope: 'promotion',
            created_at: '2026-03-21T10:10:00.000Z',
            updated_at: '2026-03-21T10:11:00.000Z',
          },
        ],
      });

    const response = await worker.fetch(
      new Request('https://rf.example/v1/rf/pro/links/rf_pro_link_pending/reject', {
        method: 'POST',
        headers: { 'X-Gateway-Auth': ownerToken },
      }),
      env
    );
    const body = await readJson<{ applied: boolean; proLink: { status: string } }>(response);

    expect(response.status).toBe(200);
    expect(body.applied).toBe(true);
    expect(body.proLink.status).toBe('ended');
  });

  it('prevents non-owner from rejecting PRO link', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const nonOwnerToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'not_partner_owner' });

    executeMock.mockResolvedValueOnce({
      rows: [
        {
          id: 'rf_pro_link_pending',
          partner_id: 'rf_partner_1',
          pro_user_id: 'pro_user_1',
          status: 'pending',
          role_scope: 'promotion',
          created_at: '2026-03-21T10:10:00.000Z',
          updated_at: '2026-03-21T10:10:00.000Z',
          owner_user_id: 'partner_owner_1',
        },
      ],
    });

    const response = await worker.fetch(
      new Request('https://rf.example/v1/rf/pro/links/rf_pro_link_pending/reject', {
        method: 'POST',
        headers: { 'X-Gateway-Auth': nonOwnerToken },
      }),
      env
    );
    const body = await readJson<{ error: { code: string } }>(response);

    expect(response.status).toBe(403);
    expect(body.error.code).toBe('RF_PARTNER_FORBIDDEN');
  });

  it('returns not found when rejecting missing PRO link', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const ownerToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'partner_owner_1' });
    executeMock.mockResolvedValueOnce({ rows: [] });

    const response = await worker.fetch(
      new Request('https://rf.example/v1/rf/pro/links/missing_link/reject', {
        method: 'POST',
        headers: { 'X-Gateway-Auth': ownerToken },
      }),
      env
    );
    const body = await readJson<{ error: { code: string } }>(response);

    expect(response.status).toBe(404);
    expect(body.error.code).toBe('RF_PRO_LINK_NOT_FOUND');
  });

  it('returns conflict when rejecting active PRO link', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const ownerToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'partner_owner_1' });
    executeMock.mockResolvedValueOnce({
      rows: [
        {
          id: 'rf_pro_link_active',
          partner_id: 'rf_partner_1',
          pro_user_id: 'pro_user_1',
          status: 'active',
          role_scope: 'promotion',
          created_at: '2026-03-21T10:10:00.000Z',
          updated_at: '2026-03-21T10:10:00.000Z',
          owner_user_id: 'partner_owner_1',
        },
      ],
    });

    const response = await worker.fetch(
      new Request('https://rf.example/v1/rf/pro/links/rf_pro_link_active/reject', {
        method: 'POST',
        headers: { 'X-Gateway-Auth': ownerToken },
      }),
      env
    );
    const body = await readJson<{ error: { code: string } }>(response);

    expect(response.status).toBe(409);
    expect(body.error.code).toBe('RF_PRO_LINK_CONFLICT');
  });

  it('treats rejecting ended PRO link as idempotent', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const ownerToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'partner_owner_1' });
    executeMock.mockResolvedValueOnce({
      rows: [
        {
          id: 'rf_pro_link_ended',
          partner_id: 'rf_partner_1',
          pro_user_id: 'pro_user_1',
          status: 'ended',
          role_scope: 'promotion',
          created_at: '2026-03-21T10:10:00.000Z',
          updated_at: '2026-03-21T10:10:00.000Z',
          owner_user_id: 'partner_owner_1',
        },
      ],
    });

    const response = await worker.fetch(
      new Request('https://rf.example/v1/rf/pro/links/rf_pro_link_ended/reject', {
        method: 'POST',
        headers: { 'X-Gateway-Auth': ownerToken },
      }),
      env
    );
    const body = await readJson<{ applied: boolean; proLink: { status: string } }>(response);

    expect(response.status).toBe(200);
    expect(body.applied).toBe(false);
    expect(body.proLink.status).toBe('ended');
  });

  it('lets partner owner end active PRO link', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const ownerToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'partner_owner_1' });

    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_pro_link_active',
            partner_id: 'rf_partner_1',
            pro_user_id: 'pro_user_1',
            status: 'active',
            role_scope: 'promotion',
            created_at: '2026-03-21T10:10:00.000Z',
            updated_at: '2026-03-21T10:10:00.000Z',
            owner_user_id: 'partner_owner_1',
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_pro_link_active',
            partner_id: 'rf_partner_1',
            pro_user_id: 'pro_user_1',
            status: 'ended',
            role_scope: 'promotion',
            created_at: '2026-03-21T10:10:00.000Z',
            updated_at: '2026-03-21T10:11:00.000Z',
          },
        ],
      });

    const response = await worker.fetch(
      new Request('https://rf.example/v1/rf/pro/links/rf_pro_link_active/end', {
        method: 'POST',
        headers: { 'X-Gateway-Auth': ownerToken },
      }),
      env
    );
    const body = await readJson<{ applied: boolean; proLink: { status: string } }>(response);

    expect(response.status).toBe(200);
    expect(body.applied).toBe(true);
    expect(body.proLink.status).toBe('ended');
  });

  it('prevents non-owner from ending PRO link', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const nonOwnerToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'not_partner_owner' });

    executeMock.mockResolvedValueOnce({
      rows: [
        {
          id: 'rf_pro_link_active',
          partner_id: 'rf_partner_1',
          pro_user_id: 'pro_user_1',
          status: 'active',
          role_scope: 'promotion',
          created_at: '2026-03-21T10:10:00.000Z',
          updated_at: '2026-03-21T10:10:00.000Z',
          owner_user_id: 'partner_owner_1',
        },
      ],
    });

    const response = await worker.fetch(
      new Request('https://rf.example/v1/rf/pro/links/rf_pro_link_active/end', {
        method: 'POST',
        headers: { 'X-Gateway-Auth': nonOwnerToken },
      }),
      env
    );
    const body = await readJson<{ error: { code: string } }>(response);

    expect(response.status).toBe(403);
    expect(body.error.code).toBe('RF_PARTNER_FORBIDDEN');
  });

  it('returns not found when ending missing PRO link', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const ownerToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'partner_owner_1' });
    executeMock.mockResolvedValueOnce({ rows: [] });

    const response = await worker.fetch(
      new Request('https://rf.example/v1/rf/pro/links/missing_link/end', {
        method: 'POST',
        headers: { 'X-Gateway-Auth': ownerToken },
      }),
      env
    );
    const body = await readJson<{ error: { code: string } }>(response);

    expect(response.status).toBe(404);
    expect(body.error.code).toBe('RF_PRO_LINK_NOT_FOUND');
  });

  it('returns conflict when ending pending PRO link', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const ownerToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'partner_owner_1' });
    executeMock.mockResolvedValueOnce({
      rows: [
        {
          id: 'rf_pro_link_pending',
          partner_id: 'rf_partner_1',
          pro_user_id: 'pro_user_1',
          status: 'pending',
          role_scope: 'promotion',
          created_at: '2026-03-21T10:10:00.000Z',
          updated_at: '2026-03-21T10:10:00.000Z',
          owner_user_id: 'partner_owner_1',
        },
      ],
    });

    const response = await worker.fetch(
      new Request('https://rf.example/v1/rf/pro/links/rf_pro_link_pending/end', {
        method: 'POST',
        headers: { 'X-Gateway-Auth': ownerToken },
      }),
      env
    );
    const body = await readJson<{ error: { code: string } }>(response);

    expect(response.status).toBe(409);
    expect(body.error.code).toBe('RF_PRO_LINK_CONFLICT');
  });

  it('treats ending ended PRO link as idempotent', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const ownerToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'partner_owner_1' });
    executeMock.mockResolvedValueOnce({
      rows: [
        {
          id: 'rf_pro_link_ended',
          partner_id: 'rf_partner_1',
          pro_user_id: 'pro_user_1',
          status: 'ended',
          role_scope: 'promotion',
          created_at: '2026-03-21T10:10:00.000Z',
          updated_at: '2026-03-21T10:10:00.000Z',
          owner_user_id: 'partner_owner_1',
        },
      ],
    });

    const response = await worker.fetch(
      new Request('https://rf.example/v1/rf/pro/links/rf_pro_link_ended/end', {
        method: 'POST',
        headers: { 'X-Gateway-Auth': ownerToken },
      }),
      env
    );
    const body = await readJson<{ applied: boolean; proLink: { status: string } }>(response);

    expect(response.status).toBe(200);
    expect(body.applied).toBe(false);
    expect(body.proLink.status).toBe('ended');
  });

  it('lets partner owner create and list catalog items', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const ownerToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'partner_owner_1' });

    executeMock
      .mockResolvedValueOnce({ rows: [partnerOwnerRow()] })
      .mockResolvedValueOnce({ rows: [partnerItemRow({ currency: 'USD' })] })
      .mockResolvedValueOnce({ rows: [partnerOwnerRow()] })
      .mockResolvedValueOnce({ rows: [partnerItemRow()] });

    const created = await worker.fetch(
      new Request('https://rf.example/v1/rf/business/partners/rf_partner_1/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Gateway-Auth': ownerToken },
        body: JSON.stringify({
          title: ' Thai Cooking Class ',
          description: 'Private class',
          category: 'experience',
          priceFrom: 120,
          currency: 'usd',
        }),
      }),
      env
    );
    const createdBody = await readJson<{ currency: string; priceFrom: number }>(created);
    expect(created.status).toBe(201);
    expect(createdBody.currency).toBe('USD');
    expect(createdBody.priceFrom).toBe(120);

    const list = await worker.fetch(
      new Request('https://rf.example/v1/rf/business/partners/rf_partner_1/items', {
        headers: { 'X-Gateway-Auth': ownerToken },
      }),
      env
    );
    const listBody = await readJson<{ items: Array<{ id: string }>; nextCursor: string | null }>(list);
    expect(list.status).toBe(200);
    expect(listBody.items).toEqual([expect.objectContaining({ id: 'rf_partner_item_1' })]);
    expect(listBody.nextCursor).toBeNull();
  });

  it('lets partner owner update and archive catalog items', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const ownerToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'partner_owner_1' });

    executeMock
      .mockResolvedValueOnce({ rows: [partnerOwnerRow()] })
      .mockResolvedValueOnce({ rows: [partnerItemRow()] })
      .mockResolvedValueOnce({ rows: [partnerItemRow({ title: 'Updated Class', price_from: null, currency: null })] })
      .mockResolvedValueOnce({ rows: [partnerOwnerRow()] })
      .mockResolvedValueOnce({ rows: [partnerItemRow()] })
      .mockResolvedValueOnce({ rows: [partnerItemRow({ status: 'archived' })] });

    const updated = await worker.fetch(
      new Request('https://rf.example/v1/rf/business/partners/rf_partner_1/items/rf_partner_item_1', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-Gateway-Auth': ownerToken },
        body: JSON.stringify({ title: 'Updated Class', priceFrom: null, currency: null }),
      }),
      env
    );
    const updatedBody = await readJson<{ title: string; priceFrom: number | null; currency: string | null }>(updated);
    expect(updated.status).toBe(200);
    expect(updatedBody).toEqual(expect.objectContaining({ title: 'Updated Class', priceFrom: null, currency: null }));

    const archived = await worker.fetch(
      new Request('https://rf.example/v1/rf/business/partners/rf_partner_1/items/rf_partner_item_1/archive', {
        method: 'POST',
        headers: { 'X-Gateway-Auth': ownerToken },
      }),
      env
    );
    const archivedBody = await readJson<{ status: string }>(archived);
    expect(archived.status).toBe(200);
    expect(archivedBody.status).toBe('archived');
  });

  it('protects catalog item routes by partner ownership and partner existence', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const nonOwnerToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'not_owner' });
    const ownerToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'partner_owner_1' });

    executeMock.mockResolvedValueOnce({ rows: [partnerOwnerRow('partner_owner_1')] }).mockResolvedValueOnce({ rows: [] });

    const forbidden = await worker.fetch(
      new Request('https://rf.example/v1/rf/business/partners/rf_partner_1/items', {
        headers: { 'X-Gateway-Auth': nonOwnerToken },
      }),
      env
    );
    const forbiddenBody = await readJson<{ error: { code: string } }>(forbidden);
    expect(forbidden.status).toBe(403);
    expect(forbiddenBody.error.code).toBe('RF_PARTNER_FORBIDDEN');

    const missing = await worker.fetch(
      new Request('https://rf.example/v1/rf/business/partners/missing_partner/items', {
        headers: { 'X-Gateway-Auth': ownerToken },
      }),
      env
    );
    const missingBody = await readJson<{ error: { code: string } }>(missing);
    expect(missing.status).toBe(404);
    expect(missingBody.error.code).toBe('RF_PARTNER_NOT_FOUND');
  });

  it('validates catalog item title and price fields', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const ownerToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'partner_owner_1' });

    executeMock.mockResolvedValue({ rows: [partnerOwnerRow()] });

    const emptyTitle = await worker.fetch(
      new Request('https://rf.example/v1/rf/business/partners/rf_partner_1/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Gateway-Auth': ownerToken },
        body: JSON.stringify({ title: '   ' }),
      }),
      env
    );
    expect(emptyTitle.status).toBe(400);

    const negativePrice = await worker.fetch(
      new Request('https://rf.example/v1/rf/business/partners/rf_partner_1/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Gateway-Auth': ownerToken },
        body: JSON.stringify({ title: 'Class', priceFrom: -1, currency: 'USD' }),
      }),
      env
    );
    expect(negativePrice.status).toBe(400);

    const priceWithoutCurrency = await worker.fetch(
      new Request('https://rf.example/v1/rf/business/partners/rf_partner_1/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Gateway-Auth': ownerToken },
        body: JSON.stringify({ title: 'Class', priceFrom: 10 }),
      }),
      env
    );
    const body = await readJson<{ error: { code: string } }>(priceWithoutCurrency);
    expect(priceWithoutCurrency.status).toBe(400);
    expect(body.error.code).toBe('RF_PARTNER_ITEM_INVALID');
  });

  it('creates offer with a valid active partner item', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const ownerToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'partner_owner_1' });

    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_partner_1',
            slug: 'catalog-partner',
            display_name: 'Catalog Partner',
            country_id: 'country_th',
            city_id: 'city_phuket',
            status: 'active',
            owner_user_id: 'partner_owner_1',
            created_at: '2026-03-21T10:00:00.000Z',
            updated_at: '2026-03-21T10:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [partnerItemRow()] })
      .mockResolvedValueOnce({ rows: [offerRow({ item_id: 'rf_partner_item_1' })] });

    const response = await worker.fetch(
      new Request('https://rf.example/v1/rf/business/partners/rf_partner_1/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Gateway-Auth': ownerToken },
        body: JSON.stringify({
          title: 'Item-linked offer',
          itemId: 'rf_partner_item_1',
          offerType: 'discount',
          visibility: 'public',
        }),
      }),
      env
    );
    const body = await readJson<{ itemId: string | null }>(response);
    expect(response.status).toBe(201);
    expect(body.itemId).toBe('rf_partner_item_1');
  });

  it('rejects offer binding to an item from another partner or archived item', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const ownerToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'partner_owner_1' });

    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_partner_1',
            slug: 'catalog-partner',
            display_name: 'Catalog Partner',
            country_id: 'country_th',
            city_id: 'city_phuket',
            status: 'active',
            owner_user_id: 'partner_owner_1',
            created_at: '2026-03-21T10:00:00.000Z',
            updated_at: '2026-03-21T10:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [partnerItemRow({ partner_id: 'rf_partner_2' })] })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_partner_1',
            slug: 'catalog-partner',
            display_name: 'Catalog Partner',
            country_id: 'country_th',
            city_id: 'city_phuket',
            status: 'active',
            owner_user_id: 'partner_owner_1',
            created_at: '2026-03-21T10:00:00.000Z',
            updated_at: '2026-03-21T10:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [partnerItemRow({ status: 'archived' })] });

    const otherPartner = await worker.fetch(
      new Request('https://rf.example/v1/rf/business/partners/rf_partner_1/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Gateway-Auth': ownerToken },
        body: JSON.stringify({
          title: 'Other item offer',
          itemId: 'rf_partner_item_2',
          offerType: 'discount',
          visibility: 'public',
        }),
      }),
      env
    );
    const otherBody = await readJson<{ error: { code: string } }>(otherPartner);
    expect(otherPartner.status).toBe(404);
    expect(otherBody.error.code).toBe('RF_PARTNER_ITEM_NOT_FOUND');

    const archived = await worker.fetch(
      new Request('https://rf.example/v1/rf/business/partners/rf_partner_1/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Gateway-Auth': ownerToken },
        body: JSON.stringify({
          title: 'Archived item offer',
          itemId: 'rf_partner_item_1',
          offerType: 'discount',
          visibility: 'public',
        }),
      }),
      env
    );
    const archivedBody = await readJson<{ error: { code: string } }>(archived);
    expect(archived.status).toBe(409);
    expect(archivedBody.error.code).toBe('RF_PARTNER_ITEM_ARCHIVED');
  });

  it('keeps offer creation working without item binding', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
    const ownerToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'partner_owner_1' });

    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'rf_partner_1',
            slug: 'catalog-partner',
            display_name: 'Catalog Partner',
            country_id: 'country_th',
            city_id: 'city_phuket',
            status: 'active',
            owner_user_id: 'partner_owner_1',
            created_at: '2026-03-21T10:00:00.000Z',
            updated_at: '2026-03-21T10:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [offerRow()] });

    const response = await worker.fetch(
      new Request('https://rf.example/v1/rf/business/partners/rf_partner_1/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Gateway-Auth': ownerToken },
        body: JSON.stringify({
          title: 'Legacy offer',
          offerType: 'discount',
          visibility: 'public',
        }),
      }),
      env
    );
    const body = await readJson<{ itemId: string | null }>(response);
    expect(response.status).toBe(201);
    expect(body.itemId).toBeNull();
  });

  describe('internal voucher diagnostics endpoint', () => {
    const diagnosticsPath = 'https://rf.example/v1/rf/internal/vouchers/rf_voucher_diag_1/diagnostics';

    it('rejects unauthenticated internal diagnostics request', async () => {
      const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
      const response = await worker.fetch(new Request(diagnosticsPath), env);
      const body = await readJson<{ error: { code: string } }>(response);
      expect(response.status).toBe(401);
      expect(body.error.code).toBe('UNAUTHORIZED');
    });

    it('rejects non-admin principal for internal diagnostics', async () => {
      const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
      const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1', role: 'pro' });
      const response = await worker.fetch(
        new Request(diagnosticsPath, {
          headers: { 'X-Gateway-Auth': token },
        }),
        env
      );
      const body = await readJson<{ error: { code: string } }>(response);
      expect(response.status).toBe(403);
      expect(body.error.code).toBe('FORBIDDEN');
    });

    it('returns 404 when diagnostics voucher is missing', async () => {
      const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
      const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'admin_1', role: 'admin' });
      executeMock.mockResolvedValueOnce({ rows: [] });
      const response = await worker.fetch(
        new Request(diagnosticsPath, {
          headers: { 'X-Gateway-Auth': token },
        }),
        env
      );
      const body = await readJson<{ error: { code: string } }>(response);
      expect(response.status).toBe(404);
      expect(body.error.code).toBe('RF_VOUCHER_NOT_FOUND');
    });

    it('returns diagnostics with masking and rejected attribution anomaly', async () => {
      const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
      const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'admin_1', role: 'admin' });
      executeMock
        .mockResolvedValueOnce({
          rows: [
            {
              id: 'rf_voucher_diag_1',
              offer_id: 'rf_offer_1',
              partner_id: 'rf_partner_1',
              issued_to_user_id: 'user_1',
              status: 'claimed',
              canonical_status: 'available',
              contract_version: 1,
              repeat_policy_snapshot: 'once_per_scope',
              issue_sequence: 1,
              expires_at: null,
              cancelled_at: null,
              status_changed_at: '2026-04-01T10:00:00.000Z',
              status_reason: null,
              status_actor_user_id: 'user_1',
              attribution_version: 1,
              attribution_strategy: 'rf_pro_last_touch_before_claim',
              attribution_status: 'rejected',
              attribution_source: 'pro_link',
              claim_source: 'pro_shared_link',
              attribution_share_code: 'rfp_secret_share',
              pro_attributed_user_id: null,
              pro_link_id: null,
              attribution_captured_at: '2026-04-01T09:59:00.000Z',
              attribution_confirmed_at: '2026-04-01T10:00:00.000Z',
              attribution_metadata: { rejectionReason: 'share_code_not_found', secret: 'value' },
              claim_scope: 'partner',
              rielt_listing_id: null,
              rielt_listing_title_snapshot: null,
              code: 'RF-ABC123456',
              claimed_at: '2026-04-01T10:00:00.000Z',
              redeemed_at: null,
              created_at: '2026-04-01T10:00:00.000Z',
              updated_at: '2026-04-01T10:00:00.000Z',
            },
          ],
        })
        .mockResolvedValueOnce({ rows: [offerRow({ status: 'active', visibility: 'public', repeat_policy: 'once_per_scope' })] })
        .mockResolvedValueOnce({ rows: [partnerOwnerRow()] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({
          rows: [
            {
              operation: 'voucher_claim',
              actor_user_id: 'user_1',
              idempotency_key: 'claim-secret-key',
              voucher_id: 'rf_voucher_diag_1',
              created_at: '2026-04-01T10:00:10.000Z',
              voucher_exists: 'rf_voucher_diag_1',
            },
          ],
        });

      const response = await worker.fetch(
        new Request(diagnosticsPath, {
          headers: { 'X-Gateway-Auth': token },
        }),
        env
      );
      const body = await readJson<{
        voucher: { codeMasked: string | null; code?: string };
        attribution: { metadataKeys: string[] };
        idempotency: { claimBindings: Array<{ idempotencyKeyFingerprint: string; idempotencyKey?: string }> };
        anomalies: Array<{ code: string }>;
      }>(response);
      expect(response.status).toBe(200);
      expect(body.voucher.code).toBeUndefined();
      expect(body.voucher.codeMasked).toMatch(/^\*\*\*/);
      expect(body.attribution.metadataKeys).toContain('rejectionReason');
      expect(body.idempotency.claimBindings[0]?.idempotencyKey).toBeUndefined();
      expect(body.idempotency.claimBindings[0]?.idempotencyKeyFingerprint).not.toContain('claim-secret-key');
      expect(body.anomalies.map((item) => item.code)).toContain('rejected_attribution_present');
    });

    it('flags confirmed attribution without pro link and listing scope without listing id', async () => {
      const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
      const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'admin_1', role: 'admin' });
      executeMock
        .mockResolvedValueOnce({
          rows: [
            {
              id: 'rf_voucher_diag_1',
              offer_id: 'rf_offer_1',
              partner_id: 'rf_partner_1',
              issued_to_user_id: 'user_1',
              status: 'claimed',
              canonical_status: 'available',
              contract_version: 1,
              repeat_policy_snapshot: 'once_per_scope',
              issue_sequence: 1,
              expires_at: null,
              cancelled_at: null,
              status_changed_at: '2026-04-01T10:00:00.000Z',
              status_reason: null,
              status_actor_user_id: 'user_1',
              attribution_version: 1,
              attribution_strategy: 'rf_pro_last_touch_before_claim',
              attribution_status: 'confirmed',
              attribution_source: 'pro_link',
              claim_source: 'pro_shared_link',
              attribution_share_code: 'rfp_secret_share',
              pro_attributed_user_id: 'pro_1',
              pro_link_id: null,
              attribution_captured_at: '2026-04-01T09:59:00.000Z',
              attribution_confirmed_at: '2026-04-01T10:00:00.000Z',
              attribution_metadata: {},
              claim_scope: 'listing',
              rielt_listing_id: null,
              rielt_listing_title_snapshot: null,
              code: 'RF-ABC123456',
              claimed_at: '2026-04-01T10:00:00.000Z',
              redeemed_at: null,
              created_at: '2026-04-01T10:00:00.000Z',
              updated_at: '2026-04-01T10:00:00.000Z',
            },
          ],
        })
        .mockResolvedValueOnce({ rows: [offerRow({ status: 'active', visibility: 'public', repeat_policy: 'once_per_scope' })] })
        .mockResolvedValueOnce({ rows: [partnerOwnerRow()] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] });

      const response = await worker.fetch(
        new Request(diagnosticsPath, {
          headers: { 'X-Gateway-Auth': token },
        }),
        env
      );
      const body = await readJson<{ anomalies: Array<{ code: string }> }>(response);
      expect(response.status).toBe(200);
      expect(body.anomalies.map((item) => item.code)).toEqual(
        expect.arrayContaining(['confirmed_attribution_without_pro_link', 'listing_scope_missing_listing_id'])
      );
    });

    it('flags missing guard for once_per_scope redeemed voucher', async () => {
      const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
      const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'admin_1', role: 'admin' });
      executeMock
        .mockResolvedValueOnce({
          rows: [
            {
              id: 'rf_voucher_diag_1',
              offer_id: 'rf_offer_1',
              partner_id: 'rf_partner_1',
              issued_to_user_id: 'user_1',
              status: 'redeemed',
              canonical_status: 'redeemed',
              contract_version: 1,
              repeat_policy_snapshot: 'once_per_scope',
              issue_sequence: 1,
              expires_at: null,
              cancelled_at: null,
              status_changed_at: '2026-04-01T11:00:00.000Z',
              status_reason: null,
              status_actor_user_id: 'partner_owner_1',
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
              claim_scope: 'partner',
              rielt_listing_id: null,
              rielt_listing_title_snapshot: null,
              code: 'RF-ABC123456',
              claimed_at: '2026-04-01T10:00:00.000Z',
              redeemed_at: '2026-04-01T11:00:00.000Z',
              created_at: '2026-04-01T10:00:00.000Z',
              updated_at: '2026-04-01T11:00:00.000Z',
            },
          ],
        })
        .mockResolvedValueOnce({ rows: [offerRow({ status: 'active', visibility: 'public', repeat_policy: 'once_per_scope' })] })
        .mockResolvedValueOnce({ rows: [partnerOwnerRow()] })
        .mockResolvedValueOnce({
          rows: [
            {
              id: 'rf_redeem_1',
              voucher_id: 'rf_voucher_diag_1',
              result_status: 'succeeded',
              actor_user_id: 'partner_owner_1',
              redeemed_at: '2026-04-01T11:00:00.000Z',
              created_at: '2026-04-01T11:00:00.000Z',
              idempotency_key: 'redeem-key-1',
              correlation_id: 'req_1',
            },
          ],
        })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] });

      const response = await worker.fetch(
        new Request(diagnosticsPath, {
          headers: { 'X-Gateway-Auth': token },
        }),
        env
      );
      const body = await readJson<{ anomalies: Array<{ code: string }> }>(response);
      expect(response.status).toBe(200);
      expect(body.anomalies.map((item) => item.code)).toContain('once_per_scope_redeemed_without_guard');
    });

    it('flags unexpected guard for repeat_after_redeem redeemed voucher', async () => {
      const env: Env = { SERVICE_JWT_SECRET: 'service-secret', DATABASE_URL: 'postgres://example' };
      const token = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'admin_1', role: 'admin' });
      executeMock
        .mockResolvedValueOnce({
          rows: [
            {
              id: 'rf_voucher_diag_1',
              offer_id: 'rf_offer_1',
              partner_id: 'rf_partner_1',
              issued_to_user_id: 'user_1',
              status: 'redeemed',
              canonical_status: 'redeemed',
              contract_version: 1,
              repeat_policy_snapshot: 'repeat_after_redeem',
              issue_sequence: 2,
              expires_at: null,
              cancelled_at: null,
              status_changed_at: '2026-04-01T11:00:00.000Z',
              status_reason: null,
              status_actor_user_id: 'partner_owner_1',
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
              claim_scope: 'partner',
              rielt_listing_id: null,
              rielt_listing_title_snapshot: null,
              code: 'RF-ABC123456',
              claimed_at: '2026-04-01T10:00:00.000Z',
              redeemed_at: '2026-04-01T11:00:00.000Z',
              created_at: '2026-04-01T10:00:00.000Z',
              updated_at: '2026-04-01T11:00:00.000Z',
            },
          ],
        })
        .mockResolvedValueOnce({ rows: [offerRow({ status: 'active', visibility: 'public', repeat_policy: 'repeat_after_redeem' })] })
        .mockResolvedValueOnce({ rows: [partnerOwnerRow()] })
        .mockResolvedValueOnce({
          rows: [
            {
              id: 'rf_redeem_1',
              voucher_id: 'rf_voucher_diag_1',
              result_status: 'succeeded',
              actor_user_id: 'partner_owner_1',
              redeemed_at: '2026-04-01T11:00:00.000Z',
              created_at: '2026-04-01T11:00:00.000Z',
              idempotency_key: 'redeem-key-1',
              correlation_id: 'req_1',
            },
          ],
        })
        .mockResolvedValueOnce({
          rows: [
            {
              id: 'rf_guard_1',
              offer_id: 'rf_offer_1',
              issued_to_user_id: 'user_1',
              claim_scope: 'partner',
              scope_ref: '__partner__',
              consumed_voucher_id: 'rf_voucher_diag_1',
              repeat_policy_snapshot: 'once_per_scope',
              consumed_at: '2026-04-01T11:00:00.000Z',
              consumed_voucher_exists: 'rf_voucher_diag_1',
            },
          ],
        })
        .mockResolvedValueOnce({ rows: [] });

      const response = await worker.fetch(
        new Request(diagnosticsPath, {
          headers: { 'X-Gateway-Auth': token },
        }),
        env
      );
      const body = await readJson<{ anomalies: Array<{ code: string }> }>(response);
      expect(response.status).toBe(200);
      expect(body.anomalies.map((item) => item.code)).toContain('unexpected_repeat_after_redeem_guard');
    });
  });
});
