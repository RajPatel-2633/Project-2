import Transit from "../models/Transit.models.js";
import TransitAlert from "../models/TransitAlert.models.js";
import ApiResponse from "../utils/ApiResponse.utils.js";
import asyncHandler from "../utils/AsyncHandler.utils.js";

const getTransits = asyncHandler(async(req,res)=>{
    const {sign} = req.query;
    const now = new Date();

    // Query specifically for pure upcoming transits (starting today or later)
    let query = {
        starts_at: { $gte: now }
    };

    if(sign){
        query.affects_sign = sign.toLowerCase();
    }

    const transits = await Transit.find(query).sort({starts_at:1}).limit(9);
    return res.status(200).json(new ApiResponse(200,transits,"Upcoming Transists retrieved"));
});


const subscribeToTransit = asyncHandler(async(req,res)=>{
    const {profile_id,transit_id,notify_via} = req.body;
    const userId = req.user.id;

    const existing = await TransitAlert.findOne({
        user_id:userId,
        profile_id,
        transit_id
    });

    if(existing){
        return res.status(400).json(new ApiResponse(400,null,"Already subscribed for this profile"));
    }

    const alert = await TransitAlert.create({
        user_id:userId,
        profile_id,
        transit_id,
        notify_via
    });

    return res.status(201).json(new ApiResponse(201,alert,"Alert Subscription Active"));
});

const getUserAlerts = asyncHandler(async(req,res)=>{
    const alerts = await TransitAlert.find({user_id:req.user.id})
                                     .populate("transit_id")
                                     .populate("profile_id","name");
    return res.status(200).json(new ApiResponse(200,alerts,"User alert subscription retrieved successfully"));
})

const unSubscribeAlert = asyncHandler(async(req,res)=>{
    const {id} = req.params;

    const deletedAlert = await TransitAlert.findOneAndDelete({
        _id:id,
        user_id:req.user.id
    });

    if(!deletedAlert){
        return res.status(404).json(
            new ApiResponse(404,null,"Alert not found or unauthorised")
        );

        return res.status(200).json(new ApiResponse(200,null,"Successfully unsubsribed from transition alert"))
    }
});

export {getTransits,subscribeToTransit,getUserAlerts,unSubscribeAlert};