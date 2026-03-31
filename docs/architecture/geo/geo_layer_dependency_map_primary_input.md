# Geo-Layer Dependency Map v1

**Status:** architecture/reference draft for repo adoption  
**Scope:** dependency map around canonical geo-layer and adjacent business/domain modules  
**Type:** architecture/reference only

---

## 1. Purpose

Этот документ фиксирует зависимостную карту модулей вокруг geo-layer в Go2Asia, чтобы:

- явно показать границы ответственности;
- отделить ownership от reference/adoption;
- предотвратить ownership drift между Atlas, RF и downstream-модулями;
- зафиксировать, где проходит граница между geo identity, business presence и core truth соседних доменов.

Документ не является implementation plan, не заменяет execution/status anchor и не утверждает полную runtime-завершённость всех интеграций.

---

## 2. Core formula

Базовая формула карты выглядит так:

**Atlas → RF → Pulse / Rielt / Quest / Space**

Но эта формула не означает, что RF является супермодулем или owner всех downstream-сценариев.

Правильная интерпретация:

- **Atlas** отвечает на вопрос: **где**
- **RF** отвечает на вопрос: **какой business/partner actor действует в этой географии**
- **Pulse** отвечает на вопрос: **что происходит**
- **Rielt** отвечает на вопрос: **что сдаётся / продаётся**
- **Quest** отвечает на вопрос: **что можно пройти / выполнить**
- **Space** отвечает на вопрос: **что люди публикуют / обсуждают / распространяют**

Следовательно, RF — это не “верхний слой над всеми”, а **межмодульный business/partner attachment layer** между canonical geo и business-linked downstream-сценариями.

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
- offer / voucher lifecycle;
- partner verification / visibility semantics;
- partner/pro operational linkage.

### Pulse owns

- event lifecycle;
- event truth.

### Rielt owns

- listing / property lifecycle;
- inquiry truth.

### Quest owns

- progression / proof / execution truth.

### Space owns

- social publication / distribution truth.

---

## 4. Layered dependency model

## 4.1 Layer 1 — Canonical geo substrate

### Atlas

Atlas — это корневой authoritative layer для geo identity.

Все остальные модули могут:

- ссылаться на `country/city/district/container/place`;
- использовать place/geo anchors;
- строить свои сценарии поверх canonical geo refs.

Все остальные модули не должны:

- создавать параллельную geo identity;
- переопределять place truth;
- мутировать Atlas truth напрямую;
- подменять canonical hierarchy собственными ad hoc моделями.

### Atlas boundary

Atlas владеет **geo/place truth**, но не владеет:

- business presence;
- event truth;
- listing/property truth;
- quest progression/proof truth;
- social publication truth.

---

## 4.2 Layer 2 — Business/partner attachment layer

### RF

RF опирается на Atlas и добавляет поверх него business semantics.

RF не утверждает geo identity.  
RF утверждает, что на определённом canonical geo anchor присутствует business/partner actor и с ним связаны:

- branch presence;
- offer semantics;
- voucher lifecycle;
- verification / visibility;
- operational partner linkage.

### RF boundary

RF:

- использует Atlas geo truth по ссылкам;
- не становится geo-service;
- не владеет event/listing/quest/social truth;
- не превращается в universal business god-module.

Иными словами:

- **Atlas = geo identity**
- **RF = business presence attached to geo identity**

---

## 4.3 Layer 3 — Downstream domain modules

### Pulse

Pulse использует:

- canonical geo как основу для event location grounding;
- RF-context там, где событие связано с partner/business attachment.

Pulse остаётся owner:

- event lifecycle;
- event truth.

#### Pulse boundary

- Pulse не передаёт event ownership в RF.
- RF не владеет event lifecycle.
- Atlas не владеет event lifecycle.

---

### Rielt

Rielt использует:

- canonical geo refs для listing location semantics;
- RF layer для partner/trust/business context там, где это требуется.

Rielt остаётся owner:

- listing;
- inquiry;
- property lifecycle.

#### Rielt boundary

Rielt не должен:

- изобретать собственный partner/business identity layer;
- строить отдельную hybrid district/business model в обход `Atlas + RF`;
- подменять RF в зоне trust/partner/business semantics.

---

### Quest

