import express from "express"
import { authMiddleware } from "../middleware/auth.middleware.js";
import {getCompatibility} from "../controllers/compatibility.controllers.js"

const router = express.Router();

router.get("/get-compatibility/:sign1/:sign2",authMiddleware,getCompatibility);

export default router;