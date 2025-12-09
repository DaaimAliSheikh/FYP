import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";

export const fetchBookings = createAsyncThunk("bookings/fetchAll", async () => {
  const response = await api.get("/bookings");
  return response.data;
});

export const fetchMyBookings = createAsyncThunk(
  "bookings/fetchMy",
  async () => {
    const response = await api.get("/bookings/me");
    return response.data;
  }
);

export const createBooking = createAsyncThunk(
  "bookings/create",
  async (data) => {
    const response = await api.post("/bookings", data);
    return response.data;
  }
);

export const updateBooking = createAsyncThunk(
  "bookings/update",
  async ({ id, data }) => {
    const response = await api.patch(`/bookings/${id}`, data);
    return response.data;
  }
);

export const deleteBooking = createAsyncThunk("bookings/delete", async (id) => {
  await api.delete(`/bookings/${id}`);
  return id;
});

const bookingSlice = createSlice({
  name: "bookings",
  initialState: { items: [], myBookings: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.myBookings = action.payload;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (b) => b.booking_id === action.payload.booking_id
        );
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (b) => b.booking_id !== action.payload
        );
      });
  },
});

export default bookingSlice.reducer;
