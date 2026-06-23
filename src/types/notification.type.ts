import {
  notificationSearchSchema,
  updateReadNotificationSchema
} from '@/schemaValidations';
import { ToxicSpan } from '@/types/comment.type';
import { BaseSearchType } from '@/types/search.type';
import z from 'zod';

export type UnreadCountNotificationResType = {
  totalUnread: number;
};

export type NotificationResType = {
  body: string;
  cmd: string;
  createdDate: string;
  id: string;
  isRead: boolean;
  modifiedDate: string;
  status: number;
  title: string;
  type: number;
};

export type UpdateReadNotificationBodyType = z.infer<
  typeof updateReadNotificationSchema
>;

export type NotificationSearchType = z.infer<typeof notificationSearchSchema> &
  BaseSearchType;

export type ConvertVideoNotificationType = {
  id: string;
  name: string;
  duration: number;
  state: number;
  thumbnailUrl: string;
};

export type MovieNotificationType = {
  id: string;
  title: string;
  originalTitle: string;
  slug: string;
  thumbnailUrl: string;
  posterUrl: string;
  releaseDate: string;
};

export type MovieItemNotificationType = {
  id: string;
  title: string;
  kind: number;
  label: string;
  movie: {
    id: string;
    title: string;
    originalTitle: string;
    slug: string;
    thumbnailUrl: string;
    posterUrl: string;
    releaseDate: string;
  };
  releaseDate: string;
  thumbnailUrl: string;
};

export type ReplyCommentNotificationType = {
  id: string;
  movieId: string;
  movieTitle: string;
  movieThumbnail: string;
  content: string;
  parentId?: string;
  author: {
    id: string;
    username: string;
    email: string;
    fullName: string;
    avatarPath: string;
  };
};

export type VoteCommentNotificationType = {
  id: string;
  parentId?: string;
  movieId: string;
  movieTitle: string;
  movieThumbnail: string;
  content: string;
  reactionType: number;
  author: {
    id: string;
    username: string;
    email: string;
    fullName: string;
    avatarPath: string;
  };
};

export type VoteReviewNotificationType = {
  id: string;
  movieId: string;
  movieTitle: string;
  movieThumbnail: string;
  rate: number;
  content: string;
  reactionType: number;
  author: {
    id: string;
    username: string;
    email: string;
    fullName: string;
    avatarPath: string;
  };
};

export type ToxicCommentLockedNotificationType = {
  id: string;
  parentId?: string;
  movieId: string;
  movieTitle: string;
  movieThumbnail: string;
  content: string;
  author: {
    id: string;
    username: string;
    email: string;
    fullName: string;
    avatarPath: string;
  };
  toxicSpans: ToxicSpan[];
};

export type ToxicReviewLockedNotificationType = {
  id: string;
  movieId: string;
  movieTitle: string;
  movieThumbnail: string;
  content: string;
  author: {
    id: string;
    username: string;
    email: string;
    fullName: string;
    avatarPath: string;
  };
  toxicSpans: ToxicSpan[];
};

export type CommentUnlockedNotificationType =
  ToxicCommentLockedNotificationType;
export type ReviewUnlockedNotificationType = ToxicReviewLockedNotificationType;
