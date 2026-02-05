'use client';

import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/audio.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import {
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
import { createContext, useContext, useRef, useState } from 'react';
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

export default function VideoPlayer({
  auth,
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
  token
}: {
  auth: boolean;
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
}) {
  const playerRef = useRef<MediaPlayerInstance>(null);
  const [showSkip, setShowSkip] = useState<boolean>(true);
  const [currentAction, setCurrentAction] =
    useState<IndicatorAction>('initial');

  const handleTimeChange = (detail: MediaTimeUpdateEventDetail) => {
    const { currentTime } = detail;
    const shouldShowSkip = currentTime >= introStart && currentTime < introEnd;

    setShowSkip((prev) => (prev !== shouldShowSkip ? shouldShowSkip : prev));
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
        autoPlay
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
                <PreviousButton />
                <NextButton />
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
              </>
            ),
            topControlsGroupCenter: (
              <>
                <VolumeIndicator />
              </>
            ),
            ...slots
          }}
        />
      </MediaPlayer>
    </IndicatorContext.Provider>
  );
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
