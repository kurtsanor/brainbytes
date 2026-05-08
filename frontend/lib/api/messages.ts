import { Message } from "@/types/message.types";
import { apiFetch } from "./client";

export const getAllMessages = async (): Promise<Message[]> =>
  apiFetch<{ messages: Message[] }>("/api/messages").then(
    (res) => res.messages,
  );

export const sendMessage = async (
  text: string,
): Promise<{ userMessage: Message; aiMessage: Message; category: string }> => {
  return apiFetch<any>("/api/messages", {
    method: "POST",
    body: JSON.stringify({ text }),
  });
};
