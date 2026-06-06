import { apiConfig } from '@/constants';
import type {
  ApiResponse,
  ApiResponseNoData,
  SurveyBodyType,
  SurveyResType
} from '@/types';
import { http } from '@/utils';

export const getSurveyList = (signal?: AbortSignal) =>
  http.get<ApiResponse<SurveyResType[]>>(apiConfig.survey.getSurveyList, {
    signal
  });

export const makeSurvey = (body: SurveyBodyType) =>
  http.post<ApiResponseNoData>(apiConfig.survey.makeSurvey, {
    body
  });
