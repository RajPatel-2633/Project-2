import express from "express";
import {authMiddleware} from "../middleware/auth.middleware.js"
import {getTransits,subscribeToTransit,getUserAlerts,unSubscribeAlert} from "../controllers/transit.controllers.js"

const router = express.Router();

router.get("/get-transits",authMiddleware,getTransits);
router.post("/alerts",authMiddleware,subscribeToTransit);
router.get("/get-alert",authMiddleware,getUserAlerts);
router.delete("/alerts/:id",authMiddleware,unSubscribeAlert);

export default router;