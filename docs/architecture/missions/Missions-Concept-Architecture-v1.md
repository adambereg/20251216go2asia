# Missions in Go2Asia — Concept & Architecture

## 1. Definition

**Missions** is a goal-oriented task system that guides users through the Go2Asia ecosystem and rewards them for valuable actions.

Missions are **not a separate module** (like Quest, RF, or Space).  
They are an **overlay across the entire system**, answering the user’s question:

> *“What can I do next to gain value, status, Points, badges, access, or new opportunities?”*

---

## 2. Missions vs. Quest (Key Difference)

| Quest | Missions |
|-------|----------|
| Scenario-based journey | Behavior-driven system |
| Route / adventure | Managed engagement |
| Game / tourism experience | Action economy |

> **Quest** = “complete the path”  
> **Missions** = “perform an action”

---

## 3. Why Go2Asia Needs Missions

Go2Asia has many modules:

- Atlas, Pulse, Blog, Space, RF, Rielt, Quest, Connect, Points, Referral, Badges

Without guidance, users get lost.  
Missions transform the ecosystem from a set of sections into a **managed behavior routing system**.

---

## 4. Main Role of Missions

Missions act as the **operating system for user engagement**:

- Activate new users
- Retain existing ones
- Develop Spaces
- Fill Atlas / Blog
- Stimulate RF economy
- Encourage Quests
- Boost Referrals
- Give PRO users clear business tasks
- Link actions to Points, Badges, future G2A/NFT

---

## 5. Architectural Position (Critical)

### Missions = Orchestration Layer

Modules (Space, RF, Rielt, Quest, Atlas, Pulse, Blog)
↓ events
Missions (orchestration layer)
↓ reward intents
Points / Badges / Connect

### Missions do **NOT**:

- Own business logic of modules
- Own source of truth (SSOT)
- Become part of Quest
- Award Points directly

### Missions **DO**:

- Listen to events
- Check conditions
- Update progress
- Create **reward intents**

---

## 6. Mission Types

### 6.1 Onboarding Missions
Goal: First value.

Examples: register, complete profile, select country, follow city, join first group, first post, invite first friend.

### 6.2 Social Missions
Goal: Revitalize Space.

Examples: 3 posts, 10 likes, 5 comments, join 3 groups, help a newcomer, repost, post a trip report.

### 6.3 Content Missions
Goal: Fill Atlas, Blog, Pulse.

Examples: suggest a place, add photo, write review, propose event, write a note for Blog, event report.

### 6.4 Referral Missions
Goal: Grow audience.

Examples: invite first friend, invite 5 friends, help referral become active, reach first post, reach VIP, build active referral chain.

### 6.5 RF Missions
Goal: Develop Russian Friendly network.

**For users:** get first RF voucher, use voucher, leave RF review, visit 3 RF places.

**For PRO:** bring first business partner, help complete profile, help issue voucher, reach first 3 redemptions, prepare partner report.

### 6.6 Rielt Missions
Goal: Develop housing market.

Examples: first listing, verify property, upload photos, first inquiry, help find housing, post-rent review, confirm listing status.

### 6.7 Quest Missions (Two levels)

- **Inside Quest:** mission as a quest step
- **Ecosystem level:** complete first quest, complete 3 quests in one city, complete RF quest, create own quest (PRO), get 10 participants, add RF places to quest.

### 6.8 PRO Missions
Goal: Develop curators.

Examples: first group, expert post, first event, first quest, first partner, help issue voucher, verify 5 properties, 100 followers, high rating.

### 6.9 Seasonal Missions
Goal: Time-based activity.

Examples: Bangkok Week, RF Month, Summer Island Challenge, Off-season Route, 7 posts in 7 days, Review Festival.

### 6.10 Business Missions
Goal: Engage partners.

Examples: complete profile, add photos, first voucher, first 10 saves, first review, respond to reviews, update card, launch premium voucher.

---

## 7. Tier System (NEW)

- **Tier 0** — Onboarding
- **Tier 1** — Basic actions
- **Tier 2** — Engagement
- **Tier 3** — Economy
- **Tier 4** — PRO / Business

→ Foundation for progression.

---

## 8. Mission Chains (NEW)

Missions should form chains:

> Complete profile → Write first post → Get likes → Get featured in Blog

→ Creates a sense of journey.

---

## 9. Personalization (NEW)

Missions depend on:

- Role (spacer / VIP / PRO)
- Geography
- User stage
- Behavior

---

## 10. Contextual Missions via Guru (NEW — Key Feature)

Examples:

- “RF place nearby — get voucher”
- “Quest point nearby”
- “Leave a review for nearby place”

---

## 11. Where Missions Live

### Option 1 (MVP)
Inside **Connect**

### Option 2 (Target)
Separate **missions-service**

Connect remains the showcase.

---

## 12. Domain Model

### Mission
- id, title, description, type, scope, target_role
- conditions, rewards, priority, visibility

### UserMissionProgress
- user_id, mission_id, status, progress_current, progress_required
- completed_at, reward_status

### Condition
- event_type, operator, value

### Reward (Critical)
- type: POINTS | BADGE | ACCESS | MULTIPLIER

---

## 13. Critical Rule

> Missions **DO NOT** award rewards directly.

Mission → reward intent → Points Service / Badges

---

## 14. Mission Lifecycle

1. Mission created
2. User sees it
3. Action happens in any module
4. Module sends event
5. Missions updates progress
6. Reward intent created
7. Points/Badges execute reward
8. Connect shows result

---

## 15. Event Sources

- Space, RF, Rielt, Quest, Referral, Content (Blog/Atlas/Pulse)

---

## 16. Principle of Truth Ownership

Missions **do not validate reality**.  
They react only to **confirmed events** from domain owners.

---

## 17. Where Users See Missions

- Connect (main screen)
- Inside modules (Space, RF, Quest, Rielt)
- Guru (contextual)
- Push / notifications

---

## 18. Anti-Abuse Layer (NEW)

Necessary:

- Limits
- Cooldown
- Quality signals
- Anti-spam

---

## 19. Mission Management (NEW)

Managed by:

- Admin
- PRO (partially)
- System

---

## 20. MVP Scope (NEW)

First iteration:

- Onboarding
- Referral
- Basic social

> ❗ Do **not** build everything at once.

---

## 21. Role of Missions in the Economy

Missions:

- Control Points distribution
- Regulate behavior
- Manage inflation
- Guide users

---

## 22. Example Missions (Preserved from original)

**For new users:**  
Complete profile, choose city, join first group, first post, save first place, invite first friend.

**For active Spacers:**  
5 useful posts, 20 likes, 10 comments, answer beginners, weekly digest, invite inactive friends.

---

## 23. Final Definition

> **Missions** is an ecosystem-wide orchestration layer that links events from all Go2Asia modules into clear user goals and manages progress, engagement, and rewards.