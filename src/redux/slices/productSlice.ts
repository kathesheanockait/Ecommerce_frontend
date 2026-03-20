import { createSlice, } from "@reduxjs/toolkit";
import type { Product } from "../../pages/product/productCard";

interface ProductState {
  product: Product[];
}

const initialState:ProductState = {
    product:[]
}

const productSlice =createSlice({
    name:'product',
    initialState,
    reducers:{
       setProduct:(state,action)=>{
         state.product =action.payload
       },
       addProduct:(state,action)=>{
         state.product.unshift(action.payload)
       },
       deleteProduct:(state,action)=>{
         state.product = state.product.filter(p=>p._id !== action.payload)
       },
       updateProduct:(state,action)=>{
       const index = state.product.findIndex(p => p._id === action.payload._id);
      if (index !== -1) state.product[index] = action.payload;
       }
    }
})

export const {addProduct,deleteProduct,setProduct,updateProduct}= productSlice.actions;

export default productSlice.reducer;