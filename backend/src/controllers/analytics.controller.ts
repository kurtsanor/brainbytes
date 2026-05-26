import type { Request, Response, NextFunction } from "express";
import * as analyticsService from "../services/analytics.service.js";
import type { JwtClaims } from "../types/auth.types.js";

/**
 * Assemble the dashboard analytics payload for the current user.
 *
 * @param req - Express request containing authenticated user claims and query params.
 * @param res - Express response used to return analytics data.
 * @param next - Express next function used to forward errors.
 * @returns A JSON response containing the user's analytics summary.
 */
export const getUserAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user as JwtClaims;
    const days = req.query.days ? parseInt(String(req.query.days), 10) : 7;
    const analytics = await analyticsService.getUserAnalytics(
      user.userId,
      days,
    );
    res.status(200).json({ data: analytics });
  } catch (error) {
    next(error);
  }
};
