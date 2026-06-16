import type { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service.js";
import jwt from "jsonwebtoken";
import type { JwtClaims } from "../types/auth.types.js";

/**
 * Create a local account using the validated sign-up payload.
 *
 * @param req - Express request containing the sign-up body.
 * @param res - Express response used to return the result.
 * @param next - Express next function used to forward errors.
 * @returns A JSON response confirming account creation.
 */
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

/**
 * Authenticate a user with email and password and return a session token.
 *
 * @param req - Express request containing the login payload.
 * @param res - Express response used to return the token.
 * @param next - Express next function used to forward errors.
 * @returns A JSON response containing the issued session token.
 */
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

/**
 * Resolve the authenticated user's profile from the JWT claims.
 *
 * @param req - Express request containing authenticated user claims.
 * @param res - Express response used to return the user profile.
 * @param next - Express next function used to forward errors.
 * @returns A JSON response containing the current user record.
 */
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

/**
 * Finalize Google OAuth by issuing an application token and redirecting back to the frontend.
 *
 * @param req - Express request populated by Passport with the authenticated user.
 * @param res - Express response used to set the session cookie and redirect.
 * @param next - Express next function used to forward errors.
 * @returns A redirect response to the frontend OAuth landing page.
 */
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

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    return res.redirect(
      `${process.env.FRONTEND_URL}/oauth?token=${encodeURIComponent(token)}`,
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Finalize GitHub OAuth by issuing an application token and redirecting back to the frontend.
 *
 * @param req - Express request populated by Passport with the authenticated user.
 * @param res - Express response used to set the session cookie and redirect.
 * @param next - Express next function used to forward errors.
 * @returns A redirect response to the frontend OAuth landing page.
 */
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

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    return res.redirect(
      `${process.env.FRONTEND_URL}/oauth?token=${encodeURIComponent(token)}`,
    );
  } catch (error) {
    next(error);
  }
};
