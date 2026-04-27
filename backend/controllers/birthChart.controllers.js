import asyncHandler from "../utils/AsyncHandler.utils.js";
import BirthChart from "../models/BirthChart.models.js";
import ApiResponse from "../utils/ApiResponse.utils.js";
import { NotFoundError } from "../utils/ApiError.utils.js";
import { fetchVedicChartData } from "../services/prokerala.service.js";
import BirthProfile from "../models/BirthProfile.models.js";


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
    console.log("Here");
    if (!profile.location || !profile.location.lat) {
        console.log("Something is missing bro")
}

    const rawData = await fetchVedicChartData(profile.dob,profile.location.lat,profile.location.lng);

    const newChart = await BirthChart.create({
        profile_id,
        sun_sign: rawData.planets.find(p => p.name === "Sun")?.sign || "Unknown",
        moon_sign: rawData.planets.find(p => p.name === "Moon")?.sign || "Unknown",
        ascendant: rawData.ascendant?.sign || "Unknown",
        nakshatra: rawData.moon_nakshatra?.name || "Unknown",
        planets: rawData.planets, // Saving the full array for AI context
        raw_data: rawData // Storing everything for "Credit Insurance"
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