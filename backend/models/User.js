import mongoose from "mongoose";

/**
 * User Schema
 * Defines the structure for user accounts in the database
 */
const userSchema = new mongoose.Schema({
    name: String,                               // Full name of the user
    email: { type: String, unique: true },      // Unique email address for login
    password: String,                           // Hashed password string
    role: { type: String, default: "user" }     // Role of the user (user, admin, seller, etc.)
});

export default mongoose.model("User", userSchema);