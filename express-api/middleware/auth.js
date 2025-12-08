const { User } = require("../models");
const { verifyToken } = require("../utils/auth");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(401).json({ detail: "Not authenticated" });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ detail: "Invalid or expired token" });
    }

    const user = await User.findById(payload.user_id).select("-password_hash");
    if (!user) {
      return res.status(401).json({ detail: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ detail: "Authentication failed" });
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.user.is_admin) {
    return res.status(403).json({ detail: "Admin access required" });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };
