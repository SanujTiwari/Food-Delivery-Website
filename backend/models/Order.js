import mongoose from "mongoose";

const schema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [
        {
            foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
            name: String,
            image: String,
            price: Number,
            quantity: Number
        }
    ],
    totalAmount: Number,
    deliveryAddress: String,
    paymentMethod: String,
    status: { type: String, default: "Pending" }
}, { timestamps: true });

export default mongoose.model("Order", schema);