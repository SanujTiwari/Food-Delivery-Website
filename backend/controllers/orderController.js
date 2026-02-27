import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

/**
 * Places a new order for the user
 * 1. Fetches user's cart
 * 2. Creates Order record with snapshot of items and prices
 * 3. Clears the cart after successful order creation
 */
export const placeOrder = async (req, res) => {
    // 1. Get user's cart with food details
    const cart = await Cart.findOne({ userId: req.user.id }).populate("items.foodId");

    // 2. Create the order document
    const order = await Order.create({
        userId: req.user.id,
        items: cart.items.map(item => ({
            foodId: item.foodId?._id,
            name: item.foodId?.name || "Unknown Item",
            image: item.foodId?.image,
            price: item.foodId?.price || 0,
            quantity: item.quantity
        })),
        totalAmount: cart.totalAmount + 15, // Adding a fixed delivery fee of 15
        deliveryAddress: req.body.address,
        paymentMethod: req.body.paymentMethod
    });

    // 3. Clear the user's cart
    await Cart.deleteOne({ userId: req.user.id });

    const populatedOrder = await Order.findById(order._id).populate("items.foodId");
    res.json(populatedOrder);
};

/**
 * Retrieves all orders placed by the current user
 */
export const getUserOrders = async (req, res) => {
    const orders = await Order.find({ userId: req.user.id }).populate("items.foodId");
    res.json(orders);
};

/**
 * Retrieves all orders in the system (Admin only)
 */
export const getAllOrders = async (req, res) => {
    const orders = await Order.find().populate("items.foodId");
    res.json(orders);
};

/**
 * Updates the delivery status of an order (Admin/Seller)
 */
export const updateStatus = async (req, res) => {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
    );
    res.json(order);
};