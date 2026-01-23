import { authApiRequest } from '@/api-requests';
import { storageKeys } from '@/constants';
import { logger } from '@/logger';
import { HttpStatusCode } from 'axios';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const req = await request.json();
  const cookieStore = await cookies();
  const code = req.code;
  try {
    const res = await authApiRequest.loginGoogleCallback(code);
    if (res.access_token) {
      const accessToken = res.access_token;
      const userKind = res.user_kind;
      cookieStore.set(storageKeys.ACCESS_TOKEN, accessToken, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        maxAge: 60 * 60 * 24 * 7
      });

      cookieStore.set(storageKeys.USER_KIND, String(userKind), {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        maxAge: 60 * 60 * 24 * 7
      });

      return Response.json(
        { ...res, result: true },
        {
          status: HttpStatusCode.Ok
        }
      );
    }
    return Response.json(
      { ...res },
      {
        status: HttpStatusCode.Ok
      }
    );
  } catch (error) {
    logger.error('Error while loggin google:', error);
    return Response.json(
      { result: false, error: 'Login failed' },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}
