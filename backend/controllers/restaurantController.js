import Restaurant from "../models/Restaurant.js";

/**
 * Creates a new restaurant profile
 */
export const createRestaurant = async (req, res) => {
    try {
        const { name, description, address } = req.body;
        // Handle profile image upload
        const image = req.file ? req.file.path : null;

        const restaurant = await Restaurant.create({
            name,
            description,
            address,
            image,
            isActive: true // Newly created restaurants are active by default
        });

        res.json(restaurant);
    } catch (err) {
        console.error("CREATE RESTAURANT ERROR:", err);
        res.status(500).json({ msg: err.message || "Error creating restaurant" });
    }
};

/**
 * Fetches a list of restaurants
 * Query param 'all=true' shows all restaurants (admin)
 * Default shows only active restaurants
 */
export const getRestaurants = async (req, res) => {
    try {
        const { all } = req.query;
        const query = all === "true" ? {} : { isActive: true };
        const data = await Restaurant.find(query);
        res.json(data);
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};

/**
 * Updates restaurant details
 */
export const updateRestaurant = async (req, res) => {
    try {
        const updateData = { ...req.body };
        // Update image if a new file is uploaded
        if (req.file) updateData.image = req.file.path;

        const data = await Restaurant.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(data);
    } catch (err) {
        res.status(500).json({ msg: "Error updating restaurant" });
    }
};

/**
 * Deletes a restaurant profile
 */
export const deleteRestaurant = async (req, res) => {
    try {
        await Restaurant.findByIdAndDelete(req.params.id);
        res.json({ msg: "Deleted" });
    } catch (err) {
        res.status(500).json({ msg: "Error deleting restaurant" });
    }
};

/**
 * Retrieves a single restaurant's details by ID
 */
export const getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        res.json(restaurant);
    } catch (err) {
        res.status(500).json({ msg: "Error fetching restaurant" });
    }
};