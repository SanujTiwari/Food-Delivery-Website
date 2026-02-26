import express from "express";
import { createFood, getFoods, updateFood, deleteFood } from "../controllers/foodController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/:restaurantId", protect, adminOnly, upload.single("image"), createFood);
router.get("/:restaurantId", getFoods);
router.put("/:id", protect, adminOnly, upload.single("image"), updateFood);
router.delete("/:id", protect, adminOnly, deleteFood);

export default router;