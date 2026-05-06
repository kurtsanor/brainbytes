import express from "express";
import cors from "cors";
import messageRoutes from "./routes/message.route.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/messages", messageRoutes);

export default app;
