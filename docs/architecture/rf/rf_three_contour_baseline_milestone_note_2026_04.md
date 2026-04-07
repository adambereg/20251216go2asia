# RF milestone note — three-contour baseline achieved (2026-04)

## Статус

Для модуля **RF Asia** достигнут базовый milestone:
**three-contour baseline achieved**.

Собраны и проверены три отдельных контура:

1. **Public RF contour**
   - `/rf`
   - `/rf/vouchers`
   - `/rf/map`
   - `/rf/favorites`
   - `/rf/my-vouchers`
   - `/rf/how-it-works`

2. **Merchant contour baseline**
   - `/rf/merchant`
   - отдельный workspace baseline для партнёра
   - пока частично read-only / beta / mixed-live

3. **PRO contour baseline**
   - `/rf/pro`
   - отдельный workspace baseline для PRO
   - RBAC-доступ исправлен и подтверждён ручной проверкой после деплоя и перелогина

---

## Что зафиксировано

### 1. Public contour
Public RF больше не является лендинговой витриной.
Главный entry point — **Каталог мест**.
Также собраны отдельные публичные поверхности:
- каталог предложений,
- карта,
- избранное,
- мои ваучеры,
- how-it-works.

### 2. Merchant contour
Merchant cabinet существует как **workspace skeleton**:
- отделён от public discovery-контура,
- даёт обзор, readiness, public linkage,
- но пока не является production-complete кабинетом.

### 3. PRO contour
PRO cabinet существует как **third contour baseline**:
- отделён и от public, и от merchant,
- даёт обзор, scope, partner offers, focus, public RF view, next steps,
- часть логики пока support-layer / derived / beta.

### 4. RBAC fix
Доступ к `/rf/pro` больше не блокируется из-за узкого чтения role claim в middleware.
Role extraction в PWA middleware выровнен с более устойчивой canonical-role логикой.
Ручная проверка после деплоя и перелогина подтверждена:
- `admin.operator.seed@example.com`
- `oleg.tran.seed@example.com`

---

## Что это означает

RF теперь имеет **архитектурно состоятельный baseline трёх контуров**:
- public
- merchant
- pro

Это **не означает**, что RF полностью production-ready.
Это означает, что:
- контуры уже существуют,
- навигационно отделены,
- продуктово читаются,
- и могут развиваться дальше отдельными bounded passes.

---

## Что пока остаётся временным

- часть merchant surfaces не live;
- часть PRO surfaces legacy / placeholder / support-layer;
- нет финальной live assignment-модели для PRO;
- нет полного merchant hardening;
- нет полного PRO hardening;
- часть личных пользовательских поверхностей опирается на local state;
- часть данных RF всё ещё enrichment/support-layer, а не полностью API-truth.

---

## Как трактовать текущий milestone

Текущий milestone:
**RF baseline architecture milestone, not RF production completion milestone.**

Иными словами:
- RF структурно собран;
- RF не завершён как полностью живая бизнес-операционная система.

---

## Рекомендуемое правило для следующих проходов

Не размывать scope.
Дальнейшие шаги по RF делать только отдельными bounded slices, например:
- merchant hardening / live wiring
- PRO hardening / live wiring
- real assignment model for PRO
- reviews / vouchers / rewards live integration
- RF ↔ Connect integration later

---

## Cursor guidance

При дальнейшей работе считать это базовой фиксацией:

- **не возвращать RF к форме лендинга**
- **не смешивать public, merchant и PRO контуры**
- **не считать merchant или PRO завершёнными production surfaces**
- **не делать scope drift**
- все дальнейшие изменения RF — только как отдельные целевые passes поверх уже достигнутого three-contour baseline

---

## Краткий verdict

**RF three-contour baseline achieved.**
Public contour, merchant baseline и PRO baseline собраны и зафиксированы.
Следующие RF-итерации — только как selective hardening / live wiring passes.