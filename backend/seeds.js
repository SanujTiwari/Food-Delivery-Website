import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import mongoose from "mongoose";
import dotenv from "dotenv";
import Restaurant from "./models/Restaurant.js";
import Food from "./models/Food.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        // Clear existing data (optional, but good for fresh seed)
        await Restaurant.deleteMany({});
        await Food.deleteMany({});

        // 1. Create Restaurants
        const restaurants = [
            {
                name: "The Golden Dragon",
                image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1000",
                description: "Authentic Szechuan and Cantonese delicacies in a premium setting.",
                address: "Market Street, Downtown",
                isActive: true
            },
            {
                name: "Mama Mia Pizzeria",
                image: "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&q=80&w=1000",
                description: "Wood-fired artisanal pizzas and handmade pasta since 1995.",
                address: "Little Italy Blvd, West Side",
                isActive: true
            },
            {
                name: "Burger Empire",
                image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=1000",
                description: "Gourmet wagyu burgers and specialty milkshakes.",
                address: "Food Court, Central Mall",
                isActive: true
            }
        ];

        const createdRestaurants = await Restaurant.insertMany(restaurants);

        // 2. Create Foods for each restaurant
        const foodItems = [];

        // Golden Dragon Foods
        const dragonId = createdRestaurants[0]._id;
        foodItems.push(
            { restaurantId: dragonId, name: "Spring Rolls", price: 250, category: "Appetizers", image: "https://images.unsplash.com/photo-1544333346-bf03a0171ca6?auto=format&fit=crop&q=80&w=500", isAvailable: true },
            { restaurantId: dragonId, name: "Kung Pao Chicken", price: 450, category: "Main Course", image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&q=80&w=500", isAvailable: true },
            { restaurantId: dragonId, name: "Dim Sum Platter", price: 600, category: "Appetizers", image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=500", isAvailable: true },
            { restaurantId: dragonId, name: "Fried Rice", price: 350, category: "Sides", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=500", isAvailable: true },
            { restaurantId: dragonId, name: "Fortune Cookies", price: 150, category: "Desserts", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=500", isAvailable: true }
        );

        // Mama Mia Foods
        const mamaId = createdRestaurants[1]._id;
        foodItems.push(
            { restaurantId: mamaId, name: "Margherita Pizza", price: 550, category: "Pizza", image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=500", isAvailable: true },
            { restaurantId: mamaId, name: "Pepperoni Feast", price: 650, category: "Pizza", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=500", isAvailable: true },
            { restaurantId: mamaId, name: "Pasta Carbonara", price: 480, category: "Pasta", image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&q=80&w=500", isAvailable: true },
            { restaurantId: mamaId, name: "Garlic Bread", price: 200, category: "Sides", image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&q=80&w=500", isAvailable: true },
            { restaurantId: mamaId, name: "Tiramisu", price: 350, category: "Desserts", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=500", isAvailable: true }
        );

        // Burger Empire Foods
        const burgerId = createdRestaurants[2]._id;
        foodItems.push(
            { restaurantId: burgerId, name: "Classic Cheeseburger", price: 350, category: "Burgers", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=500", isAvailable: true },
            { restaurantId: burgerId, name: "Double Bacon King", price: 550, category: "Burgers", image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=500", isAvailable: true },
            { restaurantId: burgerId, name: "Loaded Truffle Fries", price: 250, category: "Sides", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=500", isAvailable: true },
            { restaurantId: burgerId, name: "Vanilla Milkshake", price: 220, category: "Beverages", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=500", isAvailable: true },
            { restaurantId: burgerId, name: "Chocolate Lava Cake", price: 300, category: "Desserts", image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&q=80&w=500", isAvailable: true }
        );

        await Food.insertMany(foodItems);

        console.log("Data seeded successfully!");
        process.exit();
    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
};

seedData();
