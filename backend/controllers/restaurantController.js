import Restaurant from "../models/Restaurant.js";

export const createRestaurant = async (req, res) => {
    try {
        console.log("createRestaurant body:", req.body);
        console.log("createRestaurant file:", req.file);
        const { name, description, address } = req.body;
        const image = req.file ? req.file.path : null;

        const restaurant = await Restaurant.create({
            name,
            description,
            address,
            image,
            isActive: true
        });

        res.json(restaurant);
    } catch (err) {
        console.error("CREATE RESTAURANT ERROR:", err);
        res.status(500).json({ msg: err.message || "Error creating restaurant" });
    }
};

export const getRestaurants = async (req, res) => {
    try {
        const { all } = req.query;
        // If all=true, return all restaurants (for admin). Otherwise, only active ones.
        const query = all === "true" ? {} : { isActive: true };
        const data = await Restaurant.find(query);
        res.json(data);
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};

export const updateRestaurant = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) updateData.image = req.file.path;

        const data = await Restaurant.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(data);
    } catch (err) {
        res.status(500).json({ msg: "Error updating restaurant" });
    }
};

export const deleteRestaurant = async (req, res) => {
    try {
        await Restaurant.findByIdAndDelete(req.params.id);
        res.json({ msg: "Deleted" });
    } catch (err) {
        res.status(500).json({ msg: "Error deleting restaurant" });
    }
};

export const getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        res.json(restaurant);
    } catch (err) {
        res.status(500).json({ msg: "Error fetching restaurant" });
    }
};