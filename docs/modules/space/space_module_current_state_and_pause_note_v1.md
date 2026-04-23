# Space Asia — Current State And Pause Note v1

## Status

Status / sequencing / pause note.

Этот документ фиксирует рабочую промежуточную точку по модулю Space Asia и решение временно отложить дальнейшую активную разработку модуля.

Это не отказ от Space и не новый audit.

## Purpose

Документ нужен как опорная точка для монорепо:

- зафиксировать, что уже является working baseline модуля;
- показать, какие части остаются bounded / incomplete;
- объяснить, почему пауза по Space сейчас рациональна;
- зафиксировать, от каких доменов зависит следующий значимый рост Space;
- задать условия для будущего возврата к активной работе над модулем.

Детальный runtime snapshot и более ранние продуктовые решения зафиксированы в соседних документах, прежде всего:

- `space_current_state_audit_with_organizer_v1.md`
- `space_feed_activity_publications_decision_note_v1.md`
- `space_feed_activity_publications_implementation_plan_v1.md`
- `organizer_current_cycle_closure_note_v1.md`

## Why Pausing Space Now Is Rational

Пауза по Space сейчас рациональна по трём причинам.

Во-первых, модуль уже выведен из состояния пустого shell и имеет рабочий набор основных поверхностей. Это значит, что мы оставляем не заготовку, а живой и пригодный для review baseline.

Во-вторых, следующий качественный рост Space теперь всё сильнее зависит не от локальной полировки самого модуля, а от зрелости внешних доменов и сервисов экосистемы. Без этого дальнейшая работа по Space будет давать в основном локальный polish, а не новый уровень продуктовой ценности.

В-третьих, это sequencing decision, а не пересмотр важности Space. Модуль остаётся важным личным и social hub внутри Go2Asia, но его следующий этап должен опираться на готовность Connect, RF, Quest, Rielt Market и контуров личных / административных / PRO-консолей.

## Current Space Module Summary

На текущем этапе Space Asia уже стал рабочим модулем экосистемы с устойчивым личным и социальным shell.

В модуле уже есть:

- входной personal/dashboard layer;
- community discovery layer;
- основной social feed;
- saved layer;
- activity layer;
- organizer layer;
- publications layer.

В целом модуль можно считать устойчивым working baseline, но ещё не зрелым cross-domain personal/social operating layer.

## Surface-By-Surface Status

### Dashboard

**Role**

Личный входной cockpit и точка входа в модуль.

**What already works**

- базовый контекст пользователя;
- рабочий shell входа в Space;
- preview-слои для связанных surface;
- связка с Organizer;
- summary-подача текущих действий и next steps.

**What remains bounded / incomplete**

- часть ecosystem/personal signals пока остаётся preview-summary;
- dashboard ещё не является полноценным cross-domain command center.

**Working baseline**

Хороший working baseline для shell и personal entry point.

### Community

**Role**

Discovery root для групп и входов в community layer.

**What already works**

- секции discovery;
- карточки групп;
- переходы в группы и в ленту;
- честная роль Community как discovery surface, а не feed-подмена.

**What remains bounded / incomplete**

- нет зрелого recommendation/search слоя;
- deeper social graph и richer group-management пока не развиты.

**Working baseline**

Хороший bounded baseline для community discovery.

### Feed

**Role**

Основной персональный читаемый social stream.

**What already works**

- home/feed truthfulness;
- реальные посты и репосты;
- feed как центральная social surface;
- bounded realism через seed/materialization.

**What remains bounded / incomplete**

- reaction-driven и ecosystem-driven расширения пока ограничены;
- нет зрелой multi-domain feed wave;
- feed ещё не насыщен всеми будущими типами ecosystem/social signals.

**Working baseline**

Сильный working baseline.

### Saved

**Role**

Личный контур сохранённых постов и мост в Organizer.

**What already works**

- bookmark-based saved list;
- гидрация постов;
- remove from saved;
- add to trip / create trip bridge.

**What remains bounded / incomplete**

- слой пока в первую очередь `space_post`-centric;
- широкий cross-domain saved layer ещё не сформирован.

**Working baseline**

Очень хороший baseline для текущего scope.

### Activity

**Role**

Event log вокруг пользователя и его действий.

**What already works**

- backend activity slice 2;
- truthful filters `all / incoming / my_actions`;
- incoming like/repost scenarios;
- route-local UI wiring под эти фильтры.

**What remains bounded / incomplete**

- это ещё не полноценный notification center;
- system/social breadth пока сознательно ограничены;
- presentation остаётся компактной и узкой.

**Working baseline**

Хороший working baseline.

### Organizer

**Role**

Personal planning/workflow layer внутри Space.

**What already works**

- trips home;
- trip detail;
- item/task/note flows;
- saved-to-trip bridge;
- bounded portfolio execution surface.

**What remains bounded / incomplete**

- lifecycle/time maturity ещё не полная;
- не весь изначальный Organizer-замысел доведён до канонического состояния.

