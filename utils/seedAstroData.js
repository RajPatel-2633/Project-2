import  Horoscope  from "../models/Horoscope.model.js";
import  Panchang  from "../models/Panchang.model.js";

export const seedAstroData = async () => {
    const signs = ["aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"];
    
    try {
        console.log("Starting Seed Process");

        for (let i = 0; i < 30; i++) {
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
                            luck: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
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

        console.log("Successfully seeded 30 days of Astro data!");
    } catch (error) {
        console.error(" Seeding failed:", error.message);
    }
};