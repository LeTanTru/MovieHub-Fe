import { MOVIE_TYPE_SERIES, MOVIE_TYPE_SINGLE } from '@/constants';
import { useQueryParams } from '@/hooks';
import { MovieItemResType, MovieResType } from '@/types';
import { useMemo } from 'react';

const useWatchPlayerData = (movie: MovieResType | null) => {
  const { searchParams } = useQueryParams<{
    season: string;
    episode: string;
  }>();

  const currentSeason = searchParams.season;
  const currentEpisode = searchParams.episode;
  const isSingle = movie?.type === MOVIE_TYPE_SINGLE;
  const isSeries = movie?.type === MOVIE_TYPE_SERIES;

  const season = (() => {
    if (!movie?.seasons?.length) return null;
    if (!currentSeason) return movie.seasons[movie.seasons.length - 1];
    return (
      movie.seasons.find((item) => item.label === currentSeason) ||
      movie.seasons[movie.seasons.length - 1]
    );
  })();

  const selectedEpisode = (() => {
    if (!isSeries) return null;
    const episodeList = (season?.episodes || []) as MovieItemResType[];
    if (!episodeList.length) return null;
    if (!currentEpisode) return episodeList[episodeList.length - 1];
    return (
      episodeList.find((item) => item.label === currentEpisode) ||
      episodeList[episodeList.length - 1]
    );
  })();

  const episodes = useMemo(
    () => (season?.episodes || []) as MovieItemResType[],
    [season?.episodes]
  );

  const currentEpisodeIndex = (() => {
    if (!selectedEpisode || !episodes.length) return -1;
    return episodes.findIndex((ep) => ep.label === selectedEpisode.label);
  })();

  const isFirstEpisode = currentEpisodeIndex === 0;
  const isLastEpisode = currentEpisodeIndex === episodes.length - 1;

  const video = (() => {
    if (isSeries) return selectedEpisode?.video;
    if (isSingle) return season?.video;
    return season?.video || selectedEpisode?.video || null;
  })();

  const videoTitle = (() => {
    if (!movie) return '';
    if (isSeries && season && selectedEpisode) {
      return `${season.title} - Phần ${season.label} - Tập ${selectedEpisode.label}. ${selectedEpisode.title}`;
    }
    return `${movie.title} - ${movie.originalTitle}`;
  })();

  const movieItemId = isSeries ? selectedEpisode?.id : season?.id;

  return {
    isSeries,
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

export default useWatchPlayerData;
