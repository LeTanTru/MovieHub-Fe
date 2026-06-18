# Component Split Analysis: `src/components/app`

Reviewed: 2026-06-18

Scope: shared app components under `src/components/app`.

Criteria: file over 100 lines, mixed concerns, repeated UI blocks, duplicated hooks, or mutation logic embedded in rendering components.

## Summary Table

| Component                                           | Lines | Split?  | Priority |
| --------------------------------------------------- | ----: | ------- | -------- |
| `comment/comment-item.tsx`                          |   385 | Yes     | High     |
| `movie-side/movie-side.tsx`                         |   283 | Yes     | High     |
| `comment/comment-list.tsx`                          |   271 | Yes     | High     |
| `discussion/discussion.tsx`                         |   262 | Yes     | Medium   |
| `header/navigation/navigation-mobile.tsx`           |   258 | Yes     | Medium   |
| `comment/comment-form.tsx`                          |   255 | Yes     | Medium   |
| `comment/comment-input.tsx`                         |   233 | Yes     | Medium   |
| `comment/comment-action.tsx`                        |   221 | Yes     | Medium   |
| `collection/top-movie-card.tsx`                     |   215 | Yes     | Medium   |
| `review/review-list.tsx`                            |   213 | Yes     | Medium   |
| `button-add-to-playlist/button-add-to-playlist.tsx` |   213 | Minor   | Low      |
| `header/dropdown-notification.tsx`                  |   211 | Yes     | Medium   |
| `header/header.tsx`                                 |   201 | Yes     | Medium   |
| `collection/cinema-movie-card.tsx`                  |   200 | Yes     | Medium   |
| `header/search-form.tsx`                            |   197 | Yes     | Medium   |
| `watch/watch-series.tsx`                            |   190 | Partial | Low      |
| `movie-tabs/movie-tab-series.tsx`                   |   173 | Partial | Low      |
| `watch/watch-player-video-area.tsx`                 |   174 | Minor   | Low      |
| `watch/watch-info.tsx`                              |   171 | Minor   | Low      |
| `movie-tabs/movie-tab-trailer.tsx`                  |   168 | Yes     | Low      |
| `movie-tabs/movie-tabs.tsx`                         |   155 | Yes     | Low      |

## Top Refactoring Wins

| #   | Refactor                                 | Files affected                        | Why                                                                    |
| --- | ---------------------------------------- | ------------------------------------- | ---------------------------------------------------------------------- |
| 1   | Extract `useEmojiPicker`                 | `comment-form`, `comment-input`       | Removes duplicated dynamic emoji-picker setup and event wiring.        |
| 2   | Extract comment/review list action hooks | `comment-list`, `review-list`         | Moves mutation orchestration out of render trees.                      |
| 3   | Extract movie card hover modal hook      | `cinema-movie-card`, `top-movie-card` | Consolidates repeated hover timeout, portal position, and modal state. |
| 4   | Extract movie side skeleton/info rows    | `movie-side`                          | Shrinks a large sidebar and makes skeleton maintenance easier.         |
| 5   | Extract mobile navigation sections       | `navigation-mobile`                   | Separates auth/profile rendering from route/menu rendering.            |

## High Priority Findings

### `comment/comment-item.tsx`

Still mixes several concerns in one component:

- deep-link scroll targeting
- auto-loading child replies for target comments
- reply/edit lifecycle
- avatar column and owner badge
- child reply rendering
- skeleton

`CommentContent` and `CommentHeader` already exist, so the next useful split is a scroll hook plus a skeleton component.

### `movie-side/movie-side.tsx`

The sidebar still owns poster, title, tag/progress blocks, repeated info rows, actor/director sections, top-view list, and skeleton markup.

Suggested extractions:

- `MovieSidePoster`
- `MovieSideInfoRow`
- `MovieSideTags`
- `MovieSideSkeleton`

### `comment/comment-list.tsx`

The component combines recursive rendering, mutation handlers, optimistic UI decisions, empty states, and pagination/load-more UI.

Suggested extractions:

- `useCommentListActions`
- `CommentListLoadMore`
- possibly `CommentTree`

## Medium Priority Findings

### `discussion/discussion.tsx`

The file coordinates two `useLoadMore` flows and renders the discussion header, user banner, tab body, and skeleton. Extract pure presentational sections first.

### `header/navigation/navigation-mobile.tsx`

Mobile navigation is large because overlay state, route rendering, account/auth branches, and nested navigation UI live together. Extract profile/auth rendering and nav list rendering before changing behavior.

### `comment/comment-form.tsx` and `comment/comment-input.tsx`

Both files still carry emoji picker setup. A shared `useEmojiPicker` hook should own dynamic import, DOM mount/unmount, outside click handling, and emoji selection.

### `collection/cinema-movie-card.tsx` and `collection/top-movie-card.tsx`

Both cards use similar hover modal behavior. Extracting `useMovieCardModal` would centralize timeout and portal position logic.

### `header/dropdown-notification.tsx`

Tabs, bulk actions, and list rendering are all inline. `notification-list.tsx` now exists, so the next split should target the tab/action bar.

## Already Improved

- `src/components/app/episode/episode-card.tsx` now centralizes episode card rendering.
- `watch/watch-series.tsx` and `movie-tabs/movie-tab-series.tsx` are smaller than in the previous review.
- `src/app/search/_components/filter-condition-row.tsx` exists outside this scope but removes a major route-level split candidate.

## No Immediate Split Needed

These files are over 100 lines but are currently acceptable because they are single-purpose or mostly declarative UI:

- `watch/watch-info.tsx`
- `watch/watch-player-video-area.tsx`
- `movie-card/movie-card.tsx`
- `movie-modal/movie-modal.tsx`
- `person-card/person-card.tsx`
- `footer/footer.tsx`
- most modal/button components unless behavior grows further
