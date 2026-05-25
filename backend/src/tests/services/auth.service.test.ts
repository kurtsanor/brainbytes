import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const mockedUser = {
  findOne: jest.fn<(...args: any[]) => any>(),
  create: jest.fn<(...args: any[]) => any>(),
  findById: jest.fn<(...args: any[]) => any>(),
};

const mockedBcrypt = {
  hash: jest.fn<(...args: any[]) => any>(),
  compare: jest.fn<(...args: any[]) => any>(),
};

const mockedJwt = {
  sign: jest.fn<(...args: any[]) => any>(),
};

await jest.unstable_mockModule("../../models/user.model.js", () => ({
  default: mockedUser,
}));

await jest.unstable_mockModule("bcrypt", () => ({
  default: mockedBcrypt,
}));

await jest.unstable_mockModule("jsonwebtoken", () => ({
  default: mockedJwt,
}));

const { getUserById, signIn, signUp } =
  await import("../../services/auth.service.js");

describe("auth.service", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "test-secret";
  });

  it("rejects sign up when the email already exists", async () => {
    mockedUser.findOne.mockResolvedValueOnce({ _id: "existing-user" } as never);

    await expect(
      signUp({
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        password: "password123",
      }),
    ).rejects.toThrow("Email already in use");

    expect(mockedUser.create).not.toHaveBeenCalled();
  });

  it("hashes the password and creates a new user on sign up", async () => {
    mockedUser.findOne.mockResolvedValueOnce(null as any);
    mockedBcrypt.hash.mockResolvedValueOnce("hashed-password" as never);

    await signUp({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      password: "password123",
    });

    expect(mockedBcrypt.hash).toHaveBeenCalledWith("password123", 10);
    expect(mockedUser.create).toHaveBeenCalledWith({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      password: "hashed-password",
    });
  });

  it("rejects sign in for an unknown email", async () => {
    mockedUser.findOne.mockResolvedValueOnce(null as any);

    await expect(signIn("missing@example.com", "password123")).rejects.toThrow(
      "Invalid email or password",
    );
  });

  it("returns a signed token for valid credentials", async () => {
    mockedUser.findOne.mockResolvedValueOnce({
      _id: "user-123",
      password: "hashed-password",
    } as never);
    mockedBcrypt.compare.mockResolvedValueOnce(true as never);
    mockedJwt.sign.mockReturnValueOnce("jwt-token" as never);

    const token = await signIn("jane@example.com", "password123");

    expect(token).toBe("jwt-token");
    expect(mockedJwt.sign).toHaveBeenCalledWith(
      { userId: "user-123" },
      "test-secret",
      { expiresIn: "1h" },
    );
  });

  it("returns the user without the password when fetching by id", async () => {
    const select = jest.fn<(...args: any[]) => any>().mockResolvedValueOnce({
      _id: "user-123",
      email: "jane@example.com",
    });
    mockedUser.findById.mockReturnValueOnce({ select } as never);

    const user = await getUserById("user-123");

    expect(mockedUser.findById).toHaveBeenCalledWith("user-123");
    expect(select).toHaveBeenCalledWith("-password");
    expect(user).toEqual({
      _id: "user-123",
      email: "jane@example.com",
    });
  });
});
