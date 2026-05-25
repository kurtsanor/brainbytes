import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";

const mockedJwt = {
  verify: jest.fn<(...args: any[]) => any>(),
};

await jest.unstable_mockModule("jsonwebtoken", () => ({
  default: mockedJwt,
}));

const { authenticate } = await import("../../middlewares/auth.middleware.js");

const createResponse = () => {
  const response = {} as Response;
  response.status = jest.fn().mockReturnValue(response) as never;
  response.json = jest.fn().mockReturnValue(response) as never;
  return response;
};

describe("auth.middleware", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "test-secret";
  });

  it("rejects requests with a missing bearer token", () => {
    const req = { headers: {} } as unknown as Request;
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Authorization header missing or malformed.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("stores decoded claims on the request and calls next", () => {
    const req = {
      headers: { authorization: "Bearer token-123" },
    } as unknown as Request;
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    mockedJwt.verify.mockReturnValueOnce({
      userId: "user-123",
      role: "user",
      iat: 1,
      exp: 2,
    } as never);

    authenticate(req, res, next);

    expect(mockedJwt.verify).toHaveBeenCalledWith("token-123", "test-secret");
    expect(req.user).toEqual({
      userId: "user-123",
      role: "user",
      iat: 1,
      exp: 2,
    });
    expect(next).toHaveBeenCalled();
  });

  it("returns a 401 for invalid tokens", () => {
    const req = {
      headers: { authorization: "Bearer token-123" },
    } as unknown as Request;
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    mockedJwt.verify.mockImplementationOnce(() => {
      throw new Error("invalid token");
    });

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Token has expired or is invalid.",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
