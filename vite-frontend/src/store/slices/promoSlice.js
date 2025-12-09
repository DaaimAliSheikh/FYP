import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";

export const fetchPromos = createAsyncThunk("promos/fetchAll", async () => {
  const response = await api.get("/promos");
  return response.data;
});

export const createPromo = createAsyncThunk("promos/create", async (data) => {
  const response = await api.post("/promos", data);
  return response.data;
});

export const deletePromo = createAsyncThunk("promos/delete", async (id) => {
  await api.delete(`/promos/${id}`);
  return id;
});

const promoSlice = createSlice({
  name: "promos",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPromos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPromos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPromos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createPromo.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deletePromo.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.promo_id !== action.payload);
      });
  },
});

export default promoSlice.reducer;
