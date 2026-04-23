import mongoose from "mongoose";

const horoscopeSchema = new mongoose.Schema({
    sign:{
        type:String,
        required:true,
        lowercase:true,
        enum:["aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"]
    },
    date:{
        type:String,
        required:true
    },
    prediction:{
        general:{ type: String, required: true },
        love: String,
        career: String,
        health: String
    },
    scores:{
        luck:{ type: Number, default: 50 },
        love:{ type: Number, default: 50 },
        career:{ type: Number, default: 50 },
        health:{ type: Number, default: 50 }
    },
    lucky_color: String,
    lucky_number: Number
},{
    timestamps:true
});

const Horoscope = mongoose.model("Horoscope",horoscopeSchema);

export default Horoscope;