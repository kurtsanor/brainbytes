import { model, Schema } from "mongoose";
import type { Message } from "../types/message.types.js";

const messageSchema = new Schema<Message>(
  {
    text: { type: String, required: true, trim: true },
    isUser: { type: Boolean, required: true },
    chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

messageSchema.index({ chatId: 1, createdAt: 1 });

export default model("Message", messageSchema);
