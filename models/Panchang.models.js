import mongoose from "mongoose";

const panchangSchema = new mongoose.Schema({
    date:{
        type:String,
        required:true,
        unique:true
    },
    tithi:{
        type:String,
        required:true,
    },
    nakshatra: String,
    yoga: String,
    karana: String,
    moon_phase: String,
    moon_sign: String,
    timings: {
        sunrise: String,
        sunset: String,
        rahu_kaal: {
            start: String,
            end: String
        },
        auspicious: {
            start: String,
            end: String
        }
    }
},{
    timestamps:true
});

const Panchang = mongoose.model("Panchang",panchangSchema);

export default Panchang;