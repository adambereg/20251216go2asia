import process from 'node:process';

const DEFAULT_PARTNER_NAME = 'Connect Voucher Demo Partner';
const DEFAULT_OFFER_TITLES = [
  'Connect Voucher Demo Active Perk',
  'Connect Voucher Demo Redeemed Perk',
  'Connect Voucher Demo Spare Perk',
];

function trimSlash(value) {
  return value.replace(/\/+$/g, '');
}

function safeId(value) {
  return value.replace(/[^a-z0-9_-]+/gi, '-').replace(/^-+|-+$/g, '').slice(0, 96);
}

function parseCsv(value) {
  return (value ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseArgs(argv) {
  return {
    apply: argv.includes('--apply'),
    verifyOnly: argv.includes('--verify-only'),
  };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertDemoSafe(args) {
  if (!args.apply && !args.verifyOnly) return;

  const env = (process.env.ENVIRONMENT ?? process.env.NODE_ENV ?? 'dev').toLowerCase();
  if (env === 'production' || process.env.NODE_ENV?.toLowerCase() === 'production') {
    throw new Error('Refusing to run Connect voucher demo dataset against production environment');
  }

  const confirm = (process.env.RF_CONNECT_DEMO_CONFIRM ?? '').toLowerCase();
  if (!['dev', 'local', 'staging'].includes(confirm)) {
    throw new Error('Set RF_CONNECT_DEMO_CONFIRM=dev|local|staging before running --apply or --verify-only');
  }
}

function getConfig(args) {
  const apiBase = trimSlash(
    process.env.RF_DEMO_API_BASE?.trim() ||
      process.env.STAGING_GATEWAY_URL?.trim() ||
      process.env.GATEWAY_URL?.trim() ||
      ''
  );
  const authHeader = process.env.RF_DEMO_AUTH_HEADER?.trim() || 'X-Gateway-Auth';
  const ownerAuth = process.env.RF_DEMO_OWNER_AUTH?.trim() || '';
  const userAuth = process.env.RF_DEMO_USER_AUTH?.trim() || '';
  const partnerName = process.env.RF_DEMO_PARTNER_NAME?.trim() || DEFAULT_PARTNER_NAME;
  const offerTitles = parseCsv(process.env.RF_DEMO_OFFER_TITLES);

  const config = {
    apiBase,
    authHeader,
    ownerAuth,
    userAuth,
    partnerName,
    countryId: process.env.RF_DEMO_COUNTRY_ID?.trim() || '',
    cityId: process.env.RF_DEMO_CITY_ID?.trim() || '',
    offerTitles: offerTitles.length >= 2 ? offerTitles.slice(0, 3) : DEFAULT_OFFER_TITLES,
  };

  if (args.apply || args.verifyOnly) {
    assert(config.apiBase, 'Missing RF_DEMO_API_BASE, STAGING_GATEWAY_URL or GATEWAY_URL');
    assert(config.userAuth, 'Missing RF_DEMO_USER_AUTH');
  }

  if (args.apply) {
    assert(config.ownerAuth, 'Missing RF_DEMO_OWNER_AUTH');
    assert(config.countryId, 'Missing RF_DEMO_COUNTRY_ID');
    assert(config.cityId, 'Missing RF_DEMO_CITY_ID');
  }

  return config;
}

function authHeaders(config, token, extra = {}) {
  return {
    Accept: 'application/json',
    [config.authHeader]: token,
    ...extra,
  };
}

async function fetchJson(url, init) {
  const response = await fetch(url, init);
  const text = await response.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  return { response, text, json };
}

async function expectJson(config, path, init, expectedStatuses = [200]) {
  const url = `${config.apiBase}${path}`;
  const result = await fetchJson(url, init);
  if (!expectedStatuses.includes(result.response.status)) {
    throw new Error(`Expected ${expectedStatuses.join('/')} for ${path}, got ${result.response.status}: ${result.text.slice(0, 500)}`);
  }
  assert(result.json && typeof result.json === 'object', `${path}: expected JSON object response`);
  return result.json;
}

async function listPublicPartners(config) {
  const json = await expectJson(config, '/v1/rf/partners', {
    headers: { Accept: 'application/json' },
  });
  assert(Array.isArray(json.items), 'GET /v1/rf/partners: expected items[]');
  return json.items;
}

async function createOrFindPartner(config) {
  const existing = (await listPublicPartners(config)).find((partner) => partner.displayName === config.partnerName);
  if (existing?.id) {
    console.log(`[connect-voucher-demo] partner=reused id=${existing.id}`);
    return existing;
  }

  const partner = await expectJson(
    config,
    '/v1/rf/business/partners',
    {
      method: 'POST',
      headers: authHeaders(config, config.ownerAuth, { 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        displayName: config.partnerName,
        countryId: config.countryId,
        cityId: config.cityId,
      }),
    },
    [201]
  );
  console.log(`[connect-voucher-demo] partner=created id=${partner.id}`);
  return partner;
}

async function listPublicOffers(config) {
  const json = await expectJson(config, '/v1/rf/offers', {
    headers: { Accept: 'application/json' },
  });
  assert(Array.isArray(json.items), 'GET /v1/rf/offers: expected items[]');
  return json.items;
}

async function createOrFindOffer(config, partnerId, title) {
  const existing = (await listPublicOffers(config)).find((offer) => offer.partnerId === partnerId && offer.title === title);
  if (existing?.id) {
    console.log(`[connect-voucher-demo] offer=reused id=${existing.id} title="${title}"`);
    return existing;
  }

  const draft = await expectJson(
    config,
    `/v1/rf/business/partners/${encodeURIComponent(partnerId)}/offers`,
    {
      method: 'POST',
      headers: authHeaders(config, config.ownerAuth, { 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        title,
        offerType: 'discount',
        visibility: 'public',
      }),
    },
    [201]
  );

  const activated = await expectJson(
    config,
    `/v1/rf/business/partners/${encodeURIComponent(partnerId)}/offers/${encodeURIComponent(draft.id)}/activate`,
    {
      method: 'POST',
      headers: authHeaders(config, config.ownerAuth),
    },
    [200]
  );
  console.log(`[connect-voucher-demo] offer=created id=${activated.id} title="${title}"`);
  return activated;
}

async function claimVoucher(config, offer) {
  const idempotencyKey = `connect-demo-v1-${safeId(offer.id)}`;
  const json = await expectJson(
    config,
    `/v1/rf/offers/${encodeURIComponent(offer.id)}/claim`,
    {
      method: 'POST',
      headers: authHeaders(config, config.userAuth, { 'Idempotency-Key': idempotencyKey }),
    },
    [200, 201]
  );
  assert(json.voucher?.id, `claim ${offer.id}: expected voucher.id`);
  console.log(`[connect-voucher-demo] voucher=claimed offer=${offer.id} voucher=${json.voucher.id} status=${json.voucher.status}`);
  return json.voucher;
}

async function redeemVoucher(config, partnerId, voucherId) {
  const json = await expectJson(
    config,
    `/v1/rf/business/partners/${encodeURIComponent(partnerId)}/vouchers/${encodeURIComponent(voucherId)}/redeem`,
    {
      method: 'POST',
      headers: authHeaders(config, config.ownerAuth),
    },
    [200]
  );
  assert(json.voucher?.id, `redeem ${voucherId}: expected voucher.id`);
  console.log(`[connect-voucher-demo] voucher=redeemed voucher=${json.voucher.id} applied=${json.applied}`);
  return json.voucher;
}

async function verify(config) {
  const summary = await expectJson(config, '/v1/rf/me/vouchers/summary', {
    headers: authHeaders(config, config.userAuth),
  });
  const list = await expectJson(config, '/v1/rf/me/vouchers', {
    headers: authHeaders(config, config.userAuth),
  });

  assert(Number(summary.totalVouchers) >= 2, 'summary.totalVouchers must be >= 2');
  assert(Number(summary.activeVouchers) >= 1, 'summary.activeVouchers must be >= 1');
  assert(Number(summary.usedVouchers) >= 1, 'summary.usedVouchers must be >= 1');
  assert(Array.isArray(list.items), 'GET /v1/rf/me/vouchers: expected items[]');

  console.log('[connect-voucher-demo] summary verified');
  console.log(JSON.stringify({ summary, voucherCount: list.items.length }, null, 2));
}

function printPlan(config) {
  console.log('[connect-voucher-demo] mode=dry-run');
  console.log('This script is dev/demo only and does not run automatically.');
  console.log('Required for --apply: RF_CONNECT_DEMO_CONFIRM, RF_DEMO_API_BASE, RF_DEMO_OWNER_AUTH, RF_DEMO_USER_AUTH, RF_DEMO_COUNTRY_ID, RF_DEMO_CITY_ID.');
  console.log('Required for --verify-only: RF_CONNECT_DEMO_CONFIRM, RF_DEMO_API_BASE, RF_DEMO_USER_AUTH.');
  console.log(`[connect-voucher-demo] auth_header=${config.authHeader}`);
  console.log(`[connect-voucher-demo] partner="${config.partnerName}"`);
  console.log(`[connect-voucher-demo] offers=${config.offerTitles.map((title) => `"${title}"`).join(', ')}`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  assertDemoSafe(args);
  const config = getConfig(args);

  if (!args.apply && !args.verifyOnly) {
    printPlan(config);
    return;
  }

  if (args.verifyOnly) {
    await verify(config);
    return;
  }

  const partner = await createOrFindPartner(config);
  const offers = [];
  for (const title of config.offerTitles) {
    offers.push(await createOrFindOffer(config, partner.id, title));
  }

  const vouchers = [];
  for (const offer of offers) {
    vouchers.push(await claimVoucher(config, offer));
  }

  await redeemVoucher(config, partner.id, vouchers[1].id);
  await verify(config);
}

main().catch((error) => {
  console.error('[connect-voucher-demo] FATAL', error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
