import { apiConfig } from '@/constants';
import {
  ApiResponse,
  ApiResponseList,
  ApiResponseNoData,
  RoomBodyType,
  RoomResType,
  RoomSearchType
} from '@/types';
import { http } from '@/utils';

export const check = (signal?: AbortSignal) =>
  http.get<ApiResponse<RoomResType>>(apiConfig.room.check, { signal });

export const create = (body: RoomBodyType) =>
  http.post<ApiResponse<RoomResType>>(apiConfig.room.create, { body });

export const deleteById = (id: string) =>
  http.delete<ApiResponseNoData>(apiConfig.room.delete, { pathParams: { id } });

export const end = (id: string) =>
  http.post<ApiResponseNoData>(apiConfig.room.end, { pathParams: { id } });

export const getByCode = (code: string, signal?: AbortSignal) =>
  http.get<ApiResponse<RoomResType>>(apiConfig.room.getByCode, {
    pathParams: { code },
    signal
  });

export const getById = (id: string, signal?: AbortSignal) =>
  http.get<ApiResponse<RoomResType>>(apiConfig.room.getById, {
    pathParams: { id },
    signal
  });

export const join = (id: string) =>
  http.post<ApiResponseNoData>(apiConfig.room.join, { pathParams: { id } });

export const getList = (params?: RoomSearchType, signal?: AbortSignal) =>
  http.get<ApiResponseList<RoomResType>>(apiConfig.room.getList, {
    params,
    signal
  });

export const getMyRooms = (params?: RoomSearchType, signal?: AbortSignal) =>
  http.get<ApiResponseList<RoomResType>>(apiConfig.room.myRooms, {
    params,
    signal
  });

export const start = (id: string) =>
  http.post<ApiResponseNoData>(apiConfig.room.start, { pathParams: { id } });
