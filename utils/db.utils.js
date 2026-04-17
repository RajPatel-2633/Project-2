import mongoose from "mongoose";

const db = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to Database");
    }catch(err){
        console.error("error connecting to Database");
        process.exit(1);
    }
}

export default db;