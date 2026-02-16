import {
  watchHistorySchema,
  watchHistorySearchSchema
} from '@/schemaValidations';
import { MovieItemResType } from '@/types/movie-item.type';
import { MovieResType } from '@/types/movie.type';
import z from 'zod';

export type WatchHistoryResType = {
  isCompletedMovie: boolean;
  watchHistories: {
    createdDate: string;
    id: string;
    isCompleted: boolean;
    lastWatchSeconds: number;
    modifiedDate: string;
    movie: MovieResType;
    movieId: string;
    movieItem: MovieItemResType;
    movieItemId: string;
    status: number;
    timesWatched: number;
    userId: string;
  }[];
};

export type WatchHistorySearchType = z.infer<typeof watchHistorySearchSchema>;

export type WatchHistoryType = z.infer<typeof watchHistorySchema>;
