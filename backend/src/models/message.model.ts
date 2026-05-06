import { model, Schema } from "mongoose";

const messageSchema = new Schema(
  {
    text: { type: String, required: true, trim: true },
    isUser: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  },
);

export default model("Message", messageSchema);
