const express = require("express");
const { Booking, Payment, CarReservation, Car, Venue } = require("../models");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

const router = express.Router();

// Get all bookings (admin only)
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user_id", "username email")
      .populate("venue_id")
      .populate("catering_id")
      .populate("decoration_id")
      .populate("promo_id");

    const bookingsWithDetails = await Promise.all(
      bookings.map(async (booking) => {
        const payment = await Payment.findOne({ booking_id: booking._id });
        const carReservations = await CarReservation.find({
          booking_id: booking._id,
        }).populate("car_id");
        return {
          ...booking.toObject(),
          payment,
          car_reservations: carReservations,
        };
      })
    );

    res.json(bookingsWithDetails);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Get my bookings
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user_id: req.user._id })
      .populate("user_id", "username email")
      .populate("venue_id")
      .populate("catering_id")
      .populate("decoration_id")
      .populate("promo_id");

    const bookingsWithDetails = await Promise.all(
      bookings.map(async (booking) => {
        const payment = await Payment.findOne({ booking_id: booking._id });
        const carReservations = await CarReservation.find({
          booking_id: booking._id,
        }).populate("car_id");
        return {
          ...booking.toObject(),
          payment,
          car_reservations: carReservations,
        };
      })
    );

    res.json(bookingsWithDetails);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Get booking by ID
router.get("/:booking_id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.booking_id)
      .populate("user_id", "username email")
      .populate("venue_id")
      .populate("catering_id")
      .populate("decoration_id")
      .populate("promo_id");

    if (!booking) return res.status(404).json({ detail: "Booking not found" });

    const payment = await Payment.findOne({ booking_id: booking._id });
    const carReservations = await CarReservation.find({
      booking_id: booking._id,
    }).populate("car_id");

    res.json({
      ...booking.toObject(),
      payment,
      car_reservations: carReservations,
    });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Create booking with payment
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { booking, payment, car_ids } = req.body;

    // Check if venue is already booked on that date
    const eventDate = new Date(booking.booking_event_date);
    const startOfDay = new Date(eventDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(eventDate.setHours(23, 59, 59, 999));

    const existingBooking = await Booking.findOne({
      venue_id: booking.venue_id,
      booking_event_date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (existingBooking) {
      return res
        .status(400)
        .json({
          detail:
            "The chosen Venue is already reserved for another booking on the provided date",
        });
    }

    // Check venue capacity
    const venue = await Venue.findById(booking.venue_id);
    if (venue && booking.booking_guest_count > venue.venue_capacity) {
      return res
        .status(400)
        .json({ detail: "Guest count exceeds venue capacity" });
    }

    // Create booking
    const newBooking = await Booking.create({
      ...booking,
      user_id: req.user._id,
    });

    // Create payment
    await Payment.create({
      ...payment,
      booking_id: newBooking._id,
    });

    // Create car reservations if provided
    if (car_ids && car_ids.length > 0) {
      for (const car_id of car_ids) {
        await CarReservation.create({ car_id, booking_id: newBooking._id });
        await Car.findByIdAndUpdate(car_id, { $inc: { car_quantity: -1 } });
      }
    }

    // Fetch complete booking
    const completeBooking = await Booking.findById(newBooking._id)
      .populate("user_id", "username email")
      .populate("venue_id")
      .populate("catering_id")
      .populate("decoration_id")
      .populate("promo_id");

    const paymentData = await Payment.findOne({ booking_id: newBooking._id });
    const carReservations = await CarReservation.find({
      booking_id: newBooking._id,
    }).populate("car_id");

    res.status(201).json({
      ...completeBooking.toObject(),
      payment: paymentData,
      car_reservations: carReservations,
    });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Update booking with payment
router.patch("/:booking_id", async (req, res) => {
  try {
    const { booking, payment } = req.body;

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.booking_id,
      booking,
      { new: true }
    )
      .populate("user_id", "username email")
      .populate("venue_id")
      .populate("catering_id")
      .populate("decoration_id")
      .populate("promo_id");

    if (!updatedBooking)
      return res.status(404).json({ detail: "Booking not found" });

    // Update payment if exists
    if (payment) {
      await Payment.findOneAndUpdate(
        { booking_id: req.params.booking_id },
        payment
      );
    }

    const paymentData = await Payment.findOne({
      booking_id: updatedBooking._id,
    });
    const carReservations = await CarReservation.find({
      booking_id: updatedBooking._id,
    }).populate("car_id");

    res.json({
      ...updatedBooking.toObject(),
      payment: paymentData,
      car_reservations: carReservations,
    });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Delete booking
router.delete("/:booking_id", async (req, res) => {
  try {
    // Increment car quantities for reservations
    const carReservations = await CarReservation.find({
      booking_id: req.params.booking_id,
    });
    for (const reservation of carReservations) {
      await Car.findByIdAndUpdate(reservation.car_id, {
        $inc: { car_quantity: 1 },
      });
    }

    // Delete car reservations
    await CarReservation.deleteMany({ booking_id: req.params.booking_id });

    // Delete payment
    await Payment.deleteOne({ booking_id: req.params.booking_id });

    // Delete booking
    const deleted = await Booking.findByIdAndDelete(req.params.booking_id);
    if (!deleted) return res.status(404).json({ detail: "Booking not found" });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

module.exports = router;
