import envConfig from '@/config';
import { apiConfig, storageKeys } from '@/constants';
import { logger } from '@/logger';
import { RefreshTokenResType } from '@/types';
import { getCookie, http, isAxiosError, setCookie } from '@/utils';
import { HttpStatusCode } from 'axios';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { NextResponse } from 'next/server';

const maxAgeAccessToken = 24 * 60 * 60; // 1 day
const maxAgeRefreshToken = 60 * 60 * 24 * 7; // 7 days

export async function POST() {
  try {
    const refresh_token = await getCookie(storageKeys.REFRESH_TOKEN);

    if (!refresh_token) {
      return NextResponse.json(
        { result: false, message: 'Refresh token is required' },
        { status: HttpStatusCode.BadRequest }
      );
    }

    const res = await http.post<RefreshTokenResType>(
      apiConfig.user.refreshToken,
      {
        body: {
          refresh_token,
          grant_type: process.env.GRANT_TYPE_REFRESH_TOKEN
        },
        options: {
          headers: {
            Authorization: `Basic ${btoa(`${process.env.APP_USERNAME}:${process.env.APP_PASSWORD}`)}`
          }
        }
      }
    );

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

    return Response.json(
      {
        result: true,
        data: res
      },
      {
        status: HttpStatusCode.Ok
      }
    );
  } catch (error) {
    if (isAxiosError(error)) {
      const response = error.response?.data;

      logger.error('[REFRESH_TOKEN_ERROR]', response);

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
        { result: false, message: 'Refresh token failed' },
        { status: error.response?.status }
      );
    }

    logger.error('[REFRESH_TOKEN_ERROR]', error);
  }
}
