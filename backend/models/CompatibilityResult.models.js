import mongoose, { Schema } from "mongoose";

const compatibilitySchema = new Schema({
    sign_1:{
        type:String,
        required:true
    },
    sign_2:{
        type:String,
        required:true
    },
    overall_score:{
        type:Number,
        min:0,
        max:100
    },
    love_score:{
        type:Number,
        min:0,
        max:100
    },
    trust_score:{
        type:Number,
        min:0,
        max:100
    },
    passion_score:{
        type:Number,
        min:0,
        max:100
    },
    friendship_score:{
        type:Number,
        min:0,
        max:100
    },
    longevity_score:{
        type:Number,
        min:0,
        max:100
    },
    summary:{
        type:String
    },
    ai_description:{
        type:String
    }
},{
    timestamps:true
});

compatibilitySchema.index({ sign_1: 1, sign_2: 1 }, { unique: true });
const CompatibilityResult = mongoose.model("CompatibilityResult", compatibilitySchema);

export default CompatibilityResult;