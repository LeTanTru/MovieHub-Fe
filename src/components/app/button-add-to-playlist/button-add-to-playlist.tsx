'use client';

import { Button } from '@/components/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useClickOutside, useDisclosure } from '@/hooks';
import {
  usePlaylistByMovieQuery,
  usePlaylistListQuery,
  useUpdatePlaylistItemMutation
} from '@/queries';
import { FaPlus } from 'react-icons/fa6';
import { AnimatePresence, motion } from 'framer-motion';
import { ButtonAddPlayList } from '@/components/app/button-action-playlist';
import {
  ACTION_ADD_TO_PLAYLIST,
  ACTION_DELETE_FROM_PLAYLIST,
  MAX_PLAYLIST_COUNT
} from '@/constants';
import { PlaylistItemBodyType, PlaylistResType } from '@/types';
import { notify } from '@/utils';
import { logger } from '@/logger';

type PlaylistItemProps = {
  playlist: PlaylistResType;
  checked: boolean;
  onToggle: (playlistId: string) => void;
};

function PlaylistItem({ playlist, checked, onToggle }: PlaylistItemProps) {
  return (
    <div
      className='flex items-center gap-2 text-black'
      onClick={() => onToggle(playlist.id)}
    >
      <Checkbox
        id={playlist.id}
        className='mb-0! cursor-pointer border-black transition-all transition-colors duration-50 ease-linear focus-visible:ring-0 data-[state=checked]:border-transparent data-[state=checked]:bg-blue-700! data-[state=checked]:text-white data-[state=indeterminate]:bg-transparent [&>span[data-state=indeterminate]]:m-auto [&>span[data-state=indeterminate]]:h-1/2 [&>span[data-state=indeterminate]]:w-1/2 [&>span[data-state=indeterminate]]:bg-blue-700! [&>span[data-state=indeterminate]>svg]:hidden'
        checked={checked}
      />
      <span className='w-full grow cursor-pointer select-none'>
        {playlist.name}
      </span>
    </div>
  );
}

function PlaylistItemSkeleton() {
  return (
    <div className='flex items-center gap-2'>
      <div className='skeleton h-4 w-4 rounded-sm!' />
      <div className='skeleton h-4 w-32 grow rounded' />
    </div>
  );
}

function PlaylistItemListSkeleton() {
  return (
    <div className='flex flex-col gap-4'>
      {Array.from({ length: MAX_PLAYLIST_COUNT }).map((_, index) => (
        <PlaylistItemSkeleton key={index} />
      ))}
    </div>
  );
}

export default function ButtonAddToPlaylist({ movieId }: { movieId: string }) {
  const { opened, toggle, close } = useDisclosure();
  const containerRef = useClickOutside<HTMLDivElement>(close);

  const { mutateAsync: updatePlaylistItemMutate } =
    useUpdatePlaylistItemMutation();

  const { data: playlistListData, isLoading: playlistListLoading } =
    usePlaylistListQuery({
      enabled: opened
    });

  const { data: playlistByMovieData, refetch: getPlaylistByMovie } =
    usePlaylistByMovieQuery({ movieId, enabled: opened });

  const playlistList = playlistListData?.data || [];
  const playlistByMovie = playlistByMovieData?.data || [];

  const handleOpen = () => {
    toggle();
  };

  const handleAddToPlaylist = async (playlistId: string) => {
    const isInPlaylist = playlistByMovie.includes(playlistId);
    const action = isInPlaylist
      ? ACTION_DELETE_FROM_PLAYLIST
      : ACTION_ADD_TO_PLAYLIST;

    const payload: PlaylistItemBodyType = {
      actions: [
        {
          action: action,
          playlistId
        }
      ],
      movieId: movieId
    };

    await updatePlaylistItemMutate(payload, {
      onSuccess: (res) => {
        if (res.result) {
          notify.success(
            `${isInPlaylist ? 'Xóa khỏi' : 'Thêm vào'} danh sách phát thành công`
          );
          getPlaylistByMovie();
        } else {
          notify.error(
            `${isInPlaylist ? 'Xóa khỏi' : 'Thêm vào'} danh sách phát thất bại`
          );
        }
      },
      onError: (error) => {
        logger.error(
          `Error ${isInPlaylist ? 'removing from' : 'adding to'} playlist`,
          error
        );
        notify.error(
          `Đã xảy ra lỗi khi ${isInPlaylist ? 'xóa khỏi' : 'thêm vào'} danh sách phát`
        );
      }
    });
  };

  return (
    <div className='relative' ref={containerRef}>
      <Button
        className='group h-fit min-w-20! flex-col px-2! text-xs hover:bg-white/10'
        variant='ghost'
        onClick={handleOpen}
      >
        <FaPlus className='group-hover:text-light-golden-yellow transition-all duration-200 ease-linear' />
        Thêm vào
      </Button>
      <AnimatePresence mode='wait'>
        {opened && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.05, ease: 'linear' }}
            style={{ transformOrigin: '50% 0%' }}
            className='absolute top-full left-1/2 z-10 flex w-50 -translate-x-1/2 flex-col gap-4 rounded bg-white p-4 shadow-lg shadow-black/50'
          >
            <div className='flex justify-between text-black'>
              <span>Danh sách phát</span>
              <span>
                {playlistList.length}/{MAX_PLAYLIST_COUNT}
              </span>
            </div>
            {playlistListLoading ? (
              <PlaylistItemListSkeleton />
            ) : (
              playlistList.map((playlist) => (
                <PlaylistItem
                  key={playlist.id}
                  playlist={playlist}
                  checked={playlistByMovie.includes(playlist.id)}
                  onToggle={handleAddToPlaylist}
                />
              ))
            )}
            {playlistList.length < MAX_PLAYLIST_COUNT && (
              <ButtonAddPlayList
                className='bg-light-golden-yellow! border-light-golden-yellow hover:bg-light-golden-yellow/80! rounded text-black hover:text-black/80!'
                text='Thêm mới'
                showText
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
