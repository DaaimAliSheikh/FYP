import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";

export const fetchDecorations = createAsyncThunk(
  "decorations/fetchAll",
  async () => {
    const response = await api.get("/decorations");
    return response.data;
  }
);

export const createDecoration = createAsyncThunk(
  "decorations/create",
  async (formData) => {
    const response = await api.post("/decorations", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
);

export const deleteDecoration = createAsyncThunk(
  "decorations/delete",
  async (id) => {
    await api.delete(`/decorations/${id}`);
    return id;
  }
);

const decorationSlice = createSlice({
  name: "decorations",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDecorations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDecorations.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchDecorations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createDecoration.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteDecoration.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (d) => d.decoration_id !== action.payload
        );
      });
  },
});

export default decorationSlice.reducer;
