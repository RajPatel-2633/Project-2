import mongoose from "mongoose";
import { Schema } from "mongoose";

const chatSessionSchema = new Schema({
    user_id:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    profile_id:{
        type:Schema.Types.ObjectId,
        ref:"BirthProfile",
        required:true
    },
    title:{
        type:String,
        default:'New Consultation',
        trim:true
    },
    isActive:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true 
});

const ChatSession= mongoose.model("ChatSession",chatSessionSchema);

export default ChatSession;