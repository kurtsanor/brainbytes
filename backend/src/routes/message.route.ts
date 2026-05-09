import { Router } from "express";
import * as messageController from "../controllers/message.controller.js";

const router = Router();

router.get("/", messageController.findAllMessages);
router.post("/", messageController.createMessage);

export default router;
