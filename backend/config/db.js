import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        });
        console.log("MongoDB Connected Successfully");
    } catch (err) {
        console.error("MongoDB Connection Failed:", err.message);
        // Do not exit process here so server.js catch block handles it
        throw err;
    }
};

export default connectDB;