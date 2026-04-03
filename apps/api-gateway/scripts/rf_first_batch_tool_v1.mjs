#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { createClerkClient } from '@clerk/backend';
import pg from 'pg';
import { mintClerkJwtForUser } from '../../../scripts/lib/clerk_test_tokens.mjs';

const { Client } = pg;

const STEP_VALUES = new Set(['partners', 'offers', 'pro-links', 'verify', 'voucher-cases']);
const VISIBILITY_VALUES = new Set(['public', 'pro_only', 'invite_only']);
const ROLE_SCOPE_VALUES = new Set(['onboarding', 'curation', 'promotion', 'moderation_support', 'account_support']);
const CANONICAL_ROLES = new Set(['spacer', 'vip_spacer', 'pro', 'admin']);
const OFFER_TYPE_MAP = {
  discount_percent: 'discount',
  discount_fixed: 'discount',
  bonus_item: 'gift',
  bonus_access: 'access',
  discount: 'discount',
  bundle: 'bundle',
  gift: 'gift',
  access: 'access',
  campaign: 'campaign',
  event_related: 'event_related',
};

function printUsage() {
  console.log(`
Usage:
  node apps/api-gateway/scripts/rf_first_batch_tool_v1.mjs --step <partners|offers|pro-links|verify|voucher-cases> [options]

Options:
  --step <value>                Step to execute (required)
  --api-base <url>              Gateway base URL (default: env API_BASE)
  --identity-csv <path>         Identity CSV (default: ../../docs/templates/identity_seed_users_template_v1.csv)
  --partners-csv <path>         Partners CSV (default: ../../docs/templates/rf_partners_template_v1.csv)
  --offers-csv <path>           Offers CSV (default: ../../docs/templates/rf_offers_template_v1.csv)
  --pro-links-csv <path>        PRO links CSV (default: ../../docs/templates/rf_pro_links_template_v1.csv)
  --voucher-cases-csv <path>    Voucher cases CSV (default: ../../docs/templates/rf_voucher_seed_cases_template_v1.csv)
  --state-file <path>           State file path (default: ../../.tmp/rf_first_batch_state_v1.json)
  --limit <n>                   Process first N rows after filters
  --partner-seed-key <value>    Filter partner rows (repeatable)
  --offer-seed-key <value>      Filter offer rows (repeatable)
  --pro-link-seed-key <value>   Filter PRO link rows (repeatable)
  --case-key <value>            Filter voucher case rows (repeatable)
  --dry-run                     Preview only (no write calls)
  --debug                       Extended diagnostics
  --help, -h                    Show help

Environment:
  CLERK_SECRET_KEY              Required for Clerk user lookup/token mint
  CLERK_INSTANCE_URL            Required for runtime write steps (partners/offers/pro-links/voucher-cases)
  API_BASE                      Required for runtime steps unless --api-base is passed
  STAGING_DATABASE_URL          Preferred for verification step
  DATABASE_URL                  Fallback DB URL for verification
`);
}

function parseArgs(argv) {
  const args = {
    step: '',
    apiBase: (process.env.API_BASE || '').trim(),
    identityCsv: '../../docs/templates/identity_seed_users_template_v1.csv',
    partnersCsv: '../../docs/templates/rf_partners_template_v1.csv',
    offersCsv: '../../docs/templates/rf_offers_template_v1.csv',
    proLinksCsv: '../../docs/templates/rf_pro_links_template_v1.csv',
    voucherCasesCsv: '../../docs/templates/rf_voucher_seed_cases_template_v1.csv',
    stateFile: '../../.tmp/rf_first_batch_state_v1.json',
    limit: null,
    partnerSeedKeys: [],
    offerSeedKeys: [],
    proLinkSeedKeys: [],
    caseKeys: [],
    dryRun: false,
    debug: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--step') {
      args.step = (argv[i + 1] || '').trim();
      i += 1;
      continue;
    }
    if (token === '--api-base') {
      args.apiBase = (argv[i + 1] || '').trim();
      i += 1;
      continue;
    }
    if (token === '--identity-csv') {
      args.identityCsv = argv[i + 1] || '';
      i += 1;
      continue;
    }
    if (token === '--partners-csv') {
      args.partnersCsv = argv[i + 1] || '';
      i += 1;
      continue;
    }
    if (token === '--offers-csv') {
      args.offersCsv = argv[i + 1] || '';
      i += 1;
      continue;
    }
    if (token === '--pro-links-csv') {
      args.proLinksCsv = argv[i + 1] || '';
      i += 1;
      continue;
    }
    if (token === '--voucher-cases-csv') {
      args.voucherCasesCsv = argv[i + 1] || '';
      i += 1;
      continue;
    }
    if (token === '--state-file') {
      args.stateFile = argv[i + 1] || '';
      i += 1;
      continue;
    }
    if (token === '--limit') {
      args.limit = Number.parseInt(argv[i + 1] || '', 10);
      i += 1;
      continue;
    }
    if (token === '--partner-seed-key') {
      args.partnerSeedKeys.push((argv[i + 1] || '').trim());
      i += 1;
      continue;
    }
    if (token === '--offer-seed-key') {
      args.offerSeedKeys.push((argv[i + 1] || '').trim());
      i += 1;
      continue;
    }
    if (token === '--pro-link-seed-key') {
      args.proLinkSeedKeys.push((argv[i + 1] || '').trim());
      i += 1;
      continue;
    }
    if (token === '--case-key') {
      args.caseKeys.push((argv[i + 1] || '').trim());
      i += 1;
      continue;
    }
    if (token === '--dry-run') {
      args.dryRun = true;
      continue;
    }
    if (token === '--debug') {
      args.debug = true;
      continue;
    }
    if (token === '--help' || token === '-h') {
      printUsage();
      process.exit(0);
    }
    throw new Error(`Unknown argument: ${token}`);
  }

  if (!STEP_VALUES.has(args.step)) {
    throw new Error(`--step must be one of: ${Array.from(STEP_VALUES).join(', ')}`);
  }
  if (args.limit != null && (!Number.isFinite(args.limit) || args.limit <= 0)) {
    throw new Error('--limit must be a positive integer');
  }
  return args;
}

function normalizeApiBase(value) {
  const raw = (value || '').trim();
  if (!raw) return '';
  return raw.endsWith('/') ? raw.slice(0, -1) : raw;
}

function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
      continue;
    }
    current += ch;
  }
  result.push(current);
  return result.map((entry) => entry.trim());
}

function parseCsvRecordWithFallback(line, expectedColumns) {
  const first = parseCsvLine(line);
  if (first.length === expectedColumns) return first;
  if (first.length === 1 && expectedColumns > 1) {
    const single = first[0];
    const unwrapped =
      single.startsWith('"') && single.endsWith('"') && single.length >= 2 ? single.slice(1, -1) : single;
    const fallback = unwrapped.split(',').map((entry) => entry.trim());
    if (fallback.length === expectedColumns) return fallback;
  }
  throw new Error(`CSV row has unexpected column count (expected ${expectedColumns}, got ${first.length})`);
}

