import express from "express";
import {initialiseChat,sendMessage,getUserSessions,getChatHistory} from "../controllers/chat.controllers.js"
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/initialise-chat",authMiddleware,initialiseChat);
router.post("/send-message/:sessionId",authMiddleware,sendMessage);
router.get("/sessions", authMiddleware, getUserSessions);
router.get("/messages/:sessionId", authMiddleware, getChatHistory);



export default router;