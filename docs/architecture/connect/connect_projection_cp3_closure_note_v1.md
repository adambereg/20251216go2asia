# Connect Projection CP-3 Closure Note v1

## 1. Purpose

Зафиксировать закрытие CP-3 как audit-only slice в рамках Connect Projection v1.

CP-3 был нужен после CP-1/CP-2, потому что semantic/projection слой уже стабилизирован, но dashboard composition показал отдельные UX-риски, требующие самостоятельной дизайн-фазы.

## 2. Status

- CP-3 status: completed as read-only audit.
- Implementation status: intentionally deferred.
- No code/runtime/backend/API/UI changes.

## 3. Scope Covered

- dashboard composition map;
- RF composition assessment;
- referrals composition assessment;
- wallet/finance perception audit;
- future placeholders / badges / missions / analytics assessment;
- guardrails continuity check from CP-2 (query/lifecycle/precedence boundaries).

## 4. Key Findings

- dashboard operationally useful, but dense and long;
- RF visually dominates dashboard;
- RF details/timeline in-place behave like mini-cabinet risk;
- activity feed and RF activity compete for attention;
- referrals are intentional growth mechanism and should not be suppressed;
- wallet keeps mild quasi-finance perception risk;
- placeholders are mostly honest and well-bounded.

## 5. Guardrails Preserved

- RF remains source of truth.
- Connect remains read-only projection/explanation layer.
- no backend/API/runtime expansion.
- no reward/token/NFT/G2A expansion.
- referrals stay growth mechanism, but not MLM/earnings-first surface.
- wallet remains Points/activity view, not financial account.
- CP-2 summary/list precedence and lifecycle/query boundaries stay locked.

## 6. Decision Recorded

CP-3A Dashboard Hierarchy Tuning is deferred.

Reason:

- frontend design/tuning is moved to a dedicated future phase;
- CP-3 closure is audit/documentation only;
- CP-3 findings should guide future UX work, but do not block current roadmap.

Current dashboard is accepted as operational baseline for now.

## 7. Intentional Non-Goals

- no dashboard redesign;
- no frontend tuning now;
- no progressive disclosure implementation now;
- no RF compaction implementation now;
- no referral/wallet copy tuning now;
- no new backend/service/API;
- no economy/reward/token changes.

## 8. Recommended Future UX Work

- dashboard hierarchy tuning;
- RF dashboard compaction;
- progressive disclosure for detail-heavy blocks;
- mobile rhythm improvement;
- referrals framing polish;
- wallet perception tuning.

All items are backlog for a future dedicated design phase and are not immediate roadmap blockers.

## 9. Recommended Next Roadmap Direction

Connect projection is stable enough for continued roadmap execution.

Immediate direction should continue architecture/domain planning, for example:

- Rewards / Points Policy;
- PRO Rewards Design;
- deeper Rielt x RF integration;
- Quest / Badges / Achievements integration.

No single direction is forced by CP-3 closure itself.

