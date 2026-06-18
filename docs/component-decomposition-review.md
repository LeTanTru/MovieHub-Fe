# Component Decomposition Review

Reviewed: 2026-06-18

This document reviews larger MovieHub FE components and tracks decomposition work that should make the codebase easier to maintain. Several recommendations from the previous review have already been implemented.

## Completed Since Previous Review

| Area                     | Previous issue                                                                | Current status                                                                                                                   |
| ------------------------ | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Image upload cropper     | `upload-image-field.tsx` embedded the crop dialog and crop calculations.      | `ImageCropperDialog` now lives in `src/components/form/image-cropper-dialog.tsx`; `upload-image-field.tsx` is down to 264 lines. |
| Episode card duplication | `watch-series.tsx` and `movie-tab-series.tsx` duplicated episode card markup. | Shared `src/components/app/episode/episode-card.tsx` exists and both files are smaller.                                          |
| Search filters           | `filter.tsx` rendered each condition row inline.                              | `src/app/search/_components/filter-condition-row.tsx` exists; `filter.tsx` is down to 184 lines.                                 |
| Forgot password flow     | Step views were embedded in `forgot-password-form.tsx`.                       | `step-one.tsx` and `step-two.tsx` now split that flow.                                                                           |

## Current Priority Candidates

| Component                                                    | Current lines | Priority | Main issue                                                                                                     | Suggested next action                                                                                   |
| ------------------------------------------------------------ | ------------: | -------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `src/components/form/image-cropper-dialog.tsx`               |           325 | High     | Crop dialog owns cropper UI, aspect controls, zoom controls, crop math, and dialog actions.                    | Extract crop math/helpers and a small `CropperControls` component.                                      |
| `src/components/app/comment/comment-item.tsx`                |           385 | High     | Still mixes scroll targeting, reply/edit lifecycle, avatar column, toxic content, child replies, and skeleton. | Extract scroll hook, avatar column, and skeleton. Keep content rendering delegated to `CommentContent`. |
| `src/components/app/movie-side/movie-side.tsx`               |           283 | High     | Sidebar mixes poster, title, tags, info rows, actors/directors, top views, and a large skeleton.               | Extract `MovieSideInfoRow`, `MovieSidePoster`, tag block, and skeleton.                                 |
| `src/components/app/comment/comment-list.tsx`                |           271 | High     | Vote/delete mutation handlers are embedded with recursive rendering, empty state, and load-more UI.            | Extract `useCommentListActions` and `CommentListLoadMore`.                                              |
| `src/components/app/discussion/discussion.tsx`               |           262 | Medium   | Comments/reviews load-more flows and discussion header/user banner live together.                              | Extract `DiscussionHeader`, `DiscussionUserBanner`, and skeleton.                                       |
| `src/components/app/header/navigation/navigation-mobile.tsx` |           258 | Medium   | Mobile nav mixes menu state, auth-aware rendering, nested nav UI, and overlay layout.                          | Extract auth/profile area and route list rendering.                                                     |
| `src/components/app/comment/comment-form.tsx`                |           255 | Medium   | Emoji picker and form action row add complexity.                                                               | Extract shared emoji picker hook and form action row.                                                   |
| `src/components/app/comment/comment-input.tsx`               |           233 | Medium   | Duplicates emoji picker setup from comment form.                                                               | Reuse the same emoji picker hook.                                                                       |

## Notes For Future Refactors

- Keep route-local components under `_components/`; shared app components belong under `src/components/app/<domain>/`.
- Prefer hooks for mutation orchestration and components for repeated presentational blocks.
- When extracting from comments/reviews, preserve toxic-span behavior and local reveal state.
- When extracting from watch/movie components, preserve SSR hydration query keys and selected season behavior.
- After component splits, update barrel exports and run `yarn lint -- <changed files>`.
