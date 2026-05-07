# RF Stage 5.0D — Attribution Operational Review & Next Stage Decision (v1)

## 1) Executive Summary

Stage 5.0B/5.0C дал рабочий минимальный фундамент:

- durable attribution fact на `rf_voucher`;
- `shareCode` как public transport через `rf_pro_link.share_code`;
- non-blocking validation (invalid attribution не ломает claim);
- immutable attribution после первого успешного claim;
- read-only PRO visibility через `GET /v1/rf/pro/attributed-vouchers`.

Операционно это уже пригодно для ручной валидации end-to-end сценария PRO->claim->visibility.  
Главный вывод Stage 5.0D: **до запуска rewards/economy приоритетнее стабилизировать RF lifecycle/repeatability/redemption (Option E)**, а не расширять экономический слой.

---

## 2) Current Implemented Attribution Capabilities

- **Capture:** `sessionStorage` ключ `go2asia.rf.proAttribution.v1`, TTL 24h.
- **Claim payload:** optional attribution в partner/listing claim.
- **Validation:** серверно через active `rf_pro_link` + partner match + TTL checks.
- **Persistence:** attribution поля сохраняются на `rf_voucher`.
- **Immutability:** первый успешный claim фиксирует durable attribution fact.
- **Visibility:** PRO-safe read model (`confirmed` by default, cursor/limit, filters).
- **Contract:** OpenAPI/SDK/types синхронизированы (`openapi:check` проходит).

---

## 3) Operational Flow Review

### Подтвержденные рабочие потоки

1. PRO получает активную link-связь и share-ссылку с `shareCode`.
2. Пользователь попадает в RF surface, где включен capture (`catalog`/`listing vouchers`).
3. Claim отправляет optional attribution payload.
4. RF service резолвит `shareCode` в active `rf_pro_link`.
5. При валидной связке пишет `confirmed`; при невалидной пишет `rejected`/`none`, но claim успешен.
6. PRO видит подтвержденные attributed vouchers в `PRO Workspace`.

### Операционные gaps текущего UX

- capture не на всех публичных входах одинаково очевиден (например partner page как отдельный touchpoint);
- нет отдельной merchant visibility;
- нет user-facing badge;
- нет internal diagnostics view для rejected reason в UI.

---

## 4) Manual QA Scenarios

### Базовый сквозной сценарий (happy path)

1. Иметь active `rf_pro_link` с `shareCode`.
2. Открыть PRO workspace и взять public ссылку с `shareCode`.
3. Открыть ссылку новым user/session.
4. Убедиться, что user авторизован.
5. Выполнить claim (partner или listing scope).
6. Проверить, что ваучер появился в `My vouchers`.
7. Зайти под PRO.
8. Проверить появление строки в `Attributed vouchers` (offer/partner/source/timestamps).

### Негативные сценарии

- expired transient capture -> claim успешен, attribution `rejected`;
- inactive/wrong-partner link -> claim успешен, attribution `rejected`;
- повторный claim с тем же context/idempotency -> без дублей/без rewrite attribution.

---

## 5) Observability Gaps

- PRO видит только confirmed projection; rejected/none публично для PRO не диагностируются.
- Нет узкого internal QA/debug surface для причин `rejected` (support pain при расследовании).
- Для операционного контроля перед economy не хватает удобного read-only troubleshooting слоя.

Рекомендация: diagnostics нужен, но как отдельный ограниченный шаг (без mutation/admin editor).

---

## 6) Privacy and Safety Review

### Подтверждено безопасно для PRO visibility endpoint

В `RfProAttributedVoucher` не отдаются:

- `issuedToUserId`;
- voucher `code`;
- `shareCode`;
- `proUserId`;
- `proLinkId`;
- raw attribution metadata blob.

### Copy safety

Для Stage 5 attribution surfaces соблюдается factual language:

- attributed voucher / claim recorded / attribution status/source;
- без payout/commission/earnings/reward semantics в core RF attribution block.

### Нюанс для будущего контроля

User-side voucher DTO может содержать attribution fields в runtime contract; это не PRO visibility утечка, но требует явной privacy-policy интерпретации перед economy.

---

## 7) Architecture Boundary Review

Stage 5.0B/5.0C соответствует границам:

- RF owns RF attribution capture/persistence.
- Connect не стал owner attribution facts.
- Economy не владеет capture.
- Нет centralized attribution runtime/platform.
- Нет payout semantics и correction flow в текущем scope.

