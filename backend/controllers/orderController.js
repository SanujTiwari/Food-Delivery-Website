import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

export const placeOrder = async (req, res) => {
    const cart = await Cart.findOne({ userId: req.user.id }).populate("items.foodId");

    const order = await Order.create({
        userId: req.user.id,
        items: cart.items.map(item => ({
            foodId: item.foodId?._id,
            name: item.foodId?.name || "Unknown Item",
            image: item.foodId?.image,
            price: item.foodId?.price || 0,
            quantity: item.quantity
        })),
        totalAmount: cart.totalAmount + 15,
        deliveryAddress: req.body.address,
        paymentMethod: req.body.paymentMethod
    });

    await Cart.deleteOne({ userId: req.user.id });

    const populatedOrder = await Order.findById(order._id).populate("items.foodId");
    res.json(populatedOrder);
};

export const getUserOrders = async (req, res) => {
    const orders = await Order.find({ userId: req.user.id }).populate("items.foodId");
    res.json(orders);
};

export const getAllOrders = async (req, res) => {
    const orders = await Order.find().populate("items.foodId");
    res.json(orders);
};

export const updateStatus = async (req, res) => {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
    );
    res.json(order);
};