# @go2asia/sdk

Gateway-facing SDK helpers for Go2Asia.

The package exposes:

- stable hand-written helpers from the root import `@go2asia/sdk` as namespaced modules
- low-level generated OpenAPI types under `@go2asia/sdk` as `generated`
- direct subpath imports such as `@go2asia/sdk/content` or `@go2asia/sdk/media`

## Usage

```typescript
import { content, balance, media, generated } from '@go2asia/sdk';

const countries = await content.listCountries();
const upload = await media.createMediaUploadToken({
  scope: 'space',
  filename: 'cover.jpg',
  contentType: 'image/jpeg',
});

type UserBalance = generated.UserBalance;
```

## Extension strategy

- add root exports only for real gateway endpoints that already exist
- keep Phase 2 service additions (`space`, `quest`, `rielt`, `guru`, `rf`) out of the SDK until their `/v1/*` routes are real
- keep generated artifacts synchronized via `pnpm gen:sdk`

## Regeneration

```bash
pnpm openapi:bundle
pnpm gen:types
pnpm gen:sdk
```







