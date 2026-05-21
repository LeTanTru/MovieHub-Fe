import { generateCsrfToken } from '../_lib/generate-csrf-token';
import { makeCookieOption } from '../_lib/make-cookie-option';
import { CSRF_TOKEN_MAX_AGE, storageKeys } from '@/constants';
import { logger } from '@/logger';
import { getCookie, setCookie } from '@/utils';
import { HttpStatusCode } from 'axios';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const accessToken = await getCookie(storageKeys.ACCESS_TOKEN);

    let csrfToken = await getCookie(storageKeys.CSRF_TOKEN);
    if (!csrfToken) {
      csrfToken = generateCsrfToken();
      await setCookie(
        storageKeys.CSRF_TOKEN,
        csrfToken,
        makeCookieOption(CSRF_TOKEN_MAX_AGE)
      );
    }

    return NextResponse.json(
      {
        result: true,
        data: {
          accessToken,
          csrfToken
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
