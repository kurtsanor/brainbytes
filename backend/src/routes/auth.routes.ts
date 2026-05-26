import { Router } from "express";
import { body } from "express-validator";
import * as authController from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import passport from "passport";

const router = Router();

/*
 * Local account registration.
 */
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

/*
 * Local email and password login.
 */
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),

    body("password").notEmpty().withMessage("Password is required"),
  ],
  authController.signIn,
);

/*
 * Return the authenticated user's profile.
 */
router.get("/me", authenticate, authController.getCurrentUser);

/*
 * Start the Google OAuth flow.
 */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

/*
 * Handle the Google OAuth callback.
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  authController.googleAuthCallback,
);

/*
 * Start the GitHub OAuth flow.
 */
router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
    session: false,
  }),
);

/*
 * Handle the GitHub OAuth callback.
 */
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    session: false,
  }),
  authController.githubAuthCallback,
);

export default router;
