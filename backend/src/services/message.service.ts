import Message from "../models/message.model.js";
import type { MessageDto } from "../types/message.types.js";
import * as aiService from "./ai.service.js";
import * as chatService from "./chat.service.js";
import { dbQueryDuration } from "../monitoring/metrics.js";

/**
 * Persist a user prompt, generate an AI reply, and link both messages to a chat session.
 *
 * @param text - The user's message text.
 * @param chatId - The chat identifier, or null when a new chat should be created.
 * @param userId - The authenticated user's database identifier.
 * @returns A promise that resolves to the created user and AI messages.
 */
export const createMessage = async (
  text: string,
  chatId: string | null,
  userId: string,
): Promise<MessageDto> => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  try {
    // If no chatId is provided, just create a new chat session
    if (!chatId) {
      console.log("No chat id, creating topic title");

      const title = await aiService.generateTopicTitle(text);
      const chat = await chatService.createChat(
        {
          title,
          subject: "General",
        },
        userId,
      );
      chatId = chat._id.toString();
    }

    // If there is a chat id, check if it exists and belongs to the user
    else {
      console.log(
        "Chat id found, checking if it exists and belongs to the user",
      );
      const chat = await chatService.findChatById(chatId);
      if (!chat) {
        throw new Error("Chat not found");
      }
      if (chat.userId.toString() !== userId) {
        throw new Error("Unauthorized");
      }
    }

    // Save user message
    const endUserInsert = dbQueryDuration.startTimer();

    const userMessage = await Message.create({
      text,
      isUser: true,
      chatId,
    });

    endUserInsert({
      operation: "insert",
      collection: "messages",
    });

    // Generate AI response with a 60-second overall timeout
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error("Request timeout")), 60000);
    });

    const aiResultPromise = aiService.generateResponse(text);

    const aiResult: { category: string; response: string } | any =
      await Promise.race([aiResultPromise, timeoutPromise]).catch((error) => {
        console.error("AI response timed out or failed:", error);
        return {
          category: "error",
          response:
            "I'm sorry, but I couldn't process your request in time. Please try again with a simpler question.",
        };
      });

    chatService.updateLastActive(chatId).catch((error) => {
      console.error("Failed to update chat last active time:", error);
    });

    // Save AI response
    const endAiInsert = dbQueryDuration.startTimer();

    const aiMessage = await Message.create({
      text: aiResult.response,
      isUser: false,
      chatId,
    });

    endAiInsert({
      operation: "insert",
      collection: "messages",
    });

    return { userMessage, aiMessage, category: aiResult.category };
  } finally {
    clearTimeout(timeoutId);
  }
};

/**
 * Return the messages for a chat after verifying ownership.
 *
 * @param chatId - The chat identifier to query.
 * @param userId - The authenticated user's database identifier.
 * @returns A promise that resolves to the chat messages in chronological order.
 */
export const findMessagesByChatId = async (chatId: string, userId: string) => {
  // Check if chat exists
  const chat = await chatService.findChatById(chatId);
  if (!chat) {
    throw new Error("Chat not found");
  }

  // Check also if it belongs to the logged in user
  if (chat.userId.toString() !== userId) {
    throw new Error("Unauthorized");
  }

  const end = dbQueryDuration.startTimer();

  try {
    return await Message.find({ chatId }).sort({ createdAt: 1 });
  } finally {
    end({
      operation: "find",
      collection: "messages",
    });
  }
};

/**
 * Return every stored message in chronological order.
 *
 * @returns A promise that resolves to all messages sorted by creation time.
 */
export const findAllMessages = async () => {
  const end = dbQueryDuration.startTimer();

  try {
    return await Message.find().sort({ createdAt: 1 });
  } finally {
    end({
      operation: "find",
      collection: "messages",
    });
  }
};

/**
 * Count the number of user-authored messages across all chats owned by a user.
 *
 * @param userId - The authenticated user's database identifier.
 * @returns A promise that resolves to the total number of user messages.
 */
export const getTotalMessagesSentByUserId = async (userId: string) => {
  // Get all chats for the user
  const chats = await chatService.findChatsByUserId(userId);
  const chatIds = chats.map((chat) => chat._id);

  const end = dbQueryDuration.startTimer();

  try {
    return await Message.countDocuments({
      chatId: { $in: chatIds },
      isUser: true,
    });
  } finally {
    end({
      operation: "count",
      collection: "messages",
    });
  }
};
