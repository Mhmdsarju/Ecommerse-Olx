import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../api/axios";




export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/products");
      return res.data.products;
    } catch {
      return rejectWithValue("Failed to fetch products");
    }
  }
);


export const addProductToDB = createAsyncThunk(
  "products/add",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/products/add", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.product;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);


export const updateProductInDB = createAsyncThunk(
  "products/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/products/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.product;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const checkoutProducts = createAsyncThunk(
  "products/checkout",
  async (ids, { rejectWithValue }) => {
    try {
      await api.put("/products/checkout", { productIds: ids });
      return ids;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);


const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
  
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })  .addCase(addProductToDB.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProductToDB.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(addProductToDB.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }).addCase(updateProductInDB.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductInDB.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
      })
      .addCase(updateProductInDB.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }).addCase(checkoutProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkoutProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map((p) =>
          action.payload.includes(p._id)
            ? { ...p, soldOut: true }
            : p
        );
      })
      .addCase(checkoutProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
