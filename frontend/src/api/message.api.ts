import { axiosInstance } from "../config/axios";
import type { Message } from "../types/message.type";

export const getMessages = async (): Promise<{ messages: Message[] }> => {
  const response = await axiosInstance.get("/api/messages");
  return response.data;
};

export const sendMessage = async (text: string): Promise<any> => {
  const response = await axiosInstance.post("/api/messages", { text });
  return response.data;
};