function toRecord(headers, cells) {
  const out = {};
  for (let i = 0; i < headers.length; i += 1) out[headers[i]] = cells[i] ?? '';
  return out;
}

async function readCsv(pathValue, requiredColumns) {
  let raw = '';
  try {
    raw = await fs.readFile(pathValue, 'utf8');
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      throw new Error(`CSV file not found: ${pathValue}`, { cause: error });
    }
    throw new Error(`CSV read failed: ${pathValue}: ${error?.message || 'unknown error'}`, { cause: error });
  }

  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length < 2) throw new Error(`CSV has no data rows: ${pathValue}`);
  const headers = parseCsvLine(lines[0]);
  const missing = requiredColumns.filter((col) => !headers.includes(col));
  if (missing.length > 0) {
    throw new Error(`CSV missing required columns [${missing.join(', ')}] in ${pathValue}`);
  }

  return lines.slice(1).map((line, index) => {
    try {
      const cells = parseCsvRecordWithFallback(line, headers.length);
      const row = toRecord(headers, cells);
      row.__line = String(index + 2);
      return row;
    } catch (error) {
      throw new Error(
        `CSV parse failed in ${pathValue} at line ${index + 2}: ${error?.message || 'unknown parse error'}`,
        { cause: error },
      );
    }
  });
}

async function loadState(stateFilePath) {
  try {
    const raw = await fs.readFile(stateFilePath, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      partners: parsed.partners || {},
      offers: parsed.offers || {},
      proLinks: parsed.proLinks || {},
      vouchers: parsed.vouchers || {},
      meta: parsed.meta || {},
    };
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return {
        partners: {},
        offers: {},
        proLinks: {},
        vouchers: {},
        meta: {},
      };
    }
    throw new Error(`State file read/parse failed: ${stateFilePath}: ${error?.message || 'unknown error'}`, {
      cause: error,
    });
  }
}

async function saveState(stateFilePath, state) {
  try {
    await fs.mkdir(path.dirname(stateFilePath), { recursive: true });
    const payload = {
      ...state,
      meta: {
        ...state.meta,
        updatedAt: new Date().toISOString(),
        version: 'rf_first_batch_v1',
      },
    };
    await fs.writeFile(stateFilePath, JSON.stringify(payload, null, 2), 'utf8');
  } catch (error) {
    throw new Error(`State file write failed: ${stateFilePath}: ${error?.message || 'unknown error'}`, {
      cause: error,
    });
  }
}

function yesNoToBool(value) {
  const normalized = String(value || '').trim().toLowerCase();
  return normalized === 'yes' || normalized === 'true' || normalized === '1';
}

function safeJson(value) {
  const seen = new WeakSet();
  return JSON.stringify(
    value,
    (_, item) => {
      if (typeof item === 'bigint') return String(item);
      if (item && typeof item === 'object') {
        if (seen.has(item)) return '[Circular]';
        seen.add(item);
      }
      return item;
    },
    2,
  );
}

function debugPhase(enabled, phase, details = {}) {
  if (!enabled) return;
  console.error(
    safeJson({
      kind: 'rf_first_batch_phase',
      phase,
      ...details,
    }),
  );
}

function safeErrorDetails(error) {
  const err = error || {};
  return {
    name: err?.name || 'Error',
    message: err?.message || '',
    status: err?.status ?? err?.statusCode ?? err?.response?.status ?? null,
    code: err?.code ?? null,
    clerkTraceId: err?.clerkTraceId ?? err?.clerk_trace_id ?? err?.data?.clerkTraceId ?? err?.data?.clerk_trace_id ?? null,
    errors: Array.isArray(err?.errors)
      ? err.errors.map((entry) => ({
          code: entry?.code ?? null,
          message: entry?.message ?? null,
          longMessage: entry?.longMessage ?? entry?.long_message ?? null,
          meta: entry?.meta ?? null,
        }))
      : null,
  };
}

async function callGateway({ apiBase, endpoint, method, jwt, body, extraHeaders }) {
  const response = await fetch(`${apiBase}${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${jwt}`,
      'Content-Type': 'application/json',
      ...(extraHeaders || {}),
    },
    body: body != null ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  return {
    status: response.status,
    ok: response.ok,
    json,
    text,
  };
}

function summarizeResponse(res) {
  if (res.json && typeof res.json === 'object') {
    return {
      code: res.json?.error?.code ?? null,
      message: res.json?.error?.message ?? null,
      requestId: res.json?.requestId ?? null,
    };
  }
  return {
    code: null,
    message: res.text ? res.text.slice(0, 220) : null,
    requestId: null,
  };
}

function requireDbUrl() {
  const dbUrl = (process.env.STAGING_DATABASE_URL || process.env.DATABASE_URL || '').trim();
  if (!dbUrl) throw new Error('Missing STAGING_DATABASE_URL or DATABASE_URL');
  return dbUrl;
}

function entityWriteStep(step) {
  return step === 'partners' || step === 'offers' || step === 'pro-links' || step === 'voucher-cases';
}

async function buildIdentityContext(identityRows, clerk, debug, requiredSeedKeys = null) {
  const required = requiredSeedKeys instanceof Set ? requiredSeedKeys : null;
  const bySeed = new Map();
  for (const row of identityRows) {
    const seedKey = String(row.seed_key || '').trim();
    const email = String(row.email || '').trim().toLowerCase();
    const platformRole = String(row.platform_role || '').trim();
    if (!seedKey || !email || !platformRole) continue;
    if (required && !required.has(seedKey)) continue;
    if (!CANONICAL_ROLES.has(platformRole)) {
      throw new Error(`identity CSV has non-canonical platform_role for ${seedKey}: ${platformRole}`);
    }
    bySeed.set(seedKey, {
      seedKey,
      email,
      platformRole,
      userId: null,
      jwt: null,
    });
  }

  if (required) {
    const missing = Array.from(required).filter((seedKey) => !bySeed.has(seedKey));
    if (missing.length > 0) {
      throw new Error(`Required identity seed_key is missing in identity CSV: ${missing.join(', ')}`);
    }
  }

  for (const identity of bySeed.values()) {
    let users;
    try {
      users = await clerk.users.getUserList({
        emailAddress: [identity.email],
        limit: 2,
      });
    } catch (error) {
      debugPhase(debug, 'lookup_clerk_user_failed', {
        seedKey: identity.seedKey,
        email: identity.email,
        stage: 'lookup_clerk_user',
        error: safeErrorDetails(error),
      });
      throw new Error(
        `Clerk lookup failed for seed_key=${identity.seedKey}, email=${identity.email}: ${error?.message || 'unknown error'}`,
        { cause: error },
      );
    }
    const list = users?.data || [];
    if (list.length !== 1) {
      debugPhase(debug, 'lookup_clerk_user_ambiguous', {
        seedKey: identity.seedKey,
        email: identity.email,
        stage: 'lookup_clerk_user',
        matchCount: list.length,
      });
      throw new Error(
        list.length === 0
          ? `Identity seed user not found in Clerk: ${identity.seedKey} (${identity.email})`
          : `Multiple Clerk users found by email: ${identity.email}`,
      );
    }
    identity.userId = list[0].id;
  }

  return {
    bySeed,
    async getJwtForSeed(seedKey) {
      const item = bySeed.get(seedKey);
      if (!item) throw new Error(`Unknown seed user: ${seedKey}`);
      if (!item.userId) throw new Error(`Missing userId for seed user: ${seedKey}`);
      if (item.jwt) return item.jwt;
      item.jwt = await mintClerkJwtForUser(item.userId);
      return item.jwt;
    },
  };
}

