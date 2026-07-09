const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

exports.register = async (req, res) => {

    try {

        const { name, email, phone, password, role } = req.body;

        const existingUser =
            await User.findOne({
                $or: [{ email }, { phone }]
            });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user = await User.create({

            name,
            email,
            phone,
            password: hashedPassword,
            role

        });

        res.status(201).json({

            message: "Registration successful",

            token: generateToken(
                user._id,
                user.role
            ),

            user

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
exports.login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user =
            await User.findOne({ email });

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isMatch) {

            return res.status(400).json({
                message: "Invalid credentials"
            });

        }

        res.json({

            token: generateToken(
                user._id,
                user.role
            ),

            user

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};