import BirthProfile from "../models/BirthProfile.models.js";
import BirthChart from "../models/BirthChart.models.js";
import ChatSession from "../models/ChatSession.models.js";
import ChatMessage from "../models/ChatMessage.models.js";
import { BadRequestError, InternalServerError, NotFoundError } from "../utils/ApiError.utils.js";
import ApiResponse from "../utils/ApiResponse.utils.js"
import asyncHandler from "../utils/AsyncHandler.utils.js";


const createProfile = asyncHandler(async(req,res)=>{
    const {label,name,dob,tob,tob_unknown,birth_city,birth_country,latitude,longitude,timezone,gender,is_primary} = req.body;
    if(!label || !name || !dob || !birth_city || !birth_country || !gender || !latitude || !longitude || !timezone){
        throw new BadRequestError("All Fields are Required");
    }

    if (is_primary) {
            await BirthProfile.updateMany(
                { user_id: req.user.id },
                { is_primary: false }
            );
    }
    const profile  = await BirthProfile.create({
        user_id:req.user.id,
        label,
        name,
        dob,
        tob,
        tob_unknown,
        birth_city,
        birth_country,
        latitude,
        longitude,
        timezone,
        gender,
        is_primary
    });
    if(!profile){
        throw new InternalServerError("Some Error occured while creating profile");
    }
    return res.status(201).json(new ApiResponse(201,profile,"Profile Created Successfully"));
});

const getProfiles = asyncHandler(async(req,res)=>{
    const userId = req.user.id;
    const profiles = await BirthProfile.find({
        user_id:userId
    }).sort({ is_primary: -1, createdAt: -1 });;

    if(!profiles || profiles.length === 0 ){
        return res.status(200).json(
            new ApiResponse(200, [], "No profiles found for this user")
        );
    }
    return res.status(200).json(new ApiResponse(200,profiles,"Profiles Fetched Successfully"));
});

const getProfileById = asyncHandler(async(req,res)=>{
        const {id} = req.params;
        const profile = await BirthProfile.findOne({_id:id, user_id: req.user.id});
        if(!profile){
            throw new NotFoundError("Profile Not Found");
        }
        return res.status(200).json(new ApiResponse(200,profile,"Profile Fetched Successfully"));
});

const updateProfile = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    const userId = req.user.id;
    const {is_primary} = req.body;

    const profile = await BirthProfile.findOne({ _id: id, user_id: userId });

    if (!profile) {
        throw new NotFoundError("Profile not found or unauthorized");
    }

    if (is_primary === true) {
        await BirthProfile.updateMany(
            { user_id: userId, _id: { $ne: id } }, // All user's profiles except this one
            { is_primary: false }
        );
    }
    const updatedProfile = await BirthProfile.findByIdAndUpdate(
        id,
        { $set: req.body }, // Dynamically update only the fields sent in the request
        { new: true, runValidators: true } // Return the updated doc and run schema checks
    );

    return res.status(200).json(
        new ApiResponse(200, updatedProfile, "Profile Updated Successfully")
    );
});

const deleteProfile = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    const userId =  req.user.id;

    const profile = await BirthProfile.findOne({_id:id,user_id:userId});

    if(!profile){
        throw new NotFoundError("Profile Not Found");
    }
    // You cannot delete Primary Profile
    if(profile.is_primary){
        throw new BadRequestError("Cannot Delete your primary profile. Please set another profile as primary first.")
    }
    
    // Cascading Delete:
    // 1. Delete associated BirthChart
    await BirthChart.deleteOne({ profile_id: id });

    // 2. Find and delete associated ChatSessions and their Messages
    const sessions = await ChatSession.find({ profile_id: id });
    const sessionIds = sessions.map(s => s._id);
    
    if (sessionIds.length > 0) {
        await ChatMessage.deleteMany({ session_id: { $in: sessionIds } });
        await ChatSession.deleteMany({ _id: { $in: sessionIds } });
    }

    // 3. Delete the profile itself
    await BirthProfile.findByIdAndDelete(id);

    return res.status(200).json(
        new ApiResponse(200, {}, "Profile and associated data deleted successfully")
    );
});

export {createProfile,getProfiles,getProfileById,updateProfile,deleteProfile};