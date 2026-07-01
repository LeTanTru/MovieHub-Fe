# Responsive Font-Size Audit Report

> **Date:** 2026-06-30
> **Scope:** Full codebase review of responsive typography implementation
> **Methodology:** Grep/ripgrep search for `text-`, `font-size`, `clamp()`, `@media` + `font-size` across all source files

---

## 1. Executive Summary

The project uses **Tailwind v4 responsive utility classes** as the primary mechanism for responsive font sizing (~200+ instances, ~80% of all font-size declarations). A secondary approach uses **traditional CSS `@media` queries** for complex hero/slider components (~25 instances, ~10%). Fixed (non-responsive) font sizes account for ~10% of declarations.

**Effective responsive coverage: ~90%**

---

## 2. Breakpoint System

Defined in `src/app/globals.css:116-134` via `@theme inline`:

| Breakpoint | Value  |
| ---------- | ------ |
| `max-420`  | 420px  |
| `max-480`  | 480px  |
| `max-520`  | 520px  |
| `max-600`  | 600px  |
| `max-640`  | 641px  |
| `max-720`  | 720px  |
| `max-768`  | 768px  |
| `max-800`  | 800px  |
| `max-860`  | 860px  |
| `max-969`  | 969px  |
| `max-990`  | 990px  |
| `max-1024` | 1024px |
| `max-1120` | 1121px |
| `max-1280` | 1280px |
| `max-1360` | 1360px |
| `max-1536` | 1537px |
| `max-1600` | 1600px |
| `max-1900` | 1900px |

All are "max-width" variants (Tailwind v4 convention). No `min-width` breakpoints are used for font sizing.

---

## 3. Responsive Typography Patterns

### Pattern A: Tailwind v4 responsive utilities (dominant — ~200 instances)

**Heavy-use pattern** (3-tier for body content, ~80+ occurrences):

```tsx
className = 'max-640:text-[13px] max-520:text-xs';
```

Used in: comments, reviews, notifications, movie action bar, tabs, actor list, episode cards, footer, rooms, search filters, user sidebar.

**Heading pattern** (4-tier for page/section titles):

```tsx
className = 'max-1600:text-2xl max-640:text-xl max-420:text-base text-[28px]';
```

Used in: `list-heading.tsx:8`, `collection-list-heading.tsx:24`.

**Complex multi-breakpoint heading:**

```tsx
className = 'max-1536:text-[24px] max-1120:text-xl max-640:text-lg';
```

Used in: `topic-item.tsx:60`, `topic-item-more.tsx:45`.

### Pattern B: CSS `@media` queries (legacy — ~25 instances)

```css
.media-title {
  font-size: 42px;
  @media screen and (max-width: 1279px) {
    font-size: 30px;
  }
  @media screen and (max-width: 640px) {
    font-size: 22px;
  }
}
```

| File                                                                  | Instances |
| --------------------------------------------------------------------- | --------- |
| `src/app/(home)/_components/slider/slider.css`                        | 8         |
| `src/app/(home)/_components/collection/anime-movie-list.css`          | 9         |
| `src/app/(home)/_components/collection/collection.css`                | 2         |
| `src/app/(home)/_components/watch-continue/watch-continue.css`        | 2         |
| `src/app/(home)/_components/collection/latest-country-movie-list.css` | 1         |
| `src/components/video-player/video-player.css`                        | 1         |

These CSS files were likely authored before the Tailwind v4 migration and remain as legacy styles for complex slider/hero overlays.

---

## 4. Font-Size Scale (Actual Values Used)

### Heading sizes

| Context          | Desktop | Tablet                     | Mobile       | Small Mobile |
| ---------------- | ------- | -------------------------- | ------------ | ------------ |
| Page titles      | `28px`  | `24px` (1600) → `xl` (640) | `base` (420) | —            |
| Topic cards      | `24px`  | `xl` (1120)                | `lg` (640)   | —            |
| Movie titles     | `58px`  | —                          | `28px` (640) | —            |
| Section headings | `xl`    | `lg` (640)                 | `base` (480) | —            |

### Body sizes

| Context      | Desktop                         | Mobile (<640) | Small Mobile (<520) |
| ------------ | ------------------------------- | ------------- | ------------------- |
| Body text    | `sm` (14px)                     | `[13px]`      | `xs` (12px)         |
| Meta/actions | `xs` (12px)                     | `[10px]`      | `[10px]`            |
| Badges       | `[9px]` (fixed, non-responsive) | `[9px]`       | `[9px]`             |

### Arbitrary values in heavy use

