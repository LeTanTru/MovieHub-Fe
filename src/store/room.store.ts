import { RoomStoreType } from '@/types';
import { create } from 'zustand';

export const useRoomStore = create<RoomStoreType>((set) => ({
  room: null,
  isJoined: false,
  participantCount: 0,

  setRoom: (room) => set({ room }),
  setIsJoined: (isJoined) => set({ isJoined }),
  setParticipantCount: (participantCount) => set({ participantCount })
}));
