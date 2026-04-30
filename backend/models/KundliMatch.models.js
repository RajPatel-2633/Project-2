import mongoose from "mongoose";
import { Schema } from "mongoose";

const kundliMatchSchema = new mongoose.Schema({
    user_id:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    profile_1_id:{
        type:Schema.Types.ObjectId,
        ref:"BirthProfile",
        required:true
    },
    profile_2_id:{
        type:Schema.Types.ObjectId,
        ref:"BirthProfile",
        required:true
    },
    total_score:{
        type:Number,
        default:0
    },
    // The Ashtakoot Gunas
    varna: { type: Number, default: 0 },   // /1
    vashya: { type: Number, default: 0 },  // /2
    tara: { type: Number, default: 0 },    // /3
    yoni: { type: Number, default: 0 },    // /4
    maitri: { type: Number, default: 0 },  // /5
    gana: { type: Number, default: 0 },    // /6
    bhakoot: { type: Number, default: 0 }, // /7
    nadi: { type: Number, default: 0 },    // /8
    manglik_p1:{
        type:Boolean,
        default:false
    },
    manglik_p2:{
        type:Boolean,
        default:false
    },
    ai_summary:{
        type:String
    }
},{
    timestamps:true
});

const KundliMatch = mongoose.model("KundliMatch",kundliMatchSchema);

export default KundliMatch;