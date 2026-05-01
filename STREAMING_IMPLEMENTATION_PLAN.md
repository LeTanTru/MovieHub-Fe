# Streaming Implementation Plan

## Context

The codebase currently uses blocking `await Promise.all()` patterns on all data fetching, causing pages to wait for the slowest query before rendering anything. With 7+ parallel queries on movie/watch pages, users see a blank screen until all data resolves.

Goal: Implement streaming with Suspense boundaries so faster components render immediately while slower data loads in background.

## Current State

- Zero Suspense usage in codebase
- All pages use blocking `await` patterns
- Movie/watch pages have 6-7 queries in `Promise.all`
- Client components already have `.Skeleton` patterns for fallbacks

## Architecture

### Pattern: Server Component Streaming

```
Page (Server Component)
├── Prefetch queries (start in parallel, don't await all)
├── Return shell UI with Suspense boundaries
└── Components stream in as data resolves

Component (Client Component)
├── Use useQuery with enabled flag
└── Show skeleton while loading (existing pattern)
```

### Query Tiers by Speed

| Tier   | Queries                    | Example                  |
| ------ | -------------------------- | ------------------------ |
| Fast   | Single basic query         | Movie details            |
| Medium | List queries               | Suggestions, person list |
| Slow   | Infinite/paginated queries | Comments, reviews        |

## Files to Modify

### 1. Home Page (`src/app/(home)/page.tsx`)

**Change:** Wrap Slider in Suspense boundary

```tsx
import { Suspense } from 'react';
import { VerticalBarLoading } from '@/components/loading';

export default async function HomePage() {
  // ... existing prefetch code ...

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<VerticalBarLoading className='...' />}>
        <Slider />
      </Suspense>
      {/* ... rest of page ... */}
    </HydrationBoundary>
  );
}
```

### 2. Movie Detail Page (`src/app/movie/[slug]/page.tsx`)

**Change:** Add Suspense around Discussion component in `MovieMain`

**File: `src/components/app/movie-main/movie-main.tsx`**

```tsx
import { Suspense } from 'react';

export default function MovieMain() {
  return (
    <div className='...'>
      <MovieActionBar />
      <MovieTabs />
      <Suspense fallback={<Discussion.Skeleton />}>
        <Discussion toId={MOVIE_DETAIL_DISCUSSION_ID} />
      </Suspense>
    </div>
  );
}
```

### 3. Watch Page (`src/app/watch/[slug]/page.tsx`)

**Change:** Add Suspense around Discussion component in `WatchMain`

**File: `src/components/app/watch-main/watch-main.tsx`**

```tsx
import { Suspense } from 'react';

export default function WatchMain() {
  return (
    <div className='...'>
      <WatchInfo />
      <div>
        <ScheduleBadge />
        <WatchEpisode />
        <Suspense fallback={<Discussion.Skeleton />}>
          <Discussion
            toId={MOVIE_WATCH_DISCUSSION_ID}
            className='max-1120:pb-0 px-0'
            variant='watch'
          />
        </Suspense>
      </div>
    </div>
  );
}
```

## Summary of Changes

| File                                           | Change                                                |
| ---------------------------------------------- | ----------------------------------------------------- |
| `src/app/(home)/page.tsx`                      | Add Suspense + VerticalBarLoading around Slider       |
| `src/app/movie/[slug]/_components/movie.tsx`   | Add Suspense import (already has Discussion.Skeleton) |
| `src/components/app/movie-main/movie-main.tsx` | Wrap Discussion in Suspense                           |
| `src/app/watch/[slug]/_components/watch.tsx`   | Add Suspense import                                   |
| `src/components/app/watch-main/watch-main.tsx` | Wrap Discussion in Suspense                           |

## Verification

1. Run `yarn dev` and navigate to `/movie/test-slug.1`
2. Open Network tab — should see HTML streamed in chunks
3. Movie info appears first, then discussion streams in
4. Check no layout shift when slow queries resolve
5. Run `yarn lint` to verify no errors

## Dependencies

- No new dependencies needed
- Uses existing `Suspense` from React
- Uses existing `Discussion.Skeleton` fallbacks
- Uses existing `VerticalBarLoading` component
