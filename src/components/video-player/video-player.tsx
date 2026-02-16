'use client';

import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/audio.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import {
  BufferingIndicator,
  CaptionButton,
  FullscreenToggleButton,
  NextButton,
  PiPToggleButton,
  PlayPauseIndicator,
  PlayToggleButton,
  PreviousButton,
  SeekBackwardButton,
  SeekForwardButton,
  SettingMenu,
  SkipIntroButton,
  TimeSlider,
  VolumeIndicator,
  VolumeToggleButton
} from './_components';
import {
  isHLSProvider,
  MediaPlayer,
  MediaPlayerInstance,
  MediaProvider,
  MediaProviderAdapter,
  MediaTimeUpdateEventDetail,
  Poster,
  Track,
  TrackProps
} from '@vidstack/react';
import {
  DefaultVideoLayout,
  defaultLayoutIcons,
  DefaultVideoLayoutSlots
} from '@vidstack/react/player/layouts/default';
import { createContext, useContext, useRef, useState, forwardRef } from 'react';
import { cn } from '@/lib';

type IndicatorAction = 'initial' | 'play-pause' | 'volume' | 'none';
const IndicatorContext = createContext<{
  currentAction: IndicatorAction;
  setCurrentAction: (action: IndicatorAction) => void;
}>({
  currentAction: 'initial',
  setCurrentAction: () => {}
});

export const useIndicator = () => useContext(IndicatorContext);

const VideoPlayer = forwardRef<
  MediaPlayerInstance,
  {
    auth: boolean;
    autoPlay?: boolean;
    duration: number;
    introEnd: number;
    introStart: number;
    outroStart: number;
    slots?: DefaultVideoLayoutSlots;
    source: string;
    textTracks?: TrackProps[];
    thumbnailUrl: string;
    vttUrl: string;
    className?: string;
    token?: string;
    prev?: boolean;
    next?: boolean;
    title?: string;
    onPrevClick?: () => void;
    onNextClick?: () => void;
    onTimeUpdate?: (detail: MediaTimeUpdateEventDetail) => void;
  }
>(function VideoPlayer(
  {
    auth,
    autoPlay = true,
    duration,
    introEnd,
    introStart,
    outroStart,
    slots,
    source,
    textTracks,
    thumbnailUrl,
    vttUrl,
    className,
    token,
    prev,
    next,
    title,
    onPrevClick,
    onNextClick,
    onTimeUpdate
  },
  ref
) {
  const playerRef = useRef<MediaPlayerInstance>(null);
  const [showSkip, setShowSkip] = useState<boolean>(true);
  const [currentAction, setCurrentAction] =
    useState<IndicatorAction>('initial');

  // Expose internal ref to parent
  if (typeof ref === 'function') {
    ref(playerRef.current);
  } else if (ref) {
    ref.current = playerRef.current;
  }

  const handleTimeChange = (detail: MediaTimeUpdateEventDetail) => {
    const { currentTime } = detail;
    const shouldShowSkip = currentTime >= introStart && currentTime < introEnd;

    setShowSkip((prev) => (prev !== shouldShowSkip ? shouldShowSkip : prev));
    onTimeUpdate?.(detail);
  };

  return (
    <IndicatorContext.Provider value={{ currentAction, setCurrentAction }}>
      <MediaPlayer
        ref={playerRef}
        viewType='video'
        streamType='on-demand'
        logLevel='silent'
        crossOrigin
        playsInline
        preferNativeHLS={false}
        autoPlay={autoPlay}
        src={source}
        fullscreenOrientation={'none'}
        onProviderChange={
          auth ? (provider) => onProviderChange(provider, token) : undefined
        }
        onPlay={() => setCurrentAction('play-pause')}
        onPause={() => setCurrentAction('play-pause')}
        onVolumeChange={() => setCurrentAction('volume')}
        volume={0}
        className={cn(
          'video-player relative h-full rounded-none! border-none!',
          className
        )}
        onTimeUpdate={handleTimeChange}
        title={title}
      >
        <MediaProvider slot='media' className='cursor-pointer'>
          <Poster className='vds-poster' src={thumbnailUrl} />
          {textTracks?.map((track) => (
            <Track {...(track as any)} key={track.src} />
          ))}
        </MediaProvider>
        <DefaultVideoLayout
          thumbnails={vttUrl}
          icons={defaultLayoutIcons}
          slots={{
            playButton: <PlayToggleButton />,
            muteButton: <VolumeToggleButton />,
            fullscreenButton: <FullscreenToggleButton />,
            pipButton: <PiPToggleButton />,
            settingsMenu: (
              <SettingMenu placement='top end' tooltipPlacement='top' />
            ),
            captionButton: <CaptionButton />,
            beforeSettingsMenu: (
              <>
                {prev && onPrevClick && (
                  <PreviousButton onClick={onPrevClick} />
                )}
                {next && onNextClick && <NextButton onClick={onNextClick} />}
                <SeekBackwardButton />
                <SeekForwardButton />
              </>
            ),
            googleCastButton: null,
            afterTimeSlider: showSkip ? (
              <SkipIntroButton
                onClick={() => {
                  if (playerRef.current && introEnd) {
                    playerRef.current.currentTime = introEnd;
                  }
                }}
              />
            ) : (
              <></>
            ),
            timeSlider: (
              <TimeSlider
                introStart={introStart}
                introEnd={introEnd}
                duration={duration}
                outroStart={outroStart}
                vttUrl={vttUrl}
              />
            ),
            centerControlsGroupCenter: (
              <>
                <PlayPauseIndicator />
                <VolumeIndicator />
              </>
            ),
            topControlsGroupCenter: <></>,
            bufferingIndicator: <BufferingIndicator />,
            ...slots
          }}
        />
      </MediaPlayer>
    </IndicatorContext.Provider>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;

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
