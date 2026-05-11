import { Message } from "@/types/message.types";
import { apiServerFetch } from "./api-server";

export const getAllMessages = async (): Promise<Message[]> =>
  apiServerFetch<{ messages: Message[] }>("/api/messages")
    .then((res) => res.messages)
    .catch((error) => {
      console.error("Error fetching messages:", error);
      return [];
    });
