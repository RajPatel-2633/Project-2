import asyncHandler from "../utils/AsyncHandler.utils.js";
import BirthChart from "../models/BirthChart.models.js";
import ApiResponse from "../utils/ApiResponse.utils.js";
import { NotFoundError } from "../utils/ApiError.utils.js";
import {calculateVedicChart} from "../services/astrology.service.js"
import BirthProfile from "../models/BirthProfile.models.js";
import { getGeminiResponse } from "../services/ai.service.js";


const generateChart = asyncHandler(async(req,res)=>{
    const {profile_id} = req.body;

    // Idempotency Check

    const existingChart = await BirthChart.findOne({profile_id});
    if(existingChart){
        return res.status(200).json(new ApiResponse(200,existingChart,"Chart already exists"));
    }

    const profile = await BirthProfile.findById(profile_id);
    if(!profile){
        throw new NotFoundError("Profile Not Found");
    }
    
    const formattedDob = profile.dob.toISOString().split('T')[0];
    
    const chartResults = calculateVedicChart(
        formattedDob, 
        profile.tob, 
        profile.latitude, 
        profile.longitude
    );

    // AI Interpretation Generation
    let interpretations = {};
    try {
        const systemInstruction = `You are an expert Vedic astrologer. Return strictly valid JSON containing your interpretations based on the user's chart. The JSON must exactly match these keys: exalted_planets, strong_placements, weaker_placements, profession, love_life, wealth. Each value should be a 1-2 sentence paragraph. Do NOT include markdown backticks or the word json. Just raw JSON.`;
        
        const userPrompt = `Generate interpretations for: Lagna: ${chartResults.ascendant}. Nakshatra: ${chartResults.nakshatra}. Planets: ${JSON.stringify(chartResults.planets)}`;

        const aiText = await getGeminiResponse(userPrompt, [], systemInstruction);
        
        // Clean backticks just in case
        const cleaned = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
        interpretations = JSON.parse(cleaned);

    } catch (err) {
        console.error("AI Interpretation Error:", err);
        // Fallbacks if AI fails or returns invalid JSON
        interpretations = {
            exalted_planets: "Our cosmic signals are currently faint. Exalted planet readings are unavailable at this moment.",
            strong_placements: "The stars are veiled. Strong placement data could not be generated.",
            weaker_placements: "The celestial interference prevents reading weaker placements right now.",
            profession: "Professional insights are temporarily blocked by cosmic fog. Please try generating again later.",
            love_life: "The threads of fate are currently tangled. Love life readings are unavailable.",
            wealth: "Financial constellations are currently obscured from our view."
        };
    }

    const newChart = await BirthChart.create({
        profile_id,
        sun_sign: chartResults.sun_sign,
        moon_sign: chartResults.moon_sign,
        ascendant: chartResults.ascendant,
        nakshatra: chartResults.nakshatra,
        nakshatra_pada: chartResults.nakshatra_pada,
        planets: chartResults.planets, // This now includes Rahu and Ketu
        raw_data: chartResults.raw_data,
        interpretations
    });

    return res.status(201).json(new ApiResponse(201,newChart,"Chart generated successfully"));
});

const generateChartByProfileId = asyncHandler(async(req,res)=>{
    const {profile_id} = req.params;
    const chart = await BirthChart.findOne({profile_id}).populate("profile_id");
    if(!chart){
        throw new NotFoundError("Chart not generated for this profile yet.");
    }
    return res.status(200).json(new ApiResponse(200,chart,"Birth Chart Retrieved Successfully"));
});

export {generateChart,generateChartByProfileId};