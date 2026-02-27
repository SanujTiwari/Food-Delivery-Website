import mongoose from "mongoose";

/**
 * Food Schema
 * Defines the structure for food items sold by restaurants
 */
const schema = new mongoose.Schema({
    restaurantId: mongoose.Schema.Types.ObjectId, // Reference to the Restaurant that owns this food
    name: String,                                  // Name of the food item
    image: String,                                 // URL or path to the food image
    price: Number,                                 // Price of the item
    category: String,                               // Category (e.g., Burger, Pizza, Dessert)
    isAvailable: Boolean                           // Availability status
});

export default mongoose.model("Food", schema);