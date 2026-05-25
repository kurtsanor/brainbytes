import { describe, expect, it, jest } from "@jest/globals";

const mockedMessage = {
  create: jest.fn<(...args: any[]) => any>(),
  find: jest.fn<(...args: any[]) => any>(),
};

const mockedAiService = {
  generateTopicTitle: jest.fn<(...args: any[]) => any>(),
  generateResponse: jest.fn<(...args: any[]) => any>(),
};

const mockedChatService = {
  createChat: jest.fn<(...args: any[]) => any>(),
  findChatById: jest.fn<(...args: any[]) => any>(),
  updateLastActive: jest.fn<(...args: any[]) => any>(),
};

await jest.unstable_mockModule("../../models/message.model.js", () => ({
  default: mockedMessage,
}));

await jest.unstable_mockModule("../../services/ai.service.js", () => ({
  ...mockedAiService,
}));

await jest.unstable_mockModule("../../services/chat.service.js", () => ({
  ...mockedChatService,
}));

const { createMessage, findMessagesByChatId } =
  await import("../../services/message.service.js");

describe("message.service", () => {
  it("creates a new chat, user message, and AI response when no chat id exists", async () => {
    mockedAiService.generateTopicTitle.mockResolvedValueOnce(
      "Fractions Basics",
    );

    mockedChatService.createChat.mockResolvedValueOnce({
      _id: { toString: () => "chat-123" },
    } as never);

    mockedMessage.create
      .mockResolvedValueOnce({ _id: "user-message" } as never)
      .mockResolvedValueOnce({ _id: "ai-message" } as never);

    mockedAiService.generateResponse.mockResolvedValueOnce({
      category: "math",
      response: "Let us break it down.",
    });

    mockedChatService.updateLastActive.mockResolvedValueOnce(
      undefined as never,
    );

    const result = await createMessage("Explain fractions", null, "user-123");

    expect(mockedAiService.generateTopicTitle).toHaveBeenCalledWith(
      "Explain fractions",
    );
    expect(mockedChatService.createChat).toHaveBeenCalledWith(
      { title: "Fractions Basics", subject: "General" },
      "user-123",
    );
    expect(mockedMessage.create).toHaveBeenNthCalledWith(1, {
      text: "Explain fractions",
      isUser: true,
      chatId: "chat-123",
    });
    expect(mockedMessage.create).toHaveBeenNthCalledWith(2, {
      text: "Let us break it down.",
      isUser: false,
      chatId: "chat-123",
    });
    expect(result).toEqual({
      userMessage: { _id: "user-message" },
      aiMessage: { _id: "ai-message" },
      category: "math",
    });
  });

  it("rejects messages for a chat that belongs to another user", async () => {
    mockedChatService.findChatById.mockResolvedValueOnce({
      userId: { toString: () => "different-user" },
    } as never);

    await expect(
      createMessage("Hello", "chat-123", "user-123"),
    ).rejects.toThrow("Unauthorized");
  });

  it("returns messages in chronological order after validating ownership", async () => {
    mockedChatService.findChatById.mockResolvedValueOnce({
      userId: { toString: () => "user-123" },
    } as never);

    const sort = jest
      .fn<(...args: any[]) => any>()
      .mockResolvedValueOnce([{ _id: "message-1" }]);

    mockedMessage.find.mockReturnValueOnce({ sort } as never);

    const messages = await findMessagesByChatId("chat-123", "user-123");

    expect(mockedChatService.findChatById).toHaveBeenCalledWith("chat-123");

    expect(mockedMessage.find).toHaveBeenCalledWith({
      chatId: "chat-123",
    });

    expect(sort).toHaveBeenCalledWith({ createdAt: 1 });

    expect(messages).toEqual([{ _id: "message-1" }]);
  });
});
