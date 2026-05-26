import { envConfig } from '@/config';
import { apiConfig } from '@/constants';
import { ApiResponse, AppVersionLatestResType } from '@/types';
import { renderFileUrl } from '@/utils';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(apiConfig.appVersion.getLatest.baseUrl, {
      headers: {
        ...apiConfig.appVersion.getLatest.headers,
        'x-client-type': envConfig.NEXT_PUBLIC_CLIENT_TYPE
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch app version: ${response.status}`);
    }

    const payload =
      (await response.json()) as ApiResponse<AppVersionLatestResType>;
    const filePath = payload.data?.filePath;

    if (!filePath) {
      throw new Error('Latest app version does not include a file path');
    }

    return NextResponse.redirect(renderFileUrl(filePath));
  } catch {
    return NextResponse.redirect(new URL('/', envConfig.NEXT_PUBLIC_URL));
  }
}
