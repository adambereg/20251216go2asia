# Space Frontend Information Architecture v1

**Project:** Go2Asia  
**Module:** Space Asia  
**Document role:** Frontend IA / route / navigation / screen hierarchy SSOT for Space Asia  
**Status:** Draft for frontend implementation and design alignment

---

# 1. Purpose

This document defines the **frontend information architecture** of Space Asia.

It describes:

- route structure;
- screen hierarchy;
- navigation model;
- mobile vs desktop behavior;
- major component zones;
- modal / sheet / drawer strategy;
- relationship between Space and PRO Console.

This document is a bridge between:

- `space_ui_ux_concept_v3.md`
- `space_ui_backend_mapping_v1.md`
- backend/domain architecture documents

Its goal is to keep the frontend coherent, scalable, and aligned with the evolving backend.

---

# 2. Core Frontend Principle

Space Asia should not be implemented as a classic social app with one dominant feed and a collection of secondary tabs.

Instead, the frontend should reflect the newer product model:

> **Space Asia = user operating system inside Go2Asia**

This means the frontend must prioritize:

- Dashboard-first navigation;
- action-oriented surfaces;
- clear transitions between social, planning, and assistant layers;
- a distinct boundary between personal Space and PRO Workspace.

---

# 3. Top-Level Frontend Zones

Space frontend consists of three major top-level zones:

## 3.1 Personal Space Zone

This is the default user-facing Space area.

Includes:

- Dashboard
- Feed
- Community
- My Posts
- Saved
- Organizer
- Activity
- Profile

## 3.2 Assistant Interaction Zone

This is not a completely separate app section, but a layer that appears across Space surfaces.

Includes:

- assistant suggestion cards
- assistant side panel / drawer / sheet
- AI prompts inside organizer
- automation prompts

## 3.3 PRO Workspace Zone

Separate operational contour for PRO users.

Includes:

- PRO Overview
- Events
- Quests
- Groups
- Partners
- Moderation
- Analytics
- PRO Organizer

---

# 4. Route Model

Recommended route structure:

```text
/space
/space/feed
/space/community
/space/community/groups/[groupId]
/space/my-posts
/space/saved
/space/organizer
/space/activity
/space/profile/[userId]
/space/post/[postId]
/space/create
/space/assistant

/pro
/pro/events
/pro/quests
/pro/groups
/pro/partners
/pro/moderation
/pro/analytics
/pro/organizer
```

---

# 5. Route Semantics

# 5.1 `/space`

## Role
Main entry point of Space Asia.

## Screen
Dashboard.

## Why
Dashboard is the operating cockpit and should be the default landing screen.

---

# 5.2 `/space/feed`

## Role
Social stream surface.

## Contains
- Following
- Groups
- Around Me
- Curated

## Notes
Feed is important but not the home screen.

---

# 5.3 `/space/community`

## Role
Entry point into groups and community structure.

## Contains
- recommended groups
- local communities
- thematic groups
- featured PRO-led groups

---

# 5.4 `/space/community/groups/[groupId]`

## Role
Detailed group page.

## Contains
- group header
- about
- members preview
- group feed
- pinned content
- join state

---

# 5.5 `/space/my-posts`

## Role
Authored content management surface.

## Contains
- Posts
- Reposts
- Drafts
- Archived

---

# 5.6 `/space/saved`

## Role
Saved items as action source.

## Contains
- saved posts
- places
- events
- quests
- partners
- listings
- collections / folders conceptually

---

# 5.7 `/space/organizer`

## Role
Execution and planning surface.

## Contains
- Timeline
- Plans
- Actions
- Signals
- Growth
- AI actions

---

# 5.8 `/space/activity`

## Role
Activity aggregation surface.

## Contains
- social activity
- system notifications
- AI-related items
- group activity
- opportunity signals

---

# 5.9 `/space/profile/[userId]`

## Role
Social identity page.

## Contains
- profile header
- role/status
- reputation signals
- content tabs
- groups
- highlights

---

# 5.10 `/space/post/[postId]`

## Role
Single post detail surface.

## Contains
- full post
- repost preview
- media gallery
- interaction entry points
- linked ecosystem object context if any

---

# 5.11 `/space/create`

## Role
Dedicated create-post flow.

## Contains
- composer
- media attach flow
- attach ecosystem object
- choose visibility
- choose group / personal posting
- save draft if supported later

---

# 5.12 `/space/assistant`

## Role
Expanded assistant interaction surface.

