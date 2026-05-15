import type { CreateChatDto } from "../types/chat.types.js";
import Chat from "../models/chat.model.js";

export const createChat = async (
  createChatDto: CreateChatDto,
  userId: string,
) => {
  return await Chat.create({ ...createChatDto, userId });
};

export const findChatById = async (chatId: string) => {
  try {
    return await Chat.findById(chatId);
  } catch (error) {
    throw error;
  }
};

export const findChatsByUserId = async (userId: string) => {
  try {
    return await Chat.find({ userId }).sort({ lastActive: -1 });
  } catch (error) {
    throw error;
  }
};

export const updateLastActive = async (chatId: string) => {
  try {
    await Chat.findByIdAndUpdate(chatId, { lastActive: new Date() });
  } catch (error) {
    throw error;
  }
};
