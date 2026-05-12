import { Router } from "express";
import * as messageController from "../controllers/message.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authenticate, messageController.findChatsByUserId);
router.get(
  "/:id/messages",
  authenticate,
  messageController.findMessagesByChatId,
);
router.post("/{:id}", authenticate, messageController.createMessage);

export default router;
