import { Router } from "express";
import { body } from "express-validator";
import * as authController from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/register",
  [
    body("firstName").trim().notEmpty().withMessage("First name is required"),

    body("lastName").trim().notEmpty().withMessage("Last name is required"),

    body("email").isEmail().withMessage("Valid email is required"),

    body("password")
      .isLength({ min: 3 })
      .withMessage("Password must be at least 3 characters"),
  ],
  authController.signUp,
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),

    body("password").notEmpty().withMessage("Password is required"),
  ],
  authController.signIn,
);

router.get("/me", authenticate, authController.getCurrentUser);

export default router;
