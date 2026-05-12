import { model, Schema } from "mongoose";

const chatSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    subject: {
      type: String,
      required: true,
      default: "General",
    },
    device: {
      type: String,
      default: "unknown",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "completed"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

chatSchema.index({ userId: 1, lastActive: -1 });

export default model("Chat", chatSchema);
