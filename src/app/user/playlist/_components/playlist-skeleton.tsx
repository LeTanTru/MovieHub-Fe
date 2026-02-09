import { MAX_PLAYLIST_COUNT } from '@/constants';
import PlaylistCardSkeleton from './playlist-card-skeleton';

export default function PlaylistSkeleton() {
  return Array.from({ length: MAX_PLAYLIST_COUNT }).map((_, i) => (
    <PlaylistCardSkeleton key={i} />
  ));
}
