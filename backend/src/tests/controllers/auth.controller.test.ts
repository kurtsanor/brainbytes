import { describe, expect, it, jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";

const mockedAuthService = {
  signUp: jest.fn<(...args: any[]) => any>(),
  signIn: jest.fn<(...args: any[]) => any>(),
  getUserById: jest.fn<(...args: any[]) => any>(),
};

await jest.unstable_mockModule("../../services/auth.service.js", () => ({
  ...mockedAuthService,
}));

const { getCurrentUser, signIn, signUp } =
  await import("../../controllers/auth.controller.js");

const createResponse = () => {
  const response = {} as Response;
  response.status = jest.fn().mockReturnValue(response) as never;
  response.json = jest.fn().mockReturnValue(response) as never;
  return response;
};

describe("auth.controller", () => {
  it("returns a 201 when sign up succeeds", async () => {
    const req = { body: { email: "jane@example.com" } } as unknown as Request;
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    mockedAuthService.signUp.mockResolvedValueOnce(undefined as any);

    await signUp(req, res, next);

    expect(mockedAuthService.signUp).toHaveBeenCalledWith(
      expect.objectContaining({ email: "jane@example.com" }),
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      response: "User created successfully",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns a JWT token when sign in succeeds", async () => {
    const req = {
      body: { email: "jane@example.com", password: "password123" },
    } as unknown as Request;
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    mockedAuthService.signIn.mockResolvedValueOnce("jwt-token" as any);

    await signIn(req, res, next);

    expect(mockedAuthService.signIn).toHaveBeenCalledWith(
      "jane@example.com",
      "password123",
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ response: "jwt-token" });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns the current user from the auth claims", async () => {
    const req = {
      user: { userId: "user-123" },
    } as unknown as Request;
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    mockedAuthService.getUserById.mockResolvedValueOnce({
      _id: "user-123",
      email: "jane@example.com",
    } as never);

    await getCurrentUser(req, res, next);

    expect(mockedAuthService.getUserById).toHaveBeenCalledWith("user-123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      user: {
        _id: "user-123",
        email: "jane@example.com",
      },
    });
    expect(next).not.toHaveBeenCalled();
  });
});
