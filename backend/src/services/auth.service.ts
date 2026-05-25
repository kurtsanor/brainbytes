import type { SignUpRequest } from "../types/auth.types.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

export const getUserById = async (userId: string) => {
  try {
    const user = await User.findById(userId).select("-password");
    return user;
  } catch (error) {
    throw error;
  }
};
