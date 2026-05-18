import { Router } from "express";
import { body } from "express-validator";
import * as messageController from "../controllers/message.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authenticate, messageController.findAllMessages);

router.post(
  "/",
  authenticate,
  [
    body("text")
      .trim()
      .notEmpty()
      .withMessage("Message text is required"),
  ],
  messageController.createMessage,
);

export default router;