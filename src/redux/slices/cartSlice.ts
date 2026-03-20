import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../../pages/product/productCard";


interface CartState {
   items:Product[];
}

const initialState:CartState ={
   items:[]
}

const cartSlice = createSlice({
    name:'cart',
    initialState,
    reducers:{
      addCart:(state, action:PayloadAction<Product>)=>{
         state.items.push(action.payload)
      }
    }
})

export const {addCart} = cartSlice.actions;
export default cartSlice.reducer;