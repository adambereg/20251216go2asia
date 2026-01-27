/* eslint-disable no-console */

const base = process.env.BASE_URL;
if (!base) {
  console.error('Missing BASE_URL env var');
  process.exit(1);
}

async function checkEndpoint(url, description) {
  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} for ${url}`);
      }
      const data = await res.json();
      return { ok: true, data, description };
    } catch (err) {
      const msg = err?.message ?? String(err);
      const isNetworkFlake = /fetch failed|network|socket|timeout|terminated/i.test(msg);
      if (attempt < maxAttempts && isNetworkFlake) {
        // small backoff for transient network flakes
        await new Promise((r) => setTimeout(r, 250 * attempt));
        continue;
      }
      return { ok: false, error: msg, description };
    }
  }
  return { ok: false, error: 'Unknown error', description };
}

async function main() {
  console.log('Smoke tests for Atlas Places API\n');

  // 1. Check places list endpoints
  const listEndpoints = [
    { url: `${base}/v1/content/places?countryId=ph&kind=showplace`, desc: 'PH showplaces' },
    { url: `${base}/v1/content/places?countryId=ph&kind=business`, desc: 'PH businesses' },
    { url: `${base}/v1/content/places?cityId=mnl`, desc: 'Manila places' },
    { url: `${base}/v1/content/places?countryId=kh&kind=showplace`, desc: 'KH showplaces' },
    { url: `${base}/v1/content/places?countryId=kh&kind=business`, desc: 'KH businesses' },
    { url: `${base}/v1/content/places?cityId=pnh`, desc: 'Phnom Penh places' },
    { url: `${base}/v1/content/places?countryId=vn&kind=showplace`, desc: 'VN showplaces' },
    { url: `${base}/v1/content/places?countryId=vn&kind=business`, desc: 'VN businesses' },
    { url: `${base}/v1/content/places?cityId=hue`, desc: 'Hue places' },
    { url: `${base}/v1/content/places?cityId=dad`, desc: 'Da Nang places' },
  ];

  console.log('1. Places list endpoints:');
  let samplePlaceSlug = null;
  let sampleKhShowplaceSlug = null;
  let sampleKhBusinessSlug = null;
  let sampleVnShowplaceSlug = null;
  let sampleVnBusinessSlug = null;
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
    if (!samplePlaceSlug && result.data.items[0]?.slug) {
      samplePlaceSlug = result.data.items[0].slug;
    }
    if (desc === 'KH showplaces' && !sampleKhShowplaceSlug && result.data.items[0]?.slug) {
      sampleKhShowplaceSlug = result.data.items[0].slug;
    }
    if (desc === 'KH businesses' && !sampleKhBusinessSlug && result.data.items[0]?.slug) {
      sampleKhBusinessSlug = result.data.items[0].slug;
    }
    if (desc === 'VN showplaces' && !sampleVnShowplaceSlug && result.data.items[0]?.slug) {
      sampleVnShowplaceSlug = result.data.items[0].slug;
    }
    if (desc === 'VN businesses' && !sampleVnBusinessSlug && result.data.items[0]?.slug) {
      sampleVnBusinessSlug = result.data.items[0].slug;
    }
  }

  // 2. Check KH + VN place detail endpoints (media expectations)
  if (!sampleKhShowplaceSlug || !sampleKhBusinessSlug) {
    console.error('  [FAIL] No KH place slug found for detail test');
    process.exit(1);
  }
  if (!sampleVnShowplaceSlug || !sampleVnBusinessSlug) {
    console.error('  [FAIL] No VN place slug found for detail test');
    process.exit(1);
  }

  console.log(`\n2. KH place detail endpoints (showplace + business):`);
  for (const slug of [sampleKhShowplaceSlug, sampleKhBusinessSlug]) {
    const detailResult = await checkEndpoint(`${base}/v1/content/places/${slug}`, `Place detail (${slug})`);
    if (!detailResult.ok) {
      console.error(`  [FAIL] ${slug}: ${detailResult.error}`);
      process.exit(1);
    }
    const place = detailResult.data;
    if (!place.id || !place.slug || !place.kind) {
      console.error(`  [FAIL] ${slug}: missing required fields`);
      process.exit(1);
    }
    if (!place.heroImage) {
      console.error(`  [FAIL] ${slug}: heroImage is empty`);
      process.exit(1);
    }
    const photosLen = Array.isArray(place.photos) ? place.photos.length : 0;
    if (photosLen < 3) {
      console.error(`  [FAIL] ${slug}: photos length < 3 (got ${photosLen})`);
      process.exit(1);
    }
    console.log(`  [OK] ${slug}: kind=${place.kind}, photos=${photosLen}`);
  }

  console.log(`\n2b. VN place detail endpoints (showplace + business):`);
  for (const slug of [sampleVnShowplaceSlug, sampleVnBusinessSlug]) {
    const detailResult = await checkEndpoint(`${base}/v1/content/places/${slug}`, `Place detail (${slug})`);
    if (!detailResult.ok) {
      console.error(`  [FAIL] ${slug}: ${detailResult.error}`);
      process.exit(1);
    }
    const place = detailResult.data;
    if (!place.id || !place.slug || !place.kind) {
      console.error(`  [FAIL] ${slug}: missing required fields`);
      process.exit(1);
    }
    if (!place.heroImage) {
      console.error(`  [FAIL] ${slug}: heroImage is empty`);
      process.exit(1);
    }
    const photosLen = Array.isArray(place.photos) ? place.photos.length : 0;
    if (photosLen < 3) {
      console.error(`  [FAIL] ${slug}: photos length < 3 (got ${photosLen})`);
      process.exit(1);
    }
    console.log(`  [OK] ${slug}: kind=${place.kind}, photos=${photosLen}`);
  }

  // 3. Check place tabs endpoint
  console.log(`\n3. Place tabs endpoint (KH showplace slug: ${sampleKhShowplaceSlug}):`);
  const tabsResult = await checkEndpoint(
    `${base}/v1/content/places/${sampleKhShowplaceSlug}/tabs?lang=ru&tabKey=overview`,
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

  // 4. Check canonical places (PH + KH + VN)
  const canonical = [
    // PH
    { slug: 'boracay-puka-shell-beach', kind: 'showplace' },
    { slug: 'pps-tubbataha-reef', kind: 'showplace' },
    // KH (examples)
    { slug: 'rep-angkor-wat', kind: 'showplace' },
    { slug: 'pnh-malis-restaurant', kind: 'business' },
    // VN (examples)
    { slug: 'hue-imperial-city-hue', kind: 'showplace' },
    { slug: 'dad-my-khe-beach', kind: 'showplace' },
    { slug: 'sgn-banh-mi-huynh-hoa', kind: 'business' },
  ];
  console.log('\n4. Place detail + tabs (canonical slugs):');
  for (const { slug, kind } of canonical) {
    const detail = await checkEndpoint(`${base}/v1/content/places/${slug}`, `Place detail (${slug})`);
    if (!detail.ok) {
      console.error(`  [FAIL] ${slug}: ${detail.error}`);
      process.exit(1);
    }
    const p = detail.data;
    if (kind && p?.kind && p.kind !== kind) {
      console.error(`  [FAIL] ${slug}: expected kind=${kind}, got ${p.kind}`);
      process.exit(1);
    }
    const isKh = slug.startsWith('rep-') || slug.startsWith('pnh-');
    const isVn = slug.startsWith('hue-') || slug.startsWith('dad-') || slug.startsWith('sgn-') || slug.startsWith('hoi-') || slug.startsWith('han-');
    // KH/VN: strict media checks (canonical places should have R2 media)
    if (isKh || isVn) {
      if (!p?.heroImage) {
        console.error(`  [FAIL] ${slug}: heroImage empty`);
        process.exit(1);
      }
      const pPhotosLen = Array.isArray(p?.photos) ? p.photos.length : 0;
      if (pPhotosLen < 3) {
        console.error(`  [FAIL] ${slug}: photos length < 3 (got ${pPhotosLen})`);
        process.exit(1);
      }
    }

    const canonicalRes = await checkEndpoint(
      `${base}/v1/content/places/${slug}/tabs?lang=ru&tabKey=overview`,
      `Place tabs (${slug})`
    );
    if (!canonicalRes.ok) {
      console.error(`  [FAIL] ${slug} tabs: ${canonicalRes.error}`);
      process.exit(1);
    }
    const items = canonicalRes.data?.items ?? [];
    const overview = items.find((t) => t.tabKey === 'overview');
    const mdLen = overview?.bodyMarkdown?.length ?? 0;
    if (mdLen === 0) {
      console.error(`  [FAIL] ${slug}: overview markdown empty`);
      process.exit(1);
    }
    const pPhotosLen = Array.isArray(p?.photos) ? p.photos.length : 0;
    console.log(`  [OK] ${slug}: kind=${p.kind}, photos=${pPhotosLen}, overviewMarkdown=${mdLen} chars`);
  }

  console.log('\n✅ All smoke tests passed');
}

main().catch((err) => {
  console.error(`\n❌ Smoke tests failed: ${err?.message ?? String(err)}`);
  process.exit(1);
});

