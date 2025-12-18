# @go2asia/schemas

Zod schemas for runtime validation in Go2Asia services.

## Usage

```typescript
import { RequestIdSchema, PaginationSchema } from '@go2asia/schemas';

// Validate request ID
const requestId = RequestIdSchema.parse(request.headers.get('X-Request-ID'));

// Validate pagination params
const pagination = PaginationSchema.parse(queryParams);
```

## Purpose

These schemas provide runtime validation at API Gateway and service boundaries.
They should match the types generated from OpenAPI specs in `@go2asia/types`.





