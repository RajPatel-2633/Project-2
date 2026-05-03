import express from "express";
import {getAllHoroscopes,getHoroscopeBySign,getPanchang} from "../controllers/astro.controllers.js";
import { seedAstroData } from "../utils/seedAstroData.js";

const router = express.Router();

router.get("/seed-db", async (req, res) => {
    try {
        const useAI = req.query.ai === 'true';
        await seedAstroData(useAI);
        res.status(200).send(`Database Seeded Successfully! 🌌 (${useAI ? 'AI Generated' : 'Stochastic'})`);
    } catch (err) {
        res.status(500).send("Seeding failed: " + err.message);
    }
});

router.get('/horoscopes/today',getAllHoroscopes);
router.get('/horoscopes/:sign',getHoroscopeBySign);
router.get('/panchang/today',getPanchang);

export default router;