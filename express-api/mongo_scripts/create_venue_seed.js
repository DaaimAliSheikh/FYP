require("dotenv").config({ path: "../express-api/.env" });
const mongoose = require("mongoose");

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL not found in environment variables");
  process.exit(1);
}

// Define Venue Schema (matching the model)
const venueSchema = new mongoose.Schema(
  {
    venue_name: { type: String, required: true },
    venue_address: { type: String, required: true },
    venue_capacity: { type: Number, required: true, min: 1 },
    venue_price_per_day: { type: Number, required: true, min: 0 },
    venue_bio: { type: String, maxlength: 500 },
    venue_description: { type: String, maxlength: 2000 },
    venue_images: [{ type: String }],
    venue_profile_image: { type: String },
    venue_phone: { type: String },
    venue_email: { type: String },
    venue_indoor_capacity: { type: Number, min: 0 },
    venue_outdoor_capacity: { type: Number, min: 0 },
    venue_weekday_hours: { type: String },
    venue_weekend_hours: { type: String },
    venue_amenities: [{ type: String }],
    venue_special_features: [{ type: String }],
    venue_packages: [
      {
        package_name: { type: String, required: true },
        package_price: { type: Number, required: true, min: 0 },
        package_features: [{ type: String }],
      },
    ],
    venue_reviews: [
      {
        venue_review_text: { type: String, required: true, maxlength: 1000 },
        venue_review_created_at: { type: Date, default: Date.now },
        venue_rating: { type: Number, required: true, min: 1, max: 5 },
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
    venue_image: { type: String },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Venue = mongoose.model("Venue", venueSchema);

// Mock venue data with localhost placeholder images
const venueData = {
  venue_name: "Royal Gardens Wedding Venue",
  venue_address: "123 Garden Avenue, DHA Phase 5, Karachi",
  venue_capacity: 800,
  venue_price_per_day: 150000,
  
  venue_bio: "With over 15 years of experience in creating magical wedding moments, Royal Gardens has been the premier choice for couples seeking an enchanting venue. Our passionate team specializes in transforming dreams into reality with personalized service and attention to every detail.",
  
  venue_description: "Nestled in the heart of the city, Royal Gardens offers a perfect blend of elegance and natural beauty. Our venue features stunning architecture, manicured gardens, and world-class amenities that create the ideal backdrop for your special day. From intimate gatherings to grand celebrations, we provide flexible spaces that can be customized to match your vision.",
  
  venue_images: [
    "http://localhost:8000/images/venue-gallery-1.jpg",
    "http://localhost:8000/images/venue-gallery-2.jpg",
    "http://localhost:8000/images/venue-gallery-3.jpg",
    "http://localhost:8000/images/venue-gallery-4.jpg",
    "http://localhost:8000/images/venue-gallery-5.jpg",
    "http://localhost:8000/images/venue-gallery-6.jpg",
    "http://localhost:8000/images/venue-gallery-7.jpg",
  ],
  
  venue_profile_image: "http://localhost:8000/images/venue-profile.jpg",
  venue_image: "http://localhost:8000/images/venue-profile.jpg",
  
  venue_phone: "+92 300 1234567",
  venue_email: "info@royalgardens.com",
  
  venue_indoor_capacity: 300,
  venue_outdoor_capacity: 500,
  
  venue_weekday_hours: "9:00 AM - 11:00 PM",
  venue_weekend_hours: "8:00 AM - 12:00 AM",
  
  venue_amenities: [
    "High-Speed WiFi",
    "Valet Parking",
    "Sound System",
    "Photography Area",
    "Catering Kitchen",
    "Climate Control",
    "Bridal Suite",
  ],
  
  venue_special_features: [
    "Panoramic city skyline views",
    "Indoor/outdoor ceremony options",
    "Professional event coordination",
    "On-site catering services",
    "Customizable lighting systems",
    "Wheelchair accessible",
    "Security personnel",
    "Guest accommodation arrangements",
  ],
  
  venue_packages: [
    {
      package_name: "Premium Package",
      package_price: 250000,
      package_features: [
        "Full venue access",
        "Decoration setup",
        "Sound system",
        "Valet parking",
        "Bridal suite",
      ],
    },
    {
      package_name: "Standard Package",
      package_price: 180000,
      package_features: [
        "Venue access",
        "Basic decoration",
        "Sound system",
        "Parking",
      ],
    },
    {
      package_name: "Basic Package",
      package_price: 120000,
      package_features: ["Venue access", "Basic amenities"],
    },
  ],
  
  venue_reviews: [],
  
  user_id: "6939e2931420e4481ea02064",
};

async function createVenue() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(DATABASE_URL);
    console.log("Connected to MongoDB successfully!");

    // Check if venue already exists for this user
    const existingVenue = await Venue.findOne({
      user_id: venueData.user_id,
      venue_name: venueData.venue_name,
    });

    if (existingVenue) {
      console.log("Venue already exists for this user. Skipping creation.");
      console.log("Existing Venue ID:", existingVenue._id);
    } else {
      // Create new venue
      const venue = new Venue(venueData);
      await venue.save();
      console.log("Venue created successfully!");
      console.log("Venue ID:", venue._id);
      console.log("Venue Name:", venue.venue_name);
    }
  } catch (error) {
    console.error("Error creating venue:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  }
}

// Run the migration
createVenue();
