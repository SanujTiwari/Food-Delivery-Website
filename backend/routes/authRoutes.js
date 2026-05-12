import express from "express";
import { register, login, updateProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Sign up a new user
 */
router.post("/register", register);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get token
 */
router.post("/login", login);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 */
router.put("/profile", protect, updateProfile);

export default router;