import axios from "axios";

let accessToken = null;
let tokenExpiry = null;

const getAccessToken = async()=>{
    try {
        const token = await getAccessToken();

        // 1. Precise DateTime formatting
        const dateStr = new Date(dob).toISOString().split('T')[0]; 
        const formattedDateTime = `${dateStr}T${tob}:00+05:30`; 

        // 2. Precise Coordinates (No spaces!)
        const coords = `${lat},${lng}`;

        console.log(`📡 Calling Prokerala: ${formattedDateTime} at ${coords}`);

        const response = await axios.get("https://api.prokerala.com/v2/astrology/planet-position", {
            params: {
                datetime: formattedDateTime,
                coordinates: coords,
                ayanamsha: "lahiri",
                la: "en"
            },
            headers: { Authorization: `Bearer ${token}` }
        });

        return response.data.data;
    } catch (error) {
        console.error("📡 API CALL ERROR:", error.response?.data || error.message);
        throw error;
    }
}

export const fetchVedicChartData = async(dob,lat,lng)=>{
    console.log("reached tll here");
    const token = await getAccessToken();

    // We use the 'planet-position' endpoint for core Vedic math
    const response = await axios.get("https://api.prokerala.com/v2/astrology/planet-position",{
        params:{
            datetime: new Date(dob).toISOString(),
            coordinates:`${lat},${lng}`,
            ayanamsha:"lahiri", // Standard for Vedic
            la:"en"
        },
        headers:{ Authorization: `Bearer ${token}`}
    });

    return response.data.data;
}

