const User = require("../models/User");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body, "body");
    if (!email || !password || email === undefined || password === undefined) return res.status(400).json({ message: "Email and password are required" });
    const foundUser = await User.findOne({ where: { email: email } });
    if (!foundUser) return res.sendStatus(401); //Unauthorized

    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        createJWT(foundUser.email, foundUser.id, res);
    } else {
        res.status(400).json({ message: "Password doesn't match." });
    }
};

const handleRefreshToken = (req, res) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: "Refresh token is required" });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid or expired refresh token" });

        // Issue a new access token
        createJWT(decoded.email, decoded.id, res);
    });
};

const createJWT = (email, id, res) => {
    const accessToken = jwt.sign(
        {
            userInfo: { email: email, id: id },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
        {
            email: email,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
    );
    res.json({ accessToken, refreshToken });
};

module.exports = { handleLogin, handleRefreshToken };
