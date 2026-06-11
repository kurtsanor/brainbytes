import { Message } from "@/types/message.types";
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
