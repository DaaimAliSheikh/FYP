const express = require("express");
const crypto = require("crypto");
const { User } = require("../models");
const {
  hashPassword,
  verifyPassword,
  createAccessToken,
} = require("../utils/auth");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("../utils/emailService");
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
    const { username, email, password, role, vendor_type, user_contacts } =
      req.body;

    let existingUser = await User.findOne({ email });

    // If user exists but not verified, resend verification email
    if (existingUser && !existingUser.is_verified) {
      // Generate new verification token
      const verificationToken = crypto.randomBytes(32).toString("hex");
      const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      existingUser.verification_token = verificationToken;
      existingUser.verification_token_expires = tokenExpires;
      await existingUser.save();

      // Send verification email
      await sendVerificationEmail(
        existingUser.email,
        existingUser.username,
        verificationToken
      );

      return res.status(200).json({
        detail:
          "Account already exists but not verified. A new verification email has been sent to your email address.",
      });
    }

    if (existingUser) {
      return res
        .status(400)
        .json({ detail: `User with email ${email} already exists` });
    }

    const password_hash = await hashPassword(password);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const userData = {
      username,
      email,
      password_hash,
      role: role || "user",
      is_verified: false,
      verification_token: verificationToken,
      verification_token_expires: tokenExpires,
    };

    // Only set vendor_type if role is vendor
    if (role === "vendor" && vendor_type) {
      userData.vendor_type = vendor_type;
    }

    const user = await User.create(userData);

    // Send verification email
    await sendVerificationEmail(user.email, user.username, verificationToken);

    res.status(201).json({
      detail:
        "Account created successfully! A verification email has been sent to your email address. Please verify your email before logging in.",
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

    // Check if email is verified
    if (!user.is_verified) {
      return res.status(403).json({
        detail: "Please verify your email before logging in.",
        code: "EMAIL_NOT_VERIFIED",
      });
    }

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ detail: "Incorrect username or password" });
    }

    const token = createAccessToken(user._id);

    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        is_admin: user.is_admin,
        role: user.role,
        vendor_type: user.vendor_type,
      },
    });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Logout
router.post("/logout", authMiddleware, (req, res) => {
  // With token-based auth, logout is handled on the client by removing the token
  res.json({ detail: "Successfully logged out" });
});

// Verify email
router.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ detail: "Verification token is required" });
    }

    const user = await User.findOne({
      verification_token: token,
      verification_token_expires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        detail: "Invalid or expired verification token",
        code: "TOKEN_INVALID",
      });
    }

    user.is_verified = true;
    user.verification_token = null;
    user.verification_token_expires = null;
    await user.save();

    res.json({ detail: "Email verified successfully! You can now log in." });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Resend verification email
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ detail: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ detail: "User not found" });
    }

    if (user.is_verified) {
      return res.status(400).json({ detail: "Email is already verified" });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    user.verification_token = verificationToken;
    user.verification_token_expires = tokenExpires;
    await user.save();

    // Send verification email
    await sendVerificationEmail(user.email, user.username, verificationToken);

    res.json({ detail: "Verification email sent successfully" });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Forgot password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ detail: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({
        detail:
          "If an account exists with this email, a password reset link has been sent.",
      });
    }

    if (!user.is_verified) {
      return res.status(403).json({
        detail: "Please verify your email first before resetting password",
        code: "EMAIL_NOT_VERIFIED",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.reset_password_token = resetToken;
    user.reset_password_token_expires = tokenExpires;
    await user.save();

    // Send reset email
    await sendPasswordResetEmail(user.email, user.username, resetToken);

    res.json({
      detail:
        "If an account exists with this email, a password reset link has been sent.",
    });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Reset password
router.post("/reset-password", async (req, res) => {
  try {
    const { token, new_password } = req.body;

    if (!token || !new_password) {
      return res
        .status(400)
        .json({ detail: "Token and new password are required" });
    }

    if (new_password.length < 6) {
      return res
        .status(400)
        .json({ detail: "Password must be at least 6 characters long" });
    }

    const user = await User.findOne({
      reset_password_token: token,
      reset_password_token_expires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        detail: "Invalid or expired reset token",
        code: "TOKEN_INVALID",
      });
    }

    // Hash new password
    const password_hash = await hashPassword(new_password);

    user.password_hash = password_hash;
    user.reset_password_token = null;
    user.reset_password_token_expires = null;
    await user.save();

    res.json({ detail: "Password reset successfully! You can now log in." });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

module.exports = router;
