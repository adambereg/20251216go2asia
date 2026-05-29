# Stage 14.0 - Content & Data Seeding Plan / Seed Map (v1)

## 1) Executive Summary

Go2Asia находится в состоянии `READY_FOR_STAGE_14_CONTENT_DATA_SEEDING` после Stage 12I, 13, 13A.1, 13A.2.  
Stage 14.0 определяется как planning/governance slice: сформировать минимальный seed-map для правдоподобного "living bounded ecosystem MVP" без перехода в fake fully-operational production.

Ключевой принцип: повышаем контентную и навигационную плотность, но не эскалируем семантику до authority/proof/grant/receipt.

Обязательные инварианты сохраняются без изменений:

```text
mock_data != proof
projection != authority
preview != grant
dashboard != receipt
wallet != financial_wallet
listing_projection != inventory_authority
inquiry != booking
lookup != proof
diagnostic_snapshot != customer_proof
operational_trace != immutable_audit_ledger
owner_fact = authoritative
Path_B_inactive = true
public_launch_implied = false
```

## 2) Current Ecosystem Density Assessment

Текущее состояние экосистемы: функциональные user journeys собраны, но плотность данных и контента неравномерна.

- **С уже рабочей полезной плотностью:** Atlas, Pulse, Blog, RF catalog surfaces, Rielt inquiry surfaces, Connect projection surfaces, Space core routes.
- **С контролируемой разреженностью (intentional sparse/deferred):** Space deferred routes (`quests`, `vouchers`, `activity-summary`, `badges`, `referrals`, `settings`), Quest leaderboard/edit/complete edges, RF PRO subroutes, Partner panel, Settings/Help/About.
- **С высокой семантической чувствительностью к fake-authority:** wallet/balance, VIP/entitlement, verified, booking/inquiry, admin diagnostics, moderation-like signals.

Вывод: для Stage 14 нужен не "массовый synthetic crowd", а targeted seed topology с controlled realism и bounded continuity edges.

## 3) Seed Readiness By Module

| Module / Bounded Context | Нужен seed-content | Минимальные entities | Допустимый realism | Governance risk | Чувствительные surfaces |
|---|---|---|---|---|---|
| Atlas | Да | countries, cities, places, guides, thematic cards | Средний | Средний | place detail tabs, guide tabs (чтобы не выглядело authoritative справочником с гарантиями) |
| Pulse | Да | events, event tags, event highlights | Средний | Средний | event badges/labels (`verified` wording) |
| Blog | Да (контентная плотность) | posts, categories, themes | Средний | Низкий | editorial claims, ссылки на operational domains |
| Space | Да (ограниченно) | profiles-lite, posts-lite, community groups-lite | Низкий-средний | Средний | `verified`/social proof, activity narrative |
| Quest | Да (каталоговый слой) | quest cards, objective previews, progress previews | Низкий-средний | Высокий | completion/reward framing (не grant) |
| Connect | Да (только projection density) | activity rows, level progress previews, referral previews | Низкий | Очень высокий | wallet/balance/ledger-like phrasing |
| RF | Да | partners, offers, voucher previews, partner metadata | Средний | Очень высокий | claim/redeem adjacent zones, entitlement copy |
| VIP | Да (copy/preview only) | vip preview badges, access hints | Низкий | Очень высокий | premium gating vs grant illusion |
| Partner | Ограниченно | partner profile skeletons, capabilities summary | Низкий | Средний | role/authority tone |
| Rielt | Да | listings projection, inquiry preview states, media previews | Средний | Очень высокий | availability/booking wording |
| Profile | Да (минимально) | profile overview cards, activity pointers | Низкий | Средний | identity/verification interpretation |
| Notifications | Да (минимально) | notification previews, state buckets | Низкий | Средний | not proof/receipt framing |
| Activity | Да (bounded) | timeline rows by source type | Низкий | Высокий | operational trace vs immutable ledger confusion |
| Admin diagnostics | Да (internal preview only) | diagnostic snapshots, lookup pointers | Низкий | Очень высокий | customer-proof misinterpretation |
| Support/internal surfaces | Да (internal preview only) | support context cards, navigation pointers | Низкий | Высокий | support verdict illusion |

