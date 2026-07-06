import type { ChatResType, ChatStore } from '@/types';
import { create } from 'zustand';

export const useChatStore = create<ChatStore>((set) => ({
  toggleChat: false,
  toggleHeader: false,
  toggleChatLayout: false,
  messages: [],
  messagesLoaded: false,

  setToggleChat: (value: boolean) => set({ toggleChat: value }),
  setToggleHeader: (value: boolean) => set({ toggleHeader: value }),
  setToggleChatLayout: (value: boolean) => set({ toggleChatLayout: value }),
  addMessage: (msg: ChatResType) =>
    set((state) => ({ messages: [...state.messages, msg] })),
  setMessages: (msgs: ChatResType[]) =>
    set({ messages: msgs, messagesLoaded: true }),
  clearMessages: () => set({ messages: [], messagesLoaded: false })
}));
