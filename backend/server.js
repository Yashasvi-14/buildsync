import express from "express";
import http from 'http';
import { Server } from 'socket.io';

import dotenv from "dotenv";
dotenv.config();
import connectCloudinary from "./config/cloudinaryConfig.js";
connectCloudinary();

import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import testRoutes from "./routes/testRoutes.js";
import { notFound,errorHandler } from "./middleware/errorMiddleware.js";
import userRoutes from './routes/userRoutes.js';
import buildingRoutes from './routes/buildingRoutes.js';
import mainComplaintRoutes from './routes/mainComplaintRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';


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

app.use('/api/complaints', mainComplaintRoutes);

app.use('/api/admin', adminRoutes);

app.use('/api/payments', paymentRoutes);

app.use(notFound);
app.use(errorHandler);

const httpServer = http.createServer(app);

const io = new Server( httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

app.set('socketio', io);

io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

const PORT=process.env.PORT || 5000;

const start = async () => {
    await connectDB();
    httpServer.listen(PORT, () => {
        console.log(`Server listening on http://localhost:${PORT}`);
    });
};

start();

