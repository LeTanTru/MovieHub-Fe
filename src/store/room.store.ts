import { RoomStoreType } from '@/types';
import { create } from 'zustand';

export const useRoomStore = create<RoomStoreType>((set) => ({
  room: null,
  setRoom: (room) => set({ room })
}));
