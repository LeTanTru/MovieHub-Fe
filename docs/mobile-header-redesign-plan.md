# Mobile Header Redesign — Logo Top Bar + Bottom Navigation

Status: Implemented (branch `tru_dev`, not yet committed)
Scope: Mobile / small-screen layout of the global header only. Desktop layout
(`≥ 1361px`) is unchanged.

## 1. Goal

Restructure the mobile header into a native-app-style shell:

- **Top bar**: slimmed down to the logo only. The desktop right-side cluster
  (nav, download, notification, avatar, login) is hidden below `1360px`.
- **Bottom bar**: a fixed bottom navigation, like a native mobile tab bar,
  holding the primary destinations. Grouped movie destinations collapse into a
  **"Phim"** sheet; account / secondary items collapse into a **"Thêm"** sheet;
  search is its own tab that routes to `/search`.

This replaces the old pattern where the hamburger menu held everything and
search was a toggle overlay.

## 2. What shipped vs. the original proposal

The original proposal was a "search-first" top bar (persistent search input in
the header) plus a 5-tab bottom bar splitting Phim lẻ / Phim bộ. The
implementation took a different, simpler shape. Deviations, all intentional:

| Area               | Original proposal                                      | As built                                                                                        |
| ------------------ | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| Mobile top bar     | Persistent full-width search + logo + right affordance | **Logo only.** No inline search, no right-side affordance on mobile.                            |
| Search             | Always-visible input in the top bar                    | A **"Tìm kiếm" bottom tab** linking to `/search`; the search page renders its own mobile input. |
| Primary tabs       | Trang chủ / Phim lẻ / Phim bộ / Xem chung / More       | Trang chủ / **Tìm kiếm** / **Phim** (sheet) / Xem chung / **Thêm** (sheet)                      |
| Secondary grouping | Single "Xem thêm" (More) sheet holds everything        | **Two sheets**: `Phim` (movie groups) and `Thêm` (account + download app)                       |
| Room tab gating    | Show only when authenticated                           | **Always shown** in the bottom bar (route itself handles auth).                                 |
| Bottom bar z-index | `z-50`                                                 | `z-40` (sheets and their overlays are `z-50`, so they sit above the bar).                       |
| Account / login    | Top-right affordance in the top bar                    | Moved entirely into the **Thêm** sheet (login button or profile + `userSidebarList` + logout).  |

The two "open decisions" from the old plan were resolved as: (a) no top-right
affordance on mobile — push account/notifications into the sheet; (b) do not
split Phim lẻ/Phim bộ as tabs — group all movie destinations under one "Phim"
sheet.

## 3. As-built file map

