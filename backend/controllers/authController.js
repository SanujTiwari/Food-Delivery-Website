import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * Handles new user registration
 * 1. Hashes the password for security
 * 2. Creates a new User document in MongoDB
 */
export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Hash the password before saving (10 salt rounds)
        const hashed = await bcrypt.hash(password, 10);

        // Create and save user with hashed password
        const user = await User.create({ name, email, password: hashed, role: role || "user" });

        res.json(user);
    } catch (err) {
        console.error("Register Error:", err);
        // Handle duplicate email error (MongoDB code 11000)
        if (err.code === 11000) {
            return res.status(400).json({ msg: "Email already exists" });
        }
        res.status(500).json({ msg: "Server Error during registration" });
    }
};

/**
 * Handles user login
 * 1. Checks if user exists
 * 2. Verifies password using bcrypt
 * 3. Generates a JWT token for session management
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "User not found" });

        // Compare entered password with hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        // Ensure JWT secret is configured
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing in .env");
            return res.status(500).json({ msg: "Security configuration missing" });
        }

        // Generate JWT token containing user info
        const token = jwt.sign(
            { id: user._id, name: user.name, role: user.role, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" } // Token expires in 1 day
        );

        // Send token and user details to frontend
        res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ msg: "Server Error during login" });
    }
};