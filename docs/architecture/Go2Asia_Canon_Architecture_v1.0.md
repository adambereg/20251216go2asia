# Go2Asia Canon Architecture v1.0

## Unified Architectural Contract for Atlas / Pulse / Quest / Rielt Market

------------------------------------------------------------------------

# 0. Purpose of the Canon

The Canon is an architectural contract between all layers of the Go2Asia
ecosystem.

It guarantees:

1.  Unified structure across Atlas (Places), Pulse (Events), Quest,
    Rielt Market (Listings)
2.  Deterministic media handling
3.  API predictability
4.  UI consistency
5.  Validation and automation capability
6.  CMS-ready evolution without structural refactoring

The Canon defines **how content exists in the system**, not how it is
visually styled.

------------------------------------------------------------------------

# 1. Canon Principle

The Canon connects five layers:

1.  Content Source (Markdown or CMS)
2.  Database SSOT (Neon Postgres)
3.  API SSOT (Content Service DTO)
4.  UI Canon (Unified Page Skeleton)
5.  Media Canon (R2 + deterministic prefix)

No module may violate this contract without a formal ADR.

------------------------------------------------------------------------

# 2. Data Canon

## 2.1 Unified ContentEntity Model

All detailed pages are treated as content entities.

Base fields:

-   id (stable, not random UUID for public references)
-   type ∈ { place, event, listing, quest }
-   slug (canonical, matches URL and media folder)
-   title
-   subtitle (optional)
-   short_description
-   body_markdown (main content)
-   status (draft \| active \| archived)
-   is_verified (boolean)
-   country_slug
-   city_slug

Time fields (when applicable):

-   start_at
-   end_at
-   date_precision (day \| month \| season \| range)

Geo fields (when applicable):

-   geo_scope (point \| city \| region \| country)
-   lat
-   lng

Classification:

-   primary_type
-   secondary_type
-   tags\[\]
-   categories\[\]

------------------------------------------------------------------------

## 2.2 Markdown Canon

body_markdown is the Single Source of Truth for long-form content.

Sections are structured via headings:

## Overview

## Why Visit

## Practical Information

## How to Get There

## Tips

UI must not depend on specific section existence.

Tabs are a UI concern, not a database obligation.

------------------------------------------------------------------------

# 3. Media Canon

## 3.1 R2 Structure

All media stored in R2:

go2asia-media/

Structure:

events/`<country>`{=html}/`<year>`{=html}/`<slug>`{=html}/\
places/`<country>`{=html}/`<city>`{=html}/`<slug>`{=html}/\
rielt/`<country>`{=html}/`<city>`{=html}/`<slug>`{=html}/\
quests/`<country>`{=html}/`<city>`{=html}/`<slug>`{=html}/

Files example:

01.jpg\
02.jpg\
03.jpg

01.jpg is default hero.

------------------------------------------------------------------------

## 3.2 Database Media Fields

Each entity stores:

-   media_prefix (string, required)
-   hero_media_key (optional)
-   gallery_media_keys (jsonb array, indexed snapshot)

Important:

gallery_media_keys is NOT the primary truth. It is an indexed snapshot
of files under media_prefix.

------------------------------------------------------------------------

## 3.3 Media Indexing System (Mandatory)

A Media Indexer service must:

1.  List R2 objects by media_prefix
2.  Filter valid image types
3.  Sort deterministically (numeric-safe sorting)
4.  Update gallery_media_keys in DB
5.  Set hero_media_key if not defined (01.jpg fallback)

Indexer runs:

-   On Markdown import
-   On CMS publish
-   On manual rescan
-   On scheduled consistency job

------------------------------------------------------------------------

## 3.4 URL Resolution

Never store full URLs in DB.

Use:

resolveMediaUrl(key) =\> ${MEDIA_BASE_URL}/${key}

MEDIA_BASE_URL stored in environment.

------------------------------------------------------------------------

# 4. API Canon

## 4.1 DTO Contract

ContentEntityDto returns:

-   heroMediaKey: string \| null
-   galleryMediaKeys: string\[\]
-   bodyMarkdown: string

Never return URLs.

Never return json string instead of array.

------------------------------------------------------------------------

## 4.2 Debug Endpoints (Mandatory)

/v1/content/\_debug/version\
/v1/content/\_debug/entity/{slug}

Must expose raw gallery_media_keys and media_prefix for verification.

------------------------------------------------------------------------

# 5. UI Canon

## 5.1 Unified Page Skeleton

All modules use the same layout structure:

1.  Hero Banner (title + badges)
2.  PhotoStrip + Lightbox
3.  Two-column layout
    -   Left: Markdown sections
    -   Right: Facts panel

Facts panel differs per entity type.

------------------------------------------------------------------------

## 5.2 Data Adapters

Each module implements:

toCanonicalPageData(entityDto)

Adapters determine badges, facts, and visual emphasis.

------------------------------------------------------------------------

# 6. Import Canon

## 6.1 Markdown Import

Importer must:

-   Parse frontmatter
-   Populate structured fields
-   Set media_prefix
-   Trigger Media Indexer

Markdown is allowed only as initial seed after CMS launch.

------------------------------------------------------------------------

# 7. CMS Canon (Future State)

CMS becomes SSOT for content editing.

Rules:

-   CMS edits body_markdown
-   CMS updates structured fields
-   On publish → Media Indexer runs
-   Git is no longer SSOT after CMS launch

No dual-authoritative systems allowed.

------------------------------------------------------------------------

# 8. Validation Canon

Two validators required:

## 8.1 DB Validator

Checks:

-   gallery_media_keys is array
-   hero key exists in array or matches 01.jpg
-   media_prefix format valid
-   slug consistency

## 8.2 R2 Validator

Checks:

-   Files exist in R2
-   DB snapshot matches R2
-   Orphaned files detection

------------------------------------------------------------------------

# 9. Operational Rules

-   UI never lists R2 directly
-   API never constructs URLs
-   Media detection never happens during page render
-   Indexing must be deterministic
-   Canon violations require ADR

------------------------------------------------------------------------

# 10. Canon Summary

This Canon ensures:

-   Structural consistency
-   Media determinism
-   CMS readiness
-   Debug transparency
-   Performance predictability
-   Scalable module growth

Atlas, Pulse, Quest, and Rielt Market are now bound by one architectural
contract.

------------------------------------------------------------------------

Version: 1.0\
Status: Approved Canon\
Project: Go2Asia
