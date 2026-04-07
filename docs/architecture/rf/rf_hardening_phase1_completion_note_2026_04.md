# RF hardening phase 1 completion note (2026-04)

## Статус

Для модуля **RF Asia** завершён этап:

**hardening phase 1 completed**

Этот этап идёт **поверх** уже зафиксированного milestone:
**RF three-contour baseline achieved**.

---

## Что зафиксировано

### 1. Public RF contour
Публичный контур остаётся зафиксированным:
- `/rf`
- `/rf/vouchers`
- `/rf/map`
- `/rf/favorites`
- `/rf/my-vouchers`
- `/rf/how-it-works`

Главный public entry point — **Каталог мест**.

### 2. Merchant contour
Merchant contour прошёл **hardening pass**:
- убраны misleading / dead navigation points;
- anchor/workspace navigation приведена к более честному виду;
- live / read-only / demo / placeholder distinctions стали явнее;
- public linkage сохранён;
- contour остаётся baseline, не production-complete.

### 3. PRO contour
PRO contour прошёл **hardening pass**:
- устранены misleading legacy/deep-link сценарии;
- operation routes честно размечены как `legacy` / `demo` / `soon`, где это необходимо;
- main PRO workspace сохранён как главный центр контура;
- public linkage сохранён;
- contour остаётся baseline, не production-complete.

### 4. RBAC
RBAC-доступ к `/rf/pro` исправлен и подтверждён ручной проверкой после деплоя и перелогина.
Role extraction в PWA middleware выровнен с более устойчивой canonical-role логикой.

---

## Что это означает

RF Asia сейчас находится в состоянии:

**baseline fixed + hardening phase 1 completed**

Это означает:
- public / merchant / PRO контуры собраны;
- merchant и PRO приведены к более честному и внутренне непротиворечивому baseline;
- самые заметные misleading UX-точки первого слоя устранены;
- модуль готов к паузе до следующего отдельного live-integration pass.

---

## Что пока не завершено

RF **не** является production-complete модулем.

По-прежнему остаются незавершёнными или частично временными:
- live vouchers management;
- live reviews management;
- merchant stats/settings truth;
- final PRO assignment model;
- verification workflow truth;
- onboarding/rewards truth;
- полная операционная data truth для merchant и PRO surfaces.

---

## Правило для следующих RF-итераций

Не продолжать RF бесконечными UI-проходами.

Возвращаться к RF только отдельными bounded slices, например:
- RF live data enrichment pass
- RF merchant live operations pass
- RF PRO operations truth pass
- RF verification / rewards integration pass
- RF ↔ Connect integration pass

---

## Cursor guidance

Считать текущее состояние RF зафиксированным:

- не откатывать public contour назад к лендинговой витрине;
- не смешивать public, merchant и PRO контуры;
- не считать merchant и PRO production-ready;
- не делать scope drift;
- дальнейшие RF-изменения — только отдельными targeted passes.

---

## Краткий verdict

**RF hardening phase 1 completed.**

RF Asia зафиксирован как модуль с:
- three-contour baseline,
- merchant hardening phase 1,
- PRO hardening phase 1.

Следующий этап для RF — только отдельные live-integration / operations-truth passes.