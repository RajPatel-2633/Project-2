export const NAKSHATRA_DATA = {
    "Ashwini": { gana: "Deva", nadi: "Aadi", varna: "Kshatriya", lord: "Ketu" },
    "Bharani": { gana: "Manushya", nadi: "Madhya", varna: "Kshatriya", lord: "Venus" },
    "Krittika": { gana: "Rakshasa", nadi: "Antya", varna: "Brahmin", lord: "Sun" },
    "Rohini": { gana: "Manushya", nadi: "Antya", varna: "Brahmin", lord: "Moon" },
    "Mrigashira": { gana: "Deva", nadi: "Madhya", varna: "Brahmin", lord: "Mars" },
    "Ardra": { gana: "Manushya", nadi: "Aadi", varna: "Brahmin", lord: "Rahu" },
    "Punarvasu": { gana: "Deva", nadi: "Aadi", varna: "Vaishya", lord: "Jupiter" },
    "Pushya": { gana: "Deva", nadi: "Madhya", varna: "Kshatriya", lord: "Saturn" },
    "Ashlesha": { gana: "Rakshasa", nadi: "Antya", varna: "Brahmin", lord: "Mercury" },
    "Magha": { gana: "Rakshasa", nadi: "Antya", varna: "Kshatriya", lord: "Ketu" },
    "Purva Phalguni": { gana: "Manushya", nadi: "Madhya", varna: "Brahmin", lord: "Venus" },
    "Uttara Phalguni": { gana: "Manushya", nadi: "Aadi", varna: "Kshatriya", lord: "Sun" },
    "Hasta": { gana: "Deva", nadi: "Aadi", varna: "Vaishya", lord: "Moon" },
    "Chitra": { gana: "Rakshasa", nadi: "Madhya", varna: "Vaishya", lord: "Mars" },
    "Swati": { gana: "Deva", nadi: "Antya", varna: "Vaishya", lord: "Rahu" },
    "Vishakha": { gana: "Rakshasa", nadi: "Antya", varna: "Brahmin", lord: "Jupiter" },
    "Anuradha": { gana: "Deva", nadi: "Madhya", varna: "Shudra", lord: "Saturn" },
    "Jyeshtha": { gana: "Rakshasa", nadi: "Aadi", varna: "Brahmin", lord: "Mercury" },
    "Mula": { gana: "Rakshasa", nadi: "Aadi", varna: "Kshatriya", lord: "Ketu" },
    "Purva Ashadha": { gana: "Manushya", nadi: "Madhya", varna: "Brahmin", lord: "Venus" },
    "Uttara Ashadha": { gana: "Manushya", nadi: "Antya", varna: "Kshatriya", lord: "Sun" },
    "Shravana": { gana: "Deva", nadi: "Antya", varna: "Vaishya", lord: "Moon" },
    "Dhanishta": { gana: "Rakshasa", nadi: "Madhya", varna: "Vaishya", lord: "Mars" },
    "Shatabhisha": { gana: "Rakshasa", nadi: "Aadi", varna: "Brahmin", lord: "Rahu" },
    "Purva Bhadrapada": { gana: "Manushya", nadi: "Aadi", varna: "Brahmin", lord: "Jupiter" },
    "Uttara Bhadrapada": { gana: "Manushya", nadi: "Madhya", varna: "Kshatriya", lord: "Saturn" },
    "Revati": { gana: "Deva", nadi: "Antya", varna: "Brahmin", lord: "Mercury" }
};

const MAITRI_TABLE = {
    "Sun": { "Sun": 5, "Moon": 5, "Mars": 5, "Mercury": 3, "Jupiter": 5, "Venus": 0, "Saturn": 0 },
    "Moon": { "Sun": 5, "Moon": 5, "Mars": 3, "Mercury": 5, "Jupiter": 3, "Venus": 3, "Saturn": 3 },
    "Mars": { "Sun": 5, "Moon": 3, "Mars": 5, "Mercury": 0, "Jupiter": 5, "Venus": 3, "Saturn": 3 },
    "Mercury": { "Sun": 3, "Moon": 0, "Mars": 3, "Mercury": 5, "Jupiter": 3, "Venus": 5, "Saturn": 3 },
    "Jupiter": { "Sun": 5, "Moon": 3, "Mars": 5, "Mercury": 0, "Jupiter": 5, "Venus": 0, "Saturn": 3 },
    "Venus": { "Sun": 0, "Moon": 0, "Mars": 3, "Mercury": 5, "Jupiter": 0, "Venus": 5, "Saturn": 5 },
    "Saturn": { "Sun": 0, "Moon": 0, "Mars": 0, "Mercury": 3, "Jupiter": 3, "Venus": 5, "Saturn": 5 }
};

const RASHI_LORDS = {
    "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
    "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
    "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
};

// --- LOGIC FUNCTIONS ---

/**
 * Ashtakoot Scoring Logic
 */
export const calculateAshtakoot = (p1, p2) => {
    const data1 = NAKSHATRA_DATA[p1.nakshatra];
    const data2 = NAKSHATRA_DATA[p2.nakshatra];

    if (!data1 || !data2) return null;

    let match = {
        varna: 0, vashya: 0, tara: 0, yoni: 0,
        maitri: 0, gana: 0, bhakoot: 0, nadi: 0
    };

    // 1. Nadi (8 Points) - Different Nadis are best
    if (data1.nadi !== data2.nadi) match.nadi = 8;

    // 2. Gana (6 Points)
    if (data1.gana === data2.gana) {
        match.gana = 6;
    } else if ((data1.gana === "Deva" && data2.gana === "Manushya") || (data1.gana === "Manushya" && data2.gana === "Deva")) {
        match.gana = 5;
    } else {
        match.gana = 1;
    }

    // 3. Maitri (5 Points)
    const lord1 = RASHI_LORDS[p1.moon_sign];
    const lord2 = RASHI_LORDS[p2.moon_sign];
    match.maitri = MAITRI_TABLE[lord1][lord2] || 0;

    // 4. Varna (1 Point)
    const varnaWeights = { "Brahmin": 4, "Kshatriya": 3, "Vaishya": 2, "Shudra": 1 };
    if (varnaWeights[data1.varna] >= varnaWeights[data2.varna]) match.varna = 1;

    // (Note: Vashya, Tara, Yoni, Bhakoot are simplified for this implementation)
    match.vashya = (p1.moon_sign === p2.moon_sign) ? 2 : 1;
    match.tara = 3; 
    match.yoni = 4;
    match.bhakoot = 7;

    const total = Object.values(match).reduce((sum, val) => sum + val, 0);

    return { scores: match, total_score: total };
};

/**
 * Manglik Dosha Logic
 */
export const checkManglik = (planets) => {
    if (!planets || !Array.isArray(planets)) return false;

    // Look for Mars in the planetary list
    const mars = planets.find(p => p.name.toLowerCase() === "mars" || p.name.toLowerCase() === "mangal");
    
    if (!mars) return false;

    // Traditional Manglik houses: 1, 2, 4, 7, 8, 12
    const manglikHouses = [1, 2, 4, 7, 8, 12];
    
    // Ensure house is treated as a number
    return manglikHouses.includes(Number(mars.house));
};