| File                                                       | Status   | Role                                                                                                                                                                                                                                          |
| ---------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/app/header/header.tsx`                     | modified | Top bar reduced to logo + desktop cluster (`max-1360:hidden`); renders `<NavigationMenu mode='bottom'>` as a sibling of the fixed header. Old `showSearch` toggle + mobile search overlay + hamburger slot removed.                           |
| `src/components/app/header/navigation/navigation.tsx`      | modified | `mode` union extended to `'mobile' \| 'desktop' \| 'bottom'`; feeds the shared `navigationList` to the bottom bar.                                                                                                                            |
| `navigation/navigation-bottom-bar.tsx`                     | NEW      | Fixed bottom tab bar. Tabs: `home` (link), `search` (link → `/search`), `phim` (opens Phim sheet), `room` (link), `more` (opens Thêm sheet). Active state via `pathname`; hides under `toggleHeader` and `max-[1680px]` on room-detail pages. |
| `navigation/navigation-bottom-sheet.tsx`                   | NEW      | Shared bottom-sheet primitive (overlay + slide-up panel, drag handle, Escape/`modal-open` body-scroll lock, safe-area padding).                                                                                                               |
| `navigation/navigation-phim-sheet.tsx`                     | NEW      | "Phim" sheet: renders the movie group in `PHIM_ORDER` (topic, category, single, series, country, person, schedule); `submenu` items (Thể loại / Quốc gia) expand inline as accordions.                                                        |
| `navigation/navigation-more-sheet.tsx`                     | NEW      | "Thêm" sheet: account block (login button, or profile + `userSidebarList` grid + logout) and the download-app button.                                                                                                                         |
| `navigation/navigation-mobile.tsx`                         | **dead** | Old hamburger panel. Still imported by `navigation.tsx` for `mode='mobile'`, but nothing passes `mode='mobile'` anymore. See §6.                                                                                                              |
| `src/app/search/_components/search.tsx`                    | modified | Adds a mobile-only `SearchForm` under the page heading (`max-1360:block hidden`) since the header no longer carries search on mobile.                                                                                                         |
| `src/types/navigation-menu.type.ts`                        | modified | `ItemProps` gains optional `icon?: ComponentType<{ className?: string }>`.                                                                                                                                                                    |
| `src/app/globals.css`                                      | modified | Adds `--spacing-bottom-nav: 60px`; `body { padding-bottom }` clearance under `max-width:1360px`; `html.modal-open .bottom-nav { padding-right }` scrollbar compensation.                                                                      |
| `src/app/layout.tsx`                                       | modified | Adds `export const viewport: Viewport = { viewportFit: 'cover' }` for iOS safe-area.                                                                                                                                                          |
| `src/components/app/go-to-top-button/go-to-top-button.tsx` | modified | Lifts the button above the bar on mobile: `max-1360:bottom-[calc(var(--spacing-bottom-nav)+env(safe-area-inset-bottom)+1rem)]`.                                                                                                               |
| `next.config.ts`                                           | modified | `allowedDevOrigins` ngrok entry — unrelated dev tunneling, not part of this feature.                                                                                                                                                          |

## 4. Layout & spacing (as built)

1. **Bottom-nav token**: `--spacing-bottom-nav: 60px` in globals.css `@theme`.
   The bar itself is `h-bottom-nav` per item plus `pb-[env(safe-area-inset-bottom)]`.
2. **Content clearance**: `@media (max-width: 1360px) { body { padding-bottom:
calc(var(--spacing-bottom-nav) + env(safe-area-inset-bottom)) } }` keeps
   content and footer above the bar.
3. **Safe area (iOS)**: `viewport-fit=cover` via the `viewport` export; the bar
   and sheets pad with `env(safe-area-inset-bottom)`.
4. **`GoToTopButton`**: lifted above the bar on mobile (see file map).
5. **Z-index**: top header `z-50`; bottom bar `z-40`; sheet overlay + panel
   `z-50` (above the bar). `html.modal-open .bottom-nav` gets the scrollbar-width
   right-padding so the bar doesn't shift when a modal locks scroll.
6. **Room / watch-together hide**: `navigation-bottom-bar.tsx` mirrors
   `header.tsx` — `translate-y-full` when `toggleHeader` (watch-together) and
   `max-[1680px]:translate-y-full` on room-detail pages, so both bars move
   together.

## 5. Data & active state

- `navigation.tsx` still builds one `navigationList` (categories + countries
  queries, auth-aware "Xem chung") and passes it to the bottom bar / Phim sheet,
  so there is no duplicated data source.
- Bottom-bar active state: exact match for `home`, `startsWith` for `search`
  and `room`; the `phim` tab is active when `pathname` starts with any of
  `PHIM_ROUTE_PREFIXES` (movie, category, country, topic, person, schedule).
  Highlight color is `text-golden-glow`.
- Phim sheet marks a group active when a child href prefix matches `pathname`,
  and an exact child active on full-path match.

## 6. Follow-ups / cleanup

- **Dead `mode='mobile'` path.** `navigation-mobile.tsx` and the
  `mode === 'mobile'` branch in `navigation.tsx` are no longer reached. Either
  delete both (preferred) or keep intentionally — decide before committing so
  lint/bundle don't carry unused UI. If deleted, drop the `NavigationMobile`
  import from `navigation.tsx` too.
- **`next.config.ts` `allowedDevOrigins`.** The hard-coded ngrok host is a local
  dev artifact; remove or move out of the committed diff.
- **Verify**: run `yarn lint && yarn build`; manually check
  `420 / 480 / 640 / 768 / 990 / 1360` widths and iOS safe-area (simulated) for
  both auth states, plus room-detail / watch-together hide behavior and the
  search-results dropdown z-index.

## 7. Docs to update on completion

Keep aligned per CLAUDE.md once committed: `docs/architecture.md` (App
Composition / header — note the bottom-nav sibling of `<Header/>`),
`docs/development-guide.md`, and `docs/project-overview.md` if the header
description changes. Mention the `--spacing-bottom-nav` token in any styling
reference.
