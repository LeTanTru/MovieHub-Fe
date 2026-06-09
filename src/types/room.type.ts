import { MovieItemResType } from '@/types/movie-item.type';
import { roomSchema, roomSearchSchema } from '@/schemaValidations';
import z from 'zod';

export type HostType = {
  avatarPath: string;
  email: string;
  fullName: string;
  gender: number;
  id: number;
  isVip: boolean;
  kind: number;
  username: string;
};

export type RoomResType = {
  code: string;
  createdDate: string;
  endTime: string;
  host: HostType;
  id: string;
  kind: number;
  modifiedDate: string;
  movieItem: MovieItemResType;
  name: string;
  participantCount: number;
  startTime: string;
  state: number;
  status: number;
};

export type RoomSearchType = z.infer<typeof roomSearchSchema>;

export type RoomBodyType = z.infer<typeof roomSchema>;
