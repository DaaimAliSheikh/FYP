import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";

export const fetchCars = createAsyncThunk("cars/fetchAll", async () => {
  const response = await api.get("/cars");
  return response.data;
});

export const createCar = createAsyncThunk("cars/create", async (formData) => {
  const response = await api.post("/cars", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
});

export const deleteCar = createAsyncThunk("cars/delete", async (id) => {
  await api.delete(`/cars/${id}`);
  return id;
});

export const updateCar = createAsyncThunk(
  "cars/update",
  async ({ id, data }) => {
    const response = await api.patch(`/cars/${id}`, data);
    return response.data;
  }
);

const carSlice = createSlice({
  name: "cars",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createCar.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteCar.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.car_id !== action.payload);
      })
      .addCase(updateCar.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (c) => c.car_id === action.payload.car_id
        );
        if (index !== -1) state.items[index] = action.payload;
      });
  },
});

export default carSlice.reducer;
