import { personApiRequest } from '@/api-requests';
import { ApiResponse, PersonResType } from '@/types';
import { cache } from 'react';

export const getPersonDetail = cache(
  async (id: number): Promise<ApiResponse<PersonResType>> => {
    return await personApiRequest.getById({ id });
  }
);
