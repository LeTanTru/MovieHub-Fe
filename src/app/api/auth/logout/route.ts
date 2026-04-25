import { apiConfig, storageKeys } from '@/constants';
import { logger } from '@/logger';
import { ApiResponse } from '@/types';
import { http, isAxiosError, removeCookieData } from '@/utils';
import { HttpStatusCode } from 'axios';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const res = await http.post<ApiResponse<any>>(apiConfig.user.logout);

    if (res.result) {
      await removeCookieData(storageKeys.ACCESS_TOKEN);
      await removeCookieData(storageKeys.REFRESH_TOKEN);

      return NextResponse.json({ ...res }, { status: HttpStatusCode.Ok });
    }
  } catch (error) {
    if (isAxiosError(error)) {
      const response = error.response?.data;

      logger.error('[LOGOUT_ERROR]', response);

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
        { result: false, message: 'Logout failed' },
        { status: error.response?.status }
      );
    }

    logger.error('[LOGOUT_ERROR]', error);
  }
}
