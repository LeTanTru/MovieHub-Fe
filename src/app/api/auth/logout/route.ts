import { apiConfig, storageKeys } from '@/constants';
import { logger } from '@/logger';
import { ApiResponse } from '@/types';
import { http, isAxiosError, removeCookie } from '@/utils';
import { HttpStatusCode } from 'axios';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const res = await http.post<ApiResponse<any>>(apiConfig.user.logout);

    // Always clear cookies locally, even if the backend returns false
    await Promise.all([
      removeCookie(storageKeys.ACCESS_TOKEN),
      removeCookie(storageKeys.REFRESH_TOKEN),
      removeCookie(storageKeys.CSRF_TOKEN)
    ]);

    if (res.result) {
      return NextResponse.json({ ...res }, { status: HttpStatusCode.Ok });
    }

    return NextResponse.json(
      { result: true, message: 'Logout partially succeeded' },
      { status: HttpStatusCode.Ok }
    );
  } catch (error) {
    if (isAxiosError(error)) {
      const response = error.response?.data;

      logger.error('[LOGOUT_ERROR]', response);

      // Clear cookies locally if logout fails due to network or authorization issues
      await Promise.all([
        removeCookie(storageKeys.ACCESS_TOKEN),
        removeCookie(storageKeys.REFRESH_TOKEN),
        removeCookie(storageKeys.CSRF_TOKEN)
      ]);

      if (response) {
        return NextResponse.json(
          { result: false, ...response },
          { status: error.response?.status }
        );
      }

      return NextResponse.json(
        { result: false, message: 'Logout failed' },
        { status: error.response?.status }
      );
    }

    logger.error('[LOGOUT_ERROR]', error);

    // Clear cookies locally if an unexpected error occurs
    await Promise.all([
      removeCookie(storageKeys.ACCESS_TOKEN),
      removeCookie(storageKeys.REFRESH_TOKEN),
      removeCookie(storageKeys.CSRF_TOKEN)
    ]);

    return NextResponse.json(
      { result: false, message: 'Logout failed' },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}
