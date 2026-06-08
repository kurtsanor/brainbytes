import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer: MongoMemoryServer | null = null;

const connectToTestDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState === 1) return;

  // Spin up the virtual, in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  console.log("TEST DB (In-Memory) =", uri);
  await mongoose.connect(uri);
};

// Export a clean up function to completely stop the server instance
export const disconnectTestDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
};

export default connectToTestDatabase;
