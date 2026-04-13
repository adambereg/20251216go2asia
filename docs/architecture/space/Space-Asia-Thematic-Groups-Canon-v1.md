Space Asia — Thematic Groups Canon v1

Project: Go2Asia
Module: Space Asia
Document role: SSOT canon for thematic groups inside Space Asia
Status: Draft for product and architecture fixation

1. Purpose

This document fixes the canonical meaning of thematic groups inside Space Asia.

Its purpose is to remove ambiguity around:

what a group is in Space canon;
how a group differs from a feed surface;
who may create groups;
which types of groups exist;
how posting into a group works;
whether private-to-group sharing is allowed;
what group members can and cannot see;
how owner / moderator / member roles work;
how PRO-led groups relate to PRO Console;
where a social group ends and an operational PRO contour begins.

This canon is intended to guide:

product decisions;
UI/UX decisions;
OpenAPI and schema design;
Cursor implementation behavior;
boundary discipline between Space, Quest, RF, Pulse, Rielt, Connect, and PRO Console.

This document is aligned with the broader Space principle that Space is the social circulation layer of the Go2Asia ecosystem rather than a generic standalone social network.

2. Core Definition

A thematic group in Space Asia is a first-class social container that gathers users, posts, reposts, and reactions around a shared context such as geography, topic, curator, quest, event, or private circle.

A group exists not merely to hold content, but to create:

bounded community context;
persistent social memory;
visible collective activity;
structured circulation around ecosystem objects.

Short formula:

Post = publication unit
Feed = delivery surface
Group = community context

Groups are first-class entities in the Space social model and must not be reduced to simple feed filters. This aligns with the Space domain model where space_group and space_group_member are canonical entities of the social core.

3. Why Groups Exist

Without groups, Space risks collapsing into a flat stream of disconnected content.

Groups exist to provide:

stable social containers;
topic- or geo-bounded communities;
durable micro-feeds;
curator-led or event-linked communities;
a place where social visibility becomes collective rather than purely personal.

Groups are therefore not optional decoration. They are one of the main structures that transform Space from “a feed of posts” into “a living social layer of the ecosystem.” This matches the earlier product framing of Space where groups are a key part of community structure and not just a secondary tab.

4. Group vs Feed Surface

A feed surface answers:

“What content should be delivered here right now?”

A group answers:

“Inside which community and under which shared context does this activity exist?”

4.1 Feed surface characteristics

A feed surface is:

a delivery mechanism;
a read projection;
a stream assembled for a user or context;
potentially transient in composition.

Examples:

home feed;
profile feed;
group feed;
activity feed.
4.2 Group characteristics

A group is:

a persistent social entity;
a named container;
a membership-bearing community;
a bounded context with identity, roles, and rules.

A group has:

slug
title
description
owner
visibility
status
members and roles.
4.3 Canonical rule

A group is not the same thing as a feed.
A feed may show content from a group, but the group remains a distinct domain object in Space.

5. Group Types

At the UX and product level, the following group types are canonical.

5.1 Geo groups

Communities centered around geography.

Examples:

Phuket
Bangkok
Danang
Phu Quoc
Novosibirsk

Purpose:

local community building;
place-linked social experience;
geographically bounded context.
5.2 Thematic groups

Communities centered around a subject or lifestyle.

Examples:

relocation
housing
cafes
budget travel
digital nomads
family travel

Purpose:

topic-centered discussion;
experience exchange;
circulation of practical and social knowledge.
5.3 Curator / PRO-led groups

Communities centered around a specific PRO, curator, or recognized community leader.

Purpose:

gather trust around a person;
create a reusable social audience;
support circulation of events, quests, insights, or guidance.

These groups belong to Space as social communities, not to PRO Console as operational dashboards.

5.4 Quest groups

Communities centered around a quest or a family of quests.

Purpose:

socialize quest participation;
create visibility around progress and reports;
support collective involvement around quest activity.

Quest ownership remains in Quest Service. The group only provides the social layer around quest activity.

5.5 Event groups

Communities centered around a specific event or recurring event line.

Purpose:

create pre-event circulation;
host in-group social context;
preserve post-event afterlife.

Event ownership remains in Pulse. The group adds social community context around the event.

5.6 Private groups

Closed or invite-only social circles.

Purpose:

support smaller bounded communities;
create controlled non-public social spaces;
avoid turning Space into open-only broadcasting.

Private groups are still part of the Space social model and do not imply chat ownership or private messaging infrastructure.

6. Who May Create Groups
6.1 Canonical early-phase rule

In the early and controlled phase of Space:

admin may create groups;
PRO may create groups within approved policy;
ordinary users should not automatically gain unrestricted group-creation rights.

This prevents spam group proliferation and preserves community quality.

6.2 Recommended creation policy by type
Geo groups

