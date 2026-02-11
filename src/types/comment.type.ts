import {
  commentSchema,
  commentSearchSchema,
  voteCommentSchema
} from '@/schemaValidations';
import { MovieItemResType } from '@/types/movie-item.type';
import { BaseSearchType } from '@/types/search.type';
import z from 'zod';

export type AuthorInfo = {
  avatarPath: string;
  email: string;
  fullName: string;
  id: string;
  kind: number;
  gender: number;
};

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

export type CommentVoteResType = {
  id: string;
  type: number;
};

export type CreateCommentBodyType = z.infer<typeof commentSchema>;

export type UpdateCommentBodyType = Pick<
  CreateCommentBodyType,
  'id' | 'content'
>;

export type VoteCommentBodyType = z.infer<typeof voteCommentSchema>;

export type CommentSearchType = z.infer<typeof commentSearchSchema> &
  BaseSearchType;

type CommentState = {
  comment: CommentResType | null;
};

type CommentActions = {
  setComment: (comment: CommentResType | null) => void;
};

export type CommentStoreType = CommentState & CommentActions;
