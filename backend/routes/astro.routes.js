import express from "express";
import {getAllHoroscopes,getHoroscopeBySign,getPanchang} from "../controllers/astro.controllers.js";
import { seedAstroData } from "../utils/seedAstroData.js";
import Horoscope from "../models/Horoscope.models.js";

const router = express.Router();

router.get("/seed-db", async (req, res) => {
    try {
        const useAI = req.query.ai === 'true';
        const force = req.query.force === 'true';

        if (force) {
            console.log("🔥 [FORCE] Clearing existing horoscopes for today...");
            const today = new Date().toISOString().split('T')[0];
            await Horoscope.deleteMany({ date: today });
        }

        await seedAstroData(useAI);
        res.status(200).send(`Database Seeded Successfully! 🌌 (${useAI ? 'AI Generated' : 'Stochastic'}) ${force ? '[FORCED]' : ''}`);
    } catch (err) {
        console.error("Seeding failed:", err.message);
        res.status(500).json({ success: false, message: "Seeding failed: " + err.message });
    }
});

router.get('/horoscopes/today',getAllHoroscopes);
router.get('/horoscopes/:sign',getHoroscopeBySign);
router.get('/panchang/today',getPanchang);

export default router;