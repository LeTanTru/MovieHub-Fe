'use client';

import '@vidstack/react/player/styles/base.css';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

import {
  BufferingIndicator,
  CaptionButton,
  DefaultQuality,
  FullscreenToggleButton,
  NextButton,
  PiPToggleButton,
  PlayToggleButton,
  PreviousButton,
  SeekBackwardButton,
  SeekForwardButton,
  SettingMenu,
  SkipIntroButton,
  SkipOutroButton,
  TimeSlider,
  VolumeToggleButton
} from './_components';
import { PlayPauseIndicator } from './_components/play-pause-indicatior';
import { VolumeIndicator } from './_components/volume-indicator';
import {
  Gesture,
  isHLSProvider,
  isTrackCaptionKind,
  MediaPlayer,
  MediaPlayerInstance,
  MediaProvider,
  MediaProviderAdapter,
  MediaTimeUpdateEventDetail,
  MediaTimeUpdateEvent,
  Poster,
  TextTrack,
  TrackProps,
  useMediaState
} from '@vidstack/react';
import {
  DefaultVideoLayout,
  defaultLayoutIcons,
  DefaultVideoLayoutSlots
} from '@vidstack/react/player/layouts/default';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  ComponentProps,
  Ref
} from 'react';
import { cn } from '@/lib';

import './video-player.css';
import type { TimeSliderMarkerType } from '@/types';
import { IndicatorAction, IndicatorContext } from './indicator-context';
import {
  subtitleFontSizes,
  subtitleTextColors,
  subtitleBackgroundColors
} from '@/constants';

type VideoPlayerProps = Omit<
  ComponentProps<typeof MediaPlayer>,
  'ref' | 'children' | 'viewType' | 'streamType'
> & {
  activeMarkerId?: string | null;
  auth: boolean;
  defaultQuality?: number;
  disablePlayPause?: boolean;
  disableSeek?: boolean;
  disableSpeed?: boolean;
  duration: number;
  hideControls?: boolean;
  hidePoster?: boolean;
  hideVolumeIndicator?: boolean;
  introEnd: number;
  introStart: number;
  markers?: TimeSliderMarkerType[];
  next?: boolean;
  outroStart: number;
  prev?: boolean;
  skipOutro?: boolean;
  slots?: DefaultVideoLayoutSlots;
  textTracks?: TrackProps[];
  thumbnailUrl: string;
  token?: string;
  vttUrl: string;
  // — Brightness & subtitle style (optional; omitted → room player fallback)
  brightness?: number;
  subtitleEnabled?: boolean;
  subtitleFontSize?: number;
  subtitleTextColor?: number;
  subtitleBackgroundColor?: number;
  onBrightnessChange?: (value: number) => void;
  onSubtitleEnabledToggle?: () => void;
  onSubtitleFontSizeChange?: (value: number) => void;
  onSubtitleTextColorChange?: (value: number) => void;
  onSubtitleBackgroundColorChange?: (value: number) => void;
  onNextClick?: () => void;
  onPrevClick?: () => void;
  onSeeked?: (currentTime: number) => void;
};

