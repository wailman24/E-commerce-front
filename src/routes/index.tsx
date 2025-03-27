//import React from "react";
//import { Home } from "lucide-react";
import { Route, Routes } from "react-router-dom";
import Login from "../pages/auth/login";
import Signup from "../pages/auth/signup";
import Home from "../pages/home";
import { useContext } from "react";
import { AppContext } from "../Context/AppContext";
function AppRoutes() {
  const appContext = useContext(AppContext); // Handle null case properly

  if (!appContext) {
    throw new Error("SignupForm must be used within an AppProvider");
  }
  const { user } = appContext;

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={user ? <Home /> : <Login />} />
        <Route path="/signup" element={user ? <Home /> : <Signup />} />
      </Routes>
    </>
  );
}

export default AppRoutes;
