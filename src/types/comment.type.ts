import { commentSearchSchema } from '@/schemaValidations';
import { MovieItemResType } from '@/types/movie-item.type';
import { BaseSearchType } from '@/types/search.type';
import z from 'zod';

export type CommentResType = {
  authorId: string;
  authorInfo: string;
  content: string;
  createdDate: string;
  id: string;
  isPinned: boolean;
  modifiedDate: string;
  movieId: string;
  movieItem: MovieItemResType;
  replyToId: string;
  replyToInfo: string;
  status: number;
  totalChildren: number;
  totalDislike: number;
  totalLike: number;
};

export type CommentSearchType = z.infer<typeof commentSearchSchema> &
  BaseSearchType;
