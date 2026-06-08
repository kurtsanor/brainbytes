import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import SignInPage from "@/app/(auth)/sign-in/page";

const { replaceMock, toastSuccessMock, toastErrorMock } = vi.hoisted(() => ({
  replaceMock: vi.fn(),
  toastSuccessMock: vi.fn(),
  toastErrorMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: toastSuccessMock,
    error: toastErrorMock,
  },
}));

describe("SignInPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("stores the session token and redirects after a successful login", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ token: "session-token-123" }),
    });

    vi.stubGlobal("fetch", fetchMock);

    render(<SignInPage />);

    fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), {
      target: { value: "ava@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "secret123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /^login$/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/login",
        expect.objectContaining({
          method: "POST",
        }),
      );
    });

    expect(localStorage.getItem("session-token")).toBe("session-token-123");
    expect(toastSuccessMock).toHaveBeenCalledWith("Login Successful!");
    expect(replaceMock).toHaveBeenCalledWith("/chat");
  });
});
