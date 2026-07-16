import { Message } from "@/types/message.types";
import { Chat } from "@/types/chat.types";
import { apiClientFetch } from "./api-client";

export const sendMessage = async (
  text: string,
  chatId: string,
): Promise<{ userMessage: Message; aiMessage: Message; category: string }> => {
  return apiClientFetch<{
    userMessage: Message;
    aiMessage: Message;
    category: string;
  }>(`/api/chats/${chatId}`, {
    method: "POST",
    body: JSON.stringify({ text }),
  });
};

export const getUserConversations = (): Promise<Chat[]> =>
  apiClientFetch<{ data: Chat[] }>("/api/chats/", {
    cache: "no-store",
  }).then((res) => res.data);
