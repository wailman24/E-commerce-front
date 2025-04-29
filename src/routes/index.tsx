//import React from "react";
//import { Home } from "lucide-react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "../pages/auth/login";
import Signup from "../pages/auth/signup";
import Home from "../pages/main/home";
import { useContext } from "react";
import { AppContext } from "../Context/AppContext";
import MainLayout from "../layouts/MainLayout";
import Products from "../pages/main/products";
import ShoppingCartPage from "../pages/main/shoppingcarts";
import Wishlist from "../pages/main/wishlist";
import BecomeSeller from "../pages/main/becomeseller";
import SellerLayout from "../layouts/SellerLayout";
import DashboardHome from "../pages/dashboard/sellerdahsboard";

//import EmailVerification from "../components/auth/verity-email";
function AppRoutes() {
  const appContext = useContext(AppContext); // Handle null case properly

  if (!appContext) {
    throw new Error("SignupForm must be used within an AppProvider");
  }
  const { user } = appContext;

  return (
    <>
      <Routes>
        {!user && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}
        {user && (
          <>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/cart" element={<ShoppingCartPage />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/becomeseller" element={<BecomeSeller />} />
              {/* Add more protected routes here */}
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Route>
            <Route element={<SellerLayout />}>
              <Route path="/sellerdash" element={<DashboardHome />} />
            </Route>
          </>
        )}

        {/*  <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </>
  );
}

export default AppRoutes;
