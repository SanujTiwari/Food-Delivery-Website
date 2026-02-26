import express from "express";
import { createRestaurant, getRestaurants, updateRestaurant, deleteRestaurant, getRestaurantById } from "../controllers/restaurantController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// helper to run multer and catch errors before controller
const handleUpload = (middleware, controller) => (req, res, next) => {
    middleware(req, res, (err) => {
        if (err) {
            console.error("UPLOAD ERROR:", err);
            return res.status(500).json({ msg: `Upload failed: ${err.message || 'Unknown error'}` });
        }
        controller(req, res, next);
    });
};

router.post(
    "/",
    protect,
    adminOnly,
    handleUpload(upload.single("image"), createRestaurant)
);
router.get("/", getRestaurants);
router.get("/:id", getRestaurantById);
router.put(
    "/:id",
    protect,
    adminOnly,
    handleUpload(upload.single("image"), updateRestaurant)
);
router.delete("/:id", protect, adminOnly, deleteRestaurant);

export default router;