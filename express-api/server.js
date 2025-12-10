const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const connectDB = require("./config/db");
const config = require("./config/env");

const userRoutes = require("./routes/users");
const venueRoutes = require("./routes/venues");
const cateringRoutes = require("./routes/caterings");
const photographyRoutes = require("./routes/photography");
const carRoutes = require("./routes/cars");
const promoRoutes = require("./routes/promos");
const bookingRoutes = require("./routes/bookings");
const enquiryRoutes = require("./routes/enquiries");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: config.CLIENT_BASE_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static images
app.use("/images", express.static(path.join(__dirname, "images")));

// Routes
app.use("/users", userRoutes);
app.use("/venues", venueRoutes);
app.use("/caterings", cateringRoutes);
app.use("/photography", photographyRoutes);
app.use("/cars", carRoutes);
app.use("/promos", promoRoutes);
app.use("/bookings", bookingRoutes);
app.use("/enquiries", enquiryRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled exception:", err);
  res
    .status(500)
    .json({ detail: `An unexpected error occurred. ${err.message}` });
});

const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
