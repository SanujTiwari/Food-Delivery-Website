import mongoose from "mongoose";

const schema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    items: [
        {
            foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
            quantity: Number
        }
    ],
    totalAmount: Number
});

export default mongoose.model("Cart", schema);