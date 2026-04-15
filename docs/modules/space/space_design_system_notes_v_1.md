# Space Design System Notes v1

**Project:** Go2Asia  
**Module:** Space Asia  
**Document role:** Design system guidelines and UI pattern notes for Space frontend  
**Status:** Draft for design + frontend alignment

---

# 1. Purpose

This document defines the **visual and interaction design system** for Space Asia.

It complements:

- `space_ui_ux_concept_v3.md`
- `space_frontend_information_architecture_v1.md`
- `space_ui_backend_mapping_v1.md`

Goal:

- ensure visual consistency
- define reusable UI patterns
- align UX behavior with architecture
- support scalable frontend development

---

# 2. Core Design Principles

## 2.1 Calm and Structured

UI must feel:

- clean
- predictable
- non-chaotic

Avoid:

- cluttered feeds
- aggressive colors
- noisy layouts

---

## 2.2 Action-first UI

Every major element should answer:

> What can the user do next?

---

## 2.3 Context over Decoration

Visual hierarchy must reflect:

- action importance
- data relevance
- user state

---

## 2.4 System, not Screens

UI should feel like a **system**, not isolated pages.

---

# 3. Layout System

## 3.1 Mobile-first grid

- single-column base
- stacked blocks
- progressive disclosure

## 3.2 Desktop layout

- left sidebar (navigation)
- center column (main content)
- optional right rail (assistant / signals)

---

# 4. Core UI Components

## 4.1 Card System (важнейший элемент)

Все основные сущности отображаются через карточки.

---

### Types of Cards

#### 1. Feed Card

Used for posts.

Contains:
- author block
- content
- media
- embedded object preview
- actions

---

#### 2. Organizer Card

Used for tasks/actions.

Contains:
- title
- status
- time
- action buttons

---

#### 3. Signal Card

Used for system signals.

Examples:
- Points update
- expiring voucher
- quest progress

---

#### 4. AI Suggestion Card

Used for assistant actions.

Contains:
- suggestion
- context
- action buttons

---

#### 5. Group Card

Used in Community.

Contains:
- title
- description
- members
- activity

---

#### 6. PRO Card

Used in PRO workspace.

Contains:
- object summary
- status
- operational actions

---

# 5. Feed Card Taxonomy

## 5.1 Base structure

- author header
- content body
- media block
- embedded object
- actions row

## 5.2 Variants

- text-only
- media-first
- repost
- group post
- system post

---

# 6. Organizer UI Patterns

## 6.1 Status indicators

- planned
- pending
- completed
- automated

Use color + icon, not color alone.

---

## 6.2 Action chips

Each item should have:

- remind
- open
- execute
- reschedule

---

## 6.3 Grouping

- timeline
- plans
- actions
- signals

---

# 7. Dashboard Patterns

## 7.1 Block hierarchy

Order of importance:

1. Today
2. Next Actions
3. Organizer
4. Signals
5. Social Pulse
6. AI

---

## 7.2 Block behavior

- collapsible
- scrollable inside block if needed
- CTA always visible

---

# 8. Assistant UI Patterns

## 8.1 Placement

- embedded cards
- side panel (desktop)
- bottom sheet (mobile)

---

## 8.2 States

- suggestion
- prepared
- requires confirmation
- executed

---

## 8.3 Interaction

- always explicit
- never silent automation

---

# 9. Navigation Patterns

## 9.1 Primary navigation

- Dashboard
- Feed
- Community
- Organizer
- Activity
- Profile

---

## 9.2 Secondary navigation

- Saved
- My Posts
- Assistant

---

## 9.3 PRO navigation

Separate entry:

- "Open PRO Workspace"

---

# 10. Visual Language

## 10.1 Colors

- neutral base
- soft accents
- minimal saturation

## 10.2 Typography

- clear hierarchy
- readable at small sizes

## 10.3 Elevation

- soft shadows
- layered cards

---

# 11. Interaction Patterns

## 11.1 Click vs Expand

- click → navigation
- expand → reveal details

---

## 11.2 Modals

Use for:
- confirmations
- destructive actions

---

## 11.3 Sheets / Drawers

Use for:
- assistant
- quick actions

---

# 12. PRO Workspace Design Distinction

PRO UI must feel:

- more dense
- more structured
- more operational

Differences from Space:

- less visual storytelling
- more tables / lists
- more controls

---

# 13. Anti-Patterns

Avoid:

- Facebook-like noisy feed
- Telegram-like chat UI
- generic SaaS dashboard overload
- mixing personal and PRO layers

---

# 14. Final Principle

> Design Space as a system where users act, not just scroll.

---

# 15. Recommended Placement

```text
docs/modules/space/space_design_system_notes_v1.md
```

This document should be used by:

- designers
- frontend developers
- product team