**Working baseline**

Сильный working baseline.

### Publications

**Role**

Authoring/ownership layer для собственных публикаций.

**What already works**

- read-only author surface;
- список своих постов и репостов;
- profile-bound publications view;
- чёткое разделение с Feed и Activity.

**What remains bounded / incomplete**

- нет полного management-layer для drafts/edit/visibility workflows;
- это пока не полноценный author console.

**Working baseline**

Хороший bounded baseline.

## What Is Still Not Implemented

Следующие вкладки и сценарии ещё отсутствуют как полноценные рабочие поверхности Space:

- Quests
- Vouchers
- Balance
- NFT
- Referrals
- Settings

Они разумно отложены, потому что не являются чисто локальными Space-only экранами и требуют зрелости внешних сервисов, контрактов и данных.

Зависимости здесь следующие:

- Quests -> `quest-service`
- Vouchers -> RF / partner / voucher layer
- Balance -> Connect / points / economy layer
- NFT -> Connect / token / ownership layer
- Referrals -> referral / Connect contours
- Settings -> account / personal settings / auth / preference contours beyond current Space shell

## Cross-Domain Dependency Map

### Connect

Space ожидает от Connect:

- points и balance signals;
- status / progression signals;
- referrals;
- NFT / token ownership signals;
- personal and economic ecosystem signals.

Это должно усилить:

- Dashboard;
- будущие Balance / NFT / Referral surfaces;
- future Activity system/personal layers.

### RF

Space ожидает от RF:

- partner objects;
- offers;
- vouchers;
- partner-related PRO and business summaries.

Это должно усилить:

- Saved;
- Feed ecosystem reposts;
- будущую Vouchers surface;
- business/social utility внутри Space.

### Quest

Space ожидает от Quest:

- quests как сущности;
- progress/submission signals;
- quest-based saved/repost/share surfaces.

Это должно усилить:

- Feed;
- Activity;
- Organizer;
- будущую Quests surface.

### Rielt

Space ожидает от Rielt Market:

- listings;
- inquiry-related entities;
- property-related saved / planning / feed context.

Это должно усилить:

- Saved;
- Organizer;
- Feed ecosystem repost layer;
- future real-estate related social/business usage.

### Personal / Admin / PRO Consoles

Space ожидает от этих контуров:

- operational and managerial workflows;
- role-based views;
- owner / operator / pro actions;
- richer control and summary layers.

Это должно усилить:

- dashboard summaries;
- future settings/role-aware surfaces;
- cross-domain orchestration;
- social/business visibility в Space без превращения самого модуля в полноценную console layer.

## Space Readiness Verdict

К устойчивому working baseline уже можно относить:

- shell and IA;
- Dashboard;
- Community discovery;
- Feed;
- Saved;
- Activity;
- Organizer;
- Publications.

Пока нельзя считать зрелыми:

- cross-domain насыщенность;
- notification/system maturity;
- broad ecosystem ingestion;
- full author/management depth;
- economy/status/quest/voucher ownership surfaces.

Также важно: часть уже работающих поверхностей не требует срочного продолжения прямо сейчас. Ещё один внутренний-only pass по Space без внешних доменов даст меньше пользы, чем развитие самих доменов, которые потом будут питать модуль.

## Recommended Next Focus Outside Space

После текущего цикла по Space логично переключить усилия на:

1. backend-сервисы и устойчивые контракты;
2. Connect Asia;
3. RF;
4. Quest;
5. Rielt Market;
6. далее — personal / admin / PRO console contours.

Именно такой порядок усилит Space позже, потому что сначала появится truth layer и зрелые data contracts, затем реальные ecosystem entities и signals, и только после этого новые Space surfaces смогут стать продуктово насыщенными, а не thin placeholders.

## Return Conditions

Возвращаться к активной работе над Space логично тогда, когда появятся:

- стабильные внешние сервисы и runtime contracts;
- зрелые data flows из Connect / RF / Quest / Rielt;
- понятная необходимость расширять Dashboard / Feed / Activity / Saved за счёт новых живых сущностей и сигналов;
- signal, что именно Space снова стал bottleneck для пользовательской ценности.

Практически это означает: к модулю стоит возвращаться тогда, когда соседние домены уже способны поставлять в него product-grade данные и сценарии, а не только обещанные будущие интеграции.

## Final Verdict

Пауза по Space сейчас рациональна.

Мы оставляем модуль не в черновом, а в устойчивом промежуточном состоянии: Space уже является живым personal/social baseline внутри Go2Asia.

Следующий качественный рост Space теперь зависит не столько от ещё одного локального pass по самому модулю, сколько от зрелости внешних доменных контуров и их готовности питать Space реальными сущностями, сигналами и operational сценариями.

Поэтому к Space разумно вернуться позже — в тот момент, когда внешняя экосистема будет готова дать модулю новый уровень насыщения и ценности.
