import { Body, Equator, Observer, AstroTime } from 'astronomy-engine';

const RASHI_NAMES = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const NAKSHATRAS = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", 
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", 
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", 
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", 
    "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

/**
 * Calculates the Lahiri Ayanamsha for a given year.
 * Vedic astrology is sidereal, so we subtract this offset from tropical coordinates.
 */
const getAyanamsha = (year) => 24.1 + (year - 2024) * 0.013;

export const calculateVedicChart = (dob, tob, lat, lng) => {
    try {
        // 1. Setup Time and Observer
        const jsDate = new Date(`${dob}T${tob}:00Z`);
        if (isNaN(jsDate.getTime())) {
            throw new Error(`Invalid Date: ${dob}T${tob}`);
        }
        
        const targetTime = new AstroTime(jsDate);
        const ayanamsha = getAyanamsha(jsDate.getFullYear());
        
        // Ensure lat/lng are numbers for the observer
        const obs = new Observer(Number(lat), Number(lng), 0);

        const bodies = [
            { id: Body.Sun, name: "Sun" },
            { id: Body.Moon, name: "Moon" },
            { id: Body.Mars, name: "Mars" },
            { id: Body.Mercury, name: "Mercury" },
            { id: Body.Jupiter, name: "Jupiter" },
            { id: Body.Venus, name: "Venus" },
            { id: Body.Saturn, name: "Saturn" }
        ];

        // 2. Calculate Primary Planets
        // We pass 5 arguments to Equator to satisfy the library's VerifyBoolean checks:
        // (body, date, observer, ofdate, aberration)
        const processedPlanets = bodies.map(b => {
            const equ = Equator(b.id, targetTime, obs, false, false);
            
            // Convert Right Ascension (RA) to Degrees and subtract Ayanamsha
            const rawLong = (equ.ra * 15 - ayanamsha + 360) % 360;
            
            return {
                name: b.name,
                sign: RASHI_NAMES[Math.floor(rawLong / 30)],
                degree: parseFloat((rawLong % 30).toFixed(2)),
                house: 1, // Default house for basic rashi chart
                is_retrograde: false 
            };
        });

        // 3. Rahu & Ketu (Shadow Planets)
        // Using Moon's position to derive the Lunar Nodes
        const moonEqu = Equator(Body.Moon, targetTime, obs, false, false);
        const moonLong = (moonEqu.ra * 15 - ayanamsha + 360) % 360;
        
        // Approximate Rahu (Ascending Node)
        const rahuRawLong = (moonLong + 90) % 360; 
        const ketuRawLong = (rahuRawLong + 180) % 360;

        processedPlanets.push(
            {
                name: "Rahu",
                sign: RASHI_NAMES[Math.floor(rahuRawLong / 30)],
                degree: parseFloat((rahuRawLong % 30).toFixed(2)),
                house: 1,
                is_retrograde: true
            },
            {
                name: "Ketu",
                sign: RASHI_NAMES[Math.floor(ketuRawLong / 30)],
                degree: parseFloat((ketuRawLong % 30).toFixed(2)),
                house: 1,
                is_retrograde: true
            }
        );

        // 4. Nakshatra Calculation (Based on Moon's Sidereal Longitude)
        const nakIndex = Math.floor(moonLong / (360 / 27));
        const pada = Math.floor((moonLong % (360 / 27)) / (360 / 108)) + 1;

        return {
            ascendant: "Aries", // Placeholder: requires house system logic
            sun_sign: processedPlanets.find(p => p.name === "Sun").sign,
            moon_sign: processedPlanets.find(p => p.name === "Moon").sign,
            nakshatra: NAKSHATRAS[nakIndex],
            nakshatra_pada: pada,
            planets: processedPlanets,
            raw_data: { 
                source: "astronomy-engine-local", 
                ayanamsha_applied: ayanamsha,
                ts: new Date().toISOString() 
            }
        };

    } catch (err) {
        console.error(" Astrology Service Error:", err.message);
        throw err;
    }
};