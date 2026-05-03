import { Body, Equator, Observer, AstroTime, SiderealTime, e_tilt, Ecliptic } from 'astronomy-engine';

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

        // --- ASCENDANT CALCULATION ---
        const LST_hours = SiderealTime(targetTime) + (Number(lng) / 15);
        const LST_deg = (LST_hours % 24) * 15;
        const RAMC = LST_deg * Math.PI / 180;
        const obliq = e_tilt(targetTime).tobl * Math.PI / 180;
        const latRad = Number(lat) * Math.PI / 180;

        const y = Math.cos(RAMC);
        const x = -Math.sin(RAMC) * Math.cos(obliq) - Math.tan(latRad) * Math.sin(obliq);
        let ascendant_tropical = Math.atan2(y, x) * 180 / Math.PI;
        if (ascendant_tropical < 0) ascendant_tropical += 360;

        const ascendant_vedic = (ascendant_tropical - ayanamsha + 360) % 360;
        const ascendant_sign_index = Math.floor(ascendant_vedic / 30);
        const ascendant_sign = RASHI_NAMES[ascendant_sign_index];
        // -----------------------------

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
            const ecl = Ecliptic(equ.vec);
            
            // Subtract Ayanamsha from Tropical Ecliptic Longitude to get Sidereal Longitude
            const rawLong = (ecl.elon - ayanamsha + 360) % 360;
            const planet_sign_index = Math.floor(rawLong / 30);
            const house = ((planet_sign_index - ascendant_sign_index + 12) % 12) + 1;
            
            return {
                name: b.name,
                sign: RASHI_NAMES[planet_sign_index],
                degree: parseFloat((rawLong % 30).toFixed(2)),
                house: house,
                is_retrograde: false 
            };
        });

        // 3. Rahu & Ketu (Shadow Planets)
        // Using Moon's position to derive the Lunar Nodes
        const moonEqu = Equator(Body.Moon, targetTime, obs, false, false);
        const moonEcl = Ecliptic(moonEqu.vec);
        const moonLong = (moonEcl.elon - ayanamsha + 360) % 360;
        
        // Approximate Rahu (Ascending Node)
        const rahuRawLong = (moonLong + 90) % 360; 
        const ketuRawLong = (rahuRawLong + 180) % 360;

        const rahu_sign_index = Math.floor(rahuRawLong / 30);
        const ketu_sign_index = Math.floor(ketuRawLong / 30);
        const rahu_house = ((rahu_sign_index - ascendant_sign_index + 12) % 12) + 1;
        const ketu_house = ((ketu_sign_index - ascendant_sign_index + 12) % 12) + 1;

        processedPlanets.push(
            {
                name: "Rahu",
                sign: RASHI_NAMES[rahu_sign_index],
                degree: parseFloat((rahuRawLong % 30).toFixed(2)),
                house: rahu_house,
                is_retrograde: true
            },
            {
                name: "Ketu",
                sign: RASHI_NAMES[ketu_sign_index],
                degree: parseFloat((ketuRawLong % 30).toFixed(2)),
                house: ketu_house,
                is_retrograde: true
            }
        );

        // 4. Nakshatra Calculation (Based on Moon's Sidereal Longitude)
        const nakIndex = Math.floor(moonLong / (360 / 27));
        const pada = Math.floor((moonLong % (360 / 27)) / (360 / 108)) + 1;

        return {
            ascendant: ascendant_sign,
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