import mongoose from "mongoose";

/**
 * Open the MongoDB connection used by the backend services.
 *
 * @returns A promise that resolves when the connection is established.
 * @throws If MongoDB cannot be reached or the connection fails.
 */
const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://mongo:27017/brainbytes",
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    throw error;
  }
};

export default connectToDatabase;