export function VideoPlayer({
  activeMarkerId,
  auth,
  autoPlay = true,
  className,
  defaultQuality = 0,
  disablePlayPause = false,
  disableSeek = false,
  disableSpeed = false,
  duration,
  hideControls = false,
  hidePoster = false,
  hideVolumeIndicator = false,
  introEnd,
  introStart,
  markers,
  next,
  outroStart,
  prev,
  ref,
  skipOutro = false,
  slots,
  textTracks,
  thumbnailUrl,
  token,
  volume = 0.5,
  vttUrl,
  brightness,
  subtitleEnabled,
  subtitleFontSize,
  subtitleTextColor,
  subtitleBackgroundColor,
  onBrightnessChange,
  onSubtitleEnabledToggle,
  onSubtitleFontSizeChange,
  onSubtitleTextColorChange,
  onSubtitleBackgroundColorChange,
  onEnded,
  onNextClick,
  onPrevClick,
  onSeeked,
  onTimeUpdate,
  ...mediaPlayerProps
}: VideoPlayerProps & { ref?: Ref<MediaPlayerInstance> }) {
  const playerRef = useRef<MediaPlayerInstance | null>(null);
  const [showSkipIntro, setShowSkipIntro] = useState<boolean>(false);
  const [showSkipOutro, setShowSkipOutro] = useState<boolean>(false);
  const [currentAction, setCurrentAction] =
    useState<IndicatorAction>('initial');

  const setPlayerRefs = useCallback(
    (instance: MediaPlayerInstance | null) => {
      playerRef.current = instance;
      if (typeof ref === 'function') {
        ref(instance);
      } else if (ref) {
        ref.current = instance;
      }
    },
    [ref]
  );

  const handleTimeChange = (
    detail: MediaTimeUpdateEventDetail,
    nativeEvent: MediaTimeUpdateEvent
  ) => {
    const { currentTime } = detail;
    const shouldShowSkipIntro =
      currentTime >= introStart && currentTime < introEnd;
    const shouldShowSkipOutro =
      skipOutro &&
      !!onNextClick &&
      duration > 0 &&
      outroStart > 0 &&
      outroStart < duration &&
      currentTime >= outroStart &&
      currentTime < duration;

    setShowSkipIntro((prev) =>
      prev !== shouldShowSkipIntro ? shouldShowSkipIntro : prev
    );
    setShowSkipOutro((prev) =>
      prev !== shouldShowSkipOutro ? shouldShowSkipOutro : prev
    );
    onTimeUpdate?.(detail, nativeEvent);
  };

  // Resolve numeric enum subtitle values → CSS strings, falling back to the
  // same values that were previously hardcoded in video-player.css.
  const resolvedFontSize =
    subtitleFontSize !== undefined
      ? `${subtitleFontSizes.find((s) => s.value === subtitleFontSize)?.pixels ?? 20}px`
      : '20px';
  const resolvedTextColor =
    subtitleTextColor !== undefined
      ? (subtitleTextColors.find((s) => s.value === subtitleTextColor)?.color ??
        'inherit')
      : 'inherit';
  const resolvedBgColor =
    subtitleBackgroundColor !== undefined
      ? (subtitleBackgroundColors.find(
          (s) => s.value === subtitleBackgroundColor
        )?.color ?? 'transparent')
      : 'transparent';

  const mediaPlayerStyle = {
    '--media-cue-font-size': resolvedFontSize,
    '--media-user-text-color':
      resolvedTextColor !== 'inherit' ? resolvedTextColor : undefined,
    '--media-user-text-bg':
      resolvedBgColor !== 'transparent' ? resolvedBgColor : undefined
  } as ComponentProps<typeof MediaPlayer>['style'];

  return (
    <IndicatorContext.Provider value={{ currentAction, setCurrentAction }}>
      <MediaPlayer
        ref={setPlayerRefs}
        viewType='video'
        streamType='on-demand'
        logLevel='silent'
        crossOrigin
        playsInline
        preferNativeHLS={false}
        autoPlay={autoPlay}
        fullscreenOrientation='none'
        volume={volume}
        className={cn('video-player', className)}
        onProviderChange={
          auth ? (provider) => onProviderChange(provider, token) : undefined
        }
        onPlay={() => setCurrentAction('play-pause')}
        onPause={() => setCurrentAction('play-pause')}
        onVolumeChange={() => setCurrentAction('volume')}
        onTimeUpdate={handleTimeChange}
        onSeeked={onSeeked}
        onEnded={onEnded}
        {...mediaPlayerProps}
        style={{ ...mediaPlayerProps.style, ...mediaPlayerStyle }}
      >
        <MediaProvider
          slot='media'
          className='cursor-pointer'
          style={
            brightness !== undefined
              ? { filter: `brightness(${brightness}%)` }
              : undefined
          }
        >
          {!hidePoster && <Poster className='vds-poster' src={thumbnailUrl} />}
        </MediaProvider>
        {!hideControls && !disablePlayPause && (
          <Gesture
            className='pointer-events-auto absolute inset-0 z-0 block h-full w-full'
            event='pointerup'
            action='toggle:paused'
          />
        )}
        <TextTrackSync textTracks={textTracks} playerRef={playerRef} />
        <SubtitleSync
          subtitleEnabled={subtitleEnabled}
          playerRef={playerRef}
          onSubtitleEnabledToggle={onSubtitleEnabledToggle}
        />
        <DefaultQuality defaultQuality={defaultQuality} />
        {!hideControls && (
          <DefaultVideoLayout
            noGestures={true}
            smallLayoutWhen={false}
            thumbnails={vttUrl}
            icons={defaultLayoutIcons}
            slots={{
              playButton: <PlayToggleButton disabled={disablePlayPause} />,
              muteButton: <VolumeToggleButton />,
              fullscreenButton: <FullscreenToggleButton />,
              pipButton: <PiPToggleButton />,
              settingsMenu: (
                <SettingMenu
                  placement='top end'
                  tooltipPlacement='top'
                  disableSpeed={disableSpeed}
                  brightness={brightness}
                  subtitleEnabled={subtitleEnabled}
                  subtitleFontSize={subtitleFontSize}
                  subtitleTextColor={subtitleTextColor}
                  subtitleBackgroundColor={subtitleBackgroundColor}
                  onBrightnessChange={onBrightnessChange}
                  onSubtitleEnabledToggle={onSubtitleEnabledToggle}
                  onSubtitleFontSizeChange={onSubtitleFontSizeChange}
                  onSubtitleTextColorChange={onSubtitleTextColorChange}
                  onSubtitleBackgroundColorChange={
                    onSubtitleBackgroundColorChange
                  }
                />
              ),
              captionButton: <CaptionButton />,
              beforeSettingsMenu: (
                <>
                  <div className='max-640:hidden contents'>
                    {prev && onPrevClick && (
                      <PreviousButton onClick={onPrevClick} />
                    )}
                    {next && onNextClick && (
                      <NextButton onClick={onNextClick} />
                    )}
                    <SeekBackwardButton disabled={disableSeek} />
                    <SeekForwardButton disabled={disableSeek} />
                  </div>
                </>
              ),
              googleCastButton: null,
              afterTimeSlider:
                showSkipIntro || showSkipOutro ? (
                  <>
                    {showSkipIntro && (
                      <SkipIntroButton
                        onClick={() => {
                          if (playerRef.current && introEnd) {
                            playerRef.current.currentTime = introEnd;
                          }
                        }}
                      />
                    )}
                    {showSkipOutro && <SkipOutroButton onClick={onNextClick} />}
                  </>
                ) : null,
              timeSlider: (
                <TimeSlider
                  introStart={introStart}
                  introEnd={introEnd}
                  duration={duration}
                  outroStart={outroStart}
                  vttUrl={vttUrl}
                  markers={markers}
                  activeMarkerId={activeMarkerId}
                  disabled={disableSeek}
                />
              ),
              bufferingIndicator: (
                <>
                  <PlayPauseIndicator />
                  <BufferingIndicator />
                  {!hideVolumeIndicator && <VolumeIndicator />}
                </>
              ),
              ...slots
            }}
          />
        )}
      </MediaPlayer>
    </IndicatorContext.Provider>
  );
}

