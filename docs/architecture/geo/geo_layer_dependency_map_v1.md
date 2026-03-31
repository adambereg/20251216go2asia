# Geo Layer Dependency Map v1

**Status:** SSOT/reference fixation  
**Scope:** dependency map around canonical geo-layer and adjacent domain layers  
**Type:** architecture/reference only

---

## 1. Purpose

Этот документ фиксирует зависимостную карту вокруг geo-layer в Go2Asia, чтобы:

- явно зафиксировать ownership boundaries;
- отделить ownership от reference/adoption;
- предотвратить ownership drift между Atlas, RF и downstream-модулями;
- зафиксировать границы между geo identity, business presence и domain core truth соседних контуров.

Документ не является implementation plan, не заменяет execution/status anchor и не утверждает полную runtime-завершенность всех интеграций.

---

## 2. Core formula

Базовая формула карты:

`Atlas -> RF -> Pulse / Rielt / Quest / Space`

Эта формула не означает, что RF является супермодулем или owner всех downstream-сценариев.

Правильная интерпретация:

- Atlas отвечает на вопрос: где;
- RF отвечает на вопрос: какой business/partner actor действует в этой географии;
- Pulse отвечает на вопрос: что происходит;
- Rielt отвечает на вопрос: что сдается/продается;
- Quest отвечает на вопрос: что можно пройти/выполнить;
- Space отвечает на вопрос: что люди публикуют/обсуждают/распространяют.

Следовательно, RF — это межмодульный business/partner attachment layer между canonical geo и business-linked downstream-сценариями, а не "верхний слой над всеми".

---

## 3. Core ownership split

### Atlas owns

- canonical geo identity;
- `country / city / district / container / place` hierarchy;
- place truth;
- canonical geo anchors.

### RF owns

- partner/business presence;
- partner branch attachment semantics;
- offer/voucher lifecycle semantics;
- partner verification/visibility semantics;
- partner/pro operational linkage.

### Pulse owns

- event lifecycle;
- event truth.

### Rielt owns

- listing/property lifecycle;
- inquiry truth.

### Quest owns

- progression/proof/execution truth.

### Space owns

- social publication/distribution truth.

---

## 4. Layered dependency model

### 4.1 Layer 1 — Canonical geo substrate (Atlas)

Atlas — корневой authoritative layer для geo identity.

Остальные модули могут:

- ссылаться на `country/city/district/container/place`;
- использовать place/geo anchors;
- строить свои доменные сценарии поверх canonical geo refs.

Остальные модули не должны:

- создавать параллельную geo identity;
- переопределять place truth;
- напрямую мутировать Atlas truth;
- подменять canonical hierarchy собственными ad hoc моделями.

Atlas boundary:

- Atlas владеет geo/place truth;
- Atlas не владеет business presence, event truth, listing/property truth, quest progression/proof truth и social publication truth.

### 4.2 Layer 2 — Business/partner attachment layer (RF)

RF опирается на Atlas и добавляет business semantics поверх canonical geo anchors.

RF:

- использует Atlas geo truth по ссылкам;
- не утверждает geo identity;
- не становится geo-service;
- не владеет event/listing/quest/social truth;
- не превращается в universal business god-module.

Короткая формула:

- Atlas = geo identity;
- RF = business presence attached to geo identity.

### 4.3 Layer 3 — Downstream domain layers

#### Pulse

- использует canonical geo для event location grounding;
- использует RF context там, где событие связано с partner/business attachment;
- владеет event lifecycle/event truth.

Boundary:

- Pulse не передает event ownership в RF;
- RF не владеет event lifecycle;
- Atlas не владеет event lifecycle.

#### Rielt

- использует canonical geo refs для listing location semantics;
- использует RF layer для partner/trust/business context там, где это требуется;
- владеет listing/inquiry/property lifecycle.

Boundary:

- не изобретает собственный partner/business identity layer;
- не строит отдельную hybrid district/business model в обход `Atlas + RF`;
- не подменяет RF в зоне trust/partner/business semantics.

#### Quest

- использует canonical geo refs для location-bound steps/targets;
- использует RF branch/offer/voucher context для business-linked experiences;
- владеет progression/proof/execution lifecycle.

Boundary:

- не строит собственную partner/business identity;
- не создает параллельный business-linked venue layer;
- не заменяет RF в voucher/offer/business identity semantics.

#### Space

- циркулирует ссылки на geo/domain entities;
- циркулирует RF-related entities;
- строит social surfaces вокруг events/listings/quests/partners;
- владеет social publication/distribution truth.

