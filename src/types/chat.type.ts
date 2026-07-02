import { chatSchema, chatSearchSchema } from '@/schemaValidations/chat.schema';
import { BaseSearchType } from '@/types/search.type';
import z from 'zod';

export type ChatResType = {
  id: string;
  createdDate: string;
  user: {
    id: string;
    username: string;
    email: string;
    fullName: string;
    avatarPath: string;
    kind: number;
    gender: number;
  };
  content: string;
};

export type ChatBodyType = z.infer<typeof chatSchema>;

export type ChatSearchType = z.infer<typeof chatSearchSchema> & BaseSearchType;

export type ChatState = {
  toggleChat: boolean;
  toggleHeader: boolean;
  toggleChatLayout: boolean;
  messages: ChatResType[];
  messagesLoaded: boolean;
};

export type ChatActions = {
  setToggleChat: (value: boolean) => void;
  setToggleHeader: (value: boolean) => void;
  setToggleChatLayout: (value: boolean) => void;
  addMessage: (msg: ChatResType) => void;
  setMessages: (msgs: ChatResType[]) => void;
  clearMessages: () => void;
};

export type ChatStore = ChatState & ChatActions;
