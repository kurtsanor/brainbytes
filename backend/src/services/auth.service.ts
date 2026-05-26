import type { SignUpRequest } from "../types/auth.types.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * Create a new local user account after validating uniqueness and hashing the password.
 *
 * @param signUpRequest - The validated sign-up payload.
 * @returns A promise that resolves when the user has been created.
 * @throws If the email is already in use or the database operation fails.
 */
export const signUp = async (signUpRequest: SignUpRequest) => {
  try {
    const existingUser = await User.findOne({ email: signUpRequest.email });
    if (existingUser) {
      throw new Error("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(signUpRequest.password, 10);

    await User.create({
      firstName: signUpRequest.firstName,
      lastName: signUpRequest.lastName,
      email: signUpRequest.email,
      password: hashedPassword,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Verify credentials and issue a signed JWT for the authenticated user.
 *
 * @param email - The user's email address.
 * @param password - The user's plaintext password.
 * @returns A signed JWT session token.
 * @throws If the credentials are invalid or the database operation fails.
 */
export const signIn = async (email: string, password: string) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or password");
    }
    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }
    return jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch a user profile without exposing the password hash.
 *
 * @param userId - The database identifier of the user.
 * @returns The user record without the password field.
 * @throws If the database lookup fails.
 */
export const getUserById = async (userId: string) => {
  try {
    const user = await User.findById(userId).select("-password");
    return user;
  } catch (error) {
    throw error;
  }
};
