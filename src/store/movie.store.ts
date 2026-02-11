import { MovieStoreType } from '@/types';
import { create } from 'zustand';

const DEFAULT_SEASON = 1;

const useMovieStore = create<MovieStoreType>((set) => ({
  movie: null,
  movieItem: null,
  moviePerson: null,

  movies: [],
  movieItems: [],
  moviePersons: [],

  selectedSeason: DEFAULT_SEASON,

  setMovie: (movie) => set({ movie }),
  setMovieItem: (movieItem) => set({ movieItem }),
  setMoviePerson: (moviePerson) => set({ moviePerson }),

  setMovies: (movies) => set({ movies }),
  setMovieItems: (movieItems) => set({ movieItems }),
  setMoviePersons: (moviePersons) => set({ moviePersons }),

  setSelectedSeason: (season) => set({ selectedSeason: season })
}));

export default useMovieStore;
