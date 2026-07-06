import type { PlaylistStoreType } from '@/types';
import { create } from 'zustand';

export const usePlaylistStore = create<PlaylistStoreType>((set) => ({
  selectedPlaylist: null,

  setSelectedPlaylist: (playlist) => set({ selectedPlaylist: playlist })
}));
