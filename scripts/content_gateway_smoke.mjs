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

async function expectJson200(url, shapeCheck) {
  const { response, contentType, json, text } = await fetchJson(url, {
    headers: { Accept: 'application/json' },
  });
  assert(response.status === 200, `Expected 200 for ${url}, got ${response.status}: ${text.slice(0, 300)}`);
  assert(contentType.includes('application/json'), `Expected JSON content-type for ${url}, got ${contentType}`);
  assert(json && typeof json === 'object', `Expected JSON object body for ${url}`);
  if (shapeCheck) shapeCheck(json);
  summary.checks.push({ name: `GET ${url}`, status: response.status, contentType, ok: true });
  console.log(`[smoke:ok] GET ${url}`);
  return json;
}

function requireItemsArray(json, label) {
  assert(Array.isArray(json.items), `${label}: expected items[] array`);
}

function requireObjectField(json, field, label) {
  assert(typeof json[field] === 'string' && json[field].length > 0, `${label}: expected non-empty string field '${field}'`);
}

async function maybeCheckAuthFlow() {
  if (!STAGING_TEST_JWT) {
    summary.checks.push({ name: 'POST /v1/users/ensure', ok: true, skipped: true });
    console.log('[smoke:skip] STAGING_TEST_JWT is not configured -> skipping auth smoke');
    return;
  }

  const url = `${GATEWAY_URL}/v1/users/ensure`;
  const { response, contentType, json, text } = await fetchJson(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${STAGING_TEST_JWT}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: 'ci-smoke@example.com' }),
  });

  assert(response.status === 200, `Expected 200 for ${url}, got ${response.status}: ${text.slice(0, 300)}`);
  assert(contentType.includes('application/json'), `Expected JSON content-type for ${url}, got ${contentType}`);
  assert(json && json.ok === true, `${url}: expected { ok: true } body`);
  summary.checks.push({ name: `POST ${url}`, status: response.status, contentType, ok: true });
  console.log(`[smoke:ok] POST ${url}`);
}

async function main() {
  const ready = await expectJson200(`${GATEWAY_URL}/ready`, (json) => {
    assert(json.status === 'ready', '/ready: expected status=ready');
  });
  void ready;

  const events = await expectJson200(`${GATEWAY_URL}/v1/content/events?limit=1`, (json) => requireItemsArray(json, 'events'));
  const articles = await expectJson200(`${GATEWAY_URL}/v1/content/articles?limit=1`, (json) => requireItemsArray(json, 'articles'));
  await expectJson200(`${GATEWAY_URL}/v1/content/guides?limit=1`, (json) => requireItemsArray(json, 'guides'));

  const eventId = events.items?.[0]?.id ?? null;
  if (eventId) {
    await expectJson200(`${GATEWAY_URL}/v1/content/events/${encodeURIComponent(eventId)}`, (json) =>
      requireObjectField(json, 'id', 'event detail')
    );
  } else {
    summary.checks.push({ name: 'GET /v1/content/events/{id}', ok: true, skipped: true, reason: 'no_event_id' });
    console.log('[smoke:skip] event detail skipped: no event id discovered');
  }

  const articleSlug = articles.items?.[0]?.slug ?? null;
  if (articleSlug) {
    await expectJson200(`${GATEWAY_URL}/v1/content/articles/${encodeURIComponent(articleSlug)}`, (json) =>
      requireObjectField(json, 'slug', 'article detail')
    );
  } else {
    summary.checks.push({ name: 'GET /v1/content/articles/{slug}', ok: true, skipped: true, reason: 'no_article_slug' });
    console.log('[smoke:skip] article detail skipped: no article slug discovered');
  }

  await maybeCheckAuthFlow();
}

main().catch((error) => {
  summary.status = 'failed';
  summary.error = error?.stack || String(error);
  console.error('[smoke] fatal:', error?.stack || String(error));
  process.exitCode = 1;
}).finally(async () => {
  if (!TEST_ARTIFACT_PATH) return;
  const normalized = TEST_ARTIFACT_PATH.replace(/\\/g, '/');
  const dir = normalized.includes('/') ? normalized.slice(0, normalized.lastIndexOf('/')) : '';
  if (dir) {
    await fs.mkdir(dir, { recursive: true });
  }
  await fs.writeFile(normalized, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
});
