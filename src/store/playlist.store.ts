import { PlaylistStoreType } from '@/types';
import { create } from 'zustand';

const usePlaylistStore = create<PlaylistStoreType>((set) => ({
  selectedPlaylist: null,

  setSelectedPlaylist: (playlist) => set({ selectedPlaylist: playlist })
}));

export default usePlaylistStore;
