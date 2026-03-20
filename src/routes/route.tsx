import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignIn } from "../pages/auth/signIn";
import { SignUp } from "../pages/auth/signUp";
import { Navbar } from "../layout/navbar";
import { ProductList } from "../pages/product/productList";
import { ProtectedRoute } from "../commponent/ProtectedRoute";

export const Routing = ()=>{
    return (
        <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route element={<ProtectedRoute/>}>
        <Route path="/dashboard"  element={<Navbar/>}>
           <Route index element={<Navigate to="products" replace />} />
           <Route path="products" element={<ProductList />} />
        </Route>
        </Route>
      </Routes>
    </BrowserRouter>
    )
}