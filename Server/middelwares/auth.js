const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authentication failed. Token missing or malformed." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET); 
        req.user = { _id: decode.userId }; 
        next();
    } catch (err) {
        console.error("JWT Error:", err);
        res.status(401).json({ message: 'Authentication failed. Invalid token.' });
    }
};

module.exports = auth;
