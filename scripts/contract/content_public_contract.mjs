/**
 * M5B-min — Contract tests (public /v1/content/*) against staging gateway.
 *
 * Scope guard:
 * - Only the explicitly listed operationIds are tested.
 * - No fuzzing; max 1 case per endpoint.
 *
 * Usage:
 *   node scripts/contract/content_public_contract.mjs
 *
 * Env:
 *   STAGING_GATEWAY_URL (default: staging gateway)
 *   OPENAPI_BUNDLE_PATH (default: docs/openapi/openapi.bundle.yaml)
 */
import fs from 'node:fs/promises';
import process from 'node:process';
import YAML from 'yaml';
import { setTimeout as delay } from 'node:timers/promises';

const STAGING_GATEWAY_URL =
  process.env.STAGING_GATEWAY_URL?.trim() || 'https://go2asia-api-gateway-staging.fred89059599296.workers.dev';
const OPENAPI_BUNDLE_PATH = process.env.OPENAPI_BUNDLE_PATH?.trim() || 'docs/openapi/openapi.bundle.yaml';

// Limits (M5B-min)
const MAX_CASES_PER_ENDPOINT = 1;
const REQUEST_TIMEOUT_MS = 12000;
const MAX_ENDPOINTS = 8;
const MAX_ARRAY_ITEMS_VALIDATE = 3;
const BETWEEN_REQUESTS_MS = 50;
const RETRY_ON_TIMEOUT_ONCE = true;
const RETRY_DELAY_MS = 250;

const OPERATION_IDS = [
  'listCountries',
  'listCities',
  'listPlaces',
  'getPlaceByIdOrSlug',
  'listEvents',
  'getEventById',
  'listArticles',
  'getArticleBySlug',
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function isObject(v) {
  return Boolean(v) && typeof v === 'object' && !Array.isArray(v);
}

function resolveRef(spec, ref) {
  assert(typeof ref === 'string' && ref.startsWith('#/'), `Unsupported $ref: ${String(ref)}`);
  const parts = ref.replace(/^#\//, '').split('/');
  let cur = spec;
  for (const p of parts) {
    assert(isObject(cur) && p in cur, `Failed to resolve $ref ${ref} at ${p}`);
    cur = cur[p];
  }
  return cur;
}

function resolveSchema(spec, schema) {
  if (!schema) return null;
  if (schema.$ref) return resolveRef(spec, schema.$ref);
  return schema;
}

function typeOk(type, value) {
  if (type === 'string') return typeof value === 'string';
  if (type === 'boolean') return typeof value === 'boolean';
  if (type === 'integer') return typeof value === 'number' && Number.isInteger(value);
  if (type === 'number') return typeof value === 'number' && Number.isFinite(value);
  if (type === 'object') return isObject(value);
  if (type === 'array') return Array.isArray(value);
  return true; // unknown/unspecified => don't block
}

function validateAgainstSchema(spec, schemaRaw, value, path = '$', depth = 0) {
  if (!schemaRaw) return [];
  if (depth > 4) return []; // recursion guard

  const schema = resolveSchema(spec, schemaRaw);
  if (!schema) return [];

  const errors = [];
  const nullable = schema.nullable === true;
  if (value == null) {
    if (!nullable) errors.push(`${path}: value is null/undefined but schema is not nullable`);
    return errors;
  }

  if (schema.type && !typeOk(schema.type, value)) {
    errors.push(`${path}: expected ${schema.type}, got ${Array.isArray(value) ? 'array' : typeof value}`);
    return errors;
  }

  if (schema.type === 'object' && schema.required && Array.isArray(schema.required)) {
    for (const k of schema.required) {
      if (!(k in value)) errors.push(`${path}: missing required property '${k}'`);
    }
  }

  if (schema.type === 'object' && schema.properties && isObject(schema.properties)) {
    for (const [k, propSchema] of Object.entries(schema.properties)) {
      if (k in value) {
        errors.push(...validateAgainstSchema(spec, propSchema, value[k], `${path}.${k}`, depth + 1));
      }
    }
  }

  if (schema.type === 'array' && schema.items) {
    const arr = Array.isArray(value) ? value : [];
    const n = Math.min(arr.length, MAX_ARRAY_ITEMS_VALIDATE);
    for (let i = 0; i < n; i++) {
      errors.push(...validateAgainstSchema(spec, schema.items, arr[i], `${path}[${i}]`, depth + 1));
    }
  }

  return errors;
}

async function fetchJson(url) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
      const ct = res.headers.get('content-type') || '';
      const text = await res.text();
      let json = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch {
        json = null;
      }
      return { ok: res.ok, status: res.status, contentType: ct, json, text };
    } catch (err) {
      // Treat timeout/network errors as a contract failure for this endpoint, not a fatal run error.
      const msg = err && typeof err === 'object' && 'name' in err ? String(err.name) : String(err);
      return { ok: false, status: 0, contentType: '', json: null, text: msg };
    }
  } finally {
    clearTimeout(t);
  }
}

function findOperation(spec, operationId) {
  for (const [p, methods] of Object.entries(spec.paths || {})) {
    if (!isObject(methods)) continue;
    for (const [m, op] of Object.entries(methods)) {
      if (!isObject(op)) continue;
      if (op.operationId === operationId) return { path: p, method: m.toUpperCase(), op };
    }
  }
  return null;
}

