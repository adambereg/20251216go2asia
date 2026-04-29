# Go2Asia Platform Canon v2

This directory contains the current platform-level SSOT (single source of truth) documents for Go2Asia v2.

## Current Platform Canon (v2)

- `go2asia_ecosystem_overview_v2.md`  
  Product-level ecosystem map: modules, roles, layers, and roadmap.
- `go2asia_backend_services_architecture_v2.md`  
  Backend services architecture: ownership boundaries, runtime reality, and future target.
- `go2asia_interface_architecture_v2.md`  
  Interface architecture: public modules, cabinets, consoles, Connect UI, Missions UI, and no classic chat model.

These three documents are the active Go2Asia platform canon v2 and must be treated as the primary platform-level source of truth.

## Historical Baseline Policy

Earlier conceptual documents remain a historical baseline and can be used for context only.  
If any earlier document conflicts with the v2 canon, the v2 canon takes precedence.

## How to use these docs for implementation

1. Start with `go2asia_ecosystem_overview_v2.md` to understand product-level ecosystem boundaries and platform principles.
2. Then read `go2asia_backend_services_architecture_v2.md` for backend tasks, service ownership, runtime truth, and target architecture.
3. Then read `go2asia_interface_architecture_v2.md` for frontend/UI tasks, interface boundaries, and interaction model.
4. Ensure module-level SSOT documents stay aligned with this platform-level canon.

## Canon Guardrails (v2 reminders)

- In Quest, use the term **Task** (not Quest Mission).
- Connect is a UI/product hub and is **not** a backend service owner.
- Rielt v1 is voucher-first CTA, not booking/chat/inquiry-first.
- Missions are an ecosystem orchestration layer, not part of Quest.
- RF is a partner layer.
- UI does not own domain truth; backend services own truth.
