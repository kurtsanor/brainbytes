import { Router } from "express";
import * as messageService from "../controllers/message.controller.js";

const router = Router();

router.get("/", messageService.findAllMessages);
router.post("/", messageService.createMessage);

export default router;
