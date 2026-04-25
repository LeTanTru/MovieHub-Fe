import envConfig from '@/config';
import { apiConfig, storageKeys } from '@/constants';
import { logger } from '@/logger';
import { LoginBodyType, LoginResType } from '@/types';
import { http, isAxiosError, setCookieData } from '@/utils';
import { HttpStatusCode } from 'axios';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { NextRequest, NextResponse } from 'next/server';

const maxAgeAccessToken = 24 * 60 * 60; // 1 day
const maxAgeRefreshToken = 60 * 60 * 24 * 7; // 7 days

export async function POST(request: NextRequest) {
  try {
    const body: LoginBodyType = await request.json();

    if (!body) {
      return NextResponse.json(
        { result: false, message: 'Body is required' },
        { status: HttpStatusCode.BadRequest }
      );
    }

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { result: false, message: 'All fields are required' },
        { status: HttpStatusCode.BadRequest }
      );
    }

    const res = await http.post<LoginResType>(apiConfig.user.login, {
      body: body
    });

    const accessToken = res.access_token;
    const refreshToken = res.refresh_token;

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

    return NextResponse.json({
      result: true,
      data: res
    });
  } catch (error) {
    if (isAxiosError(error)) {
      const response = error.response?.data;

      logger.error('[LOGIN_ERROR]', response);

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
        { result: false, message: 'Login failed' },
        { status: error.response?.status }
      );
    }

    logger.error('[LOGIN_ERROR]', error);

    return NextResponse.json(
      { result: false, message: 'Login failed' },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}