function addIdentitySeed(seedSet, reasonMap, seedKey, reason) {
  const normalized = String(seedKey || '').trim();
  if (!normalized) return;
  seedSet.add(normalized);
  if (!reasonMap[normalized]) reasonMap[normalized] = [];
  reasonMap[normalized].push(reason);
}

function resolveRequiredIdentitySeedKeys({
  step,
  selectedPartnersRows,
  selectedOffersRows,
  selectedProLinksRows,
  selectedVoucherCasesRows,
  allPartnersRows,
  allOffersRows,
}) {
  const required = new Set();
  const reasons = {};

  const partnerBySeed = new Map(
    allPartnersRows.map((row) => [String(row.partner_seed_key || '').trim(), row]),
  );
  const offerBySeed = new Map(
    allOffersRows.map((row) => [String(row.offer_seed_key || '').trim(), row]),
  );

  if (step === 'partners') {
    for (const row of selectedPartnersRows) {
      addIdentitySeed(required, reasons, row.owner_seed_key, 'partners.owner_seed_key');
    }
  } else if (step === 'offers') {
    for (const row of selectedOffersRows) {
      addIdentitySeed(required, reasons, row.created_by_seed_key, 'offers.created_by_seed_key');
    }
  } else if (step === 'pro-links') {
    for (const row of selectedProLinksRows) {
      addIdentitySeed(required, reasons, row.pro_user_seed_key, 'pro_links.pro_user_seed_key');
      if (yesNoToBool(row.accept_by_owner)) {
        const partnerSeedKey = String(row.partner_seed_key || '').trim();
        const partnerRow = partnerBySeed.get(partnerSeedKey);
        if (partnerRow) {
          addIdentitySeed(required, reasons, partnerRow.owner_seed_key, 'pro_links.accept_by_owner.partner_owner_seed_key');
        }
      }
    }
  } else if (step === 'voucher-cases') {
    for (const row of selectedVoucherCasesRows) {
      addIdentitySeed(required, reasons, row.claim_user_seed_key, 'voucher_cases.claim_user_seed_key');
      if (yesNoToBool(row.redeem_by_owner)) {
        const offerSeedKey = String(row.offer_seed_key || '').trim();
        const offerRow = offerBySeed.get(offerSeedKey);
        const partnerSeedKey = String(offerRow?.partner_seed_key || '').trim();
        const partnerRow = partnerBySeed.get(partnerSeedKey);
        if (partnerRow) {
          addIdentitySeed(required, reasons, partnerRow.owner_seed_key, 'voucher_cases.redeem_by_owner.partner_owner_seed_key');
        }
      }
    }
  } else if (step === 'verify') {
    for (const row of selectedPartnersRows) {
      addIdentitySeed(required, reasons, row.owner_seed_key, 'verify.partners.owner_seed_key');
    }
    for (const row of selectedOffersRows) {
      addIdentitySeed(required, reasons, row.created_by_seed_key, 'verify.offers.created_by_seed_key');
    }
    for (const row of selectedProLinksRows) {
      addIdentitySeed(required, reasons, row.pro_user_seed_key, 'verify.pro_links.pro_user_seed_key');
    }
  }

  return { requiredSeedKeys: required, reasons };
}

function applyFilterAndLimit(rows, filterSet, field, limit) {
  let output = rows;
  if (filterSet.size > 0) {
    output = output.filter((row) => filterSet.has(String(row[field] || '').trim()));
  }
  if (limit) output = output.slice(0, limit);
  return output;
}

function normalizeOfferType(templateValue) {
  const normalized = String(templateValue || '').trim().toLowerCase();
  const mapped = OFFER_TYPE_MAP[normalized];
  return mapped || null;
}

async function runPartnersStep({ rows, identityContext, state, args, apiBase }) {
  const results = [];
  for (const row of rows) {
    const partnerSeedKey = String(row.partner_seed_key || '').trim();
    const ownerSeedKey = String(row.owner_seed_key || '').trim();
    const displayName = String(row.display_name || '').trim();
    const owner = identityContext.bySeed.get(ownerSeedKey);
    if (!partnerSeedKey || !ownerSeedKey || !displayName) {
      results.push({
        partner_seed_key: partnerSeedKey || '<empty>',
        owner_seed_key: ownerSeedKey || '<empty>',
        display_name: displayName || '<empty>',
        status: 'failed',
        http_status: null,
        summary: 'missing required fields in CSV row',
      });
      continue;
    }
    if (!owner) {
      results.push({
        partner_seed_key: partnerSeedKey,
        owner_seed_key: ownerSeedKey,
        display_name: displayName,
        status: 'failed',
        http_status: null,
        summary: `owner_seed_key not found in identity CSV: ${ownerSeedKey}`,
      });
      continue;
    }

    if (args.dryRun) {
      results.push({
        partner_seed_key: partnerSeedKey,
        owner_seed_key: ownerSeedKey,
        display_name: displayName,
        status: state.partners[partnerSeedKey]?.partnerId ? 'updated' : 'created',
        http_status: 0,
        summary: 'dry-run',
      });
      continue;
    }

    if (state.partners[partnerSeedKey]?.partnerId) {
      results.push({
        partner_seed_key: partnerSeedKey,
        owner_seed_key: ownerSeedKey,
        display_name: displayName,
        status: 'updated',
        http_status: 200,
        summary: 'partner already tracked in state',
      });
      continue;
    }

    try {
      const jwt = await identityContext.getJwtForSeed(ownerSeedKey);
      const payload = {
        displayName,
        countryId: String(row.country_id || '').trim(),
        cityId: String(row.city_id || '').trim(),
        atlasPlaceId: String(row.atlas_place_id || '').trim() || undefined,
        hostAtlasPlaceId: String(row.host_atlas_place_id || '').trim() || undefined,
      };

      if (args.debug) {
        console.error(
          safeJson({
            kind: 'rf_partners_payload',
            partner_seed_key: partnerSeedKey,
            owner_seed_key: ownerSeedKey,
            payload,
          }),
        );
      }

      const res = await callGateway({
        apiBase,
        endpoint: '/v1/rf/business/partners',
        method: 'POST',
        jwt,
        body: payload,
      });
      const summary = summarizeResponse(res);
      if (!res.ok || !res.json?.id) {
        results.push({
          partner_seed_key: partnerSeedKey,
          owner_seed_key: ownerSeedKey,
          display_name: displayName,
          status: 'failed',
          http_status: res.status,
          summary: summary.message || summary.code || 'create partner failed',
        });
        continue;
      }

      state.partners[partnerSeedKey] = {
        partnerId: res.json.id,
        ownerSeedKey,
        ownerUserId: owner.userId,
        displayName,
      };
      results.push({
        partner_seed_key: partnerSeedKey,
        owner_seed_key: ownerSeedKey,
        display_name: displayName,
        status: 'created',
        http_status: res.status,
        summary: `partnerId=${res.json.id}`,
      });
    } catch (error) {
      results.push({
        partner_seed_key: partnerSeedKey,
        owner_seed_key: ownerSeedKey,
        display_name: displayName,
        status: 'failed',
        http_status: null,
        summary: error.message,
      });
    }
  }
  return results;
}

