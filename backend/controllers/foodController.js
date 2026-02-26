import Food from "../models/Food.js";

export const createFood = async (req, res) => {
    try {
        const { name, price, category, isAvailable } = req.body;
        const image = req.file ? req.file.path : null;

        const food = await Food.create({
            name,
            price,
            category,
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

export const getFoods = async (req, res) => {
    try {
        const foods = await Food.find({ restaurantId: req.params.restaurantId });
        res.json(foods);
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};

export const updateFood = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) updateData.image = req.file.path;
        if (updateData.isAvailable) updateData.isAvailable = updateData.isAvailable === 'true' || updateData.isAvailable === true;

        const food = await Food.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(food);
    } catch (err) {
        res.status(500).json({ msg: "Error updating food" });
    }
};

export const deleteFood = async (req, res) => {
    try {
        await Food.findByIdAndDelete(req.params.id);
        res.json({ msg: "Deleted" });
    } catch (err) {
        res.status(500).json({ msg: "Error deleting food" });
    }
};