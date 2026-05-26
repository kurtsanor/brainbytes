import express from "express";
import cors from "cors";
import messageRoutes from "./routes/message.route.js";
import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import passport from "./config/passport.js";
import cookieParser from "cookie-parser";

const app = express();

/*
 * Allow the frontend origin to call the API with cookies enabled.
 */
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());

app.use(cookieParser());
/*
 * Passport is used for OAuth-based sign-in flows.
 */
app.use(passport.initialize());

/*
 * Mount the API routers by domain area.
 */
app.use("/api/messages", messageRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/analytics", analyticsRoutes);

/*
 * Centralized error handler keeps API responses consistent.
 */
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