## 4) Minimal Viable Seed Categories

Минимальный набор seed categories для coherent MVP:

1. **Discovery Catalog Seeds**  
   Atlas/Pulse/Blog/RF/Rielt каталожные карточки.
2. **Journey Continuity Seeds**  
   Ссылочные continuity entities между Quest -> Connect -> Activity, Rielt -> Inquiry, RF -> My vouchers (без grant semantics).
3. **Projection Narrative Seeds**  
   Read-only rows и metadata envelopes, демонстрирующие state visibility без owner authority.
4. **Internal Preview Seeds**  
   Admin/support diagnostics snapshots и lookup pointers с internal-only framing.
5. **Controlled Empty-State Seeds**  
   Намеренно sparse зоны, где пустота - ожидаемое поведение и часть governance.

## 5) Projection vs Authority Boundary Analysis

Stage 14 seed-map должен разделять данные на классы:

- **Projection-only (допустимо):**
  - read-only summaries;
  - inquiry previews;
  - entitlement previews;
  - diagnostics snapshots;
  - catalog/listing previews.
- **Authority-only (недопустимо для seed имитации):**
  - реальные balances и settlement traces;
  - реальные booking confirmations;
  - реальные reward grants / payout receipts;
  - реальные moderation actions;
  - реальные immutable audit records;
  - реальные verification proofs / ownership guarantees.

Операционное правило Stage 14: seed может усиливать ощущение "живой среды", но не может создавать "доказательство операционной истины".

## 6) Sensitive Semantic Zones

Наиболее чувствительные semantic zones:

- **Wallet/Balance:** любой numeric narrative легко читается как финансовый факт.
- **NFT/Path B:** любые признаки активации Path B запрещены.
- **VIP/Entitlement:** preview не должен выглядеть как grant.
- **Booking/Settlement:** inquiry flow не должен создавать booking illusion.
- **Verified/Authority:** badge/label не равен proof.
- **Admin/Moderation/Diagnostics:** internal snapshot не customer evidence.

Для этих зон обязателен conservative realism: меньше объёма, больше явного projection framing.

## 7) Sparse vs Dense Surface Strategy

Стратегия распределения плотности:

- **Dense-minimum (требуют minimum ecosystem density):**
  - Atlas, Pulse, Blog, RF catalog, Rielt listings, Quest catalog, Space core feed.
- **Sparse-by-design (должны остаться intentionally sparse):**
  - Space deferred routes;
  - Quest leaderboard/edit/complete deferred edges;
  - RF PRO deferred subroutes;
  - Partner/Settings/Help/About placeholders;
  - internal-only support/admin details.
- **No-overpopulation zones:**
  - Connect wallet-like narratives;
  - VIP/verified-heavy clusters;
  - diagnostics/admin histories;
  - synthetic social crowd simulation at production scale.

## 8) Recommended Seed Topology

Рекомендуемая topology для Stage 14:

1. **Layer A - Content Discovery Core**  
   Atlas + Pulse + Blog: curated статические и manually-authored контентные seeds.
2. **Layer B - Marketplace/Intent Core**  
   RF + Rielt + Quest каталоги: curated + generated-limited наборы с явным preview/projection framing.
3. **Layer C - Continuity Graph**  
   Connect + Activity + Notifications + Profile + Space links: lightweight synthetic relationship graph (actor reuse, cross-route continuity).
4. **Layer D - Internal Preview Ring**  
   Admin diagnostics/support previews: строго internal context, без customer authority signals.

Типы данных по topology:

- **Static:** taxonomy, labels, canonical copy.
- **Generated (bounded):** route-level sample rows для continuity.
- **Pseudo-random (ограниченно):** temporal offsets, не бизнес-факты.
- **Curated:** каталожные карточки, narrative flows.
- **Manually-authored:** high-risk copy в wallet/VIP/verified/booking zones.

