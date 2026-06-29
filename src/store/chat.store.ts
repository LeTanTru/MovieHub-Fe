import { ChatStore } from '@/types';
import { create } from 'zustand';

export const useChatStore = create<ChatStore>((set) => ({
  toggleChat: false,
  toggleHeader: false,
  toggleChatLeft: false,
  toggleChatLayout: false,

  setToggleChat: (value: boolean) => set({ toggleChat: value }),
  setToggleHeader: (value: boolean) => set({ toggleHeader: value }),
  setToggleChatLeft: (value: boolean) => set({ toggleChatLeft: value }),
  setToggleChatLayout: (value: boolean) => set({ toggleChatLayout: value })
}));
