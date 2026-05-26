import "dotenv/config";
import app from "./app.js";
import connectToDatabase from "./config/db.js";
import { initializeAi } from "./services/ai.service.js";

const PORT = process.env.PORT || 3001;

/*
 * Health check and root response for the backend service.
 */
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the BrainBytes API" });
});

/*
 * Connect to MongoDB before accepting traffic.
 */
await connectToDatabase();

/*
 * Warm up the AI client once at startup so requests can reuse it.
 */
initializeAi();

/*
 * Start listening only after dependencies are ready.
 */
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
