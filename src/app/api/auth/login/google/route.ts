import envConfig from '@/config';
import { authApiRequest } from '@/api-requests';
import { storageKeys } from '@/constants';
import { logger } from '@/logger';
import { isAxiosError, setCookie } from '@/utils';
import { HttpStatusCode } from 'axios';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { NextRequest, NextResponse } from 'next/server';

const maxAgeAccessToken = 24 * 60 * 60; // 1 day
const maxAgeRefreshToken = 60 * 60 * 24 * 7; // 7 days

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const code: string = req.code;

    const res = await authApiRequest.loginGoogleCallback(code);
    if (res.access_token) {
      const accessToken = res.access_token;
      const refreshToken = res.refresh_token;

      const makeCookieOption = (maxAge: number): Partial<ResponseCookie> => ({
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: envConfig.NEXT_PUBLIC_NODE_ENV === 'production',
        maxAge: maxAge
      });

      await setCookie(
        storageKeys.ACCESS_TOKEN,
        accessToken,
        makeCookieOption(maxAgeAccessToken)
      );

      await setCookie(
        storageKeys.REFRESH_TOKEN,
        refreshToken,
        makeCookieOption(maxAgeRefreshToken)
      );

      return NextResponse.json(
        { result: true, data: res },
        {
          status: HttpStatusCode.Ok
        }
      );
    }
    return NextResponse.json(
      { result: false, data: res },
      {
        status: HttpStatusCode.Ok
      }
    );
  } catch (error) {
    if (isAxiosError(error)) {
      const response = error.response?.data;

      logger.error('[LOGIN_GOOGLE_ERROR]', response);

      if (response) {
        return NextResponse.json(
          {
            result: false,
            ...response
          },
          { status: error.response?.status }
        );
      }

      return NextResponse.json(
        { result: false, message: 'Login google failed' },
        { status: error.response?.status }
      );
    }

    logger.error('[LOGIN_GOOGLE_ERROR]', error);

    return NextResponse.json(
      { result: false, message: 'Login google failed' },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}
