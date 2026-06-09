import Image from 'next/image';
import './room.css';

export function Background() {
  return (
    <div className='background'>
      <div className='blur'></div>
      <Image fill src='/room-cover.webp' alt='room-cover' />
    </div>
  );
}
