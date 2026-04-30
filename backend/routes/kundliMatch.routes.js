import express from "express";
import {authMiddleware} from "../middleware/auth.middleware.js";
import {matchProfile,getMatchHistory,getMatchDetails} from "../controllers/kundliMatch.controllers.js";

const router = express.Router();

router.post("/match",authMiddleware,matchProfile);
router.get("/matches",authMiddleware,getMatchHistory);
router.get("/match/:id",authMiddleware,getMatchDetails);

export default router;