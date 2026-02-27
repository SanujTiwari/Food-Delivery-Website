import express from "express";
import { register, login } from "../controllers/authController.js";

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

export default router;