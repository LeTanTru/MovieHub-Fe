import {
  participantSchema,
  participantSearchSchema
} from '@/schemaValidations/participant.schema';
import { BaseSearchType } from '@/types/search.type';
import z from 'zod';

export type ParticipantResType = {
  id: string;
  user: {
    id: string;
    username: string;
    email: string;
    fullName: string;
    avatarPath: string;
    kind: number;
    gender: number;
  };
  role: number;
  state: number;
};

export type ParticipantBodyType = z.infer<typeof participantSchema>;

export type ParticipantSearchType = z.infer<typeof participantSearchSchema> &
  BaseSearchType;
