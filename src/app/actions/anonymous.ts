'use server';

import { apiConfig } from '@/constants';
import type { AnonymousResType } from '@/types';
import { http } from '@/utils';

export async function getAnonymousToken() {
  const token = await http.post<AnonymousResType>(
    apiConfig.user.getAnonymousToken
  );
  return token;
}
