import { useNavigate } from '@/hooks';
import { route } from '@/routes';
import { MovieItemResType, MovieResType } from '@/types';
import { useCallback } from 'react';

type useEpisodeNavigationProps = {
  autoNextEpisode: boolean;
  isSeries: boolean;
  isFirstEpisode: boolean;
  isLastEpisode: boolean;
  season: MovieResType['seasons'][number] | null;
  selectedEpisode: MovieItemResType | null;
  currentEpisodeIndex: number;
  episodes: MovieItemResType[];
  movie: MovieResType | null;
  navigate: ReturnType<typeof useNavigate>;
};

const useEpisodeNavigation = ({
  autoNextEpisode,
  isSeries,
  isFirstEpisode,
  isLastEpisode,
  season,
  selectedEpisode,
  currentEpisodeIndex,
  episodes,
  movie,
  navigate
}: useEpisodeNavigationProps) => {
  const buildEpisodeUrl = useCallback(
    (episodeLabel: string) => {
      if (!season || !movie) return '';
      return `${route.watch.path}/${movie.slug}.${movie.id}?season=${season.label}&episode=${episodeLabel}`;
    },
    [season, movie]
  );

  const handleVideoEnded = useCallback(() => {
    if (
      !autoNextEpisode ||
      !isSeries ||
      isLastEpisode ||
      !season ||
      !selectedEpisode
    ) {
      return;
    }

    const nextEpisode = episodes[currentEpisodeIndex + 1];
    if (!nextEpisode) return;
    const nextUrl = buildEpisodeUrl(nextEpisode.label);
    if (nextUrl) navigate.replace(nextUrl);
  }, [
    autoNextEpisode,
    isSeries,
    isLastEpisode,
    season,
    selectedEpisode,
    episodes,
    currentEpisodeIndex,
    buildEpisodeUrl,
    navigate
  ]);

  const handlePrevEpisode = useCallback(() => {
    if (!isSeries || isFirstEpisode || !season || !movie) return;
    const prevEpisode = episodes[currentEpisodeIndex - 1];
    if (!prevEpisode) return;
    const prevUrl = buildEpisodeUrl(prevEpisode.label);
    if (prevUrl) navigate.replace(prevUrl);
  }, [
    isSeries,
    isFirstEpisode,
    season,
    movie,
    episodes,
    currentEpisodeIndex,
    buildEpisodeUrl,
    navigate
  ]);

  const handleNextEpisode = useCallback(() => {
    if (!isSeries || isLastEpisode || !season || !movie) return;
    const nextEpisode = episodes[currentEpisodeIndex + 1];
    if (!nextEpisode) return;
    const nextUrl = buildEpisodeUrl(nextEpisode.label);
    if (nextUrl) navigate.replace(nextUrl);
  }, [
    isSeries,
    isLastEpisode,
    season,
    movie,
    episodes,
    currentEpisodeIndex,
    buildEpisodeUrl,
    navigate
  ]);

  return { handleVideoEnded, handlePrevEpisode, handleNextEpisode };
};

export default useEpisodeNavigation;
