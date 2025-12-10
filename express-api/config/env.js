require("dotenv").config();

module.exports = {
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_ALGORITHM: process.env.JWT_ALGORITHM,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || "3600",
  SERVER_BASE_URL: process.env.SERVER_BASE_URL || "http://localhost:8000",
  CLIENT_BASE_URL: process.env.CLIENT_BASE_URL || "*",
  PORT: process.env.PORT || 8000,
};
