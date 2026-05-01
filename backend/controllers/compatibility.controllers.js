import asyncHandler from "../utils/AsyncHandler.utils.js";
import { normalizeSigns } from "../utils/helper.utils.js";
import { getGeminiResponse } from "../services/ai.service.js";
import CompatibilityResult from "../models/CompatibilityResult.models.js"
import ApiResponse from "../utils/ApiResponse.utils.js"

const getCompatibility = asyncHandler(async(req,res)=>{
    
    const {sign1,sign2} = req.params;
    const {sign_1,sign_2} = normalizeSigns(sign1,sign2);
    
    let compatibility = await CompatibilityResult.findOne({sign_1,sign_2});
    

    if(compatibility){
        return res.status(200).json(new ApiResponse(200,compatibility,"Compatibility retrieved from cache"));
    }

    const prompt = `
        Analyze the zodiac compatibility between ${sign_1} and ${sign_2}.
        Return ONLY a JSON object with the following keys:
        overall_score, love_score, trust_score, passion_score, friendship_score, longevity_score (all 0-100),
        summary (max 100 characters), and ai_description (detailed analysis).
    `;
    

    const aiRaw = await getGeminiResponse(prompt, [], "You are a professional astrologer. Response must be valid JSON.");
    

    let aiData;
    try {
        const jsonMatch = aiRaw.match(/\{[\s\S]*\}/);
        aiData = JSON.parse(jsonMatch[0]);
    } catch (error) {
        throw new Error("AI failed to return valid JSON format");
    }
    

    compatibility = await CompatibilityResult.create({
        sign_1,
        sign_2,
        ...aiData
    });

    return res.status(200).json(new ApiResponse(200,compatibility,"New Compatibility Analysis Generated"));
})


export {getCompatibility};