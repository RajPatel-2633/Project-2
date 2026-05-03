import Horoscope from "../models/Horoscope.models.js";
import Panchang from "../models/Panchang.models.js";
import Transit from "../models/Transit.models.js";
import { generateAllSignsAIHoroscope } from "./aiHoroscope.js";

export const seedAstroData = async (useAI = false) => {
    const signs = ["aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"];
    
    try {
        console.log(`Starting Seed Process (${useAI ? 'AI MODE' : 'STOCHASTIC MODE'})`);

        for (let i = 0; i < (useAI ? 1 : 30); i++) {
            const d = new Date();
            d.setDate(d.getDate() + i);
            const dateStr = d.toISOString().split('T')[0];

            // 1. Seed Panchang
            await Panchang.findOneAndUpdate(
                { date: dateStr },
                {
                    tithi: "Shukla Paksha Dashami",
                    nakshatra: "Rohini",
                    yoga: "Saubhagya",
                    karana: "Vanija",
                    moon_phase: "Waxing Gibbous",
                    moon_sign: "Taurus",
                    timings: {
                        sunrise: "06:15 AM",
                        sunset: "06:42 PM",
                        rahu_kaal: { start: "01:30 PM", end: "03:00 PM" },
                        auspicious: { start: "11:45 AM", end: "12:30 PM" }
                    }
                },
                { upsert: true }
            );

            // 2. Seed Horoscopes for all 12 signs
            if (useAI) {
                await generateAllSignsAIHoroscope(dateStr);
            } else {
                const horoscopePromises = signs.map(sign => {
                    return Horoscope.findOneAndUpdate(
                        { sign, date: dateStr },
                        {
                            prediction: {
                                general: `A high-energy day for ${sign}. Focus on your long-term goals.`,
                                love: "Communication is the key to harmony today.",
                                career: "Expect a sudden opportunity from a colleague.",
                                health: "Perfect time for a light evening walk."
                            },
                            scores: {
                                luck: Math.floor(Math.random() * 40) + 60,
                                love: Math.floor(Math.random() * 100),
                                career: Math.floor(Math.random() * 100),
                                health: Math.floor(Math.random() * 100)
                            },
                            lucky_color: "Royal Blue",
                            lucky_number: Math.floor(Math.random() * 9) + 1
                        },
                        { upsert: true }
                    );
                });
                await Promise.all(horoscopePromises);
            }
        }

        console.log("Successfully seeded 30 days of Astro data!");

        // 3. Seed upcoming Transits (skip if already seeded)
        const existingTransits = await Transit.countDocuments();
        if (existingTransits === 0) {
            const now = new Date();
            const future = (days) => { const d = new Date(now); d.setDate(d.getDate() + days); return d; };

            await Transit.insertMany([
                {
                    planet: "Saturn",
                    event_type: "ingress",
                    from_sign: "Aquarius",
                    to_sign: "Pisces",
                    starts_at: future(3),
                    ends_at: future(3 + 900),
                    impact_level: "high",
                    title: "Saturn Enters Pisces",
                    description: "Saturn's transit into Pisces brings a period of spiritual reckoning and restructuring of boundaries. This major shift tests discipline in areas of imagination, compassion, and intuition. Expect significant changes in creative pursuits and spiritual practices over the next 2.5 years.",
                    affects_sign: ["pisces", "gemini", "virgo", "sagittarius"]
                },
                {
                    planet: "Jupiter",
                    event_type: "ingress",
                    from_sign: "Taurus",
                    to_sign: "Gemini",
                    starts_at: future(15),
                    ends_at: future(15 + 365),
                    impact_level: "positive",
                    title: "Jupiter Enters Gemini",
                    description: "The Great Benefic moves into the sign of the Twins, blessing communication, short travel, and intellectual pursuits with optimism and expansion. A highly favorable period for writers, teachers, students, and anyone in commerce.",
                    affects_sign: ["gemini", "aries", "leo", "libra", "aquarius"]
                },
                {
                    planet: "Mars",
                    event_type: "retrograde",
                    from_sign: "Leo",
                    to_sign: "Cancer",
                    starts_at: future(7),
                    ends_at: future(7 + 73),
                    impact_level: "high",
                    title: "Mars Retrograde in Leo",
                    description: "Mars turns retrograde in Leo, creating a powerful internal battle between ambition and ego. The warrior planet's backward motion urges you to review, revise, and reconsider your actions and goals. Avoid starting new major projects during this period.",
                    affects_sign: ["leo", "aries", "scorpio", "capricorn"]
                },
                {
                    planet: "Venus",
                    event_type: "conjunction",
                    from_sign: "Taurus",
                    to_sign: "Taurus",
                    starts_at: future(1),
                    ends_at: future(5),
                    impact_level: "positive",
                    title: "Venus Conjunct Sun",
                    description: "A beautiful alignment between Venus and the Sun in Taurus radiates warmth, beauty, and romantic possibility. This transit illuminates your authentic desires and highlights what you truly value. An excellent window for creative expression and relationship deepening.",
                    affects_sign: ["taurus", "libra", "cancer", "pisces"]
                }
            ]);
            console.log("Transit data seeded successfully!");
        } else {
            console.log(`Skipped transit seeding: ${existingTransits} transits already exist.`);
        }

    } catch (error) {
        console.error(" Seeding failed:", error.message);
    }
};