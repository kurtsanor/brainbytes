import Message from "../models/message.model.js";
import type { MessageDto } from "../types/message.types.js";
import * as aiService from "./ai.service.js";
import * as chatService from "./chat.service.js";

export const createMessage = async (
  text: string,
  chatId: string | null,
  userId: string,
): Promise<MessageDto> => {
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
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), 60000),
    );

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

    // Save AI response
    const aiMessage = await Message.create({
      text: aiResult.response,
      isUser: false,
      chatId,
    });

    return { userMessage, aiMessage, category: aiResult.category };
  } catch (error) {
    throw error;
  }
};

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

export const findAllMessages = async () => {
  try {
    return await Message.find().sort({ createdAt: 1 });
  } catch (error) {
    throw error;
  }
};
