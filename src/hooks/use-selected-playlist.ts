'use client';

import { usePlaylistStore } from '@/store';
import { useShallow } from 'zustand/shallow';

export const useSelectedPlaylist = () =>
  usePlaylistStore(
    useShallow((s) => ({
      selectedPlaylist: s.selectedPlaylist,
      setSelectedPlaylist: s.setSelectedPlaylist
    }))
  );
