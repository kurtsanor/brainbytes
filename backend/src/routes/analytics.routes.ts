import { Router } from "express";
import * as analyticsController from "../controllers/analytics.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

/*
 * Return analytics for the authenticated user.
 */
router.get("/", authenticate, analyticsController.getUserAnalytics);

export default router;