## 9) Controlled Realism Strategy

Рекомендуется:

- **Synthetic timestamps:** да, для живости, но без финансово-операционной значимости.
- **Temporal staggering:** да, чтобы исключить "all-at-once fake batch" эффект.
- **Progressive freshness illusion:** да, только в projection surfaces.
- **Controlled empty states:** да, как часть bounded honesty.
- **Warm ecosystem strategy:** да, через dense-minimum в core discovery + continuity graph.
- **Sparse-but-believable approach:** да, для deferred/internal/sensitive zones.
- **Actor reuse strategy:** да, ограниченный пул актеров для cross-module continuity.
- **Synthetic relationship graph:** да, но без owner authority edges.

Нерекомендуется:

- fake economy illusion;
- massive crowd simulation;
- фальшивая production-плотность в admin/finance/verification domains.

## 10) Seed Lifecycle / Reset Considerations

Нужен lifecycle подход (документационный, без implementation в Stage 14.0):

- **Baseline seed set:** минимальный стабильный набор для demo/QA/UX continuity.
- **Refresh window policy:** контролируемое обновление timestamps и части projection rows.
- **Reset policy:** детерминированный возврат к baseline без изменения семантики.
- **Environment labeling:** явное разделение demo/preview/smoke datasets.
- **Drift guardrails:** запрет накопления "случайной реалистичности", превращающей preview в pseudo-authority.

## 11) Stage 14 Sequencing Proposal

Предложение sequencing в bounded scope:

1. **14.0.A - Seed Taxonomy & Boundaries**  
   Утвердить словарь категорий и projection-only перечень.
2. **14.0.B - Core Discovery Density Plan**  
   Atlas/Pulse/Blog минимальная живая плотность.
3. **14.0.C - Journey Continuity Seed Map**  
   Quest/Connect/RF/Rielt/Space continuity edges.
4. **14.0.D - Sensitive Zone Controls**  
   wallet/VIP/verified/booking/admin guardrail matrix.
5. **14.0.E - Lifecycle/Reset Governance**  
   baseline-refresh-reset подход.

Это sequencing-предложение относится только к planning/documentation уровню Stage 14.0.

## 12) Recommended First Implementation Slice

Рекомендованный первый implementation slice после Stage 14.0 planning:

**"Core Discovery Non-Authority Seed Pack"**  
в пределах Atlas + Pulse + Blog с минимальными continuity links в RF/Rielt discovery.

Почему первым:

- низкий риск fake-authority;
- высокий визуальный эффект "живой экосистемы";
- минимальная зависимость от wallet/VIP/booking/admin семантики.

Важно: этот раздел фиксирует рекомендацию порядка, но не выполняет implementation.

## 13) Explicit Non-Goals

Вне scope Stage 14.0:

- runtime implementation;
- schema/database migrations;
- API expansion;
- OpenAPI edits;
- SDK regeneration;
- feature development;
- auth changes;
- economy redesign;
- wallet/NFT semantics activation;
- Path B activation;
- fake production realism;
- massive auto-generated social simulation;
- refactor.

## 14) Governance Safety Review

Результат safety review для seed-map:

- План совместим с Stage 12I/13/13A governance baseline.
- Семантические boundaries явно отделяют projection от authority.
- Для high-risk зон задан conservative режим density.
- Intentional sparse/deferred поверхности сохраняются.
- Internal diagnostics и support surfaces остаются non-customer-proof.

Итог: при соблюдении seed taxonomy и sensitive-zone guardrails риск semantic drift управляем.

## 15) Final Readiness Verdict

`READY_FOR_STAGE_14_1_SEED_TAXONOMY_AND_DISCOVERY_DENSITY_EXECUTION_PLANNING`

Go2Asia готов переходить к следующему bounded шагу после Stage 14.0:  
создание ограниченного implementation плана seed-данных, который делает продукт визуально "живым bounded ecosystem MVP", но не имитирует fully-operational production authority.

