# Quest <-> RF Bounded Implementation Slice v1

## Purpose

Реализовать минимальный, консервативный `Quest <-> RF` implementation slice без redesign:

- выровнять `targetType` контракт с runtime/DB;
- сделать `visit_partner` шов более machine-readable и runtime-safe;
- не переносить RF business/voucher lifecycle в Quest;
- сохранить Atlas geo canon и ownership split.

## Included in slice

- `targetType` harmonization в Quest OpenAPI и runtime:
  - введён закрытый enum `QuestStepTargetType` (`place`, `event`, `partner`, `space_post`);
  - `QuestStepResponse.targetType` и `AddQuestStepRequest.targetType` приведены к enum.
- Minimal machine-readable RF seam для `visit_partner`:
  - в OpenAPI зафиксировано, что `visit_partner` использует `targetType=partner`;
  - добавлена machine-readable привязка к stable RF partner reference policy.
- Minimal validation guardrail:
  - runtime принимает только допустимые target types;
  - `targetId` для шагов проходит opaque-ref guardrail (непустой token без пробелов, max 80);
  - `visit_partner` требует `targetId` как stable RF partner reference.
- Точечные тесты на новые guardrails.

## Explicitly out of scope

- branch-level интеграция;
- voucher/offer lifecycle orchestration;
- eligibility/redeem hooks;
- cross-service RF lookup orchestration;
- redesign Quest или RF domain model;
- изменения в Rielt slice.

## What was changed

- `apps/quest-service/src/db/queries/quest.ts`
  - введён `QuestTargetType`;
  - `quest_step.target_type` и insert input приведены к typed union.
- `apps/quest-service/src/services/questService.ts`
  - добавлен whitelist `QUEST_TARGET_TYPES`;
  - `targetType` parsing harmonized к enum;
  - `targetId` переведён на minimal opaque-ref parser (без пробелов);
  - `visit_partner` guardrail усилен сообщением про stable RF partner reference.
- `docs/openapi/quest.yaml`
  - добавлен `QuestStepTargetType` schema;
  - `targetType` в request/response переведён на enum;
  - для `AddQuestStepRequest` добавлен `if/then` guardrail для `visit_partner`;
  - добавлен `x-go2asia-quest-rf` с ссылкой на RF stable ref policy.
- `apps/quest-service/test/request.test.ts`
  - добавлены тесты на unsupported `targetType` и на non-opaque `visit_partner.targetId`.

## Boundary safety checks

- Quest остаётся owner progression/proof/execution truth.
- RF не получает ownership над quest lifecycle.
- Voucher/offer lifecycle не переносится в Quest.
- Atlas geo canonical слой не затронут и не ослаблен.
- Шов `visit_partner` стал более явным и машинно интерпретируемым без deep integration.

## Remaining deferred zones

- full endpoint-level `Quest <-> RF` contract suite;
- branch-level seams;
- event payload enrichment (`stepTargetType` / `stepTargetId`) как отдельный bounded шаг;
- cross-service existence checks against RF runtime;
- eligibility/redeem orchestration.