## Contains
- AI suggestions
- prepared actions
- macro ideas
- automation confirmations

## Notes
This may initially exist as a panel/sheet rather than full page, but route support is still useful.

---

# 5.13 `/pro`

## Role
Entry point into PRO Workspace.

## Screen
PRO Overview.

## Notes
This route is not part of personal Space tabs. It is a separate operational contour.

---

# 5.14 PRO subroutes

### `/pro/events`
PRO event management.

### `/pro/quests`
PRO quest management.

### `/pro/groups`
PRO-led groups management.

### `/pro/partners`
RF partner workflows.

### `/pro/moderation`
Moderation queue.

### `/pro/analytics`
Operational analytics.

### `/pro/organizer`
PRO task organizer.

---

# 6. Navigation Model

# 6.1 Core navigation principle

The frontend should have **one primary navigation for personal Space** and **one explicit transition into PRO Workspace**.

Do not blur them into one overloaded mega-nav.

---

# 6.2 Primary navigation for Space

Recommended primary items:

- Dashboard
- Feed
- Community
- Organizer
- Activity
- Profile

Secondary or contextual items:

- Saved
- My Posts
- Assistant

---

# 6.3 PRO transition

For PRO users, Dashboard should include a compact PRO widget with CTA:

- `Open PRO Workspace`

This should be the main transition from personal Space to PRO mode.

---

# 6.4 Mobile navigation

Recommended mobile bottom navigation:

- Dashboard
- Feed
- Organizer
- Activity
- Profile

Community, Saved, My Posts, Assistant should be accessible through:

- top bar actions
- overflow menu
- secondary tab switchers
- nested section pages

---

# 6.5 Desktop navigation

Recommended desktop structure:

- left sidebar for primary navigation
- top app bar for context actions and assistant entry
- right rail optional for contextual panels (assistant / activity / quick widgets)

---

# 7. Screen Hierarchy

The frontend should follow a clear hierarchy.

## Level 1 — Operating surfaces

- Dashboard
- Organizer
- Feed

These are the most frequently used personal surfaces.

## Level 2 — Community and content management surfaces

- Community
- My Posts
- Saved
- Activity
- Profile

## Level 3 — Detail and focused task surfaces

- Post detail
- Group detail
- Create post
- Assistant

## Level 4 — Operational PRO surfaces

- PRO Overview
- PRO Events
- PRO Quests
- PRO Groups
- PRO Partners
- PRO Moderation
- PRO Analytics
- PRO Organizer

---

# 8. Major Component Zones by Screen

# 8.1 Dashboard zones

Recommended zone layout:

1. User header
2. Today
3. Next Actions
4. Organizer Preview
5. Ecosystem Signals
6. Social Pulse
7. AI Assistant Suggestions
8. PRO Widget (conditional)

---

# 8.2 Feed zones

1. filter bar
2. composer entry
3. feed card list
4. contextual floating action button on mobile for quick post creation

---

# 8.3 Organizer zones

1. Today / timeline
2. Plans
3. Actions
4. Signals
5. Growth
6. AI Actions / Automation

---

# 8.4 Profile zones

1. profile header
2. social identity block
3. status / badges / trust signals
4. tabbed content area
5. ecosystem summary highlights

---

# 8.5 PRO Overview zones

1. operational summary
2. pending tasks
3. quick links
4. PRO organizer preview
5. analytics highlights

---

# 9. Mobile vs Desktop Behavior

# 9.1 Mobile-first rule

The frontend must be designed mobile-first.

Mobile is the primary behavior model.

Desktop should expand and redistribute, not redesign from scratch.

---

# 9.2 Dashboard mobile behavior

- single-column stacked blocks
- compact cards
- strong priority order
- assistant appears as card list or sheet trigger

---

# 9.3 Dashboard desktop behavior

Suggested layout:

- main center column for Today / Next Actions / Organizer
- left navigation
- right contextual rail for assistant / ecosystem signals / PRO widget

---

# 9.4 Feed mobile behavior

- single stream
- sticky top filters
- floating composer action

# 9.5 Feed desktop behavior

- wider content cards
- optional right rail for trends / community suggestions / assistant

---

# 9.6 Organizer mobile behavior

- stacked action cards
- strong status badges
- expandable sections

# 9.7 Organizer desktop behavior

- timeline column + side context panels
- more visible grouping by action category

---

# 9.8 PRO Workspace desktop bias

PRO Workspace should still work on mobile, but it is naturally more desktop-friendly.

Desktop should expose:

