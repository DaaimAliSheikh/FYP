import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";

export const fetchVenues = createAsyncThunk("venues/fetchAll", async () => {
  const response = await api.get("/venues");
  return response.data;
});

export const createVenue = createAsyncThunk(
  "venues/create",
  async (formData) => {
    const response = await api.post("/venues", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
);

export const deleteVenue = createAsyncThunk("venues/delete", async (id) => {
  await api.delete(`/venues/${id}`);
  return id;
});

export const fetchVenueReviews = createAsyncThunk(
  "venues/fetchReviews",
  async (venueId) => {
    const response = await api.get(`/venues/reviews/${venueId}`);
    return response.data;
  }
);

export const createVenueReview = createAsyncThunk(
  "venues/createReview",
  async ({ venueId, reviewData }) => {
    const response = await api.post(`/venues/reviews/${venueId}`, reviewData);
    return response.data;
  }
);

const venueSlice = createSlice({
  name: "venues",
  initialState: { items: [], reviews: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVenues.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVenues.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchVenues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createVenue.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteVenue.fulfilled, (state, action) => {
        state.items = state.items.filter((v) => v._id !== action.payload);
      })
      .addCase(fetchVenueReviews.fulfilled, (state, action) => {
        state.reviews = action.payload;
      });
  },
});

export default venueSlice.reducer;
