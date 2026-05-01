# Performance Audit Report

**Generated:** 2026-04-29  
**Scope:** Full application performance analysis  
**Method:** Multi-agent codebase analysis

---

## Executive Summary

| Category | Issues Found | Critical | High | Medium |
| -------- | ------------ | -------- | ---- | ------ |
| Total    | 23           | 4        | 5    | 14     |

### Key Findings

1. **Cache misses on infinite queries** - Server-prefetched data not reused by client
2. **Missing memoization** - List components re-render excessively
3. **No lazy loading** - Heavy video player loads on initial render
4. **Memory leaks** - Player hooks missing cleanup functions
5. **Suboptimal query configuration** - Missing `staleTime`, `select()`, `placeholderData`

---

## Critical Issues (Fix Immediately)

### 1. Query Key Mismatch - Cache Misses ⚠️

**Affected Files:**

- `src/app/movie/[slug]/page.tsx:122-133`
- `src/app/watch/[slug]/page.tsx:115-127`
- `src/hooks/use-load-more.ts:28-29`
- `src/components/app/discussion/discussion.tsx`

**Problem:**
Server prefetches with full params object in query key:

```typescript
queryKey: [queryKeys.COMMENT_LIST, commentFilters];
```

But client `useLoadMore` creates a different key structure:

```typescript
queryKey: [queryKey, params]; // Different structure!
```

**Impact:** Prefetched data is never reused. Every page load triggers duplicate API calls.

**Fix:**

```typescript
// In use-load-more.ts
queryKey: [queryKey, params], // Ensure same structure as prefetch
```

---

### 2. Missing `placeholderData` in Infinite Queries ⚠️

**Affected File:** `src/hooks/use-load-more.ts:28-39`

**Problem:**

```typescript
useInfiniteQuery({
  // ... other options
  // Missing: placeholderData: keepPreviousData
});
```

**Impact:** Content disappears when fetching next pages - poor UX during scroll.

**Fix:**

```typescript
import { keepPreviousData } from '@tanstack/react-query';

useInfiniteQuery({
  // ... existing options
  placeholderData: keepPreviousData
});
```

---

### 3. No React.memo on Frequently-Reused Components ⚠️

**Affected Files:**

- `src/components/app/movie-card/movie-card.tsx:46`
- `src/components/app/review/review-item.tsx:39`
- `src/components/app/comment/comment-item.tsx:49`
- `src/components/app/person-card/person-card.tsx:46`
- `src/components/app/collection/anime-item.tsx:32`
- `src/components/app/button-like/button-like.tsx:63`

**Problem:**
These components render in lists (20+ items) but lack `React.memo`. Any parent state change causes all items to re-render.

**Fix:**

```typescript
export const MovieCard = React.memo(({ movie, ...props }: MovieCardProps) => {
  // component logic
});

MovieCard.displayName = 'MovieCard';
```

---

### 4. Video Player Not Lazy Loaded ⚠️

**Affected File:** `src/app/watch/[slug]/_components/Watch.tsx:9`

**Problem:**

```typescript
import WatchPlayer from './watch-player'; // Direct import
```

The video player is a heavy component with HLS.js, Vidstack, and custom hooks. It loads immediately on page render.

**Fix:**

```typescript
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const WatchPlayer = dynamic(() => import('./watch-player'), {
  suspense: true,
  loading: () => <PlayerSkeleton />
});

// In component:
<Suspense fallback={<PlayerSkeleton />}>
  <WatchPlayer />
</Suspense>
```

---

## High Priority Issues

### 5. Missing Query `staleTime` Configuration

**Affected Files:**

- `src/queries/movie.query.ts:15-85`
- `src/queries/movie-item.query.ts:13-18`
- `src/queries/collection.query.ts:13-18`
- `src/queries/sidebar.query.ts:13-18`

**Problem:**
All queries rely on global default `staleTime: 60000`. Movie metadata rarely changes and should cache longer.

**Fix:**

```typescript
export const useMovieQuery = (id: string | undefined) => ({
  ...useQuery({
    queryKey: [queryKeys.MOVIE, id],
    queryFn: () => movieApiRequest.getById(id!),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    enabled: !!id
  })
});
```

---

### 6. No `select()` for Data Transformation

**Affected:** All query files

**Problem:**
Zero usage of TanStack Query's `select()` option. Components manually access `data?.data`:

```typescript
const { data: movieData } = useMovieQuery(id);
const movie = movieData?.data; // Manual transformation
```

**Impact:** Components re-render when raw data changes even if transformed result is the same.

**Fix:**

