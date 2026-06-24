import { createServer } from "node:http";
import { spawn } from "node:child_process";

const backendPort = 3001;
const frontendPort = 3000;
const backendBaseUrl = `http://127.0.0.1:${backendPort}`;

const state = {
  chats: [],
  messagesByChatId: new Map(),
  nextChatId: 1,
};

const json = (res, statusCode, payload) => {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "http://127.0.0.1:3000",
    "Access-Control-Allow-Credentials": "true",
  });
  res.end(JSON.stringify(payload));
};

const allowCors = (req, res) => {
  const origin = req.headers.origin || "http://127.0.0.1:3000";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
};

const toMessage = (text, isUser, chatId, idSuffix) => ({
  _id: `${chatId}-${idSuffix}`,
  text,
  isUser,
  metadata: {},
  chatId,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const backend = createServer((req, res) => {
  allowCors(req, res);

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url || "/", backendBaseUrl);

  if (req.method === "GET" && url.pathname === "/api/auth/me") {
    json(res, 200, {
      user: {
        _id: "user-1",
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
      },
    });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/chats/") {
    json(res, 200, { data: state.chats });
    return;
  }

  if (
    req.method === "POST" &&
    (url.pathname === "/api/chats" || url.pathname === "/api/chats/")
  ) {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      const parsed = body ? JSON.parse(body) : {};
      const incomingText = parsed.text || "";
      const resolvedChatId = `chat-test-${state.nextChatId}`;
      state.nextChatId += 1;

      const userMessage = toMessage(incomingText, true, resolvedChatId, "user");
      const aiMessage = toMessage(
        "Hi there, I can help with that.",
        false,
        resolvedChatId,
        "ai",
      );

      state.messagesByChatId.set(resolvedChatId, [userMessage, aiMessage]);

      state.chats = [
        {
          _id: resolvedChatId,
          title: incomingText,
          updatedAt: new Date().toISOString(),
        },
      ];

      json(res, 200, {
        userMessage,
        aiMessage,
        category: "general",
      });
    });
    return;
  }

  const chatMessageMatch = url.pathname.match(/^\/api\/chats\/([^/]+)$/);
  if (chatMessageMatch && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      const parsed = body ? JSON.parse(body) : {};
      const incomingText = parsed.text || "";
      const resolvedChatId = chatMessageMatch[1];

      const userMessage = toMessage(
        incomingText,
        true,
        resolvedChatId,
        `user-${Date.now()}`,
      );
      const aiMessage = toMessage(
        "Hi there, I can help with that.",
        false,
        resolvedChatId,
        `ai-${Date.now()}`,
      );

      const existingMessages = state.messagesByChatId.get(resolvedChatId) || [];
      state.messagesByChatId.set(resolvedChatId, [
        ...existingMessages,
        userMessage,
        aiMessage,
      ]);
      state.chats = state.chats.some((chat) => chat._id === resolvedChatId)
        ? state.chats.map((chat) =>
            chat._id === resolvedChatId
              ? {
                  ...chat,
                  title: incomingText,
                  updatedAt: new Date().toISOString(),
                }
              : chat,
          )
        : [
            {
              _id: resolvedChatId,
              title: incomingText,
              updatedAt: new Date().toISOString(),
            },
            ...state.chats,
          ];

      json(res, 200, {
        userMessage,
        aiMessage,
        category: "general",
      });
    });
    return;
  }

  const messagesMatch = url.pathname.match(/^\/api\/chats\/([^/]+)\/messages$/);
  if (req.method === "GET" && messagesMatch) {
    const messages = state.messagesByChatId.get(messagesMatch[1]) || [];
    json(res, 200, { messages });
    return;
  }

  json(res, 404, { error: "Not found" });
});

backend.listen(backendPort, "127.0.0.1", () => {
  const frontend = spawn("npm", ["run", "dev"], {
    shell: true,
    stdio: "inherit",
    env: {
      ...process.env,
      API_BASE_URL_SERVER: backendBaseUrl,
      API_BASE_URL: backendBaseUrl,
      NEXT_PUBLIC_API_BASE_URL: backendBaseUrl,
      PORT: String(frontendPort),
    },
  });

  const shutdown = () => {
    frontend.kill("SIGTERM");
    backend.close();
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
  process.on("exit", shutdown);
  frontend.on("exit", (code) => {
    backend.close();
    process.exit(code ?? 0);
  });
});