- `text-[13px]` — **~80+ occurrences**, de facto mobile body size
- `text-[28px]` — ~12 occurrences, de facto desktop heading size
- `text-[22px]` — ~5 occurrences
- `text-[24px]` — ~4 occurrences
- `text-[10px]` — ~8 occurrences (buttons, badges)
- `text-[9px]` — ~4 occurrences (navigation badges)

---

## 5. Issues & Inconsistencies

### 5.1 No fluid typography

The project uses **zero `clamp()` functions** for font sizing. All responsive sizing is breakpoint-based step changes, which can cause abrupt size jumps at viewport transitions.

### 5.2 No typography theme tokens

`tailwind.config.ts` has no `fontSize` extension. The project relies entirely on Tailwind defaults plus arbitrary `text-[XXpx]` values. `text-[13px]` appears ~80+ times but has no named token — it should be considered for promotion to a theme value.

### 5.3 Breakpoint inconsistency

- Some components use `max-520:text-xs` as the smallest breakpoint
- Others use `max-480:text-xs` or `max-420:text-base`
- No consistent rule governs which breakpoint to use for which component type

### 5.4 Incomplete responsive coverage

Several components only have a single override at `max-640` with no further reduction at smaller widths (`max-520`, `max-480`, `max-420`).

### 5.5 Abrupt size jumps

`top-movie-card.tsx:171` drops from `58px` → `28px` at a single breakpoint (640px). The jump is a 2× reduction with no intermediate step.

### 5.6 Fixed non-responsive font sizes (10%)

| Component             | Size       | File                                                                                |
| --------------------- | ---------- | ----------------------------------------------------------------------------------- |
| Navigation badges     | `[9px]`    | `navigation-mobile.tsx`, `navigation-desktop.tsx`                                   |
| Video overlay buttons | `[10px]`   | `button-skip-intro.tsx`, `button-movie-theater.tsx`, `button-auto-next-episode.tsx` |
| Notification badge    | `[10px]`   | `dropdown-notification.tsx`                                                         |
| Video player dropdown | `[15px]`   | `video-player/`                                                                     |
| Caption cues          | `20px`     | `video-player.css:12`                                                               |
| Year labels           | `[40px]`   | `movie-grid-by-year/`                                                               |
| Ranking numbers       | `[56px]`   | `top-view-item.tsx`                                                                 |
| Calendar component    | `[0.8rem]` | `calendar/`                                                                         |

### 5.7 Placeholder text responsiveness

Only 2 files (`comment-input.tsx:198`, `comment-form.tsx:245`) make placeholder text responsive via `max-640:placeholder:text-[13px] max-520:placeholder:text-xs`. The rest use fixed placeholder sizes.

### 5.8 Line-height not responsive

`leading-*` classes are almost universally fixed. Only 3 instances were found where leading is made responsive (`survey-info.tsx`, `schedule-list.tsx`).

### 5.9 No CSS custom properties for typography

No `--font-size-*` or `--font-*` custom properties are defined. All sizing is done through utility classes, making global font-size adjustments difficult.

### 5.10 Typo in text-shadow

2 files use `rbga` instead of `rgba`:

- `src/app/room/new/_components/new-room.tsx:28`
- `src/app/room/new/_components/new-room.tsx:66`

---

## 6. Recommendations

| Priority   | Recommendation                                                                                               | Effort  |
| ---------- | ------------------------------------------------------------------------------------------------------------ | ------- |
| **High**   | Promote `text-[13px]` to a named theme token (e.g., `text-tiny`) to reduce repetition and ensure consistency | Small   |
| **High**   | Define a typography scale in `tailwind.config.ts` as shared tokens                                           | Medium  |
| **Medium** | Add intermediate breakpoints for large jumps (e.g., `58px → 42px → 28px` in top-movie-card)                  | Small   |
| **Medium** | Audit components missing <640px responsive overrides                                                         | Medium  |
| **Medium** | Consider introducing `clamp()` for hero/slider text to eliminate step-change jank                            | Medium  |
| **Low**    | Establish a convention for which breakpoints to use for body vs. heading vs. meta text                       | Small   |
| **Low**    | Make placeholder text responsive globally (not just in 2 files)                                              | Small   |
| **Low**    | Create a `Typography` utility component with pre-configured responsive sizes                                 | Medium  |
| **Low**    | Fix `rbga` typos → `rgba` in `new-room.tsx`                                                                  | Trivial |

---

## 7. Conclusion

The project has a strong responsive foundation with ~90% of font-size declarations being breakpoint-aware. The reliance on Tailwind v4's `max-*:` prefix creates a consistent authoring experience, though the lack of a named typography scale leads to proliferation of arbitrary values (`text-[13px]` appearing 80+ times). The top priorities are promoting common arbitrary values to theme tokens and ensuring all components have full breakpoint coverage down to `max-420`.

---

_Report generated via automated grep analysis of the codebase._
