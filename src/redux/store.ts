import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import cardReducer from "./slices/cartSlice";
import productReducer from "./slices/productSlice";

export const store = configureStore({
    reducer:{
        auth:authReducer,
        cart:cardReducer,
        product:productReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;