import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";

export const fetchDishes = createAsyncThunk("dishes/fetchAll", async () => {
  const response = await api.get("/caterings/dishes");
  return response.data;
});

export const createDish = createAsyncThunk(
  "dishes/create",
  async (formData) => {
    const response = await api.post("/caterings/dishes", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
);

export const deleteDish = createAsyncThunk("dishes/delete", async (id) => {
  await api.delete(`/caterings/dishes/${id}`);
  return id;
});

const dishSlice = createSlice({
  name: "dishes",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDishes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDishes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchDishes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createDish.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteDish.fulfilled, (state, action) => {
        state.items = state.items.filter((d) => d.dish_id !== action.payload);
      });
  },
});

export default dishSlice.reducer;
