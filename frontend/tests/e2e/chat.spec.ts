import { expect, test } from "@playwright/test";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-fallback-secret-use-env-in-prod",
);

const createSessionToken = async () =>
  new SignJWT({ sub: "user-1" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(JWT_SECRET);

test.describe("chat flow", () => {
  test.beforeEach(async ({ context }) => {
    const sessionToken = await createSessionToken();

    await context.addCookies([
      {
        name: "session-token",
        value: sessionToken,
        url: "http://127.0.0.1:3002",
        sameSite: "Lax",
      },
      {
        name: "session-token",
        value: sessionToken,
        url: "http://localhost:3002",
        sameSite: "Lax",
      },
    ]);
  });

  test("lets a user send a first message and receive an AI reply", async ({
    page,
  }) => {
    await page.goto("/chat");

    await expect(
      page.getByPlaceholder("How can I help you today?"),
    ).toBeVisible();

    await page.getByPlaceholder("How can I help you today?").fill("Hello AI");
    await page.getByRole("button", { name: "Send message" }).click();

    await expect(page.getByRole("main").getByText("Hello AI")).toBeVisible();
    await expect(
      page.getByText("Hi there, I can help with that."),
    ).toBeVisible();
    await expect(page).toHaveURL(/\/chat\/chat-test-\d+$/);
  });
});
