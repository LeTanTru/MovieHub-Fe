import { updateProfileSchema, userSearchSchema } from '@/schemaValidations';
import { BaseSearchType } from '@/types/search.type';
import { z } from 'zod';

export type UpdateProfileBodyType = z.infer<typeof updateProfileSchema>;

export type ProfileResType = {
  id: string;
  kind: number;
  username: string;
  phone: string;
  email: string;
  fullName: string;
  avatarPath: string;
  group: {
    id: string;
    name: string;
    kind: number;
    color: string;
  };
  gender: number;
  settings: string;
  isMakeSurvey: boolean;
};

export type UserAutoCompleteResType = {
  id: string;
  kind: number;
  email: string;
  fullName: string;
};

export type UserSearchType = z.infer<typeof userSearchSchema> & BaseSearchType;
