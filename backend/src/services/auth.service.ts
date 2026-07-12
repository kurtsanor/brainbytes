import type { SignUpRequest } from "../types/auth.types.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { dbQueryDuration } from "../monitoring/metrics.js";

/**
 * Create a new local user account after validating uniqueness and hashing the password.
 *
 * @param signUpRequest - The validated sign-up payload.
 * @returns A promise that resolves when the user has been created.
 */
export const signUp = async (signUpRequest: SignUpRequest) => {
  // Check if email already exists
  const endFind = dbQueryDuration.startTimer();

  let existingUser;
  try {
    existingUser = await User.findOne({ email: signUpRequest.email });
  } finally {
    endFind({
      operation: "findOne",
      collection: "users",
    });
  }

  if (existingUser) {
    throw new Error("Email already in use");
  }

  const hashedPassword = await bcrypt.hash(signUpRequest.password, 10);

  // Create user
  const endInsert = dbQueryDuration.startTimer();

  try {
    await User.create({
      firstName: signUpRequest.firstName,
      lastName: signUpRequest.lastName,
      email: signUpRequest.email,
      password: hashedPassword,
    });
  } finally {
    endInsert({
      operation: "insert",
      collection: "users",
    });
  }
};

/**
 * Verify credentials and issue a signed JWT for the authenticated user.
 *
 * @param email - The user's email address.
 * @param password - The user's plaintext password.
 * @returns A signed JWT session token.
 */
export const signIn = async (email: string, password: string) => {
  const endFind = dbQueryDuration.startTimer();

  let user;
  try {
    user = await User.findOne({ email });
  } finally {
    endFind({
      operation: "findOne",
      collection: "users",
    });
  }

  if (!user) {
    let error: any = new Error("Invalid email or password");
    error.status = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password!);

  if (!isMatch) {
    let error: any = new Error("Invalid email or password");
    error.status = 401;
    throw error;
  }

  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });
};

/**
 * Fetch a user profile without exposing the password hash.
 *
 * @param userId - The database identifier of the user.
 * @returns The user record without the password field.
 */
export const getUserById = async (userId: string) => {
  const end = dbQueryDuration.startTimer();

  try {
    return await User.findById(userId).select("-password");
  } finally {
    end({
      operation: "findById",
      collection: "users",
    });
  }
};
