import {
  reviewSchema,
  reviewSearchSchema,
  reviewVoteSchema
} from '@/schemaValidations';
import { BaseSearchType } from '@/types/search.type';
import z from 'zod';

export type ReviewResType = {
  author: {
    avatarPath: string;
    createdDate: string;
    email: string;
    fullName: string;
    gender: number;
    group: {
      createdDate: string;
      description: string;
      id: string;
      isSystemRole: boolean;
      kind: number;
      modifiedDate: string;
      name: string;
      permissions: {
        createdDate: string;
        id: string;
        modifiedDate: string;
        permissionCode: string;
        status: number;
      }[];
      status: number;
    };
    id: string;
    kind: number;
    modifiedDate: string;
    phone: string;
    status: number;
    username: string;
  };
  content: string;
  createdDate: string;
  id: string;
  modifiedDate: string;
  movieId: string;
  rate: number;
  statistics: {
    averageRating: number;
    reviewCount: number;
  };
  status: number;
  totalDislike: number;
  totalLike: number;
};

export type ReviewVoteResType = {
  id: string;
  type: number;
};

export type ReviewBodyType = z.infer<typeof reviewSchema>;
export type ReviewVoteBodyType = z.infer<typeof reviewVoteSchema>;

export type ReviewSearchType = z.infer<typeof reviewSearchSchema> &
  BaseSearchType;
