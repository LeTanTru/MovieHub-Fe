import envConfig from '@/config';
import { storageKeys } from '@/constants';
import { logger } from '@/logger';
import { CookieServerBodyType } from '@/types';
import { setCookieData } from '@/utils';
import { HttpStatusCode } from 'axios';
import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

const maxAgeAccessToken = 24 * 60 * 60; // 1 day
const maxAgeRefreshToken = 60 * 60 * 24 * 7; // 7 days

export async function POST(request: Request) {
  const req: CookieServerBodyType = await request.json();

  try {
    const accessToken = req.access_token;
    const refreshToken = req.refresh_token;
    const userKind = req.user_kind;

    const makeCookieOption = (maxAge: number): Partial<ResponseCookie> => ({
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: envConfig.NEXT_PUBLIC_NODE_ENV === 'production',
      maxAge: maxAge
    });

    await setCookieData(
      storageKeys.ACCESS_TOKEN,
      accessToken,
      makeCookieOption(maxAgeAccessToken)
    );

    await setCookieData(
      storageKeys.REFRESH_TOKEN,
      refreshToken,
      makeCookieOption(maxAgeRefreshToken)
    );

    await setCookieData(
      storageKeys.USER_KIND,
      userKind,
      makeCookieOption(maxAgeRefreshToken)
    );

    return Response.json(
      {
        status: HttpStatusCode.Ok
      },
      {
        status: HttpStatusCode.Ok
      }
    );
  } catch (error) {
    logger.error('Error in setting auth cookies', error);
    return Response.json(
      {
        status: HttpStatusCode.BadRequest,
        message: 'Setting auth cookies failed'
      },
      { status: HttpStatusCode.BadRequest }
    );
  }
}
