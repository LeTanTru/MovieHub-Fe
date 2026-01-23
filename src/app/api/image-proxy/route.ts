import { AppConstants } from '@/constants';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const imageUrl = req.nextUrl.searchParams.get('url');
  if (!imageUrl) {
    return new Response('Missing URL', { status: 400 });
  }

  const res = await fetch(
    `${imageUrl.includes('lh3.googleusercontent.com') ? imageUrl : `${AppConstants.contentRootUrl}${imageUrl}`}`,
    {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    }
  );

  const buffer = await res.arrayBuffer();
  return new Response(buffer, {
    headers: {
      'Content-Type': res.headers.get('Content-Type') || 'image/jpeg',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
