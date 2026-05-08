import { getGeminiResponse } from "../services/ai.service.js";
import Horoscope from "../models/Horoscope.models.js";
import { extractJson } from "./json.utils.js";

/**
 * Generates professional Vedic horoscopes for ALL 12 signs in a single AI call.
 */
export const generateAllSignsAIHoroscope = async (dateStr) => {
    const signs = ["aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"];
    
    const prompt = `
        Generate a professional DAILY Vedic horoscope (Rashifal) for ALL 12 zodiac signs for the specific date: ${dateStr}.
        
        CRITICAL INSTRUCTIONS:
        1. Predictions must be for this specific DAY only, NOT for the year or month.
        2. The "scores" (luck, love, career, health) MUST accurately reflect the sentiment of the "prediction" texts. 
           - High scores (80+) = Very positive text.
           - Low scores (<40) = Challenging/Warning text.
        3. Predictions should be professional, insightful, and use Vedic Astrology terminology.
        
        Return ONLY a JSON object with this structure:
        {
            "horoscopes": [
                {
                    "sign": "aries",
                    "prediction": { "general": "...", "love": "...", "career": "...", "health": "..." },
                    "scores": { "luck": 85, "love": 70, "career": 90, "health": 60 },
                    "lucky_color": "...",
                    "lucky_number": 7
                },
                ... (repeat for all 12 signs)
            ]
        }
    `;

    try {
        const aiResponse = await getGeminiResponse(prompt, [], "You are a professional Vedic Jyotish Expert. Return only valid JSON.");
        if (!aiResponse) return null;

        const data = extractJson(aiResponse);
        
        // Handle both { "horoscopes": [...] } and directly [...]
        const horoscopesList = Array.isArray(data) ? data : (data.horoscopes || data.horoscope);
        
        if (!horoscopesList || !Array.isArray(horoscopesList)) {
            console.error("❌ Invalid AI Horoscope Data Structure:", data);
            throw new Error("AI failed to provide a valid horoscopes array.");
        }

        const results = [];
        for (const h of horoscopesList) {
            const updated = await Horoscope.findOneAndUpdate(
                { sign: h.sign.toLowerCase(), date: dateStr },
                {
                    prediction: h.prediction,
                    scores: h.scores,
                    lucky_color: h.lucky_color,
                    lucky_number: h.lucky_number,
                    is_ai: true
                },
                { upsert: true, new: true }
            );
            results.push(updated);
        }

        console.log(`✅ All 12 AI Horoscopes generated for ${dateStr}`);
        return results;
    } catch (error) {
        console.error(`❌ AI Generation for all signs failed:`, error.message);
        return null;
    }
};
