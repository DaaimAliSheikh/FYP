import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";

export const fetchCaterings = createAsyncThunk(
  "caterings/fetchAll",
  async () => {
    const response = await api.get("/caterings");
    return response.data;
  }
);

export const createCatering = createAsyncThunk(
  "caterings/create",
  async (formData) => {
    const response = await api.post("/caterings", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
);

export const deleteCatering = createAsyncThunk(
  "caterings/delete",
  async (id) => {
    await api.delete(`/caterings/${id}`);
    return id;
  }
);

export const addMenuItemToCatering = createAsyncThunk(
  "caterings/addMenuItem",
  async (data) => {
    const response = await api.post("/caterings/menu-items", data);
    return response.data;
  }
);

export const removeMenuItemFromCatering = createAsyncThunk(
  "caterings/removeMenuItem",
  async ({ cateringId, dishId }) => {
    await api.delete(`/caterings/menu-items/${cateringId}/${dishId}`);
    return { cateringId, dishId };
  }
);

const cateringSlice = createSlice({
  name: "caterings",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCaterings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCaterings.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCaterings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createCatering.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteCatering.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c._id !== action.payload);
      });
  },
});

export default cateringSlice.reducer;
