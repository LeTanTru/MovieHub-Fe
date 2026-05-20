import { ImageResponse } from 'next/og';
import envConfig from '@/config';

export const runtime = 'edge';

export const size = {
  width: 1200,
  height: 630
};

export const contentType = 'image/png';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');
  const description = searchParams.get('description');

  const displayTitle = title || 'MovieHub';
  const displayDescription = description || 'Xem phim trực tuyến miễn phí';

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f0f0f',
        backgroundImage:
          'radial-gradient(circle at 25% 25%, #1a1a2e 0%, #0f0f0f 50%, #16213e 100%)'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          padding: '48px'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <div
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              background:
                'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)',
              color: 'transparent',
              WebkitBackgroundClip: 'text'
            }}
          >
            MovieHub
          </div>
        </div>
        <div
          style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            maxWidth: '900px',
            lineHeight: '1.3'
          }}
        >
          {displayTitle}
        </div>
        <div
          style={{
            fontSize: '28px',
            color: '#9ca3af',
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: '1.4'
          }}
        >
          {displayDescription}
        </div>
        <div
          style={{
            marginTop: '24px',
            fontSize: '24px',
            color: '#f59e0b',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {envConfig.NEXT_PUBLIC_URL}
        </div>
      </div>
    </div>,
    {
      ...size
    }
  );
}
