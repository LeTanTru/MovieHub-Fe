'use client';

import {
  ageRatings,
  countries,
  languages,
  MOVIE_TYPE_SERIES,
  MOVIE_TYPE_SINGLE,
  PERSON_KIND_ACTOR,
  PERSON_KIND_DIRECTOR
} from '@/constants';
import { route } from '@/routes';
import { useMovieStore } from '@/store';
import { getYearFromDate, parseJSON, sanitizeText } from '@/utils';
import { useShallow } from 'zustand/shallow';
import type { MetadataType, PersonResType } from '@/types';

export const useMovieInfo = () => {
  const { movie, moviePerson, selectedSeason } = useMovieStore(
    useShallow((s) => ({
      movie: s.movie,
      moviePerson: s.moviePerson,
      selectedSeason: s.selectedSeason
    }))
  );

  if (!movie) {
    return {
      movie: null,
      moviePerson: [],
      selectedSeason: '1',
      ageRating: undefined,
      categories: [],
      countryName: 'Đang cập nhật',
      languageName: 'Đang cập nhật',
      directors: [],
      actors: [],
      metadata: null,
      latestSeason: undefined,
      currentSeason: undefined,
      episodes: [],
      latestEpisode: undefined,
      latestEpisodeVideo: undefined,
      duration: undefined,
      releaseDate: undefined,
      sanitizedDescription: 'Đang cập nhật',
      isComplete: false,
      isSingle: false,
      isSeries: false,
      releaseYear: undefined,
      hasTrailer: false,
      watchLink: null,
      trailerLink: null
    };
  }

  const isSingle = movie.type === MOVIE_TYPE_SINGLE;
  const isSeries = movie.type === MOVIE_TYPE_SERIES;

  const ageRating = ageRatings.find(
    (age) => movie.ageRating === age.value
  )?.label;

  const categories = movie.categories || [];

  const countryName =
    countries.find((country) => country.value === movie.country)?.label ||
    'Đang cập nhật';

  const languageName =
    languages.find((language) => language.value === movie.language)?.label ||
    'Đang cập nhật';

  const directors = moviePerson.reduce<PersonResType[]>((acc, item) => {
    if (item.kind === PERSON_KIND_DIRECTOR) {
      acc.push(item.person);
    }
    return acc;
  }, []);

  const actors = moviePerson.reduce<PersonResType[]>((acc, item) => {
    if (item.kind === PERSON_KIND_ACTOR) {
      acc.push(item.person);
    }
    return acc;
  }, []);

  const metadata = parseJSON<MetadataType>(movie.metadata || '{}');

  const latestSeason = isSingle
    ? metadata?.latestSeason?.label
    : selectedSeason || metadata?.latestSeason?.label;

  const currentSeason = movie.seasons?.find(
    (season) => season.label === latestSeason?.toString()
  );

  const episodes = currentSeason?.episodes || [];

  const latestEpisode = episodes?.length
    ? episodes[episodes.length - 1]?.label
    : metadata?.latestEpisode?.label;

  const latestEpisodeVideo = episodes?.[episodes.length - 1]?.video;

  const duration = metadata?.duration || latestEpisodeVideo?.duration;

  const sanitizedDescription = sanitizeText(
    currentSeason?.description || movie.description || 'Đang cập nhật'
  );

  const releaseDate = currentSeason?.releaseDate || movie.releaseDate;

  const isComplete =
    episodes.length > 0 && currentSeason?.totalEpisode === episodes.length;

  const releaseYear = getYearFromDate(
    currentSeason?.releaseDate ||
      metadata?.latestSeason?.releaseDate ||
      movie.releaseDate
  );

  const hasTrailer =
    movie.seasons?.some((season) => season.trailer && season.trailer.video) ||
    false;

  const watchLink = (() => {
    const hasVideo = movie.seasons?.some(
      (season) => season.video || season.episodes?.some((ep) => ep.video)
    );

    if (!movie.seasons?.length || !hasVideo) return null;

    const activeSeason = movie.seasons.find(
      (season) => season.label === selectedSeason
    );

    const latest = movie.seasons[movie.seasons.length - 1];
    const targetSeason = activeSeason || latest;

    const latestEp = isSeries
      ? targetSeason?.episodes?.[targetSeason?.episodes?.length - 1]
      : null;

    if (!latestEp && isSeries) return null;

    return isSeries
      ? `${route.watch.path}/${movie.slug}.${movie.id}?season=${targetSeason.label}&episode=${latestEp?.label}`
      : `${route.watch.path}/${movie.slug}.${movie.id}?season=${targetSeason.label}`;
  })();

  const trailerLink = (() => {
    const trailerSeason = movie.seasons?.find(
      (season) => season.trailer && season.trailer.video
    );
    if (!trailerSeason) return null;
    return `${route.watch.path}/${movie.slug}.${movie.id}?season=${trailerSeason.label}`;
  })();

  return {
    movie,
    moviePerson,
    selectedSeason,
    ageRating,
    categories,
    countryName,
    languageName,
    directors,
    actors,
    metadata,
    latestSeason,
    currentSeason,
    episodes,
    latestEpisode,
    latestEpisodeVideo,
    duration,
    releaseDate,
    sanitizedDescription,
    isComplete,
    isSingle,
    isSeries,
    releaseYear,
    hasTrailer,
    watchLink,
    trailerLink
  };
};