VideoPlayer.displayName = 'VideoPlayer';

/**
 * Imperatively syncs text tracks with the vidstack player instance.
 * Using declarative `<Track>` components can cause duplicate registrations
 * when the track list is updated during rapid successive re-renders
 * (e.g., multiple query invalidations after subtitle translation).
 */
function TextTrackSync({
  textTracks,
  playerRef
}: {
  textTracks?: TrackProps[];
  playerRef: React.RefObject<MediaPlayerInstance | null>;
}) {
  const addedTracksRef = useRef<TextTrack[]>([]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    for (const track of addedTracksRef.current) {
      player.textTracks.remove(track);
    }
    addedTracksRef.current = [];

    if (textTracks?.length) {
      for (const t of textTracks) {
        const textTrack = new TextTrack({
          src: t.src,
          label: t.label,
          language: t.language,
          kind: (t.kind as 'subtitles' | 'captions') ?? 'subtitles',
          type: t.type,
          default: t.default
        });
        player.textTracks.add(textTrack);
        addedTracksRef.current.push(textTrack);
      }
    }

    return () => {
      for (const track of addedTracksRef.current) {
        player.textTracks.remove(track);
      }
      addedTracksRef.current = [];
    };
  }, [textTracks, playerRef]);

  return null;
}

/**
 * Bridges Vidstack's native CC button with our subtitleEnabled setting in
 * both directions:
 *   CC button click → updates our subtitleEnabled state (via onSubtitleEnabledToggle)
 *   subtitleEnabled change → imperatively sets track mode on the player
 */
