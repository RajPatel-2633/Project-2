import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import errorMiddleware from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.routes.js"
import birthProfileRoutes from "./routes/birthProfile.routes.js"
import astroRoutes from "./routes/astro.routes.js"
import chartRoutes from "./routes/birthChart.routes.js"
import chatRoutes from "./routes/chat.routes.js"
import kundliMatchRoutes from "./routes/kundliMatch.routes.js"
import db from "./utils/db.utils.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8080;

app.use(cors({
    origin:process.env.BASE_URL,
    credentials:true,
    allowedHeaders:["Content-Type","Authorization"],
    methods:["GET","PUT","POST","PATCH","DELETE"]
}));

app.use(express.json());
app.use(cookieParser());

db();
// Write all user defined routes here;
app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/birthProfile",birthProfileRoutes);
app.use("/api/v1/astro",astroRoutes);
app.use("/api/v1/charts",chartRoutes);
app.use("/api/v1/chat",chatRoutes);
app.use("/api/v1/kundliMatch",kundliMatchRoutes);

app.use(errorMiddleware);

app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);
});