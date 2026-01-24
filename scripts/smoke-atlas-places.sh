#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${STAGING_GATEWAY_URL:-https://go2asia-api-gateway-staging.fred89059599296.workers.dev}"
export BASE_URL

node <<'NODE'
const base = process.env.BASE_URL;

async function checkEndpoint(url, description) {
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} for ${url}`);
    }
    const data = await res.json();
    return { ok: true, data, description };
  } catch (err) {
    return { ok: false, error: err.message, description };
  }
}

async function main() {
  console.log('Smoke tests for Atlas Places API\n');

  // 1. Check places list endpoints
  const listEndpoints = [
    { url: `${base}/v1/content/places?countryId=ph&kind=showplace`, desc: 'PH showplaces' },
    { url: `${base}/v1/content/places?countryId=ph&kind=business`, desc: 'PH businesses' },
    { url: `${base}/v1/content/places?cityId=mnl`, desc: 'Manila places' },
  ];

  console.log('1. Places list endpoints:');
  let samplePlaceSlug = null;
  for (const { url, desc } of listEndpoints) {
    const result = await checkEndpoint(url, desc);
    if (!result.ok) {
      console.error(`  [FAIL] ${desc}: ${result.error}`);
      process.exit(1);
    }
    const count = Array.isArray(result.data?.items) ? result.data.items.length : 0;
    if (count === 0) {
      console.error(`  [FAIL] ${desc}: empty items`);
      process.exit(1);
    }
    console.log(`  [OK] ${desc}: ${count} items`);
    // Get first place slug for tabs test
    if (!samplePlaceSlug && result.data.items[0]?.slug) {
      samplePlaceSlug = result.data.items[0].slug;
    }
  }

  // 2. Check place detail endpoint
  if (!samplePlaceSlug) {
    console.error('  [FAIL] No place slug found for detail test');
    process.exit(1);
  }

  console.log(`\n2. Place detail endpoint (slug: ${samplePlaceSlug}):`);
  const detailResult = await checkEndpoint(`${base}/v1/content/places/${samplePlaceSlug}`, 'Place detail');
  if (!detailResult.ok) {
    console.error(`  [FAIL] Place detail: ${detailResult.error}`);
    process.exit(1);
  }
  const place = detailResult.data;
  if (!place.id || !place.slug || !place.kind) {
    console.error(`  [FAIL] Place detail: missing required fields`);
    process.exit(1);
  }
  console.log(`  [OK] Place detail: ${place.name} (${place.kind})`);

  // 3. Check place tabs endpoint
  console.log(`\n3. Place tabs endpoint (slug: ${samplePlaceSlug}):`);
  const tabsResult = await checkEndpoint(
    `${base}/v1/content/places/${samplePlaceSlug}/tabs?lang=ru&tabKey=overview`,
    'Place tabs'
  );
  if (!tabsResult.ok) {
    console.error(`  [FAIL] Place tabs: ${tabsResult.error}`);
    process.exit(1);
  }
  const tabs = tabsResult.data;
  const tabsCount = Array.isArray(tabs?.items) ? tabs.items.length : 0;
  if (tabsCount === 0) {
    console.warn(`  [WARN] Place tabs: no tabs found (may be OK if content_blocks not seeded yet)`);
  } else {
    const overviewTab = tabs.items.find((t) => t.tabKey === 'overview');
    if (overviewTab && overviewTab.bodyMarkdown) {
      console.log(`  [OK] Place tabs: overview tab found (${overviewTab.bodyMarkdown.length} chars)`);
    } else {
      console.warn(`  [WARN] Place tabs: overview tab missing or empty`);
    }
  }

  // 4. Check specific PH places (canonical)
  const canonicalSlugs = ['boracay-puka-shell-beach', 'pps-tubbataha-reef'];
  console.log('\n4. Place tabs (canonical slugs):');
  for (const slug of canonicalSlugs) {
    const canonicalRes = await checkEndpoint(
      `${base}/v1/content/places/${slug}/tabs?lang=ru&tabKey=overview`,
      `Place tabs (${slug})`
    );
    if (!canonicalRes.ok) {
      console.error(`  [FAIL] ${slug}: ${canonicalRes.error}`);
      process.exit(1);
    }
    const items = canonicalRes.data?.items ?? [];
    const overview = items.find((t) => t.tabKey === 'overview');
    const mdLen = overview?.bodyMarkdown?.length ?? 0;
    if (mdLen === 0) {
      console.error(`  [FAIL] ${slug}: overview markdown empty`);
      process.exit(1);
    }
    console.log(`  [OK] ${slug}: overview markdown ${mdLen} chars`);
  }

  console.log('\n✅ All smoke tests passed');
}

main().catch((err) => {
  console.error(`\n❌ Smoke tests failed: ${err.message}`);
  process.exit(1);
});
NODE
