const express = require("express");
const { Venue } = require("../models");
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

    // Calculate average rating for each venue from embedded reviews
    const venuesWithRatings = venues.map((venue) => {
      const reviews = venue.venue_reviews || [];
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
    });

    res.json({ venues: venuesWithRatings });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Get venue by ID with full details and reviews
router.get("/:venue_id", async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.venue_id)
      .populate("user_id", "username email")
      .populate("venue_reviews.user_id", "username email");

    if (!venue) return res.status(404).json({ detail: "Venue not found" });

    // Calculate average rating from embedded reviews
    const reviews = venue.venue_reviews || [];
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.venue_rating, 0) /
          reviews.length
        : 0;

    // Return venue with reviews and rating
    res.json({
      ...venue.toObject(),
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
    const venue = await Venue.findById(req.params.venue_id).populate(
      "venue_reviews.user_id",
      "username email"
    );
    if (!venue) return res.status(404).json({ detail: "Venue not found" });

    res.json(venue.venue_reviews || []);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Create review (add to venue's embedded reviews array)
router.post("/reviews/:venue_id", authMiddleware, async (req, res) => {
  try {
    if (req.user.is_admin) {
      return res.status(403).json({ detail: "Admins cannot submit reviews" });
    }

    const venue = await Venue.findById(req.params.venue_id);
    if (!venue) return res.status(404).json({ detail: "Venue not found" });

    const newReview = {
      venue_review_text: req.body.venue_review_text,
      venue_rating: req.body.venue_rating,
      venue_review_created_at: new Date(),
      user_id: req.user._id,
    };

    venue.venue_reviews.push(newReview);
    await venue.save();

    // Populate user details for response
    await venue.populate("venue_reviews.user_id", "username email");

    res.status(201).json(venue.venue_reviews[venue.venue_reviews.length - 1]);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Delete review (remove from venue's embedded reviews array)
router.delete("/reviews/:venue_review_id", authMiddleware, async (req, res) => {
  try {
    if (req.user.is_admin) {
      return res.status(403).json({ detail: "Admin cannot delete reviews" });
    }

    const venue = await Venue.findOne({
      "venue_reviews._id": req.params.venue_review_id,
    });

    if (!venue)
      return res.status(404).json({ detail: "Venue review not found" });

    // Check if user owns this review
    const review = venue.venue_reviews.id(req.params.venue_review_id);
    if (review.user_id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ detail: "You can only delete your own reviews" });
    }

    venue.venue_reviews.pull(req.params.venue_review_id);
    await venue.save();

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Get all reviews for vendor's venues
router.get(
  "/vendor/reviews",
  authMiddleware,
  venueVendorMiddleware,
  async (req, res) => {
    try {
      const venues = await Venue.find({ user_id: req.user._id })
        .populate("venue_reviews.user_id", "username email")
        .select("venue_name venue_reviews");

      // Flatten all reviews with venue information
      const allReviews = [];
      venues.forEach((venue) => {
        if (venue.venue_reviews && venue.venue_reviews.length > 0) {
          venue.venue_reviews.forEach((review) => {
            allReviews.push({
              _id: review._id,
              venue_name: venue.venue_name,
              venue_id: venue._id,
              venue_review_text: review.venue_review_text,
              venue_rating: review.venue_rating,
              venue_review_created_at: review.venue_review_created_at,
              user_id: review.user_id,
            });
          });
        }
      });

      // Sort by date (newest first)
      allReviews.sort(
        (a, b) =>
          new Date(b.venue_review_created_at) -
          new Date(a.venue_review_created_at)
      );

      res.json({ reviews: allReviews, total: allReviews.length });
    } catch (error) {
      res.status(500).json({ detail: error.message });
    }
  }
);

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
      const venue = await Venue.findById(req.params.venue_id);
      if (!venue) return res.status(404).json({ detail: "Venue not found" });

      // Delete associated image files
      const fs = require("fs");
      const path = require("path");

      const deleteImage = (imageUrl) => {
        if (imageUrl && imageUrl.includes("/images/")) {
          const filename = imageUrl.split("/images/")[1];
          const filePath = path.join(__dirname, "../images", filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      };

      // Delete all venue images
      if (venue.venue_images && venue.venue_images.length > 0) {
        venue.venue_images.forEach(deleteImage);
      }

      // Delete profile image if different from venue_images
      if (venue.venue_profile_image) {
        deleteImage(venue.venue_profile_image);
      }

      // Delete legacy venue_image if different
      if (venue.venue_image) {
        deleteImage(venue.venue_image);
      }

      // Delete the venue from database
      await Venue.findByIdAndDelete(req.params.venue_id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ detail: error.message });
    }
  }
);

module.exports = router;