function SubtitleSync({
  subtitleEnabled,
  playerRef,
  onSubtitleEnabledToggle
}: {
  subtitleEnabled?: boolean;
  playerRef: React.RefObject<MediaPlayerInstance | null>;
  onSubtitleEnabledToggle?: () => void;
}) {
  // Vidstack's reactive state: the currently active text track (null when off)
  const activeTrack = useMediaState('textTrack');
  const isVidstackOn = !!(activeTrack && isTrackCaptionKind(activeTrack));

  // Remembers which track was showing before subtitles were last disabled, so
  // re-enabling restores the user's actual selection instead of the default.
  const lastActiveTrackIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (isVidstackOn && activeTrack) {
      lastActiveTrackIdRef.current = activeTrack.id;
    }
  }, [isVidstackOn, activeTrack]);

  // Direction 1: CC button → our state
  // When Vidstack's track state disagrees with subtitleEnabled, sync our state.
  const prevVidstackOnRef = useRef<boolean | null>(null);
  useEffect(() => {
    if (subtitleEnabled === undefined || !onSubtitleEnabledToggle) return;
    // Only fire on actual changes (skip the initial mount snapshot)
    if (prevVidstackOnRef.current === null) {
      prevVidstackOnRef.current = isVidstackOn;
      return;
    }
    if (prevVidstackOnRef.current !== isVidstackOn) {
      prevVidstackOnRef.current = isVidstackOn;
      if (isVidstackOn !== subtitleEnabled) {
        onSubtitleEnabledToggle();
      }
    }
  }, [isVidstackOn, subtitleEnabled, onSubtitleEnabledToggle]);

  // Direction 2: our state → CC button
  // When subtitleEnabled flips, imperatively set the mode on all caption tracks.
  useEffect(() => {
    if (subtitleEnabled === undefined) return;
    const player = playerRef.current;
    if (!player) return;

    // Find all caption/subtitle tracks
    const tracks = [...player.textTracks].filter((t) => isTrackCaptionKind(t));
    if (tracks.length === 0) return;

    if (subtitleEnabled) {
      // Restore whichever track was last showing, falling back to the default
      const preferred =
        tracks.find((t) => t.id === lastActiveTrackIdRef.current) ??
        tracks.find((t) => t.default) ??
        tracks[0];
      preferred.mode = 'showing';
    } else {
      // Disable all caption tracks
      for (const t of tracks) {
        t.mode = 'disabled';
      }
    }
  }, [subtitleEnabled, playerRef]);

  return null;
}

function onProviderChange(
  provider: MediaProviderAdapter | null,
  token?: string
) {
  if (isHLSProvider(provider)) {
    provider.config = {
      xhrSetup(xhr) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
    };
  }
}