Boundary:

- не владеет geo identity;
- не владеет partner/business source truth;
- не владеет listing/event/quest truth.

Space — circulation/social layer, а не source-of-truth layer.

---

## 5. Dependency graph (plain form)

```text
Atlas
  ├─ provides canonical geo identity to RF
  ├─ provides canonical geo identity to Pulse
  ├─ provides canonical geo identity to Rielt
  ├─ provides canonical geo identity to Quest
  └─ provides canonical geo identity to Space (reference-only where relevant)

RF
  ├─ consumes Atlas geo/place truth
  ├─ provides partner/business context to Pulse
  ├─ provides partner/trust/offer context to Rielt
  ├─ provides branch/offer/voucher context to Quest
  └─ provides partner/business-linked entities for Space circulation

Pulse
  └─ may reference Atlas + RF, but owns events

Rielt
  └─ may reference Atlas + RF, but owns listings/inquiries

Quest
  └─ may reference Atlas + RF, but owns progression/proof

Space
  └─ may reference Atlas + RF + downstream entities, but owns only social publication/distribution
```

---

## 6. Allowed reference flows

Разрешены:

- `Atlas -> RF`: canonical geo anchors for partner branch/location semantics;
- `Atlas -> Pulse`: canonical geo grounding for event location semantics;
- `Atlas -> Rielt`: canonical geo grounding for listing location semantics;
- `Atlas -> Quest`: canonical geo grounding for step/target semantics;
- `Atlas -> Space`: reference-only geo linkage where social surface points to geo-linked entities;
- `RF -> Pulse`: partner/business context by reference;
- `RF -> Rielt`: trust/partner/offer context by reference;
- `RF -> Quest`: branch/voucher/eligibility context by reference;
- `RF -> Space`: circulation/projection of partner/business-linked entities;
- `Pulse / Rielt / Quest -> Space`: circulation of domain-owned entities into social layer.

General rule: references допустимы, ownership transfer запрещен.

---

## 7. Prohibited patterns

Запрещены:

- RF writes Atlas geo truth;
- RF as geo-service;
- RF owns Pulse event truth;
- RF owns Rielt listing/inquiry truth;
- RF owns Quest progression/proof truth;
- RF owns Space social truth;
- Pulse invents partner/business identity outside RF;
- Rielt invents standalone partner/business layer bypassing RF;
- Quest invents standalone partner/business identity bypassing RF;
- Space as source of geo/business truth;
- direct cross-service table writes between bounded contexts;
- shared mutable ownership of one и той же business entity across modules.

---

## 8. Responsibility boundary formula

Самая короткая формула границ:

- Atlas заканчивается там, где заканчивается geo identity;
- RF начинается там, где к canonical geo anchor привязывается business/partner presence, и заканчивается там, где начинается core lifecycle другого домена;
- Pulse начинается там, где появляется event truth;
- Rielt начинается там, где появляется listing/inquiry/property lifecycle;
- Quest начинается там, где появляется task/progression/proof/execution truth;
- Space начинается там, где появляется social publication/circulation truth.

---

## 9. Sequencing note

С учетом уже зафиксированных geo и RF документов sequencing формулируется так:

1. Atlas geo canon fixation  
2. RF SSOT/boundary fixation  
3. Downstream adoption in Pulse/Rielt/Quest/Space  
4. Further cross-module alignment passes

Practical implication:

- Pulse может принимать geo canon относительно рано; RF для него чаще выступает как optional business-context layer;
- Rielt и Quest должны развиваться с учетом RF boundary, иначе возникает риск параллельных partner/business моделей;
- Space подключается как circulation layer, а не как новый owner.

---

## 10. Anti-drift summary

Guardrail карты:

- Atlas остается owner canonical geo identity;
- RF остается owner partner/business presence;
- downstream-модули владеют только своими core lifecycles;
- интеграция идет через stable refs/contracts, а не через shared ownership.

---

## 11. Short version

Если свести карту к одной формуле:

- Atlas owns where;
- RF owns who-in-business acts there;
- Pulse owns what happens there;
- Rielt owns what is offered there as property;
- Quest owns what can be done or completed there;
- Space owns what people say/share about all of the above.

---

## 12. What this document does NOT decide

Этот документ:

- не является implementation roadmap;
- не заменяет execution/status anchor;
- не утверждает full runtime conformance всех модулей;
- не фиксирует endpoint-level API contracts;
- не делает RF god-module;
- не вводит новый geo-service;
- не переносит ownership соседних доменов в Atlas или RF.
