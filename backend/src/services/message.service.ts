import Message from "../models/message.model.js";
import * as aiService from "./ai.service.js";

export const createMessage = async (
  text: string,
): Promise<{ userMessage: any; aiMessage: any; category: string }> => {
  try {
    const userMessage = await Message.create({ text, isUser: true });

    // Generate AI response with a 60-second overall timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), 60000),
    );

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
    });

    return { userMessage, aiMessage, category: aiResult.category };
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
