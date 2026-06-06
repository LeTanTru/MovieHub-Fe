import { surveyApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import { SurveyBodyType } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useSurveyListQuery = (enabled: boolean = false) => {
  return useQuery({
    queryKey: [queryKeys.MOVIE_SURVEY_LIST],
    queryFn: ({ signal }) => surveyApiRequest.getSurveyList(signal),
    enabled,
    select: (data) => data.data
  });
};

export const useMakeSurveyMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.MAKE_SURVEY],
    mutationFn: (body: SurveyBodyType) => surveyApiRequest.makeSurvey(body)
  });
};
