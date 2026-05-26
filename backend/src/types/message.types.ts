import type { Document, Types } from "mongoose";

/**
 * Message document and API response shapes used by the messaging layer.
 */
export interface Message extends Document {
  text: string;
  isUser: boolean;
  chatId: Types.ObjectId;
  metadata?: Record<string, any>;
}

export interface MessageDto {
  userMessage: Message;
  aiMessage: Message;
  category: string;
}