async function runOffersStep({ rows, identityContext, state, args, apiBase }) {
  const results = [];
  for (const row of rows) {
    const offerSeedKey = String(row.offer_seed_key || '').trim();
    const partnerSeedKey = String(row.partner_seed_key || '').trim();
    const creatorSeedKey = String(row.created_by_seed_key || '').trim();
    const title = String(row.title || '').trim();
    const visibility = String(row.visibility || '').trim();
    const activateAfterCreate = yesNoToBool(row.activate_after_create);
    const mappedOfferType = normalizeOfferType(row.offer_type);

    if (!offerSeedKey || !partnerSeedKey || !creatorSeedKey || !title) {
      results.push({
        offer_seed_key: offerSeedKey || '<empty>',
        partner_seed_key: partnerSeedKey || '<empty>',
        created_by_seed_key: creatorSeedKey || '<empty>',
        title: title || '<empty>',
        visibility,
        create_status: 'failed',
        activate_status: activateAfterCreate ? 'failed' : 'skipped',
        summary: 'missing required fields in CSV row',
      });
      continue;
    }
    if (!mappedOfferType) {
      results.push({
        offer_seed_key: offerSeedKey,
        partner_seed_key: partnerSeedKey,
        created_by_seed_key: creatorSeedKey,
        title,
        visibility,
        create_status: 'failed',
        activate_status: activateAfterCreate ? 'failed' : 'skipped',
        summary: `unsupported offer_type: ${row.offer_type}`,
      });
      continue;
    }
    if (!VISIBILITY_VALUES.has(visibility)) {
      results.push({
        offer_seed_key: offerSeedKey,
        partner_seed_key: partnerSeedKey,
        created_by_seed_key: creatorSeedKey,
        title,
        visibility,
        create_status: 'failed',
        activate_status: activateAfterCreate ? 'failed' : 'skipped',
        summary: `unsupported visibility: ${visibility}`,
      });
      continue;
    }
    const partnerState = state.partners[partnerSeedKey];
    if (!partnerState?.partnerId) {
      results.push({
        offer_seed_key: offerSeedKey,
        partner_seed_key: partnerSeedKey,
        created_by_seed_key: creatorSeedKey,
        title,
        visibility,
        create_status: 'failed',
        activate_status: activateAfterCreate ? 'failed' : 'skipped',
        summary: `partner_seed_key is not resolved (run partners step first): ${partnerSeedKey}`,
      });
      continue;
    }

    const offerState = state.offers[offerSeedKey] || {};

    if (args.dryRun) {
      results.push({
        offer_seed_key: offerSeedKey,
        partner_seed_key: partnerSeedKey,
        created_by_seed_key: creatorSeedKey,
        title,
        visibility,
        create_status: offerState.offerId ? 'updated' : 'created',
        activate_status: activateAfterCreate ? 'activated' : 'skipped',
        summary: `dry-run offerType=${mappedOfferType}`,
      });
      continue;
    }

    let offerId = offerState.offerId || null;
    let createStatus = 'updated';
    let createHttpStatus = 200;
    let createSummary = 'offer already tracked in state';

    if (!offerId) {
      try {
        const jwt = await identityContext.getJwtForSeed(creatorSeedKey);
        const payload = {
          title,
          offerType: mappedOfferType,
          visibility,
        };
        if (args.debug) {
          console.error(
            safeJson({
              kind: 'rf_offers_payload',
              offer_seed_key: offerSeedKey,
              partner_seed_key: partnerSeedKey,
              created_by_seed_key: creatorSeedKey,
              payload,
            }),
          );
        }
        const createRes = await callGateway({
          apiBase,
          endpoint: `/v1/rf/business/partners/${encodeURIComponent(partnerState.partnerId)}/offers`,
          method: 'POST',
          jwt,
          body: payload,
        });
        const createResSummary = summarizeResponse(createRes);
        if (!createRes.ok || !createRes.json?.id) {
          results.push({
            offer_seed_key: offerSeedKey,
            partner_seed_key: partnerSeedKey,
            created_by_seed_key: creatorSeedKey,
            title,
            visibility,
            create_status: 'failed',
            activate_status: activateAfterCreate ? 'failed' : 'skipped',
            http_status: createRes.status,
            summary: createResSummary.message || createResSummary.code || 'create offer failed',
          });
          continue;
        }
        offerId = createRes.json.id;
        createStatus = 'created';
        createHttpStatus = createRes.status;
        createSummary = `offerId=${offerId}`;
      } catch (error) {
        results.push({
          offer_seed_key: offerSeedKey,
          partner_seed_key: partnerSeedKey,
          created_by_seed_key: creatorSeedKey,
          title,
          visibility,
          create_status: 'failed',
          activate_status: activateAfterCreate ? 'failed' : 'skipped',
          http_status: null,
          summary: error.message,
        });
        continue;
      }
    }

    let activateStatus = 'skipped';
    let activateHttpStatus = null;
    let activateSummary = 'not requested';
    if (activateAfterCreate) {
      try {
        const jwt = await identityContext.getJwtForSeed(creatorSeedKey);
        const activateRes = await callGateway({
          apiBase,
          endpoint: `/v1/rf/business/partners/${encodeURIComponent(partnerState.partnerId)}/offers/${encodeURIComponent(offerId)}/activate`,
          method: 'POST',
          jwt,
          body: {},
        });
        const activateResSummary = summarizeResponse(activateRes);
        if (!activateRes.ok) {
          activateStatus = 'failed';
          activateHttpStatus = activateRes.status;
          activateSummary = activateResSummary.message || activateResSummary.code || 'activate offer failed';
        } else {
          activateStatus = 'activated';
          activateHttpStatus = activateRes.status;
          activateSummary = 'activated';
        }
      } catch (error) {
        activateStatus = 'failed';
        activateHttpStatus = null;
        activateSummary = error.message;
      }
    }

    state.offers[offerSeedKey] = {
      offerId,
      partnerSeedKey,
      createdBySeedKey: creatorSeedKey,
      title,
      visibility,
      offerType: mappedOfferType,
      shouldBeActive: activateAfterCreate,
    };

    results.push({
      offer_seed_key: offerSeedKey,
      partner_seed_key: partnerSeedKey,
      created_by_seed_key: creatorSeedKey,
      title,
      visibility,
      create_status: createStatus,
      activate_status: activateStatus,
      http_status: activateHttpStatus ?? createHttpStatus,
      summary: `${createSummary}; activate=${activateSummary}`,
    });
  }
  return results;
}

