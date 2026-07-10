# Video Player

`src/components/video-player/` is the reusable, domain-agnostic Vidstack + HLS.js
player used everywhere a video needs to play in this app. It knows nothing about
movies, episodes, or watch history — that belongs to the caller. It only knows how
to play a source, render controls, and expose callbacks/props for the caller to
hook into.

## Consumers

| Consumer      | File                                                   | Notes                                                                                     |
| ------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| Watch page    | `src/components/app/watch/watch-player-video-area.tsx` | Full feature set: episodes, watch history, brightness/subtitle style, skip intro/outro.   |
| Room playback | `src/app/room/[slug]/_components/player-main.tsx`      | Synced playback for watch-party rooms; host controls, no brightness/subtitle-style props. |
| Trailer modal | `src/components/app/trailer-modal/trailer-modal.tsx`   | Minimal usage — just a source, no episode nav, no settings persistence.                   |

Any prop group not passed by a given consumer degrades gracefully (see
[Brightness & Subtitle Style](#brightness--subtitle-style) below) — the component
is designed so partial adoption doesn't break the default look.

## File Structure

```text
video-player/
  video-player.tsx        # <VideoPlayer> — the component every consumer imports
  video-player.css        # cue/caption styling, layout tweaks over Vidstack's theme
  indicator-context.tsx   # play/pause/volume indicator overlay state
  index.tsx               # barrel: re-exports VideoPlayer + all _components
  _components/
    setting-menu.tsx          # gear-icon menu; composes all submenus below
    quality-submenu.tsx        volume-submenu.tsx
    caption-submenu.tsx        speed-submenu.tsx / speed-slider.tsx
    brightness-submenu.tsx     subtitle-style-submenu.tsx
    submenu-button.tsx          menu-radio.tsx           # shared submenu primitives
    time-slider.tsx            time-slider-highlight.tsx   time-slider-marker.tsx
    play-toggle-button.tsx     play-pause-indicatior.tsx
    volume-toggle-button.tsx   volume-indicator.tsx
    seek-backward-button.tsx   seek-forward-button.tsx
    skip-intro-button.tsx      skip-outro-button.tsx
    previous-button.tsx        next-button.tsx
    full-screen-toggle-button.tsx   pip-toggle-button.tsx
    caption-button.tsx         buffering-indicator.tsx
    default-quality.tsx         styles.tsx (shared Tailwind class strings)
```

## `<VideoPlayer>` API

`VideoPlayerProps` = `Omit<ComponentProps<typeof MediaPlayer>, 'ref' | 'children' | 'viewType' | 'streamType'>`
plus app-specific props. Anything not explicitly destructured in
`video-player.tsx` is captured in `...mediaPlayerProps` and spread onto Vidstack's
`<MediaPlayer>` directly — so any native Vidstack prop (e.g. `src`, `title`,
`keyDisabled`, `onCanPlay`) can be passed straight through without the wrapper
needing to know about it.

Notable custom props:

- `auth: boolean` — when true, `onProviderChange` injects a `Bearer` token via
  HLS.js `xhrSetup` for internal-source videos (see `onProviderChange` at the
  bottom of the file).
- `introStart` / `introEnd` / `outroStart` / `duration` — drive the skip-intro
  and skip-outro button visibility (`handleTimeChange`), and the intro/outro
  highlight bands on the time slider.
- `markers` / `activeMarkerId` — optional chapter-style markers rendered via
  `TimeSliderMarker`.
- `textTracks: TrackProps[]` — declarative subtitle track list; see
  [Text Tracks](#text-tracks) below for why it's applied imperatively.
- `slots: DefaultVideoLayoutSlots` — merged last into Vidstack's
  `DefaultVideoLayout` slots, letting a consumer override or add UI (e.g. the
  watch page injects an episode-list button into `topControlsGroupEnd`).
- `brightness`, `subtitleEnabled`, `subtitleFontSize`, `subtitleTextColor`,
  `subtitleBackgroundColor` and their `on*Change`/`on*Toggle` callbacks — all
  optional; see [Brightness & Subtitle Style](#brightness--subtitle-style).

## Internal Structure

Inside `<MediaPlayer>`:

- **`<MediaProvider>`** renders the poster and applies the brightness CSS
  `filter` inline (`filter: brightness(${brightness}%)`) when `brightness` is
  passed.
- **`<Gesture>`** toggles play/pause on tap, disabled when `disablePlayPause`
  or `hideControls` is set.
- **`<TextTrackSync>`** (internal, not exported) imperatively adds/removes
  `TextTrack` instances on the player instance rather than rendering
  declarative `<Track>` elements.
- **`<SubtitleSync>`** (internal) bridges Vidstack's native CC button with the
  `subtitleEnabled` setting bidirectionally; see
  [Subtitle Enable/Disable Sync](#subtitle-enabledisable-sync).
- **`<DefaultQuality>`** selects a starting resolution from `defaultQuality`
  once quality options are available (maps an internal quality enum to
  pixel heights via `QUALITY_MAP`).
- **`<DefaultVideoLayout>`** (Vidstack) is the control bar; nearly every slot is
  overridden with an app-specific component (`PlayToggleButton`,
  `VolumeToggleButton`, `SettingMenu`, etc.) so the UI matches the design
  system instead of Vidstack's defaults.

### Text Tracks

`TextTrackSync` exists because declarative `<Track>` children can register
duplicate tracks when the track list changes across rapid re-renders (e.g.
multiple query invalidations after a subtitle translation completes). Instead
it diffs `textTracks` in a `useEffect`, removing previously-added tracks and
adding the current set imperatively via `player.textTracks.add()`.

### Subtitle Enable/Disable Sync

`SubtitleSync` keeps two independent subtitle toggles in agreement:

1. Vidstack's own CC button (native track selection, reactive via
   `useMediaState('textTrack')`).
2. The app's `subtitleEnabled` setting (persisted per-user, see
   [watch-player.md](./watch-player.md)).

It also remembers the `id` of whichever caption track was last showing
(`lastActiveTrackIdRef`), so re-enabling captions after they were turned off
restores the same track instead of always falling back to the track marked
`default`.

Direction 1 (CC button → app state): when Vidstack's active-track state
changes and disagrees with `subtitleEnabled`, it calls
`onSubtitleEnabledToggle()`.

Direction 2 (app state → player): when `subtitleEnabled` changes, it
imperatively sets `mode = 'showing'` / `'disabled'` on the caption tracks.

### Brightness & Subtitle Style

`brightness`, `subtitleFontSize`, `subtitleTextColor`, and
`subtitleBackgroundColor` are numeric enum values (see
`src/constants/constant.ts` and `src/constants/master-data/subtitle.ts` for the
`SUBTITLE_*` constants and the `subtitleFontSizes` / `subtitleTextColors` /
`subtitleBackgroundColors` option lists). `video-player.tsx` resolves these
enums to concrete CSS values and writes them as custom properties on
`<MediaPlayer style={...}>`:

| Enum prop                 | CSS custom property       | Consumed by                                                               |
| ------------------------- | ------------------------- | ------------------------------------------------------------------------- |
| `subtitleFontSize`        | `--media-cue-font-size`   | Vidstack's caption CSS (`captions.css`)                                   |
| `subtitleTextColor`       | `--media-user-text-color` | `--cue-color` in Vidstack's theme, referenced again in `video-player.css` |
| `subtitleBackgroundColor` | `--media-user-text-bg`    | `--cue-bg-color` override in `video-player.css`                           |

When a prop is `undefined` (a consumer that doesn't pass it, e.g. the room
player or trailer modal), the resolved value falls back to the same constants
that used to be hardcoded in `video-player.css`, so unmodified consumers keep
their original look.

Because `{...mediaPlayerProps}` is spread onto `<MediaPlayer>` for pass-through
native props, the computed `style` object is applied _after_ the spread and
merged with any caller-supplied `style` (`{ ...mediaPlayerProps.style, ...mediaPlayerStyle }`)
so neither one silently clobbers the other.

## Settings Menu (`SettingMenu`)

`setting-menu.tsx` composes, in order: `VolumeSubmenu`, `QualitySubmenu`,
optionally `BrightnessSubmenu` (only if `brightness` + `onBrightnessChange` are
both provided), optionally `SubtitleStyleSubmenu` (only if `subtitleEnabled`
and all four subtitle-style callbacks are provided), then `CaptionSubmenu`
(track/language picker) and `SpeedSubmenu`.

Each submenu follows the same shape: a `Menu.Root` containing a
`SubmenuButton` (icon + label + current-value hint) and a `Menu.Content` with
either a `Menu.RadioGroup` of `MenuRadio` options or a custom control (sliders
for brightness/speed).

`SubtitleStyleSubmenu` additionally renders an enable/disable toggle row above
the font-size/text-color/background-color radio groups, and visually disables
(`pointer-events-none opacity-40`) those groups when subtitles are off.

## Styling

`video-player.css` layers app-specific overrides on top of Vidstack's shipped
theme (`@vidstack/react/player/styles/default/theme.css`, imported in
`video-player.tsx`). It mainly targets `[data-part='cue-display']` /
`[data-part='cue']` to keep the caption background transparent by default and
route the caption color/background through the custom properties described
above.

`indicator-context.tsx` provides a small context (`currentAction`) so
`PlayPauseIndicator` and `VolumeIndicator` know which transient overlay icon to
show after a play/pause/volume-change gesture — set from `onPlay`, `onPause`,
and `onVolumeChange` handlers in `video-player.tsx`.

## Conventions For This Directory

- Keep this directory's components media-generic. Anything that needs
  episode/movie/user-account knowledge belongs in the consumer
  (`watch-player-video-area.tsx`, `player-main.tsx`, etc.) or is passed in as a
  prop/callback.
- New player features that need per-user persistence should follow the
  existing pattern: expose a plain `value` + `onChange` prop pair here, and let
  the consumer own where the value is loaded from and persisted to (see
  `usePlayerSettings` in [watch-player.md](./watch-player.md)).
- `_components/index.tsx` is a barrel; add new submenu/button exports there.
