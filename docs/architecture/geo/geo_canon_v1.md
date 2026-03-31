# Geo Canon v1 (Reference)

**Status:** reference fixation for current milestone  
**Scope:** Atlas-first canonical geo model and cross-module adoption rules  
**Type:** architecture/documentation only

---

## Document position

В репозитории также присутствует `docs/architecture/Geo_Canon_v1.md` с более развернутым описанием целевого geo-контракта (включая service-level материал и migration notes).

Этот файл в `docs/architecture/geo/` фиксирует сжатый reference для milestone-контекста и не должен читаться как "второй независимый SSOT".  
Он дополняет, а не автоматически заменяет более развернутый документ.

Если появляются расхождения между документами, они должны устраняться явной фиксацией решения (через обновление docs/ADR), а не неявным выбором "какой файл оказался ближе по пути".

---

## 1. Canonical geo entities

Базовая каноническая модель географии в Go2Asia:

- `country`
- `city`
- `district` (включая operational forms: `area`, `island`, `subregion`, если они удовлетворяют parent rule)
- `geo_container`
- `place`

### Parent rule

- `city` принадлежит `country`;
- `district` принадлежит одному каноническому родителю (обычно `city`; альтернативный parent допустим только как явно разрешенный каноном сценарий);
- `geo_container` принадлежит `city` и локальному `district`/эквивалентному local-zone parent;
- `place` принадлежит `country`, `city`, локальному `district` (когда слой применим), и опционально `geo_container`.

---

## 2. Container semantics

`geo_container` — это каноническая доменная geo-сущность, а не UI-группировка.

### Назначение контейнера

- моделировать крупные составные объекты (комплексы, башни, моллы, рынки, отели, кластеры);
- обеспечивать точную локальную навигацию и grouping в плотной городской среде;
- задавать управляемый уровень между local-zone и concrete place.

### Ограничения

- контейнер **опционален**; нельзя принудительно добавлять контейнер для каждого place;
- при наличии container-link он входит в каноническую иерархию и должен использоваться согласованно всеми потребителями.

---

## 3. Allowed relations

Допустимые канонические связи:

- `country -> city`
- `city -> district`
- `district -> geo_container` (optional path)
- `district -> place` (standalone place path)
- `geo_container -> place`
- `geo entity -> domain/content entity` (`event`, `listing`, `partner_location`, `quest_step`, и другие geo-aware сущности)

### Обязательные инварианты

- гео-ссылки downstream-сущности не должны противоречить иерархии canonical parent chain;
- нельзя подменять entity relations свободным текстом как source of truth;
- для nearby/map/use-case с гео-точностью требуются валидные координаты и канонические ссылки.

---

## 4. Canonical vs derived geo fields

### Canonical fields (SSOT contract)

- стабильные идентификаторы гео-сущностей (`country_id`, `city_id`, `district_id`, `container_id`, `place_id` по применимости);
- нормализованные parent references;
- координаты (`lat/lng`) для geo-aware сценариев;
- канонические relation-links между geo и domain/content сущностями.

### Derived/supporting fields (non-canonical)

- display names / localized labels;
- routing slugs;
- address text;
- marketing/location hints;
- legacy bridge fields в период миграции.

### Rule

Derived-поля допустимы как вспомогательные, но не как источник идентичности или структурной гео-логики.

---

## 5. Rules for future module adoption

1. Любые новые города/страны подключаются через канонические geo entities и relations.  
2. Возврат к ad hoc district logic запрещен.  
3. Новые geo-сущности должны расширять канон, а не создавать параллельную схему.  
4. Bridge-compatible режим допускается только как временный, явно отслеживаемый migration debt.  
5. Downstream-модули не должны создавать собственные несовместимые geo DTO/identity-модели.

---

## 6. Atlas role in canon

- Atlas фиксируется как первый реальный носитель canonical geo ontology в платформе.
- Atlas в текущем этапе выступает базовым geo SSOT для модульного adoption.
- Atlas должен оставаться точкой нормализации canonical geo identity, а не только набором контентных страниц.

---

## 7. RF role as next cross-module layer

- RF Asia фиксируется как следующий межмодульный business/partner layer поверх canonical geo.
- RF-слой отвечает за business/partner attachment к канонической географии (partner locations, offer/linkage контуры и совместимость с canonical refs).
- Это не отменяет ownership Atlas над geo identity: RF использует каноническую географию, а не заменяет ее.
- Для downstream-контуров это означает sequencing guardrail: фиксация RF contract/boundary должна предшествовать или идти параллельно с geo/business adoption в Rielt и Quest, где иначе возникает риск параллельной несовместимой стыковки.

### Осторожная формулировка по зрелости

Где RF-контракты еще неполны, это считается этапом формализации межмодульного слоя, но не основанием для параллельной geo/business модели в downstream.

---

## 8. Pulse / Rielt / Quest adoption guardrails (no scope drift)

### Pulse

- принимает canonical geo как базу событийной геопривязки;
- не формирует альтернативную geo-идентичность;
- учитывает RF-слой там, где событие привязано к partner/business attachment.

### Rielt

- использует canonical geo refs для listing/location semantics;
- не реализует собственную district/business модель в обход `RF + canonical geo`;
- container/place semantics потребляет из канонического слоя, не дублирует ad hoc.

### Quest

- для location-bound step/target использует канонические ссылки и гео-координаты;
- не строит независимую geo/business модель там, где должен использоваться слой `RF + canonical geo`.

### Общий guardrail

Этот reference фиксирует промежуточное состояние канона и межмодульной стыковки.  
Документ не вводит новый geo-service, не расширяет scope до полной перестройки платформы и не заменяет отдельные execution-планы.

---

## 9. What this reference does NOT decide

- не фиксирует финальный runtime-contract RF и не утверждает, что RF runtime уже полностью завершен;
- не фиксирует обязательную full runtime-validation downstream against Atlas на текущем этапе;
- не вводит отдельный geo-service;
- не фиксирует окончательно физическую DB-модель container (`subtype of place` vs отдельная сущность/табличный layout);
- не заменяет execution/implementation планы downstream-adoption;
- не утверждает, что весь downstream уже приведен к full canonical state.
