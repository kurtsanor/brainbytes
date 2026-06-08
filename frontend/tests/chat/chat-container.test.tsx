import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ChatContainer from "@/app/(main)/chat/chat-container";

const { replaceMock, refreshMock, sendMessageMock } = vi.hoisted(() => ({
  replaceMock: vi.fn(),
  refreshMock: vi.fn(),
  sendMessageMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock,
    refresh: refreshMock,
  }),
}));

vi.mock("@/lib/api/messages.client", () => ({
  sendMessage: sendMessageMock,
}));

describe("ChatContainer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
      value: vi.fn(),
      configurable: true,
    });

    sendMessageMock.mockResolvedValue({
      userMessage: {
        _id: "user-1",
        text: "Test message",
        isUser: true,
        metadata: {},
        chatId: "chat-123",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      aiMessage: {
        _id: "ai-1",
        text: "AI response",
        isUser: false,
        metadata: {},
        chatId: "chat-123",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      category: "general",
    });
  });

  it("submits a message, clears the textarea, and routes to the new chat", async () => {
    render(
      <ChatContainer
        messages={[]}
        userDetails={{
          _id: "user-1",
          firstName: "Ava",
          lastName: "Stone",
          email: "ava@example.com",
          createdAt: "2026-06-08T00:00:00.000Z",
          updatedAt: "2026-06-08T00:00:00.000Z",
        }}
      />,
    );

    const input = screen.getByPlaceholderText(/how can i help you today/i);
    fireEvent.change(input, { target: { value: "Test message" } });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(input).toHaveValue("");

    await waitFor(() => {
      expect(sendMessageMock).toHaveBeenCalledWith("Test message", "");
      expect(replaceMock).toHaveBeenCalledWith("/chat/chat-123");
      expect(refreshMock).toHaveBeenCalled();
    });

    expect(await screen.findByText("Test message")).toBeInTheDocument();
    expect(await screen.findByText("AI response")).toBeInTheDocument();
  });
});
