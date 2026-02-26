import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    address: String,
    isActive: Boolean
});

export default mongoose.model("Restaurant", schema);