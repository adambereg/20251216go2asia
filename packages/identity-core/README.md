# @go2asia/identity-core

Shared identity semantics contracts and golden fixture assets for Go2Asia.

## Purpose

This package contains the shared identity semantics contract for Go2Asia. It provides:
- schema v1 types and constants;
- golden fixture assets;
- fixture validation helpers;
- pure deterministic normalization helpers;
- package-level compatibility tests.

Implemented helpers:
- `normalizeRoleToken`;
- `extractPlatformRole`;
- `extractRoleCapabilities`;
- `isVipCapability`;
- `classifyRoleEvidence`;
- `normalizeRolePayload`.

## Non-goals

These helpers are not adopted by application runtime yet.

Do not use it as a runtime dependency from:
- API Gateway;
- RF service;
- PWA middleware;
- claim/redeem paths;
- paid VIP gate;
- Role/VIP preview adapter.

The package also does not include Clerk, DB, network, environment, logging, JWT signing, JWT verification, or enforcement behavior. `isVipCapability` is not a claim gate.

## Fixture Governance

Golden fixtures are compatibility anchors. Any change that modifies existing fixture outputs must be reviewed as an identity semantics change.

Fixture updates must preserve:
- `schemaVersion: 1` until a schema migration is approved;
- PII-free payloads;
- no raw JWT/session/token data;
- deterministic fixture ID ordering;
- explicit preview/claim divergence classification.

## Runtime Boundary

Runtime adoption is intentionally blocked in this slice. Future slices should first add compare-only tests/evidence before importing `@go2asia/identity-core` into gateway, RF, PWA, or claim code.
