# Rielt <-> RF Bounded Implementation Slice v1

## Purpose

Реализовать минимальный practically useful `Rielt <-> RF` срез без redesign:

- выровнять базовый контрактный baseline;
- добавить optional RF reference seam в Rielt;
- сохранить Atlas geo canon как первичный substrate;
- не нарушать ownership boundaries (`Rielt` owner listing/inquiry truth, `RF` owner business/partner truth).

## Included in slice

- Contract consistency fix: `my/inquiries` теперь возвращает `listing.geo` в форме, согласованной с `RieltGeo` (`atlasPlaceId` / `atlasContainerPlaceId`).
- Optional RF refs only в `rielt_listing`:
  - `rf_partner_id` (nullable),
  - `rf_offer_id` (nullable).
- Minimal validation guardrail для RF refs:
  - trim + non-empty if present,
  - max length 80,
  - no whitespace token format,
  - локальный инвариант: `rf_offer_id` допустим только вместе с `rf_partner_id`.
- Narrow contract sync:
  - `docs/openapi/rielt.yaml` обновлён под optional RF refs и owner response rf context.

## Explicitly out of scope

- Mandatory RF integration for all listings.
- Branch-level integration / `rf_branch_id`.
- Runtime RF lookups / cross-service orchestration validation.
- Перенос business lifecycle внутрь Rielt.
- Любой redesign Atlas/RF/Rielt domain ownership.
- Quest-related integration.

## What was changed

- `apps/rielt-service/src/db/queries/listingQueries.ts`
  - добавлены `rf_partner_id` / `rf_offer_id` в owner listing storage/read/update path;
  - `listMyInquiries` расширен atlas geo полями листинга для OpenAPI-consistent ответа.
- `apps/rielt-service/src/validation/rielt.ts`
  - добавлены optional RF refs в create/patch payload parsing;
  - добавлен минимальный format guardrail и локальная зависимость `rf_offer_id -> rf_partner_id`.
- `apps/rielt-service/src/services/rieltService.ts`
  - owner listing DTO расширен `rfContext` (`rfPartnerId`, `rfOfferId`);
  - create/patch flow прокидывает optional RF refs;
  - patch flow получил runtime guardrail `rf_offer_id requires rf_partner_id`.
- `packages/db/src/schema/rielt.ts`
  - добавлены nullable поля `rf_partner_id`, `rf_offer_id`;
  - добавлены check constraints для минимального guardrail.
- `packages/db/migrations/0038_rielt_rf_refs_optional_v1.sql`
  - миграция для optional RF refs и check constraints.
- `docs/openapi/rielt.yaml`
  - добавлены optional `rf_partner_id` / `rf_offer_id` в create/patch request schemas;
  - добавлен `RieltRfContext` в owner listing response.
- `docs/openapi/openapi.bundle.yaml`
  - regenerated после изменений OpenAPI.

## Boundary safety checks

- RF refs остаются optional; RF не становится silently mandatory.
- Atlas geo grounding не заменён и не ослаблен; RF refs добавлены поверх geo слоя.
- Rielt не начал хранить/мутировать RF business lifecycle.
- Cross-service direct writes и runtime RF dependency orchestration не добавлены.
- Локальные guardrails ограничены форматом и внутренней согласованностью ссылки.

## Remaining deferred zones

- Branch-level seam (`rf_branch_id`) и branch contract rollout.
- Любая trust/verification deep logic внутри Rielt.
- Machine-readable endpoint-level Rielt↔RF contract suite beyond this minimal slice.
- Runtime existence checks against RF service.
