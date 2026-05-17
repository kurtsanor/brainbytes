import express from "express";
import cors from "cors";
import messageRoutes from "./routes/message.route.js";
import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/messages", messageRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/analytics", analyticsRoutes);

// Error handling middleware
app.use(
  (
    error: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error(error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  },
);

export default app;
