import Horoscope from "../models/Horoscope.models.js";
import Panchang from "../models/Panchang.models.js";
import Transit from "../models/Transit.models.js";
import { generateAllSignsAIHoroscope } from "./aiHoroscope.js";
import { generateAIPanchang } from "./aiPanchang.js";
import { generateAITransits } from "./aiTransits.js";

export const seedAstroData = async (useAI = false) => {
    const signs = ["aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"];
    
    try {
        console.log(`Starting Seed Process (${useAI ? 'AI MODE' : 'STOCHASTIC MODE'})`);

        // If AI mode, we refresh transits too
        if (useAI) {
            const transitSuccess = await generateAITransits();
            if (!transitSuccess) console.warn("⚠️ AI Transit generation failed, using existing ones.");
        }

        for (let i = 0; i < (useAI ? 1 : 30); i++) {
            const d = new Date();
            d.setDate(d.getDate() + i);
            const dateStr = d.toISOString().split('T')[0];

            // 1. Seed Panchang (Check if already exists for this date)
            const existingPanchang = await Panchang.findOne({ date: dateStr });
            if (!existingPanchang) {
                if (useAI) {
                    const panchangSuccess = await generateAIPanchang(dateStr);
                    if (!panchangSuccess) throw new Error(`AI Panchang generation failed for ${dateStr}`);
                } else {
                    // Stochastic but slightly varied Panchang
                    const tithis = ["Shukla Paksha Dashami", "Krishna Paksha Dwitiya", "Shukla Paksha Ashtami", "Purnima"];
                    const nakshatras = ["Rohini", "Ashwini", "Magha", "Pushya", "Revati"];
                    
                    await Panchang.findOneAndUpdate(
                        { date: dateStr },
                        {
                            tithi: tithis[Math.floor(Math.random() * tithis.length)],
                            nakshatra: nakshatras[Math.floor(Math.random() * nakshatras.length)],
                            yoga: "Saubhagya",
                            karana: "Vanija",
                            moon_phase: i % 28 < 14 ? "Waxing" : "Waning",
                            moon_sign: signs[Math.floor(Math.random() * 12)],
                            timings: {
                                sunrise: "06:15 AM",
                                sunset: "06:42 PM",
                                rahu_kaal: { start: "01:30 PM", end: "03:00 PM" },
                                auspicious: { start: "11:45 AM", end: "12:30 PM" }
                            }
                        },
                        { upsert: true }
                    );
                }
            } else {
                console.log(`ℹ️ Panchang already exists for ${dateStr}, skipping.`);
            }

            // 2. Seed Horoscopes (Check if at least one exists for this date)
            const existingHoroscope = await Horoscope.findOne({ date: dateStr });
            if (!existingHoroscope) {
                if (useAI) {
                    const horoscopeSuccess = await generateAllSignsAIHoroscope(dateStr);
                    if (!horoscopeSuccess) throw new Error(`AI Horoscope generation failed for ${dateStr}`);
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
            } else {
                console.log(`ℹ️ Horoscopes already exist for ${dateStr}, skipping.`);
            }
        }

        console.log("Successfully seeded Astro data!");

        // 3. Seed fallback Transits (if not using AI and none exist)
        if (!useAI) {
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
                        description: "Saturn's transit into Pisces brings a period of spiritual reckoning and restructuring of boundaries.",
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
                        description: "The Great Benefic moves into the sign of the Twins, blessing communication.",
                        affects_sign: ["gemini", "aries", "leo", "libra", "aquarius"]
                    }
                ]);
                console.log("Fallback transit data seeded.");
            }
        }

    } catch (error) {
        console.error(" Seeding failed:", error.message);
    }
};