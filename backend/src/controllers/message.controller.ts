import type { Request, Response, NextFunction } from "express";
import * as messageService from "../services/message.service.js";
import * as chatService from "../services/chat.service.js";
import type { JwtClaims } from "../types/auth.types.js";

/**
 * Create a user message and generate the paired AI response for a chat session.
 *
 * @param req - Express request containing the chat id and message body.
 * @param res - Express response used to return the created messages.
 * @param next - Express next function used to forward errors.
 * @returns A JSON response with the user message, AI message, and category.
 */
export const createMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params; // Chat/Session ID
    const { text } = req.body;

    const parsedId = id ? id.toString() : null;

    const user = req.user as JwtClaims;

    // Call the service to create a message and get the AI response
    const { userMessage, aiMessage, category } =
      await messageService.createMessage(text, parsedId, user.userId);

    res.status(201).json({ userMessage, aiMessage, category });
  } catch (error) {
    next(error);
  }
};

/**
 * Return all messages belonging to a specific chat session.
 *
 * @param req - Express request containing the chat id parameter.
 * @param res - Express response used to return the message list.
 * @param next - Express next function used to forward errors.
 * @returns A JSON response containing all messages for the chat.
 */
export const findMessagesByChatId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id!; // Chat/Session ID
    const user = req.user as JwtClaims;

    const messages = await messageService.findMessagesByChatId(
      id.toString(),
      user.userId,
    );

    res.status(200).json({ messages });
  } catch (error) {
    next(error);
  }
};

/**
 * Return the full message history across the application.
 *
 * @param req - Express request object.
 * @param res - Express response used to return the message list.
 * @param next - Express next function used to forward errors.
 * @returns A JSON response containing every stored message.
 */
export const findAllMessages = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await messageService.findAllMessages();

    res.status(200).json({ messages: result });
  } catch (error) {
    next(error);
  }
};

/**
 * Return the current user's chat list.
 *
 * @param req - Express request containing authenticated user claims.
 * @param res - Express response used to return the chats.
 * @param next - Express next function used to forward errors.
 * @returns A JSON response containing the user's chats.
 */
export const findChatsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user as JwtClaims;
    const result = await chatService.findChatsByUserId(user.userId);

    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};
