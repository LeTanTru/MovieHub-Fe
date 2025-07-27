import VideoPlayer from '@/components/form/video-player';

export default async function HomePage() {
  return (
    <div>
      <div className='mx-auto max-w-3xl'>
        <VideoPlayer />
      </div>
    </div>
  );
}