Created by:

system
admin
approved curator / PRO
Thematic groups

Created by:

admin
approved PRO
optionally trusted users later
Curator / PRO-led groups

Created by:

corresponding PRO
admin
system-assisted flow
Quest groups

Created by:

system
quest-related controlled flow
admin / approved PRO where policy allows
Event groups

Created by:

system
event-related controlled flow
admin / approved PRO where policy allows
Private groups

Created by:

admin
PRO
optionally trusted users later, depending on moderation capacity
6.3 Long-term flexibility

A broader user group-creation model may appear later, but it must be a deliberate policy decision and not the default assumption of v1.

7. Canonical Group Entity

At the Space social-core level, a group is represented by space_group and group participation by space_group_member.

7.1 space_group

Core fields:

id
slug
title
description
owner_id
visibility
status
created_at
updated_at
7.2 Visibility values

Canonical values:

public
private
invite_only
7.3 Status values

Canonical values:

active
hidden
archived
8. Canonical Membership Model

Membership is explicit and must not be hidden inside group metadata.

8.1 space_group_member

Core fields:

group_id
user_id
role
status
joined_at
invited_by nullable.
8.2 Membership roles

Canonical role values:

member
moderator
owner
8.3 Membership status

Canonical status values:

active
pending
removed
blocked
9. Posting into a Group
9.1 Canonical rule

A group post is still a normal space_post, but with explicit group context.

A post published into a group must carry:

group_id
group-appropriate visibility

The Space domain model already supports group_id and visibility on space_post.

9.2 Recommended v1 behavior

For a canonical in-group publication:

group_id is required
visibility = group is the default canonical visibility

This keeps group distribution clean and avoids ambiguity.

9.3 What can be posted into a group

A user may publish to a group:

a normal post
a repost of a Space post
a repost of an ecosystem object
a post with media
a repost with opinion
a system-generated social post where allowed by policy

This fits the minimal canonical post model:

post
repost
system
9.4 Group posting is not operational ownership

Posting inside a quest-related or event-related group does not transfer domain ownership of the quest or event into Space.

Group posting remains social publication only.

10. Share from Private to Group
10.1 Canonical decision

Yes, share from private to group is allowed.

This is not a loophole or accidental visibility leak.
It is a deliberate part of the Space canon.

10.2 Product meaning

A user may first create or keep a publication inside a private personal contour, and later explicitly choose to make it socially visible by sharing it into a group.

This reflects the broader Space principle that private and semi-private activity may exist before becoming community-visible.

10.3 Important restriction

A private post must not become group-visible automatically.

The transition must require explicit user intent, such as:

“Share to group”
“Publish to group”
“Repost into group”
10.4 Implementation-safe interpretation

There are multiple acceptable technical implementations:

convert visibility and bind group_id;
create a new shared/reposted group publication derived from the private post;
create a group-visible repost of a private-origin thought.

The canon does not require one exact storage tactic, but it requires one product truth:

private-to-group sharing is explicit, intentional, and socially meaningful

11. What Group Members Can See
11.1 Group members can see

Depending on membership and visibility rules, group participants may see:

posts published into the group;
reposts published into the group;
reactions surfaced through social publication within the group;
group metadata;
visible member and moderator information according to policy;
group activity in group feed surfaces.
11.2 Group members cannot see by default

Group membership must not automatically reveal:

user private posts not shared to the group;
follower-only publications outside the group;
personal organizer items;
private Connect / Points / NFT / referral details;
PRO operational data from PRO Console;
unrelated private activity elsewhere in Space.
11.3 Canonical privacy rule

A group gives access to the group-bounded social context, not to the whole personal or operational universe of a user.

12. Role Semantics
12.1 Owner

The owner is the top-level steward of the group.

Responsibilities:

controls the group identity and configuration;
may change core editable group fields according to policy;
may appoint or remove moderators;
may approve or reject membership in controlled groups;
bears final social responsibility for the group.
12.2 Moderator

The moderator is the operating steward of the group.

Responsibilities:

enforces group rules;
handles content moderation inside the group according to moderation policy;
manages membership actions within granted authority;
helps maintain signal quality and group order.
12.3 Member

The member is a participant of the group.

Capabilities:

reads group content according to visibility rules;
posts into the group where posting is allowed;
participates in group social life;
engages through structured Space/Reactions behavior.
12.4 Canonical role rule

Roles are about community governance, not about domain ownership of Quest, Pulse, RF, or Rielt objects.

A moderator of a group does not thereby become owner of quest or event domain data.

13. Visibility and Access Rules
13.1 Public groups

Characteristics:

group profile may be publicly visible;
joining may be open or controlled by separate policy;
public group content may be visible broadly according to Space delivery policy.
13.2 Private groups

