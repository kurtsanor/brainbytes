import { Message } from "@/types/message.types";
import { apiServerFetch } from "./api-server";
import { Chat } from "@/types/chat.types";

export const getMessagesByChatId = async (chatId: string): Promise<Message[]> =>
  apiServerFetch<{ messages: Message[] }>(`/api/chats/${chatId}/messages`).then(
    (res) => res.messages,
  );

export const getUserConversations = () =>
  apiServerFetch<{ data: Chat[] }>(`/api/chats/`, {
    cache: "no-store",
  })
    .then((res) => res.data)
    .catch((error) => {
      console.error("Error fetching conversations:", error);
      return [];
    });
