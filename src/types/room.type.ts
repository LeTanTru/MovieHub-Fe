import {
  roomAddParticipantSchema,
  roomSchema,
  roomSearchSchema
} from '@/schemaValidations';
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

export type RoomPlayerStateType = {
  subCmd: string;
  isPlay: boolean;
  currentPositionMovie: number;
  playSpeed: number;
};

export type RoomEndReasonType = {
  roomId: string;
  reason: string;
};

export type RoomState = {
  room: RoomResType | null;
  isJoined: boolean;
  participantCount: number;
  playerState: RoomPlayerStateType;
  endReason: string;
  getPlayerCurrentTime: () => number;
};

export type RoomActions = {
  setRoom: (room: RoomResType | null) => void;
  setIsJoined: (isJoined: boolean) => void;
  setParticipantCount: (count: number) => void;
  setPlayerState: (playerState: RoomPlayerStateType) => void;
  setEndReason: (endReason: string) => void;
  setGetPlayerCurrentTime: (fn: () => number) => void;
};

export type RoomStoreType = RoomState & RoomActions;

export type RoomEndType = {
  reason: string;
  roomId: string;
};

export type RoomUpdateParticipantCountType = {
  currentViewers: number;
  roomId: string;
};

export type RoomParticipantJoinType = {
  id: string;
};

export type RoomSyncType = {
  id: string;
};

export type RoomAddParticipantBodyType = z.infer<
  typeof roomAddParticipantSchema
>;
