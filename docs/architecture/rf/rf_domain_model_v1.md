# RF Domain Model v1

**Status:** SSOT / boundary fixation pass  
**Scope:** RF as partner/business layer over canonical geo  
**Type:** architecture/reference only (no implementation claims)

---

## 1. Purpose

Этот документ фиксирует доменную роль RF Asia в архитектуре Go2Asia:

- что RF владеет как доменный слой;
- чем RF не владеет;
- как RF связан с canonical geo;
- какие границы обязательны для стыковки с Pulse, Rielt, Quest, Space и Guru.

Документ задает boundary/reference-позицию и не является runtime implementation spec.

---

## 2. RF role in platform

RF Asia — это **business/partner layer** экосистемы:

- слой partner/business presence;
- слой partner attachment к canonical geo;
- слой partner-linked offer/voucher semantics;
- межмодульный слой для business-linked surfaces.

RF не является owner канонической geo identity и не подменяет Atlas как geo SSOT.

---

## 3. Current documented role (supported by docs)

На текущем документированном уровне RF:

- владеет partner profile/identity в рамках RF-домена;
- владеет partner representative и partner/business line semantics;
- владеет partner branch/location attachment semantics;
- владеет offer/voucher lifecycle semantics (`issue/claim/redeem/status`);
- владеет partner moderation/verification and visibility semantics;
- поддерживает partner/pro linkage как часть business workflows.

Эта роль согласована с cross-domain ownership baseline и текущими RF архитектурными документами.

---

## 4. RF ownership model

### 4.1 RF owns

- `partner` (бизнес-субъект в RF-контуре);
- `partner_representative`;
- `partner_business_line`;
- `partner_branch` (операционная business-presence точка);
- branch/business-line mapping;
- `offer`;
- `voucher` и его lifecycle;
- partner verification/moderation/visibility states;
- partner/pro operational linkage.

### 4.2 RF does not own

- canonical geo identity (`country/city/district/container/place`);
- Atlas place truth и place hierarchy;
- event lifecycle truth (Pulse);
- listing/property truth (Rielt);
- quest progression/proof truth (Quest);
- social publication truth (Space);
- cross-domain aggregation truth (Guru);
- points/ledger economics truth.

---

## 5. RF and canonical geo

### 5.1 Core rule

RF использует канонические geo references и не создает параллельную geo identity модель.

### 5.2 Branch geo anchoring

Для опубликованной partner branch требуется канонический geo anchor (обычно Atlas-linked place/host reference), а не только свободный текст.

### 5.3 Geo boundary

- Atlas владеет geo identity и иерархией;
- RF владеет business presence поверх этих geo anchors;
- downstream-модули используют link/reference семантику и не создают параллельные geo/business идентичности.

---

## 6. RF relation semantics (domain-level)

- `partner -> branch` (1:N);
- `partner -> business_line` (1:N);
- `branch <-> business_line` (N:M через mapping);
- `partner/branch -> offer` (1:N);
- `offer -> voucher` (1:N lifecycle artifacts);
- `partner -> pro_link` (0..N operational links);
- `branch -> canonical geo anchor` (Atlas-linked reference);
- optional cross-domain links: `offer/voucher <-> pulse_event`, `quest_context <-> voucher eligibility` (без передачи ownership).

---

## 7. Module interaction boundaries (RF-centric)

### Atlas
- RF читает canonical geo refs.
- RF не владеет place identity и не пишет Atlas truth.

### Pulse
- RF может ссылаться на event context в partner/offer сценариях.
- RF не владеет event lifecycle; Pulse не владеет voucher lifecycle.

### Rielt
- RF и Rielt могут ссылаться на общих business actors.
- RF не владеет listings/inquiries; Rielt не должен заменять partner/business слой RF.

### Quest
- Quest может ссылаться на RF branch/offer/voucher context.
- Quest не владеет partner/voucher identity; RF не владеет quest progression/proof truth.

### Space
- Space может социально циркулировать RF-сущности.
- Space не владеет partner/business truth.

### Guru
- Guru может агрегировать RF projections.
- Guru не владеет RF source truth.

---

## 8. Target boundary vs not yet fully formalized

### Target boundary (фиксируется этим документом)

- Atlas = owner canonical geo identity;
- RF = owner partner/business presence + offer/voucher lifecycle;
- downstream = link/reference/adoption без ownership drift.

### Not yet fully formalized (честно зафиксировано)

- финальный runtime-contract RF по всем контурам и endpoint деталям;
- единый production-grade механизм обязательной Atlas-link validation для всех путей;
- финальная depth/coverage всех RF surfaces (merchant/PRO/admin);
- полная синхронизация field-level контракта RF branch с расширенной geo matrix во всех модулях.

Эти зоны считаются contract/documentation debt, а не разрешением на параллельные модели.

---

## 9. What this document does NOT decide

- не фиксирует implementation roadmap и delivery backlog;
- не утверждает, что RF уже fully implemented runtime-first;
- не вводит новый geo-service;
- не подменяет execution/status anchor документы;
- не переносит ownership соседних доменов в RF;
- не заменяет per-service API contracts и acceptance criteria.

---

## 10. Final domain formula

RF Asia — это partner/business presence слой поверх canonical geo:

- владеет partner/branch/offer/voucher semantics;
- использует Atlas geo truth по ссылкам;
- обеспечивает межмодульную business attachment стыковку;
- не становится god-module и не поглощает ownership соседних доменов.
