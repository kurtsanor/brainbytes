import express from "express";
import cors from "cors";
import messageRoutes from "./routes/message.route.js";
import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import passport from "./config/passport.js";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import {
  register,
  httpRequestsTotal,
  activeUsersGauge,
  mobileRequestsTotal,
  estimatedDataUsageBytes,
  intermittentConnectivityTotal,
} from "./monitoring/metrics.js";

const app = express();

const requestRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many requests, please try again later.",
    });
  },
});

/*
 * Allow the frontend origin to call the API with cookies enabled.
 */
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(requestRateLimiter);
app.use(express.json());

/*
 * Prometheus monitoring middleware.
 * This only records metrics and does not modify existing API behavior.
 */
app.use((req, res, next) => {
  const start = process.hrtime();

  activeUsersGauge.inc();

  const userAgent = req.headers["user-agent"] ?? "";
  if (/mobile|android|iphone|ipad/i.test(String(userAgent))) {
    mobileRequestsTotal.inc();
  }

  res.on("finish", () => {
    const diff = process.hrtime(start);
    const durationSeconds = diff[0] + diff[1] / 1e9;

    const route = req.route?.path ?? req.path;

    httpRequestsTotal.inc({
      method: req.method,
      route,
      status_code: String(res.statusCode),
    });

    const contentLength = Number(res.getHeader("content-length") ?? 0);
    estimatedDataUsageBytes.inc(
      { route },
      Number.isFinite(contentLength) ? contentLength : 0,
    );

    activeUsersGauge.dec();

    if (res.statusCode >= 500 || res.statusCode === 408) {
      intermittentConnectivityTotal.inc();
    }
  });

  next();
});

/*
 * Prometheus metrics endpoint.
 */
app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

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