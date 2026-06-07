import mongoose from "mongoose";
import User from "../../models/user.model.js";
import connectToDatabase from "../../config/testDb.js";

describe("User Model", () => {
  beforeAll(async () => {
    await connectToDatabase();
  });

//   it("connection check", async () => {
//     console.log("DB Name:", mongoose.connection.name);
//     console.log("Host:", mongoose.connection.host);
//     console.log("Collection:", User.collection.name);
//   });

//   it("debug user count", async () => {
//   const count = await User.countDocuments();

//   console.log("USER COUNT:", count);

//   const users = await User.find({});

//   console.log("USERS:", users);

//   expect(true).toBe(true);
// });

  afterAll(async () => {
    const db = mongoose.connection.db;

    if (db) {
      await db.dropDatabase();
    }

    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("Required fields", () => {
    it("should require firstName", async () => {
      const user = new User({
        lastName: "Doe",
        email: "john@example.com",
      });

      await expect(user.save()).rejects.toThrow();
    });

    it("should require lastName", async () => {
      const user = new User({
        firstName: "John",
        email: "john@example.com",
      })

      await expect(user.save()).rejects.toThrow();
    });

    it("should require email", async () => {
      const user = new User({
        firstName: "John",
        lastName: "Doe",
      });

      await expect(user.save()).rejects.toThrow();
    });

    it("should create a valid user", async () => {
      const user = await User.create({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "hashedPassword",
      });

      expect(user._id).toBeDefined();
      expect(user.firstName).toBe("John");
      expect(user.lastName).toBe("Doe");
      expect(user.email).toBe("john@example.com");
    });
  });

  describe("Defaults", () => {
    it("should default provider to 'local'", async () => {
      const user = await User.create({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      });

      expect(user.provider).toBe("local");
    });
  });

  describe("Uniqueness constraints", () => {
    it("should enforce unique email", async () => {
      await User.create({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      });

      await expect(
        User.create({
          firstName: "Jane",
          lastName: "Doe",
          email: "john@example.com",
        })
      ).rejects.toThrow();
    });

    it("should enforce unique googleId", async () => {
      await User.create({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        googleId: "google123",
      });

      await expect(
        User.create({
          firstName: "Jane",
          lastName: "Doe",
          email: "jane@example.com",
          googleId: "google123",
        })
      ).rejects.toThrow();
    });

    it("should enforce unique githubId", async () => {
      await User.create({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        githubId: "github123",
      });

      await expect(
        User.create({
          firstName: "Jane",
          lastName: "Doe",
          email: "jane@example.com",
          githubId: "github123",
        })
      ).rejects.toThrow();
    });
  });

  describe("OAuth fields", () => {
    it("should allow googleId and githubId", async () => {
      const user = await User.create({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        googleId: "google123",
        githubId: "github123",
        provider: "google",
      });

      expect(user.googleId).toBe("google123");
      expect(user.githubId).toBe("github123");
      expect(user.provider).toBe("google");
    });

    it("should allow missing password for OAuth users", async () => {
      const user = await User.create({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        googleId: "google123",
      });

      expect(user.password).toBeUndefined();
    });
  });

  describe("Timestamps", () => {
    it("should generate createdAt and updatedAt", async () => {
      const user = await User.create({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      });

      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it("should update updatedAt on modification", async () => {
      const user = await User.create({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      });

      const oldUpdatedAt = user.updatedAt;

      await new Promise((r) => setTimeout(r, 10));

      user.firstName = "Jane";
      await user.save();

      expect(user.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
    });
  });
});