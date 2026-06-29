import { chatSchema } from '@/schemaValidations/chat.schema';
import z from 'zod';

export type ChatBodyType = z.infer<typeof chatSchema>;

export type ChatState = {
  toggleChat: boolean;
  toggleHeader: boolean;
  toggleChatLeft: boolean;
  toggleChatLayout: boolean;
};

export type ChatActions = {
  setToggleChat: (value: boolean) => void;
  setToggleHeader: (value: boolean) => void;
  setToggleChatLeft: (value: boolean) => void;
  setToggleChatLayout: (value: boolean) => void;
};

export type ChatStore = ChatState & ChatActions;
