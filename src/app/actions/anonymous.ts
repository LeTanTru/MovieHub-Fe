'use server';

import { authApiRequest } from '@/api-requests';

export async function getAnonymousToken() {
  const token = await authApiRequest.getAnonymousToken();
  return token;
}
