const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/env");

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

const createAccessToken = (userId) => {
  return jwt.sign({ user_id: userId }, config.JWT_SECRET, {
    expiresIn: parseInt(config.ACCESS_TOKEN_EXPIRY),
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  hashPassword,
  verifyPassword,
  createAccessToken,
  verifyToken,
};
