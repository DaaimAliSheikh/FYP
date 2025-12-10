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
      vendor_item_id,
    } = req.body;

    // Validate required fields
    if (
      !enquiry_name ||
      !enquiry_email ||
      !enquiry_phone ||
      !enquiry_message ||
      !vendor_type ||
      !vendor_item_id
    ) {
      return res.status(400).json({
        detail:
          "All fields (name, email, phone, message, vendor_type, vendor_item_id) are required",
      });
    }

    // Validate vendor type
    const validVendorTypes = ["venue", "catering", "car_rental", "photography"];
    if (!validVendorTypes.includes(vendor_type)) {
      return res.status(400).json({
        detail: "Invalid vendor type",
      });
    }

    // Get vendor item details and owner info for email notification
    let vendorItem = null;
    let vendorEmail = null;
    let vendorName = "";
    let vendorUserId = null;

    try {
      // Find the vendor item based on type and get owner's email
      switch (vendor_type) {
        case "venue":
          vendorItem = await Venue.findById(vendor_item_id).populate("user_id");
          vendorEmail = vendorItem?.user_id?.email;
          vendorName = vendorItem?.venue_name || "Venue";
          vendorUserId = vendorItem?.user_id?._id;
          break;
        case "catering":
          vendorItem = await Catering.findById(vendor_item_id).populate(
            "user_id"
          );
          vendorEmail = vendorItem?.user_id?.email;
          vendorName = vendorItem?.catering_business_name || "Catering Service";
          vendorUserId = vendorItem?.user_id?._id;
          break;
        case "car_rental":
          vendorItem = await Car.findById(vendor_item_id).populate("user_id");
          vendorEmail = vendorItem?.user_id?.email;
          vendorName = vendorItem?.car_brand || "Car Rental";
          vendorUserId = vendorItem?.user_id?._id;
          break;
        case "photography":
          vendorItem = await Photography.findById(vendor_item_id).populate(
            "user_id"
          );
          vendorEmail = vendorItem?.user_id?.email;
          vendorName =
            vendorItem?.photography_business_name || "Photography Service";
          vendorUserId = vendorItem?.user_id?._id;
          break;
      }

      if (!vendorUserId) {
        return res.status(404).json({
          detail: "Vendor item not found or has no owner",
        });
      }

      // Create new enquiry with vendor's user_id
      const enquiry = new Enquiry({
        enquiry_name,
        enquiry_email,
        enquiry_phone,
        enquiry_message,
        vendor_type,
        vendor_item_id,
        user_id: vendorUserId,
      });

      await enquiry.save();

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
          vendor_item_id: enquiry.vendor_item_id,
          user_id: enquiry.user_id,
        },
      });
    } catch (emailError) {
      console.error(
        "Failed to send enquiry notification or create enquiry:",
        emailError
      );
      return res.status(500).json({
        detail:
          "Failed to submit enquiry. Please check if the vendor item exists.",
      });
    }
  } catch (error) {
    console.error("Error submitting enquiry:", error);
    res.status(500).json({ detail: "Internal server error" });
  }
});

// Get enquiries for a vendor by user_id
router.get("/vendor/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const { status, vendor_type } = req.query;

    // Build query
    const query = {
      user_id,
    };

    // Add vendor type filter if provided
    if (vendor_type) {
      const validVendorTypes = [
        "venue",
        "catering",
        "car_rental",
        "photography",
      ];
      if (!validVendorTypes.includes(vendor_type)) {
        return res.status(400).json({
          detail: "Invalid vendor type",
        });
      }
      query.vendor_type = vendor_type;
    }

    // Add status filter if provided
    if (status && ["open", "closed"].includes(status)) {
      query.enquiry_status = status;
    }

    const enquiries = await Enquiry.find(query)
      .populate("user_id", "username email")
      .sort({ enquiry_created_at: -1 });

    // Populate vendor item names
    const enrichedEnquiries = await Promise.all(
      enquiries.map(async (enquiry) => {
        let vendorItemName = "Unknown";
        try {
          switch (enquiry.vendor_type) {
            case "venue":
              const venue = await Venue.findById(enquiry.vendor_item_id);
              vendorItemName = venue?.venue_name || "Unknown Venue";
              break;
            case "catering":
              const catering = await Catering.findById(enquiry.vendor_item_id);
              vendorItemName =
                catering?.catering_business_name || "Unknown Catering";
              break;
            case "car_rental":
              const car = await Car.findById(enquiry.vendor_item_id);
              vendorItemName = car?.car_brand || "Unknown Car";
              break;
            case "photography":
              const photography = await Photography.findById(
                enquiry.vendor_item_id
              );
              vendorItemName =
                photography?.photography_business_name || "Unknown Photography";
              break;
          }
        } catch (err) {
          console.error("Error fetching vendor item name:", err);
        }

        return {
          ...enquiry.toObject(),
          vendor_item_name: vendorItemName,
        };
      })
    );

    res.json({
      enquiries: enrichedEnquiries,
      total: enrichedEnquiries.length,
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
        vendor_item_id: enquiry.vendor_item_id,
        user_id: enquiry.user_id,
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
        vendor_item_id: enquiry.vendor_item_id,
        user_id: enquiry.user_id,
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
