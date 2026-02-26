import Cart from "../models/Cart.js";
import Food from "../models/Food.js";

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

export const addToCart = async (req, res) => {
    try {
        const { foodId, quantity } = req.body;
        const qty = Number(quantity);

        let cart = await Cart.findOne({ userId: req.user.id });

        if (!cart) {
            cart = await Cart.create({ userId: req.user.id, items: [], totalAmount: 0 });
        }

        const itemIndex = cart.items.findIndex(i => i.foodId.toString() === foodId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += qty;
            if (cart.items[itemIndex].quantity <= 0) {
                cart.items.splice(itemIndex, 1);
            }
        } else if (qty > 0) {
            cart.items.push({ foodId, quantity: qty });
        }

        cart.totalAmount = await calculateTotal(cart.items);
        await cart.save();

        const updatedCart = await Cart.findOne({ userId: req.user.id }).populate("items.foodId");
        res.json(updatedCart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error adding to cart" });
    }
};

export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id }).populate("items.foodId");
        res.json(cart || { items: [], totalAmount: 0 });
    } catch (err) {
        res.status(500).json({ msg: "Error fetching cart" });
    }
};

export const removeItem = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) return res.status(404).json({ msg: "Cart not found" });

        // Remove the item by foodId
        cart.items = cart.items.filter(item => {
            const id = item.foodId ? item.foodId.toString() : null;
            return id !== req.params.foodId;
        });

        cart.totalAmount = await calculateTotal(cart.items);
        await cart.save();

        const updatedCart = await Cart.findOne({ userId: req.user.id }).populate("items.foodId");
        res.json(updatedCart);
    } catch (err) {
        console.error("Error removing item:", err);
        res.status(500).json({ msg: "Error removing item" });
    }
};