Quest использует:

- canonical geo refs для location-bound steps/targets;
- RF branch/offer/voucher context для business-linked experiences.

Quest остаётся owner:

- progression;
- proof;
- execution lifecycle.

#### Quest boundary

Quest не должен:

- строить собственную partner/business identity;
- создавать параллельный business-linked venue layer;
- заменять RF в voucher/offer/business identity semantics.

---

### Space

Space может:

- циркулировать ссылки на places;
- циркулировать RF-related entities;
- публиковать social surfaces вокруг events/listings/quests/partners.

Space остаётся owner:

- social publication truth;
- social distribution/circulation truth.

#### Space boundary

Space не должен становиться owner:

- geo identity;
- partner/business source truth;
- listing truth;
- event truth;
- quest truth.

Space — это **circulation/social layer**, а не source-of-truth layer.

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

Разрешены следующие reference flows:

Atlas -> RF
canonical geo anchors for partner branch/location semantics
Atlas -> Pulse
canonical geo grounding for event location semantics
Atlas -> Rielt
canonical geo grounding for listing location semantics
Atlas -> Quest
canonical geo grounding for step/target semantics
Atlas -> Space
reference-only geo linkage where social surface points to geo-linked entities
RF -> Pulse
partner/business context by reference
RF -> Rielt
trust / partner / offer context by reference
RF -> Quest
branch / voucher / eligibility context by reference
RF -> Space
circulation/projection of partner/business-linked entities
Pulse / Rielt / Quest -> Space
circulation of domain-owned entities into social layer
General rule

Во всех случаях допустимы references, но не ownership transfer.

---

## 7. Prohibited patterns

Следующие паттерны запрещены:

RF writes Atlas geo truth;
RF becomes geo-service;
RF owns Pulse event truth;
RF owns Rielt listing/inquiry truth;
RF owns Quest progression/proof truth;
RF owns Space social truth;
Pulse invents partner/business identity outside RF;
Rielt invents standalone partner/business layer bypassing RF;
Quest invents standalone partner/business identity bypassing RF;
Space becomes source of geo/business truth;
direct cross-service table writes between bounded contexts;
shared mutable ownership of one and the same business entity across multiple modules.

---

## 8. Responsibility boundary formula

Самая короткая и важная формула границ ответственности:

Atlas boundary

Atlas заканчивается там, где заканчивается geo identity.

RF boundary

RF начинается там, где к canonical geo anchor привязывается business/partner presence,
и заканчивается там, где начинается core lifecycle другого домена.

Pulse boundary

Pulse начинается там, где появляется event truth.

Rielt boundary

Rielt начинается там, где появляется listing / inquiry / property lifecycle.

Quest boundary

Quest начинается там, где появляется task / progression / proof / execution truth.

Space boundary

Space начинается там, где появляется social publication / circulation truth.

---

## 9. Sequencing note

С учётом уже зафиксированных geo и RF документов sequencing выглядит так:

Atlas geo canon fixation
RF SSOT / boundary fixation
Downstream adoption in Pulse / Rielt / Quest / Space
Further cross-module alignment passes
Practical implication
Pulse может принимать geo canon относительно рано; RF для него чаще выступает как optional business-context layer.
Rielt и Quest должны развиваться уже с учётом RF boundary, иначе возникает риск параллельных partner/business моделей.
Space должен подключаться как circulation layer, а не как новый owner.

---

## 10. Anti-drift summary

Карта фиксирует следующий guardrail:

Atlas остаётся owner canonical geo identity;
RF остаётся owner partner/business presence;
downstream-модули владеют только своими core lifecycles;
integration проходит через stable refs/contracts, а не через shared ownership.

---

## 11. Short version

Если свести карту к одной формуле:

Atlas owns where
RF owns who-in-business acts there
Pulse owns what happens there
Rielt owns what is offered there as property
Quest owns what can be done or completed there
Space owns what people say/share about all of the above

---

## 12. What this document does NOT decide

Этот документ:

не является implementation roadmap;
не заменяет execution/status anchor;
не утверждает full runtime conformance всех модулей;
не фиксирует endpoint-level API contracts;
не делает RF god-module;
не вводит новый geo-service;
не переносит ownership соседних доменов в Atlas или RF.