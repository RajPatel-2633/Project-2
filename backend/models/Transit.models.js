import mongoose from "mongoose";

const transitSchema = new mongoose.Schema({
    planet:{
        type:String,
        required:true
    },
    event_type:{
        type:String,
        enum:['ingress','retrograde', 'trine', 'fullmoon', 'conjunction'],
        required:true
    },
    from_sign:{
        type:String
    },
    to_sign:{
        type:String
    },
    starts_at:{
        type:Date,
        required:true
    },
    ends_at:{
        type:String
    },
    impact_level:{
        type:String,
        enum:['high','medium','low','positive'],
        default:'medium'
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    affects_sign:[{
        type:String
    }],
},{
    timestamps:true
});

const Transit = mongoose.model("Transit",transitSchema);
export default Transit;