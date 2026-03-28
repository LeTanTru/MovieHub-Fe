'use client';

import { useWatchPlayer } from '@/app/watch/[slug]/_hooks';
import './watch-player.css';

import {
  WatchPlayerControls,
  WatchPlayerHeader,
  WatchPlayerVideoArea
} from '@/components/app/watch';

export default function WatchPlayer() {
  const {
    movie,
    videoTitle,
    video,
    isLoadingToken,
    autoPlay,
    token,
    playerRef,
    isSeries,
    isFirstEpisode,
    isLastEpisode,
    handlePrevEpisode,
    handleNextEpisode,
    isShowContinueModal,
    lastWatchedSeconds,
    handleContinueWatching,
    handleStartOver,
    handleWatchHistoryTimeUpdate,
    handleSeeked,
    handleVideoEnded,
    handlePlayerCanPlay,
    autoNextEpisode,
    skipIntro,
    handleToggleAutoNextEpisode,
    handleToggleSkipIntro
  } = useWatchPlayer();

  if (!movie) return null;

  return (
    <div className='watch-player max-800:max-w-none max-800:w-full max-800:px-0 max-640:-mt-10 max-640:flex max-640:flex-col-reverse relative mx-auto max-w-410 px-5'>
      <WatchPlayerHeader movie={movie} videoTitle={videoTitle} />
      <div className='watch-player-container'>
        <WatchPlayerVideoArea
          video={video}
          isLoadingToken={isLoadingToken}
          autoPlay={autoPlay}
          token={token}
          videoTitle={videoTitle}
          movie={movie}
          playerRef={playerRef}
          episode={{
            isSeries: isSeries,
            isFirstEpisode: isFirstEpisode,
            isLastEpisode: isLastEpisode,
            onPrev: handlePrevEpisode,
            onNext: handleNextEpisode
          }}
          continueModal={{
            isOpen: isShowContinueModal,
            lastWatchedSeconds: lastWatchedSeconds,
            onContinue: handleContinueWatching,
            onStartOver: handleStartOver
          }}
          callbacks={{
            onTimeUpdate: handleWatchHistoryTimeUpdate,
            onSeeked: handleSeeked,
            onEnded: handleVideoEnded,
            onCanPlay: handlePlayerCanPlay
          }}
        />
        <WatchPlayerControls
          movie={movie}
          autoNextEpisode={autoNextEpisode}
          skipIntro={skipIntro}
          handleToggleAutoNextEpisode={handleToggleAutoNextEpisode}
          handleToggleSkipIntro={handleToggleSkipIntro}
        />
      </div>
    </div>
  );
}
