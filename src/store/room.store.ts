import { RoomStoreType } from '@/types';
import { create } from 'zustand';

export const useRoomStore = create<RoomStoreType>((set) => ({
  room: null,
  isJoined: false,
  participantCount: 0,
  playerState: {
    currentPositionMovie: 0,
    isPlay: false,
    playSpeed: 1,
    subCmd: ''
  },
  endReason: '',
  getPlayerCurrentTime: () => 0,

  setRoom: (room) => set({ room }),
  setIsJoined: (isJoined) => set({ isJoined }),
  setParticipantCount: (participantCount) => set({ participantCount }),
  setPlayerState: (playerState) => set({ playerState }),
  setEndReason: (endReason) => set({ endReason }),
  setGetPlayerCurrentTime: (fn) => set({ getPlayerCurrentTime: fn })
}));
