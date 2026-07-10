# Watch Player (Watch Page)

`src/app/watch/[slug]/` is the movie-watching route. It wires the generic
`<VideoPlayer>` (see [video-player.md](./video-player.md)) up to everything
movie-specific: episode selection, watch history, continue-watching, per-user
playback settings, and skip-intro/outro behavior. Almost none of this domain
logic lives inside `VideoPlayer` itself — it lives here, in context + hooks,
and is passed down as props.

## Route Structure

```text
app/watch/[slug]/
  page.tsx                # SSR: resolves id from slug, prefetches queries, sets metadata/JSON-LD
  layout.tsx
  loading.tsx
  _context/
    watch-player-context.tsx   # WatchPlayerProvider / useWatchPlayer()
  _hooks/
    use-watch-player-data.tsx  # resolves season/episode/video from movie + query params
    use-player-settings.tsx    # brightness/subtitle/auto-next/skip-intro settings (persisted)
    use-continue-watching.tsx  # "resume or start over" modal
    use-watch-history.tsx      # periodic + on-unload watch-history tracking
    use-intro-skip.tsx         # auto-skip intro window
    use-outro-skip.tsx         # auto-advance to next episode at outro
    use-episode-navigation.tsx # prev/next/ended episode routing
  _components/
    watch.tsx              # top-level: fetches movie, seeds movie store, renders player + container
    watch-player.tsx        # WatchPlayerProvider wrapper + header/video-area/controls layout
    watch-container.tsx      # WatchMain + WatchSide layout row
    watch-main.tsx           # info, schedule badge, episode list, discussion
    watch-side.tsx           # actor list, suggestions, review/comment buttons
    not-found.tsx
```

The actual player-facing UI (video area, controls, header) lives in
`src/components/app/watch/` rather than under `_components/`, since those
pieces are shared/composable app components:

```text
components/app/watch/
  watch-player-header.tsx     # back link + title
  watch-player-video-area.tsx # <VideoPlayer> instance + episode list panel + continue modal
  watch-player-controls.tsx   # like/playlist/auto-next/skip-intro/room/report row
  watch-ask-continue-modal.tsx
  episode-list.tsx / episode-item.tsx / watch-episode.tsx / watch-series.tsx / watch-single.tsx
  actor-list.tsx / actor-cell.tsx
  suggestion-list.tsx / suggestion-item.tsx
  button-*.tsx                # auto-next-episode, skip-intro, movie-theater, room, report
  watch-info.tsx
  video-report-modal.tsx
```

## Component Tree

```text
WatchPage (page.tsx, server component)
  └─ Watch (fetches movie by id, seeds useMovieStore)
       ├─ WatchPlayer
       │    └─ WatchPlayerProvider            (_context/watch-player-context.tsx)
       │         ├─ WatchPlayerHeader
       │         └─ watch-player-container
       │              ├─ WatchPlayerVideoArea  → <VideoPlayer> (video-player.md)
       │              └─ WatchPlayerControls
       └─ WatchContainer
            ├─ WatchMain   (info, episodes, discussion)
            └─ WatchSide   (actors, suggestions)
```

`Watch` resolves the movie via `useMovieQuery(id)` and pushes it into the
Zustand `useMovieStore` so other components (`useMovieInfo()`, etc.) can read
it without prop drilling. `WatchPlayer` and `WatchContainer` are siblings —
`WatchPlayerProvider` only wraps the player half of the tree, so
`WatchContainer`'s episode list / discussion / suggestions do not have access
to `useWatchPlayer()` and instead read from `useMovieStore` / their own
queries.

## `WatchPlayerContext`

`useWatchPlayer()` is the single source of truth for the video area and
controls. `WatchPlayerProvider` composes:

- **Data** — `useWatchPlayerData(movie)`: resolves `season` / `selectedEpisode`
  / `episodes` from the movie's seasons and the `season`/`episode` URL query
  params, derives `isSeries`/`isFirstEpisode`/`isLastEpisode`, picks the actual
  `video` to play (episode video for series, season video for singles, with
  trailer fallback), and builds `videoTitle`.
