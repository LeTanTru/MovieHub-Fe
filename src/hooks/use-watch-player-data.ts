import { MOVIE_TYPE_SERIES, MOVIE_TYPE_SINGLE } from '@/constants';
import { useQueryParams } from './use-query-params';
import type { MovieItemResType, MovieResType } from '@/types';
import { useMemo } from 'react';

export const useWatchPlayerData = (movie: MovieResType | null) => {
  const { searchParams } = useQueryParams<{
    season: string;
    episode: string;
  }>();

  const currentSeason = searchParams.season;
  const currentEpisode = searchParams.episode;
  const isSingle = movie?.type === MOVIE_TYPE_SINGLE;
  const isSeries = movie?.type === MOVIE_TYPE_SERIES;

  const getSeason = () => {
    if (!movie?.seasons?.length) return null;
    if (!currentSeason) return movie.seasons[movie.seasons.length - 1];
    return (
      movie.seasons.find((item) => item.label === currentSeason) ||
      movie.seasons[movie.seasons.length - 1]
    );
  };

  const season = getSeason();

  const getEpisode = () => {
    if (!isSeries) return null;
    const episodeList = (season?.episodes || []) as MovieItemResType[];
    if (!episodeList.length) return null;
    if (!currentEpisode) return episodeList[episodeList.length - 1];
    return (
      episodeList.find((item) => item.label === currentEpisode) ||
      episodeList[episodeList.length - 1]
    );
  };

  const selectedEpisode = getEpisode();

  const episodes = useMemo(
    () => (season?.episodes || []) as MovieItemResType[],
    [season?.episodes]
  );

  const getEpisodeIndex = () => {
    if (!selectedEpisode || !episodes.length) return -1;
    return episodes.findIndex((ep) => ep.label === selectedEpisode.label);
  };

  const currentEpisodeIndex = getEpisodeIndex();

  const isFirstEpisode = currentEpisodeIndex === 0;
  const isLastEpisode = currentEpisodeIndex === episodes.length - 1;

  const getVideo = () => {
    if (isSeries)
      return selectedEpisode?.video || season?.trailer?.video || null;
    if (isSingle) return season?.video || season?.trailer?.video || null;
    return (
      season?.video || selectedEpisode?.video || season?.trailer?.video || null
    );
  };

  const video = getVideo();

  const isPlayingTrailer = !!(
    video?.id &&
    season?.trailer?.video?.id &&
    video.id === season.trailer.video.id
  );

  const getVideoTitle = () => {
    if (!movie) return '';
    if (isPlayingTrailer) return `Trailer - ${movie.title}`;
    if (isSeries && season && selectedEpisode) {
      return `${season.title} - Phần ${season.label} - Tập ${selectedEpisode.label}. ${selectedEpisode.title}`;
    }
    return `${movie.title} - ${movie.originalTitle}`;
  };

  const videoTitle = getVideoTitle();

  const movieItemId = isSeries ? selectedEpisode?.id : season?.id;

  return {
    isSeries,
    isPlayingTrailer,
    season,
    selectedEpisode,
    episodes,
    currentEpisodeIndex,
    isFirstEpisode,
    isLastEpisode,
    video,
    videoTitle,
    movieItemId
  };
};
