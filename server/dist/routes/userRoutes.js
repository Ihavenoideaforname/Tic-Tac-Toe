"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const router = express_1.default.Router();
const JWT_SECRET = process.env.JWT_SECRET || "default-secret-key";
router.post("/api/auth/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await User_1.default.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: "Email or username already exists" });
        }
        const user = await User_1.default.create({ username, email, password });
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });
        res.status(201).json({
            message: "User registered successfully",
            token,
            user: { id: user._id, username: user.username, email: user.email },
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
});
router.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });
        res.json({
            message: "Login successful",
            token,
            user: { id: user._id, username: user.username, email: user.email },
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
});
router.get("/api/users", async (req, res) => {
    try {
        const users = await User_1.default.find();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
});
exports.default = router;
