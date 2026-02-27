import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Attempt connection with a 5s timeout
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("MongoDB Connected Successfully");
    } catch (err) {
        
        console.error("MongoDB Connection Failed:", err.message);
        //server.js can handle failed startup
        throw err;
    }
};

export default connectDB;