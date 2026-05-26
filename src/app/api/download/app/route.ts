import { envConfig } from '@/config';
import { apiConfig } from '@/constants';
import { ApiResponse, AppVersionLatestResType } from '@/types';
import { renderFileUrl, http } from '@/utils';
import { NextResponse } from 'next/server';

const sanitizeFileName = (name: string) =>
  name
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '') || 'latest';

export async function GET() {
  try {
    const payload = await http.get<ApiResponse<AppVersionLatestResType>>(
      apiConfig.appVersion.getLatest
    );
    const appVersion = payload.data;
    const filePath = appVersion?.filePath;

    if (!filePath || !appVersion?.name) {
      throw new Error('Latest app version is missing download metadata');
    }

    const upstreamUrl = renderFileUrl(filePath);
    const upstreamResponse = await fetch(upstreamUrl, {
      cache: 'no-store',
      redirect: 'follow'
    });

    if (!upstreamResponse.ok || !upstreamResponse.body) {
      throw new Error(`Failed to fetch APK: ${upstreamResponse.status}`);
    }

    const fileName = `moviehub_${sanitizeFileName(appVersion.name)}.apk`;
    const headers = new Headers();
    headers.set(
      'Content-Type',
      upstreamResponse.headers.get('Content-Type') ||
        'application/vnd.android.package-archive'
    );
    headers.set('Content-Disposition', `attachment; filename="${fileName}"`);

    const contentLength = upstreamResponse.headers.get('Content-Length');
    if (contentLength) {
      headers.set('Content-Length', contentLength);
    }

    const cacheControl = upstreamResponse.headers.get('Cache-Control');
    if (cacheControl) {
      headers.set('Cache-Control', cacheControl);
    }

    return new Response(upstreamResponse.body, {
      status: 200,
      headers
    });
  } catch {
    return NextResponse.redirect(new URL('/', envConfig.NEXT_PUBLIC_URL));
  }
}
