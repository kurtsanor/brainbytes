export interface Message {
  _id: string;
  text: string;
  isUser: boolean;
  metadata: Record<string, unknown>;
  chatId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SendMessageResponse {
  userMessage: Message;
  aiMessage: Message;
  category: string;
}
