import Cart from "../models/Cart.js";
import Food from "../models/Food.js";

/**
 * Helper function to calculate total cart value
 * Fetches current prices from the Food model for accuracy
 */
const calculateTotal = async (items) => {
    let total = 0;
    for (const item of items) {
        const food = await Food.findById(item.foodId);
        if (food && food.price) {
            total += Number(food.price) * Number(item.quantity);
        }
    }
    return total;
};

/**
 * Adds an item to the user's cart
 * Updates quantity if item already exists, or creates new entry
 */
export const addToCart = async (req, res) => {
    try {
        const { foodId, quantity } = req.body;
        const qty = Number(quantity);

        // Find existing cart or create a new one for the user
        let cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            cart = await Cart.create({ userId: req.user.id, items: [], totalAmount: 0 });
        }

        // Check if item is already in the cart
        const itemIndex = cart.items.findIndex(i => i.foodId.toString() === foodId);

        if (itemIndex > -1) {
            // Update quantity
            cart.items[itemIndex].quantity += qty;
            // Remove item if quantity drops to zero or below
            if (cart.items[itemIndex].quantity <= 0) {
                cart.items.splice(itemIndex, 1);
            }
        } else if (qty > 0) {
            // Add new item to cart
            cart.items.push({ foodId, quantity: qty });
        }

        // Recalculate total and save
        cart.totalAmount = await calculateTotal(cart.items);
        await cart.save();

        // Return updated cart with food details populated
        const updatedCart = await Cart.findOne({ userId: req.user.id }).populate("items.foodId");
        res.json(updatedCart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error adding to cart" });
    }
};

/**
 * Retrieves the user's current cart
 */
export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id }).populate("items.foodId");
        res.json(cart || { items: [], totalAmount: 0 });
    } catch (err) {
        res.status(500).json({ msg: "Error fetching cart" });
    }
};

/**
 * Removes a specific item from the cart entirely
 */
export const removeItem = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) return res.status(404).json({ msg: "Cart not found" });

        // Filter out the item to be removed
        cart.items = cart.items.filter(item => {
            const id = item.foodId ? item.foodId.toString() : null;
            return id !== req.params.foodId;
        });

        // Recalculate total and save
        cart.totalAmount = await calculateTotal(cart.items);
        await cart.save();

        const updatedCart = await Cart.findOne({ userId: req.user.id }).populate("items.foodId");
        res.json(updatedCart);
    } catch (err) {
        console.error("Error removing item:", err);
        res.status(500).json({ msg: "Error removing item" });
    }
};