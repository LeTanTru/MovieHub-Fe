'use client';

import { Button } from '@/components/form';
import { useAuth, useClickOutside, useDisclosure } from '@/hooks';
import {
  usePlaylistByMovieQuery,
  usePlaylistListQuery,
  useUpdatePlaylistItemMutation
} from '@/queries';
import { FaPlus } from 'react-icons/fa6';
import { AnimatePresence, motion } from 'framer-motion';
import { ButtonAddPlayList } from '@/components/app/button-playlist';
import {
  ACTION_ADD_TO_PLAYLIST,
  ACTION_DELETE_FROM_PLAYLIST,
  MAX_PLAYLIST_COUNT
} from '@/constants';
import { cn } from '@/lib';
import { debounce } from 'lodash';
import { logger } from '@/logger';
import { notify } from '@/utils';
import { PlaylistItemBodyType } from '@/types';
import { route } from '@/routes';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import PlaylistItem from './playlist-item';
import PlaylistItemListSkeleton from './playlist-item-list-skeleton';

export default function ButtonAddToPlaylist({
  movieId,
  className
}: {
  movieId: string;
  className?: string;
}) {
  const { opened, toggle, close } = useDisclosure();
  const containerRef = useClickOutside<HTMLDivElement>(close);
  const [checkedPlaylist, setCheckedPlaylist] = useState<string[]>([]);
  const [playlistId, setPlaylistId] = useState<string>('');
  const { isAuthenticated } = useAuth();

  const { data: playlistData, isLoading: playlistLoading } =
    usePlaylistListQuery({
      enabled: opened
    });

  const { data: playlistByMovieData } = usePlaylistByMovieQuery({
    movieId,
    enabled: opened && isAuthenticated
  });

  const {
    mutateAsync: updatePlaylistItemMutate,
    isPending: updatePlaylistItemLoading
  } = useUpdatePlaylistItemMutation();

  const playlist = playlistData?.data || [];

  const playlistByMovie = useMemo(
    () => playlistByMovieData?.data || [],
    [playlistByMovieData]
  );

  const handleOpen = () => {
    if (!isAuthenticated) {
      notify.error(
        <span>
          Vui lòng&nbsp;
          <Link
            className='text-light-golden-yellow transition-all duration-200 ease-linear hover:opacity-80'
            href={route.login.path}
          >
            đăng nhập
          </Link>
          &nbsp;để thêm vào danh sách phát
        </span>
      );
      return;
    }
    toggle();
  };

  const handleAddToPlaylist = debounce(async (playlistId: string) => {
    const isInPlaylist = checkedPlaylist.includes(playlistId);
    const action = isInPlaylist
      ? ACTION_DELETE_FROM_PLAYLIST
      : ACTION_ADD_TO_PLAYLIST;

    setPlaylistId(playlistId);

    setCheckedPlaylist((prev) =>
      isInPlaylist
        ? prev.filter((id) => id !== playlistId)
        : [...prev, playlistId]
    );

    const payload: PlaylistItemBodyType = {
      actions: [
        {
          action: action,
          playlistId
        }
      ],
      movieId: movieId
    };

    if (playlistLoading) return;

    await updatePlaylistItemMutate(payload, {
      onSuccess: (res) => {
        if (res.result) {
          notify.success(
            `${isInPlaylist ? 'Xóa phim khỏi' : 'Thêm phim vào'} danh sách phát thành công`
          );
        } else {
          notify.error(
            `${isInPlaylist ? 'Xóa phim khỏi' : 'Thêm phim vào'} danh sách phát thất bại`
          );
        }
      },
      onError: (error) => {
        logger.error(
          `Error ${isInPlaylist ? 'removing from' : 'adding to'} playlist`,
          error
        );
        notify.error('Có lỗi xảy ra, vui lòng thử lại sau');
      }
    });
  });

  useEffect(() => {
    setCheckedPlaylist(playlistByMovie);
  }, [playlistByMovie]);

  return (
    <div className='relative' ref={containerRef}>
      <Button
        className={cn(
          'hover:text-light-golden-yellow h-fit min-w-20! flex-col px-2! text-xs hover:bg-white/10',
          className
        )}
        variant='ghost'
        onClick={handleOpen}
      >
        <FaPlus />
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
                {playlist.length}/{MAX_PLAYLIST_COUNT}
              </span>
            </div>
            {playlistLoading ? (
              <PlaylistItemListSkeleton />
            ) : (
              playlist.map((playlist) => (
                <PlaylistItem
                  key={playlist.id}
                  playlist={playlist}
                  checked={checkedPlaylist.includes(playlist.id)}
                  onToggle={handleAddToPlaylist}
                  disabled={
                    updatePlaylistItemLoading && playlist.id === playlistId
                  }
                />
              ))
            )}
            {playlist.length < MAX_PLAYLIST_COUNT && (
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
