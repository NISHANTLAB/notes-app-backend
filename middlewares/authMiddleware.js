
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = decoded; 
        console.log("Decoded User:", req.user); 
        next();
    } catch (err) {
        console.error("Token Verification Failed:", err);
        res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = authMiddleware;
