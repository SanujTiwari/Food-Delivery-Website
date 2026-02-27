import mongoose from "mongoose";

/**
 * Order Schema
 * Records checkout information, items purchased, and delivery status
 */
const schema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Customer who placed the order
    items: [
        {
            foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food" }, // Reference to food item
            name: String,      // Name at time of purchase
            image: String,     // Image at time of purchase
            price: Number,     // Price at time of purchase
            quantity: Number   // Amount ordered
        }
    ],
    totalAmount: Number,       // Final total price
    deliveryAddress: String,   // Where to deliver
    paymentMethod: String,     // e.g., COD, Stripe
    status: { type: String, default: "Pending" } // Order status (Pending, Out for Delivery, Delivered)
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

export default mongoose.model("Order", schema);