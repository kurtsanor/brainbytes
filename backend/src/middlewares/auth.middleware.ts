import type { NextFunction, Request, Response } from "express";
import type { JwtClaims } from "../types/auth.types.js";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtClaims | string;
    }
  }
}

/**
 * Validate the bearer token on authenticated requests.
 *
 * @param req - Express request containing the Authorization header.
 * @param res - Express response used to return authorization errors.
 * @param next - Express next function used to continue processing.
 * @returns Nothing. Calls next() when the token is valid.
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      res
        .status(401)
        .json({ message: "Authorization header missing or malformed." });
      return;
    }

    const token = header.split(" ")[1]!;

    // Store the verified claims on the request for downstream handlers.
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtClaims;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token has expired or is invalid." });
  }
};
