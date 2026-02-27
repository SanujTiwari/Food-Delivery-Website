import Food from "../models/Food.js";

/**
 * Creates a new food item for a restaurant
 */
export const createFood = async (req, res) => {
    try {
        const { name, price, category, isAvailable } = req.body;
        // Handle file upload if image is provided
        const image = req.file ? req.file.path : null;

        const food = await Food.create({
            name,
            price,
            category,
            // Convert string 'true'/'false' to boolean if necessary
            isAvailable: isAvailable === 'true' || isAvailable === true,
            image,
            restaurantId: req.params.restaurantId
        });
        res.json(food);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error creating food" });
    }
};

/**
 * Retrieves all food items for a specific restaurant
 */
export const getFoods = async (req, res) => {
    try {
        const foods = await Food.find({ restaurantId: req.params.restaurantId });
        res.json(foods);
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};

/**
 * Updates an existing food item
 */
export const updateFood = async (req, res) => {
    try {
        const updateData = { ...req.body };
        // If a new image is uploaded, update the image path
        if (req.file) updateData.image = req.file.path;
        // Ensure availability status is correctly typed
        if (updateData.isAvailable) updateData.isAvailable = updateData.isAvailable === 'true' || updateData.isAvailable === true;

        const food = await Food.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(food);
    } catch (err) {
        res.status(500).json({ msg: "Error updating food" });
    }
};

/**
 * Deletes a food item from the menu
 */
export const deleteFood = async (req, res) => {
    try {
        await Food.findByIdAndDelete(req.params.id);
        res.json({ msg: "Deleted" });
    } catch (err) {
        res.status(500).json({ msg: "Error deleting food" });
    }
};