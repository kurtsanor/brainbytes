import type { Request, Response, NextFunction } from "express";
import * as messageService from "../services/message.service.js";

export const createMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { text } = req.body;

    // Call the service to create a message and get the AI response
    const { userMessage, aiMessage, category } =
      await messageService.createMessage(text);

    res.status(201).json({ userMessage, aiMessage, category });
  } catch (error) {
    next(error);
  }
};

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
