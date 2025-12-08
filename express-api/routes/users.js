const express = require("express");
const { User } = require("../models");
const {
  hashPassword,
  verifyPassword,
  createAccessToken,
} = require("../utils/auth");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const config = require("../config/env");

const router = express.Router();

// Get all users (admin only)
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password_hash");
    res.json(users);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Get current user
router.get("/me", authMiddleware, async (req, res) => {
  res.json(req.user);
});

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, user_contacts } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ detail: `User with email ${email} already exists` });
    }

    const password_hash = await hashPassword(password);
    const user = await User.create({ username, email, password_hash });

    const token = createAccessToken(user._id);
    res.cookie("access_token", token, {
      httpOnly: true,
      maxAge: parseInt(config.ACCESS_TOKEN_EXPIRY) * 1000,
      sameSite: "lax",
    });

    res.status(201).json({
      user_id: user._id,
      username: user.username,
      email: user.email,
      is_admin: user.is_admin,
    });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ detail: "User does not exist" });
    }

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ detail: "Incorrect username or password" });
    }

    const token = createAccessToken(user._id);
    res.cookie("access_token", token, {
      httpOnly: true,
      maxAge: parseInt(config.ACCESS_TOKEN_EXPIRY) * 1000,
      sameSite: "lax",
    });

    res.json({
      user_id: user._id,
      username: user.username,
      email: user.email,
      is_admin: user.is_admin,
    });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Logout
router.get("/logout", authMiddleware, (req, res) => {
  res.clearCookie("access_token");
  res.json({ detail: "Successfully logged out" });
});

module.exports = router;
