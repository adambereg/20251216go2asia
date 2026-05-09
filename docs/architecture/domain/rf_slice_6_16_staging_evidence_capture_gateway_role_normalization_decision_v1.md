# RF Slice 6.16 - Staging Evidence Capture & Gateway Role Normalization Decision v1

## 1. Purpose

Slice 6.16 captures and documents the role-normalization evidence needed before enabling Role/VIP adapter semantics broadly in staging.

The goal is to compare real gateway JWT role shapes with RF auth normalization, paid ordinary claim VIP gate behavior, and preview adapter semantics without changing runtime product behavior.

This slice is decision and validation work. It is not an entitlement feature, enforcement rollout, or production rollout.

## 2. Non-goals

Not included:
- claim enforcement;
- claim/redeem runtime changes;
- Wallet/NFT/G2A integration;
- backend role reconciliation implementation;
- DB migrations;
- SDK/OpenAPI edits;
- new UI features;
- analytics platform;
- external telemetry platform;
- production rollout changes.

Not changed:
- preview safe DTO;
- preview copy;
- badge behavior;
- observability bucket names;
- current claim runtime;
- current public routes.

## 3. Current Normalization Flows

### Gateway Extraction

The API gateway currently derives a canonical role from Clerk payloads in this order:

1. `role`
2. `go2_role`
3. `public_metadata.role`
4. `publicMetadata.role`
5. first normalizable entry in `roles[]`
6. default `spacer`

It then signs an internal `X-Gateway-Auth` JWT with:
- canonical `role`;
- `roles` from the original payload when present;
- fallback `[platformRole]` when no roles array exists.

Aliases recognized by gateway normalization:
- `vip`, `vip-spacer`, `vip_spacer` -> `vip_spacer`;
- `member`, `user`, `spacer` -> `spacer`;
- `admin` -> `admin`;
- `pro` -> `pro`.

### RF Auth

RF auth reads the internal gateway JWT:
- `role` wins when normalizable;
- otherwise first normalizable `roles[]` value wins;
- otherwise defaults to `spacer`.

Because gateway sends canonical `role`, RF usually follows gateway's platform role decision.

### Paid Ordinary VIP Gate

The paid ordinary voucher VIP gate considers a principal VIP only when:
- `platformRole === 'vip_spacer'`; or
- raw `roles[]` contains an exact `vip_spacer` string after trim/lowercase.

It does not currently treat `vip` or `vip-spacer` aliases in `roles[]` as VIP unless those aliases already influenced `platformRole`.

### Role/VIP Preview Contract

The preview adapter contract normalizes:
- primary `platformRole`;
- every role in `roles[]`.

For `vip_status`, preview treats the user as VIP when either:
- normalized primary role is `vip_spacer`; or
- any normalized role in the array is `vip_spacer`.

Admin and PRO do not imply VIP by themselves.

## 4. Staging Evidence Capture

Slice 6.16 adds a safe internal helper:

```text
apps/rf-service/src/roleNormalizationEvidence.ts
```

The helper creates sanitized snapshots from staging-like role payloads. It does not expose public routes and does not decode raw JWT tokens.

Allowed evidence:
- presence of `role`;
- presence of `roles`;
- presence of `go2_role`;
- presence of `public_metadata.role`;
- presence of `publicMetadata.role`;
- normalized role tokens;
- canonicalization result;
- selected gateway role source;
- role array order;
- role/roles conflicts;
- preview-vs-claim alignment classification.

Forbidden evidence:
- raw JWT tokens;
- emails;
- user identifiers;
- auth secrets;
- session tokens;
- wallet/NFT/G2A data.

Snapshot safety fields:
- `containsRawJwt: false`;
- `containsPii: false`;
- no subject/user id fields;
- deterministic schema version.

## 5. Gateway/RF/Preview Comparison

The comparison helper models four layers:

1. **Gateway extraction**
   - chooses canonical `platformRole`;
   - records source: `role`, `go2_role`, metadata role, `roles[]`, or default.

2. **RF auth**
   - derives RF principal platform role from gateway internal payload.

3. **Claim VIP gate**
   - checks current paid ordinary VIP logic without changing it.

4. **Preview adapter**
   - runs Role/VIP contract semantics for `vip_status`.

Classification:
- `aligned`: preview and claim agree on VIP capability;
- `preview_grants_claim_rejects`: preview sees VIP, current claim gate would reject;
- `claim_allows_preview_requires_condition`: current claim gate would allow, preview would not.

## 6. Known Divergences

### Alias In Roles Array

Payload shape:

```json
{ "role": "spacer", "roles": ["VIP"] }
```

Current behavior:
- gateway platform role: `spacer`;
- RF platform role: `spacer`;
- claim gate: not VIP because `roles[]` lacks exact `vip_spacer`;
- preview adapter: VIP because `VIP` normalizes to `vip_spacer`.

Classification: `preview_grants_claim_rejects`.

### Exact `vip_spacer` In Roles Array

Payload shape:

```json
{ "role": "spacer", "roles": ["vip_spacer"] }
```

Current behavior:
- gateway platform role: `spacer`;
- claim gate: VIP because raw roles contain exact `vip_spacer`;
- preview adapter: VIP.

Classification: `aligned`, although role/roles conflict exists.

### Roles Array Order

Payload shape:

```json
{ "roles": ["member", "admin"] }
```

