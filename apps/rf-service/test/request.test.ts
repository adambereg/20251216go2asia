import { beforeEach, describe, expect, it } from 'vitest';

import { makeGatewayJwt, readJson } from '../../../tests/helpers/worker-test';
import worker, { type Env } from '../src/index';
import { resetRfStoreForTests } from '../src/store';

describe('rf-service request', () => {
  beforeEach(() => {
    resetRfStoreForTests();
  });

  it('creates partner and exposes it via public partner list', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret' };
    const ownerToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'partner_owner_1' });

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
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret' };
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

  it('supports claim idempotency and terminal redeem semantics', async () => {
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret' };
    const ownerToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'partner_owner_1' });
    const userToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'user_1' });

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
    const env: Env = { SERVICE_JWT_SECRET: 'service-secret' };
    const ownerToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'partner_owner_1' });
    const proToken = await makeGatewayJwt(env.SERVICE_JWT_SECRET!, { sub: 'pro_user_1' });

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
