import type { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service.js";

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
