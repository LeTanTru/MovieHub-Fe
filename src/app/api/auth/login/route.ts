import { generateCsrfToken } from '@/app/api/auth/_lib/generate-csrf-token';
import { makeCookieOption } from '@/app/api/auth/_lib/make-cookie-option';
import {
  ACCESS_TOKEN_MAX_AGE,
  apiConfig,
  CSRF_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
  storageKeys
} from '@/constants';
import { logger } from '@/logger';
import {
  ApiResponse,
  LoginBodyType,
  LoginResType,
  ProfileResType
} from '@/types';
import { http, isAxiosError, setCookie } from '@/utils';
import { HttpStatusCode } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

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
    const csrfToken = generateCsrfToken();

    let profile: ProfileResType | null = null;
    if (accessToken) {
      const profileRes = await http.get<ApiResponse<ProfileResType>>(
        apiConfig.user.getProfile,
        {
          options: {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        }
      );
      if (profileRes.result && profileRes.data) {
        profile = profileRes.data;
      }
    }

    await Promise.all([
      setCookie(
        storageKeys.ACCESS_TOKEN,
        accessToken,
        makeCookieOption(ACCESS_TOKEN_MAX_AGE)
      ),
      setCookie(
        storageKeys.REFRESH_TOKEN,
        refreshToken,
        makeCookieOption(REFRESH_TOKEN_MAX_AGE)
      ),
      setCookie(
        storageKeys.CSRF_TOKEN,
        csrfToken,
        makeCookieOption(CSRF_TOKEN_MAX_AGE)
      )
    ]);

    return NextResponse.json(
      { result: true, data: { ...res, profile } },
      { status: HttpStatusCode.Ok }
    );
  } catch (error) {
    if (isAxiosError(error)) {
      const response = error.response?.data;

      logger.error('[LOGIN_ERROR]', response);

      if (response) {
        return NextResponse.json(
          { result: false, ...response },
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
