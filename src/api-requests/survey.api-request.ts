import { apiConfig } from '@/constants';
import { ApiResponse, SurveyBodyType, SurveyResType } from '@/types';
import { http } from '@/utils';

export const getSurveyList = () =>
  http.get<ApiResponse<SurveyResType[]>>(apiConfig.survey.getSurveyList);

export const makeSurvey = (body: SurveyBodyType) =>
  http.post<ApiResponse<any>>(apiConfig.survey.makeSurvey, {
    body
  });
