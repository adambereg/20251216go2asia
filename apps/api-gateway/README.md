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
- `POINTS_SERVICE_URL` - Internal Points Service URL
- `REFERRAL_SERVICE_URL` - Internal Referral Service URL
- `CLERK_JWT_SECRET` - Clerk JWT verification secret
- `SERVICE_JWT_SECRET` - Service-to-service JWT secret

## Routes

- `/health` - Health check endpoint
- `/ready` - Readiness check endpoint
- `/v1/auth/*` - Routes to Auth Service
- `/v1/content/*` - Routes to Content Service
- `/v1/points/*` - Routes to Points Service
- `/v1/referral/*` - Routes to Referral Service





