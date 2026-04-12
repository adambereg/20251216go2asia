# Quest PRO Backend Seam Set v1

**Project:** Go2Asia  
**Module:** Quest Asia  
**Document role:** Target minimum backend seam set before PRO Console UI start  
**Status:** SSOT for bounded seam definition  
**Depends on:** `quest_pro_backend_seams_definition_v1.md`, `quest_pro_backend_seams_scope_matrix_v1.md`

---

## 1. Seam set intent

This document defines the minimum server capability set that should exist before PRO Console UI design/implementation begins.

The set is intentionally narrow: enough to avoid backend bottlenecks for console work, but not an early authoring platform buildout.

---

## 2. Target seam groups

### 2.1 Ownership

**Must exist**

- explicit owner/admin authorization seams over quest management entities via `creator_pro_id`
- shared service-level ownership checks used consistently across management endpoints

**Why needed**

- future console must safely manage only owned quests (or admin scope) without endpoint-specific logic drift

**Why bounded minimum**

- this is access control shaping, not a full organization model

**Must not slip in**

- org hierarchy system
- team workspace membership architecture

---

### 2.2 Lifecycle

**Must exist**

- explicit backend transition policy for `draft -> published -> archived`
- publish-readiness checks with stable failure reasons
- bounded archive/unpublish capability

**Why needed**

- console lifecycle actions require deterministic server transitions

**Why bounded minimum**

- no new state machine; only tightening current lifecycle edges

**Must not slip in**

- custom workflow graph engine
- multi-stage editorial approval pipelines

---

### 2.3 Review

**Must exist**

- owner-scoped pending review seams
- stable review decision write path with complete response metadata (including rejection context)

**Why needed**

- manual review already exists in runtime; console needs bounded operational hooks

**Why bounded minimum**

- extends existing review path rather than introducing anti-fraud framework

**Must not slip in**

- anti-fraud scoring platform
- moderation center redesign

---

### 2.4 References

**Must exist**

- bounded server validation seams for `target_type`/`target_id` references used by Quest steps
- contract-level consistency rules for Atlas/Pulse/RF references

**Why needed**

- console authoring requires safe linkage to external domain entities

**Why bounded minimum**

- validates reference integrity, not cross-service orchestration

**Must not slip in**

- distributed authoring graph engine
- cross-product transaction orchestration layer

---

### 2.5 Read models

**Must exist**

- owner-scoped list/read models for quest management (including drafts)
- bounded filters/sorting for operational management views

**Why needed**

- console cannot function without backend read models separate from public quest catalog

**Why bounded minimum**

- targeted management reads only; no general search platform

**Must not slip in**

- broad discovery/search infrastructure
- player feed redesign

---

### 2.6 Stats

**Must exist**

- minimal curator stats for quest operations (e.g. execution/review load signals)

**Why needed**

- basic management decisions depend on lightweight server-side operational metrics

**Why bounded minimum**

- not a BI product, only bounded operational visibility

**Must not slip in**

- analytics warehouse initiative
- growth experimentation analytics platform

---

### 2.7 Permissions

**Must exist**

- explicit permission hooks for role-scoped management capabilities (`pro`, `admin`)

**Why needed**

- future console features should bind to stable capability seams instead of implicit role checks

**Why bounded minimum**

- capability hooks, not enterprise IAM/RBAC program

**Must not slip in**

- tenant-wide policy engine
- generalized policy authoring UI contracts

---

### 2.8 Revision / audit basics

**Must exist**

- minimal traceability for authoring/review lifecycle events (who/when/action baseline)

**Why needed**

- console operations require baseline accountability and debugging support

**Why bounded minimum**

- minimal audit seam only; avoids full revisioning stack

**Must not slip in**

- full document version graph
- visual history diff and rollback suite

---

## 3. Non-goal reminder

This seam set is a pre-console backend foundation.  
It is not the start of a full authoring platform, and it must not absorb verification hardening, social growth, or player UX redesign scope.
