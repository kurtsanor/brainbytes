import { Router } from "express";
import { body, param } from "express-validator";
import * as messageController from "../controllers/message.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

/*
 * Return the current user's chat list.
 */
router.get("/", authenticate, messageController.findChatsByUserId);

/*
 * Return the messages for a specific chat.
 */
router.get(
  "/:id/messages",
  authenticate,
  [param("id").notEmpty().withMessage("Chat ID is required")],
  messageController.findMessagesByChatId,
);

/*
 * Create a message inside a chat by id.
 */
router.post(
  "/{:id}",
  authenticate,
  [body("text").trim().notEmpty().withMessage("Message text is required")],
  messageController.createMessage,
);

export default router;
