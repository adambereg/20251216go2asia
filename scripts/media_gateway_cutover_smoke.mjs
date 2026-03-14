import process from 'node:process';
import fs from 'node:fs/promises';

const GATEWAY_URL =
  process.env.STAGING_GATEWAY_URL?.trim() || 'https://go2asia-api-gateway-staging.fred89059599296.workers.dev';
const STAGING_TEST_JWT = process.env.STAGING_TEST_JWT?.trim() || '';
const TEST_ARTIFACT_PATH = process.env.TEST_ARTIFACT_PATH?.trim() || '';
const RELEASE_SHA = process.env.RELEASE_SHA?.trim() || '';

const summary = {
  gatewayUrl: GATEWAY_URL,
  releaseSha: RELEASE_SHA || undefined,
  checks: [],
  status: 'ok',
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function fetchJson(url, init) {
  const response = await fetch(url, init);
  const contentType = response.headers.get('content-type') || '';
  const text = await response.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }
  return { response, contentType, text, json };
}

async function main() {
  if (!STAGING_TEST_JWT) {
    summary.checks.push({
      name: 'POST /v1/media/upload-token',
      ok: true,
      skipped: true,
      reason: 'missing_STAGING_TEST_JWT',
    });
    console.log('[media-cutover:skip] STAGING_TEST_JWT is not configured -> skipping media cutover smoke');
    return;
  }

  const url = `${GATEWAY_URL}/v1/media/upload-token`;
  const { response, contentType, text, json } = await fetchJson(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${STAGING_TEST_JWT}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      scope: 'content',
      filename: 'cutover-smoke.jpg',
      contentType: 'image/jpeg',
      sizeBytes: 1024,
    }),
  });

  assert(response.status === 200, `Expected 200 for ${url}, got ${response.status}: ${text.slice(0, 300)}`);
  assert(contentType.includes('application/json'), `Expected JSON content-type for ${url}, got ${contentType}`);
  assert(json && typeof json === 'object', `${url}: expected JSON object body`);
  assert(typeof json.uploadUrl === 'string' && json.uploadUrl.startsWith('/v1/media/upload/'), 'uploadUrl must be canonical /v1/media/upload/{token}');

  const downstreamPath = response.headers.get('X-Proxy-Target-Path') || '';
  assert(
    downstreamPath === '/v1/media/upload-token',
    `Expected gateway cutover path '/v1/media/upload-token', got '${downstreamPath || '<empty>'}'`
  );

  summary.checks.push({
    name: `POST ${url}`,
    status: response.status,
    downstreamPath,
    ok: true,
  });

  console.log(`[media-cutover:ok] POST ${url}`);
}

main()
  .catch((error) => {
    summary.status = 'failed';
    summary.error = error?.stack || String(error);
    console.error('[media-cutover] fatal:', error?.stack || String(error));
    process.exitCode = 1;
  })
  .finally(async () => {
    if (!TEST_ARTIFACT_PATH) return;
    const normalized = TEST_ARTIFACT_PATH.replace(/\\/g, '/');
    const dir = normalized.includes('/') ? normalized.slice(0, normalized.lastIndexOf('/')) : '';
    if (dir) {
      await fs.mkdir(dir, { recursive: true });
    }
    await fs.writeFile(normalized, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
  });
