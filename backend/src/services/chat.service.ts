import type { CreateChatDto } from "../types/chat.types.js";
import Chat from "../models/chat.model.js";

/**
 * Create a new chat session for the authenticated user.
 *
 * @param createChatDto - The chat metadata to persist.
 * @param userId - The authenticated user's database identifier.
 * @returns A promise that resolves to the created chat document.
 */
export const createChat = async (
  createChatDto: CreateChatDto,
  userId: string,
) => {
  return await Chat.create({ ...createChatDto, userId });
};

/**
 * Look up a chat by its database identifier.
 *
 * @param chatId - The chat document identifier.
 * @returns A promise that resolves to the chat document, or null when not found.
 * @throws If the database lookup fails.
 */
export const findChatById = async (chatId: string) => {
  try {
    return await Chat.findById(chatId);
  } catch (error) {
    throw error;
  }
};

/**
 * Return the user's chats ordered by most recently active.
 *
 * @param userId - The authenticated user's database identifier.
 * @returns A promise that resolves to the user's chat list.
 * @throws If the database query fails.
 */
export const findChatsByUserId = async (userId: string) => {
  try {
    return await Chat.find({ userId }).sort({ lastActive: -1 });
  } catch (error) {
    throw error;
  }
};

/**
 * Update the last-active timestamp for a chat session.
 *
 * @param chatId - The chat document identifier.
 * @returns A promise that resolves when the update completes.
 * @throws If the database update fails.
 */
export const updateLastActive = async (chatId: string) => {
  try {
    await Chat.findByIdAndUpdate(chatId, { lastActive: new Date() });
  } catch (error) {
    throw error;
  }
};

/**
 * Count the total number of chat sessions for a user.
 *
 * @param userId - The authenticated user's database identifier.
 * @returns A promise that resolves to the chat count.
 * @throws If the database query fails.
 */
export const getTotalChatSessionsByUserId = async (userId: string) => {
  try {
    return await Chat.countDocuments({ userId });
  } catch (error) {
    throw error;
  }
};

/**
 * Return the most recent activity timestamp across a user's chats.
 *
 * @param userId - The authenticated user's database identifier.
 * @returns A promise that resolves to the latest chat activity timestamp or null.
 * @throws If the database query fails.
 */
export const getLastActiveChatByUserId = async (userId: string) => {
  try {
    const chat = await Chat.findOne({ userId }).sort({ lastActive: -1 });
    return chat ? chat.lastActive : null;
  } catch (error) {
    throw error;
  }
};