function buildUrl(base, pathTemplate, params = {}, query = {}) {
  let path = pathTemplate;
  for (const [k, v] of Object.entries(params)) {
    path = path.replaceAll(`{${k}}`, encodeURIComponent(String(v)));
  }
  const u = new URL(base.replace(/\/+$/, '') + path);
  for (const [k, v] of Object.entries(query)) {
    if (v == null) continue;
    u.searchParams.set(k, String(v));
  }
  return u.toString();
}

async function discoverIds(baseUrl) {
  const out = {
    eventId: null,
    articleSlug: null,
    placeIdOrSlug: null,
  };

  const events = await fetchJson(buildUrl(baseUrl, '/v1/content/events', {}, { limit: 1 }));
  if (events.ok && events.json && Array.isArray(events.json.items) && events.json.items[0]?.id) out.eventId = events.json.items[0].id;

  const articles = await fetchJson(buildUrl(baseUrl, '/v1/content/articles', {}, { limit: 1 }));
  if (articles.ok && articles.json && Array.isArray(articles.json.items) && articles.json.items[0]?.slug)
    out.articleSlug = articles.json.items[0].slug;

  const places = await fetchJson(buildUrl(baseUrl, '/v1/content/places', {}, { limit: 1 }));
  if (places.ok && places.json && Array.isArray(places.json.items) && places.json.items[0]?.slug) out.placeIdOrSlug = places.json.items[0].slug;

  return out;
}

async function main() {
  const raw = await fs.readFile(OPENAPI_BUNDLE_PATH, 'utf8');
  const spec = YAML.parse(raw);

  assert(isObject(spec), 'OpenAPI bundle must parse to an object');
  assert(isObject(spec.paths), 'OpenAPI bundle must contain paths');

  const selected = OPERATION_IDS.slice(0, MAX_ENDPOINTS).map((id) => {
    const found = findOperation(spec, id);
    assert(found, `Missing operationId in bundle: ${id}`);
    assert(found.method === 'GET', `Scope guard: operationId ${id} must be GET (found ${found.method})`);
    assert(found.path.startsWith('/v1/content/'), `Scope guard: ${id} path must be /v1/content/* (found ${found.path})`);
    assert(!found.path.includes('/_debug/'), `Scope guard: debug endpoints are not part of contract tests (${id})`);
    return found;
  });

  console.log(`[contract] base=${STAGING_GATEWAY_URL}`);
  console.log(`[contract] bundle=${OPENAPI_BUNDLE_PATH}`);
  console.log(`[contract] endpoints=${selected.length}, maxCasesPerEndpoint=${MAX_CASES_PER_ENDPOINT}, timeoutMs=${REQUEST_TIMEOUT_MS}`);

  const ids = await discoverIds(STAGING_GATEWAY_URL);
  assert(ids.eventId, 'Discovery failed: cannot determine eventId from /v1/content/events?limit=1');
  assert(ids.articleSlug, 'Discovery failed: cannot determine articleSlug from /v1/content/articles?limit=1');
  assert(ids.placeIdOrSlug, 'Discovery failed: cannot determine placeIdOrSlug from /v1/content/places?limit=1');

  const failures = [];

  for (const entry of selected) {
    const { path, op, method } = entry;
    const operationId = op?.operationId ?? '(missing operationId)';
    void method;

    const params = {};
    if (path.includes('{id}')) params.id = ids.eventId;
    if (path.includes('{slug}')) params.slug = ids.articleSlug;
    if (path.includes('{idOrSlug}')) params.idOrSlug = ids.placeIdOrSlug;

    const hasLimit = Array.isArray(op.parameters) && op.parameters.some((p) => (p && p.$ref ? String(p.$ref).endsWith('/Limit') : p?.name === 'limit'));
    const url = buildUrl(STAGING_GATEWAY_URL, path, params, hasLimit ? { limit: 1 } : {});

    await delay(BETWEEN_REQUESTS_MS);
    let res = await fetchJson(url);
    if (RETRY_ON_TIMEOUT_ONCE && res.status === 0) {
      await delay(RETRY_DELAY_MS);
      res = await fetchJson(url);
    }

    const ok = res.ok && res.status === 200 && typeof res.json !== 'undefined' && res.json !== null;
    if (!ok) {
      failures.push({
        operationId,
        url,
        status: res.status,
        contentType: res.contentType,
        bodyPreview: String(res.text || '').slice(0, 300),
      });
      continue;
    }

    // Validate response schema (200 application/json) minimally
    const resp200 = op.responses?.['200'];
    const schema =
      resp200?.content?.['application/json']?.schema ||
      resp200?.content?.['application/*+json']?.schema ||
      null;

    const errors = validateAgainstSchema(spec, schema, res.json);
    if (errors.length > 0) {
      failures.push({
        operationId,
        url,
        status: res.status,
        schemaErrors: errors.slice(0, 20),
      });
    } else {
      console.log(`[ok] ${operationId} ${path}`);
    }
  }

  if (failures.length > 0) {
    console.error(`\n[contract] FAILURES: ${failures.length}`);
    for (const f of failures) console.error(JSON.stringify(f, null, 2));
    process.exitCode = 1;
    return;
  }

  console.log(`\n[contract] OK (${selected.length}/${selected.length})`);
}

main().catch((err) => {
  console.error('[contract] fatal:', err?.stack || String(err));
  process.exitCode = 1;
});



