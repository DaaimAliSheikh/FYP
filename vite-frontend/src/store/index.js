import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import venueReducer from "./slices/venueSlice";
import cateringReducer from "./slices/cateringSlice";
import dishReducer from "./slices/dishSlice";
import photographyReducer from "./slices/photographySlice";
import carReducer from "./slices/carSlice";
import promoReducer from "./slices/promoSlice";
import bookingReducer from "./slices/bookingSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    venues: venueReducer,
    caterings: cateringReducer,
    dishes: dishReducer,
    photography: photographyReducer,
    cars: carReducer,
    promos: promoReducer,
    bookings: bookingReducer,
  },
});

export default store;
