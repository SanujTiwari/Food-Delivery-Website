import express from "express";
import { createFood, getFoods, updateFood, deleteFood } from "../controllers/foodController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public: Get all food items for a restaurant
router.get("/:restaurantId", getFoods);

// Admin-Only: Operations to manage food items
// Note: 'upload.single("image")' handles the multipart/form-data for image uploads
router.post("/:restaurantId", protect, adminOnly, upload.single("image"), createFood);
router.put("/:id", protect, adminOnly, upload.single("image"), updateFood);
router.delete("/:id", protect, adminOnly, deleteFood);

export default router;