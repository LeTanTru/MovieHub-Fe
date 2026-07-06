import { apiConfig } from '@/constants';
import {
  ApiResponse,
  ApiResponseList,
  ApiResponseNoData,
  ParticipantBodyType,
  ParticipantResType,
  ParticipantSearchType
} from '@/types';
import { http } from '@/utils';

export const create = (body: ParticipantBodyType) =>
  http.post<ApiResponseNoData>(apiConfig.participant.create, {
    body
  });

export const getById = (id: string) =>
  http.get<ApiResponse<ParticipantResType>>(apiConfig.participant.getById, {
    pathParams: { id }
  });

export const getList = (params?: ParticipantSearchType, signal?: AbortSignal) =>
  http.get<ApiResponseList<ParticipantResType>>(apiConfig.participant.getList, {
    params,
    signal
  });
