import { createAsyncThunk, createSlice, } from "@reduxjs/toolkit";
import type { Product } from "../../pages/product/productCard";
import axiosInstance from "../../api/axiosInstance";

interface ProductState {
  product: Product[];
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState:ProductState = {
    product:[],
    loading: false,
    error: null,
    success:null
}

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/products");
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

export const createProductThunk = createAsyncThunk(
  "product/createProduct",
  async (data: FormData, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/products", data,{
        headers:{
           "Content-Type": "multipart/form-data",
        }
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateProductThunk = createAsyncThunk(
  "product/updateProduct",
  async (
    { id, data }: {
      id: string;
      data:FormData
    },
    thunkAPI
  ) => {
    try {
      const response = await axiosInstance.put(`/products/${id}`, data,{
        headers:{
           "Content-Type": "multipart/form-data",
        }
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteProductThunk = createAsyncThunk(
  "product/deleteProduct",
  async (id: string, thunkAPI) => {
    try {
      await axiosInstance.delete(`/products/${id}`);
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

export const filterProductThunk = createAsyncThunk(
  "product/filterProduct",
  async (params: {
    name?: string;
    createdAt?: Date;
    minStock?: number;
    isAvailable?: boolean;
    maxStock?: number;
  }, thunkAPI) => {
    try {
      // Filter out empty/default values to keep query clean
      const queryParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => {
          if (value === undefined || value === null) return false;
          if (typeof value === "string" && value === "") return false;
          return true;
        })
      );

      const response = await axiosInstance.get("/products/filter", {
        params: queryParams,
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // GET
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // CREATE
      .addCase(createProductThunk.fulfilled, (state, action) => {
        state.product.unshift(action.payload);
        state.success = "Product added successfully";
      })

      // UPDATE
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        const index = state.product.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) state.product[index] = action.payload;
         state.success = "Product updated successfully"; 
      })

      // DELETE
      .addCase(deleteProductThunk.fulfilled, (state, action) => {
        state.product = state.product.filter(
          (p) => p._id !== action.payload
        );
      })

      // FILTER
      .addCase(filterProductThunk.fulfilled, (state, action) => {
        state.product = action.payload;
      });
  },
});

export default productSlice.reducer;