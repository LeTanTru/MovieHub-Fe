import { generateCsrfToken } from '../_lib/generate-csrf-token';
import { makeCookieOption } from '../_lib/make-cookie-option';
import { apiConfig, CSRF_TOKEN_MAX_AGE, storageKeys } from '@/constants';
import { logger } from '@/logger';
import { ApiResponse, ProfileResType } from '@/types';
import {
  getCookie,
  http,
  isAxiosError,
  removeCookie,
  setCookie
} from '@/utils';
import { HttpStatusCode } from 'axios';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const accessToken = await getCookie(storageKeys.ACCESS_TOKEN);
    let authenticated = false;
    let profile: ProfileResType | null = null;

    let csrfToken = await getCookie(storageKeys.CSRF_TOKEN);
    if (!csrfToken) {
      csrfToken = generateCsrfToken();
      await setCookie(
        storageKeys.CSRF_TOKEN,
        csrfToken,
        makeCookieOption(CSRF_TOKEN_MAX_AGE)
      );
    }

    if (accessToken) {
      try {
        const profileRes = await http.get<ApiResponse<ProfileResType>>(
          apiConfig.user.getProfile,
          {
            authorization: `Bearer ${accessToken}`
          }
        );

        profile = profileRes.data ?? null;
        authenticated = !!profile;
      } catch (error) {
        if (
          isAxiosError(error) &&
          error.response?.status === HttpStatusCode.Unauthorized
        ) {
          await Promise.all([
            removeCookie(storageKeys.ACCESS_TOKEN),
            removeCookie(storageKeys.REFRESH_TOKEN)
          ]);
        } else {
          throw error;
        }
      }
    }

    return NextResponse.json(
      {
        result: true,
        data: {
          authenticated,
          csrfToken,
          profile
        }
      },
      {
        status: HttpStatusCode.Ok,
        headers: {
          'Cache-Control': 'no-store'
        }
      }
    );
  } catch (error) {
    logger.error('[SESSION_ERROR]', error);

    return NextResponse.json(
      { result: false, message: 'Failed to retrieve session' },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}
