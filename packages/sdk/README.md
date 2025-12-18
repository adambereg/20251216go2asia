# @go2asia/sdk

Auto-generated API client SDK from OpenAPI specifications.

## Usage

```typescript
import { getAuthProfile, getContentPlaces } from '@go2asia/sdk';

// Use the generated SDK functions
const profile = await getAuthProfile({
  headers: { Authorization: `Bearer ${token}` }
});
```

## Regeneration

SDK is generated automatically from OpenAPI specs:

```bash
pnpm gen:sdk
```

This runs Orval to generate SDK from `docs/openapi/*.yaml` files.





