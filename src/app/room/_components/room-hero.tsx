import Image from 'next/image';
import './room.css';
import { RoomActions } from './room-actions';

export function RoomHero() {
  return (
    <>
      <div className='background'>
        <div className='blur'></div>
        <Image fill src='/room-cover.webp' alt='room-cover' loading='eager' />
      </div>
      <RoomActions />
    </>
  );
}
