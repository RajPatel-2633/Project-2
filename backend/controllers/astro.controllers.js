import Horoscope from "../models/Horoscope.models.js";
import Panchang from "../models/Panchang.models.js";
import { ApiError, NotFoundError } from "../utils/ApiError.utils.js";
import ApiResponse from "../utils/ApiResponse.utils.js";
import asyncHandler from "../utils/AsyncHandler.utils.js";
import { seedAstroData } from "../utils/seedAstroData.js";
import { getTodayDate } from "../utils/todaysdate.utils.js";

const getAllHoroscopes = asyncHandler(async(req,res)=>{
    const today = getTodayDate();
    const signs = ["aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"];
    let data = await Horoscope.find({date:today}); 

    // Auto-seed if data is missing or incomplete (less than 12 signs)
    if(!data || data.length < 12){
        console.log(`🕒 [AUTO-SEED] Horoscope incomplete (${data?.length || 0}/12) for today, generating now...`);
        await seedAstroData(true);
        data = await Horoscope.find({date:today});
    }

    if(!data || data.length === 0){
        throw new NotFoundError("Horoscope data could not be retrieved even after auto-seeding.");
    }

    return res.status(200).json(new ApiResponse(200,data,"Daily Horoscopes fetched successfully"));
});

const getHoroscopeBySign = asyncHandler(async(req,res)=>{
    const {sign} = req.params;
    const today = getTodayDate();
    const data = await Horoscope.findOne({
        sign:sign.toLowerCase(),
        date:today
    });

    if(!data){
        throw new NotFoundError(`Horoscope for ${sign} not found`);
    }

    return res.status(200).json(new ApiResponse(200,data,`Horoscope for ${sign} fetched successfully`));
});

const getPanchang = asyncHandler(async(req,res)=>{ 
        const today = getTodayDate();
        let data = await Panchang.findOne({date:today});

        if(!data){
            console.log("🕒 [AUTO-SEED] Panchang missing for today, generating now...");
            await seedAstroData(true);
            data = await Panchang.findOne({date:today});
        }

        if(!data){
            throw new NotFoundError("Panchang Data could not be retrieved even after auto-seeding.");
        }

        return res.status(200).json(new ApiResponse(200,data,"Panchang for Today fetched successfully"));
});



export {getAllHoroscopes,getHoroscopeBySign,getPanchang};