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
  _components/
    watch.tsx              # top-level: fetches movie, seeds movie store, renders player + container
    watch-player.tsx        # WatchPlayerProvider wrapper + header/video-area/controls layout
    watch-container.tsx      # WatchMain + WatchSide layout row
    watch-main.tsx           # info, schedule badge, episode list, discussion
    watch-side.tsx           # actor list, suggestions, review/comment buttons
    not-found.tsx
```

`WatchPlayerProvider`/`useWatchPlayer()` and the watch-specific hooks it
composes are not private to this route anymore — they live in the shared
`src/contexts/` and `src/hooks/` directories so they follow the project's
normal barrel-export convention:

```text
contexts/
  watch-player-context.tsx   # WatchPlayerProvider / useWatchPlayer()
hooks/
  use-watch-player-data.ts   # resolves season/episode/video from movie + query params
  use-player-settings.ts     # brightness/subtitle/audio/speed/resolution/auto-next/skip-intro settings
  use-continue-watching.ts   # "resume or start over" modal
  use-watch-history.ts       # periodic + on-unload watch-history tracking
  use-intro-skip.ts          # auto-skip intro window
  use-outro-skip.ts          # auto-advance to next episode at outro
  use-episode-navigation.ts  # prev/next/ended episode routing
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
       │    └─ WatchPlayerProvider            (contexts/watch-player-context.tsx)
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

`usePlayerSettings()` (`src/hooks/use-player-settings.ts`) manages ten
settings: `audio`, `autoNextEpisode`, `brightness`, `playbackSpeed`,
`resolution`, `skipIntro`, `subtitleBackgroundColor`, `subtitleEnabled`,
`subtitleFontSize`, `subtitleTextColor`. It's a `useReducer` with one action
per field (`TOGGLE_*` / `SET_*`) plus a `LOAD_SETTINGS` bulk-replace action.

The reducer is initialized (and re-synced via a `useEffect`) from the
signed-in user's persisted profile settings (`profile.settings` JSON via
`useAuth()`), falling back to hardcoded defaults (e.g.
`SUBTITLE_FONT_SIZE_SMALL`, `SUBTITLE_BACKGROUND_COLOR_TRANSPARENT`,
`BRIGHTNESS_MAX` for brightness) when a field is absent.

This hook is **in-memory/session-scoped only** — `handleChange*`/
`handleToggle*` setters just dispatch to the reducer; nothing writes to
`localStorage` or calls a mutation to persist changes back to the backend.
Any change made from the watch page (brightness, subtitle style, skip-intro,
auto-next-episode, etc.) is lost on reload/navigation unless the account-level
"Settings" page (`src/app/account/settings/_components/settings-form.tsx`,
backed by `settingsSchema` in `src/schemaValidations/settings.schema.ts`) is
used to persist it to the profile. Keep the defaults in both places
(`use-player-settings.ts`, `settings.schema.ts`, `settings-form.tsx`, and
`setting-menu.tsx`'s own fallback) in sync — see the `SUBTITLE_*`/`BRIGHTNESS_*`
constants in `src/constants/constant.ts` and the option lists in
`src/constants/master-data/subtitle.ts`.

`useWatchPlayer()` is the **only** place that should call `usePlayerSettings()`
within the watch-player tree — it's already part of `WatchPlayerProvider`'s
composed state. Consumers (`WatchPlayerVideoArea`, `WatchPlayerControls`, etc.)
should read settings off `useWatchPlayer()` rather than calling
`usePlayerSettings()` again, since a second call creates an independent
reducer instance that can drift out of sync with the provider's copy.

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
  → usePlayerSettings()             → session-scoped playback preferences
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
  `src/contexts`/`src/hooks`, not inside `VideoPlayer`. `VideoPlayer` should
  stay reusable for the room player and trailer modal, which don't have this
  context available.
- New per-user playback preferences should follow the existing
  `usePlayerSettings` pattern (reducer action + `SET_*`/`TOGGLE_*`), and should
  only be read/dispatched through `useWatchPlayer()` — don't call
  `usePlayerSettings()` a second time elsewhere in the tree.
- `useWatchPlayer()` throws if used outside `WatchPlayerProvider` — only
  components rendered under `<WatchPlayer>` (i.e. inside
  `components/app/watch/watch-player-*`) may call it.
