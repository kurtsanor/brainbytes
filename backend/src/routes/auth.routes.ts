import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", authController.signUp);
router.post("/login", authController.signIn);
router.get("/me", authenticate, authController.getCurrentUser);

export default router;
