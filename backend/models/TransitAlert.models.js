import mongoose from "mongoose";
import { Schema } from "mongoose";

const transitAlertSchema = new Schema({
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
    transit_id:{
        type:Schema.Types.ObjectId,
        ref:"Transit",
        required:true
    },
    notify_via:{
        type:String,
        enum:['push','email','sms'],
        default:'push'
    },
    notified_at:{
        type:Date,
        default:null
    }
},{
    timestamps:{
        createdAt:'created_at',
        updatedAt:false
    }
});

const TransitAlert = mongoose.model("TransitAlert",transitAlertSchema);
export default TransitAlert;