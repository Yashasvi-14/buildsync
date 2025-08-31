import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import testRoutes from "./routes/testRoutes.js";
import { notFound,errorHandler } from "./middleware/errorMiddleware.js";
import userRoutes from './routes/userRoutes.js';
import buildingRoutes from './routes/buildingRoutes.js';


dotenv.config();

const app=express();

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.get("/api/ping" , (req,res)=>{
    res.json({ success: true, message: "pong"});
});

app.use("/api", testRoutes);

app.use('/api/users', userRoutes);
app.use('/api/buildings', buildingRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT=process.env.PORT || 5000;

const start = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server listening on http://localhost:${PORT}`);
    });
};

start();

