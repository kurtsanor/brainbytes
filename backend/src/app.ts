import express from "express";
import cors from "cors";
import messageRoutes from "./routes/message.route.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/messages", messageRoutes);
app.use("/api/auth", authRoutes);

// Error handling middleware
app.use(
  (
    error: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error(error);
    res.status(500).json({ error: "An internal server error occurred." });
  },
);

export default app;