async function runProLinksStep({ rows, identityContext, state, args, apiBase }) {
  const results = [];
  for (const row of rows) {
    const proLinkSeedKey = String(row.pro_link_seed_key || '').trim();
    const partnerSeedKey = String(row.partner_seed_key || '').trim();
    const proUserSeedKey = String(row.pro_user_seed_key || '').trim();
    const roleScope = String(row.role_scope || '').trim();
    const acceptByOwner = yesNoToBool(row.accept_by_owner);

    if (!proLinkSeedKey || !partnerSeedKey || !proUserSeedKey || !roleScope) {
      results.push({
        pro_link_seed_key: proLinkSeedKey || '<empty>',
        partner_seed_key: partnerSeedKey || '<empty>',
        pro_user_seed_key: proUserSeedKey || '<empty>',
        role_scope: roleScope || '<empty>',
        create_status: 'failed',
        accept_status: acceptByOwner ? 'failed' : 'skipped',
        summary: 'missing required fields in CSV row',
      });
      continue;
    }
    if (!ROLE_SCOPE_VALUES.has(roleScope)) {
      results.push({
        pro_link_seed_key: proLinkSeedKey,
        partner_seed_key: partnerSeedKey,
        pro_user_seed_key: proUserSeedKey,
        role_scope: roleScope,
        create_status: 'failed',
        accept_status: acceptByOwner ? 'failed' : 'skipped',
        summary: `unsupported role_scope: ${roleScope}`,
      });
      continue;
    }

    const partnerState = state.partners[partnerSeedKey];
    if (!partnerState?.partnerId) {
      results.push({
        pro_link_seed_key: proLinkSeedKey,
        partner_seed_key: partnerSeedKey,
        pro_user_seed_key: proUserSeedKey,
        role_scope: roleScope,
        create_status: 'failed',
        accept_status: acceptByOwner ? 'failed' : 'skipped',
        summary: `partner_seed_key is not resolved (run partners step first): ${partnerSeedKey}`,
      });
      continue;
    }

    if (args.dryRun) {
      results.push({
        pro_link_seed_key: proLinkSeedKey,
        partner_seed_key: partnerSeedKey,
        pro_user_seed_key: proUserSeedKey,
        role_scope: roleScope,
        create_status: state.proLinks[proLinkSeedKey]?.proLinkId ? 'updated' : 'created',
        accept_status: acceptByOwner ? 'accepted' : 'skipped',
        summary: 'dry-run',
      });
      continue;
    }

    let proLinkId = state.proLinks[proLinkSeedKey]?.proLinkId || null;
    let createStatus = 'updated';
    let createHttpStatus = 200;
    let createSummary = 'pro link already tracked in state';

    if (!proLinkId) {
      try {
        const proJwt = await identityContext.getJwtForSeed(proUserSeedKey);
        const createRes = await callGateway({
          apiBase,
          endpoint: '/v1/rf/pro/links',
          method: 'POST',
          jwt: proJwt,
          body: {
            partnerId: partnerState.partnerId,
            roleScope,
          },
        });
        const createResSummary = summarizeResponse(createRes);
        if (!createRes.ok || !createRes.json?.id) {
          results.push({
            pro_link_seed_key: proLinkSeedKey,
            partner_seed_key: partnerSeedKey,
            pro_user_seed_key: proUserSeedKey,
            role_scope: roleScope,
            create_status: 'failed',
            accept_status: acceptByOwner ? 'failed' : 'skipped',
            http_status: createRes.status,
            summary: createResSummary.message || createResSummary.code || 'create pro link failed',
          });
          continue;
        }
        proLinkId = createRes.json.id;
        createStatus = 'created';
        createHttpStatus = createRes.status;
        createSummary = `proLinkId=${proLinkId}`;
      } catch (error) {
        results.push({
          pro_link_seed_key: proLinkSeedKey,
          partner_seed_key: partnerSeedKey,
          pro_user_seed_key: proUserSeedKey,
          role_scope: roleScope,
          create_status: 'failed',
          accept_status: acceptByOwner ? 'failed' : 'skipped',
          http_status: null,
          summary: error.message,
        });
        continue;
      }
    }

    let acceptStatus = 'skipped';
    let acceptHttpStatus = null;
    let acceptSummary = 'not requested';
    if (acceptByOwner) {
      try {
        const ownerJwt = await identityContext.getJwtForSeed(partnerState.ownerSeedKey);
        const acceptRes = await callGateway({
          apiBase,
          endpoint: `/v1/rf/pro/links/${encodeURIComponent(proLinkId)}/accept`,
          method: 'POST',
          jwt: ownerJwt,
          body: {},
        });
        const acceptResSummary = summarizeResponse(acceptRes);
        if (!acceptRes.ok) {
          acceptStatus = 'failed';
          acceptHttpStatus = acceptRes.status;
          acceptSummary = acceptResSummary.message || acceptResSummary.code || 'accept pro link failed';
        } else {
          acceptStatus = 'accepted';
          acceptHttpStatus = acceptRes.status;
          acceptSummary = 'accepted';
        }
      } catch (error) {
        acceptStatus = 'failed';
        acceptHttpStatus = null;
        acceptSummary = error.message;
      }
    }

    state.proLinks[proLinkSeedKey] = {
      proLinkId,
      partnerSeedKey,
      proUserSeedKey,
      roleScope,
      shouldBeAccepted: acceptByOwner,
    };

    results.push({
      pro_link_seed_key: proLinkSeedKey,
      partner_seed_key: partnerSeedKey,
      pro_user_seed_key: proUserSeedKey,
      role_scope: roleScope,
      create_status: createStatus,
      accept_status: acceptStatus,
      http_status: acceptHttpStatus ?? createHttpStatus,
      summary: `${createSummary}; accept=${acceptSummary}`,
    });
  }
  return results;
}

