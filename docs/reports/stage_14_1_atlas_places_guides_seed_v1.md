# Stage 14.1 - Atlas / Places / Guides Seed (v1)

## Executive Summary

Stage 14.1 выполнен как bounded implementation slice в рамках Stage 14 Content & Data Seeding:

- добавлен минимальный curated seed-контур для Atlas по `Japan` и `South Korea`;
- расширены Atlas mock datasets (countries/cities/guides/places) для визуальной плотности и continuity;
- обновлены только Atlas seed/export loaders для поддержки новых country folders и city mappings;
- выполнено route-safe Atlas presentation wiring без API/OpenAPI/schema/runtime semantics изменений.

Срез удерживает discovery-oriented модель Atlas и не эскалирует к authority/proof semantics.

## Atlas Surfaces Covered

Покрытые Atlas surfaces:

- `/atlas` (countries discovery density через mock/api seeds)
- `/atlas/cities` (добавлены JP/KR capitals в mock ordering + city pools)
- `/atlas/places` и country/city places surfaces:
  - `/atlas/countries/[id]/places`
  - `/atlas/cities/[id]/places`
- `/atlas/guides` (новые guides и фильтруемые теги)
- seed/export preparation surfaces:
  - `packages/db/src/exportPlacesToNeon.ts`
  - `packages/db/src/exportAtlasCountryCityTabsToNeon.ts`

## Seeded Content Categories

Реализованные категории Stage 14.1:

1. Country editorial seed (JP/KR)
2. City editorial seed (Tokyo/Osaka/Fukuoka, Seoul/Busan/Jeju)
3. Curated places seed (showplace discovery cards)
4. Route/comparative/niche guides seed
5. Atlas mock continuity seed (countries/cities/guides/places)
6. Export mapping seed support (country/city id wiring for new folders)

## Countries/Cities/Places Coverage

Новый bounded coverage:

- **Countries:** `jp`, `kr`
- **Cities:** `tok`, `osa`, `fuk`, `seo`, `pus`, `cju`
- **Places content files:**
  - `content/atlas/japan/japan-places.md`
  - `content/atlas/south-korea/south-korea-places.md`
- **Mock places density:** curated cross-country set с явным JP/KR присутствием и без fake rating/authority claims.

Добавленные контентные файлы:

- `content/atlas/japan/country-japan.md`
- `content/atlas/japan/city-tokyo.md`
- `content/atlas/japan/city-osaka.md`
- `content/atlas/japan/city-fukuoka.md`
- `content/atlas/japan/japan-places.md`
- `content/atlas/south-korea/country-south-korea.md`
- `content/atlas/south-korea/city-seoul.md`
- `content/atlas/south-korea/city-busan.md`
- `content/atlas/south-korea/city-jeju.md`
- `content/atlas/south-korea/south-korea-places.md`

## Guide Coverage

Добавлены новые Atlas guides:

- `content/atlas/guide/rte.first-week-in-tokyo.md`
- `content/atlas/guide/rte.seoul-neighborhoods-in-5-days.md`
- `content/atlas/guide/nsh.remote-work-seoul-busan.md`
- `content/atlas/guide/cmp.tokyo-vs-seoul-for-relocation.md`

Guide coverage реализован как editorial/curated discovery слой (route/niche/comparative), без authority signalling.

## Sparse vs Dense Decisions

### Dense (minimum ecosystem density)

- countries list (JP/KR добавлены в Atlas country inventory)
- cities list и capitals block (JP/KR включены)
- places discovery surfaces (country/city filtered)
- guides index с базовой вариативностью по сценариям

### Intentionally sparse (сохранено)

- Atlas tools/checklists/calculators/hubs
- place subroutes типа `/atlas/places/[id]/reviews|partners|nearby-*` (вне 14.1)
- любые authority-like layers (verification, booking-like, moderation-like signals)

## Projection/Authority Safety Review

Проверка semantics:

- сохранено: `projection != authority`, `mock_data != proof`, `public_launch_implied = false`;
- отсутствуют изменения wallet/VIP/Path B/economy domains;
- не добавлялись claim-формулировки вида `official verified authority`, `guaranteed`, `certified`, `booking confirmed`, `settlement proof`;
- country content содержит явные оговорки про необходимость проверки официальных источников для визовых/регуляторных данных;
- places/guides удержаны в advisory/editorial language.

Дополнительно:

- приведён формат координат в новых places markdown к parser-compatible виду `**Координаты:** ...`, чтобы не терять exportability.

## Route/Tab Validation

Выполнено в рамках Stage 14.1:

- route-safe wiring для Atlas mock/API country/city places surfaces:
  - добавлен API `countryId` filter в `/atlas/countries/[id]/places`;
  - устранён mock fallback drift в `/atlas/cities/[id]/places` (cityId -> expected city names mapping);
  - исправлен mock geo map country mapping для `jp`/`kr`.
- табовая структура country/city markdown соблюдает существующие tab-key conventions (`seedAtlasTabs` / `exportAtlasCountryCityTabsToNeon`).
- новые country folders (`japan`, `south-korea`) добавлены в export loader mappings.

## QA Findings

### Validation execution

- `pnpm -C apps/go2asia-pwa-shell typecheck` - pass
- `pnpm -C apps/go2asia-pwa-shell lint` - pass (warnings-only baseline, без новых lint errors)
- `pnpm -C apps/go2asia-pwa-shell test -- atlas` - pass (`--passWithNoTests`)
- targeted unsafe vocabulary scan по Atlas content - без новых positive authority claims

### QA gate outcome

- Route continuity для новых Atlas seeds в mock/api потоках - pass после дофиксов.
- Empty-state формулировки приведены к source-aware поведению (mock vs api).
- Seed rendering density по JP/KR для countries/cities/places/guides - pass на уровне данных и wiring.

Ручная UI-проверка (рекомендуется перед merge):

- `/atlas/countries/jp/places`
- `/atlas/countries/kr/places`
- `/atlas/cities/tok/places`
- `/atlas/cities/seo/places`
- `/atlas/guides` (новые guide slugs и фильтры)

## Governance Review

Review gates (multi-agent mode):

- Slice Review - pass (bounded Atlas scope сохранён)
- Runtime Governance Review - pass (низкие лексические риски без blockers)
- Code Review - pass после устранения wiring gaps
- QA Review - pass после устранения continuity gaps
- Canon Review - pass (aligned with Stage 14.0 seed map + Stage 12I/13/13A baseline)

Изменения вне Atlas scope не выполнялись.

## Remaining Sparse Areas

Осознанно оставлено вне Stage 14.1:

- Atlas tools/checklists/calculators operational depth
- place subroutes (reviews/partners/nearby-services) как dense surfaces
- расширение themes corpus под JP/KR на full depth
- любой authority-like enrichment (verification/proof style layers)

## Final Readiness Verdict

`COMPLETE_STAGE_14_1_ATLAS_PLACES_GUIDES_SEED_BOUNDED_PASS`

Stage 14.1 закрыт как bounded Atlas seeding slice:

- Atlas визуально плотнее и ближе к living discovery ecosystem;
- governance semantics сохранены;
- runtime/API/schema/OpenAPI drift отсутствует;
- готово к следующему bounded этапу Stage 14.x без перехода в fake fully-operational authority platform.

