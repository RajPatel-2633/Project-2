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
 * Calculates the precise Lahiri Ayanamsha (Chitra Paksha) for a given date.
 * Formula: 22.4601 + (Year - 1900) * 0.01397
 */
const getPreciseAyanamsha = (jsDate) => {
    const year = jsDate.getFullYear();
    const month = jsDate.getMonth() + 1;
    const day = jsDate.getDate();

    // Decimal year calculation
    const decimalYear = year + (month - 1) / 12 + (day - 1) / 365.25;
    return 22.4601 + (decimalYear - 1900) * 0.0139722;
};

/**
 * Determines the Vedic Dignity of a planet based on its sign.
 */
const getVedicDignity = (planetName, sign) => {
    const dignities = {
        Sun: { exalted: "Aries", debilitated: "Libra", own: ["Leo"] },
        Moon: { exalted: "Taurus", debilitated: "Scorpio", own: ["Cancer"] },
        Mars: { exalted: "Capricorn", debilitated: "Cancer", own: ["Aries", "Scorpio"] },
        Mercury: { exalted: "Virgo", debilitated: "Pisces", own: ["Gemini", "Virgo"] },
        Jupiter: { exalted: "Cancer", debilitated: "Capricorn", own: ["Sagittarius", "Pisces"] },
        Venus: { exalted: "Pisces", debilitated: "Virgo", own: ["Taurus", "Libra"] },
        Saturn: { exalted: "Libra", debilitated: "Aries", own: ["Capricorn", "Aquarius"] },
        Rahu: { exalted: "Taurus", debilitated: "Scorpio", own: [] },
        Ketu: { exalted: "Scorpio", debilitated: "Taurus", own: [] }
    };

    const d = dignities[planetName];
    if (!d) return "Neutral";

    if (d.exalted === sign) return "Exalted (Utcha)";
    if (d.debilitated === sign) return "Debilitated (Neecha)";
    if (d.own.includes(sign)) return "Own Sign (Swa-Rashi)";
    return "Neutral";
};

export const calculateVedicChart = (dob, tob, lat, lng) => {
    try {
        const jsDate = new Date(`${dob}T${tob}:00Z`);
        if (isNaN(jsDate.getTime())) throw new Error(`Invalid Date: ${dob}T${tob}`);

        const targetTime = new AstroTime(jsDate);
        const ayanamsha = getPreciseAyanamsha(jsDate);
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

        // --- PLANET CALCULATION ---
        const bodies = [
            { id: Body.Sun, name: "Sun" },
            { id: Body.Moon, name: "Moon" },
            { id: Body.Mars, name: "Mars" },
            { id: Body.Mercury, name: "Mercury" },
            { id: Body.Jupiter, name: "Jupiter" },
            { id: Body.Venus, name: "Venus" },
            { id: Body.Saturn, name: "Saturn" }
        ];

        const processedPlanets = bodies.map(b => {
            const equ = Equator(b.id, targetTime, obs, false, false);
            const ecl = Ecliptic(equ.vec);

            const rawLong = (ecl.elon - ayanamsha + 360) % 360;
            const planet_sign_index = Math.floor(rawLong / 30);
            const currentSign = RASHI_NAMES[planet_sign_index];
            const house = ((planet_sign_index - ascendant_sign_index + 12) % 12) + 1;

            return {
                name: b.name,
                sign: currentSign,
                degree: parseFloat((rawLong % 30).toFixed(2)),
                house: house,
                dignity: getVedicDignity(b.name, currentSign),
                is_retrograde: false
            };
        });

        // --- RAHU & KETU (LUNAR NODES) ---
        // Calculating Rahu as the Ascending Node of the Moon
        const moonEqu = Equator(Body.Moon, targetTime, obs, false, false);
        const moonEcl = Ecliptic(moonEqu.vec);
        // Rahu is traditionally calculated relative to the Moon's orbit, here we use an astronomical approximation
        const rahuRawLong = (moonEcl.elon - ayanamsha + 180 + 360) % 360; // 180 degree offset for approximation
        const ketuRawLong = (rahuRawLong + 180) % 360;

        const rahu_sign_index = Math.floor(rahuRawLong / 30);
        const ketu_sign_index = Math.floor(ketuRawLong / 30);

        processedPlanets.push(
            {
                name: "Rahu",
                sign: RASHI_NAMES[rahu_sign_index],
                degree: parseFloat((rahuRawLong % 30).toFixed(2)),
                house: ((rahu_sign_index - ascendant_sign_index + 12) % 12) + 1,
                dignity: getVedicDignity("Rahu", RASHI_NAMES[rahu_sign_index]),
                is_retrograde: true
            },
            {
                name: "Ketu",
                sign: RASHI_NAMES[ketu_sign_index],
                degree: parseFloat((ketuRawLong % 30).toFixed(2)),
                house: ((ketu_sign_index - ascendant_sign_index + 12) % 12) + 1,
                dignity: getVedicDignity("Ketu", RASHI_NAMES[ketu_sign_index]),
                is_retrograde: true
            }
        );

        // --- NAKSHATRA ---
        const moonLong = (moonEcl.elon - ayanamsha + 360) % 360;
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
                source: "astronomy-engine-sidereal",
                ayanamsha_applied: parseFloat(ayanamsha.toFixed(4)),
                system: "Lahiri / Chitra Paksha"
            }
        };

    } catch (err) {
        console.error(" Astrology Service Error:", err.message);
        throw err;
    }
};