import { authApiRequest } from '@/api-requests';
import { storageKeys } from '@/constants';
import { logger } from '@/logger';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const req = await request.json();
  const cookieStore = await cookies();
  try {
    const response = await authApiRequest.loginFromNextServer(req);
    if (response.result !== false) {
      const accessToken = response.access_token!;
      const userKind = response.user_kind!;
      cookieStore.set(storageKeys.ACCESS_TOKEN, accessToken, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: true
      });

      cookieStore.set(storageKeys.USER_KIND, String(userKind), {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: true
      });
    }
    return Response.json(response, {
      status: 200
    });
  } catch (error) {
    logger.error('Error while login: ', error);
  }
  return NextResponse.json({ success: true, provider: 'google' });
}
