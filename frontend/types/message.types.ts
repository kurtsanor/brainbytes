export interface Message {
  _id: string;
  text: string;
  isUser: boolean;
  metadata: Record<string, any>;
  chatId: string;
  createdAt: Date;
  updatedAt: Date;
}
