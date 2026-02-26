import express from "express";
import { addToCart, getCart, removeItem } from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, addToCart);
router.get("/", protect, getCart);
router.delete("/remove/:foodId", protect, removeItem);

export default router;