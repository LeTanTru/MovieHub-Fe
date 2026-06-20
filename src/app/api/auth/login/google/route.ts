import { authApiRequest } from '@/api-requests';
import {
  ACCESS_TOKEN_MAX_AGE,
  CSRF_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
  storageKeys,
  USER_KIND_MAX_AGE
} from '@/constants';
import { logger } from '@/logger';
import { isAxiosError, setCookie } from '@/utils';
import { HttpStatusCode } from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { makeCookieOption } from '@/app/api/auth/_lib/make-cookie-option';
import { generateCsrfToken } from '@/app/api/auth/_lib/generate-csrf-token';

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const code: string = req.code;

    const res = await authApiRequest.loginGoogleCallback(code);

    const accessToken = res.access_token;
    const refreshToken = res.refresh_token;
    const userKind = res.user_kind;
    const csrfToken = generateCsrfToken();

    await Promise.all([
      setCookie(
        storageKeys.ACCESS_TOKEN,
        accessToken,
        makeCookieOption(res.expires_in || ACCESS_TOKEN_MAX_AGE)
      ),
      setCookie(
        storageKeys.REFRESH_TOKEN,
        refreshToken,
        makeCookieOption(REFRESH_TOKEN_MAX_AGE)
      ),
      setCookie(
        storageKeys.USER_KIND,
        String(userKind),
        makeCookieOption(USER_KIND_MAX_AGE)
      ),
      setCookie(
        storageKeys.CSRF_TOKEN,
        csrfToken,
        makeCookieOption(CSRF_TOKEN_MAX_AGE)
      )
    ]);

    return NextResponse.json(
      { result: true, data: res },
      { status: HttpStatusCode.Ok }
    );
  } catch (error) {
    if (isAxiosError(error)) {
      const response = error.response?.data;

      logger.error('[LOGIN_GOOGLE_ERROR]', response);

      if (response) {
        return NextResponse.json(
          { result: false, ...response },
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
