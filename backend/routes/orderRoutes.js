import express from "express";
import { placeOrder, getUserOrders, getAllOrders, updateStatus } from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/user", protect, getUserOrders);
router.get("/admin", protect, adminOnly, getAllOrders);
router.put("/:id/status", protect, adminOnly, updateStatus);

export default router;