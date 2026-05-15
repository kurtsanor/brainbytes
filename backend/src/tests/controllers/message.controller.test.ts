import { describe, expect, it, jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";

const mockedMessageService = {
  createMessage: jest.fn<(...args: any[]) => any>(),
  findMessagesByChatId: jest.fn<(...args: any[]) => any>(),
  findAllMessages: jest.fn<(...args: any[]) => any>(),
};

const mockedChatService = {
  findChatsByUserId: jest.fn<(...args: any[]) => any>(),
};

await jest.unstable_mockModule("../../services/message.service.js", () => ({
  ...mockedMessageService,
}));

await jest.unstable_mockModule("../../services/chat.service.js", () => ({
  ...mockedChatService,
}));

const {
  createMessage,
  findAllMessages,
  findChatsByUserId,
  findMessagesByChatId,
} = await import("../../controllers/message.controller.js");

const createResponse = () => {
  const response = {} as Response;
  response.status = jest.fn().mockReturnValue(response) as never;
  response.json = jest.fn().mockReturnValue(response) as never;
  return response;
};

describe("message.controller", () => {
  it("creates a message and returns the created payload", async () => {
    const req = {
      params: { id: "chat-123" },
      body: { text: "Hello" },
      user: { userId: "user-123" },
    } as unknown as Request;
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    mockedMessageService.createMessage.mockResolvedValueOnce({
      userMessage: { _id: "user-message" },
      aiMessage: { _id: "ai-message" },
      category: "general",
    } as never);

    await createMessage(req, res, next);

    expect(mockedMessageService.createMessage).toHaveBeenCalledWith(
      "Hello",
      "chat-123",
      "user-123",
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      userMessage: { _id: "user-message" },
      aiMessage: { _id: "ai-message" },
      category: "general",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns messages for a chat id", async () => {
    const req = {
      params: { id: "chat-123" },
      user: { userId: "user-123" },
    } as unknown as Request;
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    mockedMessageService.findMessagesByChatId.mockResolvedValueOnce([
      { _id: "message-1" },
    ] as never);

    await findMessagesByChatId(req, res, next);

    expect(mockedMessageService.findMessagesByChatId).toHaveBeenCalledWith(
      "chat-123",
      "user-123",
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      messages: [{ _id: "message-1" }],
    });
  });

  it("returns all messages", async () => {
    const req = {} as unknown as Request;
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    mockedMessageService.findAllMessages.mockResolvedValueOnce([
      { _id: "message-1" },
    ] as never);

    await findAllMessages(req, res, next);

    expect(mockedMessageService.findAllMessages).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      messages: [{ _id: "message-1" }],
    });
  });

  it("returns chats for the current user", async () => {
    const req = {
      user: { userId: "user-123" },
    } as unknown as Request;
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    mockedChatService.findChatsByUserId.mockResolvedValueOnce([
      { _id: "chat-1" },
    ] as never);

    await findChatsByUserId(req, res, next);

    expect(mockedChatService.findChatsByUserId).toHaveBeenCalledWith(
      "user-123",
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: [{ _id: "chat-1" }],
    });
  });
});
