# Go2Asia Bangkok Pilot Non-Write Smoke Check Plan v1

Status: verification-only (no writes)  
Scope: Bangkok pilot (`districts/containers/place linkage`)  
Mode: read-only checks for staging

## 1) Preconditions

- Use staging API base URL.
- Do not call any `POST/PUT/PATCH/DELETE` endpoints.
- Keep request headers minimal (no mutation auth flows needed).

## 2) API Checks

### SC-API-001 — City districts

- Request:
  - `GET /v1/content/cities/bangkok/districts`
- Expected:
  - HTTP `200`
  - `items` is array
  - contains 8 slugs:
    - `bang-kho-laem`
    - `sathon`
    - `chatuchak`
    - `samphanthawong`
    - `phra-nakhon`
    - `khlong-san`
    - `bang-rak`
    - `bangkok-yai`
  - each item has `id`, `cityId`, `slug`, `name`, `isPublished`

### SC-API-002 — City containers

- Request:
  - `GET /v1/content/cities/bangkok/containers`
- Expected:
  - HTTP `200`
  - `items` is array
  - contains 7 slugs:
    - `asiatique-the-riverfront`
    - `chatuchak-weekend-market`
    - `chinatown-bangkok`
    - `grand-palace`
    - `iconsiam`
    - `state-tower`
    - `banyan-tree-bangkok`
  - each item has `districtId`, `containerType`, `isPublished`

### SC-API-003 — Place linkage (Grand Palace)

- Request:
  - `GET /v1/content/places/bkk-grand-palace`
- Expected:
  - HTTP `200`
  - `slug = bkk-grand-palace`
  - `districtSlug = phra-nakhon`
  - `containerSlug = grand-palace`
  - new linkage fields are present:
    - `districtId`
    - `districtSlug`
    - `districtName`
    - `containerId`
    - `containerSlug`
    - `containerName`
    - `containerType`

## 3) UI Check

### SC-UI-001 — Bangkok districts tab

- Route:
  - `/atlas/cities/bangkok/districts`
- Expected:
  - page renders without runtime error
  - shows structured district cards (not only markdown tab body)
  - district card list includes `Phra Nakhon`, `Sathon`, `Bang Rak` at minimum
  - if API temporarily fails, page falls back to legacy tab content (bridge behavior)

## 4) Optional one-liners (curl)

```bash
curl -sS "$API_BASE/v1/content/cities/bangkok/districts" | jq '.items | length'
curl -sS "$API_BASE/v1/content/cities/bangkok/containers" | jq '.items | length'
curl -sS "$API_BASE/v1/content/places/bkk-grand-palace" | jq '{slug,districtSlug,containerSlug,districtId,containerId}'
```

## 5) Pass / Fail rule

- Pass if all 4 checks (`SC-API-001..003`, `SC-UI-001`) succeed.
- Fail if any target endpoint returns non-200, expected Bangkok slugs are missing, or UI cannot render structured district cards.
