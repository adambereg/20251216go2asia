# API Gateway

API Gateway for Go2Asia MVP (Cloudflare Worker).

## Features

- Request routing to backend microservices
- Health checks (`/health`, `/ready`)
- RequestId propagation
- Structured logging

## Development

```bash
# Start local development server
pnpm dev

# Deploy to Cloudflare Workers
pnpm deploy
```

## Environment Variables

Set via Cloudflare Dashboard or `wrangler secret`:

- `AUTH_SERVICE_URL` - Internal Auth Service URL
- `CONTENT_SERVICE_URL` - Internal Content Service URL
- `MEDIA_SERVICE_URL` - Optional dedicated Media Service URL; if unset, the canonical public contract `/v1/media/*` temporarily falls back to `CONTENT_SERVICE_URL`
- `POINTS_SERVICE_URL` - Internal Points Service URL
- `REFERRAL_SERVICE_URL` - Internal Referral Service URL
- `CLERK_SECRET_KEY` - Clerk server key used by `@clerk/backend` to verify user JWT via Clerk JWKS
- `SERVICE_JWT_SECRET` - Service-to-service JWT secret

## Routes

- `/health` - Health check endpoint
- `/ready` - Readiness check endpoint
- `/v1/auth/*` - Routes to Auth Service
- `/v1/content/*` - Routes to Content Service
- `/v1/media/*` - Canonical public media contract; currently proxied to Media Service when configured, otherwise temporarily bridged to Content Service media routes as a transitional implementation detail
- `/v1/points/*` - Routes to Points Service
- `/v1/referral/*` - Routes to Referral Service
- `/v1/space/*`, `/v1/quest/*`, `/v1/rielt/*`, `/v1/guru/*`, `/v1/rf/*` - Reserved Phase 2 prefixes; gateway returns `501 ROUTE_RESERVED_NOT_ENABLED` until corresponding `*_SERVICE_URL` is configured, then begins proxying

## Trust Contract

- `api-gateway` is the only service that verifies Clerk user JWTs.
- For protected user routes, gateway mints an internal HS256 token signed with `SERVICE_JWT_SECRET`.
- Downstream services trust only `X-Gateway-Auth`.
- `X-User-ID` may still be forwarded as a derived/debug header during migration, but it is not a trust source.
- The current `/v1/media/* -> content-service` bridge is transitional and does not redefine the long-term service boundary.
- Other future Phase 2 prefixes must not copy this alias/fallback approach unless explicitly approved as a separate architectural decision.

## Internal Request Context Skeleton

- `api-gateway` maintains an internal request-context skeleton for future quota, rate-limit, anti-abuse, and AI-usage hooks.
- Current fields such as `routeKey`, `routeGroup`, `clientIpHash`, `userAgentHash`, `quotaKey`, and `abuseKey` are internal-only gateway data.
- These fields are not part of the downstream trust contract and are not forwarded as headers.
- This does not activate a real rate-limit or abuse-prevention layer yet; it only establishes a platform-ready skeleton.







