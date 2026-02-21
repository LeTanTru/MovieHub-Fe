import { DISCUSSION_TAB_COMMENT } from '@/constants';
import { MovieStoreType } from '@/types';
import { create } from 'zustand';

const DEFAULT_SEASON = '1';

const useMovieStore = create<MovieStoreType>((set) => ({
  movie: null,
  movieItem: null,
  moviePerson: null,

  movies: [],
  movieItems: [],
  moviePersons: [],

  selectedSeason: DEFAULT_SEASON,

  discussionTab: DISCUSSION_TAB_COMMENT,

  setMovie: (movie) => set({ movie }),
  setMovieItem: (movieItem) => set({ movieItem }),
  setMoviePerson: (moviePerson) => set({ moviePerson }),

  setMovies: (movies) => set({ movies }),
  setMovieItems: (movieItems) => set({ movieItems }),
  setMoviePersons: (moviePersons) => set({ moviePersons }),

  setSelectedSeason: (season) => set({ selectedSeason: season }),

  setDiscussionTab: (tab) => set({ discussionTab: tab }),

  reset: () =>
    set({
      movie: null,
      movieItem: null,
      moviePerson: null,

      movies: [],
      movieItems: [],
      moviePersons: [],

      selectedSeason: DEFAULT_SEASON
    })
}));

export default useMovieStore;