- **Settings** — `usePlayerSettings()`: see [Player Settings](#player-settings)
  below.
- **Watch history** — `useWatchHistoryTrackingMutation` /
  `useWatchHistoryListQuery` feed `useWatchHistory()`, which exposes
  `handleSeeked` and saves progress periodically (every 60s), on
  `beforeunload`, and on episode change.
- **Continue watching** — `useContinueWatching()`: cross-references
  `watchHistories` against the current `movieItemId` to decide whether to show
  the resume-or-restart modal, and derives `autoPlay` (unauthenticated users or
  users with no resume point autoplay immediately).
- **Intro skip** — `useIntroSkip()`: skips `[introStart, introEnd)` once per
  playback when `skipIntro` is on, retried on `canPlay`, on every time update,
  and when the setting is toggled mid-playback.
- **Episode navigation** — `useEpisodeNavigation()`: builds prev/next episode
  URLs (`?season=&episode=`) and exposes `handleVideoEnded` for
  auto-advancing when `autoNextEpisode` is on.
- **Outro skip** — `useOutroSkip()`: separately watches for `outroStart` and
  calls `onNextEpisode` once per episode (guarded by a ref so it doesn't fire
  repeatedly).
- **Combined time update** — `handleWatchHistoryTimeUpdate` merges position
  tracking (`currentSecondsRef`), intro-skip, and outro-skip into the single
  `onTimeUpdate` handler passed to `<VideoPlayer>`.

`WatchPlayerVideoArea` (in `components/app/watch/`) is the only consumer of
this context that renders `<VideoPlayer>`; it maps context values 1:1 onto the
player's props (`brightness`, `subtitleEnabled`, `onSeeked`, `onEnded`, etc.)
and additionally fetches `videoLibrarySubtitleListData` to build the
`textTracks` array, marking a track `default` only when
`subtitleEnabled && subtitle.isDefault`.

`WatchPlayerControls` only needs a subset of the context
(`autoNextEpisode`, `skipIntro`, and their toggle handlers) plus
`useMovieInfo()` for the like/playlist/room/report buttons.

## Player Settings

`usePlayerSettings()` (`_hooks/use-player-settings.tsx`) manages seven
settings: `autoNextEpisode`, `skipIntro`, `brightness`, `subtitleEnabled`,
`subtitleFontSize`, `subtitleTextColor`, `subtitleBackgroundColor`. It's a
`useReducer` with one action per field (`TOGGLE_*` / `SET_*`) plus a
`LOAD_SETTINGS` bulk-replace action.

**Resolution order for each setting**, highest priority first:

1. Per-browser `localStorage` value (`storageKeys.WATCH_*`), if present —
   loaded once on mount via a `useEffect` and the `loadStored(key, fallback,
parse)` helper.
2. The signed-in user's persisted profile settings
   (`SettingResType`, parsed from `profile.settings` JSON via `useAuth()`).
3. A hardcoded default (e.g. `SUBTITLE_FONT_SIZE_SMALL`,
   `SUBTITLE_BACKGROUND_COLOR_TRANSPARENT`, `100` for brightness).

Every `handleChange*`/`handleToggle*` setter goes through a shared
`dispatchAndPersist(action, key, value)` helper: it dispatches the reducer
action _and_ writes the new value to `localStorage` in the same call, so
in-memory state and persisted state never drift apart within a session.

This hook is intentionally **local/session-scoped** — it does not call any
mutation to persist to the backend. The account-level defaults a user sees the
first time they open the watch page on a new device come from
`src/app/account/settings/_components/settings-form.tsx` (backed by
`settingsSchema` in `src/schemaValidations/settings.schema.ts`), which is a
separate, explicit "Settings" page under `/account/settings`. Keep the
defaults in both places (`use-player-settings.tsx`, `settings.schema.ts`,
`settings-form.tsx`, and `setting-menu.tsx`'s own fallback) in sync — see the
`SUBTITLE_*` constants in `src/constants/constant.ts` and the option lists in
`src/constants/master-data/subtitle.ts`.

## Data Flow Summary

```text
page.tsx (server)
  → prefetches movie/comments/reviews/suggestions/next-episode queries
  → renders <Watch id> inside <HydrationBoundary>

Watch (client)
  → useMovieQuery(id) → useMovieStore (movie, moviePerson)
  → <WatchPlayer> + <WatchContainer>

WatchPlayerProvider
  → useWatchPlayerData(movie)       → season/episode/video resolution
  → usePlayerSettings()             → persisted playback preferences
  → useWatchHistory* hooks          → resume position, periodic save
  → useIntroSkip / useOutroSkip     → time-based automatic actions
  → useEpisodeNavigation            → prev/next/ended routing
  → exposes everything via useWatchPlayer()

WatchPlayerVideoArea
  → useWatchPlayer() + useVideoLibrarySubtitleListQuery()
  → renders <VideoPlayer> (video-player.md) with all of the above wired in
```

## Conventions For This Route

- Keep movie/episode/watch-history/settings domain logic in
  `_context`/`_hooks` here, not inside `VideoPlayer`. `VideoPlayer` should stay
  reusable for the room player and trailer modal, which don't have this
  context available.
- New per-user playback preferences should follow the existing
  `usePlayerSettings` pattern (reducer action + `dispatchAndPersist` + a
  `storageKeys.WATCH_*` entry) rather than introducing a separate storage
  mechanism.
- `useWatchPlayer()` throws if used outside `WatchPlayerProvider` — only
  components rendered under `<WatchPlayer>` (i.e. inside
  `components/app/watch/watch-player-*`) may call it.
