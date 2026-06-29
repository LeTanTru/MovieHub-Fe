import { roomSchema, roomSearchSchema } from '@/schemaValidations';
import { BaseSearchType } from '@/types/search.type';
import z from 'zod';

type Host = {
  id: string;
  email: string;
  fullName: string;
  avatarPath: string;
  kind: number;
  gender: number;
  username: string;
};

type Movie = {
  id: string;
  title: string;
  originalTitle: string;
  slug: string;
  thumbnailUrl: string;
  posterUrl: string;
  type: number;
};

type Season = {
  id: string;
  kind: number;
  label: string;
  totalEpisode: number;
};

type MovieItem = {
  id: string;
  title: string;
  kind: number;
  label: string;
  movie: Movie;
  season: Season;
  thumbnailUrl: string;
};

export type RoomResType = {
  id: string;
  createdDate: string;
  name: string;
  code: string;
  kind: number;
  movieItem: MovieItem;
  host: Host;
  startTime: string;
  endTime: string;
  state: number;
  participantCount: number;
};

export type RoomSearchType = z.infer<typeof roomSearchSchema> & BaseSearchType;

export type RoomBodyType = z.infer<typeof roomSchema>;

export type RoomState = {
  room: RoomResType | null;
};

export type RoomActions = {
  setRoom: (room: RoomResType | null) => void;
};

export type RoomStoreType = RoomState & RoomActions;
