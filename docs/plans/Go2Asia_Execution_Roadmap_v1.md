# Go2Asia Execution Roadmap v1

**Status:** execution reference  
**Scope:** phase order and transition criteria after geo/RF alignment cycle  
**Type:** planning/reference only

---

## Purpose

Этот документ фиксирует рабочую последовательность исполнения внутри Go2Asia после завершения базового цикла architectural alignment:

- geo canon / Atlas geo substrate;
- RF boundary and hardening;
- bounded downstream seams for Rielt and Quest;
- Pulse event geography contract hardening.

Цель документа — задать **порядок фаз** и **критерии перехода между ними**, чтобы дальше двигаться не через бесконечные alignment-проходы, а через последовательные execution phases.

Документ не является детальным roadmap backlog, не подменяет status anchor и не фиксирует implementation plans по каждой фазе.

---

## Core execution principle

Фазы строятся не вокруг идеи “доделать всё сразу”, а вокруг последовательного ввода **опорных слоёв**:

1. сначала platform substrate layers;  
2. потом practical / engagement modules;  
3. потом targeted content hardening;  
4. потом cross-module connective layer.

На каждой фазе действует одно правило:

> Не доводить модуль до “идеального мира”,  
> а доводить его до “достаточно зрелого следующего substrate / useful contour”.

---

## Phase 1 — Business substrate

### Primary execution priority
**RF**

### Phase goal
Довести RF до состояния устойчивого **shared business/partner layer**, пригодного для downstream modules без ownership drift.

### Phase core
- partner/business presence baseline
- offer/voucher baseline
- stable consumer seams
- достаточная contract/runtime ясность
- согласованность с Atlas geo canon

### Explicitly not required for phase completion
- полный RF v2
- полный merchant/admin universe
- branch megaredesign
- полный moderation platform
- полный internal API rollout

### Exit criteria
Фаза считается завершённой, когда:

- RF usable как downstream dependency, а не только как документированный boundary layer;
- partner/offer/voucher baseline стабилен;
- machine-readable seams для downstream не двусмысленны;
- RF не требует от downstream ad hoc business identity;
- нет критичного contract drift в first-slice зоне.

### Transition to Phase 2
Переход допустим, когда RF достаточен как business substrate для следующих модулей и не является главным architectural blocker.

---

## Phase 2 — Social substrate

### Primary execution priority
**Space**

### Phase goal
Сделать usable **social core**, который сможет стать контуром циркуляции, social proof и later Connect-layer.

### Phase core
- profile / identity projection
- post / repost / basic circulation
- groups / membership baseline
- social read/write contour
- корректные boundaries со Space vs other modules

### Explicitly not required for phase completion
- вся полнота социальной платформы
- complex ranking / super-feed v2
- creator economy
- весь community tooling

### Exit criteria
Фаза считается завершённой, когда:

- Space usable как social substrate;
- social publication/distribution контур реально работает;
- Space умеет ссылаться на другие домены без ownership захвата;
- появляется пригодная база для future Connect layer.

### Transition to Phase 3
Переход допустим, когда Space перестаёт быть пустой social shell и становится реально usable platform layer.

---

## Phase 3 — Practical module

### Primary execution priority
**Rielt**

### Phase goal
Вывести Rielt в состояние реально полезного **practical/business module**, стоящего на `Atlas + RF + Space` как на готовых основаниях.

### Phase core
- listings
- inquiry lifecycle
- owner/agent flows
- optional RF-linked business context
- usable public + owner contour

### Explicitly not required for phase completion
- полный proptech/CRM suite
- полный trust universe
- монструозный кабинет
- все варианты monetization сразу

### Exit criteria
Фаза считается завершённой, когда:

- Rielt usable как самостоятельный product contour;
- listing/inquiry truth стабилен;
- optional RF seam работает без ownership drift;
- geo grounding не конфликтует с Atlas canon;
- social reuse через Space conceptually supported.

### Transition to Phase 4
Переход допустим, когда Rielt уже даёт реальную practical surface и не требует постоянного architectural rescue.

