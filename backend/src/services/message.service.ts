import Message from "../models/message.model.js";
import type { MessageDto } from "../types/message.types.js";
import * as aiService from "./ai.service.js";
import * as chatService from "./chat.service.js";

/**
 * Persist a user prompt, generate an AI reply, and link both messages to a chat session.
 *
 * @param text - The user's message text.
 * @param chatId - The chat identifier, or null when a new chat should be created.
 * @param userId - The authenticated user's database identifier.
 * @returns A promise that resolves to the created user and AI messages.
 * @throws If the chat lookup, AI generation, or persistence fails.
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
    const userMessage = await Message.create({
      text,
      isUser: true,
      chatId,
    });

    // Generate AI response with a 60-second overall timeout
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error("Request timeout")), 60000);
    });

    // Get the response from the AI service
    const aiResultPromise = aiService.generateResponse(text);

    // Race between the AI response and the timeout
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
    const aiMessage = await Message.create({
      text: aiResult.response,
      isUser: false,
      chatId,
    });

    return { userMessage, aiMessage, category: aiResult.category };
  } catch (error) {
    throw error;
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
 * @throws If the chat does not exist, does not belong to the user, or the query fails.
 */
export const findMessagesByChatId = async (chatId: string, userId: string) => {
  try {
    // Check if chat exists
    const chat = await chatService.findChatById(chatId);
    if (!chat) {
      throw new Error("Chat not found");
    }

    // Check also if it belongs to the logged in user
    if (chat.userId.toString() !== userId) {
      throw new Error("Unauthorized");
    }

    return await Message.find({ chatId }).sort({ createdAt: 1 });
  } catch (error) {
    throw error;
  }
};

/**
 * Return every stored message in chronological order.
 *
 * @returns A promise that resolves to all messages sorted by creation time.
 * @throws If the database query fails.
 */
export const findAllMessages = async () => {
  try {
    return await Message.find().sort({ createdAt: 1 });
  } catch (error) {
    throw error;
  }
};

/**
 * Count the number of user-authored messages across all chats owned by a user.
 *
 * @param userId - The authenticated user's database identifier.
 * @returns A promise that resolves to the total number of user messages.
 * @throws If the chat or message query fails.
 */
export const getTotalMessagesSentByUserId = async (userId: string) => {
  try {
    // Get all chats for the user
    const chats = await chatService.findChatsByUserId(userId);
    const chatIds = chats.map((chat) => chat._id);
    // Count messages that belong to those chats
    return await Message.countDocuments({
      chatId: { $in: chatIds },
      isUser: true,
    });
  } catch (error) {
    throw error;
  }
};
