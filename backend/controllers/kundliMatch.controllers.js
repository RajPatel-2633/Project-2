import BirthProfile from "../models/BirthProfile.models.js";
import BirthChart from "../models/BirthChart.models.js";
import asyncHandler from "../utils/AsyncHandler.utils.js";
import KundliMatch from "../models/KundliMatch.models.js"
import {getGeminiResponse} from "../services/ai.service.js"
import {calculateVedicChart} from "../services/astrology.service.js"
import {calculateAshtakoot,checkManglik} from "../utils/gunMatch.utils.js"
import ApiResponse from "../utils/ApiResponse.utils.js";
import { NotFoundError } from "../utils/ApiError.utils.js";

const matchProfile = asyncHandler(async(req,res)=>{
    const {person1,person2} = req.body;
    const userId = req.user.id;
    

    const getOrCreateProfileAndChart = async (data) => {
    try {
        let profile = await BirthProfile.findOne({
            user_id: userId,
            name: data.name,
            dob: data.dob,
            tob: data.tob,
            birth_city: data.birth_city
        });

        if (!profile) {
            console.log(` Attempting to create profile for: ${data.name}`);
            
            // LOG THE DATA TO SEE WHAT'S ACTUALLY BEING SENT
            console.log("Payload being sent to DB:", { user_id: userId, ...data });

            profile = await BirthProfile.create({
                user_id: userId, // Fixed: use user_id to match your likely schema
                ...data
            });
            console.log(" Profile created successfully");
        }

        let chart = await BirthChart.findOne({ profile_id: profile._id }).populate("profile_id");

        if (!chart) {
            console.log(` Generating new BirthChart for ${data.name}`);
            // Service is synchronous, so no await needed, but calling it inside a try
            const vedicData = calculateVedicChart(data.dob, data.tob, data.latitude, data.longitude, data.timezone);

            chart = await BirthChart.create({
                profile_id: profile._id,
                ...vedicData
            });
            // Populate after creation too
            chart = await chart.populate("profile_id");
        }
        return chart;

    } catch (error) {
        console.error(" DATABASE ERROR:", error.message);
        if (error.errors) {
            console.error("Validation Details:", Object.keys(error.errors).map(key => `${key}: ${error.errors[key].message}`));
        }
        throw error; 
    }
};
    const chart1 = await getOrCreateProfileAndChart(person1);
    const chart2 = await getOrCreateProfileAndChart(person2);

    const matchResults = calculateAshtakoot(chart1,chart2);

    const isManglik1 = checkManglik(chart1.planets);
    const isManglik2 = checkManglik(chart2.planets);

    const prompt = `
        Analyze Kundli Match:
        Partner 1 (${person1.name}): ${chart1.moon_sign} Moon, ${chart1.nakshatra} Nakshatra, Manglik: ${isManglik1}
        Partner 2 (${person2.name}): ${chart2.moon_sign} Moon, ${chart2.nakshatra} Nakshatra, Manglik: ${isManglik2}
        Score: ${matchResults.total_score}/36.
        Nadi: ${matchResults.scores.nadi}, Gana: ${matchResults.scores.gana}, Bhakoot: ${matchResults.scores.bhakoot}.
        Provide a professional Vedic compatibility narrative.
    `;
    

    let summary = "AI analysis is currently unavailable, but your astrological match scores have been calculated successfully.";
    try {
        summary = await getGeminiResponse(prompt,[],"You are a professional Vedic Jyotish Expert");
    } catch (error) {
        console.error("Gemini API Error during Kundli Match:", error.message);
    }

    const finalMatch = await KundliMatch.create({
        user_id:userId,
        profile_1_id: chart1.profile_id,
        profile_2_id: chart2.profile_id,
        total_score: matchResults.total_score,
        ...matchResults.scores,
        manglik_p1: isManglik1,
        manglik_p2: isManglik2,
        ai_summary: summary
    });

    return res.status(200).json(new ApiResponse(200, { match: finalMatch, chart1, chart2 }, "Match Analysis Successful"));
});

const getMatchHistory = asyncHandler(async(req,res)=>{
    const userId = req.user.id;
    const matches = await KundliMatch.find({user_id:userId})
                    .sort({createdAt:-1})
                    .populate("profile_1_id","name")
                    .populate("profile_2_id","name");
    return res.status(200).json(new ApiResponse(200,matches,"Match History retrieved successfully"));
});

const getMatchDetails = asyncHandler(async(req,res)=>{
    const {id} = req.params;

    const match = await KundliMatch.findById(id)
                    .populate("profile_1_id")
                    .populate("profile_2_id");
    if(!match){
        throw new NotFoundError("Kundli Match Not Found");
    }

    return res.status(200).json(new ApiResponse(200,match,"Match Details Retrieved Successfully"));
});


export{matchProfile,getMatchHistory,getMatchDetails}