async function runVoucherCasesStep({ rows, identityContext, state, args, apiBase }) {
  const results = [];
  for (const row of rows) {
    const caseKey = String(row.case_key || '').trim();
    const offerSeedKey = String(row.offer_seed_key || '').trim();
    const claimUserSeedKey = String(row.claim_user_seed_key || '').trim();
    const idempotencyKey = String(row.idempotency_key || '').trim();
    const redeemByOwner = yesNoToBool(row.redeem_by_owner);
    const offerState = state.offers[offerSeedKey];

    if (!caseKey || !offerSeedKey || !claimUserSeedKey || !idempotencyKey) {
      results.push({
        case_key: caseKey || '<empty>',
        offer_seed_key: offerSeedKey || '<empty>',
        claim_user_seed_key: claimUserSeedKey || '<empty>',
        claim_status: 'failed',
        redeem_status: redeemByOwner ? 'failed' : 'skipped',
        summary: 'missing required fields in CSV row',
      });
      continue;
    }
    if (!offerState?.offerId || !offerState?.partnerSeedKey) {
      results.push({
        case_key: caseKey,
        offer_seed_key: offerSeedKey,
        claim_user_seed_key: claimUserSeedKey,
        claim_status: 'failed',
        redeem_status: redeemByOwner ? 'failed' : 'skipped',
        summary: `offer_seed_key is not resolved (run offers step first): ${offerSeedKey}`,
      });
      continue;
    }
    const partnerState = state.partners[offerState.partnerSeedKey];
    if (!partnerState?.partnerId) {
      results.push({
        case_key: caseKey,
        offer_seed_key: offerSeedKey,
        claim_user_seed_key: claimUserSeedKey,
        claim_status: 'failed',
        redeem_status: redeemByOwner ? 'failed' : 'skipped',
        summary: `partner mapping is missing for offer_seed_key ${offerSeedKey}`,
      });
      continue;
    }

    if (args.dryRun) {
      results.push({
        case_key: caseKey,
        offer_seed_key: offerSeedKey,
        claim_user_seed_key: claimUserSeedKey,
        claim_status: 'claimed',
        redeem_status: redeemByOwner ? 'redeemed' : 'skipped',
        summary: 'dry-run',
      });
      continue;
    }

    let voucherId = null;
    let claimStatus = 'failed';
    let claimHttpStatus = null;
    let claimSummary = '';
    try {
      const claimJwt = await identityContext.getJwtForSeed(claimUserSeedKey);
      const claimRes = await callGateway({
        apiBase,
        endpoint: `/v1/rf/offers/${encodeURIComponent(offerState.offerId)}/claim`,
        method: 'POST',
        jwt: claimJwt,
        body: {},
        extraHeaders: { 'Idempotency-Key': idempotencyKey },
      });
      const claimResSummary = summarizeResponse(claimRes);
      claimHttpStatus = claimRes.status;
      voucherId = claimRes.json?.voucher?.id ?? null;
      if (claimRes.ok && voucherId) {
        claimStatus = 'claimed';
        claimSummary = `voucherId=${voucherId}, replay=${Boolean(claimRes.json?.idempotentReplay)}`;
      } else {
        claimStatus = 'failed';
        claimSummary = claimResSummary.message || claimResSummary.code || 'claim failed';
      }
    } catch (error) {
      claimStatus = 'failed';
      claimSummary = error.message;
    }

    let redeemStatus = 'skipped';
    let redeemHttpStatus = null;
    let redeemSummary = 'not requested';
    if (redeemByOwner) {
      if (!voucherId) {
        redeemStatus = 'failed';
        redeemSummary = 'voucherId is missing after claim';
      } else {
        try {
          const ownerJwt = await identityContext.getJwtForSeed(partnerState.ownerSeedKey);
          const redeemRes = await callGateway({
            apiBase,
            endpoint: `/v1/rf/business/partners/${encodeURIComponent(partnerState.partnerId)}/vouchers/${encodeURIComponent(voucherId)}/redeem`,
            method: 'POST',
            jwt: ownerJwt,
            body: {},
          });
          const redeemResSummary = summarizeResponse(redeemRes);
          redeemHttpStatus = redeemRes.status;
          if (redeemRes.ok && redeemRes.json?.voucher?.id) {
            redeemStatus = 'redeemed';
            redeemSummary = `voucherId=${redeemRes.json.voucher.id}, applied=${Boolean(redeemRes.json?.applied)}`;
          } else {
            redeemStatus = 'failed';
            redeemSummary = redeemResSummary.message || redeemResSummary.code || 'redeem failed';
          }
        } catch (error) {
          redeemStatus = 'failed';
          redeemSummary = error.message;
        }
      }
    }

    if (voucherId) {
      state.vouchers[caseKey] = {
        voucherId,
        offerSeedKey,
        partnerSeedKey: offerState.partnerSeedKey,
        claimUserSeedKey,
        idempotencyKey,
      };
    }

    results.push({
      case_key: caseKey,
      offer_seed_key: offerSeedKey,
      claim_user_seed_key: claimUserSeedKey,
      claim_status: claimStatus,
      redeem_status: redeemStatus,
      http_status: redeemHttpStatus ?? claimHttpStatus,
      summary: `claim=${claimSummary}; redeem=${redeemSummary}`,
    });
  }
  return results;
}

