import { describe, expect, it, jest } from "@jest/globals";

const mockedChat = {
  create: jest.fn<(...args: any[]) => any>(),
  findById: jest.fn<(...args: any[]) => any>(),
  find: jest.fn<(...args: any[]) => any>(),
};

await jest.unstable_mockModule("../../models/chat.model.js", () => ({
  default: mockedChat,
}));

const { createChat, findChatById, findChatsByUserId } =
  await import("../../services/chat.service.js");

describe("chat.service", () => {
  it("creates a chat for the provided user", async () => {
    mockedChat.create.mockResolvedValueOnce({
      _id: "chat-123",
      title: "New Topic",
      subject: "General",
      userId: "user-123",
    } as never);

    const result = await createChat(
      { title: "New Topic", subject: "General" },
      "user-123",
    );

    expect(mockedChat.create).toHaveBeenCalledWith({
      title: "New Topic",
      subject: "General",
      userId: "user-123",
    });
    expect(result).toEqual({
      _id: "chat-123",
      title: "New Topic",
      subject: "General",
      userId: "user-123",
    });
  });

  it("finds a chat by id", async () => {
    mockedChat.findById.mockResolvedValueOnce({ _id: "chat-123" } as never);

    await expect(findChatById("chat-123")).resolves.toEqual({
      _id: "chat-123",
    });
  });

  it("finds chats by user id sorted by last active descending", async () => {
    const sort = jest
      .fn<(...args: any[]) => any>()
      .mockResolvedValueOnce([{ _id: "chat-2" }, { _id: "chat-1" }]);
    mockedChat.find.mockReturnValueOnce({ sort } as never);

    const chats = await findChatsByUserId("user-123");

    expect(mockedChat.find).toHaveBeenCalledWith({ userId: "user-123" });
    expect(sort).toHaveBeenCalledWith({ lastActive: -1 });
    expect(chats).toEqual([{ _id: "chat-2" }, { _id: "chat-1" }]);
  });
});