Current behavior:
- gateway chooses first normalizable role: `member` -> `spacer`;
- admin is present but does not become platform role;
- claim and preview both treat the user as non-VIP.

Classification: `aligned`, but order-sensitive and policy-ambiguous.

### Metadata Role Precedence

Payload shape:

```json
{ "go2_role": "pro", "public_metadata": { "role": "vip_spacer" }, "roles": ["vip_spacer"] }
```

Current behavior:
- `go2_role` wins as platform role;
- raw `roles[]` can still satisfy claim VIP gate;
- preview also sees VIP through normalized roles.

Classification: `aligned`, but source precedence is ambiguous and must be policy-owned.

## 7. Canonical Normalization Proposal

Recommended policy, not yet applied as runtime change:

1. **Single Source Of Normalization Truth**
   - define one shared helper for gateway, RF auth, preview, and future backend role reads;
   - keep it pure and fixture-driven;
   - eventually move it to a shared package when multiple services consume it.

2. **Canonical Source Precedence**
   - prefer an explicitly owned platform role claim over arbitrary array order;
   - recommended precedence: gateway-normalized platform role from trusted claim, then roles array only as capability hints;
   - do not let first array order silently decide privilege when multiple canonical roles exist.

3. **VIP Detection**
   - preview and claim should eventually share the same VIP detection helper;
   - aliases should be normalized before VIP detection;
   - until that migration is approved, preview remains informational and claim remains the source of enforcement behavior.

4. **Admin/PRO Semantics**
   - admin does not imply VIP;
   - PRO does not imply VIP;
   - mixed arrays may imply VIP only when a VIP role is explicitly present and normalized.

5. **Conflict Handling**
   - conflicts between platform role and role array should be captured as evidence;
   - for preview, conflicts may degrade once backend reconciliation exists;
   - for claim, no runtime change is approved in this slice.

## 8. Drift Handling Policy

Current drift handling remains preview-only:
- gateway/backend mismatch -> temporary preview;
- malformed backend snapshot -> policy fallback / temporary preview;
- missing backend snapshot -> gateway-only preview semantics;
- unknown role -> safe unavailable or condition state depending on gateway defaults.

Future backend reconciliation should:
- compare gateway platform role with backend role snapshot;
- degrade preview on conflict;
- never expose raw conflict details in safe DTO or observability;
- remain outside claim runtime until a separate enforcement design is approved.

## 9. Operational Guidance

### Staging JWT Shape Validation

For each staged account cohort, capture sanitized evidence for:
- regular;
- VIP;
- admin;
- PRO;
- mixed roles;
- malformed/missing role fields;
- `role` vs `roles[]` conflicts;
- `go2_role` / metadata role combinations.

Do not capture:
- raw JWT;
- email;
- user id;
- auth/session secrets.

### Preview vs Claim Comparison

For paid ordinary test offers:
1. Run preview with Role/VIP adapter flags enabled.
2. Run claim only in approved staging test paths.
3. Compare:
   - preview state;
   - claim result;
   - sanitized evidence alignment.
4. Treat `preview_grants_claim_rejects` as unresolved policy risk, not an automatic bug.

### Rollback Triggers

Rollback adapter flags if:
- unsafe fields appear in preview payloads;
- claim/redeem behavior changes while only preview flags changed;
- preview starts returning new states;
- staging evidence shows unexpected `preview_grants_claim_rejects` for common production cohorts;
- role array order causes surprising platform roles.

## 10. Regression Test Coverage

Added tests cover:
- top-level VIP alias;
- `role: spacer` with `roles: ["VIP"]`;
- `role: spacer` with `roles: ["vip_spacer"]`;
- order-sensitive roles array;
- `go2_role` precedence over public metadata and roles;
- public metadata role fallback;
- missing role defaulting to spacer;
- malformed top-level role falling through to roles;
- preview-vs-claim divergence classification.

These tests document current behavior. They do not change runtime policy.

## 11. What Remains Experimental

Still experimental:
- live staging evidence collection process;
- backend role snapshot reconciliation;
- shared normalization package;
- claim/preview normalization convergence;
- policy for resolving role/roles conflicts;
- enforcement use of Role/VIP adapter output.

## 12. Risks

Remaining risks:
- real Clerk payloads may differ from simulated payloads;
- role array order may encode lower privilege before higher privilege;
- claim and preview can disagree on aliases in `roles[]`;
- metadata role precedence is not yet product-owned;
- shared helper migration can affect enforcement if done too broadly;
- evidence capture can become sensitive if raw auth data is logged by mistake.

Mitigations:
- keep evidence sanitized and deterministic;
- keep adapter flags default-off until staging evidence is reviewed;
- keep claim runtime unchanged;
- keep preview informational;
- require explicit policy decision before changing `isVipSpacerPrincipal`;
- use regression tests to freeze current divergence before migration.

## 13. Future Migration Path

Recommended next steps:
1. Capture sanitized staging evidence for real gateway JWT shapes.
2. Decide whether `role`, `go2_role`, metadata role, or roles array is the canonical source of platform role.
3. Decide whether claim VIP gate should normalize aliases in `roles[]`.
4. Extract a shared normalization helper only after the policy decision is approved.
5. Update gateway, RF auth, preview adapter, and claim gate in a dedicated migration slice.
6. Keep backend reconciliation preview-only until a separate enforcement rollout is designed.
