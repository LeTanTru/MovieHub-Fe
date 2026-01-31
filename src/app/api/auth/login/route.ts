import { authApiRequest } from '@/api-requests';
import envConfig from '@/config';
import { storageKeys } from '@/constants';
import { logger } from '@/logger';
import { LoginBodyType } from '@/types';
import {
  isAxiosError,
  setAccessTokenToCookie,
  setCookieData,
  setRefreshTokenToCookie
} from '@/utils';
import { HttpStatusCode } from 'axios';

const maxAge = 60 * 60 * 24 * 7;

export async function POST(request: Request) {
  const req: LoginBodyType = await request.json();
  try {
    const res = await authApiRequest.loginFromNextServer({ body: req });

    if (res.access_token) {
      const accessToken = res.access_token;
      const refreshToken = res.refresh_token;
      const userKind = res.user_kind;

      setAccessTokenToCookie(accessToken, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: envConfig.NEXT_PUBLIC_NODE_ENV === 'production',
        maxAge
      });

      setRefreshTokenToCookie(refreshToken, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: envConfig.NEXT_PUBLIC_NODE_ENV === 'production',
        maxAge
      });

      setCookieData(storageKeys.USER_KIND, String(userKind), {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: envConfig.NEXT_PUBLIC_NODE_ENV === 'production',
        maxAge
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
        status: HttpStatusCode.BadRequest
      }
    );
  } catch (error) {
    if (isAxiosError(error)) {
      logger.error('Error while login', error?.response?.data);
      return Response.json(error?.response?.data, {
        status: error?.response?.status || HttpStatusCode.BadGateway
      });
    }
    return Response.json(
      { result: false, message: 'Invalid email or password' },
      {
        status: HttpStatusCode.BadGateway
      }
    );
  }
}
