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
import path from 'node:path';
import fs from 'node:fs/promises';
import { Client } from 'pg';

function getArg(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? (process.argv[i + 1] || '').trim() : '';
}

// --- Env ---
const GATEWAY = (process.env.STAGING_GATEWAY_URL || '').trim();
const JWT_OWNER = getArg('--owner-jwt') || (process.env.STAGING_TEST_JWT || '').trim();
const JWT_ALT = getArg('--alt-jwt') || (process.env.STAGING_TEST_JWT_ALT || '').trim();
const DB_URL = (process.env.STAGING_DATABASE_URL || '').trim();
const ORIGIN = (process.env.STAGING_ORIGIN || '').trim() || 'https://20251216go2asia09.netlify.app';
const E2E_MODE = (process.env.MEDIA_E2E_MODE || 'full').trim().toLowerCase();
const ATTACH_OWNER_TYPE = (process.env.MEDIA_E2E_ATTACH_OWNER_TYPE || 'space_post').trim();
const ATTACH_OWNER_ID = (process.env.MEDIA_E2E_ATTACH_OWNER_ID || 'post_step3_001').trim();
const ATTACH_USAGE_TYPE = (process.env.MEDIA_E2E_ATTACH_USAGE_TYPE || 'hero_image').trim();
const ATTACH_SLOT_RAW = process.env.MEDIA_E2E_ATTACH_SLOT;
const ATTACH_SLOT = ATTACH_SLOT_RAW == null ? 'cover' : ATTACH_SLOT_RAW.trim();
const ONLY_STEP7 = (process.env.MEDIA_E2E_ONLY_STEP7 || '').trim().toLowerCase() === 'true';
const STEP7_MEDIA_ID = (process.env.MEDIA_E2E_MEDIA_ID || '').trim();
const LAST_MEDIA_ID_FILE = path.join('.tmp', 'media_e2e_last_id');

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

function normalizeTransportError(error) {
  const err = error instanceof Error ? error : new Error(String(error));
  const cause = err.cause && typeof err.cause === 'object' ? err.cause : null;
  return {
    kind: 'transport_failure',
    name: err.name,
    message: err.message,
    code: cause?.code ?? err.code ?? null,
    syscall: cause?.syscall ?? null,
    errno: cause?.errno ?? null,
  };
}

async function saveLastMediaId(mediaId) {
  await fs.mkdir(path.dirname(LAST_MEDIA_ID_FILE), { recursive: true });
  await fs.writeFile(LAST_MEDIA_ID_FILE, `${String(mediaId).trim()}\n`, 'utf8');
}

async function loadLastMediaId() {
  try {
    const content = await fs.readFile(LAST_MEDIA_ID_FILE, 'utf8');
    const mediaId = content.trim();
    return mediaId || null;
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
  console.log(`OnlyStep7: ${ONLY_STEP7 ? 'true' : 'false'}`);
  console.log(
    `Attach:  ownerType=${ATTACH_OWNER_TYPE}, ownerId=${ATTACH_OWNER_ID}, usageType=${ATTACH_USAGE_TYPE}, slot=${ATTACH_SLOT}`
  );
  if (!GATEWAY) {
    fail('Missing required env: STAGING_GATEWAY_URL');
  }
  if (E2E_MODE !== 'full' && E2E_MODE !== 'allow_skips') {
    fail(`Unsupported MEDIA_E2E_MODE="${E2E_MODE}". Use full or allow_skips.`);
  }
  if (!ONLY_STEP7 && (!JWT_OWNER || !DB_URL)) {
    fail('Missing required env for full run: STAGING_TEST_JWT, STAGING_DATABASE_URL');
  }
  const resolvedStep7MediaId = ONLY_STEP7
    ? STEP7_MEDIA_ID || (await loadLastMediaId())
    : '';
  if (ONLY_STEP7 && !resolvedStep7MediaId) {
    fail('No previous media_id found. Run full media_e2e first.');
  }
  const ownerSub = JWT_OWNER ? decodeJwtSub(JWT_OWNER) : null;
  if (!ONLY_STEP7 && !ownerSub) fail('STAGING_TEST_JWT: cannot decode sub');
  const altSub = JWT_ALT ? decodeJwtSub(JWT_ALT) : null;
  const canRunNonOwner = ONLY_STEP7
    ? Boolean(JWT_ALT && altSub)
    : Boolean(JWT_ALT && altSub && altSub !== ownerSub);
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
  if (!ONLY_STEP7) {
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
  }

  // 2. PUT upload
  if (!ONLY_STEP7) {
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
  }

  // 3. SELECT media_id from media_assets by key
  if (!ONLY_STEP7) {
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
      await saveLastMediaId(mediaId);
      ok(`media_id=${mediaId}`);
      return { ...ctx, mediaId };
    } finally {
      await client.end();
    }
    });
  }

  // 4. GET /v1/media/:mediaId
  if (!ONLY_STEP7) {
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
  }

  // 5. POST /v1/media/:mediaId/attach (owner)
  const attachBody = {
    ownerType: ATTACH_OWNER_TYPE,
    ownerId: ATTACH_OWNER_ID,
    usageType: ATTACH_USAGE_TYPE,
    slot: ATTACH_SLOT,
  };
  if (!ONLY_STEP7) {
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
  }

  // 6. Repeat attach (idempotent)
  if (!ONLY_STEP7) {
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
  }

  // 7. POST attach (non-owner) -> expect 403
  step('7. POST attach (non-owner) expect 403', async (ctx) => {
    if (!canRunNonOwner) {
      if (E2E_MODE === 'allow_skips') {
        skip('STAGING_TEST_JWT_ALT missing/invalid/same-user; non-owner step skipped');
        return ctx;
      }
      fail('STAGING_TEST_JWT_ALT missing/invalid/same-user in full mode');
    }
    const targetMediaId = ONLY_STEP7 ? resolvedStep7MediaId : ctx.mediaId;
    const url = `${GATEWAY}/v1/media/${targetMediaId}/attach`;
    let response;
    let text;
    try {
      const result = await fetchJson(url, {
        method: 'POST',
        headers: headers(JWT_ALT),
        body: JSON.stringify(attachBody),
      });
      response = result.response;
      text = result.text;
    } catch (error) {
      fail('Step 7 transport failure: request did not reach ACL check', {
        body: normalizeTransportError(error),
      });
    }
    if (response.status !== 403) fail(`Expected 403 for non-owner, got ${response.status}`, { text });
    ok(`status=403 (expected for non-owner)`);
    return ctx;
  });

  // 8. SELECT media_usage - exactly 1 active row for exact tuple
  if (!ONLY_STEP7) {
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
  }

  // Run steps
  let ctx = ONLY_STEP7 ? { mediaId: resolvedStep7MediaId } : {};
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
