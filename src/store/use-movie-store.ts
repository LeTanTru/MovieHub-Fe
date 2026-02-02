import { MovieStoreType } from '@/types';
import { create } from 'zustand';

const useMovieStore = create<MovieStoreType>((set) => ({
  movie: null,
  movieItem: null,
  moviePerson: null,

  movies: [],
  movieItems: [],
  moviePersons: [],

  setMovie: (movie) => set({ movie }),
  setMovieItem: (movieItem) => set({ movieItem }),
  setMoviePerson: (moviePerson) => set({ moviePerson }),

  setMovies: (movies) => set({ movies }),
  setMovieItems: (movieItems) => set({ movieItems }),
  setMoviePersons: (moviePersons) => set({ moviePersons })
}));

export default useMovieStore;
