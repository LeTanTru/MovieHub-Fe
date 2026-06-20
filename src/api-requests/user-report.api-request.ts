import { apiConfig } from '@/constants';
import type { ApiResponseNoData, UserReportBodyType } from '@/types';
import { http } from '@/utils';

export const create = (body: UserReportBodyType) =>
  http.post<ApiResponseNoData>(apiConfig.userReport.create, {
    body
  });
