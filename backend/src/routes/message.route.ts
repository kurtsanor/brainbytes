import { Router } from "express";
import { body } from "express-validator";
import * as messageController from "../controllers/message.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

/*
 * Return all messages visible to the current user.
 */
// router.get("/", authenticate, messageController.findAllMessages);

/*
 * Create a new message in the current chat session.
 */
router.post(
  "/",
  authenticate,
  [body("text").trim().notEmpty().withMessage("Message text is required")],
  messageController.createMessage,
);

export default router;
