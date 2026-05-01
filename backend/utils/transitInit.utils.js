import cron from "node-cron";
import { runTransitAI } from "./transitFetcher.utils.js";
import Transit from "../models/Transit.models.js";

export const initialiseTransitAutomation = async()=>{
    try{
        const currentMonth = new Date().getMonth();
        const year = new Date().getFullYear();

        const count = await Transit.countDocuments({
            starts_at: { 
                $gte: new Date(year, currentMonth, 1),
                $lt: new Date(year, currentMonth + 1, 1)
            }
        });

        if(count === 0 ){
            console.log("No transits found for this month. Initializing via AI..");
            await runTransitAI();
        } else {
            console.log("Transits for this month already present in DB.");
        }

        cron.schedule("0 0 1 * *", async () => {
            console.log("Monthly Cron: Syncing new transits...");
            await runTransitAI();
            console.log("Finished");
        },{
            schedule:true,
            timezone:"Asia/Kolkata"
        });
    }catch(err){
        console.error("Transit Alert Failed", err.message);
    }
}