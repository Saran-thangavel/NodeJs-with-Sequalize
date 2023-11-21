const { sendEmail } = require("../email");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { successResponse, errorResponse } = require("../utils/responseHandler");

const createUser = async (req, res) => {
    const { firstname, lastname, email, phonenumber, password } = req.body;
    console.log("req", req.body);
    if (!firstname || !lastname || !email || !phonenumber || !password) {
        return res.status(404).json({ message: "Required fields cannot be empty" });
    }
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            firstname: firstname,
            lastname: lastname,
            email: email,
            phonenumber: phonenumber,
            password: hashedPassword,
        });
        console.log(user);
        res.status(201).json(user);

        const toEmail = email;
        const subject = "Hi there!";
        const text = "Testing email through register user api";
        sendEmail(toEmail, subject, text);
    } catch (error) {
        console.log(error);
        res.status(500).json({ Message: error });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.findAll({
            attributes: { exclude: ["password"] },
        });
        console.log("all done", allUsers);
        // res.status(200).json(allUsers);
        successResponse(res, 200, allUsers);
    } catch (error) {
        console.log(error);
        // res.status(500).json({ Message: error });
        errorResponse(res, 500, error);
    }
};

const getUser = async (req, res) => {
    const id = req.query.id;
    console.log(req, "userId");
    try {
        const getUser = await User.findOne({ where: { id: id }, attributes: { exclude: ["password"] } });
        // res.status(200).json(getUser);
        successResponse(res, 200, getUser);
    } catch (error) {
        console.log(error);
        // res.status(500).json({ Message: error });
        errorResponse(res, 500, error);
    }
};

const updateUser = async (req, res) => {
    console.log(req, "body");
    const id = req.params.id;
    const { firstname, lastname, email, phonenumber, password } = req.body;
    if (!firstname || !lastname || !email || !phonenumber || !password) {
        return res.status(404).json({ message: "Required fields cannot be empty" });
    }

    try {
        const user = await User.findOne({ where: { id: id } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.firstname = firstname;
        user.lastname = lastname;
        user.email = email;
        user.phonenumber = phonenumber;
        user.password = password;

        await user.save();
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ Message: error });
    }
};

const deleteUser = async (req, res) => {
    const id = req.params.id;
    if (!id || isNaN(parseInt(id))) {
        return res.status(404).json({ message: "User id is required" });
    }
    try {
        const user = await User.findOne({ where: { id: id } });

        if (!user) {
            res.status(404).json({ message: "User not found" });
        }

        await user.destroy();
        res.status(204).send();
    } catch (error) {
        console.log(error);
        res.status(500).json({ Message: error });
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
};
