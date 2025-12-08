const express = require("express");
const { Venue, VenueReview } = require("../models");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const { upload } = require("../utils/upload");
const config = require("../config/env");

const router = express.Router();

// Get all venues
router.get("/", async (req, res) => {
  try {
    const venues = await Venue.find();
    res.json(venues);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Get venue by ID
router.get("/:venue_id", async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.venue_id);
    if (!venue) return res.status(404).json({ detail: "Venue not found" });
    res.json(venue);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Get venue reviews
router.get("/reviews/:venue_id", async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.venue_id);
    if (!venue) return res.status(404).json({ detail: "Venue not found" });

    const reviews = await VenueReview.find({
      venue_id: req.params.venue_id,
    }).populate("user_id", "username email");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Create review
router.post("/reviews/:venue_id", authMiddleware, async (req, res) => {
  try {
    if (req.user.is_admin) {
      return res.status(403).json({ detail: "Admins cannot submit reviews" });
    }

    const review = await VenueReview.create({
      ...req.body,
      venue_id: req.params.venue_id,
      user_id: req.user._id,
    });
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Delete review
router.delete("/reviews/:venue_review_id", authMiddleware, async (req, res) => {
  try {
    if (req.user.is_admin) {
      return res.status(403).json({ detail: "Admin cannot delete reviews" });
    }

    const deleted = await VenueReview.findByIdAndDelete(
      req.params.venue_review_id
    );
    if (!deleted)
      return res.status(404).json({ detail: "Venue review not found" });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Create venue
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("venue_image"),
  async (req, res) => {
    try {
      const venueData = { ...req.body };
      if (req.file) {
        venueData.venue_image = `${config.SERVER_BASE_URL}images/${req.file.filename}`;
      }
      const venue = await Venue.create(venueData);
      res.status(201).json(venue);
    } catch (error) {
      res.status(500).json({ detail: error.message });
    }
  }
);

// Delete venue
router.delete(
  "/:venue_id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const deleted = await Venue.findByIdAndDelete(req.params.venue_id);
      if (!deleted) return res.status(404).json({ detail: "Venue not found" });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ detail: error.message });
    }
  }
);

module.exports = router;
