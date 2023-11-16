const jwt = require("jsonwebtoken");
require("dotenv").config();

const getTokenInfo = (req, res) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.sendStatus(401);
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid or expired token" });
        return decoded;
    });
    res.userId = decoded.userInfo.id;
    res.email = decoded.userInfo.email;
    return res;
};

module.exports = getTokenInfo;
