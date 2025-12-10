const express = require("express");
const { Venue, VenueReview } = require("../models");
const {
  authMiddleware,
  adminMiddleware,
  venueVendorMiddleware,
} = require("../middleware/auth");
const { upload } = require("../utils/upload");
const config = require("../config/env");

const router = express.Router();

// Get all venues (simplified for list/carousel view)
router.get("/", async (req, res) => {
  try {
    const venues = await Venue.find().populate("user_id", "username email");

    // Fetch average rating for each venue
    const venuesWithRatings = await Promise.all(
      venues.map(async (venue) => {
        const reviews = await VenueReview.find({ venue_id: venue._id });
        const averageRating =
          reviews.length > 0
            ? reviews.reduce((sum, review) => sum + review.venue_rating, 0) /
              reviews.length
            : 0;

        return {
          _id: venue._id,
          venue_name: venue.venue_name,
          venue_address: venue.venue_address,
          venue_capacity: venue.venue_capacity,
          venue_price_per_day: venue.venue_price_per_day,
          venue_image:
            venue.venue_profile_image ||
            venue.venue_images?.[0] ||
            venue.venue_image,
          averageRating: averageRating,
          reviewCount: reviews.length,
          user_id: venue.user_id,
        };
      })
    );

    res.json({ venues: venuesWithRatings });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Get venue by ID with full details and reviews
router.get("/:venue_id", async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.venue_id).populate(
      "user_id",
      "username email"
    );
    if (!venue) return res.status(404).json({ detail: "Venue not found" });

    // Fetch reviews with user details
    const reviews = await VenueReview.find({
      venue_id: req.params.venue_id,
    })
      .populate("user_id", "username email")
      .sort({ venue_review_created_at: -1 });

    // Calculate average rating
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.venue_rating, 0) /
          reviews.length
        : 0;

    // Return venue with reviews and rating
    res.json({
      ...venue.toObject(),
      venue_reviews: reviews,
      averageRating: averageRating,
      reviewCount: reviews.length,
    });
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
  venueVendorMiddleware,
  upload.array("venue_images", 10), // Allow up to 10 images
  async (req, res) => {
    try {
      const venueData = { ...req.body, user_id: req.user._id };

      // Handle multiple images
      if (req.files && req.files.length > 0) {
        venueData.venue_images = req.files.map(
          (file) => `${config.SERVER_BASE_URL}/images/${file.filename}`
        );
        // Set first image as profile image if not explicitly set
        if (!venueData.venue_profile_image) {
          venueData.venue_profile_image = venueData.venue_images[0];
        }
        // Set first image as legacy venue_image for backward compatibility
        venueData.venue_image = venueData.venue_images[0];
      }

      // Parse JSON fields if they come as strings
      if (typeof venueData.venue_amenities === "string") {
        venueData.venue_amenities = JSON.parse(venueData.venue_amenities);
      }
      if (typeof venueData.venue_special_features === "string") {
        venueData.venue_special_features = JSON.parse(
          venueData.venue_special_features
        );
      }
      if (typeof venueData.venue_packages === "string") {
        venueData.venue_packages = JSON.parse(venueData.venue_packages);
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
  venueVendorMiddleware,
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
