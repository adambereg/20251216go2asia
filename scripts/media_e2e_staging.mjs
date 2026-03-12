#!/usr/bin/env node
/**
 * Media E2E staging flow — automated smoke test.
 *
 * Steps: upload-token -> PUT upload -> DB media_id lookup -> GET metadata ->
 *        attach (owner) -> attach idempotent -> attach (non-owner, expect 403) ->
 *        verify media_usage exact active tuple.
 *
 * Required env:
 * - STAGING_GATEWAY_URL
 * - STAGING_TEST_JWT
 * - STAGING_DATABASE_URL
 *
 * Optional env:
 * - STAGING_TEST_JWT_ALT
 * - STAGING_ORIGIN
 * - MEDIA_E2E_MODE=full|allow_skips (default: full)
 * - MEDIA_E2E_ATTACH_OWNER_TYPE (default: space_post)
 * - MEDIA_E2E_ATTACH_OWNER_ID (default: post_step3_001)
 * - MEDIA_E2E_ATTACH_USAGE_TYPE (default: hero_image)
 * - MEDIA_E2E_ATTACH_SLOT (default: cover)
 */

import process from 'node:process';
import { Client } from 'pg';

// --- Env ---
const GATEWAY = (process.env.STAGING_GATEWAY_URL || '').trim();
const JWT_OWNER = (process.env.STAGING_TEST_JWT || '').trim();
const JWT_ALT = (process.env.STAGING_TEST_JWT_ALT || '').trim();
const DB_URL = (process.env.STAGING_DATABASE_URL || '').trim();
const ORIGIN = (process.env.STAGING_ORIGIN || '').trim() || 'https://20251216go2asia09.netlify.app';
const E2E_MODE = (process.env.MEDIA_E2E_MODE || 'full').trim().toLowerCase();
const ATTACH_OWNER_TYPE = (process.env.MEDIA_E2E_ATTACH_OWNER_TYPE || 'space_post').trim();
const ATTACH_OWNER_ID = (process.env.MEDIA_E2E_ATTACH_OWNER_ID || 'post_step3_001').trim();
const ATTACH_USAGE_TYPE = (process.env.MEDIA_E2E_ATTACH_USAGE_TYPE || 'hero_image').trim();
const ATTACH_SLOT_RAW = process.env.MEDIA_E2E_ATTACH_SLOT;
const ATTACH_SLOT = ATTACH_SLOT_RAW == null ? 'cover' : ATTACH_SLOT_RAW.trim();

const steps = [];
let failed = false;
let hasSkips = false;

function step(name, fn) {
  steps.push({ name, fn });
}

function fail(msg, ctx = {}) {
  failed = true;
  const requestId = ctx.requestId || ctx.request?.headers?.get?.('X-Request-ID') || '-';
  const body = ctx.body ?? ctx.text ?? ctx.response?.body ?? '';
  const preview = typeof body === 'string' ? body.slice(0, 400) : JSON.stringify(body).slice(0, 400);
  console.error(`\n[FAIL] ${msg}`);
  console.error(`  requestId=${requestId}`);
  if (preview) console.error(`  body=${preview}`);
  throw new Error(msg);
}

function ok(msg) {
  console.log(`  [OK] ${msg}`);
}

function skip(msg) {
  hasSkips = true;
  console.log(`  [SKIP] ${msg}`);
}

function decodeJwtSub(jwt) {
  if (!jwt) return null;
  try {
    const payload = JSON.parse(Buffer.from(jwt.split('.')[1], 'base64url').toString('utf8'));
    return payload?.sub ?? null;
  } catch {
    return null;
  }
}

async function fetchJson(url, init = {}) {
  const res = await fetch(url, init);
  const ct = res.headers.get('content-type') || '';
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }
  return { response: res, contentType: ct, text, json };
}

