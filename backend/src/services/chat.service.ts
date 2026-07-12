import type { CreateChatDto } from "../types/chat.types.js";
import Chat from "../models/chat.model.js";
import { dbQueryDuration } from "../monitoring/metrics.js";

/**
 * Create a new chat session for the authenticated user.
 */
export const createChat = async (
  createChatDto: CreateChatDto,
  userId: string,
) => {
  const end = dbQueryDuration.startTimer();

  try {
    return await Chat.create({ ...createChatDto, userId });
  } finally {
    end({
      operation: "insert",
      collection: "chats",
    });
  }
};

/**
 * Look up a chat by its database identifier.
 */
export const findChatById = async (chatId: string) => {
  const end = dbQueryDuration.startTimer();

  try {
    return await Chat.findById(chatId);
  } finally {
    end({
      operation: "findById",
      collection: "chats",
    });
  }
};

/**
 * Return the user's chats ordered by most recently active.
 */
export const findChatsByUserId = async (userId: string) => {
  const end = dbQueryDuration.startTimer();

  try {
    return await Chat.find({ userId }).sort({ lastActive: -1 });
  } finally {
    end({
      operation: "find",
      collection: "chats",
    });
  }
};

/**
 * Update the last-active timestamp for a chat session.
 */
export const updateLastActive = async (chatId: string) => {
  const end = dbQueryDuration.startTimer();

  try {
    await Chat.findByIdAndUpdate(chatId, { lastActive: new Date() });
  } finally {
    end({
      operation: "update",
      collection: "chats",
    });
  }
};

/**
 * Count the total number of chat sessions for a user.
 */
export const getTotalChatSessionsByUserId = async (userId: string) => {
  const end = dbQueryDuration.startTimer();

  try {
    return await Chat.countDocuments({ userId });
  } finally {
    end({
      operation: "count",
      collection: "chats",
    });
  }
};

/**
 * Return the most recent activity timestamp across a user's chats.
 */
export const getLastActiveChatByUserId = async (userId: string) => {
  const end = dbQueryDuration.startTimer();

  try {
    const chat = await Chat.findOne({ userId }).sort({ lastActive: -1 });
    return chat ? chat.lastActive : null;
  } finally {
    end({
      operation: "findOne",
      collection: "chats",
    });
  }
};
