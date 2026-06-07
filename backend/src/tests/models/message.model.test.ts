import mongoose from "mongoose";
import Message from "../../models/message.model.js";
import Chat from "../../models/chat.model.js";
import User from "../../models/user.model.js";
import connectToTestDatabase from "../../config/testDb.js";

describe("Message Model", () => {
  let userId: mongoose.Types.ObjectId;
  let chatId: mongoose.Types.ObjectId;

  beforeAll(async () => {
    await connectToTestDatabase();

    const user = await User.create({
      firstName: "Test",
      lastName: "User",
      email: "messageuser@example.com",
    });

    userId = user._id;

    const chat = await Chat.create({
      title: "Message Chat",
      userId,
    });

    chatId = chat._id;
  });

  afterAll(async () => {
    const db = mongoose.connection.db;

    if (db) {
      await db.dropDatabase();
    }

    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await Message.deleteMany({});
  });

  describe("Required fields", () => {
    it("should require text", async () => {
      const msg = new Message({
        isUser: true,
        chatId,
      });

      await expect(msg.save()).rejects.toThrow();
    });

    it("should require isUser", async () => {
      const msg = new Message({
        text: "Hello",
        chatId,
      });

      await expect(msg.save()).rejects.toThrow();
    });

    it("should require chatId", async () => {
      const msg = new Message({
        text: "Hello",
        isUser: true,
      });

      await expect(msg.save()).rejects.toThrow();
    });

    it("should create a valid message", async () => {
      const msg = await Message.create({
        text: "Hello AI",
        isUser: true,
        chatId,
      });

      expect(msg._id).toBeDefined();
      expect(msg.text).toBe("Hello AI");
      expect(msg.isUser).toBe(true);
      expect(msg.chatId.toString()).toBe(chatId.toString());
    });
  });

  describe("Metadata field", () => {
    it("should allow metadata map", async () => {
      const msg = await Message.create({
        text: "Hello with metadata",
        isUser: false,
        chatId,
        metadata: {
          model: "gpt-4",
          tokens: 123,
          nested: { test: true },
        },
      });

      const metadata = msg.metadata!;

      expect(metadata.get("model")).toBe("gpt-4");
      expect(metadata.get("tokens")).toBe(123);
    });

    it("should default metadata to empty map", async () => {
      const msg = await Message.create({
        text: "No metadata",
        isUser: true,
        chatId,
      });

      const metadata = msg.metadata!;

      expect(metadata instanceof Map).toBe(true);
      expect(metadata.size).toBe(0);
    });
  });

  describe("Timestamps", () => {
    it("should generate createdAt and updatedAt", async () => {
      const msg = await Message.create({
        text: "Timestamp test",
        isUser: true,
        chatId,
      });

      expect((msg as any).createdAt).toBeInstanceOf(Date);
      expect((msg as any).updatedAt).toBeInstanceOf(Date);
    });

    it("should update updatedAt on modification", async () => {
      const msg = await Message.create({
        text: "Before update",
        isUser: true,
        chatId,
      });

      const oldUpdatedAt = (msg as any).updatedAt;

      await new Promise((r) => setTimeout(r, 10));

      msg.text = "After update";
      await msg.save();

      expect((msg as any).updatedAt.getTime()).toBeGreaterThan(
        oldUpdatedAt.getTime()
      );
    });
  });
});