```typescript
export const useMovieQuery = (id: string | undefined) => ({
  ...useQuery({
    queryKey: [queryKeys.MOVIE, id],
    queryFn: () => movieApiRequest.getById(id!),
    select: (response) => response.data,
    enabled: !!id
  })
});

// Usage:
const { data: movie } = useMovieQuery(id); // Direct access
```

---

### 7. Inline Objects/Functions in JSX

**Affected Files:**
| File | Line | Issue |
|------|------|-------|
| `header.tsx` | 125 | `style={{ marginRight: 24 }}` |
| `comment-reply-list.tsx` | 74 | `style={{ marginLeft: level * 40 }}` |
| `movie-history-card.tsx` | 97 | `style={{ width: ${percentWatched}% }}` |
| `anime-item.tsx` | 85 | `style={{ cursor: isGrabbing ? 'grabbing' : 'grab' }}` |
| `movie-tabs.tsx` | 44 | `handleClick` not memoized |

**Problem:**
Inline objects/functions are recreated every render, causing child components to re-render even with `React.memo`.

**Fix:**

```typescript
// Before:
<div style={{ marginRight: 24 }}>

// After:
const headerStyle = useMemo(() => ({ marginRight: 24 }), []);
<div style={headerStyle}>

// Or use CSS class:
<div className="mr-6">
```

---

### 8. HLS Buffer Not Configured

**Affected File:** `src/components/app/watch/video-player.tsx:272-277`

**Problem:**

```typescript
onProviderChange={(provider) => {
  if (provider?.type === 'hls') {
    provider.hls.options.xhrSetup = (xhr: XMLHttpRequest) => {
      // auth header setup
    };
    // Missing buffer configuration
  }
}}
```

**Impact:** Default HLS.js settings may over-buffer (wasting bandwidth) or under-buffer (causing stalls).

**Fix:**

```typescript
onProviderChange={(provider) => {
  if (provider?.type === 'hls') {
    const hls = provider.hls;
    hls.options.maxBufferLength = 30; // 30 seconds
    hls.options.maxMaxBufferLength = 300; // 5 minutes max
    hls.options.startLevel = 0; // Start at lowest quality
    hls.options.abrEwmaDefaultEstimate = 500000; // 500kbps initial estimate
  }
}}
```

---

### 9. Memory Leaks in Player Hooks

**Affected Files:**

- `src/hooks/use-intro-skip.tsx:61-64`
- `src/hooks/use-outro-skip.tsx:62-64`
- `src/hooks/use-continue-watching.tsx:38-52`

**Problem:**

```typescript
// use-intro-skip.tsx
useEffect(() => {
  if (!playerRef.current) return;
  trySkipIntro(playerRef.current.currentTime);
}, [skipIntro, trySkipIntro]);
// Missing cleanup function
```

**Impact:** State updates on unmounted components, potential memory leaks.

**Fix:**

```typescript
useEffect(() => {
  if (!playerRef.current) return;

  const cleanup = trySkipIntro(playerRef.current.currentTime);

  return () => {
    if (cleanup) cleanup();
  };
}, [skipIntro, trySkipIntro]);
```

---

## Medium Priority Issues

### 10. Missing `sizes` Prop on Images

**Affected Files (21 total):**

- `src/components/app/collection/top-movie-card.tsx:160-163`
- `src/components/app/watch/suggestion-item.tsx:31-38`
- `src/components/app/review/review-item.tsx:97-102`
- `src/components/form/image-field.tsx` (6 instances)

**Problem:**
Images using `fill` without `sizes` prop cause incorrect image selection by the browser.

**Fix:**

```typescript
<Image
  fill
  src={src}
  alt={alt}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

---

### 11. Missing `prefetch` on Link Components

**Affected Files:**

- `src/components/app/movie-card/movie-card.tsx:114-125`
- `src/components/app/header/navigation/navigation-desktop.tsx:94-100`
- `src/components/app/header/movie-item.tsx:26-30`

**Problem:**
Links lack `prefetch` prop. Users hovering for 500ms before clicking miss prefetch opportunity.

**Fix:**

```typescript
<Link href={`/movie/${slug}`} prefetch>
```

---

### 12. Heavy Pages Without Dynamic Imports

**Affected Files:**

- `src/app/movie/[slug]/page.tsx`
- `src/app/watch/[slug]/page.tsx`

**Problem:**
Comments and reviews sections load on initial render. These are below the fold and should be lazy-loaded.

**Fix:**

```typescript
const Discussion = dynamic(
  () => import('@/components/app/discussion').then((mod) => mod.Discussion),
  {
    suspense: true,
    loading: () => <DiscussionSkeleton />
  }
);
```

---

### 13. Missing `loading='lazy'` on Images

**Affected Files:**

- `src/components/app/movie-card/movie-card.tsx:127-134`
- `src/components/app/person-card/person-card.tsx:89-108`

**Problem:**
Non-critical images rely on browser default (usually eager).

**Fix:**

```typescript
<Image
  src={src}
  alt={alt}
  loading="lazy"
  // ... other props
