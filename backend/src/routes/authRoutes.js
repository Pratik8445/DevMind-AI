import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Generate a signed JWT token valid for 7 days
function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: "Email already registered." });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      token:   generateToken(user._id),
      user: {
        id:      user._id,
        name:    user.name,
        email:   user.email,
        credits: user.credits,
        plan:    user.plan,
      },
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required." });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    res.json({
      token: generateToken(user._id),
      user: {
        id:      user._id,
        name:    user.name,
        email:   user.email,
        credits: user.credits,
        plan:    user.plan,
      },
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me — get logged-in user's profile
router.get("/me", protect, async (req, res) => {
  res.json({
    id:      req.user._id,
    name:    req.user.name,
    email:   req.user.email,
    credits: req.user.credits,
    plan:    req.user.plan,
  });
});

export default router;
