// Set up DNS servers to resolve connection issues (often helpful for MongoDB connectivity)
import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// Import core backend dependencies
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import compression from "compression";

// Import API routes for different features
import authRoutes from "./routes/authRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();

// Apply global middleware
app.use(compression()); // Compress response bodies for better performance

// enable CORS; allow the frontend URL from env or default to all origins.
// when deploying, set FRONTEND_URL in Render to your Vercel site (e.g. https://food-delivery-website-tawny-three.vercel.app)
const corsOptions = {
    origin: process.env.FRONTEND_URL || true,
    credentials: true,
};
app.use(cors(corsOptions));        // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Middleware to parse JSON data in request bodies

// Mount API routes to specific endpoints
app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Global Error Handler Middleware
// This catches any errors that occur during request processing
app.use((err, req, res, next) => {
    console.error("Server Error:", err.stack);
    res.status(err.status || 500).json({
        msg: err.message || "Something went wrong on the server"
    });
});

// Function to connect to DB and start the server
const startServer = async () => {
    try {
        // Connect to MongoDB using Mongoose config
        await connectDB();

        // Define port (use env variable or default to 5000)
        const PORT = process.env.PORT || 5000;

        // Start listening for incoming requests
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        // Log error if server fails to start
        console.error("Failed to start server:", err);
    }
};

// Execute the server startup
startServer();