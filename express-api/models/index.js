const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  is_admin: { type: Boolean, default: false },
  role: {
    type: String,
    enum: ["user", "vendor"],
    default: "user",
  },
  vendor_type: {
    type: String,
    enum: ["venue", "car_rental", "catering", "photography", null],
    default: null,
  },
  is_verified: { type: Boolean, default: false },
  verification_token: { type: String, default: null },
  verification_token_expires: { type: Date, default: null },
  reset_password_token: { type: String, default: null },
  reset_password_token_expires: { type: Date, default: null },
});

const userContactSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  user_contact_number: { type: String, required: true },
});
userContactSchema.index(
  { user_id: 1, user_contact_number: 1 },
  { unique: true }
);

const venueReviewSchema = new mongoose.Schema({
  venue_review_text: { type: String, required: true, maxlength: 1000 },
  venue_review_created_at: { type: Date, default: Date.now },
  venue_rating: { type: Number, required: true, min: 1 },
  venue_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Venue",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const venueSchema = new mongoose.Schema({
  venue_name: { type: String, required: true },
  venue_address: { type: String, required: true },
  venue_capacity: { type: Number, required: true, min: 1 },
  venue_price_per_day: { type: Number, required: true, min: 0 },
  venue_image: { type: String },
});

const dishSchema = new mongoose.Schema({
  dish_name: { type: String, required: true },
  dish_description: { type: String, required: true, maxlength: 1000 },
  dish_type: {
    type: String,
    enum: ["starter", "main", "dessert"],
    default: "main",
  },
  dish_image: { type: String },
  dish_cost_per_serving: { type: Number, required: true, min: 0 },
});

const cateringMenuItemSchema = new mongoose.Schema({
  catering_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Catering",
    required: true,
  },
  dish_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dish",
    required: true,
  },
});
cateringMenuItemSchema.index({ catering_id: 1, dish_id: 1 }, { unique: true });

const cateringSchema = new mongoose.Schema({
  catering_name: { type: String, required: true },
  catering_description: { type: String, required: true, maxlength: 1000 },
  catering_image: { type: String },
});

const photographySchema = new mongoose.Schema({
  photographer_name: { type: String, required: true },
  photographer_price: { type: Number, required: true, min: 0 },
  photographer_description: { type: String, required: true },
  photographer_image: { type: String },
  photographer_portfolio_url: { type: String },
});

const carSchema = new mongoose.Schema({
  car_make: { type: String, required: true },
  car_model: { type: String, required: true },
  car_year: {
    type: Number,
    required: true,
    min: 1886,
    max: new Date().getFullYear() + 1,
  },
  car_rental_price: { type: Number, required: true, min: 0 },
  car_image: { type: String },
  car_quantity: { type: Number, required: true, min: 0 },
});

const promoSchema = new mongoose.Schema({
  promo_name: { type: String, required: true },
  promo_expiry: { type: Date, required: true },
  promo_discount: { type: Number, required: true, min: 0 },
});

const carReservationSchema = new mongoose.Schema({
  car_id: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
  booking_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
});

const paymentSchema = new mongoose.Schema({
  amount_payed: { type: Number, required: true, min: 0 },
  discount: { type: Number, required: true, min: 0 },
  total_amount: { type: Number, required: true, min: 0 },
  payment_method: {
    type: String,
    enum: ["debit_card", "credit_card", "easypaisa", "jazzcash", "other"],
    default: "debit_card",
  },
  booking_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
});

const bookingSchema = new mongoose.Schema({
  booking_date: { type: Date, default: Date.now },
  booking_event_date: { type: Date, required: true },
  booking_guest_count: { type: Number, required: true, min: 1 },
  booking_status: {
    type: String,
    enum: ["pending", "confirmed", "declined"],
    default: "pending",
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  venue_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Venue",
    required: true,
  },
  catering_id: { type: mongoose.Schema.Types.ObjectId, ref: "Catering" },
  photography_id: { type: mongoose.Schema.Types.ObjectId, ref: "Photography" },
  promo_id: { type: mongoose.Schema.Types.ObjectId, ref: "Promo" },
});
bookingSchema.index({ venue_id: 1, booking_event_date: 1 }, { unique: true });

module.exports = {
  User: mongoose.model("User", userSchema),
  UserContact: mongoose.model("UserContact", userContactSchema),
  Venue: mongoose.model("Venue", venueSchema),
  VenueReview: mongoose.model("VenueReview", venueReviewSchema),
  Dish: mongoose.model("Dish", dishSchema),
  Catering: mongoose.model("Catering", cateringSchema),
  CateringMenuItem: mongoose.model("CateringMenuItem", cateringMenuItemSchema),
  Photography: mongoose.model("Photography", photographySchema),
  Car: mongoose.model("Car", carSchema),
  Promo: mongoose.model("Promo", promoSchema),
  CarReservation: mongoose.model("CarReservation", carReservationSchema),
  Payment: mongoose.model("Payment", paymentSchema),
  Booking: mongoose.model("Booking", bookingSchema),
};