---

## Phase 4 — Experience / engagement module

### Primary execution priority
**Quest**

### Phase goal
Построить usable Quest contour как engagement/experience layer на более зрелой платформенной базе.

### Phase core
- quest lifecycle
- steps / progression / proof
- place/event/business-linked targets
- optional RF-linked scenarios
- интеграция с geo truth и, где нужно, с Pulse

### Explicitly not required for phase completion
- полный gamification universe
- сложный economy/meta-game
- все proof types
- полный reward orchestration

### Exit criteria
Фаза считается завершённой, когда:

- Quest usable как самостоятельный engagement contour;
- progression/proof truth стабилен;
- business-linked seams не ломают ownership;
- geo/event/business targets различаются корректно;
- Quest не строит параллельную partner/business identity.

### Transition to Phase 5
Переход допустим, когда Quest уже не требует постоянного architectural stabilization и может органично встраиваться в ecosystem flows.

---

## Phase 5 — Content layer hardening and enrichment

### Primary execution priorities
**Atlas / Pulse / Blog**

### Phase goal
Не “начать контент заново”, а targeted-дошлифовать и усилить content/discovery layer после того, как основные substrate и domain contours уже стоят на ногах.

### Phase core
- Atlas targeted hardening
- Pulse geography/event hardening
- Blog strengthening and enrichment
- cross-linking readiness
- discovery quality uplift

### Explicitly not required for phase completion
- новый бесконечный архитектурный цикл
- полный повтор контентного канона
- контентный перфекционизм

### Exit criteria
Фаза считается завершённой, когда:

- Atlas / Pulse / Blog не являются слабыми местами экосистемы;
- discovery surfaces достаточно честны и согласованы;
- content layer готов к общей связности через Connect.

### Transition to Phase 6
Переход допустим, когда контентные модули достаточно зрелы, чтобы Connect соединял полезные поверхности, а не незакрытые долги.

---

## Phase 6 — Cross-module connective tissue

### Primary execution priority
**Connect across modules**

### Phase goal
Сделать сквозной связующий слой между модулями, когда substrate и domain contours уже достаточно зрелы.

### Phase core
- unified cross-module linking
- reusable entity connections
- shared circulation patterns
- social/business/content interplay
- coherent cross-domain user journeys

### Explicitly not required for phase completion
- “связать всё со всем” без discipline
- ранний Connect поверх незрелых модулей
- cementing unfinished domain contours

### Exit criteria
Фаза считается завершённой, когда:

- Connect усиливает реальные зрелые модули, а не маскирует их слабости;
- cross-module paths действительно полезны;
- RF и Space работают как platform anchors для связности.

---

## Transition rules between phases

### Phase 1 -> Phase 2
Переходить, когда RF usable как shared business substrate, а не только как красиво описанный boundary layer.

### Phase 2 -> Phase 3
Переходить, когда Space usable как social substrate, а не как пустой social shell.

### Phase 3 -> Phase 4
Переходить, когда Rielt уже даёт реальную practical surface и не требует постоянного architectural rescue.

### Phase 4 -> Phase 5
Переходить, когда Quest стабилен как engagement layer и может органично встраиваться в ecosystem flows.

### Phase 5 -> Phase 6
Переходить, когда Atlas / Pulse / Blog достаточно крепкие, чтобы Connect прошивал зрелые поверхности.

---

## Short version

### Phase 1
**RF** — business substrate

### Phase 2
**Space** — social substrate

### Phase 3
**Rielt** — practical module

### Phase 4
**Quest** — engagement module

### Phase 5
**Atlas / Pulse / Blog** — targeted hardening and enrichment

### Phase 6
**Connect** — cross-module connective tissue

---

## What this document does NOT decide

Этот документ:

- не является детальным backlog;
- не заменяет `go2asia_status_anchor_v1.md`;
- не фиксирует per-phase implementation plans;
- не утверждает календарные сроки;
- не поднимает статус контуров автоматически;
- не требует доведения каждой фазы до “идеального мира” перед переходом дальше.