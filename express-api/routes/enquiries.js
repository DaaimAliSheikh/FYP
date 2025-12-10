const express = require("express");
const router = express.Router();
const {
  Enquiry,
  Venue,
  Catering,
  Car,
  Photography,
  User,
} = require("../models");
const { sendEnquiryNotificationEmail } = require("../utils/emailService");

// Submit new enquiry
router.post("/", async (req, res) => {
  try {
    const {
      enquiry_name,
      enquiry_email,
      enquiry_phone,
      enquiry_message,
      vendor_type,
      vendor_id,
    } = req.body;

    // Validate required fields
    if (
      !enquiry_name ||
      !enquiry_email ||
      !enquiry_phone ||
      !enquiry_message ||
      !vendor_type ||
      !vendor_id
    ) {
      return res.status(400).json({
        detail:
          "All fields (name, email, phone, message, vendor_type, vendor_id) are required",
      });
    }

    // Validate vendor type
    const validVendorTypes = ["venue", "catering", "car_rental", "photography"];
    if (!validVendorTypes.includes(vendor_type)) {
      return res.status(400).json({
        detail: "Invalid vendor type",
      });
    }

    // Create new enquiry
    const enquiry = new Enquiry({
      enquiry_name,
      enquiry_email,
      enquiry_phone,
      enquiry_message,
      vendor_type,
      vendor_id,
      user_id: req.user?._id || null, // Optional: link to user if authenticated
    });

    await enquiry.save();

    // Get vendor details for email notification
    let vendor = null;
    let vendorEmail = null;
    let vendorName = "";

    try {
      // Find the vendor based on type and get their email
      switch (vendor_type) {
        case "venue":
          vendor = await Venue.findById(vendor_id).populate("user_id");
          vendorEmail = vendor?.user_id?.email;
          vendorName = vendor?.venue_name || "Venue";
          break;
        case "catering":
          vendor = await Catering.findById(vendor_id).populate("user_id");
          vendorEmail = vendor?.user_id?.email;
          vendorName = vendor?.catering_business_name || "Catering Service";
          break;
        case "car_rental":
          vendor = await Car.findById(vendor_id).populate("user_id");
          vendorEmail = vendor?.user_id?.email;
          vendorName = vendor?.car_brand || "Car Rental";
          break;
        case "photography":
          vendor = await Photography.findById(vendor_id).populate("user_id");
          vendorEmail = vendor?.user_id?.email;
          vendorName =
            vendor?.photography_business_name || "Photography Service";
          break;
      }

      // Send email notification to vendor if email found
      if (vendorEmail) {
        await sendEnquiryNotificationEmail(
          vendorEmail,
          vendorName,
          enquiry_name,
          enquiry_email,
          enquiry_phone,
          enquiry_message,
          vendor_type,
          enquiry._id
        );
      }
    } catch (emailError) {
      console.error("Failed to send enquiry notification email:", emailError);
      // Continue execution - don't fail the enquiry submission due to email issues
    }

    res.status(201).json({
      message: "Enquiry submitted successfully",
      enquiry: {
        _id: enquiry._id,
        enquiry_name: enquiry.enquiry_name,
        enquiry_email: enquiry.enquiry_email,
        enquiry_phone: enquiry.enquiry_phone,
        enquiry_message: enquiry.enquiry_message,
        enquiry_status: enquiry.enquiry_status,
        enquiry_created_at: enquiry.enquiry_created_at,
        vendor_type: enquiry.vendor_type,
        vendor_id: enquiry.vendor_id,
      },
    });
  } catch (error) {
    console.error("Error submitting enquiry:", error);
    res.status(500).json({ detail: "Internal server error" });
  }
});

// Get enquiries for a vendor (with authentication)
router.get("/:vendor_type/:vendor_id", async (req, res) => {
  try {
    const { vendor_type, vendor_id } = req.params;
    const { status } = req.query;

    // Validate vendor type
    const validVendorTypes = ["venue", "catering", "car_rental", "photography"];
    if (!validVendorTypes.includes(vendor_type)) {
      return res.status(400).json({
        detail: "Invalid vendor type",
      });
    }

    // Build query
    const query = {
      vendor_type,
      vendor_id,
    };

    // Add status filter if provided
    if (status && ["open", "closed"].includes(status)) {
      query.enquiry_status = status;
    }

    const enquiries = await Enquiry.find(query)
      .populate("user_id", "username email")
      .sort({ enquiry_created_at: -1 });

    res.json({
      enquiries,
      total: enquiries.length,
    });
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    res.status(500).json({ detail: "Internal server error" });
  }
});

// Mark enquiry as closed
router.patch("/:enquiry_id/close", async (req, res) => {
  try {
    const { enquiry_id } = req.params;

    const enquiry = await Enquiry.findById(enquiry_id);

    if (!enquiry) {
      return res.status(404).json({ detail: "Enquiry not found" });
    }

    // Update enquiry status
    enquiry.enquiry_status = "closed";
    enquiry.enquiry_closed_at = new Date();
    await enquiry.save();

    res.json({
      message: "Enquiry marked as closed",
      enquiry: {
        _id: enquiry._id,
        enquiry_name: enquiry.enquiry_name,
        enquiry_email: enquiry.enquiry_email,
        enquiry_phone: enquiry.enquiry_phone,
        enquiry_message: enquiry.enquiry_message,
        enquiry_status: enquiry.enquiry_status,
        enquiry_created_at: enquiry.enquiry_created_at,
        enquiry_closed_at: enquiry.enquiry_closed_at,
        vendor_type: enquiry.vendor_type,
        vendor_id: enquiry.vendor_id,
      },
    });
  } catch (error) {
    console.error("Error closing enquiry:", error);
    res.status(500).json({ detail: "Internal server error" });
  }
});

// Mark enquiry as open (reopen)
router.patch("/:enquiry_id/open", async (req, res) => {
  try {
    const { enquiry_id } = req.params;

    const enquiry = await Enquiry.findById(enquiry_id);

    if (!enquiry) {
      return res.status(404).json({ detail: "Enquiry not found" });
    }

    // Update enquiry status
    enquiry.enquiry_status = "open";
    enquiry.enquiry_closed_at = null;
    await enquiry.save();

    res.json({
      message: "Enquiry marked as open",
      enquiry: {
        _id: enquiry._id,
        enquiry_name: enquiry.enquiry_name,
        enquiry_email: enquiry.enquiry_email,
        enquiry_phone: enquiry.enquiry_phone,
        enquiry_message: enquiry.enquiry_message,
        enquiry_status: enquiry.enquiry_status,
        enquiry_created_at: enquiry.enquiry_created_at,
        enquiry_closed_at: enquiry.enquiry_closed_at,
        vendor_type: enquiry.vendor_type,
        vendor_id: enquiry.vendor_id,
      },
    });
  } catch (error) {
    console.error("Error reopening enquiry:", error);
    res.status(500).json({ detail: "Internal server error" });
  }
});

// Get single enquiry details
router.get("/details/:enquiry_id", async (req, res) => {
  try {
    const { enquiry_id } = req.params;

    const enquiry = await Enquiry.findById(enquiry_id).populate(
      "user_id",
      "username email"
    );

    if (!enquiry) {
      return res.status(404).json({ detail: "Enquiry not found" });
    }

    res.json({ enquiry });
  } catch (error) {
    console.error("Error fetching enquiry details:", error);
    res.status(500).json({ detail: "Internal server error" });
  }
});

module.exports = router;
