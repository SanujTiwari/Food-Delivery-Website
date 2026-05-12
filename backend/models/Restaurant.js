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
    isActive: Boolean,    // Whether the restaurant is currently accepting orders

    // Rich UI Fields
    cuisine: { type: String, default: "Multi-Cuisine" },
    rating: { type: Number, default: 4.5 },
    deliveryTime: { type: Number, default: 30 },
    minOrder: { type: Number, default: 150 }
});

export default mongoose.model("Restaurant", schema);