export interface Message {
  _id: string;
  text: string;
  isUser: boolean;
  createdAt: Date;
  updatedAt: Date;
}
