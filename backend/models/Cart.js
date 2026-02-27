import mongoose from "mongoose";

/**
 * Cart Schema
 * Stores items added to a user's shopping cart before checkout
 */
const schema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId, // Owner of the cart
    items: [
        {
            foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food" }, // Reference to the Food item
            quantity: Number // Number of units added
        }
    ],
    totalAmount: Number // Total price of all items in the cart
});

export default mongoose.model("Cart", schema);