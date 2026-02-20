import {
  commentSchema,
  commentSearchSchema,
  voteCommentSchema
} from '@/schemaValidations';
import { MovieItemResType } from '@/types/movie-item.type';
import { BaseSearchType } from '@/types/search.type';
import z from 'zod';

export type AuthorInfoType = {
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
  parent: {
    id: string;
    authorInfo: string;
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
