import mongoose from "mongoose";

const connectToTestDatabase = async (): Promise<void> => {
  const uri = process.env.TEST_MONGODB_URI || "mongodb://localhost:27017/brainbytes_test";

  if (!uri) {
    throw new Error("TEST_MONGODB_URI is not defined");
  }

  console.log("TEST DB =", uri);

  if (mongoose.connection.readyState === 1) return;

  await mongoose.connect(uri);
  console.log("Connected to TEST DB");
};

export default connectToTestDatabase;