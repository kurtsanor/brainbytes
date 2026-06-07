import mongoose from "mongoose";

/**
 * Open the MongoDB connection used by the backend services.
 *
 * @returns A promise that resolves when the connection is established.
 * @throws If MongoDB cannot be reached or the connection fails.
 */
  const connectToDatabase = async (): Promise<void> => {

    console.log("MONGODB_URI =", process.env.MONGODB_URI);
    try {

      if (mongoose.connection.readyState === 1) {
        return;
      }

      await mongoose.connect(
        process.env.MONGODB_URI || "mongodb://mongo:27017/brainbytes",
        {
          serverSelectionTimeoutMS: 5000,
          connectTimeoutMS: 5000,
        }
      );

      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("MongoDB connection error:", error);
      throw error;
    }
  };

  export default connectToDatabase;