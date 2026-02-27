import mongoose from "mongoose";

/**
 * Restaurant Schema
 * Defines the profile of a restaurant selling food on the platform
 */
const schema = new mongoose.Schema({
    name: String,        // Business name
    image: String,       // Profile/Logo image
    description: String, // About the restaurant
    address: String,     // Physical location
    isActive: Boolean    // Whether the restaurant is currently accepting orders
});

export default mongoose.model("Restaurant", schema);