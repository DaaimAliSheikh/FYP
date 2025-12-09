const express = require("express");
const { Car, CarReservation } = require("../models");
const {
  authMiddleware,
  adminMiddleware,
  carRentalVendorMiddleware,
} = require("../middleware/auth");
const { upload } = require("../utils/upload");
const config = require("../config/env");

const router = express.Router();

// Get all cars
router.get("/", async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Get all car reservations (admin only)
router.get(
  "/reservations",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const reservations = await CarReservation.find()
        .populate("car_id")
        .populate("booking_id");
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ detail: error.message });
    }
  }
);

// Get car by ID
router.get("/:car_id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.car_id);
    if (!car) return res.status(404).json({ detail: "Car not found" });
    res.json(car);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Create car
router.post(
  "/",
  authMiddleware,
  carRentalVendorMiddleware,
  upload.single("car_image"),
  async (req, res) => {
    try {
      const carData = { ...req.body };
      if (req.file) {
        carData.car_image = `${config.SERVER_BASE_URL}images/${req.file.filename}`;
      }
      const car = await Car.create(carData);
      res.status(201).json(car);
    } catch (error) {
      res.status(500).json({ detail: error.message });
    }
  }
);

// Delete car
router.delete(
  "/:car_id",
  authMiddleware,
  carRentalVendorMiddleware,
  async (req, res) => {
    try {
      const deleted = await Car.findByIdAndDelete(req.params.car_id);
      if (!deleted) return res.status(404).json({ detail: "Car not found" });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ detail: error.message });
    }
  }
);

// Update car quantity
router.patch("/:car_id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.car_id, req.body, {
      new: true,
    });
    if (!car) return res.status(404).json({ detail: "Car not found" });
    res.json(car);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

module.exports = router;
