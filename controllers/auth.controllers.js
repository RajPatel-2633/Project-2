import jwt from "jsonwebtoken";
import User from "../models/User.models.js";
import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from "../utils/ApiError.utils.js";
import ApiResponse from "../utils/ApiResponse.utils";
import asyncHandler from "../utils/AsyncHandler.utils";
import bcrypt from "bcryptjs";

const registerUser = asyncHandler(async(req,res,next)=>{
    const {name,email,password}=req.body;
    if(!name || !email || !password){
        throw new BadRequestError("All Fields are required");
    }
    const user = await User.findOne({email});
    if(user){
        throw new ConflictError("User Already Exists");
    }
    const newUser = await User.create({name,email,password});

     const userResponse = {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
    };

    return res.status(201).json(new ApiResponse(201,userResponse,"User Registered Successfully"));
});

const loginUser = asyncHandler((req,res,next)=>{
    const {email,password}=req.body;
    if(!email || !password){
        throw new BadRequestError("All Fields are required");
    }
    const user = await User.findUnique({email});
    if(!user){
        throw new NotFoundError("User not found");
    }
    const isMatched = await bcrypt.compare(password,user.password);
    if(!isMatched){
        throw new UnauthorizedError("Incorrect Password");
    }
    // const accessCookieOptions={

    // }
});

const getProfile = asyncHandler((req,res,next)=>{

});

const forgotPassword = asyncHandler((req,res,next)=>{

});

const verifyOTP = asyncHandler((req,res,next)=>{

});

const resetPassword = asyncHandler((req,res,next)=>{

});

const updateProfile =  asyncHandler((req,res,next)=>{

});

const logoutUser = asyncHandler((req,res,next)=>{

});

export {registerUser,loginUser,getProfile,forgotPassword,verifyOTP,resetPassword,updateProfile,logoutUser};