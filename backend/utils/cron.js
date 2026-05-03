import cron from "node-cron";
import { seedAstroData } from "./seedAstroData.js";

/**
 * Schedules a daily task at midnight to fetch fresh AI-generated horoscopes.
 */
export const initCronJobs = () => {
    // Schedule: 0 0 * * * (Midnight every day)
    // For testing/dev purposes, we could run it more often, but midnight is standard.
    cron.schedule("0 0 * * *", async () => {
        console.log("🕒 [CRON] Starting daily AI horoscope sync...");
        try {
            await seedAstroData(true); // Run in AI mode
            console.log("✅ [CRON] Daily AI horoscope sync completed.");
        } catch (error) {
            console.error("❌ [CRON] Daily AI horoscope sync failed:", error.message);
        }
    });

    console.log("🚀 [CRON] Daily horoscope scheduler initialized.");
};
