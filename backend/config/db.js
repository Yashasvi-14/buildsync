import mongoose from "mongoose";

export const connectDB = async () => {
    const uri = process.env.MONGODB_URI;
    if(!uri) throw new Error("MONGO_URI not set");
    try {
        const conn = await mongoose.connect(uri , {

        });
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
        process.exit(1);
    }
};
