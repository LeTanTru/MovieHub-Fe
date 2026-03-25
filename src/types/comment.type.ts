import {
  commentSchema,
  commentSearchSchema,
  voteCommentSchema
} from '@/schemaValidations';
import { ProfileResType } from '@/types/account.type';
import { MovieItemResType } from '@/types/movie-item.type';
import { BaseSearchType } from '@/types/search.type';
import z from 'zod';

export type CommentResType = {
  author: ProfileResType;
  content: string;
  createdDate: string;
  id: string;
  isPinned: boolean;
  modifiedDate: string;
  movieId: string;
  movieItem: MovieItemResType;
  replyTo: ProfileResType;
  status: number;
  totalChildren: number;
  totalDislike: number;
  totalLike: number;
  parent: {
    id: string;
    author: ProfileResType;
  };
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

type CommentStoreState = {
  replyingComment: CommentResType | null;
  editingComment: CommentResType | null;
  openParentIds: string[];
};

type CommentStoreAction = {
  openReply: (replyingComment: CommentResType | null) => void;
  closeReply: () => void;

  setEditingComment: (editingComment: CommentResType | null) => void;
  setOpenParentIds: (ids: string[] | ((prev: string[]) => string[])) => void;
};

export type CommentStoreType = CommentStoreState & CommentStoreAction;
