import jwt from "jsonwebtoken";

/**
 * PROTECT Middleware
 * Verifies the JWT token from request headers
 * Ensures only logged-in users can access the route
 */
export const protect = (req, res, next) => {
    try {
        // Extract token from 'Bearer <token>' format
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

        // Verify token using secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attach decoded user info to the request object
        req.user = decoded;
        next();
    } catch (err) {
        console.error("Auth error:", err.message);
        return res.status(401).json({ msg: "Token is not valid" });
    }
};

/**
 * ADMIN ONLY Middleware
 * Ensures the logged-in user has an 'admin' role
 */
export const adminOnly = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ msg: "Access denied. Admins only." });
    }
    next();
};