async function runVerifyStep({ partnersRows, offersRows, proLinksRows, dbUrl, identityContext, state }) {
  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  try {
    const partnerRowsFromDb = await client.query(
      `
      SELECT id, display_name, owner_user_id, status, country_id, city_id
      FROM rf_partner
      `,
    );
    const offerRowsFromDb = await client.query(
      `
      SELECT id, partner_id, title, visibility, status, created_by_user_id, offer_type
      FROM rf_offer
      `,
    );
    const proLinkRowsFromDb = await client.query(
      `
      SELECT id, partner_id, pro_user_id, status, role_scope
      FROM rf_pro_link
      `,
    );

    const partnerById = new Map(partnerRowsFromDb.rows.map((row) => [row.id, row]));
    const offerById = new Map(offerRowsFromDb.rows.map((row) => [row.id, row]));
    const proLinkById = new Map(proLinkRowsFromDb.rows.map((row) => [row.id, row]));

    const partners = partnersRows.map((row) => {
      const partnerSeedKey = String(row.partner_seed_key || '').trim();
      const ownerSeedKey = String(row.owner_seed_key || '').trim();
      const statePartner = state.partners[partnerSeedKey];
      const owner = identityContext.bySeed.get(ownerSeedKey);
      const failures = [];
      if (!statePartner?.partnerId) failures.push('missing_partner_id_in_state');
      if (!owner?.userId) failures.push('missing_owner_user_in_identity');
      const dbRow = statePartner?.partnerId ? partnerById.get(statePartner.partnerId) ?? null : null;
      if (!dbRow) failures.push('partner_not_found_in_db');
      if (dbRow && owner?.userId && dbRow.owner_user_id !== owner.userId) {
        failures.push(`owner_user_mismatch:expected=${owner.userId},actual=${dbRow.owner_user_id}`);
      }
      return {
        entity: 'partner',
        seed_key: partnerSeedKey,
        verification: failures.length === 0 ? 'passed' : 'failed',
        failures,
      };
    });

    const offers = offersRows.map((row) => {
      const offerSeedKey = String(row.offer_seed_key || '').trim();
      const stateOffer = state.offers[offerSeedKey];
      const expectedPartner = state.partners[String(row.partner_seed_key || '').trim()];
      const creator = identityContext.bySeed.get(String(row.created_by_seed_key || '').trim());
      const mappedOfferType = normalizeOfferType(row.offer_type);
      const shouldBeActive = yesNoToBool(row.activate_after_create);
      const failures = [];
      if (!stateOffer?.offerId) failures.push('missing_offer_id_in_state');
      if (!expectedPartner?.partnerId) failures.push('missing_partner_id_in_state');
      if (!creator?.userId) failures.push('missing_creator_user_in_identity');
      const dbRow = stateOffer?.offerId ? offerById.get(stateOffer.offerId) ?? null : null;
      if (!dbRow) failures.push('offer_not_found_in_db');
      if (dbRow && expectedPartner?.partnerId && dbRow.partner_id !== expectedPartner.partnerId) {
        failures.push(`partner_mismatch:expected=${expectedPartner.partnerId},actual=${dbRow.partner_id}`);
      }
      if (dbRow && creator?.userId && dbRow.created_by_user_id !== creator.userId) {
        failures.push(`creator_mismatch:expected=${creator.userId},actual=${dbRow.created_by_user_id}`);
      }
      if (dbRow && dbRow.visibility !== String(row.visibility || '').trim()) {
        failures.push(`visibility_mismatch:expected=${row.visibility},actual=${dbRow.visibility}`);
      }
      if (dbRow && mappedOfferType && dbRow.offer_type !== mappedOfferType) {
        failures.push(`offer_type_mismatch:expected=${mappedOfferType},actual=${dbRow.offer_type}`);
      }
      if (dbRow) {
        const expectedStatus = shouldBeActive ? 'active' : 'draft';
        if (dbRow.status !== expectedStatus) {
          failures.push(`status_mismatch:expected=${expectedStatus},actual=${dbRow.status}`);
        }
      }
      return {
        entity: 'offer',
        seed_key: offerSeedKey,
        verification: failures.length === 0 ? 'passed' : 'failed',
        failures,
      };
    });

    const proLinks = proLinksRows.map((row) => {
      const proLinkSeedKey = String(row.pro_link_seed_key || '').trim();
      const expectedPartner = state.partners[String(row.partner_seed_key || '').trim()];
      const expectedProUser = identityContext.bySeed.get(String(row.pro_user_seed_key || '').trim());
      const shouldBeAccepted = yesNoToBool(row.accept_by_owner);
      const stateProLink = state.proLinks[proLinkSeedKey];
      const failures = [];
      if (!stateProLink?.proLinkId) failures.push('missing_pro_link_id_in_state');
      if (!expectedPartner?.partnerId) failures.push('missing_partner_id_in_state');
      if (!expectedProUser?.userId) failures.push('missing_pro_user_in_identity');
      const dbRow = stateProLink?.proLinkId ? proLinkById.get(stateProLink.proLinkId) ?? null : null;
      if (!dbRow) failures.push('pro_link_not_found_in_db');
      if (dbRow && expectedPartner?.partnerId && dbRow.partner_id !== expectedPartner.partnerId) {
        failures.push(`partner_mismatch:expected=${expectedPartner.partnerId},actual=${dbRow.partner_id}`);
      }
      if (dbRow && expectedProUser?.userId && dbRow.pro_user_id !== expectedProUser.userId) {
        failures.push(`pro_user_mismatch:expected=${expectedProUser.userId},actual=${dbRow.pro_user_id}`);
      }
      if (dbRow && dbRow.role_scope !== String(row.role_scope || '').trim()) {
        failures.push(`role_scope_mismatch:expected=${row.role_scope},actual=${dbRow.role_scope}`);
      }
      if (dbRow) {
        const expectedStatus = shouldBeAccepted ? 'active' : 'pending';
        if (dbRow.status !== expectedStatus) {
          failures.push(`status_mismatch:expected=${expectedStatus},actual=${dbRow.status}`);
        }
      }
      return {
        entity: 'pro_link',
        seed_key: proLinkSeedKey,
        verification: failures.length === 0 ? 'passed' : 'failed',
        failures,
      };
    });

    return [...partners, ...offers, ...proLinks];
  } finally {
    await client.end();
  }
}

function printStepTable(step, rows) {
  console.log(`\n${step} results:`);
  for (const row of rows) {
    console.log(safeJson(row));
  }
}

