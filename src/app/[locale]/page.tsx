import VideoPlayer from '@/components/form/video-player';
import { setRequestLocale } from 'next-intl/server';

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div>
      <div className='mx-auto max-w-3xl'>
        <VideoPlayer />
      </div>
    </div>
  );
}
