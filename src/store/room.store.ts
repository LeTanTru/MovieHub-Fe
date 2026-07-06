import type { RoomStoreType } from '@/types';
import { create } from 'zustand';

export const useRoomStore = create<RoomStoreType>((set) => ({
  room: null,
  isJoined: false,
  isKicked: false,
  participantCount: 0,
  playerState: {
    currentPositionMovie: 0,
    isPlay: false,
    playSpeed: 1,
    subCmd: ''
  },
  reasonEnd: '',
  getPlayerCurrentTime: () => 0,
  participants: [],

  setRoom: (room) => set({ room }),
  setIsJoined: (isJoined) => set({ isJoined }),
  setIsKicked: (isKicked) => set({ isKicked }),
  setParticipantCount: (participantCount) => set({ participantCount }),
  setPlayerState: (playerState) => set({ playerState }),
  setReasonEnd: (reasonEnd) => set({ reasonEnd }),
  setGetPlayerCurrentTime: (fn) => set({ getPlayerCurrentTime: fn }),
  setParticipants: (participants) => set({ participants })
}));
