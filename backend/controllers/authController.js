import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hashed, role: role || "user" });

        res.json(user);
    } catch (err) {
        console.error("Register Error:", err);
        if (err.code === 11000) {
            return res.status(400).json({ msg: "Email already exists" });
        }
        res.status(500).json({ msg: "Server Error during registration" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ msg: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing in .env");
            return res.status(500).json({ msg: "Security configuration missing" });
        }

        const token = jwt.sign(
            { id: user._id, name: user.name, role: user.role, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ msg: "Server Error during login" });
    }
};