const Client = require("../models/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signup = async (req, res) => {
    try {
        const { name, email, phone, password, address } = req.body;

        const existingClient = await Client.findOne({ $or: [{ email }, { phone }] });
        if (existingClient) return res.status(400).json({ message: "Email or Phone already in use." });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newClient = new Client({
            name,
            email,
            phone,
            password: hashedPassword,
            address,
        });

        await newClient.save();
        res.status(201).json({ message: "Account created successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Signup failed!", error: error.message });
    }
};
exports.login = async (req, res) => {
    try {
        const { phone, password } = req.body;

        const client = await Client.findOne({ phone });
        if (!client) return res.status(404).json({ message: "User not found!" });

        const isMatch = await bcrypt.compare(password, client.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials!" });

        const token = jwt.sign({ id: client._id, email: client.email, phone: client.phone, isActive: client.isActive }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.status(200).json({ message: "Login successful!", token });
    } catch (error) {
        res.status(500).json({ message: "Login failed!", error: error.message });
    }
};
exports.editProfile = async (req, res) => {
    try {
        const clientId = req.user.id;
        const { name, phone, address } = req.body;

        const updatedClient = await Client.findByIdAndUpdate(
            clientId,
            { name, phone, address },
            { new: true }
        );

        res.status(200).json({ message: "Profile updated successfully!", updatedClient });
    } catch (error) {
        res.status(500).json({ message: "Profile update failed!", error: error.message });
    }
};