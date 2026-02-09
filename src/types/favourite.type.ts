import { favouriteSchema, favouriteSearchSchema } from '@/schemaValidations';
import { MovieResType } from '@/types/movie.type';
import { PersonResType } from '@/types/person.type';
import { BaseSearchType } from '@/types/search.type';
import z from 'zod';

type UserResType = {
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

export type FavouriteResType = {
  createdDate: string;
  id: string;
  modifiedDate: string;
  movie: MovieResType;
  person: PersonResType;
  status: number;
  type: number;
  user: UserResType;
};

export type FavouriteBodyType = z.infer<typeof favouriteSchema>;

export type FavouriteGetType = {
  targetId: string;
  type: number;
};

export type FavouriteSearchType = z.infer<typeof favouriteSearchSchema> &
  BaseSearchType;
