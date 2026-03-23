import { authApiRequest } from '@/api-requests';
import envConfig from '@/config';
import { logger } from '@/logger';
import {
  isAxiosError,
  setAccessTokenToCookie,
  setRefreshTokenToCookie
} from '@/utils';
import { HttpStatusCode } from 'axios';

const maxAge = 60 * 60 * 24 * 7;

export async function POST(request: Request) {
  const req = await request.json();
  const code: string = req.code;
  try {
    const res = await authApiRequest.loginGoogleCallback(code);
    if (res.access_token) {
      const accessToken = res.access_token;
      const refreshToken = res.refresh_token;

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
    if (isAxiosError(error)) {
      logger.error('Error while login', error?.response?.data);
      return Response.json(error?.response?.data, {
        status: HttpStatusCode.BadGateway
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