async function main() {
  console.log('--- Media E2E Staging ---');
  console.log(`Gateway: ${GATEWAY || '(not set)'}`);
  console.log(`Origin:  ${ORIGIN}`);
  console.log(`Mode:    ${E2E_MODE}`);
  console.log(
    `Attach:  ownerType=${ATTACH_OWNER_TYPE}, ownerId=${ATTACH_OWNER_ID}, usageType=${ATTACH_USAGE_TYPE}, slot=${ATTACH_SLOT}`
  );
  if (!GATEWAY || !JWT_OWNER || !DB_URL) {
    fail('Missing required env: STAGING_GATEWAY_URL, STAGING_TEST_JWT, STAGING_DATABASE_URL');
  }
  if (E2E_MODE !== 'full' && E2E_MODE !== 'allow_skips') {
    fail(`Unsupported MEDIA_E2E_MODE="${E2E_MODE}". Use full or allow_skips.`);
  }
  const ownerSub = decodeJwtSub(JWT_OWNER);
  if (!ownerSub) fail('STAGING_TEST_JWT: cannot decode sub');
  const altSub = JWT_ALT ? decodeJwtSub(JWT_ALT) : null;
  const canRunNonOwner = Boolean(JWT_ALT && altSub && altSub !== ownerSub);
  if (E2E_MODE === 'full' && !canRunNonOwner) {
    fail(
      'Step 7 requires STAGING_TEST_JWT_ALT with a different user sub in full mode. ' +
        'Set MEDIA_E2E_MODE=allow_skips to allow skip.'
    );
  }

  const headers = (jwt) => ({
    Authorization: `Bearer ${jwt}`,
    Origin: ORIGIN,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });

  // 1. POST /v1/media/upload-token
  step('1. POST /v1/media/upload-token', async () => {
    const url = `${GATEWAY}/v1/media/upload-token`;
    const { response, text, json } = await fetchJson(url, {
      method: 'POST',
      headers: headers(JWT_OWNER),
      body: JSON.stringify({
        scope: 'content',
        filename: 'step3-e2e.jpg',
        contentType: 'image/jpeg',
        sizeBytes: 1024,
      }),
    });
    if (response.status !== 200) fail(`Expected 200, got ${response.status}`, { text, requestId: json?.requestId });
    if (!json?.uploadUrl || !json?.key) fail('Missing uploadUrl/key in response', { text });
    if (!String(json.uploadUrl).startsWith('/v1/media/upload/')) fail('uploadUrl must be /v1/media/upload/...', { text });
    ok(`status=${response.status} key=${json.key}`);
    return { uploadUrl: json.uploadUrl, key: json.key };
  });

  // 2. PUT upload
  step('2. PUT upload to uploadUrl', async (ctx) => {
    const { uploadUrl, key } = ctx;
    const url = `${GATEWAY}${uploadUrl}`;
    const bytes = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'image/jpeg' },
      body: bytes,
    });
    const text = await res.text();
    let json = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {}
    if (res.status !== 201) fail(`Expected 201, got ${res.status}`, { text, requestId: json?.requestId });
    if (!json?.ok || json?.key !== key) fail('Upload response invalid', { text });
    ok(`status=${res.status} key=${key}`);
    return { ...ctx, key };
  });

  // 3. SELECT media_id from media_assets by key
  step('3. SELECT media_id from media_assets', async (ctx) => {
    const client = new Client({ connectionString: DB_URL });
    await client.connect();
    try {
      const r = await client.query(
        'SELECT id FROM media_assets WHERE key = $1 ORDER BY created_at DESC LIMIT 1',
        [ctx.key]
      );
      const mediaId = r?.rows?.[0]?.id;
      if (!mediaId) fail('No media_assets row for key', { body: ctx.key });
      ok(`media_id=${mediaId}`);
      return { ...ctx, mediaId };
    } finally {
      await client.end();
    }
  });

  // 4. GET /v1/media/:mediaId
  step('4. GET /v1/media/:mediaId', async (ctx) => {
    const url = `${GATEWAY}/v1/media/${ctx.mediaId}`;
    const { response, text, json } = await fetchJson(url, {
      method: 'GET',
      headers: headers(JWT_OWNER),
    });
    if (response.status !== 200) fail(`Expected 200, got ${response.status}`, { text, requestId: json?.requestId });
    if (!json?.media_id || json.media_id !== ctx.mediaId) fail('Metadata media_id mismatch', { text });
    ok(`status=${response.status} media_id=${json.media_id}`);
    return ctx;
  });

  // 5. POST /v1/media/:mediaId/attach (owner)
  const attachBody = {
    ownerType: ATTACH_OWNER_TYPE,
    ownerId: ATTACH_OWNER_ID,
    usageType: ATTACH_USAGE_TYPE,
    slot: ATTACH_SLOT,
  };
  step('5. POST attach (owner)', async (ctx) => {
    const url = `${GATEWAY}/v1/media/${ctx.mediaId}/attach`;
    const { response, text, json } = await fetchJson(url, {
      method: 'POST',
      headers: headers(JWT_OWNER),
      body: JSON.stringify(attachBody),
    });
    if (response.status !== 200) fail(`Expected 200, got ${response.status}`, { text, requestId: json?.requestId });
    if (!json?.ok || json?.status !== 'attached') fail('Attach response invalid', { text });
    ok(`status=${response.status} status=${json?.status}`);
    return ctx;
  });

  // 6. Repeat attach (idempotent)
  step('6. POST attach (idempotent)', async (ctx) => {
    const url = `${GATEWAY}/v1/media/${ctx.mediaId}/attach`;
    const { response, text, json } = await fetchJson(url, {
      method: 'POST',
      headers: headers(JWT_OWNER),
      body: JSON.stringify(attachBody),
    });
    if (response.status !== 200) fail(`Expected 200 (idempotent), got ${response.status}`, { text });
    if (!json?.ok) fail('Idempotent attach should return ok', { text });
    ok(`status=${response.status} idempotent ok`);
    return ctx;
  });

  // 7. POST attach (non-owner) -> expect 403
  step('7. POST attach (non-owner) expect 403', async (ctx) => {
    if (!canRunNonOwner) {
      if (E2E_MODE === 'allow_skips') {
        skip('STAGING_TEST_JWT_ALT missing/invalid/same-user; non-owner step skipped');
        return ctx;
      }
      fail('STAGING_TEST_JWT_ALT missing/invalid/same-user in full mode');
    }
    const url = `${GATEWAY}/v1/media/${ctx.mediaId}/attach`;
    const { response, text } = await fetchJson(url, {
      method: 'POST',
      headers: headers(JWT_ALT),
      body: JSON.stringify(attachBody),
    });
    if (response.status !== 403) fail(`Expected 403 for non-owner, got ${response.status}`, { text });
    ok(`status=403 (expected for non-owner)`);
    return ctx;
  });

  // 8. SELECT media_usage - exactly 1 active row for exact tuple
  step('8. SELECT media_usage (exact active tuple)', async (ctx) => {
    const client = new Client({ connectionString: DB_URL });
    await client.connect();
    try {
      const r = await client.query(
        `SELECT COUNT(*)::int AS n
         FROM media_usage
         WHERE media_id = $1
           AND owner_type = $2
           AND owner_id = $3
           AND usage_type = $4
           AND slot IS NOT DISTINCT FROM $5
           AND deleted_at IS NULL`,
        [ctx.mediaId, ATTACH_OWNER_TYPE, ATTACH_OWNER_ID, ATTACH_USAGE_TYPE, ATTACH_SLOT]
      );
      const count = r?.rows?.[0]?.n ?? -1;
      if (count !== 1) {
        fail(`Expected 1 active media_usage tuple row, got ${count}`, {
          body: {
            mediaId: ctx.mediaId,
            ownerType: ATTACH_OWNER_TYPE,
            ownerId: ATTACH_OWNER_ID,
            usageType: ATTACH_USAGE_TYPE,
            slot: ATTACH_SLOT,
            count,
          },
        });
      }
      ok(`active tuple rows=1`);
      return ctx;
    }
    finally {
      await client.end();
    }
  });

  // Run steps
  let ctx = {};
  for (const { name, fn } of steps) {
    console.log(`\n--- ${name} ---`);
    try {
      ctx = await fn(ctx);
    } catch (e) {
      if (!failed) {
        console.error(e);
        process.exit(1);
      }
      throw e;
    }
  }

  if (hasSkips) {
    console.log('\n--- PASS_WITH_SKIPS: Media E2E staging flow completed ---');
  } else {
    console.log('\n--- PASS: Media E2E staging flow completed ---');
  }
}

main().catch((err) => {
  console.error('\n[FATAL]', err?.message || err);
  process.exit(1);
});
