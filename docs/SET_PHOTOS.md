# Phase 3D.3 — Set Photos

## Objective

Add hero photo support to Set Workspace. Photos are **workspace media only** — not `Document` records, not ingestion chain entries, not new authorities.

## Schema audit (Part 1)

`production_sets` in `20260531000300_set_workspace_tables.sql` had **no** `hero_image_url`.

**Migration:** `supabase/migrations/20260531000500_set_hero_photo.sql`

- `ALTER TABLE production_sets ADD COLUMN hero_image_url TEXT`
- Comment: storage ref format `set-photos/{productionId}/{setId}/hero.{ext}`

Constitutional `ProductionSet` type (`src/types/core/scene/set.ts`) is unchanged; this column is a **runtime workspace extension** on the Postgres row.

## Storage (Part 2)

**Decision:** Reuse existing Supabase Storage pattern (private bucket + RLS + service-role upload). **New bucket required:** `set-photos` (10MB, JPEG/PNG/WEBP only).

Object path: `{productionId}/{setId}/hero.{ext}`  
Stored ref on row: `set-photos/{productionId}/{setId}/hero.{ext}` (same `storageRef` convention as ingestion).

Display uses **signed URLs** (1h) via service client in server loaders — not public bucket URLs.

## Runtime flow

```
Upload Set Photo (set detail)
    → uploadSetHeroPhoto (server action)
    → storage: set-photos bucket
    → production_sets.hero_image_url = storage ref
    → revalidate /dashboard/sets and /dashboard/sets/[setId]

Set list / set detail (RSC)
    → load rows with hero_image_url
    → resolveHeroImageDisplayUrl (signed URL)
    → SetHeroImage component
```

## Routes

| Route | Behavior |
|-------|----------|
| `/dashboard/sets` | Cards show hero or “No photo” |
| `/dashboard/sets/[setId]` | Header hero + “Upload set photo” |

## Validation (manual)

| Test | Steps | Expected |
|------|--------|----------|
| A | Apply `20260531000500`, upload JPG/PNG/WEBP on set detail | `hero_image_url` populated in DB |
| B | Open `/dashboard/sets` | Thumbnail visible on card |
| C | Open set detail | Hero visible in header |

## Out of scope

Galleries, asset photos, AI tagging, search, extraction, work orders, document chain for photos.

## Files

| Created | |
|---------|---|
| `supabase/migrations/20260531000500_set_hero_photo.sql` | |
| `src/lib/sets/hero-photo.ts` | |
| `src/server/set-photo-actions.ts` | |
| `src/components/sets/set-hero-image.tsx` | |
| `src/components/set-detail/upload-set-photo.tsx` | |
| `docs/SET_PHOTOS.md` | |

| Modified | |
|----------|---|
| `src/lib/sets/workspace-types.ts` | |
| `src/lib/sets/load-set-workspace.ts` | |
| `src/lib/sets/list-production-sets.ts` | |
| `src/components/set-detail/set-detail-header.tsx` | |
| `src/components/set-detail/set-detail-workspace.tsx` | |
| `src/components/sets/set-list-card.tsx` | |
