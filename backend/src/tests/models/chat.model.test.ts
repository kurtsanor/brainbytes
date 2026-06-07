import mongoose from "mongoose";
import Chat from "../../models/chat.model.js";
import User from "../../models/user.model.js";
import connectToTestDatabase from "../../config/testDb.js";

describe("Chat Model", () => {
  let userId: mongoose.Types.ObjectId;

  beforeAll(async () => {
    await connectToTestDatabase();

    // create a real user because Chat depends on userId ref
    const user = await User.create({
      firstName: "Test",
      lastName: "User",
      email: "chatuser@example.com",
    });

    userId = user._id;
  });

  afterAll(async () => {
    const db = mongoose.connection.db;

    if (db) {
      await db.dropDatabase();
    }

    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await Chat.deleteMany({});
  });

  describe("Required fields", () => {
    it("should require title", async () => {
      const chat = new Chat({
        userId,
      });

      await expect(chat.save()).rejects.toThrow();
    });

    it("should require userId", async () => {
      const chat = new Chat({
        title: "Test Chat",
      });

      await expect(chat.save()).rejects.toThrow();
    });

    it("should create a valid chat", async () => {
      const chat = await Chat.create({
        title: "My Chat",
        userId,
        subject: "Math",
        device: "desktop",
      });

      expect(chat._id).toBeDefined();
      expect(chat.title).toBe("My Chat");
      expect(chat.subject).toBe("Math");
      expect(chat.device).toBe("desktop");
      expect(chat.status).toBe("active");
    });
  });

  describe("Defaults", () => {
    it("should default subject to General", async () => {
      const chat = await Chat.create({
        title: "Default Subject Test",
        userId,
      });

      expect(chat.subject).toBe("General");
    });

    it("should default device to unknown", async () => {
      const chat = await Chat.create({
        title: "Device Test",
        userId,
      });

      expect(chat.device).toBe("unknown");
    });

    it("should default status to active", async () => {
      const chat = await Chat.create({
        title: "Status Test",
        userId,
      });

      expect(chat.status).toBe("active");
    });
  });

  describe("Enum validation", () => {
    it("should allow valid status values", async () => {
      const chat = await Chat.create({
        title: "Enum Test",
        userId,
        status: "completed",
      });

      expect(chat.status).toBe("completed");
    });

    it("should reject invalid status values", async () => {
      const chat = new Chat({
        title: "Bad Status",
        userId,
        status: "invalid-status",
      });

      await expect(chat.save()).rejects.toThrow();
    });
  });

  describe("Timestamps", () => {
    it("should generate createdAt and updatedAt", async () => {
      const chat = await Chat.create({
        title: "Timestamp Test",
        userId,
      });

      expect(chat.createdAt).toBeInstanceOf(Date);
      expect(chat.updatedAt).toBeInstanceOf(Date);
    });

    it("should update updatedAt on modification", async () => {
      const chat = await Chat.create({
        title: "Update Test",
        userId,
      });

      const oldUpdatedAt = chat.updatedAt;

      await new Promise((r) => setTimeout(r, 10));

      chat.title = "Updated Title";
      await chat.save();

      expect(chat.updatedAt.getTime()).toBeGreaterThan(
        oldUpdatedAt.getTime()
      );
    });
  });
});