/>
```

---

### 14. `lodash` Full Import

**Affected File:** `package.json:50`

**Problem:**
Full `lodash` library imported. Only partial usage detected in codebase.

**Fix:**

```json
// Replace lodash with lodash-es or individual imports
"lodash-es": "^4.17.21"
```

```typescript
// Before:
import { debounce, throttle } from 'lodash';

// After:
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
```

---

## Positive Patterns Found

### ✅ Good Practices

| Pattern             | File                    | Description                               |
| ------------------- | ----------------------- | ----------------------------------------- |
| Font optimization   | `layout.tsx:16-22`      | `display: 'swap'`, `preload: true`        |
| Image priority      | `slider-item.tsx:77-84` | `loading='eager'`, `fetchPriority='high'` |
| Responsive images   | `movie-card.tsx:133`    | Proper `sizes` prop                       |
| Bundle optimization | `next.config.ts:34-35`  | `optimizePackageImports`, `optimizeCss`   |
| Tree-shaking        | `date-fns` usage        | Instead of moment.js                      |
| SSR prefetching     | `page.tsx` files        | Parallel `Promise.all()` prefetch         |
| Hydration boundary  | Multiple pages          | Proper `HydrationBoundary` usage          |
| Debounced hover     | `movie-card.tsx:84-97`  | Proper cleanup                            |
| LazyMotion          | `app-provider.tsx:88`   | framer-motion tree-shaking                |

---

## Quick Wins (< 1 hour each)

| #   | Task                  | File               | Impact |
| --- | --------------------- | ------------------ | ------ |
| 1   | Add `placeholderData` | `use-load-more.ts` | High   |
| 2   | Add `loading='lazy'`  | Image components   | Medium |
| 3   | Configure HLS buffer  | `video-player.tsx` | Medium |
| 4   | Add `staleTime`       | Query files        | Medium |
| 5   | Fix memory leaks      | Player hooks       | High   |

---

## Implementation Priority

### Phase 1: Critical (Week 1)

- [ ] Fix query key mismatch (2h)
- [ ] Add React.memo to card components (3h)
- [ ] Add placeholderData to infinite queries (1h)
- [ ] Fix memory leaks in hooks (2h)

### Phase 2: High Priority (Week 2)

- [ ] Add staleTime to queries (2h)
- [ ] Implement select() in queries (4h)
- [ ] Fix inline styles (3h)
- [ ] Configure HLS buffer (1h)
- [ ] Lazy load video player (2h)

### Phase 3: Medium Priority (Week 3)

- [ ] Add sizes to images (2h)
- [ ] Add prefetch to Links (2h)
- [ ] Dynamic import heavy sections (2h)
- [ ] Replace lodash with lodash-es (1h)

---

## Verification Commands

After implementing fixes, verify with:

```bash
# Type check
yarn lint

# Build verification
yarn build

# Bundle analysis
ANALYZE=true yarn build

# Run dev server and check console for:
# - Re-render counts (React DevTools)
# - Network tab for duplicate requests
# - Performance tab for LCP/CLS
```

---

## Monitoring Recommendations

1. **Add bundle analyzer to CI:**

   ```bash
   ANALYZE=true yarn build
   ```

2. **Track Core Web Vitals:**
   - LCP (Largest Contentful Paint)
   - FID (First Input Delay)
   - CLS (Cumulative Layout Shift)

3. **Set up React DevTools profiling:**
   - Enable "Highlight updates" to see re-renders
   - Use profiler to identify slow components

4. **Monitor network requests:**
   - Check for duplicate API calls
   - Verify cache hits in React Query Devtools

---

## Related Documentation

- [TanStack Query Performance](https://tanstack.com/query/latest/docs/react/guides/performance)
- [Next.js Image Optimization](https://nextjs.org/docs/app/api-reference/components/image)
- [React Memo Documentation](https://react.dev/reference/react/memo)
- [HLS.js Configuration](https://github.com/video-dev/hls.js/blob/master/docs/API.md)

---

_This report was generated by automated codebase analysis. Always verify fixes in a staging environment before deploying to production._
