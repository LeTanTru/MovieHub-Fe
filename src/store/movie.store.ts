import { DISCUSSION_TAB_COMMENT } from '@/constants';
import { MovieStoreType } from '@/types';
import { create } from 'zustand';

const DEFAULT_SEASON = '1';

export const useMovieStore = create<MovieStoreType>((set) => ({
  movie: null,
  movieItem: null,

  movies: [],
  movieItems: [],
  moviePerson: [],

  selectedSeason: DEFAULT_SEASON,

  discussionTab: DISCUSSION_TAB_COMMENT,

  setMovie: (movie) => set({ movie }),
  setMovieItem: (movieItem) => set({ movieItem }),

  setMovies: (movies) => set({ movies }),
  setMovieItems: (movieItems) => set({ movieItems }),
  setMoviePerson: (moviePerson) => set({ moviePerson }),

  setSelectedSeason: (season) => set({ selectedSeason: season }),

  setDiscussionTab: (tab) => set({ discussionTab: tab }),

  reset: () =>
    set({
      movie: null,
      movieItem: null,

      movies: [],
      movieItems: [],
      moviePerson: [],

      selectedSeason: DEFAULT_SEASON
    })
}));