---

## 8) Remaining Product Gaps

- Merchant visibility отсутствует (осознанно).
- User badge отсутствует (осознанно).
- Internal read-only debug отсутствует.
- Lifecycle/repeatability/redemption policy еще не доведены до «economy-ready» зрелости.

---

## 9) Next-stage Options (A–F)

### A — Merchant Attribution Visibility
- **Плюсы:** partner transparency.
- **Риски:** privacy + быстрый дрейф к «финансовой интерпретации».

### B — User Voucher Attribution Badge
- **Плюсы:** UX transparency.
- **Риски:** возможная неверная интерпретация пользовательской выгоды.

### C — Internal Attribution Debug / QA View
- **Плюсы:** быстрое расследование rejected/none.
- **Риски:** не раздуть в admin-dashboard.

### D — Connect Read-only Projection
- **Плюсы:** unified read layer.
- **Риски:** размытие ownership, premature ecosystem coupling.

### E — RF Lifecycle / Repeatability / Redemption Stabilization
- **Плюсы:** фундамент перед rewards/economy; снижает архитектурные риски.
- **Риски:** сложнее и дольше, чем просто visibility-polish.

### F — RF Economy / PRO Rewards Design
- **Плюсы:** прямой бизнес-выход.
- **Риски:** слишком рано при незавершенной lifecycle стабилизации; высокий риск смешать facts и incentives.

---

## 10) Recommended Next Step

**Основной следующий этап: Option E — RF Lifecycle / Repeatability / Redemption Stabilization.**

Почему:

1. Economy/rewards поверх нестабильного lifecycle даст хрупкие правила и исключения.
2. Attribution fact layer уже есть; текущий bottleneck — операционная предсказуемость ваучера как продукта.
3. Option E не ломает attribution boundaries и подготавливает clean bridge к economy позже.

Допустимый параллельный малый слой после старта E: narrow internal diagnostics (Option C), если потребуется support/QA.

---

## 11) Decision Matrix

Шкала 1..5 (5 = лучше для следующего этапа сейчас).

| Option | Boundary Safety | Implementation Readiness | Scope Creep Risk (reverse) | Economy Readiness Contribution | Итог |
|---|---:|---:|---:|---:|---:|
| A Merchant visibility | 3 | 3 | 2 | 3 | 11 |
| B User badge | 4 | 5 | 4 | 2 | 15 |
| C Internal debug | 4 | 4 | 3 | 3 | 14 |
| D Connect projection | 2 | 2 | 1 | 3 | 8 |
| E Lifecycle stabilization | 5 | 3 | 4 | 5 | **17** |
| F Economy/rewards now | 2 | 1 | 1 | 4 | 8 |

Decision: **E** как основной next stage.

---

## 12) Risks

### Если идти в economy слишком рано (F)
- semantic drift: attribution fact vs reward logic;
- спорные edge-cases redemption/repeatability;
- рост support/финансовых исключений.

### Если идти в merchant visibility раньше E (A)
- партнеры начнут требовать payout-like трактовку до готового economics слоя.

### Если идти в Connect projection раньше E (D)
- риски ownership confusion и premature platform coupling.

---

## 13) Non-goals (для следующего шага)

Следующим этапом **не делать**:

- payouts, commissions, earnings;
- Points/G2A/NFT;
- merchant payout dashboard;
- Connect ownership of attribution;
- centralized attribution service;
- attribution correction/mutation UI.

---

## 14) Open Questions

1. Какая repeatability policy нужна по типам offer (one-time vs repeatable) до economy?
2. Какой canonical redemption model закрывает партнёрские edge-cases без ручных обходов?
3. Какие lifecycle transitions должны считаться economy-eligible, а какие нет?
4. Нужен ли минимальный internal diagnostics слой до завершения E?
5. В каком виде user badge (Option B) безопасно ввести после E без social leakage?

---

## Явная рекомендация

- **Делать следующим этапом:** `Option E — RF lifecycle/repeatability/redemption stabilization`.
- **Не делать следующим этапом:** `Option F economy/rewards` и `Option D Connect projection`.
- **Почему:** сначала зафиксировать предсказуемую продуктовую механику ваучера и lifecycle truth, чтобы economy работала на устойчивых фактах, а не на неполной operational модели.

