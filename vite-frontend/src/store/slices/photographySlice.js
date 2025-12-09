import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";

export const fetchPhotography = createAsyncThunk(
  "photography/fetchAll",
  async () => {
    const response = await api.get("/photography");
    return response.data;
  }
);

export const createPhotography = createAsyncThunk(
  "photography/create",
  async (formData) => {
    const response = await api.post("/photography", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
);

export const deletePhotography = createAsyncThunk(
  "photography/delete",
  async (id) => {
    await api.delete(`/photography/${id}`);
    return id;
  }
);

const photographySlice = createSlice({
  name: "photography",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPhotography.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPhotography.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPhotography.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createPhotography.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deletePhotography.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export default photographySlice.reducer;
