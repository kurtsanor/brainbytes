import { Router } from "express";
import { body, param } from "express-validator";
import * as messageController from "../controllers/message.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authenticate, messageController.findChatsByUserId);

router.get(
  "/:id/messages",
  authenticate,
  [
    param("id")
      .notEmpty()
      .withMessage("Chat ID is required"),
  ],
  messageController.findMessagesByChatId,
);

router.post(
  "/:id",
  authenticate,
  [
    param("id")
      .notEmpty()
      .withMessage("Chat ID is required"),

    body("text")
      .trim()
      .notEmpty()
      .withMessage("Message text is required"),
  ],
  messageController.createMessage,
);

export default router;