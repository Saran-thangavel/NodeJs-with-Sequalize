const User = require("../models/User");
const bcrypt = require("bcrypt");

const createQuizUser = async (req, res) => {
    const { email, name, password } = req.body;
    console.log("req", req.body);
    if (!email || !name || !password) {
        return res.status(404).json({ message: "Required fields cannot be empty" });
    }
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email: email,
            name: name,
            password: hashedPassword,
        });
        console.log(user);
        res.status(201).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ Message: error });
    }
};

module.exports = { createQuizUser };
