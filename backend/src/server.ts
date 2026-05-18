import "dotenv/config";
import app from "./app.js";
import connectToDatabase from "./config/db.js";
import { initializeAi } from "./services/ai.service.js";

const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the BrainBytes API" });
});

// Establish database connection
await connectToDatabase();

// Initialize AI service
initializeAi();

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