- richer tables/lists
- multi-panel views
- side-by-side task and detail zones

---

# 10. Modal / Sheet / Drawer Strategy

Not every interaction should become a full page.

---

# 10.1 Use full pages for

- Dashboard
- Feed
- Community
- Organizer
- Activity
- Profile
- PRO sections

---

# 10.2 Use sheets / drawers for

- quick assistant interactions
- save-to-organizer action
- quick action details
- reminder edit
- mini-create flows on mobile

---

# 10.3 Use modals for

- confirmations
- destructive actions
- AI execution approvals
- status changes

---

# 10.4 Use inline expanders for

- feed filters
- organizer sub-block details
- ecosystem signal expansion

---

# 11. Assistant UI Strategy

The assistant should be visible but not intrusive.

## Recommended surfaces

### Embedded cards
On Dashboard and Organizer.

### Side panel / drawer
Quick access assistant on desktop.

### Bottom sheet
Assistant action prompts on mobile.

### Dedicated `/space/assistant` route
For deeper workflows.

---

# 12. Relationship Between Space and PRO Workspace

This relationship must be visually and structurally explicit.

## Rule

> Personal Space and PRO Workspace are connected but distinct.

### Space
- life
- social activity
- personal plans
- AI interaction

### PRO Workspace
- work
- operational tasks
- curation
- moderation
- partner workflows

---

## UX transition rule

Primary transition path:

- Dashboard → PRO Widget → PRO Workspace

Secondary path:

- profile / user menu → PRO Workspace

---

# 13. Frontend Data Loading Strategy

The frontend should not assume that one screen always maps to one API call.

## Recommended strategy

### Simple screens
Use direct feature-level API consumption:
- Feed
- Group detail
- Post detail
- My Posts

### Composite screens
Use composition loaders / BFF adapters:
- Dashboard
- Organizer
- Activity
- PRO Overview

This is especially important because Space UI is broader than Space Service.

---

# 14. Route-to-Domain Summary

| Route | Primary Backend Domain | Notes |
|---|---|---|
| `/space` | mixed | dashboard composition |
| `/space/feed` | Space | social feed |
| `/space/community` | Space | groups and discovery |
| `/space/community/groups/[groupId]` | Space | group detail |
| `/space/my-posts` | Space | authored posts |
| `/space/saved` | mixed | saved action source |
| `/space/organizer` | mixed / transitional | planner-like surface |
| `/space/activity` | mixed | social + system + assistant activity |
| `/space/profile/[userId]` | Space + adjacent summaries | social identity |
| `/space/post/[postId]` | Space | post detail |
| `/space/create` | Space + Media | creation flow |
| `/space/assistant` | assistant layer | interaction surface |
| `/pro/*` | multi-service | operational contour |

---

# 15. Recommended File / Feature Structure (Frontend)

Suggested frontend feature grouping:

```text
features/
  space-dashboard/
  space-feed/
  space-community/
  space-groups/
  space-posts/
  space-saved/
  space-organizer/
  space-activity/
  space-profile/
  space-assistant/
  pro-workspace/
```

Shared UI patterns:

```text
components/space/
  cards/
  widgets/
  feed/
  organizer/
  assistant/
  profile/
  community/
  pro/
```

---

# 16. Frontend Guardrails

## Do not do

- do not make Feed the home route
- do not merge PRO nav directly into personal Space nav
- do not hardcode dashboard as if it came from one Space endpoint
- do not assume Organizer is permanently owned by Space Service
- do not treat AI assistant UI as proof that Space Service owns AI logic

## Must do

- preserve Dashboard-first IA
- preserve clear separation between personal and PRO contours
- use adapters for composite screens
- keep mobile-first behavior intact
- build extraction-friendly Organizer UI

---

# 17. Final Summary

This information architecture establishes a frontend model in which:

- Dashboard is the operating center
- Feed is a social mode, not the home of the module
- Organizer is an execution surface
- Saved is an action source
- Assistant is a visible interaction layer
- PRO Workspace is a second contour, not just another tab

Short formula:

> **Space Asia frontend = Dashboard-first user operating system with social, planning, assistant, and PRO layers kept structurally distinct.**

---

# 18. Recommended Placement in Monorepo

Recommended path:

```text
docs/modules/space/space_frontend_information_architecture_v1.md
```

Reason:

- this is a frontend/product information architecture document
- it belongs next to UI/UX concept and frontend/backend mapping docs
- it should remain separate from backend architecture docs in `docs/architecture/space/`

