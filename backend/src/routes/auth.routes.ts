import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", authController.signUp);
// router.post("/api/auth/login", authController.logIn);

export default router;
