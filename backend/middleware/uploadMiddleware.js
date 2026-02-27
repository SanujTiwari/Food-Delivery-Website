import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

/**
 * Configures Cloudinary Storage for Multer
 * File images will be uploaded to the 'food-delivery' folder on Cloudinary
 */
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "food-delivery",
        allowed_formats: ["jpg", "png", "jpeg"], // Restrict file types
    },
});

// Initialize Multer with Cloudinary storage configuration
const upload = multer({ storage });

export default upload;