Characteristics:

group existence may be visible or partially hidden depending on policy;
content is visible only to active members;
membership is controlled.
13.3 Invite-only groups

Characteristics:

joining is not open;
membership enters through explicit invitation or approval;
group content remains restricted to approved members.
13.4 Canonical rule

Group visibility and post visibility must be coherent.

A post with visibility = group inside a group is visible only within the authorized boundaries of that group. This follows the canonical visibility model of Space posts.

14. Groups and Structured Communication

Space does not use classic comments and chat as the main community model. Instead, communication is structured through:

reactions;
reposts with opinion;
short review;
thread-based inquiry in bounded cases.
14.1 Group implication

A group is therefore not a chat room.

A group is a bounded social publication context where communication becomes visible through:

posts;
reposts;
reactions surfaced via posts and activity;
structured social discussion.
14.2 Canonical rule

The group must preserve the no-chat, no-chaotic-comment-thread principle of Go2Asia.

15. PRO-led Groups
15.1 Definition

A PRO-led group is a normal Space group whose identity or gravity center is a specific PRO, curator, or community leader.

15.2 What a PRO-led group is

It is:

a community;
a social audience container;
a trust-building surface;
a social layer around a PRO’s public presence.
15.3 What a PRO-led group is not

It is not:

a PRO task board;
a moderation queue;
a quest management interface;
a partner operations workspace;
a substitute for PRO Console.

PRO-led groups live inside Space and remain social groups.

16. Relationship Between PRO-led Groups and PRO Console
16.1 Space side

PRO, as a user, remains a normal participant of Space and may have:

a normal Space dashboard;
a personal organizer;
personal posts and reposts;
groups, including PRO-led groups.
16.2 PRO Console side

PRO Console is a separate operational contour used for:

events
quests
groups administration where operational tools are needed
partners
moderation
analytics
PRO organizer / operational workload.
16.3 Canonical relationship

PRO Console may:

create or administer PRO-led groups;
show summaries about them;
link into them;
use them as community surfaces.

But the group itself remains part of Space social canon, not part of PRO Console domain ownership.

16.4 Short formula

PRO-led group = social layer
PRO Console = operational layer

17. Where Social Group Ends and Operational PRO Contour Begins

This is one of the most important boundaries.

17.1 A group remains a social group when its purpose is:
community formation;
social circulation;
group posting and reposting;
social visibility around a shared context;
community memory and presence.
17.2 The contour becomes operational when its purpose is:
managing domain objects;
processing moderation queues;
approving quest proof;
managing event setup;
onboarding partners;
editing operational records;
running analytics and administrative tasks;
handling business workflows.
17.3 Canonical boundary examples
Quest-related
Quest group in Space = community around quest experience
Quest management in PRO Console / Quest domain = operational ownership
Event-related
Event group in Space = social layer around event life
Event administration in Pulse / PRO Console = operational ownership
Partner-related
Partner-related group in Space = trust and community layer
Partner operations in RF / PRO Console = operational ownership
17.4 Boundary rule

As soon as the primary purpose shifts from community context to object management, the surface is no longer just a social group and belongs in an operational contour.

18. Explicit Ownership Rules
18.1 Space groups own
group identity
membership
social publication context
group feed context
in-group social visibility
18.2 Space groups do not own
quest progression truth
event truth
partner truth
listing truth
Connect balances or rewards
AI orchestration
PRO operational workflow state

This aligns with Space’s strict boundary discipline as a narrowly writable social-core service.

19. Product and Engineering Implications
19.1 Product implications

Cursor and product decisions must treat groups as:

first-class social entities;
not just UI tabs;
not just filters;
not hidden comments replacements;
not operational workspaces.
19.2 Engineering implications

The Space schema and contracts must preserve:

space_group as canonical group entity;
space_group_member as canonical membership relation;
group_id on space_post;
group feed as a delivery surface, not as group identity itself.
19.3 Boundary implications

Any attempt to push partner operations, quest management, event management, balances, or assistant execution into group ownership is architectural drift and must be rejected.

20. Final Canon Summary

A thematic group in Space Asia is a first-class social container that creates persistent community context around a shared axis such as geography, topic, curator, quest, event, or private circle.

Groups are distinct from feeds because:

a feed delivers content;
a group defines the community context in which the content belongs.

Groups:

may be geo, thematic, curator-led, quest, event, or private;
are created in controlled ways, especially in early phases;
support direct publication into the group;
allow explicit sharing from private into group context;
expose only group-bounded social visibility;
use owner / moderator / member role semantics;
may be led by PROs but remain part of Space, not PRO Console;
must never become operational workspaces for domain management.

Short final formula:

Group = community context
Feed = delivery surface
PRO Console = operational workspace

That is the canonical model for thematic groups in Space Asia.