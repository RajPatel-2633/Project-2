import mongoose from "mongoose";

const { Schema } = mongoose;

const birthChartSchema = new mongoose.Schema({
    profile_id:{
        type: Schema.Types.ObjectId,
        ref:"BirthProfile",
        required:true,
    },
    ascendant:String,
    sun_sign:String,
    moon_sign:String,
    nakshatra:String,
    nakshatra_pada:Number,
    planets: [
        {
            name: String,      
            sign: String,
            degree: Number,
            house: Number,
            is_retrograde: Boolean
        }
    ],
    raw_data:Object,
},{
    timestamps:true
});

birthChartSchema.index({ profile_id: 1 }, { unique: true });
// This ensures that one profile only has one Vedic Chart

const BirthChart = mongoose.model("BirthChart",birthChartSchema);

export default BirthChart;