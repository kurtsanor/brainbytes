import { Router } from "express";
import * as messageController from "../controllers/message.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authenticate, messageController.findAllMessages);
router.post("/", authenticate, messageController.createMessage);

export default router;
