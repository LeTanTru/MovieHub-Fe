'use client';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/audio.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { MediaPlayer, MediaProvider, Poster, Track } from '@vidstack/react';
import {
  DefaultVideoLayout,
  defaultLayoutIcons
} from '@vidstack/react/player/layouts/default';
import PlayToggleButton from '@/components/form/video-player/PlayToggleButton';
import VolumeToggleButton from '@/components/form/video-player/VolumeToggleButton';
import SeekForwardButton from '@/components/form/video-player/SeekForwardButton';
import SeekBackwardButton from '@/components/form/video-player/SeekBackwardButton';
import PiPToggleButton from '@/components/form/video-player/PiPToggleButton';
import FullscreenToggleButton from '@/components/form/video-player/FullscreenToggleButton';
import SettingMenu from '@/components/form/video-player/SettingMenu';
import CaptionButton from '@/components/form/video-player/CaptionButton';

export default function VideoPlayer() {
  const textTracks = [
    {
      src: 'https://files.vidstack.io/sprite-fight/subs/english.vtt',
      label: 'English',
      language: 'en-US',
      kind: 'subtitles',
      type: 'vtt',
      default: true
    },
    {
      src: 'https://files.vidstack.io/sprite-fight/subs/spanish.vtt',
      label: 'Spanish',
      language: 'es-ES',
      kind: 'subtitles',
      type: 'vtt'
    },
    {
      src: 'https://files.vidstack.io/sprite-fight/chapters.vtt',
      language: 'en-US',
      kind: 'chapters',
      type: 'vtt',
      default: true
    }
  ];

  return (
    <div>
      <MediaPlayer
        viewType='video'
        streamType='on-demand'
        logLevel='warn'
        crossOrigin
        playsInline
        muted
        preferNativeHLS={false}
        autoPlay={false}
        src='https://files.vidstack.io/sprite-fight/hls/stream.m3u8'
      >
        <MediaProvider slot='media'>
          <Poster
            className='vds-poster'
            src='https://files.vidstack.io/sprite-fight/poster.webp'
          />
          {textTracks.map((track) => (
            <Track {...(track as any)} key={track.src} />
          ))}
        </MediaProvider>
        <DefaultVideoLayout
          thumbnails='https://files.vidstack.io/sprite-fight/thumbnails.vtt'
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
                <SeekBackwardButton />
                <SeekForwardButton />
              </>
            ),
            googleCastButton: null
          }}
        />
      </MediaPlayer>
    </div>
  );
}
