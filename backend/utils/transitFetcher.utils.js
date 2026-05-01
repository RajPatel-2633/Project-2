import Transit from "../models/Transit.models.js";
import { getGeminiResponse } from "../services/ai.service.js";

export const runTransitAI = async(targetMonth = "")=>{
    const month = targetMonth || new Date().toLocaleString('default', { month: 'long' });
    const year = new Date().getFullYear();

    console.log(`Starting AI Transit Sync for ${month} ${year}...`);
    const prompt = `
        Act as a professional Vedic Astrologer and Astronomical Data Provider. 
        Generate a list of 5-8 major planetary transits (Ingress, Retrograde, or Full Moons) for ${month} ${year}.
        
        Return ONLY a JSON array of objects with these keys:
        - planet: string (e.g., 'Saturn')
        - event_type: string (ingress/retrograde/trine/fullmoon)
        - from_sign: string (lowercase zodiac sign)
        - to_sign: string (lowercase zodiac sign)
        - starts_at: ISO 8601 date string
        - impact_level: string (high/medium/low/positive)
        - title: string (short catchy title)
        - description: string (2-sentence astrological meaning)
        - affects_signs: string[] (array of 2-4 affected zodiac signs)

        Ensure the dates are accurate for ${month} ${year}. Start response with '[' and end with ']'.
    `;
    try{
        const aiRaw = await getGeminiResponse(prompt,[],"You are a precise data generator. Output raw JSON only");
        const jsonMatch = aiRaw.match(/\[[\s\S]*\]/);

        if(!jsonMatch){
            throw new Error("AI failed to provide a valid JSON array");
        }

        const transits = JSON.parse(jsonMatch[0]);

        const operations = transits.map(t=> ({
            updateOne: {
                filter: { title: t.title, starts_at: new Date(t.starts_at) },
                update: { $set: t },
                upsert: true
            }
        }));
        const result = await Transit.bulkWrite(operations);
        console.log(`${month} Sync Complete: ${result.upsertedCount} new records, ${result.modifiedCount} updated.`);
        return transits;
    } catch(err){
        console.error("runTransitAI Error:", err.message);
        throw err;
    }
}