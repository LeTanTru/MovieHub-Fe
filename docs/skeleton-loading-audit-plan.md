# Skeleton Loading Audit Plan

## Goal

Ensure every skeleton loader visually matches the real component it represents, so loading states do not cause layout shifts, misleading spacing, or noticeably different page structure.

## Scope

Audit all skeleton components and inline skeleton blocks in:

- `src/app/**/_components`
- `src/components/app/**`
- shared UI blocks that appear on public pages, movie/watch pages, account pages, and user pages

Include both patterns:

- Static skeleton exports, for example `Component.Skeleton`
- Inline loading branches, for example `isLoading ? <Skeleton ... /> : ...`

## Inventory Checklist

1. Find skeleton usage:

```bash
rg "Skeleton|\\.Skeleton|isLoading \\?" src/app src/components
```

2. For each skeleton, record:

| Area         | Real component | Skeleton location | Data source  | Route/page      | Status  |
| ------------ | -------------- | ----------------- | ------------ | --------------- | ------- |
| Movie detail | `MovieMain`    | `Movie.Skeleton`  | movie detail | `/movie/[slug]` | Pending |

3. Group by page or feature:

- Home collections and sliders
- Movie detail
- Watch page
- Discussion comments and reviews
- Search and listing pages
- Person/category/country/topic pages
- User pages such as favourite, playlist, watch history, notification
- Header and modal loading states

## Match Criteria

For each skeleton, compare against the real loaded component:

- Same outer width, height, min-height, grid columns, and flex direction.
- Same responsive breakpoints and mobile layout.
- Same major spacing: gap, margin, padding, border radius, and alignment.
- Same media aspect ratios for posters, avatars, thumbnails, video, and cards.
- Same number of visible placeholder rows/items for first render.
- No content jump when data loads, especially heading area, action rows, cards, and pagination.
- Skeleton does not include controls or affordances that the real loading state should not allow.
- Skeleton color and opacity match the app's existing skeleton style.

## Audit Workflow

1. Open the route with normal API data and capture the real component layout.
2. Force the loading state for the target component.
   Prefer temporary local flags in the component or query `enabled: false` while auditing.
3. Compare desktop and mobile:

```text
Desktop: 1440 x 900
Tablet: 768 x 1024
Mobile: 390 x 844
```

4. Check for layout shift:

- Toggle from skeleton to real component.
- Watch whether surrounding content moves.
- Pay special attention to route headers, tab bars, action rows, and lists.

5. Fix the skeleton in the same component ownership area.
   Keep the skeleton close to the component it represents when possible.

6. Run verification:

```bash
yarn lint -- src/path/to/component.tsx
yarn build
```

## Component-Specific Notes

### Lists And Grids

- Match the real grid classes exactly where possible.
- Skeleton item count should fill at least the first viewport.
- Card skeletons should preserve poster aspect ratio and text line count.

### Comments And Reviews

- Avatar size must match the real item.
- Header skeleton should reserve badge, author, and date/action width.
- Content skeleton should match one-line and multi-line text spacing.
- Action row skeleton should match like/dislike/reply/dropdown spacing.

### Movie And Watch Pages

- Preserve hero/video aspect ratio.
- Preserve side column widths and breakpoint behavior.
- Episode, actor, suggestion, discussion, and action skeletons should match their loaded sections.

### Forms And Modals

- Keep modal dimensions stable while loading async choices or profile data.
- Preserve button row height and spacing.
- Do not show interactive-looking controls unless they remain usable.

## Definition Of Done

A skeleton is accepted when:

- It matches the real component at desktop, tablet, and mobile widths.
- Loading-to-loaded transition has no obvious layout jump.
- The skeleton uses existing local component conventions.
- Targeted lint passes for changed files.
- `yarn build` passes before merging broad skeleton changes.

## Suggested Order

1. Start with high-traffic public routes: home, movie detail, watch, search.
2. Cover listing pages: category, country, topic, person, movie single/series.
3. Cover discussion items: comments, replies, reviews.
4. Cover protected user pages.
5. Cover global header, menus, modals, and small async widgets.
