import mongoose from "mongoose";

const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/brainbytes",
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    throw error;
  }
};

export default connectToDatabase;