function printSummary(step, rows, isVerify = false) {
  const passedKey = isVerify ? 'passed' : 'created';
  const failed = rows.filter((row) => (isVerify ? row.verification === 'failed' : row.status === 'failed' || row.create_status === 'failed' || row.claim_status === 'failed')).length;

  if (isVerify) {
    const passed = rows.filter((row) => row.verification === 'passed').length;
    console.log(`\nVerification summary (${step}):`);
    console.log(`- passed: ${passed}`);
    console.log(`- failed: ${failed}`);
  } else {
    const created = rows.filter((row) => row.status === 'created' || row.create_status === 'created').length;
    const updated = rows.filter((row) => row.status === 'updated' || row.create_status === 'updated').length;
    console.log(`\nImport summary (${step}):`);
    console.log(`- created: ${created}`);
    console.log(`- updated: ${updated}`);
    console.log(`- failed: ${failed}`);
    if (passedKey === 'created') {
      // no-op; keeps lint happy for shared summary helper
    }
  }
  return failed === 0;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const step = args.step;
  debugPhase(args.debug, 'args_parsed', {
    step,
    dryRun: args.dryRun,
    limit: args.limit ?? null,
    partnerSeedKeyFilters: args.partnerSeedKeys.length,
    offerSeedKeyFilters: args.offerSeedKeys.length,
    proLinkSeedKeyFilters: args.proLinkSeedKeys.length,
    caseKeyFilters: args.caseKeys.length,
  });

  const apiBase = normalizeApiBase(args.apiBase);
  debugPhase(args.debug, 'api_base_normalized', {
    hasApiBase: Boolean(apiBase),
  });

  const stateFilePath = path.resolve(process.cwd(), args.stateFile);
  const identityCsvPath = path.resolve(process.cwd(), args.identityCsv);
  const partnersCsvPath = path.resolve(process.cwd(), args.partnersCsv);
  const offersCsvPath = path.resolve(process.cwd(), args.offersCsv);
  const proLinksCsvPath = path.resolve(process.cwd(), args.proLinksCsv);
  const voucherCasesCsvPath = path.resolve(process.cwd(), args.voucherCasesCsv);
  debugPhase(args.debug, 'paths_resolved', {
    stateFilePath,
    identityCsvPath,
    partnersCsvPath,
    offersCsvPath,
    proLinksCsvPath,
    voucherCasesCsvPath,
  });

  const clerkSecret = (process.env.CLERK_SECRET_KEY || '').trim();
  if (!clerkSecret) throw new Error('Missing env: CLERK_SECRET_KEY');
  if (entityWriteStep(step) && !args.dryRun) {
    if (!(process.env.CLERK_INSTANCE_URL || '').trim()) {
      throw new Error('Missing env: CLERK_INSTANCE_URL');
    }
    if (!apiBase) {
      throw new Error('Missing API base URL (--api-base or env API_BASE)');
    }
  }
  debugPhase(args.debug, 'env_validated', {
    step,
    requiresWriteAuth: entityWriteStep(step) && !args.dryRun,
    hasClerkSecret: Boolean(clerkSecret),
    hasClerkInstanceUrl: Boolean((process.env.CLERK_INSTANCE_URL || '').trim()),
    hasApiBase: Boolean(apiBase),
  });

  const identityRows = await readCsv(identityCsvPath, ['seed_key', 'email', 'platform_role']);
  debugPhase(args.debug, 'identity_csv_loaded', { rows: identityRows.length, path: identityCsvPath });
  const partnersRows = await readCsv(partnersCsvPath, ['partner_seed_key', 'owner_seed_key', 'display_name', 'country_id', 'city_id']);
  debugPhase(args.debug, 'partners_csv_loaded', { rows: partnersRows.length, path: partnersCsvPath });
  const offersRows = await readCsv(offersCsvPath, ['offer_seed_key', 'partner_seed_key', 'created_by_seed_key', 'title', 'offer_type', 'visibility', 'activate_after_create']);
  debugPhase(args.debug, 'offers_csv_loaded', { rows: offersRows.length, path: offersCsvPath });
  const proLinksRows = await readCsv(proLinksCsvPath, ['pro_link_seed_key', 'partner_seed_key', 'pro_user_seed_key', 'role_scope', 'accept_by_owner']);
  debugPhase(args.debug, 'pro_links_csv_loaded', { rows: proLinksRows.length, path: proLinksCsvPath });
  const voucherCasesRows = await readCsv(voucherCasesCsvPath, ['case_key', 'offer_seed_key', 'claim_user_seed_key', 'idempotency_key', 'expect_claim_status', 'redeem_by_owner']);
  debugPhase(args.debug, 'voucher_cases_csv_loaded', { rows: voucherCasesRows.length, path: voucherCasesCsvPath });

  const state = await loadState(stateFilePath);
  debugPhase(args.debug, 'state_loaded', {
    path: stateFilePath,
    partnersTracked: Object.keys(state.partners || {}).length,
    offersTracked: Object.keys(state.offers || {}).length,
    proLinksTracked: Object.keys(state.proLinks || {}).length,
    vouchersTracked: Object.keys(state.vouchers || {}).length,
  });
  const clerk = createClerkClient({ secretKey: clerkSecret });
  debugPhase(args.debug, 'clerk_client_created', { step });

  const selectedPartnersRows = applyFilterAndLimit(
    partnersRows,
    new Set(args.partnerSeedKeys.filter(Boolean)),
    'partner_seed_key',
    args.limit,
  );
  const selectedOffersRows = applyFilterAndLimit(
    offersRows,
    new Set(args.offerSeedKeys.filter(Boolean)),
    'offer_seed_key',
    args.limit,
  );
  const selectedProLinksRows = applyFilterAndLimit(
    proLinksRows,
    new Set(args.proLinkSeedKeys.filter(Boolean)),
    'pro_link_seed_key',
    args.limit,
  );
  const selectedVoucherCasesRows = applyFilterAndLimit(
    voucherCasesRows,
    new Set(args.caseKeys.filter(Boolean)),
    'case_key',
    args.limit,
  );

  const identitySeedSubset = resolveRequiredIdentitySeedKeys({
    step,
    selectedPartnersRows,
    selectedOffersRows,
    selectedProLinksRows,
    selectedVoucherCasesRows,
    allPartnersRows: partnersRows,
    allOffersRows: offersRows,
  });
  debugPhase(args.debug, 'identity_seed_subset_resolved', {
    step,
    count: identitySeedSubset.requiredSeedKeys.size,
    seedKeys: Array.from(identitySeedSubset.requiredSeedKeys),
    reasons: identitySeedSubset.reasons,
    selectedRowCounts: {
      partners: selectedPartnersRows.length,
      offers: selectedOffersRows.length,
      proLinks: selectedProLinksRows.length,
      voucherCases: selectedVoucherCasesRows.length,
    },
  });

  debugPhase(args.debug, 'identity_context_build_started', { identityRows: identityRows.length });
  const identityContext = await buildIdentityContext(
    identityRows,
    clerk,
    args.debug,
    identitySeedSubset.requiredSeedKeys,
  );
  debugPhase(args.debug, 'identity_context_build_finished', { identitySeeds: identityContext.bySeed.size });

  if (step === 'partners') {
    debugPhase(args.debug, 'step_entered', { step: 'partners' });
    const results = await runPartnersStep({ rows: selectedPartnersRows, identityContext, state, args, apiBase });
    if (!args.dryRun) await saveState(stateFilePath, state);
    printStepTable('partners', results);
    const ok = printSummary('partners', results);
    if (!ok) process.exit(1);
    return;
  }

  if (step === 'offers') {
    debugPhase(args.debug, 'step_entered', { step: 'offers' });
    const results = await runOffersStep({ rows: selectedOffersRows, identityContext, state, args, apiBase });
    if (!args.dryRun) await saveState(stateFilePath, state);
    printStepTable('offers', results);
    const ok = printSummary('offers', results);
    if (!ok) process.exit(1);
    return;
  }

  if (step === 'pro-links') {
    debugPhase(args.debug, 'step_entered', { step: 'pro-links' });
    const results = await runProLinksStep({ rows: selectedProLinksRows, identityContext, state, args, apiBase });
    if (!args.dryRun) await saveState(stateFilePath, state);
    printStepTable('pro-links', results);
    const ok = printSummary('pro-links', results);
    if (!ok) process.exit(1);
    return;
  }

  if (step === 'voucher-cases') {
    debugPhase(args.debug, 'step_entered', { step: 'voucher-cases' });
    const results = await runVoucherCasesStep({ rows: selectedVoucherCasesRows, identityContext, state, args, apiBase });
    if (!args.dryRun) await saveState(stateFilePath, state);
    printStepTable('voucher-cases', results);
    const failed = results.filter((row) => row.claim_status === 'failed' || row.redeem_status === 'failed').length;
    console.log(`\nVoucher cases summary:`);
    console.log(`- passed: ${results.length - failed}`);
    console.log(`- failed: ${failed}`);
    if (failed > 0) process.exit(1);
    return;
  }

  if (step === 'verify') {
    debugPhase(args.debug, 'step_entered', { step: 'verify' });
    const dbUrl = requireDbUrl();
    const results = await runVerifyStep({
      partnersRows: selectedPartnersRows,
      offersRows: selectedOffersRows,
      proLinksRows: selectedProLinksRows,
      dbUrl,
      identityContext,
      state,
    });
    printStepTable('verify', results);
    const ok = printSummary('verify', results, true);
    if (!ok) process.exit(1);
    return;
  }
}

main().catch((error) => {
  const details = {
    name: error?.name || 'Error',
    message: error?.message || '(empty message)',
    stack: error?.stack || '(no stack)',
    cause: error?.cause
      ? {
          name: error.cause?.name || 'Error',
          message: error.cause?.message || '(empty message)',
        }
      : null,
    errorObject: safeErrorDetails(error),
  };
  console.error('[rf_first_batch] fatal error');
  console.error(`name: ${details.name}`);
  console.error(`message: ${details.message}`);
  console.error(`stack: ${details.stack}`);
  if (details.cause) {
    console.error(`cause: ${details.cause.name}: ${details.cause.message}`);
  }
  console.error(`diagnostics: ${safeJson(details)}`);
  process.exit(1);
});

