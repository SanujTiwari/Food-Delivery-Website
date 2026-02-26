import mongoose from "mongoose";

const schema = new mongoose.Schema({
    restaurantId: mongoose.Schema.Types.ObjectId,
    name: String,
    image: String,
    price: Number,
    category: String,
    isAvailable: Boolean
});

export default mongoose.model("Food", schema);