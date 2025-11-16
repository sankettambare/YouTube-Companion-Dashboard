import express from "express";

import cors from "cors";

import dotenv from "dotenv";

import {requestLogger} from "./middleware/logger.js";
import healthRoutes from "./routes/healthRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";

dotenv.config();

const app = express();
const PORT  = process.env.PORT || 5000;

app.use (
    cors({
        origin:process.env.FRONTEND_ORIGIN || "*"
    })
);

app.use(express.json());
app.use(requestLogger);

app.use("/api",healthRoutes);
app.use("/api",videoRoutes);
app.use("/api",commentRoutes);
app.use("/api",noteRoutes);


app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})