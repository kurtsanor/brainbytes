import type { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service.js";
import jwt from "jsonwebtoken";
import type { JwtClaims } from "../types/auth.types.js";

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const request = req.body;

    await authService.signUp(request);

    res.status(201).json({ response: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const request = req.body;

    const response = await authService.signIn(request.email, request.password);

    res.status(200).json({ response });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const currentUser = req.user as JwtClaims;
    const user = await authService.getUserById(currentUser.userId);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const googleAuthCallback = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user as { _id: string } | undefined;

    if (!user?._id) {
      throw new Error("Google authentication failed");
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" },
    );

    res.cookie("session-token", token, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res.redirect(`${process.env.FRONTEND_URL}/chat`);
  } catch (error) {
    next(error);
  }
};

export const githubAuthCallback = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user as { _id: string } | undefined;

    if (!user?._id) {
      throw new Error("GitHub authentication failed");
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" },
    );

    res.cookie("session-token", token, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res.redirect(`${process.env.FRONTEND_URL}/chat`);
  } catch (error) {
    next(error);